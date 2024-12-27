from helpers.database.mongo import (
    get_mongo_client,
    initialize_mongo_database,
    insert_course,
    fetch_all_courses
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
collection = initialize_mongo_database(client)

# Initialize scraper and RAG
scraper = UChicagoCatalogScraper("economics")
rag = RAG()

# Scrape courses
courses = scraper.scrape()

# Store courses in MongoDB
for course in courses:
    embedding = rag._embed_description(course.description)
    insert_course(collection, course.code, course.title, course.description, embedding)
