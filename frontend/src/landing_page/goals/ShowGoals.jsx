import './GoalCard.jsx'; // Make sure path is correct
import GoalCard from './GoalCard.jsx'; // Make sure path is correct

// Receive goals, loading, and error as props
function ShowGoals({ goals, loading, error }) {

    // 1. Handle Loading State
    if (loading) {
        return (
            <div className="container text-center">
                <p style={{ color: "var(--textColor)" }}>Loading your goals...</p>
                {/* You could add a spinner here */}
            </div>
        );
    }

    // 2. Handle Error State
    if (error) {
        return (
            <div className="container text-center">
                <p style={{ color: "var(--orange)" }}>Error: {error}</p>
            </div>
        );
    }

    // 3. Handle No Goals Found
    if (goals.length === 0) {
        return (
            <div className="container text-center">
                <p style={{ color: "var(--grayText)" }}>No goals found. Click "Create Goal" to get started!</p>
            </div>
        );
    }

    // 4. Display Goals
    return (
        <div className='container'>
            <div className="goal-cards-container">
                {goals.map((goal) => (
                    <div className="goal-card-wrapper" key={goal._id}> {/* Use the database _id as the key */}
                        <GoalCard goal={goal} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ShowGoals;