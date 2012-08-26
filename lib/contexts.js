exports.create = create;

function create(context) {
    if (context instanceof Context) {
        return context;
    } else {
        return new Context(context);
    }
}

function Context(context) {
    this._context = context;
}

Context.prototype.get = function(key) {
    return this._context[key];
};

Context.prototype.pushVariable = function(key, variable) {
    var extendedContext = Object.create(this._context);
    extendedContext[key] = variable;
    return new Context(extendedContext);
};
