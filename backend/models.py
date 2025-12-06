from datetime import datetime
from flask_login import UserMixin
from extensions import db, bcrypt

# User Model (login)
class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    # Relationships
    matchmakers = db.relationship("Matchmaker", back_populates="user")

    # Flask-Login required methods
    def get_id(self):
        return str(self.id)

    @property
    def password(self):
        raise AttributeError("Password is write-only")

    @password.setter
    def password(self, raw_password):
        self.password_hash = bcrypt.generate_password_hash(raw_password).decode('utf-8')

    def check_password(self, raw_password):
        return bcrypt.check_password_hash(self.password_hash, raw_password)

# Matchmaker Model
class Matchmaker(db.Model):
    __tablename__ = "matchmakers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    location = db.Column(db.String(120))
    phone_number = db.Column(db.String(50))
    email_address = db.Column(db.String(120))
    salary = db.Column(db.Float)

    # FK → User
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    # Relationships
    user = db.relationship("User", back_populates="matchmakers")
    matches = db.relationship("Match", back_populates="matchmaker", cascade="all, delete-orphan" )

    male_singles = db.relationship(
        "MaleSingle",
        secondary="matches",
        primaryjoin="Matchmaker.id == Match.matchmaker_id",
        secondaryjoin="MaleSingle.id == Match.male_single_id",
        viewonly=True,
    )

    female_singles = db.relationship(
        "FemaleSingle",
        secondary="matches",
        primaryjoin="Matchmaker.id == Match.matchmaker_id",
        secondaryjoin="FemaleSingle.id == Match.female_single_id",
        viewonly=True,
    )

# Male Singles Model
class MaleSingle(db.Model):
    __tablename__ = "male_singles"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(20))
    location = db.Column(db.String(120))
    notes = db.Column(db.Text)
    phone_number = db.Column(db.String(50))

    # Relationships
    matches = db.relationship("Match", back_populates="male_single", cascade="all, delete-orphan")

    matchmakers = db.relationship(
        "Matchmaker",
        secondary="matches",
        primaryjoin="MaleSingle.id == Match.male_single_id",
        secondaryjoin="Matchmaker.id == Match.matchmaker_id",
        viewonly=True,
    )

    female_singles = db.relationship(
        "FemaleSingle",
        secondary="matches",
        primaryjoin="MaleSingle.id == Match.male_single_id",
        secondaryjoin="FemaleSingle.id == Match.female_single_id",
        viewonly=True,
    )

# Female Singles Model 
class FemaleSingle(db.Model):
    __tablename__ = "female_singles"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(20))
    location = db.Column(db.String(120))
    notes = db.Column(db.Text)
    phone_number = db.Column(db.String(50))

    # Relationships
    matches = db.relationship("Match", back_populates="female_single", cascade="all, delete-orphan")
    
    matchmakers = db.relationship(
        "Matchmaker",
        secondary="matches",
        primaryjoin="FemaleSingle.id == Match.female_single_id",
        secondaryjoin="Matchmaker.id == Match.matchmaker_id",
        viewonly=True,
    )

    male_singles = db.relationship(
        "MaleSingle",
        secondary="matches",
        primaryjoin="FemaleSingle.id == Match.female_single_id",
        secondaryjoin="MaleSingle.id == Match.male_single_id",
        viewonly=True,
    )

# Match Model
class Match(db.Model):
    __tablename__ = "matches"

    id = db.Column(db.Integer, primary_key=True)

    # Foreign keys
    matchmaker_id = db.Column(db.Integer, db.ForeignKey("matchmakers.id"), nullable=False)
    male_single_id = db.Column(db.Integer, db.ForeignKey("male_singles.id"), nullable=True)
    female_single_id = db.Column(db.Integer, db.ForeignKey("female_singles.id"), nullable=True)

    status = db.Column(db.String(50))  # e.g. "Introduced", "Scheduled", "Met", "Success", "Failed"
    notes = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    matchmaker = db.relationship("Matchmaker", back_populates="matches")
    male_single = db.relationship("MaleSingle", back_populates="matches")
    female_single = db.relationship("FemaleSingle", back_populates="matches")
