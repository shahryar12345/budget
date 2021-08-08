import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, TextInput, TooltipIcon } from "carbon-components-react";
import { Information20 } from '@carbon/icons-react';
import FullScreenModal from "../../shared/budget-versions-modal/full-screen-modal";
import {
  fetchBudgetVersions
} from "../../../core/_actions/BudgetVersionsActions";

const SaveAsBudgetVersionModal = ({ isOpen, handleClose, handleSave, title, budgetVersion, fiscalYears, budgetVersionTypes }) => {

  const [newBudgetVersion, setNewBudgetVersion] = useState(budgetVersion);
  const budgetVersions = useSelector((state) => state.BudgetVersions.list);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBudgetVersions);
  });

  const getCurrentBudgetVersionFiscalYear = e => {
    const selectedFiscalYear = fiscalYears.find(fy => fy.itemTypeID === newBudgetVersion.timePeriodID);
    return selectedFiscalYear;
  }

  const getCurrentBudgetVersionType = () => {
    // set the budget version type (actual, forecast)
    const bvType = budgetVersionTypes.find(type => {
      return type.itemTypeID === newBudgetVersion.budgetVersionTypeID
    });

    if (bvType) {
      return bvType
    }

    return {
      itemDataType: "",
      itemTypeDisplayName: "",
      itemTypeCode: "",
      itemTypeID: "",
      itemTypeKeyword: "",
      itemTypeValue: ""
    }
  }

  const handleCodeChange = e => {
    const { value } = e.target;

    validateBudgetCode(value);
  };

  const handleDescriptionChange = e => {
    const { value } = e.target;
    setNewBudgetVersion({ ...newBudgetVersion, comments: value });
  };

  const handleNameChange = e => {
    const { value } = e.target;
    setNewBudgetVersion({ ...newBudgetVersion, description: value });
  }

  const handleFiscalYearChange = e => {
    const { selectedItem } = e;
    setNewBudgetVersion({ ...newBudgetVersion, timePeriodID: selectedItem.itemTypeID });
  }

  const handleTypeChange = e => {
    const { selectedItem } = e;
    setNewBudgetVersion({ ...newBudgetVersion, budgetVersionTypeID: selectedItem.itemTypeID });
  }

  const validateBudgetCode = code => {
    // validate the new code
    const existingBudget = Object.values(budgetVersions).find(budget => budget.code === code);
    const isInvalid = !code || existingBudget ? true : false;
    setNewBudgetVersion({ ...newBudgetVersion, code: code, codeIsInvalid: isInvalid });
    return isInvalid;
  }
  return (
    <FullScreenModal
      open={isOpen}
      hasScrollingContent={false}
      iconDescription="Close"
      modalAriaLabel={title}
      modalHeading={title}
      onRequestClose={handleClose}
      onRequestSubmit={() => handleSave(newBudgetVersion, true)}
      onSecondarySubmit={handleClose}
      passiveModal={false}
      primaryButtonDisabled={false}
      primaryButtonText="Save"
      secondaryButtonText="Cancel"
    >
      <div className="bx--grid">
        <div className="bx--row">
          <div className="bx--col">
            <TextInput
              id="code"
              type="text"
              invalid={newBudgetVersion.codeIsInvalid}
              invalidText={!newBudgetVersion.code ? 'Code is required.' : 'Code already used. Enter a unique code.'}
              labelText="Code"
              onChange={handleCodeChange}
              defaultValue={newBudgetVersion.code}
            />
          </div>
          <div className="bx--col">
            <TextInput
              id="name"
              type="text"
              invalid={!newBudgetVersion.description}
              invalidText="Name is required."
              labelText="Name "
              value={newBudgetVersion.description}
              onChange={handleNameChange}
            />
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col">
            <TextInput
              id="description"
              type="text"
              labelText="Description "
              onChange={handleDescriptionChange}
              value={newBudgetVersion.comments}
            />
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col">
            <Dropdown
              type="default"
              titleText="Fiscal year "
              onChange={handleFiscalYearChange}
              items={fiscalYears}
              itemToString={(item) => (item ? item.itemTypeTimePeriodName : '')}
              selectedItem={getCurrentBudgetVersionFiscalYear()}
            />
          </div>
          <div className="bx--col">
            <Dropdown
              type="default"
              titleText="Budget version "
              onChange={handleTypeChange}
              items={budgetVersionTypes}
              itemToString={(item) => (item ? item.itemTypeValue : '')}
              selectedItem={getCurrentBudgetVersionType()}
            />
          </div>
          <div className="bx--col-sm-">
            <br />
            <TooltipIcon direction="bottom" tooltipText="After you save a budget version, you cannot change the Budget version type">
              <Information20 className="textbox-icon" />
            </TooltipIcon>
          </div>
        </div>
        <br />
      </div>
    </FullScreenModal>
  );
};

export default SaveAsBudgetVersionModal;
