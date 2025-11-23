import {useState} from 'react';

// Reusable component for task input fields within the goal form
function GoalTaskForm({ index, taskData, onChange, onRemove, isOnlyTask }) {

    // Helper function to update specific field in parent state
    const handleChange = (field, value) => {
        onChange(index, { ...taskData, [field]: value });
    };

    // Helper for nested recurringDetails
    const handleRecurringChange = (field, value) => {
        onChange(index, {
            ...taskData,
            recurringDetails: {
                ...taskData.recurringDetails,
                [field]: value
            }
        });
    };

    // Toggle day selection for weekly recurring tasks
    const toggleDayOfWeek = (dayIndex) => {
        const currentDays = taskData.recurringDetails.daysOfWeek || [];
        let newDays;
        if (currentDays.includes(dayIndex)) {
            newDays = currentDays.filter(day => day !== dayIndex);
        } else {
            newDays = [...currentDays, dayIndex].sort((a, b) => a - b); // Keep sorted
        }
         handleRecurringChange('daysOfWeek', newDays);
    };

    // Toggle date selection for monthly recurring tasks
     const toggleDayOfMonth = (dayNumber) => {
        const currentDays = taskData.recurringDetails.daysOfMonth || [];
        let newDays;
        if (currentDays.includes(dayNumber)) {
            newDays = currentDays.filter(day => day !== dayNumber);
        } else {
            newDays = [...currentDays, dayNumber].sort((a, b) => a - b); // Keep sorted
        }
         handleRecurringChange('daysOfMonth', newDays);
    };


    return (
    <div className="container lightGreyCard p-3 mt-3 text-start position-relative">
       {/* Remove Button - Only show if not the only task */}
       {!isOnlyTask && (
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2"
                style={{ lineHeight: '1', padding: '0.2rem 0.4rem' }}
                title="Remove this task"
            >
                &times; {/* Simple X icon */}
            </button>
       )}

      <h5 style={{ color: 'var(--textColor)' }}>Task #{index + 1}</h5>

      <div className="mt-3">
        {/* Row 1: Title + isRecurring */}
        <div className="row gx-3 mb-3">
          <div className="col-md-6">
            <label className='mb-1' style={{ color: "var(--grayText)" }}>Task Title*</label>
            <input
              className="w-100 simpleDarkGreyCard goal-input p-2"
              placeholder="e.g., Complete Chapter 1"
              value={taskData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
             <label className='mb-1' style={{ color: "var(--grayText)" }}>Type*</label>
             <select
                className="w-100 simpleDarkGreyCard goal-input p-2"
                value={taskData.isRecurring} // Control value from state
                onChange={(e) => handleChange('isRecurring', e.target.value === 'true')} // Convert back to boolean
                required
              >
              <option value={false}>One-time Task</option>
              <option value={true}>Recurring Task</option>
            </select>
          </div>
        </div>

        {/* Row 2: Description */}
        <div className="mb-3">
           <label className='mb-1' style={{ color: "var(--grayText)" }}>Description</label>
           <textarea
            className="w-100 simpleDarkGreyCard goal-input p-2"
            placeholder="Add details about the task (optional)"
            value={taskData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        {/* Row 3: Conditional Fields based on isRecurring */}

        {/* --- ONE-TIME TASK FIELDS --- */}
        { !taskData.isRecurring && (
          <div className="mb-3">
             <label className='mb-1' style={{ color: "var(--grayText)" }}>Due In*</label>
             <select
                className="w-100 simpleDarkGreyCard goal-input p-2"
                value={taskData.expiresIn}
                onChange={(e) => handleChange('expiresIn', e.target.value)}
                required={!taskData.isRecurring} // Required only if one-time
             >
                <option value="">Select duration...</option>
                <option value="1day">1 Day</option>
                <option value="1week">1 Week</option>
                <option value="1month">1 Month</option>
             </select>
          </div>
        )}

        {/* --- RECURRING TASK FIELDS --- */}
        { taskData.isRecurring && (
          <>
            {/* Frequency Selection */}
            <div className="mb-3">
               <label className='mb-1' style={{ color: "var(--grayText)" }}>Frequency*</label>
               <select
                 className="w-100 simpleDarkGreyCard goal-input p-2"
                 value={taskData.recurringDetails.frequency}
                 onChange={(e) => handleRecurringChange('frequency', e.target.value)}
                 required={taskData.isRecurring} // Required only if recurring
               >
                 <option value="Daily">Daily</option>
                 <option value="Weekly">Weekly</option>
                 <option value="Monthly">Monthly</option>
               </select>
            </div>

             {/* Daily Details (No extra input needed) */}
            { taskData.recurringDetails.frequency === 'Daily' && (
              <div className="mb-3">
                <p style={{ color: 'var(--grayText)' }}>This task will recur every day.</p>
              </div>
            )}

            {/* Weekly Details (Day Selection) */}
            { taskData.recurringDetails.frequency === 'Weekly' && (
              <div className="mb-3">
                <label className='mb-1' style={{ color: "var(--grayText)" }}>Repeat on Days*</label>
                <div className="d-flex flex-wrap gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIndex) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDayOfWeek(dayIndex)}
                      className={taskData.recurringDetails.daysOfWeek?.includes(dayIndex) ? "selectedBtn" : "unselectedBtn"}
                      style={{ minWidth: '45px' }} // Ensure buttons have some width
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Monthly Details (Date Selection) */}
            { taskData.recurringDetails.frequency === 'Monthly' && (
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
                           className={taskData.recurringDetails.daysOfMonth?.includes(dayNumber) ? "selectedBtn" : "unselectedBtn"}
                           style={{ minWidth: '40px', padding: '4px 8px' }} // Smaller buttons for dates
                         >
                          {dayNumber}
                        </button>
                    )
                   })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    );
}

export default GoalTaskForm;