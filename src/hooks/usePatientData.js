import { useState, useEffect, useCallback } from 'react';
import { getPatientDashboardData, getPatientProfileData, getPatientAppointments } from '../api';
import { toast } from 'sonner';

export const usePatientData = (patientId) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const [dashRes, profRes, apptRes] = await Promise.all([
        getPatientDashboardData(patientId),
        getPatientProfileData(patientId),
        getPatientAppointments(patientId)
      ]);
      setDashboardData(dashRes.data);
      setProfileData(profRes.data);
      setAppointments(apptRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError(err);
      toast.error('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  return { dashboardData, profileData, appointments, loading, error, refetch: fetchData };
};
