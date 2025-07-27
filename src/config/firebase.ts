// Firebase SDK imports
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

// Firebase 설정 인터페이스
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// 환경변수에서 Firebase 설정 가져오기
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Firebase 설정 유효성 검증
const validateConfig = (config: FirebaseConfig): boolean => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  return requiredFields.every(field => config[field as keyof FirebaseConfig]);
};

// Firebase 앱 초기화
let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let performance: ReturnType<typeof getPerformance> | null = null;

try {
  if (!validateConfig(firebaseConfig)) {
    throw new Error('Firebase 설정이 완전하지 않습니다. 환경변수를 확인해주세요.');
  }
  
  app = initializeApp(firebaseConfig);
  
  // Analytics 초기화 (브라우저 환경에서만)
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
    performance = getPerformance(app);
    console.log('✅ Firebase Analytics & Performance 초기화 완료');
  }
  
} catch (error) {
  console.error('❌ Firebase 초기화 실패:', error);
}

// Firebase 인스턴스들 내보내기
export { app, analytics, performance };

// 설정 유효성 검사 함수 내보내기
export const isFirebaseConfigured = (): boolean => {
  return !!(app && analytics);
};

// 개발 환경에서 Firebase 설정 상태 로깅
if (import.meta.env.DEV) {
  console.log('🔧 Firebase 설정 상태:', {
    app: !!app,
    analytics: !!analytics,
    performance: !!performance,
    projectId: firebaseConfig.projectId || '설정되지 않음'
  });
}