import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useProjects, useCreateProject } from '../../hooks/useProjects';
import ProjectForm from '../../components/ProjectForm';
import type { ProjectPayload } from '../../types/project';

const statusColour: Record<string, string> = {
  Active:    'bg-green-100 text-green-800',
  Completed: 'bg-gray-100 text-gray-600',
  OnHold:    'bg-yellow-100 text-yellow-800',
};

const ProjectList = () => {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const [showForm, setShowForm] = useState(false);

  const handleCreate = (payload: ProjectPayload) => {
    createProject.mutate(payload, { onSuccess: () => setShowForm(false) });
  };

  if (isLoading) return <p className="p-6">Loading projects…</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700"
        >
          + New project
        </button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-lg font-medium mb-4">Create project</h2>
          <ProjectForm onSubmit={handleCreate} isLoading={createProject.isPending} />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Project', 'Client', 'Status', 'Budget hrs', 'Actual hrs', 'Deadline'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects?.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link to={`/manager/projects/${p.id}`} className="font-medium text-violet-700 hover:underline">
                    {p.project_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.client_name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColour[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.budget_hours ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{p.actual_hours}</td>
                <td className="px-4 py-3 text-gray-600">{p.deadline ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList;