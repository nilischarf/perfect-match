from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_login import LoginManager
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
ma = Marshmallow()
login_manager = LoginManager()
bcrypt = Bcrypt()