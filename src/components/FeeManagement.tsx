import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Student, Fee } from '../types';
import { Search, Plus, Trash2, CreditCard, User, Calendar, CheckCircle2, Clock, Edit2, X, AlertCircle } from 'lucide-react';
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

export default function FeeManagement() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState<number | null>(null);
  const [currentFee, setCurrentFee] = useState<Partial<Fee>>({
    total_fee: 0,
    paid_amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
    status: 'Pending'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [feesData, stuData] = await Promise.all([
      api.getFees(),
      api.getStudents()
    ]);
    setFees(feesData);
    setStudents(stuData);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFee.student_id) {
      alert('Please select student');
      return;
    }
    
    try {
      if (currentFee.id) {
        const res = await api.updateFee(currentFee.id, currentFee);
        if (res.success) alert('Fee record updated successfully!');
        else alert('Failed to update fee: ' + (res.message || 'Unknown error'));
      } else {
        const res = await api.addFee(currentFee);
        if (res.success) alert('Fee record added successfully!');
        else alert('Failed to add fee: ' + (res.message || 'Unknown error'));
      }
      
      setIsModalOpen(false);
      fetchData();
      setCurrentFee({
        total_fee: 0,
        paid_amount: 0,
        payment_date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      });
    } catch (error: any) {
      console.error('Error saving fee:', error);
      alert('An error occurred while saving fee: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (feeToDelete !== null) {
      try {
        const res = await api.deleteFee(feeToDelete);
        if (res.success) {
          setIsDeleteModalOpen(false);
          setFeeToDelete(null);
          fetchData();
          alert('Fee record deleted successfully!');
        } else {
          alert('Failed to delete fee: ' + (res.message || 'Unknown error'));
        }
      } catch (error: any) {
        console.error('Error deleting fee:', error);
        alert('An error occurred while deleting fee: ' + error.message);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Fee Management</h2>
        <button
          onClick={() => {
            setCurrentFee({
              total_fee: 0,
              paid_amount: 0,
              payment_date: new Date().toISOString().split('T')[0],
              status: 'Pending'
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Add Fee Record
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Fee</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fees.map((record) => (
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
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{record.total_fee}</td>
                  <td className="px-6 py-4 text-sm text-emerald-600 font-bold">₹{record.paid_amount}</td>
                  <td className="px-6 py-4 text-sm text-rose-600 font-bold">₹{record.total_fee - record.paid_amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      record.status === 'Paid' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      {record.status === 'Paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setCurrentFee(record);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setFeeToDelete(record.id);
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
              {fees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No fee records found.
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
        title={currentFee.id ? 'Edit Fee Record' : 'Add Fee Record'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Student</label>
            <select
              required
              value={currentFee.student_id || ''}
              onChange={(e) => setCurrentFee({ ...currentFee, student_id: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Total Fee (₹)</label>
            <input
              type="number"
              required
              value={currentFee.total_fee || 0}
              onChange={(e) => setCurrentFee({ ...currentFee, total_fee: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Paid Amount (₹)</label>
            <input
              type="number"
              required
              value={currentFee.paid_amount || 0}
              onChange={(e) => setCurrentFee({ ...currentFee, paid_amount: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Date</label>
            <input
              type="date"
              required
              value={currentFee.payment_date || ''}
              onChange={(e) => setCurrentFee({ ...currentFee, payment_date: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
            <select
              required
              value={currentFee.status || 'Pending'}
              onChange={(e) => setCurrentFee({ ...currentFee, status: e.target.value as any })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              {currentFee.id ? 'Update Fee' : 'Add Fee'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Fee Record"
        message="Are you sure you want to delete this fee record? This action cannot be undone."
      />
    </div>
  );
}
