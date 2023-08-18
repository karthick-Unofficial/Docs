import React, { useState } from "react";

import { IconButton, FlatButton } from "material-ui";
import ChevronLeft from "material-ui/svg-icons/navigation/chevron-left";
import ViewList from "material-ui/svg-icons/action/view-list";
import Close from "material-ui/svg-icons/content/clear";

const DockControl = ({
	history,
	viewLastProfile,
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
	WavCamOpen
}) => {
	const [primaryOpen, setPrimaryOpen] = useState(true);
	const [secondaryOpenState, setSecondaryOpenState] = useState(false);
	//const [hideSecondary, setHideSecondary] = useState(false);
	//not used anymore

	const togglePrimaryOpen = () => {
		setPrimaryOpen(!primaryOpen);
		// secondaryOpen: !this.state.primaryOpen
	};

	const handleLastEntityClick = () => {
		const entity = history[history.length - 2];
		viewLastProfile(entity);
	};

	// Presence of open prop determines whether or not DockControl is being used as a controlled component or not.
	// If no open prop, manages own state and uses own click handlers. If open prop, all those have to be passed in manually.

	return (
		<div>
			<div
				style={styles || {}}
				className={
					open !== null
						? `dock-control ${open ? "open" : "closed"} ${hidden ? "hide" : "available"
						}`
						: `dock-control available ${primaryOpen ? "open" : "closed"
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
									? `secondary-panel scrollbar ${secondaryClassName} ${secondaryOpen ? "list-open" : "closed"
									} ${open ? "" : "attached"}`
									: `secondary-panel scrollbar ${secondaryClassName} ${secondaryOpenState ? "list-open" : "closed"
									} ${open ? "" : "attached"}`
							}
						>
							<div className="profile-wrapper">
								{/* Back navigation */}
								{history.length >= 2 && (
									<div id="profile-navigation">
										<FlatButton
											onClick={handleLastEntityClick}
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
									? `hide-dock ${open && secondaryOpen
										? "profile-open"
										: "profile-closed"
									}`
									: `hide-dock ${primaryOpen && secondaryOpenState
										? "profile-open"
										: "profile-closed"
									}`
							}
							onClick={open !== null ? onArrowClick : togglePrimaryOpen}
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
						: `dock-control-sidebar ${primaryOpen ? "closed" : "open"
						}`
				}
			>
				<IconButton>
					<ViewList
						onClick={open !== null ? onPanelClick : togglePrimaryOpen}
					/>
				</IconButton>
				{actionButtons}
			</div>
		</div>
	);
};

export default DockControl;
