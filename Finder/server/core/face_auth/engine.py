import cv2
import numpy as np
from mtcnn import MTCNN
from sklearn.metrics.pairwise import cosine_similarity
from keras_facenet import FaceNet

detector = MTCNN()
embedder = FaceNet()

def extract_embedding(image_path):
    img = cv2.imread(image_path)
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    faces = detector.detect_faces(rgb)

    if not faces:
        return None

    x, y, w, h = faces[0]['box']
    face = rgb[y:y+h, x:x+w]
    face = cv2.resize(face, (160, 160))

    embedding = embedder.embeddings([face])
    return embedding

def match_faces(emb1, emb2):
    return cosine_similarity(emb1, emb2)[0][0]
