from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from Running.MomRunning import RunnerRoute, RunRoute,\
    DeleteRunRoute


app = Flask(__name__)
CORS(app)
api = Api(app)

api.add_resource(RunnerRoute, "/runners")
api.add_resource(RunRoute, "/runs/<string:runner_name>")
api.add_resource(DeleteRunRoute, "/runs/<string:runner_name>/delete")

if __name__ == "__main__":
    app.run(port=8888)
