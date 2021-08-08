import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  TooltipIcon,
  InlineNotification,
  InlineLoading
} from "carbon-components-react";
import {
  Favorite16,
  Save16,
  Checkmark16,
  Information16,
} from "@carbon/icons-react";
import PageHeader from "../../layout/PageHeader";
import ForecastSection from "./forecast-section";
import AddSubtractButtonSet from "./add-subtract-button-set";
import SaveAsForecastModal from "./save-as-forecast-modal";
import { updateForecast, refreshForecast } from "../../../core/_actions/ForecastActions";
import ForecastModal from "./forecast-modal";
import "./style.scss";
import { useHistory } from "react-router";
import { getApiResponseParams } from "../../../services/api/apiCallerGet";
import { SaveForecast } from "../../../services/forecast-service";
import {
  GetForecastModels,
  SaveForecastModel,
  UpdateForecastModel,
} from "../../../services/forecast-model-service";
import { ValidateForecast } from "./ValidateForecast";
import {
  transformBudgetVersionData,
  getEntityGroupedData,
  getDepartmentHierarchyGroupedData,
  getStatisticsGroupedData,
  getGLAccountHierarchyGroupedData,
  getJobCodeGroupedData,
  getPayTypeGroupedData
} from "../../../helpers/DataTransform/transformData";
import { getApiResponseAsync } from "../../../services/api/apiCallerGet";
import { SaveForecastMethodsHistory, GetForecastMethodsHistory } from "../../../services/forecast-history-service";
const Forecast = ({ match }) => {
  const initialLocalStates = {
    showForecastModal: false,
    showSaveAsModal: false,
    ForecastNotification: false,
    ForecastNotificationType: "success",
    ForecastNotificationTitle: "",
    saveAsForecastModalTitle: 'Save forecast model',
  };
  const state = useSelector((state) => state.ForecastReducer); // gloablState
  const [localState, SetlocalState] = useState(initialLocalStates);
  const budgetVersionData = useSelector((state) => state.BudgetVersions.list);
  const history = useHistory();
  const [scrollPosition, setPosition] = useState(0);

  const dispatch = useDispatch();
  const breadCrumb = [
    {
      text: "Budget versions",
      link: "/BudgetVersions/",
    },
    {
      text:
        state.forecast_budgetversion_code +
        " : " +
        state.forecast_budgetversion_name,
      link: "/BudgetVersions/",
    },
  ];

  const loadBudgetVersionData = async () => {
    // Load this Data For Populating the Dropdown and BV modal grid
    const apireq = await getApiResponseParams("BUDGETVERSIONSGRID");
    dispatch({ type: "FETCH_BUDGETVERSIONS", payload: apireq });
  };

  const masterData = useSelector((state) => state.MasterData);

  // useLayoutEffect(() => {
  //   function updatePosition() {
  //     setPosition(window.pageYOffset);
  //   }
  //   window.addEventListener('scroll', updatePosition);
  //   updatePosition();
  //   return () => window.removeEventListener('scroll', updatePosition);
  // }, []);

  useEffect(() => {
    if (match.params.id ? false : true) {
      history.push("/AddBudgetVersions");
    }
    // make it a async method to load all data from api response before further code execution.
    loadData();
  }, []);

  const loadData = async () =>
  {
    // Call Api here to load Forecast model Data and load it in store.
    await GetForecastModels().then((responseData) => {
      // GetBudgetVersionCodes().then(data=>{
      let queryParams = {
        BudgetversionID: match?.params?.id ? match?.params?.id : 0,
      };
      queryParams = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&')
      GetForecastMethodsHistory(queryParams).then(data => {
        dispatch(
          updateForecast({ ...state, forecastModelData: [...responseData], forcastMethodsHistory: data })
        );
      })
      // })
    });

    // Load Data in Store you further Use
    // Load Budget Version Data , to Populate related Dropdown.
    loadBudgetVersionData(); // Need to discuss this point , load data for now and save it in store
  }

  // useEffect(() => {
  //   //window.scroll(0, scrollPosition)
  // })

  useEffect(() => {
    // Find the Budget version from the store , to avoid the API call at Backend.
    let budgetVersionArray = transformBudgetVersionData(budgetVersionData, "LLLL");
    if (budgetVersionArray.length) {
      let budgetVersion = budgetVersionArray.find((item) => item.budgetVersionsID == match?.params?.id)
      if (budgetVersion) {
        dispatch(updateForecast(
          {
            ...state,
            forecast_budgetversion_code: budgetVersion.code,
            forecast_budgetversion_name: budgetVersion.description,
            forecast_budgetversion_comment: budgetVersion.comments,
            forecast_budgetversion_timePeriod_ID: budgetVersion.timeperiodobj.timePeriodID,
            forecast_budgetversion_scenario_type_ID: budgetVersion.scenarioTypeIDObj.itemTypeID,
            forecast_budgetversion_scenario_type: budgetVersion.scenarioTypeIDObj.itemTypeDisplayName,
            forecast_budgetversion_scenario_type_Code: budgetVersion.scenarioTypeIDObj.itemTypeCode
          }));
      }
    }
  }, [budgetVersionData])

  useEffect(() => () => {
    dispatch(
      refreshForecast({})
    );
  }, []);

   // Grouped Data States 
  const [entityGroupedData , setEntityGroupedData] = useState({data : []}) 
  const [statisticsGroupedData , setStatisticsGroupedData] = useState({data : []}) 
  const [departmentGroupedData , setDepartmentGroupedData] = useState({data : []})
  const [glAccountGroupedData , setGlAccountGroupedData] = useState({data : []})
  const [jobCodeGroupedData , setJobCodeGroupedData] = useState({data : []})
  const [payTypeGroupedData , setPayTypeGroupedData] = useState({data : []})
  const [allDimensionGroupedData , setallDimensionGroupedData] = useState({entityGroupedData : [],
        statisticsGroupedData : [],
        departmentGroupedData : [],
        glAccountGroupedData  : [],
        jobCodeGroupedData    : [],
        payTypeGroupedData    : []});
  
  // Process and get Grouped Data of Each Dimension
  useEffect(() => {
    if(masterData.Entites.length)
    {
      getApiResponseAsync("ENTITYRELATIONSHIPS").then((entityrelationData) => {
        getEntityGroupedData(masterData.Entites, entityrelationData).then((response)=>{
          setEntityGroupedData({...entityGroupedData , data : response})
        });
      });
    }
  } , [masterData.Entites]);

  useEffect(() => {
    if(masterData.Statistics.length)
    {
      getApiResponseAsync("STATISTICSRELATIONSHIPS").then((statisticsrelationData) => {
        // Add 'True' to include the mapped statistics in the final result set to show in the grid data.
        getStatisticsGroupedData(masterData.Statistics, statisticsrelationData , true).then((response)=>{
          setStatisticsGroupedData({...statisticsGroupedData , data : response})
        });
      });
    }
  } , [masterData.Statistics]);

  useEffect(() => {
    if(masterData.Departments.length)
    {
      getApiResponseAsync("DEPARTMENTSRELATIONSHIPS").then((departmentrelationData) => {
        getDepartmentHierarchyGroupedData(masterData.Departments, departmentrelationData).then((response)=>{
          setDepartmentGroupedData({...departmentGroupedData , data : response})
        });
      });
    }
  } , [masterData.Departments]);

  useEffect(() => {
    if(masterData.GLAccounts.length)
    {
      getApiResponseAsync("GLACCOUNTSRELATIONSHIPS").then((glRelationData) => {
        getGLAccountHierarchyGroupedData(masterData.GLAccounts, glRelationData).then((response)=>{
          setGlAccountGroupedData({...glAccountGroupedData , data : response})
        });
      });
    }
  } , [masterData.GLAccounts]);

  useEffect(() => {
    if(masterData.JobCodes.length)
    {
      getApiResponseAsync("JOBCODERELATIONSHIPS").then((jobCoderelationData) => {
        getJobCodeGroupedData(masterData.JobCodes, jobCoderelationData).then((response)=>{
          setJobCodeGroupedData({...jobCodeGroupedData , data : response})
        });
      });
    }
  } , [masterData.JobCodes]);

  useEffect(() => {
    if(masterData.PayTypes.length)
    {
      getApiResponseAsync("PAYTYPESRELATIONSHIPS").then((payTyperelationData) => {
        // add 'JSON.parse(JSON.stringify())' to prevent updates in redux store master data due to referencing.
        getPayTypeGroupedData(JSON.parse(JSON.stringify(masterData.PayTypes)), payTyperelationData).then((response)=>{
          setPayTypeGroupedData({...payTypeGroupedData , data : response})
        });
      });
    }
  } , [masterData.PayTypes]);

  useEffect(() => {
    setallDimensionGroupedData({
      entityGroupedData : entityGroupedData.data,
      statisticsGroupedData : statisticsGroupedData.data,
      departmentGroupedData : departmentGroupedData.data,
      glAccountGroupedData : glAccountGroupedData.data,
      jobCodeGroupedData : jobCodeGroupedData.data, 
      payTypeGroupedData :payTypeGroupedData.data
    })
  } ,[entityGroupedData ,statisticsGroupedData,departmentGroupedData,glAccountGroupedData,jobCodeGroupedData ,payTypeGroupedData])

  const handleCancelButton = async () => {
    // clear out the sections before bringing user back to budget page
    const apireq = await getApiResponseParams("BUDGETVERSIONSGRID");
    const budgetVersion = apireq.find(
      (req) => req.code === state.forecast_budgetversion_code
    );
    if (budgetVersion) {
      history.push(`/BudgetVersion/${budgetVersion.budgetVersionsID}`);
    }
    else {
      history.push("/BudgetVersions");
    }
  };

  const handleSaveClick = async () => {
    if (state.forecast_model_selected) {
      // Overwrite/update the currently selected modal and also Associate it with current budget version
      let modalDate = new Date();
      const updateForecastModal = {
        forecastModelID: state.forecast_model_Id,
        code: state.forecast_model_code,
        name: state.forecast_model_name,
        description: state.forecast_model_description,
        updatedDate: modalDate,
        asJson: JSON.stringify(state.forecastSections),
        isActive: true,
        isDeleted: false
      };
      const response = await UpdateForecastModel(updateForecastModal);
      if (response.response.status === 204) {
        // Need to update Modal Section also in the store , Here , currently only update in the DB
        const updatedModalData = [...state.forecastModelData];
        const modal = updatedModalData.filter(
          (el) => el.forecastModelID === state.forecast_model_Id
        );

        // only update if modal is it the store. otherwise no need to update it. it will fetch from DB whene page refresh.
        if (modal) {
          modal[0].asJson = JSON.stringify(state.forecastSections);
          modal[0].updatedDate = modalDate;
          const selectedModalindex = updatedModalData.indexOf(modal[0]);
          updatedModalData[selectedModalindex] = { ...modal[0] };
          dispatch(
            updateForecast({
              ...state,
              forecastModelData: [...updatedModalData],
            })
          );
        }

        SetlocalState({
          ForecastNotification: true,
          ForecastNotificationType: "success",
          ForecastNotificationTitle: "Forecast model saved.",
        });
      }
    } else {
      // open "Save As Forecast Modal" , and save the the modal as New One and also assiciate it with current budget version
      SetlocalState({ showSaveAsModal: true, saveAsForecastModalTitle: "Save forecast model" });
    }
  };

  const handleSaveForecastModel = async (forecastModalDetail) => {
    let code = state.forecast_budgetversion_scenario_type_Code;
    // Save in Data Base
    let modalDate = new Date();
    const forecastModal = {
      code: code, 
      // Code field is used to saved the BV scenario type.
      name: forecastModalDetail.name,
      description: forecastModalDetail.description,
      creationDate: modalDate, //"2020-05-14T20:52:51.366Z",
      updatedDate: modalDate,
      asJson: JSON.stringify(state.forecastSections),
      isActive: true,
      isDeleted: false
    };
    await SaveForecastModel(forecastModal).then((response) => {
      if (response.response.status === 201) {
        // Save in Store
        const newForecastModal = {
          forecastModelID: response.response.data.forecastModelID,
          code: code, 
          // Code field is used to saved the BV scenario type.
          name: forecastModalDetail.name,
          description: forecastModalDetail.description,
          updatedDate: modalDate,
          user: "",
          asJson: [...state.forecastSections],
        };
        const updatedModalData = [...state.forecastModelData];
        updatedModalData.push(newForecastModal);

        const updatedForecast = {
          forecast_model_Id: response.response.data.forecastModelID,
          forecast_model_code: code,
          forecast_model_name: forecastModalDetail.name,
          forecast_model_description: forecastModalDetail.discription,
          forecast_model_selected: true,
          forecastModelData: [...updatedModalData],
        };
        dispatch(updateForecast({ ...state, ...updatedForecast }));
        SetlocalState({
          ForecastNotification: true,
          ForecastNotificationType: "success",
          ForecastNotificationTitle: "Forecast model saved.",
        });
      } else {
        //Show error here
      }
    });
  };

  const handleSaveAsClick = () => {
    SetlocalState({ showSaveAsModal: true, saveAsForecastModalTitle: 'Save as forecast model' });
  };

  const handleModalClose = (modalCloseStateName) => {
    SetlocalState({ [modalCloseStateName]: false });
  };

  const handleModalOpen = (modalOpenStateName) => {
    SetlocalState({ [modalOpenStateName]: true });
  };

  const handleRunForecastClick = async (e) => {
    let includedSections = state.forecastSections.filter(
      (section) => section.included && section.forecastType !== "notSelected"
    );
    if (includedSections.length === 0) {
      SetlocalState({
        ForecastNotification: true,
        ForecastNotificationType: "error",
        ForecastNotificationTitle: "Include atleast one forecast method section",
      });
      return true;
    }

    //Validate Before Run Forecast
    if (handleForecastValidation()) {
      return true;
    }
    SetlocalState({ ForecastNotification: false });
    // clean up dataRow in the target property for Copy forecast types
    includedSections = includedSections.map((section) => {
      if (section.forecastType === "copy") {
        section.target.dataRow = [];
      }

      return section;
    });

    const newForecast = JSON.parse(JSON.stringify(state));
    newForecast.forecastSections = includedSections;

    // remove properties not needed for the API call
    delete newForecast.collapseAll;
    delete newForecast.forecastModelData;
    delete newForecast.forecast_model_selected;
    delete newForecast.forecast_model_Id;
    delete newForecast.forecast_model_code;
    delete newForecast.forecast_model_name;
    delete newForecast.forecast_model_description;
    delete newForecast.forecastModelData;
    delete newForecast.validateButton;
    delete newForecast.saveForecastButton;
    delete newForecast.saveAsForecastButton;
    delete newForecast.runForecastButton;
    delete newForecast.forcastMethodsHistory;
    // delete newForecast.BVCodes;

    if (newForecast.forecast_budgetversion_code === "" || newForecast.forecast_budgetversion_code === undefined ||
      newForecast.forecast_budgetversion_code === null) {
      SetlocalState({
        ForecastNotification: true,
        ForecastNotificationType: "error",
        ForecastNotificationTitle: "Something went wrong. Please refresh the page.",
      });
      return true;
    }
    let forcastMethods = [];
    for (let fs of newForecast.forecastSections) {
      if (!forcastMethods.find(fm => fm.method === fs.forecastType)) {
        forcastMethods.push({
          budgetVersionId: match.params.id,
          datascenarioType: newForecast.forecast_budgetversion_scenario_type_Code,
          formulaMethod: fs.forecastType,
          datascenarioTypeId: newForecast.forecast_budgetversion_scenario_type_ID,
          userId: '1',
          // isActive: true,
          // isDeleted: false
        })
      }
    }
    const response = await SaveForecast(newForecast);
    const forecastMethodHistoryRes = await SaveForecastMethodsHistory(JSON.stringify(forcastMethods))

    if (response.success) {
      // go to the budget page
      // const apireq = await getApiResponseParams("BUDGETVERSIONSGRID");
      // const budgetVersion = apireq.find(
      //   (req) => req.code === state.forecast_budgetversion_code
      // );
      //history.push(`/BudgetVersion/${match.params.id}`);
    
    
      // Redirect direct to th BV Grid Page
      history.push({
        pathname: '/BudgetVersions',
        state: { notification: "Forecasting" , notificationKind : "info" }
      });
    } else {
      // show an error message
      console.log("Run forecast Error", response.message);
      SetlocalState({
        ForecastNotification: true,
        ForecastNotificationType: "error",
        ForecastNotificationTitle: "Error in Forecast Running",
      });
    }
  };

  const handleForecastValidation = () => {
    const validationResultCount = ValidateForecast();
    if (validationResultCount > 0) {
      SetlocalState({
        ForecastNotification: true,
        ForecastNotificationType: "error",
        ForecastNotificationTitle: "Required values missing.",
      });
      return true;
    } else {
      SetlocalState({
        ForecastNotification: true,
        ForecastNotificationType: "success",
        ForecastNotificationTitle: "Validation successful.",
      });
      return false;
    }
  };

  const handleNotificationClose = () => {
    SetlocalState({
      ForecastNotification: false,
    });
  }

  return (
    (state && state.forecast_budgetversion_code) ?
      <>
        <div>
          <PageHeader
            heading={
              "Forecast " +
              state.forecast_budgetversion_code +
              " : " +
              state.forecast_budgetversion_name
            }
            icon={<Favorite16 />}
            breadCrumb={breadCrumb}
            notification={history?.location?.state?.notification}
          />

          <h4>
            <strong>Forecast methods</strong>
          </h4>
          <div className="bx--row">
            <div className="bx--col-lg-2 forecast-Model-Btn">
              <Button
                onClick={(e) => {
                  handleModalOpen("showForecastModal");
                }}
              >
                View forecast models
          </Button>
            </div>

            <div className="bx--col-lg-2" style={{ paddingLeft: '0' }}>
              <TooltipIcon
                direction="right"
                tooltipText="Select a previously saved set of completed forecast steps."
                align="center"
                className={"forecast-Model-Btn-icon"}
              >
                <Information16 />
              </TooltipIcon>
            </div>
          </div>

          <ForecastModal
            isOpen={localState.showForecastModal}
            handleModalClose={handleModalClose}
          />

          <SaveAsForecastModal
            isOpen={localState.showSaveAsModal}
            handleModalClose={handleModalClose}
            handleSave={handleSaveForecastModel}
            title={localState.saveAsForecastModalTitle}
          />

          {state.forecast_model_selected ? (
            <h4 className={"forecast-Model-heading"}>
              <strong>
                {state.forecast_model_name} {" model"}{" "}
              </strong>
            </h4>
          ) : null}

          {state.forecastSections.length && state.forecast_budgetversion_scenario_type_ID ? (
            <div className="bx--row">
              <div className="bx--col forecast-section-container">
                {state.forecastSections.map((section, sectionIndex) => {
                  return (

                    <ForecastSection
                      index={sectionIndex}
                      section={section}
                      GroupedDataState={allDimensionGroupedData}            
                    ></ForecastSection>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="bx--row">
            <div className="bx--col-lg-3">
              <AddSubtractButtonSet
                showAdd={true}
                showSubtract={false}
                index={-1} // -1 because it indicate to push tha element at the end of the array
              />
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col-md-8">
              {localState.ForecastNotification ? (
                <InlineNotification
                  title={localState.ForecastNotificationTitle}
                  kind={localState.ForecastNotificationType}
                  lowContrast={true}
                  notificationType="inline"
                  className="add-budgetversion-notification"
                  iconDescription="Close Notification"
                  onCloseButtonClick={(e) => handleNotificationClose()}
                />
              ) : (
                  ""
                )}
            </div>
            <div className="bx--col-lg">
              <Button
                id="btnCancle"
                kind="secondary"
                type="button"
                onClick={() => handleCancelButton()}
              >
                Cancel
          </Button>
              <Button kind="tertiary" type="button"
                onClick={(e) => {
                  handleForecastValidation();
                }}
                renderIcon={Checkmark16}
                disabled={state.validateButton.disabled}
              >
                Validate
          </Button>
              <Button
                kind="tertiary"
                type="button"
                disabled={!state.forecastSections.length}
                onClick={(e) => {
                  handleSaveClick(e);
                }}
                renderIcon={Save16}
              >
                Save forecast model
          </Button>
              <Button
                kind="tertiary"
                type="button"
                disabled={
                  !state.forecastSections.length || !state.forecast_model_selected
                }
                onClick={(e) => {
                  handleSaveAsClick(e);
                }}
              >
                Save as forecast model
          </Button>
              <Button
                kind="primary"
                type="button"
                onClick={(e) => {
                  handleRunForecastClick(e);
                }}
                disabled={state.runForecastButton.disabled}
              >
                Run forecast
          </Button>
            </div>
          </div>
        </div>
      </>
      : <InlineLoading description="Loading..." />
  );
};

export default Forecast;
