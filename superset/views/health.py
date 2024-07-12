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

from superset import app, talisman
from superset.stats_logger import BaseStatsLogger
from superset.superset_typing import FlaskResponse

from flask import jsonify, request
import requests
# from flask_cors import CORS
# CORS(app, origins=["*"])

SUPRESET_BASE = "http://localhost:8088"  # Default base URL, can be overridden by user
# SUPRESET_BASE = "http://10.194.83.67" #prod

@talisman(force_https=False)
@app.route("/health")
@app.route("/healthcheck")
@app.route("/ping")
def health() -> FlaskResponse:
    stats_logger: BaseStatsLogger = app.config["STATS_LOGGER"]
    stats_logger.incr("health")
    return "OK"

def login(username, password):
    LOGIN_URL = f"{SUPRESET_BASE}/api/v1/security/login"
    session = requests.Session()
    payload = {
        "password": password,
        "provider": "db",
        "refresh": True,
        "username": username
    }
    response = session.post(LOGIN_URL, json=payload)
    if response.status_code == 200:
        access_token = response.json().get('access_token')
        refresh_token = response.json().get('refresh_token')
    else:
        raise Exception("Login failed")
    return (access_token, refresh_token)

def create_guest_token(username, password, iframe_user, first_name, last_name, dash_id):
    access_token, _ = login(username, password)
    session = requests.Session()
    session.headers['Authorization'] = f"Bearer {access_token}"
    session.headers['Content-Type'] = 'application/json'
    csrf_url = f"{SUPRESET_BASE}/api/v1/security/csrf_token/"
    csrf_res = session.get(csrf_url)
    csrf_token = csrf_res.json()['result']
    session.headers['Referer']= csrf_url
    session.headers['X-CSRFToken'] = csrf_token
    guest_token_endpoint = f"{SUPRESET_BASE}/api/v1/security/guest_token/"
    payload = {
        "user": {
            "username": iframe_user,
            "first_name": first_name,
            "last_name": last_name
        },
        "resources": [{"type": "dashboard", "id": dash_id}],
        "rls": []
    }
    response = session.post(guest_token_endpoint, json=payload)
    return response.json().get('token')

@talisman(force_https=False)
@app.route('/api/guest_token', methods=['GET'])
def guest_token() -> FlaskResponse:
    username = request.args.get('username', 'admin')
    password = request.args.get('password', 'admin')
    iframe_user = request.args.get('username', 'iframe')
    first_name = request.args.get('first_name', 'Yashi')
    last_name = request.args.get('last_name', 'iframe')
    dash_id = request.args.get('id', '04b349c0-ad5a-44c5-8a56-7be23e16a88e')
    guest_token = create_guest_token(username, password, iframe_user, first_name, last_name, dash_id)
    return jsonify(guestToken=guest_token)
