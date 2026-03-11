from deepface import DeepFace
import numpy as np
from PIL import Image
from io import BytesIO


def bytes_to_image(image_bytes: bytes):
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    return np.array(image)


def generate_face_embedding(image_np):
    result = DeepFace.represent(
        img_path=image_np,
        model_name="Facenet",
        enforce_detection=True
    )

    return result[0]["embedding"]
