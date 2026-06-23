const INITIAL_STATE = { user: {} };

export default (state = INITIAL_STATE, action) => {
	switch (action.type){
        case 'user':
			return { ...state, user: action.payload };
		default:
			return state;
	}
};
