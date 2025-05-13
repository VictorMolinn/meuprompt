import React from 'react';
import { Info } from 'lucide-react';

interface TutorialCardProps {
  title: string;
  description: string;
  example?: string;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ title, description, example }) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">{title}</h3>
          <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
            <p>{description}</p>
            {example && (
              <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-700 font-mono text-xs">
                {example}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialCard;