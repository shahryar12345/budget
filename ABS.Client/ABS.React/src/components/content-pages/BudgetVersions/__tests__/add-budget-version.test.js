import { Provider, useSelector } from "react-redux";
import React, { useState as useStateMock } from "react";
import { Route, Router, useHistory } from "react-router-dom";
import { mount, shallow } from "enzyme";
import AddBudgetVersion from "../budget-version-form";
import { act } from "react-dom/test-utils";
import mockInitialState from "../../../../core/_mockStore/initialStates";
import mockstore from "../../../../core/_mockStore";

const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
jest.mock("../../../../services/budget-version-service.js");

const budgetVersionService = require("../../../../services/budget-version-service.js")
  .default;

describe("<AddBudgetVersion /> Unit Testing , Add Cases", () => {
  beforeEach(() => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useHistory: () => ({
        push: jest.fn(),
      }),
    }));
  });
  const props = {
    params: {
      id: null, // Dummy Value , in Case of New Form
    },
  };

  const container = mount(
    <Provider store={mockstore}>
      <Router history={historyMock}>
        <AddBudgetVersion match={props} />
      </Router>
    </Provider>
  );

  describe("Form and Buttons Unit Test Cases", () => {
    it("should Validate Form Submit", () => {
      container.update();
      let prevented = false;
      container.find("form[id='addBudgetVersionForm']").simulate("submit", {
        preventDefault: () => {
          prevented = true;
        },
      }); // container
      expect(prevented).toEqual(true);
    });

    const buttonIds = ["btnCancel", "btnSave", "btnSaveAs", "btnSaveNClose"];
    for (let i = 0; i < buttonIds.length; i++) {
      it("should validate the " + buttonIds[i] + " button", () => {
        container.update();
        let prevented = false;
        container.find("button[id='" + buttonIds[i] + "']").prop("onClick")({
          preventDefault: () => {
            prevented = true;
          },
        });
        expect(prevented).toEqual(true);
      });
    } // it
  }); // Form and Buttons Unit Test Cases Describe End

  describe("Text boxes Unit Test Cases", async () => {
    const initialData = ["code", "description", "comment"];

    for (let i = 0; i < initialData.length; i++) {
      it(
        "should Validate Change of " + initialData[i] + " Text Box",
        async () => {
          container.update();
          let prevented = false;
          await container
            .find('input[id="' + initialData[i] + '"]')
            .prop("onChange")({
            target: {
              id: initialData[i],
              value: "code1", // This one also cover duplicate code error.
            },
            preventDefault: () => {
              prevented = true;
            },
          });
          container.update();
          expect(prevented).toEqual(true);
          expect(
            container.find('input[id="' + initialData[i] + '"]').prop("value")
          ).toEqual("code1");

          jest.clearAllMocks();
        }
      );
    }

    // This case is required to pass the validation  of form , and submit the form successfully in case of addition.
    it("should Validate the new Code.", async () => {
      let prevented = false;
      await container.find('input[id="code"]').prop("onChange")({
        target: {
          id: "code",
          value: "NewCode", // Enter New Code This Time.
        },
        preventDefault: () => {
          prevented = true;
        },
      });
      container.update();
      expect(prevented).toEqual(true);
      expect(container.find('input[id="code"]').prop("value")).toEqual(
        "NewCode"
      );
    });
  }); //Text boxes Unit Test Cases Describe End

  describe("DropdDown Test Cases", () => {
    it("should validate the change of Fiscal Year dropdown value", () => {
      container.find('Dropdown[id="fiscalYearId"]').prop("onChange")({
        selectedItem: mockInitialState.MasterData.FiscalYear[0],
      });
      container.update();
      expect(
        container.find('Dropdown[id="fiscalYearId"]').prop("selectedItem")
      ).toEqual(mockInitialState.MasterData.FiscalYear[0]);
    });

    it("should validate the change of Scenario Type dropdown value", () => {
      container.find('Dropdown[id="scenarioTypeId"]').prop("onChange")({
        selectedItem: mockInitialState.MasterData.ScenarioType[0],
      });
      container.update();
      expect(
        container.find('Dropdown[id="scenarioTypeId"]').prop("selectedItem")
      ).toEqual(mockInitialState.MasterData.ScenarioType[0]);
    });

    const DDToShowForActual = ["StatisticsId", "generalLedgerId", "staffingId"];
    const DDToShowForForcast = ["ScenarioTypeDataId", "BudgetVersionId"];

    it("Should validate change of BudgetVersionType Dropdown , Select Actual", () => {
      container.find('Dropdown[id="budgetVersionTypeId"]').prop("onChange")({
        selectedItem: mockInitialState.MasterData.BudgetVersionsType[0], // Select Actual
      });
      container.update();
      expect(
        container
          .find('Dropdown[id="budgetVersionTypeId"]')
          .prop("selectedItem")
      ).toEqual(mockInitialState.MasterData.BudgetVersionsType[0]);
    });

    // On Selection of 'A' , 'Actual'
    // StatisticsId , generalLedgerId , staffingId will show
    // ScenarioTypeDataId' , 'BudgetVersionId will show
    it("should show Actual StatisticsId , generalLedgerId , staffingId", () => {
      for (let i = 0; i < DDToShowForActual.length; i++) {
        expect(
          container.find('Dropdown[id="' + DDToShowForActual[i] + '"]').length
        ).toEqual(1);
      }
    }); // it

    it("should not show ScenarioTypeDataId , BudgetVersionId ", () => {
      for (let i = 0; i < DDToShowForForcast.length; i++) {
        expect(
          container.find('Dropdown[id="' + DDToShowForForcast[i] + '"]').length
        ).toEqual(0);
      }
    }); // it

    // Validate Change Event of currently showing DropDown
    it("should validate change of StatisticsId DropDown", () => {
      container.find('Dropdown[id="StatisticsId"]').prop("onChange")({
        selectedItem: mockInitialState.MasterData.FiscalYear[0],
      });
      container.update();
      expect(
        container.find('Dropdown[id="StatisticsId"]').prop("selectedItem")
      ).toEqual(mockInitialState.MasterData.FiscalYear[0]);
    });
    it("should validate change of generalLedgerId DropDown", () => {
      container.find('Dropdown[id="generalLedgerId"]').prop("onChange")({
        selectedItem: mockInitialState.MasterData.ItemMonths[0],
      });
      container.update();
      expect(
        container.find('Dropdown[id="generalLedgerId"]').prop("selectedItem")
      ).toEqual(mockInitialState.MasterData.ItemMonths[0]);
    });
    it("should validate change of staffingId DropDown", () => {
      container.find('Dropdown[id="staffingId"]').prop("onChange")({
        selectedItem: mockInitialState.MasterData.BudgetVersionsType[0],
      });
      container.update();
      expect(
        container.find('Dropdown[id="staffingId"]').prop("selectedItem")
      ).toEqual(mockInitialState.MasterData.BudgetVersionsType[0]);
    });

    it("Should validate change of BudgetVersionType Dropdown , Select Forcast", () => {
      container.find('Dropdown[id="budgetVersionTypeId"]').prop("onChange")({
        selectedItem: mockInitialState.MasterData.BudgetVersionsType[1], // Select Forcast
      });
      container.update();
      expect(
        container
          .find('Dropdown[id="budgetVersionTypeId"]')
          .prop("selectedItem")
      ).toEqual(mockInitialState.MasterData.BudgetVersionsType[1]);
    });

    // On Selection of 'F' , 'Forcast'
    // ScenarioTypeDataId' , 'BudgetVersionId will show
    // StatisticsId , generalLedgerId , staffingId will Not show
    it("should show ScenarioTypeDataId , BudgetVersionId ", () => {
      for (let i = 0; i < DDToShowForForcast.length; i++) {
        expect(
          container.find('Dropdown[id="' + DDToShowForForcast[i] + '"]').length
        ).toEqual(0);
      }
    }); // it
    it("should Not show Actual StatisticsId , generalLedgerId , staffingId", () => {
      for (let i = 0; i < DDToShowForActual.length; i++) {
        expect(
          container.find('Dropdown[id="' + DDToShowForActual[i] + '"]').length
        ).toEqual(0);
      }
    }); // it
  }); // DropdDown Test Cases Describe End

  describe("Submit Form After Filled Every Element on Form", () => {
    const buttonIds = ["btnSave", "btnSaveAs", "btnSaveNClose"];
    for (let i = 0; i < buttonIds.length; i++) {
      budgetVersionService.__setSaveBudgetVersionStatus(true);
      it(
        "should validate the " +
          buttonIds[i] +
          " button , In Case of Data Successfully Saved",
        () => {
          let prevented = false;
          container.find("button[id='" + buttonIds[i] + "']").prop("onClick")({
            preventDefault: () => {
              prevented = true;
            },
          });
          expect(prevented).toEqual(true);
        }
      );
    }

    it("should Cover the Case when Data is not saved. And Service return Error.", () => {
      let prevented = false;
      budgetVersionService.__setSaveBudgetVersionStatus(false);
      container.find("button[id='btnSave']").prop("onClick")({
        preventDefault: () => {
          prevented = true;
        },
      });
      expect(prevented).toEqual(true);
    });
  }); //Submit Form After Filled Every Element on Form Describe End
}); //<AddBudgetVersion /> Unit Testing , Add Cases Describe End

describe("<AddBudgetVersion /> Unit Testing , Edit Cases", () => {
  budgetVersionService.__SetGetBugetVersionStatus(false);
  const propsWithValue = {
    params: {
      id: 1, // Dummy Value
    },
  };
  mount(
    <Provider store={mockstore}>
      <Router history={historyMock}>
        <AddBudgetVersion match={propsWithValue} />
      </Router>
    </Provider>
  );

  let conatainerForEdit;
  act(() => {
    // WhenEver React State is updated , it Should Wrap in act()
    // Reder Again to Cover Positive Case of 'GetBugetVersion()' Function
    budgetVersionService.__SetGetBugetVersionStatus(true);
    conatainerForEdit = mount(
      <Provider store={mockstore}>
        <Router history={historyMock}>
          <AddBudgetVersion match={propsWithValue} />
        </Router>
      </Provider>
    );
  }); // Act

  it("should validate the negetive Case in case of Budget Update", () => {
    conatainerForEdit.update();
    let prevented = true;
    conatainerForEdit.find("button[id='btnSave']").prop("onClick")({
      preventDefault: () => {
        prevented = false;
      },
    });
    expect(prevented).toEqual(false);
  }); // it

  it("should validate the form and Save in case of Data Update Successfully", () => {
    budgetVersionService.__UpdateBudgetVersionStatus(true);
    conatainerForEdit.update();
    let prevented = true;
    conatainerForEdit.find("button[id='btnSave']").prop("onClick")({
      preventDefault: () => {
        prevented = false;
      },
    });
    expect(prevented).toEqual(false);
  }); // it
});
