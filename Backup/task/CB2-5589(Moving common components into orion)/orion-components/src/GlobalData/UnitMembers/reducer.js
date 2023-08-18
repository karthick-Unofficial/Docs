const initialUnitMembersState = {};

const unitMembers = (state = initialUnitMembersState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "UNIT_MEMBER_RECEIVED": {
			const { member } = payload;
			return {
				...state,
				[member.id]: member
			};
		}

		case "UNIT_MEMBER_REMOVED": {
			const { unitMemberId } = payload;
			const newState = { ...state };

			delete newState[unitMemberId];

			return newState;
		}

		default:
			return state;
	}
};

export default unitMembers;
