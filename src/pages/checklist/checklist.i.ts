import { IChecklistItem } from './';

export interface IChecklist {
    name: string;
    items: Array<IChecklistItem>;
    permanent: boolean;
    created_on: number;
    updated_on: number;
    last_access_on: number;
}