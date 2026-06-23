
const validate = {
	
	validEmail: function(email){

		if(email && email != ''){

			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}
		return false;
	},

	validMobile: function(mobile){

		if(mobile == '' || (mobile.length < 10 || isNaN(mobile))){

			return false;
		}
		return true;
	}
}

export default validate;