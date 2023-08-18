// -- todo: switched to bcryptjs pure javascript implementation because was having problems in container on mac
// -- ostensibly 30% slower but may not really impact. Todo is to revisit performance
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

module.exports = EncryptionProvider;

function EncryptionProvider () {
	if (!(this instanceof EncryptionProvider)) return new EncryptionProvider();
}

EncryptionProvider.prototype.encryptPassword = function( _userpassword  ){
	const userpasswordhash  = bcrypt.hashSync(_userpassword, salt);
	return userpasswordhash;
};

EncryptionProvider.prototype.compareSync = function( _userPassword, _hashedPassword ) {
	const result =  bcrypt.compareSync (_userPassword, _hashedPassword);
	return result;
};