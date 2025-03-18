import { WebPartContext } from '@microsoft/sp-webpart-base';

export const generateImageUrl = (
  context: WebPartContext,
  email: string | undefined
): string => {
  if (email !== undefined || email !== '') {
    return `${
      context.pageContext.web.absoluteUrl
    }/_layouts/15/userphoto.aspx?accountname=${encodeURIComponent(
      email || ''
    )}&size=M`;
  } else {
    return '';
  }
};
