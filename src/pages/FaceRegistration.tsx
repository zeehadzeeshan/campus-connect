import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle, RefreshCw, AlertCircle, XCircle } from 'lucide-react';
import * as faceapi from 'face-api.js';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const TOTAL_CAPTURES = 3;
const CAPTURE_INTERVAL = 1000;

const FaceRegistration = () => {
  const navigate = useNavigate();
  const { pendingStudentId, completeFaceRegistration, selectedRole } = useAuth();
  const [stage, setStage] = useState<'loading' | 'intro' | 'capturing' | 'processing' | 'success' | 'error' | 'insecure'>('loading');
  const [captureCount, setCaptureCount] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [showFlash, setShowFlash] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [embeddings, setEmbeddings] = useState<Float32Array[]>([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const instructions = [
    'Look straight at the camera',
    'Turn your head slightly left',
    'Turn your head slightly right',
  ];

  useEffect(() => {
    if (!pendingStudentId || selectedRole !== 'student') {
      navigate('/');
    }
  }, [pendingStudentId, selectedRole, navigate]);

  // Load Models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
        setStage('intro');
      } catch (error) {
        console.error("Model loading error:", error);
        setStage('error');
      }
    };
    loadModels();
  }, []);

  // WebCam Stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if ((stage === 'intro' || stage === 'capturing') && modelsLoaded) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Camera access is blocked because this site is not using a secure connection (HTTPS or localhost).");
        setStage('insecure');
        return;
      }

      navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(err => {
          console.error("Webcam error:", err);
          setStage('error');
        });
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stage, modelsLoaded]);

  const captureFace = async () => {
    if (!videoRef.current || !modelsLoaded) return;

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(true)
        .withFaceDescriptor();

      if (detection) {
        setEmbeddings(prev => [...prev, detection.descriptor]);
        setCaptureCount(prev => prev + 1);
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 200);
        return true;
      }
    } catch (error) {
      console.error("Capture error:", error);
    }
    return false;
  };

  // Tracking loop for visual feedback
  useEffect(() => {
    let active = true;
    const track = async () => {
      if (!videoRef.current || !canvasRef.current || !modelsLoaded || stage !== 'capturing') return;

      const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true);

      if (active && canvasRef.current && videoRef.current) {
        const displaySize = { width: videoRef.current.offsetWidth, height: videoRef.current.offsetHeight };
        faceapi.matchDimensions(canvasRef.current, displaySize);

        if (detection) {
          const resizedDetections = faceapi.resizeResults(detection, displaySize);
          canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        } else {
          canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }

      if (active) requestAnimationFrame(track);
    };

    if (stage === 'capturing') track();
    return () => { active = false; };
  }, [stage, modelsLoaded]);

  useEffect(() => {
    if (stage === 'capturing') {
      if (captureCount < TOTAL_CAPTURES) {
        setCurrentInstruction(instructions[captureCount]);
        const timer = setTimeout(captureFace, CAPTURE_INTERVAL);
        return () => clearTimeout(timer);
      } else {
        setStage('processing');
        handleFinalize();
      }
    }
  }, [stage, captureCount]);

  const handleFinalize = async () => {
    if (embeddings.length === 0 || !pendingStudentId) {
      setStage('error');
      return;
    }

    try {
      // Average the embeddings for a more robust descriptor
      const averageEmbedding = new Float32Array(128).fill(0);
      embeddings.forEach(embedding => {
        embedding.forEach((val, i) => averageEmbedding[i] += val);
      });
      averageEmbedding.forEach((val, i) => averageEmbedding[i] /= embeddings.length);

      const result = await completeFaceRegistration(pendingStudentId, Array.from(averageEmbedding));
      if (result.success) {
        setStage('success');
      } else {
        setStage('error');
      }
    } catch (error) {
      console.error("Finalization error:", error);
      setStage('error');
    }
  };

  const startCapture = () => {
    setCaptureCount(0);
    setEmbeddings([]);
    setStage('capturing');
  };

  const handleComplete = () => {
    navigate('/student');
  };

  const handleRetry = () => {
    setCaptureCount(0);
    setEmbeddings([]);
    setStage('intro');
  };

  if (!pendingStudentId) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Face Registration</CardTitle>
            <CardDescription>
              {stage === 'loading' && 'Loading AI Models...'}
              {stage === 'intro' && 'Position your face in the camera frame to register'}
              {stage === 'capturing' && 'Hold still and follow the instructions'}
              {stage === 'processing' && 'Processing your face data...'}
              {stage === 'success' && 'Face registration complete!'}
              {stage === 'error' && 'Registration failed. Please try again.'}
              {stage === 'insecure' && 'Camera access blocked by browser safety.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden border-2 border-primary/20">
              {stage === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading AI Models...</p>
                </div>
              )}

              {(stage === 'intro' || stage === 'capturing' || stage === 'processing') && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                  />
                  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
                </>
              )}

              {(stage === 'capturing' || stage === 'processing') && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-64 border-4 border-primary/50 rounded-[50%] animate-pulse" />
                  </div>
                  {showFlash && (
                    <div className="absolute inset-0 bg-white/50 animate-fade-in" />
                  )}
                </div>
              )}

              {stage === 'success' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-center animate-slide-up">
                  <CheckCircle className="w-20 h-20 text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground">Registration Successful</p>
                </div>
              )}

              {stage === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-center animate-slide-up p-4">
                  <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground">Camera Error</p>
                  <p className="text-sm text-muted-foreground mt-2">Could not access webcam. Please check permissions.</p>
                </div>
              )}

              {stage === 'insecure' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 text-center animate-slide-up p-6">
                  <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground">Security Block</p>
                  <div className="text-sm text-muted-foreground mt-4 space-y-3 text-left">
                    <p>Browsers only allow camera access on <b>secure</b> connections.</p>
                    <p><b>How to fix:</b></p>
                    <ul className="list-disc pl-5">
                      <li>Use <b>http://localhost:8081</b> instead of your IP address.</li>
                      <li>Or, use <b>HTTPS</b> if you are accessing from another device.</li>
                    </ul>
                  </div>
                  <Button variant="outline" className="mt-6" onClick={() => window.location.href = window.location.href.replace(window.location.hostname, 'localhost')}>
                    Switch to Localhost
                  </Button>
                </div>
              )}
            </div>

            {stage === 'capturing' && (
              <div className="text-center space-y-3 animate-fade-in">
                <p className="text-lg font-medium text-foreground">{currentInstruction}</p>
                <Progress value={(captureCount / TOTAL_CAPTURES) * 100} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Capture {captureCount} of {TOTAL_CAPTURES}
                </p>
              </div>
            )}

            {stage === 'processing' && (
              <div className="text-center space-y-3 animate-fade-in">
                <RefreshCw className="w-8 h-8 text-primary mx-auto animate-spin" />
                <p className="text-muted-foreground">Analyzing face data and creating embeddings...</p>
              </div>
            )}

            <div className="flex gap-3">
              {stage === 'intro' && (
                <Button onClick={startCapture} className="w-full" size="lg" disabled={!modelsLoaded}>
                  <Camera className="w-5 h-5 mr-2" />
                  Start Face Scan
                </Button>
              )}

              {stage === 'success' && (
                <Button onClick={handleComplete} className="w-full" size="lg">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Continue to Dashboard
                </Button>
              )}

              {stage === 'error' && (
                <Button onClick={handleRetry} variant="outline" className="w-full" size="lg">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </Button>
              )}
            </div>

            {stage === 'intro' && (
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">Tips for best results:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ensure good lighting on your face</li>
                  <li>• Remove glasses if possible</li>
                  <li>• Keep a neutral expression initially</li>
                  <li>• Follow the on-screen instructions</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FaceRegistration;
