"""
Seed script for Perfect Match
This will DROP ALL TABLES and recreate them with fresh test data.
"""

import os
import random
from app import create_app
from extensions import db
from models import User, Matchmaker, MaleSingle, FemaleSingle, Match

# Helper Data

MALE_NAMES = [
    "David", "Aaron", "Moshe", "Yosef", "Daniel",
    "Eli", "Shmuel", "Ari", "Gabriel", "Noam",
]

FEMALE_NAMES = [
    "Sarah", "Rachel", "Leah", "Esther", "Miriam",
    "Chana", "Ayelet", "Tamar", "Naomi", "Shira",
]

LAST_NAMES = [
    "Cohen", "Levi", "Mizrahi", "Friedman", "Goldberg",
    "Weiss", "Katz", "Rosen", "Shapiro", "Greenberg",
]

LOCATIONS = [
    "Jerusalem", "Tel Aviv", "Brooklyn", "Monsey",
    "Lakewood", "Queens", "Toronto", "Los Angeles",
]

NOTES = [
    "Very responsible and kind.",
    "Comes from a warm family.",
    "Looking for someone thoughtful.",
    "Has strong values and great middot.",
    "Enjoys learning and community involvement.",
    "Prefers someone who is growth-oriented.",
]

MATCH_STATUSES = [
    "Introduced", "Success", "Failed"
]

def random_male():
    return {
        "first_name": random.choice(MALE_NAMES),
        "last_name": random.choice(LAST_NAMES),
        "age": random.randint(22, 35),
        "gender": "Male",
        "location": random.choice(LOCATIONS),
        "phone_number": f"050-{random.randint(1000000, 9999999)}",
        "notes": random.choice(NOTES),
    }


def random_female():
    return {
        "first_name": random.choice(FEMALE_NAMES),
        "last_name": random.choice(LAST_NAMES),
        "age": random.randint(20, 32),
        "gender": "Female",
        "location": random.choice(LOCATIONS),
        "phone_number": f"052-{random.randint(1000000, 9999999)}",
        "notes": random.choice(NOTES),
    }


# SEED LOGIC

app = create_app()

with app.app_context():

    print("\n⚠️  Dropping existing tables…")
    db.drop_all()
    db.create_all()

    print("🧑‍💼 Creating admin user…")
    admin = User(username="admin")
    admin.password = "password123"
    db.session.add(admin)
    db.session.commit()

    # Create Matchmakers
    print("💼 Creating matchmakers…")

    matchmaker_names = [
        "Sarah Klein",
        "Rivka Adler",
        "Chaya Green",
        "Devorah Cohen",
        "Avigail Rosen"
    ]

    matchmakers = []
    for name in matchmaker_names:
        mk = Matchmaker(
            name=name,
            location=random.choice(LOCATIONS),
            phone_number=f"053-{random.randint(1000000, 9999999)}",
            email_address=f"{name.split()[0].lower()}@perfectmatch.com",
            salary=random.randint(3000, 8000),
            user_id=admin.id,
        )
        db.session.add(mk)
        matchmakers.append(mk)

    db.session.commit()

    # Create Male Singles
    print("🧔 Creating male singles…")

    male_singles = []
    for _ in range(12):
        m = MaleSingle(**random_male())
        db.session.add(m)
        male_singles.append(m)

    db.session.commit()

    # Create Female Singles
    print("👩 Creating female singles…")

    female_singles = []
    for _ in range(12):
        f = FemaleSingle(**random_female())
        db.session.add(f)
        female_singles.append(f)

    db.session.commit()

    # Create Matches
    print("💞 Creating matches…")

    for _ in range(25):
        match = Match(
            matchmaker_id=random.choice(matchmakers).id,
            male_single_id=random.choice(male_singles).id,
            female_single_id=random.choice(female_singles).id,
            status=random.choice(MATCH_STATUSES),
            notes=random.choice(NOTES),
        )
        db.session.add(match)

    db.session.commit()

    print("\n🌱 Seeding complete!")
    print("Log in with username: admin  password: password123\n")
