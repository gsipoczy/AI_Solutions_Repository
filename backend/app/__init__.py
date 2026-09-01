from flask import Flask
from flask_restx import Api, fields
from config import DevConfig
from exts import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.userdata import UserData
from app.consts import Constants
from app.ollama import Ollama
import logging
from logging.handlers import RotatingFileHandler
import os
from config import Config

app=Flask(__name__)
app.config.from_object(DevConfig)

db.init_app(app)

migrate = Migrate(app, db)

JWTManager(app)

CORS(app)

api=Api(app, doc='/docs')
appUserData = UserData()
appConstants = Constants()

if not os.path.exists('logs'):
    os.mkdir('logs')
file_handler = RotatingFileHandler('logs/aitest.log', maxBytes=10240,
    backupCount=10)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s [%(module)s/%(funcName)s: %(lineno)d] - %(message)s'))
file_handler.setLevel(app.config.get('LOGLEVEL'))
app.logger.addHandler(file_handler)
app.logger.setLevel(app.config.get('LOGLEVEL'))
app.logger.info('AI Demo startup')

ollama_main = Ollama()
ollama_init_results = ollama_main.get_result()
for res in ollama_init_results:
    if 'ERROR' in res:
        app.logger.error(res)
        ollama_embedding = None
    else:
        app.logger.info(res)
        ollama_embedding = ollama_main.get_embedding()

#from app import routes, events, ollama
from app import routes, events
