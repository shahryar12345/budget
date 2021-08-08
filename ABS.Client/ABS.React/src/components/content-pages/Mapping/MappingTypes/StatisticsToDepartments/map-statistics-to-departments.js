import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateMapping } from "../../../../../core/_actions/MappingActions";
import { getOnlyItemOfDimension } from "../../../../../helpers/DataTransform/transformData";
import MapStatisticsToDepartmentsDTable from "./map-statistics-to-departments-DTable";
import SingleSelectModal from "../../../../shared/single-select/single-select-with-modal";
import { DropdownSkeleton } from "carbon-components-react";
const MapStatisticsToDepartments = ({ match, isEdit }) => {
   const state = useSelector((state) => state.Mapping); // gloablState
   const [localState, setLocalState] = useState({ MapStatisticsToDepartmentsDTableKey: 100, entityItems: undefined, searchedEntityItems: undefined, entityGridGroupData: undefined, isLoaded: false });
   const dispatch = useDispatch();
   const masterData = useSelector((state) => state.MasterData);
   let timeout;
   let itemSelected = false;

   useEffect(() => {
      if (masterData.Entites) {
         let onlyItems = getOnlyItemOfDimension(masterData.Entites);
         let groupData = onlyItems;
         setLocalState({ ...localState, entityItems: [...onlyItems], searchedEntityItems: [...onlyItems], entityGridGroupData: [...groupData], isLoaded: true });
      }
   }, [masterData.Entites]);

   const handleChange = (value) => {
      setLocalState({ ...localState, searchedEntityItems: localState.entityItems, MapStatisticsToDepartmentsDTableKey: parseInt(localState.MapStatisticsToDepartmentsDTableKey) + 1 });
      dispatch(updateMapping({ ...state, entity: value }));
      itemSelected = true;
   };

   const handleEntityDropDownSearchFilter = (inputText) => {
      if (timeout) {
         clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
         setLocalState({
            ...localState,
            searchedEntityItems:
               (inputText && !itemSelected)
                  ? localState.entityItems.filter((entity) => {
                     let CodeAndName = entity.entityCode + " " + entity.entityName;
                     return entity.entityName.toLowerCase().includes(inputText.toLowerCase()) || entity.entityCode.toLowerCase().includes(inputText.toLowerCase()) || CodeAndName.toLowerCase().includes(inputText.toLowerCase());
                  })
                  : localState.entityItems,
         });
         itemSelected = false;
      }, 500);
   };

   return (
      <div>
         <br /> <br />
         <div className={"bx--row"}>
            <div className={"bx--col-lg mapping-container"}>
               <div className={"bx--row"}>
                  <div className={"bx--col-lg-3"}>
                     <span style={{ color: "grey" }}>{"Entity"}</span>
                  </div>
               </div>
               <div className={"bx--row"}>
                  {
                     (localState?.entityItems?.length) ?
                        <>
                           <div className={"bx--col-lg-4"}>
                              <SingleSelectModal
                                 id={"entitiesDropDown-mapping"}
                                 data={localState?.searchedEntityItems ? localState?.searchedEntityItems : []}
                                 gridData={localState?.searchedEntityItems ? localState?.searchedEntityItems : []}
                                 name="Entity"
                                 placeholder="Entities"
                                 itemToString={(item) => (item ? item.entityCode + " " + item.entityName : "")}
                                 selectedItem={localState?.searchedEntityItems?.find((item) => item.entityID === state.entity)}
                                 onChange={(e) => handleChange(e.selectedItem ? e.selectedItem.entityID : "")}
                                 isGroupedData={true}
                                 onInputChange={handleEntityDropDownSearchFilter}
                                 hideGroupsToggle={false}
                                 hideGroups={true}
                              />
                           </div>
                        </>
                        :
                        <>
                           <div className={"bx--col-lg-4"}>
                              <DropdownSkeleton className={'mapping-entity-sleketon'} />
                           </div>
                        </>
                  }
               </div>

               {state.entity !== "" ? (
                  <>
                     <MapStatisticsToDepartmentsDTable
                        key={localState.MapStatisticsToDepartmentsDTableKey}
                        isEdit={isEdit} />
                  </>
               ) : null}
            </div>
         </div>
      </div>
   );
};

export default MapStatisticsToDepartments;
