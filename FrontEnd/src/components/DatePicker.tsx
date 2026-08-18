import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { formatDateLocal } from '../utils/date'
import './DatePicker.css'

interface DatePickerProps {
    value: string
    onChange: (value: string) => void
    minDate: string
    maxDate: string
    placeholder?: string
}

export default function DatePicker({ value, onChange, minDate, maxDate, placeholder = "dd/mm/aaaa" }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
    const containerRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dayOfWeek = today.getDay()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - dayOfWeek)

    const days: Date[] = []
    for (let i = 0; i < 35; i++) {
        const d = new Date(startDate)
        d.setDate(startDate.getDate() + i)
        days.push(d)
    }

    const getMonthsHeader = () => {
        const months = new Set<string>()
        const years = new Set<number>()
        const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' })

        days.forEach(d => {
            months.add(formatter.format(d))
            years.add(d.getFullYear())
        })

        const monthsArr = Array.from(months).map(m => m.charAt(0).toUpperCase() + m.slice(1))
        const yearsArr = Array.from(years)

        if (yearsArr.length > 1) {
            return `${monthsArr[0]} ${yearsArr[0]} / ${monthsArr[1]} ${yearsArr[1]}`
        }
        return `${monthsArr.join(' / ')} ${yearsArr[0]}`
    }

    const getDisplayValue = () => {
        if (!value) return ""
        const parts = value.split('-')
        if (parts.length !== 3) return value
        const [year, month, day] = parts
        return `${day}/${month}/${year}`
    }

    const handleOpen = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            setDropdownPos({
                top: rect.bottom + window.scrollY + 6,
                left: rect.left + window.scrollX,
                width: rect.width,
            })
        }
        setIsOpen(prev => !prev)
    }

    useEffect(() => {
        if (!isOpen) return
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node
            const insideContainer = containerRef.current?.contains(target)
            const insideDropdown = dropdownRef.current?.contains(target)
            if (!insideContainer && !insideDropdown) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    const handleSelectDay = (dateStr: string) => {
        onChange(dateStr)
        setIsOpen(false)
    }

    const handleClear = () => {
        onChange("")
        setIsOpen(false)
    }

    const handleSelectToday = () => {
        const todayStr = formatDateLocal(new Date())
        if (todayStr >= minDate && todayStr <= maxDate) {
            onChange(todayStr)
        }
        setIsOpen(false)
    }

    const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

    return (
        <div className="datePickerContainer" ref={containerRef}>
            <div className="datePickerInputWrapper" onClick={handleOpen}>
                <input
                    type="text"
                    className="data datePickerInput"
                    placeholder={placeholder}
                    value={getDisplayValue()}
                    readOnly
                />
                <span className="calendarIcon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM5 7V6h14v1zm7 5H7v2h5v-2zm4 0h-2v2h2v-2zm-4 4H7v2h5v-2zm4 0h-2v2h2v-2z" />
                    </svg>
                </span>
            </div>

            {isOpen && createPortal(
                <>
                    <div className="datePickerOverlay" onClick={() => setIsOpen(false)} />
                    <div
                        className="datePickerDropdown"
                        ref={dropdownRef}
                        style={{
                            position: 'absolute',
                            top: dropdownPos.top,
                            left: dropdownPos.left,
                            width: dropdownPos.width,
                        }}
                    >
                        <div className="datePickerHeader">
                            <span className="datePickerHeaderTitle">{getMonthsHeader()}</span>
                        </div>

                        <div className="datePickerWeekdays">
                            {weekDays.map((wd, index) => (
                                <div key={index} className="datePickerWeekday">
                                    {wd}
                                </div>
                            ))}
                        </div>

                        <div className="datePickerGrid">
                            {days.map((d, index) => {
                                const dateStr = formatDateLocal(d)
                                const isValid = dateStr >= minDate && dateStr <= maxDate
                                const isSelected = dateStr === value
                                const isToday = dateStr === formatDateLocal(new Date())

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={!isValid}
                                        onClick={() => handleSelectDay(dateStr)}
                                        className={`datePickerDay ${isSelected ? 'datePickerDay--selected' : ''} ${isToday ? 'datePickerDay--today' : ''} ${!isValid ? 'datePickerDay--disabled' : ''}`}
                                    >
                                        {d.getDate()}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="datePickerFooter">
                            <button type="button" className="datePickerFooterBtn" onClick={handleClear}>
                                Limpar
                            </button>
                            <button type="button" className="datePickerFooterBtn" onClick={handleSelectToday}>
                                Hoje
                            </button>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </div>
    )
}
