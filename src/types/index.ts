export type User = {
  email: string;
  name?: string;
  majors: string[];
  minors: string[];
  careerInterests: string[];
  transcript?: File;
  startQuarter?: string;
  gpa?: number;
  courses?: {
    code: string;
    name: string;
    grade: string;
    credits: number;
    designation: 'Core' | 'Major' | 'Minor';
    area?: string;
  }[];
  timePreferences?: {
    timeSlotRanking: string[];
    dayRanking: string[];
    spacing: string;
  };
};

export type CourseDesignation = 'Core Curriculum' | 'Major' | 'Minor';

export type CoreArea = 'Art' | 'Biology' | 'Humanities' | 'Social Science' | 'Civilization';

export type CoursePreference = {
  designation: CourseDesignation;
  count: number;
  coreAreas?: CoreArea[];
};