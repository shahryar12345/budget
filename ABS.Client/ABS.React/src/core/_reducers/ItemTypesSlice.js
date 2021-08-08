import { ADD_ITEMTYPES, FETCH_ITEMTYPES, UPDATE_ITEMTYPES, UPDATE_ITEMTYPESDB } from '../_actions/action-types';

import postApiResponse from '../../services/api/apiCallerPost';
import { updateObject } from './helperFunctions'

const initialState = {
	
		
			ItemTypeKeyword: null,
			ItemTypeCode:null,
			ItemTypeValue:null,
			ItemDataType:null,
			UserID: null
		
};

function updateItemTypes(objState, objaction) {
  const newObj =      updateObject(objState, objaction.payload)
  
  return newObj
}
function updateDatabase(objState, objaction) {
  const newObj =      updateObject(objState, objaction.payload)
//	console.log('ITT updateFunc', objState, objaction);
	postApiResponse('ItemTypes', newObj );

  return newObj
}

const ItemTypesReducer = (state = initialState, action) => {
	//  console.log('IT reducer', state, action);

	switch (action.type) {
		case UPDATE_ITEMTYPES:			
		  return updateItemTypes ({...state},action)
		case UPDATE_ITEMTYPESDB:			
		return updateDatabase ({...state},action)
		 //return { ...state,  rd_negativeValues: action.payload.rd_negativeValues	};
		 case ADD_ITEMTYPES:
		 return { ...state,  count: state.count +1} ;
		 case FETCH_ITEMTYPES:
		 return { ...state,  UserId : '1'} ;
		default:
			return state;
	}


};

export default ItemTypesReducer;



