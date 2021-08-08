import React, { useEffect, useState, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TextInput } from "carbon-components-react";
import FullScreenModal from "../../shared/budget-versions-modal/full-screen-modal";

const SaveAsForecastModal = ({ isOpen, handleModalClose, handleSave, title }) => {
  const initialStates = {
    name: "",
    description: "",
    alreadyExistNames : [],
    formInValid : true,
    formErrors : {
      name : {isInValid : false , errorMessage : ""}
    }
  };

  const [localState, setlocalState] = useState(initialStates);
  const state = useSelector((state) => state.ForecastReducer); // gloablState

  const handleChange = (e, controlName) => {
    let formErrors = localState.formErrors
    let formInValid = localState.formInValid;
    // Validate Name fields
    if(controlName === "name")
    {
      let nameField = formErrors.name;
      if(e.target.value === "")
      {
        nameField = {isInValid : true , errorMessage : "Name is required."}
        formInValid = true
      }
      else{
        if(localState.alreadyExistNames.find((item) => item.name.toLowerCase() === e.target.value.toLowerCase()))
        {
          nameField = {isInValid : true , errorMessage : "Name already exist."}
          formInValid = true
        }else
        {
          nameField = {isInValid : false , errorMessage : ""}
          formInValid = false
        }
      }
      formErrors.name = nameField; 
    }
    setlocalState({ ...localState, [controlName]: e.target.value  , formErrors : formErrors , formInValid:formInValid });
  };

  const resetFields = () => {
    setlocalState({...initialStates ,alreadyExistNames: localState.alreadyExistNames});
  }
  useEffect(() => {
    setlocalState({ ...localState,  alreadyExistNames : [...state.forecastModelData]});
  } , [state.forecastModelData]);

  return (
    <div>
      <FullScreenModal
        className='saveas-forecast-modal-container'
        iconDescription="Close"
        modalHeading={title}
        onRequestClose={() => {
          resetFields()
          handleModalClose("showSaveAsModal");
        }}
        onRequestSubmit={() => {
          handleSave(localState);
          resetFields()
          handleModalClose("showSaveAsModal");
        }}
        onSecondarySubmit={() => {
          resetFields();
          handleModalClose("showSaveAsModal");
        }}
        open={isOpen}
        passiveModal={false}
        primaryButtonDisabled={localState.formInValid}
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        selectorPrimaryFocus="[data-modal-primary-focus]"
        size={"lg"}
      >
        <div className={"bx--row"}>
          <div className={"bx--col-lg"}>
            <div className={"bx--row"}>
              {/* <div className={"bx--col-lg-10"}>
                <TextInput
                  id="code"
                  type="text"
                  labelText="Code"
                  // maxLength={15}
                  value={localState.code}
                  onChange={(e) => handleChange(e, "code")}
                />
              </div> */}
            </div>
            <div className={"bx--row"}>
              <div className={"bx--col-lg-12"}>
                <TextInput
                  id="name"
                  type="text"
                  labelText="Name"
                  // maxLength={15}
                  invalid={localState.formErrors?.name.isInValid}
                  invalidText={localState.formErrors?.name.errorMessage}
                  value={localState.name}
                  onChange={(e) => handleChange(e, "name")}
                />
              </div>
            </div>

            <div className={"bx--row"}>
              <div className={"bx--col-lg-12"}>
                <TextInput
                  id="discription"
                  type="text"
                  labelText="Description (optional)"
                  // maxLength={15}
                  value={localState.description}
                  onChange={(e) => handleChange(e, "description")}
                />
              </div>
            </div>

          </div>
        </div>
      </FullScreenModal>
    </div>
  );
};

export default SaveAsForecastModal;
