const Ajv = require("ajv");
const ajv = new Ajv({ useDefaults: true });

// new AJV keyword "date" checks to see if data is an instance of a date object
ajv.addKeyword( "date", {
	validate: function( schema, data ){
		return data instanceof Date;
	}
});

module.exports = ajv;

