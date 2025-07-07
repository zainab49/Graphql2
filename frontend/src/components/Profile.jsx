import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_USER_INFO,
  GEt_Total_XPInKB,
  GET_PROJECTS_WITH_XP,
  GET_PROJECTS_PASS_FAIL,
  GET_LATEST_PROJECTS_WITH_XP,
  GET_PISCINE_GO_XP,
  GET_PISCINE_JS_XP,
  GET_PROJECT_XP,
  GET_AUDITS
} from '../graphql/queries';
import PassFailChart from './Graphs/PassFailChart';
import XPByProjectChart from './Graphs/XPByProjectChart';
import './Profile.css';

function Profile() {
  const { data: userData, loading: userLoading } = useQuery(GET_USER_INFO);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (userData && userData.user && userData.user.length > 0) {
      setUserId(userData.user[0].id);
    }
  }, [userData]);

  const { data: xpdata } = useQuery(GEt_Total_XPInKB, { variables: { userId } });
  const { data: piscineGoXPData } = useQuery(GET_PISCINE_GO_XP, { variables: { userId } });
  const { data: piscineJsXPData } = useQuery(GET_PISCINE_JS_XP, { variables: { userId } });
  const { data: projectXPData } = useQuery(GET_PROJECT_XP, { variables: { userId } });
  const { data: projectsData } = useQuery(GET_PROJECTS_WITH_XP, { variables: { userId } });
  const { data: passFailData } = useQuery(GET_PROJECTS_PASS_FAIL, { variables: { userId } });
  const { data: latestProjectsData } = useQuery(GET_LATEST_PROJECTS_WITH_XP, { variables: { userId } });
const { data: auditsData } = useQuery(GET_AUDITS, { variables: { userId } });

  if (
    userLoading ||
    !xpdata ||
    !piscineGoXPData ||
    !piscineJsXPData ||
    !projectXPData ||
    !projectsData ||
    !passFailData ||
    !latestProjectsData
  ) {
    return <div className="text-center">Loading...</div>;
  }

  const currentUser = userData?.user[0] || {};
  const piscineGoXPTotal = piscineGoXPData?.transaction.reduce((sum, tx) => sum + tx.amount, 0) / 1000 || 0;
  const piscineJsXPTotal = (piscineJsXPData?.transaction_aggregate?.aggregate?.sum?.amount || 0) / 1000;
  const projectXPTotal = (projectXPData?.transaction_aggregate?.aggregate?.sum?.amount || 0) / 1000;
  const totalXP = xpdata?.transaction_aggregate?.aggregate?.sum?.amount || 0;
  const totalXPInKB = (totalXP / 1000).toFixed(2);
  const projects = projectsData?.transaction || [];
  const passCount = passFailData.progress.filter((item) => item.grade !== null && item.grade >= 1).length;
  const failCount = passFailData.progress.filter((item) => item.grade !== null && item.grade < 1).length;
  const latestProjects = latestProjectsData?.transaction || [];
  const audits = auditsData?.progress || [];
const passedAudits = audits.filter(a => a.grade >= 1).length;
const auditSuccessRate = audits.length 
  ? Math.round((passedAudits / audits.length) * 100) 
  : 0;
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  return (
    <div className="profile-container">
      <header className="header">
        <h1>Welcome, {currentUser.firstName}</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="main-content">
        <div className="left-column">
          {/* Profile Info */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar">
                {currentUser.firstName[0]}{currentUser.lastName[0]}
              </div>
              <div className="profile-info">
                <h2>{currentUser.firstName} {currentUser.lastName}</h2>
                <p className="username">@{currentUser.login}</p>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                 <div className="info-label">Audit Ratio</div>
                 <div className="info-value">{auditSuccessRate}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Email</div>
                <div className="info-value">{currentUser.email}</div>
              </div>
            </div>
          </div>

          {/* XP Summary */}
          <div className="xp-summary">
            <div className="xp-title">XP Summary</div>
            <div className="total-xp">
              <div className="total-xp-value">{totalXPInKB}</div>
              <div className="total-xp-label">Total XP (KB)</div>
            </div>
            <div className="xp-breakdown">
              <div className="xp-item">
                <div className="xp-item-value">{piscineGoXPTotal.toFixed(2)}</div>
                <div className="xp-item-label">Piscine Go</div>
              </div>
              <div className="xp-item">
                <div className="xp-item-value">{piscineJsXPTotal.toFixed(2)}</div>
                <div className="xp-item-label">Piscine JS</div>
              </div>
              <div className="xp-item">
                <div className="xp-item-value">{projectXPTotal.toFixed(2)}</div>
                <div className="xp-item-label">Project XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Project List */}
        <div className="projects-section">
          <div className="section-title">Finished Projects</div>
          <div className="projects-list">
            {projects.map((project) => (
              <div key={project.id} className="project-item">
                <div className="project-header">
                  <div className="project-name">{project.object?.name}</div>
                  <div className="project-xp">{(project.amount / 1000).toFixed(2)} KB</div>
                </div>
                <div className="project-date">{new Date(project.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="charts-section">
          <div className="chart-card">
            <div className="chart-title">XP by Latest 12 Projects</div>
            <XPByProjectChart projects={latestProjects} />
          </div>
          <div className="chart-card">
            <div className="chart-title">Projects PASS and FAIL Ratio</div>
            <PassFailChart passCount={passCount} failCount={failCount} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
