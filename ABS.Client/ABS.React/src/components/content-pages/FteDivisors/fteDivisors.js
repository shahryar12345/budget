import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

import {
  Button,
  TextInput,
  ComboBox,
  InlineNotification,
  TooltipIcon,
  DropdownSkeleton
} from "carbon-components-react";
import { Add20, Favorite16, Information20, Save16, Subtract20 } from "@carbon/icons-react";
import axios from "axios";
import PageHeader from "../../layout/PageHeader";
import {
  getEntityGroupedData,
  getDepartmentHierarchyGroupedData,
  GetSortedEntityByGroups,
  GetSortedDepartmentByHierarchyGroupe,
  GetSortedJobCodeByGroups,
  getJobCodeGroupedData
} from "../../../helpers/DataTransform/transformData";
import getURL from "./../../../services/api/apiList";
import { parseNumber } from "../../../services/format-service";
import { fetchFteDivisors } from '../../../core/_actions/StructureTableActions';

import SingleSelectModal from '../../shared/single-select/single-select-with-modal';
import './_fteDivisors.scss';
import { makeApiRequest } from '../../../services/api';
import { getApiResponseAsync } from "../../../services/api/apiCallerGet";
export const FteDivisors = () => {

  const masterData = useSelector(state => state.MasterData);
  const fteDivisors = useSelector(state => state.StructureTables.FteDivisors);
  const settings = useSelector(state => state.systemSettings);
  const userDetails = useSelector((state) => state.UserDetails);

  const dispatch = useDispatch();
  const history = useHistory();

  const allMonths = [
    { name: 'Jan', fullName: 'january' },
    { name: 'Feb', fullName: 'february' },
    { name: 'Mar', fullName: 'march' },
    { name: 'Apr', fullName: 'april' },
    { name: 'May', fullName: 'may' },
    { name: 'Jun', fullName: 'june' },
    { name: 'Jul', fullName: 'july' },
    { name: 'Aug', fullName: 'august' },
    { name: 'Sep', fullName: 'september' },
    { name: 'Oct', fullName: 'october' },
    { name: 'Nov', fullName: 'november' },
    { name: 'Dec', fullName: 'december' }
  ];

  const getMonths = () => {
    let months = [];

    let fiscalYearObject = masterData.TimePeriods.find((item) => item.timePeriodID === currentState?.fiscalYear);
    let startMonthName = fiscalYearObject?.fiscalStartMonthID.itemTypeCode?.toUpperCase() ?? settings.fiscalStartMonth.toUpperCase();

    const startIndex = allMonths.findIndex(month => {
      let name = month.name.toUpperCase();
      return name === startMonthName
    });
    // assuming we should display a full 12 months
    // const stopIndex = allMonths.find(month => month.name === settings.fiscalEndMonth).index;
    const stopIndex = startIndex > 0 ? startIndex - 1 : 11;

    if (startIndex <= stopIndex) {
      // sequential if years are in order
      for (let i = startIndex; i <= stopIndex; i++) {
        months.push({ name: allMonths[i].name, fullName: allMonths[i].fullName, value: 0 });
      }
    } else {
      // piecewise if year wraps
      for (let i = startIndex; i < 12; i++) {
        months.push({ name: allMonths[i].name, fullName: allMonths[i].fullName, value: 0 });
      }
      for (let i = 0; i <= stopIndex; i++) {
        months.push({ name: allMonths[i].name, fullName: allMonths[i].fullName, value: 0 });
      }
    }
    return months;
  };

  const getDefaultDivisor = () => {
    return {
      department: null,
      jobCode: null,
      months: getMonths(),
      total: 0
    };
  };

  const getDefaultState = () => {
    return {
      fiscalYear: null,
      entity: null,
      divisors: [
        getDefaultDivisor(),
        getDefaultDivisor()
      ]
    }
  }

  const [currentState, setCurrentState] = useState(getDefaultState());
  const [isDirty, setIsDirty] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notificationState, setNotificationState] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [deletedDivisors, setDeletedDivisors] = useState([]);
  const [departmentGroupGridDataStates, setDepartmentGroupGridDataStates] = useState([]);
  const [entityGridDataStates, setentityGridDataStates] = useState([]);
  const [jobCodeGridDataStates, setjobCodeGridDataStates] = useState([]);

  useEffect(() => {
    dispatch(fetchFteDivisors());
  }, []);

  useEffect(() => {
    const listenFn = (location, action) => {
      if (action === 'POP') {
        history.replace(location.pathname, { notification: 'FTE settings saved.' });
      }
    }
    history.listen(listenFn)
  }, [history])

  useEffect(() => {
    if (masterData.Departments.length) {
      getApiResponseAsync("DEPARTMENTSRELATIONSHIPS").then((departmentRelation) => {
        getDepartmentHierarchyGroupedData(masterData.Departments, departmentRelation).then((response) => {
          setDepartmentGroupGridDataStates(response)
        });
      });
    }
  }, [masterData.Departments]);

  useEffect(() => {
    if (masterData.Entites.length) {
      getApiResponseAsync("ENTITYRELATIONSHIPS").then((entityrelationData) => {
        getEntityGroupedData(masterData.Entites, entityrelationData).then((response) => {
          setentityGridDataStates(response);
        });
      });
    }
  }, [masterData.Entites]);

  useEffect(() => {
    if (masterData.JobCodes.length) {
      getApiResponseAsync("JOBCODERELATIONSHIPS").then((jobCoderelationData) => {
        getJobCodeGroupedData(masterData.JobCodes, jobCoderelationData).then((response) => {
          setjobCodeGridDataStates(response);
        });
      });
    }
  }, [masterData.JobCodes]);



  useEffect(() => {
    const isCurrentStateValid = validateCurrentState();
    setIsDirty(isCurrentStateValid);
  }, [currentState]);

  const validateCurrentState = () => {
    // make sure both fiscal year and entity are selected
    if (!currentState.fiscalYear || !currentState.entity) {
      return false;
    }

    // for every divisor row, make sure both department and job code are selected
    // if any divisors do not have department or job code selected, return false
    if (currentState.divisors.some(divisor => !divisor.department || !divisor.jobCode)) {
      return false;
    };

    // no failure conditions, return true
    return true;
  }

  const handleAddSubtractDivisor = (e, action, divisorIndex) => {
    // default button action is to submit the form, so we need to prevent that
    e.preventDefault();

    const updatedDivisors = [
      ...currentState.divisors
    ];

    switch (action) {
      case "add":
        if (divisorIndex === -1) {
          updatedDivisors.push(getDefaultDivisor());
        } else {
          updatedDivisors.splice(divisorIndex + 1, 0, getDefaultDivisor());
        }
        break;
      case "sub":
        // if this divisor was loaded from the database, we want to delete
        // it if we save our changes. Add it to a list for later.
        const deletedDivisor = {
          ...updatedDivisors[divisorIndex],
          isDeleted: true,
          isActive: false
        }
        setDeletedDivisors([
          ...deletedDivisors,
          deletedDivisor
        ])

        if (updatedDivisors.length > 1) {
          updatedDivisors.splice(divisorIndex, 1);
        } else {
          updatedDivisors[divisorIndex] = {
            ...getDefaultDivisor()
          }
        }
        break;
      default:
        break;
    }

    setCurrentState({
      ...currentState,
      divisors: [
        ...updatedDivisors
      ]
    });
  };

  const formatFte = (value) => {
    const decimalPlaces = masterData.ItemDecimalPlaces.find(item => item.itemTypeCode === settings.decimalPlacesFTE)?.itemTypeValue ?? 2;
    return value && !isNaN(value) ? parseFloat(value).toFixed(decimalPlaces) : null;
  }

  const updateCurrentState = (propertyName, propertyValue) => {

    // if we change the time period or entity, reset the deleted items list
    setDeletedDivisors([]);

    const entityID = propertyName === 'entity' ? propertyValue : currentState.entity;
    const fiscalYear = propertyName === 'fiscalYear' ? propertyValue : currentState.fiscalYear;

    const completeKey = entityID && fiscalYear;

    let updatedCurrentStates;
    // if a value for both timePeriod and entity, see if we have any existing divisors
    if (completeKey) {
      const existingDivisors = fteDivisors.filter(divisor => {
        return divisor.timeperiodid === fiscalYear && divisor.entityid === entityID
      });
      if (existingDivisors.length > 0) {

        updatedCurrentStates = {
          ...currentState,
          [propertyName]: propertyValue,
          divisors: [
            ...existingDivisors.map(existingDivisor => {
              const months = [
                ...allMonths.map(month => {
                  return {
                    ...month,
                    //value: formatFte(existingDivisor[month.fullName].toString())
                    value: existingDivisor[month.fullName].toString()
                  }
                })
              ];
              return {
                dataid: existingDivisor.dataid,
                department: existingDivisor.departmentid,
                jobCode: existingDivisor.jobcodeid,
                months: months,
                // total: formatFte(months.reduce((total, month) => {
                //   const value = parseFloat(month.value ?? 0);
                //   return parseFloat(total) + value;
                // }, 0))
                total: months.reduce((total, month) => {
                  const value = parseFloat(month.value ?? 0);
                  return parseFloat(total) + value;
                }, 0)
              }
            })
          ]
        }
      } else {

        updatedCurrentStates = {
          ...currentState,
          [propertyName]: propertyValue,
          divisors: [
            getDefaultDivisor(),
            getDefaultDivisor()
          ]
        }
      }
    } else {
      updatedCurrentStates = {
        ...currentState,
        [propertyName]: propertyValue
      }
    }
    if (propertyName === 'fiscalYear' && propertyValue) {
      // if fiscalYear is changed, reorder the month field according to the selected fiscal year.
      updatedCurrentStates = reorderMonthsAccordingToFiscalYear(updatedCurrentStates, propertyValue);
    } else if (currentState.fiscalYear) {
      updatedCurrentStates = reorderMonthsAccordingToFiscalYear(updatedCurrentStates, currentState.fiscalYear);
    }
    setCurrentState(updatedCurrentStates);
  }

  const reorderMonthsAccordingToFiscalYear = (updatedSates, fiscalYear) => {
    // if we have any divisors
    if (updatedSates.divisors.length > 0) {
      // Now just pick the 1st divisor, beacause order of month will be same for all divisors.
      let divisor = updatedSates.divisors[0];
      let fiscalYearObject = masterData.TimePeriods.find((item) => item.timePeriodID === fiscalYear);
      let startMonthName = fiscalYearObject?.fiscalStartMonthID.itemTypeCode?.toUpperCase()

      const startIndex = divisor.months.findIndex(month => {
        let name = month.name.toUpperCase();
        return name === startMonthName
      });
      // assuming we should display a full 12
      // reorder only if order is different
      if (startIndex > 0) {
        updatedSates.divisors = updatedSates.divisors.map((divisoor) => {
          return {
            ...divisoor,
            months: [...divisoor.months.slice(startIndex, divisoor.months.length), ...divisoor.months.slice(0, startIndex)]
          }
        });
      }
    }
    return updatedSates;
  }

  const updateDivisor = (divisorIndex, itemName, selectedItem) => {

    // create a copy of the divisors
    const updatedDivisors = [
      ...currentState.divisors
    ];

    // update the requested item with the passed in value
    updatedDivisors[divisorIndex][itemName] = selectedItem;

    // replace the fte divisors state
    setCurrentState({
      ...currentState,
      divisors: [
        ...updatedDivisors
      ]
    });
  }

  const handleCancel = () => {
    setCurrentState(getDefaultState());
    setIsDirty(false);
    setIsValid(false);
    setNotificationState(false);
    setDeletedDivisors([]);
  }

  const handleEnterKey = async (e, divisorIndex, monthIndex, fieldType) => {

    // handle enter press
    if (e.which === 13) {
      // Get the current element reference
      var CurrentElement = document.getElementById(e.target.id);
      // Get all Input type reference
      var allInputElements = document.getElementsByTagName("input");
      // Covert HTML Collection type into JS Array.
      let allInputElementsArray = Array.prototype.slice.call(allInputElements);
      // Get Index of currently selected element on the window.
      let CurrentElementIndex = allInputElementsArray.indexOf(CurrentElement);


      // Check for the last element , to avoid the error. 
      // if last element is selected the set the focus to first element.    
      if ((CurrentElementIndex + 1) < allInputElementsArray.length) {
        allInputElementsArray[CurrentElementIndex + 1].focus();
      } else {
        allInputElementsArray[0].focus();
      }
      //let CurrentElement = inputs[i];
      //nextElement.focus();
      if (fieldType === "month") {
        await updateDivisorMonth(CurrentElement.value, divisorIndex, monthIndex)
      } else if (fieldType === "total") {
        await updateDivisorTotal(CurrentElement.value, divisorIndex)
      }
      //CurrentElement.blur();
      //e.preventDefault();    
    }
  }

  const formatDivisors = (divisors) => {
    const fteList = divisors.map(divisor => {
      const formattedDivisor = {
        timePeriodID: currentState.fiscalYear,
        entityID: currentState.entity,
        departmentID: divisor.department,
        jobCodeID: divisor.jobCode,
        january: parseNumber(divisor.months.find(month => month.name === 'Jan')?.value ?? 0),
        february: parseNumber(divisor.months.find(month => month.name === 'Feb')?.value ?? 0),
        march: parseNumber(divisor.months.find(month => month.name === 'Mar')?.value ?? 0),
        april: parseNumber(divisor.months.find(month => month.name === 'Apr')?.value ?? 0),
        may: parseNumber(divisor.months.find(month => month.name === 'May')?.value ?? 0),
        june: parseNumber(divisor.months.find(month => month.name === 'Jun')?.value ?? 0),
        july: parseNumber(divisor.months.find(month => month.name === 'Jul')?.value ?? 0),
        august: parseNumber(divisor.months.find(month => month.name === 'Aug')?.value ?? 0),
        september: parseNumber(divisor.months.find(month => month.name === 'Sep')?.value ?? 0),
        october: parseNumber(divisor.months.find(month => month.name === 'Oct')?.value ?? 0),
        november: parseNumber(divisor.months.find(month => month.name === 'Nov')?.value ?? 0),
        december: parseNumber(divisor.months.find(month => month.name === 'Dec')?.value ?? 0),
        isActive: divisor.isActive ?? true,
        isDeleted: divisor.isDeleted ?? false
      }
      // add ID if divisor has one
      if (divisor.dataid) formattedDivisor.fullTimeEquivalentID = divisor.dataid

      return formattedDivisor;
    });
    return fteList;
  }

  const getNewDivisors = () => {
    const fteList = formatDivisors(currentState.divisors.filter(divisor => !divisor.dataid));
    return fteList;
  }

  const getUpdatedDivisors = () => {
    const updatedList = formatDivisors(currentState.divisors.filter(divisor => divisor.dataid));
    const deletedList = formatDivisors(deletedDivisors);
    return {
      FTEPUT: [
        ...updatedList,
        ...deletedList
      ]
    };
  }

  const handleSave = (closeAfterSaving) => {

    const isCurrentStateValid = validateCurrentState();
    if (isCurrentStateValid) {

      // create request to insert new divisor records
      const newDivisors = getNewDivisors();
      // const insertRequest = axios.post(getURL('FTEDATA'), newDivisors);
      const insertRequest = makeApiRequest('post', getURL('FTEDATA'), newDivisors);


      // create request to update or delete divisor records
      const updatedDivisors = getUpdatedDivisors();
      // const updateRequest = axios.put(getURL('FTEDATA'), updatedDivisors);
      const updateRequest = makeApiRequest('put', getURL('FTEDATA'), updatedDivisors);


      // execute insert/update requests
      axios.all([insertRequest, updateRequest]).then(axios.spread((...responses) => {
        if (responses[0].status === 200 && responses[1].status === 200) {
          setIsValid(true);
          if (closeAfterSaving) {
            history.goBack();
          } else {
            setNotificationState(true);
          }
          // re-fetch state after updating
          dispatch(fetchFteDivisors());
        } else {
          setIsValid(false);
          setNotificationState(true);
        }
      })).catch(error => {
        // TODO: Add log entry here indicating failed communication
        console.error(`Error saving FTE divisors: ${error}`)
        setIsValid(false);
        setNotificationState(false);
      });
    } else {
      setIsValid(false);
      setNotificationState(true);
    }
  }

  const updateDivisorMonth = async (value, divisorIndex, monthIndex) => {

    if (value && isNaN(parseFloat(value))) return;

    // create a copy of the divisors
    const updatedDivisors = [
      ...currentState.divisors
    ];

    // get a reference to the current divisor
    const divisor = updatedDivisors[divisorIndex];

    // update the month value with the current target
    //divisor.months[monthIndex].value = formatFte(value.toString());
    divisor.months[monthIndex].value = value.toString();


    // get the new total amount
    const newTotal = divisor.months.reduce((total, month) => {
      const value = parseFloat(month.value ?? 0);
      return parseFloat(total) + value;
    }, 0);

    //divisor.total = formatFte(newTotal.toString());
    divisor.total = newTotal.toString();

    // replace the fte divisors state
    setCurrentState({
      ...currentState,
      divisors: [
        ...updatedDivisors
      ]
    });

    // on leaving control, set editing back to false
    setIsEditing(false);
  }

  const checkAllMonthsEmpty = async (divisorObject) => {
    let allEmpty = true;
    divisorObject.months.forEach((month) => {
      if (month.value) {
        allEmpty = false;
      }
    });
    return allEmpty;
  }

  const updateDivisorTotal = async (value, divisorIndex) => {

    if (value && isNaN(parseFloat(value))) return;

    // create a copy of the divisors
    const updatedDivisors = [
      ...currentState.divisors
    ];

    // get a reference to the current divisor
    const divisor = updatedDivisors[divisorIndex];

    // get the current total value
    const currentTotal = divisor.total;

    // get the new total value
    //const newTotal = formatFte(value.toString()) ?? 0.00;
    const newTotal = value.toString() ?? 0.00;

    divisor.total = newTotal ?? 0.00;
    if (newTotal !== null) {
      // check, is all month a empty, divide total value equaly across the all months.
      if (checkAllMonthsEmpty(divisor)) {
        divisor.months = divisor.months.map(month => {
          const newValue = newTotal / 12;
          return {
            ...month,
            //value: formatFte(newValue.toString()) ?? 0.00
            value: newValue.toString() ?? 0.00

          };
        });
      } else {
        // we need to prorate the total value over all of the months
        // so, find a new array of values proportional to the current total    
        divisor.months = divisor.months.map(month => {
          const newValue = month.value ? newTotal * month.value / currentTotal : null;
          return {
            ...month,
            //value: formatFte(newValue.toString()) ?? 0.00
            value: newValue.toString() ?? 0.00

          };
        });
      }
    }

    updatedDivisors[divisorIndex] = divisor

    // replace the fte divisors state
    setCurrentState({
      ...currentState,
      divisors: [
        ...updatedDivisors
      ]
    });

    // on leaving control, set editing back to false
    setIsEditing(false);
  }

  return (
    <>
      {userDetails?.FTEDivisorsAP?.View ? <>
        <PageHeader
          heading="FTE divisors"
          icon={<Favorite16 />}
          breadCrumb={[
            {
              text: "FTE divisors ",
              link: "/FteDivisors",
            }
          ]}
        />
        <div className="fte-content">
          <div className="bx--row">
            <div className="bx--col-lg-2 fte-entity-row-item">
              <ComboBox
                id="fiscalYears"
                items={masterData.TimePeriods}
                itemToString={(item) => (item ? item.timePeriodName : '')}
                titleText="Fiscal year"
                onChange={(e) => updateCurrentState('fiscalYear', e.selectedItem?.timePeriodID)}
                placeholder="Choose one"
                selectedItem={masterData.TimePeriods.find((item) => item.timePeriodID === currentState?.fiscalYear) ?? null}
              />
            </div>
            <div className="bx--col-lg-3 fte-entity-row-item">
              <SingleSelectModal
                id="entities"
                data={GetSortedEntityByGroups(masterData.Entites)}
                gridData={entityGridDataStates}
                name="Entity"
                titleText="Entity"
                itemToString={(item) => item ? item.entityCode + " " + item.entityName : ""}
                itemToElement={(item) => item.isGroup ? <span> <strong> {"*"} {item.entityCode + " " + item.entityName}</strong></span> : <span> {item.entityCode + " " + item.entityName}</span>}
                selectedItem={masterData.Entites.find((item) => item.entityID === currentState?.entity) ?? null}
                onChange={(e) => updateCurrentState('entity', e.selectedItem?.entityID)}
                placeholder="Choose one"
                hideGroupsToggle={false}
                hideGroups={false}
                isGroupedData={true} />
            </div>
          </div>
          <>
            {
              currentState.divisors?.map((divisor, divisorIndex) => {
                return (
                  <div key={`divisor-${divisorIndex}`}>
                    {/* DIVISOR DATA ROW  - Can be multiple */}
                    <br />
                    <div className={"bx--row"}>
                      <div className="bx--col-lg-1">
                        {userDetails?.FTEDivisorsAP?.Edit ? <TooltipIcon
                          direction="top"
                          tooltipText="Add a row below."
                          align="start"
                        >
                          <Add20
                            onClick={(e) => {
                              handleAddSubtractDivisor(e, "add", divisorIndex);
                            }}
                          ></Add20>
                        </TooltipIcon> : ""
                        }
                        {userDetails?.FTEDivisorsAP?.Edit ? <TooltipIcon
                          direction="top"
                          tooltipText="Remove the row below."
                          align="start"
                        >
                          <Subtract20
                            onClick={(e) => {
                              handleAddSubtractDivisor(e, "sub", divisorIndex);
                            }}
                          ></Subtract20>
                        </TooltipIcon> : ""}
                      </div>
                    </div>
                    <div className="bx--row fte-months-row">
                      <div className="bx--col-lg-2">
                        {
                          departmentGroupGridDataStates.length ?
                            <SingleSelectModal
                              key={`departments-divisor-${divisorIndex}`}
                              data={GetSortedDepartmentByHierarchyGroupe(masterData.Departments)}
                              gridData={departmentGroupGridDataStates}
                              name="Department"
                              titleText="Department"
                              itemToString={(item) => item ? item.departmentCode + " " + item.departmentName : ""}
                              itemToElement={(item) => item.isGroup ? <span> <strong> {"*"} {item.departmentCode + " " + item.departmentName}</strong></span> : <span> {item.departmentCode + " " + item.departmentName}</span>}
                              selectedItem={masterData.Departments.find((item) => item.departmentID === currentState.divisors[divisorIndex]?.department) ?? null}
                              onChange={(e) => updateDivisor(divisorIndex, 'department', e.selectedItem?.departmentID)}
                              placeholder="Choose one"
                              hideGroupsToggle={false}
                              hideGroups={false}
                              isGroupedData={true}
                              isEdit={userDetails?.FTEDivisorsAP?.Edit} />
                            : <><br /><br /><DropdownSkeleton /></>
                        }
                      </div>
                      <div className="bx--col-lg-2">
                        <SingleSelectModal
                          key={`jobCodes-divisor-${divisorIndex}`}
                          data={GetSortedJobCodeByGroups(masterData.JobCodes)}
                          gridData={jobCodeGridDataStates}
                          modalHeading="Job code"
                          name="jobCode"
                          titleText="Job code"
                          itemToString={(item) => item ? item.jobCodeCode + " " + item.jobCodeName : ""}
                          itemToElement={(item) => item.isGroup ? <span> <strong> {"*"} {item.jobCodeCode + " " + item.jobCodeName}</strong></span> : <span> {item.jobCodeCode + " " + item.jobCodeName}</span>}
                          selectedItem={masterData.JobCodes.find((item) => item.jobCodeID === currentState.divisors[divisorIndex]?.jobCode) ?? null}
                          onChange={(e) => updateDivisor(divisorIndex, 'jobCode', e.selectedItem?.jobCodeID)}
                          placeholder="Choose one"
                          hideGroupsToggle={false}
                          hideGroups={false}
                          isGroupedData={true}
                          isEdit={userDetails?.FTEDivisorsAP?.Edit}
                        />
                      </div>
                      {divisor.months.map((month, monthIndex) => {
                        return (
                          <div className="bx--col-lg">
                            <div className={"fte-month-label"}>{month.name}</div>
                            <TextInput
                              id={`month-${divisorIndex}-${monthIndex}-${divisor.dataid ?? 0}-${currentState.fiscalYear ?? 'fiscalYear'}-${currentState.entity ?? 'entity'}-${divisor.department ?? "department"}-${divisor.jobCode ?? "jobCode"}`}
                              key={`month-${divisorIndex}-${monthIndex}-${divisor.dataid ?? 0}-${currentState.fiscalYear ?? 'fiscalYear'}-${currentState.entity ?? 'entity'}-${divisor.department ?? "department"}-${divisor.jobCode ?? "jobCode"}`}
                              className={"fte-month"}
                              value={!isEditing ? formatFte(month.value) ?? 0.00 : null}
                              type="number"
                              onFocus={() => setIsEditing(true)}
                              onBlur={(e) => updateDivisorMonth(e.currentTarget.value, divisorIndex, monthIndex)}
                              onKeyDown={(e) => handleEnterKey(e, divisorIndex, monthIndex, "month")}
                              disabled={!userDetails?.FTEDivisorsAP?.Edit}
                            />
                          </div>
                        );
                      })}
                      <div className="bx--col-lg">
                        <div style={{ display: 'inline-block' }}>
                          <span className={"fte-month-label"}>Total</span>
                          <TooltipIcon className="fte-inline-tooltip"
                            direction="top"
                            align="end"
                            titleText="Total" tooltipText="When you type in a Total value and press Enter, the value is prorated across the months.">
                            <Information20 className="fte-inline-tooltip-icon" />
                          </TooltipIcon>
                        </div>
                        <TextInput
                          id={`total-${divisorIndex}-${divisor.total}`}
                          key={`total-${divisorIndex}-${divisor.total}`}
                          className={"fte-month-total"}
                          value={!isEditing ? formatFte(divisor.total) ?? 0.00 : null}
                          type="number"
                          onFocus={() => setIsEditing(true)}
                          onBlur={(e) => updateDivisorTotal(e.currentTarget.value, divisorIndex)}
                          onKeyDown={(e) => handleEnterKey(e, divisorIndex, -1, "total")}
                          disabled={!userDetails?.FTEDivisorsAP?.Edit}
                        />
                      </div>
                    </div>
                  </div>
                )
              }
              )}
          </>
          <br />
          <div className={"bx--row"}>
            <div className="bx--col-lg">
              {userDetails?.FTEDivisorsAP?.Edit ? <TooltipIcon
                direction="top"
                tooltipText="Add a row below."
                align="start"
              >
                <Add20
                  onClick={(e) => {
                    handleAddSubtractDivisor(e, "add", -1);
                  }}
                ></Add20>
              </TooltipIcon> : ""}
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          {notificationState &&
            <InlineNotification
              title={isValid ? 'FTE settings saved.' : 'Unable to save FTE settings.'}
              kind={isValid ? 'success' : 'error'}
              lowContrast={true}
              className="fte-notification"
              notificationType='inline'
              iconDescription="Close Notification"
              onCloseButtonClick={() => { setNotificationState({ visible: false }) }}
            />}
          <div>
            <div>
              <Button
                className="bx--btn--secondary"
                disabled={!isDirty}
                type="button"
                onClick={() => handleCancel()}
              >
                Cancel
            </Button>
              <Button
                className="bx--btn--tertiary without-left-border"
                renderIcon={Save16}
                disabled={(isDirty && userDetails?.FTEDivisorsAP?.Edit ? false : true)}
                type="Submit"
                onClick={() => handleSave(false)}
              >
                Save
            </Button>
              <Button
                className="bx--btn--primary without-left-border"
                type="submit"
                disabled={(isDirty && userDetails?.FTEDivisorsAP?.Edit ? false : true)}
                onClick={() => handleSave(true)}
              >
                Save and close
            </Button>
            </div>
          </div>
        </div>
      </> : " "}
    </>
  );
}

export default FteDivisors;