import React, {useEffect, useState} from 'react';
import { connect, useSelector } from 'react-redux';
import PageHeader from '../../layout/PageHeader';
import { useHistory } from 'react-router-dom';
import { renameBudgetVersions, changeBudgetVersions } from '../../../core/_actions/BudgetVersionsActions';
import { Button, TextInput, ComboBox, TooltipIcon, Accordion, AccordionItem, ModalWrapper, Modal, Dropdown, InlineLoading } from 'carbon-components-react';
import { Save16, Information20, FaceActivated16, Favorite16 } from '@carbon/icons-react';
import PageFooter from '../../layout/PageFooter';
import { GetBudgetVersion } from '../../../services/budget-version-service';

const initialState = {
	loadedValues : {},
	isLoading:true
}

function RenameBudgetVersions({ renameBudgetVersions, changeBudgetVersions, props }) {
	const history = useHistory();
	const actionsource = useSelector((state) => state.BudgetVersions.actionsource);

	const BudgetVersionData = useSelector((state) => state.BudgetVersions.list)
	const UserData = useSelector((state) => state.BudgetVersions.UserID)
	const userAuthenticationStatus = UserData === "" ? false : true
	const fiscalyearData = useSelector((state) => state.MasterData.FiscalYear)
	const [state,setLocalState] = useState(initialState)

	var loadBudgetversionID = '';
	if (actionsource === 'overflowmenu') {
		loadBudgetversionID = history.location.state;
	} else {
		loadBudgetversionID = history.location.state;
	}

	console.log(loadBudgetversionID, 'yallllla');


// ====
//  let loadedValues = Object.values(BudgetVersionData).find((a) => a.budgetVersionsID === loadBudgetversionID);
// 	changeBudgetVersions(loadedValues);
// 	console.log(loadedValues, 'Master')
// =====

	  useEffect (() => {
		setLocalState({...state, isLoading : true })
		GetBudgetVersion(loadBudgetversionID).then(data=>{
			setLocalState({...state,loadedValues: data.data, isLoading:false })
			changeBudgetVersions(data.data)
		})
	},[]);


	// console.log(itemMonths, 'use selector for getting values from API')
	const handleChange = (e) => {
		console.log('handle change', e, e.target.value);
		//console.log('all loaded values',loadedValues)
		// setBudgetVersionData(loadedValues)
		changeBudgetVersions({ budgetVersionsData: state.loadedValues.budgetVersionsID });
		changeBudgetVersions({ [e.target.id]: e.target.value });
		setLocalState({...state, loadedValues : { ...state.loadedValues, [e.target.id]:e.target.value }});

		//this.prop.updateBudgetVersions()
	};

	const handleCombo = (e, controlID) => {
		console.log('handle combo', e, e.selectedItem.itemTypeID);
		changeBudgetVersions({ [controlID]: e.selectedItem.itemTypeID });
	};


	const handleSubmit = (e) => {
		e.preventDefault();
		renameBudgetVersions();
		setTimeout(function () { history.push('/BudgetVersions') }, 4500);
	};


	const handleCancel = (e) => {
		e.preventDefault();
		history.goBack();
		//setState({ UserID: '1' });
		// console.log(this.state);
		// console.log('handle submit');
		//	updateItemTypesDB(state);
		//	updateItemTypesDB(state);
	};

	const breadCrumb = [
		{
			text: 'Budget versions',
			link: '/BudgetVersions/'
		}
	];
	// if (typeof (state.loadedValues) === 'undefined') {
	if (state.isLoading) {
		return (
			<InlineLoading className=".bx--inline-loading__text" description="Saving data..." />
			//history.goBack()
		);
	}
	else {
		return (
			<>
				<PageHeader
					heading="Rename budget versions"
					icon={<Favorite16 />}
					breadcrumb={breadCrumb} 
					notification={history?.location?.state?.notification} />

				<div className="bx--row">
					<div className="bx--col">
						{'Code'}
						<TextInput
							id="code"
							type="text"
							onChange={handleChange}
							value={state.loadedValues.code}
							disabled={userAuthenticationStatus ? false : true}
							style={{width: 160}}
							maxLength={15}

						/>
					</div>

					<div className="bx--col">
						{'Name'}
						<TextInput
							id="description"
							type="text"
							onChange={handleChange}

							defaultValue={state.loadedValues.description}
							//disabled={true}
							disabled={userAuthenticationStatus ? false : true}
						style={{width: 355}}
						maxLength={40}

						/>
					</div>
					<div className="bx--col" />
					<div className="bx--col" />
					<div className="bx--col" />
					<div className="bx--col" />
				</div>
				<div className="bx--row">
					<div className="bx--col">
						{'Description (optional)'}
						<TextInput
							id="comments"
							type="text"
							onChange={handleChange}
							defaultValue={state.loadedValues.comments}
							disabled={userAuthenticationStatus ? false : true}
						style={{ width: 675 }}
						maxLength={80}

						/>
					</div>
					<div className="bx--col" />
					<div className="bx--col" />
				</div>
				<div className="bx--row">
					<div className="bx--col" />

					<div className="bx--col" />
					<div className="bx--col" />
				</div>
				<div className="bx--row" />

				<div className="bx--row">
					<div className="bx--col">
						{'Fiscal year'}
						<Dropdown
							id="fiscalYearID"
							type="text"
							items={fiscalyearData}
							itemToString={(item) => (item ? item.timePeriodName : '')}
							value={(item) => (item ? item.itemTypeID : '')}
							//selected={(item) => (item ? item.itemTypeValue : '')}
							// initialSelectedItem={fiscalyearData.find(
							// 	(x) => x.itemTypeID === state.loadedValues?.timePeriodID.timePeriodID
							// )}
							initialSelectedItem={state.loadedValues?.timePeriodID}
							onChange={(e) => { handleCombo(e, 'fiscalYearID') }}
							//	disabled={userAuthenticationStatus?false:true}
							disabled={true}
						// defaultValue={state.loadedValues.fiscalYearID}
						/>
					</div>
					<div className="bx--col">
						{/* {'Start month'}
					<Dropdown
						id="fiscalStartMonthID"
						type="text"
						items={itemMonths}
						itemToString={(item) => (item ? item.itemTypeCode : '')}
											value={(item) => (item ? item.itemTypeID : '')}
											//selected={(item) => (item ? item.itemTypeValue : '')}
											 initialSelectedItem={itemMonths.find(
												(x) => x.itemTypeCode === state.loadedValues.fiscalStartMonthID
											 )}
						onChange={(e) => {handleCombo(e,'fiscalStartMonthID')}}
						disabled={userAuthenticationStatus?false:true}
					/> */}
					</div>

					<div className="bx--col">
						{/* {'Budget version type'}
					<Dropdown
						id="budgetVersionTypeID"
						type="text"
						items={budgetVersionTypeData}
						itemToString={(item) => (item ? item.itemTypeCode : '')}
											value={(item) => (item ? item.itemTypeID : '')}
											//selected={(item) => (item ? item.itemTypeValue : '')}
											initialSelectedItem={budgetVersionTypeData.find(
												(x) => x.itemTypeValue === state.loadedValues.budgetVersionTypeID
												
											 )}
						onChange={(e) => {handleCombo(e,'budgetVersionTypeID')}}
						disabled={userAuthenticationStatus?false:true}
					/> */}
					&nbsp;
				</div>

					<div className="bx--col">
						<br />{' '}
						{/* <TooltipIcon tooltipText="Actual data cannot be changed and are used to create projections. For projections, you can (1) copy the available actual data budget version into a new budget version, then (2) forecast the remaining months of the current fiscal year. For forecasts, you can (2) copy the projections budget version, then (2) update the months for the next fiscal year budget. Or, you can start an empty forecast budget version and load data for next years budget using the available options.">
						<Information20 />
					</TooltipIcon> */}
					</div>
					<div className="bx--col" />
					<div className="bx--col" />
					<div className="bx--col" />
				</div>
				<div className="bx--row">
					<div className="bx--col">
						{/* {'Scenario type (optional)'}
					<Dropdown
						id="scenarioTypeID"
						type="text"
						items={scenarioTypeData}
						itemToString={(item) => (item ? item.itemTypeCode : '')}
											value={(item) => (item ? item.itemTypeID : '')}
											//selected={(item) => (item ? item.itemTypeValue : '')}
											initialSelectedItem={scenarioTypeData.find(
												(x) => x.itemTypeCode === state.loadedValues.scenarioTypeID
											)}
						onChange={(e) => {handleCombo(e,'scenarioTypeID')}}
						disabled={userAuthenticationStatus?false:true}
					/>{' '} */}
					</div>
					<div className="bx--col" />
					<div className="bx--col" />
					<div className="bx--col" />
					<div className="bx--col" />

					<div className="bx--col" />
				</div>
				<div className="bx--row">
					<div className="bx--col">
						<Button className="bx--btn--secondary" type="submit" onClick={handleCancel}
							disabled={userAuthenticationStatus ? false : true}>
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
							// disabled={userAuthenticationStatus ? false : true}
							disabled={(!state?.loadedValues?.code || !state?.loadedValues?.description)}
						>
							Rename {'  	  '} &nbsp; <Save16 className="iconColor" />
						</Button>
					</div>
				</div>
				<div className="bx--row">
					<div className="bx--col" />
					<div className="bx--col" />
					<div className="bx--col" />
				</div>
			</>




		);
	}
}

const mapStateToProps = (state) => ({
	BudgetVersions: state.count
});

const mapDispatchToProps = {
	renameBudgetVersions,

	changeBudgetVersions
};

export default connect(mapStateToProps, mapDispatchToProps)(RenameBudgetVersions);
