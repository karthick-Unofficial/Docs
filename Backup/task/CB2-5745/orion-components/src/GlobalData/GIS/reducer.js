import keyBy from "lodash/keyBy";
import pickBy from "lodash/pickBy";

const initialGISState = {
	services: {},
	layers: {},
	error: "",
	success: false,
	isFetching: false
};

const gisData = (state = initialGISState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "GIS_DATA_RECEIVED": {
			const { data } = payload;
			const update = keyBy(data, (datum) => datum.id);

			return {
				...state,
				...update
			};
		}
		case "GIS_SERVICES_RECEIVED": {
			const { services } = payload;
			const update = keyBy(services, "id");

			return {
				...state,
				services: { ...state.services, ...update },
				error: ""
			};
		}
		case "CREATE_SERVICE_REQUEST":
			return {
				...state,
				isFetching: true,
				error: ""
			};

		case "CREATE_SERVICE_SUCCESS": {
			const { service } = payload;
			const update = { [service.id]: service };

			return {
				...state,
				services: { ...state.services, ...update },
				error: "",
				isFetching: false,
				success: true
			};
		}

		case "CREATE_SERVICE_FAILURE": {
			const { error } = payload;
			return { ...state, error, isFetching: false };
		}

		case "CREATE_SERVICE_RESET":
			return { ...state, error: "", isFetching: false, success: false };

		case "GIS_LAYERS_RECEIVED": {
			const { layers } = payload;
			const update = keyBy(layers, "id");

			return {
				...state,
				layers: { ...state.layers, ...update },
				error: ""
			};
		}

		case "GIS_SERVICE_RECEIVED": {
			const { serviceId, update } = payload;
			const newServices = { ...state.services };
			newServices[serviceId] = update;
			return {
				...state,
				services: newServices
			};
		}

		case "GIS_SERVICE_REMOVED": {
			const { serviceId } = payload;
			const newServices = { ...state.services };
			const newLayers = pickBy(state.layers, (layer) => {
				return layer.serviceId !== serviceId;
			});
			delete newServices[serviceId];
			return {
				...state,
				services: newServices,
				layers: newLayers
			};
		}

		default:
			return state;
	}
};

export default gisData;
