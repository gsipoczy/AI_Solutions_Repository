from app.models import User
from app.events import getEventFactory
from werkzeug.security import generate_password_hash, check_password_hash
from flask import jsonify, make_response, Response
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity
from datetime import timedelta
from app import app

######################################################################################
######################################################################################
######################################################################################
# Demo specific event handlers
from src.s001_chat.s001_events import D001LoginObserver, D001LogoutObserver
######################################################################################
######################################################################################
######################################################################################

class UsersClass():
    
    @staticmethod
    def signup_user(request):
        # Get the request body in JSON format
        data = request.get_json()

        # Need to check whether a user exists with the same name
        username = data.get('username')

        # Database query - returns None if nothing found
        db_user = User.query.filter_by(username=username).first()

        # Check
        if db_user is not None and db_user.username == username:
            return (jsonify({"message": f"User {username} already exists."}), 409)

        new_user = User(
            username = username,
            email = data.get('email'),
            password = generate_password_hash(data.get('password')),
            gpt_api_key = data.get('gpt_api_key'),
            gpt_model = data.get('gpt_model'),
            api_key0 = data.get('api_key0'),
            api_key1 = data.get('api_key1'),
            api_key2 = data.get('api_key2'),
            api_key3 = data.get('api_key3'),
            api_key4 = data.get('api_key4'),
            api_key5 = data.get('api_key5'),
            api_key6 = data.get('api_key6'),
            api_key7 = data.get('api_key7'),
            api_key8 = data.get('api_key8'),
            api_key9 = data.get('api_key9'),
            var0 = data.get('var0'),
            var1 = data.get('var1'),
            var2 = data.get('var2'),
            var3 = data.get('var3'),
            var4 = data.get('var4'),
            var5 = data.get('var5'),
            var6 = data.get('var6'),
            var7 = data.get('var7'),
            var8 = data.get('var8'),
            var9 = data.get('var9')
        )

        new_user.save()

        return (new_user, 201)
    
    @staticmethod
    def check_user(request):
        # Get the request body in JSON format
        data = request.get_json()

        # Get the details from the request
        username = data.get('username')
        password = data.get('password')

        # Database query - returns None if nothing found
        db_user = User.query.filter_by(username=username).first()

        # Check that the user exists and the password matches the hash in the database
        if db_user is not None and check_password_hash(db_user.password, password):

            # Create access token
            expires = timedelta(minutes=30)
            access_token = create_access_token(identity=db_user.username, expires_delta=expires)
            refresh_token = create_refresh_token(identity=db_user.username)

            payload = {
                "access_token": f"{access_token}", 
                "refresh_token": f"{refresh_token}",
                "id": db_user.id,
                "username": f"{username}",
                "password": f"{password}",
                "email": f"{db_user.email}",
                "gpt_api_key": f"{db_user.gpt_api_key}",
                "gpt_model": f"{db_user.gpt_model}",
                "api_key0": f"{db_user.api_key0}",
                "api_key1": f"{db_user.api_key1}",
                "api_key2": f"{db_user.api_key2}",
                "api_key3": f"{db_user.api_key3}",
                "api_key4": f"{db_user.api_key4}",
                "api_key5": f"{db_user.api_key5}",
                "api_key6": f"{db_user.api_key6}",
                "api_key7": f"{db_user.api_key7}",
                "api_key8": f"{db_user.api_key8}",
                "api_key9": f"{db_user.api_key9}",
                "var0": f"{db_user.var0}",
                "var1": f"{db_user.var1}",
                "var2": f"{db_user.var2}",
                "var3": f"{db_user.var3}",
                "var4": f"{db_user.var4}",
                "var5": f"{db_user.var5}",
                "var6": f"{db_user.var6}",
                "var7": f"{db_user.var7}",
                "var8": f"{db_user.var8}",
                "var9": f"{db_user.var9}"
            }

            # Trigger events and register
            login_trigger = getEventFactory().get_login_trigger(db_user.username)
            ######################################################################################
            ######################################################################################
            ######################################################################################
            D001LoginObserver("D001", login_trigger)
            ######################################################################################
            ######################################################################################
            ######################################################################################
            if(login_trigger != None):
                login_trigger.notify()

            return (payload, 200)

        else:
            return (jsonify({"message": "Invalid username or password"}), 401)
        
    @staticmethod
    def logout(request):
        # Get the request body in JSON format
        data = request.get_json()

        # Get the details from the request
        username = data.get('username')

        # Trigger logout event
        logout_trigger = getEventFactory().get_logout_trigger(username)
        ######################################################################################
        ######################################################################################
        ######################################################################################
        D001LogoutObserver("D001", logout_trigger)
        ######################################################################################
        ######################################################################################
        ######################################################################################
        if(logout_trigger != None):
                logout_trigger.notify()

        payload = {}
        return (payload, 200)

        
    @staticmethod
    def check_expiry():
        payload = {
            "status": "OK"
        }
        return (payload, 200)
        
    @staticmethod
    def refresh_token():
        # Get the current identity
        current_user = get_jwt_identity()

        # Create new token
        new_access_token = create_access_token(identity=current_user)

        # Return
        payload = {
            "access_token": f"{new_access_token}"
        }
        return (payload, 200)
    
    @staticmethod
    def read_user(request):
        app.logger.debug("READING USER")
        # Get the request body in JSON format
        data = request.get_json()

        # Get the details from the request
        username = data.get('username')
        app.logger.debug("User: ", username)

        # Database query - returns None if nothing found
        db_user = User.query.filter_by(username=username).first()

        # Check that the user exists and the password matches the hash in the database
        if db_user is not None:

            payload = {
                "id": db_user.id,
                "username": f"{username}",
                "email": f"{db_user.email}",
                "gpt_api_key": f"{db_user.gpt_api_key}",
                "gpt_model": f"{db_user.gpt_model}",
                "api_key0": f"{db_user.api_key0}",
                "api_key1": f"{db_user.api_key1}",
                "api_key2": f"{db_user.api_key2}",
                "api_key3": f"{db_user.api_key3}",
                "api_key4": f"{db_user.api_key4}",
                "api_key5": f"{db_user.api_key5}",
                "api_key6": f"{db_user.api_key6}",
                "api_key7": f"{db_user.api_key7}",
                "api_key8": f"{db_user.api_key8}",
                "api_key9": f"{db_user.api_key9}",
                "var0": f"{db_user.var0}",
                "var1": f"{db_user.var1}",
                "var2": f"{db_user.var2}",
                "var3": f"{db_user.var3}",
                "var4": f"{db_user.var4}",
                "var5": f"{db_user.var5}",
                "var6": f"{db_user.var6}",
                "var7": f"{db_user.var7}",
                "var8": f"{db_user.var8}",
                "var9": f"{db_user.var9}"
            }
            return (payload, 200)

        else:
            return (jsonify({"message": "Invalid username"}), 404)
        
    @staticmethod
    def update_user(id, request):
        # Update user
        user_to_update = User.query.get_or_404(id) 
        # Get the updated data from the request body
        data = request.get_json()
        # If the username is changed, must check that it does not exist already
        new_username = data.get('username')
        old_username = user_to_update.username
        if new_username != old_username:
            # Database query - returns None if nothing found
            db_user = User.query.filter_by(username=new_username).first()

            # Check
            if db_user is not None and db_user.username == new_username:
                return (jsonify({"message": f"User {new_username} already exists."}), 409)

        # Save
        user_to_update.update_user(
            data.get('username'),
            data.get('email'), 
            data.get('gpt_api_key'),
            data.get('gpt_model'),
            data.get('api_key0'),
            data.get('api_key1'),
            data.get('api_key2'),
            data.get('api_key3'),
            data.get('api_key4'),
            data.get('api_key5'),
            data.get('api_key6'),
            data.get('api_key7'),
            data.get('api_key8'),
            data.get('api_key9'),
            data.get('var0'),
            data.get('var1'),
            data.get('var2'),
            data.get('var3'),
            data.get('var4'),
            data.get('var5'),
            data.get('var6'),
            data.get('var7'),
            data.get('var8'),
            data.get('var9')
        )
        # Return it
        return (user_to_update, 200)
    
    @staticmethod
    def update_password(id, request):
        # Update user
        user_to_update = User.query.get_or_404(id) 
        # Get the updated data from the request body
        data = request.get_json()

        # Save
        user_to_update.update_password(
            generate_password_hash(data.get('password'))
        )
        # Return it
        return (jsonify({"message": "Password updated"}), 200)
    
    @staticmethod
    def delete_user(id):
        # Delete user
        user_to_delete = User.query.get_or_404(id)
        user_to_delete.delete()
        return (user_to_delete, 200)

