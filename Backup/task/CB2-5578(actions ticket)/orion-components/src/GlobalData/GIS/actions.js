import { gisService } from "client-app-core";

import * as t from "./actionTypes";

export const gisDataReceived = data => {
	return {
		type: t.GIS_DATA_RECEIVED,
		payload: {
			data
		}
	};
};

export const fetchGISData = () => {
	return dispatch => {
		gisService.getGIS((err, response) => {
			if (err) console.log(err);
			if (!response) return;
			const data = JSON.parse(response);
			dispatch(gisDataReceived(data));
		});
	};
};
