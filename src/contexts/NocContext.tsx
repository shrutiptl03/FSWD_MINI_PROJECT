
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Define types for our NOC context
export type InternshipDetails = {
  companyName: string;
  duration: string;
  role: string;
  startDate: string;
  endDate: string;
};

export type NocRequest = {
  id: string;
  studentId: string;
  studentName: string;
  facultyId?: string;
  internshipDetails: InternshipDetails;
  status: 'Pending' | 'Approved' | 'Rejected';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
};

type NocContextType = {
  nocRequests: NocRequest[];
  loading: boolean;
  createNocRequest: (request: Omit<NocRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNocStatus: (id: string, status: 'Approved' | 'Rejected', remarks?: string) => Promise<void>;
  getUserNocRequests: () => NocRequest[];
};

// Mock data
const INITIAL_NOC_REQUESTS: NocRequest[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'John Doe',
    facultyId: '2',
    internshipDetails: {
      companyName: 'Google',
      duration: '3 months',
      role: 'Software Engineer Intern',
      startDate: '2023-06-01',
      endDate: '2023-08-31',
    },
    status: 'Pending',
    createdAt: '2023-04-15T10:30:00Z',
    updatedAt: '2023-04-15T10:30:00Z',
  },
  {
    id: '2',
    studentId: '1',
    studentName: 'John Doe',
    facultyId: '2',
    internshipDetails: {
      companyName: 'Microsoft',
      duration: '2 months',
      role: 'Frontend Developer Intern',
      startDate: '2023-05-01',
      endDate: '2023-06-30',
    },
    status: 'Approved',
    createdAt: '2023-03-10T09:15:00Z',
    updatedAt: '2023-03-15T14:20:00Z',
  },
  {
    id: '3',
    studentId: '1',
    studentName: 'John Doe',
    facultyId: '2',
    internshipDetails: {
      companyName: 'Amazon',
      duration: '4 months',
      role: 'Data Science Intern',
      startDate: '2023-01-01',
      endDate: '2023-04-30',
    },
    status: 'Rejected',
    remarks: 'Duration exceeds the allowed internship period',
    createdAt: '2022-12-05T11:45:00Z',
    updatedAt: '2022-12-10T13:30:00Z',
  },
];

// Create the context
const NocContext = createContext<NocContextType | undefined>(undefined);

export const NocProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [nocRequests, setNocRequests] = useState<NocRequest[]>(INITIAL_NOC_REQUESTS);
  const [loading, setLoading] = useState(false);

  // Create a new NOC request
  const createNocRequest = async (request: Omit<NocRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const now = new Date().toISOString();
      const newRequest: NocRequest = {
        ...request,
        id: (nocRequests.length + 1).toString(),
        status: 'Pending',
        createdAt: now,
        updatedAt: now,
      };
      
      setNocRequests(prev => [...prev, newRequest]);
    } catch (error) {
      console.error('Error creating NOC request:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update NOC request status (approve/reject)
  const updateNocStatus = async (id: string, status: 'Approved' | 'Rejected', remarks?: string) => {
    setLoading(true);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNocRequests(prev => 
        prev.map(req => 
          req.id === id 
            ? { 
                ...req, 
                status, 
                remarks: status === 'Rejected' ? remarks : undefined,
                updatedAt: new Date().toISOString()
              } 
            : req
        )
      );
    } catch (error) {
      console.error('Error updating NOC status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get NOC requests for the current user
  const getUserNocRequests = (): NocRequest[] => {
    if (!user) return [];
    
    if (user.role === 'student') {
      return nocRequests.filter(req => req.studentId === user.id);
    } else if (user.role === 'faculty') {
      return nocRequests;
    }
    
    return [];
  };

  const value = {
    nocRequests,
    loading,
    createNocRequest,
    updateNocStatus,
    getUserNocRequests,
  };

  return <NocContext.Provider value={value}>{children}</NocContext.Provider>;
};

// Custom hook to use the NOC context
export const useNoc = () => {
  const context = useContext(NocContext);
  if (context === undefined) {
    throw new Error('useNoc must be used within a NocProvider');
  }
  return context;
};
