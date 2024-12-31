from mongo_user import db
from passlib.context import CryptContext

# Configure password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Retrieve all users
users = db.users.find()

# Iterate through each user
for user in users:
    try:
        if "password" in user and not user["password"].startswith("$2b$"):
            # Hash plaintext password
            hashed_password = pwd_context.hash(user["password"])
            
            # Update user in the database
            db.users.update_one({"_id": user["_id"]}, {"$set": {"password": hashed_password}})
            print(f"Updated password for user {user['email']}")
    except Exception as e:
        print(f"Error updating password for user {user['email']}: {e}")
