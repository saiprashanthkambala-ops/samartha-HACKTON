import { useEffect, useState } from 'react';
import {
  Server,
  Users,
  Layers,
  ShieldAlert,
  Activity,
  CheckCircle,
  AlertCircle,
  Radio,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { PageContainer, PageHeading } from '../components/layout/Page.jsx';
import { getAdminDashboard } from '../api/services.js';
import { getToken } from '../api/client.js';

const DEMO_ADMIN_DATA = {
  total_farmers: 24,
  total_crop_profiles: 16,
  total_active_batches: 6,
  total_active_alerts: 1,
  database_connected: false,
  database_name: 'farmshield_db (Fallback Mode)',
  integrations: [
    {
      name: 'MongoDB Database',
      status: 'offline_fallback',
      provider: 'MongoDB Local',
      is_operational: true,
      notes: 'Local in-memory & JSON cache operational',
    },
    {
      name: 'Groq LLM Reasoning',
      status: 'configured',
      provider: 'Groq (llama-3.3-70b-versatile)',
      is_operational: true,
      notes: 'Agricultural reasoning & conversational advisory',
    },
    {
      name: 'Pinecone Vector RAG',
      status: 'configured',
      provider: 'Pinecone (Index: sar)',
      is_operational: true,
      notes: 'ICAR ITK traditional storage preservation repository',
    },
    {
      name: 'Weather Forecast API',
      status: 'configured',
      provider: 'Open-Meteo',
      is_operational: true,
      notes: 'Live meteorological forecast & ambient storage analysis active',
    },
    {
      name: 'Agricultural Market Prices',
      status: 'configured',
      provider: 'AGMARKNET (APMC Mandis)',
      is_operational: true,
      notes: 'Mandi arrival & modal price tracking active',
    },
    {
      name: 'WhatsApp Notifications',
      status: 'configured',
      provider: 'Twilio WhatsApp',
      is_operational: true,
      notes: 'Twilio WhatsApp sender integration configured',
    },
    {
      name: 'Media & Image Storage',
      status: 'configured',
      provider: 'Cloudinary / Local Fallback',
      is_operational: true,
      notes: 'Storage for crop and diary photographs',
    },
  ],
  recent_notification_logs: [
    {
      created_at: '2026-10-11T02:16:00Z',
      recipient: '+9198******10',
      crop_name: 'Onion',
      condition_type: 'high_humidity',
      status: 'dispatched',
    },
  ],
  system_time: new Date().toISOString(),
};

export default function AdminPortalPage() {
  const { t } = useLanguage();
  const [data, setData] = useState(DEMO_ADMIN_DATA);
  const [_loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        if (getToken()) {
          const res = await getAdminDashboard();
          if (res?.data) {
            setData(res.data);
            setIsDemo(res.source === 'demo');
          }
        }
      } catch {
        setData(DEMO_ADMIN_DATA);
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    }
    fetchAdmin();
  }, []);

  return (
    <PageContainer>
      <PageHeading
        title={t('admin.title')}
        subtitle="Full-stack system diagnostics, database health, and external integration monitor."
      />
      <div className="storage-header-actions">
        <div className="storage-status-pill">
          {isDemo ? (
            <span className="badge badge-demo">Diagnostic Demo View</span>
          ) : (
            <span className="badge badge-live">Live Admin Data</span>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon icon-farmers">
            <Users size={22} aria-hidden />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">{t('admin.farmers')}</span>
            <strong className="admin-stat-number">{data.total_farmers}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon icon-crops">
            <Layers size={22} aria-hidden />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">{t('admin.cropProfiles')}</span>
            <strong className="admin-stat-number">{data.total_crop_profiles}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon icon-batches">
            <Activity size={22} aria-hidden />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">{t('admin.batches')}</span>
            <strong className="admin-stat-number">{data.total_active_batches}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon icon-alerts">
            <ShieldAlert size={22} aria-hidden />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">{t('admin.alerts')}</span>
            <strong className="admin-stat-number">{data.total_active_alerts}</strong>
          </div>
        </div>
      </div>

      {/* External Service Integrations */}
      <section className="admin-section" aria-labelledby="integrations-title">
        <div className="storage-section-title">
          <Server size={22} aria-hidden />
          <h2 id="integrations-title">{t('admin.integrations')}</h2>
        </div>

        <div className="admin-integrations-grid">
          {data.integrations?.map((intg) => (
            <div key={intg.name} className="admin-integration-card">
              <div className="integration-card-head">
                <div>
                  <h3>{intg.name}</h3>
                  <span className="integration-provider">{intg.provider}</span>
                </div>
                {intg.is_operational ? (
                  <span className="badge badge-live">
                    <CheckCircle size={12} aria-hidden /> Operational
                  </span>
                ) : (
                  <span className="badge badge-warning">
                    <AlertCircle size={12} aria-hidden /> Pending
                  </span>
                )}
              </div>
              <p className="integration-notes">{intg.notes}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Notification Logs */}
      {data.recent_notification_logs?.length > 0 && (
        <section className="admin-section" aria-labelledby="logs-title">
          <div className="storage-section-title">
            <Radio size={22} aria-hidden />
            <h2 id="logs-title">Recent Notification Logs</h2>
          </div>

          <div className="admin-logs-table-wrapper">
            <table className="admin-logs-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Recipient</th>
                  <th>Crop</th>
                  <th>Condition</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_notification_logs.map((log, idx) => (
                  <tr key={idx}>
                    <td>{new Date(log.created_at).toLocaleString()}</td>
                    <td>{log.recipient}</td>
                    <td>{log.crop_name}</td>
                    <td>{log.condition_type}</td>
                    <td>
                      <span className="badge badge-live">{log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </PageContainer>
  );
}
