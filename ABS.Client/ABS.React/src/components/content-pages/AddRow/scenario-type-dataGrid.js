import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
  TooltipIcon,
  RadioButton,
  TableToolbarContent,
  InlineLoading,
  Search
} from "carbon-components-react";
import {
  ChevronDown16,
  ChevronLeft16,
  ChevronRight16,
  ChevronUp16,
  Information20,
  Data_216,
} from "@carbon/icons-react";
import {DataMapping} from './Data/data-mapping';
import SingleSelectGroupDataGrid from "./../../shared/single-select/single-select-group-data-grid";
import { getHeaders } from "./../../shared/single-select/grid-headers/grid-header-service";
import { getMappedRow } from "./../../shared/single-select/single-select-data-mapper-service";
//single-select-group-data-grid
//grid-headers/grid-header-service
//single-select-data-mapper-service

const ScenarioTypeDataGrid = ({
  handleSelection,
  entity,
  department,
  ScenarioData,
  ScenarioTypeGroupedGridData,
  name,
  headerName
}) => {

  const [headersState, setHeadersState] = useState({ headers: [] });
  const [rowsState, setRowsState] = useState({ rows: [] });
  const [searchedRow , setSearchedRow] =  useState({ rows: [] });
  const [localState, setlocalState] = useState({ ScenarioData: ScenarioData , gridKey : 1 , showGrid : false });
  const [structuredData, setStructuredData] = useState({ rows: [] });
  const [loaderState , setLoaderState] = useState({ isLoaded: true });
  const [gridDataState, setGridDataState] = useState([]);
  let gridSearchTimeOut;
  useEffect(()=> {

    if(name)
    {
      setHeadersState({headers: DataMapping[name]?.header})
    }
  } , [name])
    
  useEffect(() => {
    setlocalState({ ...localState, ScenarioData: ScenarioData });
  }, [ScenarioData]);

  useEffect(() => {
    setlocalState({...localState , gridKey : localState.gridKey + 1});
    if (
      !entity || !department || !ScenarioTypeGroupedGridData.length 
    ) {
      setRowsState({ rows: [] });
      setGridDataState([])
      setlocalState({...localState , showGrid : false , gridKey : localState.gridKey + 1});
    } else {
      setLoaderState({isLoaded : false});
      setStructuredData({rows : ScenarioTypeGroupedGridData})
      setSearchedRow({rows : ScenarioTypeGroupedGridData})
      
      // TODO
      //processScenarioDataRows(ScenarioTypeGroupedGridData , false);
      
      setLoaderState({isLoaded : true});
      ScenarioTypeGroupedGridData.forEach(row => {
        getMappedRow(row, getHeaders(headerName)[0].key);
    });
    setGridDataState(ScenarioTypeGroupedGridData)
    setlocalState({...localState , showGrid : true , gridKey : localState.gridKey + 1});
    //   debugger
    //   let result = ScenarioTypeGroupedGridData.forEach(row => {
    //     getMappedRow(row, getHeaders("GLAccounts")[0].key);
    // })
    //   console.log("Helll"  ,result)

    // console.log("Helll2"  ,ScenarioTypeGroupedGridData)
    }
  }, [ScenarioTypeGroupedGridData, entity, department ]); // Re-render when entity or department is changed


//   useEffect(() => {
//       ScenarioTypeGroupedGridData.forEach(row => {
//             getMappedRow(row, getHeaders("GLAccounts")[0].key);
//         });
//     setGridDataState(ScenarioTypeGroupedGridData)
    
// }, [ScenarioTypeGroupedGridData])

  const processScenarioDataRows = (scenarioData , paginationApplied = false) => {
    let UpdatedScenarioData = paginationApplied ? scenarioData : scenarioData.slice(0, 20);
  
    UpdatedScenarioData = UpdatedScenarioData.map(
      (data, dataIndex) => {
        if(data.isGroup)
        {
          let childs = data[DataMapping[name].child].map((child) => {
              let result = localState?.ScenarioData?.find((item) => {
                return (
                  item.entityid === entity.entityID &&
                  item.departmentid === department.departmentID &&
                  (name != 'payTypeName' || item.jobcodeid === department.jobCodeID) &&
                  item[DataMapping[name].scenarioItemCompareId] === child[DataMapping[name].id]
                ); //return  glaccountid
              }); //result
              if(result)
              {
                child.isIncludeData = true
              }else
              {
                child.isIncludeData = false;
              }
              return child;
          }); // childs

          data[DataMapping[name].child] = [...childs];
          return  data;
        } // if
        else
        {
          let result = localState?.ScenarioData?.find((item) => {
            return (
              item.entityid === entity.entityID &&
              item.departmentid === department.departmentID &&
              (name != 'payTypeName' || item.jobcodeid === department.jobCodeID) &&
              item[DataMapping[name].scenarioItemCompareId] === data[DataMapping[name].id]
            );
          });
          if (result) {
            data.isIncludeData = true;
          } else {
            data.isIncludeData = false;
          }
          return data;
        }
      });
    setRowsState({ rows: UpdatedScenarioData });
  };

  const onHeaderIconClick = (e, headerIndex, detailIndex) => {
    e.preventDefault();
    if (
      headersState.headers[headerIndex].extraDetails.filter(
        (item) => item.isHidden === false
      ).length == 1 &&
      !headersState.headers[headerIndex].extraDetails[detailIndex].isHidden
    ) {
      return;
    }
    var stateCopy = { ...headersState };
    stateCopy.headers = stateCopy.headers.slice();
    stateCopy.headers[headerIndex] = { ...stateCopy.headers[headerIndex] };
    stateCopy.headers[headerIndex].extraDetails = stateCopy.headers[
      headerIndex
    ].extraDetails.slice();
    stateCopy.headers[headerIndex].extraDetails[detailIndex] = {
      ...stateCopy.headers[headerIndex].extraDetails[detailIndex],
    };
    stateCopy.headers[headerIndex].extraDetails[
      detailIndex
    ].isHidden = !stateCopy.headers[headerIndex].extraDetails[detailIndex]
      .isHidden;
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

  const DeSelectRow = (rowStates) => {
    const rows = [...rowStates];
    let UpdatedDataRows = rows.map((data, dataIndex) => {
      if(data.isGroup)
      {
        let groupChilds = data[DataMapping[name].child].map(
          (child, childIndex) => {
            child.isSelected = false;
            return child
          });
          data[DataMapping[name].child] = [...groupChilds];
          return data; 
      }
      data.isSelected = false;
      return data;
    });
    return UpdatedDataRows;
  }

  const handleRowSelection = (selectedRowIndexes) => {
    let UpdatedScenarioData = DeSelectRow([...rowsState.rows]);
    let row;
    if(selectedRowIndexes.length === 2)
    {
      row = { ...UpdatedScenarioData[selectedRowIndexes[0]][DataMapping[name].child][selectedRowIndexes[1]] };
      row.isSelected = true;
      UpdatedScenarioData[selectedRowIndexes[0]][DataMapping[name].child][selectedRowIndexes[1]] = row;
    }else
    {
      row = { ...UpdatedScenarioData[selectedRowIndexes[0]] };
      row.isSelected = true;
      UpdatedScenarioData[selectedRowIndexes[0]] = row;
    }
    setRowsState({ rows: UpdatedScenarioData });
    //setUnsortedRow({ rows: UpdatedstatisticsData });
    handleSelection(row, name);
  };

  const getCellContent = (header, headerIndex, row, indexArray) => {
    let cellContentList = [];

    let className = "statistics-statistics-cell";

    header.extraDetails.forEach((detail) => {
      if (!detail.isHidden) {
        cellContentList.push(row[name + detail.text]);
      }
    });
    return (
      <>
        <div className="bx--row">
          {!cellContentList.length || !row.isGroup ? (
            ""
          ) : row.isExpanded ? (
            <div className="bx--col-lg-1">
              <ChevronUp16
                onClick={(e) => toggleRows(e, indexArray)}
                className="statistics-table-cell-icon"
              />
            </div>
          ) : (
            <div className="bx--col-lg-1">
              <ChevronDown16
                onClick={(e) => toggleRows(e, indexArray)}
                className="statistics-table-cell-icon"
              />
            </div>
          )}

          {header.key !== "includeData" && !row.isGroup ? (
           <div className={`bx--col-lg-1 ${indexArray.length === 2 ?  "groupItemRadioButton" : "itemRadioButton"}`}>
            <RadioButton
                id={`rd_statistics_dataGrid-${indexArray.length === 2 ? indexArray[0]+"-"+indexArray[1] : indexArray[0]}`}
                onClick={(e) => handleRowSelection(indexArray)}
                checked={row.isSelected}
              />
            </div>
          ) : (
            ""
          )}

          {header.key === "includeData" && !row.isGroup && row.isIncludeData ? (
            <TooltipIcon
              className="statistics-table-icon-container"
              direction="top"
              align="end"
              tooltipText={`This entity-department-${name} row has data.`}
            >
              <Data_216 />
            </TooltipIcon>
          ) : (
            ""
          )}

          <div className="bx--col-lg">
            <div
              className={`${className} bx--text-truncate--end ${
                row.isGroup == true ? "isGroup-txt" : null
              }`}
            >
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
  };

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
      default:
        break;
    }
  };

  const paginationHandler = (e) => {
    setLoaderState({isLoaded : false});
    let UpdatedScenarioData = searchedRow.rows.slice(
      (e.page - 1) * e.pageSize,
      (e.page - 1) * e.pageSize + e.pageSize
    );
    UpdatedScenarioData = DeSelectRow([...UpdatedScenarioData]);
    processScenarioDataRows(UpdatedScenarioData , true);
    handleSelection(null , name)
    setLoaderState({isLoaded : true});
  };

  const sortByName = ( data , currentSorting) =>
  {
    if(currentSorting === "NONE")
    {
      // If current is NONE , then next will be the ASC
      data.sort(function (a , b) {
        let result = 0;
        if (a[DataMapping[name].name].toLowerCase() > b[DataMapping[name].name].toLowerCase()) {
          result = 1;
        } else {
          result = -1;
        }
        return result;
      });
    }else if(currentSorting === "ASC") {
      // If current is ASC , then next will be the DESC
      data.sort(function (a , b) {
        let result = 0;
        if (a[DataMapping[name].name].toLowerCase() < b[DataMapping[name].name].toLowerCase()) {
          result = 1;
        } else {
          result = -1;
        }
        return result;
      });
    }
    return [...data];
  }

  const extraRow = () => {
    const Rows = [];
    for (let i = 0; i < 20 - rowsState.rows.length; i++) {
      Rows.push(<TableRow>
        <TableCell></TableCell>
        <TableCell></TableCell>
      </TableRow>);
    }
    return Rows
  }

  const handleSorting = (e ,currentSorting , header) => {
    setLoaderState({isLoaded : false})
   e.preventDefault()
    // NONE > // ASC > // DESC
    if(header.header === DataMapping[name].header[0].header && rowsState.rows.length !== 0)
    {  
      let updatedStatisticsData = [...rowsState.rows]  
      if(currentSorting !== "DESC")
      {
        let Groups = rowsState.rows.filter((item) => {return item.isGroup === true});
        let Items = rowsState.rows.filter((item) => {return item.isGroup !== true});
    
        let sortGroups = Groups.map((group) => {        
          let sortItem  = sortByName(group[DataMapping[name].child] , currentSorting);
          group[DataMapping[name].child]= sortItem;
          return group;
          });//sortGroups
          sortGroups = sortByName(sortGroups ,currentSorting);
          let sortItems = sortByName(Items , currentSorting);          
          updatedStatisticsData = [...sortGroups , ...sortItems]
             
      }else
      {
        //updatedStatisticsData = [...unsortedRow.rows]
      }
      setRowsState({ rows: updatedStatisticsData });
      setLoaderState({isLoaded : true});
    }
  }

  const searchOnGridHandler = (e) => {
    if (gridSearchTimeOut) clearTimeout(gridSearchTimeOut);   
    let searchString = e.target.value;
    
    gridSearchTimeOut = setTimeout(() => {
    let SearchResults = [];
    let sourceData = [...structuredData.rows]
      if(searchString)
      {
        sourceData.forEach((item) => {      
          if(item.isGroup)
          {
            if(item[DataMapping[name].code].toLowerCase().includes(searchString.toLowerCase()) ||
            item[DataMapping[name].name].toLowerCase().includes(searchString.toLowerCase()))
            {
              SearchResults.push(item);
            }else
            {
              let matchChild = [];
              item[DataMapping[name].child].forEach((child) => {
                if (child[DataMapping[name].code].toLowerCase().includes(searchString.toLowerCase()) ||
                child[DataMapping[name].name].toLowerCase().includes(searchString.toLowerCase())) {
                 // Child found
                 matchChild.push(child);
                }
               });
               if (matchChild.length) {
                item[DataMapping[name].child] = [...matchChild];
                SearchResults.push(item);
               }
            }
          }else
          {
            if(item[DataMapping[name].code].toLowerCase().includes(searchString.toLowerCase()) ||
            item[DataMapping[name].name].toLowerCase().includes(searchString.toLowerCase()))
            {
              SearchResults.push(item);
            }
          }
        });
      }else
      {
        SearchResults = [...sourceData]
      }
      setSearchedRow({ rows: [...SearchResults] });
      setRowsState({ rows: [...SearchResults.slice(0, 20)]});
    },500);
  };

  return (
    <>
      <p>
      {headersState?.headers[0]?.header}
      </p>

            {gridDataState.length && localState.showGrid ? 
                <SingleSelectGroupDataGrid
                    key={localState.gridKey}
                    id={'scenario-Type-Data-Gird-id'}
                    headerData={getHeaders(headerName)}
                    rowData={gridDataState}
                    modalState={true}
                    name={headerName}
                    onSubmit={() => {}}
                    hideGroupsToggle={false}
                    hideGroups ={false}
                    onSelectionChange={(e) => { 
                     handleSelection(e.selectedItem, name);}
                    }
                    groupSelectable={false}
                    // onSelectionChange={(e) => { setGridSelectedItemState(props.data.find(r => r.id == e.selectedItem?.id)) }}
                    // onPageSizeChange={(e) => { 
                    //     if (props.onPageSizeChange) {
                    //         props.onPageSizeChange(e)
                    //     }                        
                    // }}
                    onPageSizeChange={(e) => {}}
                />
                : null }
      
      {/* 
       */}
    {/* <DataTable
      headers={headersState.headers}
      locale="en"
      isSortable={true}
      radio={true}
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
        OverflowMenuProps,
        onInputChange,
        handleOnInputValueChange,
        filterInputValue,
        actualPage,
        onClose,
        selectRow,
      }) => (
        <TableContainer title="">
          <TableToolbarContent style={{ justifyContent: "flex-end" }}>
          <Search className={"mapping-search"} placeHolderText="Search" onChange={searchOnGridHandler} />
          </TableToolbarContent>

          <Table size="compact" {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header, headerIndex) => (
                  <TableHeader
                  {...getHeaderProps({ header 
                  , onClick : (e) => handleSorting(e ,getHeaderProps({header}).sortDirection, header)
                  , isSortable : header.header === DataMapping[name].header[0].header ? true : false })}
                    className={`statistics-table-header ${
                      header.extraDetails
                        ? "statistics-table-textual-header"
                        : "text-right-align"
                    }`}
                  >
               
                      <>
                      {header.header}{" "}
                      {header.header === "Includes data" ? (
                        <TooltipIcon
                          className="statistics-table-icon-container"
                          direction="bottom"
                          align="end"
                          tooltipText={
                            "Selected row has data you can retain or overwrite in Values to enter (optional)."
                          }
                        >
                          <Information20 />
                        </TooltipIcon>
                      ) : null}
                      <br/>
                      </>

                    {header.extraDetails &&
                      header.extraDetails.map((detail, detailIndex) => {
                        return (
                          <>
                            {detail.isHidden ? (
                              <TooltipIcon
                                className="statistics-table-icon-container"
                                direction="bottom"
                                align="start"
                                tooltipText={detail.showTooltipText}
                              >
                                <ChevronRight16
                                  className="statistics-table-icon"
                                  onClick={(e) =>
                                    onHeaderIconClick(
                                      e,
                                      headerIndex,
                                      detailIndex
                                    )
                                  }
                                />
                              </TooltipIcon>
                            ) : (
                              <>
                                <TooltipIcon
                                  className="statistics-table-icon-container"
                                  direction="bottom"
                                  align="start"
                                  tooltipText={detail.hideTooltipText}
                                >
                                  <ChevronLeft16
                                    className="statistics-table-icon"
                                    onClick={(e) =>
                                      onHeaderIconClick(
                                        e,
                                        headerIndex,
                                        detailIndex
                                      )
                                    }
                                  />
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
            {loaderState.isLoaded ?    
            <> { rowsState.rows.map((firstLevelRow, firstLevelRowIndex) => (
              <>
                <TableRow onClick={(e) => firstLevelRow.isGroup ? toggleRows(e, [firstLevelRowIndex]) : handleRowSelection([firstLevelRowIndex])}>
                  {headers.map((header, headerIndex) => (
                    <TableCell
                      className={`${
                        firstLevelRow.childRows?.length ? "bold" : ""
                      } ${header.extraDetails ? "" : "text-right-align"}`}
                    >
                      {getCellContent(header, headerIndex, firstLevelRow, [
                        firstLevelRowIndex,
                      ])}
                    </TableCell>
                  ))}
                </TableRow>

                
                  {firstLevelRow.isGroup && firstLevelRow.isExpanded 
                    && firstLevelRow[DataMapping[name].child].map((secondLevelRow, secondLevelRowIndex) => (
                   <>
                   <TableRow onClick={(e) => handleRowSelection([firstLevelRowIndex, secondLevelRowIndex])}>
                   {headers.map((header, headerIndex) => (
                     <TableCell
                       className={`${
                         firstLevelRow.childRows?.length ? "bold" : ""
                       } ${header.extraDetails ? "" : "text-right-align"}`}
                     >
                       {getCellContent(header, headerIndex, secondLevelRow, [firstLevelRowIndex, secondLevelRowIndex])}

                     </TableCell>
                   ))}
                 </TableRow>
              </>   
               )) 
               }
                
              </>
              ))} {rowsState.rows.length ? extraRow() : ''} </>
              : <InlineLoading description="Loading..." />
            }
            </TableBody>
          </Table>
          {rowsState.rows.length ? (
            <Pagination
              id="paginationBar"
              pageSizes={[20, 30, 40, 50, 100]}
              totalItems={searchedRow.rows.length}
              onChange={(e) => paginationHandler(e)}
              className="bx--pagination entity-department-statistics-grid-pagination"
            />
          ) : null}
        </TableContainer>
      )}
      rows={rowsState.rows}
    />*/}
    </> 
  );
};

export default ScenarioTypeDataGrid;
