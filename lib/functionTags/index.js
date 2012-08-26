exports.include = require("./include").include;
exports.hole = require("./include").hole;
exports.for_ = require("./for").for_;
exports.if_ = require("./if").if_;

exports.defaults = {
    include: exports.include,
    hole: exports.hole,
    "for": exports.for_,
    "if": exports.if_
};
