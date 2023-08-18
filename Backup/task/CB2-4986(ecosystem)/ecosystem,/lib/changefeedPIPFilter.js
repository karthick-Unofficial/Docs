const turf = require("@turf/turf");

module.exports = ChangefeedPIPFilter;

function ChangefeedPIPFilter(inclusionGeo) {
	if (!(this instanceof ChangefeedPIPFilter)) return new ChangefeedPIPFilter(inclusionGeo);
	this.inclusionGeo = inclusionGeo;
	this.inclusionPoly = turf.polygon(inclusionGeo.coordinates);
	this.geoIncluded = [];
}

ChangefeedPIPFilter.prototype.filter = function(change) {
	if (change.type !== "state") {
		if (change.type === "remove") {
			// -- if remove and was in feed then let the change through
			if(change.old_val) {
				if (this.geoIncluded.indexOf(change.old_val.id) > -1) {
					this.geoIncluded.splice(this.geoIncluded.indexOf(change.old_val.id), 1);
					return change;
				}
			}
		}
		else if (change.new_val.entityData.geometry) {
			const geo = change.new_val.entityData.geometry;
			let inGeo = false;						
			if(geo.type.toLowerCase() === "point") {
				const pt = turf.point(change.new_val.entityData.geometry.coordinates);
				inGeo = turf.booleanPointInPolygon(pt, this.inclusionPoly);
			} else if (geo.type.toLowerCase() === "polygon") {
				const poly = turf.polygon(geo.coordinates);
				inGeo =
					turf.booleanWithin(poly, this.inclusionPoly) ||
					turf.booleanOverlap(this.inclusionPoly, poly);
			} else if (geo.type.toLowerCase() === "linestring") {
				const line = turf.lineString(geo.coordinates);
				inGeo =
					turf.booleanWithin(line, this.inclusionPoly) ||
					turf.booleanCrosses(this.inclusionPoly, line);
			}

			if (inGeo) {
				if (!(this.geoIncluded.indexOf(change.new_val.id) > -1)) {
					this.geoIncluded.push(change.new_val.id);
				}
				return change;
			}
			else {
				if (this.geoIncluded.indexOf(change.new_val.id) > -1) {
					// -- exiting geo so publish for removal
					change["old_val"] = { "id": change.new_val.id };
					change.type = "remove";
					this.geoIncluded.splice(this.geoIncluded.indexOf(change.new_val.id), 1);
					return change;
				}
			}
		}
	}
	else {
		return change;
	}
	return null;
};
