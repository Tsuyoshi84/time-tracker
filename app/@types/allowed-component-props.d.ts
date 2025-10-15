import 'vue'

declare module 'vue' {
	interface AllowedComponentProps {
		'aria-errormessage'?: string
		'aria-label'?: string
		'aria-checked'?: boolean
		autocomplete?: string
		autofocus?: boolean
		dataTestid?: string
		disabled?: boolean
		id?: string
		name?: string
		placeholder?: string
		readonly?: boolean
		required?: boolean
		role?: string
		tabindex?: number
		title?: string

		// Events
		onClick?: (event: MouseEvent) => void
		onBlur?: (event: FocusEvent) => void
		onFocus?: (event: FocusEvent) => void
		onKeyup?: (event: KeyboardEvent) => void
	}
}
