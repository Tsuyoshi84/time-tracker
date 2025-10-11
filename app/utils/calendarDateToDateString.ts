import type { CalendarDate } from '@internationalized/date'
import type { DateString } from '~/types/index.ts'

export function calendarDateToDateString(date: CalendarDate): DateString {
	return `${date.year}-${date.month}-${date.day}`
}
