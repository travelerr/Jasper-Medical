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
import { EditAllergenInputs } from "@/app/_lib/definitions";
import { Allergy, AllergySeverity, AllergyStatus } from "@prisma/client";
import { deleteAllergyByID, updateAllergy } from "@/app/_lib/actions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";

interface IEditAllergyModal {
  openEditModal: boolean;
  setOpenEditModal: Function;
  allergyToEdit: Allergy;
}

export default function EditAllergyModal(props: IEditAllergyModal) {
  const { openEditModal, setOpenEditModal, allergyToEdit } = props;
  const { viewState, setLoading } = useViewState();
  const [formMessage, setFormMessage] = useState<string>("");
  const router = useRouter();
  const { refetchPatientData } = useContext(PatientDataContext);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
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
      setFormMessage("");
    } catch (error) {
      setFormMessage("There was an error creating the allergy");
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
      setFormMessage("");
    } catch (error) {
      setFormMessage("There was an error deleting the allergy");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (allergyToEdit) {
      setValue("name", allergyToEdit.name);
      setValue("reaction", allergyToEdit.reaction);
      setValue("severity", allergyToEdit.severity);
      setValue("status", allergyToEdit.status);
      setValue(
        "onsetDate",
        allergyToEdit.onsetDate?.toISOString().split("T")[0]
      );
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
