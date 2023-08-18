import { createSelector } from "reselect";
import { getSelectedContextData } from "orion-components/Profiles/Selectors";

const getAttachments = (state, contextId) => getSelectedContextData(state)(contextId, "attachments");

const imageAttachmentsSelector = createSelector([getAttachments], (attachments) => {
	const imageAttachments = attachments?.filter((attachment) => attachment.mimeType.startsWith("image/")) || [];

	imageAttachments.sort((a, b) => {
		if (a.createdDate < b.createdDate) {
			return 1;
		} else {
			return -1;
		}
	});

	return imageAttachments;
});

const otherAttachmentsSelector = createSelector([getAttachments], (attachments) => {
	const otherAttachments = attachments?.filter((attachment) => !attachment.mimeType.includes("image/")) || [];

	otherAttachments.sort((a, b) => {
		if (!a.mimeType.includes("image") && b.mimeType.includes("image")) {
			return 1;
		} else {
			return -1;
		}
	});

	return otherAttachments;
});

export { imageAttachmentsSelector, otherAttachmentsSelector };
