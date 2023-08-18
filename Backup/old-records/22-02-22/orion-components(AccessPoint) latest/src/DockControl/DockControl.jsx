import React, { Component } from "react";

import { IconButton, FlatButton } from "material-ui";
import ChevronLeft from "material-ui/svg-icons/navigation/chevron-left";
import ViewList from "material-ui/svg-icons/action/view-list";
import Close from "material-ui/svg-icons/content/clear";

class DockControl extends Component {
	constructor(props) {
		super(props);

		this.state = {
			primaryOpen: true,
			secondaryOpen: false,
			hideSecondary: false
		};
	}

	togglePrimaryOpen = () => {
		this.setState({
			primaryOpen: !this.state.primaryOpen
			// secondaryOpen: !this.state.primaryOpen
		});
	};

	handleLastEntityClick = () => {
		const { history } = this.props;
		const entity = history[history.length - 2];

		this.props.viewLastProfile(entity);
	};

	// Presence of open prop determines whether or not DockControl is being used as a controlled component or not.
	// If no open prop, manages own state and uses own click handlers. If open prop, all those have to be passed in manually.
	render() {
		const {
			open,
			secondaryOpen,
			hidden,
			children,
			styles,
			secondaryStyles,
			onArrowClick,
			onPanelClick,
			actionButtons,
			className,
			secondaryClassName,
			closeSecondary,
			history,
			WavCamOpen
		} = this.props;

		return (
			<div>
				<div
					style={styles || {}}
					className={
						open !== null
							? `dock-control ${open ? "open" : "closed"} ${
								hidden ? "hide" : "available"
							}`
							: `dock-control available ${
								this.state.primaryOpen ? "open" : "closed"
							}`
					}
				>
					<div
						style={
							styles && styles.backgroundColor
								? { backgroundColor: styles.backgroundColor }
								: {}
						}
						className={`dock-control-inner ${className}`}
					>
						{Array.isArray(children) ? children[0] : children}

						{/*Secondary Pull-out panel*/}

						{children[1] !== undefined && (
							<div
								style={open ? {} : { height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})` }}
								className={
									open !== null
										? `secondary-panel scrollbar ${secondaryClassName} ${
											secondaryOpen ? "list-open" : "closed"
										} ${open ? "" : "attached"}`
										: `secondary-panel scrollbar ${secondaryClassName} ${
											this.state.secondaryOpen ? "list-open" : "closed"
										} ${this.state.open ? "" : "attached"}`
								}
							>
								<div className="profile-wrapper">
									{/* Back navigation */}
									{history.length >= 2 && (
										<div id="profile-navigation">
											<FlatButton
												onClick={this.handleLastEntityClick}
												icon={<ChevronLeft style={{ marginLeft: 0 }} />}
												label={history[history.length - 2].name.toUpperCase()}
												style={{
													width: "100%",
													textAlign: "left"
												}}
											/>
										</div>
									)}
									<div className="profile-close-button">
										<IconButton onClick={closeSecondary}>
											<Close />
										</IconButton>
									</div>
									{children[1]}
								</div>
							</div>
						)}
						<div>
							{/*Chevron back arrow for closing panel*/}
							<IconButton
								className={
									open !== null
										? `hide-dock ${
											open && secondaryOpen
												? "profile-open"
												: "profile-closed"
										}`
										: `hide-dock ${
											this.state.primaryOpen && this.state.secondaryOpen
												? "profile-open"
												: "profile-closed"
										}`
								}
								onClick={open !== null ? onArrowClick : this.togglePrimaryOpen}
							>
								<ChevronLeft className="close-arrow" />
							</IconButton>
						</div>
					</div>
				</div>

				{/* Sidebar controls with buttons */}

				<div
					style={secondaryStyles || {}}
					className={
						open !== null
							? `dock-control-sidebar  ${open ? "closed" : "open"}`
							: `dock-control-sidebar ${
								this.state.primaryOpen ? "closed" : "open"
							}`
					}
				>
					<IconButton>
						<ViewList
							onClick={open !== null ? onPanelClick : this.togglePrimaryOpen}
						/>
					</IconButton>
					{actionButtons}
				</div>
			</div>
		);
	}
}

export default DockControl;
