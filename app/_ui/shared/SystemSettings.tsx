import { sendTestEmail } from "@/app/_lib/actions";
import TextInputFormGroup from "@/app/_lib/inputs/standard/TextInputFormGroup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoSettingsSharp } from "react-icons/io5";

interface ISystemSettings {}
export default function SystemSettings(props: ISystemSettings) {
  const [testEmailSuccess, setTestEmailSuccess] = useState<boolean>(null);
  // First form setup
  const {
    register: registerTestEmail,
    handleSubmit: handleSubmitTestEmail,
    formState: { errors: errorsTestEmail },
  } = useForm();
  const onSubmitTestEmail = async (data: any) => {
    try {
      await sendTestEmail(data);
      setTestEmailSuccess(true);
      setTimeout(() => setTestEmailSuccess(null), 5000);
    } catch (error) {
      console.error(error);
      setTestEmailSuccess(false);
      setTimeout(() => setTestEmailSuccess(null), 5000);
    }
  };
  return (
    <div>
      <div className="w-full">
        <div className="mb-10">
          <h1 className="flex items-center">
            <IoSettingsSharp className="mr-3" />
            System Settings
          </h1>
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-4">
          <form onSubmit={handleSubmitTestEmail(onSubmitTestEmail)}>
            <TextInputFormGroup
              register={registerTestEmail}
              errors={errorsTestEmail}
              formIdentifier="testEmail"
              isEmail={true}
              required={true}
              labelText="Send Test Email To:"
            />
            <button className="btn-primary-md mt-5 w-full" type="submit">
              Send Test Email
            </button>
            {testEmailSuccess === true ? (
              <span className="text-green-500 w-full text-center">
                Email Sent Success!
              </span>
            ) : null}
            {testEmailSuccess === false ? (
              <span className="text-red-500 w-full text-center">
                Error Sending Email
              </span>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
