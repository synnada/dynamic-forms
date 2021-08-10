function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var formik = require('formik');
var reactRedux = require('react-redux');
var toolkit = require('@reduxjs/toolkit');
var SparkMD5 = _interopDefault(require('spark-md5'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var useAppDispatch = function useAppDispatch() {
  return reactRedux.useDispatch();
};
var useAppSelector = reactRedux.useSelector;

var initialState = {
  loadingArray: [],
  validationSchemaObject: {}
};
function appReducer(state, action) {
  if (state === void 0) {
    state = initialState;
  }

  switch (action.type) {
    case 'setLoading':
      var payload = action.payload;
      var draftTracing = [].concat(state.loadingArray);
      var fieldFoundIndex = draftTracing.indexOf(payload.name);
      var fieldFound = fieldFoundIndex > -1;

      if (payload.value && !fieldFound) {
        draftTracing.push(payload.name);
      } else if (!payload.value && fieldFound) {
        draftTracing.splice(fieldFoundIndex, 1);
      }

      return _extends({}, state, {
        loadingArray: draftTracing
      });

    case 'addValidationSchema':
      return _extends({}, state);
  }

  return state;
}

var store = toolkit.configureStore({
  reducer: {
    app: appReducer
  }
});

var deepStringify = function deepStringify(value) {
  var stringify = function stringify(data, prefix) {
    if (prefix === void 0) {
      prefix = null;
    }

    function unicode_escape(c) {
      var s = c.charCodeAt(0).toString(16);

      while (s.length < 4) {
        s = '0' + s;
      }

      return "\\u" + s;
    }

    if (!prefix) prefix = '';

    switch (typeof data) {
      case 'object':
        if (data == null) return 'null';
        var i,
            pieces = [],
            before,
            after;
        var indent = prefix + '    ';

        if (data instanceof Array) {
          for (i = 0; i < data.length; i++) {
            pieces.push(stringify(data[i], indent));
          }

          before = '[\n';
          after = ']';
        } else {
          for (i in data) {
            pieces.push(i + ': ' + stringify(data[i], indent));
          }

          before = '{\n';
          after = '}';
        }

        return before + indent + pieces.join(',\n' + indent) + '\n' + prefix + after;

      case 'string':
        data = data.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/[\x00-\x19]/g, unicode_escape);
        return '"' + data + '"';

      default:
        return String(data).replace(/\n/g, '\n' + prefix);
    }
  };

  return stringify(value);
};

var formContextDefaultValue = {
  getLoading: function getLoading() {
    return false;
  },
  setLoading: function setLoading() {
    return null;
  }
};
var FormContext = React.createContext(formContextDefaultValue);
var useDynamicForms = function useDynamicForms() {
  return React.useContext(FormContext);
};
var Provider = function Provider(_ref) {
  var children = _ref.children;
  var loadingArray = useAppSelector(function (state) {
    return state.app.loadingArray;
  });
  var dispatch = useAppDispatch();

  var setLoading = function setLoading(name, value) {
    dispatch({
      type: 'setLoading',
      payload: {
        name: name,
        value: value
      }
    });
  };

  var getLoading = React.useCallback(function (name) {
    if (!name) {
      return Boolean(loadingArray.length);
    }

    return loadingArray[name];
  }, [loadingArray]);
  var contextValue = {
    setLoading: setLoading,
    getLoading: getLoading
  };
  return React.createElement(FormContext.Provider, {
    value: contextValue
  }, children);
};
var DynamicFormsProvider = function DynamicFormsProvider(props) {
  return React.createElement(reactRedux.Provider, {
    store: store
  }, React.createElement(Provider, Object.assign({}, props)));
};
var withDynamicForms = function withDynamicForms(rules) {
  return function (Component) {
    var defaultRules = {
      dependsOn: {},
      fieldProps: {},
      manupilation: {}
    };
    rules = _extends({}, defaultRules, rules);

    var WrappedComponent = function WrappedComponent(props) {
      var _useFormikContext = formik.useFormikContext(),
          values = _useFormikContext.values,
          setFieldValue = _useFormikContext.setFieldValue,
          getFieldMeta = _useFormikContext.getFieldMeta;

      var _useField = formik.useField(props.name),
          meta = _useField[1];

      var _React$useState = React.useState(undefined),
          passed = _React$useState[0],
          setPassed = _React$useState[1];

      var checkPassed = function checkPassed() {
        return Object.keys(rules.dependsOn).findIndex(function (relationName) {
          var relationValue = values[relationName];

          if (relationValue) {
            if (!rules.dependsOn[relationName]({
              values: values,
              relationValue: relationValue
            })) {
              return true;
            }
          } else {
            return true;
          }

          return false;
        }) === -1;
      };

      var cleanFieldValue = function cleanFieldValue() {
        console.log(props.name);
        setFieldValue(props.name, undefined);
      };

      var checkManupilation = function checkManupilation() {
        var _rules;

        var manupilatedFieldProps = ((_rules = rules) === null || _rules === void 0 ? void 0 : _rules.fieldProps) || {};
        var manupilationKeys = Object.keys(rules.manupilation);

        for (var index = 0; index < manupilationKeys.length; index++) {
          var relationName = manupilationKeys[index];
          var relationPredicate = rules.manupilation[relationName];

          if (relationPredicate) {
            if (relationName.includes('%')) {
              var fieldName = props.name;
              var relationTail = relationName.substr(relationName.indexOf('.'), relationName.length);
              var fieldBase = fieldName.substr(0, fieldName.lastIndexOf('.'));
              relationName = "" + fieldBase + relationTail;
            }

            var _meta = getFieldMeta(relationName);

            var relationValue = _meta.value;
            var predicateResult = relationPredicate({
              values: values,
              relationValue: relationValue
            });

            if (predicateResult) {
              manupilatedFieldProps = _extends({}, manupilatedFieldProps, predicateResult);
              manupilatedFieldProps.isManupilated = SparkMD5.hash(deepStringify(predicateResult));
            }
          }
        }

        return manupilatedFieldProps;
      };

      React.useEffect(function () {
        var isPassed = checkPassed();

        if (isPassed) {
          var _rules2;

          if (meta.value === undefined && ((_rules2 = rules) === null || _rules2 === void 0 ? void 0 : _rules2.initialValue) !== undefined) {
            setFieldValue(props.name, rules.initialValue);
          }

          setPassed(isPassed);
        } else {
          setPassed(undefined);

          if (meta.value) {
            cleanFieldValue();
          }
        }
      }, [values]);
      if (passed === undefined) return null;

      var fieldProps = _extends({
        validationSchema: rules.validationSchema || {}
      }, checkManupilation());

      return React.createElement(Component, Object.assign({
        fieldProps: fieldProps
      }, props));
    };

    return function (props) {
      return React.useMemo(function () {
        return React.createElement(WrappedComponent, Object.assign({}, props));
      }, []);
    };
  };
};

exports.DynamicFormsProvider = DynamicFormsProvider;
exports.FormContext = FormContext;
exports.Provider = Provider;
exports.formContextDefaultValue = formContextDefaultValue;
exports.useDynamicForms = useDynamicForms;
exports.withDynamicForms = withDynamicForms;
//# sourceMappingURL=index.js.map
