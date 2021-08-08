import {
	Button,
	ButtonSkeleton,
	Checkbox,
	ComboBox,
	DataTable,
	FileUploader,
	FileUploaderButton,
	FileUploaderDropContainer,
	Form,
	FormGroup,
	RadioButton,
	RadioButtonGroup,
	Tab,
	Tabs,
	TextInput
} from 'carbon-components-react';
import { Favorite20, Save16, Save20, Search20 } from '@carbon/icons-react';
import React, { Component, useState } from 'react';
import { fetchSystemSettings, updateSystemSettings } from '../../../Core/_actions/SystemSettingActions';

import AddSystemSettingUI from './AddSystemSettingsUI';
import DTTable from '../../layout/DtTable';
import PageFooter from '../PageFooter';
import PageHeader from '../PageHeader';
import ResponseData from '../../../services/api/apiCallerGet';
import axios from 'axios';
import { connect } from 'react-redux';
import getURL from '../../../services/api/apiList';
import itemDecimalPlaces from '../MasterData/itemDecimalPlaces';
import itemsDateFormat from '../MasterData/itemDateFormat';
import itemsMonths from '../MasterData/itemsMonths';

var url = getURL('Authentication');

function selectFolder(e) {
	console.log(e.target);
	console.log(e);

}

const checkboxCurrency = {
	id: 'xc_Currency',
	className: 'bx--checkbox-wrapper',
	labelText: 'Show amount symbol ($)'
};

const checkboxCommans = {
	id: 'xc_Commas',
	className: 'bx--checkbox-wrapper',
	labelText: 'Show commas (e.g., 1,000.00)'
};

const ComboProps = (props) => {};
const RadioButtonProps = {
	className: 'bx--redColor'
};

class AddSystemSettings extends Component {
	handleRadio = (event, controlID) => {
		this.setState({ [controlID]: event.target.value });
	};
	handleCombo = (e, controlID) => {
		this.setState({ [controlID]: e.selectedItem.value });
	};
	handleChange = (e) => {
		this.setState({ [e.target.id]: e.target.value });
	};
	handleSubmit = (e) => {
		e.preventDefault();
		// console.log(this.state);
		// console.log('handle submit');
		this.props.updateSystemSettings(this.state);
	};
	render() {
		const systemSettingsValues = this.props.systemSettings.systemSettings;
		console.log(' prop ',systemSettingsValues);
		return (
			<div>
				<PageHeader PageHeading="System settings" ShowFavIcon="true" />
				<Tabs>
					<Tab className="bx--tabs" label="Budgeting">
						<Form id="FrmUpdateSystemSettings" onSubmit={this.handleSubmit}>
							<div className="bx--content-switcher" />
							<h4>Dates</h4>{' '}
							<div className="bx--row">
								<div className="bx--col">
									{' Fiscal year start month  '}
									<br />

									<br />
									<ComboBox
										{...ComboProps}
										id="fiscalStartMonth"
										//light={true}
										placeholder="Please Select"
										items={itemsMonths}
										itemToString={(item) => (item ? item.text : '')}
										value={(item) => (item ? item.id : '')}
										selected={(item) => (item ? item.selected : '')}
										//selected={console.log(this.props.fiscalStartMonth.text)}

										onChange={(e) => {
											this.handleCombo(e, 'fiscalStartMonth');
										}}
									/>
									{'For example: Jul to Jun'}
								</div>
								<div className="bx--col">
									{' End month  '}
									<br />

									<br />
									<ComboBox
										{...ComboProps}
										id="fiscalEndMonth"
										name="fiscalEndMonth"
										//light={true}
										placeholder="Please Select"
										items={itemsMonths}
										itemToString={(item) => (item ? item.text : '')}
										value={(item) => (item ? item.id : '')}
										selected={(item) => (item ? item.selected : '')}
										//selected={console.log(this.props.fiscalStartMonth.text)}
										disabled
										onChange={(e) => {
											this.handleCombo(e, 'fiscalEndMonth');
										}}
									/>
									{'For example: Jul to Jun'}
								</div>

								<div className="bx--col">
									{'  '}

									{' Date format '}
									<br />
									<br />
									<ComboBox
										id="fiscalStartMonthDateFormat"
										//light={true}
										placeholder="Please Select"
										items={itemsDateFormat}
										itemToString={(item) => (item ? item.text : '')}
										value={(item) => (item ? item.id : '')}
										selected={(item) => (item ? item.selected : '')}
										onChange={(e) => {
											this.handleCombo(e, 'fiscalStartMonthDateFormat');
										}}
									/>
								</div>

								<div className="bx--col" />
								<div className="bx--col" />
								<div className="bx--col" />
								<div className="bx--col" />
								<div className="bx--col" />
							</div>
							<div className="bx--row" />
							<div className="bx--row" />
							<div className="bx--row" />
							<div>
								<h4>Decimal places</h4>
								<div className="bx--row">
									<div className="bx--col">
										{' Number of decimal places for statistics  '}
										<ComboBox
											id="decimalPlaceStatistics"
											//light={true}
											placeholder="Please Select"
											items={itemDecimalPlaces}
											itemToString={(item) => (item ? item.text : '')}
											value={(item) => (item ? item.value : '')}
											selected={(item) => (item ? item.selected : '')}
											onChange={(e) => {
												this.handleCombo(e, 'decimalPlaceStatistics');
											}}
										/>
									</div>
									<div className="bx--col">
										{' Number of decimal places for amounts  '}
										<ComboBox
											id="decimalPlacesAmounts"
											//light={true}
											placeholder="Please Select"
											items={itemDecimalPlaces}
											itemToString={(item) => (item ? item.text : '')}
											value={(item) => (item ? item.id : '')}
											selected={(item) => (item ? item.selected : '')}
											onChange={(e) => {
												this.handleCombo(e, 'decimalPlacesAmounts');
											}}
										/>

										<Checkbox
											{...checkboxCommans}
											onClick={this.handleChange}
											defaultChecked={systemSettingsValues.xc_Commas}
										/>
										<Checkbox
											{...checkboxCurrency}
											onClick={this.handleChange}
											defaultChecked={systemSettingsValues.xc_Currency}
										/>
									</div>
									<div className="bx--col">
										{' Number of decimal places for FTEs  '}
										<ComboBox
											id="decimalPlacesFTE"
											//light={true}
											placeholder="Please Select"
											items={itemDecimalPlaces}
											itemToString={(item) => (item ? item.text : '')}
											value={(item) => (item ? item.id : '')}
											selected={(item) => (item ? item.selected : '')}
											onChange={(e) => {
												this.handleCombo(e, 'decimalPlacesFTE');
											}}
										/>
									</div>
									<div className="bx--col">
										{' Number of decimal places for hours  '}
										<ComboBox
											id="decimalPlacesHours"
											//light={true}
											placeholder="Please Select"
											items={itemDecimalPlaces}
											itemToString={(item) => (item ? item.text : '')}
											value={(item) => (item ? item.id : '')}
											selected={(item) => (item ? item.selected : '')}
											onChange={(e) => {
												this.handleCombo(e, 'decimalPlacesHours');
											}}
										/>
									</div>
								</div>
								<br />
								<div className="bx--row" />
								<br />
								<div className="bx--row">
									<div className="bx--col">
										{' Number of decimal places for percent values  '}
										<ComboBox
											id="decimalPlacesPercentValues"
											//light={true}
											placeholder="Please Select"
											items={itemDecimalPlaces}
											itemToString={(item) => (item ? item.text : '')}
											value={(item) => (item ? item.id : '')}
											selected={(item) => (item ? item.selected : '')}
											onChange={(e) => {
												this.handleCombo(e, 'decimalPlacesPercentValues');
											}}
										/>
									</div>
									<div className="bx--col" />

									<div className="bx--col" />
									<div className="bx--col" />

									{}
								</div>
								<br />
								<div className="bx--row">
									{'  '}
									<div className="bx--col" />

									<div className="bx--col"> </div>
									<div className="bx--col" />
								</div>
							</div>
							<div>
								{' '}
								<div className="bx--content-switcher" />
								<h4>Negative values</h4>
								<div className="bx--row">
									{'  '}
									<div className="bx--col">
										{' Display negative values '}
										<RadioButtonGroup
											id="rd_negativeValues"
											defaultSelected={systemSettingsValues.rd_negativeValues}
											orientation="vertical"
											//	onChange={(e) => {this.handleRadio (  e, 'rd_negativeValues')}}
										>
											<RadioButton
												id="rd_negativeVal01"
												value="withSign"
												labelText="-xx"
												onClick={(e) => {
													this.handleRadio(e, 'rd_negativeValues');
												}}
											/>
											<RadioButton
												id="rd_negativeVal02"
												value="withBracket"
												labelText="(xx)"
												onClick={(e) => {
													this.handleRadio(e, 'rd_negativeValues');
												}}
											/>
											<RadioButton
												{...RadioButtonProps}
												id="rd_negativeVal03"
												value="redSign"
												labelText="-xx"
												onClick={(e) => {
													this.handleRadio(e, 'rd_negativeValues');
												}}
											/>
											<RadioButton
												{...RadioButtonProps}
												id="rd_negativeVal04"
												value="redBracket"
												labelText="(xx)"
												onClick={(e) => {
													this.handleRadio(e, 'rd_negativeValues');
												}}
											/>
										</RadioButtonGroup>{' '}
									</div>
									<div className="bx--col"> </div>
									<div className="bx--col" />
									<div className="bx--col" />

									{}
								</div>
							</div>
							<div>
								{' '}
								<div className="bx--content-switcher" />
								<h4>File locations</h4>
								<div className="bx--row">
									<div className="bx--col">
										{'Import file location (optional)'}
										<br />
										<TextInput
											id="importFilelocation"
											onChange={this.handleChange}
											defaultValue={systemSettingsValues.importFilelocation}
										/>

										{/* <FileUploader buttonLabel="Add Import file location" /> */}
									</div>
									<div className="bx--col">
										<br />
										<br />
										<FileUploaderButton
											buttonKind="ghost"
											labelText={<Search20 />}
											disableLabelChanges="true"
										/>
									</div>
								</div>
								<div className="bx--row">
									<div className="bx--col">
										{' Export file location (optional) '}
										<TextInput
											id="exportfilelocation"
											onChange={this.handleChange}
											defaultValue={systemSettingsValues.exportfilelocation}
										/>
									</div>
									<div className="bx--col">
										<br />
										<FileUploaderButton
											className="bx--fileuploaderbutton"
											buttonKind="ghost"
											labelText={<Search20 />}
											disableLabelChanges="true"
										/>
									</div>
								</div>
								<div className="bx--row">
									<div className="bx--col">
										{' Automatic backup file location (optional) '}

										<TextInput
											id="backupfilelocation"
											type="text"
											onChange={this.handleChange}
											defaultValue={systemSettingsValues.backupfilelocation}
										/>
									</div>
									<div className="bx--col">
										<br />
										<FileUploaderButton
											className="bx--fileuploaderbutton"
											buttonKind="ghost"
											labelText={<Search20 />}
											onClick={selectFolder}
											disableLabelChanges="true"
										/>
									</div>
								
									{}
								</div>
							</div>
							<div className="bx--row" />
							<div className="bx--row" />
							<div className="bx--row" />
							<div className="bx--row">
								<div className="bx--col">
									<Button className="bx--btn--secondary" type="submit" onClick={this.handleChange}>
										Cancel
									</Button>

									<Button
										className="bx--btn--primary "
										type="Submit"
										onClick={this.handleSubmit}
										// onClick={(e) => {
										// 	e.preventDefault();
										// 	this.props.updateSystemSettings();
										// }}
									>
										Save {'  	  '} &nbsp; <Save16 className="iconColor" />
									</Button>
								</div>
							</div>
							<div className="bx--row" />
							<div className="bx--row" />
							<div className="bx--row" />
						</Form>
					</Tab>
					{/* <Tab className="bx--tab" label=""></Tab>
					<Tab className="bx--tab" label=""></Tab> */}
				</Tabs>

				<PageFooter />
				{/* <AddSystemSettingUI /> */}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	systemSettings: state
});

const mapDispatchToProps = {
	updateSystemSettings,
	fetchSystemSettings
};

export default connect(mapStateToProps, mapDispatchToProps)(AddSystemSettings);
