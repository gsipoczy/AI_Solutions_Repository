from app.models import User
from flask import jsonify
from app import appUserData
from app import appConstants
from .s001_chat_source import Conversation, MainClass

class C001RouteClass():

    def __init__(self, username, purpose, use_local):
        self.username = username
        self.purpose = purpose
        self.use_local = use_local

        self.conversation = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, 
                                                            appConstants.D001_OKEY_CONVERSATION + purpose + str(use_local))
        if self.conversation == None:
            appUserData.addObjToDemoCache(username, appConstants.D001_DEMONAME, 
                                        appConstants.D001_OKEY_CONVERSATION + purpose + str(use_local), Conversation())
            self.conversation = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, 
                                                                appConstants.D001_OKEY_CONVERSATION + purpose + str(use_local))
        self.mainClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, 
                                                    appConstants.D001_OKEY_DEMO001 + purpose + str(use_local))
        if self.mainClass == None:
            db_user = User.query.filter_by(username=username).first()
            if db_user is not None:
                appUserData.addObjToDemoCache(
                    username, 
                    appConstants.D001_DEMONAME, 
                    appConstants.D001_OKEY_DEMO001 + purpose + str(use_local), 
                    MainClass(db_user.username, 
                        db_user.gpt_api_key, 
                        db_user.gpt_model,
                        purpose, 
                        self.conversation,
                        use_local))
                self.mainClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, 
                                                            appConstants.D001_OKEY_DEMO001 + purpose + str(use_local))

    def chat_llm(self, request):
        # Get the request body in JSON format
        data = request.get_json()

        # Need to check whether a user exists with the same name
        username = data.get('username')
        question = data.get('question')
        
        # Database query - returns None if nothing found
        db_user = User.query.filter_by(username=username).first()

        # Check
        if db_user is None:
            return (jsonify({"message": f"User {username} does not exist."}), 404)
        
        gpt_api_key = db_user.gpt_api_key
        gpt_model = db_user.gpt_model

        if gpt_api_key == '' or gpt_model == '':
            return (jsonify({"message": f"GPT API or model is missing."}), 404)
        
        # Get the executor instance
        self.mainClass.get_answer(question)
        cvs = self.conversation.get_conversation()
        
        answer = cvs[0]['answer']

        payload = {
                "answer": answer
            }
        return (payload, 200)
    
    def clear(self):
        if self.mainClass != None:
            self.mainClass.clear_conversation()
            #self.mainClass.clear_messages()
            print("CLEAR BEFORE, purpose: ", self.purpose)
            if self.purpose == appConstants.D001_RAG:
                print("Calling util vectorstore clear")
                self.mainClass.util.clear_vectorstore()
        if self.conversation != None:
            self.conversation.clear_conversation()
            self.conversation.clear_messages()

        payload = {
                "answer": "OK"
            }
        return (payload, 200)
    
    def upload_files(self, files):
        file_list = self.mainClass.process_files(files)
        answer = ""
        for file_name in file_list:
            if answer == "":
                answer = answer + file_name
            else:
                answer = answer + ", " + file_name
        payload = {
                "answer": answer
            }
        return (payload, 200)

