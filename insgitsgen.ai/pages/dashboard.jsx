
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  BarChart3,
  FileText,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import ChatAssistant from "../components/dashboard/ChatAssistant";
import ExportPresentation from "../components/dashboard/ExportPresentation";
import PredictiveInsights from "../components/dashboard/PredictiveInsights";

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

export default function Dashboard() {
  const urlParams = new URLSearchParams(window.location.search);
  const analysisId = urlParams.get('id');
  const [showPredictions, setShowPredictions] = React.useState(false);

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['analysis', analysisId],
    queryFn: async () => {
      if (!analysisId) return null;
      const analyses = await base44.entities.Analysis.filter({ id: analysisId });
      return analyses[0] || null;
    },
    enabled: !!analysisId,
    refetchInterval: (data) => {
      return data?.status === "processing" ? 2000 : false;
    }
  });

  if (!analysisId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Analysis Selected</h2>
            <p className="text-slate-600">Please select an analysis from the Reports page</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (analysis?.status === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Analyzing Your Data</h2>
            <p className="text-slate-600">Our AI is processing your data and generating insights...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const impactColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-blue-100 text-blue-800 border-blue-200"
  };

  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-blue-500"
  };

  // Prepare chart data
  const insightChartData = analysis?.key_insights?.map(insight => ({
    name: insight.title.substring(0, 20) + '...',
    impact: insight.impact === 'high' ? 3 : insight.impact === 'medium' ? 2 : 1
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {analysis?.title}
              </h1>
              <p className="text-slate-600 flex items-center gap-2 mt-2">
                <BarChart3 className="w-4 h-4" />
                {analysis?.data_type?.replace(/_/g, ' ').toUpperCase()} • 
                Generated {new Date(analysis?.created_date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPredictions(!showPredictions)}
                className="border-2 border-purple-300 hover:bg-purple-50"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {showPredictions ? 'Hide' : 'Show'} Predictions
              </Button>
              <ExportPresentation analysis={analysis} />
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2">
                Completed
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Predictive Insights Section */}
        {showPredictions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <PredictiveInsights analysis={analysis} />
          </motion.div>
        )}

        {/* Two Column Layout: Main Content + Chat */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Executive Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-2 border-indigo-200 shadow-lg bg-gradient-to-br from-indigo-50 to-violet-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <FileText className="w-6 h-6 text-indigo-600" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-slate-700 leading-relaxed">{analysis?.summary}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Key Insights with Explainability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                Key Insights
                <Badge variant="outline" className="ml-2 bg-indigo-50 text-indigo-700 border-indigo-200">
                  AI-Powered
                </Badge>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {analysis?.key_insights?.map((insight, index) => (
                  <Card key={index} className="border-2 border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <Badge className={`${impactColors[insight.impact]} border`}>
                          {insight.impact} impact
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-3">{insight.description}</p>
                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700">
                          <Info className="w-4 h-4" />
                          Why this matters
                          <ChevronDown className="w-3 h-3" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 p-3 bg-indigo-50 rounded-lg text-sm text-slate-700">
                          This insight was identified by analyzing patterns in your data. The {insight.impact} impact rating 
                          indicates this finding could significantly affect your business performance and should be prioritized 
                          in your strategic planning.
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Visualizations */}
            {insightChartData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-2 border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-indigo-600" />
                      Insights Impact Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={insightChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="impact" fill="#6366f1" name="Impact Level" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Anomalies */}
            {analysis?.anomalies && analysis.anomalies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                  Detected Anomalies
                </h2>
                <Card className="border-2 border-amber-200 shadow-lg bg-amber-50">
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {analysis.anomalies.map((anomaly, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{anomaly}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Recommendations with Explainability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-indigo-600" />
                Actionable Recommendations
              </h2>
              <div className="space-y-4">
                {analysis?.recommendations?.map((rec, index) => (
                  <Card key={index} className="border-2 border-slate-200 hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-2 h-full ${priorityColors[rec.priority]} rounded-full`} />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-bold text-slate-900">{rec.action}</h3>
                            <Badge className={`${impactColors[rec.priority]} border`}>
                              {rec.priority} priority
                            </Badge>
                          </div>
                          <p className="text-slate-600 mb-3">
                            <span className="font-medium">Expected Impact:</span> {rec.expected_impact}
                          </p>
                          <Collapsible>
                            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700">
                              <Info className="w-4 h-4" />
                              View reasoning
                              <ChevronDown className="w-3 h-3" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-3 p-4 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-200">
                              <p className="font-medium mb-2">AI Analysis:</p>
                              This recommendation was generated by analyzing correlations in your data, comparing against 
                              industry benchmarks, and identifying optimization opportunities. The {rec.priority} priority 
                              rating suggests implementing this action could yield significant improvements in the identified areas.
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Key Metrics */}
            {analysis?.metrics && Object.keys(analysis.metrics).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                  Key Metrics
                </h2>
                <Card className="border-2 border-slate-200 shadow-lg">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {Object.entries(analysis.metrics).map(([key, value], index) => (
                        <div key={index} className="text-center">
                          <p className="text-sm text-slate-600 mb-2">
                            {key.replace(/_/g, ' ').toUpperCase()}
                          </p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Source Files */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Source Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis?.file_urls?.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        File {index + 1}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Chat Assistant - Right 1/3 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-6">
              <ChatAssistant analysis={analysis} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
