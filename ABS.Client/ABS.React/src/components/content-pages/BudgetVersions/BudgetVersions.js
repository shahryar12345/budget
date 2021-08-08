import React, { useEffect, useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import PageHeader from "../../layout/PageHeader";
import PageFooter from "../../layout/PageFooter";
import DTTable from "./DataGrid";
import createHistory from 'history/createBrowserHistory'
import { GetInitalData, saveBudgetVersionData, SaveBudgetVersion, GetBudgetVersionData, StartBudgetVersionCalculation } from '../../../services/budget-version-service'
import {
  addBudgetVersions,
  deleteBudgetVersions,
  fetchBudgetVersions,
  changeBudgetVersions,
  copyBudgetVersions,
  resetBudgetVersions,
} from "../../../core/_actions/BudgetVersionsActions";
import { InlineLoading, TextInput, Dropdown, TooltipIcon, Select, SelectItem, SelectItemGroup, InlineNotification } from "carbon-components-react";
import { Favorite16, Information20 } from "@carbon/icons-react";
import FullScreenModal from "../../shared/budget-versions-modal/full-screen-modal";

function BudgetVersions({
  count,
  changeBudgetVersions,
  copyBudgetVersions,
  deleteBudgetVersions,
  fetchBudgetVersions,
  location,
}) {
  let isLoaded = useSelector((state) => state.BudgetVersions.isLoaded);
  console.log(isLoaded);

  const dispatch = useDispatch();

  const initialState = {
    showDeleteConfirmation: false,
    IDs: [],
    showCopyModal: false,
    budgetVersionsID: '',
    copyBudgetVersionCode: '',
    copyBudgetVersionName: '',
    copyBudgetVersionDescription: '',
    copyBudgetVersionTimePerioID: '',
    copyBudgetVersionTypeID: '',
    copyBudgetVersionTypeInstance: {},
    versionData: [],
    codeIsInvalid: false,
    stateData: [],//Bug fix : ABS-378, SS,
    codeList: [],
    isRefresh: false
  };
  const initialCalculationStates = {
    setCalculatingStatus: false,
    selectedRow: []
  }
  const initialnotificationState = {
    title: "Calculation started...",
    showNotification: false,
    kind: "success"
  }
  const [state, setLocalState] = useState(initialState); // local component States
  const [calculationState, setCalculationState] = useState(initialCalculationStates); // local component States
  const [notificationState, setNotificationState] = useState(initialnotificationState); // local component States
  const initialDropdownState = {
    fiscalYears: [],
    budgetVersionTypes: [],
    scenarioTypes: [],
    statisticsData: [],
    generalLedgerData: [],
    staffingData: [],
    timePeriodID: 0,
  }
  const budgetVersionData = useSelector((state) => state.BudgetVersions);
  const [dropdownDataState, setDropdownDataState] = useState(initialDropdownState);
  const userDetails = useSelector((state) => state.UserDetails);

  const ChangeBV = (e) => {
    changeBudgetVersions({ actionsource: e });
  };

  const deletebudgetVersion = (e) => {
    // show confirmation dialog
    setLocalState({ ...state, showDeleteConfirmation: true, IDs: e });
  };

  const copyBV = (e, bv) => {
    // get the name and code for the budget version being copied and put into state    
    // console.log(budgetVersionData)
    // const bv = Object.values(budgetVersionData).find(budgetVersion => budgetVersion.budgetVersionsID === e);

    if (bv) {
      let updatLocalState = { ...state, showCopyModal: true, budgetVersionsID: e, copyBudgetVersionCode: bv.code, copyBudgetVersionName: bv.description, copyBudgetVersionDescription: bv.comments, copyBudgetVersionTypeID: bv.budgetVersionTypeIDOBj.ItemTypeID, copyBudgetVersionTimePerioID: bv.timeperiodobj.TimePeriodID }

      // GetInitalData(e).then(([fiscalYearsRes, budgetVersionTypesRes, scenarioTypesRes, statsDataRes, generalLedgerDataRes, staffingDataRes, conditionalResponse]) => {
      GetInitalData(e).then(([fiscalYearsRes, budgetVersionTypesRes, scenarioTypesRes, statsDataRes, conditionalResponse, codeList]) => {
        let timePeriodID = 0;
        // if (conditionalResponse.success) {
        timePeriodID = conditionalResponse.data.timePeriodID.timePeriodID;
        // }
        // Use to get Statistics Data, Bug fix : ABS-378, SS
        const existingBudgetVersion = conditionalResponse;
        setDropdownDataState({
          fiscalYears: fiscalYearsRes.data,
          budgetVersionTypes: budgetVersionTypesRes.data,
          scenarioTypes: scenarioTypesRes.data,
          statisticsData: statsDataRes.statistics,
          generalLedgerData: statsDataRes.gl,
          staffingData: statsDataRes.staffing,
          timePeriodID
        });

        // GetBudgetVersionData(e, existingBudgetVersion.data.scenarioTypeID.itemTypeCode).then(statisticsTableDataResponse => {
        // Use to get Statistics Data of the source BV for copying, Bug fix : ABS-378, SS
        updatLocalState = { ...updatLocalState, stateData: [], codeList }
        setTimeout(() => {
          setLocalState({ ...updatLocalState });
        }, 500)
        // })
      });
    }
  };

  const loadBudgetVersions = (e) => {
    if (!isLoaded) {
      // there is a race condition here when copying so set a timeout for 100 ms.
      setTimeout(function () {
        fetchBudgetVersions();
      }, 100);
    }
  };

  const calculateBV = async (e) => {
    setCalculationState({ ...state, setCalculatingStatus: !calculationState.setCalculatingStatus, selectedRow: [...e] })
    await StartBudgetVersionCalculation(e[0].id).then((response) => {
      // If somthing need to do after getting response, do it here. 
    })
  }

  useEffect(() => {
    //loadBudgetVersions();
  });

  // This code is used to handle the notification issue. Issue : Notification remain displayed even on page refreshed, now its resolved.
  useEffect(() => {
    const history = createHistory();
    if (history.location.state && history.location.state.notification) {
      let state = { ...history.location.state };
      delete state.notification;
      if (state.notificationKind) {
        delete state.notificationKind;
      }
      history.replace({ ...history.location, state });
    }
  }, []);

  const resetNotification = () => {
    location.showNotification = false;
  };

  const handleCopyClose = () => {
    setLocalState({ ...state, showCopyModal: false, budgetVersionsID: '', copyBudgetVersionCode: '', copyBudgetVersionDescription: '', copyBudgetVersionTimePerioID: '', copyBudgetVersionTypeID: '' });
  }

  const handleCodeChange = e => {
    const { value } = e.target;

    validateBudgetCode(value);
  };

  const getCurrentBudgetVersionType = () => {
    // set the budget version type (actual, forecast)
    const bvType = dropdownDataState.budgetVersionTypes.find(type => {
      return type.itemTypeID === state.copyBudgetVersionTypeID
    });

    if (bvType) {
      return bvType
    }

    return {
      itemDataType: "",
      itemTypeDisplayName: "",
      itemTypeCode: "",
      itemTypeID: "",
      itemTypeKeyword: "",
      itemTypeValue: ""
    }

  }

  const validateBudgetCode = code => {
    if (state?.codeList.length) {
      // validate the new code
      const existingBudget = state.codeList.find(budgetCode => budgetCode === code);
      if (existingBudget || !code) {
        // throw validation error      
        setLocalState({ ...state, codeIsInvalid: true });
        return true;
      }
      else {
        setLocalState({ ...state, copyBudgetVersionCode: code, codeIsInvalid: false });
        return false;
      }
    }
  }

  const handleCopyDescriptionChange = e => {
    const { value } = e.target;
    setLocalState({ ...state, copyBudgetVersionDescription: value });
  };

  const handleCopyNameChange = e => {
    const { value } = e.target;
    setLocalState({ ...state, copyBudgetVersionName: value });
  }

  const handleCopyFiscalYearChange = e => {
    const { selectedItem } = e;
    setLocalState({ ...state, copyBudgetVersionTimePerioID: selectedItem.itemTypeID });
  }

  const handleCopyTypeChange = e => {
    const { selectedItem } = e;
    setLocalState({ ...state, copyBudgetVersionTypeID: selectedItem.itemTypeID });
  }

  const handleCopy = async () => {
    // validate the code here incase the user never changed it
    const codeIsInvalid = validateBudgetCode(state.copyBudgetVersionCode);

    if (!codeIsInvalid) {
      // change the code , remove the redux store dependency, Because need Copied BV ID here to copy its the statistics.
      //Bug fix : ABS-378, SS
      let copyBv = {
        budgetVersionsID: state.budgetVersionsID,
        code: state.copyBudgetVersionCode,
        description: state.copyBudgetVersionName,
        comments: state.copyBudgetVersionDescription,
        budgetVersionTypeID: state.copyBudgetVersionTypeID,
        timePeriodID: state.copyBudgetVersionTimePerioID,
        actionType: "COPY",
        budgetVersionsData: state.budgetVersionsID,
        UserAuthenticated: true,
        UserID: 1,
        updateddate: new Date()
      }
      const response = await SaveBudgetVersion(copyBv);
      if (response.success) {
        // Copy statistic of Budget version as well , with seleted timeperiod
        //Bug fix : ABS-378, SS
        // let updatedStates = [];
        // state.stateData.forEach(item => {
        //   updatedStates.push({
        //     ...item,
        //     budgetVersionId: response.payload,
        //     timeperiodid: state.copyBudgetVersionTimePerioID
        //   })
        // })
        // if (updatedStates.length) {
        //   await saveBudgetVersionData(updatedStates, state.scenarioTypeID.itemTypeCode)
        // }
        setLocalState({ ...state, showCopyModal: false, IDs: state.IDs, isRefresh: true });
        setNotificationState({
          title: "Budget Version Copied",
          showNotification: true,
          kind: "success"
        })
      }
    }
  }

  const getCurrentBudgetVersionFiscalYear = e => {
    const selectedFiscalYear = dropdownDataState.fiscalYears.find(fy => fy.itemTypeID === state.copyBudgetVersionTimePerioID);
    return selectedFiscalYear;
  }

  const toggleIsRefresh = (bool) => {
    if (state.isRefresh !== bool) setLocalState({ ...state, isRefresh: bool });
  }

  const closeCalculationNotification = () => {
    setNotificationState({ ...notificationState, showNotification: false })
  }
  const showCalculationNotification = () => {
    setNotificationState({ ...notificationState, showNotification: true })
  }

  // if (!isLoaded)
  //   return (
  //     <InlineLoading
  //       className=".bx--inline-loading__text"
  //       description="Loading data..."
  //     />
  //   );
  // else

  console.log({ userDetails })

  // const modifyMenuItemsJSON = (menuItems) => {
  //   return menuItems.map(data => {
  //     return {
  //       "Screens": {
  //         "code": data.parentId ? menuItems.find(dt => dt.id === data.parentId)?.name : null,
  //         "name": data.name,
  //         "description": data.fullName,
  //         // "parentId": data.parentId,
  //         value: data.value
  //       },
  //       "actionsPermission": data?.actionsPermission ? data?.actionsPermission : []
  //     }
  //   })
  // }
  const { budgetVersionsListAP } = userDetails;

  return (
    <>{budgetVersionsListAP?.View ? <div>
      <PageHeader
        heading="Budget versions"
        icon={<Favorite16 />}
        breadCrumb={[
          {
            text: "Budget versions",
            link: "/BudgetVersions",
          }
        ]}
        notification={location?.state?.notification}
        notificationKind={location?.state?.notificationKind} />

      {notificationState.showNotification ?
        <InlineNotification title={notificationState.title}
          kind={notificationState.kind} lowContrast='true' onCloseButtonClick={(e) => { closeCalculationNotification() }} notificationType='inline' className='add-budgetversion-notification' />
        : null}
      <DTTable
        parentState={state}
        onDelete={deletebudgetVersion}
        onCopy={copyBV}
        actionsource={ChangeBV}
        onCalculation={calculateBV}
        setCalculatingStatus={calculationState.setCalculatingStatus}
        selectedRow={calculationState.selectedRow}
        showCalculationNotification={showCalculationNotification}
        isRefresh={state.isRefresh}
        toggleIsRefresh={toggleIsRefresh}
      />

      <FullScreenModal
        open={state.showDeleteConfirmation}
        className="budget-version-delete-modal"
        hasScrollingContent={false}
        iconDescription="Close"
        modalAriaLabel="Are you sure you want to delete the selected item(s)?"
        modalHeading="Delete confirmation"
        onRequestClose={() => {
          setLocalState({ ...state, showDeleteConfirmation: false, IDs: state.IDs });
        }}
        onRequestSubmit={() => {
          deleteBudgetVersions(state.IDs);
          // close the confirmation dialog and clear out the selected IDs
          setTimeout(() => {
            setLocalState({ ...state, showDeleteConfirmation: false, IDs: [] });
          }, 800);
        }}
        onSecondarySubmit={() => {
          setLocalState({ ...state, showDeleteConfirmation: false, IDs: state.IDs });
        }}
        passiveModal={false}
        primaryButtonDisabled={false}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        size='xs'
      >
        <p className="bx--modal-content__text single-line-text">
          Are you sure you want to delete the selected item(s)?
            <br />
          <br />
            You cannot recover a deleted item.
          </p>
      </FullScreenModal>

      <FullScreenModal
        className="budget-version-copy-modal"
        open={state.showCopyModal}
        hasScrollingContent={false}
        iconDescription="Close"
        modalAriaLabel="Copy an existing budget version"
        modalHeading="Copy"
        onRequestClose={handleCopyClose}
        onRequestSubmit={handleCopy}
        onSecondarySubmit={handleCopyClose}
        passiveModal={false}
        primaryButtonDisabled={false}
        primaryButtonText="Copy"
        secondaryButtonText="Cancel"
      >

        <div className="bx--grid">
          <div className="bx--row">
            <div className="bx--col">
              Change the <em>Code</em> for the copied budget version.
                </div>
          </div>
          <div className="bx--row">
            <div className="bx--col">
              <TextInput
                id="code"
                type="text"
                invalid={state.codeIsInvalid}
                invalidText="Code already used. Enter a unique code."
                labelText="Code"
                onChange={handleCodeChange}
                defaultValue={state.copyBudgetVersionCode}
              />
            </div>
            <div className="bx--col">
              <TextInput
                id="name"
                type="text"
                labelText="Name "
                value={state.copyBudgetVersionName}
                onChange={handleCopyNameChange}
              />
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col">
              <TextInput
                id="description"
                type="text"
                labelText="Description "
                onChange={handleCopyDescriptionChange}
                value={state.copyBudgetVersionDescription}
              />
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col">
              <Dropdown
                type="default"
                titleText="Fiscal year "
                onChange={handleCopyFiscalYearChange}
                items={dropdownDataState.fiscalYears}
                itemToString={(item) => (item ? item.itemTypeTimePeriodName : '')}
                selectedItem={getCurrentBudgetVersionFiscalYear()}
              />
            </div>
            <div className="bx--col">

              <Dropdown
                type="default"
                titleText="Budget version type"
                onChange={handleCopyTypeChange}
                items={dropdownDataState.budgetVersionTypes}
                itemToString={(item) => (item ? item.itemTypeValue : '')}
                selectedItem={getCurrentBudgetVersionType()}
                disabled
              />

            </div>
            <div className="bx--col-sm-">
              <br />
              <TooltipIcon direction="bottom" tooltipText="After you save a budget version, you cannot change the Budget version type">
                <Information20 className="textbox-icon" />
              </TooltipIcon>

            </div>
          </div>
        </div>
      </FullScreenModal>
      {/* <button onClick={deleteBudgetVersions}>-</button>
      <span>{count}</span>
      <button onClick={addBudgetVersions}>+</button> */}
    </div> : ""}
    </>
  );
}

const mapStateToProps = (state) => ({
  BudgetVersions: state.count,
});

const mapDispatchToProps = {
  addBudgetVersions,
  deleteBudgetVersions,
  fetchBudgetVersions,
  copyBudgetVersions,
  changeBudgetVersions,
};

export default connect(mapStateToProps, mapDispatchToProps)(BudgetVersions);


