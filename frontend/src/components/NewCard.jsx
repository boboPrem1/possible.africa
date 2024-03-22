export default function NewCard() {
  return (
    // <div className="mx-auto max-w-[1280px] bg-green-600 w-full min-h-[400px] grid grid-cols-[1fr_2fr_1fr] gap-x-5">
    <div className="mx-auto bg-transparent w-11/12 mt-10 text-darkGray lg:grid lg:grid-cols-[1fr_2fr_1fr] lg:gap-x-5 max-w-[1280px]">
      <div className="min-h-[400px] max-h-[100vh] overflow-x-scroll hidden lg:flex lg:justify-start lg:flex-col lg:items-center lg:gap-5 lg:border-[.5px] rounded-[12px] lg:border-primary lg:p-5 ">
        <div className="w-[248px] h-10 flex justify-center text-center rounded-lg shadow-sm drop-shadow-xl overflow-hidden">
          <div
            className={
              language === "fr"
                ? "w-[124px] h-10 flex justify-center flex-col cursor-pointer bg-[#2BB19C] text-white font-semibold"
                : "w-[124px] h-10 flex justify-center flex-col cursor-pointer"
            }
            onClick={() => {
              setLanguageChanging(true);
              setLanguage("fr");
              setTimeout(() => {
                setLanguageChanging(false);
              }, 3000);
            }}
          >
            <span>Français</span>
          </div>
          <div
            className={
              language === "eng"
                ? "w-[124px] h-10 flex justify-center flex-col cursor-pointer bg-[#2BB19C] text-white font-semibold"
                : "w-[124px] h-10 flex justify-center flex-col cursor-pointer"
            }
            onClick={() => {
              setLanguageChanging(true);
              setLanguage("eng");
              setTimeout(() => {
                setLanguageChanging(false);
              }, 3000);
            }}
          >
            <span>Anglais</span>
          </div>
        </div>
        <Input
          label="Rechercher par titre"
          placeholder="Entrez le titre de l'article ."
          type="text"
        />
        <CustumSelect
          label="Pays du siège social"
          multi
          placeholder="Choisissez un pays ."
        />
        <CustumSelect
          label="Filtrer par Tag"
          multi
          placeholder="Choisissez un tag ."
        />
        <CustumSelect
          label="Langue d'écriture de l'article"
          placeholder="Choisissez une langue."
          options={[
            { value: "Anglais", label: "ENG" },
            { value: "Français", label: "FR" },
          ]}
        />

        <div>
          <div className="font-semibold">Langue de publication</div>
          <Input label="Anglais" type="checkbox" />
          <Input label="Français" type="checkbox" />
        </div>
        <Input
          label="Date de publication"
          placeholder="Choisissez la date ."
          type="date"
        />
        <button className="w-full h-[45px] bg-primary rounded-full text-lg font-bold text-white hover:bg-gradient-to-r hover:from-primary hover:to-darkPrimary hover:border-none active:scale-95 transition-all duration-300">
          Réinitialiser les filtres
        </button>
      </div>
      <div className="min-h-[400px] rounded-[12px] flex flex-col gap-y-[30px] md:max-w-[600px] mx-auto">
        <div className="w-full min-h-40 bg-white border-t-[.5px] border-primary relative flex flex-col justify-start items-center pb-[20px]">
          <span className="text-[16px] border-[.5px] border-primary bg-lightPrimary text-primary h-[30px] w-[130px] font-medium rounded-full flex justify-center items-start absolute -top-[14px] left-5">
            <span className="font-semibold">les plus récents</span>
          </span>
          <div className="w-full h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden">
            <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
              <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-slate-200"></div>
              <div className="flex flex-col justify-start min-h-[46px]">
                <div>
                  <span className="font-semibold md:text-lg">Techmoran</span>
                </div>
                <div className="text-xs italic md:text-sm">
                  Publié le 16/3/2024, language d' origine :{" "}
                  <span className="text-primary">English</span>
                </div>
              </div>
            </div>
            <div className="h-[90px] w-full text-primary font-bold flex items-center md:text-xl">
              Flutterwave nomme l'ancien directeur de la CBN Diop Fatou comme
              président du conseil ...
            </div>
            <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  nigéria
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  éducation
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  nigéria
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  éducation
                </span>
              </div>
            </div>
          </div>
          <div className="w-full h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden">
            <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
              <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-slate-200"></div>
              <div className="flex flex-col justify-start min-h-[46px]">
                <div>
                  <span className="font-semibold md:text-lg">Techmoran</span>
                </div>
                <div className="text-xs italic md:text-sm">
                  Publié le 16/3/2024, language d' origine :{" "}
                  <span className="text-primary">English</span>
                </div>
              </div>
            </div>
            <div className="h-[90px] w-full text-primary font-bold flex items-center md:text-xl">
              Flutterwave nomme l'ancien directeur de la CBN Diop Fatou comme
              président du conseil ...
            </div>
            <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  nigéria
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  éducation
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  nigéria
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  éducation
                </span>
              </div>
            </div>
          </div>
          <div className="w-full h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden">
            <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
              <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-slate-200"></div>
              <div className="flex flex-col justify-start min-h-[46px]">
                <div>
                  <span className="font-semibold md:text-lg">Techmoran</span>
                </div>
                <div className="text-xs italic md:text-sm">
                  Publié le 16/3/2024, language d' origine :{" "}
                  <span className="text-primary">English</span>
                </div>
              </div>
            </div>
            <div className="h-[90px] w-full text-primary font-bold flex items-center md:text-xl">
              Flutterwave nomme l'ancien directeur de la CBN Diop Fatou comme
              président du conseil ...
            </div>
            <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  nigéria
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  éducation
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  nigéria
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  éducation
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full min-h-40 bg-white border-t-[.5px] border-primary relative flex flex-col justify-start items-center pb-[20px]">
          <span className="text-[16px] border-[.5px] border-primary bg-lightPrimary text-primary h-[30px] w-[150px] font-medium rounded-full flex justify-center items-start absolute -top-[14px] left-5">
            <span className="font-semibold">Les moins récents</span>
          </span>
          <div className="w-full h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden">
            <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
              <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-slate-200"></div>
              <div className="flex flex-col justify-start min-h-[46px]">
                <div>
                  <span className="font-semibold md:text-lg">Techmoran</span>
                </div>
                <div className="text-xs italic md:text-sm">
                  Publié le 16/3/2024, language d' origine :{" "}
                  <span className="text-primary">English</span>
                </div>
              </div>
            </div>
            <div className="h-[90px] w-full text-primary font-bold flex items-center md:text-xl">
              Flutterwave nomme l'ancien directeur de la CBN Diop Fatou comme
              président du conseil ...
            </div>
            <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  nigéria
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  éducation
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  nigéria
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  éducation
                </span>
              </div>
            </div>
          </div>
          <div className="w-full h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden">
            <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
              <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-slate-200"></div>
              <div className="flex flex-col justify-start min-h-[46px]">
                <div>
                  <span className="font-semibold md:text-lg">Techmoran</span>
                </div>
                <div className="text-xs italic md:text-sm">
                  Publié le 16/3/2024, language d' origine :{" "}
                  <span className="text-primary">English</span>
                </div>
              </div>
            </div>
            <div className="h-[90px] w-full text-primary font-bold flex items-center md:text-xl">
              Flutterwave nomme l'ancien directeur de la CBN Diop Fatou comme
              président du conseil ...
            </div>
            <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  nigéria
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  éducation
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  nigéria
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  éducation
                </span>
              </div>
            </div>
          </div>
          <div className="w-full h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden">
            <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
              <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-slate-200"></div>
              <div className="flex flex-col justify-start min-h-[46px]">
                <div>
                  <span className="font-semibold md:text-lg">Techmoran</span>
                </div>
                <div className="text-xs italic md:text-sm">
                  Publié le 16/3/2024, language d' origine :{" "}
                  <span className="text-primary">English</span>
                </div>
              </div>
            </div>
            <div className="h-[90px] w-full text-primary font-bold flex items-center md:text-xl">
              Flutterwave nomme l'ancien directeur de la CBN Diop Fatou comme
              président du conseil ...
            </div>
            <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  nigéria
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  éducation
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  nigéria
                </span>
              </div>
              <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                <div className="h-[35px] w-[35px] rounded-full bg-mediumGray"></div>
                <span className="capitalize md:text-lg md:font-semibold">
                  éducation
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:flex md:justify-end">
          <button className="w-full h-[45px] bg-primary rounded-full text-lg font-bold text-white hover:bg-gradient-to-r hover:from-primary hover:to-darkPrimary hover:border-none active:scale-95 md:w-6/12 lg:w-5/12 transition-all duration-300">
            Charger plus de résultats
          </button>
        </div>
      </div>
      <div className="h-[400px] bg-purple-600 hidden lg:inline-grid"></div>
    </div>
  );
}