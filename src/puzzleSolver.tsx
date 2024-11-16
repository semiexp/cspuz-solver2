import React from "react";
import { solveProblem, terminateWorker, SolverResult } from "./solverBackend";
import { AnswerViewer } from "./answerViewer";
import { Accordion, AccordionDetails, AccordionSummary, Button, CircularProgress, Fab, List, ListItem, ListItemButton, Popover, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ExpandMore, Settings } from "@mui/icons-material";

export const PuzzleSolver = () => {
  const [problemUrl, setProblemUrl] = React.useState("");
  const [solverRunning, setSolverRunning] = React.useState(false);
  const [result, setResult] = React.useState<SolverResult | undefined>(undefined);
  const [history, setHistory] = React.useState<SolverResult[]>([]);
  const [numMaxAnswer, setNumMaxAnswer] = React.useState(100);
  const [language, setLanguage] = React.useState<"ja" | "en">("ja");

  const changeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProblemUrl(e.target.value);
  };
  const changeNumMaxAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value);
    if (!isNaN(n) && n > 0) {
      setNumMaxAnswer(n);
    }
  };
  const solve = async (enumerateAnswers: boolean) => {
    const url = problemUrl;

    setResult(undefined);
    setSolverRunning(true);

    const result = await solveProblem(url, enumerateAnswers ? numMaxAnswer : 0);
    setResult(result);

    const newHistory = [result];
    newHistory.push(...history);
    setHistory(newHistory);
    setSolverRunning(false);
  };
  const stop = () => {
      terminateWorker();
  };
  const selectFromHistory = (i: number) => {
    if (solverRunning) {
      return;
    }
    const r = history[i];
    setProblemUrl(r.url);
    setResult(r);
  };

  let isUnique: boolean | undefined = undefined;
  if (result !== undefined && result.status === "success") {
    const r = result.result;
    if ("isUnique" in r) {
      isUnique = r.isUnique;
    }
  } else {
    isUnique = undefined;
  }

  let error: string | undefined = undefined;
  if (result !== undefined) {
    if (result.status === "error") {
      error = result.error;
    } else if (result.status === "terminated") {
      error = (language === "ja") ? "中断しました" : "Terminated";
    } else if (result.status === "noAnswer") {
      error = (language === "ja") ? "解がありません" : "No answer";
    }
  }
  let message: string | undefined = undefined;
  if (result !== undefined && result.status === "success") {
    if (language === "ja") {
      message = `解けました！(${result.elapsed}ms)`;
    } else {
      message = `Solved! (${result.elapsed}ms)`;
    }
  }
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(null);
  const handleConfigButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <div style={{width: "100%"}}>
        <div style={{width: "100%", maxWidth: "800px"}}>
          <Grid container sx={{display: "flex", width: "100%"}}>
            <Grid size={9} sx={{display: "flex", alignItems: "center"}}>
              <Fab color="default" size="small" sx={{marginRight: 1}} onClick={handleConfigButtonClick}>
                <Settings />
              </Fab>
              <TextField label={language == "ja" ? "問題 URL" : "Problem URL"} value={problemUrl} onChange={changeUrl} fullWidth />
            </Grid>
            {
              solverRunning ? (
                <Grid size={3}>
                  <Button variant="outlined" color="error" size="large" onClick={stop} sx={{width: "100%", height: "100%"}}>
                    <CircularProgress size={24} sx={{marginRight: 1}} />
                    {language == "ja" ? "停止" : "Stop"}
                  </Button>
                </Grid>
              ) : (<>
                <Grid size={1.5}>
                  <Button variant="outlined" size="large" onClick={() => solve(false)} sx={{width: "100%", height: "100%"}}>
                    {language == "ja" ? "解答" : "Solve"}
                  </Button>
                </Grid>
                <Grid size={1.5}>
                  <Button variant="outlined" size="large" onClick={() => solve(true)} sx={{width: "100%", height: "100%"}}>
                    {language == "ja" ? "列挙" : "List"}
                  </Button>
                </Grid>
              </>)
            }
          </Grid>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>{language == "ja" ? "履歴" : "History"}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{maxHeight: "300px", overflowY: "auto"}}>
              <List>
                {history.map((r, i) => (
                  <ListItemButton
                    key={i}
                    onClick={() => selectFromHistory(i)}
                    sx={{overflow: "hidden", textWrap: "nowrap", textOverflow: "ellipsis", whiteSpace: "nowrap"}}
                  >
                    <Typography>{r.url}</Typography>
                  </ListItemButton>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </div>
        <div>
        {
          error &&
          <span style={{color: "red"}}>Error: {error}</span>
        }
        {
          message &&
          <span style={{color: "black"}}>{message}</span>
        }
        {
          isUnique === true &&
          <span style={{color: "blue"}}> {language === "ja" ? "唯一解です" : "Unique answer"}</span>
        }
        {
          isUnique === false &&
          <span style={{color: "red"}}> {language === "ja" ? "複数解があります！" : "NOT unique answer (multiple answers)!"}</span>
        }
        </div>
        {
          result && result.status === "success" && <AnswerViewer result={result.result} />
        }
      </div>
      <Popover
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List>
          <ListItem>
            <Typography sx={{paddingRight: 1}}>Language: </Typography>
            <ToggleButtonGroup
              color="primary"
              value={language}
              onChange={(e, value) => setLanguage(value)}
              exclusive
            >
              <ToggleButton value="ja">日本語</ToggleButton>
              <ToggleButton value="en">English</ToggleButton>
            </ToggleButtonGroup>
          </ListItem>
          <ListItem>
            <Typography sx={{paddingRight: 1}}>
              {language == "ja" ? "最大解答数:" : "Max Answers:"}
            </Typography>
            <TextField
              type="number"
              value={numMaxAnswer}
              onChange={changeNumMaxAnswer}
              slotProps={{htmlInput: {size: 6}}}
            />
          </ListItem>
        </List>
      </Popover>
    </>
  )
};
