from flask_restx import Resource
from flask import request
from app import api, fields
from app import appUserData
from app import appConstants
from flask_jwt_extended import jwt_required
import pandas as pd
import json
from app import ollama_embedding
from app import app

# Demo specific imports
from src.s001_chat.s001_route_classes import C001RouteClass

# Define the models here
answer_model = api.model(
    "Answer",
    {
        "answer": fields.String()
    }
)

@api.route('/d001/chat_gpt')
class ChatGpt(Resource):
    
    @api.marshal_with(answer_model)
    @jwt_required()
    def post(self):

        data = request.get_json()
        username = data.get('username')
        routeClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, 
                                                    appConstants.D001_OKEY_ROUTE + appConstants.D001_CHAT + str(False))
        if routeClass == None:
            payload = {
                "answer": "Router Class not found"
            }
            return (payload, 424)
        
        payload, status = routeClass.chat_llm(request)
        return payload, status
    
@api.route('/d001/chat_ollama')
class ChatOllama(Resource):
    

    @api.marshal_with(answer_model)
    @jwt_required()
    def post(self):

        if ollama_embedding == None:
            payload = {
                "answer": "ERROR: Ollama not found"
            }
            return (payload, 424)

        data = request.get_json()
        username = data.get('username')
        routeClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, 
                                                    appConstants.D001_OKEY_ROUTE + appConstants.D001_CHAT + str(True))
        if routeClass == None:
            payload = {
                "answer": "Router Class not found"
            }
            return (payload, 424)
        
        payload, status = routeClass.chat_llm(request)
        return payload, status
    
@api.route('/d001/clear_chat_gpt')
class ClearChatGpt(Resource):
    
    @api.marshal_with(answer_model)
    @jwt_required()
    def post(self):

        data = request.get_json()
        username = data.get('username')
        routeClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, 
                                                    appConstants.D001_OKEY_ROUTE + appConstants.D001_CHAT + str(False))
        if routeClass == None:
            payload = {
                "answer": "Router Class not found"
            }
            return (payload, 424)

        payload, status = routeClass.clear()
        return payload, status
    
@api.route('/d001/clear_chat_ollama')
class ClearChatOllama(Resource):
    
    @api.marshal_with(answer_model)
    @jwt_required()
    def post(self):

        if ollama_embedding == None:
            payload = {
                "answer": "ERROR: Ollama not found"
            }
            return (payload, 424)

        data = request.get_json()
        username = data.get('username')
        routeClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, 
                                                    appConstants.D001_OKEY_ROUTE + appConstants.D001_CHAT + str(True))
        if routeClass == None:
            payload = {
                "answer": "Router Class not found"
            }
            return (payload, 424)

        payload, status = routeClass.clear()
        return payload, status
    
@api.route('/d001/upload_files_gpt')
class UploadFilesGpt(Resource):

    @api.marshal_with(answer_model)
    @jwt_required()
    def post(self):

        try:
            result = json.loads(request.form.get('info'))
        except:
            payload = {
                "answer": "Username information not found in the message."
            }
            return (payload, 424)
        username = result['username']
        routeClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, 
                                                    appConstants.D001_OKEY_ROUTE + appConstants.D001_RAG + str(False))
        if routeClass == None:
            payload = {
                "answer": "Router Class not found"
            }
            return (payload, 424)

        fresult = request.files.to_dict(flat=False)
        files = fresult['file']
        payload, status = routeClass.upload_files(files)
        return payload, status
    
@api.route('/d001/upload_files_ollama')
class UploadFilesOllama(Resource):

    @api.marshal_with(answer_model)
    @jwt_required()
    def post(self):

        if ollama_embedding == None:
            payload = {
                "answer": "ERROR: Ollama not found"
            }
            return (payload, 424)

        try:
            result = json.loads(request.form.get('info'))
        except:
            payload = {
                "answer": "Username information not found in the message."
            }
            return (payload, 424)
        username = result['username']
        routeClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, 
                                                    appConstants.D001_OKEY_ROUTE + appConstants.D001_RAG + str(True))
        if routeClass == None:
            payload = {
                "answer": "Router Class not found"
            }
            return (payload, 424)

        fresult = request.files.to_dict(flat=False)
        files = fresult['file']
        payload, status = routeClass.upload_files(files)
        return payload, status

@api.route('/d001/rag_gpt')
class ChatGpt(Resource):
    
    @api.marshal_with(answer_model)
    @jwt_required()
    def post(self):

        data = request.get_json()
        username = data.get('username')
        routeClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, 
                                                    appConstants.D001_OKEY_ROUTE + appConstants.D001_RAG + str(False))
        if routeClass == None:
            payload = {
                "answer": "Router Class not found"
            }
            return (payload, 424)
        
        payload, status = routeClass.chat_llm(request)
        return payload, status
    
@api.route('/d001/rag_ollama')
class ChatOllama(Resource):
    

    @api.marshal_with(answer_model)
    @jwt_required()
    def post(self):

        if ollama_embedding == None:
            payload = {
                "answer": "ERROR: Ollama not found"
            }
            return (payload, 424)

        data = request.get_json()
        username = data.get('username')
        routeClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, 
                                                    appConstants.D001_OKEY_ROUTE + appConstants.D001_RAG + str(True))
        if routeClass == None:
            payload = {
                "answer": "Router Class not found"
            }
            return (payload, 424)
        
        payload, status = routeClass.chat_llm(request)
        return payload, status
    
@api.route('/d001/clear_rag_gpt')
class ClearChatGpt(Resource):
    
    @api.marshal_with(answer_model)
    @jwt_required()
    def post(self):

        data = request.get_json()
        username = data.get('username')
        routeClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, 
                                                    appConstants.D001_OKEY_ROUTE + appConstants.D001_RAG + str(False))
        if routeClass == None:
            payload = {
                "answer": "Router Class not found"
            }
            return (payload, 424)

        payload, status = routeClass.clear()
        return payload, status
    
@api.route('/d001/clear_rag_ollama')
class ClearChatOllama(Resource):
    
    @api.marshal_with(answer_model)
    @jwt_required()
    def post(self):

        if ollama_embedding == None:
            payload = {
                "answer": "ERROR: Ollama not found"
            }
            return (payload, 424)

        data = request.get_json()
        username = data.get('username')
        routeClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, 
                                                    appConstants.D001_OKEY_ROUTE + appConstants.D001_RAG + str(True))
        if routeClass == None:
            payload = {
                "answer": "Router Class not found"
            }
            return (payload, 424)

        payload, status = routeClass.clear()
        return payload, status
