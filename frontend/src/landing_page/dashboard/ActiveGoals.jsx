// src/landing_page/dashboard/ActiveGoals.jsx

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'; // Adjust path
import GoalCard from './GoalCard'; // We can use the GoalCard from the same folder
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_SERVER_API_URL;

function ActiveGoals({ refreshSignal }) {
    // --- State ---
    const [allGoals, setAllGoals] = useState([]); // Master list of goals from API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const authenticatedFetch = useAuthenticatedFetch();

    // --- Data Fetching (same as GoalPage) ---
    const fetchGoals = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // This endpoint now returns the calculated productivityScore
            const data = await authenticatedFetch(`${API_URL}/api/goal`);
            setAllGoals(data || []);
        } catch (err) {
            console.error("Error fetching goals:", err);
            setError(err.message || "Failed to fetch goals.");
            toast.error(err.message || "Failed to fetch goals.");
        } finally {
            setLoading(false);
        }
    }, [authenticatedFetch]);

    // Fetch goals on initial component mount
    useEffect(() => {
        fetchGoals();
    }, [fetchGoals, refreshSignal ]);

    // --- Filtering Logic ---
    // useMemo recalculates the list *only* when the master list changes
    const activeGoals = useMemo(() => {
        // "Active" goals are those with a status of "Pending"
        return allGoals.filter(goal => goal.status === 'Pending');
    }, [allGoals]); // Dependency

    // --- Render Logic ---
    const renderContent = () => {
        if (loading) {
            return <p style={{ color: "var(--grayText)" }}>Loading active goals...</p>;
        }

        if (error) {
            return <p style={{ color: "var(--orange)" }}>Error: {error}</p>;
        }

        if (activeGoals.length === 0) {
            return <p style={{ color: "var(--grayText)" }}>You have no active goals. Click "Add Goal" to get started!</p>;
        }

        // Map over the *filtered* list and render a card for each
        return (
            <div className="d-grid gap-3 py-2 px-0"> {/* gap-3 adds spacing */}
                {activeGoals.map((goal) => (
                    // This div wrapper ensures each card is on its own "row"
                    <div key={goal._id}> 
                        <GoalCard goal={goal} />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container my-5 darkGreyCard" style={{width:"80%"}}>
            <div className="row m-2">
                <h4 className="pt-2" style={{color:"var(--textColor)",fontWeight:"bold"}}>
                    <i className="fa-solid fa-bullseye fa-xs" style={{ color: "var(--purple)" }}></i> Active Goals
                </h4>
                
                {/* Render the loading/error/content states here */}
                {renderContent()}

            </div>
        </div>
    );
}

export default ActiveGoals;