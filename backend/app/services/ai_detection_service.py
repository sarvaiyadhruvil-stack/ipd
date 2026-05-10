import re
import math
from app.services.text_processing_service import (
    split_into_sentences, count_words, get_unique_words_ratio,
    calculate_entropy, get_stopword_ratio, get_structural_score
)


# Expanded list of phrases heavily used by LLMs
AI_TRANSITION_PHRASES = [
    "furthermore", "moreover", "additionally", "in conclusion", 
    "it is important to note", "overall", "in today's world", "therefore",
    "conversely", "subsequently", "it is worth noting", "crucial to consider",
    "on the other hand", "to summarize", "delving deeper", "in essence",
    "first and foremost", "a testament to", "the realm of", "notably",
    "ultimately", "as mentioned earlier", "it goes without saying",
    "foster", "tap into", "unleash", "embark", "navigate", "landscape",
    "vibrant", "dynamic", "evolving", "leverage", "delve", "pivotal", "underscores",
    "tapestry", "shiver", "echoes", "interplay", "multifaceted", "paradigm shift"
]

# Prompts leakage indicators
PROMPT_LEAKAGES = [
    "as an ai language model",
    "certainly, here is",
    "i hope this helps",
    "let me know if you need",
    "here is the revised version",
    "i am an ai",
    "sure, i can help",
    "i cannot fulfill this request",
    "my training data",
    "knowledge cutoff",
    "as of my last update"
]

def analyze_text(text: str):
    words_count = count_words(text)
    if words_count < 20:
        return {"error": "Text is too short for reliable AI detection. Minimum 20 words required."}

    sentences = split_into_sentences(text)
    if not sentences:
        # Fallback if splitting fails but text exists
        sentences = [text]

    explanations = []
    leakages = []

    # Initialize AI Score
    ai_score = 0.0

    lower_text = text.lower()

    # 1. Prompt Leakage (Critical Flag)
    for leak in PROMPT_LEAKAGES:
        if leak in lower_text:
            leakages.append(f"Prompt leakage found: '{leak}'")

    if leakages:
        ai_score += 60
        explanations.append("Critical: Contains phrases typical of AI conversational output (prompt leakage).")

    # 2. Transition Phrase Density
    transition_count = 0
    found_phrases = []
    for phrase in AI_TRANSITION_PHRASES:
        # Use regex to find whole phrases only
        matches = re.findall(r'\b' + re.escape(phrase) + r'\b', lower_text)
        if matches:
            transition_count += len(matches)
            found_phrases.append(phrase)

    transition_density = transition_count / (words_count / 100) if words_count > 0 else 0
    if transition_density > 2.5:
        ai_score += 30
        explanations.append(f"Very high density of AI-favored transition words ({transition_count} instances).")
    elif transition_density > 1.5:
        ai_score += 20
        explanations.append(f"High density of common AI transition words ({transition_count} instances).")
    elif transition_density > 0.8:
        ai_score += 10

    # 3. Burstiness (Sentence length variation)
    sentence_lengths = [count_words(s) for s in sentences]
    avg_length = sum(sentence_lengths) / len(sentence_lengths) if sentences else 0
    
    if len(sentence_lengths) > 1:
        variance = sum((l - avg_length) ** 2 for l in sentence_lengths) / (len(sentence_lengths) - 1)
        std_dev = math.sqrt(variance)
    else:
        std_dev = 0

    # Humans tend to mix very short and very long sentences. AI writes uniformly.
    if std_dev < 4.0: # Extremely uniform
        ai_score += 35
        explanations.append(f"Extremely uniform sentence structure (Burstiness StdDev: {std_dev:.2f}). This is a strong AI indicator.")
    elif std_dev < 7.0: # Very uniform
        ai_score += 20
        explanations.append(f"Low sentence length variation (Burstiness StdDev: {std_dev:.2f}). Typical of AI text.")
    elif std_dev > 12.0:
        ai_score -= 15 # High burstiness points towards human
        explanations.append(f"High sentence length variation (Burstiness StdDev: {std_dev:.2f}), which is more characteristic of human writing.")

    # 4. Vocabulary diversity (Unique words ratio)
    vocab_diversity = get_unique_words_ratio(text)
    if vocab_diversity < 0.40:
        ai_score += 25
        explanations.append(f"Very low vocabulary diversity ({vocab_diversity:.2%} unique words). Indicates repetitive generation patterns.")
    elif vocab_diversity < 0.55:
        ai_score += 10
    elif vocab_diversity > 0.70:
        ai_score -= 15 # Very diverse vocab points towards human

    # 5. Stopword Ratio (AI is very highly structured and grammatical)
    stopword_ratio = get_stopword_ratio(text)
    if 0.45 <= stopword_ratio <= 0.60:
        ai_score += 15
        explanations.append(f"Highly structured grammatical pattern (Stopword ratio: {stopword_ratio:.2%}), common in LLM outputs.")
    elif stopword_ratio > 0.60:
        ai_score += 20

    # 6. Character Entropy (Predictability)
    entropy = calculate_entropy(text)
    if entropy < 4.1:
        ai_score += 20
        explanations.append(f"Low character entropy ({entropy:.2f}). Text content is highly predictable.")

    # 7. Complexity check (Simple heuristic for "perfect" balance)
    # AI often has a very "clean" word count to sentence count ratio
    words_per_sentence = words_count / len(sentences) if sentences else 0
    if 18 <= words_per_sentence <= 24:
        ai_score += 10 # AI "sweet spot"

    # 8. Structural Score (Lists/Bullets)
    struct_score = get_structural_score(text)
    if struct_score > 0.3: # More than 30% lines start with list markers
        ai_score += 15
        explanations.append(f"Highly structured list-based content (Structural score: {struct_score:.2f}).")

    # Base adjustments & Cap score
    final_score = ai_score + 5 # Base probability shift

    
    # Sigmoid-like capping to avoid 100% or 0% unless prompt leakage
    if not leakages:
        final_score = min(final_score, 94)
    
    final_score = min(max(final_score, 1), 99) 
    
    # Sentence level analysis
    sentence_analysis = []
    for s in sentences:
        s_lower = s.lower()
        s_reasons = []
        s_risk = 10 # Base risk
        
        # Check transitions in sentence
        for t in AI_TRANSITION_PHRASES:
            if re.search(r'\b' + re.escape(t) + r'\b', s_lower):
                s_risk += 30
                s_reasons.append(f"AI phrase: '{t}'")
        
        # Check leakages in sentence
        for l in PROMPT_LEAKAGES:
            if l in s_lower:
                s_risk += 80
                s_reasons.append(f"Direct AI leakage: '{l}'")
        
        # Sentence length check
        s_len = count_words(s)
        if 16 <= s_len <= 26:
            s_risk += 10
        elif s_len < 6 or s_len > 45:
            s_risk -= 15 # Human-like variance

        s_risk = min(max(s_risk, 2), 98)
        
        risk_level = "low"
        if s_risk >= 75:
            risk_level = "high"
        elif s_risk >= 45:
            risk_level = "medium"

        sentence_analysis.append({
            "sentence": s,
            "ai_probability": round(s_risk, 1),
            "human_probability": round(100 - s_risk, 1),
            "risk_level": risk_level,
            "reasons": s_reasons if s_reasons else ["Natural flow"]
        })

    confidence = "Medium"
    if words_count > 400:
        confidence = "High"
    elif words_count < 100:
        confidence = "Low"

    reliability = min(words_count // 3, 98)

    if not explanations and final_score < 40:
        explanations.append("Text exhibits natural variance, diverse vocabulary, and irregular sentence structures consistent with human writing.")

    return {
        "ai_probability": round(final_score, 1),
        "human_probability": round(100 - final_score, 1),
        "confidence_level": confidence,
        "reliability_score": reliability,
        "explanations": explanations,
        "prompt_leakage_flags": leakages,
        "sentence_analysis": sentence_analysis
    }

