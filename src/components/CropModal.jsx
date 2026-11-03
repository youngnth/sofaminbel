import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Link as LinkIcon, RotateCw, ZoomIn, Scissors } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CropModal() {
  const { cropSession, closeCropModal } = useShop();

  const [imageUrl, setImageUrl] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [rotation, setRotation] = useState(0);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (cropSession) {
      setImageUrl(cropSession.initialUrl || '');
      setUrlInput(cropSession.initialUrl && !cropSession.initialUrl.startsWith('data:') ? cropSession.initialUrl : '');
      setAspectRatio(cropSession.aspectRatio || 16 / 9);
      setZoom(1);
      setPanX(0);
      setPanY(0);
      setRotation(0);
    }
  }, [cropSession]);

  // Load image object whenever imageUrl changes
  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setPanX(0);
      setPanY(0);
      setZoom(1);
      drawCanvas();
    };
    img.onerror = () => {
      alert('Không thể tải ảnh từ URL này (do bảo mật CORS hoặc link hỏng). Vui lòng tải ảnh về máy rồi dùng nút "Tải ảnh từ máy tính".');
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Redraw canvas on any transform change
  useEffect(() => {
    drawCanvas();
  }, [zoom, panX, panY, rotation, aspectRatio]);

  if (!cropSession) return null;

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // Canvas display dimensions
    const maxW = 560;
    const maxH = 340;
    let w = maxW;
    let h = w / aspectRatio;
    if (h > maxH) {
      h = maxH;
      w = h * aspectRatio;
    }

    canvas.width = Math.round(w);
    canvas.height = Math.round(h);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!img) {
      ctx.fillStyle = '#22201D';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#8C877C';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Chọn ảnh từ máy tính hoặc dán link URL bên dưới', canvas.width / 2, canvas.height / 2);
      return;
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.clip();

    ctx.translate(canvas.width / 2 + panX, canvas.height / 2 + panY);
    ctx.rotate((rotation * Math.PI) / 180);

    const scaleX = canvas.width / img.width;
    const scaleY = canvas.height / img.height;
    const baseScale = Math.max(scaleX, scaleY);
    const finalScale = baseScale * zoom;

    ctx.scale(finalScale, finalScale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    // Draw Grid Lines (Rule of thirds)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 3, 0);
    ctx.lineTo(canvas.width / 3, canvas.height);
    ctx.moveTo((canvas.width * 2) / 3, 0);
    ctx.lineTo((canvas.width * 2) / 3, canvas.height);
    ctx.moveTo(0, canvas.height / 3);
    ctx.lineTo(canvas.width, canvas.height / 3);
    ctx.moveTo(0, (canvas.height * 2) / 3);
    ctx.lineTo(canvas.width, (canvas.height * 2) / 3);
    ctx.stroke();

    // Border
    ctx.strokeStyle = '#4B6355';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setImageUrl(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlLoad = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setImageUrl(urlInput.trim());
    }
  };

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - panX, y: e.clientY - panY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    setPanX(e.clientX - dragStartRef.current.x);
    setPanY(e.clientY - dragStartRef.current.y);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleApplyCrop = () => {
    if (!imageRef.current) {
      alert('Vui lòng chọn ảnh trước khi cắt.');
      return;
    }

    const previewCanvas = canvasRef.current;
    const exportCanvas = document.createElement('canvas');
    const exportW = 1200;
    const exportH = Math.round(exportW / aspectRatio);
    exportCanvas.width = exportW;
    exportCanvas.height = exportH;

    const ctx = exportCanvas.getContext('2d');
    const img = imageRef.current;
    const mult = exportW / previewCanvas.width;

    ctx.save();
    ctx.translate(exportCanvas.width / 2 + panX * mult, exportCanvas.height / 2 + panY * mult);
    ctx.rotate((rotation * Math.PI) / 180);

    const scaleX = exportCanvas.width / img.width;
    const scaleY = exportCanvas.height / img.height;
    const baseScale = Math.max(scaleX, scaleY);
    const finalScale = baseScale * zoom;

    ctx.scale(finalScale, finalScale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    const croppedBase64 = exportCanvas.toDataURL('image/jpeg', 0.9);

    if (typeof cropSession.onApply === 'function') {
      cropSession.onApply(croppedBase64);
    }

    closeCropModal();
  };

  return (
    <div className="perfa-modal-overlay open" onClick={closeCropModal}>
      <div className="perfa-modal-box perfa-crop-modal" onClick={(e) => e.stopPropagation()}>
        <div className="perfa-modal-header">
          <h3>{cropSession.title || 'Cắt & Thay ảnh cho vừa khung'}</h3>
          <button type="button" className="perfa-modal-close" onClick={closeCropModal}>
            <X size={20} />
          </button>
        </div>

        <div className="perfa-modal-body">
          {/* Source Selectors */}
          <div className="perfa-crop-source-row">
            <label className="perfa-upload-zone">
              <Upload size={24} color="#4B6355" />
              <p style={{ margin: '4px 0 0', fontWeight: 600, color: '#4B6355' }}>
                Tải ảnh từ máy tính (File)
              </p>
              <small style={{ color: '#8C877C' }}>PNG, JPG, WebP</small>
              <input type="file" accept="image/*" onChange={handleFileUpload} />
            </label>

            <form onSubmit={handleUrlLoad} className="perfa-url-zone">
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B6355' }}>
                HOẶC DÁN LINK URL ẢNH
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Tải
                </button>
              </div>
            </form>
          </div>

          {/* Aspect Ratio Presets */}
          <div className="perfa-aspect-pills">
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8C877C', alignSelf: 'center' }}>
              Tỉ lệ khung:
            </span>
            <button
              type="button"
              className={`perfa-aspect-pill ${Math.abs(aspectRatio - 16 / 9) < 0.05 ? 'active' : ''}`}
              onClick={() => setAspectRatio(16 / 9)}
            >
              16:9 (Hero / Rộng)
            </button>
            <button
              type="button"
              className={`perfa-aspect-pill ${Math.abs(aspectRatio - 4 / 3) < 0.05 ? 'active' : ''}`}
              onClick={() => setAspectRatio(4 / 3)}
            >
              4:3 (Ngang)
            </button>
            <button
              type="button"
              className={`perfa-aspect-pill ${Math.abs(aspectRatio - 1) < 0.05 ? 'active' : ''}`}
              onClick={() => setAspectRatio(1)}
            >
              1:1 (Vuông / Sofa)
            </button>
            <button
              type="button"
              className={`perfa-aspect-pill ${Math.abs(aspectRatio - 3 / 4) < 0.05 ? 'active' : ''}`}
              onClick={() => setAspectRatio(3 / 4)}
            >
              3:4 (Dọc / About)
            </button>
          </div>

          {/* Interactive Canvas */}
          <div
            className="perfa-crop-stage-wrap"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              className="perfa-crop-canvas"
              onMouseDown={handleMouseDown}
            />
          </div>

          {/* Controls: Zoom, Pan X, Rotate */}
          <div className="perfa-crop-controls-row">
            <div className="perfa-control-item">
              <div className="perfa-control-label">
                <span>🔍 Phóng to / Thu nhỏ (Zoom)</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                className="perfa-slider"
                min="0.4"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
              />
            </div>

            <div className="perfa-control-item">
              <div className="perfa-control-label">
                <span>↔️ Di chuyển ngang (Pan X)</span>
                <span>{Math.round(panX)}px</span>
              </div>
              <input
                type="range"
                className="perfa-slider"
                min="-300"
                max="300"
                step="2"
                value={panX}
                onChange={(e) => setPanX(parseFloat(e.target.value))}
              />
            </div>

            <button
              type="button"
              className="perfa-rotate-btn"
              onClick={() => setRotation((r) => (r + 90) % 360)}
            >
              <RotateCw size={14} style={{ display: 'inline', marginRight: 4 }} /> 90°
            </button>
          </div>

          <small style={{ display: 'block', marginTop: 8, color: '#8C877C', fontSize: '0.78rem' }}>
            💡 Mẹo: Nhấp và kéo chuột trực tiếp trên khung ảnh để căn góc đẹp nhất!
          </small>
        </div>

        <div className="perfa-modal-footer">
          <button type="button" className="perfa-btn-cancel" onClick={closeCropModal}>
            Hủy
          </button>
          <button type="button" className="btn btn-primary" onClick={handleApplyCrop}>
            <Scissors size={15} /> Cắt Ảnh &amp; Áp Dụng
          </button>
        </div>
      </div>
    </div>
  );
}
