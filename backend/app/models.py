from exts import db

class User(db.Model):
    id=db.Column(db.Integer(), primary_key=True)
    username=db.Column(db.String(25), nullable=False, unique=True)
    email=db.Column(db.String(255), nullable=False)
    password=db.Column(db.String(255), nullable=False)
    gpt_api_key=db.Column(db.String(255), nullable=False)
    gpt_model=db.Column(db.String(255), nullable=False)
    api_key0=db.Column(db.String(255), nullable=False)
    api_key1=db.Column(db.String(255), nullable=False)
    api_key2=db.Column(db.String(255), nullable=False)
    api_key3=db.Column(db.String(255), nullable=False)
    api_key4=db.Column(db.String(255), nullable=False)
    api_key5=db.Column(db.String(255), nullable=False)
    api_key6=db.Column(db.String(255), nullable=False)
    api_key7=db.Column(db.String(255), nullable=False)
    api_key8=db.Column(db.String(255), nullable=False)
    api_key9=db.Column(db.String(255), nullable=False)
    var0=db.Column(db.String(255), nullable=False)
    var1=db.Column(db.String(255), nullable=False)
    var2=db.Column(db.String(255), nullable=False)
    var3=db.Column(db.String(255), nullable=False)
    var4=db.Column(db.String(255), nullable=False)
    var5=db.Column(db.String(255), nullable=False)
    var6=db.Column(db.String(255), nullable=False)
    var7=db.Column(db.String(255), nullable=False)
    var8=db.Column(db.String(255), nullable=False)
    var9=db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"<User {self.username} >"
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def update_user(
            self, 
            username,
            email, 
            gpt_api_key,
            gpt_model,
            api_key0,
            api_key1,
            api_key2,
            api_key3,
            api_key4,
            api_key5,
            api_key6,
            api_key7,
            api_key8,
            api_key9,
            var0,
            var1,
            var2,
            var3,
            var4,
            var5,
            var6,
            var7,
            var8,
            var9
        ):
        self.username = username
        self.email = email
        self.gpt_api_key = gpt_api_key
        self.gpt_model = gpt_model
        self.api_key0 = api_key0
        self.api_key1 = api_key1
        self.api_key2 = api_key2
        self.api_key3 = api_key3
        self.api_key4 = api_key4
        self.api_key5 = api_key5
        self.api_key6 = api_key6
        self.api_key7 = api_key7
        self.api_key8 = api_key8
        self.api_key9 = api_key9
        self.var0 = var0
        self.var1 = var1
        self.var2 = var2
        self.var3 = var3
        self.var4 = var4
        self.var5 = var5
        self.var6 = var6
        self.var7 = var7
        self.var8 = var8
        self.var9 = var9
        db.session.commit()

    def update_password(
            self, 
            password
        ):
        self.password = password
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()