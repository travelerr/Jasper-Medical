import useViewState from "@/app/_lib/customHooks/useViewState";
import { useContext, useEffect, useState } from "react";
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
import { EditProblemInputs } from "@/app/_lib/definitions";
import {
  ICD10Code,
  ProblemList,
  ProblemListICD10Code,
  ProblemListStatus,
} from "@prisma/client";
import {
  deleteProblemListByID,
  deleteProblemListICD10CodeByID,
  updateProblem,
} from "@/app/_lib/actions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import { HiX } from "react-icons/hi";
import ICD10CodeLookup from "../../../_lib/inputs/lookups/ICD10CodeLookup";

interface IEditProblemListModal {
  openEditModal: boolean;
  setOpenEditModal: Function;
  problemToEdit: ProblemList & {
    icd10Codes: (ProblemListICD10Code & { icd10Code: ICD10Code })[];
  };
}

export default function EditDrugIntoleranceModal(props: IEditProblemListModal) {
  const { openEditModal, setOpenEditModal, problemToEdit } = props;
  const { viewState, setLoading } = useViewState();
  const [formMessage, setFormMessage] = useState<string>("");
  const [existingICD10Codes, setExistingICD10Codes] = useState<ICD10Code[]>([]);
  const [newICD10Codes, setNewICD10Codes] = useState<ICD10Code[]>([]);
  const router = useRouter();
  const { refetchPatientData, patient } = useContext(PatientDataContext);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditProblemInputs>();

  const onSubmit: SubmitHandler<EditProblemInputs> = async (data) => {
    try {
      data.id = problemToEdit.id;
      data.icd10Codes = newICD10Codes;
      setLoading(true);
      await updateProblem(data);
      await refetchPatientData();
      setLoading(false);
      reset();
      setOpenEditModal(false);
      setFormMessage("");
    } catch (error) {
      setFormMessage("There was an error creating the problem");
      setLoading(false);
    }
  };

  async function deleteProblemList() {
    try {
      setLoading(true);
      await deleteProblemListByID(problemToEdit.id);
      await refetchPatientData();
      setLoading(false);
      setOpenEditModal(false);
      setFormMessage("");
      router.refresh();
    } catch (error) {
      setFormMessage("There was an error deleting the problem");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (problemToEdit) {
      setValue("name", problemToEdit.name);
      setValue("synopsis", problemToEdit.synopsis);
      setValue("status", problemToEdit.status);
      setValue("dxDate", problemToEdit.dxDate?.toISOString().split("T")[0]);
      if (problemToEdit.icd10Codes.length) {
        let x = problemToEdit.icd10Codes.map((code) => ({
          ...code.icd10Code,
          idToDelete: code.id,
        }));
        // @ts-ignore
        setExistingICD10Codes(x);
      }
    }
  }, [problemToEdit, setValue]);

  const handleSelectedICD10Code = (code: ICD10Code) => {
    // @ts-ignore
    setNewICD10Codes((prevCodes) => [...prevCodes, code]);
  };

  const removeExistingCode = async (codeToRemove: ICD10Code) => {
    try {
      //@ts-ignore
      await deleteProblemListICD10CodeByID(codeToRemove.idToDelete);
      setExistingICD10Codes((currentCodes) =>
        currentCodes.filter((code) => code.id !== codeToRemove.id)
      );
    } catch {
      console.log("Error deleting the problem list icd10 code by id.");
    }
  };

  const removeNewCode = async (codeToRemove: ICD10Code) => {
    setNewICD10Codes((currentCodes) =>
      currentCodes.filter((code) => code.id !== codeToRemove.id)
    );
  };

  return (
    <FlowBiteModal
      size={"7xl"}
      show={openEditModal}
      className="relative"
      onClose={() => setOpenEditModal(false)}
    >
      <FlowBiteModal.Header>Edit Patient Problem</FlowBiteModal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FlowBiteModal.Body>
          <LoadingOverlay isLoading={viewState.loading} />
          <div className="mb-6">
            <Label value="Title" />
            <TextInput id="name" {...register("name", { required: true })} />
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <div>
                <ICD10CodeLookup
                  handleSelectedICD10Code={handleSelectedICD10Code}
                />
              </div>
            </div>
            <div>
              <Label value="Assigned ICD10 Codes" />
              <ul>
                {problemToEdit && existingICD10Codes?.length > 0 ? (
                  <li className="flex w-full border-b">
                    <div className="w-11/12 font-bold">Diagnosis</div>
                    <div className="w-1/12 font-bold">ICD10</div>
                  </li>
                ) : null}
                {problemToEdit &&
                  existingICD10Codes.map((code, index) => (
                    <li key={code.id + index} className="flex w-full text-left">
                      <div className="w-10/12">{code.shortDescription}</div>
                      <div className="w-2/12">{code.code}</div>
                      <button
                        type="button"
                        onClick={() => removeExistingCode(code)}
                      >
                        <HiX className="text-red-500" />
                      </button>
                    </li>
                  ))}
                {newICD10Codes &&
                  newICD10Codes.map((code, index) => (
                    <li key={code.id + index} className="flex w-full text-left">
                      <div className="w-10/12">{code.shortDescription}</div>
                      <div className="w-2/12">{code.code}</div>
                      <button type="button" onClick={() => removeNewCode(code)}>
                        <HiX className="text-red-500" />
                      </button>
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
          <Button type="submit">Update</Button>
          <Button color="gray" onClick={() => setOpenEditModal(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={() => deleteProblemList()}>
            Delete Problem
          </Button>
        </FlowBiteModal.Footer>
      </form>
    </FlowBiteModal>
  );
}
