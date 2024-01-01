"use client";

import { useState } from "react";
import { HiAdjustments, HiHome, HiUser } from "react-icons/hi";
import CalendarComponent from "../doctor/calendarComponent";
import PatientLookup from "../doctor/patientLookup";
import { Patient } from "@prisma/client";
import { Tab, Tabs } from "../components/tabs";
import PatientDataProvider from "@/app/_lib/contexts/PatientDataProvider";
import { getFullPatientProfileById } from "@/app/_lib/data";

interface IDashboardTabsComponent {
  appointments: any[];
  patients: any[];
  currentUserId: number;
}

export default function DashboardTabs(props: IDashboardTabsComponent) {
  const { appointments, patients, currentUserId } = props;
  const [patientTabs, setPatientTabs] = useState<Patient[]>([]);
  const [activeTab, setActiveTab] = useState(-1);

  async function openPatientTab(patient: Patient) {
    let x = await getFullPatientProfileById(patient.id);
    console.log(x);
    if (!patientTabs.find((tab) => tab.id === patient.id)) {
      setPatientTabs([...patientTabs, patient]);
    }
  }

  function closePatientTab(id: number) {
    const index = patientTabs.findIndex((tab) => tab.id === id);
    const updatedTabs = patientTabs.filter((tab) => tab.id !== id);
    setPatientTabs(updatedTabs);

    if (index > 0) {
      // Set active tab to the one before the closed tab
      setActiveTab(updatedTabs[index - 1].id);
    } else if (updatedTabs.length > 0) {
      // If the first tab is closed and there are other tabs, set active to the new first tab
      setActiveTab(updatedTabs[0].id);
    } else {
      // If there are no more tabs, set active tab to -1
      setActiveTab(-1);
    }
  }

  function getFullPatientProfile(id: number) {}

  return (
    <div className="flex flex-col gap-3">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
        <Tab icon={HiHome} key="home" label="home" hideLabel={true} tabId={-1}>
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
        </Tab>
        <Tab
          icon={HiUser}
          key="profile"
          label="profile"
          hideLabel={true}
          tabId={-2}
        >
          Content for Tab 2
        </Tab>
        <Tab
          icon={HiAdjustments}
          key="settings"
          label="settings"
          hideLabel={true}
          tabId={-3}
        >
          Content for Tab 3
        </Tab>
        {patientTabs.map((patient) => (
          <Tab
            key={patient.id}
            label={`${patient.firstName} ${patient.lastName}`}
            tabId={patient.id}
            canCloseTabFunction={closePatientTab}
          >
            <PatientDataProvider patient={getFullPatientProfile(patient.id)}>
              {`${patient.firstName} ${patient.lastName}`}
            </PatientDataProvider>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
