import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudentStore } from '../../store/useStudentStore.js';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Papa from 'papaparse';

const EMPTY_STUDENT = { roll_no: '', name: '', mobile: '', gender: '', batch: '', parent_name: '', mother_name: '', age: '', reg_id: '' };

const CSV_HEADERS = ['Roll Number', 'Reg ID', 'Child Name', 'Gender', 'Age', 'DOB', 'Allotted Book', 'Father Name', 'Mother Name', 'Mobile', 'WhatsApp', 'Health Issue', 'Health Detail', 'Pathshala', 'Prev Shivir'];

const TEMPLATE_ROWS = [
  ['B001', 'JBSSS-2026-XXXXX', 'Arham Jain', 'Boy', '9', '2016-06-26', 'Bhag-1', 'Vikram Jain', 'Preeti Jain', '9179105875', '9179105875', 'No', '', 'Regular', 'No'],
  ['G001', 'JBSSS-2026-YYYYY', 'Aarvi Jain', 'Girl', '9', '2016-07-03', 'Bhag-1', 'Sachin Jain', 'Ritu Jain', '7067514988', '7067514988', 'No', '', 'Regular', 'No'],
];

function toTitleCase(str) {
  if (!str) return '';
  return str.trim().replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function buildCSV(rows) {
  return [CSV_HEADERS, ...rows]
    .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

function downloadCSV(filename, csvContent) {
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function AdminStudents() {
  const { t } = useTranslation();
  const { students, addStudent, updateStudent, deleteStudent, importFromCSV } = useStudentStore();

  const [searchQ, setSearchQ] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_STUDENT);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});
  const [importResult, setImportResult] = useState(null); // { count, errors[] }
  const fileRef = useRef();

  const filtered = students.filter(s =>
    !searchQ ||
    s.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    s.roll_no.includes(searchQ) ||
    (s.mobile && s.mobile.includes(searchQ))
  );

  const validate = () => {
    const e = {};
    if (!form.roll_no.trim()) e.roll_no = 'Roll number is required';
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.batch.trim()) e.batch = 'Book/Batch is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const normalized = {
      ...form,
      name: toTitleCase(form.name),
      parent_name: toTitleCase(form.parent_name),
      mother_name: toTitleCase(form.mother_name),
      age: form.age ? (parseInt(form.age) || null) : null,
    };
    if (editingId) {
      updateStudent(editingId, normalized);
    } else {
      addStudent(normalized);
    }
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_STUDENT);
    setErrors({});
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setForm({
      roll_no: s.roll_no, name: s.name, mobile: s.mobile || '',
      gender: s.gender || '', batch: s.batch || '',
      parent_name: s.parent_name || '', mother_name: s.mother_name || '',
      age: s.age || '', reg_id: s.reg_id || '',
    });
    setShowForm(true);
    setErrors({});
  };

  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportResult(null);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const valid = results.data.filter(r => r['Child Name'] || r.Name || r.name);
        const rowErrors = results.data
          .filter(r => !r['Child Name'] && !r.Name && !r.name)
          .map((_, i) => `Row ${i + 1}: missing name`);

        if (valid.length === 0) {
          setImportResult({ count: 0, rowErrors: ['No valid rows found. Make sure column headers match the template.'] });
          return;
        }

        await importFromCSV(valid);
        setImportResult({ count: valid.length, rowErrors });
      },
    });
    e.target.value = '';
  };

  const handleDownloadTemplate = () => {
    downloadCSV('shivir_students_template.csv', buildCSV(TEMPLATE_ROWS));
  };

  const handleExportAll = () => {
    const exportHeaders = ['Roll Number', 'Reg ID', 'Child Name', 'Gender', 'Age', 'DOB', 'Allotted Book', 'Father Name', 'Mother Name', 'Mobile', 'WhatsApp', 'Health Issue', 'Health Detail', 'Pathshala', 'Prev Shivir', 'Kit Given', 'Checked In', 'Total Points'];
    const rows = students.map(s => [
      s.roll_no, s.reg_id || '', s.name, s.gender || '', s.age || '', s.dob || '',
      s.batch || '', s.parent_name || '', s.mother_name || '', s.mobile || '',
      s.whatsapp || '', s.health_issue ? 'Yes' : 'No', s.health_detail || '',
      s.pathshala || '', s.prev_shivir ? 'Yes' : 'No', s.kit_given ? 'Yes' : 'No',
      s.checked_in ? 'Yes' : 'No', s.total_points,
    ]);
    const csvContent = [exportHeaders, ...rows]
      .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    downloadCSV(`shivir_students_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  };

  return (
    <div className="p-6">
      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-saffron-500 w-64"
          placeholder="Search by name, roll or mobile..."
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
        />
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_STUDENT); setErrors({}); }}
          className="btn-secondary text-sm px-4 py-2 text-base"
        >
          + {t('admin.addStudent')}
        </button>
        <span className="text-sm text-gray-500 self-center">{filtered.length} students</span>
      </div>

      {/* CSV panel */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
        <div className="font-semibold text-blue-800 text-sm mb-1">Bulk Import / Export</div>
        <p className="text-xs text-blue-600 mb-3">
          Download the template, fill it in Excel or Google Sheets, then upload. Required columns:
          <span className="font-mono font-bold"> Roll Number, Child Name, Allotted Book</span> (others optional)
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors"
          >
            📥 Download Template
          </button>
          <button
            onClick={() => { setImportResult(null); fileRef.current?.click(); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors"
          >
            📤 Upload CSV
          </button>
          {students.length > 0 && (
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-100 transition-colors"
            >
              📊 Export All Students
            </button>
          )}
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} />
        </div>

        {/* Import result feedback */}
        {importResult && (
          <div className={`mt-3 p-3 rounded-xl text-sm ${importResult.count > 0 ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {importResult.count > 0 && (
              <div className="font-semibold">✅ {importResult.count} student{importResult.count > 1 ? 's' : ''} imported successfully</div>
            )}
            {importResult.rowErrors?.length > 0 && (
              <div className="mt-1">
                {importResult.rowErrors.map((err, i) => (
                  <div key={i} className="text-xs">⚠️ {err}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setEditingId(null); setErrors({}); } }}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl fade-in">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
              <h3 className="font-bold text-forest-700 text-lg">{editingId ? t('admin.editStudent') : t('admin.addStudent')}</h3>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setErrors({}); }}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
              >✕</button>
            </div>
            <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'roll_no',     label: 'Roll No.',        required: true },
                { key: 'name',        label: 'Name',            required: true },
                { key: 'mobile',      label: 'Mobile',          required: false },
                { key: 'gender',      label: 'Gender',          required: false },
                { key: 'age',         label: 'Age',             required: false },
                { key: 'batch',       label: 'Allotted Book',   required: true },
                { key: 'parent_name', label: 'Father Name',     required: false },
                { key: 'mother_name', label: 'Mother Name',     required: false },
                { key: 'reg_id',      label: 'Reg ID',          required: false },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {f.label} {f.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    className={`input-field ${errors[f.key] ? 'border-red-400' : ''}`}
                    value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  />
                  {errors[f.key] && <p className="text-red-500 text-xs mt-1">{errors[f.key]}</p>}
                </div>
              ))}
            </div>
            <div className="flex gap-3 px-6 pb-5">
              <button onClick={handleSave} className="btn-primary text-base px-6 py-2">{t('common.save')}</button>
              <button onClick={() => { setShowForm(false); setEditingId(null); setErrors({}); }} className="btn-outline text-base px-6 py-2">{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-forest-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Roll</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Gender</th>
                <th className="px-4 py-3 text-left">Age</th>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">Father</th>
                <th className="px-4 py-3 text-left">Mobile</th>
                <th className="px-4 py-3 text-left">Health</th>
                <th className="px-4 py-3 text-left">Kit</th>
                <th className="px-4 py-3 text-left">Points</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className={`border-b last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{s.roll_no}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{s.gender || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{s.age || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full text-xs font-semibold">{s.batch || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{s.parent_name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{s.mobile || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    {s.health_issue ? <span className="text-red-500 font-bold text-xs">⚠️ Yes</span> : <span className="text-gray-400 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.kit_given ? <span className="text-green-600 font-bold text-xs">✅</span> : <span className="text-amber-500 text-xs">📦</span>}
                  </td>
                  <td className="px-4 py-3 font-bold text-saffron-600">{s.total_points}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(s)} className="text-blue-600 hover:underline text-xs font-semibold">{t('common.edit')}</button>
                      <button onClick={() => setDeleteId(s.id)} className="text-red-500 hover:underline text-xs font-semibold">{t('common.delete')}</button>
                    </div>
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

      <ConfirmDialog
        open={!!deleteId}
        title={t('admin.deleteStudent')}
        message={t('admin.confirmDelete')}
        danger
        onConfirm={() => { deleteStudent(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
        confirmLabel={t('common.delete')}
      />
    </div>
  );
}
