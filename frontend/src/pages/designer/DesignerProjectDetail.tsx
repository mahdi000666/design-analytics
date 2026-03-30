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
import AppShell from '../../components/AppShell';
import type { Task } from '../../types/task';
import type { TimeLogPayload } from '../../types/timelog';

// ─── Helpers ─────────────────────────────────────────────────────────────────

type Tab = 'tasks' | 'log' | 'files' | 'feedback';

const STATUS_CYCLE: Record<Task['status'], Task['status']> = {
  Todo:       'InProgress',
  InProgress: 'Completed',
  Completed:  'Todo',
};

const TASK_STATUS_BADGE: Record<Task['status'], string> = {
  Todo:       'bg-surface2 text-ink3',
  InProgress: 'bg-info-light text-info',
  Completed:  'bg-success-light text-success',
};

const barColor = (pct: number) =>
  pct >= 100 ? 'bg-danger' : pct >= 80 ? 'bg-amber' : 'bg-teal';

// ─── Component ───────────────────────────────────────────────────────────────

export default function DesignerProjectDetail() {
  const { id }    = useParams<{ id: string }>();
  const projectId = Number(id);
  const { user }  = useAuth();

  const { data: project, isLoading: loadingProject } = useProject(projectId);
  const { data: tasks = [], isLoading: loadingTasks } = useTasks(projectId);
  const { data: logs = []                           } = useTimeLogs(projectId);

  const updateTask    = useUpdateTask(projectId);
  const createTimeLog = useCreateTimeLog(projectId);

  const [activeTab,    setActiveTab]    = useState<Tab>('tasks');
  const [showLogForm,  setShowLogForm]  = useState(false);

  // Flatten top-level tasks + their subtasks for the time log form — a
  // designer can log time against any task or subtask.
  const allTasks = tasks.flatMap(t => [t, ...t.subtasks]);

  const handleStatusCycle = (task: Task) => {
    updateTask.mutate({ id: task.id, payload: { status: STATUS_CYCLE[task.status] } });
  };

  const handleLogTime = (payload: TimeLogPayload) => {
    createTimeLog.mutate(payload, { onSuccess: () => setShowLogForm(false) });
  };

  if (loadingProject) {
    return (
      <AppShell title="Project">
        <p className="font-sans text-[13px] text-ink3">Loading…</p>
      </AppShell>
    );
  }
  if (!project) {
    return (
      <AppShell title="Project">
        <p className="font-sans text-[13px] text-danger">Project not found.</p>
      </AppShell>
    );
  }

  const budgetPct = project.budget_hours
    ? Math.min(100, Math.round((project.actual_hours / Number(project.budget_hours)) * 100))
    : null;

  const TABS: { id: Tab; label: string }[] = [
    { id: 'tasks',    label: `Tasks (${tasks.length})`  },
    { id: 'log',      label: 'Log Time'                 },
    { id: 'files',    label: 'Files'                    },
    { id: 'feedback', label: 'Feedback'                 },
  ];

  return (
    <AppShell
      title={project.project_name}
      breadcrumb={project.client_name}
    >
      {/* ── Meta row ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <span className="inline-block px-2 py-[3px] rounded font-sans text-[11px] font-semibold bg-success-light text-success">
          {project.status}
        </span>
        {project.deadline && (
          <span className="font-sans text-[13px] text-ink3">
            Due <span className="text-ink">{project.deadline}</span>
          </span>
        )}
      </div>

      {/* ── Budget progress bar ──────────────────────────────────────────── */}
      {budgetPct !== null && (
        <div className="mb-6">
          <div className="flex justify-between font-sans text-[11px] text-ink3 mb-[6px]">
            <span>Budget utilisation</span>
            <span className="font-mono">
              {project.actual_hours}h / {project.budget_hours}h — {budgetPct}%
            </span>
          </div>
          <div className="bg-surface2 rounded-full h-[6px] overflow-hidden">
            <div
              className={`h-full rounded-full transition-[width] ${barColor(budgetPct)}`}
              style={{ width: `${Math.min(budgetPct, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-border mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-[18px] py-[10px] font-sans text-[13px] font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? 'text-ink border-amber'
                : 'text-ink3 border-transparent hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Tasks ───────────────────────────────────────────────────── */}
      {activeTab === 'tasks' && (
        <div>
          {loadingTasks ? (
            <p className="font-sans text-[13px] text-ink3">Loading tasks…</p>
          ) : tasks.length === 0 ? (
            <p className="font-sans text-[13px] text-ink3">No tasks assigned yet.</p>
          ) : (
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              {tasks.map((task, i) => (
                <div key={task.id}>
                  {/* Parent task */}
                  <div className={`flex items-center justify-between px-4 py-[13px] ${i > 0 ? 'border-t border-border' : ''}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-sans text-[13px] font-medium text-ink">{task.task_name}</span>
                        {task.is_unplanned && (
                          <span className="inline-block px-2 py-[3px] rounded font-sans text-[11px] font-semibold bg-danger-light text-danger">
                            Scope creep
                          </span>
                        )}
                        {task.estimated_hours && (
                          <span className="font-mono text-[11px] text-ink3">
                            Est. {task.estimated_hours}h
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="font-sans text-[13px] text-ink3 mt-[2px] truncate">{task.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleStatusCycle(task)}
                      disabled={updateTask.isPending}
                      title="Click to advance status"
                      className={`ml-4 shrink-0 inline-block px-2 py-[3px] rounded font-sans text-[11px] font-semibold transition-opacity hover:opacity-70 disabled:opacity-40 cursor-pointer ${TASK_STATUS_BADGE[task.status]}`}
                    >
                      {task.status}
                    </button>
                  </div>

                  {/* Subtasks */}
                  {task.subtasks.length > 0 && (
                    <div className="border-t border-border">
                      {task.subtasks.map(sub => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between pl-8 pr-4 py-[10px] border-b border-border last:border-b-0 bg-bg"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-sans text-[13px] text-ink2">{sub.task_name}</span>
                              {sub.is_unplanned && (
                                <span className="inline-block px-2 py-[3px] rounded font-sans text-[11px] font-semibold bg-danger-light text-danger">
                                  Scope creep
                                </span>
                              )}
                              {sub.estimated_hours && (
                                <span className="font-mono text-[11px] text-ink3">Est. {sub.estimated_hours}h</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleStatusCycle(sub)}
                            disabled={updateTask.isPending}
                            title="Click to advance status"
                            className={`ml-4 shrink-0 inline-block px-2 py-[3px] rounded font-sans text-[11px] font-semibold transition-opacity hover:opacity-70 disabled:opacity-40 cursor-pointer ${TASK_STATUS_BADGE[sub.status]}`}
                          >
                            {sub.status}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Log Time ────────────────────────────────────────────────── */}
      {activeTab === 'log' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowLogForm(v => !v)}
              className="px-[14px] py-[6px] rounded bg-ink text-white font-sans text-[12px] font-medium border border-ink hover:bg-[#333] transition-colors"
            >
              {showLogForm ? 'Cancel' : '+ Log time'}
            </button>
          </div>

          {showLogForm && (
            <div className="bg-surface border border-border rounded-lg p-4 mb-4">
              <TimeLogForm
                tasks={allTasks}
                isLoading={createTimeLog.isPending}
                onSubmit={handleLogTime}
              />
            </div>
          )}

          <TimeLogList logs={logs} isManager={false} />
        </div>
      )}

      {/* ── Tab: Files ───────────────────────────────────────────────────── */}
      {activeTab === 'files' && (
        <FileUploadPanel
          projectId={projectId}
          role={user?.role ?? 'Designer'}
          isManager={false}
        />
      )}

      {/* ── Tab: Feedback ────────────────────────────────────────────────── */}
      {activeTab === 'feedback' && (
        <FeedbackList projectId={projectId} canUpdate={true} />
      )}
    </AppShell>
  );
}