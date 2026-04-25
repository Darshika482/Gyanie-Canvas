import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVolunteerStore } from '../../store/useVolunteerStore.js';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

const ROLES = ['Activity Coordinator', 'Zone Volunteer', 'Class Teacher', 'Collection Volunteer', 'Admin'];
const EMPTY_VOL = { name: '', pin: '', roles: ['Zone Volunteer'], assigned_activity: '', has_deduction_rights: false, responsibilities: [] };

export default function AdminVolunteers() {
  const { t } = useTranslation();
  const { volunteers, addVolunteer, updateVolunteer, deleteVolunteer } = useVolunteerStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_VOL);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.pin.trim() || form.pin.length < 4) e.pin = 'PIN must be at least 4 digits';
    if (!form.roles || form.roles.length === 0) e.roles = 'At least one role is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingId) {
      updateVolunteer(editingId, form);
    } else {
      addVolunteer(form);
    }
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_VOL);
    setErrors({});
  };

  const handleEdit = (v) => {
    setEditingId(v.id);
    const roles = v.roles || (v.role ? [v.role] : ['Zone Volunteer']);
    setForm({ name: v.name, pin: v.pin, roles, assigned_activity: v.assigned_activity || '', has_deduction_rights: !!v.has_deduction_rights, responsibilities: v.responsibilities || [] });
    setShowForm(true);
    setErrors({});
  };

  const ROLE_COLORS = {
    'Activity Coordinator': 'bg-purple-100 text-purple-700',
    'Zone Volunteer': 'bg-blue-100 text-blue-700',
    'Class Teacher': 'bg-green-100 text-green-700',
    'Collection Volunteer': 'bg-orange-100 text-orange-700',
    'Admin': 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-6">
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_VOL); setErrors({}); }}
          className="btn-secondary text-base px-4 py-2"
        >
          + {t('admin.addVolunteer')}
        </button>
        <span className="self-center text-sm text-gray-500">{volunteers.length} volunteers</span>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setEditingId(null); setErrors({}); } }}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl fade-in">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
              <h3 className="font-bold text-forest-700 text-lg">{editingId ? t('admin.editVolunteer') : t('admin.addVolunteer')}</h3>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setErrors({}); }}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
              >✕</button>
            </div>
            <div className="px-6 py-4 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Name *</label>
                <input className={`input-field ${errors.name ? 'border-red-400' : ''}`} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">PIN * (4 digits)</label>
                <input type="text" inputMode="numeric" maxLength={6} className={`input-field ${errors.pin ? 'border-red-400' : ''}`} value={form.pin} onChange={e => setForm(p => ({ ...p, pin: e.target.value }))} />
                {errors.pin && <p className="text-red-500 text-xs mt-1">{errors.pin}</p>}
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-600 block mb-1">Roles (select one or more)</label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map(r => (
                    <label key={r} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-saffron-500"
                        checked={form.roles?.includes(r) || false}
                        onChange={e => {
                          const prev = form.roles || [];
                          const next = e.target.checked ? [...prev, r] : prev.filter(x => x !== r);
                          setForm(p => ({ ...p, roles: next }));
                        }}
                      />
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[r] || 'bg-gray-100 text-gray-600'}`}>{r}</span>
                    </label>
                  ))}
                </div>
                {errors.roles && <p className="text-red-500 text-xs mt-1">{errors.roles}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Assigned Activity</label>
                <input className="input-field" placeholder="e.g. Zone A, Coin Collection" value={form.assigned_activity} onChange={e => setForm(p => ({ ...p, assigned_activity: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Responsibilities <span className="font-normal text-gray-400">(one per line)</span>
                </label>
                <textarea
                  className="input-field resize-none text-sm"
                  rows={4}
                  placeholder={"e.g.\nSlot 1 coin collection (12:30 PM)\nZone A student supervision\nDaily attendance tracking"}
                  value={(form.responsibilities || []).join('\n')}
                  onChange={e => setForm(p => ({
                    ...p,
                    responsibilities: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                  }))}
                />
                <p className="text-xs text-gray-400 mt-1">These will appear on the volunteer's "My Duties" tab after login.</p>
              </div>
              <div className="col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="deduction"
                  className="w-5 h-5 accent-saffron-500"
                  checked={form.has_deduction_rights}
                  onChange={e => setForm(p => ({ ...p, has_deduction_rights: e.target.checked }))}
                />
                <label htmlFor="deduction" className="font-semibold text-gray-700 cursor-pointer">
                  {t('admin.deductionRights')} (can subtract points from students)
                </label>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-5">
              <button onClick={handleSave} className="btn-primary text-base px-6 py-2">{t('common.save')}</button>
              <button onClick={() => { setShowForm(false); setEditingId(null); setErrors({}); }} className="btn-outline text-base px-6 py-2">{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-forest-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">PIN</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Assigned Activity</th>
                <th className="px-4 py-3 text-center">Can Deduct</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v, i) => (
                <tr key={v.id} className={`border-b last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 font-semibold text-gray-900">{v.name}</td>
                  <td className="px-4 py-3 font-mono text-gray-600">{v.pin}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(v.roles || (v.role ? [v.role] : [])).map(r => (
                        <span key={r} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[r] || 'bg-gray-100 text-gray-600'}`}>
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{v.assigned_activity}</td>
                  <td className="px-4 py-3 text-center">{v.has_deduction_rights ? '✅' : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(v)} className="text-blue-600 hover:underline text-xs font-semibold">{t('common.edit')}</button>
                      {!(v.roles || [v.role]).includes('Admin') && (
                        <button onClick={() => setDeleteId(v.id)} className="text-red-500 hover:underline text-xs font-semibold">{t('common.delete')}</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Volunteer"
        message="Are you sure you want to remove this volunteer? They will no longer be able to log in."
        danger
        onConfirm={() => { deleteVolunteer(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
        confirmLabel={t('common.delete')}
      />
    </div>
  );
}
