import React from "react";

import Wrap from "./components/wrap";
import Feeling from "./components/feeling";

const App = () => {
  return (
    <>
      <Feeling className="feeling sad" />
      <Wrap />
    </>
  )
};

export default App;
