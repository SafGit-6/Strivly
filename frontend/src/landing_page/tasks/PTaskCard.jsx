import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch';
import { toast } from 'react-toastify';
import { useState } from 'react';

const API_URL = import.meta.env.VITE_SERVER_API_URL;

function PTaskCard({ task, refreshTasks }) {
    const [loading, setLoading] = useState(false);
    const authenticatedFetch = useAuthenticatedFetch();

    const handleComplete = async () => {
        setLoading(true);
        try {
            // Call the new "complete" endpoint
            await authenticatedFetch(`${API_URL}/api/task/${task._id}/complete`, {
                method: 'POST',
            });
            toast.success(`Task "${task.title}" completed!`);
            refreshTasks(); // Refresh the entire task list
        } catch (error) {
            console.error("Error completing task:", error);
            toast.error(error.message || "Failed to complete task.");
            setLoading(false);
        }
        // Don't setLoading(false) on success, as the component will unmount
    };

    return ( 
        <div className="lightGreyCard p-3 ">
            <div className="d-flex justify-content-between align-items-center">
                <h5 style={{color:'var(--textColor)'}}>{task.title}</h5> 
                <p style={{ color: "var(--purple)" }}>{task.category}</p>
            </div>
            <p style={{color:'var(--grayText)'}}>{task.description}</p>
            
            {/* Only show goal if it exists */}
            {task.forGoal && (
                <p className="p-2 forGoal rounded">Goal : {task.forGoal.title || task.forGoal}</p>

            )}
            
            {/* Only show deadline for one-time tasks */}
            {!task.isRecurring && (
                <p className="mt-2" style={{color: 'var(--darkOrange)'}}>
                    Deadline : {new Date(task.expiresAt).toLocaleDateString()}
                </p>
            )}

            <button 
                className="btn purpleBtn text-white fs-5 mt-2" 
                onClick={handleComplete}
                disabled={loading}
            >
                <i className="fa fa-check-circle-o" aria-hidden="true"></i> {loading ? "..." : "Complete"}
            </button>
        </div>
     );
}

export default PTaskCard;