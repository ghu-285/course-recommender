from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def scrape_course_search(term_value, search_text):
    driver = webdriver.Chrome()
    url = "https://coursesearch92.ais.uchicago.edu/psc/prd92guest/EMPLOYEE/HRMS/c/UC_STUDENT_RECORDS_FL.UC_CLASS_SEARCH_FL.GBL"
    driver.get(url)
    driver.maximize_window()
    driver.implicitly_wait(10)

    # -- Select Term --
    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.ID, "UC_CLSRCH_WRK2_STRM"))
    ).send_keys(term_value)
    print("Selected term successfully.")

    # -- Enter search keyword --
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "UC_CLSRCH_WRK2_PTUN_KEYWORD"))
    ).send_keys(search_text)
    print("Entered search keyword.")

    # -- Click Search Button --
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, "UC_CLSRCH_WRK2_SEARCH_BTN"))
    ).click()
    print("Clicked search button.")

    # -- Wait for Results --
    WebDriverWait(driver, 20).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "span[id^='UC_CLSRCH_WRK_UC_CLASS_TITLE']"))
    )
    print("Results loaded.")

    # -- Extract Results --
    results = []

    # Get all course titles
    titles = driver.find_elements(By.CSS_SELECTOR, "span[id^='UC_CLSRCH_WRK_UC_CLASS_TITLE']")
    sections = driver.find_elements(By.CSS_SELECTOR, "span[id^='UC_CLSRCH_WRK_DESCR1']")
    instructors = driver.find_elements(By.CSS_SELECTOR, "span[id^='UC_CLSRCH_WRK_SSR_INSTR_LONG']")
    meeting_times = driver.find_elements(By.CSS_SELECTOR, "span[id^='UC_PREREG_WRK_DESCRLONG']")

    print(f"Found {len(titles)} titles, {len(sections)} sections, {len(instructors)} instructors, {len(meeting_times)} meeting times.")

    # Debug: Print raw data
    for i, title in enumerate(titles):
        print(f"Title {i}: {title.text.strip()}")

    for i, section in enumerate(sections):
        print(f"Section {i}: {section.text.strip()}")

    for i, instructor in enumerate(instructors):
        print(f"Instructor {i}: {instructor.text.strip()}")

    for i, meeting_time in enumerate(meeting_times):
        print(f"Meeting Time {i}: {meeting_time.text.strip()}")

    # -- Match Data and Collect Results --
    num_results = max(len(titles), len(sections), len(instructors), len(meeting_times))

    for i in range(num_results):
        try:
            title = titles[i].text.strip() if i < len(titles) else "N/A"
            section = sections[i].text.strip() if i < len(sections) else "N/A"
            instructor = instructors[i].text.strip() if i < len(instructors) else "N/A"
            meeting_time = meeting_times[i].text.strip() if i < len(meeting_times) else "N/A"

            # Check if search text matches the section or title
            if search_text.lower() in section.lower() or search_text.lower() in title.lower():
                result_dict = {
                    "title": title,
                    "section": section,
                    "instructor": instructor,
                    "meeting_time": meeting_time
                }
                results.append(result_dict)

        except Exception as e:
            print(f"Error parsing result {i}: {e}")
            continue

    # -- Display Results --
    if results:
        for i, course in enumerate(results, 1):
            print(f"{i}. TITLE        = {course['title']}")
            print(f"   SECTION     = {course['section']}")
            print(f"   INSTRUCTOR  = {course['instructor']}")
            print(f"   MEETING TIME= {course['meeting_time']}\n")
    else:
        print("No matching results found.")

    driver.quit()
    return results


if __name__ == "__main__":
    scrape_course_search(term_value="2252", search_text="Investments")
