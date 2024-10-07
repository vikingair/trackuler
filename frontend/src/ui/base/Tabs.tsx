import React, { useEffect, useMemo, useRef } from "react";
import { Utils } from "../../services/utils";

export type TabsProps<K extends string> = {
  tabs: Record<K, React.ReactNode>;
  onClick: (value: K) => void;
  current: string;
  children: React.ReactNode;
};

export const Tabs = <K extends string>({
  tabs,
  onClick,
  current,
  children,
}: TabsProps<K>): React.ReactElement => {
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const tabOptions = useMemo(
    () =>
      Object.entries(tabs).map(([value, node]) => ({
        value: value as K,
        node: node as React.ReactNode,
      })),
    [tabs],
  );

  const activeTab = tabOptions.findIndex(({ value }) => value === current);
  useEffect(() => {
    if (tabsRef.current) {
      const nav = tabsRef.current.children[1] as HTMLElement;
      const { left: leftNav, width: navWidth } = nav.getBoundingClientRect();
      const activeNode = nav.children[activeTab] as HTMLDivElement;
      const { left, width } = activeNode.getBoundingClientRect();

      (tabsRef.current.children[0] as HTMLSpanElement).style.setProperty(
        "--left",
        left - leftNav + "px",
      );
      (tabsRef.current.children[0] as HTMLSpanElement).style.setProperty(
        "--width",
        width + "px",
      );

      tabsRef.current.scrollTo(-navWidth / 2 + left - leftNav, 0);
    }
  }, [activeTab]);

  return (
    <>
      <div className="tabs" ref={tabsRef}>
        <span className="snap-indicator" />
        <nav>
          {tabOptions.map(({ node, value }) => (
            <button
              key={value}
              title={value}
              onClick={() => onClick(value)}
              className={Utils.classNames(current === value && "tab-active")}
            >
              {node}
            </button>
          ))}
        </nav>
      </div>
      <div className="tabs__content">{children}</div>
    </>
  );
};
