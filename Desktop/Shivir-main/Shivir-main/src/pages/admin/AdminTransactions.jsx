import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTransactionStore } from '../../store/useTransactionStore.js';
import Select from '../../components/common/Select.jsx';
import ActivitySummaryCard from '../../components/common/ActivitySummaryCard.jsx';
import VolunteerSummaryCard from '../../components/common/VolunteerSummaryCard.jsx';

const TYPE_COLORS = {
  Coin: 'bg-yellow-100 text-yellow-700',
  Digital: 'bg-blue-100 text-blue-700',
  Deduction: 'bg-red-100 text-red-700',
  Submission: 'bg-green-100 text-green-700',
};

export default function AdminTransactions() {
  const { t } = useTranslation();
  const { transactions, flagTransaction } = useTransactionStore();

  const [filterType, setFilterType] = useState('All');
  const [filterDay, setFilterDay] = useState('All');
  const [searchQ, setSearchQ] = useState('');
  const [showFlagged, setShowFlagged] = useState(false);

  const filtered = transactions.filter(tx => {
    if (filterType !== 'All' && tx.type !== filterType) return false;
    if (filterDay !== 'All' && tx.day !== parseInt(filterDay)) return false;
    if (showFlagged && !tx.flagged) return false;
    if (searchQ && !tx.student_name?.toLowerCase().includes(searchQ.toLowerCase()) && !tx.volunteer_name?.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-saffron-500 w-48"
          placeholder="Search student or volunteer..."
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
        />
        <Select
          size="sm"
          className="w-36"
          value={filterType}
          onChange={setFilterType}
          options={[
            { value: 'All', label: 'All Types' },
            { value: 'Coin', label: 'Coin' },
            { value: 'Digital', label: 'Digital' },
            { value: 'Deduction', label: 'Deduction' },
            { value: 'Submission', label: 'Submission' },
          ]}
        />
        <Select
          size="sm"
          className="w-32"
          value={filterDay}
          onChange={setFilterDay}
          options={[
            { value: 'All', label: 'All Days' },
            ...([1,2,3,4,5,6].map(d => ({ value: d, label: `Day ${d}` }))),
          ]}
        />
        <button
          onClick={() => setShowFlagged(s => !s)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all
            ${showFlagged ? 'bg-orange-100 border-orange-400 text-orange-700' : 'border-gray-200 text-gray-600'}`}
        >
          🚩 Flagged Only
        </button>
        <span className="self-center text-sm text-gray-500">{filtered.length} records</span>
      </div>

      <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivitySummaryCard transactions={filtered} title="📊 Activity Summary" />
        <VolunteerSummaryCard transactions={filtered} title="👤 Volunteer Breakdown" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-forest-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Volunteer</th>
                <th className="px-4 py-3 text-left">Activity</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-right">Points</th>
                <th className="px-4 py-3 text-center">Day/Slot</th>
                <th className="px-4 py-3 text-center">Flag</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx, i) => (
                <tr key={tx.id} className={`border-b last:border-0 ${tx.flagged ? 'bg-orange-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap font-mono">
                    {new Date(tx.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{tx.student_name}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{tx.volunteer_name}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-[140px] truncate">{tx.activity}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TYPE_COLORS[tx.type] || 'bg-gray-100 text-gray-600'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-bold ${tx.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.points > 0 ? '+' : ''}{tx.points}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500">D{tx.day}/S{tx.slot}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => flagTransaction(tx.id)}
                      className={`text-lg transition-all hover:scale-110 ${tx.flagged ? 'opacity-100' : 'opacity-30 hover:opacity-70'}`}
                      title={tx.flagged ? 'Unflag' : 'Flag as incorrect'}
                    >
                      🚩
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">{t('common.noResults')}</div>
          )}
        </div>
      </div>
    </div>
  );
}
