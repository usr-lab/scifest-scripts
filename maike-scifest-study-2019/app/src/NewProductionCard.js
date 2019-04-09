import React from 'react'
import {Card, CardBody, CardImg, CardImgOverlay, CardSubtitle, CardText, CardTitle} from 'reactstrap';
import PropTypes from "prop-types";

export default class NewProductionCard extends React.Component {

  cardClicked() {
    if (this.props.cardClicked) {
      this.props.cardClicked(this.props.id)
    }
  }

  render() {
    return (
      <Card onClick={() => this.cardClicked(this.props.id)}>
        <CardImg top width="100%" src={this.props.image} alt="Card image cap"/>

          <CardImgOverlay style={{
            position: 'absolute',
            textAlign: 'center',
            paddingLeft: 0,
            fontWeight: 'bold',
            backgroundColor: 'rgba(0,0,0,0.08)'
          }}>
            <CardTitle className={'pull-left'} style={{
              backgroundColor: '#00ccff',
              color: '#FFFFFF',
              fontSize: 16,
              padding: 2,
              fontFamily: 'montserrat',
            }}>
              Nyproduktion
            </CardTitle>
          </CardImgOverlay>

        <CardBody style={{paddingTop: 8, marginBottom: 0, paddingBottom: 18}}>
          <CardTitle style={{padding: 0, marginBottom: 0, fontSize: 18, fontWeight: 600}}>
            {this.props.estate_name}
            {
              this.props.longitude && this.props.latitude && <i className={'pull-right fa fa-marker'}/>
            }
          </CardTitle>
          <CardSubtitle style={{marginTop: 8, marginBottom: 10, fontSize: 16, fontWeight: 500}}>
            {this.props.city}
          </CardSubtitle>
          <CardText style={{fontSize: 14, fontWeight: 500}}>
            <ul style={{fontSize: 14, fontWeight: 500, listStyle: 'None', paddingLeft: 0, marginBottom: 0}}>
              <li style={{fontSize: 14, fontWeight: 500, color: '#454545'}}>Hyra <b
                style={{fontWeight: 500, color: '#000000'}}>{this.props.rent[0]} - {this.props.rent[this.props.rent.length - 1]} SEK</b></li>
              <li style={{fontSize: 14, fontWeight: 500, color: '#454545', marginTop: 4}}>Rum <b
                style={{fontWeight: 500, color: '#000000'}}>{this.props.rooms[0]} - {this.props.rooms[this.props.rooms.length - 1]} rum och kök</b>
              </li>
              <li style={{fontSize: 14, fontWeight: 500, color: '#454545', marginTop: 4}}>Kvm <b
                style={{fontWeight: 500, color: '#000000'}}>{this.props.area[0]} - {this.props.area[this.props.area.length - 1]} kvm</b></li>
            </ul>
          </CardText>

          {this.props.children}
        </CardBody>
      </Card>

    )
  }
}

NewProductionCard.PropTypes = {
  card_type: PropTypes.string.isRequired,
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  estate: PropTypes.number.isRequired,
  rooms: PropTypes.string.isRequired,
  area: PropTypes.string.isRequired,
  rent: PropTypes.string.isRequired,
  estate_name: PropTypes.string.isRequired,
};