module.exports = function(jsRootDir, templatesRootDir) {
    var resolveTemplate = function(parsedName) {
        var moduleName = templatesRootDir+'/'+normalizeTemplateName(parsedName.name);
        return require(moduleName, true);
    };

    var resolveOther = function(parsedName) {
        var fullName = parsedName.fullName;

        if (fullName === 'application:main') {
            return null;
        }
        if (fullName === 'router:main') {
            return require(jsRootDir+'/router');
        }

        var type = parsedName.type,
            name = parsedName.name,
            moduleName = jsRootDir+'/'+type+'s/'+normalizeOtherName(name);

        return require(moduleName, true);
    };

    var normalize = function(fullName) {
        var split = fullName.split(':', 2),
            type = split[0],
            name = split[1];

        Ember.assert("Tried to normalize a container name without a colon (:) in it. You probably tried to lookup a name that did not contain a type, a colon, and a name. A proper lookup name would be `view:post`.", split.length === 2);

        if (type !== 'template') {
            return type + ':' + normalizeOtherName(name);
        } else {
            return fullName;
        }
    };

    var normalizeTemplateName = function(name) {
        name = name.dasherize();
        name = name.replace(/\./g, '/');
        return name;
    };

    var normalizeOtherName = function(name) {
        name = name.dasherize();
        name = name.replace(/\./g, '-');
        return name;
    };

    return Ember.DefaultResolver.extend({
        resolveTemplate: resolveTemplate,
        resolveOther: resolveOther,
        normalize: normalize
    });
};
