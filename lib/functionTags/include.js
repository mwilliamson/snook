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
                var includeContext = createContext(args, bodies, context);
                return template.render(includeContext);
            });
        };
    };
}

function createContext(args, bodies, context) {
    var originalContext = createContextFromArgs(args, context);
    return contexts.create(originalContext)
        .pushVariable(holesKey, objectMapValues(bodies, function(key, body) {
            return body.render.bind(body, context);
        }));
}

function createContextFromArgs(args, context) {
    if (args.context) {
        return context.get(args.context);
    } else {
        var includeContext = {};
        for (var key in args) {
            if (key !== "context" && Object.prototype.hasOwnProperty.call(args, key)) {
                includeContext[key] = context.get(args[key]);
            }
        }
        return includeContext;
    }
    
}


