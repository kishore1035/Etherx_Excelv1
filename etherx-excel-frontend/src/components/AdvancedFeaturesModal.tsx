import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { AchievementsPage } from "./AchievementsPage";
import { ActivityLog } from "./ActivityLog";
import { DashboardBuilder } from "./DashboardBuilder";
import { Button } from "./ui/button";

interface AdvancedFeaturesModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

export function AdvancedFeaturesModal({ open, onClose, user }: AdvancedFeaturesModalProps) {
  const [showAchievements, setShowAchievements] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showDashboardBuilder, setShowDashboardBuilder] = useState(false);
  const [activities, setActivities] = useState([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [versionRestoreResult, setVersionRestoreResult] = useState<any>(null);
  // Fetch analytics
  useEffect(() => {
    fetch("/api/advanced/analytics", {
      headers: { Authorization: `Bearer ${user?.token}` },
    })
      .then((res) => res.json())
      .then(setAnalytics);
  }, [user]);

  // Fetch notifications
  useEffect(() => {
    fetch("/api/advanced/notify-comment", {
      headers: { Authorization: `Bearer ${user?.token}` },
    })
      .then((res) => res.json())
      .then(setNotifications);
  }, [user]);

  // Fetch sessions
  useEffect(() => {
    fetch("/api/advanced/sessions", {
      headers: { Authorization: `Bearer ${user?.token}` },
    })
      .then((res) => res.json())
      .then(setSessions);
  }, [user]);

  useEffect(() => {
    if (showActivityLog) {
      fetch("/api/advanced/log", {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
        .then((res) => res.json())
        .then(setActivities);
    }
  }, [showActivityLog, user]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Advanced Features</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          <Button onClick={() => setShowAchievements(true)} variant="outline">Achievements</Button>
          <Button onClick={() => setShowActivityLog(true)} variant="outline">Activity Log</Button>
          <Button onClick={() => setShowDashboardBuilder(true)} variant="outline">Dashboard Builder</Button>
          <Button onClick={() => setSearchResults([])} variant="outline">Advanced Search</Button>
          <Button onClick={() => setVersionRestoreResult(null)} variant="outline">Restore Version</Button>
        </div>

        {/* Analytics */}
        {analytics && (
          <Card className="my-4 p-4">
            <h3 className="font-bold mb-2">User Analytics</h3>
            <p>Spreadsheets: {analytics.spreadsheetCount}</p>
            <p>Comments: {analytics.commentCount}</p>
          </Card>
        )}

        {/* Notifications */}
        {notifications && notifications.length > 0 && (
          <Card className="my-4 p-4">
            <h3 className="font-bold mb-2">Notifications</h3>
            {notifications.map((n, i) => (
              <div key={i} className="mb-2">{n.message}</div>
            ))}
          </Card>
        )}

        {/* Sessions */}
        {sessions && sessions.length > 0 && (
          <Card className="my-4 p-4">
            <h3 className="font-bold mb-2">Collaborative Sessions</h3>
            {sessions.map((s, i) => (
              <div key={i} className="mb-2">Session {s.sessionId}: {s.activeUsers} active users</div>
            ))}
          </Card>
        )}

        {/* Advanced Search */}
        <div className="my-4">
          <input
            type="text"
            placeholder="Search spreadsheets..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <Button
            onClick={() => {
              fetch(`/api/advanced/spreadsheet/search?q=${encodeURIComponent(searchQuery)}`, {
                headers: { Authorization: `Bearer ${user?.token}` },
              })
                .then(res => res.json())
                .then(setSearchResults);
            }}
            variant="outline"
          >Search</Button>
          {searchResults.length > 0 && (
            <Card className="mt-2 p-2">
              <h3 className="font-bold mb-2">Search Results</h3>
              {searchResults.map((r, i) => (
                <div key={i} className="mb-1">{r.name}</div>
              ))}
            </Card>
          )}
        </div>

        {/* Version Restore */}
        <div className="my-4">
          <input
            type="text"
            placeholder="Spreadsheet ID"
            id="restore-spreadsheet-id"
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Version Index"
            id="restore-version-index"
            className="border p-2 rounded w-full mb-2"
          />
          <Button
            onClick={() => {
              const spreadsheetId = (document.getElementById("restore-spreadsheet-id") as HTMLInputElement)?.value;
              const versionIndex = +(document.getElementById("restore-version-index") as HTMLInputElement)?.value;
              fetch(`/api/advanced/spreadsheet/${spreadsheetId}/restore-version`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user?.token}`,
                },
                body: JSON.stringify({ versionIndex }),
              })
                .then(res => res.json())
                .then(setVersionRestoreResult);
            }}
            variant="outline"
          >Restore Version</Button>
          {versionRestoreResult && (
            <Card className="mt-2 p-2">
              <h3 className="font-bold mb-2">Restore Result</h3>
              <pre>{JSON.stringify(versionRestoreResult, null, 2)}</pre>
            </Card>
          )}
        </div>
        {showAchievements && (
          <AchievementsPage open={showAchievements} onClose={() => setShowAchievements(false)} />
        )}
        {showActivityLog && (
          <ActivityLog open={showActivityLog} onClose={() => setShowActivityLog(false)} activities={activities} />
        )}
        {showDashboardBuilder && (
          <DashboardBuilder open={showDashboardBuilder} onClose={() => setShowDashboardBuilder(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
