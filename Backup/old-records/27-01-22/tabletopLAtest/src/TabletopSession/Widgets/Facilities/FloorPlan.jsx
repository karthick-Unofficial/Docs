import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MapContainer from "../../MapBase/MapBaseContainer";

const propTypes = {
	facility: PropTypes.object.isRequired,
	floorPlan: PropTypes.object
};

const FloorPlan = ( { facility, floorPlan } ) => {
	const [ render, setRender ] = useState(false);

	// We render after a delay of 1 second so that the parent container gets a chance to resize
	// as needed. Rendering of the map prior to parent container completing its resizing causes
	// the map to stick to the size at which it got rendered initially.
	useEffect(() => {
		setTimeout(() => setRender(true), 1000);
	}, []);

	return render ? 
		(
			<div style={{border: "2px solid black", height:"100%", width:"100%", marginRight:0, marginLeft:0 }}>
				{floorPlan && 
					<MapContainer isMainMap={false} facility={facility} floorPlan={floorPlan}/>
				}
			</div>
		) : null;
};

FloorPlan.propTypes = propTypes;
export default FloorPlan;