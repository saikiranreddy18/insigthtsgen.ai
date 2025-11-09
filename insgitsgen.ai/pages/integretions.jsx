import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Link2, 
  FileSpreadsheet, 
  Database, 
  Upload, 
  CheckCircle2,
  XCircle,
  RefreshCw,
  Trash2,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";

export default function Integrations() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSource, setNewSource] = useState({
    name: "",
    source_type: "google_sheets",
    connection_url: "",
    sync_frequency: "manual",
    auto_analyze: false
  });

  const { data: dataSources, isLoading } = useQuery({
    queryKey: ['dataSources'],
    queryFn: () => base44.entities.DataSource.list('-created_date'),
    initialData: [],
  });

  const createSourceMutation = useMutation({
    mutationFn: (data) => base44.entities.DataSource.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataSources'] });
      setIsDialogOpen(false);
      setNewSource({
        name: "",
        source_type: "google_sheets",
        connection_url: "",
        sync_frequency: "manual",
        auto_analyze: false
      });
    },
  });

  const deleteSourceMutation = useMutation({
    mutationFn: (id) => base44.entities.DataSource.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataSources'] });
    },
  });

  const syncSourceMutation = useMutation({
    mutationFn: async (source) => {
      // In a real app, this would trigger data sync
      await base44.entities.DataSource.update(source.id, {
        last_synced: new Date().toISOString(),
        status: "active"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataSources'] });
    },
  });

  const handleCreateSource = () => {
    createSourceMutation.mutate(newSource);
  };

  const sourceIcons = {
    google_sheets: FileSpreadsheet,
    csv_url: Database,
    json_api: Link2,
    manual_upload: Upload
  };

  const sourceColors = {
    google_sheets: "from-green-500 to-emerald-500",
    csv_url: "from-blue-500 to-indigo-500",
    json_api: "from-purple-500 to-violet-500",
    manual_upload: "from-orange-500 to-amber-500"
  };

  const statusColors = {
    active: "bg-green-100 text-green-800 border-green-200",
    inactive: "bg-slate-100 text-slate-800 border-slate-200",
    error: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Data Integrations
                </span>
              </h1>
              <p className="text-lg text-slate-600">
                Connect your business data sources for automatic analysis
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Data Source
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Connect New Data Source</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Source Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Sales Dashboard Q4"
                      value={newSource.name}
                      onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="source_type">Source Type</Label>
                    <Select
                      value={newSource.source_type}
                      onValueChange={(value) => setNewSource({ ...newSource, source_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google_sheets">Google Sheets</SelectItem>
                        <SelectItem value="csv_url">CSV URL</SelectItem>
                        <SelectItem value="json_api">JSON API</SelectItem>
                        <SelectItem value="manual_upload">Manual Upload</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newSource.source_type !== "manual_upload" && (
                    <div className="space-y-2">
                      <Label htmlFor="url">Connection URL</Label>
                      <Input
                        id="url"
                        placeholder={
                          newSource.source_type === "google_sheets"
                            ? "https://docs.google.com/spreadsheets/d/..."
                            : newSource.source_type === "csv_url"
                            ? "https://example.com/data.csv"
                            : "https://api.example.com/data"
                        }
                        value={newSource.connection_url}
                        onChange={(e) => setNewSource({ ...newSource, connection_url: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="sync">Sync Frequency</Label>
                    <Select
                      value={newSource.sync_frequency}
                      onValueChange={(value) => setNewSource({ ...newSource, sync_frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual Only</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                    <div>
                      <Label htmlFor="auto-analyze" className="text-base font-semibold">
                        Auto-Analyze New Data
                      </Label>
                      <p className="text-sm text-slate-600 mt-1">
                        Automatically create analysis when new data is synced
                      </p>
                    </div>
                    <Switch
                      id="auto-analyze"
                      checked={newSource.auto_analyze}
                      onCheckedChange={(checked) => setNewSource({ ...newSource, auto_analyze: checked })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateSource}
                    disabled={!newSource.name || (newSource.source_type !== "manual_upload" && !newSource.connection_url)}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                  >
                    Connect Source
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Integration Cards */}
        {dataSources.length === 0 ? (
          <Card className="border-2 border-slate-200">
            <CardContent className="p-12 text-center">
              <Database className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Data Sources Connected</h2>
              <p className="text-slate-600 mb-6">
                Connect your business data sources to enable automatic analysis and real-time insights
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Source
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataSources.map((source, index) => {
              const Icon = sourceIcons[source.source_type];
              return (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${sourceColors[source.source_type]} rounded-xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge className={`${statusColors[source.status]} border`}>
                          {source.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{source.name}</CardTitle>
                      <p className="text-sm text-slate-600 capitalize">
                        {source.source_type.replace(/_/g, ' ')}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Sync:</span>
                          <span className="font-medium capitalize">{source.sync_frequency}</span>
                        </div>
                        {source.last_synced && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Last Sync:</span>
                            <span className="font-medium">
                              {new Date(source.last_synced).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-600">Auto-Analyze:</span>
                          <span className="font-medium">
                            {source.auto_analyze ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-slate-400" />
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => syncSourceMutation.mutate(source)}
                          disabled={syncSourceMutation.isPending}
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${syncSourceMutation.isPending ? 'animate-spin' : ''}`} />
                          Sync
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteSourceMutation.mutate(source.id)}
                          disabled={deleteSourceMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Popular Integrations Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-indigo-600" />
                Coming Soon: Advanced Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">CRM Platforms</h4>
                    <p className="text-sm text-slate-600">Salesforce, HubSpot, Pipedrive</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Link2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Support Tools</h4>
                    <p className="text-sm text-slate-600">Zendesk, Freshdesk, Intercom</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Cloud Storage</h4>
                    <p className="text-sm text-slate-600">Google Drive, Dropbox, OneDrive</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}