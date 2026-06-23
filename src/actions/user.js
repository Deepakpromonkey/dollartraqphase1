export const User = (text) => {
	
	//return action
	return {
		type: 'user', //always should have the type property
		payload: text //newly updated text
	};
}