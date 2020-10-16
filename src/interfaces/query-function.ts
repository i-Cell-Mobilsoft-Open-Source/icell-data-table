import { Observable } from 'rxjs';
import { QueryRequestDetails } from './query-request-details.interface';

export type QueryFunction = (queryParams: QueryRequestDetails, sortColumn: string, sortOrder: 'asc' | 'desc' | string) => Observable<any>;
