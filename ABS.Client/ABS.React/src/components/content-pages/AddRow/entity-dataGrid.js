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

import {getEntityGroupedData} from '../../../helpers/DataTransform/transformData'
import { getApiResponseAsync } from "../../../services/api/apiCallerGet";

const EntityDataGrid = ({handleSelection}) => {
  const headers = [
    {
      header: "Entity",
      key: "entity",
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
  const entityData = useSelector((state) => state.MasterData.Entites); // global Store States
  const [searchedRow , setSearchedRow] =  useState({ rows: [] });
  const [structuredData, setStructuredData] = useState({ rows: [] });
  const [loaderState , setLoaderState] = useState({ isLoaded: false });
  let gridSearchTimeOut;

  useEffect(() => {

    if(entityData.length)
    {
    // Include selection property in orignal Data.
    let UpdatedentityData = entityData.map((entity, entityIndex) => {
      entity.isSelected = false;
      return entity;
    });

    getApiResponseAsync("ENTITYRELATIONSHIPS").then((entityrelationData) => {
      getEntityGroupedData(entityData, entityrelationData).then((response)=>{
        UpdatedentityData = response;
        setStructuredData({rows : UpdatedentityData})
        setSearchedRow({rows : UpdatedentityData})
        UpdatedentityData = UpdatedentityData.slice(0, 20);
        setRowsState({ rows: UpdatedentityData });
        setLoaderState({isLoaded : true});
      });
    });  
   }  
  }, [entityData]);

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
    let UpdatedentityRows = rows.map((entity, entityIndex) => {
      if(entity.isGroup)
      {
        let groupChilds = entity.childEntities.map(
          (child, childIndex) => {
            child.isSelected = false;
            return child
          });
          entity.childEntities = [...groupChilds];
          return entity; 
      }
      entity.isSelected = false;
      return entity;
    });
    return UpdatedentityRows;
  }
  const handleRowSelection = (selectedRowIndexes) => {
    let UpdatedentityRows = DeSelectRow([...rowsState.rows]);
    let row;
    if(selectedRowIndexes.length === 2)
    {
      row = { ...UpdatedentityRows[selectedRowIndexes[0]].childEntities[selectedRowIndexes[1]] };
      row.isSelected = true;
      UpdatedentityRows[selectedRowIndexes[0]].childEntities[selectedRowIndexes[1]] = row;
    }else
    {
      row = { ...UpdatedentityRows[selectedRowIndexes[0]] };
      row.isSelected = true;
      UpdatedentityRows[selectedRowIndexes[0]] = row;
    }
    
    setRowsState({ rows: UpdatedentityRows });
    handleSelection(row , 'entity')
  };

  const getCellContent = (header, headerIndex, row, indexArray) => {
    let cellContentList = [];
    let className = "statistics-entity-cell";
    header.extraDetails.forEach((detail) => {
      if (!detail.isHidden) {
        cellContentList.push(row["entity" + detail.text]);
      }
    });
    return (
      <>
        <div className="bx--row">
          {
            !cellContentList.length || !row.isGroup ? (
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
            )
          }

          {!row.isGroup ? (
            <div className={`bx--col-lg-1 ${indexArray.length === 2 ?  "groupItemRadioButton" : "itemRadioButton"}`}>
              <RadioButton
                id={`rd_entity_dataGrid-${indexArray.length === 2 ? indexArray[0]+"-"+indexArray[1] : indexArray[0]}`}
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
                row.isGroup  ? "isGroup-txt" : null
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
    let updatedentityData = searchedRow.rows.slice(
      (e.page - 1) * e.pageSize,
      (e.page - 1) * e.pageSize + e.pageSize
    );

    updatedentityData = DeSelectRow([...updatedentityData]);
    setRowsState({ rows: updatedentityData });
    handleSelection(null , 'entity')
    setLoaderState({isLoaded : true});
  };


  const sortByName = ( data , currentSorting) =>
  {
    if(currentSorting === "NONE")
    {
      // If current is NONE , then next will be the ASC
      data.sort(function (entity1 , entity2) {
        let result = 0;
        if (entity1.entityName.toLowerCase() > entity2.entityName.toLowerCase()) {
          result = 1;
        } else {
          result = -1;
        }
        return result;
      });
    }else if(currentSorting === "ASC") {
      // If current is ASC , then next will be the DESC
      data.sort(function (entity1 , entity2) {
        let result = 0;
        if (entity1.entityName.toLowerCase() < entity2.entityName.toLowerCase()) {
          result = 1;
        } else {
          result = -1;
        }
        return result;
      });
    }
    return [...data];
  }

  const handleSorting = (e,currentSorting) => {
    setLoaderState({isLoaded : false})
    e.preventDefault()
    // NONE > //ASC > //DESC  
    let updatedentityData = [...rowsState.rows]  
    if(currentSorting !== "DESC")
    {
      let Groups = rowsState.rows.filter((item) => {return item.isGroup === true});
      let Items = rowsState.rows.filter((item) => {return item.isGroup !== true});
  
      let sortGroups = Groups.map((group) => {        
        let sortItem  = sortByName(group.childEntities , currentSorting);
        group.childEntities = sortItem;
        return group;
        });//sortGroups
        sortGroups = sortByName(sortGroups ,currentSorting);

        let sortItems = sortByName(Items , currentSorting);
          
        updatedentityData = [...sortGroups , ...sortItems]

    }
  
    setRowsState({ rows: updatedentityData });
    
    
    setLoaderState({isLoaded : true});
  }

  const extraRow =()=>{
    const Rows = [];
   

    for(let i = 0 ; i< 20 - rowsState.rows.length; i++)
    {
      Rows.push(<TableRow>
                      <TableCell></TableCell>
                </TableRow>);
    }

    return Rows
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
            if(item.entityCode.toLowerCase().includes(searchString.toLowerCase()) ||
            item.entityName.toLowerCase().includes(searchString.toLowerCase()))
            {
              SearchResults.push(item);
            }else
            {
              let matchChild = [];
              item.childEntities.forEach((child) => {
                if (child.entityCode.toLowerCase().includes(searchString.toLowerCase()) ||
                child.entityName.toLowerCase().includes(searchString.toLowerCase())) {
                 // Child found
                 matchChild.push(child);
                }
               });
               if (matchChild.length) {
                item.childEntities = [...matchChild];
                SearchResults.push(item);
               }
            }
          }else
          {
            if(item.entityCode.toLowerCase().includes(searchString.toLowerCase()) ||
            item.entityName.toLowerCase().includes(searchString.toLowerCase()))
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
      {"Entity"}
    </p>
    <DataTable
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
           
                  rowsState.rows.map((firstLevelRow, firstLevelRowIndex) => (
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
                        && firstLevelRow.childEntities.map((secondLevelRow, secondLevelRowIndex) => (
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
                        )) }
                  </>
                  ))
                  : <InlineLoading description="Loading..." />
            }

            {loaderState.isLoaded ? extraRow() : null}

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
    />
  </>
  );
};

export default EntityDataGrid;
