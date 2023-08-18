import React, { useState } from "react";
import PropTypes from "prop-types";
import { ContextMenuItem } from "orion-components/Map/ContextMenu";
import { Translate } from "orion-components/i18n";

const propTypes = {
	lngLat: PropTypes.object.isRequired,
	coordsCopied: PropTypes.func.isRequired
};

const CopyCoords = ({ lngLat, coordsCopied }) => {
	const [showFeedback, setShowFeedback] = useState(false);

	const copyCoordsToClipboard = () => {
		navigator.clipboard.writeText(`${lngLat.lat}, ${lngLat.lng}`);
		setTimeout(() => {
			// A slight delay here looks better for feedback
			setShowFeedback(true);
		}, 200);

		// Show feedback briefly before closing context menu
		setTimeout(() => {
			coordsCopied();
			setShowFeedback(false);
		}, 3000);
	};

	return (
		<ContextMenuItem onClick={() => copyCoordsToClipboard()}>
			<div
				style={{
					display: "flex",
					width: "100%",
					justifyContent: "space-between"
				}}
			>
				<Translate value="global.map.contextMenu.copyCoords.label" />
				{showFeedback && <Translate value="global.map.contextMenu.copyCoords.feedback" />}
			</div>
		</ContextMenuItem>
	);
};

CopyCoords.propTypes = propTypes;

export default CopyCoords;
