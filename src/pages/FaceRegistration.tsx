import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const TOTAL_CAPTURES = 5;
const CAPTURE_INTERVAL = 1500;

const FaceRegistration = () => {
  const navigate = useNavigate();
  const { pendingStudentId, completeFaceRegistration, selectedRole } = useAuth();
  const [stage, setStage] = useState<'intro' | 'capturing' | 'processing' | 'success' | 'error'>('intro');
  const [captureCount, setCaptureCount] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [showFlash, setShowFlash] = useState(false);

  const instructions = [
    'Look straight at the camera',
    'Turn your head slightly left',
    'Turn your head slightly right',
    'Tilt your head up slightly',
    'Smile naturally',
  ];

  useEffect(() => {
    if (!pendingStudentId || selectedRole !== 'student') {
      navigate('/');
    }
  }, [pendingStudentId, selectedRole, navigate]);

  const simulateCapture = useCallback(() => {
    if (captureCount < TOTAL_CAPTURES) {
      setCurrentInstruction(instructions[captureCount]);
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 200);
      
      setTimeout(() => {
        setCaptureCount(prev => prev + 1);
      }, CAPTURE_INTERVAL);
    }
  }, [captureCount, instructions]);

  useEffect(() => {
    if (stage === 'capturing' && captureCount < TOTAL_CAPTURES) {
      const timer = setTimeout(simulateCapture, 500);
      return () => clearTimeout(timer);
    } else if (stage === 'capturing' && captureCount >= TOTAL_CAPTURES) {
      setStage('processing');
      // Simulate processing
      setTimeout(() => {
        setStage('success');
      }, 2000);
    }
  }, [stage, captureCount, simulateCapture]);

  const startCapture = () => {
    setCaptureCount(0);
    setStage('capturing');
  };

  const handleComplete = () => {
    if (pendingStudentId) {
      completeFaceRegistration(pendingStudentId);
      navigate('/student');
    }
  };

  const handleRetry = () => {
    setCaptureCount(0);
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
              {stage === 'intro' && 'Position your face in the camera frame to register'}
              {stage === 'capturing' && 'Hold still and follow the instructions'}
              {stage === 'processing' && 'Processing your face data...'}
              {stage === 'success' && 'Face registration complete!'}
              {stage === 'error' && 'Registration failed. Please try again.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Camera Preview Area */}
            <div className="relative aspect-[4/3] bg-foreground/5 rounded-lg overflow-hidden border-2 border-dashed border-border">
              {/* Simulated camera feed */}
              <div className="absolute inset-0 flex items-center justify-center">
                {stage === 'intro' && (
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Camera preview will appear here</p>
                  </div>
                )}
                
                {(stage === 'capturing' || stage === 'processing') && (
                  <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 to-foreground/20">
                    {/* Face outline guide */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-64 border-4 border-primary/50 rounded-[50%] animate-pulse" />
                    </div>
                    
                    {/* Flash effect */}
                    {showFlash && (
                      <div className="absolute inset-0 bg-primary/30 animate-fade-in" />
                    )}
                  </div>
                )}

                {stage === 'success' && (
                  <div className="text-center animate-slide-up">
                    <CheckCircle className="w-20 h-20 text-primary mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground">Registration Successful</p>
                  </div>
                )}

                {stage === 'error' && (
                  <div className="text-center animate-slide-up">
                    <AlertCircle className="w-20 h-20 text-destructive mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground">Registration Failed</p>
                  </div>
                )}
              </div>

              {/* Capture indicators */}
              {stage === 'capturing' && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {Array.from({ length: TOTAL_CAPTURES }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i < captureCount 
                          ? 'bg-primary' 
                          : i === captureCount 
                            ? 'bg-primary/50 animate-pulse' 
                            : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Instructions */}
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

            {/* Action Buttons */}
            <div className="flex gap-3">
              {stage === 'intro' && (
                <Button onClick={startCapture} className="w-full" size="lg">
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

            {/* Tips */}
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
