import { WebPartContext } from '@microsoft/sp-webpart-base';

interface IListFormProps {
  context: WebPartContext;
  list: string;
  fields: string[];
}

export type { IListFormProps };
