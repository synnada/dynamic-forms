/* eslint-disable no-unused-vars */

import React from 'react'
import { withDynamicForms } from '@synnada/dynamic-forms'
import { useField } from 'formik'
// import * as Yup from 'yup';

function QuantityField({ fieldProps, ...props }: any) {
  // const { values, set } = useFormikContext()
  const [field, meta] = useField(props)
  return (
    <>
      <input {...props} {...field} value={field?.value || ''} />
      {!!meta.touched && !!meta.error && <div>{meta.error}</div>}
    </>
  )
}

const rules = {}

export default withDynamicForms(rules)(QuantityField)
