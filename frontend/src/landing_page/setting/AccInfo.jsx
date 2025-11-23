import { useAuth } from '../../context/AuthContext';

function AccInfo() {
    // Get the user object and logout function from the context
    const { user, logout } = useAuth();

    // Add a loading state to prevent errors if the user object isn't available yet
    if (!user) {
        return (
            <div className="text-center" style={{ color: "white" }}>
                <p>Loading user information...</p>
            </div>
        );
    }
     

    return ( 
        <>
            <center>
                <h1 className="gradient-text">Settings</h1>
                <h6 style={{ color: "lightGray" }}>Manage your account and preferences</h6>
            </center>
            
            <div className="container my-5 darkGreyCard" style={{width:"60%"}}>
                <div className="row m-2 ">
                        <h4 className="pt-2 mb-4" style={{color:"var(--textColor)",fontWeight:"bold"}}>
                            <i className="fa-regular fa-user" style={{ color: "var(--purple)" }}></i> Account Information
                        </h4>
                    
                    <div className="row">
                        <div className="col-6">
                            <p className="m-0 mb-2" style={{color:"var(--grayText)"}}>Username</p>
                            <div className="mb-1" style={{borderRadius: "8px",backgroundColor: "var(--lightCardBg)"}}>
                                {/* Use the user's displayName from the context */}
                                <p className="p-2 mx-2 ml-0" style={{color:"var(--textColor)"}}>{user.displayName}</p>
                            </div>
                        </div>
                        <div className="col-6">
                            <p className="m-0 mb-2" style={{color:"var(--grayText)"}}>Email Address</p>
                            <div className="mb-1" style={{borderRadius: "8px",backgroundColor: "var(--lightCardBg)"}}>
                                {/* Use the user's email from the context */}
                                <p className="p-2 mx-2 ml-0" style={{color:"var(--textColor)"}}>{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Connect the logout function from the context to the button's onClick handler */}
                <button type="button" className="btn btn-outline-danger m-4 mt-0" onClick={logout}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>Sign Out
                </button>
            </div>
        </>
     );
}

export default AccInfo;
