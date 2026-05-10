import React from "react";
import { IconFolderOpen } from "../icons/icon";
import { StorageType } from "../services/storage/base";
import { WorkdirStorage } from "../services/storage/WorkdirStorage";
import { useSub } from "../store";
import { Aside } from "./Aside";
import { Main } from "./Main";

export const App: React.FC = () => {
  const { workdirAccessGranted, trackType, workdirName, currentKey } = useSub(
    ({ workdirAccessGranted, trackType, workdirName, currentKey }) => ({
      workdirAccessGranted,
      trackType,
      workdirName,
      currentKey,
    }),
  );

  return (
    <div className="App" key={currentKey}>
      <header>
        <h1>
          <img
            id={"logo-img"}
            src={import.meta.env.BASE_URL + "favicon.svg"}
            alt={"logo"}
            height={24}
            width={24}
          />{" "}
          Trackuler
        </h1>
      </header>
      {!trackType ? null : trackType === StorageType.FILE_SYSTEM &&
        !workdirAccessGranted ? (
        <div className={"workdir-access"}>
          <p>Grant read & write access to workdir: "{workdirName}"</p>
          <button
            className={"icon-button"}
            onClick={WorkdirStorage.init}
            title={"open workdir"}
            aria-label={"open workdir"}
          >
            <IconFolderOpen />
          </button>
        </div>
      ) : (
        <div className="content">
          <Main />
          <Aside />
        </div>
      )}
    </div>
  );
};
