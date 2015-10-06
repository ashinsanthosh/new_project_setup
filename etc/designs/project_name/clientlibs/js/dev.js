snqs.renderTemplate = function(component, jsonData, scriptData) {
    var templates = $(document, 'link[href="' + component + '"]'),
        component_path = 'components/',
        templatePointer = 'document, link[href="' + component + '"]',
        scriptArry = [];
    var ele = templates,
        path = component,
        jsonPath = jsonData || '/index.json',
        comScript = scriptData || '';

    comScript = comScript.replace(/\s+/g, '');

    if (comScript.indexOf(',') >= -1) {
        var multiples = comScript.split(',');
        for (i = 0; i < multiples.length; i++) {
            scriptArry.push(multiples[i]);
        }
    } else {
        scriptArry.push(comScript);
    }

    $.get(component_path + path + jsonPath, function(data) {
        var jsonData = data;

        $.get(component_path + path, function(template) {
            var rendered = Mustache.render(template, jsonData);
            $(templatePointer).before(rendered);
            $(templatePointer).remove();
        });

    });

    var scripts = $.unique(scriptArry);
    scripts = jQuery.grep(scripts, function(n) {
        return (n);
    });

    for (s = 0; s < scripts.length; s++) {

        $.getScript('./dist/etc/designs/'+pro_name+'/clientlibs/js/' + scripts[s] + '.js');

        if (s == (scripts.length - 1)) {
            break;
        }
    }
};

snqs.loadTemplates = function() {

    var templates = $('link[class="component"]'),
        component_path = 'components/',
        scriptArry = [];

    $.each(templates, function(i, el) {
        var ele = $(el),
            path = ele.attr('href'),
            jsonPath = ele.data('json') || '/index.json',
            comScript = ele.data('script') || '';

        comScript = comScript.replace(/\s+/g, '');

        if (comScript.indexOf(',') >= -1) {
            var multiples = comScript.split(',');
            for (i = 0; i < multiples.length; i++) {
                scriptArry.push(multiples[i]);
            }
        } else {
            scriptArry.push(comScript);
        }

        $.get(component_path + path + jsonPath, function(data) {
            var jsonData = data;

            $.get(component_path + path, function(template) {
                var rendered = Mustache.render(template, jsonData);
                $(el).before(rendered);
                $(el).remove();
            });

        });

    });

    var scripts = $.unique(scriptArry);
    scripts = jQuery.grep(scripts, function(n) {
        return (n);
    });

    for (s = 0; s < scripts.length; s++) {

        $.getScript('./dist/etc/designs/'+pro_name+'/clientlibs/js/' + scripts[s] + '.js');

        if (s == (scripts.length - 1)) {
            break;
        }
    }

    snqs.loaded = true;

}