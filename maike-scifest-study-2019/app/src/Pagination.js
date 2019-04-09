import React from 'react'
import PropTypes from 'prop-types'

class Pagination extends React.Component {

  render() {
    if(this.props.dataLength < this.props.maxRows) {
      return <div/>;
    }

    const button = (index) => (
      <div key={"paginationButton" + index} style={{
        height: 30,
        width: 30,
        borderRadius: "3px",
        margin: 2,
        marginTop: 5,
        backgroundColor: (this.props.currentPage === index ? "#0fcfff" : "#ffffff"),
        border: (this.props.currentPage !== index ? "solid 1px #dddddd" : undefined),
        display: "grid",
        gridTemplateRows: "1fr 2fr 1fr",
        cursor: "pointer"
      }} onClick={() => this.props.setCurrentPage(index)}>
        <div style={{
          gridRow: "2/3",
          textAlign: "center",
          color: (this.props.currentPage !== index ? "#777777" : "#ffffff"),
          fontFamily: "Lato",
          fontWeight: "bolder"
        }}>
          {index}
        </div>
      </div>
    );

    const dotsButton = (index) => (
      <div key={"paginationDots" + index} style={{
        height: 30,
        width: 30,
        borderRadius: "3px",
        margin: 2,
        marginTop: 5,
        backgroundColor: "#ffffff",
        border: "solid 1px #dddddd",
        display: "grid",
        gridTemplateRows: "1fr 2fr 1fr",
        cursor: "default"
      }}>
        <div style={{
          gridRow: "2/3",
          textAlign: "center",
          color: "#777777",
          fontFamily: "Lato",
          fontWeight: "bolder"
        }}>
          <div style={{display: "grid", gridTemplateRows: "1fr"}}>
            <div key={"dots" + index} style={{gridRows: "1/2", display: "grid", gridTemplateRows: "1fr 2fr"}}>
              <div style={{gridRow: "1/2"}}>
                {". . ."}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    let buttons = [];
    let leftDots = false;
    let rightDots = false;
    for(let i = 1; i < Math.ceil(this.props.dataLength / this.props.maxRows) + 1; i++) {
      if(this.props.currentPage < 4) {
        let pushed = false;
        if(i < 5 ||
          i === (Math.ceil(this.props.dataLength / this.props.maxRows) - 1) ||
          i === (Math.ceil(this.props.dataLength / this.props.maxRows))) {
          pushed = true;
          buttons.push(
            button(i)
          )
        }
        if(!rightDots && Math.ceil(this.props.dataLength / this.props.maxRows) > 5 && i > 4) {
          rightDots = true;
          if(Math.ceil(this.props.dataLength / this.props.maxRows) === 6 ||
            Math.ceil(this.props.dataLength / this.props.maxRows) === 7) {
            if(!pushed) {
              buttons.push(
                button(i)
              )
            }
          } else {
            buttons.push(
              dotsButton(i)
            )
          }
        }
      } else if(this.props.currentPage < (Math.ceil(this.props.dataLength / this.props.maxRows) - 2)) {
        if(i === 1 ||
          i === (this.props.currentPage - 1) ||
          i === this.props.currentPage ||
          i === (this.props.currentPage + 1) ||
          i === (Math.ceil(this.props.dataLength / this.props.maxRows))) {
          buttons.push(
            button(i)
          )
        }
        if(!leftDots && Math.ceil(this.props.dataLength / this.props.maxRows) > 5 && i > 1 && this.props.currentPage > 3) {
          leftDots = true;
          if(this.props.currentPage === 4) {
            buttons.push(
              button(i)
            )
          } else {
            buttons.push(
              dotsButton(i)
            )
          }
        }
        if(!rightDots &&
          Math.ceil(this.props.dataLength / this.props.maxRows) > 5 &&
          i > this.props.currentPage + 1 &&
          this.props.currentPage + 1 < Math.ceil(this.props.dataLength / this.props.maxRows)) {
          rightDots = true;
          if(this.props.currentPage === Math.ceil(this.props.dataLength / this.props.maxRows) - 3) {
            buttons.push(
              button(i)
            )
          } else {
            buttons.push(
              dotsButton(i)
            )
          }
        }
      } else {
        let pushed = false;
        if(i < 3 ||
          i === (this.props.currentPage - 1) ||
          i === (Math.ceil(this.props.dataLength / this.props.maxRows) - 3) ||
          i === (Math.ceil(this.props.dataLength / this.props.maxRows) - 2) ||
          i === (Math.ceil(this.props.dataLength / this.props.maxRows) - 1) ||
          i === (Math.ceil(this.props.dataLength / this.props.maxRows))) {
          pushed = true;
          buttons.push(
            button(i)
          )
        }
        if(!leftDots &&
          Math.ceil(this.props.dataLength / this.props.maxRows) > 5 &&
          i > 2) {
          leftDots = true;
          if(Math.ceil(this.props.dataLength / this.props.maxRows) === 6 ||
            Math.ceil(this.props.dataLength / this.props.maxRows) === 7) {
            if(!pushed) {
              buttons.push(
                button(i)
              )
            }
          } else {
            buttons.push(
              dotsButton(i)
            )
          }
        }
      }

    }

    const showsResult = (((this.props.currentPage) * this.props.maxRows) > this.props.dataLength
      ? this.props.dataLength
      : ((this.props.currentPage) * this.props.maxRows));

    return (
      <div style={{
        height: 60,
        padding: 0,
        margin: 0,
        backgroundColor: "#ffffff",
        textAlign: "right",
        display: "grid",
        gridTemplateRows: "1fr 2fr 1fr",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "row",
          gridRow: "2/3",
          justifyContent: "flex-end",
          marginRight: "20px",
        }}>
          <div style={{display: "grid", gridTemplateRows: "1fr 2fr 1fr"}}>
            <div style={{gridRow: "2/3", display: "flex", flexDirection: "row"}}>
              <div style={{fontFamily: "Lato", color: "#777777", paddingRight: "4px"}}>{"Visar resultat"}</div>
              <div style={{fontFamily: "Lato", color: "#555555", paddingRight: "4px", fontWeight: "bolder"}}>
                {" " + ((this.props.currentPage - 1) * this.props.maxRows + 1)} {"-"} {showsResult}
              </div>
            </div>
          </div>
          {buttons.length > 1 && buttons}
        </div>
      </div>
    );
  }
}

Pagination.propTypes = {
  dataLength: PropTypes.number.isRequired,
  maxRows: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired
};

export default Pagination;
