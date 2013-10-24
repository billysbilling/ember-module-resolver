module.exports = Ember.DefaultResolver.extend({
    resolveTemplate: resolveTemplate,
    resolveOther: resolveOther,
    normalize: normalize
});

function resolveTemplate(parsedName) {
    var moduleName = '../templates/'+normalizeTemplateName(parsedName.name);
    return require(moduleName, true);
}

function resolveOther(parsedName) {
    var fullName = parsedName.fullName;

    if (fullName === 'application:main') {
        return null;
    }
    if (fullName === 'router:main') {
        return require('./router');
    }

    var type = parsedName.type,
        name = parsedName.name,
        moduleName = './'+type+'s/'+normalizeOtherName(name);

    if (type === 'util') {
        return null;
    }

    return require(moduleName, true);
}

function normalize(fullName) {
    var split = fullName.split(':', 2),
        type = split[0],
        name = split[1];

    Ember.assert("Tried to normalize a container name without a colon (:) in it. You probably tried to lookup a name that did not contain a type, a colon, and a name. A proper lookup name would be `view:post`.", split.length === 2);

    if (type !== 'template') {
        return type + ':' + normalizeOtherName(name);
    } else {
        return fullName;
    }
}

function normalizeTemplateName(name) {
    name = name.dasherize();
    name = name.replace(/\./g, '/');
    return name;
}

function normalizeOtherName(name) {
    name = name.dasherize();
    name = name.replace(/\./g, '-');
    return name;
}