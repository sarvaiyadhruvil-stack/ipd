from app.core.database import SessionLocal, engine, Base
from app.models import models
from app.core.security import get_password_hash

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if we already have users
    if db.query(models.User).count() == 0:
        print("Seeding database...")
        student = models.User(
            name="Demo Student",
            email="student@example.com",
            password_hash=get_password_hash("Student@123"),
            role="student"
        )
        teacher = models.User(
            name="Demo Teacher",
            email="teacher@example.com",
            password_hash=get_password_hash("Teacher@123"),
            role="teacher"
        )
        
        db.add(student)
        db.add(teacher)
        db.commit()
        print("Demo users created successfully!")
    else:
        print("Database already seeded.")
        
    db.close()

if __name__ == "__main__":
    seed_db()
