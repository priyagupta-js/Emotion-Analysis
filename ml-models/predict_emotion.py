import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# predict.py
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # 0 = all logs, 3 = only fatal errors

import warnings
warnings.filterwarnings("ignore")

import numpy as np
import pickle
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import re
import sys

# ================
# Load All Assets
# ================

model = load_model(os.path.join(BASE_DIR, "lstm_emotion_model.h5"))

with open(os.path.join(BASE_DIR, "tokenizer.pkl"), "rb") as f:
    tokenizer = pickle.load(f)

with open(os.path.join(BASE_DIR, "label_encoder.pkl"), "rb") as f:
    label_encoder = pickle.load(f)

with open(os.path.join(BASE_DIR, "max_len.pkl"), "rb") as f:
    max_len = pickle.load(f)

# ================
# Text Cleaning
# ================

def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+|@\w+|#\w+", "", text)  # Remove URLs, mentions, hashtags
    text = re.sub(r"[^\w\s']", "", text)  # Keep only words and apostrophes
    text = re.sub(r"\d+", "", text)  # Remove numbers
    return re.sub(r"\s+", " ", text).strip()

# ================
# Prediction
# ================

def predict_emotion(text):
    text_clean = clean_text(text)

    if not text_clean:
        return "⚠️ Please enter a valid sentence.", None

    seq = tokenizer.texts_to_sequences([text_clean])
    padded = pad_sequences(seq, maxlen=max_len, padding='post')
    pred = model.predict(padded, verbose=0)

    pred_idx = np.argmax(pred)
    emotion = label_encoder.inverse_transform([pred_idx])[0]
    confidence = float(pred[0][pred_idx])

    return emotion, confidence

# ================
# CLI Entry Point
# ================

if __name__ == "__main__":
    try:
        user_input = sys.argv[1]
        emotion, confidence = predict_emotion(user_input)

        if confidence:
            print(f"{emotion},{confidence}")
        else:
            print("Invalid,0.0")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error: {e}")
        sys.exit(1)
