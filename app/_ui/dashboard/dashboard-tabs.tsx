"use client";

import { Button, CustomFlowbiteTheme, Tabs, TabsRef } from "flowbite-react";
import { useRef, useState } from "react";
import { HiAdjustments, HiClipboardList, HiHome } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import CalendarComponent from "../doctor/calendar-component";
import PatientLookup from "../doctor/patient-lookup";

interface IDashboardTabsComponent {
  appointments: any[];
  patients: any[];
  currentUserId: number;
}

export default function DashboardTabs(props: IDashboardTabsComponent) {
  const { appointments, patients, currentUserId } = props;
  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <Tabs
        aria-label="Default tabs"
        style="default"
        className="dashboard-tab-sticky"
        ref={tabsRef}
        onActiveTabChange={(tab) => setActiveTab(tab)}
      >
        <Tabs.Item active title="Home" icon={HiHome}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <CalendarComponent
                appointments={appointments}
                patients={patients}
                currentUserId={currentUserId}
              />
            </div>
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <PatientLookup />
                </div>
                <div>extra col</div>
              </div>
            </div>
          </div>
        </Tabs.Item>
        <Tabs.Item title="Dashboard" icon={MdDashboard}>
          This is{" "}
          <span className="font-medium text-gray-800 dark:text-white">
            Dashboard tabs associated content
          </span>
          . Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling.
        </Tabs.Item>
        <Tabs.Item title="Settings" icon={HiAdjustments}>
          This is{" "}
          <span className="font-medium text-gray-800 dark:text-white">
            Settings tabs associated content
          </span>
          . Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling.
        </Tabs.Item>
        <Tabs.Item title="Contacts" icon={HiClipboardList}>
          This is{" "}
          <span className="font-medium text-gray-800 dark:text-white">
            Contacts tabs associated content
          </span>
          . Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling.
        </Tabs.Item>
        <Tabs.Item disabled title="Disabled">
          Disabled content
        </Tabs.Item>
      </Tabs>
    </div>
  );
}
