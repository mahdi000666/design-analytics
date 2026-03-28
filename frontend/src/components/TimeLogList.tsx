import type { TimeLog } from '../types/timelog';

interface Props {
  logs:      TimeLog[];
  isManager: boolean;
  onDelete?: (id: number) => void;
}

const TimeLogList = ({ logs, isManager, onDelete }: Props) => {
  if (!logs.length) {
    return <p className="text-sm text-gray-400">No time logged yet.</p>;
  }

  const total = logs.reduce((sum, l) => sum + Number(l.hours_spent), 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500 border-b">
            <th className="pb-2 pr-4 font-medium">Task</th>
            {isManager && <th className="pb-2 pr-4 font-medium">Designer</th>}
            <th className="pb-2 pr-4 font-medium">Hours</th>
            <th className="pb-2 pr-4 font-medium">Description</th>
            <th className="pb-2 pr-4 font-medium">Date</th>
            {isManager && <th className="pb-2 font-medium" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {logs.map(log => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="py-2 pr-4 font-medium">{log.task_name}</td>
              {isManager && <td className="py-2 pr-4 text-gray-600">{log.designer_name}</td>}
              <td className="py-2 pr-4 tabular-nums">{log.hours_spent}h</td>
              <td className="py-2 pr-4 text-gray-600 max-w-xs truncate">
                {log.description || <span className="text-gray-300">—</span>}
              </td>
              <td className="py-2 pr-4 text-gray-500 whitespace-nowrap">
                {new Date(log.created_at).toLocaleDateString()}
              </td>
              {isManager && (
                <td className="py-2 text-right">
                  <button
                    onClick={() => onDelete?.(log.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t text-xs text-gray-500">
            <td className="pt-2 pr-4 font-medium">Total</td>
            {isManager && <td />}
            <td className="pt-2 pr-4 tabular-nums font-semibold text-gray-800">
              {total.toFixed(2)}h
            </td>
            <td colSpan={isManager ? 3 : 2} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TimeLogList;