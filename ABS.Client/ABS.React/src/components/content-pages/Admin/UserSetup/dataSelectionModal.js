import React, { useEffect, useState } from "react";
import {
    DataTable,
    Pagination,
    InlineLoading,
    Button,
    Checkbox,
} from "carbon-components-react";
import FullScreenModal from "../../../shared/budget-versions-modal/full-screen-modal";

const {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} = DataTable;

const initialState = {
    unSelectedData: [],
    selectedData: [],
    allSelectedData: [],
    leftTablePageNo: 1,
    leftTableItemsPerPage: 7,
    rightTablePageNo: 1,
    rightTableItemsPerPage: 7,
    allData: []
}

const DataSelectingModal = ({
    isOpen,
    data,
    selectedDataProps,
    getSelectedData,
    dialogHeading,
    leftSideHeading,
    rightSideHeading,
    idKey,
    nameKey,
    closeModal
}) => {

    const [state, setState] = useState(initialState)
    //   console.log({ selectedDataProps })

    useEffect(() => {
        if (isOpen) {
            //console.log({ selectedDataProps })
            let allData = data.map(dt => ({ ...dt, isSelected: false }))
            selectedDataProps = selectedDataProps.map(dt => ({ ...dt, isSelected: true }))
            let unSelectedData = [];
            // if (allData.length > 7) unSelectedData = toRemoveLeftDatafromRight([...allData.slice(0, 7)], selectedDataProps.slice((state.rightTablePageNo - 1) * state.rightTableItemsPerPage, (state.rightTablePageNo - 1) * state.rightTableItemsPerPage + state.rightTableItemsPerPage));
            // else unSelectedData = toRemoveLeftDatafromRight([...allData], selectedDataProps.slice((state.rightTablePageNo - 1) * state.rightTableItemsPerPage, (state.rightTablePageNo - 1) * state.rightTableItemsPerPage + state.rightTableItemsPerPage))
            // if (allData.length > 7) unSelectedData = toRemoveLeftDatafromRight([...allData.slice(0, 7)], selectedDataProps.slice((state.rightTablePageNo - 1) * state.rightTableItemsPerPage, (state.rightTablePageNo - 1) * state.rightTableItemsPerPage + state.rightTableItemsPerPage));
            // else unSelectedData = toRemoveLeftDatafromRight([...allData], selectedDataProps.slice((state.rightTablePageNo - 1) * state.rightTableItemsPerPage, (state.rightTablePageNo - 1) * state.rightTableItemsPerPage + state.rightTableItemsPerPage))
            allData = toRemoveLeftDatafromRight([...allData], selectedDataProps);
            setState({
                ...state,
                allSelectedData: [...selectedDataProps],
                selectedData: selectedDataProps.slice((state.rightTablePageNo - 1) * state.rightTableItemsPerPage, (state.rightTablePageNo - 1) * state.rightTableItemsPerPage + state.rightTableItemsPerPage),
                unSelectedData: [...allData.slice(0, 7)],
                allData
            })
        }
    }, [data, selectedDataProps.length, isOpen])

    const leftTablePaginationHandler = async ({ page, pageSize }) => {
        setState({
            ...state,
            leftTablePageNo: page,
            leftTableItemsPerPage: pageSize,
            unSelectedData: toRemoveLeftDatafromRight(state.allData.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize), state.selectedData)
        })
    };

    const rightTablePaginationHandler = async ({ page, pageSize }) => {
        setState({
            ...state,
            rightTablePageNo: page,
            rightTableItemsPerPage: pageSize,
            selectedData: state.allSelectedData.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
        })
    };

    const moveSelectedDataToRight = () => {
        let selectedData = state.unSelectedData.filter(data => data.isSelected).map(data => ({ ...data, isSelected: true }))
        const unSelectedData = state.unSelectedData.filter(data => !data.isSelected).map(data => ({ ...data, isSelected: false }))
        const allSelectedData = [...state.allSelectedData, ...selectedData];
        selectedData = allSelectedData.slice((state.rightTablePageNo - 1) * state.rightTableItemsPerPage, (state.rightTablePageNo - 1) * state.rightTableItemsPerPage + state.rightTableItemsPerPage)
        if (selectedData.length) {
            setState({
                ...state,
                selectedData,
                unSelectedData,
                allSelectedData
            })
        }

    }

    const toRemoveLeftDatafromRight = (leftArray, rightArray) => {
        let arr = [];
        leftArray.forEach(data => {
            if (!rightArray.some(dt => dt[idKey] === data[idKey])) {
                arr.push(data)
            }
        })
        return arr;
    }

    const moveSelectedDataToLeft = () => {
        //  debugger
        // let allSelectedData = state.allSelectedData.filter(data => !data.isSelected).map(data => ({ ...data, isSelected: false }));
        let allSelectedData = state.allSelectedData.filter(data => !data.isSelected);
        // let selectedData = allSelectedData.slice((state.rightTablePageNo - 1) * state.rightTableItemsPerPage, (state.rightTablePageNo - 1) * state.rightTableItemsPerPage + state.rightTableItemsPerPage)
        let selectedData = allSelectedData.slice((1 - 1) * state.rightTableItemsPerPage, (1 - 1) * state.rightTableItemsPerPage + state.rightTableItemsPerPage)
        let allData = toRemoveLeftDatafromRight(data, selectedData)
        let unSelectedData = toRemoveLeftDatafromRight(allData.slice((state.leftTablePageNo - 1) * state.leftTableItemsPerPage, (state.leftTablePageNo - 1) * state.leftTableItemsPerPage + state.leftTableItemsPerPage), selectedData)
        setState({
            ...state,
            allSelectedData,
            allData,
            selectedData,
            unSelectedData,
            rightTablePageNo: 1,
        })
    }
    const moveAllDataToRight = () => {
        let selectedData = []
        let unSelectedData = []

        if (state.allData.length > 7) {
            selectedData = [...state.allData.slice(0, 7)]
        }
        else selectedData = [...state.allData]
        selectedData = selectedData.map(dt => ({ ...dt, isSelected: true }))
        setState({
            ...state,
            selectedData,
            allSelectedData: [...state.allData.map(dt => ({ ...dt, isSelected: true }))],
            unSelectedData,
            allData: [],
            leftTablePageNo: 1,
            leftTableItemsPerPage: 7,
            rightTablePageNo: 1,
            rightTableItemsPerPage: 7,
        })

    }
    const moveAllDataToLeft = () => {
        let selectedData = []
        let unSelectedData = []
        if (data.length > 7) unSelectedData = [...data.slice(0, 7)]
        else unSelectedData = [...data]
        setState({
            ...state,
            selectedData,
            allSelectedData: [],
            unSelectedData,
            allData: [...data],
            leftTablePageNo: 1,
            leftTableItemsPerPage: 7,
            rightTablePageNo: 1,
            rightTableItemsPerPage: 7,
        })

    }
    const onSubmit = () => {
        getSelectedData(state.allSelectedData);
    }

    const handleCheckBoxOnLeftTable = (selectedRowId, bool) => {
        const unSelectedData = state.unSelectedData.map(data => {
            if (data[idKey] === selectedRowId)
                return { ...data, isSelected: bool }
            return { ...data }
        })
        setState({
            ...state,
            unSelectedData
        })
    }

    const handleCheckBoxOnRightTable = (selectedRowId, bool) => {
        const allSelectedData = state.allSelectedData.map(data => {
            if (data[idKey] === selectedRowId)
                return { ...data, isSelected: bool }
            return { ...data }
        })
        setState({
            ...state,
            allSelectedData,
            selectedData: allSelectedData.slice((state.rightTablePageNo - 1) * state.rightTableItemsPerPage, (state.rightTablePageNo - 1) * state.rightTableItemsPerPage + state.rightTableItemsPerPage)
        })
    }

    const btnsValidations = (btnType) => {
        let bool = true
        switch (btnType) {
            case ">> All":
                if (state.unSelectedData.length) bool = false;
                return bool;
            case "> Select":
                for (let su of state.unSelectedData) {
                    if (su.isSelected) {
                        bool = false;
                        break
                    }
                }
                return bool;
            case "< Remove":
                for (let su of state.selectedData) {
                    if (su.isSelected) {
                        bool = false;
                        break
                    }
                }
                return bool;
            case "<< All":
                if (state.selectedData.length) bool = false;
                return bool;
        }
    }

    const toFillRemaningSpaceInTable = (curretDataLength = 0) => {
        const arr = []
        for (let i = 0; i < (curretDataLength === 0 ? 14 : 7) - curretDataLength; i++) {
            arr.push({ id: i })
        }
        return arr.map(row => (
            <TableRow key={row.id}>
                <TableCell key={row.id}>
                </TableCell>
            </TableRow>
        ))
    }

    return (
        <>
            {isOpen ? <FullScreenModal
                open={isOpen}
                hasScrollingContent={true}
                iconDescription="Close"
                modalHeading={dialogHeading}
                onRequestClose={() => { closeModal() }}
                onRequestSubmit={onSubmit}
                onSecondarySubmit={() => { closeModal() }}
                passiveModal={false}
                primaryButtonDisabled={false}
                primaryButtonText="Apply"
                secondaryButtonText="Cancel"
                size='xl'
                focusTrap={false}
            >
                <div className="bx--grid">
                    {!state.allData.length && !data.length ? <InlineLoading /> : <div className="bx--row">
                        <div className="bx--col-md-3 entities">
                            <DataTable
                                rows={[]}
                                headers={[]}
                            >
                                {({ rows, headers, getHeaderProps, getTableProps }) => (
                                    <TableContainer title={leftSideHeading}>
                                        <Table {...getTableProps()} size='compact'>
                                            <TableBody className="tableDiv">
                                                {
                                                    state.unSelectedData.map((row) => (
                                                        <TableRow key={row[idKey]}>
                                                            <TableCell key={row[idKey]}>
                                                                <Checkbox
                                                                    id={`AutoUpdateCheckBox-rd1${idKey}${row[idKey]}`}
                                                                    labelText={
                                                                        row[nameKey]
                                                                    }
                                                                    checked={row.isSelected}
                                                                    onClick={(e) => {
                                                                        handleCheckBoxOnLeftTable(row[idKey], !row.isSelected)
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                                {toFillRemaningSpaceInTable(state.unSelectedData.length)}
                                            </TableBody>
                                        </Table>
                                        <Pagination
                                            id={`${idKey}left`}
                                            pageSizes={[7]}
                                            pageSize={state.leftTableItemsPerPage}
                                            page={state.leftTablePageNo}
                                            totalItems={state.allData.length}
                                            onChange={leftTablePaginationHandler}
                                            className="bx--pagination dataSelectionModalPagination"
                                        />
                                    </TableContainer>
                                )}
                            </DataTable>
                        </div>
                        <div className="bx--col-md-2">
                            <div className="btnSections">
                                <div>
                                    <Button id={`allToRight${idKey}`}
                                        className="bx--btn--primary entitiesBtns" type="Submit"
                                        onClick={(e) => { moveAllDataToRight() }}
                                        disabled={btnsValidations(`>> All`)}>
                                        {`>> All`}
                                    </Button>
                                </div>
                                <div>
                                    <Button id={`select${idKey}`}
                                        className="bx--btn--primary entitiesBtns" type="Submit"
                                        onClick={(e) => { moveSelectedDataToRight() }}
                                        disabled={btnsValidations(`> Select`)}>
                                        {`> Select`}
                                    </Button>
                                </div>
                                <div>
                                    <Button id={`remove${idKey}`}
                                        className="bx--btn--primary entitiesBtns" type="Submit"
                                        onClick={(e) => { moveSelectedDataToLeft() }}
                                        disabled={btnsValidations(`< Remove`)}>
                                        {`< Remove`}
                                    </Button>
                                </div>
                                <div>
                                    <Button id={`allToLeft${idKey}`}
                                        className="bx--btn--primary entitiesBtns" type="Submit"
                                        onClick={(e) => { moveAllDataToLeft() }}
                                        disabled={btnsValidations(`<< All`)}>
                                        {`<< All`}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="bx--col-md-3 entities">
                            <DataTable
                                rows={[]}
                                headers={[]}>
                                {({ rows, headers, getHeaderProps, getTableProps }) => (
                                    <TableContainer title={rightSideHeading}>
                                        <Table {...getTableProps()} size='compact'>
                                            <TableBody className="tableDiv">
                                                {
                                                    state.selectedData.map((row) => (
                                                        <TableRow key={row[idKey]}>
                                                            <TableCell key={row[idKey]}>
                                                                <Checkbox
                                                                    id={`AutoUpdateCheckBox-rd2${row[idKey]}`}
                                                                    labelText={
                                                                        row[nameKey]
                                                                    }
                                                                    checked={row.isSelected}
                                                                    onClick={(e) => {
                                                                        handleCheckBoxOnRightTable(row[idKey], !row.isSelected)
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                                {toFillRemaningSpaceInTable(state.selectedData.length)}
                                            </TableBody>
                                        </Table>
                                        <Pagination
                                            id={`${idKey}right`}
                                            pageSizes={[7]}
                                            pageSize={state.rightTableItemsPerPage}
                                            page={state.rightTablePageNo}
                                            totalItems={state.allSelectedData.length}
                                            onChange={rightTablePaginationHandler}
                                            className="bx--pagination dataSelectionModalPagination"
                                        />

                                    </TableContainer>
                                )}
                            </DataTable>

                        </div>
                    </div>}
                </div>
            </FullScreenModal> : ""}
        </>
    )
}
export default DataSelectingModal

