from helpers.database.mongo import (
    get_mongo_client,
    initialize_mongo_database,
    insert_course,
    fetch_all_courses,
    fetch_courses_by_major
)
from helpers.scrapers.uc_catalog_scraper import UChicagoCatalogScraper
from helpers.RAG import RAG
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize MongoDB
client = get_mongo_client()
db_name = "course_catalog"
collection_name = "courses" 
collection = initialize_mongo_database(client, db_name, collection_name)

# added majors #
#Economics
#Business Economics
#Mathematics
#Computer Science
#Statistics
#Data Science
#Physics
#Chemistry

major = "Chemistry"
scraper = UChicagoCatalogScraper(major)
rag = RAG()

# Scrape courses
courses = scraper._scrape("Chemistry")

# Store courses in MongoDB
for course in courses:
    embedding = rag._embed_description(course.description)
    insert_course(collection, major, course.code, course.title, course.description, embedding)
