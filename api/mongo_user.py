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

def insert_user(user_data: dict):
    """
    Inserts a new user into the database.

    :param user_data: Dictionary containing user data
    :return: The ID of the inserted user
    """
    try:
        result = db.users.insert_one(user_data)
        return result.inserted_id
    except Exception as e:
        raise Exception(f"Error inserting user: {e}")

def find_user_by_email(email: str):
    """
    Finds a user by email.

    :param email: User's email address
    :return: User document or None
    """
    return db.users.find_one({"email": email})

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
