""" SOME COMMENTS HERE """
from flask import Flask, send_from_directory, render_template, Response, request
from details import Details
import json, os

app = Flask(__name__, template_folder="client")


""" Server API"""
def helper(api, nid):
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
    if api == 'getDetailedStatus':
        api_link = apis[api] + str(nid)
    else:
        api_link = apis[api]

    if api == "getHealthRun":
        details = Details(login, password, state_url, cookie_url, api_link, nid)
    else:
        details = Details(login, password, state_url, cookie_url, api_link, '')

    return details.get_details()

@app.route("/")
def main_page():
    return 'main_page'

@app.route("/getDetailedStatus", methods=["GET", "POST"])
def getDetailedStatus():
    """ SOME COMMENTS HERE """
    nid = request.args.get('nid_no')
    result = Response(helper('getDetailedStatus', nid))
    result.headers['Access-Control-Allow-Origin'] = '*'
    return result

@app.route("/getStatusSummary")
def getStatusSummary():
    """ SOME COMMENTS HERE """
    result = Response(helper('getStatusSummary', ''))
    result.headers['Access-Control-Allow-Origin'] = '*'
    return result

@app.route("/getOverallStatus")
def getOverallStatus():
    """ SOME COMMENTS HERE """
    result = Response(helper('getOverallStatus', ''))
    result.headers['Access-Control-Allow-Origin'] = '*'
    return result

@app.route("/getHealthRun", methods=["GET", "POST"])
def getHealthRun():
    """ SOME COMMENTS HERE """
    nid = request.args.get('nid_no')
    result = Response(helper('getHealthRun', nid))
    result.headers['Access-Control-Allow-Origin'] = '*'
    return result

""" SOME COMMENTS HERE """
if __name__ == "__main__":
    app.run(threaded=True)
