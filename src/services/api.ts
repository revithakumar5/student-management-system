import { User } from '../types';

const API_BASE = '/api';

export const api = {
  login: async (credentials: any) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  // Students
  getStudents: () => fetch(`${API_BASE}/students`).then(res => res.json()),
  addStudent: (data: any) => fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),
  updateStudent: (id: string, data: any) => fetch(`${API_BASE}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),
  deleteStudent: (id: string) => fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' }).then(res => res.json()),

  // Courses
  getCourses: () => fetch(`${API_BASE}/courses`).then(res => res.json()),
  addCourse: (data: any) => fetch(`${API_BASE}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),
  updateCourse: (id: string, data: any) => fetch(`${API_BASE}/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),
  deleteCourse: (id: string) => fetch(`${API_BASE}/courses/${id}`, { method: 'DELETE' }).then(res => res.json()),

  // Attendance
  getAttendance: () => fetch(`${API_BASE}/attendance`).then(res => res.json()),
  addAttendance: (data: any) => fetch(`${API_BASE}/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),
  deleteAttendance: (id: number) => fetch(`${API_BASE}/attendance/${id}`, { method: 'DELETE' }).then(res => res.json()),
  updateAttendance: (id: number, data: any) => fetch(`${API_BASE}/attendance/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),

  // Marks
  getMarks: () => fetch(`${API_BASE}/marks`).then(res => res.json()),
  addMarks: (data: any) => fetch(`${API_BASE}/marks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),
  deleteMarks: (id: number) => fetch(`${API_BASE}/marks/${id}`, { method: 'DELETE' }).then(res => res.json()),
  updateMarks: (id: number, data: any) => fetch(`${API_BASE}/marks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),

  // Fees
  getFees: () => fetch(`${API_BASE}/fees`).then(res => res.json()),
  addFee: (data: any) => fetch(`${API_BASE}/fees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),
  deleteFee: (id: number) => fetch(`${API_BASE}/fees/${id}`, { method: 'DELETE' }).then(res => res.json()),
  updateFee: (id: number, data: any) => fetch(`${API_BASE}/fees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),

  // Assignments
  getAssignments: () => fetch(`${API_BASE}/assignments`).then(res => res.json()),
  addAssignment: (data: any) => fetch(`${API_BASE}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),
  deleteAssignment: (id: number) => fetch(`${API_BASE}/assignments/${id}`, { method: 'DELETE' }).then(res => res.json()),
  updateAssignment: (id: number, data: any) => fetch(`${API_BASE}/assignments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),

  // Announcements
  getAnnouncements: () => fetch(`${API_BASE}/announcements`).then(res => res.json()),
  addAnnouncement: (data: any) => fetch(`${API_BASE}/announcements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),
  deleteAnnouncement: (id: number) => fetch(`${API_BASE}/announcements/${id}`, { method: 'DELETE' }).then(res => res.json()),
  updateAnnouncement: (id: number, data: any) => fetch(`${API_BASE}/announcements/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),

  // Timetable
  getTimetable: () => fetch(`${API_BASE}/timetable`).then(res => res.json()),
  addTimetable: (data: any) => fetch(`${API_BASE}/timetable`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),
  deleteTimetable: (id: number) => fetch(`${API_BASE}/timetable/${id}`, { method: 'DELETE' }).then(res => res.json()),
  updateTimetable: (id: number, data: any) => fetch(`${API_BASE}/timetable/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),

  // Submissions
  getSubmissions: () => fetch(`${API_BASE}/submissions`).then(res => res.json()),
  addSubmission: (data: any) => fetch(`${API_BASE}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),
};
