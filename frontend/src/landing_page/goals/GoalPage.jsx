import './GoalPage.css';
import Filter from './Filter';
import ShowGoals from './ShowGoals';
import Form from './Form';
import { useLocation } from 'react-router-dom';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'; // Adjust path as needed
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_SERVER_API_URL;

function GoalPage() {
    const location = useLocation(); // 2. Initialize the hook

    const [showForm, setShowForm] = useState(location.state?.openForm || false);
    const [allGoals, setAllGoals] = useState([]); // Master list of goals from API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Filter State (Lifted from Filter.jsx) ---
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'completed'
    const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'Personal', 'Work', etc.

    const authenticatedFetch = useAuthenticatedFetch();

    // --- Data Fetching ---
    // We wrap fetchGoals in useCallback so it's a stable function
    const fetchGoals = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await authenticatedFetch(`${API_URL}/api/goal`);
            setAllGoals(data || []); // Ensure data is an array
        } catch (err) {
            console.error("Error fetching goals:", err);
            setError(err.message || "Failed to fetch goals.");
            toast.error(err.message || "Failed to fetch goals.");
        } finally {
            setLoading(false);
        }
    }, [authenticatedFetch]); // Dependency: the fetch function itself

    // Fetch goals on initial component mount
    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]); // Run once when fetchGoals is created

    // --- Filtering Logic ---
    // useMemo recalculates the filtered list *only* when the dependencies change
    const filteredGoals = useMemo(() => {
        return allGoals
            .filter(goal => {
                // Status Filter Logic
                if (statusFilter === 'all') return true;
                // Note: Your backend model uses 'Pending' and 'Completed'
                const goalStatus = goal.status === 'Pending' ? 'active' : 'completed';
                return goalStatus === statusFilter;
            })
            .filter(goal => {
                // Category Filter Logic
                if (categoryFilter === 'all') return true;
                return goal.category === categoryFilter;
            });
    }, [allGoals, statusFilter, categoryFilter]); // Dependencies

    return (
        <>
            <Filter
                setShowForm={setShowForm}
                // Pass filter state down
                statusFilter={statusFilter}
                categoryFilter={categoryFilter}
                // Pass filter setters down
                setStatusFilter={setStatusFilter}
                setCategoryFilter={setCategoryFilter}
            />
            {showForm && (
                <Form
                    setShowForm={setShowForm}
                    // Pass the fetchGoals function so the form can trigger a refresh
                    refreshGoals={fetchGoals}
                />
            )}
            <ShowGoals
                // Pass the *filtered* list of goals down
                goals={filteredGoals}
                loading={loading}
                error={error}
            />
        </>
    );
}

export default GoalPage;