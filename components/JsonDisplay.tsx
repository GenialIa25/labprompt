
import React from 'react';

interface JsonDisplayProps {
  data: object;
}

export const JsonDisplay: React.FC<JsonDisplayProps> = ({ data }) => {
  const formattedJson = JSON.stringify(data, null, 2);

  return (
    <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
      <pre className="text-sm text-cyan-300 whitespace-pre-wrap break-all">
        <code>{formattedJson}</code>
      </pre>
    </div>
  );
};
