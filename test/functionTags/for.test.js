var templating = require("../../lib/templating");
var for_ = require("../../lib/functionTags").for_;

var createReader = require("./util").createReader;

var staticContext = {
    "for": for_
};

exports["for does nothing if collection is empty"] = function(test) {
    var reader = createReader({
        page: "{#for name in names}{name}{/name}"
    });
    
    var templates = new templating.Templates(reader, staticContext);
    templates.render("page", {names: []})
        .then(function(output) {
            test.equal('', output);
            test.done();
        }).end();
};
