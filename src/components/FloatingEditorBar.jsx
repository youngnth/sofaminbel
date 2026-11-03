import React from 'react';
import { Edit3, Eye, Download, RotateCcw } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function FloatingEditorBar() {
  const { isEditMode, setIsEditMode, exportData, restoreAll } = useShop();

  return (
    <aside className="perfa-editor-bar">
      <div className="perfa-editor-status">
        <span className="perfa-editor-dot" style={{ background: isEditMode ? '#E53E3E' : '#68D391' }} />
        <span>{isEditMode ? 'Đang Chỉnh Sửa' : 'Chế độ xem'}</span>
      </div>

      <button
        type="button"
        className={`perfa-editor-toggle-btn ${isEditMode ? 'active' : ''}`}
        onClick={() => setIsEditMode(!isEditMode)}
      >
        {isEditMode ? (
          <>
            <Eye size={15} /> ✕ Tắt Chỉnh Sửa
          </>
        ) : (
          <>
            <Edit3 size={15} /> ✏️ Bật Chỉnh Sửa
          </>
        )}
      </button>

      <button
        type="button"
        className="perfa-editor-btn-secondary"
        onClick={exportData}
        title="Xuất file JSON chứa toàn bộ dữ liệu bạn đã chỉnh sửa"
      >
        <Download size={14} /> Xuất File
      </button>

      <button
        type="button"
        className="perfa-editor-btn-secondary"
        onClick={restoreAll}
        title="Khôi phục toàn bộ website về nội dung gốc ban đầu"
      >
        <RotateCcw size={14} /> Reset Hết
      </button>
    </aside>
  );
}
