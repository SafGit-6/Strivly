import './Navbar.css';
import { useNavigate, useLocation } from 'react-router-dom';


function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return ( 
        <>
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "var(--background)" }}>
            <div className="container-fluid" style={{width:"80%"}}>
                
                {/* Brand on the left */}
                <div className="navbar-brand d-flex align-items-center" style={{color:"var(--textColor)"}}>
                    <img src="/media/images/StrivlyIconv3.png" style={{ height: "2rem", marginRight: "0.5rem" }} alt="Strivly logo" />
                    <span><h3><b>Strivly</b></h3></span>
                </div>
                
                {/* Toggler for mobile */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Nav links as buttons */}
                <div className="collapse navbar-collapse justify-content-center" id="navbarNavAltMarkup">
                    <div className="navbar-nav d-flex text-center" style={{ columnGap: "0.5rem" }}>
                        <button className={`nav-button ${isActive('/dashboard') ? 'nav-button-active' : ''}`} onClick={() => navigate('/dashboard')}>
                            <i className="fa-regular fa-calendar fa-sm"></i> Dashboard
                        </button>
                        <button className={`nav-button ${isActive('/goals') ? 'nav-button-active' : ''}`} onClick={() => navigate('/goals')}>
                            <i className="fa-solid fa-bullseye fa-sm"></i> Goals
                        </button>
                        <button className={`nav-button ${isActive('/tasks') ? 'nav-button-active' : ''}`} onClick={() => navigate('/tasks')}>
                            <i className="fa-regular fa-calendar fa-sm"></i> Tasks
                        </button>
                        <button className={`nav-button ${isActive('/focusMode') ? 'nav-button-active' : ''}`} onClick={() => navigate('/focusMode')}>
                            <i className="fa-solid fa-arrows-to-eye fs-sm"></i> Focus
                        </button>
                        <button className={`nav-button ${isActive('/analytics') ? 'nav-button-active' : ''}`} onClick={() => navigate('/analytics')}>
                            <i className="fa-solid fa-chart-column fa-sm"></i> Analytics
                        </button>
                        <button className={`nav-button ${isActive('/safeYt') ? 'nav-button-active' : ''}`} onClick={() => navigate('/safeYt')}>
                            <i className="fa-brands fa-youtube"></i> Youtube
                        </button>
                        <button className={`nav-button ${isActive('/settings') ? 'nav-button-active' : ''}`} onClick={() => navigate('/settings')}>
                            <i className="fa-solid fa-gear fa-sm"></i> Settings
                        </button>     
                    </div>
                </div>
            </div>
        </nav>
        <hr style={{opacity:"0.5",marginBottom:"4rem",marginTop:"0",color:"var(--darkCardBorder)"}}/>
        </>
        
    );
}

export default Navbar;
