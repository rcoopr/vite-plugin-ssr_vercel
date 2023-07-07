import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import type { InjectFilterEntry } from 'vite-plugin-ssr/types'
import type { PageContextServer } from './types'
import { RootLayout } from '#/renderer/root-layout'

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = [
	'pageProps',
	'urlParsed',
	// 'urlPathname' // available when opted in to client navigation
]

export async function render(pageContext: PageContextServer) {
	let pageHtml = ''

	const { Page, pageProps } = pageContext

	// for SSR - https://vite-plugin-ssr.com/render-modes
	if (Page) {
		pageHtml = renderToString(
			<RootLayout pageContext={pageContext}>
				<Page {...pageProps} />
			</RootLayout>,
		)
	}

	// See https://vite-plugin-ssr.com/head
	const { documentProps } = pageContext.exports
	const title = (documentProps && documentProps.title) || 'D4 Calc'
	const desc =
		(documentProps && documentProps.description) ||
		'Diablo 4 Item comparison made simple'

	const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en" data-theme="d4">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="/d4.png" />
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=space-grotesk:300,400,500,600,700|space-mono:400,400i,700,700i"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <meta name="og:description" content="og description" />
        <meta name="theme-color" content="#f97316" />
        <meta name="og:site_name" content="site name" />
        <meta name="og:image:width" content="1200" />
        <meta name="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="og:image" content="${pageContext.og}" />
        <title>${title}</title>
      </head>
      <body>
      <div>${pageContext.urlOriginal}</div>
      <div>${pageContext.og}</div>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

	const injectFilter = (assets: InjectFilterEntry[]): void => {
		assets.forEach((asset) => {
			if (
				// We don't touch entry assets (recommended)
				asset.isEntry ||
				// We don't touch JavaScript preloading (recommended)
				asset.assetType === 'script'
			) {
				return
			}

			// Preload images
			if (asset.assetType === 'image') {
				asset.inject = 'HTML_BEGIN'
			}

			// Don't preload fonts
			if (asset.assetType === 'font') {
				asset.inject = false
			}
		})
	}

	return {
		documentHtml,
		injectFilter,
		pageContext: {
			// We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
		},
	}
}
