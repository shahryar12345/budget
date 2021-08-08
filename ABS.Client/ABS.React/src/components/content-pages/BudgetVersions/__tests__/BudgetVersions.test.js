import React, { useState as useStateMock } from "react";
import { shallow, mount } from "enzyme";
import { Provider, useSelector } from "react-redux";
import mockstore from "../../../../Core/_mockStore";
import mockInitialState from "../../../../Core/_mockStore/initialStates";
import rootReducer from '../../../../Core/_reducers';
import { shallowToJson } from "enzyme-to-json";
import BudgetVersions from "../BudgetVersions";
import DTTable from '../DataGrid/DTTable'
import PageHeader from "../../../layout/PageHeader";
import { useHistory, Route, Router } from "react-router-dom"; 
import { createStore , applyMiddleware, compose} from "redux";
import thunk from 'redux-thunk';
//import mockBudgetVersionActions from '../../../../../__mocks__/BudgetVersionsActions.js'

const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
const location = {showNotification : true};


// jest.mock("../../../../../__mocks__/BudgetVersionsActions.js");

// const BudgetVersionsActions = require("../../../../../__mocks__/BudgetVersionsActions.js").default;


describe("<BudgetVersions /> Unit Testing", () => {
  beforeEach(() => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useHistory: () => ({
        push: jest.fn(),
      }),
    }));
  });
  
  //const deleteBudgetVersions = jest.fn();
  const container = mount(
    <Provider store={mockstore}>
      <Router history={historyMock}>
        <BudgetVersions location={location} 
        //changeBudgetVersions={jest.fn()} deleteBudgetVersions ={deleteBudgetVersions}
        >
            </BudgetVersions>
      </Router>
    </Provider>
  );

  it("should match the snapshot of <BudgetVersions />", () => {

    // mockBudgetVersionActions.changeBudgetVersions.mockImplementationOnce(()=>{
    //   console.log('ssssssss');
    // })

    jest.useFakeTimers(); // This is used to mock the 'SetTimeout' call in called functions below
    console.warn(container.children().props());
    console.warn(container.find(DTTable).prop('onDelete')({e : 'Shahryar'}))  
    container.find(DTTable).prop('onCopy')({e : 'Shahryar'});
    container.find(DTTable).prop('actionsource')({e : 'Shahryar'});
    //expect(mockBudgetVersionActions.changeBudgetVersions).toHaveBeenCalledTimes(3)
    //expect(MockAxios.get).toHaveBeenCalledTimes(3)

    expect(shallowToJson(container)).toMatchSnapshot();

    jest.runAllTimers();
  });
  
  it("Should cover Loader Condition" , ()=>{

    let mockstore;
    mockstore = createStore(
      rootReducer,
      {...mockInitialState , BudgetVersions:{isLoaded: false} },
      compose(applyMiddleware(thunk))
    );

    const container = mount(
      <Provider store={mockstore}>
        <Router history={historyMock}>
          <BudgetVersions location={location} >
              </BudgetVersions>
        </Router>
      </Provider>
    );

  });

});
