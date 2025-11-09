import React, { useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, AlertCircle, Sparkles, Loader2, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function UploadPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [dataType, setDataType] = useState("mixed");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
    setError(null);
  }, []);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    setError(null);
  };

  const removeFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Please enter a title for your analysis");
      return;
    }

    if (files.length === 0) {
      setError("Please upload at least one file");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload files
      const uploadPromises = files.map(file => base44.integrations.Core.UploadFile({ file }));
      const uploadResults = await Promise.all(uploadPromises);
      const fileUrls = uploadResults.map(result => result.file_url);

      // Create analysis record
      const analysis = await base44.entities.Analysis.create({
        title,
        data_type: dataType,
        file_urls: fileUrls,
        status: "processing"
      });

      // Process data with AI
      const fileContents = await Promise.all(
        fileUrls.map(url => fetch(url).then(res => res.text()))
      );

      const combinedData = fileContents.join("\n\n---\n\n");

      const prompt = `You are an expert business analyst powered by Claude 3.5. Analyze the following business data and provide comprehensive insights.

DATA:
${combinedData.substring(0, 50000)}

Provide your analysis in the following structure:
1. Executive Summary (2-3 sentences)
2. Key Insights (3-5 bullet points with impact assessment)
3. Detected Patterns & Anomalies
4. Sentiment Analysis (if applicable)
5. Actionable Recommendations (3-5 items with priority and expected impact)
6. Key Metrics (extract any numerical data points)

Be specific, data-driven, and actionable. Focus on business impact.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        model: "claude-3-5-sonnet-20241022",
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_insights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  impact: { type: "string", enum: ["high", "medium", "low"] }
                }
              }
            },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  priority: { type: "string", enum: ["high", "medium", "low"] },
                  expected_impact: { type: "string" }
                }
              }
            },
            anomalies: {
              type: "array",
              items: { type: "string" }
            },
            metrics: {
              type: "object",
              additionalProperties: true
            },
            sentiment_score: { type: "number" }
          }
        }
      });

      // Update analysis with results
      await base44.entities.Analysis.update(analysis.id, {
        ...result,
        status: "completed"
      });

      // Navigate to dashboard
      navigate(createPageUrl("Dashboard") + `?id=${analysis.id}`);
    } catch (err) {
      console.error("Error processing analysis:", err);
      setError("Failed to process your data. Please try again.");
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              New Analysis
            </span>
          </h1>
          <p className="text-lg text-slate-600">
            Upload your business data and let AI generate actionable insights
          </p>
        </motion.div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Analysis Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Analysis Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Q4 2024 Sales Performance Review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg"
                  disabled={uploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataType">Data Type</Label>
                <Select value={dataType} onValueChange={setDataType} disabled={uploading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Data</SelectItem>
                    <SelectItem value="customer_feedback">Customer Feedback</SelectItem>
                    <SelectItem value="support_chats">Support Chats</SelectItem>
                    <SelectItem value="product_reviews">Product Reviews</SelectItem>
                    <SelectItem value="mixed">Mixed Data</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                Upload Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 transition-all ${
                  dragActive 
                    ? "border-indigo-400 bg-indigo-50" 
                    : "border-slate-300 hover:border-indigo-300 bg-slate-50"
                }`}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                  accept=".csv,.json,.txt,.pdf"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      <Upload className="w-8 h-8 text-white" />
