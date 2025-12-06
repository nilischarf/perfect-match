from datetime import datetime
from flask_login import UserMixin
from sqlalchemy.orm import validates
from sqlalchemy import CheckConstraint
from extensions import db, bcrypt

# ============================================================
# USER MODEL
# ============================================================

class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    matchmakers = db.relationship("Matchmaker", back_populates="user", cascade="all, delete-orphan")
    male_singles = db.relationship("MaleSingle", back_populates="user", cascade="all, delete-orphan")
    female_singles = db.relationship("FemaleSingle", back_populates="user", cascade="all, delete-orphan")
    matches = db.relationship("Match", back_populates="user", cascade="all, delete-orphan")

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


# ============================================================
# MATCHMAKER MODEL
# ============================================================

class Matchmaker(db.Model):
    __tablename__ = "matchmakers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(120))
    phone_number = db.Column(db.String(50))
    email_address = db.Column(db.String(120))
    salary = db.Column(db.Float, default=0, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    
    user = db.relationship("User", back_populates="matchmakers")

    matches = db.relationship(
        "Match",
        back_populates="matchmaker",
        cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint("salary >= 0", name="valid_salary"),
    )

    @validates("name")
    def validate_name(self, key, val):
        if not val or not val.strip():
            raise ValueError("Matchmaker name is required")
        return val.strip()

    @validates("salary")
    def validate_salary(self, key, val):
        if val is not None and val < 0:
            raise ValueError("Salary cannot be negative")
        return val


# ============================================================
# MALE SINGLE
# ============================================================

class MaleSingle(db.Model):
    __tablename__ = "male_singles"

    id = db.Column(db.Integer, primary_key=True)

    first_name = db.Column(db.String(120), nullable=False)
    last_name = db.Column(db.String(120), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(120))
    notes = db.Column(db.Text)
    phone_number = db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    
    user = db.relationship("User", back_populates="male_singles")

    matches = db.relationship(
        "Match",
        back_populates="male_single",
        cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint("age >= 18", name="valid_male_age"),
    )

    # Validations
    @validates("first_name", "last_name")
    def validate_names(self, key, val):
        if not val or not val.strip():
            raise ValueError(f"{key.replace('_',' ').title()} is required")
        return val.strip()

    @validates("age")
    def validate_age(self, key, val):
        if val is None or val < 18:
            raise ValueError("Age must be 18 or older")
        return val

    @validates("gender")
    def validate_gender(self, key, val):
        if val not in ("Male", "M", "male"):
            raise ValueError("Gender must be 'Male'")
        return "Male"


# ============================================================
# FEMALE SINGLE
# ============================================================

class FemaleSingle(db.Model):
    __tablename__ = "female_singles"

    id = db.Column(db.Integer, primary_key=True)

    first_name = db.Column(db.String(120), nullable=False)
    last_name = db.Column(db.String(120), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(120))
    notes = db.Column(db.Text)
    phone_number = db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    
    user = db.relationship("User", back_populates="female_singles")

    matches = db.relationship(
        "Match",
        back_populates="female_single",
        cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint("age >= 18", name="valid_female_age"),
    )

    @validates("first_name", "last_name")
    def validate_names(self, key, val):
        if not val or not val.strip():
            raise ValueError(f"{key.replace('_',' ').title()} is required")
        return val.strip()

    @validates("age")
    def validate_age(self, key, val):
        if val is None or val < 18:
            raise ValueError("Age must be 18 or older")
        return val

    @validates("gender")
    def validate_gender(self, key, val):
        if val not in ("Female", "F", "female"):
            raise ValueError("Gender must be 'Female'")
        return "Female"


# ============================================================
# MATCH MODEL
# ============================================================

VALID_STATUSES = {"Introduced", "Dating", "Failed", "Married"}

class Match(db.Model):
    __tablename__ = "matches"

    id = db.Column(db.Integer, primary_key=True)

    matchmaker_id = db.Column(db.Integer, db.ForeignKey("matchmakers.id"), nullable=False)
    male_single_id = db.Column(db.Integer, db.ForeignKey("male_singles.id"))
    female_single_id = db.Column(db.Integer, db.ForeignKey("female_singles.id"))
    status = db.Column(db.String(50))
    notes = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    
    user = db.relationship("User", back_populates="matches")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    matchmaker = db.relationship("Matchmaker", back_populates="matches")
    male_single = db.relationship("MaleSingle", back_populates="matches")
    female_single = db.relationship("FemaleSingle", back_populates="matches")

    @validates("status")
    def validate_status(self, key, val):
        if not val or len(val) > 50:
            raise ValueError("Invalid status")
        return val

    @validates("male_single_id", "female_single_id")
    def validate_links(self, key, val):
        # allow null values; validation done after insert
        return val

    @validates("matchmaker_id")
    def validate_matchmaker(self, key, val):
        if not Matchmaker.query.get(val):
            raise ValueError("Matchmaker does not exist")
        return val

    def validate_pairing(self):
        """
        Called after flush: ensures at least one of male/female present.
        """
        if not self.male_single_id and not self.female_single_id:
            raise ValueError("Match must include a male ID or a female ID")
