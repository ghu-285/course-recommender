from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def scrape_course_search(term_value, search_text):
    """
    Example function to scrape the PeopleSoft Class Search page:
    1) Select the term (like 'Winter 2025'),
    2) Type in a search keyword (like 'BUSN 20400'),
    3) Click Search,
    4) Extract results: Title, Enrollment, Instructor, Day/Time.
    """

    # -- 1. Setup driver --
    driver = webdriver.Chrome()
    
    # -- 2. Go to the PeopleSoft Class Search page (update this URL to match your environment) --
    #    The snippet from your HTML suggests this might be something like:
    url = "https://coursesearch92.ais.uchicago.edu/psc/prd92guest/EMPLOYEE/HRMS/c/UC_STUDENT_RECORDS_FL.UC_CLASS_SEARCH_FL.GBL"
    driver.get(url)

    # Wait for the page to load somewhat
    driver.implicitly_wait(10)

    # -- 3. Select the Term from the dropdown (e.g. 'Winter 2025' = value "2252") --
    #    The <select id="UC_CLSRCH_WRK2_STRM"> is the Term dropdown. We send the term_value directly.
    term_dropdown = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "UC_CLSRCH_WRK2_STRM"))
    )
    term_dropdown.send_keys(term_value)
    time.sleep(1)  # slight pause in case it triggers a partial refresh

    # -- 4. Enter the search keyword (like "BUSN 20400"). (We do NOT pick My Career) --
    #    The search input is <input id="UC_CLSRCH_WRK2_PTUN_KEYWORD" ...>
    keyword_box = driver.find_element(By.ID, "UC_CLSRCH_WRK2_PTUN_KEYWORD")
    keyword_box.clear()
    keyword_box.send_keys(search_text)

    # -- 5. Click the main Search button.
    #    "Refine Search" panel has a separate "Search" button: "UC_CLSRCH_WRK2_SEARCH_BTN"
    #    Or the magnifying glass icon: "UC_CLSRCH_WRK_SSR_PB_SEARCH"
    #    From your snippet, the plain text "Search" button is ID = "UC_CLSRCH_WRK2_SEARCH_BTN"
    #    But in some pages the magnifying glass is "UC_CLSRCH_WRK_SSR_PB_SEARCH".
    #    Use whichever actually triggers the search in your environment.
    
    # Here, I'll try "UC_CLSRCH_WRK2_SEARCH_BTN". 
    # If that fails, try the other ID from your snippet:
    #   search_btn = driver.find_element(By.CSS_SELECTOR, "#UC_CLSRCH_WRK_SSR_PB_SEARCH")
    # or:
    #   search_btn = driver.find_element(By.ID, "UC_CLSRCH_WRK2_SEARCH_BTN")
    
    try:
        search_btn = driver.find_element(By.ID, "UC_CLSRCH_WRK2_SEARCH_BTN")
    except:
        # fallback if that doesn't exist, e.g. the magnifying glass
        search_btn = driver.find_element(By.ID, "UC_CLSRCH_WRK_SSR_PB_SEARCH")
    
    search_btn.click()

    # -- 6. Wait for potential results. 
    #    In PeopleSoft, the result rows often have tr IDs containing 'DESCR100' & '_row_'.
    #    We'll wait up to 10 seconds for at least one row.
    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, "//tr[contains(@id,'DESCR100') and contains(@id,'_row_')]")
            )
        )
    except:
        print("No results found or the page did not load any rows in time.")
        driver.quit()
        return []

    # -- 7. Grab all rows in the "DESCR100$grid$0" table. 
    #    Typically:  <tr class="ps_grid-row" id="DESCR100$0_row_0">
    rows = driver.find_elements(By.XPATH, "//tr[contains(@id,'DESCR100') and contains(@id,'_row_')]")

    # -- 8. Parse out Title, Enrollment, Instructor, Day/Time from each row. --
    results = []
    for row in rows:
        # Each row has 3 <td> we care about:
        #   td[0] => Title area
        #   td[1] => Enrollment info
        #   td[2] => Instructor & day/time
        cells = row.find_elements(By.TAG_NAME, "td")
        if len(cells) < 3:
            # Possibly not a data row
            continue

        title = ""
        enroll = ""
        instr = ""
        day_time = ""

        # -- Title => in first cell => maybe "span.ps_box-value" or partial ID "CLASS_TITLE" 
        # We'll try the broader approach:
        #   Look for a <span> in that cell with class "ps_box-value".
        #   Or partial ID match: contains(@id,'CLASS_TITLE')
        try:
            title_el = cells[0].find_element(By.CSS_SELECTOR, ".ps_box-value")
            title = title_el.text.strip()
        except:
            pass

        # -- Enrollment => second cell => e.g. "Section Enrollment: 65/65"
        try:
            enroll_el = cells[1].find_element(By.CSS_SELECTOR, ".ps_box-value")
            enroll = enroll_el.text.strip()
        except:
            pass

        # -- Instructor & day/time => third cell => 
        #    Usually 2 <span> or <div> with IDs containing "SSR_INSTR_LONG" and "DESCRLONG"
        #    We'll do a simpler approach: get all .ps_box-value in that cell
        #    Typically index 0 => instructor, index 1 => day/time
        instr_spans = cells[2].find_elements(By.CSS_SELECTOR, ".ps_box-value")
        if len(instr_spans) >= 1:
            instr = instr_spans[0].text.strip()
        if len(instr_spans) >= 2:
            day_time = instr_spans[1].text.strip()

        result_dict = {
            "title": title,
            "enrollment": enroll,
            "instructor": instr,
            "day_time": day_time,
        }
        results.append(result_dict)

    # -- 9. Print or return
    print(f"\nFound {len(results)} results for search='{search_text}', term='{term_value}':\n")
    for i, course in enumerate(results, start=1):
        print(f"{i}. TITLE       = {course['title']}")
        print(f"   ENROLLMENT = {course['enrollment']}")
        print(f"   INSTRUCTOR = {course['instructor']}")
        print(f"   DAY/TIME   = {course['day_time']}\n")

    driver.quit()
    return results


if __name__ == "__main__":
    # Example usage:
    #  - We want "Winter 2025" which is "2252" from your snippet
    #  - Searching e.g. "BUSN 20400"
    results = scrape_course_search(term_value="2252", search_text="MATH 16200")
