import { useQuery } from '@tanstack/react-query';
import { useAssignDesigner } from '../hooks/useProjects';
import apiClient from '../api/client';
import type { Project } from '../types/project';

interface DesignerOption {
  id:   number;
  name: string;
}

interface Props {
  project: Project;
}

const AssignDesignerPanel = ({ project }: Props) => {
  const assignDesigner = useAssignDesigner(project.id);

  const { data: designers } = useQuery({
    queryKey: ['designers'],
    queryFn:  async () => {
      const { data } = await apiClient.get<DesignerOption[]>('/users/designers/');
      return data;
    },
  });

  const assignedIds = new Set(project.assignments.map(a => a.designer_id));

  const handleAssign = (designerId: number) => {
    assignDesigner.mutate(designerId);
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-3">Assigned designers</h2>

      {project.assignments.length === 0
        ? <p className="text-sm text-gray-400 mb-3">No designers assigned yet.</p>
        : (
          <div className="flex flex-wrap gap-2 mb-3">
            {project.assignments.map(a => (
              <span
                key={a.designer_id}
                className="px-3 py-1 text-sm rounded-full bg-violet-100 text-violet-800"
              >
                {a.designer_name}
              </span>
            ))}
          </div>
        )
      }

      <div className="flex gap-2 flex-wrap">
        {designers
          ?.filter(d => !assignedIds.has(d.id))
          .map(d => (
            <button
              key={d.id}
              onClick={() => handleAssign(d.id)}
              disabled={assignDesigner.isPending}
              className="px-3 py-1 text-sm rounded border border-violet-300 text-violet-700 hover:bg-violet-50 disabled:opacity-50"
            >
              + {d.name}
            </button>
          ))
        }
      </div>
    </div>
  );
};

export default AssignDesignerPanel;