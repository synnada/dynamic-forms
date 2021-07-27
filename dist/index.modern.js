import { createContext, useContext, useCallback, createElement, useMemo, useState, useEffect } from 'react';
import { useFormikContext, useField } from 'formik';
import { useDispatch, useSelector, Provider as Provider$1 } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const useAppDispatch = () => useDispatch();
const useAppSelector = useSelector;

const initialState = {
  loadingArray: [],
  validationSchemaObject: {}
};
function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'setLoading':
      const payload = action.payload;
      const draftTracing = [...state.loadingArray];
      const fieldFoundIndex = draftTracing.indexOf(payload.name);
      const fieldFound = fieldFoundIndex > -1;

      if (payload.value && !fieldFound) {
        draftTracing.push(payload.name);
      } else if (!payload.value && fieldFound) {
        draftTracing.splice(fieldFoundIndex, 1);
      }

      return { ...state,
        loadingArray: draftTracing
      };

    case 'addValidationSchema':
      return { ...state
      };
  }

  return state;
}

const store = configureStore({
  reducer: {
    app: appReducer
  }
});

const formContextDefaultValue = {
  getLoading: () => false,
  setLoading: () => null
};
const FormContext = createContext(formContextDefaultValue);
const useDynamicForms = () => useContext(FormContext);
const Provider = ({
  children
}) => {
  const loadingArray = useAppSelector(state => state.app.loadingArray);
  const dispatch = useAppDispatch();

  const setLoading = (name, value) => {
    dispatch({
      type: 'setLoading',
      payload: {
        name,
        value
      }
    });
  };

  const getLoading = useCallback(name => {
    if (!name) {
      return Boolean(loadingArray.length);
    }

    return loadingArray[name];
  }, [loadingArray]);
  const contextValue = {
    setLoading,
    getLoading
  };
  return createElement(FormContext.Provider, {
    value: contextValue
  }, children);
};
const DynamicFormsProvider = props => createElement(Provider$1, {
  store: store
}, createElement(Provider, Object.assign({}, props)));
const withDynamicForms = rules => Component => {
  const defaultRules = {
    dependsOn: {},
    fieldProps: {},
    manupilation: {}
  };
  rules = { ...defaultRules,
    ...rules
  };

  const WrappedComponent = props => {
    const {
      values,
      setFieldValue
    } = useFormikContext();
    const [, meta] = useField(props.name);
    const [passed, setPassed] = useState(undefined);

    const checkPassed = () => Object.keys(rules.dependsOn).findIndex(relationName => {
      const relationValue = values[relationName];

      if (relationValue) {
        if (!rules.dependsOn[relationName]({
          values,
          relationValue
        })) {
          return true;
        }
      } else {
        return true;
      }

      return false;
    }) === -1;

    const cleanFieldValue = () => {
      console.log(props.name);
      setFieldValue(props.name, undefined);
    };

    const checkManupilation = () => {
      var _rules;

      let manupilatedFieldProps = ((_rules = rules) === null || _rules === void 0 ? void 0 : _rules.fieldProps) || {};
      const manupilationKeys = Object.keys(rules.manupilation);

      for (let index = 0; index < manupilationKeys.length; index++) {
        const relationName = manupilationKeys[index];
        const relationPredicate = rules.manupilation[relationName];

        if (relationPredicate) {
          const relationValue = values[relationName];
          const predicateResult = relationPredicate({
            values,
            relationValue
          });

          if (predicateResult) {
            manupilatedFieldProps = { ...manupilatedFieldProps,
              ...predicateResult
            };
            manupilatedFieldProps.isManupilated = true;
          }
        }
      }

      return manupilatedFieldProps;
    };

    useEffect(() => {
      const isPassed = checkPassed();

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
    const fieldProps = {
      validationSchema: rules.validationSchema || {},
      ...checkManupilation()
    };
    return createElement(Component, Object.assign({
      fieldProps: fieldProps
    }, props));
  };

  return props => useMemo(() => createElement(WrappedComponent, Object.assign({}, props)), []);
};

export { DynamicFormsProvider, FormContext, Provider, formContextDefaultValue, useDynamicForms, withDynamicForms };
//# sourceMappingURL=index.modern.js.map
