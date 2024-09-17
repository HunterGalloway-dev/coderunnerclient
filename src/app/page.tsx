"use client";

import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { useState } from "react";
import ConditionalRender from "./components";

type CodeResultOutput = {
  Output: string;
  Err: string;
  RunTime: number;
};

type Language = {
  language: string;
  defaultCode: string;
  fileName: string;
};

export default function Home() {
  const js: Language = {
    language: "javascript",
    defaultCode: 'console.log("Hello World!")',
    fileName: "main.js",
  };

  const go: Language = {
    language: "go",
    fileName: "main.go",
    defaultCode:
      'package main\nimport "fmt"\nfunc main() {\n\tfmt.Println("Hello World")\n}',
  };

  const languages = new Map<string, Language>([
    ["javascript", js],
    ["go", go],
  ]);

  const [lang, setLang] = useState<Language>(languages.get("javascript")!);
  const [val, setVal] = useState(languages.get("javascript")?.defaultCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const onRun = async () => {
    setIsRunning(true);
    setOutput("Running...");
    const res = await axios.post(process.env.NEXT_PUBLIC_CODERUNNER!, {
      language: lang.language,
      stdin: "Hunter",
      mainFilePath: lang.fileName,
      files: [
        {
          path: lang.fileName,
          content: val,
        },
      ],
    });
    const result = res.data as CodeResultOutput;

    setOutput(
      `${result.Output}${result.Err}Runtime: ${Math.floor(
        result.RunTime / 1000000
      )}ms\n`
    );
    setIsRunning(false);
  };

  return (
    <div>
      <div className="navbar">
        <div className="navbar-start"></div>
        <div className="navbar-center">
          <button
            disabled={isRunning}
            className="btn btn-primary"
            onClick={onRun}
          >
            Run
          </button>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-primary m-1">
              Language
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              {Array.from(languages).map(([key, langVal]) => (
                <li key={key}>
                  <button
                    className="btn"
                    onClick={() => {
                      console.log(val);
                      setLang(langVal);
                      setVal(langVal.defaultCode);
                    }}
                  >
                    {key}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="navbar-end"></div>
      </div>
      <ConditionalRender render={isRunning}>
        <progress className="progress"></progress>
      </ConditionalRender>
      <Editor
        height="600px"
        language={lang.language}
        theme="vs-dark"
        value={val}
        onChange={(val) => {
          setVal(val);
        }}
        options={{
          readOnly: isRunning,
          fontSize: 16,
          formatOnType: true,
          minimap: { scale: 10 },
          inlineSuggest: {},
        }}
      />
      <div className="p-2 h-full">
        {output.split("\n").map((v, i) => (
          <span className="flex" key={i}>
            <p className="text-success">B:\BuntServer: CodeRunner $ </p>
            <p>{v}</p>
          </span>
        ))}
      </div>
    </div>
  );
}
