import sys
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

nltk.download(' ')
nltk.download('stopwords')
nltk.download('wordnet')

def preprocess_text(text):
    stop_words = set(stopwords.words("english"))
    lemmatizer = WordNetLemmatizer()
    words = word_tokenize(text.lower())
    words = [lemmatizer.lemmatize(word) for word in words if word.isalnum()]
    words = [word for word in words if word not in stop_words]
    return ' '.join(words)

def calculate_similarity(text1, text2):
    # Tiền xử lý văn bản
    processed_text1 = preprocess_text(text1) # đáp án giáo viên
    processed_text2 = preprocess_text(text2) # đáp án học sinh

    # Nếu đáp án học sinh có độ dài nhỏ hơn 3 trả về 100% hoặc 0%
    if len(processed_text1.split()) <= 2 and len(processed_text2.split()) <= 3:
        return 100.0 if processed_text1 == processed_text2 else 0.0

    # Nếu không, thực hiện so sánh cosine similarity bình thường
    else:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity

        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([processed_text1, processed_text2])
        similarity_score = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])
        return round(similarity_score[0][0] * 100,2)

text1 = sys.argv[1]
text2 = sys.argv[2]

similarity_percentage = calculate_similarity(text1, text2)
print(similarity_percentage)
