import Icons from "./icon-path.json";

type IconProps = { className?: string };

const _Icon = (
  symbol: keyof typeof Icons,
  { className }: IconProps = {},
  width = 512,
) => (
  <svg
    className={className ? className + " icon" : "icon"}
    viewBox={`0 0 ${width} 512`}
  >
    <path fill="currentColor" d={Icons[symbol]} />
  </svg>
);

export const IconDelete = (props?: IconProps) => _Icon("DELETE", props, 448);
export const IconEdit = (props?: IconProps) => _Icon("EDIT", props);
export const IconFolderOpen = (props?: IconProps) =>
  _Icon("FOLDER_OPEN", props, 576);
export const IconMicrophone = (props?: IconProps) =>
  _Icon("MICROPHONE", props, 352);
export const IconMicrophoneSlash = (props?: IconProps) =>
  _Icon("MICROPHONE_SLASH", props, 640);
export const IconPlay = (props?: IconProps) => _Icon("PLAY", props, 384);
export const IconPlus = (props?: IconProps) => _Icon("PLUS", props, 448);
export const IconSearch = (props?: IconProps) => _Icon("SEARCH", props);
export const IconSettings = (props?: IconProps) => _Icon("SETTINGS", props);
export const IconSpinner = (props?: IconProps) => _Icon("SPINNER", props);
export const IconTimes = (props?: IconProps) => _Icon("TIMES", props, 352);
