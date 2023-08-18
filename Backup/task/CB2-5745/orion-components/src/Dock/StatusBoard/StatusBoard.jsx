import React from "react";
import StatusCard from "../../SharedComponents/StatusCard/StatusCard";
import { Translate } from "orion-components/i18n";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const StatusBoard = ({ canManage }) => {
	const locale = useSelector((state) => state.i18n.locale);
	const statusCards = useSelector(
		(state) => state.statusCards && state.statusCards.cards
	);
	const dir = useSelector((state) => getDir(state));
	const orgId = useSelector((state) => state.session.user.profile.orgId);

	return (
		<div
			style={{
				overflow: "scroll",
				height: "calc(100% - 80px)",
				width: "90%",
				margin: "auto"
			}}
		>
			<h3
				style={{
					fontFamily: "roboto",
					fontSize: "14px",
					fontWeight: 400,
					color: "#fff"
				}}
			>
				<Translate value="global.dock.statusBoard.title" />
			</h3>
			{statusCards.map((card, index) => {
				return (
					card.global && (
						<div style={{ marginBottom: 20 }}>
							<StatusCard
								key={card.id}
								index={index}
								card={card}
								disableControls={
									orgId !== card.ownerOrg && !canManage
								}
								disableMenu={true}
								userCanEdit={canManage}
								userCanShare={true}
								dir={dir}
								locale={locale}
							/>
						</div>
					)
				);
			})}
		</div>
	);
};

export default StatusBoard;
