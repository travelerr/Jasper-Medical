import useViewState from "@/app/_lib/customHooks/useViewState";
import { useContext, useEffect, useState } from "react";
import LoadingOverlay from "../../shared/loadingWidget";
import { Button, Label, Modal as FlowBiteModal } from "flowbite-react";
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
import TextInputFormGroup from "@/app/_lib/inputs/standard/TextInputFormGroup";
import SelectInputFormGroup from "@/app/_lib/inputs/standard/SelectInputFormGroup";
import DatePickerFormGroup from "@/app/_lib/inputs/standard/DatePickerFormGroup";

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
  const [existingICD10Codes, setExistingICD10Codes] = useState<ICD10Code[]>([]);
  const [newICD10Codes, setNewICD10Codes] = useState<ICD10Code[]>([]);
  const router = useRouter();
  const { refetchPatientData } = useContext(PatientDataContext);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
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
    } catch (error) {
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
      router.refresh();
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (problemToEdit) {
      setValue("name", problemToEdit.name);
      setValue("synopsis", problemToEdit.synopsis);
      setValue("status", problemToEdit.status);
      setValue("dxDate", new Date(problemToEdit.dxDate).toDateString());
      console.log(problemToEdit.dxDate);
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
            <TextInputFormGroup
              register={register}
              errors={errors}
              formIdentifier="name"
              required={true}
              labelText="Title"
            />
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
            <TextInputFormGroup
              register={register}
              errors={errors}
              formIdentifier="synopsis"
              required={true}
              labelText="Synopsis"
            />
            <SelectInputFormGroup
              control={control}
              errors={errors}
              formIdentifier="status"
              required={true}
              labelText="Status"
              options={ProblemListStatus}
              nullOptionLabel={"Select"}
            />
            <DatePickerFormGroup
              control={control}
              errors={errors}
              formIdentifier="dxDate"
              required={true}
              labelText="Diagnosis Date"
            />
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
