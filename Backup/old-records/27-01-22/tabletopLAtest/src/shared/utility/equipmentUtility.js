const equipmentCache = {};

export const getEquipmentDetail = ( equipment, equipmentConfig ) => {
	if (!equipmentConfig) {
		return null;
	}

	if (equipmentCache.hasOwnProperty(equipment.libraryId)) {
		return equipmentCache[equipment.libraryId];
	}

	let matchElement = equipmentConfig.find(configElement => {
		if (configElement.partialMatch) {
			return equipment.name.toLowerCase().includes(configElement.matchDesc.toLowerCase());
		} else {
			return equipment.name.toLowerCase() === configElement.matchDesc.toLowerCase();
		}
	});

	let equipmentDetail;
	if (matchElement) {
		equipmentDetail = {
			display: matchElement.display,
			icon: matchElement.icon,
			category: matchElement.category,
			smartEquipment: matchElement.smartEquipment
		};
	} else {
		equipmentDetail = {
			display: true,
			icon: "static/equipment/Unknown.png",
			category: "",
			smartEquipment: false
		};
	}

	equipmentCache[equipment.libraryId] = equipmentDetail;
	return equipmentDetail;
};

export const canShareEquipment = (agent, equipmentConfig, userInfo, userHasCommDevices) => {
	const properties = agent.entityData.properties;
	if (!userInfo.isFacilitator) {
		if (!userHasCommDevices || userInfo.userRole === properties.team) {
			return false;
		}
	}

	if (!properties.enabled) {
		return false;
	}

	const equipment = properties.equipment;
	if (!equipment || equipment.length === 0) {
		return false;
	}

	for (let i = 0; i < equipment.length; i++) {
		const equipmentDetail = getEquipmentDetail(equipment[i], equipmentConfig);
		if (equipmentDetail.display) {
			return true;
		}
	}
	return false;
};