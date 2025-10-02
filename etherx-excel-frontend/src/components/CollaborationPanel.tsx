import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import {
  Users,
  Mail,
  Link2,
  UserPlus,
  Trash2,
  Shield,
  Eye,
  Edit,
  Crown,
  Copy,
  Check,
  Settings,
  Clock,
  Activity,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: "owner" | "editor" | "viewer";
  status: "active" | "pending" | "offline";
  lastActive: Date;
  avatar?: string;
}

export interface ShareSettings {
  linkSharing: boolean;
  linkAccess: "viewer" | "editor";
  allowComments: boolean;
  allowDownload: boolean;
  requireLogin: boolean;
}

interface CollaborationPanelProps {
  open: boolean;
  onClose: () => void;
  collaborators: Collaborator[];
  shareSettings: ShareSettings;
  shareLink: string;
  currentUserId: string;
  onInvite: (email: string, role: string) => void;
  onRemoveCollaborator: (collaboratorId: string) => void;
  onChangeRole: (collaboratorId: string, role: string) => void;
  onUpdateShareSettings: (settings: Partial<ShareSettings>) => void;
}

export function CollaborationPanel({
  open,
  onClose,
  collaborators,
  shareSettings,
  shareLink,
  currentUserId,
  onInvite,
  onRemoveCollaborator,
  onChangeRole,
  onUpdateShareSettings,
}: CollaborationPanelProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [linkCopied, setLinkCopied] = useState(false);

  const handleInvite = () => {
    if (!inviteEmail || !inviteEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    onInvite(inviteEmail, inviteRole);
    setInviteEmail("");
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast.success("Link copied to clipboard");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "editor":
        return <Edit className="w-4 h-4 text-blue-500" />;
      case "viewer":
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Collaboration & Sharing
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="people" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="people">
              <Users className="w-4 h-4 mr-2" />
              People
            </TabsTrigger>
            <TabsTrigger value="invite">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </TabsTrigger>
            <TabsTrigger value="link">
              <Link2 className="w-4 h-4 mr-2" />
              Link
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* People Tab */}
          <TabsContent value="people" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  {collaborators.length} member{collaborators.length !== 1 ? "s" : ""} with
                  access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {collaborators.map((collaborator) => {
                      const isCurrentUser = collaborator.id === currentUserId;
                      const isOwner = collaborator.role === "owner";

                      return (
                        <div
                          key={collaborator.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="relative">
                              <Avatar>
                                <AvatarFallback>
                                  {collaborator.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(
                                  collaborator.status
                                )}`}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">
                                  {collaborator.name}
                                  {isCurrentUser && (
                                    <span className="text-xs text-muted-foreground ml-2">
                                      (You)
                                    </span>
                                  )}
                                </p>
                                {getRoleIcon(collaborator.role)}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {collaborator.email}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {formatLastActive(collaborator.lastActive)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!isCurrentUser && !isOwner && (
                              <Select
                                value={collaborator.role}
                                onValueChange={(value) =>
                                  onChangeRole(collaborator.id, value)
                                }
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="editor">Editor</SelectItem>
                                  <SelectItem value="viewer">Viewer</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                            {isOwner && (
                              <Badge variant="secondary" className="gap-1">
                                <Crown className="w-3 h-3" />
                                Owner
                              </Badge>
                            )}
                            {!isCurrentUser && !isOwner && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemoveCollaborator(collaborator.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invite Tab */}
          <TabsContent value="invite" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Invite People</CardTitle>
                <CardDescription>
                  Send an invitation to collaborate on this spreadsheet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="colleague@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleInvite();
                        }
                      }}
                    />
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="editor">
                          <div className="flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            Editor
                          </div>
                        </SelectItem>
                        <SelectItem value="viewer">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Viewer
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleInvite} className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-3">Role Permissions</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Edit className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Editor</p>
                        <p className="text-sm text-muted-foreground">
                          Can view, edit, comment, and share the spreadsheet
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Eye className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Viewer</p>
                        <p className="text-sm text-muted-foreground">
                          Can only view and comment on the spreadsheet
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Link Tab */}
          <TabsContent value="link" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Share Link</CardTitle>
                <CardDescription>
                  Anyone with the link can access this spreadsheet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Link Sharing</span>
                  </div>
                  <Switch
                    checked={shareSettings.linkSharing}
                    onCheckedChange={(checked) =>
                      onUpdateShareSettings({ linkSharing: checked })
                    }
                  />
                </div>

                {shareSettings.linkSharing && (
                  <>
                    <div className="space-y-2">
                      <Label>Access Level</Label>
                      <Select
                        value={shareSettings.linkAccess}
                        onValueChange={(value: "viewer" | "editor") =>
                          onUpdateShareSettings({ linkAccess: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="editor">
                            <div className="flex items-center gap-2">
                              <Edit className="w-4 h-4" />
                              Anyone with link can edit
                            </div>
                          </SelectItem>
                          <SelectItem value="viewer">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              Anyone with link can view
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Shareable Link</Label>
                      <div className="flex gap-2">
                        <Input value={shareLink} readOnly className="flex-1" />
                        <Button onClick={handleCopyLink} variant="outline">
                          {linkCopied ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security & Permissions</CardTitle>
                <CardDescription>
                  Control who can access and what they can do
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Allow Comments</p>
                    <p className="text-sm text-muted-foreground">
                      Let viewers add comments to cells
                    </p>
                  </div>
                  <Switch
                    checked={shareSettings.allowComments}
                    onCheckedChange={(checked) =>
                      onUpdateShareSettings({ allowComments: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Allow Download</p>
                    <p className="text-sm text-muted-foreground">
                      Let collaborators download the spreadsheet
                    </p>
                  </div>
                  <Switch
                    checked={shareSettings.allowDownload}
                    onCheckedChange={(checked) =>
                      onUpdateShareSettings({ allowDownload: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Require Login</p>
                    <p className="text-sm text-muted-foreground">
                      Users must sign in to view this spreadsheet
                    </p>
                  </div>
                  <Switch
                    checked={shareSettings.requireLogin}
                    onCheckedChange={(checked) =>
                      onUpdateShareSettings({ requireLogin: checked })
                    }
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-500">Security Notice</p>
                      <p className="text-sm text-muted-foreground">
                        Shared spreadsheets may contain sensitive data. Only share with
                        trusted collaborators.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}