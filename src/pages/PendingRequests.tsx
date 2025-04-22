
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { useNoc } from '@/contexts/NocContext';
import NocRequestCard from '@/components/NocRequestCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const PendingRequests = () => {
  const { getUserNocRequests, updateNocStatus, loading } = useNoc();
  const { toast } = useToast();
  
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  
  // Get all pending requests
  const allRequests = getUserNocRequests();
  const pendingRequests = allRequests.filter(req => req.status === 'Pending');
  
  // Sort by most recent first
  const sortedRequests = [...pendingRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleApprove = async (id: string) => {
    try {
      await updateNocStatus(id, 'Approved');
      toast({
        title: 'Request Approved',
        description: 'The NOC request has been approved successfully.',
      });
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Action Failed',
        description: 'An error occurred while approving the request.',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    
    try {
      await updateNocStatus(selectedRequest, 'Rejected', remarks);
      setRejectDialogOpen(false);
      setSelectedRequest(null);
      setRemarks('');
      toast({
        title: 'Request Rejected',
        description: 'The NOC request has been rejected with your remarks.',
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: 'Action Failed',
        description: 'An error occurred while rejecting the request.',
        variant: 'destructive',
      });
    }
  };

  const openRejectDialog = (id: string) => {
    setSelectedRequest(id);
    setRejectDialogOpen(true);
  };

  return (
    <AppLayout>
      <PageHeader 
        title="Pending Requests"
        description="Review and respond to pending NOC requests from students"
      />
      
      {/* Requests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRequests.length > 0 ? (
          sortedRequests.map((request) => (
            <NocRequestCard
              key={request.id}
              request={request}
              onApprove={handleApprove}
              onReject={(id) => openRejectDialog(id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 border rounded-lg bg-white">
            <p className="text-muted-foreground">No pending NOC requests found</p>
          </div>
        )}
      </div>
      
      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject NOC Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this NOC request.
              This will be visible to the student.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Reason for rejection..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              required
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setSelectedRequest(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={loading || !remarks.trim()}
            >
              {loading ? 'Processing...' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default PendingRequests;
