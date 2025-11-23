import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './TaskPage.css';
import Filter from './Filter';
import NewTaskForm from './NewTaskForm';
import ShowTasks from './ShowTasks';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_SERVER_API_URL;

function TaskPage() {
    const location = useLocation(); // 2. Initialize the hook
    // 3. Read the state from the location to set the *initial* value of showForm
    const [showForm, setShowForm] = useState(location.state?.openForm || false);
    const [statusFilter, setStatusFilter] = useState('all'); // 'daily', 'weekly', 'monthly', 'all'
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Master Data Lists ---
    const [allTasks, setAllTasks] = useState([]); // All task "rules"
    const [allInstances, setAllInstances] = useState([]); // The "logbook"
    
    const authenticatedFetch = useAuthenticatedFetch();

    // --- Data Fetching ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch both lists in parallel
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

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- The "Task Engine" (Your Logic) ---
    const { pendingTasks, completedTasks } = useMemo(() => {
        const pending = [];
        const completed = [];
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayDayOfWeek = today.getDay();
        const todayDate = today.getDate();

        // Apply filters and logic
        const filteredTasks = allTasks
            .filter(task => categoryFilter === 'all' || task.category === categoryFilter)
            .filter(task => {
                if (statusFilter === 'all') return true;
                if (!task.isRecurring) return statusFilter === 'one-time';
                if (statusFilter === 'daily') return task.recurringDetails.frequency === 'Daily';
                if (statusFilter === 'weekly') return task.recurringDetails.frequency === 'Weekly';
                if (statusFilter === 'monthly') return task.recurringDetails.frequency === 'Monthly';
                return false;
            });

        for (const task of filteredTasks) {
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
                    if (isCompleted) completed.push(task);
                    else pending.push(task);
                }
            } else {
                const expiresAt = new Date(task.expiresAt);
                if (expiresAt >= today) {
                    if (task.status === 'Completed') completed.push(task);
                    else pending.push(task);
                }
            }
        }

        return { pendingTasks: pending, completedTasks: completed };
    }, [allTasks, allInstances, statusFilter, categoryFilter]);


    return ( 
    <>
        <Filter
            setShowForm={setShowForm}
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            setStatusFilter={setStatusFilter}
            setCategoryFilter={setCategoryFilter}
        />

        {showForm && (
            <NewTaskForm
                setShowForm={setShowForm}
                refreshTasks={fetchData} // Pass the refresh function
            />
        )}

        <ShowTasks
            pendingTasks={pendingTasks}     // Pass calculated list
            completedTasks={completedTasks} // Pass calculated list
            loading={loading}
            error={error}
            refreshTasks={fetchData} // Pass refresh func down to cards
        /> 
    </>
     );
}

export default TaskPage;