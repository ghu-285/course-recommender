from helpers.database.mongo import (
    get_mongo_client,
    initialize_mongo_database,
    fetch_user_data
)
from dotenv import load_dotenv


class Student:
    def __init__(self, email):
        """
        Initialize the User class with the given email.
        """
        self.email = email
        self.client = None
        self.user_data = None

    def connect_to_db(self):
        """
        Initialize the MongoDB client.
        """
        load_dotenv()
        self.client = get_mongo_client()

    def fetch_data(self, db_name="course_recommender", users_collection_name="users"):
        """
        Fetch user data from the database.
        """
        if not self.client:
            self.connect_to_db()
        
        # Initialize users collection
        users_collection = initialize_mongo_database(self.client, db_name, users_collection_name)
        
        # Fetch user data
        self.user_data = fetch_user_data(self.client, self.email)
        if not self.user_data:
            raise ValueError(f"No user found with email: {self.email}")

    def print_user_data(self):
        if not self.user_data:
            raise ValueError("User data not fetched. Call fetch_data() first.")
        
        print("User Data:")
        for key, value in self.user_data.items():
            print(f"{key}: {value}")

    def get_courses_taken(self):
        """
        Extract all course codes from the user's data and return them in an array.
        """
        if not self.user_data:
            raise ValueError("User data not fetched. Call fetch_data() first.")
        
        courses = self.user_data.get("courses", [])
        if not courses:
            print(f"No courses found for user: {self.email}")
            return []
        
        return [course["code"] for course in courses if "code" in course]
