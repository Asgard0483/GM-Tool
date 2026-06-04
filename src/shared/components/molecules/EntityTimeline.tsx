import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useCalendarStore } from '@/features/calendar/store/calendarStore';
import CalendarEventModal from '@/features/calendar/components/CalendarEventModal';
import Button from '@/shared/components/atoms/Button';
import type { EntityType, CalendarEvent } from '@/shared/types';
import { useCampaignStore } from '@/store/campaignStore';
import styles from './EntityTimeline.module.css';

/**
 * Props for the EntityTimeline component.
 */
interface EntityTimelineProps {
  /** The unique ID of the entity (e.g., character ID, world entity ID) */
  entityId: string;
  /** The type of the entity (e.g., 'character', 'place') */
  entityType: EntityType;
  /** The display name of the entity, used for empty state messages */
  entityName: string;
}

/**
 * A reusable component that displays a vertical timeline of calendar events
 * associated with a specific entity. It also allows adding new events directly.
 */
export default function EntityTimeline({ entityId, entityType, entityName }: EntityTimelineProps) {
  const navigate = useNavigate();
  const activeCampaignId = useCampaignStore(s => s.activeCampaignId) || '';
  const { getEventsForEntity, getConfigForCampaign, addEvent, updateEvent } = useCalendarStore();
  
  const config = getConfigForCampaign(activeCampaignId);
  const events = getEventsForEntity(entityId).sort((a, b) => (a.year - b.year) || (a.month - b.month) || (a.day - b.day));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  /**
   * Opens the modal to create a new calendar event for this entity.
   */
  const handleAddClick = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  /**
   * Navigates to the global calendar page, jumping to the event's date
   * and automatically opening its edit modal.
   * @param event The calendar event to view/edit
   */
  const handleEditClick = (event: CalendarEvent) => {
    navigate(`/calendar?year=${event.year}&month=${event.month}&eventId=${event.id}`);
  };

  /**
   * Saves the event (either creating a new one or updating an existing one).
   * @param eventData The partial event data from the modal
   */
  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent({
        ...eventData as Omit<CalendarEvent, 'id'|'entityType'|'createdAt'|'updatedAt'|'campaignId'>,
        status: 'active',
        tags: [],
        notes: '',
        metadata: {}
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <CalendarIcon size={18} />
          Zeitleiste / Ereignisse
        </h3>
        <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={handleAddClick}>
          Hinzufügen
        </Button>
      </div>

      {events.length === 0 ? (
        <div className={styles.empty}>
          Keine Ereignisse für {entityName} eingetragen.
        </div>
      ) : (
        <div className={styles.timeline}>
          {events.map((e, idx) => (
            <div key={e.id} className={styles.timelineItem} onClick={() => handleEditClick(e)}>
              <div className={styles.marker}></div>
              <div className={styles.date}>
                {e.day}. {config.months[e.month]?.name || e.month} {e.year}
              </div>
              <div className={styles.content}>
                <div className={styles.eventTitle}>{e.title}</div>
                {e.description && <div className={styles.eventDesc}>{e.description}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      <CalendarEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        config={config}
        existingEvent={editingEvent || undefined}
        fixedLinkedEntityId={entityId}
        fixedLinkedEntityType={entityType}
      />
    </div>
  );
}
