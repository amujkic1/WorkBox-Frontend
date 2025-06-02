import { AreaChart, BarChart, DonutChart } from './Charts';

const AllCharts = () => {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Charts</h1>

      <div className="row">
        <div className="col-xl-8 col-lg-7">
          <AreaChart />
          <BarChart />
        </div>
        <div className="col-xl-4 col-lg-5">
          <DonutChart />
        </div>
      </div>
    </div>
  );
};

export default AllCharts;
