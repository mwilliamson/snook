exports.include = include;
exports.hole = hole;

var objectMapValues = require("../util").objectMapValues;

var holesKey = "__holes";

function hole(templates) {
    return function (args, bodies) {
        var holeName = args[0];
        return function(context) {
            var hole = (context[holesKey] || {})[holeName];
            return hole ? hole() : "";
        }
    };
}

function include(templates) {
    return function(args, bodies) {
        var includeName = args[0]
        return function(context) {
            return templates.get(includeName).then(function(template) {
                var includeContext = args.context ? context[args.context] : {};
                includeContext[holesKey] = objectMapValues(bodies, function(key, body) {
                    return body.render.bind(body, context);
                });
                return template.render(includeContext);
            });
        };
    };
}
