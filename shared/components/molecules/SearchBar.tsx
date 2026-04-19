import { useState, useCallback, type ChangeEvent } from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';
import { debounce } from '@/shared/utils/helpers';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  value?: string;
}

export default function SearchBar({ placeholder = 'Suchen…', onSearch, value = '' }: SearchBarProps) {
  const [local, setLocal] = useState(value);

  const debouncedSearch = useCallback(debounce((v: string) => onSearch(v), 200), [onSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocal(v);
    debouncedSearch(v);
  };

  const clear = () => {
    setLocal('');
    onSearch('');
  };

  return (
    <div className={styles.wrapper}>
      <Search size={15} className={styles.searchIcon} />
      <input
        className={styles.input}
        placeholder={placeholder}
        value={local}
        onChange={handleChange}
      />
      {local && (
        <button className={styles.clear} onClick={clear} aria-label="Suche zurücksetzen">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
