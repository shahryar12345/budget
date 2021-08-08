import React, { useState, createRef } from "react";
import { DataTable, Pagination, TooltipIcon } from 'carbon-components-react';
import { useSelector } from "react-redux";
import { ChevronLeft16, ChevronRight16 } from '@carbon/icons-react';

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableToolbarContent,
  TableToolbarSearch
} = DataTable;

const RaisesTable = ({ budgetVersion, raisesTable }) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [localState, SetlocalState] = useState({ entityCodeHidden: false, entityNameHidden: false, departmentCodeHidden: false, departmentNameHidden: false, jobCodeCodeHidden: false, jobCodeNameHidden: false, payTypeCodeHidden: false, payTypeNameHidden: false });

  const masterData = useSelector((state) => state.MasterData);

  const getFiscalMonths = (budgetVersion) => {
    const result = [];

    const index = monthNames.findIndex(month => month.toUpperCase() === budgetVersion.fiscalStartMonthID);
    for (var i = index; i < monthNames.length; i++) {
      result.push(monthNames[i]);
    }
    if (index > 0) {
      for (var i = 0; i < index; i++) {
        result.push(monthNames[i]);
      }
    }

    return result;
  }

  const getFiscalYear = (month) => {
    const months = getFiscalMonths(budgetVersion);
    const currentMonthIndex = months.findIndex(m => m.toUpperCase() === month.toUpperCase());
    const decIndex = months.findIndex(m => m.toUpperCase() === "DEC");
    if (currentMonthIndex <= decIndex) {
      return budgetVersion.timeperiodobj.fiscalYearID.itemTypeCode;
    }
    else {
      return budgetVersion.timeperiodobj.fiscalYearEndID.itemTypeCode;
    }


  }

  return (
    <DataTable
      pagination={true}
      rows={raisesTable}
      headers={[]}
      render={({ rows, headers, getHeaderProps }) => (
        <TableContainer className={`raises-table-container`}>
          <TableToolbarContent style={{ justifyContent: 'flex-end' }}>
            <TableToolbarSearch placeHolderText="* represents zero or more characters, % represents single character" />
          </TableToolbarContent>
          <Table size='compact' className='statistics-table'>
            <TableHead>
              <TableRow>
                <TableHeader>
                  Entity
                  <br />
                  {localState.entityCodeHidden ? <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Show Codes">
                    <ChevronRight16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.entityNameHidden) { SetlocalState({ ...localState, entityCodeHidden: !localState.entityCodeHidden }) } }} />
                  </TooltipIcon> :
                    <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Hide Codes">
                      <ChevronLeft16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.entityNameHidden) { SetlocalState({ ...localState, entityCodeHidden: !localState.entityCodeHidden }) } }} />
                    </TooltipIcon>
                  }
                  Code
                  {localState.entityNameHidden ? <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Show Names">
                    <ChevronRight16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.entityCodeHidden) { SetlocalState({ ...localState, entityNameHidden: !localState.entityNameHidden }) } }} />
                  </TooltipIcon> :
                    <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Hide Names">
                      <ChevronLeft16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.entityCodeHidden) { SetlocalState({ ...localState, entityNameHidden: !localState.entityNameHidden }) } }} />
                    </TooltipIcon>
                  }
                  Name
                </TableHeader>
                <TableHeader>
                  Department
                  <br />
                  {localState.departmentCodeHidden ? <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Show Codes">
                    <ChevronRight16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.departmentNameHidden) { SetlocalState({ ...localState, departmentCodeHidden: !localState.departmentCodeHidden }) } }} />
                  </TooltipIcon> :
                    <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Hide Codes">
                      <ChevronLeft16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.departmentNameHidden) { SetlocalState({ ...localState, departmentCodeHidden: !localState.departmentCodeHidden }) } }} />
                    </TooltipIcon>
                  }
                  Code
                  {localState.departmentNameHidden ? <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Show Names">
                    <ChevronRight16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.departmentCodeHidden) { SetlocalState({ ...localState, departmentNameHidden: !localState.departmentNameHidden }) } }} />
                  </TooltipIcon> :
                    <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Hide Names">
                      <ChevronLeft16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.departmentCodeHidden) { SetlocalState({ ...localState, departmentNameHidden: !localState.departmentNameHidden }) } }} />
                    </TooltipIcon>
                  }
                  Name

                </TableHeader>
                <TableHeader>
                  Job code
                  <br />
                  {localState.jobCodeCodeHidden ? <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Show Codes">
                    <ChevronRight16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.jobCodeNameHidden) { SetlocalState({ ...localState, jobCodeCodeHidden: !localState.jobCodeCodeHidden }) } }} />
                  </TooltipIcon> :
                    <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Hide Codes">
                      <ChevronLeft16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.jobCodeNameHidden) { SetlocalState({ ...localState, jobCodeCodeHidden: !localState.jobCodeCodeHidden }) } }} />
                    </TooltipIcon>
                  }
                  Code
                  {localState.jobCodeNameHidden ? <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Show Names">
                    <ChevronRight16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.jobCodeCodeHidden) { SetlocalState({ ...localState, jobCodeNameHidden: !localState.jobCodeNameHidden }) } }} />
                  </TooltipIcon> :
                    <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Hide Names">
                      <ChevronLeft16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.jobCodeCodeHidden) { SetlocalState({ ...localState, jobCodeNameHidden: !localState.jobCodeNameHidden }) } }} />
                    </TooltipIcon>
                  }
                  Name
                </TableHeader>
                <TableHeader>
                  Pay type
                  <br />
                  {localState.payTypeCodeHidden ? <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Show Codes">
                    <ChevronRight16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.payTypeNameHidden) { SetlocalState({ ...localState, payTypeCodeHidden: !localState.payTypeCodeHidden }) } }} />
                  </TooltipIcon> :
                    <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Hide Codes">
                      <ChevronLeft16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.payTypeNameHidden) { SetlocalState({ ...localState, payTypeCodeHidden: !localState.payTypeCodeHidden }) } }} />
                    </TooltipIcon>
                  }
                  Code
                  {localState.payTypeNameHidden ? <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Show Names">
                    <ChevronRight16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.payTypeCodeHidden) { SetlocalState({ ...localState, payTypeNameHidden: !localState.payTypeNameHidden }) } }} />
                  </TooltipIcon> :
                    <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Hide Names">
                      <ChevronLeft16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.payTypeCodeHidden) { SetlocalState({ ...localState, payTypeNameHidden: !localState.payTypeNameHidden }) } }} />
                    </TooltipIcon>
                  }
                  Name
                </TableHeader>


                {getFiscalMonths(budgetVersion).map(month => {
                  return (<TableHeader className="text-align-right">{month}<br/>{getFiscalYear(month)}</TableHeader>);
                })}

              </TableRow>
              
            </TableHead>
            <TableBody>
              {raisesTable.map(row => {
                return (
                  <TableRow>
                    <TableCell>
                      {!localState.entityCodeHidden ? row.entityCode : ''}&nbsp;
                      {!localState.entityNameHidden ? row.entityName : ''}
                    </TableCell>
                    <TableCell>
                      {!localState.departmentCodeHidden ? row.departmentCode : ''}&nbsp;
                      {!localState.departmentNameHidden ? row.departmentName : ''}
                    </TableCell>
                    <TableCell>
                      {!localState.jobCodeCodeHidden ? row.jobCodeCode : ''}&nbsp;
                      {!localState.jobCodeNameHidden ? row.jobCodeName : ''}
                    </TableCell>
                    <TableCell>
                      {!localState.payTypeCodeHidden ? row.payTypeCode : ''}&nbsp;
                      {!localState.payTypeNameHidden ? row.payTypeName : ''}
                    </TableCell>
                    {row.percentChange.map(percent => {
                      return (<TableCell>{percent}%</TableCell>);
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Pagination
            id="paginationBar"
            pageSizes={[20, 40, 60, 80, 100, 500, 1000]}
            totalItems={rows.length}
          />
        </TableContainer >
      )}
    />
  );
}

export default RaisesTable;