import { useCallback, useEffect, useState } from "react";
import { api } from "../../config/axiosSetup";

export const useChartData = (userId, role = "student") => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/marksheet/exams?user_id=${userId}`);
          console.log("Charts data received:", response.data);
          setResponse(response.data);
        } catch (error) {
          console.error("Error fetching charts data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [userId]);

  // Filter subjects by type
  const filterSubjectsByType = useCallback((subjectType) => {
    if (!response?.data?.length) return [];
    return response.data[0].subjects.filter(item => item.subject_type === subjectType);
  }, [response]);

  // Get all subjects
  const getAllSubjects = useCallback(() => {
    if (!response?.data?.length) return [];
    return response.data[0].subjects;
  }, [response]);

  // Get subject names
  const getSubjectNames = useCallback(() => {
    if (!response?.data?.length) return [];
    return response.data[0].subjects.map(subject => subject.subject_name);
  }, [response]);

  return {
    response,
    loading,
    filterSubjectsByType,
    getAllSubjects,
    getSubjectNames
  };
};
