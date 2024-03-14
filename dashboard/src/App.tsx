import "./init";
import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { notificationProvider, ThemedLayoutV2 } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import { Image, theme } from "antd";
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";
import { Header } from "./components/header";
import {
  ColorModeContext,
  ColorModeContextProvider,
} from "./contexts/color-mode";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { UserList } from "./pages/users/list";
import { UserShow } from "./pages/users/show";
import { UserEdit } from "./pages/users/edit";
import { UserCreate } from "./pages/users/create";
import { OrganisationTypeList } from "./pages/organisation_types/list";
import { OrganisationList } from "./pages/organisations/list";
import { OrganisationShow } from "./pages/organisations/show";
import { OrganisationEdit } from "./pages/organisations/edit";
import { OrganisationCreate } from "./pages/organisations/create";
import { dataProvider } from "./custom-data-provider/data-provider";
import { EventList } from "./pages/events/list";
import { JobList } from "./pages/jobs/list";
import { JobShow } from "./pages/jobs/show";
import { JobEdit } from "./pages/jobs/edit";
import { JobCreate } from "./pages/jobs/create";
import { OpportunityTypeList } from "./pages/opportunity_types/list";
import { OpportunityTypeShow } from "./pages/opportunity_types/show";
import { OpportunityTypeEdit } from "./pages/opportunity_types/edit";
import { OpportunityTypeCreate } from "./pages/opportunity_types/create";
import { OpportunityList } from "./pages/opportunities/list";
import { OpportunityEdit } from "./pages/opportunities/edit";
import { OpportunityCreate } from "./pages/opportunities/create";
import { OpportunityShow } from "./pages/opportunities/show";
import { EventTypeList } from "./pages/event_types/list";
import { EventTypeEdit } from "./pages/event_types/edit";
import { EventTypeShow } from "./pages/event_types/show";
import { EventTypeCreate } from "./pages/event_types/create";
import { EventEdit } from "./pages/events/edit";
import { EventCreate } from "./pages/events/create";
import { EventShow } from "./pages/events/show";
import { RegisterPage } from "./components/pages/auth/components";
import { PostList } from "./pages/posts/list";
import { PostEdit } from "./pages/posts/edit";
import { PostCreate } from "./pages/posts/create";
import { PostShow } from "./pages/posts/show";
import { PostCategoryList } from "./pages/post_categories/list";
import { PostCategoryEdit } from "./pages/post_categories/edit";
import { PostCategoryShow } from "./pages/post_categories/show";
import { PostCategoryCreate } from "./pages/post_categories/create";
import {
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import CustomIconJob from "./custom-components/Icons/CustomIconJob";
import { ThemedTitleV2 } from "./components/themedLayout/title";
import { ThemedSiderV2 } from "./components/themedLayout/sider";
import CustomIconArticle from "./custom-components/Icons/CustomIconArticle";
import CustomIconOrganisation from "./custom-components/Icons/CustomIconOrganisation";
import CustomIconEvent from "./custom-components/Icons/CustomIconEvent";
import CustomIconOpportunity from "./custom-components/Icons/CustomIconOpportunity";
import { UserRoleCreate } from "./pages/user roles/create";
import { UserRoleEdit } from "./pages/user roles/edit";
import { UserRoleList } from "./pages/user roles/list";
import { UserRoleShow } from "./pages/user roles/show";
import { useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { Profil } from "./pages/me/list";
import { ProfilEdit } from "./pages/me/edit";
import { OrganisationTypeShow } from "./pages/organisation_types/show";
import { OrganisationTypeEdit } from "./pages/organisation_types/edit";
import { OrganisationTypeCreate } from "./pages/organisation_types/create";
import CustomDashboard from "./pages/dashboard";
import { useContextSelector } from "use-context-selector";
import { userContext } from "./UserContext";
import {
  AdminOrContributor,
  AdminOrContributorOrUser,
} from "./custom-components/AccessControl";
import { PostLabelList } from "./pages/post_labels/list";
import { PostLabelShow } from "./pages/post_labels/show";
import { PostLabelEdit } from "./pages/post_labels/edit";
import { PostLabelCreate } from "./pages/post_labels/create";
import { ActivityAreaList } from "./pages/activity_areas/list";
import Link from "antd/es/typography/Link";
import { OpportunityTargetList } from "./pages/opportunity_targets/list";
import { OpportunityTargetShow } from "./pages/opportunity_targets/show";
import { OpportunityTargetEdit } from "./pages/opportunity_targets/edit";
import { OpportunityTargetCreate } from "./pages/opportunity_targets/create";
import { UserTypeList } from "./pages/user types/list";
import { UserTypeShow } from "./pages/user types/show";
import { UserTypeEdit } from "./pages/user types/edit";
import { UserTypeCreate } from "./pages/user types/create";
// import { socket } from "./socket";

// const prodapi = import.meta.env.VITE_BACKEND_PROD;
const ENV = import.meta.env.VITE_NODE_ENV;
export const API_URL =
  ENV === "developement"
    ? import.meta.env.VITE_BACKEND_DEV
    : import.meta.env.VITE_BACKEND_PROD;

function Logo() {
  return <img src="./assets/logos/logo.png" alt="n" />;
}

function ContactsWelcome() {
  const { useToken } = theme;
  const { token } = useToken();
  const { mode, setMode } = useContext(ColorModeContext);
  const logo_dark =
    "https://possibledotafrica.s3.eu-west-3.amazonaws.com/users/images/1689883749850-logo.png";
  const logo_light =
    "https://possibledotafrica.s3.eu-west-3.amazonaws.com/users/images/1689883812712-logo-white.png";
  return (
    <div
      style={{
        textAlign: "center",
        backgroundColor: token.colorBgContainer,
        borderRadius: "10px",
        minHeight: "80vh",
        padding: "15px",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "10%",
          right: "10%",
        }}
      >
        {/* <div
          style={{
            marginBottom: "20px",
          }}
        >
          <Image
            src={mode === "dark" ? logo_light : logo_dark}
            alt="Logo Possible"
            height="70px"
          />
        </div> */}
        <h1
          style={{
            color: token.colorPrimary,
            fontSize: "300%",
            fontWeight: "bold",
          }}
        >
          Bienvenue sur Possible
        </h1>
        <main
          style={{
            color: token.colorText,
            fontSize: "120%",
          }}
        >
          Merci pour votre inscription ! Elle est en cours de validation,
          conditionnée à votre adhésion à Possible Africa. Après cela, notre
          base de données #Africatech vous sera accessible. Pas encore adhérent
          de l'association ? 
          <Link href="https://possible-africa.notion.site/possible-africa/POSSIBLE-AFRICA-ddb414537adf439f9f06c5e63914d1be">
            Cliquez ici.
          </Link>
        </main>
      </div>
    </div>
  );
}

function App() {
  const { t, i18n } = useTranslation();
  const userState = useSelector((state: RootState) => state.user);
  const userD = useContextSelector(userContext, (v) => v[0].user);
  const setUserD = useContextSelector(userContext, (v) => v[1]);
  const dispatch = useDispatch();
  const [resource, setResource] = useState([]);
  const onDev = "http://localhost:5000";
  const [token, setToken] = useState<string>(
    localStorage.getItem("refine-auth")
  );
  const [time, setTime] = useState(false);
  // let userConnected: UserFromDb;
  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };
  
  // const [realTimeIsConnected, setRealTimeIsConnected] = useState(socket.connected);

  useEffect(() => {
    // function onConnect() {
    //   setRealTimeIsConnected(true);
    // }

    // function onDisconnect() {
    //   setRealTimeIsConnected(false);
    // }
    if (token) {
      if (token != localStorage.getItem("refine-auth")) {
        window.location.reload();
      }
      const key = import.meta.env.VITE_JWT_SECRET;
      const decoded: { user: any; iat: number; exp: number } = jwt_decode(
        token,
        key
      );
      setUserD((s) => ({
        ...s,
        user: { ...decoded.user },
      }));
      // console.info("App.tsx");
      // setUserConnected({ ...decoded.user });
    }

    const ttime = setTimeout(() => {
      setTime(true);
    }, 5000);

    // return () => {
    //   clearTimeout(ttime);
    //   socket.off("connect", onConnect);
    //   socket.off("disconnect", onDisconnect);
    // };
  }, [time]);

  const resources = {
    admin: [
      {
        name: "Tableau de bord",
        list: "/",
        meta: {
          icon: <DashboardOutlined />,
        },
      },
      {
        // name: "Publications",
        name: "posts",
        list: "/posts",
        show: "/posts/show/:id",
        create: "/posts/create",
        edit: "/posts/edit/:id",
        meta: {
          label: "Publications",
          icon: <CustomIconArticle />,
          canDelete: true,
        },
      },

      // {
      //   name: "posts",
      //   list: "/posts",
      //   show: "/posts/show/:id",
      //   create: "/posts/create",
      //   edit: "/posts/edit/:id",
      //   meta: {
      //     label: "Répertoire",
      //     parent: "Publications",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "post_categories",
      //   list: "/post_categories",
      //   show: "/post_categories/show/:id",
      //   create: "/post_categories/create",
      //   edit: "/post_categories/edit/:id",
      //   meta: {
      //     label: "Catégories",
      //     parent: "Publications",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "post_labels",
      //   list: "/post_labels",
      //   show: "/post_labels/show/:id",
      //   create: "/post_labels/create",
      //   edit: "/post_labels/edit/:id",
      //   meta: {
      //     label: "Etiquettes",
      //     parent: "Publications",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "Evènements",
      //   meta: {
      //     label: "Evènements",
      //     icon: <CustomIconEvent />,
      //   },
      // },
      // {
      //   name: "events",
      //   list: "/events",
      //   show: "/events/show/:id",
      //   create: "/events/create",
      //   edit: "/events/edit/:id",
      //   meta: {
      //     label: "Répertoire",
      //     parent: "Evènements",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "event_types",
      //   list: "/event_types",
      //   show: "/event_types/show/:id",
      //   create: "/event_types/create",
      //   edit: "/event_types/edit/:id",
      //   meta: {
      //     label: "Catégories",
      //     parent: "Evènements",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "Opportunités",
      //   meta: {
      //     label: "Opportunités",
      //     icon: <CustomIconOpportunity />,
      //   },
      // },
      // {
      //   name: "opportunities",
      //   list: "/opportunities",
      //   show: "/opportunities/show/:id",
      //   create: "/opportunities/create",
      //   edit: "/opportunities/edit/:id",
      //   meta: {
      //     label: "Répertoire",
      //     parent: "Opportunités",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "opportunity_types",
      //   list: "/opportunity_types",
      //   show: "/opportunity_types/show/:id",
      //   create: "/opportunity_types/create",
      //   edit: "/opportunity_types/edit/:id",
      //   meta: {
      //     label: "Catégories",
      //     parent: "Opportunités",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "opportunity_targets",
      //   list: "/opportunity_targets",
      //   show: "/opportunity_targets/show/:id",
      //   create: "/opportunity_targets/create",
      //   edit: "/opportunity_targets/edit/:id",
      //   meta: {
      //     label: "Cibles",
      //     parent: "Opportunités",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "Offres d'emplois",
      //   meta: {
      //     label: "Offres d'emplois",
      //     icon: <CustomIconJob />,
      //   },
      // },
      // {
      //   name: "jobs",
      //   list: "/jobs",
      //   show: "/jobs/show/:id",
      //   create: "/jobs/create",
      //   edit: "/jobs/edit/:id",
      //   meta: {
      //     canDelete: true,
      //     label: "Répertoire",
      //     parent: "Offres d'emplois",
      //   },
      // },
      {
        name: "organisations",
        list: "/organisations",
        show: "/organisations/show/:id",
        create: "/organisations/create",
        edit: "/organisations/edit/:id",
        meta: {
          icon: <CustomIconOrganisation />,
          canDelete: true,
          label: "Organisations",
        },
      },
      // {
      //   name: "organisations",
      //   list: "/organisations",
      //   show: "/organisations/show/:id",
      //   create: "/organisations/create",
      //   edit: "/organisations/edit/:id",
      //   meta: {
      //     label: "Répertoire",
      //     parent: "Organisations",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "organisation_types",
      //   list: "/organisation_types",
      //   show: "/organisation_types/show/:id",
      //   create: "/organisation_types/create",
      //   edit: "/organisation_types/edit/:id",
      //   meta: {
      //     label: "Catégories",
      //     parent: "Organisations",
      //     canDelete: true,
      //   },
      // },
      {
        name: "Utilisateurs",
        meta: {
          label: "Utilisateurs",
          icon: <UserOutlined />,
          canDelete: true,
          token: localStorage.getItem("refine-auth"),
        },
      },
      {
        name: "users",
        list: "/users",
        show: "/users/show/:id",
        create: "/users/create",
        edit: "/users/edit/:id",
        meta: {
          label: "Répertoire",
          parent: "Utilisateurs",
        },
      },
      {
        name: "user_roles",
        list: "/user_roles",
        show: "/user_roles/show/:id",
        create: "/user_roles/create",
        edit: "/user_roles/edit/:id",
        meta: {
          label: "Roles",
          parent: "Utilisateurs",
        },
      },
      {
        name: "user_types",
        list: "/user_types",
        show: "/user_types/show/:id",
        create: "/user_types/create",
        edit: "/user_types/edit/:id",
        meta: {
          label: "Catégories",
          parent: "Utilisateurs",
        },
      },
      // {
      //   name: "Champs & Propriétés",
      //   meta: {
      //     label: "Champs & Propriétés",
      //     icon: <SettingOutlined />,
      //   },
      // },
      // {
      //   name: "activity_areas",
      //   list: "/activity_areas",
      //   show: "/activity_areas/show/:id",
      //   create: "/activity_areas/create",
      //   edit: "/activity_areas/edit/:id",
      //   meta: {
      //     label: "Secteurs d'activités",
      //     parent: "Champs & Propriétés",
      //     canDelete: true,
      //   },
      // },
      {
        name: "profil",
        list: "/profil",
        edit: "profil/edit/:id",
        // show: "/users/show/:id",
        // create: "/users/create",
        meta: {
          label: "Profil",
          hided: true,
          // parent: "Utilisateurs",
        },
      },
    ],
    contributor: [
      {
        name: "Tableau de bord",
        list: "/",
        meta: {
          icon: <DashboardOutlined />,
        },
      },
      {
        // name: "Publications",
        name: "posts",
        list: "/posts",
        show: "/posts/show/:id",
        create: "/posts/create",
        edit: "/posts/edit/:id",
        meta: {
          label: "Publications",
          icon: <CustomIconArticle />,
          canDelete: true,
        },
      },
      // {
      //   name: "posts",
      //   list: "/posts",
      //   show: "/posts/show/:id",
      //   create: "/posts/create",
      //   edit: "/posts/edit/:id",
      //   meta: {
      //     label: "Répertoire",
      //     parent: "Publications",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "post_categories",
      //   list: "/post_categories",
      //   show: "/post_categories/show/:id",
      //   create: "/post_categories/create",
      //   edit: "/post_categories/edit/:id",
      //   meta: {
      //     label: "Catégories",
      //     parent: "Publications",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "post_labels",
      //   list: "/post_labels",
      //   show: "/post_labels/show/:id",
      //   create: "/post_labels/create",
      //   edit: "/post_labels/edit/:id",
      //   meta: {
      //     label: "Etiquettes",
      //     parent: "Publications",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "Evènements",
      //   meta: {
      //     label: "Evènements",
      //     icon: <CustomIconEvent />,
      //   },
      // },
      // {
      //   name: "events",
      //   list: "/events",
      //   show: "/events/show/:id",
      //   create: "/events/create",
      //   edit: "/events/edit/:id",
      //   meta: {
      //     label: "Répertoire",
      //     parent: "Evènements",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "event_types",
      //   list: "/event_types",
      //   show: "/event_types/show/:id",
      //   create: "/event_types/create",
      //   edit: "/event_types/edit/:id",
      //   meta: {
      //     label: "Catégories",
      //     parent: "Evènements",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "Opportunités",
      //   meta: {
      //     label: "Opportunités",
      //     icon: <CustomIconOpportunity />,
      //   },
      // },
      // {
      //   name: "opportunities",
      //   list: "/opportunities",
      //   show: "/opportunities/show/:id",
      //   create: "/opportunities/create",
      //   edit: "/opportunities/edit/:id",
      //   meta: {
      //     label: "Répertoire",
      //     parent: "Opportunités",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "opportunity_types",
      //   list: "/opportunity_types",
      //   show: "/opportunity_types/show/:id",
      //   create: "/opportunity_types/create",
      //   edit: "/opportunity_types/edit/:id",
      //   meta: {
      //     label: "Catégories",
      //     parent: "Opportunités",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "opportunity_targets",
      //   list: "/opportunity_targets",
      //   show: "/opportunity_targets/show/:id",
      //   create: "/opportunity_targets/create",
      //   edit: "/opportunity_targets/edit/:id",
      //   meta: {
      //     label: "Cibles",
      //     parent: "Opportunités",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "Offres d'emplois",
      //   meta: {
      //     label: "Offres d'emplois",
      //     icon: <CustomIconJob />,
      //   },
      // },
      // {
      //   name: "jobs",
      //   list: "/jobs",
      //   show: "/jobs/show/:id",
      //   create: "/jobs/create",
      //   edit: "/jobs/edit/:id",
      //   meta: {
      //     canDelete: true,
      //     label: "Répertoire",
      //     parent: "Offres d'emplois",
      //   },
      // },
      // {
      //   name: "Organisations",
      //   meta: {
      //     icon: <CustomIconOrganisation />,
      //   },
      // },
      {
        name: "organisations",
        list: "/organisations",
        show: "/organisations/show/:id",
        create: "/organisations/create",
        edit: "/organisations/edit/:id",
        meta: {
          icon: <CustomIconOrganisation />,
          canDelete: true,
          label: "Organisations",
        },
      },
      // {
      //   name: "organisations",
      //   list: "/organisations",
      //   show: "/organisations/show/:id",
      //   create: "/organisations/create",
      //   edit: "/organisations/edit/:id",
      //   meta: {
      //     label: "Répertoire",
      //     parent: "Organisations",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "organisation_types",
      //   list: "/organisation_types",
      //   show: "/organisation_types/show/:id",
      //   create: "/organisation_types/create",
      //   edit: "/organisation_types/edit/:id",
      //   meta: {
      //     label: "Catégories",
      //     parent: "Organisations",
      //     canDelete: true,
      //   },
      // },
      {
        name: "Utilisateurs",
        meta: {
          label: "Utilisateurs",
          icon: <UserOutlined />,
          canDelete: true,
          token: localStorage.getItem("refine-auth"),
        },
      },
      {
        name: "users",
        list: "/users",
        show: "/users/show/:id",
        create: "/users/create",
        edit: "/users/edit/:id",
        meta: {
          label: "Répertoire",
          parent: "Utilisateurs",
        },
      },
      {
        name: "user_roles",
        list: "/user_roles",
        show: "/user_roles/show/:id",
        create: "/user_roles/create",
        edit: "/user_roles/edit/:id",
        meta: {
          label: "Roles",
          parent: "Utilisateurs",
        },
      },
      {
        name: "user_types",
        list: "/user_types",
        show: "/user_types/show/:id",
        create: "/user_types/create",
        edit: "/user_types/edit/:id",
        meta: {
          label: "Catégories",
          parent: "Utilisateurs",
        },
      },
      // {
      //   name: "Champs & Propriétés",
      //   meta: {
      //     label: "Champs & Propriétés",
      //     icon: <SettingOutlined />,
      //   },
      // },
      // {
      //   name: "activity_areas",
      //   list: "/activity_areas",
      //   show: "/activity_areas/show/:id",
      //   create: "/activity_areas/create",
      //   edit: "/activity_areas/edit/:id",
      //   meta: {
      //     label: "Secteurs d'activités",
      //     parent: "Champs & Propriétés",
      //     canDelete: true,
      //   },
      // },
      {
        name: "profil",
        list: "/profil",
        edit: "profil/edit/:id",
        // show: "/users/show/:id",
        // create: "/users/create",
        meta: {
          label: "Profil",
          hided: true,
          // parent: "Utilisateurs",
        },
      },
    ],
    user: [
      {
        name: "Tableau de bord",
        list: "/",
        meta: {
          icon: <DashboardOutlined />,
        },
      },

      {
        // name: "Publications",
        name: "posts",
        list: "/posts",
        show: "/posts/show/:id",
        create: "/posts/create",
        meta: {
          label: "Publications",
          icon: <CustomIconArticle />,
          canDelete: false,
        },
      },
      // {
      //   name: "Publications",
      //   meta: {
      //     label: "Publications",
      //     icon: <CustomIconArticle />,
      //   },
      // },
      // {
      //   name: "posts",
      //   list: "/posts",
      //   show: "/posts/show/:id",
      //   create: "/posts/create",
      //   meta: {
      //     label: "Répertoire",
      //     parent: "Publications",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "Evènements",
      //   meta: {
      //     label: "Evènements",
      //     icon: <CustomIconEvent />,
      //   },
      // },
      // {
      //   name: "events",
      //   list: "/events",
      //   show: "/events/show/:id",
      //   create: "/events/create",
      //   meta: {
      //     label: "Répertoire",
      //     parent: "Evènements",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "Opportunités",
      //   meta: {
      //     label: "Opportunités",
      //     icon: <CustomIconOpportunity />,
      //   },
      // },
      // {
      //   name: "opportunities",
      //   list: "/opportunities",
      //   show: "/opportunities/show/:id",
      //   create: "/opportunities/create",
      //   meta: {
      //     label: "Répertoire",
      //     parent: "Opportunités",
      //     canDelete: true,
      //   },
      // },
      // {
      //   name: "Offres d'emplois",
      //   meta: {
      //     label: "Offres d'emplois",
      //     icon: <CustomIconJob />,
      //   },
      // },
      // {
      //   name: "jobs",
      //   list: "/jobs",
      //   show: "/jobs/show/:id",
      //   create: "/jobs/create",
      //   meta: {
      //     canDelete: true,
      //     label: "Répertoire",
      //     parent: "Offres d'emplois",
      //   },
      // },
      {
        name: "organisations",
        list: "/organisations",
        show: "/organisations/show/:id",
        create: "/organisations/create",
        edit: "/organisations/edit/:id",
        meta: {
          icon: <CustomIconOrganisation />,
          canDelete: true,
          label: "Organisations",
        },
      },
      // {
      //   name: "Organisations",
      //   meta: {
      //     icon: <CustomIconOrganisation />,
      //   },
      // },
      // {
      //   name: "organisations",
      //   list: "/organisations",
      //   show: "/organisations/show/:id",
      //   create: "/organisations/create",
      //   meta: {
      //     label: "Répertoire",
      //     parent: "Organisations",
      //     canDelete: true,
      //   },
      // },
      {
        name: "Utilisateurs",
        meta: {
          label: "Utilisateurs",
          icon: <UserOutlined />,
          canDelete: true,
        },
      },
      {
        name: "users",
        list: "/users",
        show: "/users/show/:id",
        create: "/users/create",
        meta: {
          label: "Répertoire",
          parent: "Utilisateurs",
        },
      },
      {
        name: "profil",
        list: "/profil",
        edit: "profil/edit/:id",
        // show: "/users/show/:id",
        // create: "/users/create",
        meta: {
          label: "Profil",
          hided: true,
          // parent: "Utilisateurs",
        },
      },
    ],
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <Refine
            dataProvider={dataProvider(API_URL)}
            notificationProvider={notificationProvider}
            routerProvider={routerBindings}
            authProvider={authProvider}
            // DashboardPage={CustomDashboard}
            i18nProvider={i18nProvider}
            resources={resources[userD?.role?.slug]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                    <ThemedLayoutV2
                      Sider={() => (
                        <ThemedSiderV2
                          Title={() => <ThemedTitleV2 collapsed />}
                        />
                      )}
                      Title={() => <ThemedTitleV2 collapsed />}
                      Header={() => <Header isSticky={true} />}
                    >
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <>
                  <Route
                    index
                    // element={<NavigateToResource resource="organisations" />}
                    element={
                      userD?.role?.slug === "contact" ? (
                        <ContactsWelcome />
                      ) : (
                        <CustomDashboard />
                      )
                    }
                  />

                  <Route path="organisation_types">
                    <Route index element={<OrganisationTypeList />} />
                    <Route path="show/:id" element={<OrganisationTypeShow />} />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributor>
                          <OrganisationTypeEdit />
                        </AdminOrContributor>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <AdminOrContributor>
                          <OrganisationTypeCreate />
                        </AdminOrContributor>
                      }
                    />
                  </Route>

                  <Route path="activity_areas">
                    <Route index element={<ActivityAreaList />} />
                    <Route path="show/:id" element={<OrganisationTypeShow />} />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributor>
                          <OrganisationTypeEdit />
                        </AdminOrContributor>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <AdminOrContributor>
                          <OrganisationTypeCreate />
                        </AdminOrContributor>
                      }
                    />
                  </Route>
                  <Route path="organisations">
                    <Route index element={<OrganisationList />} />
                    <Route path="show/:id" element={<OrganisationShow />} />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributor>
                          <OrganisationEdit />
                        </AdminOrContributor>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <AdminOrContributor>
                          <OrganisationCreate />
                        </AdminOrContributor>
                      }
                    />
                  </Route>
                  <Route path="jobs">
                    <Route index element={<JobList />} />
                    <Route path="show/:id" element={<JobShow />} />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributor>
                          <JobEdit />
                        </AdminOrContributor>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <AdminOrContributor>
                          <JobCreate />
                        </AdminOrContributor>
                      }
                    />
                  </Route>

                  <Route path="opportunity_types">
                    <Route index element={<OpportunityTypeList />} />
                    <Route path="show/:id" element={<OpportunityTypeShow />} />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributor>
                          <OpportunityTypeEdit />
                        </AdminOrContributor>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <AdminOrContributor>
                          <OpportunityTypeCreate />
                        </AdminOrContributor>
                      }
                    />
                  </Route>
                  <Route path="opportunity_targets">
                    <Route index element={<OpportunityTargetList />} />
                    <Route
                      path="show/:id"
                      element={<OpportunityTargetShow />}
                    />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributor>
                          <OpportunityTargetEdit />
                        </AdminOrContributor>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <AdminOrContributor>
                          <OpportunityTargetCreate />
                        </AdminOrContributor>
                      }
                    />
                  </Route>
                  <Route path="opportunities">
                    <Route index element={<OpportunityList />} />
                    <Route path="show/:id" element={<OpportunityShow />} />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributor>
                          <OpportunityEdit />
                        </AdminOrContributor>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <AdminOrContributor>
                          <OpportunityCreate />
                        </AdminOrContributor>
                      }
                    />
                  </Route>
                  <Route path="event_types">
                    <Route index element={<EventTypeList />} />
                    <Route path="show/:id" element={<EventTypeShow />} />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributor>
                          <EventTypeEdit />
                        </AdminOrContributor>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <AdminOrContributor>
                          <EventTypeCreate />
                        </AdminOrContributor>
                      }
                    />
                  </Route>
                  <Route path="events">
                    <Route index element={<EventList />} />
                    <Route path="show/:id" element={<EventShow />} />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributor>
                          <EventEdit />
                        </AdminOrContributor>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <AdminOrContributor>
                          <EventCreate />
                        </AdminOrContributor>
                      }
                    />
                  </Route>
                  <Route path="post_categories">
                    <Route index element={<PostCategoryList />} />
                    <Route path="show/:id" element={<PostCategoryShow />} />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributor>
                          <PostCategoryEdit />
                        </AdminOrContributor>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <AdminOrContributor>
                          <PostCategoryCreate />
                        </AdminOrContributor>
                      }
                    />
                  </Route>
                  <Route path="/post_labels">
                    <Route index element={<PostLabelList />} />
                    <Route path="show/:id" element={<PostLabelShow />} />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributor>
                          <PostLabelEdit />
                        </AdminOrContributor>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <AdminOrContributor>
                          <PostLabelCreate />
                        </AdminOrContributor>
                      }
                    />
                  </Route>
                  <Route path="posts">
                    <Route index element={<PostList />} />
                    <Route path="show/:id" element={<PostShow />} />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributor>
                          <PostEdit />
                        </AdminOrContributor>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <AdminOrContributor>
                          <PostCreate />
                        </AdminOrContributor>
                      }
                    />
                  </Route>
                  <Route path="user_roles">
                    <Route index element={<UserRoleList />} />
                    <Route path="show/:id" element={<UserRoleShow />} />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributor>
                          <UserRoleEdit />
                        </AdminOrContributor>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <AdminOrContributor>
                          <UserRoleCreate />
                        </AdminOrContributor>
                      }
                    />
                  </Route>
                  <Route path="user_types">
                    <Route index element={<UserTypeList />} />
                    <Route path="show/:id" element={<UserTypeShow />} />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributor>
                          <UserTypeEdit />
                        </AdminOrContributor>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <AdminOrContributor>
                          <UserTypeCreate />
                        </AdminOrContributor>
                      }
                    />
                  </Route>
                  <Route path="users">
                    <Route index element={<UserList />} />
                    <Route path="show/:id" element={<UserShow />} />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributorOrUser>
                          <UserEdit />
                        </AdminOrContributorOrUser>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <AdminOrContributorOrUser>
                          <UserCreate />
                        </AdminOrContributorOrUser>
                      }
                    />
                  </Route>
                  <Route path="profil">
                    <Route index element={<Profil />} />
                    <Route
                      path="edit/:id"
                      element={
                        <AdminOrContributorOrUser>
                          <ProfilEdit />
                        </AdminOrContributorOrUser>
                      }
                    />
                    {/* <Route path="show/:id" element={<UserShow />} /> */}
                    {/* <Route path="create" element={<UserCreate />} /> */}
                  </Route>
                </>
              </Route>
              <Route
                element={
                  <Authenticated fallback={<Outlet />}>
                    <NavigateToResource />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<Login />} />
                <Route
                  path="/register"
                  element={<RegisterPage title={<img />} />}
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>
            </Routes>
            <RefineKbar />
            <UnsavedChangesNotifier />
          </Refine>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
