
const text = {

    cleanText: function(text){

		if(text != ''){

            return text.replace(/(\r\n|\n|\r)/gm, "");
        }
	},
}

export default text;