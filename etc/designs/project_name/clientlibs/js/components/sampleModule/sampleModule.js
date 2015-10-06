
/*
 * sampleModule.js
 * [ Description of the sample module script ]
 *
 * @project:    SN-FE-QS
 * @date:       xxxx-xx-xx
 * @author:     Santhosh, szacharia@sapient.com
 * @licensor:   SAPIENNITRO
 * @namespaces: snqs
 */

var snqs = window.snqs || {};

snqs.SampleModule = (function (window, $, namespace) {
    'use strict';

    // public methods
    var init,

    // private methods
        _privateMethod,

    // properties
        property = null;

    _privateMethod = function () {
        return property;
    };


    init = function () { 
        return _privateMethod();
    };

    // Public API
    return {
        init: init
    };

}(this, jQuery, 'snqs'));

jQuery(snqs.SampleModule.init());
