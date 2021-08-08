import {
  GetBudgetVersion,
  GetBudgetVersionCodes,
  SaveBudgetVersion,
  UpdateBudgetVersion,
} from "../../../../services/budget-version-service";

import MockAxios from "axios";
import getURL from "./../../../../services/api/apiList";

describe("Budget Version Service Unit Test Case", () => {
  it("GetBudgetVersionCodes() Unit Test Case", async () => {
    let result = null;
    const response = [{ code: "SomeCode" }, { code: "SomeOtherCode" }];
    MockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: response, // Dummy Data From API Response
      })
    );

    result = await GetBudgetVersionCodes();

    expect(result).toEqual(response);
    expect(MockAxios.get).toHaveBeenCalledTimes(1);
    expect(MockAxios.get).toHaveBeenCalledWith(getURL("BUDGETVERSIONCODES"));

    // Error Case
    MockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        data: [],
      })
    );

    result = await GetBudgetVersionCodes();

    expect(result).toEqual([]); // Return Empty array in case of error.
    expect(MockAxios.get).toHaveBeenCalledWith(getURL("BUDGETVERSIONCODES"));
    expect(MockAxios.get).toHaveBeenCalledTimes(2);
  });

  it("SaveBudgetVersion() Unit Test Case", async () => {
    let result = null;
    const budgetVersion = { id: 42, type: "A" }; // Dummy Object

    MockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: { status: "failed" }, // Dummy Data From API Response
      })
    );

    result = await SaveBudgetVersion(budgetVersion);
    expect(result).toEqual({
      success: false,
      message: "Budget version already exists!",
    });
    expect(MockAxios.post).toHaveBeenCalledTimes(1);
    expect(MockAxios.post).toHaveBeenCalledWith(
      getURL("BUDGETVERSIONS"),
      budgetVersion
    );

    MockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: { status: "success" }, // Dummy Data From API Response
      })
    );
    result = await SaveBudgetVersion(budgetVersion);
    expect(result).toEqual({ success: true, message: "Budget version saved." });
    expect(MockAxios.post).toHaveBeenCalledTimes(2);
    expect(MockAxios.post).toHaveBeenCalledWith(
      getURL("BUDGETVERSIONS"),
      budgetVersion
    );

    //Error Case

    MockAxios.post.mockImplementationOnce(() =>
      Promise.reject({
        //data : {status : 'success'} // Dummy Data From API Response
      })
    );
    result = await SaveBudgetVersion(budgetVersion);
    expect(result).toEqual({
      success: false,
      message: "Budget version already exists!",
    });
    expect(MockAxios.post).toHaveBeenCalledTimes(3);
    expect(MockAxios.post).toHaveBeenCalledWith(
      getURL("BUDGETVERSIONS"),
      budgetVersion
    );
  });

  it("GetBudgetVersion() Unit Test Case", async () => {
    let result = null;
    const budgetVersionID = 41; // Dummy ID
    const response = { id: 42, type: "A" };

    MockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: response, // Dummy Data From API Response
        status: 200,
      })
    );

    result = await GetBudgetVersion(budgetVersionID);
    expect(result).toEqual({ success: true, data: { id: 42, type: "A" } });
    expect(MockAxios.get).toHaveBeenCalledTimes(3); // 3 Because Get already called 2 time in previous test cases.
    expect(MockAxios.get).toHaveBeenCalledWith(
      getURL("BUDGETVERSIONS") + "/" + budgetVersionID
    );

    MockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: [], // Dummy Data From API Response
        status: 500,
      })
    );

    result = await GetBudgetVersion(budgetVersionID);
    expect(result).toEqual({ data: [], success: false });
    expect(MockAxios.get).toHaveBeenCalledTimes(4); // 4 Because Get already called 3 time in previous test cases.
    expect(MockAxios.get).toHaveBeenCalledWith(
      getURL("BUDGETVERSIONS") + "/" + budgetVersionID
    );

    // Error Case
    MockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        //data : response ,  // Dummy Data From API Response
        //status : 200
      })
    );
    result = await GetBudgetVersion(budgetVersionID);
    expect(result).toEqual({ success: false });
    expect(MockAxios.get).toHaveBeenCalledTimes(5);
    expect(MockAxios.get).toHaveBeenCalledWith(
      getURL("BUDGETVERSIONS") + "/" + budgetVersionID
    );
  });

  it("UpdateBudgetVersion() Unit Test Case", async () => {
    let result = null;

    const budgetVersionID = 41; // Dummy ID
    const budgetVersion = { id: 41, type: "A" };

    MockAxios.post.mockImplementationOnce(() => Promise.resolve({}));

    result = await UpdateBudgetVersion(budgetVersionID, budgetVersion);
    expect(result).toEqual({
      success: true,
      message: "Budget version updated!",
    });
    expect(MockAxios.post).toHaveBeenCalledTimes(4);
    expect(MockAxios.post).toHaveBeenCalledWith(
      getURL("BUDGETVERSIONS"),
      budgetVersionID
    );

    //Error Case
    MockAxios.post.mockImplementationOnce(() => Promise.reject({}));
    result = await UpdateBudgetVersion(budgetVersionID, budgetVersion);
    expect(result).toEqual({
      success: false,
      message: "Budget version already exists!",
    });
    expect(MockAxios.post).toHaveBeenCalledTimes(5);
    expect(MockAxios.post).toHaveBeenCalledWith(
      getURL("BUDGETVERSIONS"),
      budgetVersionID
    );
  });
});
