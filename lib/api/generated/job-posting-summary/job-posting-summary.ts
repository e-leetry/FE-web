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
  JobPostingSummaryCreateRequest,
  JobPostingSummaryMoveRequest,
  JobPostingSummaryResponse,
  JobPostingSummaryUpdateRequest
} from '.././model';

import { customInstance } from '../../custom-instance';
import type { ErrorType , BodyType } from '../../custom-instance';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



/**
 * 채용 공고 요약 정보를 직접 등록합니다.
 * @summary 채용 공고 요약 등록
 */
export const create = (
    jobPostingSummaryCreateRequest: BodyType<JobPostingSummaryCreateRequest>,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<number>(
      {url: `/api/v1/job-posting-summaries`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: jobPostingSummaryCreateRequest, signal
    },
      options);
    }
  


export const getCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof create>>, TError,{data: BodyType<JobPostingSummaryCreateRequest>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof create>>, TError,{data: BodyType<JobPostingSummaryCreateRequest>}, TContext> => {

const mutationKey = ['create'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof create>>, {data: BodyType<JobPostingSummaryCreateRequest>}> = (props) => {
          const {data} = props ?? {};

          return  create(data,requestOptions)
        }



        


  return  { mutationFn, ...mutationOptions }}

    export type CreateMutationResult = NonNullable<Awaited<ReturnType<typeof create>>>
    export type CreateMutationBody = BodyType<JobPostingSummaryCreateRequest>
    export type CreateMutationError = ErrorType<unknown>

    /**
 * @summary 채용 공고 요약 등록
 */
export const useCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof create>>, TError,{data: BodyType<JobPostingSummaryCreateRequest>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof create>>,
        TError,
        {data: BodyType<JobPostingSummaryCreateRequest>},
        TContext
      > => {
      return useMutation(getCreateMutationOptions(options), queryClient);
    }
    /**
 * 채용 공고 요약의 대시보드 위치나 순서를 변경합니다.
 * @summary 채용 공고 요약 이동
 */
export const move = (
    summaryId: number,
    jobPostingSummaryMoveRequest: BodyType<JobPostingSummaryMoveRequest>,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<ApiResponseUnit>(
      {url: `/api/v1/job-posting-summaries/${summaryId}/move`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: jobPostingSummaryMoveRequest, signal
    },
      options);
    }
  


export const getMoveMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof move>>, TError,{summaryId: number;data: BodyType<JobPostingSummaryMoveRequest>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof move>>, TError,{summaryId: number;data: BodyType<JobPostingSummaryMoveRequest>}, TContext> => {

const mutationKey = ['move'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof move>>, {summaryId: number;data: BodyType<JobPostingSummaryMoveRequest>}> = (props) => {
          const {summaryId,data} = props ?? {};

          return  move(summaryId,data,requestOptions)
        }



        


  return  { mutationFn, ...mutationOptions }}

    export type MoveMutationResult = NonNullable<Awaited<ReturnType<typeof move>>>
    export type MoveMutationBody = BodyType<JobPostingSummaryMoveRequest>
    export type MoveMutationError = ErrorType<unknown>

    /**
 * @summary 채용 공고 요약 이동
 */
export const useMove = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof move>>, TError,{summaryId: number;data: BodyType<JobPostingSummaryMoveRequest>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof move>>,
        TError,
        {summaryId: number;data: BodyType<JobPostingSummaryMoveRequest>},
        TContext
      > => {
      return useMutation(getMoveMutationOptions(options), queryClient);
    }
    /**
 * ID로 채용 공고 요약 정보를 조회합니다.
 * @summary 채용 공고 요약 단건 조회
 */
export const getById = (
    id: number,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<JobPostingSummaryResponse>(
      {url: `/api/v1/job-posting-summaries/${id}`, method: 'GET', signal
    },
      options);
    }
  



export const getGetByIdQueryKey = (id?: number,) => {
    return [
    `/api/v1/job-posting-summaries/${id}`
    ] as const;
    }

    
export const getGetByIdQueryOptions = <TData = Awaited<ReturnType<typeof getById>>, TError = ErrorType<unknown>>(id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetByIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getById>>> = ({ signal }) => getById(id, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getById>>>
export type GetByIdQueryError = ErrorType<unknown>


export function useGetById<TData = Awaited<ReturnType<typeof getById>>, TError = ErrorType<unknown>>(
 id: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getById>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getById>>,
          TError,
          Awaited<ReturnType<typeof getById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetById<TData = Awaited<ReturnType<typeof getById>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getById>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getById>>,
          TError,
          Awaited<ReturnType<typeof getById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetById<TData = Awaited<ReturnType<typeof getById>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary 채용 공고 요약 단건 조회
 */

export function useGetById<TData = Awaited<ReturnType<typeof getById>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetByIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}




/**
 * 채용 공고 요약 정보를 삭제합니다.
 * @summary 채용 공고 요약 삭제
 */
export const _delete = (
    id: number,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<ApiResponseUnit>(
      {url: `/api/v1/job-posting-summaries/${id}`, method: 'DELETE', signal
    },
      options);
    }
  


export const getDeleteMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof _delete>>, TError,{id: number}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof _delete>>, TError,{id: number}, TContext> => {

const mutationKey = ['_delete'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof _delete>>, {id: number}> = (props) => {
          const {id} = props ?? {};

          return  _delete(id,requestOptions)
        }



        


  return  { mutationFn, ...mutationOptions }}

    export type _DeleteMutationResult = NonNullable<Awaited<ReturnType<typeof _delete>>>
    
    export type _DeleteMutationError = ErrorType<unknown>

    /**
 * @summary 채용 공고 요약 삭제
 */
export const useDelete = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof _delete>>, TError,{id: number}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof _delete>>,
        TError,
        {id: number},
        TContext
      > => {
      return useMutation(getDeleteMutationOptions(options), queryClient);
    }
    /**
 * 채용 공고 요약 정보를 수정합니다. (순서/대시보드 제외)
 * @summary 채용 공고 요약 수정
 */
export const update = (
    id: number,
    jobPostingSummaryUpdateRequest: BodyType<JobPostingSummaryUpdateRequest>,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<ApiResponseUnit>(
      {url: `/api/v1/job-posting-summaries/${id}`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: jobPostingSummaryUpdateRequest, signal
    },
      options);
    }
  


export const getUpdateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof update>>, TError,{id: number;data: BodyType<JobPostingSummaryUpdateRequest>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof update>>, TError,{id: number;data: BodyType<JobPostingSummaryUpdateRequest>}, TContext> => {

const mutationKey = ['update'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof update>>, {id: number;data: BodyType<JobPostingSummaryUpdateRequest>}> = (props) => {
          const {id,data} = props ?? {};

          return  update(id,data,requestOptions)
        }



        


  return  { mutationFn, ...mutationOptions }}

    export type UpdateMutationResult = NonNullable<Awaited<ReturnType<typeof update>>>
    export type UpdateMutationBody = BodyType<JobPostingSummaryUpdateRequest>
    export type UpdateMutationError = ErrorType<unknown>

    /**
 * @summary 채용 공고 요약 수정
 */
export const useUpdate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof update>>, TError,{id: number;data: BodyType<JobPostingSummaryUpdateRequest>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof update>>,
        TError,
        {id: number;data: BodyType<JobPostingSummaryUpdateRequest>},
        TContext
      > => {
      return useMutation(getUpdateMutationOptions(options), queryClient);
    }
    