import { useState, useEffect } from 'react';
import { getClinicianSchedule, getClinicianPatients, getAllUsers, getSystemSettings } from '@/api';

export const useClinicianData = (clinicianId) => {
    const [schedule, setSchedule] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!clinicianId) return;
        setLoading(true);
        try {
            const [scheduleRes, patientsRes] = await Promise.all([
                getClinicianSchedule(clinicianId),
                getClinicianPatients(clinicianId)
            ]);
            setSchedule(scheduleRes.data || []);
            setPatients(patientsRes.data || []);
        } catch (err) {
            console.error("Failed to load clinician data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [clinicianId]);

    return { schedule, patients, loading, refresh: fetchData };
};

export const useAdminData = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getAllUsers();
            // Backend returns { patients: [], clinicians: [], admins: [] }
            const data = res.data;
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                const combined = [
                    ...(data.patients || []),
                    ...(data.clinicians || []),
                    ...(data.admins || [])
                ];
                setUsers(combined);
            } else {
                setUsers(Array.isArray(res.data) ? res.data : []);
            }
        } catch (err) {
            console.error("Failed to load admin data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, loading, refresh: fetchUsers };
};

export const useAdminSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await getSystemSettings();
            setSettings(res.data);
        } catch (err) {
            console.error("Failed to load system settings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return { settings, loading, fetchSettings };
};
