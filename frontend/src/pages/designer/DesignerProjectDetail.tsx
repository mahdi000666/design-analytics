import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useProject } from '../../hooks/useProjects';
import { useTasks, useUpdateTask } from '../../hooks/useTasks';
import { useTimeLogs, useCreateTimeLog } from '../../hooks/useTimeLogs';
import { useAuth } from '../../hooks/useAuth';
import TimeLogForm from '../../components/TimeLogForm';
import TimeLogList from '../../components/TimeLogList';
import FileUploadPanel from '../../components/FileUploadPanel';
import FeedbackList from '../../components/FeedbackList';
import type { Task } from '../../types/task';
import type { TimeLogPayload } from '../../types/timelog';

const STATUS_CYCLE: Record<Task['status'], Task['status']> = {
  Todo:       'InProgress',
  InProgress: 'Completed',
  Completed:  'Todo',       // allow reset for corrections
};

const STATUS_STYLES: Record<Task['status'], string> = {
  Todo:       'bg-gray-100 text-gray-600',
  InProgress: 'bg-blue-100 text-blue-700',
  Completed:  'bg-green-100 text-green-700',
};

const DesignerProjectDetail = () => {
  const { id }    = useParams<{ id: string }>();
  const projectId = Number(id);
  const { user }  = useAuth();

  const { data: project, isLoading: loadingProject } = useProject(projectId);
  const { data: tasks = [], isLoading: loadingTasks } = useTasks(projectId);
  const { data: logs = []                           } = useTimeLogs(projectId);

  const updateTask    = useUpdateTask(projectId);
  const createTimeLog = useCreateTimeLog(projectId);

  const [showLogForm, setShowLogForm] = useState(false);

  // Flatten top-level tasks + their subtasks for the time log form — a
  // designer can log time against any task or subtask.
  const allTasks = tasks.flatMap(t => [t, ...t.subtasks]);

  const handleStatusCycle = (task: Task) => {
    updateTask.mutate({
      id:      task.id,
      payload: { status: STATUS_CYCLE[task.status] },
    });
  };

  const handleLogTime = (payload: TimeLogPayload) => {
    createTimeLog.mutate(payload, {
      onSuccess: () => setShowLogForm(false),
    });
  };

  if (loadingProject) return <p className="p-6">Loading…</p>;
  if (!project)       return <p className="p-6 text-red-500">Project not found.</p>;

  const budgetPct = project.budget_hours
    ? Math.min(100, Math.round((project.actual_hours / Number(project.budget_hours)) * 100))
    : null;

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">{project.project_name}</h1>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
          <span>{project.client_name}</span>
          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
            {project.status}
          </span>
          {project.deadline && <span>Due {project.deadline}</span>}
        </div>
      </div>

      {/* Budget progress bar */}
      {budgetPct !== null && (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Budget utilisation</span>
            <span>{project.actual_hours}h / {project.budget_hours}h ({budgetPct}%)</span>
          </div>
          <div className="h-2 rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full transition-all ${
                budgetPct >= 90 ? 'bg-red-500'
                : budgetPct >= 70 ? 'bg-yellow-400'
                : 'bg-green-500'
              }`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Tasks with status toggle */}
      <div>
        <h2 className="text-lg font-medium mb-4">Tasks</h2>
        {loadingTasks ? (
          <p className="text-sm text-gray-400">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-gray-400">No tasks assigned yet.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map(task => (
              <li key={task.id} className="border rounded-lg bg-white shadow-sm">

                {/* Parent task row */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{task.task_name}</span>
                      {task.is_unplanned && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                          Unplanned
                        </span>
                      )}
                      {task.estimated_hours && (
                        <span className="text-xs text-gray-400">Est. {task.estimated_hours}h</span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{task.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleStatusCycle(task)}
                    disabled={updateTask.isPending}
                    className={`ml-4 flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium transition-opacity hover:opacity-70 disabled:opacity-40 ${STATUS_STYLES[task.status]}`}
                    title="Click to advance status"
                  >
                    {task.status}
                  </button>
                </div>

                {/* Subtasks — indented, same status-cycle interaction */}
                {task.subtasks.length > 0 && (
                  <ul className="border-t divide-y divide-gray-100">
                    {task.subtasks.map(sub => (
                      <li key={sub.id} className="flex items-center justify-between pl-8 pr-4 py-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-700">{sub.task_name}</span>
                            {sub.is_unplanned && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                                Unplanned
                              </span>
                            )}
                            {sub.estimated_hours && (
                              <span className="text-xs text-gray-400">Est. {sub.estimated_hours}h</span>
                            )}
                          </div>
                          {sub.description && (
                            <p className="text-xs text-gray-500 mt-0.5 truncate">{sub.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleStatusCycle(sub)}
                          disabled={updateTask.isPending}
                          className={`ml-4 flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium transition-opacity hover:opacity-70 disabled:opacity-40 ${STATUS_STYLES[sub.status]}`}
                          title="Click to advance status"
                        >
                          {sub.status}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Time logging */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Log time</h2>
          <button
            onClick={() => setShowLogForm(v => !v)}
            className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded hover:bg-gray-700"
          >
            {showLogForm ? 'Cancel' : '+ Log time'}
          </button>
        </div>

        {showLogForm && (
          <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
            {/* Pass all tasks (including subtasks) as targets for time logging */}
            <TimeLogForm
              tasks={allTasks}
              isLoading={createTimeLog.isPending}
              onSubmit={handleLogTime}
            />
          </div>
        )}

        <TimeLogList logs={logs} isManager={false} />
      </div>

      {/* File uploads */}
      <div>
        <h2 className="text-lg font-medium mb-4">Files</h2>
        <FileUploadPanel
          projectId={projectId}
          role={user?.role ?? 'Designer'}
          isManager={false}
        />
      </div>

      {/* Client feedback — read only for Designer */}
      <div>
        <h2 className="text-lg font-medium mb-4">Client feedback</h2>
        <FeedbackList projectId={projectId} canUpdate={true} />
      </div>

    </div>
  );
};

export default DesignerProjectDetail;