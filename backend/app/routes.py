from flask_restx import Resource
from flask import request
from app import api, fields

######################################################################################
######################################################################################
######################################################################################
# MUST import here every subroutes
from src.s000_users import r000_users
from src.s001_chat import s001_routes
######################################################################################
######################################################################################
######################################################################################

# Here can add some top level routes
@api.route('/ping')
class HelloResource(Resource):
    def get(self):
        return {"message":"The application is running."}