import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, ArrowRight, BarChart3, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SentimentTracking from "../components/dashboard/SentimentTracking";

export default function Reports() {
  const { data: analyses, isLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: () => base44.entities.Analysis.list('-created_date'),
    initialData: [],
  });

  const dataTypeColors = {
    sales: "bg-green-100 text-green-800 border-green-200",
    customer_feedback: "bg-blue-100 text-blue-800 border-blue-200",
    support_chats: "bg-purple-100 text-purple-800 border-purple-200",
    product_reviews: "bg-pink-100 text-pink-800 border-pink-200",
    mixed: "bg-indigo-100 text-indigo-800 border-indigo-200",
    other: "bg-slate-100 text-slate-800 border-slate-200"
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
                  Analysis Reports
                </span>
              </h1>
              <p className="text-lg text-slate-600">
                View your past analyses and insights
              </p>
            </div>
            <Link to={createPageUrl("Upload")}>
              <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                <Plus className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Sentiment Tracking Section */}
        {analyses.length > 0 && (
          <div className="mb-8">
            <SentimentTracking />
          </div>
        )}

        {/* Reports Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : analyses.length === 0 ? (
          <Card className="border-2 border-slate-200">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Reports Yet</h2>
              <p className="text-slate-600 mb-6">
                Create your first analysis to get started with AI-powered insights
              </p>
              <Link to={createPageUrl("Upload")}>
                <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Reports</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyses.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={createPageUrl("Dashboard") + `?id=${analysis.id}`}>
                    <Card className="h-full border-2 border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <BarChart3 className="w-6 h-6 text-white" />
                          </div>
                          <Badge className={`${dataTypeColors[analysis.data_type]} border`}>
                            {analysis.data_type?.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {analysis.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-slate-600 line-clamp-3 text-sm">
                            {analysis.summary || "Analysis in progress..."}
                          </p>
                          
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(analysis.created_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>

                          {analysis.key_insights && analysis.key_insights.length > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                {analysis.key_insights.length} Insights
                              </Badge>
                              {analysis.recommendations && analysis.recommendations.length > 0 && (
                                <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
                                  {analysis.recommendations.length} Actions
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                            <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                              View Report
                            </span>
                            <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}