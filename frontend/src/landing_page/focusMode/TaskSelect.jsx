import { useNavigate } from "react-router-dom";

function TaskSelect() {
    const navigate = useNavigate();
    const tasks = [
        { id: 1, name: "something", goal: "Health" },
        { id: 2, name: "push up", goal: "Health" },
        { id: 3, name: "edit project", goal: "Development" },
    ];

    const handleTaskClick = (task) => {
        // Pass only the selected task in the state
        navigate("/focusHero", { state: { task } });
    };
    
    return ( 

        <div style={{   
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh', // less than 100vh to account for navbar
            marginTop: '-40px' // move up, adjust value as needed
        }}>

            <p className="text-center" style={{color:"lightGray"}}>Eliminate distractions and maximize productivity</p>
            <div className="container my-4 simpleDarkGreyCard" style={{width:"60%"}}>
                <div className="row m-2">
                    <h4 className="pt-2 text-center m-3" style={{color:"var(--textColor)",fontWeight:"bold"}}><i className="fa-regular fa-calendar fa-sm" style={{ color: "var(--orange)" }}></i> Select a task to focus on</h4>

                    <div className="d-grid gap-2 py-2 px-0">
                        {tasks.map((task) => (
                            <div key = {task.id} onClick={() => handleTaskClick(task)} className="simpleLightGreyCard p-3 taskBtn my-1" style={{color:"white"}}>
                                    {task.name}
                                    <span className="taskBtnGoal py-1 px-2">
                                        {task.goal}
                                    </span>
                            </div>
                        ))}
                    </div>
                </div>
                
            </div>
        </div>
        
     );
}

export default TaskSelect;