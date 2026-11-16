import { Skeleton } from '@flaut-org/react-md3e/skeleton';

export const sized = <Skeleton variant="rounded" width="100%" height={120} animation="wave" />;
// @ts-expect-error Finite animation contract.
export const invalid = <Skeleton animation="shimmer" />;
