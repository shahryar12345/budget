import React, { useEffect, useState, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageHeader from "../../layout/PageHeader";
import { useHistory } from "react-router";
import { getApiResponseParams } from "../../../services/api/apiCallerGet";
import { Add20, Subtract20 } from "@carbon/icons-react";
import RaisesSection from './raises-section';
import RaisesTable from './raises-table';
import { PostRaises, GetRaisesByBudgetVersionID } from "../../../services/raises-service";

import {
  Favorite16,
  Save16,
  Checkmark16,
  Information16,
} from "@carbon/icons-react";
import {
  Button,
  TooltipIcon,
  InlineNotification,
  InlineLoading,
  Accordion,
  AccordionItem
} from "carbon-components-react";
import FullScreenModal from "../../shared/budget-versions-modal/full-screen-modal";

const getInitialSetting = () => {
  return {
    entityID: '',
    entityCode: '',
    entityName: '',
    departmentID: '',
    departmentCode: '',
    departmentName: '',
    jobCodeID: '',
    jobCodeCode: '',
    jobCodeName: '',
    payTypeID: '',
    payTypeCode: '',
    payTypeName: '',
    percentChange: 0,
    startDate: null,
    endDate: null
  };

}

const Raises = (match) => {
  const history = useHistory();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dispatch = useDispatch();
  const [localState, SetlocalState] = useState({ budgetVersion: {}, raiseSettings: [], raisesTable: [], showSavedNotification: false, isSomethingChange: false, openUnsaveModal: false });
  const [raisesState, SetRaisesState] = useState({ initialData: [] });
  const [initialState, SetInitalState] = useState({ getRaisesCalled: false });
  const budgetVersionData = useSelector((state) => state.BudgetVersions.list);

  const breadCrumb = [
    {
      text: "Budget versions",
      link: "/BudgetVersions/",
    },
    {
      text:
        localState.budgetVersion.code +
        " : " +
        localState.budgetVersion.description,
      link: "/BudgetVersions/",
    },
  ];

  const loadBudgetVersionData = async () => {
    // Load this Data For Populating the Dropdown and BV modal grid
    const apireq = await getApiResponseParams("BUDGETVERSIONSGRID");
    dispatch({ type: "FETCH_BUDGETVERSIONS", payload: apireq });
  };

  useEffect(() => {
    // Load Data in Store you further Use
    loadBudgetVersionData();

  }, []);

  useEffect(() => {
    const bv = Object.values(JSON.parse(JSON.stringify(budgetVersionData))).find(budget => {
      return budget.budgetVersionsID === parseInt(match?.match?.params?.id)
    });

    if (bv) {
      const firstSetting = getInitialSetting();
      firstSetting.startDate = bv.timeperiodobj.fiscalStartMonthID.itemTypeCode;
      firstSetting.endDate = bv.timeperiodobj.fiscalEndMonthID.itemTypeCode;
      SetlocalState({ ...localState, budgetVersion: bv, raiseSettings: [firstSetting] });

      GetRaisesByBudgetVersionID(bv.budgetVersionsID).then(result => {
        if (result.length > 0) {
          SetRaisesState({ ...localState, initialData: result });
        }
      });

    }
  }, [budgetVersionData])

  useEffect(() => {
    if (raisesState.initialData?.length > 0) {
      // process what we are getting from the database
      processInitialData(raisesState.initialData);
    }
  }, [raisesState.initialData]);

  const processInitialData = (initialData) => {
    const settings = [];
    initialData.forEach(data => {
      const setting = getInitialSetting();
      setting.entityID = data.entity.entityID;
      setting.entityCode = data.entity.entityCode;
      setting.entityName = data.entity.entityName;
      setting.departmentID = data.department.departmentID;
      setting.departmentCode = data.department.departmentCode;
      setting.departmentName = data.department.departmentName;
      setting.jobCodeID = data.jobCode.jobCodeID;
      setting.jobCodeCode = data.jobCode.jobCodeCode;
      setting.jobCodeName = data.jobCode.jobCodeName;
      setting.payTypeID = data.payType.payTypeID;
      setting.payTypeCode = data.payType.payTypeCode;
      setting.payTypeName = data.payType.payTypeName;
      setting.percentChange = data.wageAdjustmentPercent;
      setting.startDate = data.startMonth.itemTypeCode;
      setting.endDate = data.endMonth.itemTypeCode;

      settings.push(setting);

    });

    SetlocalState({ ...localState, raiseSettings: settings });
  }

  const addSection = () => {
    const nextSetting = getInitialSetting();
    nextSetting.startDate = localState.budgetVersion.timeperiodobj.fiscalStartMonthID.itemTypeCode;
    nextSetting.endDate = localState.budgetVersion.timeperiodobj.fiscalEndMonthID.itemTypeCode;
    SetlocalState({ ...localState, raiseSettings: [...localState.raiseSettings, nextSetting] });
  }

  const removeSection = (index) => {
    const [raiseSettings] = [localState.raiseSettings];
    delete raiseSettings[index];
    SetlocalState({ ...localState, raiseSettings });
  }

  const getFiscalMonths = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];

    const index = monthNames.findIndex(month => month.toUpperCase() === localState.budgetVersion.fiscalStartMonthID);
    for (var i = index; i < monthNames.length; i++) {
      result.push(monthNames[i]);
    }
    if (index > 0) {
      for (var i = 0; i < index; i++) {
        result.push(monthNames[i]);
      }
    }

    return result;
  }

  const handleEntityChange = (index, entity) => {
    if (entity) {
      const [raiseSettings] = [localState.raiseSettings];
      if (raiseSettings.length > index) {
        const row = raiseSettings[index];
        row.entityID = entity.entityID;
        row.entityName = entity.entityName;
        row.entityCode = entity.entityCode;
      }
      else {
        // add a new row to the inflationSettings
        const row = getInitialSetting();
        row.entityID = entity.entityID;
        row.entityName = entity.entityName;
        row.entityCode = entity.entityCode;
        raiseSettings.push(row);
        SetlocalState({ ...localState, raiseSettings });
      }
    }
  }

  const handleDepartmentChange = (index, department) => {
    if (department) {
      const [raiseSettings] = [localState.raiseSettings];
      if (raiseSettings.length > index) {
        const row = raiseSettings[index];
        row.departmentID = department.departmentID;
        row.departmentName = department.departmentName;
        row.departmentCode = department.departmentCode;
      }
      else {
        // add a new row to the inflationSettings
        const row = getInitialSetting();
        row.departmentID = department.departmentID;
        row.departmentName = department.departmentName;
        row.departmentCode = department.departmentCode;
        raiseSettings.push(row);
        SetlocalState({ ...localState, raiseSettings });
      }
    }
  }

  const handleJobCodeChange = (index, jobCode) => {
    if (jobCode) {
      const [raiseSettings] = [localState.raiseSettings];
      if (raiseSettings.length > index) {
        const row = raiseSettings[index];
        row.jobCodeID = jobCode.jobCodeID;
        row.jobCodeName = jobCode.jobCodeName;
        row.jobCodeCode = jobCode.jobCodeCode;
      }
      else {
        // add a new row to the inflationSettings
        const row = getInitialSetting();
        row.jobCodeID = jobCode.jobCodeID;
        row.jobCodeName = jobCode.jobCodeName;
        row.jobCodeCode = jobCode.jobCodeCode;
        raiseSettings.push(row);
        SetlocalState({ ...localState, raiseSettings });
      }
    }
  }

  const handlePayTypeChange = (index, payType) => {
    if (payType) {
      const [raiseSettings] = [localState.raiseSettings];
      if (raiseSettings.length > index) {
        const row = raiseSettings[index];
        row.payTypeID = payType.payTypeID;
        row.payTypeName = payType.payTypeName;
        row.payTypeCode = payType.payTypeCode;
      }
      else {
        // add a new row to the inflationSettings
        const row = getInitialSetting();
        row.payTypeID = payType.payTypeID;
        row.payTypeName = payType.payTypeName;
        row.payTypeCode = payType.jobCodeCode;
        raiseSettings.push(row);
        SetlocalState({ ...localState, raiseSettings });
      }
    }

  }

  const handleRaiseChange = (index, raisePercent) => {
    if (raisePercent) {
      const [raiseSettings] = [localState.raiseSettings];
      if (raiseSettings.length > index) {
        const row = raiseSettings[index];
        row.percentChange = raisePercent;
      }
      else {
        // add a new row to the raiseSettings
        const row = getInitialSetting();
        row.percentChange = raisePercent;
        raiseSettings.push(row);
        SetlocalState({ ...localState, raiseSettings });
      }
    }
  }

  const handleStartDateChange = (index, startDate) => {
    if (startDate) {
      const [raiseSettings] = [localState.raiseSettings];
      if (raiseSettings.length > index) {
        const row = raiseSettings[index];
        row.startDate = startDate.itemTypeCode;
      }
      else {
        // add a new row to the raiseSettings
        const row = getInitialSetting();
        row.startDate = startDate.itemTypeCode;
        raiseSettings.push(row);
        SetlocalState({ ...localState, raiseSettings });
      }
    }
  }
  const handleEndDateChange = (index, endDate) => {
    if (endDate) {
      const [raiseSettings] = [localState.raiseSettings];
      if (raiseSettings.length > index) {
        const row = raiseSettings[index];
        row.endDate = endDate.itemTypeCode;
      }
      else {
        // add a new row to the raiseSettings
        const row = getInitialSetting();
        row.endDate = endDate.itemTypeCode;
        raiseSettings.push(row);
        SetlocalState({ ...localState, raiseSettings });
      }
    }
  }

  const Save = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const post = [];
    const postSetting = {
      "wageAdjustment_budgetversion_id": localState.budgetVersion.budgetVersionsID.toString(),
      "wageAdjustment_budgetversion_timePeriod_ID": localState.budgetVersion.timeperiodobj.timePeriodID.toString(),
      "wageAdjustmentsections": []
    };

    localState.raiseSettings.forEach(setting => {
      let rowStartDateIndex = monthNames.findIndex(month => month.toUpperCase() === setting.startDate.toUpperCase());
      let rowEndDateIndex = monthNames.findIndex(month => month.toUpperCase() === setting.endDate.toUpperCase());

      rowStartDateIndex++;
      let rowStartDateIndexString = rowStartDateIndex.toString();
      if (rowStartDateIndexString.toString().length == 1) {
        rowStartDateIndexString = "0" + rowStartDateIndexString;
      }

      rowEndDateIndex++;
      let rowEndDateIndexString = rowEndDateIndex.toString();
      if (rowEndDateIndexString.toString().length == 1) {
        rowEndDateIndexString = "0" + rowEndDateIndexString;
      }


      const raiseSection = {
        "dimensionRow": {
          "entity": setting.entityID.toString(),
          "department": setting.departmentID.toString(),
          "jobCode": setting.jobCodeID.toString(),
          "payType": setting.payTypeID.toString()
        },
        "percentChange": parseFloat(setting.percentChange),
        "startMonth": "fiscalStartMonth-" + rowStartDateIndexString,
        "endMonth": "fiscalStartMonth-" + rowEndDateIndexString
      };

      postSetting.wageAdjustmentsections.push(raiseSection);
    });

    return postSetting;
  }

  const SaveRaises = () => {
    const postSetting = Save();
    PostRaises(postSetting).then(result => {
      SetlocalState({ ...localState, showSavedNotification: true, isSomethingChange: false });
    });

  }

  const SaveAndClose = e => {
    const postSetting = Save();
    PostRaises(postSetting).then(result => {
      history.push("/BudgetVersion/" + localState.budgetVersion.budgetVersionsID, { notification: "Wage adjustments applied" });
    });
  }

  const cancelForm = e => {
    if (localState.isSomethingChange) toggleUnsaveModal();
    else history.push("/BudgetVersion/" + localState.budgetVersion.budgetVersionsID);
  }
  const loseUnsavedChanges = () => {
    history.push("/BudgetVersion/" + localState.budgetVersion.budgetVersionsID);
  }

  const applyRaisesChanges = e => {
    // update raise rate table
    const result = [];
    const fiscalYearMonths = getFiscalMonths();
    localState.raiseSettings.forEach(row => {
      if ((row?.departmentID || row?.departmentCode) && (row?.entityCode || row?.entityID) && (row?.jobCodeCode || row?.jobCodeID) && (row?.payTypeCode || row?.payTypeID)) {
        const rowStartDateIndex = fiscalYearMonths.findIndex(month => month.toUpperCase() === row.startDate.toUpperCase());
        const rowEndDateIndex = fiscalYearMonths.findIndex(month => month.toUpperCase() === row.endDate.toUpperCase());
        const resultRow = result.find(r => r.entityID === row.entityID && r.departmentID === row.departmentID && r.jobCodeID === row.jobCodeID && row.payTypeID === r.payTypeID);
        if (resultRow) {
          for (var i = rowStartDateIndex; i <= rowEndDateIndex; i++) {
            resultRow.percentChange[i] += parseInt(row.percentChange);
          }
        }
        else {
          // monthPercentages will be in order of the fiscal year for the budget. 
          // if start month = july, then monthPercentages[0] will represent the percentage value for july
          const monthPercentages = new Array(12);
          for (var i = 0; i < 12; i++) {
            monthPercentages[i] = 0;
          }
          for (var i = rowStartDateIndex; i <= rowEndDateIndex; i++) {
            monthPercentages[i] = parseInt(row.percentChange);
          }

          // add resultRow to results
          result.push({
            entityID: row.entityID,
            entityCode: row.entityCode,
            entityName: row.entityName,
            departmentID: row.departmentID,
            departmentCode: row.departmentCode,
            departmentName: row.departmentName,
            jobCodeID: row.jobCodeID,
            jobCodeName: row.jobCodeName,
            jobCodeCode: row.jobCodeCode,
            payTypeID: row.payTypeID,
            payTypeName: row.payTypeName,
            payTypeCode: row.payTypeCode,
            startDate: row.startDate,
            endDate: row.endDate,
            percentChange: monthPercentages
          }
          );
        }
      }
    });

    SetlocalState({ ...localState, raisesTable: result, isSomethingChange: true });
  }

  const toggleUnsaveModal = () => {
    SetlocalState({ ...localState, openUnsaveModal: !localState.openUnsaveModal })
  }

  return (
    (localState.budgetVersion.code === undefined || localState.budgetVersion.code === "" ||
      localState.budgetVersion.code === null) ?
      <InlineLoading description="Loading..." /> :
      <div>
        <PageHeader
          heading={
            "Raises " +
            localState.budgetVersion.code +
            " : " +
            localState.budgetVersion.description
          }
          icon={<Favorite16 />}
          breadCrumb={breadCrumb}
        />
        <FullScreenModal
          open={localState.openUnsaveModal}
          hasScrollingContent={false}
          iconDescription="Close"
          modalAriaLabel={'Unsaved changes'}
          modalHeading={'Unsaved changes'}
          onRequestClose={loseUnsavedChanges}
          onRequestSubmit={() => SaveAndClose()}
          onSecondarySubmit={loseUnsavedChanges}
          passiveModal={false}
          primaryButtonDisabled={false}
          primaryButtonText="Save unsaved changes"
          secondaryButtonText="Lose unsaved changes"
          size='xs'
        >
          <div className="bx--grid">
            <div className="bx--row">
              <div className="bx--col">
                You made changes but did not save them.<br />
            Are you sure you want to lose your unsaved changes?
          </div>
            </div>
            <br />
            <br />
            <br />
          </div>
        </FullScreenModal>
        <div className="bx--grid bx--grid--full-width bx--grid--full-width">

          <div className="bx--row">
            <div className="raises-section-col">
              <div>
                <Accordion>
                  <AccordionItem
                    open={true}
                    title={
                      <strong>Table row wage adjustment</strong>
                    }
                  >
                    {localState.raiseSettings.map((section, index) => { return <RaisesSection sectionIndex={index} budgetVersion={localState.budgetVersion} raiseSettings={localState.raiseSettings} handleAdd={addSection} handleRemove={removeSection} handleEntityChange={handleEntityChange} handleDepartmentChange={handleDepartmentChange} handleJobCodeChange={handleJobCodeChange} handlePayTypeChange={handlePayTypeChange} handleRaiseChange={handleRaiseChange} handleStartDateChange={handleStartDateChange} handleEndDateChange={handleEndDateChange} /> })}

                    <br />
                    <Button
                      kind="tertiary"
                      type="button"
                      onClick={applyRaisesChanges}
                    >
                      Apply
                    </Button>
                  </AccordionItem>
                  <AccordionItem
                    open={true}
                    title={
                      <strong>Integrated wage adjustment over fiscal year</strong>
                    }
                  >

                    <RaisesTable budgetVersion={localState.budgetVersion} raisesTable={localState.raisesTable} />

                  </AccordionItem>

                </Accordion>

              </div>
            </div>

          </div>
          <div className="bx--row">
            <div className="bx--col">
              {localState.showSavedNotification ?
                <InlineNotification
                  title="Wage adjustments applied"
                  kind="success"
                  lowContrast='true'
                  notificationType='inline'
                  className='add-budgetversion-notification'
                  iconDescription="Close Notification"
                /> : ""}

            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col">
              <Button id="btnCancel" className="bx--btn--secondary" type="submit" onClick={cancelForm}>
                Cancel
              						</Button>
              <Button id="btnSave" className="bx--btn--tertiary without-left-border" renderIcon={Save16} type="submit" onClick={SaveRaises}>
                Save
            							</Button>
              <Button id="btnSaveNClose" className="bx--btn--primary without-left-border" type="Submit" onClick={SaveAndClose}>
                Save and close
		              				</Button>
            </div>
          </div>

        </div>
      </div>
  );
}


export default Raises;