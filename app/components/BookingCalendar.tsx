'use client';

import { useState, useMemo } from 'react';

interface BookingCalendarProps {
  availability: { day: string; startTime: string; endTime: string }[];
  timezone: string;
  blockedSlots?: { start: string; end: string }[];
  selectedSlot: Date | null;
  onSelectSlot: (slot: Date) => void;
  weeksToShow?: number;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

const DAY_NAME_MAP: Record<number, string> = {
  0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday',
  4: 'thursday', 5: 'friday', 6: 'saturday'
};

export default function BookingCalendar({
  availability,
  timezone,
  blockedSlots = [],
  selectedSlot,
  onSelectSlot,
  weeksToShow = 4,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get calendar days for current month view
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  }, [currentMonth]);

  // Check if a date has available slots
  const getDateAvailability = (date: Date): boolean => {
    const now = new Date();
    if (date < now && date.toDateString() !== now.toDateString()) return false;

    const dayName = DAY_NAME_MAP[date.getDay()];
    const dayAvailability = availability.find(a => a.day === dayName);

    if (!dayAvailability) return false;

    // Check if date is within the booking window (next N weeks)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + weeksToShow * 7);
    if (date > maxDate) return false;

    return true;
  };

  // Get time slots for a specific date
  const getTimeSlotsForDate = (date: Date): Date[] => {
    const dayName = DAY_NAME_MAP[date.getDay()];
    const dayAvailability = availability.find(a => a.day === dayName);

    if (!dayAvailability) return [];

    const slots: Date[] = [];
    const [startHour] = dayAvailability.startTime.split(':').map(Number);
    const [endHour] = dayAvailability.endTime.split(':').map(Number);
    const now = new Date();

    for (let hour = startHour; hour < endHour; hour++) {
      const slotDate = new Date(date);
      slotDate.setHours(hour, 0, 0, 0);

      // Skip past slots
      if (slotDate <= now) continue;

      // Check if slot is blocked
      const isBlocked = blockedSlots.some(blocked => {
        const blockedStart = new Date(blocked.start);
        const blockedEnd = new Date(blocked.end);
        return slotDate >= blockedStart && slotDate < blockedEnd;
      });

      if (!isBlocked) {
        slots.push(slotDate);
      }
    }

    return slots;
  };

  const timeSlots = selectedDate ? getTimeSlotsForDate(selectedDate) : [];

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);

    // Don't go before current month
    const now = new Date();
    if (newMonth.getFullYear() < now.getFullYear() ||
        (newMonth.getFullYear() === now.getFullYear() && newMonth.getMonth() < now.getMonth())) {
      return;
    }

    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);

    // Don't go more than 3 months ahead
    const maxMonth = new Date();
    maxMonth.setMonth(maxMonth.getMonth() + 3);
    if (newMonth > maxMonth) return;

    setCurrentMonth(newMonth);
  };

  const handleDateClick = (date: Date | null) => {
    if (!date || !getDateAvailability(date)) return;
    setSelectedDate(date);
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelectedDate = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isPastDate = (date: Date | null) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  return (
    <div className="space-y-6">
      {/* Calendar Grid */}
      <div className="bg-gray-800/50 rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-white font-semibold">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, idx) => {
            const hasAvailability = date ? getDateAvailability(date) : false;
            const past = isPastDate(date);
            const today = isToday(date);
            const selected = isSelectedDate(date);

            return (
              <button
                key={idx}
                onClick={() => handleDateClick(date)}
                disabled={!date || !hasAvailability}
                className={`
                  relative aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-all
                  ${!date ? 'cursor-default' : ''}
                  ${date && hasAvailability && !selected ? 'hover:bg-orange-500/20 cursor-pointer' : ''}
                  ${date && !hasAvailability ? 'text-gray-600 cursor-not-allowed' : ''}
                  ${date && hasAvailability && !selected ? 'text-white bg-gray-700/50' : ''}
                  ${selected ? 'bg-orange-500 text-white ring-2 ring-orange-400' : ''}
                  ${today && !selected ? 'ring-2 ring-orange-500/50' : ''}
                  ${past && !today ? 'opacity-40' : ''}
                `}
              >
                {date?.getDate()}
                {date && hasAvailability && !selected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/10 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700/50 rounded" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-800/50 rounded opacity-40" />
            <span>Unavailable</span>
          </div>
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="bg-gray-800/50 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">
            Available times for {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            })}
          </h3>

          {timeSlots.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">
              No available time slots for this date.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map((slot) => {
                const isSelected = selectedSlot?.toISOString() === slot.toISOString();
                return (
                  <button
                    key={slot.toISOString()}
                    onClick={() => onSelectSlot(slot)}
                    className={`
                      px-3 py-3 rounded-lg text-sm font-medium transition-all
                      ${isSelected
                        ? 'bg-orange-500 text-white ring-2 ring-orange-400'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }
                    `}
                  >
                    {slot.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </button>
                );
              })}
            </div>
          )}

          <p className="text-gray-500 text-xs mt-3">
            All times shown in {timezone}
          </p>
        </div>
      )}

      {!selectedDate && (
        <div className="text-center py-6 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Select a date to see available time slots</p>
        </div>
      )}
    </div>
  );
}
