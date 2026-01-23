import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  ApiResponseUnit,
  UserResponse
} from '.././model';

import { customInstance } from '../../custom-instance';
import type { ErrorType } from '../../custom-instance';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



/**
 * 모든 회원 목록을 조회합니다.
 * @summary 전체 회원 조회
 */
export const getAllUsers = (
    
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<UserResponse[]>(
      {url: `/api/v1/admin/users`, method: 'GET', signal
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
/**
 * @summary 전체 회원 조회
 */

export function useGetAllUsers<TData = Awaited<ReturnType<typeof getAllUsers>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAllUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAllUsersQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}




/**
 * 회원을 삭제합니다. 관리자만 삭제할 수 있습니다.
 * @summary 회원 삭제
 */
export const deleteUser = (
    userId: number,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<ApiResponseUnit>(
      {url: `/api/v1/admin/users/${userId}`, method: 'DELETE', signal
    },
      options);
    }
  


export const getDeleteUserMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,{userId: number}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,{userId: number}, TContext> => {

const mutationKey = ['deleteUser'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteUser>>, {userId: number}> = (props) => {
          const {userId} = props ?? {};

          return  deleteUser(userId,requestOptions)
        }



        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteUserMutationResult = NonNullable<Awaited<ReturnType<typeof deleteUser>>>
    
    export type DeleteUserMutationError = ErrorType<unknown>

    /**
 * @summary 회원 삭제
 */
export const useDeleteUser = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,{userId: number}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteUser>>,
        TError,
        {userId: number},
        TContext
      > => {
      return useMutation(getDeleteUserMutationOptions(options), queryClient);
    }
    