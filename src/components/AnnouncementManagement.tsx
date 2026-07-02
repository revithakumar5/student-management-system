import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Announcement } from '../types';
import { Search, Plus, Trash2, Megaphone, Calendar, Clock, Edit2, X, AlertCircle } from 'lucide-react';
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

export default function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<number | null>(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement>>({
    title: '',
    message: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const data = await api.getAnnouncements();
    setAnnouncements(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentAnnouncement.id) {
        const res = await api.updateAnnouncement(currentAnnouncement.id, currentAnnouncement);
        if (res.success) alert('Announcement updated successfully!');
        else alert('Failed to update announcement: ' + (res.message || 'Unknown error'));
      } else {
        const res = await api.addAnnouncement(currentAnnouncement);
        if (res.success) alert('Announcement posted successfully!');
        else alert('Failed to post announcement: ' + (res.message || 'Unknown error'));
      }
      setIsModalOpen(false);
      fetchAnnouncements();
      setCurrentAnnouncement({ title: '', message: '', date: new Date().toISOString().split('T')[0] });
    } catch (error: any) {
      console.error('Error saving announcement:', error);
      alert('An error occurred while saving announcement: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (announcementToDelete !== null) {
      try {
        const res = await api.deleteAnnouncement(announcementToDelete);
        if (res.success) {
          setIsDeleteModalOpen(false);
          setAnnouncementToDelete(null);
          fetchAnnouncements();
          alert('Announcement deleted successfully!');
        } else {
          alert('Failed to delete announcement: ' + (res.message || 'Unknown error'));
        }
      } catch (error: any) {
        console.error('Error deleting announcement:', error);
        alert('An error occurred while deleting announcement: ' + error.message);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Announcement Management</h2>
        <button
          onClick={() => {
            setCurrentAnnouncement({ title: '', message: '', date: new Date().toISOString().split('T')[0] });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Create Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-6">
            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
              <Megaphone size={28} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-lg font-bold text-slate-900">{announcement.title}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentAnnouncement(announcement);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setAnnouncementToDelete(announcement.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-slate-600 mb-4">{announcement.message}</p>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={14} />
                <span className="text-xs font-medium">{announcement.date}</span>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="py-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-100">
            No announcements posted yet.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentAnnouncement.id ? 'Edit Announcement' : 'Create Announcement'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
            <input
              type="text"
              required
              value={currentAnnouncement.title || ''}
              onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
            <textarea
              required
              value={currentAnnouncement.message || ''}
              onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, message: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
            <input
              type="date"
              required
              value={currentAnnouncement.date || ''}
              onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, date: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              {currentAnnouncement.id ? 'Update Announcement' : 'Post Announcement'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
      />
    </div>
  );
}
