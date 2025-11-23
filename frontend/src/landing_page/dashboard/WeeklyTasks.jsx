// src/landing_page/dashboard/WeeklyTasks.jsx

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'; // Adjust path
import { toast } from 'react-toastify';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = import.meta.env.VITE_SERVER_API_URL;

// --- Helper function for the "Task Engine" ---
function isTaskActiveOnDay(task, day) {
    const freq = task.recurringDetails.frequency;
    if (freq === 'Daily') return true;
    if (freq === 'Weekly') return task.recurringDetails.daysOfWeek.includes(day.getDay());
    if (freq === 'Monthly') return task.recurringDetails.daysOfMonth.includes(day.getDate());
    return false;
}

// --- Chart.js Options (Reverted to your original) ---
const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100, 
    },
  },
};


function WeeklyTasks({ refreshSignal }) {
    // --- State for data ---
    const [allTasks, setAllTasks] = useState([]);
    const [allInstances, setAllInstances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const authenticatedFetch = useAuthenticatedFetch();

    // --- Data Fetching ---
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
    }, [authenticatedFetch]);

    useEffect(() => {
        fetchData();
    }, [fetchData,refreshSignal]);

    // --- The "Weekly Task Engine" ---
    const chartData = useMemo(() => {
        if (loading || error) return null;

        const chartLabels = [];
        const chartDataPoints = [];

        // 1. Generate the last 7 days (including today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const day = new Date(today);
            day.setDate(today.getDate() - i);
            last7Days.push(day);
            chartLabels.push(day.toLocaleString('en-US', { weekday: 'short' }));
        }

        // 2. Run your calculation logic for *each* of the 7 days
        for (const day of last7Days) {
            let totalTasksExpected = 0;
            let totalTasksCompleted = 0;
            const dayTime = day.getTime();

            for (const task of allTasks) {
                const taskCreatedAt = new Date(task.createdAt);
                taskCreatedAt.setHours(0, 0, 0, 0);

                if (taskCreatedAt > day) continue;

                let isExpectedToday = false;
                
                if (task.isRecurring) {
                    // Recurring: Expected if active on this day
                    isExpectedToday = isTaskActiveOnDay(task, day);
                } else {
                    // One-time: Expected only if PENDING and not expired, OR if completed *on* this day
                    const expiresAt = new Date(task.expiresAt);
                    expiresAt.setHours(0, 0, 0, 0);

                    const completedDate = new Date(task.updatedAt);
                    completedDate.setHours(0, 0, 0, 0);
                    
                    // A task completed on a previous day should not be counted as expected today
                    const wasCompletedOnThisDay = (
                        task.status === 'Completed' &&
                        completedDate.getTime() === dayTime
                    );

                    isExpectedToday = (
                        (task.status === 'Pending' && expiresAt >= day) || 
                        wasCompletedOnThisDay // The crucial addition
                    );
                }

                if (isExpectedToday) {
                    totalTasksExpected++;

                    let isCompletedToday = false;
                    if (task.isRecurring) {
                        isCompletedToday = allInstances.some(inst => 
                            inst.task === task._id &&
                            new Date(inst.dateCompleted).getTime() === dayTime
                        );
                    } else {
                        const completedDate = new Date(task.updatedAt);
                        completedDate.setHours(0, 0, 0, 0);
                        
                        isCompletedToday = (
                            task.status === 'Completed' &&
                            completedDate.getTime() === dayTime
                        );
                    }

                    if (isCompletedToday) {
                        totalTasksCompleted++;
                    }
                }
            }
            
            // 3. Calculate final percentage for the day
            const percentage = (totalTasksExpected === 0) 
                ? 0 
                : (totalTasksCompleted / totalTasksExpected) * 100;
                
            chartDataPoints.push(percentage);
        }

        // 4. Return the final Chart.js data object
        return {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Tasks Completed (%)', 
                    data: chartDataPoints,
                    backgroundColor: 'rgb(162, 74, 245)',
                    borderRadius: 10,
                    barPercentage: 0.4,
                },
            ],
        };

    }, [allTasks, allInstances, loading, error]);


    // --- Render Logic ---
    const renderContent = () => {
        if (loading) {
            return <p style={{ color: "var(--grayText)" }}>Calculating weekly stats...</p>;
        }

        if (error) {
            return <p style={{ color: "var(--orange)" }}>Error: {error}</p>;
        }

        if (!chartData) {
            return <p style={{ color: "var(--grayText)" }}>No task data found to build chart.</p>;
        }

        return (
            <center>
                <Bar style={{width:"85%"}} data={chartData} options={options} />
            </center>
        );
    };
  
    return (
        <div className="container my-5 darkGreyCard" style={{ width: '80%' }}>
            <div className="row m-2">
                <h4 className="pt-2" style={{ color: 'var(--textColor)', fontWeight: 'bold' }}>
                    <i className="fa-solid fa-chart-column fa-sm" style={{ color: 'var(--purple)' }}></i>{' '}
                    Weekly Task Completion (%)
                </h4>

                <div>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default WeeklyTasks;