import React from 'react';

const PromptSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      
      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        
        {/* Title */}
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        
        {/* Rating */}
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        
        {/* Button */}
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
};

export default PromptSkeleton;