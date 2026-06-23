const INITIAL_STATE = { paging: {} };

export default (state = INITIAL_STATE, action) => {
	switch (action.type){
        case 'paging':
			return { ...state, paging: action.payload };
		default:
			return state;
	}
};
