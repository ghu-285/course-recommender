import requests
from bs4 import BeautifulSoup
from dataclasses import dataclass

@dataclass
class Course:
    code: str
    title: str
    credits: str
    description: str
    instructors: str
    prerequisites: str
    terms: str
    notes: str

class UChicagoCatalogScraper:
    BASE_URL = "http://collegecatalog.uchicago.edu/thecollege/"

    def __init__(self, major: str):
        self.major = major
        url_major = major.lower().replace(" ","")
        self.url = f"{self.BASE_URL}{url_major}/#{url_major}courses"

    def _fetch_page(self):
        response = requests.get(self.url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            return soup
        else:
            raise Exception(f"Failed to fetch page. Status code: {response.status_code}")

    def _get_all_courses(self, soup: str):
        """
        Gets all course and course details from a catalog page

        args:
            soup: the beautiful soup extracted text from fetched page
        Returns:
            courses: a list of Course datatype
        """
        major = self.major
        print(major)
        headings = [h3 for h3 in soup.find_all("h3") if f"{major} Courses" in h3.get_text(strip=True)]
        if not headings:
            raise Exception(f"error")

        courses = []
        last_heading = headings[-1]

        # find everything after the major courses tag
        for sibling in last_heading.find_next_siblings():
            # if sibling is "sc_courseblock", go inside and look for course blocks
            if sibling.name == "div" and "sc_courseblock" in sibling.get("class", []):
                nested_blocks = sibling.find_all("div", class_=["courseblock main", "courseblock subsequence"])
                for block in nested_blocks:
                    self._process_course_block(block, courses)

            # else, process it directly
            elif sibling.name == "div" and "courseblock" in sibling.get("class", [])[0]:
                self._process_course_block(sibling, courses)

        return courses

    def _process_course_block(self, block, courses):
        """
        Helper method to process a single course block and append to courses list.

        args:
            block: The course block to process.
            courses: The list to append the processed course to.
        """
        # main course details
        title_tag = block.find("p", class_="courseblocktitle")
        if title_tag:
            title_info = title_tag.get_text(strip=True).split(".")
            code = title_info[0].strip().replace('\xa0', ' ') if len(title_info) > 0 else "N/A"
            title = title_info[1].strip() if len(title_info) > 1 else "N/A"
            credits = title_info[2].strip() if len(title_info) > 2 else "N/A"
        else:
            code = "N/A"
            title = "N/A"
            credits = "N/A"

        # extract course description
        description_tag = block.find("p", class_="courseblockdesc")
        description = description_tag.get_text(strip=True) if description_tag else "N/A"

        # extract extra details including profs and terms
        detail_tag = block.find("p", class_="courseblockdetail")
        details = detail_tag.get_text(strip=True) if detail_tag else ""

        # pattern recognition to get instructors
        instructors = "N/A"
        if "Instructor(s):" in details:
            instructors_str = details.split("Instructor(s):")[1].split("Terms Offered:")[0].strip()
            instructors = instructors_str.split(";")
            instructors = [i.strip() for i in instructors]

        # get terms
        terms = "N/A"
        if "Terms Offered:" in details:
            terms_str = details.split("Terms Offered:")[1].split("Prerequisite(s):")[0].strip().replace('\n', ',')
            terms = terms_str.split(",")

        # prerequisites
        prerequisites = "N/A"
        if "Prerequisite(s):" in details:
            prerequisites = details.split("Prerequisite(s):")[1].split("Note(s):")[0].strip()

        # notes
        notes = "N/A"
        if "Note(s):" in details:
            notes = details.split("Note(s):")[1].strip()

        courses.append(Course(code, title, credits, description, instructors, prerequisites, terms, notes))


    def _scrape(self):
        """
        Fetch page and get all courses
        """
        html = self._fetch_page()
        courses = self._get_all_courses(html) 

        return courses