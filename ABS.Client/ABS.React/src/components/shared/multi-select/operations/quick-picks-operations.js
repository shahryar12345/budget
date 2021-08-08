export const getQuickPickedRows = (quickPickSelection, orignalData, individualMembersGridData) => {
 let checkboxSelectedValues = [];
 let snowBallSelectedValues = [];
 let dataToShow = [];
 // { id: "allGroupsShow", key: "allGroupsShow-" + name, value: "Show all groups" },
 // { id: "allItemsShow", key: "allItemsShow-" + name, value: "Show all items" },
 // { id: "allItemsSelect", key: "allItemsSelect-" + name, value: "Select all items (no groups)" },

 // const quickPickItemList = [
 //     { id: "allGroupsShow", key: "allGroupsShow-" + name, value: "Show all groups" },
 //     { id: "allItemsShow", key: "allItemsShow-" + name, value: "Show all items" },
 //     { id: "allGroupWithItemSelect", key: "allGroupWithItemSelect-" + name, value: "Select all groups including their items" },
 //     { id: "allGroupWithOutItemSelect", key: "allGroupWithOutItemSelect-" + name, value: "Select all groups excluding their items" },
 //     { id: "allItemsSelect", key: "allItemsSelect-" + name, value: "Select all items (no groups)" },
 //     { id: "displayedGroupsSelect", key: "displayedGroupsSelect-" + name, value: "Select displayed groups" },
 //     { id: "displayedGroupsWithItemsSelect", key: "displayedGroupsWithItemsSelect-" + name, value: "Select displayed groups and their displayed items" },
 //     { id: "hideUnSelected", key: "hideUnSelected-" + name, value: "Hide unselected" },
 //    ];

 // Show/Display option
 if (
  quickPickSelection.find((item) => {
   return item.id === "allGroupsShow";
  }) &&
  quickPickSelection.find((item) => {
   return item.id === "allItemsShow";
  })
 ) {
  dataToShow = [...orignalData];
 } else if (
  quickPickSelection.find((item) => {
   return item.id === "allGroupsShow";
  })
 ) {
  dataToShow = [...showAllGroups(orignalData)];
 } else if (
  quickPickSelection.find((item) => {
   return item.id === "allItemsShow";
  })
 ) {
  dataToShow = [...individualMembersGridData];
 } else {
  dataToShow = [];
 }

 // Selection operations
 if (quickPickSelection.find((item) => item.id === "allGroupWithItemSelect")) {
  let onlyGroups = orignalData.filter((item) => item.isGroup || item.isHierarchy);
  onlyGroups.forEach((row) => (snowBallSelectedValues = handleSnowBallselection(row, snowBallSelectedValues, false)));
  onlyGroups.forEach((row) => (checkboxSelectedValues = handleCheckBoxselection(row, checkboxSelectedValues, false)));
 } else if (quickPickSelection.find((item) => item.id === "allGroupWithOutItemSelect")) {
  let onlyGroups = orignalData.filter((item) => item.isGroup || item.isHierarchy);
  onlyGroups.forEach((row) => (snowBallSelectedValues = handleSnowBallselection(row, snowBallSelectedValues, false)));
 } else if (quickPickSelection.find((item) => item.id === "allItemsSelect")) {
  checkboxSelectedValues = [...individualMembersGridData];
 } else if (quickPickSelection.find((item) => item.id === "displayedGroupsSelect")) {
  let onlyGroups = orignalData.filter((item) => item.isGroup || item.isHierarchy);
  onlyGroups.forEach((row) => (snowBallSelectedValues = handleSnowBallselection(row, snowBallSelectedValues, true)));
 } else if (quickPickSelection.find((item) => item.id === "displayedGroupsWithItemsSelect")) {
  let onlyGroups = orignalData.filter((item) => item.isGroup || item.isHierarchy);
  onlyGroups.forEach((row) => (snowBallSelectedValues = handleSnowBallselection(row, snowBallSelectedValues, true)));
  onlyGroups.forEach((row) => (checkboxSelectedValues = handleCheckBoxselection(row, checkboxSelectedValues, true)));
 }

 if (quickPickSelection.find((item) => item.id === "hideUnSelected")) {
  dataToShow = [...hideUnselected([...checkboxSelectedValues, ...snowBallSelectedValues], [...dataToShow])];
 }
 return { dataToShow, checkboxSelectedValues, snowBallSelectedValues };
};

const hideUnselected = (selectedData, dataToShow) => {
 return dataToShow.map((row) => {
  removeUnSelectedItemRow(row, selectedData);
  return row;
 });
};

const removeUnSelectedItemRow = (row, selectedData) => {
 let itemsFound = selectedData.filter((item) => item.id === row.id);
 row["isRemoved"] = true;
 let RecordExist = itemsFound.find((itemFound) => row.parentId === itemFound.parentId);
 if (RecordExist) {
  row["isRemoved"] = false;
 } else {
  row["isRemoved"] = true;
 }
 if (row.isGroup || row.isHierarchy) {
  if (row.childRows?.length) {
   row.childRows.forEach((innerRow) => {
    removeUnSelectedItemRow(innerRow, selectedData);
   });
  }
 }
};

const showAllGroups = (data) => {
 let updatedData = [...data];
 // fisrt remove the individual members
 updatedData = updatedData.filter((item) => {
  return item.isGroup || item.isHierarchy;
 });
 updatedData = updatedData.map((row) => {
  removeItemRow(row);
  return row;
 });
 return updatedData;
};

const removeItemRow = (row) => {
 if (row.isGroup || row.isHierarchy) {
  // Row is group aur Hierarchy so no need to remove in from the dataset
  // and check its child now
  row["isRemoved"] = false;
  if (row.childRows?.length) {
   row.childRows.forEach((innerRow) => {
    removeItemRow(innerRow);
   });
  }
 } else {
  // If row in the item, so delete it.
  row["isRemoved"] = true;
 }
};

const handleCheckBoxselection = (row, selectedItems, checkDisplayed) => {
 selectedItems.push(row);

 if (checkDisplayed === false) {
  if (row?.childRows?.length > 0) {
   row.childRows.forEach((row) => {
    selectedItems = handleCheckBoxselection(row, selectedItems, checkDisplayed);
   });
  }
 } else if (checkDisplayed === true) {
  if (row?.childRows?.length > 0 && row.isExpanded) {
   row.childRows.forEach((row) => {
    selectedItems = handleCheckBoxselection(row, selectedItems, checkDisplayed);
   });
  }
 }

 return selectedItems;
};

const handleSnowBallselection = (row, selectedItems, checkDisplayed) => {
 if (row.isGroup === true || row.isHierarchy === true) {
  selectedItems.push(row);
 }
 if (checkDisplayed === false) {
  if (row?.childRows?.length > 0) {
   row.childRows.forEach((row) => {
    selectedItems = handleSnowBallselection(row, selectedItems, checkDisplayed);
   });
  }
 } else if (checkDisplayed === true) {
  if (row?.childRows?.length > 0 && row.isExpanded) {
   row.childRows.forEach((row) => {
    selectedItems = handleSnowBallselection(row, selectedItems, checkDisplayed);
   });
  }
 }

 return selectedItems;
};
