from flask_restful import Resource
from flask import request
import os
import csv

RUNNER_DIR = "./Running/runners"

# Gets each runners file and loads their runs
runner_files = os.listdir(RUNNER_DIR)
runners = []
for runner_file in runner_files:
    with open(f'{RUNNER_DIR}/{runner_file}', mode="r") as csv_file:
        csv_reader = csv.DictReader(csv_file)

        runner = {"name": runner_file[:-4], "runs": []}

        for run in csv_reader:
            runner["runs"].append(run)
        runners.append(runner)


class RunnerRoute(Resource):
    def get(self):
        ''' get returns the list of all runners '''
        return runners

    def post(self):
        try:
            runner_name = request.form['name']
            print(runner_name)
        except Exception as exp:
            print(exp)
        return 200


class RunRoute(Resource):
    def get(self):
        return runners[0]
