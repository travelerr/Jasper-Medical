import sgMail from "@sendgrid/mail";
import fs from "fs";
import path from "path";
import { TemplateDataMap } from "./definitions"; // Make sure this import points to where you've defined TemplateDataMap

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

type TemplateNames = keyof TemplateDataMap;
interface EmailOptions<T extends TemplateNames> {
  to: string;
  from?: {
    email: string;
    name: string;
  };
  subject: string;
  text?: string;
  template: T;
  templateData: TemplateDataMap[T];
}

function loadEmailTemplate<T extends keyof TemplateDataMap>(
  templateName: T,
  replacements: TemplateDataMap[T]
): string {
  const filePath = path.join(
    process.cwd(),
    "email-templates",
    `${templateName}.html`
  );
  let template = fs.readFileSync(filePath, "utf8");

  (Object.keys(replacements) as Array<keyof TemplateDataMap[T]>).forEach(
    (key) => {
      const replacementValue = replacements[key];
      const value =
        typeof replacementValue === "string"
          ? replacementValue
          : String(replacementValue);
      template = template.replace(new RegExp(`{{${String(key)}}}`, "g"), value);
    }
  );

  return template;
}

export const sendEmailTemplate = async <T extends TemplateNames>(
  options: EmailOptions<T>
) => {
  const {
    to,
    from = {
      email: process.env.ADMIN_EMAIL || "",
      name: "Jasper Medical",
    },
    subject,
    text,
    template,
    templateData,
  } = options;

  const emailBody = loadEmailTemplate(template, templateData);

  const msg = {
    to,
    from,
    subject,
    text,
    html: emailBody,
  };

  try {
    const result = await sgMail.send(msg);
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    if (error.response) {
      console.error(error.response.body);
    }
    throw new Error("Failed to send email");
  }
};
