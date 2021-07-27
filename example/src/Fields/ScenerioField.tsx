/* eslint-disable no-unused-vars */

import React from 'react'
import FormSelectAsync from '../components/FormSelectAsync'
import { useDynamicForms, withDynamicForms } from '@synnada/dynamic-forms'
// import * as Yup from 'yup';

function delay(delayInms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2)
    }, delayInms)
  })
}

function ScenerioField({ name, fieldProps }: any) {
  const { setLoading } = useDynamicForms()
  // const [manupilated, setManupilated] = useState(initialState)

  const {
    isManupilated = false,
    loadOptions = () => {},
    disabled = false
  }: any = fieldProps!

  return (
    <>
      <label>Scenerio</label>
      <FormSelectAsync
        fieldName={name}
        loadOptions={loadOptions}
        isManupilated={isManupilated}
        isClearable
        isSearchable
        cacheOptions={false}
        isDisabled={disabled}
        setIsLoading={setLoading}
      />
    </>
  )
}

/* const FILED_NAME = fieldNames.client

ClientField.rule = {
  id: FILED_NAME,
  render: ClientField,
  fieldProps: {
    loadOptions: () =>
      delay(3000).then(() => [
        { value: '1', label: 'Mehmet' },
        { value: '2', label: 'Kerem' }
      ]),
    disabled: false
  },
  manupilation: {
    [fieldNames.invoiceScenario]: ({ relatedState }) => {
      if (relatedState?.value === 'EXPORT_INVOICE') {
        return {
          loadOptions: () =>
            delay(3000).then(() => [
              { value: '12211212', label: 'Gümrük', selected: true }
            ]),
          disabled: true
        }
      }

      return false
    }
  },
  validate: (values) =>
    Yup.object().nullable().required('Müşteri alanı zorunludur')
} */

const rules = {
  fieldProps: {
    loadOptions: () =>
      delay(3000).then(() => [
        { value: 'COMMERCIAL_INVOICE', label: 'Ticari Fatura' },
        { value: 'BASE_INVOICE', label: 'Temel Fatura' },
        { value: 'WITH_PASSENGER_INVOICE', label: 'Yolcu Beraber Fatura' },
        { value: 'EXPORT_INVOICE', label: 'İhracat Faturası' }
      ]),
    disabled: false
  },
  dependsOn: {
    /* amount: ({ relationValue }: any) => relationValue === '2' */
  },
  manupilation: {
    sentType: ({ relationValue }: any) => {
      if (relationValue?.value === 'E_INVOICE') {
        return {
          loadOptions: () =>
            delay(1000).then(() => [
              {
                value: 'COMMERCIAL_INVOICE',
                label: 'Ticari Fatura',
                selected: true
              }
            ]),
          disabled: true
        }
      }

      if (relationValue?.value === 'E_ARCHIVE') {
        return {
          loadOptions: () =>
            delay(1000).then(() => [
              {
                value: 'E_COMMERCIAL_INVOICE',
                label: 'E Ticari Fatura',
                selected: true
              }
            ]),
          disabled: true
        }
      }

      return false
    }
  }
}

export default withDynamicForms(rules)(ScenerioField)
