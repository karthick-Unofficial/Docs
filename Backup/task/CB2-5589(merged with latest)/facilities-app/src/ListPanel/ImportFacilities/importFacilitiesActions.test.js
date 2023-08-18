import * as t from "../../actionTypes";
import * as actions from "./importFacilitiesActions";

describe("Import Facilities Redux Actions", () => {
	it("Should create an action to check import facilities done", () => {
		const expectedAction = {
			type: t.IMPORT_FACILITIES_DONE
		};

		expect(actions.facilitiesImportDone()).toEqual(expectedAction);
	});
});
