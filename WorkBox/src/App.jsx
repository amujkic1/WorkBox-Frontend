import { Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Sidebar from './components/common/Sidebar';
import Topbar from './components/common/Topbar';
import Footer from './components/common/Footer';
import Dashboard from './components/dashboard/Dashboard';
import AllCards from './components/dashboard/AllCards';
import Login from './pages/Login';
import Register from './pages/Register';
import OpeningForm from './components/forms/OpeningForm';
import HRDashboard from './pages/HRDashboard';
import ApplicationList from './components/dashboard/ApplicationList';

import FinanceDashboard from './pages/FinanceDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import Records from './pages/Records';
import SidebarHR from './components/common/SidebarHR';
import ProtectedRoute from './components/auth/ProtectedRoute';

import AssignUsersToTeams from './pages/AssignUsersToTeams';
import ProjectTaskManager from './pages/ProjectTaskManager'; 

function App() {
  const location = useLocation();
  const showSide = location.pathname !== '/' && !location.pathname.startsWith('/finance') && location.pathname != '/register' && location.pathname != '/hr' && location.pathname != '/records' && !location.pathname.startsWith('/finance');  
  const showTop = location.pathname != '/hr' && !location.pathname.startsWith('/finance');
  const isHR = location.pathname === '/hr' || location.pathname === '/records'; 

  return (
    <div id="wrapper">
      {showSide && <Sidebar />}
      {isHR && <SidebarHR />}
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path='/register' element={<Register/>} />  
            
            <Route
              path="/hr"
              element={<ProtectedRoute element={HRDashboard} allowedRoles={['HR']} />}
            />

            <Route
              path="/app"
              element={<ProtectedRoute element={ApplicationList} allowedRoles={['HR']} />}
            />

            <Route
              path="/records"
              element={<ProtectedRoute element={Records} allowedRoles={['HR']} />}
            />

            <Route
              path="/finance/*"
              element={<ProtectedRoute element={FinanceDashboard} allowedRoles={['FINANCE_MANAGER']} />}
            />

            <Route
              path="/business"
              element={<ProtectedRoute element={BusinessDashboard} allowedRoles={['BUSINESS_MANAGER']} />}
            />

            <Route
              path="/teams"
              element={<ProtectedRoute element={AssignUsersToTeams} allowedRoles={['BUSINESS_MANAGER']} />}
            />

             <Route
    path="/projects/:projectId/tasks"
    element={<ProtectedRoute element={ProjectTaskManager} allowedRoles={['BUSINESS_MANAGER']} />}
  />

            {/*
            <Route path="/finance/*" element={<FinanceDashboard />} />
            <Route path='/app' element={<ApplicationList/>}/>
            <Route path='/business' element={<BusinessDashboard />} />
            <Route path='/records' element={<Records/>}/>
            */}
          </Routes>
        
        </div>

        {showSide && <Footer />}
      </div>
    </div>
  );
}

export default App;