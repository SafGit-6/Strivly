
import  { useState } from 'react';

function Notifications() {
    const [emailNotifications, setEmailNotifications] = useState(true);

    const toggleNotifications = () => {
        setEmailNotifications(!emailNotifications);
    };

    return (
        <div className="container my-5 darkGreyCard" style={{ width: "60%", maxWidth: "100%" }}>
            <div className="row m-3">
                <h4 className="p-0" style={{ color: "var(--textColor)", fontWeight: "bold" }}>
                    <i className="fa-regular fa-bell" style={{ color: "var(--purple)" }}></i> Notifications
                </h4>
            </div>

            <div className="row m-2 mb-4">
                <h6 style={{ color: "var(--textColor)" }}>Email Notifications</h6>
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <p style={{ color: "var(--grayText)", marginBottom: 0 }}>
                        Receive notifications about tasks and goals
                    </p>

                    <label className="custom-switch">
                        <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={toggleNotifications}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default Notifications;

