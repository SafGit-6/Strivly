import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'; // Adjust path as needed

const API_URL = import.meta.env.VITE_SERVER_API_URL;

function NewTaskForm({ setShowForm, refreshTasks }) { // Added refreshTasks for later
  const categories = ['Personal', 'Work', 'Social', 'Household', 'Learning', 'Leisure'];
  const authenticatedFetch = useAuthenticatedFetch();
  
  // === STATE MANAGEMENT ===
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [expiresIn, setExpiresIn] = useState(''); // For one-time tasks
  const [forGoal, setForGoal] = useState(''); // The ID of the linked goal
  const [recurringDetails, setRecurringDetails] = useState({
    frequency: 'Daily',
    daysOfWeek: [],
    daysOfMonth: [],
  });
  
  const [userGoals, setUserGoals] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [loading, setLoading] = useState(false); // Form submission loading

  // --- Fetch User's Goals (for the dropdown) ---
  useEffect(() => {
    const fetchUserGoals = async () => {
      setLoadingGoals(true);
      try {
        const goals = await authenticatedFetch(`${API_URL}/api/goal`);
        setUserGoals(goals || []);
      } catch (error) {
        console.error("Failed to fetch goals:", error);
        toast.error("Could not load your goals for linking.");
      } finally {
        setLoadingGoals(false);
      }
    };
    fetchUserGoals();
  }, [authenticatedFetch]); // This effect runs once to fetch goals

  // --- EVENT HANDLERS ---

  // Handler for nested recurringDetails state
  const handleRecurringChange = (field, value) => {
    setRecurringDetails(prev => ({ ...prev, [field]: value }));
  };

  // Toggle day selection for weekly recurring tasks
  const toggleDayOfWeek = (dayIndex) => {
    const currentDays = recurringDetails.daysOfWeek;
    const newDays = currentDays.includes(dayIndex)
      ? currentDays.filter(day => day !== dayIndex)
      : [...currentDays, dayIndex].sort((a, b) => a - b);
    handleRecurringChange('daysOfWeek', newDays);
  };

  // Toggle date selection for monthly recurring tasks
  const toggleDayOfMonth = (dayNumber) => {
    const currentDays = recurringDetails.daysOfMonth;
    const newDays = currentDays.includes(dayNumber)
      ? currentDays.filter(day => day !== dayNumber)
      : [...currentDays, dayNumber].sort((a, b) => a - b);
    handleRecurringChange('daysOfMonth', newDays);
  };

  // --- FORM SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // --- Validation (as per your rules) ---
    if (!title || !category) {
        toast.error("Title and Category are required.");
        setLoading(false);
        return;
    }

    const taskPayload = {
        title,
        category,
        description,
        isRecurring,
        forGoal: forGoal || null,
    };

    if (isRecurring) {
        // --- Recurring Task Validation ---
        if (!forGoal) {
            toast.error("Recurring tasks must be associated with a goal.");
            setLoading(false);
            return;
        }
        if (recurringDetails.frequency === 'Weekly' && recurringDetails.daysOfWeek.length === 0) {
            toast.error("Please select at least one day for weekly recurrence.");
            setLoading(false);
            return;
        }
        if (recurringDetails.frequency === 'Monthly' && recurringDetails.daysOfMonth.length === 0) {
            toast.error("Please select at least one date for monthly recurrence.");
            setLoading(false);
            return;
        }
        taskPayload.recurringDetails = recurringDetails;

    } else {
        // --- One-Time Task Validation ---
        if (!expiresIn) {
            toast.error("One-time tasks require a 'Due In' duration.");
            setLoading(false);
            return;
        }
        taskPayload.expiresIn = expiresIn;
    }
    
    // --- API Call ---
    try {
        await authenticatedFetch(`${API_URL}/api/task`, {
            method: 'POST',
            body: JSON.stringify(taskPayload),
        });
        toast.success('New task created successfully!');
        setShowForm(false); // Close the form
        if (refreshTasks) refreshTasks(); 
    } catch (error) {
        console.error("Error creating task:", error);
        toast.error(error.message || "Failed to create task.");
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="container darkGreyCard p-4 mb-5 text-start">
      <h3 style={{ color: 'var(--textColor)' }}>Create New Task</h3>

      <form onSubmit={handleSubmit}>
        <div className="mt-3">
          {/* Row 1: Title + Category */}
          <div className="row gx-3 mb-3">
            <div className="col-md-6">
              <label className='mb-1' style={{ color: "var(--grayText)" }}>Task Title*</label>
              <input
                className="w-100 lightGreyCard goal-input p-2"
                placeholder="e.g., Water the plants"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className='mb-1' style={{ color: "var(--grayText)" }}>Category*</label>
              <select
                className="w-100 lightGreyCard goal-input p-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Description */}
          <div className="mb-3">
            <label className='mb-1' style={{ color: "var(--grayText)" }}>Description</label>
            <textarea
              className="w-100 lightGreyCard goal-input p-2"
              placeholder="Add more details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Row 3: Task Type */}
          <div className="row gx-3 mb-3">
            <div className="col-md-6">
                <label className='mb-1' style={{ color: "var(--grayText)" }}>Task Type*</label>
                <select
                    className="w-100 lightGreyCard goal-input p-2"
                    value={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.value === 'true')}
                >
                    <option value={false}>One-time Task</option>
                    <option value={true}>Recurring Task</option>
                </select>
            </div>

            {/* Row 4 (Conditional): 'forGoal' Dropdown */}
            <div className="col-md-6">
              <label className='mb-1' style={{ color: "var(--grayText)" }}>
                Associate with Goal {isRecurring ? "*" : "(Optional)"}
              </label>
              <select
                className="w-100 lightGreyCard goal-input p-2"
                value={forGoal}
                onChange={(e) => setForGoal(e.target.value)}
                required={isRecurring} // Your special rule
                disabled={loadingGoals}
              >
                <option value="">{loadingGoals ? "Loading goals..." : (isRecurring ? "Select a goal*" : "None")}</option>
                {!isRecurring && <option value="">None</option>}
                {userGoals.map((goal) => (
                  <option key={goal._id} value={goal._id}>{goal.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* --- CONDITIONAL FIELDS --- */}
          
          {/* --- ONE-TIME TASK FIELDS --- */}
          {!isRecurring && (
            <div className="mb-3">
              <label className='mb-1' style={{ color: "var(--grayText)" }}>Due In*</label>
              <select
                className="w-100 lightGreyCard goal-input p-2"
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                required={!isRecurring}
              >
                <option value="">Select duration...</option>
                <option value="1day">1 Day</option>
                <option value="1week">1 Week</option>
                <option value="1month">1 Month</option>
              </select>
            </div>
          )}

          {/* --- RECURRING TASK FIELDS --- */}
          {isRecurring && (
            <div className="lightGreyCard p-3 rounded">
              <h5 style={{ color: "var(--textColor)" }}>Recurring Details</h5>
              {/* Frequency Selection */}
              <div className="mb-3">
                <label className='mb-1' style={{ color: "var(--grayText)" }}>Frequency*</label>
                <select
                  className="w-100 simpleDarkGreyCard goal-input p-2"
                  value={recurringDetails.frequency}
                  // ✅ THIS IS THE FIX: Changed 'e.g.target.value' to 'e.target.value'
                  onChange={(e) => handleRecurringChange('frequency', e.target.value)}
                  required={isRecurring}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              {/* Weekly Details */}
              {recurringDetails.frequency === 'Weekly' && (
                <div className="mb-3">
                  <label className='mb-1' style={{ color: "var(--grayText)" }}>Repeat on Days*</label>
                  <div className="d-flex flex-wrap gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIndex) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDayOfWeek(dayIndex)}
                        className={recurringDetails.daysOfWeek.includes(dayIndex) ? "selectedBtn" : "unselectedBtn"}
                        style={{ minWidth: '45px' }}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly Details */}
              {recurringDetails.frequency === 'Monthly' && (
                <div className="mb-3">
                  <label className='mb-1' style={{ color: "var(--grayText)" }}>Repeat on Dates*</label>
                  <div className="d-flex flex-wrap gap-2">
                    {[...Array(31)].map((_, index) => {
                      const dayNumber = index + 1;
                      return (
                        <button
                          key={dayNumber}
                          type="button"
                          onClick={() => toggleDayOfMonth(dayNumber)}
                          className={recurringDetails.daysOfMonth.includes(dayNumber) ? "selectedBtn" : "unselectedBtn"}
                          style={{ minWidth: '40px', padding: '4px 8px' }}
                        >
                          {dayNumber}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- Submit/Cancel Buttons --- */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn purpleBtn text-white"
            disabled={loading || loadingGoals}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewTaskForm;