
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InternshipDetails, useNoc } from '@/contexts/NocContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';

// Mock list of faculty members
const FACULTY_MEMBERS = [
  { id: '2', name: 'Dr. Jane Smith', department: 'Computer Science' },
  { id: '3', name: 'Dr. Robert Johnson', department: 'Computer Science' },
  { id: '4', name: 'Dr. Emily Williams', department: 'Electrical Engineering' },
];

const NewNocRequest = () => {
  const { user } = useAuth();
  const { createNocRequest, loading } = useNoc();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [internshipDetails, setInternshipDetails] = useState<InternshipDetails>({
    companyName: '',
    duration: '',
    role: '',
    startDate: '',
    endDate: '',
  });
  const [facultyId, setFacultyId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInternshipDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      // Find the selected faculty to get the name
      const selectedFaculty = FACULTY_MEMBERS.find(f => f.id === facultyId);
      
      await createNocRequest({
        studentId: user.id,
        studentName: user.name,
        facultyId,
        internshipDetails,
      });
      
      toast({
        title: 'Request Submitted',
        description: `Your NOC request has been submitted to ${selectedFaculty?.name}.`,
      });
      
      navigate('/noc-requests');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: 'Submission Failed',
        description: 'An error occurred while submitting your request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Filter faculty members to show only those in the student's department
  const departmentFaculty = FACULTY_MEMBERS.filter(f => 
    f.department === user?.department
  );

  return (
    <AppLayout>
      <PageHeader 
        title="New NOC Request"
        description="Submit a request for a No Objection Certificate for your internship"
      />
      
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Internship Details</CardTitle>
            <CardDescription>
              Please provide details about your internship for the NOC request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="e.g., Google"
                value={internshipDetails.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Internship Role</Label>
              <Input
                id="role"
                name="role"
                placeholder="e.g., Software Engineer Intern"
                value={internshipDetails.role}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={internshipDetails.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={internshipDetails.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                placeholder="e.g., 3 months"
                value={internshipDetails.duration}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty Member</Label>
              <Select
                value={facultyId}
                onValueChange={setFacultyId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select faculty member" />
                </SelectTrigger>
                <SelectContent>
                  {departmentFaculty.map((faculty) => (
                    <SelectItem key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </AppLayout>
  );
};

export default NewNocRequest;
