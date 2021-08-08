import { DataTable } from "carbon-components-react";
import { Provider } from "react-redux";
import React from "react";
import { mount } from "enzyme";
import StatisticsDatatable from "./statistics-datatable.component";
import mockStore from "../../../Core/_mockStore/index";
import { rows } from "../../../services/statistics-table.data";

const { TableToolbarSearch } = DataTable;

describe("<StatisticsDatatable /> Unit Testing , Add Cases", () => {
  let container;
  beforeEach(() => {
    container = mount(
      <Provider store={mockStore}>
        <StatisticsDatatable
          rows={rows}
          fiscalyear={{ itemTypeCode: "2015" }}
        />
      </Provider>
    );
  });
  describe("Statistics table header generating code unit-tests", () => {
    it("Should hide/show code from header and rows", () => {
      container.find(".statistics-table-icon").at(0).simulate("click");
      container.update();
      expect(container.find(".bx--assistive-text").at(0).text()).toEqual(
        "Show Codes"
      );

      //Try To hide Name , when code already hidden
      container.find(".statistics-table-icon").at(3).simulate("click");
      container.update();
      expect(container.find(".bx--assistive-text").at(3).text()).toEqual(
        "Hide Names"
      );

      // Should show code
      container.find(".statistics-table-icon").at(0).simulate("click");
      container.update();
      console.log(container.find(".statistics-table-icon").length);
      expect(container.find(".bx--assistive-text").at(0).text()).toEqual(
        "Hide Codes"
      );
    });
  });

  describe("Statistics table row toggle code unit-tests", () => {
    it("Should expand child rows", () => {
      var shownIconLength = container.find(".statistics-table-icons").length;
      container.find(".statistics-table-icon").at(6).simulate("click");
      container.update();
      expect(container.find(".statistics-table-icon").length).not.toBe(
        shownIconLength
      );
    });
  });

  describe("Statistics table header generating code unit-tests", () => {
    it("Should compare the text of cell", () => {
      var oldText = container.find("td").at(0).text();
      container.find(".statistics-table-icon").at(0).simulate("click");
      container.update();
      expect(container.find("td").at(0).text()).not.toBe(oldText);
    });
  });

  describe("Statistics table row toggle code unit-tests", () => {
    it("Should expand and Hide 2 levels of children", () => {
      var shownRowLengths = container.find("TableRow").length; // Initial Row are 4
      container.find(".statistics-table-cell-icon").at(0).simulate("click"); // according to dummy data , after first child expend , total rows are 7
      container.update();
      expect(container.find("TableRow").length).toEqual(shownRowLengths + 3); // 4+3 = 7
      container.find(".statistics-table-cell-icon").at(6).simulate("click"); // according to dummy data , after second child expend , total rows are 12
      container.update();
      expect(container.find("TableRow").length).toEqual(shownRowLengths + 8); // 4+8 = 12

      // Hide Case
      console.log(container.find("TableRow").length);
      shownRowLengths = container.find("TableRow").length; // Total Row 12
      container.find(".statistics-table-cell-icon").at(0).simulate("click"); // according to dummy data , after parent child hide , total rows are become 4
      container.update();
      expect(container.find("TableRow").length).toEqual(shownRowLengths - 8); // 12-8 = 4
    });
  });

  // For Future
  describe("Statistics table Toolbar search unit-tests", () => {
    it("Should invoke Change method", () => {
      container.find(TableToolbarSearch).at(0).prop("onChange")({
        e: {},
      });
    });
  });

  describe("Statistics table Toolbar Hide Month CheckBox unit-tests", () => {
    it("should validate the Checked Value Changed", () => {
      container.update();
      container.find('Checkbox[id="HideMonths"]').prop("onClick")({
        target: {
          checked: true,
        },
      });
      container.update();
      expect(
        container.find('Checkbox[id="HideMonths"]').prop("checked")
      ).toEqual(true);

      container.find('Checkbox[id="HideMonths"]').prop("onClick")({
        target: {
          checked: false,
        },
      });
      container.update();
      expect(
        container.find('Checkbox[id="HideMonths"]').prop("checked")
      ).toEqual(false);
    });
  });
  
  describe("Statistics table Search unit-tests", () => {
    it("should have placeHolderText", () => {
      container.update();
      expect(container.contains(TableToolbarSearch)).toEqual(true);
      expect(
        container.find(TableToolbarSearch).prop("placeHolderText")
      ).toEqual(
        "* represents zero or more characters, % represents single character"
      );
    });
  });
});
