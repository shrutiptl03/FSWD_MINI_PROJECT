
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { NocRequest } from '@/contexts/NocContext';
import { formatDate } from '@/lib/utils';

interface NocRequestCardProps {
  request: NocRequest;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDownload?: (id: string) => void;
  isStudent?: boolean;
}

const NocRequestCard: React.FC<NocRequestCardProps> = ({ 
  request, 
  onApprove, 
  onReject, 
  onDownload,
  isStudent = false
}) => {
  const { 
    id, 
    studentName, 
    internshipDetails, 
    status, 
    createdAt, 
    remarks 
  } = request;

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">
            {internshipDetails.companyName} - {internshipDetails.role}
          </CardTitle>
          {!isStudent && (
            <p className="text-sm text-muted-foreground">Student: {studentName}</p>
          )}
        </div>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(internshipDetails.startDate)} - {formatDate(internshipDetails.endDate)}
            </span>
          </div>
          <p className="text-sm">Duration: {internshipDetails.duration}</p>
          {remarks && (
            <div className="mt-2 p-2 bg-muted rounded-md">
              <p className="text-sm font-medium">Remarks:</p>
              <p className="text-sm">{remarks}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Requested on {formatDate(createdAt)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {status === 'Approved' && onDownload && (
          <Button variant="outline" size="sm" onClick={() => onDownload(id)}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        )}
        {!isStudent && status === 'Pending' && (
          <>
            {onReject && (
              <Button variant="outline" size="sm" onClick={() => onReject(id)}>
                Reject
              </Button>
            )}
            {onApprove && (
              <Button variant="default" size="sm" onClick={() => onApprove(id)}>
                Approve
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default NocRequestCard;
