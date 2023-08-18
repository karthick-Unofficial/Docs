import DetectionAvertEvent from "./avertEvents/DetectionAvertEvent";
import NeutralizationAvertEvent from "./avertEvents/NeutralizationAvertEvent";
import SelfDetectionAvertEvent from "./avertEvents/SelfDetectionAvertEvent";
import BarrierBreachAvertEvent from "./avertEvents/BarrierBreachAvertEvent";
import WeaponFireAvertEvent from "./avertEvents/WeaponFireAvertEvent";
import TargetDestroyedAvertEvent from "./avertEvents/TargetDestroyedAvertEvent";
import EquipmentInfoEvent from "./EquipmentInfoEvent";

export const createEvent = (event) => {
	switch (event.eventType) {
		case "DETECTION":
			return new DetectionAvertEvent(event);
		case "NEUTRALIZATION":
			return new NeutralizationAvertEvent(event);
		case "SELF_DETECTION":
			return new SelfDetectionAvertEvent(event);
		case "BARRIER_OVERCOME":
			return new BarrierBreachAvertEvent(event);
		case "WEAPON_FIRE":
			return new WeaponFireAvertEvent(event);
		case "TARGET_DESTROYED":
			return new TargetDestroyedAvertEvent(event);
	}
};

export const createEquipmentEvent = (communication) => {
	const dataParts = communication.data.split("#");
	const libraryIds = dataParts[1].split(",").map(id => parseInt(id));
	const event = {
		actorId: parseInt(dataParts[0]),
		data: libraryIds
	};
	return new EquipmentInfoEvent(event);
};