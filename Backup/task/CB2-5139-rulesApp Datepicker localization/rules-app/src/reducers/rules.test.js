import { fetchRulesSuccess } from "../appActions";
import { addRuleSuccess } from "../CreateEditRule/createRuleActions";
import { deleteRuleSuccess } from "../Main/mainActions";
import { updateRuleSuccess } from "../ViewRule/viewRuleActions";

import rules from "./rules.js";

const seedState = [];

describe("rules reducer", () => {

	const rule = {
		assignments: {
			"345": {
				id: "345",
				isPriority: false,
				notifyEmail: false,
				notifyPush: false,
				notifySystem: false,
				shared: false,
				user: "Org Admin"
			}
		},
		conditions: [],
		desc: "Lorem ipsum.",
		id: "123",
		owner: "345",
		ownerOrg: "ares_security_corporation",
		targets: [],
		statement: "Alert me when any track enters any polygon",
		subject: [],
		title: "Rule Title",
		trigger: "enter"
	};

	const payload = JSON.stringify(rule);

	it("Should initialize with expected initial state.", () => {
		expect(rules(undefined, {})).toEqual(seedState);
	});

	describe("Should handle fetchRulesSuccess.", () => {
		
		it("Should assign its payload to rules state.", () => {
			const action = fetchRulesSuccess([{id: "123"}]);
			const expectedState = [...seedState, ...[{id: "123"}]];
			expect(rules(seedState, action)).toEqual(expectedState);
		});

	});

	describe("Should handle addRuleSuccess.", () => {
		const action = addRuleSuccess("123", payload);
		let expectedState;

		it("Should parse the payload from JSON to JS Object.", () => {
			expectedState = [...seedState, JSON.parse(payload)];
			expect(rules(seedState, action)).toEqual(expectedState);
		});

		it("Should add new rule to existing state.", () => {
			const prevState = [{id: "678"}];
			expectedState = [...prevState, JSON.parse(payload)];
			expect(rules(prevState, action)[1]).toEqual(rule);
		});
	});

	describe("Should handle deleteRuleSuccess.", () => {
		const action = deleteRuleSuccess("123");

		it("Should filter out the rule with the matching id.", () => {
			const prevState = [{id: "789"}, rule, {id: "678"}];
			const expectedState = [{id: "789"}, {id: "678"}];
			expect(rules(prevState, action)).toEqual(expectedState); 
		});
	});

	describe("Should handle updateRuleSuccess.", () => {
		let expectedState;

		it("Should parse the payload from JSON to JS Object.", () => {
			const action = updateRuleSuccess("123", payload);
			const prevState = [rule];
			expectedState = [{...prevState[0], ...JSON.parse(payload)}];
			expect(rules(prevState, action)).toEqual(expectedState);
		});

		it("Should update data of rule with passed id.", () => {
			const prevState = [{id: "678"}, rule];
			const newRule = rule;
			newRule.title = "New Rule Title";
			const action = updateRuleSuccess("123", JSON.stringify(newRule));
			expectedState = [{id: "678"}, newRule];
			expect(rules(prevState, action)).toEqual(expectedState);
		});
	});
});








