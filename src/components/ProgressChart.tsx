import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import type { DailyCheckin } from '../lib/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressChartProps {
  checkins: DailyCheckin[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ checkins }) => {
  const sortedCheckins = [...checkins].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const labels = sortedCheckins.map((checkin) => 
    format(new Date(checkin.date), 'MMM d')
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Energy Level',
        data: sortedCheckins.map((checkin) => checkin.energy_level),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
      {
        label: 'Focus Rating',
        data: sortedCheckins.map((checkin) => checkin.focus_rating),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: 'Sleep Quality',
        data: sortedCheckins.map((checkin) => checkin.sleep_quality),
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Your Progress Over Time',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Line options={options} data={data} />
    </div>
  );
};