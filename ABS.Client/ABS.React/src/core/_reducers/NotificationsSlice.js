import {
	FETCH_NOTIFICATIONS,
	MARK_NOTIFICATIONS
} from '../_actions/action-types';

const initialState = {
	isloading: false,
	isLoaded: true,
	isShown: false,
	ShowNOtification:'true' ,
	NotificationTitle:'Setting saved ',
	ShownAlready:false,
	kind:"success"
};




const NotificationsReducer = (state = initialState, action) => {
	//  console.log('SS reducer', state, action);

	switch (action.type) {
		case FETCH_NOTIFICATIONS:
	
		 return  {...state, isShow:true}
		case 	MARK_NOTIFICATIONS:
	
		 return  {...state, MarkVisible:action}

		default:
			return state;
	}
};

export default NotificationsReducer;

