from decouple import config
import os

BASE_DIR = os.path.dirname(os.path.realpath(__file__))

class Config:
    SECRET_KEY=config('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS=config('SQLALCHEMY_TRACK_MODIFICATIONS', cast=bool)
    PROPAGATE_EXCEPTIONS=config('PROPAGATE_EXCEPTIONS', cast=bool)

class DevConfig(Config):
    SQLALCHEMY_DATABASE_URI="sqlite:///"+os.path.join(BASE_DIR,'dev.db')
    DEBUG=True
    SQLALCHEMY_ECHO=True
    LOGLEVEL = 10 # Debug. Info = 20

class ProdConfig(Config):
    pass

class TestConfig(Config):
    pass