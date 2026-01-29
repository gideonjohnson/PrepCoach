'use client';

import { useState, useEffect, useCallback } from 'react';

interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

interface AvailabilityCalendarProps {
  interviewerId?: string; // If provided, shows read-only view for booking
  onSlotSelect?: (date: Date, startTime: string, endTime: string) => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const HALF_HOURS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
});

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Australia/Sydney',
  'UTC',
];

export default function AvailabilityCalendar({ interviewerId, onSlotSelect }: AvailabilityCalendarProps) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [timezone, setTimezone] = useState('UTC');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [blockedSlots, setBlockedSlots] = useState<{ start: string; end: string }[]>([]);

  // For the booking calendar view
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const isReadOnly = !!interviewerId;

  const fetchAvailability = useCallback(async () => {
    try {
      const url = interviewerId
        ? `/api/interviewers/${interviewerId}/availability`
        : '/api/interviewer/availability';

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots || []);
        setTimezone(data.timezone || 'UTC');
        if (data.blockedSlots) {
          setBlockedSlots(data.blockedSlots);
        }
      }
    } catch {
      setError('Failed to load availability');
    } finally {
      setLoading(false);
    }
  }, [interviewerId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const addSlot = (dayOfWeek: number) => {
    setSlots([...slots, { dayOfWeek, startTime: '09:00', endTime: '17:00', isRecurring: true }]);
    setSuccess('');
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
    setSuccess('');
  };

  const updateSlot = (index: number, field: keyof AvailabilitySlot, value: string | number | boolean) => {
    const updated = [...slots];
    updated[index] = { ...updated[index], [field]: value };
    setSlots(updated);
    setSuccess('');
  };

  const saveAvailability = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/interviewer/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timezone, slots }),
      });

      if (res.ok) {
        setSuccess('Availability saved successfully!');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save');
      }
    } catch {
      setError('Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  // Get available time slots for a specific date (booking view)
  const getAvailableSlotsForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    const daySlots = slots.filter((s) => s.dayOfWeek === dayOfWeek);

    // Filter out blocked times
    return daySlots.filter((slot) => {
      const slotStart = new Date(date);
      const [sh, sm] = slot.startTime.split(':').map(Number);
      slotStart.setHours(sh, sm, 0, 0);

      const slotEnd = new Date(date);
      const [eh, em] = slot.endTime.split(':').map(Number);
      slotEnd.setHours(eh, em, 0, 0);

      // Check if any blocked slot overlaps
      return !blockedSlots.some((blocked) => {
        const blockedStart = new Date(blocked.start);
        const blockedEnd = new Date(blocked.end);
        return slotStart < blockedEnd && slotEnd > blockedStart;
      });
    });
  };

  // Get the dates for the current week view
  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + selectedWeekOffset * 7);
    // Move to Monday
    const dayOffset = startOfWeek.getDay() === 0 ? -6 : 1 - startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() + dayOffset);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Booking calendar view (read-only for candidates)
  if (isReadOnly) {
    const weekDates = getWeekDates();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Available Times
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedWeekOffset(Math.max(0, selectedWeekOffset - 1))}
              disabled={selectedWeekOffset === 0}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              &larr;
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
              {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <button
              onClick={() => setSelectedWeekOffset(Math.min(4, selectedWeekOffset + 1))}
              disabled={selectedWeekOffset >= 4}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              &rarr;
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Times shown in {timezone}
        </p>

        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date) => {
            const isPast = date < today;
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const availableSlots = getAvailableSlotsForDate(date);
            const hasSlots = availableSlots.length > 0;

            return (
              <div key={date.toISOString()} className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {DAYS_SHORT[date.getDay()]}
                </div>
                <button
                  onClick={() => !isPast && hasSlots && setSelectedDate(date)}
                  disabled={isPast || !hasSlots}
                  className={`w-full p-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : isPast || !hasSlots
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-900 dark:text-white'
                  }`}
                >
                  {date.getDate()}
                  {hasSlots && !isPast && (
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mx-auto mt-1" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {getAvailableSlotsForDate(selectedDate).map((slot, i) => {
                // Generate individual 1-hour booking slots
                const [sh] = slot.startTime.split(':').map(Number);
                const [eh] = slot.endTime.split(':').map(Number);
                const hourSlots = [];
                for (let h = sh; h < eh; h++) {
                  hourSlots.push({
                    start: `${String(h).padStart(2, '0')}:00`,
                    end: `${String(h + 1).padStart(2, '0')}:00`,
                  });
                }
                return hourSlots.map((hs, j) => (
                  <button
                    key={`${i}-${j}`}
                    onClick={() => onSlotSelect?.(selectedDate, hs.start, hs.end)}
                    className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    {hs.start} - {hs.end}
                  </button>
                ));
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Editable availability view (for interviewers)
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Set Your Availability
        </h3>
        <button
          onClick={saveAvailability}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Timezone selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Timezone
        </label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full max-w-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      {/* Weekly schedule */}
      <div className="space-y-4">
        {DAYS.map((day, dayIndex) => {
          const daySlots = slots
            .map((slot, originalIndex) => ({ ...slot, originalIndex }))
            .filter((s) => s.dayOfWeek === dayIndex);

          return (
            <div
              key={day}
              className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="w-24 shrink-0">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {day}
                </span>
              </div>

              <div className="flex-1 space-y-2">
                {daySlots.length === 0 ? (
                  <span className="text-sm text-gray-400 dark:text-gray-500">
                    Unavailable
                  </span>
                ) : (
                  daySlots.map((slot) => (
                    <div key={slot.originalIndex} className="flex items-center gap-2">
                      <select
                        value={slot.startTime}
                        onChange={(e) => updateSlot(slot.originalIndex, 'startTime', e.target.value)}
                        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
                      >
                        {HALF_HOURS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <span className="text-gray-500 text-sm">to</span>
                      <select
                        value={slot.endTime}
                        onChange={(e) => updateSlot(slot.originalIndex, 'endTime', e.target.value)}
                        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
                      >
                        {HALF_HOURS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeSlot(slot.originalIndex)}
                        className="p-1 text-red-500 hover:text-red-700 text-sm"
                        title="Remove slot"
                      >
                        &times;
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => addSlot(dayIndex)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 whitespace-nowrap"
              >
                + Add
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
