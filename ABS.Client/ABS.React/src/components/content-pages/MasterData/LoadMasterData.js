import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";

import {
  fetchBudgetTypes,
  fetchBudgetVersionTypes,
  fetchForecastMethodType,
  fetchScenarioType,
  fetchItemDateFormat,
  fetchItemDecimalPlaces,
  fetchItemMonths,
  fetchFiscalyear,
  fetchEntities,
  fetchDepartments,
  fetchStatistics,
  fetchTimePeriods,
  fetchDimensionRelationships,
  fetchDepartmentsRelationships,
  fetchGLAccountsRelationships,
  fetchGLAccounts,
  fetchPayTypes,
  fetchJobCodes,
  fetchPayTypeDistributions,
  fetchStaffingDataType
} from "../../../core/_actions/MasterDataActions";
import { fetchSystemSettings } from "../../../core/_actions/SystemSettingActions";
import { Button } from "carbon-components-react";
import { useLocation } from 'react-router-dom'
import { ENV } from "../..";
function LoadMasterData({
  HeaderLoading,
  fetchBudgetTypes,
  fetchFiscalyear,
  fetchBudgetVersionTypes,
  fetchForecastMethodType,
  fetchScenarioType,
  fetchItemDateFormat,
  fetchItemDecimalPlaces,
  fetchItemMonths,
  fetchSystemSettings,
  fetchEntities,
  fetchDepartments,
  fetchStatistics,
  fetchTimePeriods,
  fetchDimensionRelationships,
  fetchDepartmentsRelationships,
  fetchGLAccountsRelationships,
  fetchGLAccounts,
  fetchPayTypes,
  fetchJobCodes,
  fetchPayTypeDistributions,
  fetchStaffingDataType
}) {
  const isHeaderLoading = HeaderLoading;

  const userDetails = useSelector((state) => state.UserDetails);
  const isMasterDataLoading = useSelector((state) => state.MasterData.isLoading);

  const location = useLocation();

  const handleLoadbudgetType = (e) => {
    fetchBudgetTypes();
  };
  const handleLoadBudgetVersionType = (e) => {
    fetchBudgetVersionTypes();
  };
  const handleLoadFiscalYear = (e) => {
    fetchFiscalyear();
  };
  const handleLoadForecastMethodType = (e) => {
    fetchForecastMethodType();
  };
  const handleLoadScenarioType = (e) => {
    fetchScenarioType();
  };
  const handleLoadItemDateFormat = (e) => {
    fetchItemDateFormat();
  };
  const handleLoadItemDecimalPlace = (e) => {
    fetchItemDecimalPlaces();
  };
  const handleLoadItemMonths = (e) => {
    fetchItemMonths("ITEMMONTHS");
  };

  useEffect(() => {
    if (isMasterDataLoading) {
      let UserID = null;
      if (userDetails?.UserProfile?.UserProfileID || ENV === 'DEMO') {
        // if (location.pathname !== '/UserSetup' && ENV !== 'DEMO')
        if (ENV !== 'DEMO')
          UserID = userDetails?.UserProfile?.UserProfileID;
          UserID = 0;
        handleLoadItemDateFormat();
        handleLoadBudgetVersionType();
        handleLoadFiscalYear();
        handleLoadItemDecimalPlace();
        handleLoadbudgetType();
        handleLoadItemMonths();
        handleLoadForecastMethodType();
        handleLoadScenarioType();
        fetchSystemSettings("SystemSettingsbyUser");
        fetchEntities(UserID);
        fetchDepartments(UserID);
        fetchStatistics(UserID);
        fetchTimePeriods();
        //fetchDimensionRelationships();
        fetchDepartmentsRelationships();
        fetchGLAccountsRelationships();
        fetchGLAccounts(UserID);
        fetchPayTypes(UserID);
        fetchJobCodes(UserID);
        fetchPayTypeDistributions();
        fetchStaffingDataType();
      }
    }
  }, []);

  if (isHeaderLoading === "true") {
    return <div />;
  } else {
    return (
      <div>
        <div className="bx--row" />
        <div className="bx--row" />
        <div className="bx--row" />
        <div className="bx--row">
          <div className="bx--col">
            <Button
              className="bx--btn--primary "
              type="Submit"
              onClick={handleLoadbudgetType}
            >
              Load Budget Type {"  	  "} &nbsp;
            </Button>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col">
            <Button
              className="bx--btn--primary "
              type="Submit"
              onClick={handleLoadBudgetVersionType}
            >
              Load Budget Version Type {"  	  "} &nbsp;
            </Button>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col">
            <Button
              className="bx--btn--primary "
              type="Submit"
              onClick={handleLoadFiscalYear}
            >
              Load Fiscal Year {"  	  "} &nbsp;
            </Button>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col">
            <Button
              className="bx--btn--primary "
              type="Submit"
              onClick={handleLoadForecastMethodType}
            >
              Load Forecast Method Type {"  	  "} &nbsp;
            </Button>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col">
            <Button
              className="bx--btn--primary "
              type="Submit"
              onClick={handleLoadScenarioType}
            >
              Load Scenario Type {"  	  "} &nbsp;
            </Button>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col">
            <Button
              className="bx--btn--primary "
              type="Submit"
              onClick={handleLoadItemDateFormat}
            >
              Load Item Date Format {"  	  "} &nbsp;
            </Button>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col">
            <Button
              className="bx--btn--primary "
              type="Submit"
              onClick={handleLoadItemDecimalPlace}
            >
              Load Item Decimal Place {"  	  "} &nbsp;
            </Button>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col">
            <Button
              className="bx--btn--primary "
              type="Submit"
              onClick={handleLoadItemMonths}
            >
              Load Item Months {"  	  "} &nbsp;
            </Button>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col" />
          <div className="bx--col" />
          <div className="bx--col" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ItemTypes: state.count,
});

const mapDispatchToProps = {
  fetchBudgetTypes,
  fetchBudgetVersionTypes,
  fetchFiscalyear,
  fetchForecastMethodType,
  fetchScenarioType,
  fetchItemDateFormat,
  fetchItemDecimalPlaces,
  fetchItemMonths,
  fetchSystemSettings,
  fetchEntities,
  fetchDepartments,
  fetchStatistics,
  fetchTimePeriods,
  fetchDimensionRelationships,
  fetchDepartmentsRelationships,
  fetchGLAccountsRelationships,
  fetchGLAccounts,
  fetchPayTypes,
  fetchJobCodes,
  fetchPayTypeDistributions,
  fetchStaffingDataType
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadMasterData);
