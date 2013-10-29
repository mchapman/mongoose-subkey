/*!
 * Mongoose Subkey Plugin
 * Copyright(c) 2013 Mark Chapman
 * MIT Licensed
 */

var mongoose = require('mongoose');

function subkeyPlugin(schema, options) {
    schema.pre('save', function (next) {
        for (var i = 0; i < options.subschemas.length; i++) {
            var subSchema = options.subschemas[i]
                , list = this[subSchema.list];
            for (var j = 1; j < list.length; j++) {
                for (var k = 0; k < j; k++) {
                    var matching = true;
                    for (var keyPart = 0; keyPart < subSchema.keyList.length ; keyPart++) {
                        var key = subSchema.keyList[keyPart];
                        // Not (currently) concerned with objects here - just simple types
                        if (list[j][key] !== list[k][key]) {
                            matching = false;
                            break;
                        }
                    }
                    if (matching) {
                        return next(new Error("Duplicate " + subSchema.list + " not allowed"))
                    }
                }
            }
        }
        next();
    });
}

module.exports = subkeyPlugin;