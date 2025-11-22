from config import Config
import os

print("Seed script DB path:", os.path.abspath(Config.SQLALCHEMY_DATABASE_URI.replace("sqlite:///", "")))

import random
from app import create_app
from extensions import db
from models import User, Matchmaker, MaleSingle, FemaleSingle, Match

app = create_app()
with app.app_context():
    from extensions import db
    print("🔍 Models SQLAlchemy knows:")
    print(db.Model.metadata.tables.keys())

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
    "Weiss", "Katz", "Rosen", "Shapiro", "Greenberg"
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
    "Introduced", "Proposed", "Scheduled", "Met", "Success", "Failed"
]

# Generate Random Person Data

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

# Seeder Logic

with app.app_context():
    print("Dropping existing tables...")
    db.drop_all()
    db.create_all()

    # Create default user
    print("Creating default user...")

    user = User(username="admin")
    user.password = "password123"  # hashed automatically
    db.session.add(user)
    db.session.commit()

    # Create matchmakers
    print("Creating matchmakers...")

    matchmakers = []
    for name in ["Sarah Klein", "Rivka Adler", "Chaya Green"]:
        mk = Matchmaker(
            name=name,
            location=random.choice(LOCATIONS),
            phone_number=f"053-{random.randint(1000000, 9999999)}",
            email_address=f"{name.split()[0].lower()}@perfectmatch.com",
            salary=random.randint(3000, 8000),
            user_id=user.id,
        )
        matchmakers.append(mk)
        db.session.add(mk)

    db.session.commit()

    # Create male singles
    print("Creating male singles...")

    male_singles = []
    for _ in range(10):
        male = MaleSingle(**random_male())
        male_singles.append(male)
        db.session.add(male)

    db.session.commit()

    # Create female singles
    print("Creating female singles...")

    female_singles = []
    for _ in range(10):
        female = FemaleSingle(**random_female())
        female_singles.append(female)
        db.session.add(female)

    db.session.commit()

    # Create matches
    print("Creating matches...")

    for _ in range(20):
        match = Match(
            matchmaker_id=random.choice(matchmakers).id,
            male_single_id=random.choice(male_singles).id,
            female_single_id=random.choice(female_singles).id,
            status=random.choice(MATCH_STATUSES),
            notes=random.choice(NOTES),
        )
        db.session.add(match)

    db.session.commit()
    print("Seeding complete! 🌱")
