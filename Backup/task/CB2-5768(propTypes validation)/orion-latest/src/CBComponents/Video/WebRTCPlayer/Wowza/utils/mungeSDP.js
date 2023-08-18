export function mungeSDPPlay(sdpStr) {

	// For greatest playback compatibility, 
	// force H.264 playback to constrained baseline (42e01f).

	const sdpLines = sdpStr.split(/\r\n/);
	let sdpStrRet = "";

	for (const sdpIndex in sdpLines) {
		let sdpLine = sdpLines[sdpIndex];

		if (sdpLine.length === 0)
			continue;

		if (sdpLine.includes("profile-level-id")) {
			// The profile-level-id string has three parts: XXYYZZ, where
			//   XX: 42 baseline, 4D main, 64 high
			//   YY: constraint
			//   ZZ: level ID
			// Look for codecs higher than baseline and force downward.
			const profileLevelId = sdpLine.substr(sdpLine.indexOf("profile-level-id") + 17, 6);
			let profile = Number("0x" + profileLevelId.substr(0, 2));
			let constraint = Number("0x" + profileLevelId.substr(2, 2));
			let level = Number("0x" + profileLevelId.substr(4, 2));
			if (profile > 0x42) {
				profile = 0x42;
				constraint = 0xE0;
				level = 0x1F;
			}
			if (constraint === 0x00) {
				constraint = 0xE0;
			}
			const newProfileLevelId = ("00" + profile.toString(16)).slice(-2).toLowerCase() +
				("00" + constraint.toString(16)).slice(-2).toLowerCase() +
				("00" + level.toString(16)).slice(-2).toLowerCase();

			sdpLine = sdpLine.replace(profileLevelId, newProfileLevelId);
		}

		sdpStrRet += sdpLine;
		sdpStrRet += "\r\n";
	}

	return sdpStrRet;
}