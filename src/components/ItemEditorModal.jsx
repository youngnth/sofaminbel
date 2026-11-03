import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ItemEditorModal() {
  const { itemEditorSession, closeItemEditor } = useShop();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (itemEditorSession && itemEditorSession.initialValues) {
      setFormData({ ...itemEditorSession.initialValues });
    } else {
      setFormData({});
    }
  }, [itemEditorSession]);

  if (!itemEditorSession) return null;

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof itemEditorSession.onSave === 'function') {
      itemEditorSession.onSave(formData);
    }
    closeItemEditor();
  };

  return (
    <div className="perfa-modal-overlay open" onClick={closeItemEditor}>
      <div className="perfa-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="perfa-modal-header">
          <h3>{itemEditorSession.title || 'Chỉnh sửa nội dung'}</h3>
          <button type="button" className="perfa-modal-close" onClick={closeItemEditor}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="perfa-modal-body">
            {itemEditorSession.fields?.map((f) => (
              <div key={f.key} className="perfa-form-group">
                <label>{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    value={formData[f.key] ?? ''}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                  />
                ) : (
                  <input
                    type={f.type || 'text'}
                    value={formData[f.key] ?? ''}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="perfa-modal-footer">
            <button type="button" className="perfa-btn-cancel" onClick={closeItemEditor}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} /> Lưu Thay Đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
