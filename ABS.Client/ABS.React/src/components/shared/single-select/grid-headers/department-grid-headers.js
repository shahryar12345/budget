export const departmentHeaders = [
    {
        header: "Department",
        key: "department",
        extraDetails: [
            {
                key: "code",
                text: "Code",
                isHidden: false,
                showTooltipText: "Show Codes",
                hideTooltipText: "Hide Codes",
            },
            {
                key: "name",
                text: "Name",
                isHidden: false,
                showTooltipText: "Show Names",
                hideTooltipText: "Hide Names",
            },
        ],
        type: 'tree'
    }, {
        header: 'Description',
        key: 'description',
        type: 'plane'
    }

];