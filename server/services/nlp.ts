import { storage } from "../storage";
import type { JournalEntry } from "@shared/schema";

// Simple NLP analysis using keyword extraction
export async function analyzeJournalEntry(entry: JournalEntry): Promise<void> {
  try {
    const fullText = `${entry.enjoyed || ''} ${entry.challenges || ''} ${entry.learned || ''}`.toLowerCase();
    
    const keywords = extractKeywords(fullText);
    const themes = extractThemes(fullText);
    const skills = extractSkills(fullText);
    
    await storage.updateJournalEntryAnalysis(entry.id, keywords, themes, skills);
  } catch (error) {
    console.error("Error analyzing journal entry:", error);
  }
}

function extractKeywords(text: string): string[] {
  // Remove common stop words and extract meaningful words
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'were', 'will', 'with', 'i', 'me', 'my', 'myself',
    'we', 'us', 'our', 'you', 'your', 'have', 'had', 'do', 'does',
    'did', 'can', 'could', 'should', 'would', 'may', 'might'
  ]);

  const words = text
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word))
    .slice(0, 10); // Limit to top 10 keywords

  return Array.from(new Set(words)); // Remove duplicates
}

function extractThemes(text: string): string[] {
  const themes = [];
  
  // Career-related themes
  const careerPatterns = {
    'creativity': /creat|design|art|draw|paint|music|write|imagination/i,
    'technology': /code|program|computer|tech|digital|software|app|web/i,
    'leadership': /lead|manage|organize|team|group|direct|coordinate/i,
    'helping': /help|assist|support|care|volunteer|community|service/i,
    'problem_solving': /solve|fix|challenge|puzzle|analyze|think|logic/i,
    'communication': /talk|speak|present|explain|teach|share|discuss/i,
    'learning': /learn|study|research|discover|explore|understand/i,
    'collaboration': /team|group|together|cooperate|work with|collaborate/i,
  };

  for (const [theme, pattern] of Object.entries(careerPatterns)) {
    if (pattern.test(text)) {
      themes.push(theme);
    }
  }

  return themes;
}

function extractSkills(text: string): string[] {
  const skills = [];
  
  const skillPatterns = {
    'programming': /code|program|javascript|python|html|css|react|node/i,
    'design': /design|photoshop|illustrator|figma|sketch|ui|ux/i,
    'writing': /write|blog|article|story|content|copy/i,
    'analysis': /analyze|data|research|investigate|examine/i,
    'presentation': /present|speak|pitch|demonstrate|show/i,
    'project_management': /organize|plan|schedule|coordinate|manage/i,
    'customer_service': /customer|client|service|support|help/i,
    'sales': /sell|sales|market|promote|advertise/i,
    'teaching': /teach|tutor|mentor|explain|instruct/i,
    'leadership': /lead|manage|supervise|direct|guide/i,
  };

  for (const [skill, pattern] of Object.entries(skillPatterns)) {
    if (pattern.test(text)) {
      skills.push(skill);
    }
  }

  return skills;
}
