import { BrowserRouter, Redirect, useHistory } from "react-router-dom";
import {
	Button,
	DataTable,
	Modal,
	ModalWrapper,
	Pagination,
	TableSelectAll,
	TextInput,
	InlineLoading,
	Search,
	TooltipDefinition, TooltipIcon
} from "carbon-components-react";
import { Copy16, Delete16, Launch16, Filter16, Play16, Locked16, Information16 } from "@carbon/icons-react";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import React, { useState, useEffect } from "react";

import { Dropdown } from "carbon-components-react";
import { convertUTCDateToLocalDateLocalString } from "../../../../helpers/date.helper";
import initheaders from "./headers";
import initialRows from "./initialRows";
import overflowMenuItems from "./overflowMenu";
import { useDispatch, useSelector } from "react-redux";
import { GetBudgetVersionPageData, GetBudgetVersionPageDataRows, InitializeBudgetVersionDataRows } from "../../../../services/budget-version-service.js";
import { resetBudgetVersionsFilters } from '../../../../core/_actions/BudgetVersionsActions';
const {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableHeader,
	TableRow,
	TableToolbar,
	TableToolbarContent,
	TableToolbarSearch,
	TableSelectRow,
	TableBatchActions,
	TableBatchAction,
} = DataTable;

const ComboBoxBudgetVersionTypes = {
	id: "budget-version-grid-type-filter-dropdown",
	className: "grid-filter-dropdown",
	placeholder: "All budget version types",
	label: "All budget version types ",
	light: false,
};

//exported For testing
export const overflowMenuItemClick = (e, rowID, props, history, dispatch, xdatarows) => () => {

	switch (e.itemText) {
		case "Open":
			props.actionsource("overflowmenu");
			dispatch(resetBudgetVersionsFilters);
			history.push("/BudgetVersion/" + rowID);
			break;
		case "Rename":
			props.actionsource("overflowmenu");
			history.push("/RenameBudgetVersions", rowID);
			break;
		case "Delete":
			if (e.length !== "1") {
				props.onDelete(rowID);
			}
			break;

		case "Copy":
			// if (e.length !== "1") {
			// 	props.onCopy(rowID);
			// }
			if (rowID) {
				// var CopyID = selectedRows.map((x) => x.id);
				if (rowID && xdatarows?.rows?.length) {
					const selectedRowData = xdatarows.rows.find(rw => rw.id === rowID)
					if (selectedRowData) {
						props.onCopy(rowID, selectedRowData); // BUG fix : 377 , copy modal not opening from batch action button click.
					}
				}
			}
			break;

		default:
			//
			break;
	}
};

//exported For testing
export const batchActionClick = (
	action,
	selectedRows,
	props,
	history,
	dispatch,
	xdatarows
) => () => {

	switch (action) {
		case "open":
			// reset filter options before loading page
			dispatch(resetBudgetVersionsFilters);
			history.push("/BudgetVersion/" + selectedRows[0].id);
			break;
		case "rename":
			history.push("/RenameBudgetVersions", selectedRows[0].id);
			break;
		case "delete":
			if (selectedRows.length > 0) {
				var IDs = selectedRows.map((x) => x.id);
				//	deleteBudgetVersions(IDs)
				props.onDelete(IDs);
			}
			break;

		case "copy":
			if (selectedRows.length !== "1") {
				var CopyID = selectedRows.map((x) => x.id);
				if (CopyID.length && xdatarows?.rows?.length) {
					const selectedRowData = xdatarows.rows.find(rw => rw.id === CopyID[0])
					if (selectedRowData) {
						props.onCopy(CopyID[0], selectedRowData); // BUG fix : 377 , copy modal not opening from batch action button click.
					}
				}
			}
			break;
		case "calculate":
			props.onCalculation(selectedRows)
			break;
		default:
			//
			break;
	}
};

const DTTable = (props) => {
	const budgetVersionTypeData = useSelector((state) => state.MasterData.BudgetVersionsType);
	const allBudgetTypes =
	{
		itemTypeID: '',
		itemDataType: "string",
		itemDisplayName: "All budget version types",
		itemTypeValue: "All budget version types"
	};
	const initialStates = {
		dataTableKey: 100,
		orignalRows: null,
	}
	const initialLoadingStates = {
		isLoading: false
	}
	const allBudgetVersionTypeData = budgetVersionTypeData.concat(allBudgetTypes);
	const [xpageNo, setPageNo] = useState(1);
	const [xitemsPerPage, setItemsPerpage] = useState(20);
	const [xdatarows, setDataRows] = useState({ rows: [] });
	const [xtotalCount, setTotalCount] = useState(0);
	const [xselectedBudgetVersionType, setSelectedBudgetVersionType] = useState(allBudgetVersionTypeData[2]);
	const [tableSortState, setTableSortState] = useState({});
	const [searchStringState, setSearchStringState] = useState('');
	const [state, setState] = useState(initialStates);
	const [loadingState, setLoadingState] = useState(initialLoadingStates);
	const userDetails = useSelector((state) => state.UserDetails);

	const userdateformat = useSelector((state) => state.systemSettings.fiscalStartMonthDateFormat);
	const dateformat = useSelector((state) => state.MasterData.ItemDateFormat);
	const UserID = useSelector((state) => state.BudgetVersions.UserID);
	let timeOut;


	const onInputChange = (e) => {
		if (timeOut) clearTimeout(timeOut);
		let searchValue = e.target.value;
		timeOut = setTimeout(() => {
			setSearchStringState(searchValue);
		}, 500);
	}

	var mydateFormat = dateformat.find(
		({ itemTypeValue }) => itemTypeValue === userdateformat
	);
	if (typeof mydateFormat === "undefined") {
		mydateFormat = "LLLL";
	} else {
		mydateFormat = mydateFormat.itemTypeCode;
	}

	useEffect(() => {
		if (userdateformat && dateformat && UserID) {
			paginationHandler({ page: xpageNo, pageSize: xitemsPerPage })
		}
	}, [userdateformat, dateformat, UserID, props.parentState, tableSortState, xselectedBudgetVersionType, searchStringState])

	useEffect(() => {
		let updatedRows = state.orignalRows ? GetBudgetVersionPageDataRows(state.orignalRows, mydateFormat, UserID) : [];
		let updatedRowIndex = updatedRows?.findIndex((item) => item.BudgetVersionsID === props.selectedRow[0].id)
		if (updatedRowIndex !== -1 && updatedRows.length) {
			let updatedRow = updatedRows[updatedRowIndex]
			updatedRow["calculationStatus"] = "Calculating"
			updatedRows[updatedRowIndex] = JSON.parse(JSON.stringify(updatedRow))
			setDataRows({ rows: updatedRows });
			props.showCalculationNotification()
		}
	}, [props.setCalculatingStatus])

	const paginationHandler = async ({ page, pageSize, searchString }) => {
		setPageNo(page);
		setItemsPerpage(pageSize);
		if ((!xdatarows.rows.length && !searchStringState) || props.isRefresh)
			setLoadingState({ ...loadingState, isLoading: true })
		await changeBudgetVersionPageData(page, pageSize, searchString);
		if ((!xdatarows.rows.length && !searchStringState) || props.isRefresh) {
			props.toggleIsRefresh(false)
		} setLoadingState({ ...loadingState, isLoading: false })
	};

	const handleRowDoubleClick = (selectedRow, history) => () => {
		const { budgetVersionsListAP } = userDetails;
		if (budgetVersionsListAP.Open)
			history.push("/BudgetVersion/" + selectedRow.id);
	}

	const changeBudgetVersionPageData = async (page, pageSize, searchString = '') => {
		const apireq = await GetBudgetVersionPageData({
			params: {
				// UserId: UserID,
				PageNo: page,
				itemsPerPage: pageSize,
				budgetVersionType: xselectedBudgetVersionType?.itemTypeID,
				sortDescending: tableSortState.sortOrder == 'DESC',
				sortColumn: tableSortState.sortColumn,
				searchString: searchString || searchStringState
			}
		}
		);
		// Set this state to USE it at the time of budget verison calculation.
		setState({ ...state, orignalRows: apireq.data })
		let rows = GetBudgetVersionPageDataRows(apireq.data, mydateFormat, UserID);
		setDataRows({ rows: rows });
		//total row count needs to be updated if budget version type is Actual or Forecast
		if (xselectedBudgetVersionType?.itemDisplayName == "Actual") {
			setTotalCount(apireq.totalCount);
		} else if (xselectedBudgetVersionType?.itemDisplayName == "Forecast") {
			setTotalCount(apireq.totalCount);
		} else {
			setTotalCount(apireq.totalCount);
		}
	};

	const dispatch = useDispatch();
	const history = useHistory();
	const handleClickAdd = () => {
		history.push("/AddBudgetVersions");
	};

	const handleCombo = (e) => {
		setSelectedBudgetVersionType(e.selectedItem);
	};

	let actualPage;

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
				break;
		}
	}

	const actionsCountCheck = (selectedRows) => {
		const { budgetVersionsListAP } = userDetails;

		if (UserID === null) {
		} else {
			if (selectedRows.length > 1) {
				return (
					<>
						{budgetVersionsListAP?.Delete &&
							< TableBatchAction
								renderIcon={Delete16}
								onClick={batchActionClick("delete", selectedRows, props, history, dispatch, xdatarows)}
							>
								Delete
					</TableBatchAction>
						}
					</>
				);
			} else if (selectedRows.length) {
				return (
					<>
						<>
							{budgetVersionsListAP?.Open && <TableBatchAction
								id="open"
								renderIcon={Launch16}
								primaryFocus
								onClick={batchActionClick("open", selectedRows, props, history, dispatch, xdatarows)}
							>
								Open
            </TableBatchAction>}
						</>
						<>{budgetVersionsListAP?.Copy &&
							<TableBatchAction
								renderIcon={Copy16}
								onClick={batchActionClick("copy", selectedRows, props, history, dispatch, xdatarows)}
							>
								Copy
            </TableBatchAction>}
						</>
						<>
							{budgetVersionsListAP?.Rename && <TableBatchAction
								renderIcon={""}
								onClick={batchActionClick("rename", selectedRows, props, history, dispatch, xdatarows)}
							>
								Rename
            </TableBatchAction>}
						</>

						<>
							{budgetVersionsListAP?.Calculate && selectedRows[0].cells[5].value === "Need to calculate" && selectedRows[0].cells[4].value === "Forecast" ?
								<TableBatchAction renderIcon={null} onClick={batchActionClick("calculate", selectedRows, props, history, dispatch, xdatarows)}>
									Calculate
					</TableBatchAction>
								: null}
						</>

						<>
							{budgetVersionsListAP?.Delete && <TableBatchAction
								renderIcon={Delete16}
								onClick={batchActionClick("delete", selectedRows, props, history, dispatch, xdatarows)}
							>
								Delete
            		</TableBatchAction>
							}
						</>
					</>
				);
			}
		}
	};

	const getCalculationStatus = (cell, row) => {
		if (cell.value === "" || cell.value === "Completed" || cell.value === "Forecast completed") {
			return <TableCell key={cell.id}>{cell.value}</TableCell>;
		} else if (cell.value === "Calculating" || cell.value === "Forecasting") {
			let toolTipText = ""
			if (cell.value === "Calculating") {
				toolTipText = "Locked until calculations complete.";
			} else if (cell.value === "Forecasting") {
				toolTipText = "Locked until forecast completes.";
			}
			return <TableCell key={cell.id}>
				<>
					<span>{cell.value}</span> <span className="ellipsis-anim"><span>.</span><span>.</span><span>.</span></span>
					<TooltipIcon style={{ marginLeft: "48px" }} tooltipText={toolTipText} direction={"top"}>
						<Locked16 />
					</TooltipIcon>
				</>
			</TableCell>;
		}
		else if (cell.value === "Need to calculate") {
			return <TableCell key={cell.id}>
				<>
					<span style={{ fontWeight: "bold", color: "#FF8C00" }}>{cell.value}</span>
					{budgetVersionsListAP.Calculate && <TooltipIcon onClick={batchActionClick("calculate", [{ id: row.id }], props, history, dispatch)} style={{ marginLeft: "20px" }} tooltipText={"Perform calculations, including rolling salaries into general ledger, raises, inflation, and the forecasts set to automatically update. Mapping for staffing job code and pay type to general ledger accounts must be complete."} direction={"top"}>
						<Play16 />
					</TooltipIcon>}
				</>
			</TableCell>;
		} else if (cell.value === "Failed" || cell.value === "Forecast failed") {
			return <TableCell key={cell.id}>
				<>
					<span style={{ fontWeight: "bold", color: "#FF0000" }}>
						{cell.value}
					</span>
					<TooltipIcon style={{ marginLeft: cell.value == "Failed" ? "97px" : "37px" }} tooltipText={cell.value == "Failed" ? "Calculation failed." : "Forecast failed."} direction={"top"}>
						<Information16 style={{ fill: "#FF0000" }} />
					</TooltipIcon>
				</>
			</TableCell>;
		} else {
			return <TableCell key={cell.id}>
				{cell.value}</TableCell>;
		}
	}
	const { budgetVersionsListAP } = userDetails;
	const overflowMenuItemsModified = [];
	overflowMenuItems.forEach(data => {
		if (budgetVersionsListAP[data.itemText]) {
			overflowMenuItemsModified.push(data)
		}
	})

	// console.log({ budgetVersionsListAP })
	return (
		loadingState.isLoading ? <InlineLoading description="Loading..." /> :
			// !xdatarows.rows.length ? <InlineLoading description="Loading..." /> :
			<>
				<DataTable
					//sortRow={customSortRow}
					key={state.datatableKey}
					rows={xdatarows.rows}
					//rows={initialRows}
					headers={initheaders}
					//headers={gridHeaders}
					isSortable={true}
					radio={false}
					pagination={true}
					render={({
						rows,
						headers,
						getHeaderProps,
						defaultProps,
						getRowProps,
						getTableProps,
						getSelectionProps,
						selectedRows,
						getBatchActionProps,
						OverflowMenuProps
					}) => (
						<TableContainer className="budget-version-table-container" >
							<TableToolbar>
								<TableToolbarContent>
									<Search placeHolderText="Search budget version" onChange={onInputChange} />
									<div style={{ width: 220 }}>
										<Dropdown
											{...ComboBoxBudgetVersionTypes}
											items={allBudgetVersionTypeData}
											itemToString={(item) => (item ? item.itemTypeValue : "")}
											value={(item) => (item ? item.itemTypeID : "")}
											//selectedItem={selectedBudgetVersionType}
											onChange={(e) => {
												handleCombo(e);
											}}
										/>
									</div>
									{budgetVersionsListAP?.Add && <Button
										id="btnAddBudget"
										small
										kind="primary"
										onClick={handleClickAdd}
									>
										Add &nbsp; &nbsp;+
              						</Button>
									}
									{/* <Button
										id="btnForcast"
										small
										kind="primary"
									>
										Forecast{" "}
									</Button>

									<Button
										id="btnSpreadData"
										small
										kind="primary"
									>
										Spread data &nbsp; &nbsp; &nbsp;
									</Button> */}
								</TableToolbarContent>
								{selectedRows.length ? <TableBatchActions {...getBatchActionProps()}>
									{/* inside of you batch actinos, you can include selectedRows */}
									{actionsCountCheck(selectedRows)}
								</TableBatchActions> : <></>
								}							</TableToolbar>
							{!xdatarows.rows.length ?
								<p className="table-no-data"> No budget version found.</p>
								:
								<><Table key={state.datatableKey} id={state.datatableKey} className="budget-version-table" size="compact" {...getTableProps}>
									<TableHead>
										<TableRow>
											<TableSelectAll {...getSelectionProps()} />
											{headers.map((header) => {
												if (header.key === "overflow") {
													return (
														<TableHeader>
														</TableHeader>
													);
												} else {
													return (
														<TableHeader {...getHeaderProps({ header, onClick: () => onHeaderClick(header.key) })}>
															{header.header}
														</TableHeader>
													);
												}
											})}
										</TableRow>
									</TableHead>
									<TableBody>
										{console.log(rows)}
										{rows.map((row) => (
											<TableRow onDoubleClick={handleRowDoubleClick(row, history)}
												{...getRowProps({ row })} key={row.budgetVersionID}>
												<TableSelectRow {...getSelectionProps({ row })} />
												{row.cells.map((cell) => {
													if (cell.info.header === "overflow" && UserID !== null) {
														return (
															<TableCell
																key={cell.id}
																id={cell.id}
																className={`la-${cell.info.header}`}
															>
																<OverflowMenu
																	id={cell.id}
																	{...OverflowMenuProps}
																	className="bx--overflow-menu__trigger"
																	flipped="true"
																	requireTitle="false"
																	buttonKind="ghost"
																>
																	{overflowMenuItemsModified.map((menuItem) => (
																		<OverflowMenuItem
																			id="abcd"
																			key={menuItem.id}
																			itemText={menuItem.itemText}
																			hasDivider={menuItem.hasDivider}
																			isDelete={menuItem.isDelete}
																			primaryFocus={menuItem.primaryFocus}
																			requireTitle="true"
																			onClick={overflowMenuItemClick(
																				menuItem,
																				row.id,
																				props,
																				history,
																				dispatch,
																				xdatarows
																			)}
																		/>
																	))}
																</OverflowMenu>
															</TableCell>
														);
													} else if (cell.info.header === "calculationStatus") {
														return row.cells[4].value === "Forecast" ? getCalculationStatus(cell, row) : <TableCell key={cell.id}></TableCell>
													} else {
														return <TableCell key={cell.id}>{cell.value}</TableCell>;
													}
												})}
											</TableRow>
										))}
									</TableBody>
								</Table>
									<Pagination
										id="paginationBar"
										pageSizes={[20, 40, 60, 80, 100, 500, 1000]}
										pageSize={xitemsPerPage}
										page={xpageNo}
										totalItems={xtotalCount}
										onChange={paginationHandler}
										className="bx--pagination"
									/>
								</>}
						</TableContainer>
					)}
				/>
			</>
	);
};
export default DTTable;


