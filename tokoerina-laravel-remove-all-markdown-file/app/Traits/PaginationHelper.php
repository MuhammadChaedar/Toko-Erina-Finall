<?php

namespace App\Traits;

use Illuminate\Pagination\LengthAwarePaginator;

trait PaginationHelper
{
    /**
     * Format single resource response
     */
    protected function formatResource($resource): array
    {
        return [
            'data' => $resource,
        ];
    }

    /**
     * Format pagination response to custom format
     */
    protected function formatPagination(LengthAwarePaginator $paginator): array
    {
        return [
            'data' => $paginator->items(),
            'limit' => $paginator->perPage(),
            'page' => $paginator->currentPage(),
            'size' => count($paginator->items()),
            'pages' => $paginator->lastPage(),
        ];
    }

    /**
     * Apply ordering to query based on request parameters
     * order=field_name&sort=-1 (descending) or sort=1 (ascending)
     */
    protected function applyOrdering($query, $request)
    {
        $order = $request->query('order');
        $sort = $request->query('sort');

        if ($order && $sort) {
            // -1 = descending (terbaru), 1 = ascending (terlama)
            $direction = $sort == '-1' ? 'desc' : 'asc';
            $query = $query->orderBy($order, $direction);
        }

        return $query;
    }

    /**
     * Apply search/filter to query based on request parameter 'value'
     */
    protected function applySearch($query, $request, $searchableColumns = [])
    {
        $searchValue = $request->query('value');

        if ($searchValue && !empty($searchableColumns)) {
            $query = $query->where(function ($q) use ($searchValue, $searchableColumns) {
                foreach ($searchableColumns as $column) {
                    $q->orWhere($column, 'like', "%{$searchValue}%");
                }
            });
        }

        return $query;
    }
}
