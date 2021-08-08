import * as React from "react";
import { useState, useEffect } from "react";
import { Search16, Information16 } from "@carbon/icons-react";
import { ComboBox, MultiSelect, TooltipIcon, DataTableSkeleton, DropdownSkeleton, RadioButtonGroup, RadioButton } from "carbon-components-react";
import FullScreenModal from "../budget-versions-modal/full-screen-modal";
import SingleSelectSimpleGrid from "../single-select/single-select-simple-grid";
import { getOnlyNameHeaders } from "./multi-select-header-service";
import MultiSelectQuickPickGrid from "../multi-select/multi-select-dimension-grid-with-quickpicks";
import { getMappedRow } from "../single-select/single-select-data-mapper-service";

const MultiSelectDimensionWithModal = (props) => {
 const [modalOpenState, setModalOpenState] = useState(false);
 //const [selectedItemState, setSelectedItemState] = useState(props.selectedItem);
 const [gridSelectedItemState, setGridSelectedItemState] = useState([]);
 const [gridDataState, setGridDataState] = useState([]);
 const [dataStates, setDataStates] = useState({ individualMembersGridData: [] });
 const [gridKeyCount, SetgridKeyCount] = useState(1);
 const [multiselectKey, setMultiselectKey] = useState(1);

 const openModal = () => {
  setModalOpenState(true);
 };
 const getSkeleton = () => {
  return <DataTableSkeleton columnCount={2} compact={false} rowCount={5} showHeader zebra={false} headers={getOnlyNameHeaders(props.name)} />;
 };
 const handleCheckboxSelect = (e) => {
  props.onChange(e);
 };

 const getMultiSelectSkeleton = () => {
  return <DropdownSkeleton />;
 };

 useEffect(() => {
  if (props.isGroupedData) {
   props.gridData.forEach((row) => {
    getMappedRow(row, getOnlyNameHeaders(props.name)[0].key);
   });
  }
  setGridDataState(props.gridData);
 }, [props.gridData]);

 useEffect(() => {
  let individualMembersGridData = JSON.parse(
   JSON.stringify(
    props.individualMembersGridData.filter((item) => {
     return !item.isGroup && !item.isHierarchy && !item.isMaster;
    })
   )
  );

  individualMembersGridData = individualMembersGridData.map((row) => {
   getMappedRow(row, getOnlyNameHeaders(props.name)[0].key);
   return row;
  });
  setDataStates({ individualMembersGridData: individualMembersGridData });
 }, [props.individualMembersGridData]);

 return (
  <>
   {props.titleText && (
    <div className="bx--row single-select-header">
     <div className="bx--col-lg">{props.titleText}</div>
    </div>
   )}

   <div className={"bx--row single-select-dropdown multi-select-dimension-row"}>
    <div className={"bx--col-lg-6"}>
     <div className="multi-select-combo-box-container">
      {props.multiselectData.length ? (
       <MultiSelect
        sortItems={() => {
         return props.multiselectData;
        }}
        items={props.multiselectData}
        helperText={""}
        useTitleInItem={true}
        ariaLabel={props.placeholder}
        invalid={props?.invalid}
        invalidText={props?.invalidText}
        placeholder={props.placeholder || props.name}
        itemToString={props.itemToString}
        key={"report-dimension-multiselect" + "-" + props.name + "-" + multiselectKey}
        direction="bottom"
        id={"custom-datatable-views-multiselect-" + props.name}
        initialSelectedItems={props.initialSelectedItems}
        label={props.placeholder}
        labelText={props.placeholder}
        light={false}
        locale="en"
        onChange={(e) => {
         handleCheckboxSelect(e);
        }}
        selectionFeedback="top"
        //titleText={props.placeholder}
        titleText={
         <>
          <span> {props.placeholder}</span>{" "}
          <TooltipIcon align="start" tooltipText={"In the dropdown, select a group (does not select the members in the group) or select group members."} direction={"top"}>
           <Information16 />
          </TooltipIcon>
         </>
        }
        title={props.placeholder}
        aria-label={props.placeholder}
        ariaLabeleddBy={props.placeholder}
        type="default"
        selectedItems={props.selectedItems}
       />
      ) : (
       getMultiSelectSkeleton()
      )}
     </div>
    </div>
    <div className={"bx--col-lg-1"} style={{ paddingLeft: "0px", maxWidth: "1.333%", marginTop: props.multiselectData.length ? "41px" : "13px", marginLeft: "-15px", marginRight: "15px" }}>
     <TooltipIcon align="center" tooltipText={"Select a group and/or its members or individual items."} direction={"top"}>
      <Search16 onClick={openModal} />
      {/* <div onClick={openModal} className="multi-select-modal-trigger-icon-container">
      </div> */}
     </TooltipIcon>
    </div>
    <div className="bx--col-lg-5">
     <span>Display</span>
     <RadioButtonGroup id={"rdg_report_" + props.name + "_display"} className={"report-radio-button-group"} orientation="vertical" valueSelected={props.radioSelectedValue}>
      {props.reportDisplayOption.map((radioButton) => {
       return (
        <RadioButton
         id={"rd_period" + radioButton.itemTypeValue + "-" + props.name}
         key={"rd_period" + radioButton.itemTypeValue + "-" + props.name}
         value={radioButton.itemTypeValue}
         disabled={
          radioButton.itemTypeValue == 1
           ? props.initialSelectedItems?.length > 1 ||
             props.initialSelectedItems?.find((item) => {
              return item?.id === "all";
             })
             ? true
             : false
           : false
         }
         labelText={
          <>
           <span style={{ marginRight: "0px" }}> {radioButton.itemTypeDisplayName} </span>
           {radioButton.itemTypeValue == 1 ? (
            <TooltipIcon align="end" tooltipText={"Filters the entire report on this item. Shows the item in the report header."} direction={"top"}>
             <Information16 />
            </TooltipIcon>
           ) : null}
          </>
         }
         onClick={(e) => {
          props.handleRadioSelection(e);
         }}
        />
       );
      })}
     </RadioButtonGroup>
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
     setMultiselectKey(multiselectKey + 1);
    }}
    onRequestSubmit={() => {
     handleCheckboxSelect({ selectedItems: [...gridSelectedItemState] });
     setMultiselectKey(multiselectKey + 1);
     setModalOpenState(false);
    }}
    onSecondarySubmit={() => {
     setModalOpenState(false);
     SetgridKeyCount(gridKeyCount + 1);
     setMultiselectKey(multiselectKey + 1);
    }}
    passiveModal={false}
    primaryButtonDisabled={!gridSelectedItemState.length}
    primaryButtonText="Select"
    secondaryButtonText="Cancel"
   >
    {gridDataState.length ? (
     <MultiSelectQuickPickGrid
      id={props.id}
      headerData={getOnlyNameHeaders(props.name)}
      rowGroupedData={gridDataState}
      individualMembersGridData={dataStates.individualMembersGridData}
      modalState={modalOpenState}
      name={props.name}
      onSubmit={
       () => {}
       //onSubmit
       //setModalOpenState(false)
      }
      hideGroupsToggle={props.hideGroupsToggle}
      hideGroups={props.hideGroups}
      onSelectionChange={(e) => {
       setGridSelectedItemState([...e.selectedItems]);
      }}
      onPageSizeChange={(e) => {
       if (props.onPageSizeChange) {
        props.onPageSizeChange(e);
       }
      }}
      groupSelectable={true}
     ></MultiSelectQuickPickGrid>
    ) : (
     getSkeleton()
    )}
    {/* {props.gridData ? (
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
    )} */}
   </FullScreenModal>
  </>
 );
};

export default MultiSelectDimensionWithModal;
