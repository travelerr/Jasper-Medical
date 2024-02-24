import useViewState from "@/app/_lib/customHooks/useViewState";
import { useContext, useEffect } from "react";
import LoadingOverlay from "../../shared/loadingWidget";
import { Button, Modal as FlowBiteModal } from "flowbite-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { EditAllergenInputs } from "@/app/_lib/definitions";
import { Allergy, AllergySeverity, AllergyStatus } from "@prisma/client";
import { deleteAllergyByID, updateAllergy } from "@/app/_lib/actions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import TextInputFormGroup from "@/app/_lib/inputs/standard/TextInputFormGroup";
import SelectInputFormGroup from "@/app/_lib/inputs/standard/SelectInputFormGroup";
import DatePickerFormGroup from "@/app/_lib/inputs/standard/DatePickerFormGroup";

interface IEditAllergyModal {
  openEditModal: boolean;
  setOpenEditModal: Function;
  allergyToEdit: Allergy;
}

export default function EditAllergyModal(props: IEditAllergyModal) {
  const { openEditModal, setOpenEditModal, allergyToEdit } = props;
  const { viewState, setLoading } = useViewState();
  const { refetchPatientData } = useContext(PatientDataContext);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<EditAllergenInputs>();

  const onSubmit: SubmitHandler<EditAllergenInputs> = async (data) => {
    data.allergyId = allergyToEdit.id;
    try {
      setLoading(true);
      await updateAllergy(data);
      await refetchPatientData();
      setLoading(false);
      reset();
      setOpenEditModal(false);
    } catch (error) {
      setLoading(false);
    }
  };

  async function deleteAllergy() {
    try {
      setLoading(true);
      await deleteAllergyByID(allergyToEdit.id);
      await refetchPatientData();
      setLoading(false);
      setOpenEditModal(false);
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (allergyToEdit) {
      setValue("name", allergyToEdit.name);
      setValue("reaction", allergyToEdit.reaction);
      setValue("severity", allergyToEdit.severity);
      setValue("status", allergyToEdit.status);
      setValue("onsetDate", new Date(allergyToEdit.onsetDate).toDateString());
    }
  }, [allergyToEdit, setValue]);

  return (
    <FlowBiteModal
      size={"7xl"}
      show={openEditModal}
      className="relative"
      onClose={() => setOpenEditModal(false)}
    >
      <FlowBiteModal.Header>Edit Patient Allergy</FlowBiteModal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FlowBiteModal.Body>
          <LoadingOverlay isLoading={viewState.loading} />
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <TextInputFormGroup
              register={register}
              errors={errors}
              formIdentifier="name"
              required={true}
              labelText="Allergy"
            />
            <TextInputFormGroup
              register={register}
              errors={errors}
              formIdentifier="reaction"
              required={true}
              labelText="Reaction"
            />
            <SelectInputFormGroup
              control={control}
              formIdentifier="status"
              required={true}
              labelText="Status"
              options={AllergyStatus}
              nullOptionLabel={"Select"}
            />
            <SelectInputFormGroup
              control={control}
              errors={errors}
              formIdentifier="severity"
              required={true}
              labelText="Severity"
              options={AllergySeverity}
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
          <Button color="red" onClick={() => deleteAllergy()}>
            Delete Allergy
          </Button>
        </FlowBiteModal.Footer>
      </form>
    </FlowBiteModal>
  );
}
