import { Global } from "@emotion/react";
import {
  Fragment,
  // useEffect
} from "react";
import tw, { GlobalStyles as BaseStyles, css } from "twin.macro";
import { useEffectOnce } from "usehooks-ts";
// import { useTernaryDarkMode } from "usehooks-ts";

const customStyles = css`
  * {
    -webkit-tap-highlight-color: transparent;
  }

  .light {
    color-scheme: light;
    --color-background: 255 255 255;
    --color-on-background: 0 0 0;
    --color-surface: 255 255 255;
    --color-on-surface: 0 0 0;
    --color-primary: 0 79 159;
    --color-on-primary: 0 31 61;
    --color-accent: 255 230 0;
    --color-on-accent: 61 55 0;
  }
  .dark {
    color-scheme: dark;
    --color-background: 30 41 59;
    --color-on-background: 255 255 255;
    --color-surface: 41 53 72;
    --color-on-surface: 255 255 255;
    --color-primary: 0 79 159;
    --color-on-primary: 0 0 0;
  }

  html,
  body,
  #root {
    ${tw`h-full`}
  }

  html {
    overflow: hidden;
  }

  body {
    ${tw`bg-background text-on-background transition duration-200`}
  }
`;

const GlobalStyles = () => {
  //#region Dark mode management
  // const { isDarkMode } = useTernaryDarkMode();
  // useEffect(() => {
  //   const root = window.document.documentElement;
  //   root.classList.remove(isDarkMode ? "light" : "dark");
  //   root.classList.add(isDarkMode ? "dark" : "light");
  // }, [isDarkMode]);

  useEffectOnce(() => {
    const root = window.document.documentElement;
    root.classList.add("light");
  });
  //#endregion Dark mode management

  return (
    <Fragment>
      <BaseStyles />
      <Global styles={customStyles} />
    </Fragment>
  );
};

export default GlobalStyles;
