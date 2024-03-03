import { IoMdShare } from "react-icons/io";

export const Dashboard = ({onHeadingClick}) => {
  return(
    <div className="h-full w-full p-5 bg-[#27272b]">
      <p className="text-white font-bold text-3xl">Dashboard</p>

      <div className="w-full min-h-[60%] rounded-md my-10 bg-[#09090B] flex flex-col">
        <div className="w-full flex border-b border-gray-700">
          <div className="flex-1 px-5 py-3 flex justify-center items-center gap-2 border-r border-gray-700 cursor-default">
            <div className="text-white border p-1 border-white text-sm flex justify-center items-center aspect-square w-[30px] rounded-[100%]">
              01
            </div>
            <p className="text-white">Search console</p>
          </div>
          <div className="flex-1 px-5 py-3 flex justify-center items-center gap-2 border-r border-gray-700 cursor-default">
            <div className="text-white border p-1 border-white text-sm flex justify-center items-center aspect-square w-[30px] rounded-[100%]">
              02
            </div>
            <p className="text-white">Website</p>
          </div>
          <div className="flex-1 px-5 py-3 flex justify-center items-center gap-2 border-r border-gray-700 cursor-default">
            <div className="text-white border p-1 border-white text-sm flex justify-center items-center aspect-square w-[30px] rounded-[100%]">
              03
            </div>
            <p className="text-white">Sitemaps</p>
          </div>
        </div>

        <div className="w-full flex-1 flex flex-col justify-center items-center">
          <div className="bg-gray-300 rounded-[100%] p-2 flex justify-center items-center my-2">
            <IoMdShare className="h-5 w-5 text-black"/>
          </div>
          <p className="text-white text-sm font-bold my-1">Connect your Search Console</p>
          <p className="text-gray-300 text-xs">To get started, click the button below and connect your first Google Account.</p>
          <button className="my-2 rounded-md p-1 bg-blue-500 hover:bg-blue-600 text-white text-sm" onClick={() => onHeadingClick('GSC Connections')}>Go to Connections</button>
        </div>
      </div>
    </div>
  )
}