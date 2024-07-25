import React, { Dispatch, FC, SetStateAction } from "react";
import { DateRangePicker } from "rsuite";
import subDays from 'date-fns/subDays';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import addDays from 'date-fns/addDays';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';
import { RangeType } from "rsuite/esm/DateRangePicker";
import { DateRange } from "rsuite/esm/DateRangePicker";
import { useTranslation } from 'react-i18next';

interface DatePickerCompProps {
    dateValue: DateRange | null;
    setdateValue: (value: DateRange | null, event: React.SyntheticEvent) => void;
}

const DatePickerComp: FC<DatePickerCompProps> = ({ dateValue, setdateValue }) => {
    const { t } = useTranslation();

    const predefinedRanges: RangeType<DateRange>[] = [
        {
            label: t('datePicker.today'),
            value: [new Date(), new Date()],
            placement: 'left'
        },
        {
            label: t('datePicker.yesterday'),
            value: [addDays(new Date(), -1), addDays(new Date(), -1)],
            placement: 'left'
        },
        {
            label: t('datePicker.thisWeek'),
            value: [startOfWeek(new Date()), endOfWeek(new Date())],
            placement: 'left'
        },
        {
            label: t('datePicker.lastWeek'),
            closeOverlay: false,
            value: value => {
                const [start = new Date()] = value || [];
                return [
                    addDays(startOfWeek(start, { weekStartsOn: 0 }), -7),
                    addDays(endOfWeek(start, { weekStartsOn: 0 }), -7)
                ];
            },
            placement: 'left'
        },
        {
            label: t('datePicker.nextWeek'),
            closeOverlay: false,
            value: value => {
                const [start = new Date()] = value || [];
                return [
                    addDays(startOfWeek(start, { weekStartsOn: 0 }), 7),
                    addDays(endOfWeek(start, { weekStartsOn: 0 }), 7)
                ];
            },
            placement: 'left',
        },
        {
            label: t('datePicker.last7Days'),
            value: [subDays(new Date(), 6), new Date()],
            placement: 'left'
        },
        {
            label: t('datePicker.last30Days'),
            value: [subDays(new Date(), 29), new Date()],
            placement: 'left'
        },
        {
            label: t('datePicker.thisMonth'),
            value: [startOfMonth(new Date()), new Date()],
            placement: 'left'
        },
        {
            label: t('datePicker.lastMonth'),
            value: [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1))],
            placement: 'left'
        },
        {
            label: t('datePicker.thisYear'),
            value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
            placement: 'left'
        },
        {
            label: t('datePicker.lastYear'),
            value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear(), 0, 0)],
            placement: 'left'
        },
        {
            label: t('datePicker.allTime'),
            value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
            placement: 'left'
        },
    ];

    return (
        <div className="mt-2">
            <DateRangePicker
                value={dateValue}
                onChange={setdateValue}
                placeholder={t('datePicker.placeholder')}
                ranges={predefinedRanges}
                format="dd/MM/yyyy"
            />
        </div>
    );
};

export default DatePickerComp;
