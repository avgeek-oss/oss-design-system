import {
  LoadingSkeleton,
  SkeletonCard,
} from "../../../src/patterns/feedback/loading-skeleton";
export default (
  <div className="p-4">
    <LoadingSkeleton
      aria-label="Loading overview"
      className="grid-cols-1 sm:grid-cols-2"
    >
      <SkeletonCard className="h-48" />
      <div className="grid grid-cols-2 gap-4">
        <SkeletonCard className="h-24" />
        <SkeletonCard className="h-24" />
        <SkeletonCard className="h-24" />
        <SkeletonCard className="h-24" />
      </div>
    </LoadingSkeleton>
  </div>
);
