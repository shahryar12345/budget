import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import EntityDataGrid from "./entity-dataGrid";
import DepartmentDataGrid from "./department-dataGrid";
import ScenarioTypeDataGrid from "./scenario-type-dataGrid";
import RowCalculationGrid from "./row-calculation-grid";
import FullScreenModal from "../../shared/budget-versions-modal/full-screen-modal";
import { getStatisticsGroupedData, getGLAccountHierarchyGroupedData , getPayTypeGroupedData } from '../../../helpers/DataTransform/transformData';
import { DataMapping } from "./Data/data-mapping";
import JobCodeGrid from "./job-code-grid";
import { ComboBox, Button} from "carbon-components-react";
import { GetPayTypeDistributionPageDataRows } from "../../../services/pay-type-distribution-service";
import { getApiResponseAsync } from "../../../services/api/apiCallerGet";

const AddRowModal = ({
  isOpen,
  handleAddRowModal,
  timePeriod,
  scenarioType,
  handleAddRowInTable,
  budgetVersionId,
  scenarioTableData,
  dimensionRelationshipData
}) => {
  const initialStates = {
    entity: null,
    department: null,
    statistics: null,
    entityKey: 100,
    departmentKey: 200,
    statisticsKey: 300,
    RowCalculateKey: 400,
    jobCodeKey: 500,
    payTypeKey : 600,
    staffingDataTypeKey : 700,
    GroupedGridData: [],
    name: "",
    headerName: "",
    jobcode : null,
    payType : null,
    staffingDataType : {id : "Hours" , value : "Hours"}
  };
  const [localState, setlocalState] = useState(initialStates);
  const [ScenarioDataState, setScenarioDataState] = useState({});
  const addRowCalculationGridRef = useRef();
  const masterData = useSelector((state) => state.MasterData);

  const payTypeDropdownData = GetPayTypeDistributionPageDataRows(masterData.PayTypeDistributions, "LLLL", "N/A")
  const handleSelection = (selectedRowObj, selectedDimention) => {
    if (selectedDimention === "entity" || selectedDimention === "department" || selectedDimention === 'jobcode') {
      setlocalState({
        ...localState,
        [selectedDimention]: selectedRowObj,
        [localState.name]: null,
      });
    } else {
      setlocalState({ ...localState, [selectedDimention]: selectedRowObj });
    }
  };

  const staffingDataTypeDropDownData = [
    {id : "Hours" , value : "Hours"},
    {id : "Dollars" , value : "Dollars"},
  ]

  useEffect(() => {
    if (budgetVersionId && scenarioType?.itemTypeCode && isOpen) {
      setScenarioDataState({ ...ScenarioDataState, ScenarioData: scenarioTableData });
    }
  }, [budgetVersionId, isOpen, scenarioTableData]);


  useEffect(() => {
    //hack to reset modal on every Open
    setlocalState({
      ...localState,
      entityKey: parseInt(localState.entityKey + 1),
      departmentKey: parseInt(localState.departmentKey + 1),
      statisticsKey: parseInt(localState.statisticsKey + 1),
      RowCalculateKey: parseInt(localState.RowCalculateKey + 1),
      jobCodeKey: parseInt(localState.jobCodeKey + 1),
      payTypeKey: parseInt(localState.payTypeKey + 1),
      staffingDataTypeKey: parseInt(localState.staffingDataTypeKey + 1),
      entity: null,
      department: null,
      statistics: null,
      jobcode : null,
      payType : null,
      staffingDataType : {id : "Hours" , value : "Hours"}
    });
  }, [isOpen]);

  useEffect(() => {
    let GroupedGridData = [];
    let UpdatedData = [];
    let name;
    let headerName;
    if (scenarioType.itemTypeCode === "ST") {
      UpdatedData = masterData.Statistics.map(
        (statistics, statisticsIndex) => {
          statistics.isSelected = false;
          return statistics;
        }
      );      
        getStatisticsGroupedData(UpdatedData, dimensionRelationshipData.statistics).then((response)=>{
          GroupedGridData = response;
          name = "statistics";
          headerName = "Statistics";
          setlocalState({
            ...localState, GroupedGridData: GroupedGridData, name: name , headerName : headerName
          });
        });   
    } else if (scenarioType.itemTypeCode === "GL") {
      UpdatedData = masterData.GLAccounts.map(
        (glAccount, glAccountIndex) => {
          glAccount.isSelected = false;
          return glAccount;
        }
      );
        getGLAccountHierarchyGroupedData(UpdatedData, dimensionRelationshipData.glAccount).then((response)=>{          
          GroupedGridData =  response;
          name = "glAccount";
          headerName = "GLAccounts";
          setlocalState({
            ...localState, GroupedGridData: GroupedGridData, name: name , headerName : headerName
          });
        });      
    } else if (scenarioType.itemTypeCode === "SF") {
      UpdatedData = masterData.PayTypes.map(payType => { return { ...payType, isSelected: false } })
        getPayTypeGroupedData(UpdatedData, dimensionRelationshipData.payTypes).then((response)=>{
          GroupedGridData = response;
          name = "payType"
          headerName = "payType";
          setlocalState({
            ...localState, GroupedGridData: GroupedGridData, name: name , headerName : headerName
          });
        });
    }   
  }, [scenarioType , dimensionRelationshipData])

  const handleModalSubmit = () => {
    let RowData = addRowCalculationGridRef.current.GetRowDataFromModal();

    if(scenarioType.itemTypeCode === "SF")
    { 
      let staffingDataTypeID = masterData.StaffingDataType.find((item) => {
        return item.itemTypeCode === localState.staffingDataType.id
      })?.itemTypeID;

      let payTypesWithPercentages = masterData.PayTypeDistributions.filter((payType) => {
        return payType.code === localState.payType.code && payType.percentagevalue !== 0 && payType.ptdisgroup === false
      });
      let totalPercentage = 0 ;
      payTypesWithPercentages.forEach(item => {
        totalPercentage = totalPercentage + item.percentagevalue
      });
      if(totalPercentage > 0 && payTypesWithPercentages.length )
      {
        let rowsToAdd = [];
      if(RowData.selectedType === "Total")
      {
        payTypesWithPercentages.forEach(paytype => {
          let payTypePercentagePortion = paytype.percentagevalue/totalPercentage;
          let payTypeTotalValuePortion = RowData.fyTotal * payTypePercentagePortion;
          let perMonthValue = payTypeTotalValuePortion/12;
          let newRowUnformatted = {
            uniqueCombinationKey :  localState.entity.entityID + "-" + localState.department.departmentID + "-" + localState.jobcode.jobCodeID + "-" + paytype.paytypeID,
            dataid: null,
            entityid: localState.entity.entityID,
            entitycode: localState.entity.entityCode,
            entityname: localState.entity.entityName,
            departmentid: localState.department.departmentID,
            departmentcode: localState.department.departmentCode,
            departmentname: localState.department.departmentName,
            jobcodeid : localState.jobcode.jobCodeID ,
            jobcodecode : localState.jobcode.jobCodeCode,
            jobcodename : localState.jobcode.jobCodeName,
            paytypeid : paytype.paytypeID,
            paytypecode : paytype.paytypecode,
            paytypename : paytype.paytypename,
            january: perMonthValue,
            february: perMonthValue,
            march: perMonthValue,
            april: perMonthValue,
            may: perMonthValue,
            june: perMonthValue,
            july: perMonthValue,
            august: perMonthValue,
            september: perMonthValue,
            october: perMonthValue,
            november: perMonthValue,
            december: perMonthValue,
            scenariotypeID: scenarioType.itemTypeID, // currently save NULL in DB  , minor fix
            scenariotype: null,
            startyearid: 0,
            startyear: null,
            endyearid: 0,
            endyear: null,
            startmonthid: 0,
            startmonth: null,
            endmonthid: 0,
            endmonth: null,
            timeperiodid: timePeriod.itemTypeID, // currently save NULL in DB  , minor fix  
            staffingdatatype : staffingDataTypeID,
            staffingaccounttypeid : staffingDataTypeID     
          };
          rowsToAdd.push(newRowUnformatted);      
        });
        handleAddRowInTable(rowsToAdd);
      } else if(RowData.selectedType === "Months")
      {
        payTypesWithPercentages.forEach(paytype => {
          let payTypePercentagePortion = paytype.percentagevalue/totalPercentage;
          let newRowUnformatted = {
            uniqueCombinationKey :  localState.entity.entityID + "-" + localState.department.departmentID + "-" + localState.jobcode.jobCodeID + "-" + paytype.paytypeID,
            dataid: null,
            entityid: localState.entity.entityID,
            entitycode: localState.entity.entityCode,
            entityname: localState.entity.entityName,
            departmentid: localState.department.departmentID,
            departmentcode: localState.department.departmentCode,
            departmentname: localState.department.departmentName,
            jobcodeid : localState.jobcode.jobCodeID ,
            jobcodecode : localState.jobcode.jobCodeCode,
            jobcodename : localState.jobcode.jobCodeName,
            paytypeid : paytype.paytypeID,
            paytypecode : paytype.paytypecode,
            paytypename : paytype.paytypename,
            january: RowData.values.find((item) => item.month === "Jan")?.values * payTypePercentagePortion,
            february: RowData.values.find((item) => item.month === "Feb")?.values * payTypePercentagePortion,
            march: RowData.values.find((item) => item.month === "Mar")?.values * payTypePercentagePortion,
            april: RowData.values.find((item) => item.month === "Apr")?.values * payTypePercentagePortion,
            may: RowData.values.find((item) => item.month === "May")?.values * payTypePercentagePortion,
            june: RowData.values.find((item) => item.month === "Jun")?.values * payTypePercentagePortion,
            july: RowData.values.find((item) => item.month === "Jul")?.values * payTypePercentagePortion,
            august: RowData.values.find((item) => item.month === "Aug")?.values * payTypePercentagePortion,
            september: RowData.values.find((item) => item.month === "Sep")?.values * payTypePercentagePortion,
            october: RowData.values.find((item) => item.month === "Oct")?.values * payTypePercentagePortion,
            november: RowData.values.find((item) => item.month === "Nov")?.values * payTypePercentagePortion,
            december: RowData.values.find((item) => item.month === "Dec")?.values * payTypePercentagePortion,
            scenariotypeID: scenarioType.itemTypeID, // currently save NULL in DB  , minor fix
            scenariotype: null,
            startyearid: 0,
            startyear: null,
            endyearid: 0,
            endyear: null,
            startmonthid: 0,
            startmonth: null,
            endmonthid: 0,
            endmonth: null,
            timeperiodid: timePeriod.itemTypeID, // currently save NULL in DB  , minor fix   
            staffingdatatype : staffingDataTypeID,
            staffingaccounttypeid : staffingDataTypeID      
          };
          rowsToAdd.push(newRowUnformatted); 
        });
        handleAddRowInTable(rowsToAdd);
      }
      }
    }else
    {      
      let newRowUnformatted = {
      uniqueCombinationKey :  localState.entity.entityID + "-" + localState.department.departmentID + "-" + localState[localState.name][DataMapping[localState.name].id],
      dataid: null,
      entityid: localState.entity.entityID,
      entitycode: localState.entity.entityCode,
      entityname: localState.entity.entityName,
      departmentid: localState.department.departmentID,
      departmentcode: localState.department.departmentCode,
      departmentname: localState.department.departmentName,
      statisticsid: localState[localState.name][DataMapping[localState.name].id],
      statisticscode: localState[localState.name][DataMapping[localState.name].code],
      statisticsname: localState[localState.name][DataMapping[localState.name].name],
      glaccountid: localState[localState.name][DataMapping[localState.name].id],
      glaccountcode: localState[localState.name][DataMapping[localState.name].code],
      glaccountname: localState[localState.name][DataMapping[localState.name].name],
      january: RowData.values.find((item) => item.month === "Jan")?.values,
      february: RowData.values.find((item) => item.month === "Feb")?.values,
      march: RowData.values.find((item) => item.month === "Mar")?.values,
      april: RowData.values.find((item) => item.month === "Apr")?.values,
      may: RowData.values.find((item) => item.month === "May")?.values,
      june: RowData.values.find((item) => item.month === "Jun")?.values,
      july: RowData.values.find((item) => item.month === "Jul")?.values,
      august: RowData.values.find((item) => item.month === "Aug")?.values,
      september: RowData.values.find((item) => item.month === "Sep")?.values,
      october: RowData.values.find((item) => item.month === "Oct")?.values,
      november: RowData.values.find((item) => item.month === "Nov")?.values,
      december: RowData.values.find((item) => item.month === "Dec")?.values,
      scenariotypeID: scenarioType.itemTypeID, // currently save NULL in DB  , minor fix
      scenariotype: null,
      startyearid: 0,
      startyear: null,
      endyearid: 0,
      endyear: null,
      startmonthid: 0,
      startmonth: null,
      endmonthid: 0,
      endmonth: null,
      timeperiodid: timePeriod.itemTypeID, // currently save NULL in DB  , minor fix
    };
    handleAddRowInTable([newRowUnformatted]);
    }
    return true;
  };

  const handleResetForm = () => {
    setlocalState({
      ...localState,
      entityKey: parseInt(localState.entityKey + 1),
      departmentKey: parseInt(localState.departmentKey + 1),
      statisticsKey: parseInt(localState.statisticsKey + 1),
      RowCalculateKey: parseInt(localState.RowCalculateKey + 1),
      jobCodeKey: parseInt(localState.jobCodeKey + 1),
      payTypeKey: parseInt(localState.payTypeKey + 1),
      staffingDataTypeKey: parseInt(localState.staffingDataTypeKey + 1),
      entity: null,
      department: null,
      statistics: null,
      jobcode : null,
      payType : null,
      staffingDataType : {id : "Hours" , value : "Hours"}
    });
  }

  const handleStaffingDataTypeSelection = (item) => {
    setlocalState({...localState , staffingDataType : item ? item : {id : "Hours" , value : "Hours"}})
  }

  return localState.name ? (
   <>
    <FullScreenModal
     className={"add-statistics-row-modal"}
     iconDescription="Close"
     modalHeading="Add row"
     hasScrollingContent={true}
     onRequestClose={() => {
      handleAddRowModal(false);
     }}
     onRequestSubmit={() => {
      handleModalSubmit();
     }}
     onSecondarySubmit={() => {
      handleAddRowModal(false);
     }}
     open={isOpen}
     passiveModal={false}
     primaryButtonDisabled={localState.entity === null || localState.entity === undefined || localState.department === null || localState.department === undefined || localState[localState.name] === null || localState[localState.name] === undefined}
     primaryButtonText="Add row"
     secondaryButtonText="Cancel"
    >
      <div className="bx--row">
        <div className="bx--col-lg-4 entity-department-statistics-data-grid">
        <EntityDataGrid handleSelection={handleSelection} key={localState.entityKey} />
        </div>
        <div className="bx--col-lg-4 entity-department-statistics-data-grid">
        <DepartmentDataGrid handleSelection={handleSelection} key={localState.departmentKey} />
        </div>
        {scenarioType.itemTypeCode === "SF" ? (
        <div className="bx--col-lg-4 entity-department-statistics-data-grid">
          <JobCodeGrid handleSelection={handleSelection} key={localState.jobCodeKey} />
        </div>
        ) : (
          <div className="bx--col-lg-4 entity-department-statistics-data-grid">
          <ScenarioTypeDataGrid 
            ScenarioTypeGroupedGridData={localState.GroupedGridData} 
            handleSelection={handleSelection} 
            entity={localState.entity} 
            department={localState.department} 
            jobCode={localState.jobcode} 
            ScenarioData={ScenarioDataState.ScenarioData} 
            key={localState.statisticsKey} 
            name={localState.name} 
            headerName = {localState.headerName}
            />
          </div>
        )}
      </div>
     
      {scenarioType.itemTypeCode === "SF" ? (
       <>
        <br />
        <div className="bx--row">
          <div className="bx--col-lg-3 statistics-combo-container">
         {"Pay type distribution"}
         <br />
         <ComboBox
          id={"payTypesDropDown-" + localState.payTypeKey}
          className="single-select-combo-box"
          ariaLabel="Choose an item"
          direction="bottom"
          items={payTypeDropdownData}
          placeholder="Pay type"
          itemToString={(item) => (item ? item.code + " " + item.name : "")}
          selectedItem={localState.payType?.code ? payTypeDropdownData.find((item) => item.code === localState.payType?.code) : { code: "Choose one", name: "" }}
          onChange={(e) => handleSelection(e.selectedItem, "payType")}
         />
        </div>
        </div>
        <div className="bx--row">
          <div className="bx--col-lg-3 statistics-combo-container">
         {"Hours or Dollars"}
         <br />
         <ComboBox
          id={"staffingDataTypeDropDown-" + localState.staffingDataTypeKey}
          className="single-select-combo-box"
          ariaLabel="Choose an item"
          direction="bottom"
          items={staffingDataTypeDropDownData}
          placeholder="Hours or Dollars"
          itemToString={(item) => (item ? item.value : "")}
          selectedItem={localState.staffingDataType?.id ? staffingDataTypeDropDownData.find((item) => item.id === localState.staffingDataType?.id) : {id : "Hours" , value : "Hours"}}
          onChange={(e) => handleStaffingDataTypeSelection(e.selectedItem)}
         />
         </div>
        </div>
       </>
      ) : (
       ""
      )}
     

     <div className="bx--row">
      <div className="bx--col-lg-4">
       <Button id="btnCancle" kind="secondary" type="button" onClick={() => handleResetForm()}>
        Clear
       </Button>
      </div>
     </div>
     <RowCalculationGrid
      entity={localState.entity}
      department={localState.department}
      jobCode={localState.jobcode}
      scenarioTypeGridSelection={localState[localState.name]}
      timePeriod={timePeriod}
      ScenarioData={ScenarioDataState.ScenarioData}
      ref={addRowCalculationGridRef}
      key={localState.RowCalculateKey}
      name={localState.name}
      payTypeDistributionData={masterData.PayTypeDistributions}
     />
    </FullScreenModal>
   </>
  ) : null;
};
export default AddRowModal;
