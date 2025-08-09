import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend expect with jest-dom matchers
expect.extend(matchers)

// Type declarations for the matchers
declare module 'vitest' {
	interface Assertion<T = any> extends jest.Matchers<void>, import('@testing-library/jest-dom/matchers').TestingLibraryMatchers<T, void> {}
}