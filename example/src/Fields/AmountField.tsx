/* eslint-disable no-unused-vars */

import React from 'react'
import { withDynamicForms } from '@synnada/dynamic-forms'
import { useField } from 'formik'
// import * as Yup from 'yup';

function AmountField({ fieldProps, ...props }: any) {
  // const { values, set } = useFormikContext()
  const [field, meta] = useField(props)
  return (
    <>
      <input {...props} {...field} value={field?.value || ''} />
      {!!meta.touched && !!meta.error && <div>{meta.error}</div>}
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
  initialValue: 1,
  dependsOn: {
    client: ({ relationValue }: any) => relationValue?.value === '12211212'
  }
}

export default withDynamicForms(rules)(AmountField)
