
// Receive filter state and setters as props
function Filter({
    setShowForm,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter
}) {

    const categories = ['Personal', 'Work', 'Social', 'Household', 'Learning', 'Leisure'];

    return (
        <div className="container mb-5">
            <div className="d-flex justify-content-between align-items-center my-4">
                <div>
                    <h1 className="gradient-text">Tasks </h1>
                    <p style={{ color: "var(--grayText)" }}>Manage your daily activities</p>
                </div>
                <button
                    className="btn purpleBtn text-white"
                    onClick={() => setShowForm(prev => !prev)}
                >
                    <i className="fa-solid fa-plus"></i> &nbsp;
                    Add Task
                </button>
            </div>

            <div className="darkGreyCard p-4">
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <div className="d-flex align-items-center me-3">
                        <i className="fa fa-filter me-2" aria-hidden="true" style={{ color: "var(--purple)" }}></i>
                        <p className="mb-0" style={{ color: "var(--textColor)" }}>Filters :</p>
                    </div>

                    {/* Status buttons now use props */}
                    <div className="d-flex align-items-center gap-2 me-3">
                        {['all', 'daily', 'weekly', 'monthly', 'one-time'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={statusFilter === status ? "selectedBtn" : "unselectedBtn"}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Category buttons now use props */}
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        <button
                            onClick={() => setCategoryFilter('all')} // Use prop setter
                            className={categoryFilter === 'all' ? "selectedBtn" : "unselectedBtn"} // Use prop state
                        >
                            All Categories
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setCategoryFilter(category)} // Use prop setter
                                className={categoryFilter === category ? "selectedBtn" : "unselectedBtn"} // Use prop state
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Filter;