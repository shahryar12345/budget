import {
	Accordion,
	AccordionItem,
	Button,
	Dropdown,
	InlineLoading,
	InlineNotification,
	Tag,
	TextInput,
	TooltipIcon,
	Checkbox
} from 'carbon-components-react';
import {
	resetBudgetVersions,
} from "../../../core/_actions/BudgetVersionsActions";
import { Favorite16, Information20, Save16, Search16, Information16 } from '@carbon/icons-react';
import { GetInitalData, GetAllDimensionsRelationshipData, GetScenarioData, SaveBudgetVersion, UpdateBudgetVersion, saveBudgetVersionData, saveActualBudgetVersionData, updateBudgetVersionData, GetBudgetVersionData, deleteBudgetVersionData, createSubAccounts, updateSubAccounts } from '../../../services/budget-version-service'
import { GetFullTimeEquivalentByTimePeriod } from '../../../services/fte-service'
import React, { createRef, useEffect, useState, useRef } from 'react';

import PageHeader from '../../layout/PageHeader';
import { CustomDatatable } from '../../shared/custom-datatable/custom-datatable.component'
import SaveAsBudgetVersionModal from './save-as-budget-version-modal';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateForecast } from "../../../core/_actions/ForecastActions";
import { resetBudgetVersionsFilters, setBudgetVersionsFilterOptions, setBudgetVersionsFilteredFlag, setBudgetVersionsSortedFlag, removeAllBudgetVersionsFiltersGroups } from '../../../core/_actions/BudgetVersionsActions';
import './_budget-version-form.scss';
import { compareFunction } from '../../../helpers/compare.helper';

import FilterTable from '../../layout/FilterTable/FilterTable';

import AddRowModal from '../AddRow/add-row-modal';
import { GetInflationsByBudgetVersionID } from "../../../services/inflation-service";
import { GetRaisesByBudgetVersionID } from "../../../services/raises-service";
import { processGeneralLedgerViews } from './Views/generalLedgerViews';
import FullScreenModal from "../../shared/budget-versions-modal/full-screen-modal";
import { getToken } from '../../../helpers/utils';

import { filterStatisticsDataByGroup, filterGLAccountDataByGroup, filterStaffingDataByGroup } from './Operations/budget-version-filter-operations';
import SubAccountModals from './SubAccountModals';
export function BudgetVersionForm({ match }) {
	const history = useHistory();
	const dispatch = useDispatch(); // Use to update forecast Data related to Budget version , code , name

	const forecastState = useSelector((state) => state.ForecastReducer);
	// const UserID = useSelector((state) => state.BudgetVersions.UserID);
	const userProfile = useSelector((state) => state.UserDetails.UserProfile);
	const entityData = useSelector((state) => state.MasterData.Entites);
	const glData = useSelector((state) => state.MasterData.GLAccounts);
	//const relationshipData = useSelector((state) => state.MasterData.DimensionRelationships);
	const departmentData = useSelector((state) => state.MasterData.Departments);
	const statsData = useSelector((state) => state.MasterData.Statistics);
	const payTypesData = useSelector((state) => state.MasterData.PayTypes);
	const jobCodesData = useSelector((state) => state.MasterData.JobCodes);
	const [isUnsaveModalOpen, toggleIsUnsaveModalOpen] = useState(false);
	var initialState = {
		id: '',
		code: '',
		description: '',
		comment: '',
		fiscalYearSelectedItem: null,
		timePeriodSelectedItem: null,
		budgetVersionTypeSelectedItem: null,
		statisticsSelectedItem: null,
		generalLedgerSelectedItem: null,
		staffingSelectedItem: null,
		scenarioTypeSelectedItem: null,
		formSubmitted: false,
		showNotification: false,
		showSaveAsModal: false,
		notificationType: '',
		notificationTitle: '',
		codeList: [],
		isEditForm: match.params.id ? true : false,
		isNewBudget: match.params.id ? false : true, // are we editing an existing budget or create a new one?
		formErrors: {
			codeError: "",
			descriptionError: "",
			fiscalYearIdError: "",
			budgetVersionTypeIdError: "",
		},
		showInflationNotification: false,
		selectedViews: null, // match the state defined in toolbar-service.js,
		isSomethingChange: false,
		oldState: {},
		userId: null,
		selectedRowForSubAccounts: {},
		isSubAccountModalOpen: false,
		subAccountNotification: false,
		refreshBVData: false
	}

	const filterOptions = [
		{
			id: 0,
			idProperty: 'entityID',
			codeProperty: 'entityCode',
			nameProperty: 'entityName',
			value: 'entity',
			stateId: 'Entites',
			masterId: 'Entites',
			relationshipModel: 'ENTITY',
			tableHeader: 'entities',
			sortHeader: 'Sort entities'
		},
		{
			id: 1,
			idProperty: 'departmentID',
			codeProperty: 'departmentCode',
			nameProperty: 'departmentName',
			value: 'department',
			stateId: 'Departments',
			masterId: 'Departments',
			relationshipModel: 'DEPARTMENT',
			tableHeader: 'department',
			sortHeader: 'Sort departments'
		},
		{
			id: 2,
			idProperty: 'statisticsCodeID',
			codeProperty: 'statisticsCode',
			nameProperty: 'statisticsCodeName',
			value: 'statistics',
			stateId: 'Statistics',
			masterId: 'Statistics',
			relationshipModel: 'STATISTICSCODE',
			tableHeader: 'statistics',
			sortHeader: 'Sort statistics'
		},
		{
			id: 3,
			idProperty: 'glAccountID',
			codeProperty: 'glAccountCode',
			nameProperty: 'glAccountName',
			value: 'glAccounts',
			stateId: 'Statistics',
			masterId: 'GLAccounts',
			relationshipModel: 'GLACCOUNT',
			tableHeader: 'GL account',
			sortHeader: 'Sort GL accounts'
		},
		{
			id: 4,
			idProperty: 'jobCodeID',
			codeProperty: 'jobCodeCode',
			nameProperty: 'jobCodeName',
			value: 'jobCodes',
			stateId: 'JobCodes',
			masterId: 'JobCodes',
			relationshipModel: 'JOBCODE',
			tableHeader: 'job code',
			sortHeader: 'Sort job codes'
		},
		{
			id: 5,
			idProperty: 'payTypeID',
			codeProperty: 'payTypeCode',
			nameProperty: 'payTypeName',
			value: 'payTypes',
			stateId: 'Statistics',
			masterId: 'PayTypes',
			relationshipModel: 'PAYTYPE',
			tableHeader: 'pay type',
			sortHeader: 'Sort pay types'
		}
	];

	const addRowStateInitialState = {
		newRowAdded: false,

	}
	const [state, setState] = useState(initialState);
	const [budgetVersionState, setBudgetVersionState] = useState({});
	const [detailsTableState, setDetailTableState] = useState({ unformattedData: [] });
	const [dropdownDataState, setDropdownDataState] = useState({});
	const [filterOpenState, setFilterOpenState] = useState(false);
	const [repeatedValuesCheckboxState, setRepeatedValuesCheckboxState] = useState({ currentState: true, previosState: true });
	const [tableLoadingState, setTableLoadingState] = useState(false);
	const [deletedRowState, setDeletedRowState] = useState([]);
	const [inflationState, setInflationState] = useState({ data: [] });
	const [addRowModalState, setAddRowModalState] = useState({ isOpen: false })
	const [staffingOptions, setStaffingOptions] = useState([]);
	const [fteState, setFteState] = useState([]);
	const [addRowState, setAddRowState] = useState(addRowStateInitialState);
	const detailsTableRef = useRef();
	const entityFilterTableRef = useRef(null);
	const departmentFilterTableRef = useRef(null);
	const jobCodesFilterTableRef = useRef(null);
	const detailsFilterTableRef = useRef(null);

	const budgetVersions = useSelector(state => state.BudgetVersions);
	const filters = useSelector(state => state.BudgetVersions.Filters);
	const GroupsFilters = useSelector(state => state.BudgetVersions.GroupsFilters);
	const sortDetails = useSelector(state => state.BudgetVersions.Sort);

	const [raisesState, SetRaisesState] = useState({ initialData: [] });

	const [toggleGroupedDataState, setToggleGrouedDataState] = useState({ showGroupedData: false })
	const [defaulViewData, setDefaulViewData] = useState({ withRepeated: [], withoutRepeated: [] });
	const [paginationState, setPaginationState] = useState({ itemsPerPage: 20, pageNo: 1, totalRows: 0 });

	const [dimensionRelationshipData, setdimensionRelationshipData] = useState({
		entity: [],
		statistics: [],
		department: [],
		glAccount: [],
		jobcode: [],
		payTypes: []
	});
	const [relationshipDataLoad, setrelationshipDataLoad] = useState({
		loading: true
	});

	const handletoogleGroupedData = (checked) => {
		setToggleGrouedDataState({ ...toggleGroupedDataState, showGroupedData: checked })
	}

	const handleRepeatedValueCheckboxChange = (checked) => {
		setRepeatedValuesCheckboxState({ ...repeatedValuesCheckboxState, currentState: checked })
	};

	const handleChange = (e) => {
		e.preventDefault();
		const { id, value } = e.target;
		let updatedState = { ...state, [id]: value };
		if (state.isEditForm) updatedState = { ...updatedState }

		if (!state.isEditForm && id == 'code') {
			if (state.codeList.find(item => { return item.toLowerCase() == value.toLowerCase() })) {
				updatedState.formErrors.codeError = 'Code already in use. Enter different code';
				setState(updatedState);
				return;
			}
			updatedState.code = value;
		}
		ValidateForm(updatedState);
	};


	const mapCurrentBudgetVersionToState = (timePeriods, budgetVersion, dropDownData) => {

		const updatedState = {};
		updatedState.code = budgetVersion.code ?? '';
		updatedState.description = budgetVersion.description ?? '';
		updatedState.comment = budgetVersion.comments ?? '';
		updatedState.scenarioTypeSelectedItem = budgetVersion.scenarioTypeID;
		updatedState.fiscalYearSelectedItem = budgetVersion.fiscalYearID;
		updatedState.timePeriodSelectedItem = timePeriods.find(item => item.itemTypeID == budgetVersion.timePeriodID?.timePeriodID);
		updatedState.budgetVersionTypeSelectedItem = budgetVersion.budgetVersionTypeID;
		updatedState.statisticsSelectedItem = dropDownData.statistics.find(item => item.itemTypeID == budgetVersion.adSstatisticsID?.dataScenarioID);
		updatedState.generalLedgerSelectedItem = dropDownData.gl.find(item => item.itemTypeID == budgetVersion.adSgeneralLedgerID?.dataScenarioID);
		updatedState.staffingSelectedItem = dropDownData.staffing.find(item => item.itemTypeID == budgetVersion.adSstaffingID?.dataScenarioID);
		updatedState.calculationStatus = budgetVersion.calculationStatus;
		setHeader(updatedState.code + " : " + updatedState.description);
		return updatedState;
	}

	useEffect(() => {
		// conditional response contains Codes list or Budgetversion model
		GetInitalData(match.params?.id).then(([fiscalYearsRes, budgetVersionTypesRes, scenarioTypesRes, dropdownDataRes, conditionalResponse]) => {
			setDropdownDataState({
				fiscalYears: fiscalYearsRes.data,
				budgetVersionTypes: budgetVersionTypesRes.data,
				scenarioTypes: scenarioTypesRes.data,
				statisticsData: dropdownDataRes.statistics,
				generalLedgerData: dropdownDataRes.gl,
				staffingData: dropdownDataRes.staffing
			});

			// reset filters state in redux
			dispatch(resetBudgetVersionsFilters());

			if (state.isEditForm) {
				const existingBudgetVersion = conditionalResponse;
				if (!existingBudgetVersion.success) {
					setState({ ...state, notificationTitle: 'Unable to get budget version', showNotification: true, notificationType: 'error' });
					return;
				}
				setState({
					...state,
					...mapCurrentBudgetVersionToState(fiscalYearsRes.data, existingBudgetVersion.data, dropdownDataRes),
					oldState: {
						description: existingBudgetVersion.data.description,
						comment: existingBudgetVersion.data.comments,
						fiscalYearId: existingBudgetVersion.data.timePeriodID.timePeriodID
					},
					userId: conditionalResponse?.data?.userProfileID ? conditionalResponse?.data?.userProfileID : null
					// code
					// description
					// comment
					// scenarioTypeSelectedItem
					// fiscalYearSelectedItem
					// timePeriodSelectedItem
					// budgetVersionTypeSelectedItem
					// statisticsSelectedItem
					// generalLedgerSelectedItem
					// staffingSelectedItem
				});
			}
			else {
				setState({ ...state, codeList: conditionalResponse });
			}
		})

		GetAllDimensionsRelationshipData().then(([entityRelationData, statisticsRelationData, departmentRelationData,
			glAccountRelationData, jobCodeRelationData, payTypeRelationData]) => {
			setdimensionRelationshipData({
				entity: entityRelationData.data,
				statistics: statisticsRelationData.data,
				department: departmentRelationData.data,
				glAccount: glAccountRelationData.data,
				jobcode: jobCodeRelationData.data,
				payTypes: payTypeRelationData.data
			});
			setrelationshipDataLoad({ loading: false });
		});

		GetRaisesByBudgetVersionID(match.params?.id).then(result => {
			SetRaisesState({ ...raisesState, initialData: result });
		});
	}, []);

	const dataTableType = {
		ST: 'statistics',
		GL: 'genralLedger',
		SF: 'staffing'
	}

	const setEmptyStatsTableState = (show = true) => {
		setDetailTableState({
			...detailsTableState,
			show: show,
			data: [{}, {}, {}, {}, {}, {}, {}],
			unformattedData: [],
			type: dataTableType[state.scenarioTypeSelectedItem.itemTypeCode]
		});
	}

	const setStatsTableStateFromADSData = () => {
		const scenarioId = state.scenarioTypeSelectedItem.itemTypeCode == 'ST' ? state.statisticsSelectedItem?.itemTypeID :
			state.scenarioTypeSelectedItem.itemTypeCode == 'GL' ? state.generalLedgerSelectedItem?.itemTypeID :
				state.scenarioTypeSelectedItem.itemTypeCode == 'SF' ? state.staffingSelectedItem?.itemTypeID : '';
		if (!state.scenarioTypeSelectedItem?.itemTypeID) return;
		setTableLoadingState(true);
		let authData = getToken();
		authData = JSON.parse(authData);

		GetScenarioData(state.timePeriodSelectedItem.itemTypeID, state.scenarioTypeSelectedItem.itemTypeID, scenarioId, authData?.userProfile?.userProfileID).then(response => {
			setFilterOptions(response.data);
			dispatch(resetBudgetVersionsFilters());
			setDetailTableState({ ...detailsTableState, show: true, data: mapDataForDetailsTable(response.data, false), unformattedData: response.data, type: dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] });
			setTableLoadingState(false);
		}).catch(() => {
			setTableLoadingState(false);
			setEmptyStatsTableState();
		})
	}

	const ScenarioTypeSelectedItem = () => {
		switch (state.scenarioTypeSelectedItem.itemTypeCode) {
			case 'ST':
				return state.statisticsSelectedItem?.itemTypeID;
			case 'GL':
				return state.generalLedgerSelectedItem?.itemTypeID;
			case 'SF':
				return state.staffingSelectedItem?.itemTypeID
			default:
				return;
		}
	}

	useEffect(() => {
		if (!state.timePeriodSelectedItem || !state.budgetVersionTypeSelectedItem?.itemTypeCode || !state.scenarioTypeSelectedItem) return;
		if (state.budgetVersionTypeSelectedItem?.itemTypeCode == 'F') {
			if (state.scenarioTypeSelectedItem) {
				setTableLoadingState(true);
				GetBudgetVersionData(match.params?.id, state.scenarioTypeSelectedItem.itemTypeCode).then(response => {
					setFilterOptions(response.data);
					dispatch(resetBudgetVersionsFilters());
					GetInflationsByBudgetVersionID(match.params?.id).then(result => {
						setInflationState({ ...inflationState, data: result });
						if (response.data.length) {
							setDetailTableState({ ...detailsTableState, show: true, data: mapDataForDetailsTable(response.data, false, result), unformattedData: response.data, type: dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] });
						} else {
							setEmptyStatsTableState();
						}
						setTableLoadingState(false);
					});
				}).catch(err => {
					setEmptyStatsTableState();
					setTableLoadingState(false);
				})
			}
		}
		if (state.budgetVersionTypeSelectedItem?.itemTypeCode == 'A') {
			if (ScenarioTypeSelectedItem()) {
				setStatsTableStateFromADSData();
			} else {
				setTableLoadingState(true);
				setEmptyStatsTableState();
				setTableLoadingState(false);
			}
		}

		if (window.location.href.indexOf("?i") > -1) {
			setState({ ...state, showInflationNotification: true });
		}

		// get the fte data for this time period
		const fteData = getFTEForTimePeriod(state.timePeriodSelectedItem.itemTypeID);
		if (!fteData) {
			GetFullTimeEquivalentByTimePeriod(state.timePeriodSelectedItem.itemTypeID).then(result => {
				const fteData = [...fteState];
				fteData.push({ timePeriodID: state.timePeriodSelectedItem.itemTypeID, data: result });
				setFteState(fteData);
			});
		}


	}, [state.budgetVersionTypeSelectedItem, state.timePeriodSelectedItem, state.scenarioTypeSelectedItem, state.statisticsSelectedItem, state.generalLedgerSelectedItem, state.staffingSelectedItem, state.refreshBVData])

	useEffect(() => {
		// if sort changes, we need the change to immediately
		// show up in the filter options
		if (detailsTableState.unformattedData) {
			setFilterOptions(detailsTableState.unformattedData);
		}
	}, [sortDetails]);

	useEffect(() => {
		if (!state.timePeriodSelectedItem || !state.budgetVersionTypeSelectedItem?.itemTypeCode || !state.scenarioTypeSelectedItem) return;
		if (state.budgetVersionTypeSelectedItem?.itemTypeCode == 'F') {
			if (state.scenarioTypeSelectedItem) {
				setTableLoadingState(true);
				setTimeout(() => {
					const formattedRows = mapDataForDetailsTable(detailsTableState.unformattedData, budgetVersions.filtered, inflationState.data)
					setDetailTableState({
						...detailsTableState,
						unformattedData: detailsTableState.unformattedData,
						show: true,
						data: formattedRows,
						type: dataTableType[state.scenarioTypeSelectedItem.itemTypeCode]
					});
					setTableLoadingState(false);
				}, 100);
			}
		}

		if (state.budgetVersionTypeSelectedItem?.itemTypeCode == 'A') {
			if (ScenarioTypeSelectedItem()) {

				setTableLoadingState(true);
				setDetailTableState({ ...detailsTableState, show: true, data: [] });
				setTimeout(() => {
					setDetailTableState({ ...detailsTableState, show: true, data: mapDataForDetailsTable(detailsTableState.unformattedData, budgetVersions.filtered, inflationState.data), unformattedData: detailsTableState.unformattedData, type: dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] });
					setTableLoadingState(false);
				}, 100);
			} else {
				setTableLoadingState(true);
				setTimeout(() => {
					setEmptyStatsTableState();
					setTableLoadingState(false);
				}, 100);
			}
		}
	}, [state.selectedViews, toggleGroupedDataState.showGroupedData]);

	const setFilterOptions = (data) => {

		if (data && Array.isArray(data) && data.length > 0) {
			let filterEntities = [];
			let filterDepartments = [];
			let filterJobCodes = [];
			let filterDetails = [];

			// generate unique lists of entities, departments, and details
			data.forEach(current => {
				// push unique entities to array
				if (!filterEntities.find(entity => entity.id === current.entityid)) {
					filterEntities.push({
						id: current.entityid,
						code: current.entitycode,
						name: current.entityname
					});
				}
				// push unique departments to array
				if (!filterDepartments.find(dept => dept.id === current.departmentid)) {
					filterDepartments.push({
						id: current.departmentid,
						code: current.departmentcode,
						name: current.departmentname
					});
				}
				// push unique job codes to array
				if (!filterJobCodes.find(jobCode => jobCode.id === current.jobcodeid)) {
					filterJobCodes.push({
						id: current.jobcodeid,
						code: current.jobcodecode,
						name: current.jobcodename
					});
				}
				// push unique details to array
				const detailId = current.statisticsid || current.glaccountid || current.paytypeid;
				if (!filterDetails.find(detail => detail.id === detailId)) {
					filterDetails.push({
						id: current.statisticsid || current.glaccountid || current.paytypeid,
						code: current.statisticscode || current.glaccountcode || current.paytypecode,
						name: current.statisticsname || current.glaccountname || current.paytypename
					});
				}
			});

			// push options to state
			dispatch(setBudgetVersionsFilterOptions('Entites', filterEntities.sort((a, b) => dimensionCompareFunction('Entites', a, b))));
			dispatch(setBudgetVersionsFilterOptions('Departments', filterDepartments.sort((a, b) => dimensionCompareFunction('Departments', a, b))));
			dispatch(setBudgetVersionsFilterOptions('JobCodes', filterJobCodes.sort((a, b) => dimensionCompareFunction('JobCodes', a, b))));
			dispatch(setBudgetVersionsFilterOptions('Statistics', filterDetails.sort((a, b) => dimensionCompareFunction('Statistics', a, b))));

			// On change of scenario type group selection should be empty in store. 
			dispatch(removeAllBudgetVersionsFiltersGroups('Entites'));
			dispatch(removeAllBudgetVersionsFiltersGroups('Departments'));
			dispatch(removeAllBudgetVersionsFiltersGroups('JobCodes'));
			dispatch(removeAllBudgetVersionsFiltersGroups('Statistics'));
		} else {
			// If API call returns anything other than a valid array, reset filters
			dispatch(setBudgetVersionsFilterOptions('Entites', []));
			dispatch(setBudgetVersionsFilterOptions('Departments', []));
			dispatch(setBudgetVersionsFilterOptions('JobCodes', []));
			dispatch(setBudgetVersionsFilterOptions('Statistics', []));
		}
	};

	const dimensionCompareFunction = (dimension, a, b) => {
		const sortDirection = sortDetails[dimension].sortDirection;
		const sortFactor = sortDetails[dimension].sortFactor;

		return compareFunction(sortDirection, a[sortFactor], b[sortFactor]);
	};

	const updateDetailsTableState = (applyFilter = true) => {
		setDetailTableState({ ...detailsTableState, data: mapDataForDetailsTable(detailsTableState.unformattedData, applyFilter, inflationState.data), type: dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] });
	};

	const getDetailsObject = (row, applyFilter) => {
		const detailsRowObject = {
			january: row.january,
			february: row.february,
			march: row.march,
			april: row.april,
			may: row.may,
			june: row.june,
			july: row.july,
			august: row.august,
			september: row.september,
			october: row.october,
			november: row.november,
			december: row.december,
			dataid: row.dataid,
			uniqueCombinationKey: row.uniqueCombinationKey,
			rowAdded: row["rowAdded"],
			colType: 'details',
			fteTotal: row.fteTotal ? row.fteTotal : 0,
			rowTotal: row.rowTotal ? row.rowTotal : 0
		}
		if (dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'statistics') {
			detailsRowObject.details = {
				id: row.statisticsid,
				name: row.statisticsname,
				code: row.statisticscode,
				rowId: row?.dataid,
				isSubAccOption: true,
				isSubAccExist: row?.isSubAccExist ? true : false
			}
		}
		else if (dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'genralLedger') {
			detailsRowObject.details = {
				id: row.glaccountid,
				name: row.glaccountname,
				code: row.glaccountcode,
				rowId: row?.dataid,
				isSubAccOption: true,
				isSubAccExist: row?.isSubAccExist ? true : false

			}
		} else if (dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'staffing') {
			detailsRowObject.details = {
				id: row.paytypeid,
				name: row.paytypename,
				code: row.paytypecode,
				rowId: row?.dataid

			}
		}

		if (repeatedValuesCheckboxState.currentState && applyFilter) {
			detailsRowObject.department = {
				id: row.departmentid,
				name: row.departmentname,
				code: row.departmentcode
			};
			detailsRowObject.entity = {
				id: row.entityid,
				name: row.entityname,
				code: row.entitycode
			};
			if (dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'staffing') detailsRowObject.jobCode = {
				id: row.jobcodeid,
				name: row.jobcodename,
				code: row.jobcodecode
			}
		}
		return detailsRowObject;
	}

	const getFiscalMonths = (row, inflationData) => {
		const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		const result = [];

		const index = monthNames.findIndex(month => month.toUpperCase() === row.startmonth.toUpperCase());
		for (var i = index; i < monthNames.length; i++) {
			result.push({ month: monthNames[i], inflationPercent: 0 });
		}
		if (index > 0) {
			for (var i = 0; i < index; i++) {
				result.push({ month: monthNames[i], inflationPercent: 0 });
			}
		}

		for (var j = 0; j < inflationData?.length; j++) {
			const startMonthIndex = result.findIndex(r => r.month.toUpperCase() === inflationData[j].startMonth.itemTypeCode.toUpperCase());
			const endMonthIndex = result.findIndex(r => r.month.toUpperCase() === inflationData[j].endMonth.itemTypeCode.toUpperCase());

			for (var i = startMonthIndex; i <= endMonthIndex; i++) {
				result[i].inflationPercent += inflationData[j].inflationPercent;
			}
		}

		return result;
	}

	const getInflationForMonth = (month, fiscalMonths) => {
		const inflation = 1;
		const fyMonth = fiscalMonths.find(fm => fm.month.toUpperCase() === month.toUpperCase());
		if (fyMonth) {
			return fyMonth.inflationPercent * .01;
		}
		return inflation;
	};

	const getInflationObject = (row, applyFilter, inflationData) => {
		const rowInflationData = inflationData.filter(data => data.entity.entityID === row.entityid && data.department.departmentID === row.departmentid && data.glAccount.glAccountID === row.glaccountid);
		if (rowInflationData.length === 0) {
			return null;
		}
		const fyMonths = getFiscalMonths(row, rowInflationData);

		let details = {};
		if (dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'statistics') {
			details = {
				id: row.statisticsid,
				name: row.statisticsname,
				code: row.statisticscode
			}
		}
		else if (dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'genralLedger') {
			details = {
				id: row.glaccountid,
				name: row.glaccountname,
				code: row.glaccountcode
			}
		} else if (dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'staffing') {
			details = {
				id: row.paytypeid,
				name: row.paytypename,
				code: row.paytypecode
			}
		}

		const statsRowObject = {
			statistics: {
				id: row.statisticsid ?? row.glaccountid,
				name: row.statisticsname ?? row.glaccountname,
				code: row.statisticscode ?? row.glaccountcode
			},
			january: row.january * getInflationForMonth("JAN", fyMonths),
			february: row.february * getInflationForMonth("FEB", fyMonths),
			march: row.march * getInflationForMonth("MAR", fyMonths),
			april: row.april * getInflationForMonth("APR", fyMonths),
			may: row.may * getInflationForMonth("MAY", fyMonths),
			june: row.june * getInflationForMonth("JUN", fyMonths),
			july: row.july * getInflationForMonth("JUL", fyMonths),
			august: row.august * getInflationForMonth("AUG", fyMonths),
			september: row.september * getInflationForMonth("SEP", fyMonths),
			october: row.october * getInflationForMonth("OCT", fyMonths),
			november: row.november * getInflationForMonth("NOV", fyMonths),
			december: row.december * getInflationForMonth("DEC", fyMonths),
			dataid: row.dataid,
			details
		}
		if (repeatedValuesCheckboxState.currentState && applyFilter) {
			statsRowObject.department = {
				name: row.departmentname,
				code: row.departmentcode
			};
			statsRowObject.entity = {
				name: row.entityname,
				code: row.entitycode
			};
		}
		return statsRowObject;
	}


	const getDepartmentObject = (row, applyFilter) => {
		const departmentRowObject = {
			department: {
				id: row.departmentid,
				name: row.departmentname,
				code: row.departmentcode,
			},
			childRows: [
				dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'staffing' ? getJobCodeObj(row, applyFilter) :
					getDetailsObject(row, applyFilter)
			],
			rowAdded: row["rowAdded"],
			colType: 'department'
		}

		if (repeatedValuesCheckboxState.currentState && applyFilter) {
			departmentRowObject.entity = {
				id: row.entityid,
				name: row.entityname,
				code: row.entitycode
			};
		}
		return departmentRowObject;
	}

	const getJobCodeObj = (row, applyFilter) => {
		const jobCodeObj = {
			jobCode: {
				id: row.jobcodeid,
				name: row.jobcodename,
				code: row.jobcodecode
			},
			childRows: [
				getDetailsObject(row, applyFilter)
			],
			rowAdded: row["rowAdded"],
			colType: 'jobCode'
		}

		if (repeatedValuesCheckboxState.currentState && applyFilter) {
			jobCodeObj.department = {
				id: row.departmentid,
				name: row.departmentname,
				code: row.departmentcode
			};
			jobCodeObj.entity = {
				id: row.entityid,
				name: row.entityname,
				code: row.entitycode
			};
		}
		return jobCodeObj;
	}

	const getDefaultGridViewRow = (row, applyFilter) => {
		let updatedRow = {
			entity: {
				id: row.entityid,
				name: row.entityname,
				code: row.entitycode,
				rowAdded: row["rowAdded"]
			},
			department: {
				id: row.departmentid,
				name: row.departmentname,
				code: row.departmentcode,
				rowAdded: row["rowAdded"]
			},
			january: row.january,
			february: row.february,
			march: row.march,
			april: row.april,
			may: row.may,
			june: row.june,
			july: row.july,
			august: row.august,
			september: row.september,
			october: row.october,
			november: row.november,
			december: row.december,
			dataid: row.dataid,
			uniqueCombinationKey: row.uniqueCombinationKey,
			rowAdded: row["rowAdded"],
			colType: 'details',
			fteTotal: row.fteTotal ? row.fteTotal : 0,
			rowTotal: row.rowTotal ? row.rowTotal : 0
		};
		if (dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'statistics') {
			updatedRow.details = {
				id: row.statisticsid,
				name: row.statisticsname,
				code: row.statisticscode,
				rowId: row?.dataid,
				isSubAccOption: true,
				isSubAccExist: row?.isSubAccExist ? true : false
			}
		}
		else if (dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'genralLedger') {
			updatedRow.details = {
				id: row.glaccountid,
				name: row.glaccountname,
				code: row.glaccountcode,
				rowId: row?.dataid,
				isSubAccOption: true,
				isSubAccExist: row?.isSubAccExist ? true : false
			}
		} else if (dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'staffing') {
			updatedRow["jobCode"] = {
				id: row.jobcodeid,
				name: row.jobcodename,
				code: row.jobcodecode
			}
			updatedRow.details = {
				id: row.paytypeid,
				name: row.paytypename,
				code: row.paytypecode,
				rowId: row?.dataid
			}
		}

		return updatedRow
	}


	const getSortedUnGroupedData = (data) => {
		let result = [];
		// First Sort the data by entity in asc order;
		data.sort((a, b) => compareFunction("ascending", a.entity["code"], b.entity["code"]))
		let currEntity = "";
		data.forEach((item) => {
			if (currEntity !== item.entity.code) {
				// Now sort the department of a specific entity.
				currEntity = item.entity.code;
				let currData = data.filter((searchItem) => searchItem.entity.code === currEntity)
				currData.sort((a, b) => compareFunction("ascending", a.department["code"], b.department["code"]))
				let currDept = "";
				currData.forEach((departmentItem) => {
					if (currDept !== departmentItem.department.code) {
						currDept = departmentItem.department.code;
						let currDataDept = currData.filter((searchItemDept) => searchItemDept.department.code === currDept);
						if (dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'statistics'
							|| dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'genralLedger') {
							// In case of statistic and GL , First sort the data by detail column.
							currDataDept.sort((a, b) => compareFunction("ascending", a.details["code"], b.details["code"]));
							result = [...result, ...currDataDept];
						}
						else if (dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'staffing') {
							// In case of Staffing , First sort the data by Job code.
							currDataDept.sort((a, b) => compareFunction("ascending", a.jobCode["code"], b.jobCode["code"]));
							let currJobCode = "";
							currDataDept.forEach((jobCodeItem) => {
								if (currJobCode !== jobCodeItem.jobCode.code) {
									currJobCode = jobCodeItem.jobCode.code;
									// At the end sort the data by 'Detail' column, in staffing case its 'Paytype.
									let currDataJobCode = currDataDept.filter((searchItemjobCode) => searchItemjobCode.jobCode.code === currJobCode);
									currDataJobCode.sort((a, b) => compareFunction("ascending", a.details["code"], b.details["code"]));
									result = [...result, ...currDataJobCode];
								}
							});
						}
					}
				});
			}
		});
		return result;
	}

	const removeRepetedValuesFromUnGroupedData = (dataInput) => {
		// TODO Need to update for grouped Data
		let data = [...dataInput];
		let currEntity = "";
		let currDept = "";
		let currJobCode = "";
		let entityChanged = false;
		let deptChanged = false;

		let updatedData = data.map((item) => {
			let updatedItem = JSON.parse(JSON.stringify(item));
			if (currEntity === item.entity.code) {
				updatedItem.entity = JSON.parse(JSON.stringify({ ...updatedItem.entity, id: "", code: "", name: "" }));
				entityChanged = false;
			} else {
				currEntity = item.entity.code;
				entityChanged = true;
			}

			if (currDept === item.department.code && !entityChanged) {
				updatedItem.department = { ...updatedItem.department, id: "", code: "", name: "" };
				deptChanged = false;
			} else {
				currDept = item.department.code;
				deptChanged = true;
			}
			if (dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'staffing') {
				if (currJobCode === item.jobCode.code && !deptChanged) {
					updatedItem.jobCode = { ...updatedItem.jobCode, id: "", code: "", name: "" };;
				} else {
					currJobCode = item.jobCode.code
				}
			}
			return updatedItem;
		});
		return updatedData;
	}

	const paginationHandler = (e) => {
		let unGroupData = [...defaulViewData.withRepeated];
		let updatedData = [];
		setPaginationState({ ...paginationState, itemsPerPage: e.pageSize, pageNo: e.page })
		if (repeatedValuesCheckboxState.currentState) {
			updatedData = unGroupData.slice((e.page - 1) * e.pageSize, (e.page - 1) * e.pageSize + e.pageSize);
		}
		else {
			updatedData = removeRepetedValuesFromUnGroupedData([...unGroupData.slice((e.page - 1) * e.pageSize, (e.page - 1) * e.pageSize + e.pageSize)]);
		}
		setDetailTableState({ ...detailsTableState, data: [...updatedData] });
	};

	const mapDataForDetailsTable = (data, applyFilter = true, inflationData, selectedViews) => {
		if (!selectedViews) selectedViews = state.selectedViews;
		// const formattedData = [];
		// if staffing data, check available options
		if (dataTableType[state.scenarioTypeSelectedItem?.itemTypeCode] == 'staffing') {
			const itemTypes = [... new Set(data.map(datum => datum['staffingdatatype'] || datum['staffingdatatypeID'] || datum['staffingaccounttypeid']))];
			setStaffingOptions(itemTypes);
		}


		data = processViews(data, inflationData, selectedViews);
		//if requested, filter data before formatting
		let filteredData = applyFilter ? filterData(data) : data;
		if (applyFilter) {
			return filteredData;
		}

		//filteredData = 
		if (!toggleGroupedDataState.showGroupedData) {
			// update data for default view here.
			let unGroupData = [];
			filteredData.forEach((row) => {
				unGroupData.push(getDefaultGridViewRow(row, applyFilter));
			});

			if (unGroupData.length > 0) {
				// Sort the updated data here.
				unGroupData = getSortedUnGroupedData(unGroupData);
			}

			// Remove the repeatedValues in checkbox is not checked.
			if (repeatedValuesCheckboxState.currentState) {
				// Return data with repeated values in a row
				setDefaulViewData({ ...defaulViewData, withRepeated: [...unGroupData] });
				// Reset pagination on every new data mapping
				setPaginationState({ ...paginationState, itemsPerPage: 20, pageNo: 1, totalRows: unGroupData.length })
				return unGroupData.slice(0, 20);
			} else {
				// Reset pagination on every new data mapping
				setPaginationState({ ...paginationState, itemsPerPage: 20, pageNo: 1, totalRows: unGroupData.length })
				// Return data after removing repeated values;
				return removeRepetedValuesFromUnGroupedData(unGroupData.slice(0, 20));
			}
		}


		const formattedData = [];
		filteredData.forEach(row => {
			let firstLevelRow = formattedData.find(item => item.entity.code == row.entitycode);
			if (firstLevelRow) {
				firstLevelRow.rowAdded = firstLevelRow.rowAdded || row.rowAdded;
				let secondLevelRow = firstLevelRow.childRows.find(item => item.department.code == row.departmentcode);
				if (secondLevelRow) {
					secondLevelRow.rowAdded = secondLevelRow.rowAdded || row.rowAdded;
					if (dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'staffing') {
						let thirdLevelRow = secondLevelRow.childRows.find(item => item.jobCode.code == row.jobcodecode);
						if (thirdLevelRow) {
							thirdLevelRow.childRows.push(getDetailsObject(row, applyFilter));
						}
						else {
							secondLevelRow.childRows.push(getJobCodeObj(row, applyFilter))
						}
					} else secondLevelRow.childRows.push(getDetailsObject(row, applyFilter));
				}
				else {
					firstLevelRow.childRows.push(getDepartmentObject(row, applyFilter));
				}
			}
			else {
				formattedData.push({
					entity: {
						id: row.entityid,
						name: row.entityname,
						code: row.entitycode,
						rowAdded: row["rowAdded"]

					},
					childRows: [
						getDepartmentObject(row, applyFilter)
					],
					rowAdded: row["rowAdded"],
					colType: 'entity'
				})
			}
		});
		// todo: below code will be fixed to make sorting work against Staffing filter ticket 

		if (state.scenarioTypeSelectedItem?.itemTypeCode == 'SF') return getGroupedData({ childRows: formattedData }).childRows.map((item) => {
			return {
				...item,
				topParentsRow: true
			}
		}); // topParentsRow will use in custom-datatable-component for intentation handling

		// sort formatted data
		const sortedData = formattedData.map(firstRow => {
			return {
				...firstRow,
				childRows: firstRow.childRows.map(secondRow => {
					return {
						...secondRow,
						childRows: secondRow.childRows.sort((a, b) => dimensionCompareFunction('Statistics', a.details, b.details))
					}
				}).sort((a, b) => dimensionCompareFunction('Departments', a.department, b.department))
			}
		}).sort((a, b) => dimensionCompareFunction('Entites', a.entity, b.entity));

		let groupData = getGroupedData({ childRows: sortedData }).childRows.map((item) => {
			return {
				...item,
				topParentsRow: true
			}
		});
		return groupData;
	}

	const getGroupedData = (row) => {
		if (row.childRows) {
			row.childRows.forEach(child => {
				getGroupedData(child);
			})
			row.childRows = getGrouped(row.childRows);
		}
		return row;
	}

	const getSingleLevelGroupedRows = (rows, source, type, idText, codeText, nameText, dept = 3) => {
		const grouped = [];
		rows.forEach(child => {
			const val = source.find(e => e[idText] == child[type].id);
			if (val?.parentID) {
				child.grouped = true;
				const existing = grouped.find(g => g[type].id == val.parentID);
				if (existing) {
					child = { ...child, childOrder: existing.childRows.length + 1, dept: dept }
					existing.childRows.push(child);
				} else {
					child = { ...child, childOrder: 1, dept: dept }
					const parent = source.find(e => e[idText] == val.parentID)
					grouped.push({
						...child,
						[type]: {
							id: parent[idText],
							code: parent[codeText],
							name: parent[nameText],
						},
						childRows: [
							child
						]
					});
					// grouped.push(
					// {
					// [type] : {
					// 	id: parent[idText],
					// 		code: parent[codeText],
					// 		name: parent[nameText]
					// }	
					// ,childRows: [{
					// 	[type]: {
					// 		id: parent[idText],
					// 		code: parent[codeText],
					// 		name: parent[nameText]
					// 	},
					// 	childRows: [
					// 		child
					// 	]
					// 	}]
					// });
				}
			}
			else {
				child = { ...child, dept: dept }
				grouped.push(child);
			}
		})
		// For Multi Level.

		if (dept > 0) {

			return getSingleLevelGroupedRows(grouped, source, type, idText, codeText, nameText, dept - 1);
		} else {

			return grouped;
		}
	}


	const getGrouped = (rows) => {
		if (rows.length) {
			if (rows[0].colType == 'details') {
				return state.scenarioTypeSelectedItem?.itemTypeCode == 'SF' ? getSingleLevelGroupedRows(rows, payTypesData.map(pt => { return { ...pt, parentID: dimensionRelationshipData.payTypes.find(r => r.childid == pt.payTypeID)?.parentid } }), 'details', 'payTypeID', 'payTypeCode', 'payTypeName') :
					state.scenarioTypeSelectedItem?.itemTypeCode == 'ST' ? getSingleLevelGroupedRows(rows, statsData.map(st => { return { ...st, parentID: dimensionRelationshipData.statistics.find(r => r.childid == st.statisticsCodeID)?.parentid } }), 'details', 'statisticsCodeID', 'statisticsCode', 'statisticsCodeName') :
						state.scenarioTypeSelectedItem?.itemTypeCode == 'GL' ? getSingleLevelGroupedRows(rows, glData.map(gl => { return { ...gl, parentID: dimensionRelationshipData.glAccount.find(r => r.model == 'GLACCOUNT' && r.childid == gl.glAccountID)?.parentid } }), 'details', 'glAccountID', 'glAccountCode', 'glAccountName') : [];
			} else if (rows[0].colType == 'entity') {
				return getSingleLevelGroupedRows(rows, entityData.map(et => { return { ...et, parentID: dimensionRelationshipData.entity.find(r => r.childid == et.entityID)?.parentid } }), 'entity', 'entityID', 'entityCode', 'entityName');
			} else if (rows[0].colType == 'department') {
				return getSingleLevelGroupedRows(rows, departmentData.map(dep => { return { ...dep, parentID: dimensionRelationshipData.department.find(r => r.childid == dep.departmentID)?.parentid } }), 'department', 'departmentID', 'departmentCode', 'departmentName')[0].childRows;
			} else if (rows[0].colType == 'jobCode') {
				return getSingleLevelGroupedRows(rows, jobCodesData.map(jc => { return { ...jc, parentID: dimensionRelationshipData.jobcode.find(r => r.childid == jc.jobCodeID)?.parentid } }), 'jobCode', 'jobCodeID', 'jobCodeCode', 'jobCodeName');
			}
		} else {
			return []
		}
	}

	const handleViewsChange = (views) => {
		setState({ ...state, selectedViews: views });
		// mapDataForDetailsTable(detailsTableState.unformattedData, true, inflationState.data, views);
	}

	const processViews = (data, inflationData, selectedViews) => {
		let results = [];
		switch (dataTableType[state.scenarioTypeSelectedItem?.itemTypeCode]) {
			case "genralLedger":
				results = processGeneralLedgerViews(data, state.selectedViews, inflationData);
				break;
			case "staffing":
				results = processStaffingViews(data, selectedViews);
				break;
			default:
				results = data;
				break;
		}

		return results;
	}

	const processStaffingViews = (data, selectedViews) => {
		let results = [];
		let suffix = " Hours";
		// hours
		// if nothing is in selectedViews, go with Hours as default
		// if (selectedViews?.totalHours || (!selectedViews?.totalHours && !selectedViews?.wageRate && !selectedViews?.preRaiseDollars && !selectedViews?.raiseDollars && !selectedViews?.totalStaffingDollars && !selectedViews?.fte && !selectedViews?.raiseRate && !selectedViews?.runRate && !selectedViews?.payTypeDistribution)) {
		if (selectedViews?.totalHours || !selectedViews) {
			results = data.filter(row => row.staffingdatatype === "Hours" || row.staffingaccounttypeid === 108);
		}

		// average wage rate
		if (selectedViews?.wageRate) {
			suffix = " wage rate";
			results = data.filter(row => row.staffingdatatype === "Average Wage" || row.staffingaccounttypeid === 1113);
		}

		// pre-raise dollars
		if (selectedViews?.preRaiseDollars) {
			// if actual, return just dollars
			results = calculatePreRaiseDollars(data);
			suffix = " pre-raise dollars";
		}

		// raise dollars
		if (selectedViews?.raiseDollars) {
			// use the raise rate from the API method
			results = calculateRaiseDollars(data);
			suffix = " raise dollars";
		}

		// total staffing dollars
		if (selectedViews?.totalStaffingDollars) {
			const raiseDollars = calculateRaiseDollars(data);
			const preRaisesDollars = calculatePreRaiseDollars(data);
			preRaisesDollars.forEach(preRaiseRowData => {
				const raiseRow = raiseDollars.find(raise => raise.entityid === preRaiseRowData.entityid && raise.departmentid === preRaiseRowData.departmentid && raise.jobcodeid === preRaiseRowData.jobcodeid && raise.paytypeid === preRaiseRowData.paytypeid);
				if (raiseRow) {
					const data = {
						...preRaiseRowData,
						january: preRaiseRowData.january + raiseRow?.january,
						february: preRaiseRowData.february + raiseRow?.february,
						march: preRaiseRowData.march + raiseRow?.march,
						april: preRaiseRowData.april + raiseRow?.april,
						may: preRaiseRowData.may + raiseRow?.may,
						june: preRaiseRowData.june + raiseRow?.june,
						july: preRaiseRowData.july + raiseRow?.july,
						august: preRaiseRowData.august + raiseRow?.august,
						september: preRaiseRowData.september + raiseRow?.september,
						october: preRaiseRowData.october + raiseRow?.october,
						november: preRaiseRowData.november + raiseRow?.november,
						december: preRaiseRowData.december + raiseRow?.december,
					}
					results.push(data);
				}
				else {
					results.push(preRaiseRowData);

				}
			});
			suffix = " total salary";
		}

		// fte
		if (state.selectedViews?.fte) {
			suffix = " FTE";
			// hours / fte divisor
			const hours = data.filter(row => row.staffingdatatype === "Hours" || row.staffingaccounttypeid === 108);
			hours.forEach(hourRow => {
				// if no divisor for row, show 'n/a' for the value in the month column
				const hour = JSON.parse(JSON.stringify(hourRow));
				const divisors = fteState.find(fte => { return fte.timePeriodID === state.timePeriodSelectedItem.itemTypeID });
				if (divisors) {
					const divisor = divisors.data.find(d => { return d.entityid === hour.entityid && d.departmentid === hour.departmentid && d.jobCodeid === hour.jobCodeid });
					if (divisor) {
						// ABS-780
						hour["fteTotal"] = divisor.january + divisor.february + divisor.march + divisor.april + divisor.may +
							divisor.june + divisor.july + divisor.august + divisor.september + divisor.october + divisor.november + divisor.december;
						hour["rowTotal"] = hour.january + hour.february + hour.march + hour.april + hour.may +
							hour.june + hour.july + hour.august + hour.september + hour.october + hour.november + hour.december;
						hour.january = hour.january ? hour.january / (divisor.january ? divisor.january : 1) : 0;
						hour.february = hour.february ? hour.february / (divisor.february ? divisor.february : 1) : 0;
						hour.march = hour.march ? hour.march / (divisor.march ? divisor.march : 1) : 0;
						hour.april = hour.april ? hour.april / (divisor.april ? divisor.april : 1) : 0;
						hour.may = hour.may ? hour.may / (divisor.may ? divisor.may : 1) : 0;
						hour.june = hour.june ? hour.june / (divisor.june ? divisor.june : 1) : 0;
						hour.july = hour.july ? hour.july / (divisor.july ? divisor.july : 1) : 0;
						hour.august = hour.august ? hour.august / (divisor.august ? divisor.august : 1) : 0;
						hour.september = hour.september ? hour.september / (divisor.september ? divisor.september : 1) : 0;
						hour.october = hour.october ? hour.october / (divisor.october ? divisor.october : 1) : 0;
						hour.november = hour.november ? hour.november / (divisor.november ? divisor.november : 1) : 0;
						hour.december = hour.december ? hour.december / (divisor.december ? divisor.december : 1) : 0;
					}
					else {
						hour.january = 0;
						hour.february = 0;
						hour.march = 0;
						hour.april = 0;
						hour.may = 0;
						hour.june = 0;
						hour.july = 0;
						hour.august = 0;
						hour.september = 0;
						hour.october = 0;
						hour.november = 0;
						hour.december = 0;
						hour.fteTotal = 0;
						hour.rowTotal = 0;
					}
				}
				else {
					hour.january = 0;
					hour.february = 0;
					hour.march = 0;
					hour.april = 0;
					hour.may = 0;
					hour.june = 0;
					hour.july = 0;
					hour.august = 0;
					hour.september = 0;
					hour.october = 0;
					hour.november = 0;
					hour.december = 0;
					hour.fteTotal = 0;
					hour.rowTotal = 0;
				}
				results.push(hour);
			});
		}

		// raise rate
		if (selectedViews?.raiseRate) {
			suffix = " raise rate";
			results = getRaiseRate(data);
		}

		// run rate
		if (selectedViews?.runRate) {
			suffix = " run rate";
			results = getRunRate(data);
		}

		// pay type distribution
		if (selectedViews?.payTypeDistribution) {
			suffix = " pay type distribution";
			results = getPayTypeDistribution(data);
		}

		if (selectedViews?.emptyRows) {
			results = results.filter(dt => dt.january === 0 && dt.february === 0 && dt.march === 0 && dt.april === 0 && dt.may === 0 && dt.june === 0 && dt.july === 0 && dt.august === 0 && dt.september === 0 && dt.october === 0 && dt.november === 0 && dt.december)
		}

		// add the appropriate suffix
		results.forEach(result => {
			result.paytypename = suffix;
		});
		return results;
	}

	const getPayTypeDistribution = (data) => {
		const results = [];

		const hoursData = data.filter(row => row.staffingdatatype === "Pay Type Distribution" || row.staffingdatatypeID === 1114);
		// const hoursData = data.filter(row => row.staffingdatatype === "Hours" || row.staffingaccounttypeid === 108 ||  row.staffingdatatypeID === 107);

		if (hoursData.length > 0) {
			hoursData.forEach(hourRow => {
				const hour = JSON.parse(JSON.stringify(hourRow));
				// is there a corresponding PayTypeDistribution row for this entity/department/job code/pay type? 
				const payTypeDistribution = data.find(d => { return d.entityid === hour.entityid && d.departmentid === hour.departmentid && d.jobcodeid === hour.jobcodeid && d.paytypeid === hour.paytypeid && d.staffingdatatype === "Pay Type Distribution" });
				if (payTypeDistribution) {
					hour.january = payTypeDistribution.january;
					hour.february = payTypeDistribution.february;
					hour.march = payTypeDistribution.march;
					hour.april = payTypeDistribution.april;
					hour.may = payTypeDistribution.may;
					hour.june = payTypeDistribution.june;
					hour.july = payTypeDistribution.july;
					hour.august = payTypeDistribution.august;
					hour.september = payTypeDistribution.september;
					hour.october = payTypeDistribution.october;
					hour.november = payTypeDistribution.november;
					hour.december = payTypeDistribution.december;
				}
				else {
					hour.january = 0;
					hour.february = 0;
					hour.march = 0;
					hour.april = 0;
					hour.may = 0;
					hour.june = 0;
					hour.july = 0;
					hour.august = 0;
					hour.september = 0;
					hour.october = 0;
					hour.november = 0;
					hour.december = 0;
				}
				results.push(hour);
			});
		}

		return results;

	}

	const getRunRate = (data) => {
		const runRateResults = [];
		const hoursData = data.filter(row => row.staffingdatatype === "Hours" || row.staffingaccounttypeid === 108);

		if (hoursData.length > 0) {
			// apply calculation -> hours x average wage rate
			hoursData.forEach(hourRow => {
				const hour = JSON.parse(JSON.stringify(hourRow));
				if (hour.dimensionsrow) {
					// if we have a dimensionRow, show the user the ratio

					hour["rowTotal"] = hour.dimensionsrow.ratio;
					hour.january = hour.dimensionsrow.ratio;
					hour.february = hour.dimensionsrow.ratio;
					hour.march = hour.dimensionsrow.ratio;
					hour.april = hour.dimensionsrow.ratio;
					hour.may = hour.dimensionsrow.ratio;
					hour.june = hour.dimensionsrow.ratio;
					hour.july = hour.dimensionsrow.ratio;
					hour.august = hour.dimensionsrow.ratio;
					hour.september = hour.dimensionsrow.ratio;
					hour.october = hour.dimensionsrow.ratio;
					hour.november = hour.dimensionsrow.ratio;
					hour.december = hour.dimensionsrow.ratio;
				}
				else {
					hour.january = 0;
					hour.february = 0;
					hour.march = 0;
					hour.april = 0;
					hour.may = 0;
					hour.june = 0;
					hour.july = 0;
					hour.august = 0;
					hour.september = 0;
					hour.october = 0;
					hour.november = 0;
					hour.december = 0;
				}
				runRateResults.push(hour);
			});
		}

		return runRateResults;
	}

	const calculateRaiseDollars = (data) => {
		const raiseDollarsResults = [];
		let itemTypeId = "staffingaccounttypeid";
		if (data[0]?.staffingdatatypeID !== undefined) {
			itemTypeId = "staffingdatatypeID";
		}

		// const hoursData = data.filter(row => row.staffingdatatype === "Hours" || row.staffingaccounttypeid === 108);
		//const dollarsData = data.filter(row => row.staffingdatatype === "Dollars" || row.staffingaccounttypeid === 107);
		const dollarsData = calculatePreRaiseDollars(data);

		const fullMonthsFY = getFullMonthsForFY();
		const shortMonthsFY = getShortMonthsForFY();

		// hoursData.forEach(hourRow => {
		dollarsData.forEach(hourRow => {
			const hour = JSON.parse(JSON.stringify(hourRow));
			fullMonthsFY.forEach(m => hour[m] = 0);
			let raisesRates = raisesState.initialData.filter(raiseRow => { return raiseRow.entity.entityID === hourRow.entityid && raiseRow.department.departmentID === hourRow.departmentid && raiseRow.jobCode.jobCodeID === hourRow.jobcodeid && raiseRow.payType.payTypeID === hourRow.paytypeid });
			let parentRaisesRates = []
			const payTypeWithParentId = dimensionRelationshipData.payTypes.filter(apt => hourRow.paytypeid === apt.childid)
			for (let dt of payTypeWithParentId) {
				parentRaisesRates = raisesState.initialData.filter(raiseRow => { return raiseRow.entity.entityID === hourRow.entityid && raiseRow.department.departmentID === hourRow.departmentid && raiseRow.jobCode.jobCodeID === hourRow.jobcodeid && raiseRow.payType.payTypeID === dt.parentid });
				if (parentRaisesRates.length) break;
			}
			if (raisesRates.length && parentRaisesRates.length) {
				raisesRates.forEach(raise => {
					const startMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === raise.startMonth.itemTypeCode);
					const endMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === raise.endMonth.itemTypeCode);
					const startMonthIndexParent = shortMonthsFY.findIndex(month => month.toUpperCase() === parentRaisesRates[0].startMonth.itemTypeCode);
					const endMonthIndexParent = shortMonthsFY.findIndex(month => month.toUpperCase() === parentRaisesRates[0].endMonth.itemTypeCode);
					for (var i = 0; i <= 12; i++) {
						if (i >= startMonthIndex && i >= startMonthIndexParent && i <= endMonthIndex && i <= endMonthIndexParent) {
							hour[fullMonthsFY[i]] = hourRow[fullMonthsFY[i]] * ((raise.wageAdjustmentPercent + parentRaisesRates[0].wageAdjustmentPercent) * .01);
						}
						else if (i >= startMonthIndex && i <= endMonthIndex) {
							hour[fullMonthsFY[i]] = hourRow[fullMonthsFY[i]] * (raise.wageAdjustmentPercent * .01);
						}
						else if (i >= startMonthIndexParent && i <= endMonthIndexParent) {
							hour[fullMonthsFY[i]] = hourRow[fullMonthsFY[i]] * (parentRaisesRates[0].wageAdjustmentPercent * .01);
						}
					}
				});
				raiseDollarsResults.push(hour);
			}
			else if (raisesRates.length) {
				raisesRates.forEach(raise => {
					const startMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === raise.startMonth.itemTypeCode);
					const endMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === raise.endMonth.itemTypeCode);
					for (var i = startMonthIndex; i <= endMonthIndex; i++) {
						hour[fullMonthsFY[i]] = hourRow[fullMonthsFY[i]] * (raise.wageAdjustmentPercent * .01);
					}
				});
				raiseDollarsResults.push(hour);

			}
			else if (parentRaisesRates.length) {
				parentRaisesRates.forEach(raise => {
					const startMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === raise.startMonth.itemTypeCode);
					const endMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === raise.endMonth.itemTypeCode);
					for (var i = startMonthIndex; i <= endMonthIndex; i++) {
						hour[fullMonthsFY[i]] = hourRow[fullMonthsFY[i]] * (raise.wageAdjustmentPercent * .01);
					}
				});
				raiseDollarsResults.push(hour);
			}
		});
		return raiseDollarsResults;
	}

	const getRaiseRate = (data) => {
		const raiseRateResults = [];
		// const hoursData = data.filter(row => row.staffingdatatype === "Hours" || row.staffingaccounttypeid === 108);
		//const dollarsData = data.filter(row => row.staffingdatatype === "Dollars" || row.staffingaccounttypeid === 107);
		const dollarsData = calculatePreRaiseDollars(data);

		const fullMonthsFY = getFullMonthsForFY();
		const shortMonthsFY = getShortMonthsForFY();

		// if no raise rate, then show "0". leave label as is

		// hoursData.forEach(hourRow => {
		// dollarsData.forEach(hourRow => {
		// 	const hour = JSON.parse(JSON.stringify(hourRow));
		// 	fullMonthsFY.forEach(m => hour[m] = 0);
		// 	const raisesRates = raisesState.initialData.filter(raiseRow => { return raiseRow.entity.entityID === hourRow.entityid && raiseRow.department.departmentID === hourRow.departmentid && raiseRow.jobCode.jobCodeID === hourRow.jobcodeid && raiseRow.payType.payTypeID === hourRow.paytypeid });
		// 	if (raisesRates.length) {
		// 		raisesRates.forEach(raise => {
		// 			const startMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === raise.startMonth.itemTypeCode);
		// 			const endMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === raise.endMonth.itemTypeCode);
		// 			for (var i = startMonthIndex; i <= endMonthIndex; i++) {
		// 				hour[fullMonthsFY[i]] = raise.wageAdjustmentPercent;
		// 			}
		// 		});
		// 	}
		// 	raiseRateResults.push(hour);
		// });
		dollarsData.forEach(hourRow => {
			const hour = JSON.parse(JSON.stringify(hourRow));
			fullMonthsFY.forEach(m => hour[m] = 0);
			let raisesRates = raisesState.initialData.filter(raiseRow => { return raiseRow.entity.entityID === hourRow.entityid && raiseRow.department.departmentID === hourRow.departmentid && raiseRow.jobCode.jobCodeID === hourRow.jobcodeid && raiseRow.payType.payTypeID === hourRow.paytypeid });
			let parentRaisesRates = []
			const payTypeWithParentId = dimensionRelationshipData.payTypes.filter(apt => hourRow.paytypeid === apt.childid)
			for (let dt of payTypeWithParentId) {
				parentRaisesRates = raisesState.initialData.filter(raiseRow => { return raiseRow.entity.entityID === hourRow.entityid && raiseRow.department.departmentID === hourRow.departmentid && raiseRow.jobCode.jobCodeID === hourRow.jobcodeid && raiseRow.payType.payTypeID === dt.parentid });
				if (parentRaisesRates.length) break;
			}
			if (raisesRates.length && parentRaisesRates.length) {
				raisesRates.forEach(raise => {
					const startMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === raise.startMonth.itemTypeCode);
					const endMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === raise.endMonth.itemTypeCode);
					const startMonthIndexParent = shortMonthsFY.findIndex(month => month.toUpperCase() === parentRaisesRates[0].startMonth.itemTypeCode);
					const endMonthIndexParent = shortMonthsFY.findIndex(month => month.toUpperCase() === parentRaisesRates[0].endMonth.itemTypeCode);
					for (var i = 0; i <= 12; i++) {
						if (i >= startMonthIndex && i >= startMonthIndexParent && i <= endMonthIndex && i <= endMonthIndexParent) {
							hour[fullMonthsFY[i]] = raise.wageAdjustmentPercent + parentRaisesRates[0].wageAdjustmentPercent;
						}
						else if (i >= startMonthIndex && i <= endMonthIndex) {
							hour[fullMonthsFY[i]] = raise.wageAdjustmentPercent;
						}
						else if (i >= startMonthIndexParent && i <= endMonthIndexParent) {
							hour[fullMonthsFY[i]] = parentRaisesRates[0].wageAdjustmentPercent;
						}
					}
				});
				raiseRateResults.push(hour);
			}
			else if (raisesRates.length) {
				raisesRates.forEach(raise => {
					const startMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === raise.startMonth.itemTypeCode);
					const endMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === raise.endMonth.itemTypeCode);
					for (var i = startMonthIndex; i <= endMonthIndex; i++) {
						hour[fullMonthsFY[i]] = raise.wageAdjustmentPercent;
					}
				});
				raiseRateResults.push(hour);

			}
			else if (parentRaisesRates.length) {
				parentRaisesRates.forEach(raise => {
					const startMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === raise.startMonth.itemTypeCode);
					const endMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === raise.endMonth.itemTypeCode);
					for (var i = startMonthIndex; i <= endMonthIndex; i++) {
						hour[fullMonthsFY[i]] = raise.wageAdjustmentPercent;
					}
				});
				raiseRateResults.push(hour);
			}
		});

		return raiseRateResults;
	}

	const calculatePreRaiseDollars = (data) => {
		const preRaiseDollarsResults = [];
		let itemTypeId = "staffingaccounttypeid";
		if (data[0]?.staffingdatatypeID === undefined) {
			itemTypeId = "staffingdatatypeID";
		}

		if (state.budgetVersionTypeSelectedItem?.itemTypeCode == 'A') {
			const results = data.filter(row => row.staffingdatatype === "Dollars" || row.staffingaccounttypeid === 107);
			return results;
		}
		else {
			// we are dealing with a Forecast budget, so try the calculation first -> hours x average wage rate
			// we will be modifying the hours by applying the the calculation to the hours rows

			// First Calculate the dollars by using hours and available wage rate of hours
			const hoursData = data.filter(row => row.staffingdatatype === "Hours" || row.staffingaccounttypeid === 108);
			if (hoursData.length > 0) {
				// apply calculation -> hours x average wage rate
				hoursData.forEach(hourRow => {
					const hour = JSON.parse(JSON.stringify(hourRow));
					let wageRate = 0;
					const forecastedWageRateObj = data.find(row => { return row.entityid === hourRow.entityid && row.departmentid === hourRow.departmentid && row.jobcodeid === hourRow.jobcodeid && row.paytypeid === hourRow.paytypeid && row.staffingdatatype === "Average Wage" });
					if (forecastedWageRateObj) {
						wageRate = forecastedWageRateObj.rowtotal;
					}
					// Now Check for the overwrite wageRate of this hours.
					const overwriteWageRateObj = data.find(row => {
						return row.entityid === hourRow.entityid && row.departmentid === hourRow.departmentid
							&& row.jobcodeid === hourRow.jobcodeid && row.paytypeid === hourRow.paytypeid
							&& (row.staffingdatatype === "Hours" || row.staffingaccounttypeid === 108) && row.wagerateoverride !== null
					});

					if (overwriteWageRateObj) {
						wageRate = overwriteWageRateObj.wagerateoverride;
					}
					if (wageRate) {
						// hour.january = hour.january * wageRate.january;
						// hour.february = hour.february * wageRate.february;
						// hour.march = hour.march * wageRate.march;
						// hour.april = hour.april * wageRate.april;
						// hour.may = hour.may * wageRate.may;
						// hour.june = hour.june * wageRate.june;
						// hour.july = hour.july * wageRate.july;
						// hour.august = hour.august * wageRate.august;
						// hour.september = hour.september * wageRate.september;
						// hour.october = hour.october * wageRate.october;
						// hour.november = hour.november * wageRate.november;
						// hour.december = hour.december * wageRate.december;

						hour.january = hour.january * wageRate;
						hour.february = hour.february * wageRate;
						hour.march = hour.march * wageRate;
						hour.april = hour.april * wageRate;
						hour.may = hour.may * wageRate;
						hour.june = hour.june * wageRate;
						hour.july = hour.july * wageRate;
						hour.august = hour.august * wageRate;
						hour.september = hour.september * wageRate;
						hour.october = hour.october * wageRate;
						hour.november = hour.november * wageRate;
						hour.december = hour.december * wageRate;
						preRaiseDollarsResults.push(hour);
					}
				});
			}

			// Now Add individual dollars (which are saved in DB as an dollar) in the result set and return data.
			// If same combination of added dollars are available previosuly in the hours so overwrite that hours with the added dollars.
			const dollars = data.filter(row => row.staffingdatatype === "Dollars" || row.staffingaccounttypeid === 107);
			dollars.forEach((dollar) => {
				let rowIndex = preRaiseDollarsResults.findIndex((preRaiseRow) => {
					return preRaiseRow.entityid === dollar.entityid
						&& preRaiseRow.departmentid === dollar.departmentid
						&& preRaiseRow.jobcodeid === dollar.jobcodeid && preRaiseRow.paytypeid === dollar.paytypeid
				});
				if (rowIndex !== -1) {
					preRaiseDollarsResults.splice(rowIndex, 1);
				}
			});
			let finalResultDollars = [...preRaiseDollarsResults, ...dollars];
			return finalResultDollars;
			// if (preRaiseDollarsResults.length === 0) {
			// 	// we don't have wage rate, so just return dollars
			// 	const dollars = data.filter(row => row.staffingdatatype === "Dollars" || row.staffingaccounttypeid === 107);
			// 	return dollars;
			// } else {
			// 	return preRaiseDollarsResults;
			// }
		}

		return [];
	}

	const monthFullNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
	const getFullMonthsForFY = () => {
		const result = [];

		const index = monthFullNames.findIndex(month => month.toUpperCase() === "JULY");
		for (var i = index; i < monthFullNames.length; i++) {
			result.push(monthFullNames[i]);
		}
		if (index > 0) {
			for (var i = 0; i < index; i++) {
				result.push(monthFullNames[i]);
			}
		}

		return result;
	}

	const getShortMonthsForFY = () => {
		const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		const result = [];

		const index = monthNames.findIndex(month => month.toUpperCase() === "JUL");
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



	const filterData = (data) => {
		//return data;
		let filteredRows = [];


		let result = [];
		if (state.scenarioTypeSelectedItem?.itemTypeCode === 'ST') {
			result = filterStatisticsDataByGroup(GroupsFilters, data);
		} else if (state.scenarioTypeSelectedItem?.itemTypeCode === 'GL') {
			result = filterGLAccountDataByGroup(GroupsFilters, data);
		} else if (state.scenarioTypeSelectedItem?.itemTypeCode === 'SF') {
			result = filterStaffingDataByGroup(GroupsFilters, data);
		}

		if (repeatedValuesCheckboxState.currentState) {
			return result;
		} else {
			return removeRepetedValuesFromUnGroupedData(result);
		}

		// debugger;
		// let newData = [];
		// data.forEach(row => {
		// 	if (!filters.JobCodes.includes(row.jobcodeid) &&
		// 		!filters.Statistics.includes(row.statisticsid || row.glaccountid || row.paytypeid) &&
		// 		!filters.Departments.includes(row.departmentid) &&
		// 		!filters.Entites.includes(row.entityid)) {
		// 		newData.push(row);
		// 	}
		// });
		// debugger
		// // Without Groups
		// let withoutGroup = [];
		// newData.forEach((row) => {
		// 	withoutGroup.push(getDefaultGridViewRow( row , true));
		// });
		// if(withoutGroup.length > 0)
		// {
		// 	withoutGroup = getSortedUnGroupedData(withoutGroup);
		// }

		// // WithGrouping
		// let withGroup = [];
		// newData.forEach(row => {
		// 	let firstLevelRow = withGroup.find(item => item.entity.code == row.entitycode);
		// 	if (firstLevelRow) {
		// 		firstLevelRow.rowAdded = firstLevelRow.rowAdded || row.rowAdded;
		// 		let secondLevelRow = firstLevelRow.childRows.find(item => item.department.code == row.departmentcode);
		// 		if (secondLevelRow) {
		// 			secondLevelRow.rowAdded = secondLevelRow.rowAdded || row.rowAdded;
		// 			if (dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] == 'staffing') {
		// 				let thirdLevelRow = secondLevelRow.childRows.find(item => item.jobCode.code == row.jobcodecode);
		// 				if (thirdLevelRow) {
		// 					thirdLevelRow.childRows.push(getDetailsObject(row, true));
		// 				}
		// 				else {
		// 					secondLevelRow.childRows.push(getJobCodeObj(row, true))
		// 				}
		// 			} else secondLevelRow.childRows.push(getDetailsObject(row, true));
		// 		}
		// 		else {
		// 			firstLevelRow.childRows.push(getDepartmentObject(row, true));
		// 		}
		// 	}
		// 	else {
		// 		withGroup.push({
		// 			entity: {
		// 				id: row.entityid,
		// 				name: row.entityname,
		// 				code: row.entitycode,
		// 				rowAdded: row["rowAdded"]

		// 			},
		// 			childRows: [
		// 				getDepartmentObject(row, true)
		// 			],
		// 			rowAdded: row["rowAdded"],
		// 			colType: 'entity'
		// 		})
		// 	}
		// });


		// withGroup = getGroupedData({ childRows: withGroup }).childRows.map((item) => {
		// 	return {
		// 		...item,
		// 		topParentsRow: true
		// 	}}); // topParentsRow will use in custom-datatable-component for intentation handling





		// filter On Groups		
		//let data1 = [...filteredRows , ...withoutGroup , ...withGroup];
		debugger
		//return data1;
		return filteredRows;
		//return removeRepetedValuesFromUnGroupedData(filteredRows);
	};

	const handledropdown = (selectedItem, id) => {
		const updatedState = { ...state, isSomethingChange: true };
		updatedState[id] = selectedItem;
		ValidateForm({ ...updatedState });
	};

	const ValidateForm = (updatedState = state) => {
		const formErrors = initialState.formErrors;
		let isValid = true;
		if (!updatedState.code && updatedState.formSubmitted) {
			isValid = false;
			formErrors.codeError = 'Code is required'
		}
		else if (!state.isEditForm && state.codeList.find(item => { return item.toLowerCase() == updatedState.code.toLowerCase() })) {
			isValid = false;
			formErrors.codeError = 'Code already in use. Enter different code'
		}

		if (!updatedState.description && updatedState.formSubmitted) {
			isValid = false;
			formErrors.descriptionError = 'Name is required'
		}
		if (!updatedState.timePeriodSelectedItem && updatedState.formSubmitted) {
			isValid = false;
			formErrors.fiscalYearIdError = 'Fiscal year is required'
		}
		if (!updatedState.budgetVersionTypeSelectedItem && updatedState.formSubmitted) {
			isValid = false;
			formErrors.budgetVersionTypeIdError = 'Budget version type is required'
		}
		setState({ ...updatedState, formErrors });
		return isValid;
	}

	const handleSubmit = async (e, actionType) => {
		e.preventDefault();
		const updatedState = { ...state, formSubmitted: true, showNotification: false };
		const isValid = ValidateForm(updatedState);
		if (isValid) {
			//set the calculation status accordingly, First check is thier any row changed in the data table
			const detailsTableChanges = detailsTableRef?.current?.saveBudgetVersionStats();
			let updatedCalculationStatus = state.calculationStatus;
			if (state.isNewBudget && detailsTableState.unformattedData.length) {
				updatedCalculationStatus = "Need to calculate"
			}
			else if (state.isNewBudget && !detailsTableState.unformattedData.length) {
				updatedCalculationStatus = "";
			} else if (!state.isNewBudget && detailsTableChanges.length) {
				updatedCalculationStatus = "Need to calculate"
			}
			if (addRowState.newRowAdded && state.scenarioTypeSelectedItem?.itemTypeCode === "SF") {
				updatedCalculationStatus = "Need to calculate"
			}
			var budgetVersion = {
				budgetVersionID: Number(match.params?.id),
				budgetVersionTypeID: state.budgetVersionTypeSelectedItem.itemTypeID,
				scenarioTypeID: state.scenarioTypeSelectedItem?.itemTypeID,
				ADSgeneralLedgerID: state.generalLedgerSelectedItem?.itemTypeID,
				ADSstatisticsID: state.statisticsSelectedItem?.itemTypeID,
				ADSstaffingID: state.staffingSelectedItem?.itemTypeID,
				UserAuthenticated: true,
				// UserID: UserID,\
				UserID: state.userId ? state.userId : userProfile?.UserProfileID ? userProfile?.UserProfileID : 1,
				budgetVersionsData: Number(match.params?.id),
				list: [],
				code: state.code,
				comments: state.comment,
				//fiscalYearID: state.fiscalYearSelectedItem.itemTypeID,
				timePeriodID: state.timePeriodSelectedItem.itemTypeID,
				description: state.description,
				actionType: state.isNewBudget ? 'ADD' : 'UPDATE',
				actionType: state.isEditForm ? 'UPDATE' : 'ADD',
				updateddate: new Date(),
				calculationStatus: updatedCalculationStatus
			};
			let updatedStates;
			switch (actionType) {
				case 'Save':
					updatedStates = await saveBudgetVersion(budgetVersion);
					break;
				case 'SaveAs':
					setBudgetVersionState({
						...budgetVersion,
						budgetVersionID: undefined,
						code: undefined,
						actionType: state.isEditForm ? 'COPY' : 'ADD'
						// actionType: 'COPY'

					});
					setState({
						...state,
						showSaveAsModal: true
					});
					break;
				case 'SaveAndClose':
					await saveBudgetVersion(budgetVersion, true);
					break;
				default:
					break;
			}
			return updatedStates
		} else {
			return null;
		}

	};

	const handleSaveAsModalClose = () => {
		setState({
			...state,
			showSaveAsModal: false
		});
	};

	const saveBudgetVersion = async (budgetVersion, closeForm = false) => {
		// if user is creating a new budget, SaveBudgetVersion, else if editing an existing budget, UpdateBudgetVersion
		// if (detailsTableRef.current) await saveDetailsData(budgetVersionID, budgetVersion.actionType);
		const response = state.isNewBudget ? await SaveBudgetVersion(budgetVersion) : await UpdateBudgetVersion(budgetVersion);

		const budgetVersionID = state.isNewBudget ? response.payload : match.params.id;
		const responseMessage = response.message;

		if (detailsTableRef.current) await saveDetailsData(budgetVersionID, budgetVersion.actionType);

		if (!response.success) {
			setState({ ...state, notificationType: 'error', notificationTitle: responseMessage });
			return;
		}

		if (closeForm) {
			dispatch(resetBudgetVersions());
			history.push({
				pathname: '/BudgetVersions',
				state: { notification: responseMessage }
			});
		} else {
			// if we aren't closing the form, update the header
			// and update the page state to show the success notification
			setHeader(state.code + " : " + state.description);
			const updatedStates = {
				...state,
				id: budgetVersionID, //Set currenlty Saved Budgetversion id in state , to use it while redirecting to the forecast page.
				codeList: [...state.codeList, state.code],
				formSubmitted: false,
				showNotification: true,
				notificationType: 'success',
				notificationTitle: responseMessage,
				isEditForm: true,
				isSomethingChange: false,
				isNewBudget: false,
				oldState: {
					description: state.description,
					comment: state.comment,
					fiscalYearId: state.timePeriodSelectedItem.itemTypeID

				}
			}
			setState({ ...updatedStates })
			history.push({
				pathname: `/BudgetVersion/${budgetVersionID}`,
			});

			return updatedStates
		}
	};

	const getDataScenarioId = () => {
		if (state.scenarioTypeSelectedItem?.itemTypeCode === "ST") {
			return state.statisticsSelectedItem?.itemTypeID || 0;
		} else if (state.scenarioTypeSelectedItem?.itemTypeCode === "GL") {
			return state.generalLedgerSelectedItem?.itemTypeID || 0;
		} else if (state.scenarioTypeSelectedItem?.itemTypeCode === "SF") {
			return state.staffingSelectedItem?.itemTypeID || 0;
		} else {
			return 0
		}
	}

	const saveDetailsData = async (budgetVersionID, actionType) => {
		const updatedData = [];
		const detailsTableChanges = detailsTableRef.current.saveBudgetVersionStats();
		if (state.budgetVersionTypeSelectedItem?.itemTypeCode === 'A') {
			await saveActualBudgetVersionData(budgetVersionID);
		}
		else if (actionType === 'ADD' && state.budgetVersionTypeSelectedItem?.itemTypeCode == 'F') {
			detailsTableState.unformattedData.forEach(row => {
				updatedData.push({
					...row,
					...detailsTableChanges.find(item => item.uniqueCombinationKey == row.uniqueCombinationKey),
					budgetVersionId: budgetVersionID
				})
			})
			await saveBudgetVersionData(updatedData, state.scenarioTypeSelectedItem.itemTypeCode, getDataScenarioId());
		} else {
			detailsTableChanges.forEach(row => {
				if (row.dataid !== null) {
					let updatedRow = detailsTableState.unformattedData.find((item) => (item.dataid == row.dataid && item.dataid !== null && item["rowAdded"] !== true))
					if (updatedRow) {
						updatedData.push({
							...updatedRow,
							...row,
							budgetVersionId: match.params.id ? match.params.id : budgetVersionID
						})
					}
				}
			})
			//Get All added data through Modal
			// overwrite this data with the 'detailsTableChanges' with the help on enity , dept , statistis Ids , because we dont have DataID for this one.
			let NewlyAddedRow = []
			detailsTableState.unformattedData.forEach(row => {
				if (row["rowAdded"] === true) {
					NewlyAddedRow.push({
						...row,
						budgetVersionId: match.params.id
					})
				}
			})
			// Now Update this new added data with changes if any.
			for (let i = 0; i < NewlyAddedRow.length; i++) {
				if (NewlyAddedRow[i].dataid != null) {
					NewlyAddedRow[i] = {
						...NewlyAddedRow[i],
						...detailsTableChanges.find(item => item.dataid == NewlyAddedRow[i].dataid),
						budgetVersionId: match.params.id
					}
				} else if (NewlyAddedRow[i].uniqueCombinationKey != null) {
					NewlyAddedRow[i] = {
						...NewlyAddedRow[i],
						...detailsTableChanges.find(item => item.uniqueCombinationKey == NewlyAddedRow[i].uniqueCombinationKey),
						budgetVersionId: match.params.id
					}
				}

				//entity

				// let entityFind = detailsTableChanges.find((item) => item.completeRow.entity.code == NewlyAddedRow[i].entitycode);
				// if (entityFind) {
				// 	let departmentFind = entityFind.completeRow.childRows.find((item) => item.department.code == NewlyAddedRow[i].departmentcode);
				// 	//let departments = item.completeRow.childRows;
				// 	const compareItemCode = state.scenarioTypeSelectedItem.itemTypeCode === "GL" ? "glaccountcode" : "statisticscode";
				// 	if (departmentFind) {
				// 		let statisticsFind = departmentFind.childRows.find((item) => item.details.code == NewlyAddedRow[i].statisticscode)
				// 		if (statisticsFind) {
				// 			NewlyAddedRow[i] = { ...NewlyAddedRow[i], ...entityFind, budgetVersionId: match.params.id }
				// 		}
				// 	}
				// }

			}

			if (NewlyAddedRow.length || updatedData.length) // thier is any newly added row.
			{
				// Filter Out Newly Added Row , Which need to add in DB
				let RowToAdd = NewlyAddedRow.filter((item) => item.dataid === null)
				if (RowToAdd.length) {
					await saveBudgetVersionData(NewlyAddedRow, state.scenarioTypeSelectedItem.itemTypeCode, getDataScenarioId());
				}
				// Filter Out overwrite Row , Which need to update in DB
				let RowToUpdate = NewlyAddedRow.filter((item) => item.dataid !== null)
				if (RowToUpdate.length || updatedData.length) {
					await updateBudgetVersionData([...RowToUpdate, ...updatedData], state.scenarioTypeSelectedItem.itemTypeCode);
				}
			}
		}
		if (deletedRowState.length) {
			await deleteBudgetVersionData(deletedRowState.map(item => item), state.scenarioTypeSelectedItem.itemTypeCode);
			setDeletedRowState([]);
		}

		if (state.scenarioTypeSelectedItem?.itemTypeCode && state.budgetVersionTypeSelectedItem?.itemTypeCode == 'F') {
			setEmptyStatsTableState(false);
			setTimeout(() => {
				GetBudgetVersionData(budgetVersionID, state.scenarioTypeSelectedItem.itemTypeCode).then(response => {
					if (response.data.length) {
						setDetailTableState({ ...detailsTableState, show: true, data: mapDataForDetailsTable(response.data, budgetVersions.filtered), unformattedData: response.data, type: dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] });
					} else {
						setDetailTableState({ ...detailsTableState, show: true, data: [{}, {}, {}, {}, {}, {}, {}], unformattedData: [], type: dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] });
					}
				})
			}, 500);
		}
	}

	const handleCancel = (e) => {
		e.preventDefault();

		// check need to show modal aur not..
		if (!btnsValidation('saveAndClose')) {
			toggleIsUnsaveModalOpen(true)
		} else {
			cancelForm();
		}
	};

	const cancelForm = e => {
		history.push({
			pathname: '/BudgetVersions',
		});
	}

	const breadCrumb = [
		{
			text: 'Budget versions',
			link: '/BudgetVersions/'
		}
	];

	const handleInflationClick = async (e) => {
		let updatedStates = await handleSubmit(e, "Save");
		if (updatedStates) {
			let budgetversionId = state.isEditForm ? match.params.id : updatedStates.id; // Use Local variable for access the ID , not the State variable. State variable not Updated before going to the next page.
			history.push('/Inflation/' + budgetversionId)
		}
	}

	const handleRaisesClick = async (e) => {
		let updatedStates = await handleSubmit(e, "Save");
		if (updatedStates) {
			let budgetversionId = state.isEditForm ? match.params.id : updatedStates.id; // Use Local variable for access the ID , not the State variable. State variable not Updated before going to the next page.
			history.push('/Raises/' + budgetversionId)
		}
	}


	const handleForecastClick = async (e) => {
		dispatch(
			updateForecast({
				...forecastState,
				forecast_budgetversion_scenario_type_Code: "",
				forecast_budgetversion_scenario_type_ID: 0,
				///forecastSections: [],
			}));
		let updatedStates = await handleSubmit(e, "Save");
		if (updatedStates) {
			let budgetversionId = state.isEditForm ? match.params.id : updatedStates.id; // Use Local variable for access the ID , not the State variable. State variable not Updated before going to the next page.
			history.push('/Forecast/' + budgetversionId)
		}
	}

	const handleManualWageClick = async (e) => {
		let updatedStates = await handleSubmit(e, "Save");
		if (updatedStates) {
			let budgetversionId = state.isEditForm ? match.params.id : updatedStates.id; // Use Local variable for access the ID , not the State variable. State variable not Updated before going to the next page.
			history.push('/ManualWageRate/' + budgetversionId)
		}
	}

	const handleCancelFilter = (e) => {
		e.preventDefault();
		setRepeatedValuesCheckboxState({ currentState: true, previosState: true })

		// reset all 3 filter tables
		entityFilterTableRef.current.reset();
		departmentFilterTableRef.current.reset();
		if (state.scenarioTypeSelectedItem?.itemTypeCode === 'SF') {
			jobCodesFilterTableRef.current.reset();
		}
		detailsFilterTableRef.current.reset();

		// reset filters state in redux
		dispatch(resetBudgetVersionsFilters());

		// update the details table data without filtering
		updateDetailsTableState(false);
	};

	const isFiltered = filters.filtered || filters.Entites.length > 0 || filters.Departments.length > 0 || filters.JobCodes.length > 0 || filters.Statistics.length > 0;

	const isSorted =
		sortDetails.Entites.sortFactor !== 'code' ||
		sortDetails.Entites.sortDirection !== 'ascending' ||
		sortDetails.Departments.sortFactor !== 'code' ||
		sortDetails.Departments.sortDirection !== 'ascending' ||
		sortDetails.JobCodes.sortFactor !== 'code' ||
		sortDetails.JobCodes.sortDirection !== 'ascending' ||
		sortDetails.Statistics.sortFactor !== 'code' ||
		sortDetails.Statistics.sortDirection !== 'ascending';

	const handleApplyFilter = () => {

		setRepeatedValuesCheckboxState({ ...repeatedValuesCheckboxState, previosState: repeatedValuesCheckboxState.currentState });

		// Currently performing filtering in budget-version-form because
		// updates to the state trigger a reloading of rows at that level.
		updateDetailsTableState();

		// close the filter accordion after filtering
		setFilterOpenState(false);

		// set the 'filtered' flag
		dispatch(setBudgetVersionsFilteredFlag(isFiltered));

		// set the 'sorted' flag
		dispatch(setBudgetVersionsSortedFlag(isSorted));

	};

	const getCustomFilterOption = (filterType) => {
		let filterOption;

		switch (filterType) {
			case 'statistics':
				filterOption = filterOptions[2];
				break;
			case 'genralLedger':
				filterOption = filterOptions[3];
				break;
			case 'staffing':
				filterOption = filterOptions[5];
				break;

			default:
				filterOption = filterOptions[4];

		}

		return filterOption;
	}

	const getFilterStatusClass = () => {
		return budgetVersions.filtered ? 'filter-accordion-status-visible' : 'filter-accordion-status-hidden';
	};
	const handleAddRowModal = (isOpen) => {
		setAddRowModalState({ ...addRowModalState, isOpen: isOpen })
	}

	const getSortStatusClass = () => {
		return budgetVersions.sorted ? 'filter-accordion-status-visible' : 'filter-accordion-status-hidden';
	};

	const handleDetailsEditChange = () => {
		setState({ ...state, isSomethingChange: true });
	}

	const [xheader, setHeader] = useState("Add budget version");

	const getMatchedRowIndex = (row) => {
		const compareItemCode = state.scenarioTypeSelectedItem.itemTypeCode === "GL" ? "glaccountcode" : "statisticscode";
		// Check if Record in already exist.
		if (state.scenarioTypeSelectedItem.itemTypeCode !== "SF") {
			return detailsTableState.unformattedData.findIndex((item) => item.entitycode === row.entitycode &&
				item.departmentcode === row.departmentcode && item[compareItemCode] === row[compareItemCode]);
		}
		else {
			return detailsTableState.unformattedData.findIndex((item) => item.entitycode === row.entitycode &&
				item.departmentcode === row.departmentcode && item.jobcodeid === row.jobcodeid
				&& item.paytypecode === row.paytypecode && item.staffingdatatypeID === row.staffingdatatype);
		}

	}


	const handleAddRowInTable = (newRowsUnformatted) => {
		let updatedunformattedData = [...detailsTableState.unformattedData];
		newRowsUnformatted.forEach((row) => {
			const rowIndex = getMatchedRowIndex(row);
			if (rowIndex !== -1) {
				let DataID = updatedunformattedData[rowIndex].dataid;
				updatedunformattedData[rowIndex] = { ...row, rowAdded: true }
				updatedunformattedData[rowIndex].dataid = DataID
			} else {
				// let uniqueId = Math.floor(Math.random() * 10000)
				// while (updatedunformattedData.some(data => data.dataid === uniqueId)) {
				// 	uniqueId = Math.floor(Math.random() * 10000)
				// }
				// row = { ...row, dataid: uniqueId }
				row = { ...row }
				updatedunformattedData.push({ ...row, rowAdded: true });
			}
		});
		// TODO : This check will be remove when filter table support the GL Grid as well. Currently is create an error in GL case.
		if (state.scenarioTypeSelectedItem.itemTypeCode === "ST") {
			setFilterOptions(updatedunformattedData);
		}
		setDetailTableState({ ...detailsTableState, data: mapDataForDetailsTable(updatedunformattedData, budgetVersions.filtered), unformattedData: updatedunformattedData, type: dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] });
		setAddRowModalState({ ...addRowModalState, isOpen: false })
		setAddRowState({ ...addRowState, newRowAdded: true })
		setState({ ...state, isSomethingChange: true });
	}

	const handleOverflowActions = (overFlowAction, row) => {
		debugger
		switch (overFlowAction) {
			case 'deleteRow':
				handleDeleteRow(row)
				break;
			case "openSubAccount":
				toOpenSubAccount(row?.dataid)
			default:
				return;

		}
	}

	var arr = []
	const getCodeFromHierarchicalData = (row) => {
		if (row && row?.childRows?.length) {
			for (let rw of row.childRows) {
				getCodeFromHierarchicalData(rw)
			}
		}
		else {
			if (row.rowAdded) arr.push({ rowAdded: true, uniqueCombinationKey: row.uniqueCombinationKey, dataid: row?.details?.rowId })
			else arr.push({ rowAdded: false, dataid: row?.details?.rowId })
		}
	}

	const handleDeleteRow = (row) => {
		arr = [];
		getCodeFromHierarchicalData(row);
		if (arr.length) {
			let tableData = [...detailsTableState.unformattedData];
			for (let ar of arr) {
				if (ar.rowAdded) tableData = tableData.filter(data => data?.uniqueCombinationKey !== ar.uniqueCombinationKey);
				else tableData = tableData.filter(data => data.dataid !== ar.dataid);
			}
			if (tableData.length) setDetailTableState({ ...detailsTableState, data: mapDataForDetailsTable(tableData, budgetVersions.filtered), unformattedData: tableData, type: dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] });
			else setEmptyStatsTableState();
			arr = [...arr.map(ar => ar.dataid)];
			setDeletedRowState([...deletedRowState, ...arr.filter(ar => ar !== null)]);
			setState({ ...state, isSomethingChange: true });
		}
		// debugger
		// const compareItemCode = state.scenarioTypeSelectedItem.itemTypeCode === "GL" ? "glaccountcode" : "statisticscode";
		// const tableData = [...detailsTableState.unformattedData].filter(item => !(item[compareItemCode] == row?.details?.code && item?.entitycode == row?.entity.code && item?.departmentcode == row?.department.code));
		// if (tableData.length)
		// 	setDetailTableState({ ...detailsTableState, data: mapDataForDetailsTable(tableData), unformattedData: tableData, type: dataTableType[state.scenarioTypeSelectedItem.itemTypeCode] });
		// else
		// 	setEmptyStatsTableState();

		// if (!row.rowAdded && row.dataid) {
		// 	setDeletedRowState([...deletedRowState, row])
		// }
	}

	const getFTEForTimePeriod = (timePeriodID) => {
		return fteState.find(fte => fte.timePeriodID === timePeriodID);
	}

	const compareLastDataWithEditedone = () => {
		const {
			oldState,
			description,
			comment,
			timePeriodSelectedItem
		} = state;
		if (
			(oldState.description !== description) ||
			(oldState.comment !== comment) ||
			(timePeriodSelectedItem.itemTypeID !== oldState.fiscalYearId)) {
			return false
		}
		return true
	}

	const btnsValidation = (btnType) => {
		const {
			code,
			description,
			timePeriodSelectedItem,
			budgetVersionTypeSelectedItem,
			isEditForm,
			isSomethingChange,
			oldState
		} = state;
		let isDisable = true
		if (btnType === 'save' && code && description && timePeriodSelectedItem && budgetVersionTypeSelectedItem) {
			isDisable = false;
			if (isEditForm) isDisable = true;
			if (isEditForm && !compareLastDataWithEditedone()) isDisable = false;
			if (isEditForm && isSomethingChange) isDisable = false;
		}
		else if (btnType === 'saveAs' && code && description && timePeriodSelectedItem && budgetVersionTypeSelectedItem) {
			isDisable = false;
		}
		else if (btnType === 'saveAndClose' && code && description && timePeriodSelectedItem && budgetVersionTypeSelectedItem) {
			isDisable = false;
			if (isEditForm) isDisable = true;
			if (isEditForm && !compareLastDataWithEditedone()) isDisable = false;
			if (isEditForm && isSomethingChange) isDisable = false;
		}
		return isDisable;
	}

	const toOpenSubAccount = (rowId) => {
		if (rowId) {
			const selectedRowForSubAccounts = detailsTableState.unformattedData.find(data => data.dataid === rowId);
			if (selectedRowForSubAccounts) {
				setState({ ...state, selectedRowForSubAccounts, isSubAccountModalOpen: true, subAccountNotification: false })
			}
		}
	}

	const closeSubAccountsModal = () => {
		setState({ ...state, selectedRowForSubAccounts: {}, isSubAccountModalOpen: false })
	}

	const onSubAccountSubmit = async (data, isEdit) => {
		try {
			if (!isEdit) {
				await createSubAccounts(data).then(res => {
					setState({
						...state,
						isSubAccountModalOpen: false,
						selectedRowForSubAccounts: {},
						subAccountNotification: true,
						notificationTitle: "Subaccounts updated.",
						notificationType: "success",
						refreshBVData: !state.refreshBVData
					})
				})
			}
			else if (isEdit) {
				await updateSubAccounts(data).then(res => {
					setState({
						...state,
						selectedRowForSubAccounts: {},
						isSubAccountModalOpen: false,
						subAccountNotification: true,
						notificationTitle: "Subaccounts updated.",
						notificationType: "success",
						refreshBVData: !state.refreshBVData
					})
				})
			}
		}
		catch (err) {
			console.log(err)
		}
	}

	return (
		<>
			{ dropdownDataState.fiscalYears?.length && dropdownDataState.scenarioTypes?.length && dropdownDataState.budgetVersionTypes?.length && !relationshipDataLoad.loading ?
				<div>
					<PageHeader
						heading={xheader}
						icon={<Favorite16 />}
						breadCrumb={breadCrumb}
						notification={history?.location?.state?.notification} />
					<div>
						<SubAccountModals
							isSubAccountModalOpen={state.isSubAccountModalOpen}
							selectedRowForSubAccounts={state.selectedRowForSubAccounts}
							closeSubAccountsModal={closeSubAccountsModal}
							onSubAccountSubmit={onSubAccountSubmit}
						/>
						<FullScreenModal
							open={isUnsaveModalOpen}
							hasScrollingContent={false}
							iconDescription="Close"
							modalAriaLabel={'Unsaved changes'}
							modalHeading={'Unsaved changes'}
							onRequestClose={() => { toggleIsUnsaveModalOpen(false) }}
							onRequestSubmit={(e) => handleSubmit(e, 'SaveAndClose')}
							onSecondarySubmit={() => { cancelForm(); toggleIsUnsaveModalOpen(false) }}
							passiveModal={false}
							primaryButtonDisabled={false}
							primaryButtonText="Save unsaved changes"
							secondaryButtonText="Lose unsaved changes"
							className="Test"
							size='xs'
						>
							<div className="bx--grid">
								<div className="bx--row">
									<div className="bx--col">
										You made changes but did not save them.<br />
					Are you sure you want to lose your unsaved changes?
				</div>
								</div>
								<br />
								<br />
								<br />
							</div>
						</FullScreenModal>
					</div>

					<form id="addBudgetVersionForm" onSubmit={handleSubmit}>

						<div className="bx--row form-row">
							<div className="bx--col-lg-3">
								<TextInput
									id="code"
									type="text"
									labelText="Code"
									onChange={handleChange}
									invalid={state.isEditForm ? false : state.formErrors.codeError != "" ? true : false}
									invalidText={state.formErrors.codeError}
									value={state.code}
									disabled={state.isEditForm}
									maxLength={15}
								/>
							</div>

							<div className="bx--col-lg-5">
								<TextInput
									id="description"
									type="text"
									labelText="Name"
									onChange={handleChange}
									invalid={state.formErrors.descriptionError != "" ? true : false}
									invalidText={state.formErrors.descriptionError}
									value={state.description}
									maxLength={40}
								/>
							</div>
						</div>
						<div className="bx--row form-row">
							<div className="bx--col-lg-7">
								<TextInput
									id="comment"
									type="text"
									labelText="Description (optional)"
									onChange={handleChange}
									value={state.comment}
									maxLength={80}

								/>
							</div>
						</div>

						<div className="bx--row form-row">
							<div className="bx--col-lg-2">
								<Dropdown
									id="fiscalYearId"
									type="text"
									items={dropdownDataState.fiscalYears}
									itemToString={(item) => (item ? item.itemTypeTimePeriodName : '')}
									//value={(item) => (item ? item.itemTypeId : '')}
									titleText="Fiscal year"
									onChange={(e) => handledropdown(e.selectedItem, "timePeriodSelectedItem")}
									invalid={state.formErrors.fiscalYearIdError != "" ? true : false}
									invalidText={state.formErrors.fiscalYearIdError}
									selectedItem={state.timePeriodSelectedItem}
								/>
							</div>

							<div className="bx--col-lg-1">
							</div>
							<div className="bx--col-lg-3">
								<Dropdown
									id="budgetVersionTypeId"
									type="text"
									items={dropdownDataState.budgetVersionTypes}
									titleText="Budget version type"
									itemToString={(item) => (item ? item.itemTypeValue : '')}
									//value={(item) => (item ? item.itemTypeId : '')}
									onChange={(e) => handledropdown(e.selectedItem, "budgetVersionTypeSelectedItem")}
									invalid={state.formErrors.budgetVersionTypeIdError != "" ? true : false}
									invalidText={state.formErrors.budgetVersionTypeIdError}
									selectedItem={state.budgetVersionTypeSelectedItem}
									disabled={state.isEditForm}
								/>
							</div>

							<TooltipIcon tooltipText="Actual data cannot be changed and are used to create projections. For projections, you can (1) copy the available actual data budget version into a new budget version, then (2) forecast the remaining months of the current fiscal year. For forecasts, you can (2) copy the projections budget version, then (2) update the months for the next fiscal year budget. Or, you can start an empty forecast budget version and load data for next years budget using the available options.">
								<Information20 className="textbox-icon" />
							</TooltipIcon>

						</div>
						{
							state.budgetVersionTypeSelectedItem?.itemTypeCode == "A" ?
								<div className="bx--row form-row">
									<div className="bx--col-lg-3">
										<Dropdown
											id="StatisticsId"
											type="text"
											items={dropdownDataState.statisticsData}
											itemToString={(item) => (item ? item.itemTypeDisplayName : '')}
											//value={(item) => (item ? item.itemTypeId : '')}
											titleText="Statistics data scenario (optional)"
											onChange={(e) => handledropdown(e.selectedItem, "statisticsSelectedItem")}
											selectedItem={state.statisticsSelectedItem}
										/>
									</div>
									<Search16 className='textbox-icon' />
									<div className="bx--col-lg-3">
										<Dropdown
											id="generalLedgerId"
											type="text"
											titleText="General Ledger data scenario (optional)"
											items={dropdownDataState.generalLedgerData}
											itemToString={(item) => (item ? item.itemTypeDisplayName : '')}
											//value={(item) => (item ? item.itemTypeId : '')}
											onChange={(e) => handledropdown(e.selectedItem, "generalLedgerSelectedItem")}
											selectedItem={state.generalLedgerSelectedItem}
										/>
									</div>
									<Search16 className='textbox-icon' />
									<div className="bx--col-lg-3">
										<Dropdown
											id="staffingId"
											type="text"
											items={dropdownDataState.staffingData}
											itemToString={(item) => (item ? item.itemTypeDisplayName : '')}
											//value={(item) => (item ? item.itemTypeId : '')}
											titleText="Staffing data scenario (optional)"
											onChange={(e) => handledropdown(e.selectedItem, "staffingSelectedItem")}
											selectedItem={state.staffingSelectedItem}
										/>
									</div>
									<Search16 className='textbox-icon' />
								</div> : ""}
						<div className="bx--row form-row">
							<div className="bx--col-lg-3">
								<Dropdown
									id="scenarioTypeId"
									type="text"
									items={dropdownDataState.scenarioTypes.map(data => ({ ...data, itemTypeValueCapitalize: data.itemTypeValue.charAt(0).toUpperCase() + data.itemTypeValue.slice(1).toLowerCase() }))}
									itemToString={(item) => (item ? item.itemTypeValueCapitalize : '')}
									//value={(item) => (item ? item.itemTypeId : '')}
									titleText="Scenario type in table (optional)"
									onChange={(e) => handledropdown(e.selectedItem, "scenarioTypeSelectedItem")}
									selectedItem={state?.scenarioTypeSelectedItem ? { ...state.scenarioTypeSelectedItem, itemTypeValueCapitalize: state?.scenarioTypeSelectedItem?.itemTypeValue.charAt(0).toUpperCase() + state?.scenarioTypeSelectedItem?.itemTypeValue.slice(1).toLowerCase() } : state.scenarioTypeSelectedItem}
								/>
							</div>
							{/* <Search16 className='textbox-icon' /> */}
						</div>

						{tableLoadingState && <InlineLoading description='Loading data...' />}
						{!tableLoadingState && detailsTableState.show && state.timePeriodSelectedItem?.itemTypeDisplayName &&
							<>
								<Accordion>
									<AccordionItem title={
										<>
											<h6 className={'filter-accordion-label'}>Filter table</h6>
											<Tag className={`filter-accordion-status-first-element ${getFilterStatusClass()}`}>Filters applied</Tag>
											<Tag className={getSortStatusClass()}>
												<TooltipIcon align="start" direction="top" tooltipText="Multiple column sort orders may be applied.">Sort order applied</TooltipIcon>
											</Tag>
										</>
									} open={filterOpenState}
										onHeadingClick={(state) => {
											setFilterOpenState(state.isOpen);
										}}>
										<table className={'filter-accordion-table'}>
											<tbody>
												<tr>
													<td><FilterTable id='entity-filter' ref={entityFilterTableRef} filterOption={filterOptions[0]} dimensionRelationData={dimensionRelationshipData} /></td>
													<td><FilterTable id='department-filter' ref={departmentFilterTableRef} filterOption={filterOptions[1]} dimensionRelationData={dimensionRelationshipData} /></td>
													{detailsTableState.type === 'staffing' &&
														// job code filter only used for staffing data
														<td><FilterTable id='detail-filter-staffing' ref={jobCodesFilterTableRef} filterOption={filterOptions[4]} dimensionRelationData={dimensionRelationshipData} /></td>
													}
													<td><FilterTable id='detail-filter' ref={detailsFilterTableRef} filterOption={getCustomFilterOption(detailsTableState.type)} dimensionRelationData={dimensionRelationshipData} /></td>
												</tr>
											</tbody>
										</table>

										<div className="bx--row form-row">
											<div className="bx--col-lg-3">
												<div id="show-repeated-values-checkbox-container">

													<Checkbox
														id="show-repeated-values-checkbox"
														checked={repeatedValuesCheckboxState.currentState}
														labelText="Show repeated values"
														onChange={handleRepeatedValueCheckboxChange}
													/>
												</div>

												<div id="show-repeated-values-tooltip">
													<TooltipIcon
														direction='top'
														align='start'
														tooltipText='Show Codes and Names in every row.'
													>
														<Information16 />
													</TooltipIcon>
												</div>
											</div>
											<div className="bx--col-lg-3">


											</div>
										</div>



										<div className="btn-row action-row">
											<Button
												className="bx--btn--secondary"
												type="submit"
												onClick={handleCancelFilter}
											//disabled={!isFiltered && !budgetVersions.filtered && !isSorted && !budgetVersions.sorted && repeatedValuesCheckboxState.previosState == repeatedValuesCheckboxState.currentState}
											>
												Cancel
                    					</Button>
											<Button
												className="bx--btn--tertiary without-left-border"
												type="submit"
												onClick={handleApplyFilter}
											//disabled={!isFiltered && !budgetVersions.filtered && !isSorted && !budgetVersions.sorted && repeatedValuesCheckboxState.previosState == repeatedValuesCheckboxState.currentState}
											>
												Show in table
                    					</Button>
										</div>
									</AccordionItem>
								</Accordion>
								{state.subAccountNotification ?
									<InlineNotification
										title={state.notificationTitle}
										kind={state.notificationType}
										lowContrast='true'
										notificationType='inline'
										className='add-budgetversion-notification'
										iconDescription="Close Notification"
									/> : ""}

								<CustomDatatable
									type={detailsTableState.type}
									ref={detailsTableRef}
									rows={detailsTableState.data}
									timePeriod={state.timePeriodSelectedItem}
									handleOverflowActions={handleOverflowActions}
									ScenarioTypeInTable={state.scenarioTypeSelectedItem}
									budgetVersionType={state.budgetVersionTypeSelectedItem.itemTypeValue}
									handleForecastClick={handleForecastClick}
									handleEditChange={handleDetailsEditChange}
									handleAddRowModal={handleAddRowModal}
									handleInflationClick={handleInflationClick}
									handleRaisesClick={handleRaisesClick}
									staffingOptions={staffingOptions}
									handleViewsChange={handleViewsChange}
									selectedViews={state.selectedViews}
									handleManualWageClick={handleManualWageClick}
									showGroupedData={toggleGroupedDataState.showGroupedData}
									handletoogleGroupedData={handletoogleGroupedData}
									paginationHandler={paginationHandler}
									paginationState={paginationState}
								/>
								<div>
									<AddRowModal
										isOpen={addRowModalState.isOpen}
										handleAddRowModal={handleAddRowModal}
										timePeriod={state.timePeriodSelectedItem}
										scenarioType={state.scenarioTypeSelectedItem}
										handleAddRowInTable={handleAddRowInTable}
										budgetVersionId={match?.params?.id}
										scenarioTableData={detailsTableState.unformattedData}
										dimensionRelationshipData={dimensionRelationshipData}
									/>
									{/* <SaveAsBudgetVersionModal
									key={`save-as-open-${state.showSaveAsModal}`}
									// isOpen={state.showSaveAsModal}
									isOpen={true}
									handleClose={handleSaveAsModalClose}
									handleSave={saveBudgetVersion}
									budgetVersion={budgetVersionState}
									fiscalYears={dropdownDataState.fiscalYears}
									budgetVersionTypes={dropdownDataState.budgetVersionTypes}
									title="Save as"
								/> */}
								</div>
							</>

						}
						<SaveAsBudgetVersionModal
							key={`save-as-open-${state.showSaveAsModal}`}
							isOpen={state.showSaveAsModal}
							handleClose={handleSaveAsModalClose}
							handleSave={saveBudgetVersion}
							budgetVersion={budgetVersionState}
							fiscalYears={dropdownDataState.fiscalYears}
							budgetVersionTypes={dropdownDataState.budgetVersionTypes}
							title="Save as"
						/>

						<div className="bx--row action-row">
							<div className="bx--col-md-8">
								{history.location?.state?.showInflationNotification ?
									<InlineNotification
										title="Inflation applied."
										kind="success"
										lowContrast='true'
										notificationType='inline'
										className='add-budgetversion-notification'
										iconDescription="Close Notification"
									/> : ""}

								{state.showNotification ?
									<InlineNotification
										title={state.notificationTitle}
										kind={state.notificationType}
										lowContrast='true'
										notificationType='inline'
										className='add-budgetversion-notification'
										iconDescription="Close Notification"
									/> : ""}
							</div>
							<div className="bx--col-md-4">
								<Button id="btnCancel" className="bx--btn--secondary" type="submit" onClick={handleCancel}>
									Cancel
						</Button>
								<Button id="btnSave" className="bx--btn--tertiary without-left-border"
									renderIcon={Save16} type="submit"
									onClick={(e) => handleSubmit(e, 'Save')}
									disabled={state.calculationStatus === "Calculating" || state.calculationStatus === "Forecasting" || btnsValidation('save')}>
									Save
							</Button>

								<Button id="btnSaveAs" className="bx--btn--tertiary without-left-border"
									type="submit" onClick={(e) => handleSubmit(e, 'SaveAs')}
									disabled={state.calculationStatus === "Calculating" || state.calculationStatus === "Forecasting" || btnsValidation('saveAs')}
								>
									Save as
						</Button>
								<Button id="btnSaveNClose"
									className="bx--btn--primary without-left-border" type="Submit"
									onClick={(e) => handleSubmit(e, 'SaveAndClose')}
									disabled={state.calculationStatus === "Calculating" || state.calculationStatus === "Forecasting" || btnsValidation('saveAndClose')}>
									Save and close
						</Button>

							</div>
						</div>
					</form>
				</div> :
				<InlineLoading description="Loading..." />}
		</>
	);
}

export default BudgetVersionForm;
