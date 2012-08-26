var q = require("q");

var parser = require("./parser");
var objectMapValues = require("./util").objectMapValues;
var contexts = require("./contexts");

// TODO: Let each rendering function optionally also define a function that
// optionally defines an identifier for that section. In the browser, you
// can store the current state of the page by storing each section's identifier
// (if it supports identifiers). When loading a different page, we generate
// the identifiers for each section. If the identifier is the same, we don't
// need to re-render, if the identifier is different, then re-render (and recurse)

exports.Templates = Templates;
exports.compileString = compileString;

function Templates(templateReader, staticContext) {
    this._templateReader = templateReader;
    var templates = this;
    this._staticContext = objectMapValues(staticContext, function(key, value) {
        return value(templates);
    });
}

Templates.prototype.get = function(name) {
    var staticContext = this._staticContext;
    return this._templateReader.read(name)
        .then(function(templateSource) {
            return compileString(templateSource, staticContext);
        });
};

Templates.prototype.render = function(name, context, callback) {
    return this.get(name).then(function(template) {
        return template.render(context);
    });
}

function compileString(source, staticContext) {
    var nodes = parser.parse(source);
    return compileNodes(nodes, staticContext);
}

function compileNodes(nodes, staticContext) {
    var parts = nodes.map(nodeToPart.bind(null, staticContext || {}));
    return new Template(parts);
}

function nodeToPart(staticContext, node) {
    return nodeToPart[node.type](staticContext, node);
}

nodeToPart.literal = function(staticContext, node) {
    return function(context) {
        return node.value;
    };
};

nodeToPart.keyTag = function(staticContext, node) {
    return function(context) {
        return context.get(node.value);
    };
};

nodeToPart.functionTag = function(staticContext, node) {
    var bodies = {};
    for (var key in node.bodies) {
        if (Object.prototype.hasOwnProperty.call(node.bodies, key)) {
            bodies[key] = compileNodes(node.bodies[key], staticContext);
        }
    }
    return staticContext[node.name](node.args, bodies);
};

function Template(parts) {
    this._parts = parts;
};

Template.prototype.render = function(context) {
    context = contexts.create(context);
    return q.all(this._parts.map(applyPartToContext(context)))
        .then(function(results) {
            return results.join("");
        });
};

function applyPartToContext(context) {
    return function(part) {
        return part(context);
    };
}
