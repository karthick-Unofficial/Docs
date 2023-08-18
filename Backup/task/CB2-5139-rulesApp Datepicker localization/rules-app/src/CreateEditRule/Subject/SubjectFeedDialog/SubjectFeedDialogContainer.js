import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import SubjectFeedDialog from "./SubjectFeedDialog";

const mapStateToProps = (state, ownProps) => {
	const userTrackFeeds = Object.keys(state.session.userFeeds)
		.map(key => state.session.userFeeds[key])
		.filter(feed => feed.entityType === "track");

	return {
		userTrackFeeds
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators({}, dispatch);
}

const SubjectFeedDialogContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SubjectFeedDialog);

export default SubjectFeedDialogContainer;