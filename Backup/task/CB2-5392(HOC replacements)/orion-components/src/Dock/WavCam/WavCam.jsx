/* eslint-disable radix */
import React, { useState, useEffect } from "react";
import { Collapse, Drawer, SvgIcon, IconButton, List, ListItem, Switch, ListItemText } from "@material-ui/core";
import { AddBox, MenuOpen } from "@material-ui/icons";
import { mdiMinusBox, mdiCloseCircle } from "@mdi/js";
import { SelectField } from "orion-components/CBComponents";
import { WSImagePlayer } from "orion-components/CBComponents";
import WavCamOverlay from "./WavCamOverlay";
import { cameraService } from "client-app-core";
import debounce from "debounce";
import { CircularProgress } from "@material-ui/core";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import { wavCamFOVItems, getContext } from "./selectors";
import { v4 as uuidv4 } from "uuid";
import { userCamerasSelector } from "../Cameras/selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import * as actionCreators from "./wavCamActions";

const styles = {
	containerStyle: {
		height: 240,
		width: "100%",
		margin: "auto",
		background: "#1F1F21",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		userSelect: "none",
		placeContent: "center"
	},
	wavImageContainer: {
		position: "relative",
		width: "100%",
		height: "100%",
		margin: "0px",
		float: "left",
		alignItems: "center",
		flex: 10,
		justifyContent: "center",
		userSelect: "none"
	},
	wavImageInnerContainer: {
		position: "absolute",
		margin: "0px",
		alignItems: "center",
		overflow: "hidden",
		userSelect: "none",
		visibility: "hidden"
	},
	wavCamControlsContainer: {
		width: 48,
		height: "100%",
		background: "rgb(44, 45, 47, 0.5)",
		float: "right",
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		userSelect: "none"
	},
	zoomControlsContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		userSelect: "none"
	},
	controlButtons: {
		color: "white",
		width: 24,
		height: 24,
		userSelect: "none"
	},
	zoomControlButtons: {

	},
	wavImageContainerRTL: {
		position: "relative",
		width: "100%",
		height: "100%",
		margin: "0px",
		float: "right",
		alignItems: "center",
		flex: 10,
		justifyContent: "center",
		userSelect: "none"
	},
	wavCamControlsContainerRTL: {
		width: 48,
		height: "100%",
		background: "rgb(44, 45, 47, 0.5)",
		float: "left",
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		userSelect: "none"
	}
};

const WavCam = () => {
	const dispatch = useDispatch();

	const {
		toggleWavCam,
		toggleWavCamLabels,
		getWavCamState,
		startFOVItemStream,
		setWavPanoState,
		setSelectedWavCam
	} = actionCreators;

	const userCameras = useSelector(state => userCamerasSelector(state));
	const filteredUserCams = userCameras.filter((cam) => {
		return cam.entityData.properties.features && cam.entityData.properties.features.includes("ribbon");
	});

	const wavCams = filteredUserCams.map((cam) => {
		return {
			id: cam.id,
			name: cam.entityData.properties.name,
			instanceId: uuidv4(),
			config: cam.connection
		};
	});

	const wavCamPersistedState = useSelector(state => state.appState.persisted ? state.appState.persisted.wavcam_pano : { wavCamMetadata: {} });
	let selectedWavCam = null;
	const fovItems = useSelector(state => wavCams.length > 0 ? selectedWavCam ? wavCamFOVItems(selectedWavCam.id)(state) : [] : null);
	const context = useSelector(state => wavCams.length > 0 && selectedWavCam ? getContext(selectedWavCam.id)(state) : null);
	const open = useSelector(state => state.appState.dock.dockData.WavCam);
	const showWavCamLabels = useSelector(state => state.appState.dock.dockData.showWavCamLabels);
	if (wavCams.length > 0) {
		selectedWavCam = wavCamPersistedState && wavCamPersistedState.selectedWavCam ?
			wavCams.find((c) => c.id === wavCamPersistedState.selectedWavCam) :
			wavCams[0];
	}
	const dir = useSelector(state => getDir(state));

	const wavContainerRef = React.useRef();
	const wavImageContainerRef = React.useRef();
	const wavOverlayContainerRef = React.useRef();
	const wavOverlayRef = React.useRef();
	const imagePlayerRef = React.useRef();

	const [initialized, setInitialized] = useState(false);
	const [initialFrameReceived, setInitialFrameReceived] = useState(false);
	const [initialSyncComplete, setInitialSyncComplete] = useState(false);
	const [metadata, setMetadata] = useState(null);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const stateRef = React.useRef({
		initialized: false,
		baseWavImageW: 0,
		baseWavImageH: 0,
		zoom: 0,
		zoomFactor: .1,
		panOffsetX: 0,
		panOffsetY: 0,
		zoomOffsetX: 0,
		zoomOffsetY: 0,
		factoredOffsetX: 0,
		factoredOffsetY: 0,
		pointerStartX: 0,
		pointerStartY: 0,
		wavX: 0,
		wavY: 0,
		wavW: 0,
		wavH: 0,
		lastCommand: "",
		selectedWavCamId: null,
		seqNum: -1,
		activeSeqNum: -1
	});

	const [isPanning, setIsPanning] = useState(false);

	useEffect(() => {
		if (open)
			dispatch(getWavCamState());
		return function cleanup() {
			//	-- returns on a useEffect are used for cleaning up like when we want to unsubscribe from something. React will only call it when it's time to clean up (unmount)--
		};
	}, [open]);

	useEffect(() => {
		if (initialFrameReceived === true) {
			syncStream();
		}
		return function cleanup() {
			//	-- returns on a useEffect are used for cleaning up like when we want to unsubscribe from something. React will only call it when it's time to clean up (unmount)--
		};
	}, [initialFrameReceived]);

	useEffect(() => {
		if (wavImageContainerRef.current && wavOverlayContainerRef.current) {
			if (initialSyncComplete) {
				wavImageContainerRef.current.style.visibility = "visible";
				wavOverlayContainerRef.current.style.visibility = "visible";
			}
			else {
				wavImageContainerRef.current.style.visibility = "hidden";
				wavOverlayContainerRef.current.style.visibility = "hidden";
			}
		}
		return function cleanup() {
			//	-- returns on a useEffect are used for cleaning up like when we want to unsubscribe from something. React will only call it when it's time to clean up (unmount)--
		};
	}, [initialSyncComplete]);

	const getFullImageSize = (meta, newW = null) => {
		meta = meta ? meta : metadata;
		const horzExtent = parseInt(meta["x-wavcam-horizontal-extents"]);
		const vertExtent = parseInt(meta["x-wavcam-vertical-extents"]);
		const pixHPerPixW = vertExtent / horzExtent;

		const fullScaleW = Math.round(stateRef.current.baseWavImageW + (stateRef.current.baseWavImageW * stateRef.current.zoom));
		const fullScaleH = fullScaleW * pixHPerPixW;
		const containerH = wavContainerRef.current.offsetHeight;
		const offsetTop = containerH > fullScaleH ? ((containerH - fullScaleH) / 2) : 0;

		const maxWavImageW = (stateRef.current.baseWavImageW * 2);

		const virtualXOffset = stateRef.current.wavX > 0 ? wavImageContainerRef.current.offsetWidth - maxWavImageW : 0;
		const offsetX = (fullScaleW <= maxWavImageW ? 0 : (fullScaleW - virtualXOffset) * stateRef.current.wavX); /* + stateRef.current.factoredOffsetX; */

		return [fullScaleW, fullScaleH, offsetX, offsetTop, pixHPerPixW];
	};

	const updateMetadata = function (meta) {
		if (meta) {
			const imgSize = getFullImageSize(meta);
			const md = {
				...meta, ...{
					"wav-image-w": imgSize[0],
					"wav-image-h": imgSize[1],
					"wav-container-offset-x": imgSize[2],
					"wav-container-offset-y": imgSize[3],
					"wav-container-w": wavImageContainerRef.current.offsetWidth,
					"wav-container-h": wavImageContainerRef.current.offsetHeight,
					"wav-container-x": wavImageContainerRef.current.offsetLeft,
					"wav-container-y": wavImageContainerRef.current.offsetTop,
					"wav-container-base-w": stateRef.current.baseWavImageW,
					"wav-container-base-h": stateRef.current.baseWavImageH
				}
			};

			md["x-wavcam-lat"] = selectedWavCam.config.lat || md["x-wavcam-lat"];
			md["x-wavcam-lon"] = selectedWavCam.config.lon || md["x-wavcam-lon"];
			md["x-wavcam-az"] = selectedWavCam.config.az || md["x-wavcam-az"];
			md["x-wavcam-el"] = selectedWavCam.config.el || md["x-wavcam-el"];
			md["x-wavcam-camera-az"] = selectedWavCam.config.az || md["x-wavcam-camera-az"];
			md["x-wavcam-camera-el"] = selectedWavCam.config.el || md["x-wavcam-camera-el"];
			md["x-wavcam-alt"] = selectedWavCam.config.alt || md["x-wavcam-alt"];
			md["x-wavcam-height"] = selectedWavCam.config.height || md["x-wavcam-height"];
			md["x-wavcam-hfov"] = selectedWavCam.config.hfov || md["x-wavcam-hfov"];
			md["x-wavcam-vfov"] = selectedWavCam.config.vfov || md["x-wavcam-vfov"];
			md["x-wavcam-horizontal-extents"] = selectedWavCam.config.horzExtent || md["x-wavcam-horizontal-extents"];
			md["x-wavcam-vertical-extents"] = selectedWavCam.config.vertExtent || md["x-wavcam-vertical-extents"];

			setMetadata(md);
			wavOverlayRef.current.refresh(md);
			dispatch(setWavPanoState(stateRef.current.selectedWavCamId, { ...md, ...{ stateRef: stateRef.current } }, showWavCamLabels));
		}
	};

	const calcWavSlice = function (tempMetadata) {

		const md = tempMetadata || metadata;
		if (!md) return;

		const horzExtent = parseInt(md["x-wavcam-horizontal-extents"]);
		const vertExtent = parseInt(md["x-wavcam-vertical-extents"]);
		const pixHPerPixW = vertExtent / horzExtent;

		// Full scale image - determine what portion is within current -> max container size
		const fullScaleW = Math.round(stateRef.current.baseWavImageW + (stateRef.current.baseWavImageW * stateRef.current.zoom));
		const fullScaleH = fullScaleW * pixHPerPixW;

		const maxOffsetX = (stateRef.current.baseWavImageW / 2);
		const maxOffsetY = (stateRef.current.baseWavImageH / 2);

		const maxWavImageW = (stateRef.current.baseWavImageW * 2);
		const maxWavImageH = (stateRef.current.baseWavImageH * 2);

		const wavW = fullScaleW < maxWavImageW ? 1 : maxWavImageW / fullScaleW;
		const wavH = fullScaleH < maxWavImageH ? 1 : maxWavImageH / fullScaleH;

		// Calculate wavX on center - Zero if max zoom offset not reached otherwise diff from max as a percentage of the full image
		let wavX = Math.abs(stateRef.current.zoomOffsetX) < maxOffsetX ? 0 : (Math.abs(stateRef.current.zoomOffsetX) - maxOffsetX) / fullScaleW;
		// first take delta between image width at full scale and max image width
		if (wavX > 0) {
			// Percentage delta from center used to offset wavX percentage
			const overflowW = (fullScaleW - maxWavImageW) / 2;
			const percentOffset = stateRef.current.panOffsetX / overflowW;
			// If percentOffset > 1 then we have exceeded - anything exceeded now needs to apply to containerX with wavX staying fixed at 0 or 1
			if (percentOffset > 1) {
				wavX = 0;
				stateRef.current.factoredOffsetX = stateRef.current.panOffsetX - overflowW;
			}
			else if (percentOffset < -1) {
				wavX = 1 - wavW;
				stateRef.current.factoredOffsetX = stateRef.current.panOffsetX + overflowW;
			}
			else {
				wavX = wavX - (wavX * percentOffset);
				stateRef.current.factoredOffsetX = 0;
			}
		}
		else {
			stateRef.current.factoredOffsetX = stateRef.current.panOffsetX; //0;
		}

		let wavY = Math.abs(stateRef.current.zoomOffsetY) < maxOffsetY ? 0 : (Math.abs(stateRef.current.zoomOffsetX) - maxOffsetY) / fullScaleH;
		if (wavY > 0) {
			// Percentage delta from center used to offset wavY percentage
			const overflowH = (fullScaleH - maxWavImageH) / 2;
			const percentOffset = stateRef.current.panOffsetY / overflowH;
			// If percentOffset > 1 then we have exceeded - anything exceeded now needs to apply to containerY with wavY staying fixed at 0 or 1
			if (percentOffset > 1) {
				wavY = 0;
				stateRef.current.factoredOffsetY = stateRef.current.panOffsetY - overflowH;
			}
			else if (percentOffset < -1) {
				wavY = 1 - wavH;
				stateRef.current.factoredOffsetY = stateRef.current.panOffsetY + overflowH;
			}
			else {
				wavY = wavY - (wavY * percentOffset);
				stateRef.current.factoredOffsetY = 0;
			}
		}
		else {
			stateRef.current.factoredOffsetY = stateRef.current.panOffsetY; //0;
		}

		wavX = wavX > 1 - wavW ? 1 - wavW : wavX;
		wavY = wavY > 1 - wavH ? 1 - wavH : wavY;

		stateRef.current.wavX = wavX;
		stateRef.current.wavY = wavY;
		stateRef.current.wavW = wavW;
		stateRef.current.wavH = wavH;

		const winW = Math.round(fullScaleW < maxWavImageW ? fullScaleW : maxWavImageW);
		const winH = Math.round(fullScaleH < maxWavImageH ? fullScaleH : maxWavImageH);

		return {
			wavX: wavX,
			wavY: wavY,
			wavW: wavW,
			wavH: wavH,
			winW: winW,
			winH: winH
		};

	};

	const syncStream = function (tempMetadata) {
		const slice = calcWavSlice(tempMetadata);
		if (slice) {
			let cmd = `x=${slice.wavX}&y=${slice.wavY}&w=${slice.wavW}&h=${slice.wavH}&windowWidth=${slice.winW}&windowHeight=${slice.winH}`;
			// -- always allow first otherwise don't execute duplicate commands
			if (stateRef.current.seqNum === -1 || (cmd !== stateRef.current.lastCommand)) {
				stateRef.current.lastCommand = cmd;
				cmd += `&seqNum=${stateRef.current.seqNum + 1}`;
				stateRef.current.seqNum += 1;
				cameraService.virtualCommand(
					stateRef.current.selectedWavCamId,
					metadata,
					cmd
				);
			}
		}
	};


	const handleCameraZoomIn = (evt) => {
		stateRef.current.zoom = parseFloat((stateRef.current.zoom + stateRef.current.zoomFactor).toFixed(1)); // maybe need a max here???
		scaleImage(stateRef.current.zoomFactor);
		calcZoom(stateRef.current.zoom);
	};

	const handleCameraZoomOut = (evt) => {
		if (parseFloat((stateRef.current.zoom).toFixed(1)) > 0) {
			stateRef.current.zoom = parseFloat((stateRef.current.zoom - stateRef.current.zoomFactor).toFixed(1));
			scaleImage(stateRef.current.zoomFactor * -1);
			calcZoom(stateRef.current.zoom);
		}
	};

	const syncStreamDebounce = debounce(syncStream, 2000);

	const scaleImage = function (scaleDelta) {
		const deltaWidth = stateRef.current.baseWavImageW * scaleDelta;
		const newW = wavImageContainerRef.current.offsetWidth + deltaWidth;

		const fsMetadata = getFullImageSize(metadata, newW);

		const deltaHeight = (fsMetadata[4] * newW) - (fsMetadata[4] * wavImageContainerRef.current.offsetWidth);

		const newH = wavImageContainerRef.current.offsetHeight + (fsMetadata[1] < stateRef.current.baseWavImageH ? 0 : deltaHeight);
		const newL = wavImageContainerRef.current.offsetLeft - (deltaWidth / 2);
		const newT = wavImageContainerRef.current.offsetTop - (fsMetadata[1] < stateRef.current.baseWavImageH ? 0 : (deltaHeight / 2));

		wavImageContainerRef.current.style.width = newW + "px";
		wavImageContainerRef.current.style.height = newH + "px";
		wavImageContainerRef.current.style.left = newL + "px";
		wavImageContainerRef.current.style.top = newT + "px";

		wavOverlayContainerRef.current.style.width = newW + "px";
		wavOverlayContainerRef.current.style.height = newH + "px";
		wavOverlayContainerRef.current.style.left = newL + "px";
		wavOverlayContainerRef.current.style.top = newT + "px";
		updateMetadata(metadata);
		syncStreamDebounce();
	};

	const calcZoom = function (z) {
		const newW = Math.round(stateRef.current.baseWavImageW + (stateRef.current.baseWavImageW * z));
		const fsMetadata = getFullImageSize(metadata, newW);
		const newH = fsMetadata[1] > stateRef.current.baseWavImageH ? fsMetadata[1] : stateRef.current.baseWavImageH;

		stateRef.current.zoomOffsetX = Math.round((newW - stateRef.current.baseWavImageW) / 2) * -1;
		stateRef.current.zoomOffsetY = Math.round((newH - stateRef.current.baseWavImageH) / 2) * -1;
	};

	const imageChange = (meta, imgDimensions) => {
		if (stateRef.current.selectedWavCamId !== null && selectedWavCam.id !== stateRef.current.selectedWavCamId) {
			return;
		}
		// Center if dimensions of image are beyond dimensions of max W/H
		const currentSeqNum = parseInt(meta["x-wavcam-last-seq-number"]);
		if ((!stateRef.current.initialized) || currentSeqNum > stateRef.current.activeSeqNum) {

			const horzExtent = parseInt(meta["x-wavcam-horizontal-extents"]);
			const vertExtent = parseInt(meta["x-wavcam-vertical-extents"]);
			const pixHPerPixW = vertExtent / horzExtent;

			// Full scale image - determine what portion is within current -> max container size
			const fullScaleW = Math.round(stateRef.current.baseWavImageW + (stateRef.current.baseWavImageW * stateRef.current.zoom));
			const fullScaleH = fullScaleW * pixHPerPixW;

			const maxWavImageW = (stateRef.current.baseWavImageW * 2);
			const maxWavImageH = (stateRef.current.baseWavImageH * 2);

			const winW = Math.round(fullScaleW < maxWavImageW ? fullScaleW : maxWavImageW);
			let winH = Math.round(fullScaleH < maxWavImageH ? fullScaleH : maxWavImageH);
			winH = winH < stateRef.current.baseWavImageH ? stateRef.current.baseWavImageH : winH;

			const left = (((winW - stateRef.current.baseWavImageW) / 2) * -1) + stateRef.current.factoredOffsetX;
			const top = (((winH - stateRef.current.baseWavImageH) / 2) * -1) + stateRef.current.factoredOffsetY; //+ stateRef.current.panOffsetY;

			wavImageContainerRef.current.style.width = winW + "px";
			wavImageContainerRef.current.style.height = winH + "px";
			wavImageContainerRef.current.style.left = `${left}px`;
			wavImageContainerRef.current.style.top = `${top}px`;

			wavOverlayContainerRef.current.style.width = winW + "px";
			wavOverlayContainerRef.current.style.height = winH + "px";
			wavOverlayContainerRef.current.style.left = `${left}px`;
			wavOverlayContainerRef.current.style.top = `${top}px`;
			stateRef.current.activeSeqNum = currentSeqNum;
			updateMetadata(meta);
			stateRef.current.initialized = true;
			// if I set initial call to fetch frame from here (streamUrl) then it could load correct initial image
			// I can make an optional setStreamUrl from here
			if (!initialFrameReceived) {
				setInitialFrameReceived(true);
			}
			if (stateRef.current.seqNum === 0) {
				setInitialSyncComplete(true);
			}
		}
		// if(initialFrameReceived) {
		// 	startFOVItemStream(selectedWavCam.id, "wavcam");
		// }
	};

	const handleZoomStop = () => {
	};

	const _onPointerDown = (e) => {
		setIsPanning(true);
		stateRef.current.pointerStartX = e.clientX;
		stateRef.current.pointerStartY = e.clientY;
	};

	const _onPointerUp = (e) => {
		setIsPanning(false);
		updateMetadata(metadata);
		syncStreamDebounce();
	};

	const _onPointerMove = (e) => {
		e.nativeEvent.stopImmediatePropagation();

		// TODO: Add limits so can't pan beyond edges of image (Based off Full Image Size even cropped)
		if (isPanning && wavImageContainerRef.current) {

			const movementX = e.clientX - stateRef.current.pointerStartX;
			const movementY = e.clientY - stateRef.current.pointerStartY;

			const pOX = stateRef.current.panOffsetX + movementX;
			const pOY = stateRef.current.panOffsetY + movementY;

			stateRef.current.panOffsetX = pOX;
			stateRef.current.panOffsetY = pOY;

			const newL = wavImageContainerRef.current.offsetLeft + movementX;
			const newT = wavImageContainerRef.current.offsetTop + movementY;

			wavImageContainerRef.current.style.left = `${newL}px`;
			wavImageContainerRef.current.style.top = `${newT}px`;
			wavOverlayContainerRef.current.style.left = `${newL}px`;
			wavOverlayContainerRef.current.style.top = `${newT}px`;

			stateRef.current.pointerStartX = e.clientX;
			stateRef.current.pointerStartY = e.clientY;

		}
	};

	const _onMouseWheel = (e) => {
		e.deltaY < 0 ? handleCameraZoomIn() : handleCameraZoomOut();
	};

	const collapseEntered = function (elem, isAppearing) {
		if (stateRef.current.selectedWavCamId === null)
			stateRef.current.selectedWavCamId = wavCamPersistedState ? wavCamPersistedState.selectedWavCam : selectedWavCam.id;
		const meta = wavCamPersistedState ? wavCamPersistedState.wavCamMetadata[stateRef.current.selectedWavCamId] : null;
		let w = wavContainerRef.current.offsetWidth;
		let h = wavContainerRef.current.offsetHeight;
		let x = 0;
		let y = 0;
		if (meta) {
			showWavCamLabels = wavCamPersistedState.showLabels || true;
			delete meta["x-wavcam-image-control-endpoint"];
			delete meta["x-wavcam-image-endpoint"];
			delete meta["x-wavcam-instance-control-endpoint"];
			delete meta["x-wavcam-last-seq-number"];
			delete meta.stateRef.selectedWavCamId;
			stateRef.current = { ...stateRef.current, ...meta.stateRef };
			stateRef.current.initialized = false;
			stateRef.current.lastCommand = "";
			stateRef.current.seqNum = -1;
			stateRef.current.activeSeqNum = -1;
			w = meta["wav-container-w"];
			h = meta["wav-container-h"];
			x = meta["wav-container-x"];
			y = meta["wav-container-y"];
			//delete meta.stateRef;
			setMetadata(meta);
		}

		stateRef.current.baseWavImageW = wavContainerRef.current.offsetWidth;
		stateRef.current.baseWavImageH = wavContainerRef.current.offsetHeight;

		wavOverlayContainerRef.current.style.width = wavImageContainerRef.current.style.width = `${w}px`;
		wavOverlayContainerRef.current.style.height = wavImageContainerRef.current.style.height = `${h}px`;
		wavOverlayContainerRef.current.style.left = wavImageContainerRef.current.style.left = `${x}px`;
		wavOverlayContainerRef.current.style.top = wavImageContainerRef.current.style.top = `${y}px`;

		dispatch(startFOVItemStream(stateRef.current.selectedWavCamId, "wavcam"));

		setInitialized(true);
	};

	const collapseExited = function (elem) {
		resetState();
	};

	const setLabelVisibility = function (isVisible) {
		dispatch(toggleWavCamLabels());
		dispatch(setWavPanoState(selectedWavCam.id, metadata, isVisible));
	};

	const resetState = function () {
		setMetadata(null);

		stateRef.current.initialized = false;
		stateRef.current.baseWavImageW = 0;
		stateRef.current.baseWavImageH = 0;
		stateRef.current.zoom = 0;
		stateRef.current.panOffsetX = 0;
		stateRef.current.panOffsetY = 0;
		stateRef.current.zoomOffsetX = 0;
		stateRef.current.zoomOffsetY = 0;
		stateRef.current.factoredOffsetX = 0;
		stateRef.current.factoredOffsetY = 0;
		stateRef.current.pointerStartX = 0;
		stateRef.current.pointerStartY = 0;
		stateRef.current.wavX = 0;
		stateRef.current.wavY = 0;
		stateRef.current.wavW = 0;
		stateRef.current.wavH = 0;
		stateRef.current.lastCommand = "";

		setInitialFrameReceived(false);
		setInitialSyncComplete(false);
		stateRef.current.activeSeqNum = -1;
		stateRef.current.seqNum = -1;
	};

	return (
		<Collapse
			in={open}
			mountOnEnter
			unmountOnExit
			onEntered={collapseEntered}
			onExited={collapseExited}
			width={1}
		>
			<div>
				<Drawer PaperProps={{ style: { right: 48, top: 48, height: 240 } }} anchor={dir == "rtl" ? "left" : "right"} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
					<div role="presentation" style={{ paddingLeft: 16, paddingTop: 8, paddingRight: 16, backgroundColor: "rgb(31, 31, 33)", width: 300, height: "100%" }}>
						<h4><Translate value="global.dock.wavCam.main.wavCamOptions" /></h4>
						<List>
							<ListItem style={dir == "rtl" ? { paddingLeft: 0 } : { paddingRight: 0 }}>
								<ListItemText
									primary={getTranslation("global.dock.wavCam.main.wavCamLabels")}
									style={dir == "rtl" ? { textAlign: "right" } : {}}
								/>
								<Switch
									checked={showWavCamLabels}
									color="primary"
									onChange={(e, checked) =>
										setLabelVisibility(checked)
									}
								/>
							</ListItem>
							<ListItem>
								<SelectField
									id={"WavCam-selection"}
									label={getTranslation("global.dock.wavCam.main.selectWavCam")}
									handleChange={(e) => {
										resetState();
										dispatch(setSelectedWavCam(e.target.value));
										stateRef.current.selectedWavCamId = e.target.value;
										collapseEntered(null, true);
									}}
									value={selectedWavCam ? selectedWavCam.id : null}
									items={wavCams}
									dir={dir}
								/>
							</ListItem>
						</List>
					</div>
				</Drawer>
			</div>
			<div style={styles.containerStyle}>
				{!initialSyncComplete && <CircularProgress style={dir == "rtl" ? { position: "absolute", right: "50%" } : { position: "absolute", left: "50%" }} />}
				<div style={dir == "rtl" ? styles.wavImageContainerRTL : styles.wavImageContainer} ref={wavContainerRef}
					onPointerDown={_onPointerDown}
					onPointerMove={_onPointerMove}
					onPointerUp={_onPointerUp}
					onWheel={_onMouseWheel}
				>
					<div style={styles.wavImageInnerContainer} ref={wavImageContainerRef}>
						{wavImageContainerRef.current && (
							<WSImagePlayer
								ref={imagePlayerRef}
								cameraId={selectedWavCam.id}
								instanceId={selectedWavCam.instanceId}
								videoProfile="desktop"
								imageChange={imageChange}
								fullscreen={false}
								displayProgress={false}
							/>
						)}
					</div>
					<div style={styles.wavImageInnerContainer} ref={wavOverlayContainerRef}>
						{wavImageContainerRef.current && (
							<WavCamOverlay imageMetadata={metadata} fovItems={context ? context.fovItems : []} visible={showWavCamLabels} ref={wavOverlayRef} />
						)}
					</div>
				</div>
				<div style={dir == "rtl" ? styles.wavCamControlsContainerRTL : styles.wavCamControlsContainer}>
					<div style={dir == "rtl" ? styles.wavCamControlsContainerRTL : styles.wavCamControlsContainer}>
						<IconButton style={{ paddingTop: 12 }} onClick={() => dispatch(toggleWavCam())} >
							<SvgIcon style={styles.controlButtons}>
								<path d={mdiCloseCircle} />
							</SvgIcon>
						</IconButton>
						<div style={styles.zoomControlsContainer}>
							<IconButton style={{ paddingBottom: 6 }}
								onMouseDown={handleCameraZoomIn}
								onMouseUp={handleZoomStop}
							>
								<AddBox style={styles.controlButtons} />
							</IconButton>
							<IconButton style={{ paddingTop: 6 }}
								onMouseDown={handleCameraZoomOut}
								onMouseUp={handleZoomStop}
							>
								<SvgIcon style={styles.controlButtons}>
									<path d={mdiMinusBox} />
								</SvgIcon>
							</IconButton>
						</div>
						<IconButton style={{ paddingBottom: 12 }} onClick={() => setDrawerOpen(!drawerOpen)}>
							<MenuOpen style={styles.controlButtons} />
						</IconButton>
					</div>
				</div>
			</div>
		</Collapse>

	);
};

export default WavCam;