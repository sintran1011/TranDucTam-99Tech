import React from "react";
import { renderTokenSvg } from "@/utils";
import useGetWorkpace from "@/hooks/useGetPrice";

const HomePage = () => {
  const { data } = useGetWorkpace();
  console.log(data, "data");
  return (
    <div>
      HomePage
      {renderTokenSvg("ETH")}
    </div>
  );
};

export default HomePage;
