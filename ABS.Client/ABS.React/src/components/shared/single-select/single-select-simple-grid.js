import React, { useState, useEffect, useLayoutEffect } from "react";
import { DataTable, Dropdown, Checkbox, TableContainer, Table, TableHead, TableRow, TableBody, TableHeader, TableCell, Pagination, TableToolbar, TableSelectRow, Search, RadioButton } from "carbon-components-react";
import { useDispatch, useSelector } from "react-redux";

const SingleSelectSimpleGrid = ({ headerData, rowData, onSelectionChange, initialSelectedValue, name, onSubmit, modalState, onPageSizeChange, isMultiselect }) => {
 const [rowsState, setRowsState] = useState([]);
 const [tableSortState, setTableSortState] = useState({});
 const [searchStringState, setSearchStringState] = useState("");
 const [paginationState, setPaginationState] = useState({ page: 1, pageSize: 10 });
 const [totalCount, setTotalCount] = useState(0);
 const [selectAllChecked, setSelectAllChecked] = useState(false);
 const [localGridSelectionState, setLocalGridSelectionState] = useState([]);
 const [filterdRowState, setFilterdRowState] = useState([]);
 const budgetVersionTypeData = useSelector((state) => state.MasterData.BudgetVersionsType);
 const allBudgetTypes = {
  itemTypeID: "",
  itemDataType: "string",
  itemDisplayName: "All budget version types",
  itemTypeValue: "All budget version types",
 };
 const allBudgetVersionTypeData = budgetVersionTypeData.concat(allBudgetTypes);
 const [xselectedBudgetVersionType, setSelectedBudgetVersionType] = useState(allBudgetVersionTypeData[2]);

 const handleCombo = (e) => {
  setSelectedBudgetVersionType(e.selectedItem);
 };

 useEffect(() => {
  getPageData();
 }, [searchStringState, paginationState, tableSortState, modalState, xselectedBudgetVersionType]);

 const handlePagination = (e) => {
  setPaginationState(e);
  if (onPageSizeChange) {
   onPageSizeChange(e);
  }
 };

 useEffect(() => {
  if (!modalState && document.getElementsByName("row").length) document.getElementsByName("row").forEach((row) => (row.checked = false));
 }, [modalState]);

 const getPageData = () => {
  let filteredRows = filterBySort(filterBySearch([...rowData]));
  if (isMultiselect) {
   // in case of multiselect , filter bv by its type
   filteredRows = filterByBudgetVersionType(filteredRows);
  }
  setFilterdRowState(filteredRows);
  setTotalCount(filteredRows.length);
  const startingIndex = (paginationState.page - 1) * paginationState.pageSize;
  setRowsState(filteredRows.slice(startingIndex, startingIndex + paginationState.pageSize));
 };

 const filterByBudgetVersionType = (rows) => {
  if (xselectedBudgetVersionType === undefined) {
   return rows;
  }
  if (xselectedBudgetVersionType?.itemTypeID !== "") {
   return rows.filter((row) => {
    return row.budgetVersionTypeID === xselectedBudgetVersionType?.itemTypeValue;
   });
  } else {
   return rows;
  }
 };

 const onInputChange = (e) => {
  setSearchStringState(e.target.value);
 };

 const filterBySearch = (rows) => {
  if (!searchStringState) return rows;
  return rows.filter((obj) => Object.values(obj).some((val) => (val ? val.toString().toLowerCase().includes(searchStringState.toLowerCase()) : false)));
 };

 const filterBySort = (rows) => {
  if (!Object.keys(tableSortState).length) return rows;

  if (tableSortState.sortOrder == "ASC") return rows.sort((a, b) => (a[tableSortState.sortColumn] > b[tableSortState.sortColumn] ? 1 : a[tableSortState.sortColumn] < b[tableSortState.sortColumn] ? -1 : 0));

  if (tableSortState.sortOrder == "DESC") return rows.sort((a, b) => (a[tableSortState.sortColumn] < b[tableSortState.sortColumn] ? 1 : a[tableSortState.sortColumn] > b[tableSortState.sortColumn] ? -1 : 0));
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

 const selectRow = (e, row) => {
  const radioButton = e.target.parentElement.querySelector("input");
  if (radioButton) {
   if (isMultiselect) {
    // In case Grid support Multiselect
    radioButton.checked = !radioButton.checked;

    if (radioButton.checked) {
     setLocalGridSelectionState([...localGridSelectionState, { id: row.budgetVersionsID, name: row.code }]);
     onSelectionChange([...localGridSelectionState, { id: row.budgetVersionsID, name: row.code }]);
    } else {
     let indexFound = localGridSelectionState.findIndex((item) => item.id === row.budgetVersionsID);
     if (indexFound !== -1) {
      localGridSelectionState.splice(indexFound, 1);
     }
     setLocalGridSelectionState([...localGridSelectionState]);
     onSelectionChange([...localGridSelectionState]);
    }
   } else {
    // In case grid support Radio button / Single Select
    radioButton.checked = true;
    onSelectionChange({ selectedItem: row });
   }
  }
 };

 const handleDoubleClick = (e, row) => {
  if (!isMultiselect) {
   selectRow(e, row);
   onSubmit({ selectedItem: row });
  } else {
   setLocalGridSelectionState([...localGridSelectionState, { id: row.budgetVersionsID, name: row.code }]);
   onSelectionChange([...localGridSelectionState, { id: row.budgetVersionsID, name: row.code }]);
   onSubmit([{ id: row.budgetVersionsID, name: row.code }]);
  }
 };

 const handleSelectAll = (checked) => {
  let rows = filterdRowState;
  let updatedRows = [];
  if (checked) {
   updatedRows = rows.map((row) => {
    return { id: row.budgetVersionsID, name: row.code };
   });
   setLocalGridSelectionState([...updatedRows]);
   onSelectionChange([...updatedRows]);
  } else {
   setLocalGridSelectionState([]);
   onSelectionChange([]);
  }
  setSelectAllChecked(checked);
 };

 return (
  <DataTable
   isSortable={false}
   headers={headerData}
   rows={[]}
   paginationHandler={handlePagination}
   radio
   render={({ rows, headers, getHeaderProps }) => {
    return (
     <TableContainer className="single-select-table-container">
      <TableToolbar>
       <Search onChange={onInputChange} placeHolderText="Search" labelText={"Search"} />
       {isMultiselect ? (
        <div style={{ width: 220 }}>
         <Dropdown
          id="multi-select-bv-grid-type-filter-dropdown"
          className="grid-filter-dropdown"
          placeholder="All budget version types"
          label="All budget version types "
          light={false}
          items={allBudgetVersionTypeData}
          itemToString={(item) => (item ? item.itemTypeValue : "")}
          value={(item) => (item ? item.itemTypeID : "")}
          onChange={(e) => {
           handleCombo(e);
          }}
         />
        </div>
       ) : null}
      </TableToolbar>
      <div className="single-select-table-wrapper">
       <Table className="single-select-table">
        <TableHead>
         <TableRow className="single-select-table-header-row">
          {isMultiselect ? (
            <>
           {/* <div onClick={() => handleSelectAll(!selectAllChecked)}> */} {/*comment out due to warning*/} 
            <TableHeader key={"selectAllHeader"} {...getHeaderProps({ header: { key: "selectAllHeader" }, onClick: () => handleSelectAll(rows, !selectAllChecked) })}>
             <label htmlFor={"checkbox-btn-selectAllHeader"}>{""}</label>
             <Checkbox label={"checkbox-btn-selectAllHeader"}  id={"checkbox-btn-selectAllHeader"} key={"checkbox-btn-selectAllHeader"} labelText="" style={{ paddingLeft: "10px" }} onClick={(e) => handleSelectAll(e.target.checked)} checked={selectAllChecked} />
            </TableHeader>
           {/* </div> */}
           </>
          ) : (
           <TableHeader />
          )}
          {headers.map((header) => (
           <TableHeader style={{ paddingLeft: "10px" }} key={header.key} {...getHeaderProps({ header, onClick: () => onHeaderClick(header.key) })}>
            {header.header}
           </TableHeader>
          ))}
         </TableRow>
        </TableHead>
        <TableBody>
         {rowsState.map((row) => (
          <TableRow key={row.budgetVersionsID} id={row.budgetVersionsID} onDoubleClick={(e) => handleDoubleClick(e, row)} className="single-select-table-body-row">
           <TableCell onClick={(e) => selectRow(e, row)}>
            {isMultiselect ? (
             <Checkbox
              id={"checkbox-btn" + row.budgetVersionsID}
              key={"checkbox-btn" + row.budgetVersionsID}
              labelText=""
              checked={localGridSelectionState.find((item) => {
               return item.id === row.budgetVersionsID;
              })}
              onClick={()=> {}}
             ></Checkbox>
            ) : (
             <RadioButton className="single-select-radio" name="row"></RadioButton>
            )}
           </TableCell>
           {headers.map((header) => (
            <TableCell key={header.key + "-" + row.budgetVersionsID + "-"}>{header.key === "userProfile" ? (row[header.key] ? row[header.key] : "1") : row[header.key]} </TableCell>
           ))}
          </TableRow>
         ))}
        </TableBody>
       </Table>
      </div>
      <Pagination id="single-select-grid-pagination" pageSize={paginationState.pageSize} pageSizes={[5, 10, 15, 20, 50, 100]} totalItems={totalCount} onChange={handlePagination} />
     </TableContainer>
    );
   }}
  />
 );
};

export default SingleSelectSimpleGrid;
