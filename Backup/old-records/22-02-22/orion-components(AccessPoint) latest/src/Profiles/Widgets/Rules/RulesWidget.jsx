import React, { Component } from "react";
import { withSpan } from "../../../Apm"; 
import { Card, CardHeader, CardMedia } from "material-ui/Card";
import ruleStatementBuilder from "../../../rule-builder";
import { FlatButton } from "material-ui";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

class RulesWidget extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: {}
		};
	}

	componentWillUnmount() {
		const {
			contextId,
			unsubscribeFromFeed,
			subscriberRef,
			expanded
		} = this.props;

		if (!expanded) unsubscribeFromFeed(contextId, "rules", subscriberRef);
	}

	handleToggleExpand = ruleId => {
		const { expanded } = this.state;
		this.setState({ expanded: { ...expanded, [ruleId]: !expanded[ruleId] } });
	};

	hideButton = (entityType, context) => {
		if(entityType === "shapes" && context.entity.entityData.type === "LineString" && context.entity.entityData.geometry.coordinates.length > 2){
			return true;
		} else if ( entityType === "shapes" && !context.entity.isPublic ){
			return true;
		} else {
			return false;
		}
	}

	render() {
		const {
			rules,
			canViewRules,
			canManage,
			userId,
			collections,
			entityType,
			contextId,
			context,
			hasLinks,
			order,
			expanded,
			selected,
			enabled,
			loadProfile,
			dir
		} = this.props;

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

		return selected || !enabled ? (
			<div />
		) : (
			<section
				className={`rules-widget widget-wrapper ${"index-" + order} ${
					expanded ? "expanded" : "collapsed"
				}`}
			>
				{!expanded  && (
					<div className="widget-header">
						<div className="cb-font-b2"><Translate value="global.profiles.widgets.rules.title"/></div>
						{!this.hideButton(entityType, context) && canManage ? (
							<div className="widget-option-button">
								<FlatButton
									label={getTranslation("global.profiles.widgets.rules.newRule")}
									primary={true}
									onClick={() =>
										window.location.replace(
											`/rules-app/#/create/track-movement?${
												entityType === "shapes"
													? "createTargets"
													: "createSubjects"
											}=${contextId}`
										)
									}
								/>
							</div>
						):(
							null
						)}
					</div>
				)}

				<div className="widget-content">
					{rules
						.filter(rule => !!rule.assignments[userId])
						.map(rule => {
							const { assignments, ownerName, id, title } = rule;
							const {
								notifySystem,
								notifyPush,
								notifyEmail,
								isPriority
							} = assignments[userId];
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
												{isPriority && <div className="priority"><Translate value="global.profiles.widgets.rules.priority"/></div>}
												{notifySystem && (
													<i className="material-icons">laptop</i>
												)}
												{notifyPush && (
													<i className="material-icons">phone_iphone</i>
												)}
												{notifyEmail && <i className="material-icons">email</i>}
												<div
													className="widget-option-button"
													style={dir == "rtl" ? { marginRight: "auto" } : { marginLeft: "auto" }}
												>
													{canViewRules && <FlatButton
														label={getTranslation("global.profiles.widgets.rules.viewRule")}
														primary={true}
														onClick={() =>
															window.location.replace(`/rules-app/#/rule/${id}`)
														}
													/>}
												</div>
											</div>
										</section>
										<section className="rule-info">
											<p className="cb-font-b7 clear"><Translate value="global.profiles.widgets.rules.createdBy" count={ownerName}/></p>
											<div id="rule-statement" className="cb-font-b9">
												{ruleStatementBuilder(
													rule,
													collections,
													loadProfile,
													hasLinks
												)}
											</div>
										</section>
									</CardMedia>
								</Card>
							);
						})}
				</div>
			</section>
		);
	}
}

export default withSpan("rules-widget", "profile-widget")(RulesWidget);
