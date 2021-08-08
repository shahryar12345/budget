import React from 'react';
import { connect } from 'react-redux';

//import { addDTTableToolbar, updateDTTableToolbar ,updateDTTableToolbarDB } from '../../../Core/_actions/DTTableToolbarActions';
import {  Button,  TableToolbarSearch, TableToolbar, TableToolbarContent,  Dropdown } from 'carbon-components-react';

import DTTableBatchActions from './TableBatchActions'

const ComboBoxScenarioTypes = {
	id: 'xc_HideMonths',
  className: 'bx--dropdown',
  placeholder: 'All scenario types',
	 label: 'All scenario types' 
};
const ComboBoxBudgetVersionTypes = {
	id: 'xc_HideRows',
  className: 'bx--dropdown',
  placeholder:'All budget version types',
    label:'All budget version types ',
    light:false
    
};

const stringItems = [
  'Option 1',
  'Option 2',
  'Option 3'
  
];

const tableToolbarClick = e => {
  console.log('Table tool bar clicked', e)
}


function DTTableToolbar({ onInputChange, addDTTableToolbar, updateDTTableToolbar, updateDTTableToolbarDB }) {

 

	return (
		<div>
         <TableToolbar>
         <DTTableBatchActions />
                    <TableToolbarContent>
                    
        <TableToolbarSearch onChange={onInputChange} />
       
                      	<Dropdown   {...ComboBoxScenarioTypes} items={stringItems} />
							
							
								<Dropdown
								{...ComboBoxBudgetVersionTypes}
								items={stringItems}
								 onChange={() => console.log('add clicked')}
							/>
							
							
								<Button small kind="primary" onClick={() => console.log('add clicked')}>
									Add &nbsp; &nbsp;+ 
									
								</Button>
							
							
								<Button small kind="primary" onClick={() => console.log('Forecast clicked')}>
									Forecast{' '}
								</Button>
							
							
								<Button small kind="primary" onClick={() => console.log('Spread clicked')}>
									Spread data &nbsp; &nbsp; &nbsp;
									{/* <ArrowsHorizontal16 className="iconColor" /> */}
								</Button>
							
         </TableToolbarContent>             
         </TableToolbar>
			</div>
	);
}

const mapStateToProps = (state) => ({
	DTTableToolbar: state.count
});

const mapDispatchToProps = {
// 	addDTTableToolbar,
//   updateDTTableToolbar,
//   updateDTTableToolbarDB
};

export default connect(mapStateToProps, mapDispatchToProps)(DTTableToolbar);
