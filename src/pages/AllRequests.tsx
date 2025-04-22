
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { useNoc } from '@/contexts/NocContext';
import NocRequestCard from '@/components/NocRequestCard';
import { useNavigate } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const AllRequests = () => {
  const { getUserNocRequests } = useNoc();
  const navigate = useNavigate();
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const allRequests = getUserNocRequests();
  
  // Filter by status and search query
  const filteredRequests = allRequests.filter(req => {
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesSearch = 
      req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.internshipDetails.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.internshipDetails.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
    
  // Sort by most recent first
  const sortedRequests = [...filteredRequests].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <AppLayout>
      <PageHeader 
        title="All NOC Requests"
        description="View and manage all student NOC requests"
      />
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
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
        
        <div className="flex-1 w-full md:w-auto md:max-w-sm relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student, company, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground mb-4">
        Showing {filteredRequests.length} of {allRequests.length} requests
      </div>
      
      {/* Requests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRequests.length > 0 ? (
          sortedRequests.map((request) => (
            <NocRequestCard
              key={request.id}
              request={request}
              onDownload={
                request.status === 'Approved'
                  ? (id) => navigate(`/download-noc/${id}`)
                  : undefined
              }
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 border rounded-lg bg-white">
            <p className="text-muted-foreground">
              {searchQuery
                ? 'No matching NOC requests found. Try adjusting your search.'
                : 'No NOC requests found.'}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AllRequests;
