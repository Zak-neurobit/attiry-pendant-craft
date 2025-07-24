
import { useState } from 'react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DashboardDateFilterProps {
  onDateRangeChange: (range: DateRange) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const DashboardDateFilter = ({ onDateRangeChange, onRefresh, isLoading }: DashboardDateFilterProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    onDateRangeChange(range);
  };

  const presetRanges = [
    {
      label: 'Today',
      range: {
        from: new Date(),
        to: new Date(),
      },
    },
    {
      label: 'Last 7 days',
      range: {
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
    },
    {
      label: 'Last 30 days',
      range: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
    },
    {
      label: 'Last 90 days',
      range: {
        from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
    },
  ];

  return (
    <Card id="dashboard-date-filter-card">
      <CardHeader>
        <CardTitle id="date-filter-title">Date Range Filter</CardTitle>
      </CardHeader>
      <CardContent id="date-filter-content">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            className="flex-1"
          />
          
          <div className="flex flex-wrap gap-2" id="preset-buttons">
            {presetRanges.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => handleDateRangeChange(preset.range)}
                id={`preset-${preset.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            id="refresh-data-button"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
