import React, { useState as useStateMock } from "react";
import { shallow, mount } from "enzyme";
import { Provider, useSelector } from "react-redux";
import mockstore from "../../../../../Core/_mockStore";
import rootReducer from '../../../../../Core/_reducers';
import mockInitialState from "../../../../../Core/_mockStore/initialStates";
import { shallowToJson } from "enzyme-to-json";
import { createStore } from "redux";

import DTTable, {
  overflowMenuItemClick,
  batchActionClick,
} from "../../DataGrid/DTTable";

import { useHistory, Route, Router } from "react-router-dom";

const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
describe("<DTTable /> Unit Testing", () => {
  beforeEach(() => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useHistory: () => ({
        push: jest.fn(),
      }),
    }));
  });

  const container = mount(
    <Provider store={mockstore}>
      <Router history={historyMock}>
        <DTTable />
      </Router>
    </Provider>
  );

  it("should match the snapshot of <BudgetVersion />", () => {
    expect(shallowToJson(container)).toMatchSnapshot();
  });

  it("should validate the Add Button to Redirect to Budget Version Form", () => {
    container.find("button[id='btnAddBudget']").prop("onClick")();
    expect(historyMock.push.mock.calls[0]).toEqual(["/AddBudgetVersions"]);
  });

  // For Future
                            // it("should validate the change event of Budget version Type Dropdown", () => {
                            //   container.find('Dropdown[id="budgetVersionTypeId"]').prop("onChange")({
                            //     selectedItem: mockInitialState.MasterData.BudgetVersionsType[0], // Select Actual
                            //   });
                            //   container.update();
                            //   console.warn(container.find('Dropdown[id="budgetVersionTypeId"]').props());
                            //   expect(
                            //     container.find('Dropdown[id="budgetVersionTypeId"]').prop("selectedItem")
                            //   ).toEqual(mockInitialState.MasterData.BudgetVersionsType[0]);
                            // });

  // For Future
                    // // // Need to update , incomplete.
                    // it("should validate the page no Change of pagination Component", () => {
                    //   container.find('Pagination[id="paginationBar"]').prop("onChange")({
                    //     page: 2,
                    //   });
                    //   container.update();
                    //   //console.warn(container.find('Pagination[id="paginationBar"]').props())
                    //   //console.warn(container.find('select[id="bx-pagination-select-paginationBar2"]').props())
                    // });

  it("should validate the overflowMenuItemClick() function", () => {
    const e = [
      { itemText: "Open", length: 1 },
      { itemText: "Rename", length: 1 },
      { itemText: "Delete", length: 1 },
      { itemText: "Copy", length: 1 },
      { itemText: null }, // default case
    ];
    const rowid = 5;
    const props = {
      actionsource: jest.fn(),
      onDelete: jest.fn(),
      onCopy: jest.fn(),
    };
    const history = { push: jest.fn() };
    const historyPushArg = ["/BudgetVersion/", "/RenameBudgetVersions"];
    let result;

    for (let i = 0; i < e.length; i++) {
      result = overflowMenuItemClick(e[i], rowid, props, history);
      result();

      if (e[i].itemText == "Open"){
        expect(history.push.mock.calls[i]).toEqual([historyPushArg[i]+ rowid]);
        expect(props.actionsource.mock.calls[0]).toEqual(["overflowmenu"]);
      }
      else if(e[i].itemText == "Rename")
        {
          expect(history.push.mock.calls[i]).toEqual([historyPushArg[i] , rowid]);
          expect(props.actionsource.mock.calls[0]).toEqual(["overflowmenu"]);
        }
       else if (e[i].itemText == "Delete" || e[i].itemText == "Copy") {
        expect(props["on" + e[i].itemText].mock.calls[0]).toEqual([rowid]);
      }
    }
  });

  it("should validate the batchActionClick() function", () => {
    const action = ["open", "rename", "delete", "copy", null]; // null for defaul case
    const props = {
      actionsource: jest.fn(),
      onDelete: jest.fn(),
      onCopy: jest.fn(),
    };
    const history = { push: jest.fn() };
    let selectedRow = [{ id: 1 }, { id: 12 }, { id: 4 }];
    let result;

    //open
    result = batchActionClick(action[0], selectedRow, props, history);
    result();
    expect(history.push.mock.calls[0]).toEqual([
      "/BudgetVersion/" + selectedRow[0].id,
    ]);

    //rename
    result = batchActionClick(action[1], selectedRow, props, history);
    result();
    expect(history.push.mock.calls[1]).toEqual([
      "/RenameBudgetVersions",
      selectedRow,
    ]);

    //delete
    result = batchActionClick(action[2], selectedRow, props, history);
    result();
    expect(props.onDelete.mock.calls[0]).toEqual([[1, 12, 4]]); // Should Delete All Selected Row.

    //copy
    result = batchActionClick(action[3], selectedRow, props, history);
    result();
    expect(props.onCopy.mock.calls[0]).toEqual([[1, 12, 4]]); // Should Delete All Selected Row.

    //Default Case
    result = batchActionClick(action[4], selectedRow, props, history);
    result();
  });

  //Corner Cases for Code Coverage
  it("should validate the component rendering is some Corner Cases.", () => {
    let mockstore;
    mockstore = createStore(
      rootReducer,
      { ...mockInitialState, systemSettings: { fiscalStartMonthDateFormat: 'itemsDateFormat-10' } }
    );
    const container = mount(
      <Provider store={mockstore}>
        <Router history={historyMock}>
          <DTTable />
        </Router>
      </Provider>
    );
  });

}); // Main Describe
