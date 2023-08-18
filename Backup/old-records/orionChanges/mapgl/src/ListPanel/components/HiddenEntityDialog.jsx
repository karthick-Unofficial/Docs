import React, { Component } from "react";
import { Dialog } from "orion-components/CBComponents";
import { getIcon } from "orion-components/SharedComponents";
import DockItemLabel from "../../shared/components/DockItemLabel";
import { Translate } from "orion-components/i18n/I18nContainer";

class HiddenEntityDialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			removalArray: []
		};
		this.focusRef = React.createRef();
	}

	componentDidUpdate(){
		setTimeout(() => {
			this.focusDiv();
		  }, 100);
	}

	focusDiv(){
		if(this.props.open && this.focusRef.current)
		{
			this.focusRef.current.focus();
		}
		else
		{
			setTimeout(() => {
				this.focusDiv();
			}, 100);
		}
	}

	handleRemoveMember = id => {
		const { removalArray } = this.state;

		if (removalArray.includes(id)) {
			const removeItems = this.state.removalArray;
			removeItems.splice(removeItems.indexOf(id), 1);
			this.setState({
				removalArray: removeItems
			});
		} else {
			const removeItems = [...this.state.removalArray, id];
			this.setState({
				removalArray: removeItems
			});
		}
	};

	submit = () => {
		const { toggleDialog, unignoreEntities } = this.props;
		const { removalArray } = this.state;

		unignoreEntities(removalArray);

		this.setState({ removalArray: [] });
		toggleDialog();
	};

	close = () => {
		const { toggleDialog } = this.props;

		this.setState({ removalArray: [] });
		toggleDialog();
	};

	render() {
		const { open, exclusions } = this.props;

		const { removalArray } = this.state;

		return (
			<Dialog
				open={open}
				title={<Translate value="listPanel.hiddenEntityDialog.title"/>}
				confirm={{
					label: <Translate value="listPanel.hiddenEntityDialog.save"/>,
					action: this.submit
				}}
				abort={{
					label: <Translate value="listPanel.hiddenEntityDialog.cancel"/>,
					action: this.close
				}}
			>
				<div className="hiddenEntityScroll scrollbar" tabIndex="0" ref={ this.focusRef } style={{ width: "360px" }}>
					{exclusions
						.sort((a, b) => {
							if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
							if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
							return 0;
						})
						.map(item => {
							return (
								<div
									className={`ec-dialog-item dockItem ${
										removalArray.includes(item.entityId) ? "ec-remove" : "ec-keep"
									}`}
									key={item.entityId}
								>
									{getIcon(item.iconType)}
									<DockItemLabel
										primary={item.name}
										secondary={
											item.iconType === ("Emergent" || "Planned")
												? <Translate value="listPanel.hiddenEntityDialog.event"/>
												: item.iconType
										}
									/>
									<i
										className="material-icons"
										onClick={() => this.handleRemoveMember(item.entityId)}
									>
										{removalArray.includes(item.entityId)
											? "add_circle"
											: "cancel"}
									</i>
								</div>
							);
						})}
				</div>
			</Dialog>
		);
	}
}

export default HiddenEntityDialog;
