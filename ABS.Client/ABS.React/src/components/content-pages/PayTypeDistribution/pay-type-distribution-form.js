import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Favorite16, Save16, ChevronDown16, ChevronLeft16, ChevronRight16, ChevronUp16 } from "@carbon/icons-react";
import PageHeader from "../../layout/PageHeader";
import { useHistory } from "react-router-dom";
import { getPayTypeGroupedData } from "../../../helpers/DataTransform/transformData";
import { DataTable, NumberInput, TableContainer, Table, TableHead, TableRow, TableBody, TableHeader, TableCell, TooltipIcon, Button, TextInput, InlineNotification } from "carbon-components-react";
import { payTypeHeader } from "../PayTypeDistribution/headers/pay-type-header";
import { SavePayTypeDistribution } from "../../../services/pay-type-distribution-service";
import { GetPayTypeDistribution } from "../../../services/pay-type-distribution-service";
import { fetchPayTypeDistributions } from "../../../core/_actions/MasterDataActions";
import { getApiResponseAsync } from "../../../services/api/apiCallerGet";

const PayTypeDistributionForm = ({ match, disabledAddButton }) => {
  const initialStates = {
    showNotification: false,
    notificationKind: "",
    notificationTitle: "",
    code: "",
    codeIsValid: true,
    codeInValidText: "",
    name: "",
    nameIsValid: true,
    nameInValidText: "",
    description: "",
    saveButtonEnable: false,
  };
  const history = useHistory();
  const [localState, SetlocalState] = useState(initialStates);
  const masterData = useSelector((state) => state.MasterData);
  const [headersState, setHeadersState] = useState({ headers: payTypeHeader });
  const [rowsState, setRowsState] = useState({ rows: [] });
  const [ptdDataState, setPtdDataState] = useState({ rows: [] });
  const userProfile = useSelector((state) => state.UserDetails.UserProfile);

  const dispatch = useDispatch();


  useEffect(() => {
    setPayTypeDistribution();
  }, []);

  const handleNotificationClose = () => {
    SetlocalState({ ...localState, showNotification: false });
  };

  const setPayTypeDistribution = async () => {
    await GetPayTypeDistribution().then((response) => {
      setPtdDataState({ rows: response.data });
    });
  };

  const [payTypeRelationData, setpayTypeRelationData] = useState([]);
  useEffect(() => {
    getApiResponseAsync("PAYTYPESRELATIONSHIPS").then((payTyperelationData) => {
      setpayTypeRelationData(payTyperelationData)
    });
  }, [])

  const setFormValues = async () => {
    if (ptdDataState.rows.length) {
      let payTypeData = ptdDataState.rows.filter((item) => {
        return item.code === match.params.id;
      });
      if (payTypeData.length) {
        const updatedPayType = masterData.PayTypes.map((payType) => {
          return { ...payType, percentage: 0, isExpanded: true, isInValid: false, invalidText: "" };
        });
        getPayTypeGroupedData(updatedPayType, payTypeRelationData).then((response) => {
          const payTypeRelationshipedData = response;

          let productivePayTypeGroup = payTypeRelationshipedData.filter((row) => {
            return (
              row.payTypeID ===
              payTypeData.find((item) => {
                return item.ptdisgroup === true && item.ptdproductive === true;
              })?.paytypeID
            );
          });
          productivePayTypeGroup = productivePayTypeGroup[0];
          productivePayTypeGroup = {
            ...productivePayTypeGroup,
            type: "productiveGroup",
            percentage: getPercentagevalue(productivePayTypeGroup.payTypeID, payTypeData),
          };
          productivePayTypeGroup["childPayTypes"] = updatePayTypePercentagevalue(productivePayTypeGroup.childPayTypes, payTypeData);
          let nonproductivePayTypeGroup = payTypeRelationshipedData.filter((row) => {
            return (
              row.payTypeID ===
              payTypeData.find((item) => {
                return item.ptdisgroup === true && item.ptdproductive === false;
              })?.paytypeID
            );
          });
          nonproductivePayTypeGroup = nonproductivePayTypeGroup[0];
          nonproductivePayTypeGroup = {
            ...nonproductivePayTypeGroup,
            type: "nonProductiveGroup",
            percentage: getPercentagevalue(nonproductivePayTypeGroup?.payTypeID, payTypeData),
          };
          nonproductivePayTypeGroup["childPayTypes"] = updatePayTypePercentagevalue(nonproductivePayTypeGroup.childPayTypes, payTypeData);
          let paytypeIndividual = updatePayTypePercentagevalue(
            payTypeRelationshipedData.filter((paytype) => {
              return paytype.isGroup !== true;
            }),
            payTypeData
          );
          setRowsState({
            rows: [productivePayTypeGroup, nonproductivePayTypeGroup, ...paytypeIndividual],
          });
          SetlocalState({ ...localState, code: payTypeData[0].code, name: payTypeData[0].name, description: payTypeData[0].description });
        });


      } else {
        // No record found of this Pay Type Distribution ID
        history.push("/PayTypeDistribution/");
      }
    }
  };

  const updatePayTypePercentagevalue = (data, payTypeData) => {
    return data.map((item) => {
      return {
        ...item,
        percentage: getPercentagevalue(item.payTypeID, payTypeData),
      };
    });
  };

  const getPercentagevalue = (payTypeId, Data) => {
    return Data.find((item) => {
      return item.paytypeID === payTypeId;
    })?.percentagevalue;
  };

  useEffect(() => {
    if (masterData.PayTypes.length && payTypeRelationData.length && ptdDataState.rows) {
      if (match.params.id) {
        setFormValues();
      } else {
        const updatedPayType = masterData.PayTypes.map((payType) => {
          return { ...payType, percentage: 0, isExpanded: true, isInValid: false, invalidText: "" };
        });

        if (history?.location?.state?.productiveGroup && history?.location?.state?.nonProductiveGroup) {
          getPayTypeGroupedData(updatedPayType, payTypeRelationData).then((response) => {
            const payTypeRelationshipedData = response;
            let paytypeGroupsOnly = payTypeRelationshipedData.filter((paytype) => {
              return paytype.isGroup === true;
            });
            const paytypeIndividual = payTypeRelationshipedData.filter((paytype) => {
              return paytype.isGroup !== true;
            });
            let productivePayTypeGroup = paytypeGroupsOnly.filter((item) => {
              return item.payTypeID == history?.location?.state.productiveGroup;
            });
            productivePayTypeGroup = productivePayTypeGroup[0];
            productivePayTypeGroup = { ...productivePayTypeGroup, type: "productiveGroup" };
            let nonproductivePayTypeGroup = paytypeGroupsOnly.filter((item) => {
              return item.payTypeID == history?.location?.state.nonProductiveGroup;
            });
            nonproductivePayTypeGroup = nonproductivePayTypeGroup[0];
            nonproductivePayTypeGroup = { ...nonproductivePayTypeGroup, type: "nonProductiveGroup" };

            setRowsState({
              rows: [productivePayTypeGroup, nonproductivePayTypeGroup, ...paytypeIndividual],
            });
          });

        } else {
          history.push("/PayTypeDistribution/");
        }
      }
    }
  }, [masterData.PayTypes, payTypeRelationData, ptdDataState.rows]);

  const handlePercentageChange = (value, indexArray) => {
    let updatedValue = value;
    let saveButtonEnable = true;
    if (value === "") {
      updatedValue = 0;
    }
    updatedValue = parseFloat(updatedValue);
    const rows = [...rowsState.rows];
    let row;
    if (indexArray.length === 2) {
      row = { ...rows[indexArray[0]].childPayTypes[indexArray[1]] };
      row["percentage"] = updatedValue;
      rows[indexArray[0]].childPayTypes[indexArray[1]] = row;
      let groupTotal = 0;
      for (let i = 0; i < rows[indexArray[0]].childPayTypes.length; i++) {
        groupTotal = groupTotal + rows[indexArray[0]].childPayTypes[i].percentage;
      }
      row = { ...rows[indexArray[0]] };
      row["percentage"] = parseFloat(groupTotal);
      if (rows[indexArray[0]].type === "productiveGroup" && groupTotal !== 0 && groupTotal !== 100) {
        row["isInValid"] = true;
        row["invalidText"] = "Must be 100";
        saveButtonEnable = false;
      } else if (rows[indexArray[0]].type === "productiveGroup" && (groupTotal === 100 || groupTotal === 0)) {
        row["isInValid"] = false;
        row["invalidText"] = "";
        saveButtonEnable = true;
      }
      rows[indexArray[0]] = row;
    } else if (indexArray.length === 1) {
      row = { ...rows[indexArray[0]] };
      row["percentage"] = updatedValue;
      rows[indexArray[0]] = row;
    }
    setRowsState({ rows: [...rows] });
    SetlocalState({ ...localState, saveButtonEnable: saveButtonEnable });
  };

  const handleChange = (value, controlName) => {
    let updatedState = localState;
    updatedState[controlName] = value;
    validateForm(updatedState);
  };

  const validateForm = (updatedState = localState) => {
    let updatedLocalState = updatedState;
    let invalidCount = 0;
    if (updatedLocalState.code === "") {
      invalidCount++;
      updatedLocalState.codeIsValid = false;
      updatedLocalState.codeInValidText = "Code is required.";
    } else if (
      !match?.params?.id &&
      ptdDataState.rows.find((item) => {
        return item.code.toLowerCase() == updatedLocalState.code.toLowerCase();
      })
    ) {
      invalidCount++;
      updatedLocalState.codeIsValid = false;
      updatedLocalState.codeInValidText = "Code already in use. Enter different code";
    } else {
      updatedLocalState.codeIsValid = true;
      updatedLocalState.codeInValidText = "";
    }
    if (updatedLocalState.name === "") {
      invalidCount++;
      updatedLocalState.nameIsValid = false;
      updatedLocalState.nameInValidText = "Name is required.";
    } else {
      updatedLocalState.nameIsValid = true;
      updatedLocalState.nameInValidText = "";
    }
    SetlocalState({ ...updatedLocalState, saveButtonEnable: invalidCount > 0 ? false : true });
    return invalidCount > 0 ? false : true;
  };

  const handleCancelButton = () => {
    history.push("/PayTypeDistribution/");
  };

  const handleSave = async (action) => {
    if (validateForm()) {
      let payLoad = [];
      rowsState.rows.forEach((row) => {
        let obj = {
          ...row,
          payTypeID: row.payTypeID,
          code: localState.code,
          name: localState.name,
          description: localState.description,
          percentage: row.percentage,
          isActive: true,
          isDeleted: false,
          productive: row["type"] === "productiveGroup" ? true : false,
          isGroup: row["isGroup"] === true ? true : false,
        }
        if (!match?.params?.id) obj = { ...obj, createdby: userProfile?.UserProfileID ? userProfile?.UserProfileID : 0 }
        obj = { ...obj, updatedby: userProfile?.UserProfileID ? userProfile?.UserProfileID : 0 }
        payLoad.push({
          ...obj
        });

        if (row["childPayTypes"]) {
          row.childPayTypes.forEach((childRow) => {
            let obj = {
              ...childRow,
              payTypeID: childRow.payTypeID,
              code: localState.code,
              name: localState.name,
              description: localState.description,
              percentage: childRow.percentage,
              isActive: true,
              isDeleted: false,
              productive: false,
              isGroup: false,
            }
            if (!match?.params?.id) obj = { ...obj, createdby: userProfile?.UserProfileID ? userProfile?.UserProfileID : 0 }
            obj = { ...obj, updatedby: userProfile?.UserProfileID ? userProfile?.UserProfileID : 0 }

            payLoad.push({
              ...obj
            });
          });
        }
      });

      let response = await SavePayTypeDistribution(payLoad, match?.params?.id ? "update" : "add");
      if (response.success) {
        dispatch(fetchPayTypeDistributions());
        switch (action) {
          case "save":
            SetlocalState({ ...localState, showNotification: true, notificationKind: "success", notificationTitle: "Pay type distribution saved." });
            break;
          case "saveAndClose":
            history.push({
              pathname: "/PayTypeDistribution/",
              state: { notification: "Pay type distribution saved." },
            });
            break;
          default:
            break;
        }
      } else {
        SetlocalState({ ...localState, showNotification: true, notificationKind: "error", notificationTitle: "Error in saving pay type distribution." });
      }
    }
  };

  const onHeaderIconClick = (e, headerIndex, detailIndex) => {
    e.preventDefault();
    if (headersState.headers[headerIndex].extraDetails.filter((item) => item.isHidden === false).length == 1 && !headersState.headers[headerIndex].extraDetails[detailIndex].isHidden) {
      return;
    }
    var stateCopy = { ...headersState };
    stateCopy.headers = stateCopy.headers.slice();
    stateCopy.headers[headerIndex] = { ...stateCopy.headers[headerIndex] };
    stateCopy.headers[headerIndex].extraDetails = stateCopy.headers[headerIndex].extraDetails.slice();
    stateCopy.headers[headerIndex].extraDetails[detailIndex] = {
      ...stateCopy.headers[headerIndex].extraDetails[detailIndex],
    };
    stateCopy.headers[headerIndex].extraDetails[detailIndex].isHidden = !stateCopy.headers[headerIndex].extraDetails[detailIndex].isHidden;
    setHeadersState(stateCopy);
  };

  const cellIsOverflown = (span, innerText, isStatsCell) => {
    if (span.scrollWidth > span.clientWidth) {
      return true;
    } else if (isStatsCell && innerText.length > 6) {
      return true;
    }
    return false;
  };

  const toggleRows = (e, indexArray) => {
    e.preventDefault();
    switch (indexArray.length) {
      case 1:
        // preventing state mutation
        const rows = [...rowsState.rows];
        const row = { ...rows[indexArray[0]] };
        row.isExpanded = !row.isExpanded;
        rows[indexArray[0]] = row;
        setRowsState({ rows: rows });
        break;
      case 2:
        // preventing state mutation
        const firstLevelRows = [...rowsState.rows];
        const firstLevelRow = { ...firstLevelRows[indexArray[0]] };
        const secondLevelRows = [...firstLevelRow.groupDepartments];
        const secondLevelRow = { ...secondLevelRows[indexArray[1]] };
        secondLevelRow.isExpanded = !secondLevelRow.isExpanded;
        secondLevelRows[indexArray[1]] = secondLevelRow;
        firstLevelRow.groupDepartments = secondLevelRows;
        firstLevelRows[indexArray[0]] = firstLevelRow;
        setRowsState({ rows: firstLevelRows });
        break;
      default:
        break;
    }
  };
  const getCellContent = (header, headerIndex, row, indexArray) => {
    let cellContentList = [];
    let className = "pay-type-cell";
    if (header.key === "payType") {
      header.extraDetails.forEach((detail) => {
        if (!detail.isHidden) {
          if (row.isGroup && "payType" + detail.text === "payTypeName") {
            cellContentList.push(row["payType" + detail.text]); //payTypeCode , // payTypeName row["type"] === "productiveGroup"  nonProductiveGroup
          } else if (!row.isGroup) {
            cellContentList.push(row["payType" + detail.text]);
          }
        }
      });
      if (row.isGroup) {
        cellContentList.push(row["type"] === "productiveGroup" ? "(Productive)" : "(Non productive)");
      }
      return (
        <>
          <div className="bx--row">
            {!cellContentList.length || !row.isGroup ? (
              ""
            ) : row.isExpanded ? (
              <div className={`bx--col-lg-1 ${indexArray.length === 2 && row.isGroup ? "hierarchyGroupChevron" : null}`}>
                <ChevronUp16 onClick={(e) => toggleRows(e, indexArray)} className="statistics-table-cell-icon" />
              </div>
            ) : (
              <div className={`bx--col-lg-1 ${indexArray.length === 2 && row.isGroup ? "hierarchyGroupChevron" : null}`}>
                <ChevronDown16 onClick={(e) => toggleRows(e, indexArray)} className="statistics-table-cell-icon" />
              </div>
            )}
            <div className="bx--col-lg-2">
              <div className={`${className} bx--text-truncate--end ${row.isGroup || row.isHierarchy ? "isGroup-txt" : indexArray.length === 3 || indexArray.length === 2 ? "child-text-cell" : null}`}>
                <span
                  onMouseOver={(e) => {
                    // are we in an overflow state?
                    // if not, erase the title so that the tooltip does not show
                    if (!cellIsOverflown(e.target)) {
                      e.target.title = "";
                    }
                  }}
                  title={cellContentList.join(" ")}
                >
                  {cellContentList.join(" ")}
                </span>
              </div>
            </div>
          </div>
        </>
      );
    } else if (header.type === "percentage" && !row.isGroup) {
      return (
        <>
          <div className={"bx--row"}>
            <div className={"bx--col-lg-4 percent-change-textbox-container"}>
              <NumberInput
                id={`percentage -${indexArray.length === 2 ? indexArray[0] + "-" + indexArray[1] : indexArray[0]}`}
                className={"percent-change-textbox percent-change-textbox-Pay-Type"}
                invalidText="Number is not valid"
                max={90000}
                min={-90000}
                step={1}
                value={row["percentage"] ?? 0}
                onChange={(e) => handlePercentageChange(e.imaginaryTarget.value, indexArray)}
                style={{ width: "20.588px", textAlign: "left" }}
              />
            </div>
            <div className={"bx--col-lg-1 percent-icon-container"} style={{ paddingTop: "23px" }}>
              {"%"}
            </div>
          </div>
        </>
      );
    } else if (header.type === "percentage" && row.isGroup) {
      return (
        <>
          <div className={"bx--row"}>
            <div className={"bx--col-lg-4 percent-change-textbox-Pay-Type  percent-change-pay-type-read-only"}>{row["percentage"] ?? "0"}</div>
            <div className={"bx--col-lg-1 percent-icon-container"}>{"%"}</div>
          </div>
          <div className={"bx--row"}>
            <div className={"bx--col-lg-10"}>
              {row["type"] === "productiveGroup" && row.isInValid ? (
                <>
                  <p style={{ color: "red", fontSize: "15px" }}>{row.invalidText}</p>
                </>
              ) : null}
            </div>
          </div>
        </>
      );
    }
  };

  const breadCrumb = [
    {
      text: "Pay type distributions",
      link: "/PayTypeDistribution/",
    },
  ];
  return (
    <div>
      <PageHeader heading={"Add pay type distributions"} icon={<Favorite16 />} breadCrumb={breadCrumb} notification={history?.location?.state?.notification} />

      <div className={"bx--row"}>
        <div className={"bx--col-lg"}>
          <div className={"bx--row"}>
            <div className={"bx--col-lg-3"}>
              <TextInput
                id="code"
                type="text"
                labelText="Code"
                onChange={(e) => {
                  handleChange(e.target.value, "code");
                }}
                invalid={!localState.codeIsValid}
                invalidText={localState.codeInValidText}
                value={localState.code}
                maxLength={15}
                disabled={match?.params?.id}
              />
            </div>
            <div className={"bx--col-lg-5"}>
              <TextInput
                id="name"
                type="text"
                labelText="Name"
                onChange={(e) => {
                  handleChange(e.target.value, "name");
                }}
                invalid={!localState.nameIsValid}
                invalidText={localState.nameInValidText}
                value={localState.name}
              />
            </div>
          </div>
          <div className={"bx--row"}>
            <div className={"bx--col-lg-8"}>
              <TextInput
                id="description"
                type="text"
                labelText="Description (optional)"
                onChange={(e) => {
                  handleChange(e.target.value, "description");
                }}
                value={localState.description}
              />
            </div>
          </div>

          <br />
          <br />
          <div className={"bx--row"}>
            <div className={"bx--col-lg-8"}>
              <p>Pay type groups and pay types to include</p>
            </div>
          </div>
          <div className={"bx--row"}>
            <div className={"bx--col-lg-8"}>
              <DataTable
                headers={headersState.headers}
                locale="en"
                isSortable={false}
                radio={true}
                pagination={true}
                render={({ headers, getHeaderProps, getTableProps }) => (
                  <TableContainer title="">
                    <Table size="compact" {...getTableProps()} className={"mapping-table"}>
                      <TableHead>
                        <TableRow>
                          {headers.map((header, headerIndex) => (
                            <TableHeader {...getHeaderProps({ header })} className={`statistics-table-header ${header.extraDetails ? "statistics-table-textual-header" : "statistics-combobox-header"}`}>
                              {header.header}
                              <br />
                              {header.extraDetails &&
                                header.extraDetails.map((detail, detailIndex) => {
                                  return (
                                    <>
                                      {detail.isHidden ? (
                                        <TooltipIcon className="statistics-table-icon-container" direction="bottom" align="start" tooltipText={detail.showTooltipText}>
                                          <ChevronRight16 className="statistics-table-icon" onClick={(e) => onHeaderIconClick(e, headerIndex, detailIndex)} />
                                        </TooltipIcon>
                                      ) : (
                                        <>
                                          <TooltipIcon className="statistics-table-icon-container" direction="bottom" align="start" tooltipText={detail.hideTooltipText}>
                                            <ChevronLeft16 className="statistics-table-icon" onClick={(e) => onHeaderIconClick(e, headerIndex, detailIndex)} />
                                          </TooltipIcon>{" "}
                                          {detail.text}{" "}
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rowsState.rows.map((firstLevelRow, firstLevelRowIndex) => (
                          <>
                            <TableRow onClick={(e) => (firstLevelRow.isHierarchy || firstLevelRow.isGroup ? toggleRows(e, [firstLevelRowIndex]) : null)}>
                              {headers.map((header, headerIndex) => (
                                <TableCell className={`${firstLevelRow.childRows?.length ? "bold" : ""} ${header.extraDetails ? "" : "text-right-align"}`}>{getCellContent(header, headerIndex, firstLevelRow, [firstLevelRowIndex])}</TableCell>
                              ))}
                            </TableRow>
                            {firstLevelRow.isGroup && firstLevelRow.isExpanded
                              ? firstLevelRow.childPayTypes.map((secondLevelRowInGroup, secondLevelRowIndexInGroup) => (
                                <>
                                  <TableRow>
                                    {headers.map((header, headerIndex) => (
                                      <TableCell className={`${firstLevelRow.childRows?.length ? "bold" : ""} ${header.extraDetails ? "" : "text-right-align"}`}>{getCellContent(header, headerIndex, secondLevelRowInGroup, [firstLevelRowIndex, secondLevelRowIndexInGroup])}</TableCell>
                                    ))}
                                  </TableRow>
                                </>
                              ))
                              : null}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                rows={[]}
              />
            </div>
          </div>
          <br />
          <br />

          <div className={"bx--row"}>
            <div className="bx--col-md-8">
              {localState.showNotification ? (
                <InlineNotification kind={localState.notificationKind} title={localState.notificationTitle} lowContrast={true} notificationType="inline" className="add-budgetversion-notification" iconDescription="Close Notification" onCloseButtonClick={(e) => handleNotificationClose()} />
              ) : (
                <>
                  {" "}
                  <br /> <br />{" "}
                </>
              )}
            </div>
            <div className={"bx--col-lg"}>
              <Button id="btnCancle" kind="secondary" type="button" onClick={() => handleCancelButton()}>
                Cancel
       </Button>
              <Button
                kind="tertiary"
                type="button"
                onClick={(e) => {
                  handleSave("save");
                }}
                renderIcon={Save16}
                disabled={!localState.saveButtonEnable}
              >
                Save
       </Button>
              <Button
                kind="primary"
                type="button"
                onClick={(e) => {
                  handleSave("saveAndClose");
                }}
                disabled={!localState.saveButtonEnable}
              >
                Save and close
       </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PayTypeDistributionForm;
