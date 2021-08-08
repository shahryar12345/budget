import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, DataTableSkeleton , InlineNotification, InlineLoading, RadioButtonGroup, RadioButton, DropdownSkeleton } from "carbon-components-react";
import { Favorite16, Save16 } from "@carbon/icons-react";
import PageHeader from "../../layout/PageHeader";
import { useHistory } from "react-router";
import { getApiResponseParams } from "../../../services/api/apiCallerGet";
import { GetBudgetVersionData, updateBudgetVersionData } from "../../../services/budget-version-service";
import { transformBudgetVersionData, 
  getEntityGroupedData, getDepartmentHierarchyGroupedData, GetSortedEntityByGroups, 
  GetSortedDepartmentByHierarchyGroupe, GetSortedJobCodeByGroups, getJobCodeGroupedData, 
  GetSortedPayTypeByGroups, getPayTypeGroupedData } from "../../../helpers/DataTransform/transformData";
import SingleSelectModal from "../../shared/single-select/single-select-with-modal";
import ManualWageRateGrid from "./manual-wage-rate-grid";
import { getApiResponseAsync } from "../../../services/api/apiCallerGet";

const ManualWageRate = ({ match }) => {
  const initialLocalStates = {
    showNotification: false,
    notificationKind: "",
    notificationTitle: "",
    buttonsdisabled: true,
    refreshData: true,
    wageRateRadioButtonSelection: "missing",
    entitySelected: "all",
    departmentSelected: "all",
    jobCodeSelected: "all",
    payTypeSelected: "all",
    entityDropdownKey: 100,
    departmentDropdownKey: 200,
    jobCodeDropdownKey: 300,
    payTypeDropdownKey: 400,
    manualWageRateDataGrid: 500,
    searchedData: {
      budgetVersion: [],
      entity: [],
      department: [],
      jobCode: [],
      payType: [],
    },
    orignalData: {
      budgetVersion: [],
      entity: [],
      department: [],
      jobCode: [],
      payType: [],
    },
    dimnesionDetails: {
      entity: {
        id: "entityID",
        name: "entityName",
        code: "entityCode",
      },
      department: {
        id: "departmentID",
        name: "departmentName",
        code: "departmentCode",
      },
      jobCode: {
        id: "jobCodeID",
        name: "jobCodeName",
        code: "jobCodeCode",
      },
      payType: {
        id: "payTypeID",
        name: "payTypeName",
        code: "payTypeCode",
      },
    },
  };
  const budgetversionStates = {
    budgetVersionCode: "",
    budgetVersionName: "",
  };
  
  const [localState, SetlocalState] = useState(initialLocalStates);
  const [localStateBudgetVersion, SetlocalStateBudgetVersion] = useState(budgetversionStates);

  const [staffingDataState, SetStaffingDataState] = useState({ allData: [], missingData: [], gridDataToShow: [] });
  const [dimensionDropdownDataState, SetDimensionDropdownDataState] = useState({ data: [] });
  const dimensionRelationshipData = useSelector((state) => state.MasterData.DimensionRelationships);
  const masterData = useSelector((state) => state.MasterData);
  const [gridLoadState ,setGridLoadState] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();
  const manualWageRateTableRef = useRef();

  const breadCrumb = [
    {
      text: "Budget versions",
      link: "/BudgetVersions/",
    },
    {
      text: localStateBudgetVersion.budgetVersionCode + " : " + localStateBudgetVersion.budgetVersionName,
      link: "/BudgetVersions/",
    },
  ];

  const dimensionDetails = {
    ENTITY:{
      id : "entityID"
    },
    DEPARTMENT : {
      id : "departmentID"
    },
    JOBCODE : {
      id : "jobCodeID"
    },
    PAYTYPE : {
      id : "payTypeID"
    },  
  }

  const loadBudgetVersionData = async () => {
    const apireq = await getApiResponseParams("BUDGETVERSIONSGRID");
    dispatch({ type: "FETCH_BUDGETVERSIONS", payload: apireq });
    console.log('apireq', apireq)
    let budgetVersionArray = transformBudgetVersionData(apireq, "LLLL");
    if (budgetVersionArray.length) {
      let budgetVersion = budgetVersionArray.find((item) => item.budgetVersionsID == match?.params?.id);
      if (budgetVersion) {
        SetlocalStateBudgetVersion({ ...localStateBudgetVersion, budgetVersionCode: budgetVersion.code, budgetVersionName: budgetVersion.description });
      }
    }
  };

  useEffect(() => {
    if (match.params.id ? false : true) {
      history.push("/BudgetVersions");
    }
    // Load Data in Store you further Use
    // Load Budget Version Data , to Populate related Dropdown.
    loadData();
  }, []);

  const loadData = async () => {
    await loadBudgetVersionData(); // Need to discuss this point , load data for now and save it in store
    await loadStaffingData();
  };

  const filterData = (orignalData) => {
    let hoursData = orignalData.filter((hoursRow) => {return (hoursRow.staffingdatatype === "Hours" || hoursRow.staffingaccounttypeid === 108)});
    let forecastedAverageWageRateData = orignalData.filter((FAWRow) => {return FAWRow.staffingdatatype === "Average Wage" });
    let finalResult = [];
    // First combine rows if both Hours and Forecasted Average Wage Record is available
    let hoursDataForLoop = [...hoursData];
    hoursDataForLoop.forEach((hourRow) => {
      // Find FWA Record for hour
      let fwaIndexFound = forecastedAverageWageRateData.findIndex((fwaItem) => {return fwaItem.entityid === hourRow.entityid 
        && fwaItem.departmentid === hourRow.departmentid 
        && fwaItem.jobcodeid === hourRow.jobcodeid 
        && fwaItem.paytypeid === hourRow.paytypeid 
        && fwaItem.staffingdatatype === "Average Wage"});
        // If fwa is available for this hours, then update the rowTotal in hours record to make it a single combined row to display in a grid.
        if(fwaIndexFound !== -1)
        {
          finalResult.push({
            ...hourRow,
            rowtotal : forecastedAverageWageRateData[fwaIndexFound].rowtotal,
            wagerateoverride : hourRow.wagerateoverride ?? forecastedAverageWageRateData[fwaIndexFound].wagerateoverride
          });
          // If FWA is found and combined with its hours combination , then remove it from the result set and no need to show it on display.
          forecastedAverageWageRateData.splice(fwaIndexFound , 1);
        }else
        {
          // If FWA combination of the hour is not available then show hours as it is.
          finalResult.push({
            ...hourRow,
          });
        }
    });

    // if thier is some FWA are available which does not have hours data, so display hours in those FWA record as blank '0.0'. 
    forecastedAverageWageRateData = forecastedAverageWageRateData.map((fwaRow) => {
      return {
        ...fwaRow,
        january : 0.0,
				february : 0.0,
				march : 0.0,
				april : 0.0,
				may : 0.0,
				june : 0.0,
				july : 0.0,
				august : 0.0,
				september : 0.0,
				october : 0.0,
				november : 0.0,
				december : 0.0,
      }
    });
    finalResult = [...finalResult , ...forecastedAverageWageRateData];
    return finalResult;
  }


  const loadStaffingData = async () => {
    let filteredData = [];
    await GetBudgetVersionData(match.params?.id, "SF")
      .then((response) => {
        if (response.data.length) {
          filteredData = filterData(response.data);
          let missingData = filteredData.filter((item) => {
            return (item.rowtotal === 0 || item.rowtotal === null) && (item.wagerateoverride === 0 || item.wagerateoverride === null);
          });
          SetStaffingDataState({
            ...staffingDataState,
            gridDataToShow: missingData,
            allData: filteredData,
            missingData: missingData,
          });
          SetlocalState({ ...localState, refreshData: !localState.refreshData });
        } else {
          SetStaffingDataState({
            ...staffingDataState,
            gridDataToShow: [],
            allData: [],
            missingData: [],
          });
          SetlocalState({ ...localState, refreshData: !localState.refreshData });
        }
        setGridLoadState(true);
      })
      .catch((err) => {
        console.error("Error in fetching staffing data");
      });
  };

  useEffect(() => {
    let fetchData = {
      entity: GetSortedEntityByGroups(masterData.Entites),
      department: GetSortedDepartmentByHierarchyGroupe(masterData.Departments),
      jobCode: GetSortedJobCodeByGroups(masterData.JobCodes),
      payType: GetSortedPayTypeByGroups(masterData.PayTypes),
    };
    SetDimensionDropdownDataState(fetchData);
    let searchedDataReturn = populateDropdowns(fetchData);
    SetlocalState({ ...localState, searchedData: JSON.parse(JSON.stringify(searchedDataReturn)), orignalData: JSON.parse(JSON.stringify(searchedDataReturn)) });
  }, [masterData]);

  const populateDropdowns = (dropdownsData) => {
    let searchedData = localState.searchedData;
    let dimnesionDetails = localState.dimnesionDetails;
    let dimensionNames = ["entity", "department", "jobCode", "payType"];

    for (let i = 0; i < dimensionNames.length; i++) {
      searchedData[dimensionNames[i]] = [
        {
          [dimnesionDetails[dimensionNames[i]].id]: "all",
          [dimnesionDetails[dimensionNames[i]].name]: "All",
          [dimnesionDetails[dimensionNames[i]].code]: "",
        },
        ...dropdownsData[dimensionNames[i]],
      ];
    }

    return searchedData;
  };

  const handleWageRateRadioButton = (value) => {
    let searchedData = populateDropdowns(dimensionDropdownDataState);
    let dropdownSelectedValue = "";
    if (value === "missing") {
      dropdownSelectedValue = "all";
    } else if (value === "all") {
      dropdownSelectedValue = "";
    }

    SetlocalState({
      ...localState,
      searchedData: searchedData,
      orignalData: searchedData,
      wageRateRadioButtonSelection: value,
      entitySelected: dropdownSelectedValue,
      departmentSelected: dropdownSelectedValue,
      jobCodeSelected: dropdownSelectedValue,
      payTypeSelected: dropdownSelectedValue,
      entityDropdownKey: parseInt(localState.entityDropdownKey + 1),
      departmentDropdownKey: parseInt(localState.departmentDropdownKey + 1),
      jobCodeDropdownKey: parseInt(localState.jobCodeDropdownKey + 1),
      payTypeDropdownKey: parseInt(localState.payTypeDropdownKey + 1),
      manualWageRateDataGrid: parseInt(localState.manualWageRateDataGrid + 1),
      refreshData: !localState.refreshData,
    });

    SetStaffingDataState({ ...staffingDataState, gridDataToShow: [] });
  };

  const handleDropdownChange = (value, dimensionName) => {
    SetlocalState({ ...localState, [dimensionName + "Selected"]: value });
  };

  const handleShowInTableClick = () => {
    let griddata = [];
    if (localState.wageRateRadioButtonSelection === "missing") {
      griddata = staffingDataState.missingData;
    } else {
      griddata = staffingDataState.allData;
    }
    if (localState.entitySelected !== "all" && localState.entitySelected !== "") {
      let selectedItemObj = masterData.Entites.find((item) => item.entityID === localState.entitySelected);
      if(selectedItemObj.isGroup)
      {
        let result = [];
        let childIDList = getDimensionChildList(localState.entitySelected , "ENTITY" , masterData.Entites);
        childIDList.forEach((childitem) => {
            result = [...result , ...griddata.filter((item) => {
            return item.entityid === childitem.entityID;
            })] 
        });
        griddata = [...result];
      }else
      {
        griddata = griddata.filter((item) => {
          return item.entityid === localState.entitySelected;
        });
      }
    }
    if (localState.departmentSelected !== "all" && localState.departmentSelected !== "") {
      let selectedItemObj = masterData.Departments.find((item) => item.departmentID === localState.departmentSelected);
      if(selectedItemObj.isGroup)
      {
        let result = [];
        let childIDList = getDimensionChildList(localState.departmentSelected , "DEPARTMENT" , masterData.Departments);
        childIDList.forEach((childitem) => {
            result = [...result , ...griddata.filter((item) => {
            return item.departmentid === childitem.departmentID;
            })] 
        });
        griddata = [...result];
      }else
      {
        griddata = griddata.filter((item) => {
          return item.departmentid === localState.departmentSelected;
        });
      }
    }
    if (localState.jobCodeSelected !== "all" && localState.jobCodeSelected !== "") {
      let selectedItemObj = masterData.JobCodes.find((item) => item.jobCodeID === localState.jobCodeSelected);
      if(selectedItemObj.isGroup)
      {
        let result = [];
        let childIDList = getDimensionChildList(localState.jobCodeSelected , "JOBCODE" , masterData.JobCodes);
        childIDList.forEach((childitem) => {
            result = [...result , ...griddata.filter((item) => {
            return item.jobcodeid === childitem.jobCodeID;
            })] 
        });
        griddata = [...result];
      }else
      {
        griddata = griddata.filter((item) => {
          return item.jobcodeid === localState.jobCodeSelected;
        });
      }
    }
    if (localState.payTypeSelected !== "all" && localState.payTypeSelected !== "") {
      let selectedItemObj = masterData.PayTypes.find((item) => item.payTypeID === localState.payTypeSelected);
      if(selectedItemObj.isGroup)
      {
        let result = [];
        let childIDList = getDimensionChildList(localState.payTypeSelected , "PAYTYPE" , masterData.PayTypes);
        childIDList.forEach((childitem) => {
            result = [...result , ...griddata.filter((item) => {
            return item.paytypeid === childitem.payTypeID;
            })] 
        });
        griddata = [...result];
      }else
      {
        griddata = griddata.filter((item) => {
        return item.paytypeid === localState.payTypeSelected;
        });
      }
    }
    SetStaffingDataState({ ...staffingDataState, gridDataToShow: [...griddata] });
    SetlocalState({ ...localState, refreshData: !localState.refreshData });
  };

  const getDimensionChildList = (selectedValueId , dimensionType , dimensionSourceData) => {
    let childList = [];
    
    let relationships = dimensionRelationshipData.filter((relationships) => {
      return relationships.parentid === selectedValueId && (relationships.relation === "GROUP" || relationships.relation === "HIERARCHY")  
      && relationships.model === dimensionType
    }); 
    relationships.forEach((relationship) => {
      let child = dimensionSourceData.find((data) => {return data[dimensionDetails[dimensionType].id] === relationship.childid})
      if(child.isGroup)
      {
        childList = [...childList , ...getDimensionChildList(child[dimensionDetails[dimensionType].id] , dimensionType , dimensionSourceData)]
      }
      else
      {
        childList = [...childList , child]
      }       
  });
  return [...childList];
  }
  const handleCancelButton = () => {
    history.push("/BudgetVersion/" + match.params.id);
  };

  const handleSave = async (actionType) => {
    const changedRows = manualWageRateTableRef.current.getChangedRows();
    if (changedRows.length) {
      await updateBudgetVersionData(changedRows, "SF", true);
    }
    SetlocalState({ ...localState, showNotification: true, notificationKind: "success", notificationTitle: "Wage rate saved." });
    if (actionType === "saveAndClose") {
      history.push("/BudgetVersion/" + match.params.id, { notification: "Wage rate saved." });
    }
  };

  const handleNotificationClose = () => {
    SetlocalState({ ...localState, showNotification: false });
  };

  const buttonDisabledHandler = (value) => {
    SetlocalState({ ...localState, buttonsdisabled: value });
  };

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

  return localStateBudgetVersion && localStateBudgetVersion.budgetVersionCode ? (
    <>
      <div>
        <PageHeader heading={"Wage rate " + localStateBudgetVersion.budgetVersionCode + " : " + localStateBudgetVersion.budgetVersionName} icon={<Favorite16 />} breadCrumb={breadCrumb} notification={history?.location?.state?.notification} />
      </div>

      <div className="bx--row">
        <div className="bx--col-lg-10">
          {"Show"}
          <RadioButtonGroup id="rd_wageRateSelection" defaultSelected={"missing"} orientation="vertical">
            <RadioButton id="rd_missingWageRate" value="missing" labelText="Missing wage rates" onClick={(e) => handleWageRateRadioButton("missing")} />
            <RadioButton id="rd_allWageRate" value="all" labelText="All wage rates" onClick={(e) => handleWageRateRadioButton("all")} />
          </RadioButtonGroup>{" "}
        </div>
      </div>

      <br />
      <br />

      <div className="bx--row">
        <div className="bx--col-lg-3">{"Entity"}</div>
        <div className="bx--col-lg-3">{"Department"}</div>
        <div className="bx--col-lg-3">{"Job code"}</div>
        <div className="bx--col-lg-3">{"Pay type"}</div>
      </div>

      <div className="bx--row">
        <div className="bx--col-lg-3">
          {localState.searchedData.entity.length ? (
            <SingleSelectModal
              id={"entitiesDropDown-manual-wage-rate"}
              key={localState.entityDropdownKey}
              data={localState.searchedData.entity}
              gridData={entityGridDataStates}
              placeholder="Choose one"
              name="Entity"
              itemToString={(item) => (item ? item.entityCode + " " + item.entityName : "")}
              itemToElement={(item) =>
                item.isGroup ? (
                  <span>
                    {" "}
                    <strong>
                      {" "}
                      {"*"} {item.entityCode + " " + item.entityName}
                    </strong>
                  </span>
                ) : (
                    <span> {item.entityCode + " " + item.entityName}</span>
                  )
              }
              selectedItem={localState.searchedData.entity.find((item) => item.entityID === localState.entitySelected)}
              onChange={(e) => handleDropdownChange(e.selectedItem ? e.selectedItem.entityID : "", "entity")}
              hideGroupsToggle={true}
              hideGroups={false}
              isGroupedData={true}
            />
          ) : (
              <DropdownSkeleton />
            )}
        </div>
        <div className="bx--col-lg-3">
          {departmentGroupGridDataStates.length ? <SingleSelectModal
            id={"DepartmentDropDown-manual-wage-rate"}
            key={localState.departmentDropdownKey}
            data={localState.searchedData.department}
            gridData={departmentGroupGridDataStates}
            placeholder="Choose one"
            name="Department"
            itemToString={(item) => (item ? item.departmentCode + " " + item.departmentName : "")}
            itemToElement={(item) =>
              item.isGroup || item.isHierarchy ? (
                <span>
                  {" "}
                  <strong>
                    {" "}
                    {"*"} {item.departmentCode + " " + item.departmentName}
                  </strong>
                </span>
              ) : (
                  <span> {item.departmentCode + " " + item.departmentName}</span>
                )
            }
            selectedItem={localState.orignalData.department.find((item) => item.departmentID === localState.departmentSelected)}
            onChange={(e) => handleDropdownChange(e.selectedItem ? e.selectedItem.departmentID : "", "department")}
            hideGroupsToggle={true}
            hideGroups={false}
            isGroupedData={true}
          /> : <DropdownSkeleton />}
        </div>
        <div className="bx--col-lg-3">
          <SingleSelectModal
            id={"JobCodeDropDown-manual-wage-rate"}
            key={localState.jobCodeDropdownKey}
            data={localState.searchedData.jobCode}
            gridData={jobCodeGridDataStates}
            placeholder="Choose one"
            name="jobCode"
            modalHeading="Job code"
            itemToString={(item) => (item ? item.jobCodeCode + " " + item.jobCodeName : "")}
            light={false}
            itemToElement={(item) =>
              item.isGroup ? (
                <span>
                  {" "}
                  <strong>
                    {" "}
                    {"*"} {item.jobCodeCode + " " + item.jobCodeName}
                  </strong>
                </span>
              ) : (
                  <span> {item.jobCodeCode + " " + item.jobCodeName}</span>
                )
            }
            selectedItem={localState.orignalData.jobCode.find((item) => item.jobCodeID === localState.jobCodeSelected)}
            onChange={(e) => handleDropdownChange(e.selectedItem ? e.selectedItem.jobCodeID : "", "jobCode")}
            hideGroupsToggle={true}
            hideGroups={false}
            isGroupedData={true}
          />
        </div>
        <div className="bx--col-lg-3">
          <SingleSelectModal
            id={"payTypesDropDown-manual-wage-rate"}
            key={localState.payTypeDropdownKey}
            data={localState.searchedData.payType}
            gridData={payTypeGridDataStates}
            placeholder="Choose one"
            name="payType"
            modalHeading="Pay type"
            itemToString={(item) => (item ? item.payTypeCode + " " + item.payTypeName : "")}
            light={false}
            itemToElement={(item) =>
              item.isGroup ? (
                <span>
                  {" "}
                  <strong>
                    {" "}
                    {"*"} {item.payTypeCode + " " + item.payTypeName}
                  </strong>
                </span>
              ) : (
                  <span> {item.payTypeCode + " " + item.payTypeName}</span>
                )
            }
            selectedItem={localState.orignalData.payType.find((item) => item.payTypeID === localState.payTypeSelected)}
            onChange={(e) => handleDropdownChange(e.selectedItem ? e.selectedItem.payTypeID : "", "payType")}
            hideGroupsToggle={true}
            hideGroups={false}
            isGroupedData={true}
          />
        </div>
      </div>

      <div className="bx--row">
        <div className="bx--col-lg-7">
          <Button
            onClick={(e) => {
              handleShowInTableClick();
            }}
            disabled={!localState.entitySelected && !localState.departmentSelected && !localState.jobCodeSelected && !localState.payTypeSelected}
          >
            Show in table
     </Button>
        </div>
      </div>

      <br />
      <br />
      <br />

      <div className="bx--row">
        <div className="bx--col-lg">
        { gridLoadState ?  <ManualWageRateGrid key={localState.manualWageRateDataGrid} dataRow={[...staffingDataState.gridDataToShow]} ref={manualWageRateTableRef} buttonDisabledHandler={buttonDisabledHandler} refreshData={localState.refreshData} />
        : <DataTableSkeleton columnCount={5} compact={false} rowCount={10} zebra={false} />
        }
        </div>
      </div>

      <div className={"bx--row"}>
        <div className="bx--col-md-8">
          {localState.showNotification ? (
            <InlineNotification kind={localState.notificationKind} title={localState.notificationTitle} lowContrast={true} notificationType="inline" className="add-budgetversion-notification" iconDescription="Close Notification" onCloseButtonClick={(e) => handleNotificationClose()} />
          ) : (
              <>
                {" "}
                <br /> <br />{" "}
              </>
            )}
        </div>
        <div className={"bx--col-lg"}>
          <Button id="btnCancle" kind="secondary" type="button" onClick={() => handleCancelButton()}>
            Cancel
     </Button>
          <Button
            kind="tertiary"
            type="button"
            onClick={(e) => {
              handleSave("save");
            }}
            renderIcon={Save16}
            disabled={localState.buttonsdisabled}
          >
            Save
     </Button>
          <Button
            kind="primary"
            type="button"
            onClick={(e) => {
              handleSave("saveAndClose");
            }}
            disabled={localState.buttonsdisabled}
          >
            Save and close
     </Button>
        </div>
      </div>
    </>
  ) : (
      <InlineLoading description="Loading..." />
    );
};

export default ManualWageRate;
