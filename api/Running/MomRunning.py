from flask_restful import Resource
from flask import request, make_response
import os
import csv

RUNNER_DIR = "./Running/runners"


class RunnerRoute(Resource):
    def get(self):
        ''' get returns the list of all runners '''

        # Gets each runners file and loads their runs
        runner_files = os.listdir(RUNNER_DIR)
        runners = []
        for runner_file in runner_files:
            with open(f'{RUNNER_DIR}/{runner_file}', mode="r") as csv_file:
                csv_reader = csv.DictReader(csv_file)

                runner = {"name": runner_file[:-7], "runs": [], "total_ran": 0}

                for run in csv_reader:
                    runner["total_ran"] += int(run["Distance"])
                    runner["runs"].append(run)
                runners.append(runner)
        return runners

    def post(self):
        try:
            runner_name = request.form['name']
            print(f'{runner_name}.runner')
            print(os.listdir(RUNNER_DIR))
            if f'{runner_name}.runner' in os.listdir(RUNNER_DIR):
                return make_response("Runner already exists", 400)
            with open(f'{RUNNER_DIR}/{runner_name}.runner', mode="w")\
                    as new_runner_file:
                fieldnames = ['Date', 'Distance']
                writer = csv.DictWriter(new_runner_file, fieldnames=fieldnames)

                writer.writeheader()
        except Exception as exp:
            print(exp)
            return make_response("Could not create runner", 400)

        return make_response("Successfully made runner", 201)


class RunRoute(Resource):
    def get(self, runner_name):
        runs = []
        try:
            with open(f'{RUNNER_DIR}/{runner_name}.runner', 'r') \
                    as runner_file:
                for row in runner_file:
                    runs.append(row)
        except Exception as err:
            print(err)
        return runs

    def post(self, runner_name):
        try:
            run_date = request.form['Date']
            run_length = request.form['Distance']
            with open(f'{RUNNER_DIR}/{runner_name}.runner', "a") \
                    as runner_file:
                fields = ["Date", "Distance"]
                writer = csv.DictWriter(runner_file, fields)
                writer.writerow({"Date": run_date, "Distance": run_length})
        except IOError as err:
            print(err)
            return make_response("User does not exist", 400)
        except Exception as err:
            print(err)
            return make_response("Missing date or distance", 400)


class DeleteRunRoute(Resource):
    def post(self, runner_name):
        try:
            run_date = request.form['Date']
            run_length = request.form['Distance']
            new_rows = []
            fields = ["Date", "Distance"]
            with open(f'{RUNNER_DIR}/{runner_name}.runner', "r") \
                    as runner_file:
                reader = csv.DictReader(runner_file, fields)
                for row in reader:
                    if (row["Date"] != run_date or
                        row["Distance"] != run_length) and \
                            row["Date"] != "Date":
                        new_rows.append(row)
            print(new_rows)
            with open(f'{RUNNER_DIR}/{runner_name}.runner', "w") \
                    as runner_file:
                writer = csv.DictWriter(runner_file, fields)
                writer.writeheader()
                for row in new_rows:
                    writer.writerow(row)
            return new_rows
        except IOError as err:
            print(err)
            return make_response("User does not exist", 400)
        except Exception as err:
            print(err)
            return make_response("Missing date or distance", 400)
