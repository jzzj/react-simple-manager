'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = StoreManager;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function StoreManager() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var __data = _immutable2.default.Map(data);
    return {
        getState: function getState() {
            return __data.toJS();
        },
        getImmutableData: function getImmutableData() {
            return __data;
        },
        setState: function setState(newState) {
            if ((typeof newState === 'undefined' ? 'undefined' : _typeof(newState)) === "object") {
                __data = this.getImmutableData().merge(newState);
            }
            if (typeof this.updateView === 'function') {
                this.updateView();
            }
            return this.getState();
        }
    };
}