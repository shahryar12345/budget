import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Delete16, Launch16 } from "@carbon/icons-react";
import { useHistory } from "react-router-dom";
import { Button, DataTable, OverflowMenu, OverflowMenuItem, Pagination, TableSelectAll, Search } from "carbon-components-react";
import gridheaders from "./headers/pay-type-distribution-header";
import overflowMenuItems from "./headers/pay-type-distribution-overflow-menu";
import { GetPayTypeDistribution, GetPayTypeDistributionPageDataRows, DeletePayTypeDistribution } from "../../../services/pay-type-distribution-service";
import FullScreenModal from "../../shared/budget-versions-modal/full-screen-modal";
import itemsDateFormat from "../MasterData/forecastMethodType";
const { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableToolbar, TableToolbarContent, TableToolbarSearch, TableSelectRow, TableBatchActions, TableBatchAction } = DataTable;

const PayTypeDistributionGrid = ({
  match,
  disabledAddButton,
  addButtonClick,
  isAdd,
  isEdit,
  isDelete }) => {
  const initialStates = {
    showNotification: false,
    notificationKind: "",
    notificationTitle: "",
    showDeleteConfirmation: false,
    IDs: []
  };
  const history = useHistory();
  const [localState, SetlocalState] = useState(initialStates);
  const [rowsState, setRowsState] = useState({ rows: [], searchedRows: [], rowsToShow: [] });
  const [tableSortState, setTableSortState] = useState({});
  const [paginationStates, setPaginationStates] = useState({ pageSize: 10, pageNumber: 1 });
  const UserID = useSelector((state) => state.BudgetVersions.UserID);
  const dateformat = useSelector((state) => state.MasterData.ItemDateFormat);
  const userSystemSettings = useSelector(
    (state) => state.systemSettings
  );
  useEffect(() => {
    getPayTypeDistributionData();
  }, []);

  const getPayTypeDistributionData = async () => {
    let userSelectedDateFormat = dateformat.find(data => data.itemTypeValue === userSystemSettings.fiscalStartMonthDateFormat);
    userSelectedDateFormat = userSelectedDateFormat !== undefined ? userSelectedDateFormat.itemTypeCode : 'LLLL';
    await GetPayTypeDistribution().then((response) => {
      let RowData = GetPayTypeDistributionPageDataRows(response.data, userSelectedDateFormat, "1");
      setRowsState({ ...rowsState, rows: [...RowData], searchedRows: [...RowData], rowsToShow: [...RowData.slice(0, 10)] });
    });
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
        return;
    }
  };

  const handleRowDoubleClick = (selectedRow, history) => () => {
    if (isEdit)
      history.push("/EditPayTypeDistribution/" + selectedRow.id);
  };

  const overflowMenuItemClick = (e, rowID, history) => () => {
    switch (e.itemText) {
      case "Open":
        history.push("/EditPayTypeDistribution/" + rowID);
        break;
      case "Delete":
        if (e.length !== "1") {
          SetlocalState({ ...localState, showDeleteConfirmation: true, IDs: [rowID] });
        }
        break;
      default:
        //
        break;
    }
  };
  let searchedTimeOut;
  const onInputChange = (e) => {
    let searchString = e.target.value;
    let searchResult = [];
    if (searchedTimeOut) {
      clearTimeout(searchedTimeOut);
    }
    searchedTimeOut = setTimeout(() => {
      if (searchString) {
        let data = [...rowsState.rows];
        searchResult = data.filter((item) => {
          return (
            item.code.toLowerCase().includes(searchString.toLowerCase()) || item.description.toLowerCase().includes(searchString.toLowerCase()) || item.name.toLowerCase().includes(searchString.toLowerCase()) || item.updatedDate.toLowerCase().includes(searchString.toLowerCase()) || item.userProfileId.toLowerCase().includes(searchString.toLowerCase())
          );
        });
      } else {
        searchResult = [...rowsState.rows];
      }
      setPaginationStates({ pageSize: 10, pageNumber: 1 });
      setRowsState({ ...rowsState, searchedRows: [...searchResult], rowsToShow: [...searchResult.slice(0, 10)] });
    });
  };

  const actionsCountCheck = (selectedRows) => {
    if (UserID === null) {
    } else {
      if (selectedRows.length > 1) {
        return (<>
          { isDelete ? <TableBatchAction renderIcon={Delete16} onClick={batchActionClick("delete", selectedRows, history)}>
            Delete
          </TableBatchAction> : ''
          }        </>);
      } else {
        return (
          <>
            {isEdit ? <TableBatchAction id="open" renderIcon={Launch16} primaryFocus onClick={batchActionClick("open", selectedRows, history)}>
              Open
      </TableBatchAction> : ""
            }
            {isDelete ? <TableBatchAction renderIcon={Delete16} onClick={batchActionClick("delete", selectedRows, history)}>
              Delete
      </TableBatchAction> : ""}
          </>

        );
      }
    }
  };

  const batchActionClick = (action, selectedRows, history) => () => {
    switch (action) {
      case "open":
        history.push("/EditPayTypeDistribution/" + selectedRows[0].id);
        break;
      case "delete":
        if (selectedRows.length > 0) {
          var IDs = selectedRows.map((x) => x.id);
          SetlocalState({ ...localState, showDeleteConfirmation: true, IDs: [...IDs] });
        }
        break;
      default:
        //
        break;
    }
  };

  const paginationHandler = (e) => {
    setTimeout(() => {
      let updatedRows = rowsState.searchedRows.slice((e.page - 1) * e.pageSize, (e.page - 1) * e.pageSize + e.pageSize);
      setPaginationStates({ pageSize: e.pageSize, pageNumber: e.page });
      setRowsState({ ...rowsState, rowsToShow: [...updatedRows] });
    }, 0);
  };

  const deletePayTypes = async () => {
    await DeletePayTypeDistribution(localState.IDs).then((res) => {
      getPayTypeDistributionData();
    });
  }

  const overflowMenuItemsModified = [];
  overflowMenuItems.forEach(data => {
    if (data.itemText === 'Open' && isEdit)
      overflowMenuItemsModified.push(data)
    else if (data.itemText === 'Delete' && isDelete)
      overflowMenuItemsModified.push(data)
  })
  return (
    <div>
      <div className={"bx--row"}>
        <div className={"bx--col-lg"}>
          <DataTable
            rows={rowsState.rowsToShow}
            headers={gridheaders}
            isSortable={true}
            radio={false}
            pagination={true}
            render={({ rows, headers, getHeaderProps, defaultProps, getRowProps, getTableProps, getSelectionProps, selectedRows, getBatchActionProps, OverflowMenuProps }) => (
              <TableContainer className="budget-version-table-container">
                <TableToolbar>
                  <TableToolbarContent>
                    <Search placeHolderText="Search pay type distribution" onChange={onInputChange} />
                    {isAdd && <Button id="btnAddBudget" small kind="primary" disabled={disabledAddButton} onClick={addButtonClick}>
                      Add &nbsp; &nbsp;+
          </Button>}
                  </TableToolbarContent>

                  <TableBatchActions {...getBatchActionProps()}>
                    {/* inside of you batch actinos, you can include selectedRows */}
                    {actionsCountCheck(selectedRows)}
                  </TableBatchActions>
                </TableToolbar>
                {!rowsState.rows.length ? (
                  <p className="table-no-data"> No pay type distribution record found.</p>
                ) : (
                  <>
                    <Table className="budget-version-table" size="compact" {...getTableProps}>
                      <TableHead>
                        <TableRow>
                          <TableSelectAll {...getSelectionProps()} />

                          {headers.map((header) => {
                            if (header.key === "overflow") {
                              return <TableHeader></TableHeader>;
                            } else {
                              return <TableHeader {...getHeaderProps({ header, onClick: () => onHeaderClick(header.key) })}>{header.header}</TableHeader>;
                            }
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow onDoubleClick={handleRowDoubleClick(row, history)} {...getRowProps({ row })} key={row.budgetVersionID}>
                            <TableSelectRow {...getSelectionProps({ row })} />
                            {row.cells.map((cell) => {
                              if (cell.info.header === "overflow" && UserID !== null) {
                                return (
                                  <TableCell key={cell.id} id={cell.id} className={`la-${cell.info.header}`}>
                                    <OverflowMenu id={cell.id} {...OverflowMenuProps} className="bx--overflow-menu__trigger" flipped="true" requireTitle="false" buttonKind="ghost">
                                      {overflowMenuItemsModified.map((menuItem) => (
                                        <OverflowMenuItem id="abcd" key={menuItem.id} itemText={menuItem.itemText} hasDivider={menuItem.hasDivider} isDelete={menuItem.isDelete} primaryFocus={menuItem.primaryFocus} requireTitle="true" onClick={overflowMenuItemClick(menuItem, row.id, history)} />
                                      ))}
                                    </OverflowMenu>
                                  </TableCell>
                                );
                              } else {
                                return <TableCell key={cell.id}>{cell.value}</TableCell>;
                              }
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <Pagination id="paginationBar" pageSizes={[10, 20, 40, 60, 80, 100, 500, 1000]} page={paginationStates.pageNumber} pageSize={paginationStates.pageSize} totalItems={rowsState.searchedRows.length} onChange={paginationHandler} className="bx--pagination" />
                  </>
                )}
              </TableContainer>
            )}
          />


          <FullScreenModal
            open={localState.showDeleteConfirmation}
            className="budget-version-delete-modal"
            hasScrollingContent={false}
            iconDescription="Close"
            modalAriaLabel="Are you sure you want to delete the selected item(s)?"
            modalHeading="Delete confirmation"
            onRequestClose={() => {
              SetlocalState({ ...localState, showDeleteConfirmation: false, IDs: localState.IDs });
            }}
            onRequestSubmit={() => {
              deletePayTypes();
              // close the confirmation dialog and clear out the selected IDs
              SetlocalState({ ...localState, showDeleteConfirmation: false, IDs: [] });
              setRowsState({ ...rowsState, rows: [], searchedRows: [], rowsToShow: [] });
            }}
            onSecondarySubmit={() => {
              SetlocalState({ ...localState, showDeleteConfirmation: false, IDs: localState.IDs });
            }}
            passiveModal={false}
            primaryButtonDisabled={false}
            primaryButtonText="Delete"
            secondaryButtonText="Cancel"
            size='xs'
          >
            <p className="bx--modal-content__text single-line-text">
              Are you sure you want to delete the selected item(s)?
            <br />
              <br />
            You cannot recover a deleted item.
          </p>
          </FullScreenModal>
        </div>
      </div>
    </div>
  );
};
export default PayTypeDistributionGrid;
