import os
import random

from app import create_app
from extensions import db
from models import User, Matchmaker, MaleSingle, FemaleSingle, Match

# ---------------------------------------------------
# Helpers for generating random data
# ---------------------------------------------------

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

ALLOWED_STATUSES = ["Introduced", "Dating", "Met", "Success", "Failed"]

def random_status():
    return random.choice(ALLOWED_STATUSES)


# ---------------------------------------------------
# Generators
# ---------------------------------------------------

def random_male(user_id):
    return {
        "first_name": random.choice(MALE_NAMES),
        "last_name": random.choice(LAST_NAMES),
        "age": random.randint(22, 35),
        "gender": "Male",
        "location": random.choice(LOCATIONS),
        "phone_number": f"050-{random.randint(1000000, 9999999)}",
        "notes": random.choice(NOTES),
        "user_id": user_id,
    }

def random_female(user_id):
    return {
        "first_name": random.choice(FEMALE_NAMES),
        "last_name": random.choice(LAST_NAMES),
        "age": random.randint(20, 32),
        "gender": "Female",
        "location": random.choice(LOCATIONS),
        "phone_number": f"052-{random.randint(1000000, 9999999)}",
        "notes": random.choice(NOTES),
        "user_id": user_id,
    }


# ---------------------------------------------------
# Seeding logic
# ---------------------------------------------------

app = create_app()

with app.app_context():

    print("⚠️ Dropping existing tables…")
    db.drop_all()
    db.create_all()

    # --------------------------
    # Create default user
    # --------------------------
    print("🧑‍💼 Creating admin user…")

    user = User(username="admin")
    user.password = "password123"
    db.session.add(user)
    db.session.commit()

    # --------------------------
    # Create matchmakers
    # --------------------------
    print("💼 Creating matchmakers…")

    matchmakers = []
    mk_names = ["Sarah Klein", "Rivka Adler", "Chaya Green"]

    for name in mk_names:
        mk = Matchmaker(
            name=name,
            location=random.choice(LOCATIONS),
            phone_number=f"053-{random.randint(1000000, 9999999)}",
            email_address=f"{name.split()[0].lower()}@perfectmatch.com",
            salary=random.randint(3000, 8000),
            user_id=user.id,
        )
        db.session.add(mk)
        matchmakers.append(mk)

    db.session.commit()

    # --------------------------
    # Male singles
    # --------------------------
    print("🧔 Creating male singles…")

    male_singles = []
    for _ in range(10):
        male = MaleSingle(**random_male(user.id))
        db.session.add(male)
        male_singles.append(male)

    db.session.commit()

    # --------------------------
    # Female singles
    # --------------------------
    print("👩 Creating female singles…")

    female_singles = []
    for _ in range(10):
        female = FemaleSingle(**random_female(user.id))
        db.session.add(female)
        female_singles.append(female)

    db.session.commit()

    # --------------------------
    # Matches
    # --------------------------
    print("💞 Creating matches…")

    NUM_MATCHES = 100   # <-- Increase or change as you want

    for _ in range(NUM_MATCHES):
        match = Match(
            matchmaker_id=random.choice(matchmakers).id,
            male_single_id=random.choice(male_singles).id,
            female_single_id=random.choice(female_singles).id,
            status=random_status(),
            notes=random.choice(NOTES),
            user_id=user.id,
        )
        db.session.add(match)

    db.session.commit()

    print("🌱 Seeding complete!")
