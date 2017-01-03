'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * 管理状态
 */
var __ViewManager = null;

var StateManager = function () {
    _createClass(StateManager, null, [{
        key: '__ViewManager',
        get: function get() {
            return __ViewManager;
        },
        set: function set(v) {
            __ViewManager = v;
        }
    }]);

    function StateManager(store) {
        _classCallCheck(this, StateManager);

        this.store = store;
    }

    _createClass(StateManager, [{
        key: 'getNavigator',
        value: function getNavigator() {
            if (!__ViewManager) {
                __ViewManager = require('./ViewManager');
            }
            return __ViewManager.getNavigator();
        }
    }]);

    return StateManager;
}();

exports.default = StateManager;