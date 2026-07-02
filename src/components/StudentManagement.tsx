import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Student } from '../types';
import { Search, UserPlus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
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
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-8 max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: any) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <div className="text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={32} />
      </div>
      <p className="text-slate-600 mb-8">{message}</p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
        >
          Confirm Delete
        </button>
      </div>
    </div>
  </Modal>
);

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({});
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const data = await api.getStudents();
    setStudents(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStudent.id && students.find(s => s.id === currentStudent.id && s.id !== currentStudent.id)) {
      alert('Student ID already exists');
      return;
    }

    try {
      const isEdit = students.some(s => s.id === currentStudent.id);
      if (isEdit) {
        const res = await api.updateStudent(currentStudent.id!, currentStudent);
        if (res.success) alert('Student updated successfully!');
        else alert('Failed to update student: ' + (res.message || 'Unknown error'));
      } else {
        const res = await api.addStudent(currentStudent);
        if (res.success) alert('Student added successfully!');
        else alert('Failed to add student: ' + (res.message || 'Unknown error'));
      }
      
      setIsModalOpen(false);
      fetchStudents();
    } catch (error: any) {
      console.error('Error saving student:', error);
      alert('An error occurred while saving student: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (studentToDelete) {
      try {
        const res = await api.deleteStudent(studentToDelete);
        if (res.success) {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
          fetchStudents();
          alert('Student deleted successfully!');
        } else {
          alert('Failed to delete student: ' + (res.message || 'Unknown error'));
        }
      } catch (error: any) {
        console.error('Error deleting student:', error);
        alert('An error occurred while deleting student: ' + error.message);
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by ID, Name, Email, Dept..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
        </div>
        <button
          onClick={() => {
            setCurrentStudent({});
            setIsModalOpen(true);
          }}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <UserPlus size={20} />
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Year/Sem</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">{student.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{student.department}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{student.year} / {student.semester}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{student.email}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setCurrentStudent(student);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setStudentToDelete(student.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentStudent.id ? 'Edit Student' : 'Add New Student'}
      >
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Student ID</label>
            <input
              type="text"
              required
              disabled={!!currentStudent.id && students.some(s => s.id === currentStudent.id)}
              value={currentStudent.id || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, id: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={currentStudent.name || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Birth (DDMMYYYY)</label>
            <input
              type="text"
              required
              placeholder="e.g. 08092005"
              value={currentStudent.dob || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, dob: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
            <input
              type="text"
              required
              value={currentStudent.department || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, department: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Year</label>
            <select
              value={currentStudent.year || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, year: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Semester</label>
            <select
              value={currentStudent.semester || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, semester: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={currentStudent.email || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
            <input
              type="tel"
              required
              value={currentStudent.phone || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
            <textarea
              required
              value={currentStudent.address || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, address: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Admission Date</label>
            <input
              type="date"
              required
              value={currentStudent.admission_date || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, admission_date: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              {currentStudent.id && students.some(s => s.id === currentStudent.id) ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
      />
    </div>
  );
}
