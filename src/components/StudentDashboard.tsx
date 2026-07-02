import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, Student, Course, Attendance, Mark, Fee, Assignment, Announcement, TimetableEntry } from '../types';
import { UserCircle, BookOpen, CalendarCheck, FileText, CreditCard, ClipboardList, Megaphone, Calendar, TrendingUp, Clock, MapPin, Upload, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Modal = ({ isOpen, onClose, title, children }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-8">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

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

const StudentOverview = ({ stats, user }: any) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={BookOpen} label="Enrolled Courses" value={stats.courses} color="bg-indigo-600" />
      <StatCard icon={CalendarCheck} label="My Attendance" value={stats.attendance + '%'} color="bg-emerald-600" />
      <StatCard icon={FileText} label="Average Marks" value={stats.avgMarks} color="bg-amber-600" />
      <StatCard icon={Megaphone} label="Latest News" value={stats.announcements} color="bg-rose-600" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-8">Personal Profile Summary</h3>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
              <UserCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">Student ID: {user.id}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Department</p>
              <p className="text-sm font-semibold text-slate-700">{user.department}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Year / Semester</p>
              <p className="text-sm font-semibold text-slate-700">{user.year} / {user.semester}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Email</p>
              <p className="text-sm font-semibold text-slate-700">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Phone</p>
              <p className="text-sm font-semibold text-slate-700">{user.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-8">Latest Announcements</h3>
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
    </div>
  </div>
);

const ProfileModule = ({ user }: any) => {
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await api.updateStudent(user.id, profile);
    setLoading(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900 mb-8">My Profile</h3>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Student ID</label>
            <input type="text" disabled value={profile.id} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
            <input type="text" disabled value={profile.name} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
            <input type="text" disabled value={profile.department} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input type="text" disabled value={profile.email} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
          <textarea
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default function StudentDashboard({ activeTab, user }: { activeTab: string, user: User }) {
  const [stats, setStats] = useState<any>({
    courses: 0,
    attendance: 0,
    avgMarks: 0,
    announcements: 0,
    recentAnnouncements: [],
  });
  const [data, setData] = useState<any>({
    courses: [],
    attendance: [],
    marks: [],
    fees: [],
    assignments: [],
    timetable: [],
    announcements: [],
    submissions: []
  });

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionFile, setSubmissionFile] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [courses, attendance, marks, fees, assignments, timetable, announcements, submissions] = await Promise.all([
        api.getCourses(),
        api.getAttendance(),
        api.getMarks(),
        api.getFees(),
        api.getAssignments(),
        api.getTimetable(),
        api.getAnnouncements(),
        api.getSubmissions(),
      ]);

      const myAttendance = attendance.filter((a: any) => a.student_id === user.id);
      const presentCount = myAttendance.filter((a: any) => a.status === 'Present').length;
      const attendanceRate = myAttendance.length > 0 ? Math.round((presentCount / myAttendance.length) * 100) : 0;

      const myMarks = marks.filter((m: any) => m.student_id === user.id);
      const avgMarks = myMarks.length > 0 ? Math.round(myMarks.reduce((acc: number, curr: any) => acc + curr.internal_marks + curr.external_marks, 0) / myMarks.length) : 0;

      setStats({
        courses: courses.length,
        attendance: attendanceRate,
        avgMarks: avgMarks,
        announcements: announcements.length,
        recentAnnouncements: announcements.slice(0, 3),
      });

      setData({
        courses,
        attendance: myAttendance,
        marks: myMarks,
        fees: fees.filter((f: any) => f.student_id === user.id),
        assignments: assignments,
        timetable,
        announcements,
        submissions: submissions.filter((s: any) => s.student_id === user.id)
      });
    };

    fetchData();
  }, [user.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSubmissionFile(file.name);
    }
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionFile) {
      alert('Please select a file to submit');
      return;
    }

    try {
      const res = await api.addSubmission({
        assignment_id: selectedAssignment.id,
        student_id: user.id,
        submission_date: new Date().toISOString().split('T')[0],
        file_name: submissionFile
      });

      if (res.success) {
        setIsSubmitModalOpen(false);
        setSubmissionFile('');
        setSelectedAssignment(null);
        
        // Refresh data
        const submissions = await api.getSubmissions();
        setData({ ...data, submissions: submissions.filter((s: any) => s.student_id === user.id) });
        alert('Assignment submitted successfully!');
      } else {
        alert('Failed to submit assignment: ' + (res.message || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Error submitting assignment:', error);
      alert('An error occurred while submitting the assignment: ' + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 capitalize">{activeTab}</h2>
        <p className="text-slate-500 mt-2">Welcome back, {user.name}! Here's your academic summary.</p>
      </header>

      {activeTab === 'dashboard' && <StudentOverview stats={stats} user={user} />}
      {activeTab === 'profile' && <ProfileModule user={user} />}
      
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.courses.map((c: any) => (
            <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen size={24} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">{c.name}</h4>
              <p className="text-sm text-slate-500 mb-4">{c.id}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Instructor</span><span className="font-semibold">{c.instructor}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Semester</span><span className="font-semibold">{c.semester}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Credits</span><span className="font-semibold">{c.credits}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.attendance.map((a: any) => (
                <tr key={a.id}>
                  <td className="px-6 py-4 text-sm text-slate-600">{a.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{a.course_name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${a.status === 'Present' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'marks' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Internal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">External</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.marks.map((m: any) => (
                <tr key={m.id}>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">S{m.semester}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{m.course_name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{m.internal_marks}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{m.external_marks}</td>
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">{m.internal_marks + m.external_marks}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">{m.grade}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Fee</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.fees.map((f: any) => (
                <tr key={f.id}>
                  <td className="px-6 py-4 text-sm text-slate-600">{f.payment_date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{f.total_fee}</td>
                  <td className="px-6 py-4 text-sm text-emerald-600 font-bold">₹{f.paid_amount}</td>
                  <td className="px-6 py-4 text-sm text-rose-600 font-bold">₹{f.total_fee - f.paid_amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${f.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.assignments.map((a: any) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const target = new Date(a.deadline);
            target.setHours(0, 0, 0, 0);
            const diffTime = target.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let deadlineText = `Due in ${diffDays} days`;
            let deadlineColor = 'text-slate-600 bg-slate-50';
            if (diffDays < 0) { deadlineText = 'Overdue'; deadlineColor = 'text-rose-600 bg-rose-50'; }
            else if (diffDays === 0) { deadlineText = 'Due Today'; deadlineColor = 'text-amber-600 bg-amber-50'; }
            else if (diffDays === 1) { deadlineText = 'Due Tomorrow'; deadlineColor = 'text-indigo-600 bg-indigo-50'; }

            const isSubmitted = data.submissions.some((s: any) => s.assignment_id === a.id);
            const submission = data.submissions.find((s: any) => s.assignment_id === a.id);

            return (
              <div key={a.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <ClipboardList size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">{a.title}</h4>
                <p className="text-sm text-indigo-600 font-medium mb-3">{a.course_name}</p>
                <p className="text-sm text-slate-600 mb-6 line-clamp-3">{a.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={14} />
                      <span className="text-xs font-medium">Deadline: {a.deadline}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${deadlineColor}`}>
                      {deadlineText}
                    </span>
                  </div>
                  {isSubmitted ? (
                    <div className="flex flex-col items-end">
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <CheckCircle2 size={14} /> Submitted
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">{submission.file_name}</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setSelectedAssignment(a);
                        setIsSubmitModalOpen(true);
                      }}
                      className="text-xs font-bold text-white px-4 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Day</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Classroom</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.timetable.map((t: any) => (
                <tr key={t.id}>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{t.day}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{t.time}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{t.course_name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{t.classroom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {data.announcements.map((a: any) => (
            <div key={a.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-6">
              <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
                <Megaphone size={28} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-slate-900 mb-2">{a.title}</h4>
                <p className="text-slate-600 mb-4">{a.message}</p>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={14} />
                  <span className="text-xs font-medium">{a.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Assignment"
      >
        {selectedAssignment && (
          <form onSubmit={handleSubmitAssignment} className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-900">{selectedAssignment.title}</h4>
              <p className="text-sm text-slate-500 mt-1">{selectedAssignment.course_name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Submission</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
              >
                <Upload size={32} className="text-slate-400" />
                <p className="text-sm font-medium text-slate-600 text-center">
                  {submissionFile || 'Click to select assignment file'}
                </p>
                <p className="text-xs text-slate-400">PDF, DOCX, JPG (Max 10MB)</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Submit Now
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
