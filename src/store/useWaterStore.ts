import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { calculateDailyWaterTarget, generateReminderSchedule } from '@/lib/water-calculations';

// Types
export interface UserData {
  sex: 'male' | 'female';
  weightKg: number;
  wakeTime: string; // HH:MM
  sleepTime: string; // HH:MM
  hasOnboarded: boolean;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  amount: number;
  target: number;
  logsCount?: number;
}

export interface WaterLog {
  id: string;
  time: string; // HH:MM
  amount: number;
}

export interface Reminder {
  id: string;
  time: string; // HH:MM
  enabled: boolean;
}

export interface Settings {
  cupSize: number; // default 250
  soundEnabled: boolean;
  reminderInterval: number;
}

interface WaterState {
  // State
  userData: UserData;
  dailyTarget: number;
  todayAmount: number;
  todayLogs: WaterLog[]; // New: Track individual logs for today
  lastUpdatedDate: string; // to detect new day
  history: DayRecord[];
  reminders: Reminder[]; // List of Reminder objects
  settings: Settings;

  // Actions
  setUserData: (data: Omit<UserData, 'hasOnboarded'>) => void;
  addWater: (amount: number, time?: string) => void;
  setCupSize: (size: number) => void;
  resetData: () => void;
  checkNewDay: () => void;
  toggleReminder: (id: string) => void;
  addReminder: (time: string) => void;
  deleteReminder: (id: string) => void;
  removeWater: (id: string) => void;
  setDailyTarget: (amount: number) => void;
}

export const useWaterStore = create<WaterState>()(
  persist(
    (set, get) => ({
      userData: {
        sex: 'male',
        weightKg: 60,
        wakeTime: '07:00',
        sleepTime: '22:00',
        hasOnboarded: false,
      },
      dailyTarget: 2500,
      todayAmount: 0,
      todayLogs: [],
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      history: [],
      reminders: [],
      settings: {
        cupSize: 250,
        soundEnabled: true,
        reminderInterval: 8,
      },

      setUserData: (data) => {
        const target = calculateDailyWaterTarget({
          sex: data.sex,
          weightKg: data.weightKg,
        });
        // Generate schedule (optional usage now)
        const schedule = generateReminderSchedule({
          wakeTime: data.wakeTime,
          sleepTime: data.sleepTime,
          targetMl: target,
        });

        // Optimization: Do NOT auto-populate reminders. User wants manual control.
        // If we wanted to keep them, we'd uncomment the mapping logic.
        /* 
        const newReminders: Reminder[] = schedule.times.map(t => ({
          id: Math.random().toString(36).substr(2, 9),
          time: t,
          enabled: true
        }));
        */

        set((state) => ({
          userData: { ...data, hasOnboarded: true },
          dailyTarget: target,
          // Keep existing reminders if any, don't overwrite with auto-generated ones
          // reminders: newReminders -- DISABLED
        }));
      },

      addWater: (amount, time) => {
        const { todayAmount, history, lastUpdatedDate, dailyTarget } = get();
        const todayStr = new Date().toISOString().split('T')[0];

        // Ensure we are adding to TODAY. If date changed, reset first (handled by checkNewDay hopefully, but safe check)
        if (todayStr !== lastUpdatedDate) {
          get().checkNewDay();
        }

        const newAmount = todayAmount + amount;

        // Use provided time or current time
        let logTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        if (time) {
          // Check if it's HH:MM (manual input usually)
          const [h, m] = time.split(':').map(Number);
          if (!isNaN(h) && !isNaN(m)) {
            const date = new Date();
            date.setHours(h);
            date.setMinutes(m);
            logTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          } else {
            // If it's already formatted or something else, use as is (fallback)
            logTime = time;
          }
        }

        const newLog: WaterLog = {
          id: Math.random().toString(36).substr(2, 9),
          time: logTime,
          amount: amount,
        };

        set({
          todayAmount: newAmount,
          lastUpdatedDate: todayStr,
          todayLogs: [newLog, ...get().todayLogs]
        });
      },

      setCupSize: (size) => set((state) => ({ settings: { ...state.settings, cupSize: size } })),

      resetData: () => {
        set({
          userData: { sex: 'male', weightKg: 60, wakeTime: '07:00', sleepTime: '22:00', hasOnboarded: false },
          dailyTarget: 2000,
          todayAmount: 0,
          todayLogs: [],
          history: [],
          reminders: [],
        });
      },

      checkNewDay: () => {
        const { lastUpdatedDate, todayAmount, dailyTarget, history, todayLogs } = get();
        const todayStr = new Date().toISOString().split('T')[0];

        if (lastUpdatedDate !== todayStr) {
          // Archive yesterday
          const newHistory = [
            ...history,
            {
              date: lastUpdatedDate,
              amount: todayAmount,
              target: dailyTarget,
              logsCount: todayLogs.length
            },
          ];
          set({
            lastUpdatedDate: todayStr,
            todayAmount: 0,
            todayLogs: [],
            history: newHistory,
          });
        }
      },

      toggleReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, enabled: !r.enabled } : r
          ),
        }));
      },

      addReminder: (time) => {
        const newReminder: Reminder = {
          id: Math.random().toString(36).substr(2, 9),
          time,
          enabled: true,
        };
        // Sort by time
        set((state) => ({
          reminders: [...state.reminders, newReminder].sort((a, b) => a.time.localeCompare(b.time)),
        }));
      },

      deleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        }));
      },

      removeWater: (id: string) => {
        const { todayLogs, todayAmount } = get();
        const logToRemove = todayLogs.find((l) => l.id === id);

        if (logToRemove) {
          set({
            todayLogs: todayLogs.filter((l) => l.id !== id),
            todayAmount: Math.max(0, todayAmount - logToRemove.amount),
          });
        }
      },

      setDailyTarget: (amount: number) => set({ dailyTarget: amount }),
    }),
    {
      name: 'water-tracker-storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default 'localStorage' is used
    }
  )
);
