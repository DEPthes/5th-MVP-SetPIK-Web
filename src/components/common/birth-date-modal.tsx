import { useMemo, useState } from "react";
import chevronDownIcon from "@/assets/icons/ic_chevron_down.svg";
import "./birth-date-modal.css";

interface BirthDateModalProps {
  onClose: () => void;
  onComplete: (birthDate: string) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1900 + 1 }, (_, index) => CURRENT_YEAR - index);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);

function getDaysInMonth(year: string, month: string) {
  if (!year || !month) return 31;
  return new Date(Number(year), Number(month), 0).getDate();
}

export function BirthDateModal({ onClose, onComplete }: BirthDateModalProps) {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const dayOptions = useMemo(
    () => Array.from({ length: getDaysInMonth(year, month) }, (_, index) => index + 1),
    [month, year],
  );

  function handleYearChange(value: string) {
    setYear(value);
    if (day && Number(day) > getDaysInMonth(value, month)) setDay("");
  }

  function handleMonthChange(value: string) {
    setMonth(value);
    if (day && Number(day) > getDaysInMonth(year, value)) setDay("");
  }

  function handleComplete() {
    if (!year || !month || !day) return;
    onComplete(`${year}.${month.padStart(2, "0")}.${day.padStart(2, "0")}`);
  }

  return (
    <div
      className="birth-date-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="birth-date-modal-title"
        className="birth-date-modal"
        role="dialog"
        aria-modal="true"
      >
        <div className="birth-date-modal__heading">
          <h2 id="birth-date-modal-title">생년월일</h2>
        </div>
        <p className="birth-date-modal__description">생년월일 정보를 입력해주세요.</p>

        <div className="birth-date-modal__form">
          <div className="birth-date-modal__select-row">
            <BirthDateSelect label="연도" value={year} options={YEAR_OPTIONS} onChange={handleYearChange} />
            <BirthDateSelect label="월" value={month} options={MONTH_OPTIONS} onChange={handleMonthChange} />
            <BirthDateSelect label="일" value={day} options={dayOptions} onChange={setDay} />
          </div>
          <button className="birth-date-modal__complete" onClick={handleComplete} type="button">
            입력 완료
          </button>
        </div>

      </section>
    </div>
  );
}

interface BirthDateSelectProps {
  label: string;
  value: string;
  options: number[];
  onChange: (value: string) => void;
}

function BirthDateSelect({ label, value, options, onChange }: BirthDateSelectProps) {
  return (
    <label className="birth-date-modal__select">
      <select aria-label={label} onChange={(event) => onChange(event.target.value)} value={value}>
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <img src={chevronDownIcon} alt="" aria-hidden="true" />
    </label>
  );
}
