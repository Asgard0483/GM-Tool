import { useState, useEffect } from 'react';
import Modal from '@/shared/components/atoms/Modal';
import Button from '@/shared/components/atoms/Button';
import { FormField, Input, Textarea, Select } from '@/shared/components/atoms/FormField';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useWorldStore } from '@/features/worldbuilding/store/worldStore';
import { useCalendarStore } from '@/features/calendar/store/calendarStore';
import { Trash2 } from 'lucide-react';
import type { CalendarConfig, CalendarEvent, EntityType } from '@/shared/types';
import { useTranslation } from '@/shared/i18n/useTranslation';

/**
 * Props for the CalendarEventModal component.
 */
interface CalendarEventModalProps {
  /** Controls whether the modal is visible */
  isOpen: boolean;
  /** Callback fired when the modal should be closed */
  onClose: () => void;
  /** Callback fired when the event is saved. Receives partial event data. */
  onSave: (event: Partial<CalendarEvent>) => void;
  /** The current calendar configuration */
  config: CalendarConfig;
  /** The initial date to prepopulate when creating a new event */
  initialDate?: { day: number; month: number; year: number };
  /** The event data to edit, if editing an existing event */
  existingEvent?: CalendarEvent;
  /** If provided, locks the entity selection dropdown to this entity ID */
  fixedLinkedEntityId?: string;
  /** If provided, locks the entity selection dropdown to this entity type */
  fixedLinkedEntityType?: EntityType;
}

/**
 * A modal that allows users to create or edit calendar events.
 * Provides inputs for title, date, description, and an optional link to an entity.
 */
export default function CalendarEventModal({
  isOpen,
  onClose,
  onSave,
  config,
  initialDate,
  existingEvent,
  fixedLinkedEntityId,
  fixedLinkedEntityType
}: CalendarEventModalProps) {
  const { t } = useTranslation();
  const characters = useCharacterStore(s => s.characters);
  const worldEntities = useWorldStore(s => s.entities);
  const deleteEvent = useCalendarStore(s => s.deleteEvent);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(config.yearOffset);
  const [linkedEntityId, setLinkedEntityId] = useState<string>('');
  const [linkedEntityType, setLinkedEntityType] = useState<EntityType | ''>('');

  useEffect(() => {
    if (isOpen) {
      if (existingEvent) {
        setTitle(existingEvent.title);
        setDescription(existingEvent.description);
        setDay(existingEvent.day);
        setMonth(existingEvent.month);
        setYear(existingEvent.year);
        setLinkedEntityId(existingEvent.linkedEntityId || '');
        setLinkedEntityType(existingEvent.linkedEntityType || '');
      } else {
        setTitle('');
        setDescription('');
        setDay(initialDate?.day || 1);
        setMonth(initialDate?.month || 0);
        setYear(initialDate?.year || config.yearOffset);
        
        if (fixedLinkedEntityId && fixedLinkedEntityType) {
          setLinkedEntityId(fixedLinkedEntityId);
          setLinkedEntityType(fixedLinkedEntityType);
        } else {
          setLinkedEntityId('');
          setLinkedEntityType('');
        }
      }
    }
  }, [isOpen, existingEvent, initialDate, config.yearOffset, fixedLinkedEntityId, fixedLinkedEntityType]);

  /**
   * Handles the save action, constructing the final event data
   * and determining the entity type if a link is selected.
   */
  const handleSave = () => {
    if (!title.trim()) return;
    
    // Attempt to dynamically determine the entity type if missing
    let finalEntityType = linkedEntityType;
    if (linkedEntityId && !finalEntityType) {
      if (characters.some(c => c.id === linkedEntityId)) finalEntityType = 'character';
      else {
        const we = worldEntities.find(e => e.id === linkedEntityId);
        if (we) finalEntityType = we.entityType;
      }
    }

    onSave({
      title,
      description,
      day: Number(day),
      month: Number(month),
      year: Number(year),
      linkedEntityId: linkedEntityId || undefined,
      linkedEntityType: (finalEntityType || undefined) as EntityType | undefined
    });
    onClose();
  };

  /**
   * Handles the selection of a linked entity from the dropdown.
   * Automatically resolves and sets the corresponding entity type.
   * @param val The ID of the selected entity
   */
  const handleEntityChange = (val: string) => {
    if (!val) {
      setLinkedEntityId('');
      setLinkedEntityType('');
      return;
    }
    setLinkedEntityId(val);
    
    // Determine entity type
    if (characters.some(c => c.id === val)) {
      setLinkedEntityType('character');
    } else {
      const we = worldEntities.find(e => e.id === val);
      if (we) setLinkedEntityType(we.entityType);
    }
  };

  /**
   * Prompts for confirmation and deletes the current event if confirmed.
   */
  const handleDelete = () => {
    if (!existingEvent) return;
    if (confirm('Möchtest du dieses Ereignis wirklich löschen?')) {
      deleteEvent(existingEvent.id);
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={existingEvent ? 'Ereignis bearbeiten' : 'Neues Ereignis'}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div>
            {existingEvent && (
              <Button variant="danger" onClick={handleDelete} icon={<Trash2 size={16} />}>
                Löschen
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
            <Button variant="primary" onClick={handleSave} disabled={!title.trim()}>
              {t('common.save')}
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormField label={t('common.title')} required>
          <Input value={title} onChange={e => setTitle(e.target.value)} autoFocus />
        </FormField>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <FormField label="Tag" required>
            <Input type="number" min={1} value={day} onChange={e => setDay(Number(e.target.value))} />
          </FormField>
          <FormField label="Monat" required>
            <Select value={month} onChange={e => setMonth(Number(e.target.value))}>
              {config.months.map((m, i) => (
                <option key={i} value={i}>{m.name}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Jahr" required>
            <Input type="number" value={year} onChange={e => setYear(Number(e.target.value))} />
          </FormField>
        </div>

        <FormField label="Verknüpft mit (Optional)">
          <Select 
            value={linkedEntityId} 
            onChange={e => handleEntityChange(e.target.value)}
            disabled={!!fixedLinkedEntityId} // Disable if we opened this from a specific entity
          >
            <option value="">- Keine Verknüpfung -</option>
            <optgroup label="Charaktere">
              {characters.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </optgroup>
            <optgroup label="Weltbau">
              {worldEntities.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </optgroup>
          </Select>
        </FormField>

        <FormField label={t('common.description')}>
          <Textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            rows={4}
          />
        </FormField>
      </div>
    </Modal>
  );
}
