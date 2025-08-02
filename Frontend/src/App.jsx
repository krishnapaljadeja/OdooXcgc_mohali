import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import ErrorBoundary from "./components/ui/error-boundary";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Landing from "./pages/Landing";
import LeaderBoard from "./pages/LeaderBoard";
import Analytics from "./pages/Analytics";
import FlaggedIssues from "./pages/FlaggedIssues";
import ReportIssue from "./components/ReportIssue";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import StorePage from "./pages/StorePage";
import Analytics2 from "./pages/Analytics2";
import IssuesMap from "./components/IssuesMap";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Navbar />
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/flagged-issues" element={<FlaggedIssues />} />
            <Route path="/report-issue" element={<ReportIssue />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/store-cart" element={<StorePage />} />
            <Route path="/analytics2" element={<Analytics2 />} />
            <Route path="/map" element={<IssuesMap />} />
          </Routes>
        </div>
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={4000}
        />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
