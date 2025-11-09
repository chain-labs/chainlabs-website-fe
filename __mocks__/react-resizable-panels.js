const React = require("react");

function PanelGroup(props) {
	return React.createElement("div", props, props.children);
}

function Panel(props) {
	return React.createElement("div", props, props.children);
}

function PanelResizeHandle(props) {
	return React.createElement("div", props, props.children);
}

module.exports = {
	PanelGroup,
	Panel,
	PanelResizeHandle,
};
