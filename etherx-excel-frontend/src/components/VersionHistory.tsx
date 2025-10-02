import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import {
  Clock,
  RotateCcw,
  User as UserIcon,
  Calendar,
  Download,
  Eye,
  Search,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export interface Version {
  id: string;
  timestamp: Date;
  author: string;
  authorEmail: string;
  changesSummary: string;
  changesCount: number;
  isCurrent: boolean;
  size: string;
}

interface VersionHistoryProps {
  open: boolean;
  onClose: () => void;
  versions: Version[];
  onRestore: (versionId: string) => void;
  onPreview: (versionId: string) => void;
  onExport: (versionId: string) => void;
}

export function VersionHistory({
  open,
  onClose,
  versions,
  onRestore,
  onPreview,
  onExport,
}: VersionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVersions = versions.filter(
    (version) =>
      version.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.changesSummary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleRestore = (versionId: string, versionName: string) => {
    if (
      window.confirm(
        `Are you sure you want to restore this version? Current changes will be saved as a new version.\n\nVersion: ${versionName}`
      )
    ) {
      onRestore(versionId);
      toast.success("Version restored successfully");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Version History
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search versions by author or changes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Versions</p>
              <p className="text-2xl font-bold">{versions.length}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Contributors</p>
              <p className="text-2xl font-bold">
                {new Set(versions.map((v) => v.author)).size}
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Changes</p>
              <p className="text-2xl font-bold">
                {versions.reduce((sum, v) => sum + v.changesCount, 0)}
              </p>
            </div>
          </div>

          {/* Version List */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-2 pr-4">
              {filteredVersions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">
                    {searchQuery ? "No versions found" : "No version history yet"}
                  </p>
                </div>
              ) : (
                filteredVersions.map((version, index) => (
                  <div
                    key={version.id}
                    className={`p-4 rounded-lg border transition-all ${
                      version.isCurrent
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {version.author.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{version.author}</p>
                            {version.isCurrent && (
                              <Badge variant="default" className="text-xs">
                                Current
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mb-2">
                            {version.changesSummary}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(version.timestamp)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(version.timestamp)}
                            </div>
                            <div>
                              {version.changesCount} change
                              {version.changesCount !== 1 ? "s" : ""}
                            </div>
                            <div>{version.size}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onPreview(version.id)}
                          title="Preview this version"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onExport(version.id)}
                          title="Export this version"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {!version.isCurrent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRestore(
                                version.id,
                                `${formatDate(version.timestamp)} at ${formatTime(
                                  version.timestamp
                                )}`
                              )
                            }
                            title="Restore this version"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Clock className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-muted-foreground">
              Versions are automatically saved every few minutes when changes are made
            </p>
          </div>
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