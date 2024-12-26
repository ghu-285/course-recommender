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
      credits: course.earned,
      designation: determineDesignation(course.course_code),
    }))
  };
}

function determineDesignation(courseCode: string): 'Core' | 'Major' | 'Minor' {
  const prefix = courseCode.split(/[\s-]/)[0].toUpperCase();
  
  const designationMap: Record<string, 'Core' | 'Major' | 'Minor'> = {
    'SOSC': 'Core',
    'HUMA': 'Core',
    'PHYS': 'Major',
    'MATH': 'Major',
    'CMSC': 'Major',
    'STAT': 'Major',
    'ECON': 'Minor',
    'CORE': 'Core'
  };
  
  return designationMap[prefix] || 'Major';
}