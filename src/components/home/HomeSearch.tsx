"use client";
import { type FormEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { findPages } from '@/lib/search/pages';
import styles from '@/app/home.module.css';
export default function HomeSearch({ initialQuery = '', wide = false }: { initialQuery?: string; wide?: boolean }) {
  const router = useRouter();
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);
  const matches = useMemo(() => findPages(query), [query]);
  const suggestions = matches.slice(0,8);
  const resultsHref = `/search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`;
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !wrap.current?.contains(event.target)) setFocused(false); };
    document.addEventListener('pointerdown',outside);
    return () => document.removeEventListener('pointerdown',outside);
  }, []);
  function navigate(href: string) {
    setFocused(false);
    window.dispatchEvent(new Event('mosaic:navigation-start'));
    router.push(href);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    navigate(active >= 0 && suggestions[active] ? suggestions[active].href : resultsHref);
  }
  return <div className={styles.searchWrap} ref={wrap} style={wide ? { width:'100%' } : undefined} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <form className={styles.searchBar} style={{ width:'100%' }} role="search" onSubmit={submit}>
      <button className={styles.searchSubmit} type="submit" aria-label="Tìm kiếm"><Search size={16} aria-hidden="true" /></button>
      <input value={query} maxLength={100} onChange={event => { setQuery(event.target.value); setActive(-1); setFocused(true); }} onFocus={() => setFocused(true)} placeholder="Tìm trang, bài test, chức năng…" aria-label="Tìm trang và chức năng trong MOSAIC" role="combobox" aria-autocomplete="list" aria-expanded={focused} aria-controls={`${id}-results`} aria-activedescendant={focused && active >= 0 && suggestions[active] ? `${id}-option-${active}` : undefined}
        onKeyDown={event => {
          if (event.key === 'Escape') { event.preventDefault(); setFocused(false); setActive(-1); }
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault(); setFocused(true);
            if (!suggestions.length) return;
            setActive(current => event.key === 'ArrowDown' ? (current+1) % suggestions.length : (current <= 0 ? suggestions.length-1 : current-1));
          }
        }} />
    </form>
    {focused && <div className={`${styles.searchMenu} ${styles.expandedSearchMenu}`}>
      <p className={styles.searchMenuHeading}>{query.trim() ? `${matches.length} kết quả · gợi ý nhanh` : 'Trang & chức năng thường dùng'}</p>
      <div role="listbox" id={`${id}-results`} aria-label="Kết quả tìm kiếm" className={styles.searchOptions}>
        {suggestions.map((item,index) => <button role="option" type="button" key={`${item.href}-${item.label}`} id={`${id}-option-${index}`} aria-selected={active === index} className={active === index ? styles.searchOptionActive : ''} onMouseDown={event => event.preventDefault()} onMouseEnter={() => setActive(index)} onClick={() => navigate(item.href)}><strong>{item.label}</strong><small>{item.category} · {item.description}</small></button>)}
      </div>
      {!matches.length && <p className={styles.searchNoResults}>Chưa tìm thấy trang phù hợp. Thử “test AI”, “bản nháp”, “Ni” hoặc “biểu đồ”.</p>}
      <button type="button" className={styles.searchAllResults} onClick={() => navigate(resultsHref)}>Xem {query.trim() ? `tất cả ${matches.length} kết quả` : 'tất cả trang'} →</button>
    </div>}
  </div>;
}
