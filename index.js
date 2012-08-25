exports.Templates = require("./lib/templating").Templates;
exports.FileTemplateReader = FileTemplateReader
exports.createStaticContext = require("./lib/staticContexts").create;


function FileTemplateReader(root) {
    this._root = root;
}

FileTemplateReader.prototype.read = function(name) {
    var templatePath = path.join(this._root, name);
    return q.ninvoke(fs, "readFile", templatePath, "utf8");
};

