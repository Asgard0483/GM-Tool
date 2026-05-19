import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map as MapIcon, Save, X } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { useTranslation } from '@/shared/i18n/useTranslation';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import { FormField, Input, Textarea } from '@/shared/components/atoms/FormField';
import styles from './MapForm.module.css';

export default function NewMapPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addEntity } = useMapStore();

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    addEntity({
      title,
      imageUrl,
      description,
      pins: [],
      tags: [],
      status: 'active',
      metadata: {},
      notes: '',
      campaignId: '',
    });

    navigate('/maps');
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('maps.new')}
      />

      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.formCard}>
          <FormField label={t('common.title')} required>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="z.B. Weltkarte von Aethelgard"
              autoFocus
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
          <Button variant="secondary" icon={<X size={16} />} onClick={() => navigate('/maps')}>
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
