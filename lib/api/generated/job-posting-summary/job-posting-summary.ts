import {
  useMutation
} from '@tanstack/react-query';
import type {
  MutationFunction,
  QueryClient,
  UseMutationOptions,
  UseMutationResult
} from '@tanstack/react-query';

import type {
  JobPostingSummaryCreateRequest,
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
      
      
      return customInstance<Blob>(
      {url: `/api/v1/job-posting-summaries`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: jobPostingSummaryCreateRequest,
        responseType: 'blob', signal
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
 * 채용 공고 요약 정보를 수정합니다.
 * @summary 채용 공고 요약 수정
 */
export const update = (
    id: number,
    jobPostingSummaryUpdateRequest: BodyType<JobPostingSummaryUpdateRequest>,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<Blob>(
      {url: `/api/v1/job-posting-summaries/${id}`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: jobPostingSummaryUpdateRequest,
        responseType: 'blob', signal
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
    