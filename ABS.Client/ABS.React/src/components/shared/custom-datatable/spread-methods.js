
export const SpreadMethodTypes = {
    Prorated: 'prorated',
};


export const getChange = (spreadMethodTypes, spreadMethodInputParams) => {

    switch (spreadMethodTypes) {
        case SpreadMethodTypes.Prorated:
            return getProratedChange(spreadMethodInputParams);

        default:
            return getProratedChange(spreadMethodInputParams);
    }
}

const getProratedChange = (params) => {
    if (params.value) {
        return (params.monthValue * params.changedValue / params.value) - params.monthValue;
    } else {
        return params.changedValue / 12;
    }
}

