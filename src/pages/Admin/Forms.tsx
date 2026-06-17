import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '../../components/ui/Card'
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { Dropdown, DropdownItem } from '../../components/ui/Dropdown'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { deleteForm, listForms } from '../../lib/forms/formsStorage'
import type { FormSchema } from '../../types/form'

function formatDate(iso?: string): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return '—'
  }
}

const Forms = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [forms, setForms] = useState<FormSchema[]>(() => listForms())
  const [search, setSearch] = useState('')
  const [deletingForm, setDeletingForm] = useState<FormSchema | null>(null)

  const refreshForms = useCallback(() => {
    setForms(listForms())
  }, [])

  const filteredForms = useMemo(() => {
    const query = search.toLowerCase()
    return forms.filter(
      (form) =>
        form.title.toLowerCase().includes(query) ||
        form.formId.toLowerCase().includes(query),
    )
  }, [forms, search])

  const handleDelete = () => {
    if (!deletingForm) return
    deleteForm(deletingForm.formId)
    toast.success(t('forms.deleted_success', 'Form deleted successfully'))
    setDeletingForm(null)
    refreshForms()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">
            {t('forms.title', 'Dynamic Forms')}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {t('forms.subtitle', 'Create and manage custom form schemas.')}
          </p>
        </div>
        <Button
          className="shrink-0 gap-2"
          onClick={() => navigate('/admin/forms/new')}
        >
          <Plus size={16} />
          {t('forms.create', 'Create Form')}
        </Button>
      </div>

      <Card className="p-0">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface/50 rounded-t-[20px]">
          <div className="w-full sm:w-96">
            <Input
              icon={Search}
              placeholder={t('forms.search_placeholder', 'Search by title or ID...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filteredForms.length === 0 ? (
          <div className="p-12 text-center text-text-secondary">
            {search
              ? t('forms.no_results', 'No forms match your search.')
              : t('forms.empty', 'No forms yet. Create your first form.')}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('forms.col_title', 'Title')}</TableHead>
                <TableHead>{t('forms.col_fields', 'Fields')}</TableHead>
                <TableHead>{t('forms.col_updated', 'Last Updated')}</TableHead>
                <TableHead className="text-right">{t('forms.col_actions', 'Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredForms.map((form) => (
                <TableRow key={form.formId}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-text">{form.title}</div>
                      <div className="text-xs text-text-secondary font-mono">
                        {form.formId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{form.fields.length}</TableCell>
                  <TableCell>{formatDate(form.updatedAt ?? form.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Dropdown
                      align="right"
                      trigger={
                        <button className="p-1 text-text-secondary hover:text-text hover:bg-surface rounded-md transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      }
                    >
                      <DropdownItem
                        onClick={() => navigate(`/admin/forms/${form.formId}/edit`)}
                      >
                        <Edit2 size={14} /> {t('forms.edit', 'Edit Form')}
                      </DropdownItem>
                      <DropdownItem danger onClick={() => setDeletingForm(form)}>
                        <Trash2 size={14} /> {t('forms.delete', 'Delete Form')}
                      </DropdownItem>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal
        isOpen={!!deletingForm}
        onClose={() => setDeletingForm(null)}
        title={t('forms.delete_title', 'Delete Form')}
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            {t(
              'forms.delete_confirm',
              'Delete "{{title}}"? This cannot be undone.',
              { title: deletingForm?.title ?? '' },
            )}
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setDeletingForm(null)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              {t('forms.delete', 'Delete Form')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Forms
