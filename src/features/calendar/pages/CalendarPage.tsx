import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Clock, Calendar as CalendarIcon, Tag, Settings } from 'lucide-react';
import { useCalendarStore } from '../store/calendarStore';
import { useCampaignStore } from '@/store/campaignStore';
import PageHeader from '@/shared/components/layout/PageHeader';
import Button from '@/shared/components/atoms/Button';
import Badge from '@/shared/components/atoms/Badge';
import { useTranslation } from '@/shared/i18n/useTranslation';
import CalendarSettingsModal from '../components/CalendarSettingsModal';
import CalendarEventModal from '../components/CalendarEventModal';
import styles from './CalendarPage.module.css';

/**
 * CalendarPage component displays the global calendar for the active campaign.
 * It provides a monthly view of events and a sidebar for upcoming events.
 */
export default function CalendarPage() {
  const { t } = useTranslation();
  const activeCampaignId = useCampaignStore(s => s.activeCampaignId) || '';
  const { 
    getConfigForCampaign, 
    getCurrentDateForCampaign, 
    getEventsForCampaign,
    setCurrentDate,
    updateConfig,
    addEvent 
  } = useCalendarStore();

  const config = getConfigForCampaign(activeCampaignId);
  const worldDate = getCurrentDateForCampaign(activeCampaignId);
  const events = getEventsForCampaign(activeCampaignId);

  const [viewDate, setViewDate] = useState({ month: worldDate.month, year: worldDate.year });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  
  // Sidebar tab state
  const [sidebarTab, setSidebarTab] = useState<'upcoming' | 'all'>('upcoming');

  const [jumpYear, setJumpYear] = useState(viewDate.year.toString());
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL params on mount or when they change
  useEffect(() => {
    const y = searchParams.get('year');
    const m = searchParams.get('month');
    const eId = searchParams.get('eventId');

    if (y && m) {
      const yearInt = parseInt(y, 10);
      const monthInt = parseInt(m, 10);
      if (!isNaN(yearInt) && !isNaN(monthInt)) {
        setViewDate({ month: monthInt, year: yearInt });
        setJumpYear(yearInt.toString());
      }
    }

    if (eId) {
      const targetEvent = events.find(e => e.id === eId);
      if (targetEvent) {
        setEditingEvent(targetEvent);
        setIsEventModalOpen(true);
      }
      // Remove eventId from URL so it doesn't reopen if closed
      searchParams.delete('eventId');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, events, setSearchParams]);

  // Fallback to month 0 if month index is out of bounds due to config changes
  const safeMonthIndex = Math.min(viewDate.month, config.months.length - 1);
  const currentMonth = config.months[safeMonthIndex];
  const daysInMonth = currentMonth.days;

  // Calculate starting weekday of the month
  const getStartWeekday = (m: number, y: number) => {
    let totalDays = y * config.months.reduce((sum, mon) => sum + mon.days, 0);
    for (let i = 0; i < m; i++) totalDays += config.months[i].days;
    return totalDays % config.daysPerWeek;
  };

  const startWeekday = getStartWeekday(safeMonthIndex, viewDate.year);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: startWeekday }, (_, i) => null);

  /**
   * Navigates the calendar view to the previous month.
   * Handles year wrap-around if moving past the first month.
   */
  const handlePrevMonth = () => {
    setViewDate(prev => {
      const newMonth = prev.month === 0 ? config.months.length - 1 : prev.month - 1;
      const newYear = prev.month === 0 ? prev.year - 1 : prev.year;
      setJumpYear(newYear.toString());
      return { month: newMonth, year: newYear };
    });
  };

  /**
   * Navigates the calendar view to the next month.
   * Handles year wrap-around if moving past the last month.
   */
  const handleNextMonth = () => {
    setViewDate(prev => {
      const newMonth = prev.month === config.months.length - 1 ? 0 : prev.month + 1;
      const newYear = prev.month === config.months.length - 1 ? prev.year + 1 : prev.year;
      setJumpYear(newYear.toString());
      return { month: newMonth, year: newYear };
    });
  };

  /**
   * Jumps to the specified year when hitting Enter or blurring the input.
   */
  const handleJumpYear = () => {
    const y = parseInt(jumpYear, 10);
    if (!isNaN(y)) {
      setViewDate(prev => ({ ...prev, year: y }));
    } else {
      setJumpYear(viewDate.year.toString());
    }
  };

  /**
   * Opens the CalendarEventModal to create a new event.
   */
  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  /**
   * Opens the CalendarEventModal to edit an existing event.
   * @param event The event object to edit
   */
  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  /**
   * Saves the event from the modal (create or update).
   * @param eventData The partial data returned from the modal
   */
  const handleSaveEvent = (eventData: any) => {
    if (editingEvent) {
      useCalendarStore.getState().updateEvent(editingEvent.id, eventData);
    } else {
      addEvent({
        ...eventData,
        status: 'active',
        tags: [],
        notes: '',
        metadata: {}
      });
    }
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('sidebar.calendar') || 'Kalender'}
        subtitle={`${config.yearName || 'Jahr'} ${viewDate.year}`}
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<Settings size={16} />} onClick={() => setIsSettingsOpen(true)}>
              Einstellungen
            </Button>
            <Button variant="primary" icon={<Plus size={16} />} onClick={handleAddEvent}>
              Ereignis hinzufügen
            </Button>
          </>
        }
      />

      <CalendarSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        currentDate={worldDate}
        onSaveConfig={(newConfig) => updateConfig(activeCampaignId, newConfig)}
        onSaveDate={(newDate) => setCurrentDate(activeCampaignId, newDate)}
      />

      <CalendarEventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        config={config}
        initialDate={{ day: 1, month: viewDate.month, year: viewDate.year }}
        existingEvent={editingEvent}
      />

      <div className={styles.container}>
        <div className={styles.calendarSection}>
          <div className={styles.controls}>
            <button className={styles.navBtn} onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
            <h2 className={styles.monthTitle}>{currentMonth.name}</h2>
            <input 
              type="number" 
              className={styles.yearInput}
              value={jumpYear}
              onChange={(e) => setJumpYear(e.target.value)}
              onBlur={handleJumpYear}
              onKeyDown={(e) => e.key === 'Enter' && handleJumpYear()}
              title="Jahr eingeben und Enter drücken"
            />
            <button className={styles.navBtn} onClick={handleNextMonth}><ChevronRight size={20} /></button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setViewDate({ month: worldDate.month, year: worldDate.year });
                setJumpYear(worldDate.year.toString());
              }}
            >
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
              const dayEvents = events.filter(e => e.day === d && e.month === viewDate.month && e.year === viewDate.year);
              
              return (
                <div key={d} className={`${styles.dayCell} ${isToday ? styles.today : ''}`}>
                  <span className={styles.dayNumber}>{d}</span>
                  <div className={styles.dayEvents}>
                    {dayEvents.map(e => (
                      <div 
                        key={e.id} 
                        className={styles.miniEvent} 
                        title={e.title}
                        onClick={(ev) => { ev.stopPropagation(); handleEditEvent(e); }}
                      >
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
          <div className={styles.sidebarTabs}>
            <button 
              className={`${styles.sidebarTab} ${sidebarTab === 'upcoming' ? styles.sidebarTabActive : ''}`}
              onClick={() => setSidebarTab('upcoming')}
            >
              Anstehend
            </button>
            <button 
              className={`${styles.sidebarTab} ${sidebarTab === 'all' ? styles.sidebarTabActive : ''}`}
              onClick={() => setSidebarTab('all')}
            >
              Alle Ereignisse
            </button>
          </div>
          
          <div className={styles.eventList}>
            {events
              .filter(e => sidebarTab === 'all' ? true : e.year >= viewDate.year)
              .sort((a, b) => (a.year - b.year) || (a.month - b.month) || (a.day - b.day))
              .map(e => (
                <div 
                  key={e.id} 
                  className={styles.eventItem}
                  onClick={() => {
                    setViewDate({ month: e.month, year: e.year });
                    setJumpYear(e.year.toString());
                    handleEditEvent(e);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.eventDate}>
                    {e.day}. {config.months[e.month].name} {e.year}
                  </div>
                  <div className={styles.eventInfo}>
                    <div className={styles.eventTitle}>{e.title}</div>
                    {e.description && <div className={styles.eventDesc}>{e.description}</div>}
                  </div>
                </div>
              ))}
              
            {events.length === 0 && (
              <div style={{ color: 'var(--color-text-tertiary)', textAlign: 'center', marginTop: 'var(--space-4)', fontStyle: 'italic', fontSize: 'var(--font-size-sm)' }}>
                Keine Ereignisse vorhanden.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
