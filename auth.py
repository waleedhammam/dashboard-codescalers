""" SOME COMMENTS HERE """
import requests, json

class Auth(object):
    """ SOME COMMENTS HERE """
    def __init__(self, login, password, state_url, cookie_url):
        """ SOME COMMENTS HERE """
        self.login = login
        self.password = password
        self.state_url = state_url
        self.cookie_url = cookie_url

    def get_state(self):
        """ SOME COMMENTS HERE """
        state_url = self.state_url

        state_url = requests.post(state_url)
        state=str(state_url.url.partition('state=')[2].split('&')[0])
        return state

    def get_cookie(self):
        """ SOME COMMENTS HERE """
        state = self.get_state()
        login = self.login
        password = self.password
        cookie_url = self.cookie_url

        cookie_url = requests.post(cookie_url, data= {'client_id': 'portal', 'redirect_url':'', 'response_type':'code', 'scope':'user', 'state': state,'login':login, 'password' :password}, headers={'Accept': 'application/json'})
        url = str(cookie_url.json()['url'])
        req = requests.get(url, allow_redirects=False)
        cookie = req.headers['Set-cookie'].split(';')[0]
        return cookie
