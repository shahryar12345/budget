const mockInitialState = {
    MasterData: {
        BudgetVersionsType: [
            {
                itemTypeValue: "Actuals",
                itemTypeId: "A",
                itemTypeCode: "A",
                itemTypeID: "A",
            },
            {
                itemTypeValue: "Forecast",
                itemTypeId: "F",
                itemTypeCode: "F",
                itemTypeID: "F",
            },
        ],
        FiscalYear: [
            {
                itemTypeValue: "2020",
                itemTypeId: "2020",
                itemTypeCode: "2020",
                itemTypeID: "2020",
            },
            {
                itemTypeValue: "2019",
                itemTypeId: "2019",
                itemTypeCode: "2019",
                itemTypeID: "2019",
            },
        ],
        ScenarioType: [
            {
                itemTypeValue: "Type1",
                itemTypeId: "Type1",
                itemTypeCode: "Type1",
                itemTypeID: "Type1",
            },
            {
                itemTypeValue: "Type2",
                itemTypeId: "Type2",
                itemTypeCode: "Type2",
                itemTypeID: "Type2",
            },
        ],
        ItemMonths: [
            {
                itemTypeValue: "JAN",
                itemTypeId: "JAN",
                itemTypeCode: "JAN",
                itemTypeID: "JAN",
            },
            {
                itemTypeValue: "FEB",
                itemTypeId: "FEB",
                itemTypeCode: "FEB",
                itemTypeID: "FEB",
            },
        ],
        ItemDateFormat: [
            {
                itemTypeID: 3,
                itemTypeKeyword: "DATEFORMATS",
                itemTypeCode: "mm/dd/yyyy",
                itemTypeValue: "itemsDateFormat-0",
                itemDataType: "DateTime",
            },
            {
                itemTypeID: 4,
                itemTypeKeyword: "DATEFORMATS",
                itemTypeCode: "yyyy-mm-dd",
                itemTypeValue: "itemsDateFormat-1",
                itemDataType: "DateTime",
            },
        ],
    },
    BudgetVersions: {
        isLoaded: true,
        isLoading: null,
        code: null,
        description: null,
        comments: null,
        fiscalYearID: null,
        fiscalStartMonthID: null,
        budgetVersionTypeID: null,
        scenarioTypeID: null,
        UserAuthenticated: true,
        UserID: 1,
        budgetVersionsData: [],
        list: [
            {
                budgetVersionsID: 48,
                code: "FY2020PROJ",
                comments: "No Comments now updated",
                description: "FY 2020 Projections for CFY111",
                userProfile: "LNajjar",
                fiscalYearID: "2020",
                budgetVersionTypeID: "Forecast",
                scenarioTypeID: null,
                fiscalStartMonthID: "JUL",
                creationDate: "2020-03-25T08:03:40.0432501",
            },
            {
                budgetVersionsID: 54,
                code: "FY2021ACTUAL",
                comments: "This is a test",
                description: "FY2021 Actual",
                userProfile: "LNajjar",
                fiscalYearID: "2021",
                budgetVersionTypeID: "Actuals",
                scenarioTypeID: null,
                fiscalStartMonthID: "JAN",
                creationDate: "2020-03-25T13:11:21.7217479",
            },
            {
                budgetVersionsID: 61,
                code: "FY2020PROJ",
                comments: "No Comments now updated",
                description: "FY 2020 Projections for CFY111",
                userProfile: "LNajjar",
                fiscalYearID: "2020",
                budgetVersionTypeID: "Forecast",
                scenarioTypeID: null,
                fiscalStartMonthID: "JUL",
                creationDate: "2020-03-25T08:03:40.0432501",
            },
            {
                budgetVersionsID: 62,
                code: "FY2021ACTUAL",
                comments: "This is a test",
                description: "FY2021 Actual",
                userProfile: "LNajjar",
                fiscalYearID: "2021",
                budgetVersionTypeID: "Actuals",
                scenarioTypeID: null,
                fiscalStartMonthID: "JAN",
                creationDate: "2020-03-25T13:11:21.7217479",
            },
            {
                budgetVersionsID: 63,
                code: "FY2020PROJ",
                comments: "No Comments now updated",
                description: "FY 2020 Projections for CFY111",
                userProfile: "LNajjar",
                fiscalYearID: "2020",
                budgetVersionTypeID: "Forecast",
                scenarioTypeID: null,
                fiscalStartMonthID: "JUL",
                creationDate: "2020-03-25T08:03:40.0432501",
            },
            {
                budgetVersionsID: 64,
                code: "FY2021ACTUAL",
                comments: "This is a test",
                description: "FY2021 Actual",
                userProfile: "LNajjar",
                fiscalYearID: "2021",
                budgetVersionTypeID: "Actuals",
                scenarioTypeID: null,
                fiscalStartMonthID: "JAN",
                creationDate: "2020-03-25T13:11:21.7217479",
            },
        ],
    },
    systemSettings: {
        fiscalStartMonth: "Jan",
        fiscalEndMonth: "Jun",
        fiscalStartMonthDateFormat: "itemsDateFormat-0",
        decimalPlaceStatistics: "itemDecimalPlaces-2",
        decimalPlacesFTE: "itemDecimalPlaces-2",
        decimalPlacesAmounts: "itemDecimalPlaces-2",
        decimalPlacesHours: "itemDecimalPlaces-2",
        decimalPlacesPercentValues: "itemDecimalPlaces-2",
        xc_Currency: false,
        xc_Commas: false,
        rd_negativeValues: "withBracket",
        list: [],
        UserID: 1,
    },
};

export default mockInitialState;
