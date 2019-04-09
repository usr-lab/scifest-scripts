import React, {Component} from 'react';
import './App.css';
import {Alert, Button, Col, Container, Row} from 'reactstrap'
import axios from 'axios';
import uuid4 from 'uuid4'
import Notifications from 'react-notify-toast';
import {notifyError} from "./notifications";
import {Icon} from 'react-fa'

class App extends Component {
  selectedClazz = "success";


  constructor(props) {
    super(props)

    this.state = {
      screen: 1,
      uuid: null,
      selected_age: null,
      selected_emotion: null,
      likert_rating: null,
      error_message: null
    }

    this.continueAfterWait = this.continueAfterWait.bind(this);
    this.resetScreen = this.resetScreen.bind(this);
  }

  continueAfterWait() {
    this.setState({
      screen: 2
    })
  }

  generateUUID() {
    let generated_uuid = uuid4();
    this.setState({
      sending_data: true,
    }, () => {
      axios.post('start/', {uuid: generated_uuid}).then(response => {
        this.setState({
          uuid: generated_uuid,
          screen: 1,
          sending_data: false,
        }, () => {
          setTimeout(() => this.continueAfterWait(), 5000)
        })
      }).catch(error => {
        notifyError("Något gick fel. Vänligen kontakta en av volontärerna för att hjälpa dig.")
        this.setState({
          sending_data: false,
        })
      })
    })
  }


  renderStartUpScreen() {
    return <Row>
      <Col xs={{size: 10, offset: 1}} style={{textAlign: 'center', marginTop: '30vh'}}>
        <div className={'button'} onClick={() => this.generateUUID()}>
          {this.state.sending_data ? <Icon spin name="spinner"/> : null} Starta roboten
        </div>
      </Col>
    </Row>
  }

  renderAttentionToRobotScreen() {
    return <Row>
      <Col xs={{size: 6, offset: 3}} style={{textAlign: 'center', marginTop: '45vh'}}>
        <div style={{color: "white", fontSize: 40}}>Titta på roboten</div>
      </Col>
    </Row>
  }

  ageOptionButton(age_key, age_label) {
    return <Button block color={this.state.selected_age === age_key ? this.selectedClazz : 'default'}
                   onClick={() => {
                     this.setState({
                       selected_age: age_key
                     })
                   }}>
      {age_label}
    </Button>
  }

  emotionOptionButton(emotion_key, emotion_label) {
    return <Button block color={this.state.selected_emotion === emotion_key ? this.selectedClazz : 'default'}
                   onClick={() => {
                     this.setState({
                       selected_emotion: emotion_key
                     })
                   }}>
      {emotion_label}
    </Button>
  }

  likertButton(likert_key, likert_label) {
    return <Button disabled={this.state.sending_data} block
                   color={this.state.likert_rating === likert_key ? this.selectedClazz : 'default'}
                   onClick={() => {
                     this.setState({
                       likert_rating: likert_key
                     })
                   }}>
      {likert_label}
    </Button>
  }

  resetScreen() {
    this.setState({
      uuid: null,
      selected_age: null,
      selected_emotion: null,
      likert_rating: null,
      screen: 0,
    })
  }

  clickSubmitButton() {
    this.setState({
      sending_data: true
    }, () => {
      axios.post('complete/', {
        uuid: this.state.uuid,
        selected_age: this.state.selected_age,
        selected_emotion: this.state.selected_emotion,
        likert_rating: this.state.likert_rating
      }).then(response => {
        this.setState({
          sending_data: false,
          uuid: null,
          selected_age: null,
          selected_emotion: null,
          likert_rating: null,
          screen: 3
        }, () => {
          setTimeout(() => this.resetScreen(), 2500)
        })
      }).catch(error => {
        notifyError("Något gick fel. Vänligen kontakta en av volontärerna för att hjälpa dig.")
        this.setState({
          sending_data: false,
        })
      })
    })
  }


  enableSubmit() {
    return this.state.selected_emotion !== null && this.state.selected_age !== null && this.state.likert_rating !== null;
  }

  renderQuestions() {
    return <Row>
      <Col xs={{size: 12}} style={{textAlign: 'left', marginTop: '2vh'}}>
        <div className={'question-label'}>Hur gammal är du?</div>
        <Row>
          <Col xs={3}>{this.ageOptionButton('under_8', 'Under 8')}</Col>
          <Col xs={3}>{this.ageOptionButton('8_to_13', '8 - 13')}</Col>
          <Col xs={3}>{this.ageOptionButton('14_to_17', '14 - 17')}</Col>
          <Col xs={3}>{this.ageOptionButton('above_18', 'Över 18')}</Col>
        </Row>

        <div className={'question-label'}>Verkade roboten frustrerad eller entusiastisk?</div>
        <Row>
          <Col xs={4}>{this.emotionOptionButton('frustrated', 'Frustrerad')}</Col>
          <Col xs={4}>{this.emotionOptionButton('excited', 'Entusiastisk')}</Col>
        </Row>

        {this.state.selected_emotion !== null && <div>
          <div className={'question-label'}>Hur {this.state.selected_emotion === 'frustrated' ?  'frustrerad' : 'entusiastisk'} verkade roboten?</div>
          <Row>
            <Col>{this.likertButton('0', 'Inte alls')}</Col>
            <Col>{this.likertButton('1', 'Lite')}</Col>
            <Col>{this.likertButton('2', 'Lagom')}</Col>
            <Col>{this.likertButton('3', 'Mycket')}</Col>
            <Col>{this.likertButton('4', 'Ytterst')}</Col>
          </Row>
        </div>
        }


          <Row style={{marginTop: '20vh'}}>
            <Col xs={2}>
              <Button disabled={this.state.sending_data} block color={'default'} onClick={() => this.resetScreen()}>
                Avbryt
              </Button>
            </Col>
            {
              this.enableSubmit() &&
              <Col xs={{size: 4, offset: 6}}>
                <Button disabled={this.state.sending_data} block color={'success'}
                        onClick={() => this.clickSubmitButton()}>
                  {this.state.sending_data && <Icon spin name="spinner"/>} Avsluta
                </Button>
              </Col>
            }
          </Row>

      </Col>
    </Row>
  }

  renderThankYou(){
    return <Row>
      <Col xs={{size: 6, offset: 3}} style={{textAlign: 'center', marginTop: '45vh', fontSize:  40}}>
        Tack!
      </Col>
    </Row>
  }

  switchScreens() {
    switch (this.state.screen) {
      case 0:
        return this.renderStartUpScreen()
      case 1:
        return this.renderAttentionToRobotScreen()
      case 2:
        return this.renderQuestions();
      case 3:
        return this.renderThankYou();
      default:
        return this.renderStartUpScreen()
    }
  }

  render() {
    return (
      <div style={{backgroundColor: '#001d3b', height: '100vh'}}>
        <Notifications/>
        <Container>
          {this.switchScreens()}
        </Container>
      </div>
    );
  }
}

export default App;
