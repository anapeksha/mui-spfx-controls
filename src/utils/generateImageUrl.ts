import { WebPartContext } from '@microsoft/sp-webpart-base';

/**
 * Generates a user profile image URL from SharePoint based on the provided email.
 *
 * @param {WebPartContext} context - The SharePoint WebPart context.
 * @param {string | undefined} email - The email address of the user.
 * @returns {string} - The URL of the user's profile image.
 */
export const generateImageUrl = (
  context: WebPartContext,
  email: string | undefined
): string => {
  if (email !== undefined && email !== '') {
    return `${
      context.pageContext.web.absoluteUrl
    }/_layouts/15/userphoto.aspx?accountname=${encodeURIComponent(
      email || ''
    )}&size=M`;
  } else {
    return '';
  }
};
