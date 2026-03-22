import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as projectsApi from '../api/projects';
import type { ProjectPayload } from '../types/project';

export const useProjects = () =>
  useQuery({ queryKey: ['projects'], queryFn: projectsApi.getProjects });

export const useProject = (id: number) =>
  useQuery({ queryKey: ['projects', id], queryFn: () => projectsApi.getProject(id) });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useUpdateProject = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ProjectPayload>) => projectsApi.updateProject(id, payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['projects', id] }),
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useAssignDesigner = (projectId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (designerId: number) => projectsApi.assignDesigner(projectId, designerId),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['projects', projectId] }),
  });
};