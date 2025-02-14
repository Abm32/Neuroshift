import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useStore } from '../lib/store';

interface CheckInModalProps {
  onClose: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ onClose }) => {
  const addCheckin = useStore((state) => state.addCheckin);
  const [formData, setFormData] = useState({
    energy_level: 5,
    mood_rating: 5,
    focus_rating: 5,
    sleep_quality: 5,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCheckin(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'notes' ? value : parseInt(value, 10)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Daily Check-in</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Energy Level (1-10)"
            type="number"
            name="energy_level"
            min="1"
            max="10"
            value={formData.energy_level}
            onChange={handleChange}
          />
          <Input
            label="Mood Rating (1-10)"
            type="number"
            name="mood_rating"
            min="1"
            max="10"
            value={formData.mood_rating}
            onChange={handleChange}
          />
          <Input
            label="Focus Rating (1-10)"
            type="number"
            name="focus_rating"
            min="1"
            max="10"
            value={formData.focus_rating}
            onChange={handleChange}
          />
          <Input
            label="Sleep Quality (1-10)"
            type="number"
            name="sleep_quality"
            min="1"
            max="10"
            value={formData.sleep_quality}
            onChange={handleChange}
          />
          <Input
            label="Notes"
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};