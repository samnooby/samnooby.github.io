from flask import request, make_response
from flask_restful import Resource
from pathlib import Path
from io import StringIO
import os
import csv

from google.cloud import storage
from google.cloud.exceptions import NotFound, BadRequest

DEFAULT_BUCKET_NAME = "michelles_runners_storage"
RUNNER_DIR = "/runners"
storage_client = storage.Client()
bucket_name = os.environ.get('BUCKET_NAME',
                               DEFAULT_BUCKET_NAME)

try:
    bucket = storage_client.get_bucket(bucket_name)
    print("Got bucket {}".format(bucket.name))
except (BadRequest, NotFound) as e:
    bucket = storage_client.create_bucket(bucket_name, user_project="samnewbysite")
    print("Created bucket {} because {}".format(bucket.name, e))

class RunnerRoute(Resource):
    def get(self):
        ''' get returns the list of all runners '''
        
        # Gets each runners file and loads their runs
        cloud_runner_files = list(storage_client.list_blobs(bucket))
        runners = []
        for runner_file in cloud_runner_files:
            print(runner_file)
            with StringIO(runner_file.download_as_string().decode('utf-8')) as runner_str:
                print(runner_str.getvalue())
                runner_str.seek(0)
                csv_reader = csv.DictReader(runner_str)
                runner = {"name": runner_file.name[:-4], "runs": [], "total_ran": 0}
                for run in csv_reader:
                    print("Added run {}".format(run))
                    runner["total_ran"] += float(run["Distance"])
                    runner["runs"].append(run)
            runner["runs"].reverse()
            runners.append(runner)
        return runners

    def post(self):
        try:
            runner_name = request.form['name']
            print("here-1")
            if f'{runner_name}.runner' in list(storage_client.list_blobs(bucket)):
                return make_response("Runner already exists", 400)
            print("Here")
            with StringIO("") as new_runner_file:
                fieldnames = ['Date', 'Distance']
                writer = csv.DictWriter(new_runner_file, fieldnames=fieldnames)

                writer.writeheader()

                new_runner_file.seek(0)
                blob = bucket.blob(f'{runner_name}.csv')
                blob.upload_from_string(new_runner_file.getvalue(), content_type='text/csv')

        except Exception as e:
            return make_response("Could not create runner {}".format(e), 400)

        return make_response("Successfully made runner", 201)


class RunRoute(Resource):
    def get(self, runner_name):
        runs = []
        try:
            with StringIO(bucket.blob(f'{runner_name}.csv').download_as_string.decode("utf-8")) as runner_file:
                for row in runner_file:
                    runs.append(row)
        except Exception:
            pass
        return runs

    def post(self, runner_name):
        try:
            run_date = request.form['Date']
            run_length = float(request.form['Distance'])
            if run_date is None or run_length is None or run_length < 0:
                raise "None date or length"
            file_str = f'{runner_name}.csv'
            print(file_str)
            with StringIO(bucket.blob(file_str).download_as_string().decode("utf-8")) as runner_file:
                fields = ["Date", "Distance"]
                reader = csv.DictReader(runner_file)
                with StringIO("") as new_runner_flie:
                    writer = csv.DictWriter(new_runner_flie, fields)
                    writer.writeheader()
                    for row in reader:
                        print("Added run in run")
                        writer.writerow(row)
                    writer.writerow({"Date": run_date, "Distance": run_length})
    
                    blob = bucket.blob(f'{runner_name}.csv')
                    file_str = new_runner_flie.getvalue().__str__()
                print(file_str)
                blob.upload_from_string(file_str, content_type='text/csv')
        except IOError:
            return make_response("User does not exist", 400)
        except Exception as err:
            return make_response("Missing date or distance {}".format(err), 400)

        return make_response("Successfully made run", 201)


class DeleteRunRoute(Resource):
    def post(self, runner_name):
        try:
            run_date = request.form['Date']
            run_length = request.form['Distance']
            new_rows = []
            fields = ["Date", "Distance"]
            with StringIO(bucket.blob(f'{runner_name}.csv').download_as_string().decode("utf-8")) as runner_file:
                reader = csv.DictReader(runner_file)
                for row in reader:
                    if (row["Date"] != run_date or
                        row["Distance"] != run_length) and \
                            row["Date"] != "Date":
                        new_rows.append(row)
            with StringIO("") as new_runner_file:
                writer = csv.DictWriter(new_runner_file, fields)
                writer.writeheader()
                for row in new_rows:
                    writer.writerow(row)
                blob = bucket.blob(f'{runner_name}.csv')
                new_runner_file.seek(0)
                blob.upload_from_string(new_runner_file.getvalue(), content_type='text/csv')
            return new_rows
        except IOError:
            return make_response("User does not exist", 400)
        except Exception as err:
            return make_response("Missing date or distance {}".format(err), 400)

        return make_response("Deleted run", 200)
