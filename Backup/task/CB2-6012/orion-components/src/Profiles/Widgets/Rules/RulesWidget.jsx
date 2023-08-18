import React, { useEffect } from "react";
import { withSpan } from "../../../Apm";
import { Card, CardHeader, CardMedia, Button } from "@mui/material";
import ruleStatementBuilder from "../../../rule-builder";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getWidgetState } from "orion-components/Profiles/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import { loadProfile } from "orion-components/ContextPanel/Actions";
import { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";
import { getSelectedContextData } from "orion-components/Profiles/Selectors";
import { collectionsSelector } from "orion-components/GlobalData/Selectors";
import WidgetMenu from "./components/WidgetMenu";

const RulesWidget = ({ id, contextId, subscriberRef, expanded, canViewRules, canManage, hasLinks, selected }) => {
	const dispatch = useDispatch();
	const enabled = useSelector((state) => getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));
	const userId = useSelector((state) => state?.session?.user?.profile?.id);
	const entity = useSelector((state) => getSelectedContextData(state)(contextId, "entity")) || {};
	const rules = useSelector((state) => getSelectedContextData(state)(contextId, "rules")) || {};
	const { entityType } = entity || { entityType: "" };
	const collections = useSelector((state) => entity && collectionsSelector(state));

	useEffect(() => {
		return () => {
			if (!expanded) dispatch(unsubscribeFromFeed(contextId, "rules", subscriberRef));
		};
	}, []);

	const hideButton = (entityType, entity) => {
		if (
			entityType === "shapes" &&
			entity.entityData.type === "LineString" &&
			entity.entityData.geometry.coordinates.length > 2
		) {
			return true;
		} else if (entityType === "shapes" && !entity.isPublic) {
			return true;
		} else {
			return false;
		}
	};

	const cardStyles = {
		card: {
			marginBottom: ".75rem"
		},
		header: {
			backgroundColor: "#41454A",
			maxHeight: 50,
			display: "flex",
			alignItems: "center"
		},
		media: {
			borderLeft: "1px solid #41454A",
			borderRight: "1px solid #41454A",
			borderBottom: "1px solid #41454A"
		}
	};

	const addRule = () => {
		window.location.replace(
			`/rules-app/#/create/track-movement?${
				entityType === "shapes" ? "createTargets" : "createSubjects"
			}=${contextId}`
		);
	};

	return selected || !enabled ? (
		<div />
	) : (
		<section className={`rules-widget widget-wrapper  ${expanded ? "expanded" : "collapsed"}`}>
			{!expanded && (
				<div className="widget-header">
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.rules.title" />
					</div>
					<div className="widget-header-buttons">
						<WidgetMenu
							dir={dir}
							canAddRule={!hideButton(entityType, entity) && canManage}
							addRule={addRule}
						/>
					</div>
				</div>
			)}

			{rules !== undefined && rules.length > 0 ? (
				<div className="widget-content">
					{rules
						.filter((rule) => !!rule.assignments[userId])
						.map((rule) => {
							const { assignments, ownerName, id, title } = rule;
							const { notifySystem, notifyPush, notifyEmail, isPriority } = assignments[userId];
							return (
								<Card style={cardStyles.card} key={id}>
									<CardHeader
										style={cardStyles.header}
										actAsExpander={true}
										iconStyle={{ float: "left" }}
										showExpandableButton={true}
										title={title}
									/>
									<CardMedia style={cardStyles.media} expandable={true}>
										<section>
											<div className="notify-types">
												{isPriority && (
													<div className="priority">
														<Translate value="global.profiles.widgets.rules.priority" />
													</div>
												)}
												{notifySystem && <i className="material-icons">laptop</i>}
												{notifyPush && <i className="material-icons">phone_iphone</i>}
												{notifyEmail && <i className="material-icons">email</i>}
												<div
													className="widget-option-button"
													style={
														dir == "rtl"
															? {
																	marginRight: "auto"
															  }
															: {
																	marginLeft: "auto"
															  }
													}
												>
													{canViewRules && (
														<Button
															variant="text"
															color="primary"
															onClick={() =>
																window.location.replace(`/rules-app/#/rule/${id}`)
															}
														>
															{getTranslation("global.profiles.widgets.rules.viewRule")}
														</Button>
													)}
												</div>
											</div>
										</section>
										<section className="rule-info">
											<p className="cb-font-b7 clear">
												<Translate
													value="global.profiles.widgets.rules.createdBy"
													count={ownerName}
												/>
											</p>
											<div id="rule-statement" className="cb-font-b9">
												{ruleStatementBuilder(rule, collections, loadProfile, hasLinks)}
											</div>
										</section>
									</CardMedia>
								</Card>
							);
						})}
				</div>
			) : (
				<div />
			)}
		</section>
	);
};

export default withSpan("rules-widget", "profile-widget")(RulesWidget);
