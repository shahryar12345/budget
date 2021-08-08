import React from "react";
import { shallow, mount } from "enzyme";
import AddSystemSettings from "../AddSystemSettings";
import { Provider, connectAdvanced } from "react-redux";
import store from "../../../../core/_store";
import { shallowToJson } from "enzyme-to-json";
import itemsMonths from "../../MasterData/itemsMonths";
import {
  updateSystemSettings,
  fetchSystemSettings,
  updateSystemSettingsDB,
} from "../../../../Core/_actions/SystemSettingActions";
import {Favorite16} from "@carbon/icons-react";

describe("<AddSystemSettings /> Unit Testing", () => {
  const container = mount(
    <Provider store={store}>
      <AddSystemSettings />
    </Provider>
  );

  it("should match the snapshot of <AddSystemSettings />", () => {
    expect(shallowToJson(container)).toMatchSnapshot();
  });

  it("should have contain single <PageHeader /> <PageFooter /> <Tabs /> <Tab /> <Form />", () => {
    expect(container.find("PageHeader").length).toEqual(1);
    expect(container.find("Tabs").length).toEqual(1);
    expect(container.find("Tab").length).toEqual(1);
    expect(container.find("Form").length).toEqual(1);
  });


  it("Check Tab Element props value", () => {
    expect(container.find("Tab").prop("className")).toEqual("bx--tabs");
    expect(container.find("Tab").prop("label")).toEqual("Budgeting");
  });

  it("Validate Form Props by finding it ID", () => {
    expect(
      container.find("Form[id='FrmUpdateSystemSettings']").prop("id")
    ).toEqual("FrmUpdateSystemSettings");
    expect(container.find("Form").prop("id")).toEqual(
      "FrmUpdateSystemSettings"
    );
  });

  it("should Validate Form Submit", () => {
    let prevented = false;
    container.find("Form[id='FrmUpdateSystemSettings']").simulate("submit", {
      preventDefault: () => {
        prevented = true;
      },
    }); // container
    expect(prevented).toEqual(true);

    container.find("Form[id='FrmUpdateSystemSettings']").prop("onSubmit")({
      preventDefault: () => {
        prevented = true;
      },
    }); // container
    expect(prevented).toEqual(true);
  });

  describe("Validate Change of All Dropdowns in AddSystemSetting", () => {
    const DropDownIds = [
      "fiscalStartMonthDateFormat",
      "decimalPlaceStatistics",
      "decimalPlacesAmounts",
      "decimalPlacesFTE",
      "decimalPlacesHours",
      "decimalPlacesPercentValues",
    ];
    for (let i = 0; i < DropDownIds.length; i++) {
      it("should Validate Change of " + DropDownIds[i] + " Dropdown", () => {
        container
          .find('Dropdown[id="' + DropDownIds[i] + '"]')
          .prop("onChange")({
          selectedItem: {
            value: DropDownIds[i] + "-TEST",
            text: DropDownIds[i] + "-TEST",
          },
        });

        expect(store.getState().systemSettings[DropDownIds[i]]).toEqual(
          DropDownIds[i] + "-TEST"
        );
      });
    }
  });

  describe("Validate Click of All Radio buttons in AddSystemSetting", () => {
    const RadioButtonIds = [
      "rd_negativeVal01",
      "rd_negativeVal02",
      "rd_negativeVal03",
      "rd_negativeVal04",
    ];
    const values = ["withSign", "withBracket", "redSign", "redBracket"];
    for (let i = 0; i < RadioButtonIds.length; i++) {
      it(
        "should validate change of " + RadioButtonIds[i] + " Radio Button",
        () => {
          container
            .find('RadioButton[id="' + RadioButtonIds[i] + '"]')
            .prop("onClick")({
            target: {
              value: values[i],
            },
          });
          expect(
            container
              .find('RadioButton[id="' + RadioButtonIds[i] + '"]')
              .prop("value")
          ).toEqual(values[i]);
        }
      );
    }
  });

  describe("Validate Click of All Checkboxes", () => {
    const CheckBoxesIds = ["xc_Commas", "xc_Currency"];
    for (let i = 0; i < CheckBoxesIds.length; i++) {
      it("should validate Click of " + CheckBoxesIds[i] + " CheckBox", () => {
        container
          .find('Checkbox[id="' + CheckBoxesIds[i] + '"]')
          .prop("onClick")({
          target: {
            checked: false,
            id: CheckBoxesIds[i],
          },
        });
        expect(store.getState().systemSettings[CheckBoxesIds[i]]).toEqual(
          "False"
        );

        container
          .find('Checkbox[id="' + CheckBoxesIds[i] + '"]')
          .prop("onClick")({
          target: {
            checked: true,
            id: CheckBoxesIds[i],
          },
        });
        expect(store.getState().systemSettings[CheckBoxesIds[i]]).toEqual(
          "True"
        );
      });
    }
  });
});
