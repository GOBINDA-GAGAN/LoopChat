import React from "react";
import { VscSend } from "react-icons/vsc";

const Chart = () => {
  return (
    <div className="flex items-center w-1/2">
      
        <span>😊</span>
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
