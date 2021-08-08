using System;
using System.Collections.Generic;

namespace ABS.DBModels
{
    public class Forecast
    {
        public string Forecast_budgetversion_code { get; set; }
        public string Forecast_budgetversion_name { get; set; }
        public string Forecast_budgetversion_comment { get; set; }

        public string Forecast_budgetversion_scenario_type { get; set; }
        public string forecast_budgetversion_scenario_type_ID { get; set; }
        public string forecast_budgetversion_timePeriod_ID { get; set; }


        public ForecastSection[] Forecastsections { get; set; }
    }
    public class ForecastSection
    {
        public string forecastType { get; set; }
        public bool? included { get; set; }
        public Source source { get; set; }
        public Target target { get; set; }
        public double? percentChange { get; set; }
        public string spreadMethod { get; set; }
        public string automaticallyUpdate { get; set; }
    }
    public class Source
    {
        public DataRow[] dataRow { get; set; }
        public DimensionRow dimensionRow { get; set; }
    }

    public class Target
    {
        public DimensionRow dimensionRow { get; set; }
        public DataRow[] dataRow { get; set; }
    }

    public class DataRow
    {
        public string budgetversion_code { get; set; }
        public string startMonth { get; set; }
        public string endMonth { get; set; }

        public string includeStartMonth { get; set; }
        public string includeEndMonth { get; set; }
        public bool? maintainSeasonality { get; set; }

    }

    public class DimensionRow
    {
        public string entity { get; set; }
        public string department { get; set; }
        public string statistic { get; set; }
        public string generalLedger { get; set; }
        public string jobCode { get; set; }
        public string payType { get; set; }
        public bool? entityGroup { get; set; }
        public bool? departmentsGroup { get; set; }
        public bool? statisticsGroup { get; set; }
        public bool? generalLedgerGroup { get; set; }
        public bool? jobCodeGroup { get; set; }
        public bool? payTypeGroup { get; set; }
        public Numerator numerator { get; set; }
        public Denominator denominator { get; set; }
        public string[] excludedPayTypes { get; set; }
        public string productivePayTypeGroup { get; set; }
        public string nonProductivePayTypeGroup { get; set; }
    }

    public class Numerator
    {
        public string entity { get; set; }
        public string department { get; set; }
        public string statistic { get; set; }
        public string generalLedger { get; set; }
        public string jobCode { get; set; }
        public string payType { get; set; }
    }

    public class Denominator
    {
        public string entity { get; set; }
        public string department { get; set; }
        public string statistic { get; set; }
        public string generalLedger { get; set; }
        public string jobCode { get; set; }
        public string payType { get; set; }
    }


    public class DataRowWithID
    {
        public int budgetVersionID { get; set; }
        public string budgetVersion_timePeriod_ID { get; set; }
        public string budgetversion_code { get; set; }
        public string startMonth { get; set; }
        public string endMonth { get; set; }

        public string includeStartMonth { get; set; }
        public string includeEndMonth { get; set; }
        public bool? maintainSeasonality  {get; set; }

    }

   
    public class ParsedSectionData
    {
        public List<DataRowWithID> sourceBudgetInfo { get; set; }
        public DataRowWithID targetBudgetInfo { get; set; }
        public ForecastSection section { get; set; }
        public List<ParsedSectionDimensionPairings> parsedSectionDimensionPairings { get; set; }
    }

    public class ParsedSectionDimensionPairings
    {
        public DimensionRow sourceDimensionRow { get; set; }
        public DimensionRow targetDimensionRow { get; set; }
        public DimensionRow sourceNumeratorDimensionRow { get; set; }
        public DimensionRow sourceDenominatorDimensionRow { get; set; }
        public DimensionRow targetNumeratorDimensionRow { get; set; }
        public DimensionRow targetDenominatorDimensionRow { get; set; }
    }

    public class ParsedSectionDimensions
    {
        public List<Entities> sourceEntityList { get; set; }
        public List<Departments> sourceDepartmentList { get; set; }
        public List<StatisticsCodes> sourceStatisticList { get; set; }
        public List<Entities> targetEntityList { get; set; }
        public List<Departments> targetDepartmentList { get; set; }
        public List<StatisticsCodes> targetStatisticList { get; set; }

        public List<Entities> sourceNumeratorEntityList { get; set; }
        public List<Departments> sourceNumeratorDepartmentList { get; set; }
        public List<StatisticsCodes> sourceNumeratorStatisticList { get; set; }
        public List<Entities> sourceDenominatorEntityList { get; set; }
        public List<Departments> sourceDenominatorDepartmentList { get; set; }
        public List<StatisticsCodes> sourceDenominatorStatisticList { get; set; }
        
        public List<Entities> targetNumeratorEntityList { get; set; }
        public List<Departments> targetNumeratorDepartmentList { get; set; }
        public List<StatisticsCodes> targetNumeratorStatisticList { get; set; }
        public List<Entities> targetDenominatorEntityList { get; set; }
        public List<Departments> targetDenominatorDepartmentList { get; set; }
        public List<StatisticsCodes> targetDenominatorStatisticList { get; set; }

        public List<GLAccounts> sourceGLAccountList { get; set; }
        public List<GLAccounts> targetGLAccountList { get; set; }
        
        public List<GLAccounts> sourceNumeratorGLAccountList { get; set; }
        public List<GLAccounts> sourceDenominatorGLAccountList { get; set; }
        public List<GLAccounts> targetNumeratorGLAccountList { get; set; }
        public List<GLAccounts> targetDenominatorGLAccountList { get; set; }

        
        public List<JobCodes> sourceJobCodeList { get; set; }
        public List<PayTypes> sourcePayTypeList { get; set; }
        public List<JobCodes> targetJobCodeList { get; set; }
        public List<PayTypes> targetPayTypeList { get; set; }
        public List<JobCodes> sourceNumeratorJobCodeList { get; set; }
        public List<PayTypes> sourceNumeratorPayTypeList { get; set; }
        public List<JobCodes> sourceDenominatorJobCodeList { get; set; }
        public List<PayTypes> sourceDenominatorPayTypeList { get; set; }
        public List<JobCodes> targetNumeratorJobCodeList { get; set; }
        public List<PayTypes> targetNumeratorPayTypeList { get; set; }
        public List<JobCodes> targetDenominatorJobCodeList { get; set; }
        public List<PayTypes> targetDenominatorPayTypeList { get; set; }
    }
}
