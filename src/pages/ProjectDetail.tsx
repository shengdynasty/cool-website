import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Github, Code, Image, FileText } from "lucide-react";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Sample project data - in a real app this would come from a database
  const projects = [
    {
      id: "calculator",
      title: "Calculator",
      description: "A simple yet powerful calculator application built with React. Features basic arithmetic operations, memory functions, and a clean, intuitive interface.",
      fullDescription: "This calculator application demonstrates proficiency in React state management, component composition, and user interface design. Built with modern JavaScript ES6+ features and styled with Tailwind CSS for a responsive, mobile-first design.",
      technologies: ["React", "JavaScript", "Tailwind CSS", "Vite"],
      github: "https://github.com",
      live: "https://example.com",
      featured: true,
      codeSnippet: `function Calculator() {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const calculate = (firstOperand, secondOperand, operation) => {
    switch (operation) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };

  return (
    <div className="calculator">
      <div className="display">{display}</div>
      {/* Calculator buttons */}
    </div>
  );
}`,
      images: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300"
      ]
    },
    {
      id: "task-management-app",
      title: "Task Management App",
      description: "Collaborative task management application with real-time updates, file attachments, and team collaboration features.",
      fullDescription: "A comprehensive task management solution built with Next.js and TypeScript. Features real-time collaboration, drag-and-drop task organization, file attachments, and team member assignments.",
      technologies: ["Next.js", "TypeScript", "MongoDB", "Socket.io"],
      github: "https://github.com",
      live: "https://example.com",
      featured: true,
      codeSnippet: `const TaskList = ({ tasks, onUpdateTask }) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedTask) {
      onUpdateTask(draggedTask.id, { status });
      setDraggedTask(null);
    }
  };

  return (
    <div className="task-board">
      {['todo', 'in-progress', 'done'].map(status => (
        <div
          key={status}
          className="task-column"
          onDrop={(e) => handleDrop(e, status)}
          onDragOver={(e) => e.preventDefault()}
        >
          <h3>{status.replace('-', ' ').toUpperCase()}</h3>
          {tasks.filter(task => task.status === status).map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      ))}
    </div>
  );
};`,
      images: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300"
      ]
    },
    {
      id: "weather-dashboard",
      title: "Weather Dashboard",
      description: "Beautiful weather dashboard with location-based forecasts, interactive maps, and weather alerts using OpenWeather API.",
      fullDescription: "A modern weather application that provides real-time weather data, 7-day forecasts, and interactive weather maps. Built with React and integrated with the OpenWeather API for accurate, up-to-date weather information.",
      technologies: ["React", "Tailwind CSS", "OpenWeather API"],
      github: "https://github.com",
      live: "https://example.com",
      featured: false,
      codeSnippet: `const WeatherDashboard = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState('');

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(
        \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${API_KEY}&units=metric\`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  return (
    <div className="weather-dashboard">
      <SearchBar onSearch={fetchWeather} />
      {weather && (
        <CurrentWeather data={weather} />
      )}
      <ForecastChart data={forecast} />
    </div>
  );
};`,
      images: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300"
      ]
    },
    {
      id: "portfolio-website",
      title: "Portfolio Website",
      description: "Responsive portfolio website built with modern web technologies, featuring smooth animations and optimized performance.",
      fullDescription: "A personal portfolio website showcasing projects, skills, and experience. Built with React and Tailwind CSS, featuring smooth animations, responsive design, and optimized performance for fast loading times.",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      github: "https://github.com",
      live: "https://example.com",
      featured: false,
      codeSnippet: `const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navigation activeSection={activeSection} />
      <Hero />
      <About />
      <Projects />
      <Contact />
    </>
  );
};`,
      images: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300"
      ]
    },
    {
      id: "ai-chat-application",
      title: "AI Chat Application",
      description: "Real-time chat application with AI integration, supporting multiple users, message history, and smart responses.",
      fullDescription: "An intelligent chat application that combines real-time messaging with AI-powered responses. Features include user authentication, message history, typing indicators, and integration with OpenAI's GPT API for smart, contextual responses.",
      technologies: ["React", "Node.js", "OpenAI API", "WebSocket"],
      github: "https://github.com",
      live: "https://example.com",
      featured: true,
      codeSnippet: `const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('ws://localhost:3001');
    
    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('typing', (data) => {
      setIsTyping(data.isTyping);
    });

    return () => socketRef.current.disconnect();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    socketRef.current.emit('message', message);
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Get AI response
    const aiResponse = await getAIResponse(newMessage);
    const aiMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    };

    socketRef.current.emit('message', aiMessage);
    setMessages(prev => [...prev, aiMessage]);
  };

  return (
    <div className="chat-container">
      <MessageList messages={messages} />
      {isTyping && <TypingIndicator />}
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={sendMessage}
      />
    </div>
  );
};`,
      images: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300"
      ]
    },
    {
      id: "expense-tracker",
      title: "Expense Tracker",
      description: "Personal finance management tool with budget tracking, expense categorization, and financial insights visualization.",
      fullDescription: "A comprehensive expense tracking application that helps users manage their personal finances. Features include expense categorization, budget setting, financial goal tracking, and detailed analytics with interactive charts and reports.",
      technologies: ["Vue.js", "Express.js", "MongoDB", "Chart.js"],
      github: "https://github.com",
      live: "https://example.com",
      featured: false,
      codeSnippet: `const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState(0);

  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now(),
      ...expense,
      date: new Date()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getExpensesByCategory = () => {
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
  };

  const getRemainingBudget = () => {
    return budget - getTotalExpenses();
  };

  return (
    <div className="expense-tracker">
      <BudgetOverview
        budget={budget}
        totalExpenses={getTotalExpenses()}
        remaining={getRemainingBudget()}
      />
      <ExpenseForm onAddExpense={addExpense} />
      <ExpenseList expenses={expenses} />
      <ExpenseChart data={getExpensesByCategory()} />
    </div>
  );
};`,
      images: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300"
      ]
    }
  ];

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

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
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              View Code
            </Button>
            <Button size="sm" className="flex items-center gap-2">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.map((image, index) => (
                <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Screenshot {index + 1}</p>
                  </div>
                </div>
              ))}
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
                <li>• Responsive design optimized for all devices</li>
                <li>• Modern user interface with smooth animations</li>
                <li>• Clean, maintainable code structure</li>
                <li>• Performance optimized for fast loading</li>
                <li>• Cross-browser compatibility</li>
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
              Key code snippets demonstrating the implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-foreground">
                <code>{project.codeSnippet}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetail;