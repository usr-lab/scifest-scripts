import pygame
from naoqi import ALProxy
import sys
import argparse
import motion
import threading
import time
import almath

pygame.init()

class Robot(threading.Thread):

    def __init__(self, ip, port, joystick_id):
        threading.Thread.__init__(self)
        self.daemon = True
        self.jstick = pygame.joystick.Joystick(joystick_id)
        self.jstick.init()

        self.ip = ip
        self.port = port

        self.animatedSpeechProxy = ALProxy("ALAnimatedSpeech", self.ip, self.port)
        self.postureProxy = ALProxy("ALRobotPosture", self.ip, self.port)
        self.motion = ALProxy("ALMotion", self.ip, self.port)
        self.leds = ALProxy("ALLeds", self.ip, self.port)
        print 'Initialized Joystick : %s' % self.jstick.get_name()

    def computePath(self, effector, frame):
        dx = 0.05                 # translation axis X (meters)
        dz = 0.05                 # translation axis Z (meters)
        dwy = 5.0*almath.TO_RAD    # rotation axis Y (radian)

        path = []

        # Usign sensor values False
        currentTf = self.motion.getTransform(effector, frame, False)

        # 1
        targetTf = almath.Transform(currentTf)
        targetTf *= almath.Transform(-dx, 0.0, dz)
        targetTf *= almath.Transform().fromRotY(dwy)
        path.append(list(targetTf.toVector()))

        # 2
        targetTf = almath.Transform(currentTf)
        targetTf *= almath.Transform(dx, 0.0, dz)
        path.append(list(targetTf.toVector()))

        # 3
        path.append(currentTf)

        return path


    def kick_general(self, leg):

        if leg == 'LLeg':
            other_leg = 'RLeg'
        else:
            other_leg = 'LLeg'

        # Send robot to Stand Init
        self.postureProxy.goToPosture("StandInit", 0.5)

        # Activate Whole Body Balancer
        isEnabled  = True
        self.motion.wbEnable(isEnabled)

        # Legs are constrained fixed
        stateName  = "Fixed"
        supportLeg = "Legs"
        self.motion.wbFootState(stateName, supportLeg)

        # Constraint Balance Motion
        isEnable   = True
        supportLeg = "Legs"
        self.motion.wbEnableBalanceConstraint(isEnable, supportLeg)

        # Com go to LLeg
        supportLeg = leg
        duration = 2.0
        self.motion.wbGoToBalance(supportLeg, duration)

        # RLeg is free
        stateName = "Free"
        supportLeg = other_leg
        self.motion.wbFootState(stateName, supportLeg)

        # RLeg is optimized
        effector = other_leg
        axisMask = 63
        frame = 1 #motion.FRAME_WORLD

        # Motion of the RLeg
        times = [0.5, 1.0, 2.0]

        path = self.computePath(effector, frame)

        self.motion.transformInterpolations(effector, frame, path, axisMask, times)

        time.sleep(1.0)
        
        isEnabled = False
        self.motion.wbEnable(isEnabled)
        
         # send robot to Pose Init
        self.postureProxy.goToPosture("StandInit", 0.5)
        
        time.sleep(1.0)
        
        self.postureProxy.goToPosture("Stand", 0.3)

    def kickRight(self):
        self.kick_general('LLeg')

    def kickLeft(self):
        self.kick_general("RLeg")

    def get_joystick_vector(self):
        out = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        it = 0 #iterator

        #Read input from the two joysticks
        for i in range(0, self.jstick.get_numaxes()):
            out[it] = self.jstick.get_axis(i)
            it+=1
        #Read input from buttons
        for i in range(0, self.jstick.get_numbuttons()):
            out[it] = self.jstick.get_button(i)
            it+=1
        return out


    def run(self):
        last = time.time()
        rot = 0
        forw = 0
        side = 0
        while True:
            pygame.event.pump()
            out = self.get_joystick_vector()
            if out[0] < -0.5:
                rot = 3.1415 * 0.2
            elif out[0] > 0.5:
                rot = -3.1415 * 0.2
            else:
                rot = 0.0

            if out[1] < -0.5:
                forw = 0.08
            elif out[1] > 0.5:
                forw = -0.08
            else:
                forw = 0
                
            if out[3] < -0.5:
                side = 0.08
            elif out[3] > 0.5:
                side = -0.08
            else:
                side = 0.0
                                
            if time.time() - last > 0.1: 
                self.motion.move(forw, side, rot)
                last = time.time()
                
            if out[10] > 0.5:
                self.kickLeft()
            if out[11] > 0.5:
                self.kickRight()
            if out[6] > 0.5:
                self.postureProxy.goToPosture("Sit", 80/100.)
            if out[7] > 0.5:
                # set the local configuration
                configuration = {"bodyLanguageMode":"contextual"}
                # say the text with the local configuration
                self.animatedSpeechProxy.say("Have a nice day and take care!", configuration)
            if out[8] > 0.5:
                 # set the local configuration
                configuration = {"bodyLanguageMode":"contextual"}
                # say the text with the local configuration
                self.animatedSpeechProxy.say("Hello, I am Nao. Nice to meet you!", configuration)
            if out[2] > 0.5:
                # say the text with the local configuration
                self.animatedSpeechProxy.say("^start(animations/Stand/Gestures/Hey_1) ^wait(animations/Stand/Gestures/Hey_1)")
            if out[5] > 0.5:
                # say the text with the local configuration
                self.animatedSpeechProxy.say("^start(animations/Stand/Gestures/BowShort_1) ^wait(animations/Stand/Gestures/BowShort_1)")
            if out[9] > 0.5:
                self.postureProxy.goToPosture("Stand", 80/100.)
            if out[12] > 0.5:
                self.leds.fadeRGB("FaceLeds", 255, 0, 0, 0.1)
            if out[13] > 0.5:
                self.leds.fadeRGB("FaceLeds", 0, 255, 0, 0.1)


r1 = Robot('192.168.178.164', 9559, 0)
#r2 = Robot('192.168.0.13', 9559, 1)

r1.start()
#r2.start()

while True:
    print "Script still works"
    time.sleep(1)
