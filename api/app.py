from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from Running.MomRunning import RunnerRoute

app = Flask(__name__)
CORS(app)
api = Api(app)

api.add_resource(RunnerRoute, "/running")

if __name__ == "__main__":
    app.run(debug=True, port=8888)
