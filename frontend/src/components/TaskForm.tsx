import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { estimateTaskHours } from '../api/tasks';
import type { Task, TaskPayload } from '../types/task';

const schema = z.object({
  task_name:       z.string().min(1, 'Task name is required'),
  description:     z.string().optional(),
  estimated_hours: z.string().optional(),
  is_unplanned:    z.boolean(),
  parent_task:     z.string().optional(),
  status:          z.enum(['Todo', 'InProgress', 'Completed']).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  projectId:  number;
  onSubmit:   (payload: TaskPayload) => void;
  isLoading:  boolean;
  defaults?:  Partial<Task>;
}

const TaskForm = ({ projectId, onSubmit, isLoading, defaults }: Props) => {
  const isEdit = defaults !== undefined;

  const [estimating,  setEstimating]  = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);

  const { register, handleSubmit, setValue, getValues, formState: { errors } } =
    useForm<FormValues>({
      resolver:      zodResolver(schema),
      defaultValues: {
        is_unplanned:    defaults?.is_unplanned    ?? false,
        task_name:       defaults?.task_name        ?? '',
        description:     defaults?.description      ?? '',
        estimated_hours: defaults?.estimated_hours != null
          ? String(defaults.estimated_hours)
          : '',
        status:          defaults?.status           ?? 'Todo',
        parent_task:     defaults?.parent_task != null
          ? String(defaults.parent_task)
          : '',
      },
    });

  // Read form values at click time — no reactive subscription needed.
  const handleEstimate = async () => {
    const { task_name, description } = getValues();
    if (!task_name) return;

    setEstimating(true);
    setAiReasoning(null);

    const result = await estimateTaskHours(task_name, description ?? '', projectId);
    if (result.estimated_hours !== null) {
      setValue('estimated_hours', String(result.estimated_hours));
    }
    setAiReasoning(result.reasoning);
    setEstimating(false);
  };

  const submit = (values: FormValues) => {
    onSubmit({
      project:         projectId,
      task_name:       values.task_name,
      description:     values.description,
      estimated_hours: values.estimated_hours ? parseFloat(values.estimated_hours) : null,
      is_unplanned:    values.is_unplanned,
      parent_task:     values.parent_task ? parseInt(values.parent_task, 10) : null,
      ...(isEdit && values.status ? { status: values.status } : {}),
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">

      <div>
        <label className="block text-sm font-medium text-gray-700">Task name</label>
        <input
          {...register('task_name')}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm"
        />
        {errors.task_name && (
          <p className="text-red-500 text-xs mt-1">{errors.task_name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Estimated hours</label>
        <div className="flex gap-2 mt-1">
          <input
            type="number"
            step="0.5"
            {...register('estimated_hours')}
            className="block w-32 rounded border-gray-300 shadow-sm"
          />
          <button
            type="button"
            onClick={handleEstimate}
            disabled={estimating}
            className="px-3 py-1.5 text-sm bg-violet-600 text-white rounded hover:bg-violet-700 disabled:opacity-50"
          >
            {estimating ? 'Estimating…' : '✦ AI Suggest'}
          </button>
        </div>
        {aiReasoning && (
          <p className="text-xs text-gray-500 mt-1 italic">{aiReasoning}</p>
        )}
      </div>

      {isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          >
            <option value="Todo">Todo</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input type="checkbox" id="is_unplanned" {...register('is_unplanned')} />
        <label htmlFor="is_unplanned" className="text-sm text-gray-700">
          Unplanned task <span className="text-orange-500 font-medium">(scope creep)</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-gray-900 text-white rounded hover:bg-gray-700 disabled:opacity-50"
      >
        {isLoading ? 'Saving…' : isEdit ? 'Save changes' : 'Save task'}
      </button>

    </form>
  );
};

export default TaskForm;