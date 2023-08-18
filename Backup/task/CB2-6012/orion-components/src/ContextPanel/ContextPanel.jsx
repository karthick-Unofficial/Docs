import React, { Fragment, useEffect, useRef, useState } from "react";

import { IconButton, Button } from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ViewList from "@mui/icons-material/ViewList";
import Close from "@mui/icons-material/Close";

import $ from "jquery";
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { contextPanelState, viewingHistorySelector, selectedContextSelector } from "./Selectors";
import { setMapOffset } from "../AppState/Actions";
import * as actionCreators from "./Actions";
import { widgetStateSelector } from "orion-components/AppState/Selectors";

const usePrevious = (value) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
};

const ContextPanelWrapper = ({
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
	const panelState = useSelector((state) => contextPanelState(state));
	const primaryOpen = panelState ? panelState.primaryOpen : null;
	const secondaryOpen =
		panelState && ($(".secondary-panel").length || $(".secondary-panelRTL").length)
			? panelState.secondaryOpen
			: null;
	const history = useSelector((state) => viewingHistorySelector(state));
	const context = useSelector((state) => selectedContextSelector(state));
	const entity = context?.entity;
	const contextId = entity?.id;
	const mapVisible = useSelector((state) => (state.mapState ? state.mapState.baseMap.visible : false));
	const WavCamOpen = useSelector((state) => state.appState.dock.dockData.WavCam);
	const widgetState = useSelector((state) => state.appState?.persisted?.widgets);
	const layoutWidgetState = useSelector((state) => entity && widgetStateSelector(state)?.layoutControls) || {};

	return (
		<ContextPanel
			panelState={panelState}
			primaryOpen={primaryOpen}
			secondaryOpen={secondaryOpen}
			history={history}
			context={Boolean(context)}
			mapVisible={mapVisible}
			WavCamOpen={WavCamOpen}
			dir={dir}
			hidden={hidden}
			actionButtons={actionButtons}
			className={className}
			secondaryClassName={secondaryClassName}
			secondaryCloseAction={secondaryCloseAction}
			readOnly={readOnly}
			mobileToggle={mobileToggle}
			autoExpand={layoutWidgetState?.autoExpand}
			widgetState={widgetState}
			contextId={contextId}
		>
			{children}
		</ContextPanel>
	);
};

const ContextPanel = (props) => {
	const dispatch = useDispatch();

	const {
		primaryOpen,
		secondaryOpen,
		history,
		context,
		mapVisible,
		WavCamOpen,
		dir,
		hidden,
		children,
		actionButtons,
		className,
		secondaryClassName,
		secondaryCloseAction,
		readOnly,
		mobileToggle,
		autoExpand,
		contextId
	} = props;

	const {
		expandSecondary,
		shrinkSecondary,
		viewPrevious,
		clearViewingHistory,
		_closeSecondary,
		openPrimary,
		openSecondary,
		closePrimary,
		closeSecondary
	} = actionCreators;

	const prevProps = usePrevious(props);
	const [state, setState] = useState({
		secondaryExpand: false,
		secondaryWidth: null
	});

	useEffect(() => {
		const primaryWidth =
			dir && dir == "rtl" ? $(".dock-controlRTL").outerWidth() / 2 : $(".dock-control").outerWidth() / 2;
		// -- set initial offset when app starts with primary open
		if (primaryOpen) {
			dispatch(setMapOffset(primaryWidth));
		}
	}, []);

	useEffect(() => {
		setState((prevState) => ({
			...prevState,
			secondaryExpand: autoExpand
		}));
		dispatchSecondaryExpand(autoExpand);
	}, [autoExpand, contextId]);

	const dispatchSecondaryExpand = (expand) => {
		if (context) {
			if (expand) {
				dispatch(expandSecondary());
			} else {
				dispatch(shrinkSecondary());
			}
		}
	};

	const toggleSecondaryExpand = () => {
		setState((prevState) => ({
			...prevState,
			secondaryExpand: !state.secondaryExpand
		}));
		dispatchSecondaryExpand(!state.secondaryExpand);
	};

	const handleLastEntityClick = () => {
		dispatch(viewPrevious(history));
	};

	useEffect(() => {
		const primaryWidth =
			dir && dir === "rtl" ? $(".dock-controlRTL").outerWidth() / 2 : $(".dock-control").outerWidth() / 2;
		const secondaryWidth =
			dir && dir === "rtl"
				? $(".secondary-panelRTL").length
					? $(".secondary-panelRTL").outerWidth() / 2
					: 0
				: $(".secondary-panel").length
				? $(".secondary-panel").outerWidth() / 2
				: 0;

		if (prevProps) {
			if (prevProps.primaryOpen && !primaryOpen) {
				dispatch(setMapOffset(-primaryWidth));
			}
			if (!prevProps.primaryOpen && primaryOpen) {
				dispatch(setMapOffset(primaryWidth));
			}
			if (!prevProps.secondaryOpen && secondaryOpen) {
				setState((prevProps) => ({
					...prevProps,
					secondaryWidth: secondaryWidth
				}));
				dispatch(setMapOffset(secondaryWidth));
			}
			if (prevProps.secondaryOpen && !secondaryOpen) {
				dispatch(
					setMapOffset(secondaryWidth ? -secondaryWidth : state.secondaryWidth ? -state.secondaryWidth : 0)
				);
				dispatch(clearViewingHistory());
				setState((prevProps) => ({
					...prevProps,
					secondaryWidth: 0
				}));
			}
			// -- if secondary already open and secondary width changes, update offset
			if (prevProps.secondaryOpen && secondaryOpen && secondaryWidth !== state.secondaryWidth) {
				const offsetDiff = secondaryWidth - state.secondaryWidth;
				setState((prevProps) => ({
					...prevProps,
					secondaryWidth: secondaryWidth
				}));
				dispatch(setMapOffset(offsetDiff));
			}
		}
	}, [props]);

	const handleMobileToggle = (toggle) => {
		if (toggle === "open") {
			dispatch(openPrimary());
			if (context) dispatch(openSecondary());
		} else if (toggle === "close") {
			dispatch(closePrimary());
			if (context) dispatch(_closeSecondary());
		}
	};

	const { secondaryExpand } = state;

	const showMobileToggle = mapVisible && $(window).width() <= 1023;

	const secondaryStyling = {
		height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
	};
	if (readOnly)
		dir == "rtl"
			? (secondaryStyling.right = secondaryExpand ? -600 : -360)
			: (secondaryStyling.left = secondaryExpand ? -600 : -360);

	const styles = {
		dockControl: {
			...(dir === "ltr" && { left: readOnly ? -360 : 0 }),
			...(dir === "rtl" && { right: readOnly ? -360 : 0 })
		},
		chevronRight: {
			...(dir === "rtl" && { right: "-150%" })
		}
	};

	return !hidden ? (
		<Fragment>
			<div
				style={styles.dockControl}
				className={`${dir && dir == "rtl" ? "dock-controlRTL" : "dock-control"} ${
					primaryOpen || (showMobileToggle && secondaryOpen) ? "open" : "closed"
				}`}
			>
				{/*
				 * TODO: Standardize across apps. Currently Context Panel is only rendering when map is visible.
				 * Content Manager requires a mobile toggle as well.
				 * For now, Lists App is passing a mobile toggle object to control visibility, and button text (SEE BELOW).
				 */}
				{showMobileToggle && (
					<div id="toggle-mobile">
						{primaryOpen || secondaryOpen ? (
							<Button variant="text" color="primary" onClick={() => handleMobileToggle("close")}>
								{getTranslation("global.contextPanel.viewMap")}
							</Button>
						) : (
							<Button variant="text" color="primary" onClick={() => handleMobileToggle("open")}>
								{context
									? getTranslation("global.contextPanel.openProfile")
									: getTranslation("global.contextPanel.openListPanel")}
							</Button>
						)}
					</div>
				)}
				{/* TODO: Standardize (SEE ABOVE) */}
				{mobileToggle && mobileToggle.visible && (
					<div id="toggle-mobile">
						{primaryOpen || secondaryOpen ? (
							<Button variant="text" color="primary" onClick={() => handleMobileToggle("close")}>
								{mobileToggle.closeLabel}
							</Button>
						) : (
							<Button variant="text" color="primary" onClick={() => handleMobileToggle("open")}>
								{mobileToggle.openLabel}
							</Button>
						)}
					</div>
				)}
				{!readOnly && (
					<div className={`dock-control-inner ${className}`}>
						{/* Primary */}
						{Array.isArray(children) ? children[0] : children}

						<div>
							{/*Chevron back arrow for closing panel*/}
							<IconButton
								className={`
								${dir && dir == "rtl" ? "hide-dockRTL" : "hide-dock"}
								${secondaryOpen ? "profile-open" : "profile-closed"}
								${primaryOpen ? "" : "arrow-removed"}
								${state.secondaryExpand ? "arrow-expanded" : ""}`}
								onClick={() => dispatch(closePrimary())}
								style={{ borderRadius: "unset", height: 48 }}
							>
								{dir && dir == "rtl" ? (
									<ChevronRight
										className={`close-arrow ${primaryOpen ? "" : "close-arrow-removed"}`}
										color="#fff"
										style={styles.chevronRight}
									/>
								) : (
									<ChevronLeft
										className={`close-arrow ${primaryOpen ? "" : "close-arrow-removed"}`}
										color="#fff"
									/>
								)}
							</IconButton>
						</div>
					</div>
				)}
			</div>
			{/*Secondary*/}
			{children[1] && (
				<div
					style={secondaryStyling}
					className={`${
						dir && dir == "rtl" ? "secondary-panelRTL" : "secondary-panel"
					} scrollbar ${secondaryClassName}
							${secondaryOpen ? "open" : "closed"}
							${primaryOpen ? "list-open" : "list-closed"}
							${secondaryExpand ? "secondary-expanded" : ""}
							${showMobileToggle ? "mobile" : "desktop"} `}
				>
					<div className="profile-wrapper">
						{/* Back navigation */}
						{history.length >= 2 && (
							<div id="profile-navigation">
								<Button
									variant="text"
									color="primary"
									onClick={handleLastEntityClick}
									style={{
										width: "100%",
										height: "36px",
										textAlign: "left",
										justifyContent: "unset"
									}}
								>
									<div>
										{dir && dir == "rtl" ? (
											<ChevronRight
												style={{
													marginLeft: 0,
													verticalAlign: "middle"
												}}
											/>
										) : (
											<ChevronLeft
												style={{
													marginLeft: 0,
													verticalAlign: "middle"
												}}
											/>
										)}
										<span
											style={{
												verticalAlign: "middle",
												fontSize: "14px",
												fontWeight: "bold",
												padding: "0 16px 0 8px",
												letterSpacing: "0px"
											}}
										>
											{history[1].name
												? history[1].name.toString().toUpperCase()
												: history[1].id.toString().toUpperCase()}
										</span>
									</div>
								</Button>
							</div>
						)}
						<div className="profile-expand-button">
							<IconButton onClick={toggleSecondaryExpand} sx={{ color: "#fff" }}>
								{state.secondaryExpand &&
									(dir && dir == "rtl" ? (
										<ChevronRight className="close-expand" />
									) : (
										<ChevronLeft className="close-expand" />
									))}
								{!state.secondaryExpand &&
									(dir && dir == "rtl" ? (
										<ChevronLeft className="open-expand" />
									) : (
										<ChevronRight className="open-expand" />
									))}
							</IconButton>
						</div>
						<div className="profile-close-button">
							<IconButton
								onClick={
									!secondaryCloseAction
										? () => dispatch(closeSecondary())
										: () => {
												dispatch(closeSecondary());
												dispatch(secondaryCloseAction());
										  }
								}
								sx={{ color: "#fff" }}
							>
								<Close />
							</IconButton>
						</div>
						{children[1]}
					</div>
				</div>
			)}
			{/* Sidebar controls with buttons */}
			<div
				className={`${dir && dir == "rtl" ? "dock-controlRTL-sidebar" : "dock-control-sidebar"} ${
					primaryOpen ? "closed" : "open"
				}`}
			>
				<IconButton onClick={() => dispatch(openPrimary())}>
					<ViewList color="#fff" />
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

ContextPanel.displayName = "ContextPanel";

export default ContextPanelWrapper;
