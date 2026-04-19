import { useNavigate } from 'react-router-dom';
import { Scroll, Home, ArrowLeft, Search } from 'lucide-react';
import Button from '@/shared/components/atoms/Button';
import { useTranslation } from '@/shared/i18n/useTranslation';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const openSearch = () =>
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.icon}>
          <Scroll size={48} />
        </div>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>{t('notFoundPage.title')}</h2>
        <p className={styles.desc}>
          {t('notFoundPage.desc')}
        </p>
        <div className={styles.actions}>
          <Button variant="primary" icon={<Home size={16} />} onClick={() => navigate('/')}>
            {t('notFoundPage.toDashboard')}
          </Button>
          <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
            {t('common.back')}
          </Button>
          <Button variant="ghost" icon={<Search size={16} />} onClick={openSearch}>
            {t('notFoundPage.openSearch')}
          </Button>
        </div>
      </div>
    </div>
  );
}
