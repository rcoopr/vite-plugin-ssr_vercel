import { createRoot, hydrateRoot } from 'react-dom/client'
import type { PageContextClient } from './types'
import { RootLayout } from '#/renderer/root-layout'

const rootId = 'root'

export async function render(pageContext: PageContextClient) {
	const { Page, pageProps } = pageContext

	if (!Page)
		throw new Error(
			'Client-side render() hook expects pageContext.Page to be defined',
		)

	const root = document.getElementById(rootId)

	if (!root)
		throw new Error(
			`Client-side render() hook expects root element with id #${rootId}`,
		)

	const page = (
		<RootLayout pageContext={pageContext}>
			<Page {...pageProps} />
		</RootLayout>
	)

	if (
		// We detect SPAs by using the fact that `innerHTML === ''` for the first render of an SPA
		root.innerHTML === '' ||
		// Upon Client Routing page navigation, vite-plugin-ssr sets `pageContext.isHydration`
		// to `false`.
		!pageContext.isHydration
	) {
		// - SPA pages don't have any hydration steps: they need to be fully rendered.
		// - Page navigation of SSR pages also need to be fully rendered (if we use Client Routing)
		createRoot(root).render(page)
	} else {
		// The first render of SSR pages is merely a hydration (instead of a full render)
		hydrateRoot(root, page)
	}
}

// export const clientRouting = true
export const hydrationCanBeAborted = true
/* To enable Client-side Routing:
// !! WARNING !! Before doing so, read https://vite-plugin-ssr.com/clientRouting */
