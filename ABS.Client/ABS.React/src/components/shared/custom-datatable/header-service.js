export const headersNames = {
    month: 'month',
    statistics: 'statistics',
    genralLedger: 'genralLedger'
}


export const getHeaders = (type) => {
    switch (type) {
        case 'month':
            return monthNames;
        case 'statistics':
            return statisticsHeaders;
        case 'genralLedger':
            return generalLedgerHeaders;
        case 'staffing':
            return staffingHeaders;
        default:
            return [];
    }
}

const monthNames = [
    {
        key: 'january',
        text: 'Jan',
        formatType: 'number'
    }, {
        key: 'february',
        text: 'Feb',
        formatType: 'number'
    }, {
        key: 'march',
        text: 'Mar',
        formatType: 'number'
    }, {
        key: 'april',
        text: 'Apr',
        formatType: 'number'
    }, {
        key: 'may',
        text: 'May',
        formatType: 'number'
    }, {
        key: 'june',
        text: 'Jun',
        formatType: 'number'
    }, {
        key: 'july',
        text: 'Jul',
        formatType: 'number'
    }, {
        key: 'august',
        text: 'Aug',
        formatType: 'number'
    }, {
        key: 'september',
        text: 'Sep',
        formatType: 'number'
    }, {
        key: 'october',
        text: 'Oct',
        formatType: 'number'
    }, {
        key: 'november',
        text: 'Nov',
        formatType: 'number'
    }, {
        key: 'december',
        text: 'Dec',
        formatType: 'number'
    }
]


const statisticsHeaders = [
    {
        header: "Entity",
        key: "entity",
        extraDetails: [
            {
                key: 'code',
                text: 'Code',
                isHidden: false,
                showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
            },
            {
                key: 'name',
                text: 'Name',
                isHidden: false,
                showTooltipText: 'Show Names', hideTooltipText: 'Hide Names'
            }
        ]
    },
    {
        header: "Department",
        key: "department",
        extraDetails: [
            {
                key: 'code',
                text: 'Code',
                isHidden: false,
                showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
            },
            {
                key: 'name',
                text: 'Name',
                isHidden: false,
                showTooltipText: 'Show Names', hideTooltipText: 'Hide Names'
            }
        ]
    },
    {
        header: "Statistics",
        key: "details",
        extraDetails: [
            {
                key: 'code',
                text: 'Code',
                isHidden: false,
                showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
            },
            {
                key: 'name',
                text: 'Name',
                isHidden: false,
                showTooltipText: 'Show Names', hideTooltipText: 'Hide Names'
            }
        ]
    }
];

const generalLedgerHeaders = [
    {
        header: "Entity",
        key: "entity",
        extraDetails: [
            {
                key: 'code',
                text: 'Code',
                isHidden: false,
                showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
            },
            {
                key: 'name',
                text: 'Name',
                isHidden: false,
                showTooltipText: 'Show Names', hideTooltipText: 'Hide Names'
            }
        ]
    },
    {
        header: "Department",
        key: "department",
        extraDetails: [
            {
                key: 'code',
                text: 'Code',
                isHidden: false,
                showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
            },
            {
                key: 'name',
                text: 'Name',
                isHidden: false,
                showTooltipText: 'Show Names', hideTooltipText: 'Hide Names'
            }
        ]
    },
    {
        header: "GL_Account",
        key: "details",
        extraDetails: [
            {
                key: 'code',
                text: 'Code',
                isHidden: false,
                showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
            },
            {
                key: 'name',
                text: 'Name',
                isHidden: false,
                showTooltipText: 'Show Names', hideTooltipText: 'Hide Names'
            }
        ]
    }
];

const staffingHeaders = [
    {
        header: "Entity",
        key: "entity",
        extraDetails: [
            {
                key: 'code',
                text: 'Code',
                isHidden: false,
                showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
            },
            {
                key: 'name',
                text: 'Name',
                isHidden: false,
                showTooltipText: 'Show Names', hideTooltipText: 'Hide Names'
            }
        ]
    },
    {
        header: "Department",
        key: "department",
        extraDetails: [
            {
                key: 'code',
                text: 'Code',
                isHidden: false,
                showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
            },
            {
                key: 'name',
                text: 'Name',
                isHidden: false,
                showTooltipText: 'Show Names', hideTooltipText: 'Hide Names'
            }
        ]
    },
    {
        header: "Job_code",
        key: "jobCode",
        extraDetails: [
            {
                key: 'code',
                text: 'Code',
                isHidden: false,
                showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
            },
            {
                key: 'name',
                text: 'Name',
                isHidden: false,
                showTooltipText: 'Show Names', hideTooltipText: 'Hide Names'
            }
        ]
    },
    {
        header: "Pay_types",
        key: "details",
        extraDetails: [
            {
                key: 'code',
                text: 'Code',
                isHidden: false,
                showTooltipText: 'Show Codes', hideTooltipText: 'Hide Codes'
            },
            {
                key: 'name',
                text: 'Name',
                isHidden: false,
                showTooltipText: 'Show Names', hideTooltipText: 'Hide Names'
            }
        ]
    }
];