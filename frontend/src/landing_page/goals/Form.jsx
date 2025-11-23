import { useState } from 'react';
import GoalTaskForm from "./GoalTaskForm";
import { toast } from 'react-toastify';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'; // Assuming path

const API_URL = import.meta.env.VITE_SERVER_API_URL;

function Form({setShowForm, refreshGoals}) {
  const categories = ['Personal', 'Work', 'Social', 'Household', 'Learning', 'Leisure'];
  const authenticatedFetch = useAuthenticatedFetch();

  // --- State for Goal ---
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  // --- State for Tasks ---
  // Initialize with one empty task object. Each task needs a unique temporary ID for mapping.
  const [tasks, setTasks] = useState([{
    id: Date.now(), // Temporary unique ID for React key prop
    title: '',
    description: '',
    isRecurring: false, // Default to one-time
    expiresIn: '', // For one-time tasks ('1day', '1week', '1month')
    recurringDetails: {
      frequency: 'Daily', // Default frequency
      daysOfWeek: [],
      daysOfMonth: [],
    }
  }]);

  // --- Functions to Handle State Changes ---

  const handleAddTask = () => {
    setTasks(prevTasks => [
      ...prevTasks,
      { // Add a new empty task structure
        id: Date.now(),
        title: '',
        description: '',
        isRecurring: false,
        expiresIn: '',
        recurringDetails: {
          frequency: 'Daily',
          daysOfWeek: [],
          daysOfMonth: [],
        }
      }
    ]);
  };

  // Function passed down to GoalTaskForm to update a specific task's state
  const handleTaskChange = (index, updatedTaskData) => {
    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      newTasks[index] = { ...newTasks[index], ...updatedTaskData };
      return newTasks;
    });
  };

  // Function to remove a task (useful when adding multiple)
  const handleRemoveTask = (index) => {
    if (tasks.length <= 1) {
        toast.info("At least one task is required initially.");
        return; // Don't remove the last task
    }
    setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
  };


  // --- Handle Form Submission ---
  const handleGoalSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      // --- Basic Goal Validation ---
      if (!goalTitle || !goalCategory || !goalDeadline) {
          toast.error("Goal Title, Category, and Deadline are required.");
          setLoading(false);
          return;
      }

      // --- Task Validation ---
      for (const task of tasks) {
          if (!task.title) {
              toast.error("All associated tasks must have a title.");
              setLoading(false);
              return;
          }
          if (!task.isRecurring && !task.expiresIn) {
              toast.error(`Task "${task.title}" is missing an expiration period (expiresIn).`);
              setLoading(false);
              return;
          }
          if (task.isRecurring) {
              if (!task.recurringDetails || !task.recurringDetails.frequency) {
                  toast.error(`Recurring task "${task.title}" is missing frequency details.`);
                  setLoading(false);
                  return;
              }
              if (task.recurringDetails.frequency === 'Weekly' && (!task.recurringDetails.daysOfWeek || task.recurringDetails.daysOfWeek.length === 0)) {
                   toast.error(`Weekly task "${task.title}" must have at least one day selected.`);
                   setLoading(false);
                   return;
              }
              if (task.recurringDetails.frequency === 'Monthly' && (!task.recurringDetails.daysOfMonth || task.recurringDetails.daysOfMonth.length === 0)) {
                   toast.error(`Monthly task "${task.title}" must have at least one date selected.`);
                   setLoading(false);
                   return;
              }
          }
      }

      // --- Prepare data for API ---
      const goalPayload = {
          title: goalTitle,
          category: goalCategory,
          description: goalDescription,
          deadline: goalDeadline,
      };

      // We need to create the goal first to get its ID
      try {
          const createdGoal = await authenticatedFetch(`${API_URL}/api/goal`, {
              method: 'POST',
              body: JSON.stringify(goalPayload),
          });

          // Now create each task, associating it with the createdGoal._id
          const taskPromises = tasks.map(task => {
              // Prepare task payload, removing the temporary 'id' field
              const taskPayload = {
                  title: task.title,
                  category: goalCategory, // Inherit category from goal? Or add category to task form? Assuming goal category for now.
                  description: task.description,
                  isRecurring: task.isRecurring,
                  expiresIn: task.isRecurring ? undefined : task.expiresIn, // Only send expiresIn if not recurring
                  recurringDetails: task.isRecurring ? task.recurringDetails : undefined, // Only send details if recurring
                  forGoal: createdGoal._id // Link to the goal we just created
              };
               return authenticatedFetch(`${API_URL}/api/task`, {
                  method: 'POST',
                  body: JSON.stringify(taskPayload),
              });
          });

          // Wait for all task creation promises to resolve
          await Promise.all(taskPromises);

          toast.success('Goal and associated tasks created successfully!');
          setShowForm(false); // Close the form
          refreshGoals();

      } catch (error) {
          console.error("Error creating goal or tasks:", error);
          toast.error(error.message || "Failed to create goal or tasks.");
      } finally {
          setLoading(false);
      }
  };


  return (
    <div className="container darkGreyCard p-4 mb-5 text-start">
      <h3 style={{ color: 'var(--textColor)' }}>Create New Goal</h3>

      <form onSubmit={handleGoalSubmit}>
        {/* --- Goal Inputs --- */}
        <div className="mt-3">
          {/* Row 1: Title + Category */}
          <div className="row gx-3 mb-3">
            <div className="col-md-6">
              <label className='mb-1' style={{ color: "var(--grayText)" }}>Goal Title*</label>
              <input
                className="w-100 lightGreyCard goal-input p-2"
                placeholder="e.g., Learn React Native"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className='mb-1' style={{ color: "var(--grayText)" }}>Category*</label>
              <select
                className="w-100 lightGreyCard goal-input p-2"
                value={goalCategory}
                onChange={(e) => setGoalCategory(e.target.value)}
                required
              >
                <option value="">Select category...</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Description */}
          <div className="mb-3">
            <label className='mb-1' style={{ color: "var(--grayText)" }}>Description</label>
            <textarea
              className="w-100 lightGreyCard goal-input p-2"
              placeholder="Add more details about your goal (optional)"
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value)}
            />
          </div>

          {/* Row 3: Deadline */}
          <div className="mb-3">
            <label className='mb-1' style={{ color: "var(--grayText)" }}>Deadline*</label>
            <input
              type="date" // Use date type directly for better UX
              placeholder="Select deadline"
              className="w-100 lightGreyCard goal-input p-2"
              value={goalDeadline}
              onChange={(e) => setGoalDeadline(e.target.value)}
              required
            />
          </div>
        </div>

        <hr style={{ borderColor: 'var(--lightGrey)' }}/>

        {/* --- Task Forms --- */}
        <h4 className='mt-4' style={{ color: 'var(--textColor)' }}>Associated Tasks</h4>
        {tasks.map((task, index) => (
          <GoalTaskForm
            key={task.id} // Use the temporary ID for the key
            index={index}
            taskData={task}
            onChange={handleTaskChange}
            onRemove={handleRemoveTask} // Pass remove handler
            isOnlyTask={tasks.length === 1} // Pass flag if it's the only task
          />
        ))}

        {/* --- Add Task Button --- */}
        <button
          type="button" // Important: prevent form submission
          className="btn btn-outline-secondary mt-3"
          onClick={handleAddTask}
        >
          <i className="fa-solid fa-plus"></i> Add Another Task
        </button>

        <hr style={{ borderColor: 'var(--lightGrey)' }}/>

        {/* --- Submit/Cancel Buttons --- */}
        <div className="d-flex justify-content-end gap-2 mt-4">
            <button
                type="button" // Important: prevent form submission
                className="btn btn-secondary"
                onClick={() => setShowForm(false)} // Close form without submitting
            >
                Cancel
            </button>
            <button
                type="submit"
                className="btn purpleBtn text-white"
                disabled={loading}
            >
                {loading ? 'Creating...' : 'Create Goal & Tasks'}
            </button>
        </div>
      </form>
    </div>
  );
}

export default Form;