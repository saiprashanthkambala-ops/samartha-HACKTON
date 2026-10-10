import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { crops } from '../../data/crops.js';

const ACTIVITY_ICON_KEYS = ['sowing', 'fertilizer', 'irrigation', 'pest', 'harvest', 'expense', 'note'];

/**
 * Add-new-entry modal form.
 * - Validates required fields (date, activity type, crop, description).
 * - Preserves entered values when a save fails.
 * - Closes only after confirmed success or explicit cancel.
 */
export default function DiaryEntryForm({ onSave, onCancel }) {
  const { t, cropName } = useLanguage();
  const [values, setValues] = useState({
    date: new Date().toISOString().slice(0, 10),
    activityType: 'sowing',
    cropId: '',
    description: '',
    quantity: '',
    unit: '',
    expense: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  function set(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!values.date) next.date = t('diary.form.required');
    if (!values.activityType) next.activityType = t('diary.form.required');
    if (!values.cropId) next.cropId = t('diary.form.required');
    if (!values.description.trim()) next.description = t('diary.form.required');
    if (values.quantity !== '' && Number.isNaN(Number(values.quantity))) {
      next.quantity = t('diary.form.invalidNumber');
    }
    if (values.expense !== '' && Number.isNaN(Number(values.expense))) {
      next.expense = t('diary.form.invalidNumber');
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaveError(null);
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        date: values.date,
        activityType: values.activityType,
        cropId: values.cropId,
        description: values.description.trim(),
        quantity: values.quantity === '' ? null : Number(values.quantity),
        unit: values.unit || null,
        expense: values.expense === '' ? null : Number(values.expense),
        notes: values.notes.trim() || null,
      });
      // Parent closes the modal only after confirmed success.
    } catch (err) {
      // Keep the form (and user input) open on failure.
      setSaveError(err?.message || t('diary.form.failed'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={t('diary.form.title')}>
        <div className="modal-head">
          <h2>{t('diary.form.title')}</h2>
          <button type="button" className="modal-close" aria-label={t('common.close')} onClick={onCancel}>
            <X size={18} aria-hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="diary-date">
                {t('diary.form.date')} <span className="req">*</span>
              </label>
              <input
                id="diary-date"
                type="date"
                value={values.date}
                onChange={(e) => set('date', e.target.value)}
                className={errors.date ? 'invalid' : ''}
                required
              />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>

            <div className="field">
              <label htmlFor="diary-type">
                {t('diary.form.activityType')} <span className="req">*</span>
              </label>
              <select
                id="diary-type"
                value={values.activityType}
                onChange={(e) => set('activityType', e.target.value)}
                className={errors.activityType ? 'invalid' : ''}
                required
              >
                {ACTIVITY_ICON_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {t(`diary.entry.${k}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="diary-crop">
              {t('diary.form.crop')} <span className="req">*</span>
            </label>
            <select
              id="diary-crop"
              value={values.cropId}
              onChange={(e) => set('cropId', e.target.value)}
              className={errors.cropId ? 'invalid' : ''}
              required
            >
              <option value="">—</option>
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {cropName(c)}
                </option>
              ))}
            </select>
            {errors.cropId && <span className="error-text">{errors.cropId}</span>}
          </div>

          <div className="field">
            <label htmlFor="diary-desc">
              {t('diary.form.description')} <span className="req">*</span>
            </label>
            <textarea
              id="diary-desc"
              rows={3}
              value={values.description}
              onChange={(e) => set('description', e.target.value)}
              className={errors.description ? 'invalid' : ''}
              required
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="grid-2">
            <div className="field">
              <label htmlFor="diary-qty">{t('diary.form.quantity')}</label>
              <input
                id="diary-qty"
                type="text"
                inputMode="decimal"
                value={values.quantity}
                onChange={(e) => set('quantity', e.target.value)}
                className={errors.quantity ? 'invalid' : ''}
              />
              {errors.quantity && <span className="error-text">{errors.quantity}</span>}
            </div>
            <div className="field">
              <label htmlFor="diary-unit">{t('diary.form.unit')}</label>
              <input id="diary-unit" type="text" value={values.unit} onChange={(e) => set('unit', e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="diary-expense">{t('diary.form.expense')}</label>
            <input
              id="diary-expense"
              type="text"
              inputMode="decimal"
              value={values.expense}
              onChange={(e) => set('expense', e.target.value)}
              className={errors.expense ? 'invalid' : ''}
            />
            {errors.expense && <span className="error-text">{errors.expense}</span>}
          </div>

          <div className="field">
            <label htmlFor="diary-notes">{t('diary.form.notes')}</label>
            <textarea id="diary-notes" rows={2} value={values.notes} onChange={(e) => set('notes', e.target.value)} />
          </div>

          {saveError && (
            <div className="alert-item error" role="alert">
              <div>
                <strong>{t('diary.form.failed')}</strong>
                <p>{saveError}</p>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-white" onClick={onCancel} disabled={saving}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-green" disabled={saving}>
              <Save size={16} aria-hidden /> {saving ? t('common.loading') : t('diary.form.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
