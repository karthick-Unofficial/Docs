import { useSelector, shallowEqual, React } from "react-redux";
import PropTypes from "prop-types";
import { FacilitiesLayer } from "orion-components/Map/Layers";
import { layerSourcesSelector } from "orion-components/GlobalData/Selectors";
import { mapSettingsSelector, mapObject } from "orion-components/AppState/Selectors";
import { mapFiltersById } from "orion-components/ContextPanel/Selectors";
import { Fragment } from "react";
import { setMapEntities, loadProfile } from "./facilitiesActions";

const propTypes = {
	feedId: PropTypes.string.isRequired,
	before: PropTypes.string
};

const FacilityLayerWrapper = (props) => {
	const mapSettings = useSelector((state) => state.appState.persisted.mapSettings, shallowEqual);
	const settings = useSelector((state) => mapSettingsSelector(state));
	const facilities = useSelector((state) => layerSourcesSelector(state, props));
	const filters = useSelector((state) => mapFiltersById(state));
	const map = useSelector((state) => mapObject(state));

	if (mapSettings) {
		return (
			<Fragment>
				<FacilitiesLayer
					facilities={facilities}
					filters={filters}
					settings={settings}
					map={map}
					feedId={props.feedId}
					labelsVisible={settings.entityLabelsVisible}
					setMapEntities={setMapEntities}
					loadProfile={loadProfile}
					before={props.before}
				/>
			</Fragment>
		);
	} else {
		return (
			<Fragment>
				<FacilitiesLayer facilities={facilities} />
			</Fragment>
		);
	}
};

FacilityLayerWrapper.propTypes = propTypes;

export default FacilityLayerWrapper;
