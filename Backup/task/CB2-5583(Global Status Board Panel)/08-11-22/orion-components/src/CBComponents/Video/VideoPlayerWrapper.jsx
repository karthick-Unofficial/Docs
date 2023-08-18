import React from "react";
import PropTypes from "prop-types";
import VideoPlayer from "./components/VideoPlayer";
import FullscreenVideoModal from "./components/FullscreenVideoModal";

const propTypes = {
	camera: PropTypes.shape({
		id: PropTypes.string.isRequired,
		player: PropTypes.shape({
			type: PropTypes.string.isRequired,
			url: PropTypes.string
		})
	}).isRequired,
	instanceId: PropTypes.string,
	entityId: PropTypes.string,
	entityType: PropTypes.string,
	docked: PropTypes.bool,
	fillAvailable: PropTypes.bool,
	modal: PropTypes.bool,
	dialogKey: PropTypes.string,
	dialog: PropTypes.string,
	canControl: PropTypes.bool,
	openDialog: PropTypes.func,
	closeDialog: PropTypes.func,
	expanded: PropTypes.bool
};

const defaultProps = {
	camera: { player: { url: null } },
	instanceId: "",
	entityId: "",
	entityType: "",
	docked: false,
	fillAvailable: false,
	modal: false,
	dialogKey: "",
	dialog: "",
	canControl: false,
	openDialog: () => { },
	closeDialog: () => { },
	expanded: false
};

const VideoPlayerWrapper = ({
	camera,
	instanceId,
	entityId,
	entityType,
	docked,
	modal,
	dialog,
	dialogKey,
	fillAvailable,
	openDialog,
	closeDialog,
	canControl,
	setCameraPriority,
	expanded,
	readOnly,
	playbackStartTime,
	playBarValue,
	playbackPlaying,
	currentReplayMedia,
	addReplayMedia,
	removeReplayMedia,
	dir
}) => {

	return (
		<div className={`video-player-wrapper ${expanded ? "large" : "small"}`}>
			<VideoPlayer
				camera={camera}
				instanceId={instanceId}
				entityId={entityId}
				entityType={entityType}
				docked={docked}
				fillAvailable={fillAvailable}
				modal={modal}
				dialogKey={dialogKey}
				openDialog={openDialog}
				expanded={expanded}
				setCameraPriority={setCameraPriority}
				readOnly={readOnly}
				playbackStartTime={playbackStartTime}
				playBarValue={playBarValue}
				playbackPlaying={playbackPlaying}
				currentReplayMedia={currentReplayMedia}
				addReplayMedia={addReplayMedia}
				removeReplayMedia={removeReplayMedia}
			/>
			{dialog === dialogKey &&
				<FullscreenVideoModal
					camera={camera}
					dialog={dialog}
					dialogKey={dialogKey}
					canControl={canControl}
					closeDialog={closeDialog}
					setCameraPriority={setCameraPriority}
					dir={dir}
				>
					<VideoPlayer
						key="fullscreen"
						camera={camera}
						instanceId={instanceId}
						entityId={entityId}
						entityType={entityType}
						docked={false}
						modal={false}
						// Do not allow modal to open when already open
						dialogKey={""}
						fullscreen={true}
					/>
				</FullscreenVideoModal>
			}
		</div>
	);
};

VideoPlayerWrapper.propTypes = propTypes;
VideoPlayerWrapper.defaultProps = defaultProps;

export default VideoPlayerWrapper;
