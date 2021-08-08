import React from "react";
import { useSelector } from "react-redux";
import {
  DataTable,
  Button,
  Checkbox,
  TooltipDefinition,
} from "carbon-components-react";
import initheaders from "./headers";
import initialRows from "./initialRows";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import overflowMenuItems from "./overflowMenu";
import {
  Search20,
  Favorite20,
  Save20,
  Save16,
  Information16,
  FilterEdit16,
  Information32,
  SettingsAdjust32,
  SettingsAdjust16,
  ArrowsHorizontal16,
  Undo16,
  Reset16,
  Redo16,
  Restart16,
  Export16,
  Row16,
} from "@carbon/icons-react";
const {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  TableSelectRow,
  TableBatchActions,
} = DataTable;

const getHeaderProps = () => ({
  disabled: false,
  page: 1,
  totalItems: 103,
  pagesUnknown: false,
  pageInputDisabled: false,
  backwardText: "Previous page",
  forwardText: "Next page",
  pageSize: 2,
  pageSizes: [20, 40, 60, 80, 100, 500, 1000],
  itemsPerPageText: "Items per page:",
  onChange: "onChange",
});

const checkboxHideMonths = {
  id: "xc_HideMonths",
  className: "bx--checkbox-wrapper",
  labelText: "Hide months",
};
const checkboxHideRowsMonths = {
  id: "xc_HideRows",
  className: "bx--checkbox-wrapper",
  labelText: "Hide rows with 0 and all 12 months ",
};
const getHeader = function (data) {
  const Headers = Object.keys(data);
  return Headers;
};

const getDataRows = function (data) {
  const rows = Object.values(data);
  return rows;
};

const addIndexKey = function (arrdata) {
  var x = new Date();

  // console.log('getitme ', x);
  // console.log('arrdata ', arrdata);
  var result = Object.values(arrdata).map(function (el) {
    var newArr = Object.assign({}, el);
    newArr.id = Math.floor(Math.random() * 100 * Math.random() * 10);
    console.log("abv", newArr);
    return newArr;
  });
  return result;
};

// Inside of your component's `render` method
const DTTable = () => {
  const systemSettingsValRdx = useSelector((state) => state.systemSettings);
  console.log("DTTABLE ", systemSettingsValRdx);
  const getIndexedData = addIndexKey(systemSettingsValRdx);
  console.log("getindexeddata", systemSettingsValRdx);

  const gridHeaders = getHeader(systemSettingsValRdx);

  const gridData = getDataRows(systemSettingsValRdx);

  console.log("check my array of headers", systemSettingsValRdx, gridHeaders);
  console.log("check my array of data", gridData);

  return (
    <DataTable
      // rows={gridData}
      rows={initialRows}
      headers={initheaders}
      //headers={gridHeaders}
      isSortable={true}
      radio={true}
      pagination={true}
      render={({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
        getSelectionProps,
        onInputChange,
      }) => (
        <TableContainer title="">
          <TableToolbar>
            <TableToolbarContent>
              <TooltipDefinition
                tooltipText="Brief description of the dotted, underlined word above."
                tabIndex={0}
                onClick={console.log("Tool Tip Click")}
              >
                <TableToolbarSearch
                  className=""
                  onChange={onInputChange}
                  tabIndex={-1}
                >
                  
                </TableToolbarSearch>
              </TooltipDefinition>
              {/* <TableToolbarMenu>
                        <TableToolbarAction primaryFocus> Action 1 </TableToolbarAction>
                        <TableToolbarAction> Action 2 </TableToolbarAction>
                        <TableToolbarAction >Action 3 </TableToolbarAction>
                        <TableBatchActions>Texxxt</TableBatchActions>
                      </TableToolbarMenu> */}
              {/* <Button>Primary Button</Button> */}
              {/* <Button>Primary Button</Button> */}

              <Button
                onClick={console.log("toolbar add new clicked")}
                small
                kind="ghost"
              >
                <Checkbox {...checkboxHideMonths} />
              </Button>
              <Button
                onClick={console.log("toolbar add new clicked")}
                small
                kind="ghost"
              >
                <Checkbox
                  {...checkboxHideRowsMonths}
                  defaultChecked="checked"
                />{" "}
                &nbsp; &nbsp;
                <Information16 />
              </Button>
              {/* <Button onClick={console.log('toolbar add new clicked')} small kind="primary">  Add actuals data</Button> */}
              <Button
                onClick={console.log("toolbar add new clicked")}
                small
                kind="primary"
              >
                Add rows &nbsp; &nbsp; &nbsp; <Row16 className="iconColor" />
              </Button>
              <Button
                onClick={console.log("toolbar add new clicked")}
                small
                kind="primary"
              >
                Forecast data
              </Button>
              <Button
                onClick={console.log("toolbar add new clicked")}
                small
                kind="primary"
              >
                Spread data &nbsp; &nbsp; &nbsp;{" "}
                <ArrowsHorizontal16 className="iconColor" />
              </Button>
              {/* <Button onClick={console.log('toolbar add new clicked')} small kind="primary">Undo  &nbsp;  <Reset16  className="iconColor"/> </Button> */}
              <Button
                onClick={console.log("toolbar add new clicked")}
                small
                kind="primary"
              >
                Undo &nbsp; &nbsp; &nbsp;
                <Undo16 className="iconColor" />{" "}
              </Button>
              {/* <Button onClick={console.log('toolbar add new clicked')}  small kind="primary">Redo  &nbsp;  <Restart16 className="iconColor"/></Button> */}
              <Button
                className="bx--btn--primary"
                onClick={console.log("toolbar add new clicked")}
                small
                kind="primary"
              >
                Redo &nbsp; &nbsp; &nbsp;
                <Redo16 className="iconColor" />{" "}
              </Button>
              <Button
                onClick={console.log("toolbar add new clicked")}
                small
                kind="primary"
              >
                Export to Excel &nbsp; &nbsp; &nbsp;
                <Export16 className="iconColor" />
              </Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {row.cells.map((cell) => (
                    <>
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    </>
                  ))}
                  <OverflowMenu>
                    {overflowMenuItems.map((menuItem) => (
                      <OverflowMenuItem
                        key={menuItem.id}
                        itemText={menuItem.itemText}
                      />
                    ))}
                  </OverflowMenu>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    />
  );
};

export default DTTable;
