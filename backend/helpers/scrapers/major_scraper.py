import requests
from bs4 import BeautifulSoup

# Array of all majors with their URLs
majors = [
    "anthropology",
    "architecturalstudies",
    "arthistory",
    "astronomyastrophysics",
    "biologicalchemistry",
    "biologicalsciences",
    "chemistry",
    "cinemamediastudies",
    "classicalstudies",
    "cognitivescience",
    "comparativehumandevelopment",
    "comparativeliterature",
    "caam",  # Computational and Applied Mathematics
    "computationalsocialscience",
    "computerscience",
    "creativewriting",
    "comparativeraceethnicstudies",
    "datascience",
    "democracystudies",
    "digitalstudies",
    "eastasianlanguagescivilizations",
    "economics",
    "educationandsociety",
    "englishlanguageliterature",
    "environmentalscience",
    "environmentalstudies",
    "cegu",  # Environment, Geography, and Urbanization
    "fundamentalsissuesandtexts",
    "genderstudies",
    "geographicalstudies",  # Geographic Information Science
    "geophysicalsciences",
    "germanicstudies",
    "globalstudies",
    "healthandsociety",
    "history",
    "scienceandmedicinehips",  # History, Philosophy, and Social Studies of Science and Medicine
    "humanrights",
    "inequalityandsocialchange",
    "inquiryresearchhumanities",
    "jewishstudies",
    "latinamericanstudies",
    "lawlettersandsociety",
    "linguistics",
    "mathematics",
    "mediaartsanddesign",
    "medievalstudies",
    "neareasternlanguagescivilizations",  # Middle Eastern Studies
    "molecularengineering",
    "music",
    "neuroscience",
    "norwegianstudies",
    "philosophy",
    "physics",
    "politicalscience",
    "psychology",
    "publicpolicystudies",
    "quantitativesocialanalysis",
    "rdin",  # Race, Diaspora, and Indigeneity
    "religiousstudies",
    "renaissancestudies",
    "romancelanguagesliteratures",
    "slaviclanguagesliteratures",  # Russian and East European Studies
    "sciencecommunicationpublicdiscourse",
    "sociology",
    "southasianlanguagescivilizations",  # South Asian Languages and Civilizations
    "statistics",
    "theaterperformancestudies",
    "visualarts",
    "yiddish"
]

base_url = "http://collegecatalog.uchicago.edu/thecollege/"

def check_major_courses(major_name):
    """
    Checks if a major page has a "Courses" section.
    """
    url = f"{base_url}{major_name}/"
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch page for {major_name}. Status Code: {response.status_code}")
            return False

        soup = BeautifulSoup(response.content, 'html.parser')
        # Check for the presence of a "Courses" section
        heading = soup.find('h3', string=lambda text: text and "Courses" in text)
        return heading is not None
    except Exception as e:
        print(f"Error checking {major_name}: {e}")
        return False

def main():
    """
    Main function to find majors without "Courses" section.
    """
    no_courses_section = []

    for major in majors:
        print(f"Checking {major}...")
        if not check_major_courses(major):
            no_courses_section.append(major)

    print("\nMajors without 'Courses' section:")
    for major in no_courses_section:
        print(major)

if __name__ == "__main__":
    main()
