exports.createReader = createReader;

var q = require("q");

function createReader(templates) {
    return {
        read: function(name) {
            return q.when(templates[name]);
        }
    };
}
