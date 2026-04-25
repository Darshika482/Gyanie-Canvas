import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase.js';
import { mockVolunteers } from '../data/mockVolunteers.js';

const ADMIN_PASSWORD = 'shivir2024';

export const useAuthStore = create(
  persist(
    (set) => ({
      currentUser: null,
      role: null,

      loginVolunteer: async (pin) => {
        // Try Supabase first, fall back to mock data
        let volunteer = null;
        try {
          const { data, error } = await supabase
            .from('volunteers')
            .select('*')
            .eq('pin', pin)
            .single();
          volunteer = (!error && data) ? data : mockVolunteers.find(v => v.pin === pin);
        } catch {
          volunteer = mockVolunteers.find(v => v.pin === pin);
        }
        if (!volunteer) return { success: false, error: 'Wrong PIN. Please try again.' };

        const roles = volunteer.roles || (volunteer.role ? [volunteer.role] : []);
        const role = roles.includes('Admin') ? 'admin' :
                     roles.includes('Activity Coordinator') ? 'coordinator' :
                     roles.includes('Collection Volunteer') ? 'collection' :
                     'volunteer';
        set({ currentUser: { ...volunteer, roles }, role });
        return { success: true };
      },

      loginAdmin: (password) => {
        if (password !== ADMIN_PASSWORD) return { success: false, error: 'Wrong password.' };
        set({ currentUser: { id: 'admin', name: 'Camp Admin', role: 'Admin' }, role: 'admin' });
        return { success: true };
      },

      loginCoinkeeper: (pin) => {
        if (pin !== '0000') return { success: false, error: 'Wrong PIN.' };
        set({ currentUser: { id: 'keeper', name: 'Coin Keeper', role: 'Keeper' }, role: 'coinkeeper' });
        return { success: true };
      },

      logout: () => set({ currentUser: null, role: null }),
    }),
    { name: 'shivir-auth' }
  )
);
