from PIL import Image, ImageFilter, ImageEnhance
from CameraController import take_picture, take_picture_dummy, crop_image
from scipy.cluster.vq import kmeans, vq
import trackpy as tp
import numpy as np
import skimage.measure

import matplotlib as mpl
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

debug = False

def darken_details(img_arr, threshold):
    # inspired by https://github.com/muratkrty/specularity-removal/blob/master/specularity.py
    win_size = (3, 3)
    img_arr_cpy = img_arr.copy()

    for r in xrange(0, len(img_arr)):
        for c in xrange(0, len(img_arr[0])):
            win = img_arr_cpy[r : r + win_size[0], c : c + win_size[1]]
            if win.shape[0] == win_size[0] and win.shape[1] == win_size[1]:
                if win[1, 1] < threshold:
                    img_arr[r : r + win_size[0], c : c + win_size[1]] = np.zeros(win_size, dtype=np.uint8)

def preprocess(img_arr, mask_arr):
    img = Image.fromarray(img_arr)
    img = ImageEnhance.Brightness(img).enhance(0.95)
    mask = Image.fromarray(mask_arr)

    img.paste(mask, (0, 0), mask) # apply circular mask

    img = ImageEnhance.Color(img).enhance(2)
    img.save("tmp/_0.jpg")

    roi = np.array(img)
    roi[:, :, [0, 2]] = 0 # extract green channel by setting all others to 0

    img = Image.fromarray(roi)
    img.save("tmp/_1.jpg")
    img = img.convert('L')
    img.save("tmp/_2.jpg")
    img = ImageEnhance.Contrast(img).enhance(1.1)
    img = ImageEnhance.Brightness(img).enhance(1.4)
    img = img.filter(ImageFilter.MedianFilter(size=7))
    img.save("tmp/_3.jpg")
    img = img.filter(ImageFilter.GaussianBlur(radius=3))
    img.save("tmp/_4.jpg")
    img = ImageEnhance.Contrast(img).enhance(1.07)
    img = ImageEnhance.Brightness(img).enhance(1.05)
    img.save("tmp/_5.jpg")
    img = img.filter(ImageFilter.UnsharpMask(radius=4.5, percent=200, threshold=2))
    img.save("tmp/_6.jpg")

    img_arr = np.array(img)
    darken_details(img_arr, 19)
    img = Image.fromarray(img_arr)
    img.save("tmp/_7.jpg")

    img = ImageEnhance.Brightness(img).enhance(4)
    img = ImageEnhance.Contrast(img).enhance(3)
    img.save("tmp/_8.jpg")
    img = img.filter(ImageFilter.GaussianBlur(radius=1.9))
    img.save("tmp/_9.jpg")
    img = img.filter(ImageFilter.UnsharpMask(radius=3.8, percent=110, threshold=2))
    img.save("tmp/_10.jpg")
    img = ImageEnhance.Brightness(img).enhance(3)
    img = ImageEnhance.Contrast(img).enhance(2)
    img.save("tmp/_11.jpg")
    img.paste(mask, (0, 0), mask)
    img = img.convert('L')
    img.save("tmp/_12.jpg")

    img_arr = np.array(img)
    # darken_details(img_arr, 20)
    # Image.fromarray(img_arr).save("tmp/_13.jpg")

    return img_arr

def count_particles(img_arr):

    num_particles = 0

    orig_img_arr = None
    if debug:
        orig_img_arr = np.array(Image.open("tmp/_0.jpg"))
        print str(orig_img_arr.shape)

    if debug:
        mpl.rc('figure',  figsize=(10, 6))
        mpl.rc('image', cmap='gray')
        fig, ax = plt.subplots(ncols=1, nrows=1)
        ax.imshow(orig_img_arr)

    label_img = skimage.measure.label(img_arr, background=255)
    for region in skimage.measure.regionprops(label_img, intensity_image=img_arr):
        if region.mean_intensity > 1 or region.eccentricity < 0.8 or region.area < 20:
            continue

        if debug:
            print "ecc: " + str(region.eccentricity)
            print "area: " + str(region.area)
            print "mean intensity: " + str(region.mean_intensity)

            minr, minc, maxr, maxc = region.bbox
            rect = mpatches.Rectangle((minc, minr), maxc - minc, maxr - minr, fill=False, edgecolor='red', linewidth=1)
            ax.add_patch(rect)

            # TODO process avg color
            slice = orig_img_arr[minr : maxr, minc : maxc, :]
            print str(slice.shape)
            print

        num_particles += 1

    if debug:
        plt.show()

    '''
    tracking = tp.locate(img_arr, 21, invert=True, minmass=1)
    # print str(tracking)

    eccs = tracking['ecc'].tolist()

    # TODO apply a sigmoid func or something here to normalize the values
    num_particles = 0
    for ecc in eccs:
        if ecc > 0.20:
            num_particles += 1


    mpl.rc('figure',  figsize=(10, 6))
    mpl.rc('image', cmap='gray')
    plt.figure()
    tp.annotate(tracking, img_arr)
    '''

    return num_particles

if __name__ == "__main__":
    mask = np.array(Image.open("mask_330.png"))

    img = take_picture()
    img = crop_image(img, crop_guides=(458, 468, 458 + 330, 468 + 330))
    img = preprocess(img, mask)

    print "Number of particles: " + str(count_particles(img))
