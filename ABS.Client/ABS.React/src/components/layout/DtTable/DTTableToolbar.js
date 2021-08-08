import React from 'react';
import { connect } from 'react-redux';

//import { addDTTableToolbar, updateDTTableToolbar ,updateDTTableToolbarDB } from '../../../Core/_actions/DTTableToolbarActions';
import { TextInput, Tab, Tabs, Button, Checkbox, TableToolbarSearch, TableToolbar, TableToolbarContent } from 'carbon-components-react';
import { Search20, Favorite20, Save20, Save16, Information16, FilterEdit16, Information32, SettingsAdjust32, SettingsAdjust16, ArrowsHorizontal16, Undo16, Reset16, Redo16, Restart16, Export16, Row16 } from '@carbon/icons-react';
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
function DTTableToolbar({ onInputChange, addDTTableToolbar, updateDTTableToolbar, updateDTTableToolbarDB }) {

 

	return (
		<div>
         <TableToolbar>
                    <TableToolbarContent>
        <TableToolbarSearch className="" onChange={onInputChange} />
        <Button onClick={console.log('toolbar add new clicked')} small kind="ghost"><Checkbox {...checkboxHideMonths} /></Button>
                      <Button onClick={console.log('toolbar add new clicked')} small kind="ghost"><Checkbox {...checkboxHideRowsMonths} defaultChecked="checked" /> &nbsp;  &nbsp;<Information16 /></Button>
                      {/* <Button onClick={console.log('toolbar add new clicked')} small kind="ghost"><SettingsAdjust16 /></Button> */}
                      <Button onClick={console.log('toolbar add new clicked')} small kind="primary">Add actuals data</Button>
                      <Button onClick={console.log('toolbar add new clicked')} small kind="primary">Add rows &nbsp; &nbsp; &nbsp; <Row16 className="iconColor"/></Button>
                      <Button onClick={console.log('toolbar add new clicked')} small kind="primary">Forecast data</Button>
                      <Button onClick={console.log('toolbar add new clicked')} small kind="primary" >Spread data &nbsp;  &nbsp;  &nbsp; <ArrowsHorizontal16 className="iconColor" /></Button>
                      {/* <Button onClick={console.log('toolbar add new clicked')} small kind="primary">Undo  &nbsp;  <Reset16  className="iconColor"/> </Button> */}
                      <Button onClick={console.log('toolbar add new clicked')} small kind="primary">Undo  &nbsp;  &nbsp;  &nbsp;<Undo16 className="iconColor"/>  </Button>
                      {/* <Button onClick={console.log('toolbar add new clicked')}  small kind="primary">Redo  &nbsp;  <Restart16 className="iconColor"/></Button> */}
                      <Button className="bx--btn--primary" onClick={console.log('toolbar add new clicked')} small kind="primary">Redo  &nbsp;  &nbsp;  &nbsp;<Redo16 className="iconColor"/> </Button>
                      <Button onClick={console.log('toolbar add new clicked')} small kind="primary" >Export to Excel &nbsp;  &nbsp;  &nbsp;<Export16 className="iconColor"/></Button>
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
