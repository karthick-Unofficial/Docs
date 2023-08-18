// cSpell:disable
const DEG_TO_RAD = Math.PI / 180.0;
const RAD_TO_DEG = 180.0 / Math.PI;
const DistanceUnit = {
	KILOMETERS: "KILOMETERS",
	MILES: "MILES",
	NAUTICALMILES: "NAUTICALMILES",
	STATUTEMILES: "STATUTEMILES",
	METERS: "METERS"
};
const EarthRadiusUnits = {
	KILOMETERS: 6371.00964,
	MILES: 3958.76186,
	NAUTICALMILES: 3440.07,
	STATUTEMILES: 3958.7618625615,
	METERS: 6371009.64
};

class WavCamHelper {
	constructor(metadata) {
		this.CAMERA_LAT = parseFloat(metadata["x-wavcam-lat"]);
		this.CAMERA_LON = parseFloat(metadata["x-wavcam-lon"]);
		this.CurrentAz = this.CAMERA_AZ = parseFloat(
			metadata["x-wavcam-camera-az"]
		);
		this.CurrentEl = this.CAMERA_EL = parseFloat(
			metadata["x-wavcam-camera-el"]
		);
		this.currentVFOV = this.CAMERA_VFOV = parseFloat(
			metadata["x-wavcam-vfov"]
		);
		this.currentHFOV = this.CAMERA_HFOV = parseFloat(
			metadata["x-wavcam-hfov"]
		);
		this.CAMERA_ALT = parseFloat(metadata["x-wavcam-alt"]);

		this.updateParams(metadata);
	}

	updateParams(metadata) {
		// these define the portion of the wav image displayed
		this.VIEWABLE_AREA_HEIGHT = parseFloat(
			metadata["x-wavcam-viewable-area-height"]
		);
		this.VIEWABLE_AREA_WIDTH = parseFloat(
			metadata["x-wavcam-viewable-area-width"]
		);
		this.VIEWABLE_AREA_X = parseFloat(metadata["x-wavcam-viewable-area-x"]);
		this.VIEWABLE_AREA_Y = parseFloat(metadata["x-wavcam-viewable-area-y"]);

		this.currentHFOV = this.CAMERA_HFOV;
		this.currentVFOV = this.CAMERA_VFOV;

		this.CurrentAz = this.CAMERA_AZ;
		this.CurrentEl = this.CAMERA_EL;
	}

	GetHeadingToPoint(frompoint, topoint) {
		const lat1 = frompoint[0] * DEG_TO_RAD;
		const lat2 = topoint[0] * DEG_TO_RAD;
		const lon1 = frompoint[1] * DEG_TO_RAD;
		const lon2 = topoint[1] * DEG_TO_RAD;

		const heading =
			(Math.atan2(
				Math.sin(lon2 - lon1) * Math.cos(lat2),
				Math.cos(lat1) * Math.sin(lat2) -
					Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
			) %
				(2 * Math.PI)) *
			RAD_TO_DEG;
		return heading < 0 ? heading + 360 : heading;
	}

	sphericalDistance(startLat, startLon, endLat, endLon, unit) {
		const phi1 = startLat * DEG_TO_RAD;
		const lambda0 = startLon * DEG_TO_RAD;
		const phi = endLat * DEG_TO_RAD;
		const lambda = endLon * DEG_TO_RAD;

		const pdiff = Math.sin((phi - phi1) / 2.0);
		const ldiff = Math.sin((lambda - lambda0) / 2.0);
		const rval = Math.sqrt(
			pdiff * pdiff + Math.cos(phi1) * Math.cos(phi) * (ldiff * ldiff)
		);

		return 2.0 * Math.asin(rval) * EarthRadiusUnits[unit];
	}

	convertLatLonToAzEl(lat, lng) {
		// Get delta latitude, and ensure that it does not wrap around the equator
		let deltaLat = lat * DEG_TO_RAD - this.CAMERA_LAT * DEG_TO_RAD;
		if (Math.abs(deltaLat) > Math.PI) {
			if (deltaLat > Math.PI) {
				deltaLat -= 2.0 * Math.PI;
			} else {
				deltaLat += 2.0 * Math.PI;
			}
		}

		// Get delta longitude, and ensure that it does not wrap around the prime meridian
		let deltaLon = lng * DEG_TO_RAD - this.CAMERA_LON * DEG_TO_RAD;
		if (Math.abs(deltaLon) > Math.PI) {
			if (deltaLon > Math.PI) {
				deltaLon -= 2.0 * Math.PI;
			} else {
				deltaLon += 2.0 * Math.PI;
			}
		}

		const thetaR =
			Math.PI / 2.0 - Math.asin(Math.cos(deltaLat) * Math.cos(deltaLon));

		const detEl =
			Math.atan2(
				EarthRadiusUnits["METERS"] * Math.sin(thetaR),
				this.CAMERA_ALT +
					EarthRadiusUnits["METERS"] * (1.0 - Math.cos(thetaR))
			) -
			Math.PI / 2.0;

		const distance = this.sphericalDistance(
			this.CAMERA_LAT,
			this.CAMERA_LON,
			lat,
			lng,
			DistanceUnit.METERS
		);

		return [
			this.GetHeadingToPoint(
				[this.CAMERA_LAT, this.CAMERA_LON],
				[lat, lng]
			),
			detEl * RAD_TO_DEG,
			distance
		];
	}

	// Input in degrees, output in percentage of x/y
	convertAzElToPercentXY(az, el) {
		// Calculate the left hand side azimuth, and normalize it
		let startAz = this.CurrentAz - this.currentHFOV / 2.0;
		if (startAz < 0.0) {
			startAz += 360.0;
			az += 360.0;
		}

		// Calculate the x position based
		const x = (az - startAz) / this.currentHFOV;
		const adjAz =
			DEG_TO_RAD * (this.currentHFOV / 2.0 - this.currentHFOV * x + 90.0);
		const xCoord = Math.cos(adjAz);
		const yCoord =
			Math.cos(Math.abs(DEG_TO_RAD * this.CurrentEl)) * Math.sin(adjAz);
		let zCoord = Math.sqrt(1.0 - xCoord * xCoord - yCoord * yCoord);
		if (this.CurrentEl < 0.0) {
			zCoord = -zCoord;
		}

		const thetaTilt =
			RAD_TO_DEG *
			Math.atan(zCoord / Math.sqrt(xCoord * xCoord + yCoord * yCoord));

		// Calculate the elevation of the top of the viewable area
		const startEl = thetaTilt + this.currentVFOV / 2.0;

		// Calculate the y position, and make sure we don't point off the edge of the screen
		const y = (startEl - el) / this.currentVFOV;

		return [x, y];
	}
}

export default WavCamHelper;
