from flask_restx import Resource
from flask import request
from app import api, fields
from flask_jwt_extended import jwt_required, get_jwt_identity

# Import the corresponding executor class
from src.s000_users.c000_users import UsersClass

# Define the models here
signup_model = api.model(
    "SignUp",
    {
        "username": fields.String(25),
        "email": fields.String(255),
        "password": fields.String(255),
        "gpt_api_key": fields.String(255),
        "gpt_model": fields.String(255),
        "api_key0": fields.String(255),
        "api_key1": fields.String(255),
        "api_key2": fields.String(255),
        "api_key3": fields.String(255),
        "api_key4": fields.String(255),
        "api_key5": fields.String(255),
        "api_key6": fields.String(255),
        "api_key7": fields.String(255),
        "api_key8": fields.String(255),
        "api_key9": fields.String(255),
        "var0": fields.String(255),
        "var1": fields.String(255),
        "var2": fields.String(255),
        "var3": fields.String(255),
        "var4": fields.String(255),
        "var5": fields.String(255),
        "var6": fields.String(255),
        "var7": fields.String(255),
        "var8": fields.String(255),
        "var9": fields.String(255)
    }
)
update_user_model = api.model(
    "UpdateUser",
    {
        "username": fields.String(),
        "email": fields.String(),
        "gpt_api_key": fields.String(),
        "gpt_model": fields.String(),
        "api_key0": fields.String(),
        "api_key1": fields.String(),
        "api_key2": fields.String(),
        "api_key3": fields.String(),
        "api_key4": fields.String(),
        "api_key5": fields.String(),
        "api_key6": fields.String(),
        "api_key7": fields.String(),
        "api_key8": fields.String(),
        "api_key9": fields.String(),
        "var0": fields.String(),
        "var1": fields.String(),
        "var2": fields.String(),
        "var3": fields.String(),
        "var4": fields.String(),
        "var5": fields.String(),
        "var6": fields.String(),
        "var7": fields.String(),
        "var8": fields.String(),
        "var9": fields.String()
    }
)

update_password_model = api.model(
    "UpdatePassword",
    {
        "message": fields.String()
    }
)

login_model = api.model(
    "Login",
    {
        "access_token": fields.String(),
        "refresh_token":  fields.String(),
        "id": fields.Integer(),
        "username": fields.String(),
        "password": fields.String(),
        "email":  fields.String(),
        "gpt_api_key": fields.String(),
        "gpt_model": fields.String(),
        "api_key0": fields.String(),
        "api_key1": fields.String(),
        "api_key2": fields.String(),
        "api_key3": fields.String(),
        "api_key4": fields.String(),
        "api_key5": fields.String(),
        "api_key6": fields.String(),
        "api_key7": fields.String(),
        "api_key8": fields.String(),
        "api_key9": fields.String(),
        "var0": fields.String(),
        "var1": fields.String(),
        "var2": fields.String(),
        "var3": fields.String(),
        "var4": fields.String(),
        "var5": fields.String(),
        "var6": fields.String(),
        "var7": fields.String(),
        "var8": fields.String(),
        "var9": fields.String()
    }
)

read_model = api.model(
    "Login",
    {
        "id": fields.Integer(),
        "username": fields.String(),
        "email":  fields.String(),
        "gpt_api_key": fields.String(),
        "gpt_model": fields.String(),
        "api_key0": fields.String(),
        "api_key1": fields.String(),
        "api_key2": fields.String(),
        "api_key3": fields.String(),
        "api_key4": fields.String(),
        "api_key5": fields.String(),
        "api_key6": fields.String(),
        "api_key7": fields.String(),
        "api_key8": fields.String(),
        "api_key9": fields.String(),
        "var0": fields.String(),
        "var1": fields.String(),
        "var2": fields.String(),
        "var3": fields.String(),
        "var4": fields.String(),
        "var5": fields.String(),
        "var6": fields.String(),
        "var7": fields.String(),
        "var8": fields.String(),
        "var9": fields.String()
    }
)


@api.route('/auth/signup')
class SignUp(Resource):

    @api.marshal_with(signup_model)
    @api.expect(signup_model)
    def post(self):
        payload, status = UsersClass.signup_user(request)
        return payload, status

@api.route('/auth/login')
class Login(Resource):

    @api.marshal_with(login_model)
    @api.expect(login_model)
    def post(self):
        payload, status = UsersClass.check_user(request)
        return payload, status
    
@api.route('/auth/refresh')
class RefreshToken(Resource):

    @jwt_required(refresh=True)
    def post(self):
        payload, status = UsersClass.refresh_token()
        return payload, status
    
@api.route('/auth/check_expiry')
class CheckExpiry(Resource):

    @jwt_required()
    def post(self):
        payload, status = UsersClass.check_expiry()
        return payload, status
    
@api.route('/auth/read_user')
class ReadUser(Resource):

    @api.marshal_with(read_model)
    @jwt_required()
    def post(self):
        payload, status = UsersClass.read_user(request)
        return payload, status
    
@api.route('/auth/update_user/<int:id>')
class UpdateUser(Resource):

    @api.marshal_with(update_user_model)
    @jwt_required()
    def put(self, id):
        payload, status = UsersClass.update_user(id, request)
        return payload, status
    
@api.route('/auth/update_password/<int:id>')
class UpdatePassword(Resource):

    @api.marshal_with(update_password_model)
    @jwt_required()
    def put(self, id):
        payload, status = UsersClass.update_password(id, request)
        return payload, status    

@api.route('/auth/delete_user/<int:id>')
class UpdatePassword(Resource):

    @api.marshal_with(signup_model)
    @jwt_required()
    def delete(self, id):
        payload, status = UsersClass.delete_user(id)
        return payload, status 
    
@api.route('/auth/logout')
class Logout(Resource):

    @jwt_required()
    def post(self):
        payload, status = UsersClass.logout(request)
        return payload, status 