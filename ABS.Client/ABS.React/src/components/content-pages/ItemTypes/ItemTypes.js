import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';

import { addItemTypes, updateItemTypes ,updateItemTypesDB } from '../../../Core/_actions/ItemTypesActions';
import { TextInput, Tab, Tabs, Button } from 'carbon-components-react';
import PageHeader from '../PageHeader';
import { Save16 } from '@carbon/icons-react';


function ItemTypes({ count, addItemTypes, updateItemTypes, updateItemTypesDB }) {

	//const getdata = useeffects
 const state = useState();
	const handleChange = (e) => {
		console.log('handle change', e, e.target.value);
    updateItemTypes({ [e.target.id]: e.target.value });
   // this.prop.updateItemTypes()
	};
	
	const handleSubmit = (e) => {
		e.preventDefault();
		//setState({ UserID: '1' });
		// console.log(this.state);
		// console.log('handle submit');
		updateItemTypesDB(state);
	};

useEffect(() => {
    // Update the document title using the browser API
console.log('use effects ')
  });
	return (
		<div>
			<PageHeader PageHeading="Item Types" ShowFavIcon="true" />
			<Tabs>
				<Tab label="Item Types">
					<div className="bx--row">
						<div className="bx--col">ItemTypeKeyword</div>
						<div className="bx--col"><TextInput
								id="ItemTypeKeyword"
								type="text"
									onChange={handleChange}
							/></div>
              	<div className="bx--col" />
						<div className="bx--col" />
					</div>
					<div className="bx--row">
						<div className="bx--col">ItemTypeCode</div>
						<div className="bx--col">
            <TextInput
								id="ItemTypeCode"
								type="text"
									onChange={handleChange}
							/></div>
						<div className="bx--col" />
						<div className="bx--col" />
					</div>
					<div className="bx--row">
						<div className="bx--col">ItemTypeValue</div>
						<div className="bx--col"><TextInput
								id="ItemTypeValue"
								type="text"
									onChange={handleChange}
							/></div>
              	<div className="bx--col" />
						<div className="bx--col" />
					</div>
					<div className="bx--row">
						<div className="bx--col">ItemDataType</div>
						<div className="bx--col"><TextInput
								id="ItemDataType"
								type="text"
									onChange={handleChange}
							/></div>
              	<div className="bx--col" />
						<div className="bx--col" />
					</div>
					<div className="bx--row">
						<div className="bx--col">ItemTypeDisplayName</div>
						<div className="bx--col"><TextInput
								id="ItemTypeDisplayName"
								type="text"
									onChange={handleChange}
							/></div>
              	<div className="bx--col" />
						<div className="bx--col" />
					</div>
					<div className="bx--row">
						<div className="bx--col">ItemTypeDescription</div>
						<div className="bx--col"><TextInput
								id="ItemTypeDescription"
								type="text"
									onChange={handleChange}
							/></div>
              	<div className="bx--col" />
						<div className="bx--col" />
					</div>

          	<div className="bx--row" />
							<div className="bx--row" />
							<div className="bx--row" />
							<div className="bx--row">
								<div className="bx--col">
									<Button className="bx--btn--secondary" type="submit" >
										Cancel
									</Button>

									<Button
										className="bx--btn--primary "
										type="Submit"
										onClick={handleSubmit}
										// onClick={(e) => {
										// 	e.preventDefault();
										// 	this.props.updateSystemSettings();
										// }}
									>
										Save {'  	  '} &nbsp; <Save16 className="iconColor" />
									</Button>
								</div>
							</div>
					<div className="bx--row">
						

						<div className="bx--col">
							
							
							
							
						</div>
						<div className="bx--col" />
						<div className="bx--col" />
					</div>
				</Tab>
			</Tabs>

		
		</div>
	);
}

const mapStateToProps = (state) => ({
	ItemTypes: state.count
});

const mapDispatchToProps = {
	addItemTypes,
  updateItemTypes,
  updateItemTypesDB
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemTypes);
