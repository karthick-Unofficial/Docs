import React, { Component, Fragment } from "react";

import { IconButton, FlatButton } from "material-ui";
import ChevronLeft from "material-ui/svg-icons/navigation/chevron-left";
import ChevronRight from "material-ui/svg-icons/navigation/chevron-right";
import ViewList from "material-ui/svg-icons/action/view-list";
import Close from "material-ui/svg-icons/content/clear";

import $ from "jquery";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

class ContextPanel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			secondaryExpand: false
		};
	}

	componentDidMount() {
		const { setMapOffset, primaryOpen, dir } = this.props;
		const primaryWidth = dir && dir == "rtl" ? $(".dock-controlRTL").outerWidth() / 2 : $(".dock-control").outerWidth() / 2;

		// -- set initial offset when app starts with primary open
		if (primaryOpen) {
			setMapOffset(primaryWidth);
		}
	}

	toggleSecondaryExpand = () => {
		const {
			expandSecondary,
			shrinkSecondary,
			context
		} = this.props;

		this.setState({
			secondaryExpand: !this.state.secondaryExpand
		});

		if (!this.state.secondaryExpand === true) {
			if (context) expandSecondary();
		} else if (!this.state.secondaryExpand === false) {
			if (context) shrinkSecondary();
		}
	};

	handleLastEntityClick = () => {
		const { history, viewPrevious } = this.props;

		viewPrevious(history);
	};

	componentDidUpdate(prevProps, prevState) {
		const {
			setMapOffset,
			primaryOpen,
			secondaryOpen,
			clearViewingHistory,
			dir
		} = this.props;
		const primaryWidth = dir && dir === "rtl" ? $(".dock-controlRTL").outerWidth() / 2 : $(".dock-control").outerWidth() / 2;
		const secondaryWidth = dir && dir === "rtl" 
			? ($(".secondary-panelRTL").length ? $(".secondary-panelRTL").outerWidth() / 2 : 0)
			: ($(".secondary-panel").length ? $(".secondary-panel").outerWidth() / 2 : 0);

		if (prevProps.primaryOpen && !primaryOpen) {
			setMapOffset(-primaryWidth);
		}
		if (!prevProps.primaryOpen && primaryOpen) {
			setMapOffset(primaryWidth);
		}
		if (!prevProps.secondaryOpen && secondaryOpen) {
			this.setState({
				secondaryWidth: secondaryWidth
			});
			setMapOffset(secondaryWidth);
		}
		if (prevProps.secondaryOpen && !secondaryOpen) {
			setMapOffset(secondaryWidth ? -secondaryWidth : this.state.secondaryWidth ? -this.state.secondaryWidth : 0);
			clearViewingHistory();
			this.setState({
				secondaryWidth: 0
			});
		}
		// -- if secondary already open and secondary width changes, update offset
		if (prevProps.secondaryOpen && secondaryOpen && secondaryWidth !== this.state.secondaryWidth) {
			const offsetDiff = secondaryWidth - this.state.secondaryWidth;
			this.setState({
				secondaryWidth: secondaryWidth
			});
			setMapOffset(offsetDiff);
		}
	}

	handleMobileToggle = toggle => {
		const {
			closePrimary,
			_closeSecondary,
			openPrimary,
			openSecondary,
			context
		} = this.props;

		if (toggle === "open") {
			openPrimary();
			if (context) openSecondary();
		} else if (toggle === "close") {
			closePrimary();
			if (context) _closeSecondary();
		}
	};

	render() {
		const {
			primaryOpen,
			secondaryOpen,
			hidden,
			children,
			closePrimary,
			openPrimary,
			actionButtons,
			className,
			secondaryClassName,
			secondaryCloseAction,
			closeSecondary,
			history,
			mapVisible,
			readOnly,
			context,
			// TODO: Standardize across apps
			mobileToggle,
			WavCamOpen,
			dir
		} = this.props;

		const { secondaryExpand } = this.state;

		const showMobileToggle = mapVisible && $(window).width() <= 1023;

		const secondaryStyling = {
			height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
		};
		if (readOnly) dir == "rtl" ? secondaryStyling.right = secondaryExpand ? -600 : -360 :  secondaryStyling.left = secondaryExpand ? -600 : -360;

		return !hidden ? (
			<Fragment>
				<div
					style={dir && dir == "rtl" ? { right: readOnly ? -360 : 0 } : { left: readOnly ? -360 : 0 }}
					className={`${dir && dir == "rtl" ? "dock-controlRTL" : "dock-control"} ${primaryOpen || (showMobileToggle && secondaryOpen) ? "open" : "closed" }`}
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
									onClick={() => this.handleMobileToggle("close")}
								/>
							) : (
								<FlatButton
									label={context ? getTranslation("global.contextPanel.openProfile") : getTranslation("global.contextPanel.openListPanel")}
									primary={true}
									onClick={() => this.handleMobileToggle("open")}
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
									onClick={() => this.handleMobileToggle("close")}
								/>
							) : (
								<FlatButton
									label={mobileToggle.openLabel}
									primary={true}
									onClick={() => this.handleMobileToggle("open")}
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
								${this.state.secondaryExpand ? "arrow-expanded" : ""}`}
								onClick={closePrimary}
							>
								{dir && dir  == "rtl" ? <ChevronRight className={`close-arrow
								${primaryOpen ? "" : "close-arrow-removed"}
								`} color="#fff" style={dir && dir == "rtl" ? { right: "-150%" } : {}} /> :  <ChevronLeft className={`close-arrow
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
										onClick={this.handleLastEntityClick}
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
								<IconButton onClick={this.toggleSecondaryExpand}>
									{this.state.secondaryExpand &&
										(dir && dir == "rtl" ? <ChevronRight className="close-expand" /> : <ChevronLeft className="close-expand" />)
									}
									{!this.state.secondaryExpand &&
										(dir && dir == "rtl" ? <ChevronLeft className="open-expand" /> : <ChevronRight className="open-expand" />)
									}
								</IconButton>
							</div>
							<div className="profile-close-button">
								<IconButton onClick={!secondaryCloseAction ? closeSecondary : () => {
									closeSecondary();
									secondaryCloseAction();
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
	}
}

export default ContextPanel;
