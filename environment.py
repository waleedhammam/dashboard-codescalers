""" SOME COMMENTS HERE """
import requests
from auth import Auth

class Environment(Auth):
    """ SOME COMMENTS HERE """
    def __init__(self, login, password, state_url, cookie_url, api_link, data):
        """ SOME COMMENTS HERE """
        super(Environment, self).__init__(login, password, state_url, cookie_url)
        self.api_link = api_link
        self.data = data
        self._cookie = None
    
    @property
    def cookie(self):
        if not self._cookie:
            self._cookie = self.get_cookie()
        return self._cookie
    
    @cookie.setter
    def cookie(self, val):
        self._cookie = val

    def request(self, *args, **kwargs):
            kwargs['Headers'] = kwargs.get('Headers', {})
            for i in range(2):
                kwargs['Headers']['Cookie'] = self.cookie
                result = self.get_details(self, *args, **kwargs)
                if result.status != 401:
                    return result
                else:
                    self.cookie = None
    
    def get_details(self, *args, **kwargs):
        api_url = self.api_link
        if self.data:
            result = requests.post(api_url, headers={'Cookie': self.cookie}, data={'nid': self.data})
        else:
            result = requests.get(api_url, headers={'Cookie': self.cookie})
        return result.text