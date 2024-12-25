import re

class TranscriptParser:
    """
    Tool that that uses regex to parse a uchicago transcript 
    """
    def __init__(self, text):
        self.text = text

    def get_name(self):
        match = re.search(r"Name:\s+([\w\s]+)", self.text)
        return match.group(1).strip() if match else None

    def get_student_id(self):
        match = re.search(r"Student ID:\s+(\d+)", self.text)
        return match.group(1).strip() if match else None

    def get_gpa(self):
        match = re.search(r"Cumulative GPA:\s+([\d.]+)", self.text)
        return float(match.group(1).strip()) if match else None

    def get_courses_codes(self):
        """
        More simple and reliable pattern search to find course codes taken

        Returns:
            course_codes: a string array of course codes ex. ECON 20000
        """
        lines = self.text.splitlines()
        course_codes = []
        for line in lines:
            print(line)
            if re.match(r"[A-Z]{4} \d{5}", line[:10]):
                course_codes.append(line[:10].strip())
        return course_codes

    def get_courses_descriptive(self):
        courses = []
        term_matches = re.finditer(
            r"(Autumn|Winter|Spring) \d{4}Course Description Attempted Earned Grade([\s\S]*?)(?=(Autumn|Winter|Spring|Undergraduate Career Totals|End of Undergraduate))",
            self.text,
        )
        for term in term_matches:
            term_name = term.group(1)
            course_details = term.group(2)
            for course_match in re.finditer(
                r"([A-Z]{4} \d{5})([A-Za-z0-9:,'\-\s]+?)(\d+)\s+(\d+)\s+([A-F][+-]?)", course_details
            ):
                course_code = course_match.group(1).strip()
                course_name = course_match.group(2).strip()
                attempted = int(course_match.group(3))
                earned = int(course_match.group(4))
                grade = course_match.group(5).strip()
                courses.append(
                    {
                        "term": term_name,
                        "course_code": course_code,
                        "course_name": course_name,
                        "attempted": attempted,
                        "earned": earned,
                        "grade": grade,
                    }
                )
        return courses

    def get_cumulative_credits(self):
        match = re.search(r"Cumulative Totals\s+(\d+)\s+(\d+)", self.text)
        if match:
            attempted, earned = map(int, match.groups())
            return {"attempted": attempted, "earned": earned}
        return None
