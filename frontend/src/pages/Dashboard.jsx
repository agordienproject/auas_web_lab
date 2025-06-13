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
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell
} from '@tremor/react';
import { dashboardService } from '../services';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const mapStatsKeys = (data) => ({
    totalInspections: Number(data.total_inspections) || 0,
    validatedInspections: Number(data.validated_inspections) || 0,
    pendingInspections: Number(data.pending_inspections) || 0,
    rejectedInspections: Number(data.deleted_inspections) || 0,
    uniquePiecesInspected: Number(data.unique_pieces_inspected) || 0,
    inspectionsWithDents: Number(data.inspections_with_dents) || 0,
    inspectionsWithCorrosions: Number(data.inspections_with_corrosions) || 0,
    inspectionsWithScratches: Number(data.inspections_with_scratches) || 0,
  });

  const mapDailyTrends = (data) =>
    (data || []).map(item => ({
      date: item.inspection_day,
      total: Number(item.total_inspections) || 0,
      validated: Number(item.validated_count) || 0,
      dents: Number(item.dents_found) || 0,
      corrosions: Number(item.corrosions_found) || 0,
      scratches: Number(item.scratches_found) || 0,
    }));

  const fetchDashboardData = async () => {
    try {
      const [inspectionStats, dailyTrends, pieceCurrentState, inspectorPerformance] = await Promise.all([
        dashboardService.getInspectionStats(),
        dashboardService.getDailyTrends(),
        dashboardService.getPieceCurrentState(),
        dashboardService.getInspectorPerformance()
      ]);
      setStats({
        ...mapStatsKeys(inspectionStats),
        trends: {
          daily: mapDailyTrends(dailyTrends),
          inspectorPerformance,
          inspectorEfficiency: inspectorPerformance,
          validationTimes: mapDailyTrends(dailyTrends)
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
                <Table className="mt-6">
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Inspector</TableHeaderCell>
                      <TableHeaderCell>Total Inspections</TableHeaderCell>
                      <TableHeaderCell>Validated</TableHeaderCell>
                      <TableHeaderCell>Unique Pieces</TableHeaderCell>
                      <TableHeaderCell>Last Inspection</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(stats.trends?.inspectorPerformance || []).map((inspector) => (
                      <TableRow key={inspector.id_user}>
                        <TableCell>{inspector.first_name} {inspector.last_name}</TableCell>
                        <TableCell>{inspector.total_inspections}</TableCell>
                        <TableCell>{inspector.validated_inspections}</TableCell>
                        <TableCell>{inspector.unique_pieces_inspected}</TableCell>
                        <TableCell>{inspector.last_inspection_date ? new Date(inspector.last_inspection_date).toLocaleDateString() : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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