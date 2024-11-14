import React from "react";
import { Result } from "./puzzleBoard";
import { solveProblem, terminateWorker } from "./solverBackend";
import { AnswerViewer } from "./answerViewer";
import { Button, CircularProgress, Fab, List, ListItem, Popover, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Settings } from "@mui/icons-material";

export const PuzzleSolver = () => {
  const [problemUrl, setProblemUrl] = React.useState("");
  const [solverRunning, setSolverRunning] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [message, setMessage] = React.useState<string | undefined>(undefined);
  const [result, setResult] = React.useState<Result | undefined>(undefined);
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

    setError(undefined);
    setResult(undefined);
    setMessage(undefined);
    setSolverRunning(true);

    const start = Date.now();

    try {
      const result = await solveProblem(url, enumerateAnswers ? numMaxAnswer : 0);
      const elapsed = (Date.now() - start) / 1000;

      if (typeof result === "string") {
        setError(result);
        setSolverRunning(false);
      } else {
        setResult(result);
        setMessage("Done! (" + elapsed + "[s])");
        setSolverRunning(false);
      }
    } catch (e: any) {
      setError(e);
      setSolverRunning(false);
    }
  };
  const stop = () => {
      terminateWorker();
  };

  let isUnique;
  if (result !== undefined && !("answers" in result)) {
    isUnique = result.isUnique;
  } else {
    isUnique = undefined;
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(null);
  const handleConfigButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <div style={{width: "100%"}}>
        <div style={{width: "100%"}}>
          <Grid container sx={{display: "flex", width: "100%", maxWidth: "800px"}}>
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
          <span style={{color: "blue"}}> Unique answer</span>
        }
        {
          isUnique === false &&
          <span style={{color: "red"}}> NOT unique answer (multiple answers)!</span>
        }
        </div>
        {
          result && <AnswerViewer result={result} />
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
