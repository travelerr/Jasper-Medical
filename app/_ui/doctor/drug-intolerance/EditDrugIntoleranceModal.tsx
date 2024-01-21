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
import { EditDrugIntoleranceInputs } from "@/app/_lib/definitions";
import {
  Drug,
  DrugIntolerance,
  DrugIntoleranceSeverity,
  DrugIntoleranceStatus,
} from "@prisma/client";
import { updateDrugIntolerance } from "@/app/_lib/actions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";

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
  } = useForm<EditDrugIntoleranceInputs>();

  const onSubmit: SubmitHandler<EditDrugIntoleranceInputs> = async (data) => {
    data.drugIntoleranceId = drugIntoleranceToEdit.id;
    try {
      setLoading(true);
      await updateDrugIntolerance(data);
      await refetchPatientData();
      setLoading(false);
      reset();
      setOpenEditModal(false);
      setFormMessage("");
      router.refresh();
    } catch (error) {
      setFormMessage("There was an error creating the appointment");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (drugIntoleranceToEdit) {
      setValue(
        "drugName",
        `${drugIntoleranceToEdit.drug.proprietaryName} - ${drugIntoleranceToEdit.drug.nonProprietaryName}`
      );
      setValue("reaction", drugIntoleranceToEdit.reaction);
      setValue("severity", drugIntoleranceToEdit.severity);
      setValue("status", drugIntoleranceToEdit.status);
      setValue(
        "onsetDate",
        drugIntoleranceToEdit.onsetDate?.toISOString().split("T")[0]
      );
    }
  }, [drugIntoleranceToEdit, setValue]);

  return (
    <FlowBiteModal
      size={"7xl"}
      show={openEditModal}
      className="relative"
      onClose={() => setOpenEditModal(false)}
    >
      <FlowBiteModal.Header>Edit Patient Drug Intolerance</FlowBiteModal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FlowBiteModal.Body>
          <LoadingOverlay isLoading={viewState.loading} />
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <Label htmlFor="drugName" value="Drug Intolerance " />
              <TextInput
                disabled={true}
                id="drugName"
                {...register("drugName", { required: true })}
              />
              <div id="title-error" aria-live="polite" aria-atomic="true">
                {errors.drugName && <p>{errors.drugName.message}</p>}
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
                {Object.values(DrugIntoleranceStatus).map((status, index) => (
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
                {Object.values(DrugIntoleranceSeverity).map(
                  (severity, index) => (
                    <option key={index} value={severity}>
                      {severity}
                    </option>
                  )
                )}
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
        </FlowBiteModal.Footer>
      </form>
    </FlowBiteModal>
  );
}
