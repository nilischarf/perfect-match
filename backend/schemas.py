from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from marshmallow import fields
from models import User, Matchmaker, MaleSingle, FemaleSingle, Match
from extensions import ma

# USER SCHEMA
class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        include_relationships = True
        exclude = ("password_hash",)

# MATCH SCHEMA
class MatchSchema(SQLAlchemyAutoSchema):
    # These nested objects are small, only basic info (no full nested trees!)
    matchmaker = fields.Nested(
        "MatchmakerMiniSchema", dump_only=True
    )
    male_single = fields.Nested(
        "MaleSingleMiniSchema", dump_only=True
    )
    female_single = fields.Nested(
        "FemaleSingleMiniSchema", dump_only=True
    )

    class Meta:
        model = Match
        load_instance = True
        include_fk = True

# MINI SCHEMAS
class MatchmakerMiniSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Matchmaker
        fields = ("id", "name", "location")  # keep it light


class MaleSingleMiniSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = MaleSingle
        fields = ("id", "first_name", "last_name", "age")


class FemaleSingleMiniSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = FemaleSingle
        fields = ("id", "first_name", "last_name", "age")

# MATCHMAKER SCHEMA
class MatchmakerSchema(SQLAlchemyAutoSchema):
    matches = fields.Nested(
        MatchSchema, many=True
    )

    # New secondary relationships
    male_singles = fields.Nested(
        MaleSingleMiniSchema, many=True, dump_only=True
    )
    female_singles = fields.Nested(
        FemaleSingleMiniSchema, many=True, dump_only=True
    )

    class Meta:
        model = Matchmaker
        load_instance = True
        include_relationships = True

# MALE SINGLE SCHEMA
class MaleSingleSchema(SQLAlchemyAutoSchema):
    matches = fields.Nested(
        MatchSchema, many=True
    )

    matchmakers = fields.Nested(
        MatchmakerMiniSchema, many=True, dump_only=True
    )
    female_singles = fields.Nested(
        FemaleSingleMiniSchema, many=True, dump_only=True
    )

    class Meta:
        model = MaleSingle
        load_instance = True
        include_relationships = True

# FEMALE SINGLE SCHEMA
class FemaleSingleSchema(SQLAlchemyAutoSchema):
    matches = fields.Nested(
        MatchSchema, many=True
    )

    matchmakers = fields.Nested(
        MatchmakerMiniSchema, many=True, dump_only=True
    )
    male_singles = fields.Nested(
        MaleSingleMiniSchema, many=True, dump_only=True
    )

    class Meta:
        model = FemaleSingle
        load_instance = True
        include_relationships = True
