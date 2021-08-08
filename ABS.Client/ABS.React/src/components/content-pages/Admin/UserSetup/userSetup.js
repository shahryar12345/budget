import React, { useEffect, useState } from "react";
import {
    DataTable,
    Pagination,
    InlineLoading,
    Search,
    Button,
    TableToolbarContent,
    TextInput,
    // TooltipIcon,
    Checkbox,
    InlineNotification,
    TableBatchAction,
    TableBatchActions,
    TableSelectAll,
    TableSelectRow,
} from "carbon-components-react";
import { convertUTCDateToLocalDateLocalString } from "../../../../helpers/date.helper";
import { GetAllUsers, createUser, updateUser, assignEntitiesToUsers, getRolesWithMenuItems, createUpdateUsers, getDetailsOfUser } from '../../../../services/user-setup-service'
import initheaders from "./header";
import PageHeader from "../../../layout/PageHeader";
import { ChevronDown16, ChevronUp16, Favorite16, Information20, InProgress16, Launch16 } from "@carbon/icons-react";
import FullScreenModal from "../../../shared/budget-versions-modal/full-screen-modal";
// import EntitySelector from "./entitySelector";
// import { getToken } from "../../../../helpers/utils";
import DataSelectingModal from "./dataSelectionModal";
import { useSelector } from "react-redux";
// import { GetAllRoles } from "../../../../services/role-setup-service";
import { getApiResponseAsync } from "../../../../services/api/apiCallerGet";
import itemsDateFormat from "../../MasterData/forecastMethodType";

const {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    TableToolbar,
} = DataTable;

const initialState = {
    isOpen: false,
    isMainModalDataLoading: false,
    firstName: "",
    lastName: "",
    displayName: "",
    initials: "",
    email: "",
    jobFunction: "",
    newPassword: "",
    confirmNewPassword: "",
    username: "",
    isEdit: false,

    selectedEntities: [],
    isEntitiesSelectorModalOpen: false,

    selectedDeparments: [],
    isDepartmentsSelectorModalOpen: false,

    selectedGLAccounts: [],
    isGLAccountsSelectorModalOpen: false,

    selectedStatistics: [],
    isStatisticsSelectorModalOpen: false,

    selectedJobCodes: [],
    isJobCodesSelectorModalOpen: false,

    selectedPayTypes: [],
    isPayTypesSelectorModalOpen: false,

    allRoles: [],
    selectedRoles: [],

    isRolesModalOpen: false,
    selectedDepartmentMasterId: null,
    selectedStatisticsMasterId: null,
    selectedglccountsMasterId: null,
    selectedJobCodeMasterId: null,
    selectedPaytypesMasterId: null,

    formattedSelectedMenuItems: [],
    unformattedSelectedMenuItems: [],

    showNotification: false,
    notificationText: "",
    notificationType: 'success',
    validationObj: {},
    confirmPasswordError: ''
}

const UserSetup = ({ location }) => {

    const initialLoadingStates = {
        isLoading: true
    }
    const [state, setState] = useState(initialState)
    const [xpageNo, setPageNo] = useState(1);
    const [xitemsPerPage, setItemsPerpage] = useState(20);
    const [xdatarows, setxDataRows] = useState({ rows: [] });
    const [loadingState, setLoadingState] = useState(initialLoadingStates);
    const [datarows, setDataRows] = useState({ rows: [] });
    // =========================================================================================
    const departments = useSelector((state) => state.MasterData.Departments);
    const statsData = useSelector((state) => state.MasterData.Statistics);
    const gLAccounts = useSelector((state) => state.MasterData.GLAccounts);
    const jobCodes = useSelector((state) => state.MasterData.JobCodes);
    const payTypes = useSelector((state) => state.MasterData.PayTypes);
    const entites = useSelector((state) => state.MasterData.Entites);
    // =========================================================================================
    const [departmentRelation, setDepartmentRelation] = useState({ data: [], isLoading: true });
    const [statisticsRelation, setStatisticsRelation] = useState({ data: [], isLoading: true });
    const [glAccountRelation, setGLAccountRelation] = useState({ data: [], isLoading: true });
    const [jobCodeRelation, setJobCodeRelation] = useState({ data: [], isLoading: true });
    const [payTypeRelation, setPayTypeRelation] = useState({ data: [], isLoading: true });
    // =========================================================================================
    const [departmentCombineData, setDepartmentCombineData] = useState({ data: [], isLoading: true });
    const [statisticsCombineData, setStatisticsCombineData] = useState({ data: [], isLoading: true });
    const [glAccountCombineData, setGLAccountCombineData] = useState({ data: [], isLoading: true });
    const [jobCodeCombineData, setJobCodeCombineData] = useState({ data: [], isLoading: true });
    const [payTypeCombineData, setPayTypeCombineData] = useState({ data: [], isLoading: true });
    const userSystemSettings = useSelector((state) => state.systemSettings);
    const dateformatdata = useSelector((state) => state.MasterData.ItemDateFormat);

    const loadUsers = async () => {
        setLoadingState({ ...loadingState, isLoading: true })
        await GetAllUsers().then((response) => {
            setDataRows({ rows: response.sort((a, b) => (a.userProfileID < b.userProfileID) ? 1 : ((b.userProfileID < a.userProfileID) ? -1 : 0)) });
            setxDataRows({ rows: mapData(response.slice(0, 20), "dd-mmm-yyyy") });
        })
        setLoadingState({ ...loadingState, isLoading: false })
    }


    const loadbackgroundJobData = async () => {
        await loadUsers();
        await getRolesWithMenuItems().then((response) => {
            setState({
                ...state,
                allRoles: response?.data ? [...response.data] : []
            })
        })
        await getApiResponseAsync("DEPARTMENTSRELATIONSHIPS").then((departmentRelation) => {
            setDepartmentRelation({
                data: departmentRelation,
                isLoading: false
            })
        })
        await getApiResponseAsync("STATISTICSRELATIONSHIPS").then((statisticsRelation) => {
            setStatisticsRelation({
                data: statisticsRelation,
                isLoading: false
            })
        })
        await getApiResponseAsync("JOBCODERELATIONSHIPS").then((jobCodeRelation) => {
            setJobCodeRelation({
                data: jobCodeRelation,
                isLoading: false
            })
        })
        await getApiResponseAsync("PAYTYPESRELATIONSHIPS").then((payTypeRelation) => {
            setPayTypeRelation({
                data: payTypeRelation,
                isLoading: false
            })
        })
        await getApiResponseAsync("GLACCOUNTSRELATIONSHIPS").then((glAccountRelation) => {
            setGLAccountRelation({
                data: glAccountRelation,
                isLoading: false
            })
        })
    }

    useEffect(() => {
        loadbackgroundJobData();
    }, []);

    const paginationHandler = async ({ page, pageSize }) => {
        setPageNo(page);
        setItemsPerpage(pageSize);
        setxDataRows({ rows: mapData(datarows.rows.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize), "dd-mmm-yyyy") });
    };

    const mapData = (data, dateformat) => {
        let userSelectedDateFormat = dateformatdata.find(data => data.itemTypeValue === userSystemSettings.fiscalStartMonthDateFormat);
        userSelectedDateFormat = userSelectedDateFormat !== undefined ? userSelectedDateFormat.itemTypeCode : 'LLLL';

        data.forEach(function (row) {
            row["id"] = row["userProfileID"];
            row["creationDate"] = convertUTCDateToLocalDateLocalString(
                row["creationDate"] + "",
                userSelectedDateFormat, true
            );
            row["updatedDate"] = convertUTCDateToLocalDateLocalString(
                row["updatedDate"] + "",
                userSelectedDateFormat, true
            );
        });
        return data;
    }

    const breadCrumb = [
        {
            text: 'User setup',
            link: '/UserSetup'
        }
    ];


    const toggleModal = () => {
        setState({
            ...state,
            isOpen: !state.isOpen,
            validationObj: {},
            selectedRoles: [],
            selectedEntities: []
            // username: "",
            // firstName: "",
            // lastName: "",
            // displayName: "",
            // initials: "",
            // email: "",
            // jobFunction: "",
            // newPassword: "",
            // confirmNewPassword: "",
            // selectedRoles: [],
            // selectedEntities: [],

            // selectedDepartmentMasterId: null,
            // selectedStatisticsMasterId: null,
            // selectedglccountsMasterId: null,
            // selectedJobCodeMasterId: null,
            // selectedPaytypesMasterId: null,

            // formattedSelectedMenuItems: [],
            // unformattedSelectedMenuItems: []

        })
        setDepartmentCombineData({ ...departmentCombineData, data: departmentCombineData.data.map(dt => ({ ...dt, all: true, onlySelected: false, none: false, selectedChild: [] })) })
        setStatisticsCombineData({ ...statisticsCombineData, data: statisticsCombineData.data.map(dt => ({ ...dt, all: true, onlySelected: false, none: false, selectedChild: [] })) })
        setGLAccountCombineData({ ...glAccountCombineData, data: glAccountCombineData.data.map(dt => ({ ...dt, all: true, onlySelected: false, none: false, selectedChild: [] })) })
        setJobCodeCombineData({ ...jobCodeCombineData, data: jobCodeCombineData.data.map(dt => ({ ...dt, all: true, onlySelected: false, none: false, selectedChild: [] })) })
        setPayTypeCombineData({ ...payTypeCombineData, data: payTypeCombineData.data.map(dt => ({ ...dt, all: true, onlySelected: false, none: false, selectedChild: [] })) })
    }

    const handleChange = (e) => {
        if (e.target.id === 'confirmNewPassword' || e.target.id === 'newPassword' && (state.newPassword && state.confirmNewPassword)) {
            if ((e.target.id === 'confirmNewPassword' ? e.target.value !== state.confirmNewPassword : e.target.value !== state.newPassword)) {
                setState({
                    ...state,
                    [e.target.id]: e.target.value,
                    validationObj: {
                        ...state.validationObj,
                        confirmNewPassword: e.target.id === 'confirmNewPassword' ? e.target.value !== state.newPassword ? true : false : e.target.value !== state.confirmNewPassword ? true : false
                    },
                    confirmPasswordError: "*Please make sure your passwords match."
                });
                return
            }
        }
        setState({ ...state, [e.target.id]: e.target.value, validationObj: { ...state.validationObj, [e.target.id]: e.target.value ? false : true } });
    };


    const handleRowDoubleClick = async (selectedRow) => {
        const selRow = datarows.rows.find(data => data?.userProfileID === selectedRow?.cells[0]?.value)
        if (selRow) {
            setState({
                ...state,
                isOpen: true,
                isEdit: true,
                isMainModalDataLoading: true,
                validationObj: {}
            })
            await getDetailsOfUser(selRow.userProfileID).then((res) => {
                if (res?.userProfile) {
                    setState({
                        ...state,
                        userProfileID: res.userProfile.userProfileID,
                        username: res.userProfile.username,
                        firstName: res.userProfile.firstName,
                        lastName: res.userProfile.lastName,
                        displayName: res.userProfile.middleName,
                        initials: res.userProfile.initials,
                        email: res.userProfile.address,
                        jobFunction: res.userProfile.jobFunction,
                        newPassword: res.userProfile.userPassword,
                        confirmNewPassword: res.userProfile.userPassword,
                        isMainModalDataLoading: false,
                        isOpen: true,
                        isEdit: true,
                        selectedRoles: mapAlreadySelectedData(state.allRoles, res.allUserRoles, 'identityAppRoleID'),
                        selectedEntities: mapAlreadySelectedData(entites, res.allRoleEntities, 'entityID'),
                        validationObj: {}
                    })
                    setDepartmentCombineData({
                        ...departmentCombineData,
                        data: mapMasterDataForDetailView(departmentCombineData.data.map(dt => ({ ...dt, selectedChild: [] })), res.userProfile.userDepartments, departmentRelation.data, res.allRoleDepartments, 'departmentID')
                    })
                    setStatisticsCombineData({
                        ...statisticsCombineData,
                        data: mapMasterDataForDetailView(statisticsCombineData.data.map(dt => ({ ...dt, selectedChild: [] })), res.userProfile.userStatisticCodes, statisticsRelation.data, res.allRoleStatisticCodes, 'statisticsCodeID')
                    })
                    setGLAccountCombineData({
                        ...glAccountCombineData,
                        data: mapMasterDataForDetailView(glAccountCombineData.data.map(dt => ({ ...dt, selectedChild: [] })), res.userProfile.userGLAccounts, glAccountRelation.data, res.allRoleGLAccounts, 'glAccountID')
                    })
                    setJobCodeCombineData({
                        ...jobCodeCombineData,
                        data: mapMasterDataForDetailView(jobCodeCombineData.data.map(dt => ({ ...dt, selectedChild: [] })), res.userProfile.userJobCodes, jobCodeRelation.data, res.allRoleJobCodes, 'jobCodeID')
                    })
                    setPayTypeCombineData({
                        ...payTypeCombineData,
                        data: mapMasterDataForDetailView(payTypeCombineData.data.map(dt => ({ ...dt, selectedChild: [] })), res.userProfile.userPayTypes, payTypeRelation.data, res.allRolePayTypes, 'payTypeID')
                    })
                }
            })
        }
    }


    const mapMasterDataForDetailView = (combineData, userCombineData, relationShipData, userSelectedData, key) => {
        if (Array.isArray(userCombineData)) {
            combineData = combineData.map(data => {
                const obj = userCombineData?.find(dt => dt[key] === data[key])
                if (obj) {
                    return { ...data, all: obj.all, onlySelected: obj.onlySelected, none: obj.none }
                }
                return { ...data }
            })
        }
        if (userSelectedData?.length) {
            userSelectedData.forEach((dtt, i) => {
                const obj = relationShipData.find(data => data.childid === dtt[key] && data.relation === "MASTER");
                if (obj) userSelectedData[i] = { ...dtt, masterId: obj?.parentid }
                else userSelectedData[i] = { ...dtt, masterId: null }
            })
            combineData.forEach((data, index) => {
                if (data.onlySelected)
                    combineData[index] = { ...data, selectedChild: userSelectedData.filter(dt => dt.masterId === data[key]) }
            })
        }
        return combineData
    }

    const mapAlreadySelectedData = (alldata, userData, key) => {
        const arr = [];
        userData.map(id => {
            const obj = alldata.find(dt => dt[key] === id);
            if (obj) {
                arr.push(obj);
            }
        })
        return arr;
    }

    const emptytCurrentFieldsStates = () => {
        setLoadingState({
            ...loadingState,
            isLoading: true
        })
        setState({
            ...state,
            isOpen: false,
            isEdit: false,
            userProfileID: "",
            username: "",
            firstName: "",
            lastName: "",
            displayName: "",
            initials: "",
            email: "",
            jobFunction: "",
            newPassword: "",
            confirmNewPassword: "",
        })

        setTimeout(() => {
            setLoadingState({
                ...loadingState,
                isLoading: false
            })

        }, 0)
    }


    const applySelectedEnties = (selectedEntities) => {
        setState({
            ...state,
            selectedEntities,
            isEntitiesSelectorModalOpen: !state.isEntitiesSelectorModalOpen,
            isOpen: true
        })
    }


    const toggleRolesSelectorModal = () => {
        setState({
            ...state,
            isRolesModalOpen: !state.isRolesModalOpen,
            isOpen: true
        })
    }


    const toggleEntitySelectorModal = () => {
        setState({
            ...state,
            isEntitiesSelectorModalOpen: !state.isEntitiesSelectorModalOpen,
            isOpen: true
        })
    }
    const toggleDepartmentSelectorModal = () => {
        setState({
            ...state,
            isDepartmentsSelectorModalOpen: !state.isDepartmentsSelectorModalOpen,
            isOpen: true,
        })
    }
    const toggleGLAccountsSelectorModal = () => {
        setState({
            ...state,
            isGLAccountsSelectorModalOpen: !state.isGLAccountsSelectorModalOpen,
            isOpen: true,
        })
    }
    const toggleStatisticsSelectorModal = () => {
        setState({
            ...state,
            isStatisticsSelectorModalOpen: !state.isStatisticsSelectorModalOpen,
            isOpen: true,
        })
    }
    const toggleJobCodesSelectorModal = () => {
        setState({
            ...state,
            isJobCodesSelectorModalOpen: !state.isJobCodesSelectorModalOpen,
            isOpen: true,
        })
    }
    const togglePayTypesSelectorModal = () => {
        setState({
            ...state,
            isPayTypesSelectorModalOpen: !state.isPayTypesSelectorModalOpen,
            isOpen: true,
        })
    }

    const getSelectedDepartments = (selectedDeparments) => {
        setState({
            ...state,
            // selectedDeparments,
            isOpen: true,
            isDepartmentsSelectorModalOpen: false
        })

        const data = departmentCombineData.data.map(dcd => {
            if (state.selectedDepartmentMasterId === dcd.departmentID) {
                return { ...dcd, selectedChild: [...selectedDeparments] }
            }
            return { ...dcd }
        })
        setDepartmentCombineData({
            ...departmentCombineData,
            data
        })
    }
    const getSelectedGLAccounts = (selectedGLAccounts) => {
        setState({
            ...state,
            // selectedGLAccounts,
            isOpen: true,
            isGLAccountsSelectorModalOpen: false
        })
        const data = glAccountCombineData.data.map(dcd => {
            if (state.selectedglccountsMasterId === dcd.glAccountID) {
                return { ...dcd, selectedChild: [...selectedGLAccounts] }
            }
            return { ...dcd }
        })
        setGLAccountCombineData({
            ...glAccountCombineData,
            data
        })

    }
    const getSelectedStatistics = (selectedStatistics) => {
        setState({
            ...state,
            // selectedStatistics,
            isOpen: true,
            isStatisticsSelectorModalOpen: false
        })
        const data = statisticsCombineData.data.map(dcd => {
            if (state.selectedStatisticsMasterId === dcd.statisticsCodeID) {
                return { ...dcd, selectedChild: [...selectedStatistics] }
            }
            return { ...dcd }
        })
        setStatisticsCombineData({
            ...statisticsCombineData,
            data
        })
    }
    const getSelectedJobCodes = (selectedJobCodes) => {
        setState({
            ...state,
            // selectedJobCodes,
            isOpen: true,
            isJobCodesSelectorModalOpen: false
        })
        const data = jobCodeCombineData.data.map(dcd => {
            if (state.selectedJobCodeMasterId === dcd.jobCodeID) {
                return { ...dcd, selectedChild: [...selectedJobCodes] }
            }
            return { ...dcd }
        })
        setJobCodeCombineData({
            ...jobCodeCombineData,
            data
        })
    }
    const getSelectedPayTypes = (selectedPayTypes) => {
        setState({
            ...state,
            // selectedPayTypes,
            isOpen: true,
            isPayTypesSelectorModalOpen: false
        })
        const data = payTypeCombineData.data.map(dcd => {
            if (state.selectedPaytypesMasterId === dcd.payTypeID) {
                return { ...dcd, selectedChild: [...selectedPayTypes] }
            }
            return { ...dcd }
        })
        setPayTypeCombineData({
            ...payTypeCombineData,
            data
        })

    }

    const getSelectedRoles = (selectedRoles) => {
        setState({
            ...state,
            selectedRoles,
            isOpen: true,
            isRolesModalOpen: false
        })
    }

    const toFillEmptySpace = (bool) => {
        if (bool) {
            return (
                <>
                    <TableRow key={1}>
                        <TableCell key={1}></TableCell>
                    </TableRow>
                    <TableRow key={2}>
                        <TableCell key={2}></TableCell>
                    </TableRow>
                    <TableRow key={3}>
                        <TableCell key={3}></TableCell>
                    </TableRow>

                </>
            )

        }
        else
            return ''
    }

    useEffect(() => {
        // if (departmentRelation.isLoading) {
        setDepartmentCombineData({
            data: combineParentChildBasedOnRelationData(departments, departmentRelation.data, 'departmentID'),
            isLoading: false
        })
        // }
    }, [departmentRelation, departments])
    useEffect(() => {
        setStatisticsCombineData({
            data: combineParentChildBasedOnRelationData(statsData, statisticsRelation.data, 'statisticsCodeID'),
            isLoading: false
        })
    }, [statisticsRelation, statsData])
    useEffect(() => {
        setJobCodeCombineData({
            data: combineParentChildBasedOnRelationData(jobCodes, jobCodeRelation.data, 'jobCodeID'),
            isLoading: false
        })
    }, [jobCodeRelation, jobCodes])
    useEffect(() => {
        setPayTypeCombineData({
            data: combineParentChildBasedOnRelationData(payTypes, payTypeRelation.data, 'payTypeID'),
            isLoading: false
        })
    }, [payTypeRelation, payTypes])
    useEffect(() => {
        setGLAccountCombineData({
            data: combineParentChildBasedOnRelationData(gLAccounts, glAccountRelation.data, 'glAccountID'),
            isLoading: false
        })
    }, [glAccountRelation, gLAccounts])

    const combineParentChildBasedOnRelationData = (dimensionData, dimentionDataRelation, idKey) => {
        const masterData = dimensionData.filter(dt => dt.isMaster);
        const hereticalData = [];
        if (masterData.length) {
            masterData.forEach((data, index) => {
                const childRelation = dimentionDataRelation.filter(dr => dr.parentid === data[idKey])
                let childData = [];
                if (childRelation.length) {
                    childData = [];
                    childRelation.forEach(cr => {
                        const obj = dimensionData.find(dd => dd[idKey] === cr.childid)
                        if (obj) {
                            childData.push(
                                obj
                            )
                        }
                    })
                }
                hereticalData.push({
                    ...data,
                    all: true,
                    onlySelected: false,
                    none: false,
                    child: childData,
                    selectedChild: []
                })
            })
        }
        // console.log(idKey)
        // console.log(dimensionData)
        // console.log(dimentionDataRelation)
        return hereticalData
    }


    const handleCheckBoxoOnMasterDepartments = (rowId, allValue, selectedValue, noneValue) => {
        const DCD = departmentCombineData.data.map(data => {
            if (data.departmentID === rowId)
                return { ...data, all: allValue, onlySelected: selectedValue, none: noneValue }
            return { ...data }
        })
        setDepartmentCombineData({
            ...departmentCombineData,
            data: DCD
        })
    }

    const handleCheckBoxoOnMasterstatistics = (rowId, allValue, selectedValue, noneValue) => {
        const DCD = statisticsCombineData.data.map(data => {
            if (data.statisticsCodeID === rowId)
                return { ...data, all: allValue, onlySelected: selectedValue, none: noneValue }
            return { ...data }
        })
        setStatisticsCombineData({
            ...statisticsCombineData,
            data: DCD
        })
    }
    const handleCheckBoxoOnMasterglAccount = (rowId, allValue, selectedValue, noneValue) => {
        const DCD = glAccountCombineData.data.map(data => {
            if (data.glAccountID === rowId)
                return { ...data, all: allValue, onlySelected: selectedValue, none: noneValue }
            return { ...data }
        })
        setGLAccountCombineData({
            ...glAccountCombineData,
            data: DCD
        })
    }
    const handleCheckBoxoOnMasterjobCode = (rowId, allValue, selectedValue, noneValue) => {
        const DCD = jobCodeCombineData.data.map(data => {
            if (data.jobCodeID === rowId)
                return { ...data, all: allValue, onlySelected: selectedValue, none: noneValue }
            return { ...data }
        })
        setJobCodeCombineData({
            ...jobCodeCombineData,
            data: DCD
        })
    }
    const handleCheckBoxoOnMasterpayType = (rowId, allValue, selectedValue, noneValue) => {
        const DCD = payTypeCombineData.data.map(data => {
            if (data.payTypeID === rowId)
                return { ...data, all: allValue, onlySelected: selectedValue, none: noneValue }
            return { ...data }
        })
        setPayTypeCombineData({
            ...payTypeCombineData,
            data: DCD
        })
    }


    useEffect(() => {
        const unformattedSelectedMenuItems = [];
        state.selectedRoles.forEach(data => {
            if (data.roleScreens.length) {
                data.roleScreens.forEach(dt => {
                    if (!unformattedSelectedMenuItems.some(mi => mi.id === dt.id))
                        unformattedSelectedMenuItems.push({ ...dt, isExpanded: false })
                })
            }
        })
        setState({
            ...state,
            unformattedSelectedMenuItems,
            formattedSelectedMenuItems: formatMenuItemsData(unformattedSelectedMenuItems),
        })
    }, [state.selectedRoles])

    const formatMenuItemsData = (data) => {
        let arr = [];
        // level 2
        data.forEach(dt => {
            if (dt.parentId === null) {
                arr.push({
                    ...dt,
                    childRow: findChildRows(data, dt.id),
                    level: 2
                });
            }
        })
        // level 3
        arr = arr.map((dt => {
            return ({
                ...dt,
                childRow: dt.childRow.map(dat => {
                    return {
                        childRow: findChildRows(data, dat.id),
                        level: 3,
                        ...dat
                    }
                })
            })

        }))
        return arr
    }

    const findChildRows = (data, parentId) => {
        let childrens = data.filter(dt => dt.parentId === parentId);
        return childrens;
    }

    const menuItemsClicked = (rowId) => {
        const unformattedSelectedMenuItems = state.unformattedSelectedMenuItems.map(data => {
            if (data.id === rowId) {
                return { ...data, isExpanded: !data.isExpanded }
            }
            return { ...data }
        })
        setState({
            ...state,
            unformattedSelectedMenuItems,
            formattedSelectedMenuItems: formatMenuItemsData(unformattedSelectedMenuItems)
        })
    }

    const getMenuItemRows = (rows, isExpanded = false, index, isChild = false, level = 0) => {
        return rows.map((row, rowIndex) => {
            return (
                <>
                    <TableRow key={row.id} onClick={() => { menuItemsClicked(row.id) }}>
                        <TableCell style={(isChild && level) ? { paddingLeft: `${35 * level}px` } : {}} key={row.id}>{row?.childRow?.length ? row.isExpanded ? <ChevronUp16 /> : <ChevronDown16 /> : ""}{row.name}</TableCell>
                    </TableRow>
                    {(row?.childRow?.length && row.isExpanded) ? getMenuItemRows(row.childRow, row.isExpanded, rowIndex, true, row.level) : ""}
                </>
            )
        })
    }

    const onSubmit = async () => {
        if (checkValidations()) {
            const obj = {
                userProfile: {
                    userProfileID: state.isEdit ? state.userProfileID : 0,
                    firstName: state.firstName,
                    middleName: state.displayName,
                    lastName: state.lastName,
                    initials: state.initials,
                    jobFunction: state.jobFunction,
                    // dob: ,
                    // isLDAPUser: true,
                    contactNumber: state.email,
                    address: state.email,
                    username: state.username,
                    userPassword: state.newPassword,
                    creationDate: new Date(),
                    isActive: true,
                    isDeleted: false,
                    userEntities: "",
                    userDepartments: formatDepartmentMasterDetailsForAPI(departmentCombineData.data),
                    userStatisticCodes: formatStatisticsMasterDetailsForAPI(statisticsCombineData.data),
                    userGLAccounts: formatglAccountsMasterDetailsForAPI(glAccountCombineData.data),
                    userJobCodes: formatJobCodeMasterDetailsForAPI(jobCodeCombineData.data),
                    userPayTypes: formatPayTypesMasterDetailsForAPI(payTypeCombineData.data),
                    updatedDate: new Date(),
                },
                allUserRoles: formatRolesForAPI(state.selectedRoles, state.userProfileID),
                allRoleDepartments: formatDepartmentsForAPI(departmentCombineData.data),
                allRoleEntities: formatEntitiesForAPI(state.selectedEntities),
                allRoleStatisticCodes: formatStatsCodesForAPI(statisticsCombineData.data),
                allRoleGLAccounts: formatGLAccountsForAPI(glAccountCombineData.data),
                allRolePayTypes: formatPaytypesForAPI(payTypeCombineData.data),
                allRoleJobCodes: formatJobCodesForAPI(jobCodeCombineData.data)
            }
            if (state.isEdit) delete obj['userProfile']['creationDate'];
            try {
                await createUpdateUsers(obj).then((res) => {
                    loadUsers();
                    setState({
                        ...state,
                        isOpen: false,
                        isEdit: false,
                        showNotification: true,
                        notificationType: 'success',
                        notificationText: !state.isEdit ? "New user created." : "User updated.",
                    })
                })
            }
            catch (err) {
                setState({
                    ...state,
                    isOpen: false,
                    isEdit: false,
                    showNotification: true,
                    notificationType: "error",
                    notificationText: "Failed.",
                })
            }
        }
    }

    const formatRolesForAPI = (roles, userProfileID) => {
        return state.selectedRoles.map(data => {
            return {
                userID: {
                    userProfileID: userProfileID,
                },
                appRoleID: {
                    identityAppRoleID: data.identityAppRoleID
                }
            }
        })
    }

    const formatDepartmentsForAPI = (departments) => {
        const arr = [];
        departments.forEach(data => {
            if (data.all && data.child.length) {
                data.child.forEach(dt => {
                    arr.push(
                        {
                            departmentID: {
                                departmentID: dt.departmentID,
                            }
                        }
                    )
                })
            }
            else if (data.onlySelected && data.selectedChild.length) {
                data.selectedChild.forEach(dt => {
                    arr.push(
                        {
                            departmentID: {
                                departmentID: dt.departmentID,
                            }
                        }
                    )
                })
            }
        })
        return arr
    }

    const formatEntitiesForAPI = (entities) => {
        return entities.map(data => {
            return {
                entityID: {
                    entityID: data.entityID
                }
            }
        })
    }

    const formatStatsCodesForAPI = (statisticsCode) => {
        const arr = [];
        statisticsCode.forEach(data => {
            if (data.all && data.child.length) {
                data.child.forEach(dt => {
                    arr.push(
                        {
                            statsCodeID: {
                                statisticsCodeID: dt.statisticsCodeID,
                            }
                        }
                    )
                })
            }
            else if (data.onlySelected && data.selectedChild.length) {
                data.selectedChild.forEach(dt => {
                    arr.push(
                        {
                            statsCodeID: {
                                statisticsCodeID: dt.statisticsCodeID,
                            }
                        }
                    )
                })
            }
        })
        return arr
    }

    const formatGLAccountsForAPI = (glAccounts) => {
        const arr = [];
        glAccounts.forEach(data => {
            if (data.all && data.child.length) {
                data.child.forEach(dt => {
                    arr.push(
                        {
                            glAccountsID: {
                                glAccountID: dt.glAccountID,
                            }
                        }
                    )
                })
            }
            else if (data.onlySelected && data.selectedChild.length) {
                data.selectedChild.forEach(dt => {
                    arr.push(
                        {
                            glAccountsID: {
                                glAccountID: dt.glAccountID,
                            }
                        }
                    )
                })
            }
        })
        return arr

    }

    const formatPaytypesForAPI = (paytypes) => {
        const arr = [];
        paytypes.forEach(data => {
            if (data.all && data.child.length) {
                data.child.forEach(dt => {
                    arr.push(
                        {
                            payTypesID: {
                                payTypeID: dt.payTypeID,
                            }
                        }
                    )
                })
            }
            else if (data.onlySelected && data.selectedChild.length) {
                data.selectedChild.forEach(dt => {
                    arr.push(
                        {
                            payTypesID: {
                                payTypeID: dt.payTypeID,
                            }
                        }
                    )
                })
            }
        })
        return arr

    }

    const formatJobCodesForAPI = (jobCodes) => {
        const arr = [];
        jobCodes.forEach(data => {
            if (data.all && data.child.length) {
                data.child.forEach(dt => {
                    arr.push(
                        {
                            jobCodesID: {
                                jobCodeID: dt.jobCodeID,
                            }
                        }
                    )
                })
            }
            else if (data.onlySelected && data.selectedChild.length) {
                data.selectedChild.forEach(dt => {
                    arr.push(
                        {
                            jobCodesID: {
                                jobCodeID: dt.jobCodeID,
                            }
                        }
                    )
                })
            }
        })
        return arr
    }

    const formatDepartmentMasterDetailsForAPI = (departments) => {
        const arr = [];
        departments.forEach(data => {
            arr.push(
                {
                    departmentID: data.departmentID,
                    all: data.all,
                    onlySelected: data.onlySelected,
                    none: data.none
                }
            )
        })
        if (arr.length) return JSON.stringify(arr)
        return ""
    }

    const formatStatisticsMasterDetailsForAPI = (statistics) => {
        const arr = [];
        statistics.forEach(data => {
            arr.push(
                {
                    statisticsCodeID: data.statisticsCodeID,
                    all: data.all,
                    onlySelected: data.onlySelected,
                    none: data.none
                }
            )
        })
        if (arr.length) return JSON.stringify(arr)
        return ""
    }
    const formatglAccountsMasterDetailsForAPI = (glAccounts) => {
        const arr = [];
        glAccounts.forEach(data => {
            arr.push(
                {
                    glAccountID: data.glAccountID,
                    all: data.all,
                    onlySelected: data.onlySelected,
                    none: data.none
                }
            )
        })
        if (arr.length) return JSON.stringify(arr)
        return ""
    }
    const formatJobCodeMasterDetailsForAPI = (jobCodes) => {
        const arr = [];
        jobCodes.forEach(data => {
            arr.push(
                {
                    jobCodeID: data.jobCodeID,
                    all: data.all,
                    onlySelected: data.onlySelected,
                    none: data.none
                }
            )
        })
        if (arr.length) return JSON.stringify(arr)
        return ""
    }
    const formatPayTypesMasterDetailsForAPI = (paytypes) => {
        const arr = [];
        paytypes.forEach(data => {
            arr.push(
                {
                    payTypeID: data.payTypeID,
                    all: data.all,
                    onlySelected: data.onlySelected,
                    none: data.none
                }
            )
        })
        if (arr.length) return JSON.stringify(arr)
        return ""
    }


    const checkValidations = () => {
        const validationObj = {};
        if (!state.username) validationObj.username = true;
        if (!state.firstName) validationObj.firstName = true;
        if (!state.lastName) validationObj.lastName = true;
        if (!state.displayName) validationObj.displayName = true;
        if (!state.newPassword) validationObj.newPassword = true;
        if (!state.confirmNewPassword) validationObj.confirmNewPassword = true;
        if (state.newPassword !== state.confirmNewPassword) validationObj.confirmNewPassword = true;
        setState({ ...state, validationObj })
        if (state.username && state.firstName && state.lastName && state.displayName && state.newPassword && state.confirmNewPassword && (state.newPassword === state.confirmNewPassword))
            return true
        return false
    }


    const onSearch = (e) => {
        const value = e?.target?.value?.toLowerCase();
        if (value) {
            const rows = datarows.rows.filter(data => data.username?.toLowerCase()?.includes(value) || data.firstName?.toLowerCase()?.includes(value) || data.lastName?.toLowerCase()?.includes(value))
            setxDataRows({ rows: mapData(rows.slice(0, 20), "dd-mmm-yyyy") });
        }
        else {
            setxDataRows({ rows: mapData(datarows.rows.slice(0, 20), "dd-mmm-yyyy") });
        }
    }

    const actionsCountCheck = (selectedRows) => {
        if (selectedRows.length > 1) return
        return (
            <TableBatchAction
                renderIcon={Launch16}
                onClick={() => handleRowDoubleClick(selectedRows[0])}
            >
                Open
            </TableBatchAction>
        );
    }

    // console.log({departmentCombineData})
    // console.log("sss",departmentCombineData.data.find(dc => dc.departmentID === state.selectedDepartmentMasterId)?.selectedChild)
    return (
        <>
            <PageHeader
                heading="User setup"
                icon={<Favorite16 />}
                breadCrumb={breadCrumb}
                notification={location?.state?.notification}
                notificationKind={location?.state?.notificationKind} />
            {
                loadingState.isLoading ? <InlineLoading description="Loading..." /> :
                    <>

                        {state.showNotification ? <InlineNotification
                            title={state.notificationText}
                            kind={state.notificationType}
                            lowContrast='true'
                            notificationType='inline'
                            className='add-budgetversion-notification'
                            iconDescription="Close Notification"
                        /> : ""
                        }
                        <DataTable
                            key={"background-job-grid-key"}
                            rows={xdatarows.rows}
                            headers={initheaders}
                            isSortable={true}
                            radio={false}
                            pagination={true}
                            render={({
                                rows,
                                headers,
                                getHeaderProps,
                                defaultProps,
                                getRowProps,
                                getTableProps,
                                getSelectionProps,
                                selectedRows,
                                getBatchActionProps,
                                OverflowMenuProps
                            }) => (
                                <TableContainer className="budget-version-table-container" >
                                    <TableToolbar>
                                        <TableToolbarContent>
                                            <Search placeHolderText="Search users" onChange={onSearch} />
                                            <Button
                                                id="btnAddBudget"
                                                small
                                                kind="primary"
                                                onClick={() => toggleModal()}
                                            >
                                                Add &nbsp; &nbsp;+
              						</Button>
                                        </TableToolbarContent>
                                        {<TableBatchActions {...getBatchActionProps()}>
                                            {/* inside of you batch actinos, you can include selectedRows */}
                                            {actionsCountCheck(selectedRows)}
                                        </TableBatchActions >
                                        }
                                    </TableToolbar>
                                    {
                                        <><Table key={"background-job-grid-key"} id={"background-job-grid-key"} className="budget-version-table" size="compact" {...getTableProps}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableSelectAll {...getSelectionProps()} />

                                                    {headers.map((header) => {
                                                        return (
                                                            <TableHeader {...getHeaderProps({
                                                                header, onClick: () => { }
                                                            })}>
                                                                {header.header}
                                                            </TableHeader>
                                                        );
                                                    })}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows.map((row) => (
                                                    <TableRow
                                                        onDoubleClick={() => handleRowDoubleClick(row)}
                                                        {...getRowProps({ row })} key={row.id}>
                                                        <TableSelectRow {...getSelectionProps({ row })} />
                                                        {row.cells.map((cell) => {
                                                            return <TableCell key={cell.id}>{cell.value}</TableCell>;
                                                        })}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                            <Pagination
                                                id="paginationBar00"
                                                pageSizes={[20, 40, 60, 80, 100, 500, 1000]}
                                                pageSize={xitemsPerPage}
                                                page={xpageNo}
                                                totalItems={datarows.rows.length}
                                                onChange={paginationHandler}
                                                className="bx--pagination"
                                            />
                                        </>}
                                </TableContainer>
                            )}
                        />
                    </>
            }
            {/* <EntitySelector
                applySelectedEnties={applySelectedEnties}
                isEntitiesSelectorModalOpen={state.isEntitiesSelectorModalOpen}
                toggleEntitySelectorModal={toggleEntitySelectorModal}
            /> */}



            {/* allRoles*/}
            <DataSelectingModal
                isOpen={state.isRolesModalOpen}
                data={state.allRoles}
                selectedDataProps={state.selectedRoles}
                getSelectedData={getSelectedRoles}
                dialogHeading={"Roles"}
                leftSideHeading={"All roles"}
                rightSideHeading={"Selected roles"}
                idKey={'identityAppRoleID'}
                nameKey={'name'}
                closeModal={() => { toggleRolesSelectorModal() }}
            />

            {/* entitiesSelector */}
            <DataSelectingModal
                isOpen={state.isEntitiesSelectorModalOpen}
                data={entites}
                selectedDataProps={state.selectedEntities}
                getSelectedData={applySelectedEnties}
                dialogHeading={"Entities"}
                leftSideHeading={"All entities"}
                rightSideHeading={"Selected entities"}
                idKey={'entityID'}
                nameKey={'entityName'}
                closeModal={() => { toggleEntitySelectorModal() }}
            />

            {/* departmentSelector */}
            <DataSelectingModal
                isOpen={state.isDepartmentsSelectorModalOpen}
                // data={departments}
                data={state.selectedDepartmentMasterId ? departmentCombineData.data.find(dc => dc.departmentID === state.selectedDepartmentMasterId)?.child : []}
                selectedDataProps={state.selectedDepartmentMasterId ? departmentCombineData.data.find(dc => dc.departmentID === state.selectedDepartmentMasterId)?.selectedChild : []}
                getSelectedData={getSelectedDepartments}
                dialogHeading={"Departments"}
                leftSideHeading={"All departments"}
                rightSideHeading={"Selected departments"}
                idKey={'departmentID'}
                nameKey={'departmentName'}
                closeModal={() => { toggleDepartmentSelectorModal() }}
            />
            {/* stats selector */}
            <DataSelectingModal
                isOpen={state.isStatisticsSelectorModalOpen}
                // data={statsData}
                // selectedDataProps={[]}
                data={state.selectedStatisticsMasterId ? statisticsCombineData.data.find(dc => dc.statisticsCodeID === state.selectedStatisticsMasterId)?.child : []}
                selectedDataProps={state.selectedStatisticsMasterId ? statisticsCombineData.data.find(dc => dc.statisticsCodeID === state.selectedStatisticsMasterId)?.selectedChild : []}
                getSelectedData={getSelectedStatistics}
                dialogHeading={"Statistics"}
                leftSideHeading={"All statistics"}
                rightSideHeading={"Selected statistics"}
                idKey={'statisticsCodeID'}
                nameKey={'statisticsCodeName'}
                closeModal={() => { toggleStatisticsSelectorModal() }}
            />
            {/* GL Accounts  Selector*/}
            <DataSelectingModal
                isOpen={state.isGLAccountsSelectorModalOpen}
                // data={gLAccounts}
                // selectedDataProps={[]}
                data={state.selectedglccountsMasterId ? glAccountCombineData.data.find(dc => dc.glAccountID === state.selectedglccountsMasterId)?.child : []}
                selectedDataProps={state.selectedglccountsMasterId ? glAccountCombineData.data.find(dc => dc.glAccountID === state.selectedglccountsMasterId)?.selectedChild : []}
                getSelectedData={getSelectedGLAccounts}
                dialogHeading={"GL accounts"}
                leftSideHeading={"All GL accounts"}
                rightSideHeading={"Selected GL accounts"}
                idKey={'glAccountID'}
                nameKey={'glAccountName'}
                closeModal={() => { toggleGLAccountsSelectorModal() }}
            />

            {/* Job codes selector */}
            <DataSelectingModal
                isOpen={state.isJobCodesSelectorModalOpen}
                // data={jobCodes}
                // selectedDataProps={[]}
                data={state.selectedJobCodeMasterId ? jobCodeCombineData.data.find(dc => dc.jobCodeID === state.selectedJobCodeMasterId)?.child : []}
                selectedDataProps={state.selectedJobCodeMasterId ? jobCodeCombineData.data.find(dc => dc.jobCodeID === state.selectedJobCodeMasterId)?.selectedChild : []}
                getSelectedData={getSelectedJobCodes}
                dialogHeading={"Job codes"}
                leftSideHeading={"All job codes"}
                rightSideHeading={"Selected job codes"}
                idKey={'jobCodeID'}
                nameKey={'jobCodeName'}
                closeModal={() => { toggleJobCodesSelectorModal() }}
            />

            {/* paytypes selector */}
            <DataSelectingModal
                isOpen={state.isPayTypesSelectorModalOpen}
                // data={payTypes}
                // selectedDataProps={[]}
                data={state.selectedPaytypesMasterId ? payTypeCombineData.data.find(dc => dc.payTypeID === state.selectedPaytypesMasterId)?.child : []}
                selectedDataProps={state.selectedPaytypesMasterId ? payTypeCombineData.data.find(dc => dc.payTypeID === state.selectedPaytypesMasterId)?.selectedChild : []}
                getSelectedData={getSelectedPayTypes}
                dialogHeading={"Pay types"}
                leftSideHeading={"All pay types"}
                rightSideHeading={"Selected pay types"}
                idKey={'payTypeID'}
                nameKey={'payTypeName'}
                closeModal={() => { togglePayTypesSelectorModal() }}
            />

            {state.isOpen ? <FullScreenModal
                open={state.isOpen}
                hasScrollingContent={true}
                iconDescription="Close"
                modalHeading={state.isEdit ? "Update user" : "New user"}
                onRequestClose={() => { }}
                onRequestSubmit={onSubmit}
                onSecondarySubmit={() => { emptytCurrentFieldsStates() }}
                passiveModal={false}
                primaryButtonDisabled={false}
                primaryButtonText="Save"
                secondaryButtonText="Cancel"
                size='xl'
            >
                {state.isMainModalDataLoading ? <InlineLoading /> :
                    <div className="bx--grid">
                        <div className="bx--row">
                            <div className="bx--col">
                                <TextInput
                                    id="id"
                                    type="text"
                                    invalid={false}
                                    invalidText={'*required'}
                                    labelText="User id"
                                    onChange={handleChange}
                                    value={state.userProfileID}
                                    disabled={true}
                                />
                            </div>
                            <div className="bx--col">
                                <TextInput
                                    id="username"
                                    type="text"
                                    invalid={state.validationObj?.username}
                                    invalidText={'*required'}
                                    labelText="Username"
                                    onChange={handleChange}
                                    value={state.username}
                                    disabled={false}
                                />
                            </div>
                        </div>
                        {/*  */}
                        <div className="bx--row">
                            <div className="bx--col">
                                <TextInput
                                    id="firstName"
                                    type="text"
                                    invalid={state.validationObj?.firstName}
                                    invalidText={'*required'}
                                    labelText="First name"
                                    onChange={handleChange}
                                    value={state.firstName}
                                />
                            </div>
                            <div className="bx--col">
                                <TextInput
                                    id="lastName"
                                    type="text"
                                    invalid={state.validationObj?.lastName}
                                    invalidText={'*required'}
                                    labelText="Last name"
                                    onChange={handleChange}
                                    value={state.lastName}
                                />
                            </div>
                        </div><div className="bx--row">
                            <div className="bx--col">
                                <TextInput
                                    id="displayName"
                                    type="text"
                                    invalid={state.validationObj?.displayName}
                                    invalidText={'*required'}
                                    labelText="Display name"
                                    onChange={handleChange}
                                    value={state.displayName}
                                />
                            </div>
                            <div className="bx--col">
                                <TextInput
                                    id="initials"
                                    type="text"
                                    invalid={false}
                                    invalidText={'*required'}
                                    labelText="Initials (optional)"
                                    onChange={handleChange}
                                    value={state.initials}
                                />
                            </div>
                        </div><div className="bx--row">
                            <div className="bx--col">
                                <TextInput
                                    id="email"
                                    type="text"
                                    invalid={false}
                                    invalidText={'*required'}
                                    labelText="Email (optional)"
                                    onChange={handleChange}
                                    value={state.email}
                                />
                            </div>
                            <div className="bx--col">
                                <TextInput
                                    id="jobFunction"
                                    type="text"
                                    invalid={false}
                                    invalidText={'*required'}
                                    labelText="Job function (optional)"
                                    onChange={handleChange}
                                    value={state.jobFunction}
                                />
                            </div>
                        </div>
                        <div className="bx--row">
                            <div className="bx--col">
                                <TextInput
                                    id="newPassword"
                                    type="password"
                                    invalid={state.validationObj?.newPassword}
                                    invalidText={'*required'}
                                    labelText="New password"
                                    onChange={handleChange}
                                    value={state.newPassword}
                                />
                            </div>
                            <div className="bx--col">
                                <TextInput
                                    id="confirmNewPassword"
                                    type="password"
                                    invalid={state.validationObj?.confirmNewPassword}
                                    invalidText={state.confirmNewPassword ? state.confirmPasswordError : '*required'}
                                    labelText="Confirm new password"
                                    onChange={handleChange}
                                    value={state.confirmNewPassword}
                                />
                            </div>
                        </div>
                        <div className="bx--row position-relative">
                            <DataTable
                                rows={[]}
                                headers={[]}>
                                {({ rows, headers, getHeaderProps, getTableProps }) => (
                                    <TableContainer title="Roles">
                                        <Table {...getTableProps()} size='compact'>
                                            {/* <TableHead>
                                        <TableRow>
                                            {headers.map((header) => (
                                                <TableHeader {...getHeaderProps({ header })}>
                                                    {header.header}
                                                </TableHeader>
                                            ))}
                                        </TableRow>
                                    </TableHead> */}
                                            <TableBody className="tableDiv">
                                                {state.selectedRoles.map((row) => (
                                                    <TableRow key={row.identityAppRoleID}>
                                                        <TableCell key={row.identityAppRoleID}>{row.name}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {toFillEmptySpace(state.selectedRoles.length ? false : true)}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </DataTable>
                            <Button id="rolesSelection"
                                className="bx--btn--primary entitiesBtns position-absolute" type="Submit"
                                onClick={(e) => setState({ ...state, isRolesModalOpen: true, isOpen: false })}
                                disabled={false}>
                                {`Select`}
                            </Button>

                        </div>
                        {/*  */}
                        <div className="bx--row">
                            <DataTable
                                rows={[]}
                                headers={[]}
                            >
                                {({ rows, headers, getHeaderProps, getTableProps }) => (
                                    <TableContainer title="Menu items">
                                        <Table {...getTableProps()} size='compact'>
                                            <TableBody className="tableDiv">
                                                {/* {menuItems.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell >{row.bgjId}</TableCell>
                                            </TableRow>
                                        ))} */}
                                                {getMenuItemRows(state.formattedSelectedMenuItems, true)}
                                                {toFillEmptySpace(state.formattedSelectedMenuItems.length ? false : true)}

                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </DataTable>
                        </div>
                        <div className="bx--row position-relative">
                            <DataTable
                                rows={[]}
                                headers={[]}
                            >
                                {({ rows, headers, getHeaderProps, getTableProps }) => (
                                    <TableContainer title="Entities">
                                        <Table {...getTableProps()} size='compact'>
                                            <TableBody className="tableDiv">
                                                {state.selectedEntities.map((row) => (
                                                    <TableRow key={row.entityID}>
                                                        <TableCell >{row.entityName}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {toFillEmptySpace(state.selectedEntities.length ? false : true)}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </DataTable>
                            <Button id="menuItemsSelection"
                                className="bx--btn--primary entitiesBtns position-absolute" type="Submit"
                                onClick={(e) => setState({ ...state, isEntitiesSelectorModalOpen: true, isOpen: false })}
                                disabled={false}>
                                {`Select`}
                            </Button>
                        </div>
                        <div className="position-relative">
                            <DataTable
                                rows={[]}
                                headers={[]}
                            >
                                {({ rows, headers, getHeaderProps, getTableProps }) => (
                                    <TableContainer title="Departments">
                                        <Table {...getTableProps()} size='compact'>
                                            <TableHead>
                                                <TableRow>
                                                    <TableHeader >
                                                        Masters
                                                    </TableHeader>
                                                    <TableHeader >
                                                        All
                                                    </TableHeader>
                                                    <TableHeader >
                                                        Selected
                                                    </TableHeader>
                                                    <TableHeader >
                                                        None
                                                    </TableHeader>
                                                    <TableHeader >
                                                    </TableHeader>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody className="masterTables">
                                                {/* {state.selectedDeparments.map((row) => (
                                            <TableRow key={row.departmentID}>
                                                <TableCell >{row.departmentName}</TableCell>
                                            </TableRow>
                                        ))} */}
                                                {
                                                    (departmentCombineData.isLoading && departmentRelation.isLoading) ?
                                                        <InlineLoading /> :
                                                        departmentCombineData.data.map((row) => {
                                                            if (row?.child?.length) return (
                                                                <>
                                                                    <TableRow key={row.departmentID}>
                                                                        <TableCell >{row.departmentName}</TableCell>
                                                                        <TableCell >
                                                                            {/* <label htmlFor={`AutoUpdateCheckBox-dep-all${row.departmentID}`}>{""}</label> */}
                                                                            <Checkbox
                                                                                id={`AutoUpdateCheckBox-dep-all${row.departmentID}`}
                                                                                labelText={`AutoUpdateCheckBox-dep-all${row.departmentID}`}
                                                                                checked={row.all}
                                                                                onClick={(e) => {
                                                                                    handleCheckBoxoOnMasterDepartments(row.departmentID, !row.all, false, false)
                                                                                }}
                                                                                hideLabel
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell >
                                                                            <Checkbox
                                                                                id={`AutoUpdateCheckBox-dep-sel${row.departmentID}`}
                                                                                labelText={" "}
                                                                                checked={row.onlySelected}
                                                                                onClick={(e) => {
                                                                                    handleCheckBoxoOnMasterDepartments(row.departmentID, false, !row.isSelected, false)
                                                                                }}
                                                                                hideLabel
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell >
                                                                            <Checkbox
                                                                                id={`AutoUpdateCheckBox-dep-none${row.departmentID}`}
                                                                                labelText={" "}
                                                                                checked={row.none}
                                                                                onClick={(e) => {
                                                                                    handleCheckBoxoOnMasterDepartments(row.departmentID, false, false, !row.isSelected)
                                                                                }}
                                                                                hideLabel
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell >
                                                                            {
                                                                                row.onlySelected ?
                                                                                    row.child.length ?
                                                                                        <Button id="depNotAvailable"
                                                                                            className="bx--btn--primary" type="Submit"
                                                                                            onClick={(e) => setState({ ...state, isDepartmentsSelectorModalOpen: true, isOpen: false, selectedDepartmentMasterId: row.departmentID })}
                                                                                            disabled={!row.onlySelected}>
                                                                                            {`Select`}
                                                                                        </Button> : "Not available"
                                                                                    : " "
                                                                            }
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </>
                                                            )
                                                        })
                                                }
                                                {/* { } */}
                                                {/* {toFillEmptySpace(state.selectedDeparments.length ? false : true)} */}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </DataTable>
                            {/* <Button id="btnSaveNClose"
                        className="bx--btn--primary entitiesBtns position-absolute" type="Submit"
                        onClick={(e) => setState({ ...state, isDepartmentsSelectorModalOpen: true, isOpen: false })}
                        disabled={false}>
                        {`Select`}
                    </Button> */}

                        </div>
                        <div className="position-relative">
                            <DataTable
                                rows={[]}
                                headers={[]}
                            >
                                {({ rows, headers, getHeaderProps, getTableProps }) => (
                                    <TableContainer title="Statistics">
                                        <Table {...getTableProps()} size='compact'>
                                            <TableHead>
                                                <TableRow>
                                                    <TableHeader >
                                                        Masters
                                                    </TableHeader>
                                                    <TableHeader >
                                                        All
                                                    </TableHeader>
                                                    <TableHeader >
                                                        Selected
                                                    </TableHeader>
                                                    <TableHeader >
                                                        None
                                                    </TableHeader>
                                                    <TableHeader >
                                                    </TableHeader>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody className="masterTables">
                                                {/* {state.selectedStatistics.map((row) => (
                                            <TableRow key={row.statisticsCodeID}>
                                                <TableCell >{row.statisticsCodeName}</TableCell>
                                            </TableRow>
                                        ))}
                                        {toFillEmptySpace(state.selectedStatistics.length ? false : true)} */}
                                                {
                                                    (statisticsCombineData.isLoading && statisticsRelation.isLoading) ?
                                                        <InlineLoading /> :
                                                        statisticsCombineData.data.map((row) => {
                                                            if (row?.child?.length) return (
                                                                <TableRow key={row.statisticsCodeID}>
                                                                    <TableCell >{row.statisticsCodeName}</TableCell>
                                                                    <TableCell >
                                                                        <Checkbox
                                                                            id={`AutoUpdateCheckBox-stat-all${row.statisticsCodeID}`}
                                                                            labelText={""}
                                                                            checked={row.all}
                                                                            onClick={(e) => {
                                                                                handleCheckBoxoOnMasterstatistics(row.statisticsCodeID, !row.all, false, false)
                                                                            }}
                                                                            hideLabel

                                                                        />
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        <Checkbox
                                                                            id={`AutoUpdateCheckBox-stat-sel${row.statisticsCodeID}`}
                                                                            labelText={""}
                                                                            checked={row.onlySelected}
                                                                            onClick={(e) => {
                                                                                handleCheckBoxoOnMasterstatistics(row.statisticsCodeID, false, !row.isSelected, false)
                                                                            }}
                                                                            hideLabel

                                                                        />
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        <Checkbox
                                                                            id={`AutoUpdateCheckBox-stat-none${row.departmentID}`}
                                                                            labelText={""}
                                                                            checked={row.none}
                                                                            onClick={(e) => {
                                                                                handleCheckBoxoOnMasterstatistics(row.statisticsCodeID, false, false, !row.isSelected)
                                                                            }}
                                                                            hideLabel

                                                                        />
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        {
                                                                            row.onlySelected ?
                                                                                row.child.length ?
                                                                                    <Button id="statsNotAvailable"
                                                                                        className="bx--btn--primary" type="Submit"
                                                                                        onClick={(e) => setState({ ...state, isStatisticsSelectorModalOpen: true, isOpen: false, selectedStatisticsMasterId: row.statisticsCodeID })}
                                                                                        disabled={!row.onlySelected}>
                                                                                        {`Select`}
                                                                                    </Button> : "Not available"
                                                                                : ""
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </DataTable>
                            {/* <Button id="btnSaveNClose"
                        className="bx--btn--primary entitiesBtns position-absolute" type="Submit"
                        onClick={(e) => setState({ ...state, isStatisticsSelectorModalOpen: true, isOpen: false })}
                        disabled={false}>
                        {`Select`}
                    </Button> */}

                        </div>
                        <div className="position-relative">
                            <DataTable
                                rows={[]}
                                headers={[]}
                            >
                                {({ rows, headers, getHeaderProps, getTableProps }) => (
                                    <TableContainer title="GL accounts">
                                        <Table {...getTableProps()} size='compact'>
                                            <TableHead>
                                                <TableRow>
                                                    <TableHeader >
                                                        Masters
                                                    </TableHeader>
                                                    <TableHeader >
                                                        All
                                                    </TableHeader>
                                                    <TableHeader >
                                                        Selected
                                                    </TableHeader>
                                                    <TableHeader >
                                                        None
                                                    </TableHeader>
                                                    <TableHeader >
                                                    </TableHeader>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody className="masterTables">
                                                {/* {state.selectedGLAccounts.map((row) => (
                                            <TableRow key={row.glAccountID}>
                                                <TableCell >{row.glAccountName}</TableCell>
                                            </TableRow>
                                        ))}
                                        {toFillEmptySpace(state.selectedGLAccounts.length ? false : true)} */}
                                                {
                                                    (glAccountCombineData.isLoading && glAccountRelation.isLoading) ?
                                                        <InlineLoading /> :
                                                        glAccountCombineData.data.map((row) => {
                                                            if (row?.child?.length) return (
                                                                <TableRow key={row.glAccountID}>
                                                                    <TableCell >{row.glAccountName}</TableCell>
                                                                    <TableCell >
                                                                        <Checkbox
                                                                            id={`AutoUpdateCheckBox-gl-all${row.glAccountID}`}
                                                                            labelText={""}
                                                                            checked={row.all}
                                                                            onClick={(e) => {
                                                                                handleCheckBoxoOnMasterglAccount(row.glAccountID, !row.all, false, false)
                                                                            }}
                                                                            hideLabel

                                                                        />
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        <Checkbox
                                                                            id={`AutoUpdateCheckBox-gl-sel${row.glAccountID}`}
                                                                            labelText={""}
                                                                            checked={row.onlySelected}
                                                                            onClick={(e) => {
                                                                                handleCheckBoxoOnMasterglAccount(row.glAccountID, false, !row.isSelected, false)
                                                                            }}
                                                                            hideLabel

                                                                        />
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        <Checkbox
                                                                            id={`AutoUpdateCheckBox-gl-none${row.glAccountID}`}
                                                                            labelText={""}
                                                                            checked={row.none}
                                                                            onClick={(e) => {
                                                                                handleCheckBoxoOnMasterglAccount(row.glAccountID, false, false, !row.isSelected)
                                                                            }}
                                                                            hideLabel

                                                                        />
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        {
                                                                            row.onlySelected ?
                                                                                row.child.length ?
                                                                                    <Button id="glNotAvailable"
                                                                                        className="bx--btn--primary" type="Submit"
                                                                                        onClick={(e) => setState({ ...state, isGLAccountsSelectorModalOpen: true, isOpen: false, selectedglccountsMasterId: row.glAccountID })}
                                                                                        disabled={!row.onlySelected}>
                                                                                        {`Select`}
                                                                                    </Button> : "Not available"
                                                                                : ""
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </DataTable>
                            {/* <Button id="btnSaveNClose"
                        className="bx--btn--primary entitiesBtns position-absolute" type="Submit"
                        onClick={(e) => setState({ ...state, isGLAccountsSelectorModalOpen: true, isOpen: false })}
                        disabled={false}>
                        {`Select`}
                    </Button> */}
                        </div>
                        <div className="position-relative">
                            <DataTable
                                rows={[]}
                                headers={[]}
                            >
                                {({ rows, headers, getHeaderProps, getTableProps }) => (
                                    <TableContainer title="Job codes">
                                        <Table {...getTableProps()} size='compact'>
                                            <TableHead>
                                                <TableRow>
                                                    <TableHeader >
                                                        Masters
                                                    </TableHeader>
                                                    <TableHeader >
                                                        All
                                                    </TableHeader>
                                                    <TableHeader >
                                                        Selected
                                                    </TableHeader>
                                                    <TableHeader >
                                                        None
                                                    </TableHeader>
                                                    <TableHeader >
                                                    </TableHeader>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody className="masterTables">
                                                {/* {state.selectedJobCodes.map((row) => (
                                            <TableRow key={row.jobCodeID}>
                                                <TableCell >{row.jobCodeName}</TableCell>
                                            </TableRow>
                                        ))}
                                        {toFillEmptySpace(state.selectedJobCodes.length ? false : true)} */}
                                                {
                                                    (jobCodeCombineData.isLoading && jobCodeRelation.isLoading) ?
                                                        <InlineLoading /> :
                                                        jobCodeCombineData.data.map((row, i) => {
                                                            if (row?.child?.length) return (
                                                                <TableRow key={row.jobCodeID}>
                                                                    <TableCell >{row.jobCodeName}</TableCell>
                                                                    <TableCell >
                                                                        <Checkbox
                                                                            id={`AutoUpdateCheckBox-jc-all${row.jobCodeID}${i}`}
                                                                            labelText={""}
                                                                            checked={row.all}
                                                                            onClick={(e) => {
                                                                                handleCheckBoxoOnMasterjobCode(row.jobCodeID, !row.all, false, false)
                                                                            }}
                                                                            hideLabel

                                                                        />
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        <Checkbox
                                                                            id={`AutoUpdateCheckBox-jc-sel${row.jobCodeID}${i}`}
                                                                            labelText={""}
                                                                            checked={row.onlySelected}
                                                                            onClick={(e) => {
                                                                                handleCheckBoxoOnMasterjobCode(row.jobCodeID, false, !row.isSelected, false)
                                                                            }}
                                                                            hideLabel

                                                                        />
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        <Checkbox
                                                                            id={`AutoUpdateCheckBox-jc-none${row.jobCodeID}${i}`}
                                                                            labelText={""}
                                                                            checked={row.none}
                                                                            onClick={(e) => {
                                                                                handleCheckBoxoOnMasterjobCode(row.jobCodeID, false, false, !row.isSelected)
                                                                            }}
                                                                            hideLabel

                                                                        />
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        {
                                                                            row.onlySelected ?
                                                                                row.child.length ?
                                                                                    <Button id="jobCodeNotAvailable"
                                                                                        className="bx--btn--primary" type="Submit"
                                                                                        onClick={(e) => setState({ ...state, isJobCodesSelectorModalOpen: true, isOpen: false, selectedJobCodeMasterId: row.jobCodeID })}
                                                                                        disabled={!row.onlySelected}>
                                                                                        {`Select`}
                                                                                    </Button> : "Not available"
                                                                                : ""
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </DataTable>
                            {/* <Button id="btnSaveNClose"
                        className="bx--btn--primary entitiesBtns position-absolute" type="Submit"
                        onClick={(e) => setState({ ...state, isJobCodesSelectorModalOpen: true, isOpen: false })}
                        disabled={false}>
                        {`Select`}
                    </Button> */}
                        </div>
                        <div className="position-relative">
                            <DataTable
                                rows={[]}
                                headers={[]}
                            >
                                {({ rows, headers, getHeaderProps, getTableProps }) => (
                                    <TableContainer title="Pay types">
                                        <Table {...getTableProps()} size='compact'>
                                            <TableHead>
                                                <TableRow>
                                                    <TableHeader >
                                                        Masters
                                                    </TableHeader>
                                                    <TableHeader >
                                                        All
                                                    </TableHeader>
                                                    <TableHeader >
                                                        Selected
                                                    </TableHeader>
                                                    <TableHeader >
                                                        None
                                                    </TableHeader>
                                                    <TableHeader >
                                                    </TableHeader>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody className="masterTables">
                                                {/* {state.selectedPayTypes.map((row) => (
                                            <TableRow key={row.payTypeID}>
                                                <TableCell >{row.payTypeName}</TableCell>
                                            </TableRow>
                                        ))}
                                        {toFillEmptySpace(state.selectedPayTypes.length ? false : true)} */}
                                                {
                                                    (payTypeCombineData.isLoading && payTypeRelation.isLoading) ?
                                                        <InlineLoading /> :
                                                        payTypeCombineData.data.map((row, i) => {
                                                            if (row?.child?.length) return (
                                                                <TableRow key={row.payTypeID}>
                                                                    <TableCell >{row.payTypeName}</TableCell>
                                                                    <TableCell >
                                                                        <Checkbox
                                                                            id={`AutoUpdateCheckBox-pt-all${row.payTypeID}${i}`}
                                                                            labelText={""}
                                                                            checked={row.all}
                                                                            onClick={(e) => {
                                                                                handleCheckBoxoOnMasterpayType(row.payTypeID, !row.all, false, false)
                                                                            }}
                                                                            hideLabel

                                                                        />
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        <Checkbox
                                                                            id={`AutoUpdateCheckBox-pt-sel${row.payTypeID}`}
                                                                            labelText={""}
                                                                            checked={row.onlySelected}
                                                                            onClick={(e) => {
                                                                                handleCheckBoxoOnMasterpayType(row.payTypeID, false, !row.isSelected, false)
                                                                            }}
                                                                            hideLabel

                                                                        />
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        <Checkbox
                                                                            id={`AutoUpdateCheckBox-pt-none${row.payTypeID}`}
                                                                            labelText={""}
                                                                            checked={row.none}
                                                                            onClick={(e) => {
                                                                                handleCheckBoxoOnMasterpayType(row.payTypeID, false, false, !row.isSelected)
                                                                            }}
                                                                            hideLabel

                                                                        />
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        {
                                                                            row.onlySelected ?
                                                                                row.child.length ?
                                                                                    <Button id="paytypeNotAvaiable"
                                                                                        className="bx--btn--primary" type="Submit"
                                                                                        onClick={(e) => setState({ ...state, isPayTypesSelectorModalOpen: true, isOpen: false, selectedPaytypesMasterId: row.payTypeID })}
                                                                                        disabled={!row.onlySelected}>
                                                                                        {`Select`}
                                                                                    </Button> : "Not available"
                                                                                : ""
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </DataTable>
                            {/* <Button id="btnSaveNClose"
                        className="bx--btn--primary entitiesBtns position-absolute" type="Submit"
                        onClick={(e) => setState({ ...state, isPayTypesSelectorModalOpen: true, isOpen: false })}
                        disabled={false}>
                        {`Select`}
                    </Button> */}
                        </div>
                    </div>
                }
            </FullScreenModal> : ""}

        </>
    )
}
export default UserSetup;