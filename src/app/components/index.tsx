import React from "react";

type ConditionalRenderProps = {
  render: boolean;
  children: React.ReactNode;
};

const ConditionalRender = ({ render, children }: ConditionalRenderProps) => {
  if (render) {
    return <>{children}</>;
  } else {
    return <></>;
  }
};

export default ConditionalRender;
