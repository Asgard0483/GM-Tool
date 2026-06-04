import { useState } from 'react';
import { Plus, Trash2, GripVertical, Save, X } from 'lucide-react';
import Modal from '@/shared/components/atoms/Modal';
import Button from '@/shared/components/atoms/Button';
import { FormField, Input } from '@/shared/components/atoms/FormField';
import type { CalendarConfig } from '@/shared/types';
import styles from './CalendarSettingsModal.module.css';

interface CalendarSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CalendarConfig;
  currentDate: { year: number };
  onSaveConfig: (config: Partial<CalendarConfig>) => void;
  onSaveDate: (date: Partial<{ year: number }>) => void;
}

export default function CalendarSettingsModal({
  isOpen,
  onClose,
  config,
  currentDate,
  onSaveConfig,
  onSaveDate
}: CalendarSettingsModalProps) {
  const [year, setYear] = useState(currentDate.year.toString());
  const [yearName, setYearName] = useState(config.yearName);
  
  const [weekDays, setWeekDays] = useState([...config.weekDays]);
  const [months, setMonths] = useState([...config.months]);

  const handleAddWeekDay = () => setWeekDays([...weekDays, 'Neuer Tag']);
  const handleRemoveWeekDay = (index: number) => setWeekDays(weekDays.filter((_, i) => i !== index));
  const handleChangeWeekDay = (index: number, val: string) => {
    const newDays = [...weekDays];
    newDays[index] = val;
    setWeekDays(newDays);
  };

  const handleAddMonth = () => setMonths([...months, { name: 'Neuer Monat', days: 30 }]);
  const handleRemoveMonth = (index: number) => setMonths(months.filter((_, i) => i !== index));
  const handleChangeMonth = (index: number, field: 'name' | 'days', val: string | number) => {
    const newMonths = [...months];
    newMonths[index] = { ...newMonths[index], [field]: val };
    setMonths(newMonths);
  };

  const handleSave = () => {
    onSaveDate({ year: parseInt(year, 10) || 1000 });
    onSaveConfig({
      yearName,
      weekDays,
      daysPerWeek: weekDays.length,
      months,
    });
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Kalender Einstellungen" size="lg">
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Aktuelles Datum</h3>
        <div className={styles.row}>
          <div className={styles.flex1}>
            <FormField label="Aktuelles Jahr">
              <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
            </FormField>
          </div>
          <div className={styles.flex1}>
            <FormField label="Bezeichnung des Jahres (z.B. Ära des Aufbruchs)">
              <Input value={yearName} onChange={(e) => setYearName(e.target.value)} />
            </FormField>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.listHeader}>
          <h3 className={styles.sectionTitle} style={{ margin: 0, border: 'none' }}>Wochentage ({weekDays.length})</h3>
          <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={handleAddWeekDay}>Tag hinzufügen</Button>
        </div>
        {weekDays.map((day, i) => (
          <div key={i} className={styles.listItem}>
            <GripVertical size={16} className={styles.dragHandle} />
            <Input value={day} onChange={(e) => handleChangeWeekDay(i, e.target.value)} style={{ flex: 1 }} />
            <Button variant="ghost" size="sm" icon={<Trash2 size={16} />} onClick={() => handleRemoveWeekDay(i)} />
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.listHeader}>
          <h3 className={styles.sectionTitle} style={{ margin: 0, border: 'none' }}>Monate</h3>
          <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={handleAddMonth}>Monat hinzufügen</Button>
        </div>
        {months.map((m, i) => (
          <div key={i} className={styles.listItem}>
            <GripVertical size={16} className={styles.dragHandle} />
            <Input value={m.name} onChange={(e) => handleChangeMonth(i, 'name', e.target.value)} style={{ flex: 2 }} placeholder="Monatsname" />
            <Input type="number" value={m.days.toString()} onChange={(e) => handleChangeMonth(i, 'days', parseInt(e.target.value) || 1)} style={{ flex: 1 }} placeholder="Tage" />
            <Button variant="ghost" size="sm" icon={<Trash2 size={16} />} onClick={() => handleRemoveMonth(i)} />
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose} icon={<X size={16} />}>Abbrechen</Button>
        <Button variant="primary" onClick={handleSave} icon={<Save size={16} />}>Speichern</Button>
      </div>
    </Modal>
  );
}
