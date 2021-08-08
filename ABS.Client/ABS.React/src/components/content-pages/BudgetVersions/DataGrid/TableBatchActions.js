import React from 'react';
import { connect } from 'react-redux';

//import { addDTTableToolbar, updateDTTableToolbar ,updateDTTableToolbarDB } from '../../../Core/_actions/DTTableToolbarActions';
import {  Button,  TableToolbarSearch, TableToolbar, TableToolbarContent,  Dropdown, TableBatchActions, TableBatchAction } from 'carbon-components-react';

const batchActionClick = selectedRows => () =>
{
  console.log('batch action click please ',selectedRows);
}


    
    
    const getBatchActionProps = function(data ){
    const rows = {a:'x'}
      return rows;
    }

    const selectedRows = getBatchActionProps ();



    
function DTTableBatchActions({ onInputChange, addDTTableToolbar, updateDTTableToolbar, updateDTTableToolbarDB }) {

 

	return (
		<div>
          <TableBatchActions {...getBatchActionProps()}>
          {/* inside of you batch actinos, you can include selectedRows */}
          <TableBatchAction primaryFocus onClick={batchActionClick(selectedRows)}>
            Ghost
          </TableBatchAction>
          <TableBatchAction onClick={batchActionClick(selectedRows)}>
            Ghost
          </TableBatchAction>
          <TableBatchAction onClick={batchActionClick(selectedRows)}>
            Ghost
          </TableBatchAction>
        </TableBatchActions>
			</div>
	);
}

const mapStateToProps = (state) => ({
	DTTableBatchActions: state.count
});

const mapDispatchToProps = {
// 	addDTTableToolbar,
//   updateDTTableToolbar,
//   updateDTTableToolbarDB
};

export default connect(mapStateToProps, mapDispatchToProps)(DTTableBatchActions);
