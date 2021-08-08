import React, { useEffect, useState } from "react";
import { BrowserRouter, Redirect, useHistory } from "react-router-dom";
import PageHeader from "../../layout/PageHeader";
import {
 Button,
 Dropdown,
 TableSelectAll,
 Search,
 Pagination,
 DataTable,
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
 DataTableSkeleton,
 InlineNotification,
 TooltipIcon,
 InlineLoading,
 RadioButtonGroup,
 RadioButton,
 DropdownSkeleton,
} from "carbon-components-react";
import { Favorite16 } from "@carbon/icons-react";
import gridHeader from "./report-grid-header";
import { Copy16, Delete16, Launch16, Filter16, Play16, Locked16, Information16, Download16, Run16, CloseOutline16 } from "@carbon/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { GetReportingPageData, GetReportingPageDataRows, GetReportCodes, DeleteReports, downloadReport } from "../../../services/reporting-service";
import ReportCopyRenameModal from "./copy-report-rename-modal";
import FullScreenModal from "../../shared/budget-versions-modal/full-screen-modal";
import RunReportModal from "./run-report-modal";
import createHistory from "history/createBrowserHistory";
import { runReport } from "../../../services/reporting-service";
var fileDownload = require("js-file-download");

const Reports = ({ location }) => {
 const breadCrumb = [
  {
   text: "Reports",
   link: "/Reports",
  },
 ];

 const initialStates = {
  dataTableKey: 100,
  orignalRows: null,
 };
 const initialLoadingStates = {
  isLoading: true,
 };
 const UserID = useSelector((state) => state.BudgetVersions.UserID);
 const scenarioTypeList = useSelector((state) => state.MasterData.ScenarioType);
 const [state, setState] = useState(initialStates);
 const [loadingState, setLoadingState] = useState(initialLoadingStates);
 const [xdatarows, setDataRows] = useState({ rows: [] });
 const [paginationStates, setPaginationStates] = useState({ itemsPerPage: 20, pageNo: 1, totalCount: 0 });
 const [scenarioTypeDropdownData, setScenarioTypeDropdownData] = useState([]);
 const [scenarioTypeSelected, setScenarioTypeSelected] = useState({
  id: "all",
  itemTypeValue: "All scenario types",
 });
 const userdateformat = useSelector((state) => state.systemSettings.fiscalStartMonthDateFormat);
 const dateformat = useSelector((state) => state.MasterData.ItemDateFormat);
 const [tableSortState, setTableSortState] = useState({});
 const [searchStringState, setSearchStringState] = useState("");
 const [copyrenameModalOpenState, setCopyRenameModalOpenState] = useState(false);
 const [copyrenamedRowDataState, setCopyRenamedRowDataState] = useState({
  code: "",
  name: "",
  description: "",
 });
 const [runModalOpenState, setRunModalOpenState] = useState(false);
 const [reportsCodeState, setReportsCodeState] = useState([]);
 const [modalTypeState, setModalTypeState] = useState("");
 const [deleteModalOpenState, setDeleteModalOpenState] = useState(false);
 const [selectedRowsState, setSelectedRowsState] = useState({ ids: [] });
 const [notficationStates, setNotficationStates] = useState({ kind: "", title: "", show: false });
 const userDetails = useSelector((state) => state.UserDetails);
 const { View, Add, Edit, Copy, Rename, Run, Delete, Update, Export } = userDetails.reportsAP;
 const [keyStates, setkeyStates] = useState({
  runModalKey: 1,
 });

 let timeOut;

 useEffect(() => {
  GetReportCodes().then((response) => {
   setReportsCodeState(response.data);
  });
 }, []);

 useEffect(() => {
  if (scenarioTypeList) {
   let defaultSelection = {
    id: "all",
    itemTypeValue: "All scenario types",
   };
   let scenarioType = JSON.parse(JSON.stringify([...scenarioTypeList]));
   setScenarioTypeDropdownData([
    defaultSelection,
    ...scenarioType.map((scenatioType) => {
     return { ...scenatioType, id: scenatioType.itemTypeID };
    }),
   ]);
  }
 }, [scenarioTypeList]);

 const handleScenarioTypeCombo = (e) => {
  setScenarioTypeSelected(e.selectedItem);
 };
 // This code is used to handle the notification issue. Issue : Notification remain displayed even on page refreshed, now its resolved.
 useEffect(() => {
  const history = createHistory();
  if (history.location.state && history.location.state.notification) {
   let state = { ...history.location.state };
   delete state.notification;
   if (state.notificationKind) {
    delete state.notificationKind;
   }
   history.replace({ ...history.location, state });
  }
 }, []);

 var mydateFormat = dateformat.find(({ itemTypeValue }) => itemTypeValue === userdateformat);
 if (typeof mydateFormat === "undefined") {
  mydateFormat = "LLLL";
 } else {
  mydateFormat = mydateFormat.itemTypeCode;
 }

 useEffect(() => {
  if (userdateformat && dateformat && UserID) {
   paginationHandler({ page: paginationStates.pageNo, pageSize: paginationStates.itemsPerPage });
  }
 }, [userdateformat, dateformat, UserID, tableSortState, scenarioTypeSelected, searchStringState]);

 const paginationHandler = async ({ page, pageSize, searchString }) => {
  if (!xdatarows.rows.length && !searchStringState) {
   setLoadingState({ ...loadingState, isLoading: true });
  }
  await changeBudgetVersionPageData(page, pageSize, searchString);

  if (!xdatarows.rows.length && !searchStringState) {
   setLoadingState({ ...loadingState, isLoading: false });
  }
 };

 const changeBudgetVersionPageData = async (page, pageSize, searchString = "") => {
  const apireq = await GetReportingPageData({
   params: {
    UserId: UserID,
    PageNo: page,
    itemsPerPage: pageSize,
    DataScenarioType: scenarioTypeSelected?.itemTypeID,
    sortDescending: tableSortState.sortOrder == "DESC",
    sortColumn: tableSortState.sortColumn,
    searchString: searchString || searchStringState,
   },
  });
  let data = JSON.parse(apireq.data);
  // Set this state to USE it at the time of budget verison calculation.
  setState({ ...state, orignalRows: data });
  // TODO : need to update user here
  let rows = GetReportingPageDataRows(data, mydateFormat, "efadmin");
  setDataRows({ rows: rows });
  setPaginationStates({ itemsPerPage: pageSize, pageNo: page, totalCount: apireq.totalCount });

  //total row count needs to be updated if budget version type is Actual or Forecast
  // if (xselectedBudgetVersionType?.itemDisplayName == "Actual") {
  //     setTotalCount(apireq.totalCount);
  // } else if (xselectedBudgetVersionType?.itemDisplayName == "Forecast") {
  //     setTotalCount(apireq.totalCount);
  // } else {
  //     setTotalCount(apireq.totalCount);
  // }
 };

 const onInputChange = (e) => {
  if (timeOut) clearTimeout(timeOut);
  let searchValue = e.target.value;
  timeOut = setTimeout(() => {
   setSearchStringState(searchValue);
  }, 500);
 };

 const onHeaderClick = (sortColumn) => {
  if (!Object.keys(tableSortState).length || tableSortState.sortColumn != sortColumn) {
   setTableSortState({ sortColumn, sortOrder: "ASC" });
   return;
  }
  switch (tableSortState.sortOrder) {
   case "ASC":
    setTableSortState({ sortColumn, sortOrder: "DESC" });
    return;
   case "DESC":
    setTableSortState({});
    return;
   default:
    break;
  }
 };

 const actionsCountCheck = (selectedRows) => {
  if (UserID === null) {
  } else {
   if (selectedRows.length > 1) {
    return (
     <>
      {Export ? (
       <TableBatchAction
        renderIcon={Run16}
        // TODO
        onClick={batchActionClick("run", selectedRows, history, xdatarows)}
       >
        Run
       </TableBatchAction>
      ) : (
       ""
      )}
      {Delete ? (
       <TableBatchAction
        renderIcon={Delete16}
        // TODO
        onClick={batchActionClick("delete", selectedRows, history, xdatarows)}
       >
        Delete
       </TableBatchAction>
      ) : (
       ""
      )}{" "}
     </>
    );
   } else if (selectedRows.length) {
    return (
     <>
      {Edit ? (
       <TableBatchAction
        id="open"
        renderIcon={Launch16}
        primaryFocus
        // TODO
        onClick={batchActionClick("open", selectedRows, history, xdatarows)}
       >
        Open
       </TableBatchAction>
      ) : (
       ""
      )}
      {Copy ? (
       <TableBatchAction renderIcon={Copy16} onClick={batchActionClick("copy", selectedRows, history, xdatarows)}>
        Copy
       </TableBatchAction>
      ) : (
       ""
      )}
      {Rename ? (
       <TableBatchAction
        renderIcon={""}
        // TODO
        onClick={batchActionClick("rename", selectedRows, history, xdatarows)}
       >
        Rename
       </TableBatchAction>
      ) : (
       ""
      )}
      {Export ? (
       <TableBatchAction
        renderIcon={Run16}
        // TODO
        onClick={batchActionClick("run", selectedRows, history, xdatarows)}
       >
        Run
       </TableBatchAction>
      ) : (
       ""
      )}
      {/* {selectedRows[0].cells[5].value === "Need to calculate" && selectedRows[0].cells[4].value === "Forecast" ?
                        <TableBatchAction renderIcon={null}                         
                        // TODO
                        //onClick={batchActionClick("calculate", selectedRows, props, history, dispatch, xdatarows)}
                        >
                            Calculate
                        </TableBatchAction>
                        : null} */}

      {Delete ? (
       <TableBatchAction
        renderIcon={Delete16}
        // TODO
        onClick={batchActionClick(
         "delete",
         selectedRows,
         //props, history, dispatch,
         xdatarows
        )}
       >
        Delete
       </TableBatchAction>
      ) : (
       ""
      )}
     </>
    );
   }
  }
 };

 const handleRowDoubleClick = (selectedRow, history) => () => {
  // TODO
  //const { budgetVersionsListAP } = userDetails;
  if (Edit) history.push("/Report/" + selectedRow.id);
  //if (budgetVersionsListAP.Open)
 };

 const batchActionClick = (action, selectedRows, history, xdatarows) => () => {
  switch (action) {
   case "open":
    history.push("/Report/" + selectedRows[0].id);
    break;
   case "rename":
    setModalTypeState("rename");
    setCopyRenamedRowDataState({
     code: selectedRows[0].cells[0].value,
     name: selectedRows[0].cells[1].value,
     description: selectedRows[0].cells[2].value,
    });
    setCopyRenameModalOpenState(true);
    break;
   case "delete":
    if (selectedRows.length > 0) {
     var IDs = selectedRows.map((x) => x.id);
     setSelectedRowsState({ ...selectedRowsState, ids: IDs });
     setDeleteModalOpenState(true);
    }
    break;

   case "copy":
    setModalTypeState("copy");
    setCopyRenamedRowDataState({
     code: selectedRows[0].cells[0].value,
     name: selectedRows[0].cells[1].value,
     description: selectedRows[0].cells[2].value,
    });
    setCopyRenameModalOpenState(true);
    break;
   case "run":
    if (selectedRows.length > 0) {
     var IDs = selectedRows.map((x) => x.id);
     setSelectedRowsState({ ...selectedRowsState, ids: IDs });
     setRunModalOpenState(true);
    }
    break;
   default:
    break;
  }
 };

 const getCalculationStatus = (cell, row) => {
  debugger;
  if (cell.value === "File created") {
   return (
    <TableCell key={cell.id}>
     <div className={"bx--row"}>
      <div className={"bx--col-lg-6"} style={{ paddingRight: "0" }}>
       <span>{cell.value}</span>
      </div>
      <div className={"bx--col-lg-1"} style={{ paddingLeft: "5px" }}>
       <TooltipIcon tooltipText={"File is in Downloads folder."} direction={"top"}>
        <Information16 />
       </TooltipIcon>
      </div>
     </div>
    </TableCell>
   );
  } else if (cell.value === "Fetching data" || cell.value === "Updating" || cell.value === "Creating") {
   return (
    <TableCell key={cell.id}>
     <>
      <div className={"bx--row"}>
       <div className={"bx--col-lg-6"} style={{ paddingRight: "0" }}>
        <span>{cell.value}</span>{" "}
        <span class="ellipsis-anim">
         <span>.</span>
         <span>.</span>
         <span>.</span>
        </span>
       </div>
       <div className={"bx--col-lg-1"} style={{ paddingLeft: "5px" }}>
        <TooltipIcon tooltipText={"Locked until file created."} direction={"top"}>
         <Locked16 />
        </TooltipIcon>
       </div>
       <div className={"bx--col-lg-1"}>
        <TooltipIcon tooltipText={"Cancel report."} direction={"top"}>
         <CloseOutline16 />
        </TooltipIcon>
       </div>
      </div>
     </>
    </TableCell>
   );
  } else if (cell.value === "Failed") {
   return (
    <TableCell key={cell.id}>
     <>
      <div className={"bx--row"}>
       <div className={"bx--col-lg-6"} style={{ paddingRight: "0" }}>
        <span style={{ fontWeight: "bold", color: "#E0001E", fontSize: "14px" }}>{cell.value}</span>
       </div>
       <div className={"bx--col-lg-1"} style={{ paddingLeft: "5px" }}>
        <TooltipIcon tooltipText={"File creation failed"} direction={"top"}>
         <Information16 style={{ fill: "#FF0000" }} />
        </TooltipIcon>
       </div>
      </div>
     </>
    </TableCell>
   );
  } else if (cell.value === "Created") {
   return (
    <TableCell
     //  onClick={() => {
     //   handleDownloadReport(row.id);
     //  }}
     key={cell.id}
    >
     <>
      <div className={"bx--row"}>
       <div className={"bx--col-lg-6"} style={{ paddingRight: "0" }}>
        <span style={{ fontWeight: "", fontSize: "14px" }}>{cell.value}</span>
       </div>
       <div className={"bx--col-lg-1"} style={{ paddingLeft: "16px" }}>
        <TooltipIcon tooltipText={"Download file."} direction={"top"}>
         <Download16
          onClick={() => {
           handleDownloadReport(row.id);
          }}
         />
        </TooltipIcon>
       </div>
      </div>
     </>
    </TableCell>
   );
  } else {
   return <TableCell key={cell.id}>{cell.value}</TableCell>;
  }
 };

 const handleDownloadReport = (reportid) => {
  debugger;
  downloadReport([
   {
    reportConfigurationID: reportid,
    fileTypeName: "CSV",
    fileTypeExtension: "CSV",
   },
  ]).then((res) => {
   console.log(res.res);
   fileDownload(res.res.data, "NewReport.csv");
   debugger;
  });
 };

 const handlecloseCopyRenameModal = () => {
  setCopyRenameModalOpenState(false);
 };

 const handlecloseCopyRenameModalWithNotification = (success = false, modalType = "") => {
  setCopyRenameModalOpenState(false);
  paginationHandler({ page: paginationStates.pageNo, pageSize: paginationStates.itemsPerPage });
  var title = "";
  var kind = success ? "success" : "error";
  if (modalType === "rename") {
   if (success) {
    title = "Report renamed.";
   } else {
    title = "Error while rename a report";
   }
  } else if (modalType === "copy") {
   if (success) {
    title = "Report copied.";
   } else {
    title = "Error while copying a report";
   }
  }
  setNotficationStates({ ...notficationStates, show: true, kind: kind, title: title });
 };

 const handleCloseDeleteModal = () => {
  setDeleteModalOpenState(false);
 };
 const handleCloseRunModal = () => {
  setRunModalOpenState(false);
  setTimeout(() => {
   setkeyStates({ ...keyStates, runModalKey: keyStates.runModalKey + 1 });
  }, 500);
 };

 const handledeleteReports = async () => {
  const reportIds = selectedRowsState.ids;
  await DeleteReports(reportIds).then((response) => {
   setSelectedRowsState({ ...selectedRowsState, ids: [] });
   paginationHandler({ page: paginationStates.pageNo, pageSize: paginationStates.itemsPerPage });
   setNotficationStates({ ...notficationStates, show: true, kind: "success", title: "Report(s) deleted." });
  });
 };

 const handleNotificationClose = () => {
  setNotficationStates({ ...notficationStates, show: false });
 };

 const history = useHistory();
 const handleClickAdd = () => {
  history.push("/AddReport");
 };

 return (
  <>
   {View ? (
    <>
     <PageHeader heading="Reports" icon={<Favorite16 />} breadCrumb={breadCrumb} notification={location?.state?.notification} notificationKind={location?.state?.notificationKind} />

     {notficationStates.show ? <InlineNotification onCloseButtonClick={handleNotificationClose} title={notficationStates.title} kind={notficationStates.kind} lowContrast="true" notificationType="inline" className="add-budgetversion-notification" /> : null}
     {loadingState.isLoading ? (
      <DataTableSkeleton columnCount={5} compact={false} rowCount={10} zebra={false} />
     ) : (
      <>
       <DataTable
        key={state.datatableKey}
        rows={xdatarows.rows}
        headers={gridHeader}
        isSortable={true}
        radio={false}
        pagination={true}
        render={({ rows, headers, getHeaderProps, defaultProps, getRowProps, getTableProps, getSelectionProps, selectedRows, getBatchActionProps, OverflowMenuProps }) => (
         <TableContainer className="budget-version-table-container">
          <TableToolbar>
           <TableToolbarContent>
            <Search placeHolderText="Search reports" onChange={onInputChange} />
            <div style={{ width: 220 }}>
             <Dropdown
              id="report-scenario-type-filter-dropdown"
              className="grid-filter-dropdown"
              placeholder="All scenario types"
              label="All scenario types"
              aria-label="All scenario types"
              title="All scenario types"
              ariaLabel="All scenario types"
              role="option"
              items={scenarioTypeDropdownData}
              itemToString={(item) => (item ? item.itemTypeValue : "")}
              selectedItem={scenarioTypeDropdownData.find((scenarioType) => {
               return scenarioType.id === scenarioTypeSelected.id;
              })}
              onChange={(e) => {
               handleScenarioTypeCombo(e);
              }}
             />
            </div>
            {Add ? (
             <Button id="btnAddReport" small kind="primary" onClick={handleClickAdd}>
              Add &nbsp; &nbsp;+
             </Button>
            ) : (
             ""
            )}{" "}
           </TableToolbarContent>
           {selectedRows.length ? (
            <TableBatchActions {...getBatchActionProps()}>
             {/* inside of you batch actinos, you can include selectedRows */}

             {/* TODO */}
             {actionsCountCheck(selectedRows)}
            </TableBatchActions>
           ) : (
            <></>
           )}{" "}
          </TableToolbar>
          {!xdatarows.rows.length ? (
           <p className="table-no-data"> No report found.</p>
          ) : (
           <>
            <Table key={state.datatableKey} id={state.datatableKey} className="budget-version-table" size="compact" {...getTableProps}>
             <TableHead>
              <TableRow>
               <TableSelectAll {...getSelectionProps()} />
               {headers.map((header) => {
                if (header.key === "overflow") {
                 return <TableHeader></TableHeader>;
                } else {
                 return (
                  <TableHeader
                   {...getHeaderProps({
                    header,
                    onClick: () => onHeaderClick(header.key),
                   })}
                  >
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
               <TableRow onDoubleClick={handleRowDoubleClick(row, history)} {...getRowProps({ row })} key={row.budgetVersionID}>
                <TableSelectRow {...getSelectionProps({ row })} />
                {row.cells.map((cell) => {
                 if (cell.info.header === "overflow" && UserID !== null) {
                  return (
                   <TableCell key={cell.id} id={cell.id} className={`la-${cell.info.header}`}>
                    {/* TODO */}
                    {/* <OverflowMenu id={cell.id} {...OverflowMenuProps} className="bx--overflow-menu__trigger" flipped="true" requireTitle="false" buttonKind="ghost">
                   {overflowMenuItems.map((menuItem) => (
                    <OverflowMenuItem id="abcd" key={menuItem.id} itemText={menuItem.itemText} hasDivider={menuItem.hasDivider} isDelete={menuItem.isDelete} primaryFocus={menuItem.primaryFocus} requireTitle="true" onClick={overflowMenuItemClick(menuItem, row.id, props, history, dispatch, xdatarows)} />
                   ))}
                  </OverflowMenu> */}
                   </TableCell>
                  );
                 } else if (cell.info.header === "ReportProcessingStatus") {
                  return getCalculationStatus(cell, row);
                 } else {
                  return <TableCell key={cell.id}>{cell.value}</TableCell>;
                 }
                })}
               </TableRow>
              ))}
             </TableBody>
            </Table>
            <Pagination id="paginationBar" pageSizes={[10, 20, 40, 60, 80, 100, 500, 1000]} pageSize={paginationStates.itemsPerPage} page={paginationStates.pageNo} totalItems={paginationStates.totalCount} onChange={paginationHandler} className="bx--pagination" />
           </>
          )}
         </TableContainer>
        )}
       />

       <ReportCopyRenameModal closeCopyRenameModalWithNotification={handlecloseCopyRenameModalWithNotification} modalType={modalTypeState} selectedReportValues={copyrenamedRowDataState} isOpen={copyrenameModalOpenState} closeCopyRenameModal={handlecloseCopyRenameModal} allReportsCodes={reportsCodeState} />

       <FullScreenModal
        open={deleteModalOpenState}
        className="budget-version-delete-modal"
        hasScrollingContent={false}
        iconDescription="Close"
        modalAriaLabel="Are you sure you want to delete the selected item(s)?"
        modalHeading="Delete confirmation"
        onRequestClose={() => {
         handleCloseDeleteModal();
        }}
        onRequestSubmit={() => {
         handledeleteReports();
         handleCloseDeleteModal();
        }}
        onSecondarySubmit={() => {
         handleCloseDeleteModal();
        }}
        passiveModal={false}
        primaryButtonDisabled={false}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        size="xs"
       >
        <p className="bx--modal-content__text single-line-text">
         Are you sure you want to delete the selected item(s)?
         <br />
         <br />
         You cannot recover a deleted item.
        </p>
       </FullScreenModal>

       <RunReportModal selectedReportValues={selectedRowsState} key={keyStates.runModalKey} isOpen={runModalOpenState} closeRunReportModal={handleCloseRunModal}></RunReportModal>
      </>
     )}
    </>
   ) : null}
  </>
 );
};

export default Reports;
