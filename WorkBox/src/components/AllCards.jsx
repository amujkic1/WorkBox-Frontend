import React from 'react';
import {
  MonthlyEarningsCard,
  AnnualEarningsCard,
  TasksCard,
  PendingRequestsCard,
  DefaultCard,
  BasicCard,
  DropdownCard,
  CollapsableCard
} from '../components/Cards';


const AllCards = () => {
  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Cards</h1>
      </div>

      <div className="row">
        <MonthlyEarningsCard />
        <AnnualEarningsCard />
        <TasksCard />
        <PendingRequestsCard />
      </div>

      <div className="row">
        <div className="col-lg-6">
          <DefaultCard />
          <BasicCard />
        </div>

        <div className="col-lg-6">
          <DropdownCard />
          <CollapsableCard />
        </div>
      </div>
    </div>
  );
};

export default AllCards;
