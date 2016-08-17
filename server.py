from flask import Flask, send_from_directory, render_template, request, jsonify
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

apis = None
environments = {}
def init():

    global apis, environments
    with open('config.json') as json_data_file:
        data = json.load(json_data_file)
        envs = data['envs']
        env_list = []
        for env in envs :
            env_list.append(env)
            username = env['login']
            passwd = env['password']
            login_url = env['login_url']
            url = env['url']

            environments[env['name']] = Environment(username, passwd, login_url, url)
        apis = data['apis']
        
    
init()

""" Server API"""
def helper(api, environment_name, data={}):
    api_link = apis[api]
    env = environment_name
    d = data

    res = environments[environment_name].get_details(api_link, data)   
    return res
    
def clean_detailed_status(detailed_status):
    data = detailed_status['categories']
    res_data = []
    for category in data.keys():
        value = data[category]
        value['name'] = category
        res_data.append(value)
    return res_data

def get_machines_id():
    status_summary = helper('getStatusSummary', '').values()
    ids = map(lambda machine : machine['nid'], status_summary)
    return ids    

@app.route("/allDetails")
def get_all_machines_details():
    ids = get_machines_id()
    all_details = dict()
    for i in ids :
        machine_details = helper('getDetailedStatus', i)
        machine_details = clean_detailed_status(machine_details)
        all_details[i] = machine_details
    return jsonify(all_details)

#sends the environments to the client 

@app.route("/")
def main_page():
    return render_template("index.html")

@app.route("/getDetailedStatus")
def getDetailedStatus():
    environment = request.args.get('environment')
    nid = request.args.get('nid')
    temp = helper('getDetailedStatus',environment, {'nid':nid})
    res = clean_detailed_status(temp)
    return jsonify(res)
     
@app.route("/getStatusSummary")
def getStatusSummary():
    environment = request.args.get('environment')
    machines = helper('getStatusSummary', environment).values()
    return jsonify(machines)
     
@app.route("/getOverallStatus")
def getOverallStatus():
    environment = request.args.get('environment')
    temp = helper('getOverallStatus', environment)
    return jsonify(temp)


@app.route("/environments")
def send_environments():
    envs = environments
    env_list = {}
    for env in envs.keys():
        env_item = helper('getOverallStatus', env)
        env_item['name'] = env
        env_item['status_summary'] = []
        env_list[env] = env_item
    return jsonify(env_list)
     
if __name__ == "__main__":
    import subprocess
    from time import sleep
    process = subprocess.Popen(["bash", "-c", 
    """cd ClientApp; tsc -w"""])
    app.run(host= '0.0.0.0', threaded=True)
    process.terminate()
    sleep(1)
    process.kill()
