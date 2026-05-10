import { useCallback } from "react";
import { CategoryConfig } from "../services/storage/base";
import { TrackService } from "../services/TrackService";
import { Input } from "./base/Input";

export type SettingsCategoryProps = { config: CategoryConfig; ID: string };

export const SettingsCategory: React.FC<SettingsCategoryProps> = ({
  ID,
  config: { name, regex, color },
  config,
}) => {
  const onChangeColor = useCallback(
    (color: string) => {
      TrackService.setCategoryConfig(ID as any, { ...config, color });
    },
    [ID, config],
  );
  const onChangeRegex = useCallback(
    (regex: string) => {
      TrackService.setCategoryConfig(ID as any, { ...config, regex });
    },
    [ID, config],
  );
  return (
    <tr>
      <td>{name}</td>
      <td>
        <Input
          name={"category-color"}
          type={"color"}
          value={color}
          onChange={onChangeColor}
        />
      </td>
      <td className={"settings__category-regex"}>
        <Input name={"category-regex"} value={regex} onChange={onChangeRegex} />
      </td>
    </tr>
  );
};
