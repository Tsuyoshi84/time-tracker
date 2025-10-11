import { CalendarDate } from '@internationalized/date'
import type { DateString } from '~/types/index.ts'

export function dateStringToCalendarDate(dateString: DateString): CalendarDate {
	const [year, month, day] = dateString.split('-').map(Number)

	if (year === undefined || month === undefined || day === undefined) {
		throw new Error('Invalid date string format')
	}

	return new CalendarDate(year, month, day)
}
