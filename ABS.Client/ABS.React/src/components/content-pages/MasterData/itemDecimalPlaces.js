import getApiResponse from "../../../services/api/apiCallerGet";


const itemDecimalPlaces = [
	{
		id: 'itemDecimalPlaces',
		value: 'itemDecimalPlaces-0',
		text: '0 decimal places: x'
	},
	{
		id: 'itemDecimalPlaces',
		value: 'itemDecimalPlaces-1',
		text: '1 decimal places: x.x'
	},
	{
		id: 'itemDecimalPlaces',
		value: 'itemDecimalPlaces-2',
		text: '2 decimal places: x.xx'
	},
	{
		id: 'itemDecimalPlaces',
		value: 'itemDecimalPlaces-3',
		text: '3 decimal places: x.xxx'
	},
	{
		id: 'itemDecimalPlaces',
		value: 'itemDecimalPlaces-4',
		text: '4 decimal places: x.xxxx'
	},
	{
		id: 'itemDecimalPlaces',
		value: 'itemDecimalPlaces-5',
		text: '5 decimal places: x.xxxxx'
	},
	{
		id: 'itemDecimalPlaces',
		value: 'itemDecimalPlaces-6',
		text: '6 decimal places: x.xxxxxx'
	},
	{
		id: 'itemDecimalPlaces',
		value: 'itemDecimalPlaces-7',
		text: '7 decimal places: x.xxxxxxx'
	},
	{
		id: 'itemDecimalPlaces',
		value: 'itemDecimalPlaces-8',
		text: '8 decimal places: x.xxxxxxxx'
	}
];



export const itemDecimalPlacesAPI = async () => {
	//console.log('getaxios ' )
	const xres = await getApiResponse('ItemTypes-DecimalPlaces');
	//console.log('payload from api ' , xres);

var myArr = JSON.parse(xres);
	console.log(' Response from Axios ' , myArr);

}

export default itemDecimalPlaces;



