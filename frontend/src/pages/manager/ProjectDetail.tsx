import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProject, useUpdateProject, useDeleteProject } from '../../hooks/useProjects';
import { useTasks, useCreateTask } from '../../hooks/useTasks';
import { useTimeLogs, useDeleteTimeLog } from '../../hooks/useTimeLogs';
import { useAuth } from '../../hooks/useAuth';
import TaskForm from '../../components/TaskForm';
import TaskRow from '../../components/TaskRow';
import AssignDesignerPanel from '../../components/AssignDesignerPanel';
import TimeLogList from '../../components/TimeLogList';
import FileUploadPanel from '../../components/FileUploadPanel';
import FeedbackList from '../../components/FeedbackList';
import AppShell from '../../components/AppShell';
import type { TaskPayload } from '../../types/task';
import type { Project } from '../../types/project';

// ─── Helpers ─────────────────────────────────────────────────────────────────

type Tab = 'tasks' | 'logs' | 'files' | 'feedback';

const TABS: { id: Tab; label: string }[] = [
  { id: 'tasks',    label: 'Tasks'     },
  { id: 'logs',     label: 'Time Logs' },
  { id: 'files',    label: 'Files'     },
  { id: 'feedback', label: 'Feedback'  },
];

const STATUS_BADGE: Record<Project['status'], string> = {
  Active:    'bg-success-light text-success',
  Completed: 'bg-surface2 text-ink3',
  OnHold:    'bg-amber-light text-amber-dark',
};

const barColor = (pct: number) =>
  pct >= 100 ? 'bg-danger' : pct >= 80 ? 'bg-amber' : 'bg-teal';

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProjectDetail() {
  const { id }    = useParams<{ id: string }>();
  const projectId = Number(id);
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const isManager = user?.role === 'Manager';

  const { data: project, isLoading: loadingProject } = useProject(projectId);
  const { data: tasks,   isLoading: loadingTasks   } = useTasks(projectId);
  const { data: logs = []                           } = useTimeLogs(projectId);

  const createTask    = useCreateTask(projectId);
  const updateProject = useUpdateProject(projectId);
  const deleteProject = useDeleteProject();
  const deleteTimeLog = useDeleteTimeLog(projectId);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeTab,    setActiveTab]    = useState<Tab>('tasks');

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

  const handleCreateTask = (payload: TaskPayload) => {
    createTask.mutate(payload, { onSuccess: () => setShowTaskForm(false) });
  };

  const handleDelete = () => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    deleteProject.mutate(project.id, {
      onSuccess: () => navigate('/manager/projects'),
    });
  };

  const parentTaskOptions = tasks?.map(t => ({ id: t.id, task_name: t.task_name })) ?? [];

  // Tab label with task / log counts
  const tabLabel = (tab: Tab) => {
    if (tab === 'tasks' && tasks)  return `Tasks (${tasks.length})`;
    if (tab === 'logs')            return `Time Logs (${logs.length})`;
    return TABS.find(t => t.id === tab)?.label ?? tab;
  };

  return (
    <AppShell
      title={project.project_name}
      breadcrumb={project.client_name}
      actions={
        isManager ? (
          <div className="flex items-center gap-3">
            {/* Status selector */}
            <select
              value={project.status}
              onChange={e => updateProject.mutate({ status: e.target.value as Project['status'] })}
              className="font-sans text-[12px] text-ink border border-border-strong rounded px-2 py-[5px] bg-surface outline-none focus:border-amber transition-colors"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="OnHold">On Hold</option>
            </select>

            <button
              onClick={handleDelete}
              className="px-[14px] py-[6px] rounded bg-transparent text-danger font-sans text-[12px] border border-danger/30 hover:bg-danger-light transition-colors"
            >
              Delete
            </button>
          </div>
        ) : (
          <span className={`inline-block px-2 py-[3px] rounded font-sans text-[11px] font-semibold ${STATUS_BADGE[project.status]}`}>
            {project.status}
          </span>
        )
      }
    >
      {/* ── Meta row ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <span className={`inline-block px-2 py-[3px] rounded font-sans text-[11px] font-semibold ${STATUS_BADGE[project.status]}`}>
          {project.status}
        </span>
        {project.deadline && (
          <span className="font-sans text-[13px] text-ink3">
            Due <span className="text-ink">{project.deadline}</span>
          </span>
        )}
        {project.budget_amount && (
          <span className="font-sans text-[13px] text-ink3">
            Budget <span className="font-mono text-ink">${Number(project.budget_amount).toLocaleString()}</span>
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

      {/* ── Designer assignments (manager only) ─────────────────────────── */}
      {isManager && (
        <div className="mb-6">
          <AssignDesignerPanel project={project} />
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
            {tabLabel(tab.id)}
          </button>
        ))}
      </div>

      {/* ── Tab: Tasks ───────────────────────────────────────────────────── */}
      {activeTab === 'tasks' && (
        <div>
          {isManager && (
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowTaskForm(v => !v)}
                className="px-[14px] py-[6px] rounded bg-ink text-white font-sans text-[12px] font-medium border border-ink hover:bg-[#333] transition-colors"
              >
                {showTaskForm ? 'Cancel' : '+ Add task'}
              </button>
            </div>
          )}

          {showTaskForm && isManager && (
            <div className="bg-surface border border-border rounded-lg p-4 mb-4">
              <TaskForm
                projectId={projectId}
                onSubmit={handleCreateTask}
                isLoading={createTask.isPending}
                parentTaskOptions={parentTaskOptions}
              />
            </div>
          )}

          {loadingTasks ? (
            <p className="font-sans text-[13px] text-ink3">Loading tasks…</p>
          ) : tasks?.length === 0 ? (
            <p className="font-sans text-[13px] text-ink3">No tasks yet.</p>
          ) : (
            tasks?.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                projectId={projectId}
                isManager={isManager}
              />
            ))
          )}
        </div>
      )}

      {/* ── Tab: Time Logs ───────────────────────────────────────────────── */}
      {activeTab === 'logs' && (
        <TimeLogList
          logs={logs}
          isManager={isManager}
          onDelete={id => deleteTimeLog.mutate(id)}
        />
      )}

      {/* ── Tab: Files ───────────────────────────────────────────────────── */}
      {activeTab === 'files' && (
        <FileUploadPanel
          projectId={projectId}
          role={user?.role ?? 'Manager'}
          isManager={isManager}
        />
      )}

      {/* ── Tab: Feedback ────────────────────────────────────────────────── */}
      {activeTab === 'feedback' && (
        <FeedbackList projectId={projectId} canUpdate={true} />
      )}
    </AppShell>
  );
}