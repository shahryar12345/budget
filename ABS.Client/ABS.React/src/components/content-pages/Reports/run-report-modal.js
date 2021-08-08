import FullScreenModal from "../../shared/budget-versions-modal/full-screen-modal";
import React, { useEffect, useState } from "react";
import { RadioButton, RadioButtonGroup, Button, DataTable, Modal, ModalWrapper, Pagination, TableSelectAll, TextInput, InlineLoading, Search, TooltipDefinition, TooltipIcon } from "carbon-components-react";
import { Information16, Search16 } from "@carbon/icons-react";
import { runReport } from "../../../services/reporting-service";

const RunReportModal = ({ isOpen, closeRunReportModal, selectedReportValues }) => {
 const [radioSelectionState, setRadioSelectionState] = useState("csv");
 const handleRadio = (e) => {
  setRadioSelectionState(e.target.value);
 };
 useEffect(() => {
  setRadioSelectionState("");
 }, []);
 const disablePrimaryButton = () => {
  let disable = false;
  if (radioSelectionState === "") {
   disable = true;
  }
  return disable;
 };

 const handleSubmit = async () => {
  let dataToSend = [];
  dataToSend = selectedReportValues.ids.map((id) => {
   return {
    reportConfigurationID: id,
    fileTypeName: "CSV",
    fileTypeExtension: "CSV",
   };
  });
  debugger;
  await runReport(dataToSend).then((res) => {});
  closeRunReportModal();
 };
 return (
  <>
   <FullScreenModal
    className="report-run-modal"
    open={isOpen}
    hasScrollingContent={false}
    iconDescription="Close"
    modalAriaLabel={"Run"}
    modalHeading={"Run"}
    onRequestClose={() => {}}
    onRequestSubmit={handleSubmit}
    onSecondarySubmit={closeRunReportModal}
    passiveModal={false}
    primaryButtonDisabled={disablePrimaryButton()}
    primaryButtonText={"Run"}
    secondaryButtonText="Cancel"
   >
    <>
     <div className="bx--row">
      <div className="bx--col">
       Select file type.
       <TooltipIcon
        className={"run-report-info-icon"}
        ariaLabel={"runReportToolTipLabel"}
        direction="right"
        tooltipText={
         <>
          <p>Excel - Changes in Excel file do not affect budget version and vice versa.</p>
          <p>Connected Excel - For authorixed users, changes in Excel file change budget version and vice versa.</p>
          <p>PDF - Changes in budget version do not change PDF and vise versa.</p>
          <p>Comma delimited (.csv) - Changes in budget version do not change .csv file and vice versa.</p>
         </>
        }
        align="start"
       >
        <Information16 />
       </TooltipIcon>
      </div>
     </div>
    </>

    <div className="bx--row">
     <div className="bx--col" style={{ paddingTop: "0px" }}>
      <RadioButtonGroup id="rdg_run_report_selection" defaultSelected={radioSelectionState} orientation="vertical" valueSelected={radioSelectionState}>
       <RadioButton
        id="rd_excel_run_report"
        value="excel"
        labelText="Excel"
        disabled={true}
        onClick={(e) => {
         handleRadio(e);
        }}
       />
       <RadioButton
        id="rd_connected_excel_run_report"
        value="connectedExcel"
        labelText="Connected Excel"
        disabled={true}
        onClick={(e) => {
         handleRadio(e);
        }}
       />
       <RadioButton
        id="rd_pdf_run_report"
        value="pdf"
        labelText="PDF"
        disabled={true}
        onClick={(e) => {
         handleRadio(e);
        }}
       />
       <RadioButton
        id="rd_csv_run_report"
        value="csv"
        labelText="Comma delimited (.csv)"
        checked={true}
        onClick={(e) => {
         handleRadio(e);
        }}
       />
      </RadioButtonGroup>
     </div>
    </div>
   </FullScreenModal>
  </>
 );
};

export default RunReportModal;
