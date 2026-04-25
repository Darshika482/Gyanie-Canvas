import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore.js';
import LanguageToggle from '../../components/common/LanguageToggle.jsx';

const ROLES = [
  { key: 'volunteer', icon: '🙋', routeAfter: '/volunteer', pinLogin: true },
  { key: 'coordinator', icon: '🎯', routeAfter: '/coordinator', pinLogin: true },
  { key: 'coinkeeper', icon: '🪙', routeAfter: '/coinkeeper', pinLogin: true, keeperPin: true },
  { key: 'collection', icon: '📦', routeAfter: '/collection', pinLogin: true },
  { key: 'checkin', icon: '✅', routeAfter: '/checkin', directAccess: true, pinLogin: false },
  { key: 'admin', icon: '🔐', routeAfter: '/admin', pinLogin: false },
];

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loginVolunteer, loginAdmin, loginCoinkeeper } = useAuthStore();

  const [selectedRole, setSelectedRole] = useState(null);
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRoleSelect = (role) => {
    if (role.directAccess) {
      navigate(role.routeAfter);
      return;
    }
    setSelectedRole(role);
    setPin('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!selectedRole) return;
    try {
      let result;
      if (selectedRole.key === 'admin') {
        result = loginAdmin(password);
      } else if (selectedRole.key === 'coinkeeper') {
        result = loginCoinkeeper(pin);
      } else {
        result = await loginVolunteer(pin);
      }
      if (result.success) {
        navigate(selectedRole.routeAfter);
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="mobile-container bg-forest-700 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-8 pb-6 max-w-2xl mx-auto w-full">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('app.title')}</h1>
          <p className="text-forest-200 text-sm mt-1">{t('app.subtitle')}</p>
        </div>
        <LanguageToggle />
      </div>

      {/* Lotus decoration */}
      <div className="text-center text-6xl mb-4">🪷</div>

      <div className="flex-1 bg-gray-50 rounded-t-3xl pt-6 pb-8">
        <div className="max-w-2xl mx-auto px-6">
        {!selectedRole ? (
          <>
            <h2 className="text-xl font-bold text-forest-700 mb-4 text-center">{t('auth.selectRole')}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {ROLES.map(role => (
                <button
                  key={role.key}
                  onClick={() => handleRoleSelect(role)}
                  className="card flex items-center gap-4 p-4 active:scale-95 transition-all text-left"
                >
                  <span className="text-3xl">{role.icon}</span>
                  <div>
                    <div className="font-semibold text-lg text-forest-700">{t(`auth.roles.${role.key}`)}</div>
                  </div>
                  <span className="ml-auto text-saffron-500 text-xl">›</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedRole(null)}
              className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-700 mb-6 font-semibold"
            >
              ← {t('common.back')}
            </button>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">{selectedRole.icon}</div>
              <h2 className="text-xl font-bold text-forest-700">{t(`auth.roles.${selectedRole.key}`)}</h2>
            </div>

            {selectedRole.pinLogin ? (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-2">{t('auth.enterPin')}</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  className="input-field text-center text-2xl tracking-widest"
                  placeholder="••••"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                {/* PIN hint for demo */}
                <p className="text-xs text-gray-400 mt-2 text-center">
                  {selectedRole.key === 'coinkeeper' ? 'Demo PIN: 0000' : 'Demo PINs: 1234, 2222, 3333...'}
                </p>
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-2">{t('auth.adminPassword')}</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                <p className="text-xs text-gray-400 mt-2 text-center">Demo password: shivir2024</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            <button onClick={handleSubmit} className="btn-primary w-full">
              {t('auth.login')}
            </button>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
