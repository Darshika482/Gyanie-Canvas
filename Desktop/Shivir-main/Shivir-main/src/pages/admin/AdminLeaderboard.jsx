import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudentStore } from '../../store/useStudentStore.js';
import Select from '../../components/common/Select.jsx';

const CATEGORY_COLORS = {
  High: 'bg-green-100 text-green-700 border-green-300',
  'Mid-High': 'bg-blue-100 text-blue-700 border-blue-300',
  Mid: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  Low: 'bg-gray-100 text-gray-600 border-gray-300',
};

const RANK_MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function AdminLeaderboard() {
  const { t } = useTranslation();
  const { getLeaderboard } = useStudentStore();

  const [filterBatch, setFilterBatch] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');

  const leaderboard = getLeaderboard();

  const batches = ['All', ...new Set(leaderboard.map(s => s.batch))];
  const groups = ['All', ...new Set(leaderboard.map(s => s.group))];

  const filtered = leaderboard.filter(s =>
    (filterBatch === 'All' || s.batch === filterBatch) &&
    (filterGroup === 'All' || s.group === filterGroup)
  );

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="w-40">
          <label className="text-xs font-semibold text-gray-600 block mb-1">Batch</label>
          <Select size="sm" value={filterBatch} onChange={setFilterBatch} options={batches} />
        </div>
        <div className="w-40">
          <label className="text-xs font-semibold text-gray-600 block mb-1">Group</label>
          <Select size="sm" value={filterGroup} onChange={setFilterGroup} options={groups} />
        </div>
        <div className="self-end text-sm text-gray-500 pb-2">{filtered.length} students</div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-forest-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left w-16">{t('admin.rank')}</th>
                <th className="px-4 py-3 text-left">{t('common.name')}</th>
                <th className="px-4 py-3 text-left">{t('common.class')}</th>
                <th className="px-4 py-3 text-left">{t('common.batch')}</th>
                <th className="px-4 py-3 text-left">{t('common.group')}</th>
                <th className="px-4 py-3 text-right">Total Points</th>
                <th className="px-4 py-3 text-center">Category</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className={`border-b last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${s.rank <= 3 ? 'font-semibold' : ''}`}>
                  <td className="px-4 py-3 text-center">
                    {RANK_MEDALS[s.rank] || <span className="text-gray-500 font-mono">#{s.rank}</span>}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-gray-700">{s.class}</td>
                  <td className="px-4 py-3">
                    <span className="bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full text-xs font-semibold">{s.batch}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{s.group}</td>
                  <td className="px-4 py-3 text-right font-bold text-saffron-600 text-base">{s.total_points}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${CATEGORY_COLORS[s.category]}`}>
                      {t(`admin.category.${s.category.toLowerCase().replace('-', '')}`) || s.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
