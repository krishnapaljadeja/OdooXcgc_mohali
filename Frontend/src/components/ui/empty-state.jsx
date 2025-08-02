import { Search, Inbox, AlertCircle, PlusCircle } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon = "search",
  title = "No results found",
  description = "Try adjusting your filters or search terms to find what you're looking for.",
  action,
  className,
}) {
  const icons = {
    search: Search,
    inbox: Inbox,
    alert: AlertCircle,
    plus: PlusCircle,
  };

  const IconComponent = icons[icon];

  return (
    <div
      className={cn(
        "text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100",
        className
      )}
    >
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <IconComponent className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>

        {action && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyStateWithFilters({
  onClearFilters,
  searchQuery,
  selectedCategory,
  selectedStatus,
  selectedDistance,
  className,
}) {
  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "All" ||
    selectedStatus !== "All" ||
    selectedDistance !== "All";

  if (!hasActiveFilters) {
    return (
      <EmptyState
        icon="inbox"
        title="No issues found"
        description="There are currently no issues reported in your area. Be the first to report an issue!"
        action={
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="w-4 h-4 mr-2" />
            Report Issue
          </Button>
        }
        className={className}
      />
    );
  }

  return (
    <EmptyState
      icon="search"
      title="No matching issues"
      description="No issues match your current filters. Try adjusting your search criteria."
      action={
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      }
      className={className}
    />
  );
}
