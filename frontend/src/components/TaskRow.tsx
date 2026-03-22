import { useState } from 'react';
import { useDeleteTask, useUpdateTask } from '../hooks/useTasks';
import type { Task } from '../types/task';

interface Props {
  task:      Task;
  projectId: number;
  isManager: boolean;
}

const STATUS_CYCLE: Record<string, Task['status']> = {
  Todo:       'InProgress',
  InProgress: 'Completed',
  Completed:  'Todo',
};

const STATUS_STYLE: Record<string, string> = {
  Todo:       'bg-gray-100 text-gray-600',
  InProgress: 'bg-blue-100 text-blue-700',
  Completed:  'bg-green-100 text-green-700',
};

const TaskRow = ({ task, projectId, isManager }: Props) => {
  const deleteTask  = useDeleteTask(projectId);
  const updateTask  = useUpdateTask(projectId);
  const [expanded, setExpanded] = useState(false);

  const handleStatusClick = () => {
    updateTask.mutate({
      id:      task.id,
      payload: { status: STATUS_CYCLE[task.status] },
    });
  };

  return (
    <div className="border rounded-lg mb-2 bg-white shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3">

        {task.is_unplanned && (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
            Unplanned
          </span>
        )}

        <span className="flex-1 font-medium text-gray-900">{task.task_name}</span>

        <span className="text-xs text-gray-400">
          {task.estimated_hours != null ? `${task.estimated_hours}h est.` : 'No estimate'}
        </span>

        {/* Clicking the status badge cycles it — available to both roles */}
        <button
          onClick={handleStatusClick}
          disabled={updateTask.isPending}
          className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer hover:opacity-75 ${STATUS_STYLE[task.status]}`}
        >
          {task.status}
        </button>

        {task.subtasks.length > 0 && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            {expanded ? '▲' : `▼ ${task.subtasks.length} subtask(s)`}
          </button>
        )}

        {/* Delete — manager only */}
        {isManager && (
          <button
            onClick={() => deleteTask.mutate(task.id)}
            className="text-xs text-red-400 hover:text-red-600"
          >
            Delete
          </button>
        )}
      </div>

      {expanded && task.subtasks.map(sub => (
        <div
          key={sub.id}
          className="ml-6 border-t px-4 py-2 text-sm text-gray-600 flex gap-3"
        >
          {sub.is_unplanned && (
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700">
              Unplanned
            </span>
          )}
          <span className="flex-1">{sub.task_name}</span>
          <span className="text-gray-400">{sub.status}</span>
        </div>
      ))}
    </div>
  );
};

export default TaskRow;