from pymongo import MongoClient
import os

def get_mongo_client():
    """
    Get a MongoDB client.
    """
    uri = os.getenv("MONGO_URI")
    if not uri:
        raise ValueError("MONGO_URI is not set in the environment variables.")
    return MongoClient(uri)

def initialize_mongo_database(client, db_name="course_catalog", collection_name="courses"):
    """
    Initialize MongoDB and return a collection.
    """
    db = client[db_name]
    return db[collection_name]

def insert_course(collection, code, title, description, embedding):
    """
    Insert a course into the MongoDB collection.
    """
    course_data = {
        "code": code,
        "title": title,
        "description": description,
        "embedding": embedding
    }
    collection.insert_one(course_data)

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
