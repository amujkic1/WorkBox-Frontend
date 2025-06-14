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


function App() {
  const location = useLocation();
  const showSide = location.pathname !== '/' && !location.pathname.startsWith('/finance') && location.pathname != '/register';  
  const showTop = location.pathname != '/hr' && !location.pathname.startsWith('/finance');

  return (
    <div id="wrapper">
      {showSide && <Sidebar />}
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path='/register' element={<Register/>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cards" element={<AllCards />} />
            <Route path='/hr' element={<HRDashboard/>} />
            <Route path="/finance/*" element={<FinanceDashboard />} />
            <Route path='/app' element={<ApplicationList/>}/>
          </Routes>
        </div>

        {showSide && <Footer />}
      </div>
    </div>
  );
}

export default App;