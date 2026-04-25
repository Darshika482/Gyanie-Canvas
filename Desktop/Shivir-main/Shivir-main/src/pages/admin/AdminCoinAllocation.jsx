import { useTranslation } from 'react-i18next';
import { useCoinStore } from '../../store/useCoinStore.js';

export default function AdminCoinAllocation() {
  const { t } = useTranslation();
  const { coinAllocations, updateAllocation, getAllocationTotal } = useCoinStore();

  const total = getAllocationTotal();
  const MAX = 700;
  const pct = Math.min(100, (total / MAX) * 100);
  const over = total > MAX;

  return (
    <div className="p-6 max-w-2xl">
      {/* Total bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-forest-700">Coin Pool Usage</h3>
          <span className={`font-bold text-lg ${over ? 'text-red-600' : 'text-forest-700'}`}>
            {total} / {MAX}
          </span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {over && (
          <p className="text-red-600 text-sm mt-2 font-semibold">
            ⚠️ {t('admin.totalMustNotExceed')}
          </p>
        )}
        <p className="text-gray-500 text-xs mt-2">ℹ️ {t('admin.recyclingNote')}</p>
      </div>

      {/* Activity allocations */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-forest-700 text-white">
            <tr>
              <th className="px-5 py-3 text-left">Activity</th>
              <th className="px-5 py-3 text-right w-40">Coins Allocated</th>
              <th className="px-5 py-3 text-left w-48">Visual</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(coinAllocations).map(([activity, coins], i) => (
              <tr key={activity} className={`border-b last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-5 py-3 font-medium text-gray-900">{activity}</td>
                <td className="px-5 py-3 text-right">
                  <input
                    type="number"
                    min={0}
                    max={700}
                    className="w-24 border-2 border-gray-200 rounded-lg px-3 py-1.5 text-right text-base font-bold focus:outline-none focus:border-saffron-500"
                    value={coins}
                    onChange={e => updateAllocation(activity, parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="px-5 py-3">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden w-32">
                    <div
                      className="h-full rounded-full bg-saffron-400"
                      style={{ width: `${(coins / MAX) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
            <tr className={`font-bold border-t-2 ${over ? 'bg-red-50 border-red-300' : 'bg-forest-50 border-forest-200'}`}>
              <td className={`px-5 py-3 ${over ? 'text-red-700' : 'text-forest-700'}`}>Total</td>
              <td className={`px-5 py-3 text-right text-lg ${over ? 'text-red-700' : 'text-forest-700'}`}>{total}</td>
              <td className="px-5 py-3 text-xs text-gray-500">Max: {MAX}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
