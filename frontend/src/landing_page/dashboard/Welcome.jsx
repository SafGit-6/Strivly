function Welcome() {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return ( 
        <div className="container">
            <center>
                <h1 className="gradient-text">Welcome back to Strivly</h1>
                <h6 style={{ color: "lightGray" }}>{formattedDate}</h6>
            </center>
        </div>
    );
}

export default Welcome;
