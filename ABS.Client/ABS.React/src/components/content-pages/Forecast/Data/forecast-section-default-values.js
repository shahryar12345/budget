export const defaultforecastSection = {
  forecastType: "notSelected", // copy ,annualization
  included: true,
  automaticallyUpdate : false,
  source: {
    // annualize and copy  can use this same property (source), // Single forecast Method can have multiple source DataRow.
    dataRow: [
      {
        budgetversion_code: "notSelected", // id
        startMonth: "notSelected", // id
        endMonth: "notSelected", // id
      },
    ],
    dimensionRow: {
      entity: "",
      department: "",
      statistic: "",
      generalLedger: "",
      jobCode : "",
      payType : "",
      productivePayTypeGroup : "",
      nonProductivePayTypeGroup : "",
      excludedPayType : [],
      entitiesGroup: false,
      departmentsGroup: false,
      statisticsGroup: false,
      generalLedgerGroup: false,
      jobCodeGroup: false,
      payTypeGroup: false,
    },
  },
  target: {
    // annualize and copy can use this same property (taget), // Single forecast Method can have multiple source DataRow.
    dimensionRow: {
      entity: "",
      department: "",
      statistic: "",
      generalLedger : "",
      jobCode : "",
      payType : "",
    },
    dataRow: [
      {
        includeStartMonth: "notSelected",
        includeEndMonth: "notSelected",
        maintainSeasonality: false,
      },
    ], // In Case of Copy this object is empty , but in Annulialize , their will be a data in this object (AS per the UI Wireframe)
  },
  percentChange: 0,
  spreadMethod: "0", // SpreadMethodId
  sectionValidation: {
    sectionValid: true,
    budgetversion: [
      {
        invalid: false,
        invalidText: "",
      },
    ],
    startMonth: [
      {
        invalid: false,
        invalidText: "",
      },
    ],
    endMonth: [
      {
        invalid: false,
        invalidText: "",
      },
    ],
    entitySource: {
      invalid: false,
      invalidText: "",
    },
    departmentSource: {
      invalid: false,
      invalidText: "",
    },
    statisticSource: {
      invalid: false,
      invalidText: "",
    },
    generalLedgerSource: {
      invalid: false,
      invalidText: "",
    },
    jobCodeSource : {
      invalid: false,
      invalidText: "",
    },
    payTypeSource : {
      invalid: false,
      invalidText: "",
    },
    productivePayTypeGroupSource:{
      invalid: false,
      invalidText: "",
    },
    nonProductivePayTypeGroupSource:{
      invalid: false,
      invalidText: "",
    },
    entityTarget: {
      invalid: false,
      invalidText: "",
    },
    departmentTarget: {
      invalid: false,
      invalidText: "",
    },
    statisticTarget: {
      invalid: false,
      invalidText: "",
    },
    generalLedgerTarget: {
      invalid: false,
      invalidText: "",
    },
    jobCodeTarget : {
      invalid: false,
      invalidText: "",
    },
    payTypeTarget : {
      invalid: false,
      invalidText: "",
    },
  },
  expanded: true,
};

export const defaultforecastSectionForRatioType = {
  forecastType: "notSelected",
  included: true,
  automaticallyUpdate : false,
  source: {
    // annualize and copy  can use this same property (source), // Single forecast Method can have multiple source DataRow.
    dataRow: [
      {
        budgetversion_code: "notSelected", // id
      },
    ],
    dimensionRow: {
      numerator: { entity: "", department: "", statistic: "" , generalLedger : "" , jobCode : "", payType : "" },
      denominator: { entity: "", department: "", statistic: ""  , generalLedger : "" , jobCode : "", payType : "" },
      entitiesGroup: false,
      departmentsGroup: false,
      statisticsGroup: false,
      generalLedgerGroup : false,
      jobCodeGroup: false,
      payTypeGroup: false,
    },
  },
  target: {
    // annualize and copy can use this same property (taget), // Single forecast Method can have multiple source DataRow.
    dimensionRow: {
      numerator: { entity: "", department: "", statistic: "", generalLedger: ""  , jobCode : "", payType : "" },
      denominator: { entity: "", department: "", statistic: "", generalLedger: "" , jobCode : "", payType : "" },
      entitiesGroup: false,
      departmentsGroup: false,
      statisticsGroup: false,
      generalLedgerGroup : false,
      jobCodeGroup: false,
      payTypeGroup: false,
    },
    dataRow: [{}], // In Case of Copy this object is empty , but in Annulialize , their will be a data in this object (AS per the UI Wireframe)
  },
  percentChange: 0,
  spreadMethod: "0", // SpreadMethodId
  sectionValidation: {
    sectionValid: true,
    budgetversion: {
      invalid: false,
      invalidText: "",
    },
    numeratorentitysource: {
      invalid: false,
      invalidText: "",
    },
    numeratordepartmentsource: {
      invalid: false,
      invalidText: "",
    },
    numeratorstatisticsource: {
      invalid: false,
      invalidText: "",
    },
    numeratorgeneralLedgersource: {
      invalid: false,
      invalidText: "",
    },
    numeratorjobCodesource: {
      invalid: false,
      invalidText: "",
    },
    numeratorpayTypesource: {
      invalid: false,
      invalidText: "",
    },
    denominatorentitysource: {
      invalid: false,
      invalidText: "",
    },
    denominatordepartmentsource: {
      invalid: false,
      invalidText: "",
    },
    denominatorstatisticsource: {
      invalid: false,
      invalidText: "",
    },
    denominatorgeneralLedgersource: {
      invalid: false,
      invalidText: "",
    },
    denominatorjobCodesource: {
      invalid: false,
      invalidText: "",
    },
    denominatorpayTypesource: {
      invalid: false,
      invalidText: "",
    },
    entitiesgroupsource: {
      invalid: false,
      invalidText: "",
    },
    departmentsgroupsource: {
      invalid: false,
      invalidText: "",
    },
    statisticsgroupsource: {
      invalid: false,
      invalidText: "",
    },
    generalLedgergroupsource: {
      invalid: false,
      invalidText: "",
    },
    numeratorentitytarget: {
      invalid: false,
      invalidText: "",
    },
    numeratordepartmenttarget: {
      invalid: false,
      invalidText: "",
    },
    numeratorstatistictarget: {
      invalid: false,
      invalidText: "",
    },
    numeratorgeneralLedgertarget: {
      invalid: false,
      invalidText: "",
    },   
    numeratorjobCodetarget: {
      invalid: false,
      invalidText: "",
    },
    numeratorpayTypetarget: {
      invalid: false,
      invalidText: "",
    }, 
    denominatorentitytarget: {
      invalid: false,
      invalidText: "",
    },
    denominatordepartmenttarget: {
      invalid: false,
      invalidText: "",
    },
    denominatorstatistictarget: {
      invalid: false,
      invalidText: "",
    },
    denominatorgeneralLedgertarget: {
      invalid: false,
      invalidText: "",
    },
    denominatorjobCodetarget: {
      invalid: false,
      invalidText: "",
    },
    denominatorpayTypetarget: {
      invalid: false,
      invalidText: "",
    }, 
    entitiesgrouptarget: {
      invalid: false,
      invalidText: "",
    },
    departmentsgrouptarget: {
      invalid: false,
      invalidText: "",
    },
    statisticsgrouptarget: {
      invalid: false,
      invalidText: "",
    },
    generalLedgergrouptarget: {
      invalid: false,
      invalidText: "",
    },
  },
  expanded: true,
};

const extra = {
  forecast_budgetversion_code: "FY2020PROJ",
  forecast_budgetversion_name: "FY 2020 Projecctions for CFY",
  forecast_budgetversion_comment: "Some comments",
  forecast_budgetversion_scenario_type: "Statistics",
  forecast_budgetversion_scenario_type_ID: 28, // will set from Budget Version Page
  forecast_budgetversion_timePeriod_ID: 1, // will set from Budget Version Page

  forecastSections: [
    // this array can be hold multiple methods data , but right now it contain only one copy method data.
    {
      forecastType: "copy", // copy ,annualization
      included: false,
      source: {
        // annualize and copy source can use this same property , // Single forecast Method can have multiple source DataRow.
        dataRow: [
          // Can be multiple , but for now Its only one
          {
            budgetVersion_code: "Source-BV", // id
            startMonth: "fiscalStartMonth-01", // id
            endMonth: "fiscalStartMonth-12", // id
          },
        ],
        dimensionRow: {
          entity: "4",
          department: "2",
          statistic: "4",
          entityGroup: false,
          departmentsGroup: false,
          statisticsGroup: false,
        },
      },
      target: {
        dimensionRow: {
          entity: "4",
          department: "2",
          statistic: "4",
        },
        dataRow: {}, // In Case of Copy this object is empty , but in Annulialize , their will be a data in this object (AS per the UI Wireframe)
      },
      percentChange: "",
      spreadMethod: "",
    },
  ],
};

const testing = {
  forecast_budgetversion_code: "FY2020PROJ",
  forecast_budgetversion_name: "FY 2020 Projecctions for CFY",
  forecast_budgetversion_scenario_type: "Statistics",
  forecast_budgetversion_scenario_type_ID: 28,
  forecast_budgetversion_timePeriod_ID: 1,

  forecastSections: [
    {
      forecastType: "copy",
      included: false,
      source: {
        dataRow: [
          {
            budgetVersion_code: "Source-BV",
            startMonth: "fiscalStartMonth-01",
            endMonth: "fiscalStartMonth-12",
          },
        ],
        dimensionRow: {
          entity: "4",
          department: "2",
          statistic: "4",
          entityGroup: false,
          departmentsGroup: false,
          statisticsGroup: false,
        },
      },
      target: {
        dimensionRow: {
          entity: "4",
          department: "2",
          statistic: "4",
        },
        dataRow: {},
      },
      percentChange: "",
      spreadMethod: "",
    },
  ],
};

// {
//   "forecast_budgetversion_code": "FY2020PROJ",
//   "forecast_budgetversion_name": "FY 2020 Projecctions for CFY",
//   "forecast_budgetversion_scenario_type": "Statistics",
//   "forecast_budgetversion_scenario_type_ID": "28",
//   "forecast_budgetversion_timePeriod_ID": "1",
//   "forecastsections": [
//     {
//       "forecastType": "copy",
//       "included": false,
//       "source": {
//         "dataRow": [
//           {
//             "budgetversion_code": "Source-BV",
//             "startMonth": "fiscalStartMonth-01",
//             "endMonth": "fiscalStartMonth-12"
//           }
//         ],
//         "dimensionRow": {
//           "entity": "4",
//           "department": "2",
//           "statistic": "4",
//           "entityGroup": true,
//           "departmentsGroup": true,
//           "statisticsGroup": true
//         }
//       },
//       "target": {
//         "dimensionRow": {
//           "entity": "4",
//           "department": "2",
//           "statistic": "4",
//           "entityGroup": true,
//           "departmentsGroup": true,
//           "statisticsGroup": true
//         },
//         "dataRow": []
//       },
//       "percentChange": 0,
//       "spreadMethod": "string"
//     }
//   ]
// }
