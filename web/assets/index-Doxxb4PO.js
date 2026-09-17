(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload"))
    return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]'))
    processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList")
        continue;
      for (const node of mutation.addedNodes)
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production = {};
var hasRequiredReactJsxRuntime_production;
function requireReactJsxRuntime_production() {
  if (hasRequiredReactJsxRuntime_production)
    return reactJsxRuntime_production;
  hasRequiredReactJsxRuntime_production = 1;
  var REACT_ELEMENT_TYPE =  Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE =  Symbol.for("react.fragment");
  function jsxProd(type, config, maybeKey) {
    var key = null;
    void 0 !== maybeKey && (key = "" + maybeKey);
    void 0 !== config.key && (key = "" + config.key);
    if ("key" in config) {
      maybeKey = {};
      for (var propName in config)
        "key" !== propName && (maybeKey[propName] = config[propName]);
    } else
      maybeKey = config;
    config = maybeKey.ref;
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref: void 0 !== config ? config : null,
      props: maybeKey
    };
  }
  reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
  reactJsxRuntime_production.jsx = jsxProd;
  reactJsxRuntime_production.jsxs = jsxProd;
  return reactJsxRuntime_production;
}
var hasRequiredJsxRuntime;
function requireJsxRuntime() {
  if (hasRequiredJsxRuntime)
    return jsxRuntime.exports;
  hasRequiredJsxRuntime = 1;
  {
    jsxRuntime.exports = requireReactJsxRuntime_production();
  }
  return jsxRuntime.exports;
}
var jsxRuntimeExports = requireJsxRuntime();
var react = { exports: {} };
var react_production = {};
var hasRequiredReact_production;
function requireReact_production() {
  if (hasRequiredReact_production)
    return react_production;
  hasRequiredReact_production = 1;
  var REACT_ELEMENT_TYPE =  Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE =  Symbol.for("react.portal"), REACT_FRAGMENT_TYPE =  Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE =  Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE =  Symbol.for("react.profiler"), REACT_CONSUMER_TYPE =  Symbol.for("react.consumer"), REACT_CONTEXT_TYPE =  Symbol.for("react.context"), REACT_FORWARD_REF_TYPE =  Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE =  Symbol.for("react.suspense"), REACT_MEMO_TYPE =  Symbol.for("react.memo"), REACT_LAZY_TYPE =  Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE =  Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE =  Symbol.for("react.view_transition"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable)
      return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var ReactNoopUpdateQueue = {
    isMounted: function() {
      return false;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, assign = Object.assign, emptyObject = {};
  function Component(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }
  Component.prototype.isReactComponent = {};
  Component.prototype.setState = function(partialState, callback) {
    if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
      throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, partialState, callback, "setState");
  };
  Component.prototype.forceUpdate = function(callback) {
    this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
  };
  function ComponentDummy() {
  }
  ComponentDummy.prototype = Component.prototype;
  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }
  var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent;
  assign(pureComponentPrototype, Component.prototype);
  pureComponentPrototype.isPureReactComponent = true;
  var isArrayImpl = Array.isArray;
  function noop() {
  }
  var ReactSharedInternals = { H: null, A: null, T: null, S: null }, hasOwnProperty = Object.prototype.hasOwnProperty;
  function ReactElement(type, key, props) {
    var refProp = props.ref;
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref: void 0 !== refProp ? refProp : null,
      props
    };
  }
  function cloneAndReplaceKey(oldElement, newKey) {
    return ReactElement(oldElement.type, newKey, oldElement.props);
  }
  function isValidElement(object) {
    return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
  }
  function escape(key) {
    var escaperLookup = { "=": "=0", ":": "=2" };
    return "$" + key.replace(/[=:]/g, function(match) {
      return escaperLookup[match];
    });
  }
  var userProvidedKeyEscapeRegex = /\/+/g;
  function getElementKey(element, index) {
    return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
  }
  function resolveThenable(thenable) {
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenable.reason;
      default:
        switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
          "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
        }, function(error) {
          "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
        })), thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
    }
    throw thenable;
  }
  function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
    var type = typeof children;
    if ("undefined" === type || "boolean" === type)
      children = null;
    var invokeCallback = false;
    if (null === children)
      invokeCallback = true;
    else
      switch (type) {
        case "bigint":
        case "string":
        case "number":
          invokeCallback = true;
          break;
        case "object":
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
              break;
            case REACT_LAZY_TYPE:
              return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
          }
      }
    if (invokeCallback)
      return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
        return c;
      })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + invokeCallback)), array.push(callback)), 1;
    invokeCallback = 0;
    var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
    if (isArrayImpl(children))
      for (var i = 0; i < children.length; i++)
        nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
    else if (i = getIteratorFn(children), "function" === typeof i)
      for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
        nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
    else if ("object" === type) {
      if ("function" === typeof children.then)
        return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
      array = String(children);
      throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
    }
    return invokeCallback;
  }
  function mapChildren(children, func, context) {
    if (null == children)
      return children;
    var result = [], count = 0;
    mapIntoArray(children, result, "", "", function(child) {
      return func.call(context, child, count++);
    });
    return result;
  }
  function lazyInitializer(payload) {
    if (-1 === payload._status) {
      var ctor = payload._result, thenable = ctor();
      thenable.then(function(moduleObject) {
        if (0 === payload._status || -1 === payload._status)
          payload._status = 1, payload._result = moduleObject, void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
      }, function(error) {
        if (0 === payload._status || -1 === payload._status)
          payload._status = 2, payload._result = error, void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
      });
      -1 === payload._status && (payload._status = 0, payload._result = thenable);
    }
    if (1 === payload._status)
      return payload._result.default;
    throw payload._result;
  }
  var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
    if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
      var event = new window.ErrorEvent("error", {
        bubbles: true,
        cancelable: true,
        message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
        error
      });
      if (!window.dispatchEvent(event))
        return;
    } else if ("object" === typeof process && "function" === typeof process.emit) {
      process.emit("uncaughtException", error);
      return;
    }
    console.error(error);
  };
  function startTransition(scope) {
    var prevTransition = ReactSharedInternals.T, currentTransition = {};
    currentTransition.types = null !== prevTransition ? prevTransition.types : null;
    ReactSharedInternals.T = currentTransition;
    try {
      var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
      null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
      "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
    } catch (error) {
      reportGlobalError(error);
    } finally {
      null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
    }
  }
  function addTransitionType(type) {
    var transition = ReactSharedInternals.T;
    if (null !== transition) {
      var transitionTypes = transition.types;
      null === transitionTypes ? transition.types = [type] : -1 === transitionTypes.indexOf(type) && transitionTypes.push(type);
    } else
      startTransition(addTransitionType.bind(null, type));
  }
  var Children = {
    map: mapChildren,
    forEach: function(children, forEachFunc, forEachContext) {
      mapChildren(children, function() {
        forEachFunc.apply(this, arguments);
      }, forEachContext);
    },
    count: function(children) {
      var n = 0;
      mapChildren(children, function() {
        n++;
      });
      return n;
    },
    toArray: function(children) {
      return mapChildren(children, function(child) {
        return child;
      }) || [];
    },
    only: function(children) {
      if (!isValidElement(children))
        throw Error("React.Children.only expected to receive a single React element child.");
      return children;
    }
  };
  react_production.Activity = REACT_ACTIVITY_TYPE;
  react_production.Children = Children;
  react_production.Component = Component;
  react_production.Fragment = REACT_FRAGMENT_TYPE;
  react_production.Profiler = REACT_PROFILER_TYPE;
  react_production.PureComponent = PureComponent;
  react_production.StrictMode = REACT_STRICT_MODE_TYPE;
  react_production.Suspense = REACT_SUSPENSE_TYPE;
  react_production.ViewTransition = REACT_VIEW_TRANSITION_TYPE;
  react_production.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
  react_production.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(size) {
      return ReactSharedInternals.H.useMemoCache(size);
    }
  };
  react_production.addTransitionType = addTransitionType;
  react_production.cache = function(fn) {
    return function() {
      return fn.apply(null, arguments);
    };
  };
  react_production.cacheSignal = function() {
    return null;
  };
  react_production.cloneElement = function(element, config, children) {
    if (null === element || void 0 === element)
      throw Error("The argument must be a React element, but you passed " + element + ".");
    var props = assign({}, element.props), key = element.key;
    if (null != config)
      for (propName in void 0 !== config.key && (key = "" + config.key), config)
        !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
    var propName = arguments.length - 2;
    if (1 === propName)
      props.children = children;
    else if (1 < propName) {
      for (var childArray = Array(propName), i = 0; i < propName; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    return ReactElement(element.type, key, props);
  };
  react_production.createContext = function(defaultValue) {
    defaultValue = {
      $$typeof: REACT_CONTEXT_TYPE,
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    };
    defaultValue.Provider = defaultValue;
    defaultValue.Consumer = {
      $$typeof: REACT_CONSUMER_TYPE,
      _context: defaultValue
    };
    return defaultValue;
  };
  react_production.createElement = function(type, config, children) {
    var propName, props = {}, key = null;
    if (null != config)
      for (propName in void 0 !== config.key && (key = "" + config.key), config)
        hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
    var childrenLength = arguments.length - 2;
    if (1 === childrenLength)
      props.children = children;
    else if (1 < childrenLength) {
      for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    if (type && type.defaultProps)
      for (propName in childrenLength = type.defaultProps, childrenLength)
        void 0 === props[propName] && (props[propName] = childrenLength[propName]);
    return ReactElement(type, key, props);
  };
  react_production.createRef = function() {
    return { current: null };
  };
  react_production.forwardRef = function(render) {
    return { $$typeof: REACT_FORWARD_REF_TYPE, render };
  };
  react_production.isValidElement = isValidElement;
  react_production.lazy = function(ctor) {
    return {
      $$typeof: REACT_LAZY_TYPE,
      _payload: { _status: -1, _result: ctor },
      _init: lazyInitializer
    };
  };
  react_production.memo = function(type, compare) {
    return {
      $$typeof: REACT_MEMO_TYPE,
      type,
      compare: void 0 === compare ? null : compare
    };
  };
  react_production.startTransition = startTransition;
  react_production.unstable_useCacheRefresh = function() {
    return ReactSharedInternals.H.useCacheRefresh();
  };
  react_production.use = function(usable) {
    return ReactSharedInternals.H.use(usable);
  };
  react_production.useActionState = function(action, initialState, permalink) {
    return ReactSharedInternals.H.useActionState(action, initialState, permalink);
  };
  react_production.useCallback = function(callback, deps) {
    return ReactSharedInternals.H.useCallback(callback, deps);
  };
  react_production.useContext = function(Context) {
    return ReactSharedInternals.H.useContext(Context);
  };
  react_production.useDebugValue = function() {
  };
  react_production.useDeferredValue = function(value, initialValue) {
    return ReactSharedInternals.H.useDeferredValue(value, initialValue);
  };
  react_production.useEffect = function(create, deps) {
    return ReactSharedInternals.H.useEffect(create, deps);
  };
  react_production.useEffectEvent = function(callback) {
    return ReactSharedInternals.H.useEffectEvent(callback);
  };
  react_production.useId = function() {
    return ReactSharedInternals.H.useId();
  };
  react_production.useImperativeHandle = function(ref, create, deps) {
    return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
  };
  react_production.useInsertionEffect = function(create, deps) {
    return ReactSharedInternals.H.useInsertionEffect(create, deps);
  };
  react_production.useLayoutEffect = function(create, deps) {
    return ReactSharedInternals.H.useLayoutEffect(create, deps);
  };
  react_production.useMemo = function(create, deps) {
    return ReactSharedInternals.H.useMemo(create, deps);
  };
  react_production.useOptimistic = function(passthrough, reducer) {
    return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
  };
  react_production.useReducer = function(reducer, initialArg, init) {
    return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
  };
  react_production.useRef = function(initialValue) {
    return ReactSharedInternals.H.useRef(initialValue);
  };
  react_production.useState = function(initialState) {
    return ReactSharedInternals.H.useState(initialState);
  };
  react_production.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
    return ReactSharedInternals.H.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  };
  react_production.useTransition = function() {
    return ReactSharedInternals.H.useTransition();
  };
  react_production.version = "19.3.0";
  return react_production;
}
var hasRequiredReact;
function requireReact() {
  if (hasRequiredReact)
    return react.exports;
  hasRequiredReact = 1;
  {
    react.exports = requireReact_production();
  }
  return react.exports;
}
var reactExports = requireReact();
const React = getDefaultExportFromCjs(reactExports);
var client = { exports: {} };
var reactDomClient_production = {};
var scheduler = { exports: {} };
var scheduler_production = {};
var hasRequiredScheduler_production;
function requireScheduler_production() {
  if (hasRequiredScheduler_production)
    return scheduler_production;
  hasRequiredScheduler_production = 1;
  (function(exports) {
    function push(heap, node) {
      var index = heap.length;
      heap.push(node);
      a: for (; 0 < index; ) {
        var parentIndex = index - 1 >>> 1, parent = heap[parentIndex];
        if (0 < compare(parent, node))
          heap[parentIndex] = node, heap[index] = parent, index = parentIndex;
        else
          break a;
      }
    }
    function peek(heap) {
      return 0 === heap.length ? null : heap[0];
    }
    function pop(heap) {
      if (0 === heap.length)
        return null;
      var first = heap[0], last = heap.pop();
      if (last !== first) {
        heap[0] = last;
        a: for (var index = 0, length = heap.length, halfLength = length >>> 1; index < halfLength; ) {
          var leftIndex = 2 * (index + 1) - 1, left = heap[leftIndex], rightIndex = leftIndex + 1, right = heap[rightIndex];
          if (0 > compare(left, last))
            rightIndex < length && 0 > compare(right, left) ? (heap[index] = right, heap[rightIndex] = last, index = rightIndex) : (heap[index] = left, heap[leftIndex] = last, index = leftIndex);
          else if (rightIndex < length && 0 > compare(right, last))
            heap[index] = right, heap[rightIndex] = last, index = rightIndex;
          else
            break a;
        }
      }
      return first;
    }
    function compare(a2, b) {
      var diff = a2.sortIndex - b.sortIndex;
      return 0 !== diff ? diff : a2.id - b.id;
    }
    exports.unstable_now = void 0;
    if ("object" === typeof performance && "function" === typeof performance.now) {
      var localPerformance = performance;
      exports.unstable_now = function() {
        return localPerformance.now();
      };
    } else {
      var localDate = Date, initialTime = localDate.now();
      exports.unstable_now = function() {
        return localDate.now() - initialTime;
      };
    }
    var taskQueue = [], timerQueue = [], taskIdCounter = 1, currentTask = null, currentPriorityLevel = 3, isPerformingWork = false, isHostCallbackScheduled = false, isHostTimeoutScheduled = false, needsPaint = false, localSetTimeout = "function" === typeof setTimeout ? setTimeout : null, localClearTimeout = "function" === typeof clearTimeout ? clearTimeout : null, localSetImmediate = "undefined" !== typeof setImmediate ? setImmediate : null;
    function advanceTimers(currentTime) {
      for (var timer = peek(timerQueue); null !== timer; ) {
        if (null === timer.callback)
          pop(timerQueue);
        else if (timer.startTime <= currentTime)
          pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer);
        else
          break;
        timer = peek(timerQueue);
      }
    }
    function handleTimeout(currentTime) {
      isHostTimeoutScheduled = false;
      advanceTimers(currentTime);
      if (!isHostCallbackScheduled)
        if (null !== peek(taskQueue))
          isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline());
        else {
          var firstTimer = peek(timerQueue);
          null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
        }
    }
    var isMessageLoopRunning = false, taskTimeoutID = -1, frameInterval = 5, startTime = -1;
    function shouldYieldToHost() {
      return needsPaint ? true : exports.unstable_now() - startTime < frameInterval ? false : true;
    }
    function performWorkUntilDeadline() {
      needsPaint = false;
      if (isMessageLoopRunning) {
        var currentTime = exports.unstable_now();
        startTime = currentTime;
        var hasMoreWork = true;
        try {
          a: {
            isHostCallbackScheduled = false;
            isHostTimeoutScheduled && (isHostTimeoutScheduled = false, localClearTimeout(taskTimeoutID), taskTimeoutID = -1);
            isPerformingWork = true;
            var previousPriorityLevel = currentPriorityLevel;
            try {
              b: {
                advanceTimers(currentTime);
                for (currentTask = peek(taskQueue); null !== currentTask && !(currentTask.expirationTime > currentTime && shouldYieldToHost()); ) {
                  var callback = currentTask.callback;
                  if ("function" === typeof callback) {
                    currentTask.callback = null;
                    currentPriorityLevel = currentTask.priorityLevel;
                    var continuationCallback = callback(currentTask.expirationTime <= currentTime);
                    currentTime = exports.unstable_now();
                    if ("function" === typeof continuationCallback) {
                      currentTask.callback = continuationCallback;
                      advanceTimers(currentTime);
                      hasMoreWork = true;
                      break b;
                    }
                    currentTask === peek(taskQueue) && pop(taskQueue);
                    advanceTimers(currentTime);
                  } else
                    pop(taskQueue);
                  currentTask = peek(taskQueue);
                }
                if (null !== currentTask)
                  hasMoreWork = true;
                else {
                  var firstTimer = peek(timerQueue);
                  null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
                  hasMoreWork = false;
                }
              }
              break a;
            } finally {
              currentTask = null, currentPriorityLevel = previousPriorityLevel, isPerformingWork = false;
            }
            hasMoreWork = void 0;
          }
        } finally {
          hasMoreWork ? schedulePerformWorkUntilDeadline() : isMessageLoopRunning = false;
        }
      }
    }
    var schedulePerformWorkUntilDeadline;
    if ("function" === typeof localSetImmediate)
      schedulePerformWorkUntilDeadline = function() {
        localSetImmediate(performWorkUntilDeadline);
      };
    else if ("undefined" !== typeof MessageChannel) {
      var channel = new MessageChannel(), port = channel.port2;
      channel.port1.onmessage = performWorkUntilDeadline;
      schedulePerformWorkUntilDeadline = function() {
        port.postMessage(null);
      };
    } else
      schedulePerformWorkUntilDeadline = function() {
        localSetTimeout(performWorkUntilDeadline, 0);
      };
    function requestHostTimeout(callback, ms) {
      taskTimeoutID = localSetTimeout(function() {
        callback(exports.unstable_now());
      }, ms);
    }
    exports.unstable_IdlePriority = 5;
    exports.unstable_ImmediatePriority = 1;
    exports.unstable_LowPriority = 4;
    exports.unstable_NormalPriority = 3;
    exports.unstable_Profiling = null;
    exports.unstable_UserBlockingPriority = 2;
    exports.unstable_cancelCallback = function(task) {
      task.callback = null;
    };
    exports.unstable_forceFrameRate = function(fps) {
      0 > fps || 125 < fps ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : frameInterval = 0 < fps ? Math.floor(1e3 / fps) : 5;
    };
    exports.unstable_getCurrentPriorityLevel = function() {
      return currentPriorityLevel;
    };
    exports.unstable_next = function(eventHandler) {
      switch (currentPriorityLevel) {
        case 1:
        case 2:
        case 3:
          var priorityLevel = 3;
          break;
        default:
          priorityLevel = currentPriorityLevel;
      }
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = priorityLevel;
      try {
        return eventHandler();
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    };
    exports.unstable_requestPaint = function() {
      needsPaint = true;
    };
    exports.unstable_runWithPriority = function(priorityLevel, eventHandler) {
      switch (priorityLevel) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          priorityLevel = 3;
      }
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = priorityLevel;
      try {
        return eventHandler();
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    };
    exports.unstable_scheduleCallback = function(priorityLevel, callback, options) {
      var currentTime = exports.unstable_now();
      "object" === typeof options && null !== options ? (options = options.delay, options = "number" === typeof options && 0 < options ? currentTime + options : currentTime) : options = currentTime;
      switch (priorityLevel) {
        case 1:
          var timeout = -1;
          break;
        case 2:
          timeout = 250;
          break;
        case 5:
          timeout = 1073741823;
          break;
        case 4:
          timeout = 1e4;
          break;
        default:
          timeout = 5e3;
      }
      timeout = options + timeout;
      priorityLevel = {
        id: taskIdCounter++,
        callback,
        priorityLevel,
        startTime: options,
        expirationTime: timeout,
        sortIndex: -1
      };
      options > currentTime ? (priorityLevel.sortIndex = options, push(timerQueue, priorityLevel), null === peek(taskQueue) && priorityLevel === peek(timerQueue) && (isHostTimeoutScheduled ? (localClearTimeout(taskTimeoutID), taskTimeoutID = -1) : isHostTimeoutScheduled = true, requestHostTimeout(handleTimeout, options - currentTime))) : (priorityLevel.sortIndex = timeout, push(taskQueue, priorityLevel), isHostCallbackScheduled || isPerformingWork || (isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline())));
      return priorityLevel;
    };
    exports.unstable_shouldYield = shouldYieldToHost;
    exports.unstable_wrapCallback = function(callback) {
      var parentPriorityLevel = currentPriorityLevel;
      return function() {
        var previousPriorityLevel = currentPriorityLevel;
        currentPriorityLevel = parentPriorityLevel;
        try {
          return callback.apply(this, arguments);
        } finally {
          currentPriorityLevel = previousPriorityLevel;
        }
      };
    };
  })(scheduler_production);
  return scheduler_production;
}
var hasRequiredScheduler;
function requireScheduler() {
  if (hasRequiredScheduler)
    return scheduler.exports;
  hasRequiredScheduler = 1;
  {
    scheduler.exports = requireScheduler_production();
  }
  return scheduler.exports;
}
var reactDom = { exports: {} };
var reactDom_production = {};
var hasRequiredReactDom_production;
function requireReactDom_production() {
  if (hasRequiredReactDom_production)
    return reactDom_production;
  hasRequiredReactDom_production = 1;
  var React2 = requireReact();
  function formatProdErrorMessage(code) {
    var url = "https://react.dev/errors/" + code;
    if (1 < arguments.length) {
      url += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var i = 2; i < arguments.length; i++)
        url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function noop() {
  }
  var Internals = {
    d: {
      f: noop,
      r: function() {
        throw Error(formatProdErrorMessage(522));
      },
      D: noop,
      C: noop,
      L: noop,
      m: noop,
      X: noop,
      S: noop,
      M: noop
    },
    p: 0,
    findDOMNode: null
  }, REACT_PORTAL_TYPE =  Symbol.for("react.portal"), REACT_RECOVERABLE_TYPE =  Symbol.for("react.recoverable"), REACT_OPTIMISTIC_KEY =  Symbol.for("react.optimistic_key");
  function createPortal$1(children, containerInfo, implementation) {
    var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
    return {
      $$typeof: REACT_PORTAL_TYPE,
      key: null == key ? null : key === REACT_OPTIMISTIC_KEY ? REACT_OPTIMISTIC_KEY : "" + key,
      children,
      containerInfo,
      implementation
    };
  }
  var ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function getCrossOriginStringAs(as, input) {
    if ("font" === as)
      return "";
    if ("string" === typeof input)
      return "use-credentials" === input ? input : "";
  }
  reactDom_production.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
  reactDom_production.browser = function(reason) {
    return { $$typeof: REACT_RECOVERABLE_TYPE, _reason: reason };
  };
  reactDom_production.createPortal = function(children, container) {
    var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
    if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
      throw Error(formatProdErrorMessage(299));
    return createPortal$1(children, container, null, key);
  };
  reactDom_production.flushSync = function(fn) {
    var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
    try {
      if (ReactSharedInternals.T = null, Internals.p = 2, fn)
        return fn();
    } finally {
      ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
    }
  };
  reactDom_production.preconnect = function(href, options) {
    "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
  };
  reactDom_production.prefetchDNS = function(href) {
    "string" === typeof href && Internals.d.D(href);
  };
  reactDom_production.preinit = function(href, options) {
    if ("string" === typeof href && options && "string" === typeof options.as) {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
      "style" === as ? Internals.d.S(href, "string" === typeof options.precedence ? options.precedence : void 0, {
        crossOrigin,
        integrity,
        fetchPriority
      }) : "script" === as && Internals.d.X(href, {
        crossOrigin,
        integrity,
        fetchPriority,
        nonce: "string" === typeof options.nonce ? options.nonce : void 0
      });
    }
  };
  reactDom_production.preinitModule = function(href, options) {
    if ("string" === typeof href)
      if ("object" === typeof options && null !== options) {
        if (null == options.as || "script" === options.as) {
          var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
          Internals.d.M(href, {
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0,
            fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0
          });
        }
      } else
        null == options && Internals.d.M(href);
  };
  reactDom_production.preload = function(href, options) {
    if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
      Internals.d.L(href, as, {
        crossOrigin,
        integrity: "string" === typeof options.integrity ? options.integrity : void 0,
        nonce: "string" === typeof options.nonce ? options.nonce : void 0,
        type: "string" === typeof options.type ? options.type : void 0,
        fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
        referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
        imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
        imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
        media: "string" === typeof options.media ? options.media : void 0
      });
    }
  };
  reactDom_production.preloadModule = function(href, options) {
    if ("string" === typeof href)
      if (options) {
        var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
        Internals.d.m(href, {
          as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0,
          fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0
        });
      } else
        Internals.d.m(href);
  };
  reactDom_production.requestFormReset = function(form) {
    Internals.d.r(form);
  };
  reactDom_production.unstable_batchedUpdates = function(fn, a2) {
    return fn(a2);
  };
  reactDom_production.useFormState = function(action, initialState, permalink) {
    return ReactSharedInternals.H.useFormState(action, initialState, permalink);
  };
  reactDom_production.useFormStatus = function() {
    return ReactSharedInternals.H.useHostTransitionStatus();
  };
  reactDom_production.version = "19.3.0";
  return reactDom_production;
}
var hasRequiredReactDom;
function requireReactDom() {
  if (hasRequiredReactDom)
    return reactDom.exports;
  hasRequiredReactDom = 1;
  function checkDCE() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
      return;
    }
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
      console.error(err);
    }
  }
  {
    checkDCE();
    reactDom.exports = requireReactDom_production();
  }
  return reactDom.exports;
}
var hasRequiredReactDomClient_production;
function requireReactDomClient_production() {
  if (hasRequiredReactDomClient_production)
    return reactDomClient_production;
  hasRequiredReactDomClient_production = 1;
  var Scheduler = requireScheduler(), React2 = requireReact(), ReactDOM2 = requireReactDom();
  function formatProdErrorMessage(code) {
    var url = "https://react.dev/errors/" + code;
    if (1 < arguments.length) {
      url += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var i = 2; i < arguments.length; i++)
        url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function isValidContainer(node) {
    return !(!node || 1 !== node.nodeType && 9 !== node.nodeType && 11 !== node.nodeType);
  }
  function getNearestMountedFiber(fiber) {
    for (var node = fiber, nextNode = node; nextNode && !nextNode.alternate; )
      node = nextNode, 0 !== (node.flags & 4098) && (fiber = node.return), nextNode = node.return;
    for (; node.return; )
      node = node.return;
    return 3 === node.tag ? fiber : null;
  }
  function getSuspenseInstanceFromFiber(fiber) {
    if (13 === fiber.tag) {
      var suspenseState = fiber.memoizedState;
      null === suspenseState && (fiber = fiber.alternate, null !== fiber && (suspenseState = fiber.memoizedState));
      if (null !== suspenseState)
        return suspenseState.dehydrated;
    }
    return null;
  }
  function getActivityInstanceFromFiber(fiber) {
    if (31 === fiber.tag) {
      var activityState = fiber.memoizedState;
      null === activityState && (fiber = fiber.alternate, null !== fiber && (activityState = fiber.memoizedState));
      if (null !== activityState)
        return activityState.dehydrated;
    }
    return null;
  }
  function assertIsMounted(fiber) {
    if (getNearestMountedFiber(fiber) !== fiber)
      throw Error(formatProdErrorMessage(188));
  }
  function findCurrentFiberUsingSlowPath(fiber) {
    var alternate = fiber.alternate;
    if (!alternate) {
      alternate = getNearestMountedFiber(fiber);
      if (null === alternate)
        throw Error(formatProdErrorMessage(188));
      return alternate !== fiber ? null : fiber;
    }
    for (var a2 = fiber, b = alternate; ; ) {
      var parentA = a2.return;
      if (null === parentA)
        break;
      var parentB = parentA.alternate;
      if (null === parentB) {
        b = parentA.return;
        if (null !== b) {
          a2 = b;
          continue;
        }
        break;
      }
      if (parentA.child === parentB.child) {
        for (parentB = parentA.child; parentB; ) {
          if (parentB === a2)
            return assertIsMounted(parentA), fiber;
          if (parentB === b)
            return assertIsMounted(parentA), alternate;
          parentB = parentB.sibling;
        }
        throw Error(formatProdErrorMessage(188));
      }
      if (a2.return !== b.return)
        a2 = parentA, b = parentB;
      else {
        for (var didFindChild = false, child$0 = parentA.child; child$0; ) {
          if (child$0 === a2) {
            didFindChild = true;
            a2 = parentA;
            b = parentB;
            break;
          }
          if (child$0 === b) {
            didFindChild = true;
            b = parentA;
            a2 = parentB;
            break;
          }
          child$0 = child$0.sibling;
        }
        if (!didFindChild) {
          for (child$0 = parentB.child; child$0; ) {
            if (child$0 === a2) {
              didFindChild = true;
              a2 = parentB;
              b = parentA;
              break;
            }
            if (child$0 === b) {
              didFindChild = true;
              b = parentB;
              a2 = parentA;
              break;
            }
            child$0 = child$0.sibling;
          }
          if (!didFindChild)
            throw Error(formatProdErrorMessage(189));
        }
      }
      if (a2.alternate !== b)
        throw Error(formatProdErrorMessage(190));
    }
    if (3 !== a2.tag)
      throw Error(formatProdErrorMessage(188));
    return a2.stateNode.current === a2 ? fiber : alternate;
  }
  function findCurrentHostFiberImpl(node) {
    var tag = node.tag;
    if (5 === tag || 26 === tag || 27 === tag || 6 === tag)
      return node;
    for (node = node.child; null !== node; ) {
      tag = findCurrentHostFiberImpl(node);
      if (null !== tag)
        return tag;
      node = node.sibling;
    }
    return null;
  }
  function traverseVisibleInstancesAndTextInstances(child, searchWithinHosts, fn, a2, b, c) {
    for (; null !== child; ) {
      if ((5 === child.tag || 27 === child.tag || 6 === child.tag) && fn(child, a2, b, c) || (22 !== child.tag || null === child.memoizedState) && (searchWithinHosts || 5 !== child.tag && 27 !== child.tag) && traverseVisibleInstancesAndTextInstances(child.child, searchWithinHosts, fn, a2, b, c))
        return true;
      child = child.sibling;
    }
    return false;
  }
  function getFragmentParentInstanceOrContainerFiber(fiber) {
    for (fiber = fiber.return; null !== fiber; ) {
      if (3 === fiber.tag || 5 === fiber.tag || 27 === fiber.tag)
        return fiber;
      fiber = fiber.return;
    }
    return null;
  }
  function fiberIsPortaledIntoHost(fiber) {
    var foundPortalParent = false;
    for (fiber = fiber.return; null !== fiber; ) {
      4 === fiber.tag && (foundPortalParent = true);
      if (3 === fiber.tag || 5 === fiber.tag || 27 === fiber.tag)
        break;
      fiber = fiber.return;
    }
    return foundPortalParent;
  }
  function getFragmentInstanceOrTextInstanceSiblings(fiber) {
    var result = [null, null], parentHostFiber = getFragmentParentInstanceOrContainerFiber(fiber);
    if (null === parentHostFiber)
      return result;
    findFragmentInstanceOrTextInstanceSiblings(result, fiber, parentHostFiber.child, { foundSelf: false });
    return result;
  }
  function findFragmentInstanceOrTextInstanceSiblings(result, self, child, state) {
    for (; null !== child; ) {
      if (child === self)
        state.foundSelf = true;
      else if (5 === child.tag || 27 === child.tag || 6 === child.tag) {
        if (state.foundSelf)
          return result[1] = child, true;
        result[0] = child;
      } else if ((22 !== child.tag || null === child.memoizedState) && findFragmentInstanceOrTextInstanceSiblings(result, self, child.child, state))
        return true;
      child = child.sibling;
    }
    return false;
  }
  function getInstanceFromHostFiber(fiber) {
    switch (fiber.tag) {
      case 5:
      case 27:
      case 6:
        return fiber.stateNode;
      case 3:
        return fiber.stateNode.containerInfo;
      default:
        throw Error(formatProdErrorMessage(559));
    }
  }
  var searchTarget = null, searchBoundary = null;
  function isFiberPrecedingCheck(child, target, boundary) {
    return child === boundary ? true : child === target ? (searchTarget = child, true) : false;
  }
  function isFiberFollowingCheck(child, target, boundary) {
    return child === boundary ? (searchBoundary = child, false) : child === target ? (null !== searchBoundary && (searchTarget = child), true) : false;
  }
  function getParentForFragmentAncestors(inst) {
    if (null === inst)
      return null;
    do
      inst = null === inst ? null : inst.return;
    while (inst && 5 !== inst.tag && 27 !== inst.tag && 3 !== inst.tag);
    return inst ? inst : null;
  }
  function getLowestCommonAncestor(instA, instB, getParent2) {
    for (var depthA = 0, tempA = instA; tempA; tempA = getParent2(tempA))
      depthA++;
    tempA = 0;
    for (var tempB = instB; tempB; tempB = getParent2(tempB))
      tempA++;
    for (; 0 < depthA - tempA; )
      instA = getParent2(instA), depthA--;
    for (; 0 < tempA - depthA; )
      instB = getParent2(instB), tempA--;
    for (; depthA--; ) {
      if (instA === instB || null !== instB && instA === instB.alternate)
        return instA;
      instA = getParent2(instA);
      instB = getParent2(instB);
    }
    return null;
  }
  var assign = Object.assign, REACT_LEGACY_ELEMENT_TYPE =  Symbol.for("react.element"), REACT_ELEMENT_TYPE =  Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE =  Symbol.for("react.portal"), REACT_FRAGMENT_TYPE =  Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE =  Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE =  Symbol.for("react.profiler"), REACT_CONSUMER_TYPE =  Symbol.for("react.consumer"), REACT_CONTEXT_TYPE =  Symbol.for("react.context"), REACT_FORWARD_REF_TYPE =  Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE =  Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE =  Symbol.for("react.suspense_list"), REACT_MEMO_TYPE =  Symbol.for("react.memo"), REACT_LAZY_TYPE =  Symbol.for("react.lazy");
  var REACT_ACTIVITY_TYPE =  Symbol.for("react.activity"), REACT_LEGACY_HIDDEN_TYPE =  Symbol.for("react.legacy_hidden");
  var REACT_MEMO_CACHE_SENTINEL =  Symbol.for("react.memo_cache_sentinel"), REACT_VIEW_TRANSITION_TYPE =  Symbol.for("react.view_transition"), REACT_RECOVERABLE_TYPE =  Symbol.for("react.recoverable"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable)
      return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var REACT_CLIENT_REFERENCE =  Symbol.for("react.client.reference");
  function getComponentNameFromType(type) {
    if (null == type)
      return null;
    if ("function" === typeof type)
      return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
    if ("string" === typeof type)
      return type;
    switch (type) {
      case REACT_FRAGMENT_TYPE:
        return "Fragment";
      case REACT_PROFILER_TYPE:
        return "Profiler";
      case REACT_STRICT_MODE_TYPE:
        return "StrictMode";
      case REACT_SUSPENSE_TYPE:
        return "Suspense";
      case REACT_SUSPENSE_LIST_TYPE:
        return "SuspenseList";
      case REACT_ACTIVITY_TYPE:
        return "Activity";
      case REACT_VIEW_TRANSITION_TYPE:
        return "ViewTransition";
    }
    if ("object" === typeof type)
      switch (type.$$typeof) {
        case REACT_PORTAL_TYPE:
          return "Portal";
        case REACT_CONTEXT_TYPE:
          return type.displayName || "Context";
        case REACT_CONSUMER_TYPE:
          return (type._context.displayName || "Context") + ".Consumer";
        case REACT_FORWARD_REF_TYPE:
          var innerType = type.render;
          type = type.displayName;
          type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
          return type;
        case REACT_MEMO_TYPE:
          return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
        case REACT_LAZY_TYPE:
          innerType = type._payload;
          type = type._init;
          try {
            return getComponentNameFromType(type(innerType));
          } catch (x) {
          }
      }
    return null;
  }
  var isArrayImpl = Array.isArray, ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ReactDOMSharedInternals = ReactDOM2.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, sharedNotPendingObject = {
    pending: false,
    data: null,
    method: null,
    action: null
  }, valueStack = [], index = -1;
  function createCursor(defaultValue) {
    return { current: defaultValue };
  }
  function pop(cursor) {
    0 > index || (cursor.current = valueStack[index], valueStack[index] = null, index--);
  }
  function push(cursor, value) {
    index++;
    valueStack[index] = cursor.current;
    cursor.current = value;
  }
  var contextStackCursor = createCursor(null), contextFiberStackCursor = createCursor(null), rootInstanceStackCursor = createCursor(null), hostTransitionProviderCursor = createCursor(null);
  function pushHostContainer(fiber, nextRootInstance) {
    push(rootInstanceStackCursor, nextRootInstance);
    push(contextFiberStackCursor, fiber);
    push(contextStackCursor, null);
    switch (nextRootInstance.nodeType) {
      case 9:
      case 11:
        fiber = (fiber = nextRootInstance.documentElement) ? (fiber = fiber.namespaceURI) ? getOwnHostContext(fiber) : 0 : 0;
        break;
      default:
        if (fiber = nextRootInstance.tagName, nextRootInstance = nextRootInstance.namespaceURI)
          nextRootInstance = getOwnHostContext(nextRootInstance), fiber = getChildHostContextProd(nextRootInstance, fiber);
        else
          switch (fiber) {
            case "svg":
              fiber = 1;
              break;
            case "math":
              fiber = 2;
              break;
            default:
              fiber = 0;
          }
    }
    pop(contextStackCursor);
    push(contextStackCursor, fiber);
  }
  function popHostContainer() {
    pop(contextStackCursor);
    pop(contextFiberStackCursor);
    pop(rootInstanceStackCursor);
  }
  function pushHostContext(fiber) {
    var stateHook = fiber.memoizedState;
    null !== stateHook && (HostTransitionContext._currentValue = stateHook.memoizedState, push(hostTransitionProviderCursor, fiber));
    stateHook = contextStackCursor.current;
    var JSCompiler_inline_result = getChildHostContextProd(stateHook, fiber.type);
    stateHook !== JSCompiler_inline_result && (push(contextFiberStackCursor, fiber), push(contextStackCursor, JSCompiler_inline_result));
  }
  function popHostContext(fiber) {
    contextFiberStackCursor.current === fiber && (pop(contextStackCursor), pop(contextFiberStackCursor));
    hostTransitionProviderCursor.current === fiber && (pop(hostTransitionProviderCursor), HostTransitionContext._currentValue = sharedNotPendingObject);
  }
  var prefix, suffix;
  function describeBuiltInComponentFrame(name) {
    if (void 0 === prefix)
      try {
        throw Error();
      } catch (x) {
        var match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || "";
        suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return "\n" + prefix + name + suffix;
  }
  var reentry = false;
  function describeNativeComponentFrame(fn, construct) {
    if (!fn || reentry)
      return "";
    reentry = true;
    var previousPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var RunInRootFrame = {
        DetermineComponentFrameRoot: function() {
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if ("object" === typeof Reflect && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  var control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x$1) {
                  control = x$1;
                }
                Fake = false;
                try {
                  var prevProps = Object.getOwnPropertyDescriptor(fn.prototype, "props");
                  Object.defineProperty(fn.prototype, "props", {
                    configurable: true,
                    set: function() {
                      throw Error();
                    }
                  });
                  Fake = true;
                  new fn();
                } finally {
                  Fake && (void 0 !== prevProps ? Object.defineProperty(fn.prototype, "props", prevProps) : delete fn.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (x$2) {
                control = x$2;
              }
              (Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {
              });
            }
          } catch (sample) {
            if (sample && control && "string" === typeof sample.stack)
              return [sample.stack, control.stack];
          }
          return [null, null];
        }
      };
      RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var namePropDescriptor = Object.getOwnPropertyDescriptor(RunInRootFrame.DetermineComponentFrameRoot, "name");
      namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
      var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
      if (sampleStack && controlStack) {
        var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
        for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot"); )
          RunInRootFrame++;
        for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes("DetermineComponentFrameRoot"); )
          namePropDescriptor++;
        if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length)
          for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]; )
            namePropDescriptor--;
        for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--)
          if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
            if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
              do
                if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                  var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                  fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
                  return frame;
                }
              while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
            }
            break;
          }
      }
    } finally {
      reentry = false, Error.prepareStackTrace = previousPrepareStackTrace;
    }
    return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
  }
  function describeFiber(fiber, childFiber) {
    switch (fiber.tag) {
      case 26:
      case 27:
      case 5:
        return describeBuiltInComponentFrame(fiber.type);
      case 16:
        return describeBuiltInComponentFrame("Lazy");
      case 13:
        return fiber.child !== childFiber && null !== childFiber ? describeBuiltInComponentFrame("Suspense Fallback") : describeBuiltInComponentFrame("Suspense");
      case 19:
        return describeBuiltInComponentFrame("SuspenseList");
      case 0:
      case 15:
        return describeNativeComponentFrame(fiber.type, false);
      case 11:
        return describeNativeComponentFrame(fiber.type.render, false);
      case 1:
        return describeNativeComponentFrame(fiber.type, true);
      case 31:
        return describeBuiltInComponentFrame("Activity");
      case 30:
        return describeBuiltInComponentFrame("ViewTransition");
      default:
        return "";
    }
  }
  function getStackByFiberInDevAndProd(workInProgress2) {
    try {
      var info = "", previous = null;
      do
        info += describeFiber(workInProgress2, previous), previous = workInProgress2, workInProgress2 = workInProgress2.return;
      while (workInProgress2);
      return info;
    } catch (x) {
      return "\nError generating stack: " + x.message + "\n" + x.stack;
    }
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty, scheduleCallback$3 = Scheduler.unstable_scheduleCallback, cancelCallback$1 = Scheduler.unstable_cancelCallback, shouldYield = Scheduler.unstable_shouldYield, requestPaint = Scheduler.unstable_requestPaint, now = Scheduler.unstable_now, getCurrentPriorityLevel = Scheduler.unstable_getCurrentPriorityLevel, ImmediatePriority = Scheduler.unstable_ImmediatePriority, UserBlockingPriority = Scheduler.unstable_UserBlockingPriority, NormalPriority$1 = Scheduler.unstable_NormalPriority, LowPriority = Scheduler.unstable_LowPriority, IdlePriority = Scheduler.unstable_IdlePriority, log$1 = Scheduler.log, unstable_setDisableYieldValue = Scheduler.unstable_setDisableYieldValue, rendererID = null, injectedHook = null;
  function setIsStrictModeForDevtools(newIsStrictMode) {
    "function" === typeof log$1 && unstable_setDisableYieldValue(newIsStrictMode);
    if (injectedHook && "function" === typeof injectedHook.setStrictMode)
      try {
        injectedHook.setStrictMode(rendererID, newIsStrictMode);
      } catch (err) {
      }
  }
  var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback, log = Math.log, LN2 = Math.LN2;
  function clz32Fallback(x) {
    x >>>= 0;
    return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
  }
  var nextTransitionUpdateLane = 256, nextTransitionDeferredLane = 262144, nextRetryLane = 4194304;
  function getHighestPriorityLanes(lanes) {
    var pendingSyncLanes = lanes & 42;
    if (0 !== pendingSyncLanes)
      return pendingSyncLanes;
    switch (lanes & -lanes) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return lanes & -lanes;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return lanes & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return lanes & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return lanes;
    }
  }
  function getNextLanes(root2, wipLanes, rootHasPendingCommit) {
    var pendingLanes = root2.pendingLanes;
    if (0 === pendingLanes)
      return 0;
    var nextLanes = 0, suspendedLanes = root2.suspendedLanes, pingedLanes = root2.pingedLanes;
    root2 = root2.warmLanes;
    var nonIdlePendingLanes = pendingLanes & 134217727;
    0 !== nonIdlePendingLanes ? (pendingLanes = nonIdlePendingLanes & ~suspendedLanes, 0 !== pendingLanes ? nextLanes = getHighestPriorityLanes(pendingLanes) : (pingedLanes &= nonIdlePendingLanes, 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = nonIdlePendingLanes & ~root2, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))))) : (nonIdlePendingLanes = pendingLanes & ~suspendedLanes, 0 !== nonIdlePendingLanes ? nextLanes = getHighestPriorityLanes(nonIdlePendingLanes) : 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = pendingLanes & ~root2, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))));
    return 0 === nextLanes ? 0 : 0 !== wipLanes && wipLanes !== nextLanes && 0 === (wipLanes & suspendedLanes) && (suspendedLanes = nextLanes & -nextLanes, rootHasPendingCommit = wipLanes & -wipLanes, suspendedLanes >= rootHasPendingCommit || 32 === suspendedLanes && 0 !== (rootHasPendingCommit & 4194048)) ? wipLanes : nextLanes;
  }
  function checkIfRootIsPrerendering(root2, renderLanes2) {
    return 0 === (root2.pendingLanes & ~(root2.suspendedLanes & ~root2.pingedLanes) & renderLanes2);
  }
  function getEntangledLanes(root2, renderLanes2) {
    0 !== (renderLanes2 & 8) && (renderLanes2 |= renderLanes2 & 32);
    var allEntangledLanes = root2.entangledLanes;
    if (0 !== allEntangledLanes)
      for (root2 = root2.entanglements, allEntangledLanes &= renderLanes2; 0 < allEntangledLanes; ) {
        var index$4 = 31 - clz32(allEntangledLanes), lane = 1 << index$4;
        renderLanes2 |= root2[index$4];
        allEntangledLanes &= ~lane;
      }
    return renderLanes2;
  }
  function computeExpirationTime(lane, currentTime) {
    switch (lane) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return currentTime + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return currentTime + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function claimNextRetryLane() {
    var lane = nextRetryLane;
    nextRetryLane <<= 1;
    0 === (nextRetryLane & 62914560) && (nextRetryLane = 4194304);
    return lane;
  }
  function createLaneMap(initial) {
    for (var laneMap = [], i = 0; 31 > i; i++)
      laneMap.push(initial);
    return laneMap;
  }
  function markRootUpdated$1(root2, updateLane) {
    root2.pendingLanes |= updateLane;
    268435456 !== updateLane && (root2.suspendedLanes = 0, root2.pingedLanes = 0, root2.warmLanes = 0);
  }
  function markRootFinished(root2, finishedLanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes) {
    var previouslyPendingLanes = root2.pendingLanes;
    root2.pendingLanes = remainingLanes;
    root2.suspendedLanes = 0;
    root2.pingedLanes = 0;
    root2.warmLanes = 0;
    root2.expiredLanes &= remainingLanes;
    root2.entangledLanes &= remainingLanes;
    root2.errorRecoveryDisabledLanes &= remainingLanes;
    root2.shellSuspendCounter = 0;
    var entanglements = root2.entanglements, expirationTimes = root2.expirationTimes, hiddenUpdates = root2.hiddenUpdates;
    for (remainingLanes = previouslyPendingLanes & ~remainingLanes; 0 < remainingLanes; ) {
      var index$7 = 31 - clz32(remainingLanes), lane = 1 << index$7;
      entanglements[index$7] = 0;
      expirationTimes[index$7] = -1;
      var hiddenUpdatesForLane = hiddenUpdates[index$7];
      if (null !== hiddenUpdatesForLane)
        for (hiddenUpdates[index$7] = null, index$7 = 0; index$7 < hiddenUpdatesForLane.length; index$7++) {
          var update = hiddenUpdatesForLane[index$7];
          null !== update && (update.lane &= -536870913);
        }
      remainingLanes &= ~lane;
    }
    0 !== spawnedLane && markSpawnedDeferredLane(root2, spawnedLane, 0);
    0 !== suspendedRetryLanes && 0 === updatedLanes && 0 !== root2.tag && (root2.suspendedLanes |= suspendedRetryLanes & ~(previouslyPendingLanes & ~finishedLanes));
  }
  function markSpawnedDeferredLane(root2, spawnedLane, entangledLanes) {
    root2.pendingLanes |= spawnedLane;
    root2.suspendedLanes &= ~spawnedLane;
    var spawnedLaneIndex = 31 - clz32(spawnedLane);
    root2.entangledLanes |= spawnedLane;
    root2.entanglements[spawnedLaneIndex] = root2.entanglements[spawnedLaneIndex] | 1073741824 | entangledLanes & 261930;
  }
  function markRootEntangled(root2, entangledLanes) {
    var rootEntangledLanes = root2.entangledLanes |= entangledLanes;
    for (root2 = root2.entanglements; rootEntangledLanes; ) {
      var index$8 = 31 - clz32(rootEntangledLanes), lane = 1 << index$8;
      lane & entangledLanes | root2[index$8] & entangledLanes && (root2[index$8] |= entangledLanes);
      rootEntangledLanes &= ~lane;
    }
  }
  function getBumpedLaneForHydration(root2, renderLanes2) {
    var renderLane = renderLanes2 & -renderLanes2;
    renderLane = 0 !== (renderLane & 42) ? 1 : getBumpedLaneForHydrationByLane(renderLane);
    return 0 !== (renderLane & (root2.suspendedLanes | renderLanes2)) ? 0 : renderLane;
  }
  function getBumpedLaneForHydrationByLane(lane) {
    switch (lane) {
      case 2:
        lane = 1;
        break;
      case 8:
        lane = 4;
        break;
      case 32:
        lane = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        lane = 128;
        break;
      case 268435456:
        lane = 134217728;
        break;
      default:
        lane = 0;
    }
    return lane;
  }
  function lanesToEventPriority(lanes) {
    lanes &= -lanes;
    return 2 < lanes ? 8 < lanes ? 0 !== (lanes & 134217727) ? 32 : 268435456 : 8 : 2;
  }
  function resolveUpdatePriority() {
    var updatePriority = ReactDOMSharedInternals.p;
    if (0 !== updatePriority)
      return updatePriority;
    updatePriority = window.event;
    return void 0 === updatePriority ? 32 : getEventPriority(updatePriority.type);
  }
  function runWithPriority(priority, fn) {
    var previousPriority = ReactDOMSharedInternals.p;
    try {
      return ReactDOMSharedInternals.p = priority, fn();
    } finally {
      ReactDOMSharedInternals.p = previousPriority;
    }
  }
  var randomKey = Math.random().toString(36).slice(2), internalInstanceKey = "__reactFiber$" + randomKey, internalPropsKey = "__reactProps$" + randomKey, internalContainerInstanceKey = "__reactContainer$" + randomKey, internalEventHandlersKey = "__reactEvents$" + randomKey, internalEventHandlerListenersKey = "__reactListeners$" + randomKey, internalEventHandlesSetKey = "__reactHandles$" + randomKey, internalRootNodeResourcesKey = "__reactResources$" + randomKey, internalHoistableMarker = "__reactMarker$" + randomKey, internalLoadPendingKey = "__reactLoad$" + randomKey;
  function detachDeletedInstance(node) {
    delete node[internalInstanceKey];
    delete node[internalPropsKey];
    delete node[internalEventHandlerListenersKey];
    delete node[internalEventHandlesSetKey];
  }
  function getClosestInstanceFromNode(targetNode) {
    var targetInst;
    if (targetInst = targetNode[internalInstanceKey])
      return targetInst;
    for (var parentNode = targetNode.parentNode; parentNode; ) {
      if (targetInst = parentNode[internalContainerInstanceKey] || parentNode[internalInstanceKey]) {
        parentNode = targetInst.alternate;
        if (null !== targetInst.child || null !== parentNode && null !== parentNode.child)
          for (targetNode = getParentHydrationBoundary(targetNode); null !== targetNode; ) {
            if (parentNode = targetNode[internalInstanceKey])
              return parentNode;
            targetNode = getParentHydrationBoundary(targetNode);
          }
        return targetInst;
      }
      targetNode = parentNode;
      parentNode = targetNode.parentNode;
    }
    return null;
  }
  function getInstanceFromNode(node) {
    if (node = node[internalInstanceKey] || node[internalContainerInstanceKey]) {
      var tag = node.tag;
      if (5 === tag || 6 === tag || 13 === tag || 31 === tag || 26 === tag || 27 === tag || 3 === tag)
        return node;
    }
    return null;
  }
  function getNodeFromInstance(inst) {
    var tag = inst.tag;
    if (5 === tag || 26 === tag || 27 === tag || 6 === tag)
      return inst.stateNode;
    throw Error(formatProdErrorMessage(33));
  }
  function getResourcesFromRoot(root2) {
    var resources = root2[internalRootNodeResourcesKey];
    resources || (resources = root2[internalRootNodeResourcesKey] = { hoistableStyles:  new Map(), hoistableScripts:  new Map() });
    return resources;
  }
  function markNodeAsHoistable(node) {
    node[internalHoistableMarker] = true;
  }
  function clearPendingLoadOnNode(node) {
    node[internalLoadPendingKey] = void 0;
  }
  var allNativeEvents =  new Set(), registrationNameDependencies = {};
  function registerTwoPhaseEvent(registrationName, dependencies) {
    registerDirectEvent(registrationName, dependencies);
    registerDirectEvent(registrationName + "Capture", dependencies);
  }
  function registerDirectEvent(registrationName, dependencies) {
    registrationNameDependencies[registrationName] = dependencies;
    for (registrationName = 0; registrationName < dependencies.length; registrationName++)
      allNativeEvents.add(dependencies[registrationName]);
  }
  var VALID_ATTRIBUTE_NAME_REGEX = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), illegalAttributeNameCache = {}, validatedAttributeNameCache = {};
  function isAttributeNameSafe(attributeName) {
    if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
      return true;
    if (hasOwnProperty.call(illegalAttributeNameCache, attributeName))
      return false;
    if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
      return validatedAttributeNameCache[attributeName] = true;
    illegalAttributeNameCache[attributeName] = true;
    return false;
  }
  var viewTransitionMutationContext = false;
  function pushMutationContext() {
    var prev = viewTransitionMutationContext;
    viewTransitionMutationContext = false;
    return prev;
  }
  function setValueForAttribute(node, name, value) {
    if (isAttributeNameSafe(name))
      if (null === value)
        node.removeAttribute(name);
      else {
        switch (typeof value) {
          case "undefined":
          case "function":
          case "symbol":
            node.removeAttribute(name);
            return;
          case "boolean":
            var prefix$10 = name.toLowerCase().slice(0, 5);
            if ("data-" !== prefix$10 && "aria-" !== prefix$10) {
              node.removeAttribute(name);
              return;
            }
        }
        node.setAttribute(name, value);
      }
  }
  function setValueForKnownAttribute(node, name, value) {
    if (null === value)
      node.removeAttribute(name);
    else {
      switch (typeof value) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          node.removeAttribute(name);
          return;
      }
      node.setAttribute(name, value);
    }
  }
  function setValueForNamespacedAttribute(node, namespace, name, value) {
    if (null === value)
      node.removeAttribute(name);
    else {
      switch (typeof value) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          node.removeAttribute(name);
          return;
      }
      node.setAttributeNS(namespace, name, value);
    }
  }
  function getToStringValue(value) {
    switch (typeof value) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return value;
      case "object":
        return value;
      default:
        return "";
    }
  }
  function isCheckable(elem) {
    var type = elem.type;
    return (elem = elem.nodeName) && "input" === elem.toLowerCase() && ("checkbox" === type || "radio" === type);
  }
  function trackValueOnNode(node, valueField, currentValue) {
    var descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField);
    if (!node.hasOwnProperty(valueField) && "undefined" !== typeof descriptor && "function" === typeof descriptor.get && "function" === typeof descriptor.set) {
      var get = descriptor.get, set = descriptor.set;
      Object.defineProperty(node, valueField, {
        configurable: true,
        get: function() {
          return get.call(this);
        },
        set: function(value) {
          currentValue = "" + value;
          set.call(this, value);
        }
      });
      Object.defineProperty(node, valueField, {
        enumerable: descriptor.enumerable
      });
      return {
        getValue: function() {
          return currentValue;
        },
        setValue: function(value) {
          currentValue = "" + value;
        },
        stopTracking: function() {
          node._valueTracker = null;
          delete node[valueField];
        }
      };
    }
  }
  function track(node) {
    if (!node._valueTracker) {
      var valueField = isCheckable(node) ? "checked" : "value";
      node._valueTracker = trackValueOnNode(node, valueField, "" + node[valueField]);
    }
  }
  function updateValueIfChanged(node) {
    if (!node)
      return false;
    var tracker = node._valueTracker;
    if (!tracker)
      return true;
    var lastValue = tracker.getValue();
    var value = "";
    node && (value = isCheckable(node) ? node.checked ? "true" : "false" : node.value);
    node = value;
    return node !== lastValue ? (tracker.setValue(node), true) : false;
  }
  var escapeSelectorAttributeValueInsideDoubleQuotesRegex = /[\n"\\]/g;
  function escapeSelectorAttributeValueInsideDoubleQuotes(value) {
    return value.replace(escapeSelectorAttributeValueInsideDoubleQuotesRegex, function(ch) {
      return "\\" + ch.charCodeAt(0).toString(16) + " ";
    });
  }
  function updateInput(element, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name) {
    element.name = "";
    null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type ? element.type = type : element.removeAttribute("type");
    if (null != value)
      if ("number" === type) {
        if (0 === value && "" === element.value || element.value != value)
          element.value = "" + getToStringValue(value);
      } else
        element.value !== "" + getToStringValue(value) && (element.value = "" + getToStringValue(value));
    else
      "submit" !== type && "reset" !== type || element.removeAttribute("value");
    null != value ? "number" === type && element.value == value ? setDefaultValue(element, getToStringValue(element.value)) : setDefaultValue(element, getToStringValue(value)) : null != defaultValue ? setDefaultValue(element, getToStringValue(defaultValue)) : null != lastDefaultValue && element.removeAttribute("value");
    null == checked && null != defaultChecked && (element.defaultChecked = !!defaultChecked);
    null != checked && (element.checked = checked && "function" !== typeof checked && "symbol" !== typeof checked);
    null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name ? element.name = "" + getToStringValue(name) : element.removeAttribute("name");
  }
  function initInput(element, value, defaultValue, checked, defaultChecked, type, name, isHydrating2) {
    null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type && (element.type = type);
    if (null != value || null != defaultValue) {
      if (!("submit" !== type && "reset" !== type || void 0 !== value && null !== value)) {
        track(element);
        return;
      }
      defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
      value = null != value ? "" + getToStringValue(value) : defaultValue;
      isHydrating2 || value === element.value || (element.value = value);
      element.defaultValue = value;
    }
    checked = null != checked ? checked : defaultChecked;
    checked = "function" !== typeof checked && "symbol" !== typeof checked && !!checked;
    element.checked = isHydrating2 ? element.checked : !!checked;
    element.defaultChecked = !!checked;
    null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name && (element.name = name);
    track(element);
  }
  function setDefaultValue(node, value) {
    node.defaultValue !== "" + value && (node.defaultValue = "" + value);
  }
  function updateOptions(node, multiple, propValue, setDefaultSelected) {
    node = node.options;
    if (multiple) {
      multiple = {};
      for (var i = 0; i < propValue.length; i++)
        multiple["$" + propValue[i]] = true;
      for (propValue = 0; propValue < node.length; propValue++)
        i = multiple.hasOwnProperty("$" + node[propValue].value), node[propValue].selected !== i && (node[propValue].selected = i), i && setDefaultSelected && (node[propValue].defaultSelected = true);
    } else {
      propValue = "" + getToStringValue(propValue);
      multiple = null;
      for (i = 0; i < node.length; i++) {
        if (node[i].value === propValue) {
          node[i].selected = true;
          setDefaultSelected && (node[i].defaultSelected = true);
          return;
        }
        null !== multiple || node[i].disabled || (multiple = node[i]);
      }
      null !== multiple && (multiple.selected = true);
    }
  }
  function updateTextarea(element, value, defaultValue) {
    if (null != value && (value = "" + getToStringValue(value), value !== element.value && (element.value = value), null == defaultValue)) {
      element.defaultValue !== value && (element.defaultValue = value);
      return;
    }
    element.defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
  }
  function initTextarea(element, value, defaultValue, children) {
    if (null == value) {
      if (null != children) {
        if (null != defaultValue)
          throw Error(formatProdErrorMessage(92));
        if (isArrayImpl(children)) {
          if (1 < children.length)
            throw Error(formatProdErrorMessage(93));
          children = children[0];
        }
        defaultValue = children;
      }
      null == defaultValue && (defaultValue = "");
      value = defaultValue;
    }
    defaultValue = getToStringValue(value);
    element.defaultValue = defaultValue;
    children = element.textContent;
    children === defaultValue && "" !== children && null !== children && (element.value = children);
    track(element);
  }
  function setTextContent(node, text) {
    if (text) {
      var firstChild = node.firstChild;
      if (firstChild && firstChild === node.lastChild && 3 === firstChild.nodeType) {
        firstChild.nodeValue = text;
        return;
      }
    }
    node.textContent = text;
  }
  var unitlessNumbers = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
  function setValueForStyle(style2, styleName, value) {
    var isCustomProperty = 0 === styleName.indexOf("--");
    null == value || "boolean" === typeof value || "" === value ? isCustomProperty ? style2.setProperty(styleName, "") : "float" === styleName ? style2.cssFloat = "" : style2[styleName] = "" : isCustomProperty ? style2.setProperty(styleName, value) : "number" !== typeof value || 0 === value || unitlessNumbers.has(styleName) ? "float" === styleName ? style2.cssFloat = value : style2[styleName] = ("" + value).trim() : style2[styleName] = value + "px";
  }
  function setValueForStyles(node, styles, prevStyles) {
    if (null != styles && "object" !== typeof styles)
      throw Error(formatProdErrorMessage(62));
    node = node.style;
    if (null != prevStyles) {
      for (var styleName in prevStyles)
        !prevStyles.hasOwnProperty(styleName) || null != styles && styles.hasOwnProperty(styleName) || (0 === styleName.indexOf("--") ? node.setProperty(styleName, "") : "float" === styleName ? node.cssFloat = "" : node[styleName] = "", viewTransitionMutationContext = true);
      for (var styleName$16 in styles)
        styleName = styles[styleName$16], styles.hasOwnProperty(styleName$16) && prevStyles[styleName$16] !== styleName && (setValueForStyle(node, styleName$16, styleName), viewTransitionMutationContext = true);
    } else
      for (var styleName$17 in styles)
        styles.hasOwnProperty(styleName$17) && setValueForStyle(node, styleName$17, styles[styleName$17]);
  }
  function isCustomElement(tagName) {
    if (-1 === tagName.indexOf("-"))
      return false;
    switch (tagName) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return false;
      default:
        return true;
    }
  }
  var aliases =  new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["maskType", "mask-type"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function sanitizeURL(url) {
    return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
  }
  function noop$1() {
  }
  var currentReplayingEvent = null;
  function getEventTarget(nativeEvent) {
    nativeEvent = nativeEvent.target || nativeEvent.srcElement || window;
    nativeEvent.correspondingUseElement && (nativeEvent = nativeEvent.correspondingUseElement);
    return 3 === nativeEvent.nodeType ? nativeEvent.parentNode : nativeEvent;
  }
  var restoreTarget = null, restoreQueue = null;
  function restoreStateOfTarget(target) {
    var internalInstance = getInstanceFromNode(target);
    if (internalInstance && (target = internalInstance.stateNode)) {
      var props = target[internalPropsKey] || null;
      a: switch (target = internalInstance.stateNode, internalInstance.type) {
        case "input":
          updateInput(target, props.value, props.defaultValue, props.defaultValue, props.checked, props.defaultChecked, props.type, props.name);
          internalInstance = props.name;
          if ("radio" === props.type && null != internalInstance) {
            for (props = target; props.parentNode; )
              props = props.parentNode;
            props = props.querySelectorAll('input[name="' + escapeSelectorAttributeValueInsideDoubleQuotes("" + internalInstance) + '"][type="radio"]');
            for (internalInstance = 0; internalInstance < props.length; internalInstance++) {
              var otherNode = props[internalInstance];
              if (otherNode !== target && otherNode.form === target.form) {
                var otherProps = otherNode[internalPropsKey] || null;
                if (!otherProps)
                  throw Error(formatProdErrorMessage(90));
                updateInput(otherNode, otherProps.value, otherProps.defaultValue, otherProps.defaultValue, otherProps.checked, otherProps.defaultChecked, otherProps.type, otherProps.name);
              }
            }
            for (internalInstance = 0; internalInstance < props.length; internalInstance++)
              otherNode = props[internalInstance], otherNode.form === target.form && updateValueIfChanged(otherNode);
          }
          break a;
        case "textarea":
          updateTextarea(target, props.value, props.defaultValue);
          break a;
        case "select":
          internalInstance = props.value, null != internalInstance && updateOptions(target, !!props.multiple, internalInstance, false);
      }
    }
  }
  var isInsideEventHandler = false;
  function batchedUpdates$1(fn, a2, b) {
    if (isInsideEventHandler)
      return fn(a2, b);
    isInsideEventHandler = true;
    try {
      var JSCompiler_inline_result = fn(a2);
      return JSCompiler_inline_result;
    } finally {
      if (isInsideEventHandler = false, null !== restoreTarget || null !== restoreQueue) {
        if (flushSyncWork$1(), restoreTarget && (a2 = restoreTarget, fn = restoreQueue, restoreQueue = restoreTarget = null, restoreStateOfTarget(a2), fn))
          for (a2 = 0; a2 < fn.length; a2++)
            restoreStateOfTarget(fn[a2]);
      }
    }
  }
  function getListener(inst, registrationName) {
    var stateNode = inst.stateNode;
    if (null === stateNode)
      return null;
    var props = stateNode[internalPropsKey] || null;
    if (null === props)
      return null;
    stateNode = props[registrationName];
    a: switch (registrationName) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (props = !props.disabled) || (inst = inst.type, props = !("button" === inst || "input" === inst || "select" === inst || "textarea" === inst));
        inst = !props;
        break a;
      default:
        inst = false;
    }
    if (inst)
      return null;
    if (stateNode && "function" !== typeof stateNode)
      throw Error(formatProdErrorMessage(231, registrationName, typeof stateNode));
    return stateNode;
  }
  var canUseDOM = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), passiveBrowserEventsSupported = false;
  if (canUseDOM)
    try {
      var options = {};
      Object.defineProperty(options, "passive", {
        get: function() {
          passiveBrowserEventsSupported = true;
        }
      });
      window.addEventListener("test", options, options);
      window.removeEventListener("test", options, options);
    } catch (e2) {
      passiveBrowserEventsSupported = false;
    }
  var root = null, startText = null, fallbackText = null;
  function getData() {
    if (fallbackText)
      return fallbackText;
    var start, startValue = startText, startLength = startValue.length, end, endValue = "value" in root ? root.value : root.textContent, endLength = endValue.length;
    for (start = 0; start < startLength && startValue[start] === endValue[start]; start++)
      ;
    var minEnd = startLength - start;
    for (end = 1; end <= minEnd && startValue[startLength - end] === endValue[endLength - end]; end++)
      ;
    return fallbackText = endValue.slice(start, 1 < end ? 1 - end : void 0);
  }
  function getEventCharCode(nativeEvent) {
    var keyCode = nativeEvent.keyCode;
    "charCode" in nativeEvent ? (nativeEvent = nativeEvent.charCode, 0 === nativeEvent && 13 === keyCode && (nativeEvent = 13)) : nativeEvent = keyCode;
    10 === nativeEvent && (nativeEvent = 13);
    return 32 <= nativeEvent || 13 === nativeEvent ? nativeEvent : 0;
  }
  function functionThatReturnsTrue() {
    return true;
  }
  function functionThatReturnsFalse() {
    return false;
  }
  function createSyntheticEvent(Interface) {
    function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
      this._reactName = reactName;
      this._targetInst = targetInst;
      this.type = reactEventType;
      this.nativeEvent = nativeEvent;
      this.target = nativeEventTarget;
      this.currentTarget = null;
      for (var propName in Interface)
        Interface.hasOwnProperty(propName) && (reactName = Interface[propName], this[propName] = reactName ? reactName(nativeEvent) : nativeEvent[propName]);
      this.isDefaultPrevented = (null != nativeEvent.defaultPrevented ? nativeEvent.defaultPrevented : false === nativeEvent.returnValue) ? functionThatReturnsTrue : functionThatReturnsFalse;
      this.isPropagationStopped = functionThatReturnsFalse;
      return this;
    }
    assign(SyntheticBaseEvent.prototype, {
      preventDefault: function() {
        this.defaultPrevented = true;
        var event = this.nativeEvent;
        event && (event.preventDefault ? event.preventDefault() : "unknown" !== typeof event.returnValue && (event.returnValue = false), this.isDefaultPrevented = functionThatReturnsTrue);
      },
      stopPropagation: function() {
        var event = this.nativeEvent;
        event && (event.stopPropagation ? event.stopPropagation() : "unknown" !== typeof event.cancelBubble && (event.cancelBubble = true), this.isPropagationStopped = functionThatReturnsTrue);
      },
      persist: function() {
      },
      isPersistent: functionThatReturnsTrue
    });
    return SyntheticBaseEvent;
  }
  var EventInterface = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(event) {
      return event.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, SyntheticEvent = createSyntheticEvent(EventInterface), UIEventInterface = assign({}, EventInterface, { view: 0, detail: 0 }), SyntheticUIEvent = createSyntheticEvent(UIEventInterface), lastMovementX, lastMovementY, lastMouseEvent, MouseEventInterface = assign({}, UIEventInterface, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: getEventModifierState,
    button: 0,
    buttons: 0,
    relatedTarget: function(event) {
      return void 0 === event.relatedTarget ? event.fromElement === event.srcElement ? event.toElement : event.fromElement : event.relatedTarget;
    },
    movementX: function(event) {
      if ("movementX" in event)
        return event.movementX;
      event !== lastMouseEvent && (lastMouseEvent && "mousemove" === event.type ? (lastMovementX = event.screenX - lastMouseEvent.screenX, lastMovementY = event.screenY - lastMouseEvent.screenY) : lastMovementY = lastMovementX = 0, lastMouseEvent = event);
      return lastMovementX;
    },
    movementY: function(event) {
      return "movementY" in event ? event.movementY : lastMovementY;
    }
  }), SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface), DragEventInterface = assign({}, MouseEventInterface, { dataTransfer: 0 }), SyntheticDragEvent = createSyntheticEvent(DragEventInterface), FocusEventInterface = assign({}, UIEventInterface, { relatedTarget: 0 }), SyntheticFocusEvent = createSyntheticEvent(FocusEventInterface), AnimationEventInterface = assign({}, EventInterface, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), SyntheticAnimationEvent = createSyntheticEvent(AnimationEventInterface), ClipboardEventInterface = assign({}, EventInterface, {
    clipboardData: function(event) {
      return "clipboardData" in event ? event.clipboardData : window.clipboardData;
    }
  }), SyntheticClipboardEvent = createSyntheticEvent(ClipboardEventInterface), CompositionEventInterface = assign({}, EventInterface, { data: 0 }), SyntheticCompositionEvent = createSyntheticEvent(CompositionEventInterface), normalizeKey = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, translateToKey = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, modifierKeyToProp = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function modifierStateGetter(keyArg) {
    var nativeEvent = this.nativeEvent;
    return nativeEvent.getModifierState ? nativeEvent.getModifierState(keyArg) : (keyArg = modifierKeyToProp[keyArg]) ? !!nativeEvent[keyArg] : false;
  }
  function getEventModifierState() {
    return modifierStateGetter;
  }
  var KeyboardEventInterface = assign({}, UIEventInterface, {
    key: function(nativeEvent) {
      if (nativeEvent.key) {
        var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
        if ("Unidentified" !== key)
          return key;
      }
      return "keypress" === nativeEvent.type ? (nativeEvent = getEventCharCode(nativeEvent), 13 === nativeEvent ? "Enter" : String.fromCharCode(nativeEvent)) : "keydown" === nativeEvent.type || "keyup" === nativeEvent.type ? translateToKey[nativeEvent.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: getEventModifierState,
    charCode: function(event) {
      return "keypress" === event.type ? getEventCharCode(event) : 0;
    },
    keyCode: function(event) {
      return "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
    },
    which: function(event) {
      return "keypress" === event.type ? getEventCharCode(event) : "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
    }
  }), SyntheticKeyboardEvent = createSyntheticEvent(KeyboardEventInterface), PointerEventInterface = assign({}, MouseEventInterface, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), SyntheticPointerEvent = createSyntheticEvent(PointerEventInterface), SubmitEventInterface = assign({}, EventInterface, { submitter: 0 }), SyntheticSubmitEvent = createSyntheticEvent(SubmitEventInterface), TouchEventInterface = assign({}, UIEventInterface, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: getEventModifierState
  }), SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface), TransitionEventInterface = assign({}, EventInterface, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), SyntheticTransitionEvent = createSyntheticEvent(TransitionEventInterface), WheelEventInterface = assign({}, MouseEventInterface, {
    deltaX: function(event) {
      return "deltaX" in event ? event.deltaX : "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
    },
    deltaY: function(event) {
      return "deltaY" in event ? event.deltaY : "wheelDeltaY" in event ? -event.wheelDeltaY : "wheelDelta" in event ? -event.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface), ToggleEventInterface = assign({}, EventInterface, {
    newState: 0,
    oldState: 0,
    source: 0
  }), SyntheticToggleEvent = createSyntheticEvent(ToggleEventInterface), END_KEYCODES = [9, 13, 27, 32], canUseCompositionEvent = canUseDOM && "CompositionEvent" in window, documentMode = null;
  canUseDOM && "documentMode" in document && (documentMode = document.documentMode);
  var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode, useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && 8 < documentMode && 11 >= documentMode), SPACEBAR_CHAR = String.fromCharCode(32), hasSpaceKeypress = false;
  function isFallbackCompositionEnd(domEventName, nativeEvent) {
    switch (domEventName) {
      case "keyup":
        return -1 !== END_KEYCODES.indexOf(nativeEvent.keyCode);
      case "keydown":
        return 229 !== nativeEvent.keyCode;
      case "keypress":
      case "mousedown":
      case "focusout":
        return true;
      default:
        return false;
    }
  }
  function getDataFromCustomEvent(nativeEvent) {
    nativeEvent = nativeEvent.detail;
    return "object" === typeof nativeEvent && "data" in nativeEvent ? nativeEvent.data : null;
  }
  var isComposing = false;
  function getNativeBeforeInputChars(domEventName, nativeEvent) {
    switch (domEventName) {
      case "compositionend":
        return getDataFromCustomEvent(nativeEvent);
      case "keypress":
        if (32 !== nativeEvent.which)
          return null;
        hasSpaceKeypress = true;
        return SPACEBAR_CHAR;
      case "textInput":
        return domEventName = nativeEvent.data, domEventName === SPACEBAR_CHAR && hasSpaceKeypress ? null : domEventName;
      default:
        return null;
    }
  }
  function getFallbackBeforeInputChars(domEventName, nativeEvent) {
    if (isComposing)
      return "compositionend" === domEventName || !canUseCompositionEvent && isFallbackCompositionEnd(domEventName, nativeEvent) ? (domEventName = getData(), fallbackText = startText = root = null, isComposing = false, domEventName) : null;
    switch (domEventName) {
      case "paste":
        return null;
      case "keypress":
        if (!(nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) || nativeEvent.ctrlKey && nativeEvent.altKey) {
          if (nativeEvent.char && 1 < nativeEvent.char.length)
            return nativeEvent.char;
          if (nativeEvent.which)
            return String.fromCharCode(nativeEvent.which);
        }
        return null;
      case "compositionend":
        return useFallbackCompositionData && "ko" !== nativeEvent.locale ? null : nativeEvent.data;
      default:
        return null;
    }
  }
  var supportedInputTypes = {
    color: true,
    date: true,
    datetime: true,
    "datetime-local": true,
    email: true,
    month: true,
    number: true,
    password: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true
  };
  function isTextInputElement(elem) {
    var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
    return "input" === nodeName ? !!supportedInputTypes[elem.type] : "textarea" === nodeName ? true : false;
  }
  function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
    restoreTarget ? restoreQueue ? restoreQueue.push(target) : restoreQueue = [target] : restoreTarget = target;
    inst = accumulateTwoPhaseListeners(inst, "onChange");
    0 < inst.length && (nativeEvent = new SyntheticEvent("onChange", "change", null, nativeEvent, target), dispatchQueue.push({ event: nativeEvent, listeners: inst }));
  }
  var activeElement$1 = null, activeElementInst$1 = null;
  function runEventInBatch(dispatchQueue) {
    processDispatchQueue(dispatchQueue, 0);
  }
  function getInstIfValueChanged(targetInst) {
    var targetNode = getNodeFromInstance(targetInst);
    if (updateValueIfChanged(targetNode))
      return targetInst;
  }
  function getTargetInstForChangeEvent(domEventName, targetInst) {
    if ("change" === domEventName)
      return targetInst;
  }
  var isInputEventSupported = false;
  if (canUseDOM) {
    var JSCompiler_inline_result$jscomp$318;
    if (canUseDOM) {
      var isSupported$jscomp$inline_474 = "oninput" in document;
      if (!isSupported$jscomp$inline_474) {
        var element$jscomp$inline_475 = document.createElement("div");
        element$jscomp$inline_475.setAttribute("oninput", "return;");
        isSupported$jscomp$inline_474 = "function" === typeof element$jscomp$inline_475.oninput;
      }
      JSCompiler_inline_result$jscomp$318 = isSupported$jscomp$inline_474;
    } else
      JSCompiler_inline_result$jscomp$318 = false;
    isInputEventSupported = JSCompiler_inline_result$jscomp$318 && (!document.documentMode || 9 < document.documentMode);
  }
  function stopWatchingForValueChange() {
    activeElement$1 && (activeElement$1.detachEvent("onpropertychange", handlePropertyChange), activeElementInst$1 = activeElement$1 = null);
  }
  function handlePropertyChange(nativeEvent) {
    if ("value" === nativeEvent.propertyName && getInstIfValueChanged(activeElementInst$1)) {
      var dispatchQueue = [];
      createAndAccumulateChangeEvent(dispatchQueue, activeElementInst$1, nativeEvent, getEventTarget(nativeEvent));
      batchedUpdates$1(runEventInBatch, dispatchQueue);
    }
  }
  function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
    "focusin" === domEventName ? (stopWatchingForValueChange(), activeElement$1 = target, activeElementInst$1 = targetInst, activeElement$1.attachEvent("onpropertychange", handlePropertyChange)) : "focusout" === domEventName && stopWatchingForValueChange();
  }
  function getTargetInstForInputEventPolyfill(domEventName) {
    if ("selectionchange" === domEventName || "keyup" === domEventName || "keydown" === domEventName)
      return getInstIfValueChanged(activeElementInst$1);
  }
  function getTargetInstForClickEvent(domEventName, targetInst) {
    if ("click" === domEventName)
      return getInstIfValueChanged(targetInst);
  }
  function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
    if ("input" === domEventName || "change" === domEventName)
      return getInstIfValueChanged(targetInst);
  }
  function is(x, y) {
    return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is;
  function shallowEqual(objA, objB) {
    if (objectIs(objA, objB))
      return true;
    if ("object" !== typeof objA || null === objA || "object" !== typeof objB || null === objB)
      return false;
    var keysA = Object.keys(objA), keysB = Object.keys(objB);
    if (keysA.length !== keysB.length)
      return false;
    for (keysB = 0; keysB < keysA.length; keysB++) {
      var currentKey = keysA[keysB];
      if (!hasOwnProperty.call(objB, currentKey) || !objectIs(objA[currentKey], objB[currentKey]))
        return false;
    }
    return true;
  }
  function getActiveElement(doc) {
    doc = doc || ("undefined" !== typeof document ? document : void 0);
    if ("undefined" === typeof doc)
      return null;
    try {
      return doc.activeElement || doc.body;
    } catch (e$20) {
      return doc.body;
    }
  }
  function getLeafNode(node) {
    for (; node && node.firstChild; )
      node = node.firstChild;
    return node;
  }
  function getNodeForCharacterOffset(root2, offset) {
    var node = getLeafNode(root2);
    root2 = 0;
    for (var nodeEnd; node; ) {
      if (3 === node.nodeType) {
        nodeEnd = root2 + node.textContent.length;
        if (root2 <= offset && nodeEnd >= offset)
          return { node, offset: offset - root2 };
        root2 = nodeEnd;
      }
      a: {
        for (; node; ) {
          if (node.nextSibling) {
            node = node.nextSibling;
            break a;
          }
          node = node.parentNode;
        }
        node = void 0;
      }
      node = getLeafNode(node);
    }
  }
  function containsNode(outerNode, innerNode) {
    return outerNode && innerNode ? outerNode === innerNode ? true : outerNode && 3 === outerNode.nodeType ? false : innerNode && 3 === innerNode.nodeType ? containsNode(outerNode, innerNode.parentNode) : "contains" in outerNode ? outerNode.contains(innerNode) : outerNode.compareDocumentPosition ? !!(outerNode.compareDocumentPosition(innerNode) & 16) : false : false;
  }
  function getActiveElementDeep(containerInfo) {
    containerInfo = null != containerInfo && null != containerInfo.ownerDocument && null != containerInfo.ownerDocument.defaultView ? containerInfo.ownerDocument.defaultView : window;
    for (var element = getActiveElement(containerInfo.document); element instanceof containerInfo.HTMLIFrameElement; ) {
      try {
        var JSCompiler_inline_result = "string" === typeof element.contentWindow.location.href;
      } catch (err) {
        JSCompiler_inline_result = false;
      }
      if (JSCompiler_inline_result)
        containerInfo = element.contentWindow;
      else
        break;
      element = getActiveElement(containerInfo.document);
    }
    return element;
  }
  function hasSelectionCapabilities(elem) {
    var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
    return nodeName && ("input" === nodeName && ("text" === elem.type || "search" === elem.type || "tel" === elem.type || "url" === elem.type || "password" === elem.type) || "textarea" === nodeName || "true" === elem.contentEditable);
  }
  var skipSelectionChangeEvent = canUseDOM && "documentMode" in document && 11 >= document.documentMode, activeElement = null, activeElementInst = null, lastSelection = null, mouseDown = false;
  function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
    var doc = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget.document : 9 === nativeEventTarget.nodeType ? nativeEventTarget : nativeEventTarget.ownerDocument;
    mouseDown || null == activeElement || activeElement !== getActiveElement(doc) || (doc = activeElement, "selectionStart" in doc && hasSelectionCapabilities(doc) ? doc = { start: doc.selectionStart, end: doc.selectionEnd } : (doc = (doc.ownerDocument && doc.ownerDocument.defaultView || window).getSelection(), doc = {
      anchorNode: doc.anchorNode,
      anchorOffset: doc.anchorOffset,
      focusNode: doc.focusNode,
      focusOffset: doc.focusOffset
    }), lastSelection && shallowEqual(lastSelection, doc) || (lastSelection = doc, doc = accumulateTwoPhaseListeners(activeElementInst, "onSelect"), 0 < doc.length && (nativeEvent = new SyntheticEvent("onSelect", "select", null, nativeEvent, nativeEventTarget), dispatchQueue.push({ event: nativeEvent, listeners: doc }), nativeEvent.target = activeElement)));
  }
  function makePrefixMap(styleProp, eventName) {
    var prefixes = {};
    prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
    prefixes["Webkit" + styleProp] = "webkit" + eventName;
    prefixes["Moz" + styleProp] = "moz" + eventName;
    return prefixes;
  }
  var vendorPrefixes = {
    animationend: makePrefixMap("Animation", "AnimationEnd"),
    animationiteration: makePrefixMap("Animation", "AnimationIteration"),
    animationstart: makePrefixMap("Animation", "AnimationStart"),
    transitionrun: makePrefixMap("Transition", "TransitionRun"),
    transitionstart: makePrefixMap("Transition", "TransitionStart"),
    transitioncancel: makePrefixMap("Transition", "TransitionCancel"),
    transitionend: makePrefixMap("Transition", "TransitionEnd")
  }, prefixedEventNames = {}, style = {};
  canUseDOM && (style = document.createElement("div").style, "AnimationEvent" in window || (delete vendorPrefixes.animationend.animation, delete vendorPrefixes.animationiteration.animation, delete vendorPrefixes.animationstart.animation), "TransitionEvent" in window || delete vendorPrefixes.transitionend.transition);
  function getVendorPrefixedEventName(eventName) {
    if (prefixedEventNames[eventName])
      return prefixedEventNames[eventName];
    if (!vendorPrefixes[eventName])
      return eventName;
    var prefixMap = vendorPrefixes[eventName], styleProp;
    for (styleProp in prefixMap)
      if (prefixMap.hasOwnProperty(styleProp) && styleProp in style)
        return prefixedEventNames[eventName] = prefixMap[styleProp];
    return eventName;
  }
  var ANIMATION_END = getVendorPrefixedEventName("animationend"), ANIMATION_ITERATION = getVendorPrefixedEventName("animationiteration"), ANIMATION_START = getVendorPrefixedEventName("animationstart"), TRANSITION_RUN = getVendorPrefixedEventName("transitionrun"), TRANSITION_START = getVendorPrefixedEventName("transitionstart"), TRANSITION_CANCEL = getVendorPrefixedEventName("transitioncancel"), TRANSITION_END = getVendorPrefixedEventName("transitionend"), topLevelEventsToReactNames =  new Map(), simpleEventPluginEvents = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  simpleEventPluginEvents.push("scrollEnd");
  function registerSimpleEvent(domEventName, reactName) {
    topLevelEventsToReactNames.set(domEventName, reactName);
    registerTwoPhaseEvent(reactName, [domEventName]);
  }
  var globalClientIdCounter$1 = 0;
  function getViewTransitionName(props, instance) {
    if (null != props.name && "auto" !== props.name)
      return props.name;
    if (null !== instance.autoName)
      return instance.autoName;
    props = pendingEffectsRoot.identifierPrefix;
    var globalClientId = globalClientIdCounter$1++;
    props = "_" + props + "t_" + globalClientId.toString(32) + "_";
    return instance.autoName = props;
  }
  function getClassNameByType(classByType) {
    if (null == classByType || "string" === typeof classByType)
      return classByType;
    var className = null, activeTypes = pendingTransitionTypes;
    if (null !== activeTypes)
      for (var i = 0; i < activeTypes.length; i++) {
        var match = classByType[activeTypes[i]];
        if (null != match) {
          if ("none" === match)
            return "none";
          className = null == className ? match : className + (" " + match);
        }
      }
    return null == className ? classByType.default : className;
  }
  function getViewTransitionClassName(defaultClass, eventClass) {
    defaultClass = getClassNameByType(defaultClass);
    eventClass = getClassNameByType(eventClass);
    return null == eventClass ? "auto" === defaultClass ? null : defaultClass : "auto" === eventClass ? null : eventClass;
  }
  var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
    if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
      var event = new window.ErrorEvent("error", {
        bubbles: true,
        cancelable: true,
        message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
        error
      });
      if (!window.dispatchEvent(event))
        return;
    } else if ("object" === typeof process && "function" === typeof process.emit) {
      process.emit("uncaughtException", error);
      return;
    }
    console.error(error);
  }, concurrentQueues = [], concurrentQueuesIndex = 0, concurrentlyUpdatedLanes = 0;
  function finishQueueingConcurrentUpdates() {
    for (var endIndex = concurrentQueuesIndex, i = concurrentlyUpdatedLanes = concurrentQueuesIndex = 0; i < endIndex; ) {
      var fiber = concurrentQueues[i];
      concurrentQueues[i++] = null;
      var queue = concurrentQueues[i];
      concurrentQueues[i++] = null;
      var update = concurrentQueues[i];
      concurrentQueues[i++] = null;
      var lane = concurrentQueues[i];
      concurrentQueues[i++] = null;
      if (null !== queue && null !== update) {
        var pending = queue.pending;
        null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
        queue.pending = update;
      }
      0 !== lane && markUpdateLaneFromFiberToRoot(fiber, update, lane);
    }
  }
  function enqueueUpdate$1(fiber, queue, update, lane) {
    concurrentQueues[concurrentQueuesIndex++] = fiber;
    concurrentQueues[concurrentQueuesIndex++] = queue;
    concurrentQueues[concurrentQueuesIndex++] = update;
    concurrentQueues[concurrentQueuesIndex++] = lane;
    concurrentlyUpdatedLanes |= lane;
    fiber.lanes |= lane;
    fiber = fiber.alternate;
    null !== fiber && (fiber.lanes |= lane);
  }
  function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
    enqueueUpdate$1(fiber, queue, update, lane);
    return getRootForUpdatedFiber(fiber);
  }
  function enqueueConcurrentRenderForLane(fiber, lane) {
    enqueueUpdate$1(fiber, null, null, lane);
    return getRootForUpdatedFiber(fiber);
  }
  function markUpdateLaneFromFiberToRoot(sourceFiber, update, lane) {
    sourceFiber.lanes |= lane;
    var alternate = sourceFiber.alternate;
    null !== alternate && (alternate.lanes |= lane);
    for (var isHidden = false, parent = sourceFiber.return; null !== parent; )
      parent.childLanes |= lane, alternate = parent.alternate, null !== alternate && (alternate.childLanes |= lane), 22 === parent.tag && (sourceFiber = parent.stateNode, null === sourceFiber || sourceFiber._visibility & 1 || (isHidden = true)), sourceFiber = parent, parent = parent.return;
    return 3 === sourceFiber.tag ? (parent = sourceFiber.stateNode, isHidden && null !== update && (isHidden = 31 - clz32(lane), sourceFiber = parent.hiddenUpdates, alternate = sourceFiber[isHidden], null === alternate ? sourceFiber[isHidden] = [update] : alternate.push(update), update.lane = lane | 536870912), parent) : null;
  }
  function getRootForUpdatedFiber(sourceFiber) {
    if (50 < nestedUpdateCount)
      throw nestedUpdateCount = 0, rootWithNestedUpdates = null, Error(formatProdErrorMessage(185));
    for (var parent = sourceFiber.return; null !== parent; )
      sourceFiber = parent, parent = sourceFiber.return;
    return 3 === sourceFiber.tag ? sourceFiber.stateNode : null;
  }
  var emptyContextObject = {};
  function FiberNode(tag, pendingProps, key, mode) {
    this.tag = tag;
    this.key = key;
    this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
    this.index = 0;
    this.refCleanup = this.ref = null;
    this.pendingProps = pendingProps;
    this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
    this.mode = mode;
    this.subtreeFlags = this.flags = 0;
    this.deletions = null;
    this.childLanes = this.lanes = 0;
    this.alternate = null;
  }
  function createFiberImplClass(tag, pendingProps, key, mode) {
    return new FiberNode(tag, pendingProps, key, mode);
  }
  function shouldConstruct(Component) {
    Component = Component.prototype;
    return !(!Component || !Component.isReactComponent);
  }
  function createWorkInProgress(current, pendingProps) {
    var workInProgress2 = current.alternate;
    null === workInProgress2 ? (workInProgress2 = createFiberImplClass(current.tag, pendingProps, current.key, current.mode), workInProgress2.elementType = current.elementType, workInProgress2.type = current.type, workInProgress2.stateNode = current.stateNode, workInProgress2.alternate = current, current.alternate = workInProgress2) : (workInProgress2.pendingProps = pendingProps, workInProgress2.type = current.type, workInProgress2.flags = 0, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null);
    workInProgress2.flags = current.flags & 1206910976;
    workInProgress2.childLanes = current.childLanes;
    workInProgress2.lanes = current.lanes;
    workInProgress2.child = current.child;
    workInProgress2.memoizedProps = current.memoizedProps;
    workInProgress2.memoizedState = current.memoizedState;
    workInProgress2.updateQueue = current.updateQueue;
    pendingProps = current.dependencies;
    workInProgress2.dependencies = null === pendingProps ? null : { lanes: pendingProps.lanes, firstContext: pendingProps.firstContext };
    workInProgress2.sibling = current.sibling;
    workInProgress2.index = current.index;
    workInProgress2.ref = current.ref;
    workInProgress2.refCleanup = current.refCleanup;
    return workInProgress2;
  }
  function resetWorkInProgress(workInProgress2, renderLanes2) {
    workInProgress2.flags &= 1206910978;
    var current = workInProgress2.alternate;
    null === current ? (workInProgress2.childLanes = 0, workInProgress2.lanes = renderLanes2, workInProgress2.child = null, workInProgress2.subtreeFlags = 0, workInProgress2.memoizedProps = null, workInProgress2.memoizedState = null, workInProgress2.updateQueue = null, workInProgress2.dependencies = null, workInProgress2.stateNode = null) : (workInProgress2.childLanes = current.childLanes, workInProgress2.lanes = current.lanes, workInProgress2.child = current.child, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null, workInProgress2.memoizedProps = current.memoizedProps, workInProgress2.memoizedState = current.memoizedState, workInProgress2.updateQueue = current.updateQueue, workInProgress2.type = current.type, renderLanes2 = current.dependencies, workInProgress2.dependencies = null === renderLanes2 ? null : {
      lanes: renderLanes2.lanes,
      firstContext: renderLanes2.firstContext
    });
    return workInProgress2;
  }
  function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
    var fiberTag = 0;
    owner = type;
    if ("function" === typeof owner)
      shouldConstruct(owner) && (fiberTag = 1);
    else if ("string" === typeof owner)
      fiberTag = isHostHoistableType(type, pendingProps, contextStackCursor.current) ? 26 : "html" === type || "head" === type || "body" === type ? 27 : 5;
    else
      a: switch (owner) {
        case REACT_ACTIVITY_TYPE:
          return type = createFiberImplClass(31, pendingProps, key, mode), type.elementType = REACT_ACTIVITY_TYPE, type.lanes = lanes, type;
        case REACT_FRAGMENT_TYPE:
          return createFiberFromFragment(pendingProps.children, mode, lanes, key);
        case REACT_STRICT_MODE_TYPE:
          fiberTag = 8;
          mode |= 24;
          break;
        case REACT_PROFILER_TYPE:
          return type = createFiberImplClass(12, pendingProps, key, mode | 2), type.elementType = REACT_PROFILER_TYPE, type.lanes = lanes, type;
        case REACT_SUSPENSE_TYPE:
          return type = createFiberImplClass(13, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_TYPE, type.lanes = lanes, type;
        case REACT_SUSPENSE_LIST_TYPE:
          return type = createFiberImplClass(19, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_LIST_TYPE, type.lanes = lanes, type;
        case REACT_LEGACY_HIDDEN_TYPE:
        case REACT_VIEW_TRANSITION_TYPE:
          return type = mode | 32, type = createFiberImplClass(30, pendingProps, key, type), type.elementType = REACT_VIEW_TRANSITION_TYPE, type.lanes = lanes, type.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, type;
        default:
          if ("object" === typeof owner && null !== owner)
            switch (owner.$$typeof) {
              case REACT_CONTEXT_TYPE:
                fiberTag = 10;
                break a;
              case REACT_CONSUMER_TYPE:
                fiberTag = 9;
                break a;
              case REACT_FORWARD_REF_TYPE:
                fiberTag = 11;
                break a;
              case REACT_MEMO_TYPE:
                fiberTag = 14;
                break a;
              case REACT_LAZY_TYPE:
                fiberTag = 16;
                owner = null;
                break a;
            }
          fiberTag = 29;
          pendingProps = Error(formatProdErrorMessage(130, null === type ? "null" : typeof type, ""));
          owner = null;
      }
    key = createFiberImplClass(fiberTag, pendingProps, key, mode);
    key.elementType = type;
    key.type = owner;
    key.lanes = lanes;
    return key;
  }
  function createFiberFromFragment(elements, mode, lanes, key) {
    elements = createFiberImplClass(7, elements, key, mode);
    elements.lanes = lanes;
    return elements;
  }
  function createFiberFromText(content, mode, lanes) {
    content = createFiberImplClass(6, content, null, mode);
    content.lanes = lanes;
    return content;
  }
  function createFiberFromDehydratedFragment(dehydratedNode) {
    var fiber = createFiberImplClass(18, null, null, 0);
    fiber.stateNode = dehydratedNode;
    return fiber;
  }
  function createFiberFromPortal(portal, mode, lanes) {
    mode = createFiberImplClass(4, null !== portal.children ? portal.children : [], portal.key, mode);
    mode.lanes = lanes;
    mode.stateNode = {
      containerInfo: portal.containerInfo,
      pendingChildren: null,
      implementation: portal.implementation
    };
    return mode;
  }
  var CapturedStacks =  new WeakMap();
  function createCapturedValueAtFiber(value, source) {
    if ("object" === typeof value && null !== value) {
      var existing = CapturedStacks.get(value);
      if (void 0 !== existing)
        return existing;
      source = {
        value,
        source,
        stack: getStackByFiberInDevAndProd(source)
      };
      CapturedStacks.set(value, source);
      return source;
    }
    return {
      value,
      source,
      stack: getStackByFiberInDevAndProd(source)
    };
  }
  var forkStack = [], forkStackIndex = 0, treeForkProvider = null, treeForkCount = 0, idStack = [], idStackIndex = 0, treeContextProvider = null, treeContextId = 1, treeContextOverflow = "";
  function pushTreeFork(workInProgress2, totalChildren) {
    forkStack[forkStackIndex++] = treeForkCount;
    forkStack[forkStackIndex++] = treeForkProvider;
    treeForkProvider = workInProgress2;
    treeForkCount = totalChildren;
  }
  function pushTreeId(workInProgress2, totalChildren, index2) {
    idStack[idStackIndex++] = treeContextId;
    idStack[idStackIndex++] = treeContextOverflow;
    idStack[idStackIndex++] = treeContextProvider;
    treeContextProvider = workInProgress2;
    var baseIdWithLeadingBit = treeContextId;
    workInProgress2 = treeContextOverflow;
    var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
    baseIdWithLeadingBit &= ~(1 << baseLength);
    index2 += 1;
    var length = 32 - clz32(totalChildren) + baseLength;
    if (30 < length) {
      var numberOfOverflowBits = baseLength - baseLength % 5;
      length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
      baseIdWithLeadingBit >>= numberOfOverflowBits;
      baseLength -= numberOfOverflowBits;
      treeContextId = 1 << 32 - clz32(totalChildren) + baseLength | index2 << baseLength | baseIdWithLeadingBit;
      treeContextOverflow = length + workInProgress2;
    } else
      treeContextId = 1 << length | index2 << baseLength | baseIdWithLeadingBit, treeContextOverflow = workInProgress2;
  }
  function pushMaterializedTreeId(workInProgress2) {
    null !== workInProgress2.return && (pushTreeFork(workInProgress2, 1), pushTreeId(workInProgress2, 1, 0));
  }
  function popTreeContext(workInProgress2) {
    for (; workInProgress2 === treeForkProvider; )
      treeForkProvider = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null, treeForkCount = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null;
    for (; workInProgress2 === treeContextProvider; )
      treeContextProvider = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextOverflow = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextId = idStack[--idStackIndex], idStack[idStackIndex] = null;
  }
  function restoreSuspendedTreeContext(workInProgress2, suspendedContext) {
    idStack[idStackIndex++] = treeContextId;
    idStack[idStackIndex++] = treeContextOverflow;
    idStack[idStackIndex++] = treeContextProvider;
    treeContextId = suspendedContext.id;
    treeContextOverflow = suspendedContext.overflow;
    treeContextProvider = workInProgress2;
  }
  var hydrationParentFiber = null, nextHydratableInstance = null, isHydrating = false, hydrationErrors = null, rootOrSingletonContext = false, HydrationMismatchException = Error(formatProdErrorMessage(519));
  function throwOnHydrationMismatch(fiber) {
    var error = Error(formatProdErrorMessage(418, 1 < arguments.length && void 0 !== arguments[1] && arguments[1] ? "text" : "HTML", ""));
    queueHydrationError(createCapturedValueAtFiber(error, fiber));
    throw HydrationMismatchException;
  }
  function prepareToHydrateHostInstance(fiber) {
    var instance = fiber.stateNode, type = fiber.type, props = fiber.memoizedProps;
    instance[internalInstanceKey] = fiber;
    instance[internalPropsKey] = props;
    switch (type) {
      case "dialog":
        listenToNonDelegatedEvent("cancel", instance);
        listenToNonDelegatedEvent("close", instance);
        break;
      case "iframe":
      case "object":
      case "embed":
        listenToNonDelegatedEvent("load", instance);
        break;
      case "video":
      case "audio":
        for (type = 0; type < mediaEventTypes.length; type++)
          listenToNonDelegatedEvent(mediaEventTypes[type], instance);
        break;
      case "source":
        listenToNonDelegatedEvent("error", instance);
        break;
      case "img":
      case "image":
      case "link":
        listenToNonDelegatedEvent("error", instance);
        listenToNonDelegatedEvent("load", instance);
        break;
      case "details":
        listenToNonDelegatedEvent("toggle", instance);
        break;
      case "input":
        listenToNonDelegatedEvent("invalid", instance);
        initInput(instance, props.value, props.defaultValue, props.checked, props.defaultChecked, props.type, props.name, true);
        break;
      case "select":
        listenToNonDelegatedEvent("invalid", instance);
        break;
      case "textarea":
        listenToNonDelegatedEvent("invalid", instance), initTextarea(instance, props.value, props.defaultValue, props.children);
    }
    type = props.children;
    "string" !== typeof type && "number" !== typeof type && "bigint" !== typeof type || instance.textContent === "" + type || true === props.suppressHydrationWarning || checkForUnmatchedText(instance.textContent, type) ? (null != props.popover && (listenToNonDelegatedEvent("beforetoggle", instance), listenToNonDelegatedEvent("toggle", instance)), null != props.onScroll && listenToNonDelegatedEvent("scroll", instance), null != props.onScrollEnd && listenToNonDelegatedEvent("scrollend", instance), null != props.onClick && (instance.onclick = noop$1), instance = true) : instance = false;
    instance || throwOnHydrationMismatch(fiber, true);
  }
  function popToNextHostParent(fiber) {
    for (hydrationParentFiber = fiber.return; hydrationParentFiber; )
      switch (hydrationParentFiber.tag) {
        case 5:
        case 31:
        case 13:
          rootOrSingletonContext = false;
          return;
        case 27:
        case 3:
          rootOrSingletonContext = true;
          return;
        default:
          hydrationParentFiber = hydrationParentFiber.return;
      }
  }
  function popHydrationState(fiber) {
    if (fiber !== hydrationParentFiber)
      return false;
    if (!isHydrating)
      return popToNextHostParent(fiber), isHydrating = true, false;
    var tag = fiber.tag, JSCompiler_temp;
    if (JSCompiler_temp = 3 !== tag && 27 !== tag) {
      if (JSCompiler_temp = 5 === tag)
        JSCompiler_temp = fiber.type, JSCompiler_temp = !("form" !== JSCompiler_temp && "button" !== JSCompiler_temp) || shouldSetTextContent(fiber.type, fiber.memoizedProps);
      JSCompiler_temp = !JSCompiler_temp;
    }
    JSCompiler_temp && nextHydratableInstance && throwOnHydrationMismatch(fiber);
    popToNextHostParent(fiber);
    if (13 === tag) {
      fiber = fiber.memoizedState;
      fiber = null !== fiber ? fiber.dehydrated : null;
      if (!fiber)
        throw Error(formatProdErrorMessage(317));
      nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
    } else if (31 === tag) {
      fiber = fiber.memoizedState;
      fiber = null !== fiber ? fiber.dehydrated : null;
      if (!fiber)
        throw Error(formatProdErrorMessage(317));
      nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
    } else
      27 === tag ? (tag = nextHydratableInstance, isSingletonScope(fiber.type) ? (fiber = previousHydratableOnEnteringScopedSingleton, previousHydratableOnEnteringScopedSingleton = null, nextHydratableInstance = fiber) : nextHydratableInstance = tag) : nextHydratableInstance = hydrationParentFiber ? getNextHydratable(fiber.stateNode.nextSibling) : null;
    return true;
  }
  function resetHydrationState() {
    nextHydratableInstance = hydrationParentFiber = null;
    isHydrating = false;
  }
  function upgradeHydrationErrorsToRecoverable() {
    var queuedErrors = hydrationErrors;
    null !== queuedErrors && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = queuedErrors : workInProgressRootRecoverableErrors.push.apply(workInProgressRootRecoverableErrors, queuedErrors), hydrationErrors = null);
    return queuedErrors;
  }
  function queueHydrationError(error) {
    null === hydrationErrors ? hydrationErrors = [error] : hydrationErrors.push(error);
  }
  var valueCursor = createCursor(null), currentlyRenderingFiber$1 = null, lastContextDependency = null;
  function pushProvider(providerFiber, context, nextValue) {
    push(valueCursor, context._currentValue);
    context._currentValue = nextValue;
  }
  function popProvider(context) {
    context._currentValue = valueCursor.current;
    pop(valueCursor);
  }
  function scheduleContextWorkOnParentPath(parent, renderLanes2, propagationRoot) {
    for (; null !== parent; ) {
      var alternate = parent.alternate;
      (parent.childLanes & renderLanes2) !== renderLanes2 ? (parent.childLanes |= renderLanes2, null !== alternate && (alternate.childLanes |= renderLanes2)) : null !== alternate && (alternate.childLanes & renderLanes2) !== renderLanes2 && (alternate.childLanes |= renderLanes2);
      if (parent === propagationRoot)
        break;
      parent = parent.return;
    }
  }
  function propagateContextChanges(workInProgress2, contexts, renderLanes2, forcePropagateEntireTree) {
    var fiber = workInProgress2.child;
    null !== fiber && (fiber.return = workInProgress2);
    for (; null !== fiber; ) {
      var list = fiber.dependencies;
      if (null !== list) {
        var nextFiber = fiber.child;
        list = list.firstContext;
        a: for (; null !== list; ) {
          var dependency = list;
          list = fiber;
          for (var i = 0; i < contexts.length; i++)
            if (dependency.context === contexts[i]) {
              list.lanes |= renderLanes2;
              dependency = list.alternate;
              null !== dependency && (dependency.lanes |= renderLanes2);
              scheduleContextWorkOnParentPath(list.return, renderLanes2, workInProgress2);
              forcePropagateEntireTree || (nextFiber = null);
              break a;
            }
          list = dependency.next;
        }
      } else if (18 === fiber.tag) {
        nextFiber = fiber.return;
        if (null === nextFiber)
          throw Error(formatProdErrorMessage(341));
        nextFiber.lanes |= renderLanes2;
        list = nextFiber.alternate;
        null !== list && (list.lanes |= renderLanes2);
        scheduleContextWorkOnParentPath(nextFiber, renderLanes2, workInProgress2);
        nextFiber = null;
      } else
        13 === fiber.tag && null !== fiber.memoizedState && null === fiber.memoizedState.dehydrated ? (fiber.lanes |= renderLanes2, nextFiber = fiber.alternate, null !== nextFiber && (nextFiber.lanes |= renderLanes2), scheduleContextWorkOnParentPath(fiber.return, renderLanes2, workInProgress2), nextFiber = fiber.child, nextFiber = null !== nextFiber ? nextFiber.sibling : null) : nextFiber = fiber.child;
      if (null !== nextFiber)
        nextFiber.return = fiber;
      else
        for (nextFiber = fiber; null !== nextFiber; ) {
          if (nextFiber === workInProgress2) {
            nextFiber = null;
            break;
          }
          fiber = nextFiber.sibling;
          if (null !== fiber) {
            fiber.return = nextFiber.return;
            nextFiber = fiber;
            break;
          }
          nextFiber = nextFiber.return;
        }
      fiber = nextFiber;
    }
  }
  function propagateParentContextChanges(current, workInProgress2, renderLanes2, forcePropagateEntireTree) {
    current = null;
    for (var parent = workInProgress2, isInsidePropagationBailout = false; null !== parent; ) {
      if (!isInsidePropagationBailout) {
        if (0 !== (parent.flags & 524288))
          isInsidePropagationBailout = true;
        else if (0 !== (parent.flags & 262144))
          break;
      }
      if (10 === parent.tag) {
        var currentParent = parent.alternate;
        if (null === currentParent)
          throw Error(formatProdErrorMessage(387));
        currentParent = currentParent.memoizedProps;
        if (null !== currentParent) {
          var context = parent.type;
          objectIs(parent.pendingProps.value, currentParent.value) || (null !== current ? current.push(context) : current = [context]);
        }
      } else if (parent === hostTransitionProviderCursor.current) {
        currentParent = parent.alternate;
        if (null === currentParent)
          throw Error(formatProdErrorMessage(387));
        currentParent.memoizedState.memoizedState !== parent.memoizedState.memoizedState && (null !== current ? current.push(HostTransitionContext) : current = [HostTransitionContext]);
      }
      parent = parent.return;
    }
    null !== current && propagateContextChanges(workInProgress2, current, renderLanes2, forcePropagateEntireTree);
    workInProgress2.flags |= 262144;
    return null !== current;
  }
  function checkIfContextChanged(currentDependencies) {
    for (currentDependencies = currentDependencies.firstContext; null !== currentDependencies; ) {
      if (!objectIs(currentDependencies.context._currentValue, currentDependencies.memoizedValue))
        return true;
      currentDependencies = currentDependencies.next;
    }
    return false;
  }
  function prepareToReadContext(workInProgress2) {
    currentlyRenderingFiber$1 = workInProgress2;
    lastContextDependency = null;
    workInProgress2 = workInProgress2.dependencies;
    null !== workInProgress2 && (workInProgress2.firstContext = null);
  }
  function readContext(context) {
    return readContextForConsumer(currentlyRenderingFiber$1, context);
  }
  function readContextDuringReconciliation(consumer, context) {
    null === currentlyRenderingFiber$1 && prepareToReadContext(consumer);
    return readContextForConsumer(consumer, context);
  }
  function readContextForConsumer(consumer, context) {
    var value = context._currentValue;
    context = { context, memoizedValue: value, next: null };
    if (null === lastContextDependency) {
      if (null === consumer)
        throw Error(formatProdErrorMessage(308));
      lastContextDependency = context;
      consumer.dependencies = { lanes: 0, firstContext: context };
      consumer.flags |= 524288;
    } else
      lastContextDependency = lastContextDependency.next = context;
    return value;
  }
  var AbortControllerLocal = "undefined" !== typeof AbortController ? AbortController : function() {
    var listeners = [], signal = this.signal = {
      aborted: false,
      addEventListener: function(type, listener) {
        listeners.push(listener);
      }
    };
    this.abort = function() {
      signal.aborted = true;
      listeners.forEach(function(listener) {
        return listener();
      });
    };
  }, scheduleCallback$2 = Scheduler.unstable_scheduleCallback, NormalPriority = Scheduler.unstable_NormalPriority, CacheContext = {
    $$typeof: REACT_CONTEXT_TYPE,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function createCache() {
    return {
      controller: new AbortControllerLocal(),
      data:  new Map(),
      refCount: 0
    };
  }
  function releaseCache(cache) {
    cache.refCount--;
    0 === cache.refCount && scheduleCallback$2(NormalPriority, function() {
      cache.controller.abort();
    });
  }
  function queueTransitionTypes(root2, transitionTypes) {
    if (0 !== (root2.pendingLanes & 4194048)) {
      var queued = root2.transitionTypes;
      null === queued && (queued = root2.transitionTypes = []);
      for (root2 = 0; root2 < transitionTypes.length; root2++) {
        var transitionType = transitionTypes[root2];
        -1 === queued.indexOf(transitionType) && queued.push(transitionType);
      }
    }
  }
  var entangledTransitionTypes = null;
  function claimQueuedTransitionTypes(root2) {
    var claimed = root2.transitionTypes;
    root2.transitionTypes = null;
    return claimed;
  }
  var currentEntangledListeners = null, currentEntangledPendingCount = 0, currentEntangledLane = 0, currentEntangledActionThenable = null;
  function entangleAsyncAction(transition, thenable) {
    if (null === currentEntangledListeners) {
      var entangledListeners = currentEntangledListeners = [];
      currentEntangledPendingCount = 0;
      currentEntangledLane = requestTransitionLane();
      currentEntangledActionThenable = {
        status: "pending",
        value: void 0,
        then: function(resolve) {
          entangledListeners.push(resolve);
        }
      };
    }
    currentEntangledPendingCount++;
    thenable.then(pingEngtangledActionScope, pingEngtangledActionScope);
    return thenable;
  }
  function pingEngtangledActionScope() {
    if (0 === --currentEntangledPendingCount && (entangledTransitionTypes = null, null !== currentEntangledListeners)) {
      null !== currentEntangledActionThenable && (currentEntangledActionThenable.status = "fulfilled");
      var listeners = currentEntangledListeners;
      currentEntangledListeners = null;
      currentEntangledLane = 0;
      currentEntangledActionThenable = null;
      for (var i = 0; i < listeners.length; i++)
        (0, listeners[i])();
    }
  }
  function chainThenableValue(thenable, result) {
    var listeners = [], thenableWithOverride = {
      status: "pending",
      value: null,
      reason: null,
      then: function(resolve) {
        listeners.push(resolve);
      }
    };
    thenable.then(function() {
      thenableWithOverride.status = "fulfilled";
      thenableWithOverride.value = result;
      for (var i = 0; i < listeners.length; i++)
        (0, listeners[i])(result);
    }, function(error) {
      thenableWithOverride.status = "rejected";
      thenableWithOverride.reason = error;
      for (error = 0; error < listeners.length; error++)
        (0, listeners[error])(void 0);
    });
    return thenableWithOverride;
  }
  var prevOnStartTransitionFinish = ReactSharedInternals.S;
  ReactSharedInternals.S = function(transition, returnValue) {
    globalMostRecentTransitionTime = now();
    "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && entangleAsyncAction(transition, returnValue);
    if (null !== entangledTransitionTypes)
      for (var root$28 = firstScheduledRoot; null !== root$28; )
        queueTransitionTypes(root$28, entangledTransitionTypes), root$28 = root$28.next;
    root$28 = transition.types;
    if (null !== root$28) {
      for (var root$29 = firstScheduledRoot; null !== root$29; )
        queueTransitionTypes(root$29, root$28), root$29 = root$29.next;
      if (0 !== currentEntangledLane) {
        root$29 = entangledTransitionTypes;
        null === root$29 && (root$29 = entangledTransitionTypes = []);
        for (var i = 0; i < root$28.length; i++) {
          var transitionType = root$28[i];
          -1 === root$29.indexOf(transitionType) && root$29.push(transitionType);
        }
      }
    }
    null !== prevOnStartTransitionFinish && prevOnStartTransitionFinish(transition, returnValue);
  };
  var resumedCache = createCursor(null);
  function peekCacheFromPool() {
    var cacheResumedFromPreviousRender = resumedCache.current;
    return null !== cacheResumedFromPreviousRender ? cacheResumedFromPreviousRender : workInProgressRoot.pooledCache;
  }
  function pushTransition(offscreenWorkInProgress, prevCachePool) {
    null === prevCachePool ? push(resumedCache, resumedCache.current) : push(resumedCache, prevCachePool.pool);
  }
  function getSuspendedCache() {
    var cacheFromPool = peekCacheFromPool();
    return null === cacheFromPool ? null : { parent: CacheContext._currentValue, pool: cacheFromPool };
  }
  var SuspenseException = Error(formatProdErrorMessage(460)), SuspenseyCommitException = Error(formatProdErrorMessage(474)), SuspenseActionException = Error(formatProdErrorMessage(542)), noopSuspenseyCommitThenable = { then: function() {
  } };
  function isThenableResolved(thenable) {
    thenable = thenable.status;
    return "fulfilled" === thenable || "rejected" === thenable;
  }
  function trackUsedThenable(thenableState2, thenable, index2) {
    index2 = thenableState2[index2];
    void 0 === index2 ? thenableState2.push(thenable) : index2 !== thenable && (thenable.then(noop$1, noop$1), thenable = index2);
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        thenableState2 = thenable.reason;
        checkIfUseWrappedInAsyncCatch(thenableState2);
        if (void 0 === thenableState2 && !("reason" in thenable))
          throw Error(formatProdErrorMessage(600));
        throw thenableState2;
      default:
        if ("string" === typeof thenable.status)
          thenable.then(noop$1, noop$1);
        else {
          thenableState2 = workInProgressRoot;
          if (null !== thenableState2 && 100 < thenableState2.shellSuspendCounter)
            throw Error(formatProdErrorMessage(482));
          thenableState2 = thenable;
          thenableState2.status = "pending";
          thenableState2.then(function(fulfilledValue) {
            if ("pending" === thenable.status) {
              var fulfilledThenable = thenable;
              fulfilledThenable.status = "fulfilled";
              fulfilledThenable.value = fulfilledValue;
            }
          }, function(error) {
            if ("pending" === thenable.status) {
              var rejectedThenable = thenable;
              rejectedThenable.status = "rejected";
              rejectedThenable.reason = error;
            }
          });
        }
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenableState2 = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState2), thenableState2;
        }
        suspendedThenable = thenable;
        throw SuspenseException;
    }
  }
  function resolveLazy(lazyType) {
    try {
      var init = lazyType._init;
      return init(lazyType._payload);
    } catch (x) {
      if (null !== x && "object" === typeof x && "function" === typeof x.then)
        throw suspendedThenable = x, SuspenseException;
      throw x;
    }
  }
  var suspendedThenable = null;
  function getSuspendedThenable() {
    if (null === suspendedThenable)
      throw Error(formatProdErrorMessage(459));
    var thenable = suspendedThenable;
    suspendedThenable = null;
    return thenable;
  }
  function checkIfUseWrappedInAsyncCatch(rejectedReason) {
    if (rejectedReason === SuspenseException || rejectedReason === SuspenseActionException)
      throw Error(formatProdErrorMessage(483));
  }
  var thenableState$1 = null, thenableIndexCounter$1 = 0;
  function unwrapThenable(thenable) {
    var index2 = thenableIndexCounter$1;
    thenableIndexCounter$1 += 1;
    null === thenableState$1 && (thenableState$1 = []);
    return trackUsedThenable(thenableState$1, thenable, index2);
  }
  function coerceRef(workInProgress2, element) {
    element = element.props.ref;
    workInProgress2.ref = void 0 !== element ? element : null;
  }
  function throwOnInvalidObjectTypeImpl(returnFiber, newChild) {
    if (newChild.$$typeof === REACT_LEGACY_ELEMENT_TYPE)
      throw Error(formatProdErrorMessage(525));
    returnFiber = Object.prototype.toString.call(newChild);
    throw Error(formatProdErrorMessage(31, "[object Object]" === returnFiber ? "object with keys {" + Object.keys(newChild).join(", ") + "}" : returnFiber));
  }
  function createChildReconciler(shouldTrackSideEffects) {
    function deleteChild(returnFiber, childToDelete) {
      if (shouldTrackSideEffects) {
        var deletions = returnFiber.deletions;
        null === deletions ? (returnFiber.deletions = [childToDelete], returnFiber.flags |= 16) : deletions.push(childToDelete);
      }
    }
    function deleteRemainingChildren(returnFiber, currentFirstChild) {
      if (!shouldTrackSideEffects)
        return null;
      for (; null !== currentFirstChild; )
        deleteChild(returnFiber, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
      return null;
    }
    function mapRemainingChildren(currentFirstChild) {
      for (var existingChildren =  new Map(); null !== currentFirstChild; )
        null === currentFirstChild.key ? existingChildren.set(currentFirstChild.index, currentFirstChild) : existingChildren.set(currentFirstChild.key, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
      return existingChildren;
    }
    function useFiber(fiber, pendingProps) {
      fiber = createWorkInProgress(fiber, pendingProps);
      fiber.index = 0;
      fiber.sibling = null;
      return fiber;
    }
    function placeChild(newFiber, lastPlacedIndex, newIndex) {
      newFiber.index = newIndex;
      if (!shouldTrackSideEffects)
        return newFiber.flags |= 1048576, lastPlacedIndex;
      newIndex = newFiber.alternate;
      if (null !== newIndex)
        return newIndex = newIndex.index, newIndex < lastPlacedIndex ? (newFiber.flags |= 2, lastPlacedIndex) : newIndex;
      newFiber.flags |= 134217730;
      return lastPlacedIndex;
    }
    function placeSingleChild(newFiber) {
      shouldTrackSideEffects && null === newFiber.alternate && (newFiber.flags |= 134217730);
      return newFiber;
    }
    function updateTextNode(returnFiber, current, textContent, lanes) {
      if (null === current || 6 !== current.tag)
        return current = createFiberFromText(textContent, returnFiber.mode, lanes), current.return = returnFiber, current;
      current = useFiber(current, textContent);
      current.return = returnFiber;
      return current;
    }
    function updateElement(returnFiber, current, element, lanes) {
      var elementType = element.type;
      if (elementType === REACT_FRAGMENT_TYPE)
        return returnFiber = updateFragment(returnFiber, current, element.props.children, lanes, element.key), coerceRef(returnFiber, element), returnFiber;
      if (null !== current && (current.elementType === elementType || "object" === typeof elementType && null !== elementType && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === current.type))
        return current = useFiber(current, element.props), coerceRef(current, element), current.return = returnFiber, current;
      current = createFiberFromTypeAndProps(element.type, element.key, element.props, null, returnFiber.mode, lanes);
      coerceRef(current, element);
      current.return = returnFiber;
      return current;
    }
    function updatePortal(returnFiber, current, portal, lanes) {
      if (null === current || 4 !== current.tag || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation)
        return current = createFiberFromPortal(portal, returnFiber.mode, lanes), current.return = returnFiber, current;
      current = useFiber(current, portal.children || []);
      current.return = returnFiber;
      return current;
    }
    function updateFragment(returnFiber, current, fragment, lanes, key) {
      if (null === current || 7 !== current.tag)
        return current = createFiberFromFragment(fragment, returnFiber.mode, lanes, key), current.return = returnFiber, current;
      current = useFiber(current, fragment);
      current.return = returnFiber;
      return current;
    }
    function createChild(returnFiber, newChild, lanes) {
      if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
        return newChild = createFiberFromText("" + newChild, returnFiber.mode, lanes), newChild.return = returnFiber, newChild;
      if ("object" === typeof newChild && null !== newChild) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            return lanes = createFiberFromTypeAndProps(newChild.type, newChild.key, newChild.props, null, returnFiber.mode, lanes), coerceRef(lanes, newChild), lanes.return = returnFiber, lanes;
          case REACT_PORTAL_TYPE:
            return newChild = createFiberFromPortal(newChild, returnFiber.mode, lanes), newChild.return = returnFiber, newChild;
          case REACT_LAZY_TYPE:
            return newChild = resolveLazy(newChild), createChild(returnFiber, newChild, lanes);
        }
        if (isArrayImpl(newChild) || getIteratorFn(newChild))
          return newChild = createFiberFromFragment(newChild, returnFiber.mode, lanes, null), newChild.return = returnFiber, newChild;
        if ("function" === typeof newChild.then)
          return createChild(returnFiber, unwrapThenable(newChild), lanes);
        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
          return createChild(returnFiber, readContextDuringReconciliation(returnFiber, newChild), lanes);
        throwOnInvalidObjectTypeImpl(returnFiber, newChild);
      }
      return null;
    }
    function updateSlot(returnFiber, oldFiber, newChild, lanes) {
      var key = null !== oldFiber ? oldFiber.key : null;
      if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
        return null !== key ? null : updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
      if ("object" === typeof newChild && null !== newChild) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            return newChild.key === key ? updateElement(returnFiber, oldFiber, newChild, lanes) : null;
          case REACT_PORTAL_TYPE:
            return newChild.key === key ? updatePortal(returnFiber, oldFiber, newChild, lanes) : null;
          case REACT_LAZY_TYPE:
            return newChild = resolveLazy(newChild), updateSlot(returnFiber, oldFiber, newChild, lanes);
        }
        if (isArrayImpl(newChild) || getIteratorFn(newChild))
          return null !== key ? null : updateFragment(returnFiber, oldFiber, newChild, lanes, null);
        if ("function" === typeof newChild.then)
          return updateSlot(returnFiber, oldFiber, unwrapThenable(newChild), lanes);
        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
          return updateSlot(returnFiber, oldFiber, readContextDuringReconciliation(returnFiber, newChild), lanes);
        throwOnInvalidObjectTypeImpl(returnFiber, newChild);
      }
      return null;
    }
    function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
      if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
        return existingChildren = existingChildren.get(newIdx) || null, updateTextNode(returnFiber, existingChildren, "" + newChild, lanes);
      if ("object" === typeof newChild && null !== newChild) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            return existingChildren = existingChildren.get(null === newChild.key ? newIdx : newChild.key) || null, updateElement(returnFiber, existingChildren, newChild, lanes);
          case REACT_PORTAL_TYPE:
            return existingChildren = existingChildren.get(null === newChild.key ? newIdx : newChild.key) || null, updatePortal(returnFiber, existingChildren, newChild, lanes);
          case REACT_LAZY_TYPE:
            return newChild = resolveLazy(newChild), updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes);
        }
        if (isArrayImpl(newChild) || getIteratorFn(newChild))
          return existingChildren = existingChildren.get(newIdx) || null, updateFragment(returnFiber, existingChildren, newChild, lanes, null);
        if ("function" === typeof newChild.then)
          return updateFromMap(existingChildren, returnFiber, newIdx, unwrapThenable(newChild), lanes);
        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
          return updateFromMap(existingChildren, returnFiber, newIdx, readContextDuringReconciliation(returnFiber, newChild), lanes);
        throwOnInvalidObjectTypeImpl(returnFiber, newChild);
      }
      return null;
    }
    function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
      for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null; null !== oldFiber && newIdx < newChildren.length; newIdx++) {
        oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
        var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);
        if (null === newFiber) {
          null === oldFiber && (oldFiber = nextOldFiber);
          break;
        }
        shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
        currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
        null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
        previousNewFiber = newFiber;
        oldFiber = nextOldFiber;
      }
      if (newIdx === newChildren.length)
        return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
      if (null === oldFiber) {
        for (; newIdx < newChildren.length; newIdx++)
          oldFiber = createChild(returnFiber, newChildren[newIdx], lanes), null !== oldFiber && (currentFirstChild = placeChild(oldFiber, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = oldFiber : previousNewFiber.sibling = oldFiber, previousNewFiber = oldFiber);
        isHydrating && pushTreeFork(returnFiber, newIdx);
        return resultingFirstChild;
      }
      for (oldFiber = mapRemainingChildren(oldFiber); newIdx < newChildren.length; newIdx++)
        nextOldFiber = updateFromMap(oldFiber, returnFiber, newIdx, newChildren[newIdx], lanes), null !== nextOldFiber && (shouldTrackSideEffects && (newFiber = nextOldFiber.alternate, null !== newFiber && oldFiber.delete(null === newFiber.key ? newIdx : newFiber.key)), currentFirstChild = placeChild(nextOldFiber, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = nextOldFiber : previousNewFiber.sibling = nextOldFiber, previousNewFiber = nextOldFiber);
      shouldTrackSideEffects && oldFiber.forEach(function(child) {
        return deleteChild(returnFiber, child);
      });
      isHydrating && pushTreeFork(returnFiber, newIdx);
      return resultingFirstChild;
    }
    function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildren, lanes) {
      if (null == newChildren)
        throw Error(formatProdErrorMessage(151));
      for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null, step = newChildren.next(); null !== oldFiber && !step.done; newIdx++, step = newChildren.next()) {
        oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
        var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
        if (null === newFiber) {
          null === oldFiber && (oldFiber = nextOldFiber);
          break;
        }
        shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
        currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
        null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
        previousNewFiber = newFiber;
        oldFiber = nextOldFiber;
      }
      if (step.done)
        return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
      if (null === oldFiber) {
        for (; !step.done; newIdx++, step = newChildren.next())
          step = createChild(returnFiber, step.value, lanes), null !== step && (currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
        isHydrating && pushTreeFork(returnFiber, newIdx);
        return resultingFirstChild;
      }
      for (oldFiber = mapRemainingChildren(oldFiber); !step.done; newIdx++, step = newChildren.next())
        step = updateFromMap(oldFiber, returnFiber, newIdx, step.value, lanes), null !== step && (shouldTrackSideEffects && (nextOldFiber = step.alternate, null !== nextOldFiber && oldFiber.delete(null === nextOldFiber.key ? newIdx : nextOldFiber.key)), currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
      shouldTrackSideEffects && oldFiber.forEach(function(child) {
        return deleteChild(returnFiber, child);
      });
      isHydrating && pushTreeFork(returnFiber, newIdx);
      return resultingFirstChild;
    }
    function reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes) {
      "object" === typeof newChild && null !== newChild && newChild.type === REACT_FRAGMENT_TYPE && null === newChild.key && void 0 === newChild.props.ref && (newChild = newChild.props.children);
      if ("object" === typeof newChild && null !== newChild) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            a: {
              for (var key = newChild.key; null !== currentFirstChild; ) {
                if (currentFirstChild.key === key) {
                  key = newChild.type;
                  if (key === REACT_FRAGMENT_TYPE) {
                    if (7 === currentFirstChild.tag) {
                      deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
                      lanes = useFiber(currentFirstChild, newChild.props.children);
                      coerceRef(lanes, newChild);
                      lanes.return = returnFiber;
                      returnFiber = lanes;
                      break a;
                    }
                  } else if (currentFirstChild.elementType === key || "object" === typeof key && null !== key && key.$$typeof === REACT_LAZY_TYPE && resolveLazy(key) === currentFirstChild.type) {
                    deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
                    lanes = useFiber(currentFirstChild, newChild.props);
                    coerceRef(lanes, newChild);
                    lanes.return = returnFiber;
                    returnFiber = lanes;
                    break a;
                  }
                  deleteRemainingChildren(returnFiber, currentFirstChild);
                  break;
                } else
                  deleteChild(returnFiber, currentFirstChild);
                currentFirstChild = currentFirstChild.sibling;
              }
              newChild.type === REACT_FRAGMENT_TYPE ? (lanes = createFiberFromFragment(newChild.props.children, returnFiber.mode, lanes, newChild.key), coerceRef(lanes, newChild), lanes.return = returnFiber, returnFiber = lanes) : (lanes = createFiberFromTypeAndProps(newChild.type, newChild.key, newChild.props, null, returnFiber.mode, lanes), coerceRef(lanes, newChild), lanes.return = returnFiber, returnFiber = lanes);
            }
            return placeSingleChild(returnFiber);
          case REACT_PORTAL_TYPE:
            a: {
              for (key = newChild.key; null !== currentFirstChild; ) {
                if (currentFirstChild.key === key)
                  if (4 === currentFirstChild.tag && currentFirstChild.stateNode.containerInfo === newChild.containerInfo && currentFirstChild.stateNode.implementation === newChild.implementation) {
                    deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
                    lanes = useFiber(currentFirstChild, newChild.children || []);
                    lanes.return = returnFiber;
                    returnFiber = lanes;
                    break a;
                  } else {
                    deleteRemainingChildren(returnFiber, currentFirstChild);
                    break;
                  }
                else
                  deleteChild(returnFiber, currentFirstChild);
                currentFirstChild = currentFirstChild.sibling;
              }
              lanes = createFiberFromPortal(newChild, returnFiber.mode, lanes);
              lanes.return = returnFiber;
              returnFiber = lanes;
            }
            return placeSingleChild(returnFiber);
          case REACT_LAZY_TYPE:
            return newChild = resolveLazy(newChild), reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes);
        }
        if (isArrayImpl(newChild))
          return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
        if (getIteratorFn(newChild)) {
          key = getIteratorFn(newChild);
          if ("function" !== typeof key)
            throw Error(formatProdErrorMessage(150));
          newChild = key.call(newChild);
          return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, lanes);
        }
        if ("function" === typeof newChild.then)
          return reconcileChildFibersImpl(returnFiber, currentFirstChild, unwrapThenable(newChild), lanes);
        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
          return reconcileChildFibersImpl(returnFiber, currentFirstChild, readContextDuringReconciliation(returnFiber, newChild), lanes);
        throwOnInvalidObjectTypeImpl(returnFiber, newChild);
      }
      return "string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild ? (newChild = "" + newChild, null !== currentFirstChild && 6 === currentFirstChild.tag ? (deleteRemainingChildren(returnFiber, currentFirstChild.sibling), lanes = useFiber(currentFirstChild, newChild), lanes.return = returnFiber, returnFiber = lanes) : (deleteRemainingChildren(returnFiber, currentFirstChild), lanes = createFiberFromText(newChild, returnFiber.mode, lanes), lanes.return = returnFiber, returnFiber = lanes), placeSingleChild(returnFiber)) : deleteRemainingChildren(returnFiber, currentFirstChild);
    }
    return function(returnFiber, currentFirstChild, newChild, lanes) {
      try {
        thenableIndexCounter$1 = 0;
        var firstChildFiber = reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes);
        thenableState$1 = null;
        return firstChildFiber;
      } catch (x) {
        if (x === SuspenseException || x === SuspenseActionException)
          throw x;
        var fiber = createFiberImplClass(29, x, null, returnFiber.mode);
        fiber.lanes = lanes;
        fiber.return = returnFiber;
        return fiber;
      } finally {
      }
    };
  }
  var reconcileChildFibers = createChildReconciler(true), mountChildFibers = createChildReconciler(false), hasForceUpdate = false;
  function initializeUpdateQueue(fiber) {
    fiber.updateQueue = {
      baseState: fiber.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function cloneUpdateQueue(current, workInProgress2) {
    current = current.updateQueue;
    workInProgress2.updateQueue === current && (workInProgress2.updateQueue = {
      baseState: current.baseState,
      firstBaseUpdate: current.firstBaseUpdate,
      lastBaseUpdate: current.lastBaseUpdate,
      shared: current.shared,
      callbacks: null
    });
  }
  function createUpdate(lane) {
    return { lane, tag: 0, payload: null, callback: null, next: null };
  }
  function enqueueUpdate(fiber, update, lane) {
    var updateQueue = fiber.updateQueue;
    if (null === updateQueue)
      return null;
    updateQueue = updateQueue.shared;
    if (0 !== (executionContext & 2)) {
      var pending = updateQueue.pending;
      null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
      updateQueue.pending = update;
      update = getRootForUpdatedFiber(fiber);
      markUpdateLaneFromFiberToRoot(fiber, null, lane);
      return update;
    }
    enqueueUpdate$1(fiber, updateQueue, update, lane);
    return getRootForUpdatedFiber(fiber);
  }
  function entangleTransitions(root2, fiber, lane) {
    fiber = fiber.updateQueue;
    if (null !== fiber && (fiber = fiber.shared, 0 !== (lane & 4194048))) {
      var queueLanes = fiber.lanes;
      queueLanes &= root2.pendingLanes;
      lane |= queueLanes;
      fiber.lanes = lane;
      markRootEntangled(root2, lane);
    }
  }
  function enqueueCapturedUpdate(workInProgress2, capturedUpdate) {
    var queue = workInProgress2.updateQueue, current = workInProgress2.alternate;
    if (null !== current && (current = current.updateQueue, queue === current)) {
      var newFirst = null, newLast = null;
      queue = queue.firstBaseUpdate;
      if (null !== queue) {
        do {
          var clone = {
            lane: queue.lane,
            tag: queue.tag,
            payload: queue.payload,
            callback: null,
            next: null
          };
          null === newLast ? newFirst = newLast = clone : newLast = newLast.next = clone;
          queue = queue.next;
        } while (null !== queue);
        null === newLast ? newFirst = newLast = capturedUpdate : newLast = newLast.next = capturedUpdate;
      } else
        newFirst = newLast = capturedUpdate;
      queue = {
        baseState: current.baseState,
        firstBaseUpdate: newFirst,
        lastBaseUpdate: newLast,
        shared: current.shared,
        callbacks: current.callbacks
      };
      workInProgress2.updateQueue = queue;
      return;
    }
    workInProgress2 = queue.lastBaseUpdate;
    null === workInProgress2 ? queue.firstBaseUpdate = capturedUpdate : workInProgress2.next = capturedUpdate;
    queue.lastBaseUpdate = capturedUpdate;
  }
  var didReadFromEntangledAsyncAction = false;
  function suspendIfUpdateReadFromEntangledAsyncAction() {
    if (didReadFromEntangledAsyncAction) {
      var entangledActionThenable = currentEntangledActionThenable;
      if (null !== entangledActionThenable)
        throw entangledActionThenable;
    }
  }
  function processUpdateQueue(workInProgress$jscomp$0, props, instance$jscomp$0, renderLanes2) {
    didReadFromEntangledAsyncAction = false;
    var queue = workInProgress$jscomp$0.updateQueue;
    hasForceUpdate = false;
    var firstBaseUpdate = queue.firstBaseUpdate, lastBaseUpdate = queue.lastBaseUpdate, pendingQueue = queue.shared.pending;
    if (null !== pendingQueue) {
      queue.shared.pending = null;
      var lastPendingUpdate = pendingQueue, firstPendingUpdate = lastPendingUpdate.next;
      lastPendingUpdate.next = null;
      null === lastBaseUpdate ? firstBaseUpdate = firstPendingUpdate : lastBaseUpdate.next = firstPendingUpdate;
      lastBaseUpdate = lastPendingUpdate;
      var current = workInProgress$jscomp$0.alternate;
      null !== current && (current = current.updateQueue, pendingQueue = current.lastBaseUpdate, pendingQueue !== lastBaseUpdate && (null === pendingQueue ? current.firstBaseUpdate = firstPendingUpdate : pendingQueue.next = firstPendingUpdate, current.lastBaseUpdate = lastPendingUpdate));
    }
    if (null !== firstBaseUpdate) {
      var newState = queue.baseState;
      lastBaseUpdate = 0;
      current = firstPendingUpdate = lastPendingUpdate = null;
      pendingQueue = firstBaseUpdate;
      do {
        var updateLane = pendingQueue.lane & -536870913, isHiddenUpdate = updateLane !== pendingQueue.lane;
        if (isHiddenUpdate ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes2 & updateLane) === updateLane) {
          0 !== updateLane && updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction = true);
          null !== current && (current = current.next = {
            lane: 0,
            tag: pendingQueue.tag,
            payload: pendingQueue.payload,
            callback: null,
            next: null
          });
          a: {
            var workInProgress2 = workInProgress$jscomp$0, update = pendingQueue;
            updateLane = props;
            var instance = instance$jscomp$0;
            switch (update.tag) {
              case 1:
                workInProgress2 = update.payload;
                if ("function" === typeof workInProgress2) {
                  newState = workInProgress2.call(instance, newState, updateLane);
                  break a;
                }
                newState = workInProgress2;
                break a;
              case 3:
                workInProgress2.flags = workInProgress2.flags & -65537 | 128;
              case 0:
                workInProgress2 = update.payload;
                updateLane = "function" === typeof workInProgress2 ? workInProgress2.call(instance, newState, updateLane) : workInProgress2;
                if (null === updateLane || void 0 === updateLane)
                  break a;
                newState = assign({}, newState, updateLane);
                break a;
              case 2:
                hasForceUpdate = true;
            }
          }
          updateLane = pendingQueue.callback;
          null !== updateLane && (workInProgress$jscomp$0.flags |= 64, isHiddenUpdate && (workInProgress$jscomp$0.flags |= 8192), isHiddenUpdate = queue.callbacks, null === isHiddenUpdate ? queue.callbacks = [updateLane] : isHiddenUpdate.push(updateLane));
        } else
          isHiddenUpdate = {
            lane: updateLane,
            tag: pendingQueue.tag,
            payload: pendingQueue.payload,
            callback: pendingQueue.callback,
            next: null
          }, null === current ? (firstPendingUpdate = current = isHiddenUpdate, lastPendingUpdate = newState) : current = current.next = isHiddenUpdate, lastBaseUpdate |= updateLane;
        pendingQueue = pendingQueue.next;
        if (null === pendingQueue)
          if (pendingQueue = queue.shared.pending, null === pendingQueue)
            break;
          else
            isHiddenUpdate = pendingQueue, pendingQueue = isHiddenUpdate.next, isHiddenUpdate.next = null, queue.lastBaseUpdate = isHiddenUpdate, queue.shared.pending = null;
      } while (1);
      null === current && (lastPendingUpdate = newState);
      queue.baseState = lastPendingUpdate;
      queue.firstBaseUpdate = firstPendingUpdate;
      queue.lastBaseUpdate = current;
      null === firstBaseUpdate && (queue.shared.lanes = 0);
      workInProgressRootSkippedLanes |= lastBaseUpdate;
      workInProgress$jscomp$0.lanes = lastBaseUpdate;
      workInProgress$jscomp$0.memoizedState = newState;
    }
  }
  function callCallback(callback, context) {
    if ("function" !== typeof callback)
      throw Error(formatProdErrorMessage(191, callback));
    callback.call(context);
  }
  function commitCallbacks(updateQueue, context) {
    var callbacks = updateQueue.callbacks;
    if (null !== callbacks)
      for (updateQueue.callbacks = null, updateQueue = 0; updateQueue < callbacks.length; updateQueue++)
        callCallback(callbacks[updateQueue], context);
  }
  var currentTreeHiddenStackCursor = createCursor(null), prevEntangledRenderLanesCursor = createCursor(0);
  function pushHiddenContext(fiber, context) {
    fiber = entangledRenderLanes;
    push(prevEntangledRenderLanesCursor, fiber);
    push(currentTreeHiddenStackCursor, context);
    entangledRenderLanes = fiber | context.baseLanes;
  }
  function reuseHiddenContextOnStack() {
    push(prevEntangledRenderLanesCursor, entangledRenderLanes);
    push(currentTreeHiddenStackCursor, currentTreeHiddenStackCursor.current);
  }
  function popHiddenContext() {
    entangledRenderLanes = prevEntangledRenderLanesCursor.current;
    pop(currentTreeHiddenStackCursor);
    pop(prevEntangledRenderLanesCursor);
  }
  var suspenseHandlerStackCursor = createCursor(null), shellBoundary = null;
  function pushPrimaryTreeSuspenseHandler(handler) {
    var current = handler.alternate;
    push(suspenseStackCursor, suspenseStackCursor.current & 1);
    push(suspenseHandlerStackCursor, handler);
    null === shellBoundary && (null === current || null !== currentTreeHiddenStackCursor.current ? shellBoundary = handler : null !== current.memoizedState && (shellBoundary = handler));
  }
  function pushDehydratedActivitySuspenseHandler(fiber) {
    push(suspenseStackCursor, suspenseStackCursor.current);
    push(suspenseHandlerStackCursor, fiber);
    null === shellBoundary && (shellBoundary = fiber);
  }
  function pushOffscreenSuspenseHandler(fiber) {
    22 === fiber.tag ? (push(suspenseStackCursor, suspenseStackCursor.current), push(suspenseHandlerStackCursor, fiber), null === shellBoundary && (shellBoundary = fiber)) : reuseSuspenseHandlerOnStack();
  }
  function reuseSuspenseHandlerOnStack() {
    push(suspenseStackCursor, suspenseStackCursor.current);
    push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current);
  }
  function popSuspenseHandler(fiber) {
    pop(suspenseHandlerStackCursor);
    shellBoundary === fiber && (shellBoundary = null);
    pop(suspenseStackCursor);
  }
  var suspenseStackCursor = createCursor(0);
  function pushSuspenseListContext(fiber, newContext) {
    push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current);
    push(suspenseStackCursor, newContext);
  }
  function popSuspenseListContext(fiber) {
    pop(suspenseStackCursor);
    pop(suspenseHandlerStackCursor);
    shellBoundary === fiber && (shellBoundary = null);
  }
  function findFirstSuspended(row) {
    for (var node = row; null !== node; ) {
      if (13 === node.tag) {
        var state = node.memoizedState;
        if (null !== state && (state = state.dehydrated, null === state || isSuspenseInstancePending(state) || isSuspenseInstanceFallback(state)))
          return node;
      } else if (19 === node.tag && "independent" !== node.memoizedProps.revealOrder) {
        if (0 !== (node.flags & 128))
          return node;
      } else if (null !== node.child) {
        node.child.return = node;
        node = node.child;
        continue;
      }
      if (node === row)
        break;
      for (; null === node.sibling; ) {
        if (null === node.return || node.return === row)
          return null;
        node = node.return;
      }
      node.sibling.return = node.return;
      node = node.sibling;
    }
    return null;
  }
  var renderLanes = 0, currentlyRenderingFiber = null, currentHook = null, workInProgressHook = null, didScheduleRenderPhaseUpdate = false, didScheduleRenderPhaseUpdateDuringThisPass = false, shouldDoubleInvokeUserFnsInHooksDEV = false, localIdCounter = 0, thenableIndexCounter = 0, thenableState = null, globalClientIdCounter = 0;
  function throwInvalidHookError() {
    throw Error(formatProdErrorMessage(321));
  }
  function areHookInputsEqual(nextDeps, prevDeps) {
    if (null === prevDeps)
      return false;
    for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++)
      if (!objectIs(nextDeps[i], prevDeps[i]))
        return false;
    return true;
  }
  function renderWithHooks(current, workInProgress2, Component, props, secondArg, nextRenderLanes) {
    renderLanes = nextRenderLanes;
    currentlyRenderingFiber = workInProgress2;
    workInProgress2.memoizedState = null;
    workInProgress2.updateQueue = null;
    workInProgress2.lanes = 0;
    ReactSharedInternals.H = null === current || null === current.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
    shouldDoubleInvokeUserFnsInHooksDEV = false;
    nextRenderLanes = Component(props, secondArg);
    shouldDoubleInvokeUserFnsInHooksDEV = false;
    didScheduleRenderPhaseUpdateDuringThisPass && (nextRenderLanes = renderWithHooksAgain(workInProgress2, Component, props, secondArg));
    finishRenderingHooks(current);
    return nextRenderLanes;
  }
  function finishRenderingHooks(current) {
    ReactSharedInternals.H = ContextOnlyDispatcher;
    var didRenderTooFewHooks = null !== currentHook && null !== currentHook.next;
    renderLanes = 0;
    workInProgressHook = currentHook = currentlyRenderingFiber = null;
    didScheduleRenderPhaseUpdate = false;
    thenableIndexCounter = 0;
    thenableState = null;
    if (didRenderTooFewHooks)
      throw Error(formatProdErrorMessage(300));
    null === current || didReceiveUpdate || (current = current.dependencies, null !== current && checkIfContextChanged(current) && (didReceiveUpdate = true));
  }
  function renderWithHooksAgain(workInProgress2, Component, props, secondArg) {
    currentlyRenderingFiber = workInProgress2;
    var numberOfReRenders = 0;
    do {
      didScheduleRenderPhaseUpdateDuringThisPass && (thenableState = null);
      thenableIndexCounter = 0;
      didScheduleRenderPhaseUpdateDuringThisPass = false;
      if (25 <= numberOfReRenders)
        throw Error(formatProdErrorMessage(301));
      numberOfReRenders += 1;
      workInProgressHook = currentHook = null;
      if (null != workInProgress2.updateQueue) {
        var children = workInProgress2.updateQueue;
        children.lastEffect = null;
        children.events = null;
        children.stores = null;
        null != children.memoCache && (children.memoCache.index = 0);
      }
      ReactSharedInternals.H = HooksDispatcherOnRerender;
      children = Component(props, secondArg);
    } while (didScheduleRenderPhaseUpdateDuringThisPass);
    return children;
  }
  function TransitionAwareHostComponent() {
    var dispatcher = ReactSharedInternals.H, maybeThenable = dispatcher.useState()[0];
    maybeThenable = "function" === typeof maybeThenable.then ? useThenable(maybeThenable) : maybeThenable;
    dispatcher = dispatcher.useState()[0];
    (null !== currentHook ? currentHook.memoizedState : null) !== dispatcher && (currentlyRenderingFiber.flags |= 1024);
    return maybeThenable;
  }
  function checkDidRenderIdHook() {
    var didRenderIdHook = 0 !== localIdCounter;
    localIdCounter = 0;
    return didRenderIdHook;
  }
  function bailoutHooks(current, workInProgress2, lanes) {
    workInProgress2.updateQueue = current.updateQueue;
    workInProgress2.flags &= -2053;
    current.lanes &= ~lanes;
  }
  function resetHooksOnUnwind(workInProgress2) {
    if (didScheduleRenderPhaseUpdate) {
      for (workInProgress2 = workInProgress2.memoizedState; null !== workInProgress2; ) {
        var queue = workInProgress2.queue;
        null !== queue && (queue.pending = null);
        workInProgress2 = workInProgress2.next;
      }
      didScheduleRenderPhaseUpdate = false;
    }
    renderLanes = 0;
    workInProgressHook = currentHook = currentlyRenderingFiber = null;
    didScheduleRenderPhaseUpdateDuringThisPass = false;
    thenableIndexCounter = localIdCounter = 0;
    thenableState = null;
  }
  function mountWorkInProgressHook() {
    var hook = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = hook : workInProgressHook = workInProgressHook.next = hook;
    return workInProgressHook;
  }
  function updateWorkInProgressHook() {
    if (null === currentHook) {
      var nextCurrentHook = currentlyRenderingFiber.alternate;
      nextCurrentHook = null !== nextCurrentHook ? nextCurrentHook.memoizedState : null;
    } else
      nextCurrentHook = currentHook.next;
    var nextWorkInProgressHook = null === workInProgressHook ? currentlyRenderingFiber.memoizedState : workInProgressHook.next;
    if (null !== nextWorkInProgressHook)
      workInProgressHook = nextWorkInProgressHook, currentHook = nextCurrentHook;
    else {
      if (null === nextCurrentHook) {
        if (null === currentlyRenderingFiber.alternate)
          throw Error(formatProdErrorMessage(467));
        throw Error(formatProdErrorMessage(310));
      }
      currentHook = nextCurrentHook;
      nextCurrentHook = {
        memoizedState: currentHook.memoizedState,
        baseState: currentHook.baseState,
        baseQueue: currentHook.baseQueue,
        queue: currentHook.queue,
        next: null
      };
      null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = nextCurrentHook : workInProgressHook = workInProgressHook.next = nextCurrentHook;
    }
    return workInProgressHook;
  }
  function createFunctionComponentUpdateQueue() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function useThenable(thenable) {
    var index2 = thenableIndexCounter;
    thenableIndexCounter += 1;
    null === thenableState && (thenableState = []);
    thenable = trackUsedThenable(thenableState, thenable, index2);
    index2 = currentlyRenderingFiber;
    null === (null === workInProgressHook ? index2.memoizedState : workInProgressHook.next) && (index2 = index2.alternate, ReactSharedInternals.H = null === index2 || null === index2.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate);
    return thenable;
  }
  function use(usable) {
    if (null !== usable && "object" === typeof usable) {
      if ("function" === typeof usable.then)
        return useThenable(usable);
      if (usable.$$typeof === REACT_RECOVERABLE_TYPE)
        return;
      if (usable.$$typeof === REACT_CONTEXT_TYPE)
        return readContext(usable);
    }
    throw Error(formatProdErrorMessage(438, String(usable)));
  }
  function useMemoCache(size) {
    var memoCache = null, updateQueue = currentlyRenderingFiber.updateQueue;
    null !== updateQueue && (memoCache = updateQueue.memoCache);
    if (null == memoCache) {
      var current = currentlyRenderingFiber.alternate;
      null !== current && (current = current.updateQueue, null !== current && (current = current.memoCache, null != current && (memoCache = {
        data: current.data.map(function(array) {
          return array.slice();
        }),
        index: 0
      })));
    }
    null == memoCache && (memoCache = { data: [], index: 0 });
    null === updateQueue && (updateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = updateQueue);
    updateQueue.memoCache = memoCache;
    updateQueue = memoCache.data[memoCache.index];
    if (void 0 === updateQueue)
      for (updateQueue = memoCache.data[memoCache.index] = Array(size), current = 0; current < size; current++)
        updateQueue[current] = REACT_MEMO_CACHE_SENTINEL;
    memoCache.index++;
    return updateQueue;
  }
  function basicStateReducer(state, action) {
    return "function" === typeof action ? action(state) : action;
  }
  function updateReducer(reducer) {
    var hook = updateWorkInProgressHook();
    return updateReducerImpl(hook, currentHook, reducer);
  }
  function updateReducerImpl(hook, current, reducer) {
    var queue = hook.queue;
    if (null === queue)
      throw Error(formatProdErrorMessage(311));
    queue.lastRenderedReducer = reducer;
    var baseQueue = hook.baseQueue, pendingQueue = queue.pending;
    if (null !== pendingQueue) {
      if (null !== baseQueue) {
        var baseFirst = baseQueue.next;
        baseQueue.next = pendingQueue.next;
        pendingQueue.next = baseFirst;
      }
      current.baseQueue = baseQueue = pendingQueue;
      queue.pending = null;
    }
    pendingQueue = hook.baseState;
    if (null === baseQueue)
      hook.memoizedState = pendingQueue;
    else {
      current = baseQueue.next;
      var newBaseQueueFirst = baseFirst = null, newBaseQueueLast = null, update = current, didReadFromEntangledAsyncAction$64 = false;
      do {
        var updateLane = update.lane & -536870913;
        if (updateLane !== update.lane ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
          var revertLane = update.revertLane;
          if (0 === revertLane)
            null !== newBaseQueueLast && (newBaseQueueLast = newBaseQueueLast.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: update.action,
              hasEagerState: update.hasEagerState,
              eagerState: update.eagerState,
              next: null
            }), updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction$64 = true);
          else if ((renderLanes & revertLane) === revertLane) {
            update = update.next;
            revertLane === currentEntangledLane && (didReadFromEntangledAsyncAction$64 = true);
            continue;
          } else
            updateLane = {
              lane: 0,
              revertLane: update.revertLane,
              gesture: null,
              action: update.action,
              hasEagerState: update.hasEagerState,
              eagerState: update.eagerState,
              next: null
            }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = updateLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = updateLane, currentlyRenderingFiber.lanes |= revertLane, workInProgressRootSkippedLanes |= revertLane;
          updateLane = update.action;
          shouldDoubleInvokeUserFnsInHooksDEV && reducer(pendingQueue, updateLane);
          pendingQueue = update.hasEagerState ? update.eagerState : reducer(pendingQueue, updateLane);
        } else
          revertLane = {
            lane: updateLane,
            revertLane: update.revertLane,
            gesture: update.gesture,
            action: update.action,
            hasEagerState: update.hasEagerState,
            eagerState: update.eagerState,
            next: null
          }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = revertLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = revertLane, currentlyRenderingFiber.lanes |= updateLane, workInProgressRootSkippedLanes |= updateLane;
        update = update.next;
      } while (null !== update && update !== current);
      null === newBaseQueueLast ? baseFirst = pendingQueue : newBaseQueueLast.next = newBaseQueueFirst;
      if (!objectIs(pendingQueue, hook.memoizedState) && (didReceiveUpdate = true, didReadFromEntangledAsyncAction$64 && (reducer = currentEntangledActionThenable, null !== reducer)))
        throw reducer;
      hook.memoizedState = pendingQueue;
      hook.baseState = baseFirst;
      hook.baseQueue = newBaseQueueLast;
      queue.lastRenderedState = pendingQueue;
    }
    null === baseQueue && (queue.lanes = 0);
    return [hook.memoizedState, queue.dispatch];
  }
  function rerenderReducer(reducer) {
    var hook = updateWorkInProgressHook(), queue = hook.queue;
    if (null === queue)
      throw Error(formatProdErrorMessage(311));
    queue.lastRenderedReducer = reducer;
    var dispatch = queue.dispatch, lastRenderPhaseUpdate = queue.pending, newState = hook.memoizedState;
    if (null !== lastRenderPhaseUpdate) {
      queue.pending = null;
      var update = lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
      do
        newState = reducer(newState, update.action), update = update.next;
      while (update !== lastRenderPhaseUpdate);
      objectIs(newState, hook.memoizedState) || (didReceiveUpdate = true);
      hook.memoizedState = newState;
      null === hook.baseQueue && (hook.baseState = newState);
      queue.lastRenderedState = newState;
    }
    return [newState, dispatch];
  }
  function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
    var fiber = currentlyRenderingFiber, hook = updateWorkInProgressHook(), isHydrating$jscomp$0 = isHydrating;
    if (isHydrating$jscomp$0) {
      if (void 0 === getServerSnapshot)
        throw Error(formatProdErrorMessage(407));
      getServerSnapshot = getServerSnapshot();
    } else
      getServerSnapshot = getSnapshot();
    var snapshotChanged = !objectIs((currentHook || hook).memoizedState, getServerSnapshot);
    snapshotChanged && (hook.memoizedState = getServerSnapshot, didReceiveUpdate = true);
    hook = hook.queue;
    updateEffect(subscribeToStore.bind(null, fiber, hook, subscribe), [
      subscribe
    ]);
    subscribe = hook.getSnapshot !== getSnapshot || snapshotChanged || null !== workInProgressHook && 0 !== (workInProgressHook.memoizedState.tag & 1);
    pushSimpleEffect(subscribe ? 9 : 8, { destroy: void 0 }, updateStoreInstance.bind(null, fiber, hook, getServerSnapshot, getSnapshot), null);
    if (subscribe) {
      fiber.flags |= 2048;
      if (null === workInProgressRoot)
        throw Error(formatProdErrorMessage(349));
      isHydrating$jscomp$0 || 0 !== (renderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
    }
    return getServerSnapshot;
  }
  function pushStoreConsistencyCheck(fiber, getSnapshot, renderedSnapshot) {
    fiber.flags |= 16384;
    fiber = { getSnapshot, value: renderedSnapshot };
    getSnapshot = currentlyRenderingFiber.updateQueue;
    null === getSnapshot ? (getSnapshot = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = getSnapshot, getSnapshot.stores = [fiber]) : (renderedSnapshot = getSnapshot.stores, null === renderedSnapshot ? getSnapshot.stores = [fiber] : renderedSnapshot.push(fiber));
  }
  function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
    inst.value = nextSnapshot;
    inst.getSnapshot = getSnapshot;
    checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
  }
  function subscribeToStore(fiber, inst, subscribe) {
    return subscribe(function() {
      checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
    });
  }
  function checkIfSnapshotChanged(inst) {
    var latestGetSnapshot = inst.getSnapshot;
    inst = inst.value;
    try {
      var nextValue = latestGetSnapshot();
      return !objectIs(inst, nextValue);
    } catch (error) {
      return true;
    }
  }
  function forceStoreRerender(fiber) {
    var root2 = enqueueConcurrentRenderForLane(fiber, 2);
    null !== root2 && scheduleUpdateOnFiber(root2, fiber, 2);
  }
  function mountStateImpl(initialState) {
    var hook = mountWorkInProgressHook();
    if ("function" === typeof initialState) {
      var initialStateInitializer = initialState;
      initialState = initialStateInitializer();
      if (shouldDoubleInvokeUserFnsInHooksDEV) {
        setIsStrictModeForDevtools(true);
        try {
          initialStateInitializer();
        } finally {
          setIsStrictModeForDevtools(false);
        }
      }
    }
    hook.memoizedState = hook.baseState = initialState;
    hook.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: basicStateReducer,
      lastRenderedState: initialState
    };
    return hook;
  }
  function updateOptimisticImpl(hook, current, passthrough, reducer) {
    hook.baseState = passthrough;
    return updateReducerImpl(hook, currentHook, "function" === typeof reducer ? reducer : basicStateReducer);
  }
  function dispatchActionState(fiber, actionQueue, setPendingState, setState, payload) {
    if (isRenderPhaseUpdate(fiber))
      throw Error(formatProdErrorMessage(485));
    fiber = actionQueue.action;
    if (null !== fiber) {
      var actionNode = {
        payload,
        action: fiber,
        next: null,
        isTransition: true,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(listener) {
          actionNode.listeners.push(listener);
        }
      };
      null !== ReactSharedInternals.T ? setPendingState(true) : actionNode.isTransition = false;
      setState(actionNode);
      setPendingState = actionQueue.pending;
      null === setPendingState ? (actionNode.next = actionQueue.pending = actionNode, runActionStateAction(actionQueue, actionNode)) : (actionNode.next = setPendingState.next, actionQueue.pending = setPendingState.next = actionNode);
    }
  }
  function runActionStateAction(actionQueue, node) {
    var action = node.action, payload = node.payload, prevState = actionQueue.state;
    if (node.isTransition) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      currentTransition.types = null !== prevTransition ? prevTransition.types : null;
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = action(prevState, payload), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        handleActionReturnValue(actionQueue, node, returnValue);
      } catch (error) {
        onActionError(actionQueue, node, error);
      } finally {
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    } else
      try {
        prevTransition = action(prevState, payload), handleActionReturnValue(actionQueue, node, prevTransition);
      } catch (error$70) {
        onActionError(actionQueue, node, error$70);
      }
  }
  function handleActionReturnValue(actionQueue, node, returnValue) {
    null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then ? returnValue.then(function(nextState) {
      onActionSuccess(actionQueue, node, nextState);
    }, function(error) {
      return onActionError(actionQueue, node, error);
    }) : onActionSuccess(actionQueue, node, returnValue);
  }
  function onActionSuccess(actionQueue, actionNode, nextState) {
    actionNode.status = "fulfilled";
    actionNode.value = nextState;
    notifyActionListeners(actionNode);
    actionQueue.state = nextState;
    actionNode = actionQueue.pending;
    null !== actionNode && (nextState = actionNode.next, nextState === actionNode ? actionQueue.pending = null : (nextState = nextState.next, actionNode.next = nextState, runActionStateAction(actionQueue, nextState)));
  }
  function onActionError(actionQueue, actionNode, error) {
    var last = actionQueue.pending;
    actionQueue.pending = null;
    if (null !== last) {
      last = last.next;
      do
        actionNode.status = "rejected", actionNode.reason = error, notifyActionListeners(actionNode), actionNode = actionNode.next;
      while (actionNode !== last);
    }
    actionQueue.action = null;
  }
  function notifyActionListeners(actionNode) {
    actionNode = actionNode.listeners;
    for (var i = 0; i < actionNode.length; i++)
      (0, actionNode[i])();
  }
  function actionStateReducer(oldState, newState) {
    return newState;
  }
  function mountActionState(action, initialStateProp) {
    if (isHydrating) {
      var ssrFormState = workInProgressRoot.formState;
      if (null !== ssrFormState) {
        a: {
          var JSCompiler_inline_result = currentlyRenderingFiber;
          if (isHydrating) {
            if (nextHydratableInstance) {
              b: {
                var JSCompiler_inline_result$jscomp$0 = nextHydratableInstance;
                for (var inRootOrSingleton = rootOrSingletonContext; 8 !== JSCompiler_inline_result$jscomp$0.nodeType; ) {
                  if (!inRootOrSingleton) {
                    JSCompiler_inline_result$jscomp$0 = null;
                    break b;
                  }
                  JSCompiler_inline_result$jscomp$0 = getNextHydratable(JSCompiler_inline_result$jscomp$0.nextSibling);
                  if (null === JSCompiler_inline_result$jscomp$0) {
                    JSCompiler_inline_result$jscomp$0 = null;
                    break b;
                  }
                }
                inRootOrSingleton = JSCompiler_inline_result$jscomp$0.data;
                JSCompiler_inline_result$jscomp$0 = "F!" === inRootOrSingleton || "F" === inRootOrSingleton ? JSCompiler_inline_result$jscomp$0 : null;
              }
              if (JSCompiler_inline_result$jscomp$0) {
                nextHydratableInstance = getNextHydratable(JSCompiler_inline_result$jscomp$0.nextSibling);
                JSCompiler_inline_result = "F!" === JSCompiler_inline_result$jscomp$0.data;
                break a;
              }
            }
            throwOnHydrationMismatch(JSCompiler_inline_result);
          }
          JSCompiler_inline_result = false;
        }
        JSCompiler_inline_result && (initialStateProp = ssrFormState[0]);
      }
    }
    ssrFormState = mountWorkInProgressHook();
    ssrFormState.memoizedState = ssrFormState.baseState = initialStateProp;
    JSCompiler_inline_result = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: actionStateReducer,
      lastRenderedState: initialStateProp
    };
    ssrFormState.queue = JSCompiler_inline_result;
    ssrFormState = dispatchSetState.bind(null, currentlyRenderingFiber, JSCompiler_inline_result);
    JSCompiler_inline_result.dispatch = ssrFormState;
    JSCompiler_inline_result = mountStateImpl(false);
    inRootOrSingleton = dispatchOptimisticSetState.bind(null, currentlyRenderingFiber, false, JSCompiler_inline_result.queue);
    JSCompiler_inline_result = mountWorkInProgressHook();
    JSCompiler_inline_result$jscomp$0 = {
      state: initialStateProp,
      dispatch: null,
      action,
      pending: null
    };
    JSCompiler_inline_result.queue = JSCompiler_inline_result$jscomp$0;
    ssrFormState = dispatchActionState.bind(null, currentlyRenderingFiber, JSCompiler_inline_result$jscomp$0, inRootOrSingleton, ssrFormState);
    JSCompiler_inline_result$jscomp$0.dispatch = ssrFormState;
    JSCompiler_inline_result.memoizedState = action;
    return [initialStateProp, ssrFormState, false];
  }
  function updateActionState(action) {
    var stateHook = updateWorkInProgressHook();
    return updateActionStateImpl(stateHook, currentHook, action);
  }
  function updateActionStateImpl(stateHook, currentStateHook, action) {
    currentStateHook = updateReducerImpl(stateHook, currentStateHook, actionStateReducer)[0];
    stateHook = updateReducer(basicStateReducer)[0];
    if ("object" === typeof currentStateHook && null !== currentStateHook && "function" === typeof currentStateHook.then)
      try {
        var state = useThenable(currentStateHook);
      } catch (x) {
        if (x === SuspenseException)
          throw SuspenseActionException;
        throw x;
      }
    else
      state = currentStateHook;
    currentStateHook = updateWorkInProgressHook();
    var actionQueue = currentStateHook.queue, dispatch = actionQueue.dispatch;
    action !== currentStateHook.memoizedState && (currentlyRenderingFiber.flags |= 2048, pushSimpleEffect(9, { destroy: void 0 }, actionStateActionEffect.bind(null, actionQueue, action), null));
    return [state, dispatch, stateHook];
  }
  function actionStateActionEffect(actionQueue, action) {
    actionQueue.action = action;
  }
  function rerenderActionState(action) {
    var stateHook = updateWorkInProgressHook(), currentStateHook = currentHook;
    if (null !== currentStateHook)
      return updateActionStateImpl(stateHook, currentStateHook, action);
    updateWorkInProgressHook();
    stateHook = stateHook.memoizedState;
    currentStateHook = updateWorkInProgressHook();
    var dispatch = currentStateHook.queue.dispatch;
    currentStateHook.memoizedState = action;
    return [stateHook, dispatch, false];
  }
  function pushSimpleEffect(tag, inst, create, deps) {
    tag = { tag, create, deps, inst, next: null };
    inst = currentlyRenderingFiber.updateQueue;
    null === inst && (inst = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = inst);
    create = inst.lastEffect;
    null === create ? inst.lastEffect = tag.next = tag : (deps = create.next, create.next = tag, tag.next = deps, inst.lastEffect = tag);
    return tag;
  }
  function updateRef() {
    return updateWorkInProgressHook().memoizedState;
  }
  function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
    var hook = mountWorkInProgressHook();
    currentlyRenderingFiber.flags |= fiberFlags;
    hook.memoizedState = pushSimpleEffect(1 | hookFlags, { destroy: void 0 }, create, void 0 === deps ? null : deps);
  }
  function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
    var hook = updateWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    var inst = hook.memoizedState.inst;
    null !== currentHook && null !== deps && areHookInputsEqual(deps, currentHook.memoizedState.deps) ? hook.memoizedState = pushSimpleEffect(hookFlags, inst, create, deps) : (currentlyRenderingFiber.flags |= fiberFlags, hook.memoizedState = pushSimpleEffect(1 | hookFlags, inst, create, deps));
  }
  function mountEffect(create, deps) {
    mountEffectImpl(8390656, 8, create, deps);
  }
  function updateEffect(create, deps) {
    updateEffectImpl(2048, 8, create, deps);
  }
  function useEffectEventImpl(payload) {
    currentlyRenderingFiber.flags |= 4;
    var componentUpdateQueue = currentlyRenderingFiber.updateQueue;
    if (null === componentUpdateQueue)
      componentUpdateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = componentUpdateQueue, componentUpdateQueue.events = [payload];
    else {
      var events = componentUpdateQueue.events;
      null === events ? componentUpdateQueue.events = [payload] : events.push(payload);
    }
  }
  function updateEvent(callback) {
    var ref = updateWorkInProgressHook().memoizedState;
    useEffectEventImpl({ ref, nextImpl: callback });
    return function() {
      if (0 !== (executionContext & 2))
        throw Error(formatProdErrorMessage(440));
      return ref.impl.apply(void 0, arguments);
    };
  }
  function updateInsertionEffect(create, deps) {
    return updateEffectImpl(4, 2, create, deps);
  }
  function updateLayoutEffect(create, deps) {
    return updateEffectImpl(4, 4, create, deps);
  }
  function imperativeHandleEffect(create, ref) {
    if ("function" === typeof ref) {
      create = create();
      var refCleanup = ref(create);
      return function() {
        "function" === typeof refCleanup ? refCleanup() : ref(null);
      };
    }
    if (null !== ref && void 0 !== ref)
      return create = create(), ref.current = create, function() {
        ref.current = null;
      };
  }
  function updateImperativeHandle(ref, create, deps) {
    deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
    updateEffectImpl(4, 4, imperativeHandleEffect.bind(null, create, ref), deps);
  }
  function mountDebugValue() {
  }
  function updateCallback(callback, deps) {
    var hook = updateWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    var prevState = hook.memoizedState;
    if (null !== deps && areHookInputsEqual(deps, prevState[1]))
      return prevState[0];
    hook.memoizedState = [callback, deps];
    return callback;
  }
  function updateMemo(nextCreate, deps) {
    var hook = updateWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    var prevState = hook.memoizedState;
    if (null !== deps && areHookInputsEqual(deps, prevState[1]))
      return prevState[0];
    prevState = nextCreate();
    if (shouldDoubleInvokeUserFnsInHooksDEV) {
      setIsStrictModeForDevtools(true);
      try {
        nextCreate();
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }
    hook.memoizedState = [prevState, deps];
    return prevState;
  }
  function mountDeferredValueImpl(hook, value, initialValue) {
    if (void 0 === initialValue || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930))
      return hook.memoizedState = value;
    hook.memoizedState = initialValue;
    hook = requestDeferredLane();
    currentlyRenderingFiber.lanes |= hook;
    workInProgressRootSkippedLanes |= hook;
    return initialValue;
  }
  function updateDeferredValueImpl(hook, prevValue, value, initialValue) {
    if (objectIs(value, prevValue))
      return value;
    if (null !== currentTreeHiddenStackCursor.current)
      return hook = mountDeferredValueImpl(hook, value, initialValue), objectIs(hook, prevValue) || (didReceiveUpdate = true), hook;
    if (0 === (renderLanes & 106) || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930))
      return didReceiveUpdate = true, hook.memoizedState = value;
    hook = requestDeferredLane();
    currentlyRenderingFiber.lanes |= hook;
    workInProgressRootSkippedLanes |= hook;
    return prevValue;
  }
  function startTransition(fiber, queue, pendingState, finishedState, callback) {
    var previousPriority = ReactDOMSharedInternals.p;
    ReactDOMSharedInternals.p = 0 !== previousPriority && 8 > previousPriority ? previousPriority : 8;
    var prevTransition = ReactSharedInternals.T, currentTransition = {};
    currentTransition.types = null !== prevTransition ? prevTransition.types : null;
    ReactSharedInternals.T = currentTransition;
    dispatchOptimisticSetState(fiber, false, queue, pendingState);
    try {
      var returnValue = callback(), onStartTransitionFinish = ReactSharedInternals.S;
      null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
      if (null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then) {
        var thenableForFinishedState = chainThenableValue(returnValue, finishedState);
        dispatchSetStateInternal(fiber, queue, thenableForFinishedState, requestUpdateLane(fiber));
      } else
        dispatchSetStateInternal(fiber, queue, finishedState, requestUpdateLane(fiber));
    } catch (error) {
      dispatchSetStateInternal(fiber, queue, { then: function() {
      }, status: "rejected", reason: error }, requestUpdateLane());
    } finally {
      ReactDOMSharedInternals.p = previousPriority, null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
    }
  }
  function noop() {
  }
  function startHostTransition(formFiber, pendingState, action, formData) {
    if (5 !== formFiber.tag)
      throw Error(formatProdErrorMessage(476));
    var queue = ensureFormComponentIsStateful(formFiber).queue;
    startTransition(formFiber, queue, pendingState, sharedNotPendingObject, null === action ? noop : function() {
      requestFormReset$1(formFiber);
      return action(formData);
    });
  }
  function ensureFormComponentIsStateful(formFiber) {
    var existingStateHook = formFiber.memoizedState;
    if (null !== existingStateHook)
      return existingStateHook;
    existingStateHook = {
      memoizedState: sharedNotPendingObject,
      baseState: sharedNotPendingObject,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: sharedNotPendingObject
      },
      next: null
    };
    var initialResetState = {};
    existingStateHook.next = {
      memoizedState: initialResetState,
      baseState: initialResetState,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: initialResetState
      },
      next: null
    };
    formFiber.memoizedState = existingStateHook;
    formFiber = formFiber.alternate;
    null !== formFiber && (formFiber.memoizedState = existingStateHook);
    return existingStateHook;
  }
  function requestFormReset$1(formFiber) {
    var stateHook = ensureFormComponentIsStateful(formFiber);
    null === stateHook.next && (stateHook = formFiber.alternate.memoizedState);
    dispatchSetStateInternal(formFiber, stateHook.next.queue, {}, requestUpdateLane());
  }
  function useHostTransitionStatus() {
    return readContext(HostTransitionContext);
  }
  function updateId() {
    return updateWorkInProgressHook().memoizedState;
  }
  function updateRefresh() {
    return updateWorkInProgressHook().memoizedState;
  }
  function refreshCache(fiber) {
    for (var provider = fiber.return; null !== provider; ) {
      switch (provider.tag) {
        case 24:
        case 3:
          var lane = requestUpdateLane();
          fiber = createUpdate(lane);
          var root$73 = enqueueUpdate(provider, fiber, lane);
          null !== root$73 && (scheduleUpdateOnFiber(root$73, provider, lane), entangleTransitions(root$73, provider, lane));
          provider = { cache: createCache() };
          fiber.payload = provider;
          return;
      }
      provider = provider.return;
    }
  }
  function dispatchReducerAction(fiber, queue, action) {
    var lane = requestUpdateLane();
    action = {
      lane,
      revertLane: 0,
      gesture: null,
      action,
      hasEagerState: false,
      eagerState: null,
      next: null
    };
    isRenderPhaseUpdate(fiber) ? enqueueRenderPhaseUpdate(queue, action) : (action = enqueueConcurrentHookUpdate(fiber, queue, action, lane), null !== action && (scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane)));
  }
  function dispatchSetState(fiber, queue, action) {
    var lane = requestUpdateLane();
    dispatchSetStateInternal(fiber, queue, action, lane);
  }
  function dispatchSetStateInternal(fiber, queue, action, lane) {
    var update = {
      lane,
      revertLane: 0,
      gesture: null,
      action,
      hasEagerState: false,
      eagerState: null,
      next: null
    };
    if (isRenderPhaseUpdate(fiber))
      enqueueRenderPhaseUpdate(queue, update);
    else {
      var alternate = fiber.alternate;
      if (0 === fiber.lanes && (null === alternate || 0 === alternate.lanes) && (alternate = queue.lastRenderedReducer, null !== alternate))
        try {
          var currentState = queue.lastRenderedState, eagerState = alternate(currentState, action);
          update.hasEagerState = true;
          update.eagerState = eagerState;
          if (objectIs(eagerState, currentState))
            return enqueueUpdate$1(fiber, queue, update, 0), null === workInProgressRoot && finishQueueingConcurrentUpdates(), false;
        } catch (error) {
        } finally {
        }
      action = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
      if (null !== action)
        return scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane), true;
    }
    return false;
  }
  function dispatchOptimisticSetState(fiber, throwIfDuringRender, queue, action) {
    action = {
      lane: 2,
      revertLane: requestTransitionLane(),
      gesture: null,
      action,
      hasEagerState: false,
      eagerState: null,
      next: null
    };
    if (isRenderPhaseUpdate(fiber)) {
      if (throwIfDuringRender)
        throw Error(formatProdErrorMessage(479));
    } else
      throwIfDuringRender = enqueueConcurrentHookUpdate(fiber, queue, action, 2), null !== throwIfDuringRender && scheduleUpdateOnFiber(throwIfDuringRender, fiber, 2);
  }
  function isRenderPhaseUpdate(fiber) {
    var alternate = fiber.alternate;
    return fiber === currentlyRenderingFiber || null !== alternate && alternate === currentlyRenderingFiber;
  }
  function enqueueRenderPhaseUpdate(queue, update) {
    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
    var pending = queue.pending;
    null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
    queue.pending = update;
  }
  function entangleTransitionUpdate(root2, queue, lane) {
    if (0 !== (lane & 4194048)) {
      var queueLanes = queue.lanes;
      queueLanes &= root2.pendingLanes;
      lane |= queueLanes;
      queue.lanes = lane;
      markRootEntangled(root2, lane);
    }
  }
  var ContextOnlyDispatcher = {
    readContext,
    use,
    useCallback: throwInvalidHookError,
    useContext: throwInvalidHookError,
    useEffect: throwInvalidHookError,
    useImperativeHandle: throwInvalidHookError,
    useLayoutEffect: throwInvalidHookError,
    useInsertionEffect: throwInvalidHookError,
    useMemo: throwInvalidHookError,
    useReducer: throwInvalidHookError,
    useRef: throwInvalidHookError,
    useState: throwInvalidHookError,
    useDebugValue: throwInvalidHookError,
    useDeferredValue: throwInvalidHookError,
    useTransition: throwInvalidHookError,
    useSyncExternalStore: throwInvalidHookError,
    useId: throwInvalidHookError,
    useHostTransitionStatus: throwInvalidHookError,
    useFormState: throwInvalidHookError,
    useActionState: throwInvalidHookError,
    useOptimistic: throwInvalidHookError,
    useMemoCache: throwInvalidHookError,
    useCacheRefresh: throwInvalidHookError,
    useEffectEvent: throwInvalidHookError
  }, HooksDispatcherOnMount = {
    readContext,
    use,
    useCallback: function(callback, deps) {
      mountWorkInProgressHook().memoizedState = [
        callback,
        void 0 === deps ? null : deps
      ];
      return callback;
    },
    useContext: readContext,
    useEffect: mountEffect,
    useImperativeHandle: function(ref, create, deps) {
      deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
      mountEffectImpl(4194308, 4, imperativeHandleEffect.bind(null, create, ref), deps);
    },
    useLayoutEffect: function(create, deps) {
      return mountEffectImpl(4194308, 4, create, deps);
    },
    useInsertionEffect: function(create, deps) {
      mountEffectImpl(4, 2, create, deps);
    },
    useMemo: function(nextCreate, deps) {
      var hook = mountWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      var nextValue = nextCreate();
      if (shouldDoubleInvokeUserFnsInHooksDEV) {
        setIsStrictModeForDevtools(true);
        try {
          nextCreate();
        } finally {
          setIsStrictModeForDevtools(false);
        }
      }
      hook.memoizedState = [nextValue, deps];
      return nextValue;
    },
    useReducer: function(reducer, initialArg, init) {
      var hook = mountWorkInProgressHook();
      if (void 0 !== init) {
        var initialState = init(initialArg);
        if (shouldDoubleInvokeUserFnsInHooksDEV) {
          setIsStrictModeForDevtools(true);
          try {
            init(initialArg);
          } finally {
            setIsStrictModeForDevtools(false);
          }
        }
      } else
        initialState = initialArg;
      hook.memoizedState = hook.baseState = initialState;
      reducer = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: reducer,
        lastRenderedState: initialState
      };
      hook.queue = reducer;
      reducer = reducer.dispatch = dispatchReducerAction.bind(null, currentlyRenderingFiber, reducer);
      return [hook.memoizedState, reducer];
    },
    useRef: function(initialValue) {
      var hook = mountWorkInProgressHook();
      initialValue = { current: initialValue };
      return hook.memoizedState = initialValue;
    },
    useState: function(initialState) {
      initialState = mountStateImpl(initialState);
      var queue = initialState.queue, dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
      queue.dispatch = dispatch;
      return [initialState.memoizedState, dispatch];
    },
    useDebugValue: mountDebugValue,
    useDeferredValue: function(value, initialValue) {
      var hook = mountWorkInProgressHook();
      return mountDeferredValueImpl(hook, value, initialValue);
    },
    useTransition: function() {
      var stateHook = mountStateImpl(false);
      stateHook = startTransition.bind(null, currentlyRenderingFiber, stateHook.queue, true, false);
      mountWorkInProgressHook().memoizedState = stateHook;
      return [false, stateHook];
    },
    useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
      var fiber = currentlyRenderingFiber, hook = mountWorkInProgressHook();
      if (isHydrating) {
        if (void 0 === getServerSnapshot)
          throw Error(formatProdErrorMessage(407));
        getServerSnapshot = getServerSnapshot();
      } else {
        getServerSnapshot = getSnapshot();
        if (null === workInProgressRoot)
          throw Error(formatProdErrorMessage(349));
        0 !== (workInProgressRootRenderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
      }
      hook.memoizedState = getServerSnapshot;
      var inst = { value: getServerSnapshot, getSnapshot };
      hook.queue = inst;
      mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [
        subscribe
      ]);
      fiber.flags |= 2048;
      pushSimpleEffect(9, { destroy: void 0 }, updateStoreInstance.bind(null, fiber, inst, getServerSnapshot, getSnapshot), null);
      return getServerSnapshot;
    },
    useId: function() {
      var hook = mountWorkInProgressHook(), identifierPrefix = workInProgressRoot.identifierPrefix;
      if (isHydrating) {
        var JSCompiler_inline_result = treeContextOverflow;
        var idWithLeadingBit = treeContextId;
        JSCompiler_inline_result = (idWithLeadingBit & ~(1 << 32 - clz32(idWithLeadingBit) - 1)).toString(32) + JSCompiler_inline_result;
        identifierPrefix = "_" + identifierPrefix + "R_" + JSCompiler_inline_result;
        JSCompiler_inline_result = localIdCounter++;
        0 < JSCompiler_inline_result && (identifierPrefix += "H" + JSCompiler_inline_result.toString(32));
        identifierPrefix += "_";
      } else
        JSCompiler_inline_result = globalClientIdCounter++, identifierPrefix = "_" + identifierPrefix + "r_" + JSCompiler_inline_result.toString(32) + "_";
      return hook.memoizedState = identifierPrefix;
    },
    useHostTransitionStatus,
    useFormState: mountActionState,
    useActionState: mountActionState,
    useOptimistic: function(passthrough) {
      var hook = mountWorkInProgressHook();
      hook.memoizedState = hook.baseState = passthrough;
      var queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      hook.queue = queue;
      hook = dispatchOptimisticSetState.bind(null, currentlyRenderingFiber, true, queue);
      queue.dispatch = hook;
      return [passthrough, hook];
    },
    useMemoCache,
    useCacheRefresh: function() {
      return mountWorkInProgressHook().memoizedState = refreshCache.bind(null, currentlyRenderingFiber);
    },
    useEffectEvent: function(callback) {
      var hook = mountWorkInProgressHook(), ref = { impl: callback };
      hook.memoizedState = ref;
      return function() {
        if (0 !== (executionContext & 2))
          throw Error(formatProdErrorMessage(440));
        return ref.impl.apply(void 0, arguments);
      };
    }
  }, HooksDispatcherOnUpdate = {
    readContext,
    use,
    useCallback: updateCallback,
    useContext: readContext,
    useEffect: updateEffect,
    useImperativeHandle: updateImperativeHandle,
    useInsertionEffect: updateInsertionEffect,
    useLayoutEffect: updateLayoutEffect,
    useMemo: updateMemo,
    useReducer: updateReducer,
    useRef: updateRef,
    useState: function() {
      return updateReducer(basicStateReducer);
    },
    useDebugValue: mountDebugValue,
    useDeferredValue: function(value, initialValue) {
      var hook = updateWorkInProgressHook();
      return updateDeferredValueImpl(hook, currentHook.memoizedState, value, initialValue);
    },
    useTransition: function() {
      var booleanOrThenable = updateReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
      return [
        "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
        start
      ];
    },
    useSyncExternalStore: updateSyncExternalStore,
    useId: updateId,
    useHostTransitionStatus,
    useFormState: updateActionState,
    useActionState: updateActionState,
    useOptimistic: function(passthrough, reducer) {
      var hook = updateWorkInProgressHook();
      return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
    },
    useMemoCache,
    useCacheRefresh: updateRefresh,
    useEffectEvent: updateEvent
  }, HooksDispatcherOnRerender = {
    readContext,
    use,
    useCallback: updateCallback,
    useContext: readContext,
    useEffect: updateEffect,
    useImperativeHandle: updateImperativeHandle,
    useInsertionEffect: updateInsertionEffect,
    useLayoutEffect: updateLayoutEffect,
    useMemo: updateMemo,
    useReducer: rerenderReducer,
    useRef: updateRef,
    useState: function() {
      return rerenderReducer(basicStateReducer);
    },
    useDebugValue: mountDebugValue,
    useDeferredValue: function(value, initialValue) {
      var hook = updateWorkInProgressHook();
      return null === currentHook ? mountDeferredValueImpl(hook, value, initialValue) : updateDeferredValueImpl(hook, currentHook.memoizedState, value, initialValue);
    },
    useTransition: function() {
      var booleanOrThenable = rerenderReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
      return [
        "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
        start
      ];
    },
    useSyncExternalStore: updateSyncExternalStore,
    useId: updateId,
    useHostTransitionStatus,
    useFormState: rerenderActionState,
    useActionState: rerenderActionState,
    useOptimistic: function(passthrough, reducer) {
      var hook = updateWorkInProgressHook();
      if (null !== currentHook)
        return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
      hook.baseState = passthrough;
      return [passthrough, hook.queue.dispatch];
    },
    useMemoCache,
    useCacheRefresh: updateRefresh,
    useEffectEvent: updateEvent
  };
  function applyDerivedStateFromProps(workInProgress2, ctor, getDerivedStateFromProps, nextProps) {
    ctor = workInProgress2.memoizedState;
    getDerivedStateFromProps = getDerivedStateFromProps(nextProps, ctor);
    getDerivedStateFromProps = null === getDerivedStateFromProps || void 0 === getDerivedStateFromProps ? ctor : assign({}, ctor, getDerivedStateFromProps);
    workInProgress2.memoizedState = getDerivedStateFromProps;
    0 === workInProgress2.lanes && (workInProgress2.updateQueue.baseState = getDerivedStateFromProps);
  }
  var classComponentUpdater = {
    enqueueSetState: function(inst, payload, callback) {
      inst = inst._reactInternals;
      var lane = requestUpdateLane(), update = createUpdate(lane);
      update.payload = payload;
      void 0 !== callback && null !== callback && (update.callback = callback);
      payload = enqueueUpdate(inst, update, lane);
      null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
    },
    enqueueReplaceState: function(inst, payload, callback) {
      inst = inst._reactInternals;
      var lane = requestUpdateLane(), update = createUpdate(lane);
      update.tag = 1;
      update.payload = payload;
      void 0 !== callback && null !== callback && (update.callback = callback);
      payload = enqueueUpdate(inst, update, lane);
      null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
    },
    enqueueForceUpdate: function(inst, callback) {
      inst = inst._reactInternals;
      var lane = requestUpdateLane(), update = createUpdate(lane);
      update.tag = 2;
      void 0 !== callback && null !== callback && (update.callback = callback);
      callback = enqueueUpdate(inst, update, lane);
      null !== callback && (scheduleUpdateOnFiber(callback, inst, lane), entangleTransitions(callback, inst, lane));
    }
  };
  function checkShouldComponentUpdate(workInProgress2, ctor, oldProps, newProps, oldState, newState, nextContext) {
    workInProgress2 = workInProgress2.stateNode;
    return "function" === typeof workInProgress2.shouldComponentUpdate ? workInProgress2.shouldComponentUpdate(newProps, newState, nextContext) : ctor.prototype && ctor.prototype.isPureReactComponent ? !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState) : true;
  }
  function callComponentWillReceiveProps(workInProgress2, instance, newProps, nextContext) {
    workInProgress2 = instance.state;
    "function" === typeof instance.componentWillReceiveProps && instance.componentWillReceiveProps(newProps, nextContext);
    "function" === typeof instance.UNSAFE_componentWillReceiveProps && instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
    instance.state !== workInProgress2 && classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
  function resolveClassComponentProps(Component, baseProps) {
    var newProps = baseProps;
    if ("ref" in baseProps) {
      newProps = {};
      for (var propName in baseProps)
        "ref" !== propName && (newProps[propName] = baseProps[propName]);
    }
    if (Component = Component.defaultProps) {
      newProps === baseProps && (newProps = assign({}, newProps));
      for (var propName$77 in Component)
        void 0 === newProps[propName$77] && (newProps[propName$77] = Component[propName$77]);
    }
    return newProps;
  }
  function defaultOnUncaughtError(error) {
    reportGlobalError(error);
  }
  function defaultOnCaughtError(error) {
    console.error(error);
  }
  function defaultOnRecoverableError(error) {
    reportGlobalError(error);
  }
  function logUncaughtError(root2, errorInfo) {
    try {
      var onUncaughtError = root2.onUncaughtError;
      onUncaughtError(errorInfo.value, { componentStack: errorInfo.stack });
    } catch (e$78) {
      setTimeout(function() {
        throw e$78;
      });
    }
  }
  function logCaughtError(root2, boundary, errorInfo) {
    try {
      var onCaughtError = root2.onCaughtError;
      onCaughtError(errorInfo.value, {
        componentStack: errorInfo.stack,
        errorBoundary: 1 === boundary.tag ? boundary.stateNode : null
      });
    } catch (e$79) {
      setTimeout(function() {
        throw e$79;
      });
    }
  }
  function createRootErrorUpdate(root2, errorInfo, lane) {
    lane = createUpdate(lane);
    lane.tag = 3;
    lane.payload = { element: null };
    lane.callback = function() {
      logUncaughtError(root2, errorInfo);
    };
    return lane;
  }
  function createClassErrorUpdate(lane) {
    lane = createUpdate(lane);
    lane.tag = 3;
    return lane;
  }
  function initializeClassErrorUpdate(update, root2, fiber, errorInfo) {
    var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
    if ("function" === typeof getDerivedStateFromError) {
      var error = errorInfo.value;
      update.payload = function() {
        return getDerivedStateFromError(error);
      };
      update.callback = function() {
        logCaughtError(root2, fiber, errorInfo);
      };
    }
    var inst = fiber.stateNode;
    null !== inst && "function" === typeof inst.componentDidCatch && (update.callback = function() {
      logCaughtError(root2, fiber, errorInfo);
      "function" !== typeof getDerivedStateFromError && (null === legacyErrorBoundariesThatAlreadyFailed ? legacyErrorBoundariesThatAlreadyFailed =  new Set([this]) : legacyErrorBoundariesThatAlreadyFailed.add(this));
      var stack = errorInfo.stack;
      this.componentDidCatch(errorInfo.value, {
        componentStack: null !== stack ? stack : ""
      });
    });
  }
  function throwException(root2, returnFiber, sourceFiber, value, rootRenderLanes) {
    sourceFiber.flags |= 32768;
    if (null !== value && "object" === typeof value && "function" === typeof value.then) {
      returnFiber = sourceFiber.alternate;
      null !== returnFiber && propagateParentContextChanges(returnFiber, sourceFiber, rootRenderLanes, true);
      sourceFiber = suspenseHandlerStackCursor.current;
      if (null !== sourceFiber) {
        switch (sourceFiber.tag) {
          case 31:
          case 13:
          case 19:
            return null === shellBoundary ? renderDidSuspendDelayIfPossible() : null === sourceFiber.alternate && 0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 3), sourceFiber.flags &= -257, sourceFiber.flags |= 65536, sourceFiber.lanes = rootRenderLanes, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? sourceFiber.updateQueue =  new Set([value]) : returnFiber.add(value), attachPingListener(root2, value, rootRenderLanes)), false;
          case 22:
            return sourceFiber.flags |= 65536, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? (returnFiber = {
              transitions: null,
              markerInstances: null,
              retryQueue:  new Set([value])
            }, sourceFiber.updateQueue = returnFiber) : (sourceFiber = returnFiber.retryQueue, null === sourceFiber ? returnFiber.retryQueue =  new Set([value]) : sourceFiber.add(value)), attachPingListener(root2, value, rootRenderLanes)), false;
        }
        throw Error(formatProdErrorMessage(435, sourceFiber.tag));
      }
      attachPingListener(root2, value, rootRenderLanes);
      renderDidSuspendDelayIfPossible();
      return false;
    }
    if (isHydrating)
      return returnFiber = suspenseHandlerStackCursor.current, null !== returnFiber ? (0 === (returnFiber.flags & 65536) && (returnFiber.flags |= 256), returnFiber.flags |= 65536, returnFiber.lanes = rootRenderLanes, value !== HydrationMismatchException && (root2 = Error(formatProdErrorMessage(422), { cause: value }), queueHydrationError(createCapturedValueAtFiber(root2, sourceFiber)))) : (value !== HydrationMismatchException && (returnFiber = Error(formatProdErrorMessage(423), {
        cause: value
      }), queueHydrationError(createCapturedValueAtFiber(returnFiber, sourceFiber))), root2 = root2.current.alternate, root2.flags |= 65536, rootRenderLanes &= -rootRenderLanes, root2.lanes |= rootRenderLanes, value = createCapturedValueAtFiber(value, sourceFiber), rootRenderLanes = createRootErrorUpdate(root2.stateNode, value, rootRenderLanes), enqueueCapturedUpdate(root2, rootRenderLanes), 4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2)), false;
    var wrapperError = Error(formatProdErrorMessage(520), { cause: value });
    wrapperError = createCapturedValueAtFiber(wrapperError, sourceFiber);
    null === workInProgressRootConcurrentErrors ? workInProgressRootConcurrentErrors = [wrapperError] : workInProgressRootConcurrentErrors.push(wrapperError);
    4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2);
    if (null === returnFiber)
      return true;
    value = createCapturedValueAtFiber(value, sourceFiber);
    sourceFiber = returnFiber;
    do {
      switch (sourceFiber.tag) {
        case 3:
          return sourceFiber.flags |= 65536, root2 = rootRenderLanes & -rootRenderLanes, sourceFiber.lanes |= root2, root2 = createRootErrorUpdate(sourceFiber.stateNode, value, root2), enqueueCapturedUpdate(sourceFiber, root2), false;
        case 1:
          returnFiber = sourceFiber.type;
          wrapperError = sourceFiber.stateNode;
          if (0 === (sourceFiber.flags & 128) && ("function" === typeof returnFiber.getDerivedStateFromError || null !== wrapperError && "function" === typeof wrapperError.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(wrapperError))))
            return sourceFiber.flags |= 65536, rootRenderLanes &= -rootRenderLanes, sourceFiber.lanes |= rootRenderLanes, rootRenderLanes = createClassErrorUpdate(rootRenderLanes), initializeClassErrorUpdate(rootRenderLanes, root2, sourceFiber, value), enqueueCapturedUpdate(sourceFiber, rootRenderLanes), false;
          break;
        case 22:
          if (null !== sourceFiber.memoizedState)
            return sourceFiber.flags |= 65536, false;
      }
      sourceFiber = sourceFiber.return;
    } while (null !== sourceFiber);
    return false;
  }
  var SelectiveHydrationException = Error(formatProdErrorMessage(461)), didReceiveUpdate = false;
  function reconcileChildren(current, workInProgress2, nextChildren, renderLanes2) {
    workInProgress2.child = null === current ? mountChildFibers(workInProgress2, null, nextChildren, renderLanes2) : reconcileChildFibers(workInProgress2, current.child, nextChildren, renderLanes2);
  }
  function updateForwardRef(current, workInProgress2, Component, nextProps, renderLanes2) {
    Component = Component.render;
    var ref = workInProgress2.ref;
    if ("ref" in nextProps) {
      var propsWithoutRef = {};
      for (var key in nextProps)
        "ref" !== key && (propsWithoutRef[key] = nextProps[key]);
    } else
      propsWithoutRef = nextProps;
    prepareToReadContext(workInProgress2);
    nextProps = renderWithHooks(current, workInProgress2, Component, propsWithoutRef, ref, renderLanes2);
    key = checkDidRenderIdHook();
    if (null !== current && !didReceiveUpdate)
      return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    isHydrating && key && pushMaterializedTreeId(workInProgress2);
    workInProgress2.flags |= 1;
    reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
    return workInProgress2.child;
  }
  function updateMemoComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
    if (null === current) {
      var type = Component.type;
      if ("function" === typeof type && !shouldConstruct(type) && void 0 === type.defaultProps && null === Component.compare)
        return workInProgress2.tag = 15, workInProgress2.type = type, updateSimpleMemoComponent(current, workInProgress2, type, nextProps, renderLanes2);
      current = createFiberFromTypeAndProps(Component.type, null, nextProps, workInProgress2, workInProgress2.mode, renderLanes2);
      current.ref = workInProgress2.ref;
      current.return = workInProgress2;
      return workInProgress2.child = current;
    }
    type = current.child;
    if (!checkScheduledUpdateOrContext(current, renderLanes2)) {
      var prevProps = type.memoizedProps;
      Component = Component.compare;
      Component = null !== Component ? Component : shallowEqual;
      if (Component(prevProps, nextProps) && current.ref === workInProgress2.ref)
        return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    }
    workInProgress2.flags |= 1;
    current = createWorkInProgress(type, nextProps);
    current.ref = workInProgress2.ref;
    current.return = workInProgress2;
    return workInProgress2.child = current;
  }
  function updateSimpleMemoComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
    if (null !== current) {
      var prevProps = current.memoizedProps;
      if (shallowEqual(prevProps, nextProps) && current.ref === workInProgress2.ref)
        if (didReceiveUpdate = false, workInProgress2.pendingProps = nextProps = prevProps, checkScheduledUpdateOrContext(current, renderLanes2))
          0 !== (current.flags & 131072) && (didReceiveUpdate = true);
        else
          return workInProgress2.lanes = current.lanes, bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    }
    return updateFunctionComponent(current, workInProgress2, Component, nextProps, renderLanes2);
  }
  function updateOffscreenComponent(current, workInProgress2, renderLanes2, nextProps) {
    var nextChildren = nextProps.children, prevState = null !== current ? current.memoizedState : null;
    null === current && null === workInProgress2.stateNode && (workInProgress2.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    });
    if ("hidden" === nextProps.mode) {
      if (0 !== (workInProgress2.flags & 128)) {
        prevState = null !== prevState ? prevState.baseLanes | renderLanes2 : renderLanes2;
        if (null !== current) {
          nextProps = workInProgress2.child = current.child;
          for (nextChildren = 0; null !== nextProps; )
            nextChildren = nextChildren | nextProps.lanes | nextProps.childLanes, nextProps = nextProps.sibling;
          nextProps = nextChildren & ~prevState;
        } else
          nextProps = 0, workInProgress2.child = null;
        return deferHiddenOffscreenComponent(current, workInProgress2, prevState, renderLanes2, nextProps);
      }
      if (0 !== (renderLanes2 & 536870912))
        workInProgress2.memoizedState = { baseLanes: 0, cachePool: null }, null !== current && pushTransition(workInProgress2, null !== prevState ? prevState.cachePool : null), null !== prevState ? pushHiddenContext(workInProgress2, prevState) : reuseHiddenContextOnStack(), pushOffscreenSuspenseHandler(workInProgress2);
      else
        return nextProps = workInProgress2.lanes = 536870912, deferHiddenOffscreenComponent(current, workInProgress2, null !== prevState ? prevState.baseLanes | renderLanes2 : renderLanes2, renderLanes2, nextProps);
    } else
      null !== prevState ? (pushTransition(workInProgress2, prevState.cachePool), pushHiddenContext(workInProgress2, prevState), reuseSuspenseHandlerOnStack(), workInProgress2.memoizedState = null) : (null !== current && pushTransition(workInProgress2, null), reuseHiddenContextOnStack(), reuseSuspenseHandlerOnStack());
    reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
    return workInProgress2.child;
  }
  function bailoutOffscreenComponent(current, workInProgress2) {
    null !== current && 22 === current.tag || null !== workInProgress2.stateNode || (workInProgress2.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    });
    return workInProgress2.sibling;
  }
  function deferHiddenOffscreenComponent(current, workInProgress2, nextBaseLanes, renderLanes2, remainingChildLanes) {
    var JSCompiler_inline_result = peekCacheFromPool();
    JSCompiler_inline_result = null === JSCompiler_inline_result ? null : { parent: CacheContext._currentValue, pool: JSCompiler_inline_result };
    workInProgress2.memoizedState = {
      baseLanes: nextBaseLanes,
      cachePool: JSCompiler_inline_result
    };
    null !== current && pushTransition(workInProgress2, null);
    reuseHiddenContextOnStack();
    pushOffscreenSuspenseHandler(workInProgress2);
    null !== current && propagateParentContextChanges(current, workInProgress2, renderLanes2, true);
    workInProgress2.childLanes = remainingChildLanes;
    return null;
  }
  function mountActivityChildren(workInProgress2, nextProps) {
    nextProps = mountWorkInProgressOffscreenFiber({ mode: nextProps.mode, children: nextProps.children }, workInProgress2.mode);
    nextProps.ref = workInProgress2.ref;
    workInProgress2.child = nextProps;
    nextProps.return = workInProgress2;
    return nextProps;
  }
  function retryActivityComponentWithoutHydrating(current, workInProgress2, renderLanes2) {
    reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
    current = mountActivityChildren(workInProgress2, workInProgress2.pendingProps);
    current.flags |= 2;
    popSuspenseHandler(workInProgress2);
    workInProgress2.memoizedState = null;
    return current;
  }
  function updateActivityComponent(current, workInProgress2, renderLanes2) {
    var nextProps = workInProgress2.pendingProps, didSuspend = 0 !== (workInProgress2.flags & 128);
    workInProgress2.flags &= -129;
    if (null === current) {
      if (isHydrating) {
        if ("hidden" === nextProps.mode)
          return current = mountActivityChildren(workInProgress2, nextProps), workInProgress2.lanes = 536870912, current.memoizedState = { baseLanes: 0, cachePool: null }, bailoutOffscreenComponent(null, current);
        pushDehydratedActivitySuspenseHandler(workInProgress2);
        (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(current, rootOrSingletonContext), current = null !== current && "&" === current.data ? current : null, null !== current && (workInProgress2.memoizedState = {
          dehydrated: current,
          treeContext: null !== treeContextProvider ? { id: treeContextId, overflow: treeContextOverflow } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, renderLanes2 = createFiberFromDehydratedFragment(current), renderLanes2.return = workInProgress2, workInProgress2.child = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : current = null;
        if (null === current)
          throw throwOnHydrationMismatch(workInProgress2);
        workInProgress2.lanes = 536870912;
        return null;
      }
      return mountActivityChildren(workInProgress2, nextProps);
    }
    var prevState = current.memoizedState;
    if (null !== prevState) {
      var dehydrated = prevState.dehydrated;
      pushDehydratedActivitySuspenseHandler(workInProgress2);
      if (didSuspend)
        if (workInProgress2.flags & 256)
          workInProgress2.flags &= -257, workInProgress2 = retryActivityComponentWithoutHydrating(current, workInProgress2, renderLanes2);
        else if (null !== workInProgress2.memoizedState)
          workInProgress2.child = current.child, workInProgress2.flags |= 128, workInProgress2 = null;
        else
          throw Error(formatProdErrorMessage(558));
      else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress2, renderLanes2, false), didSuspend = 0 !== (renderLanes2 & current.childLanes), didReceiveUpdate || didSuspend) {
        if (null === currentTreeHiddenStackCursor.current) {
          nextProps = workInProgressRoot;
          if (null !== nextProps && (dehydrated = getBumpedLaneForHydration(nextProps, renderLanes2), 0 !== dehydrated && dehydrated !== prevState.retryLane))
            throw prevState.retryLane = dehydrated, enqueueConcurrentRenderForLane(current, dehydrated), scheduleUpdateOnFiber(nextProps, current, dehydrated), SelectiveHydrationException;
          renderDidSuspendDelayIfPossible();
        }
        workInProgress2 = retryActivityComponentWithoutHydrating(current, workInProgress2, renderLanes2);
      } else
        current = prevState.treeContext, nextHydratableInstance = getNextHydratable(dehydrated.nextSibling), hydrationParentFiber = workInProgress2, isHydrating = true, hydrationErrors = null, rootOrSingletonContext = false, null !== current && restoreSuspendedTreeContext(workInProgress2, current), workInProgress2 = mountActivityChildren(workInProgress2, nextProps), workInProgress2.flags |= 134221824;
      return workInProgress2;
    }
    current = createWorkInProgress(current.child, {
      mode: nextProps.mode,
      children: nextProps.children
    });
    current.ref = workInProgress2.ref;
    workInProgress2.child = current;
    current.return = workInProgress2;
    return current;
  }
  function markRef(current, workInProgress2) {
    var ref = workInProgress2.ref;
    if (null === ref)
      null !== current && null !== current.ref && (workInProgress2.flags |= 4194816);
    else {
      if ("function" !== typeof ref && "object" !== typeof ref)
        throw Error(formatProdErrorMessage(284));
      if (null === current || current.ref !== ref)
        workInProgress2.flags |= 4194816;
    }
  }
  function updateFunctionComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
    prepareToReadContext(workInProgress2);
    Component = renderWithHooks(current, workInProgress2, Component, nextProps, void 0, renderLanes2);
    nextProps = checkDidRenderIdHook();
    if (null !== current && !didReceiveUpdate)
      return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    isHydrating && nextProps && pushMaterializedTreeId(workInProgress2);
    workInProgress2.flags |= 1;
    reconcileChildren(current, workInProgress2, Component, renderLanes2);
    return workInProgress2.child;
  }
  function replayFunctionComponent(current, workInProgress2, nextProps, Component, secondArg, renderLanes2) {
    prepareToReadContext(workInProgress2);
    workInProgress2.updateQueue = null;
    nextProps = renderWithHooksAgain(workInProgress2, Component, nextProps, secondArg);
    finishRenderingHooks(current);
    Component = checkDidRenderIdHook();
    if (null !== current && !didReceiveUpdate)
      return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    isHydrating && Component && pushMaterializedTreeId(workInProgress2);
    workInProgress2.flags |= 1;
    reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
    return workInProgress2.child;
  }
  function updateClassComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
    prepareToReadContext(workInProgress2);
    if (null === workInProgress2.stateNode) {
      var context = emptyContextObject, contextType = Component.contextType;
      "object" === typeof contextType && null !== contextType && (context = readContext(contextType));
      context = new Component(nextProps, context);
      workInProgress2.memoizedState = null !== context.state && void 0 !== context.state ? context.state : null;
      context.updater = classComponentUpdater;
      workInProgress2.stateNode = context;
      context._reactInternals = workInProgress2;
      context = workInProgress2.stateNode;
      context.props = nextProps;
      context.state = workInProgress2.memoizedState;
      context.refs = {};
      initializeUpdateQueue(workInProgress2);
      contextType = Component.contextType;
      context.context = "object" === typeof contextType && null !== contextType ? readContext(contextType) : emptyContextObject;
      context.state = workInProgress2.memoizedState;
      contextType = Component.getDerivedStateFromProps;
      "function" === typeof contextType && (applyDerivedStateFromProps(workInProgress2, Component, contextType, nextProps), context.state = workInProgress2.memoizedState);
      "function" === typeof Component.getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || (contextType = context.state, "function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount(), contextType !== context.state && classComponentUpdater.enqueueReplaceState(context, context.state, null), processUpdateQueue(workInProgress2, nextProps, context, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction(), context.state = workInProgress2.memoizedState);
      "function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308);
      nextProps = true;
    } else if (null === current) {
      context = workInProgress2.stateNode;
      var unresolvedOldProps = workInProgress2.memoizedProps, oldProps = resolveClassComponentProps(Component, unresolvedOldProps);
      context.props = oldProps;
      var oldContext = context.context, contextType$jscomp$0 = Component.contextType;
      contextType = emptyContextObject;
      "object" === typeof contextType$jscomp$0 && null !== contextType$jscomp$0 && (contextType = readContext(contextType$jscomp$0));
      var getDerivedStateFromProps = Component.getDerivedStateFromProps;
      contextType$jscomp$0 = "function" === typeof getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate;
      unresolvedOldProps = workInProgress2.pendingProps !== unresolvedOldProps;
      contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (unresolvedOldProps || oldContext !== contextType) && callComponentWillReceiveProps(workInProgress2, context, nextProps, contextType);
      hasForceUpdate = false;
      var oldState = workInProgress2.memoizedState;
      context.state = oldState;
      processUpdateQueue(workInProgress2, nextProps, context, renderLanes2);
      suspendIfUpdateReadFromEntangledAsyncAction();
      oldContext = workInProgress2.memoizedState;
      unresolvedOldProps || oldState !== oldContext || hasForceUpdate ? ("function" === typeof getDerivedStateFromProps && (applyDerivedStateFromProps(workInProgress2, Component, getDerivedStateFromProps, nextProps), oldContext = workInProgress2.memoizedState), (oldProps = hasForceUpdate || checkShouldComponentUpdate(workInProgress2, Component, oldProps, nextProps, oldState, oldContext, contextType)) ? (contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || ("function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount()), "function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308)) : ("function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = oldContext), context.props = nextProps, context.state = oldContext, context.context = contextType, nextProps = oldProps) : ("function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308), nextProps = false);
    } else {
      context = workInProgress2.stateNode;
      cloneUpdateQueue(current, workInProgress2);
      contextType = workInProgress2.memoizedProps;
      contextType$jscomp$0 = resolveClassComponentProps(Component, contextType);
      context.props = contextType$jscomp$0;
      getDerivedStateFromProps = workInProgress2.pendingProps;
      oldState = context.context;
      oldContext = Component.contextType;
      oldProps = emptyContextObject;
      "object" === typeof oldContext && null !== oldContext && (oldProps = readContext(oldContext));
      unresolvedOldProps = Component.getDerivedStateFromProps;
      (oldContext = "function" === typeof unresolvedOldProps || "function" === typeof context.getSnapshotBeforeUpdate) || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (contextType !== getDerivedStateFromProps || oldState !== oldProps) && callComponentWillReceiveProps(workInProgress2, context, nextProps, oldProps);
      hasForceUpdate = false;
      oldState = workInProgress2.memoizedState;
      context.state = oldState;
      processUpdateQueue(workInProgress2, nextProps, context, renderLanes2);
      suspendIfUpdateReadFromEntangledAsyncAction();
      var newState = workInProgress2.memoizedState;
      contextType !== getDerivedStateFromProps || oldState !== newState || hasForceUpdate || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies) ? ("function" === typeof unresolvedOldProps && (applyDerivedStateFromProps(workInProgress2, Component, unresolvedOldProps, nextProps), newState = workInProgress2.memoizedState), (contextType$jscomp$0 = hasForceUpdate || checkShouldComponentUpdate(workInProgress2, Component, contextType$jscomp$0, nextProps, oldState, newState, oldProps) || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies)) ? (oldContext || "function" !== typeof context.UNSAFE_componentWillUpdate && "function" !== typeof context.componentWillUpdate || ("function" === typeof context.componentWillUpdate && context.componentWillUpdate(nextProps, newState, oldProps), "function" === typeof context.UNSAFE_componentWillUpdate && context.UNSAFE_componentWillUpdate(nextProps, newState, oldProps)), "function" === typeof context.componentDidUpdate && (workInProgress2.flags |= 4), "function" === typeof context.getSnapshotBeforeUpdate && (workInProgress2.flags |= 1024)) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 1024), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = newState), context.props = nextProps, context.state = newState, context.context = oldProps, nextProps = contextType$jscomp$0) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 1024), nextProps = false);
    }
    context = nextProps;
    markRef(current, workInProgress2);
    nextProps = 0 !== (workInProgress2.flags & 128);
    context || nextProps ? (context = workInProgress2.stateNode, Component = nextProps && "function" !== typeof Component.getDerivedStateFromError ? null : context.render(), workInProgress2.flags |= 1, null !== current && nextProps ? (workInProgress2.child = reconcileChildFibers(workInProgress2, current.child, null, renderLanes2), workInProgress2.child = reconcileChildFibers(workInProgress2, null, Component, renderLanes2)) : reconcileChildren(current, workInProgress2, Component, renderLanes2), workInProgress2.memoizedState = context.state, current = workInProgress2.child) : current = bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    return current;
  }
  function mountHostRootWithoutHydrating(current, workInProgress2, nextChildren, renderLanes2) {
    resetHydrationState();
    workInProgress2.flags |= 256;
    reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
    return workInProgress2.child;
  }
  var SUSPENDED_MARKER = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function mountSuspenseOffscreenState(renderLanes2) {
    return { baseLanes: renderLanes2, cachePool: getSuspendedCache() };
  }
  function getRemainingWorkInPrimaryTree(current, primaryTreeDidDefer, renderLanes2) {
    current = null !== current ? current.childLanes & ~renderLanes2 : 0;
    primaryTreeDidDefer && (current |= workInProgressDeferredLane);
    return current;
  }
  function updateSuspenseComponent(current, workInProgress2, renderLanes2) {
    var nextProps = workInProgress2.pendingProps, showFallback = false, didSuspend = 0 !== (workInProgress2.flags & 128), JSCompiler_temp;
    (JSCompiler_temp = didSuspend) || (JSCompiler_temp = null !== current && null === current.memoizedState ? false : 0 !== (suspenseStackCursor.current & 2));
    JSCompiler_temp && (showFallback = true, workInProgress2.flags &= -129);
    JSCompiler_temp = 0 !== (workInProgress2.flags & 32);
    workInProgress2.flags &= -33;
    if (null === current) {
      if (isHydrating) {
        showFallback ? pushPrimaryTreeSuspenseHandler(workInProgress2) : reuseSuspenseHandlerOnStack();
        (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(current, rootOrSingletonContext), current = null !== current && "&" !== current.data ? current : null, null !== current && (workInProgress2.memoizedState = {
          dehydrated: current,
          treeContext: null !== treeContextProvider ? { id: treeContextId, overflow: treeContextOverflow } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, renderLanes2 = createFiberFromDehydratedFragment(current), renderLanes2.return = workInProgress2, workInProgress2.child = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : current = null;
        if (null === current)
          throw throwOnHydrationMismatch(workInProgress2);
        isSuspenseInstanceFallback(current) ? workInProgress2.lanes = 32 : workInProgress2.lanes = 536870912;
        return null;
      }
      didSuspend = nextProps.children;
      nextProps = nextProps.fallback;
      if (showFallback)
        return reuseSuspenseHandlerOnStack(), showFallback = workInProgress2.mode, didSuspend = mountWorkInProgressOffscreenFiber({ mode: "hidden", children: didSuspend }, showFallback), nextProps = createFiberFromFragment(nextProps, showFallback, renderLanes2, null), didSuspend.return = workInProgress2, nextProps.return = workInProgress2, didSuspend.sibling = nextProps, workInProgress2.child = didSuspend, nextProps = workInProgress2.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2), nextProps.childLanes = getRemainingWorkInPrimaryTree(current, JSCompiler_temp, renderLanes2), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(null, nextProps);
      pushPrimaryTreeSuspenseHandler(workInProgress2);
      return mountSuspensePrimaryChildren(workInProgress2, didSuspend);
    }
    var prevState = current.memoizedState;
    if (null !== prevState) {
      var dehydrated$96 = prevState.dehydrated;
      if (null !== dehydrated$96)
        return updateDehydratedSuspenseComponent(current, workInProgress2, didSuspend, JSCompiler_temp, nextProps, dehydrated$96, prevState, renderLanes2);
    }
    if (showFallback)
      return reuseSuspenseHandlerOnStack(), showFallback = nextProps.fallback, didSuspend = workInProgress2.mode, prevState = current.child, dehydrated$96 = prevState.sibling, nextProps = createWorkInProgress(prevState, {
        mode: "hidden",
        children: nextProps.children
      }), nextProps.subtreeFlags = prevState.subtreeFlags & 1206910976, null !== dehydrated$96 ? showFallback = createWorkInProgress(dehydrated$96, showFallback) : (showFallback = createFiberFromFragment(showFallback, didSuspend, renderLanes2, null), showFallback.flags |= 2), showFallback.return = workInProgress2, nextProps.return = workInProgress2, nextProps.sibling = showFallback, workInProgress2.child = nextProps, bailoutOffscreenComponent(null, nextProps), nextProps = workInProgress2.child, showFallback = current.child.memoizedState, null === showFallback ? showFallback = mountSuspenseOffscreenState(renderLanes2) : (didSuspend = showFallback.cachePool, null !== didSuspend ? (prevState = CacheContext._currentValue, didSuspend = didSuspend.parent !== prevState ? { parent: prevState, pool: prevState } : didSuspend) : didSuspend = getSuspendedCache(), showFallback = {
        baseLanes: showFallback.baseLanes | renderLanes2,
        cachePool: didSuspend
      }), nextProps.memoizedState = showFallback, nextProps.childLanes = getRemainingWorkInPrimaryTree(current, JSCompiler_temp, renderLanes2), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(current.child, nextProps);
    pushPrimaryTreeSuspenseHandler(workInProgress2);
    renderLanes2 = current.child;
    current = renderLanes2.sibling;
    renderLanes2 = createWorkInProgress(renderLanes2, {
      mode: "visible",
      children: nextProps.children
    });
    renderLanes2.return = workInProgress2;
    renderLanes2.sibling = null;
    null !== current && (JSCompiler_temp = workInProgress2.deletions, null === JSCompiler_temp ? (workInProgress2.deletions = [current], workInProgress2.flags |= 16) : JSCompiler_temp.push(current));
    workInProgress2.child = renderLanes2;
    workInProgress2.memoizedState = null;
    return renderLanes2;
  }
  function mountSuspensePrimaryChildren(workInProgress2, primaryChildren) {
    primaryChildren = mountWorkInProgressOffscreenFiber({ mode: "visible", children: primaryChildren }, workInProgress2.mode);
    primaryChildren.return = workInProgress2;
    return workInProgress2.child = primaryChildren;
  }
  function mountWorkInProgressOffscreenFiber(offscreenProps, mode) {
    offscreenProps = createFiberImplClass(22, offscreenProps, null, mode);
    offscreenProps.lanes = 0;
    return offscreenProps;
  }
  function retrySuspenseComponentWithoutHydrating(current, workInProgress2, renderLanes2) {
    reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
    current = mountSuspensePrimaryChildren(workInProgress2, workInProgress2.pendingProps.children);
    current.flags |= 2;
    workInProgress2.memoizedState = null;
    return current;
  }
  function updateDehydratedSuspenseComponent(current, workInProgress2, didSuspend, didPrimaryChildrenDefer, nextProps, suspenseInstance, suspenseState, renderLanes2) {
    if (didSuspend) {
      if (workInProgress2.flags & 256)
        return pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags &= -257, retrySuspenseComponentWithoutHydrating(current, workInProgress2, renderLanes2);
      if (null !== workInProgress2.memoizedState)
        return reuseSuspenseHandlerOnStack(), workInProgress2.child = current.child, workInProgress2.flags |= 128, null;
      reuseSuspenseHandlerOnStack();
      suspenseInstance = nextProps.fallback;
      suspenseState = workInProgress2.mode;
      nextProps = mountWorkInProgressOffscreenFiber({ mode: "visible", children: nextProps.children }, suspenseState);
      suspenseInstance = createFiberFromFragment(suspenseInstance, suspenseState, renderLanes2, null);
      suspenseInstance.flags |= 2;
      nextProps.return = workInProgress2;
      suspenseInstance.return = workInProgress2;
      nextProps.sibling = suspenseInstance;
      workInProgress2.child = nextProps;
      reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
      nextProps = workInProgress2.child;
      nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2);
      nextProps.childLanes = getRemainingWorkInPrimaryTree(current, didPrimaryChildrenDefer, renderLanes2);
      workInProgress2.memoizedState = SUSPENDED_MARKER;
      return bailoutOffscreenComponent(null, nextProps);
    }
    pushPrimaryTreeSuspenseHandler(workInProgress2);
    if (isSuspenseInstanceFallback(suspenseInstance)) {
      didPrimaryChildrenDefer = suspenseInstance.nextSibling && suspenseInstance.nextSibling.dataset;
      if (didPrimaryChildrenDefer)
        var digest = didPrimaryChildrenDefer.dgst;
      didPrimaryChildrenDefer = digest;
      "" !== didPrimaryChildrenDefer && (nextProps = Error(formatProdErrorMessage(419)), nextProps.stack = "", nextProps.digest = didPrimaryChildrenDefer, queueHydrationError({ value: nextProps, source: null, stack: null }));
      return retrySuspenseComponentWithoutHydrating(current, workInProgress2, renderLanes2);
    }
    didReceiveUpdate || propagateParentContextChanges(current, workInProgress2, renderLanes2, false);
    didPrimaryChildrenDefer = 0 !== (renderLanes2 & current.childLanes);
    if (didReceiveUpdate || didPrimaryChildrenDefer) {
      if (null !== currentTreeHiddenStackCursor.current)
        return retrySuspenseComponentWithoutHydrating(current, workInProgress2, renderLanes2);
      didPrimaryChildrenDefer = workInProgressRoot;
      if (null !== didPrimaryChildrenDefer && (nextProps = getBumpedLaneForHydration(didPrimaryChildrenDefer, renderLanes2), 0 !== nextProps && nextProps !== suspenseState.retryLane))
        throw suspenseState.retryLane = nextProps, enqueueConcurrentRenderForLane(current, nextProps), scheduleUpdateOnFiber(didPrimaryChildrenDefer, current, nextProps), SelectiveHydrationException;
      isSuspenseInstancePending(suspenseInstance) || renderDidSuspendDelayIfPossible();
      return retrySuspenseComponentWithoutHydrating(current, workInProgress2, renderLanes2);
    }
    if (isSuspenseInstancePending(suspenseInstance))
      return workInProgress2.flags |= 192, workInProgress2.child = current.child, null;
    current = suspenseState.treeContext;
    nextHydratableInstance = getNextHydratable(suspenseInstance.nextSibling);
    hydrationParentFiber = workInProgress2;
    isHydrating = true;
    hydrationErrors = null;
    rootOrSingletonContext = false;
    null !== current && restoreSuspendedTreeContext(workInProgress2, current);
    workInProgress2 = mountSuspensePrimaryChildren(workInProgress2, nextProps.children);
    workInProgress2.flags |= 134221824;
    return workInProgress2;
  }
  function scheduleSuspenseWorkOnFiber(fiber, renderLanes2, propagationRoot) {
    fiber.lanes |= renderLanes2;
    var alternate = fiber.alternate;
    null !== alternate && (alternate.lanes |= renderLanes2);
    scheduleContextWorkOnParentPath(fiber.return, renderLanes2, propagationRoot);
  }
  function findLastContentRow(firstChild) {
    for (var lastContentRow = null; null !== firstChild; ) {
      var currentRow = firstChild.alternate;
      null !== currentRow && null === findFirstSuspended(currentRow) && (lastContentRow = firstChild);
      firstChild = firstChild.sibling;
    }
    return lastContentRow;
  }
  function initSuspenseListRenderState(workInProgress2, isBackwards, tail, lastContentRow, tailMode, treeForkCount2) {
    var renderState = workInProgress2.memoizedState;
    null === renderState ? workInProgress2.memoizedState = {
      isBackwards,
      rendering: null,
      renderingStartTime: 0,
      last: lastContentRow,
      tail,
      tailMode,
      treeForkCount: treeForkCount2
    } : (renderState.isBackwards = isBackwards, renderState.rendering = null, renderState.renderingStartTime = 0, renderState.last = lastContentRow, renderState.tail = tail, renderState.tailMode = tailMode, renderState.treeForkCount = treeForkCount2);
  }
  function reverseChildren(fiber) {
    var row = fiber.child;
    for (fiber.child = null; null !== row; ) {
      var nextRow = row.sibling;
      row.sibling = fiber.child;
      fiber.child = row;
      row = nextRow;
    }
  }
  function updateSuspenseListComponent(current, workInProgress2, renderLanes2) {
    var nextProps = workInProgress2.pendingProps, revealOrder = nextProps.revealOrder, tailMode = nextProps.tail;
    nextProps = nextProps.children;
    var suspenseContext = suspenseStackCursor.current;
    if (workInProgress2.flags & 128)
      return pushSuspenseListContext(workInProgress2, suspenseContext), null;
    var shouldForceFallback = 0 !== (suspenseContext & 2);
    shouldForceFallback ? (suspenseContext = suspenseContext & 1 | 2, workInProgress2.flags |= 128) : suspenseContext &= 1;
    pushSuspenseListContext(workInProgress2, suspenseContext);
    "backwards" === revealOrder && null !== current ? (reverseChildren(current), reconcileChildren(current, workInProgress2, nextProps, renderLanes2), reverseChildren(current)) : reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
    nextProps = isHydrating ? treeForkCount : 0;
    if (!shouldForceFallback && null !== current && 0 !== (current.flags & 128))
      a: for (current = workInProgress2.child; null !== current; ) {
        if (13 === current.tag)
          null !== current.memoizedState && scheduleSuspenseWorkOnFiber(current, renderLanes2, workInProgress2);
        else if (19 === current.tag)
          scheduleSuspenseWorkOnFiber(current, renderLanes2, workInProgress2);
        else if (null !== current.child) {
          current.child.return = current;
          current = current.child;
          continue;
        }
        if (current === workInProgress2)
          break a;
        for (; null === current.sibling; ) {
          if (null === current.return || current.return === workInProgress2)
            break a;
          current = current.return;
        }
        current.sibling.return = current.return;
        current = current.sibling;
      }
    switch (revealOrder) {
      case "backwards":
        renderLanes2 = findLastContentRow(workInProgress2.child);
        null === renderLanes2 ? (revealOrder = workInProgress2.child, workInProgress2.child = null) : (revealOrder = renderLanes2.sibling, renderLanes2.sibling = null, reverseChildren(workInProgress2));
        initSuspenseListRenderState(workInProgress2, true, revealOrder, null, tailMode, nextProps);
        break;
      case "unstable_legacy-backwards":
        renderLanes2 = null;
        revealOrder = workInProgress2.child;
        for (workInProgress2.child = null; null !== revealOrder; ) {
          current = revealOrder.alternate;
          if (null !== current && null === findFirstSuspended(current)) {
            workInProgress2.child = revealOrder;
            break;
          }
          current = revealOrder.sibling;
          revealOrder.sibling = renderLanes2;
          renderLanes2 = revealOrder;
          revealOrder = current;
        }
        initSuspenseListRenderState(workInProgress2, true, renderLanes2, null, tailMode, nextProps);
        break;
      case "together":
        initSuspenseListRenderState(workInProgress2, false, null, null, void 0, nextProps);
        break;
      case "independent":
        workInProgress2.memoizedState = null;
        break;
      default:
        renderLanes2 = findLastContentRow(workInProgress2.child), null === renderLanes2 ? (revealOrder = workInProgress2.child, workInProgress2.child = null) : (revealOrder = renderLanes2.sibling, renderLanes2.sibling = null), initSuspenseListRenderState(workInProgress2, false, revealOrder, renderLanes2, tailMode, nextProps);
    }
    return workInProgress2.child;
  }
  function updateContextProvider(current, workInProgress2, renderLanes2) {
    var newProps = workInProgress2.pendingProps;
    pushProvider(workInProgress2, workInProgress2.type, newProps.value);
    reconcileChildren(current, workInProgress2, newProps.children, renderLanes2);
    return workInProgress2.child;
  }
  function bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2) {
    null !== current && (workInProgress2.dependencies = current.dependencies);
    workInProgressRootSkippedLanes |= workInProgress2.lanes;
    if (0 === (renderLanes2 & workInProgress2.childLanes))
      if (null !== current) {
        if (propagateParentContextChanges(current, workInProgress2, renderLanes2, false), 0 === (renderLanes2 & workInProgress2.childLanes))
          return null;
      } else
        return null;
    if (null !== current && workInProgress2.child !== current.child)
      throw Error(formatProdErrorMessage(153));
    if (null !== workInProgress2.child) {
      current = workInProgress2.child;
      renderLanes2 = createWorkInProgress(current, current.pendingProps);
      workInProgress2.child = renderLanes2;
      for (renderLanes2.return = workInProgress2; null !== current.sibling; )
        current = current.sibling, renderLanes2 = renderLanes2.sibling = createWorkInProgress(current, current.pendingProps), renderLanes2.return = workInProgress2;
      renderLanes2.sibling = null;
    }
    return workInProgress2.child;
  }
  function checkScheduledUpdateOrContext(current, renderLanes2) {
    if (0 !== (current.lanes & renderLanes2))
      return true;
    current = current.dependencies;
    return null !== current && checkIfContextChanged(current) ? true : false;
  }
  function attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress2, renderLanes2) {
    switch (workInProgress2.tag) {
      case 3:
        pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
        pushProvider(workInProgress2, CacheContext, current.memoizedState.cache);
        resetHydrationState();
        break;
      case 27:
      case 5:
        pushHostContext(workInProgress2);
        break;
      case 4:
        pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
        break;
      case 10:
        pushProvider(workInProgress2, workInProgress2.type, workInProgress2.memoizedProps.value);
        break;
      case 31:
        if (null !== workInProgress2.memoizedState)
          return workInProgress2.flags |= 128, pushDehydratedActivitySuspenseHandler(workInProgress2), null;
        break;
      case 13:
        var state$108 = workInProgress2.memoizedState;
        if (null !== state$108) {
          if (null !== state$108.dehydrated)
            return pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags |= 128, null;
          state$108 = propagateParentContextChanges(current, workInProgress2, renderLanes2, false);
          var primaryChildLanes = workInProgress2.child.childLanes;
          if (state$108 || 0 !== (renderLanes2 & primaryChildLanes))
            return updateSuspenseComponent(current, workInProgress2, renderLanes2);
          pushPrimaryTreeSuspenseHandler(workInProgress2);
          current = bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
          return null !== current ? current.sibling : null;
        }
        pushPrimaryTreeSuspenseHandler(workInProgress2);
        break;
      case 19:
        if (workInProgress2.flags & 128)
          return updateSuspenseListComponent(current, workInProgress2, renderLanes2);
        primaryChildLanes = 0 !== (current.flags & 128);
        state$108 = 0 !== (renderLanes2 & workInProgress2.childLanes);
        state$108 || (propagateParentContextChanges(current, workInProgress2, renderLanes2, false), state$108 = 0 !== (renderLanes2 & workInProgress2.childLanes));
        if (primaryChildLanes) {
          if (state$108)
            return updateSuspenseListComponent(current, workInProgress2, renderLanes2);
          workInProgress2.flags |= 128;
        }
        primaryChildLanes = workInProgress2.memoizedState;
        null !== primaryChildLanes && (primaryChildLanes.rendering = null, primaryChildLanes.tail = null, primaryChildLanes.lastEffect = null);
        pushSuspenseListContext(workInProgress2, suspenseStackCursor.current);
        if (state$108)
          break;
        else
          return null;
      case 22:
        return workInProgress2.lanes = 0, updateOffscreenComponent(current, workInProgress2, renderLanes2, workInProgress2.pendingProps);
      case 24:
        pushProvider(workInProgress2, CacheContext, current.memoizedState.cache);
    }
    return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
  }
  function beginWork(current, workInProgress2, renderLanes2) {
    if (null !== current)
      if (current.memoizedProps !== workInProgress2.pendingProps)
        didReceiveUpdate = true;
      else {
        if (!checkScheduledUpdateOrContext(current, renderLanes2) && 0 === (workInProgress2.flags & 128))
          return didReceiveUpdate = false, attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress2, renderLanes2);
        didReceiveUpdate = 0 !== (current.flags & 131072) ? true : false;
      }
    else
      didReceiveUpdate = false, isHydrating && 0 !== (workInProgress2.flags & 1048576) && pushTreeId(workInProgress2, treeForkCount, workInProgress2.index);
    workInProgress2.lanes = 0;
    switch (workInProgress2.tag) {
      case 16:
        a: {
          var props = workInProgress2.pendingProps;
          current = resolveLazy(workInProgress2.elementType);
          workInProgress2.type = current;
          if ("function" === typeof current)
            shouldConstruct(current) ? (props = resolveClassComponentProps(current, props), workInProgress2.tag = 1, workInProgress2 = updateClassComponent(null, workInProgress2, current, props, renderLanes2)) : (workInProgress2.tag = 0, workInProgress2 = updateFunctionComponent(null, workInProgress2, current, props, renderLanes2));
          else {
            if (void 0 !== current && null !== current) {
              var $$typeof = current.$$typeof;
              if ($$typeof === REACT_FORWARD_REF_TYPE) {
                workInProgress2.tag = 11;
                workInProgress2 = updateForwardRef(null, workInProgress2, current, props, renderLanes2);
                break a;
              } else if ($$typeof === REACT_MEMO_TYPE) {
                workInProgress2.tag = 14;
                workInProgress2 = updateMemoComponent(null, workInProgress2, current, props, renderLanes2);
                break a;
              } else if ($$typeof === REACT_CONTEXT_TYPE) {
                workInProgress2.tag = 10;
                workInProgress2.type = current;
                workInProgress2 = updateContextProvider(null, workInProgress2, renderLanes2);
                break a;
              }
            }
            workInProgress2 = getComponentNameFromType(current) || current;
            throw Error(formatProdErrorMessage(306, workInProgress2, ""));
          }
        }
        return workInProgress2;
      case 0:
        return updateFunctionComponent(current, workInProgress2, workInProgress2.type, workInProgress2.pendingProps, renderLanes2);
      case 1:
        return props = workInProgress2.type, $$typeof = resolveClassComponentProps(props, workInProgress2.pendingProps), updateClassComponent(current, workInProgress2, props, $$typeof, renderLanes2);
      case 3:
        a: {
          pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
          if (null === current)
            throw Error(formatProdErrorMessage(387));
          props = workInProgress2.pendingProps;
          var prevState = workInProgress2.memoizedState;
          $$typeof = prevState.element;
          cloneUpdateQueue(current, workInProgress2);
          processUpdateQueue(workInProgress2, props, null, renderLanes2);
          var nextState = workInProgress2.memoizedState;
          props = nextState.cache;
          pushProvider(workInProgress2, CacheContext, props);
          props !== prevState.cache && propagateContextChanges(workInProgress2, [CacheContext], renderLanes2, true);
          suspendIfUpdateReadFromEntangledAsyncAction();
          props = nextState.element;
          if (prevState.isDehydrated)
            if (prevState = {
              element: props,
              isDehydrated: false,
              cache: nextState.cache
            }, workInProgress2.updateQueue.baseState = prevState, workInProgress2.memoizedState = prevState, workInProgress2.flags & 256) {
              workInProgress2 = mountHostRootWithoutHydrating(current, workInProgress2, props, renderLanes2);
              break a;
            } else if (props !== $$typeof) {
              $$typeof = createCapturedValueAtFiber(Error(formatProdErrorMessage(424)), workInProgress2);
              queueHydrationError($$typeof);
              workInProgress2 = mountHostRootWithoutHydrating(current, workInProgress2, props, renderLanes2);
              break a;
            } else {
              current = workInProgress2.stateNode.containerInfo;
              switch (current.nodeType) {
                case 9:
                  current = current.body;
                  break;
                default:
                  current = "HTML" === current.nodeName ? current.ownerDocument.body : current;
              }
              nextHydratableInstance = getNextHydratable(current.firstChild);
              hydrationParentFiber = workInProgress2;
              isHydrating = true;
              hydrationErrors = null;
              rootOrSingletonContext = true;
              renderLanes2 = mountChildFibers(workInProgress2, null, props, renderLanes2);
              for (workInProgress2.child = renderLanes2; renderLanes2; )
                renderLanes2.flags = renderLanes2.flags & -3 | 134221824, renderLanes2 = renderLanes2.sibling;
            }
          else {
            resetHydrationState();
            if (props === $$typeof) {
              workInProgress2 = bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
              break a;
            }
            reconcileChildren(current, workInProgress2, props, renderLanes2);
          }
          workInProgress2 = workInProgress2.child;
        }
        return workInProgress2;
      case 26:
        return markRef(current, workInProgress2), null === current ? (renderLanes2 = getResource(workInProgress2.type, null, workInProgress2.pendingProps, null)) ? workInProgress2.memoizedState = renderLanes2 : isHydrating || (workInProgress2.stateNode = createHoistableInstance(workInProgress2.type, workInProgress2.pendingProps, rootInstanceStackCursor.current, workInProgress2)) : workInProgress2.memoizedState = getResource(workInProgress2.type, current.memoizedProps, workInProgress2.pendingProps, current.memoizedState), null;
      case 27:
        return pushHostContext(workInProgress2), null === current && isHydrating && (props = workInProgress2.stateNode = resolveSingletonInstance(workInProgress2.type, workInProgress2.pendingProps, rootInstanceStackCursor.current), hydrationParentFiber = workInProgress2, rootOrSingletonContext = true, $$typeof = nextHydratableInstance, isSingletonScope(workInProgress2.type) ? (previousHydratableOnEnteringScopedSingleton = $$typeof, nextHydratableInstance = getNextHydratable(props.firstChild)) : nextHydratableInstance = $$typeof), reconcileChildren(current, workInProgress2, workInProgress2.pendingProps.children, renderLanes2), markRef(current, workInProgress2), null === current && (workInProgress2.flags |= 4194304), workInProgress2.child;
      case 5:
        if (null === current && isHydrating) {
          if ($$typeof = props = nextHydratableInstance)
            props = canHydrateInstance(props, workInProgress2.type, workInProgress2.pendingProps, rootOrSingletonContext), null !== props ? (workInProgress2.stateNode = props, hydrationParentFiber = workInProgress2, nextHydratableInstance = getNextHydratable(props.firstChild), rootOrSingletonContext = false, $$typeof = true) : $$typeof = false;
          $$typeof || throwOnHydrationMismatch(workInProgress2);
        }
        pushHostContext(workInProgress2);
        $$typeof = workInProgress2.type;
        prevState = workInProgress2.pendingProps;
        nextState = null !== current ? current.memoizedProps : null;
        props = prevState.children;
        shouldSetTextContent($$typeof, prevState) ? props = null : null !== nextState && shouldSetTextContent($$typeof, nextState) && (workInProgress2.flags |= 32);
        null !== workInProgress2.memoizedState && ($$typeof = renderWithHooks(current, workInProgress2, TransitionAwareHostComponent, null, null, renderLanes2), HostTransitionContext._currentValue = $$typeof);
        markRef(current, workInProgress2);
        reconcileChildren(current, workInProgress2, props, renderLanes2);
        return workInProgress2.child;
      case 6:
        if (null === current && isHydrating) {
          if (current = renderLanes2 = nextHydratableInstance)
            renderLanes2 = canHydrateTextInstance(renderLanes2, workInProgress2.pendingProps, rootOrSingletonContext), null !== renderLanes2 ? (workInProgress2.stateNode = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null, current = true) : current = false;
          current || throwOnHydrationMismatch(workInProgress2);
        }
        return null;
      case 13:
        return updateSuspenseComponent(current, workInProgress2, renderLanes2);
      case 4:
        return pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo), props = workInProgress2.pendingProps, null === current ? workInProgress2.child = reconcileChildFibers(workInProgress2, null, props, renderLanes2) : reconcileChildren(current, workInProgress2, props, renderLanes2), workInProgress2.child;
      case 11:
        return updateForwardRef(current, workInProgress2, workInProgress2.type, workInProgress2.pendingProps, renderLanes2);
      case 7:
        return props = workInProgress2.pendingProps, markRef(current, workInProgress2), reconcileChildren(current, workInProgress2, props, renderLanes2), workInProgress2.child;
      case 8:
        return reconcileChildren(current, workInProgress2, workInProgress2.pendingProps.children, renderLanes2), workInProgress2.child;
      case 12:
        return reconcileChildren(current, workInProgress2, workInProgress2.pendingProps.children, renderLanes2), workInProgress2.child;
      case 10:
        return updateContextProvider(current, workInProgress2, renderLanes2);
      case 9:
        return $$typeof = workInProgress2.type._context, props = workInProgress2.pendingProps.children, prepareToReadContext(workInProgress2), $$typeof = readContext($$typeof), props = props($$typeof), workInProgress2.flags |= 1, reconcileChildren(current, workInProgress2, props, renderLanes2), workInProgress2.child;
      case 14:
        return updateMemoComponent(current, workInProgress2, workInProgress2.type, workInProgress2.pendingProps, renderLanes2);
      case 15:
        return updateSimpleMemoComponent(current, workInProgress2, workInProgress2.type, workInProgress2.pendingProps, renderLanes2);
      case 19:
        return updateSuspenseListComponent(current, workInProgress2, renderLanes2);
      case 31:
        return updateActivityComponent(current, workInProgress2, renderLanes2);
      case 22:
        return updateOffscreenComponent(current, workInProgress2, renderLanes2, workInProgress2.pendingProps);
      case 24:
        return prepareToReadContext(workInProgress2), props = readContext(CacheContext), null === current ? ($$typeof = peekCacheFromPool(), null === $$typeof && ($$typeof = workInProgressRoot, prevState = createCache(), $$typeof.pooledCache = prevState, prevState.refCount++, null !== prevState && ($$typeof.pooledCacheLanes |= renderLanes2), $$typeof = prevState), workInProgress2.memoizedState = { parent: props, cache: $$typeof }, initializeUpdateQueue(workInProgress2), pushProvider(workInProgress2, CacheContext, $$typeof)) : (0 !== (current.lanes & renderLanes2) && (cloneUpdateQueue(current, workInProgress2), processUpdateQueue(workInProgress2, null, null, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction()), $$typeof = current.memoizedState, prevState = workInProgress2.memoizedState, $$typeof.parent !== props ? ($$typeof = { parent: props, cache: props }, workInProgress2.memoizedState = $$typeof, 0 === workInProgress2.lanes && (workInProgress2.memoizedState = workInProgress2.updateQueue.baseState = $$typeof), pushProvider(workInProgress2, CacheContext, props)) : (props = prevState.cache, pushProvider(workInProgress2, CacheContext, props), props !== $$typeof.cache && propagateContextChanges(workInProgress2, [CacheContext], renderLanes2, true))), reconcileChildren(current, workInProgress2, workInProgress2.pendingProps.children, renderLanes2), workInProgress2.child;
      case 30:
        return null === workInProgress2.stateNode && (workInProgress2.stateNode = {
          autoName: null,
          paired: null,
          clones: null,
          ref: null
        }), props = workInProgress2.pendingProps, null != props.name && "auto" !== props.name ? workInProgress2.flags |= null === current ? 18882560 : 18874368 : isHydrating && pushMaterializedTreeId(workInProgress2), null !== current && current.memoizedProps.name !== props.name ? workInProgress2.flags |= 4194816 : markRef(current, workInProgress2), reconcileChildren(current, workInProgress2, props.children, renderLanes2), workInProgress2.child;
      case 29:
        throw workInProgress2.pendingProps;
    }
    throw Error(formatProdErrorMessage(156, workInProgress2.tag));
  }
  function markUpdate(workInProgress2) {
    workInProgress2.flags |= 4;
  }
  function preloadInstanceAndSuspendIfNeeded(workInProgress2, type, oldProps, newProps, renderLanes2) {
    var JSCompiler_temp;
    if (JSCompiler_temp = 0 !== (workInProgress2.mode & 32))
      JSCompiler_temp = null === oldProps ? maySuspendCommit(type, newProps) : maySuspendCommit(type, newProps) && (newProps.src !== oldProps.src || newProps.srcSet !== oldProps.srcSet);
    if (JSCompiler_temp) {
      if (workInProgress2.flags |= 16777216, (renderLanes2 & 335544128) === renderLanes2)
        if (workInProgress2.stateNode.complete)
          workInProgress2.flags |= 8192;
        else if (shouldRemainOnPreviousScreen())
          workInProgress2.flags |= 8192;
        else
          throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
    } else
      workInProgress2.flags &= -16777217;
  }
  function preloadResourceAndSuspendIfNeeded(workInProgress2, resource) {
    if ("stylesheet" !== resource.type || 0 !== (resource.state.loading & 4))
      workInProgress2.flags &= -16777217;
    else if (workInProgress2.flags |= 16777216, !preloadResource(resource))
      if (shouldRemainOnPreviousScreen())
        workInProgress2.flags |= 8192;
      else
        throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
  }
  function scheduleRetryEffect(workInProgress2, retryQueue) {
    null !== retryQueue && (workInProgress2.flags |= 4);
    workInProgress2.flags & 16384 && (retryQueue = 22 !== workInProgress2.tag ? claimNextRetryLane() : 536870912, workInProgress2.lanes |= retryQueue, workInProgressSuspendedRetryLanes |= retryQueue);
  }
  function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
    if (!isHydrating)
      switch (renderState.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var tailNode = renderState.tail, lastTailNode = null; null !== tailNode; )
            null !== tailNode.alternate && (lastTailNode = tailNode), tailNode = tailNode.sibling;
          null === lastTailNode ? hasRenderedATailFallback || null === renderState.tail ? renderState.tail = null : renderState.tail.sibling = null : lastTailNode.sibling = null;
          break;
        default:
          hasRenderedATailFallback = renderState.tail;
          for (tailNode = null; null !== hasRenderedATailFallback; )
            null !== hasRenderedATailFallback.alternate && (tailNode = hasRenderedATailFallback), hasRenderedATailFallback = hasRenderedATailFallback.sibling;
          null === tailNode ? renderState.tail = null : tailNode.sibling = null;
      }
  }
  function bubbleProperties(completedWork) {
    var didBailout = null !== completedWork.alternate && completedWork.alternate.child === completedWork.child, newChildLanes = 0, subtreeFlags = 0;
    if (didBailout)
      for (var child$113 = completedWork.child; null !== child$113; )
        newChildLanes |= child$113.lanes | child$113.childLanes, subtreeFlags |= child$113.subtreeFlags & 1206910976, subtreeFlags |= child$113.flags & 1206910976, child$113.return = completedWork, child$113 = child$113.sibling;
    else
      for (child$113 = completedWork.child; null !== child$113; )
        newChildLanes |= child$113.lanes | child$113.childLanes, subtreeFlags |= child$113.subtreeFlags, subtreeFlags |= child$113.flags, child$113.return = completedWork, child$113 = child$113.sibling;
    completedWork.subtreeFlags |= subtreeFlags;
    completedWork.childLanes = newChildLanes;
    return didBailout;
  }
  function completeWork(current, workInProgress2, renderLanes2) {
    var newProps = workInProgress2.pendingProps;
    popTreeContext(workInProgress2);
    switch (workInProgress2.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return bubbleProperties(workInProgress2), null;
      case 1:
        return bubbleProperties(workInProgress2), null;
      case 3:
        renderLanes2 = workInProgress2.stateNode;
        newProps = null;
        null !== current && (newProps = current.memoizedState.cache);
        workInProgress2.memoizedState.cache !== newProps && (workInProgress2.flags |= 2048);
        popProvider(CacheContext);
        popHostContainer();
        renderLanes2.pendingContext && (renderLanes2.context = renderLanes2.pendingContext, renderLanes2.pendingContext = null);
        if (null === current || null === current.child)
          popHydrationState(workInProgress2) ? markUpdate(workInProgress2) : null === current || current.memoizedState.isDehydrated && 0 === (workInProgress2.flags & 256) || (workInProgress2.flags |= 1024, upgradeHydrationErrorsToRecoverable());
        bubbleProperties(workInProgress2);
        return null;
      case 26:
        var type = workInProgress2.type, nextResource = workInProgress2.memoizedState;
        null === current ? (markUpdate(workInProgress2), null !== nextResource ? (bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(workInProgress2, type, null, newProps, renderLanes2))) : nextResource ? nextResource !== current.memoizedState ? (markUpdate(workInProgress2), bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), workInProgress2.flags &= -16777217) : (current = current.memoizedProps, current !== newProps && markUpdate(workInProgress2), bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(workInProgress2, type, current, newProps, renderLanes2));
        return null;
      case 27:
        popHostContext(workInProgress2);
        renderLanes2 = rootInstanceStackCursor.current;
        type = workInProgress2.type;
        if (null !== current && null != workInProgress2.stateNode)
          current.memoizedProps !== newProps && markUpdate(workInProgress2);
        else {
          if (!newProps) {
            if (null === workInProgress2.stateNode)
              throw Error(formatProdErrorMessage(166));
            bubbleProperties(workInProgress2);
            workInProgress2.subtreeFlags &= -33554433;
            return null;
          }
          current = contextStackCursor.current;
          popHydrationState(workInProgress2) ? prepareToHydrateHostInstance(workInProgress2) : (current = resolveSingletonInstance(type, newProps, renderLanes2), workInProgress2.stateNode = current, markUpdate(workInProgress2));
        }
        bubbleProperties(workInProgress2);
        workInProgress2.subtreeFlags &= -33554433;
        return null;
      case 5:
        popHostContext(workInProgress2);
        type = workInProgress2.type;
        if (null !== current && null != workInProgress2.stateNode)
          current.memoizedProps !== newProps && markUpdate(workInProgress2);
        else {
          if (!newProps) {
            if (null === workInProgress2.stateNode)
              throw Error(formatProdErrorMessage(166));
            bubbleProperties(workInProgress2);
            workInProgress2.subtreeFlags &= -33554433;
            return null;
          }
          nextResource = contextStackCursor.current;
          if (popHydrationState(workInProgress2))
            prepareToHydrateHostInstance(workInProgress2);
          else {
            var ownerDocument = getOwnerDocumentFromRootContainer(rootInstanceStackCursor.current);
            switch (nextResource) {
              case 1:
                nextResource = ownerDocument.createElementNS("http://www.w3.org/2000/svg", type);
                break;
              case 2:
                nextResource = ownerDocument.createElementNS("http://www.w3.org/1998/Math/MathML", type);
                break;
              default:
                switch (type) {
                  case "svg":
                    nextResource = ownerDocument.createElementNS("http://www.w3.org/2000/svg", type);
                    break;
                  case "math":
                    nextResource = ownerDocument.createElementNS("http://www.w3.org/1998/Math/MathML", type);
                    break;
                  case "script":
                    nextResource = ownerDocument.createElement("div");
                    nextResource.innerHTML = "<script><\/script>";
                    nextResource = nextResource.removeChild(nextResource.firstChild);
                    break;
                  case "select":
                    nextResource = "string" === typeof newProps.is ? ownerDocument.createElement("select", {
                      is: newProps.is
                    }) : ownerDocument.createElement("select");
                    newProps.multiple ? nextResource.multiple = true : newProps.size && (nextResource.size = newProps.size);
                    break;
                  default:
                    nextResource = "string" === typeof newProps.is ? ownerDocument.createElement(type, { is: newProps.is }) : ownerDocument.createElement(type);
                }
            }
            nextResource[internalInstanceKey] = workInProgress2;
            nextResource[internalPropsKey] = newProps;
            a: for (ownerDocument = workInProgress2.child; null !== ownerDocument; ) {
              if (5 === ownerDocument.tag || 6 === ownerDocument.tag)
                nextResource.appendChild(ownerDocument.stateNode);
              else if (4 !== ownerDocument.tag && 27 !== ownerDocument.tag && null !== ownerDocument.child) {
                ownerDocument.child.return = ownerDocument;
                ownerDocument = ownerDocument.child;
                continue;
              }
              if (ownerDocument === workInProgress2)
                break a;
              for (; null === ownerDocument.sibling; ) {
                if (null === ownerDocument.return || ownerDocument.return === workInProgress2)
                  break a;
                ownerDocument = ownerDocument.return;
              }
              ownerDocument.sibling.return = ownerDocument.return;
              ownerDocument = ownerDocument.sibling;
            }
            workInProgress2.stateNode = nextResource;
            a: switch (setInitialProperties(nextResource, type, newProps), type) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                newProps = !!newProps.autoFocus;
                break a;
              case "img":
                newProps = true;
                break a;
              default:
                newProps = false;
            }
            newProps && markUpdate(workInProgress2);
          }
        }
        bubbleProperties(workInProgress2);
        workInProgress2.subtreeFlags &= -33554433;
        preloadInstanceAndSuspendIfNeeded(workInProgress2, workInProgress2.type, null === current ? null : current.memoizedProps, workInProgress2.pendingProps, renderLanes2);
        return null;
      case 6:
        if (current && null != workInProgress2.stateNode)
          current.memoizedProps !== newProps && markUpdate(workInProgress2);
        else {
          if ("string" !== typeof newProps && null === workInProgress2.stateNode)
            throw Error(formatProdErrorMessage(166));
          current = rootInstanceStackCursor.current;
          if (popHydrationState(workInProgress2)) {
            current = workInProgress2.stateNode;
            renderLanes2 = workInProgress2.memoizedProps;
            newProps = null;
            type = hydrationParentFiber;
            if (null !== type)
              switch (type.tag) {
                case 27:
                case 5:
                  newProps = type.memoizedProps;
              }
            current[internalInstanceKey] = workInProgress2;
            current = current.nodeValue === renderLanes2 || null !== newProps && true === newProps.suppressHydrationWarning || checkForUnmatchedText(current.nodeValue, renderLanes2) ? true : false;
            current || throwOnHydrationMismatch(workInProgress2, true);
          } else
            current = getOwnerDocumentFromRootContainer(current).createTextNode(newProps), current[internalInstanceKey] = workInProgress2, workInProgress2.stateNode = current;
        }
        bubbleProperties(workInProgress2);
        return null;
      case 31:
        renderLanes2 = workInProgress2.memoizedState;
        if (null === current || null !== current.memoizedState) {
          newProps = popHydrationState(workInProgress2);
          if (null !== renderLanes2) {
            if (null === current) {
              if (!newProps)
                throw Error(formatProdErrorMessage(318));
              current = workInProgress2.memoizedState;
              current = null !== current ? current.dehydrated : null;
              if (!current)
                throw Error(formatProdErrorMessage(557));
              current[internalInstanceKey] = workInProgress2;
            } else
              resetHydrationState(), 0 === (workInProgress2.flags & 128) && (workInProgress2.memoizedState = null), workInProgress2.flags |= 4;
            bubbleProperties(workInProgress2);
            current = false;
          } else
            renderLanes2 = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = renderLanes2), current = true;
          if (!current) {
            if (workInProgress2.flags & 256)
              return popSuspenseHandler(workInProgress2), workInProgress2;
            popSuspenseHandler(workInProgress2);
            return null;
          }
          if (0 !== (workInProgress2.flags & 128))
            throw Error(formatProdErrorMessage(558));
        }
        bubbleProperties(workInProgress2);
        return null;
      case 13:
        newProps = workInProgress2.memoizedState;
        if (null === current || null !== current.memoizedState && null !== current.memoizedState.dehydrated) {
          type = popHydrationState(workInProgress2);
          if (null !== newProps && null !== newProps.dehydrated) {
            if (null === current) {
              if (!type)
                throw Error(formatProdErrorMessage(318));
              type = workInProgress2.memoizedState;
              type = null !== type ? type.dehydrated : null;
              if (!type)
                throw Error(formatProdErrorMessage(317));
              type[internalInstanceKey] = workInProgress2;
            } else
              resetHydrationState(), 0 === (workInProgress2.flags & 128) && (workInProgress2.memoizedState = null), workInProgress2.flags |= 4;
            bubbleProperties(workInProgress2);
            type = false;
          } else
            type = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = type), type = true;
          if (!type) {
            if (workInProgress2.flags & 256)
              return popSuspenseHandler(workInProgress2), workInProgress2;
            popSuspenseHandler(workInProgress2);
            return null;
          }
        }
        popSuspenseHandler(workInProgress2);
        if (0 !== (workInProgress2.flags & 128))
          return workInProgress2.lanes = renderLanes2, workInProgress2;
        renderLanes2 = null !== newProps;
        current = null !== current && null !== current.memoizedState;
        renderLanes2 && (newProps = workInProgress2.child, type = null, null !== newProps.alternate && null !== newProps.alternate.memoizedState && null !== newProps.alternate.memoizedState.cachePool && (type = newProps.alternate.memoizedState.cachePool.pool), nextResource = null, null !== newProps.memoizedState && null !== newProps.memoizedState.cachePool && (nextResource = newProps.memoizedState.cachePool.pool), nextResource !== type && (newProps.flags |= 2048));
        renderLanes2 !== current && renderLanes2 && (workInProgress2.child.flags |= 8192);
        scheduleRetryEffect(workInProgress2, workInProgress2.updateQueue);
        bubbleProperties(workInProgress2);
        return null;
      case 4:
        return popHostContainer(), null === current && listenToAllSupportedEvents(workInProgress2.stateNode.containerInfo), workInProgress2.flags |= 67108864, bubbleProperties(workInProgress2), null;
      case 10:
        return popProvider(workInProgress2.type), bubbleProperties(workInProgress2), null;
      case 19:
        popSuspenseListContext(workInProgress2);
        newProps = workInProgress2.memoizedState;
        if (null === newProps)
          return bubbleProperties(workInProgress2), null;
        type = 0 !== (workInProgress2.flags & 128);
        nextResource = newProps.rendering;
        if (null === nextResource)
          if (type)
            cutOffTailIfNeeded(newProps, false);
          else {
            if (0 !== workInProgressRootExitStatus || null !== current && 0 !== (current.flags & 128))
              for (current = workInProgress2.child; null !== current; ) {
                nextResource = findFirstSuspended(current);
                if (null !== nextResource) {
                  workInProgress2.flags |= 128;
                  cutOffTailIfNeeded(newProps, false);
                  current = nextResource.updateQueue;
                  workInProgress2.updateQueue = current;
                  scheduleRetryEffect(workInProgress2, current);
                  workInProgress2.subtreeFlags = 0;
                  current = renderLanes2;
                  for (renderLanes2 = workInProgress2.child; null !== renderLanes2; )
                    resetWorkInProgress(renderLanes2, current), renderLanes2 = renderLanes2.sibling;
                  pushSuspenseListContext(workInProgress2, suspenseStackCursor.current & 1 | 2);
                  isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount);
                  return workInProgress2.child;
                }
                current = current.sibling;
              }
            null !== newProps.tail && now() > workInProgressRootRenderTargetTime && (workInProgress2.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress2.lanes = 4194304);
          }
        else {
          if (!type)
            if (current = findFirstSuspended(nextResource), null !== current) {
              if (workInProgress2.flags |= 128, type = true, current = current.updateQueue, workInProgress2.updateQueue = current, scheduleRetryEffect(workInProgress2, current), cutOffTailIfNeeded(newProps, true), null === newProps.tail && "collapsed" !== newProps.tailMode && "visible" !== newProps.tailMode && !nextResource.alternate && !isHydrating)
                return bubbleProperties(workInProgress2), null;
            } else
              2 * now() - newProps.renderingStartTime > workInProgressRootRenderTargetTime && 536870912 !== renderLanes2 && (workInProgress2.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress2.lanes = 4194304);
          newProps.isBackwards ? (nextResource.sibling = workInProgress2.child, workInProgress2.child = nextResource) : (current = newProps.last, null !== current ? current.sibling = nextResource : workInProgress2.child = nextResource, newProps.last = nextResource);
        }
        if (null !== newProps.tail) {
          current = newProps.tail;
          a: {
            for (renderLanes2 = current; null !== renderLanes2; ) {
              if (null !== renderLanes2.alternate) {
                renderLanes2 = false;
                break a;
              }
              renderLanes2 = renderLanes2.sibling;
            }
            renderLanes2 = true;
          }
          newProps.rendering = current;
          newProps.tail = current.sibling;
          newProps.renderingStartTime = now();
          current.sibling = null;
          nextResource = suspenseStackCursor.current;
          nextResource = type ? nextResource & 1 | 2 : nextResource & 1;
          "visible" === newProps.tailMode || "collapsed" === newProps.tailMode || !renderLanes2 || isHydrating ? pushSuspenseListContext(workInProgress2, nextResource) : (renderLanes2 = nextResource, push(suspenseHandlerStackCursor, workInProgress2), push(suspenseStackCursor, renderLanes2), null === shellBoundary && (shellBoundary = workInProgress2));
          isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount);
          return current;
        }
        bubbleProperties(workInProgress2);
        return null;
      case 22:
      case 23:
        return popSuspenseHandler(workInProgress2), popHiddenContext(), newProps = null !== workInProgress2.memoizedState, null !== current ? null !== current.memoizedState !== newProps && (workInProgress2.flags |= 8192) : newProps && (workInProgress2.flags |= 8192), newProps ? 0 !== (renderLanes2 & 536870912) && 0 === (workInProgress2.flags & 128) && (bubbleProperties(workInProgress2), workInProgress2.subtreeFlags & 6 && (workInProgress2.flags |= 8192)) : bubbleProperties(workInProgress2), renderLanes2 = workInProgress2.updateQueue, null !== renderLanes2 && scheduleRetryEffect(workInProgress2, renderLanes2.retryQueue), renderLanes2 = null, null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (renderLanes2 = current.memoizedState.cachePool.pool), newProps = null, null !== workInProgress2.memoizedState && null !== workInProgress2.memoizedState.cachePool && (newProps = workInProgress2.memoizedState.cachePool.pool), newProps !== renderLanes2 && (workInProgress2.flags |= 2048), null !== current && pop(resumedCache), null;
      case 24:
        return renderLanes2 = null, null !== current && (renderLanes2 = current.memoizedState.cache), workInProgress2.memoizedState.cache !== renderLanes2 && (workInProgress2.flags |= 2048), popProvider(CacheContext), bubbleProperties(workInProgress2), null;
      case 25:
        return null;
      case 30:
        return workInProgress2.flags |= 33554432, bubbleProperties(workInProgress2), null;
    }
    throw Error(formatProdErrorMessage(156, workInProgress2.tag));
  }
  function unwindWork(current, workInProgress2) {
    popTreeContext(workInProgress2);
    switch (workInProgress2.tag) {
      case 1:
        return current = workInProgress2.flags, current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
      case 3:
        return popProvider(CacheContext), popHostContainer(), current = workInProgress2.flags, 0 !== (current & 65536) && 0 === (current & 128) ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
      case 26:
      case 27:
      case 5:
        return popHostContext(workInProgress2), null;
      case 31:
        if (null !== workInProgress2.memoizedState) {
          popSuspenseHandler(workInProgress2);
          if (null === workInProgress2.alternate)
            throw Error(formatProdErrorMessage(340));
          resetHydrationState();
        }
        current = workInProgress2.flags;
        return current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
      case 13:
        popSuspenseHandler(workInProgress2);
        current = workInProgress2.memoizedState;
        if (null !== current && null !== current.dehydrated) {
          if (null === workInProgress2.alternate)
            throw Error(formatProdErrorMessage(340));
          resetHydrationState();
        }
        current = workInProgress2.flags;
        return current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
      case 19:
        return popSuspenseListContext(workInProgress2), current = workInProgress2.flags, current & 65536 ? (workInProgress2.flags = current & -65537 | 128, current = workInProgress2.memoizedState, null !== current && (current.rendering = null, current.tail = null), workInProgress2.flags |= 4, workInProgress2) : null;
      case 4:
        return popHostContainer(), null;
      case 10:
        return popProvider(workInProgress2.type), null;
      case 22:
      case 23:
        return popSuspenseHandler(workInProgress2), popHiddenContext(), null !== current && pop(resumedCache), current = workInProgress2.flags, current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
      case 24:
        return popProvider(CacheContext), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function unwindInterruptedWork(current, interruptedWork) {
    popTreeContext(interruptedWork);
    switch (interruptedWork.tag) {
      case 3:
        popProvider(CacheContext);
        popHostContainer();
        break;
      case 26:
      case 27:
      case 5:
        popHostContext(interruptedWork);
        break;
      case 4:
        popHostContainer();
        break;
      case 31:
        null !== interruptedWork.memoizedState && popSuspenseHandler(interruptedWork);
        break;
      case 13:
        popSuspenseHandler(interruptedWork);
        break;
      case 19:
        popSuspenseListContext(interruptedWork);
        break;
      case 10:
        popProvider(interruptedWork.type);
        break;
      case 22:
      case 23:
        popSuspenseHandler(interruptedWork);
        popHiddenContext();
        null !== current && pop(resumedCache);
        break;
      case 24:
        popProvider(CacheContext);
    }
  }
  function commitHookEffectListMount(flags, finishedWork) {
    try {
      var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
      if (null !== lastEffect) {
        var firstEffect = lastEffect.next;
        updateQueue = firstEffect;
        do {
          if ((updateQueue.tag & flags) === flags) {
            lastEffect = void 0;
            var create = updateQueue.create, inst = updateQueue.inst;
            lastEffect = create();
            inst.destroy = lastEffect;
          }
          updateQueue = updateQueue.next;
        } while (updateQueue !== firstEffect);
      }
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
  function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor$jscomp$0) {
    try {
      var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
      if (null !== lastEffect) {
        var firstEffect = lastEffect.next;
        updateQueue = firstEffect;
        do {
          if ((updateQueue.tag & flags) === flags) {
            var inst = updateQueue.inst, destroy = inst.destroy;
            if (void 0 !== destroy) {
              inst.destroy = void 0;
              lastEffect = finishedWork;
              var nearestMountedAncestor = nearestMountedAncestor$jscomp$0, destroy_ = destroy;
              try {
                destroy_();
              } catch (error) {
                captureCommitPhaseError(lastEffect, nearestMountedAncestor, error);
              }
            }
          }
          updateQueue = updateQueue.next;
        } while (updateQueue !== firstEffect);
      }
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
  function commitClassCallbacks(finishedWork) {
    var updateQueue = finishedWork.updateQueue;
    if (null !== updateQueue) {
      var instance = finishedWork.stateNode;
      try {
        commitCallbacks(updateQueue, instance);
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
  }
  function safelyCallComponentWillUnmount(current, nearestMountedAncestor, instance) {
    instance.props = resolveClassComponentProps(current.type, current.memoizedProps);
    instance.state = current.memoizedState;
    try {
      instance.componentWillUnmount();
    } catch (error) {
      captureCommitPhaseError(current, nearestMountedAncestor, error);
    }
  }
  function safelyAttachRef(current, nearestMountedAncestor) {
    try {
      var ref = current.ref;
      if (null !== ref) {
        switch (current.tag) {
          case 26:
          case 27:
          case 5:
            var instanceToUse = current.stateNode;
            break;
          case 30:
            var instance = current.stateNode, name = getViewTransitionName(current.memoizedProps, instance);
            if (null === instance.ref || instance.ref.name !== name)
              instance.ref = createViewTransitionInstance(name);
            instanceToUse = instance.ref;
            break;
          case 7:
            if (null === current.stateNode) {
              var fragmentInstance = new FragmentInstance(current);
              traverseVisibleInstancesAndTextInstances(current.child, false, addFragmentHandleToFiber, fragmentInstance, void 0, void 0);
              current.stateNode = fragmentInstance;
            }
            instanceToUse = current.stateNode;
            break;
          default:
            instanceToUse = current.stateNode;
        }
        "function" === typeof ref ? current.refCleanup = ref(instanceToUse) : ref.current = instanceToUse;
      }
    } catch (error) {
      captureCommitPhaseError(current, nearestMountedAncestor, error);
    }
  }
  function safelyDetachRef(current, nearestMountedAncestor) {
    var ref = current.ref, refCleanup = current.refCleanup;
    if (null !== ref)
      if ("function" === typeof refCleanup)
        try {
          refCleanup();
        } catch (error) {
          captureCommitPhaseError(current, nearestMountedAncestor, error);
        } finally {
          current.refCleanup = null, current = current.alternate, null != current && (current.refCleanup = null);
        }
      else if ("function" === typeof ref)
        try {
          ref(null);
        } catch (error$148) {
          captureCommitPhaseError(current, nearestMountedAncestor, error$148);
        }
      else
        ref.current = null;
  }
  function commitNewChildToFragmentInstances(fiber, parentFragmentInstances) {
    if ((5 === fiber.tag || 27 === fiber.tag || 6 === fiber.tag) && null === fiber.alternate && null !== parentFragmentInstances)
      for (var i = 0; i < parentFragmentInstances.length; i++)
        commitNewChildToFragmentInstance(fiber.stateNode, parentFragmentInstances[i]);
  }
  function commitFragmentInstanceInsertionEffects(fiber) {
    for (var parent = fiber.return; null !== parent; ) {
      isFragmentInstanceParent(parent) && commitNewChildToFragmentInstance(fiber.stateNode, parent.stateNode);
      if (isFragmentInstanceHostBoundary(parent))
        break;
      parent = parent.return;
    }
  }
  function commitFragmentInstanceDeletionEffects(fiber) {
    for (var parent = fiber.return; null !== parent; ) {
      isFragmentInstanceParent(parent) && deleteChildFromFragmentInstance(fiber.stateNode, parent.stateNode);
      if (isFragmentInstanceHostBoundary(parent))
        break;
      parent = parent.return;
    }
  }
  function isFragmentInstanceHostBoundary(fiber) {
    return 5 === fiber.tag || 3 === fiber.tag || 27 === fiber.tag;
  }
  function isFragmentInstanceParent(fiber) {
    return fiber && 7 === fiber.tag && null !== fiber.stateNode;
  }
  function commitHostMount(finishedWork) {
    var type = finishedWork.type, props = finishedWork.memoizedProps, instance = finishedWork.stateNode;
    try {
      a: switch (type) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          props.autoFocus && instance.focus();
          break a;
        case "img":
          props.src ? instance.src = props.src : props.srcSet && (instance.srcset = props.srcSet);
      }
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
  function commitHostUpdate(finishedWork, newProps, oldProps) {
    try {
      var domElement = finishedWork.stateNode;
      updateProperties(domElement, finishedWork.type, oldProps, newProps);
      domElement[internalPropsKey] = newProps;
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
  function isHostParent(fiber) {
    return 5 === fiber.tag || 3 === fiber.tag || 26 === fiber.tag || 27 === fiber.tag && isSingletonScope(fiber.type) || 4 === fiber.tag;
  }
  function getHostSibling(fiber) {
    a: for (; ; ) {
      for (; null === fiber.sibling; ) {
        if (null === fiber.return || isHostParent(fiber.return))
          return null;
        fiber = fiber.return;
      }
      fiber.sibling.return = fiber.return;
      for (fiber = fiber.sibling; 5 !== fiber.tag && 6 !== fiber.tag && 18 !== fiber.tag; ) {
        if (27 === fiber.tag && isSingletonScope(fiber.type))
          continue a;
        if (fiber.flags & 2)
          continue a;
        if (null === fiber.child || 4 === fiber.tag)
          continue a;
        else
          fiber.child.return = fiber, fiber = fiber.child;
      }
      if (!(fiber.flags & 2))
        return fiber.stateNode;
    }
  }
  function insertOrAppendPlacementNodeIntoContainer(node, before, parent, parentFragmentInstances) {
    var tag = node.tag;
    if (5 === tag || 6 === tag)
      tag = node.stateNode, before ? (9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent).insertBefore(tag, before) : (before = 9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent, before.appendChild(tag), parent = parent._reactRootContainer, null !== parent && void 0 !== parent || null !== before.onclick || (before.onclick = noop$1)), commitNewChildToFragmentInstances(node, parentFragmentInstances), viewTransitionMutationContext = true;
    else if (4 !== tag && (27 === tag && (commitNewChildToFragmentInstances(node, parentFragmentInstances), parentFragmentInstances = null, isSingletonScope(node.type) && (parent = node.stateNode, before = null)), node = node.child, null !== node))
      for (insertOrAppendPlacementNodeIntoContainer(node, before, parent, parentFragmentInstances), node = node.sibling; null !== node; )
        insertOrAppendPlacementNodeIntoContainer(node, before, parent, parentFragmentInstances), node = node.sibling;
  }
  function insertOrAppendPlacementNode(node, before, parent, parentFragmentInstances) {
    var tag = node.tag;
    if (5 === tag || 6 === tag)
      tag = node.stateNode, before ? parent.insertBefore(tag, before) : parent.appendChild(tag), commitNewChildToFragmentInstances(node, parentFragmentInstances), viewTransitionMutationContext = true;
    else if (4 !== tag && (27 === tag && (commitNewChildToFragmentInstances(node, parentFragmentInstances), parentFragmentInstances = null, isSingletonScope(node.type) && (parent = node.stateNode)), node = node.child, null !== node))
      for (insertOrAppendPlacementNode(node, before, parent, parentFragmentInstances), node = node.sibling; null !== node; )
        insertOrAppendPlacementNode(node, before, parent, parentFragmentInstances), node = node.sibling;
  }
  function commitHostSingletonAcquisition(finishedWork) {
    var singleton = finishedWork.stateNode, props = finishedWork.memoizedProps;
    try {
      for (var type = finishedWork.type, attributes = singleton.attributes; attributes.length; )
        singleton.removeAttributeNode(attributes[0]);
      setInitialProperties(singleton, type, props);
      singleton[internalInstanceKey] = finishedWork;
      singleton[internalPropsKey] = props;
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
  var shouldStartViewTransition = false, appearingViewTransitions = null;
  function trackEnterViewTransitions(placement) {
    if (30 === placement.tag || 0 !== (placement.subtreeFlags & 33554432))
      shouldStartViewTransition = true;
  }
  var viewTransitionCancelableChildren = null;
  function pushViewTransitionCancelableScope() {
    var prevChildren = viewTransitionCancelableChildren;
    viewTransitionCancelableChildren = null;
    return prevChildren;
  }
  var viewTransitionHostInstanceIdx = 0;
  function applyViewTransitionToHostInstances(fiber, name, className, collectMeasurements, stopAtNestedViewTransitions) {
    viewTransitionHostInstanceIdx = 0;
    return applyViewTransitionToHostInstancesRecursive(fiber.child, name, className, collectMeasurements, stopAtNestedViewTransitions);
  }
  function applyViewTransitionToHostInstancesRecursive(child, name, className, collectMeasurements, stopAtNestedViewTransitions) {
    for (var inViewport = false; null !== child; ) {
      if (5 === child.tag) {
        var instance = child.stateNode;
        if (null !== collectMeasurements) {
          var measurement = measureInstance(instance);
          collectMeasurements.push(measurement);
          measurement.view && (inViewport = true);
        } else
          inViewport || measureInstance(instance).view && (inViewport = true);
        shouldStartViewTransition = true;
        applyViewTransitionName(instance, 0 === viewTransitionHostInstanceIdx ? name : name + "_" + viewTransitionHostInstanceIdx, className);
        viewTransitionHostInstanceIdx++;
      } else if (22 !== child.tag || null === child.memoizedState)
        30 === child.tag && stopAtNestedViewTransitions || applyViewTransitionToHostInstancesRecursive(child.child, name, className, collectMeasurements, stopAtNestedViewTransitions) && (inViewport = true);
      child = child.sibling;
    }
    return inViewport;
  }
  function restoreViewTransitionOnHostInstances(child, stopAtNestedViewTransitions) {
    for (; null !== child; ) {
      if (5 === child.tag)
        restoreViewTransitionName(child.stateNode, child.memoizedProps);
      else if (22 !== child.tag || null === child.memoizedState)
        30 === child.tag && stopAtNestedViewTransitions || restoreViewTransitionOnHostInstances(child.child, stopAtNestedViewTransitions);
      child = child.sibling;
    }
  }
  function commitAppearingPairViewTransitions(placement) {
    if (0 !== (placement.subtreeFlags & 18874368))
      for (placement = placement.child; null !== placement; ) {
        if (22 !== placement.tag || null === placement.memoizedState) {
          if (commitAppearingPairViewTransitions(placement), 30 === placement.tag && 0 !== (placement.flags & 18874368) && placement.stateNode.paired) {
            var props = placement.memoizedProps;
            if (null == props.name || "auto" === props.name)
              throw Error(formatProdErrorMessage(544));
            var name = props.name;
            props = getViewTransitionClassName(props.default, props.share);
            "none" !== props && (applyViewTransitionToHostInstances(placement, name, props, null, false) || restoreViewTransitionOnHostInstances(placement.child, false));
          }
        }
        placement = placement.sibling;
      }
  }
  function commitEnterViewTransitions(placement, gesture) {
    if (30 === placement.tag) {
      var state = placement.stateNode, props = placement.memoizedProps, name = getViewTransitionName(props, state), className = getViewTransitionClassName(props.default, state.paired ? props.share : props.enter);
      "none" !== className ? applyViewTransitionToHostInstances(placement, name, className, null, false) ? (commitAppearingPairViewTransitions(placement), state.paired || gesture || scheduleViewTransitionEvent(placement, props.onEnter)) : restoreViewTransitionOnHostInstances(placement.child, false) : commitAppearingPairViewTransitions(placement);
    } else if (0 !== (placement.subtreeFlags & 33554432))
      for (placement = placement.child; null !== placement; )
        commitEnterViewTransitions(placement, gesture), placement = placement.sibling;
    else
      commitAppearingPairViewTransitions(placement);
  }
  function commitDeletedPairViewTransitions(deletion) {
    if (null !== appearingViewTransitions && 0 !== appearingViewTransitions.size) {
      var pairs = appearingViewTransitions;
      if (0 !== (deletion.subtreeFlags & 18874368))
        for (deletion = deletion.child; null !== deletion; ) {
          if (22 !== deletion.tag || null === deletion.memoizedState) {
            if (30 === deletion.tag && 0 !== (deletion.flags & 18874368)) {
              var props = deletion.memoizedProps, name = props.name;
              if (null != name && "auto" !== name) {
                var pair = pairs.get(name);
                if (void 0 !== pair) {
                  var className = getViewTransitionClassName(props.default, props.share);
                  "none" !== className && (applyViewTransitionToHostInstances(deletion, name, className, null, false) ? (className = deletion.stateNode, pair.paired = className, className.paired = pair, scheduleViewTransitionEvent(deletion, props.onShare)) : restoreViewTransitionOnHostInstances(deletion.child, false));
                  pairs.delete(name);
                  if (0 === pairs.size)
                    break;
                }
              }
            }
            commitDeletedPairViewTransitions(deletion);
          }
          deletion = deletion.sibling;
        }
    }
  }
  function commitExitViewTransitions(deletion) {
    if (30 === deletion.tag) {
      var props = deletion.memoizedProps, name = getViewTransitionName(props, deletion.stateNode), pair = null !== appearingViewTransitions ? appearingViewTransitions.get(name) : void 0, className = getViewTransitionClassName(props.default, void 0 !== pair ? props.share : props.exit);
      "none" !== className && (applyViewTransitionToHostInstances(deletion, name, className, null, false) ? void 0 !== pair ? (className = deletion.stateNode, pair.paired = className, className.paired = pair, appearingViewTransitions.delete(name), scheduleViewTransitionEvent(deletion, props.onShare)) : scheduleViewTransitionEvent(deletion, props.onExit) : restoreViewTransitionOnHostInstances(deletion.child, false));
      null !== appearingViewTransitions && commitDeletedPairViewTransitions(deletion);
    } else if (0 !== (deletion.subtreeFlags & 33554432))
      for (deletion = deletion.child; null !== deletion; )
        commitExitViewTransitions(deletion), deletion = deletion.sibling;
    else
      null !== appearingViewTransitions && commitDeletedPairViewTransitions(deletion);
  }
  function commitNestedViewTransitions(changedParent) {
    for (changedParent = changedParent.child; null !== changedParent; ) {
      if (30 === changedParent.tag) {
        var props = changedParent.memoizedProps, name = getViewTransitionName(props, changedParent.stateNode);
        props = getViewTransitionClassName(props.default, props.update);
        changedParent.flags &= -5;
        "none" !== props && applyViewTransitionToHostInstances(changedParent, name, props, changedParent.memoizedState = [], false);
      } else
        0 !== (changedParent.subtreeFlags & 33554432) && commitNestedViewTransitions(changedParent);
      changedParent = changedParent.sibling;
    }
  }
  function restorePairedViewTransitions(parent) {
    if (0 !== (parent.subtreeFlags & 18874368))
      for (parent = parent.child; null !== parent; ) {
        if (22 !== parent.tag || null === parent.memoizedState) {
          if (30 === parent.tag && 0 !== (parent.flags & 18874368)) {
            var instance = parent.stateNode;
            null !== instance.paired && (instance.paired = null, restoreViewTransitionOnHostInstances(parent.child, false));
          }
          restorePairedViewTransitions(parent);
        }
        parent = parent.sibling;
      }
  }
  function restoreEnterOrExitViewTransitions(fiber) {
    if (30 === fiber.tag)
      fiber.stateNode.paired = null, restoreViewTransitionOnHostInstances(fiber.child, false), restorePairedViewTransitions(fiber);
    else if (0 !== (fiber.subtreeFlags & 33554432))
      for (fiber = fiber.child; null !== fiber; )
        restoreEnterOrExitViewTransitions(fiber), fiber = fiber.sibling;
    else
      restorePairedViewTransitions(fiber);
  }
  function restoreNestedViewTransitions(changedParent) {
    for (changedParent = changedParent.child; null !== changedParent; )
      30 === changedParent.tag ? restoreViewTransitionOnHostInstances(changedParent.child, false) : 0 !== (changedParent.subtreeFlags & 33554432) && restoreNestedViewTransitions(changedParent), changedParent = changedParent.sibling;
  }
  function measureViewTransitionHostInstancesRecursive(parentViewTransition, child, newName, oldName, className, previousMeasurements, stopAtNestedViewTransitions) {
    for (var inViewport = false; null !== child; ) {
      if (5 === child.tag) {
        var instance = child.stateNode;
        if (null !== previousMeasurements && viewTransitionHostInstanceIdx < previousMeasurements.length) {
          var previousMeasurement = previousMeasurements[viewTransitionHostInstanceIdx], nextMeasurement = measureInstance(instance);
          if (previousMeasurement.view || nextMeasurement.view)
            inViewport = true;
          var JSCompiler_temp;
          if (JSCompiler_temp = 0 === (parentViewTransition.flags & 4))
            if (nextMeasurement.clip)
              JSCompiler_temp = true;
            else {
              JSCompiler_temp = previousMeasurement.rect;
              var newRect = nextMeasurement.rect;
              JSCompiler_temp = JSCompiler_temp.y !== newRect.y || JSCompiler_temp.x !== newRect.x || JSCompiler_temp.height !== newRect.height || JSCompiler_temp.width !== newRect.width;
            }
          JSCompiler_temp && (parentViewTransition.flags |= 4);
          nextMeasurement.abs ? nextMeasurement = !previousMeasurement.abs : (previousMeasurement = previousMeasurement.rect, nextMeasurement = nextMeasurement.rect, nextMeasurement = previousMeasurement.height !== nextMeasurement.height || previousMeasurement.width !== nextMeasurement.width);
          nextMeasurement && (parentViewTransition.flags |= 32);
        } else
          parentViewTransition.flags |= 32;
        0 !== (parentViewTransition.flags & 4) && applyViewTransitionName(instance, 0 === viewTransitionHostInstanceIdx ? newName : newName + "_" + viewTransitionHostInstanceIdx, className);
        inViewport && 0 !== (parentViewTransition.flags & 4) || (null === viewTransitionCancelableChildren && (viewTransitionCancelableChildren = []), viewTransitionCancelableChildren.push(instance, 0 === viewTransitionHostInstanceIdx ? oldName : oldName + "_" + viewTransitionHostInstanceIdx, child.memoizedProps));
        viewTransitionHostInstanceIdx++;
      } else if (22 !== child.tag || null === child.memoizedState)
        30 === child.tag && stopAtNestedViewTransitions ? parentViewTransition.flags |= child.flags & 32 : measureViewTransitionHostInstancesRecursive(parentViewTransition, child.child, newName, oldName, className, previousMeasurements, stopAtNestedViewTransitions) && (inViewport = true);
      child = child.sibling;
    }
    return inViewport;
  }
  function measureNestedViewTransitions(changedParent, gesture) {
    for (changedParent = changedParent.child; null !== changedParent; ) {
      if (30 === changedParent.tag) {
        var props = changedParent.memoizedProps, state = changedParent.stateNode, name = getViewTransitionName(props, state), className = getViewTransitionClassName(props.default, props.update);
        var previousMeasurements;
        previousMeasurements = changedParent.memoizedState, changedParent.memoizedState = null;
        state = changedParent;
        var child = changedParent.child;
        viewTransitionHostInstanceIdx = 0;
        name = measureViewTransitionHostInstancesRecursive(state, child, name, name, className, previousMeasurements, false);
        0 !== (changedParent.flags & 4) && name && scheduleViewTransitionEvent(changedParent, props.onUpdate);
      } else
        0 !== (changedParent.subtreeFlags & 33554432) && measureNestedViewTransitions(changedParent);
      changedParent = changedParent.sibling;
    }
  }
  var offscreenSubtreeIsHidden = false, offscreenSubtreeWasHidden = false, offscreenDirectParentIsHidden = false, needsFormReset = false, PossiblyWeakSet = "function" === typeof WeakSet ? WeakSet : Set, nextEffect = null, viewTransitionContextChanged = false, inUpdateViewTransition = false, rootViewTransitionAffected = false, rootViewTransitionNameCanceled = false;
  function commitBeforeMutationEffects(root2, firstChild, committedLanes) {
    root2 = root2.containerInfo;
    eventsEnabled = _enabled;
    root2 = getActiveElementDeep(root2);
    if (hasSelectionCapabilities(root2)) {
      if ("selectionStart" in root2)
        var JSCompiler_temp = {
          start: root2.selectionStart,
          end: root2.selectionEnd
        };
      else
        a: {
          JSCompiler_temp = (JSCompiler_temp = root2.ownerDocument) && JSCompiler_temp.defaultView || window;
          var selection = JSCompiler_temp.getSelection && JSCompiler_temp.getSelection();
          if (selection && 0 !== selection.rangeCount) {
            JSCompiler_temp = selection.anchorNode;
            var anchorOffset = selection.anchorOffset, focusNode = selection.focusNode;
            selection = selection.focusOffset;
            try {
              JSCompiler_temp.nodeType, focusNode.nodeType;
            } catch (e$21) {
              JSCompiler_temp = null;
              break a;
            }
            var length = 0, start = -1, end = -1, indexWithinAnchor = 0, indexWithinFocus = 0, node = root2, parentNode = null;
            b: for (; ; ) {
              for (var next; ; ) {
                node !== JSCompiler_temp || 0 !== anchorOffset && 3 !== node.nodeType || (start = length + anchorOffset);
                node !== focusNode || 0 !== selection && 3 !== node.nodeType || (end = length + selection);
                3 === node.nodeType && (length += node.nodeValue.length);
                if (null === (next = node.firstChild))
                  break;
                parentNode = node;
                node = next;
              }
              for (; ; ) {
                if (node === root2)
                  break b;
                parentNode === JSCompiler_temp && ++indexWithinAnchor === anchorOffset && (start = length);
                parentNode === focusNode && ++indexWithinFocus === selection && (end = length);
                if (null !== (next = node.nextSibling))
                  break;
                node = parentNode;
                parentNode = node.parentNode;
              }
              node = next;
            }
            JSCompiler_temp = -1 === start || -1 === end ? null : { start, end };
          } else
            JSCompiler_temp = null;
        }
      JSCompiler_temp = JSCompiler_temp || { start: 0, end: 0 };
    } else
      JSCompiler_temp = null;
    selectionInformation = { focusedElem: root2, selectionRange: JSCompiler_temp };
    _enabled = false;
    committedLanes = (committedLanes & 335544064) === committedLanes;
    nextEffect = firstChild;
    for (firstChild = committedLanes ? 9270 : 1024; null !== nextEffect; ) {
      root2 = nextEffect;
      if (committedLanes && (JSCompiler_temp = root2.deletions, null !== JSCompiler_temp))
        for (anchorOffset = 0; anchorOffset < JSCompiler_temp.length; anchorOffset++)
          committedLanes && commitExitViewTransitions(JSCompiler_temp[anchorOffset]);
      if (null === root2.alternate && 0 !== (root2.flags & 2))
        committedLanes && trackEnterViewTransitions(root2), commitBeforeMutationEffects_complete(committedLanes);
      else {
        if (22 === root2.tag) {
          if (JSCompiler_temp = root2.alternate, null !== root2.memoizedState) {
            null !== JSCompiler_temp && null === JSCompiler_temp.memoizedState && committedLanes && commitExitViewTransitions(JSCompiler_temp);
            commitBeforeMutationEffects_complete(committedLanes);
            continue;
          } else if (null !== JSCompiler_temp && null !== JSCompiler_temp.memoizedState) {
            committedLanes && trackEnterViewTransitions(root2);
            commitBeforeMutationEffects_complete(committedLanes);
            continue;
          }
        }
        JSCompiler_temp = root2.child;
        0 !== (root2.subtreeFlags & firstChild) && null !== JSCompiler_temp ? (JSCompiler_temp.return = root2, nextEffect = JSCompiler_temp) : (committedLanes && commitNestedViewTransitions(root2), commitBeforeMutationEffects_complete(committedLanes));
      }
    }
    appearingViewTransitions = null;
  }
  function commitBeforeMutationEffects_complete(isViewTransitionEligible$jscomp$0) {
    for (; null !== nextEffect; ) {
      var fiber = nextEffect, isViewTransitionEligible = isViewTransitionEligible$jscomp$0, current = fiber.alternate, flags = fiber.flags;
      switch (fiber.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (0 !== (flags & 1024) && null !== current) {
            isViewTransitionEligible = void 0;
            flags = current.memoizedProps;
            current = current.memoizedState;
            var instance = fiber.stateNode;
            try {
              var resolvedPrevProps = resolveClassComponentProps(fiber.type, flags);
              isViewTransitionEligible = instance.getSnapshotBeforeUpdate(resolvedPrevProps, current);
              instance.__reactInternalSnapshotBeforeUpdate = isViewTransitionEligible;
            } catch (error) {
              captureCommitPhaseError(fiber, fiber.return, error);
            }
          }
          break;
        case 3:
          if (0 !== (flags & 1024)) {
            if (current = fiber.stateNode.containerInfo, isViewTransitionEligible = current.nodeType, 9 === isViewTransitionEligible)
              clearContainerSparingly(current);
            else if (1 === isViewTransitionEligible)
              switch (current.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  clearContainerSparingly(current);
                  break;
                default:
                  current.textContent = "";
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          isViewTransitionEligible && null !== current && (isViewTransitionEligible = getViewTransitionName(current.memoizedProps, current.stateNode), flags = fiber.memoizedProps, flags = getViewTransitionClassName(flags.default, flags.update), "none" !== flags && applyViewTransitionToHostInstances(current, isViewTransitionEligible, flags, current.memoizedState = [], true));
          break;
        default:
          if (0 !== (flags & 1024))
            throw Error(formatProdErrorMessage(163));
      }
      current = fiber.sibling;
      if (null !== current) {
        current.return = fiber.return;
        nextEffect = current;
        break;
      }
      nextEffect = fiber.return;
    }
  }
  function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
    var flags = finishedWork.flags;
    switch (finishedWork.tag) {
      case 0:
      case 11:
      case 15:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        flags & 4 && commitHookEffectListMount(5, finishedWork);
        break;
      case 1:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        if (flags & 4)
          if (finishedRoot = finishedWork.stateNode, null === current)
            try {
              finishedRoot.componentDidMount();
            } catch (error) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
          else {
            var prevProps = resolveClassComponentProps(finishedWork.type, current.memoizedProps);
            current = current.memoizedState;
            try {
              finishedRoot.componentDidUpdate(prevProps, current, finishedRoot.__reactInternalSnapshotBeforeUpdate);
            } catch (error$146) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error$146);
            }
          }
        flags & 64 && commitClassCallbacks(finishedWork);
        flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
        break;
      case 3:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        if (flags & 64 && (finishedRoot = finishedWork.updateQueue, null !== finishedRoot)) {
          current = null;
          if (null !== finishedWork.child)
            switch (finishedWork.child.tag) {
              case 27:
              case 5:
                current = finishedWork.child.stateNode;
                break;
              case 1:
                current = finishedWork.child.stateNode;
            }
          try {
            commitCallbacks(finishedRoot, current);
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
        break;
      case 27:
        null === current && flags & 4 && commitHostSingletonAcquisition(finishedWork);
      case 26:
      case 5:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        null === current && flags & 4 && commitHostMount(finishedWork);
        flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
        break;
      case 12:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        break;
      case 31:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
        break;
      case 13:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
        flags & 64 && (finishedRoot = finishedWork.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot && (finishedWork = retryDehydratedSuspenseBoundary.bind(null, finishedWork), registerSuspenseInstanceRetry(finishedRoot, finishedWork))));
        break;
      case 22:
        flags = null !== finishedWork.memoizedState || offscreenSubtreeIsHidden;
        if (!flags) {
          var newOffscreenSubtreeWasHidden = null !== current && null !== current.memoizedState || offscreenSubtreeWasHidden;
          current = offscreenSubtreeIsHidden;
          prevProps = offscreenSubtreeWasHidden;
          offscreenSubtreeIsHidden = flags;
          (offscreenSubtreeWasHidden = newOffscreenSubtreeWasHidden) && !prevProps ? (flags = 2, 0 !== (finishedWork.subtreeFlags & 8772) && (flags |= 1), recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, flags)) : recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          offscreenSubtreeIsHidden = current;
          offscreenSubtreeWasHidden = prevProps;
        }
        break;
      case 30:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
        break;
      case 7:
        flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
      default:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
    }
  }
  function hideOrUnhideAllChildren(parentFiber, isHidden) {
    for (parentFiber = parentFiber.child; null !== parentFiber; )
      hideOrUnhideAllChildrenOnFiber(parentFiber, isHidden), parentFiber = parentFiber.sibling;
  }
  function hideOrUnhideAllChildrenOnFiber(fiber, isHidden) {
    switch (fiber.tag) {
      case 5:
      case 26:
        try {
          var instance = fiber.stateNode;
          if (isHidden) {
            var style2 = instance.style;
            "function" === typeof style2.setProperty ? style2.setProperty("display", "none", "important") : style2.display = "none";
          } else {
            var instance$jscomp$0 = fiber.stateNode, styleProp = fiber.memoizedProps.style, display = void 0 !== styleProp && null !== styleProp && styleProp.hasOwnProperty("display") ? styleProp.display : null;
            instance$jscomp$0.style.display = null == display || "boolean" === typeof display ? "" : ("" + display).trim();
          }
        } catch (error) {
          captureCommitPhaseError(fiber, fiber.return, error);
        }
        hideOrUnhideNearestPortals(fiber, isHidden);
        break;
      case 6:
        try {
          fiber.stateNode.nodeValue = isHidden ? "" : fiber.memoizedProps, viewTransitionMutationContext = true;
        } catch (error) {
          captureCommitPhaseError(fiber, fiber.return, error);
        }
        break;
      case 18:
        try {
          var instance$jscomp$1 = fiber.stateNode;
          isHidden ? hideOrUnhideDehydratedBoundary(instance$jscomp$1, true) : hideOrUnhideDehydratedBoundary(fiber.stateNode, false);
        } catch (error) {
          captureCommitPhaseError(fiber, fiber.return, error);
        }
        break;
      case 22:
      case 23:
        null === fiber.memoizedState && hideOrUnhideAllChildren(fiber, isHidden);
        break;
      default:
        hideOrUnhideAllChildren(fiber, isHidden);
    }
  }
  function hideOrUnhideNearestPortals(parentFiber, isHidden$jscomp$0) {
    if (parentFiber.subtreeFlags & 67108864)
      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
        a: {
          var fiber = parentFiber, isHidden = isHidden$jscomp$0;
          switch (fiber.tag) {
            case 4:
              hideOrUnhideAllChildrenOnFiber(fiber, isHidden);
              break a;
            case 22:
              null === fiber.memoizedState && hideOrUnhideNearestPortals(fiber, isHidden);
              break a;
            default:
              hideOrUnhideNearestPortals(fiber, isHidden);
          }
        }
        parentFiber = parentFiber.sibling;
      }
  }
  function detachFiberAfterEffects(fiber) {
    var alternate = fiber.alternate;
    null !== alternate && (fiber.alternate = null, detachFiberAfterEffects(alternate));
    fiber.child = null;
    fiber.deletions = null;
    fiber.sibling = null;
    5 === fiber.tag && (alternate = fiber.stateNode, null !== alternate && detachDeletedInstance(alternate));
    fiber.stateNode = null;
    fiber.return = null;
    fiber.dependencies = null;
    fiber.memoizedProps = null;
    fiber.memoizedState = null;
    fiber.pendingProps = null;
    fiber.stateNode = null;
    fiber.updateQueue = null;
  }
  var hostParent = null, hostParentIsContainer = false;
  function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
    for (parent = parent.child; null !== parent; )
      commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, parent), parent = parent.sibling;
  }
  function commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, deletedFiber) {
    if (injectedHook && "function" === typeof injectedHook.onCommitFiberUnmount)
      try {
        injectedHook.onCommitFiberUnmount(rendererID, deletedFiber);
      } catch (err) {
      }
    switch (deletedFiber.tag) {
      case 26:
        offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        deletedFiber.memoizedState ? deletedFiber.memoizedState.count-- : deletedFiber.stateNode && !offscreenSubtreeWasHidden && (deletedFiber = deletedFiber.stateNode, deletedFiber.parentNode.removeChild(deletedFiber));
        break;
      case 27:
        offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
        commitFragmentInstanceDeletionEffects(deletedFiber);
        var prevHostParent = hostParent, prevHostParentIsContainer = hostParentIsContainer;
        isSingletonScope(deletedFiber.type) && (hostParent = deletedFiber.stateNode, hostParentIsContainer = false);
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        releaseSingletonInstance(deletedFiber.stateNode, deletedFiber.type, deletedFiber.memoizedProps);
        hostParent = prevHostParent;
        hostParentIsContainer = prevHostParentIsContainer;
        break;
      case 5:
        offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor), commitFragmentInstanceDeletionEffects(deletedFiber);
      case 6:
        6 === deletedFiber.tag && commitFragmentInstanceDeletionEffects(deletedFiber);
        prevHostParent = hostParent;
        prevHostParentIsContainer = hostParentIsContainer;
        hostParent = null;
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        hostParent = prevHostParent;
        hostParentIsContainer = prevHostParentIsContainer;
        if (null !== hostParent)
          if (hostParentIsContainer)
            try {
              (9 === hostParent.nodeType ? hostParent.body : "HTML" === hostParent.nodeName ? hostParent.ownerDocument.body : hostParent).removeChild(deletedFiber.stateNode), viewTransitionMutationContext = true;
            } catch (error) {
              captureCommitPhaseError(deletedFiber, nearestMountedAncestor, error);
            }
          else
            try {
              hostParent.removeChild(deletedFiber.stateNode), viewTransitionMutationContext = true;
            } catch (error) {
              captureCommitPhaseError(deletedFiber, nearestMountedAncestor, error);
            }
        break;
      case 18:
        null !== hostParent && (hostParentIsContainer ? (finishedRoot = hostParent, clearHydrationBoundary(9 === finishedRoot.nodeType ? finishedRoot.body : "HTML" === finishedRoot.nodeName ? finishedRoot.ownerDocument.body : finishedRoot, deletedFiber.stateNode), retryIfBlockedOn(finishedRoot)) : clearHydrationBoundary(hostParent, deletedFiber.stateNode));
        break;
      case 4:
        prevHostParent = hostParent;
        prevHostParentIsContainer = hostParentIsContainer;
        hostParent = deletedFiber.stateNode.containerInfo;
        hostParentIsContainer = true;
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        hostParent = prevHostParent;
        hostParentIsContainer = prevHostParentIsContainer;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        commitHookEffectListUnmount(2, deletedFiber, nearestMountedAncestor);
        offscreenSubtreeWasHidden || commitHookEffectListUnmount(4, deletedFiber, nearestMountedAncestor);
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        break;
      case 1:
        offscreenSubtreeWasHidden || (safelyDetachRef(deletedFiber, nearestMountedAncestor), prevHostParent = deletedFiber.stateNode, "function" === typeof prevHostParent.componentWillUnmount && safelyCallComponentWillUnmount(deletedFiber, nearestMountedAncestor, prevHostParent));
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        break;
      case 21:
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        break;
      case 22:
        offscreenSubtreeWasHidden = (prevHostParent = offscreenSubtreeWasHidden) || null !== deletedFiber.memoizedState;
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        offscreenSubtreeWasHidden = prevHostParent;
        break;
      case 30:
        safelyDetachRef(deletedFiber, nearestMountedAncestor);
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        break;
      case 7:
        offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        break;
      default:
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
    }
  }
  function commitActivityHydrationCallbacks(finishedRoot, finishedWork) {
    if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot))) {
      finishedRoot = finishedRoot.dehydrated;
      try {
        retryIfBlockedOn(finishedRoot);
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
  }
  function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
    if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot))))
      try {
        retryIfBlockedOn(finishedRoot);
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
  }
  function getRetryCache(finishedWork) {
    switch (finishedWork.tag) {
      case 31:
      case 13:
      case 19:
        var retryCache = finishedWork.stateNode;
        null === retryCache && (retryCache = finishedWork.stateNode = new PossiblyWeakSet());
        return retryCache;
      case 22:
        return finishedWork = finishedWork.stateNode, retryCache = finishedWork._retryCache, null === retryCache && (retryCache = finishedWork._retryCache = new PossiblyWeakSet()), retryCache;
      default:
        throw Error(formatProdErrorMessage(435, finishedWork.tag));
    }
  }
  function attachSuspenseRetryListeners(finishedWork, wakeables) {
    var retryCache = getRetryCache(finishedWork);
    wakeables.forEach(function(wakeable) {
      if (!retryCache.has(wakeable)) {
        retryCache.add(wakeable);
        var retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);
        wakeable.then(retry, retry);
      }
    });
  }
  function recursivelyTraverseMutationEffects(root$jscomp$0, parentFiber, lanes) {
    var deletions = parentFiber.deletions;
    if (null !== deletions)
      for (var i = 0; i < deletions.length; i++) {
        var childToDelete = deletions[i], root2 = root$jscomp$0, returnFiber = parentFiber, parent = returnFiber;
        a: for (; null !== parent; ) {
          switch (parent.tag) {
            case 27:
              if (isSingletonScope(parent.type)) {
                hostParent = parent.stateNode;
                hostParentIsContainer = false;
                break a;
              }
              break;
            case 5:
              hostParent = parent.stateNode;
              hostParentIsContainer = false;
              break a;
            case 3:
            case 4:
              hostParent = parent.stateNode.containerInfo;
              hostParentIsContainer = true;
              break a;
          }
          parent = parent.return;
        }
        if (null === hostParent)
          throw Error(formatProdErrorMessage(160));
        commitDeletionEffectsOnFiber(root2, returnFiber, childToDelete);
        hostParent = null;
        hostParentIsContainer = false;
        root2 = childToDelete.alternate;
        null !== root2 && (root2.return = null);
        childToDelete.return = null;
      }
    if (parentFiber.subtreeFlags & 13886)
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        commitMutationEffectsOnFiber(parentFiber, root$jscomp$0, lanes), parentFiber = parentFiber.sibling;
  }
  var currentHoistableRoot = null;
  function commitMutationEffectsOnFiber(finishedWork, root2, lanes) {
    var current = finishedWork.alternate, flags = finishedWork.flags;
    switch (finishedWork.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (flags & 4 && (current = finishedWork.updateQueue, current = null !== current ? current.events : null, null !== current))
          for (var ii = 0; ii < current.length; ii++) {
            var _eventPayloads$ii2 = current[ii];
            _eventPayloads$ii2.ref.impl = _eventPayloads$ii2.nextImpl;
          }
        recursivelyTraverseMutationEffects(root2, finishedWork, lanes);
        commitReconciliationEffects(finishedWork);
        flags & 4 && (commitHookEffectListUnmount(3, finishedWork, finishedWork.return), commitHookEffectListMount(3, finishedWork), commitHookEffectListUnmount(5, finishedWork, finishedWork.return));
        break;
      case 1:
        recursivelyTraverseMutationEffects(root2, finishedWork, lanes);
        commitReconciliationEffects(finishedWork);
        flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
        flags & 64 && offscreenSubtreeIsHidden && (finishedWork = finishedWork.updateQueue, null !== finishedWork && (root2 = finishedWork.callbacks, null !== root2 && (lanes = finishedWork.shared.hiddenCallbacks, finishedWork.shared.hiddenCallbacks = null === lanes ? root2 : lanes.concat(root2))));
        break;
      case 26:
        ii = currentHoistableRoot;
        recursivelyTraverseMutationEffects(root2, finishedWork, lanes);
        commitReconciliationEffects(finishedWork);
        flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
        if (flags & 4)
          if (flags = null !== current ? current.memoizedState : null, lanes = finishedWork.memoizedState, null === current)
            if (null === lanes)
              if (null === finishedWork.stateNode)
                if (offscreenSubtreeIsHidden)
                  finishedWork.stateNode = createHoistableInstance(finishedWork.type, finishedWork.memoizedProps, root2.containerInfo, finishedWork);
                else {
                  a: {
                    root2 = finishedWork.type;
                    lanes = finishedWork.memoizedProps;
                    flags = ii.ownerDocument || ii;
                    b: switch (root2) {
                      case "title":
                        current = flags.getElementsByTagName("title")[0];
                        if (!current || current[internalHoistableMarker] || current[internalInstanceKey] || "http://www.w3.org/2000/svg" === current.namespaceURI || current.hasAttribute("itemprop"))
                          current = flags.createElement(root2), flags.head.insertBefore(current, flags.querySelector("head > title"));
                        setInitialProperties(current, root2, lanes);
                        current[internalInstanceKey] = finishedWork;
                        markNodeAsHoistable(current);
                        root2 = current;
                        break a;
                      case "link":
                        if (ii = getHydratableHoistableCache("link", "href", flags).get(root2 + (lanes.href || ""))) {
                          for (_eventPayloads$ii2 = 0; _eventPayloads$ii2 < ii.length; _eventPayloads$ii2++)
                            if (current = ii[_eventPayloads$ii2], current.getAttribute("href") === (null == lanes.href || "" === lanes.href ? null : lanes.href) && current.getAttribute("rel") === (null == lanes.rel ? null : lanes.rel) && current.getAttribute("title") === (null == lanes.title ? null : lanes.title) && current.getAttribute("crossorigin") === (null == lanes.crossOrigin ? null : lanes.crossOrigin)) {
                              ii.splice(_eventPayloads$ii2, 1);
                              break b;
                            }
                        }
                        current = flags.createElement(root2);
                        setInitialProperties(current, root2, lanes);
                        flags.head.appendChild(current);
                        break;
                      case "meta":
                        if (ii = getHydratableHoistableCache("meta", "content", flags).get(root2 + (lanes.content || ""))) {
                          for (_eventPayloads$ii2 = 0; _eventPayloads$ii2 < ii.length; _eventPayloads$ii2++)
                            if (current = ii[_eventPayloads$ii2], current.getAttribute("content") === (null == lanes.content ? null : "" + lanes.content) && current.getAttribute("name") === (null == lanes.name ? null : lanes.name) && current.getAttribute("property") === (null == lanes.property ? null : lanes.property) && current.getAttribute("http-equiv") === (null == lanes.httpEquiv ? null : lanes.httpEquiv) && current.getAttribute("charset") === (null == lanes.charSet ? null : lanes.charSet)) {
                              ii.splice(_eventPayloads$ii2, 1);
                              break b;
                            }
                        }
                        current = flags.createElement(root2);
                        setInitialProperties(current, root2, lanes);
                        flags.head.appendChild(current);
                        break;
                      default:
                        throw Error(formatProdErrorMessage(468, root2));
                    }
                    current[internalInstanceKey] = finishedWork;
                    markNodeAsHoistable(current);
                    root2 = current;
                  }
                  finishedWork.stateNode = root2;
                }
              else
                offscreenSubtreeIsHidden || mountHoistable(ii, finishedWork.type, finishedWork.stateNode);
            else
              finishedWork.stateNode = acquireResource(ii, lanes, finishedWork.memoizedProps);
          else
            flags !== lanes ? (null === flags ? (root2 = current.stateNode, null === root2 || offscreenSubtreeWasHidden || root2.parentNode.removeChild(root2)) : flags.count--, null === lanes ? offscreenSubtreeIsHidden || mountHoistable(ii, finishedWork.type, finishedWork.stateNode) : acquireResource(ii, lanes, finishedWork.memoizedProps)) : null === lanes && null !== finishedWork.stateNode && commitHostUpdate(finishedWork, finishedWork.memoizedProps, current.memoizedProps);
        break;
      case 27:
        recursivelyTraverseMutationEffects(root2, finishedWork, lanes);
        commitReconciliationEffects(finishedWork);
        flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
        null !== current && flags & 4 && commitHostUpdate(finishedWork, finishedWork.memoizedProps, current.memoizedProps);
        break;
      case 5:
        ii = offscreenDirectParentIsHidden;
        offscreenDirectParentIsHidden = false;
        recursivelyTraverseMutationEffects(root2, finishedWork, lanes);
        offscreenDirectParentIsHidden = ii;
        commitReconciliationEffects(finishedWork);
        flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
        if (finishedWork.flags & 32) {
          root2 = finishedWork.stateNode;
          try {
            setTextContent(root2, ""), viewTransitionMutationContext = true;
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
        flags & 4 && null != finishedWork.stateNode && (root2 = finishedWork.memoizedProps, commitHostUpdate(finishedWork, root2, null !== current ? current.memoizedProps : root2));
        flags & 1024 && (needsFormReset = true);
        break;
      case 6:
        recursivelyTraverseMutationEffects(root2, finishedWork, lanes);
        commitReconciliationEffects(finishedWork);
        if (flags & 4) {
          if (null === finishedWork.stateNode)
            throw Error(formatProdErrorMessage(162));
          root2 = finishedWork.memoizedProps;
          lanes = finishedWork.stateNode;
          try {
            lanes.nodeValue = root2, viewTransitionMutationContext = true;
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
        break;
      case 3:
        viewTransitionMutationContext = false;
        tagCaches = null;
        ii = currentHoistableRoot;
        currentHoistableRoot = getHoistableRoot(root2.containerInfo);
        recursivelyTraverseMutationEffects(root2, finishedWork, lanes);
        currentHoistableRoot = ii;
        commitReconciliationEffects(finishedWork);
        if (flags & 4 && null !== current && current.memoizedState.isDehydrated)
          try {
            retryIfBlockedOn(root2.containerInfo);
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        needsFormReset && (needsFormReset = false, recursivelyResetForms(finishedWork));
        viewTransitionMutationContext = false;
        break;
      case 4:
        flags = offscreenDirectParentIsHidden;
        offscreenDirectParentIsHidden = offscreenSubtreeIsHidden;
        current = pushMutationContext();
        ii = currentHoistableRoot;
        currentHoistableRoot = getHoistableRoot(finishedWork.stateNode.containerInfo);
        recursivelyTraverseMutationEffects(root2, finishedWork, lanes);
        commitReconciliationEffects(finishedWork);
        currentHoistableRoot = ii;
        viewTransitionMutationContext && inUpdateViewTransition && (rootViewTransitionAffected = true);
        viewTransitionMutationContext = current;
        offscreenDirectParentIsHidden = flags;
        break;
      case 12:
        recursivelyTraverseMutationEffects(root2, finishedWork, lanes);
        commitReconciliationEffects(finishedWork);
        break;
      case 31:
        recursivelyTraverseMutationEffects(root2, finishedWork, lanes);
        commitReconciliationEffects(finishedWork);
        flags & 4 && (root2 = finishedWork.updateQueue, null !== root2 && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, root2)));
        break;
      case 13:
        recursivelyTraverseMutationEffects(root2, finishedWork, lanes);
        commitReconciliationEffects(finishedWork);
        finishedWork.child.flags & 8192 && null !== finishedWork.memoizedState !== (null !== current && null !== current.memoizedState) && (globalMostRecentFallbackTime = now());
        flags & 4 && (root2 = finishedWork.updateQueue, null !== root2 && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, root2)));
        break;
      case 22:
        ii = null !== finishedWork.memoizedState;
        _eventPayloads$ii2 = null !== current && null !== current.memoizedState;
        var prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden, prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden, prevOffscreenDirectParentIsHidden$166 = offscreenDirectParentIsHidden;
        offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden || ii;
        offscreenDirectParentIsHidden = prevOffscreenDirectParentIsHidden$166 || ii;
        offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || _eventPayloads$ii2;
        recursivelyTraverseMutationEffects(root2, finishedWork, lanes);
        offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
        offscreenDirectParentIsHidden = prevOffscreenDirectParentIsHidden$166;
        offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
        commitReconciliationEffects(finishedWork);
        flags & 8192 && (root2 = finishedWork.stateNode, root2._visibility = ii ? root2._visibility & -2 : root2._visibility | 1, !ii || null === current || _eventPayloads$ii2 || offscreenSubtreeIsHidden || offscreenSubtreeWasHidden || (root2 = _eventPayloads$ii2 || offscreenSubtreeWasHidden, lanes = offscreenSubtreeIsHidden, current = offscreenSubtreeWasHidden, offscreenSubtreeIsHidden = ii || offscreenSubtreeIsHidden, offscreenSubtreeWasHidden = root2, recursivelyTraverseDisappearLayoutEffects(finishedWork, 2), offscreenSubtreeIsHidden = lanes, offscreenSubtreeWasHidden = current), !ii && offscreenDirectParentIsHidden || hideOrUnhideAllChildren(finishedWork, ii));
        flags & 4 && (root2 = finishedWork.updateQueue, null !== root2 && (lanes = root2.retryQueue, null !== lanes && (root2.retryQueue = null, attachSuspenseRetryListeners(finishedWork, lanes))));
        break;
      case 19:
        recursivelyTraverseMutationEffects(root2, finishedWork, lanes);
        commitReconciliationEffects(finishedWork);
        flags & 4 && (root2 = finishedWork.updateQueue, null !== root2 && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, root2)));
        break;
      case 30:
        flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
        flags = pushMutationContext();
        ii = inUpdateViewTransition;
        _eventPayloads$ii2 = (lanes & 335544064) === lanes;
        prevOffscreenSubtreeIsHidden = finishedWork.memoizedProps;
        inUpdateViewTransition = _eventPayloads$ii2 && "none" !== getViewTransitionClassName(prevOffscreenSubtreeIsHidden.default, prevOffscreenSubtreeIsHidden.update);
        recursivelyTraverseMutationEffects(root2, finishedWork, lanes);
        commitReconciliationEffects(finishedWork);
        _eventPayloads$ii2 && null !== current && viewTransitionMutationContext && (finishedWork.flags |= 4);
        inUpdateViewTransition = ii;
        viewTransitionMutationContext = flags;
        break;
      case 21:
        break;
      case 7:
        flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return)), current && null !== current.stateNode && (current.stateNode._fragmentFiber = finishedWork);
      default:
        recursivelyTraverseMutationEffects(root2, finishedWork, lanes), commitReconciliationEffects(finishedWork);
    }
  }
  function commitReconciliationEffects(finishedWork) {
    var flags = finishedWork.flags;
    if (flags & 2) {
      try {
        for (var hostParentFiber, parentFiber = finishedWork.return; null !== parentFiber; ) {
          if (isHostParent(parentFiber)) {
            hostParentFiber = parentFiber;
            break;
          }
          parentFiber = parentFiber.return;
        }
        parentFiber = null;
        for (var parent = finishedWork.return; null !== parent; ) {
          if (isFragmentInstanceParent(parent)) {
            var fragmentInstance = parent.stateNode;
            null === parentFiber ? parentFiber = [fragmentInstance] : parentFiber.push(fragmentInstance);
          }
          if (isFragmentInstanceHostBoundary(parent))
            break;
          parent = parent.return;
        }
        var JSCompiler_inline_result = parentFiber;
        if (null == hostParentFiber)
          throw Error(formatProdErrorMessage(160));
        switch (hostParentFiber.tag) {
          case 27:
            var parent$jscomp$0 = hostParentFiber.stateNode, before = getHostSibling(finishedWork);
            insertOrAppendPlacementNode(finishedWork, before, parent$jscomp$0, JSCompiler_inline_result);
            break;
          case 5:
            var parent$149 = hostParentFiber.stateNode;
            hostParentFiber.flags & 32 && (setTextContent(parent$149, ""), hostParentFiber.flags &= -33);
            var before$150 = getHostSibling(finishedWork);
            insertOrAppendPlacementNode(finishedWork, before$150, parent$149, JSCompiler_inline_result);
            break;
          case 3:
          case 4:
            var parent$151 = hostParentFiber.stateNode.containerInfo, before$152 = getHostSibling(finishedWork);
            insertOrAppendPlacementNodeIntoContainer(finishedWork, before$152, parent$151, JSCompiler_inline_result);
            break;
          default:
            throw Error(formatProdErrorMessage(161));
        }
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
      finishedWork.flags &= -3;
    }
    flags & 4096 && (finishedWork.flags &= -4097);
  }
  function recursivelyResetForms(parentFiber) {
    if (parentFiber.subtreeFlags & 1024)
      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
        var fiber = parentFiber;
        recursivelyResetForms(fiber);
        5 === fiber.tag && fiber.flags & 1024 && (fiber = fiber.stateNode, _enabled = true, fiber.reset(), _enabled = false);
        parentFiber = parentFiber.sibling;
      }
  }
  function recursivelyTraverseAfterMutationEffects(root2, parentFiber) {
    if (parentFiber.subtreeFlags & 9270)
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        commitAfterMutationEffectsOnFiber(parentFiber, root2), parentFiber = parentFiber.sibling;
    else
      measureNestedViewTransitions(parentFiber);
  }
  function commitAfterMutationEffectsOnFiber(finishedWork, root2) {
    var current = finishedWork.alternate;
    if (null === current)
      commitEnterViewTransitions(finishedWork, false);
    else
      switch (finishedWork.tag) {
        case 3:
          rootViewTransitionNameCanceled = viewTransitionContextChanged = false;
          pushViewTransitionCancelableScope();
          recursivelyTraverseAfterMutationEffects(root2, finishedWork);
          if (!viewTransitionContextChanged && !rootViewTransitionAffected) {
            finishedWork = viewTransitionCancelableChildren;
            if (null !== finishedWork)
              for (var i = 0; i < finishedWork.length; i += 3) {
                current = finishedWork[i];
                var oldName = finishedWork[i + 1];
                restoreViewTransitionName(current, finishedWork[i + 2]);
                current = current.ownerDocument.documentElement;
                null !== current && current.animate({ opacity: [0, 0], pointerEvents: ["none", "none"] }, {
                  duration: 0,
                  fill: "forwards",
                  pseudoElement: "::view-transition-group(" + oldName + ")"
                });
              }
            finishedWork = root2.containerInfo;
            finishedWork = 9 === finishedWork.nodeType ? finishedWork.documentElement : finishedWork.ownerDocument.documentElement;
            null !== finishedWork && "" === finishedWork.style.viewTransitionName && (finishedWork.style.viewTransitionName = "none", finishedWork.animate({ opacity: [0, 0], pointerEvents: ["none", "none"] }, {
              duration: 0,
              fill: "forwards",
              pseudoElement: "::view-transition-group(root)"
            }), finishedWork.animate({ width: [0, 0], height: [0, 0] }, {
              duration: 0,
              fill: "forwards",
              pseudoElement: "::view-transition"
            }));
            rootViewTransitionNameCanceled = true;
          }
          viewTransitionCancelableChildren = null;
          break;
        case 5:
          recursivelyTraverseAfterMutationEffects(root2, finishedWork);
          break;
        case 4:
          i = viewTransitionContextChanged;
          viewTransitionContextChanged = false;
          recursivelyTraverseAfterMutationEffects(root2, finishedWork);
          viewTransitionContextChanged && (rootViewTransitionAffected = true);
          viewTransitionContextChanged = i;
          break;
        case 22:
          null === finishedWork.memoizedState && (null !== current.memoizedState ? commitEnterViewTransitions(finishedWork, false) : recursivelyTraverseAfterMutationEffects(root2, finishedWork));
          break;
        case 30:
          i = viewTransitionContextChanged;
          oldName = pushViewTransitionCancelableScope();
          viewTransitionContextChanged = false;
          recursivelyTraverseAfterMutationEffects(root2, finishedWork);
          viewTransitionContextChanged && (finishedWork.flags |= 4);
          var props = finishedWork.memoizedProps, state = finishedWork.stateNode;
          root2 = getViewTransitionName(props, state);
          state = getViewTransitionName(current.memoizedProps, state);
          var className = getViewTransitionClassName(props.default, props.update);
          "none" === className ? root2 = false : (props = current.memoizedState, current.memoizedState = null, current = finishedWork.child, viewTransitionHostInstanceIdx = 0, root2 = measureViewTransitionHostInstancesRecursive(finishedWork, current, root2, state, className, props, true), viewTransitionHostInstanceIdx !== (null === props ? 0 : props.length) && (finishedWork.flags |= 32));
          0 !== (finishedWork.flags & 4) && root2 ? (scheduleViewTransitionEvent(finishedWork, finishedWork.memoizedProps.onUpdate), viewTransitionCancelableChildren = oldName) : null !== oldName && (oldName.push.apply(oldName, viewTransitionCancelableChildren), viewTransitionCancelableChildren = oldName);
          viewTransitionContextChanged = 0 !== (finishedWork.flags & 32) ? true : i;
          break;
        default:
          recursivelyTraverseAfterMutationEffects(root2, finishedWork);
      }
  }
  function recursivelyTraverseLayoutEffects(root2, parentFiber) {
    if (parentFiber.subtreeFlags & 8772)
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        commitLayoutEffectOnFiber(root2, parentFiber.alternate, parentFiber), parentFiber = parentFiber.sibling;
  }
  function recursivelyTraverseDisappearLayoutEffects(parentFiber, layoutEffectTraversalFlags$jscomp$0) {
    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
      var finishedWork = parentFiber, layoutEffectTraversalFlags = layoutEffectTraversalFlags$jscomp$0;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          commitHookEffectListUnmount(4, finishedWork, finishedWork.return);
          recursivelyTraverseDisappearLayoutEffects(finishedWork, layoutEffectTraversalFlags);
          break;
        case 1:
          safelyDetachRef(finishedWork, finishedWork.return);
          var instance = finishedWork.stateNode;
          "function" === typeof instance.componentWillUnmount && safelyCallComponentWillUnmount(finishedWork, finishedWork.return, instance);
          recursivelyTraverseDisappearLayoutEffects(finishedWork, layoutEffectTraversalFlags);
          break;
        case 27:
          0 !== (layoutEffectTraversalFlags & 2) && releaseSingletonInstance(finishedWork.stateNode, finishedWork.type, finishedWork.memoizedProps);
        case 5:
          safelyDetachRef(finishedWork, finishedWork.return);
          5 !== finishedWork.tag && 27 !== finishedWork.tag || commitFragmentInstanceDeletionEffects(finishedWork);
          recursivelyTraverseDisappearLayoutEffects(finishedWork, layoutEffectTraversalFlags);
          break;
        case 6:
          commitFragmentInstanceDeletionEffects(finishedWork);
          break;
        case 26:
          safelyDetachRef(finishedWork, finishedWork.return);
          instance = finishedWork.stateNode;
          null !== finishedWork.memoizedState || null === instance || offscreenSubtreeWasHidden || instance.parentNode.removeChild(instance);
          recursivelyTraverseDisappearLayoutEffects(finishedWork, layoutEffectTraversalFlags);
          break;
        case 22:
          null === finishedWork.memoizedState && recursivelyTraverseDisappearLayoutEffects(finishedWork, layoutEffectTraversalFlags);
          break;
        case 30:
          safelyDetachRef(finishedWork, finishedWork.return);
          recursivelyTraverseDisappearLayoutEffects(finishedWork, layoutEffectTraversalFlags);
          break;
        case 7:
          safelyDetachRef(finishedWork, finishedWork.return);
        default:
          recursivelyTraverseDisappearLayoutEffects(finishedWork, layoutEffectTraversalFlags);
      }
      parentFiber = parentFiber.sibling;
    }
  }
  function recursivelyTraverseReappearLayoutEffects(finishedRoot$jscomp$0, parentFiber, layoutEffectTraversalFlags) {
    layoutEffectTraversalFlags = 0 !== (parentFiber.subtreeFlags & 8772) ? layoutEffectTraversalFlags : layoutEffectTraversalFlags & -2;
    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
      var current = parentFiber.alternate, finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags, includeWorkInProgressEffects = 0 !== (layoutEffectTraversalFlags & 1);
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
          commitHookEffectListMount(4, finishedWork);
          break;
        case 1:
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
          current = finishedWork;
          finishedRoot = current.stateNode;
          if ("function" === typeof finishedRoot.componentDidMount)
            try {
              finishedRoot.componentDidMount();
            } catch (error) {
              captureCommitPhaseError(current, current.return, error);
            }
          current = finishedWork;
          finishedRoot = current.updateQueue;
          if (null !== finishedRoot) {
            var instance = current.stateNode;
            try {
              var hiddenCallbacks = finishedRoot.shared.hiddenCallbacks;
              if (null !== hiddenCallbacks)
                for (finishedRoot.shared.hiddenCallbacks = null, finishedRoot = 0; finishedRoot < hiddenCallbacks.length; finishedRoot++)
                  callCallback(hiddenCallbacks[finishedRoot], instance);
            } catch (error) {
              captureCommitPhaseError(current, current.return, error);
            }
          }
          includeWorkInProgressEffects && flags & 64 && commitClassCallbacks(finishedWork);
          safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 27:
          0 !== (layoutEffectTraversalFlags & 2) && commitHostSingletonAcquisition(finishedWork);
        case 5:
          5 !== finishedWork.tag && 27 !== finishedWork.tag || commitFragmentInstanceInsertionEffects(finishedWork);
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
          includeWorkInProgressEffects && null === current && flags & 4 && commitHostMount(finishedWork);
          safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 6:
          commitFragmentInstanceInsertionEffects(finishedWork);
          break;
        case 26:
          instance = finishedWork.stateNode;
          null !== finishedWork.memoizedState || null === instance || offscreenSubtreeIsHidden || mountHoistable(getHoistableRoot(instance.ownerDocument), finishedWork.type, instance);
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
          includeWorkInProgressEffects && null === current && flags & 4 && commitHostMount(finishedWork);
          safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 12:
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
          break;
        case 31:
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
          includeWorkInProgressEffects && flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
          break;
        case 13:
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
          includeWorkInProgressEffects && flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
          break;
        case 22:
          null === finishedWork.memoizedState && recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
          safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 30:
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
          safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 7:
          safelyAttachRef(finishedWork, finishedWork.return);
        default:
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
      }
      parentFiber = parentFiber.sibling;
    }
  }
  function commitOffscreenPassiveMountEffects(current, finishedWork) {
    var previousCache = null;
    null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (previousCache = current.memoizedState.cachePool.pool);
    current = null;
    null !== finishedWork.memoizedState && null !== finishedWork.memoizedState.cachePool && (current = finishedWork.memoizedState.cachePool.pool);
    current !== previousCache && (null != current && current.refCount++, null != previousCache && releaseCache(previousCache));
  }
  function commitCachePassiveMountEffect(current, finishedWork) {
    current = null;
    null !== finishedWork.alternate && (current = finishedWork.alternate.memoizedState.cache);
    finishedWork = finishedWork.memoizedState.cache;
    finishedWork !== current && (finishedWork.refCount++, null != current && releaseCache(current));
  }
  function recursivelyTraversePassiveMountEffects(root2, parentFiber, committedLanes, committedTransitions) {
    var isViewTransitionEligible = (committedLanes & 335544064) === committedLanes;
    if (parentFiber.subtreeFlags & (isViewTransitionEligible ? 10262 : 10256))
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        commitPassiveMountOnFiber(root2, parentFiber, committedLanes, committedTransitions), parentFiber = parentFiber.sibling;
    else
      isViewTransitionEligible && restoreNestedViewTransitions(parentFiber);
  }
  function commitPassiveMountOnFiber(finishedRoot, finishedWork, committedLanes, committedTransitions) {
    var isViewTransitionEligible = (committedLanes & 335544064) === committedLanes;
    isViewTransitionEligible && null === finishedWork.alternate && null !== finishedWork.return && null !== finishedWork.return.alternate && restoreEnterOrExitViewTransitions(finishedWork);
    var flags = finishedWork.flags;
    switch (finishedWork.tag) {
      case 0:
      case 11:
      case 15:
        recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
        flags & 2048 && commitHookEffectListMount(9, finishedWork);
        break;
      case 1:
        recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
        break;
      case 3:
        recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
        isViewTransitionEligible && rootViewTransitionNameCanceled && (finishedRoot = finishedRoot.containerInfo, finishedRoot = 9 === finishedRoot.nodeType ? finishedRoot.body : "HTML" === finishedRoot.nodeName ? finishedRoot.ownerDocument.body : finishedRoot, "root" === finishedRoot.style.viewTransitionName && (finishedRoot.style.viewTransitionName = ""), finishedRoot = finishedRoot.ownerDocument.documentElement, null !== finishedRoot && "none" === finishedRoot.style.viewTransitionName && (finishedRoot.style.viewTransitionName = ""));
        flags & 2048 && (flags = null, null !== finishedWork.alternate && (flags = finishedWork.alternate.memoizedState.cache), finishedWork = finishedWork.memoizedState.cache, finishedWork !== flags && (finishedWork.refCount++, null != flags && releaseCache(flags)));
        break;
      case 12:
        if (flags & 2048) {
          recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
          flags = finishedWork.stateNode;
          try {
            var _finishedWork$memoize2 = finishedWork.memoizedProps, id = _finishedWork$memoize2.id, onPostCommit = _finishedWork$memoize2.onPostCommit;
            "function" === typeof onPostCommit && onPostCommit(id, null === finishedWork.alternate ? "mount" : "update", flags.passiveEffectDuration, -0);
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        } else
          recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
        break;
      case 31:
        recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
        break;
      case 13:
        recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
        break;
      case 23:
        break;
      case 22:
        _finishedWork$memoize2 = finishedWork.stateNode;
        id = finishedWork.alternate;
        null !== finishedWork.memoizedState ? (isViewTransitionEligible && null !== id && null === id.memoizedState && restoreEnterOrExitViewTransitions(id), _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork)) : (isViewTransitionEligible && null !== id && null !== id.memoizedState && restoreEnterOrExitViewTransitions(finishedWork), _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions) : (_finishedWork$memoize2._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, 0 !== (finishedWork.subtreeFlags & 10256) || false)));
        flags & 2048 && commitOffscreenPassiveMountEffects(id, finishedWork);
        break;
      case 24:
        recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
        flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
        break;
      case 30:
        isViewTransitionEligible && (flags = finishedWork.alternate, null !== flags && (restoreViewTransitionOnHostInstances(flags.child, true), restoreViewTransitionOnHostInstances(finishedWork.child, true)));
        recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
        break;
      default:
        recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
    }
  }
  function recursivelyTraverseReconnectPassiveEffects(finishedRoot$jscomp$0, parentFiber, committedLanes$jscomp$0, committedTransitions$jscomp$0, includeWorkInProgressEffects) {
    includeWorkInProgressEffects = includeWorkInProgressEffects && (0 !== (parentFiber.subtreeFlags & 10256) || false);
    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
      var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, committedLanes = committedLanes$jscomp$0, committedTransitions = committedTransitions$jscomp$0, flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
          commitHookEffectListMount(8, finishedWork);
          break;
        case 23:
          break;
        case 22:
          var instance = finishedWork.stateNode;
          null !== finishedWork.memoizedState ? instance._visibility & 2 ? recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork) : (instance._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects));
          includeWorkInProgressEffects && flags & 2048 && commitOffscreenPassiveMountEffects(finishedWork.alternate, finishedWork);
          break;
        case 24:
          recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
          includeWorkInProgressEffects && flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
          break;
        default:
          recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
      }
      parentFiber = parentFiber.sibling;
    }
  }
  function recursivelyTraverseAtomicPassiveEffects(finishedRoot$jscomp$0, parentFiber) {
    if (parentFiber.subtreeFlags & 10256)
      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
        var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
        switch (finishedWork.tag) {
          case 22:
            recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
            flags & 2048 && commitOffscreenPassiveMountEffects(finishedWork.alternate, finishedWork);
            break;
          case 24:
            recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
            flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
            break;
          default:
            recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
        }
        parentFiber = parentFiber.sibling;
      }
  }
  var suspenseyCommitFlag = 8192;
  function recursivelyAccumulateSuspenseyCommit(parentFiber, committedLanes, suspendedState) {
    if (parentFiber.subtreeFlags & suspenseyCommitFlag)
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        accumulateSuspenseyCommitOnFiber(parentFiber, committedLanes, suspendedState), parentFiber = parentFiber.sibling;
  }
  function accumulateSuspenseyCommitOnFiber(fiber, committedLanes, suspendedState) {
    switch (fiber.tag) {
      case 26:
        recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
        fiber.flags & suspenseyCommitFlag && (null !== fiber.memoizedState ? suspendResource(suspendedState, currentHoistableRoot, fiber.memoizedState, fiber.memoizedProps) : (fiber = fiber.stateNode, (committedLanes & 335544128) === committedLanes && suspendInstance(suspendedState, fiber)));
        break;
      case 5:
        recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
        fiber.flags & suspenseyCommitFlag && (fiber = fiber.stateNode, (committedLanes & 335544128) === committedLanes && suspendInstance(suspendedState, fiber));
        break;
      case 3:
      case 4:
        var previousHoistableRoot = currentHoistableRoot;
        currentHoistableRoot = getHoistableRoot(fiber.stateNode.containerInfo);
        recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
        currentHoistableRoot = previousHoistableRoot;
        break;
      case 22:
        null === fiber.memoizedState && (previousHoistableRoot = fiber.alternate, null !== previousHoistableRoot && null !== previousHoistableRoot.memoizedState ? (previousHoistableRoot = suspenseyCommitFlag, suspenseyCommitFlag = 16777216, recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState), suspenseyCommitFlag = previousHoistableRoot) : recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState));
        break;
      case 30:
        if (0 !== (fiber.flags & suspenseyCommitFlag) && (previousHoistableRoot = fiber.memoizedProps.name, null != previousHoistableRoot && "auto" !== previousHoistableRoot)) {
          var state = fiber.stateNode;
          state.paired = null;
          null === appearingViewTransitions && (appearingViewTransitions =  new Map());
          appearingViewTransitions.set(previousHoistableRoot, state);
        }
        recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
        break;
      default:
        recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
    }
  }
  function detachAlternateSiblings(parentFiber) {
    var previousFiber = parentFiber.alternate;
    if (null !== previousFiber && (parentFiber = previousFiber.child, null !== parentFiber)) {
      previousFiber.child = null;
      do
        previousFiber = parentFiber.sibling, parentFiber.sibling = null, parentFiber = previousFiber;
      while (null !== parentFiber);
    }
  }
  function recursivelyTraversePassiveUnmountEffects(parentFiber) {
    var deletions = parentFiber.deletions;
    if (0 !== (parentFiber.flags & 16)) {
      if (null !== deletions)
        for (var i = 0; i < deletions.length; i++) {
          var childToDelete = deletions[i];
          nextEffect = childToDelete;
          commitPassiveUnmountEffectsInsideOfDeletedTree_begin(childToDelete, parentFiber);
        }
      detachAlternateSiblings(parentFiber);
    }
    if (parentFiber.subtreeFlags & 10256)
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        commitPassiveUnmountOnFiber(parentFiber), parentFiber = parentFiber.sibling;
  }
  function commitPassiveUnmountOnFiber(finishedWork) {
    switch (finishedWork.tag) {
      case 0:
      case 11:
      case 15:
        recursivelyTraversePassiveUnmountEffects(finishedWork);
        finishedWork.flags & 2048 && commitHookEffectListUnmount(9, finishedWork, finishedWork.return);
        break;
      case 3:
        recursivelyTraversePassiveUnmountEffects(finishedWork);
        break;
      case 12:
        recursivelyTraversePassiveUnmountEffects(finishedWork);
        break;
      case 22:
        var instance = finishedWork.stateNode;
        null !== finishedWork.memoizedState && instance._visibility & 2 && (null === finishedWork.return || 13 !== finishedWork.return.tag) ? (instance._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(finishedWork)) : recursivelyTraversePassiveUnmountEffects(finishedWork);
        break;
      default:
        recursivelyTraversePassiveUnmountEffects(finishedWork);
    }
  }
  function recursivelyTraverseDisconnectPassiveEffects(parentFiber) {
    var deletions = parentFiber.deletions;
    if (0 !== (parentFiber.flags & 16)) {
      if (null !== deletions)
        for (var i = 0; i < deletions.length; i++) {
          var childToDelete = deletions[i];
          nextEffect = childToDelete;
          commitPassiveUnmountEffectsInsideOfDeletedTree_begin(childToDelete, parentFiber);
        }
      detachAlternateSiblings(parentFiber);
    }
    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
      deletions = parentFiber;
      switch (deletions.tag) {
        case 0:
        case 11:
        case 15:
          commitHookEffectListUnmount(8, deletions, deletions.return);
          recursivelyTraverseDisconnectPassiveEffects(deletions);
          break;
        case 22:
          i = deletions.stateNode;
          i._visibility & 2 && (i._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(deletions));
          break;
        default:
          recursivelyTraverseDisconnectPassiveEffects(deletions);
      }
      parentFiber = parentFiber.sibling;
    }
  }
  function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(deletedSubtreeRoot, nearestMountedAncestor) {
    for (; null !== nextEffect; ) {
      var fiber = nextEffect;
      switch (fiber.tag) {
        case 0:
        case 11:
        case 15:
          commitHookEffectListUnmount(8, fiber, nearestMountedAncestor);
          break;
        case 23:
        case 22:
          if (null !== fiber.memoizedState && null !== fiber.memoizedState.cachePool) {
            var cache = fiber.memoizedState.cachePool.pool;
            null != cache && cache.refCount++;
          }
          break;
        case 24:
          releaseCache(fiber.memoizedState.cache);
      }
      cache = fiber.child;
      if (null !== cache)
        cache.return = fiber, nextEffect = cache;
      else
        a: for (fiber = deletedSubtreeRoot; null !== nextEffect; ) {
          cache = nextEffect;
          var sibling = cache.sibling, returnFiber = cache.return;
          detachFiberAfterEffects(cache);
          if (cache === fiber) {
            nextEffect = null;
            break a;
          }
          if (null !== sibling) {
            sibling.return = returnFiber;
            nextEffect = sibling;
            break a;
          }
          nextEffect = returnFiber;
        }
    }
  }
  var DefaultAsyncDispatcher = {
    getCacheForType: function(resourceType) {
      var cache = readContext(CacheContext), cacheForType = cache.data.get(resourceType);
      void 0 === cacheForType && (cacheForType = resourceType(), cache.data.set(resourceType, cacheForType));
      return cacheForType;
    },
    cacheSignal: function() {
      return readContext(CacheContext).controller.signal;
    }
  }, PossiblyWeakMap = "function" === typeof WeakMap ? WeakMap : Map, executionContext = 0, workInProgressRoot = null, workInProgress = null, workInProgressRootRenderLanes = 0, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, workInProgressRootDidSkipSuspendedSiblings = false, workInProgressRootIsPrerendering = false, workInProgressRootDidAttachPingListener = false, entangledRenderLanes = 0, workInProgressRootExitStatus = 0, workInProgressRootSkippedLanes = 0, workInProgressRootInterleavedUpdatedLanes = 0, workInProgressRootPingedLanes = 0, workInProgressDeferredLane = 0, workInProgressSuspendedRetryLanes = 0, workInProgressRootConcurrentErrors = null, workInProgressRootRecoverableErrors = null, workInProgressRootDidIncludeRecursiveRenderUpdate = false, globalMostRecentFallbackTime = 0, globalMostRecentTransitionTime = 0, workInProgressRootRenderTargetTime = Infinity, workInProgressTransitions = null, legacyErrorBoundariesThatAlreadyFailed = null, pendingEffectsStatus = 0, pendingEffectsRoot = null, pendingFinishedWork = null, pendingEffectsLanes = 0, pendingEffectsRemainingLanes = 0, pendingPassiveTransitions = null, pendingRecoverableErrors = null, pendingViewTransition = null, pendingViewTransitionEvents = null, pendingTransitionTypes = null, nestedUpdateCount = 0, rootWithNestedUpdates = null;
  function requestUpdateLane() {
    return 0 !== (executionContext & 2) && 0 !== workInProgressRootRenderLanes ? workInProgressRootRenderLanes & -workInProgressRootRenderLanes : null !== ReactSharedInternals.T ? requestTransitionLane() : resolveUpdatePriority();
  }
  function requestDeferredLane() {
    if (0 === workInProgressDeferredLane)
      if (0 === (workInProgressRootRenderLanes & 536870912) || isHydrating) {
        var lane = nextTransitionDeferredLane;
        nextTransitionDeferredLane <<= 1;
        0 === (nextTransitionDeferredLane & 3932160) && (nextTransitionDeferredLane = 262144);
        workInProgressDeferredLane = lane;
      } else
        workInProgressDeferredLane = 536870912;
    lane = suspenseHandlerStackCursor.current;
    null !== lane && (lane.flags |= 32);
    return workInProgressDeferredLane;
  }
  function scheduleViewTransitionEvent(fiber, callback) {
    if (null != callback) {
      var state = fiber.stateNode, instance = state.ref;
      null === instance && (instance = state.ref = createViewTransitionInstance(getViewTransitionName(fiber.memoizedProps, state)));
      null === pendingViewTransitionEvents && (pendingViewTransitionEvents = []);
      pendingViewTransitionEvents.push(callback.bind(null, instance));
    }
  }
  function scheduleUpdateOnFiber(root2, fiber, lane) {
    if (root2 === workInProgressRoot && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root2.cancelPendingCommit)
      prepareFreshStack(root2, 0), markRootSuspended(root2, workInProgressRootRenderLanes, workInProgressDeferredLane, false);
    markRootUpdated$1(root2, lane);
    if (0 === (executionContext & 2) || root2 !== workInProgressRoot)
      root2 === workInProgressRoot && (0 === (executionContext & 2) && (workInProgressRootInterleavedUpdatedLanes |= lane), 4 === workInProgressRootExitStatus && markRootSuspended(root2, workInProgressRootRenderLanes, workInProgressDeferredLane, false)), ensureRootIsScheduled(root2);
  }
  function performWorkOnRoot(root$jscomp$0, lanes, forceSync) {
    if (0 !== (executionContext & 6))
      throw Error(formatProdErrorMessage(327));
    var shouldTimeSlice = !forceSync && 0 === (lanes & 127) && 0 === (lanes & root$jscomp$0.expiredLanes) || checkIfRootIsPrerendering(root$jscomp$0, lanes), exitStatus = shouldTimeSlice ? renderRootConcurrent(root$jscomp$0, lanes) : renderRootSync(root$jscomp$0, lanes, true), renderWasConcurrent = shouldTimeSlice;
    do {
      if (0 === exitStatus) {
        workInProgressRootIsPrerendering && !shouldTimeSlice && markRootSuspended(root$jscomp$0, lanes, 0, false);
        break;
      } else {
        forceSync = root$jscomp$0.current.alternate;
        if (renderWasConcurrent && !isRenderConsistentWithExternalStores(forceSync)) {
          exitStatus = renderRootSync(root$jscomp$0, lanes, false);
          renderWasConcurrent = false;
          continue;
        }
        if (2 === exitStatus) {
          renderWasConcurrent = lanes;
          if (root$jscomp$0.errorRecoveryDisabledLanes & renderWasConcurrent)
            var JSCompiler_inline_result = 0;
          else
            JSCompiler_inline_result = root$jscomp$0.pendingLanes & -536870913, JSCompiler_inline_result = 0 !== JSCompiler_inline_result ? JSCompiler_inline_result : JSCompiler_inline_result & 536870912 ? 536870912 : 0;
          if (0 !== JSCompiler_inline_result) {
            lanes = JSCompiler_inline_result;
            a: {
              var root2 = root$jscomp$0;
              exitStatus = workInProgressRootConcurrentErrors;
              var wasRootDehydrated = root2.current.memoizedState.isDehydrated;
              wasRootDehydrated && (prepareFreshStack(root2, JSCompiler_inline_result).flags |= 256);
              JSCompiler_inline_result = renderRootSync(root2, JSCompiler_inline_result, false);
              if (2 !== JSCompiler_inline_result && 6 !== JSCompiler_inline_result) {
                if (workInProgressRootDidAttachPingListener && !wasRootDehydrated) {
                  root2.errorRecoveryDisabledLanes |= renderWasConcurrent;
                  workInProgressRootInterleavedUpdatedLanes |= renderWasConcurrent;
                  exitStatus = 4;
                  break a;
                }
                renderWasConcurrent = workInProgressRootRecoverableErrors;
                workInProgressRootRecoverableErrors = exitStatus;
                null !== renderWasConcurrent && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = renderWasConcurrent : workInProgressRootRecoverableErrors.push.apply(workInProgressRootRecoverableErrors, renderWasConcurrent));
              }
              exitStatus = JSCompiler_inline_result;
            }
            renderWasConcurrent = false;
            if (2 !== exitStatus)
              continue;
          }
        }
        if (1 === exitStatus) {
          prepareFreshStack(root$jscomp$0, 0);
          markRootSuspended(root$jscomp$0, lanes, 0, true);
          break;
        }
        a: {
          shouldTimeSlice = root$jscomp$0;
          renderWasConcurrent = exitStatus;
          switch (renderWasConcurrent) {
            case 0:
            case 1:
              throw Error(formatProdErrorMessage(345));
            case 4:
              if ((lanes & 4194048) !== lanes && (lanes & 62914560) !== lanes)
                break;
            case 6:
              markRootSuspended(shouldTimeSlice, lanes, workInProgressDeferredLane, !workInProgressRootDidSkipSuspendedSiblings);
              break a;
            case 2:
              workInProgressRootRecoverableErrors = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(formatProdErrorMessage(329));
          }
          if ((lanes & 62914560) === lanes && (exitStatus = globalMostRecentFallbackTime + 300 - now(), 10 < exitStatus)) {
            markRootSuspended(shouldTimeSlice, lanes, workInProgressDeferredLane, !workInProgressRootDidSkipSuspendedSiblings);
            if (0 !== getNextLanes(shouldTimeSlice, 0, true))
              break a;
            pendingEffectsLanes = lanes;
            shouldTimeSlice.timeoutHandle = scheduleTimeout(completeRootWhenReady.bind(null, shouldTimeSlice, forceSync, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, lanes, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, workInProgressRootDidSkipSuspendedSiblings, renderWasConcurrent, "Throttled", -0, 0), exitStatus);
            break a;
          }
          completeRootWhenReady(shouldTimeSlice, forceSync, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, lanes, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, workInProgressRootDidSkipSuspendedSiblings, renderWasConcurrent, null, -0, 0);
        }
      }
      break;
    } while (1);
    ensureRootIsScheduled(root$jscomp$0);
  }
  function completeRootWhenReady(root2, finishedWork, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime) {
    root2.timeoutHandle = -1;
    var subtreeFlags = finishedWork.subtreeFlags, isViewTransitionEligible = (lanes & 335544064) === lanes;
    suspendedCommitReason = null;
    if (isViewTransitionEligible || subtreeFlags & 8192 || 16785408 === (subtreeFlags & 16785408)) {
      if (suspendedCommitReason = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: true,
        waitingForViewTransition: false,
        unsuspend: noop$1
      }, appearingViewTransitions = null, accumulateSuspenseyCommitOnFiber(finishedWork, lanes, suspendedCommitReason), isViewTransitionEligible && (subtreeFlags = suspendedCommitReason, isViewTransitionEligible = root2.containerInfo, isViewTransitionEligible = (9 === isViewTransitionEligible.nodeType ? isViewTransitionEligible : isViewTransitionEligible.ownerDocument).__reactViewTransition, null != isViewTransitionEligible && (subtreeFlags.count++, subtreeFlags.waitingForViewTransition = true, subtreeFlags = onUnsuspend.bind(subtreeFlags), isViewTransitionEligible.finished.then(subtreeFlags, subtreeFlags))), subtreeFlags = (lanes & 62914560) === lanes ? globalMostRecentFallbackTime - now() : (lanes & 4194048) === lanes ? globalMostRecentTransitionTime - now() : 0, subtreeFlags = waitForCommitToBeReady(suspendedCommitReason, subtreeFlags), null !== subtreeFlags) {
        pendingEffectsLanes = lanes;
        root2.cancelPendingCommit = subtreeFlags(completeRoot.bind(null, root2, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedCommitReason, null, completedRenderStartTime, completedRenderEndTime));
        markRootSuspended(root2, lanes, spawnedLane, !didSkipSuspendedSiblings);
        return;
      }
    }
    completeRoot(root2, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedCommitReason);
  }
  function isRenderConsistentWithExternalStores(finishedWork) {
    for (var node = finishedWork; ; ) {
      var tag = node.tag;
      if ((0 === tag || 11 === tag || 15 === tag) && node.flags & 16384 && (tag = node.updateQueue, null !== tag && (tag = tag.stores, null !== tag)))
        for (var i = 0; i < tag.length; i++) {
          var check = tag[i], getSnapshot = check.getSnapshot;
          check = check.value;
          try {
            if (!objectIs(getSnapshot(), check))
              return false;
          } catch (error) {
            return false;
          }
        }
      tag = node.child;
      if (node.subtreeFlags & 16384 && null !== tag)
        tag.return = node, node = tag;
      else {
        if (node === finishedWork)
          break;
        for (; null === node.sibling; ) {
          if (null === node.return || node.return === finishedWork)
            return true;
          node = node.return;
        }
        node.sibling.return = node.return;
        node = node.sibling;
      }
    }
    return true;
  }
  function markRootSuspended(root2, suspendedLanes, spawnedLane, didAttemptEntireTree) {
    suspendedLanes = getEntangledLanes(root2, suspendedLanes);
    suspendedLanes &= ~workInProgressRootPingedLanes;
    suspendedLanes &= ~workInProgressRootInterleavedUpdatedLanes;
    root2.suspendedLanes |= suspendedLanes;
    root2.pingedLanes &= ~suspendedLanes;
    didAttemptEntireTree && (root2.warmLanes |= suspendedLanes);
    didAttemptEntireTree = root2.expirationTimes;
    for (var lanes = suspendedLanes; 0 < lanes; ) {
      var index$6 = 31 - clz32(lanes), lane = 1 << index$6;
      didAttemptEntireTree[index$6] = -1;
      lanes &= ~lane;
    }
    0 !== spawnedLane && markSpawnedDeferredLane(root2, spawnedLane, suspendedLanes);
  }
  function flushSyncWork$1() {
    return 0 === (executionContext & 6) ? (flushSyncWorkAcrossRoots_impl(0), false) : true;
  }
  function resetWorkInProgressStack() {
    if (null !== workInProgress) {
      if (0 === workInProgressSuspendedReason)
        var interruptedWork = workInProgress.return;
      else
        interruptedWork = workInProgress, lastContextDependency = currentlyRenderingFiber$1 = null, resetHooksOnUnwind(interruptedWork), thenableState$1 = null, thenableIndexCounter$1 = 0, interruptedWork = workInProgress;
      for (; null !== interruptedWork; )
        unwindInterruptedWork(interruptedWork.alternate, interruptedWork), interruptedWork = interruptedWork.return;
      workInProgress = null;
    }
  }
  function prepareFreshStack(root2, lanes) {
    var timeoutHandle = root2.timeoutHandle;
    -1 !== timeoutHandle && (root2.timeoutHandle = -1, cancelTimeout(timeoutHandle));
    timeoutHandle = root2.cancelPendingCommit;
    null !== timeoutHandle && (root2.cancelPendingCommit = null, timeoutHandle());
    pendingEffectsLanes = 0;
    resetWorkInProgressStack();
    workInProgressRoot = root2;
    workInProgress = timeoutHandle = createWorkInProgress(root2.current, null);
    workInProgressRootRenderLanes = lanes;
    workInProgressSuspendedReason = 0;
    workInProgressThrownValue = null;
    workInProgressRootDidSkipSuspendedSiblings = false;
    workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root2, lanes);
    workInProgressRootDidAttachPingListener = false;
    workInProgressSuspendedRetryLanes = workInProgressDeferredLane = workInProgressRootPingedLanes = workInProgressRootInterleavedUpdatedLanes = workInProgressRootSkippedLanes = workInProgressRootExitStatus = 0;
    workInProgressRootRecoverableErrors = workInProgressRootConcurrentErrors = null;
    workInProgressRootDidIncludeRecursiveRenderUpdate = false;
    entangledRenderLanes = getEntangledLanes(root2, lanes);
    finishQueueingConcurrentUpdates();
    return timeoutHandle;
  }
  function handleThrow(root2, thrownValue) {
    currentlyRenderingFiber = null;
    ReactSharedInternals.H = ContextOnlyDispatcher;
    thrownValue === SuspenseException || thrownValue === SuspenseActionException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 3) : thrownValue === SuspenseyCommitException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 4) : workInProgressSuspendedReason = thrownValue === SelectiveHydrationException ? 8 : null !== thrownValue && "object" === typeof thrownValue && "function" === typeof thrownValue.then ? 6 : 1;
    workInProgressThrownValue = thrownValue;
    null === workInProgress && (workInProgressRootExitStatus = 1, logUncaughtError(root2, createCapturedValueAtFiber(thrownValue, root2.current)));
  }
  function shouldRemainOnPreviousScreen() {
    var handler = suspenseHandlerStackCursor.current;
    return null === handler ? true : (workInProgressRootRenderLanes & 4194048) === workInProgressRootRenderLanes ? null === shellBoundary ? true : false : (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes || 0 !== (workInProgressRootRenderLanes & 536870912) ? handler === shellBoundary : false;
  }
  function pushDispatcher() {
    var prevDispatcher = ReactSharedInternals.H;
    ReactSharedInternals.H = ContextOnlyDispatcher;
    return null === prevDispatcher ? ContextOnlyDispatcher : prevDispatcher;
  }
  function pushAsyncDispatcher() {
    var prevAsyncDispatcher = ReactSharedInternals.A;
    ReactSharedInternals.A = DefaultAsyncDispatcher;
    return prevAsyncDispatcher;
  }
  function renderDidSuspendDelayIfPossible() {
    workInProgressRootExitStatus = 4;
    workInProgressRootDidSkipSuspendedSiblings || (workInProgressRootRenderLanes & 4194048) !== workInProgressRootRenderLanes && null !== suspenseHandlerStackCursor.current || (workInProgressRootIsPrerendering = true);
    0 === (workInProgressRootSkippedLanes & 134217727) && 0 === (workInProgressRootInterleavedUpdatedLanes & 134217727) || null === workInProgressRoot || markRootSuspended(workInProgressRoot, workInProgressRootRenderLanes, workInProgressDeferredLane, false);
  }
  function renderRootSync(root2, lanes, shouldYieldForPrerendering) {
    var prevExecutionContext = executionContext;
    executionContext |= 2;
    var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
    if (workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes)
      workInProgressTransitions = null, prepareFreshStack(root2, lanes);
    lanes = false;
    var exitStatus = workInProgressRootExitStatus;
    a: do
      try {
        if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
          var unitOfWork = workInProgress, thrownValue = workInProgressThrownValue;
          switch (workInProgressSuspendedReason) {
            case 8:
              resetWorkInProgressStack();
              exitStatus = 6;
              break a;
            case 3:
            case 2:
            case 9:
            case 6:
              null === suspenseHandlerStackCursor.current && (lanes = true);
              var reason = workInProgressSuspendedReason;
              workInProgressSuspendedReason = 0;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason);
              if (shouldYieldForPrerendering && workInProgressRootIsPrerendering) {
                exitStatus = 0;
                break a;
              }
              break;
            default:
              reason = workInProgressSuspendedReason, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason);
          }
        }
        workLoopSync();
        exitStatus = workInProgressRootExitStatus;
        break;
      } catch (thrownValue$184) {
        handleThrow(root2, thrownValue$184);
      }
    while (1);
    lanes && root2.shellSuspendCounter++;
    lastContextDependency = currentlyRenderingFiber$1 = null;
    executionContext = prevExecutionContext;
    ReactSharedInternals.H = prevDispatcher;
    ReactSharedInternals.A = prevAsyncDispatcher;
    null === workInProgress && (workInProgressRoot = null, workInProgressRootRenderLanes = 0, finishQueueingConcurrentUpdates());
    return exitStatus;
  }
  function workLoopSync() {
    for (; null !== workInProgress; )
      performUnitOfWork(workInProgress);
  }
  function renderRootConcurrent(root2, lanes) {
    var prevExecutionContext = executionContext;
    executionContext |= 2;
    var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
    workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes ? (workInProgressTransitions = null, workInProgressRootRenderTargetTime = now() + 500, prepareFreshStack(root2, lanes)) : workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root2, lanes);
    a: do
      try {
        if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
          lanes = workInProgress;
          var thrownValue = workInProgressThrownValue;
          b: switch (workInProgressSuspendedReason) {
            case 1:
              workInProgressSuspendedReason = 0;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root2, lanes, thrownValue, 1);
              break;
            case 2:
            case 9:
              if (isThenableResolved(thrownValue)) {
                workInProgressSuspendedReason = 0;
                workInProgressThrownValue = null;
                replaySuspendedUnitOfWork(lanes);
                break;
              }
              lanes = function() {
                2 !== workInProgressSuspendedReason && 9 !== workInProgressSuspendedReason || workInProgressRoot !== root2 || (workInProgressSuspendedReason = 7);
                ensureRootIsScheduled(root2);
              };
              thrownValue.then(lanes, lanes);
              break a;
            case 3:
              workInProgressSuspendedReason = 7;
              break a;
            case 4:
              workInProgressSuspendedReason = 5;
              break a;
            case 7:
              isThenableResolved(thrownValue) ? (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, replaySuspendedUnitOfWork(lanes)) : (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, lanes, thrownValue, 7));
              break;
            case 5:
              var resource = null;
              switch (workInProgress.tag) {
                case 26:
                  resource = workInProgress.memoizedState;
                case 5:
                case 27:
                  var hostFiber = workInProgress;
                  if (resource ? preloadResource(resource) : hostFiber.stateNode.complete) {
                    workInProgressSuspendedReason = 0;
                    workInProgressThrownValue = null;
                    var sibling = hostFiber.sibling;
                    if (null !== sibling)
                      workInProgress = sibling;
                    else {
                      var returnFiber = hostFiber.return;
                      null !== returnFiber ? (workInProgress = returnFiber, completeUnitOfWork(returnFiber)) : workInProgress = null;
                    }
                    break b;
                  }
              }
              workInProgressSuspendedReason = 0;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root2, lanes, thrownValue, 5);
              break;
            case 6:
              workInProgressSuspendedReason = 0;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root2, lanes, thrownValue, 6);
              break;
            case 8:
              resetWorkInProgressStack();
              workInProgressRootExitStatus = 6;
              break a;
            default:
              throw Error(formatProdErrorMessage(462));
          }
        }
        workLoopConcurrentByScheduler();
        break;
      } catch (thrownValue$186) {
        handleThrow(root2, thrownValue$186);
      }
    while (1);
    lastContextDependency = currentlyRenderingFiber$1 = null;
    ReactSharedInternals.H = prevDispatcher;
    ReactSharedInternals.A = prevAsyncDispatcher;
    executionContext = prevExecutionContext;
    if (null !== workInProgress)
      return 0;
    workInProgressRoot = null;
    workInProgressRootRenderLanes = 0;
    finishQueueingConcurrentUpdates();
    return workInProgressRootExitStatus;
  }
  function workLoopConcurrentByScheduler() {
    for (; null !== workInProgress && !shouldYield(); )
      performUnitOfWork(workInProgress);
  }
  function performUnitOfWork(unitOfWork) {
    var next = beginWork(unitOfWork.alternate, unitOfWork, entangledRenderLanes);
    unitOfWork.memoizedProps = unitOfWork.pendingProps;
    null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
  }
  function replaySuspendedUnitOfWork(unitOfWork) {
    var next = unitOfWork;
    var current = next.alternate;
    switch (next.tag) {
      case 15:
      case 0:
        next = replayFunctionComponent(current, next, next.pendingProps, next.type, void 0, workInProgressRootRenderLanes);
        break;
      case 11:
        next = replayFunctionComponent(current, next, next.pendingProps, next.type.render, next.ref, workInProgressRootRenderLanes);
        break;
      case 5:
        resetHooksOnUnwind(next);
        var fiber = next;
        fiber === hydrationParentFiber && (isHydrating ? (popToNextHostParent(fiber), 5 === fiber.tag && null != fiber.stateNode && (nextHydratableInstance = fiber.stateNode)) : (popToNextHostParent(fiber), isHydrating = true));
      default:
        unwindInterruptedWork(current, next), next = workInProgress = resetWorkInProgress(next, entangledRenderLanes), next = beginWork(current, next, entangledRenderLanes);
    }
    unitOfWork.memoizedProps = unitOfWork.pendingProps;
    null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
  }
  function throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, suspendedReason) {
    lastContextDependency = currentlyRenderingFiber$1 = null;
    resetHooksOnUnwind(unitOfWork);
    thenableState$1 = null;
    thenableIndexCounter$1 = 0;
    var returnFiber = unitOfWork.return;
    try {
      if (throwException(root2, returnFiber, unitOfWork, thrownValue, workInProgressRootRenderLanes)) {
        workInProgressRootExitStatus = 1;
        logUncaughtError(root2, createCapturedValueAtFiber(thrownValue, root2.current));
        workInProgress = null;
        return;
      }
    } catch (error) {
      if (null !== returnFiber)
        throw workInProgress = returnFiber, error;
      workInProgressRootExitStatus = 1;
      logUncaughtError(root2, createCapturedValueAtFiber(thrownValue, root2.current));
      workInProgress = null;
      return;
    }
    if (unitOfWork.flags & 32768) {
      if (isHydrating || 1 === suspendedReason)
        root2 = true;
      else if (workInProgressRootIsPrerendering || 0 !== (workInProgressRootRenderLanes & 536870912))
        root2 = false;
      else if (workInProgressRootDidSkipSuspendedSiblings = root2 = true, 2 === suspendedReason || 9 === suspendedReason || 3 === suspendedReason || 6 === suspendedReason)
        suspendedReason = suspenseHandlerStackCursor.current, null !== suspendedReason && 13 === suspendedReason.tag && (suspendedReason.flags |= 16384);
      unwindUnitOfWork(unitOfWork, root2);
    } else
      completeUnitOfWork(unitOfWork);
  }
  function completeUnitOfWork(unitOfWork) {
    var completedWork = unitOfWork;
    do {
      if (0 !== (completedWork.flags & 32768)) {
        unwindUnitOfWork(completedWork, workInProgressRootDidSkipSuspendedSiblings);
        return;
      }
      unitOfWork = completedWork.return;
      var next = completeWork(completedWork.alternate, completedWork, entangledRenderLanes);
      if (null !== next) {
        workInProgress = next;
        return;
      }
      completedWork = completedWork.sibling;
      if (null !== completedWork) {
        workInProgress = completedWork;
        return;
      }
      workInProgress = completedWork = unitOfWork;
    } while (null !== completedWork);
    0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 5);
  }
  function unwindUnitOfWork(unitOfWork, skipSiblings) {
    do {
      var next = unwindWork(unitOfWork.alternate, unitOfWork);
      if (null !== next) {
        next.flags &= 32767;
        workInProgress = next;
        return;
      }
      next = unitOfWork.return;
      null !== next && (next.flags |= 32768, next.subtreeFlags = 0, next.deletions = null);
      if (!skipSiblings && (unitOfWork = unitOfWork.sibling, null !== unitOfWork)) {
        workInProgress = unitOfWork;
        return;
      }
      workInProgress = unitOfWork = next;
    } while (null !== unitOfWork);
    workInProgressRootExitStatus = 6;
    workInProgress = null;
  }
  function completeRoot(root2, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedState) {
    root2.cancelPendingCommit = null;
    do
      flushPendingEffects();
    while (0 !== pendingEffectsStatus);
    if (0 !== (executionContext & 6))
      throw Error(formatProdErrorMessage(327));
    if (null !== finishedWork) {
      if (finishedWork === root2.current)
        throw Error(formatProdErrorMessage(177));
      root2 === workInProgressRoot && (workInProgress = workInProgressRoot = null, workInProgressRootRenderLanes = 0);
      pendingFinishedWork = finishedWork;
      pendingEffectsRoot = root2;
      pendingEffectsLanes = lanes;
      pendingPassiveTransitions = transitions;
      pendingRecoverableErrors = recoverableErrors;
      commitRoot(root2, finishedWork, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, suspendedState);
    }
  }
  function commitRoot(root2, finishedWork, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, suspendedState) {
    var remainingLanes = finishedWork.lanes | finishedWork.childLanes;
    pendingEffectsRemainingLanes = remainingLanes;
    remainingLanes |= concurrentlyUpdatedLanes;
    markRootFinished(root2, lanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes);
    pendingViewTransitionEvents = null;
    (lanes & 335544064) === lanes ? (pendingTransitionTypes = claimQueuedTransitionTypes(root2), spawnedLane = 10262) : (pendingTransitionTypes = null, spawnedLane = 10256);
    0 !== (finishedWork.subtreeFlags & spawnedLane) || 0 !== (finishedWork.flags & spawnedLane) ? (root2.callbackNode = null, root2.callbackPriority = 0, scheduleCallback$1(NormalPriority$1, function() {
      flushPassiveEffects();
      return null;
    })) : (root2.callbackNode = null, root2.callbackPriority = 0);
    shouldStartViewTransition = false;
    spawnedLane = 0 !== (finishedWork.flags & 13878);
    if (0 !== (finishedWork.subtreeFlags & 13878) || spawnedLane) {
      spawnedLane = ReactSharedInternals.T;
      ReactSharedInternals.T = null;
      updatedLanes = ReactDOMSharedInternals.p;
      ReactDOMSharedInternals.p = 2;
      suspendedRetryLanes = executionContext;
      executionContext |= 4;
      try {
        commitBeforeMutationEffects(root2, finishedWork, lanes);
      } finally {
        executionContext = suspendedRetryLanes, ReactDOMSharedInternals.p = updatedLanes, ReactSharedInternals.T = spawnedLane;
      }
    }
    pendingEffectsStatus = 1;
    shouldStartViewTransition ? pendingViewTransition = startViewTransition(suspendedState, root2.containerInfo, pendingTransitionTypes, flushMutationEffects, flushLayoutEffects, flushAfterMutationEffects, flushSpawnedWork, flushPassiveEffects, reportViewTransitionError) : (flushMutationEffects(), flushLayoutEffects(), flushSpawnedWork());
  }
  function reportViewTransitionError(error) {
    if (0 !== pendingEffectsStatus) {
      var onRecoverableError = pendingEffectsRoot.onRecoverableError;
      onRecoverableError(error, { componentStack: null });
    }
  }
  function flushAfterMutationEffects() {
    3 === pendingEffectsStatus && (pendingEffectsStatus = 0, commitAfterMutationEffectsOnFiber(pendingFinishedWork, pendingEffectsRoot), pendingEffectsStatus = 4);
  }
  function flushMutationEffects() {
    if (1 === pendingEffectsStatus) {
      pendingEffectsStatus = 0;
      var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, lanes = pendingEffectsLanes, rootMutationHasEffect = 0 !== (finishedWork.flags & 13878);
      if (0 !== (finishedWork.subtreeFlags & 13878) || rootMutationHasEffect) {
        rootMutationHasEffect = ReactSharedInternals.T;
        ReactSharedInternals.T = null;
        var previousPriority = ReactDOMSharedInternals.p;
        ReactDOMSharedInternals.p = 2;
        var prevExecutionContext = executionContext;
        executionContext |= 4;
        try {
          inUpdateViewTransition = rootViewTransitionAffected = false;
          commitMutationEffectsOnFiber(finishedWork, root2, lanes);
          lanes = selectionInformation;
          var curFocusedElem = getActiveElementDeep(root2.containerInfo), priorFocusedElem = lanes.focusedElem, priorSelectionRange = lanes.selectionRange;
          if (curFocusedElem !== priorFocusedElem && priorFocusedElem && priorFocusedElem.ownerDocument && containsNode(priorFocusedElem.ownerDocument.documentElement, priorFocusedElem)) {
            if (null !== priorSelectionRange && hasSelectionCapabilities(priorFocusedElem)) {
              var start = priorSelectionRange.start, end = priorSelectionRange.end;
              void 0 === end && (end = start);
              if ("selectionStart" in priorFocusedElem)
                priorFocusedElem.selectionStart = start, priorFocusedElem.selectionEnd = Math.min(end, priorFocusedElem.value.length);
              else {
                var doc = priorFocusedElem.ownerDocument || document, win = doc && doc.defaultView || window;
                if (win.getSelection) {
                  var selection = win.getSelection(), length = priorFocusedElem.textContent.length, start$jscomp$0 = Math.min(priorSelectionRange.start, length), end$jscomp$0 = void 0 === priorSelectionRange.end ? start$jscomp$0 : Math.min(priorSelectionRange.end, length);
                  !selection.extend && start$jscomp$0 > end$jscomp$0 && (curFocusedElem = end$jscomp$0, end$jscomp$0 = start$jscomp$0, start$jscomp$0 = curFocusedElem);
                  var startMarker = getNodeForCharacterOffset(priorFocusedElem, start$jscomp$0), endMarker = getNodeForCharacterOffset(priorFocusedElem, end$jscomp$0);
                  if (startMarker && endMarker && (1 !== selection.rangeCount || selection.anchorNode !== startMarker.node || selection.anchorOffset !== startMarker.offset || selection.focusNode !== endMarker.node || selection.focusOffset !== endMarker.offset)) {
                    var range = doc.createRange();
                    range.setStart(startMarker.node, startMarker.offset);
                    selection.removeAllRanges();
                    start$jscomp$0 > end$jscomp$0 ? (selection.addRange(range), selection.extend(endMarker.node, endMarker.offset)) : (range.setEnd(endMarker.node, endMarker.offset), selection.addRange(range));
                  }
                }
              }
            }
            doc = [];
            for (selection = priorFocusedElem; selection = selection.parentNode; )
              1 === selection.nodeType && doc.push({
                element: selection,
                left: selection.scrollLeft,
                top: selection.scrollTop
              });
            "function" === typeof priorFocusedElem.focus && priorFocusedElem.focus();
            for (priorFocusedElem = 0; priorFocusedElem < doc.length; priorFocusedElem++) {
              var info = doc[priorFocusedElem];
              info.element.scrollLeft = info.left;
              info.element.scrollTop = info.top;
            }
          }
          _enabled = !!eventsEnabled;
          selectionInformation = eventsEnabled = null;
        } finally {
          executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootMutationHasEffect;
        }
      }
      root2.current = finishedWork;
      pendingEffectsStatus = 2;
    }
  }
  function flushLayoutEffects() {
    if (2 === pendingEffectsStatus) {
      pendingEffectsStatus = 0;
      var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootHasLayoutEffect = 0 !== (finishedWork.flags & 8772);
      if (0 !== (finishedWork.subtreeFlags & 8772) || rootHasLayoutEffect) {
        rootHasLayoutEffect = ReactSharedInternals.T;
        ReactSharedInternals.T = null;
        var previousPriority = ReactDOMSharedInternals.p;
        ReactDOMSharedInternals.p = 2;
        var prevExecutionContext = executionContext;
        executionContext |= 4;
        try {
          commitLayoutEffectOnFiber(root2, finishedWork.alternate, finishedWork);
        } finally {
          executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootHasLayoutEffect;
        }
      }
      pendingEffectsStatus = 3;
    }
  }
  function flushSpawnedWork() {
    if (4 === pendingEffectsStatus || 3 === pendingEffectsStatus) {
      pendingEffectsStatus = 0;
      var committedViewTransition = pendingViewTransition;
      pendingViewTransition = null;
      requestPaint();
      var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, lanes = pendingEffectsLanes, recoverableErrors = pendingRecoverableErrors, passiveSubtreeMask = (lanes & 335544064) === lanes ? 10262 : 10256;
      0 !== (finishedWork.subtreeFlags & passiveSubtreeMask) || 0 !== (finishedWork.flags & passiveSubtreeMask) ? pendingEffectsStatus = 5 : (pendingEffectsStatus = 0, pendingFinishedWork = pendingEffectsRoot = null, releaseRootPooledCache(root2, root2.pendingLanes));
      passiveSubtreeMask = root2.pendingLanes;
      0 === passiveSubtreeMask && (legacyErrorBoundariesThatAlreadyFailed = null);
      lanesToEventPriority(lanes);
      finishedWork = finishedWork.stateNode;
      if (injectedHook && "function" === typeof injectedHook.onCommitFiberRoot)
        try {
          injectedHook.onCommitFiberRoot(rendererID, finishedWork, void 0, 128 === (finishedWork.current.flags & 128));
        } catch (err) {
        }
      if (null !== recoverableErrors) {
        finishedWork = ReactSharedInternals.T;
        passiveSubtreeMask = ReactDOMSharedInternals.p;
        ReactDOMSharedInternals.p = 2;
        ReactSharedInternals.T = null;
        try {
          for (var onRecoverableError = root2.onRecoverableError, i = 0; i < recoverableErrors.length; i++) {
            var recoverableError = recoverableErrors[i];
            onRecoverableError(recoverableError.value, {
              componentStack: recoverableError.stack
            });
          }
        } finally {
          ReactSharedInternals.T = finishedWork, ReactDOMSharedInternals.p = passiveSubtreeMask;
        }
      }
      recoverableErrors = pendingViewTransitionEvents;
      onRecoverableError = pendingTransitionTypes;
      pendingTransitionTypes = null;
      if (null !== recoverableErrors && (pendingViewTransitionEvents = null, null === onRecoverableError && (onRecoverableError = []), null !== committedViewTransition))
        for (recoverableError = 0; recoverableError < recoverableErrors.length; recoverableError++)
          finishedWork = (0, recoverableErrors[recoverableError])(onRecoverableError), void 0 !== finishedWork && committedViewTransition.finished.finally(finishedWork);
      0 !== (pendingEffectsLanes & 3) && flushPendingEffects();
      ensureRootIsScheduled(root2);
      passiveSubtreeMask = root2.pendingLanes;
      0 !== (lanes & 261930) && 0 !== (passiveSubtreeMask & 42) ? root2 === rootWithNestedUpdates ? nestedUpdateCount++ : (nestedUpdateCount = 0, rootWithNestedUpdates = root2) : (nestedUpdateCount = 0, rootWithNestedUpdates = null);
      flushSyncWorkAcrossRoots_impl(0);
    }
  }
  function releaseRootPooledCache(root2, remainingLanes) {
    0 === (root2.pooledCacheLanes &= remainingLanes) && (remainingLanes = root2.pooledCache, null != remainingLanes && (root2.pooledCache = null, releaseCache(remainingLanes)));
  }
  function flushPendingEffects() {
    null !== pendingViewTransition && (pendingViewTransition.skipTransition(), pendingViewTransition = null);
    flushMutationEffects();
    flushLayoutEffects();
    flushSpawnedWork();
    return flushPassiveEffects();
  }
  function flushPassiveEffects() {
    if (5 !== pendingEffectsStatus)
      return false;
    var root2 = pendingEffectsRoot, remainingLanes = pendingEffectsRemainingLanes;
    pendingEffectsRemainingLanes = 0;
    var renderPriority = lanesToEventPriority(pendingEffectsLanes), prevTransition = ReactSharedInternals.T, previousPriority = ReactDOMSharedInternals.p;
    try {
      ReactDOMSharedInternals.p = 32 > renderPriority ? 32 : renderPriority;
      ReactSharedInternals.T = null;
      renderPriority = pendingPassiveTransitions;
      pendingPassiveTransitions = null;
      var root$jscomp$0 = pendingEffectsRoot, lanes = pendingEffectsLanes;
      pendingEffectsStatus = 0;
      pendingFinishedWork = pendingEffectsRoot = null;
      pendingEffectsLanes = 0;
      if (0 !== (executionContext & 6))
        throw Error(formatProdErrorMessage(331));
      var prevExecutionContext = executionContext;
      executionContext |= 4;
      commitPassiveUnmountOnFiber(root$jscomp$0.current);
      commitPassiveMountOnFiber(root$jscomp$0, root$jscomp$0.current, lanes, renderPriority);
      executionContext = prevExecutionContext;
      flushSyncWorkAcrossRoots_impl(0, false);
      if (injectedHook && "function" === typeof injectedHook.onPostCommitFiberRoot)
        try {
          injectedHook.onPostCommitFiberRoot(rendererID, root$jscomp$0);
        } catch (err) {
        }
      return true;
    } finally {
      ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition, releaseRootPooledCache(root2, remainingLanes);
    }
  }
  function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
    sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
    sourceFiber = createRootErrorUpdate(rootFiber.stateNode, sourceFiber, 2);
    rootFiber = enqueueUpdate(rootFiber, sourceFiber, 2);
    null !== rootFiber && (markRootUpdated$1(rootFiber, 2), ensureRootIsScheduled(rootFiber));
  }
  function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error) {
    if (3 === sourceFiber.tag)
      captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
    else
      for (; null !== nearestMountedAncestor; ) {
        if (3 === nearestMountedAncestor.tag) {
          captureCommitPhaseErrorOnRoot(nearestMountedAncestor, sourceFiber, error);
          break;
        } else if (1 === nearestMountedAncestor.tag) {
          var instance = nearestMountedAncestor.stateNode;
          if ("function" === typeof nearestMountedAncestor.type.getDerivedStateFromError || "function" === typeof instance.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(instance))) {
            sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
            error = createClassErrorUpdate(2);
            instance = enqueueUpdate(nearestMountedAncestor, error, 2);
            null !== instance && (initializeClassErrorUpdate(error, instance, nearestMountedAncestor, sourceFiber), markRootUpdated$1(instance, 2), ensureRootIsScheduled(instance));
            break;
          }
        }
        nearestMountedAncestor = nearestMountedAncestor.return;
      }
  }
  function attachPingListener(root2, wakeable, lanes) {
    var pingCache = root2.pingCache;
    if (null === pingCache) {
      pingCache = root2.pingCache = new PossiblyWeakMap();
      var threadIDs =  new Set();
      pingCache.set(wakeable, threadIDs);
    } else
      threadIDs = pingCache.get(wakeable), void 0 === threadIDs && (threadIDs =  new Set(), pingCache.set(wakeable, threadIDs));
    threadIDs.has(lanes) || (workInProgressRootDidAttachPingListener = true, threadIDs.add(lanes), root2 = pingSuspendedRoot.bind(null, root2, wakeable, lanes), wakeable.then(root2, root2));
  }
  function pingSuspendedRoot(root2, wakeable, pingedLanes) {
    var pingCache = root2.pingCache;
    null !== pingCache && pingCache.delete(wakeable);
    root2.pingedLanes |= root2.suspendedLanes & pingedLanes;
    root2.warmLanes &= ~pingedLanes;
    workInProgressRoot === root2 && (workInProgressRootRenderLanes & pingedLanes) === pingedLanes && (4 === workInProgressRootExitStatus || 3 === workInProgressRootExitStatus && (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes && 300 > now() - globalMostRecentFallbackTime ? 0 === (executionContext & 2) ? prepareFreshStack(root2, 0) : workInProgressRootPingedLanes |= pingedLanes : workInProgressRootPingedLanes |= pingedLanes, workInProgressSuspendedRetryLanes === workInProgressRootRenderLanes && (workInProgressSuspendedRetryLanes = 0));
    ensureRootIsScheduled(root2);
  }
  function retryTimedOutBoundary(boundaryFiber, retryLane) {
    0 === retryLane && (retryLane = claimNextRetryLane());
    boundaryFiber = enqueueConcurrentRenderForLane(boundaryFiber, retryLane);
    null !== boundaryFiber && (markRootUpdated$1(boundaryFiber, retryLane), ensureRootIsScheduled(boundaryFiber));
  }
  function retryDehydratedSuspenseBoundary(boundaryFiber) {
    var suspenseState = boundaryFiber.memoizedState, retryLane = 0;
    null !== suspenseState && (retryLane = suspenseState.retryLane);
    retryTimedOutBoundary(boundaryFiber, retryLane);
  }
  function resolveRetryWakeable(boundaryFiber, wakeable) {
    var retryLane = 0;
    switch (boundaryFiber.tag) {
      case 31:
      case 13:
        var retryCache = boundaryFiber.stateNode;
        var suspenseState = boundaryFiber.memoizedState;
        null !== suspenseState && (retryLane = suspenseState.retryLane);
        break;
      case 19:
        retryCache = boundaryFiber.stateNode;
        break;
      case 22:
        retryCache = boundaryFiber.stateNode._retryCache;
        break;
      default:
        throw Error(formatProdErrorMessage(314));
    }
    null !== retryCache && retryCache.delete(wakeable);
    retryTimedOutBoundary(boundaryFiber, retryLane);
  }
  function scheduleCallback$1(priorityLevel, callback) {
    return scheduleCallback$3(priorityLevel, callback);
  }
  var firstScheduledRoot = null, lastScheduledRoot = null, didScheduleMicrotask = false, mightHavePendingSyncWork = false, isFlushingWork = false, currentEventTransitionLane = 0;
  function ensureRootIsScheduled(root2) {
    root2 !== lastScheduledRoot && null === root2.next && (null === lastScheduledRoot ? firstScheduledRoot = lastScheduledRoot = root2 : lastScheduledRoot = lastScheduledRoot.next = root2);
    mightHavePendingSyncWork = true;
    didScheduleMicrotask || (didScheduleMicrotask = true, scheduleImmediateRootScheduleTask());
  }
  function flushSyncWorkAcrossRoots_impl(syncTransitionLanes, onlyLegacy) {
    if (!isFlushingWork && mightHavePendingSyncWork) {
      isFlushingWork = true;
      do {
        var didPerformSomeWork = false;
        for (var root$190 = firstScheduledRoot; null !== root$190; ) {
          if (0 !== syncTransitionLanes) {
            var pendingLanes = root$190.pendingLanes;
            if (0 === pendingLanes)
              var JSCompiler_inline_result = 0;
            else {
              var suspendedLanes = root$190.suspendedLanes, pingedLanes = root$190.pingedLanes;
              JSCompiler_inline_result = (1 << 31 - clz32(42 | syncTransitionLanes) + 1) - 1;
              JSCompiler_inline_result &= pendingLanes & ~(suspendedLanes & ~pingedLanes);
              JSCompiler_inline_result = JSCompiler_inline_result & 201326741 ? JSCompiler_inline_result & 201326741 | 1 : JSCompiler_inline_result ? JSCompiler_inline_result | 2 : 0;
            }
            0 !== JSCompiler_inline_result && (didPerformSomeWork = true, performSyncWorkOnRoot(root$190, JSCompiler_inline_result));
          } else
            JSCompiler_inline_result = workInProgressRootRenderLanes, JSCompiler_inline_result = getNextLanes(root$190, root$190 === workInProgressRoot ? JSCompiler_inline_result : 0, null !== root$190.cancelPendingCommit || -1 !== root$190.timeoutHandle), 0 === (JSCompiler_inline_result & 3) || checkIfRootIsPrerendering(root$190, JSCompiler_inline_result) || (didPerformSomeWork = true, performSyncWorkOnRoot(root$190, JSCompiler_inline_result));
          root$190 = root$190.next;
        }
      } while (didPerformSomeWork);
      isFlushingWork = false;
    }
  }
  function processRootScheduleInImmediateTask() {
    processRootScheduleInMicrotask();
  }
  function processRootScheduleInMicrotask() {
    mightHavePendingSyncWork = didScheduleMicrotask = false;
    var syncTransitionLanes = 0;
    0 !== currentEventTransitionLane && shouldAttemptEagerTransition() && (syncTransitionLanes = currentEventTransitionLane);
    for (var currentTime = now(), prev = null, root2 = firstScheduledRoot; null !== root2; ) {
      var next = root2.next, nextLanes = scheduleTaskForRootDuringMicrotask(root2, currentTime);
      if (0 === nextLanes)
        root2.next = null, null === prev ? firstScheduledRoot = next : prev.next = next, null === next && (lastScheduledRoot = prev);
      else if (prev = root2, 0 !== syncTransitionLanes || 0 !== (nextLanes & 3))
        mightHavePendingSyncWork = true;
      root2 = next;
    }
    0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus || flushSyncWorkAcrossRoots_impl(syncTransitionLanes);
    0 !== currentEventTransitionLane && (currentEventTransitionLane = 0);
  }
  function scheduleTaskForRootDuringMicrotask(root2, currentTime) {
    for (var suspendedLanes = root2.suspendedLanes, pingedLanes = root2.pingedLanes, expirationTimes = root2.expirationTimes, lanes = root2.pendingLanes & -62914561; 0 < lanes; ) {
      var index$5 = 31 - clz32(lanes), lane = 1 << index$5, expirationTime = expirationTimes[index$5];
      if (-1 === expirationTime) {
        if (0 === (lane & suspendedLanes) || 0 !== (lane & pingedLanes))
          expirationTimes[index$5] = computeExpirationTime(lane, currentTime);
      } else
        expirationTime <= currentTime && (root2.expiredLanes |= lane);
      lanes &= ~lane;
    }
    currentTime = workInProgressRoot;
    suspendedLanes = workInProgressRootRenderLanes;
    suspendedLanes = getNextLanes(root2, root2 === currentTime ? suspendedLanes : 0, null !== root2.cancelPendingCommit || -1 !== root2.timeoutHandle);
    pingedLanes = root2.callbackNode;
    if (0 === suspendedLanes || root2 === currentTime && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root2.cancelPendingCommit)
      return null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes), root2.callbackNode = null, root2.callbackPriority = 0;
    if (0 === (suspendedLanes & 3) || checkIfRootIsPrerendering(root2, suspendedLanes)) {
      currentTime = suspendedLanes & -suspendedLanes;
      if (currentTime === root2.callbackPriority)
        return currentTime;
      null !== pingedLanes && cancelCallback$1(pingedLanes);
      switch (lanesToEventPriority(suspendedLanes)) {
        case 2:
        case 8:
          suspendedLanes = UserBlockingPriority;
          break;
        case 32:
          suspendedLanes = NormalPriority$1;
          break;
        case 268435456:
          suspendedLanes = IdlePriority;
          break;
        default:
          suspendedLanes = NormalPriority$1;
      }
      pingedLanes = performWorkOnRootViaSchedulerTask.bind(null, root2);
      suspendedLanes = scheduleCallback$3(suspendedLanes, pingedLanes);
      root2.callbackPriority = currentTime;
      root2.callbackNode = suspendedLanes;
      return currentTime;
    }
    null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes);
    root2.callbackPriority = 2;
    root2.callbackNode = null;
    return 2;
  }
  function performWorkOnRootViaSchedulerTask(root2, didTimeout) {
    if (0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus)
      return root2.callbackNode = null, root2.callbackPriority = 0, null;
    var originalCallbackNode = root2.callbackNode;
    if (flushPendingEffects() && root2.callbackNode !== originalCallbackNode)
      return null;
    var workInProgressRootRenderLanes$jscomp$0 = workInProgressRootRenderLanes;
    workInProgressRootRenderLanes$jscomp$0 = getNextLanes(root2, root2 === workInProgressRoot ? workInProgressRootRenderLanes$jscomp$0 : 0, null !== root2.cancelPendingCommit || -1 !== root2.timeoutHandle);
    if (0 === workInProgressRootRenderLanes$jscomp$0)
      return null;
    performWorkOnRoot(root2, workInProgressRootRenderLanes$jscomp$0, didTimeout);
    scheduleTaskForRootDuringMicrotask(root2, now());
    return null != root2.callbackNode && root2.callbackNode === originalCallbackNode ? performWorkOnRootViaSchedulerTask.bind(null, root2) : null;
  }
  function performSyncWorkOnRoot(root2, lanes) {
    if (flushPendingEffects())
      return null;
    performWorkOnRoot(root2, lanes, true);
  }
  function scheduleImmediateRootScheduleTask() {
    scheduleMicrotask(function() {
      0 !== (executionContext & 6) ? scheduleCallback$3(ImmediatePriority, processRootScheduleInImmediateTask) : processRootScheduleInMicrotask();
    });
  }
  function requestTransitionLane() {
    if (0 === currentEventTransitionLane) {
      var actionScopeLane = currentEntangledLane;
      0 === actionScopeLane && (actionScopeLane = nextTransitionUpdateLane, nextTransitionUpdateLane <<= 1, 0 === (nextTransitionUpdateLane & 261888) && (nextTransitionUpdateLane = 256));
      currentEventTransitionLane = actionScopeLane;
    }
    return currentEventTransitionLane;
  }
  function coerceFormActionProp(actionProp) {
    return null == actionProp || "symbol" === typeof actionProp || "boolean" === typeof actionProp ? null : "function" === typeof actionProp ? actionProp : sanitizeURL(actionProp);
  }
  function extractEvents$1(dispatchQueue, domEventName, maybeTargetInst, nativeEvent, nativeEventTarget) {
    if ("submit" === domEventName && maybeTargetInst && maybeTargetInst.stateNode === nativeEventTarget) {
      var action = coerceFormActionProp((nativeEventTarget[internalPropsKey] || null).action), submitter = nativeEvent.submitter;
      submitter && (domEventName = (domEventName = submitter[internalPropsKey] || null) ? coerceFormActionProp(domEventName.formAction) : submitter.getAttribute("formAction"), null !== domEventName && (action = domEventName, submitter = null));
      var event = new SyntheticEvent("action", "action", null, nativeEvent, nativeEventTarget);
      dispatchQueue.push({
        event,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (nativeEvent.defaultPrevented) {
                if (0 !== currentEventTransitionLane) {
                  var formData = new FormData(nativeEventTarget, submitter);
                  startHostTransition(maybeTargetInst, {
                    pending: true,
                    data: formData,
                    method: nativeEventTarget.method,
                    action
                  }, null, formData);
                }
              } else
                "function" === typeof action && (event.preventDefault(), formData = new FormData(nativeEventTarget, submitter), startHostTransition(maybeTargetInst, {
                  pending: true,
                  data: formData,
                  method: nativeEventTarget.method,
                  action
                }, action, formData));
            },
            currentTarget: nativeEventTarget
          }
        ]
      });
    }
  }
  for (var i$jscomp$inline_1667 = 0; i$jscomp$inline_1667 < simpleEventPluginEvents.length; i$jscomp$inline_1667++) {
    var eventName$jscomp$inline_1668 = simpleEventPluginEvents[i$jscomp$inline_1667], domEventName$jscomp$inline_1669 = eventName$jscomp$inline_1668.toLowerCase(), capitalizedEvent$jscomp$inline_1670 = eventName$jscomp$inline_1668[0].toUpperCase() + eventName$jscomp$inline_1668.slice(1);
    registerSimpleEvent(domEventName$jscomp$inline_1669, "on" + capitalizedEvent$jscomp$inline_1670);
  }
  registerSimpleEvent(ANIMATION_END, "onAnimationEnd");
  registerSimpleEvent(ANIMATION_ITERATION, "onAnimationIteration");
  registerSimpleEvent(ANIMATION_START, "onAnimationStart");
  registerSimpleEvent("dblclick", "onDoubleClick");
  registerSimpleEvent("focusin", "onFocus");
  registerSimpleEvent("focusout", "onBlur");
  registerSimpleEvent(TRANSITION_RUN, "onTransitionRun");
  registerSimpleEvent(TRANSITION_START, "onTransitionStart");
  registerSimpleEvent(TRANSITION_CANCEL, "onTransitionCancel");
  registerSimpleEvent(TRANSITION_END, "onTransitionEnd");
  registerDirectEvent("onMouseEnter", ["mouseout", "mouseover"]);
  registerDirectEvent("onMouseLeave", ["mouseout", "mouseover"]);
  registerDirectEvent("onPointerEnter", ["pointerout", "pointerover"]);
  registerDirectEvent("onPointerLeave", ["pointerout", "pointerover"]);
  registerTwoPhaseEvent("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
  registerTwoPhaseEvent("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
  registerTwoPhaseEvent("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]);
  registerTwoPhaseEvent("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
  registerTwoPhaseEvent("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
  registerTwoPhaseEvent("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var mediaEventTypes = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), nonDelegatedEvents = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(mediaEventTypes));
  function processDispatchQueue(dispatchQueue, eventSystemFlags) {
    eventSystemFlags = 0 !== (eventSystemFlags & 4);
    for (var i = 0; i < dispatchQueue.length; i++) {
      var _dispatchQueue$i = dispatchQueue[i], event = _dispatchQueue$i.event;
      _dispatchQueue$i = _dispatchQueue$i.listeners;
      a: {
        var previousInstance = void 0;
        if (eventSystemFlags)
          for (var i$jscomp$0 = _dispatchQueue$i.length - 1; 0 <= i$jscomp$0; i$jscomp$0--) {
            var _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0], instance = _dispatchListeners$i.instance, currentTarget = _dispatchListeners$i.currentTarget;
            _dispatchListeners$i = _dispatchListeners$i.listener;
            if (instance !== previousInstance && event.isPropagationStopped())
              break a;
            previousInstance = _dispatchListeners$i;
            event.currentTarget = currentTarget;
            try {
              previousInstance(event);
            } catch (error) {
              reportGlobalError(error);
            }
            event.currentTarget = null;
            previousInstance = instance;
          }
        else
          for (i$jscomp$0 = 0; i$jscomp$0 < _dispatchQueue$i.length; i$jscomp$0++) {
            _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0];
            instance = _dispatchListeners$i.instance;
            currentTarget = _dispatchListeners$i.currentTarget;
            _dispatchListeners$i = _dispatchListeners$i.listener;
            if (instance !== previousInstance && event.isPropagationStopped())
              break a;
            previousInstance = _dispatchListeners$i;
            event.currentTarget = currentTarget;
            try {
              previousInstance(event);
            } catch (error) {
              reportGlobalError(error);
            }
            event.currentTarget = null;
            previousInstance = instance;
          }
      }
    }
  }
  function listenToNonDelegatedEvent(domEventName, targetElement) {
    var JSCompiler_inline_result = targetElement[internalEventHandlersKey];
    void 0 === JSCompiler_inline_result && (JSCompiler_inline_result = targetElement[internalEventHandlersKey] =  new Set());
    var listenerSetKey = domEventName + "__bubble";
    JSCompiler_inline_result.has(listenerSetKey) || (addTrappedEventListener(targetElement, domEventName, 2, false), JSCompiler_inline_result.add(listenerSetKey));
  }
  function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
    var eventSystemFlags = 0;
    isCapturePhaseListener && (eventSystemFlags |= 4);
    addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener);
  }
  var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
  function listenToAllSupportedEvents(rootContainerElement) {
    if (!rootContainerElement[listeningMarker]) {
      rootContainerElement[listeningMarker] = true;
      allNativeEvents.forEach(function(domEventName) {
        "selectionchange" !== domEventName && (nonDelegatedEvents.has(domEventName) || listenToNativeEvent(domEventName, false, rootContainerElement), listenToNativeEvent(domEventName, true, rootContainerElement));
      });
      var ownerDocument = 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
      null === ownerDocument || ownerDocument[listeningMarker] || (ownerDocument[listeningMarker] = true, listenToNativeEvent("selectionchange", false, ownerDocument));
    }
  }
  function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
    switch (getEventPriority(domEventName)) {
      case 2:
        var listenerWrapper = dispatchDiscreteEvent;
        break;
      case 8:
        listenerWrapper = dispatchContinuousEvent;
        break;
      default:
        listenerWrapper = dispatchEvent;
    }
    eventSystemFlags = listenerWrapper.bind(null, domEventName, eventSystemFlags, targetContainer);
    listenerWrapper = void 0;
    !passiveBrowserEventsSupported || "touchstart" !== domEventName && "touchmove" !== domEventName && "wheel" !== domEventName || (listenerWrapper = true);
    isCapturePhaseListener ? void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
      capture: true,
      passive: listenerWrapper
    }) : targetContainer.addEventListener(domEventName, eventSystemFlags, true) : void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
      passive: listenerWrapper
    }) : targetContainer.addEventListener(domEventName, eventSystemFlags, false);
  }
  function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst$jscomp$0, targetContainer) {
    var ancestorInst = targetInst$jscomp$0;
    if (0 === (eventSystemFlags & 1) && 0 === (eventSystemFlags & 2) && null !== targetInst$jscomp$0)
      a: for (; ; ) {
        if (null === targetInst$jscomp$0)
          return;
        var nodeTag = targetInst$jscomp$0.tag;
        if (3 === nodeTag || 4 === nodeTag) {
          var container = targetInst$jscomp$0.stateNode.containerInfo;
          if (container === targetContainer)
            break;
          if (4 === nodeTag)
            for (nodeTag = targetInst$jscomp$0.return; null !== nodeTag; ) {
              var grandTag = nodeTag.tag;
              if ((3 === grandTag || 4 === grandTag) && nodeTag.stateNode.containerInfo === targetContainer)
                return;
              nodeTag = nodeTag.return;
            }
          for (; null !== container; ) {
            nodeTag = getClosestInstanceFromNode(container);
            if (null === nodeTag)
              return;
            grandTag = nodeTag.tag;
            if (5 === grandTag || 6 === grandTag || 26 === grandTag || 27 === grandTag) {
              targetInst$jscomp$0 = ancestorInst = nodeTag;
              continue a;
            }
            container = container.parentNode;
          }
        }
        targetInst$jscomp$0 = targetInst$jscomp$0.return;
      }
    batchedUpdates$1(function() {
      var targetInst = ancestorInst, nativeEventTarget = getEventTarget(nativeEvent), dispatchQueue = [];
      a: {
        var reactName = topLevelEventsToReactNames.get(domEventName);
        if (void 0 !== reactName) {
          var SyntheticEventCtor = SyntheticEvent, reactEventType = domEventName;
          switch (domEventName) {
            case "keypress":
              if (0 === getEventCharCode(nativeEvent))
                break a;
            case "keydown":
            case "keyup":
              SyntheticEventCtor = SyntheticKeyboardEvent;
              break;
            case "focusin":
              reactEventType = "focus";
              SyntheticEventCtor = SyntheticFocusEvent;
              break;
            case "focusout":
              reactEventType = "blur";
              SyntheticEventCtor = SyntheticFocusEvent;
              break;
            case "beforeblur":
            case "afterblur":
              SyntheticEventCtor = SyntheticFocusEvent;
              break;
            case "click":
              if (2 === nativeEvent.button)
                break a;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              SyntheticEventCtor = SyntheticMouseEvent;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              SyntheticEventCtor = SyntheticDragEvent;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              SyntheticEventCtor = SyntheticTouchEvent;
              break;
            case ANIMATION_END:
            case ANIMATION_ITERATION:
            case ANIMATION_START:
              SyntheticEventCtor = SyntheticAnimationEvent;
              break;
            case TRANSITION_END:
              SyntheticEventCtor = SyntheticTransitionEvent;
              break;
            case "scroll":
            case "scrollend":
              SyntheticEventCtor = SyntheticUIEvent;
              break;
            case "wheel":
              SyntheticEventCtor = SyntheticWheelEvent;
              break;
            case "copy":
            case "cut":
            case "paste":
              SyntheticEventCtor = SyntheticClipboardEvent;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              SyntheticEventCtor = SyntheticPointerEvent;
              break;
            case "submit":
              SyntheticEventCtor = SyntheticSubmitEvent;
              break;
            case "toggle":
            case "beforetoggle":
              SyntheticEventCtor = SyntheticToggleEvent;
          }
          var inCapturePhase = 0 !== (eventSystemFlags & 4), accumulateTargetOnly = !inCapturePhase && ("scroll" === domEventName || "scrollend" === domEventName), reactEventName = inCapturePhase ? null !== reactName ? reactName + "Capture" : null : reactName;
          inCapturePhase = [];
          for (var instance = targetInst, lastHostComponent; null !== instance; ) {
            var _instance = instance;
            lastHostComponent = _instance.stateNode;
            _instance = _instance.tag;
            5 !== _instance && 26 !== _instance && 27 !== _instance || null === lastHostComponent || null === reactEventName || (_instance = getListener(instance, reactEventName), null != _instance && inCapturePhase.push(createDispatchListener(instance, _instance, lastHostComponent)));
            if (accumulateTargetOnly)
              break;
            instance = instance.return;
          }
          0 < inCapturePhase.length && (reactName = new SyntheticEventCtor(reactName, reactEventType, null, nativeEvent, nativeEventTarget), dispatchQueue.push({ event: reactName, listeners: inCapturePhase }));
        }
      }
      if (0 === (eventSystemFlags & 7)) {
        a: {
          SyntheticEventCtor = "mouseover" === domEventName || "pointerover" === domEventName;
          reactName = "mouseout" === domEventName || "pointerout" === domEventName;
          if (SyntheticEventCtor && nativeEvent !== currentReplayingEvent && (reactEventType = nativeEvent.relatedTarget || nativeEvent.fromElement) && (getClosestInstanceFromNode(reactEventType) || reactEventType[internalContainerInstanceKey]))
            break a;
          if (reactName || SyntheticEventCtor) {
            reactEventType = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget : (SyntheticEventCtor = nativeEventTarget.ownerDocument) ? SyntheticEventCtor.defaultView || SyntheticEventCtor.parentWindow : window;
            if (reactName) {
              if (SyntheticEventCtor = nativeEvent.relatedTarget || nativeEvent.toElement, reactName = targetInst, SyntheticEventCtor = SyntheticEventCtor ? getClosestInstanceFromNode(SyntheticEventCtor) : null, null !== SyntheticEventCtor && (accumulateTargetOnly = getNearestMountedFiber(SyntheticEventCtor), inCapturePhase = SyntheticEventCtor.tag, SyntheticEventCtor !== accumulateTargetOnly || 5 !== inCapturePhase && 27 !== inCapturePhase && 6 !== inCapturePhase))
                SyntheticEventCtor = null;
            } else
              reactName = null, SyntheticEventCtor = targetInst;
            if (reactName !== SyntheticEventCtor) {
              inCapturePhase = SyntheticMouseEvent;
              _instance = "onMouseLeave";
              reactEventName = "onMouseEnter";
              instance = "mouse";
              if ("pointerout" === domEventName || "pointerover" === domEventName)
                inCapturePhase = SyntheticPointerEvent, _instance = "onPointerLeave", reactEventName = "onPointerEnter", instance = "pointer";
              accumulateTargetOnly = null == reactName ? reactEventType : getNodeFromInstance(reactName);
              lastHostComponent = null == SyntheticEventCtor ? reactEventType : getNodeFromInstance(SyntheticEventCtor);
              reactEventType = new inCapturePhase(_instance, instance + "leave", reactName, nativeEvent, nativeEventTarget);
              reactEventType.target = accumulateTargetOnly;
              reactEventType.relatedTarget = lastHostComponent;
              _instance = null;
              getClosestInstanceFromNode(nativeEventTarget) === targetInst && (inCapturePhase = new inCapturePhase(reactEventName, instance + "enter", SyntheticEventCtor, nativeEvent, nativeEventTarget), inCapturePhase.target = lastHostComponent, inCapturePhase.relatedTarget = accumulateTargetOnly, _instance = inCapturePhase);
              accumulateTargetOnly = _instance;
              inCapturePhase = reactName && SyntheticEventCtor ? getLowestCommonAncestor(reactName, SyntheticEventCtor, getParent) : null;
              null !== reactName && accumulateEnterLeaveListenersForEvent(dispatchQueue, reactEventType, reactName, inCapturePhase, false);
              null !== SyntheticEventCtor && null !== accumulateTargetOnly && accumulateEnterLeaveListenersForEvent(dispatchQueue, accumulateTargetOnly, SyntheticEventCtor, inCapturePhase, true);
            }
          }
        }
        a: {
          reactName = targetInst ? getNodeFromInstance(targetInst) : window;
          SyntheticEventCtor = reactName.nodeName && reactName.nodeName.toLowerCase();
          if ("select" === SyntheticEventCtor || "input" === SyntheticEventCtor && "file" === reactName.type)
            var getTargetInstFunc = getTargetInstForChangeEvent;
          else if (isTextInputElement(reactName))
            if (isInputEventSupported)
              getTargetInstFunc = getTargetInstForInputOrChangeEvent;
            else {
              getTargetInstFunc = getTargetInstForInputEventPolyfill;
              var handleEventFunc = handleEventsForInputEventPolyfill;
            }
          else
            SyntheticEventCtor = reactName.nodeName, !SyntheticEventCtor || "input" !== SyntheticEventCtor.toLowerCase() || "checkbox" !== reactName.type && "radio" !== reactName.type ? targetInst && isCustomElement(targetInst.elementType) && (getTargetInstFunc = getTargetInstForChangeEvent) : getTargetInstFunc = getTargetInstForClickEvent;
          if (getTargetInstFunc && (getTargetInstFunc = getTargetInstFunc(domEventName, targetInst))) {
            createAndAccumulateChangeEvent(dispatchQueue, getTargetInstFunc, nativeEvent, nativeEventTarget);
            break a;
          }
          handleEventFunc && handleEventFunc(domEventName, reactName, targetInst);
        }
        handleEventFunc = targetInst ? getNodeFromInstance(targetInst) : window;
        switch (domEventName) {
          case "focusin":
            if (isTextInputElement(handleEventFunc) || "true" === handleEventFunc.contentEditable)
              activeElement = handleEventFunc, activeElementInst = targetInst, lastSelection = null;
            break;
          case "focusout":
            lastSelection = activeElementInst = activeElement = null;
            break;
          case "mousedown":
            mouseDown = true;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            mouseDown = false;
            constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
            break;
          case "selectionchange":
            if (skipSelectionChangeEvent)
              break;
          case "keydown":
          case "keyup":
            constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
        }
        var fallbackData;
        if (canUseCompositionEvent)
          b: {
            switch (domEventName) {
              case "compositionstart":
                var eventType = "onCompositionStart";
                break b;
              case "compositionend":
                eventType = "onCompositionEnd";
                break b;
              case "compositionupdate":
                eventType = "onCompositionUpdate";
                break b;
            }
            eventType = void 0;
          }
        else
          isComposing ? isFallbackCompositionEnd(domEventName, nativeEvent) && (eventType = "onCompositionEnd") : "keydown" === domEventName && 229 === nativeEvent.keyCode && (eventType = "onCompositionStart");
        eventType && (useFallbackCompositionData && "ko" !== nativeEvent.locale && (isComposing || "onCompositionStart" !== eventType ? "onCompositionEnd" === eventType && isComposing && (fallbackData = getData()) : (root = nativeEventTarget, startText = "value" in root ? root.value : root.textContent, isComposing = true)), handleEventFunc = accumulateTwoPhaseListeners(targetInst, eventType), 0 < handleEventFunc.length && (eventType = new SyntheticCompositionEvent(eventType, domEventName, null, nativeEvent, nativeEventTarget), dispatchQueue.push({ event: eventType, listeners: handleEventFunc }), fallbackData ? eventType.data = fallbackData : (fallbackData = getDataFromCustomEvent(nativeEvent), null !== fallbackData && (eventType.data = fallbackData))));
        if (fallbackData = canUseTextInputEvent ? getNativeBeforeInputChars(domEventName, nativeEvent) : getFallbackBeforeInputChars(domEventName, nativeEvent))
          eventType = accumulateTwoPhaseListeners(targetInst, "onBeforeInput"), 0 < eventType.length && (handleEventFunc = new SyntheticCompositionEvent("onBeforeInput", "beforeinput", null, nativeEvent, nativeEventTarget), dispatchQueue.push({
            event: handleEventFunc,
            listeners: eventType
          }), handleEventFunc.data = fallbackData);
        extractEvents$1(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
      }
      processDispatchQueue(dispatchQueue, eventSystemFlags);
    });
  }
  function createDispatchListener(instance, listener, currentTarget) {
    return {
      instance,
      listener,
      currentTarget
    };
  }
  function accumulateTwoPhaseListeners(targetFiber, reactName) {
    for (var captureName = reactName + "Capture", listeners = []; null !== targetFiber; ) {
      var _instance2 = targetFiber, stateNode = _instance2.stateNode;
      _instance2 = _instance2.tag;
      5 !== _instance2 && 26 !== _instance2 && 27 !== _instance2 || null === stateNode || (_instance2 = getListener(targetFiber, captureName), null != _instance2 && listeners.unshift(createDispatchListener(targetFiber, _instance2, stateNode)), _instance2 = getListener(targetFiber, reactName), null != _instance2 && listeners.push(createDispatchListener(targetFiber, _instance2, stateNode)));
      if (3 === targetFiber.tag)
        return listeners;
      targetFiber = targetFiber.return;
    }
    return [];
  }
  function getParent(inst) {
    if (null === inst)
      return null;
    do
      inst = inst.return;
    while (inst && 5 !== inst.tag && 27 !== inst.tag);
    return inst ? inst : null;
  }
  function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
    for (var registrationName = event._reactName, listeners = []; null !== target && target !== common; ) {
      var _instance3 = target, alternate = _instance3.alternate, stateNode = _instance3.stateNode;
      _instance3 = _instance3.tag;
      if (null !== alternate && alternate === common)
        break;
      5 !== _instance3 && 26 !== _instance3 && 27 !== _instance3 || null === stateNode || (alternate = stateNode, inCapturePhase ? (stateNode = getListener(target, registrationName), null != stateNode && listeners.unshift(createDispatchListener(target, stateNode, alternate))) : inCapturePhase || (stateNode = getListener(target, registrationName), null != stateNode && listeners.push(createDispatchListener(target, stateNode, alternate))));
      target = target.return;
    }
    0 !== listeners.length && dispatchQueue.push({ event, listeners });
  }
  var NORMALIZE_NEWLINES_REGEX = /\r\n?/g, NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
  function normalizeMarkupForTextOrAttribute(markup) {
    return ("string" === typeof markup ? markup : "" + markup).replace(NORMALIZE_NEWLINES_REGEX, "\n").replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, "");
  }
  function checkForUnmatchedText(serverText, clientText) {
    clientText = normalizeMarkupForTextOrAttribute(clientText);
    return normalizeMarkupForTextOrAttribute(serverText) === clientText ? true : false;
  }
  function setProp(domElement, tag, key, value, props, prevValue) {
    switch (key) {
      case "children":
        if ("string" === typeof value)
          "body" === tag || "textarea" === tag && "" === value || setTextContent(domElement, value);
        else if ("number" === typeof value || "bigint" === typeof value)
          "body" !== tag && setTextContent(domElement, "" + value);
        else
          return;
        break;
      case "className":
        setValueForKnownAttribute(domElement, "class", value);
        break;
      case "tabIndex":
        setValueForKnownAttribute(domElement, "tabindex", value);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        setValueForKnownAttribute(domElement, key, value);
        break;
      case "style":
        setValueForStyles(domElement, value, prevValue);
        return;
      case "data":
        if ("object" !== tag) {
          setValueForKnownAttribute(domElement, "data", value);
          break;
        }
      case "src":
      case "href":
        if ("" === value && ("a" !== tag || "href" !== key)) {
          domElement.removeAttribute(key);
          break;
        }
        if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) {
          domElement.removeAttribute(key);
          break;
        }
        value = sanitizeURL(value);
        domElement.setAttribute(key, value);
        break;
      case "action":
      case "formAction":
        if ("function" === typeof value) {
          domElement.setAttribute(key, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
          break;
        } else
          "function" === typeof prevValue && ("formAction" === key ? ("input" !== tag && setProp(domElement, tag, "name", props.name, props, null), setProp(domElement, tag, "formEncType", props.formEncType, props, null), setProp(domElement, tag, "formMethod", props.formMethod, props, null), setProp(domElement, tag, "formTarget", props.formTarget, props, null)) : (setProp(domElement, tag, "encType", props.encType, props, null), setProp(domElement, tag, "method", props.method, props, null), setProp(domElement, tag, "target", props.target, props, null)));
        if (null == value || "symbol" === typeof value || "boolean" === typeof value) {
          domElement.removeAttribute(key);
          break;
        }
        value = sanitizeURL(value);
        domElement.setAttribute(key, value);
        break;
      case "onClick":
        null != value && (domElement.onclick = noop$1);
        return;
      case "onScroll":
        null != value && listenToNonDelegatedEvent("scroll", domElement);
        return;
      case "onScrollEnd":
        null != value && listenToNonDelegatedEvent("scrollend", domElement);
        return;
      case "dangerouslySetInnerHTML":
        if (null != value) {
          if ("object" !== typeof value || !("__html" in value))
            throw Error(formatProdErrorMessage(61));
          key = value.__html;
          if (null != key) {
            if (null != props.children)
              throw Error(formatProdErrorMessage(60));
            (null != prevValue ? prevValue.__html : void 0) !== key && (domElement.innerHTML = key);
          }
        }
        break;
      case "multiple":
        domElement.multiple = value && "function" !== typeof value && "symbol" !== typeof value;
        break;
      case "muted":
        domElement.muted = value && "function" !== typeof value && "symbol" !== typeof value;
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (null == value || "function" === typeof value || "boolean" === typeof value || "symbol" === typeof value) {
          domElement.removeAttribute("xlink:href");
          break;
        }
        key = sanitizeURL(value);
        domElement.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", key);
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "credentialless":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "") : domElement.removeAttribute(key);
        break;
      case "capture":
      case "download":
        true === value ? domElement.setAttribute(key, "") : false !== value && null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        null != value && "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
        break;
      case "rowSpan":
      case "start":
        null == value || "function" === typeof value || "symbol" === typeof value || isNaN(value) ? domElement.removeAttribute(key) : domElement.setAttribute(key, value);
        break;
      case "popover":
        listenToNonDelegatedEvent("beforetoggle", domElement);
        listenToNonDelegatedEvent("toggle", domElement);
        setValueForAttribute(domElement, "popover", value);
        break;
      case "xlinkActuate":
        setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:actuate", value);
        break;
      case "xlinkArcrole":
        setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:arcrole", value);
        break;
      case "xlinkRole":
        setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:role", value);
        break;
      case "xlinkShow":
        setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:show", value);
        break;
      case "xlinkTitle":
        setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:title", value);
        break;
      case "xlinkType":
        setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:type", value);
        break;
      case "xmlBase":
        setValueForNamespacedAttribute(domElement, "http://www.w3.org/XML/1998/namespace", "xml:base", value);
        break;
      case "xmlLang":
        setValueForNamespacedAttribute(domElement, "http://www.w3.org/XML/1998/namespace", "xml:lang", value);
        break;
      case "xmlSpace":
        setValueForNamespacedAttribute(domElement, "http://www.w3.org/XML/1998/namespace", "xml:space", value);
        break;
      case "is":
        setValueForAttribute(domElement, "is", value);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < key.length) || "o" !== key[0] && "O" !== key[0] || "n" !== key[1] && "N" !== key[1])
          key = aliases.get(key) || key, setValueForAttribute(domElement, key, value);
        else
          return;
    }
    viewTransitionMutationContext = true;
  }
  function setPropOnCustomElement(domElement, tag, key, value, props, prevValue) {
    switch (key) {
      case "style":
        setValueForStyles(domElement, value, prevValue);
        return;
      case "dangerouslySetInnerHTML":
        if (null != value) {
          if ("object" !== typeof value || !("__html" in value))
            throw Error(formatProdErrorMessage(61));
          key = value.__html;
          if (null != key) {
            if (null != props.children)
              throw Error(formatProdErrorMessage(60));
            (null != prevValue ? prevValue.__html : void 0) !== key && (domElement.innerHTML = key);
          }
        }
        break;
      case "children":
        if ("string" === typeof value)
          setTextContent(domElement, value);
        else if ("number" === typeof value || "bigint" === typeof value)
          setTextContent(domElement, "" + value);
        else
          return;
        break;
      case "onScroll":
        null != value && listenToNonDelegatedEvent("scroll", domElement);
        return;
      case "onScrollEnd":
        null != value && listenToNonDelegatedEvent("scrollend", domElement);
        return;
      case "onClick":
        null != value && (domElement.onclick = noop$1);
        return;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        return;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!registrationNameDependencies.hasOwnProperty(key))
          a: {
            if ("o" === key[0] && "n" === key[1] && (props = key.endsWith("Capture"), prevValue = key.slice(2, props ? key.length - 7 : void 0), tag = domElement[internalPropsKey] || null, tag = null != tag ? tag[key] : null, "function" === typeof tag && domElement.removeEventListener(prevValue, tag, props), "function" === typeof value)) {
              "function" !== typeof tag && null !== tag && (key in domElement ? domElement[key] = null : domElement.hasAttribute(key) && domElement.removeAttribute(key));
              domElement.addEventListener(prevValue, value, props);
              break a;
            }
            viewTransitionMutationContext = true;
            key in domElement ? domElement[key] = value : true === value ? domElement.setAttribute(key, "") : setValueForAttribute(domElement, key, value);
          }
        return;
    }
    viewTransitionMutationContext = true;
  }
  function setInitialProperties(domElement, tag, props) {
    switch (tag) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        listenToNonDelegatedEvent("error", domElement);
        listenToNonDelegatedEvent("load", domElement);
        var hasSrc = false, hasSrcSet = false, propKey;
        for (propKey in props)
          if (props.hasOwnProperty(propKey)) {
            var propValue = props[propKey];
            if (null != propValue)
              switch (propKey) {
                case "src":
                  hasSrc = true;
                  break;
                case "srcSet":
                  hasSrcSet = true;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(formatProdErrorMessage(137, tag));
                default:
                  setProp(domElement, tag, propKey, propValue, props, null);
              }
          }
        hasSrcSet && setProp(domElement, tag, "srcSet", props.srcSet, props, null);
        hasSrc && setProp(domElement, tag, "src", props.src, props, null);
        return;
      case "input":
        listenToNonDelegatedEvent("invalid", domElement);
        var defaultValue = propKey = propValue = hasSrcSet = null, checked = null, defaultChecked = null;
        for (hasSrc in props)
          if (props.hasOwnProperty(hasSrc)) {
            var propValue$204 = props[hasSrc];
            if (null != propValue$204)
              switch (hasSrc) {
                case "name":
                  hasSrcSet = propValue$204;
                  break;
                case "type":
                  propValue = propValue$204;
                  break;
                case "checked":
                  checked = propValue$204;
                  break;
                case "defaultChecked":
                  defaultChecked = propValue$204;
                  break;
                case "value":
                  propKey = propValue$204;
                  break;
                case "defaultValue":
                  defaultValue = propValue$204;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (null != propValue$204)
                    throw Error(formatProdErrorMessage(137, tag));
                  break;
                default:
                  setProp(domElement, tag, hasSrc, propValue$204, props, null);
              }
          }
        initInput(domElement, propKey, defaultValue, checked, defaultChecked, propValue, hasSrcSet, false);
        return;
      case "select":
        listenToNonDelegatedEvent("invalid", domElement);
        hasSrc = propValue = propKey = null;
        for (hasSrcSet in props)
          if (props.hasOwnProperty(hasSrcSet) && (defaultValue = props[hasSrcSet], null != defaultValue))
            switch (hasSrcSet) {
              case "value":
                propKey = defaultValue;
                break;
              case "defaultValue":
                propValue = defaultValue;
                break;
              case "multiple":
                hasSrc = defaultValue;
              default:
                setProp(domElement, tag, hasSrcSet, defaultValue, props, null);
            }
        tag = propKey;
        props = propValue;
        domElement.multiple = !!hasSrc;
        null != tag ? updateOptions(domElement, !!hasSrc, tag, false) : null != props && updateOptions(domElement, !!hasSrc, props, true);
        return;
      case "textarea":
        listenToNonDelegatedEvent("invalid", domElement);
        propKey = hasSrcSet = hasSrc = null;
        for (propValue in props)
          if (props.hasOwnProperty(propValue) && (defaultValue = props[propValue], null != defaultValue))
            switch (propValue) {
              case "value":
                hasSrc = defaultValue;
                break;
              case "defaultValue":
                hasSrcSet = defaultValue;
                break;
              case "children":
                propKey = defaultValue;
                break;
              case "dangerouslySetInnerHTML":
                if (null != defaultValue)
                  throw Error(formatProdErrorMessage(91));
                break;
              default:
                setProp(domElement, tag, propValue, defaultValue, props, null);
            }
        initTextarea(domElement, hasSrc, hasSrcSet, propKey);
        return;
      case "option":
        for (checked in props)
          if (props.hasOwnProperty(checked) && (hasSrc = props[checked], null != hasSrc))
            switch (checked) {
              case "selected":
                domElement.selected = hasSrc && "function" !== typeof hasSrc && "symbol" !== typeof hasSrc;
                break;
              default:
                setProp(domElement, tag, checked, hasSrc, props, null);
            }
        return;
      case "dialog":
        listenToNonDelegatedEvent("beforetoggle", domElement);
        listenToNonDelegatedEvent("toggle", domElement);
        listenToNonDelegatedEvent("cancel", domElement);
        listenToNonDelegatedEvent("close", domElement);
        break;
      case "iframe":
      case "object":
        listenToNonDelegatedEvent("load", domElement);
        break;
      case "video":
      case "audio":
        for (hasSrc = 0; hasSrc < mediaEventTypes.length; hasSrc++)
          listenToNonDelegatedEvent(mediaEventTypes[hasSrc], domElement);
        break;
      case "image":
        listenToNonDelegatedEvent("error", domElement);
        listenToNonDelegatedEvent("load", domElement);
        break;
      case "details":
        listenToNonDelegatedEvent("toggle", domElement);
        break;
      case "embed":
      case "source":
      case "link":
        listenToNonDelegatedEvent("error", domElement), listenToNonDelegatedEvent("load", domElement);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (defaultChecked in props)
          if (props.hasOwnProperty(defaultChecked) && (hasSrc = props[defaultChecked], null != hasSrc))
            switch (defaultChecked) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(formatProdErrorMessage(137, tag));
              default:
                setProp(domElement, tag, defaultChecked, hasSrc, props, null);
            }
        return;
      default:
        if (isCustomElement(tag)) {
          for (propValue$204 in props)
            props.hasOwnProperty(propValue$204) && (hasSrc = props[propValue$204], void 0 !== hasSrc && setPropOnCustomElement(domElement, tag, propValue$204, hasSrc, props, void 0));
          return;
        }
    }
    for (defaultValue in props)
      props.hasOwnProperty(defaultValue) && (hasSrc = props[defaultValue], null != hasSrc && setProp(domElement, tag, defaultValue, hasSrc, props, null));
  }
  var emptyProps = {};
  function updateProperties(domElement, tag, lastProps, nextProps) {
    switch (tag) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var name = null, type = null, value = null, defaultValue = null, lastDefaultValue = null, checked = null, defaultChecked = null;
        for (propKey in lastProps) {
          var lastProp = lastProps[propKey];
          if (lastProps.hasOwnProperty(propKey) && null != lastProp)
            switch (propKey) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                lastDefaultValue = lastProp;
              default:
                nextProps.hasOwnProperty(propKey) || setProp(domElement, tag, propKey, null, nextProps, lastProp);
            }
        }
        for (var propKey$221 in nextProps) {
          var propKey = nextProps[propKey$221];
          lastProp = lastProps[propKey$221];
          if (nextProps.hasOwnProperty(propKey$221) && (null != propKey || null != lastProp))
            switch (propKey$221) {
              case "type":
                propKey !== lastProp && (viewTransitionMutationContext = true);
                type = propKey;
                break;
              case "name":
                propKey !== lastProp && (viewTransitionMutationContext = true);
                name = propKey;
                break;
              case "checked":
                propKey !== lastProp && (viewTransitionMutationContext = true);
                checked = propKey;
                break;
              case "defaultChecked":
                propKey !== lastProp && (viewTransitionMutationContext = true);
                defaultChecked = propKey;
                break;
              case "value":
                propKey !== lastProp && (viewTransitionMutationContext = true);
                value = propKey;
                break;
              case "defaultValue":
                propKey !== lastProp && (viewTransitionMutationContext = true);
                defaultValue = propKey;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (null != propKey)
                  throw Error(formatProdErrorMessage(137, tag));
                break;
              default:
                propKey !== lastProp && setProp(domElement, tag, propKey$221, propKey, nextProps, lastProp);
            }
        }
        updateInput(domElement, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name);
        return;
      case "select":
        propKey = value = defaultValue = propKey$221 = null;
        for (type in lastProps)
          if (lastDefaultValue = lastProps[type], lastProps.hasOwnProperty(type) && null != lastDefaultValue)
            switch (type) {
              case "value":
                break;
              case "multiple":
                propKey = lastDefaultValue;
              default:
                nextProps.hasOwnProperty(type) || setProp(domElement, tag, type, null, nextProps, lastDefaultValue);
            }
        for (name in nextProps)
          if (type = nextProps[name], lastDefaultValue = lastProps[name], nextProps.hasOwnProperty(name) && (null != type || null != lastDefaultValue))
            switch (name) {
              case "value":
                type !== lastDefaultValue && (viewTransitionMutationContext = true);
                propKey$221 = type;
                break;
              case "defaultValue":
                type !== lastDefaultValue && (viewTransitionMutationContext = true);
                defaultValue = type;
                break;
              case "multiple":
                type !== lastDefaultValue && (viewTransitionMutationContext = true), value = type;
              default:
                type !== lastDefaultValue && setProp(domElement, tag, name, type, nextProps, lastDefaultValue);
            }
        tag = defaultValue;
        lastProps = value;
        nextProps = propKey;
        null != propKey$221 ? updateOptions(domElement, !!lastProps, propKey$221, false) : !!nextProps !== !!lastProps && (null != tag ? updateOptions(domElement, !!lastProps, tag, true) : updateOptions(domElement, !!lastProps, lastProps ? [] : "", false));
        return;
      case "textarea":
        propKey = propKey$221 = null;
        for (defaultValue in lastProps)
          if (name = lastProps[defaultValue], lastProps.hasOwnProperty(defaultValue) && null != name && !nextProps.hasOwnProperty(defaultValue))
            switch (defaultValue) {
              case "value":
                break;
              case "children":
                break;
              default:
                setProp(domElement, tag, defaultValue, null, nextProps, name);
            }
        for (value in nextProps)
          if (name = nextProps[value], type = lastProps[value], nextProps.hasOwnProperty(value) && (null != name || null != type))
            switch (value) {
              case "value":
                name !== type && (viewTransitionMutationContext = true);
                propKey$221 = name;
                break;
              case "defaultValue":
                name !== type && (viewTransitionMutationContext = true);
                propKey = name;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (null != name)
                  throw Error(formatProdErrorMessage(91));
                break;
              default:
                name !== type && setProp(domElement, tag, value, name, nextProps, type);
            }
        updateTextarea(domElement, propKey$221, propKey);
        return;
      case "option":
        for (var propKey$237 in lastProps)
          if (propKey$221 = lastProps[propKey$237], lastProps.hasOwnProperty(propKey$237) && null != propKey$221 && !nextProps.hasOwnProperty(propKey$237))
            switch (propKey$237) {
              case "selected":
                domElement.selected = false;
                break;
              default:
                setProp(domElement, tag, propKey$237, null, nextProps, propKey$221);
            }
        for (lastDefaultValue in nextProps)
          if (propKey$221 = nextProps[lastDefaultValue], propKey = lastProps[lastDefaultValue], nextProps.hasOwnProperty(lastDefaultValue) && propKey$221 !== propKey && (null != propKey$221 || null != propKey))
            switch (lastDefaultValue) {
              case "selected":
                propKey$221 !== propKey && (viewTransitionMutationContext = true);
                domElement.selected = propKey$221 && "function" !== typeof propKey$221 && "symbol" !== typeof propKey$221;
                break;
              default:
                setProp(domElement, tag, lastDefaultValue, propKey$221, nextProps, propKey);
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var propKey$242 in lastProps)
          propKey$221 = lastProps[propKey$242], lastProps.hasOwnProperty(propKey$242) && null != propKey$221 && !nextProps.hasOwnProperty(propKey$242) && setProp(domElement, tag, propKey$242, null, nextProps, propKey$221);
        for (checked in nextProps)
          if (propKey$221 = nextProps[checked], propKey = lastProps[checked], nextProps.hasOwnProperty(checked) && propKey$221 !== propKey && (null != propKey$221 || null != propKey))
            switch (checked) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (null != propKey$221)
                  throw Error(formatProdErrorMessage(137, tag));
                break;
              default:
                setProp(domElement, tag, checked, propKey$221, nextProps, propKey);
            }
        return;
      default:
        if (isCustomElement(tag)) {
          for (var propKey$247 in lastProps)
            propKey$221 = lastProps[propKey$247], lastProps.hasOwnProperty(propKey$247) && void 0 !== propKey$221 && !nextProps.hasOwnProperty(propKey$247) && setPropOnCustomElement(domElement, tag, propKey$247, void 0, nextProps, propKey$221);
          for (defaultChecked in nextProps)
            propKey$221 = nextProps[defaultChecked], propKey = lastProps[defaultChecked], !nextProps.hasOwnProperty(defaultChecked) || propKey$221 === propKey || void 0 === propKey$221 && void 0 === propKey || setPropOnCustomElement(domElement, tag, defaultChecked, propKey$221, nextProps, propKey);
          return;
        }
    }
    for (var propKey$252 in lastProps)
      propKey$221 = lastProps[propKey$252], lastProps.hasOwnProperty(propKey$252) && null != propKey$221 && !nextProps.hasOwnProperty(propKey$252) && setProp(domElement, tag, propKey$252, null, nextProps, propKey$221);
    for (lastProp in nextProps)
      propKey$221 = nextProps[lastProp], propKey = lastProps[lastProp], !nextProps.hasOwnProperty(lastProp) || propKey$221 === propKey || null == propKey$221 && null == propKey || setProp(domElement, tag, lastProp, propKey$221, nextProps, propKey);
  }
  function isLikelyStaticResource(initiatorType) {
    switch (initiatorType) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return true;
      default:
        return false;
    }
  }
  function estimateBandwidth() {
    if ("function" === typeof performance.getEntriesByType) {
      for (var count = 0, bits = 0, resourceEntries = performance.getEntriesByType("resource"), i = 0; i < resourceEntries.length; i++) {
        var entry = resourceEntries[i], transferSize = entry.transferSize, initiatorType = entry.initiatorType, duration = entry.duration;
        if (transferSize && duration && isLikelyStaticResource(initiatorType)) {
          initiatorType = 0;
          duration = entry.responseEnd;
          for (i += 1; i < resourceEntries.length; i++) {
            var overlapEntry = resourceEntries[i], overlapStartTime = overlapEntry.startTime;
            if (overlapStartTime > duration)
              break;
            var overlapTransferSize = overlapEntry.transferSize, overlapInitiatorType = overlapEntry.initiatorType;
            overlapTransferSize && isLikelyStaticResource(overlapInitiatorType) && (overlapEntry = overlapEntry.responseEnd, initiatorType += overlapTransferSize * (overlapEntry < duration ? 1 : (duration - overlapStartTime) / (overlapEntry - overlapStartTime)));
          }
          --i;
          bits += 8 * (transferSize + initiatorType) / (entry.duration / 1e3);
          count++;
          if (10 < count)
            break;
        }
      }
      if (0 < count)
        return bits / count / 1e6;
    }
    return navigator.connection && (count = navigator.connection.downlink, "number" === typeof count) ? count : 5;
  }
  var eventsEnabled = null, selectionInformation = null;
  function getOwnerDocumentFromRootContainer(rootContainerElement) {
    return 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
  }
  function getOwnHostContext(namespaceURI) {
    switch (namespaceURI) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function getChildHostContextProd(parentNamespace, type) {
    if (0 === parentNamespace)
      switch (type) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return 1 === parentNamespace && "foreignObject" === type ? 0 : parentNamespace;
  }
  function createHoistableInstance(type, props, rootContainerInstance, internalInstanceHandle) {
    rootContainerInstance = getOwnerDocumentFromRootContainer(rootContainerInstance).createElement(type);
    rootContainerInstance[internalInstanceKey] = internalInstanceHandle;
    rootContainerInstance[internalPropsKey] = props;
    setInitialProperties(rootContainerInstance, type, props);
    markNodeAsHoistable(rootContainerInstance);
    return rootContainerInstance;
  }
  function shouldSetTextContent(type, props) {
    return "textarea" === type || "noscript" === type || "string" === typeof props.children || "number" === typeof props.children || "bigint" === typeof props.children || "object" === typeof props.dangerouslySetInnerHTML && null !== props.dangerouslySetInnerHTML && null != props.dangerouslySetInnerHTML.__html;
  }
  var currentPopstateTransitionEvent = null;
  function shouldAttemptEagerTransition() {
    var event = window.event;
    if (event && "popstate" === event.type) {
      if (event === currentPopstateTransitionEvent)
        return false;
      currentPopstateTransitionEvent = event;
      return true;
    }
    currentPopstateTransitionEvent = null;
    return false;
  }
  var scheduleTimeout = "function" === typeof setTimeout ? setTimeout : void 0, cancelTimeout = "function" === typeof clearTimeout ? clearTimeout : void 0, localPromise = "function" === typeof Promise ? Promise : void 0, localRequestAnimationFrame = "function" === typeof requestAnimationFrame ? requestAnimationFrame : scheduleTimeout, scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof localPromise ? function(callback) {
    return localPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
  } : scheduleTimeout;
  function handleErrorInNextTick(error) {
    setTimeout(function() {
      throw error;
    });
  }
  function isSingletonScope(type) {
    return "head" === type;
  }
  function clearHydrationBoundary(parentInstance, hydrationInstance) {
    var node = hydrationInstance, depth = 0;
    do {
      var nextNode = node.nextSibling;
      parentInstance.removeChild(node);
      if (nextNode && 8 === nextNode.nodeType)
        if (node = nextNode.data, "/$" === node || "/&" === node) {
          if (0 === depth) {
            parentInstance.removeChild(nextNode);
            retryIfBlockedOn(hydrationInstance);
            return;
          }
          depth--;
        } else if ("$" === node || "$?" === node || "$~" === node || "$!" === node || "&" === node)
          depth++;
        else if ("html" === node)
          clearSingletonPreambleContribution(parentInstance.ownerDocument.documentElement);
        else if ("head" === node) {
          node = parentInstance.ownerDocument.head;
          clearSingletonPreambleContribution(node);
          for (var node$jscomp$0 = node.firstChild; node$jscomp$0; ) {
            var nextNode$jscomp$0 = node$jscomp$0.nextSibling, nodeName = node$jscomp$0.nodeName;
            node$jscomp$0[internalHoistableMarker] || "SCRIPT" === nodeName || "STYLE" === nodeName || "LINK" === nodeName && "stylesheet" === node$jscomp$0.rel.toLowerCase() || node.removeChild(node$jscomp$0);
            node$jscomp$0 = nextNode$jscomp$0;
          }
        } else
          "body" === node && clearSingletonPreambleContribution(parentInstance.ownerDocument.body);
      node = nextNode;
    } while (node);
    retryIfBlockedOn(hydrationInstance);
  }
  function hideOrUnhideDehydratedBoundary(suspenseInstance, isHidden) {
    var node = suspenseInstance;
    suspenseInstance = 0;
    do {
      var nextNode = node.nextSibling;
      1 === node.nodeType ? isHidden ? (node._stashedDisplay = node.style.display, node.style.display = "none") : (node.style.display = node._stashedDisplay || "", "" === node.getAttribute("style") && node.removeAttribute("style")) : 3 === node.nodeType && (isHidden ? (node._stashedText = node.nodeValue, node.nodeValue = "") : node.nodeValue = node._stashedText || "");
      if (nextNode && 8 === nextNode.nodeType)
        if (node = nextNode.data, "/$" === node)
          if (0 === suspenseInstance)
            break;
          else
            suspenseInstance--;
        else
          "$" !== node && "$?" !== node && "$~" !== node && "$!" !== node || suspenseInstance++;
      node = nextNode;
    } while (node);
  }
  function applyViewTransitionName(instance, name, className) {
    name = CSS.escape(name) !== name ? "r-" + btoa(name).replace(/=/g, "") : name;
    instance.style.viewTransitionName = name;
    null != className && (instance.style.viewTransitionClass = className);
    className = getComputedStyle(instance);
    if ("inline" === className.display) {
      name = instance.getClientRects();
      if (1 === name.length)
        var JSCompiler_inline_result = 1;
      else
        for (var i = JSCompiler_inline_result = 0; i < name.length; i++) {
          var rect = name[i];
          0 < rect.width && 0 < rect.height && JSCompiler_inline_result++;
        }
      1 === JSCompiler_inline_result && (instance = instance.style, instance.display = 1 === name.length ? "inline-block" : "block", instance.marginTop = "-" + className.paddingTop, instance.marginBottom = "-" + className.paddingBottom);
    }
  }
  function restoreViewTransitionName(instance, props) {
    instance = instance.style;
    props = props.style;
    var viewTransitionName = null != props ? props.hasOwnProperty("viewTransitionName") ? props.viewTransitionName : props.hasOwnProperty("view-transition-name") ? props["view-transition-name"] : null : null;
    instance.viewTransitionName = null == viewTransitionName || "boolean" === typeof viewTransitionName ? "" : ("" + viewTransitionName).trim();
    viewTransitionName = null != props ? props.hasOwnProperty("viewTransitionClass") ? props.viewTransitionClass : props.hasOwnProperty("view-transition-class") ? props["view-transition-class"] : null : null;
    instance.viewTransitionClass = null == viewTransitionName || "boolean" === typeof viewTransitionName ? "" : ("" + viewTransitionName).trim();
    "inline-block" === instance.display && (null == props ? instance.display = instance.margin = "" : (viewTransitionName = props.display, instance.display = null == viewTransitionName || "boolean" === typeof viewTransitionName ? "" : viewTransitionName, viewTransitionName = props.margin, null != viewTransitionName ? instance.margin = viewTransitionName : (viewTransitionName = props.hasOwnProperty("marginTop") ? props.marginTop : props["margin-top"], instance.marginTop = null == viewTransitionName || "boolean" === typeof viewTransitionName ? "" : viewTransitionName, props = props.hasOwnProperty("marginBottom") ? props.marginBottom : props["margin-bottom"], instance.marginBottom = null == props || "boolean" === typeof props ? "" : props)));
  }
  function createMeasurement(rect, computedStyle, element) {
    element = element.ownerDocument.defaultView;
    return {
      rect,
      abs: "absolute" === computedStyle.position || "fixed" === computedStyle.position,
      clip: "none" !== computedStyle.clipPath || "visible" !== computedStyle.overflow || "none" !== computedStyle.filter || "none" !== computedStyle.mask || "none" !== computedStyle.mask || "0px" !== computedStyle.borderRadius,
      view: 0 <= rect.bottom && 0 <= rect.right && rect.top <= element.innerHeight && rect.left <= element.innerWidth
    };
  }
  function measureInstance(instance) {
    var rect = instance.getBoundingClientRect(), computedStyle = getComputedStyle(instance);
    return createMeasurement(rect, computedStyle, instance);
  }
  function forceLayout(ownerDocument) {
    return ownerDocument.documentElement.clientHeight;
  }
  function waitForImageToLoad(resolve) {
    this.addEventListener("load", resolve);
    this.addEventListener("error", resolve);
  }
  function startViewTransition(suspendedState, rootContainer, transitionTypes, mutationCallback, layoutCallback, afterMutationCallback, spawnedWorkCallback, passiveCallback, errorCallback) {
    var ownerDocument = 9 === rootContainer.nodeType ? rootContainer : rootContainer.ownerDocument;
    try {
      var transition = ownerDocument.startViewTransition({
        update: function() {
          var ownerWindow = ownerDocument.defaultView, pendingNavigation = ownerWindow.navigation && ownerWindow.navigation.transition, previousFontLoadingStatus = ownerDocument.fonts.status;
          mutationCallback();
          var blockingPromises = [];
          "loaded" === previousFontLoadingStatus && (forceLayout(ownerDocument), "loading" === ownerDocument.fonts.status && blockingPromises.push(ownerDocument.fonts.ready));
          previousFontLoadingStatus = blockingPromises.length;
          if (null !== suspendedState)
            for (var suspenseyImages = suspendedState.suspenseyImages, imgBytes = 0, i = 0; i < suspenseyImages.length; i++) {
              var suspenseyImage = suspenseyImages[i];
              if (!suspenseyImage.complete) {
                var rect = suspenseyImage.getBoundingClientRect();
                if (0 < rect.bottom && 0 < rect.right && rect.top < ownerWindow.innerHeight && rect.left < ownerWindow.innerWidth) {
                  imgBytes += estimateImageBytes(suspenseyImage);
                  if (imgBytes > estimatedBytesWithinLimit) {
                    blockingPromises.length = previousFontLoadingStatus;
                    break;
                  }
                  suspenseyImage = new Promise(waitForImageToLoad.bind(suspenseyImage));
                  blockingPromises.push(suspenseyImage);
                }
              }
            }
          if (0 < blockingPromises.length)
            return ownerWindow = Promise.race([
              Promise.all(blockingPromises),
              new Promise(function(resolve) {
                return setTimeout(resolve, 500);
              })
            ]).then(layoutCallback, layoutCallback), (pendingNavigation ? Promise.allSettled([pendingNavigation.finished, ownerWindow]) : ownerWindow).then(afterMutationCallback, afterMutationCallback);
          layoutCallback();
          if (pendingNavigation)
            return pendingNavigation.finished.then(afterMutationCallback, afterMutationCallback);
          afterMutationCallback();
        },
        types: transitionTypes
      });
      ownerDocument.__reactViewTransition = transition;
      var viewTransitionAnimations = [];
      transition.ready.then(function() {
        for (var animations = ownerDocument.documentElement.getAnimations({
          subtree: true
        }), i = 0; i < animations.length; i++) {
          var animation = animations[i], effect = animation.effect, pseudoElement = effect.pseudoElement;
          if (null != pseudoElement && pseudoElement.startsWith("::view-transition")) {
            viewTransitionAnimations.push(animation);
            animation = effect.getKeyframes();
            for (var height = pseudoElement = void 0, unchangedDimensions = true, j = 0; j < animation.length; j++) {
              var keyframe = animation[j], w = keyframe.width;
              if (void 0 === pseudoElement)
                pseudoElement = w;
              else if (pseudoElement !== w) {
                unchangedDimensions = false;
                break;
              }
              w = keyframe.height;
              if (void 0 === height)
                height = w;
              else if (height !== w) {
                unchangedDimensions = false;
                break;
              }
              delete keyframe.width;
              delete keyframe.height;
              "none" === keyframe.transform && delete keyframe.transform;
            }
            unchangedDimensions && void 0 !== pseudoElement && void 0 !== height && (effect.setKeyframes(animation), unchangedDimensions = getComputedStyle(effect.target, effect.pseudoElement), unchangedDimensions.width !== pseudoElement || unchangedDimensions.height !== height) && (unchangedDimensions = animation[0], unchangedDimensions.width = pseudoElement, unchangedDimensions.height = height, unchangedDimensions = animation[animation.length - 1], unchangedDimensions.width = pseudoElement, unchangedDimensions.height = height, effect.setKeyframes(animation));
          }
        }
        spawnedWorkCallback();
      }, function(error) {
        ownerDocument.__reactViewTransition === transition && (ownerDocument.__reactViewTransition = null);
        try {
          if ("object" === typeof error && null !== error)
            switch (error.name) {
              case "InvalidStateError":
                if ("View transition was skipped because document visibility state is hidden." === error.message || "Skipping view transition because document visibility state has become hidden." === error.message || "Skipping view transition because viewport size changed." === error.message || "Transition was aborted because of invalid state" === error.message)
                  error = null;
            }
          null !== error && errorCallback(error);
        } finally {
          mutationCallback(), layoutCallback(), spawnedWorkCallback();
        }
      });
      transition.finished.finally(function() {
        for (var i = 0; i < viewTransitionAnimations.length; i++)
          viewTransitionAnimations[i].cancel();
        ownerDocument.__reactViewTransition === transition && (ownerDocument.__reactViewTransition = null);
        passiveCallback();
      });
      return transition;
    } catch (x) {
      return mutationCallback(), layoutCallback(), spawnedWorkCallback(), null;
    }
  }
  function ViewTransitionPseudoElement(pseudo, name) {
    this._scope = document.documentElement;
    this._selector = "::view-transition-" + pseudo + "(" + name + ")";
  }
  ViewTransitionPseudoElement.prototype.animate = function(keyframes, options2) {
    options2 = "number" === typeof options2 ? { duration: options2 } : assign({}, options2);
    options2.pseudoElement = this._selector;
    return this._scope.animate(keyframes, options2);
  };
  ViewTransitionPseudoElement.prototype.getAnimations = function() {
    for (var scope = this._scope, selector = this._selector, animations = scope.getAnimations({ subtree: true }), result = [], i = 0; i < animations.length; i++) {
      var effect = animations[i].effect;
      null !== effect && effect.target === scope && effect.pseudoElement === selector && result.push(animations[i]);
    }
    return result;
  };
  ViewTransitionPseudoElement.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function createViewTransitionInstance(name) {
    return {
      name,
      group: new ViewTransitionPseudoElement("group", name),
      imagePair: new ViewTransitionPseudoElement("image-pair", name),
      old: new ViewTransitionPseudoElement("old", name),
      new: new ViewTransitionPseudoElement("new", name)
    };
  }
  function FragmentInstance(fragmentFiber) {
    this._fragmentFiber = fragmentFiber;
    this._observers = this._eventListeners = null;
  }
  FragmentInstance.prototype.addEventListener = function(type, listener, optionsOrUseCapture) {
    var signal = null, cleanup = null;
    if (null != optionsOrUseCapture && "boolean" !== typeof optionsOrUseCapture && (signal = optionsOrUseCapture.signal || null, null !== signal && signal.aborted))
      return;
    null === this._eventListeners && (this._eventListeners = []);
    var listeners = this._eventListeners;
    if (-1 === indexOfEventListener(listeners, type, listener, optionsOrUseCapture)) {
      var fragmentInstance = this, attachedListener = listener;
      null != optionsOrUseCapture && "boolean" !== typeof optionsOrUseCapture && true === optionsOrUseCapture.once && (attachedListener = function(event) {
        fragmentInstance.removeEventListener(type, listener, optionsOrUseCapture);
        "function" === typeof listener ? listener.call(this, event) : listener.handleEvent(event);
      });
      null !== signal && (cleanup = fragmentInstance.removeEventListener.bind(fragmentInstance, type, listener, optionsOrUseCapture), signal.addEventListener("abort", cleanup, { once: true }), cleanup = signal.removeEventListener.bind(signal, "abort", cleanup));
      signal = getAttachOptions(optionsOrUseCapture);
      listeners.push({
        type,
        listener,
        optionsOrUseCapture,
        attachedListener,
        cleanup
      });
      traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, false, addEventListenerToChild, type, attachedListener, signal);
    }
    this._eventListeners = listeners;
  };
  function addEventListenerToChild(child, type, listener, optionsOrUseCapture) {
    getInstanceFromHostFiber(child).addEventListener(type, listener, optionsOrUseCapture);
    return false;
  }
  FragmentInstance.prototype.removeEventListener = function(type, listener, optionsOrUseCapture) {
    var listeners = this._eventListeners;
    if (null !== listeners && (listener = indexOfEventListener(listeners, type, listener, optionsOrUseCapture), -1 !== listener)) {
      var _listeners$index = listeners[listener];
      optionsOrUseCapture = _listeners$index.attachedListener;
      var cleanup = _listeners$index.cleanup;
      _listeners$index = getAttachOptions(_listeners$index.optionsOrUseCapture);
      traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, false, removeEventListenerFromChild, type, optionsOrUseCapture, _listeners$index);
      listeners.splice(listener, 1);
      null !== cleanup && cleanup();
    }
  };
  function removeEventListenerFromChild(child, type, listener, optionsOrUseCapture) {
    getInstanceFromHostFiber(child).removeEventListener(type, listener, optionsOrUseCapture);
    return false;
  }
  function getAttachOptions(opts) {
    return null != opts && "boolean" !== typeof opts && (true === opts.once || opts.signal instanceof AbortSignal) ? { capture: opts.capture, passive: opts.passive } : opts;
  }
  function normalizeListenerOptions(opts) {
    return null == opts ? "c=0" : "boolean" === typeof opts ? "c=" + (opts ? "1" : "0") : "c=" + (opts.capture ? "1" : "0");
  }
  function indexOfEventListener(eventListeners, type, listener, optionsOrUseCapture) {
    if (0 === eventListeners.length)
      return -1;
    optionsOrUseCapture = normalizeListenerOptions(optionsOrUseCapture);
    for (var i = 0; i < eventListeners.length; i++) {
      var item = eventListeners[i];
      if (item.type === type && item.listener === listener && normalizeListenerOptions(item.optionsOrUseCapture) === optionsOrUseCapture)
        return i;
    }
    return -1;
  }
  FragmentInstance.prototype.dispatchEvent = function(event) {
    var parentHostFiber = getFragmentParentInstanceOrContainerFiber(this._fragmentFiber);
    if (null === parentHostFiber)
      return true;
    parentHostFiber = getInstanceFromHostFiber(parentHostFiber);
    var eventListeners = this._eventListeners;
    if (null !== eventListeners && 0 < eventListeners.length || !event.bubbles) {
      var temp = 9 === parentHostFiber.nodeType ? parentHostFiber.createComment("") : document.createTextNode("");
      if (eventListeners)
        for (var i = 0; i < eventListeners.length; i++) {
          var _eventListeners$i = eventListeners[i];
          temp.addEventListener(_eventListeners$i.type, _eventListeners$i.attachedListener, getAttachOptions(_eventListeners$i.optionsOrUseCapture));
        }
      parentHostFiber.appendChild(temp);
      event = temp.dispatchEvent(event);
      if (eventListeners)
        for (i = 0; i < eventListeners.length; i++)
          _eventListeners$i = eventListeners[i], temp.removeEventListener(_eventListeners$i.type, _eventListeners$i.attachedListener, getAttachOptions(_eventListeners$i.optionsOrUseCapture));
      parentHostFiber.removeChild(temp);
      return event;
    }
    return parentHostFiber.dispatchEvent(event);
  };
  FragmentInstance.prototype.focus = function(focusOptions) {
    traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, true, setFocusOnFiberIfFocusable, focusOptions, void 0, void 0);
  };
  function setFocusOnFiberIfFocusable(fiber, focusOptions) {
    if (6 === fiber.tag)
      return false;
    fiber = getInstanceFromHostFiber(fiber);
    return setFocusIfFocusable(fiber, focusOptions);
  }
  FragmentInstance.prototype.focusLast = function(focusOptions) {
    var children = [];
    traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, true, collectChildren, children, void 0, void 0);
    for (var i = children.length - 1; 0 <= i && !setFocusOnFiberIfFocusable(children[i], focusOptions); i--)
      ;
  };
  function collectChildren(child, collection) {
    collection.push(child);
    return false;
  }
  FragmentInstance.prototype.blur = function() {
    var parentHostFiber = getFragmentParentInstanceOrContainerFiber(this._fragmentFiber);
    null !== parentHostFiber && (parentHostFiber = getInstanceFromHostFiber(parentHostFiber), parentHostFiber = getOwnerDocumentFromRootContainer(parentHostFiber).activeElement, null !== parentHostFiber && traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, false, blurActiveElementWithinFragment, parentHostFiber, void 0, void 0));
  };
  function blurActiveElementWithinFragment(child, activeElement2) {
    if (6 === child.tag)
      return false;
    child = getInstanceFromHostFiber(child);
    return child === activeElement2 || child.contains(activeElement2) ? (activeElement2.blur(), true) : false;
  }
  FragmentInstance.prototype.observeUsing = function(observer) {
    null === this._observers && (this._observers =  new Set());
    this._observers.add(observer);
    traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, false, observeChild, observer, void 0, void 0);
  };
  function observeChild(child, observer) {
    if (6 === child.tag)
      return false;
    child = getInstanceFromHostFiber(child);
    observer.observe(child);
    return false;
  }
  FragmentInstance.prototype.unobserveUsing = function(observer) {
    var observers = this._observers;
    if (null !== observers && observers.has(observer)) {
      observers.delete(observer);
      traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, false, unobserveChild, observer, void 0, void 0);
      for (var i = observers = 0; i < pendingIntersectionUnobserves.length; i++) {
        var pending = pendingIntersectionUnobserves[i];
        pending.fragmentInstance === this && pending.observer === observer ? observer.unobserve(pending.instance) : pendingIntersectionUnobserves[observers++] = pending;
      }
      pendingIntersectionUnobserves.length = observers;
    }
  };
  function unobserveChild(child, observer) {
    if (6 === child.tag)
      return false;
    child = getInstanceFromHostFiber(child);
    observer.unobserve(child);
    return false;
  }
  var pendingIntersectionUnobserves = [], intersectionUnobserveScheduled = false;
  function schedulePendingIntersectionUnobserve(fragmentInstance, observer, instance) {
    pendingIntersectionUnobserves.push({
      fragmentInstance,
      observer,
      instance
    });
    intersectionUnobserveScheduled || (intersectionUnobserveScheduled = true, requestPostPaintCallback(function() {
      intersectionUnobserveScheduled = false;
      var pending = pendingIntersectionUnobserves;
      pendingIntersectionUnobserves = [];
      for (var i = 0; i < pending.length; i++) {
        var item = pending[i];
        item.observer.unobserve(item.instance);
      }
    }));
  }
  FragmentInstance.prototype.getClientRects = function() {
    var rects = [];
    traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, false, collectClientRects, rects, void 0, void 0);
    return rects;
  };
  function collectClientRects(child, rects) {
    if (6 === child.tag) {
      child = child.stateNode;
      var range = child.ownerDocument.createRange();
      range.selectNodeContents(child);
      rects.push.apply(rects, range.getClientRects());
    } else
      child = getInstanceFromHostFiber(child), rects.push.apply(rects, child.getClientRects());
    return false;
  }
  FragmentInstance.prototype.getRootNode = function(getRootNodeOptions) {
    var parentHostFiber = getFragmentParentInstanceOrContainerFiber(this._fragmentFiber);
    return null === parentHostFiber ? this : getInstanceFromHostFiber(parentHostFiber).getRootNode(getRootNodeOptions);
  };
  FragmentInstance.prototype.compareDocumentPosition = function(otherNode) {
    var parentHostFiber = getFragmentParentInstanceOrContainerFiber(this._fragmentFiber);
    if (null === parentHostFiber)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    var children = [];
    traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, false, collectChildren, children, void 0, void 0);
    var parentHostInstance = getInstanceFromHostFiber(parentHostFiber);
    if (0 === children.length) {
      children = parentHostInstance;
      if (fiberIsPortaledIntoHost(this._fragmentFiber)) {
        a: {
          for (parentHostFiber = this._fragmentFiber.return; null !== parentHostFiber; ) {
            if (4 === parentHostFiber.tag) {
              parentHostFiber = parentHostFiber.stateNode.containerInfo;
              break a;
            }
            if (3 === parentHostFiber.tag || 5 === parentHostFiber.tag || 27 === parentHostFiber.tag)
              break;
            parentHostFiber = parentHostFiber.return;
          }
          parentHostFiber = null;
        }
        null != parentHostFiber && (children = parentHostFiber);
      }
      parentHostFiber = this._fragmentFiber;
      var result = parentHostInstance = children.compareDocumentPosition(otherNode);
      children === otherNode ? result = Node.DOCUMENT_POSITION_CONTAINS : parentHostInstance & Node.DOCUMENT_POSITION_CONTAINED_BY && (children = getFragmentInstanceOrTextInstanceSiblings(parentHostFiber)[1], null === children ? result = Node.DOCUMENT_POSITION_PRECEDING : (otherNode = getInstanceFromHostFiber(children).compareDocumentPosition(otherNode), result = 0 === otherNode || otherNode & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING));
      return result |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    parentHostFiber = getInstanceFromHostFiber(children[0]);
    result = getInstanceFromHostFiber(children[children.length - 1]);
    var parentHostInstanceFromDOM = fiberIsPortaledIntoHost(this._fragmentFiber) ? parentHostFiber.parentElement : parentHostInstance;
    if (null == parentHostInstanceFromDOM)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    parentHostInstance = parentHostInstanceFromDOM.compareDocumentPosition(parentHostFiber) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    parentHostInstanceFromDOM = parentHostInstanceFromDOM.compareDocumentPosition(result) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var firstResult = parentHostFiber.compareDocumentPosition(otherNode), lastResult = result.compareDocumentPosition(otherNode), otherNodeIsWithinFirstOrLastChild = firstResult & Node.DOCUMENT_POSITION_CONTAINED_BY || lastResult & Node.DOCUMENT_POSITION_CONTAINED_BY;
    lastResult = parentHostInstance && parentHostInstanceFromDOM && firstResult & Node.DOCUMENT_POSITION_FOLLOWING && lastResult & Node.DOCUMENT_POSITION_PRECEDING;
    parentHostFiber = parentHostInstance && parentHostFiber === otherNode || parentHostInstanceFromDOM && result === otherNode || otherNodeIsWithinFirstOrLastChild || lastResult ? Node.DOCUMENT_POSITION_CONTAINED_BY : !parentHostInstance && parentHostFiber === otherNode || !parentHostInstanceFromDOM && result === otherNode ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : firstResult;
    return parentHostFiber & Node.DOCUMENT_POSITION_DISCONNECTED || parentHostFiber & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || validateDocumentPositionWithFiberTree(parentHostFiber, this._fragmentFiber, children[0], children[children.length - 1], otherNode) ? parentHostFiber : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function validateDocumentPositionWithFiberTree(documentPosition, fragmentFiber, precedingBoundaryFiber, followingBoundaryFiber, otherNode) {
    var otherFiber = getClosestInstanceFromNode(otherNode);
    if (documentPosition & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (precedingBoundaryFiber = !!otherFiber)
        a: {
          for (; null !== otherFiber; ) {
            if (7 === otherFiber.tag && (otherFiber === fragmentFiber || otherFiber.alternate === fragmentFiber)) {
              precedingBoundaryFiber = true;
              break a;
            }
            otherFiber = otherFiber.return;
          }
          precedingBoundaryFiber = false;
        }
      return precedingBoundaryFiber;
    }
    if (documentPosition & Node.DOCUMENT_POSITION_CONTAINS) {
      if (null === otherFiber)
        return otherFiber = otherNode.ownerDocument, otherNode === otherFiber || otherNode === otherFiber.documentElement || otherNode === otherFiber.body;
      a: {
        otherFiber = fragmentFiber;
        for (fragmentFiber = getFragmentParentInstanceOrContainerFiber(fragmentFiber); null !== otherFiber; ) {
          if (!(5 !== otherFiber.tag && 3 !== otherFiber.tag && 27 !== otherFiber.tag || otherFiber !== fragmentFiber && otherFiber.alternate !== fragmentFiber)) {
            otherFiber = true;
            break a;
          }
          otherFiber = otherFiber.return;
        }
        otherFiber = false;
      }
      return otherFiber;
    }
    return documentPosition & Node.DOCUMENT_POSITION_PRECEDING ? ((fragmentFiber = !!otherFiber) && !(fragmentFiber = otherFiber === precedingBoundaryFiber) && (fragmentFiber = getLowestCommonAncestor(precedingBoundaryFiber, otherFiber, getParentForFragmentAncestors), null === fragmentFiber ? fragmentFiber = false : (traverseVisibleInstancesAndTextInstances(fragmentFiber, true, isFiberPrecedingCheck, otherFiber, precedingBoundaryFiber), otherFiber = searchTarget, searchTarget = null, fragmentFiber = null !== otherFiber)), fragmentFiber) : documentPosition & Node.DOCUMENT_POSITION_FOLLOWING ? ((fragmentFiber = !!otherFiber) && !(fragmentFiber = otherFiber === followingBoundaryFiber) && (fragmentFiber = getLowestCommonAncestor(followingBoundaryFiber, otherFiber, getParentForFragmentAncestors), null === fragmentFiber ? fragmentFiber = false : (traverseVisibleInstancesAndTextInstances(fragmentFiber, true, isFiberFollowingCheck, otherFiber, followingBoundaryFiber), otherFiber = searchTarget, searchBoundary = searchTarget = null, fragmentFiber = null !== otherFiber)), fragmentFiber) : false;
  }
  function scrollTextNodeIntoView(textNode, resolvedAlignToTop) {
    var range = textNode.ownerDocument.createRange();
    range.selectNodeContents(textNode);
    textNode = range.getBoundingClientRect();
    window.scrollTo(window.scrollX + textNode.left, resolvedAlignToTop ? window.scrollY + textNode.top : window.scrollY + textNode.bottom - window.innerHeight);
  }
  FragmentInstance.prototype.scrollIntoView = function(alignToTop) {
    if ("object" === typeof alignToTop)
      throw Error(formatProdErrorMessage(566));
    var children = [];
    traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, false, collectChildren, children, void 0, void 0);
    var resolvedAlignToTop = false !== alignToTop;
    if (0 === children.length) {
      var hostSiblings = getFragmentInstanceOrTextInstanceSiblings(this._fragmentFiber);
      hostSiblings = resolvedAlignToTop ? hostSiblings[1] || hostSiblings[0] || getFragmentParentInstanceOrContainerFiber(this._fragmentFiber) : hostSiblings[0] || hostSiblings[1];
      if (null === hostSiblings)
        return;
      if (6 === hostSiblings.tag) {
        alignToTop = getInstanceFromHostFiber(hostSiblings);
        scrollTextNodeIntoView(alignToTop, resolvedAlignToTop);
        return;
      }
      hostSiblings = getInstanceFromHostFiber(hostSiblings);
      if (9 !== hostSiblings.nodeType) {
        if (11 === hostSiblings.nodeType) {
          resolvedAlignToTop = "host" in hostSiblings ? hostSiblings.host : null;
          null !== resolvedAlignToTop && resolvedAlignToTop.scrollIntoView(alignToTop);
          return;
        }
        hostSiblings.scrollIntoView(alignToTop);
      }
    }
    for (hostSiblings = resolvedAlignToTop ? children.length - 1 : 0; hostSiblings !== (resolvedAlignToTop ? -1 : children.length); ) {
      var child = children[hostSiblings];
      6 === child.tag ? (child = getInstanceFromHostFiber(child), scrollTextNodeIntoView(child, resolvedAlignToTop)) : getInstanceFromHostFiber(child).scrollIntoView(alignToTop);
      hostSiblings += resolvedAlignToTop ? -1 : 1;
    }
  };
  function addFragmentHandleToFiber(child, fragmentInstance) {
    child = getInstanceFromHostFiber(child);
    addFragmentHandleToInstance(child, fragmentInstance);
    return false;
  }
  function addFragmentHandleToInstance(instance, fragmentInstance) {
    null == instance.reactFragments && (instance.reactFragments =  new Set());
    instance.reactFragments.add(fragmentInstance);
  }
  function commitNewChildToFragmentInstance(childInstance, fragmentInstance) {
    var eventListeners = fragmentInstance._eventListeners;
    if (null !== eventListeners)
      for (var i$jscomp$0 = 0; i$jscomp$0 < eventListeners.length; i$jscomp$0++) {
        var _eventListeners$i3 = eventListeners[i$jscomp$0];
        childInstance.addEventListener(_eventListeners$i3.type, _eventListeners$i3.attachedListener, getAttachOptions(_eventListeners$i3.optionsOrUseCapture));
      }
    3 !== childInstance.nodeType && (eventListeners = fragmentInstance._observers, null !== eventListeners && eventListeners.forEach(function(observer) {
      for (var writeIdx = 0, i = 0; i < pendingIntersectionUnobserves.length; i++) {
        var pending = pendingIntersectionUnobserves[i];
        if (pending.fragmentInstance !== fragmentInstance || pending.observer !== observer || pending.instance !== childInstance)
          pendingIntersectionUnobserves[writeIdx++] = pending;
      }
      pendingIntersectionUnobserves.length = writeIdx;
      observer.observe(childInstance);
    }), addFragmentHandleToInstance(childInstance, fragmentInstance));
  }
  function deleteChildFromFragmentInstance(childInstance, fragmentInstance) {
    var eventListeners = fragmentInstance._eventListeners;
    if (null !== eventListeners)
      for (var i = 0; i < eventListeners.length; i++) {
        var _eventListeners$i4 = eventListeners[i];
        childInstance.removeEventListener(_eventListeners$i4.type, _eventListeners$i4.attachedListener, getAttachOptions(_eventListeners$i4.optionsOrUseCapture));
      }
    3 !== childInstance.nodeType && (eventListeners = fragmentInstance._observers, null !== eventListeners && eventListeners.forEach(function(observer) {
      "string" === typeof observer.rootMargin ? schedulePendingIntersectionUnobserve(fragmentInstance, observer, childInstance) : observer.unobserve(childInstance);
    }), null != childInstance.reactFragments && childInstance.reactFragments.delete(fragmentInstance));
  }
  function clearContainerSparingly(container) {
    var nextNode = container.firstChild;
    nextNode && 10 === nextNode.nodeType && (nextNode = nextNode.nextSibling);
    for (; nextNode; ) {
      var node = nextNode;
      nextNode = nextNode.nextSibling;
      switch (node.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          clearContainerSparingly(node);
          detachDeletedInstance(node);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if ("stylesheet" === node.rel.toLowerCase())
            continue;
      }
      container.removeChild(node);
    }
  }
  function canHydrateInstance(instance, type, props, inRootOrSingleton) {
    for (; 1 === instance.nodeType; ) {
      var anyProps = props;
      if (instance.nodeName.toLowerCase() !== type.toLowerCase()) {
        if (!inRootOrSingleton && ("INPUT" !== instance.nodeName || "hidden" !== instance.type))
          break;
      } else if (!inRootOrSingleton)
        if ("input" === type && "hidden" === instance.type) {
          var name = null == anyProps.name ? null : "" + anyProps.name;
          if ("hidden" === anyProps.type && instance.getAttribute("name") === name)
            return instance;
        } else
          return instance;
      else if (!instance[internalHoistableMarker])
        switch (type) {
          case "meta":
            if (!instance.hasAttribute("itemprop"))
              break;
            return instance;
          case "link":
            name = instance.getAttribute("rel");
            if ("stylesheet" === name && instance.hasAttribute("data-precedence"))
              break;
            else if (name !== anyProps.rel || instance.getAttribute("href") !== (null == anyProps.href || "" === anyProps.href ? null : anyProps.href) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin) || instance.getAttribute("title") !== (null == anyProps.title ? null : anyProps.title))
              break;
            return instance;
          case "style":
            if (instance.hasAttribute("data-precedence"))
              break;
            return instance;
          case "script":
            name = instance.getAttribute("src");
            if ((name !== (null == anyProps.src ? null : anyProps.src) || instance.getAttribute("type") !== (null == anyProps.type ? null : anyProps.type) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin)) && name && instance.hasAttribute("async") && !instance.hasAttribute("itemprop"))
              break;
            return instance;
          default:
            return instance;
        }
      instance = getNextHydratable(instance.nextSibling);
      if (null === instance)
        break;
    }
    return null;
  }
  function canHydrateTextInstance(instance, text, inRootOrSingleton) {
    if ("" === text)
      return null;
    for (; 3 !== instance.nodeType; ) {
      if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton)
        return null;
      instance = getNextHydratable(instance.nextSibling);
      if (null === instance)
        return null;
    }
    return instance;
  }
  function canHydrateHydrationBoundary(instance, inRootOrSingleton) {
    for (; 8 !== instance.nodeType; ) {
      if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton)
        return null;
      instance = getNextHydratable(instance.nextSibling);
      if (null === instance)
        return null;
    }
    return instance;
  }
  function isSuspenseInstancePending(instance) {
    return "$?" === instance.data || "$~" === instance.data;
  }
  function isSuspenseInstanceFallback(instance) {
    return "$!" === instance.data || "$?" === instance.data && "loading" !== instance.ownerDocument.readyState;
  }
  function registerSuspenseInstanceRetry(instance, callback) {
    var ownerDocument = instance.ownerDocument;
    if ("$~" === instance.data)
      instance._reactRetry = callback;
    else if ("$?" !== instance.data || "loading" !== ownerDocument.readyState)
      callback();
    else {
      var listener = function() {
        callback();
        ownerDocument.removeEventListener("DOMContentLoaded", listener);
      };
      ownerDocument.addEventListener("DOMContentLoaded", listener);
      instance._reactRetry = listener;
    }
  }
  function getNextHydratable(node) {
    for (; null != node; node = node.nextSibling) {
      var nodeType = node.nodeType;
      if (1 === nodeType || 3 === nodeType)
        break;
      if (8 === nodeType) {
        nodeType = node.data;
        if ("$" === nodeType || "$!" === nodeType || "$?" === nodeType || "$~" === nodeType || "&" === nodeType || "F!" === nodeType || "F" === nodeType)
          break;
        if ("/$" === nodeType || "/&" === nodeType)
          return null;
      }
    }
    return node;
  }
  var previousHydratableOnEnteringScopedSingleton = null;
  function getNextHydratableInstanceAfterHydrationBoundary(hydrationInstance) {
    hydrationInstance = hydrationInstance.nextSibling;
    for (var depth = 0; hydrationInstance; ) {
      if (8 === hydrationInstance.nodeType) {
        var data = hydrationInstance.data;
        if ("/$" === data || "/&" === data) {
          if (0 === depth)
            return getNextHydratable(hydrationInstance.nextSibling);
          depth--;
        } else
          "$" !== data && "$!" !== data && "$?" !== data && "$~" !== data && "&" !== data || depth++;
      }
      hydrationInstance = hydrationInstance.nextSibling;
    }
    return null;
  }
  function getParentHydrationBoundary(targetInstance) {
    targetInstance = targetInstance.previousSibling;
    for (var depth = 0; targetInstance; ) {
      if (8 === targetInstance.nodeType) {
        var data = targetInstance.data;
        if ("$" === data || "$!" === data || "$?" === data || "$~" === data || "&" === data) {
          if (0 === depth)
            return targetInstance;
          depth--;
        } else
          "/$" !== data && "/&" !== data || depth++;
      }
      targetInstance = targetInstance.previousSibling;
    }
    return null;
  }
  function setFocusIfFocusable(node, focusOptions) {
    function handleFocus() {
      didFocus = true;
    }
    if (node.ownerDocument.activeElement === node)
      return true;
    var didFocus = false;
    try {
      node.ownerDocument.addEventListener("focus", handleFocus, true), (node.focus || HTMLElement.prototype.focus).call(node, focusOptions);
    } finally {
      node.ownerDocument.removeEventListener("focus", handleFocus, true);
    }
    return didFocus;
  }
  function requestPostPaintCallback(callback) {
    localRequestAnimationFrame(function() {
      localRequestAnimationFrame(function(time) {
        return callback(time);
      });
    });
  }
  function resolveSingletonInstance(type, props, rootContainerInstance) {
    props = getOwnerDocumentFromRootContainer(rootContainerInstance);
    switch (type) {
      case "html":
        type = props.documentElement;
        if (!type)
          throw Error(formatProdErrorMessage(452));
        return type;
      case "head":
        type = props.head;
        if (!type)
          throw Error(formatProdErrorMessage(453));
        return type;
      case "body":
        type = props.body;
        if (!type)
          throw Error(formatProdErrorMessage(454));
        return type;
      default:
        throw Error(formatProdErrorMessage(451));
    }
  }
  function releaseSingletonInstance(instance, type, props) {
    for (var propKey in props) {
      var propValue = props[propKey];
      props.hasOwnProperty(propKey) && null != propValue && setProp(instance, type, propKey, null, emptyProps, propValue);
    }
    null != props.dangerouslySetInnerHTML && (instance.textContent = "");
    instance.onclick === noop$1 && (instance.onclick = null);
    detachDeletedInstance(instance);
  }
  function clearSingletonPreambleContribution(instance) {
    for (var attributes = instance.attributes; attributes.length; )
      instance.removeAttributeNode(attributes[0]);
    detachDeletedInstance(instance);
  }
  var preloadPropsMap =  new Map(), preconnectsSet =  new Set();
  function getHoistableRoot(container) {
    if ("function" === typeof container.getRootNode) {
      var rootNode = container.getRootNode();
      if (9 === rootNode.nodeType || 11 === rootNode.nodeType)
        return rootNode;
    }
    return 9 === container.nodeType ? container : container.ownerDocument;
  }
  var previousDispatcher = ReactDOMSharedInternals.d;
  ReactDOMSharedInternals.d = {
    f: flushSyncWork,
    r: requestFormReset,
    D: prefetchDNS,
    C: preconnect,
    L: preload2,
    m: preloadModule,
    X: preinitScript,
    S: preinitStyle,
    M: preinitModuleScript
  };
  function flushSyncWork() {
    var previousWasRendering = previousDispatcher.f(), wasRendering = flushSyncWork$1();
    return previousWasRendering || wasRendering;
  }
  function requestFormReset(form) {
    var formInst = getInstanceFromNode(form);
    null !== formInst && 5 === formInst.tag && "form" === formInst.type ? requestFormReset$1(formInst) : previousDispatcher.r(form);
  }
  var globalDocument = "undefined" === typeof document ? null : document;
  function preconnectAs(rel, href, crossOrigin) {
    var ownerDocument = globalDocument;
    if (ownerDocument && "string" === typeof href && href) {
      var limitedEscapedHref = escapeSelectorAttributeValueInsideDoubleQuotes(href);
      limitedEscapedHref = 'link[rel="' + rel + '"][href="' + limitedEscapedHref + '"]';
      "string" === typeof crossOrigin && (limitedEscapedHref += '[crossorigin="' + crossOrigin + '"]');
      preconnectsSet.has(limitedEscapedHref) || (preconnectsSet.add(limitedEscapedHref), rel = { rel, crossOrigin, href }, null === ownerDocument.querySelector(limitedEscapedHref) && (href = ownerDocument.createElement("link"), setInitialProperties(href, "link", rel), markNodeAsHoistable(href), ownerDocument.head.appendChild(href)));
    }
  }
  function prefetchDNS(href) {
    previousDispatcher.D(href);
    preconnectAs("dns-prefetch", href, null);
  }
  function preconnect(href, crossOrigin) {
    previousDispatcher.C(href, crossOrigin);
    preconnectAs("preconnect", href, crossOrigin);
  }
  function preload2(href, as, options2) {
    previousDispatcher.L(href, as, options2);
    var ownerDocument = globalDocument;
    if (ownerDocument && href && as) {
      var preloadSelector = 'link[rel="preload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"]';
      "image" === as ? options2 && options2.imageSrcSet ? (preloadSelector += '[imagesrcset="' + escapeSelectorAttributeValueInsideDoubleQuotes(options2.imageSrcSet) + '"]', "string" === typeof options2.imageSizes && (preloadSelector += '[imagesizes="' + escapeSelectorAttributeValueInsideDoubleQuotes(options2.imageSizes) + '"]')) : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]' : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]';
      var key = preloadSelector;
      switch (as) {
        case "style":
          key = getStyleKey(href);
          break;
        case "script":
          key = getScriptKey(href);
      }
      if (!(preloadPropsMap.has(key) || (href = assign({
        rel: "preload",
        href: "image" === as && options2 && options2.imageSrcSet ? void 0 : href,
        as
      }, options2), preloadPropsMap.set(key, href), null !== ownerDocument.querySelector(preloadSelector) || "style" === as && ownerDocument.querySelector(getStylesheetSelectorFromKey(key)) || "script" === as && ownerDocument.querySelector(getScriptSelectorFromKey(key))))) {
        var instance = ownerDocument.createElement("link");
        setInitialProperties(instance, "link", href);
        "style" === as && (instance[internalLoadPendingKey] = true, instance.onload = instance.onerror = function() {
          clearPendingLoadOnNode(instance);
        });
        markNodeAsHoistable(instance);
        ownerDocument.head.appendChild(instance);
      }
    }
  }
  function preloadModule(href, options2) {
    previousDispatcher.m(href, options2);
    var ownerDocument = globalDocument;
    if (ownerDocument && href) {
      var as = options2 && "string" === typeof options2.as ? options2.as : "script", preloadSelector = 'link[rel="modulepreload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"][href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]', key = preloadSelector;
      switch (as) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          key = getScriptKey(href);
      }
      if (!preloadPropsMap.has(key) && (href = assign({ rel: "modulepreload", href }, options2), preloadPropsMap.set(key, href), null === ownerDocument.querySelector(preloadSelector))) {
        switch (as) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (ownerDocument.querySelector(getScriptSelectorFromKey(key)))
              return;
        }
        as = ownerDocument.createElement("link");
        setInitialProperties(as, "link", href);
        markNodeAsHoistable(as);
        ownerDocument.head.appendChild(as);
      }
    }
  }
  function preinitStyle(href, precedence, options2) {
    previousDispatcher.S(href, precedence, options2);
    var ownerDocument = globalDocument;
    if (ownerDocument && href) {
      var styles = getResourcesFromRoot(ownerDocument).hoistableStyles, key = getStyleKey(href);
      precedence = precedence || "default";
      var resource = styles.get(key);
      if (!resource) {
        var state = { loading: 0, preload: null };
        if (resource = ownerDocument.querySelector(getStylesheetSelectorFromKey(key)))
          state.loading = 5;
        else {
          href = assign({ rel: "stylesheet", href, "data-precedence": precedence }, options2);
          (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(href, options2);
          var link = resource = ownerDocument.createElement("link");
          markNodeAsHoistable(link);
          setInitialProperties(link, "link", href);
          link._p = new Promise(function(resolve, reject) {
            link.onload = resolve;
            link.onerror = reject;
          });
          link.addEventListener("load", function() {
            state.loading |= 1;
          });
          link.addEventListener("error", function() {
            state.loading |= 2;
          });
          state.loading |= 4;
          insertStylesheet(resource, precedence, ownerDocument);
        }
        resource = {
          type: "stylesheet",
          instance: resource,
          count: 1,
          state
        };
        styles.set(key, resource);
      }
    }
  }
  function preinitScript(src, options2) {
    previousDispatcher.X(src, options2);
    var ownerDocument = globalDocument;
    if (ownerDocument && src) {
      var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
      resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({ src, async: true }, options2), (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options2), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
        type: "script",
        instance: resource,
        count: 1,
        state: null
      }, scripts.set(key, resource));
    }
  }
  function preinitModuleScript(src, options2) {
    previousDispatcher.M(src, options2);
    var ownerDocument = globalDocument;
    if (ownerDocument && src) {
      var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
      resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({ src, async: true, type: "module" }, options2), (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options2), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
        type: "script",
        instance: resource,
        count: 1,
        state: null
      }, scripts.set(key, resource));
    }
  }
  function getResource(type, currentProps, pendingProps, currentResource) {
    var JSCompiler_inline_result = (JSCompiler_inline_result = rootInstanceStackCursor.current) ? getHoistableRoot(JSCompiler_inline_result) : null;
    if (!JSCompiler_inline_result)
      throw Error(formatProdErrorMessage(446));
    switch (type) {
      case "meta":
      case "title":
        return null;
      case "style":
        return "string" === typeof pendingProps.precedence && "string" === typeof pendingProps.href ? (pendingProps = getStyleKey(pendingProps.href), currentProps = getResourcesFromRoot(JSCompiler_inline_result).hoistableStyles, currentResource = currentProps.get(pendingProps), currentResource || (currentResource = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, currentProps.set(pendingProps, currentResource)), currentResource) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if ("stylesheet" === pendingProps.rel && "string" === typeof pendingProps.href && "string" === typeof pendingProps.precedence) {
          type = getStyleKey(pendingProps.href);
          var styles$268 = getResourcesFromRoot(JSCompiler_inline_result).hoistableStyles, resource$269 = styles$268.get(type);
          resource$269 || (JSCompiler_inline_result = JSCompiler_inline_result.ownerDocument || JSCompiler_inline_result, resource$269 = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, styles$268.set(type, resource$269), (styles$268 = JSCompiler_inline_result.querySelector(getStylesheetSelectorFromKey(type))) ? styles$268._p || (resource$269.instance = styles$268, resource$269.state.loading = 5) : (styles$268 = preloadPropsMap.get(type), styles$268 || (styles$268 = {
            rel: "preload",
            as: "style",
            href: pendingProps.href,
            crossOrigin: pendingProps.crossOrigin,
            integrity: pendingProps.integrity,
            media: pendingProps.media,
            hrefLang: pendingProps.hrefLang,
            referrerPolicy: pendingProps.referrerPolicy
          }, preloadPropsMap.set(type, styles$268)), preloadStylesheet(JSCompiler_inline_result, type, styles$268, resource$269.state)));
          if (currentProps && null === currentResource)
            throw Error(formatProdErrorMessage(528, ""));
          return resource$269;
        }
        if (currentProps && null !== currentResource)
          throw Error(formatProdErrorMessage(529, ""));
        return null;
      case "script":
        return currentProps = pendingProps.async, pendingProps = pendingProps.src, "string" === typeof pendingProps && currentProps && "function" !== typeof currentProps && "symbol" !== typeof currentProps ? (pendingProps = getScriptKey(pendingProps), currentProps = getResourcesFromRoot(JSCompiler_inline_result).hoistableScripts, currentResource = currentProps.get(pendingProps), currentResource || (currentResource = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, currentProps.set(pendingProps, currentResource)), currentResource) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(formatProdErrorMessage(444, type));
    }
  }
  function getStyleKey(href) {
    return 'href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"';
  }
  function getStylesheetSelectorFromKey(key) {
    return 'link[rel="stylesheet"][' + key + "]";
  }
  function stylesheetPropsFromRawProps(rawProps) {
    return assign({}, rawProps, {
      "data-precedence": rawProps.precedence,
      precedence: null
    });
  }
  function preloadStylesheet(ownerDocument, key, preloadProps, state) {
    if (key = ownerDocument.querySelector('link[rel="preload"][as="style"][' + key + "]")) {
      if (true !== key[internalLoadPendingKey]) {
        state.loading = 1;
        return;
      }
    } else
      key = ownerDocument.createElement("link"), key[internalLoadPendingKey] = true, key.onload = key.onerror = clearPendingLoadOnNode.bind(null, key), setInitialProperties(key, "link", preloadProps), markNodeAsHoistable(key), ownerDocument.head.appendChild(key);
    state.preload = key;
    key.addEventListener("load", function() {
      return state.loading |= 1;
    });
    key.addEventListener("error", function() {
      return state.loading |= 2;
    });
  }
  function getScriptKey(src) {
    return '[src="' + escapeSelectorAttributeValueInsideDoubleQuotes(src) + '"]';
  }
  function getScriptSelectorFromKey(key) {
    return "script[async]" + key;
  }
  function acquireResource(hoistableRoot, resource, props) {
    resource.count++;
    if (null === resource.instance)
      switch (resource.type) {
        case "style":
          var instance = hoistableRoot.querySelector('style[data-href~="' + escapeSelectorAttributeValueInsideDoubleQuotes(props.href) + '"]');
          if (instance)
            return resource.instance = instance, markNodeAsHoistable(instance), instance;
          var styleProps = assign({}, props, {
            "data-href": props.href,
            "data-precedence": props.precedence,
            href: null,
            precedence: null
          });
          instance = (hoistableRoot.ownerDocument || hoistableRoot).createElement("style");
          markNodeAsHoistable(instance);
          setInitialProperties(instance, "style", styleProps);
          insertStylesheet(instance, props.precedence, hoistableRoot);
          return resource.instance = instance;
        case "stylesheet":
          styleProps = getStyleKey(props.href);
          var instance$274 = hoistableRoot.querySelector(getStylesheetSelectorFromKey(styleProps));
          if (instance$274)
            return resource.state.loading |= 4, resource.instance = instance$274, markNodeAsHoistable(instance$274), instance$274;
          instance = stylesheetPropsFromRawProps(props);
          (styleProps = preloadPropsMap.get(styleProps)) && adoptPreloadPropsForStylesheet(instance, styleProps);
          instance$274 = (hoistableRoot.ownerDocument || hoistableRoot).createElement("link");
          markNodeAsHoistable(instance$274);
          var linkInstance = instance$274;
          linkInstance._p = new Promise(function(resolve, reject) {
            linkInstance.onload = resolve;
            linkInstance.onerror = reject;
          });
          setInitialProperties(instance$274, "link", instance);
          resource.state.loading |= 4;
          insertStylesheet(instance$274, props.precedence, hoistableRoot);
          return resource.instance = instance$274;
        case "script":
          instance$274 = getScriptKey(props.src);
          if (styleProps = hoistableRoot.querySelector(getScriptSelectorFromKey(instance$274)))
            return resource.instance = styleProps, markNodeAsHoistable(styleProps), styleProps;
          instance = props;
          if (styleProps = preloadPropsMap.get(instance$274))
            instance = assign({}, props), adoptPreloadPropsForScript(instance, styleProps);
          hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
          styleProps = hoistableRoot.createElement("script");
          markNodeAsHoistable(styleProps);
          setInitialProperties(styleProps, "link", instance);
          hoistableRoot.head.appendChild(styleProps);
          return resource.instance = styleProps;
        case "void":
          return null;
        default:
          throw Error(formatProdErrorMessage(443, resource.type));
      }
    else
      "stylesheet" === resource.type && 0 === (resource.state.loading & 4) && (instance = resource.instance, resource.state.loading |= 4, insertStylesheet(instance, props.precedence, hoistableRoot));
    return resource.instance;
  }
  function insertStylesheet(instance, precedence, root2) {
    for (var nodes = root2.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), last = nodes.length ? nodes[nodes.length - 1] : null, prior = last, i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.dataset.precedence === precedence)
        prior = node;
      else if (prior !== last)
        break;
    }
    prior ? prior.parentNode.insertBefore(instance, prior.nextSibling) : (precedence = 9 === root2.nodeType ? root2.head : root2, precedence.insertBefore(instance, precedence.firstChild));
  }
  function adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps) {
    null == stylesheetProps.crossOrigin && (stylesheetProps.crossOrigin = preloadProps.crossOrigin);
    null == stylesheetProps.referrerPolicy && (stylesheetProps.referrerPolicy = preloadProps.referrerPolicy);
    null == stylesheetProps.title && (stylesheetProps.title = preloadProps.title);
  }
  function adoptPreloadPropsForScript(scriptProps, preloadProps) {
    null == scriptProps.crossOrigin && (scriptProps.crossOrigin = preloadProps.crossOrigin);
    null == scriptProps.referrerPolicy && (scriptProps.referrerPolicy = preloadProps.referrerPolicy);
    null == scriptProps.integrity && (scriptProps.integrity = preloadProps.integrity);
  }
  var tagCaches = null;
  function getHydratableHoistableCache(type, keyAttribute, ownerDocument) {
    if (null === tagCaches) {
      var cache =  new Map();
      var caches = tagCaches =  new Map();
      caches.set(ownerDocument, cache);
    } else
      caches = tagCaches, cache = caches.get(ownerDocument), cache || (cache =  new Map(), caches.set(ownerDocument, cache));
    if (cache.has(type))
      return cache;
    cache.set(type, null);
    ownerDocument = ownerDocument.getElementsByTagName(type);
    for (caches = 0; caches < ownerDocument.length; caches++) {
      var node = ownerDocument[caches];
      if (!(node[internalHoistableMarker] || node[internalInstanceKey] || "link" === type && "stylesheet" === node.getAttribute("rel")) && "http://www.w3.org/2000/svg" !== node.namespaceURI) {
        var nodeKey = node.getAttribute(keyAttribute) || "";
        nodeKey = type + nodeKey;
        var existing = cache.get(nodeKey);
        existing ? existing.push(node) : cache.set(nodeKey, [node]);
      }
    }
    return cache;
  }
  function mountHoistable(hoistableRoot, type, instance) {
    hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
    hoistableRoot.head.insertBefore(instance, "title" === type ? hoistableRoot.querySelector("head > title") : null);
  }
  function isHostHoistableType(type, props, hostContext) {
    if (1 === hostContext || null != props.itemProp)
      return false;
    switch (type) {
      case "meta":
      case "title":
        return true;
      case "style":
        if ("string" !== typeof props.precedence || "string" !== typeof props.href || "" === props.href)
          break;
        return true;
      case "link":
        if ("string" !== typeof props.rel || "string" !== typeof props.href || "" === props.href || props.onLoad || props.onError)
          break;
        switch (props.rel) {
          case "stylesheet":
            return type = props.disabled, "string" === typeof props.precedence && null == type;
          default:
            return true;
        }
      case "script":
        if (props.async && "function" !== typeof props.async && "symbol" !== typeof props.async && !props.onLoad && !props.onError && props.src && "string" === typeof props.src)
          return true;
    }
    return false;
  }
  function maySuspendCommit(type, props) {
    return "img" === type && null != props.src && "" !== props.src && null == props.onLoad && "lazy" !== props.loading;
  }
  function preloadResource(resource) {
    return "stylesheet" === resource.type && 0 === (resource.state.loading & 3) ? false : true;
  }
  function estimateImageBytes(instance) {
    return (instance.width || 100) * (instance.height || 100) * ("number" === typeof devicePixelRatio ? devicePixelRatio : 1) * 0.25;
  }
  function suspendInstance(state, instance) {
    "function" === typeof instance.decode && (state.imgCount++, instance.complete || (state.imgBytes += estimateImageBytes(instance), state.suspenseyImages.push(instance)), state = onUnsuspendImg.bind(state), instance.decode().then(state, state));
  }
  function suspendResource(state, hoistableRoot, resource, props) {
    if ("stylesheet" === resource.type && ("string" !== typeof props.media || false !== matchMedia(props.media).matches) && 0 === (resource.state.loading & 4)) {
      if (null === resource.instance) {
        var key = getStyleKey(props.href), instance = hoistableRoot.querySelector(getStylesheetSelectorFromKey(key));
        if (instance) {
          hoistableRoot = instance._p;
          null !== hoistableRoot && "object" === typeof hoistableRoot && "function" === typeof hoistableRoot.then && (state.count++, state = onUnsuspend.bind(state), hoistableRoot.then(state, state));
          resource.state.loading |= 4;
          resource.instance = instance;
          markNodeAsHoistable(instance);
          return;
        }
        instance = hoistableRoot.ownerDocument || hoistableRoot;
        props = stylesheetPropsFromRawProps(props);
        (key = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(props, key);
        instance = instance.createElement("link");
        markNodeAsHoistable(instance);
        var linkInstance = instance;
        linkInstance._p = new Promise(function(resolve, reject) {
          linkInstance.onload = resolve;
          linkInstance.onerror = reject;
        });
        setInitialProperties(instance, "link", props);
        resource.instance = instance;
      }
      null === state.stylesheets && (state.stylesheets =  new Map());
      state.stylesheets.set(resource, hoistableRoot);
      (hoistableRoot = resource.state.preload) && 0 === (resource.state.loading & 3) && (state.count++, resource = onUnsuspend.bind(state), hoistableRoot.addEventListener("load", resource), hoistableRoot.addEventListener("error", resource));
    }
  }
  var estimatedBytesWithinLimit = 0;
  function waitForCommitToBeReady(state, timeoutOffset) {
    state.stylesheets && 0 === state.count && insertSuspendedStylesheets(state, state.stylesheets);
    return 0 < state.count || 0 < state.imgCount ? function(commit) {
      var stylesheetTimer = setTimeout(function() {
        state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets);
        if (state.unsuspend) {
          var unsuspend = state.unsuspend;
          state.unsuspend = null;
          unsuspend();
        }
      }, 6e4 + timeoutOffset);
      0 < state.imgBytes && 0 === estimatedBytesWithinLimit && (estimatedBytesWithinLimit = 62500 * estimateBandwidth());
      var imgTimer = setTimeout(function() {
        state.waitingForImages = false;
        if (0 === state.count && (state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets), state.unsuspend)) {
          var unsuspend = state.unsuspend;
          state.unsuspend = null;
          unsuspend();
        }
      }, (state.imgBytes > estimatedBytesWithinLimit ? 50 : 800) + timeoutOffset);
      state.unsuspend = commit;
      return function() {
        state.unsuspend = null;
        clearTimeout(stylesheetTimer);
        clearTimeout(imgTimer);
      };
    } : null;
  }
  function checkIfFullyUnsuspended(state) {
    if (0 === state.count && (0 === state.imgCount || !state.waitingForImages)) {
      if (state.stylesheets)
        insertSuspendedStylesheets(state, state.stylesheets);
      else if (state.unsuspend) {
        var unsuspend = state.unsuspend;
        state.unsuspend = null;
        unsuspend();
      }
    }
  }
  function onUnsuspend() {
    this.count--;
    checkIfFullyUnsuspended(this);
  }
  function onUnsuspendImg() {
    this.imgCount--;
    checkIfFullyUnsuspended(this);
  }
  var precedencesByRoot = null;
  function insertSuspendedStylesheets(state, resources) {
    state.stylesheets = null;
    null !== state.unsuspend && (state.count++, precedencesByRoot =  new Map(), resources.forEach(insertStylesheetIntoRoot, state), precedencesByRoot = null, onUnsuspend.call(state));
  }
  function insertStylesheetIntoRoot(root2, resource) {
    if (!(resource.state.loading & 4)) {
      var precedences = precedencesByRoot.get(root2);
      if (precedences)
        var last = precedences.get(null);
      else {
        precedences =  new Map();
        precedencesByRoot.set(root2, precedences);
        for (var nodes = root2.querySelectorAll("link[data-precedence],style[data-precedence]"), i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          if ("LINK" === node.nodeName || "not all" !== node.getAttribute("media"))
            precedences.set(node.dataset.precedence, node), last = node;
        }
        last && precedences.set(null, last);
      }
      nodes = resource.instance;
      node = nodes.getAttribute("data-precedence");
      i = precedences.get(node) || last;
      i === last && precedences.set(null, nodes);
      precedences.set(node, nodes);
      this.count++;
      last = onUnsuspend.bind(this);
      nodes.addEventListener("load", last);
      nodes.addEventListener("error", last);
      i ? i.parentNode.insertBefore(nodes, i.nextSibling) : (root2 = 9 === root2.nodeType ? root2.head : root2, root2.insertBefore(nodes, root2.firstChild));
      resource.state.loading |= 4;
    }
  }
  var HostTransitionContext = {
    $$typeof: REACT_CONTEXT_TYPE,
    Provider: null,
    Consumer: null,
    _currentValue: sharedNotPendingObject,
    _currentValue2: sharedNotPendingObject,
    _threadCount: 0
  };
  function FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator, formState) {
    this.tag = 1;
    this.containerInfo = containerInfo;
    this.pingCache = this.current = this.pendingChildren = null;
    this.timeoutHandle = -1;
    this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null;
    this.callbackPriority = 0;
    this.expirationTimes = createLaneMap(-1);
    this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
    this.entanglements = createLaneMap(0);
    this.hiddenUpdates = createLaneMap(null);
    this.identifierPrefix = identifierPrefix;
    this.onUncaughtError = onUncaughtError;
    this.onCaughtError = onCaughtError;
    this.onRecoverableError = onRecoverableError;
    this.pooledCache = null;
    this.pooledCacheLanes = 0;
    this.formState = formState;
    this.transitionTypes = null;
    this.incompleteTransitions =  new Map();
  }
  function createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, identifierPrefix, formState, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator) {
    containerInfo = new FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator, formState);
    tag = 1;
    true === isStrictMode && (tag |= 24);
    isStrictMode = createFiberImplClass(3, null, null, tag);
    containerInfo.current = isStrictMode;
    isStrictMode.stateNode = containerInfo;
    tag = createCache();
    tag.refCount++;
    containerInfo.pooledCache = tag;
    tag.refCount++;
    isStrictMode.memoizedState = {
      element: initialChildren,
      isDehydrated: hydrate,
      cache: tag
    };
    initializeUpdateQueue(isStrictMode);
    return containerInfo;
  }
  function getContextForSubtree(parentComponent) {
    if (!parentComponent)
      return emptyContextObject;
    parentComponent = emptyContextObject;
    return parentComponent;
  }
  function updateContainerImpl(rootFiber, lane, element, container, parentComponent, callback) {
    parentComponent = getContextForSubtree(parentComponent);
    null === container.context ? container.context = parentComponent : container.pendingContext = parentComponent;
    container = createUpdate(lane);
    container.payload = { element };
    callback = void 0 === callback ? null : callback;
    null !== callback && (container.callback = callback);
    element = enqueueUpdate(rootFiber, container, lane);
    null !== element && (scheduleUpdateOnFiber(element, rootFiber, lane), entangleTransitions(element, rootFiber, lane));
  }
  function markRetryLaneImpl(fiber, retryLane) {
    fiber = fiber.memoizedState;
    if (null !== fiber && null !== fiber.dehydrated) {
      var a2 = fiber.retryLane;
      fiber.retryLane = 0 !== a2 && a2 < retryLane ? a2 : retryLane;
    }
  }
  function markRetryLaneIfNotHydrated(fiber, retryLane) {
    markRetryLaneImpl(fiber, retryLane);
    (fiber = fiber.alternate) && markRetryLaneImpl(fiber, retryLane);
  }
  function attemptContinuousHydration(fiber) {
    if (13 === fiber.tag || 31 === fiber.tag) {
      var root2 = enqueueConcurrentRenderForLane(fiber, 67108864);
      null !== root2 && scheduleUpdateOnFiber(root2, fiber, 67108864);
      markRetryLaneIfNotHydrated(fiber, 67108864);
    }
  }
  function attemptHydrationAtCurrentPriority(fiber) {
    if (13 === fiber.tag || 31 === fiber.tag) {
      var lane = requestUpdateLane();
      lane = getBumpedLaneForHydrationByLane(lane);
      var root2 = enqueueConcurrentRenderForLane(fiber, lane);
      null !== root2 && scheduleUpdateOnFiber(root2, fiber, lane);
      markRetryLaneIfNotHydrated(fiber, lane);
    }
  }
  var _enabled = true;
  function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
    var prevTransition = ReactSharedInternals.T;
    ReactSharedInternals.T = null;
    var previousPriority = ReactDOMSharedInternals.p;
    try {
      ReactDOMSharedInternals.p = 2, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
    } finally {
      ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
    }
  }
  function dispatchContinuousEvent(domEventName, eventSystemFlags, container, nativeEvent) {
    var prevTransition = ReactSharedInternals.T;
    ReactSharedInternals.T = null;
    var previousPriority = ReactDOMSharedInternals.p;
    try {
      ReactDOMSharedInternals.p = 8, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
    } finally {
      ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
    }
  }
  function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
    if (_enabled) {
      var blockedOn = findInstanceBlockingEvent(nativeEvent);
      if (null === blockedOn)
        dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, return_targetInst, targetContainer), clearIfContinuousEvent(domEventName, nativeEvent);
      else if (queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent))
        nativeEvent.stopPropagation();
      else if (clearIfContinuousEvent(domEventName, nativeEvent), eventSystemFlags & 4 && -1 < discreteReplayableEvents.indexOf(domEventName)) {
        for (; null !== blockedOn; ) {
          var fiber = getInstanceFromNode(blockedOn);
          if (null !== fiber)
            switch (fiber.tag) {
              case 3:
                fiber = fiber.stateNode;
                if (fiber.current.memoizedState.isDehydrated) {
                  var lanes = getHighestPriorityLanes(fiber.pendingLanes);
                  if (0 !== lanes) {
                    var root2 = fiber;
                    root2.pendingLanes |= 2;
                    for (root2.entangledLanes |= 2; lanes; ) {
                      var lane = 1 << 31 - clz32(lanes);
                      root2.entanglements[1] |= lane;
                      lanes &= ~lane;
                    }
                    ensureRootIsScheduled(fiber);
                    0 === (executionContext & 6) && (workInProgressRootRenderTargetTime = now() + 500, flushSyncWorkAcrossRoots_impl(0));
                  }
                }
                break;
              case 31:
              case 13:
                root2 = enqueueConcurrentRenderForLane(fiber, 2), null !== root2 && scheduleUpdateOnFiber(root2, fiber, 2), flushSyncWork$1(), markRetryLaneIfNotHydrated(fiber, 2);
            }
          fiber = findInstanceBlockingEvent(nativeEvent);
          null === fiber && dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, return_targetInst, targetContainer);
          if (fiber === blockedOn)
            break;
          blockedOn = fiber;
        }
        null !== blockedOn && nativeEvent.stopPropagation();
      } else
        dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, null, targetContainer);
    }
  }
  function findInstanceBlockingEvent(nativeEvent) {
    nativeEvent = getEventTarget(nativeEvent);
    return findInstanceBlockingTarget(nativeEvent);
  }
  var return_targetInst = null;
  function findInstanceBlockingTarget(targetNode) {
    return_targetInst = null;
    targetNode = getClosestInstanceFromNode(targetNode);
    if (null !== targetNode) {
      var nearestMounted = getNearestMountedFiber(targetNode);
      if (null === nearestMounted)
        targetNode = null;
      else {
        var tag = nearestMounted.tag;
        if (13 === tag) {
          targetNode = getSuspenseInstanceFromFiber(nearestMounted);
          if (null !== targetNode)
            return targetNode;
          targetNode = null;
        } else if (31 === tag) {
          targetNode = getActivityInstanceFromFiber(nearestMounted);
          if (null !== targetNode)
            return targetNode;
          targetNode = null;
        } else if (3 === tag) {
          if (nearestMounted.stateNode.current.memoizedState.isDehydrated)
            return 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
          targetNode = null;
        } else
          nearestMounted !== targetNode && (targetNode = null);
      }
    }
    return_targetInst = targetNode;
    return null;
  }
  function getEventPriority(domEventName) {
    switch (domEventName) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "fullscreenerror":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "resize":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (getCurrentPriorityLevel()) {
          case ImmediatePriority:
            return 2;
          case UserBlockingPriority:
            return 8;
          case NormalPriority$1:
          case LowPriority:
            return 32;
          case IdlePriority:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var hasScheduledReplayAttempt = false, queuedFocus = null, queuedDrag = null, queuedMouse = null, queuedPointers =  new Map(), queuedPointerCaptures =  new Map(), queuedExplicitHydrationTargets = [], discreteReplayableEvents = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
  function clearIfContinuousEvent(domEventName, nativeEvent) {
    switch (domEventName) {
      case "focusin":
      case "focusout":
        queuedFocus = null;
        break;
      case "dragenter":
      case "dragleave":
        queuedDrag = null;
        break;
      case "mouseover":
      case "mouseout":
        queuedMouse = null;
        break;
      case "pointerover":
      case "pointerout":
        queuedPointers.delete(nativeEvent.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        queuedPointerCaptures.delete(nativeEvent.pointerId);
    }
  }
  function accumulateOrCreateContinuousQueuedReplayableEvent(existingQueuedEvent, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
    if (null === existingQueuedEvent || existingQueuedEvent.nativeEvent !== nativeEvent)
      return existingQueuedEvent = {
        blockedOn,
        domEventName,
        eventSystemFlags,
        nativeEvent,
        targetContainers: [targetContainer]
      }, null !== blockedOn && (blockedOn = getInstanceFromNode(blockedOn), null !== blockedOn && attemptContinuousHydration(blockedOn)), existingQueuedEvent;
    existingQueuedEvent.eventSystemFlags |= eventSystemFlags;
    blockedOn = existingQueuedEvent.targetContainers;
    null !== targetContainer && -1 === blockedOn.indexOf(targetContainer) && blockedOn.push(targetContainer);
    return existingQueuedEvent;
  }
  function queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
    switch (domEventName) {
      case "focusin":
        return queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(queuedFocus, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), true;
      case "dragenter":
        return queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(queuedDrag, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), true;
      case "mouseover":
        return queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(queuedMouse, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), true;
      case "pointerover":
        var pointerId = nativeEvent.pointerId;
        queuedPointers.set(pointerId, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointers.get(pointerId) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent));
        return true;
      case "gotpointercapture":
        return pointerId = nativeEvent.pointerId, queuedPointerCaptures.set(pointerId, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointerCaptures.get(pointerId) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent)), true;
    }
    return false;
  }
  function attemptExplicitHydrationTarget(queuedTarget) {
    var targetInst = getClosestInstanceFromNode(queuedTarget.target);
    if (null !== targetInst) {
      var nearestMounted = getNearestMountedFiber(targetInst);
      if (null !== nearestMounted) {
        if (targetInst = nearestMounted.tag, 13 === targetInst) {
          if (targetInst = getSuspenseInstanceFromFiber(nearestMounted), null !== targetInst) {
            queuedTarget.blockedOn = targetInst;
            runWithPriority(queuedTarget.priority, function() {
              attemptHydrationAtCurrentPriority(nearestMounted);
            });
            return;
          }
        } else if (31 === targetInst) {
          if (targetInst = getActivityInstanceFromFiber(nearestMounted), null !== targetInst) {
            queuedTarget.blockedOn = targetInst;
            runWithPriority(queuedTarget.priority, function() {
              attemptHydrationAtCurrentPriority(nearestMounted);
            });
            return;
          }
        } else if (3 === targetInst && nearestMounted.stateNode.current.memoizedState.isDehydrated) {
          queuedTarget.blockedOn = 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
          return;
        }
      }
    }
    queuedTarget.blockedOn = null;
  }
  function attemptReplayContinuousQueuedEvent(queuedEvent) {
    if (null !== queuedEvent.blockedOn)
      return false;
    for (var targetContainers = queuedEvent.targetContainers; 0 < targetContainers.length; ) {
      var nextBlockedOn = findInstanceBlockingEvent(queuedEvent.nativeEvent);
      if (null === nextBlockedOn) {
        nextBlockedOn = queuedEvent.nativeEvent;
        var nativeEventClone = new nextBlockedOn.constructor(nextBlockedOn.type, nextBlockedOn);
        currentReplayingEvent = nativeEventClone;
        nextBlockedOn.target.dispatchEvent(nativeEventClone);
        currentReplayingEvent = null;
      } else
        return targetContainers = getInstanceFromNode(nextBlockedOn), null !== targetContainers && attemptContinuousHydration(targetContainers), queuedEvent.blockedOn = nextBlockedOn, false;
      targetContainers.shift();
    }
    return true;
  }
  function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
    attemptReplayContinuousQueuedEvent(queuedEvent) && map.delete(key);
  }
  function replayUnblockedEvents() {
    hasScheduledReplayAttempt = false;
    null !== queuedFocus && attemptReplayContinuousQueuedEvent(queuedFocus) && (queuedFocus = null);
    null !== queuedDrag && attemptReplayContinuousQueuedEvent(queuedDrag) && (queuedDrag = null);
    null !== queuedMouse && attemptReplayContinuousQueuedEvent(queuedMouse) && (queuedMouse = null);
    queuedPointers.forEach(attemptReplayContinuousQueuedEventInMap);
    queuedPointerCaptures.forEach(attemptReplayContinuousQueuedEventInMap);
  }
  function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
    queuedEvent.blockedOn === unblocked && (queuedEvent.blockedOn = null, hasScheduledReplayAttempt || (hasScheduledReplayAttempt = true, Scheduler.unstable_scheduleCallback(Scheduler.unstable_NormalPriority, replayUnblockedEvents)));
  }
  var lastScheduledReplayQueue = null;
  function scheduleReplayQueueIfNeeded(formReplayingQueue) {
    lastScheduledReplayQueue !== formReplayingQueue && (lastScheduledReplayQueue = formReplayingQueue, Scheduler.unstable_scheduleCallback(Scheduler.unstable_NormalPriority, function() {
      lastScheduledReplayQueue === formReplayingQueue && (lastScheduledReplayQueue = null);
      for (var i = 0; i < formReplayingQueue.length; i += 3) {
        var form = formReplayingQueue[i], submitterOrAction = formReplayingQueue[i + 1], formData = formReplayingQueue[i + 2];
        if ("function" !== typeof submitterOrAction)
          if (null === findInstanceBlockingTarget(submitterOrAction || form))
            continue;
          else
            break;
        var formInst = getInstanceFromNode(form);
        null !== formInst && (formReplayingQueue.splice(i, 3), i -= 3, startHostTransition(formInst, {
          pending: true,
          data: formData,
          method: form.method,
          action: submitterOrAction
        }, submitterOrAction, formData));
      }
    }));
  }
  function retryIfBlockedOn(unblocked) {
    function unblock(queuedEvent) {
      return scheduleCallbackIfUnblocked(queuedEvent, unblocked);
    }
    null !== queuedFocus && scheduleCallbackIfUnblocked(queuedFocus, unblocked);
    null !== queuedDrag && scheduleCallbackIfUnblocked(queuedDrag, unblocked);
    null !== queuedMouse && scheduleCallbackIfUnblocked(queuedMouse, unblocked);
    queuedPointers.forEach(unblock);
    queuedPointerCaptures.forEach(unblock);
    for (var i = 0; i < queuedExplicitHydrationTargets.length; i++) {
      var queuedTarget = queuedExplicitHydrationTargets[i];
      queuedTarget.blockedOn === unblocked && (queuedTarget.blockedOn = null);
    }
    for (; 0 < queuedExplicitHydrationTargets.length && (i = queuedExplicitHydrationTargets[0], null === i.blockedOn); )
      attemptExplicitHydrationTarget(i), null === i.blockedOn && queuedExplicitHydrationTargets.shift();
    i = (unblocked.ownerDocument || unblocked).$$reactFormReplay;
    if (null != i)
      for (queuedTarget = 0; queuedTarget < i.length; queuedTarget += 3) {
        var form = i[queuedTarget], submitterOrAction = i[queuedTarget + 1], formProps = form[internalPropsKey] || null;
        if ("function" === typeof submitterOrAction)
          formProps || scheduleReplayQueueIfNeeded(i);
        else if (formProps) {
          var action = null;
          if (submitterOrAction && submitterOrAction.hasAttribute("formAction"))
            if (form = submitterOrAction, formProps = submitterOrAction[internalPropsKey] || null)
              action = formProps.formAction;
            else {
              if (null !== findInstanceBlockingTarget(form))
                continue;
            }
          else
            action = formProps.action;
          "function" === typeof action ? i[queuedTarget + 1] = action : (i.splice(queuedTarget, 3), queuedTarget -= 3);
          scheduleReplayQueueIfNeeded(i);
        }
      }
  }
  function defaultOnDefaultTransitionIndicator() {
    function handleNavigate(event) {
      event.canIntercept && "react-transition" === event.info && event.intercept({
        handler: function() {
          return new Promise(function(resolve) {
            return pendingResolve = resolve;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function handleNavigateComplete() {
      null !== pendingResolve && (pendingResolve(), pendingResolve = null);
      isCancelled || setTimeout(startFakeNavigation, 20);
    }
    function startFakeNavigation() {
      if (!isCancelled && !navigation.transition) {
        var currentEntry = navigation.currentEntry;
        currentEntry && null != currentEntry.url && navigation.navigate(currentEntry.url, {
          state: currentEntry.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if ("object" === typeof navigation) {
      var isCancelled = false, pendingResolve = null;
      navigation.addEventListener("navigate", handleNavigate);
      navigation.addEventListener("navigatesuccess", handleNavigateComplete);
      navigation.addEventListener("navigateerror", handleNavigateComplete);
      setTimeout(startFakeNavigation, 100);
      return function() {
        isCancelled = true;
        navigation.removeEventListener("navigate", handleNavigate);
        navigation.removeEventListener("navigatesuccess", handleNavigateComplete);
        navigation.removeEventListener("navigateerror", handleNavigateComplete);
        null !== pendingResolve && (pendingResolve(), pendingResolve = null);
      };
    }
  }
  function ReactDOMRoot(internalRoot) {
    this._internalRoot = internalRoot;
  }
  ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function(children) {
    var root2 = this._internalRoot;
    if (null === root2)
      throw Error(formatProdErrorMessage(409));
    var current = root2.current, lane = requestUpdateLane();
    updateContainerImpl(current, lane, children, root2, null, null);
  };
  ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount = function() {
    var root2 = this._internalRoot;
    if (null !== root2) {
      this._internalRoot = null;
      var container = root2.containerInfo;
      updateContainerImpl(root2.current, 2, null, root2, null, null);
      flushSyncWork$1();
      container[internalContainerInstanceKey] = null;
    }
  };
  function ReactDOMHydrationRoot(internalRoot) {
    this._internalRoot = internalRoot;
  }
  ReactDOMHydrationRoot.prototype.unstable_scheduleHydration = function(target) {
    if (target) {
      var updatePriority = resolveUpdatePriority();
      target = { blockedOn: null, target, priority: updatePriority };
      for (var i = 0; i < queuedExplicitHydrationTargets.length && 0 !== updatePriority && updatePriority < queuedExplicitHydrationTargets[i].priority; i++)
        ;
      queuedExplicitHydrationTargets.splice(i, 0, target);
      0 === i && attemptExplicitHydrationTarget(target);
    }
  };
  var isomorphicReactPackageVersion$jscomp$inline_2043 = React2.version;
  if ("19.3.0" !== isomorphicReactPackageVersion$jscomp$inline_2043)
    throw Error(formatProdErrorMessage(527, isomorphicReactPackageVersion$jscomp$inline_2043, "19.3.0"));
  ReactDOMSharedInternals.findDOMNode = function(componentOrElement) {
    var fiber = componentOrElement._reactInternals;
    if (void 0 === fiber) {
      if ("function" === typeof componentOrElement.render)
        throw Error(formatProdErrorMessage(188));
      componentOrElement = Object.keys(componentOrElement).join(",");
      throw Error(formatProdErrorMessage(268, componentOrElement));
    }
    componentOrElement = findCurrentFiberUsingSlowPath(fiber);
    componentOrElement = null !== componentOrElement ? findCurrentHostFiberImpl(componentOrElement) : null;
    componentOrElement = null === componentOrElement ? null : componentOrElement.stateNode;
    return componentOrElement;
  };
  var internals$jscomp$inline_2586 = {
    bundleType: 0,
    version: "19.3.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: ReactSharedInternals,
    reconcilerVersion: "19.3.0"
  };
  if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
    var hook$jscomp$inline_2587 = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!hook$jscomp$inline_2587.isDisabled && hook$jscomp$inline_2587.supportsFiber)
      try {
        rendererID = hook$jscomp$inline_2587.inject(internals$jscomp$inline_2586), injectedHook = hook$jscomp$inline_2587;
      } catch (err) {
      }
  }
  reactDomClient_production.createRoot = function(container, options2) {
    if (!isValidContainer(container))
      throw Error(formatProdErrorMessage(299));
    var isStrictMode = false, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError;
    null !== options2 && void 0 !== options2 && (true === options2.unstable_strictMode && (isStrictMode = true), void 0 !== options2.identifierPrefix && (identifierPrefix = options2.identifierPrefix), void 0 !== options2.onUncaughtError && (onUncaughtError = options2.onUncaughtError), void 0 !== options2.onCaughtError && (onCaughtError = options2.onCaughtError), void 0 !== options2.onRecoverableError && (onRecoverableError = options2.onRecoverableError));
    options2 = createFiberRoot(container, 1, false, null, null, isStrictMode, identifierPrefix, null, onUncaughtError, onCaughtError, onRecoverableError, defaultOnDefaultTransitionIndicator);
    container[internalContainerInstanceKey] = options2.current;
    listenToAllSupportedEvents(container);
    return new ReactDOMRoot(options2);
  };
  reactDomClient_production.hydrateRoot = function(container, initialChildren, options2) {
    if (!isValidContainer(container))
      throw Error(formatProdErrorMessage(299));
    var isStrictMode = false, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError, formState = null;
    null !== options2 && void 0 !== options2 && (true === options2.unstable_strictMode && (isStrictMode = true), void 0 !== options2.identifierPrefix && (identifierPrefix = options2.identifierPrefix), void 0 !== options2.onUncaughtError && (onUncaughtError = options2.onUncaughtError), void 0 !== options2.onCaughtError && (onCaughtError = options2.onCaughtError), void 0 !== options2.onRecoverableError && (onRecoverableError = options2.onRecoverableError), void 0 !== options2.formState && (formState = options2.formState));
    initialChildren = createFiberRoot(container, 1, true, initialChildren, null != options2 ? options2 : null, isStrictMode, identifierPrefix, formState, onUncaughtError, onCaughtError, onRecoverableError, defaultOnDefaultTransitionIndicator);
    initialChildren.context = getContextForSubtree(null);
    options2 = initialChildren.current;
    isStrictMode = requestUpdateLane();
    isStrictMode = getBumpedLaneForHydrationByLane(isStrictMode);
    identifierPrefix = createUpdate(isStrictMode);
    identifierPrefix.callback = null;
    enqueueUpdate(options2, identifierPrefix, isStrictMode);
    options2 = isStrictMode;
    initialChildren.current.lanes = options2;
    markRootUpdated$1(initialChildren, options2);
    ensureRootIsScheduled(initialChildren);
    container[internalContainerInstanceKey] = initialChildren.current;
    listenToAllSupportedEvents(container);
    return new ReactDOMHydrationRoot(initialChildren);
  };
  reactDomClient_production.version = "19.3.0";
  return reactDomClient_production;
}
var hasRequiredClient;
function requireClient() {
  if (hasRequiredClient)
    return client.exports;
  hasRequiredClient = 1;
  function checkDCE() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
      return;
    }
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
      console.error(err);
    }
  }
  {
    checkDCE();
    client.exports = requireReactDomClient_production();
  }
  return client.exports;
}
var clientExports = requireClient();
const ReactDOM = getDefaultExportFromCjs(clientExports);
const o$9 = reactExports.createContext({
  color: "currentColor",
  size: "1em",
  weight: "regular",
  mirrored: false
});
const p = reactExports.forwardRef((s, a2) => {
  const { alt: n, color: r2, size: t2, weight: o2, mirrored: c, children: i, weights: m, ...x } = s, { color: d = "currentColor", size: l2, weight: f = "regular", mirrored: g = false, ...w } = reactExports.useContext(o$9);
  return reactExports.createElement("svg", {
    ref: a2,
    xmlns: "http://www.w3.org/2000/svg",
    width: t2 != null ? t2 : l2,
    height: t2 != null ? t2 : l2,
    fill: r2 != null ? r2 : d,
    viewBox: "0 0 256 256",
    transform: c || g ? "scale(-1, 1)" : void 0,
    ...w,
    ...x
  }, !!n && reactExports.createElement("title", null, n), i, m.get(o2 != null ? o2 : f));
});
p.displayName = "IconBase";
const e$o =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M160,172a36,36,0,1,0-36-36A36,36,0,0,0,160,172Zm0-48a12,12,0,1,1-12,12A12,12,0,0,1,160,124Zm56-64H113.76l81.69-24.5a12,12,0,0,0-6.9-23l-160,48A12,12,0,0,0,20,72V192a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V80A20,20,0,0,0,216,60Zm-4,128H44V84H212ZM60,116a12,12,0,0,1,12-12H96a12,12,0,0,1,0,24H72A12,12,0,0,1,60,116Zm0,40a12,12,0,0,1,12-12H96a12,12,0,0,1,0,24H72A12,12,0,0,1,60,156Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M216,72H32V192a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V80A8,8,0,0,0,216,72Zm-56,96a32,32,0,1,1,32-32A32,32,0,0,1,160,168Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M104,168a8,8,0,0,1-8,8H64a8,8,0,0,1,0-16H96A8,8,0,0,1,104,168Zm-8-40H64a8,8,0,0,0,0,16H96a8,8,0,0,0,0-16Zm0-32H64a8,8,0,0,0,0,16H96a8,8,0,0,0,0-16ZM232,80V192a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V72a8,8,0,0,1,5.7-7.66l160-48a8,8,0,0,1,4.6,15.33L86.51,64H216A16,16,0,0,1,232,80ZM216,192V80H40V192H216Zm-16-56a40,40,0,1,1-40-40A40,40,0,0,1,200,136Zm-16,0a24,24,0,1,0-24,24A24,24,0,0,0,184,136Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,64H86.51L194.3,31.67a8,8,0,0,0-4.6-15.33l-160,48h0A8,8,0,0,0,24,72V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64ZM104,176H64a8,8,0,0,1,0-16h40a8,8,0,0,1,0,16Zm0-32H64a8,8,0,0,1,0-16h40a8,8,0,0,1,0,16Zm0-32H64a8,8,0,0,1,0-16h40a8,8,0,0,1,0,16Zm64,56a32,32,0,1,1,32-32A32,32,0,0,1,168,168Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M102,104a6,6,0,0,1-6,6H64a6,6,0,0,1,0-12H96A6,6,0,0,1,102,104Zm-6,26H64a6,6,0,0,0,0,12H96a6,6,0,0,0,0-12Zm0,32H64a6,6,0,0,0,0,12H96a6,6,0,0,0,0-12ZM230,80V192a14,14,0,0,1-14,14H40a14,14,0,0,1-14-14V72a6,6,0,0,1,4.28-5.75l160-48a6,6,0,0,1,3.44,11.5L72.88,66H216A14,14,0,0,1,230,80Zm-12,0a2,2,0,0,0-2-2H38V192a2,2,0,0,0,2,2H216a2,2,0,0,0,2-2Zm-20,56a38,38,0,1,1-38-38A38,38,0,0,1,198,136Zm-12,0a26,26,0,1,0-26,26A26,26,0,0,0,186,136Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M104,168a8,8,0,0,1-8,8H64a8,8,0,0,1,0-16H96A8,8,0,0,1,104,168Zm-8-40H64a8,8,0,0,0,0,16H96a8,8,0,0,0,0-16Zm0-32H64a8,8,0,0,0,0,16H96a8,8,0,0,0,0-16ZM232,80V192a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V72a8,8,0,0,1,5.7-7.66l160-48a8,8,0,0,1,4.6,15.33L86.51,64H216A16,16,0,0,1,232,80ZM216,192V80H40V192H216Zm-16-56a40,40,0,1,1-40-40A40,40,0,0,1,200,136Zm-16,0a24,24,0,1,0-24,24A24,24,0,0,0,184,136Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M100,168a4,4,0,0,1-4,4H64a4,4,0,0,1,0-8H96A4,4,0,0,1,100,168Zm-4-36H64a4,4,0,0,0,0,8H96a4,4,0,0,0,0-8ZM228,80V192a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V72a4,4,0,0,1,2.85-3.81l160-48a4,4,0,0,1,2.3,7.66L59.25,68H216A12,12,0,0,1,228,80Zm-8,0a4,4,0,0,0-4-4H36V192a4,4,0,0,0,4,4H216a4,4,0,0,0,4-4Zm-24,56a36,36,0,1,1-36-36A36,36,0,0,1,196,136Zm-8,0a28,28,0,1,0-28,28A28,28,0,0,0,188,136ZM96,100H64a4,4,0,0,0,0,8H96a4,4,0,0,0,0-8Z" }))
  ]
]);
const a$g = reactExports.forwardRef((e2, r2) => reactExports.createElement(p, { ref: r2, ...e2, weights: e$o }));
a$g.displayName = "RadioIcon";
const e$n =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M40,92H70.06a36,36,0,0,0,67.88,0H216a12,12,0,0,0,0-24H137.94a36,36,0,0,0-67.88,0H40a12,12,0,0,0,0,24Zm64-24A12,12,0,1,1,92,80,12,12,0,0,1,104,68Zm112,96H201.94a36,36,0,0,0-67.88,0H40a12,12,0,0,0,0,24h94.06a36,36,0,0,0,67.88,0H216a12,12,0,0,0,0-24Zm-48,24a12,12,0,1,1,12-12A12,12,0,0,1,168,188Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M128,80a24,24,0,1,1-24-24A24,24,0,0,1,128,80Zm40,72a24,24,0,1,0,24,24A24,24,0,0,0,168,152Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H199a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h97a32,32,0,0,0,62,0h17a8,8,0,0,0,0-16Zm-48,24a16,16,0,1,1,16-16A16,16,0,0,1,168,192Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M32,80a8,8,0,0,1,8-8H77.17a28,28,0,0,1,53.66,0H216a8,8,0,0,1,0,16H130.83a28,28,0,0,1-53.66,0H40A8,8,0,0,1,32,80Zm184,88H194.83a28,28,0,0,0-53.66,0H40a8,8,0,0,0,0,16H141.17a28,28,0,0,0,53.66,0H216a8,8,0,0,0,0-16Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M40,86H74.6a30,30,0,0,0,58.8,0H216a6,6,0,0,0,0-12H133.4a30,30,0,0,0-58.8,0H40a6,6,0,0,0,0,12Zm64-24A18,18,0,1,1,86,80,18,18,0,0,1,104,62ZM216,170H197.4a30,30,0,0,0-58.8,0H40a6,6,0,0,0,0,12h98.6a30,30,0,0,0,58.8,0H216a6,6,0,0,0,0-12Zm-48,24a18,18,0,1,1,18-18A18,18,0,0,1,168,194Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H199a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h97a32,32,0,0,0,62,0h17a8,8,0,0,0,0-16Zm-48,24a16,16,0,1,1,16-16A16,16,0,0,1,168,192Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M40,84H76.29a28,28,0,0,0,55.42,0H216a4,4,0,0,0,0-8H131.71a28,28,0,0,0-55.42,0H40a4,4,0,0,0,0,8Zm64-24A20,20,0,1,1,84,80,20,20,0,0,1,104,60ZM216,172H195.71a28,28,0,0,0-55.42,0H40a4,4,0,0,0,0,8H140.29a28,28,0,0,0,55.42,0H216a4,4,0,0,0,0-8Zm-48,24a20,20,0,1,1,20-20A20,20,0,0,1,168,196Z" }))
  ]
]);
const r$5 = reactExports.forwardRef((e2, t2) => reactExports.createElement(p, { ref: t2, ...e2, weights: e$n }));
r$5.displayName = "SlidersHorizontalIcon";
const e$m =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M232,116h-4.72A100.21,100.21,0,0,0,140,28.72V24a12,12,0,0,0-24,0v4.72A100.21,100.21,0,0,0,28.72,116H24a12,12,0,0,0,0,24h4.72A100.21,100.21,0,0,0,116,227.28V232a12,12,0,0,0,24,0v-4.72A100.21,100.21,0,0,0,227.28,140H232a12,12,0,0,0,0-24Zm-92,87v-3a12,12,0,0,0-24,0v3a76.15,76.15,0,0,1-63-63h3a12,12,0,0,0,0-24H53a76.15,76.15,0,0,1,63-63v3a12,12,0,0,0,24,0V53a76.15,76.15,0,0,1,63,63h-3a12,12,0,0,0,0,24h3A76.15,76.15,0,0,1,140,203ZM128,84a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,84Zm0,64a20,20,0,1,1,20-20A20,20,0,0,1,128,148Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M160,128a32,32,0,1,1-32-32A32,32,0,0,1,160,128Z", opacity: "0.2" }), reactExports.createElement("path", { d: "M232,120h-8.34A96.14,96.14,0,0,0,136,32.34V24a8,8,0,0,0-16,0v8.34A96.14,96.14,0,0,0,32.34,120H24a8,8,0,0,0,0,16h8.34A96.14,96.14,0,0,0,120,223.66V232a8,8,0,0,0,16,0v-8.34A96.14,96.14,0,0,0,223.66,136H232a8,8,0,0,0,0-16Zm-96,87.6V200a8,8,0,0,0-16,0v7.6A80.15,80.15,0,0,1,48.4,136H56a8,8,0,0,0,0-16H48.4A80.15,80.15,0,0,1,120,48.4V56a8,8,0,0,0,16,0V48.4A80.15,80.15,0,0,1,207.6,120H200a8,8,0,0,0,0,16h7.6A80.15,80.15,0,0,1,136,207.6ZM128,88a40,40,0,1,0,40,40A40,40,0,0,0,128,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,152Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M232,120h-8.34A96.14,96.14,0,0,0,136,32.34V24a8,8,0,0,0-16,0v8.34A96.14,96.14,0,0,0,32.34,120H24a8,8,0,0,0,0,16h8.34A96.14,96.14,0,0,0,120,223.66V232a8,8,0,0,0,16,0v-8.34A96.14,96.14,0,0,0,223.66,136H232a8,8,0,0,0,0-16Zm-32,16h7.6A80.15,80.15,0,0,1,136,207.6V200a8,8,0,0,0-16,0v7.6A80.15,80.15,0,0,1,48.4,136H56a8,8,0,0,0,0-16H48.4A80.15,80.15,0,0,1,120,48.4V56a8,8,0,0,0,16,0V48.4A80.15,80.15,0,0,1,207.6,120H200a8,8,0,0,0,0,16Zm-32-8a40,40,0,1,1-40-40A40,40,0,0,1,168,128Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M232,122H221.8A94.13,94.13,0,0,0,134,34.2V24a6,6,0,0,0-12,0V34.2A94.13,94.13,0,0,0,34.2,122H24a6,6,0,0,0,0,12H34.2A94.13,94.13,0,0,0,122,221.8V232a6,6,0,0,0,12,0V221.8A94.13,94.13,0,0,0,221.8,134H232a6,6,0,0,0,0-12Zm-98,87.76V200a6,6,0,0,0-12,0v9.76A82.09,82.09,0,0,1,46.24,134H56a6,6,0,0,0,0-12H46.24A82.09,82.09,0,0,1,122,46.24V56a6,6,0,0,0,12,0V46.24A82.09,82.09,0,0,1,209.76,122H200a6,6,0,0,0,0,12h9.76A82.09,82.09,0,0,1,134,209.76ZM128,90a38,38,0,1,0,38,38A38,38,0,0,0,128,90Zm0,64a26,26,0,1,1,26-26A26,26,0,0,1,128,154Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M232,120h-8.34A96.14,96.14,0,0,0,136,32.34V24a8,8,0,0,0-16,0v8.34A96.14,96.14,0,0,0,32.34,120H24a8,8,0,0,0,0,16h8.34A96.14,96.14,0,0,0,120,223.66V232a8,8,0,0,0,16,0v-8.34A96.14,96.14,0,0,0,223.66,136H232a8,8,0,0,0,0-16Zm-96,87.6V200a8,8,0,0,0-16,0v7.6A80.15,80.15,0,0,1,48.4,136H56a8,8,0,0,0,0-16H48.4A80.15,80.15,0,0,1,120,48.4V56a8,8,0,0,0,16,0V48.4A80.15,80.15,0,0,1,207.6,120H200a8,8,0,0,0,0,16h7.6A80.15,80.15,0,0,1,136,207.6ZM128,88a40,40,0,1,0,40,40A40,40,0,0,0,128,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,152Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M232,124H219.91A92.13,92.13,0,0,0,132,36.09V24a4,4,0,0,0-8,0V36.09A92.13,92.13,0,0,0,36.09,124H24a4,4,0,0,0,0,8H36.09A92.13,92.13,0,0,0,124,219.91V232a4,4,0,0,0,8,0V219.91A92.13,92.13,0,0,0,219.91,132H232a4,4,0,0,0,0-8ZM132,211.9V200a4,4,0,0,0-8,0v11.9A84.11,84.11,0,0,1,44.1,132H56a4,4,0,0,0,0-8H44.1A84.11,84.11,0,0,1,124,44.1V56a4,4,0,0,0,8,0V44.1A84.11,84.11,0,0,1,211.9,124H200a4,4,0,0,0,0,8h11.9A84.11,84.11,0,0,1,132,211.9ZM128,92a36,36,0,1,0,36,36A36,36,0,0,0,128,92Zm0,64a28,28,0,1,1,28-28A28,28,0,0,1,128,156Z" }))
  ]
]);
const r$4 = reactExports.forwardRef((s, a2) => reactExports.createElement(p, { ref: a2, ...s, weights: e$m }));
r$4.displayName = "CrosshairIcon";
const a$f =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,128l-72,72V56Z", opacity: "0.2" }), reactExports.createElement("path", { d: "M221.66,122.34l-72-72A8,8,0,0,0,136,56v64H40a8,8,0,0,0,0,16h96v64a8,8,0,0,0,13.66,5.66l72-72A8,8,0,0,0,221.66,122.34ZM152,180.69V75.31L204.69,128Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M221.66,133.66l-72,72A8,8,0,0,1,136,200V136H40a8,8,0,0,1,0-16h96V56a8,8,0,0,1,13.66-5.66l72,72A8,8,0,0,1,221.66,133.66Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M220.24,132.24l-72,72a6,6,0,0,1-8.48-8.48L201.51,134H40a6,6,0,0,1,0-12H201.51L139.76,60.24a6,6,0,0,1,8.48-8.48l72,72A6,6,0,0,1,220.24,132.24Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M218.83,130.83l-72,72a4,4,0,0,1-5.66-5.66L206.34,132H40a4,4,0,0,1,0-8H206.34L141.17,58.83a4,4,0,0,1,5.66-5.66l72,72A4,4,0,0,1,218.83,130.83Z" }))
  ]
]);
const r$3 = reactExports.forwardRef((t2, e2) => reactExports.createElement(p, { ref: e2, ...t2, weights: a$f }));
r$3.displayName = "ArrowRightIcon";
const a$e =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM181.66,170.34a8,8,0,0,1-11.32,11.32L128,139.31,85.66,181.66a8,8,0,0,1-11.32-11.32L116.69,128,74.34,85.66A8,8,0,0,1,85.66,74.34L128,116.69l42.34-42.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M204.24,195.76a6,6,0,1,1-8.48,8.48L128,136.49,60.24,204.24a6,6,0,0,1-8.48-8.48L119.51,128,51.76,60.24a6,6,0,0,1,8.48-8.48L128,119.51l67.76-67.75a6,6,0,0,1,8.48,8.48L136.49,128Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M202.83,197.17a4,4,0,0,1-5.66,5.66L128,133.66,58.83,202.83a4,4,0,0,1-5.66-5.66L122.34,128,53.17,58.83a4,4,0,0,1,5.66-5.66L128,122.34l69.17-69.17a4,4,0,1,1,5.66,5.66L133.66,128Z" }))
  ]
]);
const e$l = reactExports.forwardRef((r2, t2) => reactExports.createElement(p, { ref: t2, ...r2, weights: a$e }));
e$l.displayName = "XIcon";
const a$d =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M234.49,111.07,90.41,22.94A20,20,0,0,0,60,39.87V216.13a20,20,0,0,0,30.41,16.93l144.08-88.13a19.82,19.82,0,0,0,0-33.86ZM84,208.85V47.15L216.16,128Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M228.23,134.69,84.15,222.81A8,8,0,0,1,72,216.12V39.88a8,8,0,0,1,12.15-6.69l144.08,88.12A7.82,7.82,0,0,1,228.23,134.69Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M231.36,116.19,87.28,28.06a14,14,0,0,0-14.18-.27A13.69,13.69,0,0,0,66,39.87V216.13a13.69,13.69,0,0,0,7.1,12.08,14,14,0,0,0,14.18-.27l144.08-88.13a13.82,13.82,0,0,0,0-23.62Zm-6.26,13.38L81,217.7a2,2,0,0,1-2.06,0,1.78,1.78,0,0,1-1-1.61V39.87a1.78,1.78,0,0,1,1-1.61A2.06,2.06,0,0,1,80,38a2,2,0,0,1,1,.31L225.1,126.43a1.82,1.82,0,0,1,0,3.14Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M230.32,117.9,86.24,29.79a11.91,11.91,0,0,0-12.17-.23A11.71,11.71,0,0,0,68,39.89V216.11a11.71,11.71,0,0,0,6.07,10.33,11.91,11.91,0,0,0,12.17-.23L230.32,138.1a11.82,11.82,0,0,0,0-20.2Zm-4.18,13.37L82.06,219.39a4,4,0,0,1-4.07.07,3.77,3.77,0,0,1-2-3.35V39.89a3.77,3.77,0,0,1,2-3.35,4,4,0,0,1,4.07.07l144.08,88.12a3.8,3.8,0,0,1,0,6.54Z" }))
  ]
]);
const a$c = reactExports.forwardRef((e2, r2) => reactExports.createElement(p, { ref: r2, ...e2, weights: a$d }));
a$c.displayName = "PlayIcon";
const a$b =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M200,36H56A20,20,0,0,0,36,56V200a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V56A20,20,0,0,0,200,36Zm-4,160H60V60H196Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M208,56V200a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M200,42H56A14,14,0,0,0,42,56V200a14,14,0,0,0,14,14H200a14,14,0,0,0,14-14V56A14,14,0,0,0,200,42Zm2,158a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V56a2,2,0,0,1,2-2H200a2,2,0,0,1,2,2Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M200,44H56A12,12,0,0,0,44,56V200a12,12,0,0,0,12,12H200a12,12,0,0,0,12-12V56A12,12,0,0,0,200,44Zm4,156a4,4,0,0,1-4,4H56a4,4,0,0,1-4-4V56a4,4,0,0,1,4-4H200a4,4,0,0,1,4,4Z" }))
  ]
]);
const t$3 = reactExports.forwardRef((e2, r2) => reactExports.createElement(p, { ref: r2, ...e2, weights: a$b }));
t$3.displayName = "StopIcon";
const e$k =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M128,180a52.06,52.06,0,0,0,52-52V64A52,52,0,0,0,76,64v64A52.06,52.06,0,0,0,128,180ZM100,64a28,28,0,0,1,56,0v64a28,28,0,0,1-56,0Zm40,155.22V240a12,12,0,0,1-24,0V219.22A92.14,92.14,0,0,1,36,128a12,12,0,0,1,24,0,68,68,0,0,0,136,0,12,12,0,0,1,24,0A92.14,92.14,0,0,1,140,219.22Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M168,64v64a40,40,0,0,1-40,40h0a40,40,0,0,1-40-40V64a40,40,0,0,1,40-40h0A40,40,0,0,1,168,64Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M80,128V64a48,48,0,0,1,96,0v64a48,48,0,0,1-96,0Zm128,0a8,8,0,0,0-16,0,64,64,0,0,1-128,0,8,8,0,0,0-16,0,80.11,80.11,0,0,0,72,79.6V240a8,8,0,0,0,16,0V207.6A80.11,80.11,0,0,0,208,128Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M128,174a46.06,46.06,0,0,0,46-46V64a46,46,0,0,0-92,0v64A46.06,46.06,0,0,0,128,174ZM94,64a34,34,0,0,1,68,0v64a34,34,0,0,1-68,0Zm40,141.75V240a6,6,0,0,1-12,0V205.75A78.09,78.09,0,0,1,50,128a6,6,0,0,1,12,0,66,66,0,0,0,132,0,6,6,0,0,1,12,0A78.09,78.09,0,0,1,134,205.75Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M128,172a44.05,44.05,0,0,0,44-44V64a44,44,0,0,0-88,0v64A44.05,44.05,0,0,0,128,172ZM92,64a36,36,0,0,1,72,0v64a36,36,0,0,1-72,0Zm40,139.89V240a4,4,0,0,1-8,0V203.89A76.09,76.09,0,0,1,52,128a4,4,0,0,1,8,0,68,68,0,0,0,136,0,4,4,0,0,1,8,0A76.09,76.09,0,0,1,132,203.89Z" }))
  ]
]);
const e$j = reactExports.forwardRef((r2, c) => reactExports.createElement(p, { ref: c, ...r2, weights: e$k }));
e$j.displayName = "MicrophoneIcon";
const e$i =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M172,72V200a12,12,0,0,1-24,0V72a12,12,0,0,1,24,0Zm28-52a12,12,0,0,0-12,12V200a12,12,0,0,0,24,0V32A12,12,0,0,0,200,20Zm-80,80a12,12,0,0,0-12,12v88a12,12,0,0,0,24,0V112A12,12,0,0,0,120,100ZM80,140a12,12,0,0,0-12,12v48a12,12,0,0,0,24,0V152A12,12,0,0,0,80,140ZM40,180a12,12,0,0,0-12,12v8a12,12,0,0,0,24,0v-8A12,12,0,0,0,40,180Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M200,40V200a8,8,0,0,1-8,8H32a8,8,0,0,1-5.66-13.66l160-160A8,8,0,0,1,200,40Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M198.12,25.23a16,16,0,0,0-17.44,3.46l-160,160A16,16,0,0,0,32,216H192a16,16,0,0,0,16-16V40A15.94,15.94,0,0,0,198.12,25.23ZM192,200H32L192,40Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M208,40V200a16,16,0,0,1-16,16H32A16,16,0,0,1,20.7,188.68l160-160A16,16,0,0,1,208,40Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M166,72V200a6,6,0,0,1-12,0V72a6,6,0,0,1,12,0Zm34-46a6,6,0,0,0-6,6V200a6,6,0,0,0,12,0V32A6,6,0,0,0,200,26Zm-80,80a6,6,0,0,0-6,6v88a6,6,0,0,0,12,0V112A6,6,0,0,0,120,106ZM80,146a6,6,0,0,0-6,6v48a6,6,0,0,0,12,0V152A6,6,0,0,0,80,146ZM40,186a6,6,0,0,0-6,6v8a6,6,0,0,0,12,0v-8A6,6,0,0,0,40,186Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M168,72V200a8,8,0,0,1-16,0V72a8,8,0,0,1,16,0Zm32-48a8,8,0,0,0-8,8V200a8,8,0,0,0,16,0V32A8,8,0,0,0,200,24Zm-80,80a8,8,0,0,0-8,8v88a8,8,0,0,0,16,0V112A8,8,0,0,0,120,104ZM80,144a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V152A8,8,0,0,0,80,144ZM40,184a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-8A8,8,0,0,0,40,184Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M164,72V200a4,4,0,0,1-8,0V72a4,4,0,0,1,8,0Zm36-44a4,4,0,0,0-4,4V200a4,4,0,0,0,8,0V32A4,4,0,0,0,200,28Zm-80,80a4,4,0,0,0-4,4v88a4,4,0,0,0,8,0V112A4,4,0,0,0,120,108ZM80,148a4,4,0,0,0-4,4v48a4,4,0,0,0,8,0V152A4,4,0,0,0,80,148ZM40,188a4,4,0,0,0-4,4v8a4,4,0,0,0,8,0v-8A4,4,0,0,0,40,188Z" }))
  ]
]);
const e$h = reactExports.forwardRef((o2, a2) => reactExports.createElement(p, { ref: a2, ...o2, weights: e$i }));
e$h.displayName = "CellSignalFullIcon";
const e$g =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M157.27,21.22a12,12,0,0,0-12.64,1.31L75.88,76H32A20,20,0,0,0,12,96v64a20,20,0,0,0,20,20H75.88l68.75,53.47A12,12,0,0,0,164,224V32A12,12,0,0,0,157.27,21.22ZM36,100H68v56H36Zm104,99.46L92,162.13V93.87l48-37.33ZM212,128a44,44,0,0,1-11,29.11,12,12,0,1,1-18-15.88,20,20,0,0,0,0-26.43,12,12,0,0,1,18-15.86A43.94,43.94,0,0,1,212,128Zm40,0a83.87,83.87,0,0,1-21.39,56,12,12,0,0,1-17.89-16,60,60,0,0,0,0-80,12,12,0,1,1,17.88-16A83.87,83.87,0,0,1,252,128Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M80,88v80H32a8,8,0,0,1-8-8V96a8,8,0,0,1,8-8Z", opacity: "0.2" }), reactExports.createElement("path", { d: "M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM32,96H72v64H32ZM144,207.64,88,164.09V91.91l56-43.55Zm54-106.08a40,40,0,0,1,0,52.88,8,8,0,0,1-12-10.58,24,24,0,0,0,0-31.72,8,8,0,0,1,12-10.58ZM248,128a79.9,79.9,0,0,1-20.37,53.34,8,8,0,0,1-11.92-10.67,64,64,0,0,0,0-85.33,8,8,0,1,1,11.92-10.67A79.83,79.83,0,0,1,248,128Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M160,32.25V223.69a8.29,8.29,0,0,1-3.91,7.18,8,8,0,0,1-9-.56l-65.57-51A4,4,0,0,1,80,176.16V79.84a4,4,0,0,1,1.55-3.15l65.57-51a8,8,0,0,1,10,.16A8.27,8.27,0,0,1,160,32.25ZM60,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H60a4,4,0,0,0,4-4V84A4,4,0,0,0,60,80Zm126.77,20.84a8,8,0,0,0-.72,11.3,24,24,0,0,1,0,31.72,8,8,0,1,0,12,10.58,40,40,0,0,0,0-52.88A8,8,0,0,0,186.74,100.84Zm40.89-26.17a8,8,0,1,0-11.92,10.66,64,64,0,0,1,0,85.34,8,8,0,1,0,11.92,10.66,80,80,0,0,0,0-106.66Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M154.64,26.61a6,6,0,0,0-6.32.65L77.94,82H32A14,14,0,0,0,18,96v64a14,14,0,0,0,14,14H77.94l70.38,54.74A6,6,0,0,0,158,224V32A6,6,0,0,0,154.64,26.61ZM30,160V96a2,2,0,0,1,2-2H74v68H32A2,2,0,0,1,30,160Zm116,51.73L86,165.07V90.93l60-46.66Zm50.53-108.85a38,38,0,0,1,0,50.24,6,6,0,1,1-9-7.94,26,26,0,0,0,0-34.37,6,6,0,0,1,9-7.93ZM246,128a77.86,77.86,0,0,1-19.86,52,6,6,0,1,1-8.94-8,66,66,0,0,0,0-88,6,6,0,1,1,8.94-8A77.86,77.86,0,0,1,246,128Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM32,96H72v64H32ZM144,207.64,88,164.09V91.91l56-43.55Zm54-106.08a40,40,0,0,1,0,52.88,8,8,0,0,1-12-10.58,24,24,0,0,0,0-31.72,8,8,0,0,1,12-10.58ZM248,128a79.9,79.9,0,0,1-20.37,53.34,8,8,0,0,1-11.92-10.67,64,64,0,0,0,0-85.33,8,8,0,1,1,11.92-10.67A79.83,79.83,0,0,1,248,128Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M153.76,28.41a4,4,0,0,0-4.22.43L78.63,84H32A12,12,0,0,0,20,96v64a12,12,0,0,0,12,12H78.63l70.91,55.16A4.07,4.07,0,0,0,152,228a3.92,3.92,0,0,0,1.76-.41A4,4,0,0,0,156,224V32A4,4,0,0,0,153.76,28.41ZM28,160V96a4,4,0,0,1,4-4H76v72H32A4,4,0,0,1,28,160Zm120,55.82L84,166V90l64-49.78Zm47-111.61a36,36,0,0,1,0,47.59,4,4,0,1,1-6-5.3,28,28,0,0,0,0-37,4,4,0,0,1,6-5.28ZM244,128a75.88,75.88,0,0,1-19.35,50.67,4,4,0,0,1-6-5.34,68,68,0,0,0,0-90.66,4,4,0,0,1,6-5.34A75.88,75.88,0,0,1,244,128Z" }))
  ]
]);
const o$8 = reactExports.forwardRef((r2, a2) => reactExports.createElement(p, { ref: a2, ...r2, weights: e$g }));
o$8.displayName = "SpeakerHighIcon";
const a$a =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M125.18,156.94a64,64,0,1,0-82.36,0,100.23,100.23,0,0,0-39.49,32,12,12,0,0,0,19.35,14.2,76,76,0,0,1,122.64,0,12,12,0,0,0,19.36-14.2A100.33,100.33,0,0,0,125.18,156.94ZM44,108a40,40,0,1,1,40,40A40,40,0,0,1,44,108Zm206.1,97.67a12,12,0,0,1-16.78-2.57A76.31,76.31,0,0,0,172,172a12,12,0,0,1,0-24,40,40,0,1,0-10.3-78.67,12,12,0,1,1-6.16-23.19,64,64,0,0,1,57.64,110.8,100.23,100.23,0,0,1,39.49,32A12,12,0,0,1,250.1,205.67Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M136,108A52,52,0,1,1,84,56,52,52,0,0,1,136,108Z", opacity: "0.2" }), reactExports.createElement("path", { d: "M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M164.47,195.63a8,8,0,0,1-6.7,12.37H10.23a8,8,0,0,1-6.7-12.37,95.83,95.83,0,0,1,47.22-37.71,60,60,0,1,1,66.5,0A95.83,95.83,0,0,1,164.47,195.63Zm87.91-.15a95.87,95.87,0,0,0-47.13-37.56A60,60,0,0,0,144.7,54.59a4,4,0,0,0-1.33,6A75.83,75.83,0,0,1,147,150.53a4,4,0,0,0,1.07,5.53,112.32,112.32,0,0,1,29.85,30.83,23.92,23.92,0,0,1,3.65,16.47,4,4,0,0,0,3.95,4.64h60.3a8,8,0,0,0,7.73-5.93A8.22,8.22,0,0,0,252.38,195.48Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M112.6,158.43a58,58,0,1,0-57.2,0A93.83,93.83,0,0,0,5.21,196.72a6,6,0,0,0,10.05,6.56,82,82,0,0,1,137.48,0,6,6,0,0,0,10-6.56A93.83,93.83,0,0,0,112.6,158.43ZM38,108a46,46,0,1,1,46,46A46.06,46.06,0,0,1,38,108Zm211,97a6,6,0,0,1-8.3-1.74A81.8,81.8,0,0,0,172,166a6,6,0,0,1,0-12,46,46,0,1,0-17.08-88.73,6,6,0,1,1-4.46-11.14,58,58,0,0,1,50.14,104.3,93.83,93.83,0,0,1,50.19,38.29A6,6,0,0,1,249,205Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M107.19,159a56,56,0,1,0-46.38,0A91.83,91.83,0,0,0,6.88,197.81a4,4,0,1,0,6.7,4.37,84,84,0,0,1,140.84,0,4,4,0,1,0,6.7-4.37A91.83,91.83,0,0,0,107.19,159ZM36,108a48,48,0,1,1,48,48A48.05,48.05,0,0,1,36,108Zm212,95.35a4,4,0,0,1-5.53-1.17A83.81,83.81,0,0,0,172,164a4,4,0,0,1,0-8,48,48,0,1,0-17.82-92.58,4,4,0,1,1-3-7.43,56,56,0,0,1,44,103,91.83,91.83,0,0,1,53.93,38.86A4,4,0,0,1,248,203.35Z" }))
  ]
]);
const o$7 = reactExports.forwardRef((r2, s) => reactExports.createElement(p, { ref: s, ...r2, weights: a$a }));
o$7.displayName = "UsersIcon";
const a$9 =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M219.71,117.38a12,12,0,0,0-7.25-8.52L161.28,88.39l10.59-70.61a12,12,0,0,0-20.64-10l-112,120a12,12,0,0,0,4.31,19.33l51.18,20.47L84.13,238.22a12,12,0,0,0,20.64,10l112-120A12,12,0,0,0,219.71,117.38ZM113.6,203.55l6.27-41.77a12,12,0,0,0-7.41-12.92L68.74,131.37,142.4,52.45l-6.27,41.77a12,12,0,0,0,7.41,12.92l43.72,17.49Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M96,240l16-80L48,136,160,16,144,96l64,24Z", opacity: "0.2" }), reactExports.createElement("path", { d: "M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M213.85,125.46l-112,120a8,8,0,0,1-13.69-7l14.66-73.33L45.19,143.49a8,8,0,0,1-3-13l112-120a8,8,0,0,1,13.69,7L153.18,90.9l57.63,21.61a8,8,0,0,1,3,12.95Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M213.84,118.63a6,6,0,0,0-3.73-4.25L150.88,92.17l15-75a6,6,0,0,0-10.27-5.27l-112,120a6,6,0,0,0,2.28,9.71l59.23,22.21-15,75a6,6,0,0,0,3.14,6.52A6.07,6.07,0,0,0,96,246a6,6,0,0,0,4.39-1.91l112-120A6,6,0,0,0,213.84,118.63ZM106,220.46l11.85-59.28a6,6,0,0,0-3.77-6.8l-55.6-20.85,91.46-98L138.12,94.82a6,6,0,0,0,3.77,6.8l55.6,20.85Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M211.89,119.09a4,4,0,0,0-2.49-2.84l-60.81-22.8,15.33-76.67a4,4,0,0,0-6.84-3.51l-112,120a4,4,0,0,0-1,3.64,4,4,0,0,0,2.49,2.84l60.81,22.8L92.08,239.22a4,4,0,0,0,6.84,3.51l112-120A4,4,0,0,0,211.89,119.09ZM102.68,227l13.24-66.2a4,4,0,0,0-2.52-4.53L55,134.36,153.32,29l-13.24,66.2a4,4,0,0,0,2.52,4.53L201,121.64Z" }))
  ]
]);
const t$2 = reactExports.forwardRef((n, i) => reactExports.createElement(p, { ref: i, ...n, weights: a$9 }));
t$2.displayName = "LightningIcon";
const e$f =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M253.11,104.18,207.54,51.09A19.94,19.94,0,0,0,192.26,44H32A20,20,0,0,0,12,64V176a20,20,0,0,0,20,20H46.06a36,36,0,0,0,67.88,0h40.12a36,36,0,0,0,67.88,0H236a20,20,0,0,0,20-20V112A12.05,12.05,0,0,0,253.11,104.18ZM217.89,100H176V68h14.42ZM104,100V68h48v32ZM80,68v32H36V68Zm0,128a12,12,0,1,1,12-12A12,12,0,0,1,80,196Zm108,0a12,12,0,1,1,12-12A12,12,0,0,1,188,196Zm33.94-24a36,36,0,0,0-67.88,0H113.94a36,36,0,0,0-67.88,0H36V124H232v48Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M248,112v64a8,8,0,0,1-8,8H216a24,24,0,0,0-48,0H104a24,24,0,0,0-48,0H32a8,8,0,0,1-8-8V112Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M254.07,106.79,208.53,53.73A16,16,0,0,0,196.26,48H32A16,16,0,0,0,16,64V176a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V112A8,8,0,0,0,254.07,106.79ZM230.59,104H176V64h20.26ZM104,104V64h56v40ZM88,64v40H32V64ZM80,200a16,16,0,1,1,16-16A16,16,0,0,1,80,200Zm112,0a16,16,0,1,1,16-16A16,16,0,0,1,192,200Zm31-24a32,32,0,0,0-62,0H111a32,32,0,0,0-62,0H32V120H240v56Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M254.07,106.79,208.53,53.73A16,16,0,0,0,196.26,48H32A16,16,0,0,0,16,64V176a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V112A8,8,0,0,0,254.07,106.79ZM32,104V64H88v40Zm48,96a16,16,0,1,1,16-16A16,16,0,0,1,80,200Zm80-96H104V64h56Zm32,96a16,16,0,1,1,16-16A16,16,0,0,1,192,200Zm-16-96V64h20.26l34.33,40Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M252.55,108.09,207,55a14,14,0,0,0-10.74-5H32A14,14,0,0,0,18,64V176a14,14,0,0,0,14,14H50.6a30,30,0,0,0,58.8,0h53.2a30,30,0,0,0,58.8,0H240a14,14,0,0,0,14-14V112A6,6,0,0,0,252.55,108.09Zm-54.7-45.32L234.94,106H174V62h22.26A2,2,0,0,1,197.85,62.77ZM102,106V62h60v44ZM32,62H90v44H30V64A2,2,0,0,1,32,62ZM80,202a18,18,0,1,1,18-18A18,18,0,0,1,80,202Zm112,0a18,18,0,1,1,18-18A18,18,0,0,1,192,202Zm48-24H221.4a30,30,0,0,0-58.8,0H109.4a30,30,0,0,0-58.8,0H32a2,2,0,0,1-2-2V118H242v58A2,2,0,0,1,240,178Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M254.07,106.79,208.53,53.73A16,16,0,0,0,196.26,48H32A16,16,0,0,0,16,64V176a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V112A8,8,0,0,0,254.07,106.79ZM230.59,104H176V64h20.26ZM104,104V64h56v40ZM88,64v40H32V64ZM80,200a16,16,0,1,1,16-16A16,16,0,0,1,80,200Zm112,0a16,16,0,1,1,16-16A16,16,0,0,1,192,200Zm31-24a32,32,0,0,0-62,0H111a32,32,0,0,0-62,0H32V120H240v56Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M251,109.4,205.47,56.3a12,12,0,0,0-9.21-4.3H32A12,12,0,0,0,20,64V176a12,12,0,0,0,12,12H52.29a28,28,0,0,0,55.42,0h56.58a28,28,0,0,0,55.42,0H240a12,12,0,0,0,12-12V112A4,4,0,0,0,251,109.4ZM199.36,61.47,239.3,108H172V60h24.26A4,4,0,0,1,199.36,61.47ZM100,108V60h64v48ZM32,60H92v48H28V64A4,4,0,0,1,32,60ZM80,204a20,20,0,1,1,20-20A20,20,0,0,1,80,204Zm112,0a20,20,0,1,1,20-20A20,20,0,0,1,192,204Zm48-24H219.71a28,28,0,0,0-55.42,0H107.71a28,28,0,0,0-55.42,0H32a4,4,0,0,1-4-4V116H244v60A4,4,0,0,1,240,180Z" }))
  ]
]);
const a$8 = reactExports.forwardRef((e2, r2) => reactExports.createElement(p, { ref: r2, ...e2, weights: e$f }));
a$8.displayName = "VanIcon";
const e$e =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M196,136a16,16,0,1,1-16-16A16,16,0,0,1,196,136Zm40-36v80a32,32,0,0,1-32,32H60a32,32,0,0,1-32-32V60.92A32,32,0,0,1,60,28H192a12,12,0,0,1,0,24H60a8,8,0,0,0-8,8.26v.08A8.32,8.32,0,0,0,60.48,68H204A32,32,0,0,1,236,100Zm-24,0a8,8,0,0,0-8-8H60.48A33.72,33.72,0,0,1,52,90.92V180a8,8,0,0,0,8,8H204a8,8,0,0,0,8-8Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M224,80V192a8,8,0,0,1-8,8H56a16,16,0,0,1-16-16V56A16,16,0,0,0,56,72H216A8,8,0,0,1,224,80Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm-36,80a12,12,0,1,1,12-12A12,12,0,0,1,180,144Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,66H56a10,10,0,0,1,0-20H192a6,6,0,0,0,0-12H56A22,22,0,0,0,34,56V184a22,22,0,0,0,22,22H216a14,14,0,0,0,14-14V80A14,14,0,0,0,216,66Zm2,126a2,2,0,0,1-2,2H56a10,10,0,0,1-10-10V75.59A21.84,21.84,0,0,0,56,78H216a2,2,0,0,1,2,2Zm-28-60a10,10,0,1,1-10-10A10,10,0,0,1,190,132Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,68H56a12,12,0,0,1,0-24H192a4,4,0,0,0,0-8H56A20,20,0,0,0,36,56V184a20,20,0,0,0,20,20H216a12,12,0,0,0,12-12V80A12,12,0,0,0,216,68Zm4,124a4,4,0,0,1-4,4H56a12,12,0,0,1-12-12V72a19.86,19.86,0,0,0,12,4H216a4,4,0,0,1,4,4Zm-32-60a8,8,0,1,1-8-8A8,8,0,0,1,188,132Z" }))
  ]
]);
const o$6 = reactExports.forwardRef((t2, a2) => reactExports.createElement(p, { ref: a2, ...t2, weights: e$e }));
o$6.displayName = "WalletIcon";
const e$d =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M224,44H32A20,20,0,0,0,12,64V192a20,20,0,0,0,20,20H224a20,20,0,0,0,20-20V64A20,20,0,0,0,224,44Zm-4,144H183l-12.6-16.8A8,8,0,0,0,164,168H92a8,8,0,0,0-6.4,3.2L73,188H36V68H220ZM82,152h92a34,34,0,0,0,0-68H82a34,34,0,0,0,0,68Zm0-44a10,10,0,1,1-10,10A10,10,0,0,1,82,108Zm102,10a10,10,0,1,1-10-10A10,10,0,0,1,184,118Zm-42.5,10h-27a34.08,34.08,0,0,0,0-20h27a34.08,34.08,0,0,0,0,20Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M168,168l24,32H64l24-32Zm8-80a24,24,0,1,0,24,24A24,24,0,0,0,176,88Zm-72,24a24,24,0,1,0-24,24A24,24,0,0,0,104,112Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM80,192l12-16h72l12,16Zm144,0H196l-21.6-28.8A8,8,0,0,0,168,160H88a8,8,0,0,0-6.4,3.2L60,192H32V64H224V192ZM176,80H80a32,32,0,0,0,0,64h96a32,32,0,0,0,0-64ZM148.3,96a31.92,31.92,0,0,0,0,32H107.7a31.92,31.92,0,0,0,0-32ZM64,112a16,16,0,1,1,16,16A16,16,0,0,1,64,112Zm112,16a16,16,0,1,1,16-16A16,16,0,0,1,176,128Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M156.3,96a31.92,31.92,0,0,0,0,32H99.7a31.92,31.92,0,0,0,0-32ZM72,96a16,16,0,1,0,16,16A16,16,0,0,0,72,96ZM240,64V192a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V64A16,16,0,0,1,32,48H224A16,16,0,0,1,240,64ZM186,192l-15.6-20.8A8,8,0,0,0,164,168H92a8,8,0,0,0-6.4,3.2L70,192Zm30-80a32,32,0,0,0-32-32H72a32,32,0,0,0,0,64H184A32,32,0,0,0,216,112ZM184,96a16,16,0,1,0,16,16A16,16,0,0,0,184,96Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M224,50H32A14,14,0,0,0,18,64V192a14,14,0,0,0,14,14H224a14,14,0,0,0,14-14V64A14,14,0,0,0,224,50ZM76,194l15-20h74l15,20Zm150-2a2,2,0,0,1-2,2H195l-22.2-29.6A6,6,0,0,0,168,162H88a6,6,0,0,0-4.8,2.4L61,194H32a2,2,0,0,1-2-2V64a2,2,0,0,1,2-2H224a2,2,0,0,1,2,2ZM176,82H80a30,30,0,0,0,0,60h96a30,30,0,0,0,0-60ZM152,94a29.92,29.92,0,0,0,0,36H104a29.92,29.92,0,0,0,0-36ZM62,112a18,18,0,1,1,18,18A18,18,0,0,1,62,112Zm114,18a18,18,0,1,1,18-18A18,18,0,0,1,176,130Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM80,192l12-16h72l12,16Zm144,0H196l-21.6-28.8A8,8,0,0,0,168,160H88a8,8,0,0,0-6.4,3.2L60,192H32V64H224V192ZM176,80H80a32,32,0,0,0,0,64h96a32,32,0,0,0,0-64ZM148.3,96a31.92,31.92,0,0,0,0,32H107.7a31.92,31.92,0,0,0,0-32ZM64,112a16,16,0,1,1,16,16A16,16,0,0,1,64,112Zm112,16a16,16,0,1,1,16-16A16,16,0,0,1,176,128Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M224,52H32A12,12,0,0,0,20,64V192a12,12,0,0,0,12,12H224a12,12,0,0,0,12-12V64A12,12,0,0,0,224,52ZM72,196l18-24h76l18,24Zm156-4a4,4,0,0,1-4,4H194l-22.8-30.4A4,4,0,0,0,168,164H88a4,4,0,0,0-3.2,1.6L62,196H32a4,4,0,0,1-4-4V64a4,4,0,0,1,4-4H224a4,4,0,0,1,4,4ZM176,84H80a28,28,0,0,0,0,56h96a28,28,0,0,0,0-56ZM60,112a20,20,0,1,1,20,20A20,20,0,0,1,60,112Zm39.57,20a27.94,27.94,0,0,0,0-40h56.86a27.94,27.94,0,0,0,0,40ZM176,132a20,20,0,1,1,20-20A20,20,0,0,1,176,132Z" }))
  ]
]);
const t$1 = reactExports.forwardRef((a2, o2) => reactExports.createElement(p, { ref: o2, ...a2, weights: e$d }));
t$1.displayName = "CassetteTapeIcon";
const a$7 =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H136v48a8,8,0,0,1-16,0V136H72a8,8,0,0,1,0-16h48V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M222,128a6,6,0,0,1-6,6H134v82a6,6,0,0,1-12,0V134H40a6,6,0,0,1,0-12h82V40a6,6,0,0,1,12,0v82h82A6,6,0,0,1,222,128Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M220,128a4,4,0,0,1-4,4H132v84a4,4,0,0,1-8,0V132H40a4,4,0,0,1,0-8h84V40a4,4,0,0,1,8,0v84h84A4,4,0,0,1,220,128Z" }))
  ]
]);
const e$c = reactExports.forwardRef((r2, s) => reactExports.createElement(p, { ref: s, ...r2, weights: a$7 }));
e$c.displayName = "PlusIcon";
const a$6 =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M228,128a12,12,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12,12,0,0,1,228,128Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H72a8,8,0,0,1,0-16H184a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M222,128a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,128Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M220,128a4,4,0,0,1-4,4H40a4,4,0,0,1,0-8H216A4,4,0,0,1,220,128Z" }))
  ]
]);
const e$b = reactExports.forwardRef((r2, s) => reactExports.createElement(p, { ref: s, ...r2, weights: a$6 }));
e$b.displayName = "MinusIcon";
const a$5 =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M232,56V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M205.66,85.66l-96,96a8,8,0,0,1-11.32,0l-40-40a8,8,0,0,1,11.32-11.32L104,164.69l90.34-90.35a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM205.66,85.66l-96,96a8,8,0,0,1-11.32,0l-40-40a8,8,0,0,1,11.32-11.32L104,164.69l90.34-90.35a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M228.24,76.24l-128,128a6,6,0,0,1-8.48,0l-56-56a6,6,0,0,1,8.48-8.48L96,191.51,219.76,67.76a6,6,0,0,1,8.48,8.48Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M226.83,74.83l-128,128a4,4,0,0,1-5.66,0l-56-56a4,4,0,0,1,5.66-5.66L96,194.34,221.17,69.17a4,4,0,1,1,5.66,5.66Z" }))
  ]
]);
const o$5 = reactExports.forwardRef((c, r2) => reactExports.createElement(p, { ref: r2, ...c, weights: a$5 }));
o$5.displayName = "CheckIcon";
const a$4 =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M244,56v48a12,12,0,0,1-12,12H184a12,12,0,1,1,0-24H201.1l-19-17.38c-.13-.12-.26-.24-.38-.37A76,76,0,1,0,127,204h1a75.53,75.53,0,0,0,52.15-20.72,12,12,0,0,1,16.49,17.45A99.45,99.45,0,0,1,128,228h-1.37A100,100,0,1,1,198.51,57.06L220,76.72V56a12,12,0,0,1,24,0Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,128a88,88,0,1,1-88-88A88,88,0,0,1,216,128Z", opacity: "0.2" }), reactExports.createElement("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1-5.66-13.66l17-17-10.55-9.65-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,1,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60l10.93,10L226.34,50.3A8,8,0,0,1,240,56Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M238,56v48a6,6,0,0,1-6,6H184a6,6,0,0,1,0-12h32.55l-30.38-27.8c-.06-.06-.12-.13-.19-.19a82,82,0,1,0-1.7,117.65,6,6,0,0,1,8.24,8.73A93.46,93.46,0,0,1,128,222h-1.28A94,94,0,1,1,194.37,61.4L226,90.35V56a6,6,0,1,1,12,0Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M236,56v48a4,4,0,0,1-4,4H184a4,4,0,0,1,0-8h37.7L187.53,68.69l-.13-.12a84,84,0,1,0-1.75,120.51,4,4,0,0,1,5.5,5.82A91.43,91.43,0,0,1,128,220h-1.26A92,92,0,1,1,193,62.84l35,32.05V56a4,4,0,1,1,8,0Z" }))
  ]
]);
const r$2 = reactExports.forwardRef((e2, c) => reactExports.createElement(p, { ref: c, ...e2, weights: a$4 }));
r$2.displayName = "ArrowClockwiseIcon";
const e$a =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M204.73,51.85A108.07,108.07,0,0,0,20,128v56a28,28,0,0,0,28,28H64a28,28,0,0,0,28-28V144a28,28,0,0,0-28-28H44.84A84.05,84.05,0,0,1,128,44h.64a83.7,83.7,0,0,1,82.52,72H192a28,28,0,0,0-28,28v40a28,28,0,0,0,28,28h16a28,28,0,0,0,28-28V128A107.34,107.34,0,0,0,204.73,51.85ZM64,140a4,4,0,0,1,4,4v40a4,4,0,0,1-4,4H48a4,4,0,0,1-4-4V140Zm148,44a4,4,0,0,1-4,4H192a4,4,0,0,1-4-4V144a4,4,0,0,1,4-4h20Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M80,144v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V128H64A16,16,0,0,1,80,144Zm112-16a16,16,0,0,0-16,16v40a16,16,0,0,0,16,16h16a16,16,0,0,0,16-16V128Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M201.89,54.66A104.08,104.08,0,0,0,24,128v56a24,24,0,0,0,24,24H64a24,24,0,0,0,24-24V144a24,24,0,0,0-24-24H40.36A88,88,0,0,1,128,40h.67a87.71,87.71,0,0,1,87,80H192a24,24,0,0,0-24,24v40a24,24,0,0,0,24,24h16a24,24,0,0,0,24-24V128A103.41,103.41,0,0,0,201.89,54.66ZM64,136a8,8,0,0,1,8,8v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V136Zm152,48a8,8,0,0,1-8,8H192a8,8,0,0,1-8-8V144a8,8,0,0,1,8-8h24Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M232,128v56a24,24,0,0,1-24,24H192a24,24,0,0,1-24-24V144a24,24,0,0,1,24-24h23.65a87.71,87.71,0,0,0-87-80H128a88,88,0,0,0-87.64,80H64a24,24,0,0,1,24,24v40a24,24,0,0,1-24,24H48a24,24,0,0,1-24-24V128A104.11,104.11,0,0,1,201.89,54.66,103.41,103.41,0,0,1,232,128Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M200.47,56.07A101.37,101.37,0,0,0,128.77,26H128A102,102,0,0,0,26,128v56a22,22,0,0,0,22,22H64a22,22,0,0,0,22-22V144a22,22,0,0,0-22-22H38.2A90.12,90.12,0,0,1,192,64.52,89.41,89.41,0,0,1,217.81,122H192a22,22,0,0,0-22,22v40a22,22,0,0,0,22,22h16a22,22,0,0,0,22-22V128A101.44,101.44,0,0,0,200.47,56.07ZM64,134a10,10,0,0,1,10,10v40a10,10,0,0,1-10,10H48a10,10,0,0,1-10-10V134Zm154,50a10,10,0,0,1-10,10H192a10,10,0,0,1-10-10V144a10,10,0,0,1,10-10h26Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M201.89,54.66A103.43,103.43,0,0,0,128.79,24H128A104,104,0,0,0,24,128v56a24,24,0,0,0,24,24H64a24,24,0,0,0,24-24V144a24,24,0,0,0-24-24H40.36A88,88,0,0,1,128,40h.67a87.71,87.71,0,0,1,87,80H192a24,24,0,0,0-24,24v40a24,24,0,0,0,24,24h16a24,24,0,0,0,24-24V128A103.41,103.41,0,0,0,201.89,54.66ZM64,136a8,8,0,0,1,8,8v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V136Zm152,48a8,8,0,0,1-8,8H192a8,8,0,0,1-8-8V144a8,8,0,0,1,8-8h24Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M199.05,57.48A100.07,100.07,0,0,0,28,128v56a20,20,0,0,0,20,20H64a20,20,0,0,0,20-20V144a20,20,0,0,0-20-20H36.08A92,92,0,0,1,128,36h.7a91.75,91.75,0,0,1,91.22,88H192a20,20,0,0,0-20,20v40a20,20,0,0,0,20,20h16a20,20,0,0,0,20-20V128A99.43,99.43,0,0,0,199.05,57.48ZM64,132a12,12,0,0,1,12,12v40a12,12,0,0,1-12,12H48a12,12,0,0,1-12-12V132Zm156,52a12,12,0,0,1-12,12H192a12,12,0,0,1-12-12V144a12,12,0,0,1,12-12h28Z" }))
  ]
]);
const o$4 = reactExports.forwardRef((a2, r2) => reactExports.createElement(p, { ref: r2, ...a2, weights: e$a }));
o$4.displayName = "HeadphonesIcon";
const e$9 =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,44H40A20,20,0,0,0,20,64V224A19.82,19.82,0,0,0,31.56,242.1a20.14,20.14,0,0,0,8.49,1.9,19.91,19.91,0,0,0,12.82-4.72l.12-.11L84.47,212H216a20,20,0,0,0,20-20V64A20,20,0,0,0,216,44Zm-4,144H80a11.93,11.93,0,0,0-7.84,2.92L44,215.23V68H212ZM84,108A12,12,0,0,1,96,96h64a12,12,0,1,1,0,24H96A12,12,0,0,1,84,108Zm0,40a12,12,0,0,1,12-12h64a12,12,0,0,1,0,24H96A12,12,0,0,1,84,148Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M224,64V192a8,8,0,0,1-8,8H80L45.15,230.11A8,8,0,0,1,32,224V64a8,8,0,0,1,8-8H216A8,8,0,0,1,224,64Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M216,48H40A16,16,0,0,0,24,64V224a15.85,15.85,0,0,0,9.24,14.5A16.13,16.13,0,0,0,40,240a15.89,15.89,0,0,0,10.25-3.78l.09-.07L83,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,224h0ZM216,192H80a8,8,0,0,0-5.23,1.95L40,224V64H216ZM88,112a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm0,32a8,8,0,0,1,8-8h64a8,8,0,1,1,0,16H96A8,8,0,0,1,88,144Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,48H40A16,16,0,0,0,24,64V224a15.84,15.84,0,0,0,9.25,14.5A16.05,16.05,0,0,0,40,240a15.89,15.89,0,0,0,10.25-3.78l.09-.07L83,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM160,152H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm0-32H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,50H40A14,14,0,0,0,26,64V224a13.88,13.88,0,0,0,8.09,12.69A14.11,14.11,0,0,0,40,238a13.87,13.87,0,0,0,9-3.31l.06-.05L82.23,206H216a14,14,0,0,0,14-14V64A14,14,0,0,0,216,50Zm2,142a2,2,0,0,1-2,2H80a6,6,0,0,0-3.92,1.46L41.26,225.53A2,2,0,0,1,38,224V64a2,2,0,0,1,2-2H216a2,2,0,0,1,2,2Zm-52-80a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,112Zm0,32a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,144Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,48H40A16,16,0,0,0,24,64V224a15.85,15.85,0,0,0,9.24,14.5A16.13,16.13,0,0,0,40,240a15.89,15.89,0,0,0,10.25-3.78l.09-.07L83,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,224h0ZM216,192H80a8,8,0,0,0-5.23,1.95L40,224V64H216ZM88,112a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm0,32a8,8,0,0,1,8-8h64a8,8,0,1,1,0,16H96A8,8,0,0,1,88,144Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,52H40A12,12,0,0,0,28,64V224a11.89,11.89,0,0,0,6.93,10.88A12.17,12.17,0,0,0,40,236a11.89,11.89,0,0,0,7.69-2.83l0,0L81.49,204H216a12,12,0,0,0,12-12V64A12,12,0,0,0,216,52Zm4,140a4,4,0,0,1-4,4H80a4,4,0,0,0-2.62,1L42.56,227.06A4,4,0,0,1,36,224V64a4,4,0,0,1,4-4H216a4,4,0,0,1,4,4Zm-56-80a4,4,0,0,1-4,4H96a4,4,0,0,1,0-8h64A4,4,0,0,1,164,112Zm0,32a4,4,0,0,1-4,4H96a4,4,0,0,1,0-8h64A4,4,0,0,1,164,144Z" }))
  ]
]);
const e$8 = reactExports.forwardRef((o2, a2) => reactExports.createElement(p, { ref: a2, ...o2, weights: e$9 }));
e$8.displayName = "ChatTextIcon";
const a$3 =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M192,112a80,80,0,1,1-80-80A80,80,0,0,1,192,112Z", opacity: "0.2" }), reactExports.createElement("path", { d: "M229.66,218.34,179.6,168.28a88.21,88.21,0,1,0-11.32,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M168,112a56,56,0,1,1-56-56A56,56,0,0,1,168,112Zm61.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88,88,0,1,1,11.32-11.31l50.06,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M228.24,219.76l-51.38-51.38a86.15,86.15,0,1,0-8.48,8.48l51.38,51.38a6,6,0,0,0,8.48-8.48ZM38,112a74,74,0,1,1,74,74A74.09,74.09,0,0,1,38,112Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M226.83,221.17l-52.7-52.7a84.1,84.1,0,1,0-5.66,5.66l52.7,52.7a4,4,0,0,0,5.66-5.66ZM36,112a76,76,0,1,1,76,76A76.08,76.08,0,0,1,36,112Z" }))
  ]
]);
const o$3 = reactExports.forwardRef((s, n) => reactExports.createElement(p, { ref: n, ...s, weights: a$3 }));
o$3.displayName = "MagnifyingGlassIcon";
const l =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M128,76a52,52,0,1,0,52,52A52.06,52.06,0,0,0,128,76Zm0,80a28,28,0,1,1,28-28A28,28,0,0,1,128,156Zm113.86-49.57A12,12,0,0,0,236,98.34L208.21,82.49l-.11-31.31a12,12,0,0,0-4.25-9.12,116,116,0,0,0-38-21.41,12,12,0,0,0-9.68.89L128,37.27,99.83,21.53a12,12,0,0,0-9.7-.9,116.06,116.06,0,0,0-38,21.47,12,12,0,0,0-4.24,9.1l-.14,31.34L20,98.35a12,12,0,0,0-5.85,8.11,110.7,110.7,0,0,0,0,43.11A12,12,0,0,0,20,157.66l27.82,15.85.11,31.31a12,12,0,0,0,4.25,9.12,116,116,0,0,0,38,21.41,12,12,0,0,0,9.68-.89L128,218.73l28.14,15.74a12,12,0,0,0,9.7.9,116.06,116.06,0,0,0,38-21.47,12,12,0,0,0,4.24-9.1l.14-31.34,27.81-15.81a12,12,0,0,0,5.85-8.11A110.7,110.7,0,0,0,241.86,106.43Zm-22.63,33.18-26.88,15.28a11.94,11.94,0,0,0-4.55,4.59c-.54,1-1.11,1.93-1.7,2.88a12,12,0,0,0-1.83,6.31L184.13,199a91.83,91.83,0,0,1-21.07,11.87l-27.15-15.19a12,12,0,0,0-5.86-1.53h-.29c-1.14,0-2.3,0-3.44,0a12.08,12.08,0,0,0-6.14,1.51L93,210.82A92.27,92.27,0,0,1,71.88,199l-.11-30.24a12,12,0,0,0-1.83-6.32c-.58-.94-1.16-1.91-1.7-2.88A11.92,11.92,0,0,0,63.7,155L36.8,139.63a86.53,86.53,0,0,1,0-23.24l26.88-15.28a12,12,0,0,0,4.55-4.58c.54-1,1.11-1.94,1.7-2.89a12,12,0,0,0,1.83-6.31L71.87,57A91.83,91.83,0,0,1,92.94,45.17l27.15,15.19a11.92,11.92,0,0,0,6.15,1.52c1.14,0,2.3,0,3.44,0a12.08,12.08,0,0,0,6.14-1.51L163,45.18A92.27,92.27,0,0,1,184.12,57l.11,30.24a12,12,0,0,0,1.83,6.32c.58.94,1.16,1.91,1.7,2.88A11.92,11.92,0,0,0,192.3,101l26.9,15.33A86.53,86.53,0,0,1,219.23,139.61Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M230.1,108.76,198.25,90.62c-.64-1.16-1.31-2.29-2-3.41l-.12-36A104.61,104.61,0,0,0,162,32L130,49.89c-1.34,0-2.69,0-4,0L94,32A104.58,104.58,0,0,0,59.89,51.25l-.16,36c-.7,1.12-1.37,2.26-2,3.41l-31.84,18.1a99.15,99.15,0,0,0,0,38.46l31.85,18.14c.64,1.16,1.31,2.29,2,3.41l.12,36A104.61,104.61,0,0,0,94,224l32-17.87c1.34,0,2.69,0,4,0L162,224a104.58,104.58,0,0,0,34.08-19.25l.16-36c.7-1.12,1.37-2.26,2-3.41l31.84-18.1A99.15,99.15,0,0,0,230.1,108.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A111.92,111.92,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.63a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Zm-15,34.91-28.57,16.25a8,8,0,0,0-3,3c-.58,1-1.19,2.06-1.81,3.06a7.94,7.94,0,0,0-1.22,4.21l-.15,32.25a95.89,95.89,0,0,1-25.37,14.3L134,199.13a8,8,0,0,0-3.91-1h-.19c-1.21,0-2.43,0-3.64,0a8.1,8.1,0,0,0-4.1,1l-28.84,16.1A96,96,0,0,1,67.88,201l-.11-32.2a8,8,0,0,0-1.22-4.22c-.62-1-1.23-2-1.8-3.06a8.09,8.09,0,0,0-3-3.06l-28.6-16.29a90.49,90.49,0,0,1,0-28.26L61.67,97.63a8,8,0,0,0,3-3c.58-1,1.19-2.06,1.81-3.06a7.94,7.94,0,0,0,1.22-4.21l.15-32.25a95.89,95.89,0,0,1,25.37-14.3L122,56.87a8,8,0,0,0,4.1,1c1.21,0,2.43,0,3.64,0a8,8,0,0,0,4.1-1l28.84-16.1A96,96,0,0,1,188.12,55l.11,32.2a8,8,0,0,0,1.22,4.22c.62,1,1.23,2,1.8,3.06a8.09,8.09,0,0,0,3,3.06l28.6,16.29A90.49,90.49,0,0,1,222.9,142.12Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M237.94,107.21a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A111.92,111.92,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.63a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M128,82a46,46,0,1,0,46,46A46.06,46.06,0,0,0,128,82Zm0,80a34,34,0,1,1,34-34A34,34,0,0,1,128,162Zm108-54.4a6,6,0,0,0-2.92-4L202.64,86.22l-.42-.71L202.1,51.2A6,6,0,0,0,200,46.64a110.12,110.12,0,0,0-36.07-20.31,6,6,0,0,0-4.84.45L128.46,43.86h-1L96.91,26.76a6,6,0,0,0-4.86-.44A109.92,109.92,0,0,0,56,46.68a6,6,0,0,0-2.12,4.55l-.16,34.34c-.14.23-.28.47-.41.71L22.91,103.57A6,6,0,0,0,20,107.62a104.81,104.81,0,0,0,0,40.78,6,6,0,0,0,2.92,4l30.42,17.33.42.71.12,34.31A6,6,0,0,0,56,209.36a110.12,110.12,0,0,0,36.07,20.31,6,6,0,0,0,4.84-.45l30.61-17.08h1l30.56,17.1A6.09,6.09,0,0,0,162,230a5.83,5.83,0,0,0,1.93-.32,109.92,109.92,0,0,0,36-20.36,6,6,0,0,0,2.12-4.55l.16-34.34c.14-.23.28-.47.41-.71l30.42-17.29a6,6,0,0,0,2.92-4.05A104.81,104.81,0,0,0,236,107.6Zm-11.25,35.79L195.32,160.1a6.07,6.07,0,0,0-2.28,2.3c-.59,1-1.21,2.11-1.86,3.14a6,6,0,0,0-.91,3.16l-.16,33.21a98.15,98.15,0,0,1-27.52,15.53L133,200.88a6,6,0,0,0-2.93-.77h-.14c-1.24,0-2.5,0-3.74,0a6,6,0,0,0-3.07.76L93.45,217.43a98,98,0,0,1-27.56-15.49l-.12-33.17a6,6,0,0,0-.91-3.16c-.64-1-1.27-2.08-1.86-3.14a6,6,0,0,0-2.27-2.3L31.3,143.4a93,93,0,0,1,0-30.79L60.68,95.9A6.07,6.07,0,0,0,63,93.6c.59-1,1.21-2.11,1.86-3.14a6,6,0,0,0,.91-3.16l.16-33.21A98.15,98.15,0,0,1,93.41,38.56L123,55.12a5.81,5.81,0,0,0,3.07.76c1.24,0,2.5,0,3.74,0a6,6,0,0,0,3.07-.76l29.65-16.56a98,98,0,0,1,27.56,15.49l.12,33.17a6,6,0,0,0,.91,3.16c.64,1,1.27,2.08,1.86,3.14a6,6,0,0,0,2.27,2.3L224.7,112.6A93,93,0,0,1,224.73,143.39Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A112.1,112.1,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.62a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Zm-15,34.91-28.57,16.25a8,8,0,0,0-3,3c-.58,1-1.19,2.06-1.81,3.06a7.94,7.94,0,0,0-1.22,4.21l-.15,32.25a95.89,95.89,0,0,1-25.37,14.3L134,199.13a8,8,0,0,0-3.91-1h-.19c-1.21,0-2.43,0-3.64,0a8.08,8.08,0,0,0-4.1,1l-28.84,16.1A96,96,0,0,1,67.88,201l-.11-32.2a8,8,0,0,0-1.22-4.22c-.62-1-1.23-2-1.8-3.06a8.09,8.09,0,0,0-3-3.06l-28.6-16.29a90.49,90.49,0,0,1,0-28.26L61.67,97.63a8,8,0,0,0,3-3c.58-1,1.19-2.06,1.81-3.06a7.94,7.94,0,0,0,1.22-4.21l.15-32.25a95.89,95.89,0,0,1,25.37-14.3L122,56.87a8,8,0,0,0,4.1,1c1.21,0,2.43,0,3.64,0a8.08,8.08,0,0,0,4.1-1l28.84-16.1A96,96,0,0,1,188.12,55l.11,32.2a8,8,0,0,0,1.22,4.22c.62,1,1.23,2,1.8,3.06a8.09,8.09,0,0,0,3,3.06l28.6,16.29A90.49,90.49,0,0,1,222.9,142.12Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M128,84a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,84Zm0,80a36,36,0,1,1,36-36A36,36,0,0,1,128,164Zm106-56a4,4,0,0,0-2-2.7l-30.89-17.6q-.47-.82-1-1.62L200.1,51.2a3.94,3.94,0,0,0-1.42-3,107.8,107.8,0,0,0-35.41-19.94,4,4,0,0,0-3.23.29L129,45.87h-2l-31-17.36a4,4,0,0,0-3.23-.3,108.05,108.05,0,0,0-35.39,20,4,4,0,0,0-1.41,3l-.16,34.9-1,1.62L23.9,105.3A4,4,0,0,0,22,108a102.76,102.76,0,0,0,0,40,4,4,0,0,0,1.95,2.7l30.89,17.6q.47.83,1,1.62l.12,34.87a3.94,3.94,0,0,0,1.42,3,107.8,107.8,0,0,0,35.41,19.94,4,4,0,0,0,3.23-.29L127,210.13h2l31,17.36a4,4,0,0,0,3.23.3,108.05,108.05,0,0,0,35.39-20,4,4,0,0,0,1.41-3l.16-34.9,1-1.62L232.1,150.7a4,4,0,0,0,2-2.71A102.76,102.76,0,0,0,234,108Zm-7.48,36.67L196.3,161.84a4,4,0,0,0-1.51,1.53c-.61,1.09-1.25,2.17-1.91,3.24a3.92,3.92,0,0,0-.61,2.1l-.16,34.15a99.8,99.8,0,0,1-29.7,16.77l-30.4-17a4.06,4.06,0,0,0-2-.51H130c-1.28,0-2.57,0-3.84,0a4.1,4.1,0,0,0-2.05.51l-30.45,17A100.23,100.23,0,0,1,63.89,202.9l-.12-34.12a3.93,3.93,0,0,0-.61-2.11c-.66-1-1.3-2.14-1.91-3.23a4,4,0,0,0-1.51-1.53L29.49,144.68a94.78,94.78,0,0,1,0-33.34L59.7,94.16a4,4,0,0,0,1.51-1.53c.61-1.09,1.25-2.17,1.91-3.23a4,4,0,0,0,.61-2.11l.16-34.15a99.8,99.8,0,0,1,29.7-16.77l30.4,17a4.1,4.1,0,0,0,2.05.51c1.28,0,2.57,0,3.84,0a4,4,0,0,0,2.05-.51l30.45-17A100.23,100.23,0,0,1,192.11,53.1l.12,34.12a3.93,3.93,0,0,0,.61,2.11c.66,1,1.3,2.14,1.91,3.23a4,4,0,0,0,1.51,1.53l30.25,17.23A94.78,94.78,0,0,1,226.54,144.66Z" }))
  ]
]);
const o$2 = reactExports.forwardRef((r2, a2) => reactExports.createElement(p, { ref: a2, ...r2, weights: l }));
o$2.displayName = "GearSixIcon";
const e$7 =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M128,84a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,84Zm0,64a20,20,0,1,1,20-20A20,20,0,0,1,128,148Zm77.39,12.7A83.94,83.94,0,0,1,190.61,184a12,12,0,0,1-17.89-16,59.92,59.92,0,0,0,0-80,12,12,0,0,1,17.89-16,84.07,84.07,0,0,1,14.78,88.7ZM83.28,168a12,12,0,0,1-17.89,16,83.94,83.94,0,0,1,0-112A12,12,0,0,1,83.28,88a59.92,59.92,0,0,0,0,80ZM252,128a123.63,123.63,0,0,1-35.43,86.78A12,12,0,1,1,199.43,198a99.88,99.88,0,0,0,0-140,12,12,0,0,1,17.14-16.8A123.63,123.63,0,0,1,252,128ZM56.57,198a12,12,0,0,1-17.14,16.8,123.89,123.89,0,0,1,0-173.56A12,12,0,0,1,56.57,58a99.88,99.88,0,0,0,0,140Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M160,128a32,32,0,1,1-32-32A32,32,0,0,1,160,128Z", opacity: "0.2" }), reactExports.createElement("path", { d: "M128,88a40,40,0,1,0,40,40A40,40,0,0,0,128,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,152Zm73.71,7.14a80,80,0,0,1-14.08,22.2,8,8,0,0,1-11.92-10.67,63.95,63.95,0,0,0,0-85.33,8,8,0,1,1,11.92-10.67,80.08,80.08,0,0,1,14.08,84.47ZM69,103.09a64,64,0,0,0,11.26,67.58,8,8,0,0,1-11.92,10.67,79.93,79.93,0,0,1,0-106.67A8,8,0,1,1,80.29,85.34,63.77,63.77,0,0,0,69,103.09ZM248,128a119.58,119.58,0,0,1-34.29,84,8,8,0,1,1-11.42-11.2,103.9,103.9,0,0,0,0-145.56A8,8,0,1,1,213.71,44,119.58,119.58,0,0,1,248,128ZM53.71,200.78A8,8,0,1,1,42.29,212a119.87,119.87,0,0,1,0-168,8,8,0,1,1,11.42,11.2,103.9,103.9,0,0,0,0,145.56Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M168,128a40,40,0,1,1-40-40A40,40,0,0,1,168,128Zm40,0a79.74,79.74,0,0,0-20.37-53.33,8,8,0,1,0-11.92,10.67,64,64,0,0,1,0,85.33,8,8,0,0,0,11.92,10.67A79.79,79.79,0,0,0,208,128ZM80.29,85.34A8,8,0,1,0,68.37,74.67a79.94,79.94,0,0,0,0,106.67,8,8,0,0,0,11.92-10.67,63.95,63.95,0,0,1,0-85.33Zm158.28-4A119.48,119.48,0,0,0,213.71,44a8,8,0,1,0-11.42,11.2,103.9,103.9,0,0,1,0,145.56A8,8,0,1,0,213.71,212,120.12,120.12,0,0,0,238.57,81.29ZM32.17,168.48A103.9,103.9,0,0,1,53.71,55.22,8,8,0,1,0,42.29,44a119.87,119.87,0,0,0,0,168,8,8,0,1,0,11.42-11.2A103.61,103.61,0,0,1,32.17,168.48Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M128,90a38,38,0,1,0,38,38A38,38,0,0,0,128,90Zm0,64a26,26,0,1,1,26-26A26,26,0,0,1,128,154Zm78-26a77.74,77.74,0,0,1-19.86,52,6,6,0,0,1-8.94-8,65.93,65.93,0,0,0,0-88,6,6,0,1,1,8.94-8A77.74,77.74,0,0,1,206,128ZM67.18,102.31A65.93,65.93,0,0,0,78.8,172a6,6,0,0,1-.47,8.47,6,6,0,0,1-8.47-.47,77.93,77.93,0,0,1,0-104,6,6,0,1,1,8.94,8A66.21,66.21,0,0,0,67.18,102.31ZM246,128a117.71,117.71,0,0,1-33.71,82.58,6,6,0,0,1-8.58-8.4,105.88,105.88,0,0,0,0-148.36,6,6,0,0,1,8.58-8.4A117.71,117.71,0,0,1,246,128ZM52.29,202.18a6,6,0,0,1-8.58,8.4,117.92,117.92,0,0,1,0-165.16,6,6,0,1,1,8.58,8.4,105.88,105.88,0,0,0,0,148.36Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M128,88a40,40,0,1,0,40,40A40,40,0,0,0,128,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,152Zm73.71,7.14a80,80,0,0,1-14.08,22.2,8,8,0,0,1-11.92-10.67,63.95,63.95,0,0,0,0-85.33,8,8,0,1,1,11.92-10.67,80.08,80.08,0,0,1,14.08,84.47ZM69,103.09a64,64,0,0,0,11.26,67.58,8,8,0,0,1-11.92,10.67,79.93,79.93,0,0,1,0-106.67A8,8,0,1,1,80.29,85.34,63.77,63.77,0,0,0,69,103.09ZM248,128a119.58,119.58,0,0,1-34.29,84,8,8,0,1,1-11.42-11.2,103.9,103.9,0,0,0,0-145.56A8,8,0,1,1,213.71,44,119.58,119.58,0,0,1,248,128ZM53.71,200.78A8,8,0,1,1,42.29,212a119.87,119.87,0,0,1,0-168,8,8,0,1,1,11.42,11.2,103.9,103.9,0,0,0,0,145.56Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M128,92a36,36,0,1,0,36,36A36,36,0,0,0,128,92Zm0,64a28,28,0,1,1,28-28A28,28,0,0,1,128,156Zm76-28a75.74,75.74,0,0,1-19.35,50.67,4,4,0,0,1-6-5.34,67.92,67.92,0,0,0,0-90.66,4,4,0,0,1,6-5.34A75.74,75.74,0,0,1,204,128ZM65.34,101.53a67.92,67.92,0,0,0,12,71.8,4,4,0,0,1-6,5.34,75.93,75.93,0,0,1,0-101.34,4,4,0,1,1,6,5.34A68,68,0,0,0,65.34,101.53ZM244,128a115.68,115.68,0,0,1-33.14,81.18,4,4,0,0,1-5.72-5.6,107.89,107.89,0,0,0,0-151.16,4,4,0,0,1,5.72-5.6A115.68,115.68,0,0,1,244,128ZM50.86,203.58a4,4,0,0,1-5.72,5.6,115.91,115.91,0,0,1,0-162.36,4,4,0,1,1,5.72,5.6,107.89,107.89,0,0,0,0,151.16Z" }))
  ]
]);
const a$2 = reactExports.forwardRef((r2, t2) => reactExports.createElement(p, { ref: t2, ...r2, weights: e$7 }));
a$2.displayName = "BroadcastIcon";
const a$1 =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M238.7,102.46,62.81,37.21l-.25-.09A20,20,0,0,0,37.12,62.56l.09.25L102.46,238.7A20,20,0,0,0,121.3,252h.35a20,20,0,0,0,18.77-14.12l.09-.29,21.23-75.85,75.85-21.23.29-.09a20,20,0,0,0,.82-38Zm-89.93,38a12,12,0,0,0-8.32,8.32l-19.68,70.29L62.8,62.8l156.26,58Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M234.35,129,152,152,129,234.35a8,8,0,0,1-15.21.27l-65.28-176A8,8,0,0,1,58.63,48.46l176,65.28A8,8,0,0,1,234.35,129Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M237.33,106.21,61.41,41l-.16-.05A16,16,0,0,0,40.9,61.25a1,1,0,0,0,.05.16l65.26,175.92A15.77,15.77,0,0,0,121.28,248h.3a15.77,15.77,0,0,0,15-11.29l.06-.2,21.84-78,78-21.84.2-.06a16,16,0,0,0,.62-30.38ZM149.84,144.3a8,8,0,0,0-5.54,5.54L121.3,232l-.06-.17L56,56l175.82,65.22.16.06Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M248,121.58a15.76,15.76,0,0,1-11.29,15l-.2.06-78,21.84-21.84,78-.06.2a15.77,15.77,0,0,1-15,11.29h-.3a15.77,15.77,0,0,1-15.07-10.67L41,61.41a1,1,0,0,1-.05-.16A16,16,0,0,1,61.25,40.9l.16.05,175.92,65.26A15.78,15.78,0,0,1,248,121.58Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M236.65,108.1,60.72,42.83l-.13,0A14,14,0,0,0,42.78,60.59s0,.09,0,.13L108.1,236.65A13.77,13.77,0,0,0,121.28,246h.26a13.8,13.8,0,0,0,13.14-9.88l0-.15,22.14-79.1L236,134.73l.15,0a14,14,0,0,0,.53-26.58Zm-4,15.1-82.26,23a6,6,0,0,0-4.16,4.16l-23,82.26a1.85,1.85,0,0,1-1.86,1.36,1.82,1.82,0,0,1-1.92-1.35.61.61,0,0,0,0-.12L54.11,56.62a2,2,0,0,1,2.51-2.51l175.91,65.26.12,0a2,2,0,0,1,0,3.79Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M237.33,106.21,61.41,41l-.16-.05A16,16,0,0,0,40.9,61.25a1,1,0,0,0,.05.16l65.26,175.92A15.77,15.77,0,0,0,121.28,248h.3a15.77,15.77,0,0,0,15-11.29l.06-.2,21.84-78,78-21.84.2-.06a16,16,0,0,0,.62-30.38ZM149.84,144.3a8,8,0,0,0-5.54,5.54L121.3,232l-.06-.17L56,56l175.82,65.22.16.06Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M236,110,59.93,44.67A12,12,0,0,0,44.69,60L110,235.93A11.83,11.83,0,0,0,121.28,244h.22a11.82,11.82,0,0,0,11.26-8.47l0-.1,22.45-80.19,80.19-22.44.1,0A12,12,0,0,0,236,110Zm-2.79,15.12-82.3,23a4,4,0,0,0-2.78,2.77l-23,82.3a3.88,3.88,0,0,1-3.74,2.78,4,4,0,0,1-3.88-2.77L52.22,57.32a3.93,3.93,0,0,1,1-4.14A4,4,0,0,1,56,52a3.86,3.86,0,0,1,1.25.21l176.08,65.32a4,4,0,0,1-.09,7.59Z" }))
  ]
]);
const r$1 = reactExports.forwardRef((a2, t2) => reactExports.createElement(p, { ref: t2, ...a2, weights: a$1 }));
r$1.displayName = "NavigationArrowIcon";
const e$6 =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M224,154.8l-47.09-21.11-.18-.08a19.94,19.94,0,0,0-19,1.75,13.08,13.08,0,0,0-1.12.84l-22.31,19c-13-7.05-26.43-20.37-33.49-33.21l19.06-22.66a11.76,11.76,0,0,0,.85-1.15,20,20,0,0,0,1.66-18.83,1.42,1.42,0,0,1-.08-.18L101.2,32A20.06,20.06,0,0,0,80.42,20.15,60.27,60.27,0,0,0,28,80c0,81.61,66.39,148,148,148a60.27,60.27,0,0,0,59.85-52.42A20.06,20.06,0,0,0,224,154.8ZM176,204A124.15,124.15,0,0,1,52,80,36.29,36.29,0,0,1,80.48,44.46l18.82,42L80.14,109.28a12,12,0,0,0-.86,1.16A20,20,0,0,0,78,130.08c9.42,19.28,28.83,38.56,48.31,48A20,20,0,0,0,146,176.63a11.63,11.63,0,0,0,1.11-.85l22.43-19.07,42,18.81A36.29,36.29,0,0,1,176,204Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M223.94,174.08A48.33,48.33,0,0,1,176,216,136,136,0,0,1,40,80,48.33,48.33,0,0,1,81.92,32.06a8,8,0,0,1,8.3,4.8l21.13,47.2a8,8,0,0,1-.66,7.53L89.32,117a7.93,7.93,0,0,0-.54,7.81c8.27,16.93,25.77,34.22,42.75,42.41a7.92,7.92,0,0,0,7.83-.59l25-21.3a8,8,0,0,1,7.59-.69l47.16,21.13A8,8,0,0,1,223.94,174.08Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M231.88,175.08A56.26,56.26,0,0,1,176,224C96.6,224,32,159.4,32,80A56.26,56.26,0,0,1,80.92,24.12a16,16,0,0,1,16.62,9.52l21.12,47.15,0,.12A16,16,0,0,1,117.39,96c-.18.27-.37.52-.57.77L96,121.45c7.49,15.22,23.41,31,38.83,38.51l24.34-20.71a8.12,8.12,0,0,1,.75-.56,16,16,0,0,1,15.17-1.4l.13.06,47.11,21.11A16,16,0,0,1,231.88,175.08Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M221.59,160.3l-47.24-21.17a14,14,0,0,0-13.28,1.22,4.81,4.81,0,0,0-.56.42l-24.69,21a1.88,1.88,0,0,1-1.68.06c-15.87-7.66-32.31-24-40-39.65a1.91,1.91,0,0,1,0-1.68l21.07-25a6.13,6.13,0,0,0,.42-.58,14,14,0,0,0,1.12-13.27L95.73,34.49a14,14,0,0,0-14.56-8.38A54.24,54.24,0,0,0,34,80c0,78.3,63.7,142,142,142a54.25,54.25,0,0,0,53.89-47.17A14,14,0,0,0,221.59,160.3ZM176,210C104.32,210,46,151.68,46,80A42.23,42.23,0,0,1,82.67,38h.23a2,2,0,0,1,1.84,1.31l21.1,47.11a2,2,0,0,1,0,1.67L84.73,113.15a4.73,4.73,0,0,0-.43.57,14,14,0,0,0-.91,13.73c8.87,18.16,27.17,36.32,45.53,45.19a14,14,0,0,0,13.77-1c.19-.13.38-.27.56-.42l24.68-21a1.92,1.92,0,0,1,1.6-.1l47.25,21.17a2,2,0,0,1,1.21,2A42.24,42.24,0,0,1,176,210Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M220.78,162.13,173.56,141A12,12,0,0,0,162.18,142a3.37,3.37,0,0,0-.38.28L137,163.42a3.93,3.93,0,0,1-3.7.21c-16.24-7.84-33.05-24.52-40.89-40.57a3.9,3.9,0,0,1,.18-3.69l21.2-25.21c.1-.12.19-.25.28-.38a12,12,0,0,0,1-11.36L93.9,35.28a12,12,0,0,0-12.48-7.19A52.25,52.25,0,0,0,36,80c0,77.2,62.8,140,140,140a52.25,52.25,0,0,0,51.91-45.42A12,12,0,0,0,220.78,162.13ZM220,173.58A44.23,44.23,0,0,1,176,212C103.22,212,44,152.78,44,80A44.23,44.23,0,0,1,82.42,36a3.87,3.87,0,0,1,.48,0,4,4,0,0,1,3.67,2.49l21.11,47.14a4,4,0,0,1-.23,3.6l-21.19,25.2c-.1.13-.2.25-.29.39a12,12,0,0,0-.78,11.75c8.69,17.79,26.61,35.58,44.6,44.27a12,12,0,0,0,11.79-.87l.37-.28,24.83-21.12a3.93,3.93,0,0,1,3.57-.27l47.21,21.16A4,4,0,0,1,220,173.58Z" }))
  ]
]);
const e$5 = reactExports.forwardRef((r2, t2) => reactExports.createElement(p, { ref: t2, ...r2, weights: e$6 }));
e$5.displayName = "PhoneIcon";
const e$4 =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M76,64A12,12,0,0,1,88,52H216a12,12,0,0,1,0,24H88A12,12,0,0,1,76,64Zm140,52H88a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Zm0,64H88a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24ZM44,112a16,16,0,1,0,16,16A16,16,0,0,0,44,112Zm0-64A16,16,0,1,0,60,64,16,16,0,0,0,44,48Zm0,128a16,16,0,1,0,16,16A16,16,0,0,0,44,176Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,64V192H88V64Z", opacity: "0.2" }), reactExports.createElement("path", { d: "M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,1,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,1,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM68,188a12,12,0,1,1,12-12A12,12,0,0,1,68,188Zm0-48a12,12,0,1,1,12-12A12,12,0,0,1,68,140Zm0-48A12,12,0,1,1,80,80,12,12,0,0,1,68,92Zm124,92H104a8,8,0,0,1,0-16h88a8,8,0,0,1,0,16Zm0-48H104a8,8,0,0,1,0-16h88a8,8,0,0,1,0,16Zm0-48H104a8,8,0,0,1,0-16h88a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M82,64a6,6,0,0,1,6-6H216a6,6,0,0,1,0,12H88A6,6,0,0,1,82,64Zm134,58H88a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12Zm0,64H88a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12ZM44,54A10,10,0,1,0,54,64,10,10,0,0,0,44,54Zm0,128a10,10,0,1,0,10,10A10,10,0,0,0,44,182Zm0-64a10,10,0,1,0,10,10A10,10,0,0,0,44,118Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M84,64a4,4,0,0,1,4-4H216a4,4,0,0,1,0,8H88A4,4,0,0,1,84,64Zm132,60H88a4,4,0,0,0,0,8H216a4,4,0,0,0,0-8Zm0,64H88a4,4,0,0,0,0,8H216a4,4,0,0,0,0-8ZM44,120a8,8,0,1,0,8,8A8,8,0,0,0,44,120Zm0-64a8,8,0,1,0,8,8A8,8,0,0,0,44,56Zm0,128a8,8,0,1,0,8,8A8,8,0,0,0,44,184Z" }))
  ]
]);
const e$3 = reactExports.forwardRef((o2, s) => reactExports.createElement(p, { ref: s, ...o2, weights: e$4 }));
e$3.displayName = "ListBulletsIcon";
const t =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M208,96l-80,80L48,96Z", opacity: "0.2" }), reactExports.createElement("path", { d: "M215.39,92.94A8,8,0,0,0,208,88H48a8,8,0,0,0-5.66,13.66l80,80a8,8,0,0,0,11.32,0l80-80A8,8,0,0,0,215.39,92.94ZM128,164.69,67.31,104H188.69Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M212.24,100.24l-80,80a6,6,0,0,1-8.48,0l-80-80a6,6,0,0,1,8.48-8.48L128,167.51l75.76-75.75a6,6,0,0,1,8.48,8.48Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M210.83,98.83l-80,80a4,4,0,0,1-5.66,0l-80-80a4,4,0,0,1,5.66-5.66L128,170.34l77.17-77.17a4,4,0,1,1,5.66,5.66Z" }))
  ]
]);
const e$2 = reactExports.forwardRef((r2, t$12) => reactExports.createElement(p, { ref: t$12, ...r2, weights: t }));
e$2.displayName = "CaretDownIcon";
const a =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12H216a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H52V121.65l76-76,76,76Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M216,120v96H40V120a8,8,0,0,1,2.34-5.66l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,216,120Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H48V120l80-80,80,80Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M224,120v96a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V120a15.87,15.87,0,0,1,4.69-11.32l80-80a16,16,0,0,1,22.62,0l80,80A15.87,15.87,0,0,1,224,120Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M217.9,110.1l-80-80a14,14,0,0,0-19.8,0l-80,80A13.92,13.92,0,0,0,34,120v96a6,6,0,0,0,6,6H216a6,6,0,0,0,6-6V120A13.92,13.92,0,0,0,217.9,110.1ZM210,210H46V120a2,2,0,0,1,.58-1.42l80-80a2,2,0,0,1,2.84,0l80,80A2,2,0,0,1,210,120Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H48V120l80-80,80,80Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216.49,111.51l-80-80a12,12,0,0,0-17,0l-80,80A12,12,0,0,0,36,120v96a4,4,0,0,0,4,4H216a4,4,0,0,0,4-4V120A12,12,0,0,0,216.49,111.51ZM212,212H44V120a4,4,0,0,1,1.17-2.83l80-80a4,4,0,0,1,5.66,0l80,80A4,4,0,0,1,212,120Z" }))
  ]
]);
const o$1 = reactExports.forwardRef((m, r2) => reactExports.createElement(p, { ref: r2, ...m, weights: a }));
o$1.displayName = "HouseSimpleIcon";
const e$1 =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M188,76a31.85,31.85,0,0,0-11.21,2,32,32,0,0,0-48.79-11A32,32,0,0,0,76,92v16H68a32,32,0,0,0-32,32v12a92,92,0,0,0,184,0V108A32,32,0,0,0,188,76Zm8,76a68,68,0,0,1-136,0V140a8,8,0,0,1,8-8h8v20a12,12,0,0,0,24,0V92a8,8,0,0,1,16,0v28a12,12,0,0,0,24,0V92a8,8,0,0,1,16,0v28a12,12,0,0,0,24,0V108a8,8,0,0,1,16,0Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", {
      d: "M208,108v44a80,80,0,0,1-160,0V140a20,20,0,0,1,20-20H88V92a20,20,0,0,1,40,0,20,20,0,0,1,40,0v16a20,20,0,0,1,40,0Z",
      opacity: "0.2"
    }), reactExports.createElement("path", { d: "M188,80a27.79,27.79,0,0,0-13.36,3.4,28,28,0,0,0-46.64-11A28,28,0,0,0,80,92v20H68a28,28,0,0,0-28,28v12a88,88,0,0,0,176,0V108A28,28,0,0,0,188,80Zm12,72a72,72,0,0,1-144,0V140a12,12,0,0,1,12-12H80v24a8,8,0,0,0,16,0V92a12,12,0,0,1,24,0v28a8,8,0,0,0,16,0V92a12,12,0,0,1,24,0v28a8,8,0,0,0,16,0V108a12,12,0,0,1,24,0Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M216,104v48a88,88,0,0,1-176,0V136a16,16,0,0,1,32,0v8a8,8,0,0,0,16,0V88a16,16,0,0,1,32,0v16a8,8,0,0,0,16,0V88a16,16,0,0,1,32,0v16a8,8,0,0,0,16,0,16,16,0,0,1,32,0Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M188,82a25.85,25.85,0,0,0-14.59,4.49A26,26,0,0,0,128,75.41,26,26,0,0,0,82,92v22H68a26,26,0,0,0-26,26v12a86,86,0,0,0,172,0V108A26,26,0,0,0,188,82Zm14,70a74,74,0,0,1-148,0V140a14,14,0,0,1,14-14H82v26a6,6,0,0,0,12,0V92a14,14,0,0,1,28,0v28a6,6,0,0,0,12,0V92a14,14,0,0,1,28,0v28a6,6,0,0,0,12,0V108a14,14,0,0,1,28,0Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M188,80a27.79,27.79,0,0,0-13.36,3.4,28,28,0,0,0-46.64-11A28,28,0,0,0,80,92v20H68a28,28,0,0,0-28,28v12a88,88,0,0,0,176,0V108A28,28,0,0,0,188,80Zm12,72a72,72,0,0,1-144,0V140a12,12,0,0,1,12-12H80v24a8,8,0,0,0,16,0V92a12,12,0,0,1,24,0v28a8,8,0,0,0,16,0V92a12,12,0,0,1,24,0v28a8,8,0,0,0,16,0V108a12,12,0,0,1,24,0Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M188,84a23.87,23.87,0,0,0-16.07,6.2A24,24,0,0,0,128,78.75,24,24,0,0,0,84,92v24H68a24,24,0,0,0-24,24v12a84,84,0,0,0,168,0V108A24,24,0,0,0,188,84Zm16,68a76,76,0,0,1-152,0V140a16,16,0,0,1,16-16H84v28a4,4,0,0,0,8,0V92a16,16,0,0,1,32,0v28a4,4,0,0,0,8,0V92a16,16,0,0,1,32,0v28a4,4,0,0,0,8,0V108a16,16,0,0,1,32,0Z" }))
  ]
]);
const o = reactExports.forwardRef((r2, n) => reactExports.createElement(p, { ref: n, ...r2, weights: e$1 }));
o.displayName = "HandGrabbingIcon";
const e =  new Map([
  [
    "bold",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M47.51,112.49a12,12,0,0,1,17-17L116,147V32a12,12,0,0,1,24,0V147l51.51-51.52a12,12,0,0,1,17,17l-72,72a12,12,0,0,1-17,0ZM216,204H40a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Z" }))
  ],
  [
    "duotone",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M200,112l-72,72L56,112Z", opacity: "0.2" }), reactExports.createElement("path", { d: "M122.34,189.66a8,8,0,0,0,11.32,0l72-72A8,8,0,0,0,200,104H136V32a8,8,0,0,0-16,0v72H56a8,8,0,0,0-5.66,13.66ZM180.69,120,128,172.69,75.31,120ZM224,216a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,216Z" }))
  ],
  [
    "fill",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M50.34,117.66A8,8,0,0,1,56,104h64V32a8,8,0,0,1,16,0v72h64a8,8,0,0,1,5.66,13.66l-72,72a8,8,0,0,1-11.32,0ZM216,208H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" }))
  ],
  [
    "light",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M51.76,116.24a6,6,0,0,1,8.48-8.48L122,169.51V32a6,6,0,0,1,12,0V169.51l61.76-61.75a6,6,0,0,1,8.48,8.48l-72,72a6,6,0,0,1-8.48,0ZM216,210H40a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12Z" }))
  ],
  [
    "regular",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M50.34,117.66a8,8,0,0,1,11.32-11.32L120,164.69V32a8,8,0,0,1,16,0V164.69l58.34-58.35a8,8,0,0,1,11.32,11.32l-72,72a8,8,0,0,1-11.32,0ZM216,208H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" }))
  ],
  [
    "thin",
    reactExports.createElement(reactExports.Fragment, null, reactExports.createElement("path", { d: "M53.17,114.83a4,4,0,0,1,5.66-5.66L124,174.34V32a4,4,0,0,1,8,0V174.34l65.17-65.17a4,4,0,1,1,5.66,5.66l-72,72a4,4,0,0,1-5.66,0ZM216,212H40a4,4,0,0,0,0,8H216a4,4,0,0,0,0-8Z" }))
  ]
]);
const r = reactExports.forwardRef((e$12, n) => reactExports.createElement(p, { ref: n, ...e$12, weights: e }));
r.displayName = "ArrowLineDownIcon";
const chaseIcons = {
  radio: a$g,
  studio: r$5,
  scan: r$4,
  arrow: r$3,
  close: e$l,
  play: a$c,
  stop: t$3,
  mic: e$j,
  signal: e$h,
  volume: o$8,
  users: o$7,
  bolt: t$2,
  van: a$8,
  money: o$6,
  cassette: t$1,
  plus: e$c,
  minus: e$b,
  check: o$5,
  refresh: r$2,
  headphones: o$4,
  message: e$8,
  search: o$3,
  settings: o$2,
  broadcast: a$2,
  direction: r$1,
  phone: e$5,
  directory: e$3,
  caret: e$2,
  home: o$1,
  hand: o,
  place: r
};
function ChaseIcon({ name, size = 20 }) {
  const ChaseGlyph = chaseIcons[name] || a$g;
  return jsxRuntimeExports.jsx(ChaseGlyph, { size, weight: "regular", "aria-hidden": "true" });
}
function ChaseEmpty({ icon = "radio", title, children }) {
  return jsxRuntimeExports.jsxs("div", { className: "chase-empty", children: [
    jsxRuntimeExports.jsx("span", { className: "chase-empty-icon", children: jsxRuntimeExports.jsx(ChaseIcon, { name: icon, size: 28 }) }),
    jsxRuntimeExports.jsx("h3", { children: title }),
    jsxRuntimeExports.jsx("p", { children })
  ] });
}
function ChaseStatus({ live, children }) {
  return jsxRuntimeExports.jsxs("span", { className: `chase-status ${live ? "chase-status-live" : ""}`, children: [
    jsxRuntimeExports.jsx("i", {}),
    children
  ] });
}
function ChaseToast({ toast, dismiss }) {
  if (!toast)
    return null;
  return jsxRuntimeExports.jsxs("div", {
    className: `chase-toast chase-toast-${toast.tone}`,
    role: toast.tone === "error" ? "alert" : "status",
    children: [
      jsxRuntimeExports.jsx(ChaseIcon, {
        name: toast.tone === "success" ? "check" : toast.tone === "error" ? "close" : "radio",
        size: 19
      }),
      jsxRuntimeExports.jsx("span", { children: toast.message }),
      jsxRuntimeExports.jsx("button", { "aria-label": "Dismiss notification", onClick: dismiss, children: jsxRuntimeExports.jsx(ChaseIcon, { name: "close", size: 16 }) })
    ]
  });
}
function ChaseSignal({ quality }) {
  const chasePercent = quality === null ? null : Math.round(Math.max(0, Math.min(1, quality)) * 100);
  return jsxRuntimeExports.jsxs("span", {
    className: "chase-reception",
    "aria-label": chasePercent === null ? "Reception unavailable" : `${chasePercent} percent reception`,
    children: [
      jsxRuntimeExports.jsx(ChaseIcon, { name: "signal", size: 20 }),
      jsxRuntimeExports.jsx("span", { children: chasePercent === null ? "No reception data" : `${chasePercent}% signal` })
    ]
  });
}
function ChaseDialog({ title, description, icon = "radio", close, children }) {
  const chaseRef = reactExports.useRef(null);
  const chaseCloseRef = reactExports.useRef(close);
  chaseCloseRef.current = close;
  reactExports.useEffect(() => {
    const chasePrevious = document.activeElement;
    chaseRef.current?.querySelector("input, textarea, select, button")?.focus();
    return () => chasePrevious?.focus();
  }, []);
  return jsxRuntimeExports.jsx("div", { className: "chase-modal-backdrop", children: jsxRuntimeExports.jsxs("div", {
    className: "chase-modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    ref: chaseRef,
    onKeyDown: (chaseEvent) => {
      if (chaseEvent.key === "Escape") {
        chaseEvent.stopPropagation();
        chaseEvent.preventDefault();
        chaseCloseRef.current();
      }
      if (chaseEvent.key === "Tab") {
        chaseEvent.stopPropagation();
        const chaseControls = [
          ...chaseRef.current?.querySelectorAll("button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled)") || []
        ];
        const chaseFirst = chaseControls[0];
        const chaseLast = chaseControls.at(-1);
        if (chaseEvent.shiftKey && document.activeElement === chaseFirst) {
          chaseEvent.preventDefault();
          chaseLast?.focus();
        } else if (!chaseEvent.shiftKey && document.activeElement === chaseLast) {
          chaseEvent.preventDefault();
          chaseFirst?.focus();
        }
      }
    },
    children: [
      jsxRuntimeExports.jsxs("header", { className: "chase-modal-header", children: [
        jsxRuntimeExports.jsx("span", { className: "chase-modal-icon", children: jsxRuntimeExports.jsx(ChaseIcon, { name: icon, size: 22 }) }),
        jsxRuntimeExports.jsxs("div", { children: [
          jsxRuntimeExports.jsx("h2", { children: title }),
          description ? jsxRuntimeExports.jsx("p", { children: description }) : null
        ] }),
        jsxRuntimeExports.jsx("button", {
          className: "chase-icon-button",
          "aria-label": `Close ${title}`,
          onClick: close,
          children: jsxRuntimeExports.jsx(ChaseIcon, { name: "close" })
        })
      ] }),
      children
    ]
  }) });
}
function ChaseNormalizeIncomingCall(value) {
  if (!value || typeof value !== "object")
    return null;
  const chaseCall = value;
  if (!Number.isFinite(chaseCall.callId) || !Number.isFinite(chaseCall.stationId))
    return null;
  return {
    callId: Number(chaseCall.callId),
    stationId: Number(chaseCall.stationId),
    callerName: typeof chaseCall.callerName === "string" && chaseCall.callerName.trim() ? chaseCall.callerName : "Unknown caller",
    stationName: typeof chaseCall.stationName === "string" ? chaseCall.stationName : "Your station",
    ringSeconds: Number.isFinite(chaseCall.ringSeconds) ? Math.max(1, Number(chaseCall.ringSeconds)) : 30,
    receivedAt: Date.now(),
    acceptKey: typeof chaseCall.acceptKey === "string" && chaseCall.acceptKey.trim() ? chaseCall.acceptKey.trim() : void 0,
    declineKey: typeof chaseCall.declineKey === "string" && chaseCall.declineKey.trim() ? chaseCall.declineKey.trim() : void 0
  };
}
function ChaseCallPopup({ call, acceptKey, declineKey, listenKeys, busy, action }) {
  const [chaseNow, chaseSetNow] = reactExports.useState(Date.now());
  reactExports.useEffect(() => {
    const chaseTimer = window.setInterval(() => chaseSetNow(Date.now()), 500);
    return () => window.clearInterval(chaseTimer);
  }, []);
  reactExports.useEffect(() => {
    if (!listenKeys)
      return;
    function ChaseCallKeys(chaseEvent) {
      const chaseTarget = chaseEvent.target;
      if (chaseEvent.defaultPrevented || chaseTarget?.tagName === "INPUT" || chaseTarget?.tagName === "TEXTAREA" || chaseTarget?.tagName === "SELECT")
        return;
      const chaseKey = chaseEvent.key.toUpperCase();
      if (chaseKey === acceptKey.toUpperCase()) {
        chaseEvent.preventDefault();
        void action("answerCall", { callId: call.callId, accept: true });
      } else if (chaseKey === declineKey.toUpperCase()) {
        chaseEvent.preventDefault();
        void action("answerCall", { callId: call.callId, accept: false });
      }
    }
    window.addEventListener("keydown", ChaseCallKeys);
    return () => window.removeEventListener("keydown", ChaseCallKeys);
  }, [listenKeys, acceptKey, declineKey, action, call.callId]);
  const chaseRemaining = Math.max(0, Math.ceil(call.ringSeconds - (chaseNow - call.receivedAt) / 1e3));
  return jsxRuntimeExports.jsx("div", { className: "chase-call-popup-layer", children: jsxRuntimeExports.jsxs("div", {
    className: "chase-call-popup",
    role: "alertdialog",
    "aria-label": `Incoming call from ${call.callerName}`,
    children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-call-popup-heading", children: [
        jsxRuntimeExports.jsx("span", { className: "chase-call-popup-icon", children: jsxRuntimeExports.jsx(ChaseIcon, { name: "phone", size: 20 }) }),
        jsxRuntimeExports.jsxs("div", { children: [
          jsxRuntimeExports.jsx("span", { className: "chase-eyebrow", children: "INCOMING CALL" }),
          jsxRuntimeExports.jsx("strong", { children: call.callerName }),
          jsxRuntimeExports.jsx("span", { children: call.stationName })
        ] }),
        jsxRuntimeExports.jsxs("span", { className: "chase-call-popup-timer", "aria-live": "off", children: [
          chaseRemaining,
          "s"
        ] })
      ] }),
      jsxRuntimeExports.jsxs("div", { className: "chase-call-popup-actions", children: [
        jsxRuntimeExports.jsxs("button", {
          className: "chase-button chase-primary",
          disabled: busy,
          onClick: () => void action("answerCall", { callId: call.callId, accept: true }),
          children: [
            jsxRuntimeExports.jsx(ChaseIcon, { name: "check", size: 16 }),
            "Accept",
            jsxRuntimeExports.jsx("kbd", { children: acceptKey })
          ]
        }),
        jsxRuntimeExports.jsxs("button", {
          className: "chase-button chase-danger",
          disabled: busy,
          onClick: () => void action("answerCall", { callId: call.callId, accept: false }),
          children: [
            jsxRuntimeExports.jsx(ChaseIcon, { name: "close", size: 16 }),
            "Decline",
            jsxRuntimeExports.jsx("kbd", { children: declineKey })
          ]
        })
      ] })
    ]
  }) });
}
function ChaseCallControls({ snapshot, station, action, busy, placed }) {
  const chaseCall = snapshot.viewer.call;
  const chaseTunedId = placed ? placed.stationId ?? null : snapshot.tunedStationId;
  if (snapshot.config.calls?.enabled === false)
    return null;
  if (chaseCall.state === "ringing")
    return jsxRuntimeExports.jsxs("div", { className: "chase-call-controls chase-call-ringing", role: "status", children: [
      jsxRuntimeExports.jsxs("span", { children: [
        jsxRuntimeExports.jsx(ChaseIcon, { name: "phone", size: 17 }),
        "Calling",
        chaseCall.stationName ? ` ${chaseCall.stationName}` : "",
        "…"
      ] }),
      jsxRuntimeExports.jsx("button", {
        className: "chase-button chase-secondary",
        disabled: busy,
        onClick: () => void action("endCall", {}, "Call cancelled."),
        children: "Cancel"
      })
    ] });
  if (chaseCall.state === "onair")
    return jsxRuntimeExports.jsxs("div", { className: "chase-call-controls chase-call-onair", role: "status", children: [
      jsxRuntimeExports.jsxs("span", { children: [
        jsxRuntimeExports.jsx(ChaseIcon, { name: "mic", size: 17 }),
        "On air with ",
        chaseCall.stationName || "the station"
      ] }),
      jsxRuntimeExports.jsx("button", {
        className: "chase-button chase-danger",
        disabled: busy,
        onClick: () => void action("endCall", {}, "Call ended."),
        children: "Hang up"
      })
    ] });
  if (!station?.micLive || chaseTunedId !== station.id)
    return null;
  return jsxRuntimeExports.jsxs("div", { className: "chase-call-controls", children: [
    jsxRuntimeExports.jsxs("span", { children: [
      jsxRuntimeExports.jsx(ChaseIcon, { name: "phone", size: 17 }),
      station.hostName || "The host",
      " is taking calls"
    ] }),
    jsxRuntimeExports.jsxs("button", {
      className: "chase-button chase-secondary",
      disabled: busy || !snapshot.viewer.voiceReady,
      onClick: () => void action("callStation", placed ? { stationId: station.id, placedNetId: placed.netId } : { stationId: station.id }, "Calling the studio…"),
      children: [
        jsxRuntimeExports.jsx(ChaseIcon, { name: "phone", size: 16 }),
        "Call the host"
      ]
    })
  ] });
}
const scriptRel = "modulepreload";
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled = function(promises$2) {
      return Promise.all(promises$2.map((p2) => Promise.resolve(p2).then((value$1) => ({
        status: "fulfilled",
        value: value$1
      }), (reason) => ({
        status: "rejected",
        reason
      }))));
    };
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled(deps.map((dep) => {
      dep = assetsURL(dep, importerUrl);
      if (dep in seen)
        return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";
      if (!!importerUrl)
        for (let i$1 = links.length - 1; i$1 >= 0; i$1--) {
          const link$1 = links[i$1];
          if (link$1.href === dep && (!isCss || link$1.rel === "stylesheet"))
            return;
        }
      else if (document.querySelector(`link[href="${dep}"]${cssSelector}`))
        return;
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss)
        link.as = "script";
      link.crossOrigin = "";
      link.href = dep;
      if (cspNonce)
        link.setAttribute("nonce", cspNonce);
      document.head.appendChild(link);
      if (isCss)
        return new Promise((res, rej) => {
          link.addEventListener("load", res);
          link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
        });
    }));
  }
  function handlePreloadError(err$2) {
    const e$12 = new Event("vite:preloadError", { cancelable: true });
    e$12.payload = err$2;
    window.dispatchEvent(e$12);
    if (!e$12.defaultPrevented)
      throw err$2;
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected")
        continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
const chasePreview = new URLSearchParams(window.location.search).get("preview") === "1" && !window.GetParentResourceName;
const chasePhone = new URLSearchParams(window.location.search).get("phone") === "1";
function ChaseNormalizeList(chaseValue) {
  if (Array.isArray(chaseValue))
    return chaseValue;
  if (chaseValue && typeof chaseValue === "object" && Object.keys(chaseValue).length === 0)
    return [];
  throw new Error("The station returned an invalid list. Refresh to reconnect.");
}
function ChaseNormalizeStation(station) {
  return {
    ...station,
    cohostNames: station.cohostNames === void 0 ? [] : ChaseNormalizeList(station.cohostNames),
    queue: station.queue === void 0 ? void 0 : ChaseNormalizeList(station.queue),
    nowPlaying: station.nowPlaying ?? null
  };
}
function ChaseNormalizeCall(value) {
  const chaseCall = value;
  if (chaseCall && typeof chaseCall === "object" && (chaseCall.state === "ringing" || chaseCall.state === "onair"))
    return {
      state: chaseCall.state,
      stationId: Number.isFinite(chaseCall.stationId) ? chaseCall.stationId : void 0,
      stationName: typeof chaseCall.stationName === "string" ? chaseCall.stationName : void 0
    };
  return { state: "idle" };
}
function ChaseNormalizeSnapshot(value) {
  if (!value || typeof value !== "object")
    throw new Error("The station returned incomplete data. Refresh to reconnect.");
  const chaseCandidate = value;
  if (!chaseCandidate.viewer || !chaseCandidate.config || !Number.isFinite(chaseCandidate.config.frequencyMin) || !Number.isFinite(chaseCandidate.config.frequencyMax))
    throw new Error("The station returned incomplete data. Refresh to reconnect.");
  return {
    ...chaseCandidate,
    viewer: {
      ...chaseCandidate.viewer,
      call: ChaseNormalizeCall(chaseCandidate.viewer.call)
    },
    stations: ChaseNormalizeList(chaseCandidate.stations).map(ChaseNormalizeStation),
    requests: ChaseNormalizeList(chaseCandidate.requests),
    crew: ChaseNormalizeList(chaseCandidate.crew),
    cartridges: ChaseNormalizeList(chaseCandidate.cartridges),
    mine: chaseCandidate.mine ? ChaseNormalizeStation(chaseCandidate.mine) : null,
    tunedStationId: chaseCandidate.tunedStationId ?? null,
    config: {
      ...chaseCandidate.config,
      powerModes: ChaseNormalizeList(chaseCandidate.config.powerModes)
    },
    devices: chaseCandidate.devices ? {
      ...chaseCandidate.devices,
      shop: chaseCandidate.devices.shop === void 0 ? [] : ChaseNormalizeList(chaseCandidate.devices.shop),
      tunedStationId: chaseCandidate.devices.tunedStationId ?? null,
      placedNearby: chaseCandidate.devices.placedNearby === void 0 ? [] : ChaseNormalizeList(chaseCandidate.devices.placedNearby).filter((chasePlaced) => Number.isInteger(chasePlaced.netId)),
      canPlace: chaseCandidate.devices.canPlace === true
    } : void 0
  };
}
async function ChasePost(endpoint, data = {}) {
  if (chasePreview) {
    const chaseDemo = await __vitePreload(() => import("./preview-BDzCaSMY.js"), true ? [] : void 0, import.meta.url);
    return chaseDemo.ChasePreviewPost(endpoint, data);
  }
  const chasePhoneResource = new URLSearchParams(window.location.search).get("resource");
  const chaseResource = chasePhone && chasePhoneResource === "chase_bootleg" ? "chase_bootleg" : window.GetParentResourceName?.();
  if (!chaseResource)
    throw new Error("Open Senora Signalworks from your in-game receiver.");
  const chaseController = new AbortController();
  const chaseTimeout = window.setTimeout(() => chaseController.abort(), 12e3);
  try {
    const chaseResponse = await fetch(`https://${chaseResource}/chase_bootleg:${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(data),
      signal: chaseController.signal
    });
    if (!chaseResponse.ok)
      throw new Error("The radio could not reach the server. Try again.");
    const chaseResult = await chaseResponse.json();
    if (!chaseResult || typeof chaseResult !== "object" || typeof chaseResult.ok !== "boolean")
      throw new Error("The server returned an unreadable response. Refresh to reconnect.");
    if (chaseResult.ok !== true)
      throw new Error(chaseResult.error?.message || "The server could not complete that action.");
    return chaseResult.data;
  } catch (chaseError) {
    if (chaseError instanceof DOMException && chaseError.name === "AbortError")
      throw new Error("The server took too long to respond. Refresh before trying again.");
    throw chaseError;
  } finally {
    window.clearTimeout(chaseTimeout);
  }
}
function ChaseFrequency(value) {
  return (value / 10).toFixed(1);
}
function ChaseMoney(value, currency) {
  return `${currency}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`;
}
function ChaseClock(seconds) {
  const chaseWhole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(chaseWhole / 60)}:${(chaseWhole % 60).toString().padStart(2, "0")}`;
}
function ChaseNormalizePlaced(value) {
  if (!value || typeof value !== "object")
    return null;
  const chasePlaced = value;
  if (!Number.isInteger(chasePlaced.netId) || Number(chasePlaced.netId) < 1)
    return null;
  return {
    netId: Number(chasePlaced.netId),
    stationId: Number.isFinite(chasePlaced.stationId) ? Number(chasePlaced.stationId) : null,
    frequency: Number.isFinite(chasePlaced.frequency) ? Number(chasePlaced.frequency) : null,
    label: typeof chasePlaced.label === "string" && chasePlaced.label.trim() ? chasePlaced.label : "No station selected",
    ownerName: typeof chasePlaced.ownerName === "string" && chasePlaced.ownerName.trim() ? chasePlaced.ownerName : void 0,
    quality: Number.isFinite(chasePlaced.quality) ? Math.max(0, Math.min(1, Number(chasePlaced.quality))) : null
  };
}
function ChaseError(value) {
  return value instanceof Error ? value.message : "Something interrupted the connection. Please try again.";
}
const chaseDeviceLabels = {
  vehicle: "SSW Dash Receiver",
  portable: "SSW Field Radio",
  buds: "Signalbuds"
};
const chaseDeviceImages = {
  vehicle: "images/ssw_vehicle_receiver.png",
  portable: "images/ssw_portable_radio.png",
  buds: "images/ssw_signalbuds.png"
};
const chaseDeviceIcons = {
  vehicle: "van",
  portable: "radio",
  buds: "headphones"
};
function ChasePlaceButton({ snapshot, action, busy, className = "chase-button chase-secondary" }) {
  if (snapshot.devices?.canPlace !== true)
    return null;
  return jsxRuntimeExports.jsxs("button", {
    type: "button",
    className,
    disabled: busy,
    onClick: () => void action("placeRadio", {}, "Field Radio placed on the ground."),
    children: [
      jsxRuntimeExports.jsx(ChaseIcon, { name: "place", size: 18 }),
      "Place on the ground"
    ]
  });
}
function ChaseDeviceControls({ snapshot, action, busy }) {
  const chaseDevices = snapshot.devices;
  if (!chaseDevices)
    return null;
  return jsxRuntimeExports.jsxs("div", { className: "chase-device-controls", children: [
    jsxRuntimeExports.jsxs("div", { className: "chase-panel-heading", children: [
      jsxRuntimeExports.jsx("span", { className: "chase-eyebrow", children: "LISTENING DEVICE" }),
      jsxRuntimeExports.jsx("span", { className: "chase-count-pill", children: chaseDevices.active === "none" ? "NONE EQUIPPED" : chaseDeviceLabels[chaseDevices.active] })
    ] }),
    jsxRuntimeExports.jsx("div", { className: "chase-device-switch", children: ["vehicle", "portable", "buds"].map((chaseDevice) => jsxRuntimeExports.jsxs("button", {
      className: `chase-button ${chaseDevices.active === chaseDevice ? "chase-primary" : "chase-secondary"}`,
      "aria-pressed": chaseDevices.active === chaseDevice,
      disabled: busy || (chaseDevice === "vehicle" ? !chaseDevices.vehicle.installed || !chaseDevices.vehicle.canControl : chaseDevices.owned[chaseDevice] < 1),
      onClick: () => void action("equipDevice", { device: chaseDevice, carry: chaseDevices.carry }, "Receiver selected."),
      children: [
        jsxRuntimeExports.jsx(ChaseIcon, { name: chaseDeviceIcons[chaseDevice], size: 18 }),
        chaseDevice === "vehicle" ? "Dash" : chaseDevice === "portable" ? "Field" : "Buds"
      ]
    }, chaseDevice)) }),
    chaseDevices.active === "portable" ? jsxRuntimeExports.jsxs("div", { className: "chase-carry-controls", children: [
      jsxRuntimeExports.jsx("span", { children: "Carry position" }),
      jsxRuntimeExports.jsx("div", { className: "chase-segmented", children: ["hand", "shoulder"].map((chaseCarry) => jsxRuntimeExports.jsx("button", {
        "aria-pressed": chaseDevices.carry === chaseCarry,
        className: chaseDevices.carry === chaseCarry ? "chase-selected" : "",
        disabled: busy,
        onClick: () => void action("equipDevice", { device: "portable", carry: chaseCarry }, "Carry position updated."),
        children: chaseCarry === "hand" ? "Hand" : "Shoulder"
      }, chaseCarry)) })
    ] }) : null,
    chaseDevices.active !== "none" ? jsxRuntimeExports.jsx("button", {
      className: "chase-text-button",
      disabled: busy,
      onClick: () => void action("equipDevice", { device: "none" }, "Receiver put away."),
      children: "Put away receiver"
    }) : jsxRuntimeExports.jsx("p", { className: "chase-caption", children: "Equip a receiver to listen. Buy one from the Senora kiosk vendor in Legion Square." }),
    jsxRuntimeExports.jsx(ChasePlaceButton, {
      snapshot,
      action,
      busy,
      className: "chase-text-button chase-place-button"
    }),
    !chaseDevices.vehicle.installed && chaseDevices.owned.vehicle > 0 ? jsxRuntimeExports.jsxs("div", { className: "chase-receiver-install", children: [
      jsxRuntimeExports.jsx("p", { children: chaseDevices.vehicle.canInstall ? "Your Dash Receiver is ready to install in this vehicle." : chaseDevices.vehicle.positionError || "Park in the driver seat to position your Dash Receiver." }),
      jsxRuntimeExports.jsxs("button", {
        className: "chase-button chase-secondary",
        disabled: busy || !chaseDevices.vehicle.canInstall || !chaseDevices.vehicle.netId,
        onClick: () => void action("installReceiver", { netId: chaseDevices.vehicle.netId }, "Choose the receiver position, then save to install."),
        children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "van", size: 18 }),
          "Position receiver"
        ]
      })
    ] }) : null,
    chaseDevices.vehicle.installed && chaseDevices.vehicle.canMove ? jsxRuntimeExports.jsxs("button", {
      className: "chase-button chase-secondary",
      disabled: busy,
      onClick: () => void action("moveReceiver", { netId: chaseDevices.vehicle.netId }),
      children: [
        jsxRuntimeExports.jsx(ChaseIcon, { name: "van", size: 18 }),
        "Reposition dashboard receiver"
      ]
    }) : null
  ] });
}
function ChaseReceiver({ snapshot, action, busy, quality, device, placed = null }) {
  const chasePlaced = device === "placed" && placed ? snapshot.devices?.placedNearby?.find((chaseItem) => chaseItem.netId === placed.netId) ?? placed : null;
  const chaseTunedId = chasePlaced ? chasePlaced.stationId ?? null : snapshot.tunedStationId;
  const chaseTuned = snapshot.stations.find((chaseStation) => chaseStation.id === chaseTunedId);
  const [chaseFrequency, chaseSetFrequency] = reactExports.useState(chaseTuned?.frequency ?? chasePlaced?.frequency ?? snapshot.config.frequencyMin);
  const chaseTunedRef = reactExports.useRef(chaseTunedId);
  reactExports.useEffect(() => {
    if (chaseTunedRef.current === chaseTunedId)
      return;
    chaseTunedRef.current = chaseTunedId;
    if (chaseTuned)
      chaseSetFrequency(chaseTuned.frequency);
  }, [chaseTunedId, chaseTuned]);
  const chasePlacedData = chasePlaced ? { placedNetId: chasePlaced.netId } : {};
  const chasePlacedNearby = snapshot.devices?.placedNearby;
  const chasePlacedGone = chasePlaced !== null && Array.isArray(chasePlacedNearby) && !chasePlacedNearby.some((chaseItem) => chaseItem.netId === chasePlaced.netId);
  const chaseLocked = busy || chasePlacedGone;
  const chaseDisplayDevice = device === "placed" ? "portable" : snapshot.devices?.active && snapshot.devices.active !== "none" ? snapshot.devices.active : device;
  const chaseQuality = chasePlaced ? chasePlaced.quality ?? quality : quality;
  return jsxRuntimeExports.jsxs("div", { className: "chase-compact-receiver", children: [
    jsxRuntimeExports.jsxs("div", { className: "chase-hardware-header", children: [
      jsxRuntimeExports.jsx(ChaseIcon, { name: chaseDeviceIcons[chaseDisplayDevice], size: 25 }),
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsx("h2", { children: chaseDeviceLabels[chaseDisplayDevice] }),
        jsxRuntimeExports.jsx("p", { children: chasePlaced ? `PLACED BY ${(chasePlaced.ownerName || "UNKNOWN").toUpperCase()}` : "SENORA SIGNALWORKS" })
      ] }),
      jsxRuntimeExports.jsx(ChaseSignal, { quality: chaseQuality })
    ] }),
    jsxRuntimeExports.jsxs("div", { className: "chase-hardware-screen", children: [
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsx("span", { children: chasePlaced ? "FIELD RADIO · GROUND" : "FM RECEIVER" }),
        jsxRuntimeExports.jsx(ChaseStatus, { live: Boolean(chaseTunedId), children: chaseTunedId ? "CONNECTED" : "STANDBY" })
      ] }),
      jsxRuntimeExports.jsxs("strong", { children: [
        ChaseFrequency(chaseFrequency),
        jsxRuntimeExports.jsx("span", { children: "MHz" })
      ] }),
      jsxRuntimeExports.jsx("p", { children: chaseTuned?.name || (chaseTunedId ? chasePlaced?.label || "Unlisted station" : "No station connected") })
    ] }),
    jsxRuntimeExports.jsxs("form", {
      className: "chase-hardware-tuner",
      onSubmit: (chaseEvent) => {
        chaseEvent.preventDefault();
        if (chasePlacedGone)
          return;
        void action("tune", { frequency: chaseFrequency, ...chasePlacedData }, "Receiver tuned.");
      },
      children: [
        jsxRuntimeExports.jsxs("label", { children: [
          "Frequency in MHz",
          jsxRuntimeExports.jsx("input", {
            type: "number",
            min: snapshot.config.frequencyMin / 10,
            max: snapshot.config.frequencyMax / 10,
            step: "0.1",
            value: chaseFrequency / 10,
            required: true,
            onChange: (chaseEvent) => chaseSetFrequency(Math.round(Number(chaseEvent.target.value) * 10))
          })
        ] }),
        jsxRuntimeExports.jsx("button", { className: "chase-button chase-primary", disabled: chaseLocked, children: "Tune frequency" }),
        jsxRuntimeExports.jsx("button", {
          type: "button",
          className: "chase-button chase-secondary",
          disabled: chaseLocked || !chaseTunedId,
          onClick: () => void action("untune", chasePlacedData, "Receiver disconnected."),
          children: "Stop"
        })
      ]
    }),
    chaseTuned && chaseTuned.id !== snapshot.mine?.id ? jsxRuntimeExports.jsx(ChaseCallControls, {
      snapshot,
      station: chaseTuned,
      action,
      busy: chaseLocked,
      placed: chasePlaced
    }) : null,
    chasePlaced ? jsxRuntimeExports.jsxs("div", { className: "chase-placed-actions", children: [
      jsxRuntimeExports.jsx("p", { className: "chase-caption", children: chasePlacedGone ? "This field radio is no longer here." : "Anyone nearby can tune this radio, call from it or pick it up." }),
      jsxRuntimeExports.jsxs("button", {
        type: "button",
        className: "chase-button chase-secondary",
        disabled: chaseLocked,
        onClick: () => void action("pickupRadio", { netId: chasePlaced.netId }, "Field Radio picked up."),
        children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "hand", size: 18 }),
          "Pick up"
        ]
      })
    ] }) : jsxRuntimeExports.jsx(ChaseDeviceControls, { snapshot, action, busy })
  ] });
}
function ChaseTuneForm({ snapshot, frequency, setFrequency, action, busy, label = "Tune frequency" }) {
  return jsxRuntimeExports.jsxs("form", {
    className: "chase-tune-controls",
    onSubmit: (chaseEvent) => {
      chaseEvent.preventDefault();
      void action("tune", { frequency }, "Receiver tuned.");
    },
    children: [
      jsxRuntimeExports.jsx("label", { className: "chase-visually-hidden", htmlFor: "chase-frequency", children: "Frequency in MHz" }),
      jsxRuntimeExports.jsxs("div", { className: "chase-frequency-stepper", children: [
        jsxRuntimeExports.jsx("button", {
          type: "button",
          className: "chase-icon-button",
          "aria-label": "Decrease frequency",
          disabled: busy || frequency <= snapshot.config.frequencyMin,
          onClick: () => setFrequency((chaseValue) => chaseValue - 1),
          children: jsxRuntimeExports.jsx(ChaseIcon, { name: "minus", size: 17 })
        }),
        jsxRuntimeExports.jsx("input", {
          id: "chase-frequency",
          className: "chase-frequency-input",
          type: "number",
          min: snapshot.config.frequencyMin / 10,
          max: snapshot.config.frequencyMax / 10,
          step: "0.1",
          value: frequency / 10,
          onChange: (chaseEvent) => setFrequency(Math.round(Number(chaseEvent.target.value) * 10)),
          required: true
        }),
        jsxRuntimeExports.jsx("button", {
          type: "button",
          className: "chase-icon-button",
          "aria-label": "Increase frequency",
          disabled: busy || frequency >= snapshot.config.frequencyMax,
          onClick: () => setFrequency((chaseValue) => chaseValue + 1),
          children: jsxRuntimeExports.jsx(ChaseIcon, { name: "plus", size: 17 })
        })
      ] }),
      jsxRuntimeExports.jsxs("button", {
        type: "submit",
        className: "chase-button chase-primary",
        disabled: busy,
        children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "headphones", size: 18 }),
          label
        ]
      })
    ]
  });
}
function ChaseRequestDialog({ snapshot, station, action, busy, close }) {
  const [chaseMessage, chaseSetMessage] = reactExports.useState("");
  const [chaseKind, chaseSetKind] = reactExports.useState("request");
  async function ChaseSendRequest(event) {
    event.preventDefault();
    if (await action("request", {
      stationId: station.id,
      kind: chaseKind,
      message: chaseMessage.trim()
    }, "Your message has been sent to the studio.")) {
      chaseSetMessage("");
      close();
    }
  }
  return jsxRuntimeExports.jsx(ChaseDialog, {
    title: "Message studio",
    description: station.name,
    icon: "message",
    close,
    children: jsxRuntimeExports.jsxs("form", { onSubmit: ChaseSendRequest, children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-modal-body", children: [
        jsxRuntimeExports.jsxs("label", { children: [
          "Message type",
          jsxRuntimeExports.jsxs("select", {
            "aria-label": "Message type",
            value: chaseKind,
            onChange: (chaseEvent) => chaseSetKind(chaseEvent.target.value),
            children: [
              jsxRuntimeExports.jsx("option", { value: "request", children: "Request" }),
              jsxRuntimeExports.jsx("option", { value: "advertisement", children: "Advertisement" })
            ]
          })
        ] }),
        jsxRuntimeExports.jsxs("label", { htmlFor: "chase-request-message", children: [
          "Message to the studio",
          jsxRuntimeExports.jsx("textarea", {
            id: "chase-request-message",
            value: chaseMessage,
            onChange: (chaseEvent) => chaseSetMessage(chaseEvent.target.value),
            placeholder: "Write a request or advertisement…",
            maxLength: snapshot.config.requestMaxLength,
            rows: 4,
            required: true
          })
        ] }),
        jsxRuntimeExports.jsxs("span", { className: "chase-field-hint", children: [
          chaseMessage.length,
          "/",
          snapshot.config.requestMaxLength,
          " characters"
        ] })
      ] }),
      jsxRuntimeExports.jsxs("footer", { className: "chase-modal-footer", children: [
        jsxRuntimeExports.jsx("button", {
          type: "button",
          className: "chase-button chase-secondary",
          onClick: close,
          children: "Cancel"
        }),
        jsxRuntimeExports.jsxs("button", {
          className: "chase-button chase-primary",
          disabled: busy || !chaseMessage.trim(),
          children: [
            jsxRuntimeExports.jsx(ChaseIcon, { name: "arrow", size: 18 }),
            "Send message"
          ]
        })
      ] })
    ] })
  });
}
function ChaseTipDialog({ snapshot, station, action, busy, close }) {
  const [chaseTip, chaseSetTip] = reactExports.useState("100");
  async function ChaseSendTip(event) {
    event.preventDefault();
    if (await action("tip", { stationId: station.id, amount: Number(chaseTip) }, "Your tip has been delivered."))
      close();
  }
  return jsxRuntimeExports.jsx(ChaseDialog, {
    title: "Support station",
    description: station.name,
    icon: "money",
    close,
    children: jsxRuntimeExports.jsxs("form", { onSubmit: ChaseSendTip, children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-modal-body", children: [
        jsxRuntimeExports.jsxs("label", { htmlFor: "chase-tip", children: [
          "Support this station",
          jsxRuntimeExports.jsxs("div", { className: "chase-input-action", children: [
            jsxRuntimeExports.jsx("span", { children: snapshot.config.currency }),
            jsxRuntimeExports.jsx("input", {
              id: "chase-tip",
              type: "number",
              min: "1",
              max: snapshot.config.maxTip,
              step: "1",
              required: true,
              value: chaseTip,
              onChange: (chaseEvent) => chaseSetTip(chaseEvent.target.value)
            })
          ] })
        ] }),
        jsxRuntimeExports.jsxs("p", { className: "chase-field-hint", children: [
          "Maximum",
          " ",
          ChaseMoney(snapshot.config.maxTip, snapshot.config.currency),
          " per tip."
        ] })
      ] }),
      jsxRuntimeExports.jsxs("footer", { className: "chase-modal-footer", children: [
        jsxRuntimeExports.jsx("button", {
          type: "button",
          className: "chase-button chase-secondary",
          onClick: close,
          children: "Cancel"
        }),
        jsxRuntimeExports.jsxs("button", { className: "chase-button chase-primary", disabled: busy, children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "check", size: 18 }),
          "Send tip"
        ] })
      ] })
    ] })
  });
}
function ChaseListen({ snapshot, action, busy, quality }) {
  const [chaseFrequency, chaseSetFrequency] = reactExports.useState(snapshot.stations.find((chaseStation) => chaseStation.id === snapshot.tunedStationId)?.frequency ?? snapshot.config.frequencyMin);
  const chaseTunedIdRef = reactExports.useRef(snapshot.tunedStationId);
  const [chaseSelectedId, chaseSetSelectedId] = reactExports.useState(snapshot.tunedStationId ?? snapshot.stations[0]?.id ?? null);
  const [chaseFilter, chaseSetFilter] = reactExports.useState("all");
  const [chaseSearch, chaseSetSearch] = reactExports.useState("");
  const [chaseDialog, chaseSetDialog] = reactExports.useState(null);
  const chaseSelected = snapshot.stations.find((chaseStation) => chaseStation.id === chaseSelectedId);
  const chaseStations = snapshot.stations.filter((chaseStation) => (chaseFilter === "all" || chaseStation.live) && `${chaseStation.name} ${ChaseFrequency(chaseStation.frequency)}`.toLowerCase().includes(chaseSearch.toLowerCase()));
  const chaseTuned = Boolean(chaseSelected && snapshot.tunedStationId === chaseSelected.id);
  reactExports.useEffect(() => {
    if (chaseTunedIdRef.current === snapshot.tunedStationId)
      return;
    chaseTunedIdRef.current = snapshot.tunedStationId;
    const chaseStation = snapshot.stations.find((chaseItem) => chaseItem.id === snapshot.tunedStationId);
    if (chaseStation) {
      chaseSetSelectedId(chaseStation.id);
      chaseSetFrequency(chaseStation.frequency);
    }
  }, [snapshot.tunedStationId, snapshot.stations]);
  return jsxRuntimeExports.jsxs("div", { className: "chase-listen-layout", children: [
    jsxRuntimeExports.jsxs("section", { className: "chase-tuner chase-card", children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-panel-heading", children: [
        jsxRuntimeExports.jsxs("div", { children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "radio" }),
          jsxRuntimeExports.jsx("h2", { children: "Manual tuning" })
        ] }),
        jsxRuntimeExports.jsx(ChaseSignal, { quality })
      ] }),
      jsxRuntimeExports.jsxs("div", { className: "chase-tuner-body", children: [
        jsxRuntimeExports.jsxs("div", { className: "chase-frequency-display", children: [
          jsxRuntimeExports.jsx("span", { className: "chase-eyebrow", children: "FREQUENCY" }),
          jsxRuntimeExports.jsxs("div", { children: [
            jsxRuntimeExports.jsx("strong", { children: ChaseFrequency(chaseFrequency) }),
            jsxRuntimeExports.jsx("span", { children: "MHz" })
          ] })
        ] }),
        jsxRuntimeExports.jsx(ChaseTuneForm, {
          snapshot,
          frequency: chaseFrequency,
          setFrequency: chaseSetFrequency,
          action,
          busy
        })
      ] }),
      jsxRuntimeExports.jsx(ChaseDeviceControls, { snapshot, action, busy }),
      jsxRuntimeExports.jsxs("div", { className: "chase-tuner-footer", children: [
        jsxRuntimeExports.jsxs("span", { children: [
          ChaseFrequency(snapshot.config.frequencyMin),
          " –",
          " ",
          ChaseFrequency(snapshot.config.frequencyMax),
          " MHz"
        ] }),
        jsxRuntimeExports.jsx("span", { children: "Public and unlisted stations" })
      ] })
    ] }),
    jsxRuntimeExports.jsxs("section", { className: "chase-directory chase-card", children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-section-heading", children: [
        jsxRuntimeExports.jsxs("div", { children: [
          jsxRuntimeExports.jsxs("h2", { children: [
            "Station directory",
            " ",
            jsxRuntimeExports.jsx("span", { className: "chase-count-pill", children: snapshot.stations.length })
          ] }),
          jsxRuntimeExports.jsx("p", { children: "Public broadcasts available in the city." })
        ] }),
        jsxRuntimeExports.jsxs("div", { className: "chase-segmented", "aria-label": "Filter stations", children: [
          jsxRuntimeExports.jsx("button", {
            className: chaseFilter === "all" ? "chase-selected" : "",
            "aria-pressed": chaseFilter === "all",
            onClick: () => chaseSetFilter("all"),
            children: "All stations"
          }),
          jsxRuntimeExports.jsx("button", {
            className: chaseFilter === "live" ? "chase-selected" : "",
            "aria-pressed": chaseFilter === "live",
            onClick: () => chaseSetFilter("live"),
            children: "On air"
          })
        ] })
      ] }),
      jsxRuntimeExports.jsxs("label", { className: "chase-search", children: [
        jsxRuntimeExports.jsx(ChaseIcon, { name: "search", size: 19 }),
        jsxRuntimeExports.jsx("input", {
          "aria-label": "Search stations",
          placeholder: "Search name or frequency",
          value: chaseSearch,
          onChange: (chaseEvent) => chaseSetSearch(chaseEvent.target.value)
        })
      ] }),
      jsxRuntimeExports.jsxs("div", { className: "chase-table-heading", children: [
        jsxRuntimeExports.jsx("span", { children: "Station" }),
        jsxRuntimeExports.jsx("span", { children: "Frequency" }),
        jsxRuntimeExports.jsx("span", { children: "Status" })
      ] }),
      jsxRuntimeExports.jsx("div", { className: "chase-station-list", children: chaseStations.length ? chaseStations.map((chaseStation) => jsxRuntimeExports.jsxs("button", {
        className: `chase-station-row ${chaseSelected?.id === chaseStation.id ? "chase-station-selected" : ""}`,
        onClick: () => {
          chaseSetSelectedId(chaseStation.id);
          chaseSetFrequency(chaseStation.frequency);
        },
        "aria-pressed": chaseSelected?.id === chaseStation.id,
        children: [
          jsxRuntimeExports.jsx("span", { className: "chase-station-symbol", children: jsxRuntimeExports.jsx(ChaseIcon, {
            name: chaseStation.live ? "broadcast" : "radio",
            size: 22
          }) }),
          jsxRuntimeExports.jsxs("span", { className: "chase-station-text", children: [
            jsxRuntimeExports.jsx("strong", { children: chaseStation.name }),
            jsxRuntimeExports.jsx("span", { children: chaseStation.showTitle || chaseStation.tagline || "No show scheduled" })
          ] }),
          jsxRuntimeExports.jsxs("span", { className: "chase-row-frequency", children: [
            ChaseFrequency(chaseStation.frequency),
            jsxRuntimeExports.jsx("small", { children: "FM" })
          ] }),
          jsxRuntimeExports.jsx(ChaseStatus, { live: chaseStation.live, children: chaseStation.live ? "ON AIR" : "OFF AIR" }),
          jsxRuntimeExports.jsx(ChaseIcon, { name: "arrow", size: 17 })
        ]
      }, chaseStation.id)) : jsxRuntimeExports.jsx(ChaseEmpty, { title: "No stations found", children: "Try another search or tune to a frequency directly." }) })
    ] }),
    jsxRuntimeExports.jsx("aside", { className: "chase-now-playing chase-card", children: chaseSelected ? jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-panel-heading", children: [
        jsxRuntimeExports.jsxs("div", { children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "headphones" }),
          jsxRuntimeExports.jsx("h2", { children: "Station details" })
        ] }),
        jsxRuntimeExports.jsx(ChaseStatus, { live: chaseSelected.live, children: chaseSelected.live ? "ON AIR" : "OFF AIR" })
      ] }),
      jsxRuntimeExports.jsxs("div", { className: "chase-selected-frequency", children: [
        jsxRuntimeExports.jsx("strong", { children: ChaseFrequency(chaseSelected.frequency) }),
        jsxRuntimeExports.jsx("span", { children: "FM" }),
        jsxRuntimeExports.jsx("span", { className: "chase-count-pill", children: chaseTuned ? "CONNECTED" : "SELECTED" })
      ] }),
      jsxRuntimeExports.jsxs("div", { className: "chase-selected-show", children: [
        jsxRuntimeExports.jsx("span", { className: "chase-eyebrow", children: "CURRENT SHOW" }),
        jsxRuntimeExports.jsx("h2", { children: chaseSelected.showTitle || chaseSelected.name }),
        jsxRuntimeExports.jsx("p", { children: chaseSelected.tagline || "No station description." })
      ] }),
      jsxRuntimeExports.jsxs("dl", { className: "chase-detail-list", children: [
        jsxRuntimeExports.jsxs("div", { children: [
          jsxRuntimeExports.jsx("dt", { children: "Station" }),
          jsxRuntimeExports.jsx("dd", { children: chaseSelected.name })
        ] }),
        jsxRuntimeExports.jsxs("div", { children: [
          jsxRuntimeExports.jsx("dt", { children: "Host" }),
          jsxRuntimeExports.jsxs("dd", { children: [
            chaseSelected.hostName || "No host",
            chaseSelected.cohostNames.length ? ` +${chaseSelected.cohostNames.length} co-host${chaseSelected.cohostNames.length === 1 ? "" : "s"}` : ""
          ] })
        ] }),
        jsxRuntimeExports.jsxs("div", { children: [
          jsxRuntimeExports.jsx("dt", { children: "Listeners" }),
          jsxRuntimeExports.jsxs("dd", { children: [
            chaseSelected.listeners,
            " tuned in"
          ] })
        ] })
      ] }),
      jsxRuntimeExports.jsxs("button", {
        className: `chase-button ${chaseTuned ? "chase-secondary" : "chase-primary"} chase-full`,
        disabled: busy || !chaseSelected.live && !chaseTuned,
        onClick: () => void action(chaseTuned ? "untune" : "tune", chaseTuned ? {} : { stationId: chaseSelected.id }, chaseTuned ? "Receiver disconnected." : "Receiver tuned."),
        children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: chaseTuned ? "stop" : "play", size: 17 }),
          chaseTuned ? "Disconnect receiver" : "Listen in"
        ]
      }),
      chaseSelected.id !== snapshot.mine?.id ? jsxRuntimeExports.jsx(ChaseCallControls, {
        snapshot,
        station: chaseSelected,
        action,
        busy
      }) : null,
      jsxRuntimeExports.jsxs("div", { className: "chase-station-actions", children: [
        jsxRuntimeExports.jsxs("button", {
          className: "chase-button chase-secondary",
          onClick: () => chaseSetDialog("message"),
          children: [
            jsxRuntimeExports.jsx(ChaseIcon, { name: "message", size: 18 }),
            "Message studio"
          ]
        }),
        chaseSelected.id !== snapshot.mine?.id ? jsxRuntimeExports.jsxs("button", {
          className: "chase-button chase-secondary",
          onClick: () => chaseSetDialog("tip"),
          children: [
            jsxRuntimeExports.jsx(ChaseIcon, { name: "money", size: 18 }),
            "Tip station"
          ]
        }) : null
      ] }),
      jsxRuntimeExports.jsx("p", { className: "chase-caption", children: "Your receiver stays connected when this panel is closed." })
    ] }) : jsxRuntimeExports.jsx(ChaseEmpty, { title: "Select a station", children: "Choose a station from the directory to view its broadcast." }) }),
    chaseDialog === "message" && chaseSelected ? jsxRuntimeExports.jsx(ChaseRequestDialog, {
      snapshot,
      station: chaseSelected,
      action,
      busy,
      close: () => chaseSetDialog(null)
    }) : null,
    chaseDialog === "tip" && chaseSelected ? jsxRuntimeExports.jsx(ChaseTipDialog, {
      snapshot,
      station: chaseSelected,
      action,
      busy,
      close: () => chaseSetDialog(null)
    }) : null
  ] });
}
const chaseLoadTimeout = 15e3;
const chaseYouTubePatterns = [
  /^https:\/\/(www\.|music\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
  /^https:\/\/youtu\.be\/([A-Za-z0-9_-]{11})/,
  /^https:\/\/(www\.)?youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/
];
const chaseSoundCloudPatterns = [
  /^https:\/\/(www\.|m\.)?soundcloud\.com\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+(\?[^\s]*)?$/,
  /^https:\/\/on\.soundcloud\.com\/[A-Za-z0-9]+/
];
const chaseScripts =  new Map();
let chaseYouTubeReady = null;
let chaseSoundCloudReady = null;
function ChaseCleanTitle(value, fallback) {
  const chaseStrip = (text) => text.replace(/[<>\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  const chaseSource = chaseStrip(value || "") || chaseStrip(fallback);
  return Array.from(chaseSource).slice(0, 120).join("").trim() || "Track";
}
function ChaseVideoId(url) {
  for (const chasePattern of chaseYouTubePatterns) {
    const chaseMatch = chasePattern.exec(url);
    if (chaseMatch)
      return chaseMatch[chaseMatch.length - 1];
  }
  return null;
}
function ChaseDetectProvider(url) {
  if (ChaseVideoId(url))
    return "youtube";
  if (chaseSoundCloudPatterns.some((chasePattern) => chasePattern.test(url)))
    return "soundcloud";
  return null;
}
function ChaseWithTimeout(promise, message, milliseconds = chaseLoadTimeout) {
  let chaseTimer;
  return Promise.race([
    promise,
    new Promise((_, chaseReject) => {
      chaseTimer = window.setTimeout(() => chaseReject(new Error(message)), milliseconds);
    })
  ]).finally(() => window.clearTimeout(chaseTimer));
}
function ChaseLoadScript(src) {
  let chasePending = chaseScripts.get(src);
  if (!chasePending) {
    chasePending = new Promise((chaseResolve, chaseReject) => {
      const chaseScript = document.createElement("script");
      chaseScript.src = src;
      chaseScript.async = true;
      chaseScript.onload = () => chaseResolve();
      chaseScript.onerror = () => {
        chaseScripts.delete(src);
        chaseReject(new Error("The player library could not be loaded."));
      };
      document.head.appendChild(chaseScript);
    });
    chaseScripts.set(src, chasePending);
  }
  return chasePending;
}
function ChaseAwaitGlobal(read, message) {
  return ChaseWithTimeout(new Promise((chaseResolve) => {
    const chaseTimer = window.setInterval(() => {
      const chaseValue = read();
      if (chaseValue) {
        window.clearInterval(chaseTimer);
        chaseResolve(chaseValue);
      }
    }, 100);
  }), message);
}
function ChaseLoadYouTube() {
  chaseYouTubeReady || (chaseYouTubeReady = (async () => {
    if (window.YT?.Player)
      return window.YT;
    const chasePrevious = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => chasePrevious?.();
    await ChaseLoadScript("https://www.youtube.com/iframe_api");
    return ChaseAwaitGlobal(() => window.YT?.Player ? window.YT : void 0, "The YouTube player did not respond.");
  })().catch((chaseFailure) => {
    chaseYouTubeReady = null;
    throw chaseFailure;
  }));
  return chaseYouTubeReady;
}
function ChaseLoadSoundCloud() {
  chaseSoundCloudReady || (chaseSoundCloudReady = (async () => {
    if (window.SC?.Widget)
      return window.SC;
    await ChaseLoadScript("https://w.soundcloud.com/player/api.js");
    return ChaseAwaitGlobal(() => window.SC?.Widget ? window.SC : void 0, "The SoundCloud player did not respond.");
  })().catch((chaseFailure) => {
    chaseSoundCloudReady = null;
    throw chaseFailure;
  }));
  return chaseSoundCloudReady;
}
function ChaseHiddenHost() {
  const chaseHost = document.createElement("div");
  chaseHost.className = "chase-hidden-player";
  chaseHost.setAttribute("aria-hidden", "true");
  document.body.appendChild(chaseHost);
  return chaseHost;
}
function ChaseYouTubeMessage(code) {
  if (code === 100)
    return "This video is unavailable.";
  if (code === 101 || code === 150)
    return "This video does not allow embedded playback.";
  return "The YouTube player failed to play this video.";
}
function ChaseYouTubeEmbed(host, videoId, events) {
  return ChaseLoadYouTube().then((chaseNamespace) => {
    const chaseTarget = document.createElement("div");
    host.appendChild(chaseTarget);
    const chaseVars = {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      playsinline: 1,
      rel: 0
    };
    if (window.location.protocol === "https:")
      chaseVars.origin = window.location.origin;
    return new chaseNamespace.Player(chaseTarget, {
      width: "1",
      height: "1",
      videoId,
      playerVars: chaseVars,
      events: {
        onReady: (chaseEvent) => events.onReady(chaseEvent.target),
        onStateChange: (chaseEvent) => events.onState?.(chaseEvent.data, chaseEvent.target),
        onError: (chaseEvent) => events.onError(ChaseYouTubeMessage(chaseEvent.data))
      }
    });
  });
}
function ChaseSoundCloudEmbed(host, url, events) {
  return ChaseLoadSoundCloud().then((chaseNamespace) => {
    const chaseFrame = document.createElement("iframe");
    chaseFrame.width = "1";
    chaseFrame.height = "1";
    chaseFrame.allow = "autoplay";
    chaseFrame.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=false`;
    host.appendChild(chaseFrame);
    const chaseWidget = chaseNamespace.Widget(chaseFrame);
    chaseWidget.bind(chaseNamespace.Widget.Events.READY, () => events.onReady(chaseWidget));
    chaseWidget.bind(chaseNamespace.Widget.Events.PLAY, () => events.onPlay?.());
    chaseWidget.bind(chaseNamespace.Widget.Events.FINISH, () => events.onFinish?.());
    chaseWidget.bind(chaseNamespace.Widget.Events.ERROR, () => events.onError("The SoundCloud player failed to play this track."));
    return chaseWidget;
  });
}
function ChaseCreatePlayer(options) {
  const chaseHost = ChaseHiddenHost();
  let chaseDestroyed = false;
  let chaseVolume = 1;
  let chaseOffset = 0;
  let chaseWantPlay = false;
  let chaseBackend = null;
  let chaseTeardown = null;
  const chaseReadyTimer = window.setTimeout(() => {
    if (!chaseBackend)
      ChaseFail("The track player did not respond.");
  }, chaseLoadTimeout);
  function ChaseFail(message) {
    if (!chaseDestroyed)
      options.onError?.(message);
  }
  function ChaseAttach(backend, teardown) {
    window.clearTimeout(chaseReadyTimer);
    if (chaseDestroyed) {
      teardown();
      return;
    }
    chaseBackend = backend;
    chaseTeardown = teardown;
    backend.setVolume(chaseVolume);
    backend.seek(chaseOffset);
    if (chaseWantPlay)
      backend.play();
  }
  const chaseSetup = options.provider === "youtube" ? (() => {
    const chaseVideoId = ChaseVideoId(options.url);
    if (!chaseVideoId)
      return Promise.reject(new Error("The YouTube link is invalid."));
    return ChaseYouTubeEmbed(chaseHost, chaseVideoId, {
      onReady: (chasePlayer) => ChaseAttach({
        setVolume: (chaseFraction) => chasePlayer.setVolume(Math.round(chaseFraction * 100)),
        seek: (chaseSeconds) => chasePlayer.seekTo(chaseSeconds, true),
        play: () => chasePlayer.playVideo(),
        destroy: () => chasePlayer.destroy()
      }, () => chasePlayer.destroy()),
      onState: (chaseState) => {
        if (chaseDestroyed)
          return;
        if (chaseState === window.YT?.PlayerState.PLAYING)
          options.onPlaying?.();
        if (chaseState === window.YT?.PlayerState.ENDED)
          options.onEnded?.();
      },
      onError: ChaseFail
    });
  })() : ChaseSoundCloudEmbed(chaseHost, options.url, {
    onReady: (chaseWidget) => ChaseAttach({
      setVolume: (chaseFraction) => chaseWidget.setVolume(Math.round(chaseFraction * 100)),
      seek: (chaseSeconds) => chaseWidget.seekTo(Math.round(chaseSeconds * 1e3)),
      play: () => chaseWidget.play(),
      destroy: () => chaseWidget.pause()
    }, () => chaseWidget.pause()),
    onPlay: () => {
      if (!chaseDestroyed)
        options.onPlaying?.();
    },
    onFinish: () => {
      if (!chaseDestroyed)
        options.onEnded?.();
    },
    onError: ChaseFail
  });
  ChaseWithTimeout(chaseSetup, "The track player did not load in time.").catch((chaseFailure) => ChaseFail(chaseFailure instanceof Error ? chaseFailure.message : "The track player could not be started."));
  return {
    setVolume(fraction) {
      chaseVolume = Math.max(0, Math.min(1, fraction));
      chaseBackend?.setVolume(chaseVolume);
    },
    seek(seconds) {
      chaseOffset = Math.max(0, seconds);
      chaseBackend?.seek(chaseOffset);
    },
    play() {
      chaseWantPlay = true;
      chaseBackend?.play();
    },
    destroy() {
      if (chaseDestroyed)
        return;
      chaseDestroyed = true;
      window.clearTimeout(chaseReadyTimer);
      try {
        chaseTeardown?.();
      } catch {
        chaseTeardown = null;
      }
      chaseBackend = null;
      chaseHost.remove();
    }
  };
}
function ChaseProbeYouTube(host, url, release) {
  const chaseVideoId = ChaseVideoId(url);
  if (!chaseVideoId)
    return Promise.reject(new Error("The YouTube link is invalid."));
  return new Promise((chaseResolve, chaseReject) => {
    let chasePoll;
    let chaseSettled = false;
    let chaseProbe = null;
    release(() => {
      chaseSettled = true;
      window.clearInterval(chasePoll);
      chaseProbe?.destroy();
      chaseProbe = null;
    });
    function ChaseFinish(player) {
      const chaseDuration = player.getDuration();
      if (!(chaseDuration > 0))
        return false;
      chaseSettled = true;
      window.clearInterval(chasePoll);
      const chaseTitle = player.getVideoData().title?.trim();
      chaseResolve({
        provider: "youtube",
        title: ChaseCleanTitle(chaseTitle, url),
        duration: Math.round(chaseDuration)
      });
      return true;
    }
    ChaseYouTubeEmbed(host, chaseVideoId, {
      onReady: (chasePlayer) => {
        if (chaseSettled) {
          chasePlayer.destroy();
          return;
        }
        chaseProbe = chasePlayer;
        if (ChaseFinish(chasePlayer))
          return;
        chasePlayer.mute();
        chasePlayer.playVideo();
        chasePoll = window.setInterval(() => {
          if (!chaseSettled)
            ChaseFinish(chasePlayer);
        }, 250);
      },
      onError: (chaseMessage) => {
        window.clearInterval(chasePoll);
        if (!chaseSettled)
          chaseReject(new Error(chaseMessage));
      }
    }).catch(chaseReject);
  });
}
function ChaseProbeSoundCloud(host, url) {
  return new Promise((chaseResolve, chaseReject) => {
    ChaseSoundCloudEmbed(host, url, {
      onReady: (chaseWidget) => chaseWidget.getCurrentSound((chaseSound) => chaseWidget.getDuration((chaseMilliseconds) => {
        const chaseDuration = Math.round((chaseMilliseconds || chaseSound?.duration || 0) / 1e3);
        if (!(chaseDuration > 0)) {
          chaseReject(new Error("This track has no playable duration."));
          return;
        }
        chaseResolve({
          provider: "soundcloud",
          title: ChaseCleanTitle(chaseSound?.title, url),
          duration: chaseDuration
        });
      })),
      onError: (chaseMessage) => chaseReject(new Error(chaseMessage))
    }).catch(chaseReject);
  });
}
async function ChaseResolveTrack(url) {
  const chaseProvider = ChaseDetectProvider(url.trim());
  if (!chaseProvider)
    throw new Error("Enter a YouTube or SoundCloud track link.");
  const chaseHost = ChaseHiddenHost();
  const chaseCleanups = [];
  try {
    return await ChaseWithTimeout(chaseProvider === "youtube" ? ChaseProbeYouTube(chaseHost, url.trim(), (chaseCleanup) => chaseCleanups.push(chaseCleanup)) : ChaseProbeSoundCloud(chaseHost, url.trim()), "The link took too long to load. Check it and try again.");
  } finally {
    chaseCleanups.forEach((chaseCleanup) => chaseCleanup());
    chaseHost.remove();
  }
}
const chaseStageLabels = {
  stored: "At the depot",
  parked: "Packed & parked",
  deploying: "Deploying rig",
  ready: "Ready to transmit",
  live: "On the air",
  packing: "Packing rig"
};
const chaseProviderLabels = {
  file: "Cartridge",
  youtube: "YouTube",
  soundcloud: "SoundCloud"
};
function ChaseStudio({ snapshot, action, busy, playback }) {
  const [chaseTab, chaseSetTab] = reactExports.useState("console");
  const chaseMine = snapshot.mine;
  const chasePending = snapshot.requests.filter((chaseRequest) => chaseRequest.status === "pending").length;
  if (!chaseMine)
    return jsxRuntimeExports.jsx(ChaseCreateStation, { snapshot, action, busy });
  return jsxRuntimeExports.jsxs("div", { className: "chase-studio", children: [
    snapshot.viewer.canOperate === false ? jsxRuntimeExports.jsxs("div", { className: "chase-operation-note", children: [
      jsxRuntimeExports.jsx(ChaseIcon, { name: "studio", size: 18 }),
      jsxRuntimeExports.jsxs("span", { children: [
        "Broadcast operations require the",
        " ",
        snapshot.config.broadcastJob?.name || "signalworks",
        " job",
        snapshot.config.broadcastJob?.requireDuty ? " while on duty" : "",
        ". You can still safely stop and store your rig."
      ] })
    ] }) : null,
    jsxRuntimeExports.jsxs("section", { className: "chase-studio-banner", children: [
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsx("span", { className: "chase-eyebrow", children: "STATION" }),
        jsxRuntimeExports.jsx("h2", { children: chaseMine.name }),
        jsxRuntimeExports.jsx("p", { children: chaseMine.tagline || "No station description." }),
        jsxRuntimeExports.jsx(ChaseStudioPeople, { station: chaseMine, action, busy })
      ] }),
      jsxRuntimeExports.jsxs("div", { className: "chase-studio-frequency", children: [
        ChaseFrequency(chaseMine.frequency),
        jsxRuntimeExports.jsx("span", { children: "FM" })
      ] }),
      jsxRuntimeExports.jsxs("div", { className: "chase-studio-status", children: [
        jsxRuntimeExports.jsx(ChaseStatus, { live: chaseMine.live, children: chaseMine.live ? "ON AIR" : "OFF AIR" }),
        jsxRuntimeExports.jsx("span", { children: chaseStageLabels[chaseMine.stage] })
      ] })
    ] }),
    playback?.monitor && playback.stationId === chaseMine.id ? jsxRuntimeExports.jsxs("div", {
      className: `chase-studio-cue chase-cue-${playback.phase}`,
      role: "status",
      children: [
        jsxRuntimeExports.jsx(ChaseIcon, { name: "headphones", size: 20 }),
        jsxRuntimeExports.jsxs("div", { children: [
          jsxRuntimeExports.jsx("strong", { children: playback.phase === "playing" ? "Studio cue playing" : playback.phase === "loading" ? "Loading studio cue" : playback.phase === "blocked" ? "Click inside the receiver to enable audio" : "Cartridge audio unavailable" }),
          jsxRuntimeExports.jsxs("span", { children: [
            playback.name,
            playback.phase === "error" ? " · Play the cartridge again to retry." : " · Private local monitoring"
          ] })
        ] })
      ]
    }) : null,
    jsxRuntimeExports.jsx("div", { className: "chase-studio-tabs", "aria-label": "Studio sections", children: [
      { id: "console", label: "Console" },
      { id: "requests", label: "Inbox", count: chasePending },
      { id: "library", label: "Cartridges" },
      { id: "music", label: "Music" },
      { id: "crew", label: "Crew" },
      { id: "settings", label: "Station settings" }
    ].map((chaseItem) => jsxRuntimeExports.jsxs("button", {
      className: chaseTab === chaseItem.id ? "chase-active-tab" : "",
      "aria-pressed": chaseTab === chaseItem.id,
      onClick: () => chaseSetTab(chaseItem.id),
      children: [
        chaseItem.label,
        chaseItem.count ? jsxRuntimeExports.jsx("span", { children: chaseItem.count }) : null
      ]
    }, chaseItem.id)) }),
    chaseTab === "console" ? jsxRuntimeExports.jsx(ChaseConsole, {
      snapshot,
      station: chaseMine,
      action,
      busy
    }) : null,
    chaseTab === "requests" ? jsxRuntimeExports.jsx(ChaseRequests, { snapshot, action, busy }) : null,
    chaseTab === "library" ? jsxRuntimeExports.jsx(ChaseCartridges, { snapshot, action, busy }) : null,
    chaseTab === "music" ? jsxRuntimeExports.jsx(ChaseMusic, {
      snapshot,
      station: chaseMine,
      action,
      busy
    }) : null,
    chaseTab === "crew" ? jsxRuntimeExports.jsx(ChaseCrew, { snapshot, action, busy }) : null,
    chaseTab === "settings" ? jsxRuntimeExports.jsx(ChaseSettings, {
      station: chaseMine,
      snapshot,
      action,
      busy
    }, chaseMine.id) : null
  ] });
}
function ChaseStudioPeople({ station, action, busy }) {
  if (!station.micLive && !station.caller)
    return null;
  return jsxRuntimeExports.jsxs("div", { className: "chase-studio-people", children: [
    station.micLive ? jsxRuntimeExports.jsxs("span", { children: [
      jsxRuntimeExports.jsx(ChaseIcon, { name: "mic", size: 14 }),
      station.hostName || "Host"
    ] }) : null,
    station.cohostNames.map((chaseName, chaseIndex) => jsxRuntimeExports.jsxs("span", { children: [
      jsxRuntimeExports.jsx(ChaseIcon, { name: "users", size: 14 }),
      chaseName,
      jsxRuntimeExports.jsx("small", { children: "co-host" })
    ] }, `${chaseIndex}-${chaseName}`)),
    station.caller ? jsxRuntimeExports.jsxs("span", { className: "chase-studio-caller", children: [
      jsxRuntimeExports.jsx(ChaseIcon, { name: "phone", size: 14 }),
      station.caller.name,
      jsxRuntimeExports.jsx("small", { children: "on the line" })
    ] }) : null,
    station.caller ? jsxRuntimeExports.jsx("button", {
      className: "chase-text-button",
      disabled: busy || !station.canManage,
      onClick: () => void action("endCall", {}, "Caller disconnected."),
      children: "Hang up caller"
    }) : null
  ] });
}
function ChaseTransmitter({ snapshot, station, action, busy }) {
  const chaseReady = station.stage === "ready" || station.stage === "live";
  const chaseVoiceReady = snapshot.voiceReady && snapshot.viewer.voiceReady;
  const chaseCanOperate = snapshot.viewer.canOperate !== false;
  const chaseIsCoHost = snapshot.viewer.isCoHost === true;
  const chaseCanJoin = station.micLive && snapshot.viewer.isHost !== true && !chaseIsCoHost;
  return jsxRuntimeExports.jsxs("section", { className: "chase-card chase-transmitter", children: [
    jsxRuntimeExports.jsxs("div", { className: "chase-panel-heading", children: [
      jsxRuntimeExports.jsx("span", { className: "chase-eyebrow", children: "TRANSMISSION CONTROL" }),
      jsxRuntimeExports.jsx(ChaseIcon, { name: "signal" })
    ] }),
    jsxRuntimeExports.jsx("h2", { children: station.live ? "Broadcast active" : "Transmission offline" }),
    jsxRuntimeExports.jsx("p", { children: station.live ? station.showTitle || "No show title set." : "Deploy the rig to start broadcasting." }),
    jsxRuntimeExports.jsxs("button", {
      className: `chase-button ${station.live ? "chase-danger" : "chase-primary"}`,
      disabled: busy || !station.canManage || !station.live && (!chaseReady || !chaseCanOperate),
      onClick: () => void action("broadcast", { enabled: !station.live }, station.live ? "Transmission stopped." : "Transmission started."),
      children: [
        jsxRuntimeExports.jsx(ChaseIcon, { name: station.live ? "stop" : "play", size: 17 }),
        station.live ? "End broadcast" : "Start broadcast"
      ]
    }),
    jsxRuntimeExports.jsxs("div", { className: "chase-mic-control", children: [
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsx("span", {
          className: `chase-mic-icon ${station.micLive ? "chase-mic-on" : ""}`,
          children: jsxRuntimeExports.jsx(ChaseIcon, { name: "mic" })
        }),
        jsxRuntimeExports.jsxs("span", { children: [
          jsxRuntimeExports.jsx("strong", { children: "Studio microphone" }),
          jsxRuntimeExports.jsx("small", { children: station.micLive ? `${station.hostName || "Host"} is on the mic${station.cohostNames.length ? ` with ${station.cohostNames.join(", ")}` : ""}` : chaseVoiceReady ? "Closed · open when you’re ready" : "Voice integration unavailable" })
        ] })
      ] }),
      chaseCanJoin ? jsxRuntimeExports.jsxs("div", { className: "chase-mic-actions", children: [
        jsxRuntimeExports.jsxs("button", {
          className: "chase-button chase-secondary",
          disabled: busy || !station.canManage || !chaseVoiceReady || !chaseCanOperate,
          onClick: () => void action("microphone", { enabled: true }, "You joined as co-host."),
          children: [
            jsxRuntimeExports.jsx(ChaseIcon, { name: "users", size: 16 }),
            "Join as co-host"
          ]
        }),
        jsxRuntimeExports.jsx("button", {
          className: "chase-text-button",
          disabled: busy || !station.canManage,
          onClick: () => void action("microphone", { enabled: false }, "Microphone closed."),
          children: "Close all"
        })
      ] }) : jsxRuntimeExports.jsx("button", {
        className: `chase-toggle ${station.micLive ? "chase-toggle-on" : ""}`,
        "aria-label": station.micLive ? chaseIsCoHost ? "Leave co-host seat" : "Close microphone" : "Open microphone",
        "aria-pressed": station.micLive,
        disabled: busy || !station.canManage || !station.micLive && (!station.live || !chaseVoiceReady || !chaseCanOperate),
        onClick: () => void action("microphone", { enabled: !station.micLive }, station.micLive ? chaseIsCoHost ? "You left the co-host seat." : "Microphone closed." : "Microphone open."),
        children: jsxRuntimeExports.jsx("span", {})
      })
    ] })
  ] });
}
function ChaseConsole({ snapshot, station, action, busy }) {
  const [chaseAmount, chaseSetAmount] = reactExports.useState("");
  const chaseTransition = station.stage === "deploying" || station.stage === "packing";
  const chaseReady = station.stage === "ready" || station.stage === "live";
  const chaseCanOperate = snapshot.viewer.canOperate !== false;
  return jsxRuntimeExports.jsxs("div", { className: "chase-console-grid", children: [
    jsxRuntimeExports.jsx(ChaseTransmitter, {
      snapshot,
      station,
      action,
      busy
    }),
    jsxRuntimeExports.jsxs("section", { className: "chase-card chase-rig-card", children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-panel-heading", children: [
        jsxRuntimeExports.jsx("span", { className: "chase-eyebrow", children: "MOBILE STUDIO" }),
        jsxRuntimeExports.jsx(ChaseIcon, { name: "van" })
      ] }),
      jsxRuntimeExports.jsxs("div", { className: "chase-rig-state", children: [
        jsxRuntimeExports.jsx("strong", { children: chaseStageLabels[station.stage] }),
        jsxRuntimeExports.jsx("span", { children: station.vehicleNetId ? "Van assigned" : "Van stored" })
      ] }),
      jsxRuntimeExports.jsxs("div", { className: "chase-battery-line", children: [
        jsxRuntimeExports.jsxs("span", { children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "bolt", size: 15 }),
          "Battery"
        ] }),
        jsxRuntimeExports.jsxs("strong", { children: [
          Math.round(station.battery),
          "%"
        ] })
      ] }),
      jsxRuntimeExports.jsx("div", { className: "chase-progress-track", children: jsxRuntimeExports.jsx("span", {
        style: { width: `${Math.max(0, Math.min(100, station.battery))}%` }
      }) }),
      jsxRuntimeExports.jsx("div", { className: "chase-rig-buttons", children: station.stage === "stored" ? jsxRuntimeExports.jsxs("button", {
        className: "chase-button chase-secondary",
        disabled: busy || !station.canManage || !chaseCanOperate,
        onClick: () => void action("spawnVan", {}, "Your studio van is ready."),
        children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "van", size: 17 }),
          "Collect van"
        ]
      }) : jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        jsxRuntimeExports.jsx("button", {
          className: "chase-button chase-secondary",
          disabled: busy || !station.canManage || chaseTransition || !chaseReady && !chaseCanOperate,
          onClick: () => void action(chaseReady ? "pack" : "deploy", {}, chaseReady ? "Rig packing started." : "Rig deployment started."),
          children: chaseTransition ? chaseStageLabels[station.stage] : chaseReady ? "Pack rig" : "Deploy rig"
        }),
        jsxRuntimeExports.jsx("button", {
          className: "chase-button chase-subtle",
          disabled: busy || !station.canManage || station.stage !== "parked",
          onClick: () => void action("storeVan", {}, "Van returned to the depot."),
          children: "Store van"
        })
      ] }) }),
      jsxRuntimeExports.jsxs("button", {
        className: "chase-text-button chase-recharge",
        disabled: busy || !station.canManage || station.stage !== "parked" || station.battery >= 100 || !chaseCanOperate,
        onClick: () => void action("recharge", {}, "Battery recharged."),
        children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "bolt", size: 15 }),
          "Recharge at depot"
        ]
      }),
      jsxRuntimeExports.jsx("p", { className: "chase-caption", children: "Rig controls require you to be beside the van. Collection, storage and charging require the depot." })
    ] }),
    jsxRuntimeExports.jsxs("section", { className: "chase-card chase-studio-stats", children: [
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsx("span", { className: "chase-stat-icon", children: jsxRuntimeExports.jsx(ChaseIcon, { name: "headphones" }) }),
        jsxRuntimeExports.jsx("span", { className: "chase-eyebrow", children: "TUNED IN NOW" }),
        jsxRuntimeExports.jsx("strong", { children: station.listeners.toString().padStart(2, "0") }),
        jsxRuntimeExports.jsx("span", { children: "On your frequency" })
      ] }),
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsx("span", { className: "chase-stat-icon", children: jsxRuntimeExports.jsx(ChaseIcon, { name: "signal" }) }),
        jsxRuntimeExports.jsx("span", { className: "chase-eyebrow", children: "TRANSMITTER POWER" }),
        jsxRuntimeExports.jsx("strong", { children: snapshot.config.powerModes.find((chaseMode) => chaseMode.id === station.power)?.label || station.power }),
        jsxRuntimeExports.jsx("span", { children: station.isPublic ? "Listed in station directory" : "Unlisted frequency" })
      ] })
    ] }),
    jsxRuntimeExports.jsxs("section", { className: "chase-card chase-balance-card", children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-panel-heading", children: [
        jsxRuntimeExports.jsx("span", { className: "chase-eyebrow", children: "STATION BALANCE" }),
        jsxRuntimeExports.jsx(ChaseIcon, { name: "money" })
      ] }),
      station.canWithdraw && typeof station.balance === "number" ? jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        jsxRuntimeExports.jsx("strong", { children: ChaseMoney(station.balance, snapshot.config.currency) }),
        jsxRuntimeExports.jsx("p", { children: "Listener tips fund this balance. Only the owner can withdraw to their account." }),
        jsxRuntimeExports.jsxs("form", {
          className: "chase-input-action",
          onSubmit: async (chaseEvent) => {
            chaseEvent.preventDefault();
            if (await action("withdraw", { amount: Number(chaseAmount) }, "Withdrawal completed."))
              chaseSetAmount("");
          },
          children: [
            jsxRuntimeExports.jsx("span", { children: snapshot.config.currency }),
            jsxRuntimeExports.jsx("input", {
              "aria-label": "Withdrawal amount",
              type: "number",
              min: "1",
              max: station.balance,
              step: "1",
              required: true,
              placeholder: "Amount",
              value: chaseAmount,
              onChange: (chaseEvent) => chaseSetAmount(chaseEvent.target.value)
            }),
            jsxRuntimeExports.jsx("button", {
              className: "chase-button chase-secondary",
              disabled: busy || station.balance <= 0,
              children: "Withdraw"
            })
          ]
        })
      ] }) : jsxRuntimeExports.jsx("p", { children: "Station funds are managed by the owner." }),
      jsxRuntimeExports.jsx("p", { className: "chase-caption", children: "Requests and ads are free. Broadcasting does not generate money automatically." })
    ] })
  ] });
}
function ChaseRequests({ snapshot, action, busy, heading = true }) {
  const [chaseFilter, chaseSetFilter] = reactExports.useState("pending");
  const chaseRequests = snapshot.requests.filter((chaseRequest) => chaseFilter === "all" || chaseRequest.status === "pending");
  return jsxRuntimeExports.jsxs("section", { className: "chase-card chase-content-card", children: [
    jsxRuntimeExports.jsxs("div", { className: "chase-section-heading", children: [
      heading ? jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsx("h2", { children: "Studio inbox" }),
        jsxRuntimeExports.jsx("p", { children: "Review listener requests and advertisements." })
      ] }) : null,
      jsxRuntimeExports.jsxs("div", { className: "chase-segmented", children: [
        jsxRuntimeExports.jsx("button", {
          className: chaseFilter === "pending" ? "chase-selected" : "",
          onClick: () => chaseSetFilter("pending"),
          children: "Pending"
        }),
        jsxRuntimeExports.jsx("button", {
          className: chaseFilter === "all" ? "chase-selected" : "",
          onClick: () => chaseSetFilter("all"),
          children: "All messages"
        })
      ] })
    ] }),
    chaseRequests.length ? jsxRuntimeExports.jsx("div", { className: "chase-inbox", children: chaseRequests.map((chaseRequest) => jsxRuntimeExports.jsxs("article", { className: "chase-request-card", children: [
      jsxRuntimeExports.jsx("span", { className: "chase-avatar", children: chaseRequest.senderName.slice(0, 1) }),
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsxs("div", { className: "chase-request-meta", children: [
          jsxRuntimeExports.jsx("strong", { children: chaseRequest.senderName }),
          jsxRuntimeExports.jsx("span", { children: chaseRequest.kind === "advertisement" ? "ADVERTISEMENT" : "REQUEST" }),
          jsxRuntimeExports.jsx("span", { children: chaseRequest.status })
        ] }),
        jsxRuntimeExports.jsx("p", { children: chaseRequest.message }),
        chaseRequest.status === "pending" ? jsxRuntimeExports.jsxs("div", { className: "chase-inline-actions", children: [
          jsxRuntimeExports.jsxs("button", {
            className: "chase-button chase-secondary",
            disabled: busy || !snapshot.mine?.canManage,
            onClick: () => void action("moderateRequest", { requestId: chaseRequest.id, status: "accepted" }, "Message accepted."),
            children: [
              jsxRuntimeExports.jsx(ChaseIcon, { name: "check", size: 16 }),
              "Accept"
            ]
          }),
          jsxRuntimeExports.jsx("button", {
            className: "chase-text-button",
            disabled: busy || !snapshot.mine?.canManage,
            onClick: () => void action("moderateRequest", { requestId: chaseRequest.id, status: "dismissed" }, "Message dismissed."),
            children: "Dismiss"
          })
        ] }) : null
      ] })
    ] }, chaseRequest.id)) }) : jsxRuntimeExports.jsx(ChaseEmpty, { title: "You’re all caught up", children: "Incoming messages will appear here when listeners send a line to your studio." })
  ] });
}
function ChaseCartridges({ snapshot, action, busy }) {
  return jsxRuntimeExports.jsxs("section", { className: "chase-card chase-content-card", children: [
    jsxRuntimeExports.jsxs("div", { className: "chase-section-heading", children: [
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsx("h2", { children: "Cartridge library" }),
        jsxRuntimeExports.jsx("p", { children: "Station idents, intermissions, and sign-offs." })
      ] }),
      jsxRuntimeExports.jsxs("button", {
        className: "chase-button chase-secondary",
        disabled: busy || !snapshot.mine?.canManage,
        onClick: () => void action("stopCartridge", {}, "Cartridge stopped."),
        children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "stop", size: 16 }),
          "Stop playback"
        ]
      })
    ] }),
    jsxRuntimeExports.jsx("div", { className: "chase-cartridge-grid", children: snapshot.cartridges.map((chaseCartridge) => jsxRuntimeExports.jsxs("article", { className: "chase-cartridge-card", children: [
      jsxRuntimeExports.jsx("span", { className: "chase-cartridge-icon", children: jsxRuntimeExports.jsx(ChaseIcon, { name: "cassette", size: 28 }) }),
      jsxRuntimeExports.jsxs("div", { className: "chase-cartridge-details", children: [
        jsxRuntimeExports.jsxs("div", { children: [
          jsxRuntimeExports.jsx("h3", { children: chaseCartridge.name }),
          jsxRuntimeExports.jsx("p", { children: chaseCartridge.description }),
          jsxRuntimeExports.jsxs("span", { children: [
            Math.floor(chaseCartridge.duration / 60),
            ":",
            Math.round(chaseCartridge.duration % 60).toString().padStart(2, "0")
          ] })
        ] }),
        jsxRuntimeExports.jsx("button", {
          className: "chase-icon-button",
          "aria-label": `Play ${chaseCartridge.name}`,
          disabled: busy || !snapshot.mine?.live || !snapshot.mine?.canManage || snapshot.viewer.canOperate === false,
          onClick: () => void action("playCartridge", { cartridgeId: chaseCartridge.id }, "Cartridge playback requested."),
          children: jsxRuntimeExports.jsx(ChaseIcon, { name: "play", size: 18 })
        })
      ] })
    ] }, chaseCartridge.id)) }),
    !snapshot.cartridges.length ? jsxRuntimeExports.jsx(ChaseEmpty, { icon: "cassette", title: "Your shelf is empty", children: "Configured station cartridges will appear here." }) : null,
    jsxRuntimeExports.jsx("p", { className: "chase-caption", children: "Your transmitter must be live and you must be beside the console to play a cartridge. Tuned listeners hear the broadcast, and you hear a private studio cue. The receiver volume slider controls your cue level." })
  ] });
}
function ChaseNowPlaying({ station, action, busy, canEdit }) {
  const chaseNow = station.nowPlaying;
  const [chaseTick, chaseSetTick] = reactExports.useState(Date.now());
  reactExports.useEffect(() => {
    if (!chaseNow)
      return;
    chaseSetTick(Date.now());
    const chaseTimer = window.setInterval(() => chaseSetTick(Date.now()), 1e3);
    return () => window.clearInterval(chaseTimer);
  }, [chaseNow]);
  if (!chaseNow)
    return jsxRuntimeExports.jsxs("div", { className: "chase-now-track chase-now-idle", children: [
      jsxRuntimeExports.jsx("span", { className: "chase-cartridge-icon", children: jsxRuntimeExports.jsx(ChaseIcon, { name: "cassette", size: 24 }) }),
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsx("strong", { children: "Nothing playing" }),
        jsxRuntimeExports.jsx("span", { children: station.live ? "Play a queued track to start the music." : "Start the broadcast to play music." })
      ] })
    ] });
  const chaseElapsed = Math.max(0, Math.min(chaseNow.duration, chaseTick / 1e3 - chaseNow.startedAt));
  return jsxRuntimeExports.jsxs("div", { className: "chase-now-track", children: [
    jsxRuntimeExports.jsx("span", { className: "chase-cartridge-icon", children: jsxRuntimeExports.jsx(ChaseIcon, {
      name: chaseNow.provider === "file" ? "cassette" : "play",
      size: 24
    }) }),
    jsxRuntimeExports.jsxs("div", { children: [
      jsxRuntimeExports.jsx("span", { className: "chase-eyebrow", children: "NOW PLAYING" }),
      jsxRuntimeExports.jsx("strong", { children: chaseNow.title }),
      jsxRuntimeExports.jsxs("span", { children: [
        chaseProviderLabels[chaseNow.provider] || chaseNow.provider,
        " ·",
        " ",
        ChaseClock(chaseElapsed),
        " / ",
        ChaseClock(chaseNow.duration)
      ] }),
      jsxRuntimeExports.jsx("div", { className: "chase-progress-track", children: jsxRuntimeExports.jsx("span", {
        style: {
          width: `${chaseNow.duration > 0 ? Math.min(100, chaseElapsed / chaseNow.duration * 100) : 0}%`
        }
      }) })
    ] }),
    jsxRuntimeExports.jsxs("div", { className: "chase-now-actions", children: [
      jsxRuntimeExports.jsxs("button", {
        className: "chase-button chase-secondary",
        disabled: busy || !canEdit || !station.live,
        onClick: () => void action("skipTrack", {}, "Skipped ahead."),
        children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "arrow", size: 16 }),
          "Skip"
        ]
      }),
      jsxRuntimeExports.jsxs("button", {
        className: "chase-button chase-subtle",
        disabled: busy || !station.canManage,
        onClick: () => void action("stopCartridge", {}, "Playback stopped."),
        children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "stop", size: 16 }),
          "Stop"
        ]
      })
    ] })
  ] });
}
function ChaseMusic({ snapshot, station, action, busy, heading = true }) {
  const [chaseLink, chaseSetLink] = reactExports.useState("");
  const [chaseResolving, chaseSetResolving] = reactExports.useState(false);
  const [chaseIssue, chaseSetIssue] = reactExports.useState("");
  const chaseMusic = snapshot.config.music;
  const chaseQueue = station.queue || [];
  const chaseMode = station.mode || "dj";
  const chaseCanEdit = station.canManage && snapshot.viewer.canOperate !== false;
  const chaseFull = chaseMusic ? chaseQueue.length >= chaseMusic.maxQueue : false;
  if (chaseMusic?.enabled === false)
    return jsxRuntimeExports.jsx("section", { className: "chase-card chase-content-card", children: jsxRuntimeExports.jsx(ChaseEmpty, { icon: "cassette", title: "Music is switched off", children: "Online track playback is disabled on this server." }) });
  async function ChaseAddTrack(event) {
    event.preventDefault();
    const chaseUrl = chaseLink.trim();
    if (!chaseUrl || chaseResolving)
      return;
    chaseSetIssue("");
    const chaseProvider = ChaseDetectProvider(chaseUrl);
    if (!chaseProvider) {
      chaseSetIssue("Enter a YouTube or SoundCloud track link.");
      return;
    }
    if (chaseMusic?.providers?.[chaseProvider] === false) {
      chaseSetIssue(`${chaseProviderLabels[chaseProvider]} links are disabled on this server.`);
      return;
    }
    chaseSetResolving(true);
    try {
      const chaseTrack = await ChaseResolveTrack(chaseUrl);
      if (await action("queueAdd", {
        url: chaseUrl,
        title: chaseTrack.title,
        duration: chaseTrack.duration
      }, "Track added to the queue."))
        chaseSetLink("");
    } catch (chaseFailure) {
      chaseSetIssue(ChaseError(chaseFailure));
    } finally {
      chaseSetResolving(false);
    }
  }
  return jsxRuntimeExports.jsxs("section", { className: "chase-card chase-content-card", children: [
    heading ? jsxRuntimeExports.jsxs("div", { className: "chase-section-heading", children: [
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsx("h2", { children: "Music queue" }),
        jsxRuntimeExports.jsx("p", { children: "Line up YouTube and SoundCloud tracks for your broadcast." })
      ] }),
      jsxRuntimeExports.jsxs("span", { className: "chase-count-pill", children: [
        chaseQueue.length,
        chaseMusic ? ` / ${chaseMusic.maxQueue}` : "",
        " queued"
      ] })
    ] }) : null,
    jsxRuntimeExports.jsx(ChaseNowPlaying, {
      station,
      action,
      busy,
      canEdit: chaseCanEdit
    }),
    jsxRuntimeExports.jsxs("form", { className: "chase-music-add", onSubmit: ChaseAddTrack, children: [
      jsxRuntimeExports.jsx("label", { htmlFor: "chase-track-link", children: "Add a track link" }),
      jsxRuntimeExports.jsxs("div", { className: "chase-input-action", children: [
        jsxRuntimeExports.jsx("input", {
          id: "chase-track-link",
          type: "url",
          placeholder: "https://www.youtube.com/watch?v=… or https://soundcloud.com/…",
          value: chaseLink,
          maxLength: 300,
          required: true,
          disabled: chaseResolving,
          onChange: (chaseEvent) => chaseSetLink(chaseEvent.target.value)
        }),
        jsxRuntimeExports.jsxs("button", {
          className: "chase-button chase-primary",
          disabled: busy || chaseResolving || !chaseCanEdit || chaseFull,
          children: [
            jsxRuntimeExports.jsx(ChaseIcon, { name: "plus", size: 16 }),
            chaseResolving ? "Checking link…" : "Add"
          ]
        })
      ] }),
      chaseIssue ? jsxRuntimeExports.jsx("span", { className: "chase-field-hint chase-field-error", role: "alert", children: chaseIssue }) : jsxRuntimeExports.jsx("span", { className: "chase-field-hint", children: chaseFull ? "The queue is full. Remove a track to add another." : chaseMusic ? `Tracks between ${ChaseClock(chaseMusic.minDurationSeconds)} and ${ChaseClock(chaseMusic.maxDurationSeconds)} long. The title and length are read from the link before it is added.` : "The title and length are read from the link before it is added." })
    ] }),
    jsxRuntimeExports.jsx("div", { className: "chase-queue-list", children: chaseQueue.map((chaseTrack, chaseIndex) => jsxRuntimeExports.jsxs("article", { children: [
      jsxRuntimeExports.jsx("span", { className: "chase-queue-index", children: chaseIndex + 1 }),
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsx("strong", { children: chaseTrack.title }),
        jsxRuntimeExports.jsxs("span", { children: [
          chaseProviderLabels[chaseTrack.provider] || chaseTrack.provider,
          " ",
          "· ",
          ChaseClock(chaseTrack.duration)
        ] })
      ] }),
      jsxRuntimeExports.jsx("button", {
        className: "chase-icon-button",
        "aria-label": `Play ${chaseTrack.title} now`,
        disabled: busy || !station.live || !chaseCanEdit,
        onClick: () => void action("playTrack", { trackId: chaseTrack.id }, "Track playback requested."),
        children: jsxRuntimeExports.jsx(ChaseIcon, { name: "play", size: 18 })
      }),
      jsxRuntimeExports.jsx("button", {
        className: "chase-text-button",
        disabled: busy || !chaseCanEdit,
        onClick: () => void action("queueRemove", { trackId: chaseTrack.id }, "Track removed."),
        children: "Remove"
      })
    ] }, chaseTrack.id)) }),
    !chaseQueue.length ? jsxRuntimeExports.jsx(ChaseEmpty, { icon: "cassette", title: "The queue is empty", children: "Paste a YouTube or SoundCloud link above to line up your first track." }) : null,
    jsxRuntimeExports.jsxs("p", { className: "chase-caption", children: [
      chaseMode === "autonomous" ? "Autonomous mode: while the transmitter is live the queue plays on its own and loops back to the start. Starting a broadcast with queued tracks begins playback automatically." : `DJ-managed mode: play a track to start, the queue continues in order and stops after the last track. Autoplay is ${station.autoplay ? "on" : "off"}.`,
      " ",
      "You must be beside the live console to play or skip a track. Listeners hear the track and you hear a private studio cue."
    ] })
  ] });
}
function ChaseCrew({ snapshot, action, busy }) {
  const [chaseSource, chaseSetSource] = reactExports.useState("");
  return jsxRuntimeExports.jsxs("section", { className: "chase-card chase-content-card", children: [
    jsxRuntimeExports.jsxs("div", { className: "chase-section-heading", children: [
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsx("h2", { children: "Studio crew" }),
        jsxRuntimeExports.jsx("p", { children: "Manage who can operate this station." })
      ] }),
      jsxRuntimeExports.jsxs("span", { className: "chase-count-pill", children: [
        snapshot.crew.length,
        " crew members"
      ] })
    ] }),
    snapshot.mine?.canWithdraw ? jsxRuntimeExports.jsxs("form", {
      className: "chase-crew-invite",
      onSubmit: async (chaseEvent) => {
        chaseEvent.preventDefault();
        if (await action("crewAdd", { source: Number(chaseSource) }, "Crew member added."))
          chaseSetSource("");
      },
      children: [
        jsxRuntimeExports.jsx("label", { htmlFor: "chase-crew-id", children: "Add a connected player" }),
        jsxRuntimeExports.jsxs("div", { className: "chase-input-action", children: [
          jsxRuntimeExports.jsx("input", {
            id: "chase-crew-id",
            type: "number",
            min: "1",
            step: "1",
            placeholder: "Player server ID",
            required: true,
            value: chaseSource,
            onChange: (chaseEvent) => chaseSetSource(chaseEvent.target.value)
          }),
          jsxRuntimeExports.jsxs("button", { className: "chase-button chase-primary", disabled: busy, children: [
            jsxRuntimeExports.jsx(ChaseIcon, { name: "plus", size: 16 }),
            "Add to crew"
          ] })
        ] })
      ]
    }) : null,
    jsxRuntimeExports.jsx("div", { className: "chase-crew-list", children: snapshot.crew.map((chaseMember) => jsxRuntimeExports.jsxs("article", { children: [
      jsxRuntimeExports.jsx("span", { className: "chase-avatar", children: chaseMember.name.slice(0, 1) }),
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsx("strong", { children: chaseMember.name }),
        jsxRuntimeExports.jsxs("span", { children: [
          "Studio crew ·",
          " ",
          chaseMember.source > 0 ? `ID ${chaseMember.source}` : "Offline"
        ] })
      ] }),
      snapshot.mine?.canWithdraw ? jsxRuntimeExports.jsx("button", {
        className: "chase-text-button",
        disabled: busy,
        onClick: () => void action("crewRemove", chaseMember.memberId ? { memberId: chaseMember.memberId } : { source: chaseMember.source }, "Crew member removed."),
        children: "Remove"
      }) : null
    ] }, chaseMember.memberId ?? chaseMember.source)) }),
    !snapshot.crew.length ? jsxRuntimeExports.jsx(ChaseEmpty, { icon: "users", title: "An open seat at the desk", children: "Add a connected player to help run your station." }) : null
  ] });
}
function ChaseStationSettings(station) {
  return {
    name: station.name,
    tagline: station.tagline,
    frequency: station.frequency,
    power: station.power,
    isPublic: station.isPublic,
    showTitle: station.showTitle
  };
}
function ChaseModeControl({ snapshot, station, action, busy }) {
  const chaseMode = station.mode || "dj";
  const chaseCanEdit = station.canManage && snapshot.viewer.canOperate !== false;
  return jsxRuntimeExports.jsxs("div", { className: "chase-mode-control", children: [
    jsxRuntimeExports.jsxs("div", { children: [
      jsxRuntimeExports.jsx("strong", { children: "Station mode" }),
      jsxRuntimeExports.jsx("small", { children: chaseMode === "autonomous" ? "The music queue loops on its own while the transmitter is live." : "A DJ starts tracks. The queue plays in order and stops when it ends." })
    ] }),
    jsxRuntimeExports.jsx("div", { className: "chase-segmented", "aria-label": "Station mode", children: [
      { id: "dj", label: "DJ-managed" },
      { id: "autonomous", label: "Autonomous" }
    ].map((chaseOption) => jsxRuntimeExports.jsx("button", {
      type: "button",
      className: chaseMode === chaseOption.id ? "chase-selected" : "",
      "aria-pressed": chaseMode === chaseOption.id,
      disabled: busy || !chaseCanEdit || chaseMode === chaseOption.id,
      onClick: () => void action("setMode", { mode: chaseOption.id }, "Station mode updated."),
      children: chaseOption.label
    }, chaseOption.id)) })
  ] });
}
function ChaseSettings({ snapshot, station, action, busy }) {
  const [chaseForm, chaseSetForm] = reactExports.useState(ChaseStationSettings(station));
  return jsxRuntimeExports.jsxs("section", { className: "chase-card chase-content-card", children: [
    jsxRuntimeExports.jsx("div", { className: "chase-section-heading", children: jsxRuntimeExports.jsxs("div", { children: [
      jsxRuntimeExports.jsx("h2", { children: "Station settings" }),
      jsxRuntimeExports.jsx("p", { children: "Configure your station identity and transmission." })
    ] }) }),
    jsxRuntimeExports.jsx(ChaseModeControl, {
      snapshot,
      station,
      action,
      busy
    }),
    jsxRuntimeExports.jsxs("form", {
      className: "chase-settings-form",
      onSubmit: async (chaseEvent) => {
        chaseEvent.preventDefault();
        await action("updateStation", chaseForm, "Station settings saved.");
      },
      children: [
        jsxRuntimeExports.jsxs("label", { children: [
          "Station name",
          jsxRuntimeExports.jsx("input", {
            value: chaseForm.name,
            maxLength: 40,
            required: true,
            onChange: (chaseEvent) => chaseSetForm({ ...chaseForm, name: chaseEvent.target.value })
          })
        ] }),
        jsxRuntimeExports.jsxs("label", { children: [
          "Frequency (MHz)",
          jsxRuntimeExports.jsx("input", {
            type: "number",
            min: snapshot.config.frequencyMin / 10,
            max: snapshot.config.frequencyMax / 10,
            step: "0.1",
            required: true,
            value: chaseForm.frequency / 10,
            onChange: (chaseEvent) => chaseSetForm({
              ...chaseForm,
              frequency: Math.round(Number(chaseEvent.target.value) * 10)
            })
          })
        ] }),
        jsxRuntimeExports.jsxs("label", { className: "chase-span-full", children: [
          "Tagline",
          jsxRuntimeExports.jsx("input", {
            value: chaseForm.tagline,
            maxLength: 100,
            onChange: (chaseEvent) => chaseSetForm({ ...chaseForm, tagline: chaseEvent.target.value })
          })
        ] }),
        jsxRuntimeExports.jsxs("label", { className: "chase-span-full", children: [
          "Show title",
          jsxRuntimeExports.jsx("input", {
            value: chaseForm.showTitle,
            maxLength: 80,
            onChange: (chaseEvent) => chaseSetForm({ ...chaseForm, showTitle: chaseEvent.target.value })
          })
        ] }),
        jsxRuntimeExports.jsxs("label", { children: [
          "Transmitter power",
          jsxRuntimeExports.jsx("select", {
            value: chaseForm.power,
            onChange: (chaseEvent) => chaseSetForm({ ...chaseForm, power: chaseEvent.target.value }),
            children: snapshot.config.powerModes.map((chaseMode) => jsxRuntimeExports.jsx("option", { value: chaseMode.id, children: chaseMode.label }, chaseMode.id))
          })
        ] }),
        jsxRuntimeExports.jsxs("label", { className: "chase-checkbox-label", children: [
          jsxRuntimeExports.jsx("input", {
            type: "checkbox",
            checked: chaseForm.isPublic,
            onChange: (chaseEvent) => chaseSetForm({
              ...chaseForm,
              isPublic: chaseEvent.target.checked
            })
          }),
          jsxRuntimeExports.jsxs("span", { children: [
            "List in station directory",
            jsxRuntimeExports.jsx("small", { children: "Unlisted stations can still be tuned by frequency." })
          ] })
        ] }),
        jsxRuntimeExports.jsxs("div", { className: "chase-settings-footer chase-span-full", children: [
          jsxRuntimeExports.jsx("p", { children: "Your changes apply when the station is saved." }),
          jsxRuntimeExports.jsxs("button", {
            className: "chase-button chase-primary",
            disabled: busy || !station.canManage || snapshot.viewer.canOperate === false,
            children: [
              "Save station ",
              jsxRuntimeExports.jsx(ChaseIcon, { name: "check", size: 17 })
            ]
          })
        ] })
      ]
    })
  ] });
}
function ChaseCreateStation({ snapshot, action, busy }) {
  const [chaseName, chaseSetName] = reactExports.useState("");
  const [chaseTagline, chaseSetTagline] = reactExports.useState("");
  const [chaseFrequency, chaseSetFrequency] = reactExports.useState(987);
  return jsxRuntimeExports.jsxs("section", { className: "chase-card chase-create-station", children: [
    jsxRuntimeExports.jsxs("div", { className: "chase-create-intro", children: [
      jsxRuntimeExports.jsx("span", { className: "chase-modal-icon", children: jsxRuntimeExports.jsx(ChaseIcon, { name: "radio", size: 24 }) }),
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsx("h2", { children: "Create your station" }),
        jsxRuntimeExports.jsx("p", { children: "Reserve a frequency and access your mobile studio." })
      ] }),
      jsxRuntimeExports.jsxs("span", { className: "chase-create-price", children: [
        ChaseMoney(snapshot.config.stationPrice, snapshot.config.currency),
        jsxRuntimeExports.jsx("small", { children: "Acquisition price" })
      ] })
    ] }),
    jsxRuntimeExports.jsxs("form", {
      onSubmit: async (chaseEvent) => {
        chaseEvent.preventDefault();
        await action("createStation", {
          name: chaseName,
          tagline: chaseTagline,
          frequency: chaseFrequency
        }, "Your station is ready.");
      },
      children: [
        jsxRuntimeExports.jsxs("label", { children: [
          "Station name",
          jsxRuntimeExports.jsx("input", {
            value: chaseName,
            onChange: (chaseEvent) => chaseSetName(chaseEvent.target.value),
            maxLength: 40,
            required: true,
            placeholder: "Station name"
          })
        ] }),
        jsxRuntimeExports.jsxs("label", { children: [
          "Tagline",
          jsxRuntimeExports.jsx("input", {
            value: chaseTagline,
            onChange: (chaseEvent) => chaseSetTagline(chaseEvent.target.value),
            maxLength: 100,
            placeholder: "Station description"
          })
        ] }),
        jsxRuntimeExports.jsxs("label", { children: [
          "Frequency (MHz)",
          jsxRuntimeExports.jsx("input", {
            type: "number",
            step: "0.1",
            min: snapshot.config.frequencyMin / 10,
            max: snapshot.config.frequencyMax / 10,
            value: chaseFrequency / 10,
            onChange: (chaseEvent) => chaseSetFrequency(Math.round(Number(chaseEvent.target.value) * 10)),
            required: true
          })
        ] }),
        jsxRuntimeExports.jsx("p", { className: "chase-caption", children: "Visit the acquisition point to purchase your station and reserve an available frequency." }),
        jsxRuntimeExports.jsxs("button", {
          className: "chase-button chase-primary chase-full",
          disabled: busy || !snapshot.viewer.canCreate,
          children: [
            "Acquire station ",
            jsxRuntimeExports.jsx(ChaseIcon, { name: "arrow", size: 17 })
          ]
        }),
        !snapshot.viewer.canCreate ? jsxRuntimeExports.jsx("p", { className: "chase-caption", children: "Station acquisition requires authorized Signalworks employment." }) : null
      ]
    })
  ] });
}
function ChaseScanner({ snapshot, notify }) {
  const [chaseFrequency, chaseSetFrequency] = reactExports.useState(987);
  const [chaseBusy, chaseSetBusy] = reactExports.useState(false);
  const [chaseReadings, chaseSetReadings] = reactExports.useState([]);
  const chaseReading = chaseReadings[0];
  async function ChaseTakeReading(event) {
    event.preventDefault();
    if (chaseBusy)
      return;
    chaseSetBusy(true);
    try {
      const chaseResult = await ChasePost("scan", {
        frequency: chaseFrequency
      });
      if (typeof chaseResult?.detected !== "boolean" || !Number.isFinite(chaseResult.frequency))
        throw new Error("The scanner returned an incomplete reading.");
      chaseSetReadings((chaseCurrent) => [chaseResult, ...chaseCurrent].slice(0, 8));
      notify(chaseResult.message || "Scanner reading received.", "info");
    } catch (chaseError) {
      notify(ChaseError(chaseError), "error");
    } finally {
      chaseSetBusy(false);
    }
  }
  if (!snapshot.viewer.isPolice)
    return jsxRuntimeExports.jsx("section", { className: "chase-card", children: jsxRuntimeExports.jsx(ChaseEmpty, { icon: "scan", title: "Scanner access restricted", children: "A scanner is available to authorized on-duty officers." }) });
  return jsxRuntimeExports.jsxs("div", { className: "chase-scanner-grid", children: [
    jsxRuntimeExports.jsxs("section", { className: "chase-card chase-scanner-main", children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-panel-heading", children: [
        jsxRuntimeExports.jsx("span", { className: "chase-eyebrow", children: "DIRECTIONAL RECEIVER" }),
        jsxRuntimeExports.jsx("span", { className: "chase-count-pill", children: "PASSIVE SCAN" })
      ] }),
      jsxRuntimeExports.jsxs("div", { className: "chase-compass", children: [
        jsxRuntimeExports.jsx("div", { className: "chase-compass-cross" }),
        jsxRuntimeExports.jsx("div", { className: "chase-compass-ring" }),
        jsxRuntimeExports.jsx("div", { className: "chase-compass-inner" }),
        jsxRuntimeExports.jsx("span", { className: "chase-compass-n", children: "N" }),
        jsxRuntimeExports.jsx("span", { className: "chase-compass-e", children: "E" }),
        jsxRuntimeExports.jsx("span", { className: "chase-compass-s", children: "S" }),
        jsxRuntimeExports.jsx("span", { className: "chase-compass-w", children: "W" }),
        chaseReading?.detected ? jsxRuntimeExports.jsx("div", {
          className: "chase-compass-needle",
          style: { transform: `rotate(${chaseReading.bearing}deg)` },
          children: jsxRuntimeExports.jsx(ChaseIcon, { name: "direction", size: 100 })
        }) : jsxRuntimeExports.jsx("div", { className: "chase-compass-idle", children: jsxRuntimeExports.jsx(ChaseIcon, { name: "scan", size: 44 }) }),
        jsxRuntimeExports.jsx("div", { className: "chase-compass-center" })
      ] }),
      jsxRuntimeExports.jsxs("div", { className: "chase-scanner-bearing", children: [
        jsxRuntimeExports.jsx("strong", { children: chaseReading?.detected ? `${Math.round(chaseReading.bearing)}°` : "— —" }),
        jsxRuntimeExports.jsx("span", { children: chaseReading?.detected ? `Approximate bearing · ±${Math.round(chaseReading.uncertainty)}°` : "Awaiting your first reading" })
      ] }),
      jsxRuntimeExports.jsxs("form", { onSubmit: ChaseTakeReading, className: "chase-scanner-form", children: [
        jsxRuntimeExports.jsx("label", { htmlFor: "chase-scan-frequency", children: "Target frequency (MHz)" }),
        jsxRuntimeExports.jsxs("div", { className: "chase-input-action", children: [
          jsxRuntimeExports.jsx("input", {
            id: "chase-scan-frequency",
            type: "number",
            min: snapshot.config.frequencyMin / 10,
            max: snapshot.config.frequencyMax / 10,
            step: "0.1",
            required: true,
            value: chaseFrequency / 10,
            onChange: (chaseEvent) => chaseSetFrequency(Math.round(Number(chaseEvent.target.value) * 10))
          }),
          jsxRuntimeExports.jsxs("button", { className: "chase-button chase-primary", disabled: chaseBusy, children: [
            jsxRuntimeExports.jsx(ChaseIcon, { name: "scan", size: 18 }),
            chaseBusy ? "Reading…" : "Take reading"
          ] })
        ] })
      ] })
    ] }),
    jsxRuntimeExports.jsxs("div", { className: "chase-scanner-side", children: [
      jsxRuntimeExports.jsxs("section", { className: "chase-card chase-content-card", children: [
        jsxRuntimeExports.jsxs("div", { className: "chase-panel-heading", children: [
          jsxRuntimeExports.jsx("span", { className: "chase-eyebrow", children: "SIGNAL INTELLIGENCE" }),
          jsxRuntimeExports.jsx(ChaseIcon, { name: "signal" })
        ] }),
        jsxRuntimeExports.jsx("h2", { children: chaseReading ? chaseReading.detected ? "Signal detected" : "No signal detected" : "Signal information" }),
        jsxRuntimeExports.jsx("p", { children: chaseReading?.message || "Take a reading from your current position. A bearing gives a direction, not a destination." }),
        jsxRuntimeExports.jsxs("div", { className: "chase-scanner-quality", children: [
          jsxRuntimeExports.jsx(ChaseSignal, {
            quality: chaseReading ? chaseReading.detected ? chaseReading.strength : 0 : null
          }),
          jsxRuntimeExports.jsx("span", { children: chaseReading ? `${chaseReading.readings} separated reading${chaseReading.readings === 1 ? "" : "s"}` : "No readings yet" })
        ] }),
        chaseReading?.searchArea ? jsxRuntimeExports.jsxs("div", { className: "chase-search-area", children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "scan", size: 28 }),
          jsxRuntimeExports.jsxs("div", { children: [
            jsxRuntimeExports.jsx("strong", { children: "Approximate search area" }),
            jsxRuntimeExports.jsxs("span", { children: [
              Math.round(chaseReading.searchArea.radius),
              " m radius · check your map"
            ] })
          ] })
        ] }) : jsxRuntimeExports.jsxs("div", { className: "chase-scanner-tip", children: [
          jsxRuntimeExports.jsx("span", { children: "SCAN GUIDANCE" }),
          jsxRuntimeExports.jsx("p", { children: "Move between scans. Geographically separated readings help narrow the search area." })
        ] })
      ] }),
      jsxRuntimeExports.jsxs("section", { className: "chase-card chase-content-card", children: [
        jsxRuntimeExports.jsxs("div", { className: "chase-section-heading", children: [
          jsxRuntimeExports.jsx("h3", { children: "Reading history" }),
          jsxRuntimeExports.jsx("span", { className: "chase-eyebrow", children: "THIS SESSION" })
        ] }),
        chaseReadings.length ? jsxRuntimeExports.jsx("ol", { className: "chase-scan-history", children: chaseReadings.map((chaseItem, chaseIndex) => jsxRuntimeExports.jsxs("li", { children: [
          jsxRuntimeExports.jsx("span", { children: (chaseReadings.length - chaseIndex).toString().padStart(2, "0") }),
          jsxRuntimeExports.jsxs("div", { children: [
            jsxRuntimeExports.jsxs("strong", { children: [
              ChaseFrequency(chaseItem.frequency),
              " FM"
            ] }),
            jsxRuntimeExports.jsx("small", { children: chaseItem.detected ? `${Math.round(chaseItem.bearing)}° bearing · ${Math.round(chaseItem.strength * 100)}% signal` : "No signal detected" })
          ] }),
          jsxRuntimeExports.jsx(ChaseIcon, {
            name: chaseItem.detected ? "signal" : "scan",
            size: 17
          })
        ] }, `${chaseItem.frequency}-${chaseIndex}`)) }) : jsxRuntimeExports.jsx("p", { className: "chase-caption", children: "Your recent readings will appear here. No exact transmitter location is displayed." })
      ] })
    ] })
  ] });
}
function ChaseDirectory({ snapshot, speech, action, busy, refresh }) {
  const [chaseSearch, chaseSetSearch] = reactExports.useState("");
  const chaseActive = snapshot.stations.filter((chaseStation) => chaseStation.live === true);
  const chaseStations = chaseActive.filter((chaseStation) => `${chaseStation.name} ${chaseStation.micLive ? chaseStation.hostName || "" : ""} ${ChaseFrequency(chaseStation.frequency)}`.toLowerCase().includes(chaseSearch.trim().toLowerCase()));
  const chaseCanTune = !snapshot.devices || snapshot.devices.active !== "none";
  return jsxRuntimeExports.jsxs("section", { className: "chase-active-directory chase-card", children: [
    jsxRuntimeExports.jsxs("div", { className: "chase-section-heading", children: [
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsxs("h2", { children: [
          "On the air",
          " ",
          jsxRuntimeExports.jsx("span", { className: "chase-count-pill", children: chaseActive.length })
        ] }),
        jsxRuntimeExports.jsx("p", { children: "Current broadcasts in your station directory." })
      ] }),
      jsxRuntimeExports.jsxs("button", {
        className: "chase-button chase-secondary",
        disabled: busy,
        onClick: refresh,
        children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "refresh", size: 18 }),
          "Refresh frequencies"
        ]
      })
    ] }),
    jsxRuntimeExports.jsxs("label", { className: "chase-search", children: [
      jsxRuntimeExports.jsx(ChaseIcon, { name: "search", size: 19 }),
      jsxRuntimeExports.jsx("input", {
        "aria-label": "Search active frequencies",
        placeholder: "Search station, host or frequency",
        value: chaseSearch,
        onChange: (chaseEvent) => chaseSetSearch(chaseEvent.target.value)
      })
    ] }),
    !chaseCanTune ? jsxRuntimeExports.jsxs("p", { className: "chase-directory-hint", children: [
      jsxRuntimeExports.jsx(ChaseIcon, { name: "headphones", size: 18 }),
      "Equip a receiver in Listen to tune in."
    ] }) : null,
    chaseStations.length ? jsxRuntimeExports.jsxs("div", { className: "chase-active-list", children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-active-columns", "aria-hidden": "true", children: [
        jsxRuntimeExports.jsx("span", { children: "Station" }),
        jsxRuntimeExports.jsx("span", { children: "Frequency" }),
        jsxRuntimeExports.jsx("span", { children: "Host" }),
        jsxRuntimeExports.jsx("span", { children: "Microphone" }),
        jsxRuntimeExports.jsx("span", {})
      ] }),
      chaseStations.map((chaseStation) => {
        const chaseTalking = speech?.local.talking && speech.local.stationId === chaseStation.id || speech?.receiver?.talking && speech.receiver.stationId === chaseStation.id;
        const chaseConnected = snapshot.tunedStationId === chaseStation.id;
        return jsxRuntimeExports.jsxs("article", { className: "chase-active-row", children: [
          jsxRuntimeExports.jsxs("div", { className: "chase-active-name", children: [
            jsxRuntimeExports.jsx("span", { className: "chase-station-symbol", children: jsxRuntimeExports.jsx(ChaseIcon, { name: "broadcast", size: 22 }) }),
            jsxRuntimeExports.jsxs("div", { children: [
              jsxRuntimeExports.jsx("h3", { children: chaseStation.name }),
              jsxRuntimeExports.jsx("p", { children: chaseStation.showTitle || "Live broadcast" })
            ] })
          ] }),
          jsxRuntimeExports.jsxs("div", { className: "chase-active-frequency", children: [
            jsxRuntimeExports.jsx("span", { className: "chase-mobile-label", children: "Frequency" }),
            jsxRuntimeExports.jsxs("strong", { children: [
              ChaseFrequency(chaseStation.frequency),
              " ",
              jsxRuntimeExports.jsx("small", { children: "FM" })
            ] })
          ] }),
          jsxRuntimeExports.jsxs("div", { className: "chase-active-host", children: [
            jsxRuntimeExports.jsx("span", { className: "chase-mobile-label", children: "Host" }),
            jsxRuntimeExports.jsxs("span", { children: [
              chaseStation.micLive && chaseStation.hostName ? chaseStation.hostName : "No host",
              chaseStation.micLive && chaseStation.cohostNames.length ? jsxRuntimeExports.jsxs("small", { className: "chase-cohost-count", children: [
                "+",
                chaseStation.cohostNames.length,
                " co-host",
                chaseStation.cohostNames.length === 1 ? "" : "s"
              ] }) : null
            ] })
          ] }),
          jsxRuntimeExports.jsxs("span", {
            className: `chase-directory-speech ${chaseTalking ? "chase-speech-onair" : ""}`,
            children: [
              jsxRuntimeExports.jsx(ChaseIcon, { name: "mic", size: 17 }),
              chaseTalking ? "On-air speech" : chaseStation.micLive ? "Mic open" : "Mic closed"
            ]
          }),
          jsxRuntimeExports.jsxs("button", {
            className: `chase-button ${chaseConnected ? "chase-secondary" : "chase-primary"}`,
            disabled: busy || !chaseCanTune || chaseConnected,
            "aria-label": chaseConnected ? `Tuned to ${chaseStation.name}` : `Tune to ${chaseStation.name}`,
            onClick: () => void action("tune", { stationId: chaseStation.id }, "Receiver tuned."),
            children: [
              jsxRuntimeExports.jsx(ChaseIcon, {
                name: chaseConnected ? "check" : "headphones",
                size: 17
              }),
              chaseConnected ? "Tuned" : "Tune in"
            ]
          })
        ] }, chaseStation.id);
      })
    ] }) : jsxRuntimeExports.jsx(ChaseEmpty, {
      title: chaseActive.length ? "No matching frequencies" : "No active frequencies",
      children: chaseActive.length ? "Try another station name, host or frequency." : "Stations appear here when they start broadcasting. Refresh to check again."
    })
  ] });
}
const chaseTalkKeyLabels = {
  LMENU: "Left Alt",
  RMENU: "Right Alt",
  CAPITAL: "Caps Lock",
  LSHIFT: "Left Shift",
  RSHIFT: "Right Shift",
  LCONTROL: "Left Ctrl",
  RCONTROL: "Right Ctrl",
  SPACE: "Space"
};
function ChaseTalkKeyLabel(key) {
  const chaseKey = typeof key === "string" && key.trim() ? key.trim() : "CAPITAL";
  return chaseTalkKeyLabels[chaseKey.toUpperCase()] || chaseKey;
}
function ChaseNormalizeSpeech(value) {
  if (!value || typeof value !== "object")
    return null;
  const chaseValue = value;
  if (!chaseValue.local || typeof chaseValue.local !== "object")
    return null;
  const chaseLocal = chaseValue.local;
  const chaseReceiver = chaseValue.receiver;
  return {
    local: {
      ...ChaseSpeechStationFields(chaseLocal),
      mode: chaseLocal.mode === "station" ? "station" : "idle",
      talking: chaseLocal.talking === true,
      micOpen: chaseLocal.micOpen === true,
      transmitting: chaseLocal.transmitting === true,
      role: ["host", "cohost", "caller"].includes(chaseLocal.role) ? chaseLocal.role : void 0
    },
    receiver: chaseReceiver && typeof chaseReceiver === "object" ? {
      ...ChaseSpeechStationFields(chaseReceiver),
      talking: chaseReceiver.talking === true,
      hostSource: Number.isFinite(chaseReceiver.hostSource) ? chaseReceiver.hostSource : void 0
    } : null
  };
}
function ChaseSpeechStationFields(value) {
  return {
    stationId: Number.isFinite(value.stationId) ? value.stationId : void 0,
    stationName: typeof value.stationName === "string" ? value.stationName : void 0,
    frequency: Number.isFinite(value.frequency) ? value.frequency : void 0,
    hostName: typeof value.hostName === "string" ? value.hostName : void 0
  };
}
function ChaseSpeechDetail(value) {
  return [
    value.stationName,
    value.frequency !== void 0 ? `${ChaseFrequency(value.frequency)} FM` : null
  ].filter(Boolean).join(" · ");
}
function ChaseTalkButton({ transmitting, talk }) {
  const chasePressedRef = reactExports.useRef(false);
  const chaseTalkRef = reactExports.useRef(talk);
  chaseTalkRef.current = talk;
  const ChaseSet = reactExports.useCallback((pressed) => {
    if (chasePressedRef.current === pressed)
      return;
    chasePressedRef.current = pressed;
    chaseTalkRef.current(pressed);
  }, []);
  reactExports.useEffect(() => {
    const ChaseRelease = () => ChaseSet(false);
    window.addEventListener("blur", ChaseRelease);
    return () => {
      window.removeEventListener("blur", ChaseRelease);
      ChaseRelease();
    };
  }, [ChaseSet]);
  return jsxRuntimeExports.jsxs("button", {
    type: "button",
    className: "chase-speech-talk",
    "aria-pressed": transmitting,
    onPointerDown: (chaseEvent) => {
      if (chaseEvent.pointerType === "mouse" && chaseEvent.button !== 0)
        return;
      chaseEvent.preventDefault();
      ChaseSet(true);
    },
    onPointerUp: () => ChaseSet(false),
    onPointerLeave: () => ChaseSet(false),
    onPointerCancel: () => ChaseSet(false),
    onKeyDown: (chaseEvent) => {
      if ((chaseEvent.key === " " || chaseEvent.key === "Enter") && !chaseEvent.repeat) {
        chaseEvent.preventDefault();
        ChaseSet(true);
      }
    },
    onKeyUp: (chaseEvent) => {
      if (chaseEvent.key === " " || chaseEvent.key === "Enter") {
        chaseEvent.preventDefault();
        ChaseSet(false);
      }
    },
    onBlur: () => ChaseSet(false),
    onContextMenu: (chaseEvent) => chaseEvent.preventDefault(),
    children: [
      jsxRuntimeExports.jsx(ChaseIcon, { name: "mic", size: 16 }),
      transmitting ? "Live" : "Hold to talk"
    ]
  });
}
function ChaseSpeechIndicator({ speech, hud = false, talkKey, talk }) {
  if (!speech)
    return null;
  const chaseLocal = speech.local;
  const chaseReceiving = speech.receiver?.talking === true ? speech.receiver : null;
  if (!chaseLocal.micOpen && !chaseReceiving)
    return null;
  const chaseTalk = !hud && talk ? talk : null;
  return jsxRuntimeExports.jsxs("div", {
    className: hud ? "chase-speech-hud" : "chase-speech-inline",
    "aria-label": "Speech activity",
    role: "status",
    "aria-live": "off",
    children: [
      chaseLocal.micOpen ? jsxRuntimeExports.jsxs("div", {
        className: `chase-speech-chip ${chaseLocal.transmitting ? "chase-speech-onair" : "chase-speech-ready"}`,
        "data-speech": "local",
        children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "mic", size: 20 }),
          jsxRuntimeExports.jsxs("div", { children: [
            jsxRuntimeExports.jsx("strong", { children: chaseLocal.transmitting ? "ON AIR" : "Station mic" }),
            jsxRuntimeExports.jsx("span", { children: chaseLocal.transmitting ? ChaseSpeechDetail(chaseLocal) || "Station microphone" : chaseTalk ? "Hold the mic button to talk" : `Hold ${ChaseTalkKeyLabel(talkKey)} to talk` })
          ] }),
          chaseTalk ? jsxRuntimeExports.jsx(ChaseTalkButton, {
            transmitting: chaseLocal.transmitting,
            talk: chaseTalk
          }) : null
        ]
      }) : null,
      chaseReceiving ? jsxRuntimeExports.jsxs("div", {
        className: "chase-speech-chip chase-speech-receiving",
        "data-speech": "receiver",
        children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: "headphones", size: 20 }),
          jsxRuntimeExports.jsxs("div", { children: [
            jsxRuntimeExports.jsxs("strong", { children: [
              "On-air speech from",
              " ",
              chaseReceiving.hostName || chaseReceiving.stationName || "the host"
            ] }),
            jsxRuntimeExports.jsx("span", { children: ChaseSpeechDetail(chaseReceiving) || "Station host" })
          ] })
        ]
      }) : null
    ]
  });
}
function ChaseFieldHint() {
  const [chaseHint, chaseSetHint] = reactExports.useState(null);
  reactExports.useEffect(() => {
    function ChaseReceiveHint(event) {
      if (event.data?.type !== "chase_bootleg:fieldHint")
        return;
      const chaseData = event.data.data;
      if (!chaseData || !["carried", "placed"].includes(chaseData.mode)) {
        chaseSetHint(null);
        return;
      }
      const chaseNext = {
        mode: chaseData.mode,
        carry: chaseData.carry === "shoulder" ? "shoulder" : "hand",
        canPlace: chaseData.canPlace === true,
        placeKey: typeof chaseData.placeKey === "string" ? chaseData.placeKey.slice(0, 24) : "Bound key",
        cancelKey: typeof chaseData.cancelKey === "string" ? chaseData.cancelKey.slice(0, 24) : "Bound key"
      };
      chaseSetHint((previous) => previous && previous.mode === chaseNext.mode && previous.carry === chaseNext.carry && previous.canPlace === chaseNext.canPlace && previous.placeKey === chaseNext.placeKey && previous.cancelKey === chaseNext.cancelKey ? previous : chaseNext);
    }
    window.addEventListener("message", ChaseReceiveHint);
    return () => window.removeEventListener("message", ChaseReceiveHint);
  }, []);
  if (!chaseHint)
    return null;
  return jsxRuntimeExports.jsxs("aside", { className: "chase-field-hint", "aria-label": "Field Radio controls", children: [
    jsxRuntimeExports.jsxs("div", { className: "chase-field-hint-title", children: [
      jsxRuntimeExports.jsx(ChaseIcon, { name: "radio", size: 21 }),
      jsxRuntimeExports.jsx("strong", { children: "Field Radio" }),
      jsxRuntimeExports.jsx("span", { children: chaseHint.mode === "placed" ? "On the floor" : chaseHint.carry === "shoulder" ? "Shoulder carry" : "Hand carry" })
    ] }),
    jsxRuntimeExports.jsxs("div", { className: "chase-field-hint-actions", children: [
      chaseHint.mode === "placed" || chaseHint.canPlace ? jsxRuntimeExports.jsxs("span", { children: [
        jsxRuntimeExports.jsx("kbd", { children: chaseHint.placeKey }),
        chaseHint.mode === "placed" ? "Pick up radio" : "Place on floor"
      ] }) : null,
      chaseHint.mode === "carried" ? jsxRuntimeExports.jsxs("span", { children: [
        jsxRuntimeExports.jsx("kbd", { children: chaseHint.cancelKey }),
        "Put away"
      ] }) : jsxRuntimeExports.jsx("span", { children: "Third eye · Tune / call host" })
    ] }),
    jsxRuntimeExports.jsx("small", { children: "Change controls in Settings → Key Bindings → FiveM" })
  ] });
}
const chasePhoneTabs = [
  { id: "home", label: "Home", icon: "home" },
  { id: "listen", label: "Listen", icon: "radio" },
  { id: "stations", label: "Stations", icon: "broadcast" },
  { id: "devices", label: "Devices", icon: "headphones" },
  { id: "studio", label: "Studio", icon: "studio" }
];
function ChasePhoneApp({ snapshot, loading, busy, error, speech, talkKey, talk, quality, volume, toast, action, bootstrap, changeVolume, saveVolume, dismissToast, callPopup }) {
  const [chaseTab, chaseSetTab] = reactExports.useState("home");
  const [chaseSelectedId, chaseSetSelectedId] = reactExports.useState(null);
  const chaseContentRef = reactExports.useRef(null);
  const chaseTunedId = snapshot?.tunedStationId ?? null;
  const chaseTunedRef = reactExports.useRef(chaseTunedId);
  const chaseCanOperate = snapshot?.viewer.canOperate === true;
  const chaseTabs = chasePhoneTabs.filter((chaseItem) => chaseItem.id !== "studio" || chaseCanOperate);
  const chaseCurrentTab = chaseTab === "studio" && !chaseCanOperate ? "home" : chaseTab;
  reactExports.useEffect(() => {
    chaseContentRef.current?.scrollTo(0, 0);
  }, [chaseCurrentTab]);
  reactExports.useEffect(() => {
    if (chaseTunedRef.current === chaseTunedId)
      return;
    chaseTunedRef.current = chaseTunedId;
    if (chaseTunedId !== null)
      chaseSetSelectedId(chaseTunedId);
  }, [chaseTunedId]);
  const chaseTuned = snapshot?.stations.find((chaseStation) => chaseStation.id === chaseTunedId);
  const chaseSelected = snapshot?.stations.find((chaseStation) => chaseStation.id === chaseSelectedId) ?? chaseTuned ?? snapshot?.stations[0];
  const chaseOnAir = speech?.local.micOpen === true || snapshot?.viewer.call.state === "onair";
  const chasePillLabel = chaseOnAir ? "On air" : chaseTuned ? `${ChaseFrequency(chaseTuned.frequency)} FM` : chaseTunedId !== null ? "Tuned" : "Off air";
  const chaseNowPlaying = chaseTuned?.nowPlaying?.title || "";
  const chaseActiveDevice = snapshot?.devices && snapshot.devices.active !== "none" ? snapshot.devices.active : null;
  return jsxRuntimeExports.jsxs("div", { className: "chase-phone", children: [
    callPopup,
    jsxRuntimeExports.jsxs("header", { className: "chase-phone-header", children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-phone-header-row", children: [
        jsxRuntimeExports.jsx("h1", { className: "chase-phone-title", children: chasePhoneTabs.find((chaseItem) => chaseItem.id === chaseCurrentTab)?.label ?? "Home" }),
        jsxRuntimeExports.jsxs("span", {
          className: `chase-phone-pill ${chaseOnAir ? "chase-phone-pill-onair" : chaseTunedId !== null ? "chase-phone-pill-tuned" : ""}`,
          role: "status",
          children: [
            jsxRuntimeExports.jsx("i", {}),
            chasePillLabel
          ]
        })
      ] }),
      jsxRuntimeExports.jsx(ChaseSpeechIndicator, { speech, talkKey, talk })
    ] }),
    jsxRuntimeExports.jsxs("main", { className: "chase-phone-content", ref: chaseContentRef, children: [
      error ? jsxRuntimeExports.jsxs("div", { className: "chase-connection-error", role: "alert", children: [
        jsxRuntimeExports.jsx("strong", { children: "Connection interrupted" }),
        jsxRuntimeExports.jsx("p", { children: error }),
        jsxRuntimeExports.jsx("button", {
          className: "chase-button chase-secondary",
          onClick: bootstrap,
          children: "Reconnect"
        })
      ] }) : null,
      snapshot ? jsxRuntimeExports.jsx("fieldset", {
        className: "chase-view-fieldset",
        disabled: busy,
        "aria-busy": busy,
        children: jsxRuntimeExports.jsx("div", { className: "chase-phone-panel", children: chaseCurrentTab === "home" ? jsxRuntimeExports.jsx(ChasePhoneHome, {
          snapshot,
          tuned: chaseTuned,
          tunedId: chaseTunedId,
          onAir: chaseOnAir,
          quality,
          go: chaseSetTab
        }) : chaseCurrentTab === "listen" ? jsxRuntimeExports.jsx(ChasePhoneListen, {
          snapshot,
          station: chaseSelected,
          action,
          busy,
          quality
        }) : chaseCurrentTab === "stations" ? jsxRuntimeExports.jsx(ChasePhoneStations, {
          snapshot,
          selectedId: chaseSelected?.id ?? null,
          action,
          busy: busy || loading,
          refresh: bootstrap,
          select: (chaseId) => {
            chaseSetSelectedId(chaseId);
            chaseSetTab("listen");
          }
        }) : chaseCurrentTab === "devices" ? jsxRuntimeExports.jsx(ChasePhoneDevices, {
          snapshot,
          action,
          busy
        }) : jsxRuntimeExports.jsx(ChasePhoneStudio, {
          snapshot,
          action,
          busy
        }) }, chaseCurrentTab)
      }) : loading ? jsxRuntimeExports.jsxs("div", { className: "chase-loading", role: "status", children: [
        jsxRuntimeExports.jsx(ChaseIcon, { name: "radio", size: 36 }),
        jsxRuntimeExports.jsx("h2", { children: "Connecting…" }),
        jsxRuntimeExports.jsx("p", { children: "Loading your station directory." })
      ] }) : !error ? jsxRuntimeExports.jsx(ChaseEmpty, { title: "The receiver is waiting", children: "Reconnect to load your station directory." }) : null
    ] }),
    jsxRuntimeExports.jsx(ChaseToast, { toast, dismiss: dismissToast }),
    jsxRuntimeExports.jsxs("div", { className: "chase-phone-mini", "aria-label": "Tuned station", children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-phone-mini-row", children: [
        jsxRuntimeExports.jsx("span", { className: "chase-phone-mini-device", children: chaseActiveDevice ? jsxRuntimeExports.jsx("img", {
          src: chaseDeviceImages[chaseActiveDevice],
          alt: chaseDeviceLabels[chaseActiveDevice]
        }) : jsxRuntimeExports.jsx(ChaseIcon, { name: "radio", size: 20 }) }),
        chaseTunedId !== null ? jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          jsxRuntimeExports.jsxs("div", { className: "chase-phone-mini-text", children: [
            jsxRuntimeExports.jsx("strong", { children: chaseTuned?.name || "Unlisted frequency" }),
            jsxRuntimeExports.jsxs("span", { children: [
              chaseTuned ? `${ChaseFrequency(chaseTuned.frequency)} FM` : "Direct tune",
              chaseNowPlaying ? ` · ${chaseNowPlaying}` : ""
            ] })
          ] }),
          jsxRuntimeExports.jsx(ChasePhoneSignal, { quality }),
          jsxRuntimeExports.jsx("button", {
            className: "chase-phone-mini-stop",
            "aria-label": "Disconnect receiver",
            disabled: busy,
            onClick: () => void action("untune", {}, "Receiver disconnected."),
            children: jsxRuntimeExports.jsx(ChaseIcon, { name: "stop", size: 18 })
          })
        ] }) : jsxRuntimeExports.jsxs("div", { className: "chase-phone-mini-text", children: [
          jsxRuntimeExports.jsx("strong", { children: "Nothing tuned in" }),
          jsxRuntimeExports.jsx("span", { children: chaseActiveDevice ? `${chaseDeviceLabels[chaseActiveDevice]} ready` : "Pick a station to connect." })
        ] })
      ] }),
      chaseTunedId !== null ? jsxRuntimeExports.jsxs("div", { className: "chase-phone-mini-volume", children: [
        jsxRuntimeExports.jsx(ChaseIcon, { name: "volume", size: 16 }),
        jsxRuntimeExports.jsx("label", {
          className: "chase-visually-hidden",
          htmlFor: "chase-phone-volume",
          children: "Listening volume"
        }),
        jsxRuntimeExports.jsx("input", {
          id: "chase-phone-volume",
          type: "range",
          min: "0",
          max: "100",
          step: "1",
          value: volume,
          onChange: (chaseEvent) => changeVolume(Number(chaseEvent.target.value)),
          onPointerUp: saveVolume,
          onKeyUp: (chaseEvent) => {
            if ([
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Home",
              "End"
            ].includes(chaseEvent.key))
              saveVolume();
          }
        }),
        jsxRuntimeExports.jsxs("span", { children: [
          volume,
          "%"
        ] })
      ] }) : null
    ] }),
    jsxRuntimeExports.jsx("nav", { className: "chase-phone-nav", "aria-label": "Radio sections", children: chaseTabs.map((chaseItem) => jsxRuntimeExports.jsxs("button", {
      className: chaseCurrentTab === chaseItem.id ? "chase-phone-nav-active" : "",
      "aria-current": chaseCurrentTab === chaseItem.id ? "page" : void 0,
      onClick: () => chaseSetTab(chaseItem.id),
      children: [
        jsxRuntimeExports.jsx(ChaseIcon, { name: chaseItem.icon, size: 22 }),
        jsxRuntimeExports.jsx("span", { children: chaseItem.label })
      ]
    }, chaseItem.id)) })
  ] });
}
function ChasePhoneSignal({ quality }) {
  const chaseLevel = quality === null ? 0 : Math.max(1, Math.round(Math.max(0, Math.min(1, quality)) * 4));
  return jsxRuntimeExports.jsx("span", {
    className: "chase-phone-signal",
    role: "img",
    "aria-label": quality === null ? "Reception unavailable" : `${Math.round(quality * 100)} percent reception`,
    children: [1, 2, 3, 4].map((chaseBar) => jsxRuntimeExports.jsx("i", {
      className: chaseBar <= chaseLevel ? "chase-phone-signal-on" : ""
    }, chaseBar))
  });
}
function ChasePhoneHome({ snapshot, tuned, tunedId, onAir, quality, go }) {
  const chaseLive = snapshot.stations.filter((chaseStation) => chaseStation.live).length;
  const chaseDevices = snapshot.devices;
  const chaseActive = chaseDevices && chaseDevices.active !== "none" ? chaseDeviceLabels[chaseDevices.active] : "Nothing equipped";
  const chasePercent = quality === null ? null : Math.round(Math.max(0, Math.min(1, quality)) * 100);
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    jsxRuntimeExports.jsxs("section", { className: "chase-phone-hero", children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-phone-brand", "aria-label": "Senora Signalworks", children: [
        jsxRuntimeExports.jsx("span", { className: "chase-phone-brand-mark", children: jsxRuntimeExports.jsx(ChaseIcon, { name: "broadcast", size: 18 }) }),
        jsxRuntimeExports.jsx("span", { className: "chase-phone-eyebrow", children: "Senora Signalworks" })
      ] }),
      jsxRuntimeExports.jsxs("h2", { className: "chase-phone-welcome", children: [
        "Welcome back, ",
        snapshot.viewer.name || "listener"
      ] })
    ] }),
    jsxRuntimeExports.jsxs("button", {
      type: "button",
      className: "chase-phone-card chase-phone-status",
      onClick: () => go("listen"),
      children: [
        jsxRuntimeExports.jsxs("span", { className: "chase-phone-card-head", children: [
          jsxRuntimeExports.jsx("span", { className: "chase-phone-eyebrow", children: "Receiver" }),
          jsxRuntimeExports.jsx(ChaseStatus, { live: tunedId !== null, children: onAir ? "ON AIR" : tunedId !== null ? "CONNECTED" : "STANDBY" })
        ] }),
        jsxRuntimeExports.jsx("strong", { className: "chase-phone-status-name", children: tuned?.name || (tunedId !== null ? "Unlisted frequency" : "Off air") }),
        jsxRuntimeExports.jsx("span", { className: "chase-phone-status-line", children: tuned ? `${ChaseFrequency(tuned.frequency)} FM · ${tuned.micLive && tuned.hostName ? `${tuned.hostName} on the mic` : tuned.showTitle || "Independent radio"}` : tunedId !== null ? "Direct tune" : "Pick a station to connect." }),
        tunedId !== null ? jsxRuntimeExports.jsxs("span", { className: "chase-phone-status-signal", children: [
          jsxRuntimeExports.jsx(ChasePhoneSignal, { quality }),
          jsxRuntimeExports.jsx("span", { children: chasePercent === null ? "No reception data" : `${chasePercent}% signal` })
        ] }) : null
      ]
    }),
    jsxRuntimeExports.jsxs("div", { className: "chase-phone-tiles", children: [
      jsxRuntimeExports.jsxs("button", {
        type: "button",
        className: "chase-phone-tile",
        onClick: () => go("listen"),
        children: [
          jsxRuntimeExports.jsx("img", { src: chaseDeviceImages.buds, alt: "" }),
          jsxRuntimeExports.jsx("strong", { children: "Listen" }),
          jsxRuntimeExports.jsx("span", { children: tunedId !== null ? "Now connected" : "Tune a frequency" })
        ]
      }),
      jsxRuntimeExports.jsxs("button", {
        type: "button",
        className: "chase-phone-tile",
        onClick: () => go("stations"),
        children: [
          jsxRuntimeExports.jsx("img", { src: chaseDeviceImages.vehicle, alt: "" }),
          jsxRuntimeExports.jsx("strong", { children: "Stations" }),
          jsxRuntimeExports.jsxs("span", { children: [
            chaseLive,
            " live · ",
            snapshot.stations.length,
            " listed"
          ] })
        ]
      }),
      jsxRuntimeExports.jsxs("button", {
        type: "button",
        className: "chase-phone-tile",
        onClick: () => go("devices"),
        children: [
          jsxRuntimeExports.jsx("img", { src: chaseDeviceImages.portable, alt: "" }),
          jsxRuntimeExports.jsx("strong", { children: "Devices" }),
          jsxRuntimeExports.jsx("span", { children: chaseActive })
        ]
      }),
      snapshot.viewer.canOperate ? jsxRuntimeExports.jsxs("button", {
        type: "button",
        className: "chase-phone-tile",
        onClick: () => go("studio"),
        children: [
          jsxRuntimeExports.jsx("span", { className: "chase-phone-tile-icon", children: jsxRuntimeExports.jsx(ChaseIcon, { name: "studio", size: 26 }) }),
          jsxRuntimeExports.jsx("strong", { children: "Studio" }),
          jsxRuntimeExports.jsx("span", { children: snapshot.mine ? snapshot.mine.live ? "Broadcast active" : chaseStageLabels[snapshot.mine.stage] : "Create a station" })
        ]
      }) : null
    ] })
  ] });
}
function ChasePhoneListen({ snapshot, station, action, busy, quality }) {
  const [chaseFrequency, chaseSetFrequency] = reactExports.useState(station?.frequency ?? snapshot.config.frequencyMin);
  const [chaseDialog, chaseSetDialog] = reactExports.useState(null);
  const chaseTuned = Boolean(station && snapshot.tunedStationId === station.id);
  const chaseOwn = Boolean(station && station.id === snapshot.mine?.id);
  const chasePercent = quality === null ? null : Math.round(Math.max(0, Math.min(1, quality)) * 100);
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    jsxRuntimeExports.jsxs("section", { className: "chase-phone-card", children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-phone-card-head", children: [
        jsxRuntimeExports.jsx("span", { className: "chase-phone-eyebrow", children: "Manual tuning" }),
        jsxRuntimeExports.jsxs("span", { className: "chase-phone-status-signal", children: [
          jsxRuntimeExports.jsx(ChasePhoneSignal, { quality }),
          jsxRuntimeExports.jsx("span", { children: chasePercent === null ? "No signal data" : `${chasePercent}%` })
        ] })
      ] }),
      jsxRuntimeExports.jsxs("div", { className: "chase-phone-frequency", children: [
        jsxRuntimeExports.jsx("strong", { children: ChaseFrequency(chaseFrequency) }),
        jsxRuntimeExports.jsx("span", { children: "MHz" })
      ] }),
      jsxRuntimeExports.jsx(ChaseTuneForm, {
        snapshot,
        frequency: chaseFrequency,
        setFrequency: chaseSetFrequency,
        action,
        busy,
        label: "Tune"
      }),
      jsxRuntimeExports.jsxs("span", { className: "chase-phone-hint", children: [
        ChaseFrequency(snapshot.config.frequencyMin),
        " –",
        " ",
        ChaseFrequency(snapshot.config.frequencyMax),
        " MHz · public and unlisted stations"
      ] })
    ] }),
    station ? jsxRuntimeExports.jsxs("section", { className: "chase-phone-card", children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-phone-card-head", children: [
        jsxRuntimeExports.jsx("span", { className: "chase-phone-eyebrow", children: chaseTuned ? "Tuned in" : "Selected station" }),
        jsxRuntimeExports.jsx(ChaseStatus, { live: station.live, children: station.live ? "ON AIR" : "OFF AIR" })
      ] }),
      jsxRuntimeExports.jsxs("div", { className: "chase-phone-station-title", children: [
        jsxRuntimeExports.jsx("h2", { children: station.name }),
        jsxRuntimeExports.jsxs("span", { className: "chase-phone-station-frequency", children: [
          ChaseFrequency(station.frequency),
          jsxRuntimeExports.jsx("small", { children: "FM" })
        ] })
      ] }),
      jsxRuntimeExports.jsx("p", { children: station.tagline || "No station description." }),
      jsxRuntimeExports.jsxs("dl", { className: "chase-phone-details", children: [
        jsxRuntimeExports.jsxs("div", { children: [
          jsxRuntimeExports.jsx("dt", { children: "Show" }),
          jsxRuntimeExports.jsx("dd", { children: station.showTitle || "No show scheduled" })
        ] }),
        jsxRuntimeExports.jsxs("div", { children: [
          jsxRuntimeExports.jsx("dt", { children: "Host" }),
          jsxRuntimeExports.jsx("dd", { children: station.hostName || "No host" })
        ] }),
        jsxRuntimeExports.jsxs("div", { children: [
          jsxRuntimeExports.jsx("dt", { children: "Co-hosts" }),
          jsxRuntimeExports.jsx("dd", { children: station.cohostNames.length ? station.cohostNames.join(", ") : "None" })
        ] }),
        jsxRuntimeExports.jsxs("div", { children: [
          jsxRuntimeExports.jsx("dt", { children: "Listeners" }),
          jsxRuntimeExports.jsxs("dd", { children: [
            station.listeners,
            " tuned in"
          ] })
        ] })
      ] }),
      jsxRuntimeExports.jsxs("button", {
        className: `chase-button ${chaseTuned ? "chase-secondary" : "chase-primary"} chase-full`,
        disabled: busy || !station.live && !chaseTuned,
        onClick: () => void action(chaseTuned ? "untune" : "tune", chaseTuned ? {} : { stationId: station.id }, chaseTuned ? "Receiver disconnected." : "Receiver tuned."),
        children: [
          jsxRuntimeExports.jsx(ChaseIcon, { name: chaseTuned ? "stop" : "play", size: 17 }),
          chaseTuned ? "Disconnect receiver" : "Listen in"
        ]
      }),
      !chaseOwn ? jsxRuntimeExports.jsx(ChaseCallControls, {
        snapshot,
        station,
        action,
        busy
      }) : null,
      jsxRuntimeExports.jsxs("div", { className: "chase-phone-actions", children: [
        jsxRuntimeExports.jsxs("button", {
          className: "chase-button chase-secondary",
          onClick: () => chaseSetDialog("message"),
          children: [
            jsxRuntimeExports.jsx(ChaseIcon, { name: "message", size: 18 }),
            "Message studio"
          ]
        }),
        !chaseOwn ? jsxRuntimeExports.jsxs("button", {
          className: "chase-button chase-secondary",
          onClick: () => chaseSetDialog("tip"),
          children: [
            jsxRuntimeExports.jsx(ChaseIcon, { name: "money", size: 18 }),
            "Tip station"
          ]
        }) : null
      ] })
    ] }) : jsxRuntimeExports.jsx("section", { className: "chase-phone-card", children: jsxRuntimeExports.jsx(ChaseEmpty, { title: "No stations listed", children: "Tune a frequency directly or check back when a station goes live." }) }),
    chaseDialog === "message" && station ? jsxRuntimeExports.jsx(ChaseRequestDialog, {
      snapshot,
      station,
      action,
      busy,
      close: () => chaseSetDialog(null)
    }) : null,
    chaseDialog === "tip" && station ? jsxRuntimeExports.jsx(ChaseTipDialog, {
      snapshot,
      station,
      action,
      busy,
      close: () => chaseSetDialog(null)
    }) : null
  ] });
}
function ChasePhoneStations({ snapshot, selectedId, action, busy, refresh, select }) {
  const [chaseSearch, chaseSetSearch] = reactExports.useState("");
  const chaseCanTune = !snapshot.devices || snapshot.devices.active !== "none";
  const chaseLive = snapshot.stations.filter((chaseStation) => chaseStation.live).length;
  const chaseStations = snapshot.stations.filter((chaseStation) => `${chaseStation.name} ${chaseStation.hostName || ""} ${ChaseFrequency(chaseStation.frequency)}`.toLowerCase().includes(chaseSearch.trim().toLowerCase()));
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    jsxRuntimeExports.jsxs("label", { className: "chase-search chase-phone-search", children: [
      jsxRuntimeExports.jsx(ChaseIcon, { name: "search", size: 19 }),
      jsxRuntimeExports.jsx("input", {
        "aria-label": "Search stations",
        placeholder: "Search station, host or frequency",
        value: chaseSearch,
        onChange: (chaseEvent) => chaseSetSearch(chaseEvent.target.value)
      })
    ] }),
    jsxRuntimeExports.jsxs("div", { className: "chase-phone-list-head", children: [
      jsxRuntimeExports.jsxs("div", { children: [
        jsxRuntimeExports.jsx("span", { className: "chase-phone-eyebrow", children: "Stations" }),
        jsxRuntimeExports.jsxs("span", { className: "chase-phone-hint", children: [
          chaseLive,
          " live · ",
          snapshot.stations.length,
          " listed"
        ] })
      ] }),
      jsxRuntimeExports.jsx("button", {
        className: "chase-icon-button",
        "aria-label": "Refresh station data",
        disabled: busy,
        onClick: refresh,
        children: jsxRuntimeExports.jsx(ChaseIcon, { name: "refresh", size: 18 })
      })
    ] }),
    !chaseCanTune ? jsxRuntimeExports.jsxs("p", { className: "chase-phone-note", children: [
      jsxRuntimeExports.jsx(ChaseIcon, { name: "headphones", size: 18 }),
      "Equip a receiver in Devices to tune in."
    ] }) : null,
    chaseStations.length ? jsxRuntimeExports.jsx("div", { className: "chase-phone-station-list", children: chaseStations.map((chaseStation) => {
      const chaseConnected = snapshot.tunedStationId === chaseStation.id;
      return jsxRuntimeExports.jsxs("article", {
        className: `chase-phone-station-row ${selectedId === chaseStation.id ? "chase-phone-station-selected" : ""}`,
        children: [
          jsxRuntimeExports.jsxs("button", {
            type: "button",
            className: "chase-phone-station-main",
            "aria-pressed": selectedId === chaseStation.id,
            onClick: () => select(chaseStation.id),
            children: [
              jsxRuntimeExports.jsxs("span", { className: "chase-phone-station-text", children: [
                jsxRuntimeExports.jsx("strong", { children: chaseStation.name }),
                jsxRuntimeExports.jsx("span", { children: chaseStation.micLive && chaseStation.hostName ? `${chaseStation.hostName} on the mic` : chaseStation.hostName ? `Host ${chaseStation.hostName}` : "No host" })
              ] }),
              jsxRuntimeExports.jsxs("span", { className: "chase-phone-station-meta", children: [
                jsxRuntimeExports.jsxs("span", { className: "chase-phone-station-frequency", children: [
                  ChaseFrequency(chaseStation.frequency),
                  jsxRuntimeExports.jsx("small", { children: "FM" })
                ] }),
                jsxRuntimeExports.jsx(ChaseStatus, { live: chaseStation.live, children: chaseStation.live ? "LIVE" : "OFF AIR" })
              ] })
            ]
          }),
          jsxRuntimeExports.jsx("button", {
            type: "button",
            className: `chase-button ${chaseConnected ? "chase-secondary" : "chase-primary"} chase-phone-station-tune`,
            disabled: busy || !chaseStation.live || !chaseCanTune || chaseConnected,
            "aria-label": chaseConnected ? `Tuned to ${chaseStation.name}` : `Tune to ${chaseStation.name}`,
            onClick: () => void action("tune", { stationId: chaseStation.id }, "Receiver tuned."),
            children: chaseConnected ? "Tuned" : "Tune in"
          })
        ]
      }, chaseStation.id);
    }) }) : jsxRuntimeExports.jsx(ChaseEmpty, {
      title: snapshot.stations.length ? "No matching stations" : "No stations listed",
      children: snapshot.stations.length ? "Try another station name, host or frequency." : "Stations appear here when they start broadcasting."
    })
  ] });
}
function ChasePhoneDevices({ snapshot, action, busy }) {
  const chaseDevices = snapshot.devices;
  if (!chaseDevices)
    return jsxRuntimeExports.jsx("section", { className: "chase-phone-card", children: jsxRuntimeExports.jsx(ChaseEmpty, { icon: "headphones", title: "No receivers to manage", children: "This server tunes stations without receiver items." }) });
  const chasePlaced = chaseDevices.placedNearby || [];
  function ChaseStatusLine(device) {
    const chaseOwned = chaseDevices.owned[device];
    if (device === "vehicle")
      return chaseDevices.vehicle.installed ? chaseDevices.vehicle.canControl ? "Installed in this vehicle" : "Installed · take a seat to control" : chaseOwned > 0 ? chaseDevices.vehicle.canInstall ? "Ready to install in this vehicle" : "Sit in the driver’s seat to install" : "Not owned";
    if (chaseDevices.active === device)
      return device === "portable" ? `Equipped · carried in ${chaseDevices.carry}` : "Equipped";
    return chaseOwned > 0 ? "In your inventory" : "Not owned";
  }
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    jsxRuntimeExports.jsx("div", { className: "chase-phone-list-head", children: jsxRuntimeExports.jsxs("div", { children: [
      jsxRuntimeExports.jsx("span", { className: "chase-phone-eyebrow", children: "Listening device" }),
      jsxRuntimeExports.jsx("span", { className: "chase-phone-hint", children: chaseDevices.active === "none" ? "Nothing equipped" : `${chaseDeviceLabels[chaseDevices.active]} equipped` })
    ] }) }),
    ["portable", "buds", "vehicle"].map((chaseDevice) => {
      const chaseActive = chaseDevices.active === chaseDevice;
      const chaseOwned = chaseDevices.owned[chaseDevice];
      const chaseSelectable = chaseDevice === "vehicle" ? chaseDevices.vehicle.installed && chaseDevices.vehicle.canControl : chaseOwned > 0;
      return jsxRuntimeExports.jsxs("article", {
        className: `chase-phone-card chase-phone-device ${chaseActive ? "chase-phone-device-active" : ""}`,
        children: [
          jsxRuntimeExports.jsxs("div", { className: "chase-phone-device-row", children: [
            jsxRuntimeExports.jsx("img", {
              className: "chase-phone-device-art",
              src: chaseDeviceImages[chaseDevice],
              alt: ""
            }),
            jsxRuntimeExports.jsxs("div", { className: "chase-phone-device-text", children: [
              jsxRuntimeExports.jsx("strong", { children: chaseDeviceLabels[chaseDevice] }),
              jsxRuntimeExports.jsx("span", { children: ChaseStatusLine(chaseDevice) })
            ] }),
            jsxRuntimeExports.jsx("span", { className: "chase-phone-chip", children: chaseDevice === "vehicle" && chaseDevices.vehicle.installed ? "Installed" : `${chaseOwned} owned` })
          ] }),
          jsxRuntimeExports.jsxs("div", { className: "chase-phone-device-actions", children: [
            chaseActive ? jsxRuntimeExports.jsx("button", {
              type: "button",
              className: "chase-button chase-secondary",
              disabled: busy,
              onClick: () => void action("equipDevice", { device: "none" }, "Receiver put away."),
              children: "Put away"
            }) : jsxRuntimeExports.jsx("button", {
              type: "button",
              className: "chase-button chase-primary",
              disabled: busy || !chaseSelectable,
              onClick: () => void action("equipDevice", { device: chaseDevice, carry: chaseDevices.carry }, "Receiver selected."),
              children: "Select"
            }),
            chaseDevice === "vehicle" && !chaseDevices.vehicle.installed && chaseOwned > 0 ? jsxRuntimeExports.jsxs("button", {
              type: "button",
              className: "chase-button chase-secondary",
              disabled: busy || !chaseDevices.vehicle.canInstall || !chaseDevices.vehicle.netId,
              onClick: () => void action("installReceiver", { netId: chaseDevices.vehicle.netId }, "Dash Receiver installed."),
              children: [
                jsxRuntimeExports.jsx(ChaseIcon, { name: "van", size: 18 }),
                "Install"
              ]
            }) : null,
            chaseDevice === "portable" ? jsxRuntimeExports.jsx(ChasePlaceButton, {
              snapshot,
              action,
              busy
            }) : null
          ] }),
          chaseDevice === "portable" && chaseActive ? jsxRuntimeExports.jsxs("div", { className: "chase-phone-carry", children: [
            jsxRuntimeExports.jsx("span", { className: "chase-phone-eyebrow", children: "Carry position" }),
            jsxRuntimeExports.jsx("div", { className: "chase-segmented", children: ["hand", "shoulder"].map((chaseCarry) => jsxRuntimeExports.jsx("button", {
              type: "button",
              "aria-pressed": chaseDevices.carry === chaseCarry,
              className: chaseDevices.carry === chaseCarry ? "chase-selected" : "",
              disabled: busy,
              onClick: () => void action("equipDevice", { device: "portable", carry: chaseCarry }, "Carry position updated."),
              children: chaseCarry === "hand" ? "Hand" : "Shoulder"
            }, chaseCarry)) })
          ] }) : null
        ]
      }, chaseDevice);
    }),
    chasePlaced.length ? jsxRuntimeExports.jsxs("section", { className: "chase-phone-card", children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-phone-card-head", children: [
        jsxRuntimeExports.jsx("span", { className: "chase-phone-eyebrow", children: "Radios nearby" }),
        jsxRuntimeExports.jsx("span", { className: "chase-phone-chip", children: chasePlaced.length })
      ] }),
      chasePlaced.map((chaseRadio) => jsxRuntimeExports.jsxs("div", { className: "chase-phone-placed-row", children: [
        jsxRuntimeExports.jsx("img", { src: chaseDeviceImages.portable, alt: "" }),
        jsxRuntimeExports.jsxs("div", { className: "chase-phone-device-text", children: [
          jsxRuntimeExports.jsx("strong", { children: chaseRadio.label }),
          jsxRuntimeExports.jsxs("span", { children: [
            chaseRadio.frequency ? `${ChaseFrequency(chaseRadio.frequency)} FM · ` : "",
            "placed by ",
            chaseRadio.ownerName || "someone"
          ] })
        ] }),
        jsxRuntimeExports.jsxs("button", {
          type: "button",
          className: "chase-button chase-secondary",
          disabled: busy,
          onClick: () => void action("pickupRadio", { netId: chaseRadio.netId }, "Field Radio picked up."),
          children: [
            jsxRuntimeExports.jsx(ChaseIcon, { name: "hand", size: 18 }),
            "Pick up"
          ]
        })
      ] }, chaseRadio.netId))
    ] }) : null,
    chaseDevices.active === "none" ? jsxRuntimeExports.jsx("p", { className: "chase-phone-hint", children: "Equip a receiver to listen. Buy one from the Senora kiosk vendor in Legion Square." }) : null
  ] });
}
function ChasePhoneStudio({ snapshot, action, busy }) {
  const [chaseOpen, chaseSetOpen] = reactExports.useState({
    music: true
  });
  const chaseMine = snapshot.mine;
  if (!chaseMine)
    return jsxRuntimeExports.jsx(ChaseCreateStation, { snapshot, action, busy });
  const chasePending = snapshot.requests.filter((chaseRequest) => chaseRequest.status === "pending").length;
  const chaseQueued = chaseMine.queue?.length ?? 0;
  function ChaseToggle(id) {
    chaseSetOpen((chaseCurrent) => ({
      ...chaseCurrent,
      [id]: !chaseCurrent[id]
    }));
  }
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    jsxRuntimeExports.jsxs("section", { className: "chase-phone-card", children: [
      jsxRuntimeExports.jsxs("div", { className: "chase-phone-card-head", children: [
        jsxRuntimeExports.jsx("span", { className: "chase-phone-eyebrow", children: "Your station" }),
        jsxRuntimeExports.jsx(ChaseStatus, { live: chaseMine.live, children: chaseMine.live ? "ON AIR" : "OFF AIR" })
      ] }),
      jsxRuntimeExports.jsxs("div", { className: "chase-phone-station-title", children: [
        jsxRuntimeExports.jsx("h2", { children: chaseMine.name }),
        jsxRuntimeExports.jsxs("span", { className: "chase-phone-station-frequency", children: [
          ChaseFrequency(chaseMine.frequency),
          jsxRuntimeExports.jsx("small", { children: "FM" })
        ] })
      ] }),
      jsxRuntimeExports.jsxs("p", { children: [
        chaseStageLabels[chaseMine.stage],
        " · ",
        chaseMine.listeners,
        " listening"
      ] }),
      jsxRuntimeExports.jsx(ChaseStudioPeople, { station: chaseMine, action, busy })
    ] }),
    jsxRuntimeExports.jsx(ChaseTransmitter, {
      snapshot,
      station: chaseMine,
      action,
      busy
    }),
    jsxRuntimeExports.jsx(ChasePhoneSection, {
      eyebrow: "Playlist",
      title: "Music queue",
      count: chaseQueued,
      open: chaseOpen.music === true,
      toggle: () => ChaseToggle("music"),
      children: jsxRuntimeExports.jsx(ChaseMusic, {
        snapshot,
        station: chaseMine,
        action,
        busy,
        heading: false
      })
    }),
    jsxRuntimeExports.jsx(ChasePhoneSection, {
      eyebrow: "Listener mail",
      title: "Inbox",
      count: chasePending,
      open: chaseOpen.inbox === true,
      toggle: () => ChaseToggle("inbox"),
      children: jsxRuntimeExports.jsx(ChaseRequests, {
        snapshot,
        action,
        busy,
        heading: false
      })
    }),
    jsxRuntimeExports.jsx(ChasePhoneSection, {
      eyebrow: "Station",
      title: "Settings",
      open: chaseOpen.settings === true,
      toggle: () => ChaseToggle("settings"),
      children: jsxRuntimeExports.jsx(ChasePhoneSettings, {
        snapshot,
        station: chaseMine,
        action,
        busy
      }, chaseMine.id)
    })
  ] });
}
function ChasePhoneSection({ eyebrow, title, count, open, toggle, children }) {
  return jsxRuntimeExports.jsxs("section", {
    className: `chase-phone-section ${open ? "chase-phone-section-open" : ""}`,
    children: [
      jsxRuntimeExports.jsxs("button", {
        type: "button",
        className: "chase-phone-section-toggle",
        "aria-expanded": open,
        onClick: toggle,
        children: [
          jsxRuntimeExports.jsxs("span", { className: "chase-phone-section-title", children: [
            jsxRuntimeExports.jsx("span", { className: "chase-phone-eyebrow", children: eyebrow }),
            jsxRuntimeExports.jsx("strong", { children: title })
          ] }),
          count ? jsxRuntimeExports.jsx("span", { className: "chase-phone-chip", children: count }) : null,
          jsxRuntimeExports.jsx("span", { className: "chase-phone-section-caret", children: jsxRuntimeExports.jsx(ChaseIcon, { name: "caret", size: 18 }) })
        ]
      }),
      jsxRuntimeExports.jsx("div", { className: "chase-phone-section-inner", hidden: !open, children })
    ]
  });
}
function ChasePhoneSettings({ snapshot, station, action, busy }) {
  const [chasePower, chaseSetPower] = reactExports.useState(station.power);
  const [chasePublic, chaseSetPublic] = reactExports.useState(station.isPublic);
  const chaseCanEdit = station.canManage && snapshot.viewer.canOperate !== false;
  return jsxRuntimeExports.jsxs("div", { className: "chase-phone-settings", children: [
    jsxRuntimeExports.jsx(ChaseModeControl, {
      snapshot,
      station,
      action,
      busy
    }),
    jsxRuntimeExports.jsxs("form", {
      onSubmit: async (chaseEvent) => {
        chaseEvent.preventDefault();
        await action("updateStation", {
          ...ChaseStationSettings(station),
          power: chasePower,
          isPublic: chasePublic
        }, "Station settings saved.");
      },
      children: [
        jsxRuntimeExports.jsxs("label", { children: [
          "Transmitter power",
          jsxRuntimeExports.jsx("select", {
            value: chasePower,
            onChange: (chaseEvent) => chaseSetPower(chaseEvent.target.value),
            children: snapshot.config.powerModes.map((chaseMode) => jsxRuntimeExports.jsx("option", { value: chaseMode.id, children: chaseMode.label }, chaseMode.id))
          })
        ] }),
        jsxRuntimeExports.jsxs("label", { className: "chase-checkbox-label", children: [
          jsxRuntimeExports.jsx("input", {
            type: "checkbox",
            checked: chasePublic,
            onChange: (chaseEvent) => chaseSetPublic(chaseEvent.target.checked)
          }),
          jsxRuntimeExports.jsxs("span", { children: [
            "List in station directory",
            jsxRuntimeExports.jsx("small", { children: "Unlisted stations can still be tuned by frequency." })
          ] })
        ] }),
        jsxRuntimeExports.jsx("p", { className: "chase-caption", children: "Name, tagline and show title are edited at the studio console." }),
        jsxRuntimeExports.jsxs("button", {
          className: "chase-button chase-primary chase-full",
          disabled: busy || !chaseCanEdit,
          children: [
            "Save station ",
            jsxRuntimeExports.jsx(ChaseIcon, { name: "check", size: 17 })
          ]
        })
      ]
    })
  ] });
}
function ChasePlaybackVolume(volume, quality, gain, monitor) {
  return volume / 100 * (monitor ? 1 : quality * gain);
}
function ChaseNormalizeProfile(value) {
  const chaseProfile = value && typeof value === "object" ? value : {};
  const chaseLow = Number.isFinite(chaseProfile.low) ? Math.max(20, Math.min(2e3, Number(chaseProfile.low))) : 20;
  return {
    low: chaseLow,
    high: Number.isFinite(chaseProfile.high) ? Math.max(chaseLow + 500, Math.min(2e4, Number(chaseProfile.high))) : 2e4,
    distortion: Number.isFinite(chaseProfile.distortion) ? Math.max(0, Math.min(0.5, Number(chaseProfile.distortion))) : 0
  };
}
function ChaseApplyProfile(graph, profile) {
  const chaseFrequency = (parameter, value) => {
    if (graph.context && typeof parameter.setTargetAtTime === "function")
      parameter.setTargetAtTime(value, graph.context.currentTime, 0.08);
    else
      parameter.value = value;
  };
  chaseFrequency(graph.highpass.frequency, profile.low);
  chaseFrequency(graph.lowpass.frequency, profile.high);
  if (graph.distortion === profile.distortion)
    return;
  graph.distortion = profile.distortion;
  if (profile.distortion === 0) {
    graph.shaper.curve = null;
    return;
  }
  const chaseCurve = new Float32Array(1024);
  const chaseDrive = 1 + profile.distortion * 20;
  for (let chaseIndex = 0; chaseIndex < chaseCurve.length; chaseIndex++) {
    const chaseX = chaseIndex * 2 / (chaseCurve.length - 1) - 1;
    chaseCurve[chaseIndex] = Math.tanh(chaseX * chaseDrive) / Math.tanh(chaseDrive);
  }
  graph.shaper.curve = chaseCurve;
}
function ChaseConnectAudio(context, audio, profile) {
  const chaseHighpass = context.createBiquadFilter();
  chaseHighpass.type = "highpass";
  const chaseLowpass = context.createBiquadFilter();
  chaseLowpass.type = "lowpass";
  const chaseShaper = context.createWaveShaper();
  chaseShaper.oversample = "2x";
  const chaseSource = context.createMediaElementSource(audio);
  const chaseGraph = {
    context,
    source: chaseSource,
    highpass: chaseHighpass,
    lowpass: chaseLowpass,
    shaper: chaseShaper
  };
  ChaseApplyProfile(chaseGraph, profile);
  chaseSource.connect(chaseHighpass);
  chaseHighpass.connect(chaseLowpass);
  chaseLowpass.connect(chaseShaper);
  chaseShaper.connect(context.destination);
  return chaseGraph;
}
function ChaseCreateVolumeFader(write) {
  let chaseCurrent = 0;
  let chaseTarget = 0;
  let chaseTimer;
  let chaseTime = performance.now();
  function ChaseStep() {
    chaseTimer = void 0;
    const chaseNow = performance.now();
    const chaseElapsed = Math.max(1, Math.min(250, chaseNow - chaseTime));
    chaseTime = chaseNow;
    chaseCurrent += (chaseTarget - chaseCurrent) * (1 - Math.exp(-chaseElapsed / 90));
    if (Math.abs(chaseTarget - chaseCurrent) < 1e-3)
      chaseCurrent = chaseTarget;
    write(chaseCurrent);
    if (chaseCurrent !== chaseTarget)
      chaseTimer = setTimeout(ChaseStep, 30);
  }
  return {
    set(value) {
      chaseTarget = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
      if (chaseTimer === void 0) {
        chaseTime = performance.now();
        chaseTimer = setTimeout(ChaseStep, 30);
      }
    },
    cancel() {
      clearTimeout(chaseTimer);
      chaseTimer = void 0;
      chaseCurrent = 0;
      chaseTarget = 0;
    }
  };
}
function ChaseDisconnectAudio(graph) {
  if (!graph)
    return;
  graph.source.disconnect();
  graph.highpass.disconnect();
  graph.lowpass.disconnect();
  graph.shaper.disconnect();
}
const chaseReceiverKinds = ["vehicle", "portable", "buds", "placed"];
const chasePreviewPlaced = {
  netId: 1201,
  stationId: 2,
  frequency: 921,
  label: "SOFT SPOT",
  ownerName: "Cleo",
  quality: 0.86
};
function ChaseApp() {
  const [chaseVisible, chaseSetVisible] = reactExports.useState(chasePreview || chasePhone);
  const [chaseReceiver, chaseSetReceiver] = reactExports.useState(chasePreview && chaseReceiverKinds.includes(new URLSearchParams(location.search).get("compact") || "") ? new URLSearchParams(location.search).get("compact") : null);
  const [chasePlaced, chaseSetPlaced] = reactExports.useState(chasePreview && new URLSearchParams(location.search).get("compact") === "placed" ? chasePreviewPlaced : null);
  const [chaseView, chaseSetView] = reactExports.useState("listen");
  const [chaseSpeech, chaseSetSpeech] = reactExports.useState(null);
  const [chaseSpeechEnabled, chaseSetSpeechEnabled] = reactExports.useState(true);
  const [chaseSpeechHud, chaseSetSpeechHud] = reactExports.useState(true);
  const [chaseSpeechTalkKey, chaseSetSpeechTalkKey] = reactExports.useState(void 0);
  const [chasePhoneOpen, chaseSetPhoneOpen] = reactExports.useState(false);
  const [chasePlayback, chaseSetPlayback] = reactExports.useState(null);
  const [chaseSnapshot, chaseSetSnapshot] = reactExports.useState(null);
  const [chaseLoading, chaseSetLoading] = reactExports.useState(false);
  const [chaseBusy, chaseSetBusy] = reactExports.useState(false);
  const [chaseError, chaseSetError] = reactExports.useState("");
  const [chaseToast, chaseSetToast] = reactExports.useState(null);
  const [chaseVolume, chaseSetVolume] = reactExports.useState(65);
  const [chaseQuality, chaseSetQuality] = reactExports.useState(chasePreview ? 0.86 : null);
  const [chaseIncomingCall, chaseSetIncomingCall] = reactExports.useState(null);
  const [chaseCallOverride, chaseSetCallOverride] = reactExports.useState(null);
  const chaseBusyRef = reactExports.useRef(false);
  const chaseVolumeRef = reactExports.useRef(65);
  const chaseQualityRef = reactExports.useRef(1);
  const chaseGainRef = reactExports.useRef(1);
  const chaseContextRef = reactExports.useRef(null);
  const chaseGraphRef = reactExports.useRef(null);
  const chaseProfileRef = reactExports.useRef(ChaseNormalizeProfile(null));
  const chaseAudioRef = reactExports.useRef(null);
  const chasePlayerRef = reactExports.useRef(null);
  const chaseAudioIdentityRef = reactExports.useRef(null);
  const chaseMonitorRef = reactExports.useRef(false);
  const chaseViewRef = reactExports.useRef("listen");
  const chaseGenerationRef = reactExports.useRef(0);
  const chasePanelRef = reactExports.useRef(null);
  const chaseMainRef = reactExports.useRef(null);
  const chaseTalkQueueRef = reactExports.useRef(Promise.resolve());
  const chaseVolumeFaderRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    chaseViewRef.current = chaseView;
    if (chaseMainRef.current)
      chaseMainRef.current.scrollTop = 0;
  }, [chaseView]);
  const ChaseApplyOutputVolume = reactExports.useCallback((value) => {
    chaseVolumeFaderRef.current || (chaseVolumeFaderRef.current = ChaseCreateVolumeFader((chaseLevel) => {
      if (chaseAudioRef.current)
        chaseAudioRef.current.volume = chaseLevel;
      chasePlayerRef.current?.setVolume(chaseLevel);
    }));
    chaseVolumeFaderRef.current.set(value);
  }, []);
  const ChaseChangeVolume = reactExports.useCallback((value) => {
    chaseSetVolume(value);
    chaseVolumeRef.current = value;
    ChaseApplyOutputVolume(ChasePlaybackVolume(value, chaseQualityRef.current, chaseGainRef.current, chaseMonitorRef.current));
  }, [ChaseApplyOutputVolume]);
  const ChaseStopAudio = reactExports.useCallback(() => {
    chaseVolumeFaderRef.current?.cancel();
    chaseAudioRef.current?.pause();
    chaseAudioRef.current = null;
    chasePlayerRef.current?.destroy();
    chasePlayerRef.current = null;
    chaseAudioIdentityRef.current = null;
    chaseMonitorRef.current = false;
    chaseSetPlayback(null);
    ChaseDisconnectAudio(chaseGraphRef.current);
    chaseGraphRef.current = null;
  }, []);
  const ChaseNotify = reactExports.useCallback((message, tone) => {
    chaseSetToast({ message, tone });
  }, []);
  const ChaseStartPlayback = reactExports.useCallback(async (audio) => {
    try {
      if (chaseGraphRef.current && chaseContextRef.current?.state !== "running") {
        let chaseResumeTimeout;
        try {
          await Promise.race([
            chaseContextRef.current?.resume(),
            new Promise((_, chaseReject) => {
              chaseResumeTimeout = window.setTimeout(() => chaseReject(new Error("Audio context needs a gesture.")), 1500);
            })
          ]);
        } finally {
          window.clearTimeout(chaseResumeTimeout);
        }
      }
      if (chaseAudioRef.current !== audio)
        return;
      if (chaseGraphRef.current && chaseContextRef.current?.state !== "running")
        throw new Error("Audio is paused. Click inside the receiver to enable sound.");
      await audio.play();
      if (chaseAudioRef.current === audio)
        chaseSetPlayback((chaseCurrent) => chaseCurrent ? { ...chaseCurrent, phase: "playing" } : null);
      if (chaseAudioRef.current === audio)
        chaseSetToast((chaseCurrent) => chaseCurrent?.message === "Audio is paused. Click inside the receiver to enable sound." ? null : chaseCurrent);
    } catch (chaseFailure) {
      if (chaseAudioRef.current !== audio)
        return;
      const chaseLoadFailed = Boolean(audio.error) || chaseFailure instanceof DOMException && chaseFailure.name === "NotSupportedError";
      chaseSetPlayback((chaseCurrent) => chaseCurrent ? { ...chaseCurrent, phase: chaseLoadFailed ? "error" : "blocked" } : null);
      ChaseNotify(chaseLoadFailed ? "This cartridge could not be loaded." : "Audio is paused. Click inside the receiver to enable sound.", "error");
    }
  }, [ChaseNotify]);
  const ChaseApplySnapshot = reactExports.useCallback((data) => {
    const chaseData = ChaseNormalizeSnapshot(data);
    chaseSetSnapshot(chaseData);
    if (chaseData.speech !== void 0)
      chaseSetSpeech(ChaseNormalizeSpeech(chaseData.speech));
    if (chaseData.config.speech) {
      chaseSetSpeechEnabled(chaseData.config.speech.enabled !== false);
      chaseSetSpeechHud(chaseData.config.speech.hud !== false);
    }
    chaseSetError("");
    chaseSetCallOverride(null);
    if (typeof chaseData.volume === "number") {
      const chaseValue = Math.max(0, Math.min(100, chaseData.volume));
      chaseSetVolume(chaseValue);
      chaseVolumeRef.current = chaseValue;
      ChaseApplyOutputVolume(ChasePlaybackVolume(chaseValue, chaseQualityRef.current, chaseGainRef.current, chaseMonitorRef.current));
    }
  }, [ChaseApplyOutputVolume]);
  const ChaseBootstrap = reactExports.useCallback(async () => {
    const chaseGeneration = ++chaseGenerationRef.current;
    chaseSetLoading(true);
    chaseSetError("");
    try {
      const chaseData = await ChasePost("bootstrap", {
        view: chasePhone ? "listen" : chaseViewRef.current
      });
      if (chaseGeneration === chaseGenerationRef.current)
        ChaseApplySnapshot(chaseData);
    } catch (chaseFailure) {
      if (chaseGeneration === chaseGenerationRef.current)
        chaseSetError(ChaseError(chaseFailure));
    } finally {
      if (chaseGeneration === chaseGenerationRef.current)
        chaseSetLoading(false);
    }
  }, [ChaseApplySnapshot]);
  const ChaseClose = reactExports.useCallback(async () => {
    try {
      await ChasePost("close");
      chaseSetVisible(false);
      chaseSetToast(null);
    } catch (chaseFailure) {
      ChaseNotify(ChaseError(chaseFailure), "error");
    }
  }, [ChaseNotify]);
  const ChaseAction = reactExports.useCallback(async (action, data = {}, message) => {
    if (chaseBusyRef.current)
      return false;
    const chaseGeneration = ++chaseGenerationRef.current;
    chaseBusyRef.current = true;
    chaseSetLoading(false);
    chaseSetBusy(true);
    chaseSetToast(null);
    try {
      const chaseData = await ChasePost("action", {
        action,
        data
      });
      if (chaseGeneration === chaseGenerationRef.current)
        ChaseApplySnapshot(chaseData);
      if (action === "answerCall")
        chaseSetIncomingCall(null);
      if (message)
        ChaseNotify(message, "success");
      if (action === "pickupRadio" && chaseReceiver === "placed")
        void ChaseClose();
      return true;
    } catch (chaseFailure) {
      ChaseNotify(ChaseError(chaseFailure), "error");
      return false;
    } finally {
      chaseBusyRef.current = false;
      chaseSetBusy(false);
    }
  }, [ChaseApplySnapshot, ChaseNotify, ChaseClose, chaseReceiver]);
  const ChaseTalk = reactExports.useCallback((pressed) => {
    chaseTalkQueueRef.current = chaseTalkQueueRef.current.then(() => ChasePost("talk", { pressed })).catch((chaseFailure) => {
      if (pressed)
        ChaseNotify(ChaseError(chaseFailure), "error");
    });
  }, [ChaseNotify]);
  async function ChaseSaveVolume() {
    try {
      await ChasePost("volume", { volume: chaseVolumeRef.current });
    } catch (chaseFailure) {
      ChaseNotify(ChaseError(chaseFailure), "error");
    }
  }
  reactExports.useEffect(() => {
    if (chaseVisible) {
      void ChaseBootstrap();
      chasePanelRef.current?.focus();
    }
  }, [chaseVisible, ChaseBootstrap]);
  reactExports.useEffect(() => {
    function ChaseReceiveMessage(chaseEvent) {
      const chaseData = chaseEvent.data;
      if (!chaseData || typeof chaseData !== "object" || typeof chaseData.type !== "string")
        return;
      if (chaseData.type === "chase_bootleg:visibility") {
        chaseSetVisible(chaseData.visible === true);
        const chasePlacedTarget = chaseData.receiver === "placed" ? ChaseNormalizePlaced(chaseData.placed) : null;
        chaseSetPlaced(chasePlacedTarget);
        chaseSetReceiver((!chaseData.view || chaseData.view === "listen") && chaseReceiverKinds.includes(chaseData.receiver) && (chaseData.receiver !== "placed" || chasePlacedTarget) ? chaseData.receiver : null);
        if (["listen", "studio", "scanner", "directory"].includes(chaseData.view))
          chaseSetView(chaseData.view);
        else if (chaseData.view === "devices")
          chaseSetView("listen");
      } else if (chaseData.type === "chase_bootleg:speech") {
        chaseSetSpeech(ChaseNormalizeSpeech(chaseData.data));
        if (typeof chaseData.enabled === "boolean")
          chaseSetSpeechEnabled(chaseData.enabled);
        if (typeof chaseData.hud === "boolean")
          chaseSetSpeechHud(chaseData.hud);
        if (typeof chaseData.talkKey === "string")
          chaseSetSpeechTalkKey(chaseData.talkKey);
      } else if (chaseData.type === "chase_bootleg:phoneVisibility") {
        chaseSetPhoneOpen(chaseData.visible === true);
      } else if (chaseData.type === "chase_bootleg:snapshot") {
        try {
          ChaseApplySnapshot(chaseData.data);
          chaseGenerationRef.current += 1;
          chaseSetLoading(false);
        } catch (chaseFailure) {
          ChaseNotify(ChaseError(chaseFailure), "error");
        }
      } else if (chaseData.type === "chase_bootleg:toast") {
        if (typeof chaseData.message === "string")
          ChaseNotify(chaseData.message, ["success", "error", "info"].includes(chaseData.tone) ? chaseData.tone : "info");
      } else if (chaseData.type === "chase_bootleg:signal" && Number.isFinite(chaseData.quality)) {
        const chaseSignal = Math.max(0, Math.min(1, chaseData.quality));
        chaseSetQuality(chaseSignal);
        chaseQualityRef.current = chaseSignal;
        if (!chaseMonitorRef.current) {
          chaseProfileRef.current = ChaseNormalizeProfile(chaseData.profile);
          if (chaseGraphRef.current)
            ChaseApplyProfile(chaseGraphRef.current, chaseProfileRef.current);
        }
        chaseGainRef.current = Number.isFinite(chaseData.gain) ? Math.max(0, Math.min(1, chaseData.gain)) : 1;
        ChaseApplyOutputVolume(ChasePlaybackVolume(chaseVolumeRef.current, chaseSignal, chaseGainRef.current, chaseMonitorRef.current));
      } else if (chaseData.type === "chase_bootleg:volume" && Number.isFinite(chaseData.volume)) {
        const chaseValue = Math.max(0, Math.min(100, chaseData.volume));
        chaseSetVolume(chaseValue);
        chaseVolumeRef.current = chaseValue;
        ChaseApplyOutputVolume(ChasePlaybackVolume(chaseValue, chaseQualityRef.current, chaseGainRef.current, chaseMonitorRef.current));
      } else if (chaseData.type === "chase_bootleg:audioStop") {
        ChaseStopAudio();
      } else if (chaseData.type === "chase_bootleg:incomingCall") {
        chaseSetIncomingCall(ChaseNormalizeIncomingCall(chaseData.data));
      } else if (chaseData.type === "chase_bootleg:callState") {
        const chaseState = chaseData.data?.state;
        if (chaseState === "onair" || chaseState === "ringing")
          chaseSetCallOverride({
            state: chaseState,
            stationId: Number.isFinite(chaseData.data.stationId) ? chaseData.data.stationId : void 0,
            stationName: typeof chaseData.data.stationName === "string" ? chaseData.data.stationName : void 0
          });
        else if (["idle", "declined", "ended"].includes(chaseState))
          chaseSetCallOverride({ state: "idle" });
      } else if (chaseData.type === "chase_bootleg:audio" && (chaseData.provider === "youtube" || chaseData.provider === "soundcloud") && typeof chaseData.url === "string" && !chasePreview && !chasePhone) {
        const chaseStarted = Number(chaseData.startedAt);
        const chaseStartedSeconds = Number.isFinite(chaseStarted) ? chaseStarted > 1e12 ? chaseStarted / 1e3 : chaseStarted : null;
        const chaseIdentity = JSON.stringify([
          chaseData.stationId ?? null,
          chaseData.provider,
          chaseData.url,
          chaseStartedSeconds,
          chaseData.duration ?? null
        ]);
        chaseQualityRef.current = Number.isFinite(chaseData.quality) ? Math.max(0, Math.min(1, chaseData.quality)) : 1;
        chaseGainRef.current = Number.isFinite(chaseData.gain) ? Math.max(0, Math.min(1, chaseData.gain)) : 1;
        const chaseMonitor = chaseData.monitor === true;
        const chaseTrackVolume = ChasePlaybackVolume(chaseVolumeRef.current, chaseQualityRef.current, chaseGainRef.current, chaseMonitor);
        if (chaseAudioIdentityRef.current === chaseIdentity && chasePlayerRef.current) {
          chaseMonitorRef.current = chaseMonitor;
          chaseSetPlayback((chaseCurrent) => chaseCurrent ? { ...chaseCurrent, monitor: chaseMonitor } : null);
          ChaseApplyOutputVolume(chaseTrackVolume);
          return;
        }
        ChaseStopAudio();
        const chaseOffset = chaseStartedSeconds !== null ? Math.max(0, Date.now() / 1e3 - chaseStartedSeconds) : 0;
        const chaseDuration = Number(chaseData.duration);
        if (chaseDuration > 0 && chaseOffset >= chaseDuration)
          return;
        const chasePlayer = ChaseCreatePlayer({
          provider: chaseData.provider,
          url: chaseData.url,
          onPlaying: () => {
            if (chasePlayerRef.current === chasePlayer)
              chaseSetPlayback((chaseCurrent) => chaseCurrent ? { ...chaseCurrent, phase: "playing" } : null);
          },
          onEnded: () => {
            if (chasePlayerRef.current === chasePlayer)
              ChaseStopAudio();
          },
          onError: (chaseMessage) => {
            if (chasePlayerRef.current !== chasePlayer)
              return;
            chaseSetPlayback((chaseCurrent) => chaseCurrent ? { ...chaseCurrent, phase: "error" } : null);
            ChaseNotify(chaseMessage, "error");
          }
        });
        chasePlayerRef.current = chasePlayer;
        chaseAudioIdentityRef.current = chaseIdentity;
        chaseMonitorRef.current = chaseMonitor;
        chaseSetPlayback({
          phase: "loading",
          monitor: chaseMonitor,
          stationId: Number.isFinite(chaseData.stationId) ? chaseData.stationId : void 0,
          name: typeof chaseData.title === "string" && chaseData.title ? chaseData.title : typeof chaseData.name === "string" ? chaseData.name : "Track",
          provider: chaseData.provider
        });
        chasePlayer.setVolume(0);
        ChaseApplyOutputVolume(chaseTrackVolume);
        chasePlayer.seek(chaseOffset);
        chasePlayer.play();
      } else if (chaseData.type === "chase_bootleg:audio" && typeof chaseData.url === "string" && !chasePreview && !chasePhone) {
        try {
          const chaseUrl = new URL(chaseData.url, window.location.href);
          if (chaseUrl.protocol !== "https:" && chaseUrl.protocol !== "http:")
            return;
          const chaseStarted = Number(chaseData.startedAt);
          const chaseStartedSeconds = Number.isFinite(chaseStarted) ? chaseStarted > 1e12 ? chaseStarted / 1e3 : chaseStarted : null;
          const chaseIdentity = JSON.stringify([
            chaseData.stationId ?? null,
            chaseUrl.href,
            chaseStartedSeconds,
            chaseData.duration ?? null
          ]);
          chaseProfileRef.current = ChaseNormalizeProfile(chaseData.profile);
          chaseQualityRef.current = Number.isFinite(chaseData.quality) ? Math.max(0, Math.min(1, chaseData.quality)) : 1;
          chaseGainRef.current = Number.isFinite(chaseData.gain) ? Math.max(0, Math.min(1, chaseData.gain)) : 1;
          const chaseMonitor = chaseData.monitor === true;
          const chaseAudioVolume = ChasePlaybackVolume(chaseVolumeRef.current, chaseQualityRef.current, chaseGainRef.current, chaseMonitor);
          if (chaseAudioIdentityRef.current === chaseIdentity && chaseAudioRef.current) {
            chaseMonitorRef.current = chaseMonitor;
            chaseSetPlayback((chaseCurrent) => chaseCurrent ? { ...chaseCurrent, monitor: chaseMonitor } : null);
            ChaseApplyOutputVolume(chaseAudioVolume);
            if (chaseGraphRef.current)
              ChaseApplyProfile(chaseGraphRef.current, chaseProfileRef.current);
            return;
          }
          ChaseStopAudio();
          const chaseAudio = new Audio(chaseUrl.href);
          chaseAudioRef.current = chaseAudio;
          chaseAudioIdentityRef.current = chaseIdentity;
          chaseMonitorRef.current = chaseMonitor;
          chaseSetPlayback({
            phase: "loading",
            monitor: chaseMonitor,
            stationId: Number.isFinite(chaseData.stationId) ? chaseData.stationId : void 0,
            name: typeof chaseData.title === "string" && chaseData.title ? chaseData.title : typeof chaseData.name === "string" ? chaseData.name : "Cartridge",
            provider: "file"
          });
          if (chaseUrl.origin === window.location.origin && typeof AudioContext !== "undefined") {
            try {
              chaseContextRef.current || (chaseContextRef.current = new AudioContext());
              chaseGraphRef.current = ChaseConnectAudio(chaseContextRef.current, chaseAudio, chaseProfileRef.current);
            } catch {
              chaseGraphRef.current = null;
            }
          }
          chaseAudio.volume = 0;
          ChaseApplyOutputVolume(chaseAudioVolume);
          const chaseOffset = chaseStartedSeconds !== null ? Math.max(0, Date.now() / 1e3 - chaseStartedSeconds) : 0;
          chaseAudio.addEventListener("loadedmetadata", () => {
            if (chaseAudioRef.current !== chaseAudio)
              return;
            if (chaseOffset >= chaseAudio.duration) {
              ChaseStopAudio();
              return;
            }
            chaseAudio.currentTime = chaseOffset;
            void ChaseStartPlayback(chaseAudio);
          }, { once: true });
          chaseAudio.addEventListener("error", () => {
            if (chaseAudioRef.current === chaseAudio) {
              chaseSetPlayback((chaseCurrent) => chaseCurrent ? { ...chaseCurrent, phase: "error" } : null);
              ChaseNotify("This cartridge could not be loaded.", "error");
            }
          }, { once: true });
          chaseAudio.addEventListener("ended", () => {
            if (chaseAudioRef.current === chaseAudio)
              ChaseStopAudio();
          }, { once: true });
        } catch {
          ChaseNotify("The cartridge address is invalid.", "error");
        }
      }
    }
    window.addEventListener("message", ChaseReceiveMessage);
    return () => {
      window.removeEventListener("message", ChaseReceiveMessage);
      ChaseStopAudio();
      void chaseContextRef.current?.close();
      chaseContextRef.current = null;
    };
  }, [
    ChaseApplySnapshot,
    ChaseApplyOutputVolume,
    ChaseNotify,
    ChaseStopAudio,
    ChaseStartPlayback
  ]);
  reactExports.useEffect(() => {
    if (chasePhone)
      return;
    function ChaseResumeAudio() {
      if (!chaseAudioRef.current)
        return;
      if (chaseAudioRef.current.paused || chaseGraphRef.current && chaseContextRef.current?.state === "suspended")
        void ChaseStartPlayback(chaseAudioRef.current);
    }
    window.addEventListener("pointerdown", ChaseResumeAudio);
    window.addEventListener("keydown", ChaseResumeAudio);
    return () => {
      window.removeEventListener("pointerdown", ChaseResumeAudio);
      window.removeEventListener("keydown", ChaseResumeAudio);
    };
  }, [ChaseStartPlayback]);
  reactExports.useEffect(() => {
    if (!chaseVisible)
      return;
    function ChaseKeyboard(chaseEvent) {
      if (chaseEvent.defaultPrevented)
        return;
      if (chaseEvent.key === "Escape") {
        chaseEvent.preventDefault();
        void ChaseClose();
      }
      if (chaseEvent.key === "Tab") {
        const chaseControls = chasePanelRef.current?.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]');
        if (!chaseControls?.length)
          return;
        const chaseFirst = chaseControls[0];
        const chaseLast = chaseControls[chaseControls.length - 1];
        if (chaseEvent.shiftKey && document.activeElement === chaseFirst) {
          chaseEvent.preventDefault();
          chaseLast.focus();
        } else if (!chaseEvent.shiftKey && document.activeElement === chaseLast) {
          chaseEvent.preventDefault();
          chaseFirst.focus();
        }
      }
    }
    window.addEventListener("keydown", ChaseKeyboard);
    return () => window.removeEventListener("keydown", ChaseKeyboard);
  }, [chaseVisible, ChaseClose]);
  const chaseCurrentSnapshot = chaseSnapshot && chaseCallOverride ? {
    ...chaseSnapshot,
    viewer: { ...chaseSnapshot.viewer, call: chaseCallOverride }
  } : chaseSnapshot;
  const chaseTuned = chaseSnapshot?.stations.find((chaseStation) => chaseStation.id === chaseSnapshot.tunedStationId);
  const chaseTalkKey = chaseSnapshot?.config.talk?.key ?? chaseSpeechTalkKey;
  const chaseCallPopup = chaseIncomingCall ? jsxRuntimeExports.jsx(ChaseCallPopup, {
    call: chaseIncomingCall,
    acceptKey: chaseIncomingCall.acceptKey || chaseSnapshot?.config.calls?.acceptKey || "Y",
    declineKey: chaseIncomingCall.declineKey || chaseSnapshot?.config.calls?.declineKey || "U",
    listenKeys: chaseVisible,
    busy: chaseBusy,
    action: ChaseAction
  }) : null;
  const chaseCanOperate = chaseSnapshot?.viewer.canOperate === true;
  const chaseCanScan = chaseSnapshot?.viewer.isPolice === true;
  const chaseCurrentView = chaseView === "studio" && !chaseCanOperate || chaseView === "scanner" && !chaseCanScan ? "listen" : chaseView;
  if (!chaseVisible)
    return chasePreview ? jsxRuntimeExports.jsxs("div", { className: "chase-preview-closed", children: [
      jsxRuntimeExports.jsx("strong", { children: "SENORA SIGNALWORKS" }),
      jsxRuntimeExports.jsx("p", { children: "Interactive preview closed." }),
      jsxRuntimeExports.jsx("button", {
        className: "chase-button chase-primary",
        onClick: () => chaseSetVisible(true),
        children: "Open preview"
      })
    ] }) : jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      !chasePhone && !chasePhoneOpen && !chaseCallPopup ? jsxRuntimeExports.jsx(ChaseFieldHint, {}) : null,
      !chasePhone && !chasePhoneOpen && chaseSpeechEnabled && chaseSpeechHud ? jsxRuntimeExports.jsx(ChaseSpeechIndicator, {
        speech: chaseSpeech,
        hud: true,
        talkKey: chaseTalkKey
      }) : null,
      chasePhoneOpen ? null : chaseCallPopup
    ] });
  if (chasePhone)
    return jsxRuntimeExports.jsx(ChasePhoneApp, {
      snapshot: chaseCurrentSnapshot,
      loading: chaseLoading,
      busy: chaseBusy,
      error: chaseError,
      speech: chaseSpeechEnabled ? chaseSpeech : null,
      talkKey: chaseTalkKey,
      talk: ChaseTalk,
      quality: chaseQuality,
      volume: chaseVolume,
      toast: chaseToast,
      action: ChaseAction,
      bootstrap: () => void ChaseBootstrap(),
      changeVolume: ChaseChangeVolume,
      saveVolume: () => void ChaseSaveVolume(),
      dismissToast: () => chaseSetToast(null),
      callPopup: chaseCallPopup
    });
  return jsxRuntimeExports.jsxs("div", { className: `chase-overlay ${chasePreview ? "chase-preview" : ""}`, children: [
    chaseCallPopup,
    jsxRuntimeExports.jsxs("div", {
      className: `chase-app ${chaseReceiver ? "chase-receiver-app" : ""}`,
      ref: chasePanelRef,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Senora Signalworks radio console",
      children: [
        jsxRuntimeExports.jsxs("aside", { className: "chase-sidebar", children: [
          jsxRuntimeExports.jsx("div", { className: "chase-brand", "aria-label": "Senora Signalworks", children: jsxRuntimeExports.jsx(ChaseIcon, { name: "broadcast", size: 28 }) }),
          jsxRuntimeExports.jsxs("nav", { "aria-label": "Radio sections", children: [
            jsxRuntimeExports.jsxs("button", {
              "aria-label": "Discover",
              title: "Discover",
              className: chaseCurrentView === "listen" ? "chase-nav-active" : "",
              "aria-current": chaseCurrentView === "listen" ? "page" : void 0,
              onClick: () => chaseSetView("listen"),
              children: [
                jsxRuntimeExports.jsx(ChaseIcon, { name: "radio", size: 24 }),
                jsxRuntimeExports.jsx("span", { children: "Listen" })
              ]
            }),
            jsxRuntimeExports.jsxs("button", {
              "aria-label": "Active frequencies",
              title: "Active frequencies",
              className: chaseCurrentView === "directory" ? "chase-nav-active" : "",
              "aria-current": chaseCurrentView === "directory" ? "page" : void 0,
              onClick: () => chaseSetView("directory"),
              children: [
                jsxRuntimeExports.jsx(ChaseIcon, { name: "directory", size: 24 }),
                jsxRuntimeExports.jsx("span", { children: "On air" })
              ]
            }),
            chaseCanOperate ? jsxRuntimeExports.jsxs("button", {
              "aria-label": "My studio",
              title: "My studio",
              className: chaseCurrentView === "studio" ? "chase-nav-active" : "",
              "aria-current": chaseCurrentView === "studio" ? "page" : void 0,
              onClick: () => chaseSetView("studio"),
              children: [
                jsxRuntimeExports.jsx(ChaseIcon, { name: "studio", size: 24 }),
                jsxRuntimeExports.jsx("span", { children: "Studio" })
              ]
            }) : null,
            chaseCanScan ? jsxRuntimeExports.jsxs("button", {
              "aria-label": "Scanner",
              title: "Scanner",
              className: chaseCurrentView === "scanner" ? "chase-nav-active" : "",
              "aria-current": chaseCurrentView === "scanner" ? "page" : void 0,
              onClick: () => chaseSetView("scanner"),
              children: [
                jsxRuntimeExports.jsx(ChaseIcon, { name: "scan", size: 24 }),
                jsxRuntimeExports.jsx("span", { children: "Scanner" })
              ]
            }) : null
          ] }),
          jsxRuntimeExports.jsxs("div", {
            className: "chase-profile",
            title: chaseSnapshot?.viewer.name || "Connecting",
            children: [
              jsxRuntimeExports.jsx(ChaseIcon, { name: "users", size: 20 }),
              jsxRuntimeExports.jsx("span", { children: chaseSnapshot?.viewer.name || "Connecting" })
            ]
          })
        ] }),
        jsxRuntimeExports.jsxs("div", { className: "chase-workspace", children: [
          jsxRuntimeExports.jsxs("header", { className: "chase-topbar", children: [
            jsxRuntimeExports.jsxs("div", { className: "chase-breadcrumb", children: [
              jsxRuntimeExports.jsx("strong", { children: "SENORA SIGNALWORKS" }),
              jsxRuntimeExports.jsx("span", { children: "Broadcast network" })
            ] }),
            jsxRuntimeExports.jsxs("div", { children: [
              chasePreview ? jsxRuntimeExports.jsx("span", { className: "chase-preview-badge", children: "INTERACTIVE PREVIEW · NO LIVE AUDIO" }) : jsxRuntimeExports.jsx(ChaseStatus, { live: Boolean(chaseSnapshot) && !chaseError, children: chaseError ? "CONNECTION INTERRUPTED" : chaseSnapshot ? "RECEIVER CONNECTED" : "CONNECTING" }),
              jsxRuntimeExports.jsx("button", {
                className: "chase-icon-button chase-refresh-button",
                "aria-label": "Refresh station data",
                disabled: chaseLoading || chaseBusy,
                onClick: () => void ChaseBootstrap(),
                children: jsxRuntimeExports.jsx(ChaseIcon, { name: "refresh", size: 17 })
              }),
              jsxRuntimeExports.jsxs("button", {
                className: "chase-close-button",
                "aria-label": "Close radio console",
                onClick: () => void ChaseClose(),
                children: [
                  jsxRuntimeExports.jsx("span", { children: "ESC" }),
                  jsxRuntimeExports.jsx(ChaseIcon, { name: "close", size: 18 })
                ]
              })
            ] })
          ] }),
          jsxRuntimeExports.jsxs("main", { className: "chase-main", ref: chaseMainRef, children: [
            jsxRuntimeExports.jsxs("div", { className: "chase-page-heading", children: [
              jsxRuntimeExports.jsxs("div", { children: [
                jsxRuntimeExports.jsx("h1", { children: chaseCurrentView === "listen" ? "Radio receiver" : chaseCurrentView === "studio" ? "Broadcast studio" : chaseCurrentView === "directory" ? "Active frequencies" : "Field scanner" }),
                jsxRuntimeExports.jsx("p", { children: chaseCurrentView === "listen" ? "Browse stations or connect to a frequency." : chaseCurrentView === "studio" ? "Manage your station, crew and transmission." : chaseCurrentView === "directory" ? "Find a live station and see who is on the microphone." : "Take directional readings and review signal history." })
              ] }),
              jsxRuntimeExports.jsxs("span", { className: "chase-page-badge", children: [
                jsxRuntimeExports.jsx(ChaseIcon, {
                  name: chaseCurrentView === "scanner" ? "scan" : "signal",
                  size: 18
                }),
                chaseCurrentView === "scanner" ? "Authorized access" : "FM NETWORK"
              ] })
            ] }),
            chaseError ? jsxRuntimeExports.jsxs("div", { className: "chase-connection-error", role: "alert", children: [
              jsxRuntimeExports.jsx("strong", { children: "Connection interrupted" }),
              jsxRuntimeExports.jsx("p", { children: chaseError }),
              jsxRuntimeExports.jsx("button", {
                className: "chase-button chase-secondary",
                onClick: () => void ChaseBootstrap(),
                children: "Reconnect"
              })
            ] }) : null,
            chaseSpeechEnabled ? jsxRuntimeExports.jsx(ChaseSpeechIndicator, {
              speech: chaseSpeech,
              talkKey: chaseTalkKey,
              talk: ChaseTalk
            }) : null,
            chaseCurrentSnapshot ? jsxRuntimeExports.jsx("fieldset", {
              className: "chase-view-fieldset",
              disabled: chaseBusy,
              "aria-busy": chaseBusy,
              children: chaseReceiver ? jsxRuntimeExports.jsx(ChaseReceiver, {
                device: chaseReceiver,
                placed: chaseReceiver === "placed" ? chasePlaced : null,
                snapshot: chaseCurrentSnapshot,
                action: ChaseAction,
                busy: chaseBusy,
                quality: chaseQuality
              }) : chaseCurrentView === "directory" ? jsxRuntimeExports.jsx(ChaseDirectory, {
                snapshot: chaseCurrentSnapshot,
                speech: chaseSpeechEnabled ? chaseSpeech : null,
                action: ChaseAction,
                busy: chaseBusy || chaseLoading,
                refresh: () => void ChaseBootstrap()
              }) : chaseCurrentView === "listen" ? jsxRuntimeExports.jsx(ChaseListen, {
                snapshot: chaseCurrentSnapshot,
                action: ChaseAction,
                busy: chaseBusy,
                quality: chaseQuality
              }) : chaseCurrentView === "studio" ? jsxRuntimeExports.jsx(ChaseStudio, {
                snapshot: chaseCurrentSnapshot,
                action: ChaseAction,
                busy: chaseBusy,
                playback: chasePlayback
              }) : jsxRuntimeExports.jsx(ChaseScanner, {
                snapshot: chaseCurrentSnapshot,
                notify: ChaseNotify
              })
            }) : chaseLoading ? jsxRuntimeExports.jsxs("div", { className: "chase-loading", role: "status", children: [
              jsxRuntimeExports.jsx(ChaseIcon, { name: "radio", size: 36 }),
              jsxRuntimeExports.jsx("h2", { children: "Connecting receiver…" }),
              jsxRuntimeExports.jsx("p", { children: "Loading your station directory." }),
              jsxRuntimeExports.jsx("span", {})
            ] }) : !chaseError ? jsxRuntimeExports.jsx(ChaseEmpty, { title: "The receiver is waiting", children: "Refresh to connect to your station directory." }) : null
          ] }),
          jsxRuntimeExports.jsxs("footer", { className: "chase-player", children: [
            jsxRuntimeExports.jsx("span", { className: "chase-player-icon", children: jsxRuntimeExports.jsx(ChaseIcon, { name: "headphones", size: 21 }) }),
            jsxRuntimeExports.jsxs("div", { className: "chase-player-station", children: [
              jsxRuntimeExports.jsx("strong", { children: (chasePlayback?.monitor ? "Studio cue" : null) || chaseTuned?.name || (chaseSnapshot?.tunedStationId ? "Unlisted frequency" : "Nothing tuned in") }),
              jsxRuntimeExports.jsx("span", { children: chasePlayback?.monitor ? `${chasePlayback.name} · ${chasePlayback.phase === "playing" ? chaseVolume === 0 ? "Muted" : "Playing locally" : chasePlayback.phase === "loading" ? "Loading audio" : chasePlayback.phase === "blocked" ? "Click to enable audio" : "Audio unavailable"}` : chaseTuned ? `${ChaseFrequency(chaseTuned.frequency)} FM · ${chaseTuned.showTitle || "Independent radio"}` : "Select a station to connect." })
            ] }),
            chaseBusy ? jsxRuntimeExports.jsx("span", { className: "chase-busy-indicator", role: "status", children: "Waiting for server…" }) : null,
            jsxRuntimeExports.jsxs("div", { className: "chase-player-volume", children: [
              jsxRuntimeExports.jsx(ChaseIcon, { name: "volume", size: 18 }),
              jsxRuntimeExports.jsx("label", {
                className: "chase-visually-hidden",
                htmlFor: "chase-listening-volume",
                children: "Listening volume"
              }),
              jsxRuntimeExports.jsx("input", {
                id: "chase-listening-volume",
                type: "range",
                min: "0",
                max: "100",
                step: "1",
                value: chaseVolume,
                onChange: (chaseEvent) => ChaseChangeVolume(Number(chaseEvent.target.value)),
                onPointerUp: () => void ChaseSaveVolume(),
                onKeyUp: (chaseEvent) => {
                  if ([
                    "ArrowLeft",
                    "ArrowRight",
                    "ArrowUp",
                    "ArrowDown",
                    "Home",
                    "End"
                  ].includes(chaseEvent.key))
                    void ChaseSaveVolume();
                }
              }),
              jsxRuntimeExports.jsxs("span", { children: [
                chaseVolume,
                "%"
              ] })
            ] }),
            jsxRuntimeExports.jsx("span", { className: "chase-player-fm", children: "LOCAL RECEIVER" })
          ] })
        ] }),
        jsxRuntimeExports.jsx(ChaseToast, { toast: chaseToast, dismiss: () => chaseSetToast(null) })
      ]
    })
  ] });
}
function ChaseDashboardOverlay() {
  const [chaseEditor, chaseSetEditor] = reactExports.useState(null);
  const [chaseError, chaseSetError] = reactExports.useState("");
  const [chaseSaving, chaseSetSaving] = reactExports.useState(false);
  const chaseEditorRef = reactExports.useRef(null);
  const chasePending = reactExports.useRef(false);
  const chaseGeneration = reactExports.useRef(0);
  async function ChaseCommand(payload) {
    if (!chaseEditorRef.current || chaseEditorRef.current.busy || chasePending.current)
      return;
    const chaseVersion = chaseGeneration.current;
    const chaseSave = payload.command === "save";
    if (chaseSave) {
      chasePending.current = true;
      chaseSetSaving(true);
    }
    chaseSetError("");
    try {
      await ChasePost("dashboardEditor", {
        ...payload,
        session: chaseEditorRef.current.session
      });
    } catch (error) {
      if (chaseVersion === chaseGeneration.current)
        chaseSetError(error instanceof Error ? error.message : "The receiver could not complete this action.");
    } finally {
      if (chaseVersion === chaseGeneration.current) {
        chasePending.current = false;
        chaseSetSaving(false);
      }
    }
  }
  reactExports.useEffect(() => {
    if (new URLSearchParams(location.search).get("phone") === "1")
      return;
    function ChaseReceive(event) {
      if (event.data?.type !== "chase_bootleg:dashboardEditor")
        return;
      const value = event.data.data;
      if (!value || !["place", "interact"].includes(value.mode) || typeof value.session !== "string" || !value.session) {
        chaseGeneration.current += 1;
        chaseEditorRef.current = null;
        chasePending.current = false;
        chaseSetSaving(false);
        chaseSetError("");
        chaseSetEditor(null);
        return;
      }
      if (chaseEditorRef.current?.session !== value.session) {
        chaseGeneration.current += 1;
        chasePending.current = false;
        chaseSetSaving(false);
        chaseSetError("");
      }
      const mount = Object.fromEntries(["x", "y", "z", "rx", "ry", "rz"].map((key) => [
        key,
        Number.isFinite(value.mount?.[key]) ? value.mount[key] : 0
      ]));
      const next = {
        session: value.session,
        mode: value.mode,
        transform: value.transform === "rotate" ? "rotate" : "move",
        axis: ["x", "y", "z"].includes(value.axis) ? value.axis : "x",
        mount,
        installed: value.installed === true,
        busy: value.busy === true,
        error: typeof value.error === "string" ? value.error : void 0
      };
      chaseEditorRef.current = next;
      chaseSetEditor(next);
    }
    function ChaseKeyboard(event) {
      const state = chaseEditorRef.current;
      if (!state)
        return;
      const key = event.key.toLowerCase();
      let command = null;
      if (key === "escape")
        command = { command: "cancel" };
      else if (state.mode === "place") {
        if (key === "t" || key === "r")
          command = { command: "mode", mode: key === "r" ? "rotate" : "move" };
        else if (key === "x" || key === "y" || key === "z")
          command = { command: "axis", axis: key };
        else if (key === "enter" && !event.repeat)
          command = { command: "save" };
        else if ([
          "arrowleft",
          "arrowdown",
          "-",
          "arrowright",
          "arrowup",
          "+",
          "="
        ].includes(key))
          command = {
            command: "nudge",
            direction: ["arrowleft", "arrowdown", "-"].includes(key) ? -1 : 1,
            fine: event.shiftKey
          };
      }
      if (command) {
        event.preventDefault();
        event.stopImmediatePropagation();
        void ChaseCommand(command);
      }
    }
    window.addEventListener("message", ChaseReceive);
    window.addEventListener("keydown", ChaseKeyboard, true);
    return () => {
      chaseGeneration.current += 1;
      window.removeEventListener("message", ChaseReceive);
      window.removeEventListener("keydown", ChaseKeyboard, true);
    };
  }, []);
  if (!chaseEditor)
    return null;
  const chaseBusy = chaseEditor.busy || chaseSaving;
  if (chaseEditor.mode === "interact")
    return jsxRuntimeExports.jsxs("aside", {
      className: "chase-dashboard-screen-hint",
      "aria-label": "Dashboard screen controls",
      children: [
        jsxRuntimeExports.jsxs("span", { children: [
          jsxRuntimeExports.jsx("strong", { children: "SSW DASH RECEIVER" }),
          "Click the screen to tune in"
        ] }),
        jsxRuntimeExports.jsxs("button", { onClick: () => void ChaseCommand({ command: "cancel" }), children: [
          jsxRuntimeExports.jsx("kbd", { children: "ESC" }),
          "Close"
        ] })
      ]
    });
  return jsxRuntimeExports.jsxs("aside", {
    className: "chase-dashboard-editor",
    "aria-label": "Dashboard receiver placement",
    children: [
      jsxRuntimeExports.jsxs("header", { children: [
        jsxRuntimeExports.jsx("span", { children: "SSW / DASH RECEIVER" }),
        jsxRuntimeExports.jsx("h2", { children: chaseEditor.installed ? "Adjust your receiver" : "Make it fit your dash" }),
        jsxRuntimeExports.jsx("p", { children: "Move and tilt the screen until it sits where you want it." })
      ] }),
      jsxRuntimeExports.jsxs("fieldset", { disabled: chaseBusy, children: [
        jsxRuntimeExports.jsxs("div", { className: "chase-dashboard-modes", children: [
          jsxRuntimeExports.jsxs("button", {
            "aria-pressed": chaseEditor.transform === "move",
            onClick: () => void ChaseCommand({ command: "mode", mode: "move" }),
            children: [
              jsxRuntimeExports.jsx("kbd", { children: "T" }),
              "Move"
            ]
          }),
          jsxRuntimeExports.jsxs("button", {
            "aria-pressed": chaseEditor.transform === "rotate",
            onClick: () => void ChaseCommand({ command: "mode", mode: "rotate" }),
            children: [
              jsxRuntimeExports.jsx("kbd", { children: "R" }),
              "Rotate"
            ]
          })
        ] }),
        jsxRuntimeExports.jsx("div", { className: "chase-dashboard-axis", "aria-label": "Selected axis", children: ["x", "y", "z"].map((axis) => jsxRuntimeExports.jsxs("button", {
          "data-axis": axis,
          "aria-pressed": chaseEditor.axis === axis,
          onClick: () => void ChaseCommand({ command: "axis", axis }),
          children: [
            axis.toUpperCase(),
            jsxRuntimeExports.jsx("span", { children: axis === "x" ? "Side" : axis === "y" ? "Depth" : "Height" })
          ]
        }, axis)) }),
        jsxRuntimeExports.jsxs("div", { className: "chase-dashboard-adjust", children: [
          jsxRuntimeExports.jsx("button", {
            "aria-label": "Decrease selected axis",
            onClick: () => void ChaseCommand({ command: "nudge", direction: -1 }),
            children: "−"
          }),
          jsxRuntimeExports.jsxs("output", { children: [
            chaseEditor.transform === "move" ? (chaseEditor.mount[chaseEditor.axis] * 100).toFixed(1) : chaseEditor.mount[`r${chaseEditor.axis}`].toFixed(1),
            jsxRuntimeExports.jsx("small", { children: chaseEditor.transform === "move" ? "cm" : "°" })
          ] }),
          jsxRuntimeExports.jsx("button", {
            "aria-label": "Increase selected axis",
            onClick: () => void ChaseCommand({ command: "nudge", direction: 1 }),
            children: "+"
          })
        ] }),
        jsxRuntimeExports.jsxs("ul", { children: [
          jsxRuntimeExports.jsxs("li", { children: [
            jsxRuntimeExports.jsx("b", { children: "Left mouse" }),
            "Drag a colored axis"
          ] }),
          jsxRuntimeExports.jsxs("li", { children: [
            jsxRuntimeExports.jsx("b", { children: "Right mouse" }),
            "Look around your cabin"
          ] }),
          jsxRuntimeExports.jsxs("li", { children: [
            jsxRuntimeExports.jsx("b", { children: "Arrow keys" }),
            "Adjust selected axis"
          ] }),
          jsxRuntimeExports.jsxs("li", { children: [
            jsxRuntimeExports.jsx("b", { children: "Hold Shift" }),
            "Fine adjustment"
          ] })
        ] }),
        jsxRuntimeExports.jsx("button", {
          className: "chase-dashboard-reset",
          onClick: () => void ChaseCommand({ command: "reset" }),
          children: "Reset position"
        })
      ] }),
      chaseError || chaseEditor.error ? jsxRuntimeExports.jsx("p", { className: "chase-dashboard-error", role: "alert", children: chaseError || chaseEditor.error }) : null,
      jsxRuntimeExports.jsxs("footer", { children: [
        jsxRuntimeExports.jsxs("button", {
          className: "chase-dashboard-save",
          disabled: chaseBusy,
          onClick: () => void ChaseCommand({ command: "save" }),
          children: [
            jsxRuntimeExports.jsx("kbd", { children: "↵" }),
            chaseBusy ? "Saving…" : chaseEditor.installed ? "Save position" : "Install receiver"
          ]
        }),
        jsxRuntimeExports.jsxs("button", {
          disabled: chaseBusy,
          onClick: () => void ChaseCommand({ command: "cancel" }),
          children: [
            jsxRuntimeExports.jsx("kbd", { children: "ESC" }),
            "Cancel"
          ]
        })
      ] }),
      jsxRuntimeExports.jsx("small", { children: chaseEditor.installed ? "Changes apply when you save." : "The item is used only when you install." })
    ]
  });
}
ReactDOM.createRoot(document.getElementById("root")).render(jsxRuntimeExports.jsxs(React.StrictMode, { children: [
  jsxRuntimeExports.jsx(ChaseApp, {}),
  jsxRuntimeExports.jsx(ChaseDashboardOverlay, {})
] }));
