import {useState} from 'react';

function DailyReflection() {
    const [reflection, setReflection] = useState('');

       return (
        <div className="container my-5 darkGreyCard" style={{width:"80%"}}>
            <div className="row m-2">
                <h4 className="pt-2" style={{color:"var(--textColor)",fontWeight:"bold"}}><i className="fa-regular fa-comment fa-sm" style={{ color: "var(--purple)" }}></i> Daily Reflection</h4>

                <div className="d-grid gap-3 py-2 px-0">
                    <textarea className="lightGreyCard custom-textarea" 
                        placeholder="How was your day? What did you accomplish?"
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}>
                    </textarea>

                    <button className="btn btn-primary purpleBtn" type="button"
                        disabled={reflection.trim() === ''}
                        style={{
                            backgroundColor:reflection.trim() === ''? "var(--dullPurple)":'',
                            color:reflection.trim() === ''? "var(--grayText)":'',
                            cursor:reflection.trim() === ''? 'not-allowed':'pointer'
                        }}
                    >Submit Reflection</button>
                </div>
            </div>
            
        </div>
     );
}

export default DailyReflection;