import React from 'react';
import { Edit2, Image, RotateCcw } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function SectionToolbar({ sectionKey, sectionName, onEditText, onCropImage }) {
  const { isEditMode, restoreSection } = useShop();

  if (!isEditMode) return null;

  return (
    <div className="perfa-section-toolbar">
      <span className="perfa-section-name">{sectionName}</span>

      {onEditText && (
        <button type="button" className="perfa-toolbar-btn" onClick={onEditText}>
          <Edit2 size={13} /> Sửa Chữ
        </button>
      )}

      {onCropImage && (
        <button type="button" className="perfa-toolbar-btn" onClick={onCropImage}>
          <Image size={13} /> Cắt/Thay Ảnh
        </button>
      )}

      <button
        type="button"
        className="perfa-toolbar-btn btn-reset"
        onClick={() => restoreSection(sectionKey)}
        title={`Khôi phục nội dung ban đầu cho phần ${sectionName}`}
      >
        <RotateCcw size={13} /> Khôi phục gốc
      </button>
    </div>
  );
}
