import React from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import useSWR from 'swr';
import fetcher from '../lib/fetcher';
import StatCard from '../components/analytics/StatCard';
import WeeklyProgressChart from '../components/analytics/WeeklyProgressChart';
import GradeDistributionChart from '../components/analytics/GradeDistributionChart';

// Interface for the API response structure
interface StudyStatsResponse {
  success: boolean;
  message: string;
  stats: StudyStats;
}

// Interface for the stats data structure
interface StudyStats {
  totalStudied: number;
  dueForReview: number;
  newToday: number;
  reviewedToday: number;
  studyStreak: number;
  averageGrade: number;
  totalReviews: number;
  correctReviews: number;
  accuracy: number;
  gradeDistribution: {
    bad: number;
    hard: number;
    good: number;
    easy: number;
  };
  weeklyProgress: {
    date: string;
    reviews: number;
  }[];
}

const StatsPage: React.FC = () => {
  const { data: apiResponse, error, isLoading } = useSWR<StudyStatsResponse>(
    '/api/v1/study/stats',
    fetcher
  );

  const stats = apiResponse?.stats;

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading your study statistics...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !stats) {
    return (
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">Failed to load statistics</div>
            <div className="text-gray-600">Please try refreshing the page</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Study Analytics</h1>
          <p className="text-gray-600">Track your progress and see how you&apos;re improving over time</p>
        </div>

        {/* Key Metrics - Using StatCard components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Studied"
            value={stats.totalStudied}
            icon="📚"
            color="blue"
            subtitle="Cards completed"
          />
          <StatCard
            title="Due for Review"
            value={stats.dueForReview}
            icon="⏰"
            color="orange"
            subtitle="Ready to study"
          />
          <StatCard
            title="Study Streak"
            value={`${stats.studyStreak} days`}
            icon="🔥"
            color="green"
            subtitle="Keep it up!"
          />
          <StatCard
            title="Accuracy"
            value={`${stats.accuracy}%`}
            icon="🎯"
            color="purple"
            subtitle="Success rate"
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="New Today"
            value={stats.newToday}
            icon="✨"
            color="blue"
            subtitle="First time studied"
          />
          <StatCard
            title="Reviewed Today"
            value={stats.reviewedToday}
            icon="🔄"
            color="green"
            subtitle="Reviews completed"
          />
          <StatCard
            title="Average Grade"
            value={stats.averageGrade.toFixed(1)}
            icon="📊"
            color="purple"
            subtitle="Out of 4.0"
          />
          <StatCard
            title="Total Reviews"
            value={stats.totalReviews}
            icon="📈"
            color="yellow"
            subtitle="All time"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Progress Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Weekly Progress</h3>
            <WeeklyProgressChart data={stats.weeklyProgress.map(item => ({
              day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
              cardsStudied: item.reviews
            }))} />
          </div>

          {/* Grade Distribution Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Grade Distribution</h3>
            <GradeDistributionChart data={Object.entries(stats.gradeDistribution).map(([grade, count]) => ({
              grade,
              count,
              percentage: stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0,
              [grade]: count
            }))} />
          </div>
        </div>

        {/* Additional Insights Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Study Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-center">
              <span className="text-green-500 text-lg mr-2">🔥</span>
              <span>Keep up your {stats.studyStreak} day streak!</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 text-lg mr-2">📚</span>
              <span>You&apos;ve studied {stats.totalStudied} cards total</span>
            </div>
            <div className="flex items-center">
              <span className="text-orange-500 text-lg mr-2">⏰</span>
              <span>{stats.dueForReview} cards are due for review</span>
            </div>
            <div className="flex items-center">
              <span className="text-purple-500 text-lg mr-2">🎯</span>
              <span>Your accuracy rate is {stats.accuracy}%</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 text-lg mr-2">✨</span>
              <span>{stats.newToday} new cards studied today</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 text-lg mr-2">🔄</span>
              <span>{stats.reviewedToday} reviews completed today</span>
            </div>
            <div className="flex items-center">
              <span className="text-purple-500 text-lg mr-2">📊</span>
              <span>Average grade: {stats.averageGrade.toFixed(1)} out of 4.0</span>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-500 text-lg mr-2">📈</span>
              <span>{stats.correctReviews} out of {stats.totalReviews} reviews correct</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StatsPage;