(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.SilverDecisions || (g.SilverDecisions = {})).App = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var copy             = require('es5-ext/object/copy')
  , normalizeOptions = require('es5-ext/object/normalize-options')
  , ensureCallable   = require('es5-ext/object/valid-callable')
  , map              = require('es5-ext/object/map')
  , callable         = require('es5-ext/object/valid-callable')
  , validValue       = require('es5-ext/object/valid-value')

  , bind = Function.prototype.bind, defineProperty = Object.defineProperty
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , define;

define = function (name, desc, options) {
	var value = validValue(desc) && callable(desc.value), dgs;
	dgs = copy(desc);
	delete dgs.writable;
	delete dgs.value;
	dgs.get = function () {
		if (!options.overwriteDefinition && hasOwnProperty.call(this, name)) return value;
		desc.value = bind.call(value, options.resolveContext ? options.resolveContext(this) : this);
		defineProperty(this, name, desc);
		return this[name];
	};
	return dgs;
};

module.exports = function (props/*, options*/) {
	var options = normalizeOptions(arguments[1]);
	if (options.resolveContext != null) ensureCallable(options.resolveContext);
	return map(props, function (desc, name) { return define(name, desc, options); });
};

},{"es5-ext/object/copy":24,"es5-ext/object/map":33,"es5-ext/object/normalize-options":34,"es5-ext/object/valid-callable":38,"es5-ext/object/valid-value":39}],2:[function(require,module,exports){
'use strict';

var assign        = require('es5-ext/object/assign')
  , normalizeOpts = require('es5-ext/object/normalize-options')
  , isCallable    = require('es5-ext/object/is-callable')
  , contains      = require('es5-ext/string/#/contains')

  , d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

},{"es5-ext/object/assign":21,"es5-ext/object/is-callable":27,"es5-ext/object/normalize-options":34,"es5-ext/string/#/contains":40}],3:[function(require,module,exports){
// Inspired by Google Closure:
// http://closure-library.googlecode.com/svn/docs/
// closure_goog_array_array.js.html#goog.array.clear

"use strict";

var value = require("../../object/valid-value");

module.exports = function () {
	value(this).length = 0;
	return this;
};

},{"../../object/valid-value":39}],4:[function(require,module,exports){
"use strict";

var numberIsNaN       = require("../../number/is-nan")
  , toPosInt          = require("../../number/to-pos-integer")
  , value             = require("../../object/valid-value")
  , indexOf           = Array.prototype.indexOf
  , objHasOwnProperty = Object.prototype.hasOwnProperty
  , abs               = Math.abs
  , floor             = Math.floor;

module.exports = function (searchElement /*, fromIndex*/) {
	var i, length, fromIndex, val;
	if (!numberIsNaN(searchElement)) return indexOf.apply(this, arguments);

	length = toPosInt(value(this).length);
	fromIndex = arguments[1];
	if (isNaN(fromIndex)) fromIndex = 0;
	else if (fromIndex >= 0) fromIndex = floor(fromIndex);
	else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));

	for (i = fromIndex; i < length; ++i) {
		if (objHasOwnProperty.call(this, i)) {
			val = this[i];
			if (numberIsNaN(val)) return i; // Jslint: ignore
		}
	}
	return -1;
};

},{"../../number/is-nan":15,"../../number/to-pos-integer":19,"../../object/valid-value":39}],5:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Array.from
	: require("./shim");

},{"./is-implemented":6,"./shim":7}],6:[function(require,module,exports){
"use strict";

module.exports = function () {
	var from = Array.from, arr, result;
	if (typeof from !== "function") return false;
	arr = ["raz", "dwa"];
	result = from(arr);
	return Boolean(result && (result !== arr) && (result[1] === "dwa"));
};

},{}],7:[function(require,module,exports){
"use strict";

var iteratorSymbol = require("es6-symbol").iterator
  , isArguments    = require("../../function/is-arguments")
  , isFunction     = require("../../function/is-function")
  , toPosInt       = require("../../number/to-pos-integer")
  , callable       = require("../../object/valid-callable")
  , validValue     = require("../../object/valid-value")
  , isValue        = require("../../object/is-value")
  , isString       = require("../../string/is-string")
  , isArray        = Array.isArray
  , call           = Function.prototype.call
  , desc           = { configurable: true, enumerable: true, writable: true, value: null }
  , defineProperty = Object.defineProperty;

// eslint-disable-next-line complexity
module.exports = function (arrayLike /*, mapFn, thisArg*/) {
	var mapFn = arguments[1]
	  , thisArg = arguments[2]
	  , Context
	  , i
	  , j
	  , arr
	  , length
	  , code
	  , iterator
	  , result
	  , getIterator
	  , value;

	arrayLike = Object(validValue(arrayLike));

	if (isValue(mapFn)) callable(mapFn);
	if (!this || this === Array || !isFunction(this)) {
		// Result: Plain array
		if (!mapFn) {
			if (isArguments(arrayLike)) {
				// Source: Arguments
				length = arrayLike.length;
				if (length !== 1) return Array.apply(null, arrayLike);
				arr = new Array(1);
				arr[0] = arrayLike[0];
				return arr;
			}
			if (isArray(arrayLike)) {
				// Source: Array
				arr = new Array(length = arrayLike.length);
				for (i = 0; i < length; ++i) arr[i] = arrayLike[i];
				return arr;
			}
		}
		arr = [];
	} else {
		// Result: Non plain array
		Context = this;
	}

	if (!isArray(arrayLike)) {
		if ((getIterator = arrayLike[iteratorSymbol]) !== undefined) {
			// Source: Iterator
			iterator = callable(getIterator).call(arrayLike);
			if (Context) arr = new Context();
			result = iterator.next();
			i = 0;
			while (!result.done) {
				value = mapFn ? call.call(mapFn, thisArg, result.value, i) : result.value;
				if (Context) {
					desc.value = value;
					defineProperty(arr, i, desc);
				} else {
					arr[i] = value;
				}
				result = iterator.next();
				++i;
			}
			length = i;
		} else if (isString(arrayLike)) {
			// Source: String
			length = arrayLike.length;
			if (Context) arr = new Context();
			for (i = 0, j = 0; i < length; ++i) {
				value = arrayLike[i];
				if (i + 1 < length) {
					code = value.charCodeAt(0);
					// eslint-disable-next-line max-depth
					if (code >= 0xd800 && code <= 0xdbff) value += arrayLike[++i];
				}
				value = mapFn ? call.call(mapFn, thisArg, value, j) : value;
				if (Context) {
					desc.value = value;
					defineProperty(arr, j, desc);
				} else {
					arr[j] = value;
				}
				++j;
			}
			length = j;
		}
	}
	if (length === undefined) {
		// Source: array or array-like
		length = toPosInt(arrayLike.length);
		if (Context) arr = new Context(length);
		for (i = 0; i < length; ++i) {
			value = mapFn ? call.call(mapFn, thisArg, arrayLike[i], i) : arrayLike[i];
			if (Context) {
				desc.value = value;
				defineProperty(arr, i, desc);
			} else {
				arr[i] = value;
			}
		}
	}
	if (Context) {
		desc.value = null;
		arr.length = length;
	}
	return arr;
};

},{"../../function/is-arguments":8,"../../function/is-function":9,"../../number/to-pos-integer":19,"../../object/is-value":29,"../../object/valid-callable":38,"../../object/valid-value":39,"../../string/is-string":43,"es6-symbol":56}],8:[function(require,module,exports){
"use strict";

var objToString = Object.prototype.toString
  , id = objToString.call(
	(function () {
		return arguments;
	})()
);

module.exports = function (value) {
	return objToString.call(value) === id;
};

},{}],9:[function(require,module,exports){
"use strict";

var objToString = Object.prototype.toString, id = objToString.call(require("./noop"));

module.exports = function (value) {
	return typeof value === "function" && objToString.call(value) === id;
};

},{"./noop":10}],10:[function(require,module,exports){
"use strict";

// eslint-disable-next-line no-empty-function
module.exports = function () {};

},{}],11:[function(require,module,exports){
/* eslint strict: "off" */

module.exports = (function () {
	return this;
}());

},{}],12:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Math.sign
	: require("./shim");

},{"./is-implemented":13,"./shim":14}],13:[function(require,module,exports){
"use strict";

module.exports = function () {
	var sign = Math.sign;
	if (typeof sign !== "function") return false;
	return (sign(10) === 1) && (sign(-20) === -1);
};

},{}],14:[function(require,module,exports){
"use strict";

module.exports = function (value) {
	value = Number(value);
	if (isNaN(value) || (value === 0)) return value;
	return value > 0 ? 1 : -1;
};

},{}],15:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Number.isNaN
	: require("./shim");

},{"./is-implemented":16,"./shim":17}],16:[function(require,module,exports){
"use strict";

module.exports = function () {
	var numberIsNaN = Number.isNaN;
	if (typeof numberIsNaN !== "function") return false;
	return !numberIsNaN({}) && numberIsNaN(NaN) && !numberIsNaN(34);
};

},{}],17:[function(require,module,exports){
"use strict";

module.exports = function (value) {
	// eslint-disable-next-line no-self-compare
	return value !== value;
};

},{}],18:[function(require,module,exports){
"use strict";

var sign = require("../math/sign")

  , abs = Math.abs, floor = Math.floor;

module.exports = function (value) {
	if (isNaN(value)) return 0;
	value = Number(value);
	if ((value === 0) || !isFinite(value)) return value;
	return sign(value) * floor(abs(value));
};

},{"../math/sign":12}],19:[function(require,module,exports){
"use strict";

var toInteger = require("./to-integer")

  , max = Math.max;

module.exports = function (value) {
 return max(0, toInteger(value));
};

},{"./to-integer":18}],20:[function(require,module,exports){
// Internal method, used by iteration functions.
// Calls a function for each key-value pair found in object
// Optionally takes compareFn to iterate object in specific order

"use strict";

var callable                = require("./valid-callable")
  , value                   = require("./valid-value")
  , bind                    = Function.prototype.bind
  , call                    = Function.prototype.call
  , keys                    = Object.keys
  , objPropertyIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function (method, defVal) {
	return function (obj, cb /*, thisArg, compareFn*/) {
		var list, thisArg = arguments[2], compareFn = arguments[3];
		obj = Object(value(obj));
		callable(cb);

		list = keys(obj);
		if (compareFn) {
			list.sort(typeof compareFn === "function" ? bind.call(compareFn, obj) : undefined);
		}
		if (typeof method !== "function") method = list[method];
		return call.call(method, list, function (key, index) {
			if (!objPropertyIsEnumerable.call(obj, key)) return defVal;
			return call.call(cb, thisArg, obj[key], key, obj, index);
		});
	};
};

},{"./valid-callable":38,"./valid-value":39}],21:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Object.assign
	: require("./shim");

},{"./is-implemented":22,"./shim":23}],22:[function(require,module,exports){
"use strict";

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== "function") return false;
	obj = { foo: "raz" };
	assign(obj, { bar: "dwa" }, { trzy: "trzy" });
	return (obj.foo + obj.bar + obj.trzy) === "razdwatrzy";
};

},{}],23:[function(require,module,exports){
"use strict";

var keys  = require("../keys")
  , value = require("../valid-value")
  , max   = Math.max;

module.exports = function (dest, src /*, …srcn*/) {
	var error, i, length = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try {
			dest[key] = src[key];
		} catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < length; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

},{"../keys":30,"../valid-value":39}],24:[function(require,module,exports){
"use strict";

var aFrom  = require("../array/from")
  , assign = require("./assign")
  , value  = require("./valid-value");

module.exports = function (obj/*, propertyNames, options*/) {
	var copy = Object(value(obj)), propertyNames = arguments[1], options = Object(arguments[2]);
	if (copy !== obj && !propertyNames) return copy;
	var result = {};
	if (propertyNames) {
		aFrom(propertyNames, function (propertyName) {
			if (options.ensure || propertyName in obj) result[propertyName] = obj[propertyName];
		});
	} else {
		assign(result, obj);
	}
	return result;
};

},{"../array/from":5,"./assign":21,"./valid-value":39}],25:[function(require,module,exports){
// Workaround for http://code.google.com/p/v8/issues/detail?id=2804

"use strict";

var create = Object.create, shim;

if (!require("./set-prototype-of/is-implemented")()) {
	shim = require("./set-prototype-of/shim");
}

module.exports = (function () {
	var nullObject, polyProps, desc;
	if (!shim) return create;
	if (shim.level !== 1) return create;

	nullObject = {};
	polyProps = {};
	desc = {
		configurable: false,
		enumerable: false,
		writable: true,
		value: undefined
	};
	Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
		if (name === "__proto__") {
			polyProps[name] = {
				configurable: true,
				enumerable: false,
				writable: true,
				value: undefined
			};
			return;
		}
		polyProps[name] = desc;
	});
	Object.defineProperties(nullObject, polyProps);

	Object.defineProperty(shim, "nullPolyfill", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: nullObject
	});

	return function (prototype, props) {
		return create(prototype === null ? nullObject : prototype, props);
	};
}());

},{"./set-prototype-of/is-implemented":36,"./set-prototype-of/shim":37}],26:[function(require,module,exports){
"use strict";

module.exports = require("./_iterate")("forEach");

},{"./_iterate":20}],27:[function(require,module,exports){
// Deprecated

"use strict";

module.exports = function (obj) {
 return typeof obj === "function";
};

},{}],28:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

var map = { function: true, object: true };

module.exports = function (value) {
	return (isValue(value) && map[typeof value]) || false;
};

},{"./is-value":29}],29:[function(require,module,exports){
"use strict";

var _undefined = require("../function/noop")(); // Support ES3 engines

module.exports = function (val) {
 return (val !== _undefined) && (val !== null);
};

},{"../function/noop":10}],30:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Object.keys
	: require("./shim");

},{"./is-implemented":31,"./shim":32}],31:[function(require,module,exports){
"use strict";

module.exports = function () {
	try {
		Object.keys("primitive");
		return true;
	} catch (e) {
 return false;
}
};

},{}],32:[function(require,module,exports){
"use strict";

var isValue = require("../is-value");

var keys = Object.keys;

module.exports = function (object) {
	return keys(isValue(object) ? Object(object) : object);
};

},{"../is-value":29}],33:[function(require,module,exports){
"use strict";

var callable = require("./valid-callable")
  , forEach  = require("./for-each")
  , call     = Function.prototype.call;

module.exports = function (obj, cb /*, thisArg*/) {
	var result = {}, thisArg = arguments[2];
	callable(cb);
	forEach(obj, function (value, key, targetObj, index) {
		result[key] = call.call(cb, thisArg, value, key, targetObj, index);
	});
	return result;
};

},{"./for-each":26,"./valid-callable":38}],34:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

// eslint-disable-next-line no-unused-vars
module.exports = function (opts1 /*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (!isValue(options)) return;
		process(Object(options), result);
	});
	return result;
};

},{"./is-value":29}],35:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Object.setPrototypeOf
	: require("./shim");

},{"./is-implemented":36,"./shim":37}],36:[function(require,module,exports){
"use strict";

var create = Object.create, getPrototypeOf = Object.getPrototypeOf, plainObject = {};

module.exports = function (/* CustomCreate*/) {
	var setPrototypeOf = Object.setPrototypeOf, customCreate = arguments[0] || create;
	if (typeof setPrototypeOf !== "function") return false;
	return getPrototypeOf(setPrototypeOf(customCreate(null), plainObject)) === plainObject;
};

},{}],37:[function(require,module,exports){
/* eslint no-proto: "off" */

// Big thanks to @WebReflection for sorting this out
// https://gist.github.com/WebReflection/5593554

"use strict";

var isObject        = require("../is-object")
  , value           = require("../valid-value")
  , objIsPrototypeOf = Object.prototype.isPrototypeOf
  , defineProperty  = Object.defineProperty
  , nullDesc        = {
	configurable: true,
	enumerable: false,
	writable: true,
	value: undefined
}
  , validate;

validate = function (obj, prototype) {
	value(obj);
	if (prototype === null || isObject(prototype)) return obj;
	throw new TypeError("Prototype must be null or an object");
};

module.exports = (function (status) {
	var fn, set;
	if (!status) return null;
	if (status.level === 2) {
		if (status.set) {
			set = status.set;
			fn = function (obj, prototype) {
				set.call(validate(obj, prototype), prototype);
				return obj;
			};
		} else {
			fn = function (obj, prototype) {
				validate(obj, prototype).__proto__ = prototype;
				return obj;
			};
		}
	} else {
		fn = function self(obj, prototype) {
			var isNullBase;
			validate(obj, prototype);
			isNullBase = objIsPrototypeOf.call(self.nullPolyfill, obj);
			if (isNullBase) delete self.nullPolyfill.__proto__;
			if (prototype === null) prototype = self.nullPolyfill;
			obj.__proto__ = prototype;
			if (isNullBase) defineProperty(self.nullPolyfill, "__proto__", nullDesc);
			return obj;
		};
	}
	return Object.defineProperty(fn, "level", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: status.level
	});
}(
	(function () {
		var tmpObj1 = Object.create(null)
		  , tmpObj2 = {}
		  , set
		  , desc = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");

		if (desc) {
			try {
				set = desc.set; // Opera crashes at this point
				set.call(tmpObj1, tmpObj2);
			} catch (ignore) {}
			if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { set: set, level: 2 };
		}

		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { level: 2 };

		tmpObj1 = {};
		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { level: 1 };

		return false;
	})()
));

require("../create");

},{"../create":25,"../is-object":28,"../valid-value":39}],38:[function(require,module,exports){
"use strict";

module.exports = function (fn) {
	if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
	return fn;
};

},{}],39:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

module.exports = function (value) {
	if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{"./is-value":29}],40:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? String.prototype.contains
	: require("./shim");

},{"./is-implemented":41,"./shim":42}],41:[function(require,module,exports){
"use strict";

var str = "razdwatrzy";

module.exports = function () {
	if (typeof str.contains !== "function") return false;
	return (str.contains("dwa") === true) && (str.contains("foo") === false);
};

},{}],42:[function(require,module,exports){
"use strict";

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],43:[function(require,module,exports){
"use strict";

var objToString = Object.prototype.toString, id = objToString.call("");

module.exports = function (value) {
	return (
		typeof value === "string" ||
		(value &&
			typeof value === "object" &&
			(value instanceof String || objToString.call(value) === id)) ||
		false
	);
};

},{}],44:[function(require,module,exports){
"use strict";

var setPrototypeOf = require("es5-ext/object/set-prototype-of")
  , contains       = require("es5-ext/string/#/contains")
  , d              = require("d")
  , Symbol         = require("es6-symbol")
  , Iterator       = require("./");

var defineProperty = Object.defineProperty, ArrayIterator;

ArrayIterator = module.exports = function (arr, kind) {
	if (!(this instanceof ArrayIterator)) throw new TypeError("Constructor requires 'new'");
	Iterator.call(this, arr);
	if (!kind) kind = "value";
	else if (contains.call(kind, "key+value")) kind = "key+value";
	else if (contains.call(kind, "key")) kind = "key";
	else kind = "value";
	defineProperty(this, "__kind__", d("", kind));
};
if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);

// Internal %ArrayIteratorPrototype% doesn't expose its constructor
delete ArrayIterator.prototype.constructor;

ArrayIterator.prototype = Object.create(Iterator.prototype, {
	_resolve: d(function (i) {
		if (this.__kind__ === "value") return this.__list__[i];
		if (this.__kind__ === "key+value") return [i, this.__list__[i]];
		return i;
	})
});
defineProperty(ArrayIterator.prototype, Symbol.toStringTag, d("c", "Array Iterator"));

},{"./":47,"d":2,"es5-ext/object/set-prototype-of":35,"es5-ext/string/#/contains":40,"es6-symbol":56}],45:[function(require,module,exports){
"use strict";

var isArguments = require("es5-ext/function/is-arguments")
  , callable    = require("es5-ext/object/valid-callable")
  , isString    = require("es5-ext/string/is-string")
  , get         = require("./get");

var isArray = Array.isArray, call = Function.prototype.call, some = Array.prototype.some;

module.exports = function (iterable, cb /*, thisArg*/) {
	var mode, thisArg = arguments[2], result, doBreak, broken, i, length, char, code;
	if (isArray(iterable) || isArguments(iterable)) mode = "array";
	else if (isString(iterable)) mode = "string";
	else iterable = get(iterable);

	callable(cb);
	doBreak = function () {
		broken = true;
	};
	if (mode === "array") {
		some.call(iterable, function (value) {
			call.call(cb, thisArg, value, doBreak);
			return broken;
		});
		return;
	}
	if (mode === "string") {
		length = iterable.length;
		for (i = 0; i < length; ++i) {
			char = iterable[i];
			if (i + 1 < length) {
				code = char.charCodeAt(0);
				if (code >= 0xd800 && code <= 0xdbff) char += iterable[++i];
			}
			call.call(cb, thisArg, char, doBreak);
			if (broken) break;
		}
		return;
	}
	result = iterable.next();

	while (!result.done) {
		call.call(cb, thisArg, result.value, doBreak);
		if (broken) return;
		result = iterable.next();
	}
};

},{"./get":46,"es5-ext/function/is-arguments":8,"es5-ext/object/valid-callable":38,"es5-ext/string/is-string":43}],46:[function(require,module,exports){
"use strict";

var isArguments    = require("es5-ext/function/is-arguments")
  , isString       = require("es5-ext/string/is-string")
  , ArrayIterator  = require("./array")
  , StringIterator = require("./string")
  , iterable       = require("./valid-iterable")
  , iteratorSymbol = require("es6-symbol").iterator;

module.exports = function (obj) {
	if (typeof iterable(obj)[iteratorSymbol] === "function") return obj[iteratorSymbol]();
	if (isArguments(obj)) return new ArrayIterator(obj);
	if (isString(obj)) return new StringIterator(obj);
	return new ArrayIterator(obj);
};

},{"./array":44,"./string":49,"./valid-iterable":50,"es5-ext/function/is-arguments":8,"es5-ext/string/is-string":43,"es6-symbol":56}],47:[function(require,module,exports){
"use strict";

var clear    = require("es5-ext/array/#/clear")
  , assign   = require("es5-ext/object/assign")
  , callable = require("es5-ext/object/valid-callable")
  , value    = require("es5-ext/object/valid-value")
  , d        = require("d")
  , autoBind = require("d/auto-bind")
  , Symbol   = require("es6-symbol");

var defineProperty = Object.defineProperty, defineProperties = Object.defineProperties, Iterator;

module.exports = Iterator = function (list, context) {
	if (!(this instanceof Iterator)) throw new TypeError("Constructor requires 'new'");
	defineProperties(this, {
		__list__: d("w", value(list)),
		__context__: d("w", context),
		__nextIndex__: d("w", 0)
	});
	if (!context) return;
	callable(context.on);
	context.on("_add", this._onAdd);
	context.on("_delete", this._onDelete);
	context.on("_clear", this._onClear);
};

// Internal %IteratorPrototype% doesn't expose its constructor
delete Iterator.prototype.constructor;

defineProperties(
	Iterator.prototype,
	assign(
		{
			_next: d(function () {
				var i;
				if (!this.__list__) return undefined;
				if (this.__redo__) {
					i = this.__redo__.shift();
					if (i !== undefined) return i;
				}
				if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
				this._unBind();
				return undefined;
			}),
			next: d(function () {
				return this._createResult(this._next());
			}),
			_createResult: d(function (i) {
				if (i === undefined) return { done: true, value: undefined };
				return { done: false, value: this._resolve(i) };
			}),
			_resolve: d(function (i) {
				return this.__list__[i];
			}),
			_unBind: d(function () {
				this.__list__ = null;
				delete this.__redo__;
				if (!this.__context__) return;
				this.__context__.off("_add", this._onAdd);
				this.__context__.off("_delete", this._onDelete);
				this.__context__.off("_clear", this._onClear);
				this.__context__ = null;
			}),
			toString: d(function () {
				return "[object " + (this[Symbol.toStringTag] || "Object") + "]";
			})
		},
		autoBind({
			_onAdd: d(function (index) {
				if (index >= this.__nextIndex__) return;
				++this.__nextIndex__;
				if (!this.__redo__) {
					defineProperty(this, "__redo__", d("c", [index]));
					return;
				}
				this.__redo__.forEach(function (redo, i) {
					if (redo >= index) this.__redo__[i] = ++redo;
				}, this);
				this.__redo__.push(index);
			}),
			_onDelete: d(function (index) {
				var i;
				if (index >= this.__nextIndex__) return;
				--this.__nextIndex__;
				if (!this.__redo__) return;
				i = this.__redo__.indexOf(index);
				if (i !== -1) this.__redo__.splice(i, 1);
				this.__redo__.forEach(function (redo, j) {
					if (redo > index) this.__redo__[j] = --redo;
				}, this);
			}),
			_onClear: d(function () {
				if (this.__redo__) clear.call(this.__redo__);
				this.__nextIndex__ = 0;
			})
		})
	)
);

defineProperty(
	Iterator.prototype,
	Symbol.iterator,
	d(function () {
		return this;
	})
);

},{"d":2,"d/auto-bind":1,"es5-ext/array/#/clear":3,"es5-ext/object/assign":21,"es5-ext/object/valid-callable":38,"es5-ext/object/valid-value":39,"es6-symbol":56}],48:[function(require,module,exports){
"use strict";

var isArguments = require("es5-ext/function/is-arguments")
  , isValue     = require("es5-ext/object/is-value")
  , isString    = require("es5-ext/string/is-string");

var iteratorSymbol = require("es6-symbol").iterator
  , isArray        = Array.isArray;

module.exports = function (value) {
	if (!isValue(value)) return false;
	if (isArray(value)) return true;
	if (isString(value)) return true;
	if (isArguments(value)) return true;
	return typeof value[iteratorSymbol] === "function";
};

},{"es5-ext/function/is-arguments":8,"es5-ext/object/is-value":29,"es5-ext/string/is-string":43,"es6-symbol":56}],49:[function(require,module,exports){
// Thanks @mathiasbynens
// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols

"use strict";

var setPrototypeOf = require("es5-ext/object/set-prototype-of")
  , d              = require("d")
  , Symbol         = require("es6-symbol")
  , Iterator       = require("./");

var defineProperty = Object.defineProperty, StringIterator;

StringIterator = module.exports = function (str) {
	if (!(this instanceof StringIterator)) throw new TypeError("Constructor requires 'new'");
	str = String(str);
	Iterator.call(this, str);
	defineProperty(this, "__length__", d("", str.length));
};
if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);

// Internal %ArrayIteratorPrototype% doesn't expose its constructor
delete StringIterator.prototype.constructor;

StringIterator.prototype = Object.create(Iterator.prototype, {
	_next: d(function () {
		if (!this.__list__) return undefined;
		if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
		this._unBind();
		return undefined;
	}),
	_resolve: d(function (i) {
		var char = this.__list__[i], code;
		if (this.__nextIndex__ === this.__length__) return char;
		code = char.charCodeAt(0);
		if (code >= 0xd800 && code <= 0xdbff) return char + this.__list__[this.__nextIndex__++];
		return char;
	})
});
defineProperty(StringIterator.prototype, Symbol.toStringTag, d("c", "String Iterator"));

},{"./":47,"d":2,"es5-ext/object/set-prototype-of":35,"es6-symbol":56}],50:[function(require,module,exports){
"use strict";

var isIterable = require("./is-iterable");

module.exports = function (value) {
	if (!isIterable(value)) throw new TypeError(value + " is not iterable");
	return value;
};

},{"./is-iterable":48}],51:[function(require,module,exports){
'use strict';

if (!require('./is-implemented')()) {
	Object.defineProperty(require('es5-ext/global'), 'Set',
		{ value: require('./polyfill'), configurable: true, enumerable: false,
			writable: true });
}

},{"./is-implemented":52,"./polyfill":55,"es5-ext/global":11}],52:[function(require,module,exports){
'use strict';

module.exports = function () {
	var set, iterator, result;
	if (typeof Set !== 'function') return false;
	set = new Set(['raz', 'dwa', 'trzy']);
	if (String(set) !== '[object Set]') return false;
	if (set.size !== 3) return false;
	if (typeof set.add !== 'function') return false;
	if (typeof set.clear !== 'function') return false;
	if (typeof set.delete !== 'function') return false;
	if (typeof set.entries !== 'function') return false;
	if (typeof set.forEach !== 'function') return false;
	if (typeof set.has !== 'function') return false;
	if (typeof set.keys !== 'function') return false;
	if (typeof set.values !== 'function') return false;

	iterator = set.values();
	result = iterator.next();
	if (result.done !== false) return false;
	if (result.value !== 'raz') return false;

	return true;
};

},{}],53:[function(require,module,exports){
// Exports true if environment provides native `Set` implementation,
// whatever that is.

'use strict';

module.exports = (function () {
	if (typeof Set === 'undefined') return false;
	return (Object.prototype.toString.call(Set.prototype) === '[object Set]');
}());

},{}],54:[function(require,module,exports){
'use strict';

var setPrototypeOf    = require('es5-ext/object/set-prototype-of')
  , contains          = require('es5-ext/string/#/contains')
  , d                 = require('d')
  , Iterator          = require('es6-iterator')
  , toStringTagSymbol = require('es6-symbol').toStringTag

  , defineProperty = Object.defineProperty
  , SetIterator;

SetIterator = module.exports = function (set, kind) {
	if (!(this instanceof SetIterator)) return new SetIterator(set, kind);
	Iterator.call(this, set.__setData__, set);
	if (!kind) kind = 'value';
	else if (contains.call(kind, 'key+value')) kind = 'key+value';
	else kind = 'value';
	defineProperty(this, '__kind__', d('', kind));
};
if (setPrototypeOf) setPrototypeOf(SetIterator, Iterator);

SetIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(SetIterator),
	_resolve: d(function (i) {
		if (this.__kind__ === 'value') return this.__list__[i];
		return [this.__list__[i], this.__list__[i]];
	}),
	toString: d(function () { return '[object Set Iterator]'; })
});
defineProperty(SetIterator.prototype, toStringTagSymbol, d('c', 'Set Iterator'));

},{"d":2,"es5-ext/object/set-prototype-of":35,"es5-ext/string/#/contains":40,"es6-iterator":47,"es6-symbol":56}],55:[function(require,module,exports){
'use strict';

var clear          = require('es5-ext/array/#/clear')
  , eIndexOf       = require('es5-ext/array/#/e-index-of')
  , setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , callable       = require('es5-ext/object/valid-callable')
  , d              = require('d')
  , ee             = require('event-emitter')
  , Symbol         = require('es6-symbol')
  , iterator       = require('es6-iterator/valid-iterable')
  , forOf          = require('es6-iterator/for-of')
  , Iterator       = require('./lib/iterator')
  , isNative       = require('./is-native-implemented')

  , call = Function.prototype.call
  , defineProperty = Object.defineProperty, getPrototypeOf = Object.getPrototypeOf
  , SetPoly, getValues, NativeSet;

if (isNative) NativeSet = Set;

module.exports = SetPoly = function Set(/*iterable*/) {
	var iterable = arguments[0], self;
	if (!(this instanceof SetPoly)) throw new TypeError('Constructor requires \'new\'');
	if (isNative && setPrototypeOf) self = setPrototypeOf(new NativeSet(), getPrototypeOf(this));
	else self = this;
	if (iterable != null) iterator(iterable);
	defineProperty(self, '__setData__', d('c', []));
	if (!iterable) return self;
	forOf(iterable, function (value) {
		if (eIndexOf.call(this, value) !== -1) return;
		this.push(value);
	}, self.__setData__);
	return self;
};

if (isNative) {
	if (setPrototypeOf) setPrototypeOf(SetPoly, NativeSet);
	SetPoly.prototype = Object.create(NativeSet.prototype, { constructor: d(SetPoly) });
}

ee(Object.defineProperties(SetPoly.prototype, {
	add: d(function (value) {
		if (this.has(value)) return this;
		this.emit('_add', this.__setData__.push(value) - 1, value);
		return this;
	}),
	clear: d(function () {
		if (!this.__setData__.length) return;
		clear.call(this.__setData__);
		this.emit('_clear');
	}),
	delete: d(function (value) {
		var index = eIndexOf.call(this.__setData__, value);
		if (index === -1) return false;
		this.__setData__.splice(index, 1);
		this.emit('_delete', index, value);
		return true;
	}),
	entries: d(function () { return new Iterator(this, 'key+value'); }),
	forEach: d(function (cb/*, thisArg*/) {
		var thisArg = arguments[1], iterator, result, value;
		callable(cb);
		iterator = this.values();
		result = iterator._next();
		while (result !== undefined) {
			value = iterator._resolve(result);
			call.call(cb, thisArg, value, value, this);
			result = iterator._next();
		}
	}),
	has: d(function (value) {
		return (eIndexOf.call(this.__setData__, value) !== -1);
	}),
	keys: d(getValues = function () { return this.values(); }),
	size: d.gs(function () { return this.__setData__.length; }),
	values: d(function () { return new Iterator(this); }),
	toString: d(function () { return '[object Set]'; })
}));
defineProperty(SetPoly.prototype, Symbol.iterator, d(getValues));
defineProperty(SetPoly.prototype, Symbol.toStringTag, d('c', 'Set'));

},{"./is-native-implemented":53,"./lib/iterator":54,"d":2,"es5-ext/array/#/clear":3,"es5-ext/array/#/e-index-of":4,"es5-ext/object/set-prototype-of":35,"es5-ext/object/valid-callable":38,"es6-iterator/for-of":45,"es6-iterator/valid-iterable":50,"es6-symbol":56,"event-emitter":61}],56:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')() ? Symbol : require('./polyfill');

},{"./is-implemented":57,"./polyfill":59}],57:[function(require,module,exports){
'use strict';

var validTypes = { object: true, symbol: true };

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try { String(symbol); } catch (e) { return false; }

	// Return 'true' also for polyfills
	if (!validTypes[typeof Symbol.iterator]) return false;
	if (!validTypes[typeof Symbol.toPrimitive]) return false;
	if (!validTypes[typeof Symbol.toStringTag]) return false;

	return true;
};

},{}],58:[function(require,module,exports){
'use strict';

module.exports = function (x) {
	if (!x) return false;
	if (typeof x === 'symbol') return true;
	if (!x.constructor) return false;
	if (x.constructor.name !== 'Symbol') return false;
	return (x[x.constructor.toStringTag] === 'Symbol');
};

},{}],59:[function(require,module,exports){
// ES2015 Symbol polyfill for environments that do not (or partially) support it

'use strict';

var d              = require('d')
  , validateSymbol = require('./validate-symbol')

  , create = Object.create, defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
  , isNativeSafe;

if (typeof Symbol === 'function') {
	NativeSymbol = Symbol;
	try {
		String(NativeSymbol());
		isNativeSafe = true;
	} catch (ignore) {}
}

var generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0, name, ie11BugWorkaround;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		name = '@@' + desc;
		defineProperty(objPrototype, name, d.gs(null, function (value) {
			// For IE11 issue see:
			// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
			//    ie11-broken-getters-on-dom-objects
			// https://github.com/medikoo/es6-symbol/issues/12
			if (ie11BugWorkaround) return;
			ie11BugWorkaround = true;
			defineProperty(this, name, d(value));
			ie11BugWorkaround = false;
		}));
		return name;
	};
}());

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError('Symbol is not a constructor');
	return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
module.exports = SymbolPolyfill = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError('Symbol is not a constructor');
	if (isNativeSafe) return NativeSymbol(description);
	symbol = create(HiddenSymbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};
defineProperties(SymbolPolyfill, {
	for: d(function (key) {
		if (globalSymbols[key]) return globalSymbols[key];
		return (globalSymbols[key] = SymbolPolyfill(String(key)));
	}),
	keyFor: d(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) if (globalSymbols[key] === s) return key;
	}),

	// To ensure proper interoperability with other native functions (e.g. Array.from)
	// fallback to eventual native implementation of given symbol
	hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
	isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
		SymbolPolyfill('isConcatSpreadable')),
	iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
	match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
	replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
	search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
	species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
	split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
	toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
	toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
	unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
});

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
	constructor: d(SymbolPolyfill),
	toString: d('', function () { return this.__name__; })
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
	toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
	var symbol = validateSymbol(this);
	if (typeof symbol === 'symbol') return symbol;
	return symbol.toString();
}));
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));

},{"./validate-symbol":60,"d":2}],60:[function(require,module,exports){
'use strict';

var isSymbol = require('./is-symbol');

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};

},{"./is-symbol":58}],61:[function(require,module,exports){
'use strict';

var d        = require('d')
  , callable = require('es5-ext/object/valid-callable')

  , apply = Function.prototype.apply, call = Function.prototype.call
  , create = Object.create, defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , descriptor = { configurable: true, enumerable: false, writable: true }

  , on, once, off, emit, methods, descriptors, base;

on = function (type, listener) {
	var data;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) {
		data = descriptor.value = create(null);
		defineProperty(this, '__ee__', descriptor);
		descriptor.value = null;
	} else {
		data = this.__ee__;
	}
	if (!data[type]) data[type] = listener;
	else if (typeof data[type] === 'object') data[type].push(listener);
	else data[type] = [data[type], listener];

	return this;
};

once = function (type, listener) {
	var once, self;

	callable(listener);
	self = this;
	on.call(this, type, once = function () {
		off.call(self, type, once);
		apply.call(listener, this, arguments);
	});

	once.__eeOnceListener__ = listener;
	return this;
};

off = function (type, listener) {
	var data, listeners, candidate, i;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) return this;
	data = this.__ee__;
	if (!data[type]) return this;
	listeners = data[type];

	if (typeof listeners === 'object') {
		for (i = 0; (candidate = listeners[i]); ++i) {
			if ((candidate === listener) ||
					(candidate.__eeOnceListener__ === listener)) {
				if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
				else listeners.splice(i, 1);
			}
		}
	} else {
		if ((listeners === listener) ||
				(listeners.__eeOnceListener__ === listener)) {
			delete data[type];
		}
	}

	return this;
};

emit = function (type) {
	var i, l, listener, listeners, args;

	if (!hasOwnProperty.call(this, '__ee__')) return;
	listeners = this.__ee__[type];
	if (!listeners) return;

	if (typeof listeners === 'object') {
		l = arguments.length;
		args = new Array(l - 1);
		for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

		listeners = listeners.slice();
		for (i = 0; (listener = listeners[i]); ++i) {
			apply.call(listener, this, args);
		}
	} else {
		switch (arguments.length) {
		case 1:
			call.call(listeners, this);
			break;
		case 2:
			call.call(listeners, this, arguments[1]);
			break;
		case 3:
			call.call(listeners, this, arguments[1], arguments[2]);
			break;
		default:
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) {
				args[i - 1] = arguments[i];
			}
			apply.call(listeners, this, args);
		}
	}
};

methods = {
	on: on,
	once: once,
	off: off,
	emit: emit
};

descriptors = {
	on: d(on),
	once: d(once),
	off: d(off),
	emit: d(emit)
};

base = defineProperties({}, descriptors);

module.exports = exports = function (o) {
	return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
};
exports.methods = methods;

},{"d":2,"es5-ext/object/valid-callable":38}],62:[function(require,module,exports){
/*!
 * jQuery UI :data 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :data Selector
//>>group: Core
//>>description: Selects elements which have data stored under the specified key.
//>>docs: http://api.jqueryui.com/data-selector/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {
return $.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo( function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		} ) :

		// Support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		}
} );
} ) );

},{}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./src/index');

Object.keys(_index).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _index[key];
    }
  });
});

},{"./src/index":78}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppUtils = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require("./d3");

var d3 = _interopRequireWildcard(_d);

var _templates = require("./templates");

var _i18n = require("./i18n/i18n");

var _sdUtils = require("sd-utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppUtils = function () {
    function AppUtils() {
        _classCallCheck(this, AppUtils);
    }

    _createClass(AppUtils, null, [{
        key: "placeTextWithEllipsis",


        //places textString in textObj, adds an ellipsis if text can't fit in width
        value: function placeTextWithEllipsis(textD3Obj, textString, width) {
            var textObj = textD3Obj.node();
            textObj.textContent = textString;

            var margin = 0;
            var ellipsisLength = 9;
            //ellipsis is needed
            if (textObj.getComputedTextLength() > width + margin) {
                for (var x = textString.length - 3; x > 0; x -= 1) {
                    if (textObj.getSubStringLength(0, x) + ellipsisLength <= width + margin) {
                        textObj.textContent = textString.substring(0, x) + "...";
                        return true;
                    }
                }
                textObj.textContent = "..."; //can't place at all
                return true;
            }
            return false;
        }
    }, {
        key: "placeTextWithEllipsisAndTooltip",
        value: function placeTextWithEllipsisAndTooltip(textD3Obj, textString, width, tooltip) {
            var ellipsisPlaced = AppUtils.placeTextWithEllipsis(textD3Obj, textString, width);
            if (ellipsisPlaced && tooltip) {
                textD3Obj.on("mouseover", function (d) {
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(textString).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                });

                textD3Obj.on("mouseout", function (d) {
                    tooltip.transition().duration(500).style("opacity", 0);
                });
            }
        }
    }, {
        key: "getFontSize",
        value: function getFontSize(element) {
            return window.getComputedStyle(element, null).getPropertyValue("font-size");
        }
    }, {
        key: "getTranslation",
        value: function getTranslation(transform) {
            // Create a dummy g for calculation purposes only. This will never
            // be appended to the DOM and will be discarded once this function
            // returns.
            var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

            // Set the transform attribute to the provided string value.
            g.setAttributeNS(null, "transform", transform);

            // consolidate the SVGTransformList containing all transformations
            // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
            // its SVGMatrix.
            var matrix = g.transform.baseVal.consolidate().matrix;

            // As per definition values e and f are the ones for the translation.
            return [matrix.e, matrix.f];
        }
    }, {
        key: "closestPoint",
        value: function closestPoint(pathNode, point) {
            var pathLength = pathNode.getTotalLength(),
                precision = 8,
                best,
                bestLength,
                bestDistance = Infinity;

            // linear scan for coarse approximation
            for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
                if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
                    best = scan, bestLength = scanLength, bestDistance = scanDistance;
                }
            }

            // binary search for precise estimate
            precision /= 2;
            while (precision > 0.5) {
                var before, after, beforeLength, afterLength, beforeDistance, afterDistance;
                if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
                    best = before, bestLength = beforeLength, bestDistance = beforeDistance;
                } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
                    best = after, bestLength = afterLength, bestDistance = afterDistance;
                } else {
                    precision /= 2;
                }
            }

            best = [best.x, best.y];
            best.distance = Math.sqrt(bestDistance);
            return best;

            function distance2(p) {
                var dx = p.x - point[0],
                    dy = p.y - point[1];
                return dx * dx + dy * dy;
            }
        }
    }, {
        key: "growl",
        value: function growl(message) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
            var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'right';
            var time = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2000;

            var html = _templates.Templates.get('growl', { message: message, type: type });

            var g = d3.select('body').selectOrAppend('div.sd-growl-list.' + position).append('div').html(html);
            setTimeout(function () {
                g.remove();
            }, time);
        }
    }, {
        key: "createElement",
        value: function createElement(tag, attribs, parent) {
            var el = document.createElement(tag);

            if (attribs) {
                AppUtils.deepExtend(el, attribs);
            }
            if (parent) {
                parent.appendChild(el);
            }
            return el;
        }
    }, {
        key: "removeElement",
        value: function removeElement(element) {
            element.parentNode.removeChild(element);
        }
    }, {
        key: "replaceUrls",
        value: function replaceUrls(text) {
            if (!text) {
                return text;
            }
            var urlRegexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/;

            return text.replace(urlRegexp, '<a href="$1" target="_blank">$1</a>');
        }
    }, {
        key: "escapeHtml",
        value: function escapeHtml(html) {
            var text = document.createTextNode(html);
            var div = document.createElement('div');
            div.appendChild(text);
            return div.innerHTML;
        }
    }, {
        key: "dispatchHtmlEvent",
        value: function dispatchHtmlEvent(element, name) {
            if ("createEvent" in document) {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent(name, false, true);
                element.dispatchEvent(evt);
            } else element.fireEvent("on" + name);
        }
    }, {
        key: "dispatchEvent",
        value: function dispatchEvent(name, data) {
            var event;
            try {
                event = new CustomEvent(name, { 'detail': data });
            } catch (e) {
                //IE
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(name, false, false, data);
            }
            document.dispatchEvent(event);
        }
    }, {
        key: "getValidationMessage",
        value: function getValidationMessage(error) {
            if (_sdUtils.Utils.isString(error)) {
                error = { name: error };
            }
            var key = 'validation.' + error.name;
            return _i18n.i18n.t(key, error.data);
        }
    }, {
        key: "hide",
        value: function hide(selection) {
            selection.classed('sd-hidden', true);
        }
    }, {
        key: "show",
        value: function show(selection) {
            var _show = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            selection.classed('sd-hidden', !_show);
        }
    }, {
        key: "isHidden",
        value: function isHidden(el) {
            var exact = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (!el) {
                return true;
            }
            if (exact) {
                var style = window.getComputedStyle(el);
                return style.display === 'none';
            }
            return el.offsetParent === null;
        }
    }, {
        key: "getJSON",
        value: function getJSON(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'json';
            xhr.onload = function () {
                var status = xhr.status;
                if (status == 200) {
                    callback(xhr.response, null);
                } else {
                    callback(null, status);
                }
            };
            xhr.send();
        }
    }]);

    return AppUtils;
}();

exports.AppUtils = AppUtils;

AppUtils.sanitizeHeight = function (height, container) {
    return height || parseInt(container.style('height'), 10) || 400;
};

AppUtils.sanitizeWidth = function (width, container) {
    return width || parseInt(container.style('width'), 10) || 960;
};

AppUtils.availableHeight = function (height, container, margin) {
    return Math.max(0, AppUtils.sanitizeHeight(height, container) - margin.top - margin.bottom);
};

AppUtils.availableWidth = function (width, container, margin) {
    return Math.max(0, AppUtils.sanitizeWidth(width, container) - margin.left - margin.right);
};

},{"./d3":71,"./i18n/i18n":75,"./templates":83,"sd-utils":"sd-utils"}],65:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ContextMenu = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require('../d3');

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*based on:
 * github.com/patorjk/d3-context-menu */

var ContextMenu = exports.ContextMenu = function () {
    function ContextMenu(menu, opts) {
        _classCallCheck(this, ContextMenu);

        var self = this;

        if (typeof opts === 'function') {
            self.openCallback = opts;
        } else {
            opts = opts || {};
            self.openCallback = opts.onOpen;
            self.closeCallback = opts.onClose;
        }

        // create the div element that will hold the context menu
        d3.selectAll('.d3-context-menu').data([1]).enter().append('div').attr('class', 'd3-context-menu');

        // close menu
        d3.select('body').on('click.d3-context-menu', function () {
            d3.select('.d3-context-menu').style('display', 'none');
            if (self.closeCallback) {
                self.closeCallback();
            }
        });

        // this gets executed when a contextmenu event occurs
        return function (data, index) {
            var elm = this;

            d3.selectAll('.d3-context-menu').html('');
            var list = d3.selectAll('.d3-context-menu').on('contextmenu', function (d) {
                d3.select('.d3-context-menu').style('display', 'none');
                d3.event.preventDefault();
                d3.event.stopPropagation();
            }).append('ul');
            list.selectAll('li').data(typeof menu === 'function' ? menu(data) : menu).enter().append('li').attr('class', function (d) {
                var ret = '';
                if (d.divider) {
                    ret += ' is-divider';
                }
                if (d.disabled) {
                    ret += ' is-disabled';
                }
                if (!d.action) {
                    ret += ' is-header';
                }
                return ret;
            }).html(function (d) {
                if (d.divider) {
                    return '<hr>';
                }
                if (!d.title) {
                    console.error('No title attribute set. Check the spelling of your options.');
                }
                return typeof d.title === 'string' ? d.title : d.title(data);
            }).on('click', function (d, i) {
                if (d.disabled) return; // do nothing if disabled
                if (!d.action) return; // headers have no "action"
                d.action(elm, data, index);
                d3.select('.d3-context-menu').style('display', 'none');

                if (self.closeCallback) {
                    self.closeCallback();
                }
            });

            // the openCallback allows an action to fire before the menu is displayed
            // an example usage would be closing a tooltip
            if (self.openCallback) {
                if (self.openCallback(data, index) === false) {
                    return;
                }
            }

            // display context menu
            d3.select('.d3-context-menu').style('left', d3.event.pageX - 2 + 'px').style('top', d3.event.pageY - 2 + 'px').style('display', 'block');

            d3.event.preventDefault();
            d3.event.stopPropagation();
        };
    }

    _createClass(ContextMenu, null, [{
        key: 'hide',
        value: function hide() {
            d3.select('.d3-context-menu').style('display', 'none');
        }
    }]);

    return ContextMenu;
}();

},{"../d3":71}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EdgeContextMenu = undefined;

var _contextMenu = require('./context-menu');

var _i18n = require('../i18n/i18n');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EdgeContextMenu = exports.EdgeContextMenu = function (_ContextMenu) {
    _inherits(EdgeContextMenu, _ContextMenu);

    function EdgeContextMenu(treeDesigner) {
        _classCallCheck(this, EdgeContextMenu);

        var menu = function menu(d) {

            var menu = [];

            menu.push({
                title: _i18n.i18n.t('contextMenu.edge.injectDecisionNode'),
                action: function action(elm, d, i) {
                    treeDesigner.injectDecisionNode(d);
                }
            });
            menu.push({
                title: _i18n.i18n.t('contextMenu.edge.injectChanceNode'),
                action: function action(elm, d, i) {
                    treeDesigner.injectChanceNode(d);
                }
            });

            return menu;
        };

        var _this = _possibleConstructorReturn(this, (EdgeContextMenu.__proto__ || Object.getPrototypeOf(EdgeContextMenu)).call(this, menu));

        _this.treeDesigner = treeDesigner;
        return _this;
    }

    return EdgeContextMenu;
}(_contextMenu.ContextMenu);

},{"../i18n/i18n":75,"./context-menu":65}],67:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MainContextMenu = undefined;

var _contextMenu = require('./context-menu');

var _sdModel = require('sd-model');

var _d = require('../d3');

var d3 = _interopRequireWildcard(_d);

var _i18n = require('../i18n/i18n');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainContextMenu = exports.MainContextMenu = function (_ContextMenu) {
    _inherits(MainContextMenu, _ContextMenu);

    function MainContextMenu(treeDesigner) {
        _classCallCheck(this, MainContextMenu);

        var mousePosition = null;
        var menu = function menu(d) {

            var menu = [];
            menu.push({
                title: _i18n.i18n.t('contextMenu.main.addDecisionNode'),
                action: function action(elm, d, i) {
                    var newNode = new _sdModel.domain.DecisionNode(mousePosition);
                    treeDesigner.addNode(newNode);
                }
            });
            menu.push({
                title: _i18n.i18n.t('contextMenu.main.addChanceNode'),
                action: function action(elm, d, i) {
                    var newNode = new _sdModel.domain.ChanceNode(mousePosition);
                    treeDesigner.addNode(newNode);
                }
            });
            menu.push({ divider: true });
            menu.push({
                title: _i18n.i18n.t('contextMenu.main.addText'),
                action: function action(elm, d, i) {
                    var newText = new _sdModel.domain.Text(mousePosition);
                    treeDesigner.addText(newText);
                }

            });
            menu.push({ divider: true });
            menu.push({
                title: _i18n.i18n.t('contextMenu.main.paste'),
                action: function action(elm, d, i) {
                    treeDesigner.pasteToNewLocation(mousePosition);
                },
                disabled: !treeDesigner.copiedNodes || !treeDesigner.copiedNodes.length

            });
            menu.push({ divider: true });

            menu.push({
                title: _i18n.i18n.t('contextMenu.main.selectAllNodes'),
                action: function action(elm, d, i) {
                    treeDesigner.selectAllNodes();
                }
            });
            return menu;
        };

        var _this = _possibleConstructorReturn(this, (MainContextMenu.__proto__ || Object.getPrototypeOf(MainContextMenu)).call(this, menu, { onOpen: function onOpen() {
                treeDesigner.clearSelection();
                mousePosition = new _sdModel.domain.Point(d3.mouse(treeDesigner.svg.node())).move(treeDesigner.getMainGroupTranslation(true));
            } }));

        _this.treeDesigner = treeDesigner;
        return _this;
    }

    return MainContextMenu;
}(_contextMenu.ContextMenu);

},{"../d3":71,"../i18n/i18n":75,"./context-menu":65,"sd-model":"sd-model"}],68:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NodeContextMenu = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _contextMenu = require('./context-menu');

var _sdModel = require('sd-model');

var _i18n = require('../i18n/i18n');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NodeContextMenu = exports.NodeContextMenu = function (_ContextMenu) {
    _inherits(NodeContextMenu, _ContextMenu);

    function NodeContextMenu(treeDesigner, operationsForObject) {
        _classCallCheck(this, NodeContextMenu);

        var menu = function menu(d) {

            var copyMenuItem = {
                title: _i18n.i18n.t('contextMenu.node.copy'),
                action: function action(elm, d, i) {
                    treeDesigner.selectNode(d, !treeDesigner.isNodeSelected(d));
                    treeDesigner.copySelectedNodes();
                }
            };
            var cutMenuItem = {
                title: _i18n.i18n.t('contextMenu.node.cut'),
                action: function action(elm, d, i) {
                    treeDesigner.selectNode(d, !treeDesigner.isNodeSelected(d));
                    treeDesigner.cutSelectedNodes();
                }
            };
            var pasteMenuItem = {
                title: _i18n.i18n.t('contextMenu.node.paste'),
                action: function action(elm, d, i) {
                    treeDesigner.pasteToNode(d);
                },
                disabled: d.folded || !treeDesigner.copiedNodes || !treeDesigner.copiedNodes.length

            };
            var deleteMenuItem = {
                title: _i18n.i18n.t('contextMenu.node.delete'),
                action: function action(elm, d, i) {

                    treeDesigner.selectNode(d, !treeDesigner.isNodeSelected(d));
                    treeDesigner.removeSelectedNodes();
                }
            };

            var menu = [];
            if (d.type == _sdModel.domain.TerminalNode.$TYPE) {
                menu = [copyMenuItem, cutMenuItem, deleteMenuItem];
                NodeContextMenu.addNodeConversionOptions(d, menu, treeDesigner);
                return menu;
            }

            if (!d.folded) {
                menu.push({
                    title: _i18n.i18n.t('contextMenu.node.addDecisionNode'),
                    action: function action(elm, d, i) {
                        treeDesigner.addDecisionNode(d);
                    }
                });
                menu.push({
                    title: _i18n.i18n.t('contextMenu.node.addChanceNode'),
                    action: function action(elm, d, i) {
                        treeDesigner.addChanceNode(d);
                    }
                });
                menu.push({
                    title: _i18n.i18n.t('contextMenu.node.addTerminalNode'),
                    action: function action(elm, d, i) {
                        treeDesigner.addTerminalNode(d);
                    }
                });
                menu.push({ divider: true });
            }

            menu.push(copyMenuItem);
            menu.push(cutMenuItem);
            menu.push(pasteMenuItem);
            menu.push(deleteMenuItem);

            NodeContextMenu.addNodeConversionOptions(d, menu, treeDesigner);
            menu.push({ divider: true });
            menu.push({
                title: _i18n.i18n.t('contextMenu.node.selectSubtree'),
                action: function action(elm, d, i) {
                    treeDesigner.selectSubTree(d, true);
                }
            });

            if (!d.folded) {
                menu.push({
                    title: _i18n.i18n.t('contextMenu.node.fold'),
                    action: function action(elm, d, i) {
                        treeDesigner.foldSubtree(d);
                    }
                });
            } else {
                menu.push({
                    title: _i18n.i18n.t('contextMenu.node.unfold'),
                    action: function action(elm, d, i) {
                        treeDesigner.foldSubtree(d, false);
                    }
                });
            }

            if (operationsForObject) {
                var operations = operationsForObject(d);
                if (operations.length) {
                    menu.push({ divider: true });
                    operations.forEach(function (op) {
                        menu.push({
                            title: _i18n.i18n.t('contextMenu.node.' + op.name),
                            action: function action(elm, d, i) {
                                treeDesigner.performOperation(d, op);
                            },
                            disabled: !op.canPerform(d)
                        });
                    });
                }
            }

            return menu;
        };

        var _this = _possibleConstructorReturn(this, (NodeContextMenu.__proto__ || Object.getPrototypeOf(NodeContextMenu)).call(this, menu));

        _this.treeDesigner = treeDesigner;
        return _this;
    }

    _createClass(NodeContextMenu, null, [{
        key: 'addNodeConversionOptions',
        value: function addNodeConversionOptions(d, menu, treeDesigner) {
            var conversionOptions = NodeContextMenu.getNodeConversionOptions(d, treeDesigner);
            if (conversionOptions.length) {
                menu.push({ divider: true });
                conversionOptions.forEach(function (o) {
                    return menu.push(o);
                });
            }
        }
    }, {
        key: 'getNodeConversionOptions',
        value: function getNodeConversionOptions(d, treeDesigner) {
            var options = [];

            if (d.folded) {
                return [];
            }

            var allAllowedTypes = [_sdModel.domain.DecisionNode.$TYPE, _sdModel.domain.ChanceNode.$TYPE, _sdModel.domain.TerminalNode.$TYPE];

            if (!d.childEdges.length && d.$parent) {
                allAllowedTypes.filter(function (t) {
                    return t !== d.type;
                }).forEach(function (type) {
                    options.push(NodeContextMenu.getNodeConversionOption(type, treeDesigner));
                });
            } else {
                if (d instanceof _sdModel.domain.DecisionNode) {
                    options.push(NodeContextMenu.getNodeConversionOption(_sdModel.domain.ChanceNode.$TYPE, treeDesigner));
                } else {
                    options.push(NodeContextMenu.getNodeConversionOption(_sdModel.domain.DecisionNode.$TYPE, treeDesigner));
                }
            }
            return options;
        }
    }, {
        key: 'getNodeConversionOption',
        value: function getNodeConversionOption(typeToConvertTo, treeDesigner) {
            return {
                title: _i18n.i18n.t('contextMenu.node.convert.' + typeToConvertTo),
                action: function action(elm, d, i) {
                    treeDesigner.convertNode(d, typeToConvertTo);
                }
            };
        }
    }]);

    return NodeContextMenu;
}(_contextMenu.ContextMenu);

},{"../i18n/i18n":75,"./context-menu":65,"sd-model":"sd-model"}],69:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TextContextMenu = undefined;

var _contextMenu = require('./context-menu');

var _i18n = require('../i18n/i18n');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextContextMenu = exports.TextContextMenu = function (_ContextMenu) {
    _inherits(TextContextMenu, _ContextMenu);

    function TextContextMenu(treeDesigner) {
        _classCallCheck(this, TextContextMenu);

        var menu = function menu(d) {

            var deleteMenuItem = {
                title: _i18n.i18n.t('contextMenu.text.delete'),
                action: function action(elm, d, i) {

                    treeDesigner.selectText(d, true, true);
                    treeDesigner.removeSelectedTexts();
                }
            };
            var menu = [];
            menu.push(deleteMenuItem);
            return menu;
        };

        var _this = _possibleConstructorReturn(this, (TextContextMenu.__proto__ || Object.getPrototypeOf(TextContextMenu)).call(this, menu));

        _this.treeDesigner = treeDesigner;
        return _this;
    }

    return TextContextMenu;
}(_contextMenu.ContextMenu);

},{"../i18n/i18n":75,"./context-menu":65}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.D3Extensions = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require("./d3");

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var D3Extensions = exports.D3Extensions = function () {
    function D3Extensions() {
        _classCallCheck(this, D3Extensions);
    }

    _createClass(D3Extensions, null, [{
        key: "extend",
        value: function extend() {

            d3.selection.prototype.enter.prototype.insertSelector = d3.selection.prototype.insertSelector = function (selector, before) {
                return D3Extensions.insertSelector(this, selector, before);
            };

            d3.selection.prototype.enter.prototype.appendSelector = d3.selection.prototype.appendSelector = function (selector) {
                return D3Extensions.appendSelector(this, selector);
            };

            d3.selection.prototype.enter.prototype.selectOrAppend = d3.selection.prototype.selectOrAppend = function (selector) {
                return D3Extensions.selectOrAppend(this, selector);
            };

            d3.selection.prototype.enter.prototype.selectOrInsert = d3.selection.prototype.selectOrInsert = function (selector, before) {
                return D3Extensions.selectOrInsert(this, selector, before);
            };
        }
    }, {
        key: "insertOrAppendSelector",
        value: function insertOrAppendSelector(parent, selector, operation, before) {

            var selectorParts = selector.split(/([\.\#])/);
            var element = parent[operation](selectorParts.shift(), before); //":first-child"

            while (selectorParts.length > 1) {
                var selectorModifier = selectorParts.shift();
                var selectorItem = selectorParts.shift();
                if (selectorModifier === ".") {
                    element = element.classed(selectorItem, true);
                } else if (selectorModifier === "#") {
                    element = element.attr('id', selectorItem);
                }
            }
            return element;
        }
    }, {
        key: "insertSelector",
        value: function insertSelector(parent, selector, before) {
            return D3Extensions.insertOrAppendSelector(parent, selector, "insert", before);
        }
    }, {
        key: "appendSelector",
        value: function appendSelector(parent, selector) {
            return D3Extensions.insertOrAppendSelector(parent, selector, "append");
        }
    }, {
        key: "selectOrAppend",
        value: function selectOrAppend(parent, selector, element) {
            var selection = parent.select(selector);
            if (selection.empty()) {
                if (element) {
                    return parent.append(element);
                }
                return D3Extensions.appendSelector(parent, selector);
            }
            return selection;
        }
    }, {
        key: "selectOrInsert",
        value: function selectOrInsert(parent, selector, before) {
            var selection = parent.select(selector);
            if (selection.empty()) {
                return D3Extensions.insertSelector(parent, selector, before);
            }
            return selection;
        }
    }]);

    return D3Extensions;
}();

},{"./d3":71}],71:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _d3Dispatch = require('d3-dispatch');

Object.keys(_d3Dispatch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Dispatch[key];
    }
  });
});

var _d3Scale = require('d3-scale');

Object.keys(_d3Scale).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Scale[key];
    }
  });
});

var _d3Selection = require('d3-selection');

Object.keys(_d3Selection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Selection[key];
    }
  });
});

var _d3Shape = require('d3-shape');

Object.keys(_d3Shape).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Shape[key];
    }
  });
});

var _d3Drag = require('d3-drag');

Object.keys(_d3Drag).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Drag[key];
    }
  });
});

var _d3Brush = require('d3-brush');

Object.keys(_d3Brush).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Brush[key];
    }
  });
});

var _d3Array = require('d3-array');

Object.keys(_d3Array).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Array[key];
    }
  });
});

var _d3Hierarchy = require('d3-hierarchy');

Object.keys(_d3Hierarchy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Hierarchy[key];
    }
  });
});

var _d3TimeFormat = require('d3-time-format');

Object.keys(_d3TimeFormat).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3TimeFormat[key];
    }
  });
});

},{"d3-array":"d3-array","d3-brush":"d3-brush","d3-dispatch":"d3-dispatch","d3-drag":"d3-drag","d3-hierarchy":"d3-hierarchy","d3-scale":"d3-scale","d3-selection":"d3-selection","d3-shape":"d3-shape","d3-time-format":"d3-time-format"}],72:[function(require,module,exports){
module.exports={
    "contextMenu":{
        "main":{
            "addDecisionNode": "Entscheidungsknoten hinzufügen",
            "addChanceNode": "Zufall Knoten hinzufügen",
            "addText": "Text hinzufügen ",
            "paste": "Einfügen",
            "selectAllNodes": "Alle Knoten auswählen"
        },
        "node":{
            "copy": "Kopieren",
            "cut": "Ausschneiden",
            "paste": "Einfügen",
            "delete": "Löschen",
            "addDecisionNode": "Entscheidungsknoten hinzufügen",
            "addChanceNode": "Zufall Knoten hinzufügen",
            "addTerminalNode": "Endknotten hinzufügen",
            "convert":{
                "decision": "Als Entscheidungsknoten",
                "chance": "Als Zufall Knoten",
                "terminal": "Als Endknoten"
            },
            "selectSubtree": "Teilbaum wählen",
            "fold": "Teilbaum falten",
            "unfold": "Teilbaum entfalten",
			
            "flipSubtree": "Teilbaum umdrehen"
        },
        "edge":{
            "injectDecisionNode": "Entscheidungsknoten Injizieren",
            "injectChanceNode": "Zufall Knoten Injizieren"
        },
        "text":{
            "delete": "Löschen"
        }
    },
    "validation":{
        "incompletePath": "Pfad, der nicht mit dem Endknoten endet",
        "probabilityDoNotSumUpTo1": "Die Summe der Wahrscheinlichkeiten ist nicht gleich 1",
        "invalidProbability": "Ungültige Wahrscheinlichkeit im Zweig #{{number}}",
        "invalidPayoff": "Ungültige Auszahlung in Zweig #{{number}}"
    },
    "growl":{
        "brushDisabled": "Auswahlbürste deaktiviert",
        "brushEnabled": "Auswahlbürste aktiviert"
    },
    "tooltip":{
        "node":{
            "payoff": {
                "default": "Auszahlung {{number}}",
                "named": "{{name}}"
            },
            "aggregatedPayoff": {
                "default": "Aggregierte Auszahlung {{number}}",
                "named": "Aggregierte {{name}}"
            },
            "probabilityToEnter": "Wahrscheinlichkeit"
        },
        "edge":{
            "payoff": {
                "default": "Auszahlung {{number}}: {{value}}",
                "named": "{{name}}: {{value}}"
            },
            "probability": "Wahrscheinlichkeit: {{value}}"
        }
    }
}

},{}],73:[function(require,module,exports){
module.exports={
    "contextMenu":{
        "main":{
            "addDecisionNode": "Add Decision Node",
            "addChanceNode": "Add Chance Node",
            "addText": "Add Text",
            "paste": "Paste",
            "selectAllNodes": "Select all nodes"
        },
        "node":{
            "copy": "Copy",
            "cut": "Cut",
            "paste": "Paste",
            "delete": "Delete",
            "addDecisionNode": "Add Decision Node",
            "addChanceNode": "Add Chance Node",
            "addTerminalNode": "Add Terminal Node",
            "convert":{
                "decision": "As Decision Node",
                "chance": "As Chance Node",
                "terminal": "As Terminal Node"
            },
            "selectSubtree": "Select subtree",
            "fold": "Fold subtree",
            "unfold": "Unfold subtree",
            "flipSubtree": "Flip subtree"
        },
        "edge":{
            "injectDecisionNode": "Inject Decision Node",
            "injectChanceNode": "Inject Chance Node"
        },
        "text":{
            "delete": "Delete"
        }
    },
    "validation":{
        "incompletePath": "Path not ending with terminal node",
        "probabilityDoNotSumUpTo1": "Probabilities do not sum up to 1",
        "invalidProbability": "Invalid probability in edge #{{number}}",
        "invalidPayoff": "Invalid payoff in edge #{{number}}"
    },
    "growl":{
        "brushDisabled": "Selection brush disabled",
        "brushEnabled": "Selection brush enabled"
    },
    "tooltip":{
        "node":{
            "payoff": {
                "default": "Payoff {{number}}",
                "named": "{{name}}"
            },
            "aggregatedPayoff": {
                "default": "Aggregated Payoff {{number}}",
                "named": "Aggregated {{name}}"
            },
            "probabilityToEnter": "Probability to enter"
        },
        "edge":{
            "payoff": {
                "default": "Payoff {{number}}: {{value}}",
                "named": "{{name}}: {{value}}"
            },
            "probability": "Probability: {{value}}"
        }
    }
}

},{}],74:[function(require,module,exports){
module.exports={
    "contextMenu":{
        "main":{
            "addDecisionNode": "Ajouter noud de décision",
            "addChanceNode": "Ajouter noud aléatoire",
            "addText": "Ajouter du texte",
            "paste": "Coller",
            "selectAllNodes": "Sélectionner tous les nouds"
        },
        "node":{
            "copy": "Copie",
            "cut": "Couper",
            "paste": "Coller",
            "delete": "Effacer",
            "addDecisionNode": "Ajouter noud de décision",
            "addChanceNode": "Ajouter noud aléatoire",
            "addTerminalNode": "Ajouter un noeud terminal",
            "convert":{
                "decision": "Comme noud de décision",
                "chance": "Comme noud aléatoire",
                "terminal": "Comme un noeud terminal"
            },
            "selectSubtree": "Sélectionner une sous-arborescence",
            "fold": "Plier sous-arbre",
            "unfold": "Déplier arbre sous-arbre",
            "flipSubtree": "Basculer sous-arbre"
        },
        "edge":{
            "injectDecisionNode": "Injecter un noeud de décision",
            "injectChanceNode": "Injecter un noeud de chance"
        },
        "text":{
            "delete": "Effacer"
        }
    },
    "validation":{
        "incompletePath": "Parcours non terminé par noeud terminal",
        "probabilityDoNotSumUpTo1": "La somme des probabilités n'est pas 1 ou plus",
        "invalidProbability": "Probabilité invalide - le bord #{{number}}",
        "invalidPayoff": "Avantage invalide - le bord #{{number}}"
    },
    "growl":{
        "brushDisabled": "Brosse de sélection désactivée",
        "brushEnabled": "Brosse de sélection activée"
    },
    "tooltip":{
        "node":{
            "payoff": {
                "default": "Avantage {{number}}",
                "named": "{{name}}"
            },
            "aggregatedPayoff": {
                "default": "Avantage agrégé {{number}}",
                "named": "Agrégé  {{name}}"
            },
            "probabilityToEnter": "Probabilité d'entrée"
        },
        "edge":{
            "payoff": {
                "default": "Avantage {{number}}: {{value}}",
                "named": "{{name}}: {{value}}"
            },
            "probability": "Probabilité: {{value}}"
        }
    }
}

},{}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.i18n = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18next = require('i18next');

var _i18next2 = _interopRequireDefault(_i18next);

var _en = require('./en.json');

var en = _interopRequireWildcard(_en);

var _pl = require('./pl.json');

var pl = _interopRequireWildcard(_pl);

var _it = require('./it.json');

var it = _interopRequireWildcard(_it);

var _de = require('./de.json');

var de = _interopRequireWildcard(_de);

var _fr = require('./fr.json');

var fr = _interopRequireWildcard(_fr);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var i18n = exports.i18n = function () {
    function i18n() {
        _classCallCheck(this, i18n);
    }

    _createClass(i18n, null, [{
        key: 'init',
        value: function init(lng) {
            i18n.language = lng;
            var resources = {
                en: {
                    translation: en
                },
                pl: {
                    translation: pl
                },
                it: {
                    translation: it
                },
                de: {
                    translation: de
                },
                fr: {
                    translation: fr
                }
            };
            i18n.$instance = _i18next2.default.createInstance({
                lng: lng,
                fallbackLng: 'en',
                resources: resources
            }, function (err, t) {});
        }
    }, {
        key: 't',
        value: function t(key, opt) {
            return i18n.$instance.t(key, opt);
        }
    }]);

    return i18n;
}();

},{"./de.json":72,"./en.json":73,"./fr.json":74,"./it.json":76,"./pl.json":77,"i18next":"i18next"}],76:[function(require,module,exports){
module.exports={
    "contextMenu":{
        "main":{
            "addDecisionNode": "Aggiungi un nodo di decisione",
            "addChanceNode": "Aggiungi un nodo opportunità",
            "addText": "Aggiungi testo",
            "paste": "Incolla",
            "selectAllNodes": "Seleziona tutti i nodi"
        },
        "node":{
            "copy": "Copia",
            "cut": "Taglia",
            "paste": "Incolla",
            "delete": "Cancella",
            "addDecisionNode": "Aggiungi un nodo di decisione",
            "addChanceNode": "Aggiungi un nodo opportunità",
            "addTerminalNode": "Aggiungi un nodo terminale",
            "convert":{
                "decision": "Come Decision Node",
                "chance": "Come Chance Node",
                "terminal": "Come Terminal Node"
            },
            "selectSubtree": "Seleziona Sotto-albero",
            "fold": "Piega sotto-albero",
            "unfold": "Dispiegarsi sotto-albero",			
            "flipSubtree": "Ribalta sotto-albero"
        },
        "edge":{
            "injectDecisionNode": "Inietta nodo di decisione",
            "injectChanceNode": "Inietta nodo opportunità"
        },
        "text":{
            "delete": "Cancella"
        }
    },
    "validation":{
        "incompletePath": "Percorso senza nodo terminale",
        "probabilityDoNotSumUpTo1": "La somma delle probabilità è diversa da 1",
        "invalidProbability": "Probabilità non valida - bordo #{{number}}",
        "invalidPayoff": "Saldo non valido - bordo #{{number}}"
    },
    "growl":{
        "brushDisabled": "Selezione pennello disabilitata",
        "brushEnabled": "Selezione pennello abilitata"
    },
    "tooltip":{
        "node":{
            "payoff": {
                "default": "Saldo {{number}}",
                "named": "{{name}}"
            },
            "aggregatedPayoff": {
                "default": "Saldo aggregato {{number}}",
                "named": "Aggregato {{name}}"
            },
            "probabilityToEnter": "Probabilità da inserire"
        },
        "edge":{
            "payoff": {
                "default": "Saldo {{number}}: {{value}}",
                "named": "{{name}}: {{value}}"
            },
            "probability": "Probabilità: {{value}}"
        }
    }
}

},{}],77:[function(require,module,exports){
module.exports={

    "contextMenu":{
        "main":{
            "addDecisionNode": "Dodaj Węzeł Decyzyjny",
            "addChanceNode": "Dodaj Węzeł Losowy",
            "addText": "Dodaj Tekst",
            "paste": "Wklej",
            "selectAllNodes": "Zaznacz wszystkie węzły"
        },
        "node":{
            "copy": "Kopiuj",
            "cut": "Wytnij",
            "paste": "Wklej",
            "delete": "Usuń",
            "addDecisionNode": "Dodaj Węzeł Decyzyjny",
            "addChanceNode": "Dodaj Węzeł Losowy",
            "addTerminalNode": "Dodaj Węzeł Końcowy",
            "convert":{
                "decision": "Jako Węzeł Decyzyjny",
                "chance": "Jako Węzeł Losowy",
                "terminal": "Jako Węzeł Końcowy"
            },
            "selectSubtree": "Zaznacz poddrzewo",
            "fold": "Zwiń poddrzewo",
            "unfold": "Rozwiń poddrzewo",
            "flipSubtree": "Przewróć poddrzewo"
        },
        "edge":{
            "injectDecisionNode": "Wstrzyknij Węzeł Decyzyjny",
            "injectChanceNode": "Wstrzyknij Węzeł Losowy"
        },
        "text":{
            "delete": "Usuń"
        }
    },

    "validation":{
        "incompletePath": "Ostatnim węzłem w ścieżce powinien być Węzeł Końcowy",
        "probabilityDoNotSumUpTo1": "Prawdopodobieństwa nie sumują sie do 1",
        "invalidProbability": "Niepoprawne prawdopodobieństwo na krawędzi #{{number}}",
        "invalidPayoff": "Niepoprawna wypłata na krawędzi #{{number}}"
    },
    "growl":{
        "brushDisabled": "Zaznaczanie wyłączone",
        "brushEnabled": "Zaznaczanie włączone"
    },
    "tooltip":{
        "node":{
            "payoff": {
                "default": "Wypłata {{number}}",
                "named": "{{name}}"
            },
            "aggregatedPayoff": {
                "default": "Zagregowana wypłata {{number}}",
                "named": "Zagregowana {{name}}"
            },
            "probabilityToEnter": "Prawdopodobieństwo wejścia"
        },
        "edge":{
            "payoff": {
                "default": "Wypłata {{number}}: {{value}}",
                "named": "{{name}}: {{value}}"
            },
            "probability": "Prawdopodobieństwo: {{value}}"
        }
    }
}

},{}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.d3 = undefined;

var _treeDesigner = require('./tree-designer');

Object.keys(_treeDesigner).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _treeDesigner[key];
    }
  });
});

var _appUtils = require('./app-utils');

Object.keys(_appUtils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _appUtils[key];
    }
  });
});

var _templates = require('./templates');

Object.keys(_templates).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _templates[key];
    }
  });
});

var _tooltip = require('./tooltip');

Object.keys(_tooltip).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _tooltip[key];
    }
  });
});

var _d3Extensions = require('./d3-extensions');

Object.keys(_d3Extensions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Extensions[key];
    }
  });
});

var _d = require('./d3');

Object.defineProperty(exports, 'd3', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_d).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_d3Extensions.D3Extensions.extend();

},{"./app-utils":64,"./d3":71,"./d3-extensions":70,"./templates":83,"./tooltip":86,"./tree-designer":87}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Layout = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdUtils = require('sd-utils');

var _sdModel = require('sd-model');

var _d = require('./d3');

var d3 = _interopRequireWildcard(_d);

var _circle = require('./symbols/circle');

var _circle2 = _interopRequireDefault(_circle);

var _triangle = require('./symbols/triangle');

var _triangle2 = _interopRequireDefault(_triangle);

var _appUtils = require('./app-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*Tree layout manager*/
var Layout = exports.Layout = function () {
    function Layout(treeDesigner, data, config) {
        _classCallCheck(this, Layout);

        this.nodeTypeToSymbol = {
            'decision': d3.symbolSquare,
            'chance': _circle2.default,
            "terminal": _triangle2.default
        };
        this.onAutoLayoutChanged = [];
        this.nodeTypeOrder = {
            'decision': 0,
            'chance': 0,
            'terminal': 1
        };
        this.treeMargin = 50;
        this.targetSymbolSize = {};

        this.nodeSeparation = function (a, b) {
            return a.parent === b.parent ? 1 : 1.2;
        };

        this.nodeSymbolSize = {};

        this.treeDesigner = treeDesigner;
        this.data = data;
        this.config = config;
    }

    _createClass(Layout, [{
        key: 'update',
        value: function update(node) {
            if (node && node.$parent) {
                node.$parent.childEdges.sort(function (a, b) {
                    return a.childNode.location.y - b.childNode.location.y;
                });
            }
            if (!this.isManualLayout()) {
                return this.autoLayout(this.config.type, true);
            }
            if (node) {
                this.moveNodeToEmptyPlace(node);
            } else {
                this.treeDesigner.redraw(true);
            }
        }
    }, {
        key: 'isManualLayout',
        value: function isManualLayout() {
            return this.config.type === Layout.MANUAL_LAYOUT_NAME;
        }
    }, {
        key: 'getNewChildLocation',
        value: function getNewChildLocation(parent) {
            if (!parent) {
                return new _sdModel.domain.Point(this.getNodeMinX(), this.getNodeMinY());
            }
            var x = parent.location.x + this.config.gridWidth;
            var y = parent.location.y;
            if (parent.childEdges.length) {
                y = parent.childEdges[parent.childEdges.length - 1].childNode.location.y + 1;
            }

            return new _sdModel.domain.Point(x, y);
        }
    }, {
        key: 'getInjectedNodeLocation',
        value: function getInjectedNodeLocation(edge) {

            var p = edge.$linePoints[2];

            return new _sdModel.domain.Point(p[0], p[1]);
        }
    }, {
        key: 'moveNodeToEmptyPlace',
        value: function moveNodeToEmptyPlace(node) {
            var redrawIfChanged = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var positionMap = {};
            var self = this;
            node.location.x = Math.max(this.getNodeMinX(node), node.location.x);
            node.location.y = Math.max(this.getNodeMinY(node), node.location.y);

            this.nodesSortedByX = this.data.nodes.slice();
            this.nodesSortedByX.sort(function (a, b) {
                return a.location.x - b.location.x;
            });

            function findCollidingNode(node, location) {
                return _sdUtils.Utils.find(self.nodesSortedByX, function (n) {
                    if (node == n) {
                        return false;
                    }

                    var margin = self.config.nodeSize / 3;
                    var x = n.location.x;
                    var y = n.location.y;

                    return location.x - margin <= x && location.x + margin >= x && location.y - margin <= y && location.y + margin >= y;
                });
            }

            var stepX = this.config.nodeSize / 2;
            var stepY = this.config.nodeSize + 10;
            var stepXsameParent = 0;
            var stepYsameParent = 75;
            var changed = false;
            var colidingNode;
            var newLocation = new _sdModel.domain.Point(node.location);
            while (colidingNode = findCollidingNode(node, newLocation)) {
                changed = true;
                var sameParent = node.$parent && colidingNode.$parent && node.$parent === colidingNode.$parent;
                if (sameParent) {
                    newLocation.move(stepXsameParent, stepYsameParent);
                } else {
                    newLocation.move(stepX, stepY);
                }
            }
            if (changed) {
                node.moveTo(newLocation.x, newLocation.y, true);
                if (redrawIfChanged) {
                    this.treeDesigner.redraw(true);
                }
            }
        }
    }, {
        key: 'disableAutoLayout',
        value: function disableAutoLayout() {
            this.config.type = Layout.MANUAL_LAYOUT_NAME;
            this._fireOnAutoLayoutChangedCallbacks();
        }
    }, {
        key: 'drawNodeSymbol',
        value: function drawNodeSymbol(path, transition) {

            var self = this;
            var nodeSize = this.config.nodeSize;
            this.nodeSymbol = d3.symbol().type(function (d) {
                return self.nodeTypeToSymbol[d.type];
            }).size(function (d) {
                return self.nodeSymbolSize[d.$id] ? _sdUtils.Utils.get(self.targetSymbolSize, d.type + "['" + self.config.nodeSize + "']", 64) : 64;
            });

            path.each(function (d) {
                var path = d3.select(this);
                var prev = path.attr("d");
                if (!prev) {
                    path.attr("d", self.nodeSymbol);
                }
                var size = _sdUtils.Utils.get(self.targetSymbolSize, d.type + "['" + self.config.nodeSize + "']");
                if (!size) {
                    var box = path.node().getBBox();
                    var error = Math.min(nodeSize / box.width, nodeSize / box.height);
                    size = error * error * (self.nodeSymbolSize[d.$id] || 64);
                    _sdUtils.Utils.set(self.targetSymbolSize, d.type + "['" + self.config.nodeSize + "']", size);
                }
                if (transition) {
                    path = path.transition();
                } else {
                    self.nodeSymbolSize[d.$id] = size;
                }
                path.attr("d", self.nodeSymbol);
                if (transition) {
                    self.nodeSymbolSize[d.$id] = size;
                }
            });
        }
    }, {
        key: 'nodeLabelPosition',
        value: function nodeLabelPosition(selection) {
            return selection.attr('x', 0).attr('y', -this.config.nodeSize / 2 - 7);
        }
    }, {
        key: 'nodePayoffPosition',
        value: function nodePayoffPosition(selection) {
            return Layout.setHangingPosition(selection).attr('x', 0).attr('y', this.config.nodeSize / 2 + 7).attr('text-anchor', 'middle');
        }
    }, {
        key: 'nodeAggregatedPayoffPosition',
        value: function nodeAggregatedPayoffPosition(selection) {
            var x = this.config.nodeSize / 2 + 7;
            var self = this;
            selection.attr('x', x).attr('y', function (d) {
                var fontSize = parseInt(_appUtils.AppUtils.getFontSize(this));
                var items = d.displayValue('aggregatedPayoff');
                var number = _sdUtils.Utils.isArray(items) ? items.filter(function (it) {
                    return it !== undefined;
                }).length : 1;
                if (number > 1) {
                    return -this.getBBox().height / 2 + fontSize / 2;
                }
                return -Math.max(2, 1.8 * self.config.nodeSize / fontSize);
            });

            selection.selectAll('tspan').attr('x', x);
            return selection;
            // .attr('text-anchor', 'middle')
            // .attr('dominant-baseline', 'hanging')
        }
    }, {
        key: 'nodeProbabilityToEnterPosition',
        value: function nodeProbabilityToEnterPosition(selection) {
            var self = this;

            return Layout.setHangingPosition(selection).attr('x', this.config.nodeSize / 2 + 7).attr('y', function (d) {
                var fontSize = parseInt(_appUtils.AppUtils.getFontSize(this));
                var aggregatedPayoffs = d.displayValue('aggregatedPayoff');
                var aggregatedPayoffsNumber = _sdUtils.Utils.isArray(aggregatedPayoffs) ? aggregatedPayoffs.filter(function (it) {
                    return it !== undefined;
                }).length : 1;
                if (aggregatedPayoffsNumber > 1) {

                    return fontSize * 0.6;
                }

                return Math.max(2, 1.8 * self.config.nodeSize / fontSize);
            });
            // .attr('text-anchor', 'middle')
            // .attr('dominant-baseline', 'central')
        }
    }, {
        key: 'nodeIndicatorPosition',
        value: function nodeIndicatorPosition(selection) {
            return selection.attr('x', this.config.nodeSize / 2 + 8).attr('y', -this.config.nodeSize / 2).attr('dominant-baseline', 'central').attr('text-anchor', 'middle');
        }
    }, {
        key: 'nodeUnfoldButtonPosition',
        value: function nodeUnfoldButtonPosition(selection) {

            return selection.attr('x', this.config.nodeSize / 2 + 5).attr('y', 0).attr('dominant-baseline', 'central');
        }
    }, {
        key: 'edgeLineD',
        value: function edgeLineD(edge) {
            var line = d3.line().x(function (d) {
                return d[0];
            }).y(function (d) {
                return d[1];
            });
            // .curve(d3.curveCatmullRom.alpha(0.5));


            var parentNode = edge.parentNode;
            var childNode = edge.childNode;

            var dX = childNode.location.x - parentNode.location.x;
            var dY = childNode.location.y - parentNode.location.y;

            var sign = dX >= 0 ? 1 : -1;

            var slantStartXOffset = Math.min(dX / 2, this.config.nodeSize / 2 + 10);
            var slantWidth = Math.min(this.config.edgeSlantWidthMax, Math.max(dX / 2 - slantStartXOffset, 0));

            var point1 = [parentNode.location.x + this.config.nodeSize / 2 + 1, parentNode.location.y];
            var point2 = [Math.max(parentNode.location.x + slantStartXOffset, point1[0]), parentNode.location.y];
            var point3 = [parentNode.location.x + slantStartXOffset + slantWidth, childNode.location.y];
            var point4 = [childNode.location.x - sign * Math.max(0, Math.min(this.config.nodeSize / 2 + 8, dX / 2)), childNode.location.y];
            // var point2 = [parentNode.location.x+dX/2-slantWidth/2, parentNode.location.y];
            // var point3 = [childNode.location.x-(dX/2-slantWidth/2), childNode.location.y];

            edge.$linePoints = [point1, point2, point3, point4];
            return line(edge.$linePoints);
        }
    }, {
        key: 'edgePayoffPosition',
        value: function edgePayoffPosition(selection) {
            Layout.setHangingPosition(selection).attr('x', function (d) {
                return d.$linePoints[2][0] + 2;
            }).attr('y', function (d) {
                return d.$linePoints[2][1] + 7;
            });

            selection.selectAll('tspan').attr('x', function (d) {
                return d3.select(this.parentNode).datum().$linePoints[2][0] + 2;
            });
            return selection;
        }
    }, {
        key: 'edgeLabelPosition',
        value: function edgeLabelPosition(selection) {
            return selection.attr('transform', function (d) {
                return 'translate(' + (d.$linePoints[2][0] + 2) + ',' + (d.$linePoints[2][1] - 7) + ')';
            });
            // .attr('x', d=>d.$linePoints[2][0] + 2)
            // .attr('y', d=>d.$linePoints[2][1] - 7)
        }
    }, {
        key: 'edgeProbabilityPosition',
        value: function edgeProbabilityPosition(selection) {
            return Layout.setHangingPosition(selection).attr('x', function (d) {
                var len = this.getComputedTextLength();
                var min = d.$linePoints[2][0] + 2 + this.previousSibling.childNodes[0].getComputedTextLength() + 7 + len;
                return Math.max(min, d.$linePoints[3][0] - 8);
            }).attr('y', function (d) {
                return d.$linePoints[2][1] + 7;
            });
        }
    }, {
        key: 'getMinMarginBetweenNodes',
        value: function getMinMarginBetweenNodes() {
            return this.config.nodeSize + 30;
        }
    }, {
        key: 'getNodeMinX',
        value: function getNodeMinX(d) {
            var self = this;
            if (d && d.$parent) {
                // && !self.isNodeSelected(d.$parent)
                return d.$parent.location.x + self.getMinMarginBetweenNodes();
            }
            return self.config.nodeSize / 2;
        }
    }, {
        key: 'getNodeMinY',
        value: function getNodeMinY(d) {
            return this.config.nodeSize / 2;
        }
    }, {
        key: 'getNodeMaxX',
        value: function getNodeMaxX(d) {
            var self = this;

            if (d && d.childEdges.length) {
                return d3.min(d.childEdges, function (e) {
                    return !e.childNode.$hidden ? e.childNode.location.x : 9999999;
                }) - self.getMinMarginBetweenNodes();
            }
            return 9999999;
        }
    }, {
        key: 'setGridWidth',
        value: function setGridWidth(width, withoutStateSaving) {
            var self = this;
            if (this.config.gridWidth === width) {
                return;
            }
            if (!withoutStateSaving) {
                this.data.saveState({
                    data: {
                        gridWidth: self.config.gridWidth
                    },
                    onUndo: function onUndo(data) {
                        self.setGridWidth(data.gridWidth, true);
                    },
                    onRedo: function onRedo(data) {
                        self.setGridWidth(width, true);
                    }
                });
            }

            this.config.gridWidth = width;
            this.update();
        }
    }, {
        key: 'setGridHeight',
        value: function setGridHeight(gridHeight, withoutStateSaving) {
            var self = this;
            if (this.config.gridHeight === gridHeight) {
                return;
            }
            if (!withoutStateSaving) {
                this.data.saveState({
                    data: {
                        gridHeight: self.config.gridHeight
                    },
                    onUndo: function onUndo(data) {
                        self.setGridHeight(data.gridHeight, true);
                    },
                    onRedo: function onRedo(data) {
                        self.setGridHeight(gridHeight, true);
                    }
                });
            }

            this.config.gridHeight = gridHeight;
            this.update();
        }
    }, {
        key: 'setNodeSize',
        value: function setNodeSize(nodeSize, withoutStateSaving) {
            var self = this;
            if (this.config.nodeSize === nodeSize) {
                return;
            }
            if (!withoutStateSaving) {
                this.data.saveState({
                    data: {
                        nodeSize: self.config.nodeSize
                    },
                    onUndo: function onUndo(data) {
                        self.setNodeSize(data.nodeSize, true);
                    },
                    onRedo: function onRedo(data) {
                        self.setNodeSize(nodeSize, true);
                    }
                });
            }

            this.config.nodeSize = nodeSize;
            this.update();
            if (this.isManualLayout()) {
                this.fitNodesInPlottingRegion(self.data.getRoots());
                this.treeDesigner.redraw(true);
            }
        }
    }, {
        key: 'setEdgeSlantWidthMax',
        value: function setEdgeSlantWidthMax(width, withoutStateSaving) {
            var self = this;
            if (this.config.edgeSlantWidthMax === width) {
                return;
            }
            if (!withoutStateSaving) {
                this.data.saveState({
                    data: {
                        edgeSlantWidthMax: self.config.edgeSlantWidthMax
                    },
                    onUndo: function onUndo(data) {
                        self.setEdgeSlantWidthMax(data.edgeSlantWidthMax, true);
                    },
                    onRedo: function onRedo(data) {
                        self.setEdgeSlantWidthMax(width, true);
                    }
                });
            }

            this.config.edgeSlantWidthMax = width;
            this.treeDesigner.redraw(true);
        }
    }, {
        key: 'autoLayout',
        value: function autoLayout(type, withoutStateSaving) {
            var self = this;

            if (!withoutStateSaving) {
                this.data.saveState({
                    data: {
                        newLayout: type,
                        currentLayout: self.config.type
                    },
                    onUndo: function onUndo(data) {
                        self.config.type = data.currentLayout;
                        self._fireOnAutoLayoutChangedCallbacks();
                    },
                    onRedo: function onRedo(data) {
                        self.autoLayout(data.newLayout, true);
                    }
                });
            }
            this.config.type = type;
            if (!this.data.nodes.length) {
                this._fireOnAutoLayoutChangedCallbacks();
                return;
            }

            var prevTreeMaxY = self.getNodeMinY();
            this.data.getRoots().forEach(function (r) {
                var root = d3.hierarchy(r, function (d) {
                    return d.childEdges.filter(function (e) {
                        return !e.$hidden;
                    }).map(function (e) {
                        return e.childNode;
                    });
                });

                // root.sort((a,b)=>self.nodeTypeOrder[a.data.type]-self.nodeTypeOrder[b.data.type]);
                root.sort(function (a, b) {
                    return a.data.location.y - b.data.location.y;
                });

                var layout;
                if (type === 'cluster') {
                    layout = d3.cluster();
                } else {
                    layout = d3.tree();
                }
                layout.nodeSize([self.config.gridHeight, self.config.gridWidth]);
                layout.separation(self.nodeSeparation);

                layout(root);
                var minY = 999999999;
                root.each(function (d) {
                    minY = Math.min(minY, d.x);
                });

                var dy = root.x - minY + prevTreeMaxY;
                var dx = self.getNodeMinX();
                var maxY = 0;
                root.each(function (d) {
                    d.data.location.x = d.y + dx;
                    d.data.location.y = d.x + dy;

                    maxY = Math.max(maxY, d.data.location.y);
                });

                prevTreeMaxY = maxY + self.config.nodeSize + self.treeMargin;
            });

            // this.transition = true;
            this.treeDesigner.redraw(true);
            // this.transition = false;

            this._fireOnAutoLayoutChangedCallbacks();
            return this;
        }
    }, {
        key: 'fitNodesInPlottingRegion',
        value: function fitNodesInPlottingRegion(nodes) {
            var self = this;
            var topY = d3.min(nodes, function (n) {
                return n.location.y;
            });
            var minY = self.getNodeMinY();
            var dy = topY - minY;

            var minX = d3.min(nodes, function (n) {
                return n.location.x;
            });
            var dx = minX - self.getNodeMinX();

            if (dy < 0 || dx < 0) {
                nodes.forEach(function (n) {
                    return n.move(-dx, -dy);
                });
            }
        }
    }, {
        key: 'moveNodes',
        value: function moveNodes(nodes, dx, dy, pivot) {
            var self = this;
            var limit = self.config.limitNodePositioning;
            if (limit) {
                if (dx < 0) {
                    nodes.sort(function (a, b) {
                        return a.location.x - b.location.x;
                    });
                } else {
                    nodes.sort(function (a, b) {
                        return b.location.x - a.location.x;
                    });
                }
            }

            var minY = d3.min(nodes, function (d) {
                return d.location.y;
            });
            if (minY + dy < self.getNodeMinY()) {
                dy = self.getNodeMinY() - minY;
            }

            nodes.forEach(function (d) {
                if (limit) {
                    Layout.backupNodeLocation(d);
                    var minX = self.getNodeMinX(d);
                    var maxX = self.getNodeMaxX(d);

                    d.location.x = Math.min(Math.max(d.location.x + dx, minX), maxX);
                    d.location.y += dy;
                } else {
                    d.location.x += dx;
                    d.location.y += dy;
                }
            });

            var revertX = pivot && self.config.limitNodePositioning && pivot.location.x === pivot.$location.x;

            nodes.forEach(function (d) {
                if (revertX) {
                    d.location.x = d.$location.x;
                }
                self.treeDesigner.updateNodePosition(d);
            });
        }
    }, {
        key: '_fireOnAutoLayoutChangedCallbacks',
        value: function _fireOnAutoLayoutChangedCallbacks() {
            var _this = this;

            this.onAutoLayoutChanged.forEach(function (c) {
                return c(_this.config.type);
            });
        }
    }], [{
        key: 'backupNodeLocation',
        value: function backupNodeLocation(node) {
            node.$location = new _sdModel.domain.Point(node.location);
        }
    }, {
        key: 'setHangingPosition',
        value: function setHangingPosition(selection) {
            // window.setTimeout(function(){
            //     selection.each(function(){
            //         var h =  this.getBBox().height;
            //         d3.select(this).attr('dy', h);
            //     });
            // },0);

            if (_appUtils.AppUtils.isHidden(selection.node())) {
                // setting hanging position of hidden elements fails on firefox
                return selection;
            }

            selection.each(function () {
                var h = this.getBBox().height;
                d3.select(this).attr('dy', '0.75em');
            });

            return selection;
        }
    }]);

    return Layout;
}();

Layout.MANUAL_LAYOUT_NAME = 'manual';

},{"./app-utils":64,"./d3":71,"./symbols/circle":81,"./symbols/triangle":82,"sd-model":"sd-model","sd-utils":"sd-utils"}],80:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NodeDragHandler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _appUtils = require('./app-utils');

var _d = require('./d3');

var d3 = _interopRequireWildcard(_d);

var _contextMenu = require('./context-menu/context-menu');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NodeDragHandler = exports.NodeDragHandler = function () {
    function NodeDragHandler(treeDesigner, data) {
        _classCallCheck(this, NodeDragHandler);

        this.treeDesigner = treeDesigner;
        this.data = data;

        var self = this;
        this.drag = d3.drag().subject(function (d) {
            if (d == null) {
                return {
                    x: event.x,
                    y: event.y
                };
            }
            var t = d3.select(this);
            return {
                x: t.attr("x") + _appUtils.AppUtils.getTranslation(t.attr("transform"))[0],
                y: t.attr("y") + _appUtils.AppUtils.getTranslation(t.attr("transform"))[1]
            };
        }).on("start", function (d) {
            self.dragStarted.call(this, d, self);
        }).on("drag", function (d) {
            self.onDrag.call(this, d, self);
        }).on("end", function (d) {
            self.dragEnded.call(this, d, self);
        });
    }

    _createClass(NodeDragHandler, [{
        key: 'dragStarted',
        value: function dragStarted(d, self) {
            if (self.ignoreDrag) {
                self.ignoreDrag = false;
                self.ignoredDrag = true;
                return;
            }
            self.ignoredDrag = false;

            // self.treeDesigner.layout.disableAutoLayout();
            _contextMenu.ContextMenu.hide();
            var node = d3.select(this);
            if (!node.classed("selected")) {
                self.treeDesigner.clearSelection();
            }

            self.treeDesigner.selectNode(d);
            node.classed("selected dragging", true);
            self.selectedNodes = self.treeDesigner.getSelectedNodes(true);
            self.prevDragEvent = d3.event;
            self.dragEventCount = 0;
        }
    }, {
        key: 'onDrag',
        value: function onDrag(draggedNode, self) {
            if (self.ignoredDrag) {
                return;
            }

            if (self.dragEventCount == 2) {
                self.data.saveState();
            }
            self.dragEventCount++;
            if (self.selectedNodes.length > 5 && self.dragEventCount % 2 != 1) {
                return;
            }

            var dx = d3.event.x - self.prevDragEvent.x;
            var dy = d3.event.y - self.prevDragEvent.y;
            self.treeDesigner.layout.moveNodes(self.selectedNodes, dx, dy, draggedNode);

            self.prevDragEvent = d3.event;
            self.treeDesigner.redrawEdges();
            self.treeDesigner.updatePlottingRegionSize();
        }
    }, {
        key: 'dragEnded',
        value: function dragEnded(draggedNode, self) {
            var node = d3.select(this).classed("dragging", false);
            if (self.ignoredDrag) {
                return;
            }
            self.treeDesigner.layout.update(draggedNode);
        }
    }, {
        key: 'cancelDrag',
        value: function cancelDrag() {
            this.ignoreDrag = true;
        }
    }]);

    return NodeDragHandler;
}();

},{"./app-utils":64,"./context-menu/context-menu":65,"./d3":71}],81:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var epsilon = 1e-12;
var pi = Math.PI;
var halfPi = pi / 2;
var tau = 2 * pi;

exports.default = {
    /*draw: function(context, size) {
        var r = Math.sqrt(size / pi);
        context.moveTo(r, 0);
        context.arc(0, 0, r, 0, tau);
    }*/
    draw: function draw(context, size) {

        var r = Math.sqrt(size / pi);
        var dist = 0.552284749831 * r;

        context.moveTo(-r, 0);
        // context.lineTo(2*r, 2*r)
        // context.bezierCurveTo(-r, -dist, -dist, -r, 0,-r);
        context.bezierCurveTo(-r, -dist, -dist, -r, 0, -r);

        context.bezierCurveTo(dist, -r, r, -dist, r, 0);

        context.bezierCurveTo(r, dist, dist, r, 0, r);

        context.bezierCurveTo(-dist, r, -r, dist, -r, 0);
    }
};

},{}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var sqrt3 = Math.sqrt(3);

exports.default = {
    draw: function draw(context, size) {
        var r = Math.sqrt(size / Math.PI);
        context.moveTo(-r, 0);
        context.lineTo(0.9 * r, -r);
        context.lineTo(0.9 * r, r);
        context.closePath();
    }
};

},{}],83:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Templates = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdUtils = require('sd-utils');

var _i18n = require('./i18n/i18n');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Templates = exports.Templates = function () {
    function Templates() {
        _classCallCheck(this, Templates);
    }

    _createClass(Templates, null, [{
        key: 'get',
        value: function get(templateName, variables) {
            var compiled = _sdUtils.Utils.template(Templates[templateName], { 'imports': { 'i18n': _i18n.i18n, 'Templates': Templates, 'include': function include(n, v) {
                        return Templates.get(n, v);
                    } } });
            if (variables) {
                variables.variables = variables;
            } else {
                variables = { variables: {} };
            }
            return compiled(variables);
        }
    }, {
        key: 'styleRule',
        value: function styleRule(selector, props) {
            var s = selector + '{';
            props.forEach(function (p) {
                return s += Templates.styleProp(p[0], p[1]);
            });
            s += '} ';
            return s;
        }
    }, {
        key: 'styleProp',
        value: function styleProp(styleName, variableName) {
            return styleName + ': <%= ' + variableName + ' %>; ';
        }
    }, {
        key: 'nodeSelector',
        value: function nodeSelector(type, clazz) {
            var s = Templates.treeDesignerSelector + ' .node';
            if (type) {
                s += '.' + type + '-node';
            }
            if (clazz) {
                s += '.' + clazz;
            }
            return s;
        }
    }, {
        key: 'edgeSelector',
        value: function edgeSelector(clazz) {
            var s = Templates.treeDesignerSelector + ' .edge';
            if (clazz) {
                s += '.' + clazz;
            }
            return s;
        }
    }]);

    return Templates;
}();

Templates.growl = require('./templates/growl_message.html');
Templates.treeDesignerSelector = 'svg.sd-tree-designer';
Templates.treeDesignerStyles = Templates.styleRule(Templates.treeDesignerSelector, [['font-size', 'fontSize'], ['font-family', 'fontFamily'], ['font-weight', 'fontWeight'], ['font-style', 'fontStyle']]) +
//   node
Templates.styleRule(Templates.nodeSelector() + ' path', [['fill', 'node.fill'], ['stroke-width', 'node.strokeWidth']]) + Templates.styleRule(Templates.nodeSelector('decision', 'optimal') + ' path, ' + Templates.nodeSelector('chance', 'optimal') + ' path,' + Templates.nodeSelector('terminal', 'optimal') + ' path', [['stroke', 'node.optimal.stroke'], ['stroke-width', 'node.optimal.strokeWidth']]) + Templates.styleRule(Templates.nodeSelector() + ' .label', [['font-size', 'node.label.fontSize'], ['fill', 'node.label.color']]) + Templates.styleRule(Templates.nodeSelector() + ' .payoff', [['font-size', 'node.payoff.fontSize'], ['fill', 'node.payoff.color']]) + Templates.styleRule(Templates.nodeSelector() + ' .payoff.negative', [['fill', 'node.payoff.negativeColor']]) +

//    decision node
Templates.styleRule(Templates.nodeSelector('decision') + ' path', [['fill', 'node.decision.fill'], ['stroke', 'node.decision.stroke']]) + Templates.styleRule(Templates.nodeSelector('decision', 'selected') + ' path', [['fill', 'node.decision.selected.fill']]) +

//    chance node
Templates.styleRule(Templates.nodeSelector('chance') + ' path', [['fill', 'node.chance.fill'], ['stroke', 'node.chance.stroke']]) + Templates.styleRule(Templates.nodeSelector('chance', 'selected') + ' path', [['fill', 'node.chance.selected.fill']]) +

//    terminal node
Templates.styleRule(Templates.nodeSelector('terminal') + ' path', [['fill', 'node.terminal.fill'], ['stroke', 'node.terminal.stroke']]) + Templates.styleRule(Templates.nodeSelector('terminal', 'selected') + ' path', [['fill', 'node.terminal.selected.fill']]) + Templates.styleRule(Templates.nodeSelector('terminal') + ' .aggregated-payoff', [['font-size', 'node.terminal.payoff.fontSize'], ['fill', 'node.terminal.payoff.color']]) + Templates.styleRule(Templates.nodeSelector('terminal') + ' .aggregated-payoff.negative', [['fill', 'node.terminal.payoff.negativeColor']]) +

//probability
Templates.styleRule(Templates.treeDesignerSelector + ' .node .probability-to-enter, ' + Templates.treeDesignerSelector + ' .edge .probability', [['font-size', 'probability.fontSize'], ['fill', 'probability.color']]) +

//edge
Templates.styleRule(Templates.edgeSelector() + ' path', [['stroke', 'edge.stroke'], ['stroke-width', 'edge.strokeWidth']]) + Templates.styleRule(Templates.treeDesignerSelector + ' marker#arrow path', [['fill', 'edge.stroke']]) + Templates.styleRule(Templates.edgeSelector('optimal') + ' path', [['stroke', 'edge.optimal.stroke'], ['stroke-width', 'edge.optimal.strokeWidth']]) + Templates.styleRule(Templates.treeDesignerSelector + ' marker#arrow-optimal path', [['fill', 'edge.optimal.stroke']]) + Templates.styleRule(Templates.edgeSelector('selected') + ' path', [['stroke', 'edge.selected.stroke'], ['stroke-width', 'edge.selected.strokeWidth']]) + Templates.styleRule(Templates.treeDesignerSelector + ' marker#arrow-selected path', [['fill', 'edge.selected.stroke']]) + Templates.styleRule(Templates.edgeSelector() + ' .label', [['font-size', 'edge.label.fontSize'], ['fill', 'edge.label.color']]) + Templates.styleRule(Templates.edgeSelector() + ' .payoff', [['font-size', 'edge.payoff.fontSize'], ['fill', 'edge.payoff.color']]) + Templates.styleRule(Templates.edgeSelector() + ' .payoff.negative', [['fill', 'edge.payoff.negativeColor']]) + Templates.styleRule(Templates.treeDesignerSelector + ' .sd-title-container text.sd-title', [['font-size', 'title.fontSize'], ['font-weight', 'title.fontWeight'], ['font-style', 'title.fontStyle'], ['fill', 'title.color']]) + Templates.styleRule(Templates.treeDesignerSelector + ' .sd-title-container text.sd-description', [['font-size', 'description.fontSize'], ['font-weight', 'description.fontWeight'], ['font-style', 'description.fontStyle'], ['fill', 'description.color']]);

},{"./i18n/i18n":75,"./templates/growl_message.html":84,"sd-utils":"sd-utils"}],84:[function(require,module,exports){
module.exports = "<div class=\"sd-growl-message <%=type%>\">\n    <div class=\"sd-growl-message-text\">\n        <%= message %>\n    </div>\n</div>\n";

},{}],85:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TextDragHandler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _appUtils = require('./app-utils');

var _d = require('./d3');

var d3 = _interopRequireWildcard(_d);

var _contextMenu = require('./context-menu/context-menu');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextDragHandler = exports.TextDragHandler = function () {
    function TextDragHandler(treeDesigner, data) {
        _classCallCheck(this, TextDragHandler);

        this.treeDesigner = treeDesigner;
        this.data = data;

        var self = this;
        this.drag = d3.drag().subject(function (d) {
            if (d == null) {
                return {
                    x: event.x,
                    y: event.y
                };
            }
            var t = d3.select(this);
            return {
                x: t.attr("x") + _appUtils.AppUtils.getTranslation(t.attr("transform"))[0],
                y: t.attr("y") + _appUtils.AppUtils.getTranslation(t.attr("transform"))[1]
            };
        }).on("start", function (d) {
            self.dragStarted.call(this, d, self);
        }).on("drag", function (d) {
            self.onDrag.call(this, d, self);
        }).on("end", function (d) {
            self.dragEnded.call(this, d, self);
        });
    }

    _createClass(TextDragHandler, [{
        key: 'dragStarted',
        value: function dragStarted(d, self) {
            // self.treeDesigner.layout.disableAutoLayout();
            _contextMenu.ContextMenu.hide();
            var text = d3.select(this);
            if (!text.classed("selected")) {
                self.treeDesigner.clearSelection();
            }

            self.treeDesigner.selectText(d);
            text.classed("selected dragging", true);
            self.selectedNodes = self.treeDesigner.getSelectedNodes();
            self.prevDragEvent = d3.event;
            self.dragEventCount = 0;
        }
    }, {
        key: 'onDrag',
        value: function onDrag(draggedText, self) {
            if (self.dragEventCount == 2) {
                self.data.saveState();
            }
            self.dragEventCount++;

            var dx = d3.event.x - self.prevDragEvent.x;
            var dy = d3.event.y - self.prevDragEvent.y;

            draggedText.location.move(dx, dy);
            self.treeDesigner.updateTextPosition(draggedText);

            self.prevDragEvent = d3.event;
            self.treeDesigner.updatePlottingRegionSize();
        }
    }, {
        key: 'dragEnded',
        value: function dragEnded(draggedNode, self) {
            d3.select(this).classed("dragging", false);
        }
    }]);

    return TextDragHandler;
}();

},{"./app-utils":64,"./context-menu/context-menu":65,"./d3":71}],86:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tooltip = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require('./d3');

var d3 = _interopRequireWildcard(_d);

var _sdUtils = require('sd-utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tooltip = exports.Tooltip = function () {
    function Tooltip() {
        _classCallCheck(this, Tooltip);
    }

    _createClass(Tooltip, null, [{
        key: 'getContainer',
        value: function getContainer() {
            return d3.select("body").selectOrAppend('div.sd-tooltip');
        }
    }, {
        key: 'show',
        value: function show(html) {
            var xOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
            var yOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 28;
            var event = arguments[3];
            var duration = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

            var container = Tooltip.getContainer().style("opacity", 0);
            container.transition().duration(200).style("opacity", .98);
            container.html(html);
            Tooltip.updatePosition(xOffset, yOffset, event);
            if (duration) {
                setTimeout(function () {
                    Tooltip.hide();
                }, duration);
            }
        }
    }, {
        key: 'updatePosition',
        value: function updatePosition() {
            var xOffset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
            var yOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 28;
            var event = arguments[2];

            event = event || d3.event;
            Tooltip.getContainer().style("left", event.pageX + xOffset + "px").style("top", event.pageY - yOffset + "px");
        }
    }, {
        key: 'hide',
        value: function hide() {
            var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;

            var t = Tooltip.getContainer();
            if (duration) {
                t = t.transition().duration(duration);
            }
            t.style("opacity", 0);
        }
    }, {
        key: 'attach',
        value: function attach(target, htmlOrFn, xOffset, yOffset) {
            target.on('mouseover', function (d, i) {
                var html = null;
                if (_sdUtils.Utils.isFunction(htmlOrFn)) {
                    html = htmlOrFn(d, i);
                } else {
                    html = htmlOrFn;
                }

                if (html !== null && html !== undefined && html !== '') {
                    Tooltip.show(html, xOffset, yOffset);
                } else {
                    Tooltip.hide(0);
                }
            }).on('mousemove', function (d) {
                Tooltip.updatePosition(xOffset, yOffset);
            }).on("mouseout", function (d) {
                Tooltip.hide();
            });
        }
    }]);

    return Tooltip;
}();

},{"./d3":71,"sd-utils":"sd-utils"}],87:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TreeDesigner = exports.TreeDesignerConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require("./d3");

var d3 = _interopRequireWildcard(_d);

var _sdUtils = require("sd-utils");

var _appUtils = require("./app-utils");

var _sdModel = require("sd-model");

var _contextMenu = require("./context-menu/context-menu");

var _mainContextMenu = require("./context-menu/main-context-menu");

var _nodeContextMenu = require("./context-menu/node-context-menu");

var _layout = require("./layout");

var _nodeDragHandler = require("./node-drag-handler");

var _tooltip = require("./tooltip");

var _templates = require("./templates");

var _textDragHandler = require("./text-drag-handler");

var _textContextMenu = require("./context-menu/text-context-menu");

var _edgeContextMenu = require("./context-menu/edge-context-menu");

var _hammerjs = require("hammerjs");

var Hammer = _interopRequireWildcard(_hammerjs);

var _i18n = require("./i18n/i18n");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TreeDesignerConfig = exports.TreeDesignerConfig = function TreeDesignerConfig(custom) {
    _classCallCheck(this, TreeDesignerConfig);

    this.width = undefined;
    this.height = undefined;
    this.margin = {
        left: 25,
        right: 25,
        top: 25,
        bottom: 25
    };
    this.lng = 'en';
    this.layout = {
        type: 'tree',
        nodeSize: 40,
        limitNodePositioning: true,
        gridHeight: 75,
        gridWidth: 150,
        edgeSlantWidthMax: 20
    };
    this.fontFamily = 'sans-serif';
    this.fontSize = '12px';
    this.fontWeight = 'normal';
    this.fontStyle = 'normal';
    this.node = {
        strokeWidth: '1px',
        optimal: {
            stroke: '#006f00',
            strokeWidth: '1.5px'
        },
        label: {
            fontSize: '1em',
            color: 'black'
        },
        payoff: {
            fontSize: '1em',
            color: 'black',
            negativeColor: '#b60000'
        },
        decision: {
            fill: '#ff7777',
            stroke: '#660000',

            selected: {
                fill: '#aa3333'
                // stroke: '#666600'
            }
        },
        chance: {
            fill: '#ffff44',
            stroke: '#666600',

            selected: {
                fill: '#aaaa00'
                // stroke: '#666600'
            }
        },
        terminal: {
            fill: '#44ff44',
            stroke: 'black',
            selected: {
                fill: '#00aa00'
                // stroke: 'black'
            },
            payoff: {
                fontSize: '1em',
                color: 'black',
                negativeColor: '#b60000'
            }
        }
    };
    this.edge = {
        stroke: '#424242',
        strokeWidth: '1.5',
        optimal: {
            stroke: '#006f00',
            strokeWidth: '2.4'
        },
        selected: {
            stroke: '#045ad1',
            strokeWidth: '3.5'
        },
        label: {
            fontSize: '1em',
            color: 'back'
        },
        payoff: {
            fontSize: '1em',
            color: 'black',
            negativeColor: '#b60000'
        }

    };
    this.probability = {
        fontSize: '1em',
        color: '#0000d7'
    };
    this.title = {
        fontSize: '16px',
        fontWeight: 'bold',
        fontStyle: 'normal',
        color: '#000000',
        margin: {
            top: 15,
            bottom: 10
        }
    };
    this.description = {
        show: true,
        fontSize: '12px',
        fontWeight: 'bold',
        fontStyle: 'normal',
        color: '#000000',
        margin: {
            top: 5,
            bottom: 10
        }
    };
    this.readOnly = false;
    this.disableAnimations = false;
    this.forceFullEdgeRedraw = false;
    this.hideLabels = false;
    this.hidePayoffs = false;
    this.hideProbabilities = false;
    this.raw = false;

    this.payoffNumberFormatter = function (v, i) {
        return v;
    };

    this.probabilityNumberFormatter = function (v) {
        return v;
    };

    this.onNodeSelected = function (node) {};

    this.onEdgeSelected = function (edge) {};

    this.onTextSelected = function (text) {};

    this.onSelectionCleared = function () {};

    this.operationsForObject = function (o) {
        return [];
    };

    this.payoffNames = [null, null];
    this.maxPayoffsToDisplay = 1;

    if (custom) {
        _sdUtils.Utils.deepExtend(this, custom);
    }
};

var TreeDesigner = exports.TreeDesigner = function () {
    function TreeDesigner(container, dataModel, config) {
        _classCallCheck(this, TreeDesigner);

        this.setConfig(config);
        this.data = dataModel;
        this.initContainer(container);
        this.init();
    } //data model manager


    _createClass(TreeDesigner, [{
        key: "setConfig",
        value: function setConfig(config) {
            this.config = new TreeDesignerConfig(config);
            if (this.layout) {
                this.layout.config = this.config.layout;
            }
            this.updateCustomStyles();
            return this;
        }
    }, {
        key: "init",
        value: function init() {

            this.initSvg();
            this.initLayout();
            this.initI18n();
            this.initBrush();
            this.initEdgeMarkers();

            this.updateCustomStyles();
            if (!this.config.readOnly) {
                this.initMainContextMenu();
                this.initNodeContextMenu();
                this.initEdgeContextMenu();
                this.initNodeDragHandler();
                this.initTextDragHandler();
                this.initTextContextMenu();
            }
            this.redraw();
        }
    }, {
        key: "initI18n",
        value: function initI18n() {
            _i18n.i18n.init(this.config.lng);
        }
    }, {
        key: "updateCustomStyles",
        value: function updateCustomStyles() {
            d3.select('head').selectOrAppend('style#sd-tree-designer-style').html(_templates.Templates.get('treeDesignerStyles', this.config));
            return this;
        }
    }, {
        key: "initLayout",
        value: function initLayout() {
            this.layout = new _layout.Layout(this, this.data, this.config.layout);
        }
    }, {
        key: "initNodeDragHandler",
        value: function initNodeDragHandler() {
            this.nodeDragHandler = new _nodeDragHandler.NodeDragHandler(this, this.data);
        }
    }, {
        key: "initTextDragHandler",
        value: function initTextDragHandler() {
            this.textDragHandler = new _textDragHandler.TextDragHandler(this, this.data);
        }
    }, {
        key: "redraw",
        value: function redraw() {
            var withTransitions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


            var self = this;
            withTransitions = !self.config.disableAnimations && withTransitions;
            this.redrawDiagramTitle();
            this.redrawDiagramDescription();
            this.updateMargin(withTransitions);
            if (withTransitions) {
                self.transitionPrev = self.transition;
                self.transition = true;
            }
            this.redrawNodes();
            this.redrawEdges();
            this.redrawFloatingTexts();
            this.updateValidationMessages();
            if (withTransitions) {
                self.transition = self.transitionPrev;
            }
            setTimeout(function () {
                self.updatePlottingRegionSize();
            }, 10);

            return this;
        }
    }, {
        key: "computeAvailableSpace",
        value: function computeAvailableSpace() {
            this.availableHeight = _appUtils.AppUtils.sanitizeHeight(this.config.height, this.container, this.config.margin);
            this.availableWidth = _appUtils.AppUtils.sanitizeWidth(this.config.width, this.container, this.config.margin);
        }
    }, {
        key: "initSvg",
        value: function initSvg() {
            var c = this;
            var self = this;
            this.computeAvailableSpace();
            this.svg = this.container.selectOrAppend('svg.sd-tree-designer');
            this.svg.attr('width', this.availableWidth).attr('height', this.availableHeight);

            this.mainGroup = this.svg.selectOrAppend('g.main-group');
            this.updateMargin();

            if (!this.config.width) {
                d3.select(window).on("resize.tree-designer", function () {
                    self.updatePlottingRegionSize();
                    self.redrawDiagramTitle();
                });
            }

            var mc = new Hammer.Manager(this.svg.node(), { touchAction: 'auto' });
            mc.add(new Hammer.Press({
                pointerType: 'touch'
            }));

            mc.add(new Hammer.Pinch({
                pointerType: 'touch'
            }));

            var cancel;
            mc.on('pinchstart', function () {
                self.disableBrush();
            });
            mc.on('pinch', function () {
                cancel = _sdUtils.Utils.waitForFinalEvent(function () {
                    return self.enableBrush();
                }, 'pinchend', 5000);
            });
        }
    }, {
        key: "updateMargin",
        value: function updateMargin(withTransitions) {
            var self = this;
            var margin = this.config.margin;
            var group = this.mainGroup;
            if (withTransitions) {
                group = group.transition();
            }

            this.topMargin = margin.top;
            if (this.diagramTitle || this.diagramDescription) {
                this.topMargin = parseInt(this.diagramTitle ? this.config.title.margin.top : 0) + this.getTitleGroupHeight() + Math.max(this.topMargin, parseInt(this.config.title.margin.bottom));
            }

            group.attr("transform", "translate(" + margin.left + "," + this.topMargin + ")").on("end", function () {
                return self.updatePlottingRegionSize();
            });
        }
    }, {
        key: "setMargin",
        value: function setMargin(margin, withoutStateSaving) {
            var self = this;
            if (!withoutStateSaving) {
                this.data.saveState({
                    data: {
                        margin: _sdUtils.Utils.clone(self.config.margin)
                    },
                    onUndo: function onUndo(data) {
                        self.setMargin(data.margin, true);
                    },
                    onRedo: function onRedo(data) {
                        self.setMargin(margin, true);
                    }
                });
            }
            _sdUtils.Utils.deepExtend(this.config.margin, margin);
            this.redrawDiagramTitle();
            this.updateMargin(true);
        }
    }, {
        key: "initContainer",
        value: function initContainer(containerIdOrElem) {
            if (_sdUtils.Utils.isString(containerIdOrElem)) {
                var selector = containerIdOrElem.trim();

                if (!_sdUtils.Utils.startsWith(selector, '#') && !_sdUtils.Utils.startsWith(selector, '.')) {
                    selector = '#' + selector;
                }
                this.container = d3.select(selector);
            } else if (containerIdOrElem._parents) {
                this.container = containerIdOrElem;
            } else {
                this.container = d3.select(containerIdOrElem);
            }
        }
    }, {
        key: "updatePlottingRegionSize",
        value: function updatePlottingRegionSize() {
            var changed = false;
            this.computeAvailableSpace();
            var margin = this.config.margin;
            var svgWidth = this.svg.attr('width');
            var svgHeight = this.svg.attr('height');
            var mainGroupBox = this.mainGroup.node().getBBox();
            var newSvgWidth = mainGroupBox.width + mainGroupBox.x + margin.left + margin.right;
            this.container.classed('with-overflow-x', newSvgWidth >= this.availableWidth);
            newSvgWidth = Math.max(newSvgWidth, this.availableWidth);
            if (svgWidth != newSvgWidth) {
                changed = true;
                this.svg.attr('width', newSvgWidth);
            }
            var newSvgHeight = mainGroupBox.height + mainGroupBox.y + this.topMargin + margin.bottom;

            this.container.classed('with-overflow-y', newSvgHeight >= this.availableHeight);
            newSvgHeight = Math.max(newSvgHeight, this.availableHeight);
            if (svgHeight != newSvgHeight) {
                changed = true;
                this.svg.attr('height', newSvgHeight);
            }
            if (changed) {
                this.updateBrushExtent();
            }
        }
    }, {
        key: "redrawNodes",
        value: function redrawNodes() {
            var self = this;

            var nodesContainer = this.mainGroup.selectOrAppend('g.nodes');
            var nodes = nodesContainer.selectAll('.node').data(this.data.nodes.filter(function (d) {
                return !d.$hidden;
            }), function (d, i) {
                return d.$id;
            });
            nodes.exit().remove();
            var nodesEnter = nodes.enter().append('g').attr('id', function (d) {
                return 'node-' + d.$id;
            }).attr('class', function (d) {
                return d.type + '-node node';
            }).attr('transform', function (d) {
                return 'translate(' + d.location.x + '  ' + d.location.y + ')';
            });
            nodesEnter.append('path');

            var labelEnter = nodesEnter.append('text').attr('class', 'label');
            var payoffEnter = nodesEnter.append('text').attr('class', 'payoff computed');
            var indicatorEnter = nodesEnter.append('text').attr('class', 'error-indicator').text('!!');
            var aggregatedPayoffEnter = nodesEnter.append('text').attr('class', 'aggregated-payoff');
            var probabilityToEnterEnter = nodesEnter.append('text').attr('class', 'probability-to-enter');

            var nodesMerge = nodesEnter.merge(nodes);
            nodesMerge.classed('optimal', function (d) {
                return self.isOptimal(d);
            });

            var nodesMergeT = nodesMerge;
            if (this.transition) {
                nodesMergeT = nodesMerge.transition();
                nodesMergeT.on('end', function () {
                    return self.updatePlottingRegionSize();
                });
            }
            nodesMergeT.attr('transform', function (d) {
                return 'translate(' + d.location.x + '  ' + d.location.y + ')';
            });

            var path = nodesMerge.select('path');
            this.layout.drawNodeSymbol(path, this.transition);

            /*path
                .style('fill', d=> {
                    // if(self.isNodeSelected(d)){
                    //     return self.config.node[d.type].selected.fill
                    // }
                    return self.config.node[d.type].fill
                })
                .style('stroke', d=> self.config.node[d.type].stroke)
                .style('stroke-width', d=> {
                    if(self.config.node[d.type].strokeWidth!==undefined){
                        return self.config.node[d.type].strokeWidth;
                    }
                    return self.config.node.strokeWidth;
                });
            */
            this.layout.nodeLabelPosition(labelEnter);
            var labelMerge = nodesMerge.select('text.label');
            labelMerge.classed('sd-hidden', this.config.hideLabels);
            var labelMergeT = nodesMergeT.select('text.label');
            labelMergeT.each(this.updateTextLines);
            this.layout.nodeLabelPosition(labelMergeT).attr('text-anchor', 'middle');

            var payoff = nodesMerge.select('text.payoff');

            var payoffTspans = payoff.selectAll('tspan').data(function (d) {
                var item = d.displayValue('childrenPayoff');
                return _sdUtils.Utils.isArray(item) ? item.filter(function (i) {
                    return i !== undefined;
                }) : [item];
            });
            payoffTspans.exit().remove();

            var payoffTspansM = payoffTspans.enter().append('tspan').merge(payoffTspans);
            payoffTspansM
            // .attr('dominant-baseline', 'hanging')
            .attr('dy', function (d, i) {
                return i > 0 ? '1.1em' : undefined;
            }).attr('x', '0').classed('negative', function (d) {
                return d !== null && d < 0;
            }).classed('sd-hidden', this.config.hidePayoffs || this.config.raw).text(function (d, i) {
                var val = d;

                return val !== null ? isNaN(val) ? val : self.config.payoffNumberFormatter(val, i) : '';
            });
            this.attachPayoffTooltip(payoffTspansM);

            var payoffT = payoff;
            if (this.transition) {
                payoffT = payoff.transition();
            }

            this.layout.nodePayoffPosition(payoffEnter);
            this.layout.nodePayoffPosition(payoffT);

            var aggregatedPayoff = nodesMerge.select('text.aggregated-payoff');
            var aggregatedPayoffTspans = aggregatedPayoff.selectAll('tspan').data(function (d) {
                var item = d.displayValue('aggregatedPayoff');
                return _sdUtils.Utils.isArray(item) ? item.filter(function (i) {
                    return i !== undefined;
                }) : [item];
            });
            aggregatedPayoffTspans.exit().remove();
            var aggregatedPayoffTspansM = aggregatedPayoffTspans.enter().append('tspan').merge(aggregatedPayoffTspans).attr('dy', function (d, i) {
                return i > 0 ? '0.95em' : undefined;
            }).classed('negative', function (d) {
                return d !== null && d < 0;
            }).classed('sd-hidden', this.config.hidePayoffs || this.config.raw).text(function (val, i) {
                return val !== null ? isNaN(val) ? val : self.config.payoffNumberFormatter(val, i) : '';
            });

            this.attachPayoffTooltip(aggregatedPayoffTspansM, 'aggregatedPayoff');

            var aggregatedPayoffT = aggregatedPayoff;
            if (this.transition) {
                aggregatedPayoffT = aggregatedPayoff.transition();
            }

            this.layout.nodeAggregatedPayoffPosition(aggregatedPayoffEnter);
            this.layout.nodeAggregatedPayoffPosition(aggregatedPayoffT);

            var probabilityToEnter = nodesMerge.select('text.probability-to-enter').text(function (d) {
                var val = d.displayValue('probabilityToEnter');
                return val !== null ? isNaN(val) ? val : self.config.probabilityNumberFormatter(val) : '';
            }).classed('sd-hidden', this.config.hideProbabilities || this.config.raw);
            _tooltip.Tooltip.attach(probabilityToEnter, _i18n.i18n.t('tooltip.node.probabilityToEnter'));

            var probabilityToEnterT = probabilityToEnter;
            if (this.transition) {
                probabilityToEnterT = probabilityToEnter.transition();
            }
            this.layout.nodeProbabilityToEnterPosition(probabilityToEnterEnter);
            this.layout.nodeProbabilityToEnterPosition(probabilityToEnterT);

            var indicator = nodesMerge.select('text.error-indicator');
            indicator.classed('sd-hidden', this.config.raw);
            this.layout.nodeIndicatorPosition(indicatorEnter);
            this.layout.nodeIndicatorPosition(indicator);

            if (this.nodeDragHandler) {
                nodesMerge.call(this.nodeDragHandler.drag);
            }

            nodesMerge.on('contextmenu', this.nodeContextMenu);
            nodesMerge.on('dblclick', this.nodeContextMenu);
            nodesMerge.each(function (d, i) {
                var nodeElem = this;
                var mc = new Hammer.Manager(nodeElem);
                mc.add(new Hammer.Press({
                    pointerType: 'touch'
                }));
                mc.on('press', function (e) {
                    if (e.pointerType == 'touch') {
                        self.nodeDragHandler.cancelDrag();
                    }
                });

                if (d.folded) {
                    var button = d3.select(nodeElem).selectOrAppend('text.sd-unfold-button').text("[+]").on('click dbclick mousedown', function () {
                        return self.foldSubtree(d, false);
                    }); //firefox detects only mousedown event - related to drag handler

                    self.layout.nodeUnfoldButtonPosition(button);
                    _tooltip.Tooltip.attach(button, _i18n.i18n.t('contextMenu.node.unfold'));
                } else {
                    d3.select(nodeElem).select('.sd-unfold-button').remove();
                }
            });
        }
    }, {
        key: "attachPayoffTooltip",
        value: function attachPayoffTooltip(selection) {
            var payoffFiledName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'payoff';
            var object = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'node';

            var self = this;
            _tooltip.Tooltip.attach(selection, function (d, i) {
                if (self.config.payoffNames.length > i && self.config.payoffNames[i] !== null) {
                    return _i18n.i18n.t('tooltip.' + object + '.' + payoffFiledName + '.named', { value: d.payoff, number: i + 1, name: self.config.payoffNames[i] });
                }
                return _i18n.i18n.t('tooltip.' + object + '.' + payoffFiledName + '.default', { value: d.payoff, number: self.config.maxPayoffsToDisplay < 2 ? '' : i + 1 });
            });
        }
    }, {
        key: "updateTextLines",
        value: function updateTextLines(d) {
            //helper method for splitting text to tspans
            var lines = d.name ? d.name.split('\n') : [];
            lines.reverse();
            var tspans = d3.select(this).selectAll('tspan').data(lines);
            tspans.enter().append('tspan').merge(tspans).text(function (l) {
                return l;
            }).attr('dy', function (d, i) {
                return i > 0 ? '-1.1em' : undefined;
            }).attr('x', '0');

            tspans.exit().remove();
        }
    }, {
        key: "isOptimal",
        value: function isOptimal(d) {
            return d.displayValue('optimal');
        }
    }, {
        key: "redrawEdges",
        value: function redrawEdges() {
            var _this = this;

            var self = this;
            var edgesContainer = this.mainGroup.selectOrAppend('g.edges');
            if (self.config.forceFullEdgeRedraw) {
                edgesContainer.selectAll("*").remove();
            }

            var edges = edgesContainer.selectAll('.edge').data(this.data.edges.filter(function (e) {
                return !e.$hidden;
            }), function (d, i) {
                return d.$id;
            });
            edges.exit().remove();
            var edgesEnter = edges.enter().append('g').attr('id', function (d) {
                return 'edge-' + d.$id;
            }).attr('class', 'edge');

            edgesEnter.append('path');
            var labelEnter = edgesEnter.appendSelector('g.label-group');
            labelEnter.append('text').attr('class', 'label');
            var payoffEnter = edgesEnter.append('text').attr('class', 'payoff');
            var probabilityEnter = edgesEnter.append('text').attr('class', 'probability');

            var edgesMerge = edgesEnter.merge(edges);

            var optimalClassName = 'optimal';
            edgesMerge.classed(optimalClassName, function (d) {
                return self.isOptimal(d);
            });

            var edgesMergeT = edgesMerge;
            if (this.transition) {
                edgesMergeT = edgesMerge.transition();
            }

            edgesMergeT.select('path').attr('d', function (d) {
                return _this.layout.edgeLineD(d);
            })
            // .attr("stroke", "black")
            // .attr("stroke-width", 2)
            .attr("fill", "none").attr("marker-end", function (d) {
                var suffix = d3.select(this.parentNode).classed('selected') ? '-selected' : self.isOptimal(d) ? '-optimal' : '';
                return "url(#arrow" + suffix + ")";
            });
            // .attr("shape-rendering", "optimizeQuality")


            edgesMerge.on('click', function (d) {
                self.selectEdge(d, true);
            });

            this.layout.edgeLabelPosition(labelEnter);
            edgesMergeT.select('text.label').each(this.updateTextLines);
            var labelMerge = edgesMerge.select('g.label-group');
            labelMerge.classed('sd-hidden', this.config.hideLabels);
            var labelMergeT = edgesMergeT.select('g.label-group');
            this.layout.edgeLabelPosition(labelMergeT);
            // .text(d=>d.name);

            var payoff = edgesMerge.select('text.payoff');

            var payoffTspans = payoff.selectAll('tspan').data(function (d) {
                var item = d.displayValue('payoff');
                return _sdUtils.Utils.isArray(item) ? item.slice(0, Math.min(item.length, self.config.maxPayoffsToDisplay)).map(function (_) {
                    return d;
                }) : [d];
            });
            payoffTspans.exit().remove();

            var payoffTspansM = payoffTspans.enter().append('tspan').merge(payoffTspans);
            payoffTspansM
            // .attr('dominant-baseline', 'hanging')
            .attr('dy', function (d, i) {
                return i > 0 ? '1.1em' : undefined;
            })
            // .attr('x', '0')

            // .attr('dominant-baseline', 'hanging')
            .classed('negative', function (d, i) {
                var val = d.displayPayoff(undefined, i);
                return val !== null && val < 0;
            }).classed('sd-hidden', this.config.hidePayoffs)
            // .text(d=> isNaN(d.payoff) ? d.payoff : self.config.payoffNumberFormatter(d.payoff))
            .text(function (d, i) {
                if (_this.config.raw) {
                    return d.payoff[i];
                }

                var item = d.displayValue('payoff');
                var items = _sdUtils.Utils.isArray(item) ? item : [item];

                var val = items[i];
                if (val !== null) {
                    if (!isNaN(val)) {
                        return self.config.payoffNumberFormatter(val, i);
                    }
                    if (_sdUtils.Utils.isString(val)) {
                        return val;
                    }
                }

                if (d.payoff[i] !== null && !isNaN(d.payoff[i])) return self.config.payoffNumberFormatter(d.payoff[i], i);

                return d.payoff[i];
            });

            _tooltip.Tooltip.attach(payoffTspansM, function (d, i) {
                if (self.config.payoffNames.length > i && self.config.payoffNames[i] !== null) {
                    return _i18n.i18n.t('tooltip.edge.payoff.named', { value: d.payoff[i], number: i + 1, name: self.config.payoffNames[i] });
                }
                return _i18n.i18n.t('tooltip.edge.payoff.default', { value: d.payoff[i], number: self.config.maxPayoffsToDisplay < 2 ? '' : i + 1 });
            });

            var payoffTextT = payoff;
            if (this.transition) {
                payoffTextT = payoff.transition();
            }
            this.layout.edgePayoffPosition(payoffEnter);
            this.layout.edgePayoffPosition(payoffTextT);

            _tooltip.Tooltip.attach(edgesMerge.select('text.probability'), function (d) {
                return _i18n.i18n.t('tooltip.edge.probability', { value: d.probability === undefined ? d.displayProbability() : d.probability });
            });

            edgesMerge.select('text.probability').classed('sd-hidden', this.config.hideProbabilities);
            var probabilityMerge = edgesMerge.select('text.probability');
            probabilityMerge.attr('text-anchor', 'end').text(function (d) {
                if (_this.config.raw) {
                    return d.probability;
                }
                var val = d.displayProbability();

                if (val !== null) {
                    if (!isNaN(val)) {
                        return self.config.probabilityNumberFormatter(val);
                    }
                    if (_sdUtils.Utils.isString(val)) {
                        return val;
                    }
                }

                if (d.probability !== null && !isNaN(d.probability)) return self.config.probabilityNumberFormatter(d.probability);

                return d.probability;
            });
            var probabilityMergeT = probabilityMerge;
            if (this.transition) {
                probabilityMergeT = probabilityMerge.transition();
            }

            this.layout.edgeProbabilityPosition(probabilityEnter);
            this.layout.edgeProbabilityPosition(probabilityMergeT);

            edgesContainer.selectAll('.edge.' + optimalClassName).raise();

            edgesMerge.on('contextmenu', this.edgeContextMenu);
            edgesMerge.on('dblclick', this.edgeContextMenu);
            edgesMerge.each(function (d, i) {
                var elem = this;
                var mc = new Hammer.Manager(elem);
                mc.add(new Hammer.Press({
                    pointerType: Hammer.POINTER_TOUCH
                }));
            });
        }
    }, {
        key: "redrawFloatingTexts",
        value: function redrawFloatingTexts() {
            var self = this;

            var textsContainer = this.mainGroup.selectOrAppend('g.floating-texts');
            var texts = textsContainer.selectAll('.floating-text').data(this.data.texts, function (d, i) {
                return d.$id;
            });
            texts.exit().remove();
            var textsEnter = texts.enter().appendSelector('g.floating-text').attr('id', function (d) {
                return 'text-' + d.$id;
            });

            var rectWidth = 40;
            var rectHeight = 20;

            textsEnter.append('rect').attr('x', -5).attr('y', -16).attr('fill-opacity', 0);
            textsEnter.append('text');

            var textsMerge = textsEnter.merge(texts);
            var textsMergeT = textsMerge;
            if (this.transition) {
                textsMergeT = textsMerge.transition();
            }

            textsMergeT.attr('transform', function (d) {
                return 'translate(' + d.location.x + '  ' + d.location.y + ')';
            });

            var tspans = textsMerge.select('text').selectAll('tspan').data(function (d) {
                return d.value ? d.value.split('\n') : [];
            });

            tspans.enter().append('tspan').merge(tspans).html(function (l) {
                return _appUtils.AppUtils.replaceUrls(_appUtils.AppUtils.escapeHtml(l));
            }).attr('dy', function (d, i) {
                return i > 0 ? '1.1em' : undefined;
            }).attr('x', '0');

            tspans.exit().remove();
            textsMerge.classed('sd-empty', function (d) {
                return !d.value || !d.value.trim();
            });
            textsMerge.select('rect').attr('width', rectWidth).attr('height', rectHeight);

            textsMerge.each(function (d) {
                if (!d.value) {
                    return;
                }
                var bb = d3.select(this).select('text').node().getBBox();
                d3.select(this).select('rect').attr('y', bb.y - 5).attr('width', Math.max(bb.width + 10, rectWidth)).attr('height', Math.max(bb.height + 10, rectHeight));
            });

            if (this.textDragHandler) {
                textsMerge.call(this.textDragHandler.drag);
            }
            textsMerge.on('contextmenu', this.textContextMenu);
            textsMerge.on('dblclick', this.textContextMenu);
            textsMerge.each(function (d, i) {
                var elem = this;
                var mc = new Hammer.Manager(elem);
                mc.add(new Hammer.Press({
                    pointerType: 'touch'
                }));
            });
        }
    }, {
        key: "updateValidationMessages",
        value: function updateValidationMessages() {
            var _this2 = this;

            var nodes = this.mainGroup.selectAll('.node');
            nodes.classed('error', false);

            this.data.validationResults.forEach(function (validationResult) {
                if (validationResult.isValid()) {
                    return;
                }

                Object.getOwnPropertyNames(validationResult.objectIdToError).forEach(function (id) {
                    var errors = validationResult.objectIdToError[id];
                    var nodeSelection = _this2.getNodeD3SelectionById(id);
                    nodeSelection.classed('error', true);
                    var tooltipHtml = '';
                    errors.forEach(function (e) {
                        if (tooltipHtml) {
                            tooltipHtml += '<br/>';
                        }
                        tooltipHtml += _appUtils.AppUtils.getValidationMessage(e);
                    });

                    _tooltip.Tooltip.attach(nodeSelection.select('.error-indicator'), tooltipHtml);
                });
            });
        }
    }, {
        key: "initEdgeMarkers",
        value: function initEdgeMarkers() {
            var defs = this.svg.append("svg:defs");

            this.initArrowMarker("arrow");
            this.initArrowMarker("arrow-optimal");
            this.initArrowMarker("arrow-selected");
        }
    }, {
        key: "initArrowMarker",
        value: function initArrowMarker(id) {

            var defs = this.svg.select("defs");
            defs.append("marker").attr("id", id).attr("viewBox", "0 -5 10 10").attr("refX", 5).attr("refY", 0).attr("markerWidth", 4).attr("markerHeight", 4).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("class", "arrowHead");
        }
    }, {
        key: "updateBrushExtent",
        value: function updateBrushExtent() {
            var self = this;
            this.brush.extent([[0, 0], [self.svg.attr('width'), self.svg.attr('height')]]);
            this.brushContainer.call(this.brush);
        }
    }, {
        key: "initBrush",
        value: function initBrush() {
            var self = this;

            var brushContainer = self.brushContainer = this.brushContainer = this.svg.selectOrInsert("g.brush", ":first-child").attr("class", "brush");

            var brush = this.brush = d3.brush().on("start", brushstart).on("brush", brushmove).on("end", brushend);

            this.updateBrushExtent();

            brushContainer.select('.overlay').on("mousemove.edgeSelection", mousemoved);
            function mousemoved() {
                var m = d3.mouse(this);
                var mgt = self.getMainGroupTranslation();
                var margin = 10;

                var closest = [null, 999999999];
                var closeEdges = [];
                self.mainGroup.selectAll('.edge').each(function (d) {
                    var selection = d3.select(this);
                    selection.classed('sd-hover', false);
                    var pathNode = selection.select('path').node();
                    var b = pathNode.getBBox();
                    if (b.x + mgt[0] <= m[0] && b.x + b.width + mgt[0] >= m[0] && b.y + mgt[1] - margin <= m[1] && b.y + b.height + mgt[1] + margin >= m[1]) {

                        var cp = _appUtils.AppUtils.closestPoint(pathNode, [m[0] - mgt[0], m[1] - mgt[1]]);
                        if (cp.distance < margin && cp.distance < closest[1]) {
                            closest = [selection, cp.distance];
                        }
                    }
                });

                self.hoveredEdge = null;
                if (closest[0]) {
                    closest[0].classed('sd-hover', true);
                    self.hoveredEdge = closest[0];
                }
            }

            function brushstart() {
                if (!d3.event.selection) return;
                if (self.hoveredEdge) {
                    self.selectEdge(self.hoveredEdge.datum(), true);
                } else {
                    self.clearSelection();
                }
                _contextMenu.ContextMenu.hide();
            }

            // Highlight the selected nodes.
            function brushmove() {
                var s = d3.event.selection;
                if (!s) return;

                self.mainGroup.selectAll(".node").classed('selected', function (d) {
                    var mainGroupTranslation = self.getMainGroupTranslation();
                    var x = d.location.x + mainGroupTranslation[0];
                    var y = d.location.y + mainGroupTranslation[1];
                    var nodeSize = self.config.layout.nodeSize;
                    var offset = nodeSize * 0.25;
                    return s[0][0] <= x + offset && x - offset <= s[1][0] && s[0][1] <= y + offset && y - offset <= s[1][1];
                });
            }
            // If the brush is empty, select all circles.
            function brushend() {
                if (!d3.event.selection) return;
                brush.move(brushContainer, null);

                var selectedNodes = self.getSelectedNodes();
                if (selectedNodes && selectedNodes.length === 1) {
                    self.selectNode(selectedNodes[0]);
                }
                // if (!d3.event.selection) self.mainGroup.selectAll(".selected").classed('selected', false);
            }
        }
    }, {
        key: "disableBrush",
        value: function disableBrush() {
            if (!this.brushDisabled) {
                _appUtils.AppUtils.growl(_i18n.i18n.t('growl.brushDisabled'), 'info', 'left');
            }
            this.brushDisabled = true;
            this.brushContainer.remove();
        }
    }, {
        key: "enableBrush",
        value: function enableBrush() {
            if (this.brushDisabled) {
                _appUtils.AppUtils.growl(_i18n.i18n.t('growl.brushEnabled'), 'info', 'left');
                this.initBrush();
                this.brushDisabled = false;
            }
        }
    }, {
        key: "getMainGroupTranslation",
        value: function getMainGroupTranslation(invert) {
            var translation = _appUtils.AppUtils.getTranslation(this.mainGroup.attr("transform"));
            if (invert) {
                translation[0] = -translation[0];
                translation[1] = -translation[1];
            }
            return translation;
        }
    }, {
        key: "initNodeContextMenu",
        value: function initNodeContextMenu() {
            this.nodeContextMenu = new _nodeContextMenu.NodeContextMenu(this, this.config.operationsForObject);
        }
    }, {
        key: "initEdgeContextMenu",
        value: function initEdgeContextMenu() {
            this.edgeContextMenu = new _edgeContextMenu.EdgeContextMenu(this);
        }
    }, {
        key: "initTextContextMenu",
        value: function initTextContextMenu() {
            this.textContextMenu = new _textContextMenu.TextContextMenu(this);
        }
    }, {
        key: "initMainContextMenu",
        value: function initMainContextMenu() {
            this.mainContextMenu = new _mainContextMenu.MainContextMenu(this);
            this.svg.on('contextmenu', this.mainContextMenu);
            this.svg.on('dblclick', this.mainContextMenu);
        }
    }, {
        key: "addText",
        value: function addText(text) {
            this.data.saveState();
            this.data.addText(text);
            this.redraw();
            this.selectText(text);
        }
    }, {
        key: "addNode",
        value: function addNode(node, parent) {
            var redraw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            this.data.saveState();
            this.data.addNode(node, parent);
            this.redraw(true);
            this.layout.update(node);
            return node;
        }
    }, {
        key: "addDecisionNode",
        value: function addDecisionNode(parent) {
            var newNode = new _sdModel.domain.DecisionNode(this.layout.getNewChildLocation(parent));
            this.addNode(newNode, parent);
        }
    }, {
        key: "addChanceNode",
        value: function addChanceNode(parent) {
            var newNode = new _sdModel.domain.ChanceNode(this.layout.getNewChildLocation(parent));
            this.addNode(newNode, parent);
        }
    }, {
        key: "addTerminalNode",
        value: function addTerminalNode(parent) {
            var newNode = new _sdModel.domain.TerminalNode(this.layout.getNewChildLocation(parent));
            this.addNode(newNode, parent);
        }
    }, {
        key: "injectNode",
        value: function injectNode(node, edge) {
            this.data.saveState();
            this.data.injectNode(node, edge);
            this.redraw();
            this.layout.update(node);
            return node;
        }
    }, {
        key: "injectDecisionNode",
        value: function injectDecisionNode(edge) {
            var newNode = new _sdModel.domain.DecisionNode(this.layout.getInjectedNodeLocation(edge));
            this.injectNode(newNode, edge);
        }
    }, {
        key: "injectChanceNode",
        value: function injectChanceNode(edge) {
            var newNode = new _sdModel.domain.ChanceNode(this.layout.getInjectedNodeLocation(edge));
            this.injectNode(newNode, edge);
        }
    }, {
        key: "removeNode",
        value: function removeNode(node) {
            this.data.saveState();
            this.data.removeNode(node);

            if (!this.layout.isManualLayout()) {
                this.layout.update();
            } else {
                this.redraw();
            }
        }
    }, {
        key: "removeSelectedNodes",
        value: function removeSelectedNodes() {
            var selectedNodes = this.getSelectedNodes();
            if (!selectedNodes.length) {
                return;
            }
            this.data.saveState();
            this.data.removeNodes(selectedNodes);
            this.clearSelection();
            this.redraw();
            this.layout.update();
        }
    }, {
        key: "removeSelectedTexts",
        value: function removeSelectedTexts() {
            var selectedTexts = this.getSelectedTexts();

            if (!selectedTexts.length) {
                return;
            }
            this.data.saveState();
            this.data.removeTexts(selectedTexts);
            this.clearSelection();
            this.redraw();
        }
    }, {
        key: "copyNode",
        value: function copyNode(d, notClearPrevSelection) {
            var clone = this.data.cloneSubtree(d);
            if (notClearPrevSelection) {
                if (!this.copiedNodes) {
                    this.copiedNodes = [];
                }
                this.copiedNodes.push(clone);
            } else {
                this.copiedNodes = [clone];
            }
        }
    }, {
        key: "cutNode",
        value: function cutNode(d) {
            this.copyNode(d);
            this.removeNode(d);
        }
    }, {
        key: "cutSelectedNodes",
        value: function cutSelectedNodes() {
            var selectedNodes = this.getSelectedNodes();
            var selectedRoots = this.data.findSubtreeRoots(selectedNodes);
            this.copyNodes(selectedRoots);
            this.removeSelectedNodes();
        }
    }, {
        key: "copySelectedNodes",
        value: function copySelectedNodes() {
            var self;
            var selectedNodes = this.getSelectedNodes();

            var selectedRoots = this.data.findSubtreeRoots(selectedNodes);
            this.copyNodes(selectedRoots);
        }
    }, {
        key: "copyNodes",
        value: function copyNodes(nodes) {
            var _this3 = this;

            this.copiedNodes = nodes.map(function (d) {
                return _this3.data.cloneSubtree(d);
            });
        }
    }, {
        key: "pasteToNode",
        value: function pasteToNode(node) {
            var _this4 = this;

            if (!this.copiedNodes || !this.copiedNodes.length) {
                return;
            }
            this.data.saveState();
            var self = this;
            self.clearSelection();
            var nodesToAttach = this.copiedNodes;
            self.copyNodes(this.copiedNodes);
            nodesToAttach.forEach(function (toAttach) {
                var attached = _this4.data.attachSubtree(toAttach, node).childNode;
                if (attached.folded) {
                    self.foldSubtree(attached, attached.folded, false);
                }
                var location = self.layout.getNewChildLocation(node);
                attached.moveTo(location.x, location.y, true);
                self.layout.moveNodeToEmptyPlace(attached, false);
                self.layout.fitNodesInPlottingRegion(_this4.data.getAllDescendantNodes(attached));

                self.selectSubTree(attached, false, nodesToAttach.length > 1);
            });

            if (node.folded) {
                self.foldSubtree(node, node.folded, false);
            }

            setTimeout(function () {
                self.redraw();
                self.layout.update();
            }, 10);
        }
    }, {
        key: "pasteToNewLocation",
        value: function pasteToNewLocation(point) {
            var _this5 = this;

            this.data.saveState();
            var self = this;
            self.clearSelection();
            var nodesToAttach = this.copiedNodes;
            self.copyNodes(this.copiedNodes);
            nodesToAttach.forEach(function (toAttach) {
                var attached = _this5.data.attachSubtree(toAttach);
                if (attached.folded) {
                    self.foldSubtree(attached, attached.folded, false);
                }
                attached.moveTo(point.x, point.y, true);
                self.layout.moveNodeToEmptyPlace(attached, false);
                self.layout.fitNodesInPlottingRegion(_this5.data.getAllDescendantNodes(attached));

                self.selectSubTree(attached, false, nodesToAttach.length > 1);
            });

            setTimeout(function () {
                self.redraw();
                self.layout.update();
            }, 10);
        }
    }, {
        key: "convertNode",
        value: function convertNode(node, typeToConvertTo) {
            var self = this;
            this.data.saveState();
            this.data.convertNode(node, typeToConvertTo);
            setTimeout(function () {
                self.redraw(true);
            }, 10);
        }
    }, {
        key: "performOperation",
        value: function performOperation(object, operation) {
            var self = this;
            this.data.saveState();
            operation.perform(object);
            setTimeout(function () {
                self.redraw();
                self.layout.update();
            }, 10);
        }
    }, {
        key: "foldSubtree",
        value: function foldSubtree(node) {
            var fold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var redraw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var self = this;
            node.folded = fold;

            this.data.getAllDescendantNodes(node).forEach(function (n) {
                n.$hidden = fold;
                n.folded = false;
            });
            this.data.getAllDescendantEdges(node).forEach(function (e) {
                return e.$hidden = fold;
            });

            if (!redraw) {
                return;
            }
            setTimeout(function () {
                self.redraw();
                self.layout.update();
            }, 10);
        }
    }, {
        key: "updateVisibility",
        value: function updateVisibility() {
            var _this6 = this;

            var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (!node) {
                this.data.getRoots().forEach(function (n) {
                    return _this6.updateVisibility(n);
                });
                return;
            }

            if (node.folded) {
                this.foldSubtree(node, true, false);
                return;
            }

            node.childEdges.forEach(function (e) {
                return _this6.updateVisibility(e.childNode);
            });
        }
    }, {
        key: "moveNodeTo",
        value: function moveNodeTo(x, y) {}
    }, {
        key: "updateNodePosition",
        value: function updateNodePosition(node) {
            this.getNodeD3Selection(node).raise().attr('transform', 'translate(' + node.location.x + ' ' + node.location.y + ')');
        }
    }, {
        key: "updateTextPosition",
        value: function updateTextPosition(text) {
            this.getTextD3Selection(text).raise().attr('transform', 'translate(' + text.location.x + ' ' + text.location.y + ')');
        }
    }, {
        key: "getNodeD3Selection",
        value: function getNodeD3Selection(node) {
            return this.getNodeD3SelectionById(node.$id);
        }
    }, {
        key: "getNodeD3SelectionById",
        value: function getNodeD3SelectionById(id) {
            return this.mainGroup.select('#node-' + id);
        }
    }, {
        key: "getTextD3Selection",
        value: function getTextD3Selection(text) {
            return this.getTextD3SelectionById(text.$id);
        }
    }, {
        key: "getTextD3SelectionById",
        value: function getTextD3SelectionById(id) {
            return this.mainGroup.select('#text-' + id);
        }
    }, {
        key: "getSelectedNodes",
        value: function getSelectedNodes() {
            var _this7 = this;

            var visibleOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var selectedVisible = this.mainGroup.selectAll(".node.selected").data();
            if (visibleOnly) {
                return selectedVisible;
            }

            var allSelected = [];
            allSelected.push.apply(allSelected, _toConsumableArray(selectedVisible));

            selectedVisible.forEach(function (n) {
                if (n.folded) {
                    var descendants = _this7.data.getAllDescendantNodes(n);
                    if (descendants) {
                        allSelected.push.apply(allSelected, _toConsumableArray(descendants));
                    }
                }
            });

            return allSelected;
        }
    }, {
        key: "getSelectedTexts",
        value: function getSelectedTexts() {
            return this.mainGroup.selectAll(".floating-text.selected").data();
        }
    }, {
        key: "clearSelection",
        value: function clearSelection() {
            var _this8 = this;

            this.mainGroup.selectAll(".edge.selected").select('path').attr("marker-end", function (d) {
                return "url(#arrow" + (_this8.isOptimal(d) ? '-optimal' : '') + ")";
            });
            this.mainGroup.selectAll(".selected").classed('selected', false);
            this.config.onSelectionCleared();
        }
    }, {
        key: "selectEdge",
        value: function selectEdge(edge, clearSelectionBeforeSelect) {
            if (clearSelectionBeforeSelect) {
                this.clearSelection();
            }
            this.config.onEdgeSelected(edge);
            this.mainGroup.select('#edge-' + edge.$id).classed('selected', true).select('path').attr("marker-end", function (d) {
                return "url(#arrow-selected)";
            });
        }
    }, {
        key: "isNodeSelected",
        value: function isNodeSelected(node) {
            return this.getNodeD3Selection(node).classed('selected');
        }
    }, {
        key: "selectNode",
        value: function selectNode(node, clearSelectionBeforeSelect, skipCallback) {
            if (clearSelectionBeforeSelect) {
                this.clearSelection();
            }

            if (!skipCallback) {
                this.config.onNodeSelected(node);
            }

            this.getNodeD3SelectionById(node.$id).classed('selected', true);
        }
    }, {
        key: "selectText",
        value: function selectText(text, clearSelectionBeforeSelect, skipCallback) {
            if (clearSelectionBeforeSelect) {
                this.clearSelection();
            }

            if (!skipCallback) {
                this.config.onTextSelected(text);
            }

            this.getTextD3SelectionById(text.$id).classed('selected', true);
        }
    }, {
        key: "selectSubTree",
        value: function selectSubTree(node, clearSelectionBeforeSelect, skipCallback) {
            var _this9 = this;

            if (clearSelectionBeforeSelect) {
                this.clearSelection();
            }
            this.selectNode(node, false, skipCallback);
            node.childEdges.forEach(function (e) {
                return _this9.selectSubTree(e.childNode, false, true);
            });
        }
    }, {
        key: "selectAllNodes",
        value: function selectAllNodes() {
            this.mainGroup.selectAll(".node").classed('selected', true);
        }
    }, {
        key: "autoLayout",
        value: function autoLayout(type, withoutStateSaving) {
            this.layout.autoLayout(type, withoutStateSaving);
        }
    }, {
        key: "updateDiagramTitle",
        value: function updateDiagramTitle(titleValue) {
            if (!titleValue) {
                titleValue = '';
            }
            this.diagramTitle = titleValue;
            this.redrawDiagramTitle();
            this.redrawDiagramDescription();
            this.updateMargin(true);
        }
    }, {
        key: "redrawDiagramTitle",
        value: function redrawDiagramTitle() {
            var svgWidth = this.svg.attr('width');
            var svgHeight = this.svg.attr('height');
            this.titleContainer = this.svg.selectOrAppend('g.sd-title-container');

            var title = this.titleContainer.selectOrAppend('text.sd-title');
            title.text(this.diagramTitle);
            _layout.Layout.setHangingPosition(title);

            var marginTop = parseInt(this.config.title.margin.top);
            this.titleContainer.attr('transform', 'translate(' + svgWidth / 2 + ',' + marginTop + ')');
        }
    }, {
        key: "redrawDiagramDescription",
        value: function redrawDiagramDescription() {
            var svgWidth = this.svg.attr('width');
            var svgHeight = this.svg.attr('height');
            this.titleContainer = this.svg.selectOrAppend('g.sd-title-container');

            var desc = this.titleContainer.selectOrAppend('text.sd-description');

            if (!this.config.description.show) {
                desc.remove();
                return;
            }

            var lines = this.diagramDescription ? this.diagramDescription.split('\n') : [];
            var tspans = desc.selectAll('tspan').data(lines);
            tspans.enter().append('tspan').merge(tspans).html(function (l) {
                return _appUtils.AppUtils.replaceUrls(_appUtils.AppUtils.escapeHtml(l));
            }).attr('dy', function (d, i) {
                return i > 0 ? '1.1em' : undefined;
            }).attr('x', '0');

            tspans.exit().remove();
            _layout.Layout.setHangingPosition(desc);

            var title = this.titleContainer.selectOrAppend('text.sd-title');

            var marginTop = 0;
            if (this.diagramTitle) {
                marginTop += title.node().getBBox().height;
                marginTop += Math.max(parseInt(this.config.description.margin.top), 0);
            }

            desc.attr('transform', 'translate(0,' + marginTop + ')');
        }
    }, {
        key: "updateDiagramDescription",
        value: function updateDiagramDescription(descriptionValue) {
            if (!descriptionValue) {
                descriptionValue = '';
            }
            this.diagramDescription = descriptionValue;
            this.redrawDiagramTitle();
            this.redrawDiagramDescription();
            this.updateMargin(true);
        }
    }, {
        key: "getTitleGroupHeight",
        value: function getTitleGroupHeight(withMargins) {
            if (!this.titleContainer) {
                return 0;
            }
            var h = this.titleContainer.node().getBBox().height;
            if (withMargins) {
                h += parseInt(this.config.title.margin.bottom);
                h += parseInt(this.config.title.margin.top);
            }
            return h;
        }
    }]);

    return TreeDesigner;
}();

},{"./app-utils":64,"./context-menu/context-menu":65,"./context-menu/edge-context-menu":66,"./context-menu/main-context-menu":67,"./context-menu/node-context-menu":68,"./context-menu/text-context-menu":69,"./d3":71,"./i18n/i18n":75,"./layout":79,"./node-drag-handler":80,"./templates":83,"./text-drag-handler":85,"./tooltip":86,"hammerjs":"hammerjs","sd-model":"sd-model","sd-utils":"sd-utils"}],88:[function(require,module,exports){
module.exports={
  "name": "silver-decisions",
  "version": "1.0.0",
  "description": "Software for creating and analyzing decision trees.",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/SilverDecisions/SilverDecisions.git"
  },
  "author": "Michał Wasiluk, Bogumił Kamiński, Przemysław Szufel",
  "license": "LGPL-3.0",
  "bugs": {
    "url": "https://github.com/SilverDecisions/SilverDecisions/issues"
  },
  "homepage": "https://github.com/SilverDecisions/SilverDecisions#readme",
  "browserify": {
    "transform": [
      [
        "babelify",
        {
          "presets": [
            "es2015"
          ],
          "plugins": [
            ["transform-class-properties", { "spec": true }],
            "transform-object-assign",
            "transform-es2015-spread",
            "transform-object-rest-spread",
            [
              "babel-plugin-transform-builtin-extend",
              {
                "globals": [
                  "Error"
                ]
              }
            ]
          ]
        }
      ]
    ]
  },
  "devDependencies": {
    "babel-plugin-transform-builtin-extend": "^1.1.2",
    "babel-plugin-transform-class-properties": "^6.11.5",
    "babel-plugin-transform-es2015-spread": "^6.22.0",
    "babel-plugin-transform-object-assign": "^6.8.0",
    "babel-plugin-transform-object-rest-spread": "^6.23.0",
    "babel-preset-es2015": "^6.14.0",
    "babelify": "^7.3.0",
    "browser-sync": "^2.13.0",
    "browserify": "^14.5.0",
    "browserify-resolutions": "^1.1.0",
    "browserify-shim": "^3.8.13",
    "chalk": "^2.3.0",
    "del": "^3.0.0",
    "es6-set": "^0.1.5",
    "gulp": "^3.9.1",
    "gulp-concat": "^2.6.0",
    "gulp-filelist": "^1.0.0",
    "gulp-html2js": "^0.4.2",
    "gulp-load-plugins": "^1.2.4",
    "gulp-minify-css": "^1.2.4",
    "gulp-plumber": "^1.1.0",
    "gulp-rename": "^1.2.2",
    "gulp-replace": "^0.6.1",
    "gulp-sass": "^3.1.0",
    "gulp-sourcemaps": "^2.6.1",
    "gulp-strip-debug": "^1.1.0",
    "gulp-template": "^4.0.0",
    "gulp-uglify": "^3.0.0",
    "gulp-util": "^3.0.7",
    "jasmine": "^2.5.2",
    "jasmine-jquery": "^2.1.1",
    "karma": "^1.7.0",
    "karma-browserify": "^5.1.1",
    "karma-chrome-launcher": "^2.0.0",
    "karma-intl-shim": "^1.0.3",
    "karma-jasmine": "^1.0.2",
    "merge-stream": "^1.0.0",
    "odc-d3": "^1.1.6",
    "run-sequence": "^2.0.0",
    "stringify": "^5.1.0",
    "svg2pdf.js": "^1.1.1",
    "vinyl-buffer": "^1.0.0",
    "vinyl-source-stream": "^1.1.0",
    "yargs": "^10.0.3"
  },
  "dependencies": {
    "autosize": "^4.0.0",
    "blueimp-canvas-to-blob": "^3.3.0",
    "d3-array": "^1.0.1",
    "d3-dispatch": "^1.0.1",
    "d3-drag": "^1.0.1",
    "d3-scale": "^1.0.3",
    "d3-selection": "^1.0.2",
    "d3-time-format": "^2.0.2",
    "file-saver": "^1.3.2",
    "hammerjs": "^2.0.8",
    "i18next": "^10.0.3",
    "jquery": "^3.1.1",
    "jquery-ui": "^1.12.1",
    "pivottable": "^2.11.0",
    "sd-computations": "0.3.5",
    "sd-model": "0.2.6",
    "sd-utils": "0.1.10",
    "sd-tree-designer": "0.1.7"
  }
}

},{}],89:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppUtils = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _d = require("./d3");

var d3 = _interopRequireWildcard(_d);

var _autosize = require("autosize");

var autosize = _interopRequireWildcard(_autosize);

var _templates = require("./templates");

var _i18n = require("./i18n/i18n");

var _sdUtils = require("sd-utils");

var _sdTreeDesigner = require("sd-tree-designer");

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var AppUtils = exports.AppUtils = function (_TdUtils) {
    _inherits(AppUtils, _TdUtils);

    function AppUtils() {
        _classCallCheck(this, AppUtils);

        return _possibleConstructorReturn(this, (AppUtils.__proto__ || Object.getPrototypeOf(AppUtils)).apply(this, arguments));
    }

    _createClass(AppUtils, null, [{
        key: "updateInputClass",
        value: function updateInputClass(selection) {
            var value = selection.node().value;
            selection.classed('empty', value !== 0 && !value);
            return selection;
        }
    }, {
        key: "autoResizeTextarea",
        value: function autoResizeTextarea(element) {
            setTimeout(function () {
                element.style.width = "";
                var width = element.getBoundingClientRect().width;
                if (width) {
                    element.style.width = width + 'px';
                }
                autosize.update(element);
            }, 10);
        }
    }, {
        key: "elasticTextarea",
        value: function elasticTextarea(selection) {
            setTimeout(function () {
                selection.style('width', undefined);
                var width = selection.node().getBoundingClientRect().width;
                if (width) {
                    selection.style('width', width + 'px');
                }
                autosize.default(selection.node());
            }, 10);
        }
    }, {
        key: "postByForm",
        value: function postByForm(url, data) {
            var name, form;

            // create the form
            form = AppUtils.createElement('form', AppUtils.mergeDeep({
                method: 'post',
                action: url,
                enctype: 'multipart/form-data'
            }), document.body);

            for (name in data) {
                if (data.hasOwnProperty(name)) {
                    AppUtils.createElement('input', {
                        type: 'hidden',
                        name: name,
                        value: data[name]
                    }, form);
                }
            }

            form.submit();

            AppUtils.removeElement(form);
        }
    }, {
        key: "showFullScreenPopup",
        value: function showFullScreenPopup(title, html, closeCallback) {
            var popup = d3.select("body").selectOrAppend("div.sd-full-screen-popup-container").html(_templates.Templates.get('fullscreenPopup', { title: title, body: html }));
            popup.select('.sd-close-popup').on('click', function () {
                popup.remove();
                if (closeCallback) {
                    closeCallback();
                }
            });
        }
    }]);

    return AppUtils;
}(_sdTreeDesigner.AppUtils);

},{"./d3":92,"./i18n/i18n":105,"./templates":121,"autosize":"autosize","sd-tree-designer":63,"sd-utils":"sd-utils"}],90:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.App = exports.AppConfig = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _d = require("./d3");

var d3 = _interopRequireWildcard(_d);

var _i18n = require("./i18n/i18n");

var _sdUtils = require("sd-utils");

var _appUtils = require("./app-utils");

var _sdModel = require("sd-model");

var model = _interopRequireWildcard(_sdModel);

var _sdTreeDesigner = require("sd-tree-designer");

var _templates = require("./templates");

var _sidebar = require("./sidebar");

var _toolbar = require("./toolbar");

var _settingsDialog = require("./dialogs/settings-dialog");

var _aboutDialog = require("./dialogs/about-dialog");

var _exporter = require("./exporter");

var _definitionsDialog = require("./dialogs/definitions-dialog");

var _sdComputations = require("sd-computations");

var _sensitivityAnalysisDialog = require("./dialogs/sensitivity-analysis-dialog");

var _loadingIndicator = require("./loading-indicator");

var _leagueTableDialog = require("./league-table/league-table-dialog");

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var buildConfig = require('../tmp/build-config.js');

var AppConfig =

//https://github.com/d3/d3-format/blob/master/README.md#format

exports.AppConfig = function AppConfig(custom) {
    _classCallCheck(this, AppConfig);

    this.readOnly = false;
    this.logLevel = 'warn';
    this.workerUrl = null;
    this.jobRepositoryType = 'idb';
    this.clearRepository = false;
    this.buttons = {
        new: true,
        save: true,
        open: true,
        exportToPng: true,
        exportToSvg: true,
        exportToPdf: true
    };
    this.exports = {
        show: true,
        serverUrl: 'http://export.highcharts.com', //url of the export server
        pdf: {
            mode: 'server' // available options: 'client', 'server', 'fallback',
        },
        png: {
            mode: 'fallback' // available options: 'client', 'server', 'fallback',
        }
    };
    this.showDetails = true;
    this.showDefinitions = true;
    this.jsonFileDownload = true;
    this.width = undefined;
    this.height = undefined;
    this.rule = "expected-value-maximization";
    this.lng = 'en';
    this.format = { // NumberFormat  options
        locales: 'en',
        payoff1: {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'symbol',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            // minimumSignificantDigits: 1,
            useGrouping: true
        },
        payoff2: {
            style: 'decimal',
            currency: 'USD',
            currencyDisplay: 'symbol',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            // minimumSignificantDigits: 1,
            useGrouping: true
        },
        probability: { // NumberFormat  options
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 3,
            useGrouping: true
        }
    };
    this.title = '';
    this.description = '';
    this.treeDesigner = {};
    this.leagueTable = {
        plot: {
            maxWidth: "800px",
            groups: {
                'highlighted': {
                    color: '#008000'
                },
                'highlighted-default': {
                    color: '#00bd00'
                },
                'extended-dominated': {
                    color: '#ffa500'
                },
                'dominated': {
                    color: '#ff0000'
                },
                'default': {
                    color: '#000000'
                }
            }
        }
    };

    if (custom) {
        _sdUtils.Utils.deepExtend(this, custom);
    }
};

var App = exports.App = function () {
    //Data model manager
    function App(containerIdOrElem, config, diagramData) {
        var _this = this;

        _classCallCheck(this, App);

        this.viewModes = [];
        this.payoffsMaximization = [true, false];

        var p = Promise.resolve();
        this.setConfig(config);
        this.initI18n();
        this.initContainer(containerIdOrElem);
        this.initViewModes();
        this.initDataModel();
        p = this.initComputationsManager();
        this.initProbabilityNumberFormat();
        this.initPayoffNumberFormat();
        this.initTreeDesigner();
        this.initSidebar();
        this.initSettingsDialog();
        this.initAboutDialog();
        this.initDefinitionsDialog();
        this.initSensitivityAnalysisDialog();
        this.initLeagueTableDialog();
        this.initOnBeforeUnload();
        this.initKeyCodes();
        p.then(function () {
            _this.initToolbar();
            if (diagramData) {
                _this.openDiagram(diagramData);
            } else {
                _this.updateView();
            }
        }).catch(function (e) {
            _sdUtils.log.error(e);
        });
    } // version is set from package.json


    _createClass(App, [{
        key: "setConfig",
        value: function setConfig(config) {
            if (!config) {
                this.config = new AppConfig();
            } else {
                this.config = new AppConfig(config);
            }
            this.setLogLevel(this.config.logLevel);
            return this;
        }
    }, {
        key: "setLogLevel",
        value: function setLogLevel(level) {
            _sdUtils.log.setLevel(level);
        }
    }, {
        key: "initContainer",
        value: function initContainer(containerIdOrElem) {

            if (_sdUtils.Utils.isString(containerIdOrElem)) {
                var selector = containerIdOrElem.trim();

                if (!_sdUtils.Utils.startsWith(selector, '#') && !_sdUtils.Utils.startsWith(selector, '.')) {
                    selector = '#' + selector;
                }
                this.container = d3.select(selector);
            } else {
                this.container = d3.select(containerIdOrElem);
            }
            var self = this;

            var html = _templates.Templates.get('main', {
                version: App.version,
                buildTimestamp: App.buildTimestamp,
                'lng': self.config.lng
            });
            this.container.html(html);

            this.container.select('#silver-decisions').classed('sd-read-only', this.config.readOnly);
        }
    }, {
        key: "initI18n",
        value: function initI18n() {
            _i18n.i18n.init(this.config.lng);
        }
    }, {
        key: "initDataModel",
        value: function initDataModel() {
            var _this2 = this;

            var self = this;
            this.dataModel = new model.DataModel();
            // this.dataModel.nodeAddedCallback = this.dataModel.nodeRemovedCallback = ()=>self.onNodeAddedOrRemoved();
            this.dataModel.nodeAddedCallback = this.dataModel.nodeRemovedCallback = function (node) {
                return _sdUtils.Utils.waitForFinalEvent(function () {
                    return _this2.onNodeAddedOrRemoved();
                }, 'onNodeAddedOrRemoved', 5);
            };

            this.dataModel.textAddedCallback = function (text) {
                return _sdUtils.Utils.waitForFinalEvent(function () {
                    return _this2.onTextAdded(text);
                }, 'onTextAdded');
            };
            this.dataModel.textRemovedCallback = function (text) {
                return _sdUtils.Utils.waitForFinalEvent(function () {
                    return _this2.onTextRemoved(text);
                }, 'onTextAdded');
            };
        }
    }, {
        key: "initComputationsManager",
        value: function initComputationsManager() {
            this.computationsManager = new _sdComputations.ComputationsManager({
                ruleName: this.config.ruleName,
                worker: {
                    url: this.config.workerUrl
                },
                jobRepositoryType: this.config.jobRepositoryType,
                clearRepository: this.config.clearRepository
            }, this.dataModel);
            this.expressionEngine = this.computationsManager.expressionEngine;
            return this.checkValidityAndRecomputeObjective(false, false, false, true);
        }
    }, {
        key: "initSidebar",
        value: function initSidebar() {
            this.sidebar = new _sidebar.Sidebar(this.container.select('#sd-sidebar'), this);
        }
    }, {
        key: "initSettingsDialog",
        value: function initSettingsDialog() {
            this.settingsDialog = new _settingsDialog.SettingsDialog(this);
        }
    }, {
        key: "initAboutDialog",
        value: function initAboutDialog() {
            this.aboutDialog = new _aboutDialog.AboutDialog(this);
        }
    }, {
        key: "initDefinitionsDialog",
        value: function initDefinitionsDialog() {
            var _this3 = this;

            this.definitionsDialog = new _definitionsDialog.DefinitionsDialog(this);
            this.definitionsDialog.onClosed = function () {
                return _this3.recompute(true, true);
            };
        }
    }, {
        key: "initLeagueTableDialog",
        value: function initLeagueTableDialog() {
            this.leagueTableDialog = new _leagueTableDialog.LeagueTableDialog(this);
        }
    }, {
        key: "isLeagueTableAvailable",
        value: function isLeagueTableAvailable() {
            return this.isMultipleCriteria() && this.dataModel.getRoots().length === 1 && this.computationsManager.isValid() && this.leagueTableDialog.validateParams();
        }
    }, {
        key: "initSensitivityAnalysisDialog",
        value: function initSensitivityAnalysisDialog() {
            this.sensitivityAnalysisDialog = new _sensitivityAnalysisDialog.SensitivityAnalysisDialog(this);
        }
    }, {
        key: "isSensitivityAnalysisAvailable",
        value: function isSensitivityAnalysisAvailable() {
            return !this.isMultipleCriteria() && this.dataModel.getRoots().length === 1 && this.computationsManager.isValid() && this.dataModel.getGlobalVariableNames(true).length;
        }
    }, {
        key: "initToolbar",
        value: function initToolbar() {
            this.toolbar = new _toolbar.Toolbar(this.container.select('#sd-toolbar'), this);
        }
    }, {
        key: "initPayoffNumberFormat",
        value: function initPayoffNumberFormat() {

            this.payoffNumberFormat = [new Intl.NumberFormat(this.config.format.locales, this.config.format.payoff1), new Intl.NumberFormat(this.config.format.locales, this.config.format.payoff2)];
        }
    }, {
        key: "initProbabilityNumberFormat",
        value: function initProbabilityNumberFormat() {
            this.probabilityNumberFormat = new Intl.NumberFormat(this.config.format.locales, this.config.format.probability);
        }
    }, {
        key: "initTreeDesigner",
        value: function initTreeDesigner() {
            var self = this;
            var config = this.getTreeDesignerInitialConfig();
            var container2 = this.container.select('#tree-designer-container');

            this.treeDesigner = new _sdTreeDesigner.TreeDesigner(container2, this.dataModel, config);
        }
    }, {
        key: "getTreeDesignerInitialConfig",
        value: function getTreeDesignerInitialConfig() {
            var self = this;

            return _sdUtils.Utils.deepExtend({
                lng: self.config.lng,
                readOnly: self.config.readOnly,
                onNodeSelected: function onNodeSelected(node) {
                    self.onObjectSelected(node);
                },
                onEdgeSelected: function onEdgeSelected(edge) {
                    self.onObjectSelected(edge);
                },
                onTextSelected: function onTextSelected(text) {
                    self.onObjectSelected(text);
                },
                onSelectionCleared: function onSelectionCleared() {
                    self.onSelectionCleared();
                },
                payoffNumberFormatter: function payoffNumberFormatter(v, i) {
                    var prefix = '';
                    if (self.currentViewMode.multiCriteria) {
                        prefix = self.dataModel.payoffNames[i].charAt(0) + ': ';
                    }

                    return prefix + self.payoffNumberFormat[i || self.currentViewMode.payoffIndex || 0].format(v);
                },
                probabilityNumberFormatter: function probabilityNumberFormatter(v) {
                    return self.probabilityNumberFormat.format(v);
                },
                operationsForObject: function operationsForObject(o) {
                    return self.computationsManager.operationsForObject(o);
                }
            }, self.config.treeDesigner);
        }
    }, {
        key: "onObjectSelected",
        value: function onObjectSelected(object) {
            var self = this;
            if (this.selectedObject === object) {
                return;
            }
            this.selectedObject = object;
            setTimeout(function () {
                self.sidebar.updateObjectPropertiesView(self.selectedObject);
                self.updateVariableDefinitions();
                self.treeDesigner.updatePlottingRegionSize();
            }, 10);
        }
    }, {
        key: "onSelectionCleared",
        value: function onSelectionCleared() {
            var self = this;
            this.selectedObject = null;
            this.sidebar.hideObjectProperties();
            setTimeout(function () {
                self.updateVariableDefinitions();
                self.treeDesigner.updatePlottingRegionSize();
            }, 10);
            // console.log();
        }
    }, {
        key: "getCurrentVariableDefinitionsSourceObject",
        value: function getCurrentVariableDefinitionsSourceObject() {
            if (this.selectedObject) {
                if (this.selectedObject instanceof model.domain.Node) {
                    return this.selectedObject;
                }
                if (this.selectedObject instanceof model.domain.Edge) {
                    return this.selectedObject.parentNode;
                }
            }
            return this.dataModel;
        }
    }, {
        key: "updateVariableDefinitions",
        value: function updateVariableDefinitions() {
            var self = this;
            var definitionsSourceObject = self.getCurrentVariableDefinitionsSourceObject();
            var readOnly = this.selectedObject instanceof model.domain.Edge || this.selectedObject instanceof model.domain.TerminalNode;
            self.sidebar.updateDefinitions(definitionsSourceObject, readOnly, function (code) {
                self.dataModel.saveState();
                definitionsSourceObject.code = code;
                self.recompute(true, true);
            });
        }
    }, {
        key: "openDefinitionsDialog",
        value: function openDefinitionsDialog() {
            var _this4 = this;

            var definitionsSourceObject = this.getCurrentVariableDefinitionsSourceObject();
            this.definitionsDialog.open(definitionsSourceObject, function (code) {
                _this4.dataModel.saveState();
                definitionsSourceObject.code = code;
                _this4.recompute(true, true);
            });
        }
    }, {
        key: "updateView",
        value: function updateView() {
            var withTransitions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            // console.log('_updateView');
            this.treeDesigner.redraw(withTransitions);
            this.sidebar.updateObjectPropertiesView(this.selectedObject);
            this.updateVariableDefinitions();
            this.toolbar.update();
            this.sidebar.updateLayoutOptions();
            this.sidebar.updateDiagramDetails();
            this.sidebar.updateMultipleCriteria();
        }
    }, {
        key: "undo",
        value: function undo() {
            var self = this;
            self.dataModel.undo();
            if (self.selectedObject) {
                self.selectedObject = self.dataModel.findById(self.selectedObject.$id);
            }
            return this.checkValidityAndRecomputeObjective(false, false, false).then(function () {
                self.updateView();
            });
        }
    }, {
        key: "redo",
        value: function redo() {
            var self = this;
            self.dataModel.redo();
            if (self.selectedObject) {
                self.selectedObject = self.dataModel.findById(self.selectedObject.$id);
            }

            return this.checkValidityAndRecomputeObjective(false, false, false).then(function () {
                self.updateView();
            });
        }
    }, {
        key: "onNodeAddedOrRemoved",
        value: function onNodeAddedOrRemoved() {
            var self = this;
            return this.checkValidityAndRecomputeObjective().then(function () {
                self.updateView();
            });
        }
    }, {
        key: "onTextAdded",
        value: function onTextAdded(text) {
            return this.onObjectSelected(text);
        }
    }, {
        key: "onTextRemoved",
        value: function onTextRemoved(text) {
            this.updateView();
        }
    }, {
        key: "onObjectUpdated",
        value: function onObjectUpdated(object, fieldName) {
            var _this5 = this;

            var self = this;
            var p = Promise.resolve();
            if (!(object instanceof model.domain.Text) && fieldName !== 'name') {
                p = p.then(function () {
                    return _this5.checkValidityAndRecomputeObjective();
                });
            }
            // this.sidebar.updateObjectPropertiesView(this.selectedObject);
            return p.then(function () {
                setTimeout(function () {
                    self.treeDesigner.redraw(true);
                }, 1);
            });
        }
    }, {
        key: "onMultiCriteriaUpdated",
        value: function onMultiCriteriaUpdated(fieldName) {
            var _this6 = this;

            var self = this;
            var p = Promise.resolve();
            if (fieldName === 'defaultCriterion1Weight') {
                p = p.then(function () {
                    return _this6.checkValidityAndRecomputeObjective();
                });
            }
            this.sidebar.updateMultipleCriteria();

            return p.then(function () {
                setTimeout(function () {
                    self.treeDesigner.redraw(true);
                    self.sidebar.updateObjectPropertiesView(self.selectedObject);
                }, 1);
            });
        }
    }, {
        key: "setObjectiveRule",
        value: function setObjectiveRule(ruleName) {
            var evalCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var evalNumeric = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var _this7 = this;

            var updateView = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
            var recompute = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

            var prevRule = this.computationsManager.getCurrentRule();
            this.computationsManager.setCurrentRuleByName(ruleName);
            var currentRule = this.computationsManager.getCurrentRule();
            var multiCriteria = currentRule.multiCriteria;
            this.treeDesigner.config.maxPayoffsToDisplay = multiCriteria ? 2 : 1;

            if (multiCriteria) {
                this.payoffsMaximization = currentRule.payoffCoeffs.map(function (c) {
                    return c > 0;
                });

                if (!this.dataModel.payoffNames.length) {
                    this.dataModel.payoffNames.push(null, null);
                    this.dataModel.payoffNames[0] = _i18n.i18n.t('multipleCriteria.defaultMinimizedCriterionName');
                    this.dataModel.payoffNames[1] = _i18n.i18n.t('multipleCriteria.defaultMaximizedCriterionName');
                }
                this.treeDesigner.config.payoffNames = this.dataModel.payoffNames;
            } else {
                this.payoffsMaximization[this.currentViewMode.payoffIndex] = currentRule.maximization;
                this.treeDesigner.config.payoffNames = [null, null];
            }
            if (!recompute) {
                return Promise.resolve();
            }

            return this.checkValidityAndRecomputeObjective(false, evalCode, evalNumeric).then(function () {
                if (updateView) {
                    _this7.updateView(false);
                }
            });
        }
    }, {
        key: "isMultipleCriteria",
        value: function isMultipleCriteria() {
            return this.computationsManager.getCurrentRule().multiCriteria;
        }
    }, {
        key: "flipCriteria",
        value: function flipCriteria() {
            var _this8 = this;

            var tmp = this.config.format.payoff1;
            this.config.format.payoff1 = this.config.format.payoff2;
            this.config.format.payoff2 = tmp;
            this.initPayoffNumberFormat();

            this.computationsManager.flipCriteria().then(function () {
                _this8.updateView(false);
            }).catch(function (e) {
                _sdUtils.log.error(e);
            });
        }
    }, {
        key: "getCurrentObjectiveRule",
        value: function getCurrentObjectiveRule() {
            return this.computationsManager.getCurrentRule();
        }
    }, {
        key: "getObjectiveRules",
        value: function getObjectiveRules() {
            var _this9 = this;

            return this.computationsManager.getObjectiveRules().filter(function (rule) {
                return rule.multiCriteria === _this9.currentViewMode.multiCriteria;
            });
        }
    }, {
        key: "initViewModes",
        value: function initViewModes() {
            this.viewModes.push({
                name: "criterion1",
                multiCriteria: false,
                payoffIndex: 0
            });

            this.viewModes.push({
                name: "criterion2",
                multiCriteria: false,
                payoffIndex: 1
            });

            this.viewModes.push({
                name: "twoCriteria",
                multiCriteria: true,
                payoffIndex: null
            });
            this.currentViewMode = this.viewModes[0];
        }
    }, {
        key: "getCurrentViewMode",
        value: function getCurrentViewMode() {
            return this.currentViewMode;
        }
    }, {
        key: "setViewModeByName",
        value: function setViewModeByName(name) {
            var recompute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var updateView = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            return this.setViewMode(_sdUtils.Utils.find(this.viewModes, function (mode) {
                return mode.name === name;
            }), recompute, updateView);
        }
    }, {
        key: "setViewMode",
        value: function setViewMode(mode) {
            var _this10 = this;

            var recompute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var updateView = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var prevMode = this.currentViewMode;
            this.currentViewMode = mode;

            this.computationsManager.objectiveRulesManager.setPayoffIndex(this.currentViewMode.payoffIndex);

            if (!recompute) {
                return Promise.resolve();
            }
            var rules = this.getObjectiveRules();
            var prevRule = this.computationsManager.getCurrentRule();
            var newRule = rules[0];

            if (this.currentViewMode.payoffIndex !== null) {
                newRule = _sdUtils.Utils.find(rules, function (r) {
                    return r.maximization == _this10.payoffsMaximization[_this10.currentViewMode.payoffIndex];
                });
            } else {
                newRule = _sdUtils.Utils.find(rules, function (r) {
                    return r.payoffCoeffs.map(function (c) {
                        return c > 0;
                    }).every(function (max, i) {
                        return _this10.payoffsMaximization[i] === max;
                    });
                });
            }

            this.setObjectiveRule(newRule.name, false, false, updateView, recompute);
        }
    }, {
        key: "setDefaultViewModeForRule",
        value: function setDefaultViewModeForRule(rule) {
            var recompute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var updateView = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            return this.setViewMode(_sdUtils.Utils.find(this.viewModes, function (mode) {
                return mode.multiCriteria === rule.multiCriteria;
            }), recompute, updateView);
        }
    }, {
        key: "getViewModes",
        value: function getViewModes() {
            return this.viewModes;
        }
    }, {
        key: "showLeagueTable",
        value: function showLeagueTable() {
            this.leagueTableDialog.open();
        }
    }, {
        key: "openSensitivityAnalysis",
        value: function openSensitivityAnalysis() {
            var self = this;
            setTimeout(function () {
                if (!self.isSensitivityAnalysisAvailable()) {
                    return;
                }
                self.sensitivityAnalysisDialog.open();
            }, 200);
        }
    }, {
        key: "showTreePreview",
        value: function showTreePreview(dataDTO, closeCallback) {
            var autoLayout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var self = this;
            this.originalDataModelSnapshot = this.dataModel.createStateSnapshot();
            this.dataModel.loadFromDTO(dataDTO, this.computationsManager.expressionEngine.getJsonReviver());
            this.computationsManager.updateDisplayValues(this.dataModel);
            this.updateView(false);
            setTimeout(function () {
                self.updateView(false);
                setTimeout(function () {
                    var svgString = _exporter.Exporter.getSVGString(self.treeDesigner.svg.node());
                    _appUtils.AppUtils.showFullScreenPopup('', svgString, function () {
                        if (closeCallback) {
                            self.dataModel._setNewState(self.originalDataModelSnapshot);
                            self.updateView(false);

                            closeCallback();
                            setTimeout(function () {
                                self.updateView(false);
                            }, 1);
                        }
                    });
                }, 300);
            }, 1);
        }
    }, {
        key: "showPolicyPreview",
        value: function showPolicyPreview(title, policy, closeCallback) {
            var self = this;
            this.originalDataModelSnapshot = this.dataModel.createStateSnapshot();
            this.computationsManager.displayPolicy(policy);
            this.updateView(false);
            _appUtils.AppUtils.showFullScreenPopup(title, '');
            _loadingIndicator.LoadingIndicator.show();
            setTimeout(function () {
                self.updateView(false);
                setTimeout(function () {
                    var svgString = _exporter.Exporter.getSVGString(self.treeDesigner.svg.node(), true);
                    _loadingIndicator.LoadingIndicator.hide();
                    _appUtils.AppUtils.showFullScreenPopup(title, svgString, function () {

                        self.dataModel._setNewState(self.originalDataModelSnapshot);

                        // self.computationsManager.updateDisplayValues(self.dataModel);
                        self.updateView(false);
                        if (closeCallback) {
                            closeCallback();
                        }
                        setTimeout(function () {
                            self.updateView(false);
                        }, 1);
                    });
                }, 500);
            }, 1);
        }
    }, {
        key: "recompute",
        value: function recompute() {
            var updateView = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            var _this11 = this;

            var debounce = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var forceWhenAutoIsDisabled = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            if (debounce) {
                if (!this.debouncedRecompute) {
                    this.debouncedRecompute = _sdUtils.Utils.debounce(function (updateView) {
                        return _this11.recompute(updateView, false);
                    }, 200);
                }
                this.debouncedRecompute(updateView);
                return;
            }

            return this.checkValidityAndRecomputeObjective(false, true, true, forceWhenAutoIsDisabled).then(function () {
                if (updateView) {
                    _this11.updateView();
                }
            });
        }
    }, {
        key: "onRawOptionChanged",
        value: function onRawOptionChanged() {
            var _this12 = this;

            if (this.isAutoRecalculationEnabled()) {
                return this.checkValidityAndRecomputeObjective(false, false).then(function () {
                    _this12.updateView();
                });
            }
        }
    }, {
        key: "isAutoRecalculationEnabled",
        value: function isAutoRecalculationEnabled() {
            return !this.treeDesigner.config.raw;
        }
    }, {
        key: "checkValidityAndRecomputeObjective",
        value: function checkValidityAndRecomputeObjective(allRules) {
            var evalCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var _this13 = this;

            var evalNumeric = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var forceWhenAutoIsDisabled = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            if (!forceWhenAutoIsDisabled && !this.isAutoRecalculationEnabled()) {
                return Promise.resolve();
            }

            return this.computationsManager.checkValidityAndRecomputeObjective(allRules, evalCode, evalNumeric).then(function () {
                _this13.updateValidationMessages();
                _appUtils.AppUtils.dispatchEvent('SilverDecisionsRecomputedEvent', _this13);
            }).catch(function (e) {
                _sdUtils.log.error(e);
            });
        }
    }, {
        key: "updateValidationMessages",
        value: function updateValidationMessages() {
            var self = this;
            setTimeout(function () {
                self.treeDesigner.updateValidationMessages();
            }, 1);
        }
    }, {
        key: "newDiagram",
        value: function newDiagram() {
            this.clear();
            this.updateView();
        }
    }, {
        key: "clear",
        value: function clear() {
            this.dataModel.clear();
            this.currentViewMode = this.viewModes[0];
            this.computationsManager.setCurrentRuleByName(this.computationsManager.getObjectiveRules()[0].name);
            this.setDiagramTitle('', true);
            this.setDiagramDescription('', true);
            this.treeDesigner.setConfig(_sdUtils.Utils.deepExtend(this.getTreeDesignerInitialConfig()));
            this.onSelectionCleared();
            this.sensitivityAnalysisDialog.clear(true, true);
        }
    }, {
        key: "openDiagram",
        value: function openDiagram(diagramData) {
            var _this14 = this;

            var self = this;
            var errors = [];

            if (_sdUtils.Utils.isString(diagramData)) {
                try {
                    diagramData = JSON.parse(diagramData, self.computationsManager.expressionEngine.getJsonReviver());
                } catch (e) {
                    errors.push('error.jsonParse');
                    alert(_i18n.i18n.t('error.jsonParse'));
                    _sdUtils.log.error(e);
                    return Promise.resolve(errors);
                }
            }

            var dataModelObject = diagramData.data;

            this.clear();
            if (!diagramData.SilverDecisions) {
                errors.push('error.notSilverDecisionsFile');
                alert(_i18n.i18n.t('error.notSilverDecisionsFile'));
                return Promise.resolve(errors);
            }

            if (!_sdUtils.Utils.isValidVersionString(diagramData.SilverDecisions)) {
                errors.push('error.incorrectVersionFormat');
                alert(_i18n.i18n.t('error.incorrectVersionFormat'));
            } else {
                //Check if version in file is newer than version of application
                if (_sdUtils.Utils.compareVersionNumbers(diagramData.SilverDecisions, App.version) > 0) {
                    errors.push('error.fileVersionNewerThanApplicationVersion');
                    alert(_i18n.i18n.t('error.fileVersionNewerThanApplicationVersion'));
                }

                if (_sdUtils.Utils.compareVersionNumbers(diagramData.SilverDecisions, "0.7.0") < 0) {
                    dataModelObject = {
                        code: diagramData.code,
                        expressionScope: diagramData.expressionScope,
                        trees: diagramData.trees,
                        texts: diagramData.texts
                    };
                }
            }

            try {
                if (diagramData.lng) {
                    this.config.lng = diagramData.lng;
                }

                if (diagramData.rule) {
                    if (this.computationsManager.isRuleName(diagramData.rule)) {
                        this.config.rule = diagramData.rule;
                    } else {
                        delete this.config.rule;
                    }
                }

                if (diagramData.viewMode) {
                    this.setViewModeByName(diagramData.viewMode);
                } else {
                    this.setDefaultViewModeForRule(this.computationsManager.getObjectiveRuleByName(this.config.rule), false, false);
                }

                if (diagramData.format) {
                    this.config.format = diagramData.format;
                }

                this.setConfig(this.config);
                this.dataModel.load(dataModelObject);

                if (diagramData.treeDesigner) {
                    this.treeDesigner.setConfig(_sdUtils.Utils.deepExtend(self.getTreeDesignerInitialConfig(), diagramData.treeDesigner));
                }
                this.treeDesigner.updateVisibility();

                this.setDiagramTitle(diagramData.title || '', true);
                this.setDiagramDescription(diagramData.description || '', true);

                if (diagramData.sensitivityAnalysis) {
                    this.sensitivityAnalysisDialog.loadSavedParamValues(diagramData.sensitivityAnalysis);
                }
            } catch (e) {
                errors.push('error.malformedData');
                alert(_i18n.i18n.t('error.malformedData'));
                this.clear();
                _sdUtils.log.error('malformedData', e);
                return Promise.resolve(errors);
            }
            try {
                this.updateNumberFormats(false);
            } catch (e) {
                _sdUtils.log.error('incorrectNumberFormatOptions', e);
                errors.push('error.incorrectNumberFormatOptions');
                alert(_i18n.i18n.t('error.incorrectNumberFormatOptions'));
                delete this.config.format;
                this.setConfig(this.config);
                this.updateNumberFormats(false);
            }
            return this.setObjectiveRule(this.config.rule, false, true, false).catch(function (e) {
                _sdUtils.log.error('diagramDrawingFailure', e);
                errors.push('error.diagramDrawingFailure');
                alert(_i18n.i18n.t('error.diagramDrawingFailure'));
                _this14.clear();
                return errors;
            }).then(function () {
                _this14.updateView(false);
                return errors;
            }).catch(function (e) {
                _sdUtils.log.error('diagramDrawingFailure', e);
                errors.push('error.diagramDrawingFailure');
                alert(_i18n.i18n.t('error.diagramDrawingFailure'));
                _this14.clear();
                _this14.updateView(false);
                return errors;
            });
        }
    }, {
        key: "serialize",
        value: function serialize() {
            var filterLocation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var _this15 = this;

            var filterComputed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var filterPrivate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var self = this;
            return self.checkValidityAndRecomputeObjective(true, false, false, true).then(function () {
                var obj = {
                    SilverDecisions: App.version,
                    buildTimestamp: App.buildTimestamp,
                    savetime: d3.isoFormat(new Date()),
                    lng: self.config.lng,
                    viewMode: self.currentViewMode.name,
                    rule: self.computationsManager.getCurrentRule().name,
                    title: self.config.title,
                    description: self.config.description,
                    format: self.config.format,
                    treeDesigner: self.treeDesigner.config,
                    data: self.dataModel.serialize(false),
                    sensitivityAnalysis: _this15.sensitivityAnalysisDialog.jobNameToParamValues
                };

                return _sdUtils.Utils.stringify(obj, self.dataModel.getJsonReplacer(filterLocation, filterComputed, self.computationsManager.expressionEngine.getJsonReplacer(), filterPrivate), filterPrivate ? ['$'] : []);
            });
        }
    }, {
        key: "saveToFile",
        value: function saveToFile() {
            var filterLocation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var _this16 = this;

            var filterComputed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var filterPrivate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            this.serialize(filterLocation, filterComputed, filterPrivate).then(function (json) {
                _appUtils.AppUtils.dispatchEvent('SilverDecisionsSaveEvent', json);
                if (_this16.config.jsonFileDownload) {
                    var blob = new Blob([json], { type: "application/json" });
                    _exporter.Exporter.saveAs(blob, _exporter.Exporter.getExportFileName('json'));
                }
            });
        }
    }, {
        key: "updateNumberFormats",
        value: function updateNumberFormats() {
            var updateView = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.initPayoffNumberFormat();
            this.initProbabilityNumberFormat();
            if (updateView) {
                this.updateView();
            }
        }
    }, {
        key: "updatePayoffNumberFormat",
        value: function updatePayoffNumberFormat() {
            var updateView = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.initPayoffNumberFormat();
            if (updateView) {
                this.updateView();
            }
        }
    }, {
        key: "updateProbabilityNumberFormat",
        value: function updateProbabilityNumberFormat() {
            var updateView = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.initProbabilityNumberFormat();
            if (updateView) {
                this.updateView();
            }
        }
    }, {
        key: "initOnBeforeUnload",
        value: function initOnBeforeUnload() {
            var self = this;
            window.addEventListener("beforeunload", function (e) {
                if (!(self.dataModel.isUndoAvailable() || self.dataModel.isRedoAvailable())) {
                    return;
                }

                var dialogText = _i18n.i18n.t('confirm.beforeunload');
                e.returnValue = dialogText;
                return dialogText;
            });
        }
    }, {
        key: "setConfigParam",
        value: function setConfigParam(path, value, withoutStateSaving, callback) {
            var self = this;
            var prevValue = _sdUtils.Utils.get(this.config, path);

            if (prevValue == value) {
                return;
            }
            if (!withoutStateSaving) {
                this.dataModel.saveState({
                    data: {
                        prevValue: prevValue
                    },
                    onUndo: function onUndo(data) {
                        self.setConfigParam(path, data.prevValue, true, callback);
                    },
                    onRedo: function onRedo(data) {
                        self.setConfigParam(path, value, true, callback);
                    }
                });
            }
            _sdUtils.Utils.set(this.config, path, value);
            if (callback) {
                callback(value);
            }
        }
    }, {
        key: "setDiagramTitle",
        value: function setDiagramTitle(title, withoutStateSaving) {
            var _this17 = this;

            this.setConfigParam('title', title, withoutStateSaving, function (v) {
                return _this17.treeDesigner.updateDiagramTitle(v);
            });
        }
    }, {
        key: "setDiagramDescription",
        value: function setDiagramDescription(description, withoutStateSaving) {
            var _this18 = this;

            this.setConfigParam('description', description, withoutStateSaving, function (v) {
                return _this18.treeDesigner.updateDiagramDescription(v);
            });
        }
    }, {
        key: "initKeyCodes",
        value: function initKeyCodes() {
            var _this19 = this;

            this.container.on("keyup", function (d) {
                var srcElement = d3.event.target || d3.event.srcElement;

                if (srcElement && ['INPUT', 'TEXTAREA'].indexOf(srcElement.nodeName.toUpperCase()) > -1) {
                    //ignore events from input and textarea elements
                    return;
                }

                var key = d3.event.keyCode;
                if (key == 46) {
                    //delete
                    _this19.treeDesigner.removeSelectedNodes();
                    _this19.treeDesigner.removeSelectedTexts();
                    return;
                }
                if (!d3.event.ctrlKey) {
                    return;
                }

                if (d3.event.altKey) {
                    if (_this19.selectedObject instanceof model.domain.Node) {
                        var selectedNode = _this19.selectedObject;
                        if (selectedNode instanceof model.domain.TerminalNode) {
                            return;
                        }
                        if (key == 68) {
                            // ctrl + alt + d
                            _this19.treeDesigner.addDecisionNode(selectedNode);
                        } else if (key == 67) {
                            // ctrl + alt + c
                            _this19.treeDesigner.addChanceNode(selectedNode);
                        } else if (key == 84) {
                            // ctrl + alt + t
                            _this19.treeDesigner.addTerminalNode(selectedNode);
                        }
                        return;
                    } else if (_this19.selectedObject instanceof model.domain.Edge) {
                        if (key == 68) {
                            // ctrl + alt + d
                            _this19.treeDesigner.injectDecisionNode(_this19.selectedObject);
                        } else if (key == 67) {
                            // ctrl + alt + c
                            _this19.treeDesigner.injectChanceNode(_this19.selectedObject);
                        }
                    }
                }

                if (key == 90) {
                    //ctrl + z
                    _this19.undo();
                    return;
                }
                if (key == 89) {
                    //ctrl + y
                    _this19.redo();
                    return;
                }

                /*if(key==65){//ctrl + a
                 if(selectedNodes.length==1){
                 this.treeDesigner.selectSubTree(selectedNodes[0])
                 }else{
                 this.treeDesigner.selectAllNodes();
                 }
                 // d3.event.preventDefault()
                 return;
                 }*/
                var selectedNodes = _this19.treeDesigner.getSelectedNodes();
                if (key == 86) {
                    //ctrl + v
                    if (selectedNodes.length == 1) {
                        var _selectedNode = selectedNodes[0];
                        if (_selectedNode instanceof model.domain.TerminalNode) {
                            return;
                        }
                        _this19.treeDesigner.pasteToNode(_selectedNode);
                    } else if (selectedNodes.length == 0) {}
                    return;
                }

                if (!selectedNodes.length) {
                    return;
                }

                if (key == 88) {
                    //ctrl + x
                    _this19.treeDesigner.cutSelectedNodes();
                } else if (key == 67) {
                    //ctrl + c
                    _this19.treeDesigner.copySelectedNodes();
                }
            });
        }
    }], [{
        key: "growl",
        value: function growl() {
            return _appUtils.AppUtils.growl(arguments);
        }
    }]);

    return App;
}();

App.version = '';
App.buildTimestamp = buildConfig.buildTimestamp;
App.utils = _sdUtils.Utils;
App.appUtils = _appUtils.AppUtils;
App.d3 = d3;

},{"../tmp/build-config.js":155,"./app-utils":89,"./d3":92,"./dialogs/about-dialog":93,"./dialogs/definitions-dialog":94,"./dialogs/sensitivity-analysis-dialog":96,"./dialogs/settings-dialog":97,"./exporter":98,"./i18n/i18n":105,"./league-table/league-table-dialog":115,"./loading-indicator":118,"./sidebar":120,"./templates":121,"./toolbar":150,"sd-computations":"sd-computations","sd-model":"sd-model","sd-tree-designer":63,"sd-utils":"sd-utils"}],91:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Autocomplete = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _sdUtils = require("sd-utils");

var _appUtils = require("./app-utils");

var _d = require("./d3");

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var $ = require('jquery');
var global$ = _sdUtils.Utils.getGlobalObject().jQuery;
_sdUtils.Utils.getGlobalObject().jQuery = $; //FIXME
require('jquery-ui/ui/data');
require('jquery-ui/ui/widget');
require('jquery-ui/ui/widgets/mouse');
require('jquery-ui/ui/widgets/button');
require('jquery-ui/ui/widgets/menu');
require('jquery-ui/ui/unique-id');
require('jquery-ui/ui/position');
require('jquery-ui/ui/keycode');
require('jquery-ui/ui/safe-active-element');
require('jquery-ui/ui/widgets/autocomplete');
_sdUtils.Utils.getGlobalObject().jQuery = global$;

$(function () {
    $.widget("sd.combobox", {
        _create: function _create() {
            this.wrapper = $("<span>").addClass("sd-combobox").insertAfter(this.element);

            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
        },

        _createAutocomplete: function _createAutocomplete() {
            var selected = this.element.children(":selected"),
                value = selected.val() ? selected.text() : "";

            this.input = $("<input>").appendTo(this.wrapper).val(value).attr("title", "").attr("type", "text").addClass("sd-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left").autocomplete({
                delay: 0,
                minLength: 0,
                source: $.proxy(this, "_source"),
                classes: {
                    "ui-autocomplete": "sd-combobox-autocomplete"
                }
            });
            $("<span class='bar'>").appendTo(this.wrapper);

            var input = this.input;
            this._on(this.input, {
                autocompleteselect: function autocompleteselect(event, ui) {
                    ui.item.option.selected = true;
                    this._trigger("select", event, {
                        item: ui.item.option
                    });
                },

                autocompletechange: function autocompletechange() {
                    var inputD3 = d3.select($(input).get(0));
                    _appUtils.AppUtils.dispatchHtmlEvent(inputD3.node(), "change");
                }
            });
        },

        _createShowAllButton: function _createShowAllButton() {
            var input = this.input,
                wasOpen = false;

            $("<button>").attr("tabIndex", -1).attr("type", "button").html('<i class="material-icons">arrow_drop_down</i>').appendTo(this.wrapper).addClass("sd-combobox-toggle ui-corner-right").on("mousedown", function () {
                wasOpen = input.autocomplete("widget").is(":visible");
            }).on("click", function () {
                input.trigger("focus");
                // Close if already visible
                if (wasOpen) {
                    return;
                }

                // Pass empty string as value to search for, displaying all results
                input.autocomplete("search", "");
            });
        },

        _source: function _source(request, response) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
            response(this.element.children("option").map(function () {
                var text = $(this).text();
                if (this.value && (!request.term || matcher.test(text))) return {
                    label: text,
                    value: text,
                    option: this
                };
            }));
        },

        _destroy: function _destroy() {
            this.wrapper.remove();
            this.element.show();
        },

        input_element: function input_element() {
            return this.input;
        }
    });
});

var Autocomplete = exports.Autocomplete = function () {
    function Autocomplete(container) {
        _classCallCheck(this, Autocomplete);

        this.container = container;
        this.combobox = $(this.container.node()).combobox();
    }

    _createClass(Autocomplete, [{
        key: "getInput",
        value: function getInput() {
            return d3.select($(this.combobox).combobox('input_element').get(0));
        }
    }]);

    return Autocomplete;
}();

},{"./app-utils":89,"./d3":92,"jquery":"jquery","jquery-ui/ui/data":62,"jquery-ui/ui/keycode":"jquery-ui/ui/keycode","jquery-ui/ui/position":"jquery-ui/ui/position","jquery-ui/ui/safe-active-element":"jquery-ui/ui/safe-active-element","jquery-ui/ui/unique-id":"jquery-ui/ui/unique-id","jquery-ui/ui/widget":"jquery-ui/ui/widget","jquery-ui/ui/widgets/autocomplete":"jquery-ui/ui/widgets/autocomplete","jquery-ui/ui/widgets/button":"jquery-ui/ui/widgets/button","jquery-ui/ui/widgets/menu":"jquery-ui/ui/widgets/menu","jquery-ui/ui/widgets/mouse":"jquery-ui/ui/widgets/mouse","sd-utils":"sd-utils"}],92:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _d3Dispatch = require('d3-dispatch');

Object.keys(_d3Dispatch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Dispatch[key];
    }
  });
});

var _d3Scale = require('d3-scale');

Object.keys(_d3Scale).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Scale[key];
    }
  });
});

var _d3Selection = require('d3-selection');

Object.keys(_d3Selection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Selection[key];
    }
  });
});

var _d3Shape = require('d3-shape');

Object.keys(_d3Shape).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Shape[key];
    }
  });
});

var _d3Drag = require('d3-drag');

Object.keys(_d3Drag).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Drag[key];
    }
  });
});

var _d3Brush = require('d3-brush');

Object.keys(_d3Brush).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Brush[key];
    }
  });
});

var _d3Array = require('d3-array');

Object.keys(_d3Array).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Array[key];
    }
  });
});

var _d3Hierarchy = require('d3-hierarchy');

Object.keys(_d3Hierarchy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3Hierarchy[key];
    }
  });
});

var _d3TimeFormat = require('d3-time-format');

Object.keys(_d3TimeFormat).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _d3TimeFormat[key];
    }
  });
});

},{"d3-array":"d3-array","d3-brush":"d3-brush","d3-dispatch":"d3-dispatch","d3-drag":"d3-drag","d3-hierarchy":"d3-hierarchy","d3-scale":"d3-scale","d3-selection":"d3-selection","d3-shape":"d3-shape","d3-time-format":"d3-time-format"}],93:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AboutDialog = undefined;

var _dialog = require('./dialog');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var AboutDialog = exports.AboutDialog = function (_Dialog) {
    _inherits(AboutDialog, _Dialog);

    function AboutDialog(app) {
        _classCallCheck(this, AboutDialog);

        return _possibleConstructorReturn(this, (AboutDialog.__proto__ || Object.getPrototypeOf(AboutDialog)).call(this, app.container.select('#sd-about-dialog'), app));
    }

    return AboutDialog;
}(_dialog.Dialog);

},{"./dialog":95}],94:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DefinitionsDialog = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _d = require('../d3');

var d3 = _interopRequireWildcard(_d);

var _dialog = require('./dialog');

var _sdUtils = require('sd-utils');

var _appUtils = require('../app-utils');

var _templates = require('../templates');

var _sdModel = require('sd-model');

var _i18n = require('../i18n/i18n');

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var DefinitionsDialog = exports.DefinitionsDialog = function (_Dialog) {
    _inherits(DefinitionsDialog, _Dialog);

    function DefinitionsDialog(app) {
        _classCallCheck(this, DefinitionsDialog);

        var _this = _possibleConstructorReturn(this, (DefinitionsDialog.__proto__ || Object.getPrototypeOf(DefinitionsDialog)).call(this, app.container.select('#sd-definitions-dialog'), app));

        var self = _this;

        _this.definitionsScopeLabel = _this.container.select(".sd-definitions-dialog-scope-label");

        _this.definitionsCode = _this.container.select('textarea#sd-definitions-dialog-definitions-code').on('input', function () {
            _appUtils.AppUtils.updateInputClass(d3.select(this));
        });

        _this.definitionsCode = _this.container.select('textarea#sd-definitions-dialog-definitions-code').on('change', function () {
            if (self.changeCallback) {
                self.changeCallback(this.value);
            }
        });

        _this.recalculateButton = _this.container.select('button#sd-definitions-dialog-recalculate-button').on('click', function () {
            self.app.recompute();
        });

        _this.variableValuesContainer = _this.container.select("#sd-definitions-dialog-variable-values");
        _appUtils.AppUtils.elasticTextarea(_this.definitionsCode);

        document.addEventListener('SilverDecisionsRecomputedEvent', function (data) {
            if (data.detail === app && self.isVisible()) {
                self.update();
            }
        });
        return _this;
    }

    _createClass(DefinitionsDialog, [{
        key: 'open',
        value: function open(definitionsSourceObject, changeCallback) {
            _get(DefinitionsDialog.prototype.__proto__ || Object.getPrototypeOf(DefinitionsDialog.prototype), 'open', this).call(this);
            this.changeCallback = changeCallback;
            this.definitionsSourceObject = definitionsSourceObject;
            this.update();
        }
    }, {
        key: 'update',
        value: function update() {
            var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!force && !this.isVisible()) {
                return;
            }

            var scopeType = 'global';
            var labelSuffix = "";
            if (this.definitionsSourceObject instanceof _sdModel.domain.Node) {
                scopeType = 'node';
                var name = this.definitionsSourceObject.name;
                if (name) {
                    labelSuffix += " (" + name + ")";
                }
            }
            this.definitionsScopeLabel.text(_i18n.i18n.t("definitionsDialog.scope." + scopeType) + labelSuffix);

            this.definitionsCode.node().value = this.definitionsSourceObject.code;
            _appUtils.AppUtils.updateInputClass(this.definitionsCode);
            _appUtils.AppUtils.autoResizeTextarea(this.definitionsCode.node());
            this.definitionsCode.classed('invalid', !!this.definitionsSourceObject.$codeError);
            if (this.definitionsSourceObject.$codeError) {
                this.printError(this.definitionsSourceObject.$codeError);
            } else {
                this.printVariables(this.definitionsSourceObject.expressionScope);
            }
        }
    }, {
        key: 'printError',
        value: function printError(error) {
            var html = error;
            this.variableValuesContainer.html(html);
        }
    }, {
        key: 'printVariables',
        value: function printVariables(scope) {
            var html = _templates.Templates.get('evaluatedVariables', { scopeVariables: _sdUtils.Utils.getVariablesAsList(scope) });
            this.variableValuesContainer.html(html);
        }
    }]);

    return DefinitionsDialog;
}(_dialog.Dialog);

},{"../app-utils":89,"../d3":92,"../i18n/i18n":105,"../templates":121,"./dialog":95,"sd-model":"sd-model","sd-utils":"sd-utils"}],95:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Dialog = exports.Dialog = function () {
    function Dialog(container, app) {
        var _this = this;

        _classCallCheck(this, Dialog);

        this.app = app;
        this.container = container;
        this.container.select('.sd-close-modal').on('click', function () {
            return _this.close();
        });
        this.container.select('.sd-extend-modal').on('click', function () {
            return _this.extend();
        });
        this.container.select('.sd-shrink-modal').on('click', function () {
            return _this.shrink();
        });
    }

    _createClass(Dialog, [{
        key: 'open',
        value: function open() {
            this.onOpen();
            this.container.classed('open', true);
        }
    }, {
        key: 'close',
        value: function close() {
            this.container.classed('open', false);
            this.onClosed();
        }
    }, {
        key: 'setFullScreen',
        value: function setFullScreen() {
            var fullScreen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            var self = this;
            this.container.classed('sd-full-screen', fullScreen);
            setTimeout(function () {
                self.onResized();
            }, 10);
        }
    }, {
        key: 'extend',
        value: function extend() {
            this.setFullScreen();
        }
    }, {
        key: 'shrink',
        value: function shrink() {
            this.setFullScreen(false);
        }
    }, {
        key: 'isVisible',
        value: function isVisible() {
            return this.container.classed('open');
        }
    }, {
        key: 'onClosed',
        value: function onClosed() {}
    }, {
        key: 'onOpen',
        value: function onOpen() {}
    }, {
        key: 'onResized',
        value: function onResized() {}
    }]);

    return Dialog;
}();

},{}],96:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SensitivityAnalysisDialog = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _dialog = require("./dialog");

var _jobParametersBuilder = require("../jobs/job-parameters-builder");

var _sdUtils = require("sd-utils");

var _templates = require("../templates");

var _i18n = require("../i18n/i18n");

var _appUtils = require("../app-utils");

var _sdTreeDesigner = require("sd-tree-designer");

var _loadingIndicator = require("../loading-indicator");

var _exporter = require("../exporter");

var _sensitivityAnalysisResultTable = require("../jobs/sensitivity-analysis-result-table");

var _probabilisticSensitivityAnalysisResultTable = require("../jobs/probabilistic-sensitivity-analysis-result-table");

var _policy = require("sd-computations/src/policies/policy");

var _tornadoDiagramPlot = require("../jobs/tornado-diagram-plot");

var _spiderPlot = require("../jobs/spider-plot");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var SensitivityAnalysisDialog = exports.SensitivityAnalysisDialog = function (_Dialog) {
    _inherits(SensitivityAnalysisDialog, _Dialog);

    function SensitivityAnalysisDialog(app) {
        _classCallCheck(this, SensitivityAnalysisDialog);

        var _this = _possibleConstructorReturn(this, (SensitivityAnalysisDialog.__proto__ || Object.getPrototypeOf(SensitivityAnalysisDialog)).call(this, app.container.select('.sd-sensitivity-analysis-dialog'), app));

        _this.jobConfigurations = [];
        _this.jobNameToParamValues = {};

        _this.computationsManager = _this.app.computationsManager;
        // this.initJobConfigurations();

        _this.jobConfigurationContainer = _this.container.select(".sd-sensitivity-analysis-job-configuration");
        _this.parameterBuilderContainer = _this.jobConfigurationContainer.select(".sd-job-parameters-builder");
        _this.jobParametersBuilder = new _jobParametersBuilder.JobParametersBuilder(_this.parameterBuilderContainer, 'job', function () {
            return _this.onJobParametersChanged();
        });
        _this.progressBarContainer = _this.container.select(".sd-job-progress-bar-container");
        _this.progressBar = _this.progressBarContainer.select(".sd-progress-bar");
        _this.jobResultsContainer = _this.container.select(".sd-sensitivity-analysis-job-results");
        _this.jobResultPlotContainer = _this.jobResultsContainer.select(".sd-job-result-plot-container");

        _this.debouncedCheckWarnings = _sdUtils.Utils.debounce(function () {
            return _this.checkWarnings();
        }, 200);

        _this.initButtons();
        var self = _this;
        document.addEventListener('SilverDecisionsRecomputedEvent', function (data) {
            if (data.detail === app && self.isVisible()) {
                self.onOpen();
            }
        });
        return _this;
    }

    _createClass(SensitivityAnalysisDialog, [{
        key: "onOpen",
        value: function onOpen() {

            this.initJobConfigurations();
            if (!this.jobSelect) {
                this.initJobSelect();
            }

            var payoffConf = _sdUtils.Utils.cloneDeep(this.app.config.format.payoff1);
            payoffConf.style = 'decimal';
            payoffConf.useGrouping = false;
            this.payoffNumberFormat = new Intl.NumberFormat('en', payoffConf);
            // this.payoffNumberFormat = {
            //     format: v => this.app.computationsManager.expressionEngine.constructor.toFloat(v, payoffConf.maximumFractionDigits)
            // }

            this.clear();
        }
    }, {
        key: "onClosed",
        value: function onClosed() {
            this.clear();
            if (!this.jobInstanceManager) {
                return;
            }
            this.jobInstanceManager.terminate();
        }
    }, {
        key: "onJobSelected",
        value: function onJobSelected(jobConfig) {

            this.clearWarnings();
            this.selectedJobConfig = jobConfig;
            if (!jobConfig) {
                return;
            }
            this.jobSelect.node().value = jobConfig.jobName;
            var jobName = this.selectedJobConfig.jobName;
            this.job = this.computationsManager.getJobByName(jobName);

            var jobParamsValues = this.jobNameToParamValues[jobName] || {};

            this.setJobParamsValues(jobParamsValues);
        }
    }, {
        key: "refreshSelectedJobConfig",
        value: function refreshSelectedJobConfig() {
            var _this2 = this;

            if (this.selectedJobConfig) {
                this.selectedJobConfig = _sdUtils.Utils.find(this.jobConfigurations, function (c) {
                    return c.jobName === _this2.selectedJobConfig.jobName;
                });
            }
        }
    }, {
        key: "setJobParamsValues",
        value: function setJobParamsValues(jobParamsValues) {
            var deleteId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (!this.job) {
                return;
            }
            this.refreshSelectedJobConfig();

            if (deleteId) {
                delete jobParamsValues.id;
            }
            this.jobParameters = this.job.createJobParameters(jobParamsValues);

            this.jobNameToParamValues[this.job.name] = this.jobParameters.values;

            this.jobParametersBuilder.setJobParameters(this.job.name, this.jobParameters, this.selectedJobConfig.customParamsConfig);
        }
    }, {
        key: "onJobParametersChanged",
        value: function onJobParametersChanged() {
            this.debouncedCheckWarnings();
        }
    }, {
        key: "getGlobalVariableNames",
        value: function getGlobalVariableNames() {
            return this.app.dataModel.getGlobalVariableNames(true);
        }
    }, {
        key: "initJobConfigurations",
        value: function initJobConfigurations() {
            var _this3 = this;

            var self = this;
            this.jobConfigurations.length = 0;
            var ExpressionEngine = this.app.expressionEngine.constructor;
            var customVariablesValidator = function customVariablesValidator(values) {
                var isValidArray = [];

                var names = [];
                values.forEach(function (v, i) {
                    var isVariableInGlobalScope = self.app.dataModel.expressionScope.hasOwnProperty(v.name);
                    var valid = names.indexOf(v.name) < 0 && isVariableInGlobalScope;
                    names.push(v.name);
                    isValidArray.push(valid);
                });

                return isValidArray;
            };

            var largeScenariosNumberWarning = {
                name: 'largeScenariosNumber',
                data: {
                    number: 10000,
                    numberFormatted: "10,000"
                },
                check: function check(jobParameters) {
                    // called with this set to warning config object
                    var combinations = jobParameters.values.variables.map(function (v) {
                        return v.length;
                    }).reduce(function (a, b) {
                        return a * (b || 1);
                    }, 1);
                    return combinations > this.data.number;
                }
            };
            this.jobConfigurations.push({
                jobName: 'sensitivity-analysis',
                customParamsConfig: {
                    'id': {
                        // value: undefined, //leave default,
                        hidden: true
                    },
                    'failOnInvalidTree': {
                        value: true,
                        hidden: true
                    },
                    'ruleName': {
                        value: this.computationsManager.getCurrentRule().name,
                        hidden: true
                    },
                    variables: {
                        name: {
                            options: this.getGlobalVariableNames()
                        },
                        _derivedValues: [{
                            name: "step",
                            value: function value(variable) {
                                if (variable.max === undefined || variable.max === null) {
                                    return "";
                                }
                                if (variable.min === undefined || variable.min === null) {
                                    return "";
                                }
                                if (variable.length === undefined || variable.length === null || variable.length < 2) {
                                    return "";
                                }
                                if (variable.min > variable.max) {
                                    return "";
                                }

                                try {
                                    return ExpressionEngine.toFloat(ExpressionEngine.divide(ExpressionEngine.subtract(variable.max, variable.min), variable.length - 1));
                                } catch (e) {
                                    return "";
                                }
                            }
                        }],
                        customValidator: customVariablesValidator

                    }
                },
                warnings: [largeScenariosNumberWarning, {
                    name: 'largeParametersNumber',
                    data: {
                        number: 2
                    },
                    check: function check(jobParameters) {
                        // called with this set to warning config object
                        return jobParameters.values.variables.length > this.data.number;
                    }
                }]
            });

            this.jobConfigurations.push({
                jobName: 'tornado-diagram',
                customParamsConfig: {
                    'id': {
                        // value: undefined, //leave default,
                        hidden: true
                    },
                    'failOnInvalidTree': {
                        value: true,
                        hidden: true
                    },
                    'ruleName': {
                        value: this.computationsManager.getCurrentRule().name,
                        hidden: true
                    },
                    variables: {
                        name: {
                            options: this.getGlobalVariableNames()
                        },
                        _derivedValues: [{
                            name: "defaultValue",
                            value: function value(variable) {
                                if (!variable.name) {
                                    return "";
                                }

                                try {
                                    return ExpressionEngine.toFloat(_this3.app.dataModel.expressionScope[variable.name]);
                                } catch (e) {
                                    return "";
                                }
                            }
                        }, {
                            name: "step",
                            value: function value(variable) {
                                if (variable.max === undefined || variable.max === null) {
                                    return "";
                                }
                                if (variable.min === undefined || variable.min === null) {
                                    return "";
                                }
                                if (variable.length === undefined || variable.length === null || variable.length < 2) {
                                    return "";
                                }
                                if (variable.min > variable.max) {
                                    return "";
                                }

                                try {
                                    return ExpressionEngine.toFloat(ExpressionEngine.divide(ExpressionEngine.subtract(variable.max, variable.min), variable.length - 1));
                                } catch (e) {
                                    return "";
                                }
                            }
                        }],
                        customValidator: function customValidator(values) {
                            var isValidNameArray = customVariablesValidator(values);

                            return values.map(function (v, i) {
                                if (!isValidNameArray[i]) {
                                    return false;
                                }

                                if (!v.name || v.min === undefined || v.min === null || v.max === undefined || v.max === null) {
                                    return false;
                                }

                                var defVal = self.app.dataModel.expressionScope[v.name];
                                return v.min < defVal && v.max > defVal;
                            });
                        }

                    }
                },
                warnings: [{
                    name: 'largeScenariosNumber',
                    data: {
                        number: 10000,
                        numberFormatted: "10,000"
                    },
                    check: function check(jobParameters) {
                        // called with this set to warning config object
                        var combinations = jobParameters.values.variables.map(function (v) {
                            return v.length;
                        }).reduce(function (a, b) {
                            return a + b;
                        }, 0);
                        return combinations > this.data.number;
                    }
                }]
            });

            this.jobConfigurations.push({
                jobName: 'probabilistic-sensitivity-analysis',
                customParamsConfig: {
                    'id': {
                        hidden: true
                    },
                    'failOnInvalidTree': {
                        value: true,
                        hidden: true
                    },
                    'ruleName': {
                        value: this.computationsManager.getCurrentRule().name,
                        hidden: true
                    },
                    variables: {
                        name: {
                            options: this.getGlobalVariableNames()
                        },
                        formula: {
                            options: ExpressionEngine.randomMenuList,
                            optionsAutocomplete: true
                        },
                        customValidator: customVariablesValidator
                    }
                },
                warnings: [largeScenariosNumberWarning]
            });

            this.jobConfigurations.push({
                jobName: 'spider-plot',
                customParamsConfig: {
                    'id': {
                        // value: undefined, //leave default,
                        hidden: true
                    },
                    'failOnInvalidTree': {
                        value: true,
                        hidden: true
                    },
                    'ruleName': {
                        value: this.computationsManager.getCurrentRule().name,
                        hidden: true
                    },
                    variables: {
                        name: {
                            options: this.getGlobalVariableNames()
                        },
                        _derivedValues: [{
                            name: "defaultValue",
                            value: function value(variable) {
                                if (!variable.name) {
                                    return "";
                                }

                                try {
                                    return ExpressionEngine.toFloat(_this3.app.dataModel.expressionScope[variable.name]);
                                } catch (e) {
                                    return "";
                                }
                            }
                        }],
                        customValidator: customVariablesValidator
                    }
                },
                warnings: [{
                    name: 'largeScenariosNumber',
                    data: {
                        number: 10000,
                        numberFormatted: "10,000"
                    },
                    check: function check(jobParameters) {
                        // called with this set to warning config object
                        var combinations = jobParameters.values.length * jobParameters.values.variables.length;
                        return combinations > this.data.number;
                    }
                }]
            });
        }
    }, {
        key: "checkWarnings",
        value: function checkWarnings() {
            var _this4 = this;

            this.clearWarnings();
            if (!this.selectedJobConfig.warnings) {
                return;
            }

            this.selectedJobConfig.warnings.forEach(function (warnConf) {
                if (warnConf.check.call(warnConf, _this4.jobParameters)) {
                    _this4.addWarning(warnConf);
                }
            });
        }
    }, {
        key: "clearWarnings",
        value: function clearWarnings() {
            this.container.select(".sd-sensitivity-analysis-warnings").selectAll("*").remove();
        }
    }, {
        key: "addWarning",
        value: function addWarning(warnConf) {
            var msg = _i18n.i18n.t("job." + this.job.name + ".warnings." + warnConf.name, warnConf.data);

            var msgHTML = _templates.Templates.get("warningMessage", {
                message: msg
            });
            this.container.select(".sd-sensitivity-analysis-warnings").appendSelector("div.sd-sensitivity-analysis-warning").html(msgHTML);
        }
    }, {
        key: "initJobSelect",
        value: function initJobSelect() {
            var self = this;
            this.jobSelect = this.container.select(".sd-job-select-input-group").html(_templates.Templates.get("selectInputGroup", {
                id: _sdUtils.Utils.guid(),
                label: null,
                name: "sd-job-select",
                options: this.jobConfigurations.map(function (c) {
                    return {
                        label: _i18n.i18n.t("job." + c.jobName + ".name"),
                        value: c.jobName
                    };
                })
            })).select("select").on('change input', function (d) {
                var _this5 = this;

                self.onJobSelected(_sdUtils.Utils.find(self.jobConfigurations, function (c) {
                    return c.jobName === _this5.value;
                }));
            });
        }
    }, {
        key: "initResultTable",
        value: function initResultTable(result) {
            var _this6 = this;

            var config = {
                onRowSelected: function onRowSelected(rows, indexes, e) {
                    return _this6.onResultRowSelected(rows, indexes, e);
                },
                className: "sd-" + this.job.name
            };
            if (this.resultTable) {
                this.resultTable.clear();
                this.resultTable.setClassName("sd-" + this.job.name);
                this.resultTable.hide();
            }

            if (this.job.name == "sensitivity-analysis") {
                this.resultTable = new _sensitivityAnalysisResultTable.SensitivityAnalysisJobResultTable(this.jobResultsContainer.select(".sd-job-result-table-container"), config);
                this.resultTable.setData(result, this.jobParameters, this.job);
                this.resultTable.show();
            } else if (this.job.name == "probabilistic-sensitivity-analysis") {
                this.resultTable = new _probabilisticSensitivityAnalysisResultTable.ProbabilisticSensitivityAnalysisJobResultTable(this.jobResultsContainer.select(".sd-job-result-table-container"), config, function (v) {
                    return _this6.payoffNumberFormat.format(v);
                }, function (v) {
                    return _this6.app.probabilityNumberFormat.format(v);
                });
                this.resultTable.setData(result, this.jobParameters, this.job);
                this.resultTable.show();
            }
        }
    }, {
        key: "disableActionButtonsAndShowLoadingIndicator",
        value: function disableActionButtonsAndShowLoadingIndicator() {
            var disable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            if (disable) {
                _loadingIndicator.LoadingIndicator.show();
            } else {
                _loadingIndicator.LoadingIndicator.hide();
            }
            this.container.select('.sd-sensitivity-analysis-action-buttons').selectAll('button').attr('disabled', disable ? 'disabled' : undefined);
        }
    }, {
        key: "initButtons",
        value: function initButtons() {
            var _this7 = this;

            this.runJobButton = this.container.select(".sd-run-job-button").on('click', function () {
                if (!_this7.jobParametersBuilder.validate()) {
                    return;
                }
                _this7.disableActionButtonsAndShowLoadingIndicator();
                _this7.checkWarnings();

                _this7.computationsManager.runJobWithInstanceManager(_this7.job.name, _this7.jobParameters.values, {
                    onJobStarted: _this7.onJobStarted,
                    onJobCompleted: _this7.onJobCompleted,
                    onJobFailed: _this7.onJobFailed,
                    onJobStopped: _this7.onJobStopped,
                    onJobTerminated: _this7.onJobTerminated,
                    onProgress: _this7.onProgress,
                    callbacksThisArg: _this7
                }).then(function (jobInstanceManager) {
                    _this7.jobInstanceManager = jobInstanceManager;
                }).catch(function (e) {
                    _sdUtils.log.error(e);
                }).then(function () {
                    _this7.disableActionButtonsAndShowLoadingIndicator(false);
                });
            });

            this.resumeJobButton = this.container.select(".sd-resume-job-button").on('click', function () {
                if (!_this7.jobInstanceManager) {
                    return;
                }
                _this7.disableActionButtonsAndShowLoadingIndicator();
                _this7.jobInstanceManager.resume();
            });

            this.stopJobButton = this.container.select(".sd-stop-job-button").on('click', function () {
                if (!_this7.jobInstanceManager) {
                    return;
                }
                _this7.disableActionButtonsAndShowLoadingIndicator();
                _this7.jobInstanceManager.stop();
            });

            this.terminateJobButton = this.container.select(".sd-terminate-job-button").on('click', function () {
                if (!_this7.jobInstanceManager) {
                    return;
                }
                _this7.terminateJob();
            });

            this.backButton = this.container.select(".sd-back-button ").on('click', function () {
                if (_this7.jobInstanceManager) {
                    _this7.jobInstanceManager.terminate();
                }
            });

            this.downloadCsvButtons = this.container.select(".sd-download-csv-button ").on('click', function () {
                _this7.downloadCSV();
            });

            this.clearButton = this.container.select(".sd-clear-button ").on('click', function () {
                _this7.clear(true);
            });
        }
    }, {
        key: "loadSavedParamValues",
        value: function loadSavedParamValues(jobNameToParamValues) {
            this.jobNameToParamValues = jobNameToParamValues;
            this.selectedJobConfig = null;
            this.jobParameters = null;
        }
    }, {
        key: "clear",
        value: function clear() {
            var _this8 = this;

            var clearParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var clearAllParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.clearResults();
            this.clearWarnings();
            this.setProgress(0);
            this.markAsError(false);

            if (!this.selectedJobConfig) {
                this.onJobSelected(this.jobConfigurations[0]);
            }

            if (clearAllParams) {
                _sdUtils.Utils.forOwn(this.jobNameToParamValues, function (value, key) {
                    return _this8.jobNameToParamValues[key] = {};
                });
            }

            var globalVariableNames = this.getGlobalVariableNames();
            _sdUtils.Utils.forOwn(this.jobNameToParamValues, function (value, key) {
                var paramValues = value;
                if (clearAllParams) {
                    paramValues = {};
                } else if (paramValues.variables) {
                    paramValues.variables = paramValues.variables.filter(function (v) {
                        return globalVariableNames.indexOf(v.name) !== -1;
                    });
                    if (!paramValues.variables.length) {
                        paramValues.variables.push({});
                    }
                }

                _this8.jobNameToParamValues[key] = paramValues;
            });

            if (this.job) {
                if (clearParams) {
                    this.jobNameToParamValues[this.job.name] = {};
                    this.setJobParamsValues({});
                } else {
                    this.jobParameters.values.ruleName = this.computationsManager.getCurrentRule().name;
                    this.setJobParamsValues(this.jobParameters.values);
                }
            }

            _appUtils.AppUtils.show(this.jobConfigurationContainer);
            _appUtils.AppUtils.show(this.runJobButton);
            _appUtils.AppUtils.show(this.clearButton);

            _appUtils.AppUtils.hide(this.resumeJobButton);
            _appUtils.AppUtils.hide(this.progressBarContainer);
            _appUtils.AppUtils.hide(this.stopJobButton);
            _appUtils.AppUtils.hide(this.downloadCsvButtons);
            _appUtils.AppUtils.hide(this.terminateJobButton);
            _appUtils.AppUtils.hide(this.jobResultsContainer);
            _appUtils.AppUtils.hide(this.backButton);
            this.disableActionButtonsAndShowLoadingIndicator(false);
        }
    }, {
        key: "clearResults",
        value: function clearResults() {
            if (this.resultTable) {
                this.resultTable.clear();
                this.resultTable.hide();
            }
            if (this.resultPlots) {
                this.resultPlots.forEach(function (p) {
                    return p.destroy();
                });
                this.jobResultPlotContainer.selectAll("*").remove();
            }
        }
    }, {
        key: "onJobStarted",
        value: function onJobStarted() {
            _appUtils.AppUtils.hide(this.jobConfigurationContainer);
            _appUtils.AppUtils.hide(this.runJobButton);
            _appUtils.AppUtils.hide(this.resumeJobButton);
            _appUtils.AppUtils.hide(this.backButton);
            _appUtils.AppUtils.hide(this.clearButton);
            _appUtils.AppUtils.hide(this.downloadCsvButtons);

            _appUtils.AppUtils.show(this.progressBarContainer);
            _appUtils.AppUtils.show(this.stopJobButton);
            _appUtils.AppUtils.show(this.terminateJobButton);

            this.disableActionButtonsAndShowLoadingIndicator(false);
            this.onProgress(this.jobInstanceManager ? this.jobInstanceManager.progress : null);
        }
    }, {
        key: "onJobCompleted",
        value: function onJobCompleted(result) {
            _appUtils.AppUtils.show(this.jobResultsContainer);
            _appUtils.AppUtils.show(this.backButton);
            _appUtils.AppUtils.show(this.downloadCsvButtons);

            _appUtils.AppUtils.hide(this.progressBarContainer);
            _appUtils.AppUtils.hide(this.stopJobButton);
            _appUtils.AppUtils.hide(this.terminateJobButton);
            _appUtils.AppUtils.hide(this.clearButton);

            this.disableActionButtonsAndShowLoadingIndicator(false);
            this.displayResult(result);
        }
    }, {
        key: "displayResult",
        value: function displayResult(result) {
            _sdUtils.log.debug(result);
            this.result = result;
            this.initResultTable(result);

            this.initResultPlots(result);
        }
    }, {
        key: "initResultPlots",
        value: function initResultPlots(result) {

            if (this.job.name === "tornado-diagram") {
                this.initTornadoResultPlots(result);
            } else if (this.job.name === "spider-plot") {
                this.initSpiderResultPlots(result);
            }
        }
    }, {
        key: "initTornadoResultPlots",
        value: function initTornadoResultPlots(result) {
            var _this9 = this;

            var self = this;
            this.resultPlots = [];

            result.policies.forEach(function (policy, index) {

                var container = _this9.jobResultPlotContainer.selectOrAppend("div.sd-result-plot-container-" + index);
                var config = {
                    policyIndex: index,
                    maxWidth: self.app.config.leagueTable.plot.maxWidth
                };

                var resultPlot = new _tornadoDiagramPlot.TornadoDiagramPlot(container.node(), result, config);
                _this9.resultPlots.push(resultPlot);

                setTimeout(function () {
                    resultPlot.init();
                }, 100);
            });
        }
    }, {
        key: "initSpiderResultPlots",
        value: function initSpiderResultPlots(result) {
            var _this10 = this;

            var self = this;
            this.resultPlots = [];

            result.policies.forEach(function (policy, index) {

                var container = _this10.jobResultPlotContainer.selectOrAppend("div.sd-result-plot-container-" + index);
                var config = {
                    policyIndex: index,
                    maxWidth: self.app.config.leagueTable.plot.maxWidth
                };

                var resultPlot = new _spiderPlot.SpiderPlot(container.node(), result, config);
                _this10.resultPlots.push(resultPlot);

                setTimeout(function () {
                    resultPlot.init();
                }, 100);
            });
        }
    }, {
        key: "onResized",
        value: function onResized() {
            if (this.resultPlots) {
                this.resultPlots.forEach(function (p) {
                    return p.init();
                });
            }
        }
    }, {
        key: "terminateJob",
        value: function terminateJob() {
            this.disableActionButtonsAndShowLoadingIndicator();
            this.jobInstanceManager.terminate();
        }
    }, {
        key: "onJobFailed",
        value: function onJobFailed(errors) {
            _appUtils.AppUtils.hide(this.stopJobButton);
            _appUtils.AppUtils.hide(this.backButton);
            _appUtils.AppUtils.hide(this.downloadCsvButtons);
            _appUtils.AppUtils.hide(this.clearButton);
            this.disableActionButtonsAndShowLoadingIndicator(false);
            this.markAsError();
            var self = this;
            setTimeout(function () {
                var errorMessage = "";
                errors.forEach(function (e, i) {
                    if (i) {
                        errorMessage += "\n\n";
                    }

                    var msgKeyBase = "job." + self.job.name + ".errors.";
                    var msgKey = msgKeyBase + e.message;
                    var msg = _i18n.i18n.t(msgKey, e.data);
                    if (msg === msgKey) {
                        msg = _i18n.i18n.t("job.errors.generic", e);
                    }

                    errorMessage += msg;
                    if (e.data && e.data.variables) {
                        _sdUtils.Utils.forOwn(e.data.variables, function (value, key) {
                            errorMessage += "\n";
                            errorMessage += key + " = " + value;
                        });
                    }
                });

                alert(errorMessage);
                self.terminateJob();
            }, 10);
        }
    }, {
        key: "markAsError",
        value: function markAsError() {
            var error = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.container.classed('sd-job-error', error);
        }
    }, {
        key: "onJobStopped",
        value: function onJobStopped() {
            _appUtils.AppUtils.hide(this.stopJobButton);
            _appUtils.AppUtils.show(this.resumeJobButton);
            this.disableActionButtonsAndShowLoadingIndicator(false);
        }
    }, {
        key: "onJobTerminated",
        value: function onJobTerminated() {
            this.clear();
        }
    }, {
        key: "onProgress",
        value: function onProgress(progress) {
            this.setProgress(progress);
        }
    }, {
        key: "setProgress",
        value: function setProgress(progress) {
            var percents = 0;
            var value = "0%";
            if (progress) {
                value = progress.current + " / " + progress.total;
                percents = progress.current * 100 / progress.total;
            }

            this.progressBar.style("width", percents + "%");
            this.progressBar.html(value);
        }
    }, {
        key: "onResultRowSelected",
        value: function onResultRowSelected(rows, indexes, event) {
            var _this11 = this;

            if (!rows.length) {
                return;
            }

            var policyIndexes = rows.map(function (r) {
                return r.policyIndex;
            }).filter(function (value, index, self) {
                return self.indexOf(value) === index;
            });

            if (policyIndexes.length > 1) {
                _sdTreeDesigner.Tooltip.show(_i18n.i18n.t('jobResultTable.tooltip.multiplePoliciesInCell', { number: policyIndexes.length }), 5, 28, event, 2000);
                return;
            }

            var policy = this.result.policies[policyIndexes[0]];
            var title = _policy.Policy.toPolicyString(policy, false);

            if (rows.length == 1) {

                var row = rows[0];
                if (row.variables) {
                    title = '';
                    this.result.variableNames.forEach(function (v, i) {
                        if (i) {
                            title += "; ";
                        }
                        title += v + " = " + row.variables[i];
                    });
                }
            }

            this.app.showPolicyPreview(title, policy, function () {
                _this11.resultTable.clearSelection();
            });
        }
    }, {
        key: "downloadCSV",
        value: function downloadCSV() {
            _exporter.Exporter.saveAsCSV(this.getRows());
        }
    }, {
        key: "getRows",
        value: function getRows() {
            var params = _sdUtils.Utils.cloneDeep(this.jobParameters.values);
            params.extendedPolicyDescription = false;
            return this.job.jobResultToCsvRows(this.result, this.job.createJobParameters(params));
        }
    }]);

    return SensitivityAnalysisDialog;
}(_dialog.Dialog);

},{"../app-utils":89,"../exporter":98,"../i18n/i18n":105,"../jobs/job-parameters-builder":109,"../jobs/probabilistic-sensitivity-analysis-result-table":111,"../jobs/sensitivity-analysis-result-table":112,"../jobs/spider-plot":113,"../jobs/tornado-diagram-plot":114,"../loading-indicator":118,"../templates":121,"./dialog":95,"sd-computations/src/policies/policy":"sd-computations/src/policies/policy","sd-tree-designer":63,"sd-utils":"sd-utils"}],97:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FormGroup = exports.SettingsDialog = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _d = require('../d3');

var d3 = _interopRequireWildcard(_d);

var _dialog = require('./dialog');

var _i18n = require('../i18n/i18n');

var _templates = require('../templates');

var _sdUtils = require('sd-utils');

var _appUtils = require('../app-utils');

var _inputField = require('../form/input-field');

var _pathValueAccessor = require('../form/path-value-accessor');

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var SettingsDialog = exports.SettingsDialog = function (_Dialog) {
    _inherits(SettingsDialog, _Dialog);

    function SettingsDialog(app) {
        _classCallCheck(this, SettingsDialog);

        var _this = _possibleConstructorReturn(this, (SettingsDialog.__proto__ || Object.getPrototypeOf(SettingsDialog)).call(this, app.container.select('#sd-settings-dialog'), app));

        _this.formGroups = [];

        var group = new FormGroup('general', function () {
            app.treeDesigner.updateCustomStyles();
            app.updateNumberFormats();
        });
        group.addField('fontFamily', 'text', app.treeDesigner, 'config.fontFamily').addField('fontSize', 'text', app.treeDesigner, 'config.fontSize').addSelectField('fontWeight', app.treeDesigner, 'config.fontWeight', SettingsDialog.fontWeightOptions).addSelectField('fontStyle', app.treeDesigner, 'config.fontStyle', SettingsDialog.fontStyleOptions).addField('numberFormatLocale', 'text', app, 'config.format.locales', { validate: function validate(v) {
                try {
                    new Intl.NumberFormat(v);return true;
                } catch (e) {
                    return false;
                }
            } });
        _this.formGroups.push(group);

        var payoffGroup = new FormGroup('payoff1', function () {
            return app.updatePayoffNumberFormat();
        });
        payoffGroup.addSelectField('style', app, 'config.format.payoff1.style', ['currency', 'decimal']).addSelectField('currencyDisplay', app, 'config.format.payoff1.currencyDisplay', ['symbol', 'code', 'name']).addField('currency', 'text', app, 'config.format.payoff1.currency', { validate: function validate(v) {
                try {
                    new Intl.NumberFormat([], { currency: v });return true;
                } catch (e) {
                    return false;
                }
            } }).addField('minimumFractionDigits', 'number', app, 'config.format.payoff1.minimumFractionDigits', { validate: function validate(v) {
                try {
                    new Intl.NumberFormat([], { minimumFractionDigits: v, maximumFractionDigits: app.config.format.payoff1.maximumFractionDigits });return true;
                } catch (e) {
                    return false;
                }
            } }).addField('maximumFractionDigits', 'number', app, 'config.format.payoff1.maximumFractionDigits', { validate: function validate(v) {
                try {
                    new Intl.NumberFormat([], { minimumFractionDigits: app.config.format.payoff1.minimumFractionDigits, maximumFractionDigits: v });return true;
                } catch (e) {
                    return false;
                }
            } }).addField('useGrouping', 'checkbox', app, 'config.format.payoff1.useGrouping');

        _this.formGroups.push(payoffGroup);

        var payoff2Group = new FormGroup('payoff2', function () {
            return app.updatePayoffNumberFormat();
        });
        payoff2Group.addSelectField('style', app, 'config.format.payoff2.style', ['currency', 'decimal']).addSelectField('currencyDisplay', app, 'config.format.payoff2.currencyDisplay', ['symbol', 'code', 'name']).addField('currency', 'text', app, 'config.format.payoff2.currency', { validate: function validate(v) {
                try {
                    new Intl.NumberFormat([], { currency: v });return true;
                } catch (e) {
                    return false;
                }
            } }).addField('minimumFractionDigits', 'number', app, 'config.format.payoff2.minimumFractionDigits', { validate: function validate(v) {
                try {
                    new Intl.NumberFormat([], { minimumFractionDigits: v, maximumFractionDigits: app.config.format.payoff2.maximumFractionDigits });return true;
                } catch (e) {
                    return false;
                }
            } }).addField('maximumFractionDigits', 'number', app, 'config.format.payoff2.maximumFractionDigits', { validate: function validate(v) {
                try {
                    new Intl.NumberFormat([], { minimumFractionDigits: app.config.format.payoff2.minimumFractionDigits, maximumFractionDigits: v });return true;
                } catch (e) {
                    return false;
                }
            } }).addField('useGrouping', 'checkbox', app, 'config.format.payoff2.useGrouping');

        _this.formGroups.push(payoff2Group);

        group = new FormGroup('probability', function () {
            app.updateProbabilityNumberFormat();
            app.treeDesigner.updateCustomStyles().redraw();
        });
        group.addSelectField('style', app, 'config.format.probability.style', ['decimal', 'percent']).addField('minimumFractionDigits', 'number', app, 'config.format.probability.minimumFractionDigits', { validate: function validate(v) {
                try {
                    new Intl.NumberFormat([], { minimumFractionDigits: v, maximumFractionDigits: app.config.format.probability.maximumFractionDigits });return true;
                } catch (e) {
                    return false;
                }
            } }).addField('maximumFractionDigits', 'number', app, 'config.format.probability.maximumFractionDigits', { validate: function validate(v) {
                try {
                    new Intl.NumberFormat([], { minimumFractionDigits: app.config.format.probability.minimumFractionDigits, maximumFractionDigits: v });return true;
                } catch (e) {
                    return false;
                }
            } }).addField('fontSize', 'text', app.treeDesigner, 'config.probability.fontSize').addField('color', 'color', app.treeDesigner, 'config.probability.color');
        _this.formGroups.push(group);

        var nodeGroup = new FormGroup('node', function () {
            return app.treeDesigner.updateCustomStyles().redraw();
        });
        nodeGroup.addField('strokeWidth', 'text', app.treeDesigner, 'config.node.strokeWidth');

        nodeGroup.addGroup('optimal').addField('strokeWidth', 'text', app.treeDesigner, 'config.node.optimal.strokeWidth').addField('stroke', 'color', app.treeDesigner, 'config.node.optimal.stroke');

        nodeGroup.addGroup('label').addField('fontSize', 'text', app.treeDesigner, 'config.node.label.fontSize').addField('color', 'color', app.treeDesigner, 'config.node.label.color');

        nodeGroup.addGroup('payoff').addField('fontSize', 'text', app.treeDesigner, 'config.node.payoff.fontSize').addField('color', 'color', app.treeDesigner, 'config.node.payoff.color').addField('negativeColor', 'color', app.treeDesigner, 'config.node.payoff.negativeColor');

        _this.formGroups.push(nodeGroup);

        nodeGroup.addGroup('decision').addField('fill', 'color', app.treeDesigner, 'config.node.decision.fill').addField('stroke', 'color', app.treeDesigner, 'config.node.decision.stroke').addField('selected.fill', 'color', app.treeDesigner, 'config.node.decision.selected.fill');

        nodeGroup.addGroup('chance').addField('fill', 'color', app.treeDesigner, 'config.node.chance.fill').addField('stroke', 'color', app.treeDesigner, 'config.node.chance.stroke').addField('selected.fill', 'color', app.treeDesigner, 'config.node.chance.selected.fill');

        nodeGroup.addGroup('terminal').addField('fill', 'color', app.treeDesigner, 'config.node.terminal.fill').addField('stroke', 'color', app.treeDesigner, 'config.node.terminal.stroke').addField('selected.fill', 'color', app.treeDesigner, 'config.node.terminal.selected.fill').addGroup('payoff').addField('fontSize', 'text', app.treeDesigner, 'config.node.terminal.payoff.fontSize').addField('color', 'color', app.treeDesigner, 'config.node.terminal.payoff.color').addField('negativeColor', 'color', app.treeDesigner, 'config.node.terminal.payoff.negativeColor');

        var edgeGroup = new FormGroup('edge', function () {
            return app.treeDesigner.updateCustomStyles().redraw();
        }).addField('stroke', 'color', app.treeDesigner, 'config.edge.stroke').addField('strokeWidth', 'text', app.treeDesigner, 'config.edge.strokeWidth');

        edgeGroup.addGroup('optimal').addField('strokeWidth', 'text', app.treeDesigner, 'config.edge.optimal.strokeWidth').addField('stroke', 'color', app.treeDesigner, 'config.edge.optimal.stroke');

        edgeGroup.addGroup('selected').addField('strokeWidth', 'text', app.treeDesigner, 'config.edge.selected.strokeWidth').addField('stroke', 'color', app.treeDesigner, 'config.edge.selected.stroke');

        edgeGroup.addGroup('label').addField('fontSize', 'text', app.treeDesigner, 'config.edge.label.fontSize').addField('color', 'color', app.treeDesigner, 'config.edge.label.color');

        edgeGroup.addGroup('payoff').addField('fontSize', 'text', app.treeDesigner, 'config.edge.payoff.fontSize').addField('color', 'color', app.treeDesigner, 'config.edge.payoff.color').addField('negativeColor', 'color', app.treeDesigner, 'config.edge.payoff.negativeColor');
        _this.formGroups.push(edgeGroup);

        var titleGroup = new FormGroup('diagramTitle', function () {
            return app.treeDesigner.updateCustomStyles().redraw();
        });
        titleGroup.addField('fontSize', 'text', app.treeDesigner, 'config.title.fontSize').addSelectField('fontWeight', app.treeDesigner, 'config.title.fontWeight', SettingsDialog.fontWeightOptions).addSelectField('fontStyle', app.treeDesigner, 'config.title.fontStyle', SettingsDialog.fontStyleOptions).addField('color', 'color', app.treeDesigner, 'config.title.color').addGroup('margin').addField('top', 'number', app.treeDesigner, 'config.title.margin.top').addField('bottom', 'number', app.treeDesigner, 'config.title.margin.bottom');

        titleGroup.addGroup('description').addField('show', 'checkbox', app.treeDesigner, 'config.description.show').addField('fontSize', 'text', app.treeDesigner, 'config.description.fontSize').addSelectField('fontWeight', app.treeDesigner, 'config.description.fontWeight', SettingsDialog.fontWeightOptions).addSelectField('fontStyle', app.treeDesigner, 'config.description.fontStyle', SettingsDialog.fontStyleOptions).addField('color', 'color', app.treeDesigner, 'config.description.color').addField('marginTop', 'number', app.treeDesigner, 'config.description.margin.top');

        _this.formGroups.push(titleGroup);

        var leagueTableGroup = new FormGroup('leagueTable');
        leagueTableGroup.addGroup('plot').addField('maxWidth', 'text', app, 'config.leagueTable.plot.maxWidth').addField('highlightedColor', 'color', app, 'config.leagueTable.plot.groups.highlighted.color').addField('highlightedDefaultColor', 'color', app, 'config.leagueTable.plot.groups.highlighted-default.color').addField('extendedDominatedColor', 'color', app, 'config.leagueTable.plot.groups.extended-dominated.color').addField('dominatedColor', 'color', app, 'config.leagueTable.plot.groups.dominated.color').addField('defaultColor', 'color', app, 'config.leagueTable.plot.groups.default.color');

        _this.formGroups.push(leagueTableGroup);

        var otherGroup = new FormGroup('other', function () {
            return app.treeDesigner.redraw();
        });
        otherGroup.addField('disableAnimations', 'checkbox', app.treeDesigner, 'config.disableAnimations').addField('forceFullEdgeRedraw', 'checkbox', app.treeDesigner, 'config.forceFullEdgeRedraw').addField('hideLabels', 'checkbox', app.treeDesigner, 'config.hideLabels').addField('hidePayoffs', 'checkbox', app.treeDesigner, 'config.hidePayoffs').addField('hideProbabilities', 'checkbox', app.treeDesigner, 'config.hideProbabilities').addField({
            name: 'raw',
            type: 'checkbox',
            config: app.treeDesigner,
            path: 'config.raw',
            valueUpdateCallback: function valueUpdateCallback() {
                return app.onRawOptionChanged();
            }
        });

        _this.formGroups.push(otherGroup);

        _this.initView();

        return _this;
    }

    _createClass(SettingsDialog, [{
        key: 'initFormGroups',
        value: function initFormGroups(container, data) {
            var self = this;
            var temp = {};
            var formGroups = container.selectAll('div.sd-form-group').filter(function (d) {
                return this.parentNode == container.node();
            }).data(data);
            var formGroupsEnter = formGroups.enter().appendSelector('div.sd-form-group').attr('id', function (d) {
                return d.id;
            }).html(function (d) {
                return _templates.Templates.get('settingsDialogFormGroup', d);
            });
            formGroupsEnter.select('.toggle-button').on('click', function (d) {
                var g = container.select('#' + d.id);
                g.classed('sd-extended', !g.classed('sd-extended'));
            });

            var formGroupsMerge = formGroupsEnter.merge(formGroups);
            var inputGroups = formGroupsMerge.select('  .sd-form-group-content > .sd-form-group-inputs').selectAll('div.input-group').data(function (d) {
                return d.fields;
            });

            var inputGroupsEnter = inputGroups.enter().appendSelector('div.input-group').html(function (d) {
                return d.type == 'select' ? _templates.Templates.get('selectInputGroup', d) : _templates.Templates.get('inputGroup', d);
            });

            inputGroupsEnter.merge(inputGroups).select('input, select').on('change input', function (d, i) {
                var value = this.value;
                if (d.type == 'checkbox') {
                    value = this.checked;
                }
                if (d.validator && !d.validator.validate(value)) {
                    d3.select(this).classed('invalid', true);
                    if (d3.event.type == 'change') {
                        this.value = d.valueAccessor.get();
                    }
                    return;
                }
                d3.select(this).classed('invalid', false);

                d.valueAccessor.set(value);
                if (d.valueUpdateCallback) {
                    d.valueUpdateCallback();
                }
                _appUtils.AppUtils.updateInputClass(d3.select(this));
            }).each(function (d, i) {
                var value = d.valueAccessor.get();
                if (d.type == 'checkbox') {
                    this.checked = value;
                } else {
                    this.value = value;
                }
                temp[i] = {};
                temp[i].pristineVal = value;
                if (d.validator && !d.validator.validate(value)) {
                    d3.select(this).classed('invalid', true);
                } else {
                    d3.select(this).classed('invalid', false);
                }
                _appUtils.AppUtils.updateInputClass(d3.select(this));
            });

            formGroupsMerge.each(function (d) {
                self.initFormGroups(d3.select(this).select('.sd-form-group-content > .sd-form-group-child-groups'), d.groups);
            });
        }
    }, {
        key: 'initView',
        value: function initView() {
            var temp = {};
            this.initFormGroups(this.container.select('form#sd-settings-form'), this.formGroups);
        }
    }, {
        key: 'onOpen',
        value: function onOpen() {
            this.initView();
        }
    }]);

    return SettingsDialog;
}(_dialog.Dialog);

SettingsDialog.fontWeightOptions = ['normal', 'bold', 'lighter', 'bolder'];
SettingsDialog.fontStyleOptions = ['normal', 'italic', 'oblique'];

var FormGroup = exports.FormGroup = function () {
    function FormGroup(name, valueUpdateCallback) {
        _classCallCheck(this, FormGroup);

        this.fields = [];
        this.groups = [];

        this.id = 'sd-form-group-' + name.replace(/\./g, '-');
        this.name = name;
        this.valueUpdateCallback = valueUpdateCallback;
    }

    _createClass(FormGroup, [{
        key: 'addSelectField',
        value: function addSelectField(name, config, path, options) {
            this.addField(name, 'select', config, path, null, options);
            return this;
        }
    }, {
        key: 'addField',
        value: function addField(fieldConfig) {
            if (arguments.length > 1) {
                return this._addField.apply(this, arguments);
            }

            return this._addField(fieldConfig['name'], fieldConfig['type'], fieldConfig['config'], fieldConfig['path'], fieldConfig['validator'], fieldConfig['options'], fieldConfig['valueUpdateCallback']);
        }
    }, {
        key: '_addField',
        value: function _addField(name, type, config, path, validator, options, valueUpdateCallback) {
            var _this2 = this;

            var fieldId = this.name + "-" + name;
            var label = _i18n.i18n.t("settingsDialog." + this.name + "." + name);
            var configInputField = new ConfigInputField(fieldId, fieldId, type, label, config, path, validator, options);
            if (valueUpdateCallback) {
                configInputField.valueUpdateCallback = function () {
                    _this2.valueUpdateCallback();
                    valueUpdateCallback();
                };
            } else {
                configInputField.valueUpdateCallback = this.valueUpdateCallback;
            }

            this.fields.push(configInputField);
            return this;
        }
    }, {
        key: 'addGroup',
        value: function addGroup(name) {
            var groupName = this.name + '.' + name;
            var group = new FormGroup(groupName, this.valueUpdateCallback);
            this.groups.push(group);
            return group;
        }
    }]);

    return FormGroup;
}();

var ConfigInputField = function (_InputField) {
    _inherits(ConfigInputField, _InputField);

    function ConfigInputField(id, name, type, label, sourceObject, path, validator, options) {
        _classCallCheck(this, ConfigInputField);

        return _possibleConstructorReturn(this, (ConfigInputField.__proto__ || Object.getPrototypeOf(ConfigInputField)).call(this, id, name, type, label, new _pathValueAccessor.PathValueAccessor(sourceObject, path), validator, options));
    }

    return ConfigInputField;
}(_inputField.InputField);

},{"../app-utils":89,"../d3":92,"../form/input-field":100,"../form/path-value-accessor":101,"../i18n/i18n":105,"../templates":121,"./dialog":95,"sd-utils":"sd-utils"}],98:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Exporter = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _blueimpCanvasToBlob = require("blueimp-canvas-to-blob");

var _fileSaver = require("file-saver");

var _d = require("./d3");

var d3 = _interopRequireWildcard(_d);

var _i18n = require("./i18n/i18n");

var _sdUtils = require("sd-utils");

var _loadingIndicator = require("./loading-indicator");

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Exporter = exports.Exporter = function () {
    function Exporter() {
        _classCallCheck(this, Exporter);
    }

    _createClass(Exporter, null, [{
        key: "getSvgCloneWithInlineStyles",

        // Below are the function that handle actual exporting:
        // getSVGString (svgNode ) and svgString2Image( svgString, width, height, format, callback )
        value: function getSvgCloneWithInlineStyles(svgNode) {
            var svgClone = svgNode.cloneNode(true);
            appendInlineStyles(svgNode, svgClone);

            function appendInlineStyles(source, target, parentCs) {
                if (!source) {
                    _sdUtils.log.error('Exporter.appendInlineStyles - undefined source!');
                    return false;
                }
                var children = source.children;
                var targetChildren = target.children;
                if (!source.children) {
                    children = source.childNodes;
                    targetChildren = target.childNodes;
                }

                if (source.tagName === 'text') {
                    /*
                     var bBox = source.getBBox();
                     console.log(source, bBox);
                     target.setAttribute('y', bBox.y)*/
                }

                var cssStyleText = '';
                var cs = getComputedStyle(source);
                if (!cs) {
                    return true;
                }
                if (cs.display === 'none') {
                    return false;
                }

                for (var i = 0; i < cs.length; i++) {
                    var styleName = cs.item(i);
                    if (_sdUtils.Utils.startsWith(styleName, '-')) {
                        continue;
                    }

                    var propertyValue = cs.getPropertyValue(styleName);
                    if (parentCs) {
                        if (propertyValue === parentCs.getPropertyValue(styleName)) {
                            continue;
                        }
                    }

                    if (Exporter.exportedStyles.some(function (s) {
                        return s.test(styleName);
                    })) {
                        cssStyleText += '; ' + styleName + ': ' + propertyValue;
                    } else if (Exporter.svgProperties.some(function (s) {
                        return s.test(styleName);
                    })) {
                        target.setAttribute(styleName, propertyValue);
                    }
                }
                if (cssStyleText.length) {
                    target.setAttribute("style", cssStyleText);
                } else {
                    target.removeAttribute("style");
                }

                var toRemove = [];
                for (var _i = 0; _i < children.length; _i++) {
                    var node = children[_i];
                    if (!appendInlineStyles(node, targetChildren[_i], cs)) {
                        toRemove.push(targetChildren[_i]);
                    }
                }
                toRemove.forEach(function (n) {
                    target.removeChild(n);
                });
                return true;
            }

            /*var textElements = svgNode.getElementsByTagName('text')
             _.each(textElements, function (el) {
               var textBBox = el.getBBox();
             console.log(el,textBBox, el.getBoundingClientRect());
             _.each(el.getElementsByTagName('tspan'), tspan=>{
             var tspanBBox = tspan.getBBox();
             console.log(tspan,tspanBBox, tspan.getBoundingClientRect());
             })
              // el.style['font-family'] = el.style['font-family'] && el.style['font-family'].split(' ').splice(-1);
             });*/

            svgClone.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
            return svgClone;
        }
    }, {
        key: "getSVGString",
        value: function getSVGString(svgNode) {
            var removeIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            // svgNode = svgNode.cloneNode(true);
            var svgClone = Exporter.getSvgCloneWithInlineStyles(svgNode);

            var svgString = Exporter.serializeSvgNode(svgClone);
            // svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=') // Fix root xlink without namespace
            // svgString = svgString.replace(/NS\d+:href/g, 'xlink:href') // Safari NS namespace fix
            svgString = Exporter.sanitizeSVG(svgString, removeIds);

            return svgString;
        }
    }, {
        key: "serializeSvgNode",
        value: function serializeSvgNode(svgNode) {
            var serializer = new XMLSerializer();
            return serializer.serializeToString(svgNode);
        }
    }, {
        key: "validateSvgNode",
        value: function validateSvgNode(svgNode) {
            var svgString = Exporter.serializeSvgNode(svgNode);
            var oParser = new DOMParser();
            var doc = oParser.parseFromString(svgString, 'image/svg+xml');
            return doc.documentElement.nodeName.indexOf('parsererror') === -1;
        }
    }, {
        key: "svgString2Image",
        value: function svgString2Image(svgString, width, height, format, callback) {
            var format = format ? format : 'png';
            var imgsrc = 'data:image/svg+xml,' + encodeURIComponent(svgString); // Convert SVG string to dataurl

            // var canvas = document.createElement("canvas");
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");

            canvas.width = width;
            canvas.height = height;

            var image = new Image();
            image.width = width;
            image.height = height;
            var target = new Image();
            target.width = width;
            target.height = height;

            image.onload = function () {
                // context.clearRect(0, 0, width, height);
                context.drawImage(image, 0, 0, width, height);
                canvas.toBlob(function (blob) {
                    var filesize = Math.round(blob.length / 1024) + ' KB';
                    if (callback) callback(blob, filesize);
                });
            };

            image.src = imgsrc;
        }

        //decisiontree@yyyy.mm.dd_hh.mm.ss

    }, {
        key: "getExportFileName",
        value: function getExportFileName(ext) {
            var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'decisiontree';

            var format = d3.timeFormat("%Y.%m.%d_%H.%M.%S");
            var date = new Date();
            name += '@' + format(date);
            if (ext) {
                name += '.' + ext;
            }
            return name;
        }
    }, {
        key: "saveAsPng",
        value: function saveAsPng(svg, options) {

            var clientSide = options.png.mode === 'client';
            var fallback = options.png.mode === 'fallback';
            var serverSide = options.png.mode === 'server';
            if (_sdUtils.Utils.detectIE()) {
                if (clientSide) {
                    alert(_i18n.i18n.t('error.pngExportNotSupportedIE'));
                    return;
                }

                if (fallback) {
                    fallback = false;
                    serverSide = true;
                }
            }
            _loadingIndicator.LoadingIndicator.show();

            try {
                var svgString = Exporter.getSVGString(svg.node());
                var svgWidth = svg.attr('width');
                var svgHeight = svg.attr('height');

                var pngWidth = 4 * svgWidth;
                var pngHeight = 4 * svgHeight;
                if (clientSide || fallback) {
                    // passes Blob and filesize String to the callback

                    var save = function save(dataBlob, filesize) {
                        try {
                            Exporter.saveAs(dataBlob, Exporter.getExportFileName('png'));
                            _loadingIndicator.LoadingIndicator.hide();
                        } catch (e) {
                            _sdUtils.log.warn('client side png rendering failed!');
                            if (fallback) {
                                _sdUtils.log.info('performing server side fallback.');
                                Exporter.exportPngServerSide(svgString, options.serverUrl, pngWidth, pngHeight);
                            } else {
                                throw e;
                            }
                        }
                    };

                    Exporter.svgString2Image(svgString, pngWidth, pngHeight, 'png', save);
                } else if (serverSide) {
                    Exporter.exportPngServerSide(svgString, options.serverUrl, pngWidth, pngHeight);
                }
            } catch (e) {
                alert(_i18n.i18n.t('error.pngExportNotSupported'));
                _loadingIndicator.LoadingIndicator.hide();
                _sdUtils.log.error('pngExportNotSupported', e);
            }
        }
    }, {
        key: "saveAsSvg",
        value: function saveAsSvg(svg) {
            try {
                var svgString = Exporter.getSVGString(svg.node());

                var blob = new Blob([svgString], { type: "image/svg+xml" });
                Exporter.saveAs(blob, Exporter.getExportFileName('svg'));
            } catch (e) {
                alert(_i18n.i18n.t('error.svgExportNotSupported'));
                _sdUtils.log.error('svgExportNotSupported', e);
            }
        }
    }, {
        key: "exportPdfClientSide",
        value: function exportPdfClientSide(svgString, width, height) {
            var doc = new jsPDF('l', 'pt', [width, height]);
            var dummy = document.createElement('svg');
            dummy.innerHTML = svgString;
            svg2pdf(dummy.firstChild, doc, {
                xOffset: 0,
                yOffset: 0,
                scale: 1
            });
            doc.save(Exporter.getExportFileName('pdf'));
            _loadingIndicator.LoadingIndicator.hide();
        }
    }, {
        key: "postAndSave",
        value: function postAndSave(url, data, filename, successCallback, failCallback) {
            var xhr = new XMLHttpRequest();
            xhr.open('post', url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                var status = xhr.status;
                _sdUtils.log.debug(status);
                var type = xhr.getResponseHeader('Content-Type');
                if (status == 200) {
                    var blob = new Blob([this.response], { type: type });
                    Exporter.saveAs(blob, filename);
                    if (successCallback) {
                        successCallback();
                    }
                } else {
                    if (failCallback) {
                        failCallback();
                    }
                }
            };
            xhr.onreadystatechange = function (oEvent) {
                if (xhr.readyState === 4) {
                    if (xhr.status !== 200) {
                        failCallback();
                    }
                }
            };

            xhr.send(JSON.stringify(data));
        }
    }, {
        key: "exportPdfServerSide",
        value: function exportPdfServerSide(svgString, url) {
            var filename = Exporter.getExportFileName('pdf');
            var data = { svg: svgString, type: 'pdf', noDownload: true };
            Exporter.postAndSave(url, data, filename, _loadingIndicator.LoadingIndicator.hide, function () {
                _loadingIndicator.LoadingIndicator.hide();
                alert(_i18n.i18n.t('error.serverSideExportRequestFailure'));
                throw new Error('Server side export failure');
            });

            // Utils.postByForm(url, {
            //     filename: filename,
            //     type: 'pdf',
            //     // width: options.width || 0, // IE8 fails to post undefined correctly, so use 0
            //     // scale: options.scale,
            //     svg: svgString
            // });
        }
    }, {
        key: "exportPngServerSide",
        value: function exportPngServerSide(svgString, url, pngWidth, pngHeight) {
            var filename = Exporter.getExportFileName('png');
            var data = { svg: svgString, type: 'png', noDownload: true, width: pngWidth };
            Exporter.postAndSave(url, data, filename, _loadingIndicator.LoadingIndicator.hide, function () {
                _loadingIndicator.LoadingIndicator.hide();
                alert(_i18n.i18n.t('error.serverSideExportRequestFailure'));
                throw new Error('Server side export failure');
            });

            /*Utils.postByForm(url, {
             filename: filename,
             type: 'pdf',
             // width: options.width || 0, // IE8 fails to post undefined correctly, so use 0
             // scale: options.scale,
             svg: svgString
             });*/
        }
    }, {
        key: "saveAsPdf",
        value: function saveAsPdf(svg, options) {
            var clientSidePdfExportAvailable = Exporter.isClientSidePdfExportAvailable();
            if (options.pdf.mode === 'client') {
                if (!clientSidePdfExportAvailable) {
                    alert(_i18n.i18n.t('error.jsPDFisNotIncluded'));
                    return;
                }
            }
            _loadingIndicator.LoadingIndicator.show();
            var margin = 20;
            var svgElement = svg.node();
            var width = svgElement.width.baseVal.value + 2 * margin,
                height = svgElement.height.baseVal.value + 2 * margin;
            try {
                var svgString = Exporter.getSVGString(svgElement);

                var fallback = options.pdf.mode === 'fallback';
                if (options.pdf.mode === 'client' || fallback) {
                    try {
                        Exporter.exportPdfClientSide(svgString, width, height);
                    } catch (e) {
                        _sdUtils.log.error('client side pdf rendering failed!');
                        if (fallback) {
                            _sdUtils.log.info('performing server side fallback.');
                            Exporter.exportPdfServerSide(svgString, options.serverUrl);
                        } else {
                            throw e;
                        }
                    }
                } else if (options.pdf.mode === 'server') {
                    Exporter.exportPdfServerSide(svgString, options.serverUrl);
                }
            } catch (e) {
                _sdUtils.log.error('pdfExportNotSupported', e);
                _loadingIndicator.LoadingIndicator.hide();
                alert(_i18n.i18n.t('error.pdfExportNotSupported'));
            }
        }
    }, {
        key: "isClientSidePdfExportAvailable",
        value: function isClientSidePdfExportAvailable() {
            return typeof jsPDF !== 'undefined' && typeof svg2pdf !== 'undefined';
        }
    }, {
        key: "sanitizeSVG",
        value: function sanitizeSVG(svg) {
            var removeIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var sanitized = svg.replace(/zIndex="[^"]+"/g, '').replace(/isShadow="[^"]+"/g, '').replace(/symbolName="[^"]+"/g, '').replace(/jQuery[0-9]+="[^"]+"/g, '').replace(/url\(("|&quot;)(\S+)("|&quot;)\)/g, 'url($2)').replace(/url\([^#]+#/g, 'url(#').replace(/<svg /, '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/ (NS[0-9]+\:)?href=/g, ' xlink:href=').replace(/\n/, ' ').replace(/<\/svg>.*?$/, '</svg>').replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g, '$1="rgb($2)" $1-opacity="$3"').replace(/&nbsp;/g, "\xA0").replace(/&shy;/g, "\xAD");

            if (removeIds) {
                return sanitized.replace(/id="[^"]+"/g, '');
            }

            return sanitized;
        }
    }, {
        key: "saveAsCSV",
        value: function saveAsCSV(rows) {
            var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'decisiontree';

            var csvRows = [];
            rows.forEach(function (row) {
                csvRows.push(row.map(function (r) {
                    return Exporter.escapeCsvField(r);
                }).join(','));
            });
            var csvString = csvRows.join("\r\n");

            var blob = new Blob([csvString], { type: "text/csv" });
            Exporter.saveAs(blob, Exporter.getExportFileName('csv', name));
        }
    }, {
        key: "escapeCsvField",
        value: function escapeCsvField(field) {
            if (_sdUtils.Utils.isString(field)) {
                return '"' + field.replace(/"/g, '""') + '"';
            }
            return field;
        }
    }]);

    return Exporter;
}();

Exporter.saveAs = _fileSaver.saveAs;
Exporter.dataURLtoBlob = _blueimpCanvasToBlob.dataURLtoBlob;
Exporter.exportedStyles = [/^font/, /^color/, /^opacity$/];
Exporter.svgProperties = [/^stroke/, /^fill/, /^text/];

},{"./d3":92,"./i18n/i18n":105,"./loading-indicator":118,"blueimp-canvas-to-blob":"blueimp-canvas-to-blob","file-saver":"file-saver","sd-utils":"sd-utils"}],99:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FileLoader = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _i18n = require('./i18n/i18n');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var FileLoader = exports.FileLoader = function () {
    function FileLoader() {
        _classCallCheck(this, FileLoader);
    }

    _createClass(FileLoader, null, [{
        key: 'openFile',
        value: function openFile(callback) {
            var input = document.getElementById('sd-file-input');
            input.onchange = loadFile;

            input.click();

            function loadFile() {

                var file, fr;

                if (typeof window.FileReader !== 'function') {
                    alert(_i18n.i18n.t('error.fileApiNotSupported'));
                    return;
                }
                input = document.getElementById('sd-file-input');
                if (!input.files) {
                    alert(_i18n.i18n.t('error.inputFilesProperty'));
                    return;
                }

                if (!input.files[0]) {
                    return;
                }

                file = input.files[0];
                fr = new FileReader();
                fr.onload = receivedText;
                fr.readAsText(file);

                function receivedText(e) {
                    callback(e.target.result);
                    input.value = null;
                }
            }
        }
    }]);

    return FileLoader;
}();

},{"./i18n/i18n":105}],100:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var InputField = exports.InputField = function () {
    function InputField(id, name, type, label, valueAccessor, validator, options, parser, styleClass) {
        _classCallCheck(this, InputField);

        this.name = name;
        this.type = type;
        this.valueAccessor = valueAccessor;
        this.validator = validator;
        this.id = id;
        this.label = label;
        this.options = options;
        this.parser = parser;
        this.styleClass = styleClass;
    }

    _createClass(InputField, [{
        key: "getValue",
        value: function getValue() {
            return this.valueAccessor.get();
        }
    }, {
        key: "setValue",
        value: function setValue(val) {
            return this.valueAccessor.set(val);
        }
    }, {
        key: "parse",
        value: function parse(val) {
            if (this.parser) {
                return this.parser(val);
            }
            return val;
        }
    }]);

    return InputField;
}();

},{}],101:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PathValueAccessor = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _sdUtils = require("sd-utils");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var PathValueAccessor = exports.PathValueAccessor = function () {
    function PathValueAccessor(sourceObject, path) {
        _classCallCheck(this, PathValueAccessor);

        this.sourceObject = sourceObject;
        this.path = path;
    }

    _createClass(PathValueAccessor, [{
        key: "get",
        value: function get() {
            return _sdUtils.Utils.get(this.sourceObject, this.path);
        }
    }, {
        key: "set",
        value: function set(v) {
            return _sdUtils.Utils.set(this.sourceObject, this.path, v);
        }
    }]);

    return PathValueAccessor;
}();

},{"sd-utils":"sd-utils"}],102:[function(require,module,exports){
module.exports={
    "toolbar": {
        "newDiagram": "Neues Diagramm",
        "openDiagram": "Diagramm öffnen",
        "saveDiagram": "Aktuelles Diagramm speichern",
        "export":{
            "label": "Exportieren nach",
            "png": "Png",
            "svg": "Svg",
            "pdf": "Pdf"
        },
        "layout":{
            "label": "Layout",
            "manual": "Manual",
            "tree": "Baum",
            "cluster": "Cluster"
        },
        "viewMode": {
            "label": "Aussicht",
            "options": {
                "criterion1":"Kriterium 1",
                "criterion2":"Kriterium 2",
                "twoCriteria":"Zwei Kriterien"
            }
        },
        "objectiveRule":{
            "label": "Regel",
            "options": {
                "expected-value-maximization":"max",
                "expected-value-minimization":"min",
                "maxi-min":"maxi-min",
                "maxi-max":"maxi-max",
                "mini-min":"mini-min",
                "mini-max":"mini-max",
                "min-max":"min-max",
                "max-min":"max-min",
                "min-min": "min-min",
                "max-max": "max-max"
            }
        },
        "undo": "Rückgängig machen",
        "redo": "Wiederholen",
        "settings": "Einstellungen",
        "about": "Über",
        "sensitivityAnalysis": "Sensitivitätsanalyse",
        "recompute": "Neu Berechnen"
    },
    "node":{
        "name": "Beschreibung"
    },
    "edge":{
        "name": "Beschreibung",
        "payoff": "Auszahlung",
        "probability": "Wahrscheinlichkeit"
    },
    "text":{
        "value": "Text"
    },
    "leagueTableDialog":{
        "title": "Rangliste",
        "buttons": {
            "downloadCsv": "CSV Herunterladen"
        }
    },
    "leagueTable": {
        "headers":{
            "policyNo": "Regel #",
            "policy": "Regel",
            "comment": "Kommentar"
        },
        "comment":{
            "dominatedBy": "Dominiert (durch#{{policy}})",
            "extendedDominatedBy": "Erweitert-dominiert (durch #{{policy1}} und #{{policy2}})",
            "incratio": "Inkrementelles Verhältnis={{incratio}}"
        },
        "plot":{
            "groups":{
                "highlighted": "Markiert",
                "highlighted-default": "Empfohlen (für Standard-WTP)",
                "extended-dominated" : "Erweitert-dominiert",
                "dominated": "Dominiert",
                "default": "Andere"
            },
            "tooltip":{
                "gradientArrow1": "Richtung von{{name}} Optimierung",
                "gradientArrow2": "Richtung von {{name}} Optimierung",
                "dominatedRegion": "Dominierte Region"
            },
            "legend":{
                "dominatedRegion": "Graumarkiert Bereich stellt dominierte Region dar",
                "gradientArrows": "Pfeile zeigen Verbesserungsrichtung an"
            }
        }
    },
    "sensitivityAnalysisDialog":{
        "title": "Sensitivitätsanalyse",
        "buttons": {
            "runJob": "Lauf",
            "stopJob": "Stop",
            "terminateJob": "Beenden",
            "resumeJob": "Fortsetzen",
            "downloadCsv": "CSV Herunterladen",
            "back": "Zurück",
            "clear": "Löschen"
        }
    },
    "jobParametersBuilder": {
        "buttons": {
            "removeParameterValue": "Entfernen",
            "addParameterValue": "Hinzufügen"
        }
    },
    "jobResultTable":{
        "tooltip": {
            "multiplePoliciesInCell": "{{number}} Grundregeln"
        },
        "pivot": {
            "aggregators":{
                "maximum": "Maximum",
                "minimum": "Minimum"
            },
            "renderers":{
                "heatmap": "Wärmekarte"
            }
        },
        "policyPreview": "Grundregel Vorschau"
    },
    "job":{
        "sensitivity-analysis":{
            "name": "N-Wege-Sensitivitätsanalyse",
            "param":{
                "ruleName": "Regelname",
                "extendedPolicyDescription": {
                    "label": "Erweiterte Grundregeln Beschreibung"
                },
                "variables": {
                    "label": "Variables",
                    "name": {
                        "label": "Name"
                    },
                    "min": {
                        "label": "Min"
                    },
                    "max": {
                        "label": "Max"
                    },
                    "length": {
                        "label": "Länge"
                    },
                    "step": {
                        "label": "Schritt"
                    }
                }
            },
            "errors":{
                "computations": "Fehler bei der Sensitivitätsanalyse für folgende Parameter:"
            },
            "warnings": {
                "largeScenariosNumber": "Anzahl der definierten Szenarien größer als {{numberFormatted}}. Sensitivitätsanalyse könnte nicht dürchgefuhrt werden oder wird sehr langsam.",
                "largeParametersNumber": "Anzahl der Parameter größer als {{number}}. Die Anzeige der Resultate der Sensitivitätsanalyse könnte fehlschlagen oder sehr langsam sein."
            }
        },
        "tornado-diagram":{
            "name": "Tornado-diagramm",
            "param":{
                "ruleName": "Regelname",
                "extendedPolicyDescription": {
                    "label": "Erweiterte Grundregeln Beschreibung"
                },
                "variables": {
                    "label": "Variables",
                    "name": {
                        "label": "Name"
                    },
                    "min": {
                        "label": "Min"
                    },
                    "max": {
                        "label": "Max"
                    },
                    "length": {
                        "label": "Länge"
                    },
                    "step": {
                        "label": "Schritt"
                    },
                    "defaultValue": {
                        "label": "Standardwert"
                    }

                }
            },
            "errors":{
                "computations": "Fehler bei der Sensitivitätsanalyse für folgende Parameter:"
            },
            "warnings": {
                "largeScenariosNumber": "Anzahl der definierten Szenarien größer als {{numberFormatted}}. Sensitivitätsanalyse könnte nicht dürchgefuhrt werden oder wird sehr langsam.",
                "largeParametersNumber": "Anzahl der Parameter größer als {{number}}. Die Anzeige der Resultate der Sensitivitätsanalyse könnte fehlschlagen oder sehr langsam sein."
            },
            "plot":{
                "legend":{
                    "low": "Verringerung",
                    "high": "Erhöhung"
                },
                "xAxisTitle": "Auszahlen"
            }
        },
        "probabilistic-sensitivity-analysis":{
            "name": "Probabilistische Sensitivitätsanalyse",
            "param":{
                "ruleName": "Regelname",
                "numberOfRuns": {
                    "label": "Anzahl der Läufe"
                },
                "extendedPolicyDescription": {
                    "label": "Erweiterte Grundregel Beschreibung"
                },
                "variables": {
                    "label": "Variablen",
                    "name": {
                        "label": "Name"
                    },
                    "formula": {
                        "label": "Formel",
                        "help": "Wählen Sie die Formelvorlage aus dem Menü aus oder schreiben Sie benutzerdefinierten Code"
                    }
                }
            },
            "errors":{
                "computations": "Berechnungsfehler der Sensitivitätsanalyse für folgende Parameter:",
                "param-computation": "Fehler beim Berechnen von Parameterwerten:"
            },
            "warnings": {
                "largeScenariosNumber": "Anzahl der definierten Szenarien größer als {{numberFormatted}}. Sensitivitätsanalyse könnte nicht dürchgefuhrt werden oder wird sehr langsam."
            }
        },
        "spider-plot": {
            "name": "Netzdiagramm",
            "param": {
                "ruleName": "Regelname",
                "extendedPolicyDescription": {
                    "label": "Erweiterte Grundregel Beschreibung"
                },
                "percentageChangeRange": {
                    "label": "+/- prozentuale Veränderung zum Berücksichtigen"
                },
                "length": {
                    "label": "Anzahl der zu testenden Werte",
                    "help": "Anzahl der zu testenden Werte (an einer Seite des Bereichs)"
                },
                "variables": {
                    "label": "Variablen",
                    "name": {
                        "label": "Name"
                    },
                    "defaultValue": {
                        "label": "Standardwert"
                    }
                }
            },
            "errors":{
                "computations": "Berechnungsfehler der Sensitivitätsanalyse für folgende Parameter:"
            },
            "warnings": {
                "largeScenariosNumber": "Anzahl der definierten Szenarien größer als {{numberFormatted}}. Sensitivitätsanalyse könnte nicht dürchgefuhrt werden oder wird sehr langsam."
            },
            "plot": {
                "legend": {},
                "xAxisTitle": "Prozentuale Veränderung",
                "yAxisTitle": "Auszahlen"
            }
        },
        "league-table":{
            "name": "Rangliste"
        },
        "errors":{
            "generic": "Fehler bei der Sensitivitätsanalyse: {{message}}",
            "params": "Inkorrekte {{jobName}} Parametern"
        }
    },
    "settingsDialog":{
        "title": "Einstellungen",
        "general":{
            "title": "Allgemein",
            "fontSize": "Schriftgröße",
            "fontFamily": "Schriftfamilie",
            "fontWeight": "Schriftgewicht",
            "fontStyle": "Schriftstil",
            "numberFormatLocale": "Zahlenformat Gebietsschema"
        },
        "payoff1":{
            "title": "Auszahlung 1 Zahlenformat",
            "currency": "Währung",
            "currencyDisplay": "Währungsanzeige",
            "style": "Stil",
            "minimumFractionDigits": "Minimale Bruchzahlen",
            "maximumFractionDigits": "Maximale Bruchzahlen",
            "useGrouping": "Gruppierung Separatoren verwenden"
        },
        "payoff2":{
            "title": "Auszahlung 2 Zahlenformat",
            "currency": "Währung",
            "currencyDisplay": "Währungsanzeige",
            "style": "Stil",
            "minimumFractionDigits": "Minimale Bruchzahlen",
            "maximumFractionDigits": "Maximale Bruchzahlen",
            "useGrouping": "Gruppierung Separatoren verwenden"
        },
        "probability":{
            "title": "Wahrscheinlichkeit Zahlenformat",
            "style": "Stil",
            "minimumFractionDigits": "Minimale Bruchzahlen",
            "maximumFractionDigits": "Maximale Bruchzahlen",
            "fontSize": "Schriftgröße",
            "color": "Farbe"
        },
        "node":{
            "title": "Knoten",
            "strokeWidth": "Strichbreite",
            "optimal":{
                "title": "Optimal",
                "stroke": "Farbe",
                "strokeWidth": "Strichbreite"
            },
            "label": {
                "title": "Beschreibung",
                "fontSize": "Beschreibung Schriftgröße",
                "color": "Beschreibungsfarbe"
            },
            "payoff": {
                "title": "Auszahlung",
                "fontSize": "Schriftgröße",
                "color": "Farbe",
                "negativeColor": "Negative Farbe"
            },
            "decision": {
                "title": "Entscheidungsknoten",
                "fill": "Füllfarbe",
                "stroke": "Strichfarbe",
                "selected": {
                    "fill": "Ausgewählte Füllfarbe"
                }
            },
            "chance": {
                "title": "Zufall Knoten",
                "fill": "Füllfarbe",
                "stroke": "Strichfarbe",
                "selected": {
                    "fill": "Ausgewählte Füllfarbe"
                }
            },
            "terminal":{
                "title": "Endknoten",
                "fill": "Füllfarbe",
                "stroke": "Strichfarbe",
                "selected": {
                    "fill": "Ausgewählte Füllfarbe"
                },
                "payoff": {
                    "title": "Auszahlung",
                    "fontSize": "Schriftgröße",
                    "color": "Farbe",
                    "negativeColor": "Negative Farbe"
                }
            }
        },
        "edge":{
            "title": " Zweig",
            "stroke": "Farbe",
            "strokeWidth": "Strichbreite",
            "optimal":{
                "title": "Optimal",
                "stroke": "Farbe",
                "strokeWidth": "Strichbreite"
            },
            "selected":{
                "title": "Ausgewählt",
                "stroke": "Farbe",
                "strokeWidth": "Strichbreite"
            },
            "label": {
                "title": "Beschreibung",
                "fontSize": "Schriftgröße",
                "color": "Farbe"
            },
            "payoff":{
                "title": "Auszahlung",
                "fontSize": "Schriftgröße",
                "color": "Farbe",
                "negativeColor": "Negative Farbe"
            }
        },
        "diagramTitle":{
            "title": "Diagrammtitel",
            "fontSize": "Schriftgröße",
            "fontWeight": "Schriftgewicht",
            "fontStyle": "Schriftstil",
            "color": "Farbe",
            "margin":{
                "title": "Rand",
                "top": "Oben",
                "bottom": "Unten"
            },
            "description":{
                "title": "Untertitel (Diagrammbeschreibung)",
                "show": "Anzeigen",
                "fontSize": "Schriftgröße",
                "fontWeight": "Schriftgewicht",
                "fontStyle": "Schriftstil",
                "color": "Farbe",
                "marginTop": "Rand Oben"
            }
        },
        "leagueTable": {
            "title": "Rangliste",
            "plot": {
                "title": "Plot",
                "maxWidth": "Max Breite",
                "highlightedColor": "Farbe der markierten Regel",
                "highlightedDefaultColor": "Empfohlene Regel(für Standard-WTP) Farbe",
                "extendedDominatedColor": "Farbe der erweitert-dominierten Regel",
                "dominatedColor": "Farbe der dominierten Regel",
                "defaultColor": "Farbe der anderen Regeln"
            }
        },
        "other":{
            "title": "Weitere",
            "disableAnimations": "Animationen Deaktivieren",
            "forceFullEdgeRedraw": "Erzwingt vollständige Neuzeichnung der Zweige",
            "hideLabels": "Verstecke Beschreibung",
            "hidePayoffs": "Verstecke Auszahlungen",
            "hideProbabilities": "Verstecke Wahrscheinlichkeiten",
            "raw": "Rau"
        }
    },
    "aboutDialog":{
        "title": "Über"
    },
    "help":{
        "header": "Hilfe",
        "mouse": {
            "header":"Mausaktionen:",
            "list":{
                "1": "Linke Maustaste: Knoten/Zweig Auswahl",
                "2": "Rechte Maustaste: Kontextmenü (Hinzufügen / Manipulieren von Knoten)",
                "3": "Linke Maus Doppelklick: Kontextmenü"
            }
        },
        "keyboard": {
            "header":"Tastatur:",
            "list":{
                "1": "Del: ausgewählte Knoten Löschen",
                "2": "Ctrl-C/X: ausgewählte Knoten Kopieren/Ausschneiden",
                "3": "Ctrl-V: kopierte Knoten als Teilbaum ausgewähltes Knotens einfügen",
                "4": "Ctrl-Y/Z: Rückgängig/Wiederholen",
                "5": "Ctrl-Alt-D/C/T: Neue Entscheidungs/Zufall/Endsknoten als Unterknoten von <strong>ausgewähltem Knoten</strong>",
                "6": "Ctrl-Alt-D/C: Neue Entscheidungs/Zufall Knoten in <strong>ausgewählten Zweig </strong> Injizieren"
            }
        },
        "docs": "Die Dokumentation von SilverDecisions ist unter <a href=\"https://github.com/SilverDecisions/SilverDecisions/wiki/Documentation\" target=\"_blank\">here</a> verfügbar"
    },
    "definitionsDialog":{
        "title": "Variablendefinitionen",
        "scope": {
            "global": "Globaler Anwendungsbereich",
            "node": "Gewählten Knoten und Teilbaum Anwendungsbereich"
        },
        "buttons":{
            "recalculate": "Neu berechnen"
        },
        "evaluatedVariables": "Ausgewertete Variablen"
    },
    "sidebarDefinitions":{
        "scope":{
            "label": "Variabel Anwendungsbereich:",
            "global": "Globaler",
            "node": "Gewählten Knoten und Teilbaum"
        },
        "header": "Variablen",
        "code": "Code",
        "buttons":{
            "openDialog" : "Dialog Öffnen",
            "recalculate": "Neu berechnen"
        },
        "evaluatedVariables": "Ausgewertete Variablen"
    },
    "multipleCriteria":{
        "header": "Mehrere Kriterien",
        "defaultMaximizedCriterionName": "Effekt",
        "defaultMinimizedCriterionName": "Kosten",
        "nameOfCriterion1": "Name des Kriteriums 1",
        "nameOfCriterion2": "Name des Kriteriums 2",
        "defaultCriterion1Weight": "Default 1. Kriterium Gewicht",
        "weightLowerBound": "Gewicht untere Grenze",
        "weightUpperBound": "Gewicht obere Grenze",
        "buttons":{
            "showLeagueTable" : "Rangliste anzeigen",
            "flip": "Flip"
        }
    },
    "layoutOptions":{
        "header": "Layout",
        "marginHorizontal": "Horizontaler Rand",
        "marginVertical": "Vertikaler Rand",
        "nodeSize": "Knotengröße",
        "edgeSlantWidthMax": "Kantenschräge (max)",
        "gridWidth": "Breite",
        "gridHeight": "Höhe"
    },
    "diagramDetails":{
        "header": "Einzelheiten",
        "title" : "Titel",
        "description" : "Beschreibung"
    },
    "objectProperties":{
        "header":{
            "node":{
                "decision":"Entscheidungsknoten",
                "chance":"Zufall Knoten",
                "terminal":"Endknoten"
            },
            "edge": "Zweig",
            "text": "Schwimmender Text"
        },
        "childrenProperties":{
            "node":{
                "header": "Verbindungen",
                "child": {
                    "header": "Zweig #{{number}}"
                }
            }
        }
    },
    "confirm":{
        "newDiagram": "Möchten Sie das aktuelle Diagramm wirklich löschen? Alle nicht gespeicherten Daten werden verloren.",
        "openDiagram": "Sind Sie sicher? Alle nicht gespeicherten Diagrammdaten werden verloren.",
        "beforeunload": "Sind Sie sicher, dass Sie SilverDecisions schließen möchten? Alle nicht gespeicherten Diagrammdaten werden verloren."
    },
    "error":{
        "jsonParse": "Fehler beim Analysieren der Datei!",
        "fileApiNotSupported":"Die Datei-API wird in diesem Browser noch nicht unterstützt.",
        "inputFilesProperty":"Ihr Browser scheint die `files`-Eigenschaft der Dateieingaben nicht zu unterstützen.",
        "notSilverDecisionsFile":"Keine SilverDecisions-Datei!",
        "incorrectVersionFormat": "Falsches Format der Versionszeichenfolge!",
        "fileVersionNewerThanApplicationVersion": "Version der Datei ist neuer als Version des Softwares. Einige Funktionen möglicherweise fehlen.",
        "objectiveComputationFailure": "Fehler beim Berechnen von Objektiven!",
        "diagramDrawingFailure": "Fehler beim Zeichnen des Diagramms!",
        "malformedData":"Fehler beim Lesen der Baumdaten!",
        "pngExportNotSupported": "Der Export nach PNG wird in Ihrem Browser nicht unterstützt.",
        "pngExportNotSupportedIE": "Der Export nach PNG wird in Internet Explorer nicht unterstützt.",
        "svgExportNotSupported": "Der Export nach SVG wird in Ihrem Browser nicht unterstützt.",
        "pdfExportNotSupported": "Der Export nach PDF wird in Ihrem Browser nicht unterstützt.",
        "incorrectPayoffNumberFormatOptions": "Falsche Auszahlungsformat Optionen",
        "incorrectProbabilityNumberFormatOptions": "Falsche Wahrscheinlichkeitsformat Optionen",
        "incorrectNumberFormatOptions": "Falsche Zahlenformat, die Standardeinstellungen angewendet.",
        "jsPDFisNotIncluded": "jsPDF ist nicht enthalten!",
        "serverSideExportRequestFailure": "Export Server Anfrage fehlgeschlagen!"
    }
}

},{}],103:[function(require,module,exports){
module.exports={
    "toolbar": {
        "newDiagram": "New diagram",
        "openDiagram": "Open existing diagram",
        "saveDiagram": "Save current diagram",
        "export":{
            "label": "Export to",
            "png": "Png",
            "svg": "Svg",
            "pdf": "Pdf"
        },
        "layout":{
            "label": "Layout",
            "manual": "Manual",
            "tree": "Tree",
            "cluster": "Cluster"
        },
        "viewMode": {
            "label": "View",
            "options": {
                "criterion1":"Criterion 1",
                "criterion2":"Criterion 2",
                "twoCriteria":"Two criteria"
            }
        },
        "objectiveRule":{
            "label": "Rule",
            "options": {
                "expected-value-maximization":"max",
                "expected-value-minimization":"min",
                "maxi-min":"maxi-min",
                "maxi-max":"maxi-max",
                "mini-min":"mini-min",
                "mini-max":"mini-max",
                "min-max":"min-max",
                "max-min":"max-min",
                "min-min": "min-min",
                "max-max": "max-max"
            }
        },
        "undo": "Undo",
        "redo": "Redo",
        "settings": "Settings",
        "about": "About",
        "sensitivityAnalysis": "Sensitivity analysis",
        "recompute": "Recompute"
    },
    "node":{
        "name": "Label"
    },
    "edge":{
        "name": "Label",
        "payoff": "Payoff",
        "probability": "Probability"
    },
    "text":{
        "value": "Text"
    },
    "leagueTableDialog":{
        "title": "League table",
        "buttons": {
            "downloadCsv": "Download CSV"
        }
    },
    "leagueTable": {
        "headers":{
            "policyNo": "Policy #",
            "policy": "Policy",
            "comment": "Comment"
        },
        "comment":{
            "dominatedBy": "dominated (by #{{policy}})",
            "extendedDominatedBy": "extended-dominated (by #{{policy1}} and #{{policy2}})",
            "incratio": "incremental ratio={{incratio}}"
        },
        "plot":{
            "groups":{
                "highlighted": "Recommended (for some WTP in range)",
                "highlighted-default": "Recommended (for default WTP)",
                "extended-dominated" : "Extended-dominated",
                "dominated": "Dominated",
                "default": "Other"
            },
            "tooltip":{
                "gradientArrow1": "Direction of {{name}} optimization",
                "gradientArrow2": "Direction of {{name}} optimization",
                "dominatedRegion": "Not recommended region"
            },
            "legend":{
                "dominatedRegion": "Grey area highlights not recommended region",
                "gradientArrows": "Arrows indicate improvement direction"
            }
        }
    },
    "sensitivityAnalysisDialog":{
        "title": "Sensitivity analysis",
        "buttons": {
            "runJob": "Run",
            "stopJob": "Stop",
            "terminateJob": "Terminate",
            "resumeJob": "Resume",
            "downloadCsv": "Download CSV",
            "back": "Back",
            "clear": "Clear"
        }
    },
    "jobParametersBuilder": {
        "buttons": {
            "removeParameterValue": "Remove",
            "addParameterValue": "Add"
        }
    },
    "jobResultTable":{
        "tooltip": {
            "multiplePoliciesInCell": "{{number}} policies"
        },
        "pivot": {
            "aggregators":{
                "maximum": "Maximum",
                "minimum": "Minimum"
            },
            "renderers":{
                "heatmap": "Heatmap"
            }
        },
        "policyPreview": "policy preview"
    },
    "job":{
        "sensitivity-analysis":{
            "name": "N-way sensitivity analysis",
            "param":{
                "ruleName": "Rule name",
                "extendedPolicyDescription": {
                    "label": "Extended policy description"
                },
                "variables": {
                    "label": "Variables",
                    "name": {
                        "label": "Name"
                    },
                    "min": {
                        "label": "Min"
                    },
                    "max": {
                        "label": "Max"
                    },
                    "length": {
                        "label": "Length"
                    },
                    "step": {
                        "label": "Step"
                    }
                }
            },
            "errors":{
                "computations": "Error in sensitivity analysis computations for the following parameters:"
            },
            "warnings": {
                "largeScenariosNumber": "Number of defined scenarios larger than {{numberFormatted}}. Sensitivity analysis might fail to compute or be very slow.",
                "largeParametersNumber": "Number of parameters larger than {{number}}. Sensitivity analysis display might fail or be very slow."
            }
        },
        "tornado-diagram":{
            "name": "Tornado diagram",
            "param":{
                "ruleName": "Rule name",
                "extendedPolicyDescription": {
                    "label": "Extended policy description"
                },
                "variables": {
                    "label": "Variables",
                    "name": {
                        "label": "Name"
                    },
                    "min": {
                        "label": "Min"
                    },
                    "max": {
                        "label": "Max"
                    },
                    "length": {
                        "label": "Length"
                    },
                    "step": {
                        "label": "Step"
                    },
                    "defaultValue": {
                        "label": "Default value"
                    }
                }
            },
            "errors":{
                "computations": "Error in sensitivity analysis computations for the following parameters:"
            },
            "warnings": {
                "largeScenariosNumber": "Number of defined scenarios larger than {{numberFormatted}}. Sensitivity analysis might fail to compute or be very slow.",
                "largeParametersNumber": "Number of parameters larger than {{number}}. Sensitivity analysis display might fail or be very slow."
            },
            "plot":{
                "legend":{
                    "low": "Decrease",
                    "high": "Increase"
                },
                "xAxisTitle": "Payoff"
            }
        },
        "probabilistic-sensitivity-analysis":{
            "name": "Probabilistic sensitivity analysis",
            "param":{
                "ruleName": "Rule name",
                "numberOfRuns": {
                    "label": "Number of runs"
                },
                "extendedPolicyDescription": {
                    "label": "Extended policy description"
                },
                "variables": {
                    "label": "Variables",
                    "name": {
                        "label": "Name"
                    },
                    "formula": {
                        "label": "Formula",
                        "help": "Select formula template from the menu or write custom code"
                    }
                }
            },
            "errors":{
                "computations": "Error in sensitivity analysis computations for the following parameters:",
                "param-computation": "Error computing parameter values:"
            },
            "warnings": {
                "largeScenariosNumber": "Number of defined scenarios larger than {{numberFormatted}}. Sensitivity analysis might fail to compute or be very slow."
            }
        },
        "spider-plot": {
            "name": "Spider plot",
            "param": {
                "ruleName": "Rule name",
                "extendedPolicyDescription": {
                    "label": "Extended policy description"
                },
                "percentageChangeRange": {
                    "label": "+/- percentage change to consider"
                },
                "length": {
                    "label": "Number of values to test",
                    "help": "Number of values to test (in one side of range)"
                },
                "variables": {
                    "label": "Variables",
                    "name": {
                        "label": "Name"
                    },
                    "defaultValue": {
                        "label": "Default value"
                    }
                }
            },
            "errors": {
                "computations": "Error in sensitivity analysis computations for the following parameters:"
            },
            "warnings": {
                "largeScenariosNumber": "Number of defined scenarios larger than {{numberFormatted}}. Sensitivity analysis might fail to compute or be very slow."
            },
            "plot": {
                "legend": {},
                "xAxisTitle": "Percentage change",
                "yAxisTitle": "Payoff"
            }
        },
        "league-table":{
            "name": "League table"
        },
        "errors":{
            "generic": "Error in {{jobName}} computations: {{message}}",
            "params": "Incorrect {{jobName}} parameters"
        }
    },
    "settingsDialog":{
        "title": "Settings",
        "general":{
            "title": "General",
            "fontSize": "Font size",
            "fontFamily": "Font family",
            "fontWeight": "Font weight",
            "fontStyle": "Font style",
            "numberFormatLocale": "Number format locale"
        },
        "payoff1":{
            "title": "Payoff 1 number format",
            "currency": "Currency",
            "currencyDisplay": "Currency display",
            "style": "Style",
            "minimumFractionDigits": "Minimum fraction digits",
            "maximumFractionDigits": "Maximum fraction digits",
            "useGrouping": "Use grouping separators"
        },
        "payoff2":{
            "title": "Payoff 2 number format",
            "currency": "Currency",
            "currencyDisplay": "Currency display",
            "style": "Style",
            "minimumFractionDigits": "Minimum fraction digits",
            "maximumFractionDigits": "Maximum fraction digits",
            "useGrouping": "Use grouping separators"
        },
        "probability":{
            "title": "Probability number format",
            "style": "Style",
            "minimumFractionDigits": "Minimum fraction digits",
            "maximumFractionDigits": "Maximum fraction digits",
            "fontSize": "Font size",
            "color": "Color"
        },
        "node":{
            "title": "Node",
            "strokeWidth": "Stroke width",
            "optimal":{
                "title": "Optimal",
                "stroke": "Color",
                "strokeWidth": "Stroke width"
            },
            "label": {
                "title": "Label",
                "fontSize": "Label font size",
                "color": "Label color"
            },
            "payoff": {
                "title": "Payoff",
                "fontSize": "Font size",
                "color": "Color",
                "negativeColor": "Negative color"
            },
            "decision": {
                "title": "Decision Node",
                "fill": "Fill color",
                "stroke": "Stroke color",
                "selected": {
                    "fill": "Selected fill color"
                }
            },
            "chance": {
                "title": "Chance Node",
                "fill": "Fill color",
                "stroke": "Stroke color",
                "selected": {
                    "fill": "Selected fill color"
                }
            },
            "terminal":{
                "title": "Terminal Node",
                "fill": "Fill color",
                "stroke": "Stroke color",
                "selected": {
                    "fill": "Selected fill color"
                },
                "payoff": {
                    "title": "Payoff",
                    "fontSize": "Font size",
                    "color": "Color",
                    "negativeColor": "Negative color"
                }
            }
        },
        "edge":{
            "title": "Edge",
            "stroke": "Color",
            "strokeWidth": "Stroke width",
            "optimal":{
                "title": "Optimal",
                "stroke": "Color",
                "strokeWidth": "Stroke width"
            },
            "selected":{
                "title": "Selected",
                "stroke": "Color",
                "strokeWidth": "Stroke width"
            },
            "label": {
                "title": "Label",
                "fontSize": "Font size",
                "color": "Color"
            },
            "payoff":{
                "title": "Payoff",
                "fontSize": "Font size",
                "color": "Color",
                "negativeColor": "Negative color"
            }
        },
        "diagramTitle":{
            "title": "Diagram title",
            "fontSize": "Font size",
            "fontWeight": "Font weight",
            "fontStyle": "Font style",
            "color": "Color",
            "margin":{
                "title": "Margin",
                "top": "Top",
                "bottom": "Bottom"
            },
            "description":{
                "title": "Subtitle (diagram description)",
                "show": "Show",
                "fontSize": "Font size",
                "fontWeight": "Font weight",
                "fontStyle": "Font style",
                "color": "Color",
                "marginTop": "Margin top"
            }
        },
        "leagueTable": {
            "title": "League Table",
            "plot": {
                "title": "Plot",
                "maxWidth": "Max width",
                "highlightedColor": "Recommended (for some WTP in range) policy color",
                "highlightedDefaultColor": "Recommended (for default WTP) policy color",
                "extendedDominatedColor": "Extended dominated policy color",
                "dominatedColor": "Dominated policy color",
                "defaultColor": "Other policies color"
            }
        },
        "other":{
            "title": "Other",
            "disableAnimations": "Disable animations",
            "forceFullEdgeRedraw": "Force full redraw of edges",
            "hideLabels": "Hide labels",
            "hidePayoffs": "Hide payoffs",
            "hideProbabilities": "Hide probabilities",
            "raw": "Raw"
        }
    },
    "aboutDialog":{
        "title": "About"
    },
    "help":{
        "header": "Help",
        "mouse": {
            "header":"Mouse actions:",
            "list":{
                "1": "left mouse button: node/edge selection",
                "2": "right mouse button: context menu (adding/manipulating nodes)",
                "3": "left mouse dbclick: context menu"
            }
        },
        "keyboard": {
            "header":"Keyboard:",
            "list":{
                "1": "Del: delete selected nodes",
                "2": "Ctrl-C/X: copy/cut selected nodes",
                "3": "Ctrl-V: paste copied nodes as a subtree of a selected node",
                "4": "Ctrl-Y/Z: undo/redo",
                "5": "Ctrl-Alt-D/C/T: add new Decision/Chance/Terminal subnode of a <strong>selected node</strong>",
                "6": "Ctrl-Alt-D/C: inject new Decision/Chance node into a <strong>selected edge</strong>"
            }
        },
        "docs": "Documentation of SilverDecisions is available <a href=\"https://github.com/SilverDecisions/SilverDecisions/wiki/Documentation\" target=\"_blank\">here</a>"
    },
    "definitionsDialog":{
        "title": "Variable definitions",
        "scope": {
            "global": "global scope",
            "node": "selected node and subtree scope"
        },
        "buttons":{
            "recalculate": "Recalculate"
        },
        "evaluatedVariables": "Evaluated variables"
    },
    "sidebarDefinitions":{
        "scope":{
            "label": "Variable scope:",
            "global": "global",
            "node": "selected node and subtree"
        },
        "header": "Variables",
        "code": "Code",
        "buttons":{
            "openDialog" : "Open dialog",
            "recalculate": "Recalculate"
        },
        "evaluatedVariables": "Evaluated variables"
    },
    "multipleCriteria":{
        "header": "Multiple criteria",
        "defaultMaximizedCriterionName": "Effect",
        "defaultMinimizedCriterionName": "Cost",
        "nameOfCriterion1": "Name for criterion 1",
        "nameOfCriterion2": "Name for criterion 2",
        "defaultCriterion1Weight": "Default 1st criterion weight",
        "weightLowerBound": "Weight lower bound",
        "weightUpperBound": "Weight upper bound",
        "buttons":{
            "showLeagueTable" : "Show league table",
            "flip": "Flip"
        }
    },
    "layoutOptions":{
        "header": "Layout",
        "marginHorizontal": "Horizontal Margin",
        "marginVertical": "Vertical Margin",
        "nodeSize": "Node size",
        "edgeSlantWidthMax": "Edge slant (max)",
        "gridWidth": "Width",
        "gridHeight": "Height"
    },
    "diagramDetails":{
        "header": "Details",
        "title" : "Title",
        "description" : "Description"
    },
    "objectProperties":{
        "header":{
            "node":{
                "decision":"Decision Node",
                "chance":"Chance Node",
                "terminal":"Terminal Node"
            },
            "edge": "Edge",
            "text": "Floating text"
        },
        "childrenProperties":{
            "node":{
                "header": "Connections",
                "child": {
                    "header": "Edge #{{number}}"
                }
            }
        }
    },
    "confirm":{
        "newDiagram": "Do you really want to clear current diagram? All unsaved data will be lost.",
        "openDiagram": "Are you sure? All unsaved diagram data will be lost.",
        "beforeunload": "Are you sure you want to close SilverDecisions? All unsaved diagram data will be lost."
    },
    "error":{
        "jsonParse": "Error parsing file!",
        "fileApiNotSupported":"The file API isn't supported on this browser yet.",
        "inputFilesProperty":"Your browser doesn't seem to support the `files` property of file inputs.",
        "notSilverDecisionsFile":"Not a SilverDecisions file!",
        "incorrectVersionFormat": "Incorrect format of version string!",
        "fileVersionNewerThanApplicationVersion": "Version in file is newer than version of the application. Some features may be missing.",
        "objectiveComputationFailure": "Error while computing objective!",
        "diagramDrawingFailure": "Error while drawing diagram!",
        "malformedData":"Error reading tree data!",
        "pngExportNotSupported": "Export to PNG is not supported in your browser.",
        "pngExportNotSupportedIE": "Export to PNG not supported in Internet Explorer.",
        "svgExportNotSupported": "Export to SVG is not supported in your browser.",
        "pdfExportNotSupported": "Export to PDF is not supported in your browser.",
        "incorrectPayoffNumberFormatOptions": "Incorrect payoff number format options",
        "incorrectProbabilityNumberFormatOptions": "Incorrect probability number format options",
        "incorrectNumberFormatOptions": "Incorrect number format options, using default.",
        "jsPDFisNotIncluded": "jsPDF is not included!",
        "serverSideExportRequestFailure": "Export Server request failed!"
    }
}

},{}],104:[function(require,module,exports){
module.exports={
    "toolbar": {
        "newDiagram": "Nouveau diagramme",
        "openDiagram": "Ouvrir le diagramme existant",
        "saveDiagram": "Enregistrer le diagramme actuel",
        "export":{
            "label": "Exporter vers",
            "png": "Png",
            "svg": "Svg",
            "pdf": "Pdf"
        },
        "layout":{
            "label": "Disposition",
            "manual": "Manuel",
            "tree": "Arbre",
            "cluster": "Grappe"
        },
        "viewMode": {
            "label": "Vue",
            "options": {
                "criterion1":"Critère 1",
                "criterion2":"Critère 2",
                "twoCriteria":"Deux critères"
            }
        },
        "objectiveRule":{
            "label": "Regle",
            "options": {
                "expected-value-maximization":"max",
                "expected-value-minimization":"min",
                "maxi-min":"maxi-min",
                "maxi-max":"maxi-max",
                "mini-min":"mini-min",
                "mini-max":"mini-max",
                "min-max":"min-max",
                "max-min":"max-min",
                "min-min": "min-min",
                "max-max": "max-max"
            }
        },
        "undo": "Annuler",
        "redo": "Refaire",
        "settings": "Parametres",
        "about": "A propos",
        "sensitivityAnalysis": "Analyse de sensibilité",
        "recompute": "Recalculer"
    },
    "node":{
        "name": "Étiquette"
    },
    "edge":{
        "name": "Étiquette",
        "payoff": "Avantage",
        "probability": "Probabilité"
    },
    "text":{
        "value": "Texte"
    },
    "leagueTableDialog":{
        "title": "Classement",
        "buttons": {
            "downloadCsv": "Télécharger CSV"
        }
    },
    "leagueTable": {
        "headers":{
            "policyNo": "Règle #",
            "policy": "Règle",
            "comment": "Commentaire"
        },
        "comment":{
            "dominatedBy": "Dominé (par #{{policy}})",
            "extendedDominatedBy": "Étendu-dominé (par #{{policy1}} et #{{policy2}})",
            "incratio": "Ratio incrémental={{incratio}}"
        },
        "plot":{
            "groups":{
                "highlighted": "Surligné",
                "highlighted-default": "Recommandée (pour WTP par défaut)",
                "extended-dominated" : "Étendu-dominé",
                "dominated": "Dominé",
                "default": "Autre"
            },
            "tooltip":{
                "gradientArrow1": "La direction de {{name}} optimisation",
                "gradientArrow2": "La direction de {{name}} optimisation",
                "dominatedRegion": "Région dominée"
            },
            "legend":{
                "dominatedRegion": "La région grise surligne la région dominée",
                "gradientArrows": "Les flèches indiquent une direction d'amélioration"
            }
        }
    },
    "sensitivityAnalysisDialog":{
        "title": "Analyse de sensibilité",
        "buttons": {
            "runJob": "Exécuter",
            "stopJob": "Arrêter",
            "terminateJob": "Terminer",
            "resumeJob": "Reprendre",
            "downloadCsv": "Télécharger CSV",
            "back": "Retourner",
            "clear": "Effacer"
        }
    },
    "jobParametersBuilder": {
        "buttons": {
            "removeParameterValue": "Effacer",
            "addParameterValue": "Ajouter"
        }
    },
    "jobResultTable":{
        "tooltip": {
            "multiplePoliciesInCell": "{{number}} règles"
        },
        "pivot": {
            "aggregators":{
                "maximum": "Maximum",
                "minimum": "Minimum"
            },
            "renderers":{
                "heatmap": "Carte de chaleur"
            }
        },
        "policyPreview": "Aperçu de la règle"
    },
    "job":{
        "sensitivity-analysis":{
            "name": "Analyse de sensibilité multivariée",
            "param":{
                "ruleName": "Nom de la règle",
                "extendedPolicyDescription": {
                    "label": "Description détaillée de la règle"
                },
                "variables": {
                    "label": "Variables",
                    "name": {
                        "label": "Étiquette"
                    },
                    "min": {
                        "label": "Min"
                    },
                    "max": {
                        "label": "Max"
                    },
                    "length": {
                        "label": "Longueur"
                    },
                    "step": {
                        "label": "Étape"
                    }
                }
            },
            "errors":{
                "computations": "Erreur de calcul d'analyse de sensibilité pour les paramètres suivants:"
            },
            "warnings": {
                "largeScenariosNumber": "Nombre de scénarios définis est plus grand que {{numberFormatted}}. Analyse de sensibilité pouvait ne pas calculer ou être très lente.",
                "largeParametersNumber": "Nombre de paramètres est plus grand que {{number}}. Affichage de l'analyse de sensibilité pouvait échouer ou être très lente."
            }
        },
        "tornado-diagram":{
            "name": "Graphique en tornade",
            "param":{
                "ruleName": "Nom de la règle",
                "extendedPolicyDescription": {
                    "label": "Description détaillée de la règle"
                },
                "variables": {
                    "label": "Variables",
                    "name": {
                        "label": "Étiquette"
                    },
                    "min": {
                        "label": "Min"
                    },
                    "max": {
                        "label": "Max"
                    },
                    "length": {
                        "label": "Longueur"
                    },
                    "step": {
                        "label": "Étape"
                    },
                    "defaultValue": {
                        "label": "Valeur par défaut"
                    }
                }
            },
            "errors":{
                "computations": "Erreur de calcul d'analyse de sensibilité pour les paramètres suivants:"
            },
            "warnings": {
                "largeScenariosNumber": "Nombre de scénarios définis est plus grand que {{numberFormatted}}. Analyse de sensibilité pouvait ne pas calculer ou être très lente.",
                "largeParametersNumber": "Nombre de paramètres est plus grand que {{number}}. Affichage de l'analyse de sensibilité pouvait échouer ou être très lente."
            },
            "plot":{
                "legend":{
                    "low": "Diminuer",
                    "high": "Augmenter"
                },
                "xAxisTitle": "Avantage"
            }
        },
        "probabilistic-sensitivity-analysis":{
            "name": "Analyse de sensibilité probabiliste",
            "param":{
                "ruleName": "Nom de la règle",
                "numberOfRuns": {
                    "label": "Nombre d'essais"
                },
                "extendedPolicyDescription": {
                    "label": "Description détaillée de la règle"
                },
                "variables": {
                    "label": "Variables",
                    "name": {
                        "label": "Étiquette"
                    },
                    "formula": {
                        "label": "Formule",
                        "help": "Sélectionner le modèle de la formule dans le menu ou écrire un code personnalisé."
                    }
                }
            },
            "errors":{
                "computations": "Erreur de calcul d'analyse de sensibilité pour les paramètres suivants:",
                "param-computation": "Erreur de calcul des valeurs de paramètres:"
            },
            "warnings": {
                "largeScenariosNumber": "Nombre de scénarios définis est plus grand que {{numberFormatted}}. Analyse de sensibilité pouvait ne pas calculer ou être très lente."
            }
        },
        "spider-plot": {
            "name": "Graphique en radar",
            "param": {
                "ruleName": "Nom de la règle",
                "extendedPolicyDescription": {
                    "label": "Description détaillée de la règle"
                },
                "percentageChangeRange": {
                    "label": "+/- changement de pourcentage à considérer"
                },
                "length": {
                    "label": "Nombre de valeurs à tester",
                    "help": "Nombre de valeurs à tester (dans une partie de gamme)"
                },
                "variables": {
                    "label": "Variables",
                    "name": {
                        "label": "Nom"
                    },
                    "defaultValue": {
                        "label": "Valeur par défaut"
                    }
                }
            },
            "errors": {
                "computations": "Erreur de calcul d'analyse de sensibilité pour les paramètres suivants:"
            },
            "warnings": {
                "largeScenariosNumber": "Nombre de scénarios définis est plus grand que {{numberFormatted}}. Analyse de sensibilité pouvait ne pas calculer ou être très lente."
            },
            "plot": {
                "legend": {},
                "xAxisTitle": "Changement de pourcentage",
                "yAxisTitle": "Avantage"
            }
        },
        "league-table":{
            "name": "Classement"
        },
        "errors":{
            "generic": "Erreur de calcul d'analyse de sensibilité: {{message}}",
            "params": "Paramètres du {{jobName}} sont incorrect"
        }
    },
    "settingsDialog":{
        "title": "Parametres",
        "general":{
            "title": "Général",
            "fontSize": "Taille de la police",
            "fontFamily": "Famille de police",
            "fontWeight": "Poid de la police",
            "fontStyle": "Style de police",
            "numberFormatLocale": "format local de numérotation"
        },
        "payoff1":{
            "title": "Format de la numérotation des avantages 1",
            "currency": "Devise",
            "currencyDisplay": "Affichage de la devise",
            "style": "Style",
            "minimumFractionDigits": "Nombre minimum de fractions",
            "maximumFractionDigits": "Nombre maximum de fractions",
            "useGrouping": "Utiliser des séparateurs de regroupement"
        },
        "payoff2":{
            "title": "Format de la numérotation des avantages 2",
            "currency": "Devise",
            "currencyDisplay": "Affichage de la devise",
            "style": "Style",
            "minimumFractionDigits": "Nombre minimum de fractions",
            "maximumFractionDigits": "Nombre maximum de fractions",
            "useGrouping": "Utiliser des séparateurs de regroupement"
        },
        "probability":{
            "title": "Format de la numérotatio des probabilités",
            "style": "Style",
            "minimumFractionDigits": "Nombre minimum de fractions",
            "maximumFractionDigits": "Nombre maximum de fractions",
            "fontSize": "Taille de police",
            "color": "Couleur"
        },
        "node":{
            "title": "Noud",
            "strokeWidth": "Largeur de trait",
            "optimal":{
                "title": "Optimal",
                "stroke": "Couleur",
                "strokeWidth": "Largeur de trait"
            },
            "label": {
                "title": "Étiquette",
                "fontSize": "Taille de la police de l'étiquette",
                "color": "Couleur de l'étiquette"
            },
            "payoff": {
                "title": "Avantage",
                "fontSize": "Taille de la police",
                "color": "Couleur",
                "negativeColor": "Négatif couleur"
            },
            "decision": {
                "title": "Noeud décisionnel",
                "fill": "La couleur de remplissage",
                "stroke": "Couleur de trait",
                "selected": {
                    "fill": "Couleur de remplissage sélectionnée"
                }
            },
            "chance": {
                "title": "Noud aléatoire",
                "fill": "La couleur de remplissage",
                "stroke": "Couleur de course",
                "selected": {
                    "fill": "Couleur de remplissage sélectionné"
                }
            },
            "terminal":{
                "title": "Noeud terminal",
                "fill": "Couleur de remplissage",
                "stroke": "Couleur de course",
                "selected": {
                    "fill": "Couleur de remplissage sélectionné"
                },
                "payoff": {
                    "title": "Avantage",
                    "fontSize": "Taille de la police",
                    "color": "Couleur",
                    "negativeColor": "Négatif couleur"
                }
            }
        },
        "edge":{
            "title": "Bord",
            "stroke": "Couleur",
            "strokeWidth": "Largeur de trait",
            "optimal":{
                "title": "Optimal",
                "stroke": "Couleur",
                "strokeWidth": "Largeur de trait"
            },
            "selected":{
                "title": "Choisi",
                "stroke": "Couleur",
                "strokeWidth": "Largeur de trait"
            },
            "label": {
                "title": "Étiquette",
                "fontSize": "Taille de la police",
                "color": "Couleur"
            },
            "payoff":{
                "title": "Avantage",
                "fontSize": "Taille de la police",
                "color": "Couleur",
                "negativeColor": "Négatif couleur"
            }
        },
        "diagramTitle":{
            "title": "Titre du diagramme",
            "fontSize": "Taille de la police",
            "fontWeight": "Poids de la police",
            "fontStyle": "Style de la police",
            "color": "Couleur",
            "margin":{
                "title": "Marge",
                "top": "Haut du diagramme",
                "bottom": "Bas du diagramme"
            },
            "description":{
                "title": "Sous-titre (description du diagramme)",
                "show": "Afficher",
                "fontSize": "Taille de la police",
                "fontWeight": "Poids de la police",
                "fontStyle": "Style de police",
                "color": "Couleur",
                "marginTop": "Haut du marge"
            }
        },
        "leagueTable": {
            "title": "Classement",
            "plot": {
                "title": "Le graphe",
                "maxWidth": "Largeur maximale",
                "highlightedColor": "Couleur de la règle soulignée",
                "highlightedDefaultColor": "Couleur recommandée pour la règle (pour WTP par défaut)",
                "extendedDominatedColor": "Couleur de la règle étendu-dominée",
                "dominatedColor": "Couleur de la règle dominée",
                "defaultColor": "Couleur des autres règles"
            }
        },
        "other":{
            "title": "Autre",
            "disableAnimations": "Désactiver les animations",
            "forceFullEdgeRedraw": "Forcer le redessinage complet des bords",
            "hideLabels": "Masquer les étiquettes",
            "hidePayoffs": "Masquer les paiements",
            "hideProbabilities": "Masquer les probabilités",
            "raw": "Brut"
        }
    },
    "aboutDialog":{
        "title": "A propos"
    },
    "help":{
        "header": "Aide",
        "mouse": {
            "header":"Actions de la souris:",
            "list":{
                "1": "Bouton gauche de la souris: sélection du noud/bord",
                "2": "Bouton droit de la souris: menu contextuel (ajout/manipulation des nouds)",
                "3": "Double clic gauche de la souris: menu contextuel"
            }
        },
        "keyboard": {
            "header":"Raccourcis clavier:",
            "list":{
                "1": "Del: effacer les nouds sélectionnés",
                "2": "Ctrl-C/X: copier/couper les nouds sélectionnés",
                "3": "Ctrl-V: coller les nouds copiés comme un sous-arbre d'un noud sélectionné",
                "4": "Ctrl-Y/Z: annuler/refaire",
                "5": "Ctrl-Alt-D/C/T: ajouter un nouveau sous-noud de décision/aléatoire/terminal d'un <strong>noud sélectionné</strong>",
                "6": "Ctrl-Alt-D/C: injecter un nouveau noeud de décision/aléatoire dans un <strong>bord sélectionné</strong>"
            }
        },
        "docs": "La documentation de SilverDecisions est disponible  <a href=\"https://github.com/SilverDecisions/SilverDecisions/wiki/Documentation\" target=\"_blank\">ici</a>"
    },
    "definitionsDialog":{
        "title": "Définitions des variables",
        "scope": {
            "global": "portée mondiale",
            "node": "la portée des nœud et sous-arborescence sélectionné"
        },
        "buttons":{
            "recalculate": "Recalculer"
        },
        "evaluatedVariables": "Variables évaluées"
    },
    "sidebarDefinitions":{
        "scope":{
            "label": "Portée de la variable:",
            "global": "mondial",
            "node": "nœud et sous-arborescence sélectionné"
        },
        "header": "Variables",
        "code": "Code",
        "buttons":{
            "openDialog" : "Ouvrir la boîte de dialogue",
            "recalculate": "Recalculer"
        },
        "evaluatedVariables": "Variables évaluées"
    },
    "multipleCriteria":{
        "header": "Critères multiples",
        "defaultMaximizedCriterionName": "Effet",
        "defaultMinimizedCriterionName": "Coût",
        "nameOfCriterion1": "Le nome de critère 1",
        "nameOfCriterion2": "Le nome de critère 2",
        "defaultCriterion1Weight": "Par défaut poid du 1er critère",
        "weightLowerBound": "Poid de la limite inférieure",
        "weightUpperBound": "Poid de la limite supérieure",
        "buttons":{
            "showLeagueTable" : "Montrer classement",
            "flip": "Basculer"
        }
    },
    "layoutOptions":{
        "header": "Disposition",
        "marginHorizontal": "Marge horizontale",
        "marginVertical": "Marge verticale",
        "nodeSize": "Taille du noeud",
        "edgeSlantWidthMax": "Inclinaison du bord (max.)",
        "gridWidth": "Largeur",
        "gridHeight": "Taille"
    },
    "diagramDetails":{
        "header": "Détails",
        "title" : "Titre",
        "description" : "Description"
    },
    "objectProperties":{
        "header":{
            "node":{
                "decision":"Noeud de décision",
                "chance":"Noud aléatoire",
                "terminal":"Noeud terminal"
            },
            "edge": "Bord",
            "text": "Texte flottant"
        },
        "childrenProperties":{
            "node":{
                "header": "Les connexions",
                "child": {
                    "header": "Bord #{{number}}"
                }
            }
        }
    },
    "confirm":{
        "newDiagram": "Voulez-vous vraiment effacer le diagramme actuel? Toutes les données non enregistrées seront perdues.",
        "openDiagram": "Etes-vous sur? Toutes les données de diagramme non enregistrées seront perdues.",
        "beforeunload": "Voulez-vous vraiment fermer SilverDecisions? Toutes les données de diagramme non enregistrées seront perdues."
    },
    "error":{
        "jsonParse": "Erreur lors de l'analyse du fichier!",
        "fileApiNotSupported":"L'API du fichier n'est pas encore prise en charge sur ce navigateur.",
        "inputFilesProperty":"Votre navigateur ne semble pas prendre en charge la propriété `fichiers`.",
        "notSilverDecisionsFile":"Pas de fichiers SilverDecisions!",
        "incorrectVersionFormat": "Format incorrect de la chaîne de version!",
        "fileVersionNewerThanApplicationVersion": "La version dans le fichier est plus récente que la version de l'application. Certaines fonctionnalités peuvent être manquantes.",
        "objectiveComputationFailure": "Erreur en calculant l'objectif!",
        "diagramDrawingFailure": "Erreur lors du dessin diagramme!",
        "malformedData":"Erreur lors de la lecture des données arborescentes!",
        "pngExportNotSupported": "L'exportation vers PNG n'est pas prise en charge dans votre navigateur.",
        "pngExportNotSupportedIE": "Exporter vers PNG n'est pas pris en charge dans Internet Explorer.",
        "svgExportNotSupported": "L'exportation vers SVG n'est pas prise en charge par votre navigateur.",
        "pdfExportNotSupported": "L'exportation au format PDF n'est pas prise en charge par votre navigateur.",
        "incorrectPayoffNumberFormatOptions": "L'option de format de numérotation des avantages chiosie est incorrecte.",
        "incorrectProbabilityNumberFormatOptions": "L'option de format de numérotation des probabilités chiosie est incorrecte.",
        "incorrectNumberFormatOptions": "L'option de format de numérotation choisie est incorrecte.",
        "jsPDFisNotIncluded": "JsPDF n'est pas inclus!",
        "serverSideExportRequestFailure": "La demande de téléchargement au serveur a échoué!"
    }
}

},{}],105:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.i18n = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _i18next = require('i18next');

var _i18next2 = _interopRequireDefault(_i18next);

var _en = require('./en.json');

var en = _interopRequireWildcard(_en);

var _pl = require('./pl.json');

var pl = _interopRequireWildcard(_pl);

var _it = require('./it.json');

var it = _interopRequireWildcard(_it);

var _de = require('./de.json');

var de = _interopRequireWildcard(_de);

var _fr = require('./fr.json');

var fr = _interopRequireWildcard(_fr);

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var i18n = exports.i18n = function () {
    function i18n() {
        _classCallCheck(this, i18n);
    }

    _createClass(i18n, null, [{
        key: 'init',
        value: function init(lng) {
            i18n.language = lng;
            i18n.$instance = _i18next2.default.createInstance({
                lng: lng,
                fallbackLng: 'en',
                resources: {
                    en: {
                        translation: en
                    },
                    pl: {
                        translation: pl
                    },
                    it: {
                        translation: it
                    },
                    de: {
                        translation: de
                    },
                    fr: {
                        translation: fr
                    }
                }
            }, function (err, t) {});
        }
    }, {
        key: 't',
        value: function t(key, opt) {
            return i18n.$instance.t(key, opt);
        }
    }]);

    return i18n;
}();

},{"./de.json":102,"./en.json":103,"./fr.json":104,"./it.json":106,"./pl.json":107,"i18next":"i18next"}],106:[function(require,module,exports){
module.exports={
    "toolbar": {
        "newDiagram": "Nuovo diagramma",
        "openDiagram": "Apri diagramma esistnte",
        "saveDiagram": "Salva il diagramma corente",
        "export":{
            "label": "Esporta in",
            "png": "Png",
            "svg": "Svg",
            "pdf": "Pdf"
        },
        "layout":{
            "label": "Disposizione",
            "manual": "Manuale",
            "tree": "Albero",
            "cluster": "Grappolo"
        },
        "viewMode": {
            "label": "Vista",
            "options": {
                "criterion1":"Criterio 1",
                "criterion2":"Criterio 2",
                "twoCriteria":"Due criteri"
            }
        },
        "objectiveRule":{
            "label": "Regola",
            "options": {
                "expected-value-maximization":"max",
                "expected-value-minimization":"min",
                "maxi-min":"max-min",
                "maxi-max":"max-max",
                "mini-min":"min-min",
                "mini-max":"min-max",
                "min-max":"min-max",
                "max-min":"max-min",
                "min-min": "min-min",
                "max-max": "max-max"
            }
        },
        "undo": "Ripristina",
        "redo": "Ripeti",
        "settings": "Settaggi",
        "about": "Di",
        "sensitivityAnalysis": "Analisi di sensibilità",
        "recompute": "Ricalcola"
    },
    "node":{
        "name": "Etichetta"
    },
    "edge":{
        "name": "Eticehtta",
        "payoff": "Saldo",
        "probability": "Probabilità"
    },
    "text":{
        "value": "Testo"
    },
    "leagueTableDialog":{
        "title": "Classifica",
        "buttons": {
            "downloadCsv": "Scarica CSV"
        }
    },
    "leagueTable": {
        "headers":{
            "policyNo": "Regola #",
            "policy": "Regola",
            "comment": "Commento"
        },
        "comment":{
            "dominatedBy": "dominata (da #{{policy}})",
            "extendedDominatedBy": "estesa-dominata (da #{{policy1}} e #{{policy2}})",
            "incratio": "rapporto incrementale={{incratio}}"
        },
        "plot":{
            "groups":{
                "highlighted": "Evidenziato",
                "highlighted-default": "Raccomandato (per default WTP)",
                "extended-dominated" : "Estesa-dominata",
                "dominated": "Dominata",
                "default": "Altro"
            },
            "tooltip":{
                "gradientArrow1": "Direzione di {{name}} ottimizzazione",
                "gradientArrow2": "Direzione di {{name}} ottimizzazione",
                "dominatedRegion": "Regione dominata"
            },
            "legend":{
                "dominatedRegion": "L'area grigia evidenzia la regione dominata",
                "gradientArrows": "Le frecce indicano la direzione di miglioramento"
            }
        }
    },
    "sensitivityAnalysisDialog":{
        "title": "Analisi di sensibilità",
        "buttons": {
            "runJob": "Esegui",
            "stopJob": "Stop",
            "terminateJob": "Esci",
            "resumeJob": "Riprendi",
            "downloadCsv": "Scaricare CSV",
            "back": "Indietro",
            "clear": "Cancella"
        }
    },
    "jobParametersBuilder": {
        "buttons": {
            "removeParameterValue": "Cancella",
            "addParameterValue": "Aggiungi"
        }
    },
    "jobResultTable":{
        "tooltip": {
            "multiplePoliciesInCell": "{{number}} politiche"
        },
        "pivot": {
            "aggregators":{
                "maximum": "Massimo",
                "minimum": "Minimo"
            },
            "renderers":{
                "heatmap": "Mappa di calore"
            }
        },
        "policyPreview": "Anteprima della politica"
    },
    "job":{
        "sensitivity-analysis":{
            "name": "Analisi di sensibilità multivariata",
            "param":{
                "ruleName": "Nome alla regola",
                "extendedPolicyDescription": {
                    "label": "Descrizione estesa della politica"
                },
                "variables": {
                    "label": "Variabili",
                    "name": {
                        "label": "Nome"
                    },
                    "min": {
                        "label": "Min"
                    },
                    "max": {
                        "label": "Max"
                    },
                    "length": {
                        "label": "Lunghezza"
                    },
                    "step": {
                        "label": "Passo"
                    }
                }
            },
            "errors":{
                "computations": "Errore nei calcoli di analisi di sensibilità per i seguenti parametri:"
            },
            "warnings": {
                "largeScenariosNumber": "Numero di scenari definiti più grandi di {{numberFormatted}}. Analisi di sensibilità potrebbe non essere calcolata o essere molto lenta.",
                "largeParametersNumber": "Numero di parametri maggiori di {{number}}. La visualizzazione dell'analisi di sensibilità potrebbe non riuscire o essere molto lenta."
            }
        },
        "tornado-diagram":{
            "name": "Diagramma a tornado",
            "param":{
                "ruleName": "Nome alla regola",
                "extendedPolicyDescription": {
                    "label": "Descrizione estesa della politica"
                },
                "variables": {
                    "label": "Variabili",
                    "name": {
                        "label": "Nome"
                    },
                    "min": {
                        "label": "Min"
                    },
                    "max": {
                        "label": "Max"
                    },
                    "length": {
                        "label": "Lunghezza"
                    },
                    "step": {
                        "label": "Passo"
                    },
                    "defaultValue": {
                        "label": "Valore predefinito"
                    }
                }
            },
            "errors":{
                "computations": "Errore nei calcoli di analisi di sensibilità per i seguenti parametri:"
            },
            "warnings": {
                "largeScenariosNumber": "Numero di scenari definiti più grandi di {{numberFormatted}}. Analisi di sensibilità potrebbe non essere calcolata o essere molto lenta.",
                "largeParametersNumber": "Numero di parametri maggiori di {{number}}. La visualizzazione dell'analisi di sensibilità potrebbe non riuscire o essere molto lenta."
            },
            "plot":{
                "legend":{
                    "low": "Decresce",
                    "high": "Cresce"
                },
                "xAxisTitle": "Saldo"
            }
        },
        "probabilistic-sensitivity-analysis":{
            "name": "Analisi di sensibilità probabilistica",
            "param":{
                "ruleName": "Nome alla regola",
                "numberOfRuns": {
                    "label": "Numero di operazioni"
                },
                "extendedPolicyDescription": {
                    "label": "Descrizione estesa della politica"
                },
                "variables": {
                    "label": "Variabili",
                    "name": {
                        "label": "Nome"
                    },
                    "formula": {
                        "label": "Formula",
                        "help": "Seleziona modello di formula dal menu o scrivi un codice personalizzato."
                    }
                }
            },
            "errors":{
                "computations": "Errore nei calcoli di analisi di sensibilità per i seguenti parametri:",
                "param-computation": "Errore di calcolo dei valori dei parametri:"
            },
            "warnings": {
                "largeScenariosNumber": "Numero di scenari definiti più grandi di {{numberFormatted}}. Analisi di sensibilità potrebbe non riuscire o essere molto lenta."
            }
        },
                "spider-plot": {
            "name": "Diagramma di Kiviat",
            "param": {
                "ruleName": "Nome alla regola",
                "extendedPolicyDescription": {
                    "label": "Descrizione estesa della politica"
                },
                "percentageChangeRange": {
                    "label": "+/- variazione percentuale da considerare"
                },
                "length": {
                    "label": "Numero di valpri da testare",
                    "help": "Numero di valpri da testare (in una parte della gamma)"
                },
                "variables": {
                    "label": "Variabili",
                    "name": {
                        "label": "Nome"
                    },
                    "defaultValue": {
                        "label": "Valore predefinito"
                    }
                }
            },
            "errors": {
                "computations": "Errore nei calcoli di analisi di sensibilità per i seguenti parametri:"
            },
            "warnings": {
                "largeScenariosNumber": "Numero di scenari definiti più grandi di {{numberFormatted}}. Analisi di sensibilità potrebbe non riuscire o essere molto lenta."
            },
            "plot": {
                "legend": {},
                "xAxisTitle": "Variazione percentuale",
                "yAxisTitle": "Saldo"
            }
        },
        "league-table":{
            "name": "Classifica"
        },
        "errors":{
            "generic": "Errore nei calcoli di analisi di sensibilità: {{message}}",
            "params": "{{jobName}} parameteri errati"
        }
    },

    "settingsDialog":{
        "title": "Settaggi",
        "general":{
            "title": "Generale",
            "fontSize": "Dimensione font",
            "fontFamily": "Famiglia font",
            "fontWeight": "Peso del font",
            "fontStyle": "Stile font",
            "numberFormatLocale": "Formato numero locale"
        },
        "payoff1":{
            "title": "Formato saldo 1",
            "currency": "Valuta",
            "currencyDisplay": "Visualizzazione valuta",
            "style": "Stile",
            "minimumFractionDigits": "Numero minimo cifre frazione",
            "maximumFractionDigits": "Numero massimo cifre frazione",
            "useGrouping": "Usa separatori di gruppo"
        },
        "payoff2":{
            "title": "Formato saldo 2",
            "currency": "Valuta",
            "currencyDisplay": "Visualizzazione valuta",
            "style": "Stile",
            "minimumFractionDigits": "Numero minimo cifre frazione",
            "maximumFractionDigits": "Numero massimo cifre frazione",
            "useGrouping": "Usa separatori di gruppo"
        },
        "probability":{
            "title": "Formato probabilità",
            "style": "Stile",
            "minimumFractionDigits": "Numero minimo cifre frazione",
            "maximumFractionDigits": "Numero massimo cifre frazione",
            "fontSize": "Dimensione font",
            "color": "Colore"
        },
        "node":{
            "title": "Nodo",
            "strokeWidth": "Spessore linea",
            "optimal":{
                "title": "Ottimale",
                "stroke": "Colore",
                "strokeWidth": "Spessore linea"
            },
            "label": {
                "title": "Etichetta",
                "fontSize": "Dimensione font etichetta",
                "color": "Colore etichetta"
            },
            "payoff": {
                "title": "Saldo",
                "fontSize": "Dimensione font",
                "color": "Colore",
                "negativeColor": "Colore negativo"
            },
            "decision": {
                "title": "Nodo dicisione",
                "fill": "Colore riempimento",
                "stroke": "Colore linea",
                "selected": {
                    "fill": "Colore riempimento selezionato"
                }
            },
            "chance": {
                "title": "Nodo opportunità",
                "fill": "Colore riempimento",
                "stroke": "Colore linea",
                "selected": {
                    "fill": "Colore riempimento selezionato"
                }
            },
            "terminal":{
                "title": "Nodo terminale",
                "fill": "Colore riempimento",
                "stroke": "Colore linea",
                "selected": {
                    "fill": "Colore riempimento selezionato"
                },
                "payoff": {
                    "title": "Saldo",
                    "fontSize": "Dimensione font",
                    "color": "Colore",
                    "negativeColor": "Colore negativo"
                }
            }
        },
        "edge":{
            "title": "Ramo",
            "stroke": "Colore",
            "strokeWidth": "Larghezza linea",
            "optimal":{
                "title": "Ottimale",
                "stroke": "Colore",
                "strokeWidth": "Larghezza linea"
            },
            "selected":{
                "title": "Selezionato",
                "stroke": "Colore",
                "strokeWidth": "Larghezza linea"
            },
            "label": {
                "title": "Etichetta",
                "fontSize": "Dimensione font",
                "color": "Colore"
            },
            "payoff":{
                "title": "Saldo",
                "fontSize": "Dimensione font",
                "color": "Colore",
                "negativeColor": "Colore negativo"
            }
        },
        "diagramTitle":{
            "title": "Titolo diagramma",
            "fontSize": "Dimensione font",
            "fontWeight": "Peso del font",
            "fontStyle": "Stile font",
            "color": "Colore",
            "margin":{
                "title": "Margine",
                "top": "Superiore",
                "bottom": "Inferiore"
            },
            "description":{
                "title": "Sotto-titolo (descrizione diagramma)",
                "show": "Mostra",
                "fontSize": "Dimensione font",
                "fontWeight": "Peso del font",
                "fontStyle": "Stile font",
                "color": "Colore",
                "marginTop": "Margine superiore"
            }
        },
        "leagueTable": {
            "title": "Classifica",
            "plot": {
                "title": "Grafico",
                "maxWidth": "Larghezza massima",
                "highlightedColor": "Colore evidenziato della regola",
                "highlightedDefaultColor": "Colore polizza raccomandata (per default WTP)",
                "extendedDominatedColor": "Colori della regola dominata estesa",
                "dominatedColor": "Colore della denominata regola",
                "defaultColor": "Altri criteri colore"
            }
        },
        "other":{
            "title": "Altro",
            "disableAnimations": "Disabilita animazione",
            "forceFullEdgeRedraw": "Forza ridisegno dei rami",
            "hideLabels": "Nascondi le etichette",
            "hidePayoffs": "Nascondi saldo",
            "hideProbabilities": "Nascondi le probabilità",
            "raw": "Non elaborato"
        }
    },
    "aboutDialog":{
        "title": "Informazioni"
    },
    "help":{
        "header": "Aiuto",
        "mouse": {
            "header":"Azioni mouse:",
            "list":{
                "1": "Bottone sinistro: selezione nodo/ramo",
                "2": "Bottone destro: menu di contesto (aggiunta/manipolazione nodi)",
                "3": "Doppio click bottone sinistro: menu di contesto"
            }
        },
        "keyboard": {
            "header":"Scorciatoie tastiera:",
            "list":{
                "1": "Del: cancella nodi selezionati",
                "2": "Ctrl-C/X: copia/taglia nodi selezionati",
                "3": "Ctrl-V: incolla nodi copiati come sotto-albero di un nodo selezionato",
                "4": "Ctrl-Y/Z: ripristina/ripeti",
                "5": "Ctrl-Alt-D/C/T: aggiungi nuovo sottonodo Decisione/Opportunità/Terminale di un <strong>nodo selezionato</strong>",
                "6": "Ctrl-Alt-D/C: inietta un nuovo nodo Decisione/Opportunità in un <strong>ramo selezionato</strong>"
            }
        },
        "docs": "La documentazione di SilverDecisions e disponibile <a href=\"https://github.com/SilverDecisions/SilverDecisions/wiki/Documentation\" target=\"_blank\">qui</a>"
    },
    "definitionsDialog":{
        "title": "Definizioni delle variabili",
        "scope": {
            "global": "raggio globale",
            "node": "raggio di nodo e sotto-albero selezionati"
        },
        "buttons":{
            "recalculate": "Ricalcolare"
        },
        "evaluatedVariables": "Variabili valutate"
    },
    "sidebarDefinitions":{
        "scope":{
            "label": "Raggio variabile:",
            "global": "globale",
            "node": "nodo e sotto-albero selezionati"
        },
        "header": "Variabili",
        "code": "Codice",
        "buttons":{
            "openDialog" : "Apri il dialogo",
            "recalculate": "Ricalcolare"
        },
        "evaluatedVariables": "Variabili valutate"
    },
    "multipleCriteria":{
        "header": "Criteri multipli",
        "defaultMaximizedCriterionName": "Effetto",
        "defaultMinimizedCriterionName": "Costo",
        "nameOfCriterion1": "Nome del criterio 1",
        "nameOfCriterion2": "Nome del criterio 2",
        "defaultCriterion1Weight": "Predefinito 1° peso criterio",
        "weightLowerBound": "Peso inferiore limitato",
        "weightUpperBound": "Peso superiore del limite",
        "buttons":{
            "showLeagueTable" : "Mostra la classifica",
            "flip": "Ribalta"
        }
    },
    "layoutOptions":{
        "header": "Disposizione",
        "marginHorizontal": "Margine orizzontale",
        "marginVertical": "Margine verticale",
        "nodeSize": "Dimensione nodo",
        "edgeSlantWidthMax": "Inclinazione nodo",
        "gridWidth": "Larghezza",
        "gridHeight": "Altezza"
    },
    "diagramDetails":{
        "header": "Dettagli",
        "title" : "Titolo",
        "description" : "Descrizione"
    },
    "objectProperties":{
        "header":{
            "node":{
                "decision":"Nodo decisione",
                "chance":"Nodo opportunità",
                "terminal":"Nodo terminale"
            },
            "edge": "Ramo",
            "text": "Testo mobile"
        },
        "childrenProperties":{
            "node":{
                "header": "Connessioni",
                "child": {
                    "header": "Ramo #{{number}}"
                }
            }
        }
    },
    "confirm":{
        "newDiagram": "Vuoi davvero cancellare ildiagramma corrente ? Tutti i dati non salvati saranno persi.",
        "openDiagram": "Sei sicuro? Tutti i dati non salvati saranno persi.",
        "beforeunload": "Sei sicuro di voler uscire da SilverDecisions ?Tutti i dati non salvati saranno persi."
    },
    "error":{
        "jsonParse": "Errore analizzando il file !",
        "fileApiNotSupported":"l'API di questo file non è ancora supportata in questo browser.  ",
        "inputFilesProperty":"Il tuo browser non sembra supportare la proprieta del file di input.",
        "notSilverDecisionsFile":"Non è un file SilverDecisions !",
        "incorrectVersionFormat": "Formato non corretto della serie di versione!",
        "fileVersionNewerThanApplicationVersion": "La versione in file è più recente rispetto alla versione dell'applicazione. Alcune funzionalità possono essere indisponibili.",
        "objectiveComputationFailure": "Errore durante il calcolo obiettivo!",
        "diagramDrawingFailure": "Errore durante il disegno della diagramma!",
        "malformedData":"Errore durante la lettura dei dati dell'albero !",
        "pngExportNotSupported": "L'esport in formato PNG non è supportata nel tuo browser.",
        "pngExportNotSupportedIE": "L'esport in formato PNG non è supportata in Internet Explorer.",
        "svgExportNotSupported": "L'esport in formato SVG non è supportata nel tuo browser.",
        "pdfExportNotSupported": "L'esport in formato PDF non è supportata nel tuo browser.",
        "incorrectPayoffNumberFormatOptions": "Opzioni per il formato dei saldi non corrette.",
        "incorrectProbabilityNumberFormatOptions": "Opzioni per il formato delle probabilità non corrette.",
        "incorrectNumberFormatOptions": "Opzioni per il formato dei numeri non corrette, utilizzo del default.",
        "jsPDFisNotIncluded": "jsPDF non incluso !",
        "serverSideExportRequestFailure": "Richiesta di export fallita lato server !"
    }
}

},{}],107:[function(require,module,exports){
module.exports={
    "toolbar": {
        "newDiagram": "Nowy diagram",
        "openDiagram": "Otwórz diagram",
        "saveDiagram": "Zapisz diagram",
        "export":{
            "label": "Eksport",
            "png": "Png",
            "svg": "Svg",
            "pdf": "Pdf"
        },
        "layout":{
            "label": "Układ",
            "manual": "Ręczny",
            "tree": "Drzewo",
            "cluster": "Zgrupowany"
        },
        "viewMode": {
            "label": "Widok",
            "options": {
                "criterion1":"Kryterium 1",
                "criterion2":"Kryterium 2",
                "twoCriteria":"Dwa kryteria"
            }
        },
        "objectiveRule":{
            "label": "Reguła",
            "options": {
                "expected-value-maximization":"maksimum",
                "expected-value-minimization":"minimum",
                "maxi-min":"maxi-min",
                "maxi-max":"maxi-max",
                "mini-min":"mini-min",
                "mini-max":"mini-max",
                "min-max":"min-max",
                "max-min":"max-min",
                "min-min": "min-min",
                "max-max": "max-max"
            }
        },
        "undo": "Cofnij",
        "redo": "Ponów",
        "settings": "Ustawienia",
        "about": "Informacje",
        "sensitivityAnalysis": "Analiza wrażliwości",
        "recompute": "Przelicz"
    },
    "node":{
        "name": "Etykieta"
    },
    "edge":{
        "name": "Etykieta",
        "payoff": "Wypłata",
        "probability": "Prawdopodobieństwo"
    },
    "text":{
        "value": "Tekst"
    },
    "leagueTableDialog":{
        "title": "Tabela ligowa",
        "buttons": {
            "downloadCsv": "Pobierz CSV"
        }
    },
    "leagueTable": {
        "headers":{
            "policyNo": "Nr polityki",
            "policy": "Polityka",
            "comment": "Komentarz"
        },
        "comment":{
            "dominatedBy": "zdominowana (przez #{{policy}})",
            "extendedDominatedBy": "zdominowana rozszerzenie (przez #{{policy1}} i #{{policy2}})",
            "incratio": "inkrementalny iloraz={{incratio}}"
        },
        "plot":{
            "groups":{
                "highlighted": "Rekomendowany (dla pewnej wartości WTP w zakresie)",
                "highlighted-default": "Rekomendowany (dla domyślnej wartości WTP)",
                "extended-dominated" : "Zdominowana rozszerzenie",
                "dominated": "Zdominowana",
                "default": "Inne"
            },
            "tooltip":{
                "gradientArrow1": "Kierunek optymalizacji {{name}}",
                "gradientArrow2": "Kierunek optymalizacji {{name}}",
                "dominatedRegion": "Obszar zdominowany"
            },
            "legend":{
                "dominatedRegion": "Szary region oznacza obszar zdominowany",
                "gradientArrows": "Strzałki wskazują kierunek poprawy"
            }
        }
    },
    "sensitivityAnalysisDialog":{
        "title": "Analiza wrażliwości",
        "buttons": {
            "runJob": "Uruchom",
            "stopJob": "Zatrzymaj",
            "terminateJob": "Zakończ",
            "resumeJob": "Wznów",
            "downloadCsv": "Pobierz CSV",
            "back": "Wstecz",
            "clear": "Wyczyść"
        }
    },
    "jobParametersBuilder": {
        "buttons": {
            "removeParameterValue": "Usuń",
            "addParameterValue": "Dodaj"
        }
    },
    "jobResultTable":{
        "tooltip": {
            "multiplePoliciesInCell": "{{number}} polityk"
        },
        "pivot": {
            "aggregators":{
                "maximum": "Maksimum",
                "minimum": "Minimum"
            },
            "renderers":{
                "heatmap": "Mapa cieplna"
            }
        },
        "policyPreview": "podgląd polityki"
    },
    "job":{
        "sensitivity-analysis":{
            "name": "Analiza wrażliwości N-czynnikowa",
            "param":{
                "ruleName": "Nazwa reguły",
                "extendedPolicyDescription": {
                    "label": "Rozszerzony opis polityki"
                },
                "variables": {
                    "label": "Zmienne",
                    "name": {
                        "label": "Nazwa"
                    },
                    "min": {
                        "label": "Minimum"
                    },
                    "max": {
                        "label": "Maksimum"
                    },
                    "length": {
                        "label": "Długość"
                    },
                    "step": {
                        "label": "Krok"
                    }
                }
            },
            "errors":{
                "computations": "Błąd w obliczeniach analizy wrażliwości dla następujących parametrów:"
            },
            "warnings": {
                "largeScenariosNumber": "Liczba zdefiniowanych scenariuszy większa niż {{numberFormatted}}. Wyliczenie analizy wrażliwości może się nie powieść lub być bardzo powolne.",
                "largeParametersNumber": "Liczba parametrów większa niż {{number}}. Wyświetlenie analizy wrażliwości może się nie powieść lub być bardzo powolne."
            }
        },
        "tornado-diagram":{
            "name": "Diagram tornado",
            "param":{
                "ruleName": "Nazwa reguły",
                "extendedPolicyDescription": {
                    "label": "Rozszerzony opis polityki"
                },
                "variables": {
                    "label": "Zmienne",
                    "name": {
                        "label": "Nazwa"
                    },
                    "min": {
                        "label": "Minimum"
                    },
                    "max": {
                        "label": "Maximum"
                    },
                    "length": {
                        "label": "Długość"
                    },
                    "step": {
                        "label": "Krok"
                    },
                    "defaultValue": {
                        "label": "Wartość domyślna"
                    }
                }
            },
            "errors":{
                "computations": "Błąd w obliczeniach analizy wrażliwości dla następujących parametrów:"
            },
            "warnings": {
                "largeScenariosNumber": "Liczba zdefiniowanych scenariuszy większa niż {{numberFormatted}}. Wyliczenie analizy wrażliwości może się nie powieść lub być bardzo powolne.",
                "largeParametersNumber": "Liczba parametrów większa niż {{number}}. Wyświetlenie analizy wrażliwości może się nie powieść lub być bardzo powolne."
            },
            "plot":{
                "legend":{
                    "low": "Zmniejszenie",
                    "high": "Zwiększenie"
                },
                "xAxisTitle": "Wypłata"
            }
        },
        "probabilistic-sensitivity-analysis":{
            "name": "Probabilistyczna analiza wrażliwości",
            "param":{
                "ruleName": "Nazwa reguły",
                "numberOfRuns": {
                    "label": "Liczba powtórzeń"
                },
                "extendedPolicyDescription": {
                    "label": "Rozszerzony opis reguły"
                },
                "variables": {
                    "label": "Zmienne",
                    "name": {
                        "label": "Nazwa"
                    },
                    "formula": {
                        "label": "Formuła",
                        "help": "Wybierz wzór formuły z menu lub wpisz własny kod"
                    }
                }
            },
            "errors":{
                "computations": "Błąd w obliczeniu analizy wrażliwości dla następujących parametrów:",
                "param-computation": "Błąd w wyliczaniu wartości parametrów:"
            },
            "warnings": {
                "largeScenariosNumber": "Liczba zdefiniowanych scenariuszy większa niż {{numberFormatted}}. Wyliczenie analizy wrażliwości może się nie powieść lub być bardzo powolne."
            }
        },
        "league-table":{
            "name": "Tabela ligowa"
        },
        "spider-plot": {
            "name": "Wykres pajęczynowy",
            "param": {
                "ruleName": "Nazwa reguły",
                "extendedPolicyDescription": {
                    "label": "Rozszerzony opis polityki"
                },
                "percentageChangeRange": {
                    "label": "+/- zmiana procentowa do analizy"
                },
                "length": {
                    "label": "Liczba wartości do przetestowa",
                    "help": "Liczba wartości do przetestowa (po jednej stronie zakresu)"
                },
                "variables": {
                    "label": "Zmienne",
                    "name": {
                        "label": "Nazwa"
                    },
                    "defaultValue": {
                        "label": "Wartość domyślna"
                    }
                }
            },
            "errors":{
                "computations": "Błąd w obliczeniu analizy wrażliwości dla następujących parametrów:"
            },
            "warnings": {
                "largeScenariosNumber": "Liczba zdefiniowanych scenariuszy większa niż {{numberFormatted}}. Wyliczenie analizy wrażliwości może się nie powieść lub być bardzo powolne."
            },
            "plot": {
                "legend": {},
                "xAxisTitle": "Zmiana procentowa",
                "yAxisTitle": "Wypłata"
            }
        },
        "errors":{
            "generic": "Błąd w obliczeniach analizy wrażliwości: {{message}}",
            "params": "Błędne parametry w {{jobName}}"
        }
    },
    "settingsDialog":{
        "title": "Ustawienia",
        "general":{
            "title": "Ogólne",
            "fontSize": "Rozmiar czcionki",
            "fontFamily": "Rodzina czcionek",
            "fontWeight": "Waga czcionki",
            "fontStyle": "Styl czcionki",
            "numberFormatLocale": "Kod lokalizacji językowej liczb"
        },
        "payoff1":{
            "title": "Format wypłaty 1",
            "currency": "Waluta",
            "currencyDisplay": "Wyświetlanie waluty",
            "style": "Styl",
            "minimumFractionDigits": "Minimalna liczba miejsc po przecinku",
            "maximumFractionDigits": "Maksymalna liczba miejsc po przecinku",
            "useGrouping": "Separatory grupowania"
        },
        "payoff2":{
            "title": "Format wypłaty 2",
            "currency": "Waluta",
            "currencyDisplay": "Wyświetlanie waluty",
            "style": "Styl",
            "minimumFractionDigits": "Minimalna liczba miejsc po przecinku",
            "maximumFractionDigits": "Maksymalna liczba miejsc po przecinku",
            "useGrouping": "Separatory grupowania"
        },
        "probability":{
            "title": "Format prawdopodobieństwa",
            "style": "Styl",
            "minimumFractionDigits": "Minimalna liczba miejsc po przecinku",
            "maximumFractionDigits": "Maksymalna liczba miejsc po przecinku",
            "fontSize": "Rozmiar czcionki",
            "color": "Kolor"
        },
        "node":{
            "title": "Węzeł",
            "strokeWidth": "Szerokość krawędzi",
            "optimal":{
                "title": "Optymalny",
                "stroke": "Kolor",
                "strokeWidth": "Szerokość krawędzi"
            },
            "label": {
                "title": "Etykieta",
                "fontSize": "Rozmiar czcionki etykiety",
                "color": "Kolor etykiety"
            },
            "payoff": {
                "title": "Wypłata",
                "fontSize": "Rozmiar czcionki",
                "color": "Kolor",
                "negativeColor": "Kolor wartości ujemnej"
            },
            "decision": {
                "title": "Węzeł Decyzyjny",
                "fill": "Kolor wypełnienia",
                "stroke": "Kolor krawędzi",
                "selected": {
                    "fill": "Kolor wypełnienia po zaznaczeniu"
                }
            },
            "chance": {
                "title": "Węzeł Losowy",
                "fill": "Kolor wypełnienia",
                "stroke": "Kolor krawędzi",
                "selected": {
                    "fill": "Kolor wypełnienia po zaznaczeniu"
                }
            },
            "terminal":{
                "title": "Węzeł Końcowy",
                "fill": "Kolor wypełnienia",
                "stroke": "Kolor krawędzi",
                "selected": {
                    "fill": "Kolor wypełnienia po zaznaczeniu"
                },
                "payoff": {
                    "title": "Wypłata",
                    "fontSize": "Rozmiar czcionki",
                    "color": "Kolor",
                    "negativeColor": "Kolor wartości ujemnej"
                }
            }
        },
        "edge":{
            "title": "Krawędź",
            "stroke": "Kolor",
            "strokeWidth": "Szerokość krawędzi",
            "optimal":{
                "title": "Optymalna",
                "stroke": "Kolor",
                "strokeWidth": "Szerokość krawędzi"
            },
            "selected":{
                "title": "Zaznaczona",
                "stroke": "Kolor",
                "strokeWidth": "Szerokość krawędzi"
            },
            "label": {
                "title": "Etykieta",
                "fontSize": "Rozmiar czcionki",
                "color": "Kolor"
            },
            "payoff":{
                "title": "Wypłata",
                "fontSize": "Rozmiar czcionki",
                "color": "Kolor",
                "negativeColor": "Kolor wartości ujemnej"
            }
        },
        "diagramTitle":{
            "title": "Tytuł diagramu",
            "fontSize": "Rozmiar czcionki",
            "fontWeight": "Waga czcionki",
            "fontStyle": "Styl czcionki",
            "color": "Kolor",
            "margin":{
                "title": "Margines",
                "top": "Górny",
                "bottom": "Dolny"
            },
            "description":{
                "title": "Podtytuł (opis diagramu)",
                "show": "Wyświetl",
                "fontSize": "Rozmiar czcionki",
                "fontWeight": "Waga czcionki",
                "fontStyle": "Styl czcionki",
                "color": "Kolor",
                "marginTop": "Margines górny"
            }
        },
        "leagueTable": {
            "title": "Tabela ligowa",
            "plot": {
                "title": "Wykres",
                "maxWidth": "Maksymalna szerokość",
                "highlightedColor": "Kolor polityki rekomendowanej (dla pewnego WTP w zakresie)",
                "highlightedDefaultColor": "Kolor polityki rekomendowanej (dla domyślnego WTP)",
                "extendedDominatedColor": "Kolog polityki zdominowanej rozszerzenie",
                "dominatedColor": "Kolor polityki zdominowanej",
                "defaultColor": "Kolor innych polityk"
            }
        },
        "other":{
            "title": "Inne",
            "disableAnimations": "Wyłącz animacje",
            "forceFullEdgeRedraw": "Wymuś pełne przerysowywanie krawędzi",
            "hideLabels": "Ukryj etykiety",
            "hidePayoffs": "Ukryj wypłaty",
            "hideProbabilities": "Ukryj prawdopodobieństwa",
            "raw": "Surowy"
        }
    },
    "aboutDialog":{
        "title": "Informacje"
    },
    "help":{
        "header": "Pomoc",
        "mouse": {
            "header":"Akcje myszy:",
            "list":{
                "1": "lewy klawisz myszy: wybór węzła/krawędzi",
                "2": "prawy klawisz myszy: menu kontekstowe (dodawanie/manipulowanie węzłami)",
                "3": "podwójne kliknięcie lewym przyciskiem myszy: menu kontekstowe"
            }
        },
        "keyboard": {
            "header":"Skróty klawiszowe:",
            "list":{
                "1": "Del: usuwanie wybranych węzłów",
                "2": "Ctrl-C/X: kopiowanie/wycinanie wybranych węzłów",
                "3": "Ctrl-V: wklej skopiowane węzły jako poddrzewo wybranego węzła",
                "4": "Ctrl-Y/Z: cofnij/ponów",
                "5": "Ctrl-Alt-D/C/T: dodaj nowy węzeł Decyzyjny/Losowy/Końcowy jako dziecko <strong>wybranego węzła</strong>",
                "6": "Ctrl-Alt-D/C: Wstrzyknij nowy węzeł Decyzyjny/Losowy do <strong>wybranej krawędzi</strong>"
            }
        },
        "docs": "Dokumentacja SilverDecisions jest dostępna <a href=\"https://github.com/SilverDecisions/SilverDecisions/wiki/Documentation\" target=\"_blank\">tutaj</a>"
    },
    "definitionsDialog":{
        "title": "Definicje zmiennych",
        "scope": {
            "global": "zasięg globalny",
            "node": "zasięg wybranego węzła i poddrzewa"
        },
        "buttons":{
            "recalculate": "Przelicz"
        },
        "evaluatedVariables": "Wartości zmiennych"
    },
    "sidebarDefinitions":{
        "scope":{
            "label": "Zasięg zmiennej:",
            "global": "globalny",
            "node": "wybrany węzeł i poddrzewo"
        },
        "header": "Zmienne",
        "code": "Kod",
        "buttons":{
            "openDialog" : "Otwórz okno dialogowe",
            "recalculate": "Przelicz"
        },
        "evaluatedVariables": "Wartości zmiennych"
    },
    "multipleCriteria":{
        "header": "Wiele kryteriów",
        "defaultMaximizedCriterionName": "Efekt",
        "defaultMinimizedCriterionName": "Koszt",
        "nameOfCriterion1": "Nazwa kryterium 1",
        "nameOfCriterion2": "Nazwa kryterium 2",
        "defaultCriterion1Weight": "Domyślna waga kryerium 1",
        "weightLowerBound": "Dolna granica wagi",
        "weightUpperBound": "Górna granica wagi",
        "buttons":{
            "showLeagueTable" : "Pokaż tabelę ligową",
            "flip": "Zamień"
        }
    },
    "layoutOptions":{
        "header": "Układ",
        "marginHorizontal": "Margines w poziomie",
        "marginVertical": "Margines w pionie",
        "nodeSize": "Rozmiar węzła",
        "edgeSlantWidthMax": "Skos krawędzi (maksymalny)",
        "gridWidth": "Szerokość",
        "gridHeight": "Wysokość"
    },
    "diagramDetails":{
        "header": "Szczegóły",
        "title" : "Tytuł",
        "description" : "Opis"
    },
    "objectProperties":{
        "header":{
            "node":{
                "decision":"Węzeł Decyzyjny",
                "chance":"Węzeł Losowy",
                "terminal":"Węzeł Końcowy"
            },
            "edge": "Krawędź",
            "text": "Pływający tekst"
        },
        "childrenProperties":{
            "node":{
                "header": "Połączenia",
                "child": {
                    "header": "Krawędź #{{number}}"
                }
            }
        }
    },
    "confirm":{
        "newDiagram": "Czy jesteś pewien, że chcesz porzucić obecny diagram? Wszystkie niezapisane zmiany zostaną utracone.",
        "openDiagram": "Czy jesteś pewien? Wszystkie niezapisane zmiany zostaną utracone.",
        "beforeunload": "Czy jesteś pewien, że chcesz zamknąć SilverDecisions? Wszystkie niezapisane zmiany zostaną utracone."
    },
    "error":{
        "jsonParse": "Błąd przetwarzania danych z pliku!",
        "fileApiNotSupported":"Funckja 'file API' nie jest wspierana w tej przeglądarce internetowej.",
        "inputFilesProperty":"Twoje przeglądarka nie wspiera opcji `pliki` przy otwieraniu pliku.",
        "notSilverDecisionsFile":"Plik niezgodny z formatem SilverDecisions!",
        "incorrectVersionFormat": "Niepoprawny format ciągu z numerem wersji!",
        "fileVersionNewerThanApplicationVersion": "Wersja pliku jest nowasza niż wersja aplikacji. Niektóre funkcjonalności mogą być niedostępne.",
        "objectiveComputationFailure": "Błąd podczas wyliczania celu!",
        "diagramDrawingFailure": "Błąd podczas rysowania diagramu!",
        "malformedData":"Błąd odczytu danych drzewa!",
        "pngExportNotSupported": "Eksport do obrazu PNG nie jest wspierany w Twojej przeglądarce.",
        "pngExportNotSupportedIE": "Eksport do obrazu PNG nie jest wspierany w przeglądarce Internet Explorer.",
        "svgExportNotSupported": "Eksport do obrazu SVG nie jest wspierany w Twojej przeglądarce.",
        "pdfExportNotSupported": "Eksport do PDF nie jest wspierany w Twojej przeglądarce.",
        "incorrectPayoffNumberFormatOptions": "Niewłaściwe ustawienia dla formatu wypłaty.",
        "incorrectProbabilityNumberFormatOptions": "Niewłaściwe ustawienia dla formatu prawdopodobieństw.",
        "incorrectNumberFormatOptions": "Niewłaściwe ustawiono formatowanie liczb. Przyjęto ustawienia domyślne.",
        "jsPDFisNotIncluded": "Nie włączono jsPDF!",
        "serverSideExportRequestFailure": "Nieudane zapytanie do serwera exportu!"
    }
}

},{}],108:[function(require,module,exports){
'use strict';

var _sdTreeDesigner = require('sd-tree-designer');

var _app = require('./app');

var _package = require('../package.json');

require('es6-set/implement');

_sdTreeDesigner.D3Extensions.extend();

_app.App.version = _package.version;
module.exports = _app.App;

},{"../package.json":88,"./app":90,"es6-set/implement":51,"sd-tree-designer":63}],109:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.JobParametersBuilder = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _templates = require("../templates");

var _jobParameterDefinition = require("sd-computations/src/jobs/engine/job-parameter-definition");

var _sdUtils = require("sd-utils");

var _d = require("../d3");

var d3 = _interopRequireWildcard(_d);

var _i18n = require("../i18n/i18n");

var _appUtils = require("../app-utils");

var _sdTreeDesigner = require("sd-tree-designer");

var _autocomplete = require("../autocomplete");

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var JobParametersBuilder = function () {
    function JobParametersBuilder(container) {
        var i18nPrefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var onChange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

        _classCallCheck(this, JobParametersBuilder);

        this.container = container;
        this.i18nPrefix = i18nPrefix;
        this.paramTypeToInputType = {};
        this.paramTypeToInputAttrs = {};

        this.paramTypeToInputType[_jobParameterDefinition.PARAMETER_TYPE.BOOLEAN] = 'checkbox';
        this.paramTypeToInputType[_jobParameterDefinition.PARAMETER_TYPE.DATE] = 'date';
        this.paramTypeToInputType[_jobParameterDefinition.PARAMETER_TYPE.INTEGER] = 'number';
        this.paramTypeToInputAttrs[_jobParameterDefinition.PARAMETER_TYPE.INTEGER] = [{
            name: "step",
            value: "1"
        }];
        this.paramTypeToInputType[_jobParameterDefinition.PARAMETER_TYPE.NUMBER] = 'number';
        this.paramTypeToInputAttrs[_jobParameterDefinition.PARAMETER_TYPE.NUMBER] = [{
            name: "step",
            value: "any"
        }];
        this.paramTypeToInputType[_jobParameterDefinition.PARAMETER_TYPE.STRING] = 'text';

        this.onChange = onChange;
    }

    _createClass(JobParametersBuilder, [{
        key: "setJobParameters",
        value: function setJobParameters(jobName, jobParameters) {
            var customParamsConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            this.jobName = jobName;
            this.jobParameters = jobParameters;
            this.customParamsConfig = customParamsConfig;
            this.clean();
            this.build(this.container, this.jobParameters.definitions, this.jobParameters.values, '', this.onChange);
        }
    }, {
        key: "clean",
        value: function clean() {
            this.container.html('');
            this.pristine = {};
            this.customValidators = {};
            this.strictValidation(false);
        }
    }, {
        key: "validate",
        value: function validate() {
            var strictValidation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.strictValidation(strictValidation);
            this.pristine = {};
            this.container.selectAll('.sd-pristine').classed('sd-pristine', false);
            return this.checkCustomValidators() && this.jobParameters.validate();
        }
    }, {
        key: "checkCustomValidators",
        value: function checkCustomValidators() {
            var valid = true;
            _sdUtils.Utils.forOwn(this.customValidators, function (val, key) {
                valid = valid && val();
            });
            return valid;
        }
    }, {
        key: "strictValidation",
        value: function strictValidation() {
            var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.container.classed('sd-strict-validation', enabled);
        }
    }, {
        key: "build",
        value: function build(container, jobParameterDefinitions, parentValueObject) {
            var parentPath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
            var onChange = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function () {};
            var onInput = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : function () {};

            container.html('');
            var self = this;
            var params = container.selectAll(".sd-job-parameter").data(jobParameterDefinitions);
            var paramsEnter = params.enter().appendSelector('div.sd-job-parameter');

            paramsEnter.html(function (d) {
                return _templates.Templates.get('jobParameter', d);
            });

            var paramsMerge = paramsEnter.merge(params);
            paramsMerge.each(function (d, i) {
                var paramSelection = d3.select(this);
                var path = parentPath;

                if (path) {
                    path += '.';
                }
                path += d.name;
                paramSelection.classed('sd-hidden', _sdUtils.Utils.get(self.customParamsConfig, path + '.hidden'));

                var value = parentValueObject[d.name];
                var repeating = d.maxOccurs > 1;
                if (value == undefined) {
                    if (repeating) {
                        value = [];
                        for (var vi = 0; vi < d.minOccurs; vi++) {
                            value.push(self.getEmptyValue(d.type));
                        }
                    } else {
                        value = _sdUtils.Utils.get(self.customParamsConfig, path + '.value', self.getEmptyValue(d.type));
                    }

                    parentValueObject[d.name] = value;
                }

                if (!repeating) {
                    self.buildParameterSingleValue(paramSelection, d, {
                        get: function get() {
                            return parentValueObject[d.name];
                        },
                        set: function set(v) {
                            return parentValueObject[d.name] = v;
                        }
                    }, path, onChange, onInput);
                } else {
                    paramSelection.appendSelector("div.sd-job-parameter-name").html(self.getParamNameI18n(path));

                    var valuesContainer = paramSelection.appendSelector("div.sd-job-parameter-values");
                    var actionButtons = paramSelection.appendSelector("div.sd-action-buttons");
                    var addButton = actionButtons.appendSelector('button.sd-add-job-parameter-value-button.icon-button');
                    addButton.appendSelector("i.material-icons").html('add');

                    paramSelection.classed('invalid', !d.validate(value));
                    var callbacks = {};
                    callbacks.onValueRemoved = function (v, i) {
                        value.splice(i, 1);
                        self.buildParameterValues(valuesContainer, d, value, path, callbacks);
                        addButton.classed('sd-hidden', value.length >= d.maxOccurs);
                        callbacks.onChange();
                    };
                    callbacks.onChange = function () {
                        paramSelection.classed('invalid', !d.validate(value));
                        onChange();
                    };
                    callbacks.onInput = function () {
                        paramSelection.classed('invalid', !d.validate(value));
                        onInput();
                    };

                    addButton.attr('title', _i18n.i18n.t('jobParametersBuilder.buttons.addParameterValue')).classed('sd-hidden', value.length >= d.maxOccurs).on('click', function () {
                        value.push(self.getEmptyValue(d.type));
                        _sdUtils.Utils.set(self.pristine, path + "[" + (value.length - 1) + "]", true);
                        self.buildParameterValues(valuesContainer, d, value, path, callbacks);
                        addButton.classed('sd-hidden', value.length >= d.maxOccurs);
                        callbacks.onChange();
                    });

                    self.buildParameterValues(valuesContainer, d, value, path, callbacks);
                }
            });
        }
    }, {
        key: "buildParameterValues",
        value: function buildParameterValues(container, paramDefinition, values, path, callbacks) {
            var self = this;
            container.html("");

            var paramValues = container.selectAll(".sd-job-parameter-value").data(values);

            paramValues.exit().remove();
            var paramValuesEnter = paramValues.enter().appendSelector('div.sd-job-parameter-value');

            var paramValuesMerge = paramValuesEnter.merge(paramValues);

            var indexToSelection = {};

            var customValidator = _sdUtils.Utils.get(self.customParamsConfig, path + '.customValidator');

            function checkCustomValidator() {
                var allValid = true;
                if (customValidator) {
                    customValidator(values).forEach(function (isValid, i) {
                        var selection = indexToSelection[i];
                        var valid = paramDefinition.validateSingleValue(values[i]) && isValid;
                        selection.classed('invalid', !valid);
                        allValid = allValid && valid;
                    });
                }

                return allValid;
            }

            self.customValidators[path] = checkCustomValidator;

            paramValuesEnter.each(function (value, i) {
                var derivedValueUpdaters = [];

                function updateDerivedValues() {
                    derivedValueUpdaters.forEach(function (updater) {
                        return updater(values[i]);
                    });
                }

                var selection = d3.select(this);
                indexToSelection[i] = selection;

                if (_jobParameterDefinition.PARAMETER_TYPE.COMPOSITE == paramDefinition.type) {
                    var nestedParameters = selection.selectOrAppend("div.sd-nested-parameters");
                    var onChange = function onChange() {
                        selection.classed('invalid', !paramDefinition.validateSingleValue(value));
                        checkCustomValidator();
                        updateDerivedValues();
                        if (callbacks.onChange) {
                            callbacks.onChange();
                        }
                    };
                    var onInput = function onInput() {
                        updateDerivedValues();
                        selection.classed('invalid', !paramDefinition.validateSingleValue(value));
                        checkCustomValidator();
                        if (callbacks.onInput) {
                            callbacks.onInput();
                        }
                    };

                    self.build(nestedParameters, paramDefinition.nestedParameters, value, path, onChange, onInput);
                    selection.classed('invalid', !paramDefinition.validateSingleValue(value));
                    selection.classed('sd-pristine', _sdUtils.Utils.get(self.pristine, path + "[" + i + "]", false));
                } else {
                    self.buildParameterSingleValue(selection, paramDefinition, {
                        get: function get() {
                            return values[i];
                        },
                        set: function set(v) {
                            return values[i] = v;
                        }
                    }, path, function () {
                        updateDerivedValues();
                        checkCustomValidator();
                        if (callbacks.onChange) {
                            callbacks.onChange();
                        }
                    }, function () {
                        updateDerivedValues();
                        checkCustomValidator();
                        if (callbacks.onInput) {
                            callbacks.onInput();
                        }
                    });
                }

                var derivedValuesConfigs = _sdUtils.Utils.get(self.customParamsConfig, path + '._derivedValues');
                if (derivedValuesConfigs) {
                    derivedValuesConfigs.forEach(function (derivedValueConfig) {
                        var updater = self.buildDerivedValue(selection, derivedValueConfig, path);
                        updater(value);
                        derivedValueUpdaters.push(updater);
                    });
                }

                var actionButtons = selection.appendSelector("div.sd-action-buttons");
                var removeButton = actionButtons.appendSelector('button.sd-remove-job-parameter-value-button.icon-button');
                removeButton.appendSelector("i.material-icons").html('remove');
                removeButton.attr('title', _i18n.i18n.t('jobParametersBuilder.buttons.removeParameterValue')).classed('sd-hidden', values.length <= paramDefinition.minOccurs).on('click', function (d) {
                    return callbacks.onValueRemoved(d, i);
                });
            });

            checkCustomValidator();

            paramValuesMerge.each(function (value, i) {});
        }
    }, {
        key: "buildDerivedValue",
        value: function buildDerivedValue(container, derivedValueConfig, path) {
            var self = this;

            var inputId = _sdUtils.Utils.guid();
            var selection = container.appendSelector('div.input-group.sd-derived-value');
            var name = this.getParamNameI18n(path + '.' + derivedValueConfig.name);
            var input = selection.append('input').attr('type', 'text').attr("disabled", "disabled");

            selection.appendSelector('span.bar');
            var label = selection.append('label').attr('for', inputId).html(name);

            return function (paramValue) {
                input.node().value = derivedValueConfig.value(paramValue);
                _appUtils.AppUtils.updateInputClass(input);
            };
        }
    }, {
        key: "buildParameterSingleValue",
        value: function buildParameterSingleValue(container, paramDefinition, valueAccessor, path, onChange, onInput) {
            var _this = this;

            var self = this;
            var temp = {};

            var inputId = _sdUtils.Utils.guid();
            var selection = container.appendSelector('div.input-group');
            selection.classed('sd-parameter-' + paramDefinition.name, true);
            var help = this.getParamHelpI18n(path);
            if (help) {
                var helpContainer = container.appendSelector('div.sd-help-icon');
                helpContainer.html('<i class="material-icons">info_outline</i>');
                _sdTreeDesigner.Tooltip.attach(helpContainer, function (d) {
                    return help;
                }, 5, 15);
            }

            var options = _sdUtils.Utils.get(self.customParamsConfig, path + '.options', null);

            var inputType = this.paramTypeToInputType[paramDefinition.type];
            var additionalInputAttrs = this.paramTypeToInputAttrs[paramDefinition.type];
            var input;
            if (options && options.length) {
                inputType = 'select';
                input = selection.append('select');
                var optionsSel = input.selectAll("option").data([null].concat(options));
                optionsSel.enter().append("option").attr("value", function (d) {
                    return d;
                }).text(function (d) {
                    return d;
                });

                if (_sdUtils.Utils.get(self.customParamsConfig, path + '.optionsAutocomplete', null)) {
                    var autocomplete = new _autocomplete.Autocomplete(input);
                    input = autocomplete.getInput();
                }
            } else {
                input = selection.append('input').attr('type', inputType);

                if (additionalInputAttrs) {
                    additionalInputAttrs.forEach(function (attr) {
                        return input.attr(attr.name, attr.value);
                    });
                }
            }

            input.attr('id', inputId);

            input.classed('sd-input', true);
            input.on('input change', function (d, i) {
                var value = self.parseInput(this.value, paramDefinition.type);
                if (inputType == 'checkbox') {
                    value = this.checked;
                }
                if (!paramDefinition.validateSingleValue(value)) {
                    d3.select(this).classed('invalid', true);
                } else {
                    d3.select(this).classed('invalid', false);
                }

                valueAccessor.set(value);
                if (d3.event.type == 'change') {
                    if (onChange) {
                        onChange();
                    }
                }

                if (d3.event.type == 'input') {
                    if (onInput) {
                        onInput();
                    }
                }

                _appUtils.AppUtils.updateInputClass(d3.select(this));
            }).each(function (d, i) {
                var value = valueAccessor.get();
                if (inputType == 'checkbox') {
                    this.checked = value;
                } else {
                    this.value = value;
                }
                temp[i] = {};
                temp[i].pristineVal = value;
                d3.select(this).classed('invalid', !paramDefinition.validateSingleValue(value));
                _appUtils.AppUtils.updateInputClass(d3.select(this));
            });

            selection.appendSelector('span.bar');
            var label = selection.append('label').attr('for', inputId).html(function (d) {
                var label = _this.getParamNameI18n(path);
                return label;
            });
            input.node().value = valueAccessor.get();
        }
    }, {
        key: "value",
        value: function value(path, _value) {
            return this.jobParameters.value(path, _value);
        }
    }, {
        key: "parseInput",
        value: function parseInput(value, parameterType) {
            if (parameterType === _jobParameterDefinition.PARAMETER_TYPE.DATE) {
                return new Date(value);
            }
            if (parameterType === _jobParameterDefinition.PARAMETER_TYPE.NUMBER || parameterType === _jobParameterDefinition.PARAMETER_TYPE.INTEGER) {
                return parseFloat(value);
            }
            return value;
        }
    }, {
        key: "getEmptyValue",
        value: function getEmptyValue(parameterType) {
            if (parameterType === _jobParameterDefinition.PARAMETER_TYPE.COMPOSITE) {
                return {};
            }

            return null;
        }
    }, {
        key: "getParamNameI18n",
        value: function getParamNameI18n(path) {
            return _i18n.i18n.t(this.i18nPrefix + '.' + this.jobName + '.param.' + path + '.label');
        }
    }, {
        key: "getParamHelpI18n",
        value: function getParamHelpI18n(path) {
            var key = this.i18nPrefix + '.' + this.jobName + '.param.' + path + '.help';
            var help = _i18n.i18n.t(key);
            return help === key ? null : help;
        }
    }]);

    return JobParametersBuilder;
}();

exports.JobParametersBuilder = JobParametersBuilder;

},{"../app-utils":89,"../autocomplete":91,"../d3":92,"../i18n/i18n":105,"../templates":121,"sd-computations/src/jobs/engine/job-parameter-definition":"sd-computations/src/jobs/engine/job-parameter-definition","sd-tree-designer":63,"sd-utils":"sd-utils"}],110:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.JobResultTable = exports.JobResultTableConfig = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _sdUtils = require("sd-utils");

var _i18n = require("../i18n/i18n");

var _d = require("../d3");

var d3 = _interopRequireWildcard(_d);

var _pivotTable = require("../pivot-table");

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var jQuery = require('jquery');

var JobResultTableConfig = exports.JobResultTableConfig = function JobResultTableConfig(custom) {
    _classCallCheck(this, JobResultTableConfig);

    this.onRowSelected = function (rows, indexes, event) {};

    this.className = '';

    if (custom) {
        _sdUtils.Utils.deepExtend(this, custom);
    }
};

var JobResultTable = function () {
    function JobResultTable(container, config) {
        _classCallCheck(this, JobResultTable);

        this.container = container;
        this.config = new JobResultTableConfig(config);
        this.init();
    }

    _createClass(JobResultTable, [{
        key: "init",
        value: function init() {
            this.pivotTable = new _pivotTable.PivotTable(this.container.selectOrAppend("div.sd-job-result-table").classed(this.config.className, true));
        }
    }, {
        key: "clickCallback",
        value: function clickCallback(e, value, filters, pivotData) {
            var self = this;
            var selectedIndexes = [];
            var selectedRows = [];
            pivotData.forEachMatchingRecord(filters, function (record) {
                selectedIndexes.push(record['$rowIndex']);
                selectedRows.push(data.data[record['$rowIndex']]);
            });
            self.config.onRowSelected(selectedRows, selectedIndexes, e);
        }
    }, {
        key: "setClassName",
        value: function setClassName(className) {
            if (this.config.className) {
                this.container.selectOrAppend("div.sd-job-result-table").classed(this.config.className, false);
                this.config.className = className;
            }
            this.container.selectOrAppend("div.sd-job-result-table").classed(this.config.className, true);
        }
    }, {
        key: "setData",
        value: function setData(data, jobParameters, job, config) {
            var self = this;
            var derivers = jQuery.pivotUtilities.derivers;
            var pivotOptions = {
                rows: data.rows,
                vals: data.vals,
                cols: data.cols,
                hiddenAttributes: ['$rowIndex'],
                aggregatorName: this.pivotTable.getAggregatorName("maximum"),
                rendererOptions: {
                    table: {
                        clickCallback: function clickCallback(e, value, filters, pivotData) {
                            self.clickCallback(e, value, filters, pivotData);
                        }
                    },
                    heatmap: {
                        colorScaleGenerator: function colorScaleGenerator(values) {
                            var extent = d3.extent(values);

                            return d3.scaleLinear().domain([extent[0], (extent[0] + extent[1]) / 2, extent[1]]).range(["#4b53ff", "#FFF", "#FF0000"]);
                        }
                    }
                },
                rendererName: this.pivotTable.getRendererName("heatmap")
                /*
                 rendererName: 'custom',
                 renderers: {
                 'custom': function(pivotData, options){
                 console.log(pivotData)
                 }
                 }*/

            };

            if (config) {
                if (config.aggregatorName) {
                    pivotOptions.aggregatorName = config.aggregatorName;
                }
                if (config.aggregators) {
                    pivotOptions.aggregators = config.aggregators;
                }
            }

            this.pivotTable.update(data.data.map(function (r, i) {
                return r.concat(i ? i - 1 : '$rowIndex');
            }), pivotOptions);

            // this.drawHeaders(data.headers);
            // this.drawRows(data.rows)
        }
    }, {
        key: "clear",
        value: function clear() {
            this.clearSelection();
            this.pivotTable.clear();
        }
    }, {
        key: "show",
        value: function show() {
            var _show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.container.classed('sd-hidden', !_show);
        }
    }, {
        key: "hide",
        value: function hide() {
            this.show(false);
        }
    }, {
        key: "clearSelection",
        value: function clearSelection() {
            // this.resultTable.selectAll('.sd-selected').classed('sd-selected', false);
        }
    }]);

    return JobResultTable;
}();

exports.JobResultTable = JobResultTable;

},{"../d3":92,"../i18n/i18n":105,"../pivot-table":119,"jquery":"jquery","sd-utils":"sd-utils"}],111:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ProbabilisticSensitivityAnalysisJobResultTable = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _jobResultTable = require("./job-result-table");

var _policy = require("sd-computations/src/policies/policy");

var _sdUtils = require("sd-utils");

var _i18n = require("../i18n/i18n");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var jQuery = require('jquery');

var ProbabilisticSensitivityAnalysisJobResultTable = exports.ProbabilisticSensitivityAnalysisJobResultTable = function (_JobResultTable) {
    _inherits(ProbabilisticSensitivityAnalysisJobResultTable, _JobResultTable);

    function ProbabilisticSensitivityAnalysisJobResultTable(container, config, payoffNumberFormatter, probabilityNumberFormatter) {
        _classCallCheck(this, ProbabilisticSensitivityAnalysisJobResultTable);

        var _this = _possibleConstructorReturn(this, (ProbabilisticSensitivityAnalysisJobResultTable.__proto__ || Object.getPrototypeOf(ProbabilisticSensitivityAnalysisJobResultTable)).call(this, container, config));

        _this.payoffNumberFormatter = payoffNumberFormatter;
        _this.probabilityNumberFormatter = probabilityNumberFormatter;
        return _this;
    }

    _createClass(ProbabilisticSensitivityAnalysisJobResultTable, [{
        key: "setData",
        value: function setData(jobResult, jobParameters, job) {
            var _this2 = this;

            this.jobResult = jobResult;
            var data = { rows: ['policy', 'expected value', 'median', 'standard deviation', 'best probability'], cols: [], vals: ['expected value'], data: [] };

            data.data.push(['policy', 'expected value', 'median', 'standard deviation', 'best probability']);
            jobResult.policies.forEach(function (policy, i) {
                var row = [_policy.Policy.toPolicyString(policy, jobParameters.values.extendedPolicyDescription), _this2.payoffNumberFormatter(jobResult.expectedValues[i]), _this2.payoffNumberFormatter(jobResult.medians[i]), _this2.payoffNumberFormatter(jobResult.standardDeviations[i]), _this2.probabilityNumberFormatter(jobResult.policyIsBestProbabilities[i])];
                data.data.push(row);
            });

            _sdUtils.log.trace(data);
            _get(ProbabilisticSensitivityAnalysisJobResultTable.prototype.__proto__ || Object.getPrototypeOf(ProbabilisticSensitivityAnalysisJobResultTable.prototype), "setData", this).call(this, data, jobParameters, job, {
                aggregatorName: "empty",
                aggregators: {
                    empty: function empty(attributeArray) {
                        return function (data, rowKey, colKey) {
                            return {
                                push: function push(record) {},
                                value: function value() {
                                    return 0;
                                },
                                format: function format(x) {
                                    return _i18n.i18n.t('jobResultTable.policyPreview');
                                },
                                numInputs: 1
                            };
                        };
                    }
                }
            });
        }
    }, {
        key: "clickCallback",
        value: function clickCallback(e, value, filters, pivotData) {
            var self = this;
            var selectedIndexes = [];
            var selectedRows = [];
            pivotData.forEachMatchingRecord(filters, function (record) {
                selectedIndexes.push(record['$rowIndex']);
                selectedRows.push({ policyIndex: record['$rowIndex'] });
            });
            self.config.onRowSelected(selectedRows, selectedIndexes, e);
        }
    }]);

    return ProbabilisticSensitivityAnalysisJobResultTable;
}(_jobResultTable.JobResultTable);

},{"../i18n/i18n":105,"./job-result-table":110,"jquery":"jquery","sd-computations/src/policies/policy":"sd-computations/src/policies/policy","sd-utils":"sd-utils"}],112:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SensitivityAnalysisJobResultTable = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _jobResultTable = require("./job-result-table");

var _sdUtils = require("sd-utils");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var SensitivityAnalysisJobResultTable = exports.SensitivityAnalysisJobResultTable = function (_JobResultTable) {
    _inherits(SensitivityAnalysisJobResultTable, _JobResultTable);

    function SensitivityAnalysisJobResultTable() {
        _classCallCheck(this, SensitivityAnalysisJobResultTable);

        return _possibleConstructorReturn(this, (SensitivityAnalysisJobResultTable.__proto__ || Object.getPrototypeOf(SensitivityAnalysisJobResultTable)).apply(this, arguments));
    }

    _createClass(SensitivityAnalysisJobResultTable, [{
        key: "setData",
        value: function setData(jobResult, jobParameters, job) {
            this.jobResult = jobResult;

            jobParameters = job.createJobParameters(_sdUtils.Utils.cloneDeep(jobParameters.values));
            jobParameters.values.roundVariables = true;
            var csvDAta = job.jobResultToCsvRows(jobResult, jobParameters);

            if (csvDAta.length) {
                csvDAta[0][0] = 'policy\nnumber';
            }

            var cols = [];
            var totalInColNum = 1;

            jobParameters.values.variables.forEach(function (v) {
                var _totalInColNum = v.length * totalInColNum;
                if (_totalInColNum > 1000) {
                    return;
                }
                totalInColNum = _totalInColNum;
                cols.push(v.name);
            });

            var data = { rows: ['policy'], cols: cols, vals: ['payoff'], data: csvDAta };
            _get(SensitivityAnalysisJobResultTable.prototype.__proto__ || Object.getPrototypeOf(SensitivityAnalysisJobResultTable.prototype), "setData", this).call(this, data);
        }
    }, {
        key: "clickCallback",
        value: function clickCallback(e, value, filters, pivotData) {
            var self = this;
            var selectedIndexes = [];
            var selectedRows = [];
            pivotData.forEachMatchingRecord(filters, function (record) {
                selectedIndexes.push(record['$rowIndex']);
                selectedRows.push(self.jobResult.rows[record['$rowIndex']]);
            });
            self.config.onRowSelected(selectedRows, selectedIndexes, e);
        }
    }]);

    return SensitivityAnalysisJobResultTable;
}(_jobResultTable.JobResultTable);

},{"./job-result-table":110,"sd-utils":"sd-utils"}],113:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SpiderPlot = exports.SpiderPlotConfig = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _lineChart = require("odc-d3/src/line-chart");

var _sdUtils = require("sd-utils");

var _d = require("../d3");

var d3 = _interopRequireWildcard(_d);

var _sdTreeDesigner = require("sd-tree-designer");

var _i18n = require("../i18n/i18n");

var _policy = require("sd-computations/src/policies/policy");

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var SpiderPlotConfig = exports.SpiderPlotConfig = function (_LineChartConfig) {
    _inherits(SpiderPlotConfig, _LineChartConfig);

    function SpiderPlotConfig(custom) {
        _classCallCheck(this, SpiderPlotConfig);

        var _this = _possibleConstructorReturn(this, (SpiderPlotConfig.__proto__ || Object.getPrototypeOf(SpiderPlotConfig)).call(this));

        _this.maxWidth = undefined;
        _this.showLegend = true;
        _this.policyIndex = 0;
        _this.guides = true;
        _this.margin = {
            left: 100
        };
        _this.x = { // X axis config
            title: _i18n.i18n.t('job.spider-plot.plot.xAxisTitle'), // axis label
            key: 0,
            domainMargin: 0
        };
        _this.y = { // Y axis config
            title: _i18n.i18n.t('job.spider-plot.plot.yAxisTitle'), // axis label,
            key: 1,
            domainMargin: 0.1
        };
        _this.series = true;
        _this.dotRadius = 3;

        if (custom) {
            _sdUtils.Utils.deepExtend(_this, custom);
        }
        return _this;
    }

    return SpiderPlotConfig;
}(_lineChart.LineChartConfig);

var SpiderPlot = exports.SpiderPlot = function (_LineChart) {
    _inherits(SpiderPlot, _LineChart);

    function SpiderPlot(placeholderSelector, data, config) {
        _classCallCheck(this, SpiderPlot);

        return _possibleConstructorReturn(this, (SpiderPlot.__proto__ || Object.getPrototypeOf(SpiderPlot)).call(this, placeholderSelector, data, new SpiderPlotConfig(config)));
    }

    _createClass(SpiderPlot, [{
        key: "setConfig",
        value: function setConfig(config) {
            return _get(SpiderPlot.prototype.__proto__ || Object.getPrototypeOf(SpiderPlot.prototype), "setConfig", this).call(this, new SpiderPlotConfig(config));
        }
    }, {
        key: "init",
        value: function init() {
            _get(SpiderPlot.prototype.__proto__ || Object.getPrototypeOf(SpiderPlot.prototype), "init", this).call(this);
            this.svg.classed('sd-spider-plot', true);
        }
    }, {
        key: "setData",
        value: function setData(data) {
            var _this3 = this;

            this.config.title = _policy.Policy.toPolicyString(data.policies[this.config.policyIndex]);
            return _get(SpiderPlot.prototype.__proto__ || Object.getPrototypeOf(SpiderPlot.prototype), "setData", this).call(this, data.rows.map(function (r) {
                return {
                    key: r.variableName,
                    values: data.percentageRangeValues.map(function (rangeVal, index) {
                        return [data.percentageRangeValues[index], r.payoffs[_this3.config.policyIndex][index]];
                    })
                };
            }));
        }
    }, {
        key: "initPlot",
        value: function initPlot() {
            d3.select(this.baseContainer).style('max-width', this.config.maxWidth);
            _get(SpiderPlot.prototype.__proto__ || Object.getPrototypeOf(SpiderPlot.prototype), "initPlot", this).call(this);
        }
    }]);

    return SpiderPlot;
}(_lineChart.LineChart);

},{"../d3":92,"../i18n/i18n":105,"odc-d3/src/line-chart":"odc-d3/src/line-chart","sd-computations/src/policies/policy":"sd-computations/src/policies/policy","sd-tree-designer":63,"sd-utils":"sd-utils"}],114:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TornadoDiagramPlot = exports.TornadoDiagramPlotConfig = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _divergingStackedBarChart = require("odc-d3/src/diverging-stacked-bar-chart");

var _sdUtils = require("sd-utils");

var _d = require("../d3");

var d3 = _interopRequireWildcard(_d);

var _sdTreeDesigner = require("sd-tree-designer");

var _i18n = require("../i18n/i18n");

var _policy = require("sd-computations/src/policies/policy");

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var TornadoDiagramPlotConfig = exports.TornadoDiagramPlotConfig = function (_DivergingStackedBarC) {
    _inherits(TornadoDiagramPlotConfig, _DivergingStackedBarC);

    function TornadoDiagramPlotConfig(custom) {
        _classCallCheck(this, TornadoDiagramPlotConfig);

        var _this = _possibleConstructorReturn(this, (TornadoDiagramPlotConfig.__proto__ || Object.getPrototypeOf(TornadoDiagramPlotConfig)).call(this));

        _this.maxWidth = undefined;
        _this.margin = {
            left: 150,
            top: 70
        };
        _this.showLegend = true;
        _this.forceLegend = true;
        _this.categoryNames = [_i18n.i18n.t("job.tornado-diagram.plot.legend.low"), _i18n.i18n.t("job.tornado-diagram.plot.legend.high")];
        _this.colorRange = ["#4f81bd", "#9bbb59"];
        _this.policyIndex = 0;
        _this.guides = true;
        _this.middleValue = 1000;
        _this.showBarValues = false;
        _this.x = { // X axis config
            title: _i18n.i18n.t('job.tornado-diagram.plot.xAxisTitle') // axis label
        };

        if (custom) {
            _sdUtils.Utils.deepExtend(_this, custom);
        }
        return _this;
    }

    return TornadoDiagramPlotConfig;
}(_divergingStackedBarChart.DivergingStackedBarChartConfig);

var TornadoDiagramPlot = exports.TornadoDiagramPlot = function (_DivergingStackedBarC2) {
    _inherits(TornadoDiagramPlot, _DivergingStackedBarC2);

    function TornadoDiagramPlot(placeholderSelector, data, config) {
        _classCallCheck(this, TornadoDiagramPlot);

        return _possibleConstructorReturn(this, (TornadoDiagramPlot.__proto__ || Object.getPrototypeOf(TornadoDiagramPlot)).call(this, placeholderSelector, data, new TornadoDiagramPlotConfig(config)));
    }

    _createClass(TornadoDiagramPlot, [{
        key: "setConfig",
        value: function setConfig(config) {
            return _get(TornadoDiagramPlot.prototype.__proto__ || Object.getPrototypeOf(TornadoDiagramPlot.prototype), "setConfig", this).call(this, new TornadoDiagramPlotConfig(config));
        }
    }, {
        key: "init",
        value: function init() {
            _get(TornadoDiagramPlot.prototype.__proto__ || Object.getPrototypeOf(TornadoDiagramPlot.prototype), "init", this).call(this);
            this.svg.classed('sd-tornado-diagram-plot', true);
        }
    }, {
        key: "setData",
        value: function setData(data) {
            var _this3 = this;

            this.config.middleValue = data.defaultPayoff;
            this.config.title = _policy.Policy.toPolicyString(data.policies[this.config.policyIndex]);
            return _get(TornadoDiagramPlot.prototype.__proto__ || Object.getPrototypeOf(TornadoDiagramPlot.prototype), "setData", this).call(this, data.rows.map(function (r) {
                var varExtent = data.variableExtents[data.variableNames.indexOf(r.variableName)];
                return {
                    key: r.variableName + ' [' + varExtent[0] + '; ' + varExtent[1] + ']',
                    values: [Math.max(0, data.defaultPayoff - r.extents[_this3.config.policyIndex][0]), Math.max(0, r.extents[_this3.config.policyIndex][1] - data.defaultPayoff)],
                    categories: r.extentVariableValues[_this3.config.policyIndex][0] <= r.extentVariableValues[_this3.config.policyIndex][1] ? [0, 1] : [1, 0]
                };
            }));
        }
    }, {
        key: "initPlot",
        value: function initPlot() {
            d3.select(this.baseContainer).style('max-width', this.config.maxWidth);
            _get(TornadoDiagramPlot.prototype.__proto__ || Object.getPrototypeOf(TornadoDiagramPlot.prototype), "initPlot", this).call(this);
        }
    }]);

    return TornadoDiagramPlot;
}(_divergingStackedBarChart.DivergingStackedBarChart);

},{"../d3":92,"../i18n/i18n":105,"odc-d3/src/diverging-stacked-bar-chart":"odc-d3/src/diverging-stacked-bar-chart","sd-computations/src/policies/policy":"sd-computations/src/policies/policy","sd-tree-designer":63,"sd-utils":"sd-utils"}],115:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LeagueTableDialog = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _dialog = require("../dialogs/dialog");

var _sdUtils = require("sd-utils");

var _templates = require("../templates");

var _i18n = require("../i18n/i18n");

var _appUtils = require("../app-utils");

var _loadingIndicator = require("../loading-indicator");

var _exporter = require("../exporter");

var _leagueTable = require("./league-table");

var _leagueTablePlot = require("./league-table-plot");

var _policy = require("sd-computations/src/policies/policy");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var LeagueTableDialog = exports.LeagueTableDialog = function (_Dialog) {
    _inherits(LeagueTableDialog, _Dialog);

    function LeagueTableDialog(app) {
        _classCallCheck(this, LeagueTableDialog);

        var _this = _possibleConstructorReturn(this, (LeagueTableDialog.__proto__ || Object.getPrototypeOf(LeagueTableDialog)).call(this, app.container.select('.sd-league-table-dialog'), app));

        _this.computationsManager = _this.app.computationsManager;
        _this.progressBarContainer = _this.container.select(".sd-job-progress-bar-container");
        _this.progressBar = _this.progressBarContainer.select(".sd-progress-bar");
        _this.jobResultsContainer = _this.container.select(".sd-league-table-job-results");
        _this.initButtons();

        _this.job = _this.computationsManager.getJobByName("league-table");
        return _this;
    }

    _createClass(LeagueTableDialog, [{
        key: "onOpen",
        value: function onOpen() {
            this.clear();
            this.runJob();
        }
    }, {
        key: "onClosed",
        value: function onClosed() {
            this.clear();
            if (!this.jobInstanceManager) {
                return;
            }
            this.jobInstanceManager.terminate();
        }
    }, {
        key: "clearWarnings",
        value: function clearWarnings() {
            this.container.select(".sd-league-table-warnings").selectAll("*").remove();
        }
    }, {
        key: "addWarning",
        value: function addWarning(warnConf) {
            var msg = _i18n.i18n.t("job." + this.job.name + ".warnings." + warnConf.name, warnConf.data);

            var msgHTML = _templates.Templates.get("warningMessage", {
                message: msg
            });
            this.container.select(".sd-league-table-warnings").appendSelector("div.sd-league-table-warning").html(msgHTML);
        }
    }, {
        key: "initResultTable",
        value: function initResultTable(result) {
            var _this2 = this;

            var config = {
                onRowSelected: function onRowSelected(row, i) {
                    return _this2.onResultRowSelected(row, i);
                },
                onRowHover: function onRowHover(row, i) {
                    return _this2.resultPlot.emphasize(row.row, true);
                },
                onRowHoverOut: function onRowHoverOut(row, i) {
                    return _this2.resultPlot.emphasize(row.row, false);
                }
            };

            if (this.resultTable) {
                this.resultTable.clear();
                this.resultTable.hide();
            }

            this.resultTable = new _leagueTable.LeagueTable(this.jobResultsContainer.select(".sd-job-result-table-container"), config);
            this.resultTable.setData(result, this.app.dataModel);
            this.resultTable.show();
        }
    }, {
        key: "initResultPlot",
        value: function initResultPlot(result) {
            var _this3 = this;

            var self = this;
            var config = {
                maxWidth: self.app.config.leagueTable.plot.maxWidth,
                weightLowerBound: result.weightLowerBound,
                defaultWeight: result.defaultWeight,
                weightUpperBound: result.weightUpperBound,
                payoffCoeffs: result.payoffCoeffs,
                payoffNames: result.payoffNames,
                x: {
                    value: function value(d, key) {
                        return d.payoffs[0];
                    },
                    title: result.payoffNames[0]
                },
                y: {
                    value: function value(d, key) {
                        return d.payoffs[1];
                    },
                    title: result.payoffNames[1]
                },
                onDotHover: function onDotHover(d, i) {
                    return _this3.resultTable.emphasize(d, true);
                },
                onDotHoverOut: function onDotHoverOut(d, i) {
                    return _this3.resultTable.emphasize(d, false);
                },

                color: function color(group) {
                    var groupsConf = self.app.config.leagueTable.plot.groups;
                    var groupConf = groupsConf[group.key];
                    if (groupConf) {
                        return groupConf.color;
                    }
                    return 'black';
                },
                groupOrdering: {
                    'dominated': 0,
                    'extended-dominated': 1,
                    'highlighted': 2,
                    'highlighted-default': 3,
                    'default': 4

                },
                groups: {
                    value: function value(r) {
                        if (r.optimalForDefaultWeight) {
                            return 'highlighted-default';
                        } else if (r.optimal) {
                            return 'highlighted';
                        } else if (r.dominatedBy !== null) {
                            return 'dominated';
                        } else if (r.extendedDominatedBy !== null) {
                            return 'extended-dominated';
                        }

                        return "default";
                    },
                    displayValue: function displayValue(groupKey) {
                        return _i18n.i18n.t("leagueTable.plot.groups." + groupKey);
                    }
                }
            };

            this.resultPlot = new _leagueTablePlot.LeagueTablePlot(this.jobResultsContainer.select(".sd-job-result-plot-container").node(), result.rows, config);
            setTimeout(function () {
                self.resultPlot.init();
            }, 100);
        }
    }, {
        key: "onResized",
        value: function onResized() {
            if (this.resultPlot) {
                this.resultPlot.init();
            }
        }
    }, {
        key: "disableActionButtonsAndShowLoadingIndicator",
        value: function disableActionButtonsAndShowLoadingIndicator() {
            var disable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            if (disable) {
                _loadingIndicator.LoadingIndicator.show();
            } else {
                _loadingIndicator.LoadingIndicator.hide();
            }
            this.container.select('.sd-league-table-action-buttons').selectAll('button').attr('disabled', disable ? 'disabled' : undefined);
        }
    }, {
        key: "initJobParams",
        value: function initJobParams() {
            this.jobParameters = this.job.createJobParameters({
                ruleName: this.computationsManager.getCurrentRule().name,
                weightLowerBound: this.app.dataModel.weightLowerBound,
                defaultWeight: this.app.dataModel.defaultCriterion1Weight,
                weightUpperBound: this.app.dataModel.weightUpperBound

            });
        }
    }, {
        key: "validateParams",
        value: function validateParams() {
            this.initJobParams();
            return this.jobParameters.validate();
        }
    }, {
        key: "runJob",
        value: function runJob() {
            var _this4 = this;

            this.initJobParams();

            if (!this.validateParams()) {
                alert(_i18n.i18n.t("job.errors.params", { "jobName": _i18n.i18n.t("job.league-table.name") }));
                return;
            }
            this.disableActionButtonsAndShowLoadingIndicator();
            this.computationsManager.runJobWithInstanceManager(this.job.name, this.jobParameters.values, {
                onJobStarted: this.onJobStarted,
                onJobCompleted: this.onJobCompleted,
                onJobFailed: this.onJobFailed,
                onJobStopped: this.onJobStopped,
                onJobTerminated: this.onJobTerminated,
                onProgress: this.onProgress,
                callbacksThisArg: this
            }).then(function (jobInstanceManager) {
                _this4.jobInstanceManager = jobInstanceManager;
            }).catch(function (e) {
                _sdUtils.log.error(e);
            }).then(function () {
                _this4.disableActionButtonsAndShowLoadingIndicator(false);
            });
        }
    }, {
        key: "initButtons",
        value: function initButtons() {
            var _this5 = this;

            this.downloadCsvButtons = this.container.select(".sd-download-csv-button ").on('click', function () {
                _this5.downloadCSV();
            });

            this.clearButton = this.container.select(".sd-clear-button ").on('click', function () {
                _this5.clear(true);
            });
        }
    }, {
        key: "clear",
        value: function clear() {
            this.clearResults();
            this.clearWarnings();
            this.setProgress(0);
            this.markAsError(false);

            _appUtils.AppUtils.hide(this.progressBarContainer);
            _appUtils.AppUtils.hide(this.downloadCsvButtons);
            _appUtils.AppUtils.hide(this.jobResultsContainer);
            this.disableActionButtonsAndShowLoadingIndicator(false);
        }
    }, {
        key: "clearResults",
        value: function clearResults() {
            if (this.resultTable) {
                this.resultTable.clear();
                this.resultTable.hide();
            }
        }
    }, {
        key: "onJobStarted",
        value: function onJobStarted() {
            _appUtils.AppUtils.hide(this.downloadCsvButtons);

            _appUtils.AppUtils.show(this.progressBarContainer);

            this.disableActionButtonsAndShowLoadingIndicator(false);
            this.onProgress(this.jobInstanceManager ? this.jobInstanceManager.progress : null);
        }
    }, {
        key: "onJobCompleted",
        value: function onJobCompleted(result) {
            _appUtils.AppUtils.show(this.jobResultsContainer);
            _appUtils.AppUtils.show(this.downloadCsvButtons);

            _appUtils.AppUtils.hide(this.progressBarContainer);
            this.disableActionButtonsAndShowLoadingIndicator(false);
            this.displayResult(result);
        }
    }, {
        key: "displayResult",
        value: function displayResult(result) {
            _sdUtils.log.debug(result);
            this.result = result;
            this.initResultTable(result);

            this.initResultPlot(result);
        }
    }, {
        key: "terminateJob",
        value: function terminateJob() {
            this.disableActionButtonsAndShowLoadingIndicator();
            this.jobInstanceManager.terminate();
        }
    }, {
        key: "onJobFailed",
        value: function onJobFailed(errors) {
            _appUtils.AppUtils.hide(this.downloadCsvButtons);
            this.disableActionButtonsAndShowLoadingIndicator(false);
            this.markAsError();
            var self = this;
            setTimeout(function () {
                var errorMessage = "";
                errors.forEach(function (e, i) {
                    if (i) {
                        errorMessage += "\n\n";
                    }

                    var msgKeyBase = "job." + self.job.name + ".errors.";
                    var msgKey = msgKeyBase + e.message;
                    var msg = _i18n.i18n.t(msgKey, e.data);
                    e.jobName = _i18n.i18n.t("job.league-table.name");
                    if (msg === msgKey) {
                        msg = _i18n.i18n.t("job.errors.generic", e);
                    }

                    errorMessage += msg;
                    if (e.data && e.data.variables) {
                        _sdUtils.Utils.forOwn(e.data.variables, function (value, key) {
                            errorMessage += "\n";
                            errorMessage += key + " = " + value;
                        });
                    }
                });

                alert(errorMessage);
                self.terminateJob();
            }, 10);
        }
    }, {
        key: "markAsError",
        value: function markAsError() {
            var error = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.container.classed('sd-job-error', error);
        }
    }, {
        key: "onJobStopped",
        value: function onJobStopped() {
            _appUtils.AppUtils.hide(this.stopJobButton);
            _appUtils.AppUtils.show(this.resumeJobButton);
            this.disableActionButtonsAndShowLoadingIndicator(false);
        }
    }, {
        key: "onJobTerminated",
        value: function onJobTerminated() {
            this.clear();
        }
    }, {
        key: "onProgress",
        value: function onProgress(progress) {
            this.setProgress(progress);
        }
    }, {
        key: "setProgress",
        value: function setProgress(progress) {
            var percents = 0;
            var value = "0%";
            if (progress) {
                value = progress.current + " / " + progress.total;
                percents = progress.current * 100 / progress.total;
            }

            this.progressBar.style("width", percents + "%");
            this.progressBar.html(value);
        }
    }, {
        key: "onResultRowSelected",
        value: function onResultRowSelected(row, index) {
            var _this6 = this;

            var title = _policy.Policy.toPolicyString(row.policy, false);
            this.app.showPolicyPreview(title, row.policy, function () {
                _this6.resultTable.clearSelection();
            });
        }
    }, {
        key: "downloadCSV",
        value: function downloadCSV() {
            _exporter.Exporter.saveAsCSV(this.getRows(), 'leaguetable');
        }
    }, {
        key: "getRows",
        value: function getRows() {
            var params = _sdUtils.Utils.cloneDeep(this.jobParameters.values);
            params.extendedPolicyDescription = false;
            return this.job.jobResultToCsvRows(this.result, this.job.createJobParameters(params));
        }
    }]);

    return LeagueTableDialog;
}(_dialog.Dialog);

},{"../app-utils":89,"../dialogs/dialog":95,"../exporter":98,"../i18n/i18n":105,"../loading-indicator":118,"../templates":121,"./league-table":117,"./league-table-plot":116,"sd-computations/src/policies/policy":"sd-computations/src/policies/policy","sd-utils":"sd-utils"}],116:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LeagueTablePlot = exports.LeagueTablePlotConfig = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _scatterplot = require("odc-d3/src/scatterplot");

var _sdUtils = require("sd-utils");

var _d = require("../d3");

var d3 = _interopRequireWildcard(_d);

var _sdTreeDesigner = require("sd-tree-designer");

var _i18n = require("../i18n/i18n");

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var LeagueTablePlotConfig = exports.LeagueTablePlotConfig = function (_ScatterPlotConfig) {
    _inherits(LeagueTablePlotConfig, _ScatterPlotConfig);

    // d3ColorCategory = false;

    function LeagueTablePlotConfig(custom) {
        _classCallCheck(this, LeagueTablePlotConfig);

        var _this = _possibleConstructorReturn(this, (LeagueTablePlotConfig.__proto__ || Object.getPrototypeOf(LeagueTablePlotConfig)).call(this));

        _this.maxWidth = undefined;
        _this.weightLowerBound = 0;
        _this.weightUpperBound = Infinity;
        _this.gradientArrowLength = 30;
        _this.gradientArrowOffset = 10;
        _this.payoffCoeffs = [1, 1];
        _this.payoffNames = [];
        _this.showLegend = true;
        _this.forceLegend = true;
        _this.legend = {
            width: 125
        };
        _this.guides = true;
        _this.dotRadius = 5;
        _this.emphasizedDotRadius = 8;

        _this.dotId = function (d, i) {
            return 'sd-league-table-dot-' + d.id;
        };

        if (custom) {
            _sdUtils.Utils.deepExtend(_this, custom);
        }

        return _this;
    }

    return LeagueTablePlotConfig;
}(_scatterplot.ScatterPlotConfig);

var LeagueTablePlot = function (_ScatterPlot) {
    _inherits(LeagueTablePlot, _ScatterPlot);

    function LeagueTablePlot(placeholderSelector, data, config) {
        _classCallCheck(this, LeagueTablePlot);

        return _possibleConstructorReturn(this, (LeagueTablePlot.__proto__ || Object.getPrototypeOf(LeagueTablePlot)).call(this, placeholderSelector, data, new LeagueTablePlotConfig(config)));
    }

    _createClass(LeagueTablePlot, [{
        key: "setConfig",
        value: function setConfig(config) {
            return _get(LeagueTablePlot.prototype.__proto__ || Object.getPrototypeOf(LeagueTablePlot.prototype), "setConfig", this).call(this, new LeagueTablePlotConfig(config));
        }
    }, {
        key: "init",
        value: function init() {
            _get(LeagueTablePlot.prototype.__proto__ || Object.getPrototypeOf(LeagueTablePlot.prototype), "init", this).call(this);
            this.svg.classed('sd-league-table-plot', true);
            this.initArrowMarker("triangle");
        }
    }, {
        key: "initArrowMarker",
        value: function initArrowMarker(id) {

            var defs = this.svg.selectOrAppend("defs");
            defs.append("marker").attr("id", id).attr("viewBox", "0 -5 10 10").attr("refX", 5).attr("refY", 0).attr("markerWidth", 4).attr("markerHeight", 4).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("class", "arrowHead");
        }
    }, {
        key: "initPlot",
        value: function initPlot() {
            d3.select(this.baseContainer).style('max-width', this.config.maxWidth);
            this.checkOrdering();
            _get(LeagueTablePlot.prototype.__proto__ || Object.getPrototypeOf(LeagueTablePlot.prototype), "initPlot", this).call(this);
        }
    }, {
        key: "checkOrdering",
        value: function checkOrdering() {
            var _this3 = this;

            if (this.config.groupOrdering) {
                var getOrdering = function getOrdering(d) {
                    var g = _this3.config.groups.value(d);
                    return _this3.config.groupOrdering[g] === undefined ? 999 : _this3.config.groupOrdering[g];
                };
                this.data.sort(function (a, b) {
                    return getOrdering(a) - getOrdering(b);
                });
            }
        }
    }, {
        key: "update",
        value: function update(newData) {
            this.checkOrdering();
            _get(LeagueTablePlot.prototype.__proto__ || Object.getPrototypeOf(LeagueTablePlot.prototype), "update", this).call(this, newData);

            this.updateIcerLines();
            this.updateDominatedRegion();
            this.updateGradientArrows();
            this.updateDotLabels();
        }
    }, {
        key: "updateIcerLines",
        value: function updateIcerLines() {
            var _this4 = this;

            var self = this;
            var linesContainerClass = this.linesContainerClass = this.prefixClass("lines-container");
            var linesContainerSelector = "g." + linesContainerClass;
            var linesContainer = this.linesContainer = self.svgG.selectOrInsert(linesContainerSelector, "." + self.dotsContainerClass);

            var clipPathId = self.prefixClass("clip-" + _sdUtils.Utils.guid());
            var linesContainerClip = linesContainer.selectOrAppend("clipPath").attr("id", clipPathId);

            linesContainerClip.selectOrAppend('rect').attr('width', self.plot.width).attr('height', self.plot.height).attr('x', 0).attr('y', 0);

            linesContainer.attr("clip-path", function (d, i) {
                return "url(#" + clipPathId + ")";
            });

            var line = d3.line().x(this.plot.x.map).y(this.plot.y.map);

            var linePoints = this.plot.data.filter(function (d) {
                return d.incratio !== null;
            }).sort(this.plot.x.map);
            var highlightedPoints = this.plot.data.filter(function (d) {
                return ["highlighted", "highlighted-default"].indexOf(_this4.plot.groupValue(d)) !== -1;
            }).sort(function (a, b) {
                return _this4.plot.x.map(a) - _this4.plot.x.map(b);
            });
            var highlightedDefaultPoints = highlightedPoints.filter(function (d) {
                return ["highlighted-default"].indexOf(_this4.plot.groupValue(d)) !== -1;
            });

            this.dominatedRegionPoints = highlightedPoints.map(function (d) {
                return [_this4.plot.x.map(d), _this4.plot.y.map(d)];
            });

            if (!highlightedPoints.length) {
                linesContainer.selectAll("*").remove();
                return;
            }

            linesContainer.selectOrAppend("path." + this.prefixClass('middle-incratio')).attr("shape-rendering", "optimizeQuality").attr("fill", "none").attr("stroke-width", 1).attr("stroke", 'black').attr("d", line(highlightedPoints));

            highlightedPoints.sort(function (a, b) {
                return a.incratio - b.incratio || _this4.config.payoffCoeffs[0] * (_this4.plot.x.map(a) - _this4.plot.x.map(b));
            });

            var minPoint = highlightedPoints[0];
            var maxPoint = highlightedPoints[highlightedPoints.length - 1];

            var lowPoint = void 0;
            var highPoint = void 0;

            var xAxisExtent = [this.plot.x.scale.invert(0), this.plot.x.scale.invert(this.plot.width)];
            var yAxisExtent = [this.plot.y.scale.invert(this.plot.height), this.plot.y.scale.invert(0)];

            var sign = this.config.payoffCoeffs[0] * this.config.payoffCoeffs[1] > 0 ? 1 : -1;

            var infLowY = this.config.payoffCoeffs[0] > 0 ? this.plot.height : 0;
            if (sign > 0) {
                infLowY = this.config.payoffCoeffs[0] < 0 ? this.plot.height : 0;
            }
            var infLowPoint = [this.plot.x.map(minPoint), infLowY];

            if (this.config.weightLowerBound == Infinity) {
                lowPoint = infLowPoint;
            } else {
                var x = this.config.payoffCoeffs[0] > 0 ? xAxisExtent[0] : xAxisExtent[1];
                lowPoint = [this.plot.x.scale(x), this.plot.y.scale(sign * this.config.weightLowerBound * (this.plot.x.value(minPoint) - x) + this.plot.y.value(minPoint))];
                if (Math.abs(lowPoint[1]) > 1000000) {
                    lowPoint = infLowPoint;
                }
            }

            var infHighPoint = [this.plot.x.map(maxPoint), this.config.payoffCoeffs[1] > 0 ? this.plot.height : 0];
            if (this.config.weightUpperBound == Infinity) {
                highPoint = infHighPoint;
            } else {

                var _x = this.config.payoffCoeffs[1] > 0 ? xAxisExtent[0] : xAxisExtent[1];

                if (sign > 0) {
                    _x = this.config.payoffCoeffs[1] < 0 ? xAxisExtent[0] : xAxisExtent[1];
                }

                highPoint = [this.plot.x.scale(_x), this.plot.y.scale(-sign * this.config.weightUpperBound * (_x - this.plot.x.value(maxPoint)) + this.plot.y.value(maxPoint))];
                // highPoint = [this.plot.x.scale(x), this.plot.y.scale(EE.toFloat(EE.multiply(-sign, EE.multiply(this.config.weightUpperBound, (x - this.plot.x.value(maxPoint))))) + this.plot.y.value(maxPoint))];
                if (Math.abs(highPoint[1]) > 1000000) {
                    highPoint = infHighPoint;
                }
            }

            if (highlightedDefaultPoints.length) {
                var defaultPoint = highlightedDefaultPoints[0];
                var defLowPoint = infLowPoint;
                var defHighPoint = infHighPoint;
                if (this.config.defaultWeight !== Infinity) {
                    var _x2 = this.config.payoffCoeffs[0] > 0 ? xAxisExtent[0] : xAxisExtent[1];
                    defLowPoint = [this.plot.x.scale(_x2), this.plot.y.scale(sign * this.config.defaultWeight * (this.plot.x.value(defaultPoint) - _x2) + this.plot.y.value(defaultPoint))];
                    _x2 = this.config.payoffCoeffs[1] > 0 ? xAxisExtent[0] : xAxisExtent[1];
                    if (sign > 0) {
                        _x2 = this.config.payoffCoeffs[1] < 0 ? xAxisExtent[0] : xAxisExtent[1];
                    }
                    defHighPoint = [this.plot.x.scale(_x2), this.plot.y.scale(-sign * this.config.defaultWeight * (_x2 - this.plot.x.value(defaultPoint)) + this.plot.y.value(defaultPoint))];
                }
                linesContainer.selectOrAppend("path." + this.prefixClass('default-incratio')).attr("shape-rendering", "optimizeQuality").attr("fill", "none").attr("stroke-width", 2).attr("stroke", 'black').attr("d", d3.line()([defLowPoint, defHighPoint]));
            } else {
                linesContainer.select("path." + this.prefixClass('default-incratio')).remove();
            }

            this.dominatedRegionPoints.unshift(lowPoint);
            this.dominatedRegionPoints.push(highPoint);

            linesContainer.selectOrAppend("path." + this.prefixClass('low-incratio')).attr("shape-rendering", "optimizeQuality").attr("fill", "none").attr("stroke-width", 2).attr("stroke", 'black').attr("d", d3.line()([lowPoint, [this.plot.x.map(minPoint), this.plot.y.map(minPoint)]]));

            linesContainer.selectOrAppend("path." + this.prefixClass('high-incratio')).attr("shape-rendering", "optimizeQuality").attr("fill", "none").attr("stroke-width", 2).attr("stroke", 'black').attr("d", d3.line()([highPoint, [this.plot.x.map(maxPoint), this.plot.y.map(maxPoint)]]));
        }
    }, {
        key: "updateDominatedRegion",
        value: function updateDominatedRegion() {
            var self = this;
            var dominatedRegionContainerClass = this.prefixClass("dominated-region-container");
            var dominatedRegionContainerSelector = "g." + dominatedRegionContainerClass;
            var dominatedRegionContainer = self.svgG.selectOrInsert(dominatedRegionContainerSelector, "." + this.linesContainerClass);

            var clipPathId = self.prefixClass("clip-" + _sdUtils.Utils.guid());
            var dominatedRegionContainerClip = dominatedRegionContainer.selectOrAppend("clipPath").attr("id", clipPathId);

            dominatedRegionContainerClip.selectOrAppend('rect').attr('width', self.plot.width).attr('height', self.plot.height).attr('x', 0).attr('y', 0);

            dominatedRegionContainer.attr("clip-path", function (d, i) {
                return "url(#" + clipPathId + ")";
            });

            //draw dominated region

            var worstPoint = [this.config.payoffCoeffs[0] < 0 ? self.plot.width : 0, this.config.payoffCoeffs[1] < 0 ? 0 : self.plot.height];

            this.dominatedRegionPoints.push(worstPoint);

            if (this.dominatedRegionPoints.some(function (p) {
                return worstPoint[1] ? p[1] <= 0 : p[1] >= self.plot.height;
            })) {
                this.dominatedRegionPoints.push([worstPoint[0], worstPoint[1] ? 0 : self.plot.height]);
            }

            this.dominatedRegionPoints.sort(function (a, b) {
                return a[0] - b[0];
            });
            this.dominatedRegionPoints = this.dominatedRegionPoints.reduce(function (prev, curr) {
                if (!prev.length) {
                    return [curr];
                }
                var prevPoint = prev[prev.length - 1];
                if (prevPoint[0] !== curr[0]) {
                    prev.push(curr);
                }
                if (Math.abs(worstPoint[1] - curr[1]) > Math.abs(worstPoint[1] - prev[prev.length - 1][1])) {
                    prev[prev.length - 1] = curr;
                }
                return prev;
            }, []);

            var area = d3.area();
            area.y0(worstPoint[1]);
            dominatedRegionContainer.selectOrInsert("path." + this.prefixClass('dominated-region')).attr("shape-rendering", "optimizeQuality").attr("fill", "gray").attr("stroke-width", 0).attr("d", area(this.dominatedRegionPoints));

            _sdTreeDesigner.Tooltip.attach(dominatedRegionContainer, _i18n.i18n.t('leagueTable.plot.tooltip.dominatedRegion'));
        }
    }, {
        key: "updateDotLabels",
        value: function updateDotLabels() {
            var self = this;
            var labelsContainerClass = this.prefixClass("dot-labels-container");
            var labelsContainerSelector = "g." + labelsContainerClass;
            var labelsContainer = self.svgG.selectOrAppend(labelsContainerSelector, "." + self.dotsContainerClass);

            var labels = labelsContainer.selectAll("text." + this.prefixClass("dot-label")).data(this.plot.data);
            labels.exit().remove();
            labels.enter().append('text').attr('class', this.prefixClass("dot-label")).merge(labels).attr('x', this.plot.x.map).attr('y', this.plot.y.map).attr('text-anchor', 'end').attr("dy", "-5px").attr("dx", "-5px").text(function (d) {
                return d.id;
            });
        }
    }, {
        key: "updateGradientArrows",
        value: function updateGradientArrows() {
            var _this5 = this;

            var data = this.config.payoffCoeffs.map(function (coeff, i) {

                var l = _this5.config.gradientArrowLength * coeff;
                var offset = _this5.config.gradientArrowOffset * coeff;

                var d = {
                    x1: _this5.plot.width / 2,
                    y1: _this5.plot.height / 2
                };

                if (i == 0) {
                    d.x1 += offset;
                    d.x2 = d.x1 + l;
                    d.y2 = d.y1;
                } else {
                    d.y1 -= offset;
                    d.x2 = d.x1;
                    d.y2 = d.y1 - l;
                }

                return d;
            });

            var self = this;
            var arrowsContainerClass = this.prefixClass("gradient-arrows-container");
            var arrowsContainerSelector = "g." + arrowsContainerClass;
            var arrowsContainer = self.svgG.selectOrInsert(arrowsContainerSelector, "." + self.dotsContainerClass);

            var arrowClass = this.prefixClass("gradient-arrow");
            var arrows = arrowsContainer.selectAll("." + arrowClass).data(data);
            arrows.exit().remove();
            var arrowsEnter = arrows.enter().append('g').attr('class', arrowClass);

            arrowsEnter.append("line").attr("marker-end", "url(#triangle)");
            var arrowsMerge = arrowsEnter.merge(arrows);

            arrowsMerge.select("line").attr("x1", function (d) {
                return d.x1;
            }).attr("y1", function (d) {
                return d.y1;
            }).attr("x2", function (d) {
                return d.x2;
            }).attr("y2", function (d) {
                return d.y2;
            });

            _sdTreeDesigner.Tooltip.attach(arrowsMerge, function (d, i) {
                return _i18n.i18n.t('leagueTable.plot.tooltip.gradientArrow' + (i + 1), { name: _this5.config.payoffNames[i] });
            });
        }
    }, {
        key: "emphasize",
        value: function emphasize(row) {
            var _emphasize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            this.emphasizeDot(this.svg.selectAll('#' + this.config.dotId(row)), _emphasize);
        }
    }, {
        key: "emphasizeDot",
        value: function emphasizeDot(selection, emphasize) {
            selection.classed('sd-emphasized', emphasize).transition().attr('r', emphasize ? this.config.emphasizedDotRadius : this.config.dotRadius);
        }
    }, {
        key: "updateDots",
        value: function updateDots() {
            var self = this;
            _get(LeagueTablePlot.prototype.__proto__ || Object.getPrototypeOf(LeagueTablePlot.prototype), "updateDots", this).call(this);
            var dotsContainer = this.svgG.select("g." + this.dotsContainerClass);
            dotsContainer.selectAll('.' + this.dotClass).on("mouseover.emphasize", function (d) {
                self.emphasizeDot(d3.select(this), true);
            }).on("mouseout.emphasize", function (d) {
                self.emphasizeDot(d3.select(this), false);
            });
        }
    }, {
        key: "updateLegend",
        value: function updateLegend() {
            _get(LeagueTablePlot.prototype.__proto__ || Object.getPrototypeOf(LeagueTablePlot.prototype), "updateLegend", this).call(this);
            var plot = this.plot;

            var container = plot.legend.container.selectOrAppend("g.sd-additional-items");
            var legendCells = plot.legend.container.select(".legendCells");
            var margin = 20;

            var texts = [_i18n.i18n.t("leagueTable.plot.legend.dominatedRegion"), _i18n.i18n.t("leagueTable.plot.legend.gradientArrows")];

            container.attr("transform", "translate(0, " + (legendCells.node().getBBox().height + margin) + ")");

            container.selectAll("text").data(texts).enter().append("text").text(function (d) {
                return d;
            }).attr('dy', "0").attr('x', "0");

            container.selectAll("text").call(wrap, function (d) {
                return d;
            }, this.config.legend.width);

            function wrap(text, getTextData, width) {
                text.each(function (d) {

                    var text = d3.select(this),
                        words = getTextData(d).split(/\s+/).reverse(),
                        word,
                        line = [],
                        lineNumber = 0,
                        lineHeight = 1.1,

                    // ems
                    y = text.attr('y'),
                        dy = parseFloat(text.attr('dy')),
                        tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');

                    if (this.previousSibling) {
                        text.attr('y', this.previousSibling.getBBox().height + 10);
                    }

                    while (word = words.pop()) {
                        line.push(word);
                        tspan.text(line.join(' '));
                        if (tspan.node().getComputedTextLength() > width) {
                            line.pop();
                            tspan.text(line.join(' '));
                            line = [word];
                            tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
                        }
                    }
                });
            }
        }
    }]);

    return LeagueTablePlot;
}(_scatterplot.ScatterPlot);

exports.LeagueTablePlot = LeagueTablePlot;

},{"../d3":92,"../i18n/i18n":105,"odc-d3/src/scatterplot":"odc-d3/src/scatterplot","sd-tree-designer":63,"sd-utils":"sd-utils"}],117:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LeagueTable = exports.LeagueTableConfig = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _sdUtils = require("sd-utils");

var _d = require("../d3");

var d3 = _interopRequireWildcard(_d);

var _policy = require("sd-computations/src/policies/policy");

var _i18n = require("../i18n/i18n");

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var LeagueTableConfig = exports.LeagueTableConfig = function LeagueTableConfig(custom) {
    _classCallCheck(this, LeagueTableConfig);

    this.onRowSelected = function (row) {};

    this.extendedPolicyDescription = true;

    this.onRowHover = function (d, i) {};

    this.onRowHoverOut = function (d, i) {};

    if (custom) {
        _sdUtils.Utils.deepExtend(this, custom);
    }
};

var LeagueTable = function () {
    function LeagueTable(container, config, dataModel) {
        _classCallCheck(this, LeagueTable);

        this.container = container;
        this.config = new LeagueTableConfig(config);
        this.dataModel = dataModel;
        this.init();
    }

    _createClass(LeagueTable, [{
        key: "init",
        value: function init() {
            this.resultTable = this.container.selectOrAppend("table.sd-league-table");
            this.resultTableHead = this.resultTable.selectOrAppend("thead");
            this.resultTableBody = this.resultTable.selectOrAppend("tbody");
            this.resultTableFoot = this.resultTable.selectOrAppend("tfoot");
        }
    }, {
        key: "setData",
        value: function setData(jobResult, dataModel) {
            this.jobResult = jobResult;
            this.dataModel = dataModel;
            this.drawHeaders([_i18n.i18n.t('leagueTable.headers.policyNo'), _i18n.i18n.t('leagueTable.headers.policy'), dataModel.payoffNames[0], dataModel.payoffNames[1], _i18n.i18n.t('leagueTable.headers.comment')]);
            this.drawRows(jobResult.rows);
        }
    }, {
        key: "drawHeaders",
        value: function drawHeaders(headerData) {
            var headers = this.resultTableHead.selectOrAppend("tr").selectAll("th").data(headerData);
            var headersEnter = headers.enter().append("th");
            var headersMerge = headersEnter.merge(headers);
            headers.exit().remove();

            headersMerge.text(function (d) {
                return d;
            });
        }
    }, {
        key: "drawRows",
        value: function drawRows(rowsData) {
            var _this = this;

            var self = this;

            var data = rowsData.reduce(function (prev, d) {
                var r = prev;
                d.policies.forEach(function (policy, i) {
                    if (!i) {
                        r.push({
                            row: d,
                            policy: policy,
                            cells: [{
                                data: d.id,
                                rowspan: d.policies.length
                            }, {
                                data: _policy.Policy.toPolicyString(policy, _this.config.extendedPolicyDescription),
                                rowspan: 1
                            }, {
                                data: d.payoffs[0],
                                rowspan: d.policies.length
                            }, {
                                data: d.payoffs[1],
                                rowspan: d.policies.length
                            }, {
                                data: _this.getRowComment(d),
                                rowspan: d.policies.length
                            }]
                        });
                        return;
                    }

                    r.push({
                        row: d,
                        policy: policy,
                        cells: [{
                            data: _policy.Policy.toPolicyString(policy, _this.config.extendedPolicyDescription),
                            rowspan: 1
                        }]
                    });
                });

                return r;
            }, []);

            var rows = this.resultTableBody.selectAll("tr").data(data);

            var rowsEnter = rows.enter().append("tr");
            var rowsMerge = rowsEnter.merge(rows);
            rowsMerge.on('click', function (d, i) {
                // d3.select(this).classed('sd-selected', true);
                self.config.onRowSelected(d, i);
            }).classed('sd-highlighted', function (d) {
                return d.row.optimal;
            }).classed('sd-highlighted-default', function (d) {
                return d.row.optimalForDefaultWeight;
            }).attr('id', function (d) {
                return 'sd-league-table-row-' + d.row.id;
            });

            rowsMerge.on("mouseover.onRowHover", this.config.onRowHover);
            rowsMerge.on("mouseout.onRowHoverOut", this.config.onRowHoverOut);

            rows.exit().remove();

            var cells = rowsMerge.selectAll("td").data(function (d) {
                return d.cells;
            });
            var cellsEnter = cells.enter().append("td");
            var cellsMerge = cellsEnter.merge(cells);
            cellsMerge.text(function (d) {
                return d.data;
            });
            cellsMerge.attr('rowspan', function (d) {
                return d.rowspan;
            });
            cells.exit().remove();
        }
    }, {
        key: "clear",
        value: function clear() {
            this.clearSelection();
        }
    }, {
        key: "show",
        value: function show() {
            var _show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.container.classed('sd-hidden', !_show);
        }
    }, {
        key: "hide",
        value: function hide() {
            this.show(false);
        }
    }, {
        key: "clearSelection",
        value: function clearSelection() {
            this.resultTable.selectAll('.sd-selected').classed('sd-selected', false);
        }
    }, {
        key: "getRowComment",
        value: function getRowComment(row) {
            if (row.incratio !== null) {
                return _i18n.i18n.t('leagueTable.comment.incratio', { incratio: row.incratio });
            }
            if (row.dominatedBy !== null) {
                return _i18n.i18n.t('leagueTable.comment.dominatedBy', { policy: row.dominatedBy });
            }
            if (row.extendedDominatedBy !== null) {
                return _i18n.i18n.t('leagueTable.comment.extendedDominatedBy', { policy1: row.extendedDominatedBy[0], policy2: row.extendedDominatedBy[1] });
            }
            return '';
        }
    }, {
        key: "emphasize",
        value: function emphasize(row) {
            var _emphasize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            this.resultTableBody.selectAll('#sd-league-table-row-' + row.id).classed('sd-emphasized', _emphasize);
        }
    }]);

    return LeagueTable;
}();

exports.LeagueTable = LeagueTable;

},{"../d3":92,"../i18n/i18n":105,"sd-computations/src/policies/policy":"sd-computations/src/policies/policy","sd-utils":"sd-utils"}],118:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LoadingIndicator = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _d = require('./d3');

var d3 = _interopRequireWildcard(_d);

var _i18n = require('./i18n/i18n');

var _sdUtils = require('sd-utils');

var _templates = require('./templates');

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var LoadingIndicator = exports.LoadingIndicator = function () {
    function LoadingIndicator() {
        _classCallCheck(this, LoadingIndicator);
    }

    _createClass(LoadingIndicator, null, [{
        key: 'show',
        value: function show() {
            var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            var html = _templates.Templates.get('loadingIndicator');

            var g = d3.select('body').selectOrAppend('div.sd-loading-indicator-container').html(html).select('.sd-loading-indicator').classed('visible', true).style('display', 'block');
        }
    }, {
        key: 'hide',
        value: function hide() {
            var select = d3.select('.sd-loading-indicator');
            select.classed('visible', false);
            setTimeout(function () {
                select.style('display', 'none');
            }, 500);
        }
    }]);

    return LoadingIndicator;
}();

},{"./d3":92,"./i18n/i18n":105,"./templates":121,"sd-utils":"sd-utils"}],119:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PivotTable = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _sdUtils = require('sd-utils');

var _i18n = require('./i18n/i18n');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }return arr2;
    } else {
        return Array.from(arr);
    }
}

var jQuery = require('jquery');
var global$ = _sdUtils.Utils.getGlobalObject().jQuery;
_sdUtils.Utils.getGlobalObject().jQuery = jQuery; //FIXME
require('jquery-ui/ui/data');
require('jquery-ui/ui/scroll-parent');
require('jquery-ui/ui/widget');
require('jquery-ui/ui/widgets/mouse');
require('jquery-ui/ui/widgets/sortable');
require('pivottable');

// pivot show zero hack start
var numberFormat = jQuery.pivotUtilities.numberFormat;
try {
    jQuery.pivotUtilities.numberFormat = function (opts) {
        if (!opts) {
            opts = {};
        }
        opts.showZero = true;
        return numberFormat(opts);
    };
} catch (e) {
    _sdUtils.log.error('Error when performing pivottable "show zero" hack, reverting');

    try {
        jQuery.pivotUtilities.numberFormat = numberFormat;
    } catch (e) {}
}

require('pivottable/dist/pivot.it');
require('pivottable/dist/pivot.de');
require('pivottable/dist/pivot.fr');
require('pivottable/dist/pivot.pl');

_sdUtils.Utils.getGlobalObject().jQuery = global$;

// pivot show zero hack continuation
try {
    var origAggregators = {};
    _sdUtils.Utils.forOwn(jQuery.pivotUtilities.locales.en.aggregators, function (value, key, object) {
        origAggregators[key] = value;
        object[key] = function () {
            var args1 = arguments;
            try {
                var res1 = value.apply(this, args1);
                return function () {
                    var res = res1.apply(undefined, arguments);
                    var format_ = res.format;
                    res.format = function (x) {
                        var origX = x;
                        if (x === 0) {
                            x = "0";
                        }
                        try {
                            return format_(x);
                        } catch (e) {
                            _sdUtils.log.error('Error when performing pivottable "show zero" hack (format func call), reverting', e);
                            if (format_) {
                                return format_(origX);
                            }
                            revertAggregators();
                        }
                    };
                    return res;
                };
            } catch (e) {
                _sdUtils.log.error('Error when performing pivottable "show zero" hack, reverting', e);
                revertAggregators();
                return origAggregators[key].apply(origAggregators, _toConsumableArray(args1));
            }
        };
    });
} catch (e) {
    _sdUtils.log.error('Error when performing pivottable "show zero" hack, reverting', e);
    revertAggregators();
}

function revertAggregators() {
    try {
        _sdUtils.Utils.forOwn(jQuery.pivotUtilities.locales.en.aggregators, function (value, key, object) {
            var origAggregator = origAggregators[key];
            if (origAggregator) {
                object[key] = origAggregator;
            }
        });
    } catch (e) {
        _sdUtils.log.error('Error when reverting aggregators', e);
    }
}

///////////////////// hack end

var PivotTable = exports.PivotTable = function () {
    function PivotTable(container, options, data) {
        _classCallCheck(this, PivotTable);

        this.container = container;
        this.options = options;
        this.data = data;
        if (data) {
            this.update(data, options);
        }
    }

    _createClass(PivotTable, [{
        key: 'update',
        value: function update(data, options) {
            this.data = data;
            this.options = options;
            jQuery(this.container.node()).pivotUI(data, options, true, _i18n.i18n.language);
        }
    }, {
        key: 'clear',
        value: function clear() {
            jQuery(this.container.node()).pivotUI([], null, true);
        }
    }, {
        key: 'getAggregatorName',
        value: function getAggregatorName(name) {
            return _i18n.i18n.t("jobResultTable.pivot.aggregators." + name.toLowerCase());
        }
    }, {
        key: 'getRendererName',
        value: function getRendererName(name) {
            return _i18n.i18n.t("jobResultTable.pivot.renderers." + name.toLowerCase());
        }
    }]);

    return PivotTable;
}();

},{"./i18n/i18n":105,"jquery":"jquery","jquery-ui/ui/data":62,"jquery-ui/ui/scroll-parent":"jquery-ui/ui/scroll-parent","jquery-ui/ui/widget":"jquery-ui/ui/widget","jquery-ui/ui/widgets/mouse":"jquery-ui/ui/widgets/mouse","jquery-ui/ui/widgets/sortable":"jquery-ui/ui/widgets/sortable","pivottable":"pivottable","pivottable/dist/pivot.de":"pivottable/dist/pivot.de","pivottable/dist/pivot.fr":"pivottable/dist/pivot.fr","pivottable/dist/pivot.it":"pivottable/dist/pivot.it","pivottable/dist/pivot.pl":"pivottable/dist/pivot.pl","sd-utils":"sd-utils"}],120:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Sidebar = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _d = require("./d3");

var d3 = _interopRequireWildcard(_d);

var _i18n = require("./i18n/i18n");

var _sdUtils = require("sd-utils");

var _appUtils = require("./app-utils");

var _sdModel = require("sd-model");

var _payoffInputValidator = require("./validation/payoff-input-validator");

var _probabilityInputValidator = require("./validation/probability-input-validator");

var _templates = require("./templates");

var _sdTreeDesigner = require("sd-tree-designer");

var _inputField = require("./form/input-field");

var _pathValueAccessor = require("./form/path-value-accessor");

var _numberInputValidator = require("./validation/number-input-validator");

var _requiredInputValidator = require("./validation/required-input-validator");

var _mcdmWeightValueValidator = require("sd-computations/src/validation/mcdm-weight-value-validator");

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Sidebar = exports.Sidebar = function () {
    function Sidebar(container, app) {
        _classCallCheck(this, Sidebar);

        this.dispatch = d3.dispatch("recomputed", "object-updated", "multi-criteria-updated");

        this.app = app;
        this.container = container;

        this.initLayoutOptions();
        this.initDiagramDetails();
        this.initDefinitions();
        this.initMultipleCriteria();
        var self = this;

        document.addEventListener('SilverDecisionsRecomputedEvent', function (data) {
            if (data.detail === app) {
                self.dispatch.call("recomputed");
            }
        });

        self.dispatch.on("object-updated", _sdUtils.Utils.debounce(function (object, fieldName) {
            return self.app.onObjectUpdated(object, fieldName);
        }, 350));
        self.dispatch.on("multi-criteria-updated", _sdUtils.Utils.debounce(function (fieldName) {
            return self.app.onMultiCriteriaUpdated(fieldName);
        }, 350));
    }

    _createClass(Sidebar, [{
        key: "initLayoutOptions",
        value: function initLayoutOptions() {
            var _this2 = this;

            var self = this;
            this.layoutOptionsContainer = this.container.select('#layout-options');
            this.autoLayoutOptionsGroup = this.layoutOptionsContainer.select('#auto-layout-options');
            this.gridWidth = this.layoutOptionsContainer.select('input#grid-width').on('change', function () {
                self.app.treeDesigner.layout.setGridWidth(parseInt(this.value));
            });

            this.gridHeight = this.layoutOptionsContainer.select('input#grid-height').on('change', function () {
                self.app.treeDesigner.layout.setGridHeight(parseInt(this.value));
            });

            this.nodeSize = this.layoutOptionsContainer.select('input#node-size').on('change', function () {
                self.app.treeDesigner.layout.setNodeSize(parseInt(this.value));
            });

            this.edgeSlantWidthMax = this.layoutOptionsContainer.select('input#edge-slant-width-max').on('change', function () {
                self.app.treeDesigner.layout.setEdgeSlantWidthMax(parseInt(this.value));
            });

            this.marginHorizontal = this.layoutOptionsContainer.select('input#margin-horizontal').on('change', function () {
                var m = {};
                m.left = m.right = parseInt(this.value);
                self.app.treeDesigner.setMargin(m);
            });
            this.marginVertical = this.layoutOptionsContainer.select('input#margin-vertical').on('change', function () {
                var m = {};
                m.top = m.bottom = parseInt(this.value);
                self.app.treeDesigner.setMargin(m);
            });

            self.app.treeDesigner.layout.onAutoLayoutChanged.push(function (layout) {
                return self.updateLayoutOptions();
            });

            this.layoutOptionsContainer.select('.toggle-button').on('click', function () {
                _this2.layoutOptionsContainer.classed('sd-extended', !_this2.layoutOptionsContainer.classed('sd-extended'));
            });

            this.updateLayoutOptions();
        }
    }, {
        key: "updateLayoutOptions",
        value: function updateLayoutOptions() {
            this.nodeSize.node().value = this.app.treeDesigner.config.layout.nodeSize;
            this.edgeSlantWidthMax.node().value = this.app.treeDesigner.config.layout.edgeSlantWidthMax;
            this.marginHorizontal.node().value = this.app.treeDesigner.config.margin.left;
            this.marginVertical.node().value = this.app.treeDesigner.config.margin.top;
            this.gridWidth.node().value = this.app.treeDesigner.config.layout.gridWidth;
            this.gridHeight.node().value = this.app.treeDesigner.config.layout.gridHeight;
            this.autoLayoutOptionsGroup.classed('visible', !this.app.treeDesigner.layout.isManualLayout());
        }
    }, {
        key: "initDiagramDetails",
        value: function initDiagramDetails() {
            var _this3 = this;

            var self = this;
            this.diagramDetailsContainer = this.container.select('#diagram-details-box');
            this.diagramDetailsContainer.classed('sd-hidden', !this.app.config.showDetails);

            this.diagramDetailsContainer.select('.toggle-button').on('click', function () {
                _this3.diagramDetailsContainer.classed('sd-extended', !_this3.diagramDetailsContainer.classed('sd-extended'));
                _this3.updateDiagramDetails();
            });

            this.diagramTitle = this.diagramDetailsContainer.select('input#diagram-title').on('change', function () {
                self.app.setDiagramTitle(this.value);
                _appUtils.AppUtils.updateInputClass(d3.select(this));
            });

            this.diagramDescription = this.diagramDetailsContainer.select('textarea#diagram-description').on('change', function () {
                self.app.setDiagramDescription(this.value);
                _appUtils.AppUtils.updateInputClass(d3.select(this));
            });
            _appUtils.AppUtils.elasticTextarea(this.diagramDescription);

            this.updateDiagramDetails();
        }
    }, {
        key: "initDefinitions",
        value: function initDefinitions() {
            var _this4 = this;

            var self = this;
            this.definitionsContainer = this.container.select('#sd-sidebar-definitions');
            this.definitionsContainer.classed('sd-hidden', !this.app.config.showDefinitions);
            this.onDefinitionsCodeChanged = null;
            this.definitionsContainer.select('.toggle-button').on('click', function () {
                _this4.definitionsContainer.classed('sd-extended', !_this4.definitionsContainer.classed('sd-extended'));
                _appUtils.AppUtils.updateInputClass(_this4.definitionsCode);
                _appUtils.AppUtils.autoResizeTextarea(_this4.definitionsCode.node());
            });

            this.definitionsScopeLabel = this.definitionsContainer.select('.sd-variables-scope-value');

            this.definitionsCode = this.definitionsContainer.select('textarea#sd-sidebar-definitions-code').on('change', function () {
                if (self.onDefinitionsCodeChanged) {
                    self.onDefinitionsCodeChanged(this.value);
                }
                _appUtils.AppUtils.updateInputClass(d3.select(this));
            });
            _sdTreeDesigner.Tooltip.attach(this.definitionsCode, function (d) {
                return self.definitionsCode.attr('data-error-msg');
            }, 15, 50);

            this.definitionsEvaluatedValuesContainer = this.container.select("#sd-sidebar-definitions-evaluated-values");

            this.definitionsContainer.select('#sd-sidebar-definitions-open-dialog-button').on('click', function () {
                _this4.app.openDefinitionsDialog();
            });

            this.definitionsContainer.select('#sd-sidebar-definitions-recalculate-button').on('click', function () {
                _this4.app.recompute();
            });

            _appUtils.AppUtils.elasticTextarea(this.definitionsCode);
        }
    }, {
        key: "initMultipleCriteria",
        value: function initMultipleCriteria() {
            var _this5 = this;

            var self = this;
            this.multipleCriteriaContainer = this.container.select('#sd-multiple-criteria');
            this.multipleCriteriaContainer.classed('sd-hidden', !this.app.isMultipleCriteria());

            this.multipleCriteriaContainer.select('.toggle-button').on('click', function () {
                _this5.multipleCriteriaContainer.classed('sd-extended', !_this5.multipleCriteriaContainer.classed('sd-extended'));
            });

            this.showLeagueTableButton = this.multipleCriteriaContainer.select('#sd-show-league-table-button').on('click', function () {
                _this5.app.showLeagueTable();
            });

            this.flipCriteriaButton = this.multipleCriteriaContainer.select('#sd-flip-criteria-button').on('click', function () {
                _this5.app.flipCriteria();
            });

            var weightParser = function weightParser(w) {
                return parseFloat(w) === Infinity ? Infinity : w;
            };

            this.multipleCriteriaFields = [];
            this.multipleCriteriaFields.push(new _inputField.InputField('sd-multiple-criteria-nameOfCriterion1', 'nameOfCriterion1', 'text', _i18n.i18n.t('multipleCriteria.nameOfCriterion1'), new _pathValueAccessor.PathValueAccessor(self.app.dataModel, 'payoffNames[0]'), new _requiredInputValidator.RequiredInputValidator()));
            this.multipleCriteriaFields.push(new _inputField.InputField('sd-multiple-criteria-nameOfCriterion2', 'nameOfCriterion2', 'text', _i18n.i18n.t('multipleCriteria.nameOfCriterion2'), new _pathValueAccessor.PathValueAccessor(self.app.dataModel, 'payoffNames[1]'), new _requiredInputValidator.RequiredInputValidator()));
            var lowerBoundValueAccessor = new _pathValueAccessor.PathValueAccessor(self.app.dataModel, 'weightLowerBound');
            var upperBoundValueAccessor = new _pathValueAccessor.PathValueAccessor(self.app.dataModel, 'weightUpperBound');
            var weightValueValidator = new _mcdmWeightValueValidator.McdmWeightValueValidator();
            var ee = this.app.expressionEngine.constructor;

            this.multipleCriteriaFields.push(new _inputField.InputField('sd-multiple-criteria-weightLowerBound', 'weightLowerBound', 'text', _i18n.i18n.t('multipleCriteria.weightLowerBound'), lowerBoundValueAccessor, new _mcdmWeightValueValidator.McdmWeightValueValidator(function (v) {
                var upper = upperBoundValueAccessor.get();
                return weightValueValidator.validate(upper) ? ee.compare(v, upper) <= 0 : true;
            }), null, weightParser));

            this.multipleCriteriaFields.push(new _inputField.InputField('sd-multiple-criteria-defaultCriterion1Weight', 'defaultCriterion1Weight', 'text', _i18n.i18n.t('multipleCriteria.defaultCriterion1Weight'), new _pathValueAccessor.PathValueAccessor(self.app.dataModel, 'defaultCriterion1Weight'), new _mcdmWeightValueValidator.McdmWeightValueValidator(function (v) {
                var upper = upperBoundValueAccessor.get();
                var lower = lowerBoundValueAccessor.get();
                return (weightValueValidator.validate(lower) ? ee.compare(v, lower) >= 0 : true) && (weightValueValidator.validate(upper) ? ee.compare(v, upper) <= 0 : true);
            }), null, weightParser));

            this.multipleCriteriaFields.push(new _inputField.InputField('sd-multiple-criteria-weightUpperBound', 'weightUpperBound', 'text', _i18n.i18n.t('multipleCriteria.weightUpperBound'), upperBoundValueAccessor, new _mcdmWeightValueValidator.McdmWeightValueValidator(function (v) {
                var lower = lowerBoundValueAccessor.get();
                return weightValueValidator.validate(lower) ? ee.compare(v, lower) >= 0 : true;
            }), null, weightParser));

            this.updateMultipleCriteria();
        }
    }, {
        key: "updateMultipleCriteria",
        value: function updateMultipleCriteria() {
            var updateInputs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            //TODO refactor
            var ee = this.app.expressionEngine;

            var self = this;
            var temp = {};
            this.multipleCriteriaContainer.classed('sd-hidden', !this.app.isMultipleCriteria());

            var leagueTableAvailable = this.app.isLeagueTableAvailable();
            this.showLeagueTableButton.attr("disabled", leagueTableAvailable ? undefined : "disabled");
            this.flipCriteriaButton.attr("disabled", leagueTableAvailable ? undefined : "disabled");
            this.multipleCriteriaContainer.classed('sd-invalid-league-table-params', !leagueTableAvailable);

            if (!updateInputs) {
                return;
            }

            var inputGroups = this.multipleCriteriaContainer.select(".sd-multiple-criteria-properties").selectAll('div.input-group').data(this.multipleCriteriaFields);
            inputGroups.exit().remove();
            var inputGroupsEnter = inputGroups.enter().appendSelector('div.input-group').html(function (d) {
                return d.type == 'select' ? _templates.Templates.get('selectInputGroup', d) : _templates.Templates.get('inputGroup', d);
            });
            inputGroupsEnter.merge(inputGroups).select('.sd-input').on('change input', function (d, i) {
                var prevValue = d.getValue();

                var isValid = !d.validator || d.validator.validate(this.value);

                var selection = d3.select(this);
                selection.classed('invalid', !isValid);
                if (d.styleClass) {
                    selection.classed(d.styleClass, true);
                }

                if (d3.event.type == 'change' && temp[i].pristineVal != this.value) {
                    self.app.dataModel.saveStateFromSnapshot(temp[i].pristineStateSnapshot);
                    if (d.onChange) {
                        d.onChange(object, this.value, temp[i].pristineVal);
                    }
                }

                if (prevValue + "" == this.value) {
                    return;
                }

                _appUtils.AppUtils.updateInputClass(selection);
                d.setValue(d.parse(this.value));
                self.dispatch.call("multi-criteria-updated", self, d.name);
            }).on('focus', function (d, i) {
                temp[i].pristineVal = this.value;

                temp[i].pristineStateSnapshot = self.app.dataModel.createStateSnapshot();
            }).each(function (d, i) {
                var value = d.getValue();

                this.value = value;
                temp[i] = {};
                d3.select(this).classed('invalid', d.validator && !d.validator.validate(this.value));

                _appUtils.AppUtils.updateInputClass(d3.select(this));
                if (d.type == 'textarea') {
                    _appUtils.AppUtils.elasticTextarea(d3.select(this));
                    _appUtils.AppUtils.autoResizeTextarea(d3.select(this).node());
                }
            });
        }
    }, {
        key: "updateDefinitions",
        value: function updateDefinitions(definitionsSourceObject, readOnly, changeCallback) {
            this.definitionsContainer.classed('sd-read-only', readOnly);
            this.onDefinitionsCodeChanged = changeCallback;

            var scopeType = 'global';
            if (definitionsSourceObject instanceof _sdModel.domain.Node) {
                scopeType = 'node';
            }

            this.definitionsScopeLabel.text(_i18n.i18n.t("sidebarDefinitions.scope." + scopeType));

            this.definitionsCode.node().value = definitionsSourceObject.code;
            this.definitionsCode.classed('invalid', !!definitionsSourceObject.$codeError);
            this.definitionsCode.attr('data-error-msg', definitionsSourceObject.$codeError);
            var html = _templates.Templates.get('evaluatedVariables', { scopeVariables: _sdUtils.Utils.getVariablesAsList(definitionsSourceObject.expressionScope) });
            this.definitionsEvaluatedValuesContainer.html(html);
            _appUtils.AppUtils.updateInputClass(this.definitionsCode);
            _appUtils.AppUtils.autoResizeTextarea(this.definitionsCode.node());
        }
    }, {
        key: "updateDiagramDetails",
        value: function updateDiagramDetails() {
            this.diagramTitle.node().value = this.app.config.title;
            _appUtils.AppUtils.updateInputClass(this.diagramTitle);
            this.diagramDescription.node().value = this.app.config.description;
            _appUtils.AppUtils.updateInputClass(this.diagramDescription);
            _appUtils.AppUtils.autoResizeTextarea(this.diagramDescription.node());
        }
    }, {
        key: "displayObjectProperties",
        value: function displayObjectProperties(object) {
            this.updateObjectPropertiesView(object);
        }
    }, {
        key: "hideObjectProperties",
        value: function hideObjectProperties() {

            this.container.select('#object-properties').classed('visible', false);
            this.container.selectAll('div.child-object').remove();
        }
    }, {
        key: "updateObjectPropertiesView",
        value: function updateObjectPropertiesView(object) {
            this.dispatch.on(".recomputed", null); //remove all callbacks for recomputed event
            if (!object) {
                this.hideObjectProperties();
                return;
            }

            var objectProps = this.objectProps = this.container.select('#object-properties').classed('visible', true);
            var headerText = Sidebar.getHeaderTextForObject(object);
            objectProps.select('.header').html(headerText);

            var fieldList = this.getFieldListForObject(object);
            this.updateObjectFields(object, fieldList, objectProps.select('.content .main-properties'));

            this.updateObjectChildrenProperties(object);
        }
    }, {
        key: "updateObjectChildrenProperties",
        value: function updateObjectChildrenProperties(object) {
            var self = this;
            var childObjects = this.getChildObjectList(object);
            var objectType = Sidebar.getObjectType(object);

            var childPropsSelector = this.objectProps.select('.content .children-properties');

            childPropsSelector.classed('visible', childObjects.length);

            childPropsSelector.select('.children-properties-header').text(_i18n.i18n.t('objectProperties.childrenProperties.' + objectType + '.header'));
            var childrenContent = childPropsSelector.select('.children-properties-content');
            var children = childrenContent.selectAll('div.child-object').data(childObjects, function (d, i) {
                return d.$id || i;
            });
            var childrenEnter = children.enter().appendSelector('div.child-object');
            var childrenMerge = childrenEnter.merge(children);

            childrenMerge.each(updateChildObjectProperties);

            children.exit().remove();

            function updateChildObjectProperties(child, i) {
                var container = d3.select(this);
                container.selectOrAppend('div.child-header').text(_i18n.i18n.t('objectProperties.childrenProperties.' + objectType + '.child.header', { number: i + 1 }));

                var fieldList = self.getFieldListForObject(child);
                self.updateObjectFields(child, fieldList, container.selectOrAppend('div.field-list'));
            }
        }
    }, {
        key: "getChildObjectList",
        value: function getChildObjectList(object) {
            if (object instanceof _sdModel.domain.Node) {
                return object.childEdges.sort(function (a, b) {
                    return a.childNode.location.y - b.childNode.location.y;
                });
            }
            if (object instanceof _sdModel.domain.Edge) {
                return [];
            }
            return [];
        }
    }, {
        key: "getFieldListForObject",
        value: function getFieldListForObject(object) {
            var self = this;

            if (object instanceof _sdModel.domain.Node) {
                return [new ObjectInputField(object, {
                    name: 'name',
                    type: 'textarea'
                })];
            }
            if (object instanceof _sdModel.domain.Edge) {
                var multipleCriteria = this.app.isMultipleCriteria();
                var list = [new ObjectInputField(object, {
                    name: 'name',
                    type: 'textarea'
                }), new ObjectInputField(object, {
                    name: 'payoff',
                    path: 'payoff[' + (self.app.currentViewMode.payoffIndex || 0) + ']',
                    label: multipleCriteria ? self.app.dataModel.payoffNames[0] : undefined,
                    type: 'text',
                    validator: new _payoffInputValidator.PayoffInputValidator(self.app.expressionEngine)
                })];

                if (multipleCriteria) {
                    list.push(new ObjectInputField(object, {
                        name: 'payoff2',
                        path: 'payoff[1]',
                        label: self.app.dataModel.payoffNames[1],
                        type: 'text',
                        validator: new _payoffInputValidator.PayoffInputValidator(self.app.expressionEngine)
                    }));
                }

                if (object.parentNode instanceof _sdModel.domain.ChanceNode) {
                    list.push(new ObjectInputField(object, {
                        name: 'probability',
                        type: 'text',
                        validator: new _probabilityInputValidator.ProbabilityInputValidator(self.app.expressionEngine)
                    }));
                }
                return list;
            }
            if (object instanceof _sdModel.domain.Text) {
                return [new ObjectInputField(object, {
                    name: 'value',
                    type: 'textarea'
                })];
            }

            return [];
        }
    }, {
        key: "updateObjectFields",
        value: function updateObjectFields(object, fieldList, container) {
            var self = this;

            var fields = container.selectAll('div.object-field').data(fieldList);
            var temp = {};
            var fieldsEnter = fields.enter().appendSelector('div.object-field');
            var fieldsMerge = fieldsEnter.merge(fields);

            fieldsMerge.each(function (d, i) {
                var fieldSelection = d3.select(this);
                fieldSelection.html("");

                var input;
                if (d.type == 'textarea') {
                    input = fieldSelection.append('textarea').attr('rows', 1);
                } else {
                    input = fieldSelection.append('input');
                }
                input.classed('sd-input', true);

                fieldSelection.appendSelector('span.bar');
                fieldSelection.append('label');
                fieldSelection.classed('input-group', true);
            });

            fieldsMerge.select('label').attr('for', function (d) {
                return d.id;
            }).html(function (d) {
                return d.label;
            });
            fieldsMerge.select('.sd-input').attr('type', function (d) {
                return d.type == 'textarea' ? undefined : d.type;
            }).attr('name', function (d) {
                return d.name;
            }).attr('id', function (d) {
                return d.id;
            }).on('change keyup', function (d, i) {
                var prevValue = d.getValue();
                var isValid = !d.validator || d.validator.validate(this.value, object, d.path);
                object.setSyntaxValidity(d.path, isValid);

                d3.select(this).classed('invalid', !object.isFieldValid(d.path));

                if (d3.event.type == 'change' && temp[i].pristineVal != this.value) {
                    self.app.dataModel.saveStateFromSnapshot(temp[i].pristineStateSnapshot);
                    if (d.onChange) {
                        d.onChange(object, this.value, temp[i].pristineVal);
                    }
                }

                if (prevValue + "" == this.value) {
                    return;
                }

                _appUtils.AppUtils.updateInputClass(d3.select(this));
                if (d.customOnInput) {
                    d.customOnInput(object, this.value, temp[i].pristineVal);
                } else {
                    d.setValue(this.value);
                    self.dispatch.call("object-updated", self, object, d.path);
                }
            }).on('focus', function (d, i) {
                temp[i].pristineVal = this.value;
                temp[i].pristineStateSnapshot = self.app.dataModel.createStateSnapshot();
            }).each(function (d, i) {
                this.value = d.getValue();
                temp[i] = {};
                if (d.validator && !d.validator.validate(this.value, object, d.path)) {
                    d3.select(this).classed('invalid', true);
                    object.setSyntaxValidity(d.path, false);
                } else {
                    object.setSyntaxValidity(d.path, true);
                }

                var _this = this;
                var checkFieldStatus = function checkFieldStatus() {
                    d3.select(_this).classed('invalid', !object.isFieldValid(d.path));
                };
                checkFieldStatus();

                self.dispatch.on("recomputed." + object.$id + "." + d.path, checkFieldStatus);

                _appUtils.AppUtils.updateInputClass(d3.select(this));
                if (d.type == 'textarea') {
                    _appUtils.AppUtils.elasticTextarea(d3.select(this));
                    _appUtils.AppUtils.autoResizeTextarea(d3.select(this).node());
                }
            });

            fields.exit().remove();
        }
    }], [{
        key: "getObjectType",
        value: function getObjectType(object) {
            if (object instanceof _sdModel.domain.Node) {
                return 'node';
            }
            if (object instanceof _sdModel.domain.Edge) {
                return 'edge';
            }
            if (object instanceof _sdModel.domain.Text) {
                return 'text';
            }
            return '';
        }
    }, {
        key: "getHeaderTextForObject",
        value: function getHeaderTextForObject(object) {
            if (object instanceof _sdModel.domain.Node) {
                return _i18n.i18n.t('objectProperties.header.node.' + object.type);
            }
            if (object instanceof _sdModel.domain.Edge) {
                return _i18n.i18n.t('objectProperties.header.edge');
            }
            if (object instanceof _sdModel.domain.Text) {
                return _i18n.i18n.t('objectProperties.header.text');
            }
            return '';
        }
    }]);

    return Sidebar;
}();

var ObjectInputField = function (_InputField) {
    _inherits(ObjectInputField, _InputField);

    //config object with fields: name, path, type, validator, options
    function ObjectInputField(object, config) {
        _classCallCheck(this, ObjectInputField);

        var _this6 = _possibleConstructorReturn(this, (ObjectInputField.__proto__ || Object.getPrototypeOf(ObjectInputField)).call(this, 'object-' + object.$id + '-field-' + config.name, config.name, config.type, config.label ? config.label : _i18n.i18n.t(Sidebar.getObjectType(object) + '.' + config.name), new _pathValueAccessor.PathValueAccessor(object, config.path || config.name), config.validator, config.options));

        _this6.path = config.path || config.name;
        _this6.onChange = config.onChange;
        return _this6;
    }

    return ObjectInputField;
}(_inputField.InputField);

},{"./app-utils":89,"./d3":92,"./form/input-field":100,"./form/path-value-accessor":101,"./i18n/i18n":105,"./templates":121,"./validation/number-input-validator":151,"./validation/payoff-input-validator":152,"./validation/probability-input-validator":153,"./validation/required-input-validator":154,"sd-computations/src/validation/mcdm-weight-value-validator":"sd-computations/src/validation/mcdm-weight-value-validator","sd-model":"sd-model","sd-tree-designer":63,"sd-utils":"sd-utils"}],121:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Templates = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _sdTreeDesigner = require("sd-tree-designer");

var _i18n = require("./i18n/i18n");

var _sdUtils = require("sd-utils");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Templates = exports.Templates = function (_TdTemplates) {
    _inherits(Templates, _TdTemplates);

    function Templates() {
        _classCallCheck(this, Templates);

        return _possibleConstructorReturn(this, (Templates.__proto__ || Object.getPrototypeOf(Templates)).apply(this, arguments));
    }

    _createClass(Templates, null, [{
        key: "get",

        //TODO automate
        value: function get(templateName, variables) {
            var compiled = _sdUtils.Utils.template(Templates[templateName], { 'imports': { 'i18n': _i18n.i18n, 'Templates': Templates, 'include': function include(n, v) {
                        return Templates.get(n, v);
                    } } });
            if (variables) {
                variables.variables = variables;
            } else {
                variables = { variables: {} };
            }
            return compiled(variables);
        }
    }]);

    return Templates;
}(_sdTreeDesigner.Templates);

Templates.about_de = require('./templates/about/de.html');
Templates.about_en = require('./templates/about/en.html');
Templates.about_fr = require('./templates/about/fr.html');
Templates.about_it = require('./templates/about/it.html');
Templates.about_pl = require('./templates/about/pl.html');
Templates.toolbar = require('./templates/toolbar.html');
Templates.layoutOptions = require('./templates/sidebar/layout_options.html');
Templates.objectProperties = require('./templates/sidebar/object_properties.html');
Templates.diagramDetailsBox = require('./templates/sidebar/diagram_details_box.html');
Templates.evaluatedVariables = require('./templates/evaluated_variables.html');
Templates.definitions = require('./templates/sidebar/definitions.html');
Templates.multipleCriteria = require('./templates/sidebar/multiple_criteria.html');
Templates.sidebar = require('./templates/sidebar/sidebar.html');
Templates.settingsDialog = require('./templates/settings_dialog.html');
Templates.settingsDialogFormGroup = require('./templates/settings_dialog_form_group.html');
Templates.inputGroup = require('./templates/input_group.html');
Templates.selectInputGroup = require('./templates/select_input_group.html');
Templates.help = require('./templates/help.html');
Templates.aboutDialog = require('./templates/about_dialog.html');
Templates.definitionsDialog = require('./templates/definitions_dialog.html');
Templates.sensitivityAnalysisDialog = require('./templates/sensitivity_analysis_dialog.html');
Templates.jobParametersBuilder = require('./templates/jobs/job_parameters_builder.html');
Templates.jobParameter = require('./templates/jobs/job_parameter.html');
Templates.leagueTableDialog = require('./templates/league_table_dialog.html');
Templates.loadingIndicator = require('./templates/loading_indicator.html');
Templates.fullscreenPopup = require('./templates/fullscreen_popup.html');
Templates.warningMessage = require('./templates/warning_message.html');
Templates.main = require('./templates/main.html');

},{"./i18n/i18n":105,"./templates/about/de.html":122,"./templates/about/en.html":123,"./templates/about/fr.html":124,"./templates/about/it.html":125,"./templates/about/pl.html":126,"./templates/about_dialog.html":127,"./templates/definitions_dialog.html":128,"./templates/evaluated_variables.html":129,"./templates/fullscreen_popup.html":130,"./templates/help.html":131,"./templates/input_group.html":132,"./templates/jobs/job_parameter.html":133,"./templates/jobs/job_parameters_builder.html":134,"./templates/league_table_dialog.html":135,"./templates/loading_indicator.html":136,"./templates/main.html":137,"./templates/select_input_group.html":138,"./templates/sensitivity_analysis_dialog.html":139,"./templates/settings_dialog.html":140,"./templates/settings_dialog_form_group.html":141,"./templates/sidebar/definitions.html":142,"./templates/sidebar/diagram_details_box.html":143,"./templates/sidebar/layout_options.html":144,"./templates/sidebar/multiple_criteria.html":145,"./templates/sidebar/object_properties.html":146,"./templates/sidebar/sidebar.html":147,"./templates/toolbar.html":148,"./templates/warning_message.html":149,"sd-tree-designer":63,"sd-utils":"sd-utils"}],122:[function(require,module,exports){
module.exports = "<p>\n    <strong>SilverDecisions <%= version %> (gebaut <%= buildTimestamp%>)</strong><br/>Open Source Entscheidungsbaum Software.\n</p>\n<p>\n<strong>Zitierung:</strong><br/>\nB. Kamiński, M. Jakubczyk, P. Szufel: A framework for sensitivity analysis of decision trees, Central European Journal of Operations Research (2017).</br>\n<a href=\"https://link.springer.com/article/10.1007/s10100-017-0479-6\" target=\"_blank\">doi:10.1007/s10100-017-0479-6</a>\n</p>\n<p class=\"sd-project-team\">\n    Projektteam:\n    <ul>\n        <li><a href=\"http://bogumilkaminski.pl/\" target=\"_blank\">Bogumił Kamiński</a> (Projektleiter)</li>\n        <li><a href=\"https://szufel.pl/\" target=\"_blank\">Przemysław Szufel</a> (Stellvertretender Projektleiter)</li>\n        <li><a href=\"https://github.com/mwasiluk\" target=\"_blank\">Michał Wasiluk</a> (Designer)</li>\n        <li><a href=\"http://www.michaljakubczyk.pl/\" target=\"_blank\">Michał Jakubczyk</a> (Entwickler)</li>\n        <li>Anna Wiertlewska (Projekt Unterstützung)</li>\n        <li>Marcin Czupryna (Tester)</li>\n    </ul>\n</p>\n<p>\n    Das Projekt wird von Decision Support and Analysis Division, Warsaw School of Economics entwickelt.<br/>\n    Kontakt: silverdecisions@sgh.waw.pl\n</p>\n<p>\n    SilverDecisions ist ein gemeinschaftsgetriebenes Projekt. Sollten Sie es für Ihre Untericht, Forschung oder jede andere Aktivität, die Sie mit uns teilen möchten verwenden, wir würden uns freuen, einen Link zu Ihren Aktivitäten zu der <a href=\"https://github.com/SilverDecisions/SilverDecisions/wiki/SilverDecisions-Community\" target=\"_blank\">SilverDecisions Gemeinschaft</a> Seite hinzufügen zu können.\n</p>\n<p>\n    Software wird als Teil von <a href=\"http://routetopa.eu/\" target=\"_blank\">ROUTE-TO-PA</a> Projekt entwickelt. Dieses Projekt hat      Mittel aus dem Horizon 2020 (Forschungs- und Innovationsprogramm der Europäischen Union) im Rahmen der Finanzhilfevereinbarung Nr 645860 erhalten. Ziel dieses Projektes ist es, eine transparente Kommunikation zwischen der öffentlichen Verwaltung und den Bürgern über das Thema, öffentliche Daten und Entscheidungsprozesse zu unterstützen. \n</p>\n<p>\n    Alle Quelldateien werden unter den Bedingungen der GNU Lesser General Public License Version 3 lizenziert.\n</p>\n<p>\n    Für weitere Informationen besuchen Sie bitte, unsere Website unter <a href=\"http://silverdecisions.pl/\" target=\"_blank\">http://silverdecisions.pl/</a>.\n</p>\n";

},{}],123:[function(require,module,exports){
module.exports = "<p>\n    <strong>SilverDecisions <%= version %> (build <%= buildTimestamp%>)</strong><br/>A free and open source decision tree software.\n</p>\n<p>\n<strong>Citation:</strong><br/>\nB. Kamiński, M. Jakubczyk, P. Szufel: A framework for sensitivity analysis of decision trees, Central European Journal of Operations Research (2017).</br>\n<a href=\"https://link.springer.com/article/10.1007/s10100-017-0479-6\" target=\"_blank\">doi:10.1007/s10100-017-0479-6</a>\n</p>\n<p class=\"sd-project-team\">\n    Project team:\n    <ul>\n        <li><a href=\"http://bogumilkaminski.pl/\" target=\"_blank\">Bogumił Kamiński</a> (project manager)</li>\n        <li><a href=\"https://szufel.pl/\" target=\"_blank\">Przemysław Szufel</a> (deputy project manager)</li>\n        <li><a href=\"https://github.com/mwasiluk\" target=\"_blank\">Michał Wasiluk</a> (developer)</li>\n        <li><a href=\"http://www.michaljakubczyk.pl/\" target=\"_blank\">Michał Jakubczyk</a> (designer)</li>\n        <li>Anna Wiertlewska (documentalist)</li>\n        <li>Marcin Czupryna (tester)</li>\n    </ul>\n</p>\n<p>\n    The project is developed at Decision Support and Analysis Division, Warsaw School of Economics.<br/>\n    Contact: silverdecisions@sgh.waw.pl\n</p>\n<p>\n    SilverDecisions is a community-driven project, so if you use it for teaching, research or any other activity that you would be willing to share please let us know. We would be glad to add a link to your activities on <a href=\"https://github.com/SilverDecisions/SilverDecisions/wiki/SilverDecisions-Community\" target=\"_blank\">SilverDecisions Community</a> page.\n</p>\n<p>\n    Software is developed as a part of <a href=\"http://routetopa.eu/\" target=\"_blank\">ROUTE-TO-PA</a> Project that has\n    received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No\n    645860. Its aim is to allow a transparent communication between public administration and citizens regarding public\n    data about decision making processes performed by public administration.\n</p>\n<p>\n    All the source files are licensed under the terms of the GNU Lesser General Public License version 3.\n</p>\n<p>\n    For more information visit our website at <a href=\"http://silverdecisions.pl/\" target=\"_blank\">http://silverdecisions.pl/</a>.\n</p>\n";

},{}],124:[function(require,module,exports){
module.exports = "<p>\n    <strong>SilverDecisions <%= version %> (build <%= buildTimestamp%>)</strong><br/>Un logiciel libre et open source pour faire son propre arbre de décision.\n</p>\n\n<p>\n<strong>Citation:</strong><br/>\nB. Kamiński, M. Jakubczyk, P. Szufel: A framework for sensitivity analysis of decision trees, Central European Journal of Operations Research (2017).</br>\n<a href=\"https://link.springer.com/article/10.1007/s10100-017-0479-6\" target=\"_blank\">doi:10.1007/s10100-017-0479-6</a>\n</p>\n\n<p class=\"sd-project-team\">\n    Equipe du projet:\n    <ul>\n        <li><a href=\"http://bogumilkaminski.pl/\" target=\"_blank\">Bogumił Kamiński</a> (chef de projet)</li>\n        <li><a href=\"https://szufel.pl/\" target=\"_blank\">Przemysław Szufel</a> (chef de projet adjoint)</li>\n        <li><a href=\"https://github.com/mwasiluk\" target=\"_blank\">Michał Wasiluk</a> (développeur)</li>\n        <li><a href=\"http://www.michaljakubczyk.pl/\" target=\"_blank\">Michał Jakubczyk</a> (designer)</li>\n        <li>Anna Wiertlewska (documentaliste)</li>\n\t<li>Marcin Czupryna (testeur)</li>\n    </ul>\n</p>\n<p>\n    Le projet est conçu et développé par la Division de l'aide à la décision et de l'analyse, à l'École d'économie de Varsovie. <br/>Contact: silverdecisions@sgh.waw.pl\n</p>\n<p>\n    SilverDecisions est un projet communautaire, donc si vous l'utilisez pour l'enseignement, la recherche ou toute autre activité que vous aimeriez partager, \n    faites-le nous savoir. Nous serions heureux d'ajouter un lien vers vos activités sur le site web de \n    <a href=\"https://github.com/SilverDecisions/SilverDecisions/wiki/SilverDecisions-Community\" target=\"_blank\">SilverDecisions Community</a>.\n</p>\n<p>  \n    Le logiciel est développé dans le cadre du projet <a href=\"http://routetopa.eu/\" target=\"_blank\">ROUTE-TO-PA</a>, \n    financé par le programme de recherche et d'innovation Horizon 2020 de l'Union Européenne dans le cadre de l'accord de subvention n° 645860. \n    Son objectif est permettre une communication transparente entre l'administration publique et les citoyens \n    concernant les données publiques (Open Data) et la prise de décision des administrations.  \n</p>\n<p>\n    Tous les fichiers source sont sous licence GNU Lesser General Public License version 3.\n</p>\n<p>\n    Pour plus d'informations, visitez notre site web à <a href=\"http://silverdecisions.pl/\" target=\"_blank\">http://silverdecisions.pl/</a>.\n</p>\n\n";

},{}],125:[function(require,module,exports){
module.exports = "<p>\n    <strong>SilverDecisions <%= version %> (construzione <%= buildTimestamp%>)</strong><br/>\n    Un Software Open Source Free per gestire alberi di decisione.\n</p>\n\n<p>\n<strong>Citazione:</strong><br/>\nB. Kamiński, M. Jakubczyk, P. Szufel: A framework for sensitivity analysis of decision trees, Central European Journal of Operations Research (2017).</br>\n<a href=\"https://link.springer.com/article/10.1007/s10100-017-0479-6\" target=\"_blank\">doi:10.1007/s10100-017-0479-6</a>\n</p>\n\n<p class=\"sd-project-team\">\n    Team di progetto:\n    <ul>\n        <li><a href=\"http://bogumilkaminski.pl/\" target=\"_blank\">Bogumił Kamiński</a> (project manager)</li>\n        <li><a href=\"https://szufel.pl/\" target=\"_blank\">Przemysław Szufel</a> (vice project manager)</li>\n        <li><a href=\"https://github.com/mwasiluk\" target=\"_blank\">Michał Wasiluk</a> (sviluppo)</li>\n        <li>Marcin Czupryna (test)</li>\n        <li><a href=\"http://www.michaljakubczyk.pl/\" target=\"_blank\">Michał Jakubczyk</a> (tester)</li>\n        <li>Anna Wiertlewska (documentazione)</li>\n    </ul>\n</p>\n<p>\n    Il progetto è sviluppato presso la Divisione “Supporto alla decisione ed Analisi” della Scuola di Economia dell’Università di Varsavia. <br/>Contatto:\n    silverdecisions@sgh.waw.pl\n</p>\n<p>\nSilverDecision è un Progetto basato su di una Comunità di sviluppo, se lo utilizzi a scopo di insegnamento, ricerca o altra attività che vorresti rendere nota tienici informati. Saremmo lieti di aggiungere un <a href=\"https://github.com/SilverDecisions/SilverDecisions/wiki/SilverDecisions-Community\" target=\"_blank\">link</a> alla tua attività.\n</p>\n<p>\n    Il software è sviluppato nell’ambito del progetto <a href=\"http://routetopa.eu/\" target=\"_blank\">ROUTE-TO-PA</a> \n    finanziato dal programma di ricerca ed innovazione H2020 dell’ Unione Europea (contratto n. 645860). \n    Scopo del progetto è quello di permettere una comunicazione trasparente tra Pubblica Amministrazione e cittadini \n    riguardo ai dati pubblici ed ai processi di decisione portati avanti dalla stessa Pubblica Amministrazione.    \n</p>\n<p>\n    Tutti i codici sorgente sono rilasciati secondo i termini della licenza “GNU Lesser General Public License version 3\".\n</p>\n<p>\n    Per maggiori informazioni visita il sito <a href=\"http://silverdecisions.pl/\" target=\"_blank\">http://silverdecisions.pl/</a>.\n</p>\n\n";

},{}],126:[function(require,module,exports){
module.exports = "<p>\n    <strong>SilverDecisions <%= version %> (build <%= buildTimestamp%>)</strong><br/>\n    Oprogramowanie do analizy drzew decyzyjnych typu Free Open Source.\n</p>\n\n<p>\n<strong>Cytowanie:</strong><br/>\nB. Kamiński, M. Jakubczyk, P. Szufel: A framework for sensitivity analysis of decision trees, Central European Journal of Operations Research (2017).</br>\n<a href=\"https://link.springer.com/article/10.1007/s10100-017-0479-6\" target=\"_blank\">doi:10.1007/s10100-017-0479-6</a>\n</p>\n\n<p class=\"sd-project-team\">\n    Zespół projektowy:\n    <ul>\n        <li><a href=\"http://bogumilkaminski.pl/\" target=\"_blank\">Bogumił Kamiński</a> (manager projektu)</li>\n        <li><a href=\"https://szufel.pl/\" target=\"_blank\">Przemysław Szufel</a> (zastępca managera projektu)</li>\n        <li><a href=\"https://github.com/mwasiluk\" target=\"_blank\">Michał Wasiluk</a> (developer)</li>\n        <li><a href=\"http://www.michaljakubczyk.pl/\" target=\"_blank\">Michał Jakubczyk</a> (projektant)</li>\n        <li>Anna Wiertlewska (dokumentalistka)</li>\n        <li>Marcin Czupryna (tester)</li>\n    </ul>\n</p>\n<p>\n    Projekt jest realizowany w Zakładzie Wspomagania i Analizy Decyzji w Szkole Głównej Handlowej w Warszawie.<br/>\n    Kontakt: silverdecisions@sgh.waw.pl\n</p>\n<p>\n    Rozwój SilverDecisions zależy od potrzeb użytkowników. W związku z tym jeśli wykorzystujesz je do nauczania, badań lub innych aktywności, o których zechcesz na powiedzieć prosimy o kontakt. Byłoby nam bardzo miło, jeśli moglibyśmy dodać informację o Twoich aktywnościach na stronie <a href=\"https://github.com/SilverDecisions/SilverDecisions/wiki/SilverDecisions-Community\" target=\"_blank\">SilverDecisions Community</a>.\n</p>\n<p>\n<p>\n    Oprogramowanie jest rozwijane w ramach projektu <a href=\"http://routetopa.eu/\" target=\"_blank\">ROUTE-TO-PA</a> (<em>Raising\n    Open and User-friendly Transparency-Enabling Technologies for Public Administrations</em>),\n    który jest finansowany ze środków Europejskiego Programu w Zakresie Badań Naukowych i Innowacji Horizon 2020 na\n    podstawie umowy o dotację nr 645860. Celem projektu ROUTE-TO-PA jest umożliwienie przejrzystej komunikacji pomiędzy\n    administracją publiczną a mieszkańcami w zakresie publicznych danych dotyczących procesu podejmowania przez\n    administracje publiczne decyzji.\n</p>\n<p>\n    Wszystkie pliki źródłowe są licencjonowane zgodnie ze słabszą powszechną licencją publiczną GNU (GNU Lesser General Public License version 3).\n</p>\n<p>\n    Więcej informacji można znaleźć na stronie internetowej: <a href=\"http://silverdecisions.pl/\" target=\"_blank\">http://silverdecisions.pl/</a>.\n</p>\n";

},{}],127:[function(require,module,exports){
module.exports = "<div id=\"sd-about-dialog\" class=\"sd-modal\">\n    <div class=\"sd-modal-content\">\n        <div class=\"sd-modal-header\">\n            <span class=\"sd-modal-button sd-close-modal\"><i class=\"material-icons\">close</i></span>\n            <span class=\"sd-modal-button sd-extend-modal\"><i class=\"material-icons\">fullscreen</i></span>\n            <span class=\"sd-modal-button sd-shrink-modal\"><i class=\"material-icons\">fullscreen_exit</i></span>\n            <h2><%= i18n.t(\"aboutDialog.title\")%></h2>\n        </div>\n        <div class=\"sd-modal-body\">\n            <% if ( [\"de\", \"en\", \"fr\", \"it\", \"pl\"].indexOf(lng) !== -1) { %>\n                <%= include('about_'+lng, variables) %>\n            <% } else { %>\n                <%= include('about_en', variables) %>\n            <% } %>\n\n            <%= include('help', variables) %>\n        </div>\n    </div>\n</div>\n";

},{}],128:[function(require,module,exports){
module.exports = "<div id=\"sd-definitions-dialog\" class=\"sd-modal\">\n    <div class=\"sd-modal-content\">\n        <div class=\"sd-modal-header\">\n            <span class=\"sd-modal-button sd-close-modal\"><i class=\"material-icons\">close</i></span>\n            <span class=\"sd-modal-button sd-extend-modal\"><i class=\"material-icons\">fullscreen</i></span>\n            <span class=\"sd-modal-button sd-shrink-modal\"><i class=\"material-icons\">fullscreen_exit</i></span>\n            <h2><%= i18n.t(\"definitionsDialog.title\")%>: <span class=\"sd-definitions-dialog-scope-label\"></span></h2>\n        </div>\n        <div class=\"sd-modal-body\">\n            <div class=\"definitions-form\">\n                <div class=\"input-group\">\n                    <textarea id=\"sd-definitions-dialog-definitions-code\" name=\"sd-definitions-code\"></textarea>\n                    <span class=\"bar\"></span>\n                </div>\n            </div>\n\n            <div class=\"evaluated-variables-preview\">\n                <h3><%= i18n.t('definitionsDialog.evaluatedVariables')%>:</h3>\n                <div id=\"sd-definitions-dialog-variable-values\"></div>\n            </div>\n            <div class=\"action-buttons\">\n                <button id=\"sd-definitions-dialog-recalculate-button\" class=\"icon-button\"  title=\"<%= i18n.t('definitionsDialog.buttons.recalculate')%>\"><i class=\"material-icons\">refresh</i></button>\n            </div>\n        </div>\n    </div>\n</div>\n";

},{}],129:[function(require,module,exports){
module.exports = "<table class=\"sd-evaluated-variables\">\n    <% for(i=0; i<scopeVariables.length; ++i) { %>\n    <tr>\n        <td><%= scopeVariables[i].key %></td>\n        <td>=</td>\n        <td><%= scopeVariables[i].value %></td>\n    </tr>\n    <% } %>\n</table>\n";

},{}],130:[function(require,module,exports){
module.exports = "<div class=\"sd-fullscreen-popup\">\n    <div class=\"sd-popup-header\">\n        <span class=\"sd-close-popup\"><i class=\"material-icons\">close</i></span>\n        <h2><%= title %></h2>\n    </div>\n\n    <div class=\"sd-popup-body\">\n        <%= body %>\n    </div>\n</div>\n";

},{}],131:[function(require,module,exports){
module.exports = "<div>\n    <h3><%= i18n.t(\"help.header\")%></h3>\n    <p>\n        <%= i18n.t(\"help.mouse.header\")%>\n        <ul>\n            <li><%= i18n.t(\"help.mouse.list.1\")%></li>\n            <li><%= i18n.t(\"help.mouse.list.2\")%></li>\n            <li><%= i18n.t(\"help.mouse.list.3\")%></li>\n        </ul>\n    </p>\n    <p>\n        <%= i18n.t(\"help.keyboard.header\")%>\n        <ul>\n            <li><%= i18n.t(\"help.keyboard.list.1\")%></li>\n            <li><%= i18n.t(\"help.keyboard.list.2\")%></li>\n            <li><%= i18n.t(\"help.keyboard.list.3\")%></li>\n            <li><%= i18n.t(\"help.keyboard.list.4\")%></li>\n            <li><%= i18n.t(\"help.keyboard.list.5\")%></li>\n            <li><%= i18n.t(\"help.keyboard.list.6\")%></li>\n        </ul>\n    </p>\n    <p><%= i18n.t(\"help.docs\")%></p>\n</div>\n";

},{}],132:[function(require,module,exports){
module.exports = "<input id=\"<%= id %>\" type=\"<%= type %>\" name=\"<%= name %>\" class=\"sd-input\">\n<span class=\"bar\"></span>\n<label for=\"<%= id %>\"><%= label %></label>\n";

},{}],133:[function(require,module,exports){
module.exports = "\n";

},{}],134:[function(require,module,exports){
module.exports = "<div class=\"sd-job-parameters-builder\">\n\n</div>\n";

},{}],135:[function(require,module,exports){
module.exports = "<div class=\"sd-modal sd-league-table-dialog\">\n    <div class=\"sd-modal-content\">\n        <div class=\"sd-modal-header\">\n            <span class=\"sd-modal-button sd-close-modal\"><i class=\"material-icons\">close</i></span>\n            <span class=\"sd-modal-button sd-extend-modal\"><i class=\"material-icons\">fullscreen</i></span>\n            <span class=\"sd-modal-button sd-shrink-modal\"><i class=\"material-icons\">fullscreen_exit</i></span>\n\n            <h2><%= i18n.t(\"leagueTableDialog.title\")%></h2>\n        </div>\n        <div class=\"sd-modal-body\">\n            <div class=\"sd-league-table-warnings\">\n\n            </div>\n            <div class=\"sd-job-progress-bar-container sd-progress-bar-container sd-hidden\"><div class=\"sd-progress-bar\"></div></div>\n            <div class=\"sd-league-table-job-results sd-hidden\">\n                <div class=\"sd-job-result-table-container\"></div>\n                <div class=\"sd-job-result-plot-container\"></div>\n            </div>\n            <div class=\"sd-league-table-action-buttons\">\n                <button class=\"sd-download-csv-button sd-hidden\"><%= i18n.t('leagueTableDialog.buttons.downloadCsv')%></button>\n            </div>\n        </div>\n    </div>\n</div>\n";

},{}],136:[function(require,module,exports){
module.exports = "<div class=\"sd-loading-indicator\">\n    <div></div>\n    <div class=\"sd-spinner\" title=\"loading...\"></div>\n</div>\n";

},{}],137:[function(require,module,exports){
module.exports = "<div id=\"silver-decisions\" tabindex=\"0\">\n    <%= include('toolbar', variables) %>\n    <div id=\"main-region\">\n        <%= include('sidebar', variables) %>\n        <div id=\"tree-designer-container\"></div>\n    </div>\n    <input type=\"file\" style=\"display:none\" id=\"sd-file-input\" accept=\".json\"/>\n    <%= include('settingsDialog', variables) %>\n    <%= include('aboutDialog', variables) %>\n    <%= include('definitionsDialog', variables) %>\n    <%= include('sensitivityAnalysisDialog', variables) %>\n    <%= include('leagueTableDialog', variables) %>\n</div>\n";

},{}],138:[function(require,module,exports){
module.exports = "<select id=\"<%= id %>\" name=\"<%= name %>\" class=\"sd-input\">\n    <% for(i=0; i<options.length; ++i) { %>\n    <option value=\"<% if (options[i].value !== undefined){ %><%= options[i].value %><%} else { %><%= options[i] %><%}%>\"><% if (options[i].label !== undefined){ %><%= options[i].label %><%} else { %><%= options[i] %><%}%></option>\n    <% } %>\n</select>\n<span class=\"bar\"></span>\n<label for=\"<%= id %>\"><%= label %></label>\n";

},{}],139:[function(require,module,exports){
module.exports = "<div class=\"sd-modal sd-sensitivity-analysis-dialog\">\n    <div class=\"sd-modal-content\">\n        <div class=\"sd-modal-header\">\n            <span class=\"sd-modal-button sd-close-modal\"><i class=\"material-icons\">close</i></span>\n            <span class=\"sd-modal-button sd-extend-modal\"><i class=\"material-icons\">fullscreen</i></span>\n            <span class=\"sd-modal-button sd-shrink-modal\"><i class=\"material-icons\">fullscreen_exit</i></span>\n\n            <h2><%= i18n.t(\"sensitivityAnalysisDialog.title\")%></h2>\n        </div>\n        <div class=\"sd-modal-body\">\n            <div class=\"sd-sensitivity-analysis-job-configuration\">\n                <div class=\"sd-job-select-input-group input-group\"></div>\n                <%= include('jobParametersBuilder', variables) %>\n            </div>\n            <div class=\"sd-sensitivity-analysis-warnings\">\n\n            </div>\n            <div class=\"sd-job-progress-bar-container sd-progress-bar-container sd-hidden\"><div class=\"sd-progress-bar\"></div></div>\n            <div class=\"sd-sensitivity-analysis-job-results sd-hidden\">\n                <div class=\"sd-job-result-table-container\"></div>\n                <div class=\"sd-job-result-plot-container\"></div>\n            </div>\n            <div class=\"sd-sensitivity-analysis-action-buttons\">\n                <button class=\"sd-terminate-job-button sd-hidden\"><%= i18n.t('sensitivityAnalysisDialog.buttons.terminateJob')%></button>\n                <button class=\"sd-stop-job-button sd-hidden\"><%= i18n.t('sensitivityAnalysisDialog.buttons.stopJob')%></button>\n                <button class=\"sd-resume-job-button sd-hidden\"><%= i18n.t('sensitivityAnalysisDialog.buttons.resumeJob')%></button>\n                <button class=\"sd-back-button  sd-hidden\"><%= i18n.t('sensitivityAnalysisDialog.buttons.back')%></button>\n                <button class=\"sd-download-csv-button sd-hidden\"><%= i18n.t('sensitivityAnalysisDialog.buttons.downloadCsv')%></button>\n                <button class=\"sd-clear-button \"><%= i18n.t('sensitivityAnalysisDialog.buttons.clear')%></button>\n                <button class=\"sd-run-job-button\"><%= i18n.t('sensitivityAnalysisDialog.buttons.runJob')%></button>\n\n            </div>\n        </div>\n    </div>\n</div>\n";

},{}],140:[function(require,module,exports){
module.exports = "<div id=\"sd-settings-dialog\" class=\"sd-modal\">\n    <div class=\"sd-modal-content\">\n        <div class=\"sd-modal-header\">\n            <span class=\"sd-modal-button sd-close-modal\"><i class=\"material-icons\">close</i></span>\n            <span class=\"sd-modal-button sd-extend-modal\"><i class=\"material-icons\">fullscreen</i></span>\n            <span class=\"sd-modal-button sd-shrink-modal\"><i class=\"material-icons\">fullscreen_exit</i></span>\n            <h2><%= i18n.t(\"settingsDialog.title\")%></h2>\n        </div>\n        <div class=\"sd-modal-body\">\n            <form id=\"sd-settings-form\">\n            </form>\n        </div>\n    </div>\n</div>\n";

},{}],141:[function(require,module,exports){
module.exports = "<div class=\"header\">\n    <h4><%= i18n.t(\"settingsDialog.\"+name+\".title\")%>\n        <span class=\"toggle-button\">\n            <i class=\"material-icons icon-arrow-up\">keyboard_arrow_up</i>\n            <i class=\"material-icons icon-arrow-down\">keyboard_arrow_down</i>\n        </span>\n    </h4>\n</div>\n<div class=\"sd-form-group-content\">\n    <div class=\"sd-form-group-inputs\"></div>\n    <div class=\"sd-form-group-child-groups\"></div>\n</div>\n";

},{}],142:[function(require,module,exports){
module.exports = "<div id=\"sd-sidebar-definitions\">\n    <div class=\"header\">\n        <%= i18n.t(\"sidebarDefinitions.header\")%>\n        <span class=\"toggle-button\">\n            <i class=\"material-icons icon-arrow-up\">keyboard_arrow_up</i>\n            <i class=\"material-icons icon-arrow-down\">keyboard_arrow_down</i>\n        </span>\n    </div>\n    <div class=\"content\">\n        <div class=\"sd-variables-scope\">\n            <div class=\"sd-variables-scope-label\"><%= i18n.t('sidebarDefinitions.scope.label')%></div>\n            <div class=\"sd-variables-scope-value\"></div>\n        </div>\n        <div class=\"input-group\">\n            <textarea rows=\"1\" id=\"sd-sidebar-definitions-code\" type=\"text\" name=\"sidebar-definitions-code\"></textarea>\n            <span class=\"bar\"></span>\n            <label for=\"sd-sidebar-definitions-code\"><%= i18n.t(\"sidebarDefinitions.code\") %></label>\n        </div>\n        <div class=\"evaluated-variables-preview\">\n            <div class=\"evaluated-variables-preview-header\">\n                <%= i18n.t('sidebarDefinitions.evaluatedVariables')%>\n            </div>\n            <div id=\"sd-sidebar-definitions-evaluated-values\"></div>\n        </div>\n        <div class=\"sd-action-buttons\">\n            <button id=\"sd-sidebar-definitions-open-dialog-button\" class=\"icon-button\"  title=\"<%= i18n.t('sidebarDefinitions.buttons.openDialog')%>\"><i class=\"material-icons\">open_in_new</i></button>\n            <button id=\"sd-sidebar-definitions-recalculate-button\" class=\"icon-button\"  title=\"<%= i18n.t('sidebarDefinitions.buttons.recalculate')%>\"><i class=\"material-icons\">refresh</i></button>\n        </div>\n    </div>\n</div>\n";

},{}],143:[function(require,module,exports){
module.exports = "<div id=\"diagram-details-box\">\n    <div class=\"header\">\n        <%= i18n.t(\"diagramDetails.header\")%>\n        <span class=\"toggle-button\">\n            <i class=\"material-icons icon-arrow-up\">keyboard_arrow_up</i>\n            <i class=\"material-icons icon-arrow-down\">keyboard_arrow_down</i>\n        </span>\n    </div>\n    <div class=\"content\">\n        <div class=\"input-group\">\n            <input id=\"diagram-title\" type=\"text\" name=\"diagram-title\">\n            <span class=\"bar\"></span>\n            <label for=\"diagram-title\"><%= i18n.t(\"diagramDetails.title\") %></label>\n        </div>\n        <div class=\"input-group\">\n            <textarea id=\"diagram-description\" name=\"diagram-description\"></textarea>\n            <span class=\"bar\"></span>\n            <label for=\"diagram-description\"><%= i18n.t(\"diagramDetails.description\") %></label>\n        </div>\n    </div>\n</div>\n";

},{}],144:[function(require,module,exports){
module.exports = "<div id=\"layout-options\">\n    <div class=\"header\">\n        <%= i18n.t(\"layoutOptions.header\")%>\n        <span class=\"toggle-button\">\n            <i class=\"material-icons icon-arrow-up\">keyboard_arrow_up</i>\n            <i class=\"material-icons icon-arrow-down\">keyboard_arrow_down</i>\n        </span>\n    </div>\n    <div class=\"content\">\n        <div class=\"input-group\">\n            <input id=\"margin-horizontal\" name=\"margin-horizontal\" type=\"range\" min=\"5\" max=\"150\" step=\"5\"/>\n            <label for=\"margin-horizontal\"><%= i18n.t(\"layoutOptions.marginHorizontal\")%></label>\n        </div>\n        <div class=\"input-group\">\n            <input id=\"margin-vertical\" name=\"margin-vertical\" type=\"range\" min=\"5\" max=\"150\" step=\"5\"/>\n            <label for=\"margin-vertical\"><%= i18n.t(\"layoutOptions.marginVertical\")%></label>\n        </div>\n        <div class=\"input-group\">\n            <input id=\"node-size\" name=\"node-size\" type=\"range\" min=\"20\" max=\"60\" step=\"5\"/>\n            <label for=\"node-size\"><%= i18n.t(\"layoutOptions.nodeSize\")%></label>\n        </div>\n        <div class=\"input-group\">\n            <input id=\"edge-slant-width-max\" name=\"edge-slant-width-max\" type=\"range\" min=\"0\" max=\"150\" step=\"5\"/>\n            <label for=\"edge-slant-width-max\"><%= i18n.t(\"layoutOptions.edgeSlantWidthMax\")%></label>\n        </div>\n        <div id=\"auto-layout-options\">\n            <div class=\"input-group\">\n                <input id=\"grid-width\" name=\"grid-width\" type=\"range\" min=\"105\" max=\"300\" step=\"5\"/>\n                <label for=\"grid-width\"><%= i18n.t(\"layoutOptions.gridWidth\")%></label>\n            </div>\n            <div class=\"input-group\">\n                <input id=\"grid-height\" name=\"grid-height\" type=\"range\" min=\"55\" max=\"150\" step=\"5\"/>\n                <label for=\"grid-height\"><%= i18n.t(\"layoutOptions.gridHeight\")%></label>\n            </div>\n        </div>\n    </div>\n</div>\n";

},{}],145:[function(require,module,exports){
module.exports = "<div id=\"sd-multiple-criteria\">\n    <div class=\"header\">\n        <%= i18n.t(\"multipleCriteria.header\")%>\n        <span class=\"toggle-button\">\n            <i class=\"material-icons icon-arrow-up\">keyboard_arrow_up</i>\n            <i class=\"material-icons icon-arrow-down\">keyboard_arrow_down</i>\n        </span>\n    </div>\n    <div class=\"content\">\n        <div class=\"sd-multiple-criteria-properties\"></div>\n        <div class=\"sd-action-buttons\">\n            <button id=\"sd-show-league-table-button\" class=\"icon-button\"  title=\"<%= i18n.t('multipleCriteria.buttons.showLeagueTable')%>\"><i class=\"material-icons\">assignment</i></button>\n            <button id=\"sd-flip-criteria-button\" class=\"icon-button\"  title=\"<%= i18n.t('multipleCriteria.buttons.flip')%>\"><i class=\"material-icons\">swap_vert</i></button>\n        </div>\n    </div>\n</div>\n";

},{}],146:[function(require,module,exports){
module.exports = "<div id=\"object-properties\">\n    <div class=\"header\"></div>\n    <div class=\"content\">\n        <div class=\"main-properties\"></div>\n        <div class=\"children-properties\">\n            <div class=\"children-properties-header\"></div>\n            <div class=\"children-properties-content\"></div>\n        </div>\n    </div>\n</div>\n";

},{}],147:[function(require,module,exports){
module.exports = "<div id=\"sd-sidebar\">\n    <div id=\"sd-sidebar-inner\">\n        <%= include('layoutOptions', variables) %>\n        <%= include('diagramDetailsBox', variables) %>\n        <%= include('definitions', variables) %>\n        <%= include('multipleCriteria', variables) %>\n        <%= include('objectProperties', variables) %>\n    </div>\n</div>\n";

},{}],148:[function(require,module,exports){
module.exports = "<div id=\"sd-toolbar\">\n    <div class=\"toolbar-group\">\n        <button id=\"new-diagram-button\" class=\"icon-button\" title=\"<%= i18n.t('toolbar.newDiagram')%>\"><i class=\"material-icons\">insert_drive_file</i></button>\n        <button id=\"open-diagram-button\" class=\"icon-button\" title=\"<%= i18n.t('toolbar.openDiagram')%>\"><i class=\"material-icons\">folder_open</i></button>\n        <button id=\"save-diagram-button\" class=\"icon-button\" title=\"<%= i18n.t('toolbar.saveDiagram')%>\"><i class=\"material-icons\">save</i></button>\n    </div>\n    <div id=\"export-toolbar-group\" class=\"toolbar-group\">\n        <label><%= i18n.t(\"toolbar.export.label\")%></label>\n        <button id=\"saveButton\"><%= i18n.t(\"toolbar.export.png\")%></button>\n        <button id=\"saveButtonSvg\"><%= i18n.t(\"toolbar.export.svg\")%></button>\n        <button id=\"saveButtonPdf\"><%= i18n.t(\"toolbar.export.pdf\")%></button>\n    </div>\n    <div class=\"toolbar-group\">\n        <label><%= i18n.t(\"toolbar.layout.label\")%></label>\n        <button id=\"manualLayoutButton\"><%= i18n.t(\"toolbar.layout.manual\")%></button>\n        <button id=\"treeAutoLayoutButton\"><%= i18n.t(\"toolbar.layout.tree\")%></button>\n        <button id=\"clusterAutoLayoutButton\"><%= i18n.t(\"toolbar.layout.cluster\")%></button>\n    </div>\n    <div id=\"view-mode-toolbar-group\" class=\"toolbar-group\">\n        <label for=\"view-mode-select\"><%= i18n.t(\"toolbar.viewMode.label\")%></label>\n        <div class=\"input-group no-floating-label\" style=\"display: inline-block\">\n            <select id=\"view-mode-select\"></select>\n            <span class=\"bar\"></span>\n        </div>\n    </div>\n    <div id=\"objective-rule-toolbar-group\" class=\"toolbar-group\">\n        <label for=\"objective-rule-select\"><%= i18n.t(\"toolbar.objectiveRule.label\")%></label>\n        <div class=\"input-group no-floating-label\" style=\"display: inline-block\">\n            <select id=\"objective-rule-select\"></select>\n            <span class=\"bar\"></span>\n        </div>\n    </div>\n    <div class=\"toolbar-group\">\n        <button id=\"undoButton\" class=\"icon-button\" disabled=\"disabled\" title=\"<%= i18n.t('toolbar.undo')%>\"><i class=\"material-icons\">undo</i></button>\n        <button id=\"redoButton\" class=\"icon-button\" disabled=\"disabled\" title=\"<%= i18n.t('toolbar.redo')%>\"><i class=\"material-icons\">redo</i></button>\n    </div>\n    <div class=\"toolbar-group\">\n        <button id=\"sensitivity-analysis-button\" class=\"icon-button\" title=\"<%= i18n.t('toolbar.sensitivityAnalysis')%>\"><i class=\"material-icons\">assessment</i></button>\n        <button id=\"recompute-button\" class=\"icon-button\" title=\"<%= i18n.t('toolbar.recompute')%>\"><i class=\"material-icons\">refresh</i></button>\n        <button id=\"settings-button\" class=\"icon-button\" title=\"<%= i18n.t('toolbar.settings')%>\"><i class=\"material-icons\">settings</i></button>\n        <button id=\"about-button\" class=\"icon-button\" title=\"<%= i18n.t('toolbar.about')%>\"><i class=\"material-icons\">info_outline</i></button>\n    </div>\n</div>\n";

},{}],149:[function(require,module,exports){
module.exports = "<div class=\"sd-warning-message\">\n    <i class=\"material-icons sd-icon\">warning</i>\n    <div class=\"sd-warning-message-text\">\n       <%= message %>\n    </div>\n</div>\n";

},{}],150:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Toolbar = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _d = require('./d3');

var d3 = _interopRequireWildcard(_d);

var _i18n = require('./i18n/i18n');

var _appUtils = require('./app-utils');

var _exporter = require('./exporter');

var _fileLoader = require('./file-loader');

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Toolbar = exports.Toolbar = function () {
    function Toolbar(container, app) {
        _classCallCheck(this, Toolbar);

        this.hiddenClass = 'sd-hidden';

        this.app = app;
        this.container = container;
        this.initDiagramButtons();
        this.initExportToolbarGroup();
        this.initLayoutButtons();
        this.initUndoRedoButtons();
        this.initSettingsButton();
        this.initAboutButton();
        this.initSensitivityAnalysisButton();
        this.initRecomputeButton();
        this.initViewModeToolbarGroup();
        this.initObjectiveRuleToolbarGroup();
    }

    _createClass(Toolbar, [{
        key: 'initDiagramButtons',
        value: function initDiagramButtons() {
            var _this = this;

            this.newDiagramButton = this.container.select('#new-diagram-button').on('click', function () {
                if (!confirm(_i18n.i18n.t('confirm.newDiagram'))) {
                    return;
                }
                _this.app.newDiagram();
            });
            this.newDiagramButton.classed(this.hiddenClass, !this.app.config.buttons.new);
            this.openDiagramButton = this.container.select('#open-diagram-button').on('click', function () {
                if (!confirm(_i18n.i18n.t('confirm.openDiagram'))) {
                    return;
                }
                _fileLoader.FileLoader.openFile(function (model) {
                    _this.app.openDiagram(model);
                });
            });
            this.openDiagramButton.classed(this.hiddenClass, !this.app.config.buttons.open);
            this.saveDiagramButton = this.container.select('#save-diagram-button').on('click', function () {
                _this.app.saveToFile();
            });
            this.saveDiagramButton.classed(this.hiddenClass, !this.app.config.buttons.save);
        }
    }, {
        key: 'initLayoutButtons',
        value: function initLayoutButtons() {
            var self = this;
            self.app.treeDesigner.layout.onAutoLayoutChanged.push(function (layout) {
                return self.onLayoutChanged(layout);
            });
            this.layoutButtons = {};
            this.layoutButtons['manual'] = this.container.select('#manualLayoutButton').on('click', function () {
                if (self.app.treeDesigner.config.layout.type == 'manual') {
                    return;
                }
                self.app.treeDesigner.layout.disableAutoLayout();
            });
            this.layoutButtons['tree'] = this.container.select('#treeAutoLayoutButton').on('click', function () {
                if (self.app.treeDesigner.config.layout.type == 'tree') {
                    return;
                }
                self.app.treeDesigner.autoLayout('tree');
            });
            this.layoutButtons['cluster'] = this.container.select('#clusterAutoLayoutButton').on('click', function () {
                if (self.app.treeDesigner.config.layout.type == 'cluster') {
                    return;
                }
                self.app.treeDesigner.autoLayout('cluster');
            });

            this.updateLayoutButtons();
        }
    }, {
        key: 'updateLayoutButtons',
        value: function updateLayoutButtons() {
            this.onLayoutChanged(this.app.treeDesigner.config.layout.type);
        }
    }, {
        key: 'initSettingsButton',
        value: function initSettingsButton() {
            var _this2 = this;

            this.settingsButton = this.container.select('#settings-button').on('click', function () {
                _this2.app.settingsDialog.open();
            });
        }
    }, {
        key: 'initAboutButton',
        value: function initAboutButton() {
            var _this3 = this;

            this.aboutButton = this.container.select('#about-button').on('click', function () {
                _this3.app.aboutDialog.open();
            });
        }
    }, {
        key: 'initRecomputeButton',
        value: function initRecomputeButton() {
            var _this4 = this;

            this.recomputeButton = this.container.select('#recompute-button').on('click', function () {
                _this4.app.recompute();
            });
        }
    }, {
        key: 'initSensitivityAnalysisButton',
        value: function initSensitivityAnalysisButton() {
            var _this5 = this;

            this.sensitivityAnalysisButton = this.container.select('#sensitivity-analysis-button').on('click', function () {
                _this5.app.openSensitivityAnalysis();
            });
        }
    }, {
        key: 'updateSensitivityAnalysisButton',
        value: function updateSensitivityAnalysisButton() {
            this.sensitivityAnalysisButton.attr("disabled", this.app.isSensitivityAnalysisAvailable() ? null : 'disabled');
        }
    }, {
        key: 'onLayoutChanged',
        value: function onLayoutChanged(layout) {
            var _this6 = this;

            Object.getOwnPropertyNames(this.layoutButtons).forEach(function (l) {
                _this6.layoutButtons[l].classed('active', false);
            });
            var button = this.layoutButtons[layout];
            if (button) {
                button.classed('active', true);
            }
        }
    }, {
        key: 'initUndoRedoButtons',
        value: function initUndoRedoButtons() {
            var _this7 = this;

            var self = this;
            self.app.dataModel.undoRedoStateChangedCallback = function () {
                return _this7.onUndoRedoChanged();
            };
            this.undoButton = this.container.select('#undoButton').on('click', function () {
                self.app.undo();
            });
            this.redoButton = this.container.select('#redoButton').on('click', function () {
                self.app.redo();
            });
        }
    }, {
        key: 'onUndoRedoChanged',
        value: function onUndoRedoChanged() {
            this.updateUndoRedoButtons();
            this.updateSensitivityAnalysisButton();
        }
    }, {
        key: 'updateUndoRedoButtons',
        value: function updateUndoRedoButtons() {
            this.undoButton.attr("disabled", this.app.dataModel.isUndoAvailable() ? null : 'disabled');
            this.redoButton.attr("disabled", this.app.dataModel.isRedoAvailable() ? null : 'disabled');
        }
    }, {
        key: 'update',
        value: function update() {
            this.updateUndoRedoButtons();
            this.updateSensitivityAnalysisButton();
            this.updateLayoutButtons();
            this.updateViewModeValue();
            this.updateObjectiveRuleOptions();
            this.updateObjectiveRuleValue();
        }
    }, {
        key: 'initExportToolbarGroup',
        value: function initExportToolbarGroup() {
            this.container.select('#export-toolbar-group').classed(this.hiddenClass, !this.app.config.exports.show);
            if (!this.app.config.exports.show) {
                return;
            }
            this.initExportToPngButton();
            this.initExportSvgButton();
            this.initExportPdfButton();
        }
    }, {
        key: 'initExportToPngButton',
        value: function initExportToPngButton() {
            var _this8 = this;

            var svg = this.app.treeDesigner.svg;
            this.container.select('#saveButton').on('click', function () {
                return _exporter.Exporter.saveAsPng(svg, _this8.app.config.exports);
            }).classed(this.hiddenClass, !this.app.config.buttons.exportToPng);
        }
    }, {
        key: 'initExportSvgButton',
        value: function initExportSvgButton() {
            var svg = this.app.treeDesigner.svg;
            this.container.select('#saveButtonSvg').on('click', function () {
                return _exporter.Exporter.saveAsSvg(svg);
            }).classed(this.hiddenClass, !this.app.config.buttons.exportToSvg);
        }
    }, {
        key: 'initExportPdfButton',
        value: function initExportPdfButton() {
            var _this9 = this;

            var svg = this.app.treeDesigner.svg;
            this.container.select('#saveButtonPdf').on('click', function () {
                return _exporter.Exporter.saveAsPdf(svg, _this9.app.config.exports);
            }).classed(this.hiddenClass, !this.app.config.buttons.exportToPdf);
        }
    }, {
        key: 'initObjectiveRuleToolbarGroup',
        value: function initObjectiveRuleToolbarGroup() {
            var self = this;
            this.objectiveRuleSelect = this.container.select('#objective-rule-select');

            this.updateObjectiveRuleOptions();
            this.updateObjectiveRuleValue();

            this.objectiveRuleSelect.on('change', function () {
                self.app.setObjectiveRule(this.value);
            });
        }
    }, {
        key: 'updateObjectiveRuleOptions',
        value: function updateObjectiveRuleOptions() {
            var rules = this.app.getObjectiveRules();
            var options = this.objectiveRuleSelect.selectAll('option').data(rules);
            options.exit().remove();
            options.enter().append('option').merge(options).attr('value', function (d) {
                return d.name;
            }).text(function (d) {
                return _i18n.i18n.t('toolbar.objectiveRule.options.' + d.name);
            });
        }
    }, {
        key: 'updateObjectiveRuleValue',
        value: function updateObjectiveRuleValue() {
            this.objectiveRuleSelect.node().value = this.app.getCurrentObjectiveRule().name;
        }
    }, {
        key: 'initViewModeToolbarGroup',
        value: function initViewModeToolbarGroup() {
            var self = this;
            this.viewModeSelect = this.container.select('#view-mode-select');
            var rules = this.app.getViewModes();
            var options = this.viewModeSelect.selectAll('option').data(rules);
            options.enter().append('option').merge(options).attr('value', function (d) {
                return d.name;
            }).text(function (d) {
                return _i18n.i18n.t('toolbar.viewMode.options.' + d.name);
            });

            this.updateViewModeValue();

            this.viewModeSelect.on('change', function () {
                self.app.setViewModeByName(this.value);
            });
        }
    }, {
        key: 'updateViewModeValue',
        value: function updateViewModeValue() {
            this.viewModeSelect.node().value = this.app.getCurrentViewMode().name;
        }
    }]);

    return Toolbar;
}();

},{"./app-utils":89,"./d3":92,"./exporter":98,"./file-loader":99,"./i18n/i18n":105}],151:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NumberInputValidator = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _sdUtils = require("sd-utils");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var NumberInputValidator = exports.NumberInputValidator = function () {
    function NumberInputValidator(min, max) {
        _classCallCheck(this, NumberInputValidator);

        this.min = min;
        this.max = max;
    }

    _createClass(NumberInputValidator, [{
        key: "validate",
        value: function validate(value) {
            if (value === null || value === undefined) {
                return false;
            }
            value += "";
            if (!value.trim()) {
                return false;
            }

            value = parseFloat(value);

            if (!_sdUtils.Utils.isNumber(value)) {
                return false;
            }

            if (this.min !== undefined && value < this.min) {
                return false;
            }

            return !(this.max !== undefined && value > this.max);
        }
    }]);

    return NumberInputValidator;
}();

},{"sd-utils":"sd-utils"}],152:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PayoffInputValidator = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _sdUtils = require("sd-utils");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var PayoffInputValidator = exports.PayoffInputValidator = function () {
    function PayoffInputValidator(expressionEngine) {
        _classCallCheck(this, PayoffInputValidator);

        this.expressionEngine = expressionEngine;
    }

    _createClass(PayoffInputValidator, [{
        key: "validate",
        value: function validate(value, edge) {
            if (value === null || value === undefined) {
                return false;
            }
            value += "";
            if (!value.trim()) {
                return false;
            }
            if (this.expressionEngine.constructor.hasAssignmentExpression(value)) {
                return false;
            }
            return this.expressionEngine.validate(value);
        }
    }]);

    return PayoffInputValidator;
}();

},{"sd-utils":"sd-utils"}],153:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ProbabilityInputValidator = exports.ProbabilityInputValidator = function () {
    function ProbabilityInputValidator(expressionEngine) {
        _classCallCheck(this, ProbabilityInputValidator);

        this.expressionEngine = expressionEngine;
    }

    _createClass(ProbabilityInputValidator, [{
        key: "validate",
        value: function validate(value, edge) {
            if (value === null || value === undefined) {
                return false;
            }

            value += "";
            if (!value.trim()) {
                return false;
            }

            if (this.expressionEngine.constructor.isHash(value)) {
                return true;
            }

            if (this.expressionEngine.constructor.hasAssignmentExpression(value)) {
                return false;
            }
            var scope = edge.parentNode.expressionScope;
            return this.expressionEngine.validate(value, scope);
        }
    }]);

    return ProbabilityInputValidator;
}();

},{}],154:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RequiredInputValidator = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _sdUtils = require("sd-utils");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var RequiredInputValidator = exports.RequiredInputValidator = function () {
    function RequiredInputValidator() {
        _classCallCheck(this, RequiredInputValidator);
    }

    _createClass(RequiredInputValidator, [{
        key: "validate",
        value: function validate(value) {
            if (value === null || value === undefined) {
                return false;
            }
            value += "";
            return !!value.trim();
        }
    }]);

    return RequiredInputValidator;
}();

},{"sd-utils":"sd-utils"}],155:[function(require,module,exports){
"use strict";

module.exports = { "buildTimestamp": 1513795398159 };

},{}]},{},[108])(108)
});