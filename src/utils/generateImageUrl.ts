import { WebPartContext } from "@microsoft/sp-webpart-base";

const generateImageUrl = (
  context: WebPartContext,
  value: string | undefined
): string => {
  if (value !== undefined || value !== "") {
    return `${
      context.pageContext.web.absoluteUrl
    }/_layouts/15/userphoto.aspx?accountname=${encodeURIComponent(
      value as string
    )}&size=M`;
  } else {
    return "";
  }
};

export { generateImageUrl };
