""" SOME COMMENTS HERE """
from flask import Flask, send_from_directory, render_template, Response, request
from environment import Environment
import json, os

app = Flask(__name__, template_folder='ClientApp')

""" Exposing client app folder to flask"""
BASE_URL = os.path.abspath(os.path.dirname(__file__))
CLIENT_APP_FOLDER = os.path.join(BASE_URL, "ClientApp")

# This is required by zone.js as it need to access the
# "main.js" file in the "ClientApp\app" folder which it
# does by accessing "<your-site-path>/app/main.js"
@app.route('/app/<path:filename>')
def client_app_app_folder(filename):
    return send_from_directory(os.path.join(CLIENT_APP_FOLDER, "app"), filename)

# Custom static data
@app.route('/client-app/<path:filename>')
def client_app_folder(filename):
    return send_from_directory(CLIENT_APP_FOLDER, filename)

""""""

global name, base_url, username, passwd, state_url, cookie_url, apis
def init():
    """ Extract config data """
    global name, base_url, username, passwd, state_url, cookie_url, apis
    with open('config.json') as json_data_file:
        data = json.load(json_data_file)
    env = data['env']
    name = env['name']
    base_url = env['url']
    username = env['login']
    passwd = env['password']
    state_url = env['state_url']
    cookie_url = env['cookie_url']
    apis = env['apis']

init()


""" Server API"""
def helper(api, nid):
    if api == 'getDetailedStatus':
        api_link = apis[api] + str(nid)
    else:
        api_link = apis[api]

    if api == "getHealthRun":
        environment = Environment(username, passwd, state_url, cookie_url, api_link, nid)
    else:
        environment = Environment(username, passwd, state_url, cookie_url, api_link, '')

    return environment.get_details()

"""Server Functions"""

@app.route("/")
def main_page():
    return render_template("index.html")

@app.route("/getDetailedStatus", methods=["GET", "POST"])
def getDetailedStatus():
    """ SOME COMMENTS HERE """
    nid = request.args.get('nid_no')
    return helper('getDetailedStatus', nid)
     
@app.route("/getStatusSummary")
def getStatusSummary():
    """ SOME COMMENTS HERE """
    return helper('getStatusSummary', '')
     
@app.route("/getOverallStatus")
def getOverallStatus():
    """ SOME COMMENTS HERE """
    return helper('getOverallStatus', '')
     

@app.route("/getHealthRun", methods=["GET", "POST"])
def getHealthRun():
    """ SOME COMMENTS HERE """
    nid = request.args.get('nid_no')
    return helper('getHealthRun', nid)
     

""" SOME COMMENTS HERE """
if __name__ == "__main__":
    app.run(threaded=True)
