import { create } from 'zustand';
import { supabase } from '../lib/supabase.js';

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  currentDay: 1,
  currentSlot: 1,
  loading: true,

  fetchTransactions: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('timestamp', { ascending: false });
    if (!error) set({ transactions: data || [] });
    set({ loading: false });
  },

  addTransaction: async (tx) => {
    const newTx = {
      ...tx,
      id: `t${Date.now()}`,
      timestamp: new Date().toISOString(),
      flagged: false,
    };
    const { error } = await supabase.from('transactions').insert(newTx);
    if (!error) set(state => ({ transactions: [newTx, ...state.transactions] }));
    return newTx;
  },

  flagTransaction: async (id) => {
    const tx = get().transactions.find(t => t.id === id);
    if (!tx) return;
    const flagged = !tx.flagged;
    const { error } = await supabase.from('transactions').update({ flagged }).eq('id', id);
    if (!error) set(state => ({
      transactions: state.transactions.map(t => t.id === id ? { ...t, flagged } : t)
    }));
  },

  getByStudent: (studentId) => get().transactions.filter(t => t.student_id === studentId),

  getByVolunteer: (volunteerId) => get().transactions.filter(t => t.volunteer_id === volunteerId),

  getTodayStats: () => {
    const today = get().currentDay;
    const todayTx = get().transactions.filter(t => t.day === today);
    const pointsToday = todayTx.filter(t => t.points > 0).reduce((sum, t) => sum + t.points, 0);
    return { pointsToday, count: todayTx.length };
  },

  setDay: (day) => set({ currentDay: day }),
  setSlot: (slot) => set({ currentSlot: slot }),
}));
