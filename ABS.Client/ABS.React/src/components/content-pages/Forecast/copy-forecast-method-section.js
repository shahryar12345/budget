import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox } from "carbon-components-react";
import SourceSection from "./Forecast-Sub-Sections/source-section";
import TargetSection from "./Forecast-Sub-Sections/target-section";
import CommonSection from "./Forecast-Sub-Sections/common-section";
import { updateForecast } from "../../../core/_actions/ForecastActions";

const CopyForecastMethodSection = ({ sectionIndex  , dimensionGroupedData }) => {
  const state = useSelector((state) => state.ForecastReducer);
  const dispatch = useDispatch();
  const handleChange = (value) => {
    const UpdatedforecastSections = [...state.forecastSections];
    UpdatedforecastSections[sectionIndex].automaticallyUpdate = value;
    dispatch(
      updateForecast({
        ...state,
        forecastSections: [...UpdatedforecastSections],
      })
    );
  };

  return (
    <div className={"section-container"}>
      <div className={"bx--row"}>
        <Checkbox
          id={"AutoUpdateCheckBox-" + sectionIndex}
          labelText={
            'Automatically update values connected by formula (e.g., When "Number  of admissions" changes, update "Patient days")'
          }
          checked={state.forecastSections[sectionIndex].automaticallyUpdate}
          onClick={(e) => {
            handleChange(e.target.checked);
          }}
        />
      </div>

      {/* Source Section of Annualization in child component */}
      {/* prop 'sectionType' value can be "copy" OR "annualization"  */}
      <SourceSection  sectionIndex={sectionIndex} sectionType={"copy"} dimensionGroupedData={dimensionGroupedData}/>

      {/* Target Section of Annualization in child component */}
      <TargetSection  sectionIndex={sectionIndex} sectionType={"copy"} dimensionGroupedData={dimensionGroupedData}/>

      {/* Other field of section */}
      <CommonSection
        sectionIndex={sectionIndex}
        sectionType={"copy"}
      ></CommonSection>
    </div>
  );
};

export default CopyForecastMethodSection;
