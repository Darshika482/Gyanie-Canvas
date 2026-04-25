import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase.js';

const TOTAL_POOL = 700;

export const useCoinStore = create(
  persist(
    (set, get) => ({
      totalPool: TOTAL_POOL,
      distributions: [],
      returns: [],
      slotStatus: { 1: 'open', 2: 'locked', 3: 'locked' },
      currentDay: 1,

      fetchCoins: async () => {
        const [distRes, retRes] = await Promise.all([
          supabase.from('coin_distributions').select('*').order('timestamp', { ascending: false }),
          supabase.from('coin_returns').select('*').order('timestamp', { ascending: false }),
        ]);
        if (!distRes.error) set({ distributions: distRes.data || [] });
        if (!retRes.error) set({ returns: retRes.data || [] });
      },

      getStats: () => {
        const { distributions, returns } = get();
        const distributed = distributions.reduce((s, d) => s + d.coins_sent, 0);
        const returned = returns.reduce((s, r) => s + r.coins_returned, 0);
        const inCirculation = distributed - returned;
        const availableNow = TOTAL_POOL - inCirculation;
        return { totalPool: TOTAL_POOL, distributed, returned, inCirculation, availableNow };
      },

      distribute: async (activity, volunteerName, coinCount) => {
        const entry = {
          id: `cd${Date.now()}`,
          activity,
          volunteer_name: volunteerName,
          coins_sent: coinCount,
          day: get().currentDay,
          slot: 1,
          timestamp: new Date().toISOString(),
        };
        const { error } = await supabase.from('coin_distributions').insert(entry);
        if (!error) set(state => ({ distributions: [...state.distributions, entry] }));
        return entry;
      },

      recordReturn: async (slot, volunteerName, coinCount) => {
        const entry = {
          id: `cr${Date.now()}`,
          slot,
          volunteer_name: volunteerName,
          coins_returned: coinCount,
          day: get().currentDay,
          timestamp: new Date().toISOString(),
        };
        const { error } = await supabase.from('coin_returns').insert(entry);
        if (!error) set(state => ({ returns: [...state.returns, entry] }));
        return entry;
      },

      closeSlot: (slot) => {
        set(state => {
          const newStatus = { ...state.slotStatus, [slot]: 'closed' };
          if (slot < 3) newStatus[slot + 1] = 'open';
          return { slotStatus: newStatus };
        });
      },

      coinAllocations: {
        'Early Riser': 50,
        'Morning Puja': 80,
        'Class Session': 150,
        'Afternoon Bhakti': 100,
        'Afternoon Class': 100,
        'Games': 80,
        'Evening Program': 80,
        'Special Activity': 60,
      },

      updateAllocation: (activity, coins) => {
        set(state => ({
          coinAllocations: { ...state.coinAllocations, [activity]: coins }
        }));
      },

      getAllocationTotal: () => {
        return Object.values(get().coinAllocations).reduce((s, v) => s + v, 0);
      },
    }),
    { name: 'shivir-coins', partialize: (s) => ({ slotStatus: s.slotStatus, currentDay: s.currentDay, coinAllocations: s.coinAllocations }) }
  )
);
