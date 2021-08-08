export const payTypeHeaders = [
    {
        header: "Pay type",
        key: "payType",
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