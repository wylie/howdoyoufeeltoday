import React from "react";
import { FeelingsProvider } from '../feelings/FeelingsContext';
import Heading from "../heading";
import Feelings from "../feelings";
import FeelingsPast from "../feelings_past";
import "./styled.css";

const Wrap = () => {
  return (
    <div className="wrap">
      <FeelingsProvider>
        <Heading>How Do You Feel Today?</Heading>
        <Feelings />
        <Heading>Previous Feels</Heading>
        <FeelingsPast />
      </FeelingsProvider>
    </div>
  )
};

export default Wrap;