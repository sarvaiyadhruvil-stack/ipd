import re
import math
import collections
from typing import List

STOP_WORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", 
    "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", 
    "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", 
    "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", 
    "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", 
    "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", 
    "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", 
    "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", 
    "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", 
    "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", 
    "your", "yours", "yourself", "yourselves"
}

def split_into_sentences(text: str) -> List[str]:
    # More robust regex for sentence splitting
    sentences = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!)\s', text.strip())
    return [s.strip() for s in sentences if len(s.strip()) > 5]

def count_words(text: str) -> int:
    return len(re.findall(r'\b\w+\b', text))

def get_unique_words_ratio(text: str) -> float:
    words = re.findall(r'\b\w+\b', text.lower())
    if not words:
        return 0.0
    return len(set(words)) / len(words)

def calculate_entropy(text: str) -> float:
    """Calculates Shannon entropy of characters. AI often has slightly lower entropy than human text."""
    if not text:
        return 0.0
    counter = collections.Counter(text)
    length = len(text)
    return -sum((count/length) * math.log2(count/length) for count in counter.values())

def get_stopword_ratio(text: str) -> float:
    """AI text is typically highly grammatical and utilizes a high ratio of structural stop words."""
    words = re.findall(r'\b\w+\b', text.lower())
    if not words:
        return 0.0
    stop_count = sum(1 for w in words if w in STOP_WORDS)
    return stop_count / len(words)

def get_structural_score(text: str) -> float:
    """Detects structural markers like bullet points and lists which are common in AI outputs."""
    lines = text.split('\n')
    bullet_count = sum(1 for line in lines if re.match(r'^\s*[\-\*\u2022\d+\.]', line.strip()))
    if not lines:
        return 0.0
    return bullet_count / len(lines)

