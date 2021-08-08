import { getApiResponseWithParams } from "./api/apiCallerGet";
import { convertUTCDateToLocalDateLocalString } from "../helpers/date.helper";
import { makeApiRequest } from "./api";
import getURL from "./api/apiList";

export const GetReportingPageData = async (params) => {
 const apireq = await getApiResponseWithParams("GETREPORTINGLIST", params);
 return apireq;
};

//parsing data that is retrieved in a different format from GetBudgetVersionPage API
export const GetReportingPageDataRows = function (data, dateformat, user) {
 const rows = data;
 rows.forEach(function (row) {
  row["id"] = row["ReportingDimensionsID"];
  row["updateddate"] = convertUTCDateToLocalDateLocalString(row["updateddate"] + "", dateformat, true);
  row["userProfileId"] = user;
 });

 return rows;
};

export const GetReportCodes = async () => {
 return await makeApiRequest("get", getURL("GETREPORTSCODES"))
  .then((response) => {
   return response;
  })
  .catch((err) => {
   return err;
  });
};

export const DeleteReports = async (ids) => {
 return await makeApiRequest("post", getURL("DELETEREPORTS"), ids)
  .then((res) => {
   return res;
  })
  .catch((err) => {
   return err;
  });
};

export const CopyReport = async (reportJSONObject) => {
 return await makeApiRequest("post", getURL("COPYREPORT"), reportJSONObject)
  .then((response) => {
   return response;
  })
  .catch((err) => {
   return err;
  });
};

export const RenameReport = async (reportJSONObject) => {
 return await makeApiRequest("post", getURL("RENAMEREPORT"), reportJSONObject)
  .then((response) => {
   return response;
  })
  .catch((err) => {
   return err;
  });
};

export const getReportFormInitalData = () => {
 var request = [
  makeApiRequest("get", getURL("SCENARIOTYPE")),
  makeApiRequest("get", getURL("BUDGETVERSIONSGRID"), {
   params: {
    UserId: 1,
   },
  }),
  makeApiRequest("get", getURL("GETREPORTDISPLAYOPTION")),
  makeApiRequest("get", getURL("GETREPORTMEASURES")),
  makeApiRequest("get", getURL("GETREPORTPERIOD")),
  GetReportCodes(),
 ];
 return Promise.all(request);
};

export const getReportConfigData = (reportConfigId) => {
 return new Promise((resolve, reject) => {
  makeApiRequest("get", getURL("GETREPORTCONFIG") + "/" + reportConfigId)
   .then((response) => {
    resolve(response);
   })
   .catch((err) => {
    reject(err);
   });
 });
};

export const saveReportConfigService = (reportConfig) => {
 return new Promise((resolve) => {
  makeApiRequest("post", getURL("SAVEREPORTCONFIG"), reportConfig)
   .then((response) => {
    resolve({
     success: response.data.status == "failed" ? false : true,
     message: response.data.status == "failed" ? "Report config already exists!" : "Report saved.",
     payload: response.data.payload,
    });
   })
   .catch((err) => {
    console.log("Error occured while saving report config");
    resolve({
     success: false,
     message: "Report config already exists!",
    });
   });
 });
};

export const runReport = (reportConfig) => {
 return new Promise((resolve) => {
  makeApiRequest("post", getURL("RUNREPORT"), reportConfig)
   .then((response) => {
    resolve({
     success: response.data.status == "failed" ? false : true,
     message: response.data.status == "failed" ? "Run Report error!" : "Report saved.",
     payload: response.data.payload,
    });
   })
   .catch((err) => {
    console.log("Error occured while run report ");
    resolve({
     success: false,
     message: "Report config already exists!",
    });
   });
 });
};

export const downloadReport = (reportConfig) => {
  return new Promise((resolve) => {
   makeApiRequest("post", getURL("DOWNLOADREPORT"), reportConfig)
    .then((response) => {
     resolve({
      success: response.data.status == "failed" ? false : true,
      message: response.data.status == "failed" ? "Run Report error!" : "Report saved.",
      payload: response.data.payload,
      res: response,
     });
    })
    .catch((err) => {
     console.log("Error occured while run report ");
     resolve({
      success: false,
      message: "Report config already exists!",
     });
    });
  });
 };