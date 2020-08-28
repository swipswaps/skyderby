import React from 'react'
import { Field } from 'formik'
import I18n from 'i18n-js'

import FlatButton from 'components/ui/FlatButton'
import Input from 'components/ui/Input'

import SuitSelect from './SuitSelect'
import { InputContainer, SuitInputModeToggle, ErrorMessage } from './elements'

const TrackSuitField = () => (
  <InputContainer>
    <Field name="suitId">
      {({
        field: { name, ...props },
        form: { values, errors, touched, setFieldValue }
      }) => (
        <>
          <SuitSelect
            hide={values.formSupportData.suitInputMode === 'input'}
            isInvalid={touched.suitId && errors.suitId}
            {...props}
            onChange={value => setFieldValue(name, value)}
          />
          {touched.suitId && errors.suitId && (
            <ErrorMessage>{errors.suitId}</ErrorMessage>
          )}
        </>
      )}
    </Field>

    <Field name="missingSuitName">
      {({ field, form: { values, errors, touched } }) => (
        <>
          <Input
            hide={values.formSupportData.suitInputMode === 'select'}
            isInvalid={touched.missingSuitName && errors.missingSuitName}
            placeholder={I18n.t('tracks.form.suit_text_placeholder')}
            {...field}
          />

          {touched.missingSuitName && errors.missingSuitName && (
            <ErrorMessage>{errors.missingSuitName}</ErrorMessage>
          )}
        </>
      )}
    </Field>

    <Field name="formSupportData.suitInputMode">
      {({ field: { value, name }, form: { setFieldValue } }) => (
        <SuitInputModeToggle>
          <span>
            {value === 'select'
              ? I18n.t('tracks.form.toggle_suit_caption')
              : I18n.t('tracks.form.toggle_suit_caption_select')}
          </span>
          <FlatButton
            as="span"
            onClick={() => setFieldValue(name, value === 'select' ? 'input' : 'select')}
          >
            {value === 'select'
              ? I18n.t('tracks.form.toggle_suit_link')
              : I18n.t('tracks.form.toggle_suit_link_select')}
          </FlatButton>
        </SuitInputModeToggle>
      )}
    </Field>
  </InputContainer>
)

export default TrackSuitField