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
  JobSummarizeRequest,
  JobSummaryResponse
} from '.././model';

import { customInstance } from '../../custom-instance';
import type { ErrorType , BodyType } from '../../custom-instance';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



/**
 * URL을 통해 채용 공고를 요약합니다.
 * @summary 채용 공고 요약
 */
export const summarize = (
    jobSummarizeRequest: BodyType<JobSummarizeRequest>,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<JobSummaryResponse>(
      {url: `/api/v1/jobs/summarize`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: jobSummarizeRequest,
        signal
    },
      options);
    }
  


export const getSummarizeMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof summarize>>, TError,{data: BodyType<JobSummarizeRequest>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof summarize>>, TError,{data: BodyType<JobSummarizeRequest>}, TContext> => {

const mutationKey = ['summarize'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof summarize>>, {data: BodyType<JobSummarizeRequest>}> = (props) => {
          const {data} = props ?? {};

          return  summarize(data,requestOptions)
        }



        


  return  { mutationFn, ...mutationOptions }}

    export type SummarizeMutationResult = NonNullable<Awaited<ReturnType<typeof summarize>>>
    export type SummarizeMutationBody = BodyType<JobSummarizeRequest>
    export type SummarizeMutationError = ErrorType<unknown>

    /**
 * @summary 채용 공고 요약
 */
export const useSummarize = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof summarize>>, TError,{data: BodyType<JobSummarizeRequest>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof summarize>>,
        TError,
        {data: BodyType<JobSummarizeRequest>},
        TContext
      > => {
      return useMutation(getSummarizeMutationOptions(options), queryClient);
    }
    /**
 * URL을 통해 채용 공고 요약을 스트리밍 방식으로 제공합니다.
 * @summary 채용 공고 요약 스트리밍
 */
export const summarizeStream = (
    jobSummarizeRequest: BodyType<JobSummarizeRequest>,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<string[]>(
      {url: `/api/v1/jobs/summarize/stream`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: jobSummarizeRequest, signal
    },
      options);
    }
  


export const getSummarizeStreamMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof summarizeStream>>, TError,{data: BodyType<JobSummarizeRequest>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof summarizeStream>>, TError,{data: BodyType<JobSummarizeRequest>}, TContext> => {

const mutationKey = ['summarizeStream'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof summarizeStream>>, {data: BodyType<JobSummarizeRequest>}> = (props) => {
          const {data} = props ?? {};

          return  summarizeStream(data,requestOptions)
        }



        


  return  { mutationFn, ...mutationOptions }}

    export type SummarizeStreamMutationResult = NonNullable<Awaited<ReturnType<typeof summarizeStream>>>
    export type SummarizeStreamMutationBody = BodyType<JobSummarizeRequest>
    export type SummarizeStreamMutationError = ErrorType<unknown>

    /**
 * @summary 채용 공고 요약 스트리밍
 */
export const useSummarizeStream = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof summarizeStream>>, TError,{data: BodyType<JobSummarizeRequest>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof summarizeStream>>,
        TError,
        {data: BodyType<JobSummarizeRequest>},
        TContext
      > => {
      return useMutation(getSummarizeStreamMutationOptions(options), queryClient);
    }
    