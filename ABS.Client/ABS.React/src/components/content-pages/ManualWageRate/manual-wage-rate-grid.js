import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { DataTable, NumberInput, TableContainer, Table, TableHead, TableRow, TableBody, TableHeader, TableCell, Pagination, TooltipIcon, TableToolbarContent, ComboBox, Accordion, AccordionItem, Tag, Search, Button } from "carbon-components-react";
import { ChevronDown16, ChevronLeft16, ChevronRight16, ChevronUp16 } from "@carbon/icons-react";
import { manualWageRateHeaders } from "./Data/manual-wage-rate-grid-header";
import { formatValue, formatNumber, parseNumber } from '../../../services/format-service';
import { useSelector } from 'react-redux';

const ManualWageRateGrid = forwardRef(({ match, dataRow, buttonDisabledHandler, refreshData }, ref) => {
 const [headersState, setHeadersState] = useState({ headers: manualWageRateHeaders });
 const [rowsState, setRowsState] = useState({ rows: [] });
 const [searchedRowState, setsearchedRowState] = useState({ rows: [] });
 const [paginationStates, setPaginationStates] = useState({ pageSize: 10, pageNumber: 1 });
 const [ChangedRowsState, setChangedRowsState] = useState({ changedRows: [] });

 let gridSearchTimeOut;

 const style = {
  //  paddingRight : '0px',
  //  paddingLeft : '0px'
 }

 useEffect(() => {
  setRowsState({ rows: [...dataRow].slice(0, 10) });
  setPaginationStates({ pageSize: 10, pageNumber: 1 });
  setsearchedRowState({ rows: [...dataRow] });
 }, [refreshData]);

 const toggleRows = (e, indexArray) => {
  e.preventDefault();
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
    const firstLevelRows = [...rowsState.rows];
    const firstLevelRow = { ...firstLevelRows[indexArray[0]] };
    const secondLevelRows = [...firstLevelRow.groupDepartments];
    const secondLevelRow = { ...secondLevelRows[indexArray[1]] };
    secondLevelRow.isExpanded = !secondLevelRow.isExpanded;
    secondLevelRows[indexArray[1]] = secondLevelRow;
    firstLevelRow.groupDepartments = secondLevelRows;
    firstLevelRows[indexArray[0]] = firstLevelRow;
    setRowsState({ rows: firstLevelRows });
    break;
   default:
    break;
  }
 };

 const onHeaderIconClick = (e, headerIndex, detailIndex) => {
  e.preventDefault();
  if (headersState.headers[headerIndex].extraDetails.filter((item) => item.isHidden === false).length == 1 && !headersState.headers[headerIndex].extraDetails[detailIndex].isHidden) {
   return;
  }
  var stateCopy = { ...headersState };
  stateCopy.headers = stateCopy.headers.slice();
  stateCopy.headers[headerIndex] = { ...stateCopy.headers[headerIndex] };
  stateCopy.headers[headerIndex].extraDetails = stateCopy.headers[headerIndex].extraDetails.slice();
  stateCopy.headers[headerIndex].extraDetails[detailIndex] = {
   ...stateCopy.headers[headerIndex].extraDetails[detailIndex],
  };
  stateCopy.headers[headerIndex].extraDetails[detailIndex].isHidden = !stateCopy.headers[headerIndex].extraDetails[detailIndex].isHidden;
  setHeadersState(stateCopy);
 };

 const cellIsOverflown = (span, innerText, isStatsCell) => {
  if (span.scrollWidth > span.clientWidth) {
   return true;
  } else if (isStatsCell && innerText.length > 6) {
   return true;
  }
  return false;
 };

 const handleChange = (value, indexArray) => {
  let updatedValue = value;
  if (isNaN(updatedValue)) {
   updatedValue = 0;
  }
  let rowData = [...rowsState.rows];
  let updatedRow = rowData[indexArray[0]];
  updatedRow["wagerateoverride"] = updatedValue;
  rowData[indexArray[0]] = JSON.parse(JSON.stringify(updatedRow));
  setRowsState({ rows: [...rowData] });
  // save changed rows to send data at backend.
  setChangedRows(updatedRow);
  buttonDisabledHandler(false);
 };

 const setChangedRows = (updatedRow) => {
  let updatedChangedRows = [...ChangedRowsState.changedRows];
  let rowIndex = updatedChangedRows.findIndex((item) => item.dataid === updatedRow.dataid);
  if (rowIndex !== -1) {
   updatedChangedRows[rowIndex] = updatedRow;
  } else {
   updatedChangedRows.push(updatedRow);
  }
  setChangedRowsState({ ...ChangedRowsState, changedRows: [...updatedChangedRows] });
 };

 const getCellContent = (header, headerIndex, row, indexArray) => {
  let cellContentList = [];
  let className = "mapping-department-cell";
  if (header.key === "entity" || header.key === "department" || header.key === "jobcode" || header.key === "paytype") {
   header.extraDetails.forEach((detail) => {
    if (!detail.isHidden) {
     cellContentList.push(row[header.key + detail.key]);
    }
   });
   return (
    <>
     <div className="bx--row">
      {!cellContentList.length || (!row.isGroup && !row.isHierarchy) ? (
       ""
      ) : row.isExpanded ? (
       <div className={`bx--col-lg-1 ${indexArray.length === 2 && row.isGroup ? "hierarchyGroupChevron" : null}`}>
        <ChevronUp16 onClick={(e) => toggleRows(e, indexArray)} className="statistics-table-cell-icon" />
       </div>
      ) : (
       <div className={`bx--col-lg-1 ${indexArray.length === 2 && row.isGroup ? "hierarchyGroupChevron" : null}`}>
        <ChevronDown16 onClick={(e) => toggleRows(e, indexArray)} className="statistics-table-cell-icon" />
       </div>
      )}
      <div className="bx--col-lg-2">
       <div className={`${className} bx--text-truncate--end ${row.isGroup || row.isHierarchy ? "isGroup-txt" : indexArray.length === 3 || indexArray.length === 2 ? "child-text-cell" : null}`}>
        <span
         onMouseOver={(e) => {
          // are we in an overflow state?
          // if not, erase the title so that the tooltip does not show
          if (!cellIsOverflown(e.target)) {
           e.target.title = "";
          }
         }}
         title={cellContentList.join(" ")}
        >
         {cellContentList.join(" ")}
        </span>
       </div>
      </div>
     </div>
    </>
   );
  } else if (header.key === "hoursSum") {
   return (
    <>
     <span style={{ textAlign: "right", paddingRight: "0px" }}>{formatCellValue((row["january"] + row["february"] + row["march"] + row["april"] + row["may"] + row["june"] + row["july"] + row["august"] + row["september"] + row["october"] + row["november"] + row["december"])?.toFixed(2) , "number")}</span>
    </>
   );
  } else if (header.key === "rowtotal") {
   return (
    <>
     {" "}
     <span style={{ textAlign: "right", paddingRight: "0px" }}>{formatCellValue(  row["rowtotal"] ? row["rowtotal"].toFixed(2) : 0 , "number")}</span>
    </>
   );
  } else if (header.key === "wagerateoverride") {
   return (
    <>
     <NumberInput id={"wageRate-" + row["dataid"] + "-" + indexArray[0]} key={"wageRate-" + row["dataid"] + "-" + indexArray[0]} className={"percent-change-textbox wage-rate-override"} invalidText="Number is not valid" max={90000} min={-90000} step={1} value={row["wagerateoverride"]} onChange={(e) => handleChange(e.imaginaryTarget.value, indexArray)} />
    </>
   );
  } else if (header.key === "preRaiseDollers") {
   return (
    <>
     {" "}
     <span style={{ textAlign: "right", paddingRight: "0px" }}>{formatCellValue((row["wagerateoverride"] * (row["january"] + row["february"] + row["march"] + row["april"] + row["may"] + row["june"] + row["july"] + row["august"] + row["september"] + row["october"] + row["november"] + row["december"]))?.toFixed(2) , "number")}</span>
    </>
   );
  }
 };

 const handleGridSearch = (textInput) => {
  if (gridSearchTimeOut) clearTimeout(gridSearchTimeOut);
  let searchString = textInput;
  let data = [...dataRow];
  let SearchResults;
  gridSearchTimeOut = setTimeout(() => {
   if (searchString) {
    SearchResults = data.filter((item) => {
     return (
      item.entitycode.toLowerCase().includes(searchString.toLowerCase()) ||
      item.entityname.toLowerCase().includes(searchString.toLowerCase()) ||
      item.departmentcode.toLowerCase().includes(searchString.toLowerCase()) ||
      item.departmentname.toLowerCase().includes(searchString.toLowerCase()) ||
      item.jobcodename.toLowerCase().includes(searchString.toLowerCase()) ||
      item.paytypecode.toLowerCase().includes(searchString.toLowerCase()) ||
      item.paytypename.toLowerCase().includes(searchString.toLowerCase())
     );
    });
   } else {
    SearchResults = [...data];
   }
   setRowsState({ rows: [...SearchResults].slice(0, 10) });
   setsearchedRowState({ rows: [...SearchResults] });
  }, 500);
 };

 const paginationHandler = (e) => {
  let updatedRows = searchedRowState.rows.slice((e.page - 1) * e.pageSize, (e.page - 1) * e.pageSize + e.pageSize);
  setPaginationStates({ pageSize: e.pageSize, pageNumber: e.page });
  setRowsState({ ...rowsState, rows: [...updatedRows] });
 };

 useImperativeHandle(
  ref,
  () => ({
   getChangedRows() {
    return ChangedRowsState.changedRows;
   },
  }),
  [ChangedRowsState]
 );
 const formatParameters = useSelector(state => {

  const decimalFormats = state.MasterData.ItemDecimalPlaces || [];
  let decimalSetting = "itemDecimalPlaces-2";
  
  const groupingFormat = state.systemSettings.xc_Commas?.toLowerCase() === 'true' ?? false;

  // Get the format string, and strip off the first token to obtain the number of decimals
  const fractionDigits = decimalFormats.find(({ itemTypeCode }) => itemTypeCode === decimalSetting)?.itemTypeValue ?? 2;

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

  return {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
      useGrouping: groupingFormat,
      negativeCellValueClass: negativeCellValueClass,
      // style: type === 'genralLedger' && state.systemSettings.xc_Currency === 'True' ? 'currency' : 'decimal',
      style: 'decimal',
      currencySign: signType,
      currency: 'USD'
  }
});

 const formatCellValue = (value, formatType) => {

  // format the cell value according to the supplied format parameters
  const formattedValue = formatValue(value, formatType, 'en-US', formatParameters);

  // get display class
  const cellValueClass = parseNumber(value) < 0 ? formatParameters.negativeCellValueClass : 'statistics-table-cell-black-value';

  return <span className={cellValueClass}>{formattedValue}</span>;
}

 return (
  <>
   {headersState?.headers ? (
    <DataTable
     headers={headersState.headers}
     locale="en"
     isSortable={false}
     radio={true}
     pagination={true}
     render={({ headers, getHeaderProps, getTableProps }) => (
      <TableContainer title="">
       <TableToolbarContent style={{ justifyContent: "flex-end" }} className={"mapping-grid-toolbar"}>
        <Search className={"mapping-search"} placeHolderText="Search" onChange={(e) => handleGridSearch(e.target.value)} />
       </TableToolbarContent>
       <Table size="compact" {...getTableProps()} className={"mapping-table"}>
        <TableHead>
         <TableRow>
          {headers.map((header, headerIndex) => (
           <TableHeader style={{textAlign:"Right"}} {...getHeaderProps({ header })} className={`statistics-table-header ${header.extraDetails ? "statistics-table-textual-header" : "statistics-combobox-header"}`}>
            <>{header.header}</>
            <br />

            {header.extraDetails &&
             header.extraDetails.map((detail, detailIndex) => {
              return (
               <>
                {detail.isHidden ? (
                 <TooltipIcon className="statistics-table-icon-container" direction="bottom" align="start" tooltipText={detail.showTooltipText}>
                  <ChevronRight16 className="statistics-table-icon" onClick={(e) => onHeaderIconClick(e, headerIndex, detailIndex)} />
                 </TooltipIcon>
                ) : (
                 <>
                  <TooltipIcon className="statistics-table-icon-container" direction="bottom" align="start" tooltipText={detail.hideTooltipText}>
                   <ChevronLeft16 className="statistics-table-icon" onClick={(e) => onHeaderIconClick(e, headerIndex, detailIndex)} />
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
        <TableBody>
         {rowsState.rows.map((firstLevelRow, firstLevelRowIndex) => (
          <>
           <TableRow onClick={(e) => (firstLevelRow.isHierarchy || firstLevelRow.isGroup ? toggleRows(e, [firstLevelRowIndex]) : null)}>
            {headers.map((header, headerIndex) => (
             <TableCell style={header.key === "wagerateoverride" ? style : {}} className={`${firstLevelRow.childRows?.length ? "bold" : ""} ${header.extraDetails ? "" : "text-right-align"}`}>{getCellContent(header, headerIndex, firstLevelRow, [firstLevelRowIndex])}</TableCell>
            ))}
           </TableRow>
          </>
         ))}
        </TableBody>
       </Table>
       <Pagination id="paginationBar" pageSizes={[10, 20, 30, 40, 50, 100]} totalItems={searchedRowState.rows.length} onChange={(e) => paginationHandler(e)} page={paginationStates.pageNumber} pageSize={paginationStates.pageSize} />
      </TableContainer>
     )}
     rows={[]}
    />
   ) : null}
  </>
 );
});

export default ManualWageRateGrid;
