import api from './api';

class MediaService {
  async list(folderPath) {
    const res = await api.get('/dashboards/inspection-media', { params: { folderPath } });
    return res.data; // [{name,size,type:'image'|'video'}]
  }

  mediaUrl(folderPath, fileName) {
    const base = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:3000/api';
    return `${base}/dashboards/inspection-media/${encodeURIComponent(fileName)}?folderPath=${encodeURIComponent(folderPath)}`;
  }
}

export default new MediaService();
