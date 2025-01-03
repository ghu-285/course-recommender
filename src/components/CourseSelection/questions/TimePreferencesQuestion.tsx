import React, { useState } from 'react';
import { Clock } from 'lucide-react';

const TIME_SLOTS = ['Before noon', '12:00pm - 4:00pm', 'After 4:00pm'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SPACING_PREFERENCES = ['Stacked together', 'Spread out', 'No preference'];

type TimePreferences = {
  timeSlotRanking: string[];
  dayRanking: string[];
  spacing: string;
};

type TimePreferencesQuestionProps = {
  onAnswer: (preferences: TimePreferences) => void;
};

export const TimePreferencesQuestion: React.FC<TimePreferencesQuestionProps> = ({ onAnswer }) => {
  const [timeSlotRanking, setTimeSlotRanking] = useState<string[]>([]);
  const [dayRanking, setDayRanking] = useState<string[]>([]);
  const [spacing, setSpacing] = useState<string>('');

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: string) => {
    e.dataTransfer.setData('text/plain', item);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, list: 'timeSlots' | 'days') => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    
    if (list === 'timeSlots') {
      if (!timeSlotRanking.includes(item)) {
        setTimeSlotRanking([...timeSlotRanking, item]);
      }
    } else {
      if (!dayRanking.includes(item)) {
        setDayRanking([...dayRanking, item]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    if (timeSlotRanking.length === 3 && dayRanking.length === 5 && spacing) {
      onAnswer({ timeSlotRanking, dayRanking, spacing });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <Clock className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Time Preferences</h2>
      </div>

      {/* Time Slots Ranking */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          When do you want your classes to be? (Drag to rank)
        </h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">Available Options:</p>
            <div className="space-y-2">
              {TIME_SLOTS.filter(slot => !timeSlotRanking.includes(slot)).map(slot => (
                <div
                  key={slot}
                  draggable
                  onDragStart={(e) => handleDragStart(e, slot)}
                  className="p-2 bg-gray-100 rounded cursor-move hover:bg-gray-200"
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>
          <div 
            className="flex-1 border-2 border-dashed border-gray-300 rounded p-4"
            onDrop={(e) => handleDrop(e, 'timeSlots')}
            onDragOver={handleDragOver}
          >
            <p className="text-sm text-gray-500 mb-2">Your Ranking:</p>
            <div className="space-y-2">
              {timeSlotRanking.map((slot, index) => (
                <div key={slot} className="p-2 bg-blue-100 rounded">
                  {index + 1}. {slot}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Days Ranking */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Do you have any preferences on days? (Drag to rank)
        </h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">Available Options:</p>
            <div className="space-y-2">
              {DAYS.filter(day => !dayRanking.includes(day)).map(day => (
                <div
                  key={day}
                  draggable
                  onDragStart={(e) => handleDragStart(e, day)}
                  className="p-2 bg-gray-100 rounded cursor-move hover:bg-gray-200"
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
          <div 
            className="flex-1 border-2 border-dashed border-gray-300 rounded p-4"
            onDrop={(e) => handleDrop(e, 'days')}
            onDragOver={handleDragOver}
          >
            <p className="text-sm text-gray-500 mb-2">Your Ranking:</p>
            <div className="space-y-2">
              {dayRanking.map((day, index) => (
                <div key={day} className="p-2 bg-blue-100 rounded">
                  {index + 1}. {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacing Preference */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Do you prefer to have your classes stacked back-to-back or spread out?
        </h3>
        <div className="flex gap-4">
          {SPACING_PREFERENCES.map(pref => (
            <button
              key={pref}
              onClick={() => setSpacing(pref)}
              className={`flex-1 p-3 rounded-lg border-2 transition-colors
                ${spacing === pref 
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              {pref}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};