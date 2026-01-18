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


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



/**
 * 로그인한 사용자의 대시보드 목록을 정렬 순서대로 조회하며, 각 대시보드에 속한 채용 공고 요약 목록을 포함합니다.
 * @summary 대시보드 목록 조회
 */
export const getDashboards = (
    
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<Blob>(
      {url: `/api/v1/dashboards`, method: 'GET',
        responseType: 'blob', signal
    },
      options);
    }
  



export const getGetDashboardsQueryKey = () => {
    return [
    `/api/v1/dashboards`
    ] as const;
    }

    
export const getGetDashboardsQueryOptions = <TData = Awaited<ReturnType<typeof getDashboards>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getDashboards>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetDashboardsQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getDashboards>>> = ({ signal }) => getDashboards(requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getDashboards>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetDashboardsQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboards>>>
export type GetDashboardsQueryError = ErrorType<unknown>


export function useGetDashboards<TData = Awaited<ReturnType<typeof getDashboards>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getDashboards>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getDashboards>>,
          TError,
          Awaited<ReturnType<typeof getDashboards>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetDashboards<TData = Awaited<ReturnType<typeof getDashboards>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getDashboards>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getDashboards>>,
          TError,
          Awaited<ReturnType<typeof getDashboards>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetDashboards<TData = Awaited<ReturnType<typeof getDashboards>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getDashboards>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary 대시보드 목록 조회
 */

export function useGetDashboards<TData = Awaited<ReturnType<typeof getDashboards>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getDashboards>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetDashboardsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}




