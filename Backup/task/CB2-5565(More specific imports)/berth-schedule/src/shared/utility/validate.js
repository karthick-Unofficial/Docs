export const validate = (type, value) => {
	switch (type) {
		case "email": {
			const exp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return value ? exp.test(value.toLowerCase()) : true;
		}
		case "phone": {
			const exp = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
			return value ? exp.test(value) : true;
		}
		case "number": {
			const exp = /^\S/;
			return value && value.length ? !isNaN(value) && exp.test(value) : true;
		}
		case "imo": {
			/*
			 * There are some specific rules around IMO validation that we are currently not implementing. One of those being...
			 * """
			 * The integrity of an IMO number can be verified by its check digit, which is the rightmost digit.
			 * This is done by multiplying each of the leftmost six digits by a factor corresponding to their position
			 * from right to left, and adding those products together. The rightmost digit of this sum is the check digit.
			 * """
			 */
			const exp = /^\S/;
			return value && value.length ? !isNaN(value) && value.length === 7 && Number(value) > 0 && exp.test(value) : true;
		}
		case "mmsid":
			return value && value.length ? !isNaN(value) && value.length === 9 && Number(value) > 0 : true;
		case "loa":
		case "grt":
		case "draft":
			return value && value.length ? !isNaN(value) && Number(value) > 0 : true;
		case "registry": 
		case "name":
		case "company":
		case "firstName":
		case "lastName":
		case "voyageNumber": {
			const exp = /^\S/;
			return value ? exp.test(value) : true;
		}
		default:
			return true;
	}
};
