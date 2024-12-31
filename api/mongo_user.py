from pymongo import MongoClient
from bson import json_util
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '../backend/.env')
load_dotenv(dotenv_path)

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "course_recommender")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def find_user_by_email(email: str):
    try:
        return db.users.find_one({"email": email})
    except Exception as e:
        raise Exception(f"Error finding user by email: {e}")

def insert_user(user_data: dict):
    try:
        result = db.users.insert_one(user_data)
        return result.inserted_id
    except Exception as e:
        raise Exception(f"Error inserting user: {e}")

def update_user(email: str, updated_data: dict):
    """
    Updates a user's profile.
    """
    try:
        result = db.users.find_one_and_update(
            {"email": email},
            {"$set": updated_data},
            return_document=True
        )
        if result:
            # Serialize the result before returning
            return json_util.loads(json_util.dumps(result))
        return None
    except Exception as e:
        raise Exception(f"Error updating user: {e}")
