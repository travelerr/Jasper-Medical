import { ActionResponse } from "@/app/_lib/definitions";
import React from "react";

interface IActionResponseMessage {
  actionResponse: ActionResponse;
  renderResult?: boolean;
  actionSuceededClasses?: string;
  resultClasses?: string;
}

export const ActionResponseMessage = (props: IActionResponseMessage) => {
  const { actionResponse, renderResult, actionSuceededClasses, resultClasses } =
    props;

  const successStyle = "text-green-500";
  const errorStyle = "text-red-500";

  return (
    <div>
      <div
        className={`${
          actionResponse.actionSuceeded ? successStyle : errorStyle
        } ${actionSuceededClasses}`}
      >
        {actionResponse.message}
      </div>
      {renderResult ? (
        <div className={`${resultClasses}`}>{actionResponse.result}</div>
      ) : null}
    </div>
  );
};
