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
import { getApiResponseAsync } from "../../../services/api/apiCallerGet";
import { getJobCodeGroupedData } from '../../../helpers/DataTransform/transformData'
const JobCodeGrid = ({ handleSelection }) => {
    const headers = [
        {
            header: "Job Code",
            key: "jobcode",
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
            type: 'tree'
        }
    ];

    const [headersState, setHeadersState] = useState({ headers });
    const [rowsState, setRowsState] = useState({ rows: [] });
    const jobCodes = useSelector((state) => state.MasterData.JobCodes); // global Store States
    const [searchedRow , setSearchedRow] =  useState({ rows: [] });
    const [structuredData, setStructuredData] = useState({ rows: [] });
    const [loaderState, setLoaderState] = useState({ isLoaded: false });
    let gridSearchTimeOut;
    useEffect(() => {

        if (jobCodes.length) {
            // Include selection property in orignal Data.
            let UpdatedData = jobCodes.map(jc => {
                jc.isSelected = false;
                return jc;
            });
            getApiResponseAsync("JOBCODERELATIONSHIPS").then((jobCoderelationData) => {
                getJobCodeGroupedData(UpdatedData, jobCoderelationData).then((response)=>{
                    UpdatedData = response;
                    setStructuredData({ rows: UpdatedData })
                    setSearchedRow({rows : UpdatedData})
                    UpdatedData = UpdatedData.slice(0, 20);
                    setRowsState({ rows: UpdatedData });
                    setLoaderState({ isLoaded: true });     
                });
              });   
        }
    }, [jobCodes]);

    const onHeaderIconClick = (e, headerIndex, detailIndex) => {
        e.preventDefault();
        if (headersState.headers[headerIndex].extraDetails.filter((item) => item.isHidden === false).length == 1 && !headersState.headers[headerIndex].extraDetails[detailIndex].isHidden) {
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
        let UpdatedRows = rows.map(jc => {
            if (jc.isGroup) {
                let groupChilds = jc.childJobCodes.map(
                    child => {
                        child.isSelected = false;
                        return child
                    });
                jc.childJobCodes = [...groupChilds];
                return jc;
            }
            jc.isSelected = false;
            return jc;
        });
        return UpdatedRows;
    }
    const handleRowSelection = (selectedRowIndexes) => {
        let UpdatedRows = DeSelectRow([...rowsState.rows]);
        let row;
        if (selectedRowIndexes.length === 2) {
            row = { ...UpdatedRows[selectedRowIndexes[0]].childJobCodes[selectedRowIndexes[1]] };
            row.isSelected = true;
            UpdatedRows[selectedRowIndexes[0]].childJobCodes[selectedRowIndexes[1]] = row;
        } else {
            row = { ...UpdatedRows[selectedRowIndexes[0]] };
            row.isSelected = true;
            UpdatedRows[selectedRowIndexes[0]] = row;
        }

        setRowsState({ rows: UpdatedRows });
        handleSelection(row, 'jobcode')
    };

    const getCellContent = (header, headerIndex, row, indexArray) => {
        let cellContentList = [];
        let className = "statistics-entity-cell";
        header.extraDetails.forEach((detail) => {
            if (!detail.isHidden) {
                cellContentList.push(row["jobCode" + detail.text]);
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
                        <div className={`bx--col-lg-1 ${indexArray.length === 2 ? "groupItemRadioButton" : "itemRadioButton"}`}>
                            <RadioButton
                                id={`rd_jobCode_dataGrid-${indexArray.length === 2 ? indexArray[0] + "-" + indexArray[1] : indexArray[0]}`}
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
                                row.isGroup ? "isGroup-txt" : null
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
        setLoaderState({ isLoaded: false });
        let updatedData = searchedRow.rows.slice(
            (e.page - 1) * e.pageSize,
            (e.page - 1) * e.pageSize + e.pageSize
        );

        updatedData = DeSelectRow([...updatedData]);
        setRowsState({ rows: updatedData });
        handleSelection(null, 'jobcode')
        setLoaderState({ isLoaded: true });
    };


    const sortByName = (data, currentSorting) => {
        if (currentSorting === "NONE") {
            // If current is NONE , then next will be the ASC
            data.sort(function (jc1, jc2) {
                let result = 0;
                if (jc1.jobCodeName.toLowerCase() > jc2.jobCodeName.toLowerCase()) {
                    result = 1;
                } else {
                    result = -1;
                }
                return result;
            });
        } else if (currentSorting === "ASC") {
            // If current is ASC , then next will be the DESC
            data.sort(function (jc1, jc2) {
                let result = 0;
                if (jc1.jobCodeName.toLowerCase() < jc2.jobCodeName.toLowerCase()) {
                    result = 1;
                } else {
                    result = -1;
                }
                return result;
            });
        }
        return [...data];
    }

    const handleSorting = (e, currentSorting) => {
        setLoaderState({ isLoaded: false })
        e.preventDefault()
        // NONE > //ASC > //DESC  
        let updatedData = [...rowsState.rows]
        if (currentSorting !== "DESC") {
            let Groups = rowsState.rows.filter((item) => { return item.isGroup === true });
            let Items = rowsState.rows.filter((item) => { return item.isGroup !== true });

            let sortGroups = Groups.map((group) => {
                let sortItem = sortByName(group.childJobCodes, currentSorting);
                group.childJobCodes = sortItem;
                return group;
            });//sortGroups
            sortGroups = sortByName(sortGroups, currentSorting);

            let sortItems = sortByName(Items, currentSorting);

            updatedData = [...sortGroups, ...sortItems]

        }

        setRowsState({ rows: updatedData });


        setLoaderState({ isLoaded: true });
    }

    const extraRow = () => {
        const Rows = [];


        for (let i = 0; i < 20 - rowsState.rows.length; i++) {
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
                if(item.jobCodeCode.toLowerCase().includes(searchString.toLowerCase()) ||
                item.jobCodeName.toLowerCase().includes(searchString.toLowerCase()))
                {
                  SearchResults.push(item);
                }else
                {
                  let matchChild = [];
                  item.childJobCodes.forEach((child) => {
                    if (child.jobCodeCode.toLowerCase().includes(searchString.toLowerCase()) ||
                    child.jobCodeName.toLowerCase().includes(searchString.toLowerCase())) {
                     // Child found
                     matchChild.push(child);
                    }
                   });
                   if (matchChild.length) {
                    item.childJobCodes = [...matchChild];
                    SearchResults.push(item);
                   }
                }
              }else
              {
                if(item.jobCodeCode.toLowerCase().includes(searchString.toLowerCase()) ||
                item.jobCodeName.toLowerCase().includes(searchString.toLowerCase()))
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
        {"Job code"}
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
                                            {...getHeaderProps({ header, onClick: (e) => handleSorting(e, getHeaderProps({ header }).sortDirection) })}
                                            className={`statistics-table-header ${
                                                header.extraDetails
                                                    ? "statistics-table-textual-header"
                                                    : "text-right-align"
                                                }`}
                                        >
                                            
                                            {header.header}
                                            <br/>
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
                                                && firstLevelRow.childJobCodes.map((secondLevelRow, secondLevelRowIndex) => (
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
                                                ))}
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
                            totalItems={structuredData.rows.length}
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

export default JobCodeGrid;
