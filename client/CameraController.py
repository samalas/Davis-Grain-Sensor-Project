import os
import numpy as np
from PIL import Image

def save_image(img_arr, path):
    img = Image.fromarray(img_arr)
    img.save(path)

def crop_image(img_arr, crop_guides=(0, 0, 500, 500)):
    img = Image.fromarray(img_arr)
    img = img.crop(crop_guides)
    img.save("tmp/_00.jpg")
    return np.array(img)

def take_picture():
    os.system("/home/pi/webcam.sh")
    img = Image.open("example.jpg")
    return np.array(img)

def take_picture_dummy():
    img = Image.open("sample_imgs/example.jpg")
    return np.array(img)

if __name__ == "__main__":
    print str(take_picture())
