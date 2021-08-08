// locale is not configurable as of now
export const locale = 'en-US';

export const testRows = [
    {
        column1: "test1",
        column2: 11,
        column3: 12,
        column4: 1/1/2020,
        childRows: {
            column11: "test1_child",
            column12: 110,
            column13: 120,
            column14: 1/1/2019
        }
    },
    {
        column1: "test2",
        column2: 21,
        column3: 22,
        column4: 2/2/2020,
        childRows: {
            column11: "test2_child",
            column12: 210,
            column13: 220,
            column14: 2/2/2019
        }
    },
    {
        column1: "test3",
        column2: 31,
        column3: 32,
        column4: 3/3/2020,
        childRows: {
            column11: "test3_child",
            column12: 310,
            column13: 320,
            column14: 3/3/2019
        }
    }
];

export const headers1 = [
    {
        column: 'column2',
        formatType: 'number'
    }
];

export const headers2 = [
    {
        column: 'column2',
        formatType: 'fake'
    }
];

export const formatParameters1 = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
}

export const formattedRows1 = [
    {
        column1: "test1",
        column2: '11.0',
        column3: 12,
        column4: 1/1/2020,
        childRows: {
            column11: "test1_child",
            column12: 110,
            column13: 120,
            column14: 1/1/2019
        }
    },
    {
        column1: "test2",
        column2: '21.0',
        column3: 22,
        column4: 2/2/2020,
        childRows: {
            column11: "test2_child",
            column12: 210,
            column13: 220,
            column14: 2/2/2019
        }
    },
    {
        column1: "test3",
        column2: '31.0',
        column3: 32,
        column4: 3/3/2020,
        childRows: {
            column11: "test3_child",
            column12: 310,
            column13: 320,
            column14: 3/3/2019
        }
    }
];

export const formatParameters2 = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
}

export const formattedRows2 = [
    {
        column1: "test1",
        column2: '11.00',
        column3: 12,
        column4: 1/1/2020,
        childRows: {
            column11: "test1_child",
            column12: 110,
            column13: 120,
            column14: 1/1/2019
        }
    },
    {
        column1: "test2",
        column2: '21.00',
        column3: 22,
        column4: 2/2/2020,
        childRows: {
            column11: "test2_child",
            column12: 210,
            column13: 220,
            column14: 2/2/2019
        }
    },
    {
        column1: "test3",
        column2: '31.00',
        column3: 32,
        column4: 3/3/2020,
        childRows: {
            column11: "test3_child",
            column12: 310,
            column13: 320,
            column14: 3/3/2019
        }
    }
];