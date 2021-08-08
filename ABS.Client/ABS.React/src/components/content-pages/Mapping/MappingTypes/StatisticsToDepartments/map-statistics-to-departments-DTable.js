import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataTable, DataTableSkeleton, TableContainer, Table, TableHead, TableRow, TableBody, TableHeader, TableCell, Pagination, TooltipIcon, TableToolbarContent, ComboBox, Accordion, AccordionItem, Tag, Search, Button } from "carbon-components-react";
import { ChevronDown16, ChevronLeft16, ChevronRight16, ChevronUp16, Search16 } from "@carbon/icons-react";
import { getDepartmentHierarchyGroupedData, getStatisticsGroupedData, GetSortedStatisticsByGroups } from "../../../../../helpers/DataTransform/transformData";
import { updateMapping } from "../../../../../core/_actions/MappingActions";
import FilterTable from "../../../../layout/FilterTable/FilterTable";
import { resetBudgetVersionsFilters, setBudgetVersionsFilterOptions, setBudgetVersionsFilteredFlag, setBudgetVersionsSortedFlag } from "../../../../../core/_actions/BudgetVersionsActions";
import { compareFunction } from "../../../../../helpers/compare.helper";
import SingleSelectIndividualModal from "../../../../shared/single-select/single-select-with-individual-modal";
import { statisticsToDepartmentsHeaders } from "../../Data/mapping-grid-headers";
import { getStatisticsToDepartmentMappingsByEntity } from "../../../../../services/mapping-service";
import { getMappedRow } from "./../../../../shared/single-select/single-select-data-mapper-service";
import { getApiResponseAsync } from "../../../../../services/api/apiCallerGet";

const MapStatisticsToDepartmentsDTable = ({ match, isEdit = false }) => {
  const dispatch = useDispatch();
  const filterOptions = [{
    id: 1,
    idProperty: 'departmentID',
    codeProperty: 'departmentCode',
    nameProperty: 'departmentName',
    value: 'department',
    stateId: 'Departments',
    masterId: 'Departments',
    relationshipModel: 'DEPARTMENT',
    tableHeader: 'department',
    sortHeader: 'Sort departments'
  }];

  const [headersState, setHeadersState] = useState({ headers: statisticsToDepartmentsHeaders });
  const [rowsState, setRowsState] = useState({ rows: [] });
  const [structuredData, setStructuredData] = useState({ rows: [] });
  const [searchedStructuredData, setsearchedStructuredData] = useState({ rowCount: 0, rows: [] });
  const [filteredData, setfilteredData] = useState({ rowCount: 0, rows: [], isFiltered: false });
  const [loaderState, setLoaderState] = useState({ isLoaded: false });
  const [paginationStates, setPaginationStates] = useState({ pageSize: 10, pageNumber: 1 });
  const masterData = useSelector((state) => state.MasterData);
  const state = useSelector((state) => state.Mapping);
  const StatisticsForDropDown = GetSortedStatisticsByGroups(masterData.Statistics);
  const [searchedStatisticsData, setSearchedStatisticsData] = useState({ statisticsData: [] });
  const statistics = useSelector((state) => state.BudgetVersions);
  const filters = useSelector((state) => state.BudgetVersions.Filters);
  const sortDetails = useSelector((state) => state.BudgetVersions.Sort);
  const [filterOpenState, setFilterOpenState] = useState(false);
  const departmentFilterTableRef = useRef(null);
  const [modalOpenState, setModalOpenState] = useState(false);
  const [statisticsModalState, setStatisticsModalState] = useState({ statisticsType: "", selectedRowIndexes: [], value: "" });
  const [mappingDataState, setMappingDataState] = useState({ mappingData: undefined });
  let statisticsDropDownSearchTimeOut;
  let gridSearchTimeOut;
  let itemSelected = false;
  const isFiltered = filters.filtered || filters.Entites.length > 0 || filters.Departments.length > 0 || filters.Statistics.length > 0;
  const isSorted = sortDetails.Entites.sortFactor !== "code" || sortDetails.Entites.sortDirection !== "ascending" || sortDetails.Departments.sortFactor !== "code" || sortDetails.Departments.sortDirection !== "ascending" || sortDetails.Statistics.sortFactor !== "code" || sortDetails.Statistics.sortDirection !== "ascending";
  const [departmentRelationDataState, setdepartmentRelationDataState] = useState({})
  const [processedGridData, setprocessedGridData] = useState({});

  useEffect(() => {
    if (masterData.Statistics.length) {
      getApiResponseAsync("STATISTICSRELATIONSHIPS").then((statisticsrelationData) => {
        getStatisticsGroupedData(masterData.Statistics, statisticsrelationData).then((response) => {
          setprocessedGridData(response);
        });
      });
    }
  }, [masterData.Statistics]);

  useEffect(() => {
    getApiResponseAsync("DEPARTMENTSRELATIONSHIPS").then((response) => {
      setdepartmentRelationDataState(response);
    });
  }, []);

  useEffect(() => {
    if (departmentRelationDataState.length && masterData.Departments && mappingDataState.mappingData) {
      let UpdateddepartmentData = masterData.Departments.map((department, departmentIndex) => {
        department.isSelected = false;
        return department;
      });

      let filterData = UpdateddepartmentData.filter((item) => { return item.isGroup == false && item.isHierarchy == false && item.isMaster == false });
      setFilterOptions(filterData);
      // Update statistics of department which already in the DB.
      mappingDataState.mappingData.forEach((mapping) => {
        let deptIndex = UpdateddepartmentData.findIndex((dept) => dept.departmentID === mapping.department.departmentID);
        if (deptIndex !== -1) {
          let updatedDept = UpdateddepartmentData[deptIndex];
          UpdateddepartmentData[deptIndex] = JSON.parse(
            JSON.stringify({
              ...updatedDept,
              primaryStatistics: mapping.primaryStatisticCode ? mapping.primaryStatisticCode.statisticsCodeID : "",
              secondaryStatistics: mapping.secondaryStatisticCode ? mapping.secondaryStatisticCode.statisticsCodeID : "",
              tertiaryStatistics: mapping.tertiaryStatisticCode ? mapping.tertiaryStatisticCode.statisticsCodeID : "",
            })
          );
        }
      });
      setStructuredData({ rows: UpdateddepartmentData });
      getDepartmentHierarchyGroupedData(UpdateddepartmentData, departmentRelationDataState).then((response) => {
        UpdateddepartmentData = response;
        setsearchedStructuredData({
          rowCount: UpdateddepartmentData.length,
          rows: UpdateddepartmentData,
        });
        UpdateddepartmentData = UpdateddepartmentData.slice(0, 10);

        UpdateddepartmentData.forEach((row) => {
          getMappedRow(row, "department");
        });
        let statisticsData = [];
        let statisticsDataObject = { primaryStatistics: [...StatisticsForDropDown], secondaryStatistics: [...StatisticsForDropDown], tertiaryStatistics: [...StatisticsForDropDown] };
        // Here process and Set State for the statistic dropdown to enable Search/Type Ahead feature.
        statisticsData = SetStatisticsDataWithChildRow({ childRows: UpdateddepartmentData }, statisticsDataObject, statisticsData);
        setSearchedStatisticsData({ statisticsData: [...statisticsData] });
        setRowsState({ rows: UpdateddepartmentData });
        //setUnsortedRow({ rows: UpdateddepartmentData });
      });
    }
  }, [masterData.Departments, departmentRelationDataState, mappingDataState.mappingData]);

  const SetStatisticsDataWithChildRow = (RowsData, statisticsDataObject, statisticsData) => {
    if (RowsData.childRows) {
      RowsData.childRows.forEach((row) => {
        SetStatisticsDataWithChildRow(row, statisticsDataObject, statisticsData);
      });
    } else {
      // Save statistics data with the last child object only.
      statisticsData.push({ id: RowsData['departmentID'], data: statisticsDataObject });
    }
    return statisticsData;
  }

  useEffect(() => {
    GetMappingData();
  }, []);


  useEffect(() => {
    // if sort changes, we need the change to immediately
    // show up in the filter options
    if (masterData.Departments) {
      setFilterOptions(masterData.Departments.filter((item) => { return item.isGroup == false && item.isHierarchy == false && item.isMaster == false }));
    }
  }, [sortDetails]);

  const GetMappingData = async () => {
    setLoaderState({ isLoaded: false });
    let response = await getStatisticsToDepartmentMappingsByEntity(state.entity);
    setMappingDataState({ mappingData: response.data });
    setLoaderState({ isLoaded: true });
    return response.data;
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
    } else if (isStatsCell && innerText.length > 40) {
      return true;
    }
    return false;
  };

  const toggleRows = (rowIndexArray) => {
    const rowsClone = JSON.parse(JSON.stringify(rowsState.rows));
    let rowRef = { childRows: rowsClone };
    rowIndexArray.forEach(index => {
      rowRef = rowRef.childRows[index];
    });
    rowRef.isExpanded = !rowRef.isExpanded;
    setRowsState({ rows: rowsClone });
  }

  const handleStatisticsDropDownSearchFilter = (inputText, indexArray, headerKey, rowID) => {
    let searchedResult = [];
    if (statisticsDropDownSearchTimeOut) {
      clearTimeout(statisticsDropDownSearchTimeOut);
    }
    statisticsDropDownSearchTimeOut = setTimeout(() => {
      if (inputText && !itemSelected) {
        searchedResult = StatisticsForDropDown.filter((statisitcs) => {
          let CodeAndName = statisitcs.statisticsCode + " " + statisitcs.statisticsCodeName;
          return statisitcs.statisticsCodeName.toLowerCase().includes(inputText.toLowerCase()) || statisitcs.statisticsCode.toLowerCase().includes(inputText.toLowerCase()) || CodeAndName.toLowerCase().includes(inputText.toLowerCase());
        });
      } else {
        searchedResult = [...StatisticsForDropDown];
      }

      let updatedSearchedStatisticsData = [...searchedStatisticsData.statisticsData];
      let updatedItem = updatedSearchedStatisticsData.find((item) => {
        return item.id === rowID
      });
      if (updatedItem) {
        updatedItem.data[headerKey] = [...searchedResult]
      }
      setSearchedStatisticsData({
        statisticsData: [...updatedSearchedStatisticsData],
      });
      itemSelected = false;
    }, 500);
  };

  const setValueOnIndexdRow = (indexArray, rows = rowsState.rows, propertyName, value) => {
    let row = { childRows: rows };
    indexArray.forEach(index => {
      row = row.childRows[index];
    })
    row[propertyName] = value;
    setRowsState({ rows: rows });
    return row;
  }

  const getCellContent = (header, headerIndex, row, indexArray, dropDownItemsData) => {
    let cellContentList = [];
    let className = "mapping-department-cell";
    if (header.key === "department") {
      header.extraDetails.forEach((detail) => {
        if (!detail.isHidden) {
          cellContentList.push(row["department" + detail.text]);
        }
      });
      return (
        <>
          <div className="bx--row">
            {!cellContentList.length || (!row.isGroup && !row.isHierarchy) ? (
              ""
            ) : row.isExpanded ? (
              <div style={{ marginLeft: 10 * indexArray.length }} className={'bx--col-lg-1'}
              //className={`bx--col-lg-1 ${indexArray.length === 2 && row.isGroup ? "hierarchyGroupChevron" : null}`}
              >
                <ChevronUp16 onClick={(e) => toggleRows(indexArray)} className="statistics-table-cell-icon" />
              </div>
            ) : (
                  <div style={{ marginLeft: 10 * indexArray.length }} className={'bx--col-lg-1'}
                  //className={`bx--col-lg-1 ${indexArray.length === 2 && row.isGroup ? "hierarchyGroupChevron" : null}`}
                  >
                    <ChevronDown16 onClick={(e) => toggleRows(indexArray)} className="statistics-table-cell-icon" />
                  </div>
                )}
            <div className="bx--col-lg-2">
              <div style={!row.isGroup && !row.isHierarchy ? { marginLeft: 15 * indexArray.length } : {}}
                className={`${className} bx--text-truncate--end ${row.isGroup || row.isHierarchy ? "isGroup-txt" : null
                  //indexArray.length === 3 || indexArray.length === 2 ? "child-text-cell" : null
                  }`}>
                <span
                  onMouseOver={(e) => {
                    // are we in an overflow state?
                    // if not, erase the title so that the tooltip does not show
                    if (!cellIsOverflown(e.target, e.target.innerText, true)) {
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
    } else if (header.type === "other" && !row.isGroup && !row.isHierarchy) {
      return <>{row[header.key]}</>;
    } else if (header.type === "statistics" && !row.isGroup && !row.isHierarchy) {
      return (
        <>
          <div className={"bx--row"}>
            <div className={"bx--col-lg statistics-combo-container"}>
              <div className={"bx--row statistics-combo-container-row"}>
                <div className={"bx--col-lg "}>
                  <ComboBox
                    id={`statistiscsDropDown-${header.key}-${row.departmentID}-${indexArray.length === 3 ? indexArray[0] + "-" + indexArray[1] + "-" + indexArray[2] : indexArray.length === 2 ? indexArray[0] + "-" + indexArray[1] : indexArray[0]}`}
                    key={`statistiscsDropDown-${header.key}-${row.departmentID}-${indexArray.length === 3 ? indexArray[0] + "-" + indexArray[1] + "-" + indexArray[2] : indexArray.length === 2 ? indexArray[0] + "-" + indexArray[1] : indexArray[0]}`}
                    className={"single-select-combo-box"}
                    direction="bottom"
                    disabled={!isEdit}
                    items={searchedStatisticsData.statisticsData.find((item) => { return item.id === row.departmentID })?.data[header.key] ?? []
                    }
                    placeholder="Choose one"
                    itemToString={(item) => (item ? item.statisticsCode + " " + item.statisticsCodeName : "")}
                    itemToElement={(item) =>
                      item.isGroup ? <span> <strong> {"*"} {item.statisticsCode + " " + item.statisticsCodeName}</strong></span>
                        : <span> {item.statisticsCode + " " + item.statisticsCodeName}</span>
                    }
                    selectedItem={StatisticsForDropDown.find((item) => item.statisticsCodeID === row[header.key])}
                    light={false}
                    onChange={(e) => handleChange(e.selectedItem ? e.selectedItem.statisticsCodeID : "", header.key, indexArray)}
                    onInputChange={(inputText) => {
                      handleStatisticsDropDownSearchFilter(inputText, indexArray, header.key, row.departmentID);
                    }}
                    type="default"
                  />
                </div>
                <div className={"bx--col-lg-1"}>
                  <Search16
                    className={"dropdown-Search-Icon"}
                    onClick={(e) => {
                      onSearchIconClick(header.key, indexArray);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  const onSearchIconClick = (statisticsType, selectedRowIndexes) => {
    debugger
    if(isEdit){
      setModalOpenState(true);
      setStatisticsModalState({ statisticsType: statisticsType, selectedRowIndexes: selectedRowIndexes });
    }
  };

  const closeStatisticsModal = () => {
    setModalOpenState(false);
  };

  const handleChange = (value, statisticsType, selectedRowIndexes, callFromModalGrid = false) => {

    let updatedRow = setValueOnIndexdRow(selectedRowIndexes, rowsState.rows, statisticsType, value);
    updateEffectedRowInStore(updatedRow, value, statisticsType);

  };

  const updateEffectedRowInStore = (effectedRowInGrid, value, statisticsType) => {
    // Now Mantain changes rows in the Store.
    let updatedChangedData = [...state.changedData];
    let existRowIndex = state.changedData.findIndex((item) => item.departmentID === effectedRowInGrid.departmentID);
    if (existRowIndex !== -1) {
      // Row Exist in store, update the value
      let existRowObj = updatedChangedData[existRowIndex];
      existRowObj[statisticsType] = value;

      // Apply below condition only when Mapping not saved for selected row previosuly in DB. Not implement yet, possible after the API.
      // if all 3 statistics values are NULL OR Empty , then remove this entry from the Store, no need to send this record at backend.
      if (!existRowObj.primaryStatistics && !existRowObj.secondaryStatistics && !existRowObj.tertiaryStatistics && mappingDataState.mappingData.findIndex((dept) => dept.department.departmentID === existRowObj.departmentID) === -1) {
        updatedChangedData.splice(existRowIndex, 1);
      } else {
        updatedChangedData[existRowIndex] = existRowObj;
      }
    } else {
      // Row does not Exist in store, Add New Values.
      updatedChangedData.push({
        departmentID: effectedRowInGrid.departmentID,
        primaryStatistics: effectedRowInGrid["primaryStatistics"] ? effectedRowInGrid["primaryStatistics"] : "",
        secondaryStatistics: effectedRowInGrid["secondaryStatistics"] ? effectedRowInGrid["secondaryStatistics"] : "",
        tertiaryStatistics: effectedRowInGrid["tertiaryStatistics"] ? effectedRowInGrid["tertiaryStatistics"] : "",
        [statisticsType]: value,
      });
    }
    dispatch(updateMapping({ ...state, changedData: [...updatedChangedData] }));
  };

  const paginationHandler = (e) => {
    setLoaderState({ isLoaded: false });
    setTimeout(() => {
      let updateddepartmentData = searchedStructuredData.rows.slice((e.page - 1) * e.pageSize, (e.page - 1) * e.pageSize + e.pageSize);
      setPaginationStates({ pageSize: e.pageSize, pageNumber: e.page });
      //ProcessStatisticsDropdownData(updateddepartmentData);
      setRowsState({ rows: [...updateddepartmentData] });
      setLoaderState({ isLoaded: true });
    }, 0);
  };

  const handleGridSearch = (e) => {
    if (gridSearchTimeOut) clearTimeout(gridSearchTimeOut);
    let searchString = e.target.value;
    gridSearchTimeOut = setTimeout(() => {
      let SearchResults = [];
      let sourceData = filteredData.isFiltered ? filteredData.rows : structuredData.rows;
      if (searchString) {
        sourceData.map((department) => {
          if (department.isHierarchy) {
            if (department.departmentCode.toLowerCase().includes(searchString.toLowerCase()) || department.departmentName.toLowerCase().includes(searchString.toLowerCase())) {
              // Hierarchy Matched No Need to Check its groups and childs further.
              SearchResults.push(department);
            } else {
              // Hierarchy not Matched, Check in its Groups
              let matchGroups = [];
              department.groupDepartments.map((group) => {
                if (group.departmentCode.toLowerCase().includes(searchString.toLowerCase()) || group.departmentName.toLowerCase().includes(searchString.toLowerCase())) {
                  // Group matched, not need to check its child further.
                  matchGroups.push(group);
                } else {
                  // Group is not matched , check its Childs
                  let matchChild = [];
                  group.childDepartments.map((child) => {
                    if (child.departmentCode.toLowerCase().includes(searchString.toLowerCase()) || child.departmentName.toLowerCase().includes(searchString.toLowerCase())) {
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
          } else if (department.isGroup) {
            // Check independent Groups
            if (department.departmentCode.toLowerCase().includes(searchString.toLowerCase()) || department.departmentName.toLowerCase().includes(searchString.toLowerCase())) {
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
          } else {
            // Check independent items
            if (department.departmentCode.toLowerCase().includes(searchString.toLowerCase()) || department.departmentName.toLowerCase().includes(searchString.toLowerCase())) {
              // Item matched
              SearchResults.push(department);
            }
          }
        });
      } else {
        SearchResults = [...sourceData];
      }

      console.log(SearchResults);
      setsearchedStructuredData({
        rowCount: SearchResults.length,
        rows: [...SearchResults],
      });
      //ProcessStatisticsDropdownData([...SearchResults.slice(0, 10)]);
      setRowsState({ rows: [...SearchResults.slice(0, 10)] });
    }, 500);
  };

  const dimensionCompareFunction = (dimension, a, b) => {
    const sortDirection = sortDetails[dimension].sortDirection;
    const sortFactor = sortDetails[dimension].sortFactor;
    return compareFunction(sortDirection, a[sortFactor], b[sortFactor]);
  };

  const setFilterOptions = (data) => {
    let filterDepartments = [];

    // generate unique lists of entities, departments, and statistics
    data.forEach((current) => {
      // push unique departments to array
      if (!filterDepartments.find((dept) => dept.id === current.departmentID)) {
        filterDepartments.push({
          id: current.departmentID,
          code: current.departmentCode,
          name: current.departmentName,
        });
      }
    });
    // push options to state
    dispatch(
      setBudgetVersionsFilterOptions(
        "Departments",
        filterDepartments.sort((a, b) => dimensionCompareFunction("Departments", a, b))
      )
    );
  };

  const getFilterStatusClass = () => {
    return statistics.filtered ? "filter-accordion-status-visible" : "filter-accordion-status-hidden";
  };

  const getSortStatusClass = () => {
    return statistics.sorted ? "filter-accordion-status-visible" : "filter-accordion-status-hidden";
  };

  const sortFormatedData = (row) => {
    if (row.childRows) {
      row.childRows = row.childRows.sort((a, b) => dimensionCompareFunction("Departments", a.department, b.department))
      row.childRows.forEach((item) => {
        sortFormatedData(item);
      });
    }

    return row;
  }

  const handleApplyFilter = () => {
    let filterRowData = filterData(structuredData.rows);
    getDepartmentHierarchyGroupedData(filterRowData, departmentRelationDataState).then((response) => {

      filterRowData = response.slice(0, 10);
      filterRowData.forEach((row) => {
        getMappedRow(row, "department");
      });
      let statisticsData = [];
      let statisticsDataObject = { primaryStatistics: [...StatisticsForDropDown], secondaryStatistics: [...StatisticsForDropDown], tertiaryStatistics: [...StatisticsForDropDown] };
      statisticsData = SetStatisticsDataWithChildRow({ childRows: filterRowData }, statisticsDataObject, statisticsData);
      setSearchedStatisticsData({ statisticsData: [...statisticsData] });
      // Apply Sorting on formatted Data.
      filterRowData = sortFormatedData({ childRows: filterRowData }).childRows
      setRowsState({ rows: filterRowData });
      setfilteredData({ ...filteredData, rowCount: filterRowData.length, rows: [...filterRowData], isFiltered: true });
      setsearchedStructuredData({ rowCount: filterRowData.length, rows: filterRowData });
      // close the filter accordion after filtering
      setFilterOpenState(false);
      // set the 'filtered' flag
      dispatch(setBudgetVersionsFilteredFlag(isFiltered));
      // set the 'sorted' flag
      dispatch(setBudgetVersionsSortedFlag(isSorted));
    });

  };

  const filterData = (data) => {
    let filteredRows = [];
    data.forEach((row) => {
      if (!filters.Departments.includes(row.departmentID)) {
        filteredRows.push(row);
      }
    });

    return filteredRows;
  };

  const handleCancelFilter = (e) => {
    e.preventDefault();
    departmentFilterTableRef.current.reset();
    dispatch(resetBudgetVersionsFilters());
    let updatedData = getDepartmentHierarchyGroupedData(structuredData.rows, departmentRelationDataState).then((response) => {
      updatedData = updatedData.slice(0, 10);
      updatedData.forEach((row) => {
        getMappedRow(row, "department");
      });
      let statisticsData = [];
      let statisticsDataObject = { primaryStatistics: [...StatisticsForDropDown], secondaryStatistics: [...StatisticsForDropDown], tertiaryStatistics: [...StatisticsForDropDown] };
      statisticsData = SetStatisticsDataWithChildRow({ childRows: updatedData }, statisticsDataObject, statisticsData);
      setSearchedStatisticsData({ statisticsData: [...statisticsData] });
      setRowsState({ rows: updatedData });
      setsearchedStructuredData({
        rowCount: updatedData.length,
        rows: updatedData,
      });
      setPaginationStates({ pageSize: 10, pageNumber: 1 });
    });

  };

  const getTableRow = (row, rowIndexArray, isParentExpanded) => {
    let dropDownItems = searchedStatisticsData.statisticsData.find((item) => { return item.id === row.departmentID });
    return isParentExpanded ? <TableRow>
      {headersState.headers.map((header, headerIndex) => (
        <TableCell className={`${row.childRows?.length || header.key === 'fy' ? 'bold' : ''} ${header.extraDetails ? '' : 'text-right-align'}`}>
          {getCellContent(header, headerIndex, row, rowIndexArray, dropDownItems)}
        </TableCell>
      ))}
    </TableRow> : '';
  }

  const getRow = (row, rowIndexArray, isParentExpanded) => {
    return <>
      {rowIndexArray.length ? getTableRow(row, rowIndexArray, isParentExpanded) : ""}
      {isParentExpanded && row.childRows?.map((nextLevelRow, nextLevelRowIndex) =>
        getRow(nextLevelRow, [...rowIndexArray, nextLevelRowIndex], row.isExpanded))}
    </>
  }
  return (
    <div>
      {!loaderState.isLoaded ? (
        <>
          <br />
          <DataTableSkeleton columnCount={5} compact={false} rowCount={10} zebra={false} />
        </>
      ) : (
          <>
            <br />
            <Accordion>
              <AccordionItem
                title={
                  <>
                    <h6 className={"filter-accordion-label"}>Filter table</h6>
                    <Tag className={`filter-accordion-status-first-element ${getFilterStatusClass()}`}>Filters applied</Tag>
                    <Tag className={getSortStatusClass()}>
                      <TooltipIcon align="start" direction="top" tooltipText="Multiple column sort orders may be applied.">
                        Sort order applied
          </TooltipIcon>
                    </Tag>
                  </>
                }
                open={filterOpenState}
                onHeadingClick={(state) => {
                  setFilterOpenState(state.isOpen);
                }}
              >
                <table className={"filter-accordion-table"}>
                  <tbody>
                    <tr>
                      <td>
                        <FilterTable id="department-filter" ref={departmentFilterTableRef} filterOption={filterOptions[0]} />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="btn-row action-row">
                  <Button className="bx--btn--secondary" type="submit" onClick={handleCancelFilter} disabled={!isFiltered && !statistics.filtered && !isSorted && !statistics.sorted}>
                    Cancel
        </Button>
                  <Button className="bx--btn--tertiary without-left-border" type="submit" onClick={handleApplyFilter} disabled={!isFiltered && !statistics.filtered && !isSorted && !statistics.sorted}>
                    Show in table
        </Button>
                </div>
              </AccordionItem>
            </Accordion>

            <DataTable
              headers={headersState.headers}
              locale="en"
              isSortable={false}
              radio={true}
              pagination={true}
              render={({ headers, getHeaderProps, getTableProps }) => (
                <TableContainer title="">
                  {/* <TableToolbarContent style={{ justifyContent: "flex-end" }} className={"mapping-grid-toolbar"}> */}
                  {/* <Search className={"mapping-search"} placeHolderText="Search" onChange={handleGridSearch} /> */}
                  {/* </TableToolbarContent> */}
                  <Table size="compact" {...getTableProps()} className={"mapping-table"}>
                    <TableHead>
                      <TableRow>
                        {headers.map((header, headerIndex) => (
                          <TableHeader {...getHeaderProps({ header })} className={`statistics-table-header ${header.extraDetails ? "statistics-table-textual-header" : 'statistics-combobox-header'}`}>
                            {header.extraDetails ? (
                              <>
                                {header.header.split(" ").map((headerPart) => (
                                  <>
                                    {headerPart} <br />
                                  </>
                                ))}{" "}
                              </>
                            ) : (
                                <>{header.header}</>
                              )}
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
                      {getRow({ childRows: rowsState.rows, isExpanded: true }, [], true)}
                    </TableBody>

                  </Table>
                  <Pagination id="paginationBar" pageSizes={[10, 20, 30, 40, 50, 100]} totalItems={searchedStructuredData.rowCount} onChange={(e) => paginationHandler(e)} page={paginationStates.pageNumber} pageSize={paginationStates.pageSize} className="bx--pagination entity-department-statistics-grid-pagination" />
                </TableContainer>
              )}
              rows={[]}
            />
            <SingleSelectIndividualModal
              id={`statistiscsModal-Mapping`}
              openModal={modalOpenState}
              data={[...StatisticsForDropDown]}
              gridData={processedGridData || []}
              statisticsModalStates={statisticsModalState}
              name="Statistics"
              isGroupedData={true}
              closeModal={closeStatisticsModal}
              submitClick={handleChange}
              hideGroupsToggle={true}
              hideGroups={false}
            />
          </>
        )}
    </div>
  );
};
export default MapStatisticsToDepartmentsDTable;
