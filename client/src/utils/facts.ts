// Import necessary APIs and libraries
import { FACT_API, unsplash } from './apis'
import { monthDayFormatted } from './dateUtils'

// Function to extract relevant keywords from the text
function extractRelevantKeywords(text: string): string[] {
	const stopwords: string[] = [
		'the',
		'in',
		'on',
		'at',
		'of',
		'and',
		'a',
		'to',
		'for',
		'with',
		'is',
		'was',
		'were',
		'by',
		'as',
		'an',
		'are',
		'this',
		'that',
		'it',
		'from',
		'be',
		'have',
		'has',
		'had',
		'do',
		'did',
		'but',
		'about',
		'not',
		'or',
		'if',
		'they',
		'their',
		'them',
		'been',
		'can',
		'all',
		'any',
		'will',
		'also',
		'your',
		'you',
		'I',
		'my',
		'me',
		'we',
		'our',
		'us',
		'he',
		'she',
		'him',
		'her',
		'his',
		'hers',
		'its',
		'who',
		'whom',
		'which',
		'what',
		'where',
		'when',
		'why',
		'how',
	]

	let words =
		text.match(/\b(\w+)\b/g)?.filter((word) => {
			return (
				/^[A-Z]/.test(word) &&
				!stopwords.includes(word.toLowerCase()) &&
				/^[a-zA-Z]+$/.test(word)
			)
		}) || []
	// Sort by word length or another criterion indicating relevance
	words.sort((a, b) => b.length - a.length)

	// Return the top 3 words
	return words.slice(0, 3)
}

// Main function to fetch a random fact and an associated image
interface UnsplashPhoto {
	urls: {
		regular: string
	}
}

interface UnsplashResponse {
	response: {
		results: UnsplashPhoto[]
	}
}

interface FactResponse {
	date: string
	text: string
	year: string
	image: string
	error: string
}

export const fetchRandomFact = async (n: number): Promise<FactResponse> => {
	try {
		const res = await fetch(`${FACT_API}/${monthDayFormatted}`)
		const result = await res.json()
		const {
			date,
			data: { Events },
		} = result
		const firstEvent = Events[n]
		if (!firstEvent) {
			throw new Error('Event not found')
		}
		const { year, text } = firstEvent

		const keywords = extractRelevantKeywords(text)
		const query = keywords.join(' ')

		const unsplashResponse = (await unsplash.search.getPhotos({
			query: query,
			page: 1,
			perPage: 1,
		})) as UnsplashResponse

		const image =
			unsplashResponse.response.results[0]?.urls.regular ||
			'defaultImageURL' // Fallback image URL

		return { date, text, year, image, error: '' }
	} catch (error) {
		return {
			error: 'Something Went Wrong! Please check internet connection or refresh!',
			date: '',
			text: '',
			year: '',
			image: '', // TODO: Add default image URL
		}
	}
}
