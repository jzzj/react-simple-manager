'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _StateManager = require('./StateManager');

var _StateManager2 = _interopRequireDefault(_StateManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * manage store、events and events's handlers
 */
var __navigator = null;

var ViewManager = function () {
    _createClass(ViewManager, null, [{
        key: 'getNavigator',
        value: function getNavigator() {
            return __navigator;
        }
    }, {
        key: '__navigator',
        get: function get() {
            return __navigator;
        },
        set: function set(v) {
            __navigator = v;
        }
    }]);

    function ViewManager(store) {
        var _this = this;

        _classCallCheck(this, ViewManager);

        this.__store = store;
        if (!store.updateView) {
            this.__store.updateView = this.__updateView.bind(this);
        }
        var events = [],
            handlers = [];

        for (var _len = arguments.length, managers = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            managers[_key - 1] = arguments[_key];
        }

        managers.forEach(function (manager, idx) {
            // also could pass a Manager class that extends StateManager
            if (Object.getPrototypeOf(manager) === _StateManager2.default) {
                manager = new manager();
            }

            // pass store to state manager if manager.store not exists
            if (!manager.store) {
                manager.store = store;
            }
            manager.__viewManager = _this;
            var managerEvents = manager.constructor.events || manager.events || {};

            var keys = void 0,
                values = void 0;
            if (Array.isArray(managerEvents)) {
                keys = values = managerEvents;
            } else {
                keys = Object.keys(managerEvents);
                values = keys.map(function (key) {
                    return managerEvents[key];
                });
            }

            events = events.concat(keys);
            values.forEach(function (event, i) {
                var handler = manager[event];
                if (handler && typeof handler === 'function') {
                    handler = handler.bind(manager);
                    var queue = _this[keys[i]];
                    if (queue) {
                        if (Array.isArray(queue)) {
                            queue.push(handler);
                        } else {
                            _this[keys[i]] = [queue, handler];
                        }
                    } else {
                        _this[keys[i]] = handler;
                    }
                } else {
                    console.warn(keys[i], 'is not a function, please check the', idx, 'manager');
                }
            });
        });
        this.__events = events;
        //this.__handlers = handlers;
        //this.__isUnique();
    }

    _createClass(ViewManager, [{
        key: 'dispatch',
        value: function dispatch(action) {
            var _this2 = this;

            for (var _len2 = arguments.length, argv = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                argv[_key2 - 1] = arguments[_key2];
            }

            /*
             if(this.__repeatList.indexOf(action) !== -1){
                console.warn('repeat events: ', this.__repeatList.join());
             }
            */

            var handler = this[action];

            if (handler) {
                if (Array.isArray(handler)) {
                    return handler.map(function (func) {
                        return func.apply(_this2, argv);
                    });
                } else {
                    return handler.apply(this, argv);
                }
            } else {
                return console.warn(action, ' have no handler');
            }
        }
    }, {
        key: '__isUnique',
        value: function __isUnique() {
            var events = this.__events;
            var repeatList = [];
            events.forEach(function (item, idx) {
                if (events.indexOf(item) !== idx) {
                    repeatList.push(item);
                }
            });
            if (repeatList.length) {
                console.warn('repeat events: ', events.join());
                this.__repeatList = repeatList;
                return false;
            }
            this.__repeatList = [];
            return true;
        }
    }, {
        key: 'bindView',
        value: function bindView(view) {
            var _this3 = this;

            var updateView = this.updateView;


            this.__view = view;
            this.__waitFor = 0;
            this.updateView = function () {
                _this3.__waitFor++;
            };

            // only for react-native
            if (view && view.props && view.props.navigator) {
                ViewManager.__navigator = view.props.navigator;
            }

            var _componentDidMount = view.componentDidMount,
                _componentWillUnmount = view.componentWillUnmount;

            Object.assign(view, {
                componentWillUnmount: function componentWillUnmount() {
                    for (var _len3 = arguments.length, argv = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        argv[_key3] = arguments[_key3];
                    }

                    _this3.__view = null;
                    _this3.updateView = function () {};
                    _this3.__store.updateView = null;
                    return _componentWillUnmount && _componentWillUnmount.apply(view, argv);
                },
                componentDidMount: function componentDidMount() {
                    for (var _len4 = arguments.length, argv = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                        argv[_key4] = arguments[_key4];
                    }

                    _this3.updateView = updateView;
                    if (_this3.__waitFor > 0) {
                        _this3.updateView();
                    }

                    var ret = _componentDidMount && _componentDidMount.apply(view, argv);
                    _this3.__ready = true;
                    return ret;
                }
            });
            return this;
        }
    }, {
        key: '__updateView',
        value: function __updateView(cb) {
            if (!this.__ready) {
                this.__waitFor = (this.__waitFor || 0) + 1;
            } else {
                return this.updateView(cb);
            }
        }
    }, {
        key: 'getNavigator',
        value: function getNavigator() {
            return ViewManager.__navigator;
        }
    }, {
        key: 'updateView',
        value: function updateView(cb) {
            if (!this.__view) {
                throw new Error("no view was bind to this manager, please call manager.bindView(view)!");
            }
            return this.__view.setState(this.__store.getState(), cb);
        }
    }]);

    return ViewManager;
}();

exports.default = ViewManager;