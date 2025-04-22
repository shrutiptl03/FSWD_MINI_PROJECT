
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useNoc } from '@/contexts/NocContext';
import { FileText, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import NocRequestCard from '@/components/NocRequestCard';

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserNocRequests } = useNoc();
  const navigate = useNavigate();
  
  const isStudent = user?.role === 'student';
  const requests = getUserNocRequests();
  
  // Calculate stats
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(req => req.status === 'Pending').length;
  const approvedRequests = requests.filter(req => req.status === 'Approved').length;
  const rejectedRequests = requests.filter(req => req.status === 'Rejected').length;
  
  // Recent requests
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <AppLayout>
      <PageHeader 
        title={`${isStudent ? 'Student' : 'Faculty'} Dashboard`}
        description={`Welcome back, ${user?.name}`}
        action={
          isStudent
            ? {
                label: 'New NOC Request',
                onClick: () => navigate('/new-request'),
                icon: <Plus className="h-4 w-4" />,
              }
            : undefined
        }
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              All NOC requests {isStudent ? 'you have submitted' : 'submitted to you'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Requests awaiting {isStudent ? 'faculty approval' : 'your approval'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedRequests}</div>
            <p className="text-xs text-muted-foreground">
              Requests that have been approved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedRequests}</div>
            <p className="text-xs text-muted-foreground">
              Requests that have been rejected
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
          <CardDescription>
            {isStudent
              ? 'Your most recent NOC requests'
              : 'Most recent NOC requests from students'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentRequests.length > 0 ? (
            <div className="grid gap-4">
              {recentRequests.map((request) => (
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
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No NOC requests yet</p>
              {isStudent && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/new-request')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first NOC request
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Dashboard;
