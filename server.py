""" SOME COMMENTS HERE """
from flask import Flask
from details import Details
import json, os

app = Flask(__name__)


""" Server API"""
def helper(api):
    """ Extract config data """
    with open('.config.json') as json_data_file:
        data = json.load(json_data_file)

    login_info = data['login_info']
    login = login_info['login']
    password = login_info['password']

    auth = data['auth']
    state_url = auth['state_url']
    cookie_url = auth['cookie_url']

    apis = data['apis']
    api_link = apis[api]

    details = Details(login, password, state_url, cookie_url, api_link)

    return details.get_details()

@app.route("/")
def main_page():
    """ SOME COMMENTS HERE """
    return 'main'

@app.route("/getDetailedStatus")
def getDetailedStatus(node):
    """ SOME COMMENTS HERE """
    return helper('getDetailedStatus' + node)

@app.route("/getStatusSummary")
def getStatusSummary():
    """ SOME COMMENTS HERE """
    return helper('getStatusSummary')

@app.route("/getOverallStatus")
def getOverallStatus():
    """ SOME COMMENTS HERE """
    return helper('getOverallStatus')

@app.route("/getHealthRun")
def getHealthRun():
    """ SOME COMMENTS HERE """
    return helper('getHealthRun')


""" SOME COMMENTS HERE """
if __name__ == "__main__":
    app.run(threaded=True)
