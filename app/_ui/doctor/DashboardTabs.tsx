"use client";

import { useEffect, useState } from "react";
import { HiPlus, HiHome, HiUser } from "react-icons/hi";
import { Patient } from "@prisma/client";
import PatientDataProvider from "@/app/_lib/contexts/PatientDataProvider";
import { getFullPatientProfileById } from "@/app/_lib/data";
import CalendarComponent from "./CalendarComponent";
import PatientLookup from "./PatientLookup";
import { Tab, Tabs } from "./Tabs";
import PatientChart from "./PatientChart";
import { FullPatientProfile } from "@/app/_lib/definitions";

interface IDashboardTabsComponent {
  appointments: any[];
  patients: any[];
  currentUserId: number;
}

interface PatientProfile {
  [key: number]: FullPatientProfile;
}

export default function DashboardTabs(props: IDashboardTabsComponent) {
  const { appointments, patients, currentUserId } = props;
  const [patientTabs, setPatientTabs] = useState<Patient[]>([]);
  const [activeTab, setActiveTab] = useState(-1);
  const [patientProfiles, setPatientProfiles] = useState<PatientProfile>({});

  function openPatientTab(patient: Patient) {
    if (!patientTabs.find((tab) => tab.id === patient.id)) {
      setPatientTabs([...patientTabs, patient]);
      setActiveTab(patient.id);
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

  useEffect(() => {
    // Load tabs from local storage
    const savedTabs = localStorage.getItem("patientTabs");
    if (savedTabs) {
      setPatientTabs(JSON.parse(savedTabs));
    }
    const savedActiveTab = localStorage.getItem("activePatientTab");
    if (savedActiveTab) {
      setActiveTab(JSON.parse(savedActiveTab));
    }
  }, []);

  useEffect(() => {
    patientTabs.forEach(async (patient) => {
      if (!patientProfiles[patient.id]) {
        await fetchAndSetPatientProfile(patient.id);
      }
    });
    localStorage.setItem("patientTabs", JSON.stringify(patientTabs));
  }, [patientTabs]);

  useEffect(() => {
    localStorage.setItem("activePatientTab", JSON.stringify(activeTab));
  }, [activeTab]);

  async function fetchAndSetPatientProfile(patientId: number) {
    try {
      const patientProfile = await getFullPatientProfileById(patientId);
      setPatientProfiles((prevProfiles: any) => ({
        ...prevProfiles,
        [patientId]: patientProfile,
      }));
    } catch (error) {
      console.error("Error fetching patient profile", error);
    }
  }

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
          icon={HiPlus}
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
            {patientProfiles[patient.id] && (
              <PatientDataProvider patient={patientProfiles[patient.id]}>
                <PatientChart />
              </PatientDataProvider>
            )}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
