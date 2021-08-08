import React, { useEffect, useState } from "react";
import {
    DataTable,
    Pagination,
    InlineLoading,
    Search,
    Button,
    TableToolbarContent,
    TextInput,
    TooltipIcon,
    Checkbox,
} from "carbon-components-react";
import { convertUTCDateToLocalDateLocalString } from "../../../../helpers/date.helper";
import { GetAllUsers, createUser } from '../../../../services/user-setup-service'
import initheaders from "./header";
import PageHeader from "../../../layout/PageHeader";
import { Favorite16, Information20 } from "@carbon/icons-react";
import FullScreenModal from "../../../shared/budget-versions-modal/full-screen-modal";
import { useSelector } from "react-redux";

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

const menuItems = [
    { bgjId: "Budget Versions" },
    { bgjId: "Reports" },
    { bgjId: "Structure Tables" },
    { bgjId: "FTE Divisors" },
    { bgjId: "Pay Type Distribution" },
    { bgjId: "Mapping" }
];

const role = [
    { bgjId: "Analytics Designer" },
    { bgjId: "Analytics Analyst" },
    { bgjId: "Analytics Designer" },
    { bgjId: "Analytics Analyst" },
    { bgjId: "Analytics Designer" },
    { bgjId: "Analytics Analyst" },
    { bgjId: "Analytics Designer" },
    { bgjId: "" },
    { bgjId: "" },
    { bgjId: "" },
    // { bgjId: "" },
    // { bgjId: "" },
    // { bgjId: "" },
    // { bgjId: "" },
    // { bgjId: "" },
    // { bgjId: "" },
    // { bgjId: "" },
    // { bgjId: "" },
    // { bgjId: "" },
    // { bgjId: "" },


]

const roles = [
    { bgjId: "Analytics Designer" },
    { bgjId: "Analytics Analyst" },
    { bgjId: "Analytics Designer" },
    { bgjId: "Analytics Analyst" },
    { bgjId: "Analytics Designer" },
    { bgjId: "Analytics Analyst" },
    { bgjId: "Analytics Designer" },
    { bgjId: "Analytics Analyst" },
    { bgjId: "Analytics Designer" },
    { bgjId: "Analytics Analyst" },
]
const initialState = {
    isOpen: true,
    firstName: "",
    lastName: "",
    displayName: "",
    initials: "",
    email: "",
    jobFunction: "",
    newPassword: "",
    confirmNewPassword: "",
    isEdit: false,
    unSelectEntities: [],
    selectedEntities: [],
    unSelectedUser: [],
    selectedUsers: []
}

const UsersSelector = ({
    applySelectedEnties,
    isEntitiesSelectorModalOpen,
    toggleEntitySelectorModal,
    users }) => {

    const initialLoadingStates = {
        isLoading: false
    }
    const [state, setState] = useState({ ...initialState, unSelectedUser: [...users.data] })
    const [xpageNo, setPageNo] = useState(1);
    const [xitemsPerPage, setItemsPerpage] = useState(20);
    const [xdatarows, setxDataRows] = useState({ rows: [] });
    const [loadingState, setLoadingState] = useState(initialLoadingStates);
    const [datarows, setDataRows] = useState({ rows: [] });
    const entites = useSelector((state) => state.MasterData.Entites);

    const loadbackgroundJobData = async () => {
        setLoadingState({ ...loadingState, isLoading: true })
        await GetAllUsers().then((response) => {

            setDataRows({ rows: response.sort((a, b) => (a.userProfileID < b.userProfileID) ? 1 : ((b.userProfileID < a.userProfileID) ? -1 : 0)) });
            setxDataRows({ rows: mapData(response.slice(0, 20), "dd-mmm-yyyy") });
        })
        setTimeout(() => {
            setLoadingState({ ...loadingState, isLoading: false })
        }, 0);
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
        data.forEach(function (row) {
            row["id"] = row["userProfileID"];
            row["createdAt"] = convertUTCDateToLocalDateLocalString(
                row["createdAt"] + "",
                dateformat, true
            );
            row["updatedAt"] = convertUTCDateToLocalDateLocalString(
                row["updatedAt"] + "",
                dateformat, true
            );
        });
        return data;
    }

    const breadCrumb = [
        {
            text: 'User setup',
            link: '/UserSetup/'
        }
    ];


    const toggleModal = () => {
        setState({ ...state, isOpen: !state.isOpen })
    }

    const handleChange = (e) => {
        setState({ ...state, [e.target.id]: e.target.value });
    };


    const moveSelectedUsersToRight = () => {
        const users = state.unSelectedUser.filter(data => data?.isSelected).map(data=>({...data, isSelected: false}));
        let selectedUsers = [];
        let unSelectedUser = [];
        if (users?.length) {
            selectedUsers = [...state.selectedUsers, ...users]
        }
        const unselectedUser = state.unSelectedUser.filter(data => !data?.isSelected)
        if (unselectedUser?.length) {
            unSelectedUser = [...unselectedUser]
        }
        setState({
            ...state,
            selectedUsers,
            unSelectedUser
        })
    }

    const moveSelectedUsersToLeft = () => {
        const users = state.selectedUsers.filter(data => data?.isSelected).map(data=>({...data, isSelected: false}));
        let unSelectedUser = [];
        let selectedUsers = [];
        if (users?.length) {
            unSelectedUser = [...state.unSelectedUser, ...users]
        }
        const unSelecteduser = state.selectedUsers.filter(data => !data?.isSelected)
        if (unSelecteduser?.length) {
            selectedUsers = [...unSelecteduser]
        }
        setState({
            ...state,
            selectedUsers,
            unSelectedUser
        })

    }
    const moveAllUsersToRight = () => {
        let selectedUsers = [...state.selectedUsers, ...state.unSelectedUser];
        selectedUsers = selectedUsers.map(data => ({ ...data, isSelected: false }))
        setState({
            ...state,
            selectedUsers,
            unSelectedUser: []
        })
    }
    const moveAllUsersToLeft = () => {
        let unSelectedUser = [...state.selectedUsers, ...state.unSelectedUser];
        unSelectedUser = unSelectedUser.map(data => ({ ...data, isSelected: false }))
        setState({
            ...state,
            unSelectedUser,
            selectedUsers: []
        })
    }
    const onSubmit = () => {
        applySelectedEnties(state.selectedUsers);
        // const data = {
        //     // "userProfileID": 0,
        //     firstName: state.firstName,
        //     lastName: state.lastName,
        //     // displayName: state.displayName,
        //     middleName: state.displayName,
        //     initials: state.initials,
        //     email: state.email,
        //     jobFunction: state.jobFunction,
        //     userPassword: state.newPassword,
        //     username: state.firstName + state.lastName,
        //     isActive: true,
        //     isDeleted: false
        //     // "dob": "2021-01-18T12:56:48.231Z",
        //     // "isLDAPUser": true,
        //     // "contactNumber": "",
        //     // "address": "",
        //     // "creationDate": "2021-01-18T12:56:48.231Z",
        //     // "updatedDate": "2021-01-18T12:56:48.231Z",
        //     // "createdBy": 0,
        //     // "updateBy": 0,
        //     // "rowVersion": "string",
        //     // "identifier": "string"
        // }

        // console.log(data)
        // await createUser(data).then((response) => {
        //     setState({
        //         ...state,
        //         isOpen: false,
        //         firstName: "",
        //         lastName: "",
        //         displayName: "",
        //         initials: "",
        //         email: "",
        //         jobFunction: "",
        //         newPassword: "",
        //         confirmNewPassword: ""
        //     })
        //     loadbackgroundJobData();
        // })
    }
    const handleRowDoubleClick = (selectedRow) => {
        const selRow = datarows.rows.find(data => data?.userProfileID === selectedRow?.cells[0]?.value)
        if (selRow) {
            setState({
                ...state,
                isOpen: true,
                isEdit: true,
                userProfileID: selRow.userProfileID,
                username: selRow.username,
                firstName: selRow.firstName,
                lastName: selRow.lastName,
                displayName: selRow.middleName,
                initials: selRow.initials,
                email: selRow.email,
                jobFunction: selRow.jobFunction,
                newPassword: selRow.userPassword,
                confirmNewPassword: selRow.userPassword,
                creationDate: new Date()
            })
        }
    }


    const emptytCurrentFieldsStates = () => {
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
    }
    useEffect(() => {
        const unSelectEntities = entites.map(data => ({ ...data, isSelected: false }))
        setState({ ...state, unSelectEntities })
    }, entites?.length);

    useEffect(() => {
        const unSelectedUser = users.data.map(data => ({ ...data, isSelected: false }));
        setState({ ...state, unSelectedUser })
    }, [users])

    const handleCheckboxOfUnselectUsers = (selectedUser, bool) => {
        const unSelectedUser = state.unSelectedUser.map(data => {
            if (selectedUser === data.userProfileID) {
                return { ...data, isSelected: bool }
            }
            return data
        })
        setState({ ...state, unSelectedUser })
    }

    const handleCheckboxOnSelectedUsers = (selectedUser, bool) => {
        const selectedUsers = state.selectedUsers.map(data => {
            if (selectedUser === data.userProfileID) {
                return { ...data, isSelected: bool }
            }
            return data
        })
        setState({ ...state, selectedUsers })
    }

    const btnsValidations = (btnType) => {
        let bool = true
        switch (btnType) {
            case ">> All":
                if (state.unSelectedUser.length) bool = false;
                return bool;
            case "> Select":
                for (let su of state.unSelectedUser) {
                    if (su.isSelected) {
                        bool = false;
                        break
                    }
                }
                return bool;
            case "< Remove":
                for (let su of state.selectedUsers) {
                    if (su.isSelected) {
                        bool = false;
                        break
                    }
                }
                return bool;
            case "<< All":
                if (state.selectedUsers.length) bool = false;
                return bool;
        }
    }

    // console.log({ state })
    // console.log({ entites })
    // console.log({ users })
    // console.log(state.unSelectedUser)
    return (
        <>
            <FullScreenModal
                open={isEntitiesSelectorModalOpen}
                hasScrollingContent={true}
                iconDescription="Close"
                modalAriaLabel={"title"}
                modalHeading={"Entities"}
                onRequestClose={() => { toggleEntitySelectorModal() }}
                onRequestSubmit={onSubmit}
                onSecondarySubmit={() => { toggleEntitySelectorModal() }}
                passiveModal={false}
                primaryButtonDisabled={false}
                primaryButtonText="Apply"
                secondaryButtonText="Cancel"
                size='xl'

            >
                <div className="bx--grid">
                    <div className="bx--row">
                        <div className="bx--col-md-3 entities">
                            <DataTable
                                rows={[]}
                                headers={[]}
                                className="aaaaa">
                                {({ rows, headers, getHeaderProps, getTableProps }) => (
                                    <TableContainer title="All users">
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
                                                {state.unSelectedUser.map((row) => (
                                                    <TableRow key={row.userProfileID}>
                                                        <TableCell key={row.userProfileID}>
                                                            <Checkbox
                                                                id={`AutoUpdateCheckBox-${row.userProfileID}`}
                                                                labelText={
                                                                    row.username
                                                                }
                                                                checked={row?.isSelected ? row?.isSelected : false}
                                                                onClick={(e) => {
                                                                    handleCheckboxOfUnselectUsers(row.userProfileID, row?.isSelected ? false : true);
                                                                }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </DataTable>
                        </div>
                        <div className="bx--col-md-2">
                            <div className="btnSections">
                                <div>
                                    <Button id="btnSaveNClose"
                                        className="bx--btn--primary entitiesBtns" type="Submit"
                                        onClick={(e) => { moveAllUsersToRight() }}
                                        disabled={btnsValidations(`>> All`)}>
                                        {`>> All`}
                                    </Button>
                                </div>
                                <div>
                                    <Button id="btnSaveNClose"
                                        className="bx--btn--primary entitiesBtns" type="Submit"
                                        onClick={(e) => { moveSelectedUsersToRight() }}
                                        disabled={btnsValidations(`> Select`)}>
                                        {`> Select`}
                                    </Button>
                                </div>
                                <div>
                                    <Button id="btnSaveNClose"
                                        className="bx--btn--primary entitiesBtns" type="Submit"
                                        onClick={(e) => { moveSelectedUsersToLeft() }}
                                        disabled={btnsValidations(`< Remove`)}>
                                        {`< Remove`}
                                    </Button>
                                </div>
                                <div>
                                    <Button id="btnSaveNClose"
                                        className="bx--btn--primary entitiesBtns" type="Submit"
                                        onClick={(e) => { moveAllUsersToLeft() }}
                                        disabled={btnsValidations(`<< All`)}>
                                        {`<< All`}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="bx--col-md-3 entities">
                            <DataTable
                                rows={[]}
                                headers={[]}>
                                {({ rows, headers, getHeaderProps, getTableProps }) => (
                                    <TableContainer title="Selected users">
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
                                                {state.selectedUsers.map((row) => (
                                                    <TableRow key={row.userProfileID}>
                                                        <TableCell key={row.userProfileID}>
                                                            <Checkbox
                                                                id={`AutoUpdateCheckBox-${row.userProfileID}`}
                                                                labelText={
                                                                    row.username
                                                                }
                                                                checked={row?.isSelected}
                                                                onClick={(e) => {
                                                                    handleCheckboxOnSelectedUsers(row.userProfileID, row?.isSelected ? false : true);
                                                                }}

                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </DataTable>

                        </div>
                    </div>
                </div>
            </FullScreenModal>

        </>
    )
}
export default UsersSelector;
