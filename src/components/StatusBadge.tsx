
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'Pending' | 'Approved' | 'Rejected';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusClasses = (status: StatusType) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  return (
    <span 
      className={cn(
        'px-3 py-1 text-xs font-medium rounded-full', 
        getStatusClasses(status),
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
