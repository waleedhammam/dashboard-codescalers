import requests, json

class Environment:
    def __init__(self, username, password, login_url):
        self.username = username
        self.password = password
        self.login_url = login_url
        self.session = self.authenticate()

    def authenticate(self):
        session = requests.Session()
        session.post(self.login_url, data={'name': self.username, 'secret':self.password})
        return session

    def get_details(self, api_link, data):
        result = self.session.post(api_link, data={'nid': data})
        return result.json()