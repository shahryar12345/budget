import axios from "axios";
import getURL from "./api/apiList";

export const SaveForecastMethodsHistory = (forecastMethods) => {
    return new Promise((resolve) => {
        axios
            .post(`${getURL("FORCASTHISTORY")}?forecastHistory=${forecastMethods}`)
            .then((response) => {
                resolve({ response });
            })
            .catch((err) => {
                console.log("Error occured while saving Forecast Methods History");
                resolve({
                    success: false,
                    message: "Forecast methods history not saved...!!!",
                });
            });
    });
};

export const GetForecastMethodsHistory = (queryParams) => {
    return new Promise((resolve) => {
        // .post(getURL("FORCASTHISTORY"), forecastMethods)
        axios
            .get(`${getURL("FORCASTHISTORY")}?${queryParams}`)
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                console.log("Error occured while getting Forecast Methods History");
                resolve({
                    success: false,
                    message: "Error occured while getting Forecast Methods History...!!!",
                });
            });
    });
};