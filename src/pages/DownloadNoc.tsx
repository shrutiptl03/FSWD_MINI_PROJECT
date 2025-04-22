
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNoc, NocRequest } from '@/contexts/NocContext';
import { Download, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';

const DownloadNoc = () => {
  const { id } = useParams<{ id: string }>();
  const { nocRequests } = useNoc();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [nocRequest, setNocRequest] = useState<NocRequest | null>(null);
  
  useEffect(() => {
    if (id) {
      const request = nocRequests.find(req => req.id === id);
      if (request && request.status === 'Approved') {
        setNocRequest(request);
      } else {
        toast({
          title: 'Not Found',
          description: 'The requested NOC was not found or has not been approved.',
          variant: 'destructive',
        });
        navigate('/noc-requests');
      }
    }
  }, [id, nocRequests, toast, navigate]);

  const handleDownload = () => {
    // In a real application, this would generate and download a PDF
    toast({
      title: 'NOC Downloaded',
      description: 'Your NOC certificate has been downloaded successfully.',
    });
  };

  if (!nocRequest) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Card className="bg-white mb-6">
          <CardContent className="p-6">
            <div className="border-4 border-nocify-primary/20 p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-nocify-primary">NO OBJECTION CERTIFICATE</h1>
                <div className="h-1 w-32 bg-nocify-primary mx-auto mt-4"></div>
              </div>
              
              <div className="mb-8">
                <p className="text-right mb-2">Date: {formatDate(new Date().toISOString())}</p>
                <p className="text-right">Ref: NOC-{nocRequest.id.padStart(4, '0')}</p>
              </div>
              
              <div className="mb-8">
                <p className="mb-4">To Whomsoever It May Concern,</p>
                <p className="text-justify leading-relaxed">
                  This is to certify that <span className="font-semibold">{nocRequest.studentName}</span>, 
                  a student of our university, has been permitted to pursue an internship 
                  at <span className="font-semibold">{nocRequest.internshipDetails.companyName}</span> for 
                  the duration of <span className="font-semibold">{nocRequest.internshipDetails.duration}</span> from {' '}
                  <span className="font-semibold">{formatDate(nocRequest.internshipDetails.startDate)}</span> to {' '}
                  <span className="font-semibold">{formatDate(nocRequest.internshipDetails.endDate)}</span> as 
                  a <span className="font-semibold">{nocRequest.internshipDetails.role}</span>.
                </p>
                <p className="text-justify leading-relaxed mt-4">
                  The university has no objection to their participation in this internship program 
                  provided they maintain their academic responsibilities. This certificate is issued 
                  upon the student's request for the purpose of their internship application.
                </p>
              </div>
              
              <div className="mt-16">
                <div className="border-t border-gray-400 w-48"></div>
                <p className="mt-2 font-semibold">Faculty Signature</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center">
          <Button
            className="w-full max-w-xs"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download NOC
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default DownloadNoc;
