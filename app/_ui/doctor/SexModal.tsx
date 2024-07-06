import { updatePatient } from "@/app/_lib/actions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import useViewState from "@/app/_lib/customHooks/useViewState";
import SelectInputFormGroup from "@/app/_lib/inputs/standard/SelectInputFormGroup";
import { Sex } from "@prisma/client";
import { Button, Modal as FlowBiteModal } from "flowbite-react";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface ISexModal {
  patientHistoryId?: number;
  openModal: boolean;
  setOpenModal: Function;
}

export default function SexModal(props: ISexModal) {
  const { openModal, setOpenModal, patientHistoryId } = props;
  const { setLoading } = useViewState();
  const { patient, updatePatientField } = useContext(PatientDataContext);

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<any>();
  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      setLoading(true);
      await updatePatient(patient.id, { sexAtBirth: data.sex });
      updatePatientField("sexAtBirth", data.sex);
      setLoading(false);
      reset();
      setOpenModal(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <FlowBiteModal
      size={"xl"}
      show={openModal}
      className="relative"
      onClose={() => setOpenModal(false)}
    >
      <FlowBiteModal.Header className="border-none">
        <div>
          <div>Sex</div>
        </div>
      </FlowBiteModal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FlowBiteModal.Body>
          <SelectInputFormGroup
            control={control}
            errors={errors}
            formIdentifier="sex"
            required={true}
            labelText="Sex"
            options={Sex}
            nullOptionLabel={"Select"}
            parseHumanReadable={true}
            defaultValue={null}
          />
        </FlowBiteModal.Body>
        <FlowBiteModal.Footer>
          <Button type="submit">Submit</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </FlowBiteModal.Footer>
      </form>
    </FlowBiteModal>
  );
}
