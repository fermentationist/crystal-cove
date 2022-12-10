import React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  display: flex;
  place-content: center;
`;

const SpinningBorder = styled.div`
  position: relative;
  border: 5px solid lightgray;
  border-radius: 50%;
  border-left-color: transparent;
  animation: load 1.1s infinite ease;
  width: 90px;
  height: 90px;
  z-index: 100;
  @keyframes load {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;

const LoadingSpinner = (props: any) => {
  return (
    <Container className={props.className ? props.className : ""}>
      <SpinningBorder role="status"></SpinningBorder>
    </Container>
  );
}

export default LoadingSpinner;
