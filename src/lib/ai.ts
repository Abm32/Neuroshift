import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateTasks(userProfile: {
  wakeTime: string;
  sleepTime: string;
  workStartTime: string;
  workEndTime: string;
  energyLevel: number;
  focusChallenges: string;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Based on the following user profile, generate 3-5 personalized tasks that would help improve their productivity and focus. Consider their schedule and energy levels.

User Profile:
- Wake time: ${userProfile.wakeTime}
- Sleep time: ${userProfile.sleepTime}
- Work hours: ${userProfile.workStartTime} to ${userProfile.workEndTime}
- Energy level (1-10): ${userProfile.energyLevel}
- Focus challenges: ${userProfile.focusChallenges}

Format each task as a JSON object with:
- title: string
- description: string
- category: "focus" | "energy" | "routine"
- due_date: "today" | "tomorrow" | specific date

Return only the JSON array.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tasks = JSON.parse(response.text());
    
    return tasks.map((task: any) => ({
      ...task,
      due_date: task.due_date === 'today' 
        ? new Date().toISOString().split('T')[0]
        : task.due_date === 'tomorrow'
        ? new Date(Date.now() + 86400000).toISOString().split('T')[0]
        : task.due_date
    }));
  } catch (error) {
    console.error('Failed to generate tasks:', error);
    return [];
  }
}