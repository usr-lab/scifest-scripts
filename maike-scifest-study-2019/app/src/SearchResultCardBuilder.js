import React from "react";
import PropTypes from 'prop-types'

import ConsolidatedCard from "./ConsolidatedCard";
import NewProductionCard from "./NewProductionCard";
import ObjectAdCard from "./ObjectAdCard";


class SearchResultCardBuilder extends React.Component {

  constructor(props) {
    super(props);
  }

  viewObjectAdDetails(ad_id) {
    window.open("https://www.homeq.se/object/" + ad_id + "?source=widget", '_blank')
  }

  viewMarketingPage(estate_id) {
    window.open("https://www.homeq.se/estate/" + estate_id + "?source=widget", '_blank')
  }

  renderNewProductionCard() {
    return <NewProductionCard
      card_type={this.props.card_data.card_type} longitude={this.props.card_data.longitude}
      latitude={this.props.card_data.latitude}
      image={this.props.card_data.display_image} estate={this.props.card_data.estate}
      estate_name={this.props.card_data.estate_name}
      city={this.props.card_data.city} rooms={this.props.card_data.rooms} area={this.props.card_data.area}
      rent={this.props.card_data.rent}
      cardClicked={() => this.viewMarketingPage(this.props.card_data.estate)}/>
  }

  renderConsolidatedCard() {
    return <ConsolidatedCard
      card_type={this.props.card_data.card_type} longitude={this.props.card_data.longitude}
      latitude={this.props.card_data.latitude}
      image={this.props.card_data.display_image} estate={this.props.card_data.estate}
      estate_name={this.props.card_data.estate_name}
      city={this.props.card_data.city} rooms={this.props.card_data.rooms} area={this.props.card_data.area}
      rent={this.props.card_data.rent}
      cardClicked={() => this.viewMarketingPage(this.props.card_data.estate)}/>
  }

  renderSingleAd() {
    return <ObjectAdCard
      id={this.props.card_data.id} longitude={this.props.card_data.longitude} latitude={this.props.card_data.latitude}
      image={this.props.card_data.get_first_image} street={this.props.card_data.street}
      overlay_image={this.props.card_data.overlay_image} status={this.props.card_data.status}
      city={this.props.card_data.city} rooms={this.props.card_data.rooms} area={this.props.card_data.area}
      rent={this.props.card_data.rent}
      cardClicked={() => this.viewObjectAdDetails(this.props.card_data.id)}/>
  }

  render() {
    switch (this.props.card_data.card_type) {
      case 'multi.ad.new_production':
        return <div style={{padding: 5}}>{this.renderNewProductionCard()}</div>
      case 'multi.ad.consolidated':
        return <div style={{padding: 5}}>{this.renderConsolidatedCard()}</div>
      case 'single.ad':
        return <div style={{padding: 5}}>{this.renderSingleAd()}</div>
      default:
        return null;
    }
  }
}


SearchResultCardBuilder.propTypes = {
  card_data: PropTypes.object.isRequired,
  build_search_history_link: PropTypes.func,
};

export default SearchResultCardBuilder;