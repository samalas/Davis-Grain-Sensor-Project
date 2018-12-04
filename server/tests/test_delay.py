import requests, json

if __name__ == "__main__":
    numMinutes = 30
    useAWSServer = False

    # Do not edit below this line

    r = None
    delay = None
    if useAWSServer:
        r = requests.post("https://ec2-54-193-12-115.us-west-1.compute.amazonaws.com/api/setBroadcastDelay", data={"delay" : str(numMinutes * 60 * 1000)}, verify=False)
        _r = requests.get("https://ec2-54-193-12-115.us-west-1.compute.amazonaws.com/api/getBroadcastDelay", verify=False)
        delay = json.loads(_r.text)["delay"]
    else:
        r = requests.post("https://localhost:443/api/setBroadcastDelay", data={"delay" : str(numMinutes * 60 * 1000)}, verify=False)
        _r = requests.get("https://localhost:443/api/getBroadcastDelay", verify=False)
        delay = json.loads(_r.text)["delay"]

    print str(r.status_code) + " - " + str(r.reason)
    print "Current delay: " + str(int(float(delay) / 1000.0 / 60.0)) + " minutes"
