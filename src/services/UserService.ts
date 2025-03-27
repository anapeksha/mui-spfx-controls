import { User } from '@microsoft/microsoft-graph-types';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { GraphFI } from '@pnp/graph';
import { getGraph } from '../config/pnp.config';

/**
 * Service class for User profiles
 */
class UserService {
  //private readonly sp: SPFI;
  private readonly graph: GraphFI;

  /**
   * Initializes the ProfileService instance.
   * @param {WebPartContext} context - The SharePoint WebPart context.
   */
  constructor(context: WebPartContext) {
    this.graph = getGraph(context);
  }

  /**
   * Fetches current user details from Microsoft Graph.
   * @returns {Promise<User>} A promise resolving to the user profile details.
   * @throws {Error} - Throws an error if the request fails due to insufficient permissions.
   * @example
   * const user = await profileService.getUser('john.doe@example.com');
   * console.log(user.displayName, user.mail);
   */
  async getCurrentUser(): Promise<User> {
    return await this.graph.me();
  }

  /**
   * Fetches user details from Microsoft Graph using either a user ID or email.
   * @param upn - The user's upn
   * @returns {Promise<User>} A promise resolving to the user profile details.
   * @throws {Error} - Throws an error if the request fails due to insufficient permissions.
   * @example
   * const user = await profileService.getUser('john.doe@example.com');
   * console.log(user.displayName, user.mail);
   */
  async getUser(upn: string): Promise<User> {
    return await this.graph.users.getById(upn)();
  }
}

export { UserService };
