from helpers.database.mongo import (
    get_mongo_client,
    initialize_mongo_database,
    insert_course,
    fetch_all_courses
)
from helpers.scrapers.uc_catalog_scraper import UChicagoCatalogScraper
from helpers.RAG import RAG
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize MongoDB
client = get_mongo_client()
collection = initialize_mongo_database(client)

# Fetch and print all courses
all_courses = fetch_all_courses(collection)

course_list = [course["code"] for course in all_courses]
embedding_list = [course["embedding"] for course in all_courses]

rag = RAG()
query = "i am a student interested in financial markets and machine learning, what courses would best fit me?"
results = rag._find_most_similar_courses(query, course_list, embedding_list, k=10)
print(results)

