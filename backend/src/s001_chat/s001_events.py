from app import appUserData
from app import appConstants
from app.models import User
from .s001_chat_source import Conversation, MainClass
from . s001_route_classes import C001RouteClass
from app import app

class D001LoginObserver:
    def __init__(self, name, subject):

        self.name = name # the name of the observer
        self.subject = subject # the reference to the subject
        self.subject.register(self) # register the observer to the subject

    def update(self, username):
        app.logger.debug(f"{self.name} received a login notification. The logged in username is {username}.")

        # Prepare the user cache
        appUserData.createUserCache(username)
        appUserData.createDemoCache(username, appConstants.D001_DEMONAME)
        conv1 = Conversation()
        appUserData.addObjToDemoCache(
            username, 
            appConstants.D001_DEMONAME, 
            appConstants.D001_OKEY_CONVERSATION + appConstants.D001_CHAT + str(False), 
            conv1)
        conv2 = Conversation()
        appUserData.addObjToDemoCache(
            username, 
            appConstants.D001_DEMONAME, 
            appConstants.D001_OKEY_CONVERSATION + appConstants.D001_CHAT + str(True), 
            conv2)
        conv3 = Conversation()
        appUserData.addObjToDemoCache(
            username, 
            appConstants.D001_DEMONAME, 
            appConstants.D001_OKEY_CONVERSATION + appConstants.D001_RAG + str(False), 
            conv3)
        conv4 = Conversation()
        appUserData.addObjToDemoCache(
            username, 
            appConstants.D001_DEMONAME, 
            appConstants.D001_OKEY_CONVERSATION + appConstants.D001_RAG + str(True), 
            conv4)
        db_user = User.query.filter_by(username=username).first()
        if db_user is not None:
            # Need 4 Main classes: Chat or RAG, GPT or Ollama
            appUserData.addObjToDemoCache(username, appConstants.D001_DEMONAME, 
                appConstants.D001_OKEY_DEMO001 + appConstants.D001_CHAT + str(False), 
                MainClass(username, db_user.gpt_api_key, db_user.gpt_model, appConstants.D001_CHAT, conv1, False))
            appUserData.addObjToDemoCache(username, appConstants.D001_DEMONAME, 
                appConstants.D001_OKEY_DEMO001 + appConstants.D001_CHAT + str(True), 
                MainClass(username, db_user.gpt_api_key, db_user.gpt_model, appConstants.D001_CHAT, conv2, True))
            appUserData.addObjToDemoCache(username, appConstants.D001_DEMONAME, 
                appConstants.D001_OKEY_DEMO001 + appConstants.D001_RAG + str(False), 
                MainClass(username, db_user.gpt_api_key, db_user.gpt_model, appConstants.D001_RAG, conv3, False))
            appUserData.addObjToDemoCache(username, appConstants.D001_DEMONAME, 
                appConstants.D001_OKEY_DEMO001 + appConstants.D001_RAG + str(True), 
                MainClass(username, db_user.gpt_api_key, db_user.gpt_model, appConstants.D001_RAG, conv4, True))
        # Also need 4 Route classes
        appUserData.addObjToDemoCache(username, appConstants.D001_DEMONAME, 
                                    appConstants.D001_OKEY_ROUTE + appConstants.D001_CHAT + str(False), 
                                    C001RouteClass(username, appConstants.D001_CHAT, False))
        appUserData.addObjToDemoCache(username, appConstants.D001_DEMONAME, 
                                    appConstants.D001_OKEY_ROUTE + appConstants.D001_CHAT + str(True), 
                                    C001RouteClass(username, appConstants.D001_CHAT, True))
        appUserData.addObjToDemoCache(username, appConstants.D001_DEMONAME, 
                                    appConstants.D001_OKEY_ROUTE + appConstants.D001_RAG + str(False), 
                                    C001RouteClass(username, appConstants.D001_RAG, False))
        appUserData.addObjToDemoCache(username, appConstants.D001_DEMONAME, 
                                    appConstants.D001_OKEY_ROUTE + appConstants.D001_RAG + str(True), 
                                    C001RouteClass(username, appConstants.D001_RAG, True))

class D001LogoutObserver:
    def __init__(self, name, subject):
        self.name = name # the name of the observer
        self.subject = subject # the reference to the subject
        self.subject.register(self) # register the observer to the subject

    def update(self, username):
        app.logger.debug(f"{self.name} received a logout notification. User {username} is logged out.")

        #remove cache
        appUserData.deleteObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_CONVERSATION + appConstants.D001_CHAT + str(False))
        appUserData.deleteObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_CONVERSATION + appConstants.D001_CHAT + str(True))
        appUserData.deleteObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_CONVERSATION + appConstants.D001_RAG + str(False))
        appUserData.deleteObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_CONVERSATION + appConstants.D001_RAG + str(True))
        
        mainClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_DEMO001 + appConstants.D001_CHAT + str(False))
        if not mainClass == None:
            mainClass.util.clear_vectorstore()
        mainClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_DEMO001 + appConstants.D001_CHAT + str(True))
        if not mainClass == None:
            mainClass.util.clear_vectorstore()
        mainClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_DEMO001 + appConstants.D001_RAG + str(False))
        if not mainClass == None:
            mainClass.util.clear_vectorstore()
        mainClass = appUserData.getObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_DEMO001 + appConstants.D001_RAG + str(True))
        if not mainClass == None:
            mainClass.util.clear_vectorstore()

        appUserData.deleteObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_DEMO001 + appConstants.D001_CHAT + str(False))
        appUserData.deleteObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_DEMO001 + appConstants.D001_CHAT + str(True))
        appUserData.deleteObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_DEMO001 + appConstants.D001_RAG + str(False))
        appUserData.deleteObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_DEMO001 + appConstants.D001_RAG + str(True))
        
        appUserData.deleteObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_ROUTE + appConstants.D001_CHAT + str(False))
        appUserData.deleteObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_ROUTE + appConstants.D001_CHAT + str(True))
        appUserData.deleteObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_ROUTE + appConstants.D001_RAG + str(False))
        appUserData.deleteObjFromDemoCache(username, appConstants.D001_DEMONAME, appConstants.D001_OKEY_ROUTE + appConstants.D001_RAG + str(True))