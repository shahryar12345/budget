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
import { ChevronDown16, ChevronUp16, Favorite16, Information20 } from "@carbon/icons-react";
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

const MenuItemsSelector = ({
    applySelectedMenuItems,
    isEntitiesSelectorModalOpen,
    toggleEntitySelectorModal,
    menuItemsProps }) => {

    const initialLoadingStates = {
        isLoading: false
    }
    const initialMenuitemsState = {
        data: [],
        unformattedSelectedMenuItems: [],
        formattedSelectedMenuItems: [],
        formattedUnSelectedMenuItems: [],
        unformattedUnSelectedMenuItems: [],
        isMenuItemsLoading: false
    }

    const [state, setState] = useState({ ...initialState })
    // const [xpageNo, setPageNo] = useState(1);
    // const [xitemsPerPage, setItemsPerpage] = useState(20);
    // const [xdatarows, setxDataRows] = useState({ rows: [] });
    // const [loadingState, setLoadingState] = useState(initialLoadingStates);
    // const [datarows, setDataRows] = useState({ rows: [] });
    const [menuItems, setMenuItems] = useState({ ...initialMenuitemsState })

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
        let unformattedUnSelectedMenuItemsArray = [];
        let unformattedUnSelectedMenuItems = [];
        let unformattedSelectedMenuItemsArray = [];
        let unformattedSelectedMenuItems = [];
        // const unformattedSelectedMenuItemsVar = menuItems.unformattedUnSelectedMenuItems.filter(data => data?.isSelected).map(data => ({ ...data, isSelected: false }));
        const unformattedSelectedMenuItemsVar = menuItems.unformattedUnSelectedMenuItems.filter(data => data?.isSelected);
        if (unformattedSelectedMenuItemsVar?.length) {
            unformattedSelectedMenuItemsArray = [...menuItems.unformattedSelectedMenuItems, ...unformattedSelectedMenuItemsVar]
        }
        const unformattedUnSelectedMenuItemsVar = menuItems.unformattedUnSelectedMenuItems.filter(data => !data?.isSelected)
        if (unformattedUnSelectedMenuItemsVar?.length) {
            unformattedUnSelectedMenuItemsArray = [...unformattedUnSelectedMenuItemsVar]
        }

        unformattedUnSelectedMenuItemsArray.map(data => {
            if (unformattedUnSelectedMenuItemsArray.some(dt => dt.parentId === data.id)) {
                unformattedUnSelectedMenuItems.push(data)
            }
            else if (!menuItems.data.some(dt => dt.parentId === data.id)) {
                unformattedUnSelectedMenuItems.push(data)
            }
        })
        unformattedUnSelectedMenuItems = unformattedUnSelectedMenuItems.filter(data => ((unformattedUnSelectedMenuItems.some(dt => dt.parentId === data.id) || !menuItems.data.some(dt => dt.parentId === data.id))))
        unformattedSelectedMenuItemsArray.map(data => {
            if (data.parentId) {
                let parent = {}
                parent = menuItems.data.find(dt => dt.id === data.parentId);
                if (parent?.id) {
                    if (!unformattedSelectedMenuItems.some(dt => dt.id === parent.id)) {
                        if (!unformattedSelectedMenuItems.some(dt => dt.id === parent.id))
                            unformattedSelectedMenuItems.push(parent)
                        if (parent.parentId) {
                            parent = menuItems.data.find(dt => dt.id === parent.parentId);
                            if (parent?.id) {
                                if (!unformattedSelectedMenuItems.some(dt => dt.id === parent.id))
                                    unformattedSelectedMenuItems.push(parent)
                            }
                        }
                    }
                }
            }
            if (!unformattedSelectedMenuItems.some(dt => dt.id === data.id))
                unformattedSelectedMenuItems.push(data)
        })
        setMenuItems({
            ...menuItems,
            unformattedUnSelectedMenuItems,
            formattedUnSelectedMenuItems: formatMenuItemsData(unformattedUnSelectedMenuItems),
            unformattedSelectedMenuItems,
            formattedSelectedMenuItems: formatMenuItemsData(unformattedSelectedMenuItems)
        })
    }

    const moveSelectedUsersToLeft = () => {
        let unformattedUnSelectedMenuItemsArray = [];
        let unformattedUnSelectedMenuItems = [];
        let unformattedSelectedMenuItemsArray = [];
        let unformattedSelectedMenuItems = [];
        const unformattedUnSelectedMenuItemsVar = menuItems.unformattedSelectedMenuItems.filter(data => data?.isSelected).map(data => ({ ...data, isSelected: false }));
        if (unformattedUnSelectedMenuItemsVar?.length) {
            unformattedUnSelectedMenuItemsArray = [...menuItems.unformattedUnSelectedMenuItems, ...unformattedUnSelectedMenuItemsVar]
        }
        const unformattedSelectedMenuItemsVar = menuItems.unformattedSelectedMenuItems.filter(data => !data?.isSelected)
        if (unformattedSelectedMenuItemsVar?.length) {
            unformattedSelectedMenuItemsArray = [...unformattedSelectedMenuItemsVar]
        }

        unformattedSelectedMenuItemsArray.map(data => {
            if (unformattedSelectedMenuItemsArray.some(dt => dt.parentId === data.id)) {
                unformattedSelectedMenuItems.push(data)
            }
            else if (!menuItems.data.some(dt => dt.parentId === data.id)) {
                unformattedSelectedMenuItems.push(data)
            }
        })
        // unformattedSelectedMenuItems = unformattedSelectedMenuItems.map(data => {
        //     if (unformattedSelectedMenuItems.some(dt => dt.parentId === data.id) || data.parentId === null) {
        //         return
        //     }
        // })
        unformattedSelectedMenuItems = unformattedSelectedMenuItems.filter(data => ((unformattedSelectedMenuItems.some(dt => dt.parentId === data.id) || !menuItems.data.some(dt => dt.parentId === data.id))))
        unformattedUnSelectedMenuItemsArray.map(data => {
            if (data.parentId) {
                let parent = {}
                parent = menuItems.data.find(dt => dt.id === data.parentId);
                if (parent?.id) {
                    if (!unformattedUnSelectedMenuItems.some(dt => dt.id === parent.id)) {
                        if (!unformattedUnSelectedMenuItems.some(dt => dt.id === parent.id))
                            unformattedUnSelectedMenuItems.push(parent)
                        if (parent.parentId) {
                            parent = menuItems.data.find(dt => dt.id === parent.parentId);
                            if (parent?.id) {
                                if (!unformattedUnSelectedMenuItems.some(dt => dt.id === parent.id))
                                    unformattedUnSelectedMenuItems.push(parent)
                            }
                        }
                    }
                }
            }
            if (!unformattedUnSelectedMenuItems.some(dt => dt.id === data.id))
                unformattedUnSelectedMenuItems.push(data)
        })
        setMenuItems({
            ...menuItems,
            unformattedUnSelectedMenuItems,
            formattedUnSelectedMenuItems: formatMenuItemsData(unformattedUnSelectedMenuItems),
            unformattedSelectedMenuItems,
            formattedSelectedMenuItems: formatMenuItemsData(unformattedSelectedMenuItems)
        })

    }
    const moveAllUsersToRight = () => {
        let unformattedSelectedMenuItems = [...menuItems.data];
        unformattedSelectedMenuItems = unformattedSelectedMenuItems.map(data => ({ ...data, isSelected: true }))
        unformattedSelectedMenuItems = unformattedSelectedMenuItems
        setMenuItems({
            ...menuItems,
            unformattedSelectedMenuItems,
            formattedSelectedMenuItems: formatMenuItemsData(unformattedSelectedMenuItems),
            unformattedUnSelectedMenuItems: [],
            formattedUnSelectedMenuItems: []
        })
    }
    const moveAllUsersToLeft = () => {
        let unformattedUnSelectedMenuItems = [...menuItems.data];
        unformattedUnSelectedMenuItems = unformattedUnSelectedMenuItems.map(data => ({ ...data, isSelected: false }))
        setMenuItems({
            ...menuItems,
            unformattedUnSelectedMenuItems,
            formattedUnSelectedMenuItems: formatMenuItemsData(unformattedUnSelectedMenuItems),
            unformattedSelectedMenuItems: [],
            formattedSelectedMenuItems: []
        })
    }
    const onSubmit = () => {
        applySelectedMenuItems(menuItems.unformattedSelectedMenuItems.map(data => ({ ...data, isSelected: false })));
    }

    const handleCheckboxOfMenuItems = (selectedMenuItem, bool, direction) => {
        if (direction === 'left') {
            const unformattedUnSelectedMenuItems = menuItems.unformattedUnSelectedMenuItems.map(data => {
                if (selectedMenuItem === data.id) {
                    return { ...data, isSelected: bool }
                }
                return data
            })
            setMenuItems({
                ...menuItems,
                unformattedUnSelectedMenuItems,
                formattedUnSelectedMenuItems: formatMenuItemsData(unformattedUnSelectedMenuItems)
            })
        }
        else if (direction === 'right') {
            const unformattedSelectedMenuItems = menuItems.unformattedSelectedMenuItems.map(data => {
                if (selectedMenuItem === data.id) {
                    return { ...data, isSelected: bool }
                }
                return data
            })
            setMenuItems({
                ...menuItems,
                unformattedSelectedMenuItems,
                formattedSelectedMenuItems: formatMenuItemsData(unformattedSelectedMenuItems)
            })
        }
    }

    const btnsValidations = (btnType) => {
        let bool = true
        switch (btnType) {
            case ">> All":
                if (menuItems.unformattedUnSelectedMenuItems.length) bool = false;
                return bool;
            case "> Select":
                for (let su of menuItems.unformattedUnSelectedMenuItems) {
                    if (su.isSelected) {
                        bool = false;
                        break
                    }
                }
                return bool;
            case "< Remove":
                for (let su of menuItems.unformattedSelectedMenuItems) {
                    if (su.isSelected) {
                        bool = false;
                        break
                    }
                }
                return bool;
            case "<< All":
                if (menuItems.unformattedSelectedMenuItems.length) bool = false;
                return bool;
        }
    }

    const getMenuItemRows = (rows, isExpanded = false, direction, index, isChild = false, level = 0) => {
        return rows.map((row, rowIndex) => {
            return (
                <>
                    <TableRow key={row.id} onClick={row?.childRow?.length ? () => { menuItemsClicked(row.id, direction) } : () => { }}>
                        <TableCell style={(isChild && level) ? { paddingLeft: `${35 * level}px`, display: "flex" } : { display: "flex" }} key={row.id}>
                            {row?.childRow?.length ? row.isExpanded ? <ChevronUp16 /> : <ChevronDown16 /> : ""}
                            {row?.childRow?.length ? row.name : <Checkbox
                                id={`AutoUpdateCheckBox-00${direction}${row.id}`}
                                labelText={
                                    row.name
                                }
                                checked={row?.isSelected ? row?.isSelected : false}
                                onClick={(e) => {
                                    handleCheckboxOfMenuItems(row.id, row?.isSelected ? false : true, direction);
                                }}
                            />}
                        </TableCell>
                    </TableRow>
                    {(row?.childRow?.length && row.isExpanded) ? getMenuItemRows(row.childRow, row.isExpanded, direction, rowIndex, true, row.level, direction) : ""}
                </>
            )
        })
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

    const menuItemsClicked = (rowId, direction) => {
        if (direction === 'left') {
            const unformattedUnSelectedMenuItems = menuItems.unformattedUnSelectedMenuItems.map(data => {
                if (data.id === rowId) {
                    return { ...data, isExpanded: !data.isExpanded }
                }
                return { ...data }
            })
            setMenuItems({
                ...menuItems,
                unformattedUnSelectedMenuItems,
                formattedUnSelectedMenuItems: formatMenuItemsData(unformattedUnSelectedMenuItems)
            })
        }
        else if (direction === 'right') {
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
    }
    useEffect(() => {
        const unformattedUnSelectedMenuItems = [];
        const data = menuItemsProps.data.map(dt => ({ ...dt, isSelected: false }));
        const unformattedUnSelectedMenuItemsArray = [];
        data.forEach(dt => {
            if (!menuItemsProps.unformattedSelectedMenuItems.some(mn => mn.id === dt.id))
                unformattedUnSelectedMenuItemsArray.push(dt)
        })
        unformattedUnSelectedMenuItemsArray.map(data => {
            if (data.parentId) {
                let parent = {}
                parent = menuItemsProps.data.find(dt => dt.id === data.parentId);
                if (parent?.id) {
                    if (!unformattedUnSelectedMenuItems.some(dt => dt.id === parent.id)) {
                        if (!unformattedUnSelectedMenuItems.some(dt => dt.id === parent.id))
                            unformattedUnSelectedMenuItems.push(parent)
                        if (parent.parentId) {
                            parent = menuItemsProps.data.find(dt => dt.id === parent.parentId);
                            if (parent?.id) {
                                if (!unformattedUnSelectedMenuItems.some(dt => dt.id === parent.id))
                                    unformattedUnSelectedMenuItems.push(parent)
                            }
                        }
                    }
                }
            }
            if (!unformattedUnSelectedMenuItems.some(dt => dt.id === data.id))
                unformattedUnSelectedMenuItems.push(data)
        })
        setMenuItems({
            ...menuItems,
            ...menuItemsProps,
            data,
            unformattedUnSelectedMenuItems,
            formattedUnSelectedMenuItems: formatMenuItemsData(unformattedUnSelectedMenuItems)
        })
    }, [menuItemsProps])

    return (
        <>
            {isEntitiesSelectorModalOpen ? <FullScreenModal
                open={isEntitiesSelectorModalOpen}
                hasScrollingContent={true}
                iconDescription="Close"
                modalAriaLabel={"title"}
                modalHeading={"Menu items"}
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
                                    <TableContainer title="All menu items">
                                        <Table {...getTableProps()} size='compact'>
                                            <TableBody className="tableDiv">
                                                {getMenuItemRows(menuItems.formattedUnSelectedMenuItems, true, 'left')}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </DataTable>
                        </div>
                        <div className="bx--col-md-2">
                            <div className="btnSections">
                                <div>
                                    <Button id="menuItemsAllToLeft"
                                        className="bx--btn--primary entitiesBtns" type="Submit"
                                        onClick={(e) => { moveAllUsersToRight() }}
                                        disabled={btnsValidations(`>> All`)}>
                                        {`>> All`}
                                    </Button>
                                </div>
                                <div>
                                    <Button id="menuItemsSelectToRight"
                                        className="bx--btn--primary entitiesBtns" type="Submit"
                                        onClick={(e) => { moveSelectedUsersToRight() }}
                                        disabled={btnsValidations(`> Select`)}>
                                        {`> Select`}
                                    </Button>
                                </div>
                                <div>
                                    <Button id="menuItemsSelectToLeft"
                                        className="bx--btn--primary entitiesBtns" type="Submit"
                                        onClick={(e) => { moveSelectedUsersToLeft() }}
                                        disabled={btnsValidations(`< Remove`)}>
                                        {`< Remove`}
                                    </Button>
                                </div>
                                <div>
                                    <Button id="menuItemsAllToRight"
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
                                    <TableContainer title="Selected menu items">
                                        <Table {...getTableProps()} size='compact'>
                                            <TableBody className="tableDiv">
                                                {getMenuItemRows(menuItems.formattedSelectedMenuItems, true, 'right')}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </DataTable>

                        </div>
                    </div>
                </div>
            </FullScreenModal> : ""}

        </>
    )
}
export default MenuItemsSelector;
