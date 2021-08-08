import React, { useEffect, useState} from "react";
import { Dropdown, TextInput} from "carbon-components-react";
import { useSelector} from "react-redux";
import { Add20, Subtract20 } from "@carbon/icons-react";
import {
  TooltipIcon,
} from "carbon-components-react";
import SingleSelectModal from "../../shared/single-select/single-select-with-modal";
import {
  getEntityGroupedData,
  getDepartmentHierarchyGroupedData,
  GetSortedEntityByGroups,
  GetSortedDepartmentByHierarchyGroupe,
  GetSortedJobCodeByGroups,
  GetSortedPayTypeByGroups,
  getJobCodeGroupedData,
  getPayTypeGroupedData,
} from "../../../helpers/DataTransform/transformData";
import { getApiResponseAsync } from "../../../services/api/apiCallerGet";

const RaisesSection = ({ sectionIndex, budgetVersion, raiseSettings, handleAdd, handleRemove, handleEntityChange, handleDepartmentChange, handleJobCodeChange, handlePayTypeChange, handleRaiseChange, handleStartDateChange, handleEndDateChange }) => {
  const masterData = useSelector((state) => state.MasterData);
  const getFiscalYearStartMonth = (bv, itemMonths) => {
    let month = null;

    if (raiseSettings?.length > 0) {
      month = itemMonths.find(month => month.itemTypeCode === raiseSettings[sectionIndex].startDate);
    }

    if (!month) {
      month = itemMonths.find(month => month.itemTypeCode === bv.timeperiodobj.fiscalStartMonthID?.itemTypeCode);
    }

    return month;
  }

  const getFiscalYearEndMonth = (bv, itemMonths) => {
    let month = null;

    if (raiseSettings?.length > 0) {
      month = itemMonths.find(month => month.itemTypeCode === raiseSettings[sectionIndex].endDate);
    }

    if (!month) {
      month = itemMonths.find(month => month.itemTypeCode === bv.timeperiodobj.fiscalEndMonthID?.itemTypeCode);
    }

    return month;
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getFiscalMonths = (budgetVersion) => {
    const result = [];

    const index = masterData.ItemMonths.findIndex(month => month.itemTypeCode.toUpperCase() === budgetVersion.fiscalStartMonthID);
    for (var i = index; i < masterData.ItemMonths.length; i++) {
      result.push(masterData.ItemMonths[i]);
    }
    if (index > 0) {
      for (var i = 0; i < index; i++) {
        result.push(masterData.ItemMonths[i]);
      }
    }

    return result;
  }

  const getEntitiesSelectedItem = () => {
    if (raiseSettings?.length > 0) {
      return masterData.Entites.find(entity => { return entity.entityCode === raiseSettings[sectionIndex].entityCode });
    }
  }

  const getDepartmentsSelectedItem = () => {
    if (raiseSettings?.length > 0) {
      return masterData.Departments.find(department => { return department.departmentCode === raiseSettings[sectionIndex].departmentCode });
    }
  }

  const getJobCodeSelectedItem = () => {
    if (raiseSettings?.length > 0) {
      return masterData.JobCodes.find(jc => { return jc.jobCodeCode === raiseSettings[sectionIndex].jobCodeCode });
    }
  }

  const getPayTypeSelectedItem = () => {
    if (raiseSettings?.length > 0) {
      return masterData.PayTypes.find(jc => { return jc.payTypeCode === raiseSettings[sectionIndex].payTypeCode });
    }
  }


  const getDefaultPercentChange = () => {
    if (raiseSettings?.length > 0) {
      if (raiseSettings[sectionIndex].percentChange > 0) {
        return raiseSettings[sectionIndex].percentChange;
      }      
    }
  }

  const [departmentGroupGridDataStates, setDepartmentGroupGridDataStates] = useState([]);
  const [entityGridDataStates, setentityGridDataStates] = useState([]);
  const [jobCodeGridDataStates, setjobCodeGridDataStates] = useState([]);
  const [payTypeGridDataStates, setpayTypeGridDataStates] = useState([]);

  useEffect(() => {
    if(masterData.Departments.length)
    {
      getApiResponseAsync("DEPARTMENTSRELATIONSHIPS").then((departmentRelation) => {
        getDepartmentHierarchyGroupedData(masterData.Departments, departmentRelation).then((response) => {
          setDepartmentGroupGridDataStates(response)
        });
    });
    }
  }, [masterData.Departments]);

  useEffect(() => {
    if(masterData.Entites.length)
    {
      getApiResponseAsync("ENTITYRELATIONSHIPS").then((entityrelationData) => {
        getEntityGroupedData(masterData.Entites, entityrelationData).then((response)=>{
          setentityGridDataStates(response);
        });
      });
    }
  } , [masterData.Entites]);

  useEffect(() => {
    if(masterData.JobCodes.length)
    {
      getApiResponseAsync("JOBCODERELATIONSHIPS").then((jobCoderelationData) => {
        getJobCodeGroupedData(masterData.JobCodes, jobCoderelationData).then((response)=>{
          setjobCodeGridDataStates(response);
        });
      });
    }
  } , [masterData.JobCodes]);

  useEffect(() => {
    if(masterData.PayTypes.length)
    {
      getApiResponseAsync("PAYTYPESRELATIONSHIPS").then((payTyperelationData) => {
        getPayTypeGroupedData(masterData.PayTypes, payTyperelationData).then((response)=>{
          setpayTypeGridDataStates(response);
        });
      });
    }
  } , [masterData.PayTypes]);


  return (
    <div>
      <div className="bx--row">
        <div className="bx--col">
          <TooltipIcon
            direction="top"
            tooltipText="Add a inflation row below."
            align="start"
          >
            <Add20
              onClick={(e) => {
                handleAdd();
              }}
            ></Add20>
          </TooltipIcon>
          <TooltipIcon
            direction="top"
            tooltipText="Remove the inflation row below."
            align="start"
          >
            <Subtract20
              onClick={(e) => {
                handleRemove(sectionIndex);
              }}
            ></Subtract20>
          </TooltipIcon>

        </div>
      </div>
      <div className="bx--row">
        <div className="raises-entity-dimension">Entity</div>
        <div className="raises-department-dimension">Department</div>
        <div className="raises-job-code-dimension">Job code</div>
        <div className="raises-pay-type-dimension">Pay type</div>
        <div className="raises-percentage">Raise percentage</div>
        <div className="raises-month">Start date</div>
        <div className="raises-month">End date</div>
      </div>
      <div className="bx--row">
        <div className="raises-entity-dimension raises-entity-combo-container">
          {masterData.Entites?.length > 0 ? <SingleSelectModal
            id={"raises-entity-model-" + sectionIndex}
            data={GetSortedEntityByGroups(masterData.Entites)}
            gridData={entityGridDataStates}
            name="Entity"
            placeholder="Choose one"
            selectedItem={getEntitiesSelectedItem}
            itemToString={(item) => (item ? item.entityCode + " " + item.entityName : "")}
            itemToElement = {(item) =>
              item.isGroup ? <span> <strong> {"*"} {item.entityCode + " " + item.entityName}</strong></span> 
              : <span> {item.entityCode + " " + item.entityName}</span> 
            }
            hideGroupsToggle={true}
            hideGroups={false}
            isGroupedData={true}
            onChange={e => { handleEntityChange(sectionIndex, e.selectedItem); }}
            className="raises-single-select-modal"
          />
            : ''}
        </div>
        <div className="raises-department-dimension raises-department-combo-container">
          {masterData.Departments?.length > 0 ? <SingleSelectModal
            id={"raises-department-model-" + sectionIndex}
            data={GetSortedDepartmentByHierarchyGroupe(masterData.Departments)}
            gridData={departmentGroupGridDataStates}
            name="Department"
            placeholder="Choose one"
            selectedItem={getDepartmentsSelectedItem}
            itemToString={(item) => (item ? item.departmentCode + " " + item.departmentName : "")}
            hideGroupsToggle={true}
            hideGroups={false}
            isGroupedData={true}
            onChange={e => { handleDepartmentChange(sectionIndex, e.selectedItem); }}
            className="raises-single-select-modal"
            itemToElement = {(item) =>
              item.isGroup || item.isHierarchy ? <span> <strong> {"*"} {item.departmentCode + " " + item.departmentName}</strong></span> 
              : <span> {item.departmentCode + " " + item.departmentName}</span> 
            }
          />
            : ''}
        </div>
        <div className="raises-job-code-dimension raises-jobcode-combo-container">
          {masterData.JobCodes?.length > 0 ? <SingleSelectModal
                id={"raises-job-code-model-" + sectionIndex}
                data={GetSortedJobCodeByGroups(masterData.JobCodes)}
                gridData={jobCodeGridDataStates}
                name="jobCode"
                modalHeading="Job code"
                placeholder="Choose one"
                selectedItem={getJobCodeSelectedItem}
                itemToString={(item) => (item ? item.jobCodeCode + " " + item.jobCodeName : "")}
                itemToElement = {(item) =>
                  item.isGroup ? <span> <strong> {"*"} {item.jobCodeCode + " " + item.jobCodeName}</strong></span> 
                  : <span> {item.jobCodeCode + " " + item.jobCodeName}</span> 
                }                    
                hideGroupsToggle={true}
                hideGroups={false}
                isGroupedData={true}
                onChange={e => { handleJobCodeChange(sectionIndex, e.selectedItem); }}
                className="raises-single-select-modal"
              />
                : ''}
        </div>
        <div className="raises-pay-type-dimension raises-paytype-combo-container">
        {masterData.PayTypes?.length > 0 ? <SingleSelectModal
                id={"raises-pay-type-model-" + sectionIndex}
                data={GetSortedPayTypeByGroups(masterData.PayTypes)}
                gridData={payTypeGridDataStates}
                name="payType"
                placeholder="Choose one"
                modalHeading="Pay type"
                selectedItem={getPayTypeSelectedItem}
                itemToString={(item) => (item ? item.payTypeCode + " " + item.payTypeName : "")}
                itemToElement = {(item) =>
                  item.isGroup ? <span> <strong> {"*"} {item.payTypeCode + " " + item.payTypeName}</strong></span> 
                  : <span> {item.payTypeCode + " " + item.payTypeName}</span> 
                }    
                hideGroupsToggle={true}
                hideGroups={false}
                isGroupedData={true}
                onChange={e => { handlePayTypeChange(sectionIndex, e.selectedItem); }}
                className="raises-single-select-modal"
              />
                : ''}
        </div>
        <div className="raises-percentage">
          <TextInput
            id={"percentChange-" + sectionIndex}
            ariaLabel="Wage adjustment percent change"
            defaultValue={getDefaultPercentChange()}
            type="number"
            onChange={e => {
              handleRaiseChange(sectionIndex, e.target.value)
            }}
          />
        </div>
        <div className="raises-month">
          <Dropdown
            id={"startMonth-" + sectionIndex}
            ariaLabel="Start date"
            items={getFiscalMonths(budgetVersion)}
            initialSelectedItem={getFiscalYearStartMonth(budgetVersion, masterData.ItemMonths)}
            itemToString={(item) =>
              item ? item.itemDisplayName : ""
            }
            onChange={e => {
              handleStartDateChange(sectionIndex, e.selectedItem)
            }}
            type="text"
            direction="top"
          />
        </div>
        <div className="raises-month">
          <Dropdown
            id={"endMonth-" + sectionIndex}
            ariaLabel="End date"
            items={getFiscalMonths(budgetVersion)}
            initialSelectedItem={getFiscalYearEndMonth(budgetVersion, masterData.ItemMonths)}
            itemToString={(item) =>
              item ? item.itemDisplayName : ""
            }
            onChange={e => {
              handleEndDateChange(sectionIndex, e.selectedItem)
            }}
            type="text"
            direction="top"
          />
        </div>
      </div >
    </div >
  );
};

export default RaisesSection;