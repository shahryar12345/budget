import * as React from "react";
import { useState, useEffect } from "react";
import { Search16 } from "@carbon/icons-react";
import { ComboBox, MultiSelect, DataTableSkeleton, DropdownSkeleton } from "carbon-components-react";
import FullScreenModal from "../budget-versions-modal/full-screen-modal";
import SingleSelectSimpleGrid from "../single-select/single-select-simple-grid";
import { getHeaders } from "../single-select/grid-headers/grid-header-service";

const MultiSelectBudgetVersionModal = (props) => {
 const [modalOpenState, setModalOpenState] = useState(false);
 //const [selectedItemState, setSelectedItemState] = useState(props.selectedItem);
 const [gridSelectedItemState, setGridSelectedItemState] = useState([]);
 const [gridDataState, setGridDataState] = useState([]);
 const [dataStates, setDataStates] = useState({ dropdownData: [], individualMembersGridData: [] });
 const [gridKeyCount, SetgridKeyCount] = useState(1);

 const getMultiSelectSkeleton = () => {
  return <DropdownSkeleton />;
 };
 const openModal = () => {
  setModalOpenState(true);
 };
 const getSkeleton = () => {
  return <DataTableSkeleton columnCount={2} compact={false} rowCount={5} showHeader zebra={false} headers={getHeaders(props.name)} />;
 };

 const handleCheckBox = (e) => {
  props.onChange({ ...e, byMultiselect: true });
 };

 const onSubmit = (submittedRow) => {
  let allSelectedRows = gridSelectedItemState;
  if (Array.isArray(submittedRow) && submittedRow.length > 0) {
   // check for duplicates first
   let indexFound = gridSelectedItemState.findIndex((row) => {
    return row.id === submittedRow[0].id;
   });
   if (indexFound === -1) {
    allSelectedRows = [...gridSelectedItemState, ...submittedRow];
   }
  }
  props.onChange({ selectedItems: allSelectedRows, byMultiselect: false });
  setModalOpenState(false);
  setGridSelectedItemState([]);
  SetgridKeyCount(gridKeyCount + 1);
 };

 const handleSelectionChange = (e) => {
  setGridSelectedItemState([...e]);
 };

 return (
  <>
   {props.titleText && (
    <div className="bx--row single-select-header">
     <div className="bx--col-lg">{props.titleText}</div>
    </div>
   )}
   <div className={"bx--row single-select-dropdown"}>
    <div className={"bx--col-lg"}>
     <div className="single-select-combo-box-container">
      {
       //dataStates.dropdownData.length ?
       <MultiSelect
        //={props.name}
        items={props.multiselectData}
        invalid={props?.invalid}
        invalidText={props?.invalidText}
        placeholder={props.placeholder || props.name}
        itemToString={props.itemToString}
        key={"report-bv-multiselect" + gridKeyCount}
        direction="bottom"
        id={"custom-datatable-views-multiselect-BudgetVersion"}
        initialSelectedItems={props.initialSelectedItems}
        label="Choose"
        labelText="Choose"
        light={false}
        locale="en"
        onChange={(e) => {
         handleCheckBox(e);
        }}
        titleText={props.name}
        ariaLabeleddBy={"Open menu"}
        title={props.name}
        type="default"
        selectedItems={props.selectedItems}
        ariaLabel={"listbox"}
       />
       //: (       getMultiSelectSkeleton())
      }
     </div>
    </div>
    <div className={"bx--col-lg-1"} style={{ paddingRight: "0px", maxWidth: "1.333%" , marginTop:"13px"}}>
     <div onClick={openModal} className="multi-select-modal-trigger-icon-container">
      <Search16 />
     </div>
    </div>
   </div>
   <FullScreenModal
    className={`multi-select-modal ${props.className}`}
    hasScrollingContent={false}
    iconDescription="Close"
    modalHeading={props.modalHeading ?? props.name}
    open={modalOpenState}
    onRequestClose={() => {
     setModalOpenState(false);
     SetgridKeyCount(gridKeyCount + 1);
    }}
    onRequestSubmit={onSubmit}
    onSecondarySubmit={() => {
     setModalOpenState(false);
     SetgridKeyCount(gridKeyCount + 1);
    }}
    passiveModal={false}
    primaryButtonDisabled={!gridSelectedItemState.length}
    primaryButtonText="Select"
    secondaryButtonText="Cancel"
   >
    {props.gridData ? (
     <SingleSelectSimpleGrid
      id={props.id}
      key={"report-bv-multiselect-grid" + gridKeyCount}
      headerData={getHeaders(props.name)}
      modalState={modalOpenState}
      rowData={props.gridData}
      name={props.name}
      onSubmit={onSubmit}
      onSelectionChange={(e) => {
       // Will recieve selected items in an Array
       // e : []
       handleSelectionChange(e);
      }}
      onPageSizeChange={(e) => {
       if (props.onPageSizeChange) {
        props.onPageSizeChange(e);
       }
      }}
      isMultiselect={true}
     />
    ) : (
     getSkeleton()
    )}
   </FullScreenModal>
  </>
 );
};

export default MultiSelectBudgetVersionModal;
