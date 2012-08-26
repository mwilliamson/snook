var templating = require("../../lib/templating");
var for_ = require("../../lib/functionTags").for_;

var createReader = require("./util").createReader;

var staticContext = {
    "for": for_
};

exports["for does nothing if collection is empty"] = function(test) {
    var reader = createReader({
        page: "{#for name in names}* {name}\n{/for}"
    });
    
    var templates = new templating.Templates(reader, staticContext);
    templates.render("page", {names: []})
        .then(function(output) {
            test.equal('', output);
            test.done();
        }).end();
};

exports["for iterates over every element in array"] = function(test) {
    var reader = createReader({
        page: "{#for name in names}* {name}\n{/for}"
    });
    
    var templates = new templating.Templates(reader, staticContext);
    templates.render("page", {names: ["Bob", "Jim"]})
        .then(function(output) {
            test.equal('* Bob\n* Jim\n', output);
            test.done();
        }).end();
};
