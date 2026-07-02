import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Student, Course, Attendance, Mark, Fee, Assignment, Announcement, TimetableEntry } from '../types';
import StudentManagement from './StudentManagement';
import CourseManagement from './CourseManagement';
import AttendanceManagement from './AttendanceManagement';
import MarksManagement from './MarksManagement';
import FeeManagement from './FeeManagement';
import AssignmentManagement from './AssignmentManagement';
import AnnouncementManagement from './AnnouncementManagement';
import TimetableManagement from './TimetableManagement';
import Reports from './Reports';
import { Users, BookOpen, CalendarCheck, FileText, CreditCard, ClipboardList, Megaphone, Calendar, TrendingUp, UserPlus, Clock, BarChart3 } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-100 flex items-center gap-6">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} text-white shadow-lg shadow-indigo-100`}>
      <Icon size={28} />
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-500 mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  </div>
);

const DashboardOverview = ({ stats }: any) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={Users} label="Total Students" value={stats.students} color="bg-indigo-600" />
      <StatCard icon={BookOpen} label="Total Courses" value={stats.courses} color="bg-emerald-600" />
      <StatCard icon={CalendarCheck} label="Attendance Rate" value={stats.attendance + '%'} color="bg-amber-600" />
      <StatCard icon={Megaphone} label="Announcements" value={stats.announcements} color="bg-rose-600" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-slate-900">Recent Announcements</h3>
          <Megaphone className="text-rose-500" size={24} />
        </div>
        <div className="space-y-6">
          {stats.recentAnnouncements.map((a: any) => (
            <div key={a.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                <Megaphone size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900">{a.title}</h4>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{a.message}</p>
                <p className="text-xs text-slate-400 mt-2 font-medium">{a.date}</p>
              </div>
            </div>
          ))}
          {stats.recentAnnouncements.length === 0 && (
            <p className="text-center text-slate-500 py-8">No announcements yet.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-slate-900">Upcoming Assignments</h3>
          <ClipboardList className="text-indigo-500" size={24} />
        </div>
        <div className="space-y-6">
          {stats.upcomingAssignments.map((a: any) => (
            <div key={a.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
                <ClipboardList size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900">{a.title}</h4>
                <p className="text-sm text-slate-600 mt-1">{a.course_name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock size={14} className="text-slate-400" />
                  <p className="text-xs text-slate-400 font-medium">Deadline: {a.deadline}</p>
                </div>
              </div>
            </div>
          ))}
          {stats.upcomingAssignments.length === 0 && (
            <p className="text-center text-slate-500 py-8">No assignments yet.</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default function StaffDashboard({ activeTab }: { activeTab: string }) {
  const [stats, setStats] = useState<any>({
    students: 0,
    courses: 0,
    attendance: 0,
    announcements: 0,
    recentAnnouncements: [],
    upcomingAssignments: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [students, courses, attendance, announcements, assignments] = await Promise.all([
        api.getStudents(),
        api.getCourses(),
        api.getAttendance(),
        api.getAnnouncements(),
        api.getAssignments(),
      ]);

      const presentCount = attendance.filter((a: any) => a.status === 'Present').length;
      const totalAttendance = attendance.length;
      const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

      setStats({
        students: students.length,
        courses: courses.length,
        attendance: attendanceRate,
        announcements: announcements.length,
        recentAnnouncements: announcements.slice(0, 3),
        upcomingAssignments: assignments.slice(0, 3),
      });
    };

    if (activeTab === 'dashboard') {
      fetchStats();
    }
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 capitalize">{activeTab}</h2>
        <p className="text-slate-500 mt-2">Manage your institution's academic data efficiently.</p>
      </header>

      {activeTab === 'dashboard' && <DashboardOverview stats={stats} />}
      {activeTab === 'students' && <StudentManagement />}
      {activeTab === 'courses' && <CourseManagement />}
      {activeTab === 'attendance' && <AttendanceManagement />}
      {activeTab === 'marks' && <MarksManagement />}
      {activeTab === 'fees' && <FeeManagement />}
      {activeTab === 'assignments' && <AssignmentManagement />}
      {activeTab === 'timetable' && <TimetableManagement />}
      {activeTab === 'announcements' && <AnnouncementManagement />}
      {activeTab === 'reports' && <Reports />}
    </div>
  );
}
