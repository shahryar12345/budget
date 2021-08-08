import React, { useState } from 'react';
import { ComboBox,Dropdown, TooltipIcon, TooltipDefinition, Button } from 'carbon-components-react';
import { connect, useDispatch, useSelector } from 'react-redux';

import itemsMonths from '../MasterData/itemsMonths';
import { updateStructureTable, fetchStructureTable } from '../../../Core/_actions/StructureTableActions';
import { Information16, SettingsAdjust16, Save16 } from '@carbon/icons-react';
import getApiResponse from '../../../services/api/apiCallerGet';
import PageHeader from '../PageHeader';
 

const ComboProps = (props) => {};
const handleCombo = (e, controlID) => {
	console.log('handle combo', e, e.selectedItem.value, e.selectedItem.text);

	//	setState({ [controlID]: e.selectedItem.value });
};

const getAxios = async () => {
	console.log('getaxios ' )
	const xres = await getApiResponse('ItemTypes-GetMonths');
	console.log('payload from api ' , xres)

}

const StructureTables = () => {
	

	const fiscalStartMonthval = useSelector((state) => state.StructureTables.fiscalStartMonth);
	console.log('fiscalStartMonthval', fiscalStartMonthval);
	const dispatch = useDispatch();
    const [ selectedItem, setSelectedItem ] = useState(itemsMonths);
    let obj = itemsMonths.find(x => x.text === fiscalStartMonthval);

    console.log('thats my object ',obj.text)
	return (
		<div>
		<PageHeader
					PageHeading="Structure tables"
					ShowFavIcon="true"
					ShowBreadcrumb="true"
					BreadCrumbLink=""
					BreadcrumbText=""
					ShowNOtification="false"
					NotificationTitle="Setting saved."
					ShownAlready = "false"
				/>
			<Dropdown 
				{...ComboProps}
				id="fiscalStartMonth"
				//light={true}
				 placeholder=""
				items={itemsMonths}
				itemToString={(item) => (item ? item.text : '')}
				//value={(item) => (item ? item.id : '')}
				//selected={(item) => (item ? item.selected : '')}
				//selected={console.log(this.props.fiscalStartMonth.text)}
				//   selectedItem={(item) => (item ? fiscalStartMonthval : '')}
				
				initialSelectedItem={itemsMonths.find(x => x.text === fiscalStartMonthval)}
				
								onChange={({ selectedItem }) => {
					//handleCombo(e, 'fiscalStartMonth');
					setSelectedItem(selectedItem);

					dispatch(updateStructureTable(selectedItem.text));
					console.log(selectedItem);
				}}
			/>
		
		
	<Button className="bx--btn--secondary" type="submit" 
	//onClick={}
	>
							Cancel
						</Button>
						<Button className="bx--btn--tertiary" type="submit"
						 //onClick={}
						 >
							Save
						</Button>
						<Button className="bx--btn--tertiary" type="submit" 
						//onClick={}
						>
							Save as
						</Button>

						<Button
							className="bx--btn--primary "
							type="Submit"
							//onClick={checkValidity}
							// onClick={(e) => {
							// 	e.preventDefault();
							// 	this.props.updateSystemSettings();
							// }}
						>
							Save & Close{'  	  '} &nbsp; <Save16 className="iconColor" />
						</Button>

 					{/* <TooltipDefinition direction="right"
											tooltipText={ <Information16 />}
											align="center"><Information16 /> </TooltipDefinition>
				
											<SettingsAdjust16 /> */}
										
		</div>
	);
};


export default StructureTables;
