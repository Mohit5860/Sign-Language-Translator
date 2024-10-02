from tensorflow.keras.models import load_model
import mediapipe as mp
import numpy as np
import cv2

def extract_landmarks(frame):
    mp_holistic = mp.solutions.holistic
    holistic = mp_holistic.Holistic(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = holistic.process(rgb_frame)
    frame_landmarks = []

    if (results.left_hand_landmarks or results.right_hand_landmarks) and results.pose_landmarks:
        for landmark in results.pose_landmarks.landmark:
            frame_landmarks.extend([landmark.x, landmark.y, landmark.z])
        if results.left_hand_landmarks:
            for landmark in results.left_hand_landmarks.landmark:
                frame_landmarks.extend([landmark.x, landmark.y, landmark.z])
        else :
            frame_landmarks.extend([0,0,0]*21)
        if results.right_hand_landmarks :
            for landmark in results.right_hand_landmarks.landmark:
                frame_landmarks.extend([landmark.x, landmark.y, landmark.z])
        else :
            frame_landmarks.extend([0,0,0]* 21)

    holistic.close()
    
    frame_landmarks = np.array(frame_landmarks)
    return frame_landmarks

def smooth_predictions(predictions, threshold=10):
    smoothed_words = []
    current_word = None
    count = 0

    for word in predictions:
        if word == current_word:
            count += 1
        else:
            if count > threshold and current_word not in smoothed_words:
                smoothed_words.append(current_word)
            current_word = word
            count = 1

    if count > threshold:
        smoothed_words.append(current_word)

    return smoothed_words

def predict_sentence_from_video(video_file):
    model = load_model('model_training/models/model.keras')
    labels = np.load('django-backend/myapp/labels.npy')
    cap = cv2.VideoCapture(video_file)
    frames_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_predictions = []
    
    for i in range(frames_count):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i )
        success, frame = cap.read()

        if not success:
            break

        landmarks = extract_landmarks(frame)
        if len(landmarks) > 0 :
            landmarks = np.expand_dims(landmarks, axis=0)
            prediction = model.predict(landmarks)
            index  = np.argmax(prediction)
            predicted_word = labels[index]
            frame_predictions.append(predicted_word)

    cap.release()
    word_list = smooth_predictions(frame_predictions)
    sentence = " ".join(word_list)

    return sentence