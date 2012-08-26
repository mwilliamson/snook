exports.for_ = for_;

var q = require("q");

function for_(templates) {
    return function(args, bodies) {
        var elementVariableName = args[0];
        var arrayVariableName = args[2];
        return function(context) {
            var array = context[arrayVariableName];
            return q.all(array.map(function(element) {
                var subContext = copyContext(context);
                subContext[elementVariableName] = element;
                return bodies.block.render(subContext);
            })).then(function(results) {
                return results.join("");
            });
        };
    };
}

function copyContext(context) {
    var copy = {};
    for (var key in context) {
        if (Object.prototype.hasOwnProperty.call(context, key)) {
            copy[key] = context[key];
        }
    }
    return copy;
}
