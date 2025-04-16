# Emotion-Analysis/ml-models/predict.py
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# predict.py
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # 0 = all logs, 3 = only fatal errors

import warnings
warnings.filterwarnings("ignore")

import sys
import numpy as np
import librosa
from tensorflow.keras.models import load_model
from gtts import gTTS

try:
    model = load_model(os.path.join(BASE_DIR, "cnn_mfcc_ser_improv_model.h5"))
except Exception as e:
    print("Model loading failed:", e)
    sys.exit(1)
    
emotion_labels = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad']

def extract_mfcc(file_path, max_pad_len=173):
    try:
        print(f"Trying to load: {file_path}")
        print(f"File exists: {os.path.exists(file_path)}, Size: {os.path.getsize(file_path)} bytes")
        audio, sr = librosa.load(file_path, sr=None)
        mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40)

        if mfccs.shape[1] < max_pad_len:
            pad_width = max_pad_len - mfccs.shape[1]
            mfccs = np.pad(mfccs, pad_width=((0, 0), (0, pad_width)), mode='constant')
        else:
            mfccs = mfccs[:, :max_pad_len]

        return mfccs
    except Exception as e:
        print("MFCC extraction error:", e)
        return None

def predict_emotion(file_path):
    mfcc = extract_mfcc(file_path)
    if mfcc is None:
        print("Feature extraction failed.")
        sys.exit(1)
    
    mfcc = mfcc[np.newaxis, ..., np.newaxis]  # (1, 40, 173, 1)
    pred = model.predict(mfcc)
    emotion = emotion_labels[np.argmax(pred)]
    print("Raw prediction:", pred)
    return emotion

def text_to_speech(text):
    try:
        output_path = os.path.join(BASE_DIR, "output.wav")
        tts = gTTS(text=text, lang='en')
        if os.path.exists(output_path):
            os.remove(output_path)
        tts.save(output_path)
    except Exception as e:
        print("TTS generation failed:", e)
        sys.exit(1)

if __name__ == "__main__":
    input_path = sys.argv[1]
    emotion = predict_emotion(input_path)
    print(f"Predicted: {emotion}")
    text_to_speech(f"The detected emotion is {emotion}")

