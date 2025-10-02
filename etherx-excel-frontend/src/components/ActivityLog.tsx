import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { useState } from "react";
import {
  Activity,
  FileEdit,
  UserPlus,
  Download,
  Share2,
  MessageSquare,
  Trash2,
  Eye,
  Edit,
  Search,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export interface ActivityEvent {
  id: string;
  type: "edit" | "comment" | "share" | "download" | "delete" | "view" | "invite";
  user: string;
  userEmail: string;
  description: string;
  timestamp: Date;
  cellId?: string;
  details?: string;
}

interface ActivityLogProps {
  open: boolean;
  onClose: () => void;
  activities: ActivityEvent[];
}

export function ActivityLog({ open, onClose, activities }: ActivityLogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "edit":
        return <FileEdit className="w-4 h-4 text-blue-500" />;
      case "comment":
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case "share":
        return <Share2 className="w-4 h-4 text-purple-500" />;
      case "download":
        return <Download className="w-4 h-4 text-orange-500" />;
      case "delete":
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case "view":
        return <Eye className="w-4 h-4 text-gray-500" />;
      case "invite":
        return <UserPlus className="w-4 h-4 text-cyan-500" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "edit":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "comment":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "share":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "download":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "delete":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "view":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "invite":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || activity.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = new Date(activity.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, ActivityEvent[]>);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activity Log
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="edit">Edits</SelectItem>
                <SelectItem value="comment">Comments</SelectItem>
                <SelectItem value="share">Sharing</SelectItem>
                <SelectItem value="download">Downloads</SelectItem>
                <SelectItem value="invite">Invites</SelectItem>
                <SelectItem value="view">Views</SelectItem>
                <SelectItem value="delete">Deletions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-2xl font-bold">{activities.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-500">
                {activities.filter((a) => a.type === "edit").length}
              </p>
              <p className="text-xs text-muted-foreground">Edits</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-500">
                {activities.filter((a) => a.type === "comment").length}
              </p>
              <p className="text-xs text-muted-foreground">Comments</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-500">
                {activities.filter((a) => a.type === "share").length}
              </p>
              <p className="text-xs text-muted-foreground">Shares</p>
            </div>
          </div>

          {/* Activity List */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-6 pr-4">
              {Object.keys(groupedActivities).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Activity className="w-12 h-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">
                    {searchQuery || filterType !== "all"
                      ? "No activities found"
                      : "No activity yet"}
                  </p>
                </div>
              ) : (
                Object.entries(groupedActivities).map(([date, dayActivities]) => (
                  <div key={date}>
                    <div className="sticky top-0 bg-background py-2 mb-3">
                      <p className="text-sm font-medium text-muted-foreground">
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {dayActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                        >
                          <div
                            className={`p-2 rounded-lg border ${getActivityColor(
                              activity.type
                            )}`}
                          >
                            {getActivityIcon(activity.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div>
                                <p className="font-medium">{activity.user}</p>
                                <p className="text-sm text-foreground">
                                  {activity.description}
                                </p>
                                {activity.details && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {activity.details}
                                  </p>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatTime(activity.timestamp)}
                              </span>
                            </div>
                            {activity.cellId && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Cell: {activity.cellId}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}