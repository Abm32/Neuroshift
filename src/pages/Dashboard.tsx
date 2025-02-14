import React, { useEffect, useState } from 'react';
import { Sun, Moon, Brain, Focus, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CheckInModal } from '../components/CheckInModal';
import { ProgressChart } from '../components/ProgressChart';
import { useStore } from '../lib/store';

const Dashboard = () => {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const { user, checkins, tasks, educationalContent, fetchUserData, fetchEducationalContent, updateTask } = useStore();

  useEffect(() => {
    fetchUserData();
    fetchEducationalContent();
  }, [fetchUserData, fetchEducationalContent]);

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    await updateTask(taskId, { completed });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Daily Check-in Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Daily Check-in</h2>
            <Sun className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-gray-600 mb-4">
            Track your progress and get personalized recommendations
          </p>
          <Button className="w-full" onClick={() => setShowCheckIn(true)}>
            Start Check-in
          </Button>
        </div>

        {/* Today's Tasks Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Today's Tasks</h2>
            <Calendar className="h-6 w-6 text-indigo-600" />
          </div>
          <ul className="space-y-3 mb-4">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => handleTaskToggle(task.id, e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className={task.completed ? 'line-through text-gray-400' : ''}>
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full">
            View All Tasks
          </Button>
        </div>

        {/* Progress Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Weekly Progress</h2>
            <TrendingUp className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="h-40">
            <ProgressChart checkins={checkins} />
          </div>
          <Button variant="outline" className="w-full mt-4">
            View Details
          </Button>
        </div>
      </div>

      {/* Educational Content */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Learn & Grow</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {educationalContent.map((article) => (
            <div key={article.id} className="bg-white p-6 rounded-lg shadow-md">
              <Brain className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
              <p className="text-gray-600 mb-4">
                {article.content.substring(0, 100)}...
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {article.reading_time} min read
                </span>
                <Button variant="outline">Read Article</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCheckIn && <CheckInModal onClose={() => setShowCheckIn(false)} />}
    </div>
  );
};

export default Dashboard;