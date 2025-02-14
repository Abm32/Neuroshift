import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Brain, Focus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TimeSelect } from '../components/TimeSelect';
import { useStore } from '../lib/store';
import { generateTasks } from '../lib/ai';
import { supabase } from '../lib/supabase';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    wakeTime: '',
    sleepTime: '',
    workStartTime: '',
    workEndTime: '',
    energyLevel: '',
    focusChallenges: '',
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: user.id,
          wake_time: formData.wakeTime,
          sleep_time: formData.sleepTime,
          work_start_time: formData.workStartTime,
          work_end_time: formData.workEndTime,
          energy_baseline: parseInt(formData.energyLevel),
          focus_challenges: formData.focusChallenges,
        }]);

      if (profileError) throw profileError;

      // Generate AI tasks
      const tasks = await generateTasks({
        ...formData,
        energyLevel: parseInt(formData.energyLevel)
      });

      // Save generated tasks
      if (tasks.length > 0) {
        const { error: tasksError } = await supabase
          .from('tasks')
          .insert(tasks.map(task => ({
            ...task,
            user_id: user.id
          })));

        if (tasksError) throw tasksError;
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Welcome to NeuroShift
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Let's optimize your daily routine based on neuroscience principles
          </p>
        </div>

        <div className="bg-white p-8 shadow-lg rounded-lg space-y-8">
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-1/3 h-1 rounded-full ${
                  i <= step ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Sun className="h-6 w-6 text-indigo-600" />
                Sleep Schedule
              </h2>
              <TimeSelect
                label="Wake-up Time"
                value={formData.wakeTime}
                onChange={(value) => handleInputChange('wakeTime', value)}
              />
              <TimeSelect
                label="Bedtime"
                value={formData.sleepTime}
                onChange={(value) => handleInputChange('sleepTime', value)}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Brain className="h-6 w-6 text-indigo-600" />
                Work Schedule
              </h2>
              <TimeSelect
                label="Work Start Time"
                value={formData.workStartTime}
                onChange={(value) => handleInputChange('workStartTime', value)}
              />
              <TimeSelect
                label="Work End Time"
                value={formData.workEndTime}
                onChange={(value) => handleInputChange('workEndTime', value)}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Focus className="h-6 w-6 text-indigo-600" />
                Energy & Focus
              </h2>
              <Input
                label="Energy Level (1-10)"
                type="range"
                min="1"
                max="10"
                name="energyLevel"
                value={formData.energyLevel}
                onChange={(e) => handleInputChange('energyLevel', e.target.value)}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">
                {formData.energyLevel || 5}
              </div>
              <Input
                label="Focus Challenges"
                type="text"
                placeholder="What are your biggest focus challenges?"
                name="focusChallenges"
                value={formData.focusChallenges}
                onChange={(e) => handleInputChange('focusChallenges', e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-end space-x-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep((prev) => prev - 1)}
              >
                Previous
              </Button>
            )}
            <Button onClick={() => {
              if (step < 3) {
                setStep((prev) => prev + 1);
              } else {
                handleSubmit();
              }
            }}>
              {step === 3 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;