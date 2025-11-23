
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
            <i style={{ color: "var(--purple)" }} className="fa-solid fa-bullseye fs-3"></i>

            <div className="d-flex justify-content-between align-items-center gap-4">
                <button className="rounded-pill statusBtn"><i style={{ color: "var(--purple)" }} class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
                <button className="rounded-pill statusBtn">{goal.status==='Pending'?'Active':goal.status}</button>
            </div>
        </div>
        

        {/* title */}
        <h4 style={{color:"var(--textColor)"}} className="mb-4">{goal.title}</h4>

        {/* description */}
        <p style={{color: "var(--grayText)"}} className="fs-5">{goal.description}</p>

        {/* remaining time */}
        <p style={{color: "var(--grayText)"}} className=""><i class="fa fa-clock-o fa-sm" aria-hidden="true"></i> {goal.remainingDays} days remaining</p>

        {/* date range */}
        <p style={{color: "var(--grayText)"}}><i className="fa-regular fa-calendar fa-sm"></i> {goal.dateRange}</p>

        {/* category */}
        <button className="rounded-pill categoryBtn mb-4">{goal.category}</button>
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