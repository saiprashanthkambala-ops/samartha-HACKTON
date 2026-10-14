import { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Thermometer,
  Droplets,
  Plus,
  Activity,
  CheckCircle,
  Send,
  X,
  Package,
  Layers,
  Archive,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { PageContainer, PageHeading } from '../components/layout/Page.jsx';
import { crops } from '../data/crops.js';
import { getStorageProfileId, getSafeThresholds } from '../utils/cropMatcher.js';
import {
  getStorageBatches,
  createStorageBatch,
  closeStorageBatch,
  ingestBatchReading,
  getStorageAlerts,
  updateAlertStatus,
  dispatchWhatsappAlert,
} from '../api/services.js';
import { getToken } from '../api/client.js';

const DEMO_BATCHES = [
  {
    batch_id: 'batch_demo_paddy',
    crop_id: 'paddy_grain_ambient',
    crop_name: 'Paddy (Rice)',
    custom_batch_name: 'Sona Masoori Rabi Harvest',
    quantity_kg: 2500,
    storage_structure_type: 'Hermetic Bag / Warehouse',
    storage_location: 'Guntur Godown #3',
    storage_start_date: '2026-10-01',
    status: 'active',
    latest_reading: {
      temperature_c: 24.2,
      relative_humidity_percent: 62.0,
      grain_moisture_percent: 12.8,
      recorded_at: '2026-10-11T03:30:00Z',
    },
  },
  {
    batch_id: 'batch_demo_onion',
    crop_id: 'onion_bulb_ambient_ventilated',
    crop_name: 'Onion',
    custom_batch_name: 'Nashik Red Rabi Store',
    quantity_kg: 4000,
    storage_structure_type: 'Ventilated Thatched Chawl',
    storage_location: 'Nashik Farm Compound',
    storage_start_date: '2026-09-25',
    status: 'active',
    latest_reading: {
      temperature_c: 29.5,
      relative_humidity_percent: 74.0,
      grain_moisture_percent: null,
      recorded_at: '2026-10-11T02:15:00Z',
    },
  },
];

const DEMO_ALERTS = [
  {
    alert_id: 'alert_demo_01',
    batch_id: 'batch_demo_onion',
    crop_name: 'Onion',
    severity: 'warning',
    condition_type: 'high_humidity',
    measured_value: 74.0,
    threshold_value: 72.0,
    unit: '%',
    recommended_action: 'Increase bottom cross-ventilation in chawl. Open side screens to disperse moisture pockets.',
    status: 'active',
    created_at: '2026-10-11T02:15:00Z',
  },
];

const TRADITIONAL_TECHNIQUES = [
  {
    title: 'Pusa Bin Hermetic Earthen Granary',
    crops: 'Paddy, Wheat, Maize, Millets',
    source: 'ICAR - Indian Agricultural Research Institute (IARI)',
    description:
      'Double-walled earthen brick granary with a 700-gauge polyethylene sandwich film that blocks oxygen ingress, keeping grain naturally insect-free without chemical fumigation.',
  },
  {
    title: 'Neem Leaf & Kernel Layering',
    crops: 'Paddy (Rice), Wheat, Sorghum',
    source: 'ICAR-IIRR Indigenous Technical Knowledge Compendium',
    description:
      'Dried Azadirachta indica leaves mixed at 2% w/w ratio. Azadirachtin deters rice weevil (Sitophilus oryzae) and grain moths. Leaves must be completely sun-dried until brittle before mixing.',
  },
  {
    title: 'Vegetable Oil Smearing Technique',
    crops: 'Chickpea, Red Gram, Green Gram, Black Gram',
    source: 'ICAR Indian Institute of Pulses Research (IIPR)',
    description:
      'Coating pulse seeds with 3-5 ml/kg of edible mustard or castor oil. The thin lipid layer blocks respiratory spiracles of adult bruchid beetles and prevents egg oviposition on seed coats.',
  },
  {
    title: 'Ventilated Onion Chawl (Medha System)',
    crops: 'Onion, Garlic',
    source: 'ICAR Directorate of Onion and Garlic Research (DOGR)',
    description:
      'Elevated bamboo/wire mesh structure with bottom slats 50 cm off ground and sugarcane thatch roof. Natural wind draft prevents condensation and suppresses sprouting.',
  },
  {
    title: 'Zero Energy Cool Chamber (ZECC)',
    crops: 'Tomato, Mango, Fresh Fruits & Vegetables',
    source: 'IARI Horticulture Division',
    description:
      'Double-brick structure with river sand cavity watered twice daily. Evaporative cooling drops internal temperature by 8–12°C and maintains 85–92% RH, doubling fresh produce shelf life without electricity.',
  },
  {
    title: 'Potato Heap Suberization in Sand Beds',
    crops: 'Potato (Ware Tubers)',
    source: 'ICAR Central Potato Research Institute (CPRI)',
    description:
      'Curing newly harvested tubers at 15–20°C and 90% RH for 10–12 days in dark thatched huts under sand beds to heal skin abrasions and prevent greening solanine buildup.',
  },
];

export default function StorageMonitoringPage() {
  const { t } = useLanguage();
  const [batches, setBatches] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [whatsappStatus, setWhatsappStatus] = useState({});

  // Modals state
  const [newBatchOpen, setNewBatchOpen] = useState(false);
  const [ingestModalOpen, setIngestModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Form states
  const [newBatchForm, setNewBatchForm] = useState({
    cropId: 'paddy',
    customBatchName: '',
    quantityKg: '',
    storageStructure: 'Warehouse / Hermetic Bag',
    storageLocation: '',
    harvestDate: new Date().toISOString().split('T')[0],
    initialCondition: 'Clean, dried, good grade',
    notes: '',
  });

  const [readingForm, setReadingForm] = useState({
    temperature: '',
    humidity: '',
    moisture: '',
  });

  async function loadData() {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setBatches(DEMO_BATCHES);
        setAlerts(DEMO_ALERTS);
        setIsDemo(true);
        setLoading(false);
        return;
      }
      const [batchesRes, alertsRes] = await Promise.all([
        getStorageBatches('active'),
        getStorageAlerts(null, 'active'),
      ]);

      if (batchesRes?.data && batchesRes.data.length > 0) {
        setBatches(batchesRes.data);
        setIsDemo(batchesRes.source === 'demo');
      } else {
        setBatches(DEMO_BATCHES);
        setIsDemo(true);
      }

      if (alertsRes?.data && alertsRes.data.length > 0) {
        setAlerts(alertsRes.data);
      } else {
        setAlerts(DEMO_ALERTS);
      }
    } catch {
      setBatches(DEMO_BATCHES);
      setAlerts(DEMO_ALERTS);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateBatch(e) {
    e.preventDefault();
    const storageProfileId = getStorageProfileId(newBatchForm.cropId);
    const selectedCropObj = crops.find((c) => c.id === newBatchForm.cropId);

    const payload = {
      crop_id: storageProfileId,
      custom_batch_name: newBatchForm.customBatchName || `${selectedCropObj?.name || 'Crop'} Batch`,
      quantity_kg: parseFloat(newBatchForm.quantityKg) || 1000,
      harvest_date: newBatchForm.harvestDate,
      storage_start_date: new Date().toISOString().split('T')[0],
      storage_structure_type: newBatchForm.storageStructure,
      storage_location: newBatchForm.storageLocation || 'Main Storage',
      initial_crop_condition: newBatchForm.initialCondition,
      notes: newBatchForm.notes,
    };

    try {
      if (!isDemo && getToken()) {
        const res = await createStorageBatch(payload);
        if (res?.data) {
          setBatches((prev) => [res.data, ...prev]);
        }
      } else {
        const demoNew = {
          batch_id: `batch_local_${Date.now()}`,
          crop_id: storageProfileId,
          crop_name: selectedCropObj?.name || 'Crop',
          custom_batch_name: payload.custom_batch_name,
          quantity_kg: payload.quantity_kg,
          storage_structure_type: payload.storage_structure_type,
          storage_location: payload.storage_location,
          storage_start_date: payload.storage_start_date,
          status: 'active',
          latest_reading: null,
        };
        setBatches((prev) => [demoNew, ...prev]);
      }
      setNewBatchOpen(false);
      setNewBatchForm({
        cropId: 'paddy',
        customBatchName: '',
        quantityKg: '',
        storageStructure: 'Warehouse / Hermetic Bag',
        storageLocation: '',
        harvestDate: new Date().toISOString().split('T')[0],
        initialCondition: 'Clean, dried, good grade',
        notes: '',
      });
    } catch (err) {
      alert(err.message || 'Error creating storage batch.');
    }
  }

  async function handleIngestReading(e) {
    e.preventDefault();
    if (!selectedBatch) return;

    const payload = {
      temperature_c: parseFloat(readingForm.temperature),
      relative_humidity_percent: parseFloat(readingForm.humidity),
      grain_moisture_percent: readingForm.moisture ? parseFloat(readingForm.moisture) : null,
    };

    try {
      if (!isDemo && getToken()) {
        const res = await ingestBatchReading(selectedBatch.batch_id, payload);
        if (res?.data) {
          loadData();
        }
      } else {
        const thresholds = getSafeThresholds(selectedBatch.crop_id);
        const newReading = {
          temperature_c: payload.temperature_c,
          relative_humidity_percent: payload.relative_humidity_percent,
          grain_moisture_percent: payload.grain_moisture_percent,
          recorded_at: new Date().toISOString(),
        };

        setBatches((prev) =>
          prev.map((b) =>
            b.batch_id === selectedBatch.batch_id ? { ...b, latest_reading: newReading } : b
          )
        );

        if (payload.relative_humidity_percent > thresholds.rhMax) {
          const newAlert = {
            alert_id: `alert_local_${Date.now()}`,
            batch_id: selectedBatch.batch_id,
            crop_name: selectedBatch.crop_name || selectedBatch.custom_batch_name,
            severity: payload.relative_humidity_percent > thresholds.rhMax + 6 ? 'critical' : 'warning',
            condition_type: 'high_humidity',
            measured_value: payload.relative_humidity_percent,
            threshold_value: thresholds.rhMax,
            unit: '%',
            recommended_action: 'Elevated relative humidity detected. Provide afternoon ventilation or inspect moisture barriers.',
            status: 'active',
            created_at: new Date().toISOString(),
          };
          setAlerts((prev) => [newAlert, ...prev]);
        }
      }
      setIngestModalOpen(false);
      setSelectedBatch(null);
      setReadingForm({ temperature: '', humidity: '', moisture: '' });
    } catch (err) {
      alert(err.message || 'Error ingesting sensor reading.');
    }
  }

  async function handleUpdateAlert(alertId, newStatus) {
    try {
      if (!isDemo && getToken()) {
        await updateAlertStatus(alertId, newStatus);
      }
      setAlerts((prev) => prev.filter((a) => a.alert_id !== alertId));
    } catch (err) {
      alert(err.message || 'Error updating alert status.');
    }
  }

  async function handleSendWhatsapp(alertId) {
    try {
      setWhatsappStatus((prev) => ({ ...prev, [alertId]: 'sending' }));
      if (!isDemo && getToken()) {
        const res = await dispatchWhatsappAlert(alertId);
        setWhatsappStatus((prev) => ({
          ...prev,
          [alertId]: res?.data?.dispatched ? 'sent' : 'failed',
        }));
      } else {
        await new Promise((r) => setTimeout(r, 800));
        setWhatsappStatus((prev) => ({ ...prev, [alertId]: 'sent' }));
      }
    } catch {
      setWhatsappStatus((prev) => ({ ...prev, [alertId]: 'failed' }));
    }
  }

  async function handleCloseBatch(batchId) {
    if (!confirm('Are you sure you want to close this storage batch?')) return;
    try {
      if (!isDemo && getToken()) {
        await closeStorageBatch(batchId);
      }
      setBatches((prev) => prev.filter((b) => b.batch_id !== batchId));
    } catch (err) {
      alert(err.message || 'Error closing storage batch.');
    }
  }

  return (
    <PageContainer>
      <PageHeading title={t('storage.title')} subtitle={t('storage.subtitle')} />
      {/* Top Banner & Action */}
      <div className="storage-header-actions">
        <div className="storage-status-pill">
          {isDemo ? (
            <span className="badge badge-demo">Demo Mode & Fallback Active</span>
          ) : (
            <span className="badge badge-live">Live FarmShield API Connected</span>
          )}
        </div>
        <button
          type="button"
          className="btn btn-primary btn-with-icon"
          onClick={() => setNewBatchOpen(true)}
        >
          <Plus size={18} aria-hidden />
          <span>{t('storage.newBatch')}</span>
        </button>
      </div>

      {/* Active Storage Alerts Section */}
      {alerts.length > 0 && (
        <section className="storage-alerts-panel" aria-labelledby="alerts-heading">
          <div className="storage-section-title">
            <ShieldAlert size={22} className="alert-icon-title" aria-hidden />
            <h2 id="alerts-heading">{t('storage.riskAlerts')}</h2>
            <span className="badge badge-danger">{alerts.length} Active</span>
          </div>

          <div className="storage-alerts-grid">
            {alerts.map((alertItem) => (
              <div
                key={alertItem.alert_id}
                className={`storage-alert-card severity-${alertItem.severity || 'warning'}`}
              >
                <div className="alert-card-header">
                  <span className={`badge badge-${alertItem.severity === 'critical' ? 'critical' : 'warning'}`}>
                    {alertItem.severity === 'critical' ? t('storage.critical') : t('storage.warning')}
                  </span>
                  <span className="alert-crop-name">{alertItem.crop_name}</span>
                </div>
                <div className="alert-reading-diff">
                  <strong>
                    {alertItem.measured_value}
                    {alertItem.unit}
                  </strong>{' '}
                  <span className="threshold-diff">
                    (Limit: {alertItem.threshold_value}
                    {alertItem.unit})
                  </span>
                </div>
                <p className="alert-action-text">{alertItem.recommended_action}</p>

                <div className="alert-btn-group">
                  <button
                    type="button"
                    className="btn btn-sm btn-white"
                    onClick={() => handleUpdateAlert(alertItem.alert_id, 'acknowledged')}
                  >
                    {t('storage.acknowledge')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => handleUpdateAlert(alertItem.alert_id, 'resolved')}
                  >
                    <CheckCircle size={14} aria-hidden /> {t('storage.resolve')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleSendWhatsapp(alertItem.alert_id)}
                    disabled={whatsappStatus[alertItem.alert_id] === 'sending'}
                  >
                    <Send size={14} aria-hidden />{' '}
                    {whatsappStatus[alertItem.alert_id] === 'sent'
                      ? 'Dispatched'
                      : whatsappStatus[alertItem.alert_id] === 'sending'
                      ? 'Sending...'
                      : t('storage.whatsappNotify')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Storage Batches Section */}
      <section className="storage-batches-section" aria-labelledby="batches-heading">
        <div className="storage-section-title">
          <Layers size={22} aria-hidden />
          <h2 id="batches-heading">{t('storage.activeBatches')}</h2>
        </div>

        {loading ? (
          <div className="storage-loading-box">Loading storage batches...</div>
        ) : batches.length === 0 ? (
          <div className="storage-empty-state">
            <Archive size={36} aria-hidden />
            <p>{t('storage.noBatches')}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setNewBatchOpen(true)}
            >
              {t('storage.newBatch')}
            </button>
          </div>
        ) : (
          <div className="storage-batches-grid">
            {batches.map((batch) => {
              const thresholds = getSafeThresholds(batch.crop_id);
              const reading = batch.latest_reading;
              const isTempSafe =
                reading &&
                reading.temperature_c >= thresholds.tempMin &&
                reading.temperature_c <= thresholds.tempMax;
              const isRhSafe =
                reading &&
                reading.relative_humidity_percent >= thresholds.rhMin &&
                reading.relative_humidity_percent <= thresholds.rhMax;

              return (
                <div key={batch.batch_id} className="storage-batch-card">
                  <div className="batch-card-header">
                    <div>
                      <h3 className="batch-title">{batch.custom_batch_name}</h3>
                      <span className="batch-crop-badge">{batch.crop_name || 'Crop'}</span>
                    </div>
                    <span className="batch-quantity">
                      {batch.quantity_kg?.toLocaleString()} kg
                    </span>
                  </div>

                  <div className="batch-meta-list">
                    <div className="batch-meta-item">
                      <span>{t('storage.structureType')}:</span>
                      <strong>{batch.storage_structure_type || 'Warehouse'}</strong>
                    </div>
                    <div className="batch-meta-item">
                      <span>{t('storage.location')}:</span>
                      <strong>{batch.storage_location || 'Main Storage'}</strong>
                    </div>
                    <div className="batch-meta-item">
                      <span>{t('storage.startDate')}:</span>
                      <strong>{batch.storage_start_date || 'Recent'}</strong>
                    </div>
                  </div>

                  {/* Telemetry Display */}
                  <div className="batch-telemetry-box">
                    <div className="telemetry-box-head">
                      <span className="telemetry-label">
                        <Activity size={16} aria-hidden /> {t('storage.liveTelemetry')}
                      </span>
                      {reading ? (
                        <span className={`status-tag ${isTempSafe && isRhSafe ? 'tag-safe' : 'tag-warn'}`}>
                          {isTempSafe && isRhSafe ? t('storage.normal') : t('storage.warning')}
                        </span>
                      ) : (
                        <span className="status-tag tag-none">No reading yet</span>
                      )}
                    </div>

                    <div className="telemetry-readings-row">
                      <div className="reading-stat">
                        <span className="reading-label">
                          <Thermometer size={14} aria-hidden /> {t('storage.temp')}
                        </span>
                        <span className="reading-val">
                          {reading ? `${reading.temperature_c}°C` : '—'}
                        </span>
                        <span className="safe-bound">
                          Safe: {thresholds.tempMin}–{thresholds.tempMax}°C
                        </span>
                      </div>

                      <div className="reading-stat">
                        <span className="reading-label">
                          <Droplets size={14} aria-hidden /> {t('storage.humidity')}
                        </span>
                        <span className="reading-val">
                          {reading ? `${reading.relative_humidity_percent}%` : '—'}
                        </span>
                        <span className="safe-bound">
                          Safe: {thresholds.rhMin}–{thresholds.rhMax}%
                        </span>
                      </div>

                      {thresholds.moistureMax && (
                        <div className="reading-stat">
                          <span className="reading-label">
                            <Package size={14} aria-hidden /> {t('storage.moisture')}
                          </span>
                          <span className="reading-val">
                            {reading?.grain_moisture_percent
                              ? `${reading.grain_moisture_percent}%`
                              : '—'}
                          </span>
                          <span className="safe-bound">Max: {thresholds.moistureMax}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="batch-card-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setSelectedBatch(batch);
                        setReadingForm({
                          temperature: reading?.temperature_c || '',
                          humidity: reading?.relative_humidity_percent || '',
                          moisture: reading?.grain_moisture_percent || '',
                        });
                        setIngestModalOpen(true);
                      }}
                    >
                      <Activity size={14} aria-hidden /> {t('storage.recordReading')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-white text-danger"
                      onClick={() => handleCloseBatch(batch.batch_id)}
                    >
                      {t('storage.closeBatch')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Traditional Knowledge Guidance (ICAR ITK) */}
      <section className="storage-traditional-section" aria-labelledby="itk-heading">
        <div className="storage-section-title">
          <BookOpen size={22} aria-hidden />
          <h2 id="itk-heading">{t('storage.traditionalTitle')}</h2>
        </div>

        <div className="itk-cards-grid">
          {TRADITIONAL_TECHNIQUES.map((tech) => (
            <div key={tech.title} className="itk-card">
              <div className="itk-card-head">
                <h3>{tech.title}</h3>
                <span className="itk-crops-chip">{tech.crops}</span>
              </div>
              <p className="itk-desc">{tech.description}</p>
              <div className="itk-source">Source: {tech.source}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ingest Telemetry Modal */}
      {ingestModalOpen && selectedBatch && (
        <div className="profile-modal-overlay" role="presentation" onMouseDown={() => setIngestModalOpen(false)}>
          <div className="profile-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
            <div className="profile-modal-head">
              <h2>{t('storage.ingestTitle')}</h2>
              <button
                type="button"
                className="profile-modal-close"
                onClick={() => setIngestModalOpen(false)}
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <p className="profile-privacy-note">
              Batch: <strong>{selectedBatch.custom_batch_name}</strong> ({selectedBatch.crop_name})
            </p>
            <p className="storage-sim-note">{t('storage.simNotice')}</p>

            <form onSubmit={handleIngestReading} className="profile-form">
              <div className="profile-form-grid">
                <label className="profile-field">
                  <span>{t('storage.temp')} (°C)</span>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={readingForm.temperature}
                    onChange={(e) =>
                      setReadingForm({ ...readingForm, temperature: e.target.value })
                    }
                    placeholder="e.g. 23.5"
                  />
                </label>
                <label className="profile-field">
                  <span>{t('storage.humidity')} (%)</span>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={readingForm.humidity}
                    onChange={(e) =>
                      setReadingForm({ ...readingForm, humidity: e.target.value })
                    }
                    placeholder="e.g. 64.0"
                  />
                </label>
                <label className="profile-field profile-field-full">
                  <span>{t('storage.moisture')} (Optional %)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={readingForm.moisture}
                    onChange={(e) =>
                      setReadingForm({ ...readingForm, moisture: e.target.value })
                    }
                    placeholder="e.g. 12.5"
                  />
                </label>
              </div>

              <div className="profile-modal-actions">
                <button
                  type="button"
                  className="btn btn-white"
                  onClick={() => setIngestModalOpen(false)}
                >
                  {t('storage.cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t('storage.ingestSubmit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register New Batch Modal */}
      {newBatchOpen && (
        <div className="profile-modal-overlay" role="presentation" onMouseDown={() => setNewBatchOpen(false)}>
          <div className="profile-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
            <div className="profile-modal-head">
              <h2>{t('storage.newBatch')}</h2>
              <button
                type="button"
                className="profile-modal-close"
                onClick={() => setNewBatchOpen(false)}
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="profile-form">
              <div className="profile-form-grid">
                <label className="profile-field">
                  <span>Select Crop</span>
                  <select
                    value={newBatchForm.cropId}
                    onChange={(e) =>
                      setNewBatchForm({ ...newBatchForm, cropId: e.target.value })
                    }
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="profile-field">
                  <span>{t('storage.batchName')}</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rabi 2026 Lot A"
                    value={newBatchForm.customBatchName}
                    onChange={(e) =>
                      setNewBatchForm({ ...newBatchForm, customBatchName: e.target.value })
                    }
                  />
                </label>

                <label className="profile-field">
                  <span>{t('storage.quantityKg')}</span>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 2000"
                    value={newBatchForm.quantityKg}
                    onChange={(e) =>
                      setNewBatchForm({ ...newBatchForm, quantityKg: e.target.value })
                    }
                  />
                </label>

                <label className="profile-field">
                  <span>{t('storage.structureType')}</span>
                  <select
                    value={newBatchForm.storageStructure}
                    onChange={(e) =>
                      setNewBatchForm({ ...newBatchForm, storageStructure: e.target.value })
                    }
                  >
                    <option value="Warehouse / Hermetic Bag">Warehouse / Hermetic Bag</option>
                    <option value="Pusa Bin (Hermetic)">Pusa Bin (Hermetic Earthen)</option>
                    <option value="Traditional Earthen Kothi">Traditional Earthen Kothi</option>
                    <option value="Ventilated Thatched Chawl">Ventilated Thatched Chawl</option>
                    <option value="Zero Energy Cool Chamber (ZECC)">Zero Energy Cool Chamber (ZECC)</option>
                    <option value="Commercial Cold Storage">Commercial Cold Storage</option>
                  </select>
                </label>

                <label className="profile-field">
                  <span>{t('storage.location')}</span>
                  <input
                    type="text"
                    placeholder="e.g. Village Godown 2"
                    value={newBatchForm.storageLocation}
                    onChange={(e) =>
                      setNewBatchForm({ ...newBatchForm, storageLocation: e.target.value })
                    }
                  />
                </label>

                <label className="profile-field">
                  <span>{t('storage.harvestDate')}</span>
                  <input
                    type="date"
                    value={newBatchForm.harvestDate}
                    onChange={(e) =>
                      setNewBatchForm({ ...newBatchForm, harvestDate: e.target.value })
                    }
                  />
                </label>

                <label className="profile-field profile-field-full">
                  <span>{t('storage.notes')}</span>
                  <input
                    type="text"
                    placeholder="e.g. Dried under sun for 3 days; layered with neem leaves"
                    value={newBatchForm.notes}
                    onChange={(e) =>
                      setNewBatchForm({ ...newBatchForm, notes: e.target.value })
                    }
                  />
                </label>
              </div>

              <div className="profile-modal-actions">
                <button
                  type="button"
                  className="btn btn-white"
                  onClick={() => setNewBatchOpen(false)}
                >
                  {t('storage.cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t('storage.saveBatch')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
