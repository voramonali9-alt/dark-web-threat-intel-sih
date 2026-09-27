from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

class StylometryEngine:
    def __init__(self):
        # We use TF-IDF which captures n-grams (words and phrases)
        # This acts as our "AI Stylometric Profiler" mentioned in the PPT
        self.vectorizer = TfidfVectorizer(analyzer='word', ngram_range=(1, 3))
    
    def analyze_posts(self, json_filepath):
        print("Loading dark web forum data...")
        try:
            with open(json_filepath, 'r') as f:
                data = json.load(f)
        except FileNotFoundError:
            print("Data file not found. Please run data_generator.py first.")
            return []

        posts = data.get("forum_posts", [])
        
        # Group posts by author handle
        corpus_by_author = {}
        for post in posts:
            handle = post["author_handle"]
            if handle not in corpus_by_author:
                corpus_by_author[handle] = []
            corpus_by_author[handle].append(post["content"])
            
        # Combine all posts for a single author into one document for profiling
        authors = list(corpus_by_author.keys())
        documents = [" ".join(corpus_by_author[author]) for author in authors]
        
        print(f"Extracting stylometric features for {len(authors)} threat actors...")
        if not documents:
            return []
            
        # Transform the text into mathematical vectors
        tfidf_matrix = self.vectorizer.fit_transform(documents)
        
        # Calculate cosine similarity between all authors
        similarity_matrix = cosine_similarity(tfidf_matrix)
        
        # Find matches (High Confidence > 85%)
        matches = []
        for i in range(len(authors)):
            for j in range(i + 1, len(authors)):
                confidence = similarity_matrix[i][j]
                if confidence > 0.85:
                    matches.append({
                        "handle_1": authors[i],
                        "handle_2": authors[j],
                        "confidence_score": round(confidence * 100, 2)
                    })
                    
        return matches, data.get("entities", [])

if __name__ == "__main__":
    # Test the engine locally
    engine = StylometryEngine()
    matches, entities = engine.analyze_posts("../darkweb_mock_data.json")
    print("\n--- AI Stylometry Results ---")
    for match in matches:
        print(f"[MATCH] {match['handle_1']} and {match['handle_2']} might be the same person! (Confidence: {match['confidence_score']}%)")
