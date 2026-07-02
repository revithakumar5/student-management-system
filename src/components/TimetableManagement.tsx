import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TimetableEntry } from '../types';
import { Search, Plus, Trash2, Calendar, Clock, MapPin, User, Edit2, X, AlertCircle } from 'lucide-react';
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

export default function TimetableManagement() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<number | null>(null);
  const [currentEntry, setCurrentEntry] = useState<Partial<TimetableEntry>>({
    day: 'Monday',
    time: '09:00 AM',
    classroom: ''
  });

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    const data = await api.getTimetable();
    setTimetable(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentEntry.id) {
        const res = await api.updateTimetable(currentEntry.id, currentEntry);
        if (res.success) alert('Timetable entry updated successfully!');
        else alert('Failed to update timetable: ' + (res.message || 'Unknown error'));
      } else {
        const res = await api.addTimetable(currentEntry);
        if (res.success) alert('Timetable entry added successfully!');
        else alert('Failed to add timetable: ' + (res.message || 'Unknown error'));
      }
      setIsModalOpen(false);
      fetchTimetable();
      setCurrentEntry({ day: 'Monday', time: '09:00 AM', classroom: '' });
    } catch (error: any) {
      console.error('Error saving timetable:', error);
      alert('An error occurred while saving timetable: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (entryToDelete !== null) {
      try {
        const res = await api.deleteTimetable(entryToDelete);
        if (res.success) {
          setIsDeleteModalOpen(false);
          setEntryToDelete(null);
          fetchTimetable();
          alert('Timetable entry deleted successfully!');
        } else {
          alert('Failed to delete timetable: ' + (res.message || 'Unknown error'));
        }
      } catch (error: any) {
        console.error('Error deleting timetable:', error);
        alert('An error occurred while deleting timetable: ' + error.message);
      }
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Timetable Management</h2>
        <button
          onClick={() => {
            setCurrentEntry({ day: 'Monday', time: '09:00 AM', classroom: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Add Entry
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Day</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Classroom</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timetable.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{entry.day}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-indigo-500" />
                      {entry.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{entry.course_name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      {entry.teacher}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-rose-500" />
                      {entry.classroom}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setCurrentEntry(entry);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEntryToDelete(entry.id);
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
              {timetable.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No timetable entries found.
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
        title={currentEntry.id ? 'Edit Timetable Entry' : 'Add Timetable Entry'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Course Name</label>
            <input
              type="text"
              required
              value={currentEntry.course_name || ''}
              onChange={(e) => setCurrentEntry({ ...currentEntry, course_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Teacher</label>
            <input
              type="text"
              required
              value={currentEntry.teacher || ''}
              onChange={(e) => setCurrentEntry({ ...currentEntry, teacher: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Day</label>
            <select
              required
              value={currentEntry.day || 'Monday'}
              onChange={(e) => setCurrentEntry({ ...currentEntry, day: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              {days.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
            <input
              type="text"
              required
              placeholder="e.g. 09:00 AM"
              value={currentEntry.time || ''}
              onChange={(e) => setCurrentEntry({ ...currentEntry, time: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Classroom</label>
            <input
              type="text"
              required
              value={currentEntry.classroom || ''}
              onChange={(e) => setCurrentEntry({ ...currentEntry, classroom: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              {currentEntry.id ? 'Update Entry' : 'Add Entry'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Timetable Entry"
        message="Are you sure you want to delete this timetable entry? This action cannot be undone."
      />
    </div>
  );
}
