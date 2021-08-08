import React, { useState } from "react";
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
  Pagination,
  InlineNotification,
  Modal,
} from "carbon-components-react";
import FullScreenModal from "./full-screen-modal";

let tempSelectedRow = [];

const BugdetVersionModal = ({
  handleGetSelectedRows,
  budgetVersionData,
  sourceIndex,
  isOpen,
  handleModalClose,
}) => {
  const headers = [
    {
      header: "Code",
      key: "code",
    },
    {
      header: "Name",
      key: "description",
    },
    {
      header: "Fiscal year",
      key: "fiscalYearID",
    },
    {
      header: "Budget version type",
      key: "budgetVersionTypeID",
    },
    {
      header: "Updated date",
      key: "updateddate",
    },
    {
      header: "User",
      key: "user",
    },
  ];

  const initialState = {
    showRowSelectedNotification: false,
    budgetVersionData: [],
  };

  const [state, SetState] = useState(initialState); // local component States

  const handleModalSubmit = () => {
    if (!tempSelectedRow.length) {
      SetState({ ...state, showRowSelectedNotification: true });
      return false;
    }
    SetState({ ...state, showRowSelectedNotification: false });

    handleGetSelectedRows(tempSelectedRow, sourceIndex);
    handleModalClose();
    return true;
  };

  const handleDataTableRowSelection = (selectedRow) => {
    tempSelectedRow = selectedRow; // 'tempSelectedRow' variable is used for Selected row , because not able to setState in DataTable Component , through infinite loop Error.
    //handleModalSubmit();
  };

  const handleErrorNotificationClose = () => {
    SetState({ ...state, showRowSelectedNotification: false });
  };

  return (
    <div>
      <FullScreenModal
        className="some-class"
        hasScrollingContent={true}
        iconDescription="Close"
        modalHeading="Budget versions"
        onRequestClose={() => {
          handleModalClose();
        }}
        onRequestSubmit={() => {
          handleModalSubmit();
        }}
        onSecondarySubmit={() => {
          handleModalClose();
        }}
        open={isOpen}
        passiveModal={false}
        primaryButtonDisabled={false}
        primaryButtonText="Select"
        secondaryButtonText="Cancel"
        selectorPrimaryFocus="[data-modal-primary-focus]"
        size={"lg"}
      >
        <div className="bx--row">
          <div className="bx--col-lg">
            <DataTable
              headers={headers}
              locale="en"
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
                selectedRows,
                onInputChange,
                selectRow,
              }) => (
                <TableContainer title="">
                  <TableToolbar>
                    <Search onChange={onInputChange}></Search>
                  </TableToolbar>

                  <Table size="compact" {...getTableProps()}>
                    <TableHead>
                      <TableRow>
                        <TableHeader />
                        {headers.map((header) => {
                          return (
                            <TableHeader {...getHeaderProps({ header })}>
                              {header.header}
                            </TableHeader>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow {...getRowProps({ row })}>
                          <TableSelectRow
                            {...getSelectionProps({
                              row,
                              onSelect: handleDataTableRowSelection(
                                selectedRows
                              ),
                            })}
                          />
                          {row.cells.map((cell) => {
                            return (
                              <TableCell
                                key={cell.id}
                                onDoubleClick={async (e) => {
                                  selectRow(row.id);
                                  handleDataTableRowSelection(selectedRows);
                                }}
                                //onClick={}
                              >
                                {cell.value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Pagination
                    id="paginationBar"
                    pageSizes={[2, 5, 10, 20, 30, 40, 50]}
                    totalItems={rows.length}
                    className="bx--pagination"
                  />
                </TableContainer>
              )}
              rows={[...budgetVersionData]}
            />
          </div>
        </div>

        {state.showRowSelectedNotification ? (
          <div className="bx--row">
            <div className="bx--col-lg-7">
              <InlineNotification
                hideCloseButton={false}
                iconDescription="Close the notification"
                kind="error"
                notificationType="inline"
                onCloseButtonClick={() => handleErrorNotificationClose()}
                role="alert"
                statusIconDescription="describes the status icon"
                subtitle=""
                lowContrast
                title="Please select Budget Version first."
              />
            </div>
          </div>
        ) : null}
      </FullScreenModal>
    </div>
  );
};

export default BugdetVersionModal;
