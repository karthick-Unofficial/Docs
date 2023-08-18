import React, { Fragment, useEffect, useRef, useState } from "react";

import { IconButton, FlatButton } from "material-ui";
import ChevronLeft from "material-ui/svg-icons/navigation/chevron-left";
import ChevronRight from "material-ui/svg-icons/navigation/chevron-right";
import ViewList from "material-ui/svg-icons/action/view-list";
import Close from "material-ui/svg-icons/content/clear";

import $ from "jquery";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { contextPanelState, viewingHistorySelector, selectedContextSelector } from "./Selectors";
import { setMapOffset } from "../AppState/Actions";
import * as actionCreators from "./Actions";

const ContextPanel = ({
	dir,
	hidden,
	children,
	actionButtons,
	className,
	secondaryClassName,
	secondaryCloseAction,
	readOnly,
	mobileToggle
}) => {
	const dispatch = useDispatch();
	const { expandSecondary,
		shrinkSecondary,
		viewPrevious,
		clearViewingHistory,
		_closeSecondary,
		openPrimary,
		openSecondary,
		closePrimary,
		closeSecondary } = actionCreators;

	const panelState = useSelector(state => contextPanelState(state));
	const primaryOpen = panelState ? panelState.primaryOpen : null;
	const secondaryOpen = panelState && ($(".secondary-panel").length || $(".secondary-panelRTL").length) ? panelState.secondaryOpen : null;
	const history = useSelector(state => viewingHistorySelector(state));
	const context = useSelector(state => Boolean(selectedContextSelector(state)));
	const mapVisible = useSelector(state => state.mapState ? state.mapState.baseMap.visible : false);
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);

	const [secondaryExpand, setSecondaryExpand] = useState(false);
	const [secondaryWidth, setSecondaryWidth] = useState();
	const prevPropsPrimaryOpen = useRef();
	const prevPropsSecondaryOpen = useRef();

	useEffect(() => {
		prevPropsPrimaryOpen.current = primaryOpen;
		prevPropsSecondaryOpen.current = secondaryOpen;
	}, [primaryOpen, secondaryOpen]);


	useEffect(() => {
		const primaryWidth = dir && dir == "rtl" ? $(".dock-controlRTL").outerWidth() / 2 : $(".dock-control").outerWidth() / 2;
		// -- set initial offset when app starts with primary open
		if (primaryOpen) {
			dispatch(setMapOffset(primaryWidth));
		}
	}, []);


	const toggleSecondaryExpand = () => {
		setSecondaryExpand(!secondaryExpand);
		if (!secondaryExpand === true) {
			if (context) dispatch(expandSecondary());
		} else if (!secondaryExpand === false) {
			if (context) dispatch(shrinkSecondary());
		}
	};

	const handleLastEntityClick = () => {
		dispatch(viewPrevious(history));
	};

	useEffect(() => {
		const primaryWidth = dir && dir === "rtl" ? $(".dock-controlRTL").outerWidth() / 2 : $(".dock-control").outerWidth() / 2;
		const SecondaryWidth = dir && dir === "rtl"
			? ($(".secondary-panelRTL").length ? $(".secondary-panelRTL").outerWidth() / 2 : 0)
			: ($(".secondary-panel").length ? $(".secondary-panel").outerWidth() / 2 : 0);

		if (prevPropsPrimaryOpen && !primaryOpen) {
			dispatch(setMapOffset(-primaryWidth));
		}
		if (!prevPropsPrimaryOpen && primaryOpen) {
			dispatch(setMapOffset(primaryWidth));
		}
		if (!prevPropsSecondaryOpen && secondaryOpen) {
			setSecondaryWidth(SecondaryWidth);
			dispatch(setMapOffset(SecondaryWidth));
		}
		if (prevPropsSecondaryOpen && !secondaryOpen) {
			dispatch(setMapOffset(SecondaryWidth ? -SecondaryWidth : secondaryWidth ? -secondaryWidth : 0));
			dispatch(clearViewingHistory());
			setSecondaryWidth(0);
		}
		// -- if secondary already open and secondary width changes, update offset
		if (prevPropsSecondaryOpen && secondaryOpen && secondaryWidth !== secondaryWidth) {
			const offsetDiff = SecondaryWidth - secondaryWidth;
			setSecondaryWidth(SecondaryWidth);
			dispatch(setMapOffset(offsetDiff));
		}
	}, [primaryOpen, secondaryOpen]);

	const handleMobileToggle = toggle => {
		if (toggle === "open") {
			dispatch(openPrimary());
			if (context) openSecondary();
		} else if (toggle === "close") {
			dispatch(closePrimary());
			if (context) dispatch(_closeSecondary());
		}
	};

	const showMobileToggle = mapVisible && $(window).width() <= 1023;

	const secondaryStyling = {
		height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
	};
	if (readOnly) dir == "rtl" ? secondaryStyling.right = secondaryExpand ? -600 : -360 : secondaryStyling.left = secondaryExpand ? -600 : -360;

	return !hidden ? (
		<Fragment>
			<div
				style={dir && dir == "rtl" ? { right: readOnly ? -360 : 0 } : { left: readOnly ? -360 : 0 }}
				className={`${dir && dir == "rtl" ? "dock-controlRTL" : "dock-control"} ${primaryOpen || (showMobileToggle && secondaryOpen) ? "open" : "closed"}`}
			>
				{/*
					 * TODO: Standardize across apps. Currently Context Panel is only rendering when map is visible.
					 * Content Manager requires a mobile toggle as well.
					 * For now, Lists App is passing a mobile toggle object to control visibility, and button text (SEE BELOW).
					 */}
				{showMobileToggle && (
					<div id="toggle-mobile">
						{primaryOpen || secondaryOpen ? (
							<FlatButton
								label={getTranslation("global.contextPanel.viewMap")}
								primary={true}
								onClick={() => handleMobileToggle("close")}
							/>
						) : (
							<FlatButton
								label={context ? getTranslation("global.contextPanel.openProfile") : getTranslation("global.contextPanel.openListPanel")}
								primary={true}
								onClick={() => handleMobileToggle("open")}
							/>
						)}
					</div>
				)}
				{/* TODO: Standardize (SEE ABOVE) */}
				{mobileToggle && mobileToggle.visible && (
					<div id="toggle-mobile">
						{primaryOpen || secondaryOpen ? (
							<FlatButton
								label={mobileToggle.closeLabel}
								primary={true}
								onClick={() => handleMobileToggle("close")}
							/>
						) : (
							<FlatButton
								label={mobileToggle.openLabel}
								primary={true}
								onClick={() => handleMobileToggle("open")}
							/>
						)}
					</div>
				)}
				{!readOnly && (<div className={`dock-control-inner ${className}`}>
					{/* Primary */}
					{Array.isArray(children) ? children[0] : children}

					<div>
						{/*Chevron back arrow for closing panel*/}
						<IconButton
							className={`${dir && dir == "rtl" ? "hide-dockRTL" : "hide-dock"} ${secondaryOpen ? "profile-open" : "profile-closed"
								} ${primaryOpen ? "" : "arrow-removed"}
								${secondaryExpand ? "arrow-expanded" : ""}`}
							onClick={closePrimary}
						>
							{dir && dir == "rtl" ? <ChevronRight className={`close-arrow
								${primaryOpen ? "" : "close-arrow-removed"}
								`} color="#fff" style={dir && dir == "rtl" ? { right: "-150%" } : {}} /> : <ChevronLeft className={`close-arrow
								${primaryOpen ? "" : "close-arrow-removed"}
								`} color="#fff" />}
						</IconButton>
					</div>
				</div>)}
			</div>
			{/*Secondary*/}
			{children[1] && (
				<div
					style={secondaryStyling}
					className={`${dir && dir == "rtl" ? "secondary-panelRTL" : "secondary-panel"} scrollbar ${secondaryClassName}
							${secondaryOpen ? "open" : "closed"}
							${primaryOpen ? "list-open" : "list-closed"}
							${secondaryExpand ? "secondary-expanded" : ""}
							${showMobileToggle ? "mobile" : "desktop"} `
					}
				>
					<div className="profile-wrapper">
						{/* Back navigation */}
						{history.length >= 2 && (
							<div id="profile-navigation">
								<FlatButton
									onClick={handleLastEntityClick}
									icon={dir && dir == "rtl" ? <ChevronRight style={{ marginLeft: 0 }} /> : <ChevronLeft style={{ marginLeft: 0 }} />}
									label={
										history[1].name
											? history[1].name.toUpperCase()
											: history[1].id.toString().toUpperCase()
									}
									style={{
										width: "100%",
										textAlign: "left"
									}}
								/>
							</div>
						)}
						<div className="profile-expand-button">
							<IconButton onClick={toggleSecondaryExpand}>
								{secondaryExpand &&
									(dir && dir == "rtl" ? <ChevronRight className="close-expand" /> : <ChevronLeft className="close-expand" />)
								}
								{!secondaryExpand &&
									(dir && dir == "rtl" ? <ChevronLeft className="open-expand" /> : <ChevronRight className="open-expand" />)
								}
							</IconButton>
						</div>
						<div className="profile-close-button">
							<IconButton onClick={!secondaryCloseAction ? () => dispatch(closeSecondary()) : () => {
								dispatch(closeSecondary());
								dispatch(secondaryCloseAction());
							}}>
								<Close />
							</IconButton>
						</div>
						{children[1]}
					</div>
				</div>
			)}
			{/* Sidebar controls with buttons */}
			<div
				className={`${dir && dir == "rtl" ? "dock-controlRTL-sidebar" : "dock-control-sidebar"} ${primaryOpen ? "closed" : "open"}`}
			>
				<IconButton>
					<ViewList color="#fff" onClick={openPrimary} />
				</IconButton>
				{actionButtons &&
					actionButtons.map((button, index) => (
						<IconButton style={{ color: "#fff" }} key={index}>
							{button}
						</IconButton>
					))}
			</div>
		</Fragment>
	) : (
		<div />
	);
};

export default ContextPanel;
