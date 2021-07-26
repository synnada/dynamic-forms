/* eslint-disable no-unused-vars */

import React from 'react'
import FormSelectAsync from '../components/FormSelectAsync'
import { withDynamicForms } from '@synnada/dynamic-forms'
// import * as Yup from 'yup';

function delay(delayInms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2)
    }, delayInms)
  })
}

function SentTypeField({ name }: any) {
  // const {} = useDynamicForms({ values })

  return (
    <>
      <label>Sent Type</label>
      <FormSelectAsync
        fieldName={name}
        loadOptions={() =>
          delay(3000).then(() => [
            { value: 'E_INVOICE', label: 'E-Fatura' },
            { value: 'E_ARCHIVE', label: 'E-Arşiv' }
          ])
        }
        isManupilated={false}
        isClearable
        isSearchable
        cacheOptions={false}
        isDisabled={false}
        setIsLoading={() => {}}
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
  dependsOn: {
    /* amount: ({ relationValue }: any) => relationValue === '2' */
  }
}

export default withDynamicForms(rules)(SentTypeField)
