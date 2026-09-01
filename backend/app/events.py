# Event Trigger Factory
class EventFactory:
    def __init__(self):
        self.login_triggers = {}
        self.logout_triggers = {}

    def get_login_trigger(self, username):
        # try from buffer
        login_trigger = self.login_triggers.get(username)
        if login_trigger == None:
            login_trigger = LoginTrigger(username)
            self.login_triggers[username] = login_trigger
        return login_trigger
    
    def get_logout_trigger(self, username):
        # try from buffer
        logout_trigger = self.logout_triggers.get(username)
        if logout_trigger == None:
            logout_trigger = LogoutTrigger(username)
            self.logout_triggers[username] = logout_trigger
        return logout_trigger

# Login event trigger
class LoginTrigger:
    def __init__(self, username):
        self.observers = [] # a list of observers
        self.username = username # the initial state
 
    def register(self, observer):
        self.observers.append(observer) # add an observer to the list
 
    def unregister(self, observer):
        self.observers.remove(observer) # remove an observer from the list
 
    def notify(self):
        for observer in self.observers: # loop through the list of observers
            observer.update(self.username) # call their update method with the current state
 
    def set_username(self, username):
        self.username = username # set the state of the subject
        self.notify() # notify the observers of the change
 
    def get_username(self):
        return self.username # return the state of the subject

# Logout event trigger
class LogoutTrigger:
    def __init__(self, username):
        self.observers = [] # a list of observers
        self.username = username
 
    def register(self, observer):
        self.observers.append(observer)
 
    def unregister(self, observer):
        self.observers.remove(observer)
 
    def notify(self):
        for observer in self.observers:
            observer.update(self.username)
 
    def set_username(self, username):
        self.username = username
        self.notify()
 
    def get_username(self):
        return self.username
    
# THIS IS JUST AN EXAMPLE, you have to create your own 
# for Login and Logout to do the necessary
class ExampleObserver:
    def __init__(self, name, subject):
        self.name = name # the name of the observer
        self.subject = subject # the reference to the subject
        self.subject.register(self) # register the observer to the subject
 
    def update(self, username):
        app.logger.debug(f"{self.name} received a notification from the subject. The new username is {username}.") # print a message to show the response

event_factory = EventFactory()

def getEventFactory():
    return event_factory
