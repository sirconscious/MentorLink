import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePage } from '@inertiajs/react'; 
import { AlertDialogDemo } from "@/components/AlertDialogDemo"
import { AlertCircle, Github } from "lucide-react"

import {
  Star,
  Trophy,
  Download,
  Upload,
  BookOpen,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import DashboardLayout from './Layouts/DashboardLayout';
export default function Stats({ user }) {
  // Calculate average rating 
  console.log(user)
  const averageRating = user.received_ratings?.length
    ? user.received_ratings.reduce((acc, rating) => acc + rating.note, 0) / user.received_ratings.length
    : 0;

  // Get user roles
  const userRoles = user.roles?.map(role => role.name) || [];

  // Stats cards data
  const stats = [
    {
      title: "Points",
      value: user.points || 0,
      description: "Total points earned",
      icon: Trophy,
      color: "text-yellow-500"
    },
    {
      title: "Average Rating",
      value: averageRating.toFixed(1),
      description: `${user.received_ratings?.length || 0} reviews`,
      icon: Star,
      color: "text-amber-500"
    },
    {
      title: "Received Requests",
      value: user.demandes_recues?.length || 0,
      description: "Mentoring requests",
      icon: Download,
      color: "text-blue-500"
    },
    {
      title: "Sent Requests",
      value: user.demandes_envoyees?.length || 0,
      description: "Requests sent",
      icon: Upload,
      color: "text-green-500"
    }
  ];

  // Get initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Dynamic star rating component that respects theme
  const StarRating = ({ rating, size = 16 }) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className={`${i < rating
                ? "fill-current text-current opacity-100"
                : "text-muted-foreground opacity-40"
              }`}
          />
        ))}
      </div>
    );
  };

  // Chart components using REAL data
  const SubjectDistributionChart = () => {
    const subjects = user.info?.subjects || [];
    const totalSubjects = subjects.length;

    if (totalSubjects === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <BookOpen className="mx-auto h-8 w-8 mb-2 opacity-50" />
          No subjects added yet
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {subjects.map((subject, index) => {
          // Calculate percentage based on actual usage (for now using equal distribution)
          // In a real app, you might calculate based on number of requests per subject
          const percentage = (1 / totalSubjects) * 100;
          const colorClass = `bg-chart-${(index % 5) + 1}`;

          return (
            <div key={subject.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{subject.name}</span>
                <span className="text-muted-foreground">{Math.round(percentage)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${colorClass} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const RatingDistributionChart = () => {
    const ratings = user.received_ratings || [];
    const ratingCounts = [0, 0, 0, 0, 0]; // 1-5 stars

    ratings.forEach(rating => {
      if (rating.note >= 1 && rating.note <= 5) {
        ratingCounts[rating.note - 1]++;
      }
    });

    const maxCount = Math.max(...ratingCounts) || 1;

    return (
      <div className="space-y-2">
        {ratingCounts.map((count, index) => {
          const percentage = (count / maxCount) * 100;
          const stars = index + 1;

          return (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm text-foreground">{stars}</span>
                <StarRating rating={1} size={12} />
              </div>
              <div className="flex-1 bg-muted rounded-full h-3">
                <div
                  className="bg-chart-1 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const RequestStatusChart = () => {
    const requests = user.demandes_recues || [];
    const statusCounts = {
      pending: 0,
      accepted: 0,
      rejected: 0,
      completed: 0
    };

    requests.forEach(request => {
      if (statusCounts.hasOwnProperty(request.status)) {
        statusCounts[request.status]++;
      }
    });

    const totalRequests = requests.length;
    const statusColors = {
      pending: "bg-chart-2",
      accepted: "bg-chart-3",
      rejected: "bg-chart-4",
      completed: "bg-chart-5"
    };

    const statusIcons = {
      pending: Clock,
      accepted: CheckCircle,
      rejected: XCircle,
      completed: CheckCircle
    };

    if (totalRequests === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <BarChart3 className="mx-auto h-8 w-8 mb-2 opacity-50" />
          No requests to display
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {Object.entries(statusCounts).map(([status, count]) => {
          if (count === 0) return null;

          const percentage = (count / totalRequests) * 100;
          const colorClass = statusColors[status] || "bg-chart-1";
          const IconComponent = statusIcons[status] || BarChart3;

          return (
            <div key={status} className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground capitalize">{status}</span>
                </div>
                <span className="text-muted-foreground">
                  {count} ({Math.round(percentage)}%)
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${colorClass} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const MonthlyActivityChart = () => {
    // Calculate real monthly activity from user data
    const allRequests = [...(user.demandes_recues || []), ...(user.demandes_envoyees || [])];
    const allRatings = user.received_ratings || [];

    // Group by month
    const monthlyData = {};

    allRequests.forEach(request => {
      const date = new Date(request.created_at);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { requests: 0, ratings: 0 };
      }
      monthlyData[monthYear].requests++;
    });

    allRatings.forEach(rating => {
      const date = new Date(rating.created_at);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { requests: 0, ratings: 0 };
      }
      monthlyData[monthYear].ratings++;
    });

    // Convert to array and get last 6 months
    const monthlyArray = Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-6);

    const maxValue = monthlyArray.length > 0
      ? Math.max(...monthlyArray.map(d => Math.max(d.requests, d.ratings)))
      : 1;

    if (monthlyArray.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="mx-auto h-8 w-8 mb-2 opacity-50" />
          No activity data available
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex gap-1 justify-between">
          {monthlyArray.map((data, index) => {
            const requestHeight = (data.requests / maxValue) * 100;
            const ratingHeight = (data.ratings / maxValue) * 100;

            return (
              <div key={data.month} className="flex flex-col items-center flex-1 space-y-1">
                <div className="flex items-end gap-1 w-full justify-center" style={{ height: '80px' }}>
                  <div
                    className="w-3 bg-chart-1 rounded-t transition-all duration-500"
                    style={{ height: `${requestHeight}%` }}
                    title={`${data.requests} requests`}
                  />
                  <div
                    className="w-3 bg-chart-3 rounded-t transition-all duration-500"
                    style={{ height: `${ratingHeight}%` }}
                    title={`${data.ratings} ratings`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{data.month}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-chart-1 rounded"></div>
            <span className="text-muted-foreground">Requests</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-chart-3 rounded"></div>
            <span className="text-muted-foreground">Ratings</span>
          </div>
        </div>
      </div>
    );
  };
  const role = usePage().props.auth.roles[0];

  return ( 
    <DashboardLayout>
  {
    role == "mentor" ?
  
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="" />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex gap-2 mt-2">
              {userRoles.map(role => (
                <Badge key={role} variant="secondary" className="capitalize">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Member since {new Date(user.created_at).toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">{stat.title}</CardTitle>
                <IconComponent className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Distribution */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subject Distribution
            </CardTitle>
            <CardDescription>
              Your teaching subjects and expertise areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubjectDistributionChart />
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Star className="h-5 w-5" />
              Rating Distribution
            </CardTitle>
            <CardDescription>
              How students rated your mentoring sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RatingDistributionChart />
          </CardContent>
        </Card>

        {/* Request Status */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Request Status
            </CardTitle>
            <CardDescription>
              Breakdown of your mentoring requests by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RequestStatusChart />
          </CardContent>
        </Card>

        {/* Monthly Activity */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Activity
            </CardTitle>
            <CardDescription>
              Your mentoring activity over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyActivityChart />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Ratings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recent Ratings
            </CardTitle>
            <CardDescription>
              Feedback from your mentoring sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.received_ratings?.length > 0 ? (
              user.received_ratings.map((rating, index) => (
                <div key={rating.id} className="flex items-start gap-4 p-3 rounded-lg border border-border bg-card">
                  <div className="flex-shrink-0">
                    <StarRating rating={rating.note} />
                    <div className="text-sm font-medium mt-1 text-foreground">{rating.note}/5</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{rating.comment}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={rating.problem_resolved === "oui" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {rating.problem_resolved === "oui" ? "Resolved" : "Not resolved"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="mx-auto h-8 w-8 mb-2 opacity-50" />
                No ratings yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Download className="h-5 w-5" />
              Recent Requests
            </CardTitle>
            <CardDescription>
              Latest mentoring requests you've received
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.demandes_recues?.length > 0 ? (
              user.demandes_recues.map((request) => (
                <div key={request.id} className="p-3 rounded-lg border border-border bg-card space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-foreground">{request.subject}</h4>
                    <Badge
                      variant={
                        request.status === 'accepted' ? 'default' :
                          request.status === 'pending' ? 'secondary' : 'destructive'
                      }
                      className="capitalize"
                    >
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {request.description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="capitalize">{request.type}</span>
                    <span>{new Date(request.date_debut).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Download className="mx-auto h-8 w-8 mb-2 opacity-50" />
                No requests received yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Points Progress */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Points Progress
          </CardTitle>
          <CardDescription>
            Your current points and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">Current Points</span>
              <span className="font-medium text-foreground">{user.points} points</span>
            </div>
            <Progress value={(user.points / 100) * 100} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>Next level at 100 points</span>
              <span>100</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>  

            :  
            <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="rounded-full bg-muted p-3">
                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">Not a Mentor Yet</h2>
                    <p className="text-muted-foreground text-sm">
                      You need to meet the mentor requirements to access this dashboard.
                    </p>
                  </div>

                  <div className="w-full pt-2 space-y-3">
                 
                    <AlertDialogDemo/>
                  
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> }
    </DashboardLayout>

  );
}