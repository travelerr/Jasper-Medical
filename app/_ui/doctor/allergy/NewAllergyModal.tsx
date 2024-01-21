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
import { CreateAllergenInputs } from "@/app/_lib/definitions";
import { AllergySeverity, AllergyStatus } from "@prisma/client";
import { createAllergy } from "@/app/_lib/actions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";

interface INewAllergyModal {
  openCreateModal: boolean;
  dismissible?: boolean;
  setOpenCreateModal: Function;
}

export default function NewAllergyModal(props: INewAllergyModal) {
  const { openCreateModal, dismissible, setOpenCreateModal } = props;
  const { viewState, setLoading } = useViewState();
  const [formMessage, setFormMessage] = useState<string>("");
  const router = useRouter();
  const { refetchPatientData, patient } = useContext(PatientDataContext);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
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
      setFormMessage("");
      router.refresh();
    } catch (error) {
      setFormMessage("There was an error creating the appointment");
      setLoading(false);
    }
  };

  return (
    <FlowBiteModal
      size={"7xl"}
      dismissible={dismissible}
      show={openCreateModal}
      className="relative"
      onClose={() => setOpenCreateModal(false)}
    >
      <FlowBiteModal.Header>Add Patient Allergy</FlowBiteModal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FlowBiteModal.Body>
          <LoadingOverlay isLoading={viewState.loading} />
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <Label htmlFor="name" value="Allergy" />
              <TextInput id="name" {...register("name", { required: true })} />
              <div id="title-error" aria-live="polite" aria-atomic="true">
                {errors.name && <p>{errors.name.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="reaction" value="Reaction" />
              <TextInput
                id="reaction"
                {...register("reaction", { required: true })}
              />
              <div id="title-error" aria-live="polite" aria-atomic="true">
                {errors.reaction && <p>{errors.reaction.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="status" value="Status" />
              <Select id="status" {...register("status", { required: true })}>
                {Object.values(AllergyStatus).map((status, index) => (
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
            <div>
              <Label htmlFor="severity" value="Severity" />
              <Select
                id="severity"
                {...register("severity", { required: true })}
              >
                {Object.values(AllergySeverity).map((severity, index) => (
                  <option key={index} value={severity}>
                    {severity}
                  </option>
                ))}
              </Select>
              <div id="severity-error" aria-live="polite" aria-atomic="true">
                {" "}
                {errors.severity && <p>{errors.severity.message}</p>}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Label htmlFor="onsetDate" value="Onset Date" />
              <input
                type="date"
                id="onsetDate"
                {...register("onsetDate")}
                className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
              />
              <div id="onsetDate-error" aria-live="polite" aria-atomic="true">
                {" "}
                {errors.onsetDate && <p>{errors.onsetDate.message}</p>}
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
