import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, GraduationCap, User, BookOpen, Search, X, Sparkles, Check } from 'lucide-react';

export default function CompleteInfo() {
  const [formData, setFormData] = useState({
    niveau_etude: '',
    bio: '',
    selectedSubjects: []
  });
  
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSubjects, setIsFetchingSubjects] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Fetch subjects from API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsFetchingSubjects(true);
        const response = await fetch('http://127.0.0.1:8000/api/subjects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }
        
        const data = await response.json();
        setSubjects(data);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to load subjects. Please try again.');
      } finally {
        setIsFetchingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSubject = (subject) => {
    setFormData(prev => {
      const isSelected = prev.selectedSubjects.some(s => s.id === subject.id);
      if (isSelected) {
        return {
          ...prev,
          selectedSubjects: prev.selectedSubjects.filter(s => s.id !== subject.id)
        };
      } else {
        return {
          ...prev,
          selectedSubjects: [...prev.selectedSubjects, subject]
        };
      }
    });
  };

  const removeSubject = (subjectId) => {
    setFormData(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.filter(s => s.id !== subjectId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Prepare data for submission
    const submissionData = {
      niveau_etude: formData.niveau_etude,
      bio: formData.bio,
      subjects: formData.selectedSubjects.map(subject => subject.id)
    };

    // Submit using Inertia.js
    router.post('/complete-info', submissionData, {
      onFinish: () => setIsLoading(false),
      onSuccess: () => {
        console.log('Profile updated successfully');
      },
      onError: (errors) => {
        console.error('Error updating profile:', errors);
        setError('Failed to save profile. Please try again.');
      }
    });
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const educationLevels = [
    'High School',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'Self-Taught',
    'Bootcamp Graduate',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center gap-3 mb-4 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Complete Your Profile</span>
          </div> */}
          <h1 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Welcome to MentorLink
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Complete your profile to get matched with the perfect mentors and learning opportunities in the tech world.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              <p className="text-destructive text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Basic Info */}
            <div className="space-y-8">
              {/* Education Level Card */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    Education Level
                  </CardTitle>
                  <CardDescription className="text-base">
                    Tell us about your academic background
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label htmlFor="niveau_etude" className="text-sm font-semibold">Select your highest education level</Label>
                    <select
                      id="niveau_etude"
                      value={formData.niveau_etude}
                      onChange={(e) => handleInputChange('niveau_etude', e.target.value)}
                      className="w-full p-3 border-2 border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      required
                    >
                      <option value="" className="text-muted-foreground">Choose an option</option>
                      {educationLevels.map(level => (
                        <option key={level} value={level} className="text-foreground">
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Bio Card */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <User className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    About You
                  </CardTitle>
                  <CardDescription className="text-base">
                    Share your story, interests, and goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label htmlFor="bio" className="text-sm font-semibold">Personal Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="I'm a passionate developer interested in web technologies, machine learning, and open source contributions. I love solving complex problems and learning new technologies..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={6}
                      className="min-h-[140px] resize-vertical border-2 border-border focus:border-primary transition-all duration-200 rounded-xl"
                      maxLength={500}
                      required
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {formData.bio.length}/500 characters
                      </p>
                      {formData.bio.length > 100 && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Check className="w-3 h-3" />
                          Good length
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Subjects */}
            <div className="space-y-8">
              {/* Subjects Card */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <BookOpen className="w-6 h-6 text-accent-foreground" />
                    </div>
                    Areas of Interest
                  </CardTitle>
                  <CardDescription className="text-base">
                    Select subjects you're passionate about or want to learn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Search */}
                    <div className="space-y-3">
                      <Label htmlFor="subject-search" className="flex items-center gap-2 text-sm font-semibold">
                        <Search className="w-4 h-4" />
                        Search Subjects
                      </Label>
                      <div className="relative">
                        <Input
                          id="subject-search"
                          type="text"
                          placeholder="Type to search subjects..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 border-2 border-border focus:border-primary transition-all duration-200 rounded-xl"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Selected Subjects */}
                    {formData.selectedSubjects.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">
                          Selected Subjects 
                          <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                            {formData.selectedSubjects.length}
                          </span>
                        </Label>
                        <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-xl border border-border/50">
                          {formData.selectedSubjects.map(subject => (
                            <Badge
                              key={subject.id}
                              variant="secondary"
                              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 group"
                              onClick={() => removeSubject(subject.id)}
                            >
                              <span className="font-medium">{subject.name}</span>
                              <X className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Subjects Grid */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">
                        Available Subjects
                        <span className="ml-2 text-muted-foreground font-normal">
                          ({filteredSubjects.length} found)
                        </span>
                      </Label>
                      
                      {isFetchingSubjects ? (
                        <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-xl border border-border/50">
                          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                          <span className="text-muted-foreground font-medium">Loading subjects...</span>
                          <p className="text-sm text-muted-foreground mt-1">Fetching from our database</p>
                        </div>
                      ) : (
                        <div className="max-h-96 overflow-y-auto space-y-3 p-2 bg-muted/10 rounded-xl border border-border/50">
                          {filteredSubjects.map(subject => {
                            const isSelected = formData.selectedSubjects.some(s => s.id === subject.id);
                            return (
                              <div
                                key={subject.id}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group ${
                                  isSelected
                                    ? 'bg-primary border-primary shadow-lg scale-[1.02]'
                                    : 'bg-card border-border hover:border-primary/50 hover:shadow-md hover:scale-[1.01]'
                                }`}
                                onClick={() => toggleSubject(subject)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className={`font-semibold mb-1 flex items-center gap-2 ${
                                      isSelected ? 'text-primary-foreground' : 'text-foreground'
                                    }`}>
                                      {subject.name}
                                      {isSelected && (
                                        <Check className="w-4 h-4 text-primary-foreground" />
                                      )}
                                    </div>
                                    <div className={`text-sm leading-relaxed ${
                                      isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
                                    }`}>
                                      {subject.description}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {!isFetchingSubjects && filteredSubjects.length === 0 && (
                        <div className="text-center py-12 bg-muted/10 rounded-xl border border-border/50">
                          <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                          <p className="text-muted-foreground font-medium">
                            {searchTerm ? 'No subjects found matching your search.' : 'No subjects available.'}
                          </p>
                          {searchTerm && (
                            <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Card */}
              <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm shadow-lg">
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    className="w-full py-6 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                    disabled={isLoading || !formData.niveau_etude || !formData.bio || formData.selectedSubjects.length === 0}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Saving Your Profile...
                      </>
                    ) : (
                      <>
                        {/* <Sparkles className="w-5 h-5 mr-3" /> */}
                        Complete Profile & Continue
                      </>
                    )}
                  </Button>
                  
                  {(!formData.niveau_etude || !formData.bio || formData.selectedSubjects.length === 0) && (
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                      <p className="text-sm text-muted-foreground text-center font-medium">
                        ⚡ Complete all sections to continue
                      </p>
                      <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className={formData.niveau_etude ? 'text-green-600' : ''}>
                          • Education {formData.niveau_etude ? '✓' : ''}
                        </span>
                        <span className={formData.bio ? 'text-green-600' : ''}>
                          • Bio {formData.bio ? '✓' : ''}
                        </span>
                        <span className={formData.selectedSubjects.length > 0 ? 'text-green-600' : ''}>
                          • Subjects {formData.selectedSubjects.length > 0 ? '✓' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>

        
      </div>
    </div>
  );
}