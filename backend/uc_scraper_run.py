from helpers.scrapers.uc_catalog_scraper import UChicagoCatalogScraper
from helpers.RAG import RAG



# Initialize scraper and RAG
major = "computerscience"
scraper = UChicagoCatalogScraper(major)

# Scrape courses
courses = scraper._scrape()

print(courses)
