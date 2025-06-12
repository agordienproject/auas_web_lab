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
  Col,
  BarChart,
  DonutChart,
  LineChart,
  Legend,
  Metric,
} from '@tremor/react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Replace with your actual API endpoints
      const [statsResponse, trendsResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/trends')
      ]);

      if (!statsResponse.ok || !trendsResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [stats, trends] = await Promise.all([
        statsResponse.json(),
        trendsResponse.json()
      ]);

      setStats({ ...stats, trends });
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
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
                <Metric>{stats.totalInspections}</Metric>
                <DonutChart
                  className="mt-6"
                  data={[
                    { name: 'Validated', value: stats.validatedInspections },
                    { name: 'Pending', value: stats.pendingInspections },
                    { name: 'Deleted', value: stats.deletedInspections },
                  ]}
                  category="value"
                  index="name"
                  colors={['emerald', 'yellow', 'rose']}
                />
                <Legend
                  className="mt-3"
                  categories={['Validated', 'Pending', 'Deleted']}
                  colors={['emerald', 'yellow', 'rose']}
                />
              </Card>

              <Card>
                <Title>Unique Pieces</Title>
                <Metric>{stats.uniquePiecesInspected}</Metric>
                <BarChart
                  className="mt-6"
                  data={[
                    { name: 'With Dents', value: stats.inspectionsWithDents },
                    { name: 'With Corrosion', value: stats.inspectionsWithCorrosions },
                    { name: 'With Scratches', value: stats.inspectionsWithScratches },
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
                  data={stats.trends.inspectorPerformance}
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
                  data={stats.trends.daily}
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
                    { name: 'Dents', value: stats.inspectionsWithDents },
                    { name: 'Corrosion', value: stats.inspectionsWithCorrosions },
                    { name: 'Scratches', value: stats.inspectionsWithScratches },
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
                  data={stats.trends.inspectorEfficiency}
                  index="inspector"
                  categories={['inspections', 'validationRate']}
                  colors={['violet', 'indigo']}
                />
              </Card>

              <Card>
                <Title>Validation Time Distribution</Title>
                <LineChart
                  className="mt-6"
                  data={stats.trends.validationTimes}
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