import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { ProjectPayload } from '../types/project';

const schema = z.object({
  project_name:  z.string().min(1, 'Project name is required'),
  client:        z.string().min(1, 'Client is required'),
  description:   z.string().optional(),
  budget_hours:  z.string().optional(),
  budget_amount: z.string().optional(),
  deadline:      z.string().optional(),
  status:        z.enum(['Active', 'Completed', 'OnHold']),
  category:      z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onSubmit:   (payload: ProjectPayload) => void;
  isLoading:  boolean;
  defaults?:  Partial<FormValues>;
}

interface ClientOption {
  id:   number;
  name: string;
}

const ProjectForm = ({ onSubmit, isLoading, defaults }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver:      zodResolver(schema),
    defaultValues: { status: 'Active', ...defaults },
  });

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn:  async () => {
      const { data } = await apiClient.get<ClientOption[]>('/users/clients/');
      return data;
    },
  });

  const submit = (values: FormValues) => {
  onSubmit({
    project_name:  values.project_name,
    client:        parseInt(values.client, 10),
    description:   values.description,
    budget_hours:  values.budget_hours  ? parseFloat(values.budget_hours)  : undefined,
    budget_amount: values.budget_amount ? parseFloat(values.budget_amount) : undefined,
    deadline:      values.deadline || undefined,
    status:        values.status,
    category:      values.category,
  });
};

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Project name</label>
          <input
            {...register('project_name')}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          />
          {errors.project_name && (
            <p className="text-red-500 text-xs mt-1">{errors.project_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Client</label>
          <select
            {...register('client')}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          >
            <option value="">Select a client…</option>
            {clients?.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.client && (
            <p className="text-red-500 text-xs mt-1">{errors.client.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Budget (hours)</label>
          <input
            type="number"
            step="0.5"
            {...register('budget_hours')}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Budget (amount $)</label>
          <input
            type="number"
            step="0.01"
            {...register('budget_amount')}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Deadline</label>
          <input
            type="date"
            {...register('deadline')}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="OnHold">On Hold</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          {...register('category')}
          placeholder="e.g. Branding, Web, Print"
          className="mt-1 block w-full rounded border-gray-300 shadow-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-gray-900 text-white rounded hover:bg-gray-700 disabled:opacity-50"
      >
        {isLoading ? 'Saving…' : 'Save project'}
      </button>

    </form>
  );
};

export default ProjectForm;