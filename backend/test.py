from helpers.scrapers.uc_catalog_scraper import UChicagoCatalogScraper
from helpers.RAG import RAG

scraper = UChicagoCatalogScraper("economics")

# Scrape courses
courses = scraper.scrape()
print(courses[0].description)

rag = RAG()
d = rag._embed_description(courses[0].description)
print(d)