import useViewState from "@/app/_lib/customHooks/useViewState";
import { useContext, useState } from "react";
import LoadingOverlay from "../../loadingWidget";
import {
  Button,
  TextInput,
  Label,
  Select,
  Modal as FlowBiteModal,
} from "flowbite-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateProblemInputs } from "@/app/_lib/definitions";
import { ICD10Code, ProblemListStatus } from "@prisma/client";
import { createProblem } from "@/app/_lib/actions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import ICD10CodeLookup from "./ICD10CodeLookup";

interface IAddNewProblemModal {
  openCreateModal: boolean;
  setOpenCreateModal: Function;
}

export default function AddNewProblemModal(props: IAddNewProblemModal) {
  const { openCreateModal, setOpenCreateModal } = props;
  const { viewState, setLoading } = useViewState();
  const [formMessage, setFormMessage] = useState<string>("");
  const [selectedICD10Codes, setSelectedICD10Codes] = useState<ICD10Code[]>([]);
  const router = useRouter();
  const { refetchPatientData, patient } = useContext(PatientDataContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProblemInputs>();

  const onSubmit: SubmitHandler<CreateProblemInputs> = async (data) => {
    if (patient && patient.id) {
      data.patientId = patient.id;
    }
    if (selectedICD10Codes.length) {
      data.icd10Codes = selectedICD10Codes.map((code) => {
        return { icd10CodeId: code.id, problemListId: null };
      });
    }
    try {
      setLoading(true);
      await createProblem(data);
      await refetchPatientData();
      setLoading(false);
      reset();
      setOpenCreateModal(false);
      setFormMessage("");
      router.refresh();
    } catch (error) {
      setFormMessage("There was an error creating the appointment");
      setLoading(false);
    }
  };

  const handleSelectedICD10Code = (code: ICD10Code) => {
    console.log(code);
    setSelectedICD10Codes((prevCodes) => [...prevCodes, code]);
  };

  return (
    <FlowBiteModal
      size={"7xl"}
      show={openCreateModal}
      className="relative"
      onClose={() => setOpenCreateModal(false)}
    >
      <FlowBiteModal.Header>Add Patient Problem</FlowBiteModal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FlowBiteModal.Body className="overflow-visible">
          <LoadingOverlay isLoading={viewState.loading} />
          <div className="mb-6">
            <Label value="Title" />
            <TextInput id="name" {...register("name", { required: true })} />
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <ICD10CodeLookup
                handleSelectedICD10Code={handleSelectedICD10Code}
              />
            </div>
            <div>
              <ul>
                {selectedICD10Codes.length > 0 ? (
                  <li className="flex w-full border-b">
                    <div className="w-11/12 font-bold">Diagnosis</div>
                    <div className="w-1/12 font-bold">ICD10</div>
                  </li>
                ) : null}
                {selectedICD10Codes.map((code, index) => (
                  <li key={code.id} className="flex w-full text-left">
                    <div className="w-11/12">{code.shortDescription}</div>
                    <div className="w-1/12">{code.code}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Label htmlFor="synopsis" value="Synopsis" />
              <TextInput
                id="synopsis"
                {...register("synopsis", { required: true })}
              />
              <div id="title-error" aria-live="polite" aria-atomic="true">
                {errors.synopsis && <p>{errors.synopsis.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="status" value="Status" />
              <Select id="status" {...register("status", { required: true })}>
                {Object.values(ProblemListStatus).map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
              <div id="status-error" aria-live="polite" aria-atomic="true">
                {" "}
                {errors.status && <p>{errors.status.message}</p>}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Label htmlFor="dxDate" value="Diagnosis Date" />
              <input
                type="date"
                id="onsetDate"
                {...register("dxDate")}
                className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
              />
              <div id="onsetDate-error" aria-live="polite" aria-atomic="true">
                {" "}
                {errors.dxDate && <p>{errors.dxDate.message}</p>}
              </div>
            </div>
          </div>
        </FlowBiteModal.Body>
        <FlowBiteModal.Footer>
          <Button type="submit">Submit</Button>
          <Button color="gray" onClick={() => setOpenCreateModal(false)}>
            Cancel
          </Button>
        </FlowBiteModal.Footer>
      </form>
    </FlowBiteModal>
  );
}
