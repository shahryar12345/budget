
// All 3 Groupes are available
export const filterStatisticsDataByGroup = (GroupsFilters , data) => {
    let result = [];
		GroupsFilters.Entites.forEach((entity) => {
			GroupsFilters.Departments.forEach((dept) => {				
				GroupsFilters.Statistics.forEach((stats) => {					
					// Enity type child grouped Rows. Entity show as member but deprtment and other dimension show as group.
					let entitychildRows = [];
					entity.childRows.forEach((childEntity) => {
						if(!entitychildRows.find((entityItem) => {return entityItem.entity.id === childEntity.actualID}))
						{
							entitychildRows.push(
								{
									entity: {
										id: childEntity.actualID,
										name: childEntity.name,
										code: childEntity.code,
										rowAdded: entity["rowAdded"]
									},	
									department: {
										id: dept.actualID,
										name: dept.name,
										code: dept.code,
										rowAdded: dept["rowAdded"]
									},
									...getEmptyMonth(),
									dataid: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
									uniqueCombinationKey: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
									rowAdded: false,
									colType: 'department',
									fteTotal:  0,
									rowTotal:  0,
									details : {
										id: stats.actualID,
										name: stats.name,
										code: stats.code,
										rowId: entity.entityid+"-"+dept.departmentid+"-Groups-Row"
									},
									nonGroupsInRow : ["entity"]
								})
						}
					});

					// Now add department type child grouped row in each enity row. Entity and Department show as member but not other dimentsion (Statistics).
					entitychildRows.forEach((entityChildRow) =>{
						let deptChildRows = [];
						getChildMemebers(dept).forEach((childDept) => {
							if(!deptChildRows.find((deptItem) => {return deptItem.department.id == childDept.actualID}))
							{
								deptChildRows.push(
									{
										entity: {
											id: entityChildRow.entity.id,
											name: entityChildRow.entity.name,
											code: entityChildRow.entity.code,
											rowAdded: entity["rowAdded"]
										},	
										department: {
											id: childDept.actualID,
											name: childDept.name,
											code: childDept.code,
											rowAdded: dept["rowAdded"]
										},
										...getEmptyMonth(),
										dataid: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
										uniqueCombinationKey: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
										rowAdded: false,
										colType: 'details',
										fteTotal:  0,
										rowTotal:  0,
										details : {
											id: entityChildRow.details.id,
											name: entityChildRow.details.name,
											code: entityChildRow.details.code,
											rowId: entity.entityid+"-"+dept.departmentid+"-Groups-Row"
										},
										nonGroupsInRow : ["entity" , "department"]
									});							
							}
						});
						if(deptChildRows.length > 0)
						{
							// Now add statistics child grouped Row in each department row. In child row all dimensions will show as a member with the months values;	
							let removedRows = [];
							deptChildRows.forEach((deptChildRow , deptChildRowIndex) => {
								let stateChildRows = [];
								stats.childRows.forEach((childState) => {

									let dataRowFound = data.find((dataRow) => { return deptChildRow.entity.id === dataRow.entityid 
										&& deptChildRow.department.id === dataRow.departmentid 
										&& childState.actualID === dataRow.statisticsid})
									if(dataRowFound)
									{
										stateChildRows.push(
											{
												entity: {
													id: deptChildRow.entity.id,
													name: deptChildRow.entity.name,
													code: deptChildRow.entity.code,
													rowAdded: entity["rowAdded"]
												},	
												department: {
													id: deptChildRow.department.id,
													name: deptChildRow.department.name,
													code: deptChildRow.department.code,
													rowAdded: dept["rowAdded"]
												},
												january: dataRowFound.january,
												february: dataRowFound.february,
												march: dataRowFound.march,
												april: dataRowFound.april,
												may: dataRowFound.may,
												june: dataRowFound.june,
												july: dataRowFound.july,
												august: dataRowFound.august,
												september: dataRowFound.september,
												october: dataRowFound.october,
												november: dataRowFound.november,
												december: dataRowFound.december,
												dataid: dataRowFound?.dataid,
												uniqueCombinationKey: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
												rowAdded: false,
												colType: 'details',
												fteTotal:  0,
												rowTotal:  0,
												details : {
													id: childState.actualID,
													name: childState.name,
													code: childState.code,
													rowId: dataRowFound?.dataid
												},
												nonGroupsInRow : ["entity" , "department" , "details"]
											}
										)
									}						
								});
								if(stateChildRows.length > 0)
								{
									deptChildRow.childRows = [...stateChildRows];
								}else
								{
									removedRows.push(deptChildRow.department.id);
								}
							});
							// Remove parent row if thier is no combination available in childs.
							
							removedRows.forEach((removeRowId) => {
								deptChildRows = deptChildRows.filter((deptRemove) => {return deptRemove.department.id !== removeRowId});
							});
							entityChildRow.childRows = [...deptChildRows];
						}
					})

					// Top parent Grouped Row. All Show as a group
					if(entitychildRows.length > 0)
					{
						result.push({
							childRows : [...entitychildRows],
							entity: {
								id: entity.id,
								name: entity.name,
								code: entity.code,
								rowAdded: entity["rowAdded"]
							},	
							department: {
								id: dept.id,
								name: dept.name,
								code: dept.code,
								rowAdded: dept["rowAdded"]
							},
							...getEmptyMonth(),
							dataid: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
							uniqueCombinationKey: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
							rowAdded: false,
							colType: 'entity',
							fteTotal:  0,
							rowTotal:  0,
							details : {
								id: stats.id,
								name: stats.name,
								code: stats.code,
								rowId: stats?.dataid
							},
							nonGroupsInRow : []
						});
					}

				}); // Statistics selected Groups loop 
			}); // Department selected Groups loop 						
		}); // Entity Selectec Groups loop

		return result;
}

export const filterGLAccountDataByGroup = (GroupsFilters , data) => 
{
    let result = [];
    GroupsFilters.Entites.forEach((entity) => {
        GroupsFilters.Departments.forEach((dept) => {
            // GroupsFilters.Statistics 'Statistics' name is used in redux store, act like a detail row (Gl Account) here. 				
            GroupsFilters.Statistics.forEach((glAcccount) => {					
                // Enity type child grouped Rows. Entity show as member but deprtment and other dimension show as group.
                let entitychildRows = [];
                entity.childRows.forEach((childEntity) => {
                    if(!entitychildRows.find((entityItem) => {return entityItem.entity.id === childEntity.actualID}))
                    {
                        entitychildRows.push(
                            {
                                entity: {
                                    id: childEntity.actualID,
                                    name: childEntity.name,
                                    code: childEntity.code,
                                    rowAdded: entity["rowAdded"]
                                },	
                                department: {
                                    id: dept.actualID,
                                    name: dept.name,
                                    code: dept.code,
                                    rowAdded: dept["rowAdded"]
                                },
                                ...getEmptyMonth(),
                                dataid: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                                uniqueCombinationKey: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                                rowAdded: false,
                                colType: 'department',
                                fteTotal:  0,
                                rowTotal:  0,
                                details : {
                                    id: glAcccount.actualID,
                                    name: glAcccount.name,
                                    code: glAcccount.code,
                                    rowId: entity.entityid+"-"+dept.departmentid+"-Groups-Row"
                                },
                                nonGroupsInRow : ["entity"]
                            })
                    }
                });

                // Now add department type child grouped row in each enity row. Entity and Department show as member but not other dimentsion (Statistics).
                entitychildRows.forEach((entityChildRow) =>{
                    let deptChildRows = [];
                    getChildMemebers(dept).forEach((childDept) => {
                        if(!deptChildRows.find((deptItem) => {return deptItem.department.id == childDept.actualID}))
                        {
                            deptChildRows.push(
                                {
                                    entity: {
                                        id: entityChildRow.entity.id,
                                        name: entityChildRow.entity.name,
                                        code: entityChildRow.entity.code,
                                        rowAdded: entity["rowAdded"]
                                    },	
                                    department: {
                                        id: childDept.actualID,
                                        name: childDept.name,
                                        code: childDept.code,
                                        rowAdded: dept["rowAdded"]
                                    },
                                    ...getEmptyMonth(),
                                    dataid: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                                    uniqueCombinationKey: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                                    rowAdded: false,
                                    colType: 'details',
                                    fteTotal:  0,
                                    rowTotal:  0,
                                    details : {
                                        id: entityChildRow.details.id,
                                        name: entityChildRow.details.name,
                                        code: entityChildRow.details.code,
                                        rowId: entity.entityid+"-"+dept.departmentid+"-Groups-Row"
                                    },
                                    nonGroupsInRow : ["entity" , "department"]
                                });							
                        }
                    });
                    if(deptChildRows.length > 0)
                    {
                        // Now add statistics child grouped Row in each department row. In child row all dimensions will show as a member with the months values;	
                        let removedRows = [];
                        deptChildRows.forEach((deptChildRow , deptChildRowIndex) => {
                            let stateChildRows = [];
                            getChildMemebers(glAcccount).forEach((childState) => {   
                                let dataRowFound = data.find((dataRow) => { return deptChildRow.entity.id === dataRow.entityid 
                                    && deptChildRow.department.id === dataRow.departmentid 
                                    && childState.actualID === dataRow.glaccountid})
                                if(dataRowFound)
                                {
                                    stateChildRows.push(
                                        {
                                            entity: {
                                                id: deptChildRow.entity.id,
                                                name: deptChildRow.entity.name,
                                                code: deptChildRow.entity.code,
                                                rowAdded: entity["rowAdded"]
                                            },	
                                            department: {
                                                id: deptChildRow.department.id,
                                                name: deptChildRow.department.name,
                                                code: deptChildRow.department.code,
                                                rowAdded: dept["rowAdded"]
                                            },
                                            january: dataRowFound.january,
                                            february: dataRowFound.february,
                                            march: dataRowFound.march,
                                            april: dataRowFound.april,
                                            may: dataRowFound.may,
                                            june: dataRowFound.june,
                                            july: dataRowFound.july,
                                            august: dataRowFound.august,
                                            september: dataRowFound.september,
                                            october: dataRowFound.october,
                                            november: dataRowFound.november,
                                            december: dataRowFound.december,
                                            dataid: dataRowFound?.dataid,
                                            uniqueCombinationKey: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                                            rowAdded: false,
                                            colType: 'details',
                                            fteTotal:  0,
                                            rowTotal:  0,
                                            details : {
                                                id: childState.actualID,
                                                name: childState.name,
                                                code: childState.code,
                                                rowId: dataRowFound?.dataid
                                            },
                                            nonGroupsInRow : ["entity" , "department" , "details"]
                                        }
                                    )
                                }						
                            });
                            if(stateChildRows.length > 0)
                            {
                                deptChildRow.childRows = [...stateChildRows];
                            }else
                            {
                                removedRows.push(deptChildRow.department.id);
                            }
                        });
                        // Remove parent row if thier is no combination available in childs.                     
                        removedRows.forEach((removeRowId) => {
                            deptChildRows = deptChildRows.filter((deptRemove) => {return deptRemove.department.id !== removeRowId});
                        });
                        entityChildRow.childRows = [...deptChildRows];
                    }
                })

                // Top parent Grouped Row. All Show as a group
                if(entitychildRows.length > 0)
                {
                    result.push({
                        childRows : [...entitychildRows],
                        entity: {
                            id: entity.id,
                            name: entity.name,
                            code: entity.code,
                            rowAdded: entity["rowAdded"]
                        },	
                        department: {
                            id: dept.id,
                            name: dept.name,
                            code: dept.code,
                            rowAdded: dept["rowAdded"]
                        },
                        ...getEmptyMonth(),
                        dataid: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                        uniqueCombinationKey: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                        rowAdded: false,
                        colType: 'entity',
                        fteTotal:  0,
                        rowTotal:  0,
                        details : {
                            id: glAcccount.id,
                            name: glAcccount.name,
                            code: glAcccount.code,
                            rowId: glAcccount?.dataid
                        },
                        nonGroupsInRow : []
                    });
                }

            }); // Statistics selected Groups loop 
        }); // Department selected Groups loop 						
    }); // Entity Selectec Groups loop

    return result;
}

export const filterStaffingDataByGroup = (GroupsFilters , data) =>
{
    let result = [];
    GroupsFilters.Entites.forEach((entity) => {
        GroupsFilters.Departments.forEach((dept) => {
            GroupsFilters.JobCodes.forEach((jobCode) => {
                    // GroupsFilters.Statistics 'Statistics' name is used in redux store, act like a detail row (Gl Account) here. 				
                    GroupsFilters.Statistics.forEach((payType) => {					
                        // Enity type child grouped Rows. Entity show as member but deprtment and other dimension show as group.
                        let entitychildRows = [];
                        entity.childRows.forEach((childEntity) => {
                            if(!entitychildRows.find((entityItem) => {return entityItem.entity.id === childEntity.actualID}))
                            {
                                entitychildRows.push(
                                    {
                                        entity: {
                                            id: childEntity.actualID,
                                            name: childEntity.name,
                                            code: childEntity.code,
                                            rowAdded: entity["rowAdded"]
                                        },	
                                        department: {
                                            id: dept.actualID,
                                            name: dept.name,
                                            code: dept.code,
                                            rowAdded: dept["rowAdded"]
                                        },
                                        jobCode : {
                                            id: jobCode.actualID,
                                            name: jobCode.name,
                                            code: jobCode.code,
                                            rowAdded: jobCode["rowAdded"]
                                        },
                                        ...getEmptyMonth(),
                                        dataid: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                                        uniqueCombinationKey: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                                        rowAdded: false,
                                        colType: 'department',
                                        fteTotal:  0,
                                        rowTotal:  0,
                                        details : {
                                            id: payType.actualID,
                                            name: payType.name,
                                            code: payType.code,
                                            rowId: entity.entityid+"-"+dept.departmentid+"-Groups-Row"
                                        },
                                        nonGroupsInRow : ["entity"]
                                    })
                            }
                        });

                        // Now add department type child grouped row in each enity row. Entity and Department show as member but not other dimentsion (Statistics).
                        entitychildRows.forEach((entityChildRow) =>{
                            let deptChildRows = [];
                            getChildMemebers(dept).forEach((childDept) => {
                                if(!deptChildRows.find((deptItem) => {return deptItem.department.id == childDept.actualID}))
                                {
                                    deptChildRows.push(
                                        {
                                            entity: {
                                                id: entityChildRow.entity.id,
                                                name: entityChildRow.entity.name,
                                                code: entityChildRow.entity.code,
                                                rowAdded: entity["rowAdded"]
                                            },	
                                            department: {
                                                id: childDept.actualID,
                                                name: childDept.name,
                                                code: childDept.code,
                                                rowAdded: dept["rowAdded"]
                                            },
                                            jobCode:{
                                                id: entityChildRow.jobCode.id,
                                                name: entityChildRow.jobCode.name,
                                                code: entityChildRow.jobCode.code,
                                                rowAdded: jobCode["rowAdded"]
                                            },
                                            ...getEmptyMonth(),
                                            dataid: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                                            uniqueCombinationKey: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                                            rowAdded: false,
                                            colType: 'jobCode',
                                            fteTotal:  0,
                                            rowTotal:  0,
                                            details : {
                                                id: entityChildRow.details.id,
                                                name: entityChildRow.details.name,
                                                code: entityChildRow.details.code,
                                                rowId: entity.entityid+"-"+dept.departmentid+"-Groups-Row"
                                            },
                                            nonGroupsInRow : ["entity" , "department"]
                                        });							
                                }
                            });


                            if(deptChildRows.length > 0)
                            {
                                // Now add statistics child grouped Row in each department row. In child row all dimensions will show as a member with the months values;	
                                let removedRows = [];
                                deptChildRows.forEach((deptChildRow , deptChildRowIndex) => {
                                    let jobCodeChildRows = [];
                                    jobCode.childRows.forEach((childJobcode) => {   
                                        jobCodeChildRows.push({
                                                entity: {
                                                    id: deptChildRow.entity.id,
                                                    name: deptChildRow.entity.name,
                                                    code: deptChildRow.entity.code,
                                                    rowAdded: entity["rowAdded"]
                                                },	
                                                department: {
                                                    id: deptChildRow.department.id,
                                                    name: deptChildRow.department.name,
                                                    code: deptChildRow.department.code,
                                                    rowAdded: dept["rowAdded"]
                                                },
                                                jobCode : {
                                                    id: childJobcode.actualID,
                                                    name: childJobcode.name,
                                                    code: childJobcode.code,
                                                    rowAdded: entity["rowAdded"]
                                                },
                                                ...getEmptyMonth(),
                                                dataid: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                                                uniqueCombinationKey: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                                                rowAdded: false,
                                                colType: 'details',
                                                fteTotal:  0,
                                                rowTotal:  0,
                                                details : {
                                                    id: deptChildRow.details.id,
                                                    name: deptChildRow.details.name,
                                                    code: deptChildRow.details.code,
                                                    rowId: entity.entityid+"-"+dept.departmentid+"-Groups-Row"
                                                },
                                                nonGroupsInRow : ["entity" , "department" , "jobCode"]
                                            });

                                        if(jobCodeChildRows.length > 0)
                                        {
                                            
                                             jobCodeChildRows.forEach((jobcodeChildRow) => {
                                                let payTypeChildRows = [];

                                                payType.childRows.forEach((childPayType) => {
                                                    let dataRowFound = data.find((dataRow) => { return jobcodeChildRow.entity.id === dataRow.entityid 
                                                        && jobcodeChildRow.department.id === dataRow.departmentid 
                                                        && jobcodeChildRow.jobCode.id === dataRow.jobcodeid
                                                        && childPayType.actualID === dataRow.paytypeid})
                                                    if(dataRowFound)
                                                    {
                                                        payTypeChildRows.push(
                                                            {
                                                                entity: {
                                                                    id: jobcodeChildRow.entity.id,
                                                                    name: jobcodeChildRow.entity.name,
                                                                    code: jobcodeChildRow.entity.code,
                                                                    rowAdded: entity["rowAdded"]
                                                                },	
                                                                department: {
                                                                    id: jobcodeChildRow.department.id,
                                                                    name: jobcodeChildRow.department.name,
                                                                    code: jobcodeChildRow.department.code,
                                                                    rowAdded: dept["rowAdded"]
                                                                },
                                                                jobCode: {
                                                                    id: jobcodeChildRow.jobCode.id,
                                                                    name: jobcodeChildRow.jobCode.name,
                                                                    code: jobcodeChildRow.jobCode.code,
                                                                    rowAdded: dept["rowAdded"]
                                                                },
                                                                january: dataRowFound.january,
                                                                february: dataRowFound.february,
                                                                march: dataRowFound.march,
                                                                april: dataRowFound.april,
                                                                may: dataRowFound.may,
                                                                june: dataRowFound.june,
                                                                july: dataRowFound.july,
                                                                august: dataRowFound.august,
                                                                september: dataRowFound.september,
                                                                october: dataRowFound.october,
                                                                november: dataRowFound.november,
                                                                december: dataRowFound.december,
                                                                dataid: dataRowFound?.dataid,
                                                                uniqueCombinationKey: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                                                                rowAdded: false,
                                                                colType: 'details',
                                                                fteTotal:  0,
                                                                rowTotal:  0,
                                                                details : {
                                                                    id: childPayType.actualID,
                                                                    name: childPayType.name,
                                                                    code: childPayType.code,
                                                                    rowId: dataRowFound?.dataid
                                                                },
                                                                nonGroupsInRow : ["entity" , "department" , "jobCode", "details"]
                                                            }
                                                        )
                                                    }
                                                });

                                                if(payTypeChildRows.length > 0)
                                                {
                                                    jobcodeChildRow.childRows = [...payTypeChildRows];
                                                }

                                            });
                                        }               
                                    });
                                    if(jobCodeChildRows.length > 0)
                                    {
                                        deptChildRow.childRows = [...jobCodeChildRows];
                                    }else
                                    {
                                        removedRows.push(deptChildRow.department.id);
                                    }
                                });
                                // Remove parent row if thier is no combination available in childs.                     
                                removedRows.forEach((removeRowId) => {
                                    deptChildRows = deptChildRows.filter((deptRemove) => {return deptRemove.department.id !== removeRowId});
                                });
                                entityChildRow.childRows = [...deptChildRows];
                            }
                        })

                        // Top parent Grouped Row. All Show as a group
                        if(entitychildRows.length > 0)
                        {
                            result.push({
                                childRows : [...entitychildRows],
                                entity: {
                                    id: entity.id,
                                    name: entity.name,
                                    code: entity.code,
                                    rowAdded: entity["rowAdded"]
                                },	
                                department: {
                                    id: dept.id,
                                    name: dept.name,
                                    code: dept.code,
                                    rowAdded: dept["rowAdded"]
                                },
                                jobCode: {
                                    id: jobCode.id,
                                    name: jobCode.name,
                                    code: jobCode.code,
                                    rowAdded: jobCode["rowAdded"]
                                },
                                ...getEmptyMonth(),
                                dataid: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                                uniqueCombinationKey: entity.entityid+"-"+dept.departmentid+"-Groups-Row",
                                rowAdded: false,
                                colType: 'entity',
                                fteTotal:  0,
                                rowTotal:  0,
                                details : {
                                    id: payType.id,
                                    name: payType.name,
                                    code: payType.code,
                                    rowId: payType?.dataid
                                },
                                nonGroupsInRow : []
                            });
                        }

                    }); // Statistics selected Groups loop 

            });
            
            
            
            
           


        }); // Department selected Groups loop 						
    }); // Entity Selectec Groups loop

    return result;
}

const getEmptyMonth = () => {
    return {
        january: 0,
        february: 0,
        march: 0,
        april: 0,
        may: 0,
        june: 0,
        july: 0,
        august: 0,
        september: 0,
        october: 0,
        november: 0,
        december: 0,
    }
}

const getChildMemebers = (row , result = []) =>
	{
		if(row.childRows)
		{
			row.childRows.forEach((item) => 
			{
				getChildMemebers(item , result);
			})
		}else
		{
			result.push(row);
		}
		return result;
	}




// april: 61.44
// august: 61.44
// dataid: 19171
// datascenariocode: null
// datascenarioid: 9142
// datascenarioname: null
// december: 61.44
// departmentcode: "C7840ABCDEFGHIJK"
// departmentid: 251
// departmentname: "7840 PSYCH/INDIVIDUAL THERAP"
// dimensionsrow: {dimensionsID: 1, budgetVersion: null, entity: null, department: null, statisticsCode: null, …}
// endmonth: "JUN"
// endmonthid: 12
// endyear: "2019"
// endyearid: 52
// entitycode: "840"
// entityid: 4
// entityname: "CAPW HEALTH OPTIONS"
// february: 61.44
// january: 61.44
// jobcodecode: "222"
// jobcodeid: 1
// jobcodename: "QAMASTER 222"
// july: 61.44
// june: 61.44
// march: 61.44
// may: 61.44
// november: 61.44
// october: 61.44
// paytypecode: "P6_M"
// paytypeid: 6
// paytypename: "PayType5_M"
// rowtotal: 737.28
// scenariotype: "Staffing"
// scenariotypeID: 30
// september: 61.44
// staffingdatatype: "Hours"
// staffingdatatypeID: 108
// startmonth: "JUL"
// startmonthid: 13
// startyear: "2018"
// startyearid: 51
// wagerateoverride: 737.28
