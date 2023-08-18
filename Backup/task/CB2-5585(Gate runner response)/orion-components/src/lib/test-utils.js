import fetchMock from "fetch-mock";

// Utility to make jest resolve all pending promises so we can continue
export const flushAllPromises = () => new Promise(resolve => setImmediate(resolve));

export const safelyMock = (method, matcher, response) => {
// future implementation
// fetchMock[`${method}Once`](patchedMatcher, response).catch(200)

	// current implementation to workaround
	fetchMock.mock("*", response);
};

// This implementation can also be modified when workaround is fixed
export const checkMockedUrl = (url) => {
	return fetchMock.calls().matched[0][0].url.includes(url);
};

export const getMockedMethod = () => {
// console.log(JSON.stringify(fetchMock.calls()))
	return fetchMock.calls().matched[0][0].method;
};

export const getSentData = () => {
	const call = fetchMock.calls().matched[0][0];
	if (call.body) {
		return JSON.parse(call.body);
	} else {
		return JSON.parse(call._bodyInit);
	}
};