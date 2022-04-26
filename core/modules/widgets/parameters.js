/*\
title: $:/core/modules/widgets/parameters.js
type: application/javascript
module-type: widget

Widget for definition of transclusion parameters

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget,
	UberTranscludeWidget = require("$:/core/modules/widgets/ubertransclude.js").ubertransclude;

var ParametersWidget = function(parseTreeNode,options) {
	// Initialise
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
ParametersWidget.prototype = Object.create(Widget.prototype);

/*
Render this widget into the DOM
*/
ParametersWidget.prototype.render = function(parent,nextSibling) {
	// Call the constructor
	Widget.call(this);
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
ParametersWidget.prototype.execute = function() {
	var self = this;
	// Find the parent transclusion
	var transclusionWidget = this.parentWidget;
	while(transclusionWidget && !(transclusionWidget instanceof UberTranscludeWidget)) {
		transclusionWidget = transclusionWidget.parentWidget;
	}
	// Process each parameter
	if(transclusionWidget) {
		$tw.utils.each($tw.utils.getOrderedAttributesFromParseTreeNode(self.parseTreeNode),function(attr,index) {
			var name = attr.name;
			self.setVariable(name,transclusionWidget.getTransclusionParameter(name,transclusionWidget.getTransclusionParameterByPosition(index,self.getAttribute(name))));
		});	
	}
	// Construct the child widgets
	this.makeChildWidgets();
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
ParametersWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(Object.keys(changedAttributes).length) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

exports.parameters = ParametersWidget;

})();