import * as React from "react";
import FullScreenModal from "../budget-versions-modal/full-screen-modal";
import SingleSelectGroupDataGrid from "./single-select-group-data-grid";
import SingleSelectSimpleGrid from "./single-select-simple-grid";
import { getHeaders } from "./grid-headers/grid-header-service";
import { useState } from "react";
import { Search16 } from "@carbon/icons-react";
import { ComboBox, Modal, DataTableSkeleton } from "carbon-components-react";
import { useEffect } from "react";
import { getMappedRow } from "./single-select-data-mapper-service";

const SingleSelectIndividualModal = (props) => {
  const [selectedItemState, setSelectedItemState] = useState(
    props.selectedItem
  );
  const [gridSelectedItemState, setGridSelectedItemState] = useState(
    props.selectedItem
  );
  const [gridDataState, setGridDataState] = useState([]);

  useEffect(() => {
    if (props.isGroupedData) {
      props.gridData.forEach((row) => {
        getMappedRow(row, getHeaders(props.name)[0].key);
      });
    }
    setGridDataState(props.gridData);
  }, [props.gridData]);

  const getSkeleton = () => {
    return (
      <DataTableSkeleton
        columnCount={2}
        compact={false}
        rowCount={5}
        showHeader
        zebra={false}
        headers={getHeaders(props.name)}
      />
    );
  };

  const onSubmit = () => {
    setSelectedItemState(gridSelectedItemState);
    setGridSelectedItemState();
    props.submitClick(
      gridSelectedItemState.statisticsCodeID,
      props.statisticsModalStates.statisticsType,
      props.statisticsModalStates.selectedRowIndexes,
      true
    );
    props.closeModal();
  };

  return (
    <>
      <FullScreenModal
        className="single-select-modal"
        hasScrollingContent={false}
        iconDescription="Close"
        modalHeading={props.modalHeading ?? props.name}
        open={props.openModal}
        onRequestClose={() => {
          setGridSelectedItemState();
          props.closeModal();
        }}
        onRequestSubmit={onSubmit}
        onSecondarySubmit={() => {
          setGridSelectedItemState();
          props.closeModal();
        }}
        passiveModal={false}
        primaryButtonDisabled={!gridSelectedItemState}
        primaryButtonText="Select"
        secondaryButtonText="Cancel"
      >
        {props.isGroupedData ? (
          gridDataState.length ? (
            <SingleSelectGroupDataGrid
              id={props.id}
              headerData={getHeaders(props.name)}
              rowData={gridDataState}
              modalState={props.openModal}
              name={props.name}
              onSubmit={onSubmit}
              hideGroupsToggle={props.hideGroupsToggle}
              hideGroups={props.hideGroups}
              onSelectionChange={(e) => {
                setGridSelectedItemState(
                  props.data.find((r) => r.id == e.selectedItem?.id)
                );
              }}
              groupSelectable={true}
            />
          ) : (
            getSkeleton()
          )
        ) : props.gridData ? (
          <SingleSelectSimpleGrid
            id={props.id}
            headerData={getHeaders(props.name)}
            modalState={props.openModal}
            rowData={props.gridData}
            name={props.name}
            onSubmit={onSubmit}
            onSelectionChange={(e) => {
              setGridSelectedItemState(
                props.data.find((r) => r.id == e.selectedItem?.id)
              );
            }}
          />
        ) : (
          getSkeleton()
        )}
      </FullScreenModal>
    </>
  );
};

export default SingleSelectIndividualModal;
