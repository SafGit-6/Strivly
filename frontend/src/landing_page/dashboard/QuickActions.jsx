// src/landing_page/dashboard/QuickActions.jsx
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

function QuickActions() {
    const navigate = useNavigate(); // 2. Initialize the hook

    // 3. Create handlers for each button
    const handleAddTask = () => {
        // Navigate to /tasks and pass 'openForm: true' in the state
        navigate('/tasks', { state: { openForm: true } });
    };

    const handleAddGoal = () => {
        // Navigate to /goals and pass 'openForm: true' in the state
        navigate('/goals', { state: { openForm: true } });
    };

    const handleFocusMode = () => {
        // Just navigate to /focusMode
        navigate('/focusMode');
    };

    return (
        <div className="container my-5 darkGreyCard" style={{width:"80%"}}>
            <div className="row m-2">
                <h4 className="pt-2" style={{color:"var(--textColor)",fontWeight:"bold"}}><i className="fa-solid fa-gear fa-xs" style={{ color: "var(--purple)" }}></i> Quick Actions</h4>

                <div className="d-grid gap-3 py-2 px-0">
                    {/* 4. Add onClick handlers */}
                    <button className="btn btn-primary purpleBtn" type="button" onClick={handleAddTask}>
                        <i className="fa-solid fa-plus"></i> &nbsp; Add Task
                    </button>
                    <button className="btn btn-primary greenBtn" type="button" onClick={handleAddGoal}>
                        <i className="fa-solid fa-plus"></i> &nbsp; Add Goal
                    </button>
                    <button className="btn btn-primary orangeBtn" type="button" onClick={handleFocusMode}>
                        <i className="fa-solid fa-arrows-to-eye"></i> &nbsp; Focus Mode
                    </button>
                </div>
            </div>
            
        </div>
     );
}

export default QuickActions;