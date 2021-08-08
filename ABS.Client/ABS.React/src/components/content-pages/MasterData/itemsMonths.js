
import getApiResponse from "../../../services/api/apiCallerGet";

const ItemsMonths = [
	{
		id: 'fiscalStartMonth',
		value: 'fiscalStartMonth-01',
		text: 'Jan'
	},
	{
		id: 'fiscalStartMonth',
		value: 'fiscalStartMonth-02',
		text: 'Feb'
	},
	{
		id: 'fiscalStartMonth',
		value: 'fiscalStartMonth-03',
		text: 'Mar'
	},
	{
		id: 'fiscalStartMonth',
		value: 'fiscalStartMonth-04',
		text: 'Apr'
	},
	{
		id: 'fiscalStartMonth',
		value: 'fiscalStartMonth-05',
		text: 'May'
	},
	{
		id: 'fiscalStartMonth',
		value: 'fiscalStartMonth-06',
		text: 'Jun'
	},
	{
		id: 'fiscalStartMonth',
		value: 'fiscalStartMonth-07',
		text: 'Jul'
	},
	{
		id: 'fiscalStartMonth',
		value: 'fiscalStartMonth-08',
		text: 'Aug'
	},
	{
		id: 'fiscalStartMonth',
		value: 'fiscalStartMonth-09',
		text: 'Sep'
	},
	{
		id: 'fiscalStartMonth',
		value: 'fiscalStartMonth-10',
		text: 'Oct'
	},
	{
		id: 'fiscalStartMonth',
		value: 'fiscalStartMonth-11',
		text: 'Nov'
	},
	{
		id: 'fiscalStartMonth',
		value: 'fiscalStartMonth-12',
		text: 'Dec'
	}
];

//#region 	

//#endregion
export const ItemsMonthsAPI = async () => {
	//console.log('getaxios ' )
	const xres = await getApiResponse('ItemTypes-GetMonths');
	//console.log('payload from api ' , xres);
return xres;

}



export default ItemsMonths;