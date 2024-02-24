import useViewState from "@/app/_lib/customHooks/useViewState";
import { useContext, useEffect } from "react";
import LoadingOverlay from "../../shared/loadingWidget";
import { Button, Modal as FlowBiteModal } from "flowbite-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { EditDrugIntoleranceInputs } from "@/app/_lib/definitions";
import {
  Drug,
  DrugIntolerance,
  DrugIntoleranceSeverity,
  DrugIntoleranceStatus,
} from "@prisma/client";
import {
  deleteDrugIntoleranceByID,
  updateDrugIntolerance,
} from "@/app/_lib/actions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import DrugLookup from "../../../_lib/inputs/lookups/DrugLookup";
import TextInputFormGroup from "@/app/_lib/inputs/standard/TextInputFormGroup";
import SelectInputFormGroup from "@/app/_lib/inputs/standard/SelectInputFormGroup";
import DatePickerFormGroup from "@/app/_lib/inputs/standard/DatePickerFormGroup";

interface IEditDrugIntoleranceModal {
  openEditModal: boolean;
  setOpenEditModal: Function;
  drugIntoleranceToEdit: DrugIntolerance & { drug: Drug };
}

export default function EditDrugIntoleranceModal(
  props: IEditDrugIntoleranceModal
) {
  const { openEditModal, setOpenEditModal, drugIntoleranceToEdit } = props;
  const { viewState, setLoading } = useViewState();
  const { refetchPatientData, patient } = useContext(PatientDataContext);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<EditDrugIntoleranceInputs>();

  const onSubmit: SubmitHandler<EditDrugIntoleranceInputs> = async (data) => {
    data.id = drugIntoleranceToEdit.id;
    try {
      setLoading(true);
      await updateDrugIntolerance(data);
      await refetchPatientData();
      setLoading(false);
      reset();
      setOpenEditModal(false);
    } catch (error) {
      setLoading(false);
    }
  };

  async function deleteDrugIntolerance() {
    try {
      setLoading(true);
      await deleteDrugIntoleranceByID(drugIntoleranceToEdit.id);
      await refetchPatientData();
      setLoading(false);
      setOpenEditModal(false);
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (drugIntoleranceToEdit) {
      setValue("drug", drugIntoleranceToEdit.drug);
      setValue("reaction", drugIntoleranceToEdit.reaction);
      setValue("severity", drugIntoleranceToEdit.severity);
      setValue("status", drugIntoleranceToEdit.status);
      console.log(drugIntoleranceToEdit.onsetDate);
      setValue(
        "onsetDate",
        new Date(drugIntoleranceToEdit.onsetDate).toDateString()
      );
    }
  }, [drugIntoleranceToEdit, setValue]);

  const handleSelectedDrug = (drug: Drug) => {
    setValue("drug", drug);
  };

  return (
    <FlowBiteModal
      size={"7xl"}
      show={openEditModal}
      className="relative"
      onClose={() => setOpenEditModal(false)}
    >
      <FlowBiteModal.Header>Edit Patient Drug Intolerance</FlowBiteModal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FlowBiteModal.Body className="overflow-visible">
          <LoadingOverlay isLoading={viewState.loading} />
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              {drugIntoleranceToEdit && (
                <DrugLookup
                  handleSelectedDrug={handleSelectedDrug}
                  initialValue={drugIntoleranceToEdit.drug}
                />
              )}
              <div id="title-error" aria-live="polite" aria-atomic="true">
                {errors.drug && <p>{errors.drug.message}</p>}
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
          <Button type="submit">Update</Button>
          <Button color="gray" onClick={() => setOpenEditModal(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={() => deleteDrugIntolerance()}>
            Delete Drug Intolerance
          </Button>
        </FlowBiteModal.Footer>
      </form>
    </FlowBiteModal>
  );
}
