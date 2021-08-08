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
    TableExpandedRow,
    TableExpandRow,
    Checkbox,
    InlineNotification,
    TableBatchAction,
    TableBatchActions,
    TableSelectRow,
    TableSelectAll,
} from "carbon-components-react";
import { convertUTCDateToLocalDateLocalString } from "../../../../helpers/date.helper";
import { GetAllUsers, createUser, updateUser, assignEntitiesToUsers } from '../../../../services/user-setup-service'
import {
    GetAllRoles,
    createRole,
    getAllMenuItemsListWithActionPermissions,
    getRoleDetails,
} from '../../../../services/role-setup-service'

import initheaders from "./header";
import PageHeader from "../../../layout/PageHeader";
import { ChevronDown16, ChevronUp16, Delete16, Favorite16, Information20, Launch16 } from "@carbon/icons-react";
import FullScreenModal from "../../../shared/budget-versions-modal/full-screen-modal";
import UsersSelector from "./usersSelector";
import { getToken } from "../../../../helpers/utils";
import MenuItemsSelector from "./menuItemsSelector";
import { Children } from "react";
import DataSelectingModal from "../UserSetup/dataSelectionModal";
import { getApiResponseAsync } from "../../../../services/api/apiCallerGet";
import itemsDateFormat from "../../MasterData/forecastMethodType";
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

const initialState = {
    isOpen: false,
    isEdit: false,
    selectedEntities: [],
    isEntitiesSelectorModalOpen: false,
    isMenuItemsSelectorModalOpen: false,
    name: '',
    description: '',
    selectedUsers: [],
    selectedMenuItems: [],
    showSelectedMenuItemsAP: {},
    identityAppRoleID: 0,
    showNotification: false,
    notificationText: "",
    notificationType: "success"
}

const RoleSetup = ({ location }) => {

    const initialLoadingStates = {
        isLoading: true
    }
    const [state, setState] = useState(initialState)
    const [xpageNo, setPageNo] = useState(1);
    const [xitemsPerPage, setItemsPerpage] = useState(20);
    const [xdatarows, setxDataRows] = useState({ rows: [] });
    const [loadingState, setLoadingState] = useState(initialLoadingStates);
    const [datarows, setDataRows] = useState({ rows: [] });
    const [users, setUsers] = useState({ data: [], isUsersLoading: false });
    const [menuItems, setMenuItems] = useState({ data: [], formattedSelectedMenuItems: [], unformattedSelectedMenuItems: [], isMenuItemsLoading: false })
    const [newRoleSetupModalLoadingState, setNewRoleSetupModalLoadingState] = useState({ isLoading: false })
    const userSystemSettings = useSelector((state) => state.systemSettings);
    const dateformatdata = useSelector((state) => state.MasterData.ItemDateFormat);

    const loadbackgroundJobData = async () => {
        setNewRoleSetupModalLoadingState({ ...newRoleSetupModalLoadingState, isLoading: true })
        await loadListOfRoles();
        await GetAllUsers().then((response) => {
            setUsers({
                data: response.sort((a, b) => (a.userProfileID < b.userProfileID) ? 1 : ((b.userProfileID < a.userProfileID) ? -1 : 0)),
                isUsersLoading: false
            })
        });
        await getAllMenuItemsListWithActionPermissions().then(res => {
            setMenuItems({
                ...menuItems,
                data: [...res]
            })
            setNewRoleSetupModalLoadingState({ ...newRoleSetupModalLoadingState, isLoading: false })
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

    const loadListOfRoles = async () => {
        setLoadingState({ ...loadingState, isLoading: true });
        await GetAllRoles().then((response) => {
            setDataRows({ rows: response.sort((a, b) => (a.identityAppRoleID < b.identityAppRoleID) ? 1 : ((b.identityAppRoleID < a.identityAppRoleID) ? -1 : 0)) });
            setxDataRows({ rows: mapData(response.slice(0, 20), "dd-mmm-yyyy") });
        })
        setLoadingState({ ...loadingState, isLoading: false })
    }

    const mapData = (data, dateformat) => {
        let userSelectedDateFormat = dateformatdata.find(dataa => dataa.itemTypeValue === userSystemSettings.fiscalStartMonthDateFormat);
        userSelectedDateFormat = userSelectedDateFormat !== undefined ? userSelectedDateFormat.itemTypeCode : 'LLLL';
        data.forEach(function (row) {
            row["id"] = row["identityAppRoleID"];
            row["createdAt"] = convertUTCDateToLocalDateLocalString(
                row["creationDate"] + "",
                userSelectedDateFormat, true
            );
            row["updatedAt"] = convertUTCDateToLocalDateLocalString(
                row["updatedDate"] + "",
                userSelectedDateFormat, true
            );
        });
        return data;
    }

    const breadCrumb = [
        {
            text: 'Role setup',
            link: '/RoleSetup/'
        }
    ];

    const toggleModal = () => {
        setState({
            ...state,
            isOpen: !state.isOpen,
            name: "",
            description: '',
            selectedUsers: [],
            showSelectedMenuItemsAP: {},
            isEdit: false,
            identityAppRoleID: 0
        })
        setMenuItems({
            ...menuItems,
            data: menuItems.data.map(data => ({ ...data, actionsPermission: data.actionsPermission.map(dt => ({ ...dt, value: "false" })) })),
            unformattedSelectedMenuItems: [],
            formattedSelectedMenuItems: []
        })
    }

    const handleChange = (e) => {
        setState({ ...state, [e.target.id]: e.target.value });
    };

    const toGetUsersListInAPIFormat = (users) => {
        return users.map(data => {
            return ({
                "userID": {
                    "userProfileID": data.userProfileID
                },
                "appRoleID": {
                    "identityAppRoleID": state.identityAppRoleID
                },
                "isActive": true,
                "isDeleted": false
            })
        })
    }

    const toGetMenuItemsInAPIFormat = (menuItems) => {
        return menuItems.map(data => {
            return ({
                "screenID": {
                    "identityScreenID": data.id
                },
                "appRoleID": {
                    "identityAppRoleID": state.identityAppRoleID
                },
                "isActive": true,
                "isDeleted": false
            })
        })
    }
    const toGeMenuItemsActionsPermissionsInAPIFormat = (menuItems) => {
        const arr = [];
        menuItems.forEach(data => {
            if (data.actionsPermission.length) {
                data.actionsPermission.forEach(dt => {
                    arr.push(
                        {
                            "screenOperationID": {
                                "identityOperation": {
                                    "identityOperationID": dt.id
                                },
                                "identityScreens": {
                                    "identityScreenID": data.id
                                }
                            },
                            "appRoleID": {
                                "identityAppRoleID": state.identityAppRoleID
                            },
                            "value": `${dt.value}`,
                            "isActive": true,
                            "isDeleted": false
                        }
                    )
                })
            }
        })
        return arr
    }

    const onSubmit = async () => {
        const data = {
            "roleProfile": {
                "identityAppRoleID": state.identityAppRoleID,
                "name": state.name,
                "description": state.description,
                "isActive": true,
                "isDeleted": false,
                "creationDate": new Date(),
                "updatedDate": new Date(),
            },
            "allUserRoles": toGetUsersListInAPIFormat([...state.selectedUsers]),
            "allRoleScreens": toGetMenuItemsInAPIFormat([...menuItems.unformattedSelectedMenuItems]),
            "allRoleScreenOperations": toGeMenuItemsActionsPermissionsInAPIFormat([...menuItems.unformattedSelectedMenuItems])
        }
        await createRole(data).then(res => {
            loadListOfRoles();
            setState(({
                ...state,
                isOpen: false,
                showNotification: true,
                notificationText: state.isEdit ? "Role updated." : "New role created.",
                notificationType: 'success'
            }))
        })
    }
    const handleRowDoubleClick = async (selectedRow) => {
        setNewRoleSetupModalLoadingState({ ...newRoleSetupModalLoadingState, isLoading: true })
        setState(({
            ...state,
            isOpen: true,
            isEdit: true
        }))
        if (selectedRow?.cells[0]?.value) {
            await getRoleDetails(`${selectedRow?.cells[0]?.value}`).then(res => {
                console.log({ res })
                setMenuItems({
                    ...menuItems,
                    unformattedSelectedMenuItems: [...res.selectedMenuItems],
                    formattedSelectedMenuItems: formatMenuItemsData([...res.selectedMenuItems])
                })
                setState(({
                    ...state,
                    name: res?.roleProfile?.name,
                    description: res?.roleProfile?.description,
                    identityAppRoleID: res?.roleProfile?.identityAppRoleID,
                    selectedUsers: [...res?.selectedUsers],
                    isOpen: true,
                    isEdit: true,
                    showSelectedMenuItemsAP: {}
                }))
                setNewRoleSetupModalLoadingState({ ...newRoleSetupModalLoadingState, isLoading: false })
            })
        }
    }

    const applySelectedEnties = (selectedUsers) => {
        setState({
            ...state,
            selectedUsers,
            isEntitiesSelectorModalOpen: !state.isEntitiesSelectorModalOpen,
            isOpen: true
        })
    }

    const applySelectedMenuItems = (unformattedSelectedMenuItems) => {
        setMenuItems({
            ...menuItems,
            unformattedSelectedMenuItems,
            formattedSelectedMenuItems: formatMenuItemsData(unformattedSelectedMenuItems)
        })

        setState({
            ...state,
            isMenuItemsSelectorModalOpen: !state.isMenuItemsSelectorModalOpen,
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
    const toggleMenuItemsSelectorModalOpen = () => {
        setState({
            ...state,
            isMenuItemsSelectorModalOpen: !state.isMenuItemsSelectorModalOpen,
            isOpen: true
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

    const getMenuItemRowsForActionPermissions = (rows, isExpanded = false, index, isChild = false, level = 0) => {
        return rows.map((row, rowIndex) => {
            return (
                <>
                    <TableRow key={row.id} onClick={row?.childRow?.length ? () => { menuItemsClicked(row.id) } : () => { }}>
                        <TableCell style={(isChild && level) ? { paddingLeft: `${35 * level}px`, display: "flex" } : { display: "flex" }} key={row.id}>
                            {row?.childRow?.length ? row.isExpanded ? <ChevronUp16 /> : <ChevronDown16 /> : ""}
                            {row?.childRow?.length ? row.name : <div><Checkbox
                                id={`AutoUpdateCheckBox-0${row.id}`}
                                labelText={
                                    row.name
                                }
                                checked={row?.isSelected ? row?.isSelected : false}
                                onClick={(e) => {
                                    handleCheckboxOfMenuItems(row.id, row?.isSelected ? false : true);
                                }}
                            /></div>}
                        </TableCell>
                    </TableRow>
                    {(row?.childRow?.length && row.isExpanded) ? getMenuItemRowsForActionPermissions(row.childRow, row.isExpanded, rowIndex, true, row.level) : ""}
                </>
            )
        })
    }

    const handleCheckboxOfMenuItems = (selectedRowId, bool) => {
        if (bool) {
            const showSelectedMenuItemsAP = menuItems.unformattedSelectedMenuItems.find(data => data.id === selectedRowId)
            const unformattedSelectedMenuItems = menuItems.unformattedSelectedMenuItems.map(data => {
                if (selectedRowId === data.id) return { ...data, isSelected: bool }
                return { ...data, isSelected: false }
            })
            setState({
                ...state,
                showSelectedMenuItemsAP
            })
            setMenuItems({
                ...menuItems,
                unformattedSelectedMenuItems,
                formattedSelectedMenuItems: formatMenuItemsData(unformattedSelectedMenuItems)
            })
        }
        else {
            const unformattedSelectedMenuItems = menuItems.unformattedSelectedMenuItems.map(data => ({ ...data, isSelected: false }))
            setMenuItems({
                ...menuItems,
                unformattedSelectedMenuItems,
                formattedSelectedMenuItems: formatMenuItemsData(unformattedSelectedMenuItems)

            })
            setState({
                ...state,
                showSelectedMenuItemsAP: {}
            })
        }
    }


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
        const unformattedSelectedMenuItems = menuItems.unformattedSelectedMenuItems.map(data => {
            if (data.id === rowId) {
                return { ...data, isExpanded: !data.isExpanded }
            }
            return { ...data }
        })
        setMenuItems({
            ...menuItems,
            unformattedSelectedMenuItems,
            formattedSelectedMenuItems: formatMenuItemsData(unformattedSelectedMenuItems)
        })
    }

    const handleCheckBoxOnActionsPermissions = (currectSelectedRowId, actionPermissionId, bool) => {
        const unformattedSelectedMenuItems = menuItems.unformattedSelectedMenuItems.map(data => {
            if (data.id === currectSelectedRowId) {
                data.actionsPermission.map((dt, index) => {
                    if (dt.id === actionPermissionId) {
                        data.actionsPermission[index] = { ...data.actionsPermission[index], value: bool }
                        return { ...data }
                    }
                })
                return { ...data }
            }
            return { ...data }
        })
        setMenuItems({
            ...menuItems,
            unformattedSelectedMenuItems,
            formattedSelectedMenuItems: formatMenuItemsData(unformattedSelectedMenuItems)
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

    const validation = () => {
        const {
            name
        } = state
        if (name) return false;
        return true
    }


    const emptytCurrentFieldsStates = () => {
        setLoadingState({
            ...loadingState,
            isLoading: true
        })
        setState({
            ...state,
            isOpen: !state.isOpen,
            name: "",
            description: '',
            selectedUsers: [],
            showSelectedMenuItemsAP: {},
            isEdit: false,
            showNotification: false
        })
        setMenuItems({
            ...menuItems,
            unformattedSelectedMenuItems: [],
            formattedSelectedMenuItems: []
        })
        setTimeout(() => {
            setLoadingState({
                ...loadingState,
                isLoading: false
            })
        }, 0)
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

    const onSearch = (e) => {
        const value = e?.target?.value?.toLowerCase();
        if (value) {
            const rows = datarows.rows.filter(data => data.name?.toLowerCase()?.includes(value) || data.description?.toLowerCase()?.includes(value))
            setxDataRows({ rows: mapData(rows.slice(0, 20), "dd-mmm-yyyy") });
        }
        else {
            setxDataRows({ rows: mapData(datarows.rows.slice(0, 20), "dd-mmm-yyyy") });
        }
    }

    // console.log({ menuItems })

    return (
        <>
            <PageHeader
                heading="Role setup"
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
                                        {/* {console.log({ rows })} */}
                                        <TableToolbarContent>
                                            <Search placeHolderText="Search roles" onChange={onSearch} />
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
                                                    {/* <TableHeader>
                                                    </TableHeader> */}
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
                                                id="paginationBar"
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
            {/* <UsersSelector
                applySelectedEnties={applySelectedEnties}
                isEntitiesSelectorModalOpen={state.isEntitiesSelectorModalOpen}
                toggleEntitySelectorModal={toggleEntitySelectorModal}
                users={users}
            /> */}

            {/* UsersSelector*/}
            <DataSelectingModal
                isOpen={state.isEntitiesSelectorModalOpen}
                data={users.data}
                selectedDataProps={state.selectedUsers}
                getSelectedData={applySelectedEnties}
                dialogHeading={"Users"}
                leftSideHeading={"All users"}
                rightSideHeading={"Selected users"}
                idKey={'userProfileID'}
                nameKey={'username'}
                closeModal={() => { toggleEntitySelectorModal() }}
            />

            <MenuItemsSelector
                applySelectedMenuItems={applySelectedMenuItems}
                isEntitiesSelectorModalOpen={state.isMenuItemsSelectorModalOpen}
                toggleEntitySelectorModal={toggleMenuItemsSelectorModalOpen}
                menuItemsProps={{ ...menuItems }}
            />
            {state.isOpen ?<FullScreenModal
                open={state.isOpen}
                hasScrollingContent={true}
                iconDescription="Close"
                modalAriaLabel={"ssstitle"}
                modalHeading={state.isEdit ? "Update role" : "New role"}
                onRequestClose={(e) => { }}
                onRequestSubmit={onSubmit}
                onSecondarySubmit={() => { emptytCurrentFieldsStates() }}
                passiveModal={false}
                primaryButtonDisabled={validation()}
                primaryButtonText="Save"
                secondaryButtonText="Cancel"
                size='xl'
            >
                {newRoleSetupModalLoadingState.isLoading ? <InlineLoading /> : <div className="bx--grid">
                    <div className="bx--row">
                        <div className="bx--col">
                            <TextInput
                                id="name"
                                type="text"
                                invalid={false}
                                invalidText={'*required'}
                                labelText="Name"
                                onChange={handleChange}
                                value={state.name}
                            />
                        </div>
                    </div>
                    <div className="bx--row">
                        <div className="bx--col">
                            <TextInput
                                id="description"
                                type="text"
                                invalid={false}
                                invalidText={'*required'}
                                labelText="Description"
                                onChange={handleChange}
                                value={state.description}
                            />
                        </div>
                    </div>
                    <div className="bx--row position-relative">
                        <DataTable
                            rows={[]}
                            headers={[]}
                        >
                            {({ rows, headers, getHeaderProps, getTableProps }) => (
                                <TableContainer title="Assigned user">
                                    <Table {...getTableProps()} size='compact'>
                                        <TableBody className="tableDiv">
                                            {state.selectedUsers.map((row) => (
                                                <TableRow key={row.userProfileID}>
                                                    <TableCell >{row.username}</TableCell>
                                                </TableRow>
                                            ))}
                                            {toFillEmptySpace(state.selectedUsers.length ? false : true)}

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </DataTable>
                        <Button id="usersSelect"
                            className="bx--btn--primary entitiesBtns position-absolute" type="Submit"
                            onClick={(e) => setState({ ...state, isEntitiesSelectorModalOpen: true, isOpen: false })}
                            disabled={false}>
                            {`Select`}
                        </Button>

                    </div>
                    <div className="bx--row position-relative">
                        <DataTable
                            rows={[]}
                            headers={[]}
                        >
                            {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
                                <TableContainer title="Menu items">
                                    <Table {...getTableProps()} size='compact'>
                                        <TableBody className="tableDiv">
                                            {getMenuItemRows(menuItems.formattedSelectedMenuItems, true)}
                                            {toFillEmptySpace(menuItems.formattedSelectedMenuItems.length ? false : true)}

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </DataTable>
                        <Button id="menusSelect"
                            className="bx--btn--primary entitiesBtns position-absolute" type="Submit"
                            onClick={(e) => setState({ ...state, isMenuItemsSelectorModalOpen: true, isOpen: false })}
                            disabled={false}>
                            {`Select`}
                        </Button>

                    </div>
                    <div className="bx--row position-relative">
                        <DataTable
                            rows={[]}
                            headers={[]}
                        >
                            {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
                                <TableContainer title="Action permissions">
                                    <Table {...getTableProps()} size='compact'>
                                        <TableBody className="tableDiv">
                                            {getMenuItemRowsForActionPermissions(menuItems.formattedSelectedMenuItems, true)}
                                            {toFillEmptySpace(menuItems.formattedSelectedMenuItems.length ? false : true)}

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </DataTable>
                        <div className="actionPermissionDataTable">
                            <DataTable
                                rows={[]}
                                headers={[]}
                            >
                                {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
                                    <TableContainer title="   ">
                                        <Table {...getTableProps()} size='compact'>
                                            <TableBody className="tableDiv">
                                                {state.showSelectedMenuItemsAP?.actionsPermission?.length ? state.showSelectedMenuItemsAP?.actionsPermission.map((row) => (
                                                    <TableRow key={row.id}>
                                                        <TableCell >
                                                            <Checkbox
                                                                id={`AutoUpdateCheckBox-00${row.id}`}
                                                                labelText={
                                                                    row.name
                                                                }
                                                                checked={row?.value ? row?.value === "true" ? true : false : false}
                                                                onClick={(e) => {
                                                                    handleCheckBoxOnActionsPermissions(state.showSelectedMenuItemsAP.id, row.id, row?.value ? row.value === "true" ? "false" : "true" : "true");
                                                                }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                )) : ""}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </DataTable>
                        </div>
                    </div>
                </div>}
            </FullScreenModal>: ""}
        </>
    )
}
export default RoleSetup;
