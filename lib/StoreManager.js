'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StoreManager = function () {
    function StoreManager() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, StoreManager);

        this.data = _immutable2.default.Map(data);
    }

    _createClass(StoreManager, [{
        key: 'getState',
        value: function getState() {
            return this.data.toJS();
        }
    }, {
        key: 'getImmutableData',
        value: function getImmutableData() {
            return this.data;
        }
    }, {
        key: 'setState',
        value: function setState(newState, cb) {
            if ((typeof newState === 'undefined' ? 'undefined' : _typeof(newState)) === "object") {
                this.data = this.getImmutableData().merge(newState);
            }
            if (typeof this.updateView === 'function') {
                this.updateView(cb);
            }
            return this.getState();
        }
    }]);

    return StoreManager;
}();

exports.default = StoreManager;