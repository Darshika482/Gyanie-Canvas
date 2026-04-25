import { useTranslation } from 'react-i18next';
import { useStudentStore } from '../../store/useStudentStore.js';
import { useTransactionStore } from '../../store/useTransactionStore.js';
import { useCoinStore } from '../../store/useCoinStore.js';
import { useScheduleStore } from '../../store/useScheduleStore.js';
import ActivitySummaryCard from '../../components/common/ActivitySummaryCard.jsx';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { students } = useStudentStore();
  const { transactions, currentDay } = useTransactionStore();
  const { getStats } = useCoinStore();
  const { getActivitiesForDay } = useScheduleStore();

  const stats = getStats();
  const todayTx = transactions.filter(tx => tx.day === currentDay);
  const pointsToday = todayTx.filter(tx => tx.points > 0).reduce((s, tx) => s + tx.points, 0);
  const specialToday = getActivitiesForDay(currentDay).filter(a => a.type === 'special').length;

  const poolPct = Math.min(100, (stats.availableNow / stats.totalPool) * 100);
  const recentTx = transactions.slice(0, 8);

  const statCards = [
    { label: t('admin.totalStudents'), val: students.length, icon: '👥', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
    { label: t('admin.pointsToday'), val: pointsToday, icon: '⭐', color: 'bg-yellow-50 border-yellow-200', textColor: 'text-yellow-700' },
    { label: t('admin.coinsCirculating'), val: stats.inCirculation, icon: '🪙', color: 'bg-orange-50 border-orange-200', textColor: 'text-orange-700' },
    { label: t('admin.specialActivitiesToday'), val: specialToday, icon: '🎯', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' },
  ];

  return (
    <div className="p-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(s => (
          <div key={s.label} className={`rounded-2xl border-2 p-4 ${s.color}`}>
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className={`text-3xl font-bold ${s.textColor}`}>{s.val}</div>
            <div className="text-sm text-gray-600 mt-1 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coin Pool Health */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-bold text-forest-700 mb-4">🪙 {t('admin.coinPoolHealth')}</h3>
          <div className="space-y-3">
            {[
              { label: 'Total Pool', val: stats.totalPool, color: '#1a3d2b' },
              { label: 'Distributed', val: stats.distributed, color: '#E8660A' },
              { label: 'Returned', val: stats.returned, color: '#22c55e' },
              { label: 'In Circulation', val: stats.inCirculation, color: '#f59e0b' },
              { label: 'Available Now', val: stats.availableNow, color: '#3b82f6' },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-gray-700">{s.label}</span>
                  <span style={{ color: s.color }} className="font-bold">{s.val}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(s.val / stats.totalPool) * 100}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
            ℹ️ {t('admin.recyclingNote')}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-bold text-forest-700 mb-4">📋 {t('admin.recentTransactions')}</h3>
          {recentTx.length === 0 ? (
            <p className="text-gray-400 text-center py-8">{t('common.noResults')}</p>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-72">
              {recentTx.map(tx => (
                <div key={tx.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className={`text-xl ${tx.points >= 0 ? '✅' : '⚠️'}`}>
                    {tx.type === 'Submission' ? '📦' : tx.points >= 0 ? '✅' : '⚠️'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate">{tx.student_name}</div>
                    <div className="text-xs text-gray-500 truncate">{tx.activity} • {tx.volunteer_name}</div>
                  </div>
                  <div className={`font-bold text-sm flex-shrink-0 ${tx.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.points > 0 ? '+' : ''}{tx.points}
                    {tx.flagged && <span className="ml-1 text-orange-500">🚩</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity Summary — today's transactions grouped by activity */}
      <div className="mt-6">
        <ActivitySummaryCard
          transactions={todayTx}
          title={`📊 Activity Summary — Day ${currentDay}`}
        />
      </div>

      {/* Activity Allocation Snapshot */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-bold text-forest-700 mb-4">📊 Today's Activity Snapshot — Day {currentDay}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {getActivitiesForDay(currentDay).filter(a => a.coins > 0).map(a => (
            <div key={a.id} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="font-semibold text-sm text-gray-900 truncate">{a.name}</div>
              <div className="text-xs text-gray-500">{a.start_time} • {a.venue}</div>
              <div className="mt-1 text-saffron-600 font-bold">🪙 {a.coins}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
