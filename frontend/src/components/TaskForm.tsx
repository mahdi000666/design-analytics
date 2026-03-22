import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { estimateTaskHours } from '../api/tasks';
import type { TaskPayload } from '../types/task';

const schema = z.object({
  task_name:       z.string().min(1, 'Task name is required'),
  description:     z.string().optional(),
  estimated_hours: z.string().optional(),   // stays string; converted on submit
  is_unplanned:    z.boolean(),
  parent_task:     z.string().optional(),   // stays string; converted on submit
});

type FormValues = z.infer<typeof schema>;

interface Props {
  projectId:  number;
  onSubmit:   (payload: TaskPayload) => void;
  isLoading:  boolean;
}

const TaskForm = ({ projectId, onSubmit, isLoading }: Props) => {
  const [estimating, setEstimating] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } =
  useForm<FormValues>({
    resolver:      zodResolver(schema),
    defaultValues: { is_unplanned: false },
  });

  const taskName   = watch('task_name');
  const description = watch('description');

  const handleEstimate = async () => {
    setEstimating(true);
    setAiReasoning(null);
    const result = await estimateTaskHours(taskName ?? '', description ?? '');
    if (result.estimated_hours !== null) {
      // Pre-fill the field — manager can still edit it before saving.
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
        parent_task:     values.parent_task     ? parseInt(values.parent_task, 10)   : null,
    });
};

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">

      <div>
        <label className="block text-sm font-medium text-gray-700">Task name</label>
        <input {...register('task_name')} className="mt-1 block w-full rounded border-gray-300 shadow-sm" />
        {errors.task_name && <p className="text-red-500 text-xs mt-1">{errors.task_name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea {...register('description')} rows={3} className="mt-1 block w-full rounded border-gray-300 shadow-sm" />
      </div>

      {/* AI Estimator */}
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
            disabled={estimating || !taskName}
            className="px-3 py-1.5 text-sm bg-violet-600 text-white rounded hover:bg-violet-700 disabled:opacity-50"
          >
            {estimating ? 'Estimating…' : '✦ AI Suggest'}
          </button>
        </div>
        {aiReasoning && (
          <p className="text-xs text-gray-500 mt-1 italic">{aiReasoning}</p>
        )}
      </div>

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
        {isLoading ? 'Saving…' : 'Save task'}
      </button>
    </form>
  );
};

export default TaskForm;