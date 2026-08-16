import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import Step3Report from "../components/Step3Report";

function InterviewReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/interview/report/" + id,
          { withCredentials: true },
        );
        setReport(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReport();
  }, []);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas grid-bg">
        <p className="text-dim text-lg font-mono">Loading Report...</p>
      </div>
    );
  }

  return <Step3Report report={report} />;
}

export default InterviewReport;
