import { useNavigate } from "react-router-dom";

function ExitConfirm({showExitPrompt, setShowExitPrompt}) {

    const navigate = useNavigate();

    const confirmExit = () => {
        navigate("/focusMode");
    };

    const cancelExit = () => {
        setShowExitPrompt(false);
    };

    return ( 
        <div className="exit-modal">
          <div className="exit-modal-content">
            <h4>Exit Focus Mode?</h4>
            <p>You have an active focus session. Are you sure you want to exit?</p>
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button className="btn btn-danger" onClick={confirmExit}>
                Yes, Exit
              </button>
              <button className="btn btn-secondary" onClick={cancelExit}>
                Continue
              </button>
            </div>
          </div>
        </div>
     );
}

export default ExitConfirm;