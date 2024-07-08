from flask import redirect, g, flash, request
from flask_appbuilder.security.views import AuthDBView
from superset.security import SupersetSecurityManager
from flask_appbuilder.security.views import expose
from flask_login import login_user


class CustomAuthDBView(AuthDBView):
    login_template = 'appbuilder/general/security/login_db.html'

    @expose('/login/', methods=['GET', 'POST'])
    def login(self):
        redirect_url = self.appbuilder.get_url_for_index
        if request.args.get('redirect') is not None:
            redirect_url = request.args.get('redirect')

        username = request.args.get('username')

        if username:
            user = self.appbuilder.sm.find_user(username)
            login_user(user, remember=False)
            return redirect(redirect_url)

        elif g.user is not None and g.user.is_authenticated:
            return redirect(redirect_url)

        else:
            flash('Unable to auto-login', 'warning')
        
        # Ensure a valid response is returned even if none of the conditions above are met
        return super(CustomAuthDBView, self).login()

class CustomSecurityManager(SupersetSecurityManager):
    authdbview = CustomAuthDBView

    def __init__(self, appbuilder):
        super(CustomSecurityManager, self).__init__(appbuilder)


