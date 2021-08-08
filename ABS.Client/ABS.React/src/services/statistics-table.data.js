export const headers = [
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
        key: "statistics",
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

export const rows =
    [
        {
            entity: {
                name: 'SNF Center',
                code: 'MC'
            },
            isExpanded: false,
            childRows: [
                {
                    department: {
                        name: '6010 ICU (DAYS)',
                        code: 'C6010'
                    },
                    isExpanded: false,
                    childRows: [
                        {
                            statistics: {
                                name: '100 PATIENT DAYS',
                                code: 'U100'
                            },
                            jan: 100,
                            feb: 52,
                            mar: 52,
                            apr: 52,
                            may: 52,
                            jun: 52,
                            jul: 50,
                            aug: 50,
                            sep: 53,
                            oct: 57,
                            nov: 50,
                            dec: 52
                        },
                        {
                            statistics: {
                                name: '101 23HR STAYS',
                                code: 'U101'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 0,
                            sep: 0,
                            oct: 0,
                            nov: 0,
                            dec: 0,
                            fy: 0,
                        },
                        {
                            statistics: {
                                name: '104  MEDICARE PATIENT DAYS',
                                code: 'U104'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 163
                        },
                        {
                            statistics: {
                                name: '32 DISCHARGES',
                                code: 'U32'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        },
                        {
                            statistics: {
                                name: '34 MEDICARE DISCHARGES',
                                code: 'U34'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        }
                    ]
                },
                {
                    department: {
                        name: '6030 CORONARY ICU',
                        code: '6030'
                    },
                    isExpanded: false,
                    childRows: [
                        {
                            statistics: {
                                name: '100 PATIENT DAYS',
                                code: 'U100'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 50,
                            sep: 53,
                            oct: 57,
                            nov: 50,
                            dec: 52,
                            fy: 314
                        },
                        {
                            statistics: {
                                name: '101 23HR STAYS',
                                code: 'U101'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 259,
                        },
                        {
                            statistics: {
                                name: '104  MEDICARE PATIENT DAYS',
                                code: 'U104'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 163
                        },
                        {
                            statistics: {
                                name: '32 DISCHARGES',
                                code: 'U32'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        },
                        {
                            statistics: {
                                name: '34 MEDICARE DISCHARGES',
                                code: 'U34'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        }
                    ]
                },
                {
                    department: {
                        name: '6150 MEDICAL/SURGICAL-9TH FL',
                        code: '6150'
                    },
                    isExpanded: false,
                    childRows: [
                        {
                            statistics: {
                                name: '100 PATIENT DAYS',
                                code: 'U100'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 50,
                            sep: 53,
                            oct: 57,
                            nov: 50,
                            dec: 52,
                            fy: 314
                        },
                        {
                            statistics: {
                                name: '101 23HR STAYS',
                                code: 'U101'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 259,
                        },
                        {
                            statistics: {
                                name: '104  MEDICARE PATIENT DAYS',
                                code: 'U104'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 163
                        },
                        {
                            statistics: {
                                name: '32 DISCHARGES',
                                code: 'U32'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        },
                        {
                            statistics: {
                                name: '34 MEDICARE DISCHARGES',
                                code: 'U34'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        }
                    ]
                }
            ]
        },
        {
            entity: {
                name: 'Marina Medical Group',
                code: 'MMG'
            },
            isExpanded: false,
            childRows: [
                {
                    department: {
                        name: '6010 ICU (DAYS)',
                        code: 'C6010'
                    },
                    isExpanded: false,
                    childRows: [
                        {
                            statistics: {
                                name: '100 PATIENT DAYS',
                                code: 'U100'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 50,
                            sep: 53,
                            oct: 57,
                            nov: 50,
                            dec: 52,
                            fy: 314
                        },
                        {
                            statistics: {
                                name: '101 23HR STAYS',
                                code: 'U101'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 259,
                        },
                        {
                            statistics: {
                                name: '104  MEDICARE PATIENT DAYS',
                                code: 'U104'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 163
                        },
                        {
                            statistics: {
                                name: '32 DISCHARGES',
                                code: 'U32'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        },
                        {
                            statistics: {
                                name: '34 MEDICARE DISCHARGES',
                                code: 'U34'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        }
                    ]
                },
                {
                    department: {
                        name: '6030 CORONARY ICU',
                        code: '6030'
                    },
                    isExpanded: false,
                    childRows: [
                        {
                            statistics: {
                                name: '100 PATIENT DAYS',
                                code: 'U100'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 50,
                            sep: 53,
                            oct: 57,
                            nov: 50,
                            dec: 52,
                            fy: 314
                        },
                        {
                            statistics: {
                                name: '101 23HR STAYS',
                                code: 'U101'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 259,
                        },
                        {
                            statistics: {
                                name: '104  MEDICARE PATIENT DAYS',
                                code: 'U104'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 163
                        },
                        {
                            statistics: {
                                name: '32 DISCHARGES',
                                code: 'U32'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        },
                        {
                            statistics: {
                                name: '34 MEDICARE DISCHARGES',
                                code: 'U34'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        }
                    ]
                },
                {
                    department: {
                        name: '6150 MEDICAL/SURGICAL-9TH FL',
                        code: '6150'
                    },
                    isExpanded: false,
                    childRows: [
                        {
                            statistics: {
                                name: '100 PATIENT DAYS',
                                code: 'U100'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 50,
                            sep: 53,
                            oct: 57,
                            nov: 50,
                            dec: 52,
                            fy: 314
                        },
                        {
                            statistics: {
                                name: '101 23HR STAYS',
                                code: 'U101'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 259,
                        },
                        {
                            statistics: {
                                name: '104  MEDICARE PATIENT DAYS',
                                code: 'U104'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 163
                        },
                        {
                            statistics: {
                                name: '32 DISCHARGES',
                                code: 'U32'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        },
                        {
                            statistics: {
                                name: '34 MEDICARE DISCHARGES',
                                code: 'U34'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        }
                    ]
                }
            ]
        },
        {
            entity: {
                name: 'Marina Hospital',
                code: 'MH'
            },
            isExpanded: false,
            childRows: [
                {
                    department: {
                        name: '6010 ICU (DAYS)',
                        code: 'C6010'
                    },
                    isExpanded: false,
                    childRows: [
                        {
                            statistics: {
                                name: '100 PATIENT DAYS',
                                code: 'U100'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 50,
                            sep: 53,
                            oct: 57,
                            nov: 50,
                            dec: 52,
                            fy: 314
                        },
                        {
                            statistics: {
                                name: '101 23HR STAYS',
                                code: 'U101'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 259,
                        },
                        {
                            statistics: {
                                name: '104  MEDICARE PATIENT DAYS',
                                code: 'U104'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 163
                        },
                        {
                            statistics: {
                                name: '32 DISCHARGES',
                                code: 'U32'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        },
                        {
                            statistics: {
                                name: '34 MEDICARE DISCHARGES',
                                code: 'U34'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        }
                    ]
                },
                {
                    department: {
                        name: '6030 CORONARY ICU',
                        code: '6030'
                    },
                    isExpanded: false,
                    childRows: [
                        {
                            statistics: {
                                name: '100 PATIENT DAYS',
                                code: 'U100'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 50,
                            sep: 53,
                            oct: 57,
                            nov: 50,
                            dec: 52,
                            fy: 314
                        },
                        {
                            statistics: {
                                name: '101 23HR STAYS',
                                code: 'U101'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 259,
                        },
                        {
                            statistics: {
                                name: '104  MEDICARE PATIENT DAYS',
                                code: 'U104'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 163
                        },
                        {
                            statistics: {
                                name: '32 DISCHARGES',
                                code: 'U32'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        },
                        {
                            statistics: {
                                name: '34 MEDICARE DISCHARGES',
                                code: 'U34'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        }
                    ]
                },
                {
                    department: {
                        name: '6150 MEDICAL/SURGICAL-9TH FL',
                        code: '6150'
                    },
                    isExpanded: false,
                    childRows: [
                        {
                            statistics: {
                                name: '100 PATIENT DAYS',
                                code: 'U100'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 50,
                            sep: 53,
                            oct: 57,
                            nov: 50,
                            dec: 52,
                            fy: 314
                        },
                        {
                            statistics: {
                                name: '101 23HR STAYS',
                                code: 'U101'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 259,
                        },
                        {
                            statistics: {
                                name: '104  MEDICARE PATIENT DAYS',
                                code: 'U104'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 163
                        },
                        {
                            statistics: {
                                name: '32 DISCHARGES',
                                code: 'U32'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        },
                        {
                            statistics: {
                                name: '34 MEDICARE DISCHARGES',
                                code: 'U34'
                            },
                            jan: 0,
                            feb: 0,
                            mar: 0,
                            apr: 0,
                            may: 0,
                            jun: 0,
                            jul: 0,
                            aug: 20,
                            sep: 25,
                            oct: 78,
                            nov: 26,
                            dec: 54,
                            fy: 183
                        }
                    ]
                }
            ]
        }
    ];