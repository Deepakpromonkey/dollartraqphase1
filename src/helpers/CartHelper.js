
const cart = {

    increaseQuantitiy: function(class_ref, quantity){

		var _qty = class_ref.state[quantity];

        class_ref.setState({
            [quantity]: _qty + 1
        });
	},
	
	decreaseQuantity: function(class_ref, quantity){

		var _qty = class_ref.state[quantity];
		if(_qty <= 1) {
            return;
        } else {
            class_ref.setState({
                [quantity]: _qty - 1
            });
        }
    },
    
    getAttributeValue: function(_attributes, code){

		var _return = '';
		
        _attributes.map(
            (attribute) => {
                if(attribute.attribute_code == code){
                    _return = attribute.value;
                }
            }
        );
        
		return _return;
	}
}

export default cart;