import { useState } from 'react';
import { useDeleteTask, useUpdateTask, useCreateTask } from '../hooks/useTasks';
import TaskForm from './TaskForm';
import type { Task, TaskPayload } from '../types/task';

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
  const deleteTask    = useDeleteTask(projectId);
  const updateTask    = useUpdateTask(projectId);
  const createSubtask = useCreateTask(projectId);

  const [expanded,      setExpanded]      = useState(false);
  const [editing,       setEditing]       = useState(false);
  const [addingSubtask, setAddingSubtask] = useState(false);

  const cycleStatus = (id: number, current: Task['status']) =>
    updateTask.mutate({ id, payload: { status: STATUS_CYCLE[current] } });

  const handleEdit = (payload: TaskPayload) => {
    updateTask.mutate(
      { id: task.id, payload },
      { onSuccess: () => setEditing(false) },
    );
  };

  const handleCreateSubtask = (payload: TaskPayload) => {
    createSubtask.mutate(payload, { onSuccess: () => setAddingSubtask(false) });
  };

  return (
    <div className="border rounded-lg mb-2 bg-white shadow-sm">

      {/* Main row */}
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

        <button
          onClick={() => cycleStatus(task.id, task.status)}
          disabled={updateTask.isPending}
          className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer hover:opacity-75 ${STATUS_STYLE[task.status]}`}
        >
          {task.status}
        </button>

        {(task.subtasks.length > 0 || addingSubtask) && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            {expanded
              ? '▲'
              : task.subtasks.length > 0
                ? `▼ ${task.subtasks.length} subtask(s)`
                : '▼'}
          </button>
        )}

        {isManager && (
          <>
            <button
              onClick={() => {
                setAddingSubtask(v => !v);
                setExpanded(true);
                setEditing(false);
              }}
              className="text-xs text-violet-500 hover:text-violet-700"
            >
              {addingSubtask ? 'Cancel subtask' : '+ Subtask'}
            </button>
            <button
              onClick={() => {
                setEditing(v => !v);
                setAddingSubtask(false);
              }}
              className="text-xs text-gray-400 hover:text-violet-600"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={() => deleteTask.mutate(task.id)}
              disabled={deleteTask.isPending}
              className="text-xs text-red-400 hover:text-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* Inline edit form */}
      {editing && isManager && (
        <div className="border-t px-4 py-4 bg-gray-50">
          <TaskForm
            projectId={projectId}
            defaults={task}
            onSubmit={handleEdit}
            isLoading={updateTask.isPending}
          />
        </div>
      )}

      {/* Expanded area: existing subtasks + optional "add subtask" form */}
      {expanded && (
        <div>
          {task.subtasks.map(sub => (
            <div
              key={sub.id}
              className="ml-6 border-t px-4 py-2 text-sm text-gray-600 flex gap-3 items-center"
            >
              {sub.is_unplanned && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700">
                  Unplanned
                </span>
              )}
              <span className="flex-1">{sub.task_name}</span>
              <span className="text-xs text-gray-400">
                {sub.estimated_hours != null ? `${sub.estimated_hours}h` : ''}
              </span>
              {/* Same cycle behaviour as the parent row */}
              <button
                onClick={() => cycleStatus(sub.id, sub.status)}
                disabled={updateTask.isPending}
                className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer hover:opacity-75 ${STATUS_STYLE[sub.status]}`}
              >
                {sub.status}
              </button>
            </div>
          ))}

          {addingSubtask && isManager && (
            <div className="ml-6 border-t px-4 py-4 bg-gray-50">
              <p className="text-xs text-gray-500 mb-3">
                New subtask of <span className="font-medium">{task.task_name}</span>
              </p>
              <TaskForm
                projectId={projectId}
                defaults={{ parent_task: task.id }}
                onSubmit={handleCreateSubtask}
                isLoading={createSubtask.isPending}
              />
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default TaskRow;