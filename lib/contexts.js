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
    if (key === ".") {
        return this._context;
    }
    
    var names = key.split(".");
    var value = this._context;
    for (var i = 0; i < names.length; i += 1) {
        value = value[names[i]];
        if (!value) {
            return "";
        }
    }
    return value;
};

Context.prototype.pushVariable = function(key, variable) {
    var extendedContext = Object.create(this._context);
    extendedContext[key] = variable;
    return new Context(extendedContext);
};
