import api from './api';

class DashboardService {
  // Get dashboard overview data
  async getDashboardOverview() {
    try {
      const response = await api.get('/dashboard/overview');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard data' };
    }
  }

  // Get inspection statistics
  async getInspectionStats() {
    try {
      const response = await api.get('/dashboards/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inspection stats' };
    }
  }

  // Get piece current state
  async getPieceCurrentState() {
    try {
      const response = await api.get('/dashboards/pieces');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch piece data' };
    }
  }

  // Get inspector performance
  async getInspectorPerformance() {
    try {
      const response = await api.get('/dashboards/inspectors');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inspector performance' };
    }
  }

  // Get daily trends
  async getDailyTrends() {
    try {
      const response = await api.get('/dashboards/trends');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch daily trends' };
    }
  }

  // Get piece history summary
  async getPieceHistorySummary() {
    try {
      const response = await api.get('/dashboards/piece-history');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch piece history' };
    }
  }

  // Get recent inspections
  async getRecentInspections() {
    try {
      const response = await api.get(`/inspections/recent`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch recent inspections' };
    }
  }

  // Get pending validations count
  async getPendingValidationsCount() {
    try {
      const response = await api.get('/dashboard/pending-validations-count');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pending validations count' };
    }
  }
}

export default new DashboardService(); 