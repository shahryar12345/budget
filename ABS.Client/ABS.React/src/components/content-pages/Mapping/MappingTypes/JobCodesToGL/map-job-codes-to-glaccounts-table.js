import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox, DataTable, Pagination, TooltipIcon, Button, Search } from 'carbon-components-react';
import { ChevronDown16, ChevronLeft16, ChevronRight16, ChevronUp16, Close16, Edit16, Play16, WarningAlt16 } from '@carbon/icons-react';
import SingleSelectModal from "../../../../shared/single-select/single-select-with-modal";
import { Add20, Subtract20, ArrowUp16, ArrowDown16, } from "@carbon/icons-react";
import { swapArray } from "../../../../../helpers/array.helper";
import { getJobCodeToGLAccountByEntity } from "../../../../../services/mapping-service.js";
import { getApiResponseAsync } from "../../../../../services/api/apiCallerGet";
import {
  getDepartmentHierarchyGroupedData,
  GetSortedDepartmentByHierarchyGroupe,
  GetSortedGLAccountsByGroups,
  getGLAccountHierarchyGroupedData,
  GetSortedJobCodeByGroups,
  getJobCodeGroupedData,
  GetSortedPayTypeByGroups,
  getPayTypeGroupedData
} from "../../../../../helpers/DataTransform/transformData";

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableToolbar,
  TableToolbarContent,
  TableToolbarAction
} = DataTable;

const MapJobCodesToGLAccountsTable = ({ entity, handleChange, handleDelete, isEdit }) => {
  const [localState, setLocalState] = useState({ mappingTable: [], deletedItems: [] });
  const [apiResultState, setApiResultState] = useState({ apiResult: [] });
  const masterData = useSelector((state) => state.MasterData);

  useEffect(() => {
    if (entity) {
      // are there mappingTable entries for the this entity?
      const entityMapping = localState.mappingTable.find(mapping => { return mapping.entityId === entity.entityID });

      if (!entityMapping) {
        // get data from the database for this entity
        getJobCodeToGLAccountByEntity(entity.entityID).then(result => {
          setApiResultState({ apiResult: result.data });
        })
      }
      handleChange([...localState.mappingTable], false);
    }
  }, [masterData, entity]);

  useEffect(() => {
    if (apiResultState.apiResult.length > 0) {
      setLocalState({ ...localState, mappingTable: processMappingData(apiResultState.apiResult) })
    }
    else {
      setLocalState({ ...localState, mappingTable: getInitialMappingData() })
    }
  }, [apiResultState.apiResult]);

  const processMappingData = (mappingData) => {
    const newMappingData = mappingData.map(data => {
      return {
        id: data.staffingGLMappingID,
        entityId: data.entity.entityID,
        departmentId: data.department?.departmentID,
        jobCodeId: data.jobCode?.jobCodeID,
        payTypeId: data.payType?.payTypeID,
        glAccountId: data.glAccount?.glAccountID
      }
    });

    return newMappingData;
  }

  const getEmptyRow = () => {
    return {
      entityId: entity?.entityID,
      departmentId: 0,
      jobCodeId: 0,
      payTypeId: 0,
      glAccountId: 0
    }
  }

  const getInitialMappingData = () => {
    return [getEmptyRow()];
  }

  const handleAdd = () => {
    if (isEdit) {
      const mappingTable = [...localState.mappingTable];
      handleChange([...localState.mappingTable], false);
      const newRow = getEmptyRow();
      mappingTable.push(newRow);
      setLocalState({ ...localState, mappingTable });
    }
  }

  const handleRemove = index => {
    let mappingTable = [...localState.mappingTable];
    const mappingId = mappingTable[index]?.id;
    mappingTable.splice(index, 1);
    // if the current item has an id, add it to the list of deleted items
    if (mappingId) handleDelete(mappingId);
    setLocalState({ ...localState, mappingTable });
    handleChange(mappingTable, buttonsValidator(mappingTable));
  }

  const handleMoveIconClick = (e, direction, index) => {
    const x = "";
    let mappingTable = [...localState.mappingTable];
    if (direction === "up") {
      mappingTable = swapArray(
        mappingTable,
        index,
        index - 1
      );
    }
    else {
      mappingTable = swapArray(
        mappingTable,
        index,
        index + 1
      );
    }

    setLocalState({ ...localState, mappingTable });
  }

  const buttonsValidator = (mappingTable = localState.mappingTable) => {
    let checkIsValid = true;
    mappingTable.forEach((item => {
      if (!isValid(item)) {
        checkIsValid = false;
      }
    }));
    return checkIsValid;
  }

  const isValid = (row) => {
    return row.departmentId && row.jobCodeId && row.payTypeId && row.glAccountId;
  }

  const onDepartmentChange = (e, index) => {
    const row = localState.mappingTable[index];
    row.departmentId = e.selectedItem?.departmentID;
    handleChange(localState.mappingTable, buttonsValidator(localState.mappingTable));
  }

  const onJobCodeChange = (e, index) => {
    const row = localState.mappingTable[index];
    row.jobCodeId = e.selectedItem?.jobCodeID;
    handleChange(localState.mappingTable, buttonsValidator(localState.mappingTable));
  }

  const onPayTypeChange = (e, index) => {
    const row = localState.mappingTable[index];
    row.payTypeId = e.selectedItem?.payTypeID;
    handleChange(localState.mappingTable, buttonsValidator(localState.mappingTable));
  }

  const onGLAccountChange = (e, index) => {
    const row = localState.mappingTable[index];
    row.glAccountId = e.selectedItem?.glAccountID;
    handleChange(localState.mappingTable, buttonsValidator(localState.mappingTable));
  }

  const getDepartmentSelectedItem = (e, index) => {
    if (localState.mappingTable?.length > index) {
      const result = masterData.Departments.find(department => { return department.departmentID === localState.mappingTable[index].departmentId });
      if (result) {
        return result
      }
      return null;
    }
  }

  const getJobCodeSelectedItem = (e, index) => {
    if (localState.mappingTable?.length > index) {
      const result = masterData.JobCodes.find(jobCode => { return jobCode.jobCodeID === localState.mappingTable[index].jobCodeId });
      if (result) {
        return result;
      }

      return null;
    }
  }

  const getPayTypeSelectedItem = (e, index) => {
    if (localState.mappingTable?.length > index) {
      const result = masterData.PayTypes.find(payType => { return payType.payTypeID === localState.mappingTable[index].payTypeId });
      if (result) {
        return result;
      }

      return null;
    }
  }

  const getGeneralLedgerSelectedItem = (e, index) => {
    if (localState.mappingTable?.length > index) {
      const result = masterData.GLAccounts.find(account => { return account.glAccountID === localState.mappingTable[index].glAccountId });
      if (result) {
        return result;
      }

      return null;
    }
  }

  const [departmentGroupGridDataStates, setDepartmentGroupGridDataStates] = useState([]);
  const [jobCodeGridDataStates, setjobCodeGridDataStates] = useState([]);
  const [payTypeGridDataStates, setpayTypeGridDataStates] = useState([]);
  const [glAccountGridDataStates, setglAccountGridDataStates] = useState([]);


  useEffect(() => {
    if (masterData.Departments.length) {
      getApiResponseAsync("DEPARTMENTSRELATIONSHIPS").then((departmentRelation) => {
        getDepartmentHierarchyGroupedData(masterData.Departments, departmentRelation).then((response) => {
          setDepartmentGroupGridDataStates(response)
        });
      });
    }
  }, [masterData.Departments]);
  useEffect(() => {
    if (masterData.JobCodes.length) {
      getApiResponseAsync("JOBCODERELATIONSHIPS").then((jobCoderelationData) => {
        getJobCodeGroupedData(masterData.JobCodes, jobCoderelationData).then((response) => {
          setjobCodeGridDataStates(response);
        });
      });
    }
  }, [masterData.JobCodes]);

  useEffect(() => {
    if (masterData.PayTypes.length) {
      getApiResponseAsync("PAYTYPESRELATIONSHIPS").then((payTyperelationData) => {
        getPayTypeGroupedData(masterData.PayTypes, payTyperelationData).then((response) => {
          setpayTypeGridDataStates(response)
        });
      });
    }
  }, [masterData.PayTypes]);

  useEffect(() => {
    if (masterData.GLAccounts.length) {
      getApiResponseAsync("GLACCOUNTSRELATIONSHIPS").then((glRelationData) => {
        getGLAccountHierarchyGroupedData(masterData.GLAccounts, glRelationData).then((response) => {
          setglAccountGridDataStates(response)
        });
      });
    }
  }, [masterData.GLAccounts]);

  return (
    <div>
      <DataTable
        pagination={true}
        rows={[]}
        headers={[]}
        render={({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer className={`statistics-table-container`}>
            {/* <TableToolbarContent style={{ justifyContent: 'flex-end' }}> */}
            {/* <Search className={"mapping-search"} placeHolderText="Search" 
              //onChange={handleGridSearch} 
            /> */}
            {/* </TableToolbarContent> */}
            {/* <Table size='compact' className='statistics-table'> */}
            <Table size='compact' {...getTableProps()} className='mapping-table'>
              <TableHead>
                <TableRow>
                  <TableHeader className={`statistics-table-header statistics-combobox-header`}>
                  </TableHeader>
                  <TableHeader className={`statistics-table-header statistics-combobox-header`}>
                    Department
                </TableHeader>
                  <TableHeader className={`statistics-table-header statistics-combobox-header`}>
                    Job code
                </TableHeader>
                  <TableHeader className={`statistics-table-header statistics-combobox-header`}>
                    Pay type
                </TableHeader>
                  <TableHeader className={`statistics-table-header statistics-combobox-header`}>
                    General ledger account
                </TableHeader>
                  <TableHeader className={`statistics-table-header statistics-combobox-header`}>
                  </TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {localState.mappingTable.map((row, index) => {
                  return (
                    <TableRow>
                      <TableCell>
                        {index > 0 ?
                          <TooltipIcon direction="top" tooltipText="Move Up." align="start">
                            <ArrowUp16
                              className={"title-icon"}
                              onClick={(e) => {
                                handleMoveIconClick(e, "up", index);
                              }} />
                          </TooltipIcon>
                          : ''}
                        {index < localState.mappingTable.length - 1 ?
                          <TooltipIcon direction="top" tooltipText="Move Down." align="start">
                            <ArrowDown16
                              className={"title-icon"}
                              onClick={(e) => {
                                handleMoveIconClick(e, "down", index);
                              }} />
                          </TooltipIcon>
                          : ''}
                      </TableCell>
                      <TableCell>
                        {<SingleSelectModal
                          id={"mapping-department-model-" + index.toString()}
                          ariaLabel="Department"
                          data={GetSortedDepartmentByHierarchyGroupe(masterData.Departments)}
                          gridData={departmentGroupGridDataStates}
                          name="Department"
                          itemToString={(item) => (item ? item.departmentCode + " " + item.departmentName : "")}
                          itemToElement={(item) => item.isGroup ? <span> <strong> {"*"} {item.departmentCode + " " + item.departmentName}</strong></span> : <span> {item.departmentCode + " " + item.departmentName}</span>}
                          hideGroupsToggle={true}
                          hideGroups={false}
                          isGroupedData={true}
                          onChange={e => { onDepartmentChange(e, index) }}
                          selectedItem={e => getDepartmentSelectedItem(e, index)}
                          className="inflation-section-dropdown"
                          isEdit={isEdit} />
                        }
                      </TableCell>
                      <TableCell>
                        {masterData.JobCodes?.length > 0 ? <SingleSelectModal
                          id={"raises-job-code-model-" + index.toString()}
                          ariaLabel="Job code"
                          data={GetSortedJobCodeByGroups(masterData.JobCodes)}
                          gridData={jobCodeGridDataStates}
                          name="jobCode"
                          modalHeading="Job code"
                          itemToString={(item) => (item ? item.jobCodeCode + " " + item.jobCodeName : "")}
                          itemToElement={(item) => item.isGroup ? <span> <strong> {"*"} {item.jobCodeCode + " " + item.jobCodeName}</strong></span> : <span> {item.jobCodeCode + " " + item.jobCodeName}</span>}
                          hideGroupsToggle={true}
                          hideGroups={false}
                          isGroupedData={true}
                          onChange={e => { onJobCodeChange(e, index) }}
                          selectedItem={e => getJobCodeSelectedItem(e, index)}
                          className="raises-section-dropdown"
                          isEdit={isEdit} />
                          : ''}
                      </TableCell>
                      <TableCell>
                        {masterData.PayTypes?.length > 0 ? <SingleSelectModal
                          id={"raises-pay-type-model-" + index.toString()}
                          ariaLabel="Pay type"
                          data={GetSortedPayTypeByGroups(masterData.PayTypes)}
                          gridData={payTypeGridDataStates}
                          name="payType"
                          modalHeading="Pay type"
                          itemToString={(item) => (item ? item.payTypeCode + " " + item.payTypeName : "")}
                          itemToElement={(item) => item.isGroup ? <span> <strong> {"*"} {item.payTypeCode + " " + item.payTypeName}</strong></span> : <span> {item.payTypeCode + " " + item.payTypeName}</span>}
                          hideGroupsToggle={true}
                          hideGroups={false}
                          isGroupedData={true}
                          onChange={e => onPayTypeChange(e, index)}
                          selectedItem={e => getPayTypeSelectedItem(e, index)}
                          className="raises-section-dropdown"
                          isEdit={isEdit}
                        />
                          : ''}
                      </TableCell>
                      <TableCell>
                        <SingleSelectModal
                          id={"generalLedger-" + index.toString()}
                          ariaLabel="General ledger"
                          data={GetSortedGLAccountsByGroups(masterData.GLAccounts)}
                          gridData={glAccountGridDataStates}
                          placeholder="GL account"
                          name="GLAccounts"
                          modalHeading="GL account"
                          itemToString={(item) =>
                            item
                              ? item.glAccountCode + " " + item.glAccountName
                              : ""
                          }
                          light={false}
                          itemToElement={(item) =>
                            item.isGroup ? <span> <strong> {"*"} {item.glAccountCode + " " + item.glAccountName}</strong></span>
                              : <span> {item.glAccountCode + " " + item.glAccountName}</span>
                          }
                          hideGroupsToggle={true}
                          hideGroups={false}
                          isGroupedData={true}
                          onChange={e => { onGLAccountChange(e, index) }}
                          selectedItem={e => getGeneralLedgerSelectedItem(e, index)}
                          className="inflation-section-dropdown"
                          isEdit={isEdit}
                        />
                      </TableCell>
                      <TableCell>
                        {isEdit ? <TooltipIcon
                          direction="left"
                          tooltipText="Add a inflation row below."
                          align="start">
                          <Add20
                            onClick={(e) => {
                              handleAdd();
                            }} />
                        </TooltipIcon> : null}
                        {(isEdit && index > 0) ?
                          <TooltipIcon
                            direction="left"
                            tooltipText="Remove the inflation row below."
                            align="start">
                            <Subtract20
                              onClick={(e) => {
                                handleRemove(index);
                              }} />
                          </TooltipIcon>
                          : ''}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Pagination
              id="paginationBar"
              pageSizes={[10, 20, 30, 40, 50, 100]}
              totalItems={localState.mappingTable.length}
            />
          </TableContainer >
        )}
      />
    </div>
  );
}

export default MapJobCodesToGLAccountsTable;