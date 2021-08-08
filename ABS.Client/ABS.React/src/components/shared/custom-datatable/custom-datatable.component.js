import { Checkbox, DataTable, Pagination, TooltipIcon, Button, MultiSelect } from 'carbon-components-react';
import { ChevronDown16, ChevronLeft16, ChevronRight16, ChevronUp16, Close16, Edit16, Play16, TreeView16, WarningAlt16 } from '@carbon/icons-react';
import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { SpreadMethodTypes, getChange } from './spread-methods'
import FullScreenModal from "../budget-versions-modal/full-screen-modal";

import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { formatValue, formatNumber, parseNumber } from '../../../services/format-service';

import './custom-datatable.scss';
import { getHeaders, headersNames } from './header-service';
import { getToolbarOptions, getToolbarState } from './toolbar-service';
import CustomDataTableOverflowMenu from './custom-datatable-overflow-menu';
import { max } from 'moment';

const {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
    TableToolbar,
    TableToolbarContent,
    TableToolbarAction,
    TableToolbarSearch
} = DataTable;

const styles = {
    hideMonth: {
        marginTop: '10px',
        marginRight: '20px'
    },
    hideRows: {
        marginTop: "10px",
        marginRight: "40px",
    },
}

export const CustomDatatable = forwardRef(({ timePeriod, rows, ScenarioTypeInTable, handleForecastClick, budgetVersionType, handleEditChange, handleAddRowModal, type, handleInflationClick, handleOverflowActions, staffingOptions, handleRaisesClick, handleViewsChange, selectedViews, handleManualWageClick, showGroupedData, handletoogleGroupedData, paginationHandler, paginationState }, ref) => {
    const monthNames = getHeaders(headersNames.month);

    // Hack: check focus element
    const [isCloseButtonFocused, setCloseButtonFocus] = useState(false);
    const [currentEditableCellState, setCurrentEditableCellState] = useState({});
    const [unSavedChangesState, setUnSavedChangesState] = useState([]);
    const [headersState, setHeadersState] = useState({ headers: getHeaders(type) });
    const [rowsState, setRowsState] = useState({ rows: rows });
    const [toolBarState, setToolBarState] = useState(selectedViews ? selectedViews : getToolbarState(type));
    const [toolBarControls, settoolBarControlsState] = useState(getToolbarOptions(`${budgetVersionType}${type}`))
    const [confirmationModalState, setConfirmationModalState] = useState({ open: false });
    const [isMultiSelectOpen, isMultiSelectOpenToggle] = useState(false);
    const maxLevel = type == 'staffing' ? 4 : 3;
    const userDetails = useSelector((state) => state.UserDetails);


    useEffect(() => {
        if (!confirmationModalState.open) setTimeout(() => setConfirmationModalState({ ...confirmationModalState, open: false }), 500);
    }, [confirmationModalState.open])

    const handleSubmit = (id, row) => {
        handleOverflowActions(id, row);
        setConfirmationModalState({ ...confirmationModalState, open: false });
    }

    useEffect(() => {
        setFiscalYearStartMonth();
    }, [timePeriod, toolBarState])

    useEffect(() => {
        setFiscalYearStartMonth();
        // get toolbar options
        const toolbarOptions = getToolbarOptions(`${budgetVersionType}${type}`).filter(option => {
            return (
                type !== 'staffing' || // only filtering staffing options for now
                !option.itemTypeId || // if no item type ID on option, we want it
                staffingOptions.includes(option.itemTypeDisplayName) // staffingOptions array contains all item types we're using
            );
        });

        // set available toolbar options
        settoolBarControlsState(toolbarOptions);

        //temp: calculate if data found
        if (rows.length && Object.keys(rows[0]).length) populateDependentData({ childRows: rows }, toolBarState['fte']);

        setRowsState({ rows });
        setUnSavedChangesState([]);
        let presentNewRow = false;
        if (rows.length && Object.keys(rows[0]).length) {
            presentNewRow = rows.find((item) => item.entity.rowAdded === true)
            if (presentNewRow) {
                presentNewRow = true;
            } else {
                presentNewRow = false;
            }
        }
        setToolBarState({ ...toolBarState, showAddedRowCheckBox: presentNewRow })
    }, [rows]);

    useEffect(() => {
        // on first page visit save the header Config in localstorage. 
        if (!localStorage.getItem("headerConfig")) {
            const headerConfig = {
                Entity: { showCode: true, showName: true },
                Department: { showCode: true, showName: true },
                Statistics: { showCode: true, showName: true },
                GL_Account: { showCode: true, showName: true },
                Job_code: { showCode: true, showName: true },
                Pay_types: { showCode: true, showName: true },
            }
            localStorage.setItem('headerConfig', JSON.stringify(headerConfig))
        } else {
            // If header config already saved , so now update the stats accordiglly.
            let headerConfig = JSON.parse(localStorage.getItem("headerConfig"));
            let headers = headersState.headers;
            headers.forEach((header) => {
                let headerConfigObj = headerConfig[header.header];
                header.extraDetails[0].isHidden = !headerConfigObj.showCode;
                header.extraDetails[1].isHidden = !headerConfigObj.showName;
            });
            setFiscalYearStartMonth({ headers: headers });
        }
    }, [])

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
    const formatParameters = useSelector(state => {

        const decimalFormats = state.MasterData.ItemDecimalPlaces || [];
        let decimalSetting;
        switch (type) {
            case 'statistics':
                decimalSetting = state.systemSettings.decimalPlaceStatistics || 'itemDecimalPlaces-2';
                break;
            case 'genralLedger':
                decimalSetting = state.systemSettings.decimalPlacesAmounts || 'itemDecimalPlaces-2';
                break;
            case 'staffing':
                decimalSetting = state.systemSettings.decimalPlacesHours || 'itemDecimalPlaces-2';
                break;
            default:
                decimalSetting = 'itemDecimalPlaces-2';
                break;
        }
        const groupingFormat = state.systemSettings.xc_Commas?.toLowerCase() === 'true' ?? false;

        // Get the format string, and strip off the first token to obtain the number of decimals
        let fractionDigits = decimalFormats.find(({ itemTypeCode }) => itemTypeCode === decimalSetting)?.itemTypeValue ?? 2;

        let signType;
        let negativeCellValueClass;
        switch (state.systemSettings.rd_negativeValues) {
            case 'withSign':
                negativeCellValueClass = 'statistics-table-cell-black-value';
                signType = 'standard';
                break;
            case 'redSign':
                negativeCellValueClass = 'statistics-table-cell-red-value';
                signType = 'standard';
                break;
            case 'withBracket':
                negativeCellValueClass = 'statistics-table-cell-black-value';
                signType = 'accounting';
                break;
            case 'redBracket':
                negativeCellValueClass = 'statistics-table-cell-red-value';
                signType = 'accounting';
                break;
            default:
                negativeCellValueClass = 'statistics-table-cell-black-value';
                signType = 'standard';
                break;
        }

        if (selectedViews &&
            ((((selectedViews?.inflationRate) || (selectedViews?.ratioRate)) && (type === "genralLedger"))
                || (((selectedViews?.runRate) || (selectedViews?.raiseRate)) && (type === "staffing")))) {

            const decimalPlacesPercentValues = state.systemSettings.decimalPlacesPercentValues || 'itemDecimalPlaces-2';
            fractionDigits = decimalFormats.find(({ itemTypeCode }) => itemTypeCode === decimalPlacesPercentValues)?.itemTypeValue ?? 2;

            return {
                minimumFractionDigits: fractionDigits,
                maximumFractionDigits: fractionDigits,
                useGrouping: groupingFormat,
                negativeCellValueClass: negativeCellValueClass,
                style: 'percent',
                currencySign: signType,
                currency: 'USD',
            }

        }

        return {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
            useGrouping: groupingFormat,
            negativeCellValueClass: negativeCellValueClass,
            style: type === 'genralLedger' && state.systemSettings.xc_Currency === 'True' ? 'currency' : 'decimal',
            currencySign: signType,
            currency: 'USD'
        }
    });

    useImperativeHandle(ref, () => ({

        saveBudgetVersionStats(isEdit) {
            const updatedRows = [];
            // hack: checking index array length to 3 to get last row
            unSavedChangesState.filter(item => item.isDirectChange || item.colType == 'details' || item.isIncluded).forEach(change => {
                let existingRow;
                if (getRowFromIndex(change.rowIndexArray).dataid != null) {
                    existingRow = updatedRows.find(row => row.dataid == getRowFromIndex(change.rowIndexArray).dataid);
                } else {
                    existingRow = updatedRows.find(row => row.uniqueCombinationKey == getRowFromIndex(change.rowIndexArray).uniqueCombinationKey);
                }
                if (existingRow) {
                    existingRow[change.headerKey] = parseNumber(change.value);
                } else {
                    updatedRows.push({
                        ...change,
                        [change.headerKey]: parseNumber(change.value),
                        dataid: getRowFromIndex(change.rowIndexArray).dataid,
                        completeRow: getRowFromIndex([change.rowIndexArray[0]]),
                        uniqueCombinationKey: getRowFromIndex(change.rowIndexArray).uniqueCombinationKey,
                    })
                }
            })
            return updatedRows;
        }
    }), [unSavedChangesState]);

    const setFiscalYearStartMonth = (headerObj = headersState) => {
        let montheaders = [];
        let lastNames = [];
        const startMonth = timePeriod.itemTypeDisplayName.split(' ')[0].trim();
        const startYear = timePeriod.itemTypeDisplayName.split(' ')[1].trim();
        const months = [...monthNames];

        if (toolBarState.months) {
            lastNames = months.splice(0, months.findIndex(name => name.text.toLowerCase() === (startMonth.toLowerCase() || 'jan')));
            montheaders = [...months.map(month => { return { ...month, header: `${month.text} ${startYear}` } }),
            ...lastNames.map(month => { return { ...month, header: `${month.text} ${Number(startYear) + 1}` } })];
        }
        setHeadersState({
            headers:
                [...headerObj.headers.slice(0, maxLevel),
                ...montheaders,
                { header: `FY${lastNames.length ? startYear.slice(-2) + '-' + (Number(startYear.slice(-2)) + 1) : startYear} Total`, key: 'fy', formatType: 'number' }
                ]
        });
    }

    const onHeaderIconClick = (e, headerIndex, detailIndex) => {
        e.preventDefault();
        if (headersState.headers[headerIndex].extraDetails.filter(item => item.isHidden === false).length == 1 && !headersState.headers[headerIndex].extraDetails[detailIndex].isHidden) {
            return;
        }
        var stateCopy = { ...headersState };
        stateCopy.headers = stateCopy.headers.slice();
        stateCopy.headers[headerIndex] = { ...stateCopy.headers[headerIndex] };
        stateCopy.headers[headerIndex].extraDetails = stateCopy.headers[headerIndex].extraDetails.slice();
        stateCopy.headers[headerIndex].extraDetails[detailIndex] = { ...stateCopy.headers[headerIndex].extraDetails[detailIndex] };
        stateCopy.headers[headerIndex].extraDetails[detailIndex].isHidden = !stateCopy.headers[headerIndex].extraDetails[detailIndex].isHidden;
        setHeadersState(stateCopy);

        // If Header Config saved in localStorage, update the config in local storage when user update show/hide on UI.
        if (localStorage.getItem("headerConfig")) {
            let headerConfig = JSON.parse(localStorage.getItem("headerConfig"));
            let headerObj = headerConfig[headersState.headers[headerIndex].header];
            if (detailIndex === 0) {
                // For Code
                headerObj.showCode = !headerObj.showCode;
            } else if (detailIndex === 1) {
                // For Name
                headerObj.showName = !headerObj.showName;
            }
            headerConfig[headersState.headers[headerIndex].header] = headerObj;
            localStorage.setItem('headerConfig', JSON.stringify(headerConfig));
        }
    }

    const onEditCellClicked = (e, rowIndexArray, headerKey, value) => {
        e.preventDefault();
        if (isInLineEditable())
            setCurrentEditableCellState({ headerKey, rowIndexArray, value, isDirectChange: true });
    }

    const updateDataRow = (row, changes, rowIndexArray) => {
        const months = Object.entries(row);
        months.forEach(month => {
            const change = changes.find(c => { if (c.headerKey === month[0] && c.colType === 'details' && c.rowIndexArray.join() === rowIndexArray.join()) return c });
            row[month[0]] = change ? change.value : row[month[0]];
        });

        return row;
    }

    const populateChanges = () => {
        const rowIndexArray = currentEditableCellState.rowIndexArray;
        const indirectChanges = [...unSavedChangesState];
        const tempRowIndexArray = [];
        let rows = rowsState.rows;
        let changedRow = getRowFromIndex(rowIndexArray);

        // update the row with the latest changes from the user
        changedRow = updateDataRow(changedRow, indirectChanges, rowIndexArray);

        const cellValue = parseNumber(currentEditableCellState.value || 0);
        // get the value that was previously updated
        const updatedValue = indirectChanges.find(c => { if (c.rowIndexArray.join() == currentEditableCellState.rowIndexArray.join() && c.headerKey === currentEditableCellState.headerKey) return c; });
        const valueFromIndex = getValueFromIndex(rowIndexArray, currentEditableCellState.headerKey)
        let change = 0;
        if (updatedValue) {
            change = cellValue - updatedValue.value;
        }
        else {
            change = cellValue - valueFromIndex;
        }
        for (let index of rowIndexArray) {
            let updatedRow = rows[index];
            tempRowIndexArray.push(index);

            // fy total value is changed
            if (currentEditableCellState.headerKey == 'fy') {
                for (let month of monthNames) {
                    const unSavedChange = isAnyUnsavedChangesForCell(month['key'], [...tempRowIndexArray]);
                    const monthlyChange = getChange(SpreadMethodTypes.Prorated, {
                        value: parseNumber(changedRow['fy']),
                        changedValue: parseNumber(currentEditableCellState.value),
                        monthValue: parseNumber(changedRow[month['key']])
                    });

                    if (unSavedChange.isUnsavedChangesForThisCell) {
                        const cellChange = indirectChanges[unSavedChange.position];
                        cellChange.value = parseNumber(cellChange.value) + monthlyChange;
                        indirectChanges[unSavedChange.position] = cellChange;

                    } else {
                        indirectChanges.push({
                            headerKey: month['key'],
                            rowIndexArray: [...tempRowIndexArray],
                            value: parseNumber(updatedRow[month['key']]) + monthlyChange,
                            isDirectChange: false,
                            isIncluded: true
                        });
                    }
                }
                if (updatedRow.colType != 'details') {
                    const unSavedChange = isAnyUnsavedChangesForCell('fy', [...tempRowIndexArray]);
                    if (unSavedChange.isUnsavedChangesForThisCell) {
                        const cellChange = { ...indirectChanges[unSavedChange.position] };
                        cellChange.value = parseNumber(cellChange.value) + change;
                        indirectChanges[unSavedChange.position] = cellChange;
                    } else {
                        indirectChanges.push({
                            headerKey: 'fy',
                            rowIndexArray: [...tempRowIndexArray],
                            value: parseNumber(updatedRow['fy']) + change,
                            isDirectChange: false
                        });
                    }
                }
                else if (updatedRow.colType == 'details') {
                    const unSavedChange = isAnyUnsavedChangesForCell('fy', [...tempRowIndexArray]);
                    if (unSavedChange.isUnsavedChangesForThisCell) {
                        const cellChange = { ...indirectChanges[unSavedChange.position] };
                        cellChange.value = parseNumber(cellChange.value) + change;
                        cellChange.isDirectChange = cellChange.rowIndexArray.join() === currentEditableCellState.rowIndexArray.join() && cellChange.headerKey === currentEditableCellState.headerKey ? currentEditableCellState.isDirectChange : cellChange.isDirectChange;
                        indirectChanges[unSavedChange.position] = cellChange;
                    }
                }
            }
            else {
                let unSavedChange = isAnyUnsavedChangesForCell('fy', [...tempRowIndexArray]);
                if (unSavedChange.isUnsavedChangesForThisCell) {
                    const cellChange = { ...indirectChanges[unSavedChange.position] };
                    cellChange.value = parseNumber(cellChange.value) + change;
                    indirectChanges[unSavedChange.position] = cellChange;
                } else {
                    indirectChanges.push({
                        headerKey: 'fy',
                        rowIndexArray: [...tempRowIndexArray],
                        value: parseNumber(updatedRow['fy']) + change,
                        isDirectChange: false
                    });
                }
                if (updatedRow.colType != 'details') {
                    unSavedChange = isAnyUnsavedChangesForCell(currentEditableCellState.headerKey, [...tempRowIndexArray])
                    if (unSavedChange.isUnsavedChangesForThisCell) {
                        const cellChange = { ...indirectChanges[unSavedChange.position] };
                        cellChange.value = parseNumber(cellChange.value) + change;
                        indirectChanges[unSavedChange.position] = cellChange;
                    } else {
                        indirectChanges.push({
                            headerKey: currentEditableCellState.headerKey,
                            rowIndexArray: [...tempRowIndexArray],
                            value: parseNumber(updatedRow[currentEditableCellState.headerKey]) + change,
                            isDirectChange: false
                        });
                    }
                }
                else if (updatedRow.colType == 'details') {
                    // replace
                    unSavedChange = isAnyUnsavedChangesForCell(currentEditableCellState.headerKey, [...tempRowIndexArray])
                    if (unSavedChange.isUnsavedChangesForThisCell) {
                        const cellChange = { ...indirectChanges[unSavedChange.position] };
                        cellChange.value = currentEditableCellState.value;
                        cellChange.isDirectChange = currentEditableCellState.isDirectChange;
                        indirectChanges[unSavedChange.position] = cellChange;
                    }
                }
            }
            rows = rows[index].childRows;
        }
        // format the changes before updating state
        let changes = [];
        const changedCell = indirectChanges.find(c => { if (c.rowIndexArray.join() == currentEditableCellState.rowIndexArray.join() && c.headerKey === currentEditableCellState.headerKey) return c; });
        if (changedCell) {
            changes = [...indirectChanges]
        }
        else {
            changes = [...indirectChanges, { ...currentEditableCellState }]
        }

        setUnSavedChangesState(changes);
        return changes;
    }

    const onEditContainerFocusOut = (oldValue) => {
        if (!isCloseButtonFocused && oldValue != parseNumber(currentEditableCellState.value || 0)) {
            populateChanges(oldValue);
        }
        setCloseButtonFocus(false);
        setCurrentEditableCellState({});
    }
    const onEditCellInputChange = (e, colType) => {
        setCurrentEditableCellState({ ...currentEditableCellState, value: e.target.value, isDirectChange: true, colType });
        // notifiy the budget form that a cell has changed
        handleEditChange();
    }

    const populateDependentData = (row, fteChecked) => {
        if (row.childRows?.length) {
            row.childRows.forEach(childRow => {
                populateDependentData(childRow, fteChecked);
            });
            row["fy"] = 0;
            monthNames.forEach(month => {
                row[month.key] = 0;
                row.childRows.forEach(childRow => {
                    row[month.key] += parseNumber(childRow[month.key] ?? 0);
                })
            });
            if (selectedViews?.forecastRate || selectedViews?.inflationRate) {
                // we do not want fy totals for forecastRate, so just use January - all months will be the same value
                row["fy"] = parseNumber(row[monthNames[0]['key']] ?? 0);
            }
            else {
                row.childRows.forEach(childRow => {
                    row["fy"] += parseNumber(childRow["fy"] ?? 0);
                })
            }
        }
        else {
            row["fy"] = 0;
            if (selectedViews?.forecastRate || selectedViews?.inflationRate) {
                row["fy"] = parseNumber(row[monthNames[0]['key']] ?? 0);
            } else if (selectedViews?.runRate) {
                row["fy"] = row["rowTotal"];
            }
            else {
                monthNames.forEach(month => {
                    if (fteChecked) {
                        row["fy"] = row["rowTotal"] / row["fteTotal"]
                    } else {
                        row["fy"] += parseNumber(row[month['key']] ?? 0);
                    }
                })
            }
        }
    }

    const isAnyUnsavedChangesForCell = (headerKey, indexArray) => {
        const unSavedChange = {};
        for (let unSavedChangeIndex = 0; unSavedChangeIndex < unSavedChangesState.length; unSavedChangeIndex++) {
            if (unSavedChangesState[unSavedChangeIndex].headerKey == headerKey && JSON.stringify(unSavedChangesState[unSavedChangeIndex].rowIndexArray) == JSON.stringify(indexArray)) {
                unSavedChange.value = unSavedChangesState[unSavedChangeIndex].value;
                unSavedChange.isUnsavedChangesForThisCell = true;
                unSavedChange.isDirectChange = unSavedChangesState[unSavedChangeIndex].isDirectChange;
                unSavedChange.position = unSavedChangeIndex;
                return unSavedChange;
            }
        }
        return unSavedChange;
    }

    const getValueFromIndex = (indexArray, headerkey) => {
        return parseNumber(getRowFromIndex(indexArray)[headerkey]);
    }

    const getRowFromIndex = (indexArray, rows = rowsState.rows) => {
        if (indexArray) {
            let row = { childRows: [...rows] };
            indexArray.forEach(index => {
                row = row.childRows[index];
            })
            return row;
        }
        else {
            return null;
        }
    }

    const onTextBoxKeyPress = (event, headerKey, indexArray, value) => {
        // only allow tab = 9, or enter = 13 or shift tab
        if (event.keyCode === 9 || event.keyCode === 13) {
            event.preventDefault();
            // first, where are we currently? currentFocusedCelIndex is the field the user tabed out of
            const currentFocusedCelIndex = headersState.headers.findIndex(header => {
                return header.key == headerKey;
            });

            let changes = [];
            // save any new value for the current cell
            if (parseNumber(value) != parseNumber(currentEditableCellState.value || 0)) {
                changes = populateChanges(value);
            }

            // where does the user need to go next?
            let nextCellIndex = 0;
            if (currentFocusedCelIndex == 15 && !event.shiftKey) {
                // user tabbed on fy, so move them to the first month -> index == 3
                nextCellIndex = maxLevel; // first month
            }
            else if (currentFocusedCelIndex === maxLevel && event.shiftKey) {
                // user was on the first month and clicked shift + tab so move them to fy
                nextCellIndex = 15;
            }
            else if (event.shiftKey) {
                // user clicks tab, so move them to the next month
                nextCellIndex = currentFocusedCelIndex - 1;
            }
            else {
                nextCellIndex = currentFocusedCelIndex + 1;
            }

            // headerKey is the cell we are going to next
            const nextHeaderKey = headersState.headers[nextCellIndex].key;

            // look for any changes that have been made to the cell we are going to
            let unsavedCell = null;

            if (changes.length > 0) {
                unsavedCell = changes.find(c => c.headerKey === nextHeaderKey && c.rowIndexArray.join() === indexArray.join());
            }
            else {
                unsavedCell = unSavedChangesState.find(c => c.headerKey === nextHeaderKey && c.rowIndexArray.join() === indexArray.join());
            }


            // if we found the next cell in unSavedChangesState, use that value, 
            // else us the original value from the row
            let cellValue = null;
            let isDirectChange = false;
            if (unsavedCell?.value) {
                cellValue = unsavedCell.value;
                isDirectChange = unsavedCell.isDirectChange;
            }
            else {
                cellValue = getValueFromIndex(indexArray, nextHeaderKey);
            }

            // since we are on the current fy, set the previous month as editable
            setCurrentEditableCellState({ headerKey: nextHeaderKey, rowIndexArray: indexArray, value: cellValue, isDirectChange });
        }
    }

    const formatCellValue = (value, formatType) => {

        // format the cell value according to the supplied format parameters
        const formattedValue = formatValue(value, formatType, 'en-US', formatParameters);

        // get display class
        const cellValueClass = parseNumber(value) < 0 ? formatParameters.negativeCellValueClass : 'statistics-table-cell-black-value';

        return <span className={cellValueClass}>{formattedValue}</span>;
    }

    let sameheaderRowCounter = -1;
    let currentHeaderIndex = 0;
    const getCellContent = (header, headerIndex, row, indexArray) => {
        if (!row[header.key] || typeof row[header.key] !== 'object') {
            var unSavedChange = isAnyUnsavedChangesForCell(header['key'], indexArray);

            // when parent row no edit
            if (row.childRows?.length) {
                const processedValue = unSavedChange.value ? unSavedChange.value : row[header.key] === undefined ? '' : row[header.key];
                return <span className={`bx--text-truncate--end ${budgetVersionType !== "Actual" ? "statistics-table-editable-cell statistics-table-unsaved-changes" : ""} ${unSavedChange.isDirectChange ? "statistics-table-unsaved-direct-changes" : "statistics-table-unsaved-indirect-changes"}`}>
                    {unSavedChange.isUnsavedChangesForThisCell && <TooltipIcon direction="bottom" align="end" tooltipText={unSavedChange.isDirectChange ? "Edited and unsaved" : "Changed due to other edited cell(s). Unsaved"}>
                        <WarningAlt16 />
                    </TooltipIcon>}
                    <span onMouseOver={e => {
                        // are we in an overflow state?
                        // if not, erase the title so that the tooltip does not show
                        if (!cellIsOverflown(e.target.parentElement, e.target.innerText, true)) {
                            e.target.title = "";
                        }
                    }}
                        title={processedValue}>
                        {formatCellValue(processedValue, header.formatType)}
                    </span>
                </span>
            }
            // on edit mode
            else if (Object.keys(currentEditableCellState).length && currentEditableCellState.headerKey == header['key'] &&
                JSON.stringify(currentEditableCellState.rowIndexArray) == JSON.stringify(indexArray)) {
                return <span onBlur={() => onEditContainerFocusOut(row[header.key])}>
                    <input type="number" className="statistics-table-editable-cell-input" onKeyDown={e => onTextBoxKeyPress(e, header.key, indexArray, row[header.key])}
                        onChange={(e) => onEditCellInputChange(e, row.colType)} autoFocus={true} value={currentEditableCellState.value} onFocus={e => e.target.select()} />
                    <Close16 className="statistics-table-cell-close-icon" onMouseEnter={() => setCloseButtonFocus(true)}
                        onMouseLeave={() => setCloseButtonFocus(false)}></Close16>
                </span>
            }
            else {
                // after edit mode
                if (unSavedChange.isUnsavedChangesForThisCell) {
                    return <span onClick={(e) => onEditCellClicked(e, indexArray, header['key'], parseNumber(unSavedChange.value))} onBlur={() => onEditContainerFocusOut(row[header.key])} className={`bx--text-truncate--end statistics-table-editable-cell statistics-table-unsaved-changes ${unSavedChange.isDirectChange ? "statistics-table-unsaved-direct-changes" : "statistics-table-unsaved-indirect-changes"}`}>
                        <TooltipIcon direction="bottom" align="end" tooltipText={unSavedChange.isDirectChange ? "Edited and unsaved" : "Changed due to other edited cell(s). Unsaved"}>
                            <WarningAlt16 />
                        </TooltipIcon>
                        <span onMouseOver={e => {
                            // are we in an overflow state?
                            // if not, erase the title so that the tooltip does not show
                            if (!cellIsOverflown(e.target.parentElement, e.target.innerText, true)) {
                                e.target.title = "";
                            }
                        }}
                            title={unSavedChange.value || ""}>
                            {formatCellValue(unSavedChange.value, header.formatType)}
                        </span>
                    </span>
                }
                else if (budgetVersionType !== "Actual" && row[header.key] !== undefined) {
                    const processedValue = unSavedChange.value ? unSavedChange.value : row[header.key] === undefined ? '' : row[header.key];
                    // initial view without any changes
                    return <>{unSavedChange.isUnsavedChangesForThisCell && <Play16 className="statistics-table-unsaved-changes-icon" />}
                        <span className={`bx--text-truncate--end statistics-table-editable-cell ${unSavedChange.isUnsavedChangesForThisCell ? " statistics-table-unsaved-changes" : ""}`}
                            onClick={(e) => onEditCellClicked(e, indexArray, header['key'], parseNumber(row[header.key]))}>
                            {isInLineEditable() && <Edit16 className="statistics-table-cell-edit-icon" />}
                            <span
                                onMouseOver={e => {
                                    // are we in an overflow state?
                                    // if not, erase the title so that the tooltip does not show
                                    if (!cellIsOverflown(e.target.parentElement, e.target.innerText, true)) {
                                        e.target.title = "";
                                    }
                                }}
                                title={processedValue}>
                                {formatCellValue(processedValue, header.formatType)}
                            </span>
                        </span></>
                }
                else {
                    return <>
                        <span className={`bx--text-truncate--end`}>
                            <span
                                onMouseOver={e => {
                                    // are we in an overflow state?
                                    // if not, erase the title so that the tooltip does not show
                                    if (!cellIsOverflown(e.target.parentElement, e.target.innerText, true)) {
                                        e.target.title = "";
                                    }
                                }}
                                title={row[header.key] === undefined ? '' : row[header.key]}>
                                {formatCellValue(row[header.key], header.formatType)}
                            </span>
                        </span></>
                }
            }
        }


        let cellContentList = [];
        let className = "statistics-entity-cell";
        if (header.key === "department") {
            className = "statistics-department-cell";
        }
        else if (header.key === "details") {
            className = "statistics-statistics-cell";
        }

        header.extraDetails.forEach(detail => {
            if (!detail.isHidden) {
                cellContentList.push(row[header.key][detail.key]);
            }
        });

        // if (headerIndex != currentHeaderIndex || row?.topParentsRow ) {
        //     currentHeaderIndex = headerIndex;
        //     sameheaderRowCounter = -1;
        // }
        // if(row?.childOrder < 2)
        // {
        //     sameheaderRowCounter = sameheaderRowCounter + 1;
        // }
        let marginLeftCalculated = (10 * row.dept) + 5;
        //* row?.childOrder ? row?.childOrder : 1;
        return (
            <>
                <span className={row.grouped ? 'grouped-row-cell' : ''} style={{ marginLeft: row.colType == header.key ? marginLeftCalculated : showGroupedData ? 35 : 0 }}>
                    {
                        row.colType != header.key ||
                            !row.childRows?.length ? <span className='statistics-cell-chevron-placeholder'></span> : row.isExpanded ? <ChevronUp16 onClick={(e) => toggleRows(e, indexArray)} className='statistics-table-cell-icon' /> : <ChevronDown16 onClick={(e) => toggleRows(e, indexArray)} className='statistics-table-cell-icon' />}
                </span>
                <span>{(!row.childRows?.length && (header.key === "details") && row?.details?.isSubAccExist ) ? <TooltipIcon direction="top" align="start" tooltipText={"Subaccounts added."}><TreeView16 /></TooltipIcon> : ""}</span>
                <div className={`${className} bx--text-truncate--end`}>
                    <span
                        onMouseOver={e => {
                            // are we in an overflow state?
                            // if not, erase the title so that the tooltip does not show
                            if (!cellIsOverflown(e.target)) {
                                e.target.title = "";
                            }
                        }}
                        title={cellContentList.join(' ')}
                        className='datatable-row-details'
                    >
                        {cellContentList.join(' ')}
                    </span>
                </div>

            </>
        )
    }

    const toggleRows = (e, indexArray) => {
        e.preventDefault();
        // currently only 3 levels supported
        let firstLevelRows;
        let firstLevelRow;
        let secondLevelRows;
        let secondLevelRow;
        let thirdLevelRows;
        let thirdLevelRow;
        switch (indexArray.length) {
            case 1:
                // preventing state mutation
                const rows = [...rowsState.rows];
                const row = { ...rows[indexArray[0]] };
                row.isExpanded = !row.isExpanded;
                rows[indexArray[0]] = row;
                setRowsState({ rows: rows });
                break;
            case 2:
                // preventing state mutation
                firstLevelRows = [...rowsState.rows];
                firstLevelRow = { ...firstLevelRows[indexArray[0]] };
                secondLevelRows = [...firstLevelRow.childRows]
                secondLevelRow = { ...secondLevelRows[indexArray[1]] }
                secondLevelRow.isExpanded = !secondLevelRow.isExpanded;
                secondLevelRows[indexArray[1]] = secondLevelRow;
                firstLevelRow.childRows = secondLevelRows;
                firstLevelRows[indexArray[0]] = firstLevelRow;
                setRowsState({ rows: firstLevelRows });
                break;
            case 3:
                // preventing state mutation
                firstLevelRows = [...rowsState.rows];
                firstLevelRow = { ...firstLevelRows[indexArray[0]] };
                secondLevelRows = [...firstLevelRow.childRows]
                secondLevelRow = { ...secondLevelRows[indexArray[1]] }
                thirdLevelRows = [...secondLevelRow.childRows]
                thirdLevelRow = { ...thirdLevelRows[indexArray[2]] }
                thirdLevelRow.isExpanded = !thirdLevelRow.isExpanded;
                thirdLevelRows[indexArray[2]] = thirdLevelRow;
                secondLevelRow.childRows = thirdLevelRows;
                secondLevelRows[indexArray[1]] = secondLevelRow;
                firstLevelRow.childRows = secondLevelRows;
                firstLevelRows[indexArray[0]] = firstLevelRow;
                setRowsState({ rows: firstLevelRows });
                break;
            default:
                const cloned = JSON.parse(JSON.stringify(rowsState.rows));
                const clonedRow = getRowFromIndex(indexArray, cloned);
                clonedRow.isExpanded = !clonedRow.isExpanded;
                setRowsState({ rows: cloned });
                break;
        }
    }

    const handleCheckBox = (e) => {
        // isMultiSelectOpenToggle(true);
        const obj = {};
        const currentItem = e.selectedItems.find(item => !toolBarState[item.id]);
        e.selectedItems.forEach(item => {
            // include the item IF:
            // 1) Not staffing - we will not filter the non-staffing views
            // 2) the item is the one we just checked - we will include this in every case
            // 3) the current item is not a member of any group - always include ungrouped items
            // 4) the item is not a member of the same group as the selected item - only one item per group can be selected
            const selectedGroup = currentItem?.group || '';
            if ((type !== 'staffing' && type !== "genralLedger") || (currentItem && item.id === currentItem.id) || !item.group || item.group !== selectedGroup) {
                obj[item.id] = true;
            }
        });
        setToolBarState({ ...obj });

        handleViewsChange(obj);
    }

    const getTooltipContent = (header, row) => {
        if (typeof row[header.key] !== "object" || row[header.key] === null) {
            return row[header.key];
        }

        let cellContentList = [];
        header.extraDetails.forEach((detail) => {
            if (!detail.isHidden) {
                cellContentList.push(row[header.key][detail.key]);
            }
        });

        return cellContentList.join(" ");
    };

    const cellIsOverflown = (span, innerText, isStatsCell) => {
        if (span.scrollWidth > span.clientWidth) {
            return true;
        }
        else if (isStatsCell && innerText.length > 6) {
            return true;
        }

        return false;
    };

    const getStatisticsRowClass = (rowData, rowIndexArray) => {
        let rowClass = '';

        // Show/hide only added rows
        if (toolBarState.showOnlyAddedRow) {
            rowClass = rowData.rowAdded ? '' : 'statistics-hidden-row';
        }
        // Show/Hide rows with 0 value in all months
        if (toolBarState.emptyRows) return rowClass;
        if (rowData.colType == 'details' &&
            !monthNames.filter(item => (typeof rowData[item.key] == 'number' && rowData[item.key].toString().replace('$', '') != "0") ||
                isAnyUnsavedChangesForCell(item.key, rowIndexArray).value).length) {
            //return 'statistics-hidden-row';
            return '';
        }
        return rowClass;
    }

    const handleSetConfirmationModalState = (stateObj) => {
        setConfirmationModalState({ ...stateObj })
    }

    const getTableRow = (row, rowIndexArray, isParentExpanded) => {
        return isParentExpanded ? <TableRow id={row.dataid} key={row.dataid} className={getStatisticsRowClass(row, rowIndexArray)}>
            {headersState.headers.map((header, headerIndex) => (
                <TableCell id={row.dataid + "-" + header.key} key={row.dataid + "-" + header.key} className={`${(
                    row.childRows?.length
                    //|| row.colType == header.key
                    && !row.nonGroupsInRow?.includes(header.key)
                ) || header.key === 'fy' ? 'bold' : ''} ${header.extraDetails ? '' : 'text-right-align'}`}>
                    {getCellContent(header, headerIndex, row, rowIndexArray)}
                </TableCell>
            ))}
            {budgetVersionType === 'Forecast' ? <TableCell>
                <CustomDataTableOverflowMenu
                    row={row}
                    setConfirmationModalState={handleSetConfirmationModalState}
                    handleSubmit={handleSubmit}
                    inDelete={inDelete()}
                    bvScenarioType={type}
                    isSubAccOption={row?.details?.isSubAccOption ? true : false}
                />
            </TableCell> : ''}
        </TableRow> : '';
    }
    const getRow = (row, rowIndexArray, isParentExpanded) => {
        return <>
            {rowIndexArray.length ? getTableRow(row, rowIndexArray, isParentExpanded) : ""}
            {isParentExpanded && row.childRows?.map((nextLevelRow, nextLevelRowIndex) =>
                getRow(nextLevelRow, [...rowIndexArray, nextLevelRowIndex], row.isExpanded))}
        </>
    }
    const isInLineEditable = () => {
        let bvScenarioTypeKey = 'StatisticData'
        if (type === 'genralLedger') bvScenarioTypeKey = 'GeneralLedger'
        else if (type === 'staffing') bvScenarioTypeKey = 'StaffingData'
        if (userDetails.budgetVersionAP[bvScenarioTypeKey].Edit) return true
        return false
    }

    const inDelete = () => {
        let bvScenarioTypeKey = 'StatisticData'
        if (type === 'genralLedger') bvScenarioTypeKey = 'GeneralLedger'
        else if (type === 'staffing') bvScenarioTypeKey = 'StaffingData'
        if (userDetails.budgetVersionAP[bvScenarioTypeKey].Delete) return true
        return false
    }

    // console.log({ type })

    let bvScenarioTypeKey = 'StatisticData'
    if (type === 'genralLedger') bvScenarioTypeKey = 'GeneralLedger'
    else if (type === 'staffing') bvScenarioTypeKey = 'StaffingData'

    // console.log(userDetails.budgetVersionAP[bvScenarioTypeKey])

    return (
        <>
            {userDetails?.budgetVersionAP[bvScenarioTypeKey]?.View && <> <DataTable
                rows={rowsState.rows}
                headers={headersState.headers}
                pagination={true}
                render={({ rows, headers, getHeaderProps, onInputChange }) => (
                    <TableContainer className={`statistics-table-container ${!toolBarState.months ? " statistics-table-container-width" : null}`}>
                        <TableToolbarContent style={{ justifyContent: 'flex-end' }}>
                            <TableToolbarSearch placeHolderText="* represents zero or more characters, % represents single character" onChange={onInputChange} />
                            {<div className="show-only-addedrow-checkbox">
                                <Checkbox
                                    id="toggle_group_data_Grid"
                                    checked={showGroupedData}
                                    labelText="Show Groups/Hierarchies"
                                    onChange={checked => handletoogleGroupedData(checked)}
                                />
                            </div>
                            }
                            {toolBarState.showAddedRowCheckBox ? <div className="show-only-addedrow-checkbox">
                                <Checkbox
                                    id="only-addedrow-checkbox"
                                    checked={toolBarState.showOnlyAddedRow}
                                    labelText="Show only added rows"
                                    onChange={checked => setToolBarState({ ...toolBarState, showOnlyAddedRow: checked })}
                                />
                            </div> : ""}
                            <MultiSelect
                                key={`views-${budgetVersionType}${type}${Math.floor(Math.random() * 100)}`}
                                sortItems={() => { return toolBarControls }}
                                direction="bottom"
                                id="custom-datatable-views-multiselect"
                                initialSelectedItems={
                                    toolBarControls.filter(item => toolBarState[item.id])
                                }
                                invalidText="Invalid Selection"
                                itemToString={item => item.name}
                                items={toolBarControls}
                                label="Views"
                                light={false}
                                locale="en"
                                onChange={handleCheckBox}
                                open={isMultiSelectOpen}
                                selectionFeedback="top-after-reopen"
                                title={false}
                                type="default"
                            />
                            {(userDetails?.budgetVersionAP[bvScenarioTypeKey]?.Add && budgetVersionType == 'Forecast') ?
                                <Button
                                    disabled={false}
                                    id="btnAddRow"
                                    kind="primary"
                                    type="button"
                                    onClick={(e) => handleAddRowModal(true)}
                                >
                                    {'Add row'}
                                </Button>
                                : null
                            }
                            {(userDetails?.budgetVersionAP[bvScenarioTypeKey]?.Forecast && budgetVersionType === 'Forecast') && (ScenarioTypeInTable?.itemTypeValue === 'Statistic'
                                || ScenarioTypeInTable?.itemTypeValue === 'General Ledger' || ScenarioTypeInTable?.itemTypeValue === 'Staffing') ?
                                <Button
                                    disabled={false}
                                    id="btnForecast"
                                    kind="primary"
                                    type="button"
                                    onClick={handleForecastClick}
                                >
                                    {'Forecast'}
                                </Button>
                                : null
                            }
                            {userDetails?.budgetVersionAP[bvScenarioTypeKey]?.Inflation && budgetVersionType == 'Forecast' && ScenarioTypeInTable?.itemTypeValue === 'General Ledger' ?
                                <Button
                                    disabled={false}
                                    id="btnInflation"
                                    kind="primary"
                                    type="button"
                                    onClick={handleInflationClick}
                                >
                                    {'Inflation'}
                                </Button>
                                : null
                            }
                            {userDetails?.budgetVersionAP[bvScenarioTypeKey]?.Raises && budgetVersionType == 'Forecast' && ScenarioTypeInTable?.itemTypeValue === 'Staffing' ?
                                <Button
                                    disabled={false}
                                    id="btnRaises"
                                    kind="primary"
                                    type="button"
                                    onClick={handleRaisesClick}
                                >
                                    {'Raises'}
                                </Button>
                                : null
                            }
                            {userDetails?.budgetVersionAP[bvScenarioTypeKey]?.Wage && budgetVersionType == 'Forecast' && ScenarioTypeInTable?.itemTypeValue === 'Staffing' ?
                                <Button
                                    disabled={false}
                                    id="btnManualWage"
                                    kind="primary"
                                    type="button"
                                    onClick={handleManualWageClick}
                                >
                                    {'Wage rate'}
                                </Button>
                                : null
                            }
                        </TableToolbarContent>
                        <Table size='compact' className='statistics-table'>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header, headerIndex) => (
                                        <TableHeader {...getHeaderProps({ header })} className={`statistics-table-header ${header.extraDetails ? 'statistics-table-textual-header' : 'text-right-align'} ${!toolBarState.months && headerIndex === maxLevel - 1 ? 'statistics-table-header-last' : ''}`}>
                                            {header.header.split(' ').map(headerPart => (<>{headerPart.replace('_', ' ')} <br /></>))}
                                            {header.extraDetails && (
                                                header.extraDetails.map((detail, detailIndex) => {
                                                    return (
                                                        <>
                                                            {detail.isHidden ?
                                                                <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText={detail.showTooltipText}>
                                                                    <ChevronRight16 className='statistics-table-icon statistics-table-header-icon' onClick={(e) => onHeaderIconClick(e, headerIndex, detailIndex)} />
                                                                </TooltipIcon> : <>
                                                                    <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText={detail.hideTooltipText}>
                                                                        <ChevronLeft16 className='statistics-table-icon statistics-table-header-icon' onClick={(e) => onHeaderIconClick(e, headerIndex, detailIndex)} />
                                                                    </TooltipIcon> {detail.text} </>}
                                                        </>)
                                                })
                                            )}
                                        </TableHeader>
                                    ))}
                                    {budgetVersionType == 'Forecast' ? <TableHeader /> : ''}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getRow({ childRows: rowsState.rows, isExpanded: true }, [], true)}
                            </TableBody>
                        </Table>
                        {showGroupedData ? <> </>
                            :
                            <Pagination
                                id="paginationBar"
                                pageSizes={[2, 4, 5, 8, 10, 15, 20, 40, 60, 80, 100, 500, 1000]}
                                pageSize={paginationState.itemsPerPage}
                                page={paginationState.pageNo}
                                totalItems={paginationState.totalRows}
                                onChange={paginationHandler}
                                className='custom-datatable-pagination'
                            />
                        }
                    </TableContainer>
                )}
            />
                <FullScreenModal
                    open={confirmationModalState.open}
                    iconDescription="Close"
                    modalHeading={confirmationModalState.modalHeader}
                    onRequestClose={() => setConfirmationModalState({ ...confirmationModalState, open: false })}
                    onRequestSubmit={() => handleSubmit(confirmationModalState.id, confirmationModalState?.selectedRow)}
                    onSecondarySubmit={() => setConfirmationModalState({ ...confirmationModalState, open: false })}
                    passiveModal={false}
                    primaryButtonDisabled={false}
                    primaryButtonText={confirmationModalState.primaryButtonText}
                    secondaryButtonText="Cancel"
                    size='xs'
                >
                    {confirmationModalState.modalContentText}
                </FullScreenModal>
            </>}
        </>
    );
});

export default CustomDatatable;
