import useViewState from "@/app/_lib/customHooks/useViewState";
import { useContext } from "react";
import LoadingOverlay from "../../loadingWidget";
import { Button, Modal as FlowBiteModal } from "flowbite-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateAllergenInputs } from "@/app/_lib/definitions";
import { AllergySeverity, AllergyStatus } from "@prisma/client";
import { createAllergy } from "@/app/_lib/actions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import TextInputFormGroup from "@/app/_lib/inputs/standard/TextInputFormGroup";
import SelectInputFormGroup from "@/app/_lib/inputs/standard/SelectInputFormGroup";
import DatePickerFormGroup from "@/app/_lib/inputs/standard/DatePickerFormGroup";

interface INewAllergyModal {
  openCreateModal: boolean;
  setOpenCreateModal: Function;
}

export default function NewAllergyModal(props: INewAllergyModal) {
  const { openCreateModal, setOpenCreateModal } = props;
  const { viewState, setLoading } = useViewState();
  const router = useRouter();
  const { refetchPatientData, patient } = useContext(PatientDataContext);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateAllergenInputs>();

  const onSubmit: SubmitHandler<CreateAllergenInputs> = async (data) => {
    data.patientId = patient.id;
    try {
      setLoading(true);
      await createAllergy(data);
      await refetchPatientData();
      setLoading(false);
      reset();
      setOpenCreateModal(false);
      router.refresh();
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <FlowBiteModal
      size={"7xl"}
      show={openCreateModal}
      className="relative"
      onClose={() => setOpenCreateModal(false)}
    >
      <FlowBiteModal.Header>Add Patient Allergy</FlowBiteModal.Header>
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
              register={register}
              errors={errors}
              formIdentifier="status"
              required={true}
              labelText="Status"
              options={AllergyStatus}
              nullOptionLabel={"Select"}
            />
            <SelectInputFormGroup
              register={register}
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
          <Button type="submit">Submit</Button>
          <Button color="gray" onClick={() => setOpenCreateModal(false)}>
            Cancel
          </Button>
        </FlowBiteModal.Footer>
      </form>
    </FlowBiteModal>
  );
}
