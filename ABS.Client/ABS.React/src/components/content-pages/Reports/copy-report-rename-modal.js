import FullScreenModal from "../../shared/budget-versions-modal/full-screen-modal";
import React, { useEffect, useState } from "react";
import { Button, DataTable, Modal, ModalWrapper, Pagination, TableSelectAll, TextInput, InlineLoading, Search, TooltipDefinition, TooltipIcon } from "carbon-components-react";
import { GetReportingPageData, GetReportingPageDataRows, GetReportCodes, DeleteReports, RenameReport, CopyReport } from "../../../services/reporting-service";

const ReportCopyRenameModal = ({ modalType, selectedReportValues, isOpen, closeCopyRenameModal, allReportsCodes, closeCopyRenameModalWithNotification }) => {
 const [states, setStates] = useState({ code: "", name: "", description: "", codeIsInvalid: false, nameIsInvalid: false, codeInvalidText: "", nameInvalidText: "" });
 const [modalDisplayState, setModalDisplayState] = useState({
  modalAriaLabel: "Rename report",
  modalHeading: "Rename",
  primaryButtonText: "Rename",
 });

 useEffect(() => {
  if (modalType === "copy") {
   setModalDisplayState({
    modalAriaLabel: "Copy report",
    modalHeading: "Copy",
    primaryButtonText: "Copy",
   });
  } else if (modalType === "rename") {
   setModalDisplayState({
    modalAriaLabel: "Rename report",
    modalHeading: "Rename",
    primaryButtonText: "Rename",
   });
  } else if (modalType === "saveAs") {
   setModalDisplayState({
    modalAriaLabel: "Save as",
    modalHeading: "Save as",
    primaryButtonText: "Save",
   });
  }
 }, [modalType]);

 useEffect(() => {
  setStates({ code: selectedReportValues?.code, name: selectedReportValues?.name, description: selectedReportValues?.description });

  if (modalType === "copy") {
   setTimeout(() => {
    let codeField = document.getElementById("code");
    codeField.focus();
    codeField.select();
   }, 50);
  }
 }, [selectedReportValues]);

 const handleCopyRenameModalSubmit = async () => {
  var reportObj = {};
  var success = false;
  if (modalType === "rename") {
   reportObj = {
    actionType: "RENAME",
    code: selectedReportValues?.code,
    newCode: states.code,
    name: states.name,
    description: states.description,
   };
   await RenameReport(reportObj).then((res) => {
    if (res.status === 200) {
     success = true;
    }
   });
   closeCopyRenameModalWithNotification(success, modalType);
  } else if (modalType === "copy") {
   reportObj = {
    actionType: "COPY",
    code: selectedReportValues?.code,
    newCode: states.code,
    name: states.name,
    description: states.description,
   };
   await CopyReport(reportObj).then((res) => {
    if (res.status === 200) {
     success = true;
    }
   });
   closeCopyRenameModalWithNotification(success, modalType);
  }else if(modalType === "saveAs")
  {

    closeCopyRenameModalWithNotification( {...selectedReportValues , ...states } , true)
  }
  
 };

 const onChange = (e, stateName) => {
  const { value } = e.target;
  let invalid = false;
  let invalidText = "";
  if (value === "") {
   invalid = true;
   invalidText = stateName.charAt(0).toUpperCase() + stateName.slice(1) + " is required.";
  }

  // Check for duplicate report codes
  if (stateName === "code") {
   let codeFound = allReportsCodes.find((code) => {
    return code === value;
   });
   if (codeFound) {
    invalid = true;
    invalidText = "Code already used. Enter a unique code.";
   }
  }

  setStates({ ...states, [stateName]: value, [stateName + "IsInvalid"]: invalid, [stateName + "InvalidText"]: invalidText });
 };

 const disablePrimaryButton = () => {
  let disable = false;
  if (selectedReportValues?.code === states.code && selectedReportValues?.name === states.name && selectedReportValues?.description === states.description) {
   disable = true;
  }
  if (states.code === "" || states.name === "") {
   disable = true;
  }
  return disable;
 };

 return (
  <>
   <FullScreenModal
    className="report-copy-rename-modal"
    open={isOpen}
    hasScrollingContent={false}
    iconDescription="Close"
    modalAriaLabel={modalDisplayState.modalAriaLabel}
    modalHeading={modalDisplayState.modalHeading}
    onRequestClose={closeCopyRenameModal}
    onRequestSubmit={handleCopyRenameModalSubmit}
    onSecondarySubmit={closeCopyRenameModal}
    passiveModal={false}
    primaryButtonDisabled={disablePrimaryButton()}
    primaryButtonText={modalDisplayState.primaryButtonText}
    secondaryButtonText="Cancel"
   >
    {modalType === "copy" ? (
     <>
      <div className="bx--row">
       <div className="bx--col">
        Change the <em>Code</em> for the copied report.
       </div>
      </div>
     </>
    ) : null}
    <div className="bx--row">
     <div className="bx--col">
      <TextInput
       id="code"
       type="text"
       invalid={states.codeIsInvalid}
       invalidText={states.codeInvalidText}
       labelText="Code"
       onChange={(e) => {
        onChange(e, "code");
       }}
       value={states.code}
       maxLength={15}
      />
     </div>
     <div className="bx--col">
      <TextInput
       id="name"
       type="text"
       labelText="Name "
       invalid={states.nameIsInvalid}
       invalidText={states.nameInvalidText}
       onChange={(e) => {
        onChange(e, "name");
       }}
       value={states.name}
       maxLength={40}
      />
     </div>
    </div>
    <div className="bx--row">
     <div className="bx--col">
      <TextInput
       id="description"
       type="text"
       labelText="Description (optional)"
       value={states.description}
       onChange={(e) => {
        onChange(e, "description");
       }}
       maxLength={80}
      />
     </div>
    </div>
   </FullScreenModal>
  </>
 );
};

export default ReportCopyRenameModal;
