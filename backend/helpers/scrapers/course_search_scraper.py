from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def scrape_course_search(search_text, term_value="2252"):
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

    #add sleep to let the page load
    time.sleep(2) 

    # -- Extract Results --
    results = []

    # get all elements associated to the sections we need
    titles = driver.find_elements(By.CSS_SELECTOR, "span[id^='UC_CLSRCH_WRK_UC_CLASS_TITLE']")
    sections = driver.find_elements(By.CSS_SELECTOR, "span[id^='UC_CLSRCH_WRK_DESCR1']")
    instructors = driver.find_elements(By.CSS_SELECTOR, "span[id^='UC_CLSRCH_WRK_SSR_INSTR_LONG']")
    meeting_times = driver.find_elements(By.CSS_SELECTOR, "span[id^='UC_PREREG_WRK_DESCRLONG']")

    # 2) Find the divs that contain the raw text like "BUSN 20400/1 [22278] - LEC"
    #    Adjust this selector if needed to match your actual HTML structure.
    raw_course_info = driver.find_elements(By.CSS_SELECTOR, "div[id^='win0divUC_RSLT_NAV_WRK_HTMLAREA'] div.ps-htmlarea")

    print(f"Found {len(titles)} titles, {len(sections)} sections, {len(instructors)} instructors, {len(meeting_times)} meeting times, {len(raw_course_info)} raw course-info divs.")

    # -- Debug prints --
    for i, info in enumerate(raw_course_info):
        print(f"Raw course info {i}: {info.text.strip()}")

    # -- Match Data and Collect Results --
    num_results = max(
        len(titles),
        len(sections),
        len(instructors),
        len(meeting_times),
        len(raw_course_info)
    )

    for i in range(num_results):
        try:
            title       = titles[i].text.strip()       if i < len(titles)       else "N/A"
            section     = sections[i].text.strip()     if i < len(sections)     else "N/A"
            instructor  = instructors[i].text.strip()  if i < len(instructors)  else "N/A"
            meeting_time= meeting_times[i].text.strip()if i < len(meeting_times)else "N/A"

            # extract the course code line
            raw_info = raw_course_info[i].text.strip() if i < len(raw_course_info) else ""
            first_line = raw_info.split("\n")[0] if raw_info else ""
            # parse the line
            course_code = first_line.split("/")[0].replace(" ", "")

            # Check if search text matches the section or title
            if (search_text.lower() in section.lower() or
                search_text.lower() in title.lower()):
                result_dict = {
                    "course_code": course_code,
                    "title": title,
                    "enrollment": section,
                    "instructor": instructor,
                    "meeting_time": meeting_time
                }
                results.append(result_dict)

        except Exception as e:
            print(f"Error parsing result {i}: {e}")
            continue

    driver.quit()
    print(results)
    return results

if __name__ == "__main__":
    scrape_course_search(search_text="Investments", term_value="2252")
