import type { Course } from '../api/types';
import type { User } from '../../types';

export function mapTranscriptToUser(data: any): Partial<User> {
  return {
    name: data.name,
    gpa: data.gpa,
    startQuarter: data.startQuarter,
    courses: data.courses.map((course: Course) => ({
      code: course.course_code,
      name: course.course_name,
      grade: course.grade,
    }))
  };
}