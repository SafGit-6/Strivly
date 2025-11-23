import PTaskCard from "./PTaskCard";    

function PendingTasks({ tasks, refreshTasks }) { // 1. Receive props
    return ( 
        <div className="darkGreyCard p-4" style={{ minHeight: '300px' }}>
            <h3 className="mb-4" style={{color:'var(--textColor)'}}>
                <i style={{ color: "var(--purple)" }} className="fa fa-clock-o fa-sm" aria-hidden="true"></i> Pending Tasks
            </h3>
            {/* 2. Map over the 'tasks' prop */}
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <div key={task._id} className="mb-3"> {/* Use real _id for key */}
                        <PTaskCard 
                            task={task} 
                            refreshTasks={refreshTasks} // 3. Pass props down
                        />
                    </div>
                ))
            ) : (
                <p style={{ color: "var(--grayText)" }}>No pending tasks for today.</p>
            )}
        </div>
    );
}

export default PendingTasks;