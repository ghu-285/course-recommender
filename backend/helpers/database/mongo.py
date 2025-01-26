from pymongo import MongoClient, errors
import os

def get_mongo_client():
    """
    Get a MongoDB client.
    """
    uri = os.getenv("MONGO_URI")
    if not uri:
        raise ValueError("MONGO_URI is not set in the environment variables.")
    return MongoClient(uri)

def initialize_mongo_database(client, db_name, collection_name):
    """
    Initialize MongoDB and return a collection.
    Ensures a unique index if necessary.
    """
    db = client[db_name]
    collection = db[collection_name]
    return collection

def insert_course(collection, major, code, title, description, embedding):
    """
    Insert or update a course in the MongoDB collection.
    Prevents duplicates by using upsert.
    """
    course_data = {
        "major": major,
        "title": title,
        "description": description,
        "embedding": embedding
    }
    try:
        collection.update_one(
            {"major": major, "code": code},  
            {"$set": course_data},     
            upsert=True                
        )
        print(f"Successfully added/updated course: {code}")
    except errors.DuplicateKeyError:
        print(f"Skipped duplicate course: {code}")

def fetch_all_courses(collection):
    """
    Fetch all courses from the MongoDB collection.
    """
    return list(collection.find({}, {"_id": 0}))

def fetch_course_by_code(collection, code):
    """
    Fetch a single course by its code.
    """
    return collection.find_one({"code": code}, {"_id": 0})

def fetch_courses_by_major(collection, major):
    """
    Fetch all courses for a specific major.
    """
    return list(collection.find({"major": major}, {"_id": 0}))

def fetch_users_by_email(collection, email):
    """
    Fetch user data for a specific email.
    """
    return collection.find_one({"email": email}, {"_id": 0})

def fetch_user_data(client, email, users_collection_name="users"):
    """
    Fetch all user data for a specific email from the 'users' collection.
    """
    # Access the 'users' collection
    users_collection = initialize_mongo_database(client, "course_recommender", users_collection_name)
    
    # Fetch user data by email
    user = fetch_users_by_email(users_collection, email)
    if not user:
        print(f"No user found with email: {email}")
        return None

    return user
