import {
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import { customInstance } from '../../custom-instance';
import type { ErrorType } from '../../custom-instance';
import type { UserResponse } from '../model/userResponse';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



export const getAllUsers = (
    
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<UserResponse[]>(
      {url: `/api/v1/admin/users`, method: 'GET',
        signal
    },
      options);
    }
  



export const getGetAllUsersQueryKey = () => {
    return [
    `/api/v1/admin/users`
    ] as const;
    }

    
export const getGetAllUsersQueryOptions = <TData = Awaited<ReturnType<typeof getAllUsers>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAllUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAllUsersQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAllUsers>>> = ({ signal }) => getAllUsers(requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getAllUsers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAllUsersQueryResult = NonNullable<Awaited<ReturnType<typeof getAllUsers>>>
export type GetAllUsersQueryError = ErrorType<unknown>


export function useGetAllUsers<TData = Awaited<ReturnType<typeof getAllUsers>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAllUsers>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAllUsers>>,
          TError,
          Awaited<ReturnType<typeof getAllUsers>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetAllUsers<TData = Awaited<ReturnType<typeof getAllUsers>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAllUsers>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAllUsers>>,
          TError,
          Awaited<ReturnType<typeof getAllUsers>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetAllUsers<TData = Awaited<ReturnType<typeof getAllUsers>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAllUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAllUsers<TData = Awaited<ReturnType<typeof getAllUsers>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAllUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAllUsersQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}




