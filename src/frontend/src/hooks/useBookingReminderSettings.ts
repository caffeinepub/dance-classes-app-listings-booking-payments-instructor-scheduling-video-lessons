import { useState, useEffect } from 'react';

export interface ReminderSettings {
  enabled: boolean;
  leadTimeMinutes: number;
}

const STORAGE_KEY = 'booking-reminder-settings';

function getStoredSettings(): Record<string, ReminderSettings> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to parse reminder settings:', error);
  }
  return {};
}

function saveSettings(settings: Record<string, ReminderSettings>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save reminder settings:', error);
  }
}

export function useBookingReminderSettings(bookingId: string) {
  const [settings, setSettings] = useState<ReminderSettings>(() => {
    const allSettings = getStoredSettings();
    return allSettings[bookingId] || { enabled: false, leadTimeMinutes: 60 };
  });

  const updateSettings = (newSettings: Partial<ReminderSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    const allSettings = getStoredSettings();
    allSettings[bookingId] = updated;
    saveSettings(allSettings);
  };

  return {
    settings,
    updateSettings,
  };
}

export function getAllReminderSettings(): Record<string, ReminderSettings> {
  return getStoredSettings();
}
