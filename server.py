from flask import Flask, send_from_directory, render_template, Response, request, jsonify
from environment import Environment
import json, os

app = Flask(__name__, template_folder='ClientApp')

""" Exposing client app folder to flask"""
BASE_URL = os.path.abspath(os.path.dirname(__file__))
CLIENT_APP_FOLDER = os.path.join(BASE_URL, "ClientApp")

@app.route('/app/<path:filename>')
def client_app_app_folder(filename):
    return send_from_directory(os.path.join(CLIENT_APP_FOLDER, "app"), filename)

@app.route('/client-app/<path:filename>')
def client_app_folder(filename):
    return send_from_directory(CLIENT_APP_FOLDER, filename)

global apis, environment
def init():

    global apis, environment
    with open('config.json') as json_data_file:
        data = json.load(json_data_file)
    env = data['env']
    username = env['login']
    passwd = env['password']
    login_url = env['login_url']
    apis = env['apis']

    environment = Environment(username, passwd, login_url)
    
init()


""" Server API"""
def helper(api, nid):
    api_link = apis[api] + str(nid)
    res = environment.get_details(api_link, nid)   
    return res
    
def clean_detailed_status(detailed_status):
    data = detailed_status['categories']
    res_data = []
    for category in data.keys():
        value = data[category]
        value['name'] = category
        res_data.append(value)
    return res_data


@app.route("/")
def main_page():
    return render_template("index.html")

@app.route("/getDetailedStatus")
def getDetailedStatus():
    nid = request.args.get('nid_no')
    temp = helper('getDetailedStatus', 1)
    res = clean_detailed_status(temp)
    return jsonify(res)
     
@app.route("/getStatusSummary")
def getStatusSummary():
    return jsonify(helper('getStatusSummary', '').values())
     
@app.route("/getOverallStatus")
def getOverallStatus():
    return jsonify(helper('getOverallStatus', ''))
     

@app.route("/getHealthRun")
def getHealthRun():
    nid = request.args.get('nid_no')
    return jsonify(helper('getHealthRun', nid))
     

if __name__ == "__main__":
    app.run(threaded=True)
