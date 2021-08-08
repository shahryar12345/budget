import React, { useEffect, useState, createRef } from "react";
import { Checkbox, DataTable, Pagination, TooltipIcon, Button } from 'carbon-components-react';
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown16, ChevronLeft16, ChevronRight16, ChevronUp16, Close16, Edit16, Play16, WarningAlt16 } from '@carbon/icons-react';
import { formatData, formatNumber, parseNumber } from '../../../services/format-service';

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
  TableToolbarAction,
  TableToolbarSearch
} = DataTable;




const InflationRatesTable = ({ budgetVersion, inflationTable }) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [localState, SetlocalState] = useState({ entityCodeHidden: false, entityNameHidden: false, departmentCodeHidden: false, departmentNameHidden: false, glAccountCodeHidden: false, glAccountNameHidden: false });

  const masterData = useSelector((state) => state.MasterData);

  const getFiscalMonths = (masterData, budgetVersion) => {
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

  const formatParameters = useSelector(state => {

    const decimalFormats = state.MasterData.ItemDecimalPlaces || [];
    const statsFormat = state.systemSettings.decimalPlaceStatistics || 'itemDecimalPlaces-2';
    const groupingFormat = state.systemSettings.xc_Commas?.toLowerCase() === 'true' ?? false;

    // Get the format string, and strip off the first token to obtain the number of decimals
    const fractionDigits = decimalFormats.find(({ itemTypeCode }) => itemTypeCode === statsFormat)?.itemTypeValue ?? 2;

    return {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
        useGrouping: groupingFormat,
        nagativeValueSelectedFormat: state.systemSettings.rd_negativeValues,
        useCurrency: state.systemSettings.xc_Currency === "True" ? true : false
    }
  });  

  const formatCellValue = value => {
    let result = parseNumber(value);
    if (value === undefined || value === "") {
        return value;
    }

    if (result < 0) {
      result = result * -1;
    }

    result = result.toFixed(formatParameters.maximumFractionDigits);

    if (value < 0) {
        // Hack: getting formatted string, so removing '-' first and then applying selected format
        // cannot use Math.abs as it returns number and can reset previous formating of decimal places            
        // if (value.startsWith('-')) value = value.substring(1);
        switch (formatParameters.nagativeValueSelectedFormat) {
            case 'withSign':
                return <span> -{result} </span>
            case 'withBracket':
                return <span> ({result}) </span>
            case 'redSign':
                return <span className="statistics-table-cell-red-value"> -{result} </span>
            case 'redBracket':
                return <span className="statistics-table-cell-red-value"> ({result}) </span>
            default:
                return <span>{result}</span>
        }
    }

    return result;
}


  return (
    <DataTable
      pagination={true}
      rows={inflationTable}
      headers={[]}
      render={({ rows, headers, getHeaderProps }) => (
        <TableContainer className={`statistics-table-container`}>
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
                  GL account
                  <br />
                  {localState.glAccountCodeHidden ? <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Show Codes">
                    <ChevronRight16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.glAccountNameHidden) { SetlocalState({ ...localState, glAccountCodeHidden: !localState.glAccountCodeHidden }) } }} />
                  </TooltipIcon> :
                    <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Hide Codes">
                      <ChevronLeft16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.glAccountNameHidden) { SetlocalState({ ...localState, glAccountCodeHidden: !localState.glAccountCodeHidden }) } }} />
                    </TooltipIcon>
                  }
                  Code
                  {localState.glAccountNameHidden ? <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Show Names">
                    <ChevronRight16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.glAccountCodeHidden) { SetlocalState({ ...localState, glAccountNameHidden: !localState.glAccountNameHidden }) } }} />
                  </TooltipIcon> :
                    <TooltipIcon className='statistics-table-icon-container' direction='bottom' align='start' tooltipText="Hide Names">
                      <ChevronLeft16 className='statistics-table-icon statistics-table-header-icon' onClick={e => { if (!localState.glAccountCodeHidden) { SetlocalState({ ...localState, glAccountNameHidden: !localState.glAccountNameHidden }) } }} />
                    </TooltipIcon>
                  }
                  Name
                </TableHeader>
                {getFiscalMonths(masterData, budgetVersion).map(month => {
                  return (<TableHeader>{month}</TableHeader>);
                })}

              </TableRow>
            </TableHead>
            <TableBody>
              {inflationTable.map(row => {
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
                      {!localState.glAccountCodeHidden ? row.glAccountCode : ''}&nbsp;
                      {!localState.glAccountNameHidden ? row.glAccountName : ''}
                    </TableCell>
                    {row.percentChange.map(percent => {
                      return (<TableCell>{formatCellValue(percent)}%</TableCell>);
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

export default InflationRatesTable;