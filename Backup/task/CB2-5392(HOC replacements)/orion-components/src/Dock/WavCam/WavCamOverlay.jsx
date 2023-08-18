/* eslint-disable radix */
import React, {useState, useEffect, forwardRef, useImperativeHandle} from "react";
import WavCamHelper from "./WavCamHelper";
import { TargetingIcon } from "orion-components/SharedComponents";

const styles ={
	containerStyle: {
		height: "100%", 
		width: "100%", 
		margin: "auto"
	},
	containerStyleHidden: {
		height: "100%", 
		width: "100%", 
		margin: "auto",
		display: "none"
	}
};

const WavCamOverlay = ({
	imageMetadata,
	fovItems,
	visible
}, ref) => {

	const canvasContainerRef = React.useRef();
	const canvasRef = React.useRef();
	const [fovEnts, setFovEnts] = useState([]);

	useImperativeHandle(ref, () => ({
		refresh: (metadata) => {
		  renderOverlay(metadata);
		}
	  }));

	useEffect(() => {
		renderOverlay();
		return function cleanup() {
			//	-- returns on a useEffect are used for cleaning up like when we want to unsubscribe from something. React will only call it when it's time to clean up (unmount)--
		};
	}, [imageMetadata, fovItems]); 

	const renderOverlay = (metadata) => {
		const md = metadata || imageMetadata;
		if(!md) return;
		if(md && fovItems) {
			const helper = new WavCamHelper(md);
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.font = "Bold 8pt Roboto";

			const winW = parseInt(md["wav-image-w"]);
			const winH = parseInt(md["wav-image-h"]);
			const offsetX = parseInt(md["wav-container-offset-x"]);
			const offsetY = parseInt(md["wav-container-offset-y"]);

			const containerW = parseInt(md["wav-container-w"]);
			const containerH = parseInt(md["wav-container-h"]);
			const containerX = parseInt(md["wav-container-x"]);
			const containerY = parseInt(md["wav-container-y"]);
			const containerBaseH = parseInt(md["wav-container-base-h"]);

			canvasRef.current.width = containerW;
			canvasRef.current.height = containerH;
			canvasRef.current.style.width = canvasContainerRef.current.style.width = containerW + "px";
			canvasRef.current.style.height = canvasContainerRef.current.style.height = containerH + "px";
			canvasRef.current.style.left = canvasContainerRef.current.style.left = containerX + "px";
			canvasRef.current.style.top = canvasContainerRef.current.style.top = containerY + "px";
			
			const tempFovEnts = [];

			if(fovItems) {
				for(const key of Object.keys(fovItems)) {
					const item = fovItems[key];
					const { entityData } = item;
					const { geometry } = entityData;
					const { name, sourceId } = entityData.properties;
					const displayName = name || sourceId;
					if(displayName) {
						const azEl = helper.convertLatLonToAzEl(geometry.coordinates[1], geometry.coordinates[0]);
						const percentXY = helper.convertAzElToPercentXY(azEl[0], azEl[1]);

						const x = winW * percentXY[0] - offsetX;
						const y = winH * percentXY[1] + offsetY;

						const labelOffsetX = 30;
						const labelOffsetY = -5;

						// add width and height
						const targetW = 24;
						const targetH = 24;
						tempFovEnts.push({ 
							...item, 
							...{ 
								"width": targetW, 
								"height": targetH, 
								"left": x - (targetW / 2) - 3, 
								"top": y - (targetH), 
								targetingOffsetY: containerBaseH  
							}});

						const text = ctx.measureText(displayName.toUpperCase());
						ctx.fillStyle = "#ffffffcc";
						ctx.fillRect(x - 5 + labelOffsetX, y - 12 + labelOffsetY, text.width + 10, 16);
						ctx.fillStyle = "black";
						ctx.fillText(displayName.toUpperCase(), x + labelOffsetX, y + labelOffsetY);
					}

				}
				setFovEnts(tempFovEnts);
			}
		}
	};

	return (
		<div style={visible ? styles.containerStyle : styles.containerStyleHidden} ref={canvasContainerRef}>
			<canvas ref={canvasRef} />

			{fovEnts.map(item => (
				<div key={item.id} style={{
					position: "absolute", 
					top: `${item.top}px`, 
					left: `${item.left}px`, 
					width: `${item.width}px`, 
					height: `${item.height}px`,
					display: visible ? "block" : "none"}}>
					<TargetingIcon 
						key={item.id}
						feedId={item.feedId} 
						id={item.id} 
						geometry={item.entityData.geometry} 
						config={{ xOffset: 0, yOffset: item.targetingOffsetY }}
					/>
				</div>
			))}
		</div>
	);

};

const fwdRefWavCamOverlay = forwardRef(WavCamOverlay);

export default fwdRefWavCamOverlay;