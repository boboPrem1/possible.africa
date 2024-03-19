// eslint-disable-next-line no-unused-vars
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import CardComponent from "../../components/CardComponent.jsx";
import {
  useGetPostCategoriesQuery,
  useGetPostsQuery,
} from "../../features/api/apiSlice.js";
import CustomContainer from "../../utils/CustomContainer.jsx";
import { ParseSlice } from "../../utils/htmlParser.jsx";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import NoData from "../../utils/NoData.jsx";
import CenteredContainer from "../../utils/CenteredContainer.jsx";
import { NoMoreDataToLoad } from "../../components/noMoreDataToLoad.jsx";

function Actualites() {
  const [page, setPage] = useState(1);

  return (
    // <div className="mx-auto max-w-[1280px] bg-green-600 w-full min-h-[400px] grid grid-cols-[1fr_2fr_1fr] gap-x-5">
    <div className="mx-auto bg-transparent w-11/12 mt-10">
      <div className="h-[400px] bg-red-600 hidden"></div>
      <div className="min-h-[400px] rounded-[12px] flex flex-col gap-y-[30px]">
        <div className="w-full min-h-40 bg-white rounded-[12px] border-2 border-primary relative flex flex-col justify-start items-center pb-[20px]">
          <span className="text-[16px] border-2 border-primary bg-lightPrimary text-primary h-[30px] w-[126px] font-medium rounded-full flex justify-center items-start absolute -top-[14px] left-5">
            <span>Aujourd'hui</span>
          </span>
          <div className="w-11/12 h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden">
            <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
              <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-slate-200"></div>
              <div className="flex flex-col justify-start min-h-[46px]">
                <div>
                  <span>Techmoran</span>
                </div>
                <div className="text-xs italic">
                  Publié le 16/3/2024, language d' origine :{" "}
                  <span className="text-primary">English</span>
                </div>
              </div>
            </div>
            <div className="h-[90px] w-full text-primary font-bold flex items-center">
              Flutterwave nomme l'ancien directeur de la CBN Diop Fatou comme
              président du conseil ...
            </div>
            <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">nigéria</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">éducation</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">nigéria</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">éducation</span>
              </div>
            </div>
          </div>
          <div className="w-11/12 h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden">
            <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
              <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-slate-200"></div>
              <div className="flex flex-col justify-start min-h-[46px]">
                <div>
                  <span>Techmoran</span>
                </div>
                <div className="text-xs italic">
                  Publié le 16/3/2024, language d' origine :{" "}
                  <span className="text-primary">English</span>
                </div>
              </div>
            </div>
            <div className="h-[90px] w-full text-primary font-bold flex items-center">
              Flutterwave nomme l'ancien directeur de la CBN Diop Fatou comme
              président du conseil ...
            </div>
            <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">nigéria</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">éducation</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">nigéria</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">éducation</span>
              </div>
            </div>
          </div>
          <div className="w-11/12 h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden">
            <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
              <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-slate-200"></div>
              <div className="flex flex-col justify-start min-h-[46px]">
                <div>
                  <span>Techmoran</span>
                </div>
                <div className="text-xs italic">
                  Publié le 16/3/2024, language d' origine :{" "}
                  <span className="text-primary">English</span>
                </div>
              </div>
            </div>
            <div className="h-[90px] w-full text-primary font-bold flex items-center">
              Flutterwave nomme l'ancien directeur de la CBN Diop Fatou comme
              président du conseil ...
            </div>
            <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">nigéria</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">éducation</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">nigéria</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">éducation</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full min-h-40 bg-white rounded-[12px] border-2 border-primary relative flex flex-col justify-start items-center pb-[20px]">
          <span className="text-[16px] border-2 border-primary bg-lightPrimary text-primary h-[30px] w-[126px] font-medium rounded-full flex justify-center items-start absolute -top-[14px] left-5">
            <span>Hier</span>
          </span>
          <div className="w-11/12 h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden">
            <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
              <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-slate-200"></div>
              <div className="flex flex-col justify-start min-h-[46px]">
                <div>
                  <span>Techmoran</span>
                </div>
                <div className="text-xs italic">
                  Publié le 16/3/2024, language d' origine :{" "}
                  <span className="text-primary">English</span>
                </div>
              </div>
            </div>
            <div className="h-[90px] w-full text-primary font-bold flex items-center">
              Flutterwave nomme l'ancien directeur de la CBN Diop Fatou comme
              président du conseil ...
            </div>
            <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">nigéria</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">éducation</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">nigéria</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">éducation</span>
              </div>
            </div>
          </div>
          <div className="w-11/12 h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden">
            <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
              <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-slate-200"></div>
              <div className="flex flex-col justify-start min-h-[46px]">
                <div>
                  <span>Techmoran</span>
                </div>
                <div className="text-xs italic">
                  Publié le 16/3/2024, language d' origine :{" "}
                  <span className="text-primary">English</span>
                </div>
              </div>
            </div>
            <div className="h-[90px] w-full text-primary font-bold flex items-center">
              Flutterwave nomme l'ancien directeur de la CBN Diop Fatou comme
              président du conseil ...
            </div>
            <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">nigéria</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">éducation</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">nigéria</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">éducation</span>
              </div>
            </div>
          </div>
          <div className="w-11/12 h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden">
            <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
              <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-slate-200"></div>
              <div className="flex flex-col justify-start min-h-[46px]">
                <div>
                  <span>Techmoran</span>
                </div>
                <div className="text-xs italic">
                  Publié le 16/3/2024, language d' origine :{" "}
                  <span className="text-primary">English</span>
                </div>
              </div>
            </div>
            <div className="h-[90px] w-full text-primary font-bold flex items-center">
              Flutterwave nomme l'ancien directeur de la CBN Diop Fatou comme
              président du conseil ...
            </div>
            <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">nigéria</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">éducation</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">nigéria</span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize">éducation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <button className="w-full h-[45px] border-2 border-primary rounded-full text-primary text-lg font-bold hover:text-white hover:bg-gradient-to-r hover:from-primary hover:to-darkPrimary hover:border-none active:scale-95 transition-all duration-300">Charger plus de résultats</button>
        </div>
      </div>
      <div className="h-[400px] bg-purple-600 hidden"></div>
    </div>
  );
}

export default Actualites;
