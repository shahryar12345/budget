import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Button, InlineNotification } from "carbon-components-react";
import { Favorite16, Save16 } from "@carbon/icons-react";
import PageHeader from "../../layout/PageHeader";
import { mappingTypes } from "./Data/mapping-types";
import { updateMapping, refreshMapping } from "../../../core/_actions/MappingActions";
import { useHistory } from "react-router-dom";
import MapStatisticsToDepartments from "./MappingTypes/StatisticsToDepartments/map-statistics-to-departments";
import { deleteJobCodeToGLAccountMappings, saveJobCodeToGLAccountMappings, saveStatisticsToDepartmentMappings } from "../../../services/mapping-service.js";
import { refreshForecast } from "../../../core/_actions/ForecastActions";
import MapJobCodesToGLAccounts from "./MappingTypes/JobCodesToGL/map-job-codes-to-glaccounts";
import FullScreenModal from "../../shared/budget-versions-modal/full-screen-modal";

let localDeletedItems = [];
const Mapping = ({ match }) => {
  const initialStates = {
    showNotification: false,
    notificationKind: "",
    notificationTitle: "",
    enableSave: false,
    glAccountMappings: [],
    deletedItems: []
  };
  const history = useHistory();
  const state = useSelector((state) => state.Mapping); // gloablState
  const [localState, SetlocalState] = useState(initialStates);
  const [cancelModalIsOpen, setCancelModalIsOpen] = useState(false);
  const userDetails = useSelector((state) => state.UserDetails);
  const dispatch = useDispatch();

  const breadCrumb = [{ text: "Mappings", link: "/Mapping" }];

  const handleChange = (value) => {
    dispatch(updateMapping({ ...state, mappingType: value, entity: value === "notSelected" ? "" : state.entity }));
  };

  useEffect(() => {
    return () => {
      // Clean up the redux state when change the change (Component Unmount)
      dispatch(updateMapping({ ...state, mappingType: "notSelected", entity: "", changedData: [] }));
    };
  }, []);

  const handleSave = async (actionType) => {
    if (state.mappingType === "statisticsToDepartments") {
      SaveStatisticsToDepartmentMappings(actionType);
    }
    else if (state.mappingType === "jobCodeToGL") {
      saveGLAccountMappings(actionType);
    }
  };

  const saveGLAccountMappings = (actionType) => {
    // delete any removed items
    localState.deletedItems.forEach(item => {
      deleteJobCodeToGLAccountMappings(item);
    });

    localState.glAccountMappings.forEach((mapping, index) => {
      saveJobCodeToGLAccountMappings(mapping.entityId, mapping.departmentId, mapping.jobCodeId, mapping.payTypeId, mapping.glAccountId, index);
    });

    if (actionType === "save") {
      SetlocalState({ ...localState, showNotification: true, notificationTitle: "Mapping saved.", notificationKind: "success" });
    }
    else {
      history.push({ pathname: '/BudgetVersions', state: { notification: "Mapping saved." } });
    }

  }

  const SaveStatisticsToDepartmentMappings = async (actionType) => {
    let response = await saveStatisticsToDepartmentMappings(state.changedData, state.entity);
    if (response.success) {
      dispatch(updateMapping({ ...state, changedData: [] }));
      if (actionType === "save") {
        SetlocalState({
          ...localState,
          showNotification: true,
          notificationTitle: "Mapping saved.",
          notificationKind: "success",
        });
      } else if (actionType === "saveAndClose") {
        history.push({
          pathname: '/BudgetVersions',
          state: { notification: "Mapping saved." }
        });
      }
    } else {
      SetlocalState({
        ...localState,
        showNotification: true,
        notificationTitle: "Error in saving mappings.",
        notificationKind: "error",
      });
    }
  }

  const loseUnsavedChanges = () => {
    // Clear All Data of mapping from the Store before going back.
    setCancelModalIsOpen(false);
    dispatch(refreshForecast({}));
    history.goBack();
  }

  const handleCancelButton = () => {
    // Show unsave data popup warning only when some data is changed. otherwise route user to previous page.
    if (state.changedData.length) {
      setCancelModalIsOpen(true);
    } else {
      history.goBack();
    }
  };

  const handleNotificationClose = () => {
    SetlocalState({
      ...localState,
      showNotification: false,
    });
  };

  const onJobCodesMappingChange = (mappings, isValid) => {
    SetlocalState({ ...localState, enableSave: isValid, glAccountMappings: mappings, deletedItems: localDeletedItems });
  }

  const onJobCodesMappingDelete = (deletedItem) => {
    localDeletedItems = [...localDeletedItems, deletedItem];
  }

  let type = '';
  if (state?.mappingType === 'statisticsToDepartments') type = 'MappingStatisticToDepartmentAP'
  else if (state?.mappingType === 'jobCodeToGL') type = 'MappingJobCodePayTypetoGLAccountAP'


  const mappingTypesModify = mappingTypes.filter(data => userDetails?.mappingsAP[data.key]?.View)
  return (
    <div className="Warning-popup-container">
      <FullScreenModal
        open={cancelModalIsOpen}
        hasScrollingContent={false}
        iconDescription="Close"
        modalAriaLabel={'Unsaved changes'}
        modalHeading={'Unsaved changes'}
        onRequestClose={() => setCancelModalIsOpen(false)}
        onRequestSubmit={() => handleSave("saveAndClose")}
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
      <PageHeader
        heading={"Mappings"}
        icon={<Favorite16 />}
        breadCrumb={breadCrumb} notification={history?.location?.state?.notification} />
      <div className={"bx--row"}>
        <div className={"bx--col-lg mapping-container"}>
          <div className={"bx--row"}>
            <div className={"bx--col-lg-3"}>
              <span style={{ color: "grey" }}>{"Mappings"}</span>
            </div>
          </div>
          <div className={"bx--row"}>
            <div className={"bx--col-lg-4 mapping-type-dropdown"}>
              <Dropdown
                id={"mapping-type-dropdown"}
                type="text"
                items={mappingTypesModify}
                itemToString={(item) => (item ? item.text : "")}
                selectedItem={mappingTypes.find((x) => x.value === state.mappingType)}
                onChange={(e) => handleChange(e.selectedItem.value)}
              />
            </div>
          </div>
          {state.mappingType === "statisticsToDepartments" && userDetails?.mappingsAP[type]?.View ? (
            <>
              <MapStatisticsToDepartments
                isEdit={userDetails?.mappingsAP[type]?.Edit} />
            </>
          ) : null}
          {state.mappingType === "jobCodeToGL" && userDetails?.mappingsAP[type]?.View ?
            (
              <>
                <MapJobCodesToGLAccounts
                  handleChange={onJobCodesMappingChange}
                  handleDelete={onJobCodesMappingDelete}
                  isEdit={userDetails?.mappingsAP[type]?.Edit}
                />
              </>
            ) : null}
          <br />
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
              <Button id="btnCancle"
                kind="secondary"
                type="button"
                onClick={() => handleCancelButton()}
              // disabled={(!state.entity || !state.changedData.length) && !localState.enableSave}
              >
                Cancel
       </Button>
              <Button
                kind="tertiary"
                type="button"
                onClick={(e) => {
                  handleSave("save");
                }}
                renderIcon={Save16}
                disabled={(!state.entity || !state.changedData.length) && !localState.enableSave}
              >
                Save
       </Button>
              <Button
                kind="primary"
                type="button"
                onClick={(e) => {
                  handleSave("saveAndClose");
                }}
                disabled={(!state.entity || !state.changedData.length) && !localState.enableSave}
              >
                Save and close
       </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mapping;
