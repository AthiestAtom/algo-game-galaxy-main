import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Recycle, Camera, Globe, ArrowDown, Leaf, Sparkles, Calendar, MapPin, DollarSign, Clock } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import ClassificationResult, { type FabricResult } from "@/components/ClassificationResult";
import AnalyzingState from "@/components/AnalyzingState";
import VideoBackground from "@/components/VideoBackground";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FabricResult | null>(null);
  
  // Blog content state
  const [selectedBlogPost, setSelectedBlogPost] = useState<string | null>(null);
  
  // New states for functional features
  const [fabricQuantities, setFabricQuantities] = useState<{[key: string]: number}>({});
  const [pickupForm, setPickupForm] = useState({
    address: '',
    date: '',
    time: '',
    amount: '',
    instructions: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [bids, setBids] = useState<{[key: string]: number}>({});
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  
  // Materials data with detailed information
  const materialsData = [
    { 
      name: 'Cotton', 
      icon: '🌿',
      description: 'Natural, breathable, biodegradable',
      recyclingMethod: 'Composting & Textile Recycling',
      confidence: 0.92,
      tips: ['Cut into small pieces', 'Remove non-biodegradable attachments', 'Mix with organic materials'],
      color: 'bg-green-100 text-green-800'
    },
    { 
      name: 'Polyester', 
      icon: '🔬',
      description: 'Synthetic, durable, quick-drying',
      recyclingMethod: 'Mechanical Recycling',
      confidence: 0.88,
      tips: ['Clean thoroughly', 'Separate from natural fibers', 'Take to specialized facilities'],
      color: 'bg-blue-100 text-blue-800'
    },
    { 
      name: 'Wool', 
      icon: '🐑',
      description: 'Natural, warm, renewable',
      recyclingMethod: 'Donation & Upcycling',
      confidence: 0.85,
      tips: ['Hand wash when possible', 'Store in cool dry place', 'Repurpose into crafts'],
      color: 'bg-purple-100 text-purple-800'
    },
    { 
      name: 'Silk', 
      icon: '🦋',
      description: 'Natural, luxurious, biodegradable',
      recyclingMethod: 'Specialized Textile Recycling',
      confidence: 0.90,
      tips: ['Handle gently', 'Avoid harsh chemicals', 'Consider resale value'],
      color: 'bg-pink-100 text-pink-800'
    },
    { 
      name: 'Denim', 
      icon: '👖',
      description: 'Durable cotton twill, versatile',
      recyclingMethod: 'Textile Recycling & Upcycling',
      confidence: 0.94,
      tips: ['Remove hardware', 'Wash inside out', 'Consider patching and repairing'],
      color: 'bg-indigo-100 text-indigo-800'
    }
  ];

  const handleImageUpload = useCallback((file: File) => {
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleImageClear = useCallback(() => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResult(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) {
      toast.error("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      // Create FormData to send the image file
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Call backend API
      const apiUrl = 'https://fabric-classifier-api.onrender.com/api/classify-fabric';
      
      console.log('Sending request to:', apiUrl);
      console.log('Selected file:', selectedFile);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);

      setResult(data);
      toast.success("Fabric classified successfully!");
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Failed to analyze fabric. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFile]);

  const handleTryNow = useCallback(() => {
    const classificationSection = document.getElementById('classification-section');
    if (classificationSection) {
      classificationSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll to bottom of page
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="text-center z-10 px-4">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-full mb-6 shadow-lg">
                <Recycle className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Fabric Recycling AI
            </h1>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto drop-shadow">
              Transform your old textiles into sustainable solutions with AI-powered fabric classification
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleTryNow}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transform transition hover:scale-105"
              >
                Try it Now
                <ArrowDown className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/20 hover:bg-white/30 text-white border-white px-8 py-3 rounded-lg font-semibold shadow-lg backdrop-blur-sm"
              >
                <Camera className="mr-2 w-5 h-5" />
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Classification Section */}
        <section id="classification-section" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                AI Fabric Classification
              </h2>
              <p className="text-lg text-white mb-8 max-w-2xl mx-auto drop-shadow">
                Upload an image of your fabric and let our AI identify the material and suggest recycling methods
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
              <ImageUploader
                selectedImage={selectedImage}
                onImageUpload={handleImageUpload}
                onImageClear={handleImageClear}
              />
              
              <div className="text-center mt-6">
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isAnalyzing}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Identify Material
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isAnalyzing && <AnalyzingState />}
            {result && <ClassificationResult result={result} />}
          </div>
        </section>

        {/* Materials Database Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                Materials Database
              </h2>
              <p className="text-lg text-white mb-8 max-w-2xl mx-auto drop-shadow">
                Common fabric types and their recycling methods
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materialsData.map((material, index) => (
                <div key={index} className={`${material.color} rounded-xl p-6 shadow-lg transform transition hover:scale-105`}>
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-3">{material.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold">{material.name}</h3>
                      <div className="text-sm opacity-75">Confidence: {(material.confidence * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                  <p className="text-sm mb-4">{material.description}</p>
                  <div className="text-sm font-semibold mb-3">
                    <span className="inline-block bg-white/20 px-2 py-1 rounded">
                      {material.recyclingMethod}
                    </span>
                  </div>
                  <div className="text-xs">
                    <strong className="block mb-2">Tips:</strong>
                    <ul className="list-disc list-inside space-y-1">
                      {material.tips.map((tip, tipIndex) => (
                        <li key={tipIndex}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                Recycling Insights
              </h2>
              <p className="text-lg text-white mb-8 max-w-2xl mx-auto drop-shadow">
                Latest tips and trends in sustainable textile recycling
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <Leaf className="w-8 h-8 text-emerald-400 mr-3" />
                  <h3 className="text-xl font-bold text-white">Sustainable Practices</h3>
                </div>
                <p className="text-white/80 mb-4">
                  Learn about eco-friendly textile disposal methods and how to minimize environmental impact through proper recycling techniques.
                </p>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Read More
                </Button>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <Globe className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-xl font-bold text-white">Global Impact</h3>
                </div>
                <p className="text-white/80 mb-4">
                  Discover how textile recycling worldwide is reducing waste and creating sustainable fashion ecosystems for future generations.
                </p>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Explore Data
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
