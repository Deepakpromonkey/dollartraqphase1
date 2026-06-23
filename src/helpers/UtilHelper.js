
const util = {
	
	inArray: function(_array, _key){

		if(_array && _array.length > 0 && _array.indexOf(_key) > -1){

			return true;
		}

		return false;
	},

	objectLength: function(obj){

		return Object.keys(obj).length;
	},

	buildFormData: function(formData, data, parentKey) {
	
		if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {

		  	Object.keys(data).forEach(key => {
				this.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
		  	});
		} else {

		  	const value = data == null ? '' : data;
	  
		  	formData.append(parentKey, value);
		}
	}
}

export default util;