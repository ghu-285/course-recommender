from helpers.database.mongo import (
    get_mongo_client,
    initialize_mongo_database,
    insert_course,
    fetch_all_courses,
    fetch_courses_by_major
)
from helpers.scrapers.uc_catalog_scraper import UChicagoCatalogScraper
from helpers.RAG import RAG
from dotenv import load_dotenv
from user_profile import Student

# Load environment variables
load_dotenv()

email = "gracehu0805@gmail.com"
    
user = Student(email)
user.fetch_data()
course_codes = user.get_courses_taken()

# Initialize MongoDB
client = get_mongo_client()
db_name = "course_catalog"
collection_name = "courses" 
collection = initialize_mongo_database(client, db_name, collection_name)

# Fetch and print all courses
econ_courses = fetch_courses_by_major(collection, "economics")
math_courses = fetch_courses_by_major(collection, "Computer Science")


course_list = [course["code"] for course in econ_courses] + [course["code"] for course in math_courses]
embedding_list = [course["embedding"] for course in econ_courses] + [course["embedding"] for course in math_courses]

#user profile part
import json
json_file_path = "helpers/database/major_requirements.json"
with open(json_file_path, "r") as file:
    major_requirements = json.load(file)
requirements = major_requirements["requirements"]["required"]
electives = major_requirements["requirements"]["electives"]


rag = RAG()
query = "i am a student interested in financial markets and machine learning, what courses would best fit me?"
results = rag._find_most_similar_courses(query, course_list, embedding_list, k=20)
print(results)


