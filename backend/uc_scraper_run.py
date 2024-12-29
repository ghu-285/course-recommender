from helpers.scrapers.uc_catalog_scraper import UChicagoCatalogScraper
from helpers.RAG import RAG



# Initialize scraper and RAG
major = "Mathematics"
scraper = UChicagoCatalogScraper(major)

# Scrape courses
courses = scraper._scrape()

print(courses)
