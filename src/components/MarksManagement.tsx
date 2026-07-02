import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Student, Course, Mark } from '../types';
import { Search, Plus, Trash2, FileText, User, BookOpen, TrendingUp, Edit2, X, AlertCircle } from 'lucide-react';
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

export default function MarksManagement() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [markToDelete, setMarkToDelete] = useState<number | null>(null);
  const [currentMark, setCurrentMark] = useState<Partial<Mark>>({
    semester: 1,
    internal_marks: 0,
    external_marks: 0,
    grade: 'A'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [marksData, stuData, couData] = await Promise.all([
      api.getMarks(),
      api.getStudents(),
      api.getCourses()
    ]);
    setMarks(marksData);
    setStudents(stuData);
    setCourses(couData);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMark.student_id || !currentMark.course_id) {
      alert('Please select student and course');
      return;
    }

    // Calculate Grade
    const total = (currentMark.internal_marks || 0) + (currentMark.external_marks || 0);
    let grade = 'F';
    if (total >= 90) grade = 'O';
    else if (total >= 80) grade = 'A+';
    else if (total >= 70) grade = 'A';
    else if (total >= 60) grade = 'B+';
    else if (total >= 50) grade = 'B';
    else if (total >= 40) grade = 'C';
    
    const markData = { ...currentMark, grade };

    try {
      if (currentMark.id) {
        const res = await api.updateMarks(currentMark.id, markData);
        if (res.success) alert('Marks updated successfully!');
        else alert('Failed to update marks: ' + (res.message || 'Unknown error'));
      } else {
        const res = await api.addMarks(markData);
        if (res.success) alert('Marks saved successfully!');
        else alert('Failed to save marks: ' + (res.message || 'Unknown error'));
      }
      
      setIsModalOpen(false);
      fetchData();
      setCurrentMark({
        semester: 1,
        internal_marks: 0,
        external_marks: 0,
        grade: 'A'
      });
    } catch (error: any) {
      console.error('Error saving marks:', error);
      alert('An error occurred while saving marks: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (markToDelete !== null) {
      try {
        const res = await api.deleteMarks(markToDelete);
        if (res.success) {
          setIsDeleteModalOpen(false);
          setMarkToDelete(null);
          fetchData();
          alert('Marks record deleted successfully!');
        } else {
          alert('Failed to delete marks: ' + (res.message || 'Unknown error'));
        }
      } catch (error: any) {
        console.error('Error deleting marks:', error);
        alert('An error occurred while deleting marks: ' + error.message);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Marks Management</h2>
        <button
          onClick={() => {
            setCurrentMark({
              semester: 1,
              internal_marks: 0,
              external_marks: 0,
              grade: 'A'
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Add Student Marks
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sem</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Int / Ext</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marks.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{record.student_name}</p>
                        <p className="text-xs text-slate-500">{record.student_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{record.course_name}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">S{record.semester}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{record.internal_marks} / {record.external_marks}</td>
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">{record.internal_marks + record.external_marks}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">
                      {record.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setCurrentMark(record);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setMarkToDelete(record.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {marks.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No marks records found.
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
        title={currentMark.id ? 'Edit Marks' : 'Add Marks'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Student</label>
            <select
              required
              value={currentMark.student_id || ''}
              onChange={(e) => setCurrentMark({ ...currentMark, student_id: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Course</label>
            <select
              required
              value={currentMark.course_id || ''}
              onChange={(e) => setCurrentMark({ ...currentMark, course_id: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Semester</label>
            <select
              required
              value={currentMark.semester || 1}
              onChange={(e) => setCurrentMark({ ...currentMark, semester: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Internal Marks (max 40)</label>
              <input
                type="number"
                required
                max={40}
                value={currentMark.internal_marks || 0}
                onChange={(e) => setCurrentMark({ ...currentMark, internal_marks: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">External Marks (max 60)</label>
              <input
                type="number"
                required
                max={60}
                value={currentMark.external_marks || 0}
                onChange={(e) => setCurrentMark({ ...currentMark, external_marks: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              {currentMark.id ? 'Update Marks' : 'Save Marks'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Marks"
        message="Are you sure you want to delete this mark record? This action cannot be undone."
      />
    </div>
  );
}
