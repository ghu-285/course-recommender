import PyPDF2
from helpers.transcript_reader import TranscriptParser

# Function to extract text from a PDF file
def extract_text_from_pdf(pdf_path):
    try:
        with open(pdf_path, 'rb') as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
            return text
    except Exception as e:
        raise ValueError(f"Failed to read the PDF file: {e}")

# Example Usage
pdf_path = "smtranscript.pdf"
extracted_text = extract_text_from_pdf(pdf_path)

# Initialize the parser with the extracted text
parser = TranscriptParser(extracted_text)

# Extract details
courses = parser.get_courses_codes()
gpa = parser.get_gpa()
print("gpa: ")
print(gpa)
print("Courses:")
for course in courses:
    print(course)

# from helpers.scrapers.uc_catalog_scraper import UChicagoCatalogScraper

# scraper = UChicagoCatalogScraper("economics")

# # Scrape courses
# try:
#     courses = scraper.scrape()
#     print(f"Found {len(courses)} courses for the Economics major.\n")
#     for course in courses:
#         print(f"Title: {course.title}")
#         print(f"Description: {course.description}")
#         print(f"Prerequisites: {course.prerequisites}")
#         print(f"Terms: {course.terms}\n")
# except Exception as e:
#     print(f"Error: {e}")
