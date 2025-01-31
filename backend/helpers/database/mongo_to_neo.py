from pymongo import MongoClient
from neo4jconnector import Neo4jConnector
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_mongo_client():
    """
    Get a MongoDB client.
    """
    uri = os.getenv("MONGO_URI")
    if not uri:
        raise ValueError("MONGO_URI is not set in the environment variables.")
    try:
        client = MongoClient(uri)
        print("Connected to MongoDB successfully.")
        return client
    except Exception as e:
        raise ConnectionError(f"Failed to connect to MongoDB: {str(e)}")

def initialize_mongo_database(client, db_name, collection_name):
    """
    Initialize MongoDB and return a collection.
    """
    try:
        db = client[db_name]
        collection = db[collection_name]
        print(f"Accessed collection: {db_name}.{collection_name}")
        return collection
    except Exception as e:
        raise ValueError(f"Failed to initialize MongoDB database: {str(e)}")

def fetch_all_courses(collection):
    """
    Fetch all courses from the MongoDB collection.
    """
    try:
        courses = list(collection.find({}, {"_id": 0, "embedding": 0}))  # Exclude embedding field
        print(f"Fetched {len(courses)} courses from MongoDB.")
        return courses
    except Exception as e:
        raise RuntimeError(f"Failed to fetch courses from MongoDB: {str(e)}")

def transfer_courses_to_neo4j(mongo_collection, neo4j_connector):
    """
    Transfer course data from MongoDB to Neo4j.
    """
    courses = fetch_all_courses(mongo_collection)
    for course in courses:
        # print(f"Inserting course into Neo4j: {course}")
        neo4j_connector.insert_course(course)

if __name__ == "__main__":
    try:
        # MongoDB Connection
        mongo_client = get_mongo_client()
        mongo_collection = initialize_mongo_database(mongo_client, "course_catalog", "courses")

        # Neo4j Connection
        neo4j_uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        neo4j_user = os.getenv("NEO4J_USER", "neo4j")
        neo4j_password = os.getenv("NEO4J_PASSWORD", "password")

        neo4j_connector = Neo4jConnector(neo4j_uri, neo4j_user, neo4j_password)

        # Transfer Data
        transfer_courses_to_neo4j(mongo_collection, neo4j_connector)
        print("Data transfer from MongoDB to Neo4j completed successfully.")
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        if 'neo4j_connector' in locals():
            neo4j_connector.close()
