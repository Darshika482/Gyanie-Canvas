import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useStudentStore } from '../../store/useStudentStore.js';
import { useTransactionStore } from '../../store/useTransactionStore.js';
import LanguageToggle from '../../components/common/LanguageToggle.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import OfflineBanner from '../../components/common/OfflineBanner.jsx';
import QrScanner from '../../components/common/QrScanner.jsx';

const AWARD_REASONS = [
  { key: 'early_riser', emoji: '🌅', pts: 5, type: 'Coin', hi: 'सुबह 5 बजे' },
  { key: 'early_arrival', emoji: '⏰', pts: 5, type: 'Coin', hi: 'जल्दी पहुंचना' },
  { key: 'morning_puja', emoji: '🙏', pts: 5, type: 'Coin', hi: 'सुबह पूजा' },
  { key: 'class_answer', emoji: '✋', pts: 5, type: 'Coin', hi: 'कक्षा में उत्तर' },
  { key: 'afternoon_bhakti', emoji: '🎵', pts: 5, type: 'Coin', hi: 'दोपहर भक्ति' },
  { key: 'evening_program', emoji: '🎤', pts: 5, type: 'Coin', hi: 'शाम कार्यक्रम' },
  { key: 'yoga', emoji: '🧘', pts: 5, type: 'Digital', hi: 'योग भागीदारी' },
  { key: 'bhojan_discipline', emoji: '🍽', pts: 5, type: 'Digital', hi: 'भोजन अनुशासन' },
  { key: 'helping_others', emoji: '🤝', pts: 5, type: 'Digital', hi: 'दूसरों की मदद' },
  { key: 'special_admin', emoji: '⭐', pts: 10, type: 'Coin', hi: 'विशेष गतिविधि' },
  { key: 'other', emoji: '➕', pts: 5, type: 'Digital', hi: 'अन्य कारण', needsText: true },
];

const DEDUCT_REASONS = [
  { key: 'misbehaviour', emoji: '😤', pts: 5, hi: 'दुर्व्यवहार' },
  { key: 'late_to_activity', emoji: '⏳', pts: 5, hi: 'देर से आना' },
  { key: 'disrespect', emoji: '🚫', pts: 5, hi: 'अपमान' },
  { key: 'entry_mistake', emoji: '↩️', pts: 5, hi: 'गलत अंक सुधार', needsText: true },
  { key: 'other', emoji: '➖', pts: 5, hi: 'अन्य कारण', needsText: true },
];

const TABS = ['award', 'duties', 'log'];

export default function VolunteerApp() {
  const { t, i18n } = useTranslation();
  const { currentUser, logout } = useAuthStore();
  const { search, searchResults } = useStudentStore();
  const { addTransaction, currentDay, currentSlot, transactions } = useTransactionStore();
  const { addPoints } = useStudentStore();

  const [activeTab, setActiveTab] = useState('award');
  const [query, setQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [action, setAction] = useState(null); // 'give' | 'take'
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherText, setOtherText] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [step, setStep] = useState(1); // 1=search, 2=action, 3=reason
  const [showQr, setShowQr] = useState(false);

  const isHindi = i18n.language === 'hi';

  const handleSearch = (val) => {
    setQuery(val);
    search(val);
  };

  const handleQrScan = (text) => {
    setShowQr(false);
    // Try to match by roll_no or id
    const { students } = useStudentStore.getState();
    const found = students.find(
      s => s.roll_no === text || s.id === text || s.name.toLowerCase() === text.toLowerCase()
    );
    if (found) {
      selectStudent(found);
    } else {
      // Fall back to text search so volunteer can see partial results
      setQuery(text);
      search(text);
    }
  };

  const selectStudent = (s) => {
    setSelectedStudent(s);
    setQuery('');
    search('');
    setStep(2);
    setAction(null);
    setSelectedReason(null);
    setOtherText('');
    setSuccessData(null);
  };

  const handleActionSelect = (a) => {
    setAction(a);
    setStep(3);
    setSelectedReason(null);
    setOtherText('');
  };

  const handleReasonSelect = (r) => {
    setSelectedReason(r);
    if (!r.needsText) setOtherText('');
  };

  const canSubmit = () => {
    if (!selectedReason) return false;
    if (selectedReason.needsText && !otherText.trim()) return false;
    if (action === 'take' && !otherText.trim()) return false;
    return true;
  };

  const handleConfirm = () => {
    const points = action === 'take' ? -selectedReason.pts : selectedReason.pts;
    const tx = {
      student_id: selectedStudent.id,
      student_name: selectedStudent.name,
      volunteer_id: currentUser?.id,
      volunteer_name: currentUser?.name,
      activity: selectedReason.needsText
        ? otherText
        : action === 'take' && otherText.trim()
          ? `${t(`reasons.${selectedReason.key}`)}: ${otherText.trim()}`
          : t(`reasons.${selectedReason.key}`),
      type: action === 'take' ? 'Deduction' : selectedReason.type,
      points,
      coin_count: selectedReason.type === 'Coin' && action === 'give' ? 1 : 0,
      day: currentDay,
      slot: currentSlot,
      notes: otherText,
    };
    addTransaction(tx);
    addPoints(selectedStudent.id, points, currentDay);
    setSuccessData({ student: selectedStudent, points, reason: tx.activity, action });
    setConfirmOpen(false);
    setStep(1);
    setSelectedStudent(null);
    setAction(null);
    setSelectedReason(null);
    setOtherText('');
    setTimeout(() => setSuccessData(null), 3000);
  };

  const reasons = action === 'take' ? DEDUCT_REASONS : AWARD_REASONS;
  const myLog = transactions.filter(t => t.volunteer_id === currentUser?.id).slice(0, 20);

  return (
    <div className="mobile-container flex flex-col">
      <OfflineBanner />

      {/* Header */}
      <div className="bg-forest-700 text-white px-4 py-3">
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <div className="font-bold text-lg leading-tight">{currentUser?.name}</div>
            {currentUser?.assigned_activity && (
              <div className="text-xs text-forest-300 mt-0.5">📌 {currentUser.assigned_activity}</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle compact />
            <button onClick={logout} className="text-forest-300 text-sm px-2 py-1 rounded-lg border border-forest-500">
              {t('auth.logout')}
            </button>
          </div>
        </div>
        {currentUser?.roles?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {currentUser.roles.map(r => (
              <span key={r} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">{r}</span>
            ))}
            {currentUser.has_deduction_rights && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-400/80 text-white">⚡ Can Deduct</span>
            )}
          </div>
        )}
      </div>

      {/* Success Banner */}
      {successData && (
        <div className="bg-green-500 text-white px-4 py-3 flex items-center gap-3 fade-in">
          <span className="text-2xl">{successData.action === 'give' ? '✅' : '⚠️'}</span>
          <div>
            <div className="font-bold">
              {successData.action === 'give' ? t('volunteer.pointsAwarded') : t('volunteer.pointsDeducted')}
            </div>
            <div className="text-sm opacity-90">
              {Math.abs(successData.points)} {t('common.points')} — {successData.student.name}
            </div>
          </div>
        </div>
      )}

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'award' && (
          <div className="p-4 max-w-3xl mx-auto">
            {/* Step 1: Search */}
            {step === 1 && (
              <>
                <h2 className="section-header">{t('volunteer.searchStudent')}</h2>

                {/* QR Scan button */}
                <button
                  onClick={() => setShowQr(true)}
                  className="w-full mb-3 flex items-center justify-center gap-3 bg-forest-700 text-white rounded-2xl py-4 font-bold text-base active:scale-95 transition-all shadow-md"
                >
                  <span className="text-2xl">📷</span>
                  <span>{t('volunteer.scanQr')}</span>
                  <span className="text-forest-300 text-sm font-normal">QR स्कैन करें</span>
                </button>

                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">OR / या</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="relative mb-2">
                  <input
                    className="input-field pr-10"
                    placeholder={t('volunteer.searchPlaceholder')}
                    value={query}
                    onChange={e => handleSearch(e.target.value)}
                    autoComplete="off"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                </div>
                {searchResults.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                    {searchResults.map(s => (
                      <button
                        key={s.id}
                        onClick={() => selectStudent(s)}
                        className="w-full text-left px-4 py-3 border-b last:border-0 border-gray-100 hover:bg-forest-50 active:bg-forest-100 transition-colors"
                      >
                        <div className="font-semibold text-gray-900">{s.name}</div>
                        <div className="text-sm text-gray-500">{s.roll_no} • {isHindi ? 'कक्षा' : 'Class'} {s.class} • {s.batch}</div>
                      </button>
                    ))}
                  </div>
                )}
                {query.length >= 2 && searchResults.length === 0 && (
                  <div className="text-center py-8 text-gray-400">{t('common.noResults')}</div>
                )}
              </>
            )}

            {/* Step 2: Student Selected → Choose Action */}
            {step >= 2 && selectedStudent && (
              <>
                <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-4 mb-4 fade-in">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-green-600 font-semibold mb-1">✅ {t('volunteer.studentFound')}</div>
                      <div className="text-xl font-bold text-gray-900">{selectedStudent.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {selectedStudent.roll_no} • {isHindi ? 'कक्षा' : 'Class'} {selectedStudent.class} • {t('common.batch')} {selectedStudent.batch}
                      </div>
                      <div className="mt-2 text-sm text-gray-500 font-medium">{t('common.scoreHidden')}</div>
                    </div>
                    <button
                      onClick={() => { setStep(1); setSelectedStudent(null); setAction(null); setSelectedReason(null); }}
                      className="text-gray-400 text-lg p-1"
                    >✕</button>
                  </div>
                </div>

                {step === 2 && (
                  <>
                    <h2 className="section-header">{t('volunteer.selectAction')}</h2>
                    <div className="grid grid-cols-2 gap-3 sm:max-w-lg">
                      <button
                        onClick={() => handleActionSelect('give')}
                        className="bg-green-500 text-white rounded-2xl p-6 text-center active:scale-95 transition-all shadow-md"
                      >
                        <div className="text-3xl mb-2">🏆</div>
                        <div className="font-bold text-lg">{t('volunteer.givePoints')}</div>
                        <div className="text-sm opacity-80">पुरस्कार</div>
                      </button>
                      <button
                        onClick={() => handleActionSelect('take')}
                        className="bg-red-500 text-white rounded-2xl p-6 text-center active:scale-95 transition-all shadow-md"
                      >
                        <div className="text-3xl mb-2">⬇️</div>
                        <div className="font-bold text-lg">{t('volunteer.takeAway')}</div>
                        <div className="text-sm opacity-80">कटौती</div>
                      </button>
                    </div>
                  </>
                )}

                {/* Step 3: Reason Grid */}
                {step === 3 && action && (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <button onClick={() => { setStep(2); setAction(null); setSelectedReason(null); }} className="text-forest-600 font-medium text-sm">← {t('common.back')}</button>
                      <h2 className="section-header mb-0">
                        {action === 'give' ? t('volunteer.givePoints') : t('volunteer.takeAway')} — {t('volunteer.selectReason')}
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                      {reasons.map(r => (
                        <button
                          key={r.key}
                          onClick={() => handleReasonSelect(r)}
                          className={`rounded-2xl p-3 text-center border-2 transition-all active:scale-95
                            ${selectedReason?.key === r.key
                              ? 'border-saffron-500 bg-saffron-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        >
                          <div className="text-2xl mb-1">{r.emoji}</div>
                          <div className="font-semibold text-sm text-gray-900 leading-tight">{t(`reasons.${r.key}`)}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{r.hi}</div>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <span className={`text-xs font-bold ${action === 'give' ? 'text-green-600' : 'text-red-600'}`}>
                              {action === 'give' ? '+' : '−'}{r.pts} {t('common.points')}
                            </span>
                            {r.type && action === 'give' && (
                              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium
                                ${r.type === 'Coin' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                {r.type === 'Coin' ? '🪙' : '💻'}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {(selectedReason?.needsText || action === 'take') && selectedReason && (
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {action === 'take'
                            ? <>{t('volunteer.reason')} <span className="text-red-500">*</span></>
                            : <>{t('volunteer.otherReason')} <span className="text-red-500">*</span></>
                          }
                        </label>
                        <textarea
                          className={`input-field resize-none ${action === 'take' && !otherText.trim() ? 'border-red-300' : ''}`}
                          rows={3}
                          placeholder={t('volunteer.otherReasonPlaceholder')}
                          value={otherText}
                          onChange={e => setOtherText(e.target.value)}
                        />
                        {action === 'take' && !otherText.trim() && (
                          <p className="text-red-500 text-xs mt-1">{t('volunteer.reasonRequired')}</p>
                        )}
                      </div>
                    )}

                    <button
                      disabled={!canSubmit()}
                      onClick={() => setConfirmOpen(true)}
                      className={`w-full py-4 rounded-2xl font-bold text-xl text-white transition-all
                        ${canSubmit()
                          ? 'bg-saffron-500 active:scale-95 shadow-lg'
                          : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                      {t('volunteer.confirmAction')} →
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'duties' && (
          <div className="p-4 max-w-3xl mx-auto space-y-4">

            {/* Identity card */}
            <div className="bg-forest-700 text-white rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {currentUser?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xl leading-tight">{currentUser?.name}</div>
                  {currentUser?.mobile && (
                    <div className="text-forest-300 text-sm mt-0.5">📱 {currentUser.mobile}</div>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(currentUser?.roles || []).map(r => (
                      <span key={r} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned activity */}
            {currentUser?.assigned_activity && (
              <div className="card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-saffron-100 flex items-center justify-center text-xl flex-shrink-0">📌</div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Assigned Activity</div>
                  <div className="font-bold text-gray-900">{currentUser.assigned_activity}</div>
                </div>
              </div>
            )}

            {/* Permissions */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`rounded-2xl p-4 border-2 text-center ${currentUser?.has_deduction_rights ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-2xl mb-1">{currentUser?.has_deduction_rights ? '✅' : '🚫'}</div>
                <div className="text-xs font-semibold text-gray-600">Deduction Rights</div>
                <div className={`text-sm font-bold mt-0.5 ${currentUser?.has_deduction_rights ? 'text-green-700' : 'text-gray-400'}`}>
                  {currentUser?.has_deduction_rights ? 'Allowed' : 'Not allowed'}
                </div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-xs font-semibold text-gray-600">Give Points</div>
                <div className="text-sm font-bold mt-0.5 text-blue-700">Always allowed</div>
              </div>
            </div>

            {/* Responsibilities list */}
            <div>
              <h3 className="section-header">My Responsibilities</h3>
              {currentUser?.responsibilities?.length > 0 ? (
                <div className="space-y-2">
                  {currentUser.responsibilities.map((r, i) => (
                    <div key={i} className="card p-4 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-saffron-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="text-sm text-gray-800 font-medium leading-snug">{r}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-sm">No responsibilities assigned yet.</p>
                  <p className="text-xs mt-1">Contact admin to update your duties.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'log' && (
          <div className="p-4 max-w-3xl mx-auto">
            <h2 className="section-header">{t('nav.log')}</h2>
            {myLog.length === 0 ? (
              <div className="card text-center py-8 text-gray-400">{t('common.noResults')}</div>
            ) : (
              <div className="space-y-2">
                {myLog.map(tx => (
                  <div key={tx.id} className="card p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{tx.student_name}</div>
                        <div className="text-sm text-gray-500">{tx.activity}</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(tx.timestamp).toLocaleTimeString()}</div>
                      </div>
                      <span className={`font-bold text-lg ${tx.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.points > 0 ? '+' : ''}{tx.points}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t border-gray-200 flex">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors
              ${activeTab === tab ? 'text-saffron-500' : 'text-gray-400'}`}
          >
            <span className="text-xl">{tab === 'award' ? '🏆' : tab === 'duties' ? '📌' : '📋'}</span>
            <span className="text-xs font-medium capitalize">{tab === 'duties' ? 'Duties' : t(`nav.${tab}`)}</span>
          </button>
        ))}
      </div>

      {/* QR Scanner Overlay */}
      {showQr && (
        <QrScanner
          onScan={handleQrScan}
          onClose={() => setShowQr(false)}
        />
      )}

      {/* Confirmation Bottom Sheet */}
      <ConfirmDialog
        open={confirmOpen}
        title={t('volunteer.confirmAction')}
        message={`${action === 'give' ? t('volunteer.givingPoints') : t('volunteer.takingPoints')} ${selectedReason?.pts} ${t('common.points')} ${t('volunteer.from')} ${selectedStudent?.name} — ${selectedReason ? t(`reasons.${selectedReason.key}`) : ''}${otherText ? ': ' + otherText : ''}`}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        confirmLabel={t('common.confirm')}
        cancelLabel={t('common.cancel')}
      />
    </div>
  );
}
