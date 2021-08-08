import { 
  UPDATE_STRUCTURETABLES,
  FETCH_STRUCTURETABLES,
  FETCH_FTE_DIVISORS
} from '../_actions/action-types';

import { updateObject} from './helperFunctions'


const initialState = {
	fiscalStartMonth: 'Jul',
  UserAuthenticated: null,
  FteDivisors: []
};

function updateSettings(objState, objaction) {
  const newObj =      updateObject(objState, objaction.payload)
  
  return newObj
}

const structureTableReducer = (state = initialState, action) => {
	  // console.log('ST reducer', state, action);

	switch (action.type) {
		case UPDATE_STRUCTURETABLES:
		//  return  updateSettings({...state},action)
		 return { ...state,  fiscalStartMonth: action.payload	};
		 case FETCH_STRUCTURETABLES:
     return { ...state,  UserAuthenticated : false} ;
    case FETCH_FTE_DIVISORS:
      return {
        ...state,
        FteDivisors: [
          ...action.payload
        ]
      }
		default:
			return state;
	}


};

export default structureTableReducer;



// const systemSettingsSlice = createSlice({
//   name: 'systemSettings',
//   initialState: [],
//   reducers: {
//     updateSystemSettings(state, action) {
//       const { id, text } = action.payload
//       state.push({ id, text, completed: false })
//     },

//   }
// })
// export const { updateSystemSettings } = sys.actions
// export default todosSlice.reducer