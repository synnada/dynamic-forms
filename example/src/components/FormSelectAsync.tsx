/* eslint-disable no-console */
/**
 *
 * SelectAsync
 *
 */

import { Field, useFormikContext } from 'formik'
import React, { useEffect, useState } from 'react'
// @ts-ignore
import Select from 'react-select'
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

const valueOrNull = (value = null) => value

function FormSelectAsync(
  {
    afterSelect,
    fieldName,
    loadOptions,
    isManupilated,
    defaultOptions,
    setIsLoading: setIsLoadingState,
    ...rest
  }: any /* {
  fieldName: string
  afterSelect: Function
  loadOptions: Function
  isManupilated: Boolean
  defaultOptions: Object
  setIsLoading: Function
  rest: any
} */
) {
  const { setFieldValue, getFieldMeta } = useFormikContext()
  const [options, setOptions] = useState(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [manual, setManual] = useState(false)
  const [manupilated, setManupilated] = useState<any>(undefined)

  const isSelectedValueSame = (willSelect: { value: null | undefined }) =>
    valueOrNull((getFieldMeta(fieldName) as any)?.value?.value) ===
    valueOrNull(willSelect?.value)

  const fetchOptions = (
    afterLoad: { (): any; (): any } | undefined = undefined
  ) => {
    if (!isLoading) {
      setIsLoading(true)
      loadOptions(inputValue)
        .then((response: React.SetStateAction<undefined>) => {
          setOptions(response)
        })
        .catch((err: { message: any }) => {
          console.log('error occured: ', err.message)
        })
        .finally(() => {
          afterLoad && afterLoad()
          setIsLoading(false)
        })
    }
  }

  const fetchWithPageLoading = () => {
    setIsLoadingState && setIsLoadingState(fieldName, true)
    fetchOptions(() => setIsLoadingState && setIsLoadingState(fieldName, false))
  }

  useEffect(() => {
    if (!options && defaultOptions) {
      console.log(fieldName, 'defaultOptions called')
      fetchWithPageLoading()
    } else if (inputValue) {
      console.log(fieldName, 'input value called')
      fetchOptions()
    }
  }, [inputValue])

  /* useEffect(() => {
     if (fieldProps?.manupilated_timestamp) {
       setManual(false);
       setIsLoadingState(true);
       fetchOptions(() => setIsLoadingState(false));
     } else {
       if (!options) fetchOptions();
     }
   }, [values]); */

  useEffect(() => {
    console.log(fieldName, 'manupilated=' /* fieldProps?.manupilated */)

    if (isManupilated !== manupilated) {
      if (manupilated && !isManupilated) {
        // daha önce manupile edilmiş, orijinasl haline döndürülüyor
        setManual(false)
        fetchWithPageLoading()
        setManupilated(undefined)
      } else {
        setManupilated(isManupilated)
      }
    }
  }, [isManupilated])

  useEffect(() => {
    if (manupilated !== undefined) {
      if (manupilated === true) {
        setManual(false)
        fetchWithPageLoading()
      } else if (manupilated === false) {
        // fetchOptions();
      }
    }
    /* setIsLoadingState(true);
     fetchOptions(() => setIsLoadingState(false)); */
  }, [manupilated])

  useEffect(() => {
    if (options !== undefined && !inputValue) {
      const willSelect = (options as any).find(
        (obj: { selected: any }) => obj?.selected
      )
      if (willSelect) {
        if (!manual && !isSelectedValueSame(willSelect)) {
          setValue(fieldName, willSelect, true)
          console.log('option seçildi', willSelect)
        }
      } else if (!manual) {
        setValue(fieldName, null)
      }
    }
  }, [options])

  const onChange = (object: any) => {
    setValue(fieldName, object, true)
    setManual(true)
    // setInputValue('');
    console.log('formik field güncellendi', object)
  }

  const setValue = (name: string, value: null, isValidated = false) => {
    setFieldValue(name, value, isValidated)
    afterSelect && afterSelect(value)
  }

  return (
    <Field name={fieldName}>
      {({
        field, // { name, value, onChange, onBlur }
        form: { errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        meta
      }: any) => (
        <>
          <Select
            {...field}
            loadingMessage={() => 'Yükleniyor...'}
            noOptionsMessage={() => 'Kayıt bulunamadı'}
            placeholder='Seçiniz'
            id={fieldName}
            options={options}
            onChange={onChange}
            inputValue={inputValue}
            onInputChange={(v: React.SetStateAction<string>) => {
              setInputValue(v)
            }}
            invalid={meta.touched && meta.error}
            errorMessage={errors[fieldName]}
            isLoading={isLoading}
            cacheOptions={false}
            {...rest}
          />
        </>
      )}
    </Field>
  )
}

export default FormSelectAsync
