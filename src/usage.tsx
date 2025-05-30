import { Box, Typography } from "@mui/material";
import Puzzles from "./puzzles.json";

const puzzleList = (language: "ja" | "en", mode: "solve" | "enumerate") => {
  const sep = language === "ja" ? "、" : ", ";

  return Puzzles[mode].map((puzzle) => puzzle[language]).join(sep);
};

export const Usage = (props: {language: "ja" | "en"}) => {
  const language = props.language;

  const currentUrl = location.protocol + "//" + location.host + location.pathname;
  const bookmarkUrl = 'javascript:void(window.open(`' + currentUrl + '#url=${encodeURIComponent(ui.puzzle.getURL(pzpr.parser.URL_PZPRV3))}`,target="__solver_window"))';

  return (<Box sx={{overflowY: "scroll", maxHeight: "600px"}}>
    <Typography variant="h5">
      {
        language === "ja" ? "概要" : "Overview"
      }
    </Typography>
    <Typography>
      {
        language === "ja" ? (
          <p>
            「数独」などのペンシルパズルを解くためのソルバーです。
            対応しているパズルであれば、どんな問題であっても（十分に時間をかければ）解くことができます。
          </p>
        ) : (
          <p>
            This is a solver for pencil puzzles such as "Sudoku".
            This solver can solve any problems of supported puzzles (given enough time).
          </p>
        )
      }
    </Typography>
    <Typography variant="h5">
      {
        language === "ja" ? "使い方" : "Usage"
      }
    </Typography>
    <Typography>
      {
        language === "ja" ? (
          <p>
            「問題 URL」に問題の URL (ぱずぷれ / puzz.link / Kudamono Editor) を入力し、「解答」ボタンを押すと、下に解答が表示されます。
            また、「列挙」ボタンを押すと、設定（歯車アイコン）の「最大解答数」で指定した個数を上限に、解を列挙することができます。
            時間がかかりすぎる場合には「停止」ボタンを押して解答を途中で停止させることも可能です。
          </p>
        ) : (
          <p>
            Input the problem URL (pzv.jp / puzz.link / Kudamono Editor) to "Problem URL" and press the "Solve" button to display the answer.
            If you wish to enumerate all answers (up to "Max Answers" in the setting), press the "List" button.
            You can stop the solver by pressing the "Stop" button if it takes too long.
          </p>
        )
      }
      {
        language === "ja" ? (
          <p>
            「解答」ボタンでの解答では、問題を「解ける限り」解きます。 つまり、複数解がある場合でも、すべての解に共通して決定する線、マスなどをすべて決定します。
          </p>
        ) : (
          <p>
            This solver will solve the problem "as much as possible" when you press the "Solve" button. In other words, it will report all lines, cells, etc. that are common to all solutions, even if there are multiple solutions.
          </p>
        )
      }
      {
        language === "ja" ? (
          <p>
            「履歴」から過去に解答させた問題（最大 50 件）の解答結果を確認することもできます。
            ページをリロードすると「履歴」は消えてしまうためご注意ください。
          </p>
        ) : (
          <p>
            You can also check the results of problems solved in the past (up to 50) from the "History".
            Please note that the "History" will be cleared when you reload the page.
          </p>
        )
      }
      {
        language === "ja" ? (
          <p>
            このソルバーは、あなたのマシンの CPU を使って解答のための計算を行います。
            そのため、解答中はマシンの動作が遅くなる可能性がありますが、ご了承ください。
            一方で、このソルバーは解答させた問題の情報をサーバーに送信することはないため、雑誌に投稿する問題のチェックなどにも安心してご利用いただくことができます。
          </p>
        ) : (
          <p>
            This solver uses your machine's CPU to perform calculations for the answer.
            Therefore, your machine may run slower while solving, but please be aware of this.
            On the other hand, this solver does not send any information about the problems you solve to the server, so you can safely use it for checking problems to be posted in magazines, etc.
          </p>
        )
      }
    </Typography>
    <Typography variant="h5">
      {
        language === "ja" ? "puzz.link 連携" : "puzz.link Integration"
      }
    </Typography>
    <Typography>
      {
        language === "ja" ? (
          <p>
            下のリンクをブックマークに登録し、puzz.link の問題作成画面でこのブックマークを開くと、新しいウィンドウ / タブでソルバーを開いて解答結果を確認することができます。
          </p>
        ) : (
          <p>
            Bookmark the link below, and open this bookmark in the problem editor site of puzz.link to open the solver in a new window/tab and check the answer.
          </p>
        )
      }
      <p>
      </p>

      <p>
        <a href={bookmarkUrl}>{language === "ja" ? "ブックマーク登録用URL" : "Bookmark URL"}</a>
      </p>
    </Typography>
    <Typography variant="h5">
      {language === "ja" ? "対応パズル一覧" : "List of supported puzzles"}
    </Typography>
    <Typography>
      <p>
        {language === "ja" ? "解答" : "Solve"}: {puzzleList(language, "solve")}
      </p>
      <p>
        {language === "ja" ? "列挙" : "List"}: {puzzleList(language, "enumerate")}
      </p>
    </Typography>
    <Typography variant="h5">
      {language === "ja" ? "免責事項" : "Disclaimer"}
    </Typography>
    <Typography>
      {
        language === "ja" ? (
          <p>
            このソルバーを使用することによって生じたいかなる問題についても、作者は責任を負わないものとします。
          </p>
        ) : (
          <p>
            The author shall not be liable for any problem caused by using this solver.
          </p>
        )
      }
    </Typography>
    <Typography>
      <p>
        <a href="license.txt">
          {language === "ja" ? "ライセンス" : "License"}
        </a>
      </p>
    </Typography>
  </Box>);
};
