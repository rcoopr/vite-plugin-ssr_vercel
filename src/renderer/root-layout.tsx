import { StrictMode } from 'react'
import type { PageContext } from './types'
import './globals.css'
import { PageContextProvider } from '#/renderer/page-context'
// https://github.com/brillout/vite-plugin-ssr/blob/main/boilerplates/boilerplate-react-ts/renderer/Link.tsx

export function RootLayout({
	children,
	pageContext,
}: {
	children: React.ReactNode
	pageContext: PageContext
}) {
	return (
		<StrictMode>
			<PageContextProvider pageContext={pageContext}>
				{children}
			</PageContextProvider>
		</StrictMode>
	)
}
