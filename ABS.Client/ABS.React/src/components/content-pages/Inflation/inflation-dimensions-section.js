import React, { useEffect, useState } from "react";
import { Dropdown, TextInput } from "carbon-components-react";
import { useSelector } from "react-redux";
import { Add20, Subtract20 } from "@carbon/icons-react";
import {
  TooltipIcon,
  DropdownSkeleton
} from "carbon-components-react";
import SingleSelectModal from "../../shared/single-select/single-select-with-modal";
import {
  getEntityGroupedData,
  getDepartmentHierarchyGroupedData,
  GetSortedEntityByGroups,
  GetSortedDepartmentByHierarchyGroupe,
  GetSortedGLAccountsByGroups,
  getGLAccountHierarchyGroupedData
} from "../../../helpers/DataTransform/transformData";
import { getApiResponseAsync } from "../../../services/api/apiCallerGet";

const InflationDimensionsSection = ({ key, sectionIndex, budgetVersion, initialData, handleAdd, handleRemove, handleEntityChange, handleDepartmentChange, handleGLAccountChange, handleInflationPercentChange, handleStartDateChange, handleEndDateChange }) => {
  const masterData = useSelector((state) => state.MasterData);
  const [fiscalYearMonths, SetFiscalYearMonths] = useState({ months: [] });
  const [entityPageSizeState, setEntityPageSizeState] = useState({});
  const [departmentPageSizeState, setDepartmentPageSizeState] = useState({});
  const [jobCodePageSizeState, setJobCodePageSizeState] = useState({});
  const [endDate, setEndDate] = useState({});

  const getFiscalYearStartMonth = (bv, itemMonths) => {
    let month = null;

    if (initialData?.length > sectionIndex) {
      month = itemMonths.find(month => month.itemTypeCode === initialData[sectionIndex].startMonth.itemTypeCode);
    }

    if (!month) {
      month = itemMonths.find(month => month.itemTypeCode === bv.timeperiodobj.fiscalStartMonthID?.itemTypeCode);
    }

    return month;
  }

  const getFiscalYearEndMonth = (bv, itemMonths) => {
    let month = null;

    if (initialData?.length > sectionIndex) {
      month = itemMonths.find(month => month.itemTypeCode === initialData[sectionIndex].endMonth.itemTypeCode);
    }

    if (!month) {
      month = itemMonths.find(month => month.itemTypeCode === bv.timeperiodobj.fiscalEndMonthID?.itemTypeCode);
    }

    return month;
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getFiscalMonths = (budgetVersion) => {
    const result = [];

    const index = masterData.ItemMonths.findIndex(month => month.itemTypeCode?.toUpperCase() === budgetVersion.fiscalStartMonthID);
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
    if (initialData?.length > sectionIndex) {

      return masterData.Entites.find(entity => { return entity.entityCode === initialData[sectionIndex].entity.entityCode });
    }
  }

  const getDepartmentsSelectedItem = () => {
    if (initialData?.length > sectionIndex) {
      return masterData.Departments.find(department => { return department.departmentCode === initialData[sectionIndex].department.departmentCode });
    }
  }

  const getGLAccountSelectedItem = () => {
    if (initialData?.length > sectionIndex) {
      return masterData.GLAccounts.find(account => { return account.glAccountCode === initialData[sectionIndex].glAccount.glAccountCode });
    }
  }

  const getDefaultPercentChange = () => {
    if (initialData?.length > sectionIndex) {
      return initialData[sectionIndex].inflationPercent;
    }
  }

  const handleEntityPageSizeChange = e => {
    setEntityPageSizeState(e.pageSize);
  }

  const handleDepartmentPageSizeChange = e => {
    setDepartmentPageSizeState(e.pageSize);
  }

  const handleJobCodePageSizeChange = e => {
    setJobCodePageSizeState(e.pageSize);
  }

  console.log('initialData',getFiscalYearEndMonth(budgetVersion, masterData.ItemMonths))
  console.log('endDate',endDate)
  
  
  const [departmentGroupGridDataStates, setDepartmentGroupGridDataStates] = useState([]);
  const [entityGridDataStates, setentityGridDataStates] = useState([]);
  const [glAccountGridDataStates, setglAccountGridDataStates] = useState([]);
  
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
    if(masterData.GLAccounts.length)
    {
      getApiResponseAsync("GLACCOUNTSRELATIONSHIPS").then((glRelationData) => {
        getGLAccountHierarchyGroupedData(masterData.GLAccounts, glRelationData).then((response)=>{
          setglAccountGridDataStates(response);
        });
      });
    }
  } , [masterData.GLAccounts]);

  return (
    <div key={key}>
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
        <div className="inflation-entity-dimention">Entity</div>
        <div className="inflation-department-dimention">Department</div>
        <div className="inflation-genral-ledger-dimention">GL Account</div>
        <div className="infaltion-percentage">Inflation percent change</div>
        <div className="inflation-month">Start date</div>
        <div className="inflation-month">End date</div>
      </div>
      <div className="bx--row">
        <div className="inflation-entity-dimention">
          {masterData.Entites?.length > 0 ? <SingleSelectModal
            id={"inflation-entity-model-" + key}
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
            className={`inflation-single-select-entity-modal-${entityPageSizeState}`}
            onPageSizeChange={e => {handleEntityPageSizeChange(e)}}
          />
            : ''}
        </div>
        <div className="inflation-department-dimention">
          { departmentGroupGridDataStates.length > 0 ? <SingleSelectModal
            id={"inflation-department-model-" + key}
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
            className={`inflation-single-select-department-modal-${departmentPageSizeState}`}
            itemToElement = {(item) =>
              item.isGroup || item.isHierarchy ? <span> <strong> {"*"} {item.departmentCode + " " + item.departmentName}</strong></span> 
              : <span> {item.departmentCode + " " + item.departmentName}</span> 
            }            
            onPageSizeChange={e => {handleDepartmentPageSizeChange(e)}}
          />
            : <DropdownSkeleton />}
        </div>
        <div className="inflation-genral-ledger-dimention">

          <SingleSelectModal
            id={"generalLedger-" + key}
            data={GetSortedGLAccountsByGroups(masterData.GLAccounts)}
            gridData={glAccountGridDataStates}
            placeholder="Choose one"
            name="GL Account"
            selectedItem={getGLAccountSelectedItem}
            itemToString={(item) =>
              item
                ? item.glAccountCode + " " + item.glAccountName
                : ""
            }
            light={false}
            itemToElement={(item) =>
              item.isGroup ? <span> <strong> {"*"} {item.glAccountCode + " " + item.glAccountName}</strong></span>
                : <span> {item.glAccountCode + " " + item.glAccountName}</span>
            }
            onChange={e => { handleGLAccountChange(sectionIndex, e.selectedItem) }}
            hideGroupsToggle={true}
            hideGroups={false}
            isGroupedData={true}
            onPageSizeChange={e => {handleJobCodePageSizeChange(e)}}
            className={`inflation-single-select-job-code-modal-${jobCodePageSizeState}`}
            />
        </div>
        <div className="infaltion-percentage">
          <TextInput
            id={"percentChange-" + key}
            ariaLabel="Inflation percent change"
            defaultValue={getDefaultPercentChange()}
            type="number"
            onChange={e => {
              handleInflationPercentChange(sectionIndex, e.target.value);
            }}
          />
        </div>
        <div className="inflation-month">
          <Dropdown
            id={"startMonth-" + key}
            ariaLabel="Start date"
            items={getFiscalMonths(budgetVersion)}
            initialSelectedItem={getFiscalYearStartMonth(budgetVersion, masterData.ItemMonths)}
            itemToString={(item) =>
              item ? item.itemDisplayName : ""
            }
            onChange={e => {
              handleStartDateChange(sectionIndex, e.selectedItem);
            }}
            type="text"
            direction="top"
          />
        </div>
        <div className="inflation-month">
          <Dropdown
            id={"endMonth-" + key}
            ariaLabel="End date"
            items={getFiscalMonths(budgetVersion)}
            initialSelectedItem={getFiscalYearEndMonth(budgetVersion, masterData.ItemMonths)}
            itemToString={(item) =>
              item ? item.itemDisplayName : ""
            }
            onChange={e => {
              handleEndDateChange(sectionIndex, e.selectedItem);
              setEndDate(e.selectedItem)
            }}
            type="text"
            direction="top"
          />
        </div>
      </div >
    </div >
  );
};

export default InflationDimensionsSection;