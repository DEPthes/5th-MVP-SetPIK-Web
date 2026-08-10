import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import closeIcon from "@/assets/icons/ic-close.svg";
import "./concert-filter-modal.css";
import {
  CONCERT_TYPE_FILTER_OPTIONS,
  DATE_FILTER_OPTIONS,
  type ConcertFilterState,
  getActiveFilterCount,
  REGION_FILTER_OPTIONS,
  type PaymentFilter,
} from "./concert-data";

interface ConcertFilterModalProps {
  initialFilters: ConcertFilterState;
  onApply: (filters: ConcertFilterState) => void;
  onFilterChange: (count: number) => void;
  onClose: () => void;
}

function toggleSelection(value: string, setValues: Dispatch<SetStateAction<string[]>>) {
  setValues((values) => (
    values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
  ));
}

export function ConcertFilterModal({ initialFilters, onApply, onFilterChange, onClose }: ConcertFilterModalProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(initialFilters.selectedDate);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(initialFilters.selectedRegions);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialFilters.selectedTypes);
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>(initialFilters.paymentFilter);
  const [onlySelectedArtists, setOnlySelectedArtists] = useState(initialFilters.onlySelectedArtists);

  function resetFilters() {
    setSelectedDate(null);
    setSelectedRegions([]);
    setSelectedTypes([]);
    setPaymentFilter("all");
    setOnlySelectedArtists(false);
  }

  useEffect(() => {
    onFilterChange(getActiveFilterCount({
      selectedDate,
      selectedRegions,
      selectedTypes,
      paymentFilter,
      onlySelectedArtists,
    }));
  }, [onFilterChange, onlySelectedArtists, paymentFilter, selectedDate, selectedRegions, selectedTypes]);

  return (
    <section aria-labelledby="concert-filter-title" className="concert-filter-modal" role="dialog">
      <header className="concert-filter-modal__header">
        <h2 id="concert-filter-title">필터</h2>
        <button aria-label="필터 닫기" className="concert-filter-modal__close" onClick={onClose} type="button">
          <img alt="" src={closeIcon} />
        </button>
      </header>

      <div className="concert-filter-modal__body">
        <FilterChipSection
          title="날짜"
          options={DATE_FILTER_OPTIONS}
          selectedValue={selectedDate}
          onSelect={setSelectedDate}
        />
        <FilterChipSection
          chipsClassName="concert-filter-modal__chips--regions"
          title="지역"
          options={REGION_FILTER_OPTIONS}
          selectedValues={selectedRegions}
          onSelect={(value) => toggleSelection(value, setSelectedRegions)}
          spaced
        />
        <FilterChipSection
          title="공연 유형"
          options={CONCERT_TYPE_FILTER_OPTIONS}
          selectedValues={selectedTypes}
          onSelect={(value) => toggleSelection(value, setSelectedTypes)}
          spaced
        />

        <section className="concert-filter-modal__section concert-filter-modal__section--spaced" aria-labelledby="concert-filter-payment-title">
          <h3 id="concert-filter-payment-title">유료 여부</h3>
          <div className="concert-filter-payment" role="group" aria-label="유료 여부">
            {(["all", "free", "paid"] as PaymentFilter[]).map((option) => (
              <button
                aria-pressed={paymentFilter === option}
                className={paymentFilter === option
                  ? "concert-filter-payment__option concert-filter-payment__option--selected"
                  : "concert-filter-payment__option"}
                key={option}
                onClick={() => setPaymentFilter(option)}
                type="button"
              >
                {{ all: "전체", free: "무료", paid: "유료" }[option]}
              </button>
            ))}
          </div>
        </section>

        <section className="concert-filter-artist-only">
          <span>선택한 아티스트가 출연하는 공연만 보기</span>
          <button
            aria-checked={onlySelectedArtists}
            aria-label="선택한 아티스트 출연 공연만 보기"
            className={onlySelectedArtists
              ? "concert-filter-switch concert-filter-switch--checked"
              : "concert-filter-switch"}
            onClick={() => setOnlySelectedArtists((value) => !value)}
            role="switch"
            type="button"
          >
            <i />
          </button>
        </section>
      </div>

      <footer className="concert-filter-modal__footer">
        <button className="concert-filter-modal__reset" onClick={resetFilters} type="button">
          초기화
        </button>
        <button
          className="concert-filter-modal__apply"
          onClick={() => onApply({ selectedDate, selectedRegions, selectedTypes, paymentFilter, onlySelectedArtists })}
          type="button"
        >
          필터 적용
        </button>
      </footer>
    </section>
  );
}

interface FilterChipSectionProps {
  title: string;
  options: string[];
  selectedValue?: string | null;
  selectedValues?: string[];
  onSelect: (value: string) => void;
  spaced?: boolean;
  chipsClassName?: string;
}

function FilterChipSection({
  title,
  options,
  selectedValue,
  selectedValues = [],
  onSelect,
  spaced = false,
  chipsClassName,
}: FilterChipSectionProps) {
  return (
    <section className={`concert-filter-modal__section${spaced ? " concert-filter-modal__section--spaced" : ""}`} aria-label={title}>
      <h3>{title}</h3>
      <div className={`concert-filter-modal__chips${chipsClassName ? ` ${chipsClassName}` : ""}`}>
        {options.map((option) => {
          const isSelected = selectedValue === option || selectedValues.includes(option);
          return (
            <button
              aria-pressed={isSelected}
              className={isSelected ? "concert-filter-chip concert-filter-chip--selected" : "concert-filter-chip"}
              key={option}
              onClick={() => onSelect(option)}
              type="button"
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}
