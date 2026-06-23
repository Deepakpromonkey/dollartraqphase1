
const layout = {
	
	addSuccessMessage: function(class_ref, message){

		class_ref.setState({success_message: message});

		this.hideSuccessMessage(class_ref);
	},

	hideSuccessMessage: function(class_ref){

		window.setTimeout(() => {
			class_ref.setState({success_message: ''});
		}, 5000);
	},
	
	addErrorMessage: function(class_ref, message){

		class_ref.setState({error_message: message});

		this.hideErrorMessage(class_ref);
	},

	hideErrorMessage: function(class_ref){

		window.setTimeout(() => {
			class_ref.setState({error_message: ''});
		}, 5000);
	},
}

export default layout;