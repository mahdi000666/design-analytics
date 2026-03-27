import { useRef, useState } from 'react';
import { useFiles, useUploadFile, useDeleteFile } from '../hooks/useFiles';
import type { FileType } from '../types/file';

// Each role may only upload specific file types (enforced server-side too).
const ALLOWED_TYPES: Record<string, { value: FileType; label: string }[]> = {
  Manager:  [
    { value: 'deliverable',    label: 'Deliverable' },
    { value: 'reference',      label: 'Reference' },
    { value: 'brand_guideline', label: 'Brand Guideline' },
  ],
  Designer: [{ value: 'deliverable', label: 'Deliverable' }],
  Client:   [
    { value: 'reference',      label: 'Reference' },
    { value: 'brand_guideline', label: 'Brand Guideline' },
  ],
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface Props {
  projectId: number;
  role:      string;
  isManager: boolean;
}

const FileUploadPanel = ({ projectId, role, isManager }: Props) => {
  const { data: files = [], isLoading } = useFiles(projectId);
  const uploadFile  = useUploadFile(projectId);
  const deleteFile  = useDeleteFile(projectId);

  const allowedTypes = ALLOWED_TYPES[role] ?? ALLOWED_TYPES['Manager'];
  const [fileType, setFileType] = useState<FileType>(allowedTypes[0].value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile.mutate({ fileType, file }, {
      onSettled: () => {
        // Reset the input so the same file can be re-uploaded if needed.
        if (inputRef.current) inputRef.current.value = '';
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload controls */}
      <div className="flex items-center gap-3">
        {allowedTypes.length > 1 && (
          <select
            value={fileType}
            onChange={e => setFileType(e.target.value as FileType)}
            className="text-sm rounded border-gray-300 shadow-sm"
          >
            {allowedTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        )}

        <label className="cursor-pointer px-3 py-1.5 text-sm bg-gray-900 text-white rounded hover:bg-gray-700">
          {uploadFile.isPending ? 'Uploading…' : '+ Upload file'}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploadFile.isPending}
          />
        </label>

        {uploadFile.isError && (
          <span className="text-xs text-red-500">Upload failed.</span>
        )}
      </div>

      {/* File list */}
      {isLoading ? (
        <p className="text-sm text-gray-400">Loading files…</p>
      ) : files.length === 0 ? (
        <p className="text-sm text-gray-400">No files uploaded yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {files.map(f => (
            <li key={f.id} className="flex items-center justify-between py-2 gap-4">
              <div className="min-w-0">
                <a
                  href={f.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:underline truncate block"
                >
                  {f.file_name}
                </a>
                <p className="text-xs text-gray-400 mt-0.5">
                  {f.file_type} · {formatBytes(f.file_size)} · {f.uploaded_by_name} ·{' '}
                  {new Date(f.uploaded_at).toLocaleDateString()}
                </p>
              </div>

              {isManager && (
                <button
                  onClick={() => deleteFile.mutate(f.id)}
                  className="text-xs text-red-500 hover:underline flex-shrink-0"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUploadPanel;