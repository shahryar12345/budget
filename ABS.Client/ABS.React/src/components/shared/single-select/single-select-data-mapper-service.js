const idReplacement = ['entityID', 'departmentID', 'statisticsCodeID' , 'glAccountID' , 'jobCodeID' , 'payTypeID' ]
const codeReplacement = ['entityCode', 'departmentCode', 'statisticsCode' , 'glAccountCode' , 'jobCodeCode' , 'payTypeCode']
const nameReplacement = ['entityName', 'departmentName', 'statisticsCodeName' , 'glAccountName' , 'jobCodeName' , 'payTypeName']
const childRowsReplacement = ['childEntities', 'groupDepartments', 'childDepartments', 'childStatistic' , 'groupGLAccounts', 'childGLAccounts' , 'childJobCodes' , 'childPayTypes']


export const getMappedRow = (row, headerName) => {
    mapData(row, headerName);
    if (row.childRows?.length)
        row.childRows.forEach(childRow => {
            getMappedRow(childRow, headerName);
        });
}


const mapData = (row, headerName) => {
    row.id = row[Object.keys(row).find(key => idReplacement.includes(key))];
    row.childRows = row[Object.keys(row).find(key => childRowsReplacement.includes(key))];
    row[headerName] = {
        code: row[Object.keys(row).find(key => codeReplacement.includes(key))],
        name: row[Object.keys(row).find(key => nameReplacement.includes(key))]
    }
}
