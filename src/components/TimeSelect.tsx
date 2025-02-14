import React from 'react';
import { cn } from '../lib/utils';

interface TimeSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const TimeSelect: React.FC<TimeSelectProps> = ({
  label,
  value,
  onChange,
  className
}) => {
  // Generate time options in 30-minute intervals
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const ampm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const time = `${hour.toString().padStart(2, '0')}:${minute}`;
    const display = `${displayHour}:${minute} ${ampm}`;
    return { value: time, display };
  });

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      >
        <option value="">Select time</option>
        {timeOptions.map(({ value: timeValue, display }) => (
          <option key={timeValue} value={timeValue}>
            {display}
          </option>
        ))}
      </select>
    </div>
  );
};