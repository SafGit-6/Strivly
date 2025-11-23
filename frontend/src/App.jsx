import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './context/ProtectedRoute.jsx';

// Import Components & Pages
import Navbar from './landing_page/Navbar.jsx';
import DashboardPage from './landing_page/dashboard/DashboardPage.jsx';
import AuthFormPage from './landing_page/authForm/AuthFormPage.jsx';
import AuthSuccess from './landing_page/authForm/AuthSuccess.jsx';
import GoalPage from './landing_page/goals/GoalPage.jsx';
import TaskPage from './landing_page/tasks/TaskPage.jsx';
import FocusModePage from './landing_page/focusMode/FocusModePage.jsx';
import FocusHero from './landing_page/focusMode/FocusHero.jsx';
import AnalyticsPage from './landing_page/analytics/AnalyticsPage.jsx';
import YoutubePage from './landing_page/youtube/YoutubePage.jsx';
import SettingsPage from './landing_page/setting/SettingsPage.jsx';
import NotFound from './landing_page/NotFound.jsx';

function App() {
  const { user } = useAuth();

  return (
    <>
      {/* Only show the Navbar if a user is logged in */}
      {user && <Navbar />}
      
      <Routes>
        {/* --- Public Routes --- */}
        {/* If the user is logged in, redirect them from / to the dashboard */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthFormPage />} />
        <Route path="/auth-success" element={<AuthSuccess />} />

        {/* --- Protected Routes --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/goals" element={<GoalPage />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/focusMode" element={<FocusModePage />} />
          <Route path="/focusHero" element={<FocusHero />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/safeYt" element={<YoutubePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* --- Not Found Route --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;