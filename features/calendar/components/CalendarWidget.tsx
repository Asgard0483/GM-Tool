import { Clock, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCalendarStore } from '../store/calendarStore';
import { useCampaignStore } from '@/store/campaignStore';
import Button from '@/shared/components/atoms/Button';
import styles from './CalendarWidget.module.css';

export default function CalendarWidget() {
  const navigate = useNavigate();
  const activeCampaignId = useCampaignStore(s => s.activeCampaignId) || '';
  const { 
    getConfigForCampaign, 
    getCurrentDateForCampaign, 
    advanceTime 
  } = useCalendarStore();

  const config = getConfigForCampaign(activeCampaignId);
  const date = getCurrentDateForCampaign(activeCampaignId);

  const monthName = config.months[date.month]?.name || 'Unbekannter Monat';

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Clock size={16} className={styles.icon} />
          <span>Kampagnen-Zeit</span>
        </div>
        <button className={styles.detailsBtn} onClick={() => navigate('/calendar')}>
          Kalender <ArrowRight size={14} />
        </button>
      </div>

      <div className={styles.timeDisplay}>
        <div className={styles.clock}>{date.time}</div>
        <div className={styles.fullDate}>
          {date.day}. {monthName} {date.year}
        </div>
        <div className={styles.era}>{config.yearName}</div>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" size="xs" onClick={() => advanceTime(activeCampaignId, 0, 1)}>
          +1 Std
        </Button>
        <Button variant="secondary" size="xs" onClick={() => advanceTime(activeCampaignId, 0, 8)}>
          +8 Std
        </Button>
        <Button variant="secondary" size="xs" onClick={() => advanceTime(activeCampaignId, 1)}>
          +1 Tag
        </Button>
      </div>
    </div>
  );
}
