
function GoalCard({goal}) {

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'linear-gradient(to right, #10B981, #34D399)'; // emerald
        if (progress >= 60) return 'linear-gradient(to right, #FFD700, #FFEA70)'; // gold
        if (progress >= 40) return 'linear-gradient(to right, #FB923C, #FDBA74)'; // orange
        return 'linear-gradient(to right, #A855F7, #C084FC)'; // purple
    };

    return ( 
    
    <div className="darkGreyCard p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
            {/* title */}
            <h4 style={{color:"var(--textColor)"}} className="mb-4">{goal.title}</h4>
            {/* category */}
            <button className="rounded-pill categoryBtn mb-4">{goal.category}</button>
        </div>
        
        {/* productivity score */}
        <div className="d-flex justify-content-between align-items-center ">
            <p style={{color: "var(--grayText)"}}>Productivity Score</p>
            <p style={{ color: "var(--textColor)" }}>{goal.productivityScore}%</p>
        </div>

        <div className="progress" style={{ height: "8px", backgroundColor: "#4B5563" }}>
            <div
                className="progress-bar"
                role="progressbar"
                style={{
                width: `${goal.productivityScore}%`,
                backgroundImage: getProgressColor(`${goal.productivityScore}`),
                transition: "width 1s ease-out"
                }}
                aria-valuenow={goal.productivityScore}
                aria-valuemin="0"
                aria-valuemax="100"
            ></div>
        </div>
        
    </div>
     );
}

export default GoalCard;