/******************************************************************************
* This file was generated by ZenStack CLI.
******************************************************************************/

/* eslint-disable */
// @ts-nocheck

import type { Prisma, DeviceType } from "@prisma/client";
import type { UseMutationOptions, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/react-query';
import { getHooksContext } from '@zenstackhq/tanstack-query/runtime-v5/react';
import { useModelQuery, useInfiniteModelQuery, useModelMutation } from '@zenstackhq/tanstack-query/runtime-v5/react';
import type { PickEnumerable, CheckSelect, QueryError, ExtraQueryOptions, ExtraMutationOptions } from '@zenstackhq/tanstack-query/runtime-v5';
import type { PolicyCrudKind } from '@zenstackhq/runtime'
import metadata from './__model_meta';
type DefaultError = QueryError;
import { useSuspenseModelQuery, useSuspenseInfiniteModelQuery } from '@zenstackhq/tanstack-query/runtime-v5/react';
import type { UseSuspenseQueryOptions, UseSuspenseInfiniteQueryOptions } from '@tanstack/react-query';

export function useCreateDeviceType(options?: Omit<(UseMutationOptions<(DeviceType | undefined), DefaultError, Prisma.DeviceTypeCreateArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.DeviceTypeCreateArgs, DefaultError, DeviceType, true>('DeviceType', 'POST', `${endpoint}/deviceType/create`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.DeviceTypeCreateArgs>(
            args: Prisma.SelectSubset<T, Prisma.DeviceTypeCreateArgs>,
            options?: Omit<(UseMutationOptions<(CheckSelect<T, DeviceType, Prisma.DeviceTypeGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.DeviceTypeCreateArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, DeviceType, Prisma.DeviceTypeGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useCreateManyDeviceType(options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.DeviceTypeCreateManyArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.DeviceTypeCreateManyArgs, DefaultError, Prisma.BatchPayload, false>('DeviceType', 'POST', `${endpoint}/deviceType/createMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.DeviceTypeCreateManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.DeviceTypeCreateManyArgs>,
            options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.DeviceTypeCreateManyArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useFindManyDeviceType<TArgs extends Prisma.DeviceTypeFindManyArgs, TQueryFnData = Array<Prisma.DeviceTypeGetPayload<TArgs> & { $optimistic?: boolean }>, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.DeviceTypeFindManyArgs>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('DeviceType', `${endpoint}/deviceType/findMany`, args, options, fetch);
}

export function useInfiniteFindManyDeviceType<TArgs extends Prisma.DeviceTypeFindManyArgs, TQueryFnData = Array<Prisma.DeviceTypeGetPayload<TArgs>>, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.DeviceTypeFindManyArgs>, options?: Omit<UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>, 'queryKey' | 'initialPageParam'>) {
    options = options ?? { getNextPageParam: () => null };
    const { endpoint, fetch } = getHooksContext();
    return useInfiniteModelQuery<TQueryFnData, TData, TError>('DeviceType', `${endpoint}/deviceType/findMany`, args, options, fetch);
}

export function useSuspenseFindManyDeviceType<TArgs extends Prisma.DeviceTypeFindManyArgs, TQueryFnData = Array<Prisma.DeviceTypeGetPayload<TArgs> & { $optimistic?: boolean }>, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.DeviceTypeFindManyArgs>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('DeviceType', `${endpoint}/deviceType/findMany`, args, options, fetch);
}

export function useSuspenseInfiniteFindManyDeviceType<TArgs extends Prisma.DeviceTypeFindManyArgs, TQueryFnData = Array<Prisma.DeviceTypeGetPayload<TArgs>>, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.DeviceTypeFindManyArgs>, options?: Omit<UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>, 'queryKey' | 'initialPageParam'>) {
    options = options ?? { getNextPageParam: () => null };
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>('DeviceType', `${endpoint}/deviceType/findMany`, args, options, fetch);
}

export function useFindUniqueDeviceType<TArgs extends Prisma.DeviceTypeFindUniqueArgs, TQueryFnData = Prisma.DeviceTypeGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.DeviceTypeFindUniqueArgs>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('DeviceType', `${endpoint}/deviceType/findUnique`, args, options, fetch);
}

export function useSuspenseFindUniqueDeviceType<TArgs extends Prisma.DeviceTypeFindUniqueArgs, TQueryFnData = Prisma.DeviceTypeGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.DeviceTypeFindUniqueArgs>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('DeviceType', `${endpoint}/deviceType/findUnique`, args, options, fetch);
}

export function useFindFirstDeviceType<TArgs extends Prisma.DeviceTypeFindFirstArgs, TQueryFnData = Prisma.DeviceTypeGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.DeviceTypeFindFirstArgs>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('DeviceType', `${endpoint}/deviceType/findFirst`, args, options, fetch);
}

export function useSuspenseFindFirstDeviceType<TArgs extends Prisma.DeviceTypeFindFirstArgs, TQueryFnData = Prisma.DeviceTypeGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.DeviceTypeFindFirstArgs>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('DeviceType', `${endpoint}/deviceType/findFirst`, args, options, fetch);
}

export function useUpdateDeviceType(options?: Omit<(UseMutationOptions<(DeviceType | undefined), DefaultError, Prisma.DeviceTypeUpdateArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.DeviceTypeUpdateArgs, DefaultError, DeviceType, true>('DeviceType', 'PUT', `${endpoint}/deviceType/update`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.DeviceTypeUpdateArgs>(
            args: Prisma.SelectSubset<T, Prisma.DeviceTypeUpdateArgs>,
            options?: Omit<(UseMutationOptions<(CheckSelect<T, DeviceType, Prisma.DeviceTypeGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.DeviceTypeUpdateArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, DeviceType, Prisma.DeviceTypeGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useUpdateManyDeviceType(options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.DeviceTypeUpdateManyArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.DeviceTypeUpdateManyArgs, DefaultError, Prisma.BatchPayload, false>('DeviceType', 'PUT', `${endpoint}/deviceType/updateMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.DeviceTypeUpdateManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.DeviceTypeUpdateManyArgs>,
            options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.DeviceTypeUpdateManyArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useUpsertDeviceType(options?: Omit<(UseMutationOptions<(DeviceType | undefined), DefaultError, Prisma.DeviceTypeUpsertArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.DeviceTypeUpsertArgs, DefaultError, DeviceType, true>('DeviceType', 'POST', `${endpoint}/deviceType/upsert`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.DeviceTypeUpsertArgs>(
            args: Prisma.SelectSubset<T, Prisma.DeviceTypeUpsertArgs>,
            options?: Omit<(UseMutationOptions<(CheckSelect<T, DeviceType, Prisma.DeviceTypeGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.DeviceTypeUpsertArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, DeviceType, Prisma.DeviceTypeGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useDeleteDeviceType(options?: Omit<(UseMutationOptions<(DeviceType | undefined), DefaultError, Prisma.DeviceTypeDeleteArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.DeviceTypeDeleteArgs, DefaultError, DeviceType, true>('DeviceType', 'DELETE', `${endpoint}/deviceType/delete`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.DeviceTypeDeleteArgs>(
            args: Prisma.SelectSubset<T, Prisma.DeviceTypeDeleteArgs>,
            options?: Omit<(UseMutationOptions<(CheckSelect<T, DeviceType, Prisma.DeviceTypeGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.DeviceTypeDeleteArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, DeviceType, Prisma.DeviceTypeGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useDeleteManyDeviceType(options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.DeviceTypeDeleteManyArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.DeviceTypeDeleteManyArgs, DefaultError, Prisma.BatchPayload, false>('DeviceType', 'DELETE', `${endpoint}/deviceType/deleteMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.DeviceTypeDeleteManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.DeviceTypeDeleteManyArgs>,
            options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.DeviceTypeDeleteManyArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useAggregateDeviceType<TArgs extends Prisma.DeviceTypeAggregateArgs, TQueryFnData = Prisma.GetDeviceTypeAggregateType<TArgs>, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.DeviceTypeAggregateArgs>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('DeviceType', `${endpoint}/deviceType/aggregate`, args, options, fetch);
}

export function useSuspenseAggregateDeviceType<TArgs extends Prisma.DeviceTypeAggregateArgs, TQueryFnData = Prisma.GetDeviceTypeAggregateType<TArgs>, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.DeviceTypeAggregateArgs>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('DeviceType', `${endpoint}/deviceType/aggregate`, args, options, fetch);
}

export function useGroupByDeviceType<TArgs extends Prisma.DeviceTypeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<TArgs>>, Prisma.Extends<'take', Prisma.Keys<TArgs>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? { orderBy: Prisma.DeviceTypeGroupByArgs['orderBy'] } : { orderBy?: Prisma.DeviceTypeGroupByArgs['orderBy'] }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<TArgs['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<TArgs['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<TArgs['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends TArgs['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
        ? never
        : P extends string
        ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
        : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`,
        ]
    }[HavingFields]
    : 'take' extends Prisma.Keys<TArgs>
    ? 'orderBy' extends Prisma.Keys<TArgs>
    ? ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields]
    : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<TArgs>
    ? 'orderBy' extends Prisma.Keys<TArgs>
    ? ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields]
    : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields], TQueryFnData = {} extends InputErrors ?
    Array<PickEnumerable<Prisma.DeviceTypeGroupByOutputType, TArgs['by']> &
        {
            [P in ((keyof TArgs) & (keyof Prisma.DeviceTypeGroupByOutputType))]: P extends '_count'
            ? TArgs[P] extends boolean
            ? number
            : Prisma.GetScalarType<TArgs[P], Prisma.DeviceTypeGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.DeviceTypeGroupByOutputType[P]>
        }
    > : InputErrors, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.SubsetIntersection<TArgs, Prisma.DeviceTypeGroupByArgs, OrderByArg> & InputErrors>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('DeviceType', `${endpoint}/deviceType/groupBy`, args, options, fetch);
}

export function useSuspenseGroupByDeviceType<TArgs extends Prisma.DeviceTypeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<TArgs>>, Prisma.Extends<'take', Prisma.Keys<TArgs>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? { orderBy: Prisma.DeviceTypeGroupByArgs['orderBy'] } : { orderBy?: Prisma.DeviceTypeGroupByArgs['orderBy'] }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<TArgs['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<TArgs['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<TArgs['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends TArgs['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
        ? never
        : P extends string
        ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
        : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`,
        ]
    }[HavingFields]
    : 'take' extends Prisma.Keys<TArgs>
    ? 'orderBy' extends Prisma.Keys<TArgs>
    ? ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields]
    : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<TArgs>
    ? 'orderBy' extends Prisma.Keys<TArgs>
    ? ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields]
    : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields], TQueryFnData = {} extends InputErrors ?
    Array<PickEnumerable<Prisma.DeviceTypeGroupByOutputType, TArgs['by']> &
        {
            [P in ((keyof TArgs) & (keyof Prisma.DeviceTypeGroupByOutputType))]: P extends '_count'
            ? TArgs[P] extends boolean
            ? number
            : Prisma.GetScalarType<TArgs[P], Prisma.DeviceTypeGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.DeviceTypeGroupByOutputType[P]>
        }
    > : InputErrors, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.SubsetIntersection<TArgs, Prisma.DeviceTypeGroupByArgs, OrderByArg> & InputErrors>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('DeviceType', `${endpoint}/deviceType/groupBy`, args, options, fetch);
}

export function useCountDeviceType<TArgs extends Prisma.DeviceTypeCountArgs, TQueryFnData = TArgs extends { select: any; } ? TArgs['select'] extends true ? number : Prisma.GetScalarType<TArgs['select'], Prisma.DeviceTypeCountAggregateOutputType> : number, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.DeviceTypeCountArgs>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('DeviceType', `${endpoint}/deviceType/count`, args, options, fetch);
}

export function useSuspenseCountDeviceType<TArgs extends Prisma.DeviceTypeCountArgs, TQueryFnData = TArgs extends { select: any; } ? TArgs['select'] extends true ? number : Prisma.GetScalarType<TArgs['select'], Prisma.DeviceTypeCountAggregateOutputType> : number, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.DeviceTypeCountArgs>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('DeviceType', `${endpoint}/deviceType/count`, args, options, fetch);
}

export function useCheckDeviceType<TError = DefaultError>(args: { operation: PolicyCrudKind; where?: { id?: string; name?: string }; }, options?: (Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<boolean, boolean, TError>('DeviceType', `${endpoint}/deviceType/check`, args, options, fetch);
}
