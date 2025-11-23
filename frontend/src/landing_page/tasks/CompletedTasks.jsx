import CTaskCard from "./CTaskCard";

function CompletedTasks({ tasks }) { // 1. Receive 'tasks' prop
    return ( 
        <div className="darkGreyCard p-4" style={{ minHeight: '300px' }}>
            <h3 className="mb-4" style={{color:'var(--textColor)'}}>
                <i style={{ color: "var(--green)" }} className="fa fa-check-square-o fa-sm" aria-hidden="true"></i> Completed Today
            </h3>
            {/* 2. Map over the 'tasks' prop */}
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <div key={task._id} className="mb-3"> {/* Use real _id for key */}
                        <CTaskCard task={task} />
                    </div>
                ))
            ) : (
                <p style={{ color: "var(--grayText)" }}>No tasks completed yet today.</p>
            )}
        </div>
    );
}

export default CompletedTasks;