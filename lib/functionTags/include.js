exports.include = include;
exports.hole = hole;

var contexts = require("../contexts");
var objectMapValues = require("../util").objectMapValues;

var holesKey = "__holes";

function hole(templates) {
    return function (args, bodies) {
        var holeName = args[0];
        return function(context) {
            var hole = (context.get(holesKey) || {})[holeName];
            return hole ? hole() : "";
        }
    };
}

function include(templates) {
    return function(args, bodies) {
        var includeName = args[0];
        return function(context) {
            return templates.get(includeName).then(function(template) {
                var originalContext = args.context ? context.get(args.context) : {};
                var includeContext = contexts.create(originalContext)
                    .pushVariable(holesKey, objectMapValues(bodies, function(key, body) {
                        return body.render.bind(body, context);
                    }));
                return template.render(includeContext);
            });
        };
    };
}
