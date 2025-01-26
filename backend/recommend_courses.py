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
all_courses = fetch_courses_by_major(collection, "economics")

course_list = [course["code"] for course in all_courses]
embedding_list = [course["embedding"] for course in all_courses]

rag = RAG()
query = "i am a student interested in financial markets and machine learning, what courses would best fit me?"
results = rag._find_most_similar_courses(query, course_list, embedding_list, k=10)
print(results)

for x in results:
    print(x in course_codes)

