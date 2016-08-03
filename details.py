""" SOME COMMENTS HERE """
import requests
from auth import Auth

class Details(Auth):
    """ SOME COMMENTS HERE """
    def __init__(self, login, password, state_url, cookie_url, api_link):
        """ SOME COMMENTS HERE """
        super(Details, self).__init__(login, password, state_url, cookie_url)
        self.api_link = api_link

    def get_details(self):
        """ SOME COMMENTS HERE """
        cookie = self.get_cookie()
        api_url = self.api_link

        result = requests.get(api_url, headers={'Cookie': cookie})
        return result.text
