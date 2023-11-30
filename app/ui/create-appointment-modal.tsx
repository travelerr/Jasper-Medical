"use client";
import { Button, Modal as FlowBiteModal } from "flowbite-react";
import { useState } from "react";

interface ICreateAppointmentModalProps {
  headerText?: string;
  show: boolean;
}

export function CreateAppointmentModal(props: ICreateAppointmentModalProps) {
  const { headerText, show } = props;
  const [openModal, setOpenModal] = useState(false);

  return (
    <FlowBiteModal show={show} onClose={() => setOpenModal(false)}>
      <FlowBiteModal.Header>Terms of Service</FlowBiteModal.Header>
      <FlowBiteModal.Body>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            With less than a month to go before the European Union enacts new
            consumer privacy laws for its citizens, companies around the world
            are updating their terms of service agreements to comply.
          </p>
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            The European Union’s General Data Protection Regulation (G.D.P.R.)
            goes into effect on May 25 and is meant to ensure a common set of
            data rights in the European Union. It requires organizations to
            notify users as soon as possible of high-risk data breaches that
            could personally affect them.
          </p>
        </div>
      </FlowBiteModal.Body>
      <FlowBiteModal.Footer>
        <Button onClick={() => setOpenModal(false)}>I accept</Button>
        <Button color="gray" onClick={() => setOpenModal(false)}>
          Decline
        </Button>
      </FlowBiteModal.Footer>
    </FlowBiteModal>
  );
}
