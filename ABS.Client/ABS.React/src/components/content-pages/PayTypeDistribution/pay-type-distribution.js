import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Favorite16 } from "@carbon/icons-react";
import PageHeader from "../../layout/PageHeader";
import { useHistory } from "react-router-dom";
import SingleSelectModal from "../../shared/single-select/single-select-with-modal";
import { GetSortedPayTypeByGroups, getPayTypeGroupedData } from "../../../helpers/DataTransform/transformData";
import PayTypeDistributionGrid from "../PayTypeDistribution/pay-type-distribution-grid";
import { getApiResponseAsync } from "../../../services/api/apiCallerGet";

const PayTypeDistribution = ({ match }) => {
  const initialStates = {
    showNotification: false,
    notificationKind: "",
    notificationTitle: "",
    disabledAddButton: true,
    productivePayTypeData: [],
    nonProductivePayTypeData: [],
    productiveTypeSelected: "",
    nonProductiveTypeSelected: "",
    invalid: false,
    invalidText: "",
  };
  const history = useHistory();
  const [localState, SetlocalState] = useState(initialStates);
  const masterData = useSelector((state) => state.MasterData);
  const userDetails = useSelector((state) => state.UserDetails);


  const breadCrumb = [];

  const handleChange = (value, controlName) => {
    let UpdatedlocalState = localState;
    UpdatedlocalState[controlName] = value;

    if (UpdatedlocalState.productiveTypeSelected && UpdatedlocalState.nonProductiveTypeSelected) {
      if (UpdatedlocalState.productiveTypeSelected == UpdatedlocalState.nonProductiveTypeSelected) {
        UpdatedlocalState.disabledAddButton = true;
        UpdatedlocalState.invalid = true;
        UpdatedlocalState.invalidText = "Productive and non-productive group must be different.";
      } else {
        UpdatedlocalState.disabledAddButton = false;
        UpdatedlocalState.invalid = false;
        UpdatedlocalState.invalidText = "";
      }
    } else {
      UpdatedlocalState.disabledAddButton = true;
      UpdatedlocalState.invalid = false;
      UpdatedlocalState.invalidText = "";
    }
    SetlocalState({ ...UpdatedlocalState });
  };

  const handleAddClick = () => {
    history.push({
      pathname: "/AddPayTypeDistribution",
      state: { productiveGroup: localState.productiveTypeSelected, nonProductiveGroup: localState.nonProductiveTypeSelected },
    });
  };

  const [payTypeGridDataStates, setpayTypeGridDataStates] = useState([]);
  useEffect(() => {
    // add 'JSON.parse(JSON.stringify())' to prevent updates in redux store master data due to referencing.
    let onlyPayTypeGroups = JSON.parse(JSON.stringify(GetSortedPayTypeByGroups(masterData.PayTypes))).filter((item) => {
      return item.isGroup === true;
    });

    getApiResponseAsync("PAYTYPESRELATIONSHIPS").then((payTyperelationData) => {
      getPayTypeGroupedData([...onlyPayTypeGroups], payTyperelationData).then((response) => {
        setpayTypeGridDataStates(response);
      });
    });

    SetlocalState({
      ...localState,
      productivePayTypeData: [...onlyPayTypeGroups],
      nonProductivePayTypeData: [...onlyPayTypeGroups],
    });
  }, [masterData.PayTypes]);

  return (
    <> {userDetails?.defaultPayTypeDistributionsAP?.View && <div>
      <PageHeader
        heading={"Pay type distributions"}
        icon={<Favorite16 />}
        breadCrumb={[
          {
            text: "Pay type distributions",
            link: "/PayTypeDistribution",
          }
        ]}
        notification={history?.location?.state?.notification} />

      <div className={"bx--row"}>
        <div className={"bx--col-lg"}>
          <div className={"bx--row"}>
            <div className={"bx--col-lg-4"}>
              <span style={{ color: "grey" }}>{"Productive pay type group"}</span>
            </div>
            <div className={"bx--col-lg-4"}>
              <span style={{ color: "grey" }}>{"Non-productive pay type group"}</span>
            </div>
          </div>
          <div className={"bx--row"}>
            <div className={"bx--col-lg-4"}>
              <SingleSelectModal
                id={"productivePayTypesDropDown"}
                data={localState.productivePayTypeData}
                gridData={payTypeGridDataStates}
                invalid={localState.invalid}
                invalidText={localState.invalidText}
                placeholder="Choose one"
                modalHeading="Pay type"
                name="payType"
                itemToString={(item) => (item ? item.payTypeCode + " " + item.payTypeName : "")}
                selectedItem={masterData.PayTypes.find((item) => item.payTypeID === localState.productiveTypeSelected)}
                light={false}
                itemToElement={(item) =>
                  item.isGroup ? (
                    <span>
                      {" "}
                      <strong>
                        {" "}
                        {"*"} {item.payTypeCode + " " + item.payTypeName}
                      </strong>
                    </span>
                  ) : (
                      <span> {item.payTypeCode + " " + item.payTypeName}</span>
                    )
                }
                onChange={(e) => handleChange(e.selectedItem ? e.selectedItem.payTypeID : "", "productiveTypeSelected")}
                hideGroupsToggle={false}
                hideGroups={false}
                isGroupedData={true}
              />
            </div>
            <div className={"bx--col-lg-4"}>
              <SingleSelectModal
                id={"nonproductivePayTypesDropDown"}
                data={localState.nonProductivePayTypeData}
                gridData={payTypeGridDataStates}
                invalid={localState.invalid}
                invalidText={localState.invalidText}
                placeholder="Choose one"
                modalHeading="Pay type"
                name="payType"
                itemToString={(item) => (item ? item.payTypeCode + " " + item.payTypeName : "")}
                selectedItem={masterData.PayTypes.find((item) => item.payTypeID === localState.nonProductiveTypeSelected)}
                light={false}
                itemToElement={(item) =>
                  item.isGroup ? (
                    <span>
                      {" "}
                      <strong>
                        {" "}
                        {"*"} {item.payTypeCode + " " + item.payTypeName}
                      </strong>
                    </span>
                  ) : (
                      <span> {item.payTypeCode + " " + item.payTypeName}</span>
                    )
                }
                onChange={(e) => handleChange(e.selectedItem ? e.selectedItem.payTypeID : "", "nonProductiveTypeSelected")}
                hideGroupsToggle={false}
                hideGroups={false}
                isGroupedData={true}
              />
            </div>
          </div>
          <div className={"bx--row"}>
            <div className={"bx--col-lg-10"}>
              <PayTypeDistributionGrid
                disabledAddButton={localState.disabledAddButton}
                addButtonClick={handleAddClick}
                isEdit={userDetails?.defaultPayTypeDistributionsAP?.Edit ? userDetails?.defaultPayTypeDistributionsAP?.Edit : false}
                isDelete={userDetails?.defaultPayTypeDistributionsAP?.Delete ? userDetails?.defaultPayTypeDistributionsAP?.Delete : false}
                isAdd={userDetails?.defaultPayTypeDistributionsAP?.Add ? userDetails?.defaultPayTypeDistributionsAP?.Add : false}
              ></PayTypeDistributionGrid>
            </div>
          </div>
        </div>
      </div>
    </div>
    } </>
  );
};
export default PayTypeDistribution;
