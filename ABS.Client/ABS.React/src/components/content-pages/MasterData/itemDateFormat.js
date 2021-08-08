import getApiResponse from "../../../services/api/apiCallerGet";

const itemsDateFormat = [
  {
    id: "itemsDateFormat",
    value: "itemsDateFormat-0",
    text: "mm/dd/yyyy",
  },
  {
    id: "itemsDateFormat",
    value: "itemsDateFormat-1",
    text: "yyyy-mm-dd",
  },
  {
    id: "itemsDateFormat",
    value: "itemsDateFormat-2",
    text: "mm/dd/yy",
  },
  {
    id: "itemsDateFormat",
    value: "itemsDateFormat-3",
    text: "dd-Jan-yy",
  },
  {
    id: "itemsDateFormat",
    value: "itemsDateFormat-4",
    text: "January dd, yyyy",
  },
  {
    id: "itemsDateFormat",
    value: "itemsDateFormat-5",
    text: "dd-Jan-yyyy",
  },
];

export const itemsDateFormatAPI = async () => {
  //console.log('getaxios ' )
  const xres = await getApiResponse("ItemTypes-DateFormats");
  //console.log('payload from api ' , xres);

  var myArr = JSON.parse(xres);
  console.log(" Response from Axios ", myArr);
};

export default itemsDateFormat;
