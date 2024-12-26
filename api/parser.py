import re
import io
from PyPDF2 import PdfReader

class TranscriptParser:
    def __init__(self, pdf_file):
        self.text = self.extract_text(pdf_file)

    def extract_text(self, pdf_file):
        try:
            pdf_stream = io.BytesIO(pdf_file)
            reader = PdfReader(pdf_stream)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
            print("Extracted text from PDF:", text[:500])  # Log first 500 characters
            return text
        except Exception as e:
            raise ValueError(f"Failed to extract text from PDF: {str(e)}")

    def get_name(self):
        match = re.search(r"Name:\s+(.+)", self.text)
        return match.group(1).strip() if match else None

    def get_student_id(self):
        match = re.search(r"Student ID:\s+(\d+)", self.text)
        return match.group(1).strip() if match else None

    def get_gpa(self):
        match = re.search(r"Cumulative GPA:\s+([\d.]+)", self.text)
        return float(match.group(1).strip()) if match else None

    def get_start_quarter(self):
        match = re.search(r"Start Quarter:\s+([A-Za-z]+\s+\d{4})", self.text)
        if match:
            extracted_quarter = match.group(1).strip()
            print(f"Extracted startQuarter: {extracted_quarter}")  # Debug log
            return extracted_quarter
        print("Failed to extract startQuarter from text.")  # Debug log
        return None

    def get_courses_descriptive(self):
        courses = []
        term_matches = re.finditer(
            r"(Autumn|Winter|Spring) \d{4}\nCourse Description Attempted Earned Grade\n([\s\S]*?)(?=\n(?:Autumn|Winter|Spring|Undergraduate Career Totals|End of Undergraduate))",
            self.text,
        )
        for term in term_matches:
            term_name = term.group(1) + " " + re.search(r"\d{4}", term.group(0)).group(0)
            course_details = term.group(2)
            for course_match in re.finditer(
                r"([A-Z]{4} \d{5})"
                r"([A-Za-z0-9\s\-,:']+?)"
                r"\s+(\d{1,3})"
                r"\s+(\d{1,3})"
                r"([A-FP][+-]?)",
                course_details
            ):
                courses.append({
                    "term": term_name,
                    "course_code": course_match.group(1).strip(),
                    "course_name": course_match.group(2).strip(),
                    "attempted": int(course_match.group(3).strip()),
                    "earned": int(course_match.group(4).strip()),
                    "grade": course_match.group(5).strip(),
                })
        return courses

    def get_cumulative_credits(self):
        match = re.search(r"Cumulative Totals\s+(\d+)\s+(\d+)", self.text)
        if match:
            attempted, earned = map(int, match.groups())
            return {"attempted": attempted, "earned": earned}
        return None