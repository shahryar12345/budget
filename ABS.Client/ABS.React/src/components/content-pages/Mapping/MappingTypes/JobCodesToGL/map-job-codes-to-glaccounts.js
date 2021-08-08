import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MapJobCodesToGLAccountsTable from './map-job-codes-to-glaccounts-table';
import { DropdownSkeleton } from "carbon-components-react";
import SingleSelectModal from "../../../../shared/single-select/single-select-with-modal";
import {
  getEntityGroupedData,
  GetSortedEntityByGroups,
} from "../../../../../helpers/DataTransform/transformData";
import { getApiResponseAsync } from "../../../../../services/api/apiCallerGet";

const MapJobCodesToGLAccounts = ({ handleChange, handleDelete, isEdit }) => {
  const [localState, setLocalState] = useState({ mappingData: [] });
  const masterData = useSelector((state) => state.MasterData);
  const handleEntityChange = e => {
    // setup mappingData for grid
    setLocalState({ ...localState, entity: e.selectedItem });
  };

  const [entityGridDataStates, setentityGridDataStates] = useState([]);
  useEffect(() => {
    if (masterData.Entites.length) {
      getApiResponseAsync("ENTITYRELATIONSHIPS").then((entityrelationData) => {
        getEntityGroupedData(masterData.Entites, entityrelationData).then((response) => {
          setentityGridDataStates(response);
        });
      });
    }
  }, [masterData.Entites]);

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
              (masterData.Entites?.length > 0) ?
                <>
                  <div className={"bx--col-lg-4"}>
                    <SingleSelectModal
                      id={"mapping-entity"}
                      data={GetSortedEntityByGroups(masterData.Entites)}
                      gridData={entityGridDataStates}
                      name="Entity"
                      ariaLabel="Entity"
                      placeholder="Entities"
                      itemToString={(item) => (item ? item.entityCode + " " + item.entityName : "")}
                      hideGroupsToggle={true}
                      isGroupedData={true}
                      hideGroupsToggle={false}
                      hideGroups={true}
                      onChange={handleEntityChange}
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

          {localState.entity ?
            <MapJobCodesToGLAccountsTable
              entity={localState.entity}
              handleChange={handleChange}
              handleDelete={handleDelete}
              isEdit={isEdit}
            />
            : ''}

        </div>
      </div>
    </div>
  );
}

export default MapJobCodesToGLAccounts;