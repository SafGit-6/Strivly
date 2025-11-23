function CTaskCard({ task }) {
    return ( 
        <div className="lightGreyCard p-3 completedTask">
            <div className="d-flex justify-content-between align-items-center">
                <h5 style={{color:'var(--grayText)'}}>{task.title}</h5>
                <i style={{ color: "var(--green)" }} className="fa fa-check" aria-hidden="true"></i>
            </div>
            {/* <p>{task.description}</p> */}
        </div> 
    );
}

export default CTaskCard;