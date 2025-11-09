
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Upload, 
  TrendingUp, 
  MessageSquare, 
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      icon: BarChart3,
      title: "Smart Summarization",
      description: "Generate clear overviews of performance metrics and sentiment trends instantly"
    },
    {
      icon: MessageSquare,
      title: "Pattern Detection",
      description: "Detect key patterns and anomalies across your business data automatically"
    },
    {
      icon: TrendingUp,
      title: "Action Recommendations",
      description: "Get human-style suggestions to improve performance and customer satisfaction"
    },
    {
      icon: Zap,
      title: "Real-Time Insights",
      description: "Transform raw data into actionable insights in seconds, not days"
    }
  ];

  const stats = [
    { value: "10x", label: "Faster Analysis" },
    { value: "100%", label: "Automated Insights" },
    { value: "∞", label: "Data Sources" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-violet-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-indigo-200 shadow-sm mb-8">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-900">Powered by Claude 3.5 Sonnet</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                InsightGen.ai
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-4 font-light">
              Because your data deserves to tell a story.
            </p>
            
            <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform raw business data into actionable insights with advanced AI. Upload your sales reports, 
              customer feedback, or support chats — and get executive-ready analysis in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={createPageUrl("Upload")}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Start Analysis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("Reports")}>
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-xl border-2 border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                >
                  View Reports
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                What it does
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powered by advanced AI, InsightGen turns complex data into clear, actionable intelligence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                How it works
              </span>
            </h2>
            <p className="text-lg text-slate-600">Three simple steps to actionable insights</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Data",
                description: "Drop in your CSV files, JSON logs, or text documents. We support sales data, customer feedback, support chats, and more."
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our AI engine processes your data, detects patterns, analyzes sentiment, and identifies key trends and anomalies."
              },
              {
                step: "03",
                title: "Get Insights",
                description: "Receive executive-ready summaries, visualizations, and actionable recommendations — ready to present or implement."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-none shadow-lg bg-white">
                  <CardContent className="p-8">
                    <div className="text-6xl font-bold bg-gradient-to-r from-indigo-200 to-violet-200 bg-clip-text text-transparent mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                    <CheckCircle2 className="w-8 h-8 text-green-500 mt-6" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to transform your data?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Start generating insights in seconds. No credit card required.
            </p>
            <Link to={createPageUrl("Upload")}>
              <Button 
                size="lg"
                className="bg-white text-indigo-600 hover:bg-slate-100 px-8 py-6 text-lg rounded-xl shadow-xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
