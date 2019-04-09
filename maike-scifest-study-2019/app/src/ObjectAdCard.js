import React from 'react'
import {Card, CardBody, CardImg, CardImgOverlay, CardSubtitle, CardTitle} from 'reactstrap';
import PropTypes from "prop-types";

export default class ObjectAdCard extends React.Component {

  cardClicked() {
    if (this.props.cardClicked) {
      this.props.cardClicked(this.props.id)
    }
  }

  render() {
    return (
      <Card onClick={() => this.cardClicked(this.props.id)}>
        <div>
          {
            this.props.overlay_image !== '' &&
            <img width="100%" src={this.props.overlay_image} alt="" style={{position: 'absolute'}}/>
          }
          <CardImg top width="100%" src={this.props.image} alt="Card image cap"/>
          {
            this.props.status === "Reserved" &&
            <CardImgOverlay style={{
              position: 'absolute',
              textAlign: 'center',
              paddingLeft: 0,
              fontWeight: 'bold',
              backgroundColor: 'rgba(0,0,0,0.3)'
            }}>
              <CardTitle className={'pull-left'} style={{
                backgroundColor: '#d7b730',
                color: '#FFFFFF',
                fontSize: 16,
                padding: 2,
                fontFamily: 'montserrat',
              }}>Reserverad</CardTitle>
            </CardImgOverlay>
          }
          <CardBody>
            <CardTitle>
              <b>{this.props.street}</b>
              {
                this.props.longitude && this.props.latitude && <i className={'pull-right fa fa-marker'}/>
              }
              <br/>
              <b>{this.props.city}</b>
            </CardTitle>
            <CardSubtitle>{this.props.rooms} RoK, {this.props.area} kvm, {this.props.rent} kr/mån</CardSubtitle>

            {this.props.children}
          </CardBody>
        </div>
      </Card>

    )
  }
}


ObjectAdCard.PropTypes = {
  id: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  street: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  rooms: PropTypes.string.isRequired,
  area: PropTypes.string.isRequired,
  overlay_image: PropTypes.string.isRequired,
  rent: PropTypes.string.isRequired,
  cardClicked: PropTypes.func.isRequired
};