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
  GuestJobPostingSyncRequest
} from '.././model';

import { customInstance } from '../../custom-instance';
import type { ErrorType , BodyType } from '../../custom-instance';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



/**
 * 비로그인 상태에서 저장한 채용 공고를 로그인 직후 첫 번째 대시보드에 동기화합니다.
 * @summary 게스트 채용 공고 동기화
 */
export const sync = (
    guestJobPostingSyncRequest: BodyType<GuestJobPostingSyncRequest>,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<number>(
      {url: `/api/v1/guest/sync`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: guestJobPostingSyncRequest, signal
    },
      options);
    }
  


export const getSyncMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof sync>>, TError,{data: BodyType<GuestJobPostingSyncRequest>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof sync>>, TError,{data: BodyType<GuestJobPostingSyncRequest>}, TContext> => {

const mutationKey = ['sync'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof sync>>, {data: BodyType<GuestJobPostingSyncRequest>}> = (props) => {
          const {data} = props ?? {};

          return  sync(data,requestOptions)
        }



        


  return  { mutationFn, ...mutationOptions }}

    export type SyncMutationResult = NonNullable<Awaited<ReturnType<typeof sync>>>
    export type SyncMutationBody = BodyType<GuestJobPostingSyncRequest>
    export type SyncMutationError = ErrorType<unknown>

    /**
 * @summary 게스트 채용 공고 동기화
 */
export const useSync = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof sync>>, TError,{data: BodyType<GuestJobPostingSyncRequest>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof sync>>,
        TError,
        {data: BodyType<GuestJobPostingSyncRequest>},
        TContext
      > => {
      return useMutation(getSyncMutationOptions(options), queryClient);
    }
    