import React, { useState, useEffect, useLayoutEffect } from "react";
import { Tabs, Tab, MultiSelect, DataTable, Dropdown, DataTableSkeleton, Checkbox, TableContainer, TooltipIcon, Table, TableHead, TableRow, TableBody, TableHeader, TableCell, Pagination, TableToolbar, TableSelectRow, Search, RadioButton } from "carbon-components-react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown16, CheckmarkFilled16, CircleDash16, ChevronUp16, ChevronRight16, ChevronLeft16, IncompleteWarning16, RowExpand16, Json16 } from "@carbon/icons-react";
import "../single-select/single-select.scss";
import { getQuickPickedRows } from "./operations/quick-picks-operations";
const MultiSelectQuickPickGrid = ({ headerData, rowGroupedData, individualMembersGridData, modalState, onSelectionChange, initialSelectedValue, name, onSubmit, selectableLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], hideGroupsToggle = false, id, hideGroups = false, onPageSizeChange, groupSelectable }) => {
 const [tabSelectedIndex, setTabSelectedIndex] = useState(0);
 const [orignalRowDataState, SetorignalRowDataState] = useState([...rowGroupedData]);
 const [rowsState, setRowsState] = useState([]);
 const [quickpickedRowStates, setQickpickedRowStates] = useState([...rowGroupedData]);

 const [headersState, setHeadersState] = useState(headerData);
 const [tableSortState, setTableSortState] = useState({});
 const [searchStringState, setSearchStringState] = useState("");
 const [paginationState, setPaginationState] = useState({ page: 1, pageSize: 10 });
 const [totalCount, setTotalCount] = useState(0);
 const [hideGroupState, setHideGroupState] = useState(hideGroups);

 const [checkboxSelectionState, setCheckboxSelectionState] = useState([]);
 const [snowBallSelectionState, setSnowBallSelectionState] = useState([]);
 const [multiSelectKeyState, setMultiSelectKeyState] = useState(1);
 const [gridLoadState, setGridLoadState] = useState(true);

 const quickPickItemList = [
  { id: "allGroupsShow", key: "allGroupsShow-" + name, value: "Show all groups", group: undefined },
  { id: "allItemsShow", key: "allItemsShow-" + name, value: "Show all items", group: undefined },
  { id: "allGroupWithItemSelect", key: "allGroupWithItemSelect-" + name, value: "Select all groups including their items", group: "selection" },
  { id: "allGroupWithOutItemSelect", key: "allGroupWithOutItemSelect-" + name, value: "Select all groups excluding their items", group: "selection" },
  { id: "allItemsSelect", key: "allItemsSelect-" + name, value: "Select all items (no groups)", group: "selection" },
  { id: "displayedGroupsSelect", key: "displayedGroupsSelect-" + name, value: "Select displayed groups", group: "selection" },
  { id: "displayedGroupsWithItemsSelect", key: "displayedGroupsWithItemsSelect-" + name, value: "Select displayed groups and their displayed items", group: "selection" },
  { id: "hideUnSelected", key: "hideUnSelected-" + name, value: "Hide unselected", group: undefined },
 ];

 const [quickPicksSelectedItemState, setQuickPicksSelectedItemState] = useState([
  //   { id: "allGroupsShow", key: "allGroupsShow-" + name, value: "Show all groups" },
  //   { id: "allItemsShow", key: "allItemsShow-" + name, value: "Show all items" },
  //   { id: "allItemsSelect", key: "allItemsSelect-" + name, value: "Select all items (no groups)" },
  quickPickItemList[0],
  quickPickItemList[1],
  quickPickItemList[4],
 ]);
 useEffect(() => {
  getPageData();
 }, [searchStringState, paginationState, tableSortState, hideGroupState]);

 useEffect(() => {
  setGridLoadState(false);
  setTimeout(() => {
   let result = getQuickPickedRows(quickPicksSelectedItemState, JSON.parse(JSON.stringify(orignalRowDataState)), JSON.parse(JSON.stringify(individualMembersGridData)));
   setQickpickedRowStates([...result.dataToShow]);
   getPageData(result.dataToShow);
   setCheckboxSelectionState([...result.checkboxSelectedValues]);
   setSnowBallSelectionState([...result.snowBallSelectedValues]);
   setGridLoadState(true);
  }, 1000);
 }, [quickPicksSelectedItemState]);

 useEffect(() => {
  onSelectionChange({ selectedItems: [...checkboxSelectionState, ...snowBallSelectionState] });
 }, [checkboxSelectionState, snowBallSelectionState]);

 const getPageData = (rows = quickpickedRowStates) => {
  const filteredRows = filterBySort(filterBySearch([...rows]));
  setTotalCount(filteredRows.length);
  const startingIndex = (paginationState.page - 1) * paginationState.pageSize;
  setRowsState(filteredRows.slice(startingIndex, startingIndex + paginationState.pageSize));
 };
 const filterBySearch = (rows) => {
  if (!searchStringState) return rows;
  return rows.filter((obj) => Object.values(obj).some((val) => (val ? JSON.stringify(val).toLowerCase().includes(searchStringState.toLowerCase()) : false)));
 };
 const filterBySort = (rows) => {
  if (!Object.keys(tableSortState).length) return rows;

  if (tableSortState.sortOrder == "ASC") return rows.sort((a, b) => (JSON.stringify(a[tableSortState.sortColumn]) > JSON.stringify(b[tableSortState.sortColumn]) ? 1 : JSON.stringify(a[tableSortState.sortColumn]) < JSON.stringify(b[tableSortState.sortColumn]) ? -1 : 0));

  if (tableSortState.sortOrder == "DESC") return rows.sort((a, b) => (JSON.stringify(a[tableSortState.sortColumn]) < JSON.stringify(b[tableSortState.sortColumn]) ? 1 : JSON.stringify(a[tableSortState.sortColumn]) > JSON.stringify(b[tableSortState.sortColumn]) ? -1 : 0));
 };
 const onInputChange = (e) => {
  setSearchStringState(e.target.value);
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
    return;
  }
 };
 const onChevronClick = (e, headerIndex, detailIndex) => {
  e.preventDefault();
  if (headersState[headerIndex].extraDetails.filter((item) => item.isHidden === false).length == 1 && !headersState[headerIndex].extraDetails[detailIndex].isHidden) return;
  const headersClone = JSON.parse(JSON.stringify(headersState));
  headersClone[headerIndex].extraDetails[detailIndex].isHidden = !headersClone[headerIndex].extraDetails[detailIndex].isHidden;
  setHeadersState(headersClone);
 };

 const handleCheckBoxSelectionWrapper = (checked, row) => {
  let selectedRow = handleCheckBoxSelection(checked, row, checkboxSelectionState);
  setCheckboxSelectionState([...selectedRow]);
 };

 const handleCheckBoxSelection = (checked, row, alreadyCheckValues) => {
  // if row is deselected, add it to the list
  // if it has been reselected, remove it
  let alreadyChecked = alreadyCheckValues.findIndex((item) => {
   return item.id === row.id && item.parentId === row.parentId;
  });
  if (!checked) {
   if (alreadyChecked === -1) {
    alreadyCheckValues = [...alreadyCheckValues, row];
   }
  } else {
   if (alreadyChecked !== -1) {
    alreadyCheckValues.splice(alreadyChecked, 1);
   }
  }

  if (row.isGroup) {
   row.childRows.forEach((childRow) => {
    alreadyCheckValues = handleCheckBoxSelection(checked, childRow, alreadyCheckValues);
   });
  } else {
  }
  return alreadyCheckValues;
 };

 const getRowCheckedStatus = (row) => {
  if (row?.childRows?.length > 0) {
   const selectedRows = row.childRows.filter((child) => {
    return checkboxSelectionState.find((item) => item.id === child.id && item.parentId === child.parentId);
   });
   return row.childRows.length === selectedRows.length;
  } else {
   return checkboxSelectionState.find((item) => item.id === row.id && item.parentId === row.parentId) ? true : false;
  }
 };

 const getGroupRowCheckedStatus = (row) => {
  return snowBallSelectionState.find((item) => item.id === row.id);
 };

 const handleSnowballSelectionForGroups = (row, checked) => {
  let alreadyChecked = snowBallSelectionState.findIndex((item) => {
   return item.id === row.id;
  });
  if (checked) {
   // Will show/Filter only these groups which is added in this store state, Opposite of member item filter. Because by default groups are unChecked.
   if (alreadyChecked === -1) {
    let updatedStates = [...snowBallSelectionState];
    setSnowBallSelectionState([...updatedStates, row]);
   }
  } else {
   if (alreadyChecked !== -1) {
    let updatedStatesRemove = [...snowBallSelectionState];
    updatedStatesRemove.splice(alreadyChecked, 1);
    setSnowBallSelectionState([...updatedStatesRemove]);
   }
  }
 };

 const getRowIndeterminateStatus = (row) => {
  if (row?.childRows?.length > 0) {
   // get number of selected child rows
   const selectedRows = row.childRows.filter((child) => {
    return checkboxSelectionState.find((item) => item.id === child.id && item.parentId === child.parentId);
   });
   // we only want to return indeterminate if we have 1 or more
   // selected rows but less than the total number of rows
   let groupSelected = snowBallSelectionState.find((item) => item.id === row.id) ? true : false;
   return (selectedRows.length > 0 || groupSelected) && selectedRows.length < row.childRows.length;
  } else {
   return false;
  }
 };

 const getTableRow = (row, rowIndexArray, isParentExpanded) => {
  const chevronProps = { onClick: (e) => toggleRows(rowIndexArray), className: "single-select-group-table-row-chevron" };
  const hasChild = row.childRows?.length || row.isGroup || row.isHierarchy;
  const showChevron = row.childRows?.length;
  const isChecked = getRowCheckedStatus(row);
  const isGroupChecked = getGroupRowCheckedStatus(row);
  const isIndeterminate = getRowIndeterminateStatus(row);

  return (
   <TableRow
    className={`${hasChild ? "bold" : ""} ${isParentExpanded ? "" : "single-select-group-table-collapsed-row"}`}
    key={row.id + "-" + name}
    id={row.id + "-" + name}
    //onDoubleClick={(e) => handleDoubleClick(e, row)}
   >
    {hasChild && groupSelectable === false ? (
     <TableCell></TableCell>
    ) : (
     <TableCell onClick={(e) => handleCheckBoxSelectionWrapper(isChecked, row, checkboxSelectionState)}>{selectableLevels.includes(getDepth(row)) ? <Checkbox key={"multiselect-checkbox-" + row.id + "-" + name} indeterminate={isIndeterminate} name={name + "-" + id} checked={isChecked}></Checkbox> : ""}</TableCell>
    )}
    {headersState.map((header) =>
     header.type == "tree" ? (
      <TableCell style={{ paddingLeft: 10 + (!row.childRows?.length && rowIndexArray.length > 1 ? 0 : 0) + (rowIndexArray.length - 1) * 20 }} key={row.id + header.key}>
       {showChevron ? row.isExpanded ? <ChevronUp16 {...chevronProps} /> : <ChevronDown16 {...chevronProps} /> : ""}
       {hasChild ? (
        isGroupChecked ? (
         <CheckmarkFilled16
          style={{ marginRight: "5px" }}
          onClick={(e) => {
           handleSnowballSelectionForGroups(row, false);
          }}
         />
        ) : (
         <CircleDash16
          style={{ marginRight: "5px" }}
          onClick={(e) => {
           handleSnowballSelectionForGroups(row, true);
          }}
         />
        )
       ) : null}
       {header.extraDetails?.map((detail) => {
        return `${!detail.isHidden ? row[header.key][detail.key] || "" : ""} `;
       })}
      </TableCell>
     ) : (
      <TableCell key={row.id + header.key}>{row[header.key]}</TableCell>
     )
    )}
   </TableRow>
  );
 };

 const getRow = (row, rowIndexArray, isParentExpanded) => {
  return (
   <>
    {rowIndexArray.length && (row.isRemoved === false || row.isRemoved === undefined) ? getTableRow(row, rowIndexArray, isParentExpanded) : null}
    {isParentExpanded && row.childRows?.map((nextLevelRow, nextLevelRowIndex) => getRow(nextLevelRow, [...rowIndexArray, nextLevelRowIndex], row.isExpanded))}
   </>
  );
 };

 const selectRow = (e, row) => {
  const radioButton = e.target.parentElement.querySelector("input");
  if (radioButton) {
   radioButton.checked = true;
   onSelectionChange({ selectedItem: row });
  }
 };

 const getExpendedRowObject = (row, id) => {
  if (row.id === id) {
   return row;
  } else {
   if (row?.childRows?.length > 0) {
    let rowFound = undefined;
    row.childRows.every((rowInner) => {
     rowFound = getExpendedRowObject(rowInner, id);
     if (rowFound) {
      return false;
     }
     return true;
    });
    return rowFound;
   }
   return undefined;
  }
 };

 const toggleRows = (rowIndexArray) => {
  const rowsClone = JSON.parse(JSON.stringify(rowsState));
  let rowRef = { childRows: rowsClone };
  rowIndexArray.forEach((index) => {
   rowRef = rowRef.childRows[index];
  });
  rowRef.isExpanded = !rowRef.isExpanded;
  setRowsState(rowsClone);
  let orignalData = JSON.parse(JSON.stringify(orignalRowDataState));
  let orignalDataObject = undefined;
  orignalData
   .filter((item) => {
    return item.isGroup || item.isHierarchy;
   })
   .every((row) => {
    orignalDataObject = getExpendedRowObject(row, rowRef?.id);
    if (orignalDataObject) {
     return false; // to break the loop
    }
    return true; // to continue the loop
   });
  if (orignalDataObject) {
   orignalDataObject.isExpanded = rowRef.isExpanded;
  }
  SetorignalRowDataState(orignalData);

  let orignalDataQuickEdPick = JSON.parse(JSON.stringify(quickpickedRowStates));
  let orignalDataQuickEdPickObject = undefined;
  orignalDataQuickEdPick
   .filter((item) => {
    return item.isGroup || item.isHierarchy;
   })
   .every((row) => {
    orignalDataQuickEdPickObject = getExpendedRowObject(row, rowRef?.id);
    if (orignalDataQuickEdPickObject) {
     return false; // to break the loop
    }
    return true; // to continue the loop
   });
  if (orignalDataQuickEdPickObject) {
   orignalDataQuickEdPickObject.isExpanded = rowRef.isExpanded;
  }
  setQickpickedRowStates(orignalDataQuickEdPick);
 };

 const getDepth = (row) => {
  var depth = 0;
  if (row.childRows?.length) {
   row.childRows.forEach((child) => {
    var tmpDepth = getDepth(child);
    if (tmpDepth > depth) {
     depth = tmpDepth;
    }
   });
  }
  return 1 + depth;
 };

 //  const handleDoubleClick = (e, row) => {
 //   selectRow(e, row);
 //   onSubmit();
 //  };
 const handlePagination = (e) => {
  setPaginationState(e);
  if (onPageSizeChange) {
   onPageSizeChange(e);
  }
 };

 const handleQuickPickMultiselect = (e) => {
  let previousSelectedItems = [...quickPicksSelectedItemState];
  const currentItem = e.selectedItems.filter((item) => !previousSelectedItems.find((previousItem) => item.id === previousItem.id));
  let newSelection = [];
  if (currentItem.length && currentItem[0].group === "selection") {
   // Remove the item selected in the same group.
   newSelection = previousSelectedItems.filter((previosusItem) => {
    return previosusItem.group !== "selection" || previosusItem.group === undefined;
   });
   newSelection.push(currentItem[0]);
   setQuickPicksSelectedItemState([...newSelection]);
  } else {
   setQuickPicksSelectedItemState([...e.selectedItems]);
  }
  setMultiSelectKeyState(multiSelectKeyState + 1);
 };
 return (
  <div style={{ width: "100%" }}>
   <Tabs key={"search-modal-Tabs-"} id={"search-modal-Tabs-"} scrollIntoView={false} selected={tabSelectedIndex} type={"default"} className={"quickPick-Tab-Group"}>
    <Tab href="#" id="tab-1" label="Rows">
     <div className="some-content">
      {gridLoadState ? (
       <DataTable
        isSortable={true}
        rows={rowsState}
        headers={headersState}
        paginationHandler={handlePagination}
        radio
        selectedRows={[initialSelectedValue]}
        render={({ getHeaderProps, getSelectionProps, paginationHandler, selectRow }) => (
         <TableContainer className="single-select-group-table-container">
          <TableToolbar>
           <Search onChange={onInputChange} placeHolderText="Search" />
           <div style={{ width: 750 }}>
            <MultiSelect
             sortItems={() => {
              return quickPickItemList;
             }}
             id={"quickPick-multiselect-" + name}
             key={"quickPick-multiselect-" + name + "-" + multiSelectKeyState}
             className={"multiselect-quick-pick"}
             items={quickPickItemList}
             invalidText="Invalid Selection"
             itemToString={(item) => (item ? item.value : "")}
             placeholder={"Quick picks"}
             onChange={(e) => handleQuickPickMultiselect(e)}
             selectionFeedback="top-after-reopen"
             //items={props.multiselectData}
             //invalid={props?.invalid}
             direction="bottom"
             initialSelectedItems={quickPickItemList.filter((item) => {
              return quickPicksSelectedItemState.find((itemFound) => itemFound.id === item.id);
             })}
             label={"Quick picks"}
             labelText={"Quick picks"}
             titleText={""}
             light={false}
             locale="en"
             title={false}
             type="default"
             ariaLabel={"Quick_picks"}
             aira-label={"Quick_picks"}
            />
           </div>
          </TableToolbar>
          <div className="single-select-table-wrapper">
           <Table className="single-select-group-table">
            <TableHead>
             <TableRow className="single-select-group-table-header-row">
              <TableHeader />
              {headersState.map((header, headerIndex) => (
               <TableHeader key={header.key} {...getHeaderProps({ header, onClick: () => onHeaderClick(header.key) })}>
                {header.header}
                <br />
                {header.extraDetails &&
                 header.extraDetails.map((detail, detailIndex) => {
                  return (
                   <>
                    {detail.isHidden ? (
                     <TooltipIcon direction="bottom" align="start" tooltipText={detail.showTooltipText}>
                      <ChevronRight16 className="single-select-group-table-header-chevron" onClick={(e) => onChevronClick(e, headerIndex, detailIndex)} />
                     </TooltipIcon>
                    ) : (
                     <>
                      <TooltipIcon direction="bottom" align="start" tooltipText={detail.hideTooltipText}>
                       <ChevronLeft16 className="single-select-group-table-header-chevron" onClick={(e) => onChevronClick(e, headerIndex, detailIndex)} />
                      </TooltipIcon>{" "}
                      {detail.text}{" "}
                     </>
                    )}
                   </>
                  );
                 })}
               </TableHeader>
              ))}
             </TableRow>
            </TableHead>
            <TableBody>{rowsState.length ? getRow({ childRows: rowsState, isExpanded: true }, [], true) : ""}</TableBody>
           </Table>
          </div>
          {!rowsState.length ? <p className="table-no-data"> No records found.</p> : ""}
          <Pagination id={"single-select-group-table-pagination-" + name} pageSizes={[10, 20, 50, 100]} totalItems={totalCount} onChange={handlePagination} />
         </TableContainer>
        )}
       />
      ) : (
       <DataTableSkeleton columnCount={5} compact={false} rowCount={10} zebra={false} />
      )}
     </div>
    </Tab>
    <Tab href="#" id="tab-2" label="Search results">
     <div className="some-content">Content for second tab goes here.</div>
    </Tab>
   </Tabs>
  </div>
 );
};
export default MultiSelectQuickPickGrid;
