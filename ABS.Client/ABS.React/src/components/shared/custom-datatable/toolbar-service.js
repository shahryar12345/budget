export const getToolbarOptions = (type) => {
    switch (type) {
        case 'Forecaststatistics':
            return [...statisticsOptions, addRowoption];
        case 'ForecastgenralLedger':
            return [...generalLedgerOptions, addRowoption];
        case 'Forecaststaffing':
            return [...staffingOptions, addRowoption];

        case 'Actualstatistics':
            return [...statisticsOptions, addRowoption];
        case 'ActualgenralLedger':
            return [...actualGeneralLedgerOptions];
        case 'Actualstaffing':
            return [...actualStaffingOptions];
        default:
            return [];
    }
}

export const getToolbarState = (type) => {
    switch (type) {
        case 'statistics':
            return { months: true, amount: true };
        case 'genralLedger':
            return { months: true, dollars: true };
        case 'staffing':
            return { months: true, totalHours: true };
        default:
            return [];
    }
}


const generalLedgerOptions = [
    { name: "Months", id: "months" },
    { name: "Total GL dollars", id: 'dollars', group: 'exclusive' },
    { name: "Pre-inflation dollars", id: 'preInflationDollar', group: 'exclusive' },
    { name: "Inflation dollars", id: 'inflationDollar', group: 'exclusive' },
    { name: "Inflation rate", id: 'inflationRate', group: 'exclusive' },
    { name: "Forecast rate", id: 'forecastRate', group: 'exclusive' },
    { name: "Rows with 0 in all 12 months", id: 'emptyRows' }
]

const statisticsOptions = [
    { name: "Months", id: "months" },
    { name: "Amount", id: 'amount' },
    { name: "Ratio rate", id: 'ratioRate' },
    { name: "Rows with 0 in all 12 months", id: 'emptyRows' }
]

const staffingOptions = [
    { name: "Months", id: "months" },
    { name: "Hours", id: 'totalHours', group: 'exclusive' },
    { name: "FTEs", id: 'fte', group: 'exclusive' },
    { name: "Total salary", id: 'totalStaffingDollars', group: 'exclusive' },
    { name: "Pre-raise dollars", id: 'preRaiseDollars', group: 'exclusive' },
    { name: "Raise amount", id: 'raiseDollars', group: 'exclusive' },
    { name: "Total wage rate", id: 'wageRate', group: 'exclusive', itemTypeId: 1113, itemTypeDisplayName: "Average Wage" },
    { name: "Raise rate", id: 'raiseRate', group: 'exclusive' },
    { name: "Run rate", id: 'runRate', group: 'exclusive' },
    { name: "Pay type distribution", id: 'payTypeDistribution', group: 'exclusive' },
    { name: "Rows with 0 in all 12 months", id: 'emptyRows' },
]


const actualStaffingOptions = [
    { name: "Months", id: "months" },
    { name: "Hours", id: 'totalHours', group: 'exclusive' },
    { name: "Total salary", id: 'totalStaffingDollars', group: 'exclusive' },
    { name: "Rows with 0 in all 12 months", id: 'emptyRows' },
]


const actualGeneralLedgerOptions = [
    { name: "Months", id: "months" },
    { name: "Total GL dollars", id: 'dollars', group: 'exclusive' },
    { name: "Rows with 0 in all 12 months", id: 'emptyRows' }
]

const addRowoption = { name: "Added rows", id: "showAddedRow" }
