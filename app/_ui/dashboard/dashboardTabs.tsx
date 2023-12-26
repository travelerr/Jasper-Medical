"use client";

import { Tabs, TabsRef } from "flowbite-react";
import { useRef, useState } from "react";
import { HiAdjustments, HiClipboardList, HiHome, HiX } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import CalendarComponent from "../doctor/calendarComponent";
import PatientLookup from "../doctor/patientLookup";
import { Patient } from "@prisma/client";
import styles from "./DashboardTabs.module.css";

interface IDashboardTabsComponent {
  appointments: any[];
  patients: any[];
  currentUserId: number;
}

export default function DashboardTabs(props: IDashboardTabsComponent) {
  const { appointments, patients, currentUserId } = props;
  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [patientTabs, setPatientTabs] = useState<Patient[]>([]);

  function openPatientTab(patient: Patient) {
    setPatientTabs([...patientTabs, patient]);
    console.log(patientTabs);
  }

  return (
    <div className="flex flex-col gap-3">
      <Tabs
        aria-label="Default tabs"
        style="default"
        className={styles.dashboardTabs}
        ref={tabsRef}
        onActiveTabChange={(tab) => setActiveTab(tab)}
      >
        <Tabs.Item
          active
          title="Home"
          style={{ backgroundColor: "red" }}
          icon={HiHome}
        >
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
                  <PatientLookup openPatientTab={openPatientTab} />
                </div>
                <div>extra col</div>
              </div>
            </div>
          </div>
        </Tabs.Item>
        <Tabs.Item title="Dashboard" icon={MdDashboard}>
          Tab 1
        </Tabs.Item>
        <Tabs.Item title="Settings" icon={HiAdjustments}>
          TTab 2
        </Tabs.Item>
        <Tabs.Item title="Contacts" icon={HiClipboardList}>
          Tab 3
        </Tabs.Item>
        {patientTabs.map((patient) => {
          return (
            <Tabs.Item
              key={patient.id}
              title={`${patient.firstName} ${patient.lastName}`}
              icon={HiX}
            >
              Tab 3
            </Tabs.Item>
          );
        })}
      </Tabs>
    </div>
  );
}
