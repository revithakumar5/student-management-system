import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Course } from '../types';
import { Search, Plus, Edit2, Trash2, X, AlertCircle, BookOpen } from 'lucide-react';
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

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const data = await api.getCourses();
    setCourses(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = courses.some(c => c.id === currentCourse.id);
      if (isEdit) {
        const res = await api.updateCourse(currentCourse.id!, currentCourse);
        if (res.success) alert('Course updated successfully!');
        else alert('Failed to update course: ' + (res.message || 'Unknown error'));
      } else {
        const res = await api.addCourse(currentCourse);
        if (res.success) alert('Course added successfully!');
        else alert('Failed to add course: ' + (res.message || 'Unknown error'));
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (error: any) {
      console.error('Error saving course:', error);
      alert('An error occurred while saving course: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (courseToDelete) {
      try {
        const res = await api.deleteCourse(courseToDelete);
        if (res.success) {
          setIsDeleteModalOpen(false);
          setCourseToDelete(null);
          fetchCourses();
          alert('Course deleted successfully!');
        } else {
          alert('Failed to delete course: ' + (res.message || 'Unknown error'));
        }
      } catch (error: any) {
        console.error('Error deleting course:', error);
        alert('An error occurred while deleting course: ' + error.message);
      }
    }
  };

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by ID, Name, Instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
        </div>
        <button
          onClick={() => {
            setCurrentCourse({});
            setIsModalOpen(true);
          }}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <motion.div
            layout
            key={course.id}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <BookOpen size={24} />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setCurrentCourse(course);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => {
                    setCourseToDelete(course.id);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">{course.name}</h4>
            <p className="text-sm text-slate-500 font-medium mb-4">{course.id}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Instructor</span>
                <span className="font-semibold text-slate-700">{course.instructor}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Semester</span>
                <span className="font-semibold text-slate-700">{course.semester}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Credits</span>
                <span className="font-semibold text-slate-700">{course.credits}</span>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No courses found.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCourse.id ? 'Edit Course' : 'Add New Course'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Course ID</label>
            <input
              type="text"
              required
              disabled={!!currentCourse.id && courses.some(c => c.id === currentCourse.id)}
              value={currentCourse.id || ''}
              onChange={(e) => setCurrentCourse({ ...currentCourse, id: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Course Name</label>
            <input
              type="text"
              required
              value={currentCourse.name || ''}
              onChange={(e) => setCurrentCourse({ ...currentCourse, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Instructor Name</label>
            <input
              type="text"
              required
              value={currentCourse.instructor || ''}
              onChange={(e) => setCurrentCourse({ ...currentCourse, instructor: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Semester</label>
              <input
                type="text"
                required
                value={currentCourse.semester || ''}
                onChange={(e) => setCurrentCourse({ ...currentCourse, semester: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Credits</label>
              <input
                type="number"
                required
                value={currentCourse.credits || ''}
                onChange={(e) => setCurrentCourse({ ...currentCourse, credits: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              {currentCourse.id && courses.some(c => c.id === currentCourse.id) ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
      />
    </div>
  );
}
