import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, DataTable, Dropdown, Pagination, TableToolbar, TooltipIcon } from 'carbon-components-react';
import { ChevronDown16, ChevronLeft16, ChevronRight16, ChevronUp16, Information16 ,CircleDash16 , CheckmarkFilled16} from '@carbon/icons-react';

import { addAllBudgetVersionsFilters, addBudgetVersionsFilter, addBudgetVersionsFilterGroup, removeAllBudgetVersionsFiltersGroups,
  removeAllBudgetVersionsFilters, removeBudgetVersionsFilter,removeBudgetVersionsFilterGroup, 
  setBudgetVersionsSortDirection, setBudgetVersionsSortFactor } from '../../../core/_actions/BudgetVersionsActions';
import './_filterTable.scss';

const {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbarContent,
  TableToolbarSearch
} = DataTable;

export const FilterTable = forwardRef(({ id, filterOption , dimensionRelationData}, ref) => {
  
  const headers = [
    {
      id: 0,
      header: "Entity",
      key: "entity",
      extraDetails: [
        {
            key: 'code',
            text: 'Code',
            isHidden: false,
            showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
        },
        {
            key: 'name',
            text: 'Name',
            isHidden: false,
            showTooltipText: 'Show Names', hideTooltipText: 'Hide Names'
        }
      ]
    },
    {
      id: 1,
      header: "Department",
      key: "department",
      extraDetails: [
        {
            key: 'code',
            text: 'Code',
            isHidden: false,
            showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
        },
        {
            key: 'name',
            text: 'Name',
            isHidden: false,
            showTooltipText: 'Show Names', hideTooltipText: 'Hide Names'
        }
      ]
    },
    {
      id: 2,
      header: "Statistics",
      key: "statistics",
      extraDetails: [
        {
            key: 'code',
            text: 'Code',
            isHidden: false,
            showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
        },
        {
            key: 'name',
            text: 'Name',
            showTooltipText: 'Show Names', hideTooltipText: 'Hide Names',
            isHidden: false,
        }
      ]
    },
    {
      id: 3,
      header: "GL Account",
      key: "glAccounts",
      extraDetails: [
        {
            key: 'code',
            text: 'Code',
            isHidden: false,
            showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
        },
        {
            key: 'name',
            text: 'Name',
            isHidden: false,
            showTooltipText: 'Show Names', hideTooltipText: 'Hide Names'
        }
      ]
    },
    {
      id: 4,
      header: "Job code",
      key: "jobCodes",
      extraDetails: [
        {
            key: 'code',
            text: 'Code',
            isHidden: false,
            showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
        },
        {
            key: 'name',
            text: 'Name',
            isHidden: false,
            showTooltipText: 'Show Names', hideTooltipText: 'Hide Names'
        }
      ]
    },
    {
      id: 5,
      header: "Pay type",
      key: "payTypes",
      extraDetails: [
        {
            key: 'code',
            text: 'Code',
            isHidden: false,
            showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
        },
        {
            key: 'name',
            text: 'Name',
            isHidden: false,
            showTooltipText: 'Show Names', hideTooltipText: 'Hide Names'
        }
      ]
    }
  ];

  const sortFactors = [
    {
      id: 'code',
      text: 'Code'
    },
    {
      id: 'name',
      text: 'Name'
    }
  ];

  const sortDirections = [
    {
      id: 'ascending',
      text: 'Ascending'
    },
    {
      id: 'descending',
      text: 'Descending'
    },
    {
      id: 'hierarchical',
      text: 'Hierarchical'
    }
  ];

  const toolBar = {
    hideGroups: true,
    hideUnselected: false,
  };

  const [headersState, setHeadersState] = useState({ headers });
  const [paginationState, setPaginationState] = useState({ page: 1, pageSize: 20 });
  const [totalRows, setTotalRows] = useState(0);
  const [rowsState, setRowsState] = useState([]);
  const [searchState, setSearchState] = useState('');
  const [tableKey, setTableKey] = useState('Filter-table-0000000000');
  const [toolBarState, setToolBarState] = useState(toolBar);

  const dispatch = useDispatch();

  const masterData = useSelector(state => state.MasterData);
  const filters = useSelector(state => state.BudgetVersions.Filters[filterOption.stateId]);
  const groupFilters = useSelector(state => state.BudgetVersions.GroupsFilters[filterOption.stateId]);
  const options = useSelector(state => state.BudgetVersions.FilterOptions[filterOption.stateId]);
  const sortFactor =  useSelector(state => state.BudgetVersions.Sort[filterOption.stateId]?.sortFactor);
  const sortDirection =  useSelector(state => state.BudgetVersions.Sort[filterOption.stateId]?.sortDirection);

  // fetch the proper rows depending on the type of filter
  useEffect(() => {

    // get list of options after optionally excluding unselected items
    const selectedOptions = options ? options.filter(option => {
      return !toolBarState.hideUnselected || !filters.includes(option.id)
    }) : [];

    // get list of options after applying search text
    const searchedOptions = selectedOptions.filter(option => testMatch(option, searchState));
    let updatedData = searchedOptions.map((item) => {
      return {
        ...item,
        actualID : item.id
      }
    })

    let rowsData=[];
    if(!toolBarState.hideGroups)
    {
      let relationData = getDimensionRelationData();
      rowsData = getGroupedData(updatedData , relationData);
    }else
    {
      rowsData = getNonGroupedData(updatedData);
    }
  
    // if((filterOption.value === 'department' 
        // //|| filterOption.value === 'glAccounts'
        // ) 
        // && !toolBarState.hideGroups)
        // {
        //   rowsData = rowsData[0] ?  rowsData[0].childRows : [];
        // }

    // searchedOptions.forEach(searchedRow => {
    //   const parentId = relationships?.find(relationship => {
    //     return relationship.model === filterOption.relationshipModel && relationship.childid === searchedRow.id
    //   })?.parentid;
    //   const newElement =  {
    //     ...searchedRow,
    //     actualID : searchedRow.id,
    //     id: `row-${searchedRow.id}`,
    //     code: searchedRow.code,
    //     name: searchedRow.name,
    //     isGroup: false,
    //     isSelected: !filters.includes(searchedRow.id)        
    //   }
    //   if (!toolBarState.hideGroups && parentId) {
    //     let parent = rowsData.length > 0 && rowsData[0] ? rowsData.find(row => row.id === `row-${parentId}`) : undefined;
    //     if (!parent) {
    //       // if we found a parent relationship, see if there is a master record it
    //       // if so, add a new parent with the new element as a child row
    //       // otherwise, just add the new element to the array
    //       const parentMaster = masterData[filterOption.masterId].find(data => data[filterOption.idProperty] === parentId);
    //       if (parentMaster) {
    //         parent = {
    //           actualID : parentMaster[filterOption.idProperty],
    //           id: `row-${parentMaster[filterOption.idProperty]}`,
    //           code: parentMaster[filterOption.codeProperty],
    //           name: parentMaster[filterOption.nameProperty],
    //           isGroup: true,
    //           childRows: [newElement]
    //         };
    //         rowsData.push(parent);
    //       } else {
    //         rowsData.push(newElement);
    //       }
    //     } else {
    //       parent.childRows.push(newElement);
    //     }
    //   } else {
    //     rowsData.push(newElement);
    //   }
    // });

    // let rowsData2 = rowsData;
    // debugger
    // rowsData = [];
    // rowsData2.forEach(searchedRow => {
    //   const parentId = relationships?.find(relationship => {
    //     return relationship.model === filterOption.relationshipModel && relationship.childid === searchedRow.actualID
    //   })?.parentid;
    //   const newElement =  {
    //     ...searchedRow,
    //     id: `row-${searchedRow.id}`,
    //     code: searchedRow.code,
    //     name: searchedRow.name,
    //     isGroup: false,
    //     isSelected: !filters.includes(searchedRow.id)
        
    //   }
    //   if (!toolBarState.hideGroups && parentId) {
    //     let parent = rowsData.length > 0 && rowsData[0] ? rowsData.find(row => row.id === `row-${parentId}`) : undefined;
    //     if (!parent) {
    //       // if we found a parent relationship, see if there is a master record it
    //       // if so, add a new parent with the new element as a child row
    //       // otherwise, just add the new element to the array
    //       const parentMaster = masterData[filterOption.masterId].find(data => data[filterOption.idProperty] === parentId);
    //       if (parentMaster) {
    //         parent = {
    //           id: `row-${parentMaster[filterOption.idProperty]}`,
    //           code: parentMaster[filterOption.codeProperty],
    //           name: parentMaster[filterOption.nameProperty],
    //           isGroup: true,
    //           childRows: [newElement]
    //         };
    //         rowsData.push(parent);
    //       } else {
    //         rowsData.push(newElement);
    //       }
    //     } else {
    //       parent.childRows.push(newElement);
    //     }
    //   } else {
    //     rowsData.push(newElement);
    //   }
    // });

    if(toolBarState.hideGroups)
    {
      // In Hide Group UNCHECKED case individual members are displayed, so by default all are SELECTED,  
      //dispatch(removeAllBudgetVersionsFilters(filterOption.stateId));  
      handleSelectAll(rowsData , true);
    }
    else
    {
      // In Hide Group CHECKED case Groups are displayed, so by default all are UN-SELECTED
      //dispatch(addAllBudgetVersionsFilters(filterOption.stateId)); 
      handleSelectAll(rowsData , false);
    }
    
    // set the total number of visible rows
    setTotalRows(rowsData.length);

    const startIndex = (paginationState.page - 1) * paginationState.pageSize;
    const pageRows = rowsData.slice(startIndex, startIndex + paginationState.pageSize);

    setRowsState(pageRows);

  }, [options, paginationState, searchState, toolBarState]);

  useEffect(() => {
  // Reset group filter on every render.
  //dispatch(removeAllBudgetVersionsFiltersGroups(filterOption.stateId));
  } , [])
  const getDimensionRelationData = () => {
    if(filterOption.relationshipModel === "ENTITY")
    {
      return dimensionRelationData.entity;
    }else if(filterOption.relationshipModel === "DEPARTMENT")
    {
      return dimensionRelationData.department;
    }
    else if(filterOption.relationshipModel === "STATISTICSCODE")
    {
      return dimensionRelationData.statistics;
    }
    else if(filterOption.relationshipModel === "GLACCOUNT")
    {
      return dimensionRelationData.glAccount;
    }
    else if(filterOption.relationshipModel === "JOBCODE")
    {
      return dimensionRelationData.jobcode;
    }
    else if(filterOption.relationshipModel === "PAYTYPE")
    {
      return dimensionRelationData.payTypes;
    }  
  }

  const getNonGroupedData = (rows) => {
    let rowsData = [];
    rows.forEach(searchedRow => {
      const newElement =  {
        ...searchedRow,
        actualID : searchedRow.actualID,
        id: `row-${searchedRow.id}`,
        code: searchedRow.code,
        name: searchedRow.name,
        //isGroup: false,
        isSelected: !filters.includes(searchedRow.id),
        dept : 0, 
        }

        rowsData.push(newElement);
    });
    return rowsData;
  }

  const getGroupedData = (rows ,relationData, dept = 5) => 
  {
      let rowsData = [];
      rows.forEach(searchedRow => {
         // Update this code to handle Multiple Parent of a same 
        const parentObjects = relationData?.filter(relationship => {
          return relationship.childid === searchedRow.actualID && relationship.relation === "GROUP"  })
          if(parentObjects.length > 0)
          {
          parentObjects.forEach((parentObject) => {
          let parentId = parentObject.parentid;
          const newElement =  {
          ...searchedRow,
          actualID : searchedRow.actualID,
          id: `row-${searchedRow.id}`,
          code: searchedRow.code,
          name: searchedRow.name,
          //isGroup: false,
          isSelected: !filters.includes(searchedRow.id),
          dept : dept,
          parentId : parentId   
          }
         if (!toolBarState.hideGroups && parentId) {
            let parent = rowsData.length > 0 && rowsData[0] ? rowsData.find(row => row.actualID === parentId) : undefined;
            if (!parent) {
              // if we found a parent relationship, see if there is a master record it
              // if so, add a new parent with the new element as a child row
              // otherwise, just add the new element to the array
              const parentMaster = masterData[filterOption.masterId].find(data => data[filterOption.idProperty] === parentId );
                // && (data.isGroup === true || data.isHierarchy === true )
               
              if (parentMaster) {
                  if(parentMaster.isGroup === true || parentMaster.isHierarchy === true)
                  {
                    parent = {
                      actualID : parentMaster[filterOption.idProperty],
                      id: `row-${parentMaster[filterOption.idProperty]}`,
                      code: parentMaster[filterOption.codeProperty],
                      name: parentMaster[filterOption.nameProperty],
                      isGroup: true,
                      childRows: [newElement],
                      dept : dept
                    };
                  rowsData.push(parent);
                }
              } else {
                rowsData.push(newElement);
              }
            } else {
              parent.childRows.push(newElement);
            }
          } else {
            rowsData.push(newElement);
          }
          });
          }else
          {
            const newElement =  {
              ...searchedRow,
              actualID : searchedRow.actualID,
              id: `row-${searchedRow.id}`,
              code: searchedRow.code,
              name: searchedRow.name,
              //isGroup: false,
              isSelected: !filters.includes(searchedRow.id),
              dept : dept, 
              }
              rowsData.push(newElement);
          }
      });
      
      debugger;
      //Merge Child of same parents, Parents are only available in case of grouping. 
      let updatedrowsData = rowsData;
      if(!toolBarState.hideGroups)
      {
        updatedrowsData = mergeSameParentItem(rowsData);
      }
      if(dept > 0 && !toolBarState.hideGroups)
      {
        return getGroupedData(updatedrowsData ,relationData , dept-1);
      }else
      {
        return updatedrowsData;
      }
      
  }
  const mergeSameParentItem = (rowsData , dept = 10) => {
    
    let updatedrowsData = [];

    rowsData.forEach((item) => {
      let itemFindIndex = updatedrowsData.findIndex((row) => row.actualID === item.actualID);
      if(itemFindIndex !== -1) // item found
      {
        let itemObj =  updatedrowsData[itemFindIndex];
        let itemObjChild = itemObj.childRows;
        itemObjChild = [...itemObjChild , ...item.childRows];
        itemObj["childRows"] = [...itemObjChild];
        updatedrowsData[itemFindIndex] = itemObj;
      }else
      {
        updatedrowsData.push(item);
      }
    });

    
    if(dept > 0 && updatedrowsData[0]?.childRows)
    {

      updatedrowsData[0].childRows = mergeSameParentItem( updatedrowsData[0].childRows , dept-1);
    }

    return updatedrowsData;
  }

  const onHeaderIconClick = (e, headerIndex, detailIndex) => {
    e.preventDefault();
    if (headersState.headers[headerIndex].extraDetails.filter(item => item.isHidden === false).length == 1 && !headersState.headers[headerIndex].extraDetails[detailIndex].isHidden) {
        return;
    }
    var stateCopy = { ...headersState };
    stateCopy.headers = stateCopy.headers.slice();
    stateCopy.headers[headerIndex] = { ...stateCopy.headers[headerIndex] };
    stateCopy.headers[headerIndex].extraDetails = stateCopy.headers[headerIndex].extraDetails.slice();
    stateCopy.headers[headerIndex].extraDetails[detailIndex] = { ...stateCopy.headers[headerIndex].extraDetails[detailIndex] };
    stateCopy.headers[headerIndex].extraDetails[detailIndex].isHidden = !stateCopy.headers[headerIndex].extraDetails[detailIndex].isHidden;
    setHeadersState(stateCopy);
  }
  
  const testMatch = (row, inputValue) => {

    const code = row?.code?.toString();
    const name = row?.name?.toString();

    return (
      code?.toLowerCase().includes(inputValue.toLowerCase()) ||
      name?.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const handleSearch = (e) => {
    const inputValue = e.target.value;

    // Page must be set to page 1 if the search text changes
    // Otherwise, we could be on a page that no longer exists after adding
    // a character to the search string, which is confusing for the user
    setPaginationState({ 
      ...paginationState,
      page: 1 
    });

    // set search state
    // we will perform actual filtering in useEffect
    setSearchState(inputValue);
  }

  useImperativeHandle(ref, () => ({
    reset: () => {
      // HACK: ensure that table updates on cancel
      const date = new Date();
      setTableKey(`Filter-Table-${date.getTime()}`);

      // reset the sort
      dispatch(setBudgetVersionsSortFactor(filterOption.stateId, 'code'));
      dispatch(setBudgetVersionsSortDirection(filterOption.stateId, 'ascending'));
    }
  }));

  const getBlankRows = (count) => {

    const blankRows = [];
    for (let i = 0; i < count; i++) {
      blankRows.push(
        <TableRow className={'filter-table-blank-row'}>
          <TableCell colSpan='2' className={'filter-table-blank-row-cell'} />
        </TableRow>
      );
    };

    return blankRows;
  };

  const getCellData = (row, header) => {
    let cellContentList = [];
    header.extraDetails.forEach(detail => {
        if (row[detail.key] && !detail.isHidden) {
            cellContentList.push(row[detail.key]);
        }
    });
    
    return cellContentList.join(' ');
  }

  const getRow = (row, rowIndexArray, isParentExpanded) => {
    return <>
        {rowIndexArray.length ? getTableRow(row, rowIndexArray, isParentExpanded) : ""}
        {isParentExpanded && row.childRows?.map((nextLevelRow, nextLevelRowIndex) =>
            getRow(nextLevelRow, [...rowIndexArray, nextLevelRowIndex], row.isExpanded))}
      </>
  }

  const getTableRow = (row, rowIndexArray, isParentExpanded) => {
    
    const chevronProps = { onClick: (e) => toggleRows(rowIndexArray), className: 'filter-table-row-chevron' };
    const hasChild = row.childRows?.length ? true : false;
    const isChecked = getRowCheckedStatus(row);
    const isGroupChecked = getGroupRowCheckedStatus(row);
    const isIndeterminate = getRowIndeterminateStatus(row);
    return (
      <TableRow className={`${hasChild ? 'bold' : ''} ${isParentExpanded ? '' : 'filter-table-collapsed-row'} filter-table-row`} 
      onClick={(e) => selectRow(e, row)} 
      key={row.id}>
        <>
          <TableCell 
          className='filter-include-checkbox'
          >
            <Checkbox checked={isChecked} indeterminate={isIndeterminate} onClick={(e) => handleSelection(e, row)} />
          </TableCell>
          {
          headersState.headers.filter(header => header.key === filterOption.value).map(header => {
              return (
                <>                
          
                <TableCell key={row.id + header.key} style={{paddingLeft: !hasChild ? row.dept * 20 : filterOption.value === 'department' ? (row.dept-2) * 20 : row.dept * 20}}>
                  {hasChild ? row.isExpanded ?
                      <ChevronUp16 {...chevronProps} /> :
                      <ChevronDown16 {...chevronProps} /> : ''}
                  
                  { hasChild ? isGroupChecked ? <CheckmarkFilled16 style={{marginRight : '5px'}} onClick={(e) => {handleSelectionForGroups(row , false)}}/> 
                    : <CircleDash16 style={{marginRight : '5px'}} onClick={(e) => {handleSelectionForGroups(row , true)}}/>
                    : null
                  }
                  {getCellData(row, header)}       
                </TableCell>
                </>
              );
            })}
        </>
      </TableRow>
    )
  }

  const getHeaderCheckedStatus = () => {
    if(!filters) {
      console.log(id);
    }
    return filters.length === 0
  }

  const getHeaderIndeterminateStatus = () => {
    let rows = [];
    rowsState.forEach(row => {
      if (row.childRows?.length > 0) {
        row.childRows.forEach(child => {
          rows.push(child);
        })
      } else {
        rows.push(row);
      }
    });
    if (rows?.length > 0) {
      // get number of selected rows
      const selectedRows = rows.filter(row => {
        //const rowId = parseInt(row.id.replace('row-', ''));
        const rowId = row.actualID;
        return !filters.includes(rowId);
      });
      // we only want to return indeterminate if we have 1 or more
      // selected rows but less than the total number of rows
      return selectedRows.length > 0 && selectedRows.length < rows.length;
    } else {
      return false;
    }
  }

  const getRowCheckedStatus = (row) => {
    if (row?.childRows?.length > 0) {
      const selectedRows = row.childRows.filter(child => {
        //const childId = parseInt(child.id.replace('row-', ''));
        const childId = child.actualID;
        return !filters.includes(childId);
      });
      return row.childRows.length === selectedRows.length;
    } else {
      //const rowId = parseInt(row.id.replace('row-', ''));
      const rowId = row.actualID;
      return !filters.includes(rowId);
    }
  }

  const getGroupRowCheckedStatus = (row) => {

    return groupFilters.find((item) => item.actualID === row.actualID);
  }

  const getRowIndeterminateStatus = (row) => {
    if (row?.childRows?.length > 0) {
      // get number of selected child rows
      const selectedRows = row.childRows.filter(child => {
        //const childId = parseInt(child.id.replace('row-', ''));
        const childId = child.actualID;
        return !filters.includes(childId);
      });
      // we only want to return indeterminate if we have 1 or more
      // selected rows but less than the total number of rows
      return selectedRows.length > 0 && selectedRows.length < row.childRows.length;
    } else {
      return false;
    }
  }

  const selectHeader = (e, rows) => {
    const checkbox = e.target.parentElement.querySelector('input');
    if (checkbox) {
      handleSelectAll(rows, !checkbox.checked);
    }
  }

  const selectRow = (e, row) => {
    const checkbox = e.target.parentElement.querySelector('input');
    if (checkbox) {
        handleRowSelect(row, !checkbox.checked);
    }
  }

  const toggleRows = (rowIndexArray) => {
    const rowsClone = JSON.parse(JSON.stringify(rowsState));
    let rowRef = { childRows: rowsClone };
    rowIndexArray.forEach(index => {
        rowRef = rowRef.childRows[index];
    });
    rowRef.isExpanded = rowRef.isExpanded ? false : true;
    setRowsState(rowsClone);
  }

  const handleCheckBox = (e, stateName) => {
    const toolBar = {
        ...toolBarState,
        [stateName]: e.target.checked
    }

    // Page must be set to page 1 if the toolbar options are unselected
    // Otherwise, we would not know what entries should belong on the page
    // after the hide unselected or hide groups options are selected without
    // an expensive calculation for the removed items PER PAGE. This would
    // be prohibitively expensive and would render the control unusable.
    setPaginationState({ 
      ...paginationState,
      page: 1 
    });

    setToolBarState(toolBar);
  }

  const handleSelectAll = (rows, checked) => {

    if (!checked) {
      dispatch(addAllBudgetVersionsFilters(filterOption.stateId));
    } else {
      dispatch(removeAllBudgetVersionsFilters(filterOption.stateId));
    }

    // handle selection ALL in case of grouping. We send only top level row to start the reccursive loop of handleRowSelect()
    if(rows.length > 0 && !toolBarState.hideGroups)
    {
      handleRowSelect(rows[0], checked)
    }else if(toolBarState.hideGroups)
    {
      // Case run when no grouping is applied.
    rows.forEach(row => {
      handleRowSelect(row, checked);
    });
    }
  }

  const handleSelection = (e, row) => {
    handleRowSelect(row, e.target.checked);
  }

  const handlePagination = (e) => {
    setPaginationState(e);
  }

  const handleSelectionForGroups = (row, checked) => {    
    const rowId = row.actualID;
    if (checked) {
      // Will show/Filter only these groups which is added in this store state, Opposite of member item filter. Because by default groups are unChecked.
      dispatch(addBudgetVersionsFilterGroup(filterOption.stateId, row));
       } else {
      dispatch(removeBudgetVersionsFilterGroup(filterOption.stateId, row));
     }
  }

  const handleRowSelect = (row, checked) => {
    
    const rowId = row.actualID;
          // if row is deselected, add it to the list
          // if it has been reselected, remove it
     if (!checked) {
      dispatch(addBudgetVersionsFilter(filterOption.stateId, rowId));
       } else {
      dispatch(removeBudgetVersionsFilter(filterOption.stateId, rowId));
     }

    if (row.isGroup) {
      //handleRowSelect(row, checked);
      row.childRows.forEach(childRow => {
        handleRowSelect(childRow, checked);
      });
    } else {
      // strip off the 'row-' prefix
      //const rowId = parseInt(row.id.replace('row-', ''));
      //const rowId = row.actualID;
          // if row is deselected, add it to the list
          // if it has been reselected, remove it
      // if (!checked) {
      //   dispatch(addBudgetVersionsFilter(filterOption.stateId, rowId));
      // } else {
      //   dispatch(removeBudgetVersionsFilter(filterOption.stateId, rowId));
      // }
    }
  }

  const handleSortFactorChange = (sortFactor) => {
    dispatch(setBudgetVersionsSortFactor(filterOption.stateId, sortFactor.id));
  }

  const handleSortDirectionChange = (sortDirection) => {
    dispatch(setBudgetVersionsSortDirection(filterOption.stateId, sortDirection.id));
  }

  return (
    <>
      <div className={'filter-table'}>
        <h5 className={'filter-table-header'}>{`Filter by ${filterOption.tableHeader}`}</h5>
        <DataTable
            key={tableKey}
            rows={rowsState}
            headers={headersState.headers}
            pagination={true}
            render={({ rows, headers, getHeaderProps, getTableProps }) => (
              <TableContainer>
                <TableToolbar>
                  <TableToolbarContent className={'filter-table-toolbar-content'}>
                      <TableToolbarSearch onChange={handleSearch} />
                      <div>
                        <div className={'filter-table-toolbar-checkbox'}>
                          <Checkbox
                            id={`HideGroups-${id}-${filterOption}`}
                            checked={toolBarState.hideGroups}
                            labelText="Hide groups"
                            onClick={(e) => handleCheckBox(e, "hideGroups")}
                          />
                        </div>
                        <div className={'filter-table-toolbar-checkbox'}>
                          <Checkbox
                            id={`HideUnselected-${id}-${filterOption}`}
                            checked={toolBarState.hideUnselected}
                            labelText="Hide unselected"
                            onClick={(e) => handleCheckBox(e, "hideUnselected")}
                          />
                        </div>
                      </div>
                  </TableToolbarContent>
                </TableToolbar>
                  <Table size='compact' className={'.bx--data-table--compact filter-table-table'} {...getTableProps}>
                      <TableHead>
                        <TableRow onClick={(e) => selectHeader(e, rows)}>
                          {
                            headers.map((header, headerIndex) => (
                              <TableHeader className={'filter-table-header-header'} {...getHeaderProps({ header })} colSpan="2">
                                <div className={'filter-table-header-checkbox'}>
                                  <Checkbox onClick={(e) => handleSelectAll(rows, e.target.checked)} checked={getHeaderCheckedStatus()} indeterminate={getHeaderIndeterminateStatus()} />
                                </div>
                                <div className={'filter-table-header-content'}>
                                  <>{header.header} <br /></>
                                  {header.extraDetails && (
                                      header.extraDetails.map((detail, detailIndex) => {
                                          return (
                                              <>
                                                  {detail.isHidden ?
                                                      <TooltipIcon className={'filter-table-icon-container'} direction='bottom' align='start' tooltipText={detail.showTooltipText}>
                                                          <ChevronRight16 className={'filter-table-icon'} onClick={(e) => onHeaderIconClick(e, headerIndex, detailIndex)} />
                                                      </TooltipIcon> : <>
                                                          <TooltipIcon className={'filter-table-icon-container'} direction='bottom' align='start' tooltipText={detail.hideTooltipText}>
                                                              <ChevronLeft16 className={'filter-table-icon'} onClick={(e) => onHeaderIconClick(e, headerIndex, detailIndex)} />
                                                          </TooltipIcon> {detail.text} </>}
                                              </>)
                                      })
                                  )}
                                  </div>
                              </TableHeader>
                              )).filter(header => header.key === filterOption.value)
                            }
                          </TableRow>
                        </TableHead>
                      <TableBody>
                      {
                        rowsState.length ? getRow({ childRows: rowsState, isExpanded: true }, [], true) : ""
                      }
                      {
                        // if the total number of rows is less than the page size
                        // add blank rows to fill up the grid.
                        getBlankRows(paginationState.pageSize - totalRows)
                      }
                    </TableBody>
                  </Table>
                  <Pagination
                      id="paginationBar"
                      pageSizes={[20, 40, 60, 80, 100, 500, 1000]}
                      totalItems={totalRows}
                      onChange={handlePagination}
                  />
              </TableContainer>
            )}
          />
      </div>
      <div className={'sort-options'}>
        <h6 className={'sort-header'}>{filterOption.sortHeader}</h6>
        <div className="bx--row">
					<div className="bx--col-lg-7 sort-option">
            <Dropdown
              id="sortFactor"
              items={sortFactors}
              itemToString={item => (item ? item.text : '')}
              onChange={(e) => handleSortFactorChange(e.selectedItem)}
              selectedItem={sortFactors.find(factor => factor.id === sortFactor)}
              titleText="Factor"
              value={item => (item ? item.id : '')}
            />
          </div>
        </div>
        <div className="bx--row">
          <div className={'bx--col-lg-7 sort-option'}>
            <Dropdown
              id="sortDirection"
              items={sortDirections}
              itemToString={item => (item ? item.text : '')}
              onChange={(e) => handleSortDirectionChange(e.selectedItem)}
              selectedItem={sortDirections.find(dir => dir.id === sortDirection)}
              titleText="Direction"
              value={item => (item ? item.id : '')}
            />
          </div>
          <div className={'bx--col-lg-5 sort-option-icon'}>
            <TooltipIcon 
              align="center"
              direction="right"
              tooltipText={
                <div className="sort-direction-tooltip-text">
                  <div>Hierarchical: Ascending sort that keeps items in groups.</div><br />
                  <div>Ascending (1 to 10, A to Z): Ascending sort that removes items from groups.</div><br />
                  <div>Descending 10 to 1, Z to A): Descending sort that removes items from groups.</div>
                </div>
              }
            >
              <Information16 className="textbox-icon" />
            </TooltipIcon>
          </div>
        </div>
      </div>
    </>
  )
});

export default FilterTable;