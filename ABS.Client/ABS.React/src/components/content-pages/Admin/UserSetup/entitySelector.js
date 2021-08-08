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

// const menuItems = [
//     { bgjId: "Budget Versions" },
//     { bgjId: "Reports" },
//     { bgjId: "Structure Tables" },
//     { bgjId: "FTE Divisors" },
//     { bgjId: "Pay Type Distribution" },
//     { bgjId: "Mapping" }
// ];

// const role = [
//     { bgjId: "Analytics Designer" },
//     { bgjId: "Analytics Analyst" },
//     { bgjId: "Analytics Designer" },
//     { bgjId: "Analytics Analyst" },
//     { bgjId: "Analytics Designer" },
//     { bgjId: "Analytics Analyst" },
//     { bgjId: "Analytics Designer" },
//     { bgjId: "" },
//     { bgjId: "" },
//     { bgjId: "" },
//     // { bgjId: "" },
//     // { bgjId: "" },
//     // { bgjId: "" },
//     // { bgjId: "" },
//     // { bgjId: "" },
//     // { bgjId: "" },
//     // { bgjId: "" },
//     // { bgjId: "" },
//     // { bgjId: "" },
//     // { bgjId: "" },


// ]

// const roles = [
//     { bgjId: "Analytics Designer" },
//     { bgjId: "Analytics Analyst" },
//     { bgjId: "Analytics Designer" },
//     { bgjId: "Analytics Analyst" },
//     { bgjId: "Analytics Designer" },
//     { bgjId: "Analytics Analyst" },
//     { bgjId: "Analytics Designer" },
//     { bgjId: "Analytics Analyst" },
//     { bgjId: "Analytics Designer" },
//     { bgjId: "Analytics Analyst" },
// ]
const initialState = {
    isOpen: true,
    // firstName: "",
    // lastName: "",
    // displayName: "",
    // initials: "",
    // email: "",
    // jobFunction: "",
    // newPassword: "",
    // confirmNewPassword: "",
    // isEdit: false,
    unSelectEntities: [],
    selectedEntities: []
}

const EntitySelector = ({ 
    applySelectedEnties,
     isEntitiesSelectorModalOpen,
     toggleEntitySelectorModal }) => {

    const initialLoadingStates = {
        isLoading: false
    }
    const [state, setState] = useState(initialState)
    // const [xpageNo, setPageNo] = useState(1);
    // const [xitemsPerPage, setItemsPerpage] = useState(20);
    // const [xdatarows, setxDataRows] = useState({ rows: [] });
    // const [loadingState, setLoadingState] = useState(initialLoadingStates);
    // const [datarows, setDataRows] = useState({ rows: [] });
    const entites = useSelector((state) => state.MasterData.Entites);

    // const loadbackgroundJobData = async () => {
    //     setLoadingState({ ...loadingState, isLoading: true })
    //     await GetAllUsers().then((response) => {

    //         setDataRows({ rows: response.sort((a, b) => (a.userProfileID < b.userProfileID) ? 1 : ((b.userProfileID < a.userProfileID) ? -1 : 0)) });
    //         setxDataRows({ rows: mapData(response.slice(0, 20), "dd-mmm-yyyy") });
    //     })
    //     setTimeout(() => {
    //         setLoadingState({ ...loadingState, isLoading: false })
    //     }, 0);
    // }

    // useEffect(() => {
    //     loadbackgroundJobData();
    // }, []);

    // const paginationHandler = async ({ page, pageSize }) => {
    //     setPageNo(page);
    //     setItemsPerpage(pageSize);
    //     setxDataRows({ rows: mapData(datarows.rows.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize), "dd-mmm-yyyy") });
    // };


    // const mapData = (data, dateformat) => {
    //     data.forEach(function (row) {
    //         row["id"] = row["userProfileID"];
    //         row["createdAt"] = convertUTCDateToLocalDateLocalString(
    //             row["createdAt"] + "",
    //             dateformat, true
    //         );
    //         row["updatedAt"] = convertUTCDateToLocalDateLocalString(
    //             row["updatedAt"] + "",
    //             dateformat, true
    //         );
    //     });
    //     return data;
    // }

    // const breadCrumb = [
    //     {
    //         text: 'User Setup',
    //         link: '/UserSetup/'
    //     }
    // ];


    // const toggleModal = () => {
    //     setState({ ...state, isOpen: !state.isOpen })
    // }

    // const handleChange = (e) => {
    //     // console.log('handle change', e, e.target.value);
    //     setState({ ...state, [e.target.id]: e.target.value });
    // };


    const moveSelectedEntitiesToRight = () => {
        const entities = state.unSelectEntities.filter(data => data?.isSelected)
        let selectedEntities = [];
        let unSelectEntities = [];
        if (entities?.length) {
            selectedEntities = [...state.selectedEntities, ...entities]

            // setState({
            //     ...state,
            //     selectedEntities: [...state.selectedEntities, ...entities]
            // })
        }

        const unselectEntities = state.unSelectEntities.filter(data => !data?.isSelected)
        if (unselectEntities?.length) {
            unSelectEntities = [...unselectEntities]
            // setState({
            //     ...state,
            //     unSelectEntities: [ ...unselectEntities]
            // })
        }
        setState({
            ...state,
            selectedEntities,
            unSelectEntities
        })

    }

    const moveSelectedEntitiesToLeft = () => {

    }
    const moveAllEntitiesToRight = () => {

    }
    const moveAllEntitiesToLeft = () => {

    }
    const onSubmit = () => {
        applySelectedEnties(state.selectedEntities);
    }

    // const handleRowDoubleClick = (selectedRow) => {
    //     const selRow = datarows.rows.find(data => data?.userProfileID === selectedRow?.cells[0]?.value)
    //     if (selRow) {
    //         setState({
    //             ...state,
    //             isOpen: true,
    //             isEdit: true,
    //             userProfileID: selRow.userProfileID,
    //             username: selRow.username,
    //             firstName: selRow.firstName,
    //             lastName: selRow.lastName,
    //             displayName: selRow.middleName,
    //             initials: selRow.initials,
    //             email: selRow.email,
    //             jobFunction: selRow.jobFunction,
    //             newPassword: selRow.userPassword,
    //             confirmNewPassword: selRow.userPassword,
    //             creationDate: new Date()
    //         })
    //     }
    // }


    // const emptytCurrentFieldsStates = () => {
    //     setState({
    //         ...state,
    //         isOpen: false,
    //         isEdit: false,
    //         userProfileID: "",
    //         username: "",
    //         firstName: "",
    //         lastName: "",
    //         displayName: "",
    //         initials: "",
    //         email: "",
    //         jobFunction: "",
    //         newPassword: "",
    //         confirmNewPassword: "",
    //     })
    // }
    useEffect(() => {
        const unSelectEntities = entites.map(data => ({ ...data, isSelected: false }))
        setState({ ...state, unSelectEntities })
    }, [entites]);

    const handleCheckboxOfUnselectEntities = (selectedEntity, bool) => {
        const unSelectEntities = state.unSelectEntities.map(data => {
            if (selectedEntity === data.entityID) {
                return { ...data, isSelected: bool }
            }
            return data
        })
        setState({ ...state, unSelectEntities })
    }
    // console.log({state})
    // console.log({entites})
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
                                >
                                {({ rows, headers, getHeaderProps, getTableProps }) => (
                                    <TableContainer title="All Entities">
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
                                                {state.unSelectEntities.map((row) => (
                                                    <TableRow key={row.entityID}>
                                                        <TableCell key={row.entityID}>
                                                            <Checkbox
                                                                id={`AutoUpdateCheckBox-${row.entityID}`}
                                                                labelText={
                                                                    row.entityName
                                                                }
                                                                checked={row?.isSelected ? row?.isSelected : false}
                                                                onClick={(e) => {
                                                                    handleCheckboxOfUnselectEntities(row.entityID, row?.isSelected ? false : true);
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
                                        onClick={(e) => { }}
                                        disabled={false}>
                                        {`>> All`}
                                    </Button>
                                </div>
                                <div>
                                    <Button id="btnSaveNClose"
                                        className="bx--btn--primary entitiesBtns" type="Submit"
                                        onClick={(e) => { moveSelectedEntitiesToRight() }}
                                        disabled={false}>
                                        {`> Select`}
                                    </Button>
                                </div>
                                <div>
                                    <Button id="btnSaveNClose"
                                        className="bx--btn--primary entitiesBtns" type="Submit"
                                        onClick={(e) => { }}
                                        disabled={true}>
                                        {`< Remove`}
                                    </Button>
                                </div>
                                <div>
                                    <Button id="btnSaveNClose"
                                        className="bx--btn--primary entitiesBtns" type="Submit"
                                        onClick={(e) => { }}
                                        disabled={false}>
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
                                    <TableContainer title="Selected Entities">
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
                                                {state.selectedEntities.map((row) => (
                                                    <TableRow key={row.entityID}>
                                                        <TableCell key={row.entityID}>
                                                            <Checkbox
                                                                id={"AutoUpdateCheckBox-"}
                                                                labelText={
                                                                    row.entityName
                                                                }
                                                                checked={true}
                                                                onClick={(e) => {
                                                                    // handleChange(e.target.checked);
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
export default EntitySelector;
