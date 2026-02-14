import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeUrl(url: string): Promise<{ title: string, content: string }> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000 // 10s timeout
    });
    
    const $ = cheerio.load(response.data);
    
    // Remove script, style, and other non-content elements
    $('script, style, nav, footer, iframe, header, aside').remove();
    
    const title = $('title').text().trim() || $('h1').first().text().trim() || "Untitled Article";
    
    // Try to find the main content
    let content = $('article').text().trim();
    if (!content || content.length < 100) {
      content = $('main').text().trim();
    }
    if (!content || content.length < 100) {
      // Fallback: get all paragraphs
      content = $('p').map((i, el) => $(el).text()).get().join('\n\n').trim();
    }
    
    return { title, content };
  } catch (error) {
    throw new Error(`Failed to scrape URL: ${error instanceof Error ? error.message : String(error)}`);
  }
}
