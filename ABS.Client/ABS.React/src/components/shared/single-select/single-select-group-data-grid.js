import React, { useState, useEffect } from "react";
import {
    DataTable,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableHeader,
    TableCell,
    Pagination,
    TableToolbar,
    Search,
    RadioButton,
    TooltipIcon,
    Checkbox
} from "carbon-components-react";
import { ChevronDown16, ChevronUp16, ChevronRight16, ChevronLeft16 } from "@carbon/icons-react";
import './single-select.scss'

const SingleSelectGroupDataGrid = ({ headerData, rowData, individualMembersGridData ,modalState, onSelectionChange, initialSelectedValue, name, onSubmit, selectableLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], hideGroupsToggle = false, id, hideGroups = false, onPageSizeChange, groupSelectable }) => {

    const [rowsState, setRowsState] = useState([]);
    const [headersState, setHeadersState] = useState(headerData);
    const [tableSortState, setTableSortState] = useState({});
    const [searchStringState, setSearchStringState] = useState('');
    const [paginationState, setPaginationState] = useState({ page: 1, pageSize: 10 });
    const [totalCount, setTotalCount] = useState(0);
    const [hideGroupState, setHideGroupState] = useState(hideGroups);

    useEffect(() => {
        getPageData();
    }, [searchStringState, paginationState, tableSortState, hideGroupState])

    useEffect(() => {
        if (!modalState && document.getElementsByName('row').length) document.getElementsByName('row').forEach((row) => row.checked = false);
    }, [modalState])

    const handlePagination = (e) => {
        setPaginationState(e);
        if (onPageSizeChange) {
            onPageSizeChange(e);
        }
    }

    const getPageData = () => {        
        const filteredRows = filterBySort(filterBySearch(hideGroupsHandler()));
        setTotalCount(filteredRows.length);
        const startingIndex = (paginationState.page - 1) * paginationState.pageSize;
        setRowsState(filteredRows.slice(startingIndex, startingIndex + paginationState.pageSize));
    }

    const hideGroupsHandler = () => {
        if (!hideGroupState) return [...rowData];
        return [...individualMembersGridData]
    }

    const onInputChange = (e) => {
        setSearchStringState(e.target.value);
    }

    const filterBySearch = (rows) => {
        if (!searchStringState) return rows;
        return rows.filter(obj => Object.values(obj).some(val => val ? JSON.stringify(val).toLowerCase().includes(searchStringState.toLowerCase()) : false));
    }

    const filterBySort = (rows) => {
        if (!Object.keys(tableSortState).length) return rows;

        if (tableSortState.sortOrder == 'ASC')
            return rows.sort((a, b) => (JSON.stringify(a[tableSortState.sortColumn]) > JSON.stringify(b[tableSortState.sortColumn])) ? 1 : ((JSON.stringify(a[tableSortState.sortColumn]) < JSON.stringify(b[tableSortState.sortColumn])) ? -1 : 0));

        if (tableSortState.sortOrder == 'DESC')
            return rows.sort((a, b) => (JSON.stringify(a[tableSortState.sortColumn]) < JSON.stringify(b[tableSortState.sortColumn])) ? 1 : ((JSON.stringify(a[tableSortState.sortColumn]) > JSON.stringify(b[tableSortState.sortColumn])) ? -1 : 0));
    }

    const onHeaderClick = (sortColumn) => {
        if (!Object.keys(tableSortState).length || tableSortState.sortColumn != sortColumn) {
            setTableSortState({ sortColumn, sortOrder: 'ASC' })
            return;
        }
        switch (tableSortState.sortOrder) {
            case 'ASC':
                setTableSortState({ sortColumn, sortOrder: 'DESC' })
                return;
            case 'DESC':
                setTableSortState({});
                return;
            default:
                return;
        }
    }

    const toggleRows = (rowIndexArray) => {
        const rowsClone = JSON.parse(JSON.stringify(rowsState));
        let rowRef = { childRows: rowsClone };
        rowIndexArray.forEach(index => {
            rowRef = rowRef.childRows[index];
        });
        rowRef.isExpanded = !rowRef.isExpanded;
        setRowsState(rowsClone);
    }

    const getDepth = (row) => {
        var depth = 0;
        if (row.childRows?.length) {
            row.childRows.forEach(child => {
                var tmpDepth = getDepth(child)
                if (tmpDepth > depth) {
                    depth = tmpDepth
                }
            })
        }
        return 1 + depth
    }

    const selectRow = (e, row) => {
        const radioButton = e.target.parentElement.querySelector('input');
        if (radioButton) {
        radioButton.checked = true;
        onSelectionChange({ selectedItem: row });
        }
    }

    const handleDoubleClick = (e, row) => {
        selectRow(e, row);
        onSubmit();
    }

    const getTableRow = (row, rowIndexArray, isParentExpanded) => {
        const chevronProps = { onClick: (e) => toggleRows(rowIndexArray), className: 'single-select-group-table-row-chevron' };
        const hasChild = row.childRows?.length || row.isGroup || row.isHierarchy;
        const showChevron = row.childRows?.length;
        return <TableRow className={`${hasChild ? 'bold' : ''} ${isParentExpanded ? '' : 'single-select-group-table-collapsed-row'}`} key={row.id + "-" + name} id={row.id + "-" + name} onDoubleClick={(e) => handleDoubleClick(e, row)} onClick={(e) => selectRow(e, row)}>
            {hasChild && groupSelectable === false ?
                <TableCell></TableCell> :
                <TableCell>
                    {selectableLevels.includes(getDepth(row))
                        ? <RadioButton
                            onClick={() => {onSelectionChange(row) }}
                            name={name + "-" + id}
                            // id={row.id + "-" + name + "RadioButton-ID" + id}
                        ></RadioButton> : ''}
                </TableCell>
            }
            {headersState.map(header => (
                header.type == 'tree' ? <TableCell style={{ paddingLeft: 10 + (!row.childRows?.length && rowIndexArray.length > 1 ? 0 : 0) + (rowIndexArray.length - 1) * 20 }} key={row.id + header.key}>
                    {showChevron ? row.isExpanded ?
                        <ChevronUp16 {...chevronProps} /> :
                        <ChevronDown16 {...chevronProps} /> : ''}

                    {header.extraDetails?.map(detail => {
                        return `${!detail.isHidden ? row[header.key][detail.key] || '' : ""} `
                    })}
                </TableCell> : <TableCell key={row.id + header.key}>
                        {row[header.key]}
                    </TableCell>
            ))}
        </TableRow>
    }

    const getRow = (row, rowIndexArray, isParentExpanded) => {
        return <>
            {rowIndexArray.length ? getTableRow(row, rowIndexArray, isParentExpanded) : ""}
            {isParentExpanded && row.childRows?.map((nextLevelRow, nextLevelRowIndex) =>
                getRow(nextLevelRow, [...rowIndexArray, nextLevelRowIndex], row.isExpanded))}
        </>
    }

    const onChevronClick = (e, headerIndex, detailIndex) => {
        e.preventDefault();
        if (headersState[headerIndex].extraDetails.filter(item => item.isHidden === false).length == 1 && !headersState[headerIndex].extraDetails[detailIndex].isHidden) return;
        const headersClone = JSON.parse(JSON.stringify(headersState));
        headersClone[headerIndex].extraDetails[detailIndex].isHidden = !headersClone[headerIndex].extraDetails[detailIndex].isHidden;
        setHeadersState(headersClone);
    }

    return <DataTable
        isSortable={true}
        rows={rowsState}
        headers={headersState}
        paginationHandler={handlePagination}
        radio
        selectedRows={[initialSelectedValue]}
        render={({
            getHeaderProps,
            getSelectionProps,
            paginationHandler,
            selectRow
        }) => (
                <TableContainer className="single-select-group-table-container">
                    <TableToolbar>
                        <Search onChange={onInputChange} placeHolderText='Search' />
                        {hideGroupsToggle && <Checkbox
                            id={`${id}${name}-hide-groups`}
                            className='single-select-group-table-hide-group-checkbox'
                            checked={hideGroupState}
                            labelText="Hide groups"
                            onClick={(e) => setHideGroupState(e.target.checked)}

                        />}
                    </TableToolbar>
                    <div className="single-select-table-wrapper">
                        <Table className="single-select-group-table">
                            <TableHead>
                                <TableRow className="single-select-group-table-header-row">
                                    <TableHeader />
                                    {headersState.map((header, headerIndex) =>
                                        <TableHeader key={header.key} {...getHeaderProps({ header, onClick: () => onHeaderClick(header.key) })}>
                                            {header.header}
                                            <br />
                                            {header.extraDetails && (
                                                header.extraDetails.map((detail, detailIndex) => {
                                                    return (
                                                        <>
                                                            {detail.isHidden ?
                                                                <TooltipIcon direction='bottom' align='start' tooltipText={detail.showTooltipText}>
                                                                    <ChevronRight16 className='single-select-group-table-header-chevron' onClick={(e) => onChevronClick(e, headerIndex, detailIndex)} />
                                                                </TooltipIcon> : <>
                                                                    <TooltipIcon direction='bottom' align='start' tooltipText={detail.hideTooltipText}>
                                                                        <ChevronLeft16 className='single-select-group-table-header-chevron' onClick={(e) => onChevronClick(e, headerIndex, detailIndex)} />
                                                                    </TooltipIcon> {detail.text} </>}
                                                        </>)
                                                })
                                            )}
                                        </TableHeader>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rowsState.length ? getRow({ childRows: rowsState, isExpanded: true }, [], true) : ""}
                            </TableBody>
                        </Table>
                    </div>
                    {!rowsState.length ? <p className="table-no-data"> No records found.</p> : ""}
                    <Pagination
                        id={"single-select-group-table-pagination-" + name}
                        pageSizes={[10, 20, 50, 100]}
                        totalItems={totalCount}
                        onChange={handlePagination}
                    />
                </TableContainer >
            )}
    />

}

export default SingleSelectGroupDataGrid;