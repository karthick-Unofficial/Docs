import React from "react";
import PropTypes from "prop-types";
import VideoPlayer from "./components/VideoPlayer";
import FullscreenVideoModal from "./components/FullscreenVideoModal";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import { setCameraPriority } from "orion-components/Dock/Actions/index.js";

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
	fillAvailable: PropTypes.bool,
	modal: PropTypes.bool,
	dialogKey: PropTypes.string,
	dialog: PropTypes.string,
	canControl: PropTypes.bool,
	expanded: PropTypes.bool,
	readOnly: PropTypes.bool,
	playbackStartTime: PropTypes.oneOfType([PropTypes.date, PropTypes.object]),
	playBarValue: PropTypes.oneOfType([PropTypes.date, PropTypes.object]),
	playbackPlaying: PropTypes.bool,
	currentReplayMedia: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	addReplayMedia: PropTypes.func,
	removeReplayMedia: PropTypes.func,
	dir: PropTypes.string,
	inDock: PropTypes.bool
};

const defaultProps = {
	camera: { player: { url: null } },
	instanceId: "",
	entityId: "",
	entityType: "",
	fillAvailable: false,
	modal: false,
	dialogKey: "",
	dialog: "",
	canControl: false,
	expanded: false,
	inDock: false
};

const VideoPlayerWrapper = ({
	camera,
	instanceId,
	entityId,
	entityType,
	modal,
	dialog,
	dialogKey,
	fillAvailable,
	canControl,
	expanded,
	readOnly,
	playbackStartTime,
	playBarValue,
	playbackPlaying,
	currentReplayMedia,
	addReplayMedia,
	removeReplayMedia,
	dir,
	inDock
}) => {
	return (
		<div className={`video-player-wrapper ${expanded ? "large" : "small"}`}>
			<VideoPlayer
				camera={camera}
				instanceId={instanceId}
				entityId={entityId}
				entityType={entityType}
				inDock={inDock}
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
			{dialog === dialogKey && (
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
						inDock={false}
						modal={false}
						// Do not allow modal to open when already open
						dialogKey={""}
						fullscreen={true}
					/>
				</FullscreenVideoModal>
			)}
		</div>
	);
};

VideoPlayerWrapper.propTypes = propTypes;
VideoPlayerWrapper.defaultProps = defaultProps;

export default VideoPlayerWrapper;
