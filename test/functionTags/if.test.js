var templating = require("../../lib/templating");
var if_ = require("../../lib/functionTags").if_;

var createReader = require("./util").createReader;

var staticContext = {
    "if": if_
};

exports["if does nothing if value is false"] = function(test) {
    var reader = createReader({
        page: "{#if name}By {name}{/if}"
    });
    
    var templates = new templating.Templates(reader, staticContext);
    templates.render("page", {name: false})
        .then(function(output) {
            test.equal('', output);
            test.done();
        }).end();
};

exports["if renders body if value is truthy"] = function(test) {
    var reader = createReader({
        page: "{#if name}By {name}{/if}"
    });
    
    var templates = new templating.Templates(reader, staticContext);
    templates.render("page", {name: "Bob"})
        .then(function(output) {
            test.equal('By Bob', output);
            test.done();
        }).end();
};

exports["if renders else block if value is not truthy"] = function(test) {
    var reader = createReader({
        page: "{#if name}By {name}{:else}Anonymous{/if}"
    });
    
    var templates = new templating.Templates(reader, staticContext);
    templates.render("page", {})
        .then(function(output) {
            test.equal('Anonymous', output);
            test.done();
        }).end();
};
