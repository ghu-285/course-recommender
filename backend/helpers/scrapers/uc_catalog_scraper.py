import requests
from bs4 import BeautifulSoup
from dataclasses import dataclass

@dataclass
class Course:
    title: str
    description: str
    prerequisites: str
    terms: str

class UChicagoCatalogScraper:
    BASE_URL = "http://collegecatalog.uchicago.edu/thecollege/"

    def __init__(self, major: str):
        self.major = major.lower()
        self.url = f"{self.BASE_URL}{self.major}/#{self.major}courses"

    def fetch_page(self):
        """Fetch the catalog page for the specified major."""
        response = requests.get(self.url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            return soup.get_text
        else:
            raise Exception(f"Failed to fetch page. Status code: {response.status_code}")

    def get_last_courses_divs(self, html: str):
        """Find the last 'Economics Courses' heading and extract related course divs."""
        soup = BeautifulSoup(html, "html.parser")
        
        headings = [h3 for h3 in soup.find_all("h3") if "Economics Courses" in h3.get_text(strip=True)]
        if not headings:
            raise Exception(f"'Economics Courses' heading not found on the page.")

        last_heading = headings[-1]

        course_divs = []
        for sibling in last_heading.find_next_siblings():
            if sibling.name == "div" and "courseblock main" in sibling.get("class", []):
                course_divs.append(sibling)
        print(course_divs)

        return course_divs

    def scrape(self):
        """Main method to scrape the courses divs."""
        html = self.fetch_page()
        course_divs = self.get_last_courses_divs(html)
        
        courses = []
        for div in course_divs:
            courses.append(div.get_text(strip=True))
        return courses