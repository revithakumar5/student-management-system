export interface Student {
  id: string;
  name: string;
  dob: string;
  department: string;
  year: string;
  semester: string;
  email: string;
  phone: string;
  address: string;
  admission_date: string;
}

export interface Course {
  id: string;
  name: string;
  instructor: string;
  semester: string;
  credits: number;
}

export interface Attendance {
  id: number;
  student_id: string;
  student_name?: string;
  course_id: string;
  course_name?: string;
  date: string;
  status: 'Present' | 'Absent';
}

export interface Mark {
  id: number;
  student_id: string;
  student_name?: string;
  course_id: string;
  course_name?: string;
  semester: number;
  internal_marks: number;
  external_marks: number;
  grade: string;
}

export interface Fee {
  id: number;
  student_id: string;
  student_name?: string;
  total_fee: number;
  paid_amount: number;
  payment_date: string;
  status: 'Paid' | 'Pending';
}

export interface Assignment {
  id: number;
  title: string;
  course_id: string;
  course_name?: string;
  description: string;
  deadline: string;
  file_path?: string;
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  date: string;
}

export interface TimetableEntry {
  id: number;
  course_name: string;
  teacher: string;
  day: string;
  time: string;
  classroom: string;
}

export interface User {
  id: string | number;
  name: string;
  role: 'staff' | 'student';
  [key: string]: any;
}
