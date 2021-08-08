import React, { useEffect, useState} from "react";
import {
	DataTable,
	Pagination,
	InlineLoading,
} from "carbon-components-react";
import { convertUTCDateToLocalDateLocalString } from "../../../helpers/date.helper";
import {GetAllBackgroundJobs} from '../../../services/background-job-service'
import initheaders from "./header";
import PageHeader from "../../layout/PageHeader";
import { Favorite16 } from "@carbon/icons-react";

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


const Backgroundjob = ({location}) => {

    const initialLoadingStates = {
		isLoading: false
    }
    
    const [xpageNo, setPageNo] = useState(1);
	const [xitemsPerPage, setItemsPerpage] = useState(20);
	const [xdatarows, setxDataRows] = useState({ rows: [] });
    const [loadingState, setLoadingState] = useState(initialLoadingStates);
    const [datarows, setDataRows] = useState({ rows: [] });
    

    const loadbackgroundJobData = async () => {
        setLoadingState({...loadingState , isLoading:true})
        await GetAllBackgroundJobs().then((response) => {

            setDataRows({rows : response.sort((a,b) => (a.bgjId < b.bgjId) ? 1 : ((b.bgjId < a.bgjId) ? -1 : 0))});
            setxDataRows({rows : mapData(response.slice(0 , 20) , "dd-mmm-yyyy")});            
        })
        setTimeout(() => {
            setLoadingState({...loadingState , isLoading:false})     
        }, 0);
    }

    useEffect(() => {
        loadbackgroundJobData()
    } , []);

    const paginationHandler = async ({ page, pageSize }) => {
        setPageNo(page);
		setItemsPerpage(pageSize);
        setxDataRows({rows : mapData(datarows.rows.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize) , "dd-mmm-yyyy")}); 
    };
    

    const mapData = (data , dateformat) => {
        data.forEach(function (row) {
            row["id"] = row["bgjId"];
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
			text: 'Backgroud jobs',
			link: '/Backgroundjobs/'
		}
    ];
    
    return (
    <>
            <PageHeader
            heading="Backgroud jobs"
            icon={<Favorite16 />}
            breadCrumb={breadCrumb}
            notification={location?.state?.notification}
            notificationKind={location?.state?.notificationKind} />
                    
        {
            loadingState.isLoading ? <InlineLoading description="Loading..." /> :
			<>	
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
							{console.log({rows})}

                                </TableToolbar>
							{!xdatarows.rows.length ?
								<p className="table-no-data"> No Background job found.</p>
								:
								<><Table key={"background-job-grid-key"} id={"background-job-grid-key"} className="budget-version-table" size="compact" {...getTableProps}>
									<TableHead>
										<TableRow>
											{headers.map((header) => {
												return (
                                                    <TableHeader {...getHeaderProps({ header, onClick: () => {}
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
												{...getRowProps({ row })} key={row.bgjId}>
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

    </>
    )
}
export default Backgroundjob;
