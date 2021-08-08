import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DataTable,
  TableContainer,
  TableToolbar,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableHeader,
  TableSelectRow,
  TableCell,
  Search,
  Button,
  Pagination,
  InlineNotification,
  RadioButton,
} from "carbon-components-react";
import { Delete16 } from "@carbon/icons-react";
import { updateForecast } from "../../../core/_actions/ForecastActions";
import { DeleteForecastModel } from "../../../services/forecast-model-service";
import { convertUTCDateToLocalDateLocalString } from "../../../helpers/date.helper";
import { CheckRunForecastButton } from "./ValidateForecast";
import FullScreenModal from "../../shared/budget-versions-modal/full-screen-modal";
//let tempSelectedRow = [];


const getGridRows = function (data, dateformat, currentPage = 1, pageSize = 10) {

  let rows = Object.values(JSON.parse(JSON.stringify(data)));
  rows = rows.slice(
    (currentPage - 1) * pageSize,
    (currentPage - 1) * pageSize + pageSize
  );
  rows.forEach(function (row) {
    row["isSelected"] = false;
    row["id"] = row["forecastModelID"];
    row["updatedDate"] = convertUTCDateToLocalDateLocalString(
      row["updatedDate"] + "",
      dateformat, true
    );
    row["user"] = "N/A"
  });
  return rows;
};

const ForecastModal = ({ isOpen, handleModalClose }) => {
  const dispatch = useDispatch();

  const headers = [
    {
      header: "Name",
      key: "name",
    },
    {
      header: "Description",
      key: "description",
    },
    {
      header: "Updated date",
      key: "updatedDate",
    },
    {
      header: "User",
      key: "user",
    },
  ];

  const initialState = {
    showRowSelectedNotification: false,
    rows: [],
    selectedRow: {},
    paginationData: {
      currentPage: 1,
      currentPageSize: 10
    }
  };
  const initialComponetsKeys = {
    forecastModalGridKey: 100
  }
  const [state, SetState] = useState(initialState); // local component States
  const [fillteredstate, SetFillteredState] = useState(initialState);
  const storeState = useSelector((state) => state.ForecastReducer); // global Store States
  const budgetVersionData = useSelector((state) => state.BudgetVersions.list);


  const userdateformat = useSelector(
    (state) => state.systemSettings.fiscalStartMonthDateFormat
  );
  const dateformat = useSelector((state) => state.MasterData.ItemDateFormat);
  const [keysStates, setKeysStates] = useState(initialComponetsKeys);
  const [searchString, setSearchString] = useState('');
  const [tableSortState, setTableSortState] = useState({});

  var mydateFormat = dateformat.find(
    ({ itemTypeValue }) => itemTypeValue === userdateformat
  );
  if (typeof mydateFormat === "undefined") {
    mydateFormat = "LLLL";
  } else {
    mydateFormat = mydateFormat.itemTypeCode;
  }

  useEffect(() => {
    // Set new Key on modal opening only.
    if (isOpen) {
      setKeysStates({ ...keysStates, forecastModalGridKey: keysStates.forecastModalGridKey + 1 })
    }
  }, [isOpen])

  useEffect(() => {
    // Here Transform Data when parent child relationship is implemented in backend.    

    let scenarioType = storeState.forecast_budgetversion_scenario_type_Code;
    if (storeState.forecastModelData.length && scenarioType !== "") {
      let fillteredData = getFillteredRow([...storeState.forecastModelData], scenarioType);
      SetFillteredState({ ...fillteredstate, rows: [...fillteredData] })
      SetState({ ...state, rows: getGridRows([...fillteredData], mydateFormat, 1, 10), selectedRow: {} })
    }
  }, [storeState.forecastModelData, isOpen, userdateformat, dateformat, storeState.forecast_budgetversion_scenario_type_Code]);

  const getFillteredRow = (data, scenarioType) => {
    return data.filter((row) => { return row.code === scenarioType })
  }

  useEffect(() => {
    SetState({
      ...state,
      rows: getGridRows(showFilteredAndSearchedData(), mydateFormat, state.paginationData.currentPage, state.paginationData.currentPageSize),
      selectedRow: {}
    })
  }, [tableSortState])

  useEffect(() => {
    SetState({
      ...state,
      rows: getGridRows(showFilteredAndSearchedData(), mydateFormat, 1, 10),
      selectedRow: {}
    })
  }, [searchString])


  const showFilteredAndSearchedData = () => {
    let fillteredDataArray = [...fillteredstate.rows];
    if (tableSortState?.sortColumn) {
      if (tableSortState?.sortColumn === "updatedDate") {
        if (tableSortState.sortOrder == 'ASC')
          fillteredDataArray = fillteredDataArray.sort((a, b) => (new Date(a[tableSortState.sortColumn]) > new Date(b[tableSortState.sortColumn])) ? 1 : (new Date(a[tableSortState.sortColumn]) < new Date(b[tableSortState.sortColumn])) ? -1 : 0);
        else if (tableSortState.sortOrder == 'DESC')
          fillteredDataArray = fillteredDataArray.sort((a, b) => (new Date(a[tableSortState.sortColumn]) < new Date(b[tableSortState.sortColumn])) ? 1 : (new Date(a[tableSortState.sortColumn]) > new Date(b[tableSortState.sortColumn])) ? -1 : 0);
      }
      else {
        if (tableSortState.sortOrder == 'ASC')
          fillteredDataArray = fillteredDataArray.sort((a, b) => ((a[tableSortState.sortColumn])?.toLowerCase() > (b[tableSortState.sortColumn])?.toLowerCase()) ? 1 : ((a[tableSortState.sortColumn]?.toLowerCase()) < (b[tableSortState.sortColumn]?.toLowerCase())) ? -1 : 0);
        else if (tableSortState.sortOrder == 'DESC')
          fillteredDataArray = fillteredDataArray.sort((a, b) => ((a[tableSortState.sortColumn])?.toLowerCase() < (b[tableSortState.sortColumn])?.toLowerCase()) ? 1 : ((a[tableSortState.sortColumn]?.toLowerCase()) > (b[tableSortState.sortColumn]?.toLowerCase())) ? -1 : 0);

      }
    }
    if (searchString) return fillteredDataArray.filter(data => data.name.toLowerCase().includes(searchString.toLowerCase()))
    return fillteredDataArray
  }

  const onHeaderClick = (sortColumn) => {
    if (!Object.keys(tableSortState).length || tableSortState.sortColumn != sortColumn) {
      setTableSortState({ sortColumn, sortOrder: 'ASC' })
      return;
    }
    switch (tableSortState.sortOrder) {
      case 'ASC':
        setTableSortState({ sortColumn, sortOrder: 'DESC' })
        return;
      case 'DESC':
        setTableSortState({});
        return;
      default:
        return;
    }
  }

  const onSeacrh = (e) => {
    setSearchString(e.target.value);
  }


  const handleModalSubmit = () => {
    SetState({ ...state, showRowSelectedNotification: false });

    var SelectedforecastSections = storeState.forecastModelData.find(
      (x) => x.forecastModelID === state.selectedRow?.id
    )?.asJson;

    if (typeof SelectedforecastSections === "string") {
      SelectedforecastSections = JSON.parse(SelectedforecastSections);
    }

    // Enable Validate Button if thier is some Steps in Selected model
    let disabledButton;
    disabledButton = storeState.validateButton;
    if (SelectedforecastSections.length > 0) {
      SelectedforecastSections = SelectedforecastSections.map(data => {
        data.source.dataRow.map((data2, index2) => {
          let BVStillExist = false;
          for (let index in budgetVersionData) {
            if (budgetVersionData[index].code == data2.budgetversion_code) {
              BVStillExist = true;
              break
            }
          }
          // if (storeState.BVCodes.indexOf(data2.budgetversion_code) === -1) {
          if (!BVStillExist) {
            data2.budgetversion_code = 'notSelected';
            data2.endMonth = 'notSelected';
            data2.startMonth = 'notSelected';
            data.sectionValidation.budgetversion[index2] = { invalid: true, invalidText: "Required value missing" };
            if(data.sectionValidation?.startMonth?.length)
            {
              data.sectionValidation.startMonth[index2] = { invalid: true, invalidText: "Required value missing" }
            }
            if(data.sectionValidation?.endMonth?.length)
            {
              data.sectionValidation.endMonth[index2] = { invalid: true, invalidText: "Required value missing" }
            }
            data.sectionValidation.sectionValid = false
          }
        })
        return data;
      })
      disabledButton.disabled = false;
    } else {
      disabledButton.disabled = true;
    }
    storeState.validateButton = disabledButton;

    dispatch(
      updateForecast({
        ...storeState,
        forecast_model_Id: state.selectedRow?.id,
        forecast_model_code: storeState.forecast_budgetversion_scenario_type_Code,
        // Code field is used to saved the BV scenario type.
        forecast_model_name: state.selectedRow?.name,
        forecast_model_description: state.selectedRow?.description,
        forecast_model_selected: true,
        collapseAll: true,
        forecastSections: SelectedforecastSections,
      })
    );
    CheckRunForecastButton(); // check field of selected modal, and then decide accordingly to enable/disable the RUN FORECAST BUTTON.
    handleModalClose("showForecastModal");
    return true; // return true to close the Modal
  };
  const handleForecastModelDelete = async () => {
    // Call delete API here
    await DeleteForecastModel(state.selectedRow?.id).then((response) => {
      if (response.response.status === 200) {
        // get all object other than tha one which is deleted.
        const updatedForecastModelData = storeState.forecastModelData.filter(
          (el) => el.forecastModelID !== state.selectedRow?.id
        );

        // In case user delete the Selected Forecast Model. so we should clear the state from the forecast Page.
        if (storeState.forecast_model_Id === state.selectedRow?.id) {
          dispatch(
            updateForecast({
              ...storeState,
              forecast_model_Id: "",
              forecast_model_code: "",
              forecast_model_name: "",
              forecast_model_description: "",
              forecast_model_selected: false,
              collapseAll: false,
              forecastSections: [],
              forecastModelData: [...updatedForecastModelData],
            })
          );
        } else {
          dispatch(
            updateForecast({
              ...storeState,
              forecastModelData: [...updatedForecastModelData],
            })
          );
        }
        handleModalClose("showForecastModal");
      } else {
        // Show error here , not delete, or any other
      }
    });
  };
  const handleDataTableRowSelection = (selectedRow, selectRow) => {
    // Call Data Table Build-in call back here, to show selection in the table, Pass id of the Row to make it selected.
    selectRow(selectedRow.id);

    let updatedRows = Object.values(JSON.parse(JSON.stringify(state.rows)));
    // De-select First. 
    updatedRows = updatedRows.map((row) => {
      row.isSelected = false;
      return row;
    });

    let updatedIndex = updatedRows.findIndex((row) => row.id === selectedRow.id);
    let updatedObject = updatedRows[updatedIndex];
    updatedObject["isSelected"] = true;
    updatedRows[updatedIndex] = updatedObject
    SetState({ ...state, rows: [...updatedRows], selectedRow: selectedRow })
  };

  const paginationHandler = (e, selectRow, selectedRow) => {
    let clearSelectionInState = true;
    let currentPage = e.page;
    let currentPageSize = e.pageSize;
    if (selectedRow.length) {
      let selectedRowId = selectedRow[0].id;
      let orignalRowIndex = storeState.forecastModelData.findIndex((row) => row.forecastModelID === selectedRowId);
      let pageStartIndex = (e.page - 1) * e.pageSize;
      let pageEndIndex = (e.page - 1) * e.pageSize + e.pageSize

      if (pageStartIndex <= orignalRowIndex && pageEndIndex > orignalRowIndex) {
        // Remain Selected, and Show "Add modal" button as avalaible.
        clearSelectionInState = false;
      } else {
        // De-select selection , because Row not appear in the pagination. And Show "Add modal" button as UN-avalaible.
        clearSelectionInState = true;
      }
    }
    SetState({
      ...state,
      rows: getGridRows(showFilteredAndSearchedData(),
        mydateFormat,
        currentPage,
        currentPageSize),
      selectedRow: clearSelectionInState ? {} : state.selectedRow,
      paginationData: { currentPage, currentPageSize }
    })
  }

  return (
    <FullScreenModal
      className="forecast-modal"
      iconDescription="Close"
      modalHeading="Forecast models"
      onRequestClose={() => {
        handleModalClose("showForecastModal");
        setSearchString('')
      }}
      onRequestSubmit={() => {
        handleModalSubmit();
        setSearchString('')
      }}
      onSecondarySubmit={() => {
        handleModalClose("showForecastModal");
        setSearchString('')
      }}
      open={isOpen}
      passiveModal={false}
      primaryButtonDisabled={!state.selectedRow["id"]}
      primaryButtonText="Add to forecast page"
      secondaryButtonText="Cancel"
      selectorPrimaryFocus="[data-modal-primary-focus]"
      hasScrollingContent={true}
    >
      <div className="bx--row forecast-modal-grid" >
        <div className="bx--col-lg">
          <DataTable
            key={keysStates.forecastModalGridKey}
            filterRows={function noRefCheck() { }}
            headers={headers}
            locale="en"
            rows={[]}
            isSortable={true}
            radio={true}
            render={({
              rows,
              headers,
              getHeaderProps,
              defaultProps,
              getRowProps,
              getTableProps,
              getSelectionProps,
              selectedRows,
              getBatchActionProps,
              OverflowMenuProps,
              onInputChange,
              handleOnInputValueChange,
              filterInputValue,
              actualPage,
              onClose,
              selectRow,
            }) => (
              <TableContainer title="">
                <TableToolbar>
                  <Search onChange={onSeacrh}></Search>

                  {selectedRows.length ? (
                    <Button
                      // disabled={!selectedRows.length}
                      id="btnDeletModel"
                      kind="primary"
                      type="button"
                      onClick={(e) => handleForecastModelDelete()}
                      renderIcon={Delete16}
                    >
                      Delete
                    </Button>
                  ) : null}
                </TableToolbar>

                <Table size="compact" {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      <TableHeader />
                      {headers.map((header) => {
                        return (
                          <TableHeader {...getHeaderProps({ header, onClick: () => onHeaderClick(header.key) })}>
                            {header.header}
                          </TableHeader>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.rows.length ? state.rows.map((row, index) => (
                      <TableRow
                        {...getRowProps({
                          row,
                        })}
                      >
                        <TableCell key={row.id}>
                          <RadioButton
                            id={"rd_forecastModal_dataGrid-" + row.id}
                            onClick={(e) => handleDataTableRowSelection(row, selectRow)}
                            checked={row.isSelected}
                          />
                        </TableCell>
                        {/*{row.cells.map((cell) => {
                          return (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          );
                        })} */}
                        {headers.map(header => (
                          <TableCell key={header + row.id}>{row[header.key]} </TableCell>
                        ))}
                      </TableRow>
                    )) : null}
                  </TableBody>
                </Table>
                <Pagination
                  id="paginationBar"
                  pageSizes={[10, 20, 30, 40, 50]}
                  totalItems={fillteredstate.rows.length}
                  onChange={(e) => paginationHandler(e, selectRow, selectedRows)}
                  className="bx--pagination forecast-grid-pagination"
                  disabled ={searchString ? true : false}
                />
              </TableContainer>
            )}
            rows={state.rows}
          />
        </div>
      </div>

    </FullScreenModal>
  );
};

export default ForecastModal;
