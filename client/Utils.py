from random import randint
import time, datetime, jwt

def generate_filename(prefix, suffix):
    time_stamp = datetime.datetime.fromtimestamp(time.time()).strftime('%m-%d-%Y-%H-%M-%S')
    return prefix + "-" + str(randint(100000000, 999999999)) + "-" + str(time_stamp) + suffix

def generate_signed_token(data, key, expiry):
    data["exp"] = datetime.datetime.utcnow() + datetime.timedelta(seconds=expiry)
    print str(data)
    return jwt.encode(data, key, algorithm='HS256')
