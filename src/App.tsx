import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { User } from './types';
import Login from './components/Login';
import StaffDashboard from './components/StaffDashboard';
import StudentDashboard from './components/StudentDashboard';
import { LogOut, LayoutDashboard, Users, BookOpen, CalendarCheck, FileText, CreditCard, ClipboardList, Megaphone, Calendar, UserCircle, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const Layout = ({ user, onLogout, children, activeTab, setActiveTab }: any) => {
  const navigate = useNavigate();

  const staffMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'marks', label: 'Marks', icon: FileText },
    { id: 'fees', label: 'Fees', icon: CreditCard },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const studentMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: UserCircle },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'marks', label: 'Results', icon: FileText },
    { id: 'fees', label: 'Fee History', icon: CreditCard },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
  ];

  const menu = user.role === 'staff' ? staffMenu : studentMenu;

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 h-screen overflow-y-auto shrink-0">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-none">SMS</h1>
            <p className="text-xs text-slate-500 mt-1">Management System</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {menu.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
              <UserCircle size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sms_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('sms_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sms_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab}>
        {user.role === 'staff' ? (
          <StaffDashboard activeTab={activeTab} />
        ) : (
          <StudentDashboard activeTab={activeTab} user={user} />
        )}
      </Layout>
    </Router>
  );
}
