import axios from 'axios';
import getURL from './api/apiList';
import { rows } from '../services/statistics-table.data';
import { getApiResponseWithParams } from "./api/apiCallerGet";
import { convertUTCDateToLocalDateLocalString } from "../helpers/date.helper";
import { makeApiRequest } from './api';


export const GetBudgetVersionCodes = () => {
    return new Promise((resolve) => {
        // axios.get(getURL('BUDGETVERSIONCODES')).then((response) => {
        makeApiRequest('get', getURL('BUDGETVERSIONCODES')).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            console.log('Error occured while getting budget version codes')
            resolve([]);
        });
    })
}

export const SaveBudgetVersion = (budgetVersion) => {
    return new Promise((resolve) => {
        // axios.post(getURL('BUDGETVERSIONS'), budgetVersion).then((response) => { 
        makeApiRequest('post', getURL('BUDGETVERSIONS'), budgetVersion).then((response) => {
            resolve({
                success: response.data.status == 'failed' ? false : true,
                message: response.data.status == 'failed' ? 'Budget version already exists!' : 'Budget version saved.',
                payload: response.data.payload
            })
        }).catch((err) => {
            console.log('Error occured while saving budget version')
            resolve({
                success: false,
                message: 'Budget version already exists!'
            })
        });
    })
}

export const GetBudgetVersion = (budgetVersionId) => {
    return new Promise((resolve) => {
        // axios.get(getURL('BUDGETVERSIONS') + '/' + budgetVersionId).then((response) => {
        makeApiRequest('get', getURL('BUDGETVERSIONS') + '/' + budgetVersionId).then((response) => {
            resolve({
                success: response.status == 200 ? true : false,
                data: response.data
            })
        }).catch((err) => {
            resolve({
                success: false,
            })
        });
    })
}

export const UpdateBudgetVersion = (budgetVersion) => {
    return new Promise((resolve) => {
        // axios.post(getURL('BUDGETVERSIONS'), budgetVersion).then((response) => {
        makeApiRequest('post', getURL('BUDGETVERSIONS'), budgetVersion).then((response) => {
            resolve({
                success: true,
                message: 'Budget version updated.',
                payload: response.data.payload
            })
        }).catch((err) => {
            console.log('Error occured while saving budget version')
            resolve({
                success: false,
                message: 'Budget version already exists!'
            })
        });
    })
}

export const GetScenarioData = (timePeriodId, DataScenarioTypeID, dataScenarioId, userProfileID) => {
    return new Promise((resolve, reject) => {
        // axios.get(`${getURL('STATICALDATA')}/GetADSSourceData?TImePeriodID=${timePeriodId}&DataScenarioTypeID=${DataScenarioTypeID}&DataScenarioID=${dataScenarioId ? dataScenarioId : "" }`).then((response) => {
        let params = `/GetADSSourceData?TImePeriodID=${timePeriodId}&DataScenarioTypeID=${DataScenarioTypeID}&DataScenarioID=${dataScenarioId ? dataScenarioId : ""}`
        if (userProfileID) {
            params = `/GetADSSourceData?TImePeriodID=${timePeriodId}&DataScenarioTypeID=${DataScenarioTypeID}&DataScenarioID=${dataScenarioId ? dataScenarioId : ""}&userid=${userProfileID}`
        }
        makeApiRequest('get', `${getURL('STATICALDATA')}${params}`).then((response) => {
            // makeApiRequest('get', `${getURL('STATICALDATA')}/GetADSSourceData?TImePeriodID=${timePeriodId}&DataScenarioTypeID=${DataScenarioTypeID}&DataScenarioID=${dataScenarioId ? dataScenarioId : ""}&userid=${userProfileID ? 5 : ''}`).then((response) => {
            resolve({
                success: response.status == 200 ? true : false,
                data: response.data
            })
        }).catch(err => {
            reject(err);
        })
    })
}

export const GetBudgetVersionData = (budgetVersionId, scenarioTypeCode) => {
    return new Promise((resolve, reject) => {
        // axios.get(`${scenarioTypeCode == 'ST' ? getURL('BUDGETVERSIONSTATS') : scenarioTypeCode == 'GL' ? getURL('BUDGETVERSIONGL') : getURL('BUDGETVERSIONSTAFF')}/GetBudgetVersionsData?budgetVersionID=${budgetVersionId}`).then((response) => {
        makeApiRequest('get', `${scenarioTypeCode == 'ST' ? getURL('BUDGETVERSIONSTATS') : scenarioTypeCode == 'GL' ? getURL('BUDGETVERSIONGL') : getURL('BUDGETVERSIONSTAFF')}/GetBudgetVersionsData?budgetVersionID=${budgetVersionId}`).then((response) => {
            resolve({
                success: response.status == 200 ? true : false,
                data: response.data
            })
        }).catch(err => {
            reject(err);
        })
    })
}

const GetTimePeriods = () => {
    return new Promise((resolve) => {
        // axios.get(getURL('TIMEPERIODS')).then((response) => {
        makeApiRequest('get', getURL('TIMEPERIODS')).then((response) => {
            resolve({
                success: response.status == 200 ? true : false,
                data: response.data.map(timePeriod => {
                    return {
                        itemTypeID: timePeriod.timePeriodID,
                        itemTypeDisplayName: `${timePeriod?.fiscalStartMonthID?.itemTypeDisplayName} ${timePeriod?.fiscalYearID?.itemTypeDisplayName} to ${timePeriod?.fiscalEndMonthID?.itemTypeDisplayName} ${timePeriod?.fiscalYearEndID?.itemTypeDisplayName}`,
                        itemTypeTimePeriodName: timePeriod.timePeriodName
                    }
                })
            })
        }).catch((err) => {
            resolve({
                success: false,
            })
        });
    })
}

const budgetVersionAPIRequestMapper = (list, dataScenarioId) => {
    return list.map(row => {
        return {
            ...row,
            entity: { entityid: row.entityid },
            department: { departmentid: row.departmentid },
            statisticscodes: { statisticscodeid: row.statisticsid },
            GLAccount: { glaccountid: row.glaccountid },
            timeperiodid: { timeperiodid: row.timeperiodid },
            datascenariotypeid: { itemtypeID: row.scenariotypeID },
            datascenarioid: { dataScenarioId: dataScenarioId },
            budgetversion: { budgetversionid: row.budgetVersionId },
            staffingdatatype: { itemtypeID: row.staffingdatatype ? row.staffingdatatype : row.staffingaccounttypeid },
            staffingaccounttypeid: { itemtypeID: row.staffingdatatype ? row.staffingdatatype : row.staffingaccounttypeid },
            isactive: true,
            isdeleted: false
        }
    })
}

export const saveActualBudgetVersionData = (budgetVersionID) => {
    return makeApiRequest('get', getURL('SAVEACTUALBUDGETVERSIONDATA'), { params: { BudgetVersionID: budgetVersionID } });
}

export const saveBudgetVersionData = (list, scenarioTypeCode, dataScenarioId) => {
    if (!list.length) Promise.resolve();
    var request = budgetVersionAPIRequestMapper(list, dataScenarioId);
    // return axios.post(`${scenarioTypeCode == 'ST' ? getURL('BUDGETVERSIONSTATS') : scenarioTypeCode == 'GL' ? getURL('BUDGETVERSIONGL') : getURL('BUDGETVERSIONSTAFF')}`, request);
    return makeApiRequest('post', `${scenarioTypeCode == 'ST' ? getURL('BUDGETVERSIONSTATS') : scenarioTypeCode == 'GL' ? getURL('BUDGETVERSIONGL') : getURL('BUDGETVERSIONSTAFF')}`, request);

}

export const updateBudgetVersionData = (list, scenarioTypeCode, deleteStaffingDataTypeKey = false) => {
    if (deleteStaffingDataTypeKey && scenarioTypeCode === 'SF') delete list[0].staffingdatatype
    // return axios.put(`${scenarioTypeCode == 'ST' ? getURL('BUDGETVERSIONSTATS') : scenarioTypeCode == 'GL' ? getURL('BUDGETVERSIONGL') : getURL('BUDGETVERSIONSTAFF')}`, list);
    return makeApiRequest('put', `${scenarioTypeCode == 'ST' ? getURL('BUDGETVERSIONSTATS') : scenarioTypeCode == 'GL' ? getURL('BUDGETVERSIONGL') : getURL('BUDGETVERSIONSTAFF')}`, list);
}

export const deleteBudgetVersionData = (ids, scenarioTypeCode) => {
    // return axios.put(`${scenarioTypeCode == 'ST' ? getURL('BUDGETVERSIONSTATS') : scenarioTypeCode == 'GL' ? getURL('BUDGETVERSIONGL') : getURL('BUDGETVERSIONSTAFF')}/Delete`, ids);
    return makeApiRequest('put', `${scenarioTypeCode == 'ST' ? getURL('BUDGETVERSIONSTATS') : scenarioTypeCode == 'GL' ? getURL('BUDGETVERSIONGL') : getURL('BUDGETVERSIONSTAFF')}/Delete`, ids);
}

export const GetInitalData = (budgetVersionId) => {
    var requests = [
        GetTimePeriods(),
        // axios.get(getURL('BUDGETVERSIONTYPE')),
        makeApiRequest('get', getURL('BUDGETVERSIONTYPE')),
        // axios.get(getURL('SCENARIOTYPE')),
        makeApiRequest('get', getURL('SCENARIOTYPE')),
        GetDropdownData()];
    if (budgetVersionId) requests.push(GetBudgetVersion(budgetVersionId));
    requests.push(GetBudgetVersionCodes());
    return Promise.all(requests);
}

export const GetAllDimensionsRelationshipData = () => {
    var requests = [
        makeApiRequest('get', getURL('ENTITYRELATIONSHIPS')),
        makeApiRequest('get', getURL('STATISTICSRELATIONSHIPS')),
        makeApiRequest('get', getURL('DEPARTMENTSRELATIONSHIPS')),
        makeApiRequest('get', getURL('GLACCOUNTSRELATIONSHIPS')),
        makeApiRequest('get', getURL('JOBCODERELATIONSHIPS')),
        makeApiRequest('get', getURL('PAYTYPESRELATIONSHIPS')),
    ];
    return Promise.all(requests);
}
const DropdownDataMappingFunction = item => {
    return {
        itemTypeID: item.dataScenarioID,
        itemTypeDisplayName: item.dataScenarioName,
        itemTypeCode: item.dataScenarioCode,
        itemTypeName: item.dataScenarioName,
        scenarioTypeId: item.scenarioType.itemTypeID
    }
}

const GetDropdownData = () => {
    return new Promise((resolve) => {
        // axios.get(getURL('DATASCENARIOS')).then(res => {
        makeApiRequest('get', getURL('DATASCENARIOS')).then(res => {
            var data = {};
            data.staffing = res.data.filter(item => item.scenarioType?.itemTypeValue == "Staffing").map(DropdownDataMappingFunction);
            data.statistics = res.data.filter(item => item.scenarioType?.itemTypeValue == "Statistic").map(DropdownDataMappingFunction);
            data.gl = res.data.filter(item => item.scenarioType?.itemTypeValue == "General Ledger").map(DropdownDataMappingFunction);
            resolve(data);
        })
    })
}

export const GetBudgetVersionPageData = async (params) => {
    const apireq = await getApiResponseWithParams('GETBUDGETVERSIONPAGE', params);
    return apireq;
};

//parsing data that is retrieved in a different format from GetBudgetVersionPage API
export const GetBudgetVersionPageDataRows = function (data, dateformat, user) {
    const rows = Array.isArray(data) ? JSON.parse(JSON.stringify(data)) : Object.values(JSON.parse(data));
    rows.forEach(function (row) {
        row["id"] = row["BudgetVersionsID"];
        row["updateddate"] = convertUTCDateToLocalDateLocalString(
            row["updateddate"] + "",
            dateformat, true
        );
        row["userProfileId"] = user;
    });
    return rows;
}

//parsing data that comes from budget version data stored in state
export const InitializeBudgetVersionDataRows = function (data, dateformat, user) {
    const rows = Object.values(JSON.parse(JSON.stringify(data)));
    rows.forEach(function (row) {
        row["id"] = row["budgetVersionsID"];
        row["updateddate"] = convertUTCDateToLocalDateLocalString(
            row["updateddate"] + "",
            dateformat, true
        );
        row["userProfile"] = user;
    });

    return rows;
};

export const StartBudgetVersionCalculation = (budgetVersionID) => {
    return new Promise((resolve, reject) => {
        // axios.get(getURL('CALCULATE') , {params : {budgetVersionID  : budgetVersionID}} ).then((response) => {
        makeApiRequest('get', getURL('CALCULATE'), { params: { budgetVersionID: budgetVersionID } }).then((response) => {
            resolve({ response: response })
        }).catch(err => {
            reject(err);
        })
    })
}

export const createSubAccounts = (data) => {
    return new Promise((resolve, reject) => {
        makeApiRequest('post', getURL('CREATESUBACCOUNTS'), { ...data }).then((response) => {
            resolve({ response: response })
        }).catch(err => {
            reject(err);
        })
    })
}

export const updateSubAccounts = (data) => {
    return new Promise((resolve, reject) => {
        makeApiRequest('put', `${getURL('UPDATESUBACCOUNTS')}?BVRowid=${data?.bvRowId}`, { ...data }).then((response) => {
            resolve({ response: response })
        }).catch(err => {
            reject(err);
        })
    })
}
export const getSubAccounts = (data) => {
    return new Promise((resolve, reject) => {
        makeApiRequest('get', getURL('GETSUBACCOUNTS'), { params: { ...data } }).then((response) => {
            if (response.status === 200) resolve({
                data: response?.data ? response?.data.map(data => ({ ...data, id: Math.floor(Math.random() * 1000), accName: data.subAccName, total: data.rowTotal, islock: data.islock === "true" ? true : false, isParent: data.isParent === "true" ? true : false, isSubAccount: data.isSubAccount === "true" ? true : false, isReconcile: data.isReconcile === "true" ? true : false }))
                    : []
            })
            else reject("Something went wrong");
        }).catch(err => {
            reject(err);
        })
    })
}

