export interface Course {
  course_code: string;
  course_name: string;
  grade: string;
  earned: number;
  attempted: number;
  term: string;
}

export interface TranscriptResponse {
  name: string;
  student_id: string;
  gpa: number;
  courses: Course[];
  credits: {
    attempted: number;
    earned: number;
  };
}