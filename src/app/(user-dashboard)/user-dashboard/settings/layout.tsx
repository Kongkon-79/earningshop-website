import type { ReactNode } from "react";
import SettingsTabs from "./_components/settings-tabs";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="flex py-[var(--dashboard-gutter)]">
        <SettingsTabs />
      </div>
      {children}
    </>
  );
}
