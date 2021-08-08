export const processGeneralLedgerViews = (data, selectedView, inflationState) => {
  let result = [];
  if (!selectedView || selectedView.dollars) {
    result = processTotalDollars(data, inflationState);
  }
  else if (selectedView.preInflationDollar) {
    result = processPreInflationDollars(data);
  }
  else if (selectedView.inflationDollar) {
    result = processInflationDollards(data, inflationState);
  }
  else if (selectedView.inflationRate) {
    result = processInflationRates(data, inflationState);
  }
  else if (selectedView.forecastRate) {
    result = processRatioRates(data);
  }

  if (selectedView?.emptyRows) {
    result = processRowsWithZeroValues(result);
  }

  return result;
}


const processTotalDollars = (data, inflationState) => {
  const result = [];
  const inflationDollars = calculateInflationDollards(data, inflationState);
  const fullMonthsFY = getFullMonthsForFY();

  data.forEach(dataRow => {
    const dr = JSON.parse(JSON.stringify(dataRow));
    const inflationDollar = inflationDollars.find(inflationDollar => { return inflationDollar.entityid === dataRow.entityid && inflationDollar.departmentid === dataRow.departmentid && inflationDollar.glaccountid === dataRow.glaccountid });
    if (inflationDollar) {
      fullMonthsFY.forEach(fullMonth => {
        dr[fullMonth] = dr[fullMonth] + inflationDollar[fullMonth];
      });
    }
    dr.glaccountname += " total GL dollars";
    result.push(dr);
  });

  return result;
}

const processPreInflationDollars = (data) => {
  const result = [];

  data.forEach(row => {
    const dr = JSON.parse(JSON.stringify(row));
    dr.glaccountname += " pre-inflation dollars";
    result.push(dr);
  });

  return result;
}

const processInflationDollards = (data, inflationState) => {
  const result = calculateInflationDollards(data, inflationState);

  result.forEach(r => {
    r.glaccountname += " inflation dollars";
  });

  return result;
}

const processInflationRates = (data, inflationState) => {
  const result = calculateInflationRates(data, inflationState);

  result.forEach(r => {
    r.glaccountname += " inflation rate";
  });


  return result;
}

const processRatioRates = (data) => {
  const result = [];

  data.forEach(dataRow => {
    const dr = JSON.parse(JSON.stringify(dataRow));
    if (dr.dimensions) {
      dr.january = dr.dimensions.ratio;
      dr.february = dr.dimensions.ratio;
      dr.march = dr.dimensions.ratio;
      dr.april = dr.dimensions.ratio;
      dr.may = dr.dimensions.ratio;
      dr.june = dr.dimensions.ratio;
      dr.july = dr.dimensions.ratio;
      dr.august = dr.dimensions.ratio;
      dr.september = dr.dimensions.ratio;
      dr.october = dr.dimensions.ratio;
      dr.november = dr.dimensions.ratio;
      dr.december = dr.dimensions.ratio;
      dr.glaccountname += " forecast rate";
      result.push(dr);
    }
  });

  return result;
}

const processRowsWithZeroValues = (data) => {
  let result = [];

  result = data.filter(dt => dt.january === 0 && dt.february === 0 && dt.march === 0 && dt.april === 0 && dt.may === 0 && dt.june === 0 && dt.july === 0 && dt.august === 0 && dt.september === 0 && dt.october === 0 && dt.november === 0 && dt.december)

  return result;
}


const monthFullNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const getFullMonthsForFY = () => {
  const result = [];

  const index = monthFullNames.findIndex(month => month.toUpperCase() === "JULY");
  for (var i = index; i < monthFullNames.length; i++) {
    result.push(monthFullNames[i]);
  }
  if (index > 0) {
    for (var i = 0; i < index; i++) {
      result.push(monthFullNames[i]);
    }
  }

  return result;
}

const getShortMonthsForFY = () => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const result = [];

  const index = monthNames.findIndex(month => month.toUpperCase() === "JUL");
  for (var i = index; i < monthNames.length; i++) {
    result.push(monthNames[i]);
  }
  if (index > 0) {
    for (var i = 0; i < index; i++) {
      result.push(monthNames[i]);
    }
  }

  return result;
}


const calculateInflationRates = (data, inflationState) => {
  const result = [];

  const fullMonthsFY = getFullMonthsForFY();
  const shortMonthsFY = getShortMonthsForFY();

  data.forEach(dataRow => {
    const dr = JSON.parse(JSON.stringify(dataRow));
    fullMonthsFY.forEach(fullMonth => {
      dr[fullMonth] = 0;
    });
    const inflationRows = inflationState?.filter(inflationRow => { return inflationRow.entity.entityID === dataRow.entityid && inflationRow.department.departmentID === dataRow.departmentid && inflationRow.glAccount.glAccountID === dataRow.glaccountid });
    if (inflationRows?.length > 0) {
      inflationRows.forEach(inflationRow => {
        const startMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === inflationRow.startMonth.itemTypeCode);
        const endMonthIndex = shortMonthsFY.findIndex(month => month.toUpperCase() === inflationRow.endMonth.itemTypeCode);
        for (var i = startMonthIndex; i <= endMonthIndex; i++) {
          dr[fullMonthsFY[i]] += inflationRow.inflationPercent;
        }
      });
      result.push(dr);
    }
  });

  return result;
}

const calculateInflationDollards = (data, inflationState) => {
  const result = [];
  const inflationRates = calculateInflationRates(data, inflationState);
  const fullMonthsFY = getFullMonthsForFY();

  data.forEach(dataRow => {
    const dr = JSON.parse(JSON.stringify(dataRow));
    const inflationRate = inflationRates.find(inflationRow => { return inflationRow.entityid === dataRow.entityid && inflationRow.departmentid === dataRow.departmentid && inflationRow.glaccountid === dataRow.glaccountid });
    if (inflationRate) {
      fullMonthsFY.forEach(fullMonth => {
        dr[fullMonth] = dr[fullMonth] * (inflationRate[fullMonth] * .01);
      });
      result.push(dr);
    }
  });

  return result;
}