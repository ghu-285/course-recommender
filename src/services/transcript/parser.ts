import { User } from '../../types';

export function parseStudentInfo(text: string) {
  const nameMatch = text.match(/Name:\s+([\w\s]+)/i);
  const gpaMatch = text.match(/GPA:\s*([\d.]+)/i);
  
  return {
    name: nameMatch ? nameMatch[1].trim() : undefined,
    gpa: gpaMatch ? parseFloat(gpaMatch[1]) : undefined,
  };
}

export function parseCourses(text: string) {
  const courses = [];
  const coursePattern = /([A-Z]{2,4}\s*\d{3,5})\s+([^0-9\n]+?)\s+(\d+(?:\.\d+)?)\s*(?:credits?)?\s+([A-F][+-]?)/gi;
  let match;
  
  while ((match = coursePattern.exec(text)) !== null) {
    courses.push({
      code: match[1].trim(),
      name: match[2].trim(),
      credits: parseFloat(match[3]),
      grade: match[4].trim(),
      designation: determineDesignation(match[1].trim())
    });
  }
  
  return courses;
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