// cSpell:ignore unproject
import $ from "jquery";

const flyToTarget = (entityGeo, map, appState) => {
	// this.mouseEnter(this.state.x, this.state.y, entityGeo);

	// if ($(window).width() < 1023) this.props.showListPanel();

	let origCoords = entityGeo.coordinates;
	let offsetCoords;
	switch (entityGeo.type) {
		case "Point": {
			// Account for  entity profile being open
			let pointVal = map.project(entityGeo.coordinates);
			pointVal = { x: pointVal.x - 360, y: pointVal.y };
			offsetCoords = map.unproject(pointVal);
			break;
		}
		case "LineString": {
			// Get Line Center
			let lineVal = entityGeo.coordinates.reduce(
				(x, y) => {
					return [x[0] + y[0] / entityGeo.coordinates.length, x[1] + y[1] / entityGeo.coordinates.length];
				},
				[0, 0]
			);
			origCoords = lineVal;
			lineVal = map.project(lineVal);
			lineVal = { x: lineVal.x - 360, y: lineVal.y };
			offsetCoords = map.unproject(lineVal);
			break;
		}
		case "Polygon": {
			// Get Polygon center
			let a = 0;
			let b = 0;
			let c = 0;
			const length = entityGeo.coordinates[0].length;
			const x = function (i) {
				return entityGeo.coordinates[0][i % length][0];
			};
			const y = function (i) {
				return entityGeo.coordinates[0][i % length][1];
			};
			for (let i = 0; i < entityGeo.coordinates[0].length; i++) {
				const m = x(i) * y(i + 1) - x(i + 1) * y(i);
				a += m;
				b += (x(i) + x(i + 1)) * m;
				c += (y(i) + y(i + 1)) * m;
			}
			const n = 3 * a;
			const polyCenter = [b / n, c / n];
			origCoords = polyCenter;
			let polyVal = map.project(polyCenter);
			polyVal = { x: polyVal.x - 360, y: polyVal.y };
			offsetCoords = map.unproject(polyVal);
			break;
		}
		default:
			break;
	}
	const currentZoom = map.getZoom();
	appState.isOpen && appState.isListPanelOpen && $(window).width() > 1023
		? // only zoom in tight if the target is a point or track
		  entityGeo.type === "Point"
			? map.flyTo({
					center:
						currentZoom > 11
							? offsetCoords
							: /*tweak for entity profile offset*/ [origCoords[0] - 0.1, origCoords[1]],
					zoom: currentZoom > 11 ? currentZoom : 11,
					curve: Math.pow(6, 0.25)
			  })
			: map.flyTo({
					center: offsetCoords,
					zoom: currentZoom,
					curve: Math.pow(6, 0.25)
			  })
		: entityGeo.type === "Point"
		? map.flyTo({
				center: origCoords,
				zoom: currentZoom > 11 ? currentZoom : 11,
				curve: Math.pow(6, 0.25)
		  })
		: map.flyTo({
				center: origCoords,
				zoom: currentZoom,
				curve: Math.pow(6, 0.25)
		  });
};

export default flyToTarget;
