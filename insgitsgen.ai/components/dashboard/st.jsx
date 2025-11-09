import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, Meh, Frown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { motion } from "framer-motion";

export default function SentimentTracking() {
  const { data: analyses, isLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: () => base44.entities.Analysis.list('-created_date', 50),
    initialData: [],
  });

  // Filter analyses with sentiment scores and prepare chart data
  const sentimentData = analyses
    .filter(a => a.sentiment_score !== null && a.sentiment_score !== undefined)
    .slice(0, 10)
    .reverse()
    .map(a => ({
      date: new Date(a.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: a.sentiment_score,
      title: a.title.substring(0, 20) + '...'
    }));

  if (isLoading || sentimentData.length === 0) {
    return null;
  }

  // Calculate sentiment statistics
  const avgSentiment = sentimentData.reduce((sum, d) => sum + d.score, 0) / sentimentData.length;
  const latestSentiment = sentimentData[sentimentData.length - 1]?.score || 0;
  const previousSentiment = sentimentData[sentimentData.length - 2]?.score || latestSentiment;
  const sentimentChange = latestSentiment - previousSentiment;

  const getSentimentIcon = (score) => {
    if (score >= 0.6) return <Smile className="w-6 h-6 text-green-600" />;
    if (score >= 0.4) return <Meh className="w-6 h-6 text-yellow-600" />;
    return <Frown className="w-6 h-6 text-red-600" />;
  };

  const getSentimentColor = (score) => {
    if (score >= 0.6) return "text-green-600";
    if (score >= 0.4) return "text-yellow-600";
    return "text-red-600";
  };

  const getSentimentLabel = (score) => {
    if (score >= 0.7) return "Very Positive";
    if (score >= 0.6) return "Positive";
    if (score >= 0.5) return "Somewhat Positive";
    if (score >= 0.4) return "Neutral";
    if (score >= 0.3) return "Somewhat Negative";
    return "Negative";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Smile className="w-6 h-6 text-indigo-600" />
          Sentiment Over Time
        </h2>
        <Badge className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white">
          AI-Tracked
        </Badge>
      </div>

      {/* Sentiment Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 border-slate-200 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Latest Sentiment</p>
              {getSentimentIcon(latestSentiment)}
            </div>
            <p className={`text-3xl font-bold ${getSentimentColor(latestSentiment)}`}>
              {(latestSentiment * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {getSentimentLabel(latestSentiment)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-200 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Average Sentiment</p>
              {getSentimentIcon(avgSentiment)}
            </div>
            <p className={`text-3xl font-bold ${getSentimentColor(avgSentiment)}`}>
              {(avgSentiment * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Last {sentimentData.length} analyses
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-200 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Trend</p>
              {sentimentChange > 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : sentimentChange < 0 ? (
                <TrendingDown className="w-6 h-6 text-red-600" />
              ) : (
                <Minus className="w-6 h-6 text-slate-600" />
              )}
            </div>
            <p className={`text-3xl font-bold ${
              sentimentChange > 0 ? 'text-green-600' : 
              sentimentChange < 0 ? 'text-red-600' : 
              'text-slate-600'
            }`}>
              {sentimentChange > 0 ? '+' : ''}{(sentimentChange * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {sentimentChange > 0 ? 'Improving' : sentimentChange < 0 ? 'Declining' : 'Stable'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Chart */}
      <Card className="border-2 border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle>Sentiment Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sentimentData}>
              <defs>
                <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
              <Tooltip 
                formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Sentiment']}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload;
                  return item?.title || label;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#6366f1" 
                fill="url(#sentimentGradient)" 
                strokeWidth={2}
                name="Sentiment Score"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50">
        <CardHeader>
          <CardTitle className="text-lg">Sentiment Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-700">
            {avgSentiment >= 0.6 && (
              <li className="flex items-start gap-2">
                <Smile className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Overall sentiment is <strong>positive</strong>. Customer satisfaction appears strong.</span>
              </li>
            )}
            {avgSentiment < 0.5 && (
              <li className="flex items-start gap-2">
                <Frown className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>Overall sentiment is <strong>concerning</strong>. Consider reviewing customer feedback and addressing pain points.</span>
              </li>
            )}
            {sentimentChange > 0.05 && (
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Sentiment is <strong>improving</strong> — recent changes are having a positive impact.</span>
              </li>
            )}
            {sentimentChange < -0.05 && (
              <li className="flex items-start gap-2">
                <TrendingDown className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>Sentiment is <strong>declining</strong> — investigate recent changes or issues affecting customer perception.</span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 flex-shrink-0" />
              <span>Tracking sentiment across <strong>{sentimentData.length} recent analyses</strong> to identify trends and patterns.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}