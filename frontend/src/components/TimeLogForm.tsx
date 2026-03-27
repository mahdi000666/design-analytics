import { useState } from 'react';
import type { Task } from '../types/task';
import type { TimeLogPayload } from '../types/timelog';

interface Props {
  tasks:     Task[];
  isLoading: boolean;
  onSubmit:  (payload: TimeLogPayload) => void;
}

const TimeLogForm = ({ tasks, isLoading, onSubmit }: Props) => {
  const [taskId,      setTaskId]      = useState<number | ''>('');
  const [hoursSpent,  setHoursSpent]  = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId || !hoursSpent) return;
    onSubmit({
      task:        Number(taskId),
      hours_spent: Number(hoursSpent),
      description,
    });
    setTaskId('');
    setHoursSpent('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Task</label>
        <select
          value={taskId}
          onChange={e => setTaskId(Number(e.target.value))}
          required
          className="w-full text-sm rounded border-gray-300 shadow-sm"
        >
          <option value="">Select a task…</option>
          {tasks.map(t => (
            <option key={t.id} value={t.id}>{t.task_name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Hours spent</label>
        <input
          type="number"
          value={hoursSpent}
          onChange={e => setHoursSpent(e.target.value)}
          min="0.25"
          step="0.25"
          required
          placeholder="e.g. 2.5"
          className="w-full text-sm rounded border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Description <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          placeholder="What did you work on?"
          className="w-full text-sm rounded border-gray-300 shadow-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-1.5 text-sm bg-gray-900 text-white rounded hover:bg-gray-700 disabled:opacity-50"
      >
        {isLoading ? 'Saving…' : 'Log time'}
      </button>
    </form>
  );
};

export default TimeLogForm;