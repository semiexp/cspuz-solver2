import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Puzzles from "./puzzles.json";

const puzzleList = (language: "ja" | "en", mode: "solve" | "enumerate") => {
  const sep = language === "ja" ? "、" : ", ";

  return Puzzles[mode].map((puzzle) => puzzle[language]).join(sep);
};

export const Usage = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language as "ja" | "en";

  const currentUrl = location.protocol + "//" + location.host + location.pathname;
  const bookmarkUrl = 'javascript:void(window.open(`' + currentUrl + '#url=${encodeURIComponent(ui.puzzle.getURL(pzpr.parser.URL_PZPRV3))}`,target="__solver_window"))';

  const cspuzSolver2Version = document
    .querySelector('meta[name="revision-cspuz-solver2"]')
    ?.getAttribute("content");
  const cspuzCoreVersion = document
    .querySelector('meta[name="revision-cspuz-core"]')
    ?.getAttribute("content");
  const buildDate = document
    .querySelector('meta[name="build-date"]')
    ?.getAttribute("content");

  return (<Box sx={{overflowY: "scroll", maxHeight: "600px"}}>
    <Typography variant="h5">
      {t("usage.overview")}
    </Typography>
    <Typography>
      <p>{t("usage.overviewText")}</p>
    </Typography>
    <Typography variant="h5">
      {t("usage.usage")}
    </Typography>
    <Typography>
      <p>{t("usage.usageText1")}</p>
      <p>{t("usage.usageText2")}</p>
      <p>{t("usage.usageText3")}</p>
      <p>{t("usage.usageText4")}</p>
    </Typography>
    <Typography variant="h5">
      {t("usage.puzzleLinkIntegration")}
    </Typography>
    <Typography>
      <p>{t("usage.puzzleLinkIntegrationText")}</p>
      <p></p>

      <p>
        <a href={bookmarkUrl}>{t("usage.bookmarkUrl")}</a>
      </p>
    </Typography>
    <Typography variant="h5">
      {t("usage.supportedPuzzles")}
    </Typography>
    <Typography>
      <p>
        {t("usage.solve")}: {puzzleList(language, "solve")}
      </p>
      <p>
        {t("usage.listAnswers")}: {puzzleList(language, "enumerate")}
      </p>
    </Typography>
    <Typography variant="h5">
      {t("usage.disclaimer")}
    </Typography>
    <Typography>
      <p>{t("usage.disclaimerText")}</p>
    </Typography>
    <Typography variant="h5">
      {t("usage.versionInfo")}
    </Typography>
    <Typography>
      {cspuzSolver2Version && (
        <>
          <a href="https://github.com/semiexp/cspuz-solver2">
            cspuz-solver2
          </a>
          : {cspuzSolver2Version} <br />
        </>
      )}
      {cspuzCoreVersion && (
        <>
          <a href="https://github.com/semiexp/cspuz_core">cspuz-core</a>
          : {cspuzCoreVersion} <br />
        </>
      )}
      {buildDate && (
        <>
          {t("usage.buildDate")}: {buildDate} <br />
        </>
      )}
    </Typography>
    <Typography>
      <p>
        <a href="license.txt">
          {t("usage.license")}
        </a>
      </p>
    </Typography>
    <Typography variant="h5">
      {t("usage.contact")}
    </Typography>
    <Typography>
      <p>{t("usage.contactText")}</p>
      <ul>
        <li>
          <a href="https://github.com/semiexp/cspuz-solver2/issues">GitHub</a>
        </li>
        <li>
          <a href="https://twitter.com/semiexp">Twitter (@semiexp)</a>
        </li>
      </ul>
    </Typography>
  </Box>);
};
