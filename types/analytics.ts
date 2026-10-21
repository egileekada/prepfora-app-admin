export interface ActiveStudentsMetrics {
    daily_active: number;
    weekly_active: number;
    monthly_active: number;
}

export interface SignupsBreakdown {
    today: number;
    this_week: number;
    this_month: number;
    total: number;
}

export interface ExamBreakdown {
    total_taken: number;
    practices_taken: number;
    mocks_taken: number;
    taken_today: number;
    taken_this_week: number;
    taken_this_month: number;
    by_exam_type?: Record<string, number>;
}

export interface StudentActivityMetrics {
    total_activities_logged: number;
    total_questions_answered: number;
    total_questions_failed: number;
    total_questions_correct: number;
    accuracy_rate_percentage: number;
    average_exam_score: number;
    total_prep_points_awarded: number;
    total_badges_earned: number;
}

export interface DailyTrendPoint {
    date: string;
    signups: number;
    exams_taken: number;
}

export interface AdminAnalyticsResponse {
    total_students: number;
    active_students: ActiveStudentsMetrics;
    new_signups: SignupsBreakdown;
    exams_and_practices: ExamBreakdown;
    activity_metrics: StudentActivityMetrics;
    recent_trends_7d?: DailyTrendPoint[];
}
