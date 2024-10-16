# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

import logging
import os
from typing import Optional

from flask import Flask

from superset.initialization import SupersetAppInitializer

logger = logging.getLogger(__name__)


def create_app(superset_config_module: Optional[str] = None) -> Flask:
    app = SupersetApp(__name__)

    try:
        # Allow user to override our config completely
        config_module = superset_config_module or os.environ.get(
            "SUPERSET_CONFIG", "superset.config"
        )
        app.config.from_object(config_module)

        app_initializer = app.config.get("APP_INITIALIZER", SupersetAppInitializer)(app)
        app_initializer.init_app()

        return app

    # Make sure that bootstrap errors ALWAYS get logged
    except Exception as ex:
        logger.exception("Failed to create app")
        raise ex


class SupersetApp(Flask):
    pass


 
# import logging
# import os
# from typing import Optional

# from flask import Blueprint, Flask, session, render_template, redirect, request

# from superset.initialization import SupersetAppInitializer

# logger = logging.getLogger(__name__)

# app = Flask(__name__, template_folder='templates')
# indexpage = Blueprint("my_blueprint", __name__)


# def create_app(superset_config_module: Optional[str] = None) -> Flask:
#     app = SupersetApp(__name__)

#     try:
#         @app.route("/")
#         def index():
#             return render_template("index.html")
        
#         # Allow user to override our config completely
#         config_module = superset_config_module or os.environ.get(
#             "SUPERSET_CONFIG", "superset.config"
#         )
#         app.config.from_object(config_module)

#         app_initializer = app.config.get("APP_INITIALIZER", SupersetAppInitializer)(app)
#         app_initializer.init_app()

#         @app.route("/login", methods=['GET', 'POST'])
#         def login():
#             if request.method == 'GET':
#                 # Perform login logic here
#                 # If login is successful, redirect to the dashboard page
#                 session.pop('_flashes', None)
#                 return redirect('/dashboard/list/')
#             else:
#                 # Clear any flashed messages for the login page
#                 session.pop('_flashes', None)
#                 # Render the login template without displaying flashed messages
#                 return redirect('/dashboard/list/')
            

#         # Register the blueprint
#         app.register_blueprint(indexpage)

#         return app

#     # Make sure that bootstrap errors ALWAYS get logged
#     except Exception as ex:
#         logger.exception("Failed to create app")
#         raise ex


# class SupersetApp(Flask):
#     pass