const js = {
 actionType: "ADD",
 code: "code",
 description: "desc",
 comments: "comments",
 name: "name",
 value: "value",
 reportProcessingStatus: "Processing",
 reportDetails: "",
 reportData: "",
 path: "path",
 relatedPath: "relatedpath",
 reportPath: "reportPath",
 reportStatus: "PROCESSING",
 scenarioType: "ST",
 jsonConfig: {
  budgetVersion: {
   ids: [1, 2, 3, 4],
   display: "reportHeader",
  },
  entity: {
   ids: [1, 2, 3, 4],
   display: "row",
  },
  department: {
   ids: [1, 2, 3, 4],
   display: "column",
  },
  statistics: {
   ids: [1, 2, 3, 4],
   display: "row",
  },
  periods: {
   selections: {
    monthsFYTotal: false,
    month: true,
    currentMonth: false,
    currentFYTD: false,
    quartersFYTotal: false,
    quarter: true,
    currentQuarter: false,
    currentQuarterFYTD: false,
    FYTotal: false,
   },
   childSelection: {
    month: ['jan' , 'oct' , 'aug'], // will send only selected months
    quarter: ['1' , '2' , '3' , '4'], // will send only selected quarter
   },
   display: "row",
  },
  measures: {
   selections: {
       amount : true,
       volumeRate : false
   },
   display: "column",
  },
 },
 userProfileID: 0,
};

// possible values of 'display' = "reportHeader" , "row" , "column"



const run = [{id : 1 , type : 'pdf'} , {id : 2, type : 'pdf'}]


const runs = {
    id : [1,2,4],
    file: "pdf"
}