import requests, json

class Environment:
    def __init__(self, username, password, login_url, url):
        self.username = username
        self.password = password
        self.login_url = url+login_url 
        self.url = url
        self.session = self.authenticate()

    def authenticate(self):
        session = requests.Session()
        session.post(self.login_url, data={'name': self.username, 'secret':self.password})
        return session

    def get_details(self, api_link, data):
        result = self.session.post(self.url + api_link, data=data)
        try:
            return result.json()
        except:
            print('Erro hapependd at %s' % api_link)
            return {}
