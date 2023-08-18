const encryptionProvider = require("./encryptionProvider")({});

describe("EncryptionProvider", () => {

	it("Encrypts a password.", () => {
		const password = "Password123!";
		const encrypted = encryptionProvider.encryptPassword(password);

		expect(password === encrypted).toBe(false);
		expect(encrypted.includes(password)).toBe(false);
	});

	it("Verifies correct password matches encrypted password.", () => {
		const password = "Password123!";
		const encrypted = encryptionProvider.encryptPassword(password);
		const matchingPassword = "Password123!";

		expect(encryptionProvider.compareSync(matchingPassword, encrypted)).toBe(true);
	});

	it("Returns false if two passwords do not match.", () => {
		const password = "Password123!";
		const encrypted = encryptionProvider.encryptPassword(password);
		const matchingPassword = "AlphabetSoup";

		expect(encryptionProvider.compareSync(matchingPassword, encrypted)).toBe(false);
	});

	it("Returns false if two passwords match except for case.", () => {
		const password = "Password123!";
		const encrypted = encryptionProvider.encryptPassword(password);
		const matchingPassword = "password123!";

		expect(encryptionProvider.compareSync(matchingPassword, encrypted)).toBe(false);
	});
});