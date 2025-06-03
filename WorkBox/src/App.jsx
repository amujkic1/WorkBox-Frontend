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
import OpeningForm from './components/forms/OpeningForm';

function App() {
  const location = useLocation();
  const showLayout = location.pathname !== '/'; 

  return (
    <div id="wrapper">
      {showLayout && <Sidebar />}
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          {showLayout && <Topbar />}

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cards" element={<AllCards />} />
            <Route path='/opening' element={<OpeningForm />} />
          </Routes>
        </div>
        {showLayout && <Footer />}
      </div>
    </div>
  );
}

export default App;