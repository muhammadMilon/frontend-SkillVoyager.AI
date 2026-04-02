import useAxiosSecure from './axios';

export const useAdminService = () => {
  const axios = useAxiosSecure();

  const getDashboardStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/stats');
      return data;
    } catch {
      return null;
    }
  };

  const getAllUsers = async () => {
    try {
      const { data } = await axios.get('/api/user');
      return data.users || [];
    } catch {
      return [];
    }
  };

  const getAllCourses = async () => {
    try {
      const { data } = await axios.get('/api/courses');
      return data.courses || [];
    } catch {
      return [];
    }
  };

  const addCourse = async (courseData) => {
    try {
      const { data } = await axios.post('/api/courses', courseData);
      return data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to add course' };
    }
  };

  const deleteCourse = async (id) => {
    try {
      const { data } = await axios.delete(`/api/courses/${id}`);
      return data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to delete course' };
    }
  };

  const getTransactions = async () => {
    try {
      const { data } = await axios.get('/api/transactions');
      return data || [];
    } catch {
      return [];
    }
  };

  return {
    getDashboardStats,
    getAllUsers,
    getAllCourses,
    addCourse,
    deleteCourse,
    getTransactions
  };
};
