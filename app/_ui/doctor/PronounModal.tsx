import { updatePatient } from "@/app/_lib/actions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import useViewState from "@/app/_lib/customHooks/useViewState";
import SelectInputFormGroup from "@/app/_lib/inputs/standard/SelectInputFormGroup";
import { Pronouns } from "@prisma/client";
import { Button, Modal as FlowBiteModal } from "flowbite-react";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface IPronounModal {
  openModal: boolean;
  setOpenModal: Function;
}

export default function PronounModal(props: IPronounModal) {
  const { openModal, setOpenModal } = props;
  const { setLoading } = useViewState();
  const { patient, updatePatientField } = useContext(PatientDataContext);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<any>();
  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      setLoading(true);
      await updatePatient(patient.id, { pronouns: data.pronoun });
      updatePatientField("pronouns", data.pronoun);
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
          <div>Pronoun</div>
        </div>
      </FlowBiteModal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FlowBiteModal.Body>
          <SelectInputFormGroup
            control={control}
            errors={errors}
            formIdentifier="pronoun"
            required={true}
            labelText="Pronoun"
            options={Pronouns}
            nullOptionLabel={"Select"}
            parseHumanReadable={true}
            defaultValue={undefined}
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
