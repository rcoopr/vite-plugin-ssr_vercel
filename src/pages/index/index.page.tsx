import { PageContext } from '#/renderer/types'

const origin = import.meta.env.DEV
	? 'http://localhost:3000'
	: process.env.VERCEL_URL ?? ''

export function onBeforeRender(pageContext: PageContext) {
	console.log('onBeforeRender', pageContext.urlParsed)

	const og = pageContext.urlParsed?.searchOriginal
		? `${origin}/api/og${pageContext.urlParsed.searchOriginal}`
		: `${origin}/og`

	return {
		pageContext: {
			og: og,
		},
	}
}
