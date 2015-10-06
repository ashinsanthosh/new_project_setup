var snqs = snqs || {},
    pro_name='project_name';

jQuery.browser = {};
(function() {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();

snqs = {
    loaded: false,

    init: function() {
        // If on HTML dev environment, load Mustache rendering engine. Otherwise continue.
        if ($('.parsys').size() <= 0) {
            $.getScript('dist/etc/designs/'+pro_name+'/clientlibs/js/dev.js', function() {
                snqs.loadTemplates();
            });
        } else {
            snqs.loadTemplates = function() {};
            snqs.renderTemplate = function() {};
        }

        this.breakpoints();
    },

    breakpoints: function() {
        this.viewport = viewport([{
            name: 'small',
            width: [0, 750] // ( min-width:0px ) and ( max-width:480px )
        }, {
            name: 'medium',
            width: [751, 959] // ( min-width:480px ) and ( max-width:767px )
        }, {
            name: 'large',
            width: [960] // ( min-width:769px )
        }]);
    }

};

snqs.init();