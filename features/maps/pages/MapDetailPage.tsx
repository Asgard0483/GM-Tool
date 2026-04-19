import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin as PinIcon, Plus, ZoomIn, ZoomOut, Maximize, Edit2, ChevronLeft, Map as MapIcon, X, Trash2 } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { useToast } from '@/shared/components/atoms/Toast';
import Button from '@/shared/components/atoms/Button';
import PageHeader from '@/shared/components/layout/PageHeader';
import styles from './MapDetailPage.module.css';
import type { MapPin, EntityType } from '@/shared/types';

export default function MapDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { getEntityById, addPin, updatePin, deletePin } = useMapStore();
  const { entities: worldEntities } = useWorldStore();
  
  const map = getEntityById(id!);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [activePin, setActivePin] = useState<MapPin | null>(null);
  const [isAddingPin, setIsAddingPin] = useState(false);
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!map) navigate('/maps');
  }, [map, navigate]);

  if (!map) return null;

  // Interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAddingPin) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(Math.max(prev * delta, 0.5), 5));
  };

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (!isAddingPin || !imgRef.current) return;
    
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    addPin(map.id, {
      label: 'Neuer Ort',
      x,
      y,
      color: '#6366f1',
    });
    
    setIsAddingPin(false);
    toast('Pin wurde gesetzt.', 'success');
  };

  const handlePinClick = (e: React.MouseEvent, pin: MapPin) => {
    e.stopPropagation();
    setActivePin(pin);
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate('/maps')}>
            <ChevronLeft size={20} />
          </button>
          <div className={styles.titleInfo}>
            <h1 className={styles.title}>{map.title}</h1>
            <p className={styles.subtitle}>{map.description || 'Interaktive Weltkarte'}</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button 
            variant={isAddingPin ? 'primary' : 'secondary'} 
            icon={<Plus size={16} />} 
            onClick={() => setIsAddingPin(!isAddingPin)}
          >
            {isAddingPin ? 'Klicke auf die Karte...' : t('maps.addPin')}
          </Button>
          <Button variant="ghost" icon={<Edit2 size={16} />} onClick={() => navigate(`/maps/${id}/edit`)}>
            {t('common.edit')}
          </Button>
        </div>
      </header>

      <div 
        className={`${styles.viewer} ${isDragging ? styles.dragging : ''} ${isAddingPin ? styles.crosshair : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        ref={viewerRef}
      >
        <div 
          className={styles.mapContainer}
          style={{ 
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
          onClick={handleMapClick}
        >
          <img 
            ref={imgRef}
            src={map.imageUrl} 
            alt={map.title} 
            className={styles.mapImage}
            draggable={false}
          />
          
          {map.pins.map(pin => (
            <div 
              key={pin.id}
              className={`${styles.pin} ${activePin?.id === pin.id ? styles.pinActive : ''}`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              onClick={(e) => handlePinClick(e, pin)}
            >
              <div className={styles.pinIcon} style={{ background: pin.color || '#6366f1' }}>
                <PinIcon size={14} color="white" />
              </div>
              <span className={styles.pinLabel}>{pin.label}</span>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 5))} title="Zoom In"><ZoomIn size={18} /></button>
          <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} title="Zoom Out"><ZoomOut size={18} /></button>
          <button onClick={resetView} title="Reset View"><Maximize size={18} /></button>
        </div>
      </div>

      {/* Pin Detail Overlay */}
      {activePin && (
        <div className={styles.pinOverlay}>
          <div className={styles.pinCard}>
            <div className={styles.pinCardHeader}>
              <div className={styles.pinColorIndicator} style={{ background: activePin.color }} />
              <input 
                className={styles.pinTitleInput}
                value={activePin.label}
                onChange={(e) => updatePin(map.id, activePin.id, { label: e.target.value })}
              />
              <button className={styles.closeBtn} onClick={() => setActivePin(null)}><X size={18} /></button>
            </div>
            
            <div className={styles.pinCardBody}>
              <div className={styles.field}>
                <label>Verknüpfung</label>
                <select 
                  className={styles.select}
                  value={activePin.linkedEntityId || ''}
                  onChange={(e) => updatePin(map.id, activePin.id, { linkedEntityId: e.target.value })}
                >
                  <option value="">Keine Verknüpfung</option>
                  {worldEntities.map(ent => (
                    <option key={ent.id} value={ent.id}>{ent.title}</option>
                  ))}
                </select>
              </div>
              
              {activePin.linkedEntityId && (
                <Button 
                  variant="primary" 
                  size="sm" 
                  className={styles.goBtn}
                  onClick={() => navigate(`/worldbuilding/${activePin.linkedEntityId}`)}
                >
                  Zum Eintrag springen
                </Button>
              )}
            </div>

            <div className={styles.pinCardFooter}>
              <button 
                className={styles.deletePinBtn}
                onClick={() => {
                  if (confirm(t('maps.deletePin') + '?')) {
                    deletePin(map.id, activePin.id);
                    setActivePin(null);
                  }
                }}
              >
                <Trash2 size={14} /> {t('maps.deletePin')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

