import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

// AREA CHART
export const AreaChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Earnings',
      data: [3000, 4000, 3200, 4500, 3700, 4200],
      fill: true,
      backgroundColor: 'rgba(78, 115, 223, 0.05)',
      borderColor: 'rgba(78, 115, 223, 1)',
      tension: 0.4
    }]
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">Area Chart</h6>
      </div>
      <div className="card-body">
        <div className="chart-area">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

// BAR CHART
export const BarChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [1000, 2000, 1500, 3000, 2500, 2800],
      backgroundColor: 'rgba(78, 115, 223, 1)'
    }]
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">Bar Chart</h6>
      </div>
      <div className="card-body">
        <div className="chart-bar">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

// DONUT CHART
export const DonutChart = () => {
  const data = {
    labels: ['Direct', 'Social', 'Referral'],
    datasets: [{
      data: [55, 30, 15],
      backgroundColor: [
        'rgba(78, 115, 223, 1)',
        'rgba(28, 200, 138, 1)',
        'rgba(54, 185, 204, 1)'
      ],
      hoverBackgroundColor: [
        'rgba(78, 115, 223, 0.8)',
        'rgba(28, 200, 138, 0.8)',
        'rgba(54, 185, 204, 0.8)'
      ],
      borderWidth: 1
    }]
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">Donut Chart</h6>
      </div>
      <div className="card-body">
        <div className="chart-pie pt-4">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
};
