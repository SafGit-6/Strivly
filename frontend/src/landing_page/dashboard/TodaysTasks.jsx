// src/landing_page/dashboard/TodaysTasks.jsx

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'; // Adjust path
import PTaskCard from '../tasks/PTaskCard'; // Adjust path to your PTaskCard
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_SERVER_API_URL;

function TodaysTasks({ triggerDashboardRefresh }) { // <-- Accepts the prop
    // --- State for data ---
    const [allTasks, setAllTasks] = useState([]);
    const [allInstances, setAllInstances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const authenticatedFetch = useAuthenticatedFetch();

    // 1. fetchData: ONLY updates the state of THIS component (No infinite loop)
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [tasksData, instancesData] = await Promise.all([
                authenticatedFetch(`${API_URL}/api/task`),
                authenticatedFetch(`${API_URL}/api/task-instances`)
            ]);
            setAllTasks(tasksData || []);
            setAllInstances(instancesData || []);
        } catch (err) {
            console.error("Error fetching task data:", err);
            setError(err.message || "Failed to fetch data.");
            toast.error(err.message || "Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    }, [authenticatedFetch]); // Dependency: the fetch function itself

    // 2. NEW FUNCTION: Bundles the local update and the global sync
    const handleTaskCompletionAndRefresh = useCallback(() => {
        fetchData(); // First, refresh the task list for *this* component
        if (triggerDashboardRefresh) {
            triggerDashboardRefresh(); // Second, force siblings to re-mount/re-fetch
        }
    }, [fetchData, triggerDashboardRefresh]); // Must include prop in dependencies

    // Fetch data on component mount (Only calls fetchData, NOT the trigger)
    useEffect(() => {
        fetchData();
    }, [fetchData]); 

    // --- Task Engine (Remains the same) ---
    const pendingTasks = useMemo(() => {
        const pending = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayDayOfWeek = today.getDay();
        const todayDate = today.getDate();

        for (const task of allTasks) {
            if (task.isRecurring) {
                let isActiveToday = false;
                const freq = task.recurringDetails.frequency;
                if (freq === 'Daily') isActiveToday = true;
                else if (freq === 'Weekly') isActiveToday = task.recurringDetails.daysOfWeek.includes(todayDayOfWeek);
                else if (freq === 'Monthly') isActiveToday = task.recurringDetails.daysOfMonth.includes(todayDate);

                if (isActiveToday) {
                    const isCompleted = allInstances.some(
                        instance => instance.task === task._id && new Date(instance.dateCompleted).getTime() === today.getTime()
                    );
                    if (!isCompleted) pending.push(task);
                }
            } else {
                const expiresAt = new Date(task.expiresAt);
                if (expiresAt >= today && task.status === 'Pending') {
                    pending.push(task);
                }
            }
        }
        return pending;
    }, [allTasks, allInstances]); 

    // --- Render Logic (Remains the same, but uses the new function) ---
    const renderContent = () => {
        // ... (loading, error, empty state checks) ...
        if (loading || error || pendingTasks.length === 0) {
            // ... (return appropriate messages) ...
            return (loading ? <p style={{ color: "var(--grayText)" }}>Loading today's tasks...</p> : 
                    error ? <p style={{ color: "var(--orange)" }}>Error: {error}</p> : 
                    <p style={{ color: "var(--grayText)" }}>You have no pending tasks for today. Great job!</p>);
        }

        return (
            <div className="row g-3">
                {pendingTasks.map((task) => (
                    <div key={task._id} className="col-lg-4 col-md-6 col-12">
                        <PTaskCard 
                            task={task} 
                            refreshTasks={handleTaskCompletionAndRefresh} // <-- FIX: Pass the new sync function
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container my-5 darkGreyCard" style={{width:"80%"}}>
            <div className="row m-2">
                <h4 className="pt-2" style={{color:"var(--textColor)",fontWeight:"bold"}}>
                    <i className="fa-regular fa-calendar fa-sm" style={{ color: "var(--purple)" }}></i> Today's Tasks
                </h4>

                <div className="d-grid gap-3 py-2 px-0">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default TodaysTasks;