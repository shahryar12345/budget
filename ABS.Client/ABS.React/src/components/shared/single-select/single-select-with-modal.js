import * as React from "react";
import FullScreenModal from "../budget-versions-modal/full-screen-modal";
import SingleSelectGroupDataGrid from "./single-select-group-data-grid";
import SingleSelectSimpleGrid from "./single-select-simple-grid";
import { getHeaders } from "./grid-headers/grid-header-service";
import { useState } from "react";
import { Search16 } from "@carbon/icons-react";
import { ComboBox, DataTableSkeleton, DropdownSkeleton } from "carbon-components-react";
import { useEffect } from "react";
import { getMappedRow } from "./single-select-data-mapper-service";


const SingleSelectModal = (props) => {
    const isEdit = (!props?.isEdit && props.isEdit !== undefined) ? false : true;
    const [modalOpenState, setModalOpenState] = useState(false);
    const [selectedItemState, setSelectedItemState] = useState(props.selectedItem);
    const [gridSelectedItemState, setGridSelectedItemState] = useState(props.selectedItem);
    const [gridDataState, setGridDataState] = useState([]);
    const [dataStates, setDataStates] = useState({ dropdownData: [], individualMembersGridData: [] });

    const onchangeHandler = (e) => {
        setSelectedItemState(e.selectedItem);
        props.onChange(e);
    }

    const openModal = () => {
        if (isEdit)
            setModalOpenState(true);
        //setGridSelectedItemState(selectedItemState);
    }

    useEffect(() => {
        if (props.isGroupedData) {
            props.gridData.forEach(row => {
                getMappedRow(row, getHeaders(props.name)[0].key);
            });
        }
        setGridDataState(props.gridData)
    }, [props.gridData])


    useEffect(() => {
        let dropdoownData = [...props.data];
        let individualMembersGridData = [];
        // We don't need this code to run in case of Budget Version selection.
        if (props.name !== 'Budget version') {
            individualMembersGridData = dropdoownData.filter((item) => {
                return !item.isGroup && !item.isHierarchy
            });
            individualMembersGridData = individualMembersGridData.map(row => {
                getMappedRow(row, getHeaders(props.name)[0].key);
                return row;
            });
        }
        setDataStates({ ...dataStates, dropdownData: [...dropdoownData], individualMembersGridData: [...individualMembersGridData] })
    }, [props.data])

    useEffect(() => {

        setSelectedItemState(props.selectedItem);
        setGridSelectedItemState(props.selectedItem);
    }, [props.selectedItem])

    const getSkeleton = () => {
        return <DataTableSkeleton
            columnCount={2}
            compact={false}
            rowCount={5}
            showHeader
            zebra={false}
            headers={getHeaders(props.name)}
        />
    }

    const getComboBoxSkeleton = () => {
        return <DropdownSkeleton />
    }

    const onSubmit = (e , byDoubleClick) => {
        let selectedItem = gridSelectedItemState;
        if(byDoubleClick)
        {
            selectedItem = props.data.find(r => r.id == e.selectedItem?.id)
        }
        setSelectedItemState(selectedItem);
        setModalOpenState(false);
        setGridSelectedItemState();
        props.onChange({selectedItem : selectedItem});
    }

    return <>
        {props.titleText &&
            <div className="bx--row single-select-header">
                <div className="bx--col-lg">
                    {props.titleText}
                </div>
            </div>
        }
        <div className={"bx--row single-select-dropdown"}>
            <div className={"bx--col-lg"}>
                <div className='single-select-combo-box-container'>
                    {
                        gridDataState.length
                            //&& dataStates.individualMembersGridData.length 
                            &&
                            dataStates.dropdownData.length ?
                            <ComboBox
                                id={props.id}
                                className='single-select-combo-box'
                                ariaLabel="Choose an item"
                                direction="bottom"
                                items={dataStates.dropdownData}
                                invalid={props?.invalid}
                                invalidText={props?.invalidText}
                                placeholder={props.placeholder || props.name}
                                itemToString={props.itemToString}
                                selectedItem={selectedItemState}
                                onChange={onchangeHandler}
                                onInputChange={props.onInputChange}
                                itemToElement={props.itemToElement}
                                disabled={!isEdit}
                            />
                            : getComboBoxSkeleton()
                    }
                </div>
            </div>
            <div className={"bx--col-lg-1"}>
                <div onClick={openModal} className='single-select-modal-trigger-icon-container'>
                    <Search16 />
                </div>
            </div>
        </div>
        <FullScreenModal
            className={`single-select-modal ${props.className}`}
            hasScrollingContent={false}
            iconDescription="Close"
            modalHeading={props.modalHeading ?? props.name}
            open={modalOpenState}
            onRequestClose={() => {
                //etGridSelectedItemState();
                 setModalOpenState(false) }}
            onRequestSubmit={(e) => onSubmit(e , false)}
            onSecondarySubmit={() => { 
                //setGridSelectedItemState(); 
                setModalOpenState(false)
            }}
            passiveModal={false}
            primaryButtonDisabled={!gridSelectedItemState}
            primaryButtonText="Select"
            secondaryButtonText="Cancel">

            {props.isGroupedData ?
                gridDataState.length
                    //&& dataStates.individualMembersGridData.length 
                    ? <SingleSelectGroupDataGrid
                        id={props.id}
                        headerData={getHeaders(props.name)}
                        rowData={gridDataState}
                        individualMembersGridData={dataStates.individualMembersGridData.length ? dataStates.individualMembersGridData : []}
                        modalState={modalOpenState}
                        name={props.name}
                        onSubmit={onSubmit}
                        hideGroupsToggle={props.hideGroupsToggle}
                        hideGroups={props.hideGroups}
                        onSelectionChange={(e) => { setGridSelectedItemState(props.data.find(r => r.id == e.selectedItem?.id)) }}
                        onPageSizeChange={(e) => {
                            if (props.onPageSizeChange) {
                                props.onPageSizeChange(e)
                            }
                        }}
                        groupSelectable={true}
                    /> : getSkeleton()
                : props.gridData ? <SingleSelectSimpleGrid
                    id={props.id}
                    headerData={getHeaders(props.name)}
                    modalState={modalOpenState}
                    rowData={props.gridData}
                    name={props.name}
                    onSubmit={(e) => onSubmit(e , true)}
                    onSelectionChange={(e) => { setGridSelectedItemState(props.data.find(r => r.id == e.selectedItem?.id)) }}
                    onPageSizeChange={(e) => {
                        if (props.onPageSizeChange) {
                            props.onPageSizeChange(e)
                        }
                    }}
                /> : getSkeleton()}

        </FullScreenModal>
    </>
}

export default SingleSelectModal;