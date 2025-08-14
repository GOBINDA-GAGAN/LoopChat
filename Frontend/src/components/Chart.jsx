import React from "react";
import { CiFaceSmile } from "react-icons/ci";
import { VscSend } from "react-icons/vsc";

const Chart = () => {
  return (
    <div className="flex items-center w-1/2">
      <CiFaceSmile size={25} />
      <input
        type="text"
        placeholder=" Send message"
        className=" w-full px-2 py-1 rounded-3xl border-2 border-black "
      />

      <VscSend size={25} />
    </div>
  );
};

export default Chart;
