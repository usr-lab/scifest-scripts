import {notify} from "react-notify-toast";
import React from "react";


/**
 * Handles an error response from the backend and decides whether to show an error message or not.
 * @param error - A complex object returned from a failed axios call
 */
export function notifyError(error, timeout = 2400) {
  let myColor = {background: '#f65663', text: "#fff"};

  notify.show(<span><i className={'fa fa-remove'}/> {error}</span>, "custom", timeout, myColor);
}

export function notifySuccess(message) {
  let myColor = {background: '#5CCBC6', text: "#fff"};
  notify.show(<span><i className={'fa fa-check'}/> {message}</span>, "custom", 2400, myColor);
}