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
} from "@carbon/icons-react";
import {getDepartmentHierarchyGroupedData} from '../../../helpers/DataTransform/transformData'
import SingleSelectGroupDataGrid from "./../../shared/single-select/single-select-group-data-grid";
import { getHeaders } from "./../../shared/single-select/grid-headers/grid-header-service";
import { getMappedRow } from "./../../shared/single-select/single-select-data-mapper-service";
import { getApiResponseAsync } from "../../../services/api/apiCallerGet";

const DepartmentDataGrid = ({ handleSelection }) => {
  const headers = [
    {
      header: "Department",
      key: "department",
      extraDetails: [
        {
          key: "code",
          text: "Code",
          isHidden: false,
          showTooltipText: "Show Codes",
          hideTooltipText: "Hide Codes",
        },
        {
          key: "name",
          text: "Name",
          isHidden: false,
          showTooltipText: "Show Names",
          hideTooltipText: "Hide Names",
        },
      ],
    },
  ];

  const [headersState, setHeadersState] = useState({ headers });
  const [rowsState, setRowsState] = useState({ rows: [] });
  const departmentData = useSelector((state) => state.MasterData.Departments); // global Store States
  const [searchedRow , setSearchedRow] =  useState({ rows: [] });
  const [structuredData, setStructuredData] = useState({ rows: [] });
  const [loaderState , setLoaderState] = useState({ isLoaded: false });
  const [gridDataState, setGridDataState] = useState([]);
  const [localState, setlocalState] = useState({ gridKey : 1 });
  let gridSearchTimeOut;
  useEffect(() => {


    if(departmentData.length)
    {
    let UpdateddepartmentData = departmentData.map(
      (department, departmentIndex) => {
        department.isSelected = false;
        return department;
      }
    );

    getApiResponseAsync("DEPARTMENTSRELATIONSHIPS").then((departmentrelationData) => {
        getDepartmentHierarchyGroupedData(departmentData, departmentrelationData).then((response)=>{
            let UpdatedData = [...response];
            UpdatedData.forEach(row => {
              getMappedRow(row, getHeaders('Department')[0].key);
            });
            setGridDataState(UpdatedData);
            setStructuredData({rows : UpdateddepartmentData})
            setSearchedRow({rows : UpdateddepartmentData})
            UpdateddepartmentData = UpdateddepartmentData.slice(0, 20);
            setRowsState({ rows: UpdateddepartmentData });
            setLoaderState({isLoaded : true});      
          });
      });
    }
  }, [departmentData]);

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
    let UpdatedDepartmentRows = rows.map((department, entityIndex) => {

      if(department.isHierarchy)
      {
        let groupDepartments = department.groupDepartments.map((group)=>{
            let groupChilds = group.childDepartments?.map((department)=>{

              department.isSelected = false;
              return department;
            }); // groupChilds
            if(groupChilds)
            {
              group.childDepartments = [...groupChilds];
            }
            return group;
        }); //HierarchiesGroups
        department.groupDepartments = [...groupDepartments];
        return department;
      }else if (department.isGroup)
      {
        let groupChilds = department.childDepartments?.map((department)=>{

          department.isSelected = false;
          return department;
        }); // groupChilds
        if(groupChilds)
        {
          department.childDepartments = [...groupChilds];
        }
        return department;
      }else
      {
        department.isSelected = false;
        return department;
      }
     });
     return UpdatedDepartmentRows;
  }

  const handleRowSelection = (selectedRowIndexes) => {
    let UpdateddepartmentData = DeSelectRow([...rowsState.rows]);
    let row;
    if(selectedRowIndexes.length === 3)
    {
      row = { ...UpdateddepartmentData[selectedRowIndexes[0]].groupDepartments[selectedRowIndexes[1]].childDepartments[selectedRowIndexes[2]] };
      row.isSelected = true;
      UpdateddepartmentData[selectedRowIndexes[0]].groupDepartments[selectedRowIndexes[1]].childDepartments[selectedRowIndexes[2]] = row;
    }else if (selectedRowIndexes.length === 2)
    {
      row = { ...UpdateddepartmentData[selectedRowIndexes[0]].childDepartments[selectedRowIndexes[1]] };
      row.isSelected = true;
      UpdateddepartmentData[selectedRowIndexes[0]].childDepartments[selectedRowIndexes[1]] = row;
      
    }else
    {
      row = { ...UpdateddepartmentData[selectedRowIndexes[0]] };
      row.isSelected = true;
      UpdateddepartmentData[selectedRowIndexes[0]] = row;
    }

    setRowsState({ rows: UpdateddepartmentData });
    //setUnsortedRow({ rows: UpdateddepartmentData });
    handleSelection(row, "department");
  };

  const extraRow = () => {
    const Rows = [];
    for (let i = 0; i < 20 - rowsState.rows.length; i++) {
      Rows.push(<TableRow>
        <TableCell></TableCell>
      </TableRow>);
    }
    return Rows
  }

  const getCellContent = (header, headerIndex, row, indexArray) => {
    let cellContentList = [];

    let className = "statistics-department-cell";

    header.extraDetails.forEach((detail) => {
      if (!detail.isHidden) {
        cellContentList.push(row["department" + detail.text]);
      }
    });
    return (
      <>
        <div className="bx--row">
          {
            !cellContentList.length || (!row.isGroup  && !row.isHierarchy) ? (
              ""
            ) : row.isExpanded ? (
              <div className={`bx--col-lg-1 ${(indexArray.length === 2 && row.isGroup) ? "hierarchyGroupChevron" : null }`}>
                <ChevronUp16 
                  onClick={(e) => toggleRows(e, indexArray)}
                  className="statistics-table-cell-icon"
                />
              </div>
            ) : (
              <div className={`bx--col-lg-1 ${(indexArray.length === 2 && row.isGroup) ? "hierarchyGroupChevron" : null }`}>
                <ChevronDown16
                  onClick={(e) => toggleRows(e, indexArray)}
                  className="statistics-table-cell-icon"
                />
              </div>
            )
          }

          {!row.isGroup  && !row.isHierarchy ? (
            <div className={`bx--col-lg-1 ${indexArray.length === 3 ?  "hierarchygroupItemRadioButton" : indexArray.length === 2 ? "groupItemRadioButton" : "itemRadioButton"}`}>
              <RadioButton
                id={`rd_department_dataGrid-${indexArray.length === 3 ? indexArray[0]+"-"+indexArray[1]+"-"+indexArray[2] : indexArray.length === 2 ? indexArray[0]+"-"+indexArray[1] : indexArray[0]}`}
                onClick={(e) => handleRowSelection(indexArray)}
                checked={row.isSelected}
              />
            </div>
          ) : (
            ""
          )}

          <div className="bx--col-lg">
            <div
              className={`${className} bx--text-truncate--end ${
                row.isGroup || row.isHierarchy  ? "isGroup-txt" : null
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
        case 2:
        // preventing state mutation
        const firstLevelRows = [...rowsState.rows];
        const firstLevelRow = { ...firstLevelRows[indexArray[0]] };
        const secondLevelRows = [...firstLevelRow.groupDepartments]
        const secondLevelRow = { ...secondLevelRows[indexArray[1]] }
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

  const paginationHandler = (e) => {
    setLoaderState({isLoaded : false});
    let updateddepartmentData = searchedRow.rows.slice(
      (e.page - 1) * e.pageSize,
      (e.page - 1) * e.pageSize + e.pageSize
    );
    
    updateddepartmentData = DeSelectRow([...updateddepartmentData]);
  
    setRowsState({ rows: updateddepartmentData });
    handleSelection(null , 'department')
    setLoaderState({isLoaded : true});
  };

  const sortByName = ( data , currentSorting) =>
  {
    if(currentSorting === "NONE")
    {
      // If current is NONE , then next will be the ASC
      data.sort(function (dept1 , dept2) {
        let result = 0;
        if (dept1.departmentName.toLowerCase() > dept2.departmentName.toLowerCase()) {
          result = 1;
        } else {
          result = -1;
        }
        return result;
      });
    }else if(currentSorting === "ASC") {
      // If current is ASC , then next will be the DESC
      data.sort(function (dept1 , dept2) {
        let result = 0;
        if (dept1.departmentName.toLowerCase() < dept2.departmentName.toLowerCase()) {
          result = 1;
        } else {
          result = -1;
        }
        return result;
      });
    }
    return [...data];
  }

  const handleSorting = ( e ,currentSorting) => {
    setLoaderState({isLoaded : false})
    e.preventDefault()
    // NONE > //ASC > //DESC   
    let updatedentityData = [...rowsState.rows]
    if(currentSorting !== "DESC")
    { 
    let Hierarchies = rowsState.rows.filter((item) => {return item.isHierarchy === true});
    let Groups = rowsState.rows.filter((item) => {return item.isGroup === true});
    let Items = rowsState.rows.filter((item) => {return item.isGroup !== true && item.isHierarchy !== true});

      let sortHierarchies = Hierarchies.map((hierarchy) => {
          let sortGroups = hierarchy.groupDepartments.map((group) => {
            let sortItem  = sortByName(group.childDepartments , currentSorting);
            group.childDepartments = sortItem;
            return group;
          }); // sortGroup
          sortGroups = sortByName(sortGroups , currentSorting);
          hierarchy.groupDepartments = sortGroups;
          return hierarchy;
      }); //sortHierarchies
      sortHierarchies = sortByName(sortHierarchies ,currentSorting );
      
      let sortGroups = Groups.map((group) => {        
          let sortItem  = sortByName(group.childDepartments , currentSorting);
          group.childDepartments = sortItem;
          return group;
      });//sortGroups
      sortGroups = sortByName(sortGroups ,currentSorting);

      let sortItems = sortByName(Items , currentSorting);
      
      updatedentityData = [...sortHierarchies , ...sortGroups , ...sortItems]
    }else
    {
      //updatedentityData = [...unsortedRow.rows]
    }
      setRowsState({ rows: updatedentityData });
      setLoaderState({isLoaded : true});
  }

  const searchOnGridHandler = (e) => {
    if (gridSearchTimeOut) clearTimeout(gridSearchTimeOut);   
    let searchString = e.target.value;
    
    gridSearchTimeOut = setTimeout(() => {
      
      let SearchResults = [];
    let sourceData = [...structuredData.rows]
      if(searchString)
      {
        sourceData.forEach((department) => {    
          if (department.isHierarchy) {
            if (department.departmentCode.toLowerCase().includes(searchString.toLowerCase()) 
                || department.departmentName.toLowerCase().includes(searchString.toLowerCase())) {
              // Hierarchy Matched No Need to Check its groups and childs further.
              SearchResults.push(department);
             } else {
              // Hierarchy not Matched, Check in its Groups
              let matchGroups = [];
              department.groupDepartments.map((group) => {
               if (group.departmentCode.toLowerCase().includes(searchString.toLowerCase()) 
                  || group.departmentName.toLowerCase().includes(searchString.toLowerCase())) {
                // Group matched, not need to check its child further.
                matchGroups.push(group);
               } else {
                // Group is not matched , check its Childs
                let matchChild = [];
                group.childDepartments.map((child) => {
                 if (child.departmentCode.toLowerCase().includes(searchString.toLowerCase()) 
                    || child.departmentName.toLowerCase().includes(searchString.toLowerCase())) {
                  // Child found
                  matchChild.push(child);
                 }
                });
                if (matchChild.length) {
                 group.childDepartments = [...matchChild];
                 matchGroups.push(group);
                }
               }
              });
              if (matchGroups.length) {
               department.groupDepartments = [...matchGroups];
               SearchResults.push(department);
              }
             }
          }
          else if(department.isGroup)
          {
            // Check independent Groups
      if (department.departmentCode.toLowerCase().includes(searchString.toLowerCase()) 
          || department.departmentName.toLowerCase().includes(searchString.toLowerCase())) {
          // Group Matched , No Need to check its Child
            SearchResults.push(department);
       } else {
              // Group is not matched , check its Childs
              let matchChild = [];
              department.childDepartments.map((child) => {
              if (child.departmentCode.toLowerCase().includes(searchString.toLowerCase()) || child.departmentName.toLowerCase().includes(searchString.toLowerCase())) {
                // Child found
                matchChild.push(child);
              }
              });
              if (matchChild.length) {
              department.childDepartments = [...matchChild];
              SearchResults.push(department);
              }
            }
          }else
          {
            // Check independent items
          if (department.departmentCode.toLowerCase().includes(searchString.toLowerCase()) 
              || department.departmentName.toLowerCase().includes(searchString.toLowerCase())) {
            // Item matched
            SearchResults.push(department);
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
      {"Department"}
    </p>

    {gridDataState.length ? 
                <SingleSelectGroupDataGrid
                    key={localState.gridKey + 'Department'}
                    id={'department-Data-Gird-id'}
                    headerData={getHeaders("Department")}
                    rowData={gridDataState}
                    modalState={true}
                    name={"Department"}
                    onSubmit={() => {}}
                    hideGroupsToggle={false}
                    hideGroups ={false}
                    onSelectionChange={(e) => { 
                     handleSelection(e.selectedItem, 'department');}
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
                  {...getHeaderProps({ header , onClick : (e) => handleSorting(e ,getHeaderProps({header}).sortDirection) })}
                    className={`statistics-table-header ${
                      header.extraDetails
                        ? "statistics-table-textual-header"
                        : "text-right-align"
                    }`}
                  >
                    {header.header.split(" ").map((headerPart) => (
                      <>
                        {headerPart} <br />
                      </>
                    ))}
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
           
              <>{rowsState.rows.map((firstLevelRow, firstLevelRowIndex) => (
                <>
                  <TableRow onClick={(e) => (firstLevelRow.isHierarchy || firstLevelRow.isGroup) ? toggleRows(e, [firstLevelRowIndex]) : handleRowSelection([firstLevelRowIndex])}>
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
                  {
                   ( firstLevelRow.isHierarchy && firstLevelRow.isExpanded ) ? 
                   firstLevelRow.groupDepartments.map((secondLevelRow, secondLevelRowIndex) => 
                      (<>
                          <TableRow onClick={(e) => toggleRows( e,[firstLevelRowIndex, secondLevelRowIndex])}
                          >
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

                            {(secondLevelRow.isGroup && secondLevelRow.isExpanded) ? 
                            secondLevelRow.childDepartments.map((thirdLevelRow, thirdLevelRowIndex) => 
                            (<>
                               <TableRow onClick={(e) => handleRowSelection([firstLevelRowIndex, secondLevelRowIndex , thirdLevelRowIndex])}
                               >
                                {headers.map((header, headerIndex) => (
                                  <TableCell
                                    className={`${
                                      firstLevelRow.childRows?.length ? "bold" : ""
                                    } ${header.extraDetails ? "" : "text-right-align"}`}
                                  >
                                    {getCellContent(header, headerIndex, thirdLevelRow, [firstLevelRowIndex, secondLevelRowIndex , thirdLevelRowIndex])}
        
                                  </TableCell>
                                ))}
                              </TableRow>
                              </>)
                            )
                          : null}
                      </>)
                      )
                  : (firstLevelRow.isGroup && firstLevelRow.isExpanded) ? 
                    firstLevelRow.childDepartments.map((secondLevelRowInGroup, secondLevelRowIndexInGroup) => 
                    (<>
                       <TableRow  onClick={(e) => handleRowSelection([firstLevelRowIndex, secondLevelRowIndexInGroup])}
                       >
                        {headers.map((header, headerIndex) => (
                          <TableCell
                            className={`${
                              firstLevelRow.childRows?.length ? "bold" : ""
                            } ${header.extraDetails ? "" : "text-right-align"}`}
                          >
                            {getCellContent(header, headerIndex, secondLevelRowInGroup, [firstLevelRowIndex, secondLevelRowIndexInGroup])}

                          </TableCell>
                        ))}
                      </TableRow>
                      </>)
                    )
                     : null}
                </>
              ))} {rowsState.rows.length ? extraRow() : ''} </>
              : <InlineLoading description="Loading..." />
            }
            </TableBody>
          </Table>

          <Pagination
            id="paginationBar"
            pageSizes={[20, 30, 40, 50, 100]}
            totalItems={searchedRow.rows.length}
            onChange={(e) => paginationHandler(e)}
            className="bx--pagination entity-department-statistics-grid-pagination"
          />
        </TableContainer>
      )}
      rows={rowsState.rows}
    /> */}
    </>
  );
};

export default DepartmentDataGrid;
