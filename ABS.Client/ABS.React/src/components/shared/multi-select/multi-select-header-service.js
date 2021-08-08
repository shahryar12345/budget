export const getOnlyNameHeaders = (name) => {
 switch (name) {
  case "Department":
   return departmentHeaders;
  case "Entity":
   return entityHeaders;
  case "Statistics":
   return statisticsHeaders;
  // case 'Budget version':
  //     return budgetVersionHeaders;
  // case 'GLAccounts':
  //     return glAccountsHeaders;
  // case 'GL Account':
  //     return glAccountsHeaders
  // case 'jobCode':
  //     return jobCodeHeaders;
  // case 'payType':
  //     return payTypeHeaders;
  default:
   return;
 }
};

const entityHeaders = [
 {
  id: 0,
  header: "Entity",
  key: "entity",
  type:"tree",
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
];
const departmentHeaders = [
 {
  id: 1,
  header: "Department",
  key: "department",
  type:"tree",
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
];

const statisticsHeaders = [
 {
  id: 2,
  header: "Statistics",
  key: "statistics",
  type:"tree",
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
    showTooltipText: "Show Names",
    hideTooltipText: "Hide Names",
    isHidden: false,
   },
  ],
 },
];
