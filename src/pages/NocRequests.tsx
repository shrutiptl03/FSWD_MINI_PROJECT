
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { useNoc, NocRequest } from '@/contexts/NocContext';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NocRequestCard from '@/components/NocRequestCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

const NocRequests = () => {
  const { user } = useAuth();
  const { getUserNocRequests } = useNoc();
  const navigate = useNavigate();
  const isStudent = user?.role === 'student';
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const allRequests = getUserNocRequests();
  
  // Apply filter
  const filteredRequests = statusFilter === 'all'
    ? allRequests
    : allRequests.filter(req => req.status === statusFilter);
    
  // Sort by most recent first
  const sortedRequests = [...filteredRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <AppLayout>
      <PageHeader 
        title={isStudent ? "My NOC Requests" : "All NOC Requests"}
        description={isStudent 
          ? "View and manage all your NOC requests" 
          : "View and manage all student NOC requests"
        }
        action={
          isStudent
            ? {
                label: 'New Request',
                onClick: () => navigate('/new-request'),
                icon: <Plus className="h-4 w-4" />,
              }
            : undefined
        }
      />
      
      {/* Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredRequests.length} of {allRequests.length} requests
        </div>
      </div>
      
      {/* Requests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRequests.length > 0 ? (
          sortedRequests.map((request) => (
            <NocRequestCard
              key={request.id}
              request={request}
              isStudent={isStudent}
              onDownload={
                request.status === 'Approved'
                  ? (id) => navigate(`/download-noc/${id}`)
                  : undefined
              }
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 border rounded-lg bg-white">
            <p className="text-muted-foreground mb-4">No NOC requests found</p>
            {isStudent && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/new-request')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first NOC request
              </Button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default NocRequests;
