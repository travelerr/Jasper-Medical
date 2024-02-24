import useViewState from "@/app/_lib/customHooks/useViewState";
import { useContext, useState } from "react";
import LoadingOverlay from "../../loadingWidget";
import { Button, Label, Modal as FlowBiteModal } from "flowbite-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateProblemInputs } from "@/app/_lib/definitions";
import { ICD10Code, ProblemListStatus } from "@prisma/client";
import { createProblem } from "@/app/_lib/actions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import ICD10CodeLookup from "../../../_lib/inputs/lookups/ICD10CodeLookup";
import { HiX } from "react-icons/hi";
import TextInputFormGroup from "@/app/_lib/inputs/standard/TextInputFormGroup";
import DatePickerFormGroup from "@/app/_lib/inputs/standard/DatePickerFormGroup";
import SelectInputFormGroup from "@/app/_lib/inputs/standard/SelectInputFormGroup";

interface IAddNewProblemModal {
  openCreateModal: boolean;
  setOpenCreateModal: Function;
}

export default function AddNewProblemModal(props: IAddNewProblemModal) {
  const { openCreateModal, setOpenCreateModal } = props;
  const { viewState, setLoading } = useViewState();
  const [selectedICD10Codes, setSelectedICD10Codes] = useState<ICD10Code[]>([]);
  const router = useRouter();
  const { refetchPatientData, patient } = useContext(PatientDataContext);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateProblemInputs>();

  const onSubmit: SubmitHandler<CreateProblemInputs> = async (data) => {
    if (patient && patient.id) {
      data.patientId = patient.id;
    }
    if (selectedICD10Codes.length) {
      data.icd10Codes = selectedICD10Codes.map((code) => {
        return { icd10CodeId: code.id, problemListId: null, id: null };
      });
    }
    try {
      setLoading(true);
      await createProblem(data);
      await refetchPatientData();
      setLoading(false);
      reset();
      setOpenCreateModal(false);
      router.refresh();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSelectedICD10Code = (code: ICD10Code) => {
    setSelectedICD10Codes((prevCodes) => [...prevCodes, code]);
  };

  const removeSelectedCode = (codeToRemove: ICD10Code) => {
    setSelectedICD10Codes((currentCodes) =>
      currentCodes.filter((code) => code.id !== codeToRemove.id)
    );
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
              <ICD10CodeLookup
                handleSelectedICD10Code={handleSelectedICD10Code}
              />
            </div>
            <div>
              <Label value="Assigned ICD10 Codes" />
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
                    <button
                      type="button"
                      onClick={() => removeSelectedCode(code)}
                    >
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
          <Button type="submit">Submit</Button>
          <Button color="gray" onClick={() => setOpenCreateModal(false)}>
            Cancel
          </Button>
        </FlowBiteModal.Footer>
      </form>
    </FlowBiteModal>
  );
}
