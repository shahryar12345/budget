import React, { useEffect, useState, createRef, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageHeader from "../../layout/PageHeader";
import { useHistory } from "react-router";
import { getApiResponseParams } from "../../../services/api/apiCallerGet";
import { Add20, Subtract20 } from "@carbon/icons-react";
import InflationDimensionsSection from './inflation-dimensions-section';
import InflationRatesTable from './inflation-rates-table';
import { PostInflation, GetInflationsByBudgetVersionID } from "../../../services/inflation-service";

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


const getInitialSection = () => {
  return {
    entityId: '',
    departmentId: '',
    glAccount: '',
    percentChange: 0,
    startDate: null,
    endDate: null,
    key: Math.floor(Math.random() * 1000)
  };

}

const Inflation = (match) => {
  const history = useHistory();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dispatch = useDispatch();
  const [localState, SetlocalState] = useState({ budgetVersion: {}, sections: [getInitialSection()], inflationSettings: [], inflationTable: [], showSavedNotification: false });
  const [inflationState, SetInflationState] = useState({ initialData: [] });
  const budgetVersionData = useSelector((state) => state.BudgetVersions.list);
  const masterData = useSelector((state) => state.MasterData);
  const messageRef = useRef();
  const [isUnsaveModalOpen, toggleIsUnsaveModalOpen] = useState(false);
  const [isDuplicateRowFound, setSsDuplicateRowFound] = useState(false);


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
    if (messageRef.current) {
      messageRef.current.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
    }
  }, [localState.sections])

  useEffect(() => {
    const bv = Object.values(JSON.parse(JSON.stringify(budgetVersionData))).find(budget => {
      return budget.budgetVersionsID === parseInt(match?.match?.params?.id)
    });

    if (bv) {
      const firstSection = getInitialSection();
      firstSection.startDate = bv.timeperiodobj.fiscalStartMonthID.itemTypeCode;
      firstSection.endDate = bv.timeperiodobj.fiscalEndMonthID.itemTypeCode;
      SetlocalState({ ...localState, budgetVersion: bv, sections: [firstSection] });

      const x = GetInflationsByBudgetVersionID(bv.budgetVersionsID).then(result => {
        SetInflationState({ ...inflationState, initialData: result });
      });

    }
  }, [budgetVersionData])

  useEffect(() => {
    if (inflationState.initialData?.length > 0) {
      const sections = [];
      const inflationSettings = [];
      inflationState.initialData.forEach(r => {
        const section = {
          entityId: '',
          departmentId: '',
          glAccount: '',
          percentChange: 0,
          startDate: null,
          endDate: null
        };
        section.entityId = r.entity.entityID;
        section.departmentId = r.department.departmentID;
        section.glAccountId = r.glAccount.glAccountID;
        section.percentChange = r.inflationPercent;
        section.startDate = r.startMonth.itemTypeCode;
        section.endDate = r.endMonth.itemTypeCode;
        section.key = Math.floor(Math.random() * 1000);
        sections.push(section);

        const setting = getEmptySettingsRow();
        setting.entityID = r.entity.entityID;
        setting.entityCode = r.entity.entityCode;
        setting.entityName = r.entity.entityName;
        setting.departmentID = r.department.departmentID;
        setting.departmentName = r.department.departmentName;
        setting.departmentCode = r.department.departmentCode;
        setting.glAccountID = r.glAccount.glAccountID;
        setting.glAccountCode = r.glAccount.glAccountCode;
        setting.glAccountName = r.glAccount.glAccountName;
        setting.percentChange = r.inflationPercent;
        setting.startDate = r.startMonth.itemTypeCode;
        setting.endDate = r.endMonth.itemTypeCode;
        inflationSettings.push(setting);

      });
      SetlocalState({ ...localState, sections, inflationSettings });
      //applyInflationRateChanges(null);
    }
  }, [inflationState.initialData])

  useEffect(() => {
    applyInflationRateChanges(null);
  }, [localState.inflationSettings])

  const addSection = (index) => {
    // add the new section after the index
    const nextSection = getInitialSection();
    nextSection.startDate = localState.budgetVersion.timeperiodobj.fiscalStartMonthID.itemTypeCode;
    nextSection.endDate = localState.budgetVersion.timeperiodobj.fiscalEndMonthID.itemTypeCode;
    SetlocalState({ ...localState, sections: [...localState.sections, nextSection] });
  }


  const toCheckIfDuplicateRowExist = (data) => {
    const uniqueData = new Set(data.map(d => `${d.entityID}${d.departmentID}${d.glAccountID}${d.startDate}${d.endDate}`));
    if (uniqueData.size < data.length) return true;
    return false
  }

  const removeSection = (index) => {
    const [sections] = [localState.sections];
    const [settings] = [localState.inflationSettings];
    const { initialData } = inflationState;
    if (initialData.length) {
      initialData.splice(index, 1)
      SetInflationState({ ...inflationState, initialData })
    }
    sections.splice(index, 1);
    settings.splice(index, 1);
    SetlocalState({ ...localState, sections, inflationSettings: settings });
  }

  const getFiscalMonths = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];

    let index = monthNames.findIndex(month => month.toUpperCase() === localState.budgetVersion.fiscalStartMonthID);
    if (index < 0) {
      index = 0;
    }
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


  const applyInflationRateChanges = e => {

    const isDuplicateRowExist = toCheckIfDuplicateRowExist(localState.inflationSettings);
    if (isDuplicateRowExist) {
      setSsDuplicateRowFound(isDuplicateRowExist);
      return
    }
    // update inflation rate table
    const result = [];
    const fiscalYearMonths = getFiscalMonths();
    localState.inflationSettings.forEach(row => {
      const rowStartDateIndex = fiscalYearMonths.findIndex(month => month?.toUpperCase() === row.startDate?.toUpperCase());
      const rowEndDateIndex = fiscalYearMonths.findIndex(month => month?.toUpperCase() === row.endDate?.toUpperCase());
      const resultRow = result.find(r => r.entityID === row.entityID && r.departmentID === row.departmentID && r.glAccountID === row.glAccountID);
      if (resultRow) {
        for (var i = rowStartDateIndex; i <= rowEndDateIndex; i++) {
          resultRow.percentChange[i] = parseFloat(resultRow.percentChange[i]) + parseFloat(row.percentChange);
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
          monthPercentages[i] = row.percentChange
        }

        // add resultRow to results
        if ((row.entityID || row.entityCode) &&
          (row.departmentID || row.departmentCode) &&
          (row.glAccountID || row.glAccountCode)){
            result.push({
              entityID: row.entityID,
              entityCode: row.entityCode,
              entityName: row.entityName,
              departmentID: row.departmentID,
              departmentCode: row.departmentCode,
              departmentName: row.departmentName,
              glAccountID: row.glAccountID,
              glAccountName: row.glAccountName,
              glAccountCode: row.glAccountCode,
              startDate: row.startDate,
              endDate: row.endDate,
              percentChange: monthPercentages
            }
            );
  
          }
      }
    });

    SetlocalState({ ...localState, inflationTable: result });
  }

  const getEmptySettingsRow = () => {
    return {
      entityID: '',
      entityCode: '',
      entityName: '',
      departmentID: '',
      departmentName: '',
      departmentCode: '',
      glAccountID: '',
      glAccountCode: '',
      glAccountName: '',
      percentChange: 0,
      startDate: localState.budgetVersion.timeperiodobj?.fiscalStartMonthID.itemTypeCode,
      endDate: localState.budgetVersion.timeperiodobj?.fiscalEndMonthID.itemTypeCode
    };
  }

  const handleEntityChange = (index, entity) => {
    if (entity) {
      const [inflationSettings] = [localState.inflationSettings];
      if (inflationSettings.length > index) {
        const row = inflationSettings[index];
        row.entityID = entity.entityID;
        row.entityName = entity.entityName;
        row.entityCode = entity.entityCode;
      }
      else {
        // add a new row to the inflationSettings
        const row = getEmptySettingsRow();
        row.entityID = entity.entityID;
        row.entityName = entity.entityName;
        row.entityCode = entity.entityCode;
        inflationSettings.push(row);
        SetlocalState({ ...localState, inflationSettings });
      }
    }

  }
  const handleDepartmentChange = (index, department) => {
    if (department) {
      const [inflationSettings] = [localState.inflationSettings];
      if (inflationSettings.length > index) {
        const row = inflationSettings[index];
        row.departmentID = department.departmentID;
        row.departmentName = department.departmentName;
        row.departmentCode = department.departmentCode;
      }
      else {
        // add a new row to the inflationSettings
        const row = getEmptySettingsRow();
        row.departmentID = department.departmentID;
        row.departmentName = department.departmentName;
        row.departmentCode = department.departmentCode;
        inflationSettings.push(row);
        SetlocalState({ ...localState, inflationSettings });
      }
    }
  }
  const handleGLAccountChange = (index, GLAccount) => {
    if (GLAccount) {
      const [inflationSettings] = [localState.inflationSettings];
      if (inflationSettings.length > index) {
        const row = inflationSettings[index];
        row.glAccountID = GLAccount.glAccountID;
        row.glAccountName = GLAccount.glAccountName;
        row.glAccountCode = GLAccount.glAccountCode;
      }
      else {
        // add a new row to the inflationSettings
        const row = getEmptySettingsRow();
        row.glAccountID = GLAccount.glAccountID;
        row.glAccountName = GLAccount.glAccountName;
        row.glAccountCode = GLAccount.glAccountCode;
        inflationSettings.push(row);
        SetlocalState({ ...localState, inflationSettings });
      }
    }
  }

  const handleInflationPercentChange = (index, inflationPercent) => {
    if (inflationPercent) {
      const [inflationSettings] = [localState.inflationSettings];
      if (inflationSettings.length > index) {
        const row = inflationSettings[index];
        row.percentChange = inflationPercent;
      }
      else {
        // add a new row to the inflationSettings
        const row = getEmptySettingsRow();
        row.percentChange = inflationPercent;
        inflationSettings.push(row);
        SetlocalState({ ...localState, inflationSettings });
      }
    }
  }
  const handleStartDateChange = (index, startDate) => {
    if (startDate) {
      const [inflationSettings] = [localState.inflationSettings];
      if (inflationSettings.length > index) {
        const row = inflationSettings[index];
        row.startDate = startDate.itemTypeCode;
      }
      else {
        // add a new row to the inflationSettings
        const row = getEmptySettingsRow();
        row.startDate = startDate.itemTypeCode;
        inflationSettings.push(row);
        SetlocalState({ ...localState, inflationSettings });
      }
    }
  }
  const handleEndDateChange = (index, endDate) => {
    if (endDate) {
      const [inflationSettings] = [localState.inflationSettings];
      if (inflationSettings.length > index) {
        const row = inflationSettings[index];
        row.endDate = endDate.itemTypeCode;
      }
      else {
        // add a new row to the inflationSettings
        const row = getEmptySettingsRow();
        row.endDate = endDate.itemTypeCode;
        inflationSettings.push(row);
        SetlocalState({ ...localState, inflationSettings });
      }
    }
  }

  const Save = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const post = [];
    const postSetting = {
      "inflation_budgetversion_id": localState.budgetVersion.budgetVersionsID.toString(),
      "inflation_budgetversion_timePeriod_ID": localState.budgetVersion.timeperiodobj.timePeriodID.toString(),
      "inflationsections": []
    };

    localState.inflationSettings.forEach(setting => {
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

      const inflationSection = {
        "dimensionRow": {
          "entity": setting.entityID.toString(),
          "department": setting.departmentID.toString(),
          "generalLedger": setting.glAccountID.toString()
        },
        "percentChange": parseFloat(setting.percentChange),
        "startMonth": "fiscalStartMonth-" + rowStartDateIndexString,
        "endMonth": "fiscalStartMonth-" + rowEndDateIndexString
      }

      postSetting.inflationsections.push(inflationSection);
    });

    return postSetting;
  }

  const SaveInflation = () => {
    const postSetting = Save();
    PostInflation(postSetting).then(result => {
      SetlocalState({ ...localState, showSavedNotification: true });
    });

  }

  const SaveAndClose = e => {
    const postSetting = Save();
    PostInflation(postSetting).then(result => {
      history.push("/BudgetVersion/" + localState.budgetVersion.budgetVersionsID, { showInflationNotification: true });
    });
  }

  const cancelForm = e => {
    history.push("/BudgetVersion/" + localState.budgetVersion.budgetVersionsID);
  }

  return (
    (localState.budgetVersion.code === undefined || localState.budgetVersion.code === "" ||
      localState.budgetVersion.code === null) ?
      <InlineLoading description="Loading..." /> :
      <div>
        <PageHeader
          heading={
            "Inflation " +
            localState.budgetVersion.code +
            " : " +
            localState.budgetVersion.description
          }
          icon={<Favorite16 />}
          breadCrumb={breadCrumb}
          notification={history?.location?.state?.notification}
        />
        <div>
          <FullScreenModal
            open={isUnsaveModalOpen}
            hasScrollingContent={false}
            iconDescription="Close"
            modalAriaLabel={'Unsaved changes'}
            modalHeading={'Unsaved changes'}
            onRequestClose={() => { toggleIsUnsaveModalOpen(false) }}
            onRequestSubmit={SaveAndClose}
            onSecondarySubmit={() => { cancelForm(); toggleIsUnsaveModalOpen(false) }}
            passiveModal={false}
            primaryButtonDisabled={false}
            primaryButtonText="Save unsaved changes"
            secondaryButtonText="Lose unsaved changes"
            className="Test"
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
        </div>

        <div className="bx--grid bx--grid--full-width">

          <div className="bx--row">
            <div className="bx--col">
              <div>
                <Accordion>
                  <AccordionItem
                    open={true}
                    title={
                      <strong>Table row inflation</strong>
                    }
                  >
                    <div >
                      {localState.sections.map((section, index) => {
                        return (
                          <InflationDimensionsSection
                            sectionIndex={index}
                            key={section.key}
                            budgetVersion={localState.budgetVersion}
                            initialData={inflationState.initialData}
                            handleAdd={addSection}
                            handleRemove={removeSection}
                            handleEntityChange={handleEntityChange}
                            handleDepartmentChange={handleDepartmentChange}
                            handleGLAccountChange={handleGLAccountChange}
                            handleInflationPercentChange={handleInflationPercentChange}
                            handleStartDateChange={handleStartDateChange}
                            handleEndDateChange={handleEndDateChange}
                          />)
                      })}
                    </div>
                    <TooltipIcon
                      direction="top"
                      tooltipText="Add a inflation row below."
                      align="start"
                    >
                      <Add20
                        onClick={(e) => {
                          addSection();
                        }}
                      ></Add20>
                    </TooltipIcon>



                    <br />
                    {isDuplicateRowFound ?
                      <div className="bx--row">
                        <div className="bx--col">
                          <InlineNotification
                            title="Please remove duplicate row."
                            kind="error"
                            lowContrast='true'
                            notificationType='inline'
                            className='add-budgetversion-notification'
                            onCloseButtonClick={() => { setSsDuplicateRowFound(false) }}
                            iconDescription="Close Notification"
                          />
                        </div>
                      </div>
                      : ""}

                    <Button
                      ref={messageRef}
                      kind="tertiary"
                      type="button"
                      onClick={(e) => {
                        applyInflationRateChanges(e);
                      }}
                    >
                      Apply
                    </Button>
                  </AccordionItem>
                  <AccordionItem
                    open={true}
                    title={
                      <strong>Integrated inflation rates over fiscal year</strong>
                    }
                  >

                    <InflationRatesTable budgetVersion={localState.budgetVersion} inflationTable={localState.inflationTable} />

                  </AccordionItem>

                </Accordion>

              </div>
            </div>

          </div>
          <div className="bx--row">
            <div className="bx--col">
              {localState.showSavedNotification ?
                <InlineNotification
                  title="Inflation applied."
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
              <Button id="btnCancel" className="bx--btn--secondary" type="submit"
                // onClick={cancelForm}
                onClick={() => toggleIsUnsaveModalOpen(true)}
              >
                Cancel
              						</Button>
              <Button id="btnSave" className="bx--btn--tertiary without-left-border" renderIcon={Save16} type="submit" onClick={SaveInflation}>
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


export default Inflation;