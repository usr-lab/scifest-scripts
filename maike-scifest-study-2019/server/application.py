import json
from json import dumps
from logging import getLogger

from flask import Flask
from flask import Response
from flask import request

from server.scifest_main import MultimodalBehavior

_LOG = getLogger(__name__)

application = Flask(__name__)

mb = MultimodalBehavior()


@application.route('/start/', methods=['POST'])
def start():
    payload = json.loads(request.data)
    uuid = payload['uuid']
    print (uuid)
    mb.start_behavior(uuid)
    # Call pepper to do stuff
    return Response()


@application.route('/static/bundle.js')
def bundle_js():
    with open('server/js/final.js', 'r') as f:
        return Response(f.read(), mimetype='application/javascript')


@application.route('/static/bundle.css')
def bundle_css():
    with open('server/css/final.css', 'r') as f:
        return Response(f.read(), mimetype='text/css')

@application.route('/complete/', methods=['POST'])
def complete():

    payload = json.loads(request.data)

    uuid = payload.get('uuid', None)
    selected_age = payload.get('selected_age', None)
    selected_emotion = payload.get('selected_emotion', None)
    likert_rating = payload.get('likert_rating', None)

    # Call pepper function to store response
    mb.log_ipad_input(uuid, dumps({
        'age': selected_age,
        'emotion': selected_emotion,
        'likert': likert_rating
    }))
    print(uuid, selected_age, selected_emotion, likert_rating)

    return Response()


@application.route('/')
def landing():
    """ The endpoint that plays out the index html """
    with open('server/templates/index.html', 'r') as f:
        index_content = f.read()

    return Response(index_content, status=200)
