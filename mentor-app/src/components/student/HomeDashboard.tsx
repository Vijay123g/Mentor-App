import React, { useEffect, useState } from 'react';
import registrationService from '../../services/registrationService';
import { Typography, Card, CardContent, Grid } from '@mui/material';

interface Registration {
    registration_id: number;
    student_id: number;
    course_id: number;
    title: string;
    validation_status: number; 
}

interface DashboardData {
    registeredCourses: number;
    totalExamsPassed: number;
    pendingResults: number;
}

const HomeDashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        registeredCourses: 0,
        totalExamsPassed: 0,
        pendingResults: 0,
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const studentId = localStorage.getItem('userId') || '';
                const response = await registrationService.getDetailedRegistrationsByStudent(studentId);
                const registrations: Registration[] = response.registrations; 

                const courseIds = new Set<number>();
                let passedCount = 0;
                let pendingCount = 0;

                registrations.forEach((registration) => {
                    courseIds.add(registration.course_id); 
                    if (registration.validation_status === 1) {
                        passedCount++;
                    } else if (registration.validation_status === 0) {
                        pendingCount++;
                    }
                });

                setDashboardData({
                    registeredCourses: courseIds.size, 
                    totalExamsPassed: passedCount,
                    pendingResults: pendingCount,
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div style={{ paddingTop: '50px' }}>
            <Typography variant="h4" gutterBottom>Home Dashboard</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Courses Registered</Typography>
                            <Typography variant="h4" color="primary">{dashboardData.registeredCourses}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Exams Passed</Typography>
                            <Typography variant="h4" color="primary">{dashboardData.totalExamsPassed}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Pending Results</Typography>
                            <Typography variant="h4" color="primary">{dashboardData.pendingResults}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default HomeDashboard;
    