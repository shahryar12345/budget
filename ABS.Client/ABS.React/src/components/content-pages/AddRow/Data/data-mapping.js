export const DataMapping = {
    statistics : {
      id : "statisticsCodeID",
      child : "childStatistic",
      name : "statisticsCodeName",
      code : "statisticsCode",
      scenarioItemCompareId : "statisticsid",
      header : [
        {
          header: "Statistics",
          key: "statistics",
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
        },
        {
          header: "Includes data",
          key: "includeData",
          extraDetails: [],
        },
      ]
    },
    glAccount : {
      id : "glAccountID",
      child : "childGLAccounts",
      name : "glAccountName",
      code : "glAccountCode",
      scenarioItemCompareId : "glaccountid",
      header : [
        {
        header: "GL Account",
        key: "glaccount",
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
        },
        {
          header: "Includes data",
          key: "includeData",
          extraDetails: [],
        },
      ]
    },
    payType : {
      id : "payTypeID",
      child : "childPayTypes",
      name : "payTypeName",
      code : "payTypeCode",
      scenarioItemCompareId : "paytypeid",
      header : [
        {
        header: "Pay Type",
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
        },
        {
          header: "Includes data",
          key: "includeData",
          extraDetails: [],
        },
      ]
    }
  }
