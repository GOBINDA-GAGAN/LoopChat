import React from "react";
import { CiFaceSmile } from "react-icons/ci";
import { VscSend } from "react-icons/vsc";
import { IoIosAttach } from "react-icons/io";

const Chart = () => {
  return (
    <div className="flex items-center w-[70%] border border-gray-500 px-2 py-1 gap-1  bg-[#FAFBF8] rounded-4xl">
      <div className="flex items-center gap-2">
        <span className="p-1 hover:bg-gray-200 rounded-xl ">
          <CiFaceSmile size={20} />
        </span>
        <span className="p-1 hover:bg-gray-200 rounded-xl">
          <IoIosAttach size={20} />
        </span>
      </div>
      <input
        type="text"
        placeholder=" Send message"
        className=" w-full px-2 py-1 outline-none"
      />
      <span className="hover:bg-gray-200 rounded-xl p-1">
        <VscSend size={25} className="text-[#000000]" />
      </span>
    </div>
  );
};

export default Chart;
