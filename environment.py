import requests, json

class Environment:
    def __init__(self, username, password, login_url, url):
        self.username = username
        self.password = password
        self.login_url = url+login_url
        self.url = url
        self.session = self.authenticate()

    def authenticate(self):
        try:
            session = requests.Session()
            session.post(self.login_url, data={'name': self.username, 'secret':self.password})
            return session
        except:
            print("error at session %s" % self.login_url)


    def get_details(self, api_link, data):
        if self.session is not None :
            result = self.session.post(self.url + api_link, data=data)
        else:
            print('Can not open session at %s trying again ..' % api_link)
            self.session = self.authenticate()

        try:
            return result.json()
        except:
            print('Erro hapependd at %s' % api_link)
            return {}
