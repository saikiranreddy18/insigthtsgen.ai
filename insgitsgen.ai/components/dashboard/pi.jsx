import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Sparkles, 
  Loader2,
  Zap,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
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

export default function PredictiveInsights({ analysis }) {
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateForecast = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const prompt = `You are an expert data scientist and business forecaster. Based on the following business analysis, generate predictive insights and forecasts.

CURRENT ANALYSIS:
Title: ${analysis.title}
Data Type: ${analysis.data_type}
Summary: ${analysis.summary}
Key Insights: ${JSON.stringify(analysis.key_insights, null, 2)}
Recommendations: ${JSON.stringify(analysis.recommendations, null, 2)}
Metrics: ${JSON.stringify(analysis.metrics, null, 2)}
Anomalies: ${analysis.anomalies?.join(", ") || "None"}

Generate a predictive analysis including:
1. Short-term forecast (next 1-3 months)
2. Medium-term forecast (3-6 months)
3. Long-term forecast (6-12 months)
4. Key risk factors that could impact predictions
5. Confidence levels for each prediction
6. Recommended actions to optimize future outcomes

Be specific, data-driven, and provide actionable predictions. Include both optimistic and realistic scenarios.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        model: "claude-3-5-sonnet-20241022",
        response_json_schema: {
          type: "object",
          properties: {
            short_term: {
              type: "object",
              properties: {
                timeframe: { type: "string" },
                prediction: { type: "string" },
                confidence: { type: "string", enum: ["high", "medium", "low"] },
                trend: { type: "string", enum: ["up", "down", "stable"] }
              }
            },
            medium_term: {
              type: "object",
              properties: {
                timeframe: { type: "string" },
                prediction: { type: "string" },
                confidence: { type: "string", enum: ["high", "medium", "low"] },
                trend: { type: "string", enum: ["up", "down", "stable"] }
              }
            },
            long_term: {
              type: "object",
              properties: {
                timeframe: { type: "string" },
                prediction: { type: "string" },
                confidence: { type: "string", enum: ["high", "medium", "low"] },
                trend: { type: "string", enum: ["up", "down", "stable"] }
              }
            },
            risk_factors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  factor: { type: "string" },
                  severity: { type: "string", enum: ["high", "medium", "low"] },
                  mitigation: { type: "string" }
                }
              }
            },
            optimization_actions: {
              type: "array",
              items: {
                type: "string"
              }
            },
            forecast_data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  period: { type: "string" },
                  value: { type: "number" },
                  confidence_low: { type: "number" },
                  confidence_high: { type: "number" }
                }
              }
            }
          }
        }
      });

      setForecast(result);
    } catch (err) {
      console.error("Error generating forecast:", err);
      setError("Failed to generate forecast. Please try again.");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (analysis && !forecast && !isLoading && !error) {
      generateForecast();
    }
  }, [analysis]);

  const confidenceColors = {
    high: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-orange-100 text-orange-800 border-orange-200"
  };

  const severityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-blue-100 text-blue-800 border-blue-200"
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "down":
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-blue-600" />;
    }
  };

  if (error) {
    return (
      <Card className="border-2 border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <p className="text-red-700">{error}</p>
          <Button onClick={generateForecast} className="mt-4" variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !forecast) {
    return (
      <Card className="border-2 border-indigo-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-indigo-600" />
            Predictive Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-slate-600">Generating AI-powered forecasts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Forecast Timeline */}
      <Card className="border-2 border-purple-200 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Zap className="w-6 h-6 text-purple-600" />
            Predictive Forecast
            <Badge className="ml-2 bg-purple-600 text-white">AI-Powered</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Short Term */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-indigo-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Short Term</p>
                  <p className="font-semibold text-slate-900">{forecast.short_term?.timeframe}</p>
                </div>
                {getTrendIcon(forecast.short_term?.trend)}
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed">{forecast.short_term?.prediction}</p>
              <Badge className={`${confidenceColors[forecast.short_term?.confidence]} border`}>
                {forecast.short_term?.confidence} confidence
              </Badge>
            </motion.div>

            {/* Medium Term */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-indigo-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Medium Term</p>
                  <p className="font-semibold text-slate-900">{forecast.medium_term?.timeframe}</p>
                </div>
                {getTrendIcon(forecast.medium_term?.trend)}
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed">{forecast.medium_term?.prediction}</p>
              <Badge className={`${confidenceColors[forecast.medium_term?.confidence]} border`}>
                {forecast.medium_term?.confidence} confidence
              </Badge>
            </motion.div>

            {/* Long Term */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-indigo-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Long Term</p>
                  <p className="font-semibold text-slate-900">{forecast.long_term?.timeframe}</p>
                </div>
                {getTrendIcon(forecast.long_term?.trend)}
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed">{forecast.long_term?.prediction}</p>
              <Badge className={`${confidenceColors[forecast.long_term?.confidence]} border`}>
                {forecast.long_term?.confidence} confidence
              </Badge>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Chart */}
      {forecast.forecast_data && forecast.forecast_data.length > 0 && (
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-indigo-600" />
              Forecast Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={forecast.forecast_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="confidence_low" 
                  stackId="1" 
                  stroke="#8b5cf6" 
                  fill="#c4b5fd" 
                  name="Low Confidence"
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stackId="2" 
                  stroke="#6366f1" 
                  fill="#a5b4fc" 
                  name="Predicted Value"
                />
                <Area 
                  type="monotone" 
                  dataKey="confidence_high" 
                  stackId="3" 
                  stroke="#8b5cf6" 
                  fill="#c4b5fd" 
                  name="High Confidence"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Risk Factors */}
      {forecast.risk_factors && forecast.risk_factors.length > 0 && (
        <Card className="border-2 border-amber-200 shadow-lg bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forecast.risk_factors.map((risk, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border-2 border-amber-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">{risk.factor}</h4>
                    <Badge className={`${severityColors[risk.severity]} border`}>
                      {risk.severity} risk
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    <span className="font-medium">Mitigation:</span> {risk.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Actions */}
      {forecast.optimization_actions && forecast.optimization_actions.length > 0 && (
        <Card className="border-2 border-green-200 shadow-lg bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-green-600" />
              Optimization Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {forecast.optimization_actions.map((action, index) => (
                <li key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-green-200">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-slate-700 flex-1">{action}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}