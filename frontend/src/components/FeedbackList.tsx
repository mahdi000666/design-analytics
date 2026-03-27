import { useFeedback, useUpdateFeedbackStatus } from '../hooks/useFeedback';
import type { FeedbackStatus } from '../types/feedback';

const STATUS_STYLES: Record<FeedbackStatus, string> = {
  Pending:    'bg-yellow-100 text-yellow-700',
  InProgress: 'bg-blue-100 text-blue-700',
  Resolved:   'bg-green-100 text-green-700',
};

const CATEGORY_STYLES: Record<string, string> = {
  Revision: 'bg-red-100 text-red-700',
  Approval: 'bg-green-100 text-green-700',
  Question: 'bg-gray-100 text-gray-700',
};

interface Props {
  projectId: number;
  canUpdate: boolean;   // true for Manager and Designer
}

const FeedbackList = ({ projectId, canUpdate }: Props) => {
  const { data: items = [], isLoading } = useFeedback(projectId);
  const updateStatus = useUpdateFeedbackStatus(projectId);

  if (isLoading) return <p className="text-sm text-gray-400">Loading feedback…</p>;
  if (!items.length) return <p className="text-sm text-gray-400">No feedback yet.</p>;

  const NEXT_STATUS: Record<FeedbackStatus, FeedbackStatus | null> = {
    Pending:    'InProgress',
    InProgress: 'Resolved',
    Resolved:   null,
  };

  return (
    <ul className="space-y-3">
      {items.map(item => {
        const next = NEXT_STATUS[item.status];
        return (
          <li key={item.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_STYLES[item.category]}`}>
                    {item.category}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[item.status]}`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.submitted_at).toLocaleDateString()}
                  </span>
                  {item.resolved_at && (
                    <span className="text-xs text-gray-400">
                      Resolved {new Date(item.resolved_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700">{item.content_text}</p>
              </div>

              {canUpdate && next && (
                <button
                  onClick={() => updateStatus.mutate({ id: item.id, status: next })}
                  disabled={updateStatus.isPending}
                  className="text-xs px-2 py-1 border rounded hover:bg-gray-50 flex-shrink-0 disabled:opacity-50"
                >
                  Mark {next}
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default FeedbackList;