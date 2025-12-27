import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '../Layouts/DashboardLayout';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    FileText,
    Calendar,
    Filter,
    Grid,
    List,
    Eye,
    File
} from 'lucide-react';

export default function Index({ courses }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState('grid');

    // Filter and sort courses
    const filteredCourses = courses
        .filter(course =>
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.size_mb.toString().includes(searchTerm)
        )
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'size') return b.size_mb - a.size_mb;
            return 0;
        });

    const formatSize = (size) => {
        if (size < 1) return `${(size * 1024).toFixed(0)} KB`;
        return `${size.toFixed(1)} MB`;
    };

    const getFileTypeColor = (filename) => {
        if (filename.endsWith('.pdf')) return 'destructive';
        if (filename.endsWith('.docx') || filename.endsWith('.doc')) return 'primary';
        if (filename.endsWith('.pptx') || filename.endsWith('.ppt')) return 'secondary';
        if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) return 'success';
        return 'default';
    };

    const getFileTypeIcon = (filename) => {
        if (filename.endsWith('.pdf')) return <FileText className="h-4 w-4" />;
        return <File className="h-4 w-4" />;
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto p-4 md:p-6">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Course Library</h1>
                    <p className="text-muted-foreground">
                        Browse through {courses.length} available courses and learning materials
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                            <div className="flex-1 flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Search courses by name or size..."
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="name">Sort by Name</SelectItem>
                                        <SelectItem value="size">Sort by Size</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Summary */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {filteredCourses.length} of {courses.length} courses
                        {searchTerm && ` for "${searchTerm}"`}
                    </p>
                    <Badge variant="outline" className="px-3 py-1">
                        <Filter className="h-3 w-3 mr-1" />
                        Sorted by {sortBy}
                    </Badge>
                </div>

                {filteredCourses.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm
                                    ? `No courses match "${searchTerm}". Try a different search term.`
                                    : "No courses available in the library."}
                            </p>
                            {searchTerm && (
                                <Button variant="outline" onClick={() => setSearchTerm('')}>
                                    Clear search
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : viewMode === 'grid' ? (
                    // Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredCourses.map((course) => (
                            <Card
                                key={course.name}
                                className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] overflow-hidden"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge
                                            variant={getFileTypeColor(course.name)}
                                            className="mb-2"
                                        >
                                            {getFileTypeIcon(course.name)}
                                            <span className="ml-1">
                                                {course.name.split('.').pop().toUpperCase()}
                                            </span>
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {formatSize(course.size_mb)}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                        {course.name.replace('.pdf', '').replace(/_/g, ' ')}
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Last updated: {new Date().toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pb-3">
                                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        <span>Added recently</span>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-0">
                                    <Button asChild className="w-full group/btn">
                                        <Link
                                            href={`/courses/view/${encodeURIComponent(course.name)}`}
                                        >
                                            <Eye className="h-4 w-4 mr-2 group-hover/btn:animate-pulse" />
                                            View Course
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    // List View
                    <div className="space-y-3">
                        {filteredCourses.map((course) => (
                            <Card key={course.name} className="hover:bg-accent/50 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                {getFileTypeIcon(course.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold truncate">
                                                    {course.name.replace('.pdf', '').replace(/_/g, ' ')}
                                                </h3>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <Badge variant="outline" size="sm">
                                                        {course.name.split('.').pop().toUpperCase()}
                                                    </Badge>
                                                    <span>•</span>
                                                    <span>{formatSize(course.size_mb)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button asChild variant="ghost" size="sm">
                                            <Link
                                                href={`/courses/view/${encodeURIComponent(course.name)}`}
                                                className="whitespace-nowrap"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Quick Stats */}
                {filteredCourses.length > 0 && (
                    <>
                        <Separator className="my-8" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{courses.length}</p>
                                        <p className="text-sm text-muted-foreground">Total Courses</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">
                                            {Math.round(courses.reduce((acc, c) => acc + c.size_mb, 0))} MB
                                        </p>
                                        <p className="text-sm text-muted-foreground">Total Size</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">
                                            {courses.filter(c => c.name.endsWith('.pdf')).length}
                                        </p>
                                        <p className="text-sm text-muted-foreground">PDF Files</p>
                                    </div>
                                </CardContent>
                            </Card>
                            {/* <Card> */}
                                    {/* <CardContent className="pt-6">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold">
                                                {new Date().getFullYear()}
                                            </p>
                                            <p className="text-sm text-muted-foreground">Current Year</p>
                                        </div>
                                    </CardContent> */}
                            {/* </Card> */}
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}