from flask import Flask, send_from_directory, render_template, request, jsonify, redirect,url_for
from environment import Environment
import json, os, requests, functools
from urllib.parse import urlparse, parse_qs, urlencode
from urllib.request import urlopen
from jose import jws

# Flask app
app = Flask(__name__, template_folder='ClientApp')

# Exposing client app folder to flask
BASE_URL = os.path.abspath(os.path.dirname(__file__))
CLIENT_APP_FOLDER = os.path.join(BASE_URL, "ClientApp")

@app.route('/app/<path:filename>')
def client_app_app_folder(filename):
    return send_from_directory(os.path.join(CLIENT_APP_FOLDER, "app"), filename)

@app.route('/client-app/<path:filename>')
def client_app_folder(filename):
    return send_from_directory(CLIENT_APP_FOLDER, filename)

# Initializations
environments = {}
with open('config.json') as json_data_file:
    data = json.load(json_data_file)
    # environments data
    envs = data['envs']
    login_url = data['apis']['login_url']
    env_list = []
    for env in envs :
        env_list.append(env)
        username = env['login']
        passwd = env['password']
        url = env['url']
        environments[env['name']] = Environment(username, passwd, login_url, url)
    # apis data
    apis = data['apis']
    # oauth data
    auth = data['auth']
    CLIENTID = auth['CLIENTID']
    REDIRECTURI = auth['REDIRECTURI']
    CLIENTSECRET = auth['CLIENTSECRET']
    PUBLICKEY = "".join(auth['PUBLICKEY'])
    ALGORITHM = auth['ALGORITHM']
    # host data
    host = data['host']
    host_ip = host['host_ip']
    host_port = host['host_port']

# Authentication
@app.route('/connect-auth')
def make_aouth():
    id = request.args.get('id')
    def login_to_idserver():
        from uuid import uuid4
        STATE = str(uuid4())
        params = {
            "response_type": "code",
            "client_id":CLIENTID,
            "redirect_uri":REDIRECTURI,
            "scope": "user:name",
            "state" : STATE
        }
        base_url = "https://itsyou.online/v1/oauth/authorize?"
        url = base_url + urlencode(params)
        return url
    login_url = login_to_idserver()
    return  redirect(login_url)

# make a jwt and return it
@app.route('/send_jwt')
def get_jwt():
    #get the access token
    def get_access_token():
        params = {
        "grant_type": "client_credentials",
        "client_id" : CLIENTID,
        "client_secret": CLIENTSECRET,
        }
        base_url = "https://itsyou.online/v1/oauth/access_token?"
        url = base_url + urlencode(params)
        response = requests.post(url, verify=False)
        response = response.json()
        access_token = response['access_token']
        return access_token
    access_token = get_access_token()
    base_url = "https://itsyou.online/v1/oauth/jwt"
    headers = {'Authorization': 'token %s' % access_token}
    data = {'scope': 'user:memberOf:%s' % CLIENTID}
    response = requests.post(base_url, data=json.dumps(data), headers=headers, verify=False)
    return '<html><script>window.opener.setJWT("%s"); window.close()</script></html>'%(response.content.decode(),)

@app.route("/callback")
def get_code():
    print('here code')
    code = request.args.get("code")
    if code :
        return redirect(url_for('get_jwt'))
    else :
        return False

# check jwt decorator
def check_jwt(fn):
    def verify_jwt(*args, **kwargs):
        try:
            jwt = request.headers.get("authorization").split(' ')[1]
            jws.verify(jwt, PUBLICKEY, algorithms=ALGORITHM)
            return fn(*args, **kwargs)
        except Exception as e:
            return '{}'
    functools.update_wrapper(verify_jwt, fn)
    return verify_jwt

# helper functions to server api
def helper(api, environment_name, data={}):
    """helper returns result as json object"""
    api_link = apis[api]
    env = environment_name
    d = data
    res = environments[environment_name].get_details(api_link, data)
    return res

def clean_detailed_status(detailed_status):
    """convert detailed status to lists to handle in angular2"""
    data = detailed_status['categories']
    res_data = []
    for category in data.keys():
        value = data[category]
        value['name'] = category
        res_data.append(value)
    return res_data

def get_machines_id():
    """get all macines ids"""
    status_summary = list(helper('getStatusSummary', '').values())
    ids = map(lambda machine : machine['nid'], status_summary)
    return ids

# getting environments details
@app.route("/")
def main_page():
    return render_template("index.html")

@app.route("/environments")
@check_jwt
def send_environments():
    envs = environments
    env_list = {}
    for env in envs.keys():
        env_item = helper('getOverallStatus', env)
        env_item['name'] = env
        env_item['url'] = envs[env].url
        env_item['status_summary'] = []
        env_list[env] = env_item
    return jsonify(env_list)

@app.route("/allDetails")
@check_jwt
def get_all_machines_details():
    ids = get_machines_id()
    all_details = dict()
    for i in ids :
        machine_details = helper('getDetailedStatus', i)
        machine_details = clean_detailed_status(machine_details)
        all_details[i] = machine_details
    return jsonify(all_details)

@app.route("/getOverallStatus")
@check_jwt
def getOverallStatus():
    environment = request.args.get('environment')
    temp = helper('getOverallStatus', environment)
    return jsonify(temp)

@app.route("/getStatusSummary")
@check_jwt
def getStatusSummary():
    environment = request.args.get('environment')
    machines = list(helper('getStatusSummary', environment).values())
    return jsonify(machines)

@app.route("/getDetailedStatus")
@check_jwt
def getDetailedStatus():
    environment = request.args.get('environment')
    nid = request.args.get('nid')
    temp = helper('getDetailedStatus',environment, {'nid':nid})
    res = clean_detailed_status(temp)
    return jsonify(res)

if __name__ == "__main__":
    import subprocess
    from time import sleep
    process = subprocess.Popen(["bash", "-c",
    """cd ClientApp; tsc -w"""])
    app.run(host=host_ip, port=host_port,  threaded=False)
    process.terminate()
    sleep(1)
    process.kill()
