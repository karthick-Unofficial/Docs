const JWT = require("jsonwebtoken");
// const model = require("../models/userModel")({});
// const encryptionProvider = require("./encryptionProvider")({});

// for dev access token is valid for 24 hours, when refresh token implemented this goes to a much shorter time period

const jwtTokenConfig = {
	issuer: "phoenix-auth-server",
	access: {
		secret: "access-secret",
		expires: 1209600 // -- won't be needed anymore from user role
	},
	refresh: {
		secret: "refresh-secret",
		expires: 2419200 // -- won't be needed anymore from user role
	}
};

module.exports = TokenProvider;

function TokenProvider() {
	if (!(this instanceof TokenProvider)) return new TokenProvider();
}

TokenProvider.prototype.generate = function(user, tokenType, extraProps) {
	// const exp = new Date();
	const payload = {
		iss: jwtTokenConfig.issuer,
		userId: user.id,
		email: user.email,
		role: user.role,
		orgId: user.orgId,
		...extraProps
	};
	const options = {
		algorithm: "HS256"
	};

	// exp.setSeconds(exp.getSeconds() + jwtTokenConfig[tokenType].expires);
	// payload.exp = exp.getTime();

	return (JWT.sign(payload, jwtTokenConfig[tokenType].secret, options));
};

