exports.if_ = if_;

function if_(templates) {
    return function(args, bodies) {
        var variableName = args[0];
        return function(context) {
            if (context.get(variableName)) {
                return bodies.block.render(context);
            } else if (bodies["else"]) {
                return bodies["else"].render(context);
            } else {
                return "";
            }
        };
    };
}
