export const Paging = (text) => {
	
	//return action
	return {
		type: 'paging', //always should have the type property
		payload: text //newly updated text
	};
}