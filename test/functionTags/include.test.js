var q = require("q");

var templating = require("../../lib/templating");
var include = require("../../lib/functionTags").include;
var hole = require("../../lib/functionTags").hole;

var staticContext = {
    include: include,
    hole: hole
};

exports["include function renders referenced template"] = function(test) {
    var reader = createReader({
        page: "{#include nav /} <h1>Store</h1>",
        nav: '<a href="/">Home</a>'
    });
    
    var templates = new templating.Templates(reader, staticContext);
    templates.render("page", {})
        .then(function(output) {
            test.equal('<a href="/">Home</a> <h1>Store</h1>', output);
            test.done();
        }).end();
};

exports["include function creates empty context for included template"] = function(test) {
    var reader = createReader({
        page: "{#include nav /} <h1>Store</h1>",
        nav: '<a href="/">{name}</a>'
    });
    
    var templates = new templating.Templates(reader, staticContext);
    templates.render("page", {name: "Home"})
        .then(function(output) {
            test.equal('<a href="/"></a> <h1>Store</h1>', output);
            test.done();
        }).end();
};

exports["include function can use context set by named argument"] = function(test) {
    var reader = createReader({
        page: "{#include nav context=project /} <h1>Store</h1>",
        nav: '<a href="/">{name}</a>'
    });
    
    var templates = new templating.Templates(reader, staticContext);
    templates.render("page", {project: {name: "Home"}})
        .then(function(output) {
            test.equal('<a href="/">Home</a> <h1>Store</h1>', output);
            test.done();
        }).end();
};

exports["include function can fill in holes"] = function(test) {
    var reader = createReader({
        page: "{#include nav context=project}{:title}<h1>Store</h1>{/include}",
        nav: '{#hole title /}<a href="/">Home</a>'
    });
    
    var templates = new templating.Templates(reader, staticContext);
    templates.render("page", {})
        .then(function(output) {
            test.equal('<h1>Store</h1><a href="/">Home</a>', output);
            test.done();
        }).end();
};

function createReader(templates) {
    return {
        read: function(name) {
            return q.when(templates[name]);
        }
    };
}
