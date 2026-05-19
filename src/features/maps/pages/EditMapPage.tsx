import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Map as MapIcon, Save, X } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { useTranslation } from '@/shared/i18n/useTranslation';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import { FormField, Input, Textarea } from '@/shared/components/atoms/FormField';
import styles from './MapForm.module.css';

export default function EditMapPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getEntityById, updateEntity } = useMapStore();
  const map = getEntityById(id!);

  const [title, setTitle] = useState(map?.title || '');
  const [imageUrl, setImageUrl] = useState(map?.imageUrl || '');
  const [description, setDescription] = useState(map?.description || '');

  useEffect(() => {
    if (!map) navigate('/maps');
  }, [map, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    updateEntity(id!, {
      title,
      imageUrl,
      description,
    });

    navigate(`/maps/${id}`);
  };

  if (!map) return null;

  return (
    <div className={styles.page}>
      <PageHeader
        title={`${t('common.edit')}: ${map.title}`}
        
      />

      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.formCard}>
          <FormField label={t('common.title')} required>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="z.B. Weltkarte von Aethelgard"
            />
          </FormField>

          <FormField label={t('maps.imageUrl')} required hint="URL zu einem Bild (Imgur, Pinterest, etc.)">
            <Input
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </FormField>

          <FormField label={t('common.description')}>
            <Textarea
              value={description}
              onChange={(e: any) => setDescription(e.target.value)}
              placeholder="..."
              rows={4}
            />
          </FormField>
          
          <div className={styles.preview}>
            <div className={styles.previewLabel}>Vorschau</div>
            <div className={styles.previewBox}>
                {imageUrl ? (
                    <img src={imageUrl} alt="Map Preview" onError={(e) => (e.currentTarget.style.display = 'none')} />
                ) : (
                    <div className={styles.previewPlaceholder}>
                        <MapIcon size={32} />
                        <span>Keine URL angegeben</span>
                    </div>
                )}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" icon={<X size={16} />} onClick={() => navigate(`/maps/${id}`)}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" icon={<Save size={16} />} type="submit" disabled={!title || !imageUrl}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  );
}
