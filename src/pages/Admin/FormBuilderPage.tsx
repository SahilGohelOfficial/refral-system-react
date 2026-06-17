import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import FormBuilder from '../../components/forms/builder/FormBuilder'
import { createEmptySchema } from '../../lib/forms/createField'
import { DuplicateFieldLabelError, validateFormSchema } from '../../lib/forms/fieldId'
import { getForm, saveForm } from '../../lib/forms/formsStorage'
import type { FormSchema } from '../../types/form'

const FormBuilderPage = () => {
  const { formId } = useParams<{ formId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isSaving, setIsSaving] = useState(false)

  const isEditMode = Boolean(formId)
  const initialSchema = useMemo<FormSchema | null>(() => {
    if (!isEditMode) return createEmptySchema()
    return getForm(formId!)
  }, [formId, isEditMode])

  const handleSave = useCallback(
    (schema: FormSchema) => {
      setIsSaving(true)
      try {
        validateFormSchema(schema)
        saveForm(schema)
        toast.success(
          isEditMode
            ? t('forms.updated_success', 'Form updated successfully')
            : t('forms.created_success', 'Form created successfully'),
        )
        navigate('/admin/forms')
      } catch (e) {
        if (e instanceof DuplicateFieldLabelError) {
          toast.error(e.message)
        } else {
          toast.error(t('forms.save_error', 'Failed to save form'))
        }
      } finally {
        setIsSaving(false)
      }
    },
    [isEditMode, navigate, t],
  )

  const handleCancel = useCallback(() => {
    navigate('/admin/forms')
  }, [navigate])

  if (isEditMode && !initialSchema) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-text">
          {t('forms.not_found_title', 'Form Not Found')}
        </h1>
        <p className="text-text-secondary">
          {t('forms.not_found_desc', 'The form you are looking for does not exist.')}
        </p>
        <button
          type="button"
          onClick={() => navigate('/admin/forms')}
          className="text-primary hover:underline"
        >
          {t('forms.back_to_list', 'Back to forms list')}
        </button>
      </div>
    )
  }

  if (!initialSchema) return null

  return (
    <FormBuilder
      key={initialSchema.formId}
      initialSchema={initialSchema}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
    />
  )
}

export default FormBuilderPage
