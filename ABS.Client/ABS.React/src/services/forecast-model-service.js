import axios from "axios";
import getURL from "./api/apiList";

export const SaveForecastModel = (forecastModel) => {
  return new Promise((resolve) => {
    axios
      .post(getURL("SAVEFORECASTMODEL"), forecastModel)
      .then((response) => {
        resolve({ response });
      })
      .catch((err) => {
        console.log("Error occured while saving Forecast Model");
        resolve({
          success: false,
          message: "Forecast model not saved...!!!",
        });
      });
  });
};

export const UpdateForecastModel = (forecastModel) => {
  console.log("UpdateForecastModel", forecastModel);
  return new Promise((resolve) => {
    axios
      .put(
        getURL("UPDATEFORECASTMODEL") + "/" + forecastModel.forecastModelID,
        forecastModel
      )
      .then((response) => {
        resolve({ response });
      })
      .catch((err) => {
        console.log("Error occured while updating Forecast Model");
        resolve({
          success: false,
          message: "Forecast model not update...!!!",
        });
      });
  });
};

export const GetForecastModels = () => {
  return new Promise((resolve) => {
    axios
      .get(getURL("GETFORECASTMODEL"))
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        console.log("Error occured while getting Forecast Model Data");
        resolve([]);
      });
  });
};

export const DeleteForecastModel = (forecastID) => {
  console.log("forecastID- Delete", forecastID);
  return new Promise((resolve) => {
    axios
      .delete(getURL("DELETEFORECASTMODEL") + "/" + forecastID)
      .then((response) => {
        resolve({ response });
      })
      .catch((err) => {
        console.log("Error occured while delete Forecast Model");
        resolve({
          success: false,
          message: "Forecast model not delete...!!!",
        });
      });
  });
};
