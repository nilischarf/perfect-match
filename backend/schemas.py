from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from marshmallow import fields
from models import db, User, Matchmaker, MaleSingle, FemaleSingle, Match

# User Schema (no password)
class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        include_relationships = True
        exclude = ("password_hash",)

# Match Schema
class MatchSchema(SQLAlchemyAutoSchema):
    matchmaker = fields.Nested("MatchmakerSchema", exclude=("matches",), dump_only=True)
    male_single = fields.Nested("MaleSingleSchema", exclude=("matches",), dump_only=True)
    female_single = fields.Nested("FemaleSingleSchema", exclude=("matches",), dump_only=True)

    class Meta:
        model = Match
        load_instance = True
        include_fk = True

# Matchmaker Schema
class MatchmakerSchema(SQLAlchemyAutoSchema):
    matches = fields.Nested(MatchSchema, many=True)

    class Meta:
        model = Matchmaker
        load_instance = True

# Male Single Schema
class MaleSingleSchema(SQLAlchemyAutoSchema):
    matches = fields.Nested(MatchSchema, many=True)

    class Meta:
        model = MaleSingle
        load_instance = True

# Female Single Schema
class FemaleSingleSchema(SQLAlchemyAutoSchema):
    matches = fields.Nested(MatchSchema, many=True)

    class Meta:
        model = FemaleSingle
        load_instance = True