
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import App from './App';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
        <ToastContainer theme="dark" position="bottom-right" />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);




// import { useState } from 'react'
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'

// //for auth
// import { AuthProvider } from './context/AuthContext'; // Import the provider
// import 'react-toastify/dist/ReactToastify.css';
// import { ToastContainer } from 'react-toastify';

// import Navbar from './landing_page/Navbar.jsx'
// import DashboardPage from './landing_page/dashboard/DashboardPage.jsx'
// import AuthFormPage from './landing_page/authForm/AuthFormPage.jsx'
// import GoalPage from './landing_page/goals/GoalPage.jsx'
// import TaskPage from './landing_page/tasks/TaskPage.jsx'
// import FocusModePage from './landing_page/focusMode/FocusModePage.jsx'
// import FocusHero from './landing_page/focusMode/FocusHero.jsx'
// import AnalyticsPage from './landing_page/analytics/AnalyticsPage.jsx'
// import YoutubePage from './landing_page/youtube/YoutubePage.jsx'
// import SettingsPage from './landing_page/setting/SettingsPage.jsx'
// import NotFound from './landing_page/NotFound.jsx'

// import AuthSuccess from './landing_page/authForm/AuthSuccess.jsx'

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(true) // ⬅️ Replace this with actual auth logic later

//   return (
//     <StrictMode>
//       <AuthProvider>
//       <BrowserRouter>
//         {isLoggedIn && <Navbar />}
//         <Routes>
//           {!isLoggedIn ? (
//             <Route path="*" element={<AuthFormPage setIsLoggedIn={setIsLoggedIn} />} />
//           ) : (
//             <>
//               <Route path="/auth-success" element={<AuthSuccess />} />
//               <Route path="/" element={<AuthFormPage />} />
//               <Route path="/dashboard" element={<DashboardPage />} />
//               <Route path="/goals" element={<GoalPage />} />
//               <Route path="/tasks" element={<TaskPage />} />
//               <Route path="/focusMode" element={<FocusModePage />} />
//               <Route path="/focusHero" element={<FocusHero />} />
//               <Route path="/analytics" element={<AnalyticsPage />} />
//               <Route path="/safeYt" element={<YoutubePage />} />
//               <Route path="/settings" element={<SettingsPage />} />
//               <Route path="*" element={<NotFound />} />
//             </>
//           )}
//         </Routes>
//        </BrowserRouter>
//        <ToastContainer theme="dark" />
//       </AuthProvider>
//     </StrictMode>
//   )
// }

// createRoot(document.getElementById('root')).render(<App />)




