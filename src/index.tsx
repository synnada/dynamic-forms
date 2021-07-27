/* eslint-disable  */
// @ts-ignore
import * as React from 'react'
// @ts-ignore
import { useFormikContext, useField } from 'formik'
// @ts-ignore
import deepEqual from 'deep-equal'
// @ts-ignore
import * as deepcopy_ from 'deepcopy'
import { useAppSelector, useAppDispatch } from './hooks'
import store from './store'
import { Provider as ReduxProvider } from 'react-redux'
// @ts-ignore
import * as Yup from 'yup'
// @ts-ignore
import SparkMD5 from 'spark-md5'
import { deepStringify } from './utils'
// const deepCopy = deepcopy_
// import styles from './styles.module.css'

/* interface Props {
  values: any
} */

interface Rules {
  initialValue?: any
  fieldProps?: any
  dependsOn?: any
  manupilation?: any
  validationSchema?: any
}

export interface FormContextData {
  getLoading: (name?: string | undefined) => boolean
  setLoading: (name: string, value: boolean) => void
}

/* type DynamicFormsProviderProps = { children: any } */

export const formContextDefaultValue: FormContextData = {
  getLoading: () => false,
  setLoading: () => null
}

export const FormContext = React.createContext<FormContextData>(
  formContextDefaultValue
)

export const useDynamicForms = () => React.useContext(FormContext)

export const Provider = ({ children }: any) => {
  const loadingArray = useAppSelector((state) => state.app.loadingArray)
  /* const validationSchema = useAppSelector(
    (state) => state.app.validationSchemaObject
  ) */
  const dispatch = useAppDispatch()
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context

  // const [loadingArray, setLoadingArray] = React.useState<string[]>([])

  const setLoading = (name: string, value: boolean) => {
    dispatch({ type: 'setLoading', payload: { name, value } })
  }

  const getLoading = React.useCallback(
    (name?: string) => {
      if (!name) {
        return Boolean(loadingArray.length)
      }
      return loadingArray[name]
    },
    [loadingArray]
  )

  const contextValue: FormContextData = {
    setLoading,
    getLoading
  }

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  )
}

export const DynamicFormsProvider = (props: any) => (
  <ReduxProvider store={store}>
    <Provider {...props} />
  </ReduxProvider>
)

export const withDynamicForms = (rules: Rules) => (Component: any) => {
  const defaultRules: Rules = {
    dependsOn: {},
    fieldProps: {},
    manupilation: {}
  }
  rules = { ...defaultRules, ...rules }

  const WrappedComponent = (props: any) => {
    const { values, setFieldValue /* setFieldValue, setValues */ }: any =
      useFormikContext()

    const [, meta] = useField(props.name)
    const [passed, setPassed] = React.useState<any>(undefined)
    /* const [manupilationData, setManupilationData] =
      React.useState<any>(undefined) */
    // const { setValue } = helpers

    const checkPassed = () =>
      Object.keys(rules.dependsOn).findIndex((relationName) => {
        const relationValue = values[relationName]
        if (relationValue) {
          if (!rules.dependsOn[relationName]({ values, relationValue })) {
            return true
          }
        } else {
          return true
        }
        return false
      }) === -1

    const cleanFieldValue = () => {
      // delete field
      /* setValues({
        ...values
      }) */
      // setFieldValue(props.name, null)
      //helpers.setValue(undefined)
      // setValue(null)
      console.log(props.name)

      setFieldValue(props.name, undefined)
      //delete meta.value
    }

    const checkManupilation = () => {
      let manupilatedFieldProps = rules?.fieldProps || {}
      const manupilationKeys = Object.keys(rules.manupilation)
      for (let index = 0; index < manupilationKeys.length; index++) {
        const relationName = manupilationKeys[index]
        const relationPredicate = rules.manupilation[relationName]
        if (relationPredicate) {
          const relationValue = values[relationName]
          const predicateResult = relationPredicate({ values, relationValue })

          if (predicateResult) {
            manupilatedFieldProps = {
              ...manupilatedFieldProps,
              ...predicateResult
            }

            manupilatedFieldProps.isManupilated = SparkMD5.hash(
              deepStringify(predicateResult)
            )

            /* manupilatedFieldProps.manupilated = 'no'

            if (!deepEqual(previousValues[props.name], values[props.name])) {
              manupilatedFieldProps.manupilated = 'yes'
            } */
          } else {
            /* manupilatedFieldProps.manupilated = undefined */
          }

          /* manupilatedFieldProps.isManupilated =
            manupilatedFieldProps?.manupilated &&
            manupilatedFieldProps?.manupilated === 'yes' */
        }
      }
      return manupilatedFieldProps
    }

    React.useEffect(() => {
      const isPassed = checkPassed()
      if (isPassed) {
        // Reset value with initialValue
        if (meta.value === undefined && rules?.initialValue !== undefined) {
          setFieldValue(props.name, rules.initialValue)
        }
        /* if (rules.validationSchema) {
          dispatch({
            type: 'addValidationSchema',
            payload: { rules, name: props.name }
          })
        } */
        setPassed(isPassed)
      } else {
        setPassed(undefined)
        if (meta.value) {
          cleanFieldValue()
        }
      }
    }, [values])

    /* if (isPassed) {
      return <Component fieldProps={checkManupilation()} {...props} />
    } else {
      if (meta.value) {
        cleanFieldValue()
      }
    } */

    if (passed === undefined) return null

    const fieldProps = {
      validationSchema: rules.validationSchema || {},
      ...checkManupilation()
    }

    return <Component fieldProps={fieldProps} {...props} />
  }

  return (props: any) =>
    React.useMemo(() => <WrappedComponent {...props} />, [])
}
