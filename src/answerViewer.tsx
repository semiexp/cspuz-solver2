import { useEffect, useState } from "react";
import { MultipleAnswers, Result, renderBoard } from "./puzzleBoard";

type AnswerViewerProps = {
  result: Result,    
};

const MultipleAnswerViewer = (result: MultipleAnswers) => {
  const [pos, setPos] = useState(0);
  useEffect(() => setPos(0), [result]);

  let numAnswers = result.answers.length;
  return <div>
    <div>
      <input type="button" value="<<" onClick={() => setPos(0)} disabled={pos == 0} />
      <input type="button" value="<" onClick={() => setPos(pos - 1)} disabled={pos == 0} />
      <input type="button" value=">" onClick={() => setPos(pos + 1)} disabled={pos + 1 >= numAnswers} />
      <input type="button" value=">>" onClick={() => setPos(numAnswers - 1)} disabled={pos + 1 >= numAnswers} />
      <span>
        {` ${pos + 1} / ${result.answers.length}`}
      </span>
    </div>
    {
      renderBoard([result.answers[pos], result.common])
    }
  </div>;
};

export const AnswerViewer = (props: AnswerViewerProps) => {
  const result = props.result;

  if ("common" in result) {
    return MultipleAnswerViewer(result);
  } else {
    return renderBoard([result]);
  }
};
