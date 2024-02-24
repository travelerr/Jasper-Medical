import useViewState from "@/app/_lib/customHooks/useViewState";
import { useContext } from "react";
import LoadingOverlay from "../../loadingWidget";
import { Button, Modal as FlowBiteModal } from "flowbite-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateDrugIntoleranceInputs } from "@/app/_lib/definitions";
import {
  Drug,
  DrugIntoleranceSeverity,
  DrugIntoleranceStatus,
} from "@prisma/client";
import { createDrugIntolerance } from "@/app/_lib/actions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import DrugLookup from "../../../_lib/inputs/lookups/DrugLookup";
import DatePickerFormGroup from "@/app/_lib/inputs/standard/DatePickerFormGroup";
import SelectInputFormGroup from "@/app/_lib/inputs/standard/SelectInputFormGroup";
import TextInputFormGroup from "@/app/_lib/inputs/standard/TextInputFormGroup";

interface IAddNewDrugIntoleranceModal {
  openCreateModal: boolean;
  setOpenCreateModal: Function;
}

export default function AddNewDrugIntoleranceModal(
  props: IAddNewDrugIntoleranceModal
) {
  const { openCreateModal, setOpenCreateModal } = props;
  const { viewState, setLoading } = useViewState();
  const router = useRouter();
  const { refetchPatientData, patient } = useContext(PatientDataContext);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateDrugIntoleranceInputs>();

  const onSubmit: SubmitHandler<CreateDrugIntoleranceInputs> = async (data) => {
    data.patientId = patient.id;
    try {
      setLoading(true);
      await createDrugIntolerance(data);
      await refetchPatientData();
      setLoading(false);
      reset();
      setOpenCreateModal(false);
      router.refresh();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSelectedDrug = (drug: Drug) => {
    setValue("drugId", drug.id);
  };

  return (
    <FlowBiteModal
      size={"7xl"}
      show={openCreateModal}
      className="relative"
      onClose={() => setOpenCreateModal(false)}
    >
      <FlowBiteModal.Header>Add Patient Drug Intolerance</FlowBiteModal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FlowBiteModal.Body className="overflow-visible">
          <LoadingOverlay isLoading={viewState.loading} />
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <DrugLookup handleSelectedDrug={handleSelectedDrug} />
              <div id="title-error" aria-live="polite" aria-atomic="true">
                {errors.name && <p>{errors.name.message}</p>}
              </div>
            </div>
            <TextInputFormGroup
              register={register}
              errors={errors}
              formIdentifier="reaction"
              required={true}
              labelText="Reaction"
            />
            <SelectInputFormGroup
              control={control}
              errors={errors}
              formIdentifier="status"
              required={true}
              labelText="Status"
              options={DrugIntoleranceStatus}
              nullOptionLabel={"Select"}
            />
            <SelectInputFormGroup
              control={control}
              errors={errors}
              formIdentifier="severity"
              required={true}
              labelText="Severity"
              options={DrugIntoleranceSeverity}
              nullOptionLabel={"Select"}
            />
            <DatePickerFormGroup
              control={control}
              errors={errors}
              formIdentifier="onsetDate"
              required={true}
              labelText="Onset Date"
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
