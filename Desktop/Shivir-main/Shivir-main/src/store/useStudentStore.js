import { create } from 'zustand';
import { supabase } from '../lib/supabase.js';

export const useStudentStore = create((set, get) => ({
  students: [],
  searchResults: [],
  loading: true,

  fetchStudents: async () => {
    set({ loading: true });
    const { data, error } = await supabase.from('students').select('*').order('roll_no');
    if (!error) set({ students: data || [] });
    set({ loading: false });
  },

  search: (query) => {
    if (!query || query.trim().length < 2) { set({ searchResults: [] }); return; }
    const q = query.toLowerCase();
    const results = get().students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.roll_no.toLowerCase().includes(q) ||
      (s.mobile && s.mobile.includes(q))
    ).slice(0, 8);
    set({ searchResults: results });
  },

  addStudent: async (student) => {
    const newStudent = {
      ...student,
      id: `s${Date.now()}`,
      total_points: 0,
      day_points: [0, 0, 0, 0, 0, 0],
      checked_in: false,
    };
    const { error } = await supabase.from('students').insert(newStudent);
    if (!error) set(state => ({ students: [...state.students, newStudent] }));
  },

  checkIn: async (id) => {
    const student = get().students.find(s => s.id === id);
    if (!student) return;
    const newVal = !student.checked_in;
    const { error } = await supabase.from('students').update({ checked_in: newVal }).eq('id', id);
    if (!error) set(state => ({
      students: state.students.map(s => s.id === id ? { ...s, checked_in: newVal } : s)
    }));
  },

  updateStudent: async (id, updates) => {
    const { error } = await supabase.from('students').update(updates).eq('id', id);
    if (!error) set(state => ({
      students: state.students.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  },

  deleteStudent: async (id) => {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (!error) set(state => ({ students: state.students.filter(s => s.id !== id) }));
  },

  addPoints: async (studentId, points, day = 1) => {
    const student = get().students.find(s => s.id === studentId);
    if (!student) return;
    const dayPoints = [...student.day_points];
    dayPoints[day - 1] = (dayPoints[day - 1] || 0) + points;
    const total_points = student.total_points + points;
    const { error } = await supabase.from('students').update({ total_points, day_points: dayPoints }).eq('id', studentId);
    if (!error) set(state => ({
      students: state.students.map(s => s.id === studentId ? { ...s, total_points, day_points: dayPoints } : s)
    }));
  },

  importFromCSV: async (rows) => {
    const newStudents = rows.map((row, i) => {
      const healthIssue = row['Health Issue'] || row.health_issue || '';
      const prevShivir = row['Prev Shivir'] || row.prev_shivir || '';
      const kitGiven = row['Kit Given'] || row.kit_given || '';
      const age = row.Age || row.age || '';
      return {
        id: `csv_${Date.now()}_${i}`,
        roll_no: row['Roll Number'] || row.Roll || row.roll_no || '',
        name: row['Child Name'] || row.Name || row.name || '',
        mobile: (row.Mobile || row.mobile || '').replace(/[^0-9]/g, '').slice(0, 15),
        class: row.Class || row.class || '',
        batch: row['Allotted Book'] || row.Batch || row.batch || '',
        group: row.Group || row.group || '',
        parent_name: row['Father Name'] || row['Parent Name'] || row.parent_name || '',
        mother_name: row['Mother Name'] || row.mother_name || '',
        city: row.City || row.city || '',
        reg_id: row['Reg ID'] || row.reg_id || '',
        gender: row.Gender || row.gender || '',
        age: age ? (parseInt(age) || null) : null,
        dob: row.DOB || row.dob || null,
        whatsapp: row.WhatsApp || row.whatsapp || '',
        health_issue: healthIssue.toLowerCase() === 'yes',
        health_detail: row['Health Detail'] || row.health_detail || '',
        pathshala: row.Pathshala || row.pathshala || '',
        prev_shivir: prevShivir.toLowerCase() === 'yes',
        kit_given: kitGiven.toLowerCase() === 'yes',
        total_points: 0,
        day_points: [0, 0, 0, 0, 0, 0],
        checked_in: false,
      };
    });
    const { error } = await supabase.from('students').insert(newStudents);
    if (!error) set(state => ({ students: [...state.students, ...newStudents] }));
  },

  getLeaderboard: () => {
    const sorted = [...get().students].sort((a, b) => b.total_points - a.total_points);
    return sorted.map((s, i) => {
      const score = s.total_points;
      const maxScore = sorted[0]?.total_points || 1;
      const pct = score / maxScore;
      const category = pct >= 0.75 ? 'High' : pct >= 0.5 ? 'Mid-High' : pct >= 0.25 ? 'Mid' : 'Low';
      return { ...s, rank: i + 1, category };
    });
  },
}));
