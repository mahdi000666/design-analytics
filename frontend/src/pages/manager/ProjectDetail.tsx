import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProject, useUpdateProject, useDeleteProject } from '../../hooks/useProjects';
import { useTasks, useCreateTask } from '../../hooks/useTasks';
import { useAuth } from '../../hooks/useAuth';
import TaskForm from '../../components/TaskForm';
import TaskRow from '../../components/TaskRow';
import AssignDesignerPanel from '../../components/AssignDesignerPanel';
import type { TaskPayload } from '../../types/task';
import type { Project } from '../../types/project';

const ProjectDetail = () => {
  const { id }        = useParams<{ id: string }>();
  const projectId     = Number(id);
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const isManager     = user?.role === 'Manager';

  const { data: project, isLoading: loadingProject } = useProject(projectId);
  const { data: tasks,   isLoading: loadingTasks   } = useTasks(projectId);
  const createTask    = useCreateTask(projectId);
  const updateProject = useUpdateProject(projectId);
  const deleteProject = useDeleteProject();

  const [showTaskForm, setShowTaskForm] = useState(false);

  if (loadingProject) return <p className="p-6">Loading…</p>;
  if (!project)       return <p className="p-6 text-red-500">Project not found.</p>;

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

  // Only top-level tasks can be parents — subtasks cannot themselves have children.
  // tasks is already filtered to parent_task=null by the backend queryset.
  const parentTaskOptions = tasks?.map(t => ({ id: t.id, task_name: t.task_name })) ?? [];

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{project.project_name}</h1>
          <p className="text-gray-500 text-sm mt-1">{project.client_name}</p>
        </div>

        <div className="flex items-center gap-3">
          {isManager ? (
            <select
              value={project.status}
              onChange={e =>
                updateProject.mutate({ status: e.target.value as Project['status'] })
              }
              className="text-sm rounded border-gray-300 shadow-sm"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="OnHold">On Hold</option>
            </select>
          ) : (
            <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-700">
              {project.status}
            </span>
          )}

          <span className="text-sm text-gray-400">
            {project.deadline ? `Due ${project.deadline}` : 'No deadline'}
          </span>

          {isManager && (
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete project
            </button>
          )}
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

      {/* Assign designers — manager only */}
      {isManager && <AssignDesignerPanel project={project} />}

      {/* Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Tasks</h2>
          {isManager && (
            <button
              onClick={() => setShowTaskForm(v => !v)}
              className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded hover:bg-gray-700"
            >
              {showTaskForm ? 'Cancel' : '+ Add task'}
            </button>
          )}
        </div>

        {showTaskForm && isManager && (
          <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
            <TaskForm
              projectId={projectId}
              onSubmit={handleCreateTask}
              isLoading={createTask.isPending}
              // Passes existing top-level tasks so the manager can optionally
              // create a task already nested under an existing one.
              parentTaskOptions={parentTaskOptions}
            />
          </div>
        )}

        {loadingTasks
          ? <p className="text-gray-400 text-sm">Loading tasks…</p>
          : tasks?.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                projectId={projectId}
                isManager={isManager}
              />
            ))
        }
      </div>
    </div>
  );
};

export default ProjectDetail;