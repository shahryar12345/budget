import { convertUTCDateToLocalDateLocalString } from "../helpers/date.helper";
import { getApiResponseWithParams } from "./api/apiCallerGet";
import axios from "axios";
import getURL from "./api/apiList";
import { makeApiRequest } from "./api";


export const GetPayTypeDistributionPageDataRows = function (data, dateformat, user) {
  data.forEach(function (row) {
    row["id"] = row["code"];
    row["updatedDate"] = convertUTCDateToLocalDateLocalString(row["updateddate"] + "", dateformat, true);
    row["userProfileId"] = row?.createdbyusername ? row?.createdbyusername : row?.updatedbyusername;
  });

  let updatedData = [];
  data.forEach((item) => {
    if (
      !updatedData.find((updatedItem) => {
        return updatedItem.id === item.id;
      })
    ) {
      updatedData.push(item);
    }
  });
  return updatedData;
};

export const SavePayTypeDistribution = (data, type) => {
  if (!data.length) Promise.resolve();
  if (type === "add") {
    return new Promise((resolve) => {
      axios
        .post(getURL("PAYTYPEDISTRIBUTIONS"), data)
        .then((response) => {
          resolve({
            success: true,
          });
        })
        .catch((err) => {
          resolve({
            success: false,
          });
        });
    });
  } else if (type === "update") {
    return new Promise((resolve) => {
      axios
        .put(getURL("PAYTYPEDISTRIBUTIONS"), data)
        .then((response) => {
          resolve({
            success: true,
          });
        })
        .catch((err) => {
          resolve({
            success: false,
          });
        });
    });
  }
};

export const GetPayTypeDistribution = () => {
  return new Promise((resolve) => {
    axios
      .get(getURL("PAYTYPEDISTRIBUTIONS"))
      .then((response) => {
        resolve({
          success: response.status == 200 ? true : false,
          data: response.data,
        });
      })
      .catch((err) => {
        resolve({
          success: false,
        });
      });
  });
};

export const DeletePayTypeDistribution = (codes) => {
  var response = new Promise((resolve) => {
    // axios.post( getURL('PAYTYPEDISTRIBUTIONS')+"/DeleteMultiplePTD", codes).then((response) => {
    makeApiRequest('post', getURL('PAYTYPEDISTRIBUTIONS') + "/DeleteMultiplePTD", codes).then((response) => {
      resolve({
        success: true,
      });
    })
      .catch((err) => {
        resolve({
          success: false,
        });
      });
  });
  return response
}