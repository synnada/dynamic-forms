import { createContext, useContext, useCallback, createElement, useMemo, useState, useEffect } from 'react';
import { useFormikContext, useField } from 'formik';
import { useDispatch, useSelector, Provider as Provider$1 } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

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
  return useDispatch();
};
var useAppSelector = useSelector;

var initialState = {
  loadingArray: []
};
function appReducer(state, action) {
  if (state === void 0) {
    state = initialState;
  }

  switch (action.type) {
    case 'set':
      var _action$payload = action.payload,
          name = _action$payload.name,
          value = _action$payload.value;
      var draftTracing = [].concat(state.loadingArray);
      var fieldFoundIndex = draftTracing.indexOf(name);
      var fieldFound = fieldFoundIndex > -1;

      if (value && !fieldFound) {
        draftTracing.push(name);
      } else if (!value && fieldFound) {
        draftTracing.splice(fieldFoundIndex, 1);
      }

      return _extends({}, state, {
        loadingArray: draftTracing
      });
  }

  return state;
}

var store = configureStore({
  reducer: {
    app: appReducer
  }
});

var formContextDefaultValue = {
  getLoading: function getLoading() {
    return false;
  },
  setLoading: function setLoading() {
    return null;
  }
};
var FormContext = createContext(formContextDefaultValue);
var useDynamicForms = function useDynamicForms() {
  return useContext(FormContext);
};
var Provider = function Provider(_ref) {
  var children = _ref.children;
  var loadingArray = useAppSelector(function (state) {
    return state.app.loadingArray;
  });
  var dispatch = useAppDispatch();

  var setLoading = function setLoading(name, value) {
    dispatch({
      type: 'set',
      payload: {
        name: name,
        value: value
      }
    });
  };

  var getLoading = useCallback(function (name) {
    if (!name) {
      return Boolean(loadingArray.length);
    }

    return loadingArray[name];
  }, [loadingArray]);
  var contextValue = {
    setLoading: setLoading,
    getLoading: getLoading
  };
  return createElement(FormContext.Provider, {
    value: contextValue
  }, children);
};
var DynamicFormsProvider = function DynamicFormsProvider(props) {
  return createElement(Provider$1, {
    store: store
  }, createElement(Provider, Object.assign({}, props)));
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
      var _useFormikContext = useFormikContext(),
          values = _useFormikContext.values,
          setFieldValue = _useFormikContext.setFieldValue;

      var _useField = useField(props.name),
          meta = _useField[1];

      var _React$useState = useState(undefined),
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
            var relationValue = values[relationName];
            var predicateResult = relationPredicate({
              values: values,
              relationValue: relationValue
            });

            if (predicateResult) {
              manupilatedFieldProps = _extends({}, manupilatedFieldProps, predicateResult);
              manupilatedFieldProps.isManupilated = true;
            }
          }
        }

        return manupilatedFieldProps;
      };

      useEffect(function () {
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
      var d = checkManupilation();
      return createElement(Component, Object.assign({
        fieldProps: d
      }, props));
    };

    return function (props) {
      return useMemo(function () {
        return createElement(WrappedComponent, Object.assign({}, props));
      }, []);
    };
  };
};

export { DynamicFormsProvider, FormContext, Provider, formContextDefaultValue, useDynamicForms, withDynamicForms };
//# sourceMappingURL=index.modern.js.map
