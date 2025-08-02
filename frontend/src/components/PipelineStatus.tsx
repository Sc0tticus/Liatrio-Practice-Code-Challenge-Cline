import React, { useState, useEffect } from "react";
import { PipelineStatus as PipelineStatusType } from "../types/Todo";
import { healthApi } from "../services/api";
import "./PipelineStatus.css";

const PipelineStatus: React.FC = () => {
  const [status, setStatus] = useState<PipelineStatusType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      setLoading(true);
      const health = await healthApi.checkHealth();

      // Mock pipeline status based on health check
      const mockStatus: PipelineStatusType = {
        status: health.status === "OK" ? "success" : "failure",
        lastRun: health.timestamp,
        duration: Math.floor(health.uptime / 60), // Convert to minutes
        branch: "main",
        commit: "abc123f",
        message: health.status === "OK" ? "All tests passed" : "Build failed",
      };

      setStatus(mockStatus);
      setLastChecked(new Date());
      setError(null);
    } catch (err) {
      setError("Failed to fetch pipeline status");
      console.error("Error fetching pipeline status:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "#28a745";
      case "failure":
        return "#dc3545";
      case "running":
        return "#ffc107";
      case "pending":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "✅";
      case "failure":
        return "❌";
      case "running":
        return "🔄";
      case "pending":
        return "⏳";
      default:
        return "❓";
    }
  };

  if (loading && !status) {
    return <div className="loading">Loading pipeline status...</div>;
  }

  return (
    <div className="pipeline-status">
      <h2>CI/CD Pipeline Status</h2>

      {error && <div className="error">{error}</div>}

      {status && (
        <div className="status-card">
          <div className="status-header">
            <div
              className="status-indicator"
              style={{ color: getStatusColor(status.status) }}
            >
              {getStatusIcon(status.status)} {status.status.toUpperCase()}
            </div>
            <button
              onClick={checkStatus}
              disabled={loading}
              className="refresh-btn"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="status-details">
            <div className="detail-item">
              <strong>Branch:</strong> {status.branch}
            </div>
            <div className="detail-item">
              <strong>Commit:</strong> {status.commit}
            </div>
            <div className="detail-item">
              <strong>Message:</strong> {status.message}
            </div>
            <div className="detail-item">
              <strong>Last Run:</strong>{" "}
              {new Date(status.lastRun).toLocaleString()}
            </div>
            {status.duration && (
              <div className="detail-item">
                <strong>Duration:</strong> {status.duration} minutes
              </div>
            )}
            <div className="detail-item">
              <strong>Last Checked:</strong> {lastChecked.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      <div className="pipeline-info">
        <h3>Pipeline Configuration</h3>
        <ul>
          <li>✅ Automated unit tests</li>
          <li>✅ TypeScript type checking</li>
          <li>✅ ESLint code quality checks</li>
          <li>✅ Docker image building</li>
          <li>✅ Automatic deployment</li>
        </ul>

        <h3>Recent Activity</h3>
        <div className="activity-log">
          <div className="activity-item">
            <span className="activity-time">2 minutes ago</span>
            <span className="activity-message">
              Build completed successfully
            </span>
          </div>
          <div className="activity-item">
            <span className="activity-time">15 minutes ago</span>
            <span className="activity-message">Tests passed (12/12)</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">15 minutes ago</span>
            <span className="activity-message">Linting completed</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">16 minutes ago</span>
            <span className="activity-message">Build started</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineStatus;
