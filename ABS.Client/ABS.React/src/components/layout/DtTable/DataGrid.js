import React from 'react';
import {useSelector} from 'react-redux';
import { DataTable, Button, Checkbox, TableExpandedRow, TableExpandRow, Pagination } from 'carbon-components-react';
import  initheaders  from "./headers";
import  initialRows  from "./initialRows";
import { OverflowMenu, OverflowMenuItem } from 'carbon-components-react';
import overflowMenuItems from './overflowMenu'
import DTTableToolbar  from './DTTableToolbar';

import { Search20, Favorite20, Save20, Save16, Information16, FilterEdit16, Information32, SettingsAdjust32, SettingsAdjust16, ArrowsHorizontal16, Undo16, Reset16, Redo16, Restart16, Export16, Row16 } from '@carbon/icons-react';
const {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  TableSelectRow,
  TableBatchActions
} = DataTable;


const checkboxHideMonths = {
	id: 'xc_HideMonths',
	className: 'bx--checkbox-wrapper',
	 labelText: 'Hide months' 
};
const checkboxHideRowsMonths = {
	id: 'xc_HideRows',
	className: 'bx--checkbox-wrapper',
	  labelText:'Hide rows with 0 and all 12 months '
};
const paginationProps = () => ({
    page: 10,
   totalItems: 10,
   pagesUnknown: false,
  // pageInputDisabled: false,
   backwardText: 'Previous page',
   forwardText: 'Next page',
   pageSize: 2,
   pageSizes: [2, 5, 10, 20, 30, 40, 50],
   itemsPerPageText: 'Items per page:',
  onChange: 'onChange',
});

const getHeaderProps = () => ({
  disabled: false,
  // page: 1,
  // totalItems: 103,
  // pagesUnknown: false,
  // pageInputDisabled: false,
  // backwardText: 'Previous page',
  // forwardText: 'Next page',
  // pageSize: 2,
  //  pageSizes: [10, 20, 30, 40, 50],
  // itemsPerPageText: 'Items per page:',
  // onChange: 'onChange',
});


const checkboxCommans = {
	id: 'xc_HideMonths',
	className: 'bx--checkbox-wrapper',
	
};

const getHeader = function(data ){
    const Headers = Object.keys(data);
      return Headers;
    }

const getDataRows = function(data ){
    const rows = Object.values(data);
      return rows;
    }

const paginationHandler  = ({ page }) => {
            console.log('page number',page) ;
          };
const addIndexKey = function(arrdata ){
  var x = new Date();

// console.log('getitme ', x);
// console.log('arrdata ', arrdata);
    var result = Object.values(arrdata).map(function(el) {
  var newArr = Object.assign({}, el);
  newArr.id = Math.floor(Math.random() * 100 * Math.random() *10);  
 console.log('abv', newArr)
  return newArr;
})
return result;
    }


    

// Inside of your component's `render` method
const DataGrid = () => {

  
    const systemSettingsValRdx = useSelector((state) => state.systemSettings);
    console.log('DTTABLE ' ,systemSettingsValRdx);
  const getIndexedData = addIndexKey(systemSettingsValRdx);
  console.log('getindexeddata', systemSettingsValRdx);


    const gridHeaders =    getHeader(systemSettingsValRdx);

  const gridData = getDataRows(systemSettingsValRdx);

  console.log('check my array of headers', systemSettingsValRdx, gridHeaders);
  console.log('check my array of data', gridData);

    
  return (
    <DataTable
      
      // rows={gridData}
       rows={initialRows}
      headers={initheaders}
      //headers={gridHeaders}
      isSortable={true}
      radio={true}
      pagination={true}
      render={({ rows,
              headers, 
             // getHeaderProps,
              getRowProps,
              getTableProps,
              getSelectionProps,
              onInputChange} ) => (
        <TableContainer title="">
        <DTTableToolbar />
   
          <Table>
            <TableHead>
              <TableRow>
                {headers.map(header => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
                
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                
                <React.Fragment key={row.id}>
              <TableExpandRow {...getRowProps({ row })}>
                {row.cells.map(cell => (
                  <TableCell key={cell.id}>{cell.value}</TableCell>
                ))}
              </TableExpandRow>
              {/* toggle based off of if the row is expanded. If it is, render TableExpandedRow */}
              {row.isExpanded && (
                <TableExpandedRow colSpan={headers.length + 1}>
                  <h1>Expandable row content</h1>
                  <p>Description here</p>
                </TableExpandedRow>
              )}
            </React.Fragment>
                
              ))}
            </TableBody>
          
          </Table>
           <Pagination pageSizes={[2,5, 10]}
              totalItems={12}  className="bx--pagination"  onChange={paginationHandler}/> 
        </TableContainer>
      
      )}
    
      
    />
  );
}

export default DataGrid;
