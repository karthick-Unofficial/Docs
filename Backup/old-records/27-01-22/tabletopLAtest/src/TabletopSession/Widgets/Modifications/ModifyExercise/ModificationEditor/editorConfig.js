import MapObjectSelectorContainer from "./MapObjectSelectorContainer";
import BarrierSelectorContainer from "./BarrierSelectorContainer";
import TextContainer from "./TextContainer";
import ObjectiveEditorContainer from "./ObjectiveEditorContainer";

const editorConfig = {
	mapObjectSelector: {
		control: MapObjectSelectorContainer
	},
	barrierSelector: {
		control: BarrierSelectorContainer
	},
	text: {
		control: TextContainer
	},
	objectiveEditor: {
		control: ObjectiveEditorContainer
	}
};

export default editorConfig;