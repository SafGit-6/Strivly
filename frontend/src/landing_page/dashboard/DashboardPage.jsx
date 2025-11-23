import './DashboardPage.css';
import Welcome from './welcome.jsx';
import QuickActions from './QuickActions.jsx';
import TodaysTasks from './TodaysTasks.jsx';
import WeeklyTasks from './WeeklyTasks.jsx';
import ActiveGoals from './ActiveGoals.jsx'; 
import DailyReflection from './DailyReflection.jsx';
import Quote from './Quote.jsx';
import { useState } from 'react';

function DashboardPage() {

    const [refreshSignal, setRefreshSignal] = useState(0); 
    
    // This function increments the key, forcing components that use it to re-mount
    const triggerDashboardRefresh = () => {
        setRefreshSignal(prev => prev + 1);
    };

    return (
    <>
        <Welcome />
        <QuickActions />
        <TodaysTasks triggerDashboardRefresh={triggerDashboardRefresh}/>
        <WeeklyTasks refreshSignal={refreshSignal}/>
        <ActiveGoals refreshSignal={refreshSignal}/>
        <DailyReflection />
        <Quote />
    </> 
    );
}

export default DashboardPage;

