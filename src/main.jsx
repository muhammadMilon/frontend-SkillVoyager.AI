import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './providers/AuthProvider.jsx'

import {
  createBrowserRouter,
  RouterProvider,
  Link
} from "react-router-dom";

import MainLayout from './layouts/MainLayout.jsx'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import Dashboard from './components/Dashboard.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import Settings from './components/Settings.jsx'
import Contact from './components/Contact.jsx'
import Courses from './pages.jsx/Courses.jsx'
import CourseDetails from './pages.jsx/CourseDetails.jsx'
import ProgressDashboard from './pages/Dashboard/ProgressDashboard.jsx'
import TipsResources from './pages/TipsResources/TipsResources.jsx'
import OnboardingFlow from './pages/Onboarding/OnboardingFlow.jsx'
import RoadmapGenerator from './pages/Roadmaps/RoadmapGenerator.tsx'
import Leaderboard from './pages/Leaderboard/Leaderboard.jsx'
import QuizGenerator from './pages/Quiz/QuizGenerator.jsx'
import QuizSession from './pages/Quiz/QuizSession.jsx'
import QuizResult from './pages/Quiz/QuizResult.jsx'
import AIMentorPage from './pages/Mentor/AIMentorPage.jsx'
import ConceptualSessions from './pages/Sessions/ConceptualSessions.jsx'
import NewsPage from './pages/News/NewsPage.jsx'
import BookmarksPage from './pages/Bookmarks/BookmarksPage.jsx'
import HelpDeskPage from './pages/HelpDesk/HelpDeskPage.jsx'

import SkillGapAnalysis from './pages/SkillGap/SkillGapAnalysis.jsx'
import ForgotPassword from './components/ForgotPassword.jsx'
import TrendingPage from './pages/TrendingPage.jsx'
import Onboarding from './pages/Onboarding/Onboarding.jsx'
import { ToastContainer } from 'react-toastify'
import About from './pages/LandingPages/About.jsx'
import AllTransactions from './pages.jsx/AllTransactions.jsx'
import CoursePaymentSuccess from './pages.jsx/CoursePaymentSuccess.jsx'
import HelpCenter from './components/HelpCenter.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import TermsOfService from './components/TermsOfService.jsx'
import ContactSupport from './components/ContactSupport.jsx'
import ActivityTracker from './components/ActivityTracker.jsx'




import ActionableDashboard from './pages/Dashboard/ActionableDashboard.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <App />
      },
      {
        path: "/about",
        element: <About />,
      },
      { path: "/register", element: <Register></Register> },
      { path: "/login", element: <Login /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/contact", element: <Contact /> },
      { path: "/trending", element: <TrendingPage /> },

      // ✅ COURSES LIST
      {
        path: "/courses",
        element: <Courses />
      },
      {
        path: "/",
        element: <Courses />
      },
      {
        path: "/api/transactions",
        element: <AllTransactions />
      },
      // {
      //   path: "/api/topics",
      //   element: <AllTopicsPage />
      // },

      {
  path: "/course-payment-success",
  element: <CoursePaymentSuccess />
},
      


      // ✅ COURSE DETAILS (Private)
      // {
      //   path: "/courses/:id",
      //   element: <PrivateRoute><CourseDetails /></PrivateRoute>
      // },

      // // ✅ PAYMENT PAGE (Private)
      // {
      //   path: "/payment/:id",
      //   element: <PrivateRoute><PaymentPage /></PrivateRoute>
      // },

      {
        path: "/dashboard",
        element: <PrivateRoute><Dashboard /></PrivateRoute>
      },
      {
        path: "/actionable",
        element: <PrivateRoute><ActionableDashboard /></PrivateRoute>
      },
      {
        path: "/admin-dashboard",
        element: <PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>
      },
      {
        path: "settings",
        element: <PrivateRoute><Settings></Settings></PrivateRoute>
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />
      },
      { path: "/helpdesk", element: <HelpDeskPage /> },
      {
        path: "/trending",
        element: <TrendingPage />
      },

      {
        path: "/roadmap/generate",
        element: <RoadmapGenerator />
      },
      {
        path: "/quiz/generate",
        element: <PrivateRoute><QuizGenerator /></PrivateRoute>
      },
      {
        path: "/quiz/result",
        element: <PrivateRoute><QuizResult /></PrivateRoute>
      },
      {
        path: "/quiz/:quizId",
        element: <PrivateRoute><QuizSession /></PrivateRoute>
      },
      {
        path: "/skill-gap",
        element: <PrivateRoute><SkillGapAnalysis /></PrivateRoute>
      },
      {
        path: "/ai-mentor",
        element: <PrivateRoute><AIMentorPage /></PrivateRoute>
      },
      {
        path: "/progress",
        element: <PrivateRoute><ProgressDashboard /></PrivateRoute>
      },
      {
        path: "/leaderboard",
        element: <Leaderboard />
      },
      {
        path: "/tips-resources",
        element: <TipsResources />
      },
      {
        path: "/onboarding",
        element: <PrivateRoute><OnboardingFlow /></PrivateRoute>
      },
      {
        path: "/sessions",
        element: <PrivateRoute><ConceptualSessions /></PrivateRoute>
      },
      {
        path: "/announcements",
        element: <PrivateRoute><NewsPage /></PrivateRoute>
      },
      {
        path: "/bookmarks",
        element: <PrivateRoute><BookmarksPage /></PrivateRoute>
      },
      // {
      //   path: "/admin/messages",
      //   element: <PrivateRoute><AdminMessages /></PrivateRoute>
      // },
      {
        path: "/onboarding-old",
        element: <PrivateRoute><Onboarding /></PrivateRoute>
      },
      {
        path: "/settings",
        element: <PrivateRoute><Settings /></PrivateRoute>
      },
      {
        path: "*",
        element: (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-10 text-center">
            <h1 className="text-6xl font-black text-indigo-500 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-white mb-6">Voyage Interrupted!</h2>
            <p className="text-slate-400 mb-8 max-w-md">The sector you're looking for doesn't exist in our current coordinates.</p>
            <Link to="/dashboard" className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
              Return to Control Center
            </Link>
          </div>
        )
      }
    ]
  }
]);

import { ThemeProvider } from './providers/ThemeProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>

        <ActivityTracker />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
        />
        <RouterProvider router={router} />


      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)