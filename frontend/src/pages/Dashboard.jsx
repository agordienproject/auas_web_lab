import { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
  Grid,
  BarChart,
  DonutChart,
  LineChart,
  Legend,
  Metric,
} from '@tremor/react';
import { dashboardService } from '../services';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Use dashboardService instead of direct fetch calls
      const [inspectionStats, dailyTrends, pieceCurrentState, inspectorPerformance] = await Promise.all([
        dashboardService.getInspectionStats(),
        dashboardService.getDailyTrends(),
        dashboardService.getPieceCurrentState(),
        dashboardService.getInspectorPerformance()
      ]);

      // Combine all data into a single stats object
      setStats({
        ...inspectionStats,
        trends: {
          daily: dailyTrends,
          inspectorPerformance,
          inspectorEfficiency: inspectorPerformance,
          validationTimes: dailyTrends
        },
        pieceData: pieceCurrentState
      });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">No data available</div>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Inspection Dashboard</Title>
      <Text>A comprehensive overview of inspection activities and metrics.</Text>

      <TabGroup className="mt-6">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Trends</Tab>
          <Tab>Performance</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel>
            <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
              <Card>
                <Title>Total Inspections</Title>
                <Metric>{stats.totalInspections || 0}</Metric>
                <DonutChart
                  className="mt-6"
                  data={[
                    { name: 'Validated', value: stats.validatedInspections || 0 },
                    { name: 'Pending', value: stats.pendingInspections || 0 },
                    { name: 'Rejected', value: stats.rejectedInspections || 0 },
                  ]}
                  category="value"
                  index="name"
                  colors={['emerald', 'yellow', 'rose']}
                />
                <Legend
                  className="mt-3"
                  categories={['Validated', 'Pending', 'Rejected']}
                  colors={['emerald', 'yellow', 'rose']}
                />
              </Card>

              <Card>
                <Title>Unique Pieces</Title>
                <Metric>{stats.uniquePiecesInspected || 0}</Metric>
                <BarChart
                  className="mt-6"
                  data={[
                    { name: 'With Dents', value: stats.inspectionsWithDents || 0 },
                    { name: 'With Corrosion', value: stats.inspectionsWithCorrosions || 0 },
                    { name: 'With Scratches', value: stats.inspectionsWithScratches || 0 },
                  ]}
                  index="name"
                  categories={['value']}
                  colors={['blue']}
                />
              </Card>

              <Card>
                <Title>Inspector Performance</Title>
                <LineChart
                  className="mt-6"
                  data={stats.trends?.inspectorPerformance || []}
                  index="date"
                  categories={['inspections']}
                  colors={['purple']}
                />
              </Card>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid numItemsMd={2} className="gap-6 mt-6">
              <Card>
                <Title>Daily Inspection Trends</Title>
                <LineChart
                  className="mt-6"
                  data={stats.trends?.daily || []}
                  index="date"
                  categories={['total', 'validated']}
                  colors={['blue', 'green']}
                />
              </Card>

              <Card>
                <Title>Issue Distribution</Title>
                <DonutChart
                  className="mt-6"
                  data={[
                    { name: 'Dents', value: stats.inspectionsWithDents || 0 },
                    { name: 'Corrosion', value: stats.inspectionsWithCorrosions || 0 },
                    { name: 'Scratches', value: stats.inspectionsWithScratches || 0 },
                  ]}
                  category="value"
                  index="name"
                  colors={['blue', 'cyan', 'indigo']}
                />
                <Legend
                  className="mt-3"
                  categories={['Dents', 'Corrosion', 'Scratches']}
                  colors={['blue', 'cyan', 'indigo']}
                />
              </Card>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid numItemsMd={2} className="gap-6 mt-6">
              <Card>
                <Title>Inspector Efficiency</Title>
                <BarChart
                  className="mt-6"
                  data={stats.trends?.inspectorEfficiency || []}
                  index="inspector"
                  categories={['inspections', 'validationRate']}
                  colors={['violet', 'indigo']}
                />
              </Card>

              <Card>
                <Title>Validation Time Distribution</Title>
                <LineChart
                  className="mt-6"
                  data={stats.trends?.validationTimes || []}
                  index="timeRange"
                  categories={['count']}
                  colors={['emerald']}
                />
              </Card>
            </Grid>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
} 