# Choregraphe simplified export in Python.
from naoqi import ALProxy
import qi
import time
import sys
import server.gestures as g
from threading import Thread
import uuid
import random
import sys, signal

ip = "192.168.1.118"
port = 9559
black_img_src = "./server/black.png"
input_src = "./server/main_language_input.csv"
#input_src = "main_language_input.csv"
output_src = "./server/scifest_datalog.csv"
#output_src = "scifest_datalog.csv"

expand_rules = [("I've", "I have"), ("you've", "you have"), ("You've", "You have"),
            ("We've", "We have"), ("we've", "we have"), ("it's", "it is"),
            ("It's", "It is"), ("I'd", "I would"), ("you'd", "you would"),
            ("You'd", "You would"), ("we'd", "we would"), ("We'd", "We would"),
            ("We'd", "We would"), ("We'd", "We would"), ("I'm", "I am"),
            ("You're", "You are"), ("you're", "you are"), ("We're", "We are"),
            ("we're", "we are"), ("I'll", "I will"), ("you'll", "you will"),
            ("You'll", "You will"), ("we'll", "we will"), ("We'll", "We will"),
            ("He'll", "He will"), ("he'll", "he will"), 
            ("She'll", "She will"), ("she'll", "she will"),
            ("He'd", "He would"), ("he'd", "he would"), 
            ("She'd", "She would"), ("she'd", "she would"),
            ("He's", "He is"), ("he's", "he is"), 
            ("She's", "She is"), ("she's", "she is"),
            ("Hm", "Hum"), ("hm", "hum")] 


def signal_handler(signal, frame):
    print("\nprogram exiting gracefully")
    sys.exit(0)
    
class RobotConnector(object):
	
    def __init__(self, ip, port):
        """
        Initialisation of qi framework and event detection.
        """
        super(RobotConnector, self).__init__()
        connection_url = "tcp://" + ip + ":" + str(port)
        app = qi.Application(["RobotConnector", "--qi-url=" + connection_url])
        app.start()
        session = app.session
        # Get the service ALMemory.
        self.memory = session.service("ALMemory")
        self.motion = session.service("ALMotion")
        # Connect the event callback.
        self.subscriber = self.memory.subscriber("ALTextToSpeech/Status")
        self.subscriber.signal.connect(self.on_tts_status)
        self.speaking = True
        self.running = True
        
    def on_tts_status(self, value):
        """
        Callback for event FaceDetected.
        """
        if value[1] == "done":
            self.speaking = False

    def run(self):
        """
        Loop on, wait for events until manual interruption.
        """
        print ("Starting RobotConnector")

        while self.running:
            try:
                print("test")
                time.sleep(1)
            except KeyboardInterrupt as e:
                print ("Interrupted by user, stopping RobotConnector")
                sys.exit(0)
                
class MultimodalBehavior(object):
	
    def __init__(self):
        self.motion = ALProxy("ALMotion", ip, port)
        self.tablet = ALProxy("ALTabletService", ip, port)
        self.tablet.showImage(black_img_src)
        self.tts = ALProxy("ALTextToSpeech", ip, port)
        self.multimodal = RobotConnector(ip,port)
        self.process = Thread(target=self.multimodal.run)
        self.process.start()
        self.input_data = {}
        self.read_input_data()
        self.start_index = 0
        self.running_index = 0

    def read_input_data(self):
        file_in = open(input_src, "r")
        for line in file_in:
            self.input_data[line] = 0
        file_in.close()
			
    def pick_input(self):
        #check start index
        frequency = self.input_data[list(self.input_data.keys())[self.start_index]]
        if frequency >= 50:
            self.start_index = self.start_index + 1
        pick_index = self.start_index + (self.running_index % 30)

        input_all = list(self.input_data.keys())[pick_index]
        frequency = self.input_data[input_all]
        self.input_data[input_all] = frequency + 1
        self.running_index += 1
        return input_all

    def start_behavior(self, uuid):
        line = self.pick_input()
        utterance = line.split("\t")[1]
        gesture = line.split("\t")[3].strip()
        voice_tone = line.split("\t")[2]
        ids = line.split("\t")[0]

        file_out = open(output_src, "a")
        file_out.write(uuid + "\t" + ids + "\t" + utterance + "\t" + voice_tone + "\t" + gesture + "\n")
        print(uuid + "\t" + ids + "\t" + utterance + "\t" + voice_tone + "\t" + gesture + "\n")
        file_out.close()

        self.play_behavior(utterance,gesture,voice_tone)

    def log_ipad_input(self, uuid, data):
        file_out = open(output_src, "a")
        file_out.write(uuid + "\t" + data + "\n")
        file_out.close()

    def play_behavior(self, utterance, gesture, voice_tone):
        try:
            for rule in expand_rules:
                    if rule[0] in utterance:
                            utterance = utterance.replace(rule[0], rule[1])

            self.multimodal.speaking = True
            tosay = "\\rst\\\\style=neutral\\\\rspd=95\\"
            if voice_tone == "joy":
                    tosay = "\\rst\\\\rspd=95\\\\style=joyful\\\\vct=95\\"
            elif voice_tone == "anger":
                    tosay = "\\rst\\\\rspd=95\\\\style=neutral\\\\vct=80\\\\bound=N\\"
            tosay += utterance
            self.tts.post.say(tosay)

            if gesture == "strong_nod":
                    g.strong_nod(self.motion)
            elif gesture == "nod":
                    g.nod(self.motion)
            elif gesture == "light_head_shake":
                    g.light_head_shake(self.motion)
            elif gesture == "strong_head_shake":
                    g.strong_head_shake(self.motion)
            elif gesture == "annoyed":
                    g.annoyed(self.motion)
            elif gesture == "idle":
                    g.idle(self.motion)
            elif gesture == "breath":
                    g.breath(self.motion)
            elif gesture == "slow_breath":
                    g.slow_breath(self.motion)
            running = True
            while running:
                running = self.multimodal.speaking or not self.motion.areResourcesAvailable(["HeadPitch", "HeadYaw", "HipPitch", "HipRoll", "KneePitch", "RWristYaw", "RShoulderRoll" ])
                time.sleep(0.1)
            self.process.join()
        except:
            pass



    #multimodal.running = False

'''m = MultimodalBehavior()
uu =  str(uuid.uuid1())
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)
m.start_behavior(uu)'''



