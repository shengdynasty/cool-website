import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Github, Code, Image, FileText } from "lucide-react";
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';

const ExpenseTrackerDetail = () => {
  const navigate = useNavigate();
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, []);

  const project = {
    title: "Expense Tracker",
    description: "A comprehensive expense tracking application with budget management and analytics",
    fullDescription: "Smart Expense Tracker is a financial management application designed to help users track their spending and manage budgets effectively. It features expense categorization, budget planning, visual analytics with charts and graphs, recurring expense tracking, and detailed financial reports. The application provides insights into spending patterns and helps users make informed financial decisions with an intuitive and user-friendly interface.",
    technologies: ["React", "JavaScript", "Chart.js", "CSS"],
    github: "https://github.com/shengdynasty",
    live: "https://github.com/shengdynasty",
    codeSnippet: `import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpenseChart = ({ expenses }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const data = {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          label: 'Expenses by Category',
          data: Object.values(categoryTotals),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    setChartData(data);
  }, [expenses]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Expense Breakdown',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      }
    }
  };

  return (
    <div className="expense-chart">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ExpenseChart;`
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={() => navigate("/")} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => window.open(project.github, "_blank")}
            >
              <Github className="w-4 h-4" />
              View Code
            </Button>
            <Button 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => window.open(project.live, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </Button>
          </div>
        </div>

        {/* Project Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{project.title}</h1>
          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
            {project.fullDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Project Images */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Project Screenshots
            </CardTitle>
            <CardDescription>
              Visual showcase of the {project.title} application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="w-full max-w-2xl aspect-video bg-muted rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Expense Tracker Dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Project Overview
            </CardTitle>
            <CardDescription>
              Detailed information about the project features and implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-foreground leading-relaxed mb-4">
                {project.fullDescription}
              </p>
              <h3 className="text-lg font-semibold text-foreground mb-3">Key Features:</h3>
              <ul className="text-muted-foreground space-y-1 mb-6">
                <li>• Expense categorization and tagging</li>
                <li>• Budget planning and monitoring</li>
                <li>• Visual analytics with interactive charts</li>
                <li>• Recurring expense tracking</li>
                <li>• Detailed financial reports and insights</li>
                <li>• Export data to CSV/PDF formats</li>
              </ul>
              <h3 className="text-lg font-semibold text-foreground mb-3">Technologies Used:</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="px-3 py-1">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Showcase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Code Showcase
            </CardTitle>
            <CardDescription>
              Key code snippets demonstrating the expense analytics implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="vscode-theme rounded-lg overflow-hidden">
              <div className="bg-[#1e1e1e] px-4 py-2 text-white text-sm flex items-center gap-2 border-b border-[#2d2d30]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28ca42]"></div>
                </div>
                <span className="ml-4 text-gray-300">ExpenseChart.jsx</span>
              </div>
              <div className="bg-[#1e1e1e] p-4 overflow-x-auto">
                <pre className="text-sm leading-relaxed">
                  <code 
                    ref={codeRef}
                    className="language-jsx"
                  >
                    {project.codeSnippet}
                  </code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseTrackerDetail;