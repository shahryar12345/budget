import React, { Component } from "react";
import { connect } from "react-redux";
import {
  updateSystemSettings,
  updateSystemSettingsDB,
} from "../../../core/_actions/SystemSettingActions";

import {
  Checkbox,
  RadioButton,
  RadioButtonGroup,
  Form,
  Button,
  Tabs,
  Tab,
  Dropdown,
  InlineNotification
} from "carbon-components-react";
import { Save16, Favorite16 } from "@carbon/icons-react";
import PageHeader from "../../layout/PageHeader";
import itemsDateFormat from "../MasterData/itemDateFormat";
import itemDecimalPlaces from "../MasterData/itemDecimalPlaces";
import getURL from "./../../../services/api/apiList"
import axios from "axios";
import { makeApiRequest } from "../../../services/api";

const checkboxCurrency = {
  id: "xc_Currency",
  className: "bx--checkbox-wrapper",
  labelText: "Show amount symbol ($)",
};

const checkboxCommans = {
  id: "xc_Commas",
  className: "bx--checkbox-wrapper",
  labelText: "Show commas (e.g., 1,000.00)",
};

const RadioButtonProps = {
  className: "bx--redColor",
};

class AddSystemSettings extends Component {

  constructor(props) {
    super(props);
    this.state = { ...this.props.systemSettings, showNotification: false, UserID: 1, isDirty: false, hasBeenUpdated: false };
  }

  componentWillReceiveProps(props) {
    this.setState({ ...this.state, ...props.systemSettings, showNotification: false });
  }

  componentDidMount() {
    const settingsComponent = this;

    // this is executed when history.goBack is executed
    // we want to set the notification when user clicks "Close and save", but not for Cancel
    // notification: "Settings saved" is used by the PageHeader control
    // if the user clicked Cancel, settingsComponent.state.hasBeenUpdated will be false, so nullify the state for the location we are bringing the user back to just incase the user previously clicked "Save and close"
    const listenFn = (location, action) => {
      if (action === 'POP' && settingsComponent.state.hasBeenUpdated) {
        settingsComponent.setState({ ...settingsComponent.state, hasBeenUpdated: false });
        settingsComponent.props.history.replace(location.pathname, { notification: 'Settings saved.' });
      }
      else if (action === "POP" && !settingsComponent.state.hasBeenUpdated) {
        settingsComponent.props.history.replace(location.pathname, null);
      }
    }

    this.props.history.listen(listenFn);

  }

  handleRadio = (e, controlID) => {
    this.setState({ ...this.state, [controlID]: e.target.value, isDirty: true });
  };
  handleCombo = (e, controlID) => {
    this.setState({ ...this.state, [controlID]: e.selectedItem.value, isDirty: true });
  };

  handleCheckBoxChange = (e) => {
    const updatedValue = e.target.checked === true ? "True" : "False";
    this.setState({ ...this.state, [e.target.id]: updatedValue, isDirty: true });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // axios.post(getURL('SystemSettings'), this.state).then((response) => {
    makeApiRequest('post', getURL('SystemSettings'), this.state).then((response) => {
      this.props.updateSystemSettings(this.state);
      if (response.status == 200 && response.data.status == "success") {
        this.setState({ ...this.state, showNotification: true, notificationTitle: "Settings saved", notificationType: 'success', isDirty: false })
      }
      else {
        this.setState({ ...this.state, showNotification: true, notificationTitle: "Unable to save settings", notificationType: 'error' })
      }
    })
  };

  handleSaveAndClose = (e) => {
    // set a reference to the component
    const settingsComponent = this;
    e.preventDefault();
    const settings = { decimalPlacesAmounts: settingsComponent.state.decimalPlacesAmounts, decimalPlacesFTE: settingsComponent.state.decimalPlacesFTE, decimalPlacesHours: settingsComponent.state.decimalPlacesHours, decimalPlacesPercentValues: settingsComponent.state.decimalPlacesPercentValues, decimalPlaceStatistics: settingsComponent.state.decimalPlaceStatistics, fiscalEndMonth: settingsComponent.state.fiscalEndMonth, fiscalStartMonth: settingsComponent.state.fiscalStartMonth, fiscalStartMonthDateFormat: settingsComponent.state.fiscalStartMonthDateFormat, rd_negativeValues: settingsComponent.state.rd_negativeValues, UserID: settingsComponent.state.UserID, xc_Commas: settingsComponent.state.xc_Commas, xc_Currency: settingsComponent.state.xc_Currency, list: settingsComponent.state.list };
    // axios.post(getURL('SystemSettings'), settings).then((response) => {
    makeApiRequest('post', getURL('SystemSettings'), settings).then((response) => {
      this.props.updateSystemSettings(settings);
      settingsComponent.setState({ ...settingsComponent.state, hasBeenUpdated: true });
      if (response.status == 200 && response.data.status == "success") {
        this.props.history.goBack();
      }
      else {
        settingsComponent.setState({ ...settingsComponent.state, showNotification: true, notificationTitle: "Unable to save settings", notificationType: 'error' })
      }
    });
  };

  handleCancel = () => {
    this.setState({ ...this.state, hasBeenUpdated: false });
    this.props.history.goBack();
  }

  render() {
    const { isDirty } = this.state;
    return (
      <div>
        <PageHeader heading="System settings" icon={<Favorite16 />} />

        <Tabs>
          <Tab className="bx--tabs" label="Budgeting">
            <Form id="FrmUpdateSystemSettings" onSubmit={this.handleSubmit}>
              <div className="bx--content-switcher" />
              <h4>Dates</h4>{" "}
              <div className="bx--row">
                <div className="bx--col-lg-3">
                  {" Date format "}
                  <br />
                  <br />
                  <Dropdown
                    id="fiscalStartMonthDateFormat"
                    items={itemsDateFormat}
                    itemToString={(item) => (item ? item.text : "")}
                    onChange={(e) => {
                      this.handleCombo(e, "fiscalStartMonthDateFormat");
                    }}
                    selectedItem={itemsDateFormat.find(
                      (x) =>
                        x.value ===
                        this.state.fiscalStartMonthDateFormat
                    )}
                  />
                </div>
              </div>
              <br />
              <br />
              <br />
              <div>
                <h4>Decimal places</h4>
                <div className="bx--row">
                  <div className="bx--col">
                    {" Number of decimal places for statistics  "}
                    <br /> <br />
                    <Dropdown
                      id="decimalPlaceStatistics"
                      items={itemDecimalPlaces}
                      itemToString={(item) => (item ? item.text : "")}
                      onChange={(e) => {
                        this.handleCombo(e, "decimalPlaceStatistics");
                      }}
                      selectedItem={itemDecimalPlaces.find(
                        (x) =>
                          x.value ===
                          this.state.decimalPlaceStatistics
                      )}
                    />
                  </div>
                  <div className="bx--col">
                    {" Number of decimal places for amounts  "}
                    <br /> <br />
                    <Dropdown
                      id="decimalPlacesAmounts"
                      items={itemDecimalPlaces}
                      itemToString={(item) => (item ? item.text : "")}
                      onChange={(e) => {
                        this.handleCombo(e, "decimalPlacesAmounts");
                      }}
                      selectedItem={itemDecimalPlaces.find(
                        (x) =>
                          x.value === this.state.decimalPlacesAmounts
                      )}
                    />
                    <br />
                    <Checkbox
                      {...checkboxCurrency}
                      onClick={this.handleCheckBoxChange}
                      checked={
                        this.state.xc_Currency === "True"
                          ? true
                          : false
                      }
                    />
                    <Checkbox
                      {...checkboxCommans}
                      onClick={this.handleCheckBoxChange}
                      checked={
                        this.state.xc_Commas === "True" ? true : false
                      }
                    />
                  </div>
                  <div className="bx--col">
                    {" Number of decimal places for FTEs  "}
                    <br />
                    <br />
                    <Dropdown
                      id="decimalPlacesFTE"
                      items={itemDecimalPlaces}
                      itemToString={(item) => (item ? item.text : "")}
                      onChange={(e) => {
                        this.handleCombo(e, "decimalPlacesFTE");
                      }}
                      selectedItem={itemDecimalPlaces.find(
                        (x) => x.value === this.state.decimalPlacesFTE
                      )}
                    />
                  </div>
                  <div className="bx--col">
                    {" Number of decimal places for hours  "}
                    <br />
                    <br />
                    <Dropdown
                      id="decimalPlacesHours"
                      items={itemDecimalPlaces}
                      itemToString={(item) => (item ? item.text : "")}
                      initialSelectedItem={itemDecimalPlaces.find(
                        (x) =>
                          x.value === this.state.decimalPlacesHours
                      )}
                      onChange={(e) => {
                        this.handleCombo(e, "decimalPlacesHours");
                      }}
                      selectedItem={itemDecimalPlaces.find(
                        (x) =>
                          x.value === this.state.decimalPlacesHours
                      )}
                    />
                  </div>
                </div>
                <br />
                <br />
                <br />
                <div className="bx--row">
                  <div className="bx--col-lg-3">
                    {" Number of decimal places for percent values  "}
                    <br />
                    <br />

                    <Dropdown
                      id="decimalPlacesPercentValues"
                      items={itemDecimalPlaces}
                      itemToString={(item) => (item ? item.text : "")}
                      onChange={(e) => {
                        this.handleCombo(e, "decimalPlacesPercentValues");
                      }}
                      selectedItem={itemDecimalPlaces.find(
                        (x) =>
                          x.value ===
                          this.state.decimalPlacesPercentValues
                      )}
                    />
                  </div>
                </div>
                <br />
                <br />
              </div>
              <div>
                <div className="bx--content-switcher" />
                <h4>Negative values</h4>
                <div className="bx--row">
                  <div className="bx--col-lg-3">
                    {" Display negative values "}
                    <RadioButtonGroup
                      id="rd_negativeValues"
                      orientation="vertical"
                      valueSelected={this.state.rd_negativeValues}
                    >
                      <RadioButton
                        id="rd_negativeVal01"
                        value="withSign"
                        labelText="-xx"
                        onClick={(e) => {
                          this.handleRadio(e, "rd_negativeValues");
                        }}
                      />
                      <RadioButton
                        id="rd_negativeVal02"
                        value="withBracket"
                        labelText="(xx)"
                        onClick={(e) => {
                          this.handleRadio(e, "rd_negativeValues");
                        }}
                      />
                      <RadioButton
                        {...RadioButtonProps}
                        id="rd_negativeVal03"
                        value="redSign"
                        labelText="-xx"
                        onClick={(e) => {
                          this.handleRadio(e, "rd_negativeValues");
                        }}
                      />
                      <RadioButton
                        {...RadioButtonProps}
                        id="rd_negativeVal04"
                        value="redBracket"
                        labelText="(xx)"
                        onClick={(e) => {
                          this.handleRadio(e, "rd_negativeValues");
                        }}
                      />
                    </RadioButtonGroup>{" "}
                  </div>
                </div>
              </div>
              <br />
              <br />
              {this.state.showNotification &&
                <InlineNotification
                  title={this.state.notificationTitle}
                  kind={this.state.notificationType}
                  lowContrast={true}
                  className="add-budgetversion-notification"
                  notificationType='inline'
                  iconDescription="Close Notification"
                  onCloseButtonClick={() => { this.setState({ ...this.state, showNotification: false }) }}
                />}
              <div>
                <div>
                  <Button
                    className="bx--btn--secondary"
                    type="button"
                    onClick={this.handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bx--btn--tertiary without-left-border"
                    renderIcon={Save16}
                    disabled={!isDirty}
                    type="Submit"
                    onClick={this.handleSubmit}
                  >
                    Save
									</Button>

                  <Button id="btnSaveAs" className="bx--btn--primary without-left-border" type="submit" disabled={!isDirty} onClick={this.handleSaveAndClose}>
                    Save and close
									</Button>
                </div>
              </div>
              <div className="bx--row" />
              <div className="bx--row" />
              <div className="bx--row" />
            </Form>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemSettings: state.systemSettings
  }
};

const mapDispatchToProps = {
  updateSystemSettingsDB,
  updateSystemSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddSystemSettings);
