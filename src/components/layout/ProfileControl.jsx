import { useEffect, useState } from 'react';
import { User, X, ShieldCheck, Camera, LogOut, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import {
  loginUser,
  registerUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  logoutUser,
} from '../../api/services.js';
import { getToken } from '../../api/client.js';

const PROFILE_KEY = 'farmshield.profile.v1';
const PROFILE_PHOTO = '/images/profile/farmer-profile.jpg';
const EMPTY_PROFILE = {
  name: '',
  phone: '',
  state: '',
  district: '',
  idProofType: '',
  email: '',
};

function readProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
    return { ...EMPTY_PROFILE, ...(saved && typeof saved === 'object' ? saved : {}) };
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

export default function ProfileControl() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(readProfile);
  const [draft, setDraft] = useState(profile);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Auth sub-form state
  const [authTab, setAuthTab] = useState('profile'); // 'profile' | 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    async function checkAuth() {
      if (getToken()) {
        try {
          const res = await getCurrentUserProfile();
          if (res?.data) {
            setCurrentUser(res.data);
            setProfile((prev) => ({
              ...prev,
              name: res.data.full_name || prev.name,
              phone: res.data.phone_number || prev.phone,
              email: res.data.email || prev.email,
              district: res.data.village_or_location || prev.district,
            }));
          }
        } catch {
          // Keep local profile
        }
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function openProfile() {
    setDraft({ ...profile });
    setSavedMessage('');
    setAuthError('');
    setOpen(true);
  }

  function updateDraft(event) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    const cleanProfile = {
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      state: draft.state.trim(),
      district: draft.district.trim(),
      idProofType: draft.idProofType,
      email: draft.email ? draft.email.trim() : profile.email,
    };

    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(cleanProfile));
      setProfile(cleanProfile);

      if (currentUser && getToken()) {
        await updateCurrentUserProfile({
          full_name: cleanProfile.name,
          phone_number: cleanProfile.phone,
          village_or_location: cleanProfile.district || cleanProfile.state,
        });
      }

      setSavedMessage(t('profile.saved'));
    } catch {
      setSavedMessage(t('profile.saveError'));
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await loginUser(authEmail, authPassword);
      if (res?.data?.user) {
        setCurrentUser(res.data.user);
        setProfile((prev) => ({
          ...prev,
          name: res.data.user.full_name || prev.name,
          email: res.data.user.email,
          phone: res.data.user.phone_number || prev.phone,
        }));
        setSavedMessage('Signed in successfully.');
        setAuthTab('profile');
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await registerUser({
        email: authEmail,
        password: authPassword,
        full_name: draft.name || 'Farmer',
        phone_number: draft.phone,
        village_or_location: draft.district || draft.state,
        preferred_language: 'en',
      });
      if (res?.data?.user) {
        setCurrentUser(res.data.user);
        setSavedMessage('Account registered and signed in.');
        setAuthTab('profile');
      }
    } catch (err) {
      setAuthError(err.message || 'Registration failed.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await logoutUser();
    setCurrentUser(null);
    setSavedMessage('Signed out.');
  }

  const displayName = currentUser?.full_name || profile.name || t('profile.demoUser');
  const isVerifiedUser = Boolean(currentUser);

  return (
    <>
      <button
        type="button"
        className="profile-btn profile-btn-photo"
        aria-label={t('nav.profile')}
        title={t('nav.profile')}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openProfile}
      >
        {!photoFailed ? (
          <img
            src={PROFILE_PHOTO}
            alt={t('profile.avatarAlt')}
            className="profile-avatar-image"
            onError={() => setPhotoFailed(true)}
          />
        ) : (
          <User size={19} aria-hidden />
        )}
      </button>

      {open && (
        <div
          className="profile-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
          >
            <div className="profile-modal-head">
              <div className="profile-modal-identity">
                <div className="profile-modal-avatar">
                  {!photoFailed ? (
                    <img
                      src={PROFILE_PHOTO}
                      alt={t('profile.avatarAlt')}
                      onError={() => setPhotoFailed(true)}
                    />
                  ) : (
                    <User size={26} aria-hidden />
                  )}
                </div>
                <div>
                  <h2 id="profile-modal-title">{t('profile.title')}</h2>
                  <p className="profile-modal-subtitle">{displayName}</p>
                </div>
              </div>
              <button
                type="button"
                className="profile-modal-close"
                aria-label={t('profile.close')}
                onClick={() => setOpen(false)}
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            {/* Mode Switcher / Auth Tabs */}
            <div className="profile-auth-tabs">
              <button
                type="button"
                className={`auth-tab-btn ${authTab === 'profile' ? 'active' : ''}`}
                onClick={() => setAuthTab('profile')}
              >
                {t('profile.title')}
              </button>
              {!currentUser ? (
                <>
                  <button
                    type="button"
                    className={`auth-tab-btn ${authTab === 'login' ? 'active' : ''}`}
                    onClick={() => {
                      setAuthTab('login');
                      setAuthError('');
                    }}
                  >
                    Backend Login
                  </button>
                  <button
                    type="button"
                    className={`auth-tab-btn ${authTab === 'register' ? 'active' : ''}`}
                    onClick={() => {
                      setAuthTab('register');
                      setAuthError('');
                    }}
                  >
                    Register
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="auth-tab-btn text-danger"
                  onClick={handleLogout}
                >
                  <LogOut size={13} aria-hidden /> Logout
                </button>
              )}
            </div>

            {authTab === 'profile' && (
              <>
                <div className="profile-status-row">
                  <span className={`profile-shield ${isVerifiedUser ? 'shield-verified' : ''}`}>
                    {isVerifiedUser ? (
                      <CheckCircle2 size={18} aria-hidden />
                    ) : (
                      <ShieldCheck size={18} aria-hidden />
                    )}
                  </span>
                  <div>
                    <strong>{t('profile.status')}</strong>
                    {isVerifiedUser ? (
                      <span className="badge badge-live">Verified Backend Farmer</span>
                    ) : (
                      <span className="badge badge-muted">{t('profile.notVerified')}</span>
                    )}
                  </div>
                </div>

                <p className="profile-privacy-note">{t('profile.verifyNote')}</p>

                <form className="profile-form" onSubmit={saveProfile}>
                  <div className="profile-form-grid">
                    <label className="profile-field">
                      <span>{t('profile.name')}</span>
                      <input
                        name="name"
                        autoComplete="name"
                        value={draft.name}
                        onChange={updateDraft}
                        placeholder={t('profile.namePlaceholder')}
                        required
                        maxLength={100}
                      />
                    </label>
                    <label className="profile-field">
                      <span>{t('profile.phone')}</span>
                      <input
                        name="phone"
                        autoComplete="tel-national"
                        inputMode="numeric"
                        value={draft.phone}
                        onChange={updateDraft}
                        placeholder={t('profile.phonePlaceholder')}
                        pattern="[6-9][0-9]{9}"
                        title={t('profile.phonePlaceholder')}
                        required
                        maxLength={10}
                      />
                    </label>
                    <label className="profile-field">
                      <span>{t('profile.state')}</span>
                      <input
                        name="state"
                        autoComplete="address-level1"
                        value={draft.state}
                        onChange={updateDraft}
                        placeholder={t('profile.statePlaceholder')}
                        maxLength={80}
                      />
                    </label>
                    <label className="profile-field">
                      <span>{t('profile.district')}</span>
                      <input
                        name="district"
                        autoComplete="address-level2"
                        value={draft.district}
                        onChange={updateDraft}
                        placeholder={t('profile.districtPlaceholder')}
                        maxLength={80}
                      />
                    </label>
                    <label className="profile-field profile-field-full">
                      <span>{t('profile.idProofType')}</span>
                      <select name="idProofType" value={draft.idProofType} onChange={updateDraft}>
                        <option value="">{t('profile.idProof.none')}</option>
                        <option value="aadhaar">{t('profile.idProof.aadhaar')}</option>
                        <option value="voter">{t('profile.idProof.voter')}</option>
                        <option value="pan">{t('profile.idProof.pan')}</option>
                        <option value="farmer">{t('profile.idProof.farmer')}</option>
                        <option value="kcc">{t('profile.idProof.kcc')}</option>
                        <option value="other">{t('profile.idProof.other')}</option>
                      </select>
                    </label>
                  </div>

                  <div className="profile-photo-hint">
                    <Camera size={15} aria-hidden /> {t('profile.photoHint')}
                  </div>

                  {savedMessage && (
                    <p className="profile-saved-message" role="status">
                      {savedMessage}
                    </p>
                  )}

                  <div className="profile-modal-actions">
                    <button
                      type="button"
                      className="btn btn-white"
                      onClick={() => setOpen(false)}
                    >
                      {t('profile.close')}
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {t('profile.save')}
                    </button>
                  </div>
                  <p className="profile-local-only">{t('profile.localOnly')}</p>
                </form>
              </>
            )}

            {authTab === 'login' && (
              <form className="profile-form auth-form" onSubmit={handleLogin}>
                <p className="profile-privacy-note">
                  Sign in with your registered FarmShield account to sync live storage batches and telemetries.
                </p>

                {authError && <div className="alert-error-msg">{authError}</div>}

                <div className="profile-form-grid">
                  <label className="profile-field profile-field-full">
                    <span>Email Address</span>
                    <input
                      type="email"
                      required
                      placeholder="farmer@example.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                    />
                  </label>
                  <label className="profile-field profile-field-full">
                    <span>Password</span>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                    />
                  </label>
                </div>

                <div className="profile-modal-actions">
                  <button
                    type="button"
                    className="btn btn-white"
                    onClick={() => setAuthTab('profile')}
                  >
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={authLoading}>
                    {authLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </div>
              </form>
            )}

            {authTab === 'register' && (
              <form className="profile-form auth-form" onSubmit={handleRegister}>
                <p className="profile-privacy-note">
                  Register a farmer account to persist storage batches, sensor readings, and alerts to MongoDB.
                </p>

                {authError && <div className="alert-error-msg">{authError}</div>}

                <div className="profile-form-grid">
                  <label className="profile-field profile-field-full">
                    <span>Email Address</span>
                    <input
                      type="email"
                      required
                      placeholder="farmer@example.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                    />
                  </label>
                  <label className="profile-field profile-field-full">
                    <span>Password</span>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                    />
                  </label>
                </div>

                <div className="profile-modal-actions">
                  <button
                    type="button"
                    className="btn btn-white"
                    onClick={() => setAuthTab('profile')}
                  >
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={authLoading}>
                    {authLoading ? 'Registering...' : 'Register Account'}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
