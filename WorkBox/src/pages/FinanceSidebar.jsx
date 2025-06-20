import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; 
import axios from 'axios';


export default function FinanceSidebar() {
  const navigate = useNavigate();

  // Funkcija za logout
  const handleLogout = async () => {
    /*
    // Brisanje tokena iz cookies
    Cookies.remove('token');
    
    // Takođe, možeš očistiti bilo koji drugi storage ako je potrebno
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }
    
    if (sessionStorage.getItem('token')) {
      sessionStorage.removeItem('token');
    }
    
    // Ako koristiš axios zaglavlja za token, obriši ga
    delete axios.defaults.headers.common['Authorization'];
    
    // Preusmeri korisnika na login stranicu
    navigate('/login');
    */
    try {
     const token = Cookies.get('token');
     if (!token) {
       throw new Error('Token not found');
     }

     const payload = JSON.parse(atob(token.split('.')[1]));
     const uuid = payload.uuid;
     console.log("UUID usera koji se ažurira:",uuid);

     const patch = [
       { op: "replace", path: "/checkOutTime", value: new Date().toTimeString().split(' ')[0] }
     ];
     console.log("Ažurira se vrijeme u:",patch);

     await axios.patch(`http://localhost:8080/finance/check_in_record/${uuid}`, patch, {
       headers: {
         'Content-Type': 'application/json-patch+json',
         Authorization: `Bearer ${token}`
       }
     });
     
    } catch (error) {
      console.log('Failed to update checkOutTime:', error.message);
    }

    // Logout u svakom slučaju
    Cookies.remove('token');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];

    navigate('/');
  }
  
  return (
    <ul className="navbar-nav bg-gradient-info sidebar sidebar-dark accordion" id="financeSidebar">

      <div className="sidebar-brand d-flex align-items-center mt-3 mb-3">
        <div className="sidebar-brand-icon">
          <i className="fas fa-coins"></i>
        </div>
        <div className="sidebar-brand-text mx-2">WorkBox finance</div>
      </div>

      <hr className="sidebar-divider my-0 border-top border-white" />



      <li className="nav-item">
        <Link className="nav-link" to="/finance">
          <i className="fa-solid fa-house me-2" style={{ fontSize: '20px' }}></i>
          <span className="fs-5">Dashboard</span>
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/finance/benefits">
          <i className="fas fa-wallet me-2" style={{ fontSize: '20px' }}></i>
          <span className="fs-5">Employee benefits</span>
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/finance/payroll">
          <i className="fas fa-file-invoice-dollar me-2" style={{ fontSize: '20px' }}></i>
          <span className="fs-5">Payroll</span>
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/finance/reports">
          <i className="fa-regular fa-file-lines me-2" style={{ fontSize: '20px' }}></i>
          <span className="fs-5">Reports</span>
        </Link>
      </li>


       <li className="nav-item">
        <Link className="nav-link" to="/" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt me-2" style={{ fontSize: '20px' }}></i>
          <span className="fs-5">Logout</span>
        </Link>
      </li>      

    </ul>
  );
}