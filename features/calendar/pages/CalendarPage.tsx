import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { useCalendarStore } from '../store/calendarStore';
import { useCampaignStore } from '@/store/campaignStore';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import Badge from '@/shared/components/atoms/Badge';
import { useTranslation } from '@/shared/i18n/useTranslation';
import styles from './CalendarPage.module.css';

export default function CalendarPage() {
  const { t } = useTranslation();
  const activeCampaignId = useCampaignStore(s => s.activeCampaignId) || '';
  const { 
    getConfigForCampaign, 
    getCurrentDateForCampaign, 
    getEventsForCampaign,
    setCurrentDate,
    addEvent 
  } = useCalendarStore();

  const config = getConfigForCampaign(activeCampaignId);
  const worldDate = getCurrentDateForCampaign(activeCampaignId);
  const events = getEventsForCampaign(activeCampaignId);

  const [viewDate, setViewDate] = useState({ month: worldDate.month, year: worldDate.year });

  const currentMonth = config.months[viewDate.month];
  const daysInMonth = currentMonth.days;

  // Calculate starting weekday of the month
  const getStartWeekday = (m: number, y: number) => {
    let totalDays = y * config.months.reduce((sum, mon) => sum + mon.days, 0);
    for (let i = 0; i < m; i++) totalDays += config.months[i].days;
    return totalDays % config.daysPerWeek;
  };

  const startWeekday = getStartWeekday(viewDate.month, viewDate.year);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: startWeekday }, (_, i) => null);

  const handlePrevMonth = () => {
    setViewDate(prev => {
      if (prev.month === 0) return { month: config.months.length - 1, year: prev.year - 1 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setViewDate(prev => {
      if (prev.month === config.months.length - 1) return { month: 0, year: prev.year + 1 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  const handleAddEvent = () => {
    const title = prompt('Ereignis-Titel?');
    if (!title) return;
    addEvent({
      title,
      description: '',
      date: { day: 1, month: viewDate.month, year: viewDate.year, time: '12:00' },
      category: 'event'
    });
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('sidebar.calendar') || 'Kalender'}
        subtitle={`${config.yearName || 'Jahr'} ${viewDate.year}`}
        actions={
          <Button variant="primary" icon={<Plus size={16} />} onClick={handleAddEvent}>
            Ereignis hinzufügen
          </Button>
        }
      />

      <div className={styles.container}>
        <div className={styles.calendarSection}>
          <div className={styles.controls}>
            <button className={styles.navBtn} onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
            <h2 className={styles.monthTitle}>{currentMonth.name} {viewDate.year}</h2>
            <button className={styles.navBtn} onClick={handleNextMonth}><ChevronRight size={20} /></button>
            <Button variant="ghost" size="sm" onClick={() => setViewDate({ month: worldDate.month, year: worldDate.year })}>
              Heute
            </Button>
          </div>

          <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${config.daysPerWeek}, 1fr)` }}>
            {config.weekDays.map(d => (
              <div key={d} className={styles.weekdayLabel}>{d.slice(0, 2)}</div>
            ))}
            {padding.map((_, i) => <div key={`p-${i}`} className={styles.paddingCell} />)}
            {calendarDays.map(d => {
              const isToday = d === worldDate.day && viewDate.month === worldDate.month && viewDate.year === worldDate.year;
              const dayEvents = events.filter(e => e.date.day === d && e.date.month === viewDate.month && e.date.year === viewDate.year);
              
              return (
                <div key={d} className={`${styles.dayCell} ${isToday ? styles.today : ''}`}>
                  <span className={styles.dayNumber}>{d}</span>
                  <div className={styles.dayEvents}>
                    {dayEvents.map(e => (
                      <div key={e.id} className={styles.miniEvent} title={e.title}>
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.eventsSidebar}>
          <h3 className={styles.sidebarTitle}>Anstehende Ereignisse</h3>
          <div className={styles.eventList}>
            {events
              .filter(e => e.date.year >= viewDate.year)
              .sort((a, b) => (a.date.year - b.date.year) || (a.date.month - b.date.month) || (a.date.day - b.date.day))
              .slice(0, 10)
              .map(e => (
                <div key={e.id} className={styles.eventItem}>
                  <div className={styles.eventDate}>
                    {e.date.day}. {config.months[e.date.month].name} {e.date.year}
                  </div>
                  <div className={styles.eventInfo}>
                    <div className={styles.eventTitle}>{e.title}</div>
                    {e.description && <div className={styles.eventDesc}>{e.description}</div>}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
