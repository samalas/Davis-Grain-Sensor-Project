import signal, logging, logging.config, json, boto3, os, sys
import numpy as np
from ParticleCounter import preprocess, count_particles
from CameraController import take_picture, take_picture_dummy, save_image, crop_image
from socketIO_client import SocketIO, BaseNamespace
from PIL import Image
from Utils import generate_filename, generate_signed_token

s3 = None
s3_bucket = "davis-grain-sensor-project"
logger = logging.getLogger()
mask = np.array(Image.open("mask_330.png"))
response = {
    "success" : False,
    "command" : "",
    "callback" : "",
    "data" : None
}

def take_and_process_picture():
    img = take_picture() # TODO
    img = crop_image(img, crop_guides=(400, 415, 400 + 330, 415 + 330))

    filename = generate_filename("cropped-img", ".jpg")
    filepath = os.path.join("tmp", filename)
    save_image(img, filepath)

    s3.upload_file(filepath, s3_bucket, filename, ExtraArgs={'ACL' : 'public-read'})
    file_url = '%s/%s/%s' % (s3.meta.endpoint_url, s3_bucket, filename)
    logger.info("s3 upload url: " + str(file_url))

    img = preprocess(img, mask)
    data = {
        "num_particles" : count_particles(img),
        "file_url" : file_url
    }

    return data

class Namespace(BaseNamespace):

    def on_connect(self):
        logger.info("connected")

    def on_disconnect(self):
        logger.info("disconnected")
        os._exit(1) # force kill everything
        # sys.exit(0) # we do not want to reconnect

    def on_reconnect(self):
        logger.warn("reconnecting (this should not be happening :/)")

    def on_sensor_command(self, *args):
        payload = None

        try:
            logger.debug("command: " + str(args[0]))
            payload = json.loads(args[0])
        except Exception as e:
            logger.error("on sensor command error: " + str(e))
            return

        if payload["command"] == "take_and_process_picture":
            response["success"] = True
            response["data"] = take_and_process_picture()
            response["command"] = payload["command"]
            response["callback"] = payload["callback"]
            self.emit("sensor_command_response", json.dumps(response))
            logger.debug("sent response")

if __name__ == "__main__":
    logging.config.fileConfig("logging_config.ini")
    signal.signal(signal.SIGINT, signal.SIG_DFL)

    # TODO add a try catch here
    logger.info("ENV: " + os.environ['ENV'])

    descriptor_file = open("descriptor.json", "r")
    descriptor = json.loads(descriptor_file.read())
    descriptor_file.close()

    keychain_file = open("../keychain.json", "r")
    keychain = json.loads(keychain_file.read())
    keychain_file.close()

    s3 = boto3.client('s3', region_name='us-west-1', aws_access_key_id=keychain["s3key"], aws_secret_access_key=keychain["s3secret"])
    token = generate_signed_token(descriptor, keychain["jwtsecret"], keychain["jwtexpiry"])

    logger.info("client descriptor: " + str(descriptor))
    logger.info("client descriptor encoded: " + token)

    socketIO = None
    if os.environ['ENV'] == 'production':
        socketIO = SocketIO('https://ec2-13-57-183-220.us-west-1.compute.amazonaws.com/ws', 443, Namespace=Namespace, params={'token' : token}, verify=False)
    else:
        socketIO = SocketIO('https://127.0.0.1/ws', 443, Namespace=Namespace, params={'token' : token}, verify=False)

    logger.info("listening on port 443...")
    socketIO.wait() # listen forever
