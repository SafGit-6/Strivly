import PendingTasks from "./PendingTasks";
import CompletedTasks from "./CompletedTasks";

function ShowTasks({ pendingTasks, completedTasks, loading, error, refreshTasks }) {
    
    // Handle loading and error states first
    if (loading) {
        return (
            <div className="container text-center">
                <p style={{ color: "var(--textColor)" }}>Loading tasks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container text-center">
                <p style={{ color: "var(--orange)" }}>Error: {error}</p>
            </div>
        );
    }
    
    // Handle empty state
    if (pendingTasks.length === 0 && completedTasks.length === 0) {
        return (
            <div className="container text-center">
                <p style={{ color: "var(--grayText)" }}>No tasks found. Click "Add Task" to get started!</p>
            </div>
        );
    }
    
    return ( 
    <div className="container">
        <div className="row">
            <div className="col-md-6">
                <PendingTasks 
                    tasks={pendingTasks} 
                    refreshTasks={refreshTasks}
                />
            </div>
            <div className="col-md-6">
                <CompletedTasks 
                    tasks={completedTasks} 
                />
            </div>
        </div>
    </div>
    );
}

export default ShowTasks;