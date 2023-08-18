# GenericAttribute component

## Usage

The GenericAttribute component can be used to build new rules UI quickly and easily. Once you've created your 
new rule component, you can use one or more GenericAttribute component to build the target, subject, conditions, etc
UI for your rule. All state is stored in your main component and passed down to each GenericAttribute. 

## Properties

The following props are required to be passed to all use cases of the GenericAttribute component:

```
type - The header/type text of your section
description - The subheader text of your section
inputType - The type of input field you'd like. Options are: conditions, tab, dropdown, and single-selection
inputOptions - The options selectable by your input. 
                    - For conditions, the conditions available. Ex. ["time"]
                    - For single-selection, the items available to select. Ex. [{id: 1, name: "dog"}, {id: 2, name: "cat"}]
                    - For dropdown, the options available in the dropdown. Ex. ["New Request", "Request Approval"]
                    - For tab, the tabs you'd like displayed. Ex. ["Any Boat", "Select Boat"] 
setProperty - A curried function for setting state in the parent component. Passed to the individual GenericAttributes to allow them to 
              set parent state.
value - The currently selected value of your input
```

The properties below are required when using specific inputTypes:

```
single-selection & multi-selection:

selectionType - The name of the options you can select from. Will display as a string `Add ${selectionType}...`
searchProperty - The object property you'd like the typeahead search to use to search for. 
                 For example, if your inputOptions is [{id: 1, name: "dog}], you'll want "dog" as your searchProperty
openDialog - Redux action to open a dialog, found in orion-components


conditions:

openDialog - Redux action to open a dialog, found in orion-components.
```



## Example from parent component

```
class FakeComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
            trigger: 1,
            target: []
        };
	}
    
    // Curried function to allow children (GenericAttribute components)
    // to set parent state. This lets you build your rule dynamically 
    // based on the trigger type selected
    setProperty = (key) => (value) => {

    	if (key === "trigger") {
            
    		// Reset all state when trigger is changed
    		return this.setState({
    			[key]: value,
    			target: null
    		});
    	}
        
    	this.setState({[key]: value});
    }

    render() {
    	const { 
    		openDialog,
    		closeDialog
    	} = this.props;

    	return (
    		<div>
    		
                <GenericAttribute
                    type={"Type"}
                    description={"Select a rule type."}
                    inputType={"dropdown"}
                    inputOptions={[
                        {value: "arrival", label: "Arrival"},
                        {value: "departure", label: "Departure"}
                    ]}
                    setProperty={this.setProperty("trigger")}
                    value={trigger}
                />

                <GenericAttribute
                    type={"Berth Selection"}
                    description={"Select a berth."}
                    inputType={"single-selection"}
                    inputOptions={[
                        {id: 1, name: "dog"}, 
                        {id: 2, name: "cat}
                    ]}
                    singleSelectionType={"berth"}
                    setProperty={this.setProperty("target")}
                    searchProperty={"name"}
                    openDialog={openDialog}
                    value={target}
                />
    					
    		</div>
    	);
    }
}
```