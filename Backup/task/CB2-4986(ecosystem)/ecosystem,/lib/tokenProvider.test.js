const tokenProvider = require("./tokenProvider.js")({});
const JWT = require("jsonwebtoken");

const SECRET = "access-secret";


// Import this from settings in the future
const user = {
	"email": "111@111.com",
	"id": "123",
	"role": "org-admin",
	"orgId": "ares_security_corporation"
};

describe("tokenProvider", () => {

	it("Generates a JWT (string)", () => {
		const token = tokenProvider.generate(user, "access"); 
		expect(typeof token).toEqual("string");
	});

	it("JWT generated verifies with correct secret", () => {

		const expectedDecoded = { 
			iss: "phoenix-auth-server",
			userId: "123",
			email: "111@111.com",
			role: "org-admin",
			orgId: "ares_security_corporation"
		};
		const token = tokenProvider.generate(user, "access"); 
		const verified = JWT.verify(token, SECRET);

		expect(verified.email).toEqual(expectedDecoded.email);
		expect(verified.role).toEqual(expectedDecoded.role);
		expect(verified.userId).toEqual(expectedDecoded.userId);
		expect(verified.iss).toEqual(expectedDecoded.iss);
		expect(verified.orgId).toEqual(expectedDecoded.orgId);

		expect(verified.exp).toBeTruthy;
		expect(verified.iat).toBeTruthy;
	});

	it("JWT generated throws with incorrect secret", () => {

		const token = tokenProvider.generate(user, "access"); 
		const incorrectSecret = "wrong-access";

		expect(() => JWT.verify(token, incorrectSecret)).toThrow();
	});



});