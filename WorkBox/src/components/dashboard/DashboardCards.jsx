const DashboardCards = ({ onOpenForm, onOpenAppForm }) => (
  <div className="row mb-4">
    <div className="col-md-3">
      <div className="card shadow-lg text-center" onClick={onOpenForm} style={{ cursor: 'pointer' }}>
        <div className="card-body">
          <div className="card-icon mb-2" style={{ fontSize: '2rem', color: '#0d6efd' }}>📂</div>
          <h5>Active openings</h5>
          <h3>5</h3>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card shadow-lg text-center" onClick={onOpenAppForm} style={{ cursor: 'pointer' }}>
        <div className="card-body">
          <div className="card-icon mb-2" style={{ fontSize: '2rem', color: '#0d6efd' }}>📥</div>
          <h5>Applications</h5>
          <h3>12</h3>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card shadow-lg text-center">
        <div className="card-body">
          <div className="card-icon mb-2" style={{ fontSize: '2rem', color: '#0d6efd' }}>🗂️</div>
          <h5>Pending requests</h5>
          <h3>8</h3>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card shadow-lg text-center">
        <div className="card-body">
          <div className="card-icon mb-2" style={{ fontSize: '2rem', color: '#0d6efd' }}>👨‍💼</div>
          <h5>Employees</h5>
          <h3>73</h3>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardCards;