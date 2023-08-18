import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    selectedTab: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};


const CBTabPanel = (props) => {
    const { children, value, selectedTab } = props;

    return (
        <div>
            {value === selectedTab && children
                // <Box sx={{ p: 3 }}>
                //     <Typography>{children}</Typography>
                // </Box>
            }
        </div>
    );
}

CBTabPanel.propTypes = propTypes;

export default CBTabPanel;