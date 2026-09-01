class UserData:

    def __init__(self):
        self.cache = {}

    def clearCache(self):
        self.cache = {}

    def createUserCache(self, username):
        self.cache[username] = {}

    def getUserCache(self, username):
        if username in self.cache.keys():
            return self.cache[username]
        else:
            self.createUserCache(username)
            return self.cache[username]
    
    def deleteUserCache(self, username):
        if username in self.cache.keys():
            del self.cache[username]

    def createDemoCache(self, username, demo):
        if username in self.cache.keys():
            self.cache[username][demo] = {}
        else:
            self.cache[username] = {}
            self.cache[username][demo] = {}

    def getDemoCache(self, username, demo):
        if username in self.cache.keys():
            if demo in self.cache[username].keys():
                return self.cache[username][demo]
            else:
                self.createDemoCache(username, demo)
                return self.cache[username][demo]
        else:
            self.createDemoCache(username, demo)
            return self.cache[username][demo]
    
    def deleteDemoCache(self, username, demo):
        if username in self.cache.keys():
            if demo in self.cache[username].keys():
                del self.cache[username][demo]

    def addObjToDemoCache(self, username, demo, okey, oobj):
        if not username in self.cache.keys():
            self.cache[username] = {}
        if not demo in self.cache[username].keys():
            self.cache[username][demo] = {}
        self.cache[username][demo][okey] = oobj

    def getObjFromDemoCache(self, username, demo, okey):
        if not username in self.cache.keys():
            return None
        if not demo in self.cache[username].keys():
            return None
        if not okey in self.cache[username][demo].keys():
            return None
        
        return self.cache[username][demo][okey]
    
    def deleteObjFromDemoCache(self, username, demo, okey):
        if username in self.cache.keys():
            if demo in self.cache[username].keys():
                if okey in self.cache[username][demo].keys():
                    del self.cache[username][demo][okey]

