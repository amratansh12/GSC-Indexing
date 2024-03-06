import { useContext } from "react";
import { FaFilter, FaGripLinesVertical } from "react-icons/fa";
import {SitesContext} from "../context/SitesContext"

export const Websites = ({onHeadingClick}) => {
  const {sites} = useContext(SitesContext);

  return(
    <div className="w-full h-full p-5 bg-[#27272B]">
      <div className="w-full flex items-center justify-between">
        <p className="text-white text-3xl font-bold">Websites</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm p-1 rounded-md" onClick={() => onHeadingClick('Quick Dexing')}>Add Website</button>
      </div>
      <div className="rounded-md bg-[#09090B] w-full h-[60%] my-5 overflow-y-scroll flex flex-col">
        <div className="px-3 py-2 flex flex-row-reverse items-center gap-2 border-b border-gray-700">
          <FaGripLinesVertical className="h-4 w-4 text-gray-500"/>
          <FaFilter className="h-4 w-4 text-gray-500"/>
          <input type="text" className="px-2 py-1 text-sm text-white bg-gray-700 rounded-md focus:ring-0 focus:outline-0" placeholder="Search"/>
        </div>
        {sites.siteEntry && (
          <div className="flex flex-col w-full flex-1">
            {sites.siteEntry.map((site) => (
              <div className="flex items-center gap-5 px-3 py-2 border-b border-gray-700">
                <input type="checkbox" className="h-3 w-3" />
                <p className="text-white">{site.siteUrl}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}